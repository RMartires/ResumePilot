import { createAdminClient } from "@/lib/supabase/admin";
import {
  ensureProfile,
  setUserPlanTier,
} from "@/lib/billing/entitlements";

type Metadata = Record<string, unknown>;

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return null;
}

function readMetadata(payload: { metadata?: Metadata }): Metadata {
  return payload.metadata ?? {};
}

function readUserId(payload: { metadata?: Metadata }): string | null {
  const metadata = readMetadata(payload);
  return asString(metadata.supabase_user_id);
}

function readReferralCode(payload: { metadata?: Metadata }): string | null {
  const metadata = readMetadata(payload);
  return asString(metadata.referral_code);
}

function readCustomerId(payload: {
  customer?: { customer_id?: string };
}): string | null {
  return asString(payload.customer?.customer_id);
}

export async function recordBillingEvent(
  eventId: string,
  eventType: string,
  payload: unknown,
): Promise<boolean> {
  const admin = createAdminClient();
  const { error } = await admin.from("billing_events").insert({
    dodo_event_id: eventId,
    event_type: eventType,
    payload: payload as Record<string, unknown>,
  });

  if (error?.code === "23505") {
    return false;
  }

  if (error) {
    throw new Error(`Failed to record billing event: ${error.message}`);
  }

  return true;
}

export async function persistReferralOnProfile(
  userId: string,
  referralCode: string,
): Promise<void> {
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("referral_code")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.referral_code) {
    return;
  }

  const { data: partner } = await admin
    .from("referral_partners")
    .select("code")
    .eq("code", referralCode)
    .eq("is_active", true)
    .maybeSingle();

  if (!partner) {
    return;
  }

  await admin
    .from("profiles")
    .update({ referral_code: referralCode })
    .eq("id", userId);
}

export async function syncSubscriptionFromWebhook(payload: {
  subscription_id?: string;
  customer?: { customer_id?: string; email?: string };
  product_id?: string;
  status?: string;
  next_billing_date?: string | Date | null;
  current_period_end?: string | Date | null;
  cancel_at_next_billing_date?: boolean;
  cancel_at_period_end?: boolean;
  metadata?: Metadata;
}): Promise<string | null> {
  const userId = readUserId(payload);
  const subscriptionId = asString(payload.subscription_id);
  if (!userId || !subscriptionId) {
    return userId;
  }

  const admin = createAdminClient();
  await ensureProfile(userId, payload.customer?.email);

  const dodoCustomerId = readCustomerId(payload);
  if (dodoCustomerId) {
    await admin
      .from("profiles")
      .update({ dodo_customer_id: dodoCustomerId })
      .eq("id", userId);
  }

  const periodSource =
    payload.current_period_end ?? payload.next_billing_date ?? null;
  const periodEnd =
    periodSource instanceof Date
      ? periodSource.toISOString()
      : asString(periodSource);

  const cancelAtPeriodEnd = Boolean(
    payload.cancel_at_period_end ?? payload.cancel_at_next_billing_date,
  );

  const { error } = await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      dodo_subscription_id: subscriptionId,
      dodo_customer_id: dodoCustomerId,
      product_id: asString(payload.product_id),
      status: asString(payload.status) ?? "pending",
      current_period_end: periodEnd,
      cancel_at_period_end: cancelAtPeriodEnd,
      metadata: readMetadata(payload),
    },
    { onConflict: "dodo_subscription_id" },
  );

  if (error) {
    throw new Error(`Failed to sync subscription: ${error.message}`);
  }

  return userId;
}

export async function grantProFromPayment(payload: {
  payment_id?: string | null;
  subscription_id?: string | null;
  total_amount?: number | null;
  currency?: string | null;
  customer?: { customer_id?: string; email?: string };
  metadata?: Metadata;
}): Promise<void> {
  const userId = readUserId(payload);
  if (!userId) {
    return;
  }

  await ensureProfile(userId, payload.customer?.email);

  const dodoCustomerId = readCustomerId(payload);
  if (dodoCustomerId) {
    const admin = createAdminClient();
    await admin
      .from("profiles")
      .update({ dodo_customer_id: dodoCustomerId })
      .eq("id", userId);
  }

  await setUserPlanTier(userId, "pro");
  await recordReferralConversion(payload, userId);
}

async function recordReferralConversion(
  payload: {
    payment_id?: string | null;
    subscription_id?: string | null;
    total_amount?: number | null;
    currency?: string | null;
    metadata?: Metadata;
  },
  userId: string,
): Promise<void> {
  const admin = createAdminClient();
  const paymentId = asString(payload.payment_id);
  if (!paymentId) {
    return;
  }

  let partnerCode = readReferralCode(payload);
  if (!partnerCode) {
    const { data: profile } = await admin
      .from("profiles")
      .select("referral_code")
      .eq("id", userId)
      .maybeSingle();
    partnerCode = profile?.referral_code ?? null;
  }

  if (!partnerCode) {
    return;
  }

  const { data: partner } = await admin
    .from("referral_partners")
    .select("code, commission_pct")
    .eq("code", partnerCode)
    .eq("is_active", true)
    .maybeSingle();

  if (!partner) {
    return;
  }

  const amountCents = Math.max(0, Math.round(Number(payload.total_amount ?? 0)));
  const commissionPct = Number(partner.commission_pct ?? 0);
  const commissionCents = Math.round((amountCents * commissionPct) / 100);

  const { error } = await admin.from("referral_conversions").upsert(
    {
      partner_code: partner.code,
      user_id: userId,
      dodo_payment_id: paymentId,
      dodo_subscription_id: asString(payload.subscription_id),
      amount_cents: amountCents,
      currency: asString(payload.currency) ?? "USD",
      commission_cents: commissionCents,
      status: "pending",
    },
    { onConflict: "dodo_payment_id", ignoreDuplicates: true },
  );

  if (error && error.code !== "23505") {
    throw new Error(`Failed to record referral conversion: ${error.message}`);
  }
}

export async function revokeProAccess(userId: string): Promise<void> {
  await setUserPlanTier(userId, "free");
}

export async function markReferralConversionCancelled(
  paymentId: string,
): Promise<void> {
  const admin = createAdminClient();
  await admin
    .from("referral_conversions")
    .update({ status: "cancelled" })
    .eq("dodo_payment_id", paymentId);
}

export { readReferralCode, readUserId };
