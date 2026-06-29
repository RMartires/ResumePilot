import { cn } from "@/lib/utils";

type PendingAiIndicatorProps = {
  className?: string;
};

export function PendingAiIndicator({ className }: PendingAiIndicatorProps) {
  return (
    <span
      className={cn("size-2 rounded-full bg-emerald-500", className)}
      aria-label="Pending AI changes"
    />
  );
}
