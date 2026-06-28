import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { emptyResume, normalizeResume } from "@/lib/resume";

export async function POST(
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

  const { data: source, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !source) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: created, error: insertError } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: `${source.title} (copy)`,
      template_id: source.template_id,
      data: source.data,
    })
    .select("id")
    .single();

  if (insertError || !created) {
    return NextResponse.json({ error: insertError?.message }, { status: 500 });
  }

  return NextResponse.json({ id: created.id });
}
