import type { MetadataRoute } from "next";
import { PUBLIC_SEO_PATHS, SITE_URL } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_SEO_PATHS.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/tools") || path.startsWith("/templates") ? 0.9 : 0.7,
  }));
}
