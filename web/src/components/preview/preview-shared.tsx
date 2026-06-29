import type { ReactNode } from "react";
import type { Resume } from "@/lib/validations/resume";
import {
  isHighlightActive,
  type PreviewHighlight,
  type PreviewHighlightId,
} from "@/lib/ai/diff-resume";
import { cn } from "@/lib/utils";

export function norm(s: string) {
  return s.trim();
}

export function PreviewHighlightBlock({
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

export function TextDiff({
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

export function BulletsDiff({
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

export function EducationPreviewEntry({
  entry,
  className = "",
}: {
  entry: Resume["education"]["secondary"][number];
  className?: string;
}) {
  const year = entry.year || entry.graduationDate?.slice(0, 4) || "";
  return (
    <div className={cn("entry-header mt-2 flex justify-between gap-3 text-[0.72rem] font-bold", className)}>
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

export function wrapHighlight(
  highlights: PreviewHighlight[],
  showHighlights: boolean,
  id: PreviewHighlightId,
  content: ReactNode,
) {
  return (
    <PreviewHighlightBlock
      highlight={isHighlightActive(highlights, id)}
      showHighlights={showHighlights}
    >
      {content}
    </PreviewHighlightBlock>
  );
}
