import {
  POPULAR_SKILLS,
  parseSkillsString,
  serializeSkills,
  parseSkillInput,
  skillLabel,
  hasSkill,
} from "./skills.js";
import {
  parseJobDates,
  serializeJobDates,
  collapsedJobSubtitle,
} from "./experience.js";
import {
  emptyJob,
  emptyProject,
  emptyResume,
  emptyEducationEntry,
  loadDraft,
  normalizeResume,
  resumeToJson,
  saveDraft,
  downloadJson,
} from "./resume.js";
import { downloadPreviewPdf } from "./pdf.js";

const form = document.getElementById("resume-form");
const customLinksContainer = document.getElementById("custom-links-container");
const selectedSkillsEl = document.getElementById("selected-skills");
const popularSkillsEl = document.getElementById("popular-skills");
const selectedSkillsEmptyEl = document.getElementById("selected-skills-empty");
const skillSearchInput = /** @type {HTMLInputElement | null} */ (document.getElementById("skill-search"));
const skillSuggestionsEl = document.getElementById("skill-suggestions");
const skillsGroupToggle = /** @type {HTMLInputElement | null} */ (document.getElementById("skills-group-toggle"));
const experienceContainer = document.getElementById("experience-container");
const projectsContainer = document.getElementById("projects-container");
const educationContainer = document.getElementById("education-container");
const previewEl = document.getElementById("resume-preview");
const jsonPreviewEl = document.getElementById("json-preview");
const autosaveStatus = document.getElementById("autosave-status");

