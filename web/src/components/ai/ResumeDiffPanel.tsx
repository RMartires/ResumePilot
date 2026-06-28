"use client";

import type { ResumeDiffItem } from "@/lib/ai/diff-resume";
import { cn } from "@/lib/utils";

type ResumeDiffPanelProps = {
  diffs: ResumeDiffItem[];
};

const changeStyles: Record<ResumeDiffItem["change"], string> = {
  added: "text-emerald-700 dark:text-emerald-400",
  removed: "text-red-700 dark:text-red-400",
  modified: "text-amber-800 dark:text-amber-300",
};

const changeLabel: Record<ResumeDiffItem["change"], string> = {
  added: "+",
  removed: "−",
  modified: "~",
};

export function ResumeDiffPanel({ diffs }: ResumeDiffPanelProps) {
  if (diffs.length === 0) {
    return (
      <div className="mb-3 rounded-lg border border-dashed border-amber-300/70 bg-amber-50/80 px-3 py-2 text-xs text-muted-foreground dark:border-amber-700/50 dark:bg-amber-950/20">
        AI proposed changes — review the preview below.
      </div>
    );
  }

  return (
    <div className="mb-3 rounded-lg border border-amber-300/70 bg-amber-50/90 px-3 py-2 dark:border-amber-700/50 dark:bg-amber-950/30">
      <p className="text-[11px] font-semibold tracking-wide text-amber-900 uppercase dark:text-amber-100">
        AI change preview
      </p>
      <ul className="mt-1.5 space-y-1">
        {diffs.map((item, index) => (
          <li
            key={`${item.section}-${item.detail}-${index}`}
            className={cn("text-xs", changeStyles[item.change])}
          >
            <span className="font-mono font-bold">{changeLabel[item.change]}</span>{" "}
            <span className="font-medium">{item.section}:</span> {item.detail}
          </li>
        ))}
      </ul>
    </div>
  );
}
