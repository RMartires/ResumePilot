import { describe, expect, it } from "vitest";
import { CONTENT_REGISTRIES } from "./registry";
import { validateContentQuality } from "./quality";
import type { SeoContent } from "./schemas";

const record = (overrides: Partial<SeoContent> = {}) =>
  ({
    slug: "sample",
    canonical: "/sample",
    status: "published",
    title: "A Distinct Sample Content Title",
    description: "A sufficiently detailed description for a useful public content page.",
    relatedLinks: [{ title: "Home page", path: "/" }],
    name: "Sample role",
    keywords: ["one", "two", "three"],
    ...overrides,
  }) as SeoContent;

describe("content quality validation", () => {
  it("accepts the production registries", () => {
    expect(validateContentQuality(CONTENT_REGISTRIES)).toEqual([]);
  });

  it("detects duplicates and broken links", () => {
    const errors = validateContentQuality({
      examples: [
        record({ relatedLinks: [{ title: "Missing", path: "/missing" }] }),
        record({ canonical: "/other" }),
      ],
    });
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining("duplicate slug"),
        expect.stringContaining("duplicate title"),
        expect.stringContaining("broken related link"),
      ]),
    );
  });

  it("detects draft leakage and duplicate objective text", () => {
    const objective = "A long, specific objective statement that is suitable for a targeted resume application.";
    const errors = validateContentQuality({
      objectives: [
        record({
          slug: "objectives",
          canonical: "/objectives",
          relatedLinks: [{ title: "Draft", path: "/draft" }],
          roleSlug: "sample",
          objectives: [objective, objective, `${objective} with additional context`],
          tips: ["Use evidence from your background.", "Name the target role clearly."],
        } as Partial<SeoContent>),
        record({ slug: "draft", canonical: "/draft", status: "draft" }),
      ],
    });
    expect(errors.some((error) => error.includes("leaks draft"))).toBe(true);
    expect(errors.some((error) => error.includes("duplicate objective text"))).toBe(true);
  });

  it("rejects structurally complete but thin content fixtures", () => {
    const errors = validateContentQuality({
      guides: [
        record({
          kind: "ats",
          intro: "This introduction is intentionally long enough to resemble valid copy while remaining far too thin to publish.",
          sections: Array.from({ length: 5 }, (_, index) => ({
            heading: `Section ${index + 1}`,
            body: "This fixture has the required structure but repeats a short sentence instead of providing useful editorial depth.",
          })),
          steps: Array.from({ length: 3 }, (_, index) => ({
            name: `Step ${index + 1}`,
            text: "Complete a clearly described application review step.",
          })),
          faqs: Array.from({ length: 3 }, (_, index) => ({
            question: `What is fixture question ${index + 1}?`,
            answer: "This answer is valid in shape but intentionally too brief to make the overall guide publishable.",
          })),
          datePublished: "2026-07-26",
          dateModified: "2026-07-26",
          relatedLinks: [
            { title: "Home", path: "/" },
            { title: "Guides", path: "/guides" },
            { title: "Templates", path: "/templates" },
          ],
        } as Partial<SeoContent>),
      ],
      skills: [
        record({
          slug: "skills",
          canonical: "/skills-fixture",
          title: "A Thin Skills Fixture Page",
          roleSlug: "sample",
          categories: ["Hard skills", "Tools", "Soft skills", "Methods"].map((name) => ({
            name,
            skills: ["One", "Two", "Three"],
          })),
          advice: "List relevant skills, then show evidence.",
          relatedLinks: [
            { title: "Home", path: "/" },
            { title: "Guides", path: "/guides" },
            { title: "Templates", path: "/templates" },
          ],
        } as Partial<SeoContent>),
      ],
    });

    expect(errors.filter((error) => error.includes("thin"))).toHaveLength(2);
  });
});
