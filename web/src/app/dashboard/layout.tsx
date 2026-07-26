import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UmamiScripts } from "@/components/analytics/UmamiScripts";
import { UmamiSession } from "@/components/analytics/UmamiSession";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata = noIndexMetadata;

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

  if (!user.email) {
    redirect("/login");
  }

  return (
    <>
      <UmamiScripts includeRecorder />
      <UmamiSession
        userId={user.id}
        email={user.email}
      />
      <DashboardShell userEmail={user.email}>{children}</DashboardShell>
    </>
  );
}
