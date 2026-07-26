import {
  COMPARISONS,
  GUIDES,
  OBJECTIVE_COLLECTIONS,
  RESUME_EXAMPLES,
  SKILLS_PAGES,
} from "./data";

export const CONTENT_HUB_PATHS = [
  "/guides",
  "/guides/ats",
  "/examples/resumes",
  "/examples/objectives",
  "/skills",
  "/compare",
] as const;

export function getPublishedContentPaths(): string[] {
  const detailPaths = [
    ...GUIDES,
    ...RESUME_EXAMPLES,
    ...OBJECTIVE_COLLECTIONS,
    ...SKILLS_PAGES,
    ...COMPARISONS,
  ]
    .filter((item) => item.status === "published")
    .map((item) => item.canonical);

  return [...CONTENT_HUB_PATHS, ...detailPaths.filter((path) => !CONTENT_HUB_PATHS.includes(path as never))];
}

export const guidePath = (slug: string) =>
  slug === "how-to-make-a-resume"
    ? "/guides/how-to-make-a-resume"
    : `/guides/ats/${slug}`;
export const resumeExamplePath = (slug: string) => `/examples/resumes/${slug}`;
export const objectivePath = (slug: string) => `/examples/objectives/${slug}`;
export const skillsPath = (slug: string) => `/skills/${slug}`;
export const comparisonPath = (slug: string) => `/compare/${slug}`;
