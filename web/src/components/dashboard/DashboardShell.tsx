"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { LocalStorageImportDialog } from "@/components/dashboard/LocalStorageImportDialog";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  userEmail?: string;
  children: React.ReactNode;
};

/** Sidebar is hidden on mobile resume editor routes; `contents` keeps flex layout on desktop. */
export function DashboardShell({ userEmail, children }: DashboardShellProps) {
  const pathname = usePathname();
  const isResumeEditor = /^\/dashboard\/resume\/[^/]+$/.test(pathname);

  return (
    <div className="flex h-dvh overflow-hidden">
      <div className={cn(isResumeEditor && "hidden lg:contents")}>
        <AppSidebar userEmail={userEmail} />
      </div>
      <main
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col",
          isResumeEditor ? "overflow-hidden" : "overflow-y-auto",
        )}
      >
        {children}
      </main>
      <LocalStorageImportDialog />
    </div>
  );
}
