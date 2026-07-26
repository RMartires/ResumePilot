import { z } from "zod";

export const publishStatusSchema = z.enum(["draft", "published"]);
export type PublishStatus = z.infer<typeof publishStatusSchema>;

export const relatedLinkSchema = z.object({
  title: z.string().min(2),
  path: z.string().startsWith("/"),
});
export type RelatedLink = z.infer<typeof relatedLinkSchema>;

const canonicalPathSchema = z.string().startsWith("/");

export const baseContentSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  canonical: canonicalPathSchema,
  status: publishStatusSchema,
  title: z.string().min(12),
  description: z.string().min(40),
  relatedLinks: z.array(relatedLinkSchema).min(3),
});

export const roleSchema = baseContentSchema.extend({
  name: z.string().min(2),
  keywords: z.array(z.string().min(2)).min(3),
});

export const guideSchema = baseContentSchema.extend({
  kind: z.enum(["pillar", "ats"]),
  intro: z.string().min(80),
  sections: z
    .array(
      z.object({
        heading: z.string().min(4),
        body: z.string().min(60),
      }),
    )
    .min(5),
  steps: z
    .array(z.object({ name: z.string().min(3), text: z.string().min(20) }))
    .min(3),
  faqs: z
    .array(z.object({ question: z.string().min(8), answer: z.string().min(30) }))
    .min(3),
  datePublished: z.string().date(),
  dateModified: z.string().date(),
});

export const resumeExampleSchema = baseContentSchema.extend({
  roleSlug: z.string(),
  summary: z.string().min(60),
  skills: z.array(z.string().min(2)).min(12),
  experience: z
    .array(
      z.object({
        title: z.string(),
        company: z.string(),
        dates: z.string(),
        bullets: z.array(z.string().min(20)).min(2),
      }),
    )
    .min(2),
  tips: z.array(z.string().min(20)).min(5),
});

export const objectiveCollectionSchema = baseContentSchema.extend({
  roleSlug: z.string(),
  objectives: z.array(z.string().min(50)).min(8),
  tips: z.array(z.string().min(20)).min(4),
});

export const skillsPageSchema = baseContentSchema.extend({
  roleSlug: z.string(),
  categories: z
    .array(
      z.object({
        name: z.string().min(3),
        skills: z.array(z.string().min(2)).min(3),
      }),
    )
    .min(4),
  advice: z.string().min(300),
});

export const comparisonSchema = baseContentSchema.extend({
  productA: z.string().min(2),
  productB: z.string().min(2),
  verdict: z.string().min(80),
  rows: z
    .array(
      z.object({
        feature: z.string().min(3),
        productA: z.string().min(2),
        productB: z.string().min(2),
      }),
    )
    .min(5),
  faqs: z
    .array(z.object({ question: z.string().min(8), answer: z.string().min(30) }))
    .min(3),
  sections: z
    .array(
      z.object({
        heading: z.string().min(4),
        body: z.string().min(80),
      }),
    )
    .min(3),
  limitations: z.array(z.string().min(30)).min(2),
  lastReviewed: z.string().date(),
  sources: z
    .array(
      z.object({
        title: z.string().min(3),
        url: z.string().url(),
      }),
    )
    .min(1),
});

export type Role = z.infer<typeof roleSchema>;
export type Guide = z.infer<typeof guideSchema>;
export type ResumeExample = z.infer<typeof resumeExampleSchema>;
export type ObjectiveCollection = z.infer<typeof objectiveCollectionSchema>;
export type SkillsPage = z.infer<typeof skillsPageSchema>;
export type Comparison = z.infer<typeof comparisonSchema>;
export type SeoContent =
  | Role
  | Guide
  | ResumeExample
  | ObjectiveCollection
  | SkillsPage
  | Comparison;
