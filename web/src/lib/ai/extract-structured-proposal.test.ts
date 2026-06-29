import { describe, expect, it } from "vitest";
import type { UIMessage } from "ai";
import {
  extractStructuredProposalFromMessage,
  getLatestStructuredProposal,
} from "@/lib/ai/extract-structured-proposal";
import { emptyResume } from "@/lib/resume";

describe("extract-structured-proposal", () => {
  it("reads resume-change data parts with has_resume_changed true", () => {
    const proposed = {
      ...emptyResume(),
      summary: "Updated summary",
    };

    const message = {
      id: "assistant-1",
      role: "assistant",
      parts: [
        { type: "text", text: "I updated your summary." },
        {
          type: "data-resume-change",
          id: "resume-change",
          data: {
            has_resume_changed: true,
            resume: proposed,
          },
        },
      ],
    } as UIMessage;

    const proposal = extractStructuredProposalFromMessage(message);
    expect(proposal?.proposalId).toBe("assistant-1:resume-change");
    expect(proposal?.resume.summary).toBe("Updated summary");
  });

  it("ignores data parts when has_resume_changed is false", () => {
    const message = {
      id: "assistant-2",
      role: "assistant",
      parts: [
        {
          type: "data-resume-change",
          id: "resume-change",
          data: {
            has_resume_changed: false,
            resume: emptyResume(),
          },
        },
      ],
    } as UIMessage;

    expect(extractStructuredProposalFromMessage(message)).toBeNull();
    expect(getLatestStructuredProposal([message])).toBeNull();
  });
});
