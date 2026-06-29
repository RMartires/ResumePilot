"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, zodSchema } from "ai";
import { Loader2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ChatMessage, AssistantTypingBubble } from "@/components/ai/ChatMessage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  isAcceptIntent,
  isDeclineIntent,
} from "@/lib/ai/chat-intent";
import {
  getLatestStructuredProposal,
  type StructuredResumeProposal,
} from "@/lib/ai/extract-structured-proposal";
import type { ResumeChatUIMessage } from "@/lib/ai/resume-chat-ui-message";
import { resumeChangeDataSchema } from "@/lib/ai/schemas/resume-chat-response";
import type { Resume } from "@/lib/validations/resume";
import type { PatchReviewHandlers } from "@/lib/ai/types";
import { cn } from "@/lib/utils";

type ResumeAiChatPanelProps = {
  resumeId: string;
  resume: Resume;
  onApplyResume: (resume: Resume) => void;
  onActiveProposalChange?: (
    proposal: StructuredResumeProposal | null,
    proposed: Resume | null,
  ) => void;
  patchReviewHandlersRef?: React.MutableRefObject<PatchReviewHandlers | null>;
  headerClassName?: string;
  className?: string;
  autoScroll?: boolean;
};

export function ResumeAiChatPanel({
  resumeId,
  resume,
  onApplyResume,
  onActiveProposalChange,
  patchReviewHandlersRef,
  headerClassName,
  className,
  autoScroll = true,
}: ResumeAiChatPanelProps) {
  const [input, setInput] = useState("");
  const [handledProposalIds, setHandledProposalIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [messageTimestamps, setMessageTimestamps] = useState<
    Record<string, number>
  >({});
  const [pendingAssistantTimestamp, setPendingAssistantTimestamp] = useState<
    number | null
  >(null);

  const resumeRef = useRef(resume);
  resumeRef.current = resume;

  const transport = useMemo(
    () =>
      new DefaultChatTransport<ResumeChatUIMessage>({
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

  const { messages, sendMessage, status, error, stop } =
    useChat<ResumeChatUIMessage>({
      transport,
      dataPartSchemas: {
        "resume-change": zodSchema(resumeChangeDataSchema),
      },
      onError: (err) => {
        toast.error(err.message || "AI chat failed");
      },
    });

  useEffect(() => {
    setMessageTimestamps((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const message of messages) {
        if (!next[message.id]) {
          next[message.id] = Date.now();
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [messages]);

  useEffect(() => {
    if (status === "submitted" || status === "streaming") {
      setPendingAssistantTimestamp((prev) => prev ?? Date.now());
      return;
    }
    setPendingAssistantTimestamp(null);
  }, [status]);

  const activeProposal = useMemo(() => {
    const latest = getLatestStructuredProposal(messages);
    if (!latest || handledProposalIds.has(latest.proposalId)) return null;
    return latest;
  }, [messages, handledProposalIds]);

  const onActiveProposalChangeRef = useRef(onActiveProposalChange);
  onActiveProposalChangeRef.current = onActiveProposalChange;
  const lastNotifiedProposalIdRef = useRef<string | null>(null);
  const lastNotifiedPreviewKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const notify = onActiveProposalChangeRef.current;
    if (!notify) return;

    if (!activeProposal) {
      if (lastNotifiedProposalIdRef.current === null) return;
      lastNotifiedProposalIdRef.current = null;
      lastNotifiedPreviewKeyRef.current = null;
      notify(null, null);
      return;
    }

    const previewKey = JSON.stringify(activeProposal.resume);

    if (
      activeProposal.proposalId === lastNotifiedProposalIdRef.current &&
      previewKey === lastNotifiedPreviewKeyRef.current
    ) {
      return;
    }

    lastNotifiedProposalIdRef.current = activeProposal.proposalId;
    lastNotifiedPreviewKeyRef.current = previewKey;
    notify(activeProposal, activeProposal.resume);
  }, [activeProposal]);

  const markHandled = useCallback((proposalId: string) => {
    setHandledProposalIds((prev) => new Set(prev).add(proposalId));
  }, []);

  const handleApplyProposal = useCallback(
    (proposal: StructuredResumeProposal) => {
      onApplyResume(proposal.resume);
      markHandled(proposal.proposalId);
      lastNotifiedProposalIdRef.current = null;
      lastNotifiedPreviewKeyRef.current = null;
      onActiveProposalChangeRef.current?.(null, null);
      toast.success("Resume updated");
    },
    [markHandled, onApplyResume],
  );

  const handleDismissProposal = useCallback(
    (proposal: StructuredResumeProposal) => {
      markHandled(proposal.proposalId);
      lastNotifiedProposalIdRef.current = null;
      lastNotifiedPreviewKeyRef.current = null;
      onActiveProposalChangeRef.current?.(null, null);
      toast.message("AI changes declined");
    },
    [markHandled],
  );

  useEffect(() => {
    if (!patchReviewHandlersRef) return;

    patchReviewHandlersRef.current = activeProposal
      ? {
          accept: () => handleApplyProposal(activeProposal),
          decline: () => handleDismissProposal(activeProposal),
        }
      : null;

    return () => {
      patchReviewHandlersRef.current = null;
    };
  }, [
    activeProposal,
    handleApplyProposal,
    handleDismissProposal,
    patchReviewHandlersRef,
  ]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || status === "streaming" || status === "submitted") return;

    if (activeProposal && isAcceptIntent(text)) {
      handleApplyProposal(activeProposal);
      setInput("");
      return;
    }

    if (activeProposal && isDeclineIntent(text)) {
      handleDismissProposal(activeProposal);
      setInput("");
      return;
    }

    if (activeProposal) {
      markHandled(activeProposal.proposalId);
      lastNotifiedProposalIdRef.current = null;
      lastNotifiedPreviewKeyRef.current = null;
      onActiveProposalChangeRef.current?.(null, null);
    }

    setInput("");
    await sendMessage({ text });
  };

  const isBusy = status === "streaming" || status === "submitted";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessage = messages.at(-1);
  const streamingAssistantId =
    isBusy && lastMessage?.role === "assistant" ? lastMessage.id : null;
  const waitingForAssistant =
    isBusy && (!lastMessage || lastMessage.role === "user");

  useEffect(() => {
    if (!autoScroll) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [messages, status, activeProposal, autoScroll]);

  return (
    <aside
      className={cn(
        "flex h-full min-h-0 min-w-0 flex-col overflow-hidden border-r bg-background",
        className,
      )}
    >
      <div className={cn("shrink-0 border-b px-4 py-3", headerClassName)}>
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <div>
            <h2 className="text-sm font-semibold">Resume Pilot</h2>
            <p className="text-xs text-muted-foreground">
              Full resume context
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        <div className="space-y-5">
          {messages.length === 0 && (
            <div className="rounded-lg border border-dashed p-3 text-xs leading-relaxed text-muted-foreground">
              Ask me to improve your summary, rewrite bullets, tailor your resume
              for a role, or suggest skills to highlight.
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              timestamp={messageTimestamps[message.id] ?? Date.now()}
              isStreaming={message.id === streamingAssistantId}
            />
          ))}

          {waitingForAssistant && pendingAssistantTimestamp !== null && (
            <AssistantTypingBubble timestamp={pendingAssistantTimestamp} />
          )}

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
            placeholder="Message…"
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
