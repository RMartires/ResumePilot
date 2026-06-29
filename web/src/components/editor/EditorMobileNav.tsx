"use client";

import { Eye, MessageSquareText, Pencil, type LucideIcon } from "lucide-react";
import { PendingAiIndicator } from "@/components/editor/PendingAiIndicator";
import { cn } from "@/lib/utils";

export type MobileEditorPanel = "editor" | "preview" | "chat";

/** Keep preview zoom controls aligned with the mobile tab bar. */
export const MOBILE_NAV_BOTTOM_OFFSET =
  "calc(4.75rem + env(safe-area-inset-bottom))";

type EditorMobileNavProps = {
  active: MobileEditorPanel;
  onChange: (panel: MobileEditorPanel) => void;
  hasPendingAiChanges?: boolean;
};

const tabs: {
  id: MobileEditorPanel;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "editor", label: "Editor", icon: Pencil },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "chat", label: "AI Chat", icon: MessageSquareText },
];

export function EditorMobileNav({
  active,
  onChange,
  hasPendingAiChanges,
}: EditorMobileNavProps) {
  return (
    <nav
      className="shrink-0 border-t bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Editor panels"
    >
      <div className="grid grid-cols-3">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={cn(
                "relative flex flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="relative">
                <Icon className="size-5" strokeWidth={isActive ? 2.25 : 2} />
                {id === "preview" && hasPendingAiChanges ? (
                  <PendingAiIndicator className="absolute -top-0.5 -right-1" />
                ) : null}
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
