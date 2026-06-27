import {
  emptyJob,
  emptyProject,
  emptyResume,
  loadDraft,
  normalizeResume,
  resumeToJson,
  resumeToMarkdown,
  saveDraft,
  downloadJson,
  downloadMarkdown,
} from "./resume.js";

const form = document.getElementById("resume-form");
const linksContainer = document.getElementById("links-container");
const experienceContainer = document.getElementById("experience-container");
const projectsContainer = document.getElementById("projects-container");
const previewEl = document.getElementById("resume-preview");
const jsonPreviewEl = document.getElementById("json-preview");
const autosaveStatus = document.getElementById("autosave-status");

const linkTemplate = /** @type {HTMLTemplateElement} */ (
  document.getElementById("link-row-template")
);
const jobTemplate = /** @type {HTMLTemplateElement} */ (
  document.getElementById("job-card-template")
);
const projectTemplate = /** @type {HTMLTemplateElement} */ (
  document.getElementById("project-card-template")
);
const bulletTemplate = /** @type {HTMLTemplateElement} */ (
  document.getElementById("bullet-row-template")
);

const SECTION_ORDER = ["personal", "skills", "projects", "experience", "education"];

const LINK_ICONS = {
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
  website: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
};

/** @type {ReturnType<typeof setTimeout> | null} */
let autosaveTimer = null;

/** @type {string} */
let activeSection = "personal";

init();

function init() {
  const draft = loadDraft();
  renderResume(draft ?? emptyResume());

  form.addEventListener("input", scheduleAutosave);
  form.addEventListener("change", scheduleAutosave);

  document.querySelector(".add-link-btn")?.addEventListener("click", () => {
    addLinkRow("");
    scheduleAutosave();
  });

  document.getElementById("add-job-btn")?.addEventListener("click", () => {
    addJobCard(emptyJob());
    scheduleAutosave();
  });

  document.getElementById("add-project-btn")?.addEventListener("click", () => {
    addProjectCard(emptyProject());
    scheduleAutosave();
  });

  document.getElementById("save-json-btn")?.addEventListener("click", () => {
    const resume = readForm();
    const slug = slugify(resume.header.name || "resume");
    downloadJson(resume, `${slug}.json`);
    flashStatus("JSON downloaded");
  });

  document.getElementById("export-md-btn")?.addEventListener("click", () => {
    const resume = readForm();
    const slug = slugify(resume.header.name || "resume");
    downloadMarkdown(resume, `${slug}.md`);
    flashStatus("Markdown exported");
  });

  document.getElementById("save-compile-btn")?.addEventListener("click", saveAndCompile);

  document.getElementById("save-next-btn")?.addEventListener("click", () => {
    saveAndCompile();
    goToNextSection();
  });

  for (const btn of document.querySelectorAll(".section-save-btn")) {
    btn.addEventListener("click", saveAndCompile);
  }

  for (const btn of document.querySelectorAll(".section-next-btn")) {
    btn.addEventListener("click", () => {
      saveAndCompile();
      goToNextSection();
    });
  }

  initSectionToggles();

  document.getElementById("load-json-input")?.addEventListener("change", async (event) => {
    const input = /** @type {HTMLInputElement} */ (event.target);
    const file = input.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      renderResume(normalizeResume(JSON.parse(text)));
      flashStatus(`Loaded ${file.name}`);
    } catch {
      flashStatus("Invalid JSON file");
    } finally {
      input.value = "";
    }
  });

  document.getElementById("load-sample-btn")?.addEventListener("click", async () => {
    try {
      const response = await fetch("data/sample-resume.json");
      if (!response.ok) throw new Error("sample not found");
      renderResume(normalizeResume(await response.json()));
      flashStatus("Sample loaded");
    } catch {
      flashStatus("Could not load sample (use a local server)");
    }
  });
}

function saveAndCompile() {
  const resume = readForm();
  saveDraft(resume);
  updatePreview(resume);
  updateSectionStatuses(resume);
  flashStatus("Saved and compiled");
}

function initSectionToggles() {
  for (const header of document.querySelectorAll(".section-header")) {
    header.addEventListener("click", () => {
      const step = header.closest(".timeline-step");
      const sectionId = step?.getAttribute("data-section");
      if (!sectionId) return;
      const isExpanded = step.classList.contains("is-expanded");
      if (isExpanded) {
        collapseSection(sectionId);
      } else {
        expandSection(sectionId);
      }
    });
  }
  updateSectionStatuses(readForm());
}

/** @param {string} sectionId */
function expandSection(sectionId) {
  activeSection = sectionId;
  for (const step of document.querySelectorAll(".timeline-step")) {
    const id = step.getAttribute("data-section");
    const expanded = id === sectionId;
    step.classList.toggle("is-expanded", expanded);
    const header = step.querySelector(".section-header");
    const body = step.querySelector(".section-body");
    if (header) header.setAttribute("aria-expanded", String(expanded));
    if (body) body.hidden = !expanded;
  }
}

