import { cn } from "@/lib/utils";

type ResumePilotMarkProps = {
  className?: string;
  title?: string;
};

/** Square icon mark for favicon, collapsed sidebar, and compact placements. */
export function ResumePilotMark({
  className,
  title = "ResumePilot",
}: ResumePilotMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role="img"
      aria-label={title}
    >
      <rect width="32" height="32" rx="8" fill="#2563EB" />
      <path
        d="M9 8.5C9 7.67 9.67 7 10.5 7H17.5L22 11.5V23.5C22 24.33 21.33 25 20.5 25H10.5C9.67 25 9 24.33 9 23.5V8.5Z"
        fill="white"
      />
      <path d="M17.5 7L22 11.5H18.5C17.95 11.5 17.5 11.05 17.5 10.5V7Z" fill="#DBEAFE" />
      <path
        d="M12 13.5H19"
        stroke="#2563EB"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 16.5H17.5"
        stroke="#2563EB"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M21.5 18.5L26.5 15.5L26.5 21.5L21.5 18.5Z"
        fill="#1D4ED8"
      />
      <path
        d="M24 14.5V22.5"
        stroke="white"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

type ResumePilotLogoProps = {
  className?: string;
  showWordmark?: boolean;
};

/** Full logo with optional wordmark for sidebar and marketing surfaces. */
export function ResumePilotLogo({
  className,
  showWordmark = true,
}: ResumePilotLogoProps) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      <ResumePilotMark className="h-7 w-7" title="" aria-hidden />
      {showWordmark ? (
        <span className="truncate text-base font-semibold leading-none tracking-tight">
          <span className="text-foreground">Resume</span>
          <span className="text-blue-600">Pilot</span>
        </span>
      ) : null}
    </span>
  );
}
