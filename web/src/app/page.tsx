import Link from "next/link";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  // Supabase auth bypassed for local template testing
  // const supabase = await createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  // if (user) {
  //   redirect("/dashboard");
  // }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#eef1f6] px-4">
      <div className="max-w-lg text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          ResumeBuilder
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Build professional resumes with live preview, cloud sync, and
          one-click PDF export.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard/templates"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Browse templates
          </Link>
          <Link
            href="/preview"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            Sample preview
          </Link>
        </div>
      </div>
    </div>
  );
}
