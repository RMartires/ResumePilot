"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, LayoutTemplate, LogOut, Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  userEmail?: string;
};

export function AppSidebar({ userEmail }: AppSidebarProps) {
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="flex h-full w-44 shrink-0 flex-col border-r bg-card">
      <div className="border-b p-3">
        <Link href="/dashboard" className="text-base font-semibold text-blue-600">
          ResumeBuilder
        </Link>
        {userEmail ? (
          <p className="mt-1 truncate text-[11px] text-muted-foreground">
            {userEmail}
          </p>
        ) : null}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "justify-start px-2",
          )}
        >
          <FileText className="mr-2 h-4 w-4 shrink-0" />
          My Resumes
        </Link>
        <Link
          href="/dashboard/templates"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "justify-start px-2",
          )}
        >
          <LayoutTemplate className="mr-2 h-4 w-4 shrink-0" />
          Templates
        </Link>
      </nav>

      <div className="space-y-1.5 border-t p-2">
        <CreateResumeButton />
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start px-2 text-muted-foreground"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4 shrink-0" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}

function CreateResumeButton() {
  const router = useRouter();

  const create = async () => {
    const res = await fetch("/api/resumes", { method: "POST" });
    if (!res.ok) return;
    const { id } = await res.json();
    router.push(`/dashboard/resume/${id}`);
  };

  return (
    <Button className="w-full" size="sm" onClick={create}>
      <Plus className="mr-2 h-4 w-4 shrink-0" />
      New Resume
    </Button>
  );
}
