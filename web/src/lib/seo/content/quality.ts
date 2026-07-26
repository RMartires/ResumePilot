import type { SeoContent } from "./schemas";

export type ContentRegistryMap = Record<string, readonly SeoContent[]>;

const BUILT_IN_PUBLIC_PATHS = new Set([
  "/",
  "/templates",
  "/guides",
  "/guides/ats",
  "/examples/resumes",
  "/examples/objectives",
  "/skills",
  "/compare",
  "/tools/ats-checker",
  "/tools/resume-score",
  "/features",
  "/pricing",
  "/about",
]);

function words(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function visibleWordCount(item: SeoContent): number {
  const text = [
    item.title,
    item.description,
    "intro" in item ? item.intro : "",
    "sections" in item ? item.sections.flatMap((section) => [section.heading, section.body]).join(" ") : "",
    "steps" in item ? item.steps.flatMap((step) => [step.name, step.text]).join(" ") : "",
    "faqs" in item ? item.faqs.flatMap((faq) => [faq.question, faq.answer]).join(" ") : "",
    "summary" in item ? item.summary : "",
    "skills" in item ? item.skills.join(" ") : "",
    "experience" in item
      ? item.experience.flatMap((job) => [job.title, job.company, job.dates, ...job.bullets]).join(" ")
      : "",
    "tips" in item ? item.tips.join(" ") : "",
    "objectives" in item ? item.objectives.join(" ") : "",
    "categories" in item
      ? item.categories.flatMap((category) => [category.name, ...category.skills]).join(" ")
      : "",
    "advice" in item ? item.advice : "",
    "verdict" in item ? item.verdict : "",
    "rows" in item
      ? item.rows.flatMap((row) => [row.feature, row.productA, row.productB]).join(" ")
      : "",
    "limitations" in item ? item.limitations.join(" ") : "",
  ].join(" ");
  return words(text);
}

function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

export function validateContentQuality(
  registries: ContentRegistryMap,
  additionalPublicPaths: readonly string[] = [],
): string[] {
  const errors: string[] = [];
  const entries = Object.entries(registries);
  const all = entries.flatMap(([, items]) => items);
  const published = all.filter((item) => item.status === "published");

  for (const [name, items] of entries) {
    for (const slug of duplicates(items.map((item) => item.slug))) {
      errors.push(`${name}: duplicate slug "${slug}"`);
    }
  }
  for (const canonical of duplicates(all.map((item) => item.canonical))) {
    errors.push(`duplicate canonical "${canonical}"`);
  }
  for (const title of duplicates(all.map((item) => item.title.toLowerCase()))) {
    errors.push(`duplicate title "${title}"`);
  }

  const knownPaths = new Set([
    ...BUILT_IN_PUBLIC_PATHS,
    ...additionalPublicPaths,
    ...published.map((item) => item.canonical),
  ]);
  const draftPaths = new Set(
    all.filter((item) => item.status === "draft").map((item) => item.canonical),
  );

  for (const item of published) {
    if (item.relatedLinks.length < 3) {
      errors.push(`${item.canonical}: requires at least three meaningful internal links`);
    }
    for (const link of item.relatedLinks) {
      if (draftPaths.has(link.path)) {
        errors.push(`${item.canonical}: related link leaks draft "${link.path}"`);
      } else if (!knownPaths.has(link.path)) {
        errors.push(`${item.canonical}: broken related link "${link.path}"`);
      }
    }
  }

  const objectiveTexts = all.flatMap((item) =>
    "objectives" in item ? item.objectives.map((text) => text.trim().toLowerCase()) : [],
  );
  for (const text of duplicates(objectiveTexts)) {
    errors.push(`duplicate objective text "${text.slice(0, 60)}"`);
  }

  for (const item of all) {
    if (item.description.length < 40) {
      errors.push(`${item.canonical}: description is too short`);
    }
    if ("kind" in item && item.sections.length < (item.kind === "pillar" ? 8 : 5)) {
      errors.push(`${item.canonical}: guide has too few substantial sections`);
    }
    if ("kind" in item && item.faqs.length < (item.kind === "pillar" ? 5 : 3)) {
      errors.push(`${item.canonical}: guide has too few FAQs`);
    }
    if ("kind" in item) {
      const minimum = item.kind === "pillar" ? 1800 : 450;
      if (visibleWordCount(item) < minimum) {
        errors.push(`${item.canonical}: visible copy is thin (${visibleWordCount(item)} words; minimum ${minimum})`);
      }
    }
    if ("objectives" in item && item.objectives.length < 8) {
      errors.push(`${item.canonical}: requires at least eight objectives`);
    }
    if ("objectives" in item && item.tips.length < 4) {
      errors.push(`${item.canonical}: objective page requires at least four tips`);
    }
    if ("objectives" in item && visibleWordCount(item) < 180) {
      errors.push(`${item.canonical}: objective copy is thin (${visibleWordCount(item)} words; minimum 180)`);
    }
    if ("experience" in item) {
      const bulletCount = item.experience.reduce((total, job) => total + job.bullets.length, 0);
      if (item.experience.length < 2 || bulletCount < 6 || item.skills.length < 12 || item.tips.length < 5) {
        errors.push(`${item.canonical}: resume example is incomplete`);
      }
      if (visibleWordCount(item) < 250) {
        errors.push(`${item.canonical}: resume example copy is thin (${visibleWordCount(item)} words; minimum 250)`);
      }
    }
    if ("categories" in item && item.categories.length < 4) {
      errors.push(`${item.canonical}: skills page requires hard skills, tools, soft skills, and categories`);
    }
    if ("categories" in item && visibleWordCount(item) < 140) {
      errors.push(`${item.canonical}: skills copy is thin (${visibleWordCount(item)} words; minimum 140)`);
    }
    if ("rows" in item && (item.rows.length < 5 || item.sections.length < 3 || item.faqs.length < 3)) {
      errors.push(`${item.canonical}: comparison is incomplete`);
    }
    if ("rows" in item && visibleWordCount(item) < 300) {
      errors.push(`${item.canonical}: comparison copy is thin (${visibleWordCount(item)} words; minimum 300)`);
    }
    if ("lastReviewed" in item && item.sources.length < 1) {
      errors.push(`${item.canonical}: comparison requires official sources`);
    }
  }

  return errors;
}

export function assertContentQuality(registries: ContentRegistryMap): void {
  const errors = validateContentQuality(registries);
  if (errors.length > 0) {
    throw new Error(`SEO content quality failed:\n${errors.join("\n")}`);
  }
}
