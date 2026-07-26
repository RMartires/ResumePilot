import {
  objectiveCollectionSchema,
  resumeExampleSchema,
  roleSchema,
  skillsPageSchema,
} from "./schemas";

const links = (slug: string) => [
  { title: `${slug.replaceAll("-", " ")} resume example`, path: `/examples/resumes/${slug}` },
  { title: `${slug.replaceAll("-", " ")} objectives`, path: `/examples/objectives/${slug}` },
  { title: `${slug.replaceAll("-", " ")} skills`, path: `/skills/${slug}` },
  { title: "How to make a resume", path: "/guides/how-to-make-a-resume" },
];

export const ROLES = roleSchema.array().parse([
  ["software-engineer", "Software Engineer", ["TypeScript", "system design", "cloud platforms", "delivery"]],
  ["nursing", "Nursing", ["patient assessment", "clinical documentation", "care coordination", "safety"]],
  ["product-manager", "Product Manager", ["discovery", "roadmaps", "analytics", "stakeholder alignment"]],
].map(([slug, name, keywords]) => ({
  slug, canonical: `/roles/${slug}`, status: "published" as const, name,
  title: `${name} Resume Resources`,
  description: `Practical resume examples, objectives, and skills guidance for ${String(name).toLowerCase()} applications.`,
  keywords, relatedLinks: links(String(slug)).slice(0, 3),
})));

