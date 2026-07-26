import { ContentHubGrid } from "@/components/marketing/ContentHubGrid";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { JsonLd } from "@/lib/seo/json-ld";
import { createMarketingMetadata } from "@/lib/seo/metadata";
import { GUIDES, published } from "@/lib/seo/content";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/structured-data";

export const metadata = createMarketingMetadata({
  title: "Resume Writing Guides",
  description: "Practical guides for writing, tailoring, formatting, and checking an ATS-friendly resume.",
  path: "/guides",
});

export default function GuidesPage() {
  const items = published(GUIDES).map((guide) => ({
    title: guide.title,
    description: guide.description,
    path: guide.canonical,
  }));
  return (
    <>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }]),
        itemListJsonLd("Resume writing guides", items.map((item) => ({ name: item.title, path: item.path, description: item.description }))),
      ]} />
      <MarketingPage eyebrow="Guides" title="Build a stronger resume" description="Evidence-led advice for writing clearly, passing cleanly through ATS software, and tailoring each application.">
        <ContentHubGrid items={items} />
      </MarketingPage>
    </>
  );
}
