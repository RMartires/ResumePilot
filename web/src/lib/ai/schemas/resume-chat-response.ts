import { z } from "zod";

/**
 * Structured LLM response (Zod — equivalent to a Pydantic model).
 * Resume is validated loosely here; normalizeResume() runs after parsing.
 */
export const resumeChatResponseSchema = z.object({
  message: z
    .string()
    .describe(
      "Short conversational reply to the user. Do not paste the full resume JSON here.",
    ),
  has_resume_changed: z
    .boolean()
    .describe(
      "True when resume differs from the input snapshot after applying the user's request",
    ),
  resume: z
    .unknown()
    .describe(
      "Complete resume JSON after applying any requested edits",
    ),
});

export type ResumeChatResponse = z.infer<typeof resumeChatResponseSchema>;

export const resumeChangeDataSchema = z.object({
  has_resume_changed: z.boolean(),
  resume: z.unknown(),
});

export const RESUME_CHAT_TEMPERATURE = 0.5;
