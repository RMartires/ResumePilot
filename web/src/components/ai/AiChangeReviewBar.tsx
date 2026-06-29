"use client";

import { Check, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AiChangeReviewBarProps = {
  changeCount: number;
  showHighlights: boolean;
  onAccept: () => void;
  onToggleHighlights: () => void;
  onDecline: () => void;
  className?: string;
};

export function AiChangeReviewBar({
  changeCount,
  showHighlights,
  onAccept,
  onToggleHighlights,
  onDecline,
  className,
}: AiChangeReviewBarProps) {
  return (
    <div
      className={cn(
        "mb-3 shrink-0 rounded-lg border border-emerald-200/80 bg-white/90 p-2 shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      <p className="mb-2 px-1 text-[11px] text-muted-foreground">
        {changeCount} AI {changeCount === 1 ? "change" : "changes"} pending review
      </p>
      <div className="flex flex-wrap gap-1.5">
        <Button
          type="button"
          size="sm"
          className="h-8 flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={onAccept}
        >
          <Check className="mr-1.5 size-3.5" />
          Accept
        </Button>
        <Button
          type="button"
          size="sm"
          variant={showHighlights ? "default" : "outline"}
          className={cn(
            "h-8 flex-1",
            showHighlights && "bg-blue-600 text-white hover:bg-blue-700",
          )}
          onClick={onToggleHighlights}
        >
          {showHighlights ? (
            <Eye className="mr-1.5 size-3.5" />
          ) : (
            <EyeOff className="mr-1.5 size-3.5" />
          )}
          {showHighlights ? "Hide marks" : "Show marks"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 flex-1 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
          onClick={onDecline}
        >
          <X className="mr-1.5 size-3.5" />
          Decline
        </Button>
      </div>
    </div>
  );
}
