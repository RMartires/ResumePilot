"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  SECTION_ORDER,
  type SectionId,
  type SectionStatus,
} from "@/lib/section-status";

type SectionTimelineProps = {
  activeSection: SectionId;
  statuses: Record<SectionId, SectionStatus>;
  onSectionChange: (section: SectionId) => void;
  children: (section: SectionId) => React.ReactNode;
};

const SECTION_META: Record<
  SectionId,
  { title: string; subtitle: string }
> = {
  personal: {
    title: "Personal Info and Socials",
    subtitle: "Lets get to know you! Fill in your personal details",
  },
  skills: {
    title: "Skills",
    subtitle: "Add skills that match the job you are applying for",
  },
  projects: {
    title: "Projects",
    subtitle: "Showcase your best work and side projects",
  },
  experience: {
    title: "Experience",
    subtitle: "Add your work history and internships",
  },
  education: {
    title: "Education",
    subtitle: "Add your academic background",
  },
};

export function SectionTimeline({
  activeSection,
  statuses,
  onSectionChange,
  children,
}: SectionTimelineProps) {
  return (
    <div className="flex flex-col">
      {SECTION_ORDER.map((sectionId, index) => {
        const expanded = activeSection === sectionId;
        const meta = SECTION_META[sectionId];
        const status = statuses[sectionId];

        return (
          <div key={sectionId} className="relative flex gap-4 pb-6 last:pb-0">
            {index < SECTION_ORDER.length - 1 ? (
              <div
                className={cn(
                  "absolute left-[11px] top-6 h-[calc(100%-12px)] w-0.5",
                  status.complete ? "bg-blue-600" : "bg-border",
                )}
              />
            ) : null}

            <div
              className={cn(
                "relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-background",
                status.complete
                  ? "border-blue-600 bg-blue-600 text-white"
                  : expanded
                    ? "border-blue-600"
                    : "border-muted-foreground/30",
              )}
            >
              {status.complete ? <Check className="h-3.5 w-3.5" /> : null}
            </div>

            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onSectionChange(sectionId)}
                className="flex w-full items-start justify-between gap-2 text-left"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm">{meta.title}</strong>
                    {status.complete && !expanded ? (
                      <Badge variant="secondary" className="text-xs">
                        Done
                      </Badge>
                    ) : null}
                  </div>
                  {expanded ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {meta.subtitle}
                    </p>
                  ) : (
                    <p
                      className={cn(
                        "mt-0.5 text-xs",
                        status.complete
                          ? "text-green-600"
                          : "text-muted-foreground",
                      )}
                    >
                      {status.label}
                    </p>
                  )}
                </div>
                <ChevronDown
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                    expanded && "rotate-180",
                  )}
                />
              </button>

              {expanded ? (
                <div className="mt-4 rounded-xl border bg-card p-4 shadow-sm">
                  {children(sectionId)}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
