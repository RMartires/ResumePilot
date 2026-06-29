import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  ChartColumn,
  FileText,
  Import,
  LayoutTemplate,
  ScanSearch,
  Target,
  WandSparkles,
} from "lucide-react";

export const heroBullets = [
  "AI bullet & summary writer",
  "ATS match scoring",
  "Job description keyword matching",
  "Cover letter generator",
];

export const stats = [
  { value: "60s", label: "To your first tailored draft" },
  { value: "8+", label: "Tools in one workflow" },
  { value: "ATS", label: "Optimized by default" },
  { value: "$0", label: "To get started" },
];

export type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const features: FeatureItem[] = [
  {
    title: "AI resume writer",
    description:
      "Generate bullet points, summaries, and full first drafts from your experience or a pasted job description in seconds.",
    icon: WandSparkles,
  },
  {
    title: "ATS scoring & checker",
    description:
      "Real-time match scores and parse-safe formatting. Single-column templates that pass Workday, Greenhouse, Lever, and Taleo.",
    icon: ScanSearch,
  },
  {
    title: "Job description tailoring",
    description:
      "Paste any posting and get keyword gaps, match percentages, and suggested edits so each application is targeted — not copy-pasted.",
    icon: Target,
  },
  {
    title: "Professional templates",
    description:
      "ATS-friendly layouts plus polished designs. Switch between a corporate-safe version and a standout visual resume when you need both.",
    icon: LayoutTemplate,
  },
  {
    title: "Cover letter generator",
    description:
      "Role-specific cover letters in seconds, synced with your resume content and the job description you're applying to.",
    icon: FileText,
  },
  {
    title: "LinkedIn import",
    description:
      "Pull your profile into a structured resume instantly. Update once, export PDF or Word for every application.",
    icon: Import,
  },
  {
    title: "Job application tracker",
    description:
      "Kanban-style pipeline from saved roles to interviews. Clip jobs from 50+ boards and keep resume versions attached to each.",
    icon: Briefcase,
  },
  {
    title: "Resume analytics",
    description:
      "See what's working — keyword density, quantified bullets, length, and section completeness before you hit submit.",
    icon: ChartColumn,
  },
];

export const steps = [
  {
    number: "01",
    title: "Import or start fresh",
    description:
      "Upload a PDF, import LinkedIn, or answer a few prompts. AI builds your baseline in under a minute.",
  },
  {
    number: "02",
    title: "Tailor to the role",
    description:
      "Paste the job description. Get a match score, missing keywords, and AI rewrites you can edit in your voice.",
  },
  {
    number: "03",
    title: "Pass ATS, stay human",
    description:
      "Use parse-safe templates and quantified bullets. Edit AI output so it sounds like you — not a template.",
  },
  {
    number: "04",
    title: "Track & apply",
    description:
      "Export PDF or Word, generate a cover letter, and log the application in your job search tracker.",
  },
];

export const includedItems = [
  "AI bullet & summary writer",
  "ATS match scoring",
  "Job description keyword matching",
  "Cover letter generator",
  "LinkedIn profile import",
  "Application tracker",
  "PDF & Word export",
  "Free tier at launch",
];

export const faqs = [
  {
    question: "What is ResumePilot?",
    answer:
      "ResumePilot is an AI resume builder that helps you write, tailor, and track applications in one place. You get AI writing, ATS scoring, job-description matching, cover letters, templates, and a job tracker without switching tools.",
  },
  {
    question: "Will my resume pass ATS filters?",
    answer:
      "ResumePilot uses single-column, parser-safe layouts and keyword matching built for modern applicant tracking systems. You also get a match score before you apply so you can fix gaps early.",
  },
  {
    question: "Can employers tell I used AI?",
    answer:
      "Generic AI output stands out for the wrong reasons. ResumePilot gives you drafts to edit, not finished copy. Add your metrics, tighten the wording, and make sure every line reflects your real experience.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes. Sign in with Google to get started. Core resume building and AI assistance are available so you can try it before upgrading.",
  },
];

export const DEMO_VIDEO_URL = "/videos/resumepilot_demo.mp4";
