# FormField: Universal Input Atom — Storage, Eye Tracking & Assistive Input Integration Spec

**Version:** March 2026 | Covers cognitive-level input rendering, persistence architecture, WebGazer.js integration, keyboard navigation

---

## Architecture Principle

**One atom. FormField is the universal input atom.** It handles text, radio, checkbox, select, slider, card-select, and symbol-grid. The cognitive level setting determines which input type renders. A textarea at Orange becomes a card grid at Green. The atom handles its own a11y input settings and triggers its own save events.

**Everything above FormField is composition.** A quiz page renders multiple FormFields from JSON. A long-answer page renders one FormField. Multiple choice renders FormFields configured as card-select. The JSON schema determines what the page looks like. The atom is always the same atom.

**Zero GDPR data on your servers.** User answers never touch your infrastructure. Two paths: local (IndexedDB on device, exportable as JSON file) or Google Drive (user's own appDataFolder, you never see the data). The "seat" is either anonymous-local or a Google ID — never a row in your database.

---

## 1. FormField Cognitive-Level Input Rendering

### 1.1 How It Works

FormField already accepts `type` (text, textarea, radio, checkbox, etc). The expansion adds a `cognitiveMode` prop that overrides the rendered input type based on the user's cognitive level setting. Both the standard input and the AAC variant are passed as props — the atom chooses which to render.

The cognitive level comes from `data-cognitive-level` on `<html>` (set by the a11y panel, same attribute that controls AAC card tier filtering). FormField reads this at render time.

### 1.2 Input Mode Matrix

| Standard type | Green (Level 1) | Yellow (Level 2) | Orange (Level 3) | Full (Level 4) |
|---|---|---|---|---|
| `textarea` | Symbol grid or card-select | Large button select | Radio buttons | Textarea |
| `radio` | Card-select with icons | Large button select | Radio buttons | Radio buttons |
| `select` | Card-select with icons | Large button select | Select dropdown | Select dropdown |
| `checkbox` | Large toggle card | Large toggle | Checkbox | Checkbox |
| `text` | Card-select (if options provided) or large text input | Large text input | Text input | Text input |
| `slider` | 3-option card-select (low/medium/high) | 5-step large buttons | Slider | Slider |

### 1.3 New Props on FormField

```typescript
interface Props {
  // ... existing props (id, name, label, type, etc.)

  // Cognitive-level input variants
  inputAac?: AacInputOption[];    // AAC card-select options (from build-time JSON)
  questionAac?: string;           // Simplified question text for Green/Yellow levels
  responseLibrary?: string;       // Library ID (e.g. 'emotions-basic', 'frequency')

  // Persistence
  contentId?: string;             // Workbook content ID for save keying
  autoSave?: boolean;             // Save on change (default: true)
  storageKey?: string;            // Override key for IndexedDB/Drive (default: contentId + fieldId)
}

interface AacInputOption {
  value: string;
  label: string;
  label_aac?: string;            // Simplified label for Green/Yellow
  icon_url?: string;             // ARASAAC pictogram URL
  core_tier?: 'green' | 'yellow' | 'orange' | 'fringe';
}
```

### 1.4 Schema Update (content/visual/animation split + four render modes)

```json
{
  "component": "FormField",
  "category": "atoms/form",
  "renders": {
    "full":       "FormField.astro",
    "reduced":    "FormField.astro",
    "assistive":  "FormField.astro",
    "textonly":   "FormField.astro"
  },
  "content": {
    "id":              { "type": "string",  "required": true },
    "name":            { "type": "string" },
    "label":           { "type": "string",  "required": true },
    "type":            { "type": "string",  "enum": ["text","email","textarea","checkbox","radio","toggle","search","select","number","tel","url","password","slider","card-select","symbol-grid"] },
    "placeholder":     { "type": "string" },
    "required":        { "type": "boolean", "default": false },
    "disabled":        { "type": "boolean", "default": false },
    "error":           { "type": "string" },
    "description":     { "type": "string" },
    "value":           { "type": "string" },
    "checked":         { "type": "boolean", "default": false },
    "options":         { "type": "array" },
    "radioValue":      { "type": "string" },
    "inputAac":        { "type": "array",   "description": "AAC card-select options from build-time JSON" },
    "questionAac":     { "type": "string",  "description": "Simplified question for Green/Yellow" },
    "responseLibrary": { "type": "string",  "description": "Library ID for reusable response sets" },
    "contentId":       { "type": "string",  "description": "Workbook content ID for persistence" },
    "autoSave":        { "type": "boolean", "default": true },
    "storageKey":      { "type": "string" }
  },
  "visual": {
    "variant":     { "type": "string",  "enum": ["primary","secondary","neutral"], "default": "primary" },
    "contrast":    { "type": "string",  "enum": ["normal","high"], "default": "normal" },
    "fieldStyle":  { "type": "string",  "enum": ["outlined","filled","underlined"], "default": "outlined" },
    "hideLabel":   { "type": "boolean", "default": false },
    "rows":        { "type": "number",  "default": 3 },
    "min":         { "type": "number" },
    "max":         { "type": "number" },
    "step":        { "type": "number" }
  },
  "animation": {}
}
```

### 1.5 Render Mode Behaviour

| Render | FormField behaviour |
|---|---|
| `full` | Full input with all visual styles, transitions on focus |
| `reduced` | Same layout, no focus transitions (animation gated) |
| `assistive` | All interactive elements ≥ 64×64px. Card-select grid single-column. Large tap targets. |
| `textonly` | Textarea renders as-is (text is content). Card-select renders as numbered text list with radio buttons. Icons stripped. |

### 1.6 Assistive Render Specifics

In `[data-render="assistive"]`:

- All inputs scale to minimum 64×64px touch targets
- Radio/checkbox labels get 64px min-height
- Card-select grid goes single-column
- 16px minimum gap between all interactive elements
- Toggle track scales to 64×48px minimum
- Select dropdown replaced by visible radio-style list (no dropdown interaction needed)

```css
[data-render="assistive"] .form-field__input { min-height: 64px; font-size: 1.25rem; }
[data-render="assistive"] .form-field__radio-wrap,
[data-render="assistive"] .form-field__checkbox-wrap { min-height: 64px; padding: 1rem; }
[data-render="assistive"] .form-field__card-grid { grid-template-columns: 1fr; gap: 1rem; }
[data-render="assistive"] .form-field__card-option { min-height: 80px; }
```

---

## 2. Persistence Architecture — Zero GDPR Data

### 2.1 Principle

User answers are **the user's data**. You are not the data controller for their workbook responses. Two storage paths, user chooses:

| Path | Storage | Seat identity | You store | User controls |
|---|---|---|---|---|
| **Local** | IndexedDB in browser | Anonymous (no ID) | Nothing | Can export as JSON file, can clear browser data |
| **Google Drive** | User's own `appDataFolder` | Google ID (for licence only) | Google ID + licence status | Can revoke app, can delete folder, owns all data |

### 2.2 Local Storage — IndexedDB

**Why IndexedDB, not localStorage:** localStorage is synchronous, 5MB limit, string-only. IndexedDB is async, no practical size limit, stores structured data. Your input shim already uses localStorage for settings — keep settings there, put answer data in IndexedDB.

**Library: None needed.** Raw IndexedDB API is fine for this. The storage utility is ~60 lines.

```typescript
// src/lib/storage/workbook-storage.ts

const DB_NAME = 'mtb-workbook';
const DB_VERSION = 1;
const STORE_NAME = 'answers';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);  // key = storageKey string
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveAnswer(key: string, value: any): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put({ value, savedAt: new Date().toISOString() }, key);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadAnswer(key: string): Promise<any | null> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const request = tx.objectStore(STORE_NAME).get(key);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result?.value ?? null);
    request.onerror = () => reject(request.error);
  });
}

export async function exportAllAnswers(): Promise<string> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const request = tx.objectStore(STORE_NAME).getAll();
  const keys = tx.objectStore(STORE_NAME).getAllKeys();
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      const data: Record<string, any> = {};
      for (let i = 0; i < keys.result.length; i++) {
        data[keys.result[i] as string] = request.result[i];
      }
      resolve(JSON.stringify(data, null, 2));
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearAllAnswers(): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).clear();
}
```

**Storage key format:** `{contentId}:{fieldId}` — e.g. `MTB-WB-2026-0342:feeling-q1`

**Auto-save trigger:** FormField fires `saveAnswer()` on input `change` event (not `input` — avoids saving every keystroke). Debounced 500ms for textareas.

**Restore on load:** FormField's client script calls `loadAnswer()` on `astro:page-load` and populates the input if data exists.

### 2.3 Google Drive — appDataFolder

**Why `appDataFolder`:** This is a hidden folder in the user's own Google Drive that only your app can access. The scope `drive.appdata` is classified as **non-sensitive** by Google — no security assessment required, no restricted scope verification. The user sees "View and manage its own configuration data in your Google Drive" on the consent screen. You never see the data. The folder is deleted if the user revokes your app.

**Library: Google Identity Services (GIS)** — the current Google-recommended browser OAuth library. No `gapi` needed for simple Drive operations — plain `fetch()` with an access token.

**OAuth flow:**

```
User clicks "Save to Google Drive" in a11y panel
    ↓
GIS library shows Google sign-in popup
    ↓
User grants drive.appdata scope
    ↓
Access token returned to browser
    ↓
Browser saves answers as JSON to appDataFolder via Drive API
    ↓
Token refreshed automatically by GIS
    ↓
On page load: browser fetches answers from appDataFolder
```

**Scope requested:** `https://www.googleapis.com/auth/drive.appdata` — only this, nothing else. Cannot read/write user's regular Drive files.

**File structure in appDataFolder:**

```
appDataFolder/
  mtb-workbook-answers.json     ← all workbook answers
  mtb-a11y-settings.json        ← a11y preferences (sync across devices)
```

**Save to Drive utility:**

```typescript
// src/lib/storage/drive-storage.ts

const DRIVE_API = 'https://www.googleapis.com/upload/drive/v3/files';
const DRIVE_FILES = 'https://www.googleapis.com/drive/v3/files';
const ANSWERS_FILENAME = 'mtb-workbook-answers.json';

export async function saveToDrive(token: string, data: Record<string, any>): Promise<void> {
  // Check if file already exists
  const existingId = await findFile(token, ANSWERS_FILENAME);

  const metadata = {
    name: ANSWERS_FILENAME,
    mimeType: 'application/json',
    ...(!existingId && { parents: ['appDataFolder'] }),
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));

  const url = existingId
    ? `${DRIVE_API}/${existingId}?uploadType=multipart`
    : `${DRIVE_API}?uploadType=multipart`;

  await fetch(url, {
    method: existingId ? 'PATCH' : 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
}

export async function loadFromDrive(token: string): Promise<Record<string, any> | null> {
  const fileId = await findFile(token, ANSWERS_FILENAME);
  if (!fileId) return null;

  const res = await fetch(`${DRIVE_FILES}/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok ? res.json() : null;
}

