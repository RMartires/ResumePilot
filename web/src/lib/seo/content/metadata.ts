import type { Metadata } from "next";
import { createMarketingMetadata } from "@/lib/seo/metadata";
import type { SeoContent } from "./schemas";

export function createContentMetadata(content: SeoContent): Metadata {
  const metadata = createMarketingMetadata({
    title: content.title,
    description: content.description,
    path: content.canonical as `/${string}`,
  });

  return content.status === "published"
    ? metadata
    : {
        ...metadata,
        robots: { index: false, follow: false },
      };
}
