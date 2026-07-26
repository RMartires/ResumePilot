import Link from "next/link";

export type ContentHubItem = {
  title: string;
  description: string;
  path: string;
};

export function ContentHubGrid({ items }: { items: ContentHubItem[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article key={item.path} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-semibold">{item.title}</h2>
          <p className="mt-2 flex-1 text-sm leading-6 text-zinc-400">{item.description}</p>
          <Link href={item.path} className="mt-5 text-sm font-medium text-blue-300 hover:text-blue-200">
            Read more <span aria-hidden>→</span>
          </Link>
        </article>
      ))}
    </div>
  );
}
