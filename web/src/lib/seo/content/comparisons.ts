import { comparisonSchema } from "./schemas";

const reviewed = "2026-07-26";
const internalLinks = [
  { title: "Resume score tool", path: "/tools/resume-score" },
  { title: "ATS resume guides", path: "/guides/ats" },
  { title: "Resume templates", path: "/templates" },
  { title: "ResumePilot features", path: "/features" },
];
const resumePilotSource = {
  title: "ResumePilot features",
  url: "https://www.resumepilot.xyz/features",
};

export const COMPARISONS = comparisonSchema.array().parse([
  {
    slug: "best-free-resume-builder",
    canonical: "/compare/best-free-resume-builder",
    status: "published",
    title: "Best Free Resume Builders: An Honest Shortlist",
    description: "Compare what “free” currently includes across ResumePilot, Jobscan, Rezi, and Resume Genius before investing your time.",
    productA: "ResumePilot",
    productB: "Other shortlisted builders",
    verdict: "There is no objectively best free resume builder. ResumePilot suits someone who wants its integrated builder and job workflow, but it is a newer product with a smaller template and support ecosystem. Jobscan currently advertises free builder downloads, Rezi limits its free resume and PDF allowance, and Resume Genius limits free builder export to TXT. Recheck each official page before committing because plans change.",
    rows: [
      { feature: "ResumePilot", productA: "Free entry point; confirm current export and AI limits in the product", productB: "Integrated builder, tailoring, scoring, cover letters, and job tracking" },
      { feature: "Jobscan", productA: "Official builder page says create, edit, and download unlimited resumes free", productB: "ATS scanner and broader job-search tools include paid capabilities" },
      { feature: "Rezi", productA: "Official pricing says one resume and three PDF downloads on free plan", productB: "Guided builder, keyword targeting, checker, and AI tools with plan limits" },
      { feature: "Resume Genius", productA: "Official pricing lists free builder access with TXT export only", productB: "PDF and Word builder downloads require a paid trial or annual plan" },
      { feature: "What to verify", productA: "Export format, watermark, template access, data deletion, and cancellation", productB: "AI credits, scan limits, renewal terms, and whether a card is required" },
    ],
    sections: [
      { heading: "Define free before choosing", body: "A builder is only useful if its free path reaches the file you need. Check whether you can export PDF, DOCX, or only plain text; whether a card starts a renewing trial; and whether tailoring, scans, or AI writing use credits. Official pricing and checkout screens are more reliable than old roundup articles." },
      { heading: "Match the workflow to your need", body: "Choose a straightforward builder when you already know what to write. Choose a scanner when comparing a finished resume with a posting, and a broader workspace when you need versions, cover letters, and application tracking. No tool can verify an invented metric, replace a required credential, or guarantee an interview." },
      { heading: "Run a ten-minute export test", body: "Create one role and two bullets, export the allowed format, and inspect text selection, spacing, page breaks, and deletion controls. Then review any upgrade prompt shown in the product. This small test reveals more than a long feature list and reduces the cost of moving your full history later." },
    ],
    limitations: [
      "ResumePilot is a newer product, so it has a smaller public track record and template ecosystem than established alternatives.",
      "Free limits and prices can change after review; users should verify current export, renewal, privacy, and cancellation terms.",
    ],
    faqs: [
      { question: "Is ResumePilot objectively the best free resume builder?", answer: "No. The best fit depends on required export formats, templates, writing support, scanning, tracking, privacy preferences, and budget. Test the current free path with a small sample before moving all your data." },
      { question: "Can a free resume builder guarantee an ATS-compatible resume?", answer: "No builder can guarantee behavior across every employer, ATS configuration, or integration. Use clear headings and selectable text, follow application instructions, and inspect parsed fields whenever the employer exposes them." },
      { question: "What hidden cost should I check first?", answer: "Check whether PDF or DOCX export triggers payment and whether a low-cost trial automatically renews. Also inspect AI credit limits, cancellation steps, watermarks, data controls, and whether pricing is monthly or billed upfront." },
    ],
    lastReviewed: reviewed,
    sources: [
      resumePilotSource,
      { title: "Jobscan resume builder", url: "https://www.jobscan.co/resume-builder" },
      { title: "Rezi pricing", url: "https://www.rezi.ai/pricing" },
      { title: "Resume Genius pricing", url: "https://resumegenius.com/pricing" },
    ],
    relatedLinks: internalLinks,
  },
  {
    slug: "resumepilot-vs-jobscan", canonical: "/compare/resumepilot-vs-jobscan", status: "published",
    title: "ResumePilot vs Jobscan: Resume Tools Compared",
    description: "Compare ResumePilot and Jobscan across building, job-description analysis, application workflow, free access, and limitations.",
    productA: "ResumePilot", productB: "Jobscan",
    verdict: "ResumePilot emphasizes an integrated creation and application workspace. Jobscan’s official pages emphasize resume scanning and optimization alongside a free builder and other job-search tools. Jobscan has a longer public track record; ResumePilot may feel more direct if its combined workflow matches your needs. Neither product can guarantee an interview or reproduce every employer’s ATS configuration.",
    rows: [
      { feature: "Primary workflow", productA: "Build, tailor, score, create cover letters, and track applications", productB: "Scan against job descriptions, optimize, build, and use related job-search tools" },
      { feature: "Free builder", productA: "Free entry point; verify current limits before use", productB: "Official builder page says unlimited create, edit, and download are free" },
      { feature: "Resume analysis", productA: "Match scoring and resume feedback in the product workflow", productB: "Scanner compares a resume with a pasted job description and reports a match rate" },
      { feature: "Paid capabilities", productA: "Confirm current AI and usage limits in ResumePilot", productB: "Official pages identify advanced AI optimization as paid" },
      { feature: "Maturity", productA: "Newer product with a smaller public support and template ecosystem", productB: "Established specialist with broader published ATS education" },
    ],
    sections: [
      { heading: "Choose based on the repeated task", body: "If your bottleneck is maintaining resume versions, cover letters, and application status together, evaluate ResumePilot’s end-to-end flow. If your main task is comparing an existing resume with many job descriptions, evaluate Jobscan’s scanner depth. Run the same real posting through each and judge whether suggestions remain accurate and useful." },
      { heading: "Interpret match feedback carefully", body: "A match score is product-specific guidance, not an employer score. Use it to notice missing hard skills, wording differences, or formatting risks, then reject recommendations that do not reflect your history. Employer configurations, recruiter practices, knockout questions, referrals, and applicant volume remain outside either tool’s view." },
      { heading: "Verify current price and export terms", body: "Jobscan’s official builder page currently says its core builder supports free unlimited creation and downloads while advanced AI tools are paid. ResumePilot’s limits should be checked in the live product. Compare file formats, scan or AI allowances, renewal terms, cancellation, and data handling on the day you choose." },
    ],
    limitations: [
      "ResumePilot has less public history and fewer published templates and educational resources than Jobscan.",
      "ResumePilot’s scoring is guidance only and cannot model a specific employer’s configured ATS or decision process.",
    ],
    faqs: [
      { question: "Is ResumePilot a replacement for Jobscan?", answer: "It may cover similar building and matching tasks, but the products emphasize different workflows. Compare them with your own resume and posting, and verify current limits rather than assuming the same scanner depth or feature set." },
      { question: "Does a higher score guarantee an interview?", answer: "No. A product score can highlight alignment or formatting issues, but employers use different systems and human processes. Qualifications, evidence, application answers, timing, and competition also matter." },
      { question: "Which one should I use for free resume downloads?", answer: "Jobscan currently states that its core builder allows unlimited free creation and downloads. ResumePilot also has a free entry point, but confirm its current export formats and limits in the live product before deciding." },
    ],
    lastReviewed: reviewed,
    sources: [resumePilotSource, { title: "Jobscan official homepage", url: "https://www.jobscan.co/" }, { title: "Jobscan resume builder", url: "https://www.jobscan.co/resume-builder" }],
    relatedLinks: internalLinks,
  },
  {
    slug: "resumepilot-vs-rezi", canonical: "/compare/resumepilot-vs-rezi", status: "published",
    title: "ResumePilot vs Rezi: Resume Builders Compared",
    description: "Compare ResumePilot and Rezi across resume creation, keyword guidance, broader job workflow, free limits, and tradeoffs.",
    productA: "ResumePilot", productB: "Rezi",
    verdict: "ResumePilot and Rezi both combine resume creation with feedback, but their current packaging differs. Rezi’s official pages document a guided builder, keyword targeting, ATS checker, AI tools, and specific free, monthly, and lifetime plans. ResumePilot emphasizes a connected resume-to-application workflow. Choose after testing output quality and verifying current limits, not from claims that either is universally best.",
    rows: [
      { feature: "Resume creation", productA: "Integrated builder with tailoring and scoring workflow", productB: "Guided builder with AI writing and automatic formatting" },
      { feature: "Job alignment", productA: "Job-description tailoring and match feedback", productB: "Keyword targeting and ATS checker described on official tools page" },
      { feature: "Free plan", productA: "Free entry point; confirm current AI and export limits", productB: "Official pricing says one resume, limited AI, and up to three PDF downloads" },
      { feature: "Paid model", productA: "Verify current ResumePilot plan details and allowances", productB: "Official pricing lists monthly Pro and one-time Lifetime options" },
      { feature: "Broader workflow", productA: "Cover letters and application tracking are core product areas", productB: "Official tools page also lists job search, tracking, and interview practice" },
    ],
    sections: [
      { heading: "Compare the editing experience", body: "Import or create the same short resume in both tools. Check whether suggestions preserve facts, whether you can control section order and wording, and whether the exported document remains readable. AI-generated bullets are drafts: remove invented scope, generic claims, and metrics you cannot verify before using either product." },
      { heading: "Understand the documented free limits", body: "Rezi’s official pricing currently states that its free plan supports one resume, limited AI tools, and three PDF downloads without a card. ResumePilot offers a free entry point, but users should confirm current export and usage limits in the live product. Limits and plan names can change after this review." },
      { heading: "Assess the surrounding workflow", body: "ResumePilot may appeal when you want resume, cover-letter, and application work connected. Rezi’s official tools page lists keyword targeting, an ATS checker, job search and tracking, and interview practice. Feature presence alone does not establish quality; test the functions you will repeat and inspect privacy and cancellation terms." },
    ],
    limitations: [
      "ResumePilot is newer and has a smaller public template catalog, help library, and user track record than Rezi.",
      "ResumePilot does not remove the need to fact-check generated wording or manually review each exported application document.",
    ],
    faqs: [
      { question: "Is Rezi free to use?", answer: "Rezi’s official pricing currently describes a free plan with one resume, limited AI access, and up to three PDF downloads without a card. Verify the live page because allowances can change." },
      { question: "Which tool has better AI writing?", answer: "That is subjective and depends on your source details and role. Test both with the same prompt, then score factual accuracy, specificity, edit control, and how much generic wording you must remove." },
      { question: "Does either tool guarantee ATS success?", answer: "No. Both can provide formatting and relevance guidance, but ATS configurations and employer decisions vary. You remain responsible for truthful content, required qualifications, application answers, and final file review." },
    ],
    lastReviewed: reviewed,
    sources: [resumePilotSource, { title: "Rezi official product information", url: "https://www.rezi.ai/ai-llm-info" }, { title: "Rezi tools", url: "https://www.rezi.ai/tools" }, { title: "Rezi pricing", url: "https://www.rezi.ai/pricing" }],
    relatedLinks: internalLinks,
  },
  {
    slug: "resumepilot-vs-resume-genius", canonical: "/compare/resumepilot-vs-resume-genius", status: "published",
    title: "ResumePilot vs Resume Genius: Builders Compared",
    description: "Compare ResumePilot and Resume Genius across guided writing, templates, exports, pricing structure, and workflow limitations.",
    productA: "ResumePilot", productB: "Resume Genius",
    verdict: "Resume Genius emphasizes guided resume creation, templates, generated writing support, and a large advice library. ResumePilot emphasizes a connected workflow that includes tailoring, scoring, cover letters, and application tracking. Resume Genius currently permits free TXT builder export while PDF and Word require payment; verify ResumePilot’s current export limits. The better fit depends on formats and workflow, not an objective ranking.",
    rows: [
      { feature: "Builder approach", productA: "Integrated editor connected to tailoring and application tools", productB: "Guided builder with automatic formatting and writing suggestions" },
      { feature: "Free export", productA: "Confirm current formats and limits in the live product", productB: "Official pricing lists TXT-only resume builder export under free access" },
      { feature: "Paid export", productA: "Check current ResumePilot plan details", productB: "Official pricing lists PDF and Word in trial and annual plans" },
      { feature: "Templates and education", productA: "Smaller, newer public catalog", productB: "Large public template, example, and resume-advice library" },
      { feature: "Application workflow", productA: "Job-description tailoring, scoring, cover letters, and tracking", productB: "Builder, checker, review, cover-letter tools, and US job-board access listed" },
    ],
    sections: [
      { heading: "Start with your required file format", body: "Resume Genius currently lets users build and export TXT without payment, while PDF and Word builder downloads are included in paid access. A TXT file may require manual formatting in another program. Check ResumePilot’s live product for current export allowances, then test the actual downloaded document before entering your full work history." },
      { heading: "Compare guidance with control", body: "Guided prompts and suggested bullets can help a blank-page user, while a flexible editor can suit someone with established content. In either product, inspect generated text for false metrics, duties you did not perform, and inflated language. The final resume should sound specific to your history rather than to a template library." },
      { heading: "Read renewal terms before checkout", body: "Resume Genius’s official pricing currently describes a low-cost 14-day trial that automatically renews at a recurring four-week price unless canceled, plus an annual option billed upfront. Terms can change, so read the checkout disclosure. Also verify ResumePilot’s plan duration, AI limits, cancellation route, and data controls before paying." },
    ],
    limitations: [
      "ResumePilot offers a smaller template and editorial library than the long-established Resume Genius site.",
      "ResumePilot users must still verify generated content, current plan limits, and exported formatting for every important application.",
    ],
    faqs: [
      { question: "Can I download a Resume Genius resume for free?", answer: "Its official pricing currently lists free resume-builder access with TXT export. PDF and Word builder downloads are listed with paid access. Verify the live pricing and checkout because terms can change." },
      { question: "Why might someone choose ResumePilot?", answer: "Someone may prefer its connected tailoring, scoring, cover-letter, and job-tracking workflow. That does not make it universally better; users who prioritize a larger template library or guided content may prefer another option." },
      { question: "What should I check before starting a paid trial?", answer: "Check renewal date and amount, billing interval, cancellation instructions, included export formats, AI or document limits, refund terms, and data deletion. Save the terms shown at checkout." },
    ],
    lastReviewed: reviewed,
    sources: [resumePilotSource, { title: "Resume Genius pricing", url: "https://resumegenius.com/pricing" }, { title: "Resume Genius builder", url: "https://resumegenius.com/" }, { title: "Resume Genius free-use FAQ", url: "https://resumegenius.com/faq/is-resume-genius-free" }],
    relatedLinks: internalLinks,
  },
]);
