import type { Metadata } from "next";
import { Inter, Libre_Baskerville } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
  title: "ResumeBuilder",
  description: "Build professional resumes with live preview and cloud sync",
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
