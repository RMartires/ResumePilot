import { getToolName, isToolUIPart, type UIMessage } from "ai";
import type { ResumePatchProposal } from "@/lib/ai/types";

export type PendingPatch = ResumePatchProposal & {
  toolCallId: string;
  toolName: string;
  messageId: string;
};

export function extractPatchesFromMessage(message: UIMessage): PendingPatch[] {
  if (message.role !== "assistant") return [];

  const patches: PendingPatch[] = [];

  for (const part of message.parts) {
    if (!isToolUIPart(part) || part.state !== "output-available") continue;

    const output = part.output as ResumePatchProposal | undefined;
    if (!output || output.type !== "patch") continue;

    patches.push({
      ...output,
      toolCallId: part.toolCallId,
      toolName: getToolName(part),
      messageId: message.id,
    });
  }

  return patches;
}

/** Latest patch from the most recent assistant message that has tool output. */
export function getLatestPatch(messages: UIMessage[]): PendingPatch | null {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message.role !== "assistant") continue;

    const patches = extractPatchesFromMessage(message);
    if (patches.length > 0) {
      return patches[patches.length - 1] ?? null;
    }
  }

  return null;
}
