import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResumeEditorClient } from "@/components/editor/ResumeEditorClient";
import { normalizeResume } from "@/lib/resume";
import { templateConfigSchema } from "@/lib/validations/resume";
import type { Resume } from "@/lib/validations/resume";

export default async function ResumeEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: resume, error } = await supabase
    .from("resumes")
    .select("id, title, data, template_id")
    .eq("id", id)
    .single();

  if (error || !resume) {
    notFound();
  }

  let templateConfig;
  if (resume.template_id) {
    const { data: template } = await supabase
      .from("templates")
      .select("config")
      .eq("id", resume.template_id)
      .maybeSingle();
    if (template?.config) {
      templateConfig = templateConfigSchema.parse(template.config);
    }
  }

  return (
    <ResumeEditorClient
      resumeId={resume.id}
      initialTitle={resume.title}
      initialData={normalizeResume(resume.data) as Resume}
      templateConfig={templateConfig}
    />
  );
}
