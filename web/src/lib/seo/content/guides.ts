import { guideSchema } from "./schemas";

const dates = { datePublished: "2026-07-26", dateModified: "2026-07-26" };

export const GUIDES = guideSchema.array().parse([
  {
    slug: "how-to-make-a-resume",
    canonical: "/guides/how-to-make-a-resume",
    status: "published",
    kind: "pillar",
    title: "How to Make a Resume That Gets Interviews",
    description: "A practical, evidence-led guide to planning, writing, tailoring, formatting, and checking a resume.",
    intro: "A useful resume is a decision document, not a complete autobiography. It helps a reader understand the role you want, the evidence that supports your fit, and the results you can discuss in an interview. The ten steps below take you from a blank page to a clean, tailored file. Keep a longer master resume for storage, then make a focused copy for each serious application. Never invent a metric, credential, title, or tool: specificity only helps when you can explain it honestly.",
    sections: [
      {
        heading: "1. Define the target role before writing",
        body: "Start with a concrete target such as “staff backend engineer in a payments team,” not a broad label such as “technology.” Save three to five representative job descriptions and mark repeated responsibilities, required tools, domain knowledge, and level signals. Separate true requirements from preferences and company-specific wording. Then make a short evidence inventory: projects, jobs, coursework, volunteering, and outcomes that prove the recurring needs. For example, if several postings mention incident response, identify the outage, on-call improvement, or monitoring project you can describe rather than merely adding “incident response” to a skills list. Choose one primary role per resume version; adjacent roles can use separate versions. Your checklist is simple: target title, seniority, industry or problem space, five recurring capabilities, and two or three differentiators. This work determines what earns space later. It also prevents keyword copying: you are matching accurate evidence to a need, not rewriting the advertisement as if it were your history.",
      },
      {
        heading: "2. Choose a structure that serves your evidence",
        body: "For most candidates, use a reverse-chronological structure: contact details, summary or objective when useful, experience, skills, and education, with projects or certifications placed where they add the most evidence. A recent graduate may put education and projects above limited employment. A career changer may lead with a concise objective and a relevant projects section, while still showing an honest work timeline. Avoid a purely functional resume that hides dates or employers; recruiters often need context for where and when skills were used. Keep conventional headings such as “Experience,” “Education,” and “Skills” because both people and parsing systems recognize them easily. One page is a useful constraint for many early-career candidates, but two focused pages are reasonable when relevant work genuinely needs the room. Do not shrink type or margins until the document becomes tiring to read. Before drafting, outline each section and give it a space budget. Remove weak material first: old unrelated details, references, generic traits, and repeated skills are less valuable than readable evidence.",
      },
      {
        heading: "3. Make contact information complete and professional",
        body: "Place your name, city and region, phone number, professional email, and one or two relevant links in the main document body. A full street address, photo, date of birth, marital status, and other sensitive personal details are usually unnecessary in US-focused applications and can create privacy or bias concerns; local norms vary, so check the market where you are applying. Use a personal email you control, a voicemail greeting you are comfortable sharing with employers, and links that open without permissions. A portfolio should lead to finished, relevant work rather than an empty homepage. A LinkedIn URL is useful only if the profile supports the same dates and positioning as the resume. Do not place essential contact details only in a page header or footer because some extraction workflows may omit them. Test every link in the exported file. A good contact block answers: who are you, roughly where are you based, how can a recruiter reach you, and where can they inspect supporting work? It should do that without consuming the top third of the page.",
      },
      {
        heading: "4. Decide between a summary and an objective",
        body: "Use a summary when you have relevant experience that can be compressed into a clear value proposition. A strong pattern is role identity plus years or scope, two or three relevant strengths, and one credible outcome or domain. Example: “Product manager with six years in B2B workflow software, experienced in discovery, roadmap tradeoffs, and analytics; launched onboarding changes that improved verified activation by 14%.” Use an objective when the target is not obvious from your recent history, such as an internship, first role, return to work, or career transition. Lead with transferable evidence rather than what you hope the employer will give you. Example: “Emergency department nurse moving into clinical informatics, bringing seven years of medication-safety practice, EHR super-user support, and staff training.” Skip both if they would only say you are motivated, detail-oriented, or seeking growth. Never use first-person filler or unsupported superlatives. Draft this section after experience so it reflects the strongest proof on the page, then tailor only the details that genuinely change for the target.",
      },
      {
        heading: "5. Turn experience into evidence-led bullets",
        body: "A useful bullet explains an action, its context or scope, and the result. Start with a precise verb, name what you changed, and add a defensible measure when one exists. “Responsible for customer support” hides the work; “Resolved 35–45 weekly billing cases and created macros that reduced median first response from 11 hours to 7” gives scope and outcome. Metrics can be counts, time, quality, cost, adoption, revenue, reliability, safety, or completion—not every role has revenue impact. If no reliable number exists, describe scale and consequence without fabricating one: stakeholders served, process simplified, decision enabled, risk reduced, or standard met. Use past tense for completed work and present tense for ongoing duties. Give the strongest, most relevant bullets to recent roles and reduce space for older work. Team achievements are valid when you name your contribution: “Partnered with two designers to…” is more credible than claiming sole ownership. Read each bullet and ask: what did I personally do, why did it matter, and could I explain the evidence in an interview? Remove bullets that only restate a job description.",
      },
      {
        heading: "6. Build a focused, defensible skills section",
        body: "Treat skills as an index to evidence, not a bag of keywords. Group hard skills in useful categories—languages, clinical systems, analytics methods, design tools, certifications, or domain practices—and prioritize those relevant to the posting. Include proficiency labels only if you use a consistent, explainable standard; visual rating bars are ambiguous and can waste space. Soft skills such as communication, leadership, and collaboration are usually stronger inside bullets where the reader can see the audience, conflict, or result. Do not list tools you used once unless the role truly calls for introductory exposure and you label it accurately. Spell out an uncommon acronym on first use, and include both a common acronym and full name when the posting uses both, such as “Electronic Health Record (EHR).” A practical audit is to point from every important listed skill to a project, role, course, or credential elsewhere on the resume. If you cannot, decide whether to add honest context, practice the skill further, or remove it. Twelve relevant, defensible skills usually outperform a dense wall of loosely related terms.",
      },
      {
        heading: "7. Present education, projects, and credentials with context",
        body: "List the institution, credential, field, and completion date or expected date. GPA can help when it is strong and requested, especially early in a career, but it becomes less important after substantial relevant experience. Do not include high school once higher education or meaningful professional experience makes it redundant. Add honors, relevant coursework, or capstones only when they support the target. Projects deserve their own section when they provide evidence missing from paid work. Name the problem, your contribution, the tools or methods used, and a result such as users, performance, validation, or a completed deliverable. Make clear whether a project was personal, academic, volunteer, or client work. For regulated roles, present active licenses and certifications accurately, including jurisdiction or expiration when relevant; never imply a credential is current if it has lapsed. Publications and portfolios should use stable links. Career changers can translate education and projects into evidence, but should not disguise them as employment. The reader should understand what you built or learned and under what conditions.",
      },
      {
        heading: "8. Tailor for the posting and ATS without gaming it",
        body: "Applicant tracking systems vary by employer, vendor, configuration, and recruiter workflow. There is no universal score or guaranteed keyword formula. Use the posting as a relevance checklist: compare responsibilities, hard skills, certifications, and domain terms with your resume, then add exact language only where it truthfully describes your work. If you wrote “customer research” and the role consistently says “user interviews,” use the employer’s term when that is what you conducted. Put important terms in normal sentences and bullets rather than hidden text, repeated lists, or copied job descriptions. Keep standard headings, straightforward chronology, selectable text, and a logical reading order. Acronyms can be paired with full terms once. Review required qualifications carefully; a checker cannot grant missing authorization, licensure, or experience. Finally, inspect the application form after upload. Correct any parsed employer, title, date, or education field before submitting. ATS-friendly means clear, accurate, and extractable—not written for a robot at the expense of the person making the decision.",
      },
      {
        heading: "9. Format and export a readable document",
        body: "Use one column for the safest reading order, consistent spacing, clear hierarchy, and a conventional font around 10–12 points for body text. Fonts such as Arial, Calibri, Georgia, Helvetica, Times New Roman, or similar system faces are familiar and readable; the exact font is less important than legibility and reliable embedding. Avoid essential information in icons, charts, text boxes, images, headers, or footers. Use bold and size differences sparingly so job titles, employers, and dates scan consistently. Align dates without creating a fragile maze of tabs. Follow the employer’s requested file format. A text-selectable PDF usually preserves layout, while DOCX may be requested by some portals; neither format is universally superior in every system. Export from the source document rather than scanning or printing to an image. Open the final file on another device, copy all text into a plain-text editor, and check that the order remains sensible. Use a descriptive filename such as “Jordan-Lee-Product-Manager-Resume.pdf,” not “resume-final-v7.”",
      },
      {
        heading: "10. Proofread with a repeatable pre-submit checklist",
        body: "Proofreading is a content and integrity check, not only a spellcheck. First compare the resume with your source records: employer names, titles, dates, degree names, licenses, links, and every metric should be accurate. Next read only for meaning: remove vague claims, repeated verbs, unexplained acronyms, tense shifts, and bullets that lack your contribution. Then read only for presentation: spacing, punctuation, line breaks, page numbers, and alignment. Read aloud or from the bottom upward to interrupt familiarity. Ask a trusted reviewer to spend thirty seconds identifying your target and strongest evidence; if they cannot, revise hierarchy before polishing sentences. Finally, use this submit checklist: correct company and role, tailored summary, relevant top bullets, three or more role terms used honestly, no tracked changes or comments, working links, selectable text, sensible copy-paste order, requested file type, and a clean filename. Save the exact submitted version with the job description so interview preparation starts from what the employer actually saw.",
      },
    ],
    steps: [
      { name: "Choose a target", text: "Define one role and collect recurring requirements from several representative postings." },
      { name: "Outline the document", text: "Choose a reverse-chronological structure and budget space for the strongest evidence." },
      { name: "Draft evidence", text: "Write accurate experience, project, education, and skills content before polishing the introduction." },
      { name: "Tailor terminology", text: "Match the posting’s language only where it truthfully describes your background." },
      { name: "Export and verify", text: "Create the requested file type, test reading order and links, then complete the proofreading checklist." },
    ],
    faqs: [
      { question: "How long should a resume be?", answer: "One page is a useful constraint for many students and early-career candidates. Two focused pages are appropriate when relevant experience, projects, credentials, or leadership genuinely need the space. Readability and relevance matter more than forcing an arbitrary length." },
      { question: "Should every resume include a summary?", answer: "No. Include a summary when it quickly clarifies relevant experience and strengths. Use an objective when a transition needs explanation, and omit both when they would only repeat generic traits or information already obvious below." },
      { question: "Do I need to tailor my resume for every application?", answer: "Tailor serious applications where role priorities differ. Start from a truthful master resume, then reorder evidence and align accurate terminology. You do not need to rewrite every sentence when two postings seek essentially the same work." },
      { question: "Is PDF or DOCX better for applicant tracking systems?", answer: "Follow the employer’s instruction first. A text-based PDF preserves layout and a DOCX can suit portals that request it, but implementations vary. Upload, inspect parsed fields when possible, and avoid image-only or scanned files." },
      { question: "Can I include metrics if I do not know the exact number?", answer: "Do not invent precision. Use a verified range, approximate value clearly labeled as such, or nonnumeric scope such as team size, weekly volume, audience, deadline, or process outcome. Keep supporting notes for interview questions." },
      { question: "Should I use a resume template?", answer: "A template can save time when it provides clear hierarchy, editable text, and a logical one-column order. Replace all sample copy, remove unused sections, and test the exported file rather than assuming any template is universally ATS-safe." },
    ],
    ...dates,
    relatedLinks: [
      { title: "ATS-friendly resume format", path: "/guides/ats/ats-friendly-resume-format" },
      { title: "Resume keywords", path: "/guides/ats/resume-keywords" },
      { title: "Resume examples", path: "/examples/resumes" },
      { title: "Resume templates", path: "/templates" },
      { title: "ATS checker", path: "/tools/ats-checker" },
    ],
  },
  {
    slug: "ats-friendly-resume-format",
    canonical: "/guides/ats/ats-friendly-resume-format",
    status: "published",
    kind: "ats",
    title: "ATS-Friendly Resume Format: Layout, File Type, and Structure",
    description:
      "Use a reverse-chronological, single-column resume format with standard headings, selectable text, and the file type the employer actually requests.",
    intro:
      "An ATS-friendly resume format is the document architecture that lets software extract your name, jobs, dates, and skills into the right fields, and that still lets a recruiter scan the same file in seconds. It is not a secret template, a guaranteed score, or a reason to hide your work history. Applicant tracking systems vary by vendor and employer setup, so no layout is universally “approved.” The practical goal is a reverse-chronological, single-column file with conventional headings, contact details in the body, and real selectable text. Choose the file type the posting asks for, then paste the export into a plain-text editor and confirm titles, employers, and dates still travel together.",
    sections: [
      {
        heading: "Format is structure, not decoration",
        body: "People searching for an ATS-friendly resume format usually want three decisions: which structure to use, how to lay out the page, and whether to export PDF or Word. Those choices matter because parsers do not “see” your design. They pull a stream of text and try to assign chunks to fields such as employer, title, and date. A visually clever layout can still fail if that stream is out of order, missing contact details, or trapped in an image. Career-center guidance from MIT, UC Santa Barbara, the University of Virginia, the University of Pittsburgh, and Utah Valley University converges on the same baseline: one column, reverse-chronological experience, standard headings, and no essential information in tables, text boxes, graphics, or page headers. Treat that baseline as risk reduction, not a promise that every Workday, Greenhouse, Lever, or Taleo configuration will behave identically. Do not chase vendor “parse rates”; those figures are usually measured on clean test corpora, not on the employer’s live form.",
      },
      {
        heading: "Use reverse-chronological order as the default",
        body: "The safest ATS resume format is reverse chronological: most recent role first, with a consistent pattern of job title, employer, location, and month-year dates, then bullets. Recruiters need that timeline to judge tenure, and parsing systems are built around title-company-date blocks. A hybrid or combination layout can still be ATS-friendly when it keeps a full dated experience section and merely leads with a short summary and a skills list. That is useful for career changes, because you can surface transferable evidence without deleting where and when you worked. Recruiter surveys disagree on purely skills-based résumés, so a functional layout is not automatically “dead”—but it is a parsing and honesty risk when employers and dates disappear. Avoid grouping achievements only under skill labels. If you have a gap, keep honest dates and explain the period briefly in a summary or a clearly labeled role such as study, caregiving, or contract work rather than erasing the timeline.",
      },
      {
        heading: "Keep one column and a predictable reading order",
        body: "Use a single column that reads top to bottom and left to right across the full page width. Two-column, sidebar, and table-based templates are the most common reason a resume looks fine on screen and comes out scrambled after upload. The failure is usually reading order, not that the software “cannot read columns” in the abstract: a parser may walk left to right across a row and interleave a skills sidebar with job titles, or merge dates into the wrong employer. Some modern parsers try to reconstruct multi-column files, but you cannot know whether this employer’s stack is layout-aware. Independent layout tests and university career advice both treat a one-column body as the conservative default. Skills can still be grouped in a short comma-separated list. What to avoid is using a table or text boxes to place entire sections side by side. If a paste test shows titles, employers, dates, and bullets no longer grouped, rebuild the layout before applying.",
      },
      {
        heading: "Put contact details and headings where parsers look",
        body: "Place your name, phone, email, city and region, and relevant links in ordinary body text at the top of the first page. Several ATS workflows skip or duplicate headers and footers, so a contact line that exists only in page furniture can disappear from the profile or appear as repeated email and phone fields even when the PDF looks complete. Do not replace the words email or phone with icons; a glyph is not searchable text. Label sections with conventional names that both people and software recognize: Summary or Professional Summary, Experience or Work Experience, Education, and Skills. Creative headings such as “My journey” or “What I’ve been up to” waste a recruiter’s time and can cause a parser to miss the start of a section. Keep each job’s facts in a repeated pattern so promotions at one employer remain distinct. Month and year dates in a consistent style, such as “Mar 2023 – Present,” are easier to extract than relative phrases like “two years ago.”",
      },
      {
        heading: "Choose PDF or Word from the posting, then paste-test the file",
        body: "Follow the employer’s requested file type first. University career centers and commercial guides disagree on a default: some prefer PDF, some accept PDF or Word, and some older portals still ingest DOCX more reliably. The shared rule is not a file-extension winner. It is selectable text plus the type the posting asks for. The older “never use PDF” advice is out of date for modern Workday, Greenhouse, Lever, and similar stacks that routinely parse text-based PDFs; image-only scans, print-to-PDF exports, and flattened design-tool files are the real failure. If you cannot highlight and copy sentences in the exported PDF, many parsers will treat the file as empty. Export from Word, Google Docs, or a builder that emits real text, then copy the whole document into Notepad or another plain-text editor. If titles, companies, dates, and bullets no longer stay together, rebuild the layout before applying. Name the file like “Jordan-Lee-Product-Manager-Resume.pdf,” not “resume-final-v7.” After upload, inspect any autofilled employer, title, date, and education fields and correct them before submitting.",
      },
      {
        heading: "Keep type, spacing, and bullets boring on purpose",
        body: "Use one familiar font family at about 10–12 points for body text and about 14–16 points for headings. Arial, Calibri, Helvetica, Georgia, Times New Roman, Cambria, Garamond, Verdana, and similar system faces are practical because they remain readable after export. Margins between half an inch and one inch leave enough whitespace for a human scan without crowding. Standard round or dash bullets are safer than arrows, checkmarks, or icon fonts. Skip photos, logos, skill bars, charts, and text inside shapes; those elements are either ignored or turned into noise. Color and bold are fine when contrast stays high and meaning does not depend on the color alone. Reserve underlines for actual links; underlining body text can clip descenders and look like a hyperlink. One page is a useful constraint for many students and early-career candidates; two focused pages are reasonable when relevant experience actually needs the room. Do not shrink type until the file becomes tiring to read. An ATS does not award extra credit for squeezing everything onto one page, and the person who opens the attachment still has to use it.",
      },
      {
        heading: "Match the posting with honest language, not hidden tricks",
        body: "Format gets your evidence into the database. Relevance still decides whether a recruiter searches for you. Use the job description as a checklist of real skills, tools, certifications, and domain terms, then include those terms only where they truthfully describe your work. Put important language in normal sentences and bullets, not in white text, keyword dumps, or copied requirement lists. Pair an acronym with the full term once when both appear in the posting. A checker can flag missing structure or weak overlap on this file; those scores are third-party estimates, not a grade recruiters see, and a high keyword overlap can still sit on scrambled work history. Knockout questions such as work authorization, licensure, or years of experience—not layout scores—are what can auto-disposition an application. A checker cannot invent a license you do not have, and it cannot model every employer’s screening questions. When the application asks you to re-enter history, complete the fields accurately even if they repeat the resume. The formatted attachment and the structured profile should tell the same story.",
      },
    ],
    steps: [
      { name: "Pick a structure", text: "Use reverse-chronological experience, or a hybrid that still shows dated jobs; skip a purely functional layout that hides employers and dates." },
      { name: "Build one readable column", text: "Put contact details in the body, use standard headings, and keep titles, employers, and dates grouped together." },
      { name: "Export the requested file", text: "Save a text-based PDF or clean DOCX as the posting asks, and confirm you can highlight and copy sentences." },
      { name: "Paste-test reading order", text: "Copy the whole file into Notepad or another plain-text editor. If titles, employers, dates, and bullets no longer stay together, rebuild the layout." },
      { name: "Check parsed fields", text: "After upload, inspect autofilled employer, title, date, and education fields and correct them before submitting." },
    ],
    faqs: [
      {
        question: "What is the best ATS-friendly resume format?",
        answer: "A reverse-chronological, single-column layout with standard headings, contact details in the body, consistent month-year dates, and selectable text. A short summary and skills list on top of that timeline is fine. Avoid a functional resume that hides employers and dates.",
      },
      {
        question: "Is PDF or Word better for applicant tracking systems?",
        answer: "Use the format the employer requests. If both are allowed, a text-based PDF or a clean DOCX can work. The older “never use PDF” rule is out of date; image-only PDFs, scans, and design exports that you cannot highlight are the files to avoid. Inspect parsed fields after upload whenever the form shows them.",
      },
      {
        question: "Can I use a two-column or Canva resume with ATS software?",
        answer: "It is a gamble. Some modern parsers handle simple columns, but reading order often breaks, and design-tool PDFs may flatten text into images. A one-column Word or Google Docs file exported as real text is the safer default when you cannot test the employer’s exact system.",
      },
      {
        question: "Do tables, graphics, and headers break ATS parsing?",
        answer: "They raise risk rather than guaranteeing rejection. Layout tables and text boxes can shuffle order; images and icons are not searchable text; headers and footers are sometimes skipped or duplicated. Keep essential facts in the body as ordinary text, then run a copy-paste test in Notepad or another plain-text editor.",
      },
      {
        question: "Does an ATS automatically reject a resume because of formatting?",
        answer: "Formatting can scramble extracted fields, but knockout questions such as work authorization, required licenses, or years of experience are what can auto-disposition an application. There is no universal layout “pass rate” recruiters use. Reduce extraction risk with a one-column file, then correct parsed fields before you submit.",
      },
      {
        question: "Should I trust an ATS match score or parse-rate percentage?",
        answer: "Treat third-party scores as a check on this file, not a grade of a universal robot. Recruiters typically do not see those numbers, and vendor parse-rate tables are often measured on clean English test sets rather than messy real uploads. A high keyword overlap can still sit on a scrambled work history.",
      },
      {
        question: "How long should an ATS resume be?",
        answer: "Length is for the human reader more than the software. One page suits many early-career applications; two pages are appropriate when relevant roles, projects, or credentials need the space. Do not shrink fonts or margins just to force an arbitrary page count.",
      },
    ],
    datePublished: "2026-08-14",
    dateModified: "2026-08-14",
    relatedLinks: [
      { title: "ATS checker", path: "/tools/ats-checker" },
      { title: "Resume keywords", path: "/guides/ats/resume-keywords" },
      { title: "ATS-friendly resume templates", path: "/templates" },
      { title: "How to make a resume", path: "/guides/how-to-make-a-resume" },
      { title: "ATS-friendly fonts", path: "/guides/ats/ats-friendly-fonts" },
      { title: "Workday application guide", path: "/guides/ats/workday-resume" },
    ],
  },
  {
    slug: "resume-keywords",
    canonical: "/guides/ats/resume-keywords",
    status: "published",
    kind: "ats",
    title: "Resume Keywords: How to Tailor Them to One Job Description",
    description:
      "Pull resume keywords from this posting’s title, tools, certifications, and repeated phrases. Place them honestly, then verify with a paste-test and the ATS checker.",
    intro:
      "Resume keywords are the words this employer uses to describe the work—not a transferable industry list you reuse on every application. The useful move is to extract this posting’s title, hard skills, tools, certifications, and repeated phrases, then place them in your summary, skills section, and evidence bullets only where they are true. Applicant tracking systems and recruiter filters vary by employer, so overlap is not a pass score. Copy the exported file into Notepad to confirm the new terms are selectable text, then paste the resume and this job description into the ATS checker and treat missing true terms as the to-do list.",
    sections: [
      {
        heading: "Keywords come from this posting, not a generic bank",
        body: "People searching for resume keywords usually want a list they can paste. That is the wrong unit of work. The terms that help this application are the ones in this job description: the job title as written, required tools and platforms, licenses or certifications, domain nouns that repeat, and the verbs the employer uses for the work you actually did. A 500-term “best keywords” bank is not transferable across postings, industries, or seniority. Two “product manager” roles can emphasize discovery versus delivery, Salesforce versus HubSpot, or a certification you do not hold. Start from the live requisition, not from last month’s version or a template of popular skills. Keep a longer master resume for storage, then make a focused copy for each serious application. The goal is translation: say what you did in the employer’s language when that language is accurate. It is not to collect every noun in the advertisement.",
      },
      {
        heading: "Extract the title, tools, certs, and repeated phrases",
        body: "Read the posting once for requirements and once for language. Highlight the exact job title and close variants, named tools and systems, required certifications or licenses, hard skills, and phrases that appear more than once. Separate knockouts from preferences. Work authorization, an active license, a degree, or years in a named setting can auto-disposition an application even when keyword overlap looks strong; a checker cannot grant those. Preferences such as “nice to have” tools belong on the resume only if you can discuss them. Ignore fluffy culture lines. When the posting says “electronic health record” in one sentence and “EHR” in another, note both. When it repeats “incident response” five times and mentions “on-call” once, the repeated phrase is the one to place if it is true of your work. Write a short extraction list before you edit: five to twelve terms you can defend, not a dump of every adjective in the posting.",
      },
      {
        heading: "Place terms in the summary, skills, and evidence bullets",
        body: "Put important language where a recruiter and a parser both look: a short summary that names the target role, a skills section that indexes defensible tools, and bullets that show the term in context. “SQL” in a skills list is weaker than a bullet that says you wrote SQL to reconcile weekly billing exceptions, and weaker still if the posting never asks for it. Pair an acronym with the full term once when the job uses both, such as “Customer Relationship Management (CRM),” then use the form the posting prefers. Do not invent experience, inflate a one-time demo into daily use, or copy requirement paragraphs into a skills block. Soft skills belong in bullets with an audience or result, not as a second keyword list. If a true term still has no home after editing, either add one honest sentence of context or leave it off. Twelve relevant, supported terms usually outperform a dense wall of loosely related words.",
      },
      {
        heading: "Mirror exact phrasing when it is true—never hide it",
        body: "If you conducted user interviews and the role consistently says “user interviews,” use that phrase instead of a looser synonym such as “customer chats.” Exact phrasing helps keyword search and recruiter filters; it does not replace evidence. Do not use white text, tiny type, keyword stuffing, or copied job-description blocks. Those tricks waste space, can look like spam to a human, and do not create experience you can discuss. There is no reliable keyword-density target to hit. Semantic matching in some products may relate close terms, but that does not make exact language obsolete, and you cannot know this employer’s configuration. Skip hidden text, tables of synonyms, and headers that exist only to park extra nouns. If you cannot explain a term in an interview, it does not belong on the page.",
      },
      {
        heading: "ATS search is not a universal pass score",
        body: "Applicant tracking systems store, search, and rank applications in ways that depend on the vendor and the employer’s setup. Recruiters often filter on titles, skills, and knockout questions. Keyword overlap can help you appear in a search; it does not grade a universal robot, and it does not override missing work authorization, licensure, or required years. Third-party match percentages are gap estimates for this file against this posting. They are not a score recruiters see, not a clone of Jobscan or any other vendor, and not a 75% or 80% pass mark. Do not chase parse-rate tables. Employer configurations vary, so a clean overlap on scrambled work history still fails the person who opens the attachment. Use keywords to make true evidence findable. Then complete the application’s structured fields so the profile and the file tell the same story.",
      },
      {
        heading: "Verify with a Notepad paste-test, then the ATS checker",
        body: "After you add terms, export the file the posting asks for and copy the whole resume into Notepad or another plain-text editor. Confirm the new keywords are selectable text, not images, icons, or text trapped in a sidebar. Titles, employers, dates, and bullets should still travel together. If a term you added disappears or the order scrambles, fix the layout before you apply—usually by moving content into a single column of ordinary body text. Then paste this resume and this job description into the ATS checker. Treat missing true terms as the to-do list. Do not treat the percentage as pass or fail, and do not add words you cannot defend just to close a gap. If the paste-test fails, switch to a simpler ATS-friendly format before scanning again. Keep the submitted resume next to the job description so interview answers match what the employer saw.",
      },
    ],
    steps: [
      { name: "Extract this posting", text: "From the live job description, list the title, tools, certifications, knockouts, and phrases that repeat." },
      { name: "Place terms honestly", text: "Put true language in the summary, skills, and evidence bullets. Pair an acronym with the full term once. Do not invent work." },
      { name: "Paste-test the export", text: "Copy the whole file into Notepad or another plain-text editor and confirm the new keywords are selectable text in a sensible order." },
      { name: "Scan resume plus this JD", text: "Paste both into the ATS checker. Use missing true terms as the edit list; ignore the percentage as a pass mark." },
      { name: "Fix gaps, then apply", text: "Add only language you can defend. If the paste-test failed, simplify the format first. Review parsed application fields before submitting." },
    ],
    faqs: [
      {
        question: "What are resume keywords?",
        answer: "They are the employer’s terms for the role: job title, hard skills, tools, certifications, and repeated phrases in this posting. They are not a generic industry list you reuse on every application.",
      },
      {
        question: "Should I copy every keyword from the job description?",
        answer: "No. Use the posting’s wording only where it accurately describes your experience. Copied requirement lists, hidden text, and claims you cannot discuss in an interview do not help.",
      },
      {
        question: "Do I need a 75% ATS match score to get interviews?",
        answer: "No. There is no universal pass mark recruiters use. Third-party scores are estimates of overlap on this file, not a grade of the employer’s system. Missing licenses or work authorization can still stop an application.",
      },
      {
        question: "Are lists of the best resume keywords worth using?",
        answer: "Not as a transferable bank. Popular terms from another role or a 500-item list can be irrelevant or untrue for this posting. Extract language from the live job description instead.",
      },
      {
        question: "Will semantic or AI matching make exact keywords unnecessary?",
        answer: "Some systems relate close terms, but employer setups vary and you cannot assume this one does. Mirror exact phrasing when it is true. Do not skip the terms the posting actually uses.",
      },
      {
        question: "How do I check that my keywords will be read?",
        answer: "Copy the exported resume into Notepad and confirm the new terms are selectable text. Then paste the resume and this job description into the ATS checker and add only missing terms you can honestly support.",
      },
    ],
    datePublished: "2026-08-17",
    dateModified: "2026-08-17",
    relatedLinks: [
      { title: "ATS checker", path: "/tools/ats-checker" },
      { title: "ATS-friendly resume format", path: "/guides/ats/ats-friendly-resume-format" },
      { title: "How to make a resume", path: "/guides/how-to-make-a-resume" },
      { title: "ATS-friendly resume templates", path: "/templates" },
    ],
  },
  ...[
    {
      slug: "workday-resume",
      title: "Workday Resume Parsing and Application Guide",
      description: "Prepare a readable resume and verify parsed application fields when applying through a Workday-powered career site.",
      intro: "Workday career sites can be configured differently by each employer. Treat resume upload as a data-entry aid, not proof that every field was interpreted correctly. The practical goal is a clear source file plus a careful review of the employer’s application form.",
      focus: "Workday",
      sections: [
        ["Understand the employer-specific workflow", "A company may choose different required questions, profile fields, screening steps, and integrations even when its career site uses Workday. Do not assume advice from one application will map perfectly to another. Read the instructions on the specific posting, allow enough time for account creation, and save the job description before it changes or closes."],
        ["Use a simple source document", "Keep contact details in the body, use conventional headings, and present employers, titles, and dates consistently. Avoid relying on columns, floating text boxes, icons, or image-based skill charts for essential facts. A text-selectable PDF or clean DOCX may work, but the employer’s stated format should decide which you upload."],
        ["Review every parsed field", "After upload, compare populated employment, education, date, location, and contact fields with the resume. Correct split company names, merged roles, missing degrees, and date errors manually. If the form asks you to re-enter history, complete it accurately rather than writing “see resume”; structured fields may be part of the employer’s process."],
        ["Answer screening questions literally", "Work authorization, location, schedule, license, and experience questions can carry consequences. Answer based on your actual circumstances and read units carefully. A resume optimization tool cannot change a required credential. If a question is ambiguous, use an available notes field or contact the employer rather than guessing strategically."],
        ["Save evidence and confirm submission", "Use a stable filename, keep the submitted resume and job description together, and record the date and requisition number. Review the final summary screen before submitting. Confirmation indicates receipt, not ranking or interview likelihood; follow the employer’s stated communication process and avoid duplicate applications unless instructed."],
      ],
    },
    {
      slug: "greenhouse-resume",
      title: "Greenhouse Resume Parsing and Application Guide",
      description: "Build a clean resume for Greenhouse-hosted applications and check the employer’s fields before you submit.",
      intro: "Greenhouse provides recruiting software, while each employer controls its jobs, questions, workflows, and integrations. A recognizable application URL does not reveal how a company evaluates candidates. Concentrate on accurate fields, relevant evidence, and a readable attachment.",
      focus: "Greenhouse",
      sections: [
        ["Recognize configuration differences", "Employers can customize questions, consent language, demographic forms, and required attachments. Some postings use a Greenhouse-hosted form while others embed it in a company site. Verify the company and role before sharing information, and judge requirements from the live application rather than from a generic platform tutorial."],
        ["Prepare predictable resume structure", "Use one clear chronology with standard headings and consistent month-year dates. Put your name and contact details in ordinary text. Complex columns can create an unexpected copy order, so copy the exported resume into a plain-text editor and confirm that titles, companies, dates, and bullets remain grouped logically."],
        ["Check autofilled information", "When the application extracts details, compare every visible value with the original. Names with suffixes, international phone formats, multi-role employers, and overlapping education can require manual correction. The attached resume remains important, but accurate form fields prevent avoidable contradictions in what a recruiter sees."],
        ["Tailor evidence rather than stuffing terms", "Use the posting’s accurate terminology in summaries and accomplishment bullets when it matches your work. Include tools in context—what you built, analyzed, or improved—not in hidden text or copied blocks. Greenhouse configurations and employer processes vary, so no keyword count or third-party match score can guarantee progression."],
        ["Complete custom questions carefully", "Draft long answers separately so a browser issue does not erase them. Keep responses consistent with the resume while answering the actual prompt. For portfolio links, test access in a private window. Before submission, review consent choices and voluntary questions, then retain a copy of the role and materials."],
      ],
    },
    {
      slug: "lever-resume",
      title: "Lever Resume Parsing and Application Guide",
      description: "Submit a clear resume through Lever-hosted job forms and verify custom questions, links, and attachments.",
      intro: "Lever-hosted applications often look concise, but employers decide which questions, integrations, and review practices to use. There is no universal Lever ranking formula a candidate can optimize against. Make your qualifications easy for a person to verify and your file easy to read.",
      focus: "Lever",
      sections: [
        ["Start from the actual requisition", "Save the role title, location, requisition link, and description. Similar titles at one company may have different scope or requirements. Follow the application’s instructions for attachments and do not rely on the platform name to infer internal screening. Confirm that the page belongs to the employer before entering personal data."],
        ["Keep chronology and contact details explicit", "Use conventional headings, real text, consistent dates, and one clear reading order. Place portfolio and professional profile links next to labels rather than behind vague anchor text. Avoid putting essential information only in graphics or page furniture. Test PDF selection or DOCX reading order before upload."],
        ["Use custom fields as part of the application", "Employers may request location, authorization, salary expectations, portfolio work, or short answers. Respond accurately and consistently. If a field has a constrained choice that does not fit, look for an explanation field or employer contact route. Never alter dates or titles merely to make autofill look cleaner."],
        ["Write for relevance and human review", "Put the strongest matching experience near the top of each role and use language a recruiter can connect to the posting. A phrase such as “ran five moderated usability tests” is stronger than a disconnected “user research” keyword. Third-party scanners can identify omissions, but they cannot model every employer’s Lever setup or judgment."],
        ["Verify attachments and follow through", "Check filename, file type, links, and visible form entries before submitting. Keep a local copy of every answer and the final resume. A confirmation page or email shows that the application was received; it does not confirm parsing quality, ranking, or review timing. Use the employer’s published channel for updates."],
      ],
    },
    {
      slug: "taleo-resume",
      title: "Taleo Resume Parsing and Application Guide",
      description: "Navigate Taleo-based applications with a parseable resume, accurate work history, and deliberate field review.",
      intro: "Taleo deployments differ across organizations and may include lengthy profiles, required history, or employer-specific screening. Plan for manual review rather than a one-click upload. Your resume and structured application should tell the same accurate story.",
      focus: "Taleo",
      sections: [
        ["Budget time for a detailed profile", "Some Taleo-based applications ask for account setup, employment history, education, attachments, and screening questions. Requirements depend on the employer. Start before the deadline, save long responses outside the form, and note the requisition identifier. Avoid rushing dates or answers simply because fields repeat resume content."],
        ["Use consistent, parser-friendly labels", "Present each employer, title, location, and date range in a repeated pattern under standard headings. If you held multiple roles at one fictional or real employer, show each title and its dates clearly. Tables, text boxes, and decorative sidebars can scramble reading order, so reserve design complexity for information that is not essential."],
        ["Reconcile the imported work history", "Inspect every generated record. Parsers can split or combine entries unexpectedly, especially with consulting projects, promotions, or concurrent roles. Correct records to reflect reality and keep month-year dates consistent with your resume and professional profiles. Do not hide gaps by changing dates; a short truthful explanation is safer."],
        ["Treat required questions as separate evidence", "Answer minimum-experience, license, clearance, relocation, and eligibility questions literally. These may be employer-defined screening inputs, but their use varies. Resume keywords do not override a required qualification. If a free-response box asks for relevant experience, summarize specific evidence instead of pasting the entire resume."],
        ["Run a final consistency audit", "Compare the attachment, profile, and answers side by side. Check contact data, current role, education, licenses, and all dates. Remove stale attachments from a reused profile when possible and confirm the intended file is selected. Keep confirmation details, while recognizing that successful submission is not a promise of review or ranking."],
      ],
    },
    {
      slug: "ats-friendly-fonts",
      title: "ATS-Friendly Resume Fonts and Readable Type Choices",
      description: "Choose a readable resume font, size, hierarchy, and export that work for recruiters and text extraction.",
      intro: "No font guarantees ATS success. Most problems attributed to fonts are really problems with tiny type, missing embedding, image-based text, or confusing layout. Choose a common, legible family and test the exported document instead of searching for a supposedly secret approved list.",
      focus: "font and layout",
      sections: [
        ["Choose familiar, legible families", "Arial, Calibri, Helvetica, Georgia, Times New Roman, and other common system fonts are practical choices. A modern alternative can work when it embeds correctly and remains readable. Avoid novelty display faces for body text. The reader should distinguish letters, numbers, punctuation, and bold weights without effort."],
        ["Use a humane size and spacing", "Body text around 10–12 points is a useful starting range, adjusted for the font’s actual x-height. Names and headings can be larger. Do not shrink type, line spacing, or margins merely to force one page. Remove low-value content first. Print or view at 100 percent and ask whether scanning feels comfortable."],
        ["Create hierarchy without decoration overload", "Use two or three sizes, consistent bolding, and whitespace to distinguish sections, roles, and dates. Color should maintain strong contrast and never be the only signal. Icons, rating bars, and stylized initials may look attractive but should not carry essential meaning. Underlining is best reserved for recognizable links."],
        ["Export real, embedded text", "Generate a PDF or DOCX from the source application rather than scanning a printout. In a PDF, verify that text can be selected and searched. Copy all content into a plain-text editor to inspect order. If characters become boxes or disappear, switch to a standard font or adjust export settings before applying."],
        ["Follow the posting and test the file", "Use the requested format even if your default is different. Open the file on another device, test hyperlinks, zoom in for clipping, and inspect page breaks. ATS products and employer configurations vary, so a successful text test reduces risk but cannot guarantee how every downstream integration will display the document."],
      ],
    },
    {
      slug: "resume-words-to-avoid",
      title: "Resume Words and Filler to Avoid",
      description: "Replace vague buzzwords, passive duties, and unsupported claims with specific, truthful resume evidence.",
      intro: "Words are not automatically bad because they are common. The problem is unsupported language that consumes space without helping a reader evaluate you. Keep a term when it is accurate and contextualized; replace it when a concrete action, scope, or outcome would say more.",
      focus: "resume wording",
      sections: [
        ["Remove empty self-ratings", "Phrases such as “hard-working,” “results-driven,” “detail-oriented,” and “excellent communicator” are conclusions without evidence. Show the behavior instead: caught reconciliation errors, facilitated a decision, trained a team, or delivered under a deadline. If a posting uses a soft-skill term, support it in a bullet rather than merely repeating it."],
        ["Replace duty openers with actions", "“Responsible for,” “tasked with,” “helped with,” and “worked on” often hide your contribution. Choose an accurate verb such as analyzed, reconciled, implemented, coached, drafted, or monitored, then add the object and consequence. Do not inflate participation into ownership; “supported” can be exactly right when followed by clear scope."],
        ["Avoid unsupported superlatives and certainty", "Claims such as “best,” “world-class,” “expert,” “revolutionary,” or “guaranteed” invite skepticism unless an external, relevant fact supports them. State the credential, award, scale, or measured result instead. Also avoid implying causation when you only know correlation; “contributed to” may be more honest than “drove.”"],
        ["Cut internal jargon and stale clichés", "Company acronyms, team nicknames, and process labels mean little without explanation. Translate them into the industry concept and outcome. Clichés such as “wear many hats,” “think outside the box,” and “go-getter” take space from evidence. Preserve standard technical terms that recruiters actually need to identify."],
        ["Edit for precision, not keyword fear", "Do not mechanically ban words such as managed, led, or collaborated; they are useful when the sentence identifies what, with whom, and to what result. Compare each bullet with the posting, keep truthful terminology, vary verbs only when meaning changes, and read aloud. A clear repeated technical noun is better than an awkward synonym."],
      ],
    },
  ].map((guide) => ({
    slug: guide.slug,
    canonical: `/guides/ats/${guide.slug}`,
    status: "published" as const,
    kind: "ats" as const,
    title: guide.title,
    description: guide.description,
    intro: guide.intro,
    sections: guide.sections.map(([heading, body]) => ({ heading, body })),
    steps: [
      { name: "Read the application", text: `Follow the employer's live ${guide.focus} workflow and requested file format.` },
      { name: "Prepare clear evidence", text: "Use standard headings, consistent dates, selectable text, and truthful role language." },
      { name: "Verify before submitting", text: "Review parsed fields, attachments, links, screening answers, and confirmation details." },
    ],
    faqs: [
      { question: `Does ${guide.focus} automatically reject resumes with unusual formatting?`, answer: "There is no reliable universal rule. Employer configurations, integrations, and review practices vary. Use a simple reading order and selectable text to reduce extraction risk, then verify visible fields whenever the application allows it." },
      { question: "Should I copy every keyword from the job description?", answer: "No. Use the posting’s terminology only where it accurately describes your experience, skills, or credentials. Contextual evidence is useful to recruiters; copied lists, hidden text, and claims you cannot defend are not." },
      { question: "Which resume file type should I upload?", answer: "Follow the employer’s instruction. If both PDF and DOCX are accepted, use a clean text-based file that preserves reading order, and inspect any parsed fields. No format is guaranteed across every implementation." },
    ],
    ...dates,
    relatedLinks: [
      { title: "ATS-friendly resume format", path: "/guides/ats/ats-friendly-resume-format" },
      { title: "Resume keywords", path: "/guides/ats/resume-keywords" },
      { title: "ATS checker", path: "/tools/ats-checker" },
      { title: "Resume templates", path: "/templates" },
      { title: "How to make a resume", path: "/guides/how-to-make-a-resume" },
      { title: "ATS resume guides", path: "/guides/ats" },
      {
        title: guide.slug === "workday-resume" ? "Greenhouse application guide" : "Workday application guide",
        path: guide.slug === "workday-resume" ? "/guides/ats/greenhouse-resume" : "/guides/ats/workday-resume",
      },
    ],
  })),
]);
