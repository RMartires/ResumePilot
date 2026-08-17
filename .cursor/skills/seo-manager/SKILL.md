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
2. After the keyword is chosen, **read and fully execute** `~/.cursor/skills/deep-research/SKILL.md` on that keyword. WebSearch-only is not a substitute.
3. After **every** numbered step below, **call `/summarize`** (Cursor command `glass-action-summarize`) and **stop the turn**. Do not start the next step in the same turn. Raw GSC/KE dumps and research quotes blow the context window.

If `/summarize` cannot be invoked as a tool, end the turn with the HANDOFF block and tell the user to run `/summarize`, then send “continue”.

**Pick rule (2026-08-17):** Ship a keyword we **do not already have a page for**. Same-cluster synonyms are not a new keyword (`ats friendly resume format` ≡ `ats friendly resume template` ≡ `ats-layout`). Do not re-pick a cluster because Search Console has not indexed yesterday’s URL. Prefer competitor-domain keywords that are missing from `owned-keywords.md`.

## Progress checklist

Copy and keep current:

```
- [ ] Step 1: inventory + GSC + competitor KE + Keywords Everywhere
- [ ] /summarize + stop
- [ ] Step 2: pick one **unowned** keyword (new URL default)
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
- Cluster:
- Owned-map hit (must be none, or stop):
- Competitor source (domain / URL):
- KE vol / competition:
- GSC: impressions, clicks, avg position, current landing URL
- Existing ResumePilot URL that might cannibalize:
- Decision (new URL vs update — default new URL):
- Research dir:
- Report path:
- Branch / PR:
- Next step:
```

---

## Step 1 — Inventory, demand, and competitor keywords

Discover MCP schemas with `GetMcpTools` before calling. Server ids vary; match `google-search-console` and `keywords-everywhere`. If GSC returns auth errors, call that server’s `mcp_auth` / `reauthenticate` once, then retry.

**Inventory (required, first):** read `brains/seo/`. Drop any GSC or KE term that is already in `owned-keywords.md`, in an owned cluster, or in ship-log cooldown.

**Search Console** (`site_url`: `sc-domain:resumepilot.xyz`):

- `list_properties` if the property string is uncertain
- `get_performance_overview` — 90 days
- `get_search_analytics` — `dimensions: query`, 90 days, `row_limit: 500`
- `get_search_analytics` — `dimensions: page`, 90 days, `row_limit: 200`
- `get_search_analytics` — `dimensions: query,page`, 28 days, `row_limit: 500`

A new site with impressions and almost no clicks is still a signal. Wrong-URL clustering on a query whose canonical **does not exist yet** is useful. Wrong-URL clustering on a query we shipped in the last 14 days is indexing lag — not a new page.

**Competitor keywords (required):** for 2–3 domains in `brains/seo/competitors.md`, call `get_domain_keywords` (`country: us`, `num: 50–100`). If that 404s, call `get_url_keywords` on the listed seed URLs. Keep terms that ResumePilot has **no** page for.

**Keywords Everywhere** (US unless the user says otherwise: `country: us`, `currency: usd`):

- Seed from competitor unowned terms and from GSC queries that are **not** in the owned map — not from imagination, and not from the cluster we just shipped
- `get_related_keywords` + `get_pasf_keywords` on the top 1–2 **unowned** seeds (`num: 50–100`)
- `get_keyword_data` on a shortlist (volume + competition)
- Append leftover unowned terms to `brains/seo/opportunities.md` (parking lot)

Map the shortlist against `brains/seo/owned-keywords.md` and the live registry in `web/src/lib/seo/content/`. See [cms.md](cms.md).

Then `/summarize` and stop.

## Step 2 — Pick one unowned keyword

Score candidates. Ship **one** URL this run. Default is a **new** canonical. Updating an existing page is allowed only when the user asks, or when GSC shows the *matching* URL indexed for 28+ days with a CTR/position problem.

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

State: keyword, cluster, slug, canonical, why it is unowned, competitor source, why neighbors lose. Then `/summarize` and stop.

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

Update `brains/seo/`: move the keyword (and synonyms) to `owned-keywords.md`, remove them from `opportunities.md`, append `ship-log.md`.

Branch: `seo/{slug}`. Commit SEO content/test files **and** `brains/seo/*` inventory updates. Never stage `brains/traffic-growth-before-monetization/` dumps, `extension/`, `.env`, or `.cursor/mcp.json`.

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
- Treating `format` vs `template` (or other synonyms) as a new keyword
- Re-picking a cluster because GSC has not indexed yesterday’s page
- Cannibalizing `/templates` (or another hub) with a matching-intent query
- Skipping competitor domain/URL keyword pulls
- Republishing competitor 95%/42% style parse rates
- Picking PDF-always or Word-always when sources disagree; follow the posting + selectable text
- Committing unrelated dirty files with the SEO PR
- Shipping a page without updating `brains/seo/`
