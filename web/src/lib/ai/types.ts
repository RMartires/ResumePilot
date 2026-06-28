import type { Resume } from "@/lib/validations/resume";

export type ResumePatchProposal = {
  type: "patch";
  description: string;
  mode: "merge" | "replace";
  patch?: Partial<Resume>;
  resume?: Resume;
};
