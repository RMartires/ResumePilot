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
    <div className="flex min-h-screen">
      <AppSidebar userEmail={user.email} />
      <main className="flex-1 overflow-auto">{children}</main>
      <LocalStorageImportDialog />
    </div>
  );
}
