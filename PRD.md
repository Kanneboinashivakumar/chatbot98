# PRD — ClaudeBot98 / "AI Messenger 2006"
**RIFT 2026 Hackathon · Problem Statement 1 · Submission deadline: 10:00 AM (check exact hour remaining before starting)**

## 1. The Real Competitive Situation — read this before building anything

RIFT's own site is a full Windows XP desktop skin with MSN-style buddy icons, a start bar,
and Register.exe/Judges.exe desktop icons. **Every team at this hackathon is going to nail
"looks like the 2000s."** That is the floor, not the ceiling. Y2K aesthetic alone will not
win — it's table stakes. The prize goes to whoever executes the illusion most convincingly
and completely, and whoever picks the sharpest concept within the theme.

Do not spend extra hours making the UI "more Y2K." Spend extra hours making the existing
concept deeper, more functional, and more polished in the specific dimensions the judges
actually score (see §3).

## 2. Concept

**AI Messenger 2006** — ClaudeBot98, imagined as an experimental AI chatbot buddy that
would have existed on AIM/MSN Messenger in 2006, years before real chatbots were good.
The joke and the value are the same thing: a genuinely capable modern AI, wearing the
UI, constraints, and personality quirks of mid-2000s chat software.

**Not**: a chat app with a retro skin bolted on.
**Is**: a period-accurate messenger experience where the AI itself behaves like software
of that era would have (slower "typing," period slang, era-appropriate uncertainty about
what it can do) while actually being a real, working assistant underneath.

## 3. Judging Criteria → What To Actually Build (mapping, in priority order)

| Criterion | What satisfies it | Priority |
|---|---|---|
| Creativity & Originality | The "AI chatbot as an experimental 2006 AIM buddy" framing itself, plus period-accurate quirks (see §5) | Already locked — protect it, don't dilute it |
| UI/UX authenticity to 2000s | XP Luna Blue chrome, Tahoma/Times New Roman fonts, dial-up boot sequence, buddy list — already built in prototype | HIGH — polish pass |
| Functionality & usability | Real working chat, no dead buttons pretending to be alive, clear happy path a judge can complete in <60 seconds | HIGHEST — do not compromise |
| Technical execution | Clean code, no console errors, handles a failed API call gracefully, responsive down to a judge's laptop | HIGH |
| Presentation & demo | A tight, confident script explaining *why* every design choice maps to a real 2000s constraint | HIGH — see TASKS.md |
| Bonus: AI integration | The whole app *is* the AI feature — already structurally true, don't add a second bolted-on AI gimmick that dilutes this | Protect, don't add more |

## 4. What's already built (starting point, not from scratch)

- Dial-up boot/connect sequence
- XP-chrome buddy list window
- XP-chrome chat window with real Claude API call, conversation history, typing indicator
- Shared visitor counter (Y2K hit-counter homage)
- Responsive down to mobile, keyboard-focus visible, reduced-motion respected

## 5. What's NOT built yet — this is tonight's real work

**Must have (these are what separate "prototype" from "winning submission"):**
- [ ] **Away-message / status system** — buddy list should show ClaudeBot98 with a real
      away message that updates (e.g. cycles between a few authentic-sounding away
      messages), not a static string. This is a small build, high authenticity payoff.
- [ ] **Sound effects** — see DESIGN_SYSTEM.md for what to use and, importantly, what
      NOT to rip directly (copyright note in that file). At minimum: a "door open/close"
      sound on sign-on, a notification "blip" on new message received.
- [ ] **Failure-state handling** — if the API call fails or is slow, the in-universe
      response should be "connection dropped" / "carrier lost," not a generic error.
      (Partially done — extend it, make sure it never shows a raw error to the judge.)
- [ ] **A believable "away" idle state** — if no message is sent for ~90 seconds, the
      status could flip to "Idle" the way real AIM did, with a small timestamp.
- [ ] **Backend proxy for the API key** — the current build calls the API directly from
      the browser, which only works inside Claude's own preview sandbox. For a real,
      independently-hosted submission, wire a minimal serverless function (Vercel /
      Cloudflare Worker / Netlify function — pick whichever you're fastest in) that holds
      the real API key server-side and the frontend calls that instead. This is the
      single most important non-visual task — without it, the judges can't actually use
      your live link.
- [ ] **Mobile pass** — confirm the chat window and buddy list are both actually usable
      on a judge's phone if they open the live link there, not just resized-desktop.

**Nice to have, only if the above is airtight with time to spare:**
- [ ] A second buddy in the list, offline, with a grayed-out icon and "Last seen: never"
      — pure flavor, reinforces "you found something niche," costs almost nothing to add
- [ ] A fake "away message editor" popup (cosmetic only, doesn't need to persist)
- [ ] Custom favicon / browser tab title styled like a 2006 page title

**Explicitly out of scope — do not build these, they cost hours for near-zero judged value:**
- Multiple chat windows / multi-buddy chat
- A real user account system
- Persistent chat history across sessions (the shared visitor counter is enough
  "persistence" flavor)
- Mobile app / APK — web app is explicitly allowed per the challenge brief

## 6. The one thing to protect above all else

If you're cutting scope under time pressure, cut from the "nice to have" list first,
then cut sound effects before you'd ever cut the backend proxy or the core chat
functionality. **A judge who can't get the live link to actually respond scores you
near zero on the highest-weighted criterion (Functionality & Usability), regardless
of how good the visual design is.** Protect working functionality over additional polish,
always, in every tradeoff tonight.
