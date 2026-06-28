import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { emptyResume, normalizeResume, resumeToJson } from "@/lib/resume";
import type { Resume } from "@/lib/validations/resume";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("id, title, updated_at, template_id")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { title?: string; data?: Resume; template_id?: string } = {};
  try {
    body = await request.json();
  } catch {
    // empty body is fine
  }

  const { data: defaultTemplate } = await supabase
    .from("templates")
    .select("id")
    .eq("is_default", true)
    .maybeSingle();

  const resumeData = body.data
    ? resumeToJson(normalizeResume(body.data))
    : resumeToJson(emptyResume());

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: body.title ?? "Untitled Resume",
      template_id: body.template_id ?? defaultTemplate?.id ?? null,
      data: resumeData,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
