export type BillingPlan = "monthly" | "annual";

const MONTHLY_INR = 499;
const ANNUAL_DISCOUNT_RATE = 0.25;

const annualFullInr = MONTHLY_INR * 12;
const annualInr = Math.round(annualFullInr * (1 - ANNUAL_DISCOUNT_RATE));
const annualMonthlyEquivalent = Math.round(annualInr / 12);
const annualSaveInr = annualFullInr - annualInr;

const inr = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

/** INR pricing shown on /pricing (excl. tax). Update Dodo products to match. */
export const PRO_PRICING = {
  monthly: {
    amountInr: MONTHLY_INR,
    display: inr(MONTHLY_INR),
    suffix: "/ mo",
    taxNote: "excl. tax",
  },
  annual: {
    amountInr: annualInr,
    monthlyEquivalent: annualMonthlyEquivalent,
    display: inr(annualMonthlyEquivalent),
    suffix: "/ mo",
    billedLabel: `${inr(annualInr)} billed annually · excl. tax`,
    saveLabel: `Save ${inr(annualSaveInr)} vs monthly (25% off)`,
    discountRate: ANNUAL_DISCOUNT_RATE,
  },
} as const;

export const BILLING_PLANS = {
  monthly: {
    id: "monthly" as const,
    label: "Pro Monthly",
    envKey: "DODO_PRODUCT_ID_MONTHLY",
    priceLabel: `${PRO_PRICING.monthly.display}${PRO_PRICING.monthly.suffix}`,
    priceNote: `${PRO_PRICING.monthly.taxNote} · billed monthly`,
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
  // Static env access — dynamic process.env[key] is unreliable in Next.js builds.
  if (plan === "monthly") {
    return process.env.DODO_PRODUCT_ID_MONTHLY;
  }
  return process.env.DODO_PRODUCT_ID_ANNUAL;
}

export function isBillingPlan(value: string): value is BillingPlan {
  return value === "monthly" || value === "annual";
}
