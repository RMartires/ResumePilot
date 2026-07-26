"use client";

import { ResumePreview } from "@/components/preview/ResumePreview";
import type { PublicTemplate } from "@/lib/seo/public-templates";
import { getPublicPreviewResume } from "@/lib/seo/preview-resume";

type PublicTemplatePreviewProps = {
  template: PublicTemplate;
};

export function PublicTemplatePreview({ template }: PublicTemplatePreviewProps) {
  const resume = getPublicPreviewResume(template.config);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#e8edf4] p-4 sm:p-6">
      <ResumePreview resume={resume} template={template.config} />
    </div>
  );
}
