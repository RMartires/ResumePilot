import { describe, expect, it } from "vitest";
import { formatUserFacingApiError } from "@/lib/billing/format-api-error";

describe("formatUserFacingApiError", () => {
  it("parses usage limit JSON into a friendly message", () => {
    const raw = JSON.stringify({
      error: "Free plan limit reached for AI chat messages (10/10 this month).",
      code: "USAGE_LIMIT_EXCEEDED",
      eventType: "ai_chat",
      used: 10,
      limit: 10,
      upgradeUrl: "/dashboard/upgrade",
    });

    const result = formatUserFacingApiError(raw);
    expect(result.isUsageLimit).toBe(true);
    expect(result.upgradeUrl).toBe("/dashboard/upgrade");
    expect(result.message).toBe(
      "You've used all free AI chat messages for this month. Upgrade to Pro for unlimited chat.",
    );
    expect(result.message).not.toContain("{");
  });

  it("falls back to payload.error for other JSON errors", () => {
    const result = formatUserFacingApiError(
      JSON.stringify({ error: "Unauthorized" }),
    );
    expect(result.message).toBe("Unauthorized");
    expect(result.isUsageLimit).toBe(false);
  });
});
