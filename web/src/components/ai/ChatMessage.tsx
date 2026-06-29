"use client";

import type { UIMessage } from "ai";
import { isToolUIPart } from "ai";
import { Loader2, Sparkles } from "lucide-react";
import { AiMarkdown } from "@/components/ai/AiMarkdown";
import { getAssistantChatText } from "@/lib/ai/extract-chat-message";
import { formatMessageTime } from "@/lib/ai/format-message-time";

type ChatMessageProps = {
  message: UIMessage;
  timestamp: number;
  isStreaming?: boolean;
};

function HorizontalLoadingDots() {
  return (
    <div
      className="flex items-center gap-1 pt-1"
      aria-label="Assistant is typing"
    >
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="size-1.5 rounded-full bg-muted-foreground/45 animate-pulse"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

function MessageMeta({
  isUser,
  timestamp,
}: {
  isUser: boolean;
  timestamp: number;
}) {
  const time = formatMessageTime(timestamp);

  if (isUser) {
    return (
      <p className="mb-1 text-xs text-muted-foreground">
        You • {time}
      </p>
    );
  }

  return (
    <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
      <Sparkles className="size-3.5 shrink-0 text-primary" />
      <span>Resume Pilot • {time}</span>
    </div>
  );
}

function getMessageText(message: UIMessage): string {
  const text = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  if (message.role !== "assistant") return text;
  return getAssistantChatText(text);
}

function AssistantMessageBody({
  text,
  isStreaming,
  showToolPending,
}: {
  text: string;
  isStreaming: boolean;
  showToolPending: boolean;
}) {
  const showThinking = isStreaming && !text;

  return (
    <div className="rounded-lg border border-slate-200/90 bg-slate-50 px-3.5 py-3 text-sm text-foreground shadow-sm">
      {showThinking && (
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin text-primary" />
          <span>Thinking…</span>
        </div>
      )}

      {text && <AiMarkdown content={text} />}

      {!text && showToolPending && !showThinking && (
        <p className="text-muted-foreground italic">
          Preparing resume changes…
        </p>
      )}

      {isStreaming && <HorizontalLoadingDots />}
    </div>
  );
}

export function ChatMessage({
  message,
  timestamp,
  isStreaming = false,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const text = getMessageText(message);
  const toolParts = message.parts.filter((part) => isToolUIPart(part));
  const showAssistantShell =
    !isUser && (Boolean(text) || isStreaming || toolParts.length > 0);

  if (isUser && !text) return null;
  if (!isUser && !showAssistantShell) return null;

  return (
    <article className="space-y-0">
      <MessageMeta isUser={isUser} timestamp={timestamp} />

      {isUser ? (
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
          {text}
        </p>
      ) : (
        <AssistantMessageBody
          text={text}
          isStreaming={isStreaming}
          showToolPending={toolParts.length > 0}
        />
      )}
    </article>
  );
}

export function AssistantTypingBubble({
  timestamp = Date.now(),
}: {
  timestamp?: number;
}) {
  return (
    <article className="space-y-0">
      <MessageMeta isUser={false} timestamp={timestamp} />
      <AssistantMessageBody text="" isStreaming showToolPending={false} />
    </article>
  );
}
