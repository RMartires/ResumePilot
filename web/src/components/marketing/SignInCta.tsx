"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnalyticsEvent } from "@/lib/analytics/umami";
import { trackSeoFunnelEvent } from "@/lib/analytics/seo-funnel";

type SignInCtaProps = {
  title?: string;
  description?: string;
  href?: string;
  label?: string;
  templateSlug?: string;
};

export function SignInCta({
  title = "Build your resume in ResumePilot",
  description = "Save versions, tailor to each job description, and export ATS-safe PDFs.",
  href = "/#sign-in",
  label = "Get started free",
  templateSlug,
}: SignInCtaProps) {
  const pathname = usePathname();

  const handleClick = () => {
    trackSeoFunnelEvent(AnalyticsEvent.MarketingCtaClicked, {
      source_page: pathname,
    });
    if (templateSlug) {
      trackSeoFunnelEvent(AnalyticsEvent.TemplateCtaClicked, {
        source_page: pathname,
        template_slug: templateSlug,
      });
    }
  };

  return (
    <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-600/20 to-blue-700/10 px-6 py-8 text-center sm:px-10">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-300 sm:text-base">
        {description}
      </p>
      <Link
        href={href}
        onClick={handleClick}
        className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
      >
        {label}
      </Link>
    </div>
  );
}
