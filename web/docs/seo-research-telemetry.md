# Privacy design for future aggregate ATS research

Status: design only. Do **not** implement collection, storage, publication, or research analytics until product, privacy/legal, consent copy, storage location, processor terms, and retention have written approval.

## Purpose and boundary

The only proposed purpose is to publish aggregate observations about ATS-check outcomes, such as the share of opted-in checks that detect a standard section heading. The research system must not reproduce, infer, profile, or retain an individual's resume, job description, identity, employer, application, or account activity.

This proposal is separate from essential request processing and existing product analytics. Research consent must not be bundled with service use, authentication, marketing consent, or a privacy-policy acceptance.

## Data that is forbidden

The research client, endpoint, logs, queue, warehouse, dashboards, exports, and backups must never store or transmit:

- resume text, snippets, tokens, keywords, section contents, or embeddings;
- job-description text, snippets, tokens, keywords, employer names, or job titles;
- PDFs, extracted PDF content, filenames, file hashes, object-storage keys, or document metadata;
- names, email addresses, phone numbers, postal addresses, or social/profile URLs;
- IP addresses, user-agent strings, precise timestamps, or precise location;
- account IDs, user IDs, anonymous IDs, device IDs, session IDs, cookies, advertising IDs, or fingerprinting attributes;
- free-form properties, raw URLs, query strings, referrers, stack traces containing request data, or any field not explicitly allowlisted below.

Infrastructure must be configured so the research route does not write IP addresses, request bodies, query strings, or user agents to access logs, WAF logs, error trackers, traces, or replay tools. If the hosting stack cannot guarantee that behavior, the research endpoint must not launch.

## Consent experience

Display an unchecked, optional control after a result is computed and before any research event is sent:

> Help improve public ATS research by sharing only anonymous, pre-defined score ranges and pass/fail checks from this result. Resume and job-description text, files, contact details, account identifiers, and IP addresses are not included. This does not affect your result. [Learn what is shared]

Requirements:

1. Default off. No preselection, dark pattern, or blocked workflow.
2. `Accept and share this result` performs a one-time submission for the visible result. Declining sends nothing.
3. The details view lists every possible field and its bucket boundaries in plain language.
4. Consent is versioned. A material schema, purpose, retention, or processor change requires a new choice.
5. Consent is not persisted as a user profile. A browser-local preference may be considered only after privacy review; if used, it must remain optional, easy to clear, and must not become an identifier.
6. The UI states that one-time anonymous records cannot be located later by person. It also provides a global pause/withdrawal control that stops future sharing.
7. Users under the product's permitted age threshold, where known, must not be prompted until legal review approves the treatment.

## Allowlisted event

Only one event is proposed: `ats_research_result_v1`. The server must reject unknown keys, unknown enum values, arrays, nested free-form objects, and payloads over 2 KB.

```ts
type AtsResearchResultV1 = {
  event: "ats_research_result_v1";
  consent_version: "research-v1";
  result_mode: "ats-checker" | "resume-score";
  input_mode: "pasted-text" | "pdf";
  has_job_description: boolean;
  overall_score_bucket: "0-19" | "20-39" | "40-59" | "60-79" | "80-100";
  formatting_score_bucket: "0-19" | "20-39" | "40-59" | "60-79" | "80-100";
  keyword_score_bucket: "not-computed" | "0-19" | "20-39" | "40-59" | "60-79" | "80-100";
  contact_email_check: "pass" | "fail";
  contact_phone_check: "pass" | "fail";
  experience_heading_check: "pass" | "fail";
  education_heading_check: "pass" | "fail";
  skills_heading_check: "pass" | "fail";
  word_count_bucket: "0-199" | "200-399" | "400-599" | "600-799" | "800-plus";
  sampled: true;
};
```

No client-supplied date, locale, role, industry, keyword, browser, acquisition source, or experiment field is permitted. The service may add only a coarse server-side `received_week` in ISO week form after removing transport metadata. It must not retain the precise receipt time.

Schema validation must use a strict allowlist on both client and server. Research fields must be derived in memory from the already-computed result and must never be joined to product, authentication, billing, marketing, support, or general analytics data.

## Sampling