const customLinkTemplate = /** @type {HTMLTemplateElement} */ (
  document.getElementById("custom-link-template")
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
const educationEntryTemplate = /** @type {HTMLTemplateElement} */ (
  document.getElementById("education-entry-template")
);

const SECTION_ORDER = ["personal", "skills", "projects", "experience", "education"];

const LINK_ICONS = {
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
  website: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
};

const PLATFORM_FROM_URL = [
  { match: /leetcode\.com/i, platform: "leetcode" },
  { match: /scaler\.com/i, platform: "scaler" },
  { match: /(twitter|x)\.com/i, platform: "twitter" },
  { match: /codeforces\.com/i, platform: "codeforces" },
];

/** @type {ReturnType<typeof setTimeout> | null} */
let autosaveTimer = null;

/** @type {import("./skills.js").SkillEntry[]} */
let selectedSkills = [];

/** @type {number} */
let suggestionActiveIndex = -1;

/** @type {string} */
let activeSection = "personal";

init();

function init() {
  const draft = loadDraft();
  renderResume(draft ?? emptyResume());

  form.addEventListener("input", scheduleAutosave);
  form.addEventListener("change", scheduleAutosave);

  document.querySelector(".add-link-btn")?.addEventListener("click", () => {
    addCustomProfileRow("leetcode", "");
    scheduleAutosave();
  });

  document.getElementById("add-job-btn")?.addEventListener("click", () => {
    for (const card of experienceContainer.querySelectorAll(".experience-card")) {
      card.classList.remove("is-expanded");
      card.querySelector(".experience-card-header-main")?.setAttribute("aria-expanded", "false");
    }
    addJobCard(emptyJob(), { expanded: true });
    scheduleAutosave();
  });

  document.getElementById("add-project-btn")?.addEventListener("click", () => {
    for (const card of projectsContainer.querySelectorAll(".project-card")) {
      card.classList.remove("is-expanded");
      card.querySelector(".project-card-header-main")?.setAttribute("aria-expanded", "false");
    }
    addProjectCard(emptyProject(), { expanded: true });
    scheduleAutosave();
  });

  document.getElementById("export-json-btn")?.addEventListener("click", () => {
    const resume = readForm();
    const slug = slugify(resume.header.name || "resume");
    downloadJson(resume, `${slug}.json`);
    flashStatus("JSON exported");
  });

  document.getElementById("export-pdf-btn")?.addEventListener("click", async () => {
    const btn = document.getElementById("export-pdf-btn");
    if (!previewEl || !btn) return;
    const resume = readForm();
    const slug = slugify(resume.header.name || "resume");

    btn.disabled = true;
    flashStatus("Generating PDF…");
    try {
      await downloadPreviewPdf(previewEl, `${slug}.pdf`);
      flashStatus("PDF downloaded");
    } catch (err) {
      console.error(err);
      flashStatus("PDF export failed");
    } finally {
      btn.disabled = false;
    }
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
  initSocialPrefixIcons();
  initSkillsUI();
  initEducationUI();

  document.getElementById("load-json-input")?.addEventListener("change", async (event) => {
    const input = /** @type {HTMLInputElement} */ (event.target);
    const file = input.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      renderResume(normalizeResume(JSON.parse(text)));
      flashStatus(`Imported ${file.name}`);
    } catch {
      flashStatus("Invalid JSON file");
    } finally {
      input.value = "";
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
    updatePersonalHeaderVisibility(step, expanded);
    updateSkillsHeaderVisibility(step, expanded);
    updateProjectsHeaderVisibility(step, expanded);
    updateExperienceHeaderVisibility(step, expanded);
    updateEducationHeaderVisibility(step, expanded);
  }
}

/** @param {Element} step @param {boolean} expanded */
function updatePersonalHeaderVisibility(step, expanded) {
  if (step.getAttribute("data-section") !== "personal") return;
  const subtitle = step.querySelector(".section-subtitle");
  const status = step.querySelector('[data-status-for="personal"]');
  if (subtitle) subtitle.hidden = !expanded;
  if (status) status.hidden = expanded;
}

/** @param {Element} step @param {boolean} expanded */
function updateSkillsHeaderVisibility(step, expanded) {
  if (step.getAttribute("data-section") !== "skills") return;
  const subtitle = step.querySelector(".section-subtitle");
  const status = step.querySelector('[data-status-for="skills"]');
  const badge = step.querySelector('[data-badge-for="skills"]');
  if (subtitle) subtitle.hidden = !expanded;
  if (status) status.hidden = expanded;
  if (badge instanceof HTMLElement) badge.hidden = !expanded || selectedSkills.length === 0;
}

/** @param {Element} step @param {boolean} expanded */
function updateProjectsHeaderVisibility(step, expanded) {
  if (step.getAttribute("data-section") !== "projects") return;
  const subtitle = step.querySelector(".section-subtitle");
  const status = step.querySelector('[data-status-for="projects"]');
  const badge = step.querySelector('[data-badge-for="projects"]');
  const count = countCompleteProjects();
  if (subtitle) subtitle.hidden = !expanded;
  if (status) status.hidden = expanded;
  if (badge instanceof HTMLElement) badge.hidden = !expanded || count === 0;
}

function countCompleteProjects() {
  return [...projectsContainer.querySelectorAll(".project-card")].filter((card) => {
    const nameEl = card.querySelector('[data-field="name"]');
    const name = nameEl instanceof HTMLInputElement ? nameEl.value.trim() : "";
    const bullets = extractBulletsFromEditor(card.querySelector('[data-field="bullets"]'));
    return Boolean(name && bullets.length);
  }).length;
}

/** @param {Element} step @param {boolean} expanded */
function updateExperienceHeaderVisibility(step, expanded) {
  if (step.getAttribute("data-section") !== "experience") return;
  const subtitle = step.querySelector(".section-subtitle");
  const status = step.querySelector('[data-status-for="experience"]');
  const badge = step.querySelector('[data-badge-for="experience"]');
  const count = countCompleteExperience();
  if (subtitle) subtitle.hidden = !expanded;
  if (status) status.hidden = expanded;
  if (badge instanceof HTMLElement) badge.hidden = !expanded || count === 0;
}

function countCompleteExperience() {
  return readExperienceFromDom().filter((job) => job.company && job.bullets.length).length;
}

/** @param {Element} step @param {boolean} expanded */
function updateEducationHeaderVisibility(step, expanded) {
  if (step.getAttribute("data-section") !== "education") return;
  const subtitle = step.querySelector(".section-subtitle");
  const status = step.querySelector('[data-status-for="education"]');
  const badge = step.querySelector('[data-badge-for="education"]');
  const complete = Boolean(readEducationFromDom().school);
  if (subtitle) subtitle.hidden = !expanded;
  if (status) status.hidden = expanded;
  if (badge instanceof HTMLElement) badge.hidden = !expanded || !complete;
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
  updatePersonalHeaderVisibility(step, false);
  updateSkillsHeaderVisibility(step, false);
  updateProjectsHeaderVisibility(step, false);
  updateExperienceHeaderVisibility(step, false);
  updateEducationHeaderVisibility(step, false);
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
    personal: Boolean(resume.header.name && resume.header.email && resume.header.links.some((l) => /linkedin\.com/i.test(l))),
    skills: selectedSkills.length > 0,
    projects: resume.projects.filter((p) => p.name || p.bullets.some(Boolean)).length,
    experience: resume.experience.filter((j) => j.company && j.bullets.some(Boolean)).length,
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

    const badge = document.querySelector(`[data-badge-for="${section}"]`);
    if (badge instanceof HTMLElement) {
      const stepEl = document.querySelector(`.timeline-step[data-section="${section}"]`);
      const expanded = stepEl?.classList.contains("is-expanded") ?? false;
      badge.hidden = !complete || !expanded;
    }

    if (section === "skills") {
      const skillsStep = document.querySelector('.timeline-step[data-section="skills"]');
      if (skillsStep?.classList.contains("is-expanded")) {
        updateSkillsHeaderVisibility(skillsStep, true);
      }
    }

    if (section === "projects") {
      const projectsStep = document.querySelector('.timeline-step[data-section="projects"]');
      if (projectsStep?.classList.contains("is-expanded")) {
        updateProjectsHeaderVisibility(projectsStep, true);
      }
    }

    if (section === "experience") {
      const experienceStep = document.querySelector('.timeline-step[data-section="experience"]');
      if (experienceStep?.classList.contains("is-expanded")) {
        updateExperienceHeaderVisibility(experienceStep, true);
      }
    }

    if (section === "education") {
      const educationStep = document.querySelector('.timeline-step[data-section="education"]');
      if (educationStep?.classList.contains("is-expanded")) {
        updateEducationHeaderVisibility(educationStep, true);
      }
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
  loadSkillsFromString(resume.skills);
  renderEducation(resume.education);

  renderSocialFields(resume.header.links);

  experienceContainer.replaceChildren();
  const jobs = resume.experience.filter((j) => j.title || j.company || j.bullets.some(Boolean));
  const jobList = jobs.length ? jobs : [emptyJob()];
  for (const [idx, job] of jobList.entries()) {
    addJobCard(job, { expanded: idx === 0 });
  }
  renumberExperienceCards();

  projectsContainer.replaceChildren();
  const projects = resume.projects.filter((p) => p.name || p.url || p.bullets.some(Boolean));
  const list = projects.length ? projects : [emptyProject()];
  for (const [idx, project] of list.entries()) {
    addProjectCard(project, { expanded: idx === 0 });
  }
  renumberProjectCards();

  updatePreview(resume);
  updateSectionStatuses(resume);
}

/** @param {string[]} links */
function renderSocialFields(links) {
  let linkedin = "";
  let github = "";
  let website = "";
  const custom = [];

  for (const url of links) {
    const type = detectLinkType(url);
    if (type === "linkedin" && !linkedin) linkedin = url;
    else if (type === "github" && !github) github = url;
    else if (type === "website" && !website && !isCustomPlatformUrl(url)) website = url;
    else if (url) custom.push(url);
  }

  setField("social.linkedin", linkedin);
  setField("social.github", github);
  setField("social.website", website);

  customLinksContainer.replaceChildren();
  for (const url of custom) {
    const platform = detectPlatformFromUrl(url);
    addCustomProfileRow(platform, url);
  }
}

/** @param {string} url */
function isCustomPlatformUrl(url) {
  return PLATFORM_FROM_URL.some(({ match }) => match.test(url));
}

/** @param {string} url */
function detectPlatformFromUrl(url) {
  for (const { match, platform } of PLATFORM_FROM_URL) {
    if (match.test(url)) return platform;
  }
  return "other";
}

function initSocialPrefixIcons() {
  for (const wrap of document.querySelectorAll(".input-with-icon")) {
    const type = wrap.getAttribute("data-icon") ?? "website";
    const iconEl = wrap.querySelector(".input-prefix-icon");
    if (iconEl instanceof HTMLElement) renderLinkIcon(iconEl, type);
  }
}

function initSkillsUI() {
  renderPopularSkills();
  renderSelectedSkills();
  syncSkillsField();

  skillsGroupToggle?.addEventListener("change", () => {
    syncSkillsField();
    scheduleAutosave();
  });

  document.querySelector(".skills-help-link")?.addEventListener("click", () => {
    flashStatus("Curated list keeps resumes ATS-friendly and scannable");
  });

  skillSearchInput?.addEventListener("input", () => {
    suggestionActiveIndex = -1;
    renderSkillSuggestions(skillSearchInput.value);
  });

  skillSearchInput?.addEventListener("focus", () => {
    renderSkillSuggestions(skillSearchInput.value);
    skillSearchInput.setAttribute("aria-expanded", "true");
  });

  skillSearchInput?.addEventListener("keydown", (event) => {
    const items = [...(skillSuggestionsEl?.querySelectorAll("li") ?? [])];
    if (event.key === "ArrowDown") {
      event.preventDefault();
      suggestionActiveIndex = Math.min(suggestionActiveIndex + 1, items.length - 1);
      highlightSuggestion(items);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      suggestionActiveIndex = Math.max(suggestionActiveIndex - 1, 0);
      highlightSuggestion(items);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (suggestionActiveIndex >= 0 && items[suggestionActiveIndex]) {
        items[suggestionActiveIndex].click();
      } else {
        addSkillFromSearch(skillSearchInput.value);
      }
    } else if (event.key === "Escape") {
      hideSkillSuggestions();
    }
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) return;
    if (skillSearchInput?.contains(event.target)) return;
    if (skillSuggestionsEl?.contains(event.target)) return;
    hideSkillSuggestions();
  });
}

/** @param {string} raw */
function loadSkillsFromString(raw) {
  selectedSkills = parseSkillsString(raw);
  renderSelectedSkills();
  renderPopularSkills();
  syncSkillsField();
}

function syncSkillsField() {
  setField("skills", serializeSkills(selectedSkills, skillsGroupToggle?.checked ?? false));
}

function renderSelectedSkills() {
  if (!selectedSkillsEl) return;
  selectedSkillsEl.replaceChildren();

  if (selectedSkillsEmptyEl) {
    selectedSkillsEmptyEl.hidden = selectedSkills.length > 0;
  }

  for (const entry of selectedSkills) {
    const tag = document.createElement("span");
    tag.className = "skill-tag";
    tag.textContent = skillLabel(entry);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "skill-tag-remove";
    removeBtn.setAttribute("aria-label", `Remove ${entry.name}`);
    removeBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
    removeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      removeSkill(entry.name);
    });

    tag.appendChild(removeBtn);
    selectedSkillsEl.appendChild(tag);
  }

  renderPopularSkills();
}

function renderPopularSkills() {
  if (!popularSkillsEl) return;
  popularSkillsEl.replaceChildren();

  for (const name of POPULAR_SKILLS) {
    const tag = document.createElement("button");
    tag.type = "button";
    tag.className = "skill-tag";
    tag.textContent = name;
    tag.classList.toggle("is-selected", hasSkill(selectedSkills, name));
    tag.addEventListener("click", () => togglePopularSkill(name));
    popularSkillsEl.appendChild(tag);
  }
}

/** @param {string} name */
function togglePopularSkill(name) {
  if (hasSkill(selectedSkills, name)) removeSkill(name);
  else addSkill({ name, years: 1, category: undefined });
}

/** @param {import("./skills.js").SkillEntry} entry */
function addSkill(entry) {
  if (hasSkill(selectedSkills, entry.name)) return;
  selectedSkills.push({
    name: entry.name,
    years: entry.years ?? 1,
    category: entry.category,
  });
  renderSelectedSkills();
  syncSkillsField();
  scheduleAutosave();
}

/** @param {string} name */
function removeSkill(name) {
  selectedSkills = selectedSkills.filter((s) => s.name.toLowerCase() !== name.toLowerCase());
  renderSelectedSkills();
  syncSkillsField();
  scheduleAutosave();
}

/** @param {string} query */
function addSkillFromSearch(query) {
  const parsed = parseSkillInput(query);
  if (!parsed) return;
  addSkill(parsed);
  if (skillSearchInput) skillSearchInput.value = "";
  hideSkillSuggestions();
}

/** @param {string} query */
function renderSkillSuggestions(query) {
  if (!skillSuggestionsEl) return;
  const q = query.trim().toLowerCase();
  /** @type {string[]} */
  const matches = POPULAR_SKILLS.filter(
    (skill) => skill.toLowerCase().includes(q) && !hasSkill(selectedSkills, skill)
  ).slice(0, 8);

  skillSuggestionsEl.replaceChildren();
  suggestionActiveIndex = -1;

  if (!q && matches.length === 0) {
    hideSkillSuggestions();
    return;
  }

  for (const name of matches) {
    const item = document.createElement("li");
    item.textContent = name;
    item.setAttribute("role", "option");
    item.addEventListener("click", () => {
      addSkill({ name, years: 1 });
      if (skillSearchInput) skillSearchInput.value = "";
      hideSkillSuggestions();
    });
    skillSuggestionsEl.appendChild(item);
  }

  if (q && !hasSkill(selectedSkills, query.trim())) {
    const custom = document.createElement("li");
    custom.className = "is-custom";
    custom.setAttribute("role", "option");
    custom.textContent = `Add "${query.trim()}"`;
    custom.addEventListener("click", () => addSkillFromSearch(query));
    skillSuggestionsEl.appendChild(custom);
  }

  if (skillSuggestionsEl.children.length === 0) {
    hideSkillSuggestions();
    return;
  }

  skillSuggestionsEl.hidden = false;
}

/** @param {Element[]} items */
function highlightSuggestion(items) {
  for (const [idx, item] of items.entries()) {
    item.classList.toggle("is-active", idx === suggestionActiveIndex);
  }
  items[suggestionActiveIndex]?.scrollIntoView({ block: "nearest" });
}

function hideSkillSuggestions() {
  if (!skillSuggestionsEl || !skillSearchInput) return;
  skillSuggestionsEl.hidden = true;
  skillSuggestionsEl.replaceChildren();
  skillSearchInput.setAttribute("aria-expanded", "false");
  suggestionActiveIndex = -1;
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

/** @param {HTMLElement} iconEl @param {string} type */
function renderLinkIcon(iconEl, type) {
  iconEl.setAttribute("data-icon", type);
  iconEl.innerHTML = LINK_ICONS[type] ?? LINK_ICONS.website;
}

/** @param {string} platform @param {string} url */
function addCustomProfileRow(platform, url) {
  const node = customLinkTemplate.content.firstElementChild?.cloneNode(true);
  if (!(node instanceof HTMLElement)) return;

  const select = node.querySelector(".profile-platform");
  const input = node.querySelector(".profile-url");

  if (select instanceof HTMLSelectElement) select.value = platform;
  if (input instanceof HTMLInputElement) input.value = url;

  select?.addEventListener("change", scheduleAutosave);
  input?.addEventListener("input", scheduleAutosave);

  node.querySelector(".profile-remove")?.addEventListener("click", () => {
    node.remove();
    scheduleAutosave();
  });

  customLinksContainer.appendChild(node);
}

/** @param {import("./resume.js").Job} job @param {{ expanded?: boolean }} [opts] */
function addJobCard(job, opts = {}) {
  const node = jobTemplate.content.firstElementChild?.cloneNode(true);
  if (!(node instanceof HTMLElement)) return;

  const expanded = opts.expanded ?? false;
  node.classList.toggle("is-expanded", expanded);

  let startDate = job.startDate ?? "";
  let endDate = job.endDate ?? "";
  let current = Boolean(job.current);
  if (!startDate && !endDate && job.dates) {
    const parsed = parseJobDates(job.dates);
    startDate = parsed.startDate;
    endDate = parsed.endDate;
    current = parsed.current;
  }

  /** @type {HTMLInputElement | null} */
  const title = node.querySelector('[data-field="title"]');
  /** @type {HTMLInputElement | null} */
  const company = node.querySelector('[data-field="company"]');
  /** @type {HTMLInputElement | null} */
  const location = node.querySelector('[data-field="location"]');
  /** @type {HTMLInputElement | null} */
  const startDateEl = node.querySelector('[data-field="startDate"]');
  /** @type {HTMLInputElement | null} */
  const endDateEl = node.querySelector('[data-field="endDate"]');
  /** @type {HTMLInputElement | null} */
  const currentEl = node.querySelector('[data-field="current"]');
  /** @type {HTMLElement | null} */
  const editor = node.querySelector('[data-field="bullets"]');
  const headerMain = node.querySelector(".experience-card-header-main");
  const collapsedEl = node.querySelector(".experience-card-collapsed");
  const companyCollapsed = node.querySelector(".experience-card-company");
  const metaCollapsed = node.querySelector(".experience-card-meta");

  if (title) title.value = job.title;
  if (company) company.value = job.company;
  if (location) location.value = job.location ?? "";
  if (startDateEl) startDateEl.value = startDate;
  if (endDateEl) endDateEl.value = endDate;
  if (currentEl) currentEl.checked = current;
  if (editor) fillBulletsEditor(editor, job.bullets.filter(Boolean));
  if (headerMain) headerMain.setAttribute("aria-expanded", String(expanded));

  const syncCollapsed = () => {
    const jobData = readJobFromCard(node);
    if (companyCollapsed) companyCollapsed.textContent = jobData.company || "Untitled Company";
    if (metaCollapsed) metaCollapsed.textContent = collapsedJobSubtitle(jobData);
  };
  syncCollapsed();

  const syncEndDateState = () => {
    if (!endDateEl || !currentEl) return;
    endDateEl.disabled = currentEl.checked;
    if (currentEl.checked) endDateEl.value = "";
  };
  syncEndDateState();

  const onFieldChange = () => {
    syncCollapsed();
    scheduleAutosave();
  };

  title?.addEventListener("input", onFieldChange);
  company?.addEventListener("input", onFieldChange);
  location?.addEventListener("input", onFieldChange);
  startDateEl?.addEventListener("change", onFieldChange);
  endDateEl?.addEventListener("change", onFieldChange);
  currentEl?.addEventListener("change", () => {
    syncEndDateState();
    onFieldChange();
  });

  if (editor) {
    editor.addEventListener("input", onFieldChange);
    initRichTextToolbar(node);
  }

  const toggleExpand = () => {
    const isExpanded = node.classList.toggle("is-expanded");
    headerMain?.setAttribute("aria-expanded", String(isExpanded));
  };

  node.querySelector(".experience-card-header")?.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest(".experience-card-remove")) return;
    toggleExpand();
  });

  headerMain?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleExpand();
    }
  });

  node.querySelector(".experience-card-remove")?.addEventListener("click", (event) => {
    event.stopPropagation();
    node.remove();
    renumberExperienceCards();
    if (!experienceContainer.querySelector(".experience-card")) {
      addJobCard(emptyJob(), { expanded: true });
    }
    scheduleAutosave();
  });

  experienceContainer.appendChild(node);
  renumberExperienceCards();
}

