import { Output, createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { NextResponse } from "next/server";
import {
  flushLangSmithTraces,
  streamText,
} from "@/lib/ai/langsmith";
import { buildResumeChatSystemPrompt } from "@/lib/ai/prompts";
import { prepareChatModelMessages } from "@/lib/ai/prepare-messages";
import type { ResumeChatUIMessage } from "@/lib/ai/resume-chat-ui-message";
import {
  RESUME_CHAT_TEMPERATURE,
  resumeChatResponseSchema,
} from "@/lib/ai/schemas/resume-chat-response";
import { getChatModel } from "@/lib/ai/openrouter";
import { streamStructuredMessageField } from "@/lib/ai/stream-message-field";
import { normalizeResume, resumeToJson } from "@/lib/resume";
import { createClient } from "@/lib/supabase/server";
import type { Resume } from "@/lib/validations/resume";

export const maxDuration = 60;

type ChatRequestBody = {
  messages: ResumeChatUIMessage[];
  resumeSnapshot?: Resume;
  model?: string;
};

function resumesEqual(a: Resume, b: Resume): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function streamErrorMessage(error: unknown): string {
  console.error("[resume-chat]", error);
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Failed to generate AI response.";
}

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

    const modelMessages = prepareChatModelMessages(body.messages);

    const stream = createUIMessageStream<ResumeChatUIMessage>({
      originalMessages: body.messages,
      onError: streamErrorMessage,
      execute: async ({ writer }) => {
        const result = streamText({
          model: getChatModel(body.model),
          temperature: RESUME_CHAT_TEMPERATURE,
          system: buildResumeChatSystemPrompt(resume),
          messages: modelMessages,
          output: Output.object({
            schema: resumeChatResponseSchema,
          }),
          onError({ error }) {
            console.error("[resume-chat] model error", error);
          },
        });

        const textPartId = crypto.randomUUID();
        let streamedMessage = "";

        streamedMessage = await streamStructuredMessageField(
          result.partialOutputStream,
          (delta) => {
            writer.write({ type: "text-delta", id: textPartId, delta });
          },
          () => {
            writer.write({ type: "text-start", id: textPartId });
          },
          () => {
            writer.write({ type: "text-end", id: textPartId });
          },
        );

        const output = await result.output;

        if (!streamedMessage && output.message.trim()) {
          writer.write({ type: "text-start", id: textPartId });
          writer.write({
            type: "text-delta",
            id: textPartId,
            delta: output.message,
          });
          writer.write({ type: "text-end", id: textPartId });
        }

        const proposed = resumeToJson(
          normalizeResume(output.resume),
        ) as Resume;
        const changed =
          output.has_resume_changed && !resumesEqual(resume, proposed);

        writer.write({
          type: "data-resume-change",
          id: crypto.randomUUID(),
          data: {
            has_resume_changed: changed,
            resume: proposed,
          },
        });
      },
      onFinish: async () => {
        await flushLangSmithTraces();
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    await flushLangSmithTraces();
    console.error("[resume-chat] failed", error);
    const message =
      error instanceof Error ? error.message : "Chat request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
