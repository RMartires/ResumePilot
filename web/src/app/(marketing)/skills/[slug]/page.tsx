import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentBreadcrumbs } from "@/components/marketing/ContentBreadcrumbs";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { RelatedLinks } from "@/components/marketing/RelatedLinks";
import { SignInCta } from "@/components/marketing/SignInCta";
import { SkillsPanel } from "@/components/marketing/SkillsPanel";
import { JsonLd } from "@/lib/seo/json-ld";
import { createContentMetadata, getSkillsPage, published, SKILLS_PAGES } from "@/lib/seo/content";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/structured-data";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return published(SKILLS_PAGES).map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getSkillsPage((await params).slug);
  return item ? createContentMetadata(item) : {};
}
export default async function SkillsPage({ params }: Props) {
  const item = getSkillsPage((await params).slug);
  if (!item) notFound();
  const crumbs = [{ name: "Home", path: "/" }, { name: "Resume skills", path: "/skills" }, { name: item.title, path: item.canonical }];
  return (
    <>
      <JsonLd data={[
        breadcrumbJsonLd(crumbs),
        itemListJsonLd(item.title, item.categories.map((category) => ({
          name: category.name,
          path: item.canonical,
          description: category.skills.join(", "),
        }))),
      ]} />
      <MarketingPage eyebrow="Resume skills" title={item.title} description={item.description}>
        <ContentBreadcrumbs items={crumbs} />
        <SkillsPanel page={item} />
        <p className="mt-8 max-w-3xl text-base leading-8 text-zinc-300">{item.advice}</p>
        <div className="mt-10"><SignInCta title="Tailor your skills to a real job" /></div>
        <div className="mt-12"><RelatedLinks links={item.relatedLinks} /></div>
      </MarketingPage>
    </>
  );
}
