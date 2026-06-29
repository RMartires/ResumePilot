import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { LocalStorageImportDialog } from "@/components/dashboard/LocalStorageImportDialog";

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
    <div className="flex h-dvh overflow-hidden">
      <AppSidebar userEmail={user.email} />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {children}
      </main>
      <LocalStorageImportDialog />
    </div>
  );
}
