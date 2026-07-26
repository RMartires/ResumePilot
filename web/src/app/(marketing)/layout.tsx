import { LandingHeader } from "@/components/landing/LandingHeader";
import { MarketingFooter } from "@/components/landing/MarketingFooter";
import { UmamiScripts } from "@/components/analytics/UmamiScripts";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex min-h-full flex-col bg-[#060810] text-white">
        <LandingHeader />
        <div className="flex-1">{children}</div>
        <MarketingFooter />
      </div>
      <UmamiScripts />
    </>
  );
}
