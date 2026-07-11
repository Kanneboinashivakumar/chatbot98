# Tasks — Hour-by-Hour Build Order

> Fill in your actual remaining hours before starting. Do not reorder — later tasks
> depend on earlier ones being stable, and the priority order protects your judged
> score if you run out of time before finishing everything.

## Block 1 — Make it actually deployable (do this FIRST, it's not optional)

- [ ] Stand up a minimal serverless function (Vercel/Cloudflare Worker/Netlify —
      whichever you already have an account for) that:
  - Accepts a POST with `{ messages: [...] }`
  - Calls the Anthropic API server-side with a real API key stored as an env var
  - Returns the response back to the frontend
- [ ] Update the frontend fetch call to hit your new function's URL instead of
      `api.anthropic.com` directly
- [ ] Deploy, test from a phone on a different network (not your own wifi) that the
      live link actually produces a real chat response end to end
- [ ] **Checkpoint: if this doesn't work, nothing else matters. Do not move to Block 2
      until a stranger's device can open your link and get a real AI response.**

## Block 2 — Close the "must have" gaps from PRD.md §5

- [ ] Away-message cycling (pick 3-4 in-character messages, rotate every ~40s while idle)
- [ ] Idle → "Away" status flip after ~90s of no message sent
- [ ] Sound effects wired in (see DESIGN_SYSTEM.md for sourcing — don't skip the
      copyright note there)
- [ ] Failure-state copy reviewed — force a network failure once (dev tools → offline
      mode) and confirm the in-universe error message shows, not a raw exception
- [ ] Mobile pass: open on an actual phone, confirm buddy list and chat window are both
      usable, text is readable, buttons are tappable

## Block 3 — Visual QA pass

- [ ] Screenshot every screen state (boot, buddy list, chat empty, chat mid-conversation,
      typing indicator, away state) — check nothing overlaps or clips at common window
      sizes (1366x768 is still extremely common on judge laptops, test at that size)
- [ ] Confirm keyboard focus outlines are visible (accessibility, also just looks
      intentional rather than accidental)
- [ ] Re-read every piece of copy in the app once, out loud — clunky phrasing that
      sounds like a person and not an AI-generated placeholder is worth the 10 minutes

## Block 4 — Nice-to-haves, ONLY if Blocks 1-3 are done with time to spare

- [ ] Second offline buddy for flavor
- [ ] Custom favicon + tab title
- [ ] Fake away-message editor popup

## Block 5 — Presentation prep (do not skip, do not leave for the last 10 minutes)

- [ ] Write a 60-90 second spoken script. Structure:
  1. **Hook (10s)**: "What if a real AI chatbot had existed on AIM in 2006?"
  2. **Live demo (35s)**: dial-up boot → buddy list → open chat → send a real message,
     get a real response on screen
  3. **Design rationale (25s)**: name 2-3 specific constraints and why you chose them
     — e.g. "no streaming responses, because 2006 chat clients couldn't render partial
     text — so instead there's a typing indicator, the way real AIM worked"
  4. **Close (10s)**: what it is, one sentence
- [ ] Practice it once out loud with a timer before presenting live — confident and
      rehearsed beats reading off a slide, and criterion 5 explicitly rewards this
- [ ] If slides are required for submission (check the form), keep to 3-4: concept,
      screenshot of buddy list + chat, the "why these constraints" rationale, live link/QR

## Final submission checklist

- [ ] Live URL works from a device that isn't yours, on a network that isn't yours
- [ ] GitHub repo (if required) is public, README explains the concept and setup
- [ ] Google Form fields filled: team name, live link, repo link, any required media
- [ ] Submitted with buffer before the actual deadline, not at the exact minute
