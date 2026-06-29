// import { createClient } from "@/lib/supabase/server";
import { ResumeList } from "@/components/dashboard/ResumeList";

export default async function DashboardPage() {
  // Supabase bypassed — empty list for local template testing
  const resumes: { id: string; title: string; updated_at: string; template_id: string | null }[] = [];
  // const supabase = await createClient();
  // const { data: resumes } = await supabase
  //   .from("resumes")
  //   .select("id, title, updated_at, template_id")
  //   .order("updated_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Resumes</h1>
        <p className="text-muted-foreground">
          Create, edit, and export your resumes.
        </p>
      </div>
      <ResumeList resumes={resumes ?? []} />
    </div>
  );
}
