"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { AnalyticsEvent } from "@/lib/analytics/umami";
import { trackSeoFunnelEvent } from "@/lib/analytics/seo-funnel";
import type { PublicTemplate } from "@/lib/seo/public-templates";
import { getPublicPreviewResume } from "@/lib/seo/preview-resume";

type PublicTemplateCardProps = {
  template: PublicTemplate;
};

export function PublicTemplateCard({ template }: PublicTemplateCardProps) {
  const resume = getPublicPreviewResume(template.config);
  const pathname = usePathname();

  const handleUseTemplate = () => {
    trackSeoFunnelEvent(AnalyticsEvent.MarketingCtaClicked, {
      source_page: pathname,
    });
    trackSeoFunnelEvent(AnalyticsEvent.TemplateCtaClicked, {
      source_page: pathname,
      template_slug: template.slug,
    });
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 bg-[#e8edf4] p-4">
        {/* Fixed height + absolute scale so transform overflow cannot bleed into the footer */}
        <div className="relative mx-auto h-64 overflow-hidden rounded">
          <div
            className="pointer-events-none absolute top-0 left-1/2 w-[220%] origin-top -translate-x-1/2 scale-[0.42] sm:w-[200%] sm:scale-[0.48]"
            aria-hidden
          >
            <ResumePreview resume={resume} template={template.config} />
          </div>
        </div>
      </div>
      <div className="p-5">
        <h2 className="text-lg font-semibold text-white">{template.name}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{template.description}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/templates/${template.slug}`}
            className="text-sm font-medium text-blue-300 hover:text-blue-200"
          >
            View details
          </Link>
          <Link
            href={`/login?redirect=${encodeURIComponent("/dashboard/templates")}`}
            onClick={handleUseTemplate}
            className="text-sm font-medium text-zinc-300 hover:text-white"
          >
            Use this template
          </Link>
        </div>
      </div>
    </article>
  );
}
