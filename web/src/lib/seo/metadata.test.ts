import { describe, expect, it } from "vitest";
import { createMarketingMetadata, noIndexMetadata } from "./metadata";

describe("createMarketingMetadata", () => {
  it("keeps canonical and social fields aligned", () => {
    const metadata = createMarketingMetadata({
      title: "Free Resume Score",
      description: "Check your resume.",
      path: "/tools/resume-score",
    });

    expect(metadata.alternates?.canonical).toBe("/tools/resume-score");
    expect(metadata.openGraph).toMatchObject({
      title: "Free Resume Score",
      description: "Check your resume.",
      url: "/tools/resume-score",
    });
    expect(metadata.twitter).toMatchObject({
      title: "Free Resume Score",
      description: "Check your resume.",
    });
    expect(metadata.openGraph).not.toHaveProperty("images");
  });

  it("uses an absolute homepage title so the brand suffix is not duplicated", () => {
    const metadata = createMarketingMetadata({
      title: "ResumePilot — AI Resume Builder with ATS Optimization",
      description: "Build ATS-friendly resumes.",
      path: "/",
    });

    expect(metadata.title).toEqual({
      absolute: "ResumePilot — AI Resume Builder with ATS Optimization",
    });
  });
});

describe("private-route robots metadata", () => {
  it("prevents indexing while allowing link discovery", () => {
    expect(noIndexMetadata.robots).toEqual({
      index: false,
      follow: true,
    });
  });
});
