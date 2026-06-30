import { createClient } from "@/lib/supabase/server";
import { ImportResumeButton } from "@/components/dashboard/ImportResumeButton";
import { ResumeList } from "@/components/dashboard/ResumeList";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: resumes } = await supabase
    .from("resumes")
    .select("id, title, updated_at, template_id")
    .order("updated_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Resumes</h1>
          <p className="text-muted-foreground">
            Create, edit, and export your resumes.
          </p>
        </div>
        <ImportResumeButton className="w-auto shrink-0" />
      </div>
      <ResumeList resumes={resumes ?? []} />
    </div>
  );
}
