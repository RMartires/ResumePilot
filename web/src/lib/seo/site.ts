import { getAllPublicTemplateSlugs } from "@/lib/seo/public-templates";
import { getPublishedContentPaths } from "@/lib/seo/content/paths";

export const SITE_URL = "https://www.resumepilot.xyz";
export const SITE_NAME = "ResumePilot";

export const siteDescription =
  "Build ATS-friendly resumes in minutes. AI writing, job-description tailoring, match scoring, cover letters, and application tracking in one workflow.";

const staticPublicPaths = [
  "/",
  "/templates",
  "/tools/ats-checker",
  "/tools/resume-score",
  "/features",
  "/features/cover-letter",
  "/features/job-tracker",
  "/features/linkedin-import",
  "/pricing",
  "/about",
  "/press",
  "/privacy",
  "/terms",
] as const;

/** Public URLs included in the sitemap (Phases 1–2). */
export const PUBLIC_SEO_PATHS = [
  ...staticPublicPaths,
  ...getAllPublicTemplateSlugs().map((slug) => `/templates/${slug}` as const),
  ...getPublishedContentPaths(),
] as const;
