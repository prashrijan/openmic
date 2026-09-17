---
version: alpha
name: Falu Room
description: A quiet, warm-neutral design system for OpenMic — an AI companion for practicing English communication. Optimized for anxious first-time users and long sessions, not spectacle.

colors:
  primary: "#2B2823"
  secondary: "#6A6156"
  tertiary: "#7E4232"
  neutral: "#F0EDE7"
  surface: "#F7F4EE"
  on-surface: "#2B2823"
  border: "#D5CFC4"
  error: "#6E2A28"
  success: "#4E5F35"
  accent-pressed: "#5E2F21"

typography:
  display:
    fontFamily: Fraunces
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.03em
    fontVariation: '"opsz" 144, "SOFT" 100, "WONK" 0'
  headline-lg:
    fontFamily: Fraunces
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em
    fontVariation: '"opsz" 72, "SOFT" 100, "WONK" 0'
  headline-md:
    fontFamily: Fraunces
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
    fontVariation: '"opsz" 36, "SOFT" 50'
  headline-sm:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.3
  label-caps:
    fontFamily: Public Sans
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.12em
  feedback-body:
    fontFamily: Fraunces
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
    fontVariation: '"opsz" 24, "SOFT" 100'

rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px

components:
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  button-primary-hover:
    backgroundColor: "{colors.accent-pressed}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
  input-error:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.error}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
  chip:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
  message-user:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  message-ai:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    padding: "{spacing.md}"
  feedback-report:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.feedback-body}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  feedback-positive-label:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.success}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.md}"
    padding: "{spacing.xs}"
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
    width: 100%
---

# Falu Room — the OpenMic design system

## Overview

OpenMic is where people practice English conversation with an AI before they have to do it for real — an interview, a meeting, a first phone call. Its users are anxious about talking. The design system's job is to make the room feel low-stakes.

The direction is **Nordic Calm with an editorial-serif accent**. Nordic Calm carries the calm — desaturated warm neutrals, generous rhythm, no drama. But Nordic Calm alone drifts into blandness, so *Falu Room* commits to two identifying moves that keep it authored:

1. **One accent color, sourced from a specific referent.** *Falu red* is the traditional rust-red pigment from the iron-oxide mines at Falun, Sweden — the exact paint on centuries-old country farmhouses and small chapels. We chose it because the referent means *shelter, home, permanence*, which is the emotional register we want when someone opens the app to practice being disagreed with. It is not "a nice terracotta." It is *falu rödfärg*.
2. **A variable serif carries the reading register.** Feedback reports and top-level headings are set in **Fraunces** with the SOFT axis pushed to warm the letterforms. The chat itself uses **Public Sans**, humanist and workmanlike. This split reinforces a subtle idea: the *conversation* is the working part; the *feedback* is the considered part. Two typefaces, two jobs, two emotional registers.

**What this system gives up.** Drama. Strong brand recall on first impression. Any claim to novelty. What we get in return is a room a shy user can sit in for fifteen minutes without feeling watched.

**What the room is not.** Not a chat app in the WhatsApp/Discord register — no left/right bubble ping-pong, no notification-red badges, no gamification streaks. Not a coach's clipboard either — no scores, no red pen. Somewhere between a well-loved reading chair and a private studio.

**Wordmark.** *OpenMic* is set in Fraunces Bold at `opsz=144, SOFT=100` — the same treatment as `display` typography.

## Colors

The palette is anchored to one referent and grown outward. There are ten tokens and each has one job; none of them are "a nice color I found."

