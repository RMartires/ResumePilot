"use client";

import { ResumeEditor } from "@/components/editor/ResumeEditor";
import type { Resume, TemplateConfig } from "@/lib/validations/resume";

type ResumeEditorClientProps = {
  resumeId: string;
  initialTitle: string;
  initialData: Resume;
  templateConfig?: TemplateConfig;
};

export function ResumeEditorClient(props: ResumeEditorClientProps) {
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
  };

  return <ResumeEditor {...props} onSave={handleSave} />;
}
