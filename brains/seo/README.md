# SEO inventory

Living lists the `seo-manager` skill reads before picking a keyword. Update these files in the same PR that ships a page.

Strategy context: [`../traffic-growth-before-monetization/`](../traffic-growth-before-monetization/) and [`../plans/traffic-growth-90-day-implementation.md`](../plans/traffic-growth-90-day-implementation.md). Do not duplicate those reports here.

## What we maintain

| File | Purpose |
|------|---------|
| [owned-keywords.md](./owned-keywords.md) | Keywords we already have a page for, mapped to a canonical URL and cluster |
| [competitors.md](./competitors.md) | Domains and URLs to mine for keywords we do not own |
| [opportunities.md](./opportunities.md) | Unowned keywords we may ship later |
| [ship-log.md](./ship-log.md) | What we shipped, when, and which cluster is in cooldown |

## What else this needs (keep here, not in chat)

- **Clusters**, not just exact strings. `ats friendly resume format` and `ats friendly resume template` are the same `ats-layout` cluster. A synonym is not a new page.
- **Cooldown.** Search Console lags days to weeks. Do not re-pick a cluster because yesterday’s URL is missing from the page report.
- **Product path.** Every new URL must convert to checker, templates, or builder. Brains: keep the core free; measure activation, not pageviews.
- **Internal links.** New pages must link both ways to the closest hub. Do not spawn an orphan.
- **Claims blacklist.** No vendor parse-rate / “pass rate” tables; employer ATS configs vary. Already in the skill; do not republish them in copy.
- **Cadence.** Prefer one genuinely different URL per run. Do not mass-generate near-duplicate role pages (brains 90-day plan).

## Clusters

Use these names in owned, opportunities, and the ship log.

| Cluster | Searcher wants | Owned hubs |
|---------|----------------|------------|
| `ats-layout` | Which file layout / template / font / columns / PDF vs Word | `/templates`, `/guides/ats/ats-friendly-resume-format`, `/guides/ats/ats-friendly-fonts` |
| `ats-checker` | Scan, score, or check this file | `/tools/ats-checker`, `/tools/resume-score` |
| `how-to-write` | How to plan and write a resume | `/guides/how-to-make-a-resume` |
| `vendor-ats` | Workday / Greenhouse / Lever / Taleo upload | `/guides/ats/{workday,greenhouse,lever,taleo}-resume` |
| `examples-roles` | Role-specific resume examples | `/examples/resumes` and slugs |
| `skills-objectives` | Skills lists and objective copy | `/skills`, `/examples/objectives` |
| `comparisons` | Best free / vs Jobscan / Rezi / Resume Genius | `/compare` |
| `cover-letter` | Cover letter help | `/features/cover-letter` |
| `job-tracker` | Application tracking | `/features/job-tracker` |
| `linkedin` | LinkedIn import / profile-to-resume | `/features/linkedin-import` |
| `wording` | Words to avoid, buzzwords | `/guides/ats/resume-words-to-avoid` |
| `tailoring` | Keywords, job-description match, how to tailor | none yet (checker is a tool, not this how-to) |
| `design-tools` | Canva / Figma / InDesign ATS questions | none yet |

A keyword is **owned** if it matches a row in `owned-keywords.md` **or** it is a synonym in an owned cluster. Prefer a cluster that has **no** published page.

## Cooldown

After a cluster ships, do not pick another keyword in that cluster for **14 days**, and not until Search Console lists the new canonical (not the old hub) for that query.

Exception: the user explicitly asks to refresh the live URL.

## How to update after a ship

1. Add the primary keyword plus close synonyms to `owned-keywords.md`.
2. Remove them from `opportunities.md`.
3. Append a row to `ship-log.md`.
4. If competitor mining found leftover unowned terms, append them to `opportunities.md`.
