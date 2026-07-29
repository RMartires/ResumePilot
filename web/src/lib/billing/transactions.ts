import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getDodoClient, isDodoConfigured } from "@/lib/billing/dodo";

export type BillingTransactionStatus =
  | "succeeded"
  | "failed"
  | "cancelled"
  | "processing"
  | "refunded"
  | "partially_refunded"
  | string;

export type BillingTransaction = {
  id: string;
  dodoPaymentId: string;
  status: BillingTransactionStatus;
  amountCents: number;
  currency: string;
  paymentMethod: string | null;
  invoiceUrl: string | null;
  errorMessage: string | null;
  paidAt: string;
};

type Metadata = Record<string, unknown>;

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return null;
}

function normalizeStatus(
  status: string | null | undefined,
  refundStatus?: string | null,
): string {
  if (refundStatus === "full") return "refunded";
  if (refundStatus === "partial") return "partially_refunded";
  return status ?? "processing";
}

async function resolveUserId(payload: {
  metadata?: Metadata;
  customer?: { customer_id?: string };
}): Promise<string | null> {
  const fromMeta = asString(payload.metadata?.supabase_user_id);
  if (fromMeta) {
    return fromMeta;
  }

  const customerId = asString(payload.customer?.customer_id);
  if (!customerId) {
    return null;
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id")
    .eq("dodo_customer_id", customerId)
    .maybeSingle();

  return data?.id ?? null;
}

export async function upsertBillingTransaction(payload: {
  payment_id?: string | null;
  subscription_id?: string | null;
  total_amount?: number | null;
  currency?: string | null;
  status?: string | null;
  payment_method?: string | null;
  payment_method_type?: string | null;
  invoice_url?: string | null;
  error_message?: string | null;
  created_at?: string | Date | null;
  refund_status?: string | null;
  customer?: { customer_id?: string };
  metadata?: Metadata;
}): Promise<void> {
  const paymentId = asString(payload.payment_id);
  if (!paymentId) {
    return;
  }

  const userId = await resolveUserId(payload);
  if (!userId) {
    return;
  }

  const admin = createAdminClient();

  // Preserve amount/currency on status-only updates (e.g. refunds).
  const { data: existing } = await admin
    .from("billing_transactions")
    .select("amount_cents, currency, payment_method, invoice_url, paid_at")
    .eq("dodo_payment_id", paymentId)
    .maybeSingle();

  const paidAt =
    payload.created_at instanceof Date
      ? payload.created_at.toISOString()
      : typeof payload.created_at === "string"
        ? payload.created_at
        : (existing?.paid_at ?? new Date().toISOString());

  const amountFromPayload =
    payload.total_amount === null || payload.total_amount === undefined
      ? null
      : Math.max(0, Math.round(Number(payload.total_amount)));

  const { error } = await admin.from("billing_transactions").upsert(
    {
      user_id: userId,
      dodo_payment_id: paymentId,
      dodo_subscription_id: asString(payload.subscription_id),
      status: normalizeStatus(payload.status, payload.refund_status),
      amount_cents: amountFromPayload ?? existing?.amount_cents ?? 0,
      currency: (
        asString(payload.currency) ??
        existing?.currency ??
        "INR"
      ).toUpperCase(),
      payment_method:
        asString(payload.payment_method_type) ??
        asString(payload.payment_method) ??
        existing?.payment_method ??
        null,
      invoice_url:
        asString(payload.invoice_url) ?? existing?.invoice_url ?? null,
      error_message: asString(payload.error_message),
      paid_at: paidAt,
    },
    { onConflict: "dodo_payment_id" },
  );

  if (error) {
    throw new Error(`Failed to upsert billing transaction: ${error.message}`);
  }
}

function mapDodoPayment(item: {
  payment_id: string;
  status?: string | null;
  total_amount: number;
  currency: string;
  payment_method?: string | null;
  payment_method_type?: string | null;
  invoice_url?: string | null;
  refund_status?: string | null;
  created_at: string;
}): BillingTransaction {
  return {
    id: item.payment_id,
    dodoPaymentId: item.payment_id,
    status: normalizeStatus(item.status, item.refund_status),
    amountCents: item.total_amount,
    currency: item.currency,
    paymentMethod: item.payment_method_type ?? item.payment_method ?? null,
    invoiceUrl: item.invoice_url ?? null,
    errorMessage: null,
    paidAt: item.created_at,
  };
}

/** Prefer Dodo live list when customer id exists; fall back to local rows. */
export async function getTransactionsForUser(
  userId: string,
): Promise<BillingTransaction[]> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("dodo_customer_id")
    .eq("id", userId)
    .maybeSingle();

  const customerId = profile?.dodo_customer_id;

  if (customerId && isDodoConfigured()) {
    try {
      const client = getDodoClient();
      const page = await client.payments.list({
        customer_id: customerId,
        page_size: 50,
      });
      const list = page.getPaginatedItems();

      if (list.length > 0) {
        return list
          .map(mapDodoPayment)
          .sort(
            (a, b) =>
              new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime(),
          );
      }
    } catch (error) {
      console.error("[billing-transactions] Dodo list failed", error);
    }
  }

  const { data } = await supabase
    .from("billing_transactions")
    .select(
      "id, dodo_payment_id, status, amount_cents, currency, payment_method, invoice_url, error_message, paid_at",
    )
    .eq("user_id", userId)
    .order("paid_at", { ascending: false })
    .limit(50);

  return (data ?? []).map((row) => ({
    id: row.id,
    dodoPaymentId: row.dodo_payment_id,
    status: row.status,
    amountCents: row.amount_cents,
    currency: row.currency,
    paymentMethod: row.payment_method,
    invoiceUrl: row.invoice_url,
    errorMessage: row.error_message,
    paidAt: row.paid_at,
  }));
}

export function formatMoney(amountCents: number, currency: string): string {
  const code = currency.toUpperCase();
  // Dodo amounts are in the currency's smallest unit (paise for INR, cents for USD).
  const amount = amountCents / 100;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${code} ${amount.toFixed(2)}`;
  }
}

export function formatTransactionStatus(status: string): {
  label: string;
  className: string;
} {
  switch (status) {
    case "succeeded":
      return {
        label: "Succeeded",
        className: "bg-emerald-100 text-emerald-800",
      };
    case "failed":
      return { label: "Failed", className: "bg-red-100 text-red-800" };
    case "cancelled":
      return { label: "Cancelled", className: "bg-zinc-100 text-zinc-700" };
    case "refunded":
    case "partially_refunded":
      return {
        label: status === "refunded" ? "Refunded" : "Partially refunded",
        className: "bg-amber-100 text-amber-800",
      };
    case "processing":
    case "requires_customer_action":
    case "requires_payment_method":
      return {
        label: "Processing",
        className: "bg-blue-100 text-blue-800",
      };
    default:
      return {
        label: status.replace(/_/g, " "),
        className: "bg-muted text-muted-foreground",
      };
  }
}
