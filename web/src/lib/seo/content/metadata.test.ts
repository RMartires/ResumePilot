import { describe, expect, it } from "vitest";
import { getGuide } from "./registry";
import { createContentMetadata } from "./metadata";

describe("content metadata", () => {
  it("uses the registry canonical, title, and description", () => {
    const guide = getGuide("how-to-make-a-resume")!;
    const metadata = createContentMetadata(guide);
    expect(metadata.alternates?.canonical).toBe(guide.canonical);
    expect(metadata.openGraph).toMatchObject({
      title: guide.title,
      description: guide.description,
      url: guide.canonical,
    });
  });
});