function renumberExperienceCards() {
  for (const [idx, card] of [...experienceContainer.querySelectorAll(".experience-card")].entries()) {
    const indexEl = card.querySelector(".experience-card-index");
    if (indexEl) indexEl.textContent = `Work Experience ${idx + 1}`;
  }
}

/** @param {HTMLElement} card */
function readJobFromCard(card) {
  const titleEl = card.querySelector('[data-field="title"]');
  const companyEl = card.querySelector('[data-field="company"]');
  const locationEl = card.querySelector('[data-field="location"]');
  const startEl = card.querySelector('[data-field="startDate"]');
  const endEl = card.querySelector('[data-field="endDate"]');
  const currentEl = card.querySelector('[data-field="current"]');

  const startDate = startEl instanceof HTMLInputElement ? startEl.value : "";
  const endDate = endEl instanceof HTMLInputElement ? endEl.value : "";
  const current = currentEl instanceof HTMLInputElement ? currentEl.checked : false;

  return {
    title: titleEl instanceof HTMLInputElement ? titleEl.value.trim() : "",
    company: companyEl instanceof HTMLInputElement ? companyEl.value.trim() : "",
    location: locationEl instanceof HTMLInputElement ? locationEl.value.trim() : "",
    startDate,
    endDate,
    current,
    dates: serializeJobDates(startDate, endDate, current),
    bullets: extractBulletsFromEditor(card.querySelector('[data-field="bullets"]')),
  };
}

