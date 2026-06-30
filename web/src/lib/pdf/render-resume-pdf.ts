import PDFDocument from "pdfkit";
import { linkLabel, normalizeResume } from "@/lib/resume";
import { isSectionActive, ResumeSection, sortSections } from "@/lib/sections";
import type { PdfTheme } from "@/lib/pdf/template-theme";
import { buildPdfTheme, getDefaultTemplateConfig } from "@/lib/pdf/template-theme";
import type {
  EducationEntry,
  Job,
  Project,
  Resume,
  TemplateConfig,
} from "@/lib/validations/resume";

function sanitizeText(text: string): string {
  return text
    .replace(/\u2014/g, "-")
    .replace(/\u2013/g, "-")
    .replace(/\u2018/g, "'")
    .replace(/\u2019/g, "'")
    .replace(/\u201c/g, '"')
    .replace(/\u201d/g, '"')
    .replace(/\u2022/g, "-");
}

function contentWidth(doc: PDFKit.PDFDocument): number {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right;
}

type RenderContext = {
  doc: PDFKit.PDFDocument;
  theme: PdfTheme;
  resume: Resume;
};

function sectionHeading(ctx: RenderContext, title: string, width = contentWidth(ctx.doc)): void {
  const { doc, theme } = ctx;
  doc.moveDown(theme.sectionGap / 24);
  doc
    .font(theme.fonts.bold)
    .fontSize(theme.sizes.section)
    .fillColor("#1a1a1a")
    .text(theme.headingTransform(title), { width });

  const y = doc.y;
  doc
    .moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.margins.left + width, y)
    .strokeColor(theme.accentColor)
    .lineWidth(0.75)
    .stroke();
  doc.moveDown(0.35);
}

function bodyText(
  ctx: RenderContext,
  text: string,
  options?: { width?: number; color?: string; size?: number },
): void {
  const value = sanitizeText(text).trim();
  if (!value) return;

  const { doc, theme } = ctx;
  doc
    .font(theme.fonts.normal)
    .fontSize(options?.size ?? theme.sizes.body)
    .fillColor(options?.color ?? "#1a1a1a")
    .text(value, {
      width: options?.width ?? contentWidth(doc),
      lineGap: 2,
    });
}

function bulletList(ctx: RenderContext, bullets: string[], width?: number): void {
  const { doc, theme } = ctx;
  for (const bullet of bullets) {
    const value = sanitizeText(bullet).trim();
    if (!value) continue;
    doc
      .font(theme.fonts.normal)
      .fontSize(theme.sizes.body)
      .fillColor("#1a1a1a")
      .text(`- ${value}`, {
        width: width ?? contentWidth(doc),
        indent: 12,
        lineGap: 1,
      });
  }
}

function renderLineWithRightAlignedText(
  doc: PDFKit.PDFDocument,
  leftText: string,
  rightText: string,
  columnWidth: number,
): void {
  const x = doc.page.margins.left;
  const y = doc.y;
  const gap = 12;
  const rightWidth = doc.widthOfString(rightText);
  const leftWidth = Math.max(columnWidth - rightWidth - gap, columnWidth * 0.45);

  doc.text(leftText, x, y, { width: leftWidth });
  const nextY = doc.y;

  doc.text(rightText, x, y, {
    width: columnWidth,
    align: "right",
    lineBreak: false,
  });

  doc.x = x;
  doc.y = Math.max(nextY, y + doc.currentLineHeight(false));
}

function renderStandardJob(ctx: RenderContext, job: Job, width?: number): void {
  const { doc, theme } = ctx;
  const columnWidth = width ?? contentWidth(doc);
  const title = sanitizeText(job.title).trim();
  const company = sanitizeText(job.company).trim();
  const dates = sanitizeText(job.dates).trim();

  if (title || dates) {
    doc.font(theme.fonts.bold).fontSize(theme.sizes.body).fillColor("#1a1a1a");
    if (title && dates) {
      renderLineWithRightAlignedText(doc, title, dates, columnWidth);
    } else {
      doc.text(title || dates, { width: columnWidth });
    }
  }

  if (company) {
    doc.moveDown(0.15);
    doc
      .font(theme.fonts.italic)
      .fontSize(theme.sizes.small)
      .fillColor("#555555")
      .text(company, { width: columnWidth });
  }

  bulletList(ctx, job.bullets.filter(Boolean), columnWidth);
  doc.moveDown(0.35);
}

