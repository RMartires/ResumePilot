"use client";

import { Globe, Link2, Mail, MapPin, Phone } from "lucide-react";
import type { Resume } from "@/lib/validations/resume";
import type { TemplateConfig } from "@/lib/validations/resume";
import { linkLabel } from "@/lib/resume";
import type { PreviewHighlight } from "@/lib/ai/diff-resume";
import { isHighlightActive } from "@/lib/ai/diff-resume";
import { isSectionActive, ResumeSection } from "@/lib/sections";
import {
  BulletsDiff,
  TextDiff,
  wrapHighlight,
} from "@/components/preview/preview-shared";

type SidebarResumePreviewProps = {
  resume: Resume;
  compareResume?: Resume;
  highlights?: PreviewHighlight[];
  showHighlights?: boolean;
  template?: TemplateConfig;
  className?: string;
};

function SidebarSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2.5">
      <h2 className="text-[0.62rem] font-bold tracking-[0.18em] uppercase">
        {children}
      </h2>
      <div className="mt-1.5 border-b border-white/40" />
    </div>
  );
}

function MainSectionTitle({
  children,
  accentColor,
}: {
  children: React.ReactNode;
  accentColor: string;
}) {
  return (
    <h2
      className="mb-3 text-[1rem] font-bold tracking-tight"
      style={{ color: accentColor }}
    >
      {children}
    </h2>
  );
}

