# Traffic growth — 90-day implementation checklist

Derived from [`../traffic-growth-before-monetization/report.md`](../traffic-growth-before-monetization/report.md) and [`../traffic-growth-before-monetization/action-checklist.md`](../traffic-growth-before-monetization/action-checklist.md).

**Goal:** Discovery → first value → repeated value → paid-intent evidence → limited paid beta.  
**Primary measure:** Activated users (not pageviews).  
**Keep free:** Core ATS checker + usable resume builder + standard ATS-safe templates + viable export path.

Legend: `[x]` done / largely shipped · `[ ]` still to do · `Ops` = manual · `Eng` = product/code · `Content` = pages/copy · `Dist` = outreach/distribution

---

## Already shipped (baseline)

Do not rebuild these; use them as the wedge.

- [x] Public marketing shell, sitemap, robots, JSON-LD, OG images
- [x] Free ATS checker + resume score tools (`/tools/ats-checker`, `/tools/resume-score`)
- [x] Public ATS template library + feature landings
- [x] Content engine pages (guides, role examples, comparisons, skills/objectives hubs)
- [x] Privacy-safe SEO funnel events: CTA, tool completed, template CTA, signup start/complete
- [x] Performance / best-practices hardening (Lighthouse work)
- [x] Pricing page removed for now (no broad paid launch)
- [x] Search Console property verified; organic impressions starting

---

## Phase 0 — Finish foundation (this week)

### Search & indexing · Ops

- [ ] Resolve Search Console sitemap **Couldn't fetch** (remove + resubmit `sitemap.xml`; retry for up to ~1 week)
- [ ] Request indexing for: `/`, `/templates`, `/tools/ats-checker`, `/tools/resume-score`, `/about`
- [ ] Confirm Bing Webmaster Tools import + same sitemap
- [ ] Weekly habit: check **Performance** (queries/pages) + **Page indexing** (not only Sitemaps)

### Product policy · Ops + Eng

- [ ] Keep core checker and builder free (no paywall on first value)
- [ ] Write the activation definition in one sentence (pick one primary event and stick to it for 8 weeks), e.g.:
  - *Primary:* ATS result received **and** at least one recommendation applied, **or**
  - *Primary:* Resume completed **and** exported
- [ ] Document score limitations on checker UI (“ResumePilot heuristic, not an employer ATS score”)

---

## Phase 1 — Days 1–30: Acquisition instrument

### Funnel analytics · Eng

Extend beyond current events. Do **not** send resume text, names, emails, or job descriptions to analytics.

- [ ] `checker_started` (tool + `source_page`)
- [ ] `recommendation_applied` (or equivalent “took a corrective action”)
- [ ] `editor_started` (from checker / template / organic)
- [ ] `resume_completed`
- [ ] `export_completed`
- [ ] `return_tailoring_session`
- [ ] `result_shared` (only if share artifact ships)
- [ ] `partner_referral` (UTM/source allowlist)
- [ ] `paid_intent_action` (waitlist/survey click — later)
- [ ] Simple dashboard (Umami or spreadsheet): activation by landing page + source

Related docs: `web/docs/seo-search-console.md` (UTMs), `web/docs/seo-research-telemetry.md` (future aggregates).

### Checker → editor handoff · Eng

- [ ] Preserve checker result into editor (carry score/issues; don’t force blank start)
- [ ] One obvious CTA after result: “Fix this in ResumePilot”
- [ ] Delay signup until save / export / history (not before first useful result)
- [ ] Privacy-safe share artifact (user-opt-in image/summary: score band, issues fixed — **no** resume text or public resume URLs)

### Content quality pass · Content + Eng

Publish or refine **5 high-intent clusters** (each must be genuinely different — no template-swap spam):

- [ ] Cluster 1: ATS-friendly templates (by experience / format) → link to checker
- [ ] Cluster 2: Role resume examples (start with roles you know) → template + checker
- [ ] Cluster 3: Skills / summary examples copyable into editor
- [ ] Cluster 4: Checker / resume-score landing clarity + FAQ
- [ ] Cluster 5: One comparison or “best free” page with sourced claims only
- [ ] Internal linking audit: every hub links example ↔ skills ↔ template ↔ checker ↔ relevant feature
- [ ] Titles/meta for pages that get impressions but low CTR (use Search Console)

### Learning · Ops

- [ ] Interview **5** users who completed the checker
- [ ] Interview **5** who abandoned (friction, trust, unclear next step)
- [ ] Note top objections; turn into product/copy fixes

### Founder distribution (start light) · Dist

- [ ] Pick **2–3** communities; answer first, promote rarely + disclose when linking
- [ ] One founder post this month (teardown / one bullet improved / ATS tip) → LinkedIn; optional Short

---

## Phase 2 — Days 31–60: Repeatable distribution

### Weekly founder content batch · Dist

One question → many surfaces (measure **activation**, not vanity clicks):