function renderSidebarJob(ctx: RenderContext, job: Job, width: number): void {
  const { doc, theme } = ctx;
  const titleLine = [sanitizeText(job.title).trim(), sanitizeText(job.company).trim()]
    .filter(Boolean)
    .join(" at ");
  const dates = sanitizeText(job.dates).trim();
  const location = sanitizeText(job.location ?? "").trim();

  if (titleLine) {
    doc
      .font(theme.fonts.bold)
      .fontSize(theme.sizes.body)
      .fillColor(theme.accentColor)
      .text(titleLine, { width });
    doc.moveDown(0.2);
  }

  if (dates) {
    doc
      .font(theme.fonts.italic)
      .fontSize(theme.sizes.small)
      .fillColor("#666666")
      .text(dates, { width });
  }

  if (location) {
    doc
      .font(theme.fonts.normal)
      .fontSize(theme.sizes.small)
      .fillColor("#666666")
      .text(location, { width });
  }

  bulletList(ctx, job.bullets.filter(Boolean), width);
  doc.moveDown(0.45);
}

function renderProject(
  ctx: RenderContext,
  project: Project,
  width?: number,
  accentTitle = false,
): void {
  const { doc, theme } = ctx;
  const columnWidth = width ?? contentWidth(doc);
  const name = sanitizeText(project.name).trim();
  const url = sanitizeText(project.url).trim();

  if (name) {
    doc
      .font(theme.fonts.bold)
      .fontSize(theme.sizes.body)
      .fillColor(accentTitle ? theme.accentColor : "#1a1a1a")
      .text(name, { width: columnWidth });
    if (url) {
      doc.moveDown(0.15);
    }
  }

  if (url) {
    doc
      .font(theme.fonts.italic)
      .fontSize(theme.sizes.small)
      .fillColor("#555555")
      .text(url, { width: columnWidth });
  }

  bulletList(ctx, project.bullets.filter(Boolean), columnWidth);
  doc.moveDown(0.35);
}

function renderEducationEntry(
  ctx: RenderContext,
  entry: EducationEntry,
  width?: number,
  sidebar = false,
): void {
  const { doc, theme } = ctx;
  const columnWidth = width ?? contentWidth(doc);
  const school = sanitizeText(entry.school).trim();
  const degree = sanitizeText(entry.degree).trim();
  const field = sanitizeText(entry.fieldOfStudy).trim();
  const year =
    sanitizeText(entry.year).trim() ||
    sanitizeText(entry.graduationDate).trim().slice(0, 4);
  const description = sanitizeText(entry.description).trim();
  const marks = sanitizeText(entry.marks).trim();
  const marksType = sanitizeText(entry.marksType).trim();

  if (sidebar) {
    const sidebarLineGap = 0.18;
    if (degree) {
      doc
        .font(theme.fonts.bold)
        .fontSize(theme.sizes.small)
        .fillColor("#ffffff")
        .text(degree, { width: columnWidth, lineGap: 1 });
      doc.moveDown(sidebarLineGap);
    }
    if (school) {
      doc
        .font(theme.fonts.italic)
        .fillColor("#ffffff")
        .text(school, { width: columnWidth, lineGap: 1 });
      doc.moveDown(sidebarLineGap);
    }
    if (field) {
      doc
        .font(theme.fonts.italic)
        .fillColor("#ffffff")
        .text(field, { width: columnWidth, lineGap: 1 });
      doc.moveDown(sidebarLineGap);
    }
    if (year) {
      doc
        .font(theme.fonts.normal)
        .fillColor("#ffffff")
        .text(year, { width: columnWidth, lineGap: 1 });
    }
    return;
  }

  if (school) {
    doc.font(theme.fonts.bold).fontSize(theme.sizes.body).fillColor("#1a1a1a");
    if (year) {
      renderLineWithRightAlignedText(doc, school, year, columnWidth);
    } else {
      doc.text(school, { width: columnWidth });
    }
  }

  const degreeLine = degree + (field ? ` - ${field}` : "");
  if (degreeLine) {
    doc.font(theme.fonts.bold).fontSize(theme.sizes.body).fillColor("#1a1a1a");
    doc.text(degreeLine, { width: columnWidth });
  } else if (!school && (degree || field)) {
    doc.font(theme.fonts.bold).fontSize(theme.sizes.body).fillColor("#1a1a1a");
    doc.text(degree || field, { width: columnWidth });
  }

  if (marks) {
    bodyText(ctx, `${marks} ${marksType}`.trim(), { width: columnWidth });
  }

  if (description) {
    bodyText(ctx, description, { width: columnWidth });
  }
}

