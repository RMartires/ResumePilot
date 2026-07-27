"use client";

import { useState } from "react";
import { PricingCheckoutButton } from "@/components/billing/PricingCheckoutButton";
import { BILLING_PLANS, PRO_PRICING, type BillingPlan } from "@/lib/billing/plans";
import { cn } from "@/lib/utils";

const proFeatures = [
  "Unlimited AI resume chat",
  "PDF import with AI structuring",
  "Unlimited ATS checks & resume scores",
  "Unlimited PDF downloads",
  "Job-description tailoring",
  "UPI, cards, and global payment methods",
] as const;

export function ProPricingCard() {
  const [billingCycle, setBillingCycle] = useState<BillingPlan>("monthly");
  const plan = BILLING_PLANS[billingCycle];
  const isAnnual = billingCycle === "annual";

  return (
    <section className="rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-600/15 to-blue-700/5 p-6 sm:p-8">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-blue-300">Pro</p>
        <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-red-300">
          Most popular
        </span>
      </div>

      <div className="mt-4 inline-flex rounded-full border border-white/10 bg-black/20 p-1">
        <button
          type="button"
          onClick={() => setBillingCycle("monthly")}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium transition",
            billingCycle === "monthly"
              ? "bg-white text-zinc-900"
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
              ? "bg-white text-zinc-900"
              : "text-zinc-300 hover:text-white",
          )}
        >
          Yearly
        </button>
      </div>

      <p className="mt-5 text-4xl font-bold tracking-tight">
        {isAnnual ? PRO_PRICING.annual.display : PRO_PRICING.monthly.display}
        <span className="text-lg font-medium text-zinc-400">
          {isAnnual ? PRO_PRICING.annual.suffix : PRO_PRICING.monthly.suffix}
        </span>
      </p>
      <p className="mt-1 text-sm text-emerald-300">
        {isAnnual ? plan.priceNote : `${PRO_PRICING.monthly.taxNote} · billed monthly`}
      </p>
      {isAnnual ? (
        <p className="mt-1 text-xs text-zinc-500">{BILLING_PLANS.annual.billedLabel}</p>
      ) : null}

      <ul className="mt-6 space-y-3 text-sm text-zinc-200">
        {proFeatures.map((feature) => (
          <li key={feature} className="flex gap-2">
            <span className="text-blue-300">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <PricingCheckoutButton
          key={billingCycle}
          plan={billingCycle}
          label={isAnnual ? "Upgrade to Pro — yearly" : "Upgrade to Pro — monthly"}
        />
      </div>

      <p className="mt-4 text-xs leading-5 text-zinc-500">
        Final price and tax are calculated at checkout. Pause or cancel anytime from
        the customer portal.
      </p>
    </section>
  );
}
