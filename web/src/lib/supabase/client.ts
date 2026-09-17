"use client";

import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/lib/env";

/**
 * Supabase browser client. Uses the anon key; RLS enforces per-user isolation.
 * See docs/03-architecture.md §4.3 for RLS policies.
 */
export function createSupabaseBrowserClient() {
  const env = publicEnv();
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
