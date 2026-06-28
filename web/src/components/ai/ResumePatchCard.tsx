"use client";

import { Button } from "@/components/ui/button";
import type { PendingPatch } from "@/lib/ai/extract-proposals";

type ResumePatchCardProps = {
  patch: PendingPatch;
  onApply: () => void;
  onDismiss: () => void;
  isPreviewing?: boolean;
};

export function ResumePatchCard({
  patch,
  onApply,
  onDismiss,
  isPreviewing = false,
}: ResumePatchCardProps) {
  return (
    <div className="rounded-lg border border-amber-300/60 bg-amber-50 p-3 dark:border-amber-700/50 dark:bg-amber-950/30">
      <p className="text-xs font-semibold text-amber-900 dark:text-amber-100">
        Proposed change
      </p>
      <p className="mt-1 text-xs text-foreground">{patch.description}</p>
      {isPreviewing && (
        <p className="mt-1 text-[11px] text-muted-foreground">
          Preview updated on the right →
        </p>
      )}
      <div className="mt-2 flex gap-2">
        <Button type="button" size="sm" className="h-7" onClick={onApply}>
          Apply to resume
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7"
          onClick={onDismiss}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}
