import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env";

/**
 * Service-role Supabase client. Bypasses RLS.
 *
 * Only use for:
 *   - Guest session operations (no auth.uid available)
 *   - Admin operations (data deletion, moderation)
 *   - Migrations and seeds
 *
 * NEVER expose to the browser. NEVER trust request-provided identity when
 * calling with this client — always verify server-side first (e.g. guest
 * cookie HMAC signature, admin role).
 *
 * See docs/03-architecture.md §5.2 and §11.
 */
export function createSupabaseServiceClient() {
  const env = serverEnv();
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