function readExperienceFromDom() {
  return [...experienceContainer.querySelectorAll(".experience-card")].map((card) => readJobFromCard(card));
}

function initEducationUI() {
  document.getElementById("add-secondary-education-btn")?.addEventListener("click", () => {
    for (const card of educationContainer.querySelectorAll(".education-card")) {
      card.classList.remove("is-expanded");
      card.querySelector(".education-card-header-main")?.setAttribute("aria-expanded", "false");
    }
    addEducationCard(emptyEducationEntry(), { expanded: true, isCustom: true });
    scheduleAutosave();
  });
}

/** @param {import("./resume.js").Education} education */
function renderEducation(education) {
  educationContainer.replaceChildren();
  const mapped = mapLegacyEducationFields(education);
  addEducationCard(entryFromPrimary(mapped), { expanded: true, isPrimary: true });

  for (const item of mapped.secondary) {
    addEducationCard(normalizeEducationEntryForUi(item), { expanded: false, isCustom: true });
  }

  renumberEducationCards();
}

/** @param {import("./resume.js").Education} education */
function entryFromPrimary(education) {
  return {
    school: education.school,
    degree: education.degree,
    fieldOfStudy: education.fieldOfStudy,
    year: education.year,
    graduationDate: education.graduationDate,
    marks: education.marks,
    marksType: education.marksType,
    description: education.description,
  };
}

