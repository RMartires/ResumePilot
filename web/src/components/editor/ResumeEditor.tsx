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
import {
  clampPreviewZoom,
  DEFAULT_PREVIEW_ZOOM,
  PREVIEW_ZOOM_STORAGE_KEY,
  PreviewZoomControls,
} from "@/components/preview/PreviewZoomControls";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { CollapsedPanelStrip } from "@/components/editor/CollapsedPanelStrip";
import {
  EditorMobileNav,
  MOBILE_NAV_BOTTOM_OFFSET,
  type MobileEditorPanel,
} from "@/components/editor/EditorMobileNav";
import { PendingAiIndicator } from "@/components/editor/PendingAiIndicator";
import { Button } from "@/components/ui/button";
import { useDebouncedSave } from "@/hooks/useDebouncedSave";
import { useMediaQuery } from "@/hooks/useMediaQuery";
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

function mobilePanelHidden(active: MobileEditorPanel, panel: MobileEditorPanel) {
  return active !== panel ? "max-lg:hidden" : undefined;
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
  const [mobilePanel, setMobilePanel] = useState<MobileEditorPanel>("editor");
  const [previewZoom, setPreviewZoom] = useState(DEFAULT_PREVIEW_ZOOM);
  const previewRef = useRef<HTMLDivElement>(null);
  const patchReviewHandlersRef = useRef<PatchReviewHandlers | null>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

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

    const storedZoom = localStorage.getItem(PREVIEW_ZOOM_STORAGE_KEY);
    if (storedZoom) {
      const parsed = Number(storedZoom);
      if (!Number.isNaN(parsed)) {
        setPreviewZoom(clampPreviewZoom(parsed));
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PREVIEW_OPEN_STORAGE_KEY, String(previewOpen));
  }, [previewOpen]);

  useEffect(() => {
    localStorage.setItem(EDITOR_OPEN_STORAGE_KEY, String(editorOpen));
  }, [editorOpen]);

  useEffect(() => {
    localStorage.setItem(PREVIEW_ZOOM_STORAGE_KEY, String(previewZoom));
  }, [previewZoom]);

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
  const renderPreviewDocument = isDesktop || mobilePanel === "preview";
  const chatAutoScroll = isDesktop || mobilePanel === "chat";

  const handleAcceptAiChanges = useCallback(() => {
    patchReviewHandlersRef.current?.accept();
  }, []);

  const handleDeclineAiChanges = useCallback(() => {
    patchReviewHandlersRef.current?.decline();
  }, []);

  const handleToggleAiHighlights = useCallback(() => {
    setShowAiHighlights((current) => !current);
  }, []);

  useEffect(() => {
    if (hasPendingAiChanges) {
      setPreviewOpen(true);
      setMobilePanel("preview");
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
        onImport={(data) => {
          setResume(data);
          toast.success("Resume imported");
        }}
      />

      <div
        className={cn(
          "grid min-h-0 flex-1 overflow-hidden max-lg:grid-cols-1 max-lg:grid-rows-1",
          getEditorGridClassName(editorOpen, previewOpen),
        )}
      >
        <section
          className={cn(
            "relative flex min-h-0 min-w-0 flex-col overflow-hidden border-r bg-background max-lg:border-0",
            mobilePanelHidden(mobilePanel, "editor"),
            editorOpen ? "lg:p-6" : "lg:w-10",
          )}
        >
          <div className={cn("flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", !editorOpen && "lg:hidden")}>
            <div className="mb-4 flex shrink-0 items-center justify-between gap-2 max-lg:mb-3 max-lg:px-4 max-lg:pt-4">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold lg:text-xs lg:font-semibold lg:tracking-wider lg:text-muted-foreground lg:uppercase">
                  Editor
                </h2>
                <span className="text-xs text-muted-foreground">
                  Resume sections
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="hidden shrink-0 text-muted-foreground lg:inline-flex"
                onClick={() => setEditorOpen(false)}
                aria-label="Collapse editor panel"
              >
                <ChevronLeft className="size-4" />
              </Button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto max-lg:px-4 max-lg:pb-4">
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
          </div>

          {!editorOpen ? (
            <CollapsedPanelStrip
              label="Editor"
              expandDirection="right"
              onExpand={() => setEditorOpen(true)}
            />
          ) : null}
        </section>

        <ResumeAiChatPanel
          resumeId={resumeId}
          resume={resume}
          onApplyResume={handleApplyResume}
          onActiveProposalChange={handleActiveProposalChange}
          patchReviewHandlersRef={patchReviewHandlersRef}
          headerClassName="hidden lg:block"
          autoScroll={chatAutoScroll}
          className={cn(mobilePanelHidden(mobilePanel, "chat"), "max-lg:border-0")}
        />

        <aside
          className={cn(
            "relative flex min-h-0 min-w-0 flex-col overflow-hidden bg-[#e8edf4]",
            mobilePanelHidden(mobilePanel, "preview"),
            previewOpen ? "lg:px-4 lg:py-4" : "lg:w-10 lg:border-l",
          )}
        >
          <div className={cn(!previewOpen && "lg:hidden")}>
            <div className="mb-3 hidden shrink-0 items-center justify-between gap-2 lg:flex">
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

            {hasPendingAiChanges ? (
              <div className="shrink-0 px-3 pt-3 lg:px-0 lg:pt-0">
                <AiChangeReviewBar
                  changeCount={uniqueHighlightCount || 1}
                  showHighlights={showAiHighlights}
                  onAccept={handleAcceptAiChanges}
                  onToggleHighlights={handleToggleAiHighlights}
                  onDecline={handleDeclineAiChanges}
                />
              </div>
            ) : null}

            <div className="mb-3 hidden shrink-0 justify-center lg:flex">
              <PreviewZoomControls
                zoom={previewZoom}
                onZoomChange={setPreviewZoom}
              />
            </div>

            <div
              className="pointer-events-none absolute inset-x-0 z-10 flex justify-center lg:hidden"
              style={{ bottom: MOBILE_NAV_BOTTOM_OFFSET }}
            >
              <PreviewZoomControls
                zoom={previewZoom}
                onZoomChange={setPreviewZoom}
                className="pointer-events-auto shadow-md"
              />
            </div>
          </div>

          {!previewOpen ? (
            <CollapsedPanelStrip
              label="Preview"
              expandDirection="left"
              onExpand={() => setPreviewOpen(true)}
              indicator={
                hasPendingAiChanges ? (
                  <PendingAiIndicator className="mt-2" />
                ) : undefined
              }
            />
          ) : null}

          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto max-lg:px-3 max-lg:pb-3 lg:pb-4",
              !previewOpen && "lg:sr-only",
              !renderPreviewDocument && "max-lg:hidden",
            )}
            ref={previewRef}
          >
            {renderPreviewDocument ? (
              <div
                className={
                  hasPendingAiChanges
                    ? "rounded-lg ring-2 ring-emerald-400/50 ring-offset-2 ring-offset-[#e8edf4]"
                    : undefined
                }
                style={{ zoom: previewZoom / 100 }}
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
            ) : null}
          </div>
        </aside>
      </div>

      <EditorMobileNav
        active={mobilePanel}
        onChange={setMobilePanel}
        hasPendingAiChanges={hasPendingAiChanges}
      />
    </div>
  );
}
