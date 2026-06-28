"use client";

import type { UIMessage } from "ai";
import { isToolUIPart } from "ai";
import { cn } from "@/lib/utils";

type ChatMessageProps = {
  message: UIMessage;
};

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const text = getMessageText(message);
  const toolParts = message.parts.filter((part) => isToolUIPart(part));

  if (!text && toolParts.length === 0) return null;

  return (
    <div
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[90%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        {text && <p>{text}</p>}
        {!isUser && toolParts.length > 0 && !text && (
          <p className="text-muted-foreground italic">
            Preparing resume changes…
          </p>
        )}
      </div>
    </div>
  );
}
