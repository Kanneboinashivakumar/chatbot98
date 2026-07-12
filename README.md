# 🤖 ChatBot98: AI Messenger 2006

[![ChatBot98 Interface](./videoframe_20769.png)](https://chatbot98-a8il.vercel.app)

*   **Live Demo URL**: [chatbot98-a8il.vercel.app](https://chatbot98-a8il.vercel.app)
*   **Video Demo**: [Watch presentation video](./chatbot89.mp4)

What if a real AI chatbot had existed on AIM back in 2006? **ChatBot98** is exactly that — a genuinely capable modern AI assistant wrapped entirely in period-accurate 2000s messenger software and constraints.

---

## 💡 Why This Fits the Brief

Per the competition guidelines: the 2000s constraint applies to the UI/UX, design language, and behavior—while the underlying engine must remain fully modern and functional. 

Our split architecture reflects this split directly:
*   **Modern Backend**: A serverless function proxying securely to a DeepSeek LLM.
*   **Retro Frontend**: A complete web desktop environment honoring the visual systems, animations, and technical boundaries of 2006.

---

## 🎨 Three Era Skins (The Design Engines)

Toggle between the three major design trends of the Y2K/2000s era directly from the desktop taskbar:

### 🌻 1. Windows XP Luna Blue (Skeuomorphic)
*   **Titlebars**: Luna blue gradients with rounded header caps and XP's bright red close button.
*   **Fonts**: XP's system-native **Tahoma** for window chrome; **Times New Roman** (AIM default) for chat body text.
*   **Background**: Soft volumetric clouds and drifting Y2K bubble nodes.
*   **Portal Shortcut**: Vintage ICQ Daisy Flower (`🌻`).

### 🔮 2. Frutiger Aero (Glossy Glassmorphism)
*   **Titlebars**: Glassmorphic panels using `backdrop-filter: blur(18px) saturate(125%)` overlays and reflective titlebar sheens.
*   **Water Ripples**: Background applies a live fluid wave filter (`feTurbulence` + `feDisplacementMap` SVG) animated continuously.
*   **Condensation Droplets**: Glistening, translucent water droplets (`.aero-droplet`) scattered across active windows.
*   **Portal Shortcut**: High-gloss crystal orb (`🔮`).

### 💀 3. Cyber Y2K (Hacker Grid)
*   **Titlebars**: High-contrast neon green accents (`#00ff66`) on pitch black.
*   **Dynamic Matrix Rain**: Canvas drawing falling binary rain streams alongside an oscillating vector grid landscape.
*   **3D Wireframe Engine**: A custom **3D perspective projection renderer** on the canvas that draws a spinning vector sphere underneath a green target tracking crosshair.
*   **Portal Shortcut**: Glowing terminal skull (`💀`).

---

## ⚙️ Design Decisions & Constraints

Every feature maps directly to a real 2006 technical constraint:
*   **No Token Streaming**: 2006 chat clients could not render partial text. Instead of streaming, we built a simulated, dot-cycling typing indicator (`brb, thinking...`) to represent real-time generation latency.
*   **Period Voice**: The bot's system prompt is tuned to reply casually and briefly with era-appropriate slang (lots of lowercase, `lol`, and `brb`).
*   **Synthesized Audio**: Ripping AOL or Windows system sounds carries copyright risks. To stay true to the era's audio signature, all notification chimes and connection sweeps are **synthesized programmatically at runtime using the Web Audio API**.
*   **In-Universe Failure States**: If the API call times out or fails, the app doesn't show a stack trace. It displays a carrier drop message, because connections dying mid-conversation was simply part of 2006.

---

## ✨ Features & Desktop Utilities

*   **Dial-up Boot Sequence**: An authentic CRT-monitor screen simulation with green scanlines, phosphorTrace oscilloscope wave animations, and real-time synthesized dial-up handshakes.
*   **Y2K Sparkle Cursor Trail**: A custom pointer-events canvas overlay rendering 4-pointed retro stars that follow mouse movements (gold for XP, cyan for Aero, green for Cyber). Fully bypassed on touch devices.
*   **Windows Media Player**: A draggable widget equipped with play/pause controls, volume sliders, and a **frequency visualizer canvas** synced to the background chiptune track.
*   **My Documents (Notepad Reader)**: Double-clicking mock files (`secrets.txt`, `music_list.txt`) reads content dynamically inside a simulated Notepad editor.
*   **Internet Explorer (Simulated Search)**: A styled browser window with a search field. Querying keywords (like `neocities`, `geocities`, `webring`) returns list directories of active retro sites.
*   **Recycle Bin**: Emptying the trash plays a custom synthesized deletion sound and swaps the desktop shortcut to empty (`🗑️`).

---

## 📱 Mobile Responsiveness
*   **Viewport Injection**: Fitted with `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">` to prevent mobile browser automatic desktop scaling.
*   **Adaptive Media Queries**: All windows utilize `!important` mobile overrides, resizing automatically to `92vw`–`94vw` on screens smaller than `560px` to prevent overflow or out-of-bounds clipping.
*   **Touch Events**: Binds `touchstart`, `touchmove`, and `touchend` handlers alongside mouse events for dragging windows on touchscreens.

---

## ⚙️ Running Locally

1.  Clone the repository:
    ```bash
    git clone https://github.com/Kanneboinashivakumar/chatbot98.git
    cd chatbot98
    ```
2.  Install Vercel CLI (our only dependency; the app uses vanilla code):
    ```bash
    npm i -g vercel
    ```
3.  Create a local `.env` file in the root directory:
    ```env
    FIREWORKS_API_KEY=your_api_key_here
    ```
4.  Start local development:
    ```bash
    vercel dev
    ```

---

## ⚠️ Known Limitations
*   **LocalStorage Hit Counter**: The visitor counter is currently per-device (localStorage) rather than a globally shared counter — a deliberate scope decision given the hackathon timeline.
*   **No Chat Persistence**: Chat history intentionally does not persist across sessions; neither did your 2006 IM logs unless you explicitly configured logs.