- [ ] Collect 5 recurring user questions each week; pick 1 with product relevance
- [ ] Write canonical answer (can live as guide or note)
- [ ] Adapt: LinkedIn post + optional carousel/document
- [ ] Adapt: short YouTube / Short on a narrow searchable question
- [ ] Adapt: community-native answer (no spammy same copy)
- [ ] UTM every outbound link (`utm_source`, `utm_medium`, `utm_campaign`, optional `utm_content`)

### Partnerships · Ops + Content

- [ ] Build **partner kit**:
  - [ ] One-page privacy explanation
  - [ ] Workshop outline (60–90 min)
  - [ ] Referral link with UTMs
  - [ ] Co-branded landing page template (or lightweight `/partners/[slug]` later)
  - [ ] Support contact + what aggregate metrics you’ll share (no student docs)
- [ ] Outreach list: student societies, small career centers, bootcamps, workforce nonprofits, coaches
- [ ] Send **~10 personalized** messages per week
- [ ] Offer 4-week pilot + feedback interview (not “replace career counselors”)
- [ ] Interview 3–5 coaches about lightweight client view **before** building coach dashboards

### Newsletter / soft PR · Dist

- [ ] Contribute 1 teardown, data point, or template pack to a relevant newsletter (audience value first)
- [ ] No paid link schemes; disclose sponsorships if any

### Launch platform · Dist

- [ ] Product Hunt only when: checker polished, activation measured, founder can stay in comments all day
- [ ] Define PH success as activated users + interviews + repeat use (not badge)

### Ops cadence · Ops

- [ ] Weekly Search Console review: expand clusters that drive checker/editor activation; refresh weak titles
- [ ] Do **not** mass-generate near-duplicate role pages

---

## Phase 3 — Days 61–90: Compounding assets + paid-intent test

### Original-data report · Eng + Ops + Legal

- [ ] Finalize privacy-preserving telemetry spec (`web/docs/seo-research-telemetry.md`)
- [ ] Legal/privacy review + explicit opt-in where required
- [ ] Collect only aggregate signals for stated analyses
- [ ] Publish **one narrow** report (e.g. common formatting signals across N opt-in checks)
- [ ] Methodology, date range, sample size, bias, limitations; no claims about employer ATS rejection systems
- [ ] Pitch report to career newsletters, university blogs, recruiter pubs, aligned creators

### SEO scale (selective) · Content

- [ ] Expand clusters **only** where first pages: indexed + impressions + activation
- [ ] Refresh underperforming pages before adding volume
- [ ] Keep Web Vitals as release criteria for new content (LCP / INP / CLS)

### Paid-interest test (no broad paywall) · Eng + Ops

- [ ] Feature-interest page or in-product prompt for activated users
- [ ] Offer 2–3 bundles to test (examples): unlimited tailoring · advanced rewrites · workflow automation · coach collaboration
- [ ] Honest waitlist or interview invite (not fake checkout)
- [ ] Track `paid_intent_action`; aim for ~30+ explicit signals before beta
- [ ] Keep useful core free during the test

---

## Paid-plan readiness gates (all required)

Do **not** launch a broad paid plan on traffic alone. Require:

- [ ] 8+ consecutive weeks of reliable funnel data
- [ ] Hundreds of monthly **activated** users (adjust to your volume, but not “visits”)
- [ ] Cohort returning to tailor, export, or track another application
- [ ] ~30+ paid-intent signals (interviews, waitlist, surveys)
- [ ] Clear natural limit users hit repeatedly (frequency, AI, automation, collaboration — not “download your resume”)

When beta starts, measure: activated-user growth, conversion, revenue per activated user, retention, support load, and whether the free loop weakens.

---

## Explicitly out of scope for this plan

Do not schedule these until gates above are met (or Phase 3+ with clear need):

- [ ] Influencer / affiliate payout program
- [ ] Paid ads as primary acquisition
- [ ] Chrome extension / Zapier before repeat web workflows exist
- [ ] Mass affiliate or paid backlink schemes
- [ ] Broad pricing page + paywall on checker/builder core
- [ ] Coach multi-client dashboard before coach interviews validate demand

---

## Suggested ownership snapshot

| Workstream | Type | Owner hint |
|------------|------|------------|
| Activation definition + dashboard | Eng + Ops | Founder |
| Checker → editor + share artifact | Eng | Product |
| 5 clusters + internal links | Content | Founder |
| Weekly founder batch | Dist | Founder |
| Partner kit + outreach | Ops | Founder |
| Telemetry + original report | Eng + Legal | Founder |
| Paid-intent waitlist | Eng + Ops | Founder |
| Search Console / Bing | Ops | Founder |

---

## Source map

| This plan section | Report anchor |
|-------------------|---------------|
| Free checker wedge | Finding 1 |
| Useful SEO clusters | Finding 2 |
| Shareable outcomes + original data | Finding 3 |
| Founder / community / PH | Finding 4 |
| Partners / newsletters / later integrations | Finding 5 |
| Monetization gates | Finding 6 + Decision Rule |
| 30 / 60 / 90 day actions | Recommendations |

Update checkbox status as you ship. Prefer linking PRs or doc paths under each item when done.
