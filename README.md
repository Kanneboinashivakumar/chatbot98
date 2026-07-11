# AI Messenger 2006 — ClaudeBot98

A genuinely capable modern AI chatbot, reimagined as an experimental buddy on AIM/MSN Messenger — as if it had launched in 2006.

## The concept

RIFT 2026, Problem Statement 1: reimagine a modern app as if it launched in 2006. We chose the AI chatbot — the defining app of the 2020s — because it is the one modern product that most obviously *couldn't* have existed in 2006, which makes imagining it there the most interesting version of the prompt. In 2006, "chatting with a bot" meant SmarterChild: canned replies, no memory, novelty over utility. ClaudeBot98 asks what it would have felt like if the real thing had quietly shown up on your buddy list.

The core idea is that the AI underneath is real and fully functional, but it wears the UI, constraints, and personality of mid-2000s chat software. It doesn't stream tokens — 2006 chat clients couldn't render partial text, so you get a typing indicator instead, the way AIM actually worked. It replies briefly and casually, in period voice. The boot sequence dials up. The point is not a retro skin bolted onto a chat app; it's a period-accurate messenger experience that happens to have a modern brain.

## Features

- **Dial-up boot sequence** — the signature beat: modem handshake, connection progress, "CONNECT 33600." You didn't just open apps in 2006; you signed on.
- **XP-chrome buddy list and chat window** — Luna Blue title bars, correct system fonts, hit-area-sized buttons; period behavior, not just palette.
- **Live AI chat** — a real model (Fireworks AI) behind a serverless proxy, with conversation history and a typing indicator standing in for streaming, since era clients couldn't render partial messages.
- **In-universe failure states** — if the API call fails or times out, the bot reports a dropped carrier, not a stack trace; connections dying mid-conversation was simply part of 2006.
- **Original synthesized background chiptune** — a "Now Playing: ai_messenger_theme.mid" loop generated live with the Web Audio API (with a "[turn off music]" link, as etiquette demanded). Synthesized rather than sampled, so no copyrighted audio ships with the app.
- **Visitor counter** — the Geocities-era hit counter, because no 2006 page was complete without one.

## Tech stack

- **Frontend:** vanilla HTML/CSS/JS in a single file — no framework, no build step. The background music is synthesized at runtime with the Web Audio API.
- **Backend:** one Vercel serverless function (`api/chat.js`) acting as an API proxy.
- **Model:** DeepSeek V4 Pro via Fireworks AI. Chosen deliberately: replies are short, casual, persona-driven turns where latency matters more than reasoning depth, and a fast model keeps the live demo snappy.

## Architecture

The model API key is never exposed client-side. The browser only ever talks to the serverless function, which holds the key in an environment variable, sanitizes the request, and calls Fireworks with a server-side system prompt and a 20-second timeout. Errors come back as opaque codes that the frontend translates into in-universe copy.

```
Browser  →  POST /api/chat (Vercel function, holds FIREWORKS_API_KEY)  →  Fireworks AI  →  reply
```

## Design system

The period-accurate choices are specific, not approximate:

| Token | Value | Use |
|---|---|---|
| XP Navy | `#0a246a` | Title bar gradient, deepest shade |
| XP Blue | `#3169c6` | Title bar gradient mid |
| XP Light Blue | `#a6caf0` | Highlights, group headers |
| XP Silver | `#ece9d8` | Window chrome |
| Online Green | `#3ad900` | Status dot |
| Away Orange | `#f0a30a` | Away status |
| Visited-link Purple | `#800080` | Buddy name links |
| Chat User / Bot | `#0000cc` / `#cc0000` | Message colors |

Fonts: **Tahoma** for all window chrome (the actual XP system font), **Times New Roman** for chat body text (AIM's default), **Courier New** for the boot sequence only.

## Running locally

```
git clone <repo-url>
cd claudebot98
npm i -g vercel          # only dependency; the app itself has none
vercel dev
```

Add your Fireworks key before starting: create `.env` with `FIREWORKS_API_KEY=<your key>` (or `vercel env add FIREWORKS_API_KEY`). Open the printed localhost URL and sign on.

## Live demo

Live demo: [URL]

## Judging criteria alignment

| Criterion | How this project addresses it |
|---|---|
| Creativity & Originality | Reimagines the one modern app that most defines the 2020s inside the one social experience that most defined 2006, and commits fully to the fiction. |
| UI/UX Authenticity | Exact XP Luna palette and system fonts, plus period *behavior* — dial-up sign-on, typing indicator instead of streaming, away etiquette. |
| Functionality & Usability | A judge can sign on, open the chat, and get a real AI reply in under a minute with no instructions. |
| Technical Execution | Clean single-file frontend, key-safe serverless proxy with input sanitization and timeouts, and failure states that never show a raw error. |
| Presentation & Demo | Every design choice maps to a named 2000s technical constraint, and the demo walks that mapping live. |
| AI Integration (bonus) | The AI isn't a feature of the app — it is the app; everything else exists to frame it. |

## Known limitations

The visitor counter is currently per-device (localStorage) rather than truly shared across all visitors — a deliberate scope decision, since a shared counter needs a persistent KV store and hackathon hours were better spent on the core chat path. Chat history intentionally does not persist across sessions; neither did your 2006 IM logs unless you turned that on.
