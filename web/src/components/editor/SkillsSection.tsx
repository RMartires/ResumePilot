"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  POPULAR_SKILLS,
  hasSkill,
  parseSkillInput,
  parseSkillsString,
  serializeSkills,
  skillLabel,
  type SkillEntry,
} from "@/lib/skills";

type SkillsSectionProps = {
  skills: string;
  onSkillsChange: (skills: string) => void;
};

export function SkillsSection({ skills, onSkillsChange }: SkillsSectionProps) {
  const [search, setSearch] = useState("");
  const [grouped, setGrouped] = useState(() => skills.includes("|"));

  const selectedSkills = useMemo(() => parseSkillsString(skills), [skills]);

  const syncSkills = (entries: SkillEntry[]) => {
    onSkillsChange(serializeSkills(entries, grouped));
  };

  const addSkill = (entry: SkillEntry) => {
    if (hasSkill(selectedSkills, entry.name)) return;
    syncSkills([...selectedSkills, entry]);
    setSearch("");
  };

  const removeSkill = (name: string) => {
    syncSkills(selectedSkills.filter((s) => s.name !== name));
  };

  const suggestions = POPULAR_SKILLS.filter(
    (s) =>
      s.toLowerCase().includes(search.toLowerCase()) &&
      !hasSkill(selectedSkills, s),
  ).slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedSkills.map((skill) => (
          <Badge key={skill.name} variant="secondary" className="gap-1 pr-1">
            {skillLabel(skill)}
            <button
              type="button"
              onClick={() => removeSkill(skill.name)}
              className="ml-1 rounded-full hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="skill-search">Search or add skills</Label>
        <Input
          id="skill-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const parsed = parseSkillInput(search);
              if (parsed) addSkill(parsed);
            }
          }}
          placeholder="Type a skill and press Enter"
        />
        {search && suggestions.length > 0 ? (
          <div className="rounded-md border bg-popover p-1 shadow-sm">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className="hover:bg-accent w-full rounded px-3 py-1.5 text-left text-sm"
                onClick={() =>
                  addSkill({ name: s, years: null, category: undefined })
                }
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <p className="mb-2 text-xs text-muted-foreground">Popular skills</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SKILLS.slice(0, 12).map((s) => (
            <Button
              key={s}
              type="button"
              variant="outline"
              size="sm"
              disabled={hasSkill(selectedSkills, s)}
              onClick={() =>
                addSkill({ name: s, years: null, category: undefined })
              }
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={grouped}
          onChange={(e) => {
            setGrouped(e.target.checked);
            onSkillsChange(serializeSkills(selectedSkills, e.target.checked));
          }}
        />
        Group skills by category (Languages, Libraries, Tools)
      </label>
    </div>
  );
}
