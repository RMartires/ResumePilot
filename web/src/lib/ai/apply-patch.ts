import { normalizeResume } from "@/lib/resume";
import type { ResumePatchProposal } from "@/lib/ai/types";
import type { Resume } from "@/lib/validations/resume";

export function applyResumePatch(
  current: Resume,
  proposal: ResumePatchProposal,
): Resume {
  if (proposal.mode === "replace" && proposal.resume) {
    return normalizeResume(proposal.resume);
  }

  if (proposal.patch) {
    return normalizeResume({ ...current, ...proposal.patch });
  }

  return current;
}
