"use client";

import { ResumePreview } from "@/components/preview/ResumePreview";
import { emptyResume, normalizeResume } from "@/lib/resume";
import type { ResumeExample } from "@/lib/seo/content";
import { getPublicTemplate } from "@/lib/seo/public-templates";

export function RoleResumeExamplePreview({ example }: { example: ResumeExample }) {
  const empty = emptyResume();
  const resume = normalizeResume({
    ...empty,
    header: {
      ...empty.header,
      name: "Jordan Lee",
      email: "jordan@example.com",
      phone: "+1 555 0142",
      location: "Austin, TX",
      links: ["https://linkedin.com/in/example"],
    },
    summary: example.summary,
    skills: example.skills.join(", "),
    experience: example.experience.map((job) => ({
      ...job,
      location: "",
      startDate: "",
      endDate: "",
      current: job.dates.includes("Present"),
    })),
  });
  const template = getPublicTemplate("ats-single-column");

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#e8edf4] p-4 sm:p-6">
      <ResumePreview resume={resume} template={template?.config} />
    </div>
  );
}
