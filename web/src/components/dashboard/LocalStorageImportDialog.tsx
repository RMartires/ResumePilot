"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AnalyticsEvent, track } from "@/lib/analytics/umami";
import { STORAGE_KEY } from "@/lib/resume";
import { normalizeResume } from "@/lib/resume";

export function LocalStorageImportDialog() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<unknown>(null);
  const [importing, setImporting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      setDraft(JSON.parse(raw));
      setOpen(true);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const importDraft = async () => {
    if (!draft) return;
    setImporting(true);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Imported Resume",
          data: normalizeResume(draft),
        }),
      });
      if (res.ok) {
        const { id } = await res.json();
        localStorage.removeItem(STORAGE_KEY);
        setOpen(false);
        track(AnalyticsEvent.ResumeImported, { source: "local" });
        router.push(`/dashboard/resume/${id}`);
        router.refresh();
      }
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import local draft?</DialogTitle>
          <DialogDescription>
            We found a resume saved in your browser from the previous editor.
            Would you like to import it to your account?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setOpen(false);
            }}
          >
            Dismiss
          </Button>
          <Button onClick={importDraft} disabled={importing}>
            {importing ? "Importing…" : "Import to account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
