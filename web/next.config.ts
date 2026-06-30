import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit loads Helvetica.afm from disk; keep it out of the server bundle.
  serverExternalPackages: ["pdfkit"],
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/pdfkit/js/data/**/*"],
  },
};

export default nextConfig;
