"use client";

import { Plus, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { emptyEducationEntry } from "@/lib/resume";
import type { Education, EducationEntry } from "@/lib/validations/resume";
import { cn } from "@/lib/utils";

type EducationSectionProps = {
  education: Education;
  onChange: (education: Education) => void;
  expandedSecondary: number | null;
  onExpandedSecondaryChange: (index: number | null) => void;
};

function EducationCardFields({
  entry,
  onChange,
}: {
  entry: EducationEntry;
  onChange: (entry: EducationEntry) => void;
}) {
  const update = (patch: Partial<EducationEntry>) =>
    onChange({ ...entry, ...patch });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>University / School</Label>
        <Input
          value={entry.school}
          onChange={(e) => update({ school: e.target.value })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Degree</Label>
          <Input
            value={entry.degree}
            onChange={(e) => update({ degree: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Field of Study</Label>
          <Input
            value={entry.fieldOfStudy}
            onChange={(e) => update({ fieldOfStudy: e.target.value })}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Graduation Date</Label>
          <Input
            type="date"
            value={entry.graduationDate}
            onChange={(e) =>
              update({
                graduationDate: e.target.value,
                year: e.target.value.slice(0, 4),
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Marks</Label>
          <Input
            value={entry.marks}
            onChange={(e) => update({ marks: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Marks Type</Label>
          <Select
            value={entry.marksType}
            onValueChange={(v) => update({ marksType: v ?? "CGPA" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CGPA">CGPA</SelectItem>
              <SelectItem value="Percentage">Percentage</SelectItem>
              <SelectItem value="GPA">GPA</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={entry.description}
          onChange={(e) => update({ description: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  );
}

export function EducationSection({
  education,
  onChange,
  expandedSecondary,
  onExpandedSecondaryChange,
}: EducationSectionProps) {
  const updatePrimary = (patch: Partial<EducationEntry>) => {
    onChange({ ...education, ...patch });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <p className="mb-3 text-sm font-medium">Education 1 (Primary)</p>
        <EducationCardFields entry={education} onChange={updatePrimary} />
      </div>

      {education.secondary.map((entry, index) => (
        <Collapsible
          key={index}
          open={expandedSecondary === index}
          onOpenChange={(open) =>
            onExpandedSecondaryChange(open ? index : null)
          }
        >
          <div className="rounded-lg border">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-3 text-left">
              <div>
                <p className="text-sm font-medium">
                  Custom Education {index + 1}
                </p>
                <p className="text-xs text-muted-foreground">
                  {entry.school || "Add education details"}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  expandedSecondary === index && "rotate-180",
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 border-t p-4">
              <EducationCardFields
                entry={entry}
                onChange={(updated) => {
                  const next = [...education.secondary];
                  next[index] = updated;
                  onChange({ ...education, secondary: next });
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  onChange({
                    ...education,
                    secondary: education.secondary.filter(
                      (_, i) => i !== index,
                    ),
                  });
                  onExpandedSecondaryChange(null);
                }}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Remove
              </Button>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          onChange({
            ...education,
            secondary: [...education.secondary, emptyEducationEntry()],
          });
          onExpandedSecondaryChange(education.secondary.length);
        }}
      >
        <Plus className="mr-1 h-4 w-4" />
        Add education
      </Button>
    </div>
  );
}
