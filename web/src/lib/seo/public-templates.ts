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
  {
    slug: "simple",
    name: "Simple",
    description:
      "Minimal ATS friendly resume template with plain headings and generous whitespace.",
    atsNotes: [
      "Minimal styling reduces parse failures",
      "Clear section order: summary → experience → education → skills",
      "Ideal when a portal strips formatting aggressively",
    ],
    isDefault: false,
    config: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "0.74rem",
      accentColor: "#18181b",
      sectionSpacing: "20px",
      headingTransform: "none",
      layout: "standard",
    },
  },
  {
    slug: "executive",
    name: "Executive",
    description:
      "Senior-level ATS resume template with restrained serif type and strong section labels.",
    atsNotes: [
      "Leadership-friendly hierarchy without multi-column traps",
      "Uppercase headings for skimmable structure",
      "Works for director and VP applications through ATS portals",
    ],
    isDefault: false,
    config: {
      fontFamily: "Libre Baskerville, Georgia, serif",
      fontSize: "0.7rem",
      accentColor: "#0f172a",
      sectionSpacing: "14px",
      headingTransform: "uppercase",
      layout: "standard",
    },
  },
  {
    slug: "tech",
    name: "Tech",
    description:
      "Engineering-focused ATS resume template optimized for skills density and project bullets.",
    atsNotes: [
      "Sans-serif body text for dense skill and stack lists",
      "Blue accent kept subtle so PDF text stays selectable",
      "Pairs well with keyword-heavy software engineer JDs",
    ],
    isDefault: false,
    config: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "0.75rem",
      accentColor: "#2563eb",
      sectionSpacing: "16px",
      headingTransform: "none",
      layout: "standard",
    },
  },
  {
    slug: "entry-level",
    name: "Entry Level",
    description:
      "New-grad ATS friendly resume template that elevates projects, education, and skills.",
    atsNotes: [
      "Room for projects and coursework without sidebar clutter",
      "Standard headings ATS keyword scanners recognize",
      "Best when experience bullets are shorter",
    ],
    isDefault: false,
    config: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "0.76rem",
      accentColor: "#0f766e",
      sectionSpacing: "18px",
      headingTransform: "none",
      layout: "standard",
    },
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    description:
      "Clinical and allied-health ATS resume template with clear credentials and experience blocks.",
    atsNotes: [
      "Single-column flow for licenses and certifications",
      "High-contrast text for printed and portal uploads",
      "Avoids icon rows that break nursing/hospital ATS parsers",
    ],
    isDefault: false,
    config: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "0.73rem",
      accentColor: "#0e7490",
      sectionSpacing: "15px",
      headingTransform: "uppercase",
      layout: "standard",
    },
  },
  {
    slug: "student",
    name: "Student",
    description:
      "Campus and internship ATS resume template with education-first friendly spacing.",
    atsNotes: [
      "Education and projects stay parser-readable",
      "No columns that reorder internship bullets incorrectly",
      "Clean export for Handshake and university career portals",
    ],
    isDefault: false,
    config: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "0.75rem",
      accentColor: "#4338ca",
      sectionSpacing: "17px",
      headingTransform: "none",
      layout: "standard",
    },
  },
  {
    slug: "one-page",
    name: "One Page",
    description:
      "Tight ATS friendly resume template for fitting strong experience onto a single page.",
    atsNotes: [
      "Tighter spacing while keeping standard section names",
      "Still single-column for reliable ATS parsing",
      "Use when recruiters ask for a one-page resume",
    ],
    isDefault: false,
    config: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "0.7rem",
      accentColor: "#1f2937",
      sectionSpacing: "12px",
      headingTransform: "uppercase",
      layout: "standard",
    },
  },
  {
    slug: "clean",
    name: "Clean",
    description:
      "Neutral ATS resume template with balanced spacing and no decorative flourishes.",
    atsNotes: [
      "Neutral palette that survives black-and-white ATS renders",
      "Consistent heading transform for section detection",
      "Safe default for most corporate job boards",
    ],
    isDefault: false,
    config: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "0.74rem",
      accentColor: "#334155",
      sectionSpacing: "16px",
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
