"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Resume } from "@/lib/validations/resume";

type PersonalInfoSectionProps = {
  header: Resume["header"];
  summary: string;
  onHeaderChange: (header: Resume["header"]) => void;
  onSummaryChange: (summary: string) => void;
};

export function PersonalInfoSection({
  header,
  summary,
  onHeaderChange,
  onSummaryChange,
}: PersonalInfoSectionProps) {
  const update = (patch: Partial<Resume["header"]>) =>
    onHeaderChange({ ...header, ...patch });

  const phoneMatch = header.phone.match(/^(\+\d+)[\s-]?(.*)$/);
  const phoneCode = phoneMatch?.[1] ?? "+91";
  const phoneNumber = phoneMatch?.[2] ?? header.phone;

  const linkedin =
    header.links.find((l) => /linkedin\.com/i.test(l)) ?? "";
  const github = header.links.find((l) => /github\.com/i.test(l)) ?? "";
  const website =
    header.links.find(
      (l) => l && !/linkedin\.com/i.test(l) && !/github\.com/i.test(l),
    ) ?? "";

  const setSocial = (type: "linkedin" | "github" | "website", value: string) => {
    const others = header.links.filter((l) => {
      if (type === "linkedin") return !/linkedin\.com/i.test(l);
      if (type === "github") return !/github\.com/i.test(l);
      return /linkedin\.com/i.test(l) || /github\.com/i.test(l);
    });
    const next = [value, ...others.filter(Boolean)].filter(Boolean);
    update({ links: next.length ? next : [""] });
  };

  const customLinks = header.links.filter(
    (l) =>
      l &&
      !/linkedin\.com/i.test(l) &&
      !/github\.com/i.test(l) &&
      l !== website,
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={header.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Rohit Martires"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Contact Number *</Label>
          <div className="flex gap-2">
            <Select
              value={phoneCode}
              onValueChange={(code) =>
                update({ phone: `${code}${phoneNumber ? `-${phoneNumber}` : ""}` })
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+91">+91</SelectItem>
                <SelectItem value="+1">+1</SelectItem>
                <SelectItem value="+44">+44</SelectItem>
                <SelectItem value="+61">+61</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) =>
                update({
                  phone: `${phoneCode}${e.target.value ? `-${e.target.value}` : ""}`,
                })
              }
              placeholder="9881611398"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={header.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">City</Label>
          <Input
            id="location"
            value={header.location}
            onChange={(e) => update({ location: e.target.value })}
            placeholder="Margao, India"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={header.gender || "prefer-not"}
            onValueChange={(v) =>
              update({ gender: v === "prefer-not" || !v ? "" : v })
            }
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prefer-not">Prefer not to say</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn *</Label>
        <Input
          id="linkedin"
          value={linkedin}
          onChange={(e) => setSocial("linkedin", e.target.value)}
          placeholder="https://linkedin.com/in/yourprofile"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="github">GitHub</Label>
        <Input
          id="github"
          value={github}
          onChange={(e) => setSocial("github", e.target.value)}
          placeholder="https://github.com/username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={website}
          onChange={(e) => setSocial("website", e.target.value)}
          placeholder="https://yoursite.com"
        />
      </div>

      {customLinks.map((link, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={link}
            onChange={(e) => {
              const next = [...customLinks];
              next[i] = e.target.value;
              update({
                links: [
                  linkedin,
                  github,
                  website,
                  ...next.filter(Boolean),
                ].filter(Boolean),
              });
            }}
            placeholder="https://"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              const next = customLinks.filter((_, idx) => idx !== i);
              update({
                links: [linkedin, github, website, ...next].filter(Boolean),
              });
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          update({ links: [...header.links.filter(Boolean), ""] })
        }
      >
        <Plus className="mr-1 h-4 w-4" />
        Add profile link
      </Button>

      <div className="space-y-2 border-t pt-4">
        <Label htmlFor="summary">Professional Summary</Label>
        <textarea
          id="summary"
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder="Brief overview of your experience and strengths..."
        />
      </div>
    </div>
  );
}
