import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit loads Helvetica.afm from disk; keep it out of the server bundle.
  serverExternalPackages: ["pdfkit"],
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/pdfkit/js/data/**/*"],
  },
  async redirects() {
    return [
      { source: "/pricing", destination: "/", permanent: true },
      { source: "/dashboard/upgrade", destination: "/dashboard", permanent: true },
      { source: "/dashboard/billing", destination: "/dashboard", permanent: true },
      { source: "/checkout/success", destination: "/dashboard", permanent: true },
    ];
  },
};

export default nextConfig;
