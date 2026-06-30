import type { TemplateConfig } from "@/lib/validations/resume";
import { templateConfigSchema } from "@/lib/validations/resume";
import { DEFAULT_TEMPLATES } from "@/lib/templates";

export type PdfTheme = {
  fonts: {
    normal: string;
    bold: string;
    italic: string;
    boldItalic: string;
  };
  sizes: {
    name: number;
    section: number;
    body: number;
    small: number;
  };
  accentColor: string;
  sectionGap: number;
  headingTransform: (title: string) => string;
  layout: TemplateConfig["layout"];
};

export function getDefaultTemplateConfig(): TemplateConfig {
  const fallback = DEFAULT_TEMPLATES[0].config;
  const seeded =
    DEFAULT_TEMPLATES.find((template) => template.is_default)?.config ?? fallback;
  return templateConfigSchema.parse(seeded);
}

function remToPt(value: string, fallbackRem: number): number {
  const rem = Number.parseFloat(value);
  const resolved = Number.isFinite(rem) ? rem : fallbackRem;
  return resolved * 12;
}

function pxToPt(value: string, fallbackPx: number): number {
  const px = Number.parseFloat(value);
  const resolved = Number.isFinite(px) ? px : fallbackPx;
  return resolved * 0.75;
}

export function buildPdfTheme(config: TemplateConfig): PdfTheme {
  const isSerif = /baskerville|georgia|serif/i.test(config.fontFamily);
  const body = remToPt(config.fontSize, 0.72);

  return {
    fonts: isSerif
      ? {
          normal: "Times-Roman",
          bold: "Times-Bold",
          italic: "Times-Italic",
          boldItalic: "Times-BoldItalic",
        }
      : {
          normal: "Helvetica",
          bold: "Helvetica-Bold",
          italic: "Helvetica-Oblique",
          boldItalic: "Helvetica-BoldOblique",
        },
    sizes: {
      name: body + 7,
      section: body + 1.5,
      body,
      small: Math.max(body - 1, 8),
    },
    accentColor: config.accentColor,
    sectionGap: pxToPt(config.sectionSpacing, 14),
    headingTransform: (title) =>
      config.headingTransform === "uppercase" ? title.toUpperCase() : title,
    layout: config.layout,
  };
}
