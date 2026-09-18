"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Props {
  next: string;
  reason?: string;
}

export function LoginClient({ next, reason }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const showQuotaWall = reason === "quota";

  async function submitMagicLink(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: redirectUrl },
      });
      if (err) throw err;
      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Failed to send link");
    }
  }

  async function signInWithGoogle() {
    setGoogleLoading(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectUrl },
      });
      if (err) throw err;
    } catch (err) {
      setGoogleLoading(false);
      setError(err instanceof Error ? err.message : "Failed to start Google sign-in");
    }
  }

  return (
    <main className="flex-1 grid md:grid-cols-2 min-h-[calc(100vh-56px)]">
      {/* Left — copy + form */}
      <section className="flex items-center justify-center px-6 py-12 md:py-16 order-2 md:order-1">
        <div className="w-full max-w-md">
          {showQuotaWall && (
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3">
                You&rsquo;ve used your free sessions
              </p>
              <h1 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight mb-5">
                Sign up to keep practicing.
              </h1>
              <ul className="text-sm text-muted-foreground space-y-2 leading-relaxed">
                <li>
                  <span className="text-foreground">Save your history.</span>{" "}
                  Every session and feedback report stays available.
                </li>
                <li>
                  <span className="text-foreground">Unlimited sessions.</span>{" "}
                  Practice as often as you like.
                </li>
                <li>
                  <span className="text-foreground">Pick up where you left off.</span>{" "}
                  Your practice goals inform every session.
                </li>
              </ul>
            </div>
          )}

          {!showQuotaWall && (
            <>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3">
                Welcome back
              </p>
              <h1 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight mb-6">
                Sign in to OpenMic.
              </h1>
            </>
          )}

          <div className="space-y-4">
            {status === "sent" ? (
              <div className="rounded-lg bg-card p-6">
                <p className="text-sm font-medium mb-1">Check your email</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We sent a sign-in link to{" "}
                  <span className="text-foreground">{email}</span>. Open it on
                  this device to continue.
                </p>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  disabled={googleLoading}
                  className="w-full rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:brightness-95 disabled:opacity-60 transition"
                >
                  {googleLoading ? "Redirecting…" : "Continue with Google"}
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-3 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      or
                    </span>
                  </div>
                </div>

                <form onSubmit={submitMagicLink} className="space-y-3">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-md bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-primary/60"
                  />
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full rounded-md bg-card border border-border px-5 py-3 text-sm font-medium hover:bg-muted disabled:opacity-60 transition"
                  >
                    {status === "sending" ? "Sending…" : "Send magic link"}
                  </button>
                </form>
              </>
            )}

            {error && <p className="text-sm text-destructive mt-3">{error}</p>}
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            By signing in you agree that you&rsquo;re 13 or older.
          </p>
        </div>
      </section>

      {/* Right — image */}
      <section className="relative hidden md:block order-1 md:order-2 bg-card">
        <Image
          src="https://images.unsplash.com/photo-1509909756405-be0199881695?w=1400&q=80&auto=format&fit=crop"
          alt="Warm afternoon light — the quiet space where practice happens"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0 pointer-events-none mix-blend-multiply"
          style={{ background: "rgba(240, 237, 231, 0.18)" }}
          aria-hidden
        />
      </section>
    </main>
  );
}
