import type { SkillsPage } from "@/lib/seo/content";

export function SkillsPanel({ page }: { page: SkillsPage }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {page.categories.map((category) => (
        <section key={category.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-semibold">{category.name}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <li key={skill} className="rounded-full bg-blue-500/10 px-3 py-1.5 text-sm text-blue-200">
                {skill}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
