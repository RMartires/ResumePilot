import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderResumePdf } from "@/lib/pdf/render-resume-pdf";
import { getDefaultTemplateConfig } from "@/lib/pdf/template-theme";
import {
  emptyResume,
  normalizeResume,
  resumeToJson,
  resumeToMarkdown,
  slugify,
} from "@/lib/resume";
import { templateConfigSchema } from "@/lib/validations/resume";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "json";

  const { data: resume, error } = await supabase
    .from("resumes")
    .select("data, title, template_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !resume) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const normalized = normalizeResume(resume.data ?? emptyResume());
  const slug = slugify(resume.title || normalized.header.name || "resume");

  let templateConfig = getDefaultTemplateConfig();
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

  if (format === "md") {
    return new NextResponse(resumeToMarkdown(normalized), {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slug}.md"`,
      },
    });
  }

  if (format === "pdf") {
    try {
      const pdf = await renderResumePdf(normalized, templateConfig);

      return new NextResponse(new Uint8Array(pdf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${slug}.pdf"`,
        },
      });
    } catch (err) {
      console.error("[export-pdf]", err);
      const message =
        err instanceof Error ? err.message : "Failed to generate PDF";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  return NextResponse.json(resumeToJson(normalized), {
    headers: {
      "Content-Disposition": `attachment; filename="${slug}.json"`,
    },
  });
}