/** @param {import("./resume.js").EducationEntry} item */
function normalizeEducationEntryForUi(item) {
  let degree = item.degree;
  let fieldOfStudy = item.fieldOfStudy;
  if (!fieldOfStudy && degree.includes("(")) {
    const parsed = parseLegacyDegree(degree);
    degree = parsed.degree;
    fieldOfStudy = parsed.fieldOfStudy;
  }
  let graduationDate = item.graduationDate;
  if (!graduationDate && item.year) {
    graduationDate = /^\d{4}$/.test(item.year) ? `${item.year}-01-01` : item.year;
  }
  return { ...item, degree, fieldOfStudy, graduationDate };
}

/** @param {import("./resume.js").EducationEntry} entry @param {{ expanded?: boolean, isPrimary?: boolean, isCustom?: boolean }} [opts] */
function addEducationCard(entry, opts = {}) {
  const node = educationEntryTemplate.content.firstElementChild?.cloneNode(true);
  if (!(node instanceof HTMLElement)) return;

  const expanded = opts.expanded ?? false;
  const isPrimary = opts.isPrimary ?? false;
  const isCustom = opts.isCustom ?? false;

  node.classList.toggle("is-expanded", expanded);
  node.classList.toggle("education-card-primary", isPrimary);
  node.classList.toggle("is-custom", isCustom);

  populateEducationCard(node, entry);
  bindEducationCard(node, { isPrimary });
  educationContainer.appendChild(node);
  renumberEducationCards();
}

