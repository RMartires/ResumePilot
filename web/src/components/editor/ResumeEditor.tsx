"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ResumeDiffPanel } from "@/components/ai/ResumeDiffPanel";
import { SectionTimeline } from "@/components/editor/SectionTimeline";
import { PersonalInfoSection } from "@/components/editor/PersonalInfoSection";
import { SkillsSection } from "@/components/editor/SkillsSection";
import { ProjectsSection } from "@/components/editor/ProjectsSection";
import { ExperienceSection } from "@/components/editor/ExperienceSection";
import { EducationSection } from "@/components/editor/EducationSection";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { ResumeAiChatPanel } from "@/components/ai/ResumeAiChatPanel";
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
import { computeResumeDiff } from "@/lib/ai/diff-resume";
import type { PendingPatch } from "@/lib/ai/extract-proposals";

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
  const [activeSection, setActiveSection] = useState<SectionId | null>(
    "personal",
  );
  const [expandedJob, setExpandedJob] = useState<number | null>(0);
  const [expandedProject, setExpandedProject] = useState<number | null>(0);
  const [expandedEducation, setExpandedEducation] = useState<number | null>(
    null,
  );
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [aiPreviewResume, setAiPreviewResume] = useState<Resume | null>(null);
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

  const handleActivePatchChange = useCallback(
    (_patch: PendingPatch | null, proposed: Resume | null) => {
      setAiPreviewResume((current) => {
        if (proposed === null) {
          return current === null ? current : null;
        }
        if (
          current &&
          JSON.stringify(current) === JSON.stringify(proposed)
        ) {
          return current;
        }
        return proposed;
      });
    },
    [],
  );

  const handleApplyResume = useCallback((data: Resume) => {
    setResume(data);
    setAiPreviewResume(null);
  }, []);

  const previewDiffs = useMemo(() => {
    if (!aiPreviewResume) return null;
    return computeResumeDiff(resume, aiPreviewResume);
  }, [aiPreviewResume, resume]);

  const displayedPreview = aiPreviewResume ?? resume;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] min-h-0 flex-col overflow-hidden">
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

      <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(280px,22rem)_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)]">
        <section className="min-h-0 overflow-y-auto border-r p-6">
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

        <ResumeAiChatPanel
          resumeId={resumeId}
          resume={resume}
          onApplyResume={handleApplyResume}
          onActivePatchChange={handleActivePatchChange}
        />

        <aside className="flex min-h-0 flex-col overflow-hidden bg-[#e8edf4] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {aiPreviewResume ? "AI Preview" : "Live Preview"}
            </h2>
            <span className="text-xs text-muted-foreground">
              {aiPreviewResume ? "Pending approval" : saveStatus}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto pb-4" ref={previewRef}>
            {aiPreviewResume && previewDiffs && (
              <ResumeDiffPanel diffs={previewDiffs} />
            )}
            <div
              className={
                aiPreviewResume
                  ? "rounded-lg ring-2 ring-amber-400/70 ring-offset-2 ring-offset-[#e8edf4]"
                  : undefined
              }
            >
              <ResumePreview
                resume={resumeToJson(displayedPreview)}
                template={templateConfig}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
