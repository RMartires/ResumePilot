import type { TemplateConfig } from "@/lib/validations/resume";
import { DEFAULT_TEMPLATES } from "@/lib/templates";

export type PublicTemplate = {
  slug: string;
  name: string;
  description: string;
  atsNotes: string[];
  config: TemplateConfig;
  isDefault: boolean;
};

const seoExtras: PublicTemplate[] = [
  {
    slug: "ats-single-column",
    name: "ATS Single Column",
    description:
      "Parse-safe single-column layout designed for Workday, Greenhouse, Lever, and Taleo.",
    atsNotes: [
      "Single column — no sidebars that confuse parsers",
      "Standard section headings (Experience, Education, Skills)",
      "Clean sans-serif fonts ATS systems read reliably",
    ],
    isDefault: false,
    config: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "0.75rem",
      accentColor: "#111827",
      sectionSpacing: "16px",
      headingTransform: "uppercase",
      layout: "standard",
    },
  },
  {
    slug: "professional",
    name: "Professional",
    description:
      "Corporate-safe ATS friendly resume template with clear hierarchy and measured spacing.",
    atsNotes: [
      "Traditional structure recruiters expect",
      "High contrast text for screen readers and parsers",
      "No tables, icons, or graphics in the body",
    ],
    isDefault: false,
    config: {
      fontFamily: "Libre Baskerville, Georgia, serif",
      fontSize: "0.72rem",
      accentColor: "#1e3a5f",
      sectionSpacing: "15px",
      headingTransform: "uppercase",
      layout: "standard",
    },
  },
];

const baseAtsNotes: Record<string, string[]> = {
  classic: [
    "Traditional serif look that still parses cleanly",
    "Uppercase section headings for clear structure",
    "Best for corporate and consulting applications",
  ],
  compact: [
    "Sans-serif readability with modest blue accents",
    "Relaxed spacing without multi-column traps",
    "Good default for tech and product roles",
  ],
  modern: [
    "Sidebar layout for human readers — use ATS Single Column when applying online",
    "Strong visual hierarchy for portfolio-style applications",
    "Export a single-column version before ATS portals",
  ],
};

export const PUBLIC_TEMPLATES: PublicTemplate[] = [
  ...DEFAULT_TEMPLATES.map((t) => ({
    slug: t.slug,
    name: t.name,
    description: t.description ?? `${t.name} resume template`,
    atsNotes: baseAtsNotes[t.slug] ?? ["ATS-oriented formatting defaults"],
    config: t.config,
    isDefault: t.is_default,
  })),
  ...seoExtras,
];

export function getPublicTemplate(slug: string): PublicTemplate | undefined {
  return PUBLIC_TEMPLATES.find((t) => t.slug === slug);
}

export function getAllPublicTemplateSlugs(): string[] {
  return PUBLIC_TEMPLATES.map((t) => t.slug);
}
