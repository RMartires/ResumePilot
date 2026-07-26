import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/LandingPage";
import { JsonLd } from "@/lib/seo/json-ld";
import { createMarketingMetadata } from "@/lib/seo/metadata";
import { siteDescription } from "@/lib/seo/site";
import {
  faqPageJsonLd,
  organizationJsonLd,
  softwareApplicationJsonLd,
} from "@/lib/seo/structured-data";
import { createClient } from "@/lib/supabase/server";

export const metadata = createMarketingMetadata({
  title: "ResumePilot — AI Resume Builder with ATS Optimization",
  description: siteDescription,
  path: "/",
});

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={softwareApplicationJsonLd()} />
      <JsonLd data={faqPageJsonLd()} />
      <LandingPage />
    </>
  );
}
