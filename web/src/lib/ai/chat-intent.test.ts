import { describe, expect, it } from "vitest";
import {
  assistantOfferedToApply,
  isAcceptIntent,
  isDeclineIntent,
} from "@/lib/ai/chat-intent";

describe("chat-intent", () => {
  it("detects accept phrases", () => {
    expect(isAcceptIntent("yes apply")).toBe(true);
    expect(isAcceptIntent("ok")).toBe(true);
    expect(isAcceptIntent("maybe later")).toBe(false);
  });

  it("detects decline phrases", () => {
    expect(isDeclineIntent("no thanks")).toBe(true);
    expect(isDeclineIntent("decline")).toBe(true);
  });

  it("detects when assistant only offered to apply in chat", () => {
    expect(
      assistantOfferedToApply(
        "Would you like me to apply this summary, or would you prefer adjustments?",
      ),
    ).toBe(true);
  });
});
