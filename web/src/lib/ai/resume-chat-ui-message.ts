import type { UIMessage } from "ai";
import type { ResumeChangeDataPart } from "@/lib/ai/extract-structured-proposal";

export type ResumeChatUIMessage = UIMessage<
  {
    resumeId?: string;
    userId?: string;
    langsmith?: boolean;
  },
  {
    "resume-change": ResumeChangeDataPart;
  }
>;
