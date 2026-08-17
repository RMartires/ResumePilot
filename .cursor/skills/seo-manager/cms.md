# ResumePilot SEO CMS

Read this in Step 4. Do not load it during keyword analysis.

Keyword inventory (owned map, competitors, opportunities, ship log) lives in [`brains/seo/`](../../../brains/seo/README.md). Read that in Step 1. Update it in Step 5.

## Content files

| Kind | File | Canonical pattern |
|---|---|---|
| Guides (pillar + ATS) | `web/src/lib/seo/content/guides.ts` | `/guides/how-to-make-a-resume` or `/guides/ats/{slug}` |
| Comparisons | `web/src/lib/seo/content/comparisons.ts` | `/compare/{slug}` |
| Examples / objectives / skills / roles | `web/src/lib/seo/content/roles.ts` | `/examples/resumes/{slug}`, `/examples/objectives/{slug}`, `/skills/{slug}` |
| Schemas | `web/src/lib/seo/content/schemas.ts` | — |
| Quality floors | `web/src/lib/seo/content/quality.ts` | — |
| Registry + lookups | `web/src/lib/seo/content/registry.ts` | — |
| Hub path list | `web/src/lib/seo/content/paths.ts` | `guidePath()` |
| Sitemap | `web/src/lib/seo/site.ts` | published paths are included automatically |
| Templates hub copy | `web/src/app/(marketing)/templates/page.tsx` | `/templates` |

`web/src/lib/seo/content/data.ts` re-exports registries. Adding a published guide in `GUIDES` is enough for `/guides` and `/guides/ats` hubs (they map `published(GUIDES)`).

## Routing

ATS guides **do not** need a new `page.tsx`. `web/src/app/(marketing)/guides/ats/[slug]/page.tsx` renders any published `GUIDES` entry with `kind: "ats"`.

The pillar guide is `web/src/app/(marketing)/guides/how-to-make-a-resume/page.tsx`.

Layout: `web/src/components/marketing/GuideArticleLayout.tsx` (intro, sections as H2, “Application checklist” from `steps`, FAQ, related links). In-article CTA on ATS pages is the ATS checker (`SignInCta` → `/tools/ats-checker`).

## Guide schema floors (`guideSchema` + `quality.ts`)

ATS (`kind: "ats"`):

- `intro` ≥ 80 chars
- ≥ 5 sections (heading ≥ 4 chars, body ≥ 60)
- ≥ 3 steps, ≥ 3 FAQs, ≥ 3 related links
- ≥ 450 visible words
- `datePublished` / `dateModified` as `YYYY-MM-DD`

Pillar (`kind: "pillar"`): ≥ 8 sections, ≥ 5 FAQs, ≥ 1800 words.

Related links must be published public paths (see `BUILT_IN_PUBLIC_PATHS` in `quality.ts`). Do not link drafts. No duplicate slugs, titles, or canonicals across registries.

Update `dateModified` when revising an existing page.

## Tests to touch

- `web/src/lib/seo/content/registry.test.ts` — bump `ALL_CONTENT` and `published(GUIDES)` (or the matching registry); assert the new canonical; optionally assert related-link order
- `web/e2e/app.spec.ts` — `goto` the canonical; assert H1; assert a related link and any research-critical heading/phrase
- Run: `cd web && npm test -- src/lib/seo/content/registry.test.ts src/lib/seo/content/quality.test.ts`

## Voice

Match Workday/Greenhouse guides: conservative defaults, employer configuration varies, no universal score. Prefer university + parsing-mechanism claims over scanner-vendor percentages.

## Worked example (2026-08-14)

Keyword `ats friendly resume format` (KE ~22,200 US/mo, competition 0.10). GSC attached format queries to `/templates` ~position 90. Shipped `/guides/ats/ats-friendly-resume-format` instead of expanding the gallery. Research then required a louder Notepad paste-test, checker-first related links, and an explicit “do not republish parse rates” line — those landed as a follow-up commit on the same PR.

## Lesson (2026-08-17)

Do not follow that with `ats friendly resume template`. The gallery already owns it; format and template are one `ats-layout` cluster. Next run: an **unowned** cluster from `brains/seo/opportunities.md`, seeded by competitor domain keywords.
