"use client";

import { ChevronDown, Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  SECTION_ORDER,
  type SectionId,
  type SectionStatus,
} from "@/lib/section-status";

type SectionTimelineProps = {
  activeSection: SectionId | null;
  statuses: Record<SectionId, SectionStatus>;
  onSectionChange: (section: SectionId | null) => void;
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

function SectionIndicator({
  expanded,
  complete,
}: {
  expanded: boolean;
  complete: boolean;
}) {
  if (expanded) {
    return (
      <div className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-green-600 bg-background">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-green-600" />
      </div>
    );
  }

  if (complete) {
    return (
      <div className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-green-600 bg-green-600 text-white">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </div>
    );
  }

  return (
    <div className="relative z-10 mt-1 flex h-6 w-6 shrink-0 rounded-full border-2 border-muted-foreground/25 bg-background" />
  );
}

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
              <div className="absolute left-[11px] top-6 h-[calc(100%-12px)] w-0.5 bg-border" />
            ) : null}

            <SectionIndicator expanded={expanded} complete={status.complete} />

            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() =>
                  onSectionChange(expanded ? null : sectionId)
                }
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
