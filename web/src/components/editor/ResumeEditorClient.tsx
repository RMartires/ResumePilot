"use client";

import { useEffect, useRef } from "react";
import { ResumeEditor } from "@/components/editor/ResumeEditor";
import { AnalyticsEvent, track } from "@/lib/analytics/umami";
import type { Resume, TemplateConfig } from "@/lib/validations/resume";

type ResumeEditorClientProps = {
  resumeId: string;
  initialTitle: string;
  initialData: Resume;
  templateConfig?: TemplateConfig;
};

export function ResumeEditorClient(props: ResumeEditorClientProps) {
  const savedTrackedRef = useRef(false);

  useEffect(() => {
    track(AnalyticsEvent.EditorOpened);
  }, [props.resumeId]);

  const handleSave = async ({
    title,
    data,
  }: {
    title: string;
    data: Resume;
  }) => {
    const res = await fetch(`/api/resumes/${props.resumeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, data }),
    });
    if (!res.ok) throw new Error("Save failed");

    // Once per editor session — avoids debounced-save spam.
    if (!savedTrackedRef.current) {
      savedTrackedRef.current = true;
      track(AnalyticsEvent.ResumeSaved);
    }
  };

  return <ResumeEditor {...props} onSave={handleSave} />;
}
