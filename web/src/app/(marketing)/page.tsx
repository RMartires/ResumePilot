import { LandingPage } from "@/components/landing/LandingPage";
import { JsonLd } from "@/lib/seo/json-ld";
import { createMarketingMetadata } from "@/lib/seo/metadata";
import { siteDescription } from "@/lib/seo/site";
import {
  faqPageJsonLd,
  organizationJsonLd,
  softwareApplicationJsonLd,
} from "@/lib/seo/structured-data";

export const metadata = createMarketingMetadata({
  title: "ResumePilot — AI Resume Builder with ATS Optimization",
  description: siteDescription,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={softwareApplicationJsonLd()} />
      <JsonLd data={faqPageJsonLd()} />
      <LandingPage />
    </>
  );
}
