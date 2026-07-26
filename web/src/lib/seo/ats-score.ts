export type AtsFlag = {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
};

export type KeywordMatch = {
  term: string;
  found: boolean;
};

export type AtsScoreResult = {
  overallScore: number;
  keywordScore: number | null;
  formattingScore: number;
  matchedKeywords: KeywordMatch[];
  missingKeywords: string[];
  flags: AtsFlag[];
  wordCount: number;
  summary: string;
};

const SECTION_PATTERNS: { id: string; label: string; pattern: RegExp }[] = [
  { id: "experience", label: "Experience section", pattern: /\b(experience|work history|employment)\b/i },
  { id: "education", label: "Education section", pattern: /\b(education|academic)\b/i },
  { id: "skills", label: "Skills section", pattern: /\b(skills|technical skills|technologies)\b/i },
];

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
  "by", "from", "as", "is", "are", "was", "were", "be", "been", "being", "have",
  "has", "had", "do", "does", "did", "will", "would", "could", "should", "may",
  "might", "must", "shall", "can", "this", "that", "these", "those", "we", "you",
  "your", "our", "their", "they", "he", "she", "it", "its", "i", "me", "my",
  "not", "no", "yes", "all", "any", "each", "few", "more", "most", "other",
  "some", "such", "than", "too", "very", "just", "also", "into", "over", "after",
  "before", "about", "between", "through", "during", "without", "within", "across",
  "job", "role", "position", "team", "work", "working", "ability", "including",
  "using", "use", "used", "new", "strong", "experience", "years", "year",
  "required", "requirements", "preferred", "responsibilities", "opportunity",
]);

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9.+#\s-]/g, " ")
    .split(/[\s,/|;]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t) && !/^\d+$/.test(t));
}

/** Extract distinctive JD keywords: multi-word phrases first, then frequent tokens. */
export function extractJdKeywords(jdText: string, limit = 25): string[] {
  const normalized = normalizeText(jdText);
  if (!normalized) return [];

  const phrases = new Set<string>();
  const phrasePatterns = [
    /\b[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,3}\b/g,
    /\b(?:react|node\.?js|typescript|javascript|python|java|aws|azure|gcp|kubernetes|docker|sql|postgres|mongodb|graphql|rest|ci\/cd|machine learning|data science|project management|product management|customer success)\b/gi,
  ];

  for (const pattern of phrasePatterns) {
    for (const match of normalized.matchAll(pattern)) {
      const phrase = match[0].trim().toLowerCase();
      if (phrase.length >= 3 && !STOPWORDS.has(phrase)) {
        phrases.add(phrase);
      }
    }
  }

  const tokens = tokenize(normalized);
  const freq = new Map<string, number>();
  for (const token of tokens) {
    freq.set(token, (freq.get(token) ?? 0) + 1);
  }

  const rankedTokens = [...freq.entries()]
    .filter(([, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([token]) => token);

  const combined = [...phrases, ...rankedTokens];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const term of combined) {
    if (seen.has(term)) continue;
    seen.add(term);
    result.push(term);
    if (result.length >= limit) break;
  }
  return result;
}

function hasEmail(text: string): boolean {
  return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text);
}

function hasPhone(text: string): boolean {
  return /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/.test(text);
}

function looksLikeMultiColumn(text: string): boolean {
  const lines = text.split(/\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 8) return false;
  let tabby = 0;
  for (const line of lines.slice(0, 40)) {
    if (/\t/.test(line) || /\s{6,}\S+\s{6,}\S+/.test(line)) tabby += 1;
  }
  return tabby >= 4;
}

