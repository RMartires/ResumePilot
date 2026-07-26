import { describe, expect, it } from "vitest";
import { metadata } from "./page";

describe("press page metadata", () => {
  it("publishes aligned canonical and social metadata", () => {
    expect(metadata.alternates?.canonical).toBe("/press");
    expect(metadata.openGraph).toMatchObject({
      title: "ResumePilot Press and Product Facts",
      url: "/press",
      type: "website",
    });
    expect(metadata.twitter).toMatchObject({
      title: "ResumePilot Press and Product Facts",
      card: "summary_large_image",
    });
    expect(metadata.robots).not.toMatchObject({ index: false });
  });
});
