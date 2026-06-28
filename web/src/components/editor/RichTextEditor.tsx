"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  RemoveFormatting,
  Strikethrough,
  Underline as UnderlineIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  bulletsToDoc,
  docToBullets,
  docToText,
  textToDoc,
} from "@/lib/rich-text";

type RichTextEditorProps = {
  label: string;
  required?: boolean;
  variant?: "bullets" | "text";
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  className?: string;
};

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      title={title}
      aria-label={title}
      aria-pressed={active}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        "size-7 rounded-md text-muted-foreground",
        active && "bg-muted text-foreground",
      )}
    >
      {children}
    </Button>
  );
}

function serializeValue(
  value: string | string[],
  variant: "bullets" | "text",
): string {
  if (variant === "bullets") {
    return JSON.stringify(Array.isArray(value) ? value : [""]);
  }
  return typeof value === "string" ? value : "";
}

export function RichTextEditor({
  label,
  required,
  variant = "text",
  value,
  onChange,
  placeholder = "Start typing…",
  className,
}: RichTextEditorProps) {
  const [, setEditorRevision] = useState(0);
  const lastEmittedValue = useRef(serializeValue(value, variant));

  const initialContent =
    variant === "bullets"
      ? bulletsToDoc(Array.isArray(value) ? value : [""])
      : textToDoc(typeof value === "string" ? value : "");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        code: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[120px] px-3 py-2 text-sm focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const json = ed.getJSON();
      const nextValue =
        variant === "bullets"
          ? docToBullets(json)
          : docToText(json);
      lastEmittedValue.current = serializeValue(nextValue, variant);
      onChange(nextValue);
    },
  });

  useEffect(() => {
    if (!editor) return;

    const refreshToolbar = () => setEditorRevision((n) => n + 1);
    editor.on("selectionUpdate", refreshToolbar);
    editor.on("transaction", refreshToolbar);

    return () => {
      editor.off("selectionUpdate", refreshToolbar);
      editor.off("transaction", refreshToolbar);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const externalValue = serializeValue(value, variant);
    if (externalValue === lastEmittedValue.current) return;

    const nextContent =
      variant === "bullets"
        ? bulletsToDoc(Array.isArray(value) ? value : [""])
        : textToDoc(typeof value === "string" ? value : "");

    editor.commands.setContent(nextContent, { emitUpdate: false });
    lastEmittedValue.current = externalValue;
  }, [editor, value, variant]);

  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      <div className="overflow-hidden rounded-lg border border-input bg-background shadow-sm">
        <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-2 py-1.5">
          <span className="mr-1 rounded-md border border-transparent px-2 py-1 text-xs text-muted-foreground">
            Normal
          </span>
          <div className="mx-1 h-5 w-px bg-border" />
          <ToolbarButton
            title="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Underline"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="size-3.5 underline decoration-primary decoration-2 underline-offset-2" />
          </ToolbarButton>
          <ToolbarButton
            title="Strikethrough"
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="size-3.5" />
          </ToolbarButton>
          <div className="mx-1 h-5 w-px bg-border" />
          <ToolbarButton
            title="Bulleted list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Numbered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Link" active={editor.isActive("link")} onClick={setLink}>
            <Link2 className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Clear formatting"
            onClick={() =>
              editor.chain().focus().clearNodes().unsetAllMarks().run()
            }
          >
            <RemoveFormatting className="size-3.5" />
          </ToolbarButton>
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
