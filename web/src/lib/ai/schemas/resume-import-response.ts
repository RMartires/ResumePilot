import { z } from "zod";

const importJobSchema = z.object({
  title: z.string().describe("Job title"),
  company: z.string().describe("Employer name"),
  dates: z.string().describe('Human-readable range, e.g. "Jan 2020 - Present"'),
  location: z.string().describe("Role location or empty string"),
  startDate: z.string().describe("ISO date or empty string"),
  endDate: z.string().describe("ISO date or empty string"),
  current: z.boolean().describe("True if this is the current role"),
  bullets: z.array(z.string()).describe("Achievement bullet points"),
});

const importProjectSchema = z.object({
  name: z.string(),
  url: z.string().describe("Project URL or empty string"),
  bullets: z.array(z.string()),
});

const importEducationEntrySchema = z.object({
  school: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string(),
  year: z.string().describe("Graduation year or empty string"),
  graduationDate: z.string().describe("ISO date, year, or empty string"),
  marks: z.string(),
  marksType: z.string().describe('e.g. "CGPA", "GPA", or empty string'),
  description: z.string(),
});

const importEducationSchema = importEducationEntrySchema.extend({
  secondary: z
    .array(importEducationEntrySchema)
    .describe("Additional degrees beyond the primary one"),
});

const importHeaderSchema = z.object({
  name: z.string().describe("Full name"),
  location: z.string().describe("City / region"),
  phone: z.string().describe("Phone number"),
  email: z.string().describe("Email address"),
  gender: z.string().describe("Gender or empty string"),
  links: z
    .array(z.string())
    .describe("Full https URLs for LinkedIn, GitHub, portfolio, etc."),
});

/** Full resume shape for structured LLM output (not z.unknown). */
export const importResumeDataSchema = z.object({
  header: importHeaderSchema,
  summary: z.string().describe("Professional summary paragraph"),
  skills: z
    .string()
    .describe("Skills as one string; use commas or | between groups"),
  experience: z.array(importJobSchema),
  projects: z.array(importProjectSchema),
  education: importEducationSchema,
  activeSections: z
    .array(z.enum(["personal", "skills", "projects", "experience", "education"]))
    .describe("Sections to show in the editor"),
});

export const resumeImportResponseSchema = z.object({
  title: z
    .string()
    .describe(
      "Short resume title, usually the candidate name or filename without extension",
    ),
  resume: importResumeDataSchema.describe(
    "Complete structured resume matching every field in the schema",
  ),
});

export type ResumeImportResponse = z.infer<typeof resumeImportResponseSchema>;

export const RESUME_IMPORT_TEMPERATURE = 0.1;
