import Link from "next/link";
import {
  FileDown,
  MessageSquare,
  ScanSearch,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FREE_TIER_LIMITS, type UsageEventType } from "@/lib/billing/limits";
import { getSubscriptionStatusForUser } from "@/lib/billing/entitlements";
import {
  formatMoney,
  formatTransactionStatus,
  getTransactionsForUser,
} from "@/lib/billing/transactions";
import { getUsageForUser } from "@/lib/billing/usage";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

const USAGE_CARDS: {
  key: UsageEventType;
  title: string;
  description: string;
  icon: typeof MessageSquare;
}[] = [
  {
    key: "ai_chat",
    title: "AI chat",
    description: "Resume writing & rewrite messages",
    icon: MessageSquare,
  },
  {
    key: "ats_check",
    title: "ATS checks",
    description: "Job-description keyword matching",
    icon: ScanSearch,
  },
  {
    key: "resume_score",
    title: "Resume score",
    description: "Formatting & structure reviews",
    icon: Sparkles,
  },
  {
    key: "pdf_download",
    title: "PDF downloads",
    description: "Exported resume PDFs",
    icon: FileDown,
  },
];

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [status, usageSnapshot, transactions] = await Promise.all([
    getSubscriptionStatusForUser(user.id),
    getUsageForUser(user.id),
    getTransactionsForUser(user.id),
  ]);

  const { isPro } = status;
  const usage = usageSnapshot.usage;

  return (
    <div className="mx-auto max-w-4xl p-6 sm:p-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Usage & Billing</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          <span
            className={cn(
              "mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
              isPro
                ? "bg-emerald-100 text-emerald-800"
                : "bg-blue-100 text-blue-800",
            )}
          >
            {isPro ? "Pro plan" : "Free plan"}
          </span>
        </div>
        {isPro ? (
          <a href="/api/billing/portal">
            <Button variant="outline" size="sm">
              Manage billing
            </Button>
          </a>
        ) : (
          <Link href="/dashboard/upgrade">
            <Button size="sm">Upgrade to Pro</Button>
          </Link>
        )}
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-semibold">Usage this month</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isPro
            ? "Pro includes unlimited usage of these features."
            : "Free limits reset on the 1st of each month."}
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {USAGE_CARDS.map((card) => {
            const Icon = card.icon;
            const { used, limit } = usage[card.key];
            const remainingPct = isPro
              ? 100
              : Math.max(0, Math.round(((limit - used) / limit) * 100));
            const usedPct = isPro
              ? 0
              : Math.min(100, Math.round((used / limit) * 100));

            return (
              <div
                key={card.key}
                className="rounded-xl border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-medium">{card.title}</p>
                      <p className="text-sm tabular-nums text-muted-foreground">
                        {isPro ? "Unlimited" : `${used} / ${limit}`}
                      </p>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {card.description}
                    </p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          isPro
                            ? "w-full bg-emerald-500"
                            : usedPct >= 100
                              ? "bg-red-500"
                              : usedPct >= 70
                                ? "bg-amber-500"
                                : "bg-blue-600",
                        )}
                        style={{ width: isPro ? "100%" : `${usedPct}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      {isPro
                        ? "Included with Pro"
                        : `${remainingPct}% remaining`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!isPro ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-blue-950">Need more?</p>
              <p className="text-xs text-blue-800">
                Upgrade to Pro for unlimited AI chat, ATS checks, scores, and PDF
                downloads.
              </p>
            </div>
            <Link href="/dashboard/upgrade">
              <Button size="sm">Upgrade now</Button>
            </Link>
          </div>
        ) : null}
      </section>

      <section className="mb-10 rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Billing</h2>
        {isPro ? (
          <div className="mt-3 space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Plan:</span>{" "}
              <span className="font-medium">ResumePilot Pro</span>
            </p>
            <p>
              <span className="text-muted-foreground">Status:</span>{" "}
              <span className="font-medium capitalize">
                {status.status ?? "active"}
              </span>
            </p>
            {status.currentPeriodEnd ? (
              <p>
                <span className="text-muted-foreground">
                  {status.cancelAtPeriodEnd ? "Ends" : "Renews"}:
                </span>{" "}
                <span className="font-medium">
                  {new Date(status.currentPeriodEnd).toLocaleDateString()}
                </span>
              </p>
            ) : null}
            <a
              href="/api/billing/portal"
              className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Open customer portal →
            </a>
          </div>
        ) : (
          <div className="mt-3 space-y-3 text-sm">
            <p className="text-muted-foreground">
              You&apos;re on the free plan (
              {FREE_TIER_LIMITS.ai_chat} AI chats, {FREE_TIER_LIMITS.ats_check}{" "}
              ATS checks, {FREE_TIER_LIMITS.resume_score} scores,{" "}
              {FREE_TIER_LIMITS.pdf_download} PDFs per month).
            </p>
            <Link href="/dashboard/upgrade">
              <Button size="sm">View Pro plans</Button>
            </Link>
          </div>
        )}
      </section>

      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <p className="text-xs text-muted-foreground">
            Payments, failures, and refunds
          </p>
        </div>

        {transactions.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No transactions yet. When you subscribe or renew, charges will show
            up here.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="pb-2 pr-3 font-medium">Date</th>
                  <th className="pb-2 pr-3 font-medium">Amount</th>
                  <th className="pb-2 pr-3 font-medium">Status</th>
                  <th className="pb-2 pr-3 font-medium">Method</th>
                  <th className="pb-2 font-medium">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const badge = formatTransactionStatus(tx.status);
                  return (
                    <tr
                      key={tx.dodoPaymentId}
                      className="border-b last:border-0"
                    >
                      <td className="py-3 pr-3 tabular-nums text-muted-foreground">
                        {new Date(tx.paidAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 pr-3 font-medium tabular-nums">
                        {formatMoney(tx.amountCents, tx.currency)}
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
                            badge.className,
                          )}
                        >
                          {badge.label}
                        </span>
                        {tx.errorMessage ? (
                          <p className="mt-1 max-w-[14rem] truncate text-[11px] text-red-600">
                            {tx.errorMessage}
                          </p>
                        ) : null}
                      </td>
                      <td className="py-3 pr-3 capitalize text-muted-foreground">
                        {tx.paymentMethod?.replace(/_/g, " ") ?? "—"}
                      </td>
                      <td className="py-3">
                        {tx.invoiceUrl ? (
                          <a
                            href={tx.invoiceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-blue-600 hover:text-blue-700"
                          >
                            PDF
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
