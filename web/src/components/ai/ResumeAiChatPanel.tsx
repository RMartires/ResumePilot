"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Loader2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ChatMessage } from "@/components/ai/ChatMessage";
import { ResumePatchCard } from "@/components/ai/ResumePatchCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { applyResumePatch } from "@/lib/ai/apply-patch";
import {
  extractPatchesFromMessage,
  getLatestPatch,
  type PendingPatch,
} from "@/lib/ai/extract-proposals";
import type { Resume } from "@/lib/validations/resume";

type ResumeAiChatPanelProps = {
  resumeId: string;
  resume: Resume;
  onApplyResume: (resume: Resume) => void;
  onActivePatchChange?: (patch: PendingPatch | null, proposed: Resume | null) => void;
};

export function ResumeAiChatPanel({
  resumeId,
  resume,
  onApplyResume,
  onActivePatchChange,
}: ResumeAiChatPanelProps) {
  const [input, setInput] = useState("");
  const [handledPatchIds, setHandledPatchIds] = useState<Set<string>>(
    () => new Set(),
  );

  const resumeRef = useRef(resume);
  resumeRef.current = resume;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `/api/resumes/${resumeId}/chat`,
        prepareSendMessagesRequest: ({ messages, body }) => ({
          body: {
            ...body,
            messages,
            resumeSnapshot: resumeRef.current,
          },
        }),
      }),
    [resumeId],
  );

  const { messages, sendMessage, status, error, stop } = useChat({
    transport,
    onError: (err) => {
      toast.error(err.message || "AI chat failed");
    },
  });

  const activePatch = useMemo(() => {
    const latest = getLatestPatch(messages);
    if (!latest || handledPatchIds.has(latest.toolCallId)) return null;
    return latest;
  }, [messages, handledPatchIds]);

  const onActivePatchChangeRef = useRef(onActivePatchChange);
  onActivePatchChangeRef.current = onActivePatchChange;
  const lastNotifiedPatchIdRef = useRef<string | null>(null);
  const lastNotifiedPreviewKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const notify = onActivePatchChangeRef.current;
    if (!notify) return;

    const latest = getLatestPatch(messages);
    const patch =
      latest && !handledPatchIds.has(latest.toolCallId) ? latest : null;
    const nextId = patch?.toolCallId ?? null;

    if (!patch) {
      if (lastNotifiedPatchIdRef.current === null) return;
      lastNotifiedPatchIdRef.current = null;
      lastNotifiedPreviewKeyRef.current = null;
      notify(null, null);
      return;
    }

    const proposed = applyResumePatch(resumeRef.current, patch);
    const previewKey = JSON.stringify(proposed);

    if (
      nextId === lastNotifiedPatchIdRef.current &&
      previewKey === lastNotifiedPreviewKeyRef.current
    ) {
      return;
    }

    lastNotifiedPatchIdRef.current = nextId;
    lastNotifiedPreviewKeyRef.current = previewKey;
    notify(patch, proposed);
  }, [messages, handledPatchIds, resume]);

  const markHandled = useCallback((toolCallId: string) => {
    setHandledPatchIds((prev) => new Set(prev).add(toolCallId));
  }, []);

  const handleApplyPatch = useCallback(
    (patch: PendingPatch) => {
      const next = applyResumePatch(resumeRef.current, patch);
      onApplyResume(next);
      markHandled(patch.toolCallId);
      lastNotifiedPatchIdRef.current = null;
      lastNotifiedPreviewKeyRef.current = null;
      onActivePatchChangeRef.current?.(null, null);
      toast.success("Resume updated");
    },
    [markHandled, onApplyResume],
  );

  const handleDismissPatch = useCallback(
    (patch: PendingPatch) => {
      markHandled(patch.toolCallId);
      lastNotifiedPatchIdRef.current = null;
      lastNotifiedPreviewKeyRef.current = null;
      onActivePatchChangeRef.current?.(null, null);
    },
    [markHandled],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || status === "streaming" || status === "submitted") return;

    // Stale unapplied proposals from earlier turns are dismissed when the user continues chatting.
    if (activePatch) {
      markHandled(activePatch.toolCallId);
      lastNotifiedPatchIdRef.current = null;
      lastNotifiedPreviewKeyRef.current = null;
      onActivePatchChangeRef.current?.(null, null);
    }

    setInput("");
    await sendMessage({ text });
  };

  const isBusy = status === "streaming" || status === "submitted";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status, activePatch]);

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden border-r bg-background">
      <div className="shrink-0 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <div>
            <h2 className="text-sm font-semibold">AI Assistant</h2>
            <p className="text-xs text-muted-foreground">
              Full resume context
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        <div className="space-y-3">
        {messages.length === 0 && (
          <div className="rounded-lg border border-dashed p-3 text-xs leading-relaxed text-muted-foreground">
            Ask me to improve your summary, rewrite bullets, tailor your resume
            for a role, or suggest skills to highlight.
          </div>
        )}

        {messages.map((message) => {
          const messagePatches = extractPatchesFromMessage(message).filter(
            (patch) => !handledPatchIds.has(patch.toolCallId),
          );
          const showPatch =
            activePatch &&
            message.id === activePatch.messageId &&
            messagePatches.some((p) => p.toolCallId === activePatch.toolCallId);

          return (
            <div key={message.id} className="space-y-2">
              <ChatMessage message={message} />
              {showPatch && activePatch && (
                <ResumePatchCard
                  patch={activePatch}
                  isPreviewing
                  onApply={() => handleApplyPatch(activePatch)}
                  onDismiss={() => handleDismissPatch(activePatch)}
                />
              )}
            </div>
          );
        })}

        {error && (
          <p className="text-xs text-destructive">{error.message}</p>
        )}
        <div ref={messagesEndRef} aria-hidden />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="shrink-0 border-t p-3">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about your resume…"
            rows={2}
            className="min-h-[64px] resize-none text-sm"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void handleSubmit(event);
              }
            }}
          />
          <div className="flex flex-col justify-end">
            {isBusy ? (
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => void stop()}
                aria-label="Stop generating"
              >
                <Loader2 className="size-4 animate-spin" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon-sm"
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <Send className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </aside>
  );
}
