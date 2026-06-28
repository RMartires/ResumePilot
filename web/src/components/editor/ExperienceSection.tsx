"use client";

import { Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { serializeJobDates, collapsedJobSubtitle } from "@/lib/experience";
import type { Job } from "@/lib/validations/resume";
import { cn } from "@/lib/utils";

type ExperienceSectionProps = {
  jobs: Job[];
  onChange: (jobs: Job[]) => void;
  expandedIndex: number | null;
  onExpandedChange: (index: number | null) => void;
};

export function ExperienceSection({
  jobs,
  onChange,
  expandedIndex,
  onExpandedChange,
}: ExperienceSectionProps) {
  const updateJob = (index: number, patch: Partial<Job>) => {
    const next = jobs.map((job, i) => {
      if (i !== index) return job;
      const updated = { ...job, ...patch };
      if ("startDate" in patch || "endDate" in patch || "current" in patch) {
        updated.dates = serializeJobDates(
          updated.startDate,
          updated.endDate,
          updated.current,
        );
      }
      return updated;
    });
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {jobs.map((job, index) => (
        <Collapsible
          key={index}
          open={expandedIndex === index}
          onOpenChange={(open) => onExpandedChange(open ? index : null)}
        >
          <div className="rounded-lg border">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-3 text-left">
              <div>
                <p className="text-sm font-medium">
                  Experience {index + 1}
                </p>
                <p className="text-xs text-muted-foreground">
                  {collapsedJobSubtitle(job)}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  expandedIndex === index && "rotate-180",
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 border-t p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    value={job.title}
                    onChange={(e) =>
                      updateJob(index, { title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={job.company}
                    onChange={(e) =>
                      updateJob(index, { company: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={job.startDate}
                    onChange={(e) =>
                      updateJob(index, { startDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={job.endDate}
                    disabled={job.current}
                    onChange={(e) =>
                      updateJob(index, { endDate: e.target.value })
                    }
                  />
                </div>
                <label className="flex items-end gap-2 pb-2 text-sm">
                  <input
                    type="checkbox"
                    checked={job.current}
                    onChange={(e) =>
                      updateJob(index, { current: e.target.checked })
                    }
                  />
                  Currently working here
                </label>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={job.location}
                  onChange={(e) =>
                    updateJob(index, { location: e.target.value })
                  }
                />
              </div>

              <RichTextEditor
                label="Key Points"
                variant="bullets"
                value={job.bullets.length ? job.bullets : [""]}
                onChange={(bullets) =>
                  updateJob(index, {
                    bullets:
                      Array.isArray(bullets) && bullets.filter(Boolean).length
                        ? bullets
                        : [""],
                  })
                }
                placeholder="Built X using Y, achieving Z metric"
              />

              {jobs.length > 1 ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    onChange(jobs.filter((_, i) => i !== index));
                    onExpandedChange(null);
                  }}
                >
                  Remove experience
                </Button>
              ) : null}
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          onChange([
            ...jobs,
            {
              title: "",
              company: "",
              dates: "",
              location: "",
              startDate: "",
              endDate: "",
              current: false,
              bullets: [""],
            },
          ]);
          onExpandedChange(jobs.length);
        }}
      >
        <Plus className="mr-1 h-4 w-4" />
        Add experience
      </Button>
    </div>
  );
}
