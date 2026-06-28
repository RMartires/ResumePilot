import type { JSONContent } from "@tiptap/core";

export function bulletsToDoc(bullets: string[]): JSONContent {
  const items = bullets.map((b) => b.trim()).filter(Boolean);

  if (items.length === 0) {
    return {
      type: "doc",
      content: [
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [{ type: "paragraph" }],
            },
          ],
        },
      ],
    };
  }

  return {
    type: "doc",
    content: [
      {
        type: "bulletList",
        content: items.map((text) => ({
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: text ? [{ type: "text", text }] : [],
            },
          ],
        })),
      },
    ],
  };
}

export function docToBullets(doc: JSONContent): string[] {
  const bullets: string[] = [];

  const walk = (node: JSONContent) => {
    if (node.type === "listItem") {
      const text = collectText(node);
      bullets.push(text);
      return;
    }
    node.content?.forEach(walk);
  };

  walk(doc);

  if (bullets.length === 0) {
    const text = collectText(doc).trim();
    return text ? [text] : [""];
  }

  return bullets;
}

export function textToDoc(text: string): JSONContent {
  const trimmed = text.trim();
  if (!trimmed) {
    return { type: "doc", content: [{ type: "paragraph" }] };
  }

  return {
    type: "doc",
    content: trimmed.split(/\n+/).map((line) => ({
      type: "paragraph",
      content: line ? [{ type: "text", text: line }] : [],
    })),
  };
}

export function docToText(doc: JSONContent): string {
  const paragraphs: string[] = [];

  const walk = (node: JSONContent) => {
    if (node.type === "paragraph" || node.type === "listItem") {
      const text = collectText(node).trim();
      if (text) paragraphs.push(text);
      return;
    }
    node.content?.forEach(walk);
  };

  walk(doc);
  return paragraphs.join("\n");
}

function collectText(node: JSONContent): string {
  if (node.type === "text") return node.text ?? "";
  return node.content?.map(collectText).join("") ?? "";
}
