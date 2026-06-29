"use client";

import { AlertCircle } from "lucide-react";

type UnstagedProposalNoticeProps = {
  onStageRequest: () => void;
};

export function UnstagedProposalNotice({
  onStageRequest,
}: UnstagedProposalNoticeProps) {
  return (
    <div className="rounded-lg border border-amber-300/70 bg-amber-50/90 px-3 py-2 dark:border-amber-700/50 dark:bg-amber-950/30">
      <div className="flex gap-2">
        <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-amber-700 dark:text-amber-300" />
        <div className="space-y-1.5 text-xs text-amber-950 dark:text-amber-100">
          <p>
            This suggestion is only in chat — it was not staged for preview review.
            Ask the AI to call the edit tool so you can accept or decline in the
            preview panel.
          </p>
          <button
            type="button"
            className="font-medium text-primary underline underline-offset-2"
            onClick={onStageRequest}
          >
            Stage change for review
          </button>
        </div>
      </div>
    </div>
  );
}
