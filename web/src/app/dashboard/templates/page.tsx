import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TemplateGallery } from "@/components/templates/TemplateGallery";
import type { Template } from "@/lib/templates";

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ resume?: string }>;
}) {
  const { resume: resumeId } = await searchParams;
  const supabase = await createClient();

  const { data: templates } = await supabase
    .from("templates")
    .select("*")
    .order("is_default", { ascending: false });

  let activeTemplateId: string | null = null;
  if (resumeId) {
    const { data: resume } = await supabase
      .from("resumes")
      .select("template_id")
      .eq("id", resumeId)
      .maybeSingle();
    activeTemplateId = resume?.template_id ?? null;
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-muted-foreground">
            Choose a layout style for your resume preview.
          </p>
        </div>
        {resumeId ? (
          <Link
            href={`/dashboard/resume/${resumeId}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to editor
          </Link>
        ) : null}
      </div>
      <TemplateGallery
        templates={(templates ?? []) as Template[]}
        activeTemplateId={activeTemplateId}
        resumeId={resumeId}
      />
    </div>
  );
}
