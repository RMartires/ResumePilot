"use client";

import { useState } from "react";
import { PricingCheckoutButton } from "@/components/billing/PricingCheckoutButton";
import { BILLING_PLANS, PRO_PRICING, type BillingPlan } from "@/lib/billing/plans";
import { cn } from "@/lib/utils";

export const PRO_FEATURES = [
  "Unlimited AI resume chat",
  "PDF import with AI structuring",
  "Unlimited ATS checks & resume scores",
  "Unlimited PDF downloads",
  "Job-description tailoring",
  "UPI, cards, and global payment methods",
] as const;

type ProPricingCardProps = {
  /** marketing = dark landing styles; dashboard = light app styles */
  variant?: "marketing" | "dashboard";
};

export function ProPricingCard({ variant = "marketing" }: ProPricingCardProps) {
  const [billingCycle, setBillingCycle] = useState<BillingPlan>("monthly");
  const plan = BILLING_PLANS[billingCycle];
  const isAnnual = billingCycle === "annual";
  const isDashboard = variant === "dashboard";

  return (
    <section
      className={cn(
        "rounded-2xl border p-6 sm:p-8",
        isDashboard
          ? "border-blue-200 bg-blue-50/60"
          : "border-blue-500/30 bg-gradient-to-b from-blue-600/15 to-blue-700/5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            "text-sm font-medium",
            isDashboard ? "text-blue-700" : "text-blue-300",
          )}
        >
          Pro
        </p>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
            isDashboard
              ? "bg-red-100 text-red-700"
              : "bg-red-500/15 text-red-300",
          )}
        >
          Most popular
        </span>
      </div>

      <div
        className={cn(
          "mt-4 inline-flex rounded-full border p-1",
          isDashboard
            ? "border-border bg-background"
            : "border-white/10 bg-black/20",
        )}
      >
        <button
          type="button"
          onClick={() => setBillingCycle("monthly")}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium transition",
            billingCycle === "monthly"
              ? isDashboard
                ? "bg-foreground text-background"
                : "bg-white text-zinc-900"
              : isDashboard
                ? "text-muted-foreground hover:text-foreground"
                : "text-zinc-300 hover:text-white",
          )}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setBillingCycle("annual")}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium transition",
            billingCycle === "annual"
              ? isDashboard
                ? "bg-foreground text-background"
                : "bg-white text-zinc-900"
              : isDashboard
                ? "text-muted-foreground hover:text-foreground"
                : "text-zinc-300 hover:text-white",
          )}
        >
          Yearly
        </button>
      </div>

      <p
        className={cn(
          "mt-5 text-4xl font-bold tracking-tight",
          isDashboard ? "text-foreground" : "text-white",
        )}
      >
        {isAnnual ? PRO_PRICING.annual.display : PRO_PRICING.monthly.display}
        <span
          className={cn(
            "text-lg font-medium",
            isDashboard ? "text-muted-foreground" : "text-zinc-400",
          )}
        >
          {isAnnual ? PRO_PRICING.annual.suffix : PRO_PRICING.monthly.suffix}
        </span>
      </p>
      <p
        className={cn(
          "mt-1 text-sm",
          isDashboard ? "text-emerald-700" : "text-emerald-300",
        )}
      >
        {isAnnual
          ? plan.priceNote
          : `${PRO_PRICING.monthly.taxNote} · billed monthly`}
      </p>
      {isAnnual ? (
        <p
          className={cn(
            "mt-1 text-xs",
            isDashboard ? "text-muted-foreground" : "text-zinc-500",
          )}
        >
          {BILLING_PLANS.annual.billedLabel}
        </p>
      ) : null}

      <ul
        className={cn(
          "mt-6 space-y-3 text-sm",
          isDashboard ? "text-foreground/90" : "text-zinc-200",
        )}
      >
        {PRO_FEATURES.map((feature) => (
          <li key={feature} className="flex gap-2">
            <span className={isDashboard ? "text-blue-600" : "text-blue-300"}>
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <PricingCheckoutButton
          key={billingCycle}
          plan={billingCycle}
          label={
            isAnnual ? "Upgrade to Pro — yearly" : "Upgrade to Pro — monthly"
          }
          variant={isDashboard ? "dashboard" : "primary"}
        />
      </div>

      <p
        className={cn(
          "mt-4 text-xs leading-5",
          isDashboard ? "text-muted-foreground" : "text-zinc-500",
        )}
      >
        Final price and tax are calculated at checkout. Pause or cancel anytime
        from the customer portal.
      </p>
    </section>
  );
}