/** @param {HTMLElement} card @param {import("./resume.js").EducationEntry} entry */
function populateEducationCard(card, entry) {
  setCardField(card, "school", entry.school);
  setCardField(card, "degree", entry.degree);
  setCardField(card, "fieldOfStudy", entry.fieldOfStudy);
  setCardField(card, "marks", entry.marks);
  setCardField(card, "marksType", entry.marksType || "CGPA");
  setCardField(card, "graduationDate", entry.graduationDate);
  const descEl = card.querySelector('[data-field="description"]');
  if (descEl instanceof HTMLElement) fillDescriptionEditor(descEl, entry.description);
}

/** @param {HTMLElement} card @param {{ isPrimary?: boolean }} opts */
function bindEducationCard(card, opts = {}) {
  const headerMain = card.querySelector(".education-card-header-main");
  initRichTextToolbar(card);

  const onChange = () => {
    updateEducationCardHeader(card);
    scheduleAutosave();
  };

  for (const el of card.querySelectorAll("[data-field]")) {
    if (el instanceof HTMLElement && el.isContentEditable) {
      el.addEventListener("input", onChange);
    } else {
      el.addEventListener("input", onChange);
      el.addEventListener("change", onChange);
    }
  }

  const toggleExpand = () => {
    const isExpanded = card.classList.toggle("is-expanded");
    headerMain?.setAttribute("aria-expanded", String(isExpanded));
  };

  card.querySelector(".education-card-header")?.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest(".education-card-remove")) return;
    toggleExpand();
  });

  headerMain?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleExpand();
    }
  });

  const removeBtn = card.querySelector(".education-card-remove");
  if (opts.isPrimary) {
    removeBtn?.addEventListener("click", (event) => {
      event.stopPropagation();
      populateEducationCard(card, emptyEducationEntry());
      updateEducationCardHeader(card);
      scheduleAutosave();
    });
  } else {
    removeBtn?.addEventListener("click", (event) => {
      event.stopPropagation();
      card.remove();
      renumberEducationCards();
      scheduleAutosave();
    });
  }

  headerMain?.setAttribute("aria-expanded", String(card.classList.contains("is-expanded")));
}

/** @param {HTMLElement} card */
function updateEducationCardHeader(card) {
  const schoolEl = card.querySelector(".education-card-school");
  const school = getCardField(card, "school");
  if (schoolEl) schoolEl.textContent = school || "University";
}

