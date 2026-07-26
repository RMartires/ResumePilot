import type { ReactNode } from "react";
import { MarketingPage } from "./MarketingPage";
import { ContentBreadcrumbs } from "./ContentBreadcrumbs";
import { RelatedLinks } from "./RelatedLinks";
import type { Guide, RelatedLink } from "@/lib/seo/content";

type Props = {
  guide: Guide;
  breadcrumbs: { name: string; path: string }[];
  children?: ReactNode;
  relatedLinks?: RelatedLink[];
};

export function GuideArticleLayout({
  guide,
  breadcrumbs,
  children,
  relatedLinks = guide.relatedLinks,
}: Props) {
  return (
    <MarketingPage eyebrow="Resume guide" title={guide.title} description={guide.description}>
      <ContentBreadcrumbs items={breadcrumbs} />
      <article className="max-w-3xl space-y-8 text-base leading-8 text-zinc-300">
        <p className="text-lg text-zinc-200">{guide.intro}</p>
        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-semibold text-white">{section.heading}</h2>
            <p className="mt-3">{section.body}</p>
          </section>
        ))}
        <section>
          <h2 className="text-2xl font-semibold text-white">Application checklist</h2>
          <ol className="mt-4 space-y-3">
            {guide.steps.map((step) => (
              <li key={step.name}>
                <strong className="text-white">{step.name}:</strong> {step.text}
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-white">Frequently asked questions</h2>
          <div className="mt-4 space-y-6">
            {guide.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                <p className="mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
        {children}
      </article>
      <div className="mt-12"><RelatedLinks links={relatedLinks} /></div>
    </MarketingPage>
  );
}
