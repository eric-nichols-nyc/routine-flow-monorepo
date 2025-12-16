import { createClient } from "@repo/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Account</h1>
      <pre className="p-4 bg-muted rounded-lg text-xs overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}