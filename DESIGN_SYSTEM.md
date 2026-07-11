# Design System — AI Messenger 2006

Everything below is already implemented in the base prototype (ClaudeBot98.html).
Use this as the reference sheet so any AI tool making changes stays consistent,
rather than drifting toward generic "retro" defaults.

## Palette (exact hex values — don't approximate)

| Token | Hex | Use |
|---|---|---|
| XP Navy | `#0a246a` | Title bar gradient start, deepest shade |
| XP Blue | `#3169c6` | Title bar gradient mid |
| XP Light Blue | `#a6caf0` | Selected-item highlight, group headers |
| XP Silver | `#ece9d8` | Window chrome background |
| AIM/MSN Green | `#3ad900` | Online status dot |
| Away Orange | `#f0a30a` | Away status dot (not yet used — add if implementing away state) |
| Visited-link Purple | `#800080` | Buddy name links |
| Chat User Blue | `#0000cc` | User's own chat lines |
| Chat Bot Red | `#cc0000` | Bot's chat lines |

Do not introduce modern flat-design colors, gradients softer than the ones specified,
or rounded corners beyond the 2px chrome radius already in the CSS — those read as
2010s "flat design," not mid-2000s XP chrome, and will look wrong next to every other
team's more literal Y2K skin.

## Typography

- **Tahoma** — all window chrome, menus, buttons, status text (the actual real XP system font)
- **Times New Roman** — chat message body text (matches real AIM default font)
- **Courier New** — boot/dial-up sequence only

Do not swap in a generic sans-serif "for readability" — the specific font choices are
part of what makes this read as authentic rather than approximate.

## Sound effects — what to add, and a copyright note

Adding sound is a "must have" per PRD.md. But be careful here:

**Do NOT** rip and embed the actual AOL/MSN/Windows XP system sound files (the real
"door" sound, the real Windows XP startup chime, the real AIM "door" clip) — these are
copyrighted audio owned by AOL/Microsoft, not open assets, and embedding them verbatim
in a public submission is a real IP risk, however small a hackathon judge might consider
it. It's also not necessary — the *reference* to the sound is what people recognize, not
needing the identical waveform.

**Do this instead:**
- Search royalty-free / CC0 sound libraries (e.g. freesound.org filtered to CC0, or
  Pixabay's sound effects section) for generic "retro door open," "digital notification
  blip," "modem dial tone" effects — these exist widely as generic sound-design assets
  and aren't tied to a specific company's copyrighted clip
- Or record/synthesize a close approximation yourself — a short square-wave blip for
  the notification sound is trivial to generate and instantly reads as "2000s IM ping"
  without being a copy of anyone's specific asset

Two sounds are enough: one on sign-on (door/whoosh), one on message received (blip).
Don't add more — the two well-chosen restrained sounds land harder than a wall of them.

## Signature element (already built — don't dilute it)

The dial-up boot sequence is the one "spend your boldness here" moment per the design
brief. Everything else in the app should stay disciplined and quiet around it. Resist
the urge to add more animated flourishes elsewhere — the boot sequence being the single
memorable beat is a feature, not something to average out by adding motion everywhere.

## Layout notes for whoever extends this

- Buddy list and chat window are both plain CSS windows (`.win` class), not actual
  OS-level draggable windows — don't try to add real window-dragging/resizing unless
  there's genuinely spare time in Block 4; it's high effort for a criterion (functionality)
  that's already satisfied by the chat working correctly
- Everything is a single HTML file on purpose — keep it that way unless the backend
  proxy (Block 1) requires splitting frontend/backend into separate deployable pieces