/** @param {string} sectionId */
function collapseSection(sectionId) {
  const step = document.querySelector(`.timeline-step[data-section="${sectionId}"]`);
  if (!step) return;
  step.classList.remove("is-expanded");
  const header = step.querySelector(".section-header");
  const body = step.querySelector(".section-body");
  if (header) header.setAttribute("aria-expanded", "false");
  if (body) body.hidden = true;
}

function goToNextSection() {
  const idx = SECTION_ORDER.indexOf(activeSection);
  if (idx >= 0 && idx < SECTION_ORDER.length - 1) {
    expandSection(SECTION_ORDER[idx + 1]);
    const nextStep = document.querySelector(`.timeline-step[data-section="${SECTION_ORDER[idx + 1]}"]`);
    nextStep?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** @param {import("./resume.js").Resume} resume */
function updateSectionStatuses(resume) {
  const checks = {
    personal: Boolean(resume.header.name && resume.header.email),
    skills: Boolean(resume.skills),
    projects: resume.projects.filter((p) => p.name || p.bullets.some(Boolean)).length,
    experience: resume.experience.filter((j) => j.title || j.company || j.bullets.some(Boolean)).length,
    education: Boolean(resume.education.school),
  };

  const statusText = {
    personal: checks.personal ? "Looks Good ✓" : "Add your contact details",
    skills: checks.skills ? "Looks Good ✓" : "Add your technical skills",
    projects: checks.projects > 0 ? `${checks.projects} project${checks.projects > 1 ? "s" : ""} added ✓` : "0 projects added",
    experience: checks.experience > 0 ? `${checks.experience} role${checks.experience > 1 ? "s" : ""} added ✓` : "Add jobs and internships",
    education: checks.education ? "Looks Good ✓" : "Add academic background",
  };

  for (const [section, complete] of Object.entries(checks)) {
    const step = document.querySelector(`.timeline-step[data-section="${section}"]`);
    step?.classList.toggle("is-complete", Boolean(complete));

    const statusEl = document.querySelector(`[data-status-for="${section}"]`);
    if (statusEl) {
      statusEl.textContent = statusText[section];
      statusEl.classList.toggle("is-good", Boolean(complete));
    }
  }
}

/** @param {import("./resume.js").Resume} resume */
function renderResume(resume) {
  setField("header.name", resume.header.name);
  setField("header.location", resume.header.location);
  setField("header.email", resume.header.email);
  setField("header.gender", resume.header.gender ?? "");
  setPhoneFields(resume.header.phone);
  setField("summary", resume.summary);
  setField("skills", resume.skills);
  setField("education.school", resume.education.school);
  setField("education.degree", resume.education.degree);
  setField("education.year", resume.education.year);

  linksContainer.replaceChildren();
  const links = resume.header.links.length ? resume.header.links : [""];
  for (const link of links) addLinkRow(link);

  experienceContainer.replaceChildren();
  for (const job of resume.experience) addJobCard(job);

  projectsContainer.replaceChildren();
  for (const project of resume.projects) addProjectCard(project);

  updatePreview(resume);
  updateSectionStatuses(resume);
}

/** @param {string} phone */
function setPhoneFields(phone) {
  const codes = ["+91", "+1", "+44", "+61", "+49"];
  let code = "+91";
  let number = phone;

  for (const c of codes) {
    if (phone.startsWith(c)) {
      code = c;
      number = phone.slice(c.length).trim();
      break;
    }
  }

  setField("header.phoneCode", code);
  setField("header.phoneNumber", number);
}

/** @param {string} name @param {string} value */
function setField(name, value) {
  const field = form.elements.namedItem(name);
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
    field.value = value;
  }
}

/** @param {string} url */
function detectLinkType(url) {
  const lower = url.toLowerCase();
  if (lower.includes("linkedin.com")) return "linkedin";
  if (lower.includes("github.com")) return "github";
  return "website";
}

/** @param {string} type */
function linkTypeLabel(type) {
  if (type === "linkedin") return "LinkedIn";
  if (type === "github") return "GitHub";
  return "Website";
}

/** @param {HTMLElement} iconEl @param {string} type */
function renderLinkIcon(iconEl, type) {
  iconEl.setAttribute("data-icon", type);
  iconEl.innerHTML = LINK_ICONS[type] ?? LINK_ICONS.website;
}

/** @param {string} value */
function addLinkRow(value) {
  const node = linkTemplate.content.firstElementChild?.cloneNode(true);
  if (!(node instanceof HTMLElement)) return;

  const input = node.querySelector('input[type="url"]');
  const iconEl = node.querySelector(".social-link-icon");
  const labelEl = node.querySelector(".social-link-label");

  if (input) input.value = value;

  const type = detectLinkType(value);
  if (iconEl instanceof HTMLElement) renderLinkIcon(iconEl, type);
  if (labelEl) labelEl.textContent = linkTypeLabel(type);

  input?.addEventListener("input", () => {
    const t = detectLinkType(input.value);
    if (iconEl instanceof HTMLElement) renderLinkIcon(iconEl, t);
    if (labelEl) labelEl.textContent = linkTypeLabel(t);
    scheduleAutosave();
  });

  node.querySelector(".remove-btn")?.addEventListener("click", () => {
    node.remove();
    scheduleAutosave();
  });

  linksContainer.appendChild(node);
}

/** @param {import("./resume.js").Job} job */
function addJobCard(job) {
  const node = jobTemplate.content.firstElementChild?.cloneNode(true);
  if (!(node instanceof HTMLElement)) return;

  /** @type {HTMLInputElement | null} */
  const title = node.querySelector('[data-field="title"]');
  /** @type {HTMLInputElement | null} */
  const company = node.querySelector('[data-field="company"]');
  /** @type {HTMLInputElement | null} */
  const dates = node.querySelector('[data-field="dates"]');
  const bulletsEl = node.querySelector("[data-bullets]");

  if (title) title.value = job.title;
  if (company) company.value = job.company;
  if (dates) dates.value = job.dates;

  node.querySelector(".card-header h3").textContent =
    job.title || job.company || "Role";

  title?.addEventListener("input", () => {
    node.querySelector(".card-header h3").textContent =
      title.value || company?.value || "Role";
    scheduleAutosave();
  });
  company?.addEventListener("input", scheduleAutosave);
  dates?.addEventListener("input", scheduleAutosave);

  if (bulletsEl instanceof HTMLElement) {
    bulletsEl.replaceChildren();
    const bullets = job.bullets.length ? job.bullets : [""];
    for (const bullet of bullets) addBulletRow(bulletsEl, bullet);
  }

  node.querySelector(".add-bullet-btn")?.addEventListener("click", () => {
    if (bulletsEl instanceof HTMLElement) addBulletRow(bulletsEl, "");
    scheduleAutosave();
  });

  node.querySelector(".remove-btn")?.addEventListener("click", () => {
    node.remove();
    scheduleAutosave();
  });

  experienceContainer.appendChild(node);
}

/** @param {import("./resume.js").Project} project */
function addProjectCard(project) {
  const node = projectTemplate.content.firstElementChild?.cloneNode(true);
  if (!(node instanceof HTMLElement)) return;

  /** @type {HTMLInputElement | null} */
  const name = node.querySelector('[data-field="name"]');
  /** @type {HTMLInputElement | null} */
  const url = node.querySelector('[data-field="url"]');
  const bulletsEl = node.querySelector("[data-bullets]");

  if (name) name.value = project.name;
  if (url) url.value = project.url;

  node.querySelector(".card-header h3").textContent = project.name || "Project";

  name?.addEventListener("input", () => {
    node.querySelector(".card-header h3").textContent = name.value || "Project";
    scheduleAutosave();
  });
  url?.addEventListener("input", scheduleAutosave);

  if (bulletsEl instanceof HTMLElement) {
    bulletsEl.replaceChildren();
    const bullets = project.bullets.length ? project.bullets : [""];
    for (const bullet of bullets) addBulletRow(bulletsEl, bullet);
  }

  node.querySelector(".add-bullet-btn")?.addEventListener("click", () => {
    if (bulletsEl instanceof HTMLElement) addBulletRow(bulletsEl, "");
    scheduleAutosave();
  });

  node.querySelector(".remove-btn")?.addEventListener("click", () => {
    node.remove();
    scheduleAutosave();
  });

  projectsContainer.appendChild(node);
}

/** @param {HTMLElement} container @param {string} value */
function addBulletRow(container, value) {
  const node = bulletTemplate.content.firstElementChild?.cloneNode(true);
  if (!(node instanceof HTMLElement)) return;
  const input = node.querySelector("input");
  if (input) input.value = value;
  input?.addEventListener("input", scheduleAutosave);
  node.querySelector(".remove-btn")?.addEventListener("click", () => {
    node.remove();
    scheduleAutosave();
  });
  container.appendChild(node);
}

function readForm() {
  const resume = emptyResume();
  resume.header.name = getField("header.name");
  resume.header.location = getField("header.location");
  resume.header.email = getField("header.email");
  resume.header.gender = getField("header.gender");

  const phoneCode = getField("header.phoneCode");
  const phoneNumber = getField("header.phoneNumber");
  resume.header.phone = phoneNumber ? `${phoneCode} ${phoneNumber}` : "";

  resume.summary = getField("summary");
  resume.skills = getField("skills");
  resume.education.school = getField("education.school");
  resume.education.degree = getField("education.degree");
  resume.education.year = getField("education.year");

  resume.header.links = [...linksContainer.querySelectorAll('input[type="url"]')]
    .map((input) => input.value.trim())
    .filter(Boolean);

  resume.experience = [...experienceContainer.querySelectorAll(".card")].map((card) => ({
    title: card.querySelector('[data-field="title"]')?.value.trim() ?? "",
    company: card.querySelector('[data-field="company"]')?.value.trim() ?? "",
    dates: card.querySelector('[data-field="dates"]')?.value.trim() ?? "",
    bullets: [...card.querySelectorAll("[data-bullets] input")]
      .map((input) => input.value.trim())
      .filter(Boolean),
  }));

  resume.projects = [...projectsContainer.querySelectorAll(".card")].map((card) => ({
    name: card.querySelector('[data-field="name"]')?.value.trim() ?? "",
    url: card.querySelector('[data-field="url"]')?.value.trim() ?? "",
    bullets: [...card.querySelectorAll("[data-bullets] input")]
      .map((input) => input.value.trim())
      .filter(Boolean),
  }));

  return normalizeResume(resume);
}

/** @param {string} name */
function getField(name) {
  const field = form.elements.namedItem(name);
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
    return field.value.trim();
  }
  return "";
}

