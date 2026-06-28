/** @typedef {{ name: string, years: number | null, category?: string }} SkillEntry */

export const POPULAR_SKILLS = [
  "Javascript",
  "Java",
  "Python",
  "React",
  "Node.js",
  "Angular",
  "TypeScript",
  "Express.js",
  "Selenium",
  "Android Development",
  "iOS Development",
  ".NET",
  "Django",
  "Spring Boot",
  "C",
  "C++",
  "AWS",
  "Azure",
  "Microservices",
  "Next.JS",
  "Bash/Shell Scripting",
  "SQL",
  "Linux/Unix",
  "No SQL",
  "Agentic AI",
];

const SKILL_WITH_YEARS = /^(.+?)\s*\((\d+)\s*yrs?\)$/i;

const CATEGORY_RULES = [
  { category: "Languages", match: /^(java|python|c\+\+|c$|javascript|typescript|bash|shell|\.net|go|ruby|php|kotlin|swift)/i },
  { category: "Libraries", match: /(react|angular|express|django|spring|next\.?js|node\.?js|selenium)/i },
  { category: "Tools", match: /(aws|azure|docker|kubernetes|sql|linux|unix|git|microservices|agentic)/i },
];

/** @param {string} raw */
export function parseSkillsString(raw) {
  if (!raw.trim()) return [];

  /** @type {SkillEntry[]} */
  const entries = [];
  const seen = new Set();

  const addEntry = (/** @type {string} */ name, /** @type {number | null} */ years) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    entries.push({ name: trimmed, years, category: inferCategory(trimmed) });
  };

  const segments = raw.split("|").map((s) => s.trim()).filter(Boolean);

  for (const segment of segments) {
    const colonIdx = segment.indexOf(":");
    const chunk = colonIdx >= 0 ? segment.slice(colonIdx + 1) : segment;
    const items = chunk.split(",").map((s) => s.trim()).filter(Boolean);

    for (const item of items) {
      const match = item.match(SKILL_WITH_YEARS);
      if (match) addEntry(match[1], Number(match[2]));
      else addEntry(item, null);
    }
  }

  return entries;
}

/** @param {string} name */
function inferCategory(name) {
  for (const { category, match } of CATEGORY_RULES) {
    if (match.test(name)) return category;
  }
  return "Tools";
}

/** @param {SkillEntry[]} entries @param {boolean} grouped */
export function serializeSkills(entries, grouped) {
  if (!entries.length) return "";

  const format = (/** @type {SkillEntry} */ entry) => {
    if (entry.years && entry.years > 0) {
      const label = entry.years === 1 ? "yr" : "yrs";
      return `${entry.name} (${entry.years} ${label})`;
    }
    return entry.name;
  };

  if (!grouped) {
    return entries.map(format).join(", ");
  }

  /** @type {Record<string, SkillEntry[]>} */
  const buckets = { Languages: [], Libraries: [], Tools: [] };

  for (const entry of entries) {
    const cat = entry.category ?? inferCategory(entry.name);
    if (!buckets[cat]) buckets[cat] = [];
    buckets[cat].push(entry);
  }

  return Object.entries(buckets)
    .filter(([, list]) => list.length > 0)
    .map(([cat, list]) => `${cat}: ${list.map(format).join(", ")}`)
    .join(" | ");
}

/** @param {string} input */
export function parseSkillInput(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const match = trimmed.match(SKILL_WITH_YEARS);
  if (match) {
    return { name: match[1].trim(), years: Number(match[2]), category: inferCategory(match[1]) };
  }
  return { name: trimmed, years: 1, category: inferCategory(trimmed) };
}

/** @param {SkillEntry} entry */
export function skillLabel(entry) {
  if (entry.years && entry.years > 0) {
    const label = entry.years === 1 ? "yr" : "yrs";
    return `${entry.name} (${entry.years} ${label})`;
  }
  return entry.name;
}

/** @param {SkillEntry[]} entries @param {string} name */
export function hasSkill(entries, name) {
  return entries.some((e) => e.name.toLowerCase() === name.toLowerCase());
}
