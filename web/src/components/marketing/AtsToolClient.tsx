"use client";

import { useState } from "react";
import Link from "next/link";
import type { AtsScoreResult } from "@/lib/seo/ats-score";
import { SignInCta } from "@/components/marketing/SignInCta";

type AtsToolClientProps = {
  mode: "ats-checker" | "resume-score";
};

export function AtsToolClient({ mode }: AtsToolClientProps) {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AtsScoreResult | null>(null);

  const jdRequiredHint =
    mode === "ats-checker"
      ? "Paste the job description for keyword matching (recommended)."
      : "Optional: paste a job description to include keyword match in your resume score.";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const form = new FormData();
      if (resumeText.trim()) form.set("resumeText", resumeText);
      if (jdText.trim()) form.set("jdText", jdText);
      if (file) form.set("file", file);

      const response = await fetch("/api/tools/ats-check", {
        method: "POST",
        body: form,
      });
      const data = (await response.json()) as {
        result?: AtsScoreResult;
        error?: string;
      };

      if (!response.ok || !data.result) {
        throw new Error(data.error ?? "Could not score this resume.");
      }
      setResult(data.result);
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
        className="grid gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:grid-cols-2"
      >
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-200">
            Resume PDF (optional if you paste text)
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="mt-2 block w-full text-sm text-zinc-400 file:mr-3 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <label className="block text-sm font-medium text-zinc-200">
            Or paste resume text
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={12}
              placeholder="Paste your resume text here…"
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a0e16] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none"
            />
          </label>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-200">
            Job description
            <span className="mt-1 block font-normal text-zinc-500">
              {jdRequiredHint}
            </span>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              rows={14}
              placeholder="Paste the job posting here…"
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a0e16] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none"
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
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </div>
      </form>

      {result ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <ScoreStat label="Overall score" value={result.overallScore} />
            <ScoreStat label="Formatting" value={result.formattingScore} />
            <ScoreStat
              label="Keyword match"
              value={result.keywordScore}
              emptyLabel="Add a JD"
            />
          </div>
          <p className="text-sm leading-6 text-zinc-300">{result.summary}</p>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#0a0e16] p-5">
              <h2 className="text-base font-semibold text-white">Formatting checks</h2>
              <ul className="mt-4 space-y-3">
                {result.flags.map((flag) => (
                  <li key={flag.id} className="text-sm">
                    <p
                      className={
                        flag.passed ? "font-medium text-emerald-300" : "font-medium text-amber-300"
                      }
                    >
                      {flag.passed ? "Pass" : "Fix"} — {flag.label}
                    </p>
                    <p className="mt-0.5 text-zinc-400">{flag.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0a0e16] p-5">
              <h2 className="text-base font-semibold text-white">Keywords</h2>
              {result.matchedKeywords.length === 0 ? (
                <p className="mt-4 text-sm text-zinc-400">
                  Paste a job description to see matched and missing keywords.
                </p>
              ) : (
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <p className="font-medium text-emerald-300">Matched</p>
                    <p className="mt-1 text-zinc-300">
                      {result.matchedKeywords
                        .filter((k) => k.found)
                        .map((k) => k.term)
                        .join(", ") || "None yet"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-amber-300">Missing</p>
                    <p className="mt-1 text-zinc-300">
                      {result.missingKeywords.slice(0, 20).join(", ") || "None"}
                    </p>
                  </div>
                </div>
              )}
              <p className="mt-6 text-sm text-zinc-400">
                Want AI rewrites that close these gaps?{" "}
                <Link href="/templates" className="text-blue-300 hover:text-blue-200">
                  Start from an ATS template
                </Link>{" "}
                or sign in to tailor in the builder.
              </p>
            </div>
          </div>

          <SignInCta
            title="Save versions and AI-tailor this resume"
            description="The free checker shows the gaps. ResumePilot helps you rewrite bullets, match each JD, and export ATS-safe PDFs."
            href="/#sign-in"
          />
        </div>
      ) : null}
    </div>
  );
}

function ScoreStat({
  label,
  value,
  emptyLabel,
}: {
  label: string;
  value: number | null;
  emptyLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center">
      <p className="text-3xl font-bold text-white">
        {value === null ? emptyLabel ?? "—" : `${value}`}
      </p>
      <p className="mt-1 text-sm text-zinc-400">{label}</p>
    </div>
  );
}