function renderStandardLayout(ctx: RenderContext): void {
  const { doc, theme, resume } = ctx;
  const width = contentWidth(doc);

  if (isSectionActive(resume.activeSections, ResumeSection.Personal)) {
    const name = sanitizeText(resume.header.name).trim() || "Resume";
    doc
      .font(theme.fonts.bold)
      .fontSize(theme.sizes.name)
      .fillColor("#1a1a1a")
      .text(theme.headingTransform(name), { width });

    const contactParts = [
      sanitizeText(resume.header.location).trim(),
      sanitizeText(resume.header.phone).trim(),
      sanitizeText(resume.header.email).trim(),
      ...resume.header.links.filter(Boolean).map((url) => linkLabel(url)),
    ].filter(Boolean);

    if (contactParts.length > 0) {
      doc
        .font(theme.fonts.normal)
        .fontSize(theme.sizes.small)
        .fillColor("#555555")
        .text(contactParts.join(" · "), { width, lineGap: 2 });
      doc.moveDown(0.35);
    }
  }

  for (const section of sortSections(resume.activeSections)) {
    switch (section) {
      case ResumeSection.Personal:
        if (resume.summary.trim()) {
          sectionHeading(ctx, "Professional Summary", width);
          bodyText(ctx, resume.summary, { width });
        }
        break;
      case ResumeSection.Skills:
        if (resume.skills.trim()) {
          sectionHeading(ctx, "Skills", width);
          bodyText(ctx, resume.skills, { width });
        }
        break;
      case ResumeSection.Experience: {
        const jobs = resume.experience.filter(
          (job) =>
            job.title.trim() ||
            job.company.trim() ||
            job.bullets.some((bullet) => bullet.trim()),
        );
        if (jobs.length > 0) {
          sectionHeading(ctx, "Experience", width);
          for (const job of jobs) {
            renderStandardJob(ctx, job, width);
          }
        }
        break;
      }
      case ResumeSection.Projects: {
        const projects = resume.projects.filter(
          (project) =>
            project.name.trim() ||
            project.url.trim() ||
            project.bullets.some((bullet) => bullet.trim()),
        );
        if (projects.length > 0) {
          sectionHeading(ctx, "Projects", width);
          for (const project of projects) {
            renderProject(ctx, project, width);
          }
        }
        break;
      }
      case ResumeSection.Education: {
        const education = resume.education;
        const hasEducation =
          education.school.trim() ||
          education.degree.trim() ||
          education.description.trim() ||
          education.secondary.some(
            (entry) =>
              entry.school.trim() ||
              entry.degree.trim() ||
              entry.description.trim(),
          );

        if (hasEducation) {
          sectionHeading(ctx, "Education", width);
          renderEducationEntry(ctx, education, width);
          for (const entry of education.secondary) {
            if (
              !entry.school.trim() &&
              !entry.degree.trim() &&
              !entry.description.trim()
            ) {
              continue;
            }
            doc.moveDown(0.2);
            renderEducationEntry(ctx, entry, width);
          }
        }
        break;
      }
      default:
        break;
    }
  }
}

function sidebarSectionTitle(
  ctx: RenderContext,
  title: string,
  width: number,
): void {
  const { doc, theme } = ctx;
  doc
    .font(theme.fonts.bold)
    .fontSize(theme.sizes.small)
    .fillColor("#ffffff")
    .text(title.toUpperCase(), { width });
  const y = doc.y;
  doc
    .moveTo(doc.x, y)
    .lineTo(doc.x + width, y)
    .strokeColor("rgba(255,255,255,0.4)")
    .lineWidth(0.5)
    .stroke();
  doc.moveDown(0.55);
}

function mainSectionTitle(ctx: RenderContext, title: string, width: number): void {
  const { doc, theme } = ctx;
  doc
    .font(theme.fonts.bold)
    .fontSize(theme.sizes.section)
    .fillColor(theme.accentColor)
    .text(title, { width });
  doc.moveDown(0.25);
}

