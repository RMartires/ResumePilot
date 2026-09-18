import { describe, expect, it } from "vitest";
import { formatUserFacingApiError } from "@/lib/api/format-api-error";

describe("formatUserFacingApiError", () => {
  it("falls back to payload.error for JSON errors", () => {
    const result = formatUserFacingApiError(
      JSON.stringify({ error: "Unauthorized" }),
    );
    expect(result).toBe("Unauthorized");
  });

  it("does not treat usage-limit payloads as an upgrade paywall", () => {
    const result = formatUserFacingApiError(
      JSON.stringify({
        error: "Free plan limit reached",
        code: "USAGE_LIMIT_EXCEEDED",
        upgradeUrl: "/dashboard/upgrade",
      }),
    );
    expect(result).toBe("Free plan limit reached");
    expect(result).not.toMatch(/upgrade/i);
  });

  it("returns a generic message for empty input", () => {
    expect(formatUserFacingApiError("")).toBe(
      "Something went wrong. Please try again.",
    );
  });
});
