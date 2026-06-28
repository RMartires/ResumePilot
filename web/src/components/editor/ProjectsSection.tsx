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
import type { Project } from "@/lib/validations/resume";
import { cn } from "@/lib/utils";

type ProjectsSectionProps = {
  projects: Project[];
  onChange: (projects: Project[]) => void;
  expandedIndex: number | null;
  onExpandedChange: (index: number | null) => void;
};

export function ProjectsSection({
  projects,
  onChange,
  expandedIndex,
  onExpandedChange,
}: ProjectsSectionProps) {
  const updateProject = (index: number, patch: Partial<Project>) => {
    onChange(projects.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  };

  return (
    <div className="space-y-3">
      {projects.map((project, index) => (
        <Collapsible
          key={index}
          open={expandedIndex === index}
          onOpenChange={(open) => onExpandedChange(open ? index : null)}
        >
          <div className="rounded-lg border">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-3 text-left">
              <div>
                <p className="text-sm font-medium">Project {index + 1}</p>
                <p className="text-xs text-muted-foreground">
                  {project.name || "Add project details"}
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
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input
                  value={project.name}
                  onChange={(e) =>
                    updateProject(index, { name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  value={project.url}
                  onChange={(e) =>
                    updateProject(index, { url: e.target.value })
                  }
                  placeholder="https://github.com/..."
                />
              </div>
              <RichTextEditor
                label="Key Points"
                variant="bullets"
                value={project.bullets.length ? project.bullets : [""]}
                onChange={(bullets) =>
                  updateProject(index, {
                    bullets: Array.isArray(bullets) ? bullets : [bullets],
                  })
                }
                placeholder="Describe your project impact, tech stack, and outcomes…"
              />
              {projects.length > 1 ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    onChange(projects.filter((_, i) => i !== index));
                    onExpandedChange(null);
                  }}
                >
                  Remove project
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
          onChange([...projects, { name: "", url: "", bullets: [""] }]);
          onExpandedChange(projects.length);
        }}
      >
        <Plus className="mr-1 h-4 w-4" />
        Add project
      </Button>
    </div>
  );
}
