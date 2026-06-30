import { z } from "zod";

export const resumeImportResponseSchema = z.object({
  title: z
    .string()
    .describe(
      "Short resume title, usually the candidate name or filename without extension",
    ),
  resume: z
    .unknown()
    .describe("Complete structured resume JSON matching the app schema"),
});

export type ResumeImportResponse = z.infer<typeof resumeImportResponseSchema>;

export const RESUME_IMPORT_TEMPERATURE = 0.2;
