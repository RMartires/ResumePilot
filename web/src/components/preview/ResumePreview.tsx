import type { Resume } from "@/lib/validations/resume";
import type { TemplateConfig } from "@/lib/validations/resume";
import { linkLabel } from "@/lib/resume";

type ResumePreviewProps = {
  resume: Resume;
  template?: TemplateConfig;
  className?: string;
};

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
  template,
  className = "",
}: ResumePreviewProps) {
  const headingTransform = template?.headingTransform ?? "uppercase";
  const sectionSpacing = template?.sectionSpacing ?? "14px";
  const accentColor = template?.accentColor ?? "#1a1a1a";

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

  return (
    <article
      className={`resume-doc w-full min-h-full rounded-sm bg-white p-8 text-[#1a1a1a] shadow-lg ${className}`}
      style={{
        fontFamily: template?.fontFamily ?? "Libre Baskerville, Georgia, serif",
        fontSize: template?.fontSize ?? "0.72rem",
        lineHeight: 1.45,
      }}
    >
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
              <span key={i}>
                {i > 0 && " · "}
                {item}
              </span>
            );
          }
          return (
            <span key={item.url}>
              {i > 0 && " · "}
              <a href={item.url} className="text-inherit no-underline">
                {item.label}
              </a>
            </span>
          );
        })}
      </div>

      {resume.summary ? (
        <div className="section" style={{ marginTop: sectionSpacing }}>
          <div
            className="section-title mb-2 border-b pb-0.5 text-[0.68rem] font-bold tracking-widest"
            style={{
              borderColor: accentColor,
              textTransform: headingTransform,
            }}
          >
            Professional Summary
          </div>
          <p>{resume.summary}</p>
        </div>
      ) : null}

      {resume.skills ? (
        <div className="section" style={{ marginTop: sectionSpacing }}>
          <div
            className="section-title mb-2 border-b pb-0.5 text-[0.68rem] font-bold tracking-widest"
            style={{
              borderColor: accentColor,
              textTransform: headingTransform,
            }}
          >
            Skills
          </div>
          <p>{resume.skills}</p>
        </div>
      ) : null}

      {jobs.length > 0 ? (
        <div className="section" style={{ marginTop: sectionSpacing }}>
          <div
            className="section-title mb-2 border-b pb-0.5 text-[0.68rem] font-bold tracking-widest"
            style={{
              borderColor: accentColor,
              textTransform: headingTransform,
            }}
          >
            Experience
          </div>
          {jobs.map((job, i) => (
            <div key={i} className="entry mb-2.5">
              <div className="entry-header flex justify-between gap-3 text-[0.72rem] font-bold">
                <div>{job.title}</div>
                <div>{job.dates}</div>
              </div>
              <div className="entry-subtitle text-[0.68rem] italic text-[#555]">
                {job.company}
              </div>
              <ul className="mt-1 list-disc pl-4">
                {job.bullets.map((b, j) => (
                  <li key={j} className="mb-0.5">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      {projects.length > 0 ? (
        <div className="section" style={{ marginTop: sectionSpacing }}>
          <div
            className="section-title mb-2 border-b pb-0.5 text-[0.68rem] font-bold tracking-widest"
            style={{
              borderColor: accentColor,
              textTransform: headingTransform,
            }}
          >
            Projects
          </div>
          {projects.map((project, i) => (
            <div key={i} className="entry mb-2.5">
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
              <ul className="mt-1 list-disc pl-4">
                {project.bullets.map((b, j) => (
                  <li key={j} className="mb-0.5">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      <div className="section" style={{ marginTop: sectionSpacing }}>
        <div
          className="section-title mb-2 border-b pb-0.5 text-[0.68rem] font-bold tracking-widest"
          style={{
            borderColor: accentColor,
            textTransform: headingTransform,
          }}
        >
          Education
        </div>
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
      </div>
    </article>
  );
}
