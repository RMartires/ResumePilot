# Search Console & Bing setup (Phase 1)

These steps are manual in Google / Bing dashboards — the site already exposes `/sitemap.xml` and `/robots.txt`.

## Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console) and add a property for `https://www.resumepilot.xyz`.
2. Prefer **Domain** property if you control DNS; otherwise use **URL prefix** for `https://www.resumepilot.xyz`.
3. Verify ownership (DNS TXT, HTML file, or meta tag). Prefer DNS if available.
4. Submit sitemap: `https://www.resumepilot.xyz/sitemap.xml`.
5. Request indexing for key URLs after deploy:
   - `/`
   - `/templates`
   - `/tools/ats-checker`
   - `/tools/resume-score`
   - `/about`
6. Check **Page indexing** weekly for the first month; fix soft-404s / blocked by robots if any appear.

## Bing Webmaster Tools

1. Open [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Import the verified Google Search Console property, or add `https://www.resumepilot.xyz` manually.
3. Submit the same sitemap: `https://www.resumepilot.xyz/sitemap.xml`.
4. Confirm robots.txt is readable under **Configure My Site → Robots.txt**.

## After submit checklist

- [ ] Sitemap accepted (0 fetch errors)
- [ ] Homepage + tool pages show as Indexed
- [ ] No unexpected `Disallow` on marketing routes
- [ ] OG preview looks correct via [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) or [opengraph.xyz](https://www.opengraph.xyz/)

## UTM convention

Use lowercase kebab-case values and keep the canonical landing URL free of UTMs.

- `utm_source`: publishing platform or partner (`google`, `linkedin`, `reddit`)
- `utm_medium`: channel (`organic-social`, `email`, `partner`, `cpc`)
- `utm_campaign`: stable initiative (`ats-checker-launch`, `template-seo`)
- `utm_content`: optional placement or creative (`homepage-hero`, `classic-template`)
- Do not put names, emails, resume data, job-description data, or other user content in any UTM.

Example: `?utm_source=linkedin&utm_medium=organic-social&utm_campaign=ats-checker-launch&utm_content=product-post`

## KPI operations

Review Search Console and Umami weekly using the same Monday–Sunday date window:

1. Record organic clicks, impressions, CTR, and average position for `/templates`, `/tools/ats-checker`, and `/tools/resume-score`.
2. Record Umami counts for `marketing_cta_clicked`, `seo_tool_completed` (split by `tool`), `template_cta_clicked`, `signup_started`, and `signup_completed`.
3. Calculate tool-to-CTA, CTA-to-signup-start, and signup-start-to-signup-complete rates. Segment only by the allowlisted `source_page`, `tool`, `template_slug`, and `auth_mode` properties.
4. Annotate deploys and campaign starts. Compare four-week trends; do not optimize from a single low-volume week.

`signup_completed` and the Google Ads signup conversion fire only after a successful OAuth code exchange where Supabase account creation and first-sign-in timestamps are both recent and within five seconds of each other. Ambiguous auth successes are counted as logins, not signup conversions.

## Optional `.com` note

`.xyz` can rank. If you acquire a matching `.com` early, migrate with 301s before heavy link building — cheaper than remapping authority later.
