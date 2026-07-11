# Progress Log — AI Messenger 2006

> Whoever is building (Fable, Antigravity, or a fresh Claude session) MUST update the
> "Current Status Snapshot" block below after every meaningful change — new feature
> done, something broken, a decision made. This is what makes switching AI tools
> mid-build safe. Do not skip this even under time pressure; it takes 30 seconds and
> saves far more than that the moment a session gets interrupted.

## Current Status Snapshot (overwrite this block each update, don't just append)

**Last updated by:** Fable 5 (Claude desktop) at 2026-07-11 ~19:55 IST
**Deadline remaining:** submission due 10:00 AM — confirm exact hours yourself
**Currently working on:** Model switched to deepseek-v4-pro (llama-v3p1-8b-instruct NOT available on this key). README done. Block 1 code COMPLETE; awaiting user's Vercel deploy + stranger's-device test (Block 1 checkpoint)
**Currently blocked on:** user must deploy to Vercel and set FIREWORKS_API_KEY env var (AI session can't log into their Vercel account)
**API in use:** Fireworks — model: `accounts/fireworks/models/deepseek-v4-pro` (via /api/chat proxy, key server-side only)

**Feature checklist:**
- [x] Dial-up boot sequence
- [x] XP-chrome buddy list + chat window
- [x] Live chat wired to a model (Fireworks via /api/chat serverless proxy — code done, deploy pending)
- [x] Visitor counter (window.storage in preview; localStorage per-device fallback on real deploy — NOT globally shared on Vercel, see 07-11 entry)
- [x] Synthesized background chiptune + turn-off-music link
- [~] Backend proxy for real API key — **code written + smoke-tested, needs deploy + phone test to check the Block 1 checkpoint**
- [ ] Away-message cycling
- [ ] Idle → Away status flip
- [ ] Sign-on / message-received sound blips
- [ ] Failure-state copy reviewed (forced offline test)
- [ ] Mobile pass on a real device
- [ ] Presentation script written + practiced
- [ ] Submitted

## Log Entries (newest on top)

### 2026-07-11 ~19:50 IST — Fable 5 session (README)
**Done:**
- Wrote `README.md` for submission: pitch, concept, features (only what's actually
  built per this log — away-cycling/idle-flip/sound FX deliberately NOT listed),
  tech stack, key-safety architecture note + text flow diagram, design-token table,
  local dev steps (`vercel dev` + FIREWORKS_API_KEY), judging-criteria table,
  honest known-limitations section (per-device visitor counter).
**Broken / blocked:**
- Nothing new. Deploy still pending (user's job).
**Next step:**
- User fills in "Live demo: [URL]" placeholder in README.md after deploying.
- If Block 2 features (away cycling, idle flip, sound FX) get built later, ADD them
  to the README features list — it currently reflects true state on purpose.
**Notes for next AI session (gotchas, don't redo this):**
- README exists and is accurate as of this entry — update it alongside new features,
  don't rewrite it from scratch.

### 2026-07-11 ~19:40 IST — Fable 5 session (Block 1)
**Done:**
- Created `api/chat.js` — Vercel serverless function. POST `{messages}` → Fireworks
  `llama-v3p1-8b-instruct`, max_tokens 300, system prompt held SERVER-side,
  key from `FIREWORKS_API_KEY` env var. 20s upstream timeout (AbortController),
  input sanitization (roles forced to user/assistant, content stringified +
  capped 4000 chars, history capped to last 24 turns), never leaks raw errors —
  returns `{error: "..."}` codes only; frontend maps any non-OK to in-universe copy.
- Frontend fetch swapped: `api.anthropic.com` direct call → `POST /api/chat` with
  `{messages: history}`, reads `data.reply`. Non-OK/empty responses throw → existing
  in-universe "*connection lost* ... modem dropped carrier" catch handles them.
- Renamed `ClaudeBot98.html` → `index.html` (Vercel serves it at `/`; same-origin
  so no CORS needed).
- Visitor counter: `window.storage` is a Claude-preview-sandbox-only API. Added
  localStorage fallback (seeds at 1336 → first deployed visit shows 001337) so it
  still ticks up per device instead of silently breaking. NOT a shared global
  counter on Vercel — that would need a KV store; deliberately deferred, graceful.
- Fixed CSS typo (`linear-gndient`) in `.winbtns span`.
- Added `.gitignore` (.env, .vercel, node_modules).
- Smoke-tested handler in Node with mocked fetch — 9/9 cases pass: happy path,
  405/400s, upstream 500→502, network fail→502, timeout→504, missing key→500,
  sanitization (role/content/24-turn cap). Frontend `<script>` passes `node --check`.
**Broken / blocked:**
- Deploy itself — user must run it (Vercel account). Steps given in chat: import repo
  or `vercel`, set FIREWORKS_API_KEY for Production, `vercel --prod`, then test from
  a phone on cellular data (not their wifi).
**Next step:**
- User deploys + confirms end-to-end reply on a stranger's device → Block 1 checkpoint
  passes → then Block 2 (away-message cycling, idle→away flip, synthesized sound FX,
  failure-copy forced-offline test, mobile pass).
**Notes for next AI session (gotchas, don't redo this):**
- USE FIREWORKS, NOT ANTHROPIC — model string above is exact; don't "upgrade" it,
  low latency was an explicit decision (live demo). Response field: choices[0].message.content.
- System prompt lives in api/chat.js only — do not re-add it to the frontend.
- Sound FX (Block 2): synthesize via Web Audio like the existing chiptune — explicit
  decision, no ripped AOL/MSN/XP sounds (copyright, see DESIGN_SYSTEM.md).
- `index.html` is the old ClaudeBot98.html renamed — do not recreate ClaudeBot98.html.
- No package.json on purpose — Vercel handles ESM in api/*.js natively; don't add
  build tooling.

---
*(copy the block above for each new entry — don't delete old entries, just add above them)*
