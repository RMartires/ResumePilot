import type { Metadata } from "next";
import { Inter, Libre_Baskerville } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { GOOGLE_ADS_ID } from "@/lib/google-ads";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const siteDescription =
  "Build ATS-friendly resumes in minutes. AI writing, job-description tailoring, match scoring, cover letters, and application tracking in one workflow.";

export const metadata: Metadata = {
  title: {
    default: "ResumePilot — AI Resume Builder with ATS Optimization",
    template: "%s · ResumePilot",
  },
  description: siteDescription,
  applicationName: "ResumePilot",
  openGraph: {
    title: "ResumePilot — AI Resume Builder with ATS Optimization",
    description: siteDescription,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ResumePilot — AI Resume Builder with ATS Optimization",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${libreBaskerville.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `}
        </Script>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
