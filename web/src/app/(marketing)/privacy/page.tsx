import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing/MarketingPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ResumePilot collects, uses, and protects your information when you use our AI resume builder.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <MarketingPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="Last updated July 26, 2026. This policy explains what we collect and how we use it when you use ResumePilot."
    >
      <div className="prose prose-invert max-w-3xl space-y-6 text-sm leading-7 text-zinc-300">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Information we collect</h2>
          <p>
            When you sign in with Google, we receive basic account details such as your
            name, email address, and profile image from the authentication provider. When
            you use the product, we store resume content, uploads, and application data you
            choose to save in your account.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">How we use information</h2>
          <p>
            We use your information to provide and improve ResumePilot — including resume
            editing, AI assistance, exports, analytics for product quality, and account
            security. Free SEO tools that accept a resume or job description process that
            content to return a score and do not create an account or store the upload for
            later use.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Third-party services</h2>
          <p>
            We use service providers for authentication, hosting, analytics, and AI
            features. These providers process data only as needed to operate ResumePilot.
            We do not sell your personal information.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Your choices</h2>
          <p>
            You can request deletion of your account and associated resume data by
            contacting us. You may also stop using the service at any time and revoke
            Google access from your Google account settings.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Contact</h2>
          <p>
            For privacy questions, contact us at{" "}
            <a
              href="mailto:privacy@resumepilot.xyz"
              className="text-blue-300 underline underline-offset-2"
            >
              privacy@resumepilot.xyz
            </a>
            .
          </p>
        </section>
      </div>
    </MarketingPage>
  );
}
