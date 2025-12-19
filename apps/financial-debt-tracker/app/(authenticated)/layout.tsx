import { createClient } from "@repo/supabase/server";
import { DashboardShell } from "./_components/dashboard-shell";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <DashboardShell
      user={{
        name: user?.user_metadata?.full_name ?? user?.user_metadata?.name,
        email: user?.email,
        avatarUrl: user?.user_metadata?.avatar_url,
      }}
    >
      {children}
    </DashboardShell>
  );
}
