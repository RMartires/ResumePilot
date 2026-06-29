import { describe, expect, it } from "vitest";
import {
  extractPartialStructuredMessage,
  getAssistantChatText,
} from "@/lib/ai/extract-chat-message";

describe("extract-chat-message", () => {
  it("extracts message from partial streaming JSON", () => {
    const partial =
      '{"message":"Hello there","has_resume_changed":true,"resume":{';
    expect(extractPartialStructuredMessage(partial)).toBe("Hello there");
  });

  it("returns parsed message from complete JSON", () => {
    const json = JSON.stringify({
      message: "Done!",
      has_resume_changed: true,
      resume: {},
    });
    expect(getAssistantChatText(json)).toBe("Done!");
  });

  it("hides incomplete JSON without a message field", () => {
    expect(getAssistantChatText('{"has_resume_changed":true,')).toBe("");
  });
});