function renumberEducationCards() {
  const cards = [...educationContainer.querySelectorAll(".education-card")];
  for (const [idx, card] of cards.entries()) {
    const indexEl = card.querySelector(".education-card-index");
    const customLabel = card.querySelector(".education-card-custom-label");
    const isPrimary = idx === 0;

    card.classList.toggle("education-card-primary", isPrimary);
    card.classList.toggle("is-custom", !isPrimary);

    if (indexEl) indexEl.textContent = `Education ${idx + 1}`;
    if (customLabel instanceof HTMLElement) customLabel.hidden = isPrimary;
    if (indexEl instanceof HTMLElement) indexEl.hidden = !isPrimary;

    updateEducationCardHeader(card);
  }
}

/** @param {import("./resume.js").Education} education */
function mapLegacyEducationFields(education) {
  let degree = education.degree;
  let fieldOfStudy = education.fieldOfStudy;

  if (!fieldOfStudy && degree.includes("(")) {
    const parsed = parseLegacyDegree(degree);
    degree = parsed.degree;
    fieldOfStudy = parsed.fieldOfStudy;
  }

  if (!degree && fieldOfStudy) degree = "";

  let graduationDate = education.graduationDate;
  if (!graduationDate && education.year) {
    graduationDate = /^\d{4}$/.test(education.year) ? `${education.year}-01-01` : education.year;
  }

  return { ...education, degree, fieldOfStudy, graduationDate };
}

/** @param {string} degreeStr */
function parseLegacyDegree(degreeStr) {
  const match = degreeStr.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (!match) return { degree: degreeStr, fieldOfStudy: "" };

  const left = match[1].trim();
  const fieldOfStudy = match[2].trim();
  let degree = "Other";

  if (/b\.?\s*e|b\.?\s*tech|bs\b/i.test(left)) degree = "BE/B.Tech/BS";
  else if (/m\.?\s*e|m\.?\s*tech|ms\b/i.test(left)) degree = "ME/M.Tech/MS";
  else if (/mba/i.test(left)) degree = "MBA";
  else if (/ph\.?d/i.test(left)) degree = "PhD";
  else if (/diploma/i.test(left)) degree = "Diploma";

  return { degree, fieldOfStudy };
}

/** @param {HTMLElement} card @param {string} field @param {string} value */
function setCardField(card, field, value) {
  const el = card.querySelector(`[data-field="${field}"]`);
  if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
    el.value = value;
  }
}

/** @param {HTMLElement} card @param {string} field */
function getCardField(card, field) {
  const el = card.querySelector(`[data-field="${field}"]`);
  if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
    return el.value.trim();
  }
  if (el instanceof HTMLElement && el.isContentEditable) {
    return el.innerText.trim();
  }
  return "";
}

/** @param {HTMLElement} el @param {string} text */
function fillDescriptionEditor(el, text) {
  el.innerHTML = text ? `<p>${escapeHtml(text)}</p>` : "";
}

function readEducationFromDom() {
  const education = emptyResume().education;
  const cards = [...educationContainer.querySelectorAll(".education-card")];
  if (!cards.length) return education;

  const primary = readEducationEntryFromCard(cards[0]);
  education.school = primary.school;
  education.degree = primary.degree;
  education.fieldOfStudy = primary.fieldOfStudy;
  education.marks = primary.marks;
  education.marksType = primary.marksType;
  education.graduationDate = primary.graduationDate;
  education.year = primary.year;
  education.description = primary.description;

  education.secondary = cards.slice(1).map((card) => readEducationEntryFromCard(card));
  return education;
}

/** @param {HTMLElement} card */
function readEducationEntryFromCard(card) {
  const graduationDate = getCardField(card, "graduationDate");
  return {
    school: getCardField(card, "school"),
    degree: getCardField(card, "degree"),
    fieldOfStudy: getCardField(card, "fieldOfStudy"),
    marks: getCardField(card, "marks"),
    marksType: getCardField(card, "marksType") || "CGPA",
    graduationDate,
    year: graduationDate ? graduationDate.slice(0, 4) : "",
    description: getCardField(card, "description"),
  };
}

/** @param {import("./resume.js").Project} project @param {{ expanded?: boolean }} [opts] */
function addProjectCard(project, opts = {}) {
  const node = projectTemplate.content.firstElementChild?.cloneNode(true);
  if (!(node instanceof HTMLElement)) return;

  const expanded = opts.expanded ?? false;
  node.classList.toggle("is-expanded", expanded);

  /** @type {HTMLInputElement | null} */
  const name = node.querySelector('[data-field="name"]');
  /** @type {HTMLInputElement | null} */
  const url = node.querySelector('[data-field="url"]');
  /** @type {HTMLElement | null} */
  const editor = node.querySelector('[data-field="bullets"]');
  const titleCollapsed = node.querySelector(".project-card-title-collapsed");
  const headerMain = node.querySelector(".project-card-header-main");

  if (name) name.value = project.name;
  if (url) url.value = project.url;
  if (editor) fillBulletsEditor(editor, project.bullets.filter(Boolean));
  if (titleCollapsed) titleCollapsed.textContent = project.name || "Untitled Project";
  if (headerMain) headerMain.setAttribute("aria-expanded", String(expanded));

  name?.addEventListener("input", () => {
    if (titleCollapsed) titleCollapsed.textContent = name.value || "Untitled Project";
    scheduleAutosave();
  });
  url?.addEventListener("input", scheduleAutosave);

  if (editor) {
    editor.addEventListener("input", scheduleAutosave);
    initRichTextToolbar(node);
  }

  const toggleExpand = () => {
    const isExpanded = node.classList.toggle("is-expanded");
    headerMain?.setAttribute("aria-expanded", String(isExpanded));
  };

  node.querySelector(".project-card-header")?.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest(".project-card-remove")) return;
    toggleExpand();
  });

  headerMain?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleExpand();
    }
  });

  node.querySelector(".project-card-remove")?.addEventListener("click", (event) => {
    event.stopPropagation();
    node.remove();
    renumberProjectCards();
    if (!projectsContainer.querySelector(".project-card")) {
      addProjectCard(emptyProject(), { expanded: true });
    }
    scheduleAutosave();
  });

  projectsContainer.appendChild(node);
  renumberProjectCards();
}

