"use client";

import { useRef } from "react";
import { FileUp, LayoutTemplate } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { downloadPreviewPdf } from "@/lib/pdf";
import { normalizeResume, slugify } from "@/lib/resume";
import type { Resume } from "@/lib/validations/resume";

type EditorToolbarProps = {
  resumeId: string;
  title: string;
  onTitleChange: (title: string) => void;
  resume: Resume;
  previewRef: React.RefObject<HTMLDivElement | null>;
  saveStatus: string;
  onImport: (resume: Resume) => void;
};

export function EditorToolbar({
  resumeId,
  title,
  onTitleChange,
  resume,
  previewRef,
  onImport,
}: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slug = slugify(resume.header.name || title || "resume");

  const handleExportPdf = async () => {
    const previewEl = previewRef.current?.querySelector(".resume-doc");
    if (!previewEl || !(previewEl instanceof HTMLElement)) {
      toast.error("Preview not ready");
      return;
    }
    try {
      toast.loading("Generating PDF…");
      await downloadPreviewPdf(previewEl, `${slug}.pdf`);
      toast.dismiss();
      toast.success("PDF downloaded");
    } catch (err) {
      console.error("PDF export failed:", err);
      toast.dismiss();
      toast.error("PDF export failed");
    }
  };

  return (
    <header className="flex shrink-0 flex-wrap items-center gap-3 border-b bg-background px-4 py-3">
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="max-w-xs font-medium"
        aria-label="Resume title"
      />

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              const text = await file.text();
              onImport(normalizeResume(JSON.parse(text)));
            } catch {
              toast.error("Invalid JSON file");
            } finally {
              e.target.value = "";
            }
          }}
        />
        <Link
          href={`/dashboard/templates?resume=${resumeId}`}
          className="inline-flex h-7 items-center gap-1 rounded-[min(var(--radius-md),12px)] border border-border px-2.5 text-[0.8rem] hover:bg-muted"
        >
          <LayoutTemplate className="h-4 w-4" />
          Templates
        </Link>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileUp className="mr-1 h-4 w-4" />
          Import JSON
        </Button>
        <Button type="button" size="sm" onClick={handleExportPdf}>
          Export PDF
        </Button>
      </div>
    </header>
  );
}
