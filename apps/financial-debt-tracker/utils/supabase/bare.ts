import { createClient } from "@supabase/supabase-js";

// Bare client for scripts (no cookie handling)
export function createBareClient(url: string, anonKey: string) {
  return createClient(url, anonKey);
}
