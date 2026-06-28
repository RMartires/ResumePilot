"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type AiMarkdownProps = {
  content: string;
  className?: string;
};

export function AiMarkdown({ content, className }: AiMarkdownProps) {
  return (
    <div
      className={cn(
        "leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className,
      )}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => (
          <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>
        ),
        li: ({ children }) => <li>{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        h1: ({ children }) => (
          <h3 className="mb-2 text-sm font-semibold">{children}</h3>
        ),
        h2: ({ children }) => (
          <h3 className="mb-2 text-sm font-semibold">{children}</h3>
        ),
        h3: ({ children }) => (
          <h3 className="mb-1.5 text-sm font-semibold">{children}</h3>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mb-2 border-l-2 border-border pl-3 text-muted-foreground last:mb-0">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="my-2 border-border" />,
        code: ({ className: codeClassName, children, ...props }) => {
          const isBlock = codeClassName?.includes("language-");

          if (isBlock) {
            return (
              <pre className="mb-2 overflow-x-auto rounded-md bg-background/70 p-2 text-xs last:mb-0">
                <code {...props}>{children}</code>
              </pre>
            );
          }

          return (
            <code
              className="rounded bg-background/70 px-1 py-0.5 font-mono text-[0.8125rem]"
              {...props}
            >
              {children}
            </code>
          );
        },
        a: ({ href, children }) => (
          <a
            href={href}
            className="font-medium underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
      }}
      >
        {content}
      </Markdown>
    </div>
  );
}
