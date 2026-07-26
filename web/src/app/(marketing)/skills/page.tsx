import { ContentHubGrid } from "@/components/marketing/ContentHubGrid";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { JsonLd } from "@/lib/seo/json-ld";
import { published, SKILLS_PAGES } from "@/lib/seo/content";
import { createMarketingMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/structured-data";

export const metadata = createMarketingMetadata({
  title: "Resume Skills by Role",
  description: "Find role-relevant resume skills and learn how to support them with credible evidence in your experience.",
  path: "/skills",
});
export default function SkillsHubPage() {
  const items = published(SKILLS_PAGES).map((item) => ({ title: item.title, description: item.description, path: item.canonical }));
  return (
    <>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Resume skills", path: "/skills" }]),
        itemListJsonLd("Resume skills by role", items.map((item) => ({ name: item.title, path: item.path, description: item.description }))),
      ]} />
      <MarketingPage eyebrow="Resume skills" title="Choose skills you can prove" description="Role-specific skill lists and practical advice for showing those skills in context.">
        <ContentHubGrid items={items} />
      </MarketingPage>
    </>
  );
}
