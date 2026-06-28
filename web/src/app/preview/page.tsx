import Link from "next/link";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { normalizeResume } from "@/lib/resume";
import sampleResume from "@/data/sample-resume.json";

export default function PreviewDevPage() {
  const resume = normalizeResume(sampleResume);

  return (
    <div className="min-h-screen bg-[#e8edf4] p-8">
      <div className="mb-4">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Home
        </Link>
      </div>
      <div className="mx-auto max-w-2xl">
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}
