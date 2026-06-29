"use client";

import type { ReactNode } from "react";
import type { Resume } from "@/lib/validations/resume";
import type { TemplateConfig } from "@/lib/validations/resume";
import { linkLabel } from "@/lib/resume";
import type { PreviewHighlight, PreviewHighlightId } from "@/lib/ai/diff-resume";
import { isHighlightActive } from "@/lib/ai/diff-resume";
import { isSectionActive, ResumeSection, sortSections } from "@/lib/sections";
import {
  BulletsDiff,
  EducationPreviewEntry,
  PreviewHighlightBlock,
  TextDiff,
} from "@/components/preview/preview-shared";
import { SidebarResumePreview } from "@/components/preview/SidebarResumePreview";

type ResumePreviewProps = {
  resume: Resume;
  compareResume?: Resume;
  highlights?: PreviewHighlight[];
  showHighlights?: boolean;
  template?: TemplateConfig;
  className?: string;
};

export function ResumePreview({
  resume,
  compareResume,
  highlights = [],
  showHighlights = false,
  template,
  className = "",
}: ResumePreviewProps) {
  if (template?.layout === "sidebar") {
    return (
      <SidebarResumePreview
        resume={resume}
        compareResume={compareResume}
        highlights={highlights}
        showHighlights={showHighlights}
        template={template}
        className={className}
      />
    );
  }

  const headingTransform = template?.headingTransform ?? "uppercase";
  const sectionSpacing = template?.sectionSpacing ?? "14px";
  const accentColor = template?.accentColor ?? "#1a1a1a";
  const activeSections = sortSections(resume.activeSections);
  const before = compareResume;

  const contact = [
    resume.header.location,
    resume.header.phone,
    resume.header.email,
    ...resume.header.links.map((url) => ({ url, label: linkLabel(url) })),
  ].filter(Boolean);

  const jobs = resume.experience.filter(
    (job) => job.title || job.company || job.bullets.length,
  );

  const projects = resume.projects.filter(
    (p) => p.name || p.url || p.bullets.length,
  );

  const sectionTitleClass =
    "section-title mb-2 border-b pb-0.5 text-[0.68rem] font-bold tracking-widest";

  function wrapHighlight(id: PreviewHighlightId, content: ReactNode) {
    return (
      <PreviewHighlightBlock
        highlight={isHighlightActive(highlights, id)}
        showHighlights={showHighlights}
      >
        {content}
      </PreviewHighlightBlock>
    );
  }

  function renderSection(section: ResumeSection) {
    switch (section) {
      case ResumeSection.Personal:
        if (!resume.summary) return null;
        return (
          <div className="section" style={{ marginTop: sectionSpacing }}>
            <div
              className={sectionTitleClass}
              style={{
                borderColor: accentColor,
                textTransform: headingTransform,
              }}
            >
              Professional Summary
            </div>
            {wrapHighlight(
              "summary",
              before ? (
                <TextDiff
                  before={before.summary}
                  after={resume.summary}
                  showHighlights={showHighlights}
                />
              ) : (
                <p>{resume.summary}</p>
              ),
            )}
          </div>
        );
      case ResumeSection.Skills:
        if (!resume.skills) return null;
        return (
          <div className="section" style={{ marginTop: sectionSpacing }}>
            <div
              className={sectionTitleClass}
              style={{
                borderColor: accentColor,
                textTransform: headingTransform,
              }}
            >
              Skills
            </div>
            {wrapHighlight(
              "skills",
              before ? (
                <TextDiff
                  before={before.skills}
                  after={resume.skills}
                  showHighlights={showHighlights}
                />
              ) : (
                <p>{resume.skills}</p>
              ),
            )}
          </div>
        );
      case ResumeSection.Experience:
        if (jobs.length === 0) return null;
        return (
          <div className="section" style={{ marginTop: sectionSpacing }}>
            <div
              className={sectionTitleClass}
              style={{
                borderColor: accentColor,
                textTransform: headingTransform,
              }}
            >
              Experience
            </div>
            {jobs.map((job, i) => {
              const beforeJobs =
                before?.experience.filter((item) => item.title || item.company) ??
                [];
              const beforeJob = beforeJobs.find(
                (item) => item.title === job.title && item.company === job.company,
              );

              return (
                <div key={`experience-${i}-${job.company}-${job.title}`}>
                  {wrapHighlight(
                    `experience:${i}`,
                    <div className="entry mb-2.5">
                      <div className="entry-header flex justify-between gap-3 text-[0.72rem] font-bold">
                        <div>{job.title}</div>
                        <div>{job.dates}</div>
                      </div>
                      <div className="entry-subtitle text-[0.68rem] italic text-[#555]">
                        {job.company}
                      </div>
                      <BulletsDiff
                        before={beforeJob?.bullets ?? []}
                        after={job.bullets}
                        showHighlights={
                          showHighlights &&
                          Boolean(isHighlightActive(highlights, `experience:${i}`))
                        }
                      />
                    </div>,
                  )}
                </div>
              );
            })}
          </div>
        );
      case ResumeSection.Projects:
        if (projects.length === 0) return null;
        return (
          <div className="section" style={{ marginTop: sectionSpacing }}>
            <div
              className={sectionTitleClass}
              style={{
                borderColor: accentColor,
                textTransform: headingTransform,
              }}
            >
              Projects
            </div>
            {projects.map((project, i) => {
              const beforeProjects =
                before?.projects.filter((item) => item.name) ?? [];
              const beforeProject = beforeProjects.find(
                (item) => item.name === project.name,
              );

              return (
                <div key={`project-${i}-${project.name}`}>
                  {wrapHighlight(
                    `project:${i}`,
                    <div className="entry mb-2.5">
                      <div className="entry-header text-[0.72rem] font-bold">
                        {project.name}
                      </div>
                      {project.url ? (
                        <div className="entry-subtitle text-[0.68rem] italic text-[#555]">
                          <a href={project.url} className="text-inherit">
                            {project.url}
                          </a>
                        </div>
                      ) : null}
                      <BulletsDiff
                        before={beforeProject?.bullets ?? []}
                        after={project.bullets}
                        showHighlights={
                          showHighlights &&
                          Boolean(isHighlightActive(highlights, `project:${i}`))
                        }
                      />
                    </div>,
                  )}
                </div>
              );
            })}
          </div>
        );
      case ResumeSection.Education:
        return (
          <div className="section" style={{ marginTop: sectionSpacing }}>
            <div
              className={sectionTitleClass}
              style={{
                borderColor: accentColor,
                textTransform: headingTransform,
              }}
            >
              Education
            </div>
            {wrapHighlight(
              "education",
              <>
                <div className="entry-header flex justify-between gap-3 text-[0.72rem] font-bold">
                  <div>
                    <strong>{resume.education.school}</strong>
                    <br />
                    {resume.education.degree}
                    {resume.education.fieldOfStudy
                      ? ` — ${resume.education.fieldOfStudy}`
                      : ""}
                    {resume.education.marks ? (
                      <>
                        <br />
                        {resume.education.marks} {resume.education.marksType}
                      </>
                    ) : null}
                    {resume.education.description ? (
                      <p className="font-normal">{resume.education.description}</p>
                    ) : null}
                  </div>
                  <div>
                    {resume.education.year ||
                      resume.education.graduationDate?.slice(0, 4) ||
                      ""}
                  </div>
                </div>
                {resume.education.secondary
                  .filter((s) => s.school || s.degree || s.description)
                  .map((entry, i) => (
                    <EducationPreviewEntry key={i} entry={entry} />
                  ))}
              </>,
            )}
          </div>
        );
      default:
        return null;
    }
  }

  const headerBlock = isSectionActive(activeSections, ResumeSection.Personal) ? (
    wrapHighlight(
      "header",
      <>
        <h1
          className="mb-0.5 text-2xl font-bold tracking-wide"
          style={{ textTransform: headingTransform }}
        >
          {resume.header.name || "Your Name"}
        </h1>

        <div className="contact mb-3.5 font-sans text-[0.62rem] leading-relaxed text-[#555]">
          {contact.map((item, i) => {
            if (typeof item === "string") {
              return (
                <span key={`contact-${i}-${item}`}>
                  {i > 0 && " · "}
                  {item}
                </span>
              );
            }
            return (
              <span key={`contact-${i}-${item.url}`}>
                {i > 0 && " · "}
                <a href={item.url} className="text-inherit no-underline">
                  {item.label}
                </a>
              </span>
            );
          })}
        </div>
      </>,
    )
  ) : null;

  return (
    <article
      className={`resume-doc w-full min-h-full rounded-sm bg-white p-8 text-[#1a1a1a] shadow-lg ${className}`}
      style={{
        fontFamily: template?.fontFamily ?? "Libre Baskerville, Georgia, serif",
        fontSize: template?.fontSize ?? "0.72rem",
        lineHeight: 1.45,
      }}
    >
      {headerBlock}

      {activeSections.map((section) => (
        <div key={section}>{renderSection(section)}</div>
      ))}
    </article>
  );
}
