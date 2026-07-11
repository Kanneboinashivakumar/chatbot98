MASTER PROMPT — paste this whole thing into Fable 5

---

I'm building "AI Messenger 2006" (ClaudeBot98) for the RIFT 2026 hackathon, Problem
Statement 1: reimagine a modern app as if it launched in 2006. My concept: an AI
chatbot reimagined as an experimental buddy on AIM/MSN Messenger — genuinely capable
modern AI, wearing the UI, constraints, and personality of mid-2000s chat software.
I'm aiming for 1st place. Deadline is very tight, so give me production-ready code
with minimal back-and-forth, and don't re-litigate the concept — it's locked.

CONTEXT YOU MUST INTERNALIZE FIRST:
The hackathon's own site (rift.vesdiam.com) is itself a full Windows XP desktop skin —
every team will clear "looks 2000s." That is the floor, not a differentiator. I will
only win by (a) depth of execution — behavior that feels period-accurate, not just
paint — and (b) a live app that actually, reliably works when a judge who is not me
clicks the link on a device that is not mine. Prioritize accordingly in every decision.

JUDGING CRITERIA (score against all five, in this priority order when time is tight):
1. Functionality & Usability — the real working chat, end to end, on a stranger's device
2. UI/UX Authenticity to 2000s — XP Luna Blue chrome, period behavior, not just palette
3. Technical Execution — clean code, no console errors, graceful failure states
4. Creativity & Originality — already locked in via the concept, protect it, don't dilute
5. Presentation & Demo — a tight scripted walkthrough explaining WHY each design choice
   maps to a real 2000s technical constraint (bandwidth, no streaming, dial-up latency)
Bonus: AI Integration — the whole app IS the AI feature; don't bolt on a second AI gimmick

WHAT ALREADY EXISTS (attached: ClaudeBot98.html) — build on this, don't rewrite it:
- Dial-up boot/connect sequence (Courier New, animated progress bar)
- XP-chrome buddy list window + XP-chrome chat window (exact palette below)
- Live chat with conversation history and a typing indicator
- Shared visitor counter (Geocities-era hit-counter homage)
- An ORIGINAL synthesized background chiptune (melody + bassline + hi-hat + light echo,
  generated live via Web Audio API — no external audio file, zero copyright exposure)
  with a "Now Playing... [turn off music]" link in the buddy list footer
- Responsive to mobile, visible keyboard focus, reduced-motion respected

DESIGN TOKENS — use these exact values, don't approximate or "modernize" them:
- XP Navy #0a246a / XP Blue #3169c6 / XP Light Blue #a6caf0 / XP Silver #ece9d8
- Online-status green #3ad900 / Away-status orange #f0a30a / visited-link purple #800080
- Chat: user lines #0000cc, bot lines #cc0000
- Fonts: Tahoma (all chrome/menus/buttons), Times New Roman (chat body text only),
  Courier New (boot sequence only) — these are the actual period-correct choices,
  don't substitute a generic sans-serif for "readability"

MUST-HAVE WORK REMAINING, IN THIS ORDER (do not reorder, do not skip ahead):

1. BACKEND PROXY (highest priority, blocks everything else from mattering):
   The current chat call needs a real backend so it works outside a sandboxed preview.
   Build a minimal serverless function (ask me which platform I have — Vercel, Netlify,
   or Cloudflare Workers — before starting) that holds the API key server-side and
   proxies the chat request. Frontend calls that function, never the model API directly.

   USE FIREWORKS, NOT ANTHROPIC — I have Fireworks credits, not a separate Anthropic key.
   Fireworks endpoint (OpenAI-compatible):
     POST https://api.fireworks.ai/inference/v1/chat/completions
     Headers: Authorization: Bearer FIREWORKS_API_KEY, Content-Type: application/json
     Body: model: accounts/fireworks/models/llama-v3p1-8b-instruct,
           max_tokens: 300, messages: [ role/content pairs ]
     Response field to read: choices[0].message.content
   Use this exact small, fast, serverless model (llama-v3p1-8b-instruct) — low latency
   matters more than extra reasoning depth for a live chat demo judges are watching in
   real time. Don't deploy a dedicated/paid-by-the-hour model for this project.
   System prompt to use: "You are ClaudeBot98, an AI chatbot as imagined in the year
   2006 — an early experimental AIM/MSN chatbot. Reply casually, briefly (1-4
   sentences), a little playful and slightly clunky like era chat software, occasional
   lowercase/lol/brb-style texting, but still genuinely helpful and coherent. Never
   mention being a modern AI model or company, stay fully in the retro chatbot persona."

2. AWAY-MESSAGE CYCLING: buddy list should show ClaudeBot98 with an away message that
   rotates through 3-4 in-character lines every ~40 seconds while idle, not one static
   string. High authenticity payoff for low build cost.

3. IDLE TO AWAY STATUS FLIP: if no message sent for ~90 seconds, status flips to "Away"
   with a timestamp, the way real AIM did.

4. SOUND EFFECTS: a sign-on door/whoosh sound and a message-received notification blip.
   DO NOT use ripped copyrighted AOL/MSN/Windows system sound files — that's real IP
   exposure in a public submission. Either source CC0/royalty-free generic "retro
   notification" clips (freesound.org filtered to CC0, Pixabay sound effects) or
   synthesize them the same way the background theme was built (Web Audio oscillators/
   noise burst) — synthesizing is actually preferable since it matches the rest of the
   app's approach and needs no external asset at all.

5. FAILURE-STATE COPY: if the API call fails or times out, show an in-universe message
   (connection lost, carrier dropped, try again in a sec) — never a raw error or
   stack trace visible to a judge. Test this by forcing offline mode in dev tools once.

6. MOBILE PASS: open on an actual phone, confirm buddy list and chat window are both
   legible and usable, not just a shrunk desktop layout.

EXPLICITLY OUT OF SCOPE — do not build, these cost hours for near-zero judged value:
multiple simultaneous chat windows, real user accounts, persistent chat history across
sessions, a native mobile app / APK (web app is explicitly allowed by the brief).

CONTINUITY REQUIREMENT — I may run out of tokens and switch to a different AI tool
mid-build. After every meaningful change (feature done, something broken, a decision
made), update the "Current Status Snapshot" block at the top of PROGRESS_LOG.md and
add a new dated entry below it — do this automatically without me asking. If you are
a fresh session picking this up mid-build, read PROGRESS_LOG.md's most recent entries
FIRST, before anything else, so you know exactly what's done and what's next.

FINAL DELIVERABLE CHECKLIST (don't consider this done until all of these are true):
- Live URL works when opened from a device that is not mine, on a network that is not mine
- No console errors on load or during a full chat interaction
- A judge can complete sign-on, open chat, send a message, get a real reply in
  under 60 seconds without any instruction from me
- PROGRESS_LOG.md reflects the true current state at all times

Start now with item 1 (backend proxy + Fireworks integration). Ask me which hosting
platform I have an account with before writing the deployment config.

---
