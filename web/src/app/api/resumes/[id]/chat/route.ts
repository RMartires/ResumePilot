import {
  convertToModelMessages,
  stepCountIs,
  type UIMessage,
} from "ai";
import { NextResponse } from "next/server";
import {
  flushLangSmithTraces,
  isLangSmithEnabled,
  streamText,
} from "@/lib/ai/langsmith";
import { buildResumeChatSystemPrompt } from "@/lib/ai/prompts";
import { getChatModel } from "@/lib/ai/openrouter";
import { createResumeTools } from "@/lib/ai/tools";
import { normalizeResume, resumeToJson } from "@/lib/resume";
import { createClient } from "@/lib/supabase/server";
import type { Resume } from "@/lib/validations/resume";

export const maxDuration = 60;

type ChatRequestBody = {
  messages: UIMessage[];
  resumeSnapshot?: Resume;
  model?: string;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: resumeId } = await params;

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      {
        error:
          "AI is not configured. Set OPENROUTER_API_KEY in web/.env.local",
      },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: resumeRow, error: resumeError } = await supabase
    .from("resumes")
    .select("id")
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .single();

  if (resumeError || !resumeRow) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.messages)) {
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }

  try {
    const resume = resumeToJson(
      normalizeResume(body.resumeSnapshot ?? {}),
    ) as Resume;

    const result = streamText({
      model: getChatModel(body.model),
      system: buildResumeChatSystemPrompt(resume),
      messages: await convertToModelMessages(body.messages),
      tools: createResumeTools(resume),
      stopWhen: stepCountIs(5),
      onError({ error }) {
        console.error("[resume-chat]", error);
      },
    });

    // Keep the stream alive server-side so LangSmith can finish tracing.
    void result.consumeStream().then(() => {
      void flushLangSmithTraces();
    });

    return result.toUIMessageStreamResponse({
      messageMetadata: () => ({
        resumeId,
        userId: user.id,
        langsmith: isLangSmithEnabled(),
      }),
      onFinish: async () => {
        await flushLangSmithTraces();
      },
    });
  } catch (error) {
    await flushLangSmithTraces();
    console.error("[resume-chat] failed", error);
    const message =
      error instanceof Error ? error.message : "Chat request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