/** @param {import("./resume.js").Resume} resume */
function updatePreview(resume) {
  const cleaned = resumeToJson(resume);
  previewEl.innerHTML = renderPreviewHtml(cleaned);
  jsonPreviewEl.textContent = JSON.stringify(cleaned, null, 2);
}

function renderPreviewHtml(resume) {
  const contact = [
    escapeHtml(resume.header.location),
    escapeHtml(resume.header.phone),
    resume.header.email
      ? `<a href="mailto:${escapeHtml(resume.header.email)}">${escapeHtml(resume.header.email)}</a>`
      : "",
    ...resume.header.links.map(
      (url) => `<a href="${escapeHtml(url)}">${escapeHtml(linkLabel(url))}</a>`
    ),
  ]
    .filter(Boolean)
    .join(" · ");

  const jobs = resume.experience
    .filter((job) => job.title || job.company || job.bullets.length)
    .map(
      (job) => `
      <div class="entry">
        <div class="entry-header">
          <div>${escapeHtml(job.title)}</div>
          <div>${escapeHtml(job.dates)}</div>
        </div>
        <div class="entry-subtitle">${escapeHtml(job.company)}</div>
        <ul>${job.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>
      </div>`
    )
    .join("");

  const projects = resume.projects
    .filter((p) => p.name || p.url || p.bullets.length)
    .map(
      (project) => `
      <div class="entry">
        <div class="entry-header"><div>${escapeHtml(project.name)}</div></div>
        <div class="entry-subtitle">${project.url ? `<a href="${escapeHtml(project.url)}">${escapeHtml(project.url)}</a>` : ""}</div>
        <ul>${project.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>
      </div>`
    )
    .join("");

  return `
    <h1>${escapeHtml(resume.header.name || "Your Name")}</h1>
    <div class="contact">${contact}</div>
    <div class="section">
      <div class="section-title">Professional Summary</div>
      <p>${escapeHtml(resume.summary)}</p>
    </div>
    <div class="section">
      <div class="section-title">Skills</div>
      <p>${escapeHtml(resume.skills)}</p>
    </div>
    <div class="section">
      <div class="section-title">Experience</div>
      ${jobs}
    </div>
    <div class="section">
      <div class="section-title">Projects</div>
      ${projects}
    </div>
    <div class="section">
      <div class="section-title">Education</div>
      <div class="entry-header">
        <div><strong>${escapeHtml(resume.education.school)}</strong><br />${escapeHtml(resume.education.degree)}</div>
        <div>${escapeHtml(resume.education.year)}</div>
      </div>
    </div>
  `;
}

/** @param {string} text */
function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** @param {string} url */
function linkLabel(url) {
  const cleaned = url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
  if (/^github\.com/i.test(cleaned)) return "GitHub";
  if (/^linkedin\.com/i.test(cleaned)) return "LinkedIn";
  return cleaned.split("/")[0] || url;
}

/** @param {string} text */
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "resume";
}

function scheduleAutosave() {
  if (autosaveTimer) clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    const resume = readForm();
    saveDraft(resume);
    updatePreview(resume);
    updateSectionStatuses(resume);
    flashStatus("Draft saved locally");
  }, 250);
}

/** @param {string} message */
function flashStatus(message) {
  autosaveStatus.textContent = message;
}
