import { emptyResume, normalizeResume } from "@/lib/resume";
import type { Resume, TemplateConfig } from "@/lib/validations/resume";

/** Short fake resume for public marketing previews — no real PII. */
export function getPublicPreviewResume(config: TemplateConfig): Resume {
  const base = {
    ...emptyResume(),
    header: {
      ...emptyResume().header,
      name: "Alex Rivera",
      email: "alex@example.com",
      phone: "+1 555 0100",
      location: "San Francisco, CA",
      links: ["https://linkedin.com/in/example"],
    },
    summary:
      "Product-minded engineer with experience shipping reliable web applications.",
    skills: "React, TypeScript, Node.js",
    experience: [
      {
        title: "Software Engineer",
        company: "Acme Corp",
        dates: "2021 – Present",
        location: "",
        startDate: "",
        endDate: "",
        current: true,
        bullets: ["Built features used by thousands of users."],
      },
    ],
    education: {
      ...emptyResume().education,
      school: "State University",
      degree: "B.S. Computer Science",
      year: "2020",
    },
    projects: [
      {
        name: "Sample Project",
        url: "",
        bullets: ["Open-source tool for resume building."],
      },
    ],
  };

  if (config.layout === "sidebar") {
    return normalizeResume(base);
  }

  return normalizeResume(base);
}
