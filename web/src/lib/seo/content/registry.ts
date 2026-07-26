import {
  COMPARISONS,
  GUIDES,
  OBJECTIVE_COLLECTIONS,
  RESUME_EXAMPLES,
  ROLES,
  SKILLS_PAGES,
} from "./data";
import type {
  Comparison,
  Guide,
  ObjectiveCollection,
  ResumeExample,
  Role,
  SeoContent,
  SkillsPage,
} from "./schemas";

export {
  COMPARISONS,
  GUIDES,
  OBJECTIVE_COLLECTIONS,
  RESUME_EXAMPLES,
  ROLES,
  SKILLS_PAGES,
};
export type {
  Comparison,
  Guide,
  ObjectiveCollection,
  ResumeExample,
  Role,
  SeoContent,
  SkillsPage,
} from "./schemas";

export const CONTENT_REGISTRIES = {
  roles: ROLES,
  guides: GUIDES,
  resumeExamples: RESUME_EXAMPLES,
  objectives: OBJECTIVE_COLLECTIONS,
  skills: SKILLS_PAGES,
  comparisons: COMPARISONS,
} as const;

export const ALL_CONTENT: SeoContent[] = Object.values(CONTENT_REGISTRIES).flat();

export function published<T extends SeoContent>(items: readonly T[]): T[] {
  return items.filter((item) => item.status === "published");
}

function getPublishedBySlug<T extends SeoContent>(
  items: readonly T[],
  slug: string,
): T | undefined {
  return items.find((item) => item.slug === slug && item.status === "published");
}

export const getRole = (slug: string): Role | undefined =>
  getPublishedBySlug(ROLES, slug);
export const getGuide = (slug: string): Guide | undefined =>
  getPublishedBySlug(GUIDES, slug);
export const getResumeExample = (slug: string): ResumeExample | undefined =>
  getPublishedBySlug(RESUME_EXAMPLES, slug);
export const getObjectiveCollection = (
  slug: string,
): ObjectiveCollection | undefined =>
  getPublishedBySlug(OBJECTIVE_COLLECTIONS, slug);
export const getSkillsPage = (slug: string): SkillsPage | undefined =>
  getPublishedBySlug(SKILLS_PAGES, slug);
export const getComparison = (slug: string): Comparison | undefined =>
  getPublishedBySlug(COMPARISONS, slug);

export function getContentByCanonical(path: string): SeoContent | undefined {
  return ALL_CONTENT.find(
    (item) => item.canonical === path && item.status === "published",
  );
}

export function getRelatedContent(item: SeoContent): SeoContent[] {
  return item.relatedLinks
    .map((link) => getContentByCanonical(link.path))
    .filter((related): related is SeoContent => Boolean(related));
}
