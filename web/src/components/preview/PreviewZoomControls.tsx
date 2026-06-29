"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const DEFAULT_PREVIEW_ZOOM = 60;
export const MIN_PREVIEW_ZOOM = 40;
export const MAX_PREVIEW_ZOOM = 120;
export const PREVIEW_ZOOM_STEP = 10;
export const PREVIEW_ZOOM_STORAGE_KEY = "resume-editor-preview-zoom";

export function clampPreviewZoom(value: number): number {
  return Math.min(MAX_PREVIEW_ZOOM, Math.max(MIN_PREVIEW_ZOOM, value));
}

type PreviewZoomControlsProps = {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  className?: string;
};

export function PreviewZoomControls({
  zoom,
  onZoomChange,
  className,
}: PreviewZoomControlsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border/80 bg-white shadow-sm",
        className,
      )}
      role="group"
      aria-label="Preview zoom"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="rounded-full text-muted-foreground"
        onClick={() => onZoomChange(clampPreviewZoom(zoom - PREVIEW_ZOOM_STEP))}
        disabled={zoom <= MIN_PREVIEW_ZOOM}
        aria-label="Zoom out"
      >
        <Minus className="size-3.5" />
      </Button>
      <span className="min-w-11 px-1 text-center text-xs font-medium tabular-nums text-foreground">
        {zoom}%
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="rounded-full text-muted-foreground"
        onClick={() => onZoomChange(clampPreviewZoom(zoom + PREVIEW_ZOOM_STEP))}
        disabled={zoom >= MAX_PREVIEW_ZOOM}
        aria-label="Zoom in"
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
}
