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
} from "@/lib/section-status";
import {
  canRemoveSection,
  ResumeSection,
  sortSections,
} from "@/lib/sections";
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
  const [activeSection, setActiveSection] = useState<ResumeSection | null>(
    ResumeSection.Personal,
  );
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

  const handleAddSection = (section: ResumeSection) => {
    setResume((prev) => {
      if (prev.activeSections.includes(section)) return prev;
      return {
        ...prev,
        activeSections: sortSections([...prev.activeSections, section]),
      };
    });
    setActiveSection(section);
  };

  const handleRemoveSection = (section: ResumeSection) => {
    if (!canRemoveSection(section)) return;

    setResume((prev) => ({
      ...prev,
      activeSections: prev.activeSections.filter((item) => item !== section),
    }));

    if (activeSection === section) {
      setActiveSection(null);
    }
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
            activeSections={resume.activeSections}
            activeSection={activeSection}
            statuses={statuses}
            onSectionChange={setActiveSection}
            onAddSection={handleAddSection}
            onRemoveSection={handleRemoveSection}
          >
            {(section) => {
              switch (section) {
                case ResumeSection.Personal:
                  return (
                    <PersonalInfoSection
                      header={resume.header}
                      summary={resume.summary}
                      onHeaderChange={(header) => updateResume({ header })}
                      onSummaryChange={(summary) => updateResume({ summary })}
                    />
                  );
                case ResumeSection.Skills:
                  return (
                    <SkillsSection
                      skills={resume.skills}
                      onSkillsChange={(skills) => updateResume({ skills })}
                    />
                  );
                case ResumeSection.Projects:
                  return (
                    <ProjectsSection
                      projects={resume.projects}
                      onChange={(projects) => updateResume({ projects })}
                      expandedIndex={expandedProject}
                      onExpandedChange={setExpandedProject}
                    />
                  );
                case ResumeSection.Experience:
                  return (
                    <ExperienceSection
                      jobs={resume.experience}
                      onChange={(experience) => updateResume({ experience })}
                      expandedIndex={expandedJob}
                      onExpandedChange={setExpandedJob}
                    />
                  );
                case ResumeSection.Education:
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
