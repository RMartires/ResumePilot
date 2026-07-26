# SEO authority operations runbook

This is a manual, human-reviewed operating plan. Nothing in this document authorizes automated posting, account creation, bulk messaging, vote requests, link schemes, or scraped-contact outreach.

## Before any campaign

1. Confirm the destination page is live, indexable, canonical, accurate, mobile-friendly, and represented in the sitemap.
2. Choose one audience and one useful destination. Do not send every prospect to the homepage.
3. Record the prospect and source URL in the backlink tracker before contact.
4. Check the publication's current submission and disclosure rules. Stop if commercial submissions are prohibited.
5. Have a person review every claim, screenshot, comparison, and message.
6. Use only published contact details or a publication's official submission form. Never infer private email addresses.

## Launch channels

### Product Hunt

- Prepare: concise product name, factual tagline, current screenshots, maker account, product URL with UTM parameters, and a first comment explaining the problem and workflow.
- Launch manually on a day when someone can answer questions.
- Disclose the maker relationship. Ask existing users only for honest feedback; never ask for a particular vote or incentivize voting.
- Reply to substantive questions with product facts. Record recurring questions for product and documentation work.
- After 7 and 30 days, record referral sessions, activated sign-ins, relevant mentions, and earned links.

### Show HN

- Use a factual title such as `Show HN: ResumePilot – an ATS-focused resume builder`.
- The post should explain what was built, how the public checker works at a high level, limitations, privacy behavior, and what feedback would help.
- Link directly to a usable product or public tool. Do not use marketing superlatives, coordinated voting, repeated reposts, or comment seeding.
- Participate as the builder and answer technical or product questions candidly.

### Relevant directories

- Maintain a short, reviewed list of legitimate resume, career, productivity, and startup directories.
- Submit only where the category and audience fit. Use the canonical homepage or most relevant tool page.
- Keep name, description, URL, category, pricing summary, and screenshots consistent with current product pages.
- Reject directories that require reciprocal links, paid dofollow links, fake reviews, or broad syndication.
- Recheck approved listings quarterly for outdated claims and broken URLs.

## Editorial listicle outreach

Prioritize already-ranking, recently maintained pages where ResumePilot would add a genuinely distinct option. Read the article before contacting the editor and identify the exact audience, section, and evidence gap.

Workflow:

1. Record query, article URL, publisher, author/editor, last-updated date, and current products listed.
2. Confirm ResumePilot fits the stated selection criteria.
3. Prepare two or three verifiable differentiators with direct evidence links, such as the public ATS checker, integrated job tracker, or public template previews.
4. Send one personalized note through a published channel. One follow-up after 7–10 business days is the maximum unless the editor responds.
5. Never offer payment for an undisclosed editorial link. If placement is sponsored, require clear labeling and appropriate link attributes.
6. Log the response and next review date.

Template:

> Subject: Possible addition for [article title]
>
> Hi [name], I read your [article] and noticed it helps [specific audience/use case]. I work on ResumePilot, a web-based resume builder focused on ATS-readable layouts and job-specific tailoring.
>
> It may be relevant to your [specific section] because readers can try [specific public tool or page] without creating an account: [URL with UTM]. The current product facts and limitations are documented here: [press URL].
>
> If it does not fit your criteria, no reply is needed. I am happy to provide factual details or a current screenshot, and I will not ask you to make claims you cannot verify.
>
> Thanks,  
> [real sender name and role]

## University career-center outreach

Target career centers only when a free public resource maps to an existing student need. Start with public resource-submission guidance or a general career-services contact; do not harvest staff directories.

Suggested offer:

- a public ATS checker for educational review;
- role-specific resume examples clearly labeled as fictional;
- resume-writing and ATS guides;
- a short, non-promotional walkthrough for staff evaluation.

Template:

> Subject: Free resume resource for [institution] students to evaluate
>
> Hello [career center/team],
>
> I work on ResumePilot. Your [specific resource page/program] serves students working on [specific need]. We publish a free [tool/guide] at [URL with UTM] that may complement that material.
>
> The resource explains its heuristic limitations and does not require an account for the public check. Product facts are at [press URL]. Would your team be willing to review it against your resource standards? There is no expectation of a link or endorsement.
>
> Regards,  
> [real sender name and role]

Do not describe the product as university-approved unless the institution provides explicit written permission. Do not request student data, upload sample student resumes, or ask staff to distribute tracking links without approval.

