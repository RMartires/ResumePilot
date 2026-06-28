import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { emptyResume, normalizeResume, resumeToJson, resumeToMarkdown } from "@/lib/resume";

export async function GET(
  _request: Request,
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

  const { searchParams } = new URL(_request.url);
  const format = searchParams.get("format") ?? "json";

  const { data: resume, error } = await supabase
    .from("resumes")
    .select("data, title")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !resume) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const normalized = normalizeResume(resume.data);
  const slug = (resume.title || "resume").toLowerCase().replace(/\s+/g, "-");

  if (format === "md") {
    return new NextResponse(resumeToMarkdown(normalized), {
      headers: {
        "Content-Type": "text/markdown",
        "Content-Disposition": `attachment; filename="${slug}.md"`,
      },
    });
  }

  return NextResponse.json(resumeToJson(normalized), {
    headers: {
      "Content-Disposition": `attachment; filename="${slug}.json"`,
    },
  });
}
