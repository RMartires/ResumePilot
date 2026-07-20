"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { AnalyticsEvent, track } from "@/lib/analytics/umami";
import { emptyResume } from "@/lib/resume";
import type { Template } from "@/lib/templates";
import { templateConfigSchema } from "@/lib/validations/resume";

function previewResumeForTemplate(config: ReturnType<typeof templateConfigSchema.parse>) {
  const base = {
    ...emptyResume(),
    header: {
      ...emptyResume().header,
      name: "Preview",
      email: "you@example.com",
      phone: "+1 555 0100",
      location: "San Francisco, CA",
      links: ["https://linkedin.com/in/you"],
    },
    summary: "Sample summary text for template preview.",
    skills: "React, TypeScript, Node.js",
  };

  if (config.layout === "sidebar") {
    return {
      ...base,
      education: {
        ...base.education,
        school: "State University",
        degree: "B.S. Computer Science",
        year: "2020",
      },
      experience: [
        {
          title: "Software Engineer",
          company: "Acme Corp",
          dates: "2021 – Present",
          location: "",
          startDate: "",
          endDate: "",
          current: true,
          bullets: ["Built features used by thousands of users."],
        },
      ],
      projects: [
        {
          name: "Sample Project",
          url: "",
          bullets: ["Open-source tool for resume building."],
        },
      ],
    };
  }

  return base;
}

type TemplateGalleryProps = {
  templates: Template[];
  activeTemplateId?: string | null;
  resumeId?: string;
};

export function TemplateGallery({
  templates,
  activeTemplateId,
  resumeId,
}: TemplateGalleryProps) {
  const router = useRouter();

  const applyTemplate = async (templateId: string) => {
    if (!resumeId) return;
    const res = await fetch(`/api/resumes/${resumeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_id: templateId }),
    });
    if (!res.ok) return;
    track(AnalyticsEvent.TemplateSelected, { template_id: templateId });
    router.refresh();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => {
        const config = templateConfigSchema.parse(template.config);
        const isActive = template.id === activeTemplateId;

        return (
          <Card key={template.id} className={isActive ? "ring-2 ring-blue-600" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {template.name}
                {isActive ? <Check className="h-5 w-5 text-blue-600" /> : null}
              </CardTitle>
              <CardDescription>{template.description}</CardDescription>
              {config.layout === "sidebar" ? (
                <p className="text-xs text-muted-foreground">
                  Default font: {config.fontFamily}
                </p>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-hidden rounded-md border bg-[#e8edf4] p-2">
                <div className="pointer-events-none origin-top scale-[0.45]">
                  <ResumePreview
                    resume={previewResumeForTemplate(config)}
                    template={config}
                  />
                </div>
              </div>
              {resumeId ? (
                <Button
                  className="w-full"
                  variant={isActive ? "secondary" : "default"}
                  disabled={isActive}
                  onClick={() => applyTemplate(template.id)}
                >
                  {isActive ? "Current template" : "Use template"}
                </Button>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
