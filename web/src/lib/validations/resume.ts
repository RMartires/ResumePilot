import { z } from "zod";
import { ResumeSection } from "@/lib/sections";

export const educationEntrySchema = z.object({
  school: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string(),
  year: z.string(),
  graduationDate: z.string(),
  marks: z.string(),
  marksType: z.string(),
  description: z.string(),
});

export const jobSchema = z.object({
  title: z.string(),
  company: z.string(),
  dates: z.string(),
  location: z.string().optional().default(""),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  current: z.boolean().optional().default(false),
  bullets: z.array(z.string()),
});

export const projectSchema = z.object({
  name: z.string(),
  url: z.string(),
  bullets: z.array(z.string()),
});

export const headerSchema = z.object({
  name: z.string(),
  location: z.string(),
  phone: z.string(),
  email: z.string(),
  gender: z.string().optional().default(""),
  links: z.array(z.string()),
});

export const educationSchema = educationEntrySchema.extend({
  secondary: z.array(educationEntrySchema),
});

export const resumeSectionSchema = z.nativeEnum(ResumeSection);

export const resumeSchema = z.object({
  header: headerSchema,
  summary: z.string(),
  skills: z.string(),
  experience: z.array(jobSchema),
  projects: z.array(projectSchema),
  education: educationSchema,
  activeSections: z.array(resumeSectionSchema),
});

export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type Job = z.infer<typeof jobSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Header = z.infer<typeof headerSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Resume = z.infer<typeof resumeSchema>;

export const templateConfigSchema = z.object({
  fontFamily: z.string().default("serif"),
  fontSize: z.string().default("0.72rem"),
  accentColor: z.string().default("#2563eb"),
  sectionSpacing: z.string().default("14px"),
  headingTransform: z.enum(["uppercase", "none"]).default("uppercase"),
  layout: z.enum(["standard", "sidebar"]).default("standard"),
});

export type TemplateConfig = z.infer<typeof templateConfigSchema>;
