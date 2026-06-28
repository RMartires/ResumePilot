import { describe, expect, it } from "vitest";
import type { UIMessage } from "ai";
import { prepareChatModelMessages } from "@/lib/ai/prepare-messages";

describe("prepareChatModelMessages", () => {
  it("keeps only user and assistant text turns", () => {
    const messages = [
      {
        id: "1",
        role: "user",
        parts: [{ type: "text", text: "Update my summary" }],
      },
      {
        id: "2",
        role: "assistant",
        parts: [
          { type: "reasoning", text: "thinking..." },
          {
            type: "tool-updateSummary",
            toolCallId: "call_1",
            state: "output-available",
            input: { summary: "New summary" },
            output: { type: "patch", description: "Update summary", mode: "merge", patch: { summary: "New summary" } },
          },
          { type: "text", text: "I updated your summary." },
        ],
      },
      {
        id: "3",
        role: "user",
        parts: [{ type: "text", text: "Thanks" }],
      },
    ] as UIMessage[];

    expect(prepareChatModelMessages(messages)).toEqual([
      { role: "user", content: "Update my summary" },
      { role: "assistant", content: "I updated your summary." },
      { role: "user", content: "Thanks" },
    ]);
  });

  it("drops assistant turns that only contain tool or reasoning parts", () => {
    const messages = [
      {
        id: "1",
        role: "assistant",
        parts: [
          { type: "reasoning", text: "calling tool" },
          {
            type: "tool-updateSummary",
            toolCallId: "call_1",
            state: "output-available",
            input: { summary: "New summary" },
            output: { type: "patch", description: "Update summary", mode: "merge", patch: { summary: "New summary" } },
          },
        ],
      },
    ] as UIMessage[];

    expect(prepareChatModelMessages(messages)).toEqual([]);
  });
});