function renderSidebarLayout(ctx: RenderContext): void {
  const { doc, theme, resume } = ctx;
  const pageTop = doc.page.margins.top;
  const pageLeft = doc.page.margins.left;
  const totalWidth = contentWidth(doc);
  const sidebarWidth = totalWidth * 0.32;
  const mainWidth = totalWidth - sidebarWidth - 16;
  const mainLeft = pageLeft + sidebarWidth + 16;
  const sidebarInnerWidth = sidebarWidth - 28;
  const sidebarPaddingLeft = pageLeft + 14;

  const paintSidebarBackground = () => {
    const top = doc.page.margins.top;
    const bottom = doc.page.height - doc.page.margins.bottom;
    doc.save();
    doc
      .rect(pageLeft, top, sidebarWidth, bottom - top)
      .fill(theme.accentColor);
    doc.restore();
  };

  const applyMainColumnMargins = () => {
    doc.page.margins.left = mainLeft;
    doc.page.margins.right = doc.page.width - mainLeft - mainWidth;
  };

  paintSidebarBackground();
  doc.on("pageAdded", () => {
    paintSidebarBackground();
    applyMainColumnMargins();
    doc.x = mainLeft;
  });

  let sidebarY = pageTop + 18;
  doc.x = sidebarPaddingLeft;
  doc.y = sidebarY;

  if (isSectionActive(resume.activeSections, ResumeSection.Personal)) {
    const name = sanitizeText(resume.header.name).trim() || "Resume";
    doc
      .font(theme.fonts.bold)
      .fontSize(theme.sizes.name - 1)
      .fillColor("#ffffff")
      .text(name, { width: sidebarInnerWidth });
    sidebarY = doc.y + 18;
  }

  doc.x = sidebarPaddingLeft;
  doc.y = sidebarY;
  doc.font(theme.fonts.normal).fontSize(theme.sizes.small).fillColor("#ffffff");

  const contactLines = [
    sanitizeText(resume.header.email).trim(),
    sanitizeText(resume.header.phone).trim(),
    sanitizeText(resume.header.location).trim(),
    ...resume.header.links.filter(Boolean).map((url) => linkLabel(url)),
  ].filter(Boolean);

  for (const line of contactLines) {
    doc.text(line, { width: sidebarInnerWidth, lineGap: 2 });
    doc.moveDown(0.35);
  }

  if (isSectionActive(resume.activeSections, ResumeSection.Education)) {
    const education = resume.education;
    const hasEducation =
      education.school.trim() ||
      education.degree.trim() ||
      education.secondary.some((entry) => entry.school.trim() || entry.degree.trim());

    if (hasEducation) {
      doc.moveDown(0.75);
      sidebarSectionTitle(ctx, "Education", sidebarInnerWidth);
      renderEducationEntry(ctx, education, sidebarInnerWidth, true);
      for (const entry of education.secondary) {
        if (!entry.school.trim() && !entry.degree.trim()) continue;
        doc.moveDown(0.35);
        renderEducationEntry(ctx, entry, sidebarInnerWidth, true);
      }
    }
  }

  if (
    isSectionActive(resume.activeSections, ResumeSection.Skills) &&
    resume.skills.trim()
  ) {
    doc.moveDown(0.75);
    sidebarSectionTitle(ctx, "Skills", sidebarInnerWidth);
    bodyText(ctx, resume.skills, {
      width: sidebarInnerWidth,
      color: "#ffffff",
      size: theme.sizes.small,
    });
  }

  applyMainColumnMargins();
  doc.x = mainLeft;
  doc.y = pageTop + 18;

  if (
    isSectionActive(resume.activeSections, ResumeSection.Personal) &&
    resume.summary.trim()
  ) {
    bodyText(ctx, resume.summary, {
      width: mainWidth,
      color: "#333333",
      size: theme.sizes.body,
    });
    doc.moveDown(0.5);
  }

  if (isSectionActive(resume.activeSections, ResumeSection.Experience)) {
    const jobs = resume.experience.filter(
      (job) =>
        job.title.trim() ||
        job.company.trim() ||
        job.bullets.some((bullet) => bullet.trim()),
    );
    if (jobs.length > 0) {
      mainSectionTitle(ctx, "Experience", mainWidth);
      for (const job of jobs) {
        renderSidebarJob(ctx, job, mainWidth);
      }
    }
  }

  if (isSectionActive(resume.activeSections, ResumeSection.Projects)) {
    const projects = resume.projects.filter(
      (project) =>
        project.name.trim() ||
        project.url.trim() ||
        project.bullets.some((bullet) => bullet.trim()),
    );
    if (projects.length > 0) {
      doc.moveDown(0.25);
      mainSectionTitle(ctx, "Projects", mainWidth);
      for (const project of projects) {
        renderProject(ctx, project, mainWidth, true);
      }
    }
  }
}

export function renderResumePdf(
  resume: Resume,
  template: TemplateConfig = getDefaultTemplateConfig(),
): Promise<Buffer> {
  const normalized = normalizeResume(resume);
  const theme = buildPdfTheme(template);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "LETTER", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const ctx: RenderContext = { doc, theme, resume: normalized };

    if (theme.layout === "sidebar") {
      renderSidebarLayout(ctx);
    } else {
      renderStandardLayout(ctx);
    }

    doc.end();
  });
}
