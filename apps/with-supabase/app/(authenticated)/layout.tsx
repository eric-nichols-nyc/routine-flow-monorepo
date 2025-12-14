import { createClient } from "@repo/supabase/server";
import { StickyHeader } from "./_components/sticky-header";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      <StickyHeader
        user={{
          name: user?.user_metadata?.full_name ?? user?.user_metadata?.name,
          email: user?.email,
          avatarUrl: user?.user_metadata?.avatar_url,
        }}
      />
      <main>{children}</main>
    </div>
  );
}
