# 06 — Deployment

**Version:** 0.1
**Status:** 🟢 ready to execute
**Last updated:** 2026-09-18
**Depends on:** [03-architecture.md](03-architecture.md)

How to get OpenMic from `main` on GitHub to a live production URL, and everything that has to be true for it to stay live.

---

## 1. What we're deploying

- **Next.js 16 App Router** app (`web/`) with server-rendered routes, a proxy for guest-cookie management, and streaming API routes.
- **Vercel Hobby** tier for hosting — free, generous limits, first-party Next.js support.
- **Supabase Cloud** for Postgres + Auth (already provisioned).
- **Anthropic API** for the LLM (already provisioned).

Vercel preview deploys will run on every PR against `main`. Production comes from `main`.

## 2. Prerequisites

- [ ] GitHub repo already public at https://github.com/prashrijan/openmic
- [ ] Supabase project provisioned
- [ ] Anthropic API key with credits
- [ ] Vercel account (free tier)
- [ ] Access to the domain registrar if we want a custom domain (v0.1 can launch on `*.vercel.app` and add a domain later)

## 3. First deploy — Vercel dashboard (recommended)

The dashboard flow is easier for a first-time setup than the CLI. Once linked, subsequent deploys are automatic on `git push`.

### 3.1 Import the repo

1. Open https://vercel.com/new
2. If GitHub isn't connected: **Continue with GitHub** and authorize Vercel to see `prashrijan/openmic`
3. Find `openmic` in the list → **Import**

### 3.2 Configure the project

Vercel auto-detects Next.js. You need to override two things because the app lives in a subdirectory:

| Setting | Value |
|---|---|
| **Framework Preset** | Next.js (auto-detected) |
| **Root Directory** | `web` |
| **Build Command** | (leave default: `next build`) |
| **Output Directory** | (leave default: `.next`) |
| **Install Command** | (leave default: `pnpm install`) |

⚠ **Do not skip Root Directory.** Without it, Vercel tries to build from the repo root and fails because there's no `package.json` there.

### 3.3 Add environment variables

Under **Environment Variables**, add each of these (copy from your local `web/.env.local`):

| Name | Environments |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview, Development |
| `ANTHROPIC_API_KEY` | Production, Preview, Development |
| `GUEST_COOKIE_HMAC_SECRET` | Production, Preview, Development |

Later (optional):

| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | Product analytics |
| `NEXT_PUBLIC_SENTRY_DSN` | Error tracking |
| `SENTRY_AUTH_TOKEN` | Source-map upload |

### 3.4 Deploy

Click **Deploy**. First build takes ~2 minutes.

When it finishes, Vercel gives you a URL like `openmic-abc123.vercel.app`. That's the production URL.

## 4. Post-deploy — critical settings you must update

### 4.1 Supabase redirect URLs

Supabase Auth blocks any redirect URL that isn't whitelisted. Without this update, magic-link emails and Google OAuth will redirect to `localhost:3000` instead of production, and users will see errors.

1. Open your Supabase project → **Authentication** → **URL Configuration**
2. **Site URL** — set to your Vercel production URL (e.g., `https://openmic-abc123.vercel.app`)
3. **Redirect URLs** — add ALL of the following:
   - `https://openmic-abc123.vercel.app/**`
   - `https://openmic-abc123.vercel.app/auth/callback`
   - `https://*.vercel.app/**` — matches preview deploys (any PR branch)
   - Keep `http://localhost:3000/**` for local dev
4. **Save**

### 4.2 Google OAuth redirect URIs (if using Google sign-in)

Google Cloud Console → **APIs & Services** → **Credentials** → your OAuth 2.0 Client:

- **Authorized JavaScript origins**: add `https://openmic-abc123.vercel.app`
- **Authorized redirect URIs** — the Supabase-side callback stays the same (`https://<project-ref>.supabase.co/auth/v1/callback`). No change needed here unless you rotate the Supabase project.

### 4.3 Anthropic spend controls

Now that the app is on a public URL, someone could hammer it (rate limits help but aren't infallible for LLM cost). Confirm your Anthropic account has a **monthly spend cap** configured — see docs/03-architecture.md §11.2.

## 5. Custom domain (optional)

Once you're happy with the Vercel URL, point a real domain at it.

1. Buy a domain (Cloudflare Registrar and Namecheap are the fair-priced options — Cloudflare is the best deal)
2. Vercel dashboard → project → **Settings** → **Domains** → **Add**
3. Enter your domain (e.g., `openmic.chat`)
4. Vercel gives you DNS records — copy them to your registrar
5. Wait for DNS propagation (usually 5-30 min)
6. **Then repeat §4.1** — add the new domain to Supabase Redirect URLs
7. **Then repeat §4.2** — add the new domain to Google OAuth origins

## 6. Verifying the deploy

Before telling anyone about the URL, run through this checklist:

- [ ] Landing page loads with Falu Room design (warm bg, Fraunces serif hero)
- [ ] `/start` loads and shows 12 scenarios
- [ ] Guest session can start (POST /api/sessions succeeds)
- [ ] Chat streams from Claude Haiku (Anthropic credits present)
- [ ] Session end generates a feedback report (Claude Sonnet)
- [ ] `/login` shows the sign-in options; magic link email arrives
- [ ] After sign-in, `/history` and `/account` load
- [ ] Sign out actually clears the session

If any check fails, roll back via **Vercel dashboard → Deployments → previous deploy → Promote to Production**.

## 7. Preview deploys on every PR

Vercel automatically deploys every branch push. Once you open a PR against `main`, you get a Preview URL in the PR comments. Use it to smoke-test changes before merging.

To make previews useful, they need the same env vars, but preview branches should NOT use the production Supabase project — otherwise every branch touches real user data.

**For v0.1**: it's fine to point previews at the production Supabase for now (traffic is negligible). **For v0.2+**: create a second Supabase project called `openmic-staging` and set its keys as preview-only env vars.

## 8. Rolling back

If a deploy breaks production:

1. Vercel dashboard → project → **Deployments**
2. Find the last working deploy
3. **⋯** → **Promote to Production**

This is instant and does not require a git revert. Once promoted, do a proper git fix on `main`.

## 9. Ongoing maintenance

- **Monitor Vercel analytics** — bandwidth, build time, function duration. Free tier has generous but real limits.
- **Watch Anthropic usage weekly** — see costs in the Anthropic console. Alert if daily spend exceeds ~$5.
- **Rotate secrets on any suspicion of leak.** Steps in docs/03-architecture.md §13.3.
- **Backups** — Supabase runs daily backups on the free tier. For anything past v0.1, upgrade to Pro for point-in-time recovery.

## 10. Change log

| Date | Change | Author |
|---|---|---|
| 2026-09-18 | Initial v0.1 deploy runbook | Prashrijan + Claude |
