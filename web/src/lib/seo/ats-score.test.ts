import { describe, expect, it } from "vitest";
import { extractJdKeywords, scoreResumeAgainstJd } from "@/lib/seo/ats-score";

const sampleResume = `
Jane Doe
jane@example.com
+1 555 0100

Summary
Software engineer with 5 years of experience.

Experience
Software Engineer at Acme
Built React and TypeScript features for 10k users.

Education
B.S. Computer Science

Skills
React, TypeScript, Node.js, AWS
`;

describe("extractJdKeywords", () => {
  it("pulls distinctive terms from a JD", () => {
    const keywords = extractJdKeywords(
      "We need a Software Engineer with React, TypeScript, and AWS experience. React is required.",
    );
    expect(keywords.some((k) => k.includes("react"))).toBe(true);
  });
});

describe("scoreResumeAgainstJd", () => {
  it("scores formatting without a JD", () => {
    const result = scoreResumeAgainstJd(sampleResume);
    expect(result.overallScore).toBeGreaterThan(50);
    expect(result.keywordScore).toBeNull();
    expect(result.flags.some((f) => f.id === "email" && f.passed)).toBe(true);
  });

  it("reports missing keywords against a JD", () => {
    const result = scoreResumeAgainstJd(
      sampleResume,
      "Looking for Kubernetes and GraphQL experts. Kubernetes required. GraphQL preferred.",
    );
    expect(result.keywordScore).not.toBeNull();
    expect(result.missingKeywords.length).toBeGreaterThan(0);
  });
});
