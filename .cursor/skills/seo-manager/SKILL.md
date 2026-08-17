---
name: seo-manager
description: >-
  Finds unowned ResumePilot keyword opportunities from Google Search Console,
  competitor domains, and Keywords Everywhere, then researches, ships one new
  page, and updates brains/seo inventory. Use when acting as ResumePilot SEO
  specialist or seo-manager, hunting traffic keywords, adding an SEO page, or
  when the user mentions GSC, Keywords Everywhere, keyword opportunities, or
  ranking pages. Does not re-pick clusters we already have pages for.
---

# ResumePilot SEO manager

Turn Search Console demand into one researched page and a pull request.

**Hard gates (never skip):**

1. Before scoring keywords, **read** `brains/seo/README.md`, `owned-keywords.md`, `competitors.md`, `opportunities.md`, and `ship-log.md`.
2. After the keyword is chosen, run **deep-research in a Task subagent** (see Step 3). Do not run it in this parent thread. WebSearch-only is not a substitute.
3. Persist progress to `brains/seo/run.md` after every step. The next step reads that file — not chat history, not GSC dumps, not the full research report.

**Do not ask the user to run `/summarize`.** That command is a Cursor UI action (`glass-action-summarize`). It is not a tool and cannot be invoked from a skill. Context is kept small by subagents + `run.md`, not by compressing the chat.

**Pick rule (2026-08-17):** Ship a keyword we **do not already have a page for**. Same-cluster synonyms are not a new keyword (`ats friendly resume format` ≡ `ats friendly resume template` ≡ `ats-layout`). Do not re-pick a cluster because Search Console has not indexed yesterday’s URL. Prefer competitor-domain keywords that are missing from `owned-keywords.md`.

## Context isolation (replaces `/summarize`)

| Fat work | Where it runs | What the parent may keep |
|----------|---------------|--------------------------|
| Step 1 GSC + KE + competitor pulls | **Task** `generalPurpose` subagent | Path to `run.md` + 5-row table max |
| Step 3 deep-research | **Task** `generalPurpose` subagent | Paths + `page_implications.md` only |
| Steps 2, 4, 5, 6 | Parent | `run.md` + cms.md + the files being edited |

**Parent must never:** paste MCP JSON into chat, `Read` `evidence.jsonl` / `sources.jsonl` / the full research markdown, or re-fetch GSC/KE “to remember.” If a number is needed, it is already in `run.md`.

If a subagent cannot use MCP, it writes that failure into `run.md` and stops. The parent then runs **only** the failed MCP calls, writes the compact table to `run.md`, and still does not echo raw dumps.

## Progress checklist

Copy and keep current. Continue to the next step in this conversation unless the user vetoes the keyword after Step 2.

```
- [ ] Step 1: inventory + GSC + competitor KE (subagent) → run.md
- [ ] Step 2: pick one unowned keyword → run.md
- [ ] Step 3: deep-research (subagent) → page_implications.md + run.md
- [ ] Step 4: new page from implications + cms.md
- [ ] Step 5: tests + pull request + brains/seo inventory
- [ ] Step 6: reconcile page vs research recommendations; push follow-up if needed
```

## `brains/seo/run.md`

Overwrite this file each run. Copy the template from [run.example.md](../../../brains/seo/run.example.md). Do not commit `run.md` (gitignored).

After each step, the chat message is the HANDOFF block only (no dumps).

```
HANDOFF
- Step just finished:
- Property: sc-domain:resumepilot.xyz
- Winning queries / pages (max 5):
- Candidate keyword:
- Cluster:
- Owned-map hit (must be none, or stop):
- Competitor source (domain / URL):
- KE vol / competition:
- GSC: impressions, clicks, avg position, current landing URL
- Existing ResumePilot URL that might cannibalize:
- Decision (new URL vs update — default new URL):
- Research dir:
- Report path:
- Implications path:
- Branch / PR:
- Next step:
```

---

## Step 1 — Inventory, demand, and competitor keywords

Launch a **Task** subagent (`subagent_type: generalPurpose`). Prompt it to:

1. Read `brains/seo/` inventory and drop owned / cooldown terms.
2. Discover MCP schemas (`GetMcpTools`) for `google-search-console` and `keywords-everywhere`. If GSC auth errors, `mcp_auth` / `reauthenticate` once, then retry.
3. Pull Search Console (`site_url`: `sc-domain:resumepilot.xyz`): `list_properties` if needed; `get_performance_overview` 90 days; `get_search_analytics` query 90d/500; page 90d/200; query+page 28d/500.
4. For 2–3 domains in `competitors.md`, `get_domain_keywords` (`country: us`, `num: 50–100`). On 404, `get_url_keywords` on seed URLs. Keep terms with **no** ResumePilot page.
5. KE US (`country: us`, `currency: usd`): related + PASF on 1–2 **unowned** seeds; `get_keyword_data` on a shortlist. Append leftovers to `opportunities.md` parking lot.
6. Write a compact score table into `brains/seo/run.md`. Return **only** the HANDOFF block to the parent.

Wrong-URL clustering on a query whose canonical **does not exist yet** is useful. Wrong-URL clustering on a query we shipped in the last 14 days is indexing lag — not a new page.

Parent: read `run.md`, show the HANDOFF, go to Step 2.

## Step 2 — Pick one unowned keyword

Read `run.md` (not Step 1 tool output). Ship **one** URL this run. Default is a **new** canonical. Updating an existing page is allowed only when the user asks, or when GSC shows the *matching* URL indexed for 28+ days with a CTR/position problem.

