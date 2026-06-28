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
    <aside className="flex w-56 shrink-0 flex-col border-r bg-card">
      <div className="border-b p-4">
        <Link href="/dashboard" className="text-lg font-semibold text-blue-600">
          ResumeBuilder
        </Link>
        {userEmail ? (
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {userEmail}
          </p>
        ) : null}
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
        >
          <FileText className="mr-2 h-4 w-4" />
          My Resumes
        </Link>
        <Link
          href="/dashboard/templates"
          className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
        >
          <LayoutTemplate className="mr-2 h-4 w-4" />
          Templates
        </Link>
      </nav>

      <div className="space-y-2 border-t p-3">
        <CreateResumeButton />
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
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
    <Button className="w-full" onClick={create}>
      <Plus className="mr-2 h-4 w-4" />
      New Resume
    </Button>
  );
}
