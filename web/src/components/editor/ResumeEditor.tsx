"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

const PREVIEW_OPEN_STORAGE_KEY = "resume-editor-preview-open";
const EDITOR_OPEN_STORAGE_KEY = "resume-editor-editor-open";

function getEditorGridClassName(editorOpen: boolean, previewOpen: boolean): string {
  if (editorOpen && previewOpen) {
    return "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]";
  }
  if (editorOpen && !previewOpen) {
    return "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]";
  }
  if (!editorOpen && previewOpen) {
    return "lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)]";
  }
  return "lg:grid-cols-[auto_minmax(0,1fr)_auto]";
}

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
  const [editorOpen, setEditorOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);
  const patchReviewHandlersRef = useRef<PatchReviewHandlers | null>(null);

  const skillCount = getSkillCountFromResume(resume);
  const statuses = getSectionStatuses(resume, skillCount);

  useEffect(() => {
    const storedPreview = localStorage.getItem(PREVIEW_OPEN_STORAGE_KEY);
    if (storedPreview === "false") {
      setPreviewOpen(false);
    }

    const storedEditor = localStorage.getItem(EDITOR_OPEN_STORAGE_KEY);
    if (storedEditor === "false") {
      setEditorOpen(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PREVIEW_OPEN_STORAGE_KEY, String(previewOpen));
  }, [previewOpen]);

  useEffect(() => {
    localStorage.setItem(EDITOR_OPEN_STORAGE_KEY, String(editorOpen));
  }, [editorOpen]);

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

  useEffect(() => {
    if (hasPendingAiChanges) {
      setPreviewOpen(true);
    }
  }, [hasPendingAiChanges]);

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

      <div
        className={cn(
          "grid min-h-0 flex-1 overflow-hidden lg:grid-rows-[minmax(0,1fr)]",
          getEditorGridClassName(editorOpen, previewOpen),
        )}
      >
        <section
          className={cn(
            "relative flex min-h-0 min-w-0 flex-col overflow-hidden border-r bg-background",
            editorOpen ? "p-6" : "w-10",
          )}
        >
          {editorOpen ? (
            <>
              <div className="mb-4 flex shrink-0 items-center justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Editor
                  </h2>
                  <span className="truncate text-xs text-muted-foreground">
                    Resume sections
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-muted-foreground"
                  onClick={() => setEditorOpen(false)}
                  aria-label="Collapse editor panel"
                >
                  <ChevronLeft className="size-4" />
                </Button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
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
                            onSummaryChange={(summary) =>
                              updateResume({ summary })
                            }
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
                            onChange={(experience) =>
                              updateResume({ experience })
                            }
                            expandedIndex={expandedJob}
                            onExpandedChange={setExpandedJob}
                          />
                        );
                      case ResumeSection.Education:
                        return (
                          <EducationSection
                            education={resume.education}
                            onChange={(education) =>
                              updateResume({ education })
                            }
                            expandedSecondary={expandedEducation}
                            onExpandedSecondaryChange={setExpandedEducation}
                          />
                        );
                      default:
                        return null;
                    }
                  }}
                </SectionTimeline>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center py-4">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground"
                onClick={() => setEditorOpen(true)}
                aria-label="Expand editor panel"
              >
                <ChevronRight className="size-4" />
              </Button>
              <span
                className="mt-3 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase [writing-mode:vertical-rl]"
                aria-hidden
              >
                Editor
              </span>
            </div>
          )}
        </section>

        <ResumeAiChatPanel
          resumeId={resumeId}
          resume={resume}
          onApplyResume={handleApplyResume}
          onActiveProposalChange={handleActiveProposalChange}
          patchReviewHandlersRef={patchReviewHandlersRef}
        />

        <aside
          className={cn(
            "relative flex min-h-0 min-w-0 flex-col overflow-hidden bg-[#e8edf4]",
            previewOpen ? "px-4 py-4" : "w-10 border-l",
          )}
        >
          {previewOpen ? (
            <>
              <div className="mb-3 flex shrink-0 items-center justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {hasPendingAiChanges ? "AI Preview" : "Live Preview"}
                  </h2>
                  <span className="truncate text-xs text-muted-foreground">
                    {hasPendingAiChanges ? "Pending approval" : saveStatus}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-muted-foreground"
                  onClick={() => setPreviewOpen(false)}
                  aria-label="Collapse preview panel"
                >
                  <ChevronRight className="size-4" />
                </Button>
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
            </>
          ) : (
            <div className="flex h-full flex-col items-center py-4">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground"
                onClick={() => setPreviewOpen(true)}
                aria-label="Expand preview panel"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span
                className="mt-3 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase [writing-mode:vertical-rl]"
                aria-hidden
              >
                Preview
              </span>
              {hasPendingAiChanges && (
                <span
                  className="mt-2 size-2 rounded-full bg-emerald-500"
                  aria-label="Pending AI changes"
                />
              )}
            </div>
          )}

          <div
            className={cn(
              "min-h-0 overflow-y-auto pb-4",
              previewOpen ? "flex-1" : "sr-only",
            )}
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
