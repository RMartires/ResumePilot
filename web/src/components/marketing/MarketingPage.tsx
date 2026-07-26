import type { ReactNode } from "react";

type MarketingPageProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function MarketingPage({
  eyebrow,
  title,
  description,
  children,
}: MarketingPageProps) {
  return (
    <main className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="text-sm font-medium text-blue-300">{eyebrow}</p>
          ) : null}
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-400 sm:text-lg">
            {description}
          </p>
        </div>
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </main>
  );
}
