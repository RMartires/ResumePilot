import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const UMAMI_WEBSITE_ID = "852ab99f-9cf8-4854-9646-c097c8e352b1";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <DashboardShell userEmail={user.email}>{children}</DashboardShell>
      {/* Base tracker creates window.umami session; recorder depends on it */}
      <script
        defer
        src="https://umami.blogcrafter.co/script.js"
        data-website-id={UMAMI_WEBSITE_ID}
      />
      <script
        defer
        src="https://umami.blogcrafter.co/recorder.js"
        data-website-id={UMAMI_WEBSITE_ID}
        data-sample-rate="1"
        data-mask-level="moderate"
        data-max-duration="300000"
      />
    </>
  );
}