- Apply unbiased per-result random sampling before transmission, with a documented fixed probability such as 10%.
- Sampling happens only after explicit consent. A non-sampled consent action sends no research payload.
- The event contains `sampled: true`; sampling probability is stored in a separate version-controlled methodology record, not varied by person or result.
- Do not use user/session identifiers for deterministic sampling. Do not oversample rare scores or specific groups without a separately reviewed protocol.
- Monitor only aggregate delivery counts. Do not add retry identifiers; at most one best-effort request is allowed, with no durable client queue.

## Storage and access

Use a dedicated aggregate-research store and service account. Do not reuse the resume database or product analytics tables. Restrict write access to the validated ingestion service and read access to named research maintainers. Audit administrative access without logging event payloads.

The ingestion path should validate, sample, discard transport metadata, convert receipt time to `received_week`, and increment aggregate counters. Prefer atomic counters keyed only by week and allowlisted dimensions rather than retaining event-level rows. A shared transactional or analytical backend is required; in-memory process state is not durable or complete in serverless deployments.

Proposed retention:

- request bodies and event-level rows: never retained;
- weekly unpublished aggregate counters: 90 days;
- approved published aggregate tables and frozen methodology: retain while the publication remains live;
- operational security logs: shortest approved period, with research route IP, query, body, and user-agent capture disabled.

Automate expiry and test it. Backups must follow the same maximum retention or document the shortest technically possible schedule before launch.

## Deletion and incident controls

Because events contain no identifiers, individual records cannot be reliably located or deleted by person. Explain this before consent. A user can withdraw only from future sharing. Provide:

- a feature flag that immediately disables prompts and ingestion;
- deletion by week/schema version for bad data, consent defects, or an incident;
- an aggregate-publication retraction procedure;
- processor and backup deletion procedures;
- incident review that treats any forbidden field as a privacy breach and halts ingestion.

Do not claim data is anonymous until privacy/legal review confirms the complete flow, including hosting logs and processors.

## Publication safeguards

Before a table, chart, downloadable file, or statement is released:

1. Apply minimum cell size **k = 50** to every displayed cell and every value derivable by subtraction. Suppress or combine smaller cells.
2. Require at least 500 sampled, consented results across at least four complete weeks for a general finding.
3. Do not publish intersections beyond the allowlisted dimensions. Avoid differencing attacks across overlapping releases.
4. Round percentages to whole numbers and counts to coarse bands where practical.
5. Have a second reviewer reproduce suppression and denominator calculations.
6. Freeze the aggregate extract, schema version, sampling rate, date range, exclusions, and analysis code used for the publication.
7. Re-run privacy review if rare categories, longitudinal trends, geography, occupation, employer, or demographic dimensions are proposed.

K-anonymity is a publication threshold, not proof of anonymity. It does not replace consent, data minimization, access control, or review.

## Methodology and claims

Every publication must say:

- results come only from people who used ResumePilot's public tools, explicitly opted in, and were sampled;
- the sample is self-selected and is not representative of all job seekers, resumes, employers, or ATS products;
- checks are ResumePilot heuristics, not observations from employer ATS systems and not measures of interview or hiring outcomes;
- pasted text and PDF inputs may differ, extraction can fail, and tool/schema changes can shift results;
- multiple checks may come from the same person because no identifier is collected, so observations are tool runs rather than unique people;
- scores and pass/fail checks can be correlated and must not be presented as causal;
- date range, sample size after suppression, sampling probability, missing/excluded results, schema version, and analysis method.

Do not use the dataset to rank demographic groups, infer protected traits, make employment decisions, train models, personalize product behavior, target advertising, or claim that a score causes hiring success.

## Required approvals and implementation gate

Before engineering starts, obtain and record:

- approved research purpose, owner, lawful basis, jurisdictions, and age handling;
- final consent and withdrawal copy from product and privacy/legal reviewers;
- approved processor, region, data-flow diagram, logging configuration, access list, retention, backups, and incident process;
- privacy-policy update explaining the optional research, exact categories, retention, publication, processors, and inability to perform identity-based deletion on anonymous records;
- security review of strict validation, payload limits, CSRF/abuse controls, log redaction, and feature-flag shutdown;
- analytics and methodology review of sampling, deduplication limitation, k threshold, suppression, and claims;
- test plan proving that declining consent sends no request and that every forbidden field and unknown key is rejected.

Until all items are approved, the application must continue to compute ATS results without research collection or research storage.