- **Primary (#2B2823):** *warm ink*. A near-black with a trace of brand hue — never pure `#000000`, because pure black on paper is a physical harshness that this system rejects on principle. Used for body text, headings, and anywhere primary reading happens.
- **Secondary (#6A6156):** *worn hemp*. A muted warm grey for metadata, timestamps, form labels, and captions. Passes AA on both `neutral` and `surface`; below that it retires to icons and dividers.
- **Tertiary (#7E4232):** *falu red*. Traditional Swedish farmhouse pigment — iron oxide from the Falun copper mines, in use since the 17th century. This is the accent color and it has **exactly one job**: to mark the single primary interaction on any given view. If it appears twice on a screen, one of those instances is wrong.
- **Neutral (#F0EDE7):** *unbleached paper*. The page background. Warm-tinted (OKLCH hue near 60) so the room reads as morning-light rather than fluorescent. Every screen begins here.
- **Surface (#F7F4EE):** *linen*. An elevated warm off-white, one step lighter than `neutral`. This is how depth is conveyed — a card sits on paper because its surface is a shade lighter, not because it's floating. Reserved for cards, modals, inputs, and the user's chat turn.
- **On-surface (#2B2823):** identical value to `primary`, distinct semantic role. Used explicitly for text laid on `surface` so the pairing is checkable.
- **Border (#D5CFC4):** *chalk line*. Hairline separator. 1px, used sparingly — most grouping is done with spacing, not rules.
- **Error (#6E2A28):** *dried oxblood*. Distinctly darker and more saturated than `tertiary` so the two never confuse. Never a stock Tailwind red. Used with a redundant icon at all times, per the Do's below.
- **Success (#4E5F35):** *dry moss*. A cousin of `tertiary` in warmth but rotated to a different hue family — appears only in the feedback report's "strengths" label. Never in generic UI feedback.
- **Accent-pressed (#5E2F21):** a deeper falu for the pressed and hover state of the single primary button. Same family, one shade down.

**Ramp construction.** Neutrals were built in OKLCH with warm tint (chroma ~0.008, hue ~55) and inverse-perceptual lightness steps. The falu ramp bends slightly toward maroon in its darker states (pressed) and toward warm clay in its lighter states — real pigments shift hue as they lighten, and a flat-hue ramp is one of the clearest tells of a generated palette.

**Accent scarcity is a rule, not a guideline.** Falu red on a button, falu red on a critical highlight, and nowhere else. Not on links (links are underlined, in `primary`). Not on badges. Not on chart lines. Not on scenario category chips. If you find yourself wanting to make something "pop," the correct move is a weight or space change, not a color.

## Typography

Two faces. Both open-source. They differ by *classification* (serif vs sans), not by weight, because typographic contrast built on weight alone is a tell.

**Fraunces** carries the reading register — display headings, hero titles, and feedback reports. Fraunces is a variable serif with real optical axes: `opsz` (optical size), `wght` (weight), `SOFT` (0–100, softening the terminals), and `WONK` (a stylistic quirk axis we do *not* enable — this system stays calm). We set `SOFT=100` on all display and reading sizes; it is what separates our feedback report from a stock serif and gives the letterforms a tactile, hand-cut quality. Load from Google Fonts (`Fraunces` family, `opsz,wght@9..144,400;9..144,700`).

**Public Sans** carries the working register — chat messages, form fields, buttons, labels, navigation. Public Sans is the humanist sans from the US Web Design System: workmanlike, quiet, no personality games. It never fights Fraunces for attention. Load from Google Fonts (weights 400 and 700).

**Fallback stack (both faces):** `Fraunces, Georgia, "Iowan Old Style", "Times New Roman", serif` and `"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. The fallbacks are close in metrics to prevent layout shift.

**Two weights only.** 400 (regular) and 700 (bold). No 500, no 600. Weight contrast has to feel like a decision, not a gradient. If a heading needs more emphasis than 700 provides, size does that work.

**Tracking varies with size.** Display is tracked to `-0.03em`; small labels rendered in ALL CAPS are tracked to `+0.12em`. Body text uses default tracking. The rule: negative on display, zero on body, positive on uppercase-small.

**Line-height moves inversely to size.** 1.05 at display, 1.6 at body, 1.5 at 14px, 1.3 at 11px caps. One line-height across the scale is the second-most-common typographic tell after full weight ladders.

**Measure.** Body copy is constrained to **62–72 characters per line**. The feedback report specifically is set to `max-width: 64ch`. Wider paragraphs are unreadable; the fact that most SaaS defaults ignore this is a gift to anyone who doesn't.

**Feedback-body is a deliberate register break.** When the AI's session-end feedback appears, we switch from Public Sans to Fraunces at 18px. This is the single most important reading experience in the product — the user is reading a *response to their practice*. Setting it in serif signals "this is considered writing," which is what we want them to feel. It also visually separates the feedback from the transcript above it without needing a divider or a card border.

## Layout

The layout follows a **fluid single-column model** on mobile and a **fixed-max-width with generous margins** on desktop (max 720px content column for reading, 960px for the full session view with sidebar).

**Base unit: 8px.** With a 4px half-step only for icon nudging. Every gap, padding, and margin resolves to `spacing.xs` through `spacing.xxl`. No arbitrary values.

**Spacing is how grouping is done.** Prefer a spacing decision over a border, over a shadow, over a card. A group of related controls uses `spacing.sm` between them; unrelated groups use `spacing.lg`; unrelated sections use `spacing.xl`. This is the single most-ignored hierarchy tool available.

**Vertical rhythm.** Chat turns are separated by `spacing.md` (16px) vertical space, no rules. Feedback sections (strengths / growth / suggestions) are separated by `spacing.xl` (40px). Landing-page sections use `spacing.xxl` (64px) at desktop and `spacing.xl` at mobile.

**Density posture: unhurried.** Cards have `spacing.lg` internal padding (24px), not the typical 32px+ of "generous" or 12px of "dense." This is deliberately mid-density — enough breathing room to not feel cramped, not so much that the screen feels empty.

**Content region.** The main session column is centered on desktop with symmetric outer margins that shrink at each breakpoint. Below 768px the sidebar collapses to a top-drawer.

**Asymmetry is used once.** On the landing page, the hero is flush-left with a wide right margin (that's where the sample scenario chip cluster lives). This is the only place in the system that departs from centered symmetry — a single asymmetric gesture is what saves the landing from feeling like a Notion template.

## Elevation & Depth

Depth is conveyed by **tonal layering**, not by shadows. A card sits on the page because its surface is a shade lighter — `surface (#F7F4EE)` on `neutral (#F0EDE7)`. A modal sits on the page because it's on `surface` *and* the page dims behind it (5% black overlay).

**No shadows on static elements.** Not on cards, not on buttons, not on inputs, not on chat bubbles. Shadows imply floating; static elements are not floating.

**One reserved shadow level** for *genuinely* floating things — dropdown menus and modals. Its specification (in prose because `shadow` is not a valid token):

```
box-shadow:
  0 1px 2px 0 rgba(43, 40, 35, 0.08),
  0 8px 24px -4px rgba(43, 40, 35, 0.12);
```

It has a light direction (top-down, y-offset positive), and its color is warm ink (`{colors.primary}`) at low opacity — never neutral `rgba(0,0,0,x)`, which would fight the warmth of the palette.

**Focus rings are visible, warm, and 2px.** Rendered as an outset outline in `{colors.tertiary}` at 60% opacity, 2px thick, 2px offset. Focus is the one place the accent shows up outside a primary action — because accessibility trumps accent scarcity.

**No glassmorphism.** No `backdrop-filter`. No frosted overlays.

## Shapes

Radius is **hierarchical**, not uniform. Different element classes take different radii, chosen for a reason:

- `rounded.none (0px)` — dividers, sidebar edges, sections that meet the viewport edge on mobile.
- `rounded.sm (4px)` — inputs. Sharper than buttons because inputs are precision affordances; sharpness reads as "I'm ready to receive exactly what you type."
- `rounded.md (8px)` — buttons, chips, message-user bubble, feedback-positive label. The default softness.
- `rounded.lg (12px)` — cards, feedback-report container, modals. More curvature for larger containers.
- `rounded.full (9999px)` — avatars and category chips only. Circular affordances signal "identity" (avatar) or "tag" (chip).

**Borders.** 1px hairlines in `{colors.border}` used only where a tonal layer isn't enough — around inputs (to distinguish the field from the surface it sits on), and as the horizontal `divider` between feedback sections. No decorative borders. Never doubled up (border *and* shadow *and* radius on the same element is a tell).

**Input-error borders** override to `{colors.error}` at 1px, and pair the color with a leading error icon and helper text — never color alone.

## Components

Per-component guidance beyond what tokens encode.

### Buttons

- **Primary button** carries the falu red. Exactly one primary per view — usually "Start session," "End session," or "Sign up." If a screen has two candidates for primary, one of them is really secondary.
- **Secondary buttons** are neutral-on-neutral with `{colors.primary}` text. Unlimited count per screen.
- **Text buttons / inline links** are underlined in `{colors.primary}` with `text-underline-offset: 3px`. No color change on links; the underline is the affordance.
- Buttons never have icons *and* long text — pick one. If it's an icon-only button, wrap it in an accessible label.

### Messages (the authored move)

**Chat is deliberately not "chat."** Both user and AI turns are set flush-left in a single column, prefaced by a small uppercase label in `{typography.label-caps}` — "You" for the user, the AI's scenario role for the AI ("Interviewer," "Colleague," "Friend"). This reads as a *transcript*, which is what practice actually is.

- **`message-user`** — background is `{colors.surface}` (a subtle tonal step up from the page), padding `spacing.md`, radius `rounded.md`. Reads as "the words you said out loud, held gently."
- **`message-ai`** — sits directly on `{colors.neutral}` with **no background of its own** — the AI turn is *flush with the page*, as if the AI is speaking directly into the room. Padding is present for reading rhythm but no container encloses it. This asymmetry (user bubbled, AI un-bubbled) is a deliberate weight — the user's contribution gets a container because it's *the thing being practiced*; the AI is scaffolding.

If you find yourself adding a background to `message-ai` "for balance," resist. The imbalance is the point.

### Chips

Used for scenario categories, difficulty labels, and practice-area tags. Set in `label-caps`, uppercase, tracked. Neutral background, `{colors.secondary}` text. Never falu red — the accent is not for taxonomy.

### Inputs

Sharp 4px radius. 1px `{colors.border}` outline. `{colors.surface}` background. On focus, the focus ring (2px falu at 60%) becomes visible; the border does not change color. On error, the border shifts to `{colors.error}`, an error icon appears leading, and helper text appears beneath.

**Never use placeholder text as a label.** Every input has a persistent label above it in `{typography.label-md}`. Placeholders are for example values only.

### The feedback report

The single most designed surface in the product.

- Rendered on `{colors.surface}` at `rounded.lg` with `spacing.xl` internal padding (40px). Feels like a well-set page from a book, not a modal.
- Title (e.g., "Your practice today") in `headline-lg` — Fraunces Bold with `SOFT=100`. Italic if the scenario was informal, upright if formal.
- Section labels ("Strengths," "Where to grow," "Try next time") in `label-caps`, in `{colors.success}` for Strengths and `{colors.primary}` for the others.
- Body copy in `feedback-body` (Fraunces 400, 18px, `SOFT=100`). Line height 1.6. Measure `max-width: 64ch`.
- **Never longer than 300 words end-to-end.** A short considered report beats a long one — see [REQUIREMENTS.md FR-4.1](../docs/02-requirements.md).
- The report has a footer with a subtle 👍/👎 pair (rendered as `label-md` text-buttons, not emoji) for quality signal.

### Landing page

Hero is flush-left. Headline in `display` (Fraunces 700, SOFT=100). Sub-headline in `body-lg`. Primary CTA below (falu red, "Try a session — no signup"). No three-column feature grid; instead, three example scenarios rendered as clickable card previews arranged asymmetrically (one large above, two smaller below).

## Do's and Don'ts

These are enforceable rules for this system specifically. Not generic design advice.

**Color**
- **Do** use falu red for exactly one primary action per view. If two candidates exist, one is really secondary.
- **Don't** introduce a second accent color. If something needs emphasis, use `700` weight, size, or space.
- **Do** encode error state with color *plus* icon *plus* helper text. Never color alone.
- **Don't** use success green outside the feedback report's "Strengths" label. Not in toast messages, not in checkmarks, nowhere.
- **Do** name the referent in copy where you mean the accent color ("the falu red border"). It's why we picked a referent.
- **Don't** substitute pure `#FFFFFF` or `#000000` anywhere. Both are physical harshness; both are prohibited.

**Type**
- **Do** set feedback-report titles in Fraunces with `SOFT=100`. This is the single most important letterform choice in the product.
- **Don't** set chat messages, form fields, or buttons in Fraunces. The working register is Public Sans.
- **Do** use two weights only: 400 and 700. Nothing in between.
- **Don't** center body copy longer than one sentence.
- **Do** constrain body measure to 62–72ch. Feedback-body specifically to 64ch.

**Shape and depth**
- **Do** use tonal layering (`surface` on `neutral`) for depth. Cards are not floating.
- **Don't** put a shadow on a static element. Shadows are for genuinely floating things: modals, dropdowns, focus rings.
- **Do** keep radii hierarchical: 4px input, 8px button, 12px card. Don't mix within a class.
- **Don't** apply border + shadow + radius to the same element. Pick one.

**Chat / messages**
- **Do** render the AI turn flush with the page (no background of its own). This is the authored move.
- **Don't** move the AI turn into a container "for symmetry with the user bubble." The asymmetry is the point.
- **Do** preface every turn with a small uppercase label ("You" / "Interviewer" / "Colleague"). This makes the transcript feel like a script.
- **Don't** use bubble tails, direction pointers, or "typing…" animations. This is not iMessage.

**Motion**
- **Do** use 200ms `ease-out` for state changes (hover, focus, dropdown open).
- **Don't** animate chat message arrival. Messages should be present, not landing.
- **Don't** fade-up-on-scroll. Anywhere. Ever.

**Layout**
- **Do** let `{colors.neutral}` (the page) be visible around every content region. Negative space is the material.
- **Don't** fill a screen edge-to-edge with color fields. This isn't a poster aesthetic.
- **Do** use the asymmetric hero on the landing page. Everywhere else, symmetric-centered.

**Icons**
- **Do** use a single icon set at 1.5px stroke, sized to `1em` (matching adjacent text). Reference set: Lucide, adjusted stroke.
- **Don't** put icons in tinted rounded squares above feature headings. That block is the single most recognizable AI layout unit in existence.
- **Don't** use emoji as feature icons or in body text. Emoji are for the feedback-report rating footer only.

**Copy**
- **Don't** write "Supercharge," "Effortlessly," "10x," "Seamlessly," "Unlock," "Take your X to the next level." Anywhere.
- **Do** say the specific thing OpenMic does. "Practice a conversation before it happens" beats "Level up your communication."