async function findFile(token: string, name: string): Promise<string | null> {
  const res = await fetch(
    `${DRIVE_FILES}?spaces=appDataFolder&q=name='${name}'&fields=files(id)`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  return data.files?.[0]?.id ?? null;
}
```

### 2.4 Sync Strategy

The two storage paths are not mutually exclusive:

1. **IndexedDB is always primary** — answers save to IndexedDB on every change
2. **Drive sync is additive** — if the user has authenticated with Google, a periodic sync pushes IndexedDB data to Drive (debounced, not on every keystroke)
3. **On page load:** if Drive is connected, merge Drive data with IndexedDB (Drive wins on conflict — it's the cross-device source of truth)
4. **If Drive is disconnected:** IndexedDB works standalone. No degradation.

**Sync trigger:** Not on every save. Debounced 30 seconds after last change, or on page unload (`visibilitychange` event), whichever comes first.

### 2.5 Seat Identity

| Storage mode | Seat ID | What you know | What you don't know |
|---|---|---|---|
| Local only | None | Nothing | Everything |
| Google Drive | Google ID (email hash or sub) | That a seat exists, licence status, print events | What they wrote, their answers, their workbook data |

The seat exists for two purposes only: licence compliance (print traceability) and cognitive-level sync. You store the Google ID (or a one-way hash of it) in your licence table to track active seats. You never store their answers.

### 2.6 User Data Export and Deletion

| Action | Local | Drive |
|---|---|---|
| Export all answers | `exportAllAnswers()` → download JSON file | User can access appDataFolder via Google's data export |
| Delete all answers | `clearAllAnswers()` on IndexedDB | User revokes app in Google Account settings, or your app provides a "delete my data" button that calls Drive API delete |
| Clear browser data | Answers lost (warn user) | Answers safe in Drive, restored on next sign-in |
| Switch devices | Answers not available | Answers available (Drive sync) |

**The a11y panel should include:**
- "Download my workbook data" button (exports IndexedDB as JSON file)
- "Connect Google Drive" button (initiates OAuth, enables sync)
- "Disconnect Google Drive" button (revokes token, stops sync, IndexedDB still works)
- "Delete all my data" button (clears IndexedDB + deletes Drive file if connected)
- Warning text: "If you don't connect Google Drive, your answers are stored in this browser only. Clearing your browser data will delete them."

---

## 3. Eye Tracking — WebGazer.js Integration

### 3.1 Library Assessment

**WebGazer.js** (Brown University, open source, MIT licence)

| Aspect | Detail | Fit for your system |
|---|---|---|
| **What it does** | Webcam → face mesh → eye detection → gaze x,y coordinates | Provides the position data your shim needs |
| **Runs where** | Entirely client-side. No server, no video upload. | Matches your zero-server-data architecture |
| **Face detection** | MediaPipe Facemesh (TensorFlow.js) | Heavy-ish — ~2MB model download, runs at ~30fps |
| **Gaze estimation** | Ridge regression trained on user clicks | Self-calibrates — gets more accurate as user clicks |
| **Accuracy** | ~100–150px with webcam (±50px best case after calibration) | Requires large targets — your 64×64px assistive mode helps |
| **Storage** | Saves calibration data to IndexedDB (via localforage) | No conflict with your storage, sits alongside |
| **Privacy** | Camera stream stays in browser. No network calls. | Matches GDPR-first approach. User grants camera permission via browser API. |
| **Browser support** | Chrome, Firefox, Edge (getUserMedia required) | Good coverage. No Safari iOS (no camera API in-page). |
| **npm** | `npm install webgazer` | Standard install, bundleable |

### 3.2 How It Connects to Your Existing Shim

Your input shim already has two modes: switch scanning and dwell-to-click. WebGazer adds a third:

| Mode | Input source | Shim translation |
|---|---|---|
| `switch` | Keyboard key press | Cycle through targets, press to select |
| `dwell` | Mouse/trackpad/head tracker position | Hover on element for X ms → click |
| `gaze` | WebGazer x,y coordinates from webcam | Map gaze to nearest target, dwell → click |

**The key insight:** WebGazer produces x,y viewport coordinates. Your dwell-to-click code already handles "pointer at position → find element → start dwell timer → click." The only new piece is feeding gaze coordinates into the same pipeline instead of mouse coordinates.

### 3.3 Integration Architecture

```
WebGazer.js
    ↓ setGazeListener callback every ~33ms
    ↓ { x: number, y: number }
    ↓
gaze-bridge.ts (new file, ~80 lines)
    ↓ Finds element at gaze position (document.elementFromPoint)
    ↓ Filters to focusable targets (reuses FOCUSABLE_SELECTOR from input-shim.ts)
    ↓ Dispatches synthetic mouseover/mouseout events
    ↓
input-shim.ts (existing dwell-to-click handler)
    ↓ handleDwellOver → highlight → dwell timer → click
    ↓ No changes needed — already handles programmatic hover events
    ↓
Component receives click event
    ↓ Doesn't know it came from eye gaze
```

**New `ShimSettings` type expansion:**

```typescript
export interface ShimSettings {
  inputMethod: 'off' | 'switch' | 'dwell' | 'gaze';  // ← gaze added
  scanSpeed: number;
  dwellTime: number;
  scanKey: string;
  gazeSmoothingFrames: number;   // ← new: average over N frames to reduce jitter (default 3)
  gazeCalibrated: boolean;       // ← new: has user completed calibration
}
```

### 3.4 Gaze Bridge Module

```typescript
// src/lib/aac/gaze-bridge.ts

import { FOCUSABLE_SELECTOR, getLabel } from './input-shim';

let gazeSmoothing: { x: number; y: number }[] = [];
const MAX_FRAMES = 3;

export function initGazeBridge(settings: { gazeSmoothingFrames?: number }) {
  const frames = settings.gazeSmoothingFrames ?? MAX_FRAMES;

  // Dynamic import — WebGazer is heavy, only load when gaze mode is active
  import('webgazer').then((webgazer) => {
    webgazer.default
      .setRegression('ridge')
      .setGazeListener((data: { x: number; y: number } | null) => {
        if (!data) return;

        // Smooth gaze position over N frames to reduce jitter
        gazeSmoothing.push({ x: data.x, y: data.y });
        if (gazeSmoothing.length > frames) gazeSmoothing.shift();

        const avg = {
          x: gazeSmoothing.reduce((s, p) => s + p.x, 0) / gazeSmoothing.length,
          y: gazeSmoothing.reduce((s, p) => s + p.y, 0) / gazeSmoothing.length,
        };

        // Find element at gaze position
        const el = document.elementFromPoint(avg.x, avg.y) as HTMLElement | null;
        if (!el) return;

        // Find nearest focusable target
        const target = el.closest<HTMLElement>(FOCUSABLE_SELECTOR);
        if (!target) return;

        // Dispatch synthetic mouseover — dwell handler in input-shim picks this up
        target.dispatchEvent(new MouseEvent('mouseover', {
          bubbles: true,
          clientX: avg.x,
          clientY: avg.y,
        }));
      })
      .begin();

    // Hide video preview (WebGazer shows camera feed by default)
    webgazer.default.showVideoPreview(false).showPredictionPoints(false);

    document.documentElement.setAttribute('data-aac-input', 'gaze');
  });
}

export function destroyGazeBridge() {
  import('webgazer').then((webgazer) => {
    webgazer.default.end();
  });
  gazeSmoothing = [];
  document.documentElement.removeAttribute('data-aac-input');
}
```

### 3.5 Calibration Flow

WebGazer self-calibrates by tracking where the user clicks relative to where their eyes are looking. But for AAC users who may not click frequently, an explicit calibration step improves accuracy significantly.

**Calibration page: `/accessibility/calibrate-eye-tracker`**

1. Show camera permission request with accessible explanation ("We need your camera to track where your eyes look. The video stays in your browser — it is never sent anywhere.")
2. 9-point calibration grid — large circles at fixed screen positions
3. User looks at each circle. A carer/helper clicks each circle (or the circle auto-advances after 3 seconds of detected gaze)
4. After calibration: accuracy test — "Look at the green circle" × 5 positions, measure error
5. If accuracy >150px, prompt recalibration
6. Calibration data saved to IndexedDB by WebGazer automatically (persists between sessions)
7. Redirect back to a11y panel with "Eye tracking calibrated ✓" confirmation

**This is a dedicated page, not a component.** It lives alongside the existing `/accessibility` settings page.

### 3.6 Performance Budget

WebGazer loads MediaPipe Facemesh (~2MB) and runs inference per frame. On low-end devices this could be too heavy.

**Mitigations:**
- Dynamic import only when gaze mode is selected (never preloaded)
- `webgazer.params.showVideoPreview = false` — skip rendering camera feed
- Reduce prediction rate: WebGazer defaults to every available frame (~30fps), but gaze bridge only needs ~10fps. Use `requestAnimationFrame` throttle in the gaze listener.
- If FPS drops below 15, show warning: "Eye tracking may not work well on this device. Try switch scanning instead."
- Budget: gaze tracking should use <30% CPU. If exceeded, auto-fallback to dwell mode with warning.

### 3.7 Limitations to Document

| Limitation | Impact | Mitigation |
|---|---|---|
| No Safari iOS support | iPad/iPhone AAC users can't use gaze mode | Switch scanning and external switch devices work on iOS |
| ~100px accuracy | Can't target small elements | Assistive render mode (64×64px targets) is mandatory with gaze |
| Needs webcam | Desktop/laptop only, not most tablets | Alternative input modes (switch, dwell with head tracker) cover non-webcam devices |
| MediaPipe model download | ~2MB initial load | Only loads when gaze mode activated, cached after first load |
| Glasses/lighting sensitivity | Some users may have poor tracking | Calibration page includes lighting check and glasses guidance |

---

## 4. Keyboard Navigation

### 4.1 What Exists

Your input shim handles switch scanning (cycle with Space/Enter). But keyboard navigation is broader than switch mode — it covers all keyboard-only users including power users, motor-impaired users using standard keyboards, and screen reader users.

### 4.2 Layout-Level Requirements

These are not per-component — they go in the base layout:

| Feature | Implementation | Where |
|---|---|---|
| Skip-to-content link | `<a href="#main-content" class="skip-link">Skip to content</a>` as first focusable element in body | Base layout (Layout.astro) |
| A11y panel keyboard shortcut | `Alt+A` toggles a11y panel visibility | a11y-panel.ts |
| Focus trap in modals | Tab cycles within open modal/dialog only | Per-modal component (Tooltip aac variant already specs this) |
| Escape closes overlays | Escape key closes tooltips, modals, panels | Per-component |
| Arrow keys in groups | Up/Down in radio groups, card-select grids, tab panels | FormField for radio/card-select, TabPanel component |

### 4.3 FormField Keyboard Specifics

| Input type | Keyboard behaviour |
|---|---|
| Card-select grid | Arrow keys move between cards. Enter/Space selects. Focus ring visible on current card. |
| Symbol grid | Same as card-select but wraps at grid row boundaries. Home/End for first/last. |
| Slider | Left/Right arrows for ±1 step. Page Up/Down for ±10%. Home/End for min/max. |
| Radio group | Up/Down arrows cycle options (standard HTML radio group behaviour). |
| Toggle | Space toggles on/off (standard checkbox behaviour). |

### 4.4 Visible Focus Indicators

Every interactive element in FormField must have:
- Minimum 2px outline offset with sufficient contrast (3:1 against adjacent colours)
- No `outline: none` without replacement focus style
- Focus ring must be visible in all theme modes (light/dark/high-contrast)

```css
.form-field__input:focus-visible,
.form-field__card-option:focus-visible,
.form-field__radio-wrap:focus-visible {
  outline: 2px solid var(--brand-c-primary);
  outline-offset: 2px;
}

/* High contrast mode — thicker ring */
[data-high-contrast] .form-field__input:focus-visible,
[data-high-contrast] .form-field__card-option:focus-visible {
  outline: 3px solid var(--color-focus-ring, #000);
  outline-offset: 3px;
}
```

---

## 5. Input Shim Update — Unified Mode Switching

### 5.1 Updated `applyMode` with Gaze Support

```typescript
// In input-shim.ts — updated applyMode function

import { initGazeBridge, destroyGazeBridge } from './gaze-bridge';

function applyMode(settings: ShimSettings) {
  stopScan();
  stopDwell();
  unbindSwitchKey();
  destroyGazeBridge();

  switch (settings.inputMethod) {
    case 'switch':
      bindSwitchKey(settings.scanKey);
      startScan(settings.scanSpeed);
      break;
    case 'dwell':
      startDwell(settings.dwellTime);
      break;
    case 'gaze':
      // Gaze mode reuses dwell-to-click pipeline
      // WebGazer dispatches synthetic mouseover events
      // Dwell handler picks them up and fires click after dwellTime
      startDwell(settings.dwellTime);
      initGazeBridge({ gazeSmoothingFrames: settings.gazeSmoothingFrames ?? 3 });
      break;
    case 'off':
    default:
      break;
  }
}
```

### 5.2 A11y Panel — Input Method Section

The `/accessibility` page needs an input method section:

| Setting | Control | Values |
|---|---|---|
| Input method | Radio group (card-select at Green level) | Off / Keyboard / Switch scanning / Dwell (mouse/tracker) / Eye gaze |
| Scan speed | Slider (1000–3000ms) | Only visible when switch selected |
| Dwell time | Slider (500–2000ms) | Visible for dwell and gaze modes |
| Switch key | Dropdown | Space / Enter / custom key |
| Calibrate eye tracker | Button → navigates to calibration page | Only visible when gaze selected |

### 5.3 CSS for Gaze Mode

```css
/* Add to aac-input-shim.css */

[data-aac-input="gaze"]::after {
  background: var(--brand-c-accent, #9933ff);
}

/* Larger highlight ring for gaze (less precise than mouse) */
[data-aac-input="gaze"] .aac-scan-highlight {
  outline-width: 4px;
  outline-offset: 6px;
  box-shadow: 0 0 0 10px color-mix(in srgb, var(--brand-c-primary, #0066ff) 20%, transparent);
}

/* Gaze cursor indicator (subtle dot following gaze position) */
[data-aac-input="gaze"] .gaze-cursor {
  position: fixed;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--brand-c-primary) 40%, transparent);
  pointer-events: none;
  z-index: 99998;
  transition: transform 0.1s ease-out;
}
```

---

## 6. Response Libraries

### 6.1 Library Files

Reusable JSON files in `src/data/response-libraries/`. Each file contains response options across cognitive levels.

```
src/data/response-libraries/
  emotions-basic.json        ← 4-6 core emotions
  emotions-detailed.json     ← 8-12 nuanced emotions
  frequency.json             ← never/sometimes/always scales
  agreement.json             ← yes/no/maybe → Likert scale
  intensity.json             ← a little / a lot → 1-10
  coping-strategies.json     ← icon cards with strategies
  safety.json                ← safe/unsafe/not sure
  body-sensations.json       ← where do you feel it
```

### 6.2 Library JSON Schema

```json
{
  "id": "emotions-basic",
  "label": "How are you feeling?",
  "label_aac": "How do you feel?",
  "tiers": {
    "green": [
      { "value": "happy",   "label": "Happy",   "icon_url": "/symbols/happy.png" },
      { "value": "sad",     "label": "Sad",      "icon_url": "/symbols/sad.png" },
      { "value": "angry",   "label": "Angry",    "icon_url": "/symbols/angry.png" },
      { "value": "scared",  "label": "Scared",   "icon_url": "/symbols/scared.png" }
    ],
    "yellow": [
      { "value": "happy",      "label": "Happy",      "icon_url": "/symbols/happy.png" },
      { "value": "sad",        "label": "Sad",         "icon_url": "/symbols/sad.png" },
      { "value": "angry",      "label": "Angry",       "icon_url": "/symbols/angry.png" },
      { "value": "scared",     "label": "Scared",      "icon_url": "/symbols/scared.png" },
      { "value": "excited",    "label": "Excited",     "icon_url": "/symbols/excited.png" },
      { "value": "confused",   "label": "Confused",    "icon_url": "/symbols/confused.png" },
      { "value": "calm",       "label": "Calm",        "icon_url": "/symbols/calm.png" }
    ],
    "orange": [
      "...extends yellow with: frustrated, lonely, proud, embarrassed, hopeful, overwhelmed"
    ],
    "full": [
      "...all emotions with detailed descriptions"
    ]
  }
}
```

### 6.3 How Libraries Connect to FormField

The build-time content generation script resolves library references into concrete `inputAac` arrays:

```json
{
  "question": "How did you feel after the session?",
  "question_aac": "How did you feel?",
  "input": { "type": "textarea", "placeholder": "Describe your feelings..." },
  "responseLibrary": "emotions-basic"
}
```

At build time, the script:
1. Reads the library JSON
2. Picks the tier matching the content's target level (or includes all tiers for runtime switching)
3. Resolves icon URLs against the asset library
4. Embeds the resolved options as `inputAac` in the page JSON

At runtime, FormField reads `data-cognitive-level` from `<html>` and filters to the matching tier.

---

## 7. Component Audit Additions

### Section 11: Cognitive-Level Input Rendering

For every component that accepts user input.

| Check | Pass | Fail indicator |
|---|---|---|
| `inputAac` prop accepted (if component uses FormField) | ✓ | No AAC input variant support |
| `questionAac` prop accepted | ✓ | No simplified question text |
| Card-select renders correctly at Green level | ✓ | Textarea shown at Green (unusable) |
| Card-select icons from ARASAAC (not Phosphor) | ✓ | Phosphor icons used as AAC |
| `data-cognitive-level` read for tier filtering | ✓ | Hardcoded level or missing |
| Response library options filtered by tier | ✓ | All options shown regardless of level |

### Section 12: Input Shim Compatibility

For every interactive component.

| Check | Pass | Fail indicator |
|---|---|---|
| All interactive elements match `FOCUSABLE_SELECTOR` | ✓ | Custom element not discoverable by shim |
| Elements respond to programmatic `.click()` | ✓ | Click handler ignores non-trusted events |
| Scan highlight ring fits without clipping | ✓ | `overflow: hidden` on parent clips outline |
| Card-select options scannable in correct order | ✓ | Tab order doesn't match visual order |
| Dwell timer works on element (no mouseout jitter) | ✓ | Small element causes rapid enter/leave |
| Gaze mode: element ≥ 64×64px in assistive render | ✓ | Element too small for gaze accuracy |

### Section 13: Persistence

For any component that captures user data.

| Check | Pass | Fail indicator |
|---|---|---|
| `contentId` prop accepted for storage keying | ✓ | No key — can't persist |
| Auto-save fires on change event | ✓ | No save trigger |
| `loadAnswer()` restores value on page load | ✓ | Saved data not restored |
| Export includes this field's data | ✓ | Field excluded from export |
| Drive sync includes this field | ✓ | Local only, no sync |
| No user data sent to your servers | ✓ | Fetch/POST to your API with answer data |
| Content ID embedded for print traceability | ✓ | Printed output has no content ID |

---

## 8. Build Tasks

### Immediate (FormField expansion)

- [ ] Update FormField schema to content/visual/animation split with 4 render modes
- [ ] Add `inputAac`, `questionAac`, `responseLibrary`, `contentId`, `autoSave`, `storageKey` props
- [ ] Add card-select input type rendering to FormField.astro
- [ ] Add symbol-grid input type rendering to FormField.astro
- [ ] Add cognitive-level template branching (reads `data-cognitive-level`)
- [ ] Add assistive-render sizing CSS (`[data-render="assistive"]` rules)
- [ ] Create `workbook-storage.ts` (IndexedDB save/load/export/clear)
- [ ] Add auto-save client script to FormField (change event → saveAnswer)
- [ ] Add restore-on-load client script to FormField (astro:page-load → loadAnswer)
- [ ] Remove `FormField.a11y.css` — extract rules into base CSS, move to `_reference/`

### Near-term (Drive sync)

- [ ] Set up Google Cloud project with OAuth client ID
- [ ] Configure OAuth consent screen (drive.appdata scope only)
- [ ] Create `drive-storage.ts` (save/load/find file in appDataFolder)
- [ ] Add "Connect Google Drive" flow to a11y panel
- [ ] Implement sync bridge (IndexedDB ↔ Drive, debounced)
- [ ] Add "Download my data" button to a11y panel
- [ ] Add "Delete all my data" button (clears both stores)

### Near-term (Response libraries)

- [ ] Create `src/data/response-libraries/` directory
- [ ] Build `emotions-basic.json` with Green/Yellow/Orange/Full tiers
- [ ] Build `frequency.json`, `agreement.json`, `intensity.json`, `safety.json`
- [ ] Wire response library resolution into build-time content script
- [ ] Map library ARASAAC pictogram URLs to asset library entries

### Future (Eye tracking)

- [ ] Create `/accessibility/calibrate-eye-tracker` page
- [ ] Create `gaze-bridge.ts` (WebGazer → synthetic mouse events → existing dwell handler)
- [ ] Add `gaze` option to input shim `inputMethod` enum
- [ ] Add gaze smoothing (configurable frame averaging)
- [ ] Add performance budget monitoring (FPS check, auto-fallback)
- [ ] Add gaze cursor indicator CSS
- [ ] Test with 64×64px assistive targets
- [ ] Document Safari/iOS limitation
- [ ] Add camera permission UX with accessible explanation

### Future (Keyboard)

- [ ] Add skip-to-content link to Layout.astro
- [ ] Add `Alt+A` keyboard shortcut for a11y panel
- [ ] Add arrow-key navigation to card-select grid
- [ ] Add arrow-key navigation to symbol-grid
- [ ] Audit tab order across all pages in assistive render
