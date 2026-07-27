import Link from "next/link";
import { ProPricingCard } from "@/components/billing/ProPricingCard";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { FREE_TIER_LIMITS } from "@/lib/billing/limits";
import { createMarketingMetadata } from "@/lib/seo/metadata";
import { pricingOfferJsonLd } from "@/lib/seo/structured-data";
import { JsonLd } from "@/lib/seo/json-ld";

export const metadata = createMarketingMetadata({
  title: "Pricing — ResumePilot Pro",
  description:
    "Upgrade to ResumePilot Pro for unlimited AI resume writing, PDF import, tailoring, and exports. Pay with UPI or card.",
  path: "/pricing",
});

const freeFeatures = [
  "Build and edit resumes",
  "Core templates",
  `${FREE_TIER_LIMITS.ai_chat} AI chat messages / month`,
  `${FREE_TIER_LIMITS.ats_check} ATS checks / month`,
  `${FREE_TIER_LIMITS.resume_score} resume score runs / month`,
  `${FREE_TIER_LIMITS.pdf_download} PDF downloads / month`,
] as const;

export default function PricingPage() {
  return (
    <>
      <JsonLd data={pricingOfferJsonLd()} />
      <MarketingPage
        eyebrow="Pricing"
        title="Start free. Upgrade when AI saves you hours."
        description="Keep the core builder free with monthly limits. Pro unlocks unlimited AI, checks, and exports."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <p className="text-sm font-medium text-zinc-400">Free</p>
            <p className="mt-2 text-3xl font-bold">₹0</p>
            <p className="mt-1 text-sm text-zinc-500">
              Best for trying ResumePilot — limits reset each month
            </p>
            <ul className="mt-6 space-y-3 text-sm text-zinc-300">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/#sign-in"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.05]"
            >
              Get started free
            </Link>
          </section>

          <ProPricingCard />
        </div>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-white">Affiliate program</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Partners earn commission on paid Pro subscriptions via referral links like{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-zinc-200">
              resumepilot.xyz/?ref=your_code
            </code>
            . Contact us to get a partner code added to the program.
          </p>
        </section>
      </MarketingPage>
    </>
  );
}
