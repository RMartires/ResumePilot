import type { UIMessage } from "ai";
import { normalizeResume } from "@/lib/resume";
import type { Resume } from "@/lib/validations/resume";

export type ResumeChangeDataPart = {
  has_resume_changed: boolean;
  resume: unknown;
};

export type StructuredResumeProposal = {
  messageId: string;
  proposalId: string;
  has_resume_changed: boolean;
  resume: Resume;
};

function isResumeChangeDataPart(
  data: unknown,
): data is ResumeChangeDataPart {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  return (
    typeof record.has_resume_changed === "boolean" &&
    record.resume !== undefined
  );
}

export function extractStructuredProposalFromMessage(
  message: UIMessage,
): StructuredResumeProposal | null {
  if (message.role !== "assistant") return null;

  for (const part of message.parts) {
    if (part.type !== "data-resume-change") continue;
    if (!isResumeChangeDataPart(part.data) || !part.data.has_resume_changed) {
      continue;
    }

    return {
      messageId: message.id,
      proposalId: `${message.id}:${part.id ?? "resume-change"}`,
      has_resume_changed: true,
      resume: normalizeResume(part.data.resume) as Resume,
    };
  }

  return null;
}

export function getLatestStructuredProposal(
  messages: UIMessage[],
): StructuredResumeProposal | null {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message.role !== "assistant") continue;

    const proposal = extractStructuredProposalFromMessage(message);
    if (proposal) return proposal;
  }

  return null;
}
