import Script from "next/script";
import {
  UMAMI_DOMAINS,
  UMAMI_RECORDER_URL,
  UMAMI_SCRIPT_URL,
  UMAMI_WEBSITE_ID,
} from "@/lib/analytics/umami";

type UmamiScriptsProps = {
  /** Session recorder is only useful inside the authenticated product. */
  includeRecorder?: boolean;
};

export function UmamiScripts({ includeRecorder = false }: UmamiScriptsProps) {
  const domains =
    process.env.NODE_ENV === "production" ? UMAMI_DOMAINS : undefined;

  return (
    <>
      <Script
        defer
        src={UMAMI_SCRIPT_URL}
        data-website-id={UMAMI_WEBSITE_ID}
        data-domains={domains}
        strategy="afterInteractive"
      />
      {includeRecorder ? (
        <Script
          defer
          src={UMAMI_RECORDER_URL}
          data-website-id={UMAMI_WEBSITE_ID}
          data-domains={domains}
          data-sample-rate="1"
          data-mask-level="moderate"
          data-max-duration="300000"
          strategy="afterInteractive"
        />
      ) : null}
    </>
  );
}
