"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { ImportResumeButton } from "@/components/dashboard/ImportResumeButton";
import { Button, buttonVariants } from "@/components/ui/button";
import { AnalyticsEvent, track } from "@/lib/analytics/umami";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type ResumeListItem = {
  id: string;
  title: string;
  updated_at: string;
  template_id: string | null;
};

type ResumeListProps = {
  resumes: ResumeListItem[];
};

export function ResumeList({ resumes }: ResumeListProps) {
  const router = useRouter();

  const deleteResume = async (id: string) => {
    if (!confirm("Delete this resume?")) return;
    await fetch(`/api/resumes/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const duplicateResume = async (id: string) => {
    const res = await fetch(`/api/resumes/${id}/duplicate`, { method: "POST" });
    if (res.ok) {
      const { id: newId } = await res.json();
      track(AnalyticsEvent.ResumeDuplicated);
      router.push(`/dashboard/resume/${newId}`);
    }
  };

  const createResume = async () => {
    const res = await fetch("/api/resumes", { method: "POST" });
    if (!res.ok) return;
    const { id } = await res.json();
    track(AnalyticsEvent.ResumeCreated);
    router.push(`/dashboard/resume/${id}`);
  };

  if (resumes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No resumes yet</CardTitle>
          <CardDescription>
            Start from scratch or import an existing PDF resume.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <ImportResumeButton className="w-auto" />
          <Button variant="outline" onClick={createResume}>
            <Plus className="size-4" />
            New Resume
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {resumes.map((resume) => (
        <Card key={resume.id}>
          <CardHeader>
            <CardTitle className="truncate">{resume.title}</CardTitle>
            <CardDescription>
              Updated {new Date(resume.updated_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link
              href={`/dashboard/resume/${resume.id}`}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={() => duplicateResume(resume.id)}
            >
              <Copy className="mr-1 h-4 w-4" />
              Duplicate
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => deleteResume(resume.id)}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
