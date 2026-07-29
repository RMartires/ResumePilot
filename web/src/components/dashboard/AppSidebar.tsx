"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Gauge,
  LayoutTemplate,
  LogOut,
  Plus,
  ScanSearch,
  Sparkles,
} from "lucide-react";
import { ResumePilotLogo, ResumePilotMark } from "@/components/brand/ResumePilotLogo";
import { ImportResumeButton } from "@/components/dashboard/ImportResumeButton";
import { Button, buttonVariants } from "@/components/ui/button";
import { AnalyticsEvent, track } from "@/lib/analytics/umami";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const SIDEBAR_OPEN_STORAGE_KEY = "dashboard-sidebar-open";

type AppSidebarProps = {
  userEmail?: string;
};

export function AppSidebar({ userEmail }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [isPro, setIsPro] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_OPEN_STORAGE_KEY);
    if (stored === "false") {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_OPEN_STORAGE_KEY, String(open));
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/billing/status");
        if (!response.ok) return;
        const data = (await response.json()) as { isPro?: boolean };
        if (!cancelled) {
          setIsPro(Boolean(data.isPro));
        }
      } catch {
        // Non-blocking; upgrade CTA stays visible until we know.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r bg-card transition-[width]",
        open ? "w-48" : "w-12",
      )}
    >
      <div className={cn("border-b", open ? "p-3" : "flex flex-col items-center py-3")}>
        {open ? (
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <Link href="/dashboard" className="block min-w-0">
                <ResumePilotLogo />
              </Link>
              {userEmail ? (
                <p className="mt-1 truncate text-[11px] text-muted-foreground">
                  {userEmail}
                </p>
              ) : null}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-muted-foreground"
              onClick={() => setOpen(false)}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="size-4" />
            </Button>
          </div>
        ) : (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              onClick={() => setOpen(true)}
              aria-label="Expand sidebar"
            >
              <ChevronRight className="size-4" />
            </Button>
            <Link
              href="/dashboard"
              className="mt-2"
              title="ResumePilot"
              aria-label="ResumePilot"
            >
              <ResumePilotMark className="h-7 w-7" />
            </Link>
          </>
        )}
      </div>

      <nav
        className={cn(
          "flex flex-1 flex-col gap-0.5 p-2",
          !open && "items-center",
        )}
      >
        <SidebarLink
          href="/dashboard"
          icon={FileText}
          label="My Resumes"
          collapsed={!open}
          active={pathname === "/dashboard"}
        />
        <SidebarLink
          href="/dashboard/templates"
          icon={LayoutTemplate}
          label="Templates"
          collapsed={!open}
          active={pathname.startsWith("/dashboard/templates")}
        />
        <SidebarLink
          href="/dashboard/tools/ats-checker"
          icon={ScanSearch}
          label="ATS Checker"
          collapsed={!open}
          active={pathname.startsWith("/dashboard/tools/ats-checker")}
        />
        <SidebarLink
          href="/dashboard/tools/resume-score"
          icon={Gauge}
          label="Resume Score"
          collapsed={!open}
          active={pathname.startsWith("/dashboard/tools/resume-score")}
        />
        <SidebarLink
          href="/dashboard/billing"
          icon={CreditCard}
          label="Usage & Billing"
          collapsed={!open}
          active={pathname.startsWith("/dashboard/billing")}
        />

        {isPro !== true ? (
          <UpgradeSidebarLink collapsed={!open} />
        ) : null}
      </nav>

      <div
        className={cn(
          "space-y-1.5 border-t p-2",
          !open && "flex flex-col items-center",
        )}
      >
        <ImportResumeButton collapsed={!open} />
        <CreateResumeButton collapsed={!open} />
        {open ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start px-2 text-muted-foreground"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4 shrink-0" />
            Sign out
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            onClick={signOut}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </aside>
  );
}

function UpgradeSidebarLink({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <Link
        href="/dashboard/upgrade"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "text-blue-600",
        )}
        aria-label="Upgrade to Pro"
        title="Upgrade to Pro"
      >
        <Sparkles className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <Link
      href="/dashboard/upgrade"
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "justify-start px-2 font-medium text-blue-600 hover:text-blue-700",
      )}
    >
      <Sparkles className="mr-2 h-4 w-4 shrink-0" />
      Upgrade to Pro
    </Link>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  label,
  collapsed,
  active,
}: {
  href: string;
  icon: typeof FileText;
  label: string;
  collapsed: boolean;
  active?: boolean;
}) {
  if (collapsed) {
    return (
      <Link
        href={href}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          active ? "bg-muted text-foreground" : "text-muted-foreground",
        )}
        aria-label={label}
        title={label}
      >
        <Icon className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "justify-start px-2",
        active && "bg-muted font-medium",
      )}
    >
      <Icon className="mr-2 h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

function CreateResumeButton({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();

  const create = async () => {
    const res = await fetch("/api/resumes", { method: "POST" });
    if (!res.ok) return;
    const { id } = await res.json();
    track(AnalyticsEvent.ResumeCreated);
    router.push(`/dashboard/resume/${id}`);
  };

  if (collapsed) {
    return (
      <Button
        size="icon-sm"
        variant="outline"
        onClick={create}
        aria-label="New Resume"
        title="New Resume"
      >
        <Plus className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button className="w-full" size="sm" variant="outline" onClick={create}>
      <Plus className="mr-2 h-4 w-4 shrink-0" />
      New Resume
    </Button>
  );
}
