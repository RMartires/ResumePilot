import type { Metadata } from "next";

type MarketingMetadataInput = {
  title: string;
  description: string;
  path: `/${string}` | "/";
};

/**
 * Keeps canonical, Open Graph, and Twitter metadata aligned for public pages.
 * Social images inherit from the root layout so pages do not generate duplicates.
 */
export function createMarketingMetadata({
  title,
  description,
  path,
}: MarketingMetadataInput): Metadata {
  return {
    // Homepage already includes the brand; skip the layout "%s · ResumePilot" suffix.
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const noIndexMetadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};
