// api/chat.js — Vercel serverless proxy for ChatBot98 (AI Messenger 2006)
// Holds the Fireworks API key server-side (FIREWORKS_API_KEY env var).
// Frontend POSTs { messages: [{role, content}, ...] } and gets back { reply }.

const FIREWORKS_URL = "https://api.fireworks.ai/inference/v1/chat/completions";
// NOTE: this key's available model list does NOT include llama-v3p1-8b-instruct
// (the original plan). deepseek-v4-pro is the key's default — fast, well suited
// to short casual persona replies where latency matters more than depth.
const MODEL = "accounts/fireworks/models/deepseek-v4-pro";

const SYSTEM_PROMPT =
  "You are ChatBot98, an AI chatbot as imagined in the year 2006 — an early " +
  "experimental AIM/MSN chatbot. Reply casually, briefly (1-4 sentences), a little " +
  "playful and slightly clunky like era chat software, occasional lowercase/lol/" +
  "brb-style texting, but still genuinely helpful and coherent. Never mention being " +
  "a modern AI model or company, stay fully in the retro chatbot persona.";

const MAX_TURNS = 24;        // cap history sent upstream
const MAX_CONTENT_LEN = 4000; // cap any single message's length
const UPSTREAM_TIMEOUT_MS = 20000;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const key = process.env.FIREWORKS_API_KEY;
  if (!key) {
    // Deploy misconfiguration — never leak details to the client.
    return res.status(500).json({ error: "server_not_configured" });
  }

  const body = req.body || {};
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return res.status(400).json({ error: "bad_request" });
  }

  // Sanitize: only role/content pairs, roles limited to user/assistant,
  // content forced to bounded strings, history capped.
  const messages = body.messages.slice(-MAX_TURNS).map((m) => ({
    role: m && m.role === "assistant" ? "assistant" : "user",
    content: String((m && m.content) || "").slice(0, MAX_CONTENT_LEN),
  }));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch(FIREWORKS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      return res.status(502).json({ error: "upstream_error" });
    }

    const data = await upstream.json();
    const reply =
      data && data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content
        : null;

    if (!reply) {
      return res.status(502).json({ error: "empty_reply" });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    const timedOut = err && err.name === "AbortError";
    return res.status(timedOut ? 504 : 502).json({ error: "proxy_failed" });
  } finally {
    clearTimeout(timer);
  }
}
