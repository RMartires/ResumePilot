import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { PUBLIC_SEO_PATHS, SITE_URL } from "@/lib/seo/site";

describe("sitemap", () => {
  it("contains every public SEO path exactly once", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    const expectedUrls = PUBLIC_SEO_PATHS.map((path) =>
      path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    );

    expect(urls).toEqual(expectedUrls);
    expect(urls).toContain(`${SITE_URL}/press`);
    expect(urls).toHaveLength(52);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("does not manufacture a new last-modified date per request", () => {
    expect(sitemap().every((entry) => entry.lastModified === undefined)).toBe(true);
  });

  it("excludes private and authentication routes", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls.some((url) => /\/(dashboard|preview|login|signup)(\/|$)/.test(url))).toBe(
      false,
    );
  });
});
