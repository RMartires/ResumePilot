import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentBreadcrumbs } from "@/components/marketing/ContentBreadcrumbs";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { ObjectiveList } from "@/components/marketing/ObjectiveList";
import { RelatedLinks } from "@/components/marketing/RelatedLinks";
import { SignInCta } from "@/components/marketing/SignInCta";
import { JsonLd } from "@/lib/seo/json-ld";
import { createContentMetadata, getObjectiveCollection, OBJECTIVE_COLLECTIONS, published } from "@/lib/seo/content";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/structured-data";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return published(OBJECTIVE_COLLECTIONS).map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getObjectiveCollection((await params).slug);
  return item ? createContentMetadata(item) : {};
}
export default async function ObjectivePage({ params }: Props) {
  const item = getObjectiveCollection((await params).slug);
  if (!item) notFound();
  const crumbs = [{ name: "Home", path: "/" }, { name: "Resume objectives", path: "/examples/objectives" }, { name: item.title, path: item.canonical }];
  return (
    <>
      <JsonLd data={[
        breadcrumbJsonLd(crumbs),
        itemListJsonLd(item.title, item.objectives.map((objective, index) => ({ name: `Objective example ${index + 1}`, path: `${item.canonical}#example-${index + 1}`, description: objective }))),
      ]} />
      <MarketingPage eyebrow="Resume objectives" title={item.title} description={item.description}>
        <ContentBreadcrumbs items={crumbs} />
        <ObjectiveList objectives={item.objectives} />
        <section className="mt-10"><h2 className="text-2xl font-semibold">How to adapt these examples</h2><ul className="mt-4 space-y-2 text-zinc-300">{item.tips.map((tip) => <li key={tip}>• {tip}</li>)}</ul></section>
        <div className="mt-10"><SignInCta title="Write an objective around your experience" /></div>
        <div className="mt-12"><RelatedLinks links={item.relatedLinks} /></div>
      </MarketingPage>
    </>
  );
}
