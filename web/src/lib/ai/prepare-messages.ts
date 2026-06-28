import type { ModelMessage, UIMessage } from "ai";

/**
 * Build text-only chat history for strict providers (e.g. Qwen via Alibaba).
 *
 * Tool transcripts and reasoning blocks are omitted — resume context is
 * re-sent in the system prompt each request, and tool results are not needed
 * for follow-up turns. This avoids assistant messages with `content: null`
 * after tool calls, which Alibaba rejects.
 */
export function prepareChatModelMessages(
  messages: UIMessage[],
): ModelMessage[] {
  const modelMessages: ModelMessage[] = [];

  for (const message of messages) {
    if (message.role !== "user" && message.role !== "assistant") continue;

    const text = message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n")
      .trim();

    if (!text) continue;

    modelMessages.push({
      role: message.role,
      content: text,
    });
  }

  return modelMessages;
}
