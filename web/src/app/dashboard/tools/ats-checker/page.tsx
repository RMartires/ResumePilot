import { AtsToolClient } from "@/components/marketing/AtsToolClient";

export default function DashboardAtsCheckerPage() {
  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">ATS checker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Match your resume against a job description. See keyword gaps and
          formatting issues before you apply.
        </p>
      </div>
      <AtsToolClient mode="ats-checker" variant="dashboard" />
    </div>
  );
}
