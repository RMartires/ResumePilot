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

/** @type {ReturnType<typeof setTimeout> | null} */
let autosaveTimer = null;

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

/** @param {import("./resume.js").Resume} resume */
function renderResume(resume) {
  setField("header.name", resume.header.name);
  setField("header.location", resume.header.location);
  setField("header.phone", resume.header.phone);
  setField("header.email", resume.header.email);
  setField("summary", resume.summary);
  setField("skills", resume.skills);
  setField("education.school", resume.education.school);
  setField("education.degree", resume.education.degree);
  setField("education.year", resume.education.year);

  linksContainer.replaceChildren();
  for (const link of resume.header.links.length ? resume.header.links : [""]) {
    addLinkRow(link);
  }

  experienceContainer.replaceChildren();
  for (const job of resume.experience) addJobCard(job);

  projectsContainer.replaceChildren();
  for (const project of resume.projects) addProjectCard(project);

  updatePreview(resume);
}

/** @param {string} name @param {string} value */
function setField(name, value) {
  const field = form.elements.namedItem(name);
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
    field.value = value;
  }
}

/** @param {string} value */
function addLinkRow(value) {
  const node = linkTemplate.content.firstElementChild?.cloneNode(true);
  if (!(node instanceof HTMLElement)) return;
  const input = node.querySelector("input");
  if (input) input.value = value;
  node.querySelector(".remove-btn")?.addEventListener("click", () => {
    node.remove();
    scheduleAutosave();
  });
  input?.addEventListener("input", scheduleAutosave);
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
  resume.header.phone = getField("header.phone");
  resume.header.email = getField("header.email");
  resume.summary = getField("summary");
  resume.skills = getField("skills");
  resume.education.school = getField("education.school");
  resume.education.degree = getField("education.degree");
  resume.education.year = getField("education.year");

  resume.header.links = [...linksContainer.querySelectorAll("input")]
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
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
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
    .join(" | ");

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
    flashStatus("Draft saved locally");
  }, 250);
}

/** @param {string} message */
function flashStatus(message) {
  autosaveStatus.textContent = message;
}
