# Future Accessibility & Customisation Features

Ideas for implementation. Add to this list as ideas come up.
Prioritise by impact and feasibility.

---

## READY TO IMPLEMENT (architecture exists)

| Feature | What it does | Dependencies |
|---|---|---|
| **Focus Label via Tooltip atom** | Focus tooltip uses real Tooltip component with bottom bar, AAC cards, positioning | Tooltip atom, AAC resolver |
| **Focus Label AAC** | Focus tooltip shows AAC pictogram for element type (Button = hand symbol, Link = chain, Image = picture) | AAC card system, D1 symbol data |
| **FormField test page** | Full audit with new focus/highlight/textonly system | FormField atom |
| **Link/List test pages** | Quick audit — simple atoms | Link, List atoms |
| **Nav keyboard audit** | Full mega menu keyboard handling, collapsible submenus | GlassNav organism |
| **Dim overlay proper architecture** | Coloured wash overlay that works with OverlayScrollbars stacking | Focus system, z-index architecture |
| **Grid responsive via token** | `--grid-columns` token read by `.base-grid` for single-column modes | Grid organism audit |

---

## SHORT TERM IDEAS

| Feature | What it does | Notes |
|---|---|---|
| **Gamepad API navigation** | PS5/Xbox/Switch controller as keyboard. D-pad = Tab/Enter/Escape. Face buttons = activate/back/toggle/next. L2/R2 = zoom. ~50 lines of JS because focus system handles everything. | `src/lib/interaction/gamepad.ts`. Toggle: "Game Controller Navigation" in Your View. |
| **Voice Input (Web Speech API)** | Browser speech-to-text fills focused FormField. Triangle/Y on controller starts listening. No install, no cost. | `src/lib/interaction/voice-input.ts`. Works with gamepad: Triangle = start listening. |
| **DPad Overlay** | On-screen directional pad for eye gaze/dwell/switch users. 5 big targets (up/down/left/right/centre). Context-aware: browse = navigate focus, presentation = control slides, workbook = navigate sections, AAC = navigate symbols. Just sends keyboard events — focus system does the rest. | Wire existing DPadMenu/RadialMenu components. Part of Easy Click preset. |
| **Your View page redesign** | Accordion sections, live preview of each option, tiered sub-options (e.g. Rainbow → spinning/cycling/glow/dim toggles). Collapsible — only one section open. Current value badge visible when collapsed. | Same atoms: Card, Heading, FormField, Badge. JSON-driven. |
| **Bottom bar AAC companion** | Bottom bar shows AAC pictograms for visible/focused text simultaneously. Not either/or — both text on screen AND symbols in bar. Modes: scroll sync, focus sync, tooltip, focus label. All stack. | Extends existing Tooltip bottom bar. |
| **Practice sandbox page** | Safe playground with target practice. "Navigate to the blue button" → confetti on success → next target. Free roam mode for exploring. Difficulty scales. | Uses existing confetti system. JSON target list. Great for learning controller/switch/eye gaze. |
| **Custom caret system** | Hide OS caret (`caret-color: transparent`), render custom caret via pseudo-element. Fully tokenised: `--caret-width`, `--caret-color`, `--caret-blink-speed`, `--caret-radius`. All gates work: motion=none solid, gentle=slow pulse, rainbow=colour cycling, HC=max contrast, assistive=4px thick. | `src/lib/interaction/custom-caret.ts`. Your View: Default/Block/Still/Block Still/Rainbow. |
| **Caret position tracking** | Read OS caret position (selectionStart) for visual feedback on long forms. Progress bar at top, section colour matching, field counter ("3 of 12"), completion glow (green on valid), error pulse (red). Caret position drives scroll-to-visible in textareas. | Two layers: OS owns position logic, we own visual. `--form-progress` token drives progress bar width. |

---

## MEDIUM TERM IDEAS

| Feature | What it does | Notes |
|---|---|---|
| **Wellbeing breaks** | Timed prompts to take breaks. Gentle overlay with breathing exercise, stretch suggestion, or nature image. Timer configurable in Your View. Respects user's motion/visual settings. | Could integrate with PhysicsOverlay for calming particle effects. Uses existing opacity-gate for overlay. |
| **Wellbeing games overlay** | Simple accessible mini-games during breaks. Pattern matching with AAC symbols. Colour sorting (uses rainbow tokens). Memory card flip (uses FlipCard atom). All playable with keyboard/controller/DPad/voice. | Reuses existing atoms: FlipCard, Badge, Button, confetti. Games are accessible by default because they use the same focus system. |
| **Focus reading ruler** | Horizontal line that follows focus/scroll position. Helps dyslexic users track which line they're reading. Toggleable width and opacity. | CSS overlay, follows scroll position or focused element. |
| **Text-to-speech** | Browser reads focused element aloud. Web Speech Synthesis API. Voice/speed/pitch configurable. Highlights word being read. | `speechSynthesis.speak()`. Pairs with AAC — reads the symbol label. |
| **Saved reading position** | Bookmark where user left off. Returns to exact scroll position + section on next visit. Visual marker shows "you were here". | localStorage. GSAP scroll to saved position on load. |
| **Multi-user presets** | More than 3 preset slots. Name them. Share via URL parameter. Import/export as JSON. | Extends existing preset system. `?preset=base64` URL param. |
| **Guided tour mode** | Step-by-step introduction to the site. Focus moves automatically between key elements with explanatory tooltips. Pauseable. | Uses focus system + Tooltip atom + timer. JSON-driven tour steps. |

---

## LONG TERM / AMBITIOUS IDEAS

| Feature | What it does | Notes |
|---|---|---|
| **Eye gaze calibration** | Built-in calibration page for webcam eye tracking (WebGazer.js). Maps gaze to DPad quadrants. No hardware needed — just a webcam. | WebGazer.js is open source. Calibration = practice sandbox with targets. |
| **Emotion detection** | Webcam reads facial expression → adjusts UI. Confused face → simplify layout. Frustrated → offer help. Happy → confetti. | Ethics: opt-in only, no data stored, camera feed never leaves browser. |
| **Collaborative mode** | Two users navigate together. Therapist sees client's screen, can highlight elements, guide focus. Real-time shared cursors. | WebRTC or WebSocket. Therapeutic use case: remote AAC therapy sessions. |
| **Adaptive difficulty** | Site learns which input methods user struggles with. Auto-suggests DPad when mouse precision is low. Increases target sizes when miss rate is high. | ML in browser. No server. Privacy-first. |
| **Curriculum mode** | Structured learning paths through content. Progress tracking. Certificate generation. | For therapeutic workbooks: track completion, export progress reports. |
| **Offline PWA** | Full site works offline. Service worker caches all themes, symbols, content. AAC boards available without internet. | Critical for schools/clinics with poor connectivity. |

---

## NOTES

The wellbeing system and games should feel like part of the site, not bolted on. Same atoms, same focus system, same themes. A breathing exercise in rainbow theme with the physics overlay gently floating is genuinely calming. A memory game using FlipCards with AAC symbols is both fun AND therapeutic practice.

The key principle: every feature is opt-in, composable, and built from existing atoms. Nothing is forced. Nothing requires new UI paradigms. It's all just clever wiring of the system we already built.

---

*Last updated: 2026-03-22*