function scoreFormatting(resumeText: string): { score: number; flags: AtsFlag[] } {
  const text = normalizeText(resumeText);
  const raw = resumeText;
  const wordCount = tokenize(text).length;
  const flags: AtsFlag[] = [];

  const contactEmail = hasEmail(text);
  flags.push({
    id: "email",
    label: "Email address present",
    passed: contactEmail,
    detail: contactEmail
      ? "Contact email found — parsers can capture it."
      : "Add a plain-text email in the header.",
  });

  const contactPhone = hasPhone(text);
  flags.push({
    id: "phone",
    label: "Phone number present",
    passed: contactPhone,
    detail: contactPhone
      ? "Phone number detected."
      : "Optional but helpful — add a phone number in plain text.",
  });

  for (const section of SECTION_PATTERNS) {
    const passed = section.pattern.test(raw);
    flags.push({
      id: section.id,
      label: section.label,
      passed,
      detail: passed
        ? `Found a clear “${section.label.replace(" section", "")}” heading.`
        : `Add a standard “${section.label.replace(" section", "")}” heading.`,
    });
  }

  const multiColumn = looksLikeMultiColumn(raw);
  flags.push({
    id: "columns",
    label: "Single-column friendly layout",
    passed: !multiColumn,
    detail: multiColumn
      ? "Text looks multi-column or tab-separated — prefer a single-column ATS template."
      : "No strong multi-column signals detected.",
  });

  const lengthOk = wordCount >= 200 && wordCount <= 900;
  flags.push({
    id: "length",
    label: "Resume length in range",
    passed: lengthOk,
    detail:
      wordCount < 200
        ? `Only ~${wordCount} words — add quantified bullets.`
        : wordCount > 900
          ? `~${wordCount} words — tighten for a 1–2 page ATS resume.`
          : `~${wordCount} words — a solid length for most roles.`,
  });

  const critical = flags.filter((f) =>
    ["email", "experience", "skills", "columns"].includes(f.id),
  );
  const criticalPassed = critical.filter((f) => f.passed).length;
  const allPassed = flags.filter((f) => f.passed).length;
  const score = Math.round(
    (criticalPassed / Math.max(critical.length, 1)) * 60 +
      (allPassed / Math.max(flags.length, 1)) * 40,
  );

  return { score: Math.min(100, Math.max(0, score)), flags };
}

function scoreKeywords(
  resumeText: string,
  jdText: string,
): { score: number; matched: KeywordMatch[]; missing: string[] } {
  const keywords = extractJdKeywords(jdText);
  if (keywords.length === 0) {
    return { score: 0, matched: [], missing: [] };
  }

  const resumeLower = resumeText.toLowerCase();
  const matched: KeywordMatch[] = keywords.map((term) => ({
    term,
    found: resumeLower.includes(term.toLowerCase()),
  }));
  const foundCount = matched.filter((m) => m.found).length;
  const score = Math.round((foundCount / keywords.length) * 100);
  const missing = matched.filter((m) => !m.found).map((m) => m.term);

  return { score, matched, missing };
}

export function scoreResumeAgainstJd(
  resumeText: string,
  jdText?: string | null,
): AtsScoreResult {
  const resume = normalizeText(resumeText);
  if (!resume) {
    throw new Error("Resume text is empty.");
  }

  const { score: formattingScore, flags } = scoreFormatting(resumeText);
  const wordCount = tokenize(resume).length;

  const jd = jdText?.trim() ? normalizeText(jdText) : "";
  const keywordResult = jd
    ? scoreKeywords(resume, jd)
    : { score: null as number | null, matched: [] as KeywordMatch[], missing: [] as string[] };

  const overallScore =
    keywordResult.score === null
      ? formattingScore
      : Math.round(formattingScore * 0.45 + keywordResult.score * 0.55);

  let summary: string;
  if (keywordResult.score === null) {
    summary =
      overallScore >= 80
        ? "Strong formatting fundamentals. Paste a job description for a keyword match score."
        : overallScore >= 60
          ? "Decent structure with a few ATS risks to fix before you apply."
          : "Several ATS risks detected — fix contact info, sections, or layout first.";
  } else if (overallScore >= 80) {
    summary = "Strong match — polish missing keywords and you’re ready to apply.";
  } else if (overallScore >= 60) {
    summary = "Partial match — close the keyword gaps for this role before submitting.";
  } else {
    summary = "Low match — tailor bullets and skills to this job description.";
  }

  return {
    overallScore,
    keywordScore: keywordResult.score,
    formattingScore,
    matchedKeywords: keywordResult.matched,
    missingKeywords: keywordResult.missing,
    flags,
    wordCount,
    summary,
  };
}
