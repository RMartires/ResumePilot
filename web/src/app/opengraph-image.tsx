import { ImageResponse } from "next/og";

export const alt = "ResumePilot — AI Resume Builder with ATS Optimization";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(ellipse at top left, #1d4ed8 0%, #060810 55%, #02040a 100%)",
          color: "white",
          padding: "64px 72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            R
          </div>
          ResumePilot
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            AI Resume Builder with ATS Optimization
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#a1a1aa",
              maxWidth: 820,
              lineHeight: 1.35,
            }}
          >
            Tailor resumes to the job description, check ATS fit, and export
            parser-safe PDFs.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#93c5fd",
          }}
        >
          <span>Free ATS checker · Templates · Job tracker</span>
          <span>resumepilot.xyz</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