export const RESUME_EXAMPLES = resumeExampleSchema.array().parse([
  {
    slug: "software-engineer", canonical: "/examples/resumes/software-engineer", status: "published",
    roleSlug: "software-engineer", title: "Software Engineer Resume Example",
    description: "Study a fictional software engineer resume with scoped delivery, reliability, performance, and collaboration evidence.",
    summary: "Software engineer with five years of experience building accessible web products and reliable TypeScript services. Delivers measurable performance improvements, safer releases, and maintainable systems while partnering closely with product, design, and support teams.",
    skills: ["TypeScript", "JavaScript", "React", "Next.js", "Node.js", "PostgreSQL", "REST APIs", "AWS", "Docker", "GitHub Actions", "Playwright", "OpenTelemetry", "System design", "Code review"],
    experience: [
      { title: "Software Engineer", company: "Northstar Labs (fictional)", dates: "2022 – Present", bullets: [
        "Reduced checkout API p95 latency from 820 ms to 510 ms by profiling queries, adding targeted indexes, and removing duplicate requests.",
        "Led a TypeScript migration across three services and added contract tests, reducing production incidents linked to payload mismatches by 24%.",
        "Built an accessible account-recovery flow with design and support partners, raising successful self-service recovery from 61% to 78%.",
        "Introduced deployment health checks and rollback notes that cut median recovery time during release incidents from 42 minutes to 25 minutes.",
      ]},
      { title: "Junior Software Engineer", company: "Cedar Peak Software (fictional)", dates: "2020 – 2022", bullets: [
        "Delivered React reporting filters used by 1,800 monthly users and reduced repeated support questions by documenting saved-view behavior.",
        "Expanded Playwright coverage for six revenue-critical journeys and stabilized CI retries, lowering escaped regression reports by 18%.",
        "Partnered with a senior engineer to move image processing to queued workers, preventing request timeouts during seasonal traffic peaks.",
      ]},
    ],
    tips: [
      "Name technologies inside accomplishment bullets so readers see how and why each tool was used.",
      "Use defensible measures such as latency, reliability, adoption, support volume, delivery time, or cloud cost.",
      "Distinguish your contribution from the team result, especially for migrations and cross-functional launches.",
      "Include projects when they demonstrate target skills that your paid roles do not yet show.",
      "Link to a curated portfolio or repository only when it contains readable documentation and work you can discuss.",
    ], relatedLinks: links("software-engineer"),
  },
  {
    slug: "nursing", canonical: "/examples/resumes/nursing", status: "published", roleSlug: "nursing",
    title: "Nursing Resume Example",
    description: "Study a fictional registered nurse resume with patient-care scope, safety improvements, precepting, and clinical coordination.",
    summary: "Registered nurse with six years of medical-surgical and step-down experience, including charge coverage, new-nurse precepting, and interdisciplinary discharge planning. Known for accurate assessment, calm escalation, and practical patient education.",
    skills: ["Patient assessment", "Medication administration", "Care planning", "Epic EHR", "Telemetry", "IV therapy", "Wound care", "Discharge education", "Clinical documentation", "Infection prevention", "Rapid response", "Interdisciplinary rounds", "Precepting", "BLS", "ACLS"],
    experience: [
      { title: "Registered Nurse, Step-Down Unit", company: "Harborview Community Hospital (fictional)", dates: "2021 – Present", bullets: [
        "Coordinate care for four to five higher-acuity adult patients per shift, completing focused assessments and escalating meaningful status changes.",
        "Co-designed a bedside handoff checklist adopted across a 28-bed unit, improving documented completion from 72% to 93% in quarterly audits.",
        "Precepted eight newly hired nurses through unit competencies, medication workflows, and progressive patient assignments with written feedback.",
        "Partnered with pharmacy and educators on anticoagulation teach-back materials, reducing follow-up clarification calls by 21% over six months.",
      ]},
      { title: "Registered Nurse, Medical-Surgical Unit", company: "Maple Grove Medical Center (fictional)", dates: "2019 – 2021", bullets: [
        "Managed medication administration, wound care, mobility plans, and discharge preparation for five to six patients on day shifts.",
        "Recognized and escalated early deterioration using assessment trends and unit protocols, supporting timely rapid-response evaluation.",
        "Audited isolation-supply stations and coached peers on restocking standards, raising weekly readiness compliance from 84% to 97%.",
      ]},
    ],
    tips: [
      "State specialty, patient population, unit type, and typical assignment only when accurate and appropriate to share.",
      "Put active license and required certifications where recruiters can find them quickly, including jurisdiction when relevant.",
      "Describe safety and quality work without sharing protected health information or identifying patient details.",
      "Use verified audit, education, throughput, or follow-up measures rather than inventing clinical outcomes.",
      "Show communication through escalation, education, handoff, precepting, and interdisciplinary coordination examples.",
    ], relatedLinks: links("nursing"),
  },
  {
    slug: "product-manager", canonical: "/examples/resumes/product-manager", status: "published", roleSlug: "product-manager",
    title: "Product Manager Resume Example",
    description: "Study a fictional product manager resume with discovery, prioritization, experimentation, launch, and adoption evidence.",
    summary: "Product manager with six years of experience improving B2B workflow products through customer discovery, behavioral analysis, and focused cross-functional delivery. Connects strategy to measurable activation, retention, and operational outcomes.",
    skills: ["Product discovery", "Roadmap planning", "Prioritization", "User interviews", "Jobs to be Done", "A/B testing", "SQL", "Amplitude", "Looker", "Jira", "Figma", "Go-to-market planning", "Stakeholder alignment", "Requirements writing", "Product analytics"],
    experience: [
      { title: "Product Manager", company: "Orbit Harbor Systems (fictional)", dates: "2022 – Present", bullets: [
        "Interviewed 24 operations leads and analyzed activation funnels to identify setup friction, informing onboarding changes that raised verified activation by 14%.",
        "Prioritized a six-month roadmap with engineering and design using customer impact, strategic fit, effort, and operational risk rather than request volume alone.",
        "Launched role-based approval workflows to 40 pilot accounts, monitored support themes, and expanded after task completion reached the agreed threshold.",
        "Defined instrumentation and decision rules for an invitation experiment that improved first-week team adoption by 9% without increasing unsubscribe rates.",
      ]},
      { title: "Associate Product Manager", company: "Juniper Trail Analytics (fictional)", dates: "2020 – 2022", bullets: [
        "Synthesized support tickets and twelve customer interviews into reporting requirements used by a five-person delivery team.",
        "Partnered with customer success on beta recruitment and enablement for scheduled exports, reaching 63% monthly use among eligible pilot accounts.",
        "Created a release review that tracked intended outcome, adoption, defects, and follow-up decisions, replacing output-only launch reporting.",
      ]},
    ],
    tips: [
      "Connect discovery and prioritization work to a decision, not just the number of meetings or documents produced.",
      "Separate product outcomes such as adoption from business outcomes such as retention and avoid claiming causation without evidence.",
      "Show how engineering, design, data, sales, support, or compliance partners influenced a tradeoff.",
      "Name analytics and research tools in context while keeping the customer problem and decision central.",
      "Include launches that did not meet a target when you can explain the learning and responsible next decision.",
    ], relatedLinks: links("product-manager"),
  },
]);

