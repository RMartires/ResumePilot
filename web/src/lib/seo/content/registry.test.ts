import { describe, expect, it } from "vitest";
import {
  ALL_CONTENT,
  COMPARISONS,
  CONTENT_REGISTRIES,
  GUIDES,
  OBJECTIVE_COLLECTIONS,
  RESUME_EXAMPLES,
  SKILLS_PAGES,
  getComparison,
  getContentByCanonical,
  getGuide,
  getResumeExample,
  published,
} from "./registry";

describe("SEO content registry", () => {
  it("parses and exposes every seeded registry", () => {
    expect(Object.keys(CONTENT_REGISTRIES)).toEqual([
      "roles",
      "guides",
      "resumeExamples",
      "objectives",
      "skills",
      "comparisons",
    ]);
    expect(ALL_CONTENT).toHaveLength(24);
    expect(published(GUIDES)).toHaveLength(8);
    expect(published(RESUME_EXAMPLES)).toHaveLength(3);
    expect(published(OBJECTIVE_COLLECTIONS)).toHaveLength(3);
    expect(published(SKILLS_PAGES)).toHaveLength(3);
    expect(published(COMPARISONS)).toHaveLength(4);
  });

  it("only returns published records from route lookups", () => {
    expect(getGuide("how-to-make-a-resume")?.status).toBe("published");
    expect(getGuide("ats-friendly-resume-format")?.canonical).toBe(
      "/guides/ats/ats-friendly-resume-format",
    );
    expect(getResumeExample("software-engineer")?.canonical).toBe(
      "/examples/resumes/software-engineer",
    );
    expect(getComparison("missing")).toBeUndefined();
    expect(published(ALL_CONTENT).every((item) => item.status === "published")).toBe(true);
  });

  it("looks up internal content by canonical path", () => {
    expect(
      getContentByCanonical("/skills/software-engineer")?.title,
    ).toBe("Software Engineer Resume Skills");
  });
});
