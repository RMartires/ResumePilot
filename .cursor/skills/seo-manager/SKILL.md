---
name: seo-manager
description: >-
  Finds ResumePilot keyword opportunities in Google Search Console and Keywords
  Everywhere, runs deep research on the chosen keyword, ships or updates a
  content page, and opens a pull request. Use when acting as ResumePilot SEO
  specialist or seo-manager, hunting traffic keywords, adding an SEO page, or
  when the user mentions GSC, Keywords Everywhere, keyword opportunities, or
  ranking pages.
---

# ResumePilot SEO manager

Turn Search Console demand into one researched page and a pull request.

**Hard gates (never skip):**

1. After the keyword is chosen, **read and fully execute** `~/.cursor/skills/deep-research/SKILL.md` on that keyword. WebSearch-only is not a substitute.
2. After **every** numbered step below, **call `/summarize`** (Cursor command `glass-action-summarize`) and **stop the turn**. Do not start the next step in the same turn. Raw GSC/KE dumps and research quotes blow the context window.

If `/summarize` cannot be invoked as a tool, end the turn with the HANDOFF block and tell the user to run `/summarize`, then send “continue”.

## Progress checklist

Copy and keep current:

```
- [ ] Step 1: GSC + Keywords Everywhere analysis
- [ ] /summarize + stop
- [ ] Step 2: pick one keyword (and URL decision)
- [ ] /summarize + stop
- [ ] Step 3: /deep-research on the selected keyword (mandatory)
- [ ] /summarize + stop
- [ ] Step 4: new page or update from the research report
- [ ] /summarize + stop
- [ ] Step 5: tests + pull request
- [ ] /summarize + stop
- [ ] Step 6: reconcile page vs research; push follow-up if needed
```

## HANDOFF block (every stop)

Keep this short. Next step should not need the raw dumps.

```
HANDOFF
- Step just finished:
- Property: sc-domain:resumepilot.xyz
- Winning queries / pages (max 5):
- Candidate keyword:
- KE vol / competition:
- GSC: impressions, clicks, avg position, current landing URL
- Existing ResumePilot URL that might cannibalize:
- Decision (new URL vs update):
- Research dir:
- Report path:
- Branch / PR:
- Next step:
```

---

## Step 1 — Measure demand and neighbors

Discover MCP schemas with `GetMcpTools` before calling. Server ids vary; match `google-search-console` and `keywords-everywhere`. If GSC returns auth errors, call that server’s `mcp_auth` / `reauthenticate` once, then retry.

**Search Console** (`site_url`: `sc-domain:resumepilot.xyz`):

- `list_properties` if the property string is uncertain
- `get_performance_overview` — 90 days
- `get_search_analytics` — `dimensions: query`, 90 days, `row_limit: 500`
- `get_search_analytics` — `dimensions: page`, 90 days, `row_limit: 200`
- `get_search_analytics` — `dimensions: query,page`, 28 days, `row_limit: 500`

A new site with impressions and almost no clicks is still a signal. Wrong-URL clustering (format queries hitting `/templates`) is a stronger opportunity than a query that already has a matching canonical.

**Keywords Everywhere** (US unless the user says otherwise: `country: us`, `currency: usd`):

- Seed from the GSC cluster, not from imagination
- `get_related_keywords` + `get_pasf_keywords` on the top 1–2 seeds (`num: 50–100`)
- `get_keyword_data` on a shortlist (volume + competition)
- `get_domain_keywords` is optional; it may 404 — continue with related/PASF + keyword data

Map the shortlist against existing canonicals in `web/src/lib/seo/content/` and hubs like `/templates`, `/tools/ats-checker`. See [cms.md](cms.md).

Then `/summarize` and stop.

## Step 2 — Pick one keyword

Score candidates. Ship **one** URL this run.

| Signal | Prefer | Reject |
|---|---|---|
| KE volume | High enough to justify a URL (this cluster was ~10k+ US/mo) | Tiny tails when a head term is still unowned |
| KE competition | Low (this win was ~0.10) | High-competition terms with no distinct angle |
| Intent vs existing URL | Distinct (format ≠ template) | Same intent as a live canonical |
| GSC | Impressions on the **wrong** page / position ~80–90 | Already ranking a matching URL on page 1 |
| Product path | Checker, templates, or builder can convert | No honest CTA on ResumePilot |

**Default:** dedicated URL when intent differs; update the existing page only when the query already belongs to it.

State: keyword, slug, canonical, new vs update, why neighbors lose. Then `/summarize` and stop.

## Step 3 — Deep research (mandatory)

Read `~/.cursor/skills/deep-research/SKILL.md` and follow it. Default mode: **standard**.

Research question shape:

> What should a job seeker actually do for “{keyword}” in {year}, which claims are well supported, what currently ranks, and what page angle should ResumePilot take without cannibalizing {existing URL}?

Do **not** draft or edit the public page during this step.

After the report exists (`~/Documents/{Topic}_Research_{YYYYMMDD}/`):

- Keep the report path in HANDOFF
- Extract only page implications (angle, must-claim, must-not-claim, CTA order, verification step)
- `/summarize` and stop

## Step 4 — Write or update the page from the report

Read the report’s recommendations, then the live registry. Match ResumePilot voice: honest, no fake scores, employer configs vary.

**Do:**

- Put the primary verification step in the how-to, not only the FAQ
- Lead related links with the conversion path the SERP uses (usually `/tools/ats-checker`, then `/templates`)
- Link both ways (new page ↔ closest existing guides/hubs)
- Skip unverifiable vendor parse-rate / “pass rate” tables
- Follow [cms.md](cms.md) schemas, quality floors, tests, and routing (ATS guides are slug-routed; no extra `page.tsx`)

**Do not:** merge a how-to query onto a gallery URL, or invent statistics the report marked unsupported.

Then `/summarize` and stop.

## Step 5 — Tests and pull request

```bash
cd web && npm test -- src/lib/seo/content/registry.test.ts src/lib/seo/content/quality.test.ts
```

Update `registry.test.ts` counts (`ALL_CONTENT`, `published(GUIDES)`, canonical assertion). Add an e2e assertion in `web/e2e/app.spec.ts` for the H1 and a related link.

Branch: `seo/{slug}`. Commit only SEO content/test files. Never stage `brains/`, `extension/`, `.env`, or `.cursor/mcp.json`.

Open the PR with `gh`. If `origin` is read-only, push the fork (`git push https://github.com/<user>/ResumePilot.git HEAD:seo/{slug}`) and `gh pr create` against `RMartires/ResumePilot`.

PR body must mention keyword, KE vol/competition, GSC mismatch, research-backed angle, and test plan.

Then `/summarize` and stop.

## Step 6 — Reconcile research vs shipped copy

Diff the report against the live page. Patch gaps the report called out (paste-test placement, CTA order, caveats, FAQs). Push onto the same PR. Do not open a second PR for the same keyword.

---

## Anti-patterns

- Skipping `/deep-research` because Step 1 already fetched a few SERP pages
- Writing the page and the PR before research, then “researching” afterward
- Running steps 1–5 in one turn
- Cannibalizing `/templates` (or another hub) with a matching-intent query
- Republishing competitor 95%/42% style parse rates
- Picking PDF-always or Word-always when sources disagree; follow the posting + selectable text
- Committing unrelated dirty files with the SEO PR
