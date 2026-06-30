"use client";

import { useRef } from "react";
import { ChevronLeft, FileUp, LayoutTemplate } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { downloadResumePdf } from "@/lib/pdf";
import { normalizeResume, slugify } from "@/lib/resume";
import type { Resume } from "@/lib/validations/resume";

type EditorToolbarProps = {
  resumeId: string;
  title: string;
  onTitleChange: (title: string) => void;
  resume: Resume;
  onImport: (resume: Resume) => void;
};

export function EditorToolbar({
  resumeId,
  title,
  onTitleChange,
  resume,
  onImport,
}: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slug = slugify(resume.header.name || title || "resume");

  const handleExportPdf = async () => {
    try {
      toast.loading("Generating PDF…");
      await downloadResumePdf(resumeId, `${slug}.pdf`);
      toast.dismiss();
      toast.success("PDF downloaded");
    } catch (err) {
      console.error("PDF export failed:", err);
      toast.dismiss();
      toast.error(err instanceof Error ? err.message : "PDF export failed");
    }
  };

  return (
    <header className="flex shrink-0 flex-wrap items-center gap-2 border-b bg-background px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
      <Link
        href="/dashboard"
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        aria-label="Back to resumes"
      >
        <ChevronLeft className="size-5" />
      </Link>

      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="min-w-0 flex-1 font-medium sm:max-w-xs lg:max-w-xs"
        aria-label="Resume title"
      />

      <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto">
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
          <span className="hidden sm:inline">Templates</span>
        </Link>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="hidden sm:inline-flex"
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