function renumberProjectCards() {
  for (const [idx, card] of [...projectsContainer.querySelectorAll(".project-card")].entries()) {
    const indexEl = card.querySelector(".project-card-index");
    if (indexEl) indexEl.textContent = `Project ${idx + 1}`;
  }
}

/** @param {HTMLElement} card */
function initRichTextToolbar(card) {
  const editor = card.querySelector(".rte-editor");
  const blockSelect = card.querySelector(".rte-block-select");
  if (!(editor instanceof HTMLElement)) return;

  for (const btn of card.querySelectorAll(".rte-btn")) {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const cmd = btn.getAttribute("data-cmd");
      if (!cmd) return;
      editor.focus();
      if (cmd === "createLink") {
        const url = window.prompt("Enter URL");
        if (url) document.execCommand(cmd, false, url);
      } else {
        document.execCommand(cmd, false);
      }
      scheduleAutosave();
    });
  }

  blockSelect?.addEventListener("change", () => {
    editor.focus();
    const tag = blockSelect.value === "h3" ? "h3" : "p";
    document.execCommand("formatBlock", false, tag);
    scheduleAutosave();
  });
}

/** @param {HTMLElement | null} el */
function extractBulletsFromEditor(el) {
  if (!(el instanceof HTMLElement)) return [];
  const items = el.querySelectorAll("li");
  if (items.length) {
    return [...items].map((li) => li.textContent?.trim() ?? "").filter(Boolean);
  }
  return el.textContent
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

/** @param {HTMLElement} el @param {string[]} bullets */
function fillBulletsEditor(el, bullets) {
  if (!bullets.length) {
    el.innerHTML = "<ul><li><br></li></ul>";
    return;
  }
  el.innerHTML = `<ul>${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`;
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

function collectSocialLinks() {
  const links = [
    getField("social.linkedin"),
    getField("social.github"),
    getField("social.website"),
    ...[...customLinksContainer.querySelectorAll(".profile-url")]
      .map((input) => input.value.trim())
      .filter(Boolean),
  ].filter(Boolean);

  return [...new Set(links)];
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
  resume.skills = serializeSkills(selectedSkills, skillsGroupToggle?.checked ?? false);
  setField("skills", resume.skills);
  resume.education = readEducationFromDom();

  resume.header.links = collectSocialLinks();

  resume.experience = readExperienceFromDom();

  resume.projects = [...projectsContainer.querySelectorAll(".project-card")].map((card) => ({
    name: card.querySelector('[data-field="name"]')?.value.trim() ?? "",
    url: card.querySelector('[data-field="url"]')?.value.trim() ?? "",
    bullets: extractBulletsFromEditor(card.querySelector('[data-field="bullets"]')),
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
        <div>
          <strong>${escapeHtml(resume.education.school)}</strong><br />
          ${escapeHtml(resume.education.degree)}${resume.education.fieldOfStudy ? ` — ${escapeHtml(resume.education.fieldOfStudy)}` : ""}
          ${resume.education.marks ? `<br />${escapeHtml(resume.education.marks)} ${escapeHtml(resume.education.marksType)}` : ""}
          ${resume.education.description ? `<p>${escapeHtml(resume.education.description)}</p>` : ""}
        </div>
        <div>${escapeHtml(resume.education.year || resume.education.graduationDate?.slice(0, 4) || "")}</div>
      </div>
      ${resume.education.secondary
        .filter((s) => s.school || s.degree || s.description)
        .map((s) => formatEducationPreviewEntry(s))
        .join("")}
    </div>
  `;
}

/** @param {import("./resume.js").EducationEntry} entry */
function formatEducationPreviewEntry(entry) {
  const year = entry.year || entry.graduationDate?.slice(0, 4) || "";
  return `
      <div class="entry-header" style="margin-top:8px">
        <div>
          <strong>${escapeHtml(entry.school)}</strong><br />
          ${escapeHtml(entry.degree)}${entry.fieldOfStudy ? ` — ${escapeHtml(entry.fieldOfStudy)}` : ""}
          ${entry.marks ? `<br />${escapeHtml(entry.marks)} ${escapeHtml(entry.marksType)}` : ""}
          ${entry.description ? `<p>${escapeHtml(entry.description)}</p>` : ""}
        </div>
        <div>${escapeHtml(year)}</div>
      </div>`;
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
