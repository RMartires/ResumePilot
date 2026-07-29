import { describe, expect, it } from "vitest";
import { normalizeReferralCode } from "@/lib/referrals/cookie";

describe("normalizeReferralCode", () => {
  it("accepts valid partner codes", () => {
    expect(normalizeReferralCode("Jane_Doe-42")).toBe("jane_doe-42");
  });

  it("rejects empty and invalid codes", () => {
    expect(normalizeReferralCode("")).toBeNull();
    expect(normalizeReferralCode("a")).toBeNull();
    expect(normalizeReferralCode("bad code")).toBeNull();
    expect(normalizeReferralCode("x".repeat(41))).toBeNull();
  });
});
