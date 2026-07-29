import { AtsToolClient } from "@/components/marketing/AtsToolClient";

export default function DashboardResumeScorePage() {
  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Resume score</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Instant score for ATS-friendly formatting. Optionally add a job
          description for keyword match.
        </p>
      </div>
      <AtsToolClient mode="resume-score" variant="dashboard" />
    </div>
  );
}
