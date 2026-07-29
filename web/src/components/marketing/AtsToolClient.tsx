"use client";

import { useState } from "react";
import Link from "next/link";
import type { AtsScoreResult } from "@/lib/seo/ats-score";
import { SignInCta } from "@/components/marketing/SignInCta";
import { AnalyticsEvent } from "@/lib/analytics/umami";
import { trackSeoFunnelEvent } from "@/lib/analytics/seo-funnel";
import { formatUserFacingApiError } from "@/lib/billing/format-api-error";
import { cn } from "@/lib/utils";

type AtsToolClientProps = {
  mode: "ats-checker" | "resume-score";
  /** marketing = dark public tools; dashboard = light logged-in tools */
  variant?: "marketing" | "dashboard";
};

export function AtsToolClient({
  mode,
  variant = "marketing",
}: AtsToolClientProps) {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeUrl, setUpgradeUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AtsScoreResult | null>(null);

  const isDashboard = variant === "dashboard";

  const jdRequiredHint =
    mode === "ats-checker"
      ? "Paste the job description for keyword matching (recommended)."
      : "Optional: paste a job description to include keyword match in your resume score.";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setUpgradeUrl(null);
    setResult(null);

    try {
      const form = new FormData();
      if (resumeText.trim()) form.set("resumeText", resumeText);
      if (jdText.trim()) form.set("jdText", jdText);
      if (file) form.set("file", file);
      form.set("tool", mode);

      const response = await fetch("/api/tools/ats-check", {
        method: "POST",
        body: form,
      });
      const data = (await response.json()) as {
        result?: AtsScoreResult;
        error?: string;
        code?: string;
        upgradeUrl?: string;
        signInUrl?: string;
        eventType?: string;
      };

      if (response.status === 401) {
        throw new Error(
          data.error ??
            "Sign in to use your free monthly checks, or upgrade to Pro for unlimited access.",
        );
      }

      if (response.status === 402) {
        const friendly = formatUserFacingApiError(JSON.stringify(data));
        setUpgradeUrl(friendly.upgradeUrl ?? "/dashboard/upgrade");
        throw new Error(friendly.message);
      }

      if (!response.ok || !data.result) {
        throw new Error(data.error ?? "Could not score this resume.");
      }
      setResult(data.result);
      trackSeoFunnelEvent(AnalyticsEvent.SeoToolCompleted, {
        source_page: window.location.pathname,
        tool: mode,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <form
        onSubmit={handleSubmit}
        className={cn(
          "grid gap-6 rounded-2xl border p-6 lg:grid-cols-2",
          isDashboard
            ? "border-border bg-card shadow-sm"
            : "border-white/10 bg-white/[0.03]",
        )}
      >
        <div className="space-y-4">
          <label
            className={cn(
              "block text-sm font-medium",
              isDashboard ? "text-foreground" : "text-zinc-200",
            )}
          >
            Resume PDF (optional if you paste text)
            <input
              type="file"
              accept="application/pdf,.pdf"
              className={cn(
                "mt-2 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white",
                isDashboard ? "text-muted-foreground" : "text-zinc-400",
              )}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <label
            className={cn(
              "block text-sm font-medium",
              isDashboard ? "text-foreground" : "text-zinc-200",
            )}
          >
            Or paste resume text
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={12}
              placeholder="Paste your resume text here…"
              className={cn(
                "mt-2 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none",
                isDashboard
                  ? "border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-blue-500"
                  : "border-white/10 bg-[#0a0e16] text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50",
              )}
            />
          </label>
        </div>

        <div className="space-y-4">
          <label
            className={cn(
              "block text-sm font-medium",
              isDashboard ? "text-foreground" : "text-zinc-200",
            )}
          >
            Job description
            <span
              className={cn(
                "mt-1 block font-normal",
                isDashboard ? "text-muted-foreground" : "text-zinc-500",
              )}
            >
              {jdRequiredHint}
            </span>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              rows={14}
              placeholder="Paste the job posting here…"
              className={cn(
                "mt-2 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none",
                isDashboard
                  ? "border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-blue-500"
                  : "border-white/10 bg-[#0a0e16] text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50",
              )}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
          >
            {loading
              ? "Scoring…"
              : mode === "resume-score"
                ? "Get resume score"
                : "Check ATS match"}
          </button>
          {error ? (
            <p
              className={cn(
                "text-sm",
                isDashboard ? "text-red-600" : "text-red-400",
              )}
            >
              {error}{" "}
              {error.includes("Sign in") ? (
                <Link
                  href="/login"
                  className={cn(
                    "underline",
                    isDashboard
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-blue-300 hover:text-blue-200",
                  )}
                >
                  Sign in
                </Link>
              ) : upgradeUrl || /limit|Upgrade/i.test(error) ? (
                <Link
                  href={upgradeUrl ?? "/dashboard/upgrade"}
                  className={cn(
                    "underline",
                    isDashboard
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-blue-300 hover:text-blue-200",
                  )}
                >
                  View Pro plans
                </Link>
              ) : null}
            </p>
          ) : null}
          <p
            className={cn(
              "text-xs",
              isDashboard ? "text-muted-foreground" : "text-zinc-500",
            )}
          >
            {isDashboard
              ? `Counts toward your free monthly allowance (${mode === "ats-checker" ? "3 ATS checks" : "3 resume scores"}). Pro is unlimited.`
              : `Sign in to use your free monthly allowance (${mode === "ats-checker" ? "3 ATS checks" : "3 resume scores"}). Pro is unlimited.`}
          </p>
        </div>
      </form>

      {result ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <ScoreStat
              label="Overall score"
              value={result.overallScore}
              variant={variant}
            />
            <ScoreStat
              label="Formatting"
              value={result.formattingScore}
              variant={variant}
            />
            <ScoreStat
              label="Keyword match"
              value={result.keywordScore}
              emptyLabel="Add a JD"
              variant={variant}
            />
          </div>
          <p
            className={cn(
              "text-sm leading-6",
              isDashboard ? "text-muted-foreground" : "text-zinc-300",
            )}
          >
            {result.summary}
          </p>

          <div className="grid gap-6 lg:grid-cols-2">
            <div
              className={cn(
                "rounded-2xl border p-5",
                isDashboard
                  ? "border-border bg-card shadow-sm"
                  : "border-white/10 bg-[#0a0e16]",
              )}
            >
              <h2
                className={cn(
                  "text-base font-semibold",
                  isDashboard ? "text-foreground" : "text-white",
                )}
              >
                Formatting checks
              </h2>
              <ul className="mt-4 space-y-3">
                {result.flags.map((flag) => (
                  <li key={flag.id} className="text-sm">
                    <p
                      className={
                        flag.passed
                          ? isDashboard
                            ? "font-medium text-emerald-700"
                            : "font-medium text-emerald-300"
                          : isDashboard
                            ? "font-medium text-amber-700"
                            : "font-medium text-amber-300"
                      }
                    >
                      {flag.passed ? "Pass" : "Fix"} — {flag.label}
                    </p>
                    <p
                      className={cn(
                        "mt-0.5",
                        isDashboard ? "text-muted-foreground" : "text-zinc-400",
                      )}
                    >
                      {flag.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={cn(
                "rounded-2xl border p-5",
                isDashboard
                  ? "border-border bg-card shadow-sm"
                  : "border-white/10 bg-[#0a0e16]",
              )}
            >
              <h2
                className={cn(
                  "text-base font-semibold",
                  isDashboard ? "text-foreground" : "text-white",
                )}
              >
                Keywords
              </h2>
              {result.matchedKeywords.length === 0 ? (
                <p
                  className={cn(
                    "mt-4 text-sm",
                    isDashboard ? "text-muted-foreground" : "text-zinc-400",
                  )}
                >
                  Paste a job description to see matched and missing keywords.
                </p>
              ) : (
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <p
                      className={
                        isDashboard
                          ? "font-medium text-emerald-700"
                          : "font-medium text-emerald-300"
                      }
                    >
                      Matched
                    </p>
                    <p
                      className={cn(
                        "mt-1",
                        isDashboard ? "text-foreground/80" : "text-zinc-300",
                      )}
                    >
                      {result.matchedKeywords
                        .filter((k) => k.found)
                        .map((k) => k.term)
                        .join(", ") || "None yet"}
                    </p>
                  </div>
                  <div>
                    <p
                      className={
                        isDashboard
                          ? "font-medium text-amber-700"
                          : "font-medium text-amber-300"
                      }
                    >
                      Missing
                    </p>
                    <p
                      className={cn(
                        "mt-1",
                        isDashboard ? "text-foreground/80" : "text-zinc-300",
                      )}
                    >
                      {result.missingKeywords.slice(0, 20).join(", ") || "None"}
                    </p>
                  </div>
                </div>
              )}
              <p
                className={cn(
                  "mt-6 text-sm",
                  isDashboard ? "text-muted-foreground" : "text-zinc-400",
                )}
              >
                Want AI rewrites that close these gaps?{" "}
                <Link
                  href={
                    isDashboard ? "/dashboard/templates" : "/templates"
                  }
                  className={
                    isDashboard
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-blue-300 hover:text-blue-200"
                  }
                >
                  Start from an ATS template
                </Link>
                {isDashboard ? " or open a resume to tailor with AI." : " or sign in to tailor in the builder."}
              </p>
            </div>
          </div>

          {isDashboard ? null : (
            <SignInCta
              title="Save versions and AI-tailor this resume"
              description="The free checker shows the gaps. ResumePilot helps you rewrite bullets, match each JD, and export ATS-safe PDFs."
              href="/#sign-in"
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

function ScoreStat({
  label,
  value,
  emptyLabel,
  variant = "marketing",
}: {
  label: string;
  value: number | null;
  emptyLabel?: string;
  variant?: "marketing" | "dashboard";
}) {
  const isDashboard = variant === "dashboard";
  return (
    <div
      className={cn(
        "rounded-2xl border px-5 py-4 text-center",
        isDashboard
          ? "border-border bg-card shadow-sm"
          : "border-white/10 bg-white/[0.03]",
      )}
    >
      <p
        className={cn(
          "text-3xl font-bold",
          isDashboard ? "text-foreground" : "text-white",
        )}
      >
        {value === null ? emptyLabel ?? "—" : `${value}`}
      </p>
      <p
        className={cn(
          "mt-1 text-sm",
          isDashboard ? "text-muted-foreground" : "text-zinc-400",
        )}
      >
        {label}
      </p>
    </div>
  );
}
