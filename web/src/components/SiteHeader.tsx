import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

/**
 * Site-wide header. Renders on every page via the root layout.
 * Auth state is read server-side; the sign-out action is a small
 * client component.
 */
export async function SiteHeader() {
  const db = await createSupabaseServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();

  const email = user?.email ?? null;
  const initial = email ? email[0]?.toUpperCase() : null;

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
        >
          OpenMic
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/history" className="text-muted-foreground hover:text-foreground">
                History
              </Link>
              <Link
                href="/account"
                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-card text-xs font-medium hover:bg-muted transition"
                title={email ?? ""}
                aria-label={`Account: ${email ?? ""}`}
              >
                {initial}
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
