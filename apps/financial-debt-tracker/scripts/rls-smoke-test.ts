import { config } from "dotenv";
config({ path: ".env.local" });
// scripts/rls-smoke-test.ts
import "dotenv/config";
import { createBareClient as createClient } from "../utils/supabase/bare";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const USER_A_EMAIL = process.env.USER_A_EMAIL;
const USER_A_PASSWORD = process.env.USER_A_PASSWORD;

const USER_B_EMAIL = process.env.USER_B_EMAIL;
const USER_B_PASSWORD = process.env.USER_B_PASSWORD;

function assertEnv(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function makeClient() {
  return createClient(
    assertEnv(SUPABASE_URL, "SUPABASE_URL"),
    assertEnv(SUPABASE_ANON_KEY, "SUPABASE_ANON_KEY"),
  );
}

async function signIn(email: string, password: string) {
  const supabase = makeClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.session) throw new Error("No session returned from signIn");

  return supabase;
}

async function getAuthedUserId(supabase: ReturnType<typeof makeClient>) {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;

  const id = data.user?.id;
  if (!id)
    throw new Error("Could not resolve authenticated user id (auth.uid())");

  return id;
}

async function main() {
  const aEmail = assertEnv(USER_A_EMAIL, "USER_A_EMAIL");
  const aPass = assertEnv(USER_A_PASSWORD, "USER_A_PASSWORD");
  const bEmail = assertEnv(USER_B_EMAIL, "USER_B_EMAIL");
  const bPass = assertEnv(USER_B_PASSWORD, "USER_B_PASSWORD");

  console.log("Signing in as User A...");
  const supa = await signIn(aEmail, aPass);
  const userAId = await getAuthedUserId(supa);
  console.log("User A id:", userAId);

  console.log("Signing in as User B...");
  const supb = await signIn(bEmail, bPass);
  const userBId = await getAuthedUserId(supb);
  console.log("User B id:", userBId);

  // 1) User A inserts a routine (MUST include user_id due to your RLS policy)
  console.log("\nUser A: inserting routine...");
  const { data: routineA, error: insErr } = await supa
    .from("routines")
    .insert({ title: "A Routine", user_id: userAId })
    .select("*")
    .single();

  if (insErr) throw insErr;
  if (!routineA?.id)
    throw new Error("Insert succeeded but no routine returned");

  console.log("User A created routine:", routineA.id);

  // 2) User A reads routines
  console.log("\nUser A: selecting routines...");
  const { data: aRoutines, error: aReadErr } = await supa
    .from("routines")
    .select("id,title,user_id");

  if (aReadErr) throw aReadErr;
  console.log("User A sees routines:", aRoutines?.map((r) => r.id) ?? []);

  // 3) User B reads routines (should NOT include routineA.id)
  console.log("\nUser B: selecting routines (should NOT see A's)...");
  const { data: bRoutines, error: bReadErr } = await supb
    .from("routines")
    .select("id,title,user_id");

  if (bReadErr) throw bReadErr;
  console.log("User B sees routines:", bRoutines?.map((r) => r.id) ?? []);

  const bCanSeeA = (bRoutines ?? []).some((r) => r.id === routineA.id);
  if (bCanSeeA) {
    throw new Error("RLS FAILED: User B can see User A's routine");
  }

  // 4) User B tries to delete User A routine (should delete 0 rows)
  console.log(
    "\nUser B: attempting delete of User A routine (should fail / delete 0)...",
  );
  const { error: bDelErr, count: bDelCount } = await supb
    .from("routines")
    .delete({ count: "exact" })
    .eq("id", routineA.id);

  // Depending on policy + PostgREST behavior, you might get:
  // - no error + count 0 (common)
  // - an error (also acceptable)
  console.log("User B delete error:", bDelErr?.message ?? "none");
  console.log("User B deleted rows:", bDelCount ?? "unknown");

  if (!bDelErr && bDelCount && bDelCount > 0) {
    throw new Error("RLS FAILED: User B deleted User A's routine");
  }

  // 5) Cleanup as User A
  console.log("\nCleanup: User A deleting created routine...");
  const { error: cleanupErr, count: cleanupCount } = await supa
    .from("routines")
    .delete({ count: "exact" })
    .eq("id", routineA.id);

  if (cleanupErr) throw cleanupErr;
  console.log("Cleanup deleted rows:", cleanupCount ?? "unknown");

  console.log("\n✅ RLS smoke test PASSED.");
}

main().catch((e) => {
  console.error("\n❌ RLS smoke test FAILED:");
  console.error(e);
  process.exit(1);
});
