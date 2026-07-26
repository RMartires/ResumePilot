import Link from "next/link";
import type { RelatedLink } from "@/lib/seo/content";

export function RelatedLinks({ links }: { links: RelatedLink[] }) {
  return (
    <aside aria-labelledby="related-content-title" className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 id="related-content-title" className="text-lg font-semibold">Keep exploring</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.path}>
            <Link href={link.path} className="text-blue-300 hover:text-blue-200">
              {link.title} <span aria-hidden>→</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
