import { describe, expect, it } from "vitest";
import { FREE_TIER_LIMITS } from "@/lib/billing/limits";
import {
  currentUsagePeriodMonth,
  UsageLimitError,
} from "@/lib/billing/usage";

describe("currentUsagePeriodMonth", () => {
  it("returns the first day of the UTC month", () => {
    expect(currentUsagePeriodMonth(new Date("2026-07-15T12:00:00Z"))).toBe(
      "2026-07-01",
    );
  });
});

describe("UsageLimitError", () => {
  it("includes limit details in the message", () => {
    const error = new UsageLimitError(
      "ai_chat",
      FREE_TIER_LIMITS.ai_chat,
      FREE_TIER_LIMITS.ai_chat,
    );
    expect(error.code).toBe("USAGE_LIMIT_EXCEEDED");
    expect(error.message).toContain("AI chat messages");
  });
});