| Signal | Prefer | Reject |
|---|---|---|
| Owned map | No row, no synonym, cluster has no page | Anything in `owned-keywords.md` or the same cluster |
| Cooldown | Cluster idle ≥ 14 days and GSC lists the new URL | Cluster shipped this week; “format queries still hit `/templates`” after a format ship |
| Competitor | Term a listed competitor ranks for | Terms only we invented |
| KE volume | High enough to justify a URL | Tiny tails when a better unowned head term exists |
| KE competition | Low enough for a young domain | High-competition terms with no distinct angle |
| Intent | New cluster vs live canonicals | Synonym of a live page (`format` ≉ a new `template` URL) |
| GSC | Impressions with **no** matching URL | Matching URL already exists (even at position 80) |
| Product path | Checker, templates, or builder can convert | No honest CTA on ResumePilot |

Write the pick into `run.md`. State keyword, cluster, slug, canonical, why it is unowned, competitor source, why neighbors lose.

**One gate:** tell the user the pick in one short paragraph. If they veto, pick the next unowned row. Otherwise continue to Step 3 in this conversation — do not wait for `/summarize`.

## Step 3 — Deep research (mandatory, subagent only)

Do **not** read `~/.cursor/skills/deep-research/SKILL.md` in the parent. Launch Task `generalPurpose` with a prompt that includes:

- Read and fully execute `~/.cursor/skills/deep-research/SKILL.md`. Default mode: **standard**.
- Research question:

> What should a job seeker actually do for “{keyword}” in {year}, which claims are well supported, what currently ranks, and what page angle should ResumePilot take without cannibalizing {existing URL}?

- Do not draft or edit the public page.
- Write the report to `~/Documents/{Topic}_Research_{YYYYMMDD}/` as the deep-research skill requires.
- Also write `{dir}/page_implications.md` (max ~40 lines): angle, must-claim, must-not-claim, CTA order, verification step, related-link order, suggested slug/canonical.
- Return to the parent **only**: research dir, report path, implications path, and a 6-line recap. Do not return quotes, bibliographies, or MCP/search dumps.

Parent: update `run.md` with those paths. **Read `page_implications.md` only.** Do not open the full report, HTML, or JSONL. Continue to Step 4.

## Step 4 — Write the page from implications

Read `page_implications.md`, then [cms.md](cms.md) and the live registry. Match ResumePilot voice: honest, no fake scores, employer configs vary.

**Do:**

- Put the primary verification step in the how-to, not only the FAQ
- Lead related links with the conversion path the SERP uses (usually `/tools/ats-checker`, then `/templates`)
- Link both ways (new page ↔ closest existing guides/hubs)
- Skip unverifiable vendor parse-rate / “pass rate” tables
- Follow cms.md schemas, quality floors, tests, and routing (ATS guides are slug-routed; no extra `page.tsx`)

**Do not:** merge a how-to query onto a gallery URL, or invent statistics the implications marked unsupported. Do not load the full research report unless a specific claim is missing from implications — then read that section only.

Update `run.md`. Continue to Step 5.

## Step 5 — Tests and pull request

```bash
cd web && npm test -- src/lib/seo/content/registry.test.ts src/lib/seo/content/quality.test.ts
```

Update `registry.test.ts` counts (`ALL_CONTENT`, `published(GUIDES)`, canonical assertion). Add an e2e assertion in `web/e2e/app.spec.ts` for the H1 and a related link.

Update `brains/seo/`: move the keyword (and synonyms) to `owned-keywords.md`, remove them from `opportunities.md`, append `ship-log.md`.

Branch: `seo/{slug}`. Commit SEO content/test files **and** `brains/seo/*` inventory updates. Never stage `brains/seo/run.md`, `brains/traffic-growth-before-monetization/` dumps, `extension/`, `.env`, or `.cursor/mcp.json`.

Open the PR with `gh`. If `origin` is read-only, push the fork (`git push https://github.com/<user>/ResumePilot.git HEAD:seo/{slug}`) and `gh pr create` against `RMartires/ResumePilot`.

PR body must mention keyword, KE vol/competition, GSC mismatch, research-backed angle, and test plan.

Update `run.md` with the PR URL. Continue to Step 6.

## Step 6 — Reconcile research vs shipped copy

Read the report’s **Recommendations** section (not the whole file) and diff against the live page. Patch gaps (paste-test placement, CTA order, caveats, FAQs). Push onto the same PR. Do not open a second PR for the same keyword.

---

## Anti-patterns

- Running deep-research (or dumping GSC/KE JSON) in the parent thread
- Asking the user to run `/summarize` (not a tool; isolation is the substitute)
- Reading `evidence.jsonl`, `sources.jsonl`, or the full report in the parent
- Skipping deep-research because Step 1 already fetched a few SERP pages
- Writing the page before the subagent’s `page_implications.md` exists
- Treating `format` vs `template` (or other synonyms) as a new keyword
- Re-picking a cluster because GSC has not indexed yesterday’s page
- Cannibalizing `/templates` (or another hub) with a matching-intent query
- Skipping competitor domain/URL keyword pulls
- Republishing competitor 95%/42% style parse rates
- Picking PDF-always or Word-always when sources disagree; follow the posting + selectable text
- Committing unrelated dirty files or `run.md` with the SEO PR
- Shipping a page without updating `brains/seo/` inventory