const objectives = {
  "software-engineer": [
    "Computer science graduate seeking a junior software engineer role, bringing TypeScript fundamentals, two deployed team projects, and experience writing automated tests for customer-facing workflows.",
    "QA analyst transitioning to backend engineering after building Python regression tools, seeking to apply production troubleshooting, API testing, and data-validation experience to reliable services.",
    "Frontend developer pursuing a product engineering role, bringing accessible React implementation, performance profiling, and close collaboration with designers on high-traffic user journeys.",
    "IT support specialist seeking an entry-level software role after shipping an internal inventory app, offering practical debugging, SQL, user support, and technical documentation experience.",
    "Bootcamp graduate targeting full-stack development, with deployed Node.js and PostgreSQL projects, peer code-review practice, and prior operations experience translating ambiguous needs into repeatable workflows.",
    "Mobile developer moving into web platform engineering, bringing three years of release ownership, API integration, crash analysis, and cross-functional delivery in a regulated product environment.",
    "Returning software engineer seeking a backend role after a caregiving break, with refreshed Java and cloud skills demonstrated through a documented event-processing project and recent open-source fixes.",
    "Data analyst pursuing analytics engineering, offering advanced SQL, tested transformation pipelines, dashboard stakeholder support, and a record of reducing recurring reporting work through automation.",
  ],
  nursing: [
    "New BSN graduate seeking a medical-surgical residency, bringing supervised clinical experience in adult assessment, medication safety, care planning, and patient education alongside current BLS certification.",
    "Licensed practical nurse pursuing an RN transition role after completing an accredited bridge program, offering four years of long-term care medication administration, wound support, and family communication.",
    "Medical-surgical RN seeking a step-down position, bringing three years of telemetry exposure, early escalation, discharge education, and interdisciplinary care coordination for complex adult patients.",
    "Emergency department nurse moving into clinical education, offering seven years of triage practice, precepting, simulation support, and calm communication during rapidly changing patient conditions.",
    "Registered nurse returning after a planned family leave, with active licensure, refreshed BLS and ACLS credentials, recent continuing education, and prior experience on a 30-bed cardiac unit.",
    "Home health nurse seeking a care-management role, bringing independent assessment, medication reconciliation, resource coordination, and clear documentation across geographically dispersed patient visits.",
    "Pediatric RN pursuing outpatient practice, offering family-centered education, vaccine workflows, telephone triage, and age-appropriate assessment experience from a busy community clinic.",
    "Internationally educated nurse seeking a US new-graduate program after completing required licensure steps, bringing supervised acute-care placements, multilingual patient communication, and rigorous clinical documentation habits.",
  ],
  "product-manager": [
    "Product analyst seeking an associate product manager role, bringing SQL funnel analysis, experiment readouts, customer-ticket synthesis, and experience translating findings into prioritized onboarding improvements.",
    "Customer success manager transitioning to product management, offering five years of workflow discovery, implementation feedback, renewal-risk analysis, and partnership with engineering on high-impact customer problems.",
    "MBA graduate targeting B2B product roles, with a shipped capstone, 18 customer interviews, market analysis, and prior operations experience improving adoption of internal workflow tools.",
    "Associate product manager seeking broader ownership, bringing two years of roadmap support, release instrumentation, beta coordination, and evidence-based prioritization across web and mobile experiences.",
    "Software engineer pursuing a technical product manager role, offering API and platform knowledge, architecture tradeoff experience, incident learning, and a record of clarifying requirements across teams.",
    "UX researcher moving into product management, bringing mixed-method discovery, opportunity framing, prototype evaluation, and facilitation that helped teams make explicit customer and business tradeoffs.",
    "Operations lead seeking an internal-tools product role after managing a workflow redesign, offering domain expertise, process metrics, stakeholder alignment, and hands-on partnership with a five-person engineering team.",
    "Product manager returning after caregiving leave, with refreshed analytics practice, recent volunteer discovery work, and prior ownership of onboarding experiments and cross-functional B2B launches.",
  ],
};

export const OBJECTIVE_COLLECTIONS = objectiveCollectionSchema.array().parse(
  Object.entries(objectives).map(([slug, items]) => {
    const name = slug === "software-engineer" ? "Software Engineer" : slug === "product-manager" ? "Product Manager" : "Nursing";
    return {
      slug, canonical: `/examples/objectives/${slug}`, status: "published" as const, roleSlug: slug,
      title: `${name} Resume Objective Examples`,
      description: `Adapt eight context-specific ${name.toLowerCase()} objectives for early-career, transition, return-to-work, and advancement applications.`,
      objectives: items,
      tips: [
        "Name the target role or setting so the reader immediately understands the direction of the application.",
        "Lead with evidence you already have—skills, projects, credentials, scope, or outcomes—not benefits you hope to receive.",
        "Adapt an example to your real background and remove every tool, credential, or claim you cannot defend.",
        "Keep the objective concise, then use experience, education, or projects to prove its strongest claims.",
      ], relatedLinks: links(slug),
    };
  }),
);