## Reddit and Quora standards

- Read each community's current rules and search for existing answers before participating.
- Answer the question first with useful, self-contained information. Link only when the linked page materially expands the answer.
- Disclose the relationship in plain language: “I work on ResumePilot.”
- Do not operate multiple accounts, astroturf, copy-paste answers, revive old threads for promotion, automate posting, or ask others to upvote.
- Do not solicit resume uploads in public comments. Warn users to remove personal data before sharing examples.
- On Quora, answer from demonstrated knowledge and cite primary sources for ATS or hiring claims. On Reddit, follow subreddit-specific self-promotion ratios and moderator instructions.
- Record the thread and disclosure in the tracker. Remove or correct a post if a moderator requests it.

## UTM convention

Use lowercase ASCII values with hyphens. Preserve the canonical URL by using UTMs only in outreach links, never canonical tags or sitemap entries.

- `utm_source`: platform or publisher, e.g. `product-hunt`, `hacker-news`, `example-university`
- `utm_medium`: `launch`, `referral`, `community`, or `outreach`
- `utm_campaign`: stable initiative and quarter, e.g. `authority-q3-2026`
- `utm_content`: specific placement or message variant, e.g. `maker-comment`, `career-center-template-a`
- `utm_term`: omit unless tracking a genuinely relevant editorial topic; never place personal data here

Example:

`https://www.resumepilot.xyz/tools/ats-checker?utm_source=example-university&utm_medium=outreach&utm_campaign=authority-q3-2026&utm_content=career-center-template-a`

Keep a campaign registry so two initiatives do not invent different names for the same source. UTMs must never include names, emails, user IDs, or private notes.

## Public ATS endpoint production control

The application enforces request-body, text-field, and PDF-size limits in process. Those controls bound individual work but are not a distributed rate limiter. Before promoting the ATS checker at launch scale, configure rate limiting at a shared edge, API gateway, WAF, or durable distributed store:

- apply the policy to `POST /api/tools/ats-check` before the request reaches PDF parsing;
- use a privacy-reviewed key and avoid retaining raw IP addresses longer than required for abuse prevention;
- start with a conservative burst and sustained limit, then tune from capacity tests and legitimate failure rates;
- return `429` with a bounded `Retry-After`, and do not reveal keying internals;
- cap request concurrency and execution time as a second line of defense;
- monitor aggregate accepted, rejected, timeout, and parser-failure counts without logging resume or job-description content;
- document trusted-proxy handling and test that clients cannot bypass limits with spoofed forwarding headers;
- fail closed or degrade safely according to an explicit availability decision when the limiter backend is unavailable.

An in-memory `Map` is not acceptable: serverless instances do not share state, instances restart, and horizontal scaling would multiply the effective limit. Promotion should pause until the distributed control is deployed and load-tested.

## Backlink and outreach tracker

Use an access-controlled spreadsheet or approved CRM with these fields:

- prospect/publisher, domain, source URL, target audience, channel, country/language;
- contact route and public contact-page URL (not scraped personal data);
- target ResumePilot URL and exact UTM URL;
- relevance rationale, pitch angle, relationship disclosure, owner;
- first-contact date, follow-up date, status, response summary, opt-out/do-not-contact flag;
- placement URL, link text, link attribute (`follow`, `nofollow`, `sponsored`, or unknown), live date;
- date last verified, next review date, broken/outdated status;
- referral sessions, engaged sessions, public-tool completions, sign-ins attributable under the approved analytics model;
- notes on corrections, sponsorship, or removal requests.

Respect deletion and opt-out requests. Limit access and delete stale contact notes according to the organization's approved retention policy.

## Success criteria and stop rules

Review monthly and by campaign cohort. Success requires all of:

- placements are topically relevant and factually accurate;
- no policy violations, deceptive endorsements, paid-link concealment, or unresolved correction requests;
- earned referring domains and qualified referral sessions increase from the documented baseline;
- referral visitors show useful intent, measured by public-tool completion or another approved conversion rather than raw clicks alone;
- outreach response and placement rates justify the manual effort without increasing complaint or opt-out rates.

Set numerical targets only after recording a four-week baseline. Suggested first-quarter operating thresholds are at least 20 carefully qualified prospects, at least 80% individually reviewed messages, zero automated community posts, zero undisclosed paid links, and monthly verification of every live placement. Pause a channel after a moderator warning, platform-policy concern, spam complaint, or two factual corrections from the same process; review before resuming.

