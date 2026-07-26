import type { Metadata } from "next";
import { Inter, Libre_Baskerville } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SITE_NAME, SITE_URL, siteDescription } from "@/lib/seo/site";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ResumePilot — AI Resume Builder with ATS Optimization",
    template: "%s · ResumePilot",
  },
  description: siteDescription,
  applicationName: SITE_NAME,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "ResumePilot — AI Resume Builder with ATS Optimization",
    description: siteDescription,
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ResumePilot — AI Resume Builder with ATS Optimization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumePilot — AI Resume Builder with ATS Optimization",
    description: siteDescription,
    images: ["/twitter-image"],
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
