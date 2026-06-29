"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AiChangeReviewBar } from "@/components/ai/AiChangeReviewBar";
import { ResumeAiChatPanel } from "@/components/ai/ResumeAiChatPanel";
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
import { computePreviewHighlights } from "@/lib/ai/diff-resume";
import type { StructuredResumeProposal } from "@/lib/ai/extract-structured-proposal";
import type { PatchReviewHandlers } from "@/lib/ai/types";

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
  const [aiPreviewResume, setAiPreviewResume] = useState<Resume | null>(null);
  const [activeProposal, setActiveProposal] =
    useState<StructuredResumeProposal | null>(null);
  const [showAiHighlights, setShowAiHighlights] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);
  const patchReviewHandlersRef = useRef<PatchReviewHandlers | null>(null);

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

  const handleActiveProposalChange = useCallback(
    (proposal: StructuredResumeProposal | null, proposed: Resume | null) => {
      setActiveProposal(proposal);
      if (proposal) {
        setShowAiHighlights(true);
      }

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
    setActiveProposal(null);
  }, []);

  const previewHighlights = useMemo(() => {
    if (!aiPreviewResume) return [];
    return computePreviewHighlights(resume, aiPreviewResume);
  }, [aiPreviewResume, resume]);

  const uniqueHighlightCount = useMemo(() => {
    const ids = new Set(
      previewHighlights
        .map((item) => item.id)
        .filter(
          (id) =>
            !id.startsWith("experience:") &&
            !id.startsWith("project:") &&
            id !== "experience" &&
            id !== "projects",
        ),
    );
    return ids.size;
  }, [previewHighlights]);

  const displayedPreview = aiPreviewResume ?? resume;
  const hasPendingAiChanges = Boolean(aiPreviewResume && activeProposal);


  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
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

      <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-3 lg:grid-rows-[minmax(0,1fr)]">
        <section className="min-h-0 min-w-0 overflow-y-auto border-r p-6">
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

        <ResumeAiChatPanel
          resumeId={resumeId}
          resume={resume}
          onApplyResume={handleApplyResume}
          onActiveProposalChange={handleActiveProposalChange}
          patchReviewHandlersRef={patchReviewHandlersRef}
        />

        <aside className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-[#e8edf4] px-4 py-4">
          <div className="mb-3 flex shrink-0 items-center justify-between gap-2">
            <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {hasPendingAiChanges ? "AI Preview" : "Live Preview"}
            </h2>
            <span className="truncate text-xs text-muted-foreground">
              {hasPendingAiChanges ? "Pending approval" : saveStatus}
            </span>
          </div>

          {hasPendingAiChanges && (
            <AiChangeReviewBar
              changeCount={uniqueHighlightCount || 1}
              showHighlights={showAiHighlights}
              onAccept={() => patchReviewHandlersRef.current?.accept()}
              onToggleHighlights={() =>
                setShowAiHighlights((current) => !current)
              }
              onDecline={() => patchReviewHandlersRef.current?.decline()}
            />
          )}

          <div
            className="min-h-0 flex-1 overflow-y-auto pb-4"
            ref={previewRef}
          >
            <div
              className={
                hasPendingAiChanges
                  ? "rounded-lg ring-2 ring-emerald-400/50 ring-offset-2 ring-offset-[#e8edf4]"
                  : undefined
              }
            >
              <ResumePreview
                resume={resumeToJson(displayedPreview)}
                compareResume={
                  hasPendingAiChanges ? resumeToJson(resume) : undefined
                }
                highlights={previewHighlights}
                showHighlights={hasPendingAiChanges && showAiHighlights}
                template={templateConfig}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
