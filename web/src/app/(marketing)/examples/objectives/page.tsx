import { ContentHubGrid } from "@/components/marketing/ContentHubGrid";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { JsonLd } from "@/lib/seo/json-ld";
import { OBJECTIVE_COLLECTIONS, published } from "@/lib/seo/content";
import { createMarketingMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/structured-data";

export const metadata = createMarketingMetadata({
  title: "Resume Objective Examples by Role",
  description: "Browse concise resume objective examples for early-career candidates, career changes, and targeted applications.",
  path: "/examples/objectives",
});
export default function ObjectivesPage() {
  const items = published(OBJECTIVE_COLLECTIONS).map((item) => ({ title: item.title, description: item.description, path: item.canonical }));
  return (
    <>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Resume objectives", path: "/examples/objectives" }]),
        itemListJsonLd("Resume objective examples", items.map((item) => ({ name: item.title, path: item.path, description: item.description }))),
      ]} />
      <MarketingPage eyebrow="Resume objectives" title="Write a specific resume objective" description="Examples that connect a clear target role with credible skills, projects, and transferable experience.">
        <ContentHubGrid items={items} />
      </MarketingPage>
    </>
  );
}
