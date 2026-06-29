import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type CollapsedPanelStripProps = {
  label: string;
  onExpand: () => void;
  expandDirection: "left" | "right";
  indicator?: React.ReactNode;
};

export function CollapsedPanelStrip({
  label,
  onExpand,
  expandDirection,
  indicator,
}: CollapsedPanelStripProps) {
  const ExpandIcon: LucideIcon =
    expandDirection === "right" ? ChevronRight : ChevronLeft;

  return (
    <div className="hidden h-full flex-col items-center py-4 lg:flex">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground"
        onClick={onExpand}
        aria-label={`Expand ${label.toLowerCase()} panel`}
      >
        <ExpandIcon className="size-4" />
      </Button>
      <span
        className="mt-3 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase [writing-mode:vertical-rl]"
        aria-hidden
      >
        {label}
      </span>
      {indicator}
    </div>
  );
}
