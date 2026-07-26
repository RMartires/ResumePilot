import { describe, expect, it } from "vitest";
import { isReliableNewSignup } from "./signup-completion";

const NOW = Date.parse("2026-07-26T12:00:00.000Z");

describe("isReliableNewSignup", () => {
  it("accepts a recent account whose first sign-in matches creation", () => {
    expect(
      isReliableNewSignup({
        createdAt: "2026-07-26T11:59:30.000Z",
        lastSignInAt: "2026-07-26T11:59:31.000Z",
        now: NOW,
      }),
    ).toBe(true);
  });

  it("rejects a returning user's successful authentication", () => {
    expect(
      isReliableNewSignup({
        createdAt: "2026-07-20T10:00:00.000Z",
        lastSignInAt: "2026-07-26T11:59:59.000Z",
        now: NOW,
      }),
    ).toBe(false);
  });

  it("rejects missing, invalid, or ambiguous timestamps", () => {
    expect(isReliableNewSignup({ createdAt: null, now: NOW })).toBe(false);
    expect(
      isReliableNewSignup({
        createdAt: "invalid",
        lastSignInAt: "2026-07-26T11:59:59.000Z",
        now: NOW,
      }),
    ).toBe(false);
    expect(
      isReliableNewSignup({
        createdAt: "2026-07-26T11:59:30.000Z",
        lastSignInAt: "2026-07-26T11:59:40.000Z",
        now: NOW,
      }),
    ).toBe(false);
  });
});
