import { notFound } from "next/navigation";
import { GuideArticleLayout } from "@/components/marketing/GuideArticleLayout";
import { SignInCta } from "@/components/marketing/SignInCta";
import { JsonLd } from "@/lib/seo/json-ld";
import { createContentMetadata, getGuide } from "@/lib/seo/content";
import { articleJsonLd, breadcrumbJsonLd, faqPageJsonLd, howToJsonLd } from "@/lib/seo/structured-data";

const guide = getGuide("how-to-make-a-resume");
export const metadata = guide ? createContentMetadata(guide) : {};

export default function MakeResumeGuidePage() {
  if (!guide) notFound();
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: guide.title, path: guide.canonical },
  ];
  return (
    <>
      <JsonLd data={[
        articleJsonLd({ headline: guide.title, description: guide.description, path: guide.canonical, datePublished: guide.datePublished, dateModified: guide.dateModified }),
        breadcrumbJsonLd(breadcrumbs),
        ...(guide.steps ? [howToJsonLd({ name: guide.title, description: guide.description, path: guide.canonical, steps: guide.steps })] : []),
        ...(guide.faqs ? [faqPageJsonLd(guide.faqs)] : []),
      ]} />
      <GuideArticleLayout guide={guide} breadcrumbs={breadcrumbs}>
        <SignInCta title="Turn the guide into a tailored resume" description="Build, tailor, score, and export your resume in one workflow." />
      </GuideArticleLayout>
    </>
  );
}
