import { tool } from "ai";
import { z } from "zod";
import type { Resume } from "@/lib/validations/resume";
import type { ResumePatchProposal } from "@/lib/ai/types";

function mergeProposal(
  description: string,
  patch: Partial<Resume>,
): ResumePatchProposal {
  return {
    type: "patch",
    description,
    mode: "merge",
    patch,
  };
}

export function createResumeTools(resume: Resume) {
  return {
    updateSummary: tool({
      description: "Update the professional summary paragraph",
      inputSchema: z.object({
        summary: z.string().describe("The new professional summary text"),
      }),
      execute: async ({ summary }) =>
        mergeProposal("Update professional summary", { summary }),
    }),

    updateSkills: tool({
      description: "Update the skills section (pipe-separated groups)",
      inputSchema: z.object({
        skills: z.string().describe("Skills text, pipe-separated groups"),
      }),
      execute: async ({ skills }) =>
        mergeProposal("Update skills section", { skills }),
    }),

    updateHeader: tool({
      description: "Update contact/header fields",
      inputSchema: z.object({
        name: z.string().optional(),
        location: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        links: z.array(z.string()).optional(),
      }),
      execute: async (fields) =>
        mergeProposal("Update header / contact info", {
          header: { ...resume.header, ...fields },
        }),
    }),

    updateExperienceJob: tool({
      description:
        "Update a single experience entry by index (0-based). Only include fields to change.",
      inputSchema: z.object({
        index: z.number().int().min(0),
        title: z.string().optional(),
        company: z.string().optional(),
        dates: z.string().optional(),
        location: z.string().optional(),
        bullets: z.array(z.string()).optional(),
      }),
      execute: async ({ index, ...fields }) => {
        if (index >= resume.experience.length) {
          throw new Error(`Experience index ${index} is out of range`);
        }
        const experience = resume.experience.map((job, i) =>
          i === index ? { ...job, ...fields } : job,
        );
        return mergeProposal(`Update experience entry #${index + 1}`, {
          experience,
        });
      },
    }),

    addExperienceJob: tool({
      description: "Add a new experience entry at the end of the list",
      inputSchema: z.object({
        title: z.string(),
        company: z.string(),
        dates: z.string(),
        location: z.string().optional().default(""),
        bullets: z.array(z.string()).default([""]),
      }),
      execute: async (job) =>
        mergeProposal("Add new experience entry", {
          experience: [
            ...resume.experience,
            {
              ...job,
              startDate: "",
              endDate: "",
              current: false,
            },
          ],
        }),
    }),

    updateProject: tool({
      description: "Update a project entry by index (0-based)",
      inputSchema: z.object({
        index: z.number().int().min(0),
        name: z.string().optional(),
        url: z.string().optional(),
        bullets: z.array(z.string()).optional(),
      }),
      execute: async ({ index, ...fields }) => {
        if (index >= resume.projects.length) {
          throw new Error(`Project index ${index} is out of range`);
        }
        const projects = resume.projects.map((project, i) =>
          i === index ? { ...project, ...fields } : project,
        );
        return mergeProposal(`Update project #${index + 1}`, { projects });
      },
    }),

    updateEducation: tool({
      description: "Update primary education fields",
      inputSchema: z.object({
        school: z.string().optional(),
        degree: z.string().optional(),
        fieldOfStudy: z.string().optional(),
        year: z.string().optional(),
        graduationDate: z.string().optional(),
        marks: z.string().optional(),
        description: z.string().optional(),
      }),
      execute: async (fields) =>
        mergeProposal("Update education section", {
          education: { ...resume.education, ...fields },
        }),
    }),

    replaceResume: tool({
      description:
        "Replace the entire resume. Only use when the user explicitly requests a full rewrite.",
      inputSchema: z.object({
        header: z.object({
          name: z.string(),
          location: z.string(),
          phone: z.string(),
          email: z.string(),
          gender: z.string().optional(),
          links: z.array(z.string()),
        }),
        summary: z.string(),
        skills: z.string(),
        experience: z.array(
          z.object({
            title: z.string(),
            company: z.string(),
            dates: z.string(),
            location: z.string().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            current: z.boolean().optional(),
            bullets: z.array(z.string()),
          }),
        ),
        projects: z.array(
          z.object({
            name: z.string(),
            url: z.string(),
            bullets: z.array(z.string()),
          }),
        ),
        education: z.object({
          school: z.string(),
          degree: z.string(),
          fieldOfStudy: z.string(),
          year: z.string(),
          graduationDate: z.string(),
          marks: z.string(),
          marksType: z.string(),
          description: z.string(),
          secondary: z.array(
            z.object({
              school: z.string(),
              degree: z.string(),
              fieldOfStudy: z.string(),
              year: z.string(),
              graduationDate: z.string(),
              marks: z.string(),
              marksType: z.string(),
              description: z.string(),
            }),
          ),
        }),
      }),
      execute: async (data) =>
        ({
          type: "patch",
          description: "Replace entire resume",
          mode: "replace",
          resume: data as Resume,
        }) satisfies ResumePatchProposal,
    }),
  };
}

export type ResumeTools = ReturnType<typeof createResumeTools>;
