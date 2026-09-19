import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

/**
 * Sticky top navigation. Renders on every page via the root layout.
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
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between gap-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-serif text-xl tracking-tight hover:text-primary/90 transition"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full bg-primary"
            aria-hidden
          />
          OpenMic
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link
            href="/start"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Scenarios
          </Link>
          <Link
            href="/#how-it-works"
            className="text-muted-foreground hover:text-foreground transition"
          >
            How it works
          </Link>
          <Link
            href="/#why"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Why OpenMic
          </Link>
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link
                href="/history"
                className="hidden sm:inline text-muted-foreground hover:text-foreground transition"
              >
                History
              </Link>
              <Link
                href="/account"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-card text-xs font-medium hover:bg-muted transition"
                title={email ?? ""}
                aria-label={`Account: ${email ?? ""}`}
              >
                {initial}
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline text-muted-foreground hover:text-foreground transition"
              >
                Log in
              </Link>
              <Link
                href="/start"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:brightness-95 transition"
              >
                Start free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