const skillSets = {
  "software-engineer": {
    categories: [
      { name: "Languages and frameworks", skills: ["TypeScript", "JavaScript", "Python", "Java", "React", "Node.js"] },
      { name: "Data and systems", skills: ["PostgreSQL", "Redis", "REST APIs", "System design", "AWS", "Docker"] },
      { name: "Engineering tools", skills: ["Git", "GitHub Actions", "Playwright", "OpenTelemetry", "CI/CD", "Feature flags"] },
      { name: "Collaboration skills", skills: ["Code review", "Technical writing", "Incident communication", "Mentoring", "Requirements clarification"] },
    ],
    advice: "Start with the target stack, but list only technologies you can discuss with concrete examples. Group languages, frameworks, data systems, cloud tools, and delivery practices so the section is scannable. Then prove the most important skills in experience or project bullets: name the service, constraint, decision, and outcome. “PostgreSQL” becomes credible when a bullet explains that you profiled a slow query and added an index; “leadership” becomes credible when you describe a migration plan or mentoring result. Avoid visual proficiency bars because their scale is undefined. Distinguish production use from coursework when that difference matters. Include testing, observability, accessibility, security, and collaboration practices when the role values them, rather than presenting engineering as languages alone.",
  },
  nursing: {
    categories: [
      { name: "Clinical hard skills", skills: ["Patient assessment", "Medication administration", "IV therapy", "Telemetry", "Wound care", "Care planning"] },
      { name: "Systems and credentials", skills: ["Epic EHR", "Clinical documentation", "BLS", "ACLS", "Medication reconciliation", "Barcode administration"] },
      { name: "Safety and coordination", skills: ["Infection prevention", "Rapid-response escalation", "Interdisciplinary rounds", "Discharge planning", "Patient education"] },
      { name: "Professional skills", skills: ["Therapeutic communication", "Prioritization", "Precepting", "Family communication", "Team handoff"] },
    ],
    advice: "Match the skills section to the specialty and level while remaining precise about your training and authorization. Lead with active licensure and required certifications in an appropriate credential area, then group clinical practices, systems, patient populations, and coordination skills. Do not list a procedure merely because you observed it; use wording that reflects validated competency and local scope. Reinforce major skills in bullets with assignment context, safety behavior, education, audit work, or team coordination, while protecting patient privacy. EHR names can help when requested, but accurate documentation practice matters more than a brand alone. Soft skills should appear through handoffs, escalation, de-escalation, teaching, and interdisciplinary work. Review every expiration date before applying and avoid implying that lapsed credentials remain current.",
  },
  "product-manager": {
    categories: [
      { name: "Product hard skills", skills: ["Product discovery", "Roadmapping", "Prioritization", "Experiment design", "Requirements writing", "Go-to-market planning"] },
      { name: "Research and analytics tools", skills: ["SQL", "Amplitude", "Looker", "User interviews", "Survey design", "Funnel analysis"] },
      { name: "Delivery tools and methods", skills: ["Jira", "Figma", "Feature flags", "Agile planning", "Release measurement", "Beta programs"] },
      { name: "Leadership skills", skills: ["Stakeholder alignment", "Tradeoff communication", "Facilitation", "Customer empathy", "Decision documentation"] },
    ],
    advice: "Choose skills that reflect the product environment: growth, platform, B2B workflow, consumer, data, or another real focus. Group discovery, analytics, strategy, delivery, and collaboration rather than listing every framework you have encountered. Tools such as SQL, Amplitude, Looker, Jira, or Figma are useful when a bullet shows the decision they enabled. Avoid claiming ownership of company outcomes without explaining team context and evidence. Demonstrate prioritization through explicit tradeoffs, research through insights that changed a decision, and leadership through alignment or conflict resolution. A methods list is not a substitute for judgment. If you are transitioning from engineering, design, operations, or customer success, emphasize transferable product decisions while being candid about where your formal ownership began.",
  },
};

export const SKILLS_PAGES = skillsPageSchema.array().parse(
  Object.entries(skillSets).map(([slug, page]) => {
    const name = slug === "software-engineer" ? "Software Engineer" : slug === "product-manager" ? "Product Manager" : "Nursing";
    return {
      slug, canonical: `/skills/${slug}`, status: "published" as const, roleSlug: slug,
      title: `${name} Resume Skills`,
      description: `Choose credible ${name.toLowerCase()} hard skills, tools, and professional skills, then support them with practical evidence.`,
      ...page, relatedLinks: links(slug),
    };
  }),
);