function ContactRow({
  icon: Icon,
  children,
}: {
  icon: typeof Mail;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-[0.62rem] leading-snug break-all">
      <Icon className="mt-0.5 h-3 w-3 shrink-0 opacity-90" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

function getLinkIcon(url: string) {
  if (/linkedin\.com/i.test(url)) return Link2;
  return Globe;
}

export function SidebarResumePreview({
  resume,
  compareResume,
  highlights = [],
  showHighlights = false,
  template,
  className = "",
}: SidebarResumePreviewProps) {
  const sectionSpacing = template?.sectionSpacing ?? "18px";
  const accentColor = template?.accentColor ?? "#2D9C6C";
  const before = compareResume;
  const activeSections = resume.activeSections;

  const jobs = resume.experience.filter(
    (job) => job.title || job.company || job.bullets.length,
  );

  const projects = resume.projects.filter(
    (p) => p.name || p.url || p.bullets.length,
  );

  const educationYear =
    resume.education.year || resume.education.graduationDate?.slice(0, 4) || "";

  const showEducation =
    isSectionActive(activeSections, ResumeSection.Education) &&
    (resume.education.school ||
      resume.education.degree ||
      resume.education.secondary.some((s) => s.school || s.degree));

  const showSkills =
    isSectionActive(activeSections, ResumeSection.Skills) && resume.skills;

  const showSummary =
    isSectionActive(activeSections, ResumeSection.Personal) && resume.summary;

  const showExperience =
    isSectionActive(activeSections, ResumeSection.Experience) && jobs.length > 0;

  const showProjects =
    isSectionActive(activeSections, ResumeSection.Projects) && projects.length > 0;

  return (
    <article
      className={`resume-doc flex w-full min-h-full overflow-hidden rounded-sm bg-white shadow-lg ${className}`}
      style={{
        fontFamily: template?.fontFamily ?? "Inter, system-ui, sans-serif",
        fontSize: template?.fontSize ?? "0.75rem",
        lineHeight: 1.45,
      }}
    >
      <aside
        className="flex w-[32%] shrink-0 flex-col gap-5 p-6 text-white"
        style={{ backgroundColor: accentColor }}
      >
        {wrapHighlight(
          highlights,
          showHighlights,
          "header",
          <div>
            <h1 className="text-[1.35rem] leading-tight font-bold tracking-tight">
              {resume.header.name || "Your Name"}
            </h1>
          </div>,
        )}

        <div className="space-y-2">
          {resume.header.email ? (
            <ContactRow icon={Mail}>{resume.header.email}</ContactRow>
          ) : null}
          {resume.header.phone ? (
            <ContactRow icon={Phone}>{resume.header.phone}</ContactRow>
          ) : null}
          {resume.header.location ? (
            <ContactRow icon={MapPin}>{resume.header.location}</ContactRow>
          ) : null}
          {resume.header.links.map((url) => {
            const Icon = getLinkIcon(url);
            return (
              <ContactRow key={url} icon={Icon}>
                <a href={url} className="text-inherit no-underline">
                  {linkLabel(url)}
                </a>
              </ContactRow>
            );
          })}
        </div>

        {showEducation ? (
          <div style={{ marginTop: sectionSpacing }}>
            <SidebarSectionTitle>Education</SidebarSectionTitle>
            {wrapHighlight(
              highlights,
              showHighlights,
              "education",
              <div className="space-y-3 text-[0.62rem] leading-snug">
                <div>
                  <p className="font-bold">{resume.education.degree}</p>
                  <p className="italic">{resume.education.school}</p>
                  {resume.education.fieldOfStudy ? (
                    <p className="italic">{resume.education.fieldOfStudy}</p>
                  ) : null}
                  {educationYear ? <p>{educationYear}</p> : null}
                </div>
                {resume.education.secondary
                  .filter((s) => s.school || s.degree || s.description)
                  .map((entry, i) => {
                    const year =
                      entry.year || entry.graduationDate?.slice(0, 4) || "";
                    return (
                      <div key={i}>
                        <p className="font-bold">{entry.degree}</p>
                        <p className="italic">{entry.school}</p>
                        {year ? <p>{year}</p> : null}
                      </div>
                    );
                  })}
              </div>,
            )}
          </div>
        ) : null}

        {showSkills ? (
          <div style={{ marginTop: sectionSpacing }}>
            <SidebarSectionTitle>Skills</SidebarSectionTitle>
            {wrapHighlight(
              highlights,
              showHighlights,
              "skills",
              before ? (
                <TextDiff
                  before={before.skills}
                  after={resume.skills}
                  showHighlights={showHighlights}
                />
              ) : (
                <p className="text-[0.62rem] leading-snug">{resume.skills}</p>
              ),
            )}
          </div>
        ) : null}
      </aside>

      <div className="min-w-0 flex-1 p-7 text-[#1a1a1a]">
        {showSummary ? (
          <div className="mb-6">
            {wrapHighlight(
              highlights,
              showHighlights,
              "summary",
              before ? (
                <TextDiff
                  before={before.summary}
                  after={resume.summary}
                  showHighlights={showHighlights}
                />
              ) : (
                <p className="text-[0.72rem] leading-relaxed text-[#333]">
                  {resume.summary}
                </p>
              ),
            )}
          </div>
        ) : null}

        {showExperience ? (
          <div style={{ marginTop: showSummary ? sectionSpacing : 0 }}>
            <MainSectionTitle accentColor={accentColor}>Experience</MainSectionTitle>
            {jobs.map((job, i) => {
              const beforeJobs =
                before?.experience.filter((item) => item.title || item.company) ??
                [];
              const beforeJob = beforeJobs.find(
                (item) => item.title === job.title && item.company === job.company,
              );

              const titleLine = [job.title, job.company].filter(Boolean).join(" at ");

              return (
                <div key={`experience-${i}-${job.company}-${job.title}`}>
                  {wrapHighlight(
                    highlights,
                    showHighlights,
                    `experience:${i}`,
                    <div className="entry mb-4">
                      <div
                        className="text-[0.72rem] font-bold"
                        style={{ color: accentColor }}
                      >
                        {titleLine}
                      </div>
                      {job.dates ? (
                        <div className="mt-0.5 text-[0.65rem] italic text-[#666]">
                          {job.dates}
                        </div>
                      ) : null}
                      {job.location ? (
                        <div className="text-[0.65rem] text-[#666]">{job.location}</div>
                      ) : null}
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
        ) : null}

        {showProjects ? (
          <div style={{ marginTop: sectionSpacing }}>
            <MainSectionTitle accentColor={accentColor}>Projects</MainSectionTitle>
            {projects.map((project, i) => {
              const beforeProjects =
                before?.projects.filter((item) => item.name) ?? [];
              const beforeProject = beforeProjects.find(
                (item) => item.name === project.name,
              );

              return (
                <div key={`project-${i}-${project.name}`}>
                  {wrapHighlight(
                    highlights,
                    showHighlights,
                    `project:${i}`,
                    <div className="entry mb-4">
                      <div
                        className="text-[0.72rem] font-bold"
                        style={{ color: accentColor }}
                      >
                        {project.name}
                      </div>
                      {project.url ? (
                        <div className="entry-subtitle text-[0.65rem] text-[#666]">
                          <a href={project.url} className="text-inherit">
                            {project.url}
                          </a>
                        </div>
                      ) : null}
                      <BulletsDiff
                        before={beforeProject?.bullets ?? []}
                        showHighlights={
                          showHighlights &&
                          Boolean(isHighlightActive(highlights, `project:${i}`))
                        }
                        after={project.bullets}
                      />
                    </div>,
                  )}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </article>
  );
}
