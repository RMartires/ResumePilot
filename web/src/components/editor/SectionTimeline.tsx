"use client";

import { ChevronDown, Check, Loader2, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  canRemoveSection,
  getAvailableSectionsToAdd,
  SECTION_META,
  sortSections,
  type ResumeSection,
} from "@/lib/sections";
import type { SectionStatus } from "@/lib/section-status";

type SectionTimelineProps = {
  activeSections: ResumeSection[];
  activeSection: ResumeSection | null;
  statuses: Record<ResumeSection, SectionStatus>;
  onSectionChange: (section: ResumeSection | null) => void;
  onAddSection: (section: ResumeSection) => void;
  onRemoveSection: (section: ResumeSection) => void;
  children: (section: ResumeSection) => React.ReactNode;
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
  activeSections,
  activeSection,
  statuses,
  onSectionChange,
  onAddSection,
  onRemoveSection,
  children,
}: SectionTimelineProps) {
  const orderedSections = sortSections(activeSections);
  const availableSections = getAvailableSectionsToAdd(activeSections);

  return (
    <div className="flex flex-col">
      {orderedSections.map((sectionId, index) => {
        const expanded = activeSection === sectionId;
        const meta = SECTION_META[sectionId];
        const status = statuses[sectionId];
        const removable = canRemoveSection(sectionId);

        return (
          <div key={sectionId} className="relative flex gap-4 pb-6 last:pb-0">
            {index < orderedSections.length - 1 ? (
              <div className="absolute left-[11px] top-6 h-[calc(100%-12px)] w-0.5 bg-border" />
            ) : null}

            <SectionIndicator expanded={expanded} complete={status.complete} />

            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onSectionChange(expanded ? null : sectionId)
                  }
                  className="flex min-w-0 flex-1 items-start justify-between gap-2 text-left"
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

                {removable ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="mt-0.5 shrink-0 text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${meta.title}`}
                    onClick={() => onRemoveSection(sectionId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>

              {expanded ? (
                <div className="mt-4 rounded-xl border bg-card p-4 shadow-sm">
                  {children(sectionId)}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}

      {availableSections.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button type="button" variant="outline" size="sm" className="w-fit">
                <Plus className="mr-1 h-4 w-4" />
                Add section
              </Button>
            }
          />
          <DropdownMenuContent align="start">
            {availableSections.map((sectionId) => (
              <DropdownMenuItem
                key={sectionId}
                onClick={() => onAddSection(sectionId)}
              >
                {SECTION_META[sectionId].title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
