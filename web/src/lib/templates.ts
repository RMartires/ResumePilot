import type { CSSProperties } from "react";
import type { TemplateConfig } from "@/lib/validations/resume";

export type Template = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  preview_url: string | null;
  config: TemplateConfig;
  is_default: boolean;
  created_at: string;
};

export const DEFAULT_TEMPLATES: Omit<Template, "id" | "created_at">[] = [
  {
    slug: "classic",
    name: "Classic",
    description: "Traditional serif layout with uppercase section headings.",
    preview_url: null,
    is_default: true,
    config: {
      fontFamily: "Libre Baskerville, Georgia, serif",
      fontSize: "0.72rem",
      accentColor: "#1a1a1a",
      sectionSpacing: "14px",
      headingTransform: "uppercase",
      layout: "standard",
    },
  },
  {
    slug: "compact",
    name: "Compact",
    description: "Clean sans-serif with blue accents and relaxed spacing.",
    preview_url: null,
    is_default: false,
    config: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "0.75rem",
      accentColor: "#2563eb",
      sectionSpacing: "18px",
      headingTransform: "none",
      layout: "standard",
    },
  },
  {
    slug: "modern",
    name: "Modern",
    description: "Two-column layout with sidebar for contact info.",
    preview_url: null,
    is_default: false,
    config: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "0.75rem",
      accentColor: "#2D9C6C",
      sectionSpacing: "18px",
      headingTransform: "uppercase",
      layout: "sidebar",
    },
  },
];

export function getTemplateStyles(config: TemplateConfig): CSSProperties {
  return {
    fontFamily: config.fontFamily,
    fontSize: config.fontSize,
    ["--resume-accent" as string]: config.accentColor,
    ["--resume-section-spacing" as string]: config.sectionSpacing,
  };
}
