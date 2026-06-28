import type { Job } from "@/lib/validations/resume";

export function formatDisplayDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function serializeJobDates(
  start: string,
  end: string,
  current: boolean,
): string {
  const startStr = formatDisplayDate(start);
  const endStr = current ? "Present" : formatDisplayDate(end);
  if (!startStr && !endStr) return "";
  if (!startStr) return endStr;
  if (!endStr) return startStr;
  return `${startStr} - ${endStr}`;
}

function parseLooseDate(text: string): string {
  if (!text) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  const monthYear = text.match(/^([A-Za-z]{3,9})\s+(\d{4})$/);
  if (monthYear) {
    const d = new Date(`${monthYear[1]} 1, ${monthYear[2]}`);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }

  const yearOnly = text.match(/^(\d{4})$/);
  if (yearOnly) return `${yearOnly[1]}-01-01`;

  const range = text.match(/(\d{4})\s*[-–]\s*(\d{4})/);
  if (range) return `${range[1]}-01-01`;

  const isoTry = new Date(text);
  if (!Number.isNaN(isoTry.getTime())) {
    return isoTry.toISOString().slice(0, 10);
  }

  return "";
}

export function parseJobDates(dates: string) {
  const trimmed = dates.trim();
  if (!trimmed) {
    return { startDate: "", endDate: "", current: false };
  }

  const current = /\bpresent\b/i.test(trimmed);
  const parts = trimmed.split(/\s[-–]\s/);
  const startPart = parts[0]?.trim() ?? "";
  const endPart = current ? "" : (parts[1]?.trim() ?? "");

  return {
    startDate: parseLooseDate(startPart),
    endDate: parseLooseDate(endPart),
    current,
  };
}

export function formatCollapsedRange(
  start: string,
  end: string,
  current: boolean,
  fallback: string,
): string {
  if (start) {
    const startYear = start.slice(0, 4);
    if (current) return `${startYear}-Present`;
    if (end) return `${startYear}-${end.slice(0, 4)}`;
    return startYear;
  }
  const range = fallback.match(/(\d{4})\s*[-–]\s*(\d{4}|Present)/i);
  if (range)
    return range[2].toLowerCase() === "present"
      ? `${range[1]}-Present`
      : `${range[1]}-${range[2]}`;
  return fallback;
}

export function collapsedJobSubtitle(job: Job): string {
  const title = job.title.trim();
  const range = formatCollapsedRange(
    job.startDate,
    job.endDate,
    job.current,
    job.dates,
  );
  if (title && range) return `${title}, | ${range}`;
  return title || range || "Add role details";
}
