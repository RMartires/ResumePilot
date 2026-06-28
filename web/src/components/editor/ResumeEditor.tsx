"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { SectionTimeline } from "@/components/editor/SectionTimeline";
import { PersonalInfoSection } from "@/components/editor/PersonalInfoSection";
import { SkillsSection } from "@/components/editor/SkillsSection";
import { ProjectsSection } from "@/components/editor/ProjectsSection";
import { ExperienceSection } from "@/components/editor/ExperienceSection";
import { EducationSection } from "@/components/editor/EducationSection";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { useDebouncedSave } from "@/hooks/useDebouncedSave";
import { resumeToJson } from "@/lib/resume";
import {
  getSectionStatuses,
  getSkillCountFromResume,
  type SectionId,
} from "@/lib/section-status";
import type { Resume } from "@/lib/validations/resume";
import type { TemplateConfig } from "@/lib/validations/resume";

type ResumeEditorProps = {
  resumeId: string;
  initialData: Resume;
  initialTitle: string;
  templateConfig?: TemplateConfig;
  onSave: (payload: { title: string; data: Resume }) => Promise<void>;
};

export function ResumeEditor({
  resumeId,
  initialData,
  initialTitle,
  templateConfig,
  onSave,
}: ResumeEditorProps) {
  const [resume, setResume] = useState<Resume>(initialData);
  const [title, setTitle] = useState(initialTitle);
  const [activeSection, setActiveSection] = useState<SectionId>("personal");
  const [expandedJob, setExpandedJob] = useState<number | null>(0);
  const [expandedProject, setExpandedProject] = useState<number | null>(0);
  const [expandedEducation, setExpandedEducation] = useState<number | null>(
    null,
  );
  const [saveStatus, setSaveStatus] = useState("Saved");
  const previewRef = useRef<HTMLDivElement>(null);

  const skillCount = getSkillCountFromResume(resume);
  const statuses = getSectionStatuses(resume, skillCount);

  useDebouncedSave(
    { resume: resumeToJson(resume), title },
    async ({ resume: r, title: t }) => {
    setSaveStatus("Saving…");
    try {
      await onSave({ title: t, data: resumeToJson(r) });
      setSaveStatus("Saved");
    } catch {
      setSaveStatus("Save failed");
      toast.error("Failed to save resume");
    }
  });

  const updateResume = (patch: Partial<Resume>) => {
    setResume((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      <EditorToolbar
        resumeId={resumeId}
        title={title}
        onTitleChange={setTitle}
        resume={resume}
        previewRef={previewRef}
        saveStatus={saveStatus}
        onImport={(data) => {
          setResume(data);
          toast.success("Resume imported");
        }}
      />

      <div className="grid flex-1 lg:grid-cols-2">
        <section className="overflow-y-auto border-r p-6">
          <SectionTimeline
            activeSection={activeSection}
            statuses={statuses}
            onSectionChange={setActiveSection}
          >
            {(section) => {
              switch (section) {
                case "personal":
                  return (
                    <PersonalInfoSection
                      header={resume.header}
                      summary={resume.summary}
                      onHeaderChange={(header) => updateResume({ header })}
                      onSummaryChange={(summary) => updateResume({ summary })}
                    />
                  );
                case "skills":
                  return (
                    <SkillsSection
                      skills={resume.skills}
                      onSkillsChange={(skills) => updateResume({ skills })}
                    />
                  );
                case "projects":
                  return (
                    <ProjectsSection
                      projects={resume.projects}
                      onChange={(projects) => updateResume({ projects })}
                      expandedIndex={expandedProject}
                      onExpandedChange={setExpandedProject}
                    />
                  );
                case "experience":
                  return (
                    <ExperienceSection
                      jobs={resume.experience}
                      onChange={(experience) => updateResume({ experience })}
                      expandedIndex={expandedJob}
                      onExpandedChange={setExpandedJob}
                    />
                  );
                case "education":
                  return (
                    <EducationSection
                      education={resume.education}
                      onChange={(education) => updateResume({ education })}
                      expandedSecondary={expandedEducation}
                      onExpandedSecondaryChange={setExpandedEducation}
                    />
                  );
                default:
                  return null;
              }
            }}
          </SectionTimeline>
        </section>

        <aside className="flex flex-col bg-[#e8edf4] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Live Preview
            </h2>
            <span className="text-xs text-muted-foreground">{saveStatus}</span>
          </div>
          <div className="flex-1 overflow-y-auto pb-4" ref={previewRef}>
            <ResumePreview resume={resumeToJson(resume)} template={templateConfig} />
          </div>
        </aside>
      </div>
    </div>
  );
}
