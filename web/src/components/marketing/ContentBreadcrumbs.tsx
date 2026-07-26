import Link from "next/link";

type Breadcrumb = { name: string; path: string };

export function ContentBreadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-zinc-400">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={item.path} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden>/</span> : null}
            {index === items.length - 1 ? (
              <span aria-current="page" className="text-zinc-200">{item.name}</span>
            ) : (
              <Link href={item.path} className="hover:text-white">{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
