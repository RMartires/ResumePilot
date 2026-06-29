"use client";

import type { ReactNode } from "react";
import type { Resume } from "@/lib/validations/resume";
import type { TemplateConfig } from "@/lib/validations/resume";
import { linkLabel } from "@/lib/resume";
import {
  isHighlightActive,
  type PreviewHighlight,
  type PreviewHighlightId,
} from "@/lib/ai/diff-resume";
import { isSectionActive, ResumeSection, sortSections } from "@/lib/sections";
import { cn } from "@/lib/utils";

type ResumePreviewProps = {
  resume: Resume;
  compareResume?: Resume;
  highlights?: PreviewHighlight[];
  showHighlights?: boolean;
  template?: TemplateConfig;
  className?: string;
};

function norm(s: string) {
  return s.trim();
}

function PreviewHighlightBlock({
  highlight,
  showHighlights,
  children,
}: {
  highlight?: PreviewHighlight;
  showHighlights: boolean;
  children: ReactNode;
}) {
  if (!highlight || !showHighlights) {
    return <>{children}</>;
  }

  const changeLabel =
    highlight.change === "added"
      ? "Added"
      : highlight.change === "removed"
        ? "Removed"
        : "Updated";

  return (
    <div
      className={cn(
        "relative my-1 rounded-sm border-l-[3px] py-1.5 pl-3",
        highlight.change === "added" &&
          "border-emerald-500 bg-emerald-50/95 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.15)]",
        highlight.change === "modified" &&
          "border-sky-500 bg-sky-50/90 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.12)]",
        highlight.change === "removed" &&
          "border-red-400 bg-red-50/80 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.15)]",
      )}
    >
      <span
        className={cn(
          "absolute -top-2 right-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold tracking-wide uppercase",
          highlight.change === "added" && "bg-emerald-600 text-white",
          highlight.change === "modified" && "bg-sky-600 text-white",
          highlight.change === "removed" && "bg-red-500 text-white",
        )}
      >
        AI · {changeLabel}
      </span>
      {children}
    </div>
  );
}

function TextDiff({
  before,
  after,
  showHighlights,
}: {
  before: string;
  after: string;
  showHighlights: boolean;
}) {
  if (!showHighlights || norm(before) === norm(after) || !norm(before)) {
    return <p>{after}</p>;
  }

  return (
    <div className="space-y-1.5">
      <p className="rounded bg-red-50/80 px-1.5 py-1 text-[0.68rem] text-red-800/80 line-through decoration-red-400/70">
        {before}
      </p>
      <p className="rounded bg-emerald-50/80 px-1.5 py-1 text-[0.72rem] text-emerald-950">
        {after}
      </p>
    </div>
  );
}

function BulletsDiff({
  before,
  after,
  showHighlights,
}: {
  before: string[];
  after: string[];
  showHighlights: boolean;
}) {
  if (!showHighlights || JSON.stringify(before) === JSON.stringify(after)) {
    return (
      <ul className="mt-1 list-disc pl-4">
        {after.map((bullet, index) => (
          <li key={index} className="mb-0.5">
            {bullet}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="mt-1 space-y-1 pl-0">
      {after.map((bullet, index) => {
        const prev = before[index];
        const changed = prev !== undefined && norm(prev) !== norm(bullet);
        const isNew = prev === undefined && norm(bullet);

        if (!changed && !isNew) {
          return (
            <li key={index} className="mb-0.5 list-disc pl-4 marker:text-[#1a1a1a]">
              {bullet}
            </li>
          );
        }

        return (
          <li key={index} className="list-none">
            {changed && prev ? (
              <p className="mb-1 rounded bg-red-50/80 px-1.5 py-0.5 text-[0.68rem] text-red-800/80 line-through decoration-red-400/70">
                {prev}
              </p>
            ) : null}
            <p
              className={cn(
                "rounded px-1.5 py-0.5 text-[0.72rem]",
                isNew
                  ? "bg-emerald-50/90 text-emerald-950"
                  : "bg-sky-50/90 text-sky-950",
              )}
            >
              {bullet}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

function EducationPreviewEntry({
  entry,
}: {
  entry: Resume["education"]["secondary"][number];
}) {
  const year = entry.year || entry.graduationDate?.slice(0, 4) || "";
  return (
    <div className="entry-header mt-2 flex justify-between gap-3 text-[0.72rem] font-bold">
      <div>
        <strong>{entry.school}</strong>
        <br />
        {entry.degree}
        {entry.fieldOfStudy ? ` — ${entry.fieldOfStudy}` : ""}
        {entry.marks ? (
          <>
            <br />
            {entry.marks} {entry.marksType}
          </>
        ) : null}
        {entry.description ? <p className="font-normal">{entry.description}</p> : null}
      </div>
      <div>{year}</div>
    </div>
  );
}

export function ResumePreview({
  resume,
  compareResume,
  highlights = [],
  showHighlights = false,
  template,
  className = "",
}: ResumePreviewProps) {
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
