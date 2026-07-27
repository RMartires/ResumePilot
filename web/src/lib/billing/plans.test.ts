import { describe, expect, it } from "vitest";
import { PRO_PRICING } from "@/lib/billing/plans";

describe("PRO_PRICING", () => {
  it("uses ₹499 monthly excl. tax", () => {
    expect(PRO_PRICING.monthly.amountInr).toBe(499);
  });

  it("applies 25% annual discount on 12× monthly", () => {
    expect(PRO_PRICING.annual.amountInr).toBe(4491);
    expect(PRO_PRICING.annual.monthlyEquivalent).toBe(374);
    expect(PRO_PRICING.annual.saveLabel).toContain("25% off");
  });
});
