# Handoff Prompt — paste into Fable / Antigravity

---

I'm building "AI Messenger 2006" (codename ClaudeBot98) for the RIFT 2026 hackathon,
Problem Statement 1: reimagine a modern app as if it launched in 2006. My concept: an
AI chatbot imagined as an experimental buddy on AIM/MSN Messenger, with real working AI
underneath a period-accurate XP-chrome messenger UI.

I have a working base prototype already (attached: ClaudeBot98.html) with: dial-up boot
sequence, XP-chrome buddy list, XP-chrome chat window, a real live API call with
conversation history and a typing indicator, and a shared visitor counter.

Attached context files — read PRD.md first, it explains the competitive situation and
exactly what's must-have vs nice-to-have vs explicitly out of scope. Then TASKS.md for
the build order (do NOT reorder — Block 1, the backend proxy, is the most important
single task and has to happen before anything else, since the current build only
works inside a Claude preview sandbox, not on independent hosting). DESIGN_SYSTEM.md
has the exact palette/type tokens and a note on sound effects — read the copyright
note there before adding any audio, don't embed ripped copyrighted system sounds.

Deadline is very tight (submission due 10:00 AM). Give me production-ready, minimal
back-and-forth code. Don't re-litigate the concept or suggest a different app/theme —
it's locked. Don't add scope beyond what PRD.md lists as must-have unless I explicitly
ask. If something in the existing prototype is broken, fix it in place rather than
rewriting from scratch.

Start with Block 1 from TASKS.md: build the serverless proxy function so the live app
actually works when deployed outside Claude's preview environment. Ask me which
hosting platform I have an account with (Vercel/Netlify/Cloudflare) if you need that
before starting.

IMPORTANT — deadline is tight and I may need to switch AI tools mid-build if I run out
of tokens or hit a limit. After every meaningful change (a feature completed, something
broken, a decision made), update the "Current Status Snapshot" block at the top of
PROGRESS_LOG.md and add a new dated entry below it — do this automatically, don't wait
for me to ask. If you're a fresh session picking this up, read PROGRESS_LOG.md's most
recent entries FIRST, before reading anything else, so you know exactly what's done and
what's next rather than re-deriving it from scratch.

---
