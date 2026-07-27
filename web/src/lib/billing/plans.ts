export type BillingPlan = "monthly" | "annual";

/** JobSuit-style INR pricing (update Dodo product amounts to match). */
export const PRO_PRICING = {
  monthly: {
    amountInr: 457,
    display: "₹457",
    suffix: "/ mo",
  },
  annual: {
    amountInr: 4992,
    monthlyEquivalent: 416,
    display: "₹416",
    suffix: "/ mo",
    billedLabel: "₹4,992 billed annually",
    saveLabel: "Save ₹495 vs monthly plan",
  },
} as const;

export const BILLING_PLANS = {
  monthly: {
    id: "monthly" as const,
    label: "Pro Monthly",
    envKey: "DODO_PRODUCT_ID_MONTHLY",
    priceLabel: `${PRO_PRICING.monthly.display}${PRO_PRICING.monthly.suffix}`,
    priceNote: "Billed monthly · pause or cancel anytime",
  },
  annual: {
    id: "annual" as const,
    label: "Pro Annual",
    envKey: "DODO_PRODUCT_ID_ANNUAL",
    priceLabel: `${PRO_PRICING.annual.display}${PRO_PRICING.annual.suffix}`,
    priceNote: PRO_PRICING.annual.saveLabel,
    billedLabel: PRO_PRICING.annual.billedLabel,
  },
} as const;

export function getProductIdForPlan(plan: BillingPlan): string | undefined {
  const config = BILLING_PLANS[plan];
  return process.env[config.envKey];
}

export function isBillingPlan(value: string): value is BillingPlan {
  return value === "monthly" || value === "annual";
}
