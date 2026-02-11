# CSS Colour Audit Report

**Project:** `C:\Users\Business\Website v2.36`
**Files scanned:** 375
**Files with colour findings:** 198

## Summary

| Metric | Count |
|--------|-------|
| Colour token definitions | 1490 |
| Unique colour tokens defined | 493 |
| Token usages (var references) | 8174 |
| Unique tokens referenced | 461 |
| Hardcoded colour values | 1217 |
| Unique hardcoded values | 351 |
| Inline styles with colours | 24 |
| Tokens defined but NEVER used | 349 |
| Tokens used but NEVER defined | 185 |

---

## 🔴 Hardcoded Colours (Need Tokenising)

These are colour values written directly in files instead of using tokens.

| Colour Value | Times Used | Files | Suggested Action |
|-------------|------------|-------|-----------------|
| `white` | 225 | 65 | Create new token — used frequently |
| `#ffffff` | 65 | 21 | Replace with `var(--text)` |
| `black` | 34 | 14 | Create new token — used frequently |
| `#333333` | 34 | 8 | Replace with `var(--a11y-mono-c-text)` |
| `#8fa68a` | 27 | 14 | Replace with `var(--color-Primary-500)` |
| `#000000` | 26 | 10 | Replace with `var(--bg)` |
| `rgba(0, 0, 0, 0.1)` | 15 | 10 | Create new token — used frequently |
| `#4a3f2f` | 14 | 5 | Replace with `var(--a11y-cream-c-text)` |
| `rgba(0, 0, 0, 0.15)` | 14 | 9 | Create new token — used frequently |
| `#8b9d83` | 12 | 2 | Create new token — used frequently |
| `#c4907c` | 11 | 8 | Replace with `var(--color-Secondary-500)` |
| `green` | 11 | 6 | Create new token — used frequently |
| `#faf8f7` | 10 | 5 | Replace with `var(--color-Background-50)` |
| `rgba(0, 0, 0, 0.2)` | 10 | 6 | Create new token — used frequently |
| `#474747` | 9 | 7 | Replace with `var(--color-Text-800)` |
| `#8b6914` | 9 | 4 | Create new token — used frequently |
| `rgba(0,0,0,0.1)` | 9 | 5 | Create new token — used frequently |
| `#666666` | 8 | 5 | Create new token — used frequently |
| `#1a1a1a` | 8 | 3 | Create new token — used frequently |
| `#f5f5f5` | 7 | 6 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.15)` | 7 | 4 | Create new token — used frequently |
| `rgba(0, 0, 0, 0.25)` | 7 | 3 | Create new token — used frequently |
| `hsl((h + offset)` | 7 | 2 | Create new token — used frequently |
| `#dc2626` | 7 | 1 | Create new token — used frequently |
| `#f9f8f6` | 6 | 4 | Create new token — used frequently |
| `#777777` | 6 | 5 | Replace with `var(--color-Text-600)` |
| `rgba(0,0,0,0.15)` | 6 | 3 | Create new token — used frequently |
| `blue` | 6 | 5 | Create new token — used frequently |
| `#5a3420` | 6 | 4 | Replace with `var(--color-Secondary-900)` |
| `#fff` | 6 | 3 | Create new token — used frequently |
| `#bdbab3` | 6 | 5 | Create new token — used frequently |
| `#f59e0b` | 6 | 4 | Replace with `var(--a11y-proto-c-accent)` |
| `rgba(255, 255, 255, 0.1)` | 6 | 4 | Replace with `var(--glass-bg)` |
| `#2dd4bf` | 6 | 1 | Create new token — used frequently |
| `red` | 5 | 4 | Create new token — used frequently |
| `#00ffff` | 5 | 3 | Replace with `var(--a11y-hc-c-accent)` |
| `purple` | 5 | 2 | Create new token — used frequently |
| `teal` | 5 | 4 | Create new token — used frequently |
| `#f4fbf2` | 5 | 4 | Replace with `var(--color-Primary-100)` |
| `#666` | 5 | 4 | Create new token — used frequently |
| `#ddd` | 5 | 4 | Create new token — used frequently |
| `rgba(0, 0, 0, 0.06)` | 5 | 4 | Create new token — used frequently |
| `rgba(0, 0, 0, 0.04)` | 5 | 4 | Create new token — used frequently |
| `#ddd9d3` | 5 | 3 | Replace with `var(--a11y-cream-c-bg)` |
| `#8b7355` | 5 | 3 | Replace with `var(--a11y-cream-c-primary)` |
| `#6b8e7a` | 5 | 3 | Replace with `var(--a11y-cream-c-accent)` |
| `rgba(0, 0, 0, 0.08)` | 5 | 5 | Create new token — used frequently |
| `#e6e2da` | 5 | 4 | Create new token — used frequently |
| `rgba(0,0,0,0.3)` | 5 | 3 | Create new token — used frequently |
| `#9c8579` | 4 | 3 | Replace with `var(--color-AccentOne-500)` |
| `#8390b5` | 4 | 3 | Replace with `var(--color-AccentTwo-500)` |
| `#978692` | 4 | 4 | Replace with `var(--color-AccentThree-500)` |
| `#e0dedb` | 4 | 3 | Replace with `var(--brand-c-neutral-light)` |
| `#556a50` | 4 | 3 | Replace with `var(--color-Primary-700)` |
| `#0066ff` | 4 | 1 | Create new token — used frequently |
| `#111827` | 4 | 1 | Create new token — used frequently |
| `#ffff00` | 4 | 1 | Create new token — used frequently |
| `#00ff00` | 4 | 3 | Replace with `var(--a11y-hc-c-primary)` |
| `orange` | 4 | 2 | Create new token — used frequently |
| `yellow` | 4 | 1 | Create new token — used frequently |
| `pink` | 4 | 4 | Create new token — used frequently |
| `#ccd3da` | 4 | 4 | Replace with `var(--a11y-dark-c-text)` |
| `#121212` | 4 | 4 | Replace with `var(--a11y-dark-c-bg)` |
| `#555555` | 4 | 4 | Replace with `var(--a11y-mono-c-primary)` |
| `#393531` | 4 | 3 | Replace with `var(--brand-c-neutral-dark)` |
| `rgba(255, 255, 255, 0.3)` | 4 | 2 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.5)` | 4 | 3 | Create new token — used frequently |
| `#22c55e` | 4 | 2 | Create new token — used frequently |
| `#ef4444` | 4 | 2 | Create new token — used frequently |
| `#3b82f6` | 4 | 2 | Create new token — used frequently |
| `#555` | 4 | 3 | Create new token — used frequently |
| `#333` | 4 | 2 | Create new token — used frequently |
| `#999` | 4 | 4 | Create new token — used frequently |
| `hsl(h, news, newl)` | 4 | 1 | Create new token — used frequently |
| `#5d4f3a` | 4 | 1 | Create new token — used frequently |
| `#4a4a4a` | 4 | 1 | Create new token — used frequently |
| `#e5e0db` | 4 | 1 | Create new token — used frequently |
| `beige` | 3 | 1 | Create new token — used frequently |
| `#6b7280` | 3 | 3 | Create new token — used frequently |
| `#4caf50` | 3 | 3 | Replace with `var(--color-Success)` |
| `#272596` | 3 | 3 | Replace with `var(--a11y-dark-c-accent)` |
| `#e8e8e8` | 3 | 3 | Replace with `var(--color-Text-100)` |
| `#c5e1a5` | 3 | 3 | Replace with `var(--a11y-dark-c-primary)` |
| `rgba(0, 0, 0, 0.6)` | 3 | 2 | Create new token — used frequently |
| `#262626` | 3 | 3 | Replace with `var(--color-Text-950)` |
| `rgba(0, 0, 0, 0.12)` | 3 | 3 | Create new token — used frequently |
| `rgba(0,0,0,0.06)` | 3 | 3 | Create new token — used frequently |
| `rgba(255,255,255,0.85)` | 3 | 3 | Create new token — used frequently |
| `#ff99c8` | 3 | 2 | Create new token — used frequently |
| `#ae88bf` | 3 | 2 | Create new token — used frequently |
| `#80e1cc` | 3 | 2 | Create new token — used frequently |
| `#e9bc88` | 3 | 2 | Create new token — used frequently |
| `#d4b98c` | 3 | 1 | Create new token — used frequently |
| `rgba(0,0,0,0.2)` | 3 | 1 | Create new token — used frequently |
| `rgba(0,0,0,0.5)` | 3 | 2 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.2)` | 3 | 2 | Replace with `var(--glass-border)` |
| `gold` | 3 | 3 | Create new token — used frequently |
| `#171717` | 3 | 1 | Create new token — used frequently |
| `#71876c` | 2 | 2 | Replace with `var(--color-Primary-600)` |
| `coral` | 2 | 1 | Consider creating token |
| `#10b981` | 2 | 2 | Replace with `var(--feedback-success-border)` |
| `#ff0000` | 2 | 1 | Consider creating token |
| `#ff9800` | 2 | 2 | Replace with `var(--color-Warning)` |
| `#f44336` | 2 | 2 | Replace with `var(--color-Error)` |
| `#2196f3` | 2 | 2 | Replace with `var(--color-Info)` |
| `rgba(255, 255, 255, 0.12)` | 2 | 2 | Consider creating token |
| `#eeebe2` | 2 | 2 | Consider creating token |
| `#dbdbdb` | 2 | 2 | Replace with `var(--color-Text-200)` |
| `#5a5754` | 2 | 2 | Replace with `var(--color-Background-600)` |
| `#3e3b39` | 2 | 2 | Replace with `var(--color-Background-700)` |
| `#2b2927` | 2 | 2 | Replace with `var(--color-Background-800)` |
| `#1a1918` | 2 | 2 | Replace with `var(--color-Background-900)` |
| `#aaaaaa` | 2 | 2 | Consider creating token |
| `rgba(0,0,0,0.08)` | 2 | 1 | Consider creating token |
| `#cee6c8` | 2 | 2 | Replace with `var(--color-Primary-300)` |
| `#ffcfba` | 2 | 2 | Replace with `var(--color-Secondary-300)` |
| `#855543` | 2 | 2 | Replace with `var(--color-Secondary-700)` |
| `#c2bdb8` | 2 | 2 | Replace with `var(--brand-c-neutral)` |
| `#394e43` | 2 | 2 | Replace with `var(--brand-c-bg-dark)` |
| `rgba(255, 255, 255, 0.6)` | 2 | 2 | Consider creating token |
| `rgba(255, 255, 255, 0.25)` | 2 | 2 | Consider creating token |
| `rgba(255, 255, 255, 0.4)` | 2 | 2 | Consider creating token |
| `rgba(0, 0, 0, 0.3)` | 2 | 2 | Consider creating token |
| `rgba(255, 255, 255, 0.18)` | 2 | 2 | Consider creating token |
| `#7a9175` | 2 | 2 | Consider creating token |
| `#e8e6e3` | 2 | 2 | Consider creating token |
| `#f0ebe6` | 2 | 2 | Consider creating token |
| `rgba(143,166,138,0.1)` | 2 | 2 | Consider creating token |
| `rgba(196,144,124,0.1)` | 2 | 2 | Consider creating token |
| `#8aa5e5` | 2 | 1 | Consider creating token |
| `#5a5a5a` | 2 | 2 | Replace with `var(--color-Text-700)` |
| `#3e4a5a` | 2 | 2 | Replace with `var(--color-AccentFour-500)` |
| `#a28aad` | 2 | 2 | Replace with `var(--color-AccentFive-500)` |
| `#0e3f2e` | 2 | 1 | Consider creating token |
| `#fafafa` | 2 | 2 | Consider creating token |
| `#e0e0e0` | 2 | 2 | Consider creating token |
| `rgba(255,255,255,0.9)` | 2 | 2 | Consider creating token |
| `hsl((h + 180)` | 2 | 2 | Consider creating token |
| `hsl((h + offset + 360)` | 2 | 2 | Consider creating token |
| `#373737` | 2 | 2 | Replace with `var(--color-Text-900)` |
| `#4a90e2` | 2 | 1 | Consider creating token |
| `#888888` | 2 | 1 | Consider creating token |
| `rgba(0,0,0,0.9)` | 2 | 1 | Consider creating token |
| `rgba(255,255,255,0.95)` | 2 | 1 | Consider creating token |
| `rgba(0,0,0,0.12)` | 2 | 2 | Consider creating token |
| `rgba(255, 255, 255, 0.8)` | 2 | 1 | Consider creating token |
| `rgba(255, 255, 255, 0.7)` | 2 | 1 | Consider creating token |
| `rgba(var(--a11y-cvd-accent-rgb)` | 2 | 1 | Consider creating token |
| `#111111` | 2 | 1 | Consider creating token |
| `#1f2937` | 2 | 1 | Consider creating token |
| `#111` | 2 | 1 | Consider creating token |
| `#fef2f2` | 2 | 1 | Consider creating token |
| `#f0fdfa` | 2 | 1 | Consider creating token |
| `rgba(var(--color-primary-500-rgb, 99, 102, 241)` | 2 | 1 | Consider creating token |
| `#f6f5fa` | 2 | 2 | Replace with `var(--a11y-deuter-c-bg)` |
| `#1c1b29` | 2 | 2 | Replace with `var(--a11y-deuter-c-text)` |
| `#6d28d9` | 2 | 2 | Replace with `var(--a11y-deuter-c-primary)` |
| `#f97316` | 2 | 2 | Replace with `var(--a11y-deuter-c-accent)` |
| `#e6e4e2` | 2 | 2 | Replace with `var(--a11y-mono-c-bg)` |
| `#f5f7fb` | 2 | 2 | Replace with `var(--a11y-proto-c-bg)` |
| `#0f172a` | 2 | 2 | Replace with `var(--a11y-proto-c-text)` |
| `#1e40af` | 2 | 2 | Replace with `var(--a11y-proto-c-primary)` |
| `#fdf4ff` | 2 | 2 | Replace with `var(--a11y-trit-c-bg)` |
| `#1e293b` | 2 | 2 | Replace with `var(--a11y-trit-c-text)` |
| `#cc3399` | 2 | 2 | Replace with `var(--a11y-trit-c-primary)` |
| `#06b6d4` | 2 | 2 | Replace with `var(--a11y-trit-c-accent)` |
| `#fffbf2` | 1 | 1 | Review — single use |
| `gray` | 1 | 1 | Review — single use |
| `#f9fafb` | 1 | 1 | Review — single use |
| `#0052cc` | 1 | 1 | Review — single use |
| `#e5e7eb` | 1 | 1 | Review — single use |
| `#8b5cf6` | 1 | 1 | Review — single use |
| `#374151` | 1 | 1 | Review — single use |
| `#ff6600` | 1 | 1 | Review — single use |
| `#ff00ff` | 1 | 1 | Review — single use |
| `#c17c5a` | 1 | 1 | Review — single use |
| `#040913` | 1 | 1 | Review — single use |
| `#962587` | 1 | 1 | Review — single use |
| `#065f46` | 1 | 1 | Replace with `var(--feedback-success-text)` |
| `#7f1d1d` | 1 | 1 | Replace with `var(--feedback-error-text)` |
| `#92400e` | 1 | 1 | Replace with `var(--feedback-warning-text)` |
| `rgba(255, 255, 255, 0.75)` | 1 | 1 | Review — single use |
| `rgba(0, 0, 0, 0.9)` | 1 | 1 | Review — single use |
| `#8b6b5a` | 1 | 1 | Review — single use |
| `#7a5c4d` | 1 | 1 | Review — single use |
| `rgba(196,144,124,0.15)` | 1 | 1 | Review — single use |
| `rgba(196,144,124,0.08)` | 1 | 1 | Review — single use |
| `rgba(196,144,124,0.3)` | 1 | 1 | Review — single use |
| `rgb(248, 245, 242)` | 1 | 1 | Review — single use |
| `rgba(0, 0, 0, 0.03)` | 1 | 1 | Review — single use |
| `#fdf8f3` | 1 | 1 | Review — single use |
| `#80a575` | 1 | 1 | Replace with `var(--universal-success)` |
| `#cea96a` | 1 | 1 | Replace with `var(--universal-warning)` |
| `#9c5151` | 1 | 1 | Replace with `var(--universal-danger)` |
| `#47638f` | 1 | 1 | Replace with `var(--universal-info)` |
| `#2a3328` | 1 | 1 | Review — single use |
| `#f2efd4` | 1 | 1 | Review — single use |
| `#86a182` | 1 | 1 | Review — single use |
| `#b9a26e` | 1 | 1 | Review — single use |
| `#8ac7b2` | 1 | 1 | Review — single use |
| `#c78a9f` | 1 | 1 | Review — single use |
| `#8abdc7` | 1 | 1 | Review — single use |
| `#bdc78a` | 1 | 1 | Review — single use |
| `#c7948a` | 1 | 1 | Review — single use |
| `#938ac7` | 1 | 1 | Review — single use |
| `#222` | 1 | 1 | Review — single use |
| `#f9f9f9` | 1 | 1 | Review — single use |
| `#444` | 1 | 1 | Review — single use |
| `#181818` | 1 | 1 | Review — single use |
| `#e74c3c` | 1 | 1 | Review — single use |
| `#c0c0c0` | 1 | 1 | Review — single use |
| `#b8a89d` | 1 | 1 | Review — single use |
| `#f7a072` | 1 | 1 | Review — single use |
| `#ffd966` | 1 | 1 | Review — single use |
| `#7a8b99` | 1 | 1 | Review — single use |
| `#c9b8a8` | 1 | 1 | Review — single use |
| `#ff6b6b` | 1 | 1 | Review — single use |
| `#4ecdc4` | 1 | 1 | Review — single use |
| `#2c3e50` | 1 | 1 | Review — single use |
| `#d4af37` | 1 | 1 | Review — single use |
| `#a0826d` | 1 | 1 | Review — single use |
| `#7d9d7c` | 1 | 1 | Review — single use |
| `#5d6d7e` | 1 | 1 | Review — single use |
| `#85929e` | 1 | 1 | Review — single use |
| `#ede7de` | 1 | 1 | Review — single use |
| `#48839e` | 1 | 1 | Review — single use |
| `rgba(255,255,255,0.1)` | 1 | 1 | Review — single use |
| `rgba(0,0,0,0.95)` | 1 | 1 | Review — single use |
| `rgba(0,0,0,0.4)` | 1 | 1 | Review — single use |
| `rgba(255,255,255,0.2)` | 1 | 1 | Review — single use |
| `rgba(0, 0, 0, 0.05)` | 1 | 1 | Review — single use |
| `hsl(h, news, l)` | 1 | 1 | Review — single use |
| `hsl(warmh, news, newl)` | 1 | 1 | Review — single use |
| `hsl(hue, sat, light)` | 1 | 1 | Review — single use |
| `hsl((h1 + 180)` | 1 | 1 | Review — single use |
| `hsl((h1 + 30)` | 1 | 1 | Review — single use |
| `hsl((h2 - 30 + 360)` | 1 | 1 | Review — single use |
| `hsl((h1 + 120)` | 1 | 1 | Review — single use |
| `hsl((h2 + 120)` | 1 | 1 | Review — single use |
| `hsl(neutralhue, neutralsat, neutrallight)` | 1 | 1 | Review — single use |
| `hsl((avghue + 45)` | 1 | 1 | Review — single use |
| `hsl(h, s * 0.6, math.min(0.75, l * 1.15)` | 1 | 1 | Review — single use |
| `hsl(h, math.min(1, s * 1.3)` | 1 | 1 | Review — single use |
| `hsl(h, s * 0.5, math.min(0.7, l * 1.1)` | 1 | 1 | Review — single use |
| `hsl(h, math.min(1, s * 1.4)` | 1 | 1 | Review — single use |
| `hsl(h, math.min(0.9, s * 1.1)` | 1 | 1 | Review — single use |
| `hsl((h + 10)` | 1 | 1 | Review — single use |
| `hsl(h, s * 0.75, l)` | 1 | 1 | Review — single use |
| `hsl(neutralhue, saturation, lightness)` | 1 | 1 | Review — single use |
| `hsl(145, 0.3 * satadjust, 0.92 * lightadjust)` | 1 | 1 | Review — single use |
| `hsl(145, 0.5 * satadjust, 0.80 * lightadjust)` | 1 | 1 | Review — single use |
| `hsl(145, 0.6 * satadjust, 0.50 * lightadjust)` | 1 | 1 | Review — single use |
| `hsl(45, 0.4 * satadjust, 0.92 * lightadjust)` | 1 | 1 | Review — single use |
| `hsl(45, 0.6 * satadjust, 0.80 * lightadjust)` | 1 | 1 | Review — single use |
| `hsl(45, 0.8 * satadjust, 0.60 * lightadjust)` | 1 | 1 | Review — single use |
| `hsl(15, 0.4 * satadjust, 0.92 * lightadjust)` | 1 | 1 | Review — single use |
| `hsl(15, 0.6 * satadjust, 0.80 * lightadjust)` | 1 | 1 | Review — single use |
| `hsl(15, 0.8 * satadjust, 0.55 * lightadjust)` | 1 | 1 | Review — single use |
| `hsl(215, 0.4 * satadjust, 0.92 * lightadjust)` | 1 | 1 | Review — single use |
| `hsl(215, 0.6 * satadjust, 0.80 * lightadjust)` | 1 | 1 | Review — single use |
| `hsl(215, 0.7 * satadjust, 0.55 * lightadjust)` | 1 | 1 | Review — single use |
| `silver` | 1 | 1 | Review — single use |
| `#e3f2fd` | 1 | 1 | Review — single use |
| `#1976d2` | 1 | 1 | Review — single use |
| `#000` | 1 | 1 | Review — single use |
| `hsl(newhue, saturation, lightness)` | 1 | 1 | Review — single use |
| `hsl(hsl[0] || 0, hsl[1], targetlightness)` | 1 | 1 | Review — single use |
| `#cccccc` | 1 | 1 | Review — single use |
| `#7a6b54` | 1 | 1 | Review — single use |
| `#f1f5f9` | 1 | 1 | Review — single use |
| `#ccc` | 1 | 1 | Review — single use |
| `#0a0a0a` | 1 | 1 | Review — single use |
| `#fecaca` | 1 | 1 | Review — single use |
| `#14b8a6` | 1 | 1 | Review — single use |
| `#99f6e4` | 1 | 1 | Review — single use |
| `#b45309` | 1 | 1 | Review — single use |
| `#fffbeb` | 1 | 1 | Review — single use |
| `#fde68a` | 1 | 1 | Review — single use |
| `rgba(0, 0, 0, 0.85)` | 1 | 1 | Review — single use |
| `rgba(250, 248, 244, 0.9)` | 1 | 1 | Review — single use |
| `rgba(255, 255, 255, 0.9)` | 1 | 1 | Review — single use |
| `rgba(0, 0, 0, 0.45)` | 1 | 1 | Review — single use |
| `rgba(255, 255, 255, 0.45)` | 1 | 1 | Review — single use |
| `rgba(209, 213, 219, 0.3)` | 1 | 1 | Review — single use |
| `rgba(20, 20, 30, 0.35)` | 1 | 1 | Review — single use |
| `rgba(255, 255, 255, 0.05)` | 1 | 1 | Review — single use |
| `rgba(255, 255, 255, 0.85)` | 1 | 1 | Review — single use |
| `#1e1e1e` | 1 | 1 | Replace with `var(--a11y-dark-c-surface)` |
| `#2a2a2a` | 1 | 1 | Replace with `var(--a11y-dark-c-surface-raised)` |
| `#3a3a3a` | 1 | 1 | Replace with `var(--a11y-dark-c-border)` |
| `#777` | 1 | 1 | Review — single use |
| `#aaa` | 1 | 1 | Review — single use |
| `#f0fdee` | 1 | 1 | Replace with `var(--color-Primary-200)` |
| `#aec6a9` | 1 | 1 | Replace with `var(--color-Primary-400)` |
| `#42563d` | 1 | 1 | Replace with `var(--color-Primary-800)` |
| `#364433` | 1 | 1 | Replace with `var(--color-Primary-900)` |
| `#fff4ee` | 1 | 1 | Replace with `var(--color-Secondary-100)` |
| `#fff1e7` | 1 | 1 | Replace with `var(--color-Secondary-200)` |
| `#e5af9a` | 1 | 1 | Replace with `var(--color-Secondary-400)` |
| `#a4725f` | 1 | 1 | Replace with `var(--color-Secondary-600)` |
| `#6f4230` | 1 | 1 | Replace with `var(--color-Secondary-800)` |
| `#d2d1cc` | 1 | 1 | Replace with `var(--color-Background-200)` |
| `#b4b1a8` | 1 | 1 | Replace with `var(--color-Background-300)` |
| `#95928a` | 1 | 1 | Replace with `var(--color-Background-400)` |
| `#77746c` | 1 | 1 | Replace with `var(--color-Background-500)` |
| `#f8f8f8` | 1 | 1 | Replace with `var(--color-Text-50)` |
| `#d3d3d3` | 1 | 1 | Replace with `var(--color-Text-300)` |
| `#b3b3b3` | 1 | 1 | Replace with `var(--color-Text-400)` |
| `#949494` | 1 | 1 | Replace with `var(--color-Text-500)` |
| `#292624` | 1 | 1 | Replace with `var(--color-Neutral-900)` |
| `#fef7f3` | 1 | 1 | Replace with `var(--color-AccentOne-100)` |
| `#f3e6e0` | 1 | 1 | Replace with `var(--color-AccentOne-200)` |
| `#dcc3b6` | 1 | 1 | Replace with `var(--color-AccentOne-300)` |
| `#bba397` | 1 | 1 | Replace with `var(--color-AccentOne-400)` |
| `#7e685c` | 1 | 1 | Replace with `var(--color-AccentOne-600)` |
| `#614c41` | 1 | 1 | Replace with `var(--color-AccentOne-700)` |
| `#4d392f` | 1 | 1 | Replace with `var(--color-AccentOne-800)` |
| `#f4f8ff` | 1 | 1 | Replace with `var(--color-AccentTwo-100)` |
| `#e9f0ff` | 1 | 1 | Replace with `var(--color-AccentTwo-200)` |
| `#c1cff6` | 1 | 1 | Replace with `var(--color-AccentTwo-300)` |
| `#a1afd5` | 1 | 1 | Replace with `var(--color-AccentTwo-400)` |
| `#667296` | 1 | 1 | Replace with `var(--color-AccentTwo-600)` |
| `#4a5677` | 1 | 1 | Replace with `var(--color-AccentTwo-700)` |
| `#384263` | 1 | 1 | Replace with `var(--color-AccentTwo-800)` |
| `#fcf6fa` | 1 | 1 | Replace with `var(--color-AccentThree-100)` |
| `#f1e8ee` | 1 | 1 | Replace with `var(--color-AccentThree-200)` |
| `#d6c4d1` | 1 | 1 | Replace with `var(--color-AccentThree-300)` |
| `#b6a4b1` | 1 | 1 | Replace with `var(--color-AccentThree-400)` |
| `#796974` | 1 | 1 | Replace with `var(--color-AccentThree-600)` |
| `#5c4d58` | 1 | 1 | Replace with `var(--color-AccentThree-700)` |
| `#493a45` | 1 | 1 | Replace with `var(--color-AccentThree-800)` |
| `#b5b9bf` | 1 | 1 | Replace with `var(--color-AccentFour-100)` |
| `#9aa1aa` | 1 | 1 | Replace with `var(--color-AccentFour-200)` |
| `#768395` | 1 | 1 | Replace with `var(--color-AccentFour-300)` |
| `#596677` | 1 | 1 | Replace with `var(--color-AccentFour-400)` |
| `#25303f` | 1 | 1 | Replace with `var(--color-AccentFour-600)` |
| `#0d1825` | 1 | 1 | Replace with `var(--color-AccentFour-700)` |
| `#020815` | 1 | 1 | Replace with `var(--color-AccentFour-800)` |
| `#fdf5ff` | 1 | 1 | Replace with `var(--color-AccentFive-100)` |
| `#fcefff` | 1 | 1 | Replace with `var(--color-AccentFive-200)` |
| `#e2c8ee` | 1 | 1 | Replace with `var(--color-AccentFive-300)` |
| `#c1a9cd` | 1 | 1 | Replace with `var(--color-AccentFive-400)` |
| `#846c8e` | 1 | 1 | Replace with `var(--color-AccentFive-600)` |
| `#665070` | 1 | 1 | Replace with `var(--color-AccentFive-700)` |
| `#533d5c` | 1 | 1 | Replace with `var(--color-AccentFive-800)` |
| `rgba(255,255,255,0.3)` | 1 | 1 | Review — single use |
| `rgba(255, 153, 200, 0.15)` | 1 | 1 | Replace with `var(--rainbow-hover-primary)` |
| `rgba(174, 136, 191, 0.15)` | 1 | 1 | Replace with `var(--rainbow-hover-secondary)` |
| `rgba(128, 225, 204, 0.15)` | 1 | 1 | Replace with `var(--rainbow-hover-accent)` |
| `rgba(255, 248, 237, 0.8)` | 1 | 1 | Replace with `var(--rainbow-hover-cream)` |
| `rgba(31, 38, 135, 0.37)` | 1 | 1 | Review — single use |

### Hardcoded Colour Locations

#### `white` (225 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 270
  `"dont": "Avoid bright, aggressive colors that might trigger anxiety. Don't use high-contrast or neon shades. Avoid pure `
- **docs\Brand\BRAND-PROFILE.json** line 332
  `"buttonPrimary": "Sage green background (#8fa68a), white text, rounded corners (8px), soft shadow, hover lifts with enha`
- **docs\Brand\WWAS BRAND NOTES.md** line 64
  `Example Tone: “It’s time to leave past hurts behind and step into the life you’ve always deserved. Our resources are her`
- **docs\Markdown Notes\Button-System.md** line 95
  `color: var(--color-White);  /* Change this */`
- **docs\Markdown Notes\CSS-Standards.md** line 460
  `.badge { background: #4CAF50; color: white; }`
- **docs\Markdown Notes\CSS-Tokens.md** line 86
  `--color-White`
- **docs\Markdown Notes\CSS-Tokens.md** line 108
  `background: color-mix(in oklch, var(--color-White) 12%, transparent);`
- **docs\Markdown Notes\CSS-Tokens.md** line 543
  `color-mix(in oklch, var(--color-White) 12%, transparent)`
- **docs\reports\color-token-usage-report.md** line 559
  `### --color-White`
- **docs\reports\color-token-usage-report.md** line 561
  `- **Purposes:** Button text, white text overlays, hero text, neumorphic shadows, presentation reader backgrounds, glass `
- **docs\reports\color-token-usage-report.md** line 596
  `8. **--color-White** (77 uses) - WHITE TEXT/BACKGROUNDS`
- **docs\todo\TODO.md** line 362
  `--text-inverse: var(--color-White);`
- **docs\todo\TODO.md** line 389
  `--form-bg: var(--color-White);`
- **docs\todo\TODO.md** line 452
  `- [ ] Replace `#ffffff` with `var(--color-White)``
- **docs\todo\TODO.md** line 459
  `- [ ] Replace `white` keyword with `var(--color-White)``
- **docs\todo\TODO.md** line 481
  `- [ ] Replace `background: white` with token`
- **docs\todo\TODO.md** line 488
  `- `--print-background: var(--color-White)``
- **files\example-a11y-cream-NEW.css** line 46
  `--btn-filled-text: var(--color-White);`
- **files\example-BrandDefault-NEW.css** line 46
  `--btn-filled-text: var(--color-White);`
- **src\components\Badge\Badge.astro** line 198
  `color: var(--color-White);`
- **src\components\Badge\Badge.astro** line 225
  `color: var(--color-White) !important;`
- **src\components\Cards\StepCard.astro** line 51
  `color: white;`
- **src\components\ContactForm\Contact-Popup.astro** line 173
  `color: var(--color-White);`
- **src\components\ContactForm\Contact-Popup.astro** line 187
  `color: var(--color-White);`
- **src\components\ContactForm\Contact-Popup.astro** line 196
  `color: color-mix(in srgb, var(--color-White) 85%, transparent);`
- **src\components\ContactForm\Contact-Popup.astro** line 224
  `color: var(--color-White);`
- **src\components\ContactForm\Contact-Popup.astro** line 283
  `color: var(--color-White);`
- **src\components\ContactForm\Contact-Popup.astro** line 364
  `color: var(--color-White);`
- **src\components\Grids\ForYouGrid.astro** line 107
  `border: 2px solid var(--color-White);`
- **src\components\Grids\ForYouGrid.astro** line 126
  `color: var(--color-White);`
- **src\components\Grids\ForYouGrid.astro** line 131
  `border: 2px solid var(--color-White);`
- **src\components\Grids\ForYouGrid.astro** line 161
  `color: var(--color-White);`
- **src\components\Grids\ForYouGrid.astro** line 170
  `color: var(--color-White);`
- **src\components\Grids\RelatedGrid.astro** line 349
  `border: 3px solid var(--color-White);`
- **src\components\Grids\RelatedGrid.astro** line 378
  `color: var(--color-White);`
- **src\components\Grids\RelatedGrid.astro** line 389
  `color: var(--color-White);`
- **src\components\Grids\RelatedGrid.astro** line 410
  `color: var(--color-White);`
- **src\components\Grids\RelatedGrid.astro** line 431
  `color: var(--color-White);`
- **src\components\Grids\RelatedGrid.astro** line 436
  `border: 3px solid var(--color-White);`
- **src\components\Grids\RelatedGrid.astro** line 473
  `border: 4px solid var(--color-White);`
- **src\components\Grids\RelatedGrid.astro** line 503
  `color: var(--color-White);`
- **src\components\Grids\RelatedGrid.astro** line 524
  `color: var(--color-White);`
- **src\components\Grids\RelatedGrid.astro** line 528
  `background: var(--color-White);`
- **src\components\Grids\RelatedGrid.astro** line 530
  `border-color: var(--color-White);`
- **src\components\Grids\RelatedGrid.astro** line 591
  `color: var(--color-White);`
- **src\components\Grids\RelatedGrid.astro** line 811
  `color: var(--color-White) !important;`
- **src\components\Insights\InsightHeader.astro** line 159
  `color: var(--color-White);`
- **src\components\Presentation\Sections\EndSection.astro** line 307
  `color: var(--color-White);`
- **src\components\Presentation\Sections\FullWidthSection.astro** line 85
  `color: var(--color-White);`
- **src\components\Presentation\Sections\FullWidthSection.astro** line 94
  `color: var(--color-White);`
- **src\components\Presentation\Sections\FullWidthSection.astro** line 100
  `color: var(--color-White);`
- **src\components\Presentation\Sections\FullWidthSection.astro** line 109
  `color: var(--color-White);`
- **src\components\Presentation\Sections\HeroSection.astro** line 94
  `color: var(--color-White, #fff);`
- **src\components\Presentation\Sections\TitleSection.astro** line 127
  `color: var(--color-White);`
- **src\components\Presentation\Sections\TitleSection.astro** line 141
  `background: var(--color-White);`
- **src\components\Presentation\Sections\TitleSection.astro** line 146
  `color: var(--color-White);`
- **src\components\Presentation\Sections\TitleSection.astro** line 147
  `border-color: var(--color-White);`
- **src\components\Presentation\Sections\TitleSection.astro** line 151
  `background: color-mix(in oklch, var(--color-White) 20%, transparent);`
- **src\components\Presentation\Sections\TitleSection.astro** line 152
  `border-color: var(--color-White);`
- **src\components\Presentation\Sections\TitleSection.astro** line 176
  `color: var(--color-White);`
- **src\components\Presentation\Sections\TitleSection.astro** line 251
  `color: var(--color-White);`
- **src\components\Product\ProductInfo.astro** line 138
  `color: var(--color-White);`
- **src\components\Search\SearchOverlay.astro** line 323
  `color: white;`
- **src\components\Sections\ShareSection.astro** line 143
  `background: var(--color-White-80);`
- **src\components\Sections\ShareSection.astro** line 162
  `color: var(--color-White);`
- **src\components\Typography\SectionTitle.astro** line 369
  `color: var(--color-White);`
- **src\Content\assets\franz-kline-presentation\index.md** line 11
  `<p>This comprehensive artist study explores Franz Kline (1910-1962), a leading figure in Abstract Expressionism renowned`
- **src\lib\emailit.ts** line 135
  `background: ${BRAND_COLORS.white};`
- **src\lib\emailit.ts** line 151
  `color: ${BRAND_COLORS.white};`
- **src\lib\emailit.ts** line 193
  `color: ${BRAND_COLORS.white} !important;`
- **src\lib\emailit.ts** line 214
  `background: ${BRAND_COLORS.white};`
- **src\lib\animation\particle-burst.ts** line 117
  `particle.style.border = '2px solid white';`
- **src\pages\search.astro** line 205
  `color: var(--color-White);`
- **src\pages\search.astro** line 217
  `color: color-mix(in srgb, var(--color-White) 85%, transparent);`
- **src\pages\search.astro** line 249
  `background: var(--color-White);`
- **src\pages\search.astro** line 259
  `box-shadow: var(--shadow-2xl), 0 0 0 var(--space-xs) color-mix(in srgb, var(--color-White) 30%, transparent);`
- **src\pages\search.astro** line 309
  `background: var(--color-White);`
- **src\pages\verify.astro** line 199
  `background: white;`
- **src\pages\api\contact.ts** line 52
  `background: ${BRAND_COLORS.white};`
- **src\pages\api\contact.ts** line 65
  `color: ${BRAND_COLORS.white};`
- **src\pages\services\[slug].astro** line 334
  `color: var(--color-White);`
- **src\pages\showcase\section-titles.astro** line 441
  `background: var(--color-White);`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 202
  `background: white;`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 266
  `background: white;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 48
  `background: white;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 132
  `background: white;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 283
  `color: white;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 341
  `color: white;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 404
  `background: white;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 423
  `color: white;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 438
  `color: white;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 475
  `background: white;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 483
  `color: white;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 575
  `color: white;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 632
  `color: white;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 667
  `background: white;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 684
  `color: white;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 795
  `<button class="generate-btn" onclick="chooseAgain()" style="background: #4A90E2; color: white; flex: 0.5; min-width: 150`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 796
  `<button class="generate-btn" onclick="clearAll()" style="background: #E74C3C; color: white; flex: 0.5; min-width: 150px;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2107
  `color: white;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2129
  `background: white;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2268
  `color: white;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2284
  `background: white;`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 64
  `background: white;`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 95
  `color: white;`
- **src\styles\a11y\base\print.css** line 48
  `background: white !important;`
- **src\styles\a11y\base\screen-reader.css** line 34
  `color: var(--color-White);`
- **src\styles\a11y\base\theme-overrides.css** line 146
  `color: var(--color-White) !important;`
- **src\styles\a11y\base\theme-overrides.css** line 157
  `color: var(--color-White) !important;`
- **src\styles\a11y\components\masonry-grid.css** line 251
  `color: white !important;`
- **src\styles\a11y\components\masonry-grid.css** line 347
  `color: white !important;`
- **src\styles\a11y\components\masonry-grid.css** line 491
  `color: white !important;`
- **src\styles\a11y\components\masonry-grid.css** line 510
  `color: white !important;`
- **src\styles\a11y\components\switcher.css** line 178
  `color: var(--color-White) !important;`
- **src\styles\a11y\components\switcher.css** line 217
  `color: var(--color-White);`
- **src\styles\a11y\motion\reduced-motion.css** line 253
  `color: var(--color-White) !important;`
- **src\styles\a11y\motion\reduced-motion.css** line 258
  `color: var(--color-White) !important;`
- **src\styles\a11y\motion\reduced-motion.css** line 264
  `color: var(--color-White) !important;`
- **src\styles\a11y\motion\reduced-motion.css** line 269
  `color: var(--color-White) !important;`
- **src\styles\a11y\motion\reduced-motion.css** line 274
  `color: var(--color-White) !important;`
- **src\styles\a11y\motion\reduced-motion.css** line 279
  `color: var(--color-White) !important;`
- **src\styles\a11y\motion\reduced-motion.css** line 284
  `color: var(--color-White) !important;`
- **src\styles\a11y\motion\reduced-motion.css** line 306
  `box-shadow: 6px 6px 12px var(--color-Background-300), -6px -6px 12px var(--color-White) !important;`
- **src\styles\a11y\motion\reduced-motion.css** line 312
  `color: var(--color-White) !important;`
- **src\styles\a11y\motion\reduced-motion.css** line 1000
  `background: var(--color-White);`
- **src\styles\a11y\motion\reduced-motion.css** line 1015
  `background: var(--color-White);`
- **src\styles\a11y\visual\highlight-links.css** line 312
  `color: var(--color-White) !important;`
- **src\styles\a11y\visual\highlight-links.css** line 315
  `text-decoration-color: var(--color-White) !important;`
- **src\styles\a11y\visual\highlight-links.css** line 393
  `color: var(--color-White) !important;`
- **src\styles\a11y\visual\text-only.css** line 1991
  `background: var(--color-White) !important;`
- **src\styles\base\utilities.css** line 161
  `.bg-white { background-color: var(--color-Background-50); }`
- **src\styles\base\utilities.css** line 440
  `color: var(--color-White);`
- **src\styles\base\utilities.css** line 455
  `color: var(--color-White);`
- **src\styles\base\utilities.css** line 470
  `color: var(--color-White);`
- **src\styles\base\utilities.css** line 485
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 25
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 31
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 55
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 60
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 65
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 70
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 75
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 80
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 85
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 90
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 95
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 100
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 105
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 110
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 115
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 120
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 134
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 241
  `box-shadow: 6px 6px 12px var(--color-Background-300), -6px -6px 12px var(--color-White);`
- **src\styles\buttons\basic-button.css** line 245
  `box-shadow: 4px 4px 8px var(--color-Background-300), -4px -4px 8px var(--color-White);`
- **src\styles\buttons\basic-button.css** line 249
  `box-shadow: inset 4px 4px 8px var(--color-Background-300), inset -4px -4px 8px var(--color-White);`
- **src\styles\buttons\basic-button.css** line 254
  `color: var(--color-White);`
- **src\styles\buttons\basic-button.css** line 260
  `color: var(--color-White);`
- **src\styles\components\announcement-ticker.css** line 33
  `color: var(--color-White);`
- **src\styles\components\announcement-ticker.css** line 38
  `color: var(--color-White);`
- **src\styles\components\announcement-ticker.css** line 43
  `color: var(--color-White);`
- **src\styles\components\announcement-ticker.css** line 48
  `color: var(--color-White);`
- **src\styles\components\editorial-layout.css** line 110
  `background: var(--color-White);`
- **src\styles\components\hero-section.css** line 196
  `color: var(--color-White);`
- **src\styles\components\hero-section.css** line 202
  `color: color-mix(in oklch, var(--color-White) 90%, transparent);`
- **src\styles\components\hero-section.css** line 208
  `color: color-mix(in oklch, var(--color-White) 80%, transparent);`
- **src\styles\components\masonry-card.css** line 353
  `color: var(--color-White);`
- **src\styles\components\masonry-card.css** line 373
  `background: var(--color-White);`
- **src\styles\components\masonry-card.css** line 383
  `color: var(--color-White);`
- **src\styles\components\philosophy-flip-cards.css** line 96
  `color: var(--color-White);`
- **src\styles\components\search-results.css** line 5
  `background: var(--color-White);`
- **src\styles\components\search-results.css** line 78
  `color: var(--color-White);`
- **src\styles\components\search-results.css** line 87
  `color: var(--color-White);`
- **src\styles\components\search-results.css** line 92
  `color: var(--color-White);`
- **src\styles\components\search-results.css** line 97
  `color: var(--color-White);`
- **src\styles\components\search-results.css** line 102
  `color: var(--color-White);`
- **src\styles\components\search-results.css** line 107
  `color: var(--color-White);`
- **src\styles\components\search-results.css** line 112
  `color: var(--color-White);`
- **src\styles\components\nav\GlassNav-base.css** line 18
  `border-bottom: var(--border-width) solid var(--color-White);`
- **src\styles\components\nav\GlassNav-base.css** line 26
  `background: var(--color-White-5);`
- **src\styles\components\nav\GlassNav-mobile.css** line 43
  `background: color-mix(in oklch, var(--color-White) 50%, transparent);`
- **src\styles\components\nav\GlassNav-mobile.css** line 307
  `background: color-mix(in oklch, var(--color-White) 60%, transparent);`
- **src\styles\components\presentation\ReaderNav.css** line 140
  `color: var(--color-White);`
- **src\styles\components\presentation\ReaderNav.css** line 167
  `border-bottom: 1px solid color-mix(in oklch, var(--color-White) 20%, transparent);`
- **src\styles\components\presentation\ReaderNav.css** line 181
  `color: var(--color-White);`
- **src\styles\components\presentation\ReaderNav.css** line 191
  `background: color-mix(in oklch, var(--color-White) 15%, transparent);`
- **src\styles\components\presentation\ReaderNav.css** line 196
  `color: var(--color-White);`
- **src\styles\components\presentation\ReaderNav.css** line 790
  `stroke: color-mix(in oklch, var(--color-White) 25%, transparent);`
- **src\styles\components\presentation\ReaderNav.css** line 794
  `stroke: var(--color-White);`
- **src\styles\components\presentation\ReaderNav.css** line 810
  `border: var(--border-width) solid var(--color-White-15);`
- **src\styles\components\presentation\ReaderNav.css** line 823
  `background: var(--color-White);`
- **src\styles\components\presentation\ReaderNav.css** line 836
  `stroke: color-mix(in oklch, var(--color-White) 25%, transparent);`
- **src\styles\components\presentation\ReaderNav.css** line 840
  `stroke: var(--color-White);`
- **src\styles\components\presentation\ReaderNav.css** line 923
  `stroke: color-mix(in oklch, var(--color-White) 30%, transparent);`
- **src\styles\components\presentation\ReaderNav.css** line 1378
  `color: var(--color-White);`
- **src\styles\components\presentation\ReaderNav.css** line 1406
  `color: var(--color-White);`
- **src\styles\components\presentation\ReaderNav.css** line 1426
  `color: var(--color-White);`
- **src\styles\components\presentation\ReaderNav.css** line 1437
  `border: 1px solid color-mix(in oklch, var(--color-White) 20%, transparent);`
- **src\styles\components\presentation\ReaderNav.css** line 1441
  `background: color-mix(in oklch, var(--color-White) 10%, transparent);`
- **src\styles\components\presentation\ReaderNav.css** line 1442
  `color: var(--color-White);`
- **src\styles\design\GlowTokens.css** line 8
  `color: var(--color-White);`
- **src\styles\design\GlowTokens.css** line 16
  `color: var(--color-White);`
- **src\styles\pages\checkout.css** line 76
  `color: white;`
- **src\styles\pages\checkout.css** line 114
  `color: white;`
- **src\styles\pages\checkout.css** line 166
  `background: white;`
- **src\styles\pages\service-detail.css** line 208
  `color: var(--color-White);`
- **src\styles\pages\service-detail.css** line 266
  `color: var(--color-White);`
- **src\styles\pages\service-detail.css** line 287
  `color: var(--color-White);`
- **src\styles\pages\service-detail.css** line 292
  `border-color: var(--color-White);`
- **src\styles\pages\service-detail.css** line 309
  `background: var(--color-White);`
- **src\styles\pages\services.css** line 57
  `color: var(--color-White) !important;`
- **src\styles\pages\services.css** line 94
  `color: var(--color-White) !important;`
- **src\styles\pages\services.css** line 146
  `color: var(--color-White);`
- **src\styles\pages\services.css** line 151
  `color: var(--color-White);`
- **src\styles\pages\services.css** line 214
  `color: var(--color-White);`
- **src\styles\themes\a11y\a11y-cream.css** line 144
  `--btn-filled-text: var(--color-White);`
- **src\styles\themes\a11y\a11y-deuteranopia.css** line 144
  `--btn-filled-text: var(--color-White);`
- **src\styles\themes\a11y\a11y-monochrome.css** line 144
  `--btn-filled-text: var(--color-White);`
- **src\styles\themes\a11y\a11y-protanopia.css** line 144
  `--btn-filled-text: var(--color-White);`
- **src\styles\themes\a11y\a11y-tritanopia.css** line 144
  `--btn-filled-text: var(--color-White);`
- **src\styles\tokens\index.css** line 11
  `@import './status.css';       /* Status colors, black/white - universal across themes */`
- **src\styles\tokens\shadows.css** line 39
  `inset -10px -10px 82px color-mix(in oklch, var(--color-White) 60%, transparent);`
- **src\styles\tokens\shadows.css** line 43
  `inset -28px -28px 47px var(--color-White);`
- **src\styles\tokens\shadows.css** line 47
  `inset -15px -15px 45px color-mix(in oklch, var(--color-White) 40%, transparent),`
- **src\styles\tokens\shadows.css** line 52
  `inset -20px -20px 60px color-mix(in oklch, var(--color-White) 50%, transparent),`
- **src\styles\tokens\status.css** line 11
  `--color-White: #ffffff;`

#### `#ffffff` (65 occurrences)

- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 169
  `"background": { "type": "string", "description": "Page background hex", "example": "#FFFFFF" },`
- **docs\Markdown Notes\accessibility-color-themes.md** line 217
  `--color-Text-300: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 218
  `--color-Text-400: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 219
  `--color-Text-500: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 220
  `--color-Text-600: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 221
  `--color-Text-700: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 222
  `--color-Text-800: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 223
  `--color-Text-900: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 224
  `--color-Text-950: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 226
  `--color-Primary-500: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 244
  `--text: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 245
  `--textMuted: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 247
  `--linkHover: #ffffff;`
- **docs\todo\TODO.md** line 452
  `- [ ] Replace `#ffffff` with `var(--color-White)``
- **docs\todo\TODO.md** line 464
  `- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens`
- **docs\todo\TODO.md** line 473
  `- [ ] Replace `#ffffff`, `#000000`, `#333333` with tokens`
- **files\example-BrandDefault-NEW.css** line 32
  `--brand-c-bg-light: #ffffff;`
- **src\components\Shop\MiniCart.astro** line 210
  `color: #ffffff !important;`
- **src\lib\emailit.ts** line 83
  `white: '#ffffff',`
- **src\pages\api\contact.ts** line 16
  `white: '#ffffff',`
- **src\pages\services\[slug].astro** line 258
  `background: linear-gradient(145deg, #e6e2da, #ffffff);`
- **src\pages\services\[slug].astro** line 259
  `box-shadow: 20px 20px 40px #bdbab3, -20px -20px 40px #ffffff;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1842
  `cta.style.color = '#ffffff';`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1854
  `sidebar.style.color = '#ffffff';`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1856
  `document.getElementById('previewSidebarTitle').style.color = '#ffffff';`
- **src\styles\a11y\base\theme-overrides.css** line 218
  `background: #ffffff !important;`
- **src\styles\a11y\base\theme-overrides.css** line 247
  `color: #ffffff !important;`
- **src\styles\a11y\base\theme-overrides.css** line 286
  `color: #ffffff !important;`
- **src\styles\a11y\base\theme-overrides.css** line 327
  `color: #ffffff !important;`
- **src\styles\a11y\base\theme-overrides.css** line 410
  `color: #ffffff !important;`
- **src\styles\a11y\base\theme-overrides.css** line 472
  `background: #ffffff !important;`
- **src\styles\a11y\base\theme-overrides.css** line 488
  `color: #ffffff !important;`
- **src\styles\a11y\base\theme-overrides.css** line 518
  `color: #ffffff !important;`
- **src\styles\a11y\base\theme-overrides.css** line 545
  `color: #ffffff !important;`
- **src\styles\a11y\base\theme-overrides.css** line 596
  `color: #ffffff !important;`
- **src\styles\a11y\components\search-overlay.css** line 122
  `background: color-mix(in oklch, #ffffff 95%, transparent) !important;`
- **src\styles\a11y\components\search-overlay.css** line 127
  `background: #ffffff !important;`
- **src\styles\a11y\components\search-overlay.css** line 145
  `background: #ffffff !important;`
- **src\styles\a11y\components\search-overlay.css** line 163
  `color: #ffffff !important;`
- **src\styles\a11y\components\search-overlay.css** line 207
  `color: #ffffff !important;`
- **src\styles\a11y\components\switcher.css** line 18
  `color: #ffffff !important;`
- **src\styles\a11y\components\switcher.css** line 67
  `color: #ffffff !important;`
- **src\styles\a11y\components\switcher.css** line 103
  `color: #ffffff !important;`
- **src\styles\a11y\motion\reduced-motion.css** line 329
  `box-shadow: 8px 8px 20px #bdbab3, -8px -8px 20px #ffffff !important;`
- **src\styles\a11y\pages\asset-detail.css** line 27
  `color: var(--a11y-hc-text, #ffffff) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 35
  `color: var(--a11y-hc-text, #ffffff) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 132
  `color: var(--a11y-hc-text, #ffffff) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 136
  `color: var(--a11y-hc-text, #ffffff) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 153
  `color: var(--a11y-hc-text, #ffffff) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 278
  `color: var(--a11y-hc-text, #ffffff) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 345
  `color: var(--a11y-hc-text, #ffffff) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 408
  `color: var(--a11y-hc-text, #ffffff) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 412
  `color: var(--a11y-hc-text, #ffffff) !important;`
- **src\styles\a11y\pages\services.css** line 12
  `color: var(--a11y-hc-text, #ffffff) !important;`
- **src\styles\pages\asset-detail.css** line 384
  `background: linear-gradient(145deg, #e6e2da, #ffffff);`
- **src\styles\pages\asset-detail.css** line 386
  `box-shadow: 29px 29px 60px #bdbab3, -29px -29px 60px #ffffff;`
- **src\styles\pages\asset-detail.css** line 545
  `background: linear-gradient(145deg, #e6e2da, #ffffff);`
- **src\styles\pages\asset-detail.css** line 546
  `box-shadow: 29px 29px 60px #bdbab3, -29px -29px 60px #ffffff;`
- **src\styles\pages\service-detail.css** line 132
  `background: linear-gradient(145deg, #e6e2da, #ffffff);`
- **src\styles\pages\service-detail.css** line 133
  `box-shadow: 20px 20px 40px #bdbab3, -20px -20px 40px #ffffff;`
- **src\styles\pages\services.css** line 124
  `background: linear-gradient(145deg, #e6e2da, #ffffff);`
- **src\styles\pages\services.css** line 125
  `box-shadow: 8px 8px 20px #bdbab3, -8px -8px 20px #ffffff;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 15
  `--a11y-hc-c-text: #ffffff;`
- **src\styles\themes\Preview\coretokens.css** line 32
  `--a11y-high-contrast-c-text: #ffffff;`
- **src\styles\tokens\status.css** line 11
  `--color-White: #ffffff;`

#### `black` (34 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 270
  `"dont": "Avoid bright, aggressive colors that might trigger anxiety. Don't use high-contrast or neon shades. Avoid pure `
- **docs\Markdown Notes\CSS-Tokens.md** line 85
  `--color-Black`
- **docs\Markdown Notes\CSS-Tokens.md** line 546
  `color-mix(in oklch, var(--color-Black) 85%, transparent)`
- **docs\reports\color-token-usage-report.md** line 573
  `### --color-Black`
- **docs\todo\TODO.md** line 453
  `- [ ] Replace `#000000` with `var(--color-Black)``
- **docs\todo\TODO.md** line 460
  `- [ ] Replace `rgba(0, 0, 0, 0.1)` with `color-mix(in oklch, var(--color-Black) 10%, transparent)``
- **docs\todo\TODO.md** line 461
  `- [ ] Replace `rgba(0, 0, 0, 0.6)` with `color-mix(in oklch, var(--color-Black) 60%, transparent)``
- **docs\todo\TODO.md** line 482
  `- [ ] Replace `color: black` with token`
- **docs\todo\TODO.md** line 487
  `- `--print-text: var(--color-Black)``
- **docs\todo\TODO.md** line 508
  `background: color-mix(in oklch, var(--color-Black) 10%, transparent);`
- **src\components\Badge\Badge.astro** line 245
  `box-shadow: inset 0 2px 4px color-mix(in oklch, var(--color-Black) 20%, transparent);`
- **src\components\Sections\ShareSection.astro** line 146
  `box-shadow: 0 6px 20px var(--color-Black-10);`
- **src\components\Sections\ShareSection.astro** line 150
  `box-shadow: 0 2px 8px var(--color-Black-5);`
- **src\Content\assets\franz-kline-presentation\index.md** line 11
  `<p>This comprehensive artist study explores Franz Kline (1910-1962), a leading figure in Abstract Expressionism renowned`
- **src\styles\components\philosophy-flip-cards.css** line 87
  `color-mix(in oklch, var(--color-Black) 70%, transparent) 0%,`
- **src\styles\components\philosophy-flip-cards.css** line 88
  `color-mix(in oklch, var(--color-Black) 50%, transparent) 50%,`
- **src\styles\components\nav\GlassNav-base.css** line 29
  `box-shadow: 0 4px 12px var(--color-Black-5);`
- **src\styles\components\nav\GlassNav-expandable.css** line 77
  `box-shadow: 0 4px 12px var(--color-Black-10);`
- **src\styles\tokens\gradients.css** line 233
  `--gradient-success: linear-gradient(135deg, var(--color-Success) 0%, color-mix(in oklch, var(--color-Success) 70%, black`
- **src\styles\tokens\gradients.css** line 234
  `--gradient-warning: linear-gradient(135deg, var(--color-Warning) 0%, color-mix(in oklch, var(--color-Warning) 70%, black`
- **src\styles\tokens\gradients.css** line 235
  `--gradient-error: linear-gradient(135deg, var(--color-Danger) 0%, color-mix(in oklch, var(--color-Danger) 70%, black) 10`
- **src\styles\tokens\index.css** line 11
  `@import './status.css';       /* Status colors, black/white - universal across themes */`
- **src\styles\tokens\shadows.css** line 20
  `color-mix(in oklch, var(--color-Black) 4%, transparent);`
- **src\styles\tokens\shadows.css** line 23
  `color-mix(in oklch, var(--color-Black) 5%, transparent);`
- **src\styles\tokens\shadows.css** line 26
  `color-mix(in oklch, var(--color-Black) 6%, transparent);`
- **src\styles\tokens\shadows.css** line 29
  `color-mix(in oklch, var(--color-Black) 7%, transparent);`
- **src\styles\tokens\shadows.css** line 32
  `color-mix(in oklch, var(--color-Black) 8%, transparent);`
- **src\styles\tokens\shadows.css** line 38
  `inset 10px 10px 82px  color-mix(in oklch, var(--color-Black) 12%, transparent),`
- **src\styles\tokens\shadows.css** line 42
  `inset 28px 28px 47px color-mix(in oklch, var(--color-Black) 43%, transparent),`
- **src\styles\tokens\shadows.css** line 46
  `inset 15px 15px 45px color-mix(in oklch, var(--color-Black) 35%, transparent),`
- **src\styles\tokens\shadows.css** line 48
  `inset 0 0 0 3px color-mix(in oklch, var(--color-Black) 20%, transparent);`
- **src\styles\tokens\shadows.css** line 51
  `inset 20px 20px 60px color-mix(in oklch, var(--color-Black) 45%, transparent),`
- **src\styles\tokens\shadows.css** line 53
  `inset 0 0 0 4px color-mix(in oklch, var(--color-Black) 25%, transparent);`
- **src\styles\tokens\status.css** line 10
  `--color-Black: #121212;`

#### `#333333` (34 occurrences)

- **docs\todo\TODO.md** line 454
  `- [ ] Replace `#333333` with `var(--color-Neutral-800)` or semantic token`
- **docs\todo\TODO.md** line 457
  `- [ ] Replace 12+ instances of `#333333``
- **docs\todo\TODO.md** line 464
  `- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens`
- **docs\todo\TODO.md** line 473
  `- [ ] Replace `#ffffff`, `#000000`, `#333333` with tokens`
- **src\styles\a11y\base\theme-overrides.css** line 304
  `border: 2px solid #333333 !important;`
- **src\styles\a11y\base\theme-overrides.css** line 315
  `color: #333333 !important;`
- **src\styles\a11y\base\theme-overrides.css** line 326
  `background: #333333 !important;`
- **src\styles\a11y\base\theme-overrides.css** line 332
  `background: #333333 !important;`
- **src\styles\a11y\base\theme-overrides.css** line 333
  `border-color: #333333 !important;`
- **src\styles\a11y\base\theme-overrides.css** line 525
  `border: 2px solid #333333 !important;`
- **src\styles\a11y\base\theme-overrides.css** line 534
  `color: #333333 !important;`
- **src\styles\a11y\base\theme-overrides.css** line 539
  `color: #333333 !important;`
- **src\styles\a11y\base\theme-overrides.css** line 544
  `background: #333333 !important;`
- **src\styles\a11y\components\masonry-grid.css** line 250
  `background: #333333 !important;`
- **src\styles\a11y\components\masonry-grid.css** line 252
  `border: 1px solid #333333 !important;`
- **src\styles\a11y\components\masonry-grid.css** line 271
  `color: #333333 !important;`
- **src\styles\a11y\components\masonry-grid.css** line 272
  `fill: #333333 !important;`
- **src\styles\a11y\components\masonry-grid.css** line 291
  `fill: #333333 !important;`
- **src\styles\a11y\components\masonry-grid.css** line 309
  `color: #333333 !important;`
- **src\styles\a11y\components\search-overlay.css** line 128
  `border: 2px solid #333333 !important;`
- **src\styles\a11y\components\search-overlay.css** line 133
  `color: #333333 !important;`
- **src\styles\a11y\components\search-overlay.css** line 146
  `border-color: #333333 !important;`
- **src\styles\a11y\components\search-overlay.css** line 147
  `color: #333333 !important;`
- **src\styles\a11y\components\search-overlay.css** line 155
  `color: #333333 !important;`
- **src\styles\a11y\components\search-overlay.css** line 162
  `background: #333333 !important;`
- **src\styles\a11y\components\switcher.css** line 57
  `border: 2px solid #333333 !important;`
- **src\styles\a11y\components\switcher.css** line 62
  `color: #333333 !important;`
- **src\styles\a11y\components\switcher.css** line 72
  `background: #333333 !important;`
- **src\styles\a11y\components\switcher.css** line 130
  `background: #333333 !important;`
- **src\styles\a11y\pages\asset-detail.css** line 225
  `color: #333333 !important;`
- **src\styles\a11y\pages\asset-detail.css** line 240
  `color: #333333 !important;`
- **src\styles\a11y\pages\asset-detail.css** line 460
  `color: #333333 !important;`
- **src\styles\themes\a11y\a11y-monochrome.css** line 15
  `--a11y-mono-c-text: #333333;`
- **src\styles\themes\Preview\coretokens.css** line 38
  `--a11y-monochrome-c-text: #333333;`

#### `#8fa68a` (27 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 33
  `"hex": "#8fa68a",`
- **docs\Brand\BRAND-PROFILE.json** line 112
  `"link": "#8fa68a",`
- **docs\Brand\BRAND-PROFILE.json** line 115
  `"accent1": "#8fa68a",`
- **docs\Brand\BRAND-PROFILE.json** line 133
  `"focusOutline": "2px solid #8fa68a"`
- **docs\Brand\BRAND-PROFILE.json** line 147
  `"h2Color": "#8fa68a",`
- **docs\Brand\BRAND-PROFILE.json** line 332
  `"buttonPrimary": "Sage green background (#8fa68a), white text, rounded corners (8px), soft shadow, hover lifts with enha`
- **docs\Brand\BRAND-PROFILE.json** line 398
  `"snippetLong": "Walking with a Smile is a trauma recovery platform dedicated to helping survivors shift from pain-center`
- **docs\Markdown Notes\Theme-Preview-System.md** line 28
  `--brand-c-primary: #8fa68a;`
- **docs\todo\TODO.md** line 344
  `--color-Primary-500: #8fa68a;  /* Precise shade control */`
- **files\example-BrandDefault-NEW.css** line 7
  `--brand-c-primary: #8fa68a;`
- **src\lib\emailit.ts** line 80
  `primary: '#8fa68a',      // Sage green`
- **src\pages\api\contact.ts** line 13
  `primary: '#8fa68a',`
- **src\scripts\ThemeSwitcher.js** line 201
  `'#8FA68A';`
- **src\scripts\ThemeTokenGen\brand-template.css** line 7
  `--brand-primary: #8FA68A; /* base: 500 */`
- **src\scripts\ThemeTokenGen\brand-template.css** line 35
  `--brand-primary: #8FA68A; /* base: 500 */`
- **src\scripts\ThemeTokenGen\color-input.css** line 20
  `--brand-primary: #8FA68A; /* base: 500 */`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 401
  `console.log('Example: node color-theory-comparison.js #8FA68A');`
- **src\scripts\ThemeTokenGen\color-theory-explorer.css** line 15
  `--brand-primary: #8FA68A; /* base: 500 - Your main color */`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 909
  `primaryColor: '#8FA68A',`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1214
  `primary: '#8FA68A',      // Soft sage green`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1254
  `alert('Please enter a valid primary color in hex format (e.g., #8FA68A)');`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2007
  `document.getElementById('primaryColorPicker').value = '#8FA68A';`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2008
  `document.getElementById('primaryColorHex').value = '#8FA68A';`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2016
  `state.primaryColor = '#8FA68A';`
- **src\styles\themes\brand\BrandDefault.css** line 6
  `--brand-c-primary: #8fa68a;`
- **src\styles\themes\brand\BrandDefault.css** line 17
  `--color-Primary-500: #8fa68a;`
- **src\styles\themes\Preview\coretokens.css** line 57
  `--brand-c-primary: #8fa68a;`

#### `#000000` (26 occurrences)

- **docs\Markdown Notes\accessibility-color-themes.md** line 210
  `--color-Background-50: #000000;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 211
  `--color-Background-100: #000000;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 212
  `--color-Background-200: #000000;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 213
  `--color-Background-300: #000000;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 214
  `--color-Background-400: #000000;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 215
  `--color-Background-500: #000000;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 242
  `--bg: #000000;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 243
  `--surface: #000000;`
- **docs\todo\TODO.md** line 453
  `- [ ] Replace `#000000` with `var(--color-Black)``
- **docs\todo\TODO.md** line 470
  `- [ ] Replace `#000000`, `#666666`, `#8b6914` with tokens`
- **docs\todo\TODO.md** line 473
  `- [ ] Replace `#ffffff`, `#000000`, `#333333` with tokens`
- **src\components\Canvas\RevealCanvas.astro** line 206
  `context.fillStyle = "#000000";`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 31
  `hexColor = '#000000';`
- **src\styles\a11y\base\theme-overrides.css** line 226
  `color: #000000 !important;`
- **src\styles\a11y\base\theme-overrides.css** line 373
  `color: #000000 !important;`
- **src\styles\a11y\base\theme-overrides.css** line 479
  `color: #000000 !important;`
- **src\styles\a11y\base\theme-overrides.css** line 571
  `color: #000000 !important;`
- **src\styles\a11y\components\step-card.css** line 23
  `color: #000000 !important;`
- **src\styles\a11y\components\switcher.css** line 25
  `color: #000000 !important;`
- **src\styles\a11y\pages\asset-detail.css** line 122
  `background: var(--a11y-hc-bg, #000000) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 148
  `background: var(--a11y-hc-bg, #000000) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 269
  `background: var(--a11y-hc-bg, #000000) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 403
  `background: var(--a11y-hc-bg, #000000) !important;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 14
  `--a11y-hc-c-bg: #000000;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 146
  `--btn-filled-text: #000000;`
- **src\styles\themes\Preview\coretokens.css** line 31
  `--a11y-high-contrast-c-bg: #000000;`

#### `rgba(0, 0, 0, 0.1)` (15 occurrences)

- **docs\todo\TODO.md** line 460
  `- [ ] Replace `rgba(0, 0, 0, 0.1)` with `color-mix(in oklch, var(--color-Black) 10%, transparent)``
- **docs\todo\TODO.md** line 496
  `- [ ] `src/styles/pages/legal.css`: `rgba(0, 0, 0, 0.1)``
- **docs\todo\TODO.md** line 505
  `background: rgba(0, 0, 0, 0.1);`
- **docs\todo\TODO.md** line 524
  `- [ ] `src/styles/pages/legal.css`: `border-bottom: 1px solid rgba(0, 0, 0, 0.1)` → use border token`
- **src\components\Badge\Badge.astro** line 236
  `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);`
- **src\components\Grids\ForYouGrid.astro** line 144
  `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);`
- **src\components\Grids\RelatedGrid.astro** line 367
  `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);`
- **src\components\Search\SearchOverlay.astro** line 403
  `box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2178
  `box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);`
- **src\styles\a11y\components\masonry-grid.css** line 308
  `background: rgba(0, 0, 0, 0.1) !important;`
- **src\styles\components\presentation\ReaderNav.css** line 860
  `0 2px 8px rgba(0, 0, 0, 0.1);`
- **src\styles\components\presentation\ReaderNav.css** line 867
  `0 0 0 1px rgba(0, 0, 0, 0.1);`
- **src\styles\components\presentation\ReaderNav.css** line 908
  `0 2px 8px rgba(0, 0, 0, 0.1),`
- **src\styles\pages\legal.css** line 8
  `border-bottom: 1px solid rgba(0, 0, 0, 0.1);`
- **src\styles\pages\service-detail.css** line 67
  `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);`

#### `#4a3f2f` (14 occurrences)

- **files\example-a11y-cream-NEW.css** line 6
  `--brand-c-text: #4a3f2f;`
- **files\example-a11y-cream-NEW.css** line 26
  `--brand-c-neutral: #4a3f2f;`
- **files\example-a11y-cream-NEW.css** line 27
  `--brand-c-neutral-dark: #4a3f2f;`
- **files\example-a11y-cream-NEW.css** line 33
  `--brand-c-bg-dark: #4a3f2f;`
- **files\example-a11y-cream-NEW.css** line 38
  `--brand-c-text-light: #4a3f2f;`
- **files\example-a11y-cream-NEW.css** line 39
  `--brand-c-text-dark: #4a3f2f;`
- **src\styles\a11y\pages\asset-detail.css** line 43
  `color: var(--a11y-cream-text, #4a3f2f) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 170
  `color: var(--a11y-cream-text, #4a3f2f) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 298
  `color: var(--a11y-cream-text, #4a3f2f) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 351
  `color: var(--a11y-cream-text, #4a3f2f) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 427
  `color: var(--a11y-cream-text, #4a3f2f) !important;`
- **src\styles\a11y\pages\services.css** line 17
  `color: var(--a11y-cream-text, #4a3f2f) !important;`
- **src\styles\themes\a11y\a11y-cream.css** line 15
  `--a11y-cream-c-text: #4a3f2f;`
- **src\styles\themes\Preview\coretokens.css** line 14
  `--a11y-cream-c-text: #4a3f2f;`

#### `rgba(0, 0, 0, 0.15)` (14 occurrences)

- **src\components\A11y Panel\FontCard.astro** line 67
  `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);`
- **src\components\A11y Panel\PresetButton.astro** line 70
  `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);`
- **src\components\A11y Panel\ToggleCard.astro** line 83
  `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);`
- **src\components\Badge\Badge.astro** line 226
  `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);`
- **src\components\Grids\RelatedGrid.astro** line 455
  `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);`
- **src\components\Shop\MiniCart.astro** line 43
  `box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2184
  `box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);`
- **src\styles\a11y\base\utilities.css** line 71
  `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);`
- **src\styles\components\presentation\ReaderNav.css** line 859
  `0 4px 20px rgba(0, 0, 0, 0.15),`
- **src\styles\components\presentation\ReaderNav.css** line 875
  `0 4px 20px rgba(0, 0, 0, 0.15);`
- **src\styles\components\presentation\ReaderNav.css** line 884
  `0 4px 20px rgba(0, 0, 0, 0.15);`
- **src\styles\components\presentation\ReaderNav.css** line 892
  `0 4px 20px rgba(0, 0, 0, 0.15);`
- **src\styles\components\presentation\ReaderNav.css** line 899
  `inset 0 1px 2px rgba(0, 0, 0, 0.15),`
- **src\styles\components\presentation\ReaderNav.css** line 907
  `0 6px 20px rgba(0, 0, 0, 0.15),`

#### `#8b9d83` (12 occurrences)

- **docs\Markdown Notes\new hero.md** line 50
  `- SVG fill: Sage green (#8B9D83)`
- **src\lib\animation\hero-morph.ts** line 32
  `<path d="${circlePath}" fill="#8B9D83" fill-opacity="0.98"/>`
- **src\lib\animation\hero-morph.ts** line 41
  `<path d="${circlePath}" fill="#8B9D83" fill-opacity="0.98" data-position="center"/>`
- **src\lib\animation\hero-morph.ts** line 42
  `<path d="${circlePath}" fill="#8B9D83" fill-opacity="0.98" data-position="left"/>`
- **src\lib\animation\hero-morph.ts** line 43
  `<path d="${circlePath}" fill="#8B9D83" fill-opacity="0.98" data-position="right"/>`
- **src\lib\animation\hero-morph.ts** line 254
  `leftCircle.setAttribute('fill', '#8B9D83');`
- **src\lib\animation\hero-morph.ts** line 261
  `rightCircle.setAttribute('fill', '#8B9D83');`
- **src\lib\animation\hero-morph.ts** line 373
  `circle.setAttribute('fill', '#8B9D83');`
- **src\lib\animation\hero-morph.ts** line 472
  `circle.setAttribute('fill', '#8B9D83');`
- **src\lib\animation\hero-morph.ts** line 511
  `tempPath.setAttribute('fill', '#8B9D83');`
- **src\lib\animation\hero-morph.ts** line 534
  `tempPath.setAttribute('fill', '#8B9D83');`
- **src\lib\animation\hero-morph.ts** line 631
  `circle.setAttribute('fill', '#8B9D83');`

#### `#c4907c` (11 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 40
  `"hex": "#c4907c",`
- **docs\Brand\BRAND-PROFILE.json** line 116
  `"accent2": "#c4907c",`
- **docs\Brand\BRAND-PROFILE.json** line 398
  `"snippetLong": "Walking with a Smile is a trauma recovery platform dedicated to helping survivors shift from pain-center`
- **docs\Markdown Notes\Theme-Preview-System.md** line 29
  `--brand-c-accent: #c4907c;`
- **files\example-BrandDefault-NEW.css** line 8
  `--brand-c-secondary: #c4907c;`
- **src\lib\emailit.ts** line 82
  `accent: '#c4907c',       // Terracotta`
- **src\pages\api\contact.ts** line 15
  `accent: '#c4907c',`
- **src\scripts\ThemeTokenGen\brand-template.css** line 38
  `--brand-secondary: #C4907C; /* base: 500 */`
- **src\styles\themes\brand\BrandDefault.css** line 8
  `--brand-c-accent: #c4907c;`
- **src\styles\themes\brand\BrandDefault.css** line 28
  `--color-Secondary-500: #c4907c;`
- **src\styles\themes\Preview\coretokens.css** line 58
  `--brand-c-accent: #c4907c;`

#### `green` (11 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 34
  `"colorName": "Sage Green",`
- **docs\Brand\BRAND-PROFILE.json** line 268
  `"summary": "Our color palette reflects calm, warmth, and gentle hope. Soft neutrals (warm beige, light grays) create a c`
- **docs\Brand\BRAND-PROFILE.json** line 332
  `"buttonPrimary": "Sage green background (#8fa68a), white text, rounded corners (8px), soft shadow, hover lifts with enha`
- **docs\Brand\BRAND-PROFILE.json** line 333
  `"buttonSecondary": "Outlined style with sage green border, sage green text, transparent background, rounded corners (8px`
- **docs\Brand\BRAND-PROFILE.json** line 334
  `"buttonGhost": "Transparent background, sage green text, no border, subtle hover background",`
- **docs\Brand\BRAND-PROFILE.json** line 338
  `"formPattern": "Clean inputs with soft borders (#e0dedb), focus state with sage green outline, generous spacing",`
- **docs\Markdown Notes\accessibility-color-themes.md** line 307
  `--color-AccentOne-500: oklch(0.66 0.14 145); /* green */`
- **docs\Markdown Notes\CSS-Tokens.md** line 92
  `--color-Success    /* #4caf50 - green */`
- **docs\Markdown Notes\new hero.md** line 50
  `- SVG fill: Sage green (#8B9D83)`
- **src\scripts\ThemeTokenGen\color-input.css** line 50
  `--brand-background-dark: #2a3328; /* base: 850 - dark sage green for dark mode */`
- **src\styles\design\confetti.css** line 24
  `--confetti-green: var(--color-AccentThree-500);`

#### `#faf8f7` (10 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 335
  `"cardPattern": "Neutral background (#faf8f7), rounded corners (16px), soft shadow, subtle hover elevation",`
- **files\example-BrandDefault-NEW.css** line 5
  `--brand-c-bg: #faf8f7;`
- **src\styles\components\toast.css** line 45
  `color: var(--color-Neutral-50, #faf8f7);`
- **src\styles\components\toast.css** line 113
  `color: var(--color-Neutral-50, #faf8f7);`
- **src\styles\themes\brand\BrandDefault.css** line 5
  `--brand-c-bg: #faf8f7;`
- **src\styles\themes\brand\BrandDefault.css** line 35
  `--color-Background-50: #faf8f7;`
- **src\styles\themes\brand\BrandDefault.css** line 36
  `--color-Background-100: #faf8f7;`
- **src\styles\themes\brand\BrandDefault.css** line 60
  `--color-Neutral-50: #faf8f7;`
- **src\styles\themes\brand\BrandDefault.css** line 61
  `--color-Neutral-100: #faf8f7;`
- **src\styles\themes\Preview\coretokens.css** line 55
  `--brand-c-bg: #faf8f7;`

#### `rgba(0, 0, 0, 0.2)` (10 occurrences)

- **docs\todo\TODO.md** line 467
  `- [ ] Replace `rgba(0, 0, 0, 0.2)` and `rgba(0, 0, 0, 0.6)` with `color-mix()``
- **docs\todo\TODO.md** line 525
  `- [ ] `src/styles/a11y/components/accessibility-panel.css`: `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2)` → `var(--shadow-s`
- **src\components\Grids\ForYouGrid.astro** line 102
  `box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);`
- **src\components\Grids\ForYouGrid.astro** line 125
  `box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);`
- **src\components\Grids\RelatedGrid.astro** line 460
  `box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);`
- **src\components\Presentation\Sections\TitleSection.astro** line 128
  `text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);`
- **src\components\Presentation\Sections\TitleSection.astro** line 133
  `text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2136
  `box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);`
- **src\styles\components\presentation\ReaderNav.css** line 898
  `inset 0 2px 6px rgba(0, 0, 0, 0.2),`
- **src\styles\components\presentation\ReaderNav.css** line 906
  `0 10px 40px rgba(0, 0, 0, 0.2),`

#### `#474747` (9 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 54
  `"hex": "#474747",`
- **docs\Brand\BRAND-PROFILE.json** line 110
  `"textPrimary": "#474747",`
- **docs\Markdown Notes\Theme-Preview-System.md** line 27
  `--brand-c-text: #474747;`
- **files\example-BrandDefault-NEW.css** line 6
  `--brand-c-text: #474747;`
- **src\lib\emailit.ts** line 78
  `text: '#474747',`
- **src\pages\api\contact.ts** line 11
  `text: '#474747',`
- **src\styles\themes\brand\BrandDefault.css** line 7
  `--brand-c-text: #474747;`
- **src\styles\themes\brand\BrandDefault.css** line 55
  `--color-Text-800: #474747;`
- **src\styles\themes\Preview\coretokens.css** line 56
  `--brand-c-text: #474747;`

#### `#8b6914` (9 occurrences)

- **docs\todo\TODO.md** line 470
  `- [ ] Replace `#000000`, `#666666`, `#8b6914` with tokens`
- **src\styles\a11y\components\step-card.css** line 29
  `border: 2px solid var(--a11y-cream-accent, #8b6914) !important;`
- **src\styles\a11y\components\why-card.css** line 17
  `border-left-color: var(--a11y-cream-accent, #8b6914) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 182
  `color: var(--a11y-cream-accent, #8b6914) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 194
  `color: var(--a11y-cream-accent, #8b6914) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 290
  `border-color: var(--a11y-cream-accent, #8b6914) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 304
  `border-color: var(--a11y-cream-accent, #8b6914) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 423
  `border-color: var(--a11y-cream-accent, #8b6914) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 436
  `color: var(--a11y-cream-accent, #8b6914) !important;`

#### `rgba(0,0,0,0.1)` (9 occurrences)

- **src\lib\emailit.ts** line 154
  `text-shadow: 0 1px 2px rgba(0,0,0,0.1);`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 205
  `box-shadow: 0 2px 8px rgba(0,0,0,0.1);`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 222
  `box-shadow: 0 2px 4px rgba(0,0,0,0.1);`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 269
  `box-shadow: 0 1px 3px rgba(0,0,0,0.1);`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 320
  `box-shadow: 0 1px 2px rgba(0,0,0,0.1);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 135
  `box-shadow: 0 4px 20px rgba(0,0,0,0.1);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 232
  `border-bottom: 1px solid rgba(0,0,0,0.1);`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 68
  `box-shadow: 0 2px 8px rgba(0,0,0,0.1);`
- **src\styles\themes\Preview\theme-cards.css** line 14
  `border: 2px solid rgba(0,0,0,0.1);`

#### `#666666` (8 occurrences)

- **docs\Markdown Notes\CSS-Standards.md** line 286
  `color: #666666;`
- **docs\todo\TODO.md** line 470
  `- [ ] Replace `#000000`, `#666666`, `#8b6914` with tokens`
- **src\styles\a11y\components\step-card.css** line 35
  `border: 2px solid #666666 !important;`
- **src\styles\a11y\components\why-card.css** line 22
  `border-left-color: #666666 !important;`
- **src\styles\a11y\pages\asset-detail.css** line 311
  `border-color: #666666 !important;`
- **src\styles\a11y\pages\asset-detail.css** line 316
  `color: #666666 !important;`
- **src\styles\a11y\pages\asset-detail.css** line 329
  `border-color: #666666 !important;`
- **src\styles\a11y\pages\asset-detail.css** line 443
  `border-color: #666666 !important;`

#### `#1a1a1a` (8 occurrences)

- **src\styles\a11y\components\masonry-grid.css** line 10
  `color: var(--color-Text-700, #1a1a1a) !important;`
- **src\styles\a11y\pages\asset-detail.css** line 63
  `color: #1a1a1a !important;`
- **src\styles\a11y\pages\asset-detail.css** line 210
  `color: #1a1a1a !important;`
- **src\styles\a11y\pages\asset-detail.css** line 321
  `color: #1a1a1a !important;`
- **src\styles\a11y\pages\asset-detail.css** line 359
  `color: #1a1a1a !important;`
- **src\styles\a11y\pages\asset-detail.css** line 448
  `color: #1a1a1a !important;`
- **src\styles\base\utilities.css** line 346
  `border-left-color: var(--color-Text-800, #1a1a1a);`
- **src\styles\base\utilities.css** line 371
  `border-right-color: var(--color-Text-800, #1a1a1a);`

#### `#f5f5f5` (7 occurrences)

- **docs\Markdown Notes\CSS-Standards.md** line 287
  `background: #f5f5f5;`
- **docs\todo\TODO.md** line 464
  `- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens`
- **docs\todo\TODO.md** line 484
  `- [ ] Replace `background: #f5f5f5` (code blocks) with token`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 194
  `background: #f5f5f5;`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 56
  `background: #f5f5f5;`
- **src\styles\a11y\base\print.css** line 120
  `background: #f5f5f5 !important;`
- **src\styles\a11y\components\search-overlay.css** line 154
  `background: #f5f5f5 !important;`

#### `rgba(255, 255, 255, 0.15)` (7 occurrences)

- **src\components\Badge\Badge.astro** line 221
  `background: rgba(255, 255, 255, 0.15) !important;`
- **src\components\Grids\ForYouGrid.astro** line 162
  `background: rgba(255, 255, 255, 0.15);`
- **src\components\Grids\RelatedGrid.astro** line 379
  `background: rgba(255, 255, 255, 0.15);`
- **src\components\Grids\RelatedGrid.astro** line 408
  `background: rgba(255, 255, 255, 0.15);`
- **src\components\Grids\RelatedGrid.astro** line 521
  `background: rgba(255, 255, 255, 0.15);`
- **src\components\Grids\RelatedGrid.astro** line 803
  `background: rgba(255, 255, 255, 0.15) !important;`
- **src\styles\components\presentation\ReaderNav.css** line 769
  `border: var(--border-width) solid rgba(255, 255, 255, 0.15);`

#### `rgba(0, 0, 0, 0.25)` (7 occurrences)

- **src\components\Grids\RelatedGrid.astro** line 344
  `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);`
- **src\components\Grids\RelatedGrid.astro** line 430
  `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);`
- **src\components\Grids\RelatedGrid.astro** line 472
  `box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);`
- **src\components\Grids\RelatedGrid.astro** line 831
  `box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25) !important;`
- **src\components\Grids\RelatedGrid.astro** line 871
  `box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);`
- **src\components\Presentation\Sections\FullWidthSection.astro** line 77
  `0 8px 32px rgba(0, 0, 0, 0.25);`
- **src\styles\components\presentation\ReaderNav.css** line 866
  `4px 4px 0 rgba(0, 0, 0, 0.25),`

#### `hsl((h + offset)` (7 occurrences)

- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 30
  `return chroma.hsl((h + offset) % 360, s, l);`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 34
  `return chroma.hsl((h + offset) % 360, s, l);`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 38
  `return chroma.hsl((h + offset) % 360, s, l);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1046
  `return chroma.hsl((h + offset) % 360, s, l);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1050
  `return chroma.hsl((h + offset) % 360, s, l);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1054
  `return chroma.hsl((h + offset) % 360, s, l);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1058
  `return chroma.hsl((h + offset) % 360, s, l);`

#### `#dc2626` (7 occurrences)

- **src\styles\base\utilities.css** line 517
  `color: var(--color-Error-500, #dc2626);`
- **src\styles\base\utilities.css** line 535
  `color: var(--color-Error-500, #dc2626);`
- **src\styles\base\utilities.css** line 551
  `border-color: var(--color-Error-500, #dc2626) !important;`
- **src\styles\base\utilities.css** line 558
  `outline-color: var(--color-Error-500, #dc2626);`
- **src\styles\base\utilities.css** line 559
  `box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-Error-500, #dc2626) 10%, transparent);`
- **src\styles\base\utilities.css** line 565
  `outline: 2px solid var(--color-Error-500, #dc2626);`
- **src\styles\base\utilities.css** line 617
  `color: var(--color-Error-500, #dc2626);`

#### `#f9f8f6` (6 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 47
  `"hex": "#f9f8f6",`
- **docs\Brand\BRAND-PROFILE.json** line 108
  `"background": "#f9f8f6",`
- **docs\Brand\BRAND-PROFILE.json** line 398
  `"snippetLong": "Walking with a Smile is a trauma recovery platform dedicated to helping survivors shift from pain-center`
- **docs\Markdown Notes\Theme-Preview-System.md** line 26
  `--brand-c-bg: #f9f8f6;`
- **src\lib\emailit.ts** line 77
  `background: '#f9f8f6',`
- **src\pages\api\contact.ts** line 10
  `background: '#f9f8f6',`

#### `#777777` (6 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 111
  `"textSecondary": "#777777",`
- **docs\Brand\BRAND-PROFILE.json** line 153
  `"bodyColor": "#777777"`
- **files\example-BrandDefault-NEW.css** line 38
  `--brand-c-text-light: #777777;`
- **src\styles\themes\a11y\a11y-monochrome.css** line 17
  `--a11y-mono-c-accent: #777777;`
- **src\styles\themes\brand\BrandDefault.css** line 53
  `--color-Text-600: #777777;`
- **src\styles\themes\Preview\coretokens.css** line 40
  `--a11y-monochrome-c-accent: #777777;`

#### `rgba(0,0,0,0.15)` (6 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 132
  `"buttonShadow": "0 4px 8px rgba(0,0,0,0.15)",`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 287
  `box-shadow: 0 2px 4px rgba(0,0,0,0.15);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 295
  `box-shadow: 0 4px 12px rgba(0,0,0,0.15);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 312
  `box-shadow: 0 2px 8px rgba(0,0,0,0.15);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 496
  `box-shadow: 0 4px 12px rgba(0,0,0,0.15);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 696
  `box-shadow: 0 4px 12px rgba(0,0,0,0.15);`

#### `blue` (6 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 69
  `"colorName": "Soft Blue",`
- **docs\Markdown Notes\accessibility-color-themes.md** line 265
  `--color-AccentThree-500: oklch(0.60 0.14 250); /* blue */`
- **docs\Markdown Notes\accessibility-color-themes.md** line 285
  `--color-AccentOne-500: oklch(0.62 0.14 255); /* blue */`
- **docs\Markdown Notes\CSS-Tokens.md** line 96
  `--color-Info       /* #2196f3 - blue */`
- **src\styles\design\confetti.css** line 22
  `--confetti-blue: var(--color-AccentTwo-400);`
- **src\styles\tokens\gradients.css** line 12
  `--rainbow-light-blue: var(--color-AccentTwo-400);`

#### `#5a3420` (6 occurrences)

- **docs\reports\color-token-usage-report.md** line 193
  `- **Fix:** Add to BrandDefault.css line 32: `--color-Secondary-900: #5a3420;``
- **docs\reports\color-token-usage-report.md** line 648
  `- Add to BrandDefault.css: `--color-Secondary-900: #5a3420;``
- **docs\reports\color-token-usage-report.md** line 691
  `- `--color-Secondary-900: #5a3420;``
- **docs\reports\FIXES-APPLIED.md** line 12
  `- ✓ **Added `--color-Secondary-900: #5a3420`** (line 32)`
- **docs\todo\TODO.md** line 257
  `- Add after line 32: `--color-Secondary-900: #5a3420;``
- **src\styles\themes\brand\BrandDefault.css** line 32
  `--color-Secondary-900: #5a3420;`

#### `#fff` (6 occurrences)

- **src\components\Presentation\Sections\HeroSection.astro** line 94
  `color: var(--color-White, #fff);`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 143
  `const textColor = luminance > 0.5 ? '#000' : '#fff';`
- **src\styles\base\utilities.css** line 384
  `background: color-mix(in oklch, var(--color-Background-50, #fff) 85%, transparent);`
- **src\styles\base\utilities.css** line 386
  `border: 1px solid color-mix(in oklch, var(--color-Background-50, #fff) 25%, transparent);`
- **src\styles\base\utilities.css** line 392
  `border-top-color: color-mix(in oklch, var(--color-Background-50, #fff) 85%, transparent);`
- **src\styles\base\utilities.css** line 397
  `border-bottom-color: color-mix(in oklch, var(--color-Background-50, #fff) 85%, transparent);`

#### `#bdbab3` (6 occurrences)

- **src\pages\services\[slug].astro** line 259
  `box-shadow: 20px 20px 40px #bdbab3, -20px -20px 40px #ffffff;`
- **src\styles\a11y\motion\reduced-motion.css** line 329
  `box-shadow: 8px 8px 20px #bdbab3, -8px -8px 20px #ffffff !important;`
- **src\styles\pages\asset-detail.css** line 386
  `box-shadow: 29px 29px 60px #bdbab3, -29px -29px 60px #ffffff;`
- **src\styles\pages\asset-detail.css** line 546
  `box-shadow: 29px 29px 60px #bdbab3, -29px -29px 60px #ffffff;`
- **src\styles\pages\service-detail.css** line 133
  `box-shadow: 20px 20px 40px #bdbab3, -20px -20px 40px #ffffff;`
- **src\styles\pages\services.css** line 125
  `box-shadow: 8px 8px 20px #bdbab3, -8px -8px 20px #ffffff;`

#### `#f59e0b` (6 occurrences)

- **src\scripts\ThemeTokenGen\brand-template.css** line 88
  `--universal-warning: #cea96a; /* #f59e0b - Amber warning/caution */`
- **src\styles\base\utilities.css** line 469
  `background: var(--color-Warning-500, #f59e0b);`
- **src\styles\base\utilities.css** line 474
  `border-top-color: var(--color-Warning-500, #f59e0b);`
- **src\styles\base\utilities.css** line 479
  `border-bottom-color: var(--color-Warning-500, #f59e0b);`
- **src\styles\themes\a11y\a11y-protanopia.css** line 17
  `--a11y-proto-c-accent: #f59e0b;`
- **src\styles\themes\Preview\coretokens.css** line 46
  `--a11y-protanopia-c-accent: #f59e0b;`

#### `rgba(255, 255, 255, 0.1)` (6 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2339
  `border-top: 1px solid rgba(255, 255, 255, 0.1);`
- **src\styles\components\presentation\ReaderNav.css** line 742
  `border: var(--border-width) solid rgba(255, 255, 255, 0.1);`
- **src\styles\components\presentation\ReaderNav.css** line 900
  `0 1px 0 rgba(255, 255, 255, 0.1);`
- **src\styles\pages\service-detail.css** line 291
  `background: rgba(255, 255, 255, 0.1);`
- **src\styles\tokens\shadows.css** line 75
  `--glint-gradient-subtle: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);`
- **src\styles\tokens\shadows.css** line 80
  `--glass-bg: rgba(255, 255, 255, 0.1);`

#### `#2dd4bf` (6 occurrences)

- **src\styles\base\utilities.css** line 403
  `color: var(--color-Primary-500, #2dd4bf);`
- **src\styles\base\utilities.css** line 404
  `border: 1.5px solid var(--color-Primary-500, #2dd4bf);`
- **src\styles\base\utilities.css** line 405
  `text-shadow: 0 0 4px var(--color-Primary-500, #2dd4bf);`
- **src\styles\base\utilities.css** line 411
  `border-top-color: var(--color-Primary-500, #2dd4bf);`
- **src\styles\base\utilities.css** line 416
  `border-bottom-color: var(--color-Primary-500, #2dd4bf);`
- **src\styles\base\utilities.css** line 577
  `border-color: var(--color-Success-500, var(--color-Primary-500, #2dd4bf)) !important;`

#### `red` (5 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 270
  `"dont": "Avoid bright, aggressive colors that might trigger anxiety. Don't use high-contrast or neon shades. Avoid pure `
- **docs\Markdown Notes\accessibility-color-themes.md** line 289
  `--color-AccentFive-500: oklch(0.62 0.10 25); /* red-orange */`
- **docs\Markdown Notes\accessibility-color-themes.md** line 310
  `--color-AccentFour-500: oklch(0.60 0.18 25); /* red */`
- **docs\Markdown Notes\CSS-Tokens.md** line 94
  `--color-Error      /* #f44336 - red */`
- **src\styles\a11y\base\screen-reader.css** line 81
  `outline: 3px solid red !important;`

#### `#00ffff` (5 occurrences)

- **docs\Markdown Notes\accessibility-color-themes.md** line 229
  `--color-AccentOne-500: #00ffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 239
  `--color-Info:    #00ffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 248
  `--focusRing: #00ffff;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 17
  `--a11y-hc-c-accent: #00ffff;`
- **src\styles\themes\Preview\coretokens.css** line 34
  `--a11y-high-contrast-c-accent: #00ffff;`

#### `purple` (5 occurrences)

- **docs\Markdown Notes\accessibility-color-themes.md** line 184
  `--color-AccentThree-500: oklch(0.55 0.08 280);/* dusty purple */`
- **docs\Markdown Notes\accessibility-color-themes.md** line 267
  `--color-AccentFive-500: oklch(0.62 0.10 300);/* purple */`
- **docs\Markdown Notes\accessibility-color-themes.md** line 287
  `--color-AccentThree-500: oklch(0.60 0.14 300); /* purple */`
- **docs\Markdown Notes\accessibility-color-themes.md** line 311
  `--color-AccentFive-500: oklch(0.62 0.10 280);/* purple */`
- **src\styles\design\confetti.css** line 20
  `--confetti-purple: var(--color-AccentFive-400);`

#### `teal` (5 occurrences)

- **docs\Markdown Notes\accessibility-color-themes.md** line 185
  `--color-AccentFour-500: oklch(0.60 0.10 200); /* teal */`
- **docs\Markdown Notes\accessibility-color-themes.md** line 263
  `--color-AccentOne-500: oklch(0.70 0.12 195); /* teal */`
- **docs\reports\color-token-usage-report.md** line 58
  `- design/confetti.css (1 use - teal confetti color)`
- **src\styles\design\confetti.css** line 21
  `--confetti-teal: var(--color-Primary-400);`
- **src\styles\tokens\gradients.css** line 11
  `--rainbow-light-teal: var(--color-Primary-400);`

#### `#f4fbf2` (5 occurrences)

- **docs\reports\color-token-usage-report.md** line 656
  `4. **Duplicate Primary-50 = Primary-100** - Both `#f4fbf2``
- **docs\reports\FIXES-APPLIED.md** line 28
  `- Was identical to Primary-100 (#f4fbf2)`
- **docs\todo\TODO.md** line 225
  `- [ ] `--color-Primary-50` and `--color-Primary-100` both `#f4fbf2``
- **docs\todo\TODO.md** line 277
  `- [ ] **Primary-50 = Primary-100** both `#f4fbf2` (DUPLICATE - remove Primary-50)`
- **src\styles\themes\brand\BrandDefault.css** line 13
  `--color-Primary-100: #f4fbf2;`

#### `#666` (5 occurrences)

- **docs\todo\TODO.md** line 483
  `- [ ] Replace `color: #666` (link URLs) with token`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 253
  `color: #666;`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 341
  `color: #666;`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 100
  `color: #666;`
- **src\styles\a11y\base\print.css** line 97
  `color: #666 !important;`

#### `#ddd` (5 occurrences)

- **docs\todo\TODO.md** line 485
  `- [ ] Replace `border: 1px solid #ddd` with token`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 221
  `border: 3px solid #ddd;`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 89
  `border: 1px solid #ddd;`
- **src\styles\a11y\base\print.css** line 121
  `border: 1px solid #ddd !important;`
- **src\styles\a11y\base\print.css** line 136
  `border: 1px solid #ddd !important;`

#### `rgba(0, 0, 0, 0.06)` (5 occurrences)

- **docs\todo\TODO.md** line 498
  `- [ ] `src/styles/pages/asset-detail.css`: `rgba(0, 0, 0, 0.06)`, `rgba(0, 0, 0, 0.04)``
- **src\components\Cards\ProjectSpecCard.astro** line 42
  `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);`
- **src\components\Cards\SpecCard.astro** line 36
  `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);`
- **src\styles\pages\asset-detail.css** line 617
  `box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06), inset 0 1px 3px rgba(0, 0, 0, 0.04);`
- **src\styles\pages\asset-detail.css** line 692
  `box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06), inset 0 1px 3px rgba(0, 0, 0, 0.04);`

#### `rgba(0, 0, 0, 0.04)` (5 occurrences)

- **docs\todo\TODO.md** line 498
  `- [ ] `src/styles/pages/asset-detail.css`: `rgba(0, 0, 0, 0.06)`, `rgba(0, 0, 0, 0.04)``
- **src\components\Search\SearchOverlay.astro** line 206
  `box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.04);`
- **src\pages\verify.astro** line 204
  `0 1px 3px rgba(0, 0, 0, 0.04),`
- **src\styles\pages\asset-detail.css** line 617
  `box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06), inset 0 1px 3px rgba(0, 0, 0, 0.04);`
- **src\styles\pages\asset-detail.css** line 692
  `box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06), inset 0 1px 3px rgba(0, 0, 0, 0.04);`

#### `#ddd9d3` (5 occurrences)

- **files\example-a11y-cream-NEW.css** line 5
  `--brand-c-bg: #ddd9d3;`
- **files\example-a11y-cream-NEW.css** line 25
  `--brand-c-neutral-light: #ddd9d3;`
- **files\example-a11y-cream-NEW.css** line 32
  `--brand-c-bg-light: #ddd9d3;`
- **src\styles\themes\a11y\a11y-cream.css** line 14
  `--a11y-cream-c-bg: #ddd9d3;`
- **src\styles\themes\Preview\coretokens.css** line 13
  `--a11y-cream-c-bg: #ddd9d3;`

#### `#8b7355` (5 occurrences)

- **files\example-a11y-cream-NEW.css** line 7
  `--brand-c-primary: #8b7355;`
- **files\example-a11y-cream-NEW.css** line 13
  `--brand-c-primary-light: #8b7355;`
- **files\example-a11y-cream-NEW.css** line 14
  `--brand-c-primary-dark: #8b7355;`
- **src\styles\themes\a11y\a11y-cream.css** line 16
  `--a11y-cream-c-primary: #8b7355;`
- **src\styles\themes\Preview\coretokens.css** line 15
  `--a11y-cream-c-primary: #8b7355;`

#### `#6b8e7a` (5 occurrences)

- **files\example-a11y-cream-NEW.css** line 8
  `--brand-c-secondary: #6b8e7a;`
- **files\example-a11y-cream-NEW.css** line 19
  `--brand-c-secondary-light: #6b8e7a;`
- **files\example-a11y-cream-NEW.css** line 20
  `--brand-c-secondary-dark: #6b8e7a;`
- **src\styles\themes\a11y\a11y-cream.css** line 17
  `--a11y-cream-c-accent: #6b8e7a;`
- **src\styles\themes\Preview\coretokens.css** line 16
  `--a11y-cream-c-accent: #6b8e7a;`

#### `rgba(0, 0, 0, 0.08)` (5 occurrences)

- **src\components\A11y Panel\FontCard.astro** line 50
  `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);`
- **src\components\A11y Panel\PresetButton.astro** line 53
  `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);`
- **src\components\A11y Panel\Stepper.astro** line 88
  `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);`
- **src\components\A11y Panel\ToggleCard.astro** line 65
  `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);`
- **src\components\Cards\CompactToolCard.astro** line 43
  `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);`

#### `#e6e2da` (5 occurrences)

- **src\pages\services\[slug].astro** line 258
  `background: linear-gradient(145deg, #e6e2da, #ffffff);`
- **src\styles\pages\asset-detail.css** line 384
  `background: linear-gradient(145deg, #e6e2da, #ffffff);`
- **src\styles\pages\asset-detail.css** line 545
  `background: linear-gradient(145deg, #e6e2da, #ffffff);`
- **src\styles\pages\service-detail.css** line 132
  `background: linear-gradient(145deg, #e6e2da, #ffffff);`
- **src\styles\pages\services.css** line 124
  `background: linear-gradient(145deg, #e6e2da, #ffffff);`

#### `rgba(0,0,0,0.3)` (5 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 351
  `box-shadow: 0 4px 12px rgba(0,0,0,0.3);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 418
  `color: rgba(0,0,0,0.3);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 626
  `color: rgba(0,0,0,0.3);`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 96
  `text-shadow: 0 1px 2px rgba(0,0,0,0.3);`
- **src\styles\components\a11y-panel.css** line 41
  `box-shadow: 0 20px 60px rgba(0,0,0,0.3);`

#### `#9c8579` (4 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 61
  `"hex": "#9c8579",`
- **src\scripts\ThemeTokenGen\brand-template.css** line 13
  `--brand-accent1: #9C8579; /* from: primary, theory: triadic, index: 0, base: 400 */`
- **src\scripts\ThemeTokenGen\brand-template.css** line 64
  `--brand-accent1: #9C8579; /* base: 500 */`
- **src\styles\themes\brand\BrandDefault.css** line 72
  `--color-AccentOne-500: #9c8579;`

#### `#8390b5` (4 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 68
  `"hex": "#8390b5",`
- **docs\Brand\BRAND-PROFILE.json** line 117
  `"accent3": "#8390b5"`
- **src\scripts\ThemeTokenGen\brand-template.css** line 68
  `--brand-accent2: #8390b5; /* base: 500 */`
- **src\styles\themes\brand\BrandDefault.css** line 82
  `--color-AccentTwo-500: #8390b5;`

#### `#978692` (4 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 75
  `"hex": "#978692",`
- **src\lib\animation\particle-burst.ts** line 54
  `styles.getPropertyValue('--particle-confetti-6').trim() || '#978692',`
- **src\scripts\ThemeTokenGen\brand-template.css** line 72
  `--brand-accent3: #978692; /* base: 500 */`
- **src\styles\themes\brand\BrandDefault.css** line 92
  `--color-AccentThree-500: #978692;`

#### `#e0dedb` (4 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 114
  `"border": "#e0dedb",`
- **docs\Brand\BRAND-PROFILE.json** line 338
  `"formPattern": "Clean inputs with soft borders (#e0dedb), focus state with sage green outline, generous spacing",`
- **files\example-BrandDefault-NEW.css** line 25
  `--brand-c-neutral-light: #e0dedb;`
- **src\styles\themes\brand\BrandDefault.css** line 62
  `--color-Neutral-200: #e0dedb;`

#### `#556a50` (4 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 144
  `"h1Color": "#556a50",`
- **docs\Brand\BRAND-PROFILE.json** line 150
  `"h3Color": "#556a50",`
- **files\example-BrandDefault-NEW.css** line 14
  `--brand-c-primary-dark: #556a50;`
- **src\styles\themes\brand\BrandDefault.css** line 19
  `--color-Primary-700: #556a50;`

#### `#0066ff` (4 occurrences)

- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 121
  `"example": "#0066FF"`
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 173
  `"link": { "type": "string", "example": "#0066FF" },`
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 176
  `"accent1": { "type": "string", "description": "Primary CTA color", "example": "#0066FF" },`
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 200
  `"focusOutline": { "type": "string", "example": "2px solid #0066FF" }`

#### `#111827` (4 occurrences)

- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 171
  `"textPrimary": { "type": "string", "example": "#111827" },`
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 214
  `"h1Color": { "type": "string", "example": "#111827" },`
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 217
  `"h2Color": { "type": "string", "example": "#111827" },`
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 220
  `"h3Color": { "type": "string", "example": "#111827" },`

#### `#ffff00` (4 occurrences)

- **docs\Markdown Notes\accessibility-color-themes.md** line 227
  `--color-Secondary-500: #ffff00;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 230
  `--color-AccentTwo-500: #ffff00;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 236
  `--color-Warning: #ffff00;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 246
  `--link: #ffff00;`

#### `#00ff00` (4 occurrences)

- **docs\Markdown Notes\accessibility-color-themes.md** line 231
  `--color-AccentThree-500: #00ff00;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 235
  `--color-Success: #00ff00;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 16
  `--a11y-hc-c-primary: #00ff00;`
- **src\styles\themes\Preview\coretokens.css** line 33
  `--a11y-high-contrast-c-primary: #00ff00;`

#### `orange` (4 occurrences)

- **docs\Markdown Notes\accessibility-color-themes.md** line 264
  `--color-AccentTwo-500: oklch(0.75 0.14 70);  /* yellow-orange */`
- **docs\Markdown Notes\accessibility-color-themes.md** line 286
  `--color-AccentTwo-500: oklch(0.72 0.16 55);  /* orange */`
- **docs\Markdown Notes\accessibility-color-themes.md** line 289
  `--color-AccentFive-500: oklch(0.62 0.10 25); /* red-orange */`
- **docs\Markdown Notes\CSS-Tokens.md** line 93
  `--color-Warning    /* #ff9800 - orange */`

#### `yellow` (4 occurrences)

- **docs\Markdown Notes\accessibility-color-themes.md** line 264
  `--color-AccentTwo-500: oklch(0.75 0.14 70);  /* yellow-orange */`
- **docs\Markdown Notes\accessibility-color-themes.md** line 266
  `--color-AccentFour-500: oklch(0.75 0.12 90); /* yellow */`
- **docs\Markdown Notes\accessibility-color-themes.md** line 288
  `--color-AccentFour-500: oklch(0.78 0.12 90); /* yellow */`
- **docs\Markdown Notes\accessibility-color-themes.md** line 308
  `--color-AccentTwo-500: oklch(0.74 0.14 80);  /* yellow */`

#### `pink` (4 occurrences)

- **docs\Markdown Notes\accessibility-color-themes.md** line 309
  `--color-AccentThree-500: oklch(0.62 0.16 350); /* pink */`
- **src\styles\buttons\confetti-button.css** line 48
  `background: var(--confetti-pink, #FF99C8);`
- **src\styles\design\confetti.css** line 19
  `--confetti-pink: var(--color-AccentOne-300);`
- **src\styles\tokens\gradients.css** line 9
  `--rainbow-light-pink: var(--color-AccentOne-300);`

#### `#ccd3da` (4 occurrences)

- **docs\Markdown Notes\Theme-Preview-System.md** line 33
  `--a11y-dark-c-text: #ccd3da;`
- **docs\todo\TODO.md** line 321
  `- Text-50 through Text-950 → single color (#ccd3da in dark mode)`
- **src\styles\themes\a11y\a11y-dark.css** line 18
  `--a11y-dark-c-text: #ccd3da;`
- **src\styles\themes\Preview\coretokens.css** line 20
  `--a11y-dark-c-text: #ccd3da;`

#### `#121212` (4 occurrences)

- **docs\todo\TODO.md** line 320
  `- Background-50 through Background-500 → single color (#121212 in dark mode)`
- **src\styles\themes\a11y\a11y-dark.css** line 14
  `--a11y-dark-c-bg: #121212;`
- **src\styles\themes\Preview\coretokens.css** line 19
  `--a11y-dark-c-bg: #121212;`
- **src\styles\tokens\status.css** line 10
  `--color-Black: #121212;`

#### `#555555` (4 occurrences)

- **docs\todo\TODO.md** line 464
  `- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens`
- **src\styles\a11y\components\search-overlay.css** line 140
  `color: #555555 !important;`
- **src\styles\themes\a11y\a11y-monochrome.css** line 16
  `--a11y-mono-c-primary: #555555;`
- **src\styles\themes\Preview\coretokens.css** line 39
  `--a11y-monochrome-c-primary: #555555;`

#### `#393531` (4 occurrences)

- **files\example-BrandDefault-NEW.css** line 27
  `--brand-c-neutral-dark: #393531;`
- **src\styles\components\toast.css** line 35
  `background: var(--color-Neutral-800, #393531);`
- **src\styles\components\toast.css** line 112
  `background: var(--color-Neutral-800, #393531);`
- **src\styles\themes\brand\BrandDefault.css** line 64
  `--color-Neutral-800: #393531;`

#### `rgba(255, 255, 255, 0.3)` (4 occurrences)

- **src\components\Badge\Badge.astro** line 224
  `border: 1px solid rgba(255, 255, 255, 0.3) !important;`
- **src\components\Grids\RelatedGrid.astro** line 409
  `border: 1px solid rgba(255, 255, 255, 0.3);`
- **src\components\Grids\RelatedGrid.astro** line 523
  `border: 1px solid rgba(255, 255, 255, 0.3);`
- **src\components\Grids\RelatedGrid.astro** line 804
  `border-color: rgba(255, 255, 255, 0.3) !important;`

#### `rgba(255, 255, 255, 0.5)` (4 occurrences)

- **src\components\Badge\Badge.astro** line 231
  `background: rgba(255, 255, 255, 0.5) !important;`
- **src\components\Badge\Badge.astro** line 234
  `border: 1px solid rgba(255, 255, 255, 0.5) !important;`
- **src\lib\animation\particle-burst.ts** line 106
  `particle.style.border = '1px solid rgba(255, 255, 255, 0.5)';`
- **src\styles\pages\service-detail.css** line 286
  `border-color: rgba(255, 255, 255, 0.5);`

#### `#22c55e` (4 occurrences)

- **src\scripts\ThemeTokenGen\brand-template.css** line 87
  `--universal-success: #80a575; /* #22c55e - Green success/positive */`
- **src\styles\base\utilities.css** line 454
  `background: var(--color-Success-500, #22c55e);`
- **src\styles\base\utilities.css** line 459
  `border-top-color: var(--color-Success-500, #22c55e);`
- **src\styles\base\utilities.css** line 464
  `border-bottom-color: var(--color-Success-500, #22c55e);`

#### `#ef4444` (4 occurrences)

- **src\scripts\ThemeTokenGen\brand-template.css** line 89
  `--universal-danger: #9c5151;  /* #ef4444 - Red error/danger */`
- **src\styles\base\utilities.css** line 439
  `background: var(--color-Error-500, #ef4444);`
- **src\styles\base\utilities.css** line 444
  `border-top-color: var(--color-Error-500, #ef4444);`
- **src\styles\base\utilities.css** line 449
  `border-bottom-color: var(--color-Error-500, #ef4444);`

#### `#3b82f6` (4 occurrences)

- **src\scripts\ThemeTokenGen\brand-template.css** line 90
  `--universal-info: #47638f;    /* #3b82f6 - Blue info/neutral */`
- **src\styles\base\utilities.css** line 484
  `background: var(--color-Info-500, #3b82f6);`
- **src\styles\base\utilities.css** line 489
  `border-top-color: var(--color-Info-500, #3b82f6);`
- **src\styles\base\utilities.css** line 494
  `border-bottom-color: var(--color-Info-500, #3b82f6);`

#### `#555` (4 occurrences)

- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 234
  `color: #555;`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 74
  `color: #555;`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 125
  `<p style="font-size: 0.9rem; color: #555;">`
- **src\styles\themes\a11y\a11y-dark.css** line 86
  `--color-Neutral-400: #555;`

#### `#333` (4 occurrences)

- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 248
  `color: #333;`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 296
  `color: #333;`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 336
  `color: #333;`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 61
  `color: #333;`

#### `#999` (4 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 794
  `<button class="generate-btn" onclick="generateColorTheories()" style="background: #999; flex: 1;">Or Generate Variations`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 105
  `color: #999;`
- **src\styles\base\utilities.css** line 623
  `color: var(--color-Text-400, #999);`
- **src\styles\themes\a11y\a11y-dark.css** line 88
  `--color-Neutral-600: #999;`

#### `hsl(h, news, newl)` (4 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1066
  `return chroma.hsl(h, newS, newL);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1072
  `return chroma.hsl(h, newS, newL);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1078
  `return chroma.hsl(h, newS, newL);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1084
  `return chroma.hsl(h, newS, newL);`

#### `#5d4f3a` (4 occurrences)

- **src\styles\a11y\pages\asset-detail.css** line 51
  `color: #5d4f3a !important;`
- **src\styles\a11y\pages\asset-detail.css** line 174
  `color: #5d4f3a !important;`
- **src\styles\a11y\pages\asset-detail.css** line 190
  `color: #5d4f3a !important;`
- **src\styles\a11y\pages\asset-detail.css** line 431
  `color: #5d4f3a !important;`

#### `#4a4a4a` (4 occurrences)

- **src\styles\a11y\pages\asset-detail.css** line 76
  `color: #4a4a4a !important;`
- **src\styles\a11y\pages\asset-detail.css** line 215
  `color: #4a4a4a !important;`
- **src\styles\a11y\pages\asset-detail.css** line 235
  `color: #4a4a4a !important;`
- **src\styles\a11y\pages\asset-detail.css** line 453
  `color: #4a4a4a !important;`

#### `#e5e0db` (4 occurrences)

- **src\styles\a11y\visual\text-only.css** line 2085
  `border-bottom: 1px solid var(--color-Neutral-200, #e5e0db) !important;`
- **src\styles\a11y\visual\text-only.css** line 2126
  `border-bottom: 1px solid var(--color-Neutral-200, #e5e0db) !important;`
- **src\styles\a11y\visual\text-only.css** line 2141
  `border-color: var(--color-Neutral-200, #e5e0db) !important;`
- **src\styles\a11y\visual\text-only.css** line 2157
  `background: var(--color-Neutral-200, #e5e0db) !important;`

#### `beige` (3 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 46
  `"name": "Background Beige",`
- **docs\Brand\BRAND-PROFILE.json** line 48
  `"colorName": "Warm Beige",`
- **docs\Brand\BRAND-PROFILE.json** line 268
  `"summary": "Our color palette reflects calm, warmth, and gentle hope. Soft neutrals (warm beige, light grays) create a c`

#### `#6b7280` (3 occurrences)

- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 172
  `"textSecondary": { "type": "string", "example": "#6B7280" },`
- **src\lib\emailit.ts** line 79
  `textLight: '#6b7280',`
- **src\pages\api\contact.ts** line 12
  `textLight: '#6b7280',`

#### `#4caf50` (3 occurrences)

- **docs\Markdown Notes\CSS-Standards.md** line 460
  `.badge { background: #4CAF50; color: white; }`
- **docs\Markdown Notes\CSS-Tokens.md** line 92
  `--color-Success    /* #4caf50 - green */`
- **src\styles\tokens\status.css** line 17
  `--color-Success: #4caf50;`

#### `#272596` (3 occurrences)

- **docs\Markdown Notes\Theme-Preview-System.md** line 35
  `--a11y-dark-c-accent: #272596;`
- **src\styles\themes\a11y\a11y-dark.css** line 20
  `--a11y-dark-c-accent: #272596;`
- **src\styles\themes\Preview\coretokens.css** line 22
  `--a11y-dark-c-accent: #272596;`

#### `#e8e8e8` (3 occurrences)

- **docs\reports\color-token-usage-report.md** line 692
  `- `--color-Text-100: #e8e8e8;` (interpolated value)`
- **docs\reports\FIXES-APPLIED.md** line 16
  `- ✓ **Added `--color-Text-100: #e8e8e8`** (line 48)`
- **src\styles\themes\brand\BrandDefault.css** line 48
  `--color-Text-100: #e8e8e8;`

#### `#c5e1a5` (3 occurrences)

- **docs\todo\TODO.md** line 319
  `- Primary-50 through Primary-900 → single color (#C5E1A5 in dark mode)`
- **src\styles\themes\a11y\a11y-dark.css** line 19
  `--a11y-dark-c-primary: #C5E1A5;`
- **src\styles\themes\Preview\coretokens.css** line 21
  `--a11y-dark-c-primary: #C5E1A5;`

#### `rgba(0, 0, 0, 0.6)` (3 occurrences)

- **docs\todo\TODO.md** line 461
  `- [ ] Replace `rgba(0, 0, 0, 0.6)` with `color-mix(in oklch, var(--color-Black) 60%, transparent)``
- **docs\todo\TODO.md** line 467
  `- [ ] Replace `rgba(0, 0, 0, 0.2)` and `rgba(0, 0, 0, 0.6)` with `color-mix()``
- **src\components\Presentation\Sections\HeroSection.astro** line 72
  `rgba(0, 0, 0, 0.6) 50%,`

#### `#262626` (3 occurrences)

- **files\example-BrandDefault-NEW.css** line 39
  `--brand-c-text-dark: #262626;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 15
  `--color-Text-800: #262626;`
- **src\styles\themes\brand\BrandDefault.css** line 57
  `--color-Text-950: #262626;`

#### `rgba(0, 0, 0, 0.12)` (3 occurrences)

- **src\components\A11y Panel\FontCard.astro** line 56
  `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);`
- **src\components\A11y Panel\PresetButton.astro** line 59
  `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);`
- **src\components\A11y Panel\ToggleCard.astro** line 71
  `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);`

#### `rgba(0,0,0,0.06)` (3 occurrences)

- **src\lib\emailit.ts** line 138
  `box-shadow: 0 4px 24px rgba(0,0,0,0.06);`
- **src\pages\api\contact.ts** line 55
  `box-shadow: 0 4px 24px rgba(0,0,0,0.06);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 51
  `box-shadow: 0 2px 12px rgba(0,0,0,0.06);`

#### `rgba(255,255,255,0.85)` (3 occurrences)

- **src\lib\emailit.ts** line 159
  `color: rgba(255,255,255,0.85);`
- **src\pages\api\contact.ts** line 71
  `color: rgba(255,255,255,0.85);`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 333
  `background: rgba(255,255,255,0.85);`

#### `#ff99c8` (3 occurrences)

- **src\lib\animation\particle-burst.ts** line 44
  `styles.getPropertyValue('--particle-confetti-1').trim() || '#FF99C8',`
- **src\lib\animation\particle-burst.ts** line 189
  `opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];`
- **src\styles\buttons\confetti-button.css** line 48
  `background: var(--confetti-pink, #FF99C8);`

#### `#ae88bf` (3 occurrences)

- **src\lib\animation\particle-burst.ts** line 46
  `styles.getPropertyValue('--particle-confetti-2').trim() || '#AE88BF',`
- **src\lib\animation\particle-burst.ts** line 189
  `opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];`
- **src\styles\buttons\confetti-button.css** line 54
  `12px 4px 0 0 var(--confetti-purple, #AE88BF),`

#### `#80e1cc` (3 occurrences)

- **src\lib\animation\particle-burst.ts** line 48
  `styles.getPropertyValue('--particle-confetti-3').trim() || '#80E1CC',`
- **src\lib\animation\particle-burst.ts** line 189
  `opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];`
- **src\styles\buttons\confetti-button.css** line 55
  `-8px 8px 0 0 var(--confetti-teal, #80E1CC);`

#### `#e9bc88` (3 occurrences)

- **src\lib\animation\particle-burst.ts** line 52
  `styles.getPropertyValue('--particle-confetti-5').trim() || '#e9bc88',`
- **src\lib\animation\particle-burst.ts** line 189
  `opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];`
- **src\styles\buttons\confetti-button.css** line 21
  `background: var(--confetti-gold, #e9bc88);`

#### `#d4b98c` (3 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1127
  `colors.push({ color: '#D4B98C', theory: 'Metallic Gold' });`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2009
  `document.getElementById('secondaryColorPicker').value = '#D4B98C';`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2010
  `document.getElementById('secondaryColorHex').value = '#D4B98C';`

#### `rgba(0,0,0,0.2)` (3 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 189
  `box-shadow: 0 4px 12px rgba(0,0,0,0.2);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 320
  `box-shadow: 0 4px 12px rgba(0,0,0,0.2);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 551
  `box-shadow: 0 6px 16px rgba(0,0,0,0.2);`

#### `rgba(0,0,0,0.5)` (3 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 425
  `text-shadow: 0 2px 4px rgba(0,0,0,0.5);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 634
  `text-shadow: 0 2px 4px rgba(0,0,0,0.5);`
- **src\styles\components\a11y-panel.css** line 416
  `background: rgba(0,0,0,0.5);`

#### `rgba(255, 255, 255, 0.2)` (3 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2072
  `border-bottom: 1px solid rgba(255, 255, 255, 0.2);`
- **src\styles\tokens\shadows.css** line 73
  `--glint-gradient: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);`
- **src\styles\tokens\shadows.css** line 81
  `--glass-border: rgba(255, 255, 255, 0.2);`

#### `gold` (3 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1127
  `colors.push({ color: '#D4B98C', theory: 'Metallic Gold' });`
- **src\styles\buttons\confetti-button.css** line 21
  `background: var(--confetti-gold, #e9bc88);`
- **src\styles\design\confetti.css** line 23
  `--confetti-gold: var(--color-Secondary-400);`

#### `#171717` (3 occurrences)

- **src\styles\base\utilities.css** line 423
  `border: 2px solid var(--color-Neutral-900, #171717);`
- **src\styles\base\utilities.css** line 429
  `border-top-color: var(--color-Neutral-900, #171717);`
- **src\styles\base\utilities.css** line 434
  `border-bottom-color: var(--color-Neutral-900, #171717);`

#### `#71876c` (2 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 113
  `"linkHover": "#71876c",`
- **src\styles\themes\brand\BrandDefault.css** line 18
  `--color-Primary-600: #71876c;`

#### `coral` (2 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 41
  `"colorName": "Dusty Coral",`
- **docs\Brand\BRAND-PROFILE.json** line 268
  `"summary": "Our color palette reflects calm, warmth, and gentle hope. Soft neutrals (warm beige, light grays) create a c`

#### `#10b981` (2 occurrences)

- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 178
  `"accent3": { "type": "string", "example": "#10B981" }`
- **docs\todo\TODO.md** line 381
  `--feedback-success-border: #10b981;`

#### `#ff0000` (2 occurrences)

- **docs\Markdown Notes\accessibility-color-themes.md** line 237
  `--color-Error:   #ff0000;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 238
  `--color-Danger:  #ff0000;`

#### `#ff9800` (2 occurrences)

- **docs\Markdown Notes\CSS-Tokens.md** line 93
  `--color-Warning    /* #ff9800 - orange */`
- **src\styles\tokens\status.css** line 18
  `--color-Warning: #ff9800;`

#### `#f44336` (2 occurrences)

- **docs\Markdown Notes\CSS-Tokens.md** line 94
  `--color-Error      /* #f44336 - red */`
- **src\styles\tokens\status.css** line 19
  `--color-Error: #f44336;`

#### `#2196f3` (2 occurrences)

- **docs\Markdown Notes\CSS-Tokens.md** line 96
  `--color-Info       /* #2196f3 - blue */`
- **src\styles\tokens\status.css** line 20
  `--color-Info: #2196f3;`

#### `rgba(255, 255, 255, 0.12)` (2 occurrences)

- **docs\Markdown Notes\CSS-Tokens.md** line 105
  `background: rgba(255, 255, 255, 0.12);`
- **src\styles\components\presentation\ReaderNav.css** line 760
  `border: var(--border-width) solid rgba(255, 255, 255, 0.12);`

#### `#eeebe2` (2 occurrences)

- **docs\Markdown Notes\new hero.md** line 51
  `- Text: Consider terracotta (#C17C5A) or dark text on cream background (#EEEBE2)`
- **src\scripts\ThemeTokenGen\brand-template.css** line 43
  `--brand-background: #EEEBE2; /* base: 100 - light colors work best for backgrounds */`

#### `#dbdbdb` (2 occurrences)

- **docs\reports\FIXES-APPLIED.md** line 20
  `- ✓ **Added `--color-Text-200: #dbdbdb`** (line 49)`
- **src\styles\themes\brand\BrandDefault.css** line 49
  `--color-Text-200: #dbdbdb;`

#### `#5a5754` (2 occurrences)

- **docs\reports\FIXES-APPLIED.md** line 56
  `- ✓ **Added `--color-Background-600: #5a5754`** (line 41)`
- **src\styles\themes\brand\BrandDefault.css** line 41
  `--color-Background-600: #5a5754;`

#### `#3e3b39` (2 occurrences)

- **docs\reports\FIXES-APPLIED.md** line 57
  `- ✓ **Added `--color-Background-700: #3e3b39`** (line 42)`
- **src\styles\themes\brand\BrandDefault.css** line 42
  `--color-Background-700: #3e3b39;`

#### `#2b2927` (2 occurrences)

- **docs\reports\FIXES-APPLIED.md** line 58
  `- ✓ **Added `--color-Background-800: #2b2927`** (line 43)`
- **src\styles\themes\brand\BrandDefault.css** line 43
  `--color-Background-800: #2b2927;`

#### `#1a1918` (2 occurrences)

- **docs\reports\FIXES-APPLIED.md** line 59
  `- ✓ **Added `--color-Background-900: #1a1918`** (line 44)`
- **src\styles\themes\brand\BrandDefault.css** line 44
  `--color-Background-900: #1a1918;`

#### `#aaaaaa` (2 occurrences)

- **docs\todo\TODO.md** line 458
  `- [ ] Replace `#aaaaaa` with neutral token`
- **src\styles\a11y\components\masonry-grid.css** line 310
  `border: 1px solid #aaaaaa !important;`

#### `rgba(0,0,0,0.08)` (2 occurrences)

- **docs\todo\TODO.md** line 497
  `- [ ] `src/styles/pages/cart.css`: `rgba(0,0,0,0.08)``
- **docs\todo\TODO.md** line 523
  `- [ ] `src/styles/pages/cart.css`: `box-shadow: 0 2px 8px rgba(0,0,0,0.08)` → `var(--shadow-sm)``

#### `#cee6c8` (2 occurrences)

- **files\example-BrandDefault-NEW.css** line 13
  `--brand-c-primary-light: #cee6c8;`
- **src\styles\themes\brand\BrandDefault.css** line 15
  `--color-Primary-300: #cee6c8;`

#### `#ffcfba` (2 occurrences)

- **files\example-BrandDefault-NEW.css** line 19
  `--brand-c-secondary-light: #ffcfba;`
- **src\styles\themes\brand\BrandDefault.css** line 26
  `--color-Secondary-300: #ffcfba;`

#### `#855543` (2 occurrences)

- **files\example-BrandDefault-NEW.css** line 20
  `--brand-c-secondary-dark: #855543;`
- **src\styles\themes\brand\BrandDefault.css** line 30
  `--color-Secondary-700: #855543;`

#### `#c2bdb8` (2 occurrences)

- **files\example-BrandDefault-NEW.css** line 26
  `--brand-c-neutral: #c2bdb8;`
- **src\styles\themes\brand\BrandDefault.css** line 63
  `--color-Neutral-300: #c2bdb8;`

#### `#394e43` (2 occurrences)

- **files\example-BrandDefault-NEW.css** line 33
  `--brand-c-bg-dark: #394e43;`
- **src\scripts\ThemeTokenGen\brand-template.css** line 48
  `--brand-background-dark: #394e43; /* base: 800 - dark colors for dark mode */`

#### `rgba(255, 255, 255, 0.6)` (2 occurrences)

- **src\components\Checkout\DownloadSummary.astro** line 130
  `background: rgba(255, 255, 255, 0.6);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2340
  `color: rgba(255, 255, 255, 0.6);`

#### `rgba(255, 255, 255, 0.25)` (2 occurrences)

- **src\components\Grids\RelatedGrid.astro** line 415
  `background: rgba(255, 255, 255, 0.25);`
- **src\styles\components\presentation\ReaderNav.css** line 778
  `border: var(--border-width) solid rgba(255, 255, 255, 0.25);`

#### `rgba(255, 255, 255, 0.4)` (2 occurrences)

- **src\components\Grids\RelatedGrid.astro** line 416
  `border-color: rgba(255, 255, 255, 0.4);`
- **src\styles\tokens\shadows.css** line 74
  `--glint-gradient-strong: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);`

#### `rgba(0, 0, 0, 0.3)` (2 occurrences)

- **src\components\Grids\RelatedGrid.astro** line 488
  `box-shadow: 0 20px 45px rgba(0, 0, 0, 0.3);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2141
  `box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);`

#### `rgba(255, 255, 255, 0.18)` (2 occurrences)

- **src\components\Presentation\Sections\FullWidthSection.astro** line 72
  `border: 1px solid rgba(255, 255, 255, 0.18);`
- **src\styles\components\presentation\ReaderNav.css** line 777
  `background-color: rgba(255, 255, 255, 0.18);`

#### `#7a9175` (2 occurrences)

- **src\lib\emailit.ts** line 81
  `primaryDark: '#7a9175',`
- **src\pages\api\contact.ts** line 14
  `primaryDark: '#7a9175',`

#### `#e8e6e3` (2 occurrences)

- **src\lib\emailit.ts** line 84
  `border: '#e8e6e3',`
- **src\pages\api\contact.ts** line 17
  `border: '#e8e6e3',`

#### `#f0ebe6` (2 occurrences)

- **src\lib\emailit.ts** line 85
  `highlight: '#f0ebe6'`
- **src\pages\api\contact.ts** line 18
  `highlight: '#f0ebe6'`

#### `rgba(143,166,138,0.1)` (2 occurrences)

- **src\lib\emailit.ts** line 272
  `background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);`
- **src\pages\api\contact.ts** line 122
  `background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);`

#### `rgba(196,144,124,0.1)` (2 occurrences)

- **src\lib\emailit.ts** line 272
  `background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);`
- **src\pages\api\contact.ts** line 122
  `background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);`

#### `#8aa5e5` (2 occurrences)

- **src\lib\animation\particle-burst.ts** line 50
  `styles.getPropertyValue('--particle-confetti-4').trim() || '#8AA5E5',`
- **src\lib\animation\particle-burst.ts** line 189
  `opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];`

#### `#5a5a5a` (2 occurrences)

- **src\scripts\ThemeTokenGen\brand-template.css** line 56
  `--brand-text: #5A5A5A; /* base: 700 - medium-dark for readability */`
- **src\styles\themes\brand\BrandDefault.css** line 54
  `--color-Text-700: #5a5a5a;`

#### `#3e4a5a` (2 occurrences)

- **src\scripts\ThemeTokenGen\brand-template.css** line 76
  `--brand-accent4: #3e4a5a; /* base: 500 */`
- **src\styles\themes\brand\BrandDefault.css** line 102
  `--color-AccentFour-500: #3e4a5a;`

#### `#a28aad` (2 occurrences)

- **src\scripts\ThemeTokenGen\brand-template.css** line 80
  `--brand-accent5: #a28aad; /* base: 500 */`
- **src\styles\themes\brand\BrandDefault.css** line 112
  `--color-AccentFive-500: #a28aad;`

#### `#0e3f2e` (2 occurrences)

- **src\scripts\ThemeTokenGen\color-input.css** line 83
  `--brand-background-dark: #0e3f2e; /* base: 950 - Primary */`
- **src\scripts\ThemeTokenGen\color-input.css** line 84
  `--brand-text: #0e3f2e; /* base: 700 - Primary */`

#### `#fafafa` (2 occurrences)

- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 241
  `background: #fafafa;`
- **src\styles\base\utilities.css** line 421
  `background: var(--color-Neutral-50, #fafafa);`

#### `#e0e0e0` (2 occurrences)

- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 243
  `border: 1px solid #e0e0e0;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 140
  `border-bottom: 2px solid #e0e0e0;`

#### `rgba(255,255,255,0.9)` (2 occurrences)

- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 291
  `background: rgba(255,255,255,0.9);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 650
  `background: rgba(255,255,255,0.9);`

#### `hsl((h + 180)` (2 occurrences)

- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 23
  `complementary: () => chroma.hsl((h + 180) % 360, s, l),`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1039
  `complementary: () => chroma.hsl((h + 180) % 360, s, l),`

#### `hsl((h + offset + 360)` (2 occurrences)

- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 26
  `return chroma.hsl((h + offset + 360) % 360, s, l);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1042
  `return chroma.hsl((h + offset + 360) % 360, s, l);`

#### `#373737` (2 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 14
  `--color-Text-700: #373737;`
- **src\styles\themes\brand\BrandDefault.css** line 56
  `--color-Text-900: #373737;`

#### `#4a90e2` (2 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 795
  `<button class="generate-btn" onclick="chooseAgain()" style="background: #4A90E2; color: white; flex: 0.5; min-width: 150`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 840
  `<button class="export-btn" onclick="openLiveDemo()" style="background: #4A90E2;">Open Live Demo Page</button>`

#### `#888888` (2 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1814
  `const getColor = (key) => a[key]?.color || '#888888';`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2043
  `const getColor = (key) => a[key]?.color || '#888888';`

#### `rgba(0,0,0,0.9)` (2 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 437
  `background: rgba(0,0,0,0.9);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 574
  `background: rgba(0,0,0,0.9);`

#### `rgba(255,255,255,0.95)` (2 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 458
  `background: rgba(255,255,255,0.95);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 565
  `background: rgba(255,255,255,0.95);`

#### `rgba(0,0,0,0.12)` (2 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 538
  `box-shadow: 0 2px 8px rgba(0,0,0,0.12);`
- **src\styles\themes\Preview\theme-cards.css** line 75
  `border: 1px solid rgba(0,0,0,0.12);`

#### `rgba(255, 255, 255, 0.8)` (2 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2069
  `background: rgba(255, 255, 255, 0.8);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2230
  `color: rgba(255, 255, 255, 0.8);`

#### `rgba(255, 255, 255, 0.7)` (2 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2254
  `color: rgba(255, 255, 255, 0.7);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2327
  `color: rgba(255, 255, 255, 0.7);`

#### `rgba(var(--a11y-cvd-accent-rgb)` (2 occurrences)

- **src\styles\a11y\components\masonry-grid.css** line 452
  `background: rgba(var(--a11y-cvd-accent-rgb), 0.15) !important;`
- **src\styles\a11y\components\masonry-grid.css** line 454
  `border: 1px solid rgba(var(--a11y-cvd-accent-rgb), 0.3) !important;`

#### `#111111` (2 occurrences)

- **src\styles\a11y\pages\asset-detail.css** line 127
  `background: #111111 !important;`
- **src\styles\a11y\pages\asset-detail.css** line 283
  `background: #111111 !important;`

#### `#1f2937` (2 occurrences)

- **src\styles\base\utilities.css** line 297
  `border-top-color: var(--color-Neutral-800, #1f2937);`
- **src\styles\base\utilities.css** line 321
  `border-bottom-color: var(--color-Neutral-800, #1f2937);`

#### `#111` (2 occurrences)

- **src\styles\base\utilities.css** line 385
  `color: var(--color-Text-900, #111);`
- **src\styles\base\utilities.css** line 422
  `color: var(--color-Text-900, #111);`

#### `#fef2f2` (2 occurrences)

- **src\styles\base\utilities.css** line 518
  `background: var(--color-Error-100, #fef2f2);`
- **src\styles\base\utilities.css** line 552
  `background-color: var(--color-Error-100, #fef2f2);`

#### `#f0fdfa` (2 occurrences)

- **src\styles\base\utilities.css** line 578
  `background-color: var(--color-Success-100, var(--color-Primary-50, #f0fdfa));`
- **src\styles\base\utilities.css** line 585
  `background: var(--color-Success-100, var(--color-Primary-50, #f0fdfa));`

#### `rgba(var(--color-primary-500-rgb, 99, 102, 241)` (2 occurrences)

- **src\styles\components\presentation\ReaderNav.css** line 873
  `0 0 30px rgba(var(--color-Primary-500-rgb, 99, 102, 241), 0.4),`
- **src\styles\components\presentation\ReaderNav.css** line 874
  `0 0 60px rgba(var(--color-Primary-500-rgb, 99, 102, 241), 0.2),`

#### `#f6f5fa` (2 occurrences)

- **src\styles\themes\a11y\a11y-deuteranopia.css** line 14
  `--a11y-deuter-c-bg: #f6f5fa;`
- **src\styles\themes\Preview\coretokens.css** line 25
  `--a11y-deuteranopia-c-bg: #f6f5fa;`

#### `#1c1b29` (2 occurrences)

- **src\styles\themes\a11y\a11y-deuteranopia.css** line 15
  `--a11y-deuter-c-text: #1c1b29;`
- **src\styles\themes\Preview\coretokens.css** line 26
  `--a11y-deuteranopia-c-text: #1c1b29;`

#### `#6d28d9` (2 occurrences)

- **src\styles\themes\a11y\a11y-deuteranopia.css** line 16
  `--a11y-deuter-c-primary: #6d28d9;`
- **src\styles\themes\Preview\coretokens.css** line 27
  `--a11y-deuteranopia-c-primary: #6d28d9;`

#### `#f97316` (2 occurrences)

- **src\styles\themes\a11y\a11y-deuteranopia.css** line 17
  `--a11y-deuter-c-accent: #f97316;`
- **src\styles\themes\Preview\coretokens.css** line 28
  `--a11y-deuteranopia-c-accent: #f97316;`

#### `#e6e4e2` (2 occurrences)

- **src\styles\themes\a11y\a11y-monochrome.css** line 14
  `--a11y-mono-c-bg: #e6e4e2;`
- **src\styles\themes\Preview\coretokens.css** line 37
  `--a11y-monochrome-c-bg: #e6e4e2;`

#### `#f5f7fb` (2 occurrences)

- **src\styles\themes\a11y\a11y-protanopia.css** line 14
  `--a11y-proto-c-bg: #f5f7fb;`
- **src\styles\themes\Preview\coretokens.css** line 43
  `--a11y-protanopia-c-bg: #f5f7fb;`

#### `#0f172a` (2 occurrences)

- **src\styles\themes\a11y\a11y-protanopia.css** line 15
  `--a11y-proto-c-text: #0f172a;`
- **src\styles\themes\Preview\coretokens.css** line 44
  `--a11y-protanopia-c-text: #0f172a;`

#### `#1e40af` (2 occurrences)

- **src\styles\themes\a11y\a11y-protanopia.css** line 16
  `--a11y-proto-c-primary: #1e40af;`
- **src\styles\themes\Preview\coretokens.css** line 45
  `--a11y-protanopia-c-primary: #1e40af;`

#### `#fdf4ff` (2 occurrences)

- **src\styles\themes\a11y\a11y-tritanopia.css** line 14
  `--a11y-trit-c-bg: #fdf4ff;`
- **src\styles\themes\Preview\coretokens.css** line 49
  `--a11y-tritanopia-c-bg: #fdf4ff;`

#### `#1e293b` (2 occurrences)

- **src\styles\themes\a11y\a11y-tritanopia.css** line 15
  `--a11y-trit-c-text: #1e293b;`
- **src\styles\themes\Preview\coretokens.css** line 50
  `--a11y-tritanopia-c-text: #1e293b;`

#### `#cc3399` (2 occurrences)

- **src\styles\themes\a11y\a11y-tritanopia.css** line 16
  `--a11y-trit-c-primary: #cc3399;`
- **src\styles\themes\Preview\coretokens.css** line 51
  `--a11y-tritanopia-c-primary: #cc3399;`

#### `#06b6d4` (2 occurrences)

- **src\styles\themes\a11y\a11y-tritanopia.css** line 17
  `--a11y-trit-c-accent: #06b6d4;`
- **src\styles\themes\Preview\coretokens.css** line 52
  `--a11y-tritanopia-c-accent: #06b6d4;`

#### `#fffbf2` (1 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 109
  `"surface": "#fffbf2",`

#### `gray` (1 occurrences)

- **docs\Brand\BRAND-PROFILE.json** line 55
  `"colorName": "Charcoal Gray",`

#### `#f9fafb` (1 occurrences)

- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 170
  `"surface": { "type": "string", "description": "Card/panel background hex", "example": "#F9FAFB" },`

#### `#0052cc` (1 occurrences)

- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 174
  `"linkHover": { "type": "string", "example": "#0052CC" },`

#### `#e5e7eb` (1 occurrences)

- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 175
  `"border": { "type": "string", "example": "#E5E7EB" },`

#### `#8b5cf6` (1 occurrences)

- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 177
  `"accent2": { "type": "string", "example": "#8B5CF6" },`

#### `#374151` (1 occurrences)

- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 223
  `"bodyColor": { "type": "string", "example": "#374151" }`

#### `#ff6600` (1 occurrences)

- **docs\Markdown Notes\accessibility-color-themes.md** line 232
  `--color-AccentFour-500: #ff6600;`

#### `#ff00ff` (1 occurrences)

- **docs\Markdown Notes\accessibility-color-themes.md** line 233
  `--color-AccentFive-500: #ff00ff;`

#### `#c17c5a` (1 occurrences)

- **docs\Markdown Notes\new hero.md** line 51
  `- Text: Consider terracotta (#C17C5A) or dark text on cream background (#EEEBE2)`

#### `#040913` (1 occurrences)

- **docs\Markdown Notes\Theme-Preview-System.md** line 32
  `--a11y-dark-c-bg: #040913;`

#### `#962587` (1 occurrences)

- **docs\Markdown Notes\Theme-Preview-System.md** line 34
  `--a11y-dark-c-primary: #962587;`

#### `#065f46` (1 occurrences)

- **docs\todo\TODO.md** line 380
  `--feedback-success-text: #065f46;`

#### `#7f1d1d` (1 occurrences)

- **docs\todo\TODO.md** line 383
  `--feedback-error-text: #7f1d1d;`

#### `#92400e` (1 occurrences)

- **docs\todo\TODO.md** line 386
  `--feedback-warning-text: #92400e;`

#### `rgba(255, 255, 255, 0.75)` (1 occurrences)

- **src\components\Grids\RelatedGrid.astro** line 511
  `color: rgba(255, 255, 255, 0.75);`

#### `rgba(0, 0, 0, 0.9)` (1 occurrences)

- **src\components\Presentation\Sections\HeroSection.astro** line 71
  `rgba(0, 0, 0, 0.9) 0%,`

#### `#8b6b5a` (1 occurrences)

- **src\lib\emailit.ts** line 292
  `color: #8b6b5a;`

#### `#7a5c4d` (1 occurrences)

- **src\lib\emailit.ts** line 297
  `color: #7a5c4d;`

#### `rgba(196,144,124,0.15)` (1 occurrences)

- **src\lib\emailit.ts** line 287
  `background: linear-gradient(135deg, rgba(196,144,124,0.15) 0%, rgba(196,144,124,0.08) 100%);`

#### `rgba(196,144,124,0.08)` (1 occurrences)

- **src\lib\emailit.ts** line 287
  `background: linear-gradient(135deg, rgba(196,144,124,0.15) 0%, rgba(196,144,124,0.08) 100%);`

#### `rgba(196,144,124,0.3)` (1 occurrences)

- **src\lib\emailit.ts** line 288
  `border: 1px solid rgba(196,144,124,0.3);`

#### `rgb(248, 245, 242)` (1 occurrences)

- **src\lib\animation\scroll-color-background.ts** line 68
  `const fallbackColor = 'rgb(248, 245, 242)';`

#### `rgba(0, 0, 0, 0.03)` (1 occurrences)

- **src\pages\verify.astro** line 205
  `0 4px 12px rgba(0, 0, 0, 0.03);`

#### `#fdf8f3` (1 occurrences)

- **src\scripts\ThemeTokenGen\brand-template.css** line 60
  `--brand-neutral: #FDF8F3; /* base: 100 - very light for subtle borders */`

#### `#80a575` (1 occurrences)

- **src\scripts\ThemeTokenGen\brand-template.css** line 87
  `--universal-success: #80a575; /* #22c55e - Green success/positive */`

#### `#cea96a` (1 occurrences)

- **src\scripts\ThemeTokenGen\brand-template.css** line 88
  `--universal-warning: #cea96a; /* #f59e0b - Amber warning/caution */`

#### `#9c5151` (1 occurrences)

- **src\scripts\ThemeTokenGen\brand-template.css** line 89
  `--universal-danger: #9c5151;  /* #ef4444 - Red error/danger */`

#### `#47638f` (1 occurrences)

- **src\scripts\ThemeTokenGen\brand-template.css** line 90
  `--universal-info: #47638f;    /* #3b82f6 - Blue info/neutral */`

#### `#2a3328` (1 occurrences)

- **src\scripts\ThemeTokenGen\color-input.css** line 50
  `--brand-background-dark: #2a3328; /* base: 850 - dark sage green for dark mode */`

#### `#f2efd4` (1 occurrences)

- **src\scripts\ThemeTokenGen\color-input.css** line 74
  `--brand-background: #f2efd4; /* base: 50 - Primary */`

#### `#86a182` (1 occurrences)

- **src\scripts\ThemeTokenGen\color-input.css** line 75
  `--brand-primary: #86a182; /* base: 500 - Primary */`

#### `#b9a26e` (1 occurrences)

- **src\scripts\ThemeTokenGen\color-input.css** line 76
  `--brand-secondary: #b9a26e; /* base: 500 - Primary */`

#### `#8ac7b2` (1 occurrences)

- **src\scripts\ThemeTokenGen\color-input.css** line 77
  `--brand-accent1: #8ac7b2; /* base: 500 - Primary */`

#### `#c78a9f` (1 occurrences)

- **src\scripts\ThemeTokenGen\color-input.css** line 78
  `--brand-accent2: #c78a9f; /* base: 500 - Complement */`

#### `#8abdc7` (1 occurrences)

- **src\scripts\ThemeTokenGen\color-input.css** line 79
  `--brand-accent3: #8abdc7; /* base: 500 - Analogous Right */`

#### `#bdc78a` (1 occurrences)

- **src\scripts\ThemeTokenGen\color-input.css** line 80
  `--brand-accent4: #bdc78a; /* base: 500 - Tetradic 3 */`

#### `#c7948a` (1 occurrences)

- **src\scripts\ThemeTokenGen\color-input.css** line 81
  `--brand-neutral: #c7948a; /* base: 50 - Split 2 */`

#### `#938ac7` (1 occurrences)

- **src\scripts\ThemeTokenGen\color-input.css** line 82
  `--brand-accent5: #938ac7; /* base: 500 - Tetradic 1 */`

#### `#222` (1 occurrences)

- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 211
  `color: #222;`

#### `#f9f9f9` (1 occurrences)

- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 226
  `background: #f9f9f9;`

#### `#444` (1 occurrences)

- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 274
  `color: #444;`

#### `#181818` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 16
  `--color-Text-900: #181818;`

#### `#e74c3c` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 796
  `<button class="generate-btn" onclick="clearAll()" style="background: #E74C3C; color: white; flex: 0.5; min-width: 150px;`

#### `#c0c0c0` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1128
  `colors.push({ color: '#C0C0C0', theory: 'Metallic Silver' });`

#### `#b8a89d` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1215
  `secondary: '#B8A89D'     // Warm taupe`

#### `#f7a072` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1218
  `primary: '#F7A072',      // Coral`

#### `#ffd966` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1219
  `secondary: '#FFD966'     // Sunny yellow`

#### `#7a8b99` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1222
  `primary: '#7A8B99',      // Muted blue-grey`

#### `#c9b8a8` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1223
  `secondary: '#C9B8A8'     // Soft beige`

#### `#ff6b6b` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1226
  `primary: '#FF6B6B',      // Vibrant red`

#### `#4ecdc4` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1227
  `secondary: '#4ECDC4'     // Turquoise`

#### `#2c3e50` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1230
  `primary: '#2C3E50',      // Deep navy`

#### `#d4af37` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1231
  `secondary: '#D4AF37'     // Gold`

#### `#a0826d` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1234
  `primary: '#A0826D',      // Terracotta`

#### `#7d9d7c` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1235
  `secondary: '#7D9D7C'     // Sage`

#### `#5d6d7e` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1238
  `primary: '#5D6D7E',      // Cool grey`

#### `#85929e` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1239
  `secondary: '#85929E'     // Light grey`

#### `#ede7de` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1324
  `palette.push(chroma.hsl(neutralHue, neutralSat, neutralLight).hex()); // #ede7de range`

#### `#48839e` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1916
  `const primaryBase = state.generatedScales['primary'] ? state.generatedScales['primary']['500'] : '#48839e';`

#### `rgba(255,255,255,0.1)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 238
  `border-top: 2px solid rgba(255,255,255,0.1);`

#### `rgba(0,0,0,0.95)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 340
  `background: rgba(0,0,0,0.95);`

#### `rgba(0,0,0,0.4)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 713
  `color: rgba(0,0,0,0.4);`

#### `rgba(255,255,255,0.2)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1861
  `item.style.borderBottomColor = a[accentKey]?.color || 'rgba(255,255,255,0.2)';`

#### `rgba(0, 0, 0, 0.05)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2078
  `box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);`

#### `hsl(h, news, l)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1089
  `return chroma.hsl(h, newS, l);`

#### `hsl(warmh, news, newl)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1096
  `return chroma.hsl(warmH, newS, newL);`

#### `hsl(hue, sat, light)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1173
  `return chroma.hsl(hue, sat, light).hex();`

#### `hsl((h1 + 180)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1294
  `secondaryColor = chroma.hsl((h1 + 180) % 360, s1 * 0.9, l1).hex();`

#### `hsl((h1 + 30)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1308
  `palette.push(chroma.hsl((h1 + 30) % 360, s1 * 0.95, l1 * 1.05).hex());`

#### `hsl((h2 - 30 + 360)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1311
  `palette.push(chroma.hsl((h2 - 30 + 360) % 360, s2 * 0.95, l2 * 1.05).hex());`

#### `hsl((h1 + 120)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1314
  `palette.push(chroma.hsl((h1 + 120) % 360, s1 * 0.85, l1 * 0.95).hex());`

#### `hsl((h2 + 120)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1317
  `palette.push(chroma.hsl((h2 + 120) % 360, s2 * 0.85, l2 * 0.95).hex());`

#### `hsl(neutralhue, neutralsat, neutrallight)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1324
  `palette.push(chroma.hsl(neutralHue, neutralSat, neutralLight).hex()); // #ede7de range`

#### `hsl((avghue + 45)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1330
  `palette.push(chroma.hsl((avgHue + 45) % 360, avgSat * 1.05, avgLight).hex());`

#### `hsl(h, s * 0.6, math.min(0.75, l * 1.15)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1460
  `return chroma.hsl(h, s * 0.6, Math.min(0.75, l * 1.15)).hex();`

#### `hsl(h, math.min(1, s * 1.3)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1464
  `return chroma.hsl(h, Math.min(1, s * 1.3), Math.max(0.5, Math.min(0.7, l))).hex();`

#### `hsl(h, s * 0.5, math.min(0.7, l * 1.1)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1468
  `return chroma.hsl(h, s * 0.5, Math.min(0.7, l * 1.1)).hex();`

#### `hsl(h, math.min(1, s * 1.4)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1472
  `return chroma.hsl(h, Math.min(1, s * 1.4), Math.max(0.45, Math.min(0.65, l))).hex();`

#### `hsl(h, math.min(0.9, s * 1.1)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1476
  `return chroma.hsl(h, Math.min(0.9, s * 1.1), Math.max(0.3, l * 0.8)).hex();`

#### `hsl((h + 10)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1480
  `return chroma.hsl((h + 10) % 360, s * 0.55, Math.min(0.65, l)).hex();`

#### `hsl(h, s * 0.75, l)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1484
  `return chroma.hsl(h, s * 0.75, l).hex();`

#### `hsl(neutralhue, saturation, lightness)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1720
  `scale[pos] = chroma.hsl(neutralHue, saturation, lightness).hex();`

#### `hsl(145, 0.3 * satadjust, 0.92 * lightadjust)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1926
  `css += `  --color-Success-100: ${toOKLCH(chroma.hsl(145, 0.3 * satAdjust, 0.92 * lightAdjust).hex())};\n`;`

#### `hsl(145, 0.5 * satadjust, 0.80 * lightadjust)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1927
  `css += `  --color-Success-200: ${toOKLCH(chroma.hsl(145, 0.5 * satAdjust, 0.80 * lightAdjust).hex())};\n`;`

#### `hsl(145, 0.6 * satadjust, 0.50 * lightadjust)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1928
  `css += `  --color-Success-500: ${toOKLCH(chroma.hsl(145, 0.6 * satAdjust, 0.50 * lightAdjust).hex())};\n`;`

#### `hsl(45, 0.4 * satadjust, 0.92 * lightadjust)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1931
  `css += `  --color-Warning-100: ${toOKLCH(chroma.hsl(45, 0.4 * satAdjust, 0.92 * lightAdjust).hex())};\n`;`

#### `hsl(45, 0.6 * satadjust, 0.80 * lightadjust)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1932
  `css += `  --color-Warning-200: ${toOKLCH(chroma.hsl(45, 0.6 * satAdjust, 0.80 * lightAdjust).hex())};\n`;`

#### `hsl(45, 0.8 * satadjust, 0.60 * lightadjust)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1933
  `css += `  --color-Warning-500: ${toOKLCH(chroma.hsl(45, 0.8 * satAdjust, 0.60 * lightAdjust).hex())};\n`;`

#### `hsl(15, 0.4 * satadjust, 0.92 * lightadjust)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1936
  `css += `  --color-Error-100: ${toOKLCH(chroma.hsl(15, 0.4 * satAdjust, 0.92 * lightAdjust).hex())};\n`;`

#### `hsl(15, 0.6 * satadjust, 0.80 * lightadjust)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1937
  `css += `  --color-Error-200: ${toOKLCH(chroma.hsl(15, 0.6 * satAdjust, 0.80 * lightAdjust).hex())};\n`;`

#### `hsl(15, 0.8 * satadjust, 0.55 * lightadjust)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1938
  `css += `  --color-Error-500: ${toOKLCH(chroma.hsl(15, 0.8 * satAdjust, 0.55 * lightAdjust).hex())};\n`;`

#### `hsl(215, 0.4 * satadjust, 0.92 * lightadjust)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1941
  `css += `  --color-Info-100: ${toOKLCH(chroma.hsl(215, 0.4 * satAdjust, 0.92 * lightAdjust).hex())};\n`;`

#### `hsl(215, 0.6 * satadjust, 0.80 * lightadjust)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1942
  `css += `  --color-Info-200: ${toOKLCH(chroma.hsl(215, 0.6 * satAdjust, 0.80 * lightAdjust).hex())};\n`;`

#### `hsl(215, 0.7 * satadjust, 0.55 * lightadjust)` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1943
  `css += `  --color-Info-500: ${toOKLCH(chroma.hsl(215, 0.7 * satAdjust, 0.55 * lightAdjust).hex())};\n`;`

#### `silver` (1 occurrences)

- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1128
  `colors.push({ color: '#C0C0C0', theory: 'Metallic Silver' });`

#### `#e3f2fd` (1 occurrences)

- **src\scripts\ThemeTokenGen\preview-colors.js** line 109
  `background: #e3f2fd;`

#### `#1976d2` (1 occurrences)

- **src\scripts\ThemeTokenGen\preview-colors.js** line 116
  `color: #1976d2;`

#### `#000` (1 occurrences)

- **src\scripts\ThemeTokenGen\preview-colors.js** line 143
  `const textColor = luminance > 0.5 ? '#000' : '#fff';`

#### `hsl(newhue, saturation, lightness)` (1 occurrences)

- **src\scripts\ThemeTokenGen\simple-theme-gen.js** line 63
  `return chroma.hsl(newHue, saturation, lightness).hex();`

#### `hsl(hsl[0] || 0, hsl[1], targetlightness)` (1 occurrences)

- **src\scripts\ThemeTokenGen\simple-theme-gen.js** line 138
  `const fallbackColor = chroma.hsl(hsl[0] || 0, hsl[1], targetLightness);`

#### `#cccccc` (1 occurrences)

- **src\styles\a11y\pages\asset-detail.css** line 274
  `color: #cccccc !important;`

#### `#7a6b54` (1 occurrences)

- **src\styles\a11y\pages\asset-detail.css** line 294
  `color: #7a6b54 !important;`

#### `#f1f5f9` (1 occurrences)

- **src\styles\a11y\pages\asset-detail.css** line 339
  `color: var(--a11y-dark-text, #f1f5f9) !important;`

#### `#ccc` (1 occurrences)

- **src\styles\a11y\visual\text-only.css** line 1990
  `border: 2px solid var(--color-Neutral-300, #ccc) !important;`

#### `#0a0a0a` (1 occurrences)

- **src\styles\base\utilities.css** line 402
  `background: var(--color-Background-900, #0a0a0a);`

#### `#fecaca` (1 occurrences)

- **src\styles\base\utilities.css** line 519
  `border: 1px solid var(--color-Error-200, #fecaca);`

#### `#14b8a6` (1 occurrences)

- **src\styles\base\utilities.css** line 584
  `color: var(--color-Success-500, var(--color-Primary-600, #14b8a6));`

#### `#99f6e4` (1 occurrences)

- **src\styles\base\utilities.css** line 586
  `border: 1px solid var(--color-Success-200, var(--color-Primary-200, #99f6e4));`

#### `#b45309` (1 occurrences)

- **src\styles\base\utilities.css** line 601
  `color: var(--color-Warning-500, var(--color-AccentOne-700, #b45309));`

#### `#fffbeb` (1 occurrences)

- **src\styles\base\utilities.css** line 602
  `background: var(--color-Warning-100, var(--color-AccentOne-100, #fffbeb));`

#### `#fde68a` (1 occurrences)

- **src\styles\base\utilities.css** line 603
  `border: 1px solid var(--color-Warning-200, var(--color-AccentOne-300, #fde68a));`

#### `rgba(0, 0, 0, 0.85)` (1 occurrences)

- **src\styles\components\philosophy-flip-cards.css** line 302
  `background: rgba(0, 0, 0, 0.85);`

#### `rgba(250, 248, 244, 0.9)` (1 occurrences)

- **src\styles\components\philosophy-flip-cards.css** line 306
  `background: rgba(250, 248, 244, 0.9);`

#### `rgba(255, 255, 255, 0.9)` (1 occurrences)

- **src\styles\components\philosophy-flip-cards.css** line 310
  `background: rgba(255, 255, 255, 0.9);`

#### `rgba(0, 0, 0, 0.45)` (1 occurrences)

- **src\styles\components\presentation\ReaderNav.css** line 741
  `background-color: rgba(0, 0, 0, 0.45);`

#### `rgba(255, 255, 255, 0.45)` (1 occurrences)

- **src\styles\components\presentation\ReaderNav.css** line 750
  `background-color: rgba(255, 255, 255, 0.45);`

#### `rgba(209, 213, 219, 0.3)` (1 occurrences)

- **src\styles\components\presentation\ReaderNav.css** line 751
  `border: var(--border-width) solid rgba(209, 213, 219, 0.3);`

#### `rgba(20, 20, 30, 0.35)` (1 occurrences)

- **src\styles\components\presentation\ReaderNav.css** line 759
  `background-color: rgba(20, 20, 30, 0.35);`

#### `rgba(255, 255, 255, 0.05)` (1 occurrences)

- **src\styles\components\presentation\ReaderNav.css** line 909
  `0 0 0 1px rgba(255, 255, 255, 0.05);`

#### `rgba(255, 255, 255, 0.85)` (1 occurrences)

- **src\styles\pages\service-detail.css** line 273
  `color: rgba(255, 255, 255, 0.85);`

#### `#1e1e1e` (1 occurrences)

- **src\styles\themes\a11y\a11y-dark.css** line 15
  `--a11y-dark-c-surface: #1e1e1e;`

#### `#2a2a2a` (1 occurrences)

- **src\styles\themes\a11y\a11y-dark.css** line 16
  `--a11y-dark-c-surface-raised: #2a2a2a;`

#### `#3a3a3a` (1 occurrences)

- **src\styles\themes\a11y\a11y-dark.css** line 17
  `--a11y-dark-c-border: #3a3a3a;`

#### `#777` (1 occurrences)

- **src\styles\themes\a11y\a11y-dark.css** line 87
  `--color-Neutral-500: #777;`

#### `#aaa` (1 occurrences)

- **src\styles\themes\a11y\a11y-dark.css** line 89
  `--color-Neutral-700: #aaa;`

#### `#f0fdee` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 14
  `--color-Primary-200: #f0fdee;`

#### `#aec6a9` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 16
  `--color-Primary-400: #aec6a9;`

#### `#42563d` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 20
  `--color-Primary-800: #42563d;`

#### `#364433` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 21
  `--color-Primary-900: #364433;`

#### `#fff4ee` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 24
  `--color-Secondary-100: #fff4ee;`

#### `#fff1e7` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 25
  `--color-Secondary-200: #fff1e7;`

#### `#e5af9a` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 27
  `--color-Secondary-400: #e5af9a;`

#### `#a4725f` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 29
  `--color-Secondary-600: #a4725f;`

#### `#6f4230` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 31
  `--color-Secondary-800: #6f4230;`

#### `#d2d1cc` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 37
  `--color-Background-200: #d2d1cc;`

#### `#b4b1a8` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 38
  `--color-Background-300: #b4b1a8;`

#### `#95928a` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 39
  `--color-Background-400: #95928a;`

#### `#77746c` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 40
  `--color-Background-500: #77746c;`

#### `#f8f8f8` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 47
  `--color-Text-50: #f8f8f8;`

#### `#d3d3d3` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 50
  `--color-Text-300: #d3d3d3;`

#### `#b3b3b3` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 51
  `--color-Text-400: #b3b3b3;`

#### `#949494` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 52
  `--color-Text-500: #949494;`

#### `#292624` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 65
  `--color-Neutral-900: #292624;`

#### `#fef7f3` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 68
  `--color-AccentOne-100: #fef7f3;`

#### `#f3e6e0` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 69
  `--color-AccentOne-200: #f3e6e0;`

#### `#dcc3b6` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 70
  `--color-AccentOne-300: #dcc3b6;`

#### `#bba397` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 71
  `--color-AccentOne-400: #bba397;`

#### `#7e685c` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 73
  `--color-AccentOne-600: #7e685c;`

#### `#614c41` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 74
  `--color-AccentOne-700: #614c41;`

#### `#4d392f` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 75
  `--color-AccentOne-800: #4d392f;`

#### `#f4f8ff` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 78
  `--color-AccentTwo-100: #f4f8ff;`

#### `#e9f0ff` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 79
  `--color-AccentTwo-200: #e9f0ff;`

#### `#c1cff6` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 80
  `--color-AccentTwo-300: #c1cff6;`

#### `#a1afd5` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 81
  `--color-AccentTwo-400: #a1afd5;`

#### `#667296` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 83
  `--color-AccentTwo-600: #667296;`

#### `#4a5677` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 84
  `--color-AccentTwo-700: #4a5677;`

#### `#384263` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 85
  `--color-AccentTwo-800: #384263;`

#### `#fcf6fa` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 88
  `--color-AccentThree-100: #fcf6fa;`

#### `#f1e8ee` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 89
  `--color-AccentThree-200: #f1e8ee;`

#### `#d6c4d1` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 90
  `--color-AccentThree-300: #d6c4d1;`

#### `#b6a4b1` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 91
  `--color-AccentThree-400: #b6a4b1;`

#### `#796974` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 93
  `--color-AccentThree-600: #796974;`

#### `#5c4d58` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 94
  `--color-AccentThree-700: #5c4d58;`

#### `#493a45` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 95
  `--color-AccentThree-800: #493a45;`

#### `#b5b9bf` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 98
  `--color-AccentFour-100: #b5b9bf;`

#### `#9aa1aa` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 99
  `--color-AccentFour-200: #9aa1aa;`

#### `#768395` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 100
  `--color-AccentFour-300: #768395;`

#### `#596677` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 101
  `--color-AccentFour-400: #596677;`

#### `#25303f` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 103
  `--color-AccentFour-600: #25303f;`

#### `#0d1825` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 104
  `--color-AccentFour-700: #0d1825;`

#### `#020815` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 105
  `--color-AccentFour-800: #020815;`

#### `#fdf5ff` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 108
  `--color-AccentFive-100: #fdf5ff;`

#### `#fcefff` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 109
  `--color-AccentFive-200: #fcefff;`

#### `#e2c8ee` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 110
  `--color-AccentFive-300: #e2c8ee;`

#### `#c1a9cd` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 111
  `--color-AccentFive-400: #c1a9cd;`

#### `#846c8e` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 113
  `--color-AccentFive-600: #846c8e;`

#### `#665070` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 114
  `--color-AccentFive-700: #665070;`

#### `#533d5c` (1 occurrences)

- **src\styles\themes\brand\BrandDefault.css** line 115
  `--color-AccentFive-800: #533d5c;`

#### `rgba(255,255,255,0.3)` (1 occurrences)

- **src\styles\themes\Preview\theme-cards.css** line 76
  `box-shadow: inset 0 1px 2px rgba(255,255,255,0.3);`

#### `rgba(255, 153, 200, 0.15)` (1 occurrences)

- **src\styles\tokens\gradients.css** line 49
  `--rainbow-hover-primary: rgba(255, 153, 200, 0.15);`

#### `rgba(174, 136, 191, 0.15)` (1 occurrences)

- **src\styles\tokens\gradients.css** line 50
  `--rainbow-hover-secondary: rgba(174, 136, 191, 0.15);`

#### `rgba(128, 225, 204, 0.15)` (1 occurrences)

- **src\styles\tokens\gradients.css** line 51
  `--rainbow-hover-accent: rgba(128, 225, 204, 0.15);`

#### `rgba(255, 248, 237, 0.8)` (1 occurrences)

- **src\styles\tokens\gradients.css** line 52
  `--rainbow-hover-cream: rgba(255, 248, 237, 0.8);`

#### `rgba(31, 38, 135, 0.37)` (1 occurrences)

- **src\styles\tokens\shadows.css** line 82
  `--glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);`

---

## 🔴 Hardcoded Colours By File

Files sorted by number of hardcoded colours (worst offenders first).

| File | Hardcoded Count | Types |
|------|----------------|-------|
| `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 136 | hex, hsl, named, rgb |
| `src\styles\themes\brand\BrandDefault.css` | 89 | hex |
| `src\styles\base\utilities.css` | 56 | hex, named |
| `docs\todo\TODO.md` | 53 | hex, named, rgb |
| `docs\Markdown Notes\accessibility-color-themes.md` | 52 | hex, named |
| `src\styles\a11y\pages\asset-detail.css` | 49 | hex |
| `docs\Brand\BRAND-PROFILE.json` | 46 | hex, named, rgb |
| `src\styles\components\presentation\ReaderNav.css` | 43 | named, rgb |
| `src\components\Grids\RelatedGrid.astro` | 32 | named, rgb |
| `src\styles\themes\Preview\coretokens.css` | 32 | hex |
| `src\scripts\ThemeTokenGen\color-theory-comparison.js` | 28 | hex, hsl, named, rgb |
| `src\styles\a11y\base\theme-overrides.css` | 25 | hex, named |
| `src\lib\emailit.ts` | 23 | hex, named, rgb |
| `src\styles\buttons\basic-button.css` | 22 | named |
| `src\scripts\ThemeTokenGen\brand-template.css` | 21 | hex |
| `src\styles\tokens\shadows.css` | 21 | named, rgb |
| `docs\Brand\COMPLETE-BRAND-SCHEMA.md` | 16 | hex |
| `files\example-a11y-cream-NEW.css` | 16 | hex, named |
| `files\example-BrandDefault-NEW.css` | 16 | hex, named |
| `src\scripts\ThemeTokenGen\preview-colors.js` | 16 | hex, named, rgb |
| `src\pages\api\contact.ts` | 15 | hex, named, rgb |
| `src\styles\a11y\components\masonry-grid.css` | 15 | hex, named, rgb |
| `docs\Markdown Notes\CSS-Tokens.md` | 14 | hex, named, rgb |
| `src\scripts\ThemeTokenGen\color-input.css` | 14 | hex, named |
| `src\lib\animation\particle-burst.ts` | 13 | hex, named, rgb |
| `src\styles\a11y\components\search-overlay.css` | 13 | hex |
| `src\styles\a11y\motion\reduced-motion.css` | 13 | hex, named |
| `src\styles\pages\service-detail.css` | 13 | hex, named, rgb |
| `src\styles\pages\asset-detail.css` | 12 | hex, rgb |
| `src\lib\animation\hero-morph.ts` | 11 | hex |
| `src\styles\themes\a11y\a11y-dark.css` | 11 | hex |
| `docs\reports\color-token-usage-report.md` | 10 | hex, named |
| `src\components\Presentation\Sections\TitleSection.astro` | 10 | named, rgb |
| `src\styles\a11y\components\switcher.css` | 10 | hex, named |
| `src\styles\tokens\gradients.css` | 10 | named, rgb |
| `src\components\Badge\Badge.astro` | 9 | named, rgb |
| `src\components\Grids\ForYouGrid.astro` | 9 | named, rgb |
| `src\styles\pages\services.css` | 9 | hex, named |
| `docs\Markdown Notes\Theme-Preview-System.md` | 8 | hex |
| `docs\reports\FIXES-APPLIED.md` | 8 | hex |
| `src\styles\components\search-results.css` | 8 | named |
| `src\styles\tokens\status.css` | 8 | hex, named |
| `src\components\ContactForm\Contact-Popup.astro` | 6 | named |
| `src\components\Presentation\Sections\FullWidthSection.astro` | 6 | named, rgb |
| `src\styles\a11y\visual\text-only.css` | 6 | hex, named |
| `src\styles\buttons\confetti-button.css` | 6 | hex, named |
| `src\styles\components\philosophy-flip-cards.css` | 6 | named, rgb |
| `src\styles\design\confetti.css` | 6 | named |
| `src\pages\search.astro` | 5 | named |
| `src\pages\services\[slug].astro` | 5 | hex, named |
| `src\styles\a11y\base\print.css` | 5 | hex, named |
| `src\styles\themes\a11y\a11y-cream.css` | 5 | hex, named |
| `src\styles\themes\a11y\a11y-deuteranopia.css` | 5 | hex, named |
| `src\styles\themes\a11y\a11y-high-contrast.css` | 5 | hex |
| `src\styles\themes\a11y\a11y-monochrome.css` | 5 | hex, named |
| `src\styles\themes\a11y\a11y-protanopia.css` | 5 | hex, named |
| `src\styles\themes\a11y\a11y-tritanopia.css` | 5 | hex, named |
| `docs\Markdown Notes\CSS-Standards.md` | 4 | hex, named |
| `docs\Markdown Notes\new hero.md` | 4 | hex, named |
| `src\components\Presentation\Sections\HeroSection.astro` | 4 | hex, named, rgb |
| `src\components\Sections\ShareSection.astro` | 4 | named |
| `src\styles\components\announcement-ticker.css` | 4 | named |
| `src\styles\components\toast.css` | 4 | hex |
| `src\components\A11y Panel\FontCard.astro` | 3 | rgb |
| `src\components\A11y Panel\PresetButton.astro` | 3 | rgb |
| `src\components\A11y Panel\ToggleCard.astro` | 3 | rgb |
| `src\components\Search\SearchOverlay.astro` | 3 | named, rgb |
| `src\pages\verify.astro` | 3 | named, rgb |
| `src\styles\a11y\components\step-card.css` | 3 | hex |
| `src\styles\a11y\visual\highlight-links.css` | 3 | named |
| `src\styles\components\hero-section.css` | 3 | named |
| `src\styles\components\masonry-card.css` | 3 | named |
| `src\styles\components\nav\GlassNav-base.css` | 3 | named |
| `src\styles\pages\checkout.css` | 3 | named |
| `src\styles\themes\Preview\theme-cards.css` | 3 | rgb |
| `src\components\Shop\MiniCart.astro` | 2 | hex, rgb |
| `src\Content\assets\franz-kline-presentation\index.md` | 2 | named |
| `src\scripts\ThemeTokenGen\simple-theme-gen.js` | 2 | hsl |
| `src\styles\a11y\base\screen-reader.css` | 2 | named |
| `src\styles\a11y\components\why-card.css` | 2 | hex |
| `src\styles\a11y\pages\services.css` | 2 | hex |
| `src\styles\components\a11y-panel.css` | 2 | rgb |
| `src\styles\components\nav\GlassNav-mobile.css` | 2 | named |
| `src\styles\design\GlowTokens.css` | 2 | named |
| `src\styles\tokens\index.css` | 2 | named |
| `docs\Brand\WWAS BRAND NOTES.md` | 1 | named |
| `docs\Markdown Notes\Button-System.md` | 1 | named |
| `src\components\A11y Panel\Stepper.astro` | 1 | rgb |
| `src\components\Canvas\RevealCanvas.astro` | 1 | hex |
| `src\components\Cards\CompactToolCard.astro` | 1 | rgb |
| `src\components\Cards\ProjectSpecCard.astro` | 1 | rgb |
| `src\components\Cards\SpecCard.astro` | 1 | rgb |
| `src\components\Cards\StepCard.astro` | 1 | named |
| `src\components\Checkout\DownloadSummary.astro` | 1 | rgb |
| `src\components\Insights\InsightHeader.astro` | 1 | named |
| `src\components\Presentation\Sections\EndSection.astro` | 1 | named |
| `src\components\Product\ProductInfo.astro` | 1 | named |
| `src\components\Typography\SectionTitle.astro` | 1 | named |
| `src\lib\animation\scroll-color-background.ts` | 1 | rgb |
| `src\pages\showcase\section-titles.astro` | 1 | named |
| `src\scripts\ThemeSwitcher.js` | 1 | hex |
| `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 1 | hex |
| `src\styles\a11y\base\utilities.css` | 1 | rgb |
| `src\styles\components\editorial-layout.css` | 1 | named |
| `src\styles\components\nav\GlassNav-expandable.css` | 1 | named |
| `src\styles\pages\legal.css` | 1 | rgb |

---

## 🟠 Inline Styles with Colours

These should ideally use CSS classes with tokens instead.

- **src\components\Canvas\RevealCanvas.astro** line 206
  `#000000`
- **src\lib\emailit.ts** line 398
  `font-size: 13px; color: ${BRAND_COLORS.textLight};`
- **src\lib\emailit.ts** line 399
  `word-break: break-all; font-size: 13px; color: ${BRAND_COLORS.textLight}; background: ${BRAND_COLORS.highlight}; padding`
- **src\lib\emailit.ts** line 445
  `color: ${BRAND_COLORS.textLight};`
- **src\lib\emailit.ts** line 487
  `color: ${BRAND_COLORS.textLight};`
- **src\lib\emailit.ts** line 534
  `color: ${BRAND_COLORS.textLight};`
- **src\pages\api\contact.ts** line 317
  `font-size: 13px; color: ${BRAND_COLORS.textLight}; margin-bottom: 8px;`
- **src\pages\api\contact.ts** line 321
  `color: ${BRAND_COLORS.primary};`
- **src\pages\api\contact.ts** line 321
  `color: ${BRAND_COLORS.primary};`
- **src\pages\api\contact.ts** line 322
  `color: ${BRAND_COLORS.textLight};`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 114
  `background-color: ${baseColor};`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 120
  `background-color: ${scale[pos]};`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 369
  `background-color: ${primaryColor};`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 762
  `font-size: 0.85rem; font-weight: 600; color: var(--color-Text-700); margin-bottom: 0.5rem; display: block;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 769
  `font-size: 0.85rem; font-weight: 600; color: var(--color-Text-700); margin-bottom: 0.5rem; display: block;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 777
  `padding: 0.75rem 1rem; border-radius: 10px; border: 2px solid var(--color-Neutral-400); font-size: 1rem; flex: 1; min-wi`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 794
  `background: #999; flex: 1;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 795
  `background: #4A90E2; color: white; flex: 0.5; min-width: 150px;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 796
  `background: #E74C3C; color: white; flex: 0.5; min-width: 150px;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 840
  `background: #4A90E2;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1535
  `background-color: ${c.color};`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1735
  `background-color: ${color};`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 125
  `font-size: 0.9rem; color: #555;`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 151
  `background: ${hex}; color: ${textColor};`

---

## 🟡 Tokens Defined But Never Used

These tokens exist in your codebase but nothing references them.
They are candidates for removal (dead code).

| Token | Value | Defined In | Line |
|-------|-------|-----------|------|
| `--a11y-hc-border` | `var(--a11y-hc-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 142 |
| `--bg` | `var(--color-Background-50)` | `docs\Markdown Notes\accessibility-color-themes.md` | 20 |
| `--bg` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 242 |
| `--border-focus` | `var(--color-Info-500)` | `docs\todo\TODO.md` | 369 |
| `--border-medium` | `var(--color-Neutral-400)` | `docs\todo\TODO.md` | 366 |
| `--border-strong` | `var(--color-Neutral-600)` | `docs\todo\TODO.md` | 367 |
| `--border-width-4` | `4px` | `src\styles\tokens\spacing.css` | 48 |
| `--brand-accent1` | `#9C8579` | `src\scripts\ThemeTokenGen\brand-template.css` | 13 |
| `--brand-accent1` | `#9C8579` | `src\scripts\ThemeTokenGen\brand-template.css` | 64 |
| `--brand-accent1` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 29 |
| `--brand-accent1` | `#8ac7b2` | `src\scripts\ThemeTokenGen\color-input.css` | 77 |
| `--brand-accent1` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 24 |
| `--brand-accent2` | `#8390b5` | `src\scripts\ThemeTokenGen\brand-template.css` | 68 |
| `--brand-accent2` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 32 |
| `--brand-accent2` | `#c78a9f` | `src\scripts\ThemeTokenGen\color-input.css` | 78 |
| `--brand-accent2` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 32 |
| `--brand-accent3` | `#978692` | `src\scripts\ThemeTokenGen\brand-template.css` | 72 |
| `--brand-accent3` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 33 |
| `--brand-accent3` | `#8abdc7` | `src\scripts\ThemeTokenGen\color-input.css` | 79 |
| `--brand-accent3` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 33 |
| `--brand-accent4` | `#3e4a5a` | `src\scripts\ThemeTokenGen\brand-template.css` | 76 |
| `--brand-accent4` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 36 |
| `--brand-accent4` | `#bdc78a` | `src\scripts\ThemeTokenGen\color-input.css` | 80 |
| `--brand-accent4` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 41 |
| `--brand-accent5` | `#a28aad` | `src\scripts\ThemeTokenGen\brand-template.css` | 80 |
| `--brand-accent5` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 39 |
| `--brand-accent5` | `#938ac7` | `src\scripts\ThemeTokenGen\color-input.css` | 82 |
| `--brand-accent5` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 42 |
| `--brand-background` | `#EEEBE2` | `src\scripts\ThemeTokenGen\brand-template.css` | 43 |
| `--brand-background` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 46 |
| `--brand-background` | `#f2efd4` | `src\scripts\ThemeTokenGen\color-input.css` | 74 |
| `--brand-background` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 47 |
| `--brand-background-dark` | `#394e43` | `src\scripts\ThemeTokenGen\brand-template.css` | 48 |
| `--brand-background-dark` | `#2a3328` | `src\scripts\ThemeTokenGen\color-input.css` | 50 |
| `--brand-background-dark` | `#0e3f2e` | `src\scripts\ThemeTokenGen\color-input.css` | 83 |
| `--brand-background-dark` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 50 |
| `--brand-c-bg-dark` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 33 |
| `--brand-c-bg-dark` | `#394e43` | `files\example-BrandDefault-NEW.css` | 33 |
| `--brand-c-bg-light` | `#ddd9d3` | `files\example-a11y-cream-NEW.css` | 32 |
| `--brand-c-bg-light` | `#ffffff` | `files\example-BrandDefault-NEW.css` | 32 |
| `--brand-c-neutral` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 26 |
| `--brand-c-neutral` | `#c2bdb8` | `files\example-BrandDefault-NEW.css` | 26 |
| `--brand-c-neutral-dark` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 27 |
| `--brand-c-neutral-dark` | `#393531` | `files\example-BrandDefault-NEW.css` | 27 |
| `--brand-c-neutral-light` | `#ddd9d3` | `files\example-a11y-cream-NEW.css` | 25 |
| `--brand-c-neutral-light` | `#e0dedb` | `files\example-BrandDefault-NEW.css` | 25 |
| `--brand-c-primary-dark` | `#8b7355` | `files\example-a11y-cream-NEW.css` | 14 |
| `--brand-c-primary-dark` | `#556a50` | `files\example-BrandDefault-NEW.css` | 14 |
| `--brand-c-primary-light` | `#8b7355` | `files\example-a11y-cream-NEW.css` | 13 |
| `--brand-c-primary-light` | `#cee6c8` | `files\example-BrandDefault-NEW.css` | 13 |
| `--brand-c-secondary` | `#6b8e7a` | `files\example-a11y-cream-NEW.css` | 8 |
| `--brand-c-secondary` | `#c4907c` | `files\example-BrandDefault-NEW.css` | 8 |
| `--brand-c-secondary-dark` | `#6b8e7a` | `files\example-a11y-cream-NEW.css` | 20 |
| `--brand-c-secondary-dark` | `#855543` | `files\example-BrandDefault-NEW.css` | 20 |
| `--brand-c-secondary-light` | `#6b8e7a` | `files\example-a11y-cream-NEW.css` | 19 |
| `--brand-c-secondary-light` | `#ffcfba` | `files\example-BrandDefault-NEW.css` | 19 |
| `--brand-c-text-dark` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 39 |
| `--brand-c-text-dark` | `#262626` | `files\example-BrandDefault-NEW.css` | 39 |
| `--brand-c-text-light` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 38 |
| `--brand-c-text-light` | `#777777` | `files\example-BrandDefault-NEW.css` | 38 |
| `--brand-neutral` | `#FDF8F3` | `src\scripts\ThemeTokenGen\brand-template.css` | 60 |
| `--brand-neutral` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 58 |
| `--brand-neutral` | `#c7948a` | `src\scripts\ThemeTokenGen\color-input.css` | 81 |
| `--brand-neutral` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 58 |
| `--brand-secondary` | `auto` | `src\scripts\ThemeTokenGen\brand-template.css` | 10 |
| `--brand-secondary` | `#C4907C` | `src\scripts\ThemeTokenGen\brand-template.css` | 38 |
| `--brand-secondary` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 28 |
| `--brand-secondary` | `#b9a26e` | `src\scripts\ThemeTokenGen\color-input.css` | 76 |
| `--brand-secondary` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 23 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `files\example-a11y-cream-NEW.css` | 48 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `files\example-BrandDefault-NEW.css` | 48 |
| `--btn-ghost-text` | `var(--a11y-cream-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 146 |
| `--btn-ghost-text` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 148 |
| `--btn-ghost-text` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 146 |
| `--btn-ghost-text` | `var(--a11y-hc-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 148 |
| `--btn-ghost-text` | `var(--a11y-mono-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 146 |
| `--btn-ghost-text` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 146 |
| `--btn-ghost-text` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 146 |
| `--btn-icon-color` | `${iconColor` | `src\components\Button\Button.astro` | 81 |
| `--btn-icon-hover` | `${iconHoverColor` | `src\components\Button\Button.astro` | 82 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `files\example-a11y-cream-NEW.css` | 47 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `files\example-BrandDefault-NEW.css` | 47 |
| `--btn-outline-text` | `var(--a11y-cream-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 145 |
| `--btn-outline-text` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 147 |
| `--btn-outline-text` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 145 |
| `--btn-outline-text` | `var(--a11y-hc-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 147 |
| `--btn-outline-text` | `var(--a11y-mono-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 145 |
| `--btn-outline-text` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 145 |
| `--btn-outline-text` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 145 |
| `--btn-text-hover` | `${textHoverColor` | `src\components\Button\Button.astro` | 80 |
| `--color-Background-600` | `#5a5754`** (line 41)` | `docs\reports\FIXES-APPLIED.md` | 56 |
| `--color-Background-600` | `#5a5754` | `src\styles\themes\brand\BrandDefault.css` | 41 |
| `--color-Background-700` | `#3e3b39`** (line 42)` | `docs\reports\FIXES-APPLIED.md` | 57 |
| `--color-Background-700` | `#3e3b39` | `src\styles\themes\brand\BrandDefault.css` | 42 |
| `--color-BackgroundDark-600` | `oklch(0.13 0.02 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 67 |
| `--color-BackgroundDark-600` | `oklch(0.40 0.04 45)` | `docs\Markdown Notes\accessibility-color-themes.md` | 143 |
| `--color-BackgroundDark-600` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 58 |
| `--color-BackgroundDark-600` | `var(--a11y-dark-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 61 |
| `--color-BackgroundDark-600` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 58 |
| `--color-BackgroundDark-600` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 58 |
| `--color-BackgroundDark-600` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 58 |
| `--color-BackgroundDark-600` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 58 |
| `--color-BackgroundDark-600` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 58 |
| `--color-BackgroundDark-700` | `oklch(0.11 0.015 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 68 |
| `--color-BackgroundDark-700` | `oklch(0.34 0.04 42)` | `docs\Markdown Notes\accessibility-color-themes.md` | 144 |
| `--color-BackgroundDark-700` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 59 |
| `--color-BackgroundDark-700` | `var(--a11y-dark-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 62 |
| `--color-BackgroundDark-700` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 59 |
| `--color-BackgroundDark-700` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 59 |
| `--color-BackgroundDark-700` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 59 |
| `--color-BackgroundDark-700` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 59 |
| `--color-BackgroundDark-700` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 59 |
| `--color-BackgroundDark-800` | `oklch(0.095 0.012 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 69 |
| `--color-BackgroundDark-800` | `oklch(0.28 0.03 40)` | `docs\Markdown Notes\accessibility-color-themes.md` | 145 |
| `--color-BackgroundDark-800` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 60 |
| `--color-BackgroundDark-800` | `var(--a11y-dark-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 63 |
| `--color-BackgroundDark-800` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 60 |
| `--color-BackgroundDark-800` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 60 |
| `--color-BackgroundDark-800` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 60 |
| `--color-BackgroundDark-800` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 60 |
| `--color-BackgroundDark-800` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 60 |
| `--color-BackgroundDark-900` | `oklch(0.08 0.010 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 70 |
| `--color-BackgroundDark-900` | `oklch(0.22 0.03 35)` | `docs\Markdown Notes\accessibility-color-themes.md` | 146 |
| `--color-BackgroundDark-900` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 61 |
| `--color-BackgroundDark-900` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 61 |
| `--color-BackgroundDark-900` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 61 |
| `--color-BackgroundDark-900` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 61 |
| `--color-BackgroundDark-900` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 61 |
| `--color-BackgroundDark-900` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 61 |
| `--color-Info-100` | `${toOKLCH(chroma.hsl(215, 0.4 * satAdjust, 0.92 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1941 |
| `--color-Info-200` | `${toOKLCH(chroma.hsl(215, 0.6 * satAdjust, 0.80 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1942 |
| `--color-Secondary-900` | `#5a3420` | `docs\reports\color-token-usage-report.md` | 193 |
| `--color-Secondary-900` | `#5a3420` | `docs\reports\color-token-usage-report.md` | 648 |
| `--color-Secondary-900` | `#5a3420` | `docs\reports\color-token-usage-report.md` | 691 |
| `--color-Secondary-900` | `#5a3420`** (line 32)` | `docs\reports\FIXES-APPLIED.md` | 12 |
| `--color-Secondary-900` | `#5a3420` | `docs\todo\TODO.md` | 257 |
| `--color-Secondary-900` | `#5a3420` | `src\styles\themes\brand\BrandDefault.css` | 32 |
| `--dropdown-hover-bg` | `var(--color-Primary-100)` | `src\styles\buttons\dropdown-tokens.css` | 9 |
| `--dropdown-hover-text` | `var(--color-Primary-800)` | `src\styles\buttons\dropdown-tokens.css` | 10 |
| `--error` | `var(--color-Error)` | `docs\Markdown Notes\accessibility-color-themes.md` | 40 |
| `--feedback-error-border` | `var(--color-Error)` | `docs\todo\TODO.md` | 384 |
| `--feedback-error-text` | `#7f1d1d` | `docs\todo\TODO.md` | 383 |
| `--feedback-success-border` | `#10b981` | `docs\todo\TODO.md` | 381 |
| `--feedback-success-text` | `#065f46` | `docs\todo\TODO.md` | 380 |
| `--feedback-warning-bg` | `var(--color-Warning)` | `docs\todo\TODO.md` | 385 |
| `--feedback-warning-text` | `#92400e` | `docs\todo\TODO.md` | 386 |
| `--font-secondary` | `'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | `src\styles\tokens\typography.css` | 14 |
| `--form-bg` | `var(--color-White)` | `docs\todo\TODO.md` | 389 |
| `--form-border` | `var(--color-Neutral-300)` | `docs\todo\TODO.md` | 390 |
| `--form-border-error` | `var(--color-Error)` | `docs\todo\TODO.md` | 393 |
| `--form-border-focus` | `var(--color-Primary-500)` | `docs\todo\TODO.md` | 392 |
| `--form-border-hover` | `var(--color-Neutral-400)` | `docs\todo\TODO.md` | 391 |
| `--form-border-success` | `var(--color-Success)` | `docs\todo\TODO.md` | 394 |
| `--form-invalid-bg` | `color-mix(in oklch, var(--feedback-error-bg) 5%, transparent)` | `docs\todo\TODO.md` | 395 |
| `--form-valid-bg` | `color-mix(in oklch, var(--feedback-success-bg) 5%, transparent)` | `docs\todo\TODO.md` | 396 |
| `--glass-card-bg` | `color-mix(in oklch, var(--color-Background-50) 15%, transparent)` | `src\styles\tokens\shadows.css` | 96 |
| `--glass-card-bg` | `color-mix(in oklch, var(--color-Background-900) 25%, transparent)` | `src\styles\tokens\shadows.css` | 107 |
| `--glass-card-border` | `color-mix(in oklch, var(--color-Background-50) 18%, transparent)` | `src\styles\tokens\shadows.css` | 99 |
| `--glass-card-border` | `color-mix(in oklch, var(--color-Background-50) 10%, transparent)` | `src\styles\tokens\shadows.css` | 108 |
| `--glass-card-shadow` | `0 8px 24px 0 color-mix(in oklch, var(--color-Primary-700) 30%, transparent)` | `src\styles\tokens\shadows.css` | 98 |
| `--glass-overlay-bg` | `color-mix(in oklch, var(--color-Background-50) 5%, transparent)` | `src\styles\tokens\shadows.css` | 91 |
| `--glass-overlay-bg` | `color-mix(in oklch, var(--color-Background-900) 10%, transparent)` | `src\styles\tokens\shadows.css` | 106 |
| `--glass-overlay-shadow` | `0 4px 16px 0 color-mix(in oklch, var(--color-Primary-700) 20%, transparent)` | `src\styles\tokens\shadows.css` | 93 |
| `--glass-surface-bg` | `color-mix(in oklch, var(--color-Background-50) 10%, transparent)` | `src\styles\tokens\shadows.css` | 86 |
| `--glass-surface-bg` | `color-mix(in oklch, var(--color-Background-900) 20%, transparent)` | `src\styles\tokens\shadows.css` | 105 |
| `--glass-surface-blur` | `12px` | `src\styles\tokens\shadows.css` | 87 |
| `--glass-surface-shadow` | `0 8px 32px 0 color-mix(in oklch, var(--color-Primary-700) 37%, transparent)` | `src\styles\tokens\shadows.css` | 88 |
| `--glint-gradient-strong` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)` | `src\styles\tokens\shadows.css` | 74 |
| `--glint-gradient-subtle` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)` | `src\styles\tokens\shadows.css` | 75 |
| `--gradient-accent-border` | `linear-gradient(90deg, var(--color-Primary-600) 0%, var(--color-Secondary-600) 100%)` | `src\styles\tokens\gradients.css` | 226 |
| `--gradient-accent1-glow` | `linear-gradient(135deg, var(--color-AccentOne-200) 0%, var(--color-AccentOne-400) 30%, var(--color-AccentOne-600) 60%, var(--color-AccentOne-800) 100%)` | `src\styles\tokens\gradients.css` | 103 |
| `--gradient-accent1-intense` | `linear-gradient(135deg, var(--color-AccentOne-700) 0%, var(--color-AccentOne-800) 100%)` | `src\styles\tokens\gradients.css` | 102 |
| `--gradient-accent1-light` | `linear-gradient(135deg, var(--color-AccentOne-200) 0%, var(--color-AccentOne-400) 100%)` | `src\styles\tokens\gradients.css` | 101 |
| `--gradient-accent1-soft` | `linear-gradient(135deg, var(--color-AccentOne-400) 0%, var(--color-AccentOne-600) 100%)` | `src\styles\tokens\gradients.css` | 100 |
| `--gradient-accent2-glow` | `linear-gradient(135deg, var(--color-AccentTwo-200) 0%, var(--color-AccentTwo-400) 30%, var(--color-AccentTwo-600) 60%, var(--color-AccentTwo-800) 100%)` | `src\styles\tokens\gradients.css` | 110 |
| `--gradient-accent2-intense` | `linear-gradient(135deg, var(--color-AccentTwo-700) 0%, var(--color-AccentTwo-800) 100%)` | `src\styles\tokens\gradients.css` | 109 |
| `--gradient-accent2-light` | `linear-gradient(135deg, var(--color-AccentTwo-200) 0%, var(--color-AccentTwo-400) 100%)` | `src\styles\tokens\gradients.css` | 108 |
| `--gradient-accent2-soft` | `linear-gradient(135deg, var(--color-AccentTwo-400) 0%, var(--color-AccentTwo-600) 100%)` | `src\styles\tokens\gradients.css` | 107 |
| `--gradient-accent3` | `linear-gradient(135deg, var(--color-AccentThree-600) 0%, var(--color-AccentThree-800) 100%)` | `src\styles\tokens\gradients.css` | 113 |
| `--gradient-accent3-glow` | `linear-gradient(135deg, var(--color-AccentThree-200) 0%, var(--color-AccentThree-400) 30%, var(--color-AccentThree-600) 60%, var(--color-AccentThree-800) 100%)` | `src\styles\tokens\gradients.css` | 117 |
| `--gradient-accent3-intense` | `linear-gradient(135deg, var(--color-AccentThree-700) 0%, var(--color-AccentThree-800) 100%)` | `src\styles\tokens\gradients.css` | 116 |
| `--gradient-accent3-light` | `linear-gradient(135deg, var(--color-AccentThree-200) 0%, var(--color-AccentThree-400) 100%)` | `src\styles\tokens\gradients.css` | 115 |
| `--gradient-accent3-soft` | `linear-gradient(135deg, var(--color-AccentThree-400) 0%, var(--color-AccentThree-600) 100%)` | `src\styles\tokens\gradients.css` | 114 |
| `--gradient-accent4` | `linear-gradient(135deg, var(--color-AccentFour-600) 0%, var(--color-AccentFour-800) 100%)` | `src\styles\tokens\gradients.css` | 120 |
| `--gradient-accent4-glow` | `linear-gradient(135deg, var(--color-AccentFour-200) 0%, var(--color-AccentFour-400) 30%, var(--color-AccentFour-600) 60%, var(--color-AccentFour-800) 100%)` | `src\styles\tokens\gradients.css` | 124 |
| `--gradient-accent4-intense` | `linear-gradient(135deg, var(--color-AccentFour-700) 0%, var(--color-AccentFour-800) 100%)` | `src\styles\tokens\gradients.css` | 123 |
| `--gradient-accent4-light` | `linear-gradient(135deg, var(--color-AccentFour-200) 0%, var(--color-AccentFour-400) 100%)` | `src\styles\tokens\gradients.css` | 122 |
| `--gradient-accent4-soft` | `linear-gradient(135deg, var(--color-AccentFour-400) 0%, var(--color-AccentFour-600) 100%)` | `src\styles\tokens\gradients.css` | 121 |
| `--gradient-accent5` | `linear-gradient(135deg, var(--color-AccentFive-600) 0%, var(--color-AccentFive-800) 100%)` | `src\styles\tokens\gradients.css` | 127 |
| `--gradient-accent5-glow` | `linear-gradient(135deg, var(--color-AccentFive-200) 0%, var(--color-AccentFive-400) 30%, var(--color-AccentFive-600) 60%, var(--color-AccentFive-800) 100%)` | `src\styles\tokens\gradients.css` | 131 |
| `--gradient-accent5-intense` | `linear-gradient(135deg, var(--color-AccentFive-700) 0%, var(--color-AccentFive-800) 100%)` | `src\styles\tokens\gradients.css` | 130 |
| `--gradient-accent5-light` | `linear-gradient(135deg, var(--color-AccentFive-200) 0%, var(--color-AccentFive-400) 100%)` | `src\styles\tokens\gradients.css` | 129 |
| `--gradient-accent5-soft` | `linear-gradient(135deg, var(--color-AccentFive-400) 0%, var(--color-AccentFive-600) 100%)` | `src\styles\tokens\gradients.css` | 128 |
| `--gradient-background-glow` | `linear-gradient(135deg, var(--color-Background-50) 0%, var(--color-Background-200) 30%, var(--color-Background-300) 60%, var(--color-Neutral-300) 100%)` | `src\styles\tokens\gradients.css` | 183 |
| `--gradient-background-radial` | `radial-gradient(circle at center, var(--color-Background-50) 0%, var(--color-Background-300) 100%)` | `src\styles\tokens\gradients.css` | 186 |
| `--gradient-background-radial-complex` | `radial-gradient(ellipse at 40% 60%, var(--color-Background-50) 0%, var(--color-Background-200) 40%, var(--color-Neutral-200) 80%, var(--color-Neutral-300) 100%)` | `src\styles\tokens\gradients.css` | 188 |
| `--gradient-background-radial-soft` | `radial-gradient(circle at 30% 30%, var(--color-Background-50) 0%, var(--color-Background-200) 50%, var(--color-Background-400) 100%)` | `src\styles\tokens\gradients.css` | 187 |
| `--gradient-background-rainbow` | `linear-gradient(135deg, var(--color-Background-50) 0%, var(--color-Background-100) 25%, var(--color-Background-200) 50%, var(--color-Background-300) 75%, var(--color-Background-400) 100%)` | `src\styles\tokens\gradients.css` | 181 |
| `--gradient-background-soft` | `linear-gradient(135deg, var(--color-Background-100) 0%, var(--color-Background-300) 100%)` | `src\styles\tokens\gradients.css` | 176 |
| `--gradient-background-wave` | `linear-gradient(90deg, var(--color-Background-100) 0%, var(--color-Background-300) 20%, var(--color-Background-200) 40%, var(--color-Background-400) 60%, var(--color-Background-300) 80%, var(--color-Background-500) 100%)` | `src\styles\tokens\gradients.css` | 182 |
| `--gradient-brand-burst` | `radial-gradient(ellipse at 30% 30%, var(--color-Primary-300) 0%, var(--color-Secondary-400) 30%, var(--color-Background-200) 60%, var(--color-Primary-600) 100%)` | `src\styles\tokens\gradients.css` | 156 |
| `--gradient-brand-radial` | `radial-gradient(circle at center, var(--color-Background-50) 0%, var(--color-Primary-400) 40%, var(--color-Secondary-600) 80%, var(--color-Background-500) 100%)` | `src\styles\tokens\gradients.css` | 155 |
| `--gradient-btn-ghost-hover` | `linear-gradient(135deg, color-mix(in oklch, var(--color-Text-700) 10%, transparent) 0%, color-mix(in oklch, var(--color-Text-700) 20%, transparent) 100%)` | `src\styles\tokens\gradients.css` | 201 |
| `--gradient-deep-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 523 |
| `--gradient-deep-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 865 |
| `--gradient-deep-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 531 |
| `--gradient-deep-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 875 |
| `--gradient-deep-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 539 |
| `--gradient-deep-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 885 |
| `--gradient-deep-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 547 |
| `--gradient-deep-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 895 |
| `--gradient-deep-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 555 |
| `--gradient-deep-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 905 |
| `--gradient-deep-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 507 |
| `--gradient-deep-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 844 |
| `--gradient-deep-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 515 |
| `--gradient-deep-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 855 |
| `--gradient-error` | `linear-gradient(135deg, var(--color-Danger) 0%, color-mix(in oklch, var(--color-Danger) 70%, black) 100%)` | `src\styles\tokens\gradients.css` | 235 |
| `--gradient-header-subtle` | `linear-gradient(180deg, var(--color-Background-300) 0%, var(--color-Background-200) 100%)` | `src\styles\tokens\gradients.css` | 208 |
| `--gradient-light-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 379 |
| `--gradient-light-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 387 |
| `--gradient-light-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 395 |
| `--gradient-light-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 403 |
| `--gradient-light-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 411 |
| `--gradient-light-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 363 |
| `--gradient-light-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 371 |
| `--gradient-overlay-dark` | `linear-gradient(180deg, transparent 0%, color-mix(in oklch, var(--color-Background-900) 70%, transparent) 100%)` | `src\styles\tokens\gradients.css` | 223 |
| `--gradient-overlay-light` | `linear-gradient(180deg, color-mix(in oklch, var(--color-Background-50) 90%, transparent) 0%, transparent 100%)` | `src\styles\tokens\gradients.css` | 224 |
| `--gradient-pastel-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 658 |
| `--gradient-pastel-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 668 |
| `--gradient-pastel-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 678 |
| `--gradient-pastel-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 688 |
| `--gradient-pastel-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 698 |
| `--gradient-pastel-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 637 |
| `--gradient-pastel-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 648 |
| `--gradient-primary-glow` | `linear-gradient(135deg, var(--color-Primary-200) 0%, var(--color-Primary-400) 30%, var(--color-Primary-600) 60%, var(--color-Primary-800) 100%)` | `src\styles\tokens\gradients.css` | 67 |
| `--gradient-primary-intense` | `linear-gradient(135deg, var(--color-Primary-700) 0%, var(--color-Primary-900) 100%)` | `src\styles\tokens\gradients.css` | 62 |
| `--gradient-primary-radial` | `radial-gradient(circle at 30% 40%, var(--color-Primary-400) 0%, var(--color-Primary-800) 100%)` | `src\styles\tokens\gradients.css` | 70 |
| `--gradient-primary-radial-center` | `radial-gradient(circle at center, var(--color-Primary-300) 0%, var(--color-Primary-600) 50%, var(--color-Primary-900) 100%)` | `src\styles\tokens\gradients.css` | 71 |
| `--gradient-primary-radial-complex` | `radial-gradient(ellipse at 20% 30%, var(--color-Primary-200) 0%, var(--color-Primary-500) 40%, var(--color-Primary-700) 80%, var(--color-Primary-900) 100%)` | `src\styles\tokens\gradients.css` | 72 |
| `--gradient-primary-rainbow` | `linear-gradient(135deg, var(--color-Primary-300) 0%, var(--color-Primary-500) 25%, var(--color-Primary-600) 50%, var(--color-Primary-700) 75%, var(--color-Primary-900) 100%)` | `src\styles\tokens\gradients.css` | 65 |
| `--gradient-primary-wave` | `linear-gradient(90deg, var(--color-Primary-400) 0%, var(--color-Primary-600) 20%, var(--color-Primary-500) 40%, var(--color-Primary-700) 60%, var(--color-Primary-600) 80%, var(--color-Primary-800) 100%)` | `src\styles\tokens\gradients.css` | 66 |
| `--gradient-rainbow-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 282 |
| `--gradient-rainbow-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 295 |
| `--gradient-rainbow-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 308 |
| `--gradient-rainbow-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 321 |
| `--gradient-rainbow-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 334 |
| `--gradient-rainbow-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 256 |
| `--gradient-rainbow-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 269 |
| `--gradient-secondary-glow` | `linear-gradient(135deg, var(--color-Secondary-100) 0%, var(--color-Secondary-400) 30%, var(--color-Secondary-600) 60%, var(--color-Secondary-800) 100%)` | `src\styles\tokens\gradients.css` | 87 |
| `--gradient-secondary-intense` | `linear-gradient(135deg, var(--color-Secondary-700) 0%, var(--color-Secondary-800) 100%)` | `src\styles\tokens\gradients.css` | 82 |
| `--gradient-secondary-light` | `linear-gradient(135deg, var(--color-Secondary-200) 0%, var(--color-Secondary-400) 100%)` | `src\styles\tokens\gradients.css` | 81 |
| `--gradient-secondary-radial` | `radial-gradient(circle at 70% 30%, var(--color-Secondary-400) 0%, var(--color-Secondary-800) 100%)` | `src\styles\tokens\gradients.css` | 90 |
| `--gradient-secondary-radial-center` | `radial-gradient(circle at center, var(--color-Secondary-200) 0%, var(--color-Secondary-500) 50%, var(--color-Secondary-800) 100%)` | `src\styles\tokens\gradients.css` | 91 |
| `--gradient-secondary-radial-complex` | `radial-gradient(ellipse at 80% 20%, var(--color-Secondary-100) 0%, var(--color-Secondary-400) 40%, var(--color-Secondary-600) 80%, var(--color-Secondary-800) 100%)` | `src\styles\tokens\gradients.css` | 92 |
| `--gradient-secondary-rainbow` | `linear-gradient(135deg, var(--color-Secondary-200) 0%, var(--color-Secondary-400) 25%, var(--color-Secondary-500) 50%, var(--color-Secondary-600) 75%, var(--color-Secondary-800) 100%)` | `src\styles\tokens\gradients.css` | 85 |
| `--gradient-secondary-wave` | `linear-gradient(90deg, var(--color-Secondary-300) 0%, var(--color-Secondary-500) 20%, var(--color-Secondary-400) 40%, var(--color-Secondary-600) 60%, var(--color-Secondary-500) 80%, var(--color-Secondary-700) 100%)` | `src\styles\tokens\gradients.css` | 86 |
| `--gradient-soft-brand` | `linear-gradient(180deg, var(--color-Background-100) 0%, var(--color-Primary-300) 30%, var(--color-Secondary-400) 70%, var(--color-Background-300) 100%)` | `src\styles\tokens\gradients.css` | 148 |
| `--gradient-subtle` | `linear-gradient(180deg, var(--color-Background-300) 0%, var(--color-Background-100) 100%)` | `src\styles\tokens\gradients.css` | 168 |
| `--gradient-success` | `linear-gradient(135deg, var(--color-Success) 0%, color-mix(in oklch, var(--color-Success) 70%, black) 100%)` | `src\styles\tokens\gradients.css` | 233 |
| `--gradient-vivid-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 451 |
| `--gradient-vivid-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 761 |
| `--gradient-vivid-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 459 |
| `--gradient-vivid-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 771 |
| `--gradient-vivid-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 467 |
| `--gradient-vivid-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 781 |
| `--gradient-vivid-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 475 |
| `--gradient-vivid-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 791 |
| `--gradient-vivid-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 483 |
| `--gradient-vivid-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 801 |
| `--gradient-vivid-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 435 |
| `--gradient-vivid-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 740 |
| `--gradient-vivid-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 443 |
| `--gradient-vivid-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 751 |
| `--gradient-warning` | `linear-gradient(135deg, var(--color-Warning) 0%, color-mix(in oklch, var(--color-Warning) 70%, black) 100%)` | `src\styles\tokens\gradients.css` | 234 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `files\example-a11y-cream-NEW.css` | 45 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `files\example-BrandDefault-NEW.css` | 45 |
| `--hero-overlay-color` | `var(--a11y-cream-c-bg)` | `src\styles\themes\a11y\a11y-cream.css` | 143 |
| `--hero-overlay-color` | `var(--a11y-dark-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 145 |
| `--hero-overlay-color` | `var(--a11y-deuter-c-bg)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 143 |
| `--hero-overlay-color` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 145 |
| `--hero-overlay-color` | `var(--a11y-mono-c-bg)` | `src\styles\themes\a11y\a11y-monochrome.css` | 143 |
| `--hero-overlay-color` | `var(--a11y-proto-c-bg)` | `src\styles\themes\a11y\a11y-protanopia.css` | 143 |
| `--hero-overlay-color` | `var(--a11y-trit-c-bg)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 143 |
| `--interactive-disabled-bg` | `var(--color-Neutral-100)` | `docs\todo\TODO.md` | 375 |
| `--interactive-disabled-text` | `var(--color-Text-400)` | `docs\todo\TODO.md` | 376 |
| `--interactive-primary-active` | `var(--color-Primary-700)` | `docs\todo\TODO.md` | 374 |
| `--interactive-primary-hover` | `var(--color-Primary-600)` | `docs\todo\TODO.md` | 373 |
| `--linkHover` | `var(--color-Secondary-400)` | `docs\Markdown Notes\accessibility-color-themes.md` | 31 |
| `--linkHover` | `oklch(0.80 0.10 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 122 |
| `--linkHover` | `oklch(0.34 0.10 45)` | `docs\Markdown Notes\accessibility-color-themes.md` | 197 |
| `--linkHover` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 247 |
| `--linkHover` | `oklch(0.92 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 342 |
| `--linkVisited` | `color-mix(in oklch, var(--link) 60%, var(--text) 40%)` | `docs\Markdown Notes\accessibility-color-themes.md` | 32 |
| `--pause-hover` | `hover {` | `src\styles\components\announcement-ticker.css` | 117 |
| `--primary` | `hover {` | `src\components\Presentation\Sections\TitleSection.astro` | 254 |
| `--primary` | `hover .title-section__btn-icon {` | `src\components\Presentation\Sections\TitleSection.astro` | 276 |
| `--print-background` | `var(--color-White)`` | `docs\todo\TODO.md` | 488 |
| `--print-muted` | `var(--color-Neutral-500)`` | `docs\todo\TODO.md` | 489 |
| `--print-text` | `var(--color-Black)`` | `docs\todo\TODO.md` | 487 |
| `--rainbow-border-animation` | `glowloop 8s linear infinite` | `src\styles\tokens\gradients.css` | 44 |
| `--rainbow-border-hover-opacity` | `0.4` | `src\styles\tokens\gradients.css` | 45 |
| `--rainbow-halo-hover-opacity` | `0.83` | `src\styles\tokens\gradients.css` | 46 |
| `--rainbow-hover-accent` | `rgba(128, 225, 204, 0.15)` | `src\styles\tokens\gradients.css` | 51 |
| `--rainbow-hover-cream` | `rgba(255, 248, 237, 0.8)` | `src\styles\tokens\gradients.css` | 52 |
| `--rainbow-hover-primary` | `rgba(255, 153, 200, 0.15)` | `src\styles\tokens\gradients.css` | 49 |
| `--rainbow-hover-secondary` | `rgba(174, 136, 191, 0.15)` | `src\styles\tokens\gradients.css` | 50 |
| `--rainbow-light-gradient-accent` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 35 |
| `--rainbow-light-gradient-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 17 |
| `--rainbow-light-gradient-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 27 |
| `--secondary` | `hover {` | `src\components\Presentation\Sections\TitleSection.astro` | 150 |
| `--secondary` | `hover {` | `src\components\Presentation\Sections\TitleSection.astro` | 265 |
| `--selectionBg` | `color-mix(in oklch, var(--focusRing) 25%, transparent)` | `docs\Markdown Notes\accessibility-color-themes.md` | 44 |
| `--selectionText` | `var(--text)` | `docs\Markdown Notes\accessibility-color-themes.md` | 45 |
| `--shadow-base` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 159 |
| `--shadow-base` | `var(--shadow)` | `src\styles\tokens\shadows.css` | 11 |
| `--shadow-dropdown` | `4px 4px 6px color-mix(in oklch, var(--color-Background-900) 20%, transparent), 4px 4px 6px color-mix(in oklch, var(--color-Background-50) 70%, transparent), inset 4px 4px 6px color-mix(in oklch, var(--color-Background-900) 40%, transparent), inset 4px 4px 6px color-mix(in oklch, var(--color-Background-50) 20%, transparent)` | `src\styles\tokens\shadows.css` | 58 |
| `--shadow-dropdown-lg` | `0 8px 16px color-mix(in oklch, var(--color-Background-900) 12%, transparent), 0 4px 8px color-mix(in oklch, var(--color-Background-900) 10%, transparent)` | `src\styles\tokens\shadows.css` | 61 |
| `--shadow-dropdown-sm` | `0 2px 4px color-mix(in oklch, var(--color-Background-900) 8%, transparent), 0 1px 2px color-mix(in oklch, var(--color-Background-900) 6%, transparent)` | `src\styles\tokens\shadows.css` | 59 |
| `--shadow-dropdown-soft` | `4px 4px 6px color-mix(in oklch, var(--color-Background-900) 20%, transparent), -4px -4px 6px color-mix(in oklch, var(--color-Background-50) 60%, transparent), inset 2px 2px 4px color-mix(in oklch, var(--color-Background-900) 15%, transparent), inset -2px -2px 4px color-mix(in oklch, var(--color-Background-50) 30%, transparent)` | `src\styles\tokens\shadows.css` | 62 |
| `--shadow-glow-primary` | `0 0 14px color-mix(in oklch, var(--a11y-dark-c-primary) 50%, transparent)` | `src\styles\themes\a11y\a11y-dark.css` | 166 |
| `--shadow-glow-primary` | `0 0 12px color-mix(in oklch, var(--color-Primary-500) 60%, transparent)` | `src\styles\tokens\shadows.css` | 69 |
| `--shadow-glow-secondary` | `0 0 14px color-mix(in oklch, var(--a11y-dark-c-accent) 50%, transparent)` | `src\styles\themes\a11y\a11y-dark.css` | 167 |
| `--shadow-glow-secondary` | `0 0 12px color-mix(in oklch, var(--color-Secondary-500) 60%, transparent)` | `src\styles\tokens\shadows.css` | 70 |
| `--shadow-inner-2xl` | `inset 0 0 40px 16px` | `src\styles\tokens\shadows.css` | 31 |
| `--shadow-inner-md` | `inset 0 0 10px 4px` | `src\styles\tokens\shadows.css` | 22 |
| `--shadow-inner-xl` | `inset 0 0 30px 12px` | `src\styles\tokens\shadows.css` | 28 |
| `--shadow-xs` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 156 |
| `--shadow-xs` | `0 1px 2px 0 color-mix(in oklch, var(--color-Background-900) 5%, transparent)` | `src\styles\tokens\shadows.css` | 8 |
| `--state-disabled-opacity` | `0.5` | `docs\todo\TODO.md` | 402 |
| `--state-focus-ring` | `var(--color-Info-500)` | `docs\todo\TODO.md` | 400 |
| `--state-focus-ring-width` | `3px` | `docs\todo\TODO.md` | 401 |
| `--state-hover-bg` | `color-mix(in oklch, var(--interactive-primary) 5%, transparent)` | `docs\todo\TODO.md` | 399 |
| `--success` | `var(--color-Success)` | `docs\Markdown Notes\accessibility-color-themes.md` | 38 |
| `--surface-base` | `var(--color-Background-50)` | `docs\todo\TODO.md` | 352 |
| `--surface-elevated` | `var(--color-Background-200)` | `docs\todo\TODO.md` | 354 |
| `--surface-overlay` | `var(--color-Neutral-50)` | `docs\todo\TODO.md` | 355 |
| `--surface2` | `var(--color-Background-200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 22 |
| `--surface3` | `var(--color-Background-300)` | `docs\Markdown Notes\accessibility-color-themes.md` | 23 |
| `--text-disabled` | `var(--color-Text-400)` | `docs\todo\TODO.md` | 361 |
| `--text-inverse` | `var(--color-White)` | `docs\todo\TODO.md` | 362 |
| `--text-primary` | `var(--color-Text-900)` | `docs\todo\TODO.md` | 358 |
| `--text-secondary` | `var(--color-Text-700)` | `docs\todo\TODO.md` | 359 |
| `--text-tertiary` | `var(--color-Text-500)` | `docs\todo\TODO.md` | 360 |
| `--universal-danger` | `#9c5151` | `src\scripts\ThemeTokenGen\brand-template.css` | 89 |
| `--universal-info` | `#47638f` | `src\scripts\ThemeTokenGen\brand-template.css` | 90 |
| `--universal-success` | `#80a575` | `src\scripts\ThemeTokenGen\brand-template.css` | 87 |
| `--universal-warning` | `#cea96a` | `src\scripts\ThemeTokenGen\brand-template.css` | 88 |
| `--warning` | `var(--color-Warning)` | `docs\Markdown Notes\accessibility-color-themes.md` | 39 |

---

## 🟡 Tokens Used But Never Defined (In Scanned Files)

These tokens are referenced but no definition was found.
They may come from a framework, external stylesheet, or be errors.

| Token | Times Used | Example Locations |
|-------|-----------|------------------|
| `--space-md` | 483 | docs\Markdown Notes\CSS-Standards.md L259; docs\Markdown Notes\CSS-Standards.md L336; docs\Markdown Notes\CSS-Tokens.md L514 |
| `--space-sm` | 450 | docs\Markdown Notes\CSS-Standards.md L567; src\components\A11y Panel\FontCard.astro L86; src\components\A11y Panel\NavigationSection.astro L65 |
| `--space-xs` | 388 | src\components\A11y Panel\PresetButton.astro L103; src\components\A11y Panel\PresetButton.astro L129; src\components\A11y Panel\PresetButton.astro L155 |
| `--space-lg` | 344 | docs\Markdown Notes\CSS-Standards.md L335; docs\Markdown Notes\CSS-Standards.md L393; docs\Markdown Notes\CSS-Standards.md L452 |
| `--space-xl` | 241 | docs\Markdown Notes\CSS-Tokens.md L516; src\components\Cards\OfferingCard.astro L135; src\components\Cards\OfferingCard.astro L143 |
| `--space-2xl` | 147 | src\components\Cards\ProjectCard.astro L206; src\components\Cards\StepCard.astro L34; src\components\ContactForm\Contact-Popup.astro L342 |
| `--font-body` | 102 | docs\Markdown Notes\CSS-Standards.md L229; src\components\Button\ButtonDropdown.astro L131; src\components\Cards\OfferingCard.astro L132 |
| `--font-bold` | 97 | docs\Markdown Notes\CSS-Standards.md L198; src\components\Button\ButtonDropdown.astro L213; src\components\Cards\CompactToolCard.astro L85 |
| `--font-semibold` | 96 | docs\Markdown Notes\CSS-Standards.md L206; docs\Markdown Notes\CSS-Standards.md L214; docs\Markdown Notes\CSS-Tokens.md L528 |
| `--font-heading` | 94 | docs\Markdown Notes\CSS-Standards.md L196; docs\Markdown Notes\CSS-Standards.md L204; docs\Markdown Notes\CSS-Standards.md L212 |
| `--transition-fast` | 92 | docs\Markdown Notes\CSS-Tokens.md L300; docs\Markdown Notes\CSS-Tokens.md L303; docs\Markdown Notes\CSS-Tokens.md L304 |
| `--radius-lg` | 87 | docs\Markdown Notes\CSS-Tokens.md L519; docs\reports\css-class-names-recommendations.md L1345; src\components\A11y Panel\FontCard.astro L46 |
| `--space-3xl` | 79 | src\components\Cards\OfferingCard.astro L104; src\components\Cards\ProjectCard.astro L78; src\components\Cards\ProjectCard.astro L171 |
| `--transition-base` | 62 | docs\Markdown Notes\CSS-Tokens.md L532; docs\reports\css-class-names-recommendations.md L1146; docs\reports\css-class-names-recommendations.md L1146 |
| `--leading-relaxed` | 61 | docs\Markdown Notes\CSS-Standards.md L231; src\components\Cards\InsightCard.astro L150; src\components\Cards\OfferingCard.astro L136 |
| `--space-4xl` | 48 | src\components\Cards\OfferingCard.astro L106; src\components\Cards\OfferingCard.astro L185; src\components\ContactForm\Contact-Popup.astro L356 |
| `--radius-full` | 44 | docs\Markdown Notes\CSS-Tokens.md L520; src\components\A11y Panel\Slider.astro L101; src\components\A11y Panel\Slider.astro L113 |
| `--radius-md` | 38 | src\components\A11y Panel\Stepper.astro L124; src\components\Button\ButtonDropdown.astro L89; src\components\ContactForm\Contact-Popup.astro L309 |
| `--font-medium` | 34 | docs\Markdown Notes\CSS-Standards.md L222; src\components\Button\ButtonDropdown.astro L133; src\components\Cards\ProjectSpecCard.astro L67 |
| `--radius-sm` | 27 | docs\todo\TODO.md L517; src\components\A11y Panel\ToggleCard.astro L136; src\components\Badge\Badge.astro L177 |
| `--a11y-hc-accent` | 26 | src\styles\a11y\base\theme-overrides.css L219; src\styles\a11y\base\theme-overrides.css L246; src\styles\a11y\base\theme-overrides.css L253 |
| `--a11y-cream-accent` | 24 | src\styles\a11y\base\theme-overrides.css L268; src\styles\a11y\base\theme-overrides.css L278; src\styles\a11y\base\theme-overrides.css L285 |
| `--leading-tight` | 21 | docs\Markdown Notes\CSS-Standards.md L199; docs\Markdown Notes\CSS-Standards.md L207; src\components\Presentation\AuthorCard.astro L102 |
| `--nav-height` | 18 | src\pages\search.astro L178; src\pages\search.astro L179; src\pages\search.astro L469 |
| `--space-2xs` | 15 | src\components\A11y Panel\PresetButton.astro L130; src\components\A11y Panel\PresetButton.astro L167; src\components\A11y Panel\PresetsSidebar.astro L133 |
| `--a11y-hc-text` | 15 | src\styles\a11y\components\search-overlay.css L60; src\styles\a11y\components\search-overlay.css L65; src\styles\a11y\components\search-overlay.css L66 |
| `--a11y-dark-text` | 13 | src\styles\a11y\components\masonry-grid.css L20; src\styles\a11y\components\masonry-grid.css L35; src\styles\a11y\pages\asset-detail.css L11 |
| `--a11y-dark-accent` | 13 | src\styles\a11y\components\masonry-grid.css L26; src\styles\a11y\components\masonry-grid.css L39; src\styles\a11y\components\masonry-grid.css L41 |
| `--radius-xl` | 12 | src\components\ContactForm\Contact-Popup.astro L154; src\components\Grids\RelatedGrid.astro L454; src\components\Grids\RelatedGrid.astro L471 |
| `--a11y-cream-text` | 12 | src\styles\a11y\base\theme-overrides.css L274; src\styles\a11y\base\theme-overrides.css L505; src\styles\a11y\components\search-overlay.css L98 |
| `--font-size-lg` | 11 | src\components\A11y Panel\FontCard.astro L71; src\components\A11y Panel\NavigationSection.astro L53; src\components\A11y Panel\PresetButton.astro L87 |
| `--font-weight-bold` | 9 | src\components\A11y Panel\FontCard.astro L72; src\components\A11y Panel\NavigationSection.astro L54; src\components\A11y Panel\PresetButton.astro L85 |
| `--leading-normal` | 9 | src\components\Cards\OfferingCard.astro L168; src\components\Cards\SpecCard.astro L72; src\components\Presentation\Sections\StatsSection.astro L89 |
| `--img-height-lg` | 9 | src\components\Cards\ProjectCard.astro L96; src\styles\global.css L378; src\styles\global.css L387 |
| `--container-default` | 9 | src\styles\a11y\visual\text-only.css L470; src\styles\a11y\visual\text-only.css L512; src\styles\a11y\visual\text-only.css L658 |
| `--leading-snug` | 8 | docs\Markdown Notes\CSS-Standards.md L215; docs\Markdown Notes\CSS-Standards.md L223; src\components\Presentation\Sections\EndSection.astro L340 |
| `--font-size-sm` | 8 | src\components\A11y Panel\PresetButton.astro L117; src\components\A11y Panel\Slider.astro L93; src\components\A11y Panel\Slider.astro L149 |
| `--img-width-lg` | 8 | src\styles\global.css L369; src\styles\global.css L387; src\styles\global.css L395 |
| `--img-width-xl` | 8 | src\styles\global.css L370; src\styles\global.css L388; src\styles\global.css L396 |
| `--img-height-xl` | 8 | src\styles\global.css L379; src\styles\global.css L388; src\styles\global.css L394 |
| `--a11y-hc-bg` | 8 | src\styles\a11y\components\search-overlay.css L46; src\styles\a11y\components\search-overlay.css L50; src\styles\a11y\components\search-overlay.css L64 |
| `--page-margin` | 8 | src\styles\a11y\visual\text-only.css L514; src\styles\a11y\visual\text-only.css L515; src\styles\a11y\visual\text-only.css L660 |
| `--brand-text-muted` | 8 | src\styles\pages\checkout.css L81; src\styles\pages\checkout.css L266; src\styles\pages\checkout.css L282 |
| `--letter-spacing-wide` | 7 | docs\todo\TODO.md L554; docs\todo\TODO.md L555; src\components\Button\ButtonDropdown.astro L145 |
| `--font-size-base` | 7 | src\components\A11y Panel\FontCard.astro L90; src\components\A11y Panel\NavigationSection.astro L71; src\components\A11y Panel\PresetButton.astro L93 |
| `--gradient-hero` | 7 | src\components\Insights\InsightHeader.astro L149; src\components\Typography\SectionTitle.astro L235; src\components\Typography\SectionTitle.astro L333 |
| `--a11y-cream-bg` | 7 | src\styles\a11y\base\theme-overrides.css L267; src\styles\a11y\base\theme-overrides.css L499; src\styles\a11y\components\search-overlay.css L84 |
| `--img-width-sm` | 6 | src\styles\global.css L367; src\styles\global.css L385; src\styles\global.css L393 |
| `--img-width-md` | 6 | src\styles\global.css L368; src\styles\global.css L386; src\styles\global.css L394 |
| `--img-width-2xl` | 6 | src\styles\global.css L371; src\styles\global.css L389; src\styles\global.css L401 |
| `--img-width-3xl` | 6 | src\styles\global.css L372; src\styles\global.css L390; src\styles\global.css L402 |
| `--img-height-sm` | 6 | src\styles\global.css L376; src\styles\global.css L385; src\styles\global.css L399 |
| `--img-height-md` | 6 | src\styles\global.css L377; src\styles\global.css L386; src\styles\global.css L400 |
| `--img-height-2xl` | 6 | src\styles\global.css L380; src\styles\global.css L389; src\styles\global.css L395 |
| `--img-height-3xl` | 6 | src\styles\global.css L381; src\styles\global.css L390; src\styles\global.css L396 |
| `--a11y-cvd-accent` | 6 | src\styles\a11y\components\masonry-grid.css L337; src\styles\a11y\components\masonry-grid.css L346; src\styles\a11y\components\masonry-grid.css L348 |
| `--z-modal` | 5 | docs\Markdown Notes\CSS-Tokens.md L535; src\components\Button\ButtonDropdown.astro L231; src\components\ContactForm\Contact-Popup.astro L139 |
| `--glass-blur` | 5 | src\components\Button\ButtonDropdown.astro L87; src\components\Button\ButtonDropdown.astro L88; src\styles\base\utilities.css L215 |
| `--space-5xl` | 5 | src\components\Cards\ProjectCard.astro L70; src\styles\components\hero-section.css L303; src\styles\components\hero-section.css L334 |
| `--text-2xs` | 5 | src\components\ContactForm\Contact-Popup.astro L539; src\components\ContactForm\Contact-Popup.astro L670; src\components\ContactForm\Contact-Popup.astro L709 |
| `--font-extrabold` | 5 | src\components\Footer\Footer.astro L195; src\components\Presentation\Sections\HeroSection.astro L110; src\components\Presentation\Sections\TitleSection.astro L212 |
| `--font-normal` | 5 | src\components\Presentation\Sections\FullWidthSection.astro L93; src\components\Presentation\Sections\ImageTextSection.astro L92; src\components\Presentation\Sections\TextSection.astro L68 |
| `--brand-success` | 5 | src\styles\pages\checkout.css L238; src\styles\pages\checkout.css L247; src\styles\pages\checkout.css L451 |
| `--font-size-xs` | 4 | src\components\A11y Panel\PresetButton.astro L121; src\components\A11y Panel\PresetButton.astro L144; src\components\A11y Panel\ToggleCard.astro L163 |
| `--container-sm` | 4 | src\components\Button\ButtonDropdown.astro L106; src\components\Button\ButtonDropdown.astro L234; src\components\ContactForm\Contact-Popup.astro L352 |
| `--body-top-padding` | 4 | src\components\Presentation\Sections\TitleSection.astro L94; src\styles\global.css L72; src\styles\components\hero-section.css L74 |
| `--img-width-xs` | 4 | src\styles\global.css L366; src\styles\global.css L384; src\styles\tokens\images.css L87 |
| `--img-height-xs` | 4 | src\styles\global.css L375; src\styles\global.css L384; src\styles\tokens\images.css L96 |
| `--media-brightness` | 4 | src\styles\a11y\base\media-filters.css L25; src\styles\a11y\base\theme-overrides.css L232; src\styles\a11y\base\theme-overrides.css L465 |
| `--media-saturation` | 4 | src\styles\a11y\base\media-filters.css L26; src\styles\a11y\base\theme-overrides.css L233; src\styles\a11y\base\theme-overrides.css L466 |
| `--media-contrast` | 4 | src\styles\a11y\base\media-filters.css L27; src\styles\a11y\base\theme-overrides.css L234; src\styles\a11y\base\theme-overrides.css L467 |
| `--tracking-wide` | 4 | src\styles\components\masonry-card.css L36; src\styles\components\masonry-card.css L46; src\styles\components\masonry-card.css L59 |
| `--opacity-high` | 4 | src\styles\components\masonry-card.css L69; src\styles\components\masonry-card.css L119; src\styles\components\masonry-card.css L131 |
| `--brand-neutral-200` | 4 | src\styles\pages\checkout.css L66; src\styles\pages\checkout.css L303; src\styles\pages\checkout.css L468 |
| `--brand-success-dark` | 4 | src\styles\pages\checkout.css L241; src\styles\pages\checkout.css L432; src\styles\pages\checkout.css L456 |
| `--rainbow-light-pink` | 4 | src\styles\tokens\gradients.css L19; src\styles\tokens\gradients.css L23; src\styles\tokens\gradients.css L32 |
| `--rainbow-light-teal` | 4 | src\styles\tokens\gradients.css L21; src\styles\tokens\gradients.css L24; src\styles\tokens\gradients.css L31 |
| `--space-3xs` | 3 | src\components\A11y Panel\PresetButton.astro L81; src\components\A11y Panel\PresetButton.astro L168; src\components\A11y Panel\ToggleCard.astro L109 |
| `--font-weight-medium` | 3 | src\components\A11y Panel\Slider.astro L88; src\components\A11y Panel\Slider.astro L95; src\components\A11y Panel\Toggle.astro L59 |
| `--container-md` | 3 | src\components\Button\ButtonDropdown.astro L225; src\components\Button\ButtonDropdown.astro L238; src\styles\base\utilities.css L28 |
| `--text-md` | 3 | src\components\Cards\ProductCard.astro L216; src\components\Cards\ProjectCard.astro L136; src\components\Cards\SpecCard.astro L62 |
| `--radius-xs` | 3 | src\components\ContactForm\Contact-Popup.astro L636; src\styles\components\image-text-section.css L183; src\styles\components\who-slider.css L414 |
| `--space-7xl` | 3 | src\styles\global.css L311; src\styles\a11y\visual\text-only.css L493; src\styles\a11y\visual\text-only.css L494 |
| `--img-radius` | 3 | src\styles\global.css L331; src\styles\global.css L361; src\styles\tokens\images.css L82 |
| `--container-7xl` | 3 | src\styles\base\utilities.css L36; src\styles\components\nav\GlassNav-expandable.css L18; src\styles\tokens\spacing.css L36 |
| `--container-full` | 3 | src\styles\base\utilities.css L37; src\styles\components\cookie-banner.css L37; src\styles\components\cookie-banner.css L68 |
| `--z-sticky` | 3 | src\styles\components\announcement-ticker.css L16; src\styles\components\nav\GlassNav-base.css L12; src\styles\components\presentation\ReaderNav.css L14 |
| `--brand-success-light` | 3 | src\styles\pages\checkout.css L237; src\styles\pages\checkout.css L431; src\styles\pages\checkout.css L444 |
| `--brand-neutral-100` | 3 | src\styles\pages\checkout.css L279; src\styles\pages\checkout.css L317; src\styles\pages\checkout.css L397 |
| `--rainbow-light-lilac` | 3 | src\styles\tokens\gradients.css L20; src\styles\tokens\gradients.css L29; src\styles\tokens\gradients.css L39 |
| `--rainbow-light-blue` | 3 | src\styles\tokens\gradients.css L22; src\styles\tokens\gradients.css L30; src\styles\tokens\gradients.css L38 |
| `--z-dropdown` | 2 | docs\Markdown Notes\CSS-Tokens.md L536; src\components\Button\ButtonDropdown.astro L91 |
| `--container-xs` | 2 | src\components\Button\ButtonDropdown.astro L92; src\styles\base\utilities.css L26 |
| `--letter-spacing-normal` | 2 | src\components\Button\ButtonDropdown.astro L151; src\styles\components\hero-morph.css L214 |
| `--transition-slow` | 2 | src\components\ContactForm\Contact-Popup.astro L163; src\styles\base\utilities.css L225 |
| `--color-Black-10` | 2 | src\components\Sections\ShareSection.astro L146; src\styles\components\nav\GlassNav-expandable.css L77 |
| `--color-Black-5` | 2 | src\components\Sections\ShareSection.astro L150; src\styles\components\nav\GlassNav-base.css L29 |
| `--color-Secondary-50` | 2 | src\components\Shop\MiniCart.astro L170; src\styles\pages\cart.css L175 |
| `--container-2xl` | 2 | src\pages\search.astro L224; src\styles\base\utilities.css L31 |
| `--container-6xl` | 2 | src\pages\showcase\section-titles.astro L381; src\styles\base\utilities.css L35 |
| `--img-radius-sm` | 2 | src\styles\global.css L360; src\styles\tokens\images.css L81 |
| `--img-radius-lg` | 2 | src\styles\global.css L362; src\styles\tokens\images.css L83 |
| `--img-radius-full` | 2 | src\styles\global.css L363; src\styles\tokens\images.css L84 |
| `--img-filter-grayscale` | 2 | src\styles\global.css L411; src\styles\tokens\images.css L132 |
| `--img-filter-sepia` | 2 | src\styles\global.css L412; src\styles\tokens\images.css L133 |
| `--img-filter-brightness` | 2 | src\styles\global.css L413; src\styles\tokens\images.css L134 |
| `--img-filter-contrast` | 2 | src\styles\global.css L414; src\styles\tokens\images.css L135 |
| `--img-filter-saturate` | 2 | src\styles\global.css L415; src\styles\tokens\images.css L136 |
| `--img-filter-blur` | 2 | src\styles\global.css L416; src\styles\tokens\images.css L137 |
| `--svg-size-sm` | 2 | src\styles\global.css L435; src\styles\global.css L435 |
| `--svg-size-md` | 2 | src\styles\global.css L436; src\styles\global.css L436 |
| `--svg-size-lg` | 2 | src\styles\global.css L437; src\styles\global.css L437 |
| `--svg-size-xl` | 2 | src\styles\global.css L438; src\styles\global.css L438 |
| `--a11y-mono-bg-100` | 2 | src\styles\a11y\base\theme-overrides.css L303; src\styles\a11y\base\theme-overrides.css L524 |
| `--a11y-dark-bg` | 2 | src\styles\a11y\components\masonry-grid.css L19; src\styles\a11y\components\masonry-grid.css L40 |
| `--a11y-cvd-accent-rgb` | 2 | src\styles\a11y\components\masonry-grid.css L452; src\styles\a11y\components\masonry-grid.css L454 |
| `--font-light` | 2 | src\styles\base\utilities.css L133; src\styles\components\nav\GlassNav-mobile.css L245 |
| `--z-base` | 2 | src\styles\components\footer-mask.css L23; src\styles\components\footer-mask.css L29 |
| `--tracking-normal` | 2 | src\styles\components\masonry-card.css L78; src\styles\components\masonry-card.css L179 |
| `--nav-top-offset` | 2 | src\styles\components\nav\GlassNav-base.css L9; src\styles\components\nav\GlassNav-mobile.css L37 |
| `--color-Primary-500-rgb` | 2 | src\styles\components\presentation\ReaderNav.css L873; src\styles\components\presentation\ReaderNav.css L874 |
| `--btn-gradient-glow` | 2 | src\styles\design\GlowTokens.css L13; src\styles\design\GlowTokens.css L24 |
| `--brand-neutral-300` | 2 | src\styles\pages\checkout.css L253; src\styles\pages\checkout.css L485 |
| `--page-margin-compact` | 2 | src\styles\responsive\phone.css L14; src\styles\responsive\xs.css L13 |
| `--page-margin-comfortable` | 2 | src\styles\responsive\tablet.css L14; src\styles\tokens\spacing.css L43 |
| `--color-surface` | 1 | docs\reports\css-class-names-recommendations.md L1344 |
| `--font-size-2xl` | 1 | src\components\A11y Panel\Stepper.astro L108 |
| `--font-weight-semibold` | 1 | src\components\A11y Panel\Stepper.astro L109 |
| `--font-size-xl` | 1 | src\components\A11y Panel\Stepper.astro L177 |
| `--color-secondary-500` | 1 | src\components\Cards\ProductCard.astro L123 |
| `--color-Success-600` | 1 | src\components\ContactForm\Contact-Popup.astro L359 |
| `--gradient-sunset` | 1 | src\components\Insights\InsightHeader.astro L155 |
| `--space-2` | 1 | src\components\Nav\Tabs\SideTabs.astro L144 |
| `--border-radius-2xl` | 1 | src\components\Search\SearchOverlay.astro L122 |
| `--color-White-80` | 1 | src\components\Sections\ShareSection.astro L143 |
| `--selector-left` | 1 | src\components\Switcher\BaseSwitcher.astro L206 |
| `--selector-width` | 1 | src\components\Switcher\BaseSwitcher.astro L211 |
| `--color-Success-50` | 1 | src\lib\cart\checkout-form.ts L194 |
| `--color-Success-700` | 1 | src\lib\cart\checkout-form.ts L196 |
| `--color-Error-50` | 1 | src\lib\cart\checkout-form.ts L200 |
| `--color-Error-700` | 1 | src\lib\cart\checkout-form.ts L202 |
| `--font-extra-bold` | 1 | src\styles\global.css L129 |
| `--img-filter` | 1 | src\styles\global.css L333 |
| `--img-transition` | 1 | src\styles\global.css L334 |
| `--svg-filter` | 1 | src\styles\global.css L430 |
| `--svg-transition` | 1 | src\styles\global.css L431 |
| `--font-mono` | 1 | src\styles\a11y\typography\dyslexia.css L64 |
| `--a11y-line-height` | 1 | src\styles\a11y\visual\index.css L32 |
| `--container-lg` | 1 | src\styles\base\utilities.css L29 |
| `--container-xl` | 1 | src\styles\base\utilities.css L30 |
| `--container-3xl` | 1 | src\styles\base\utilities.css L32 |
| `--container-4xl` | 1 | src\styles\base\utilities.css L33 |
| `--container-5xl` | 1 | src\styles\base\utilities.css L34 |
| `--glass-bg-hover` | 1 | src\styles\buttons\basic-button.css L233 |
| `--glass-shadow-hover` | 1 | src\styles\buttons\basic-button.css L234 |
| `--confetti-gold` | 1 | src\styles\buttons\confetti-button.css L21 |
| `--confetti-pink` | 1 | src\styles\buttons\confetti-button.css L48 |
| `--confetti-purple` | 1 | src\styles\buttons\confetti-button.css L54 |
| `--confetti-teal` | 1 | src\styles\buttons\confetti-button.css L55 |
| `--glint-speed` | 1 | src\styles\buttons\styled-button.css L25 |
| `--border-width-md` | 1 | src\styles\components\masonry-card.css L14 |
| `--tracking-wider` | 1 | src\styles\components\masonry-card.css L67 |
| `--leading-none` | 1 | src\styles\components\masonry-card.css L99 |
| `--opacity-medium` | 1 | src\styles\components\masonry-card.css L142 |
| `--opacity-medium-high` | 1 | src\styles\components\masonry-card.css L147 |
| `--aspect-square` | 1 | src\styles\components\masonry-card.css L193 |
| `--aspect-video` | 1 | src\styles\components\masonry-card.css L269 |
| `--aspect-3-2` | 1 | src\styles\components\masonry-card.css L280 |
| `--aspect-4-5` | 1 | src\styles\components\masonry-card.css L285 |
| `--aspect-3-4` | 1 | src\styles\components\masonry-card.css L290 |
| `--color-Accent-500` | 1 | src\styles\components\masonry-card.css L382 |
| `--color-White-5` | 1 | src\styles\components\nav\GlassNav-base.css L26 |
| `--font-regular` | 1 | src\styles\components\nav\GlassNav-mobile.css L291 |
| `--section-count` | 1 | src\styles\components\presentation\Reader.css L21 |
| `--color-White-15` | 1 | src\styles\components\presentation\ReaderNav.css L810 |
| `--btn-color-500` | 1 | src\styles\design\GlowTokens.css L7 |
| `--spec-grid-col` | 1 | src\styles\pages\asset-detail.css L636 |
| `--brand-danger` | 1 | src\styles\pages\checkout.css L292 |
| `--color-Warning-50` | 1 | src\styles\pages\legal.css L119 |
| `--color-Warning-700` | 1 | src\styles\pages\legal.css L126 |
| `--page-margin-spacious` | 1 | src\styles\responsive\max.css L13 |
| `--gradient-light` | 1 | src\styles\tokens\gradients.css L922 |
| `--gradient-dark` | 1 | src\styles\tokens\gradients.css L923 |
| `--gradient-card-light` | 1 | src\styles\tokens\gradients.css L928 |
| `--gradient-card-elevated` | 1 | src\styles\tokens\gradients.css L929 |

---

## 📊 Token Usage Frequency

How often each colour token is actually used across the project.

| Token | Times Used | Unique Files |
|-------|-----------|-------------|
| `--color-Primary-500` | 332 | 75 |
| `--text-sm` | 208 | 68 |
| `--text-xs` | 202 | 56 |
| `--color-Primary-600` | 171 | 56 |
| `--color-White` | 168 | 46 |
| `--color-Text-700` | 151 | 55 |
| `--color-Background-50` | 122 | 46 |
| `--text-base` | 121 | 53 |
| `--color-Background-100` | 99 | 51 |
| `--text-lg` | 98 | 47 |
| `--color-Primary-700` | 91 | 35 |
| `--color-Text-600` | 89 | 45 |
| `--color-Text-900` | 74 | 36 |
| `--text-xl` | 73 | 44 |
| `--color-Text-500` | 73 | 39 |
| `--color-Neutral-200` | 55 | 33 |
| `--text-2xl` | 53 | 34 |
| `--a11y-cream-c-accent` | 49 | 2 |
| `--a11y-hc-c-accent` | 48 | 1 |
| `--a11y-mono-c-accent` | 48 | 1 |
| `--color-Text-800` | 46 | 23 |
| `--text-3xl` | 46 | 28 |
| `--color-Secondary-500` | 44 | 18 |
| `--shadow-md` | 42 | 20 |
| `--border-radius-md` | 41 | 17 |
| `--color-Background-300` | 40 | 14 |
| `--a11y-dark-c-accent` | 40 | 4 |
| `--color-Background-200` | 39 | 10 |
| `--color-Primary-300` | 39 | 11 |
| `--color-Background-900` | 37 | 6 |
| `--a11y-deuter-c-primary` | 36 | 1 |
| `--a11y-proto-c-primary` | 36 | 1 |
| `--a11y-trit-c-primary` | 36 | 1 |
| `--a11y-dark-c-primary` | 35 | 2 |
| `--color-Primary-400` | 34 | 14 |
| `--color-Secondary-600` | 32 | 12 |
| `--text-4xl` | 31 | 27 |
| `--color-Primary-200` | 30 | 16 |
| `--border-width` | 28 | 13 |
| `--shadow-xl` | 26 | 13 |
| `--a11y-hc-accent` | 26 | 6 |
| `--color-AccentOne-500` | 24 | 12 |
| `--shadow-sm` | 24 | 11 |
| `--color-Neutral-300` | 24 | 18 |
| `--color-Primary-100` | 24 | 12 |
| `--a11y-cream-accent` | 24 | 6 |
| `--a11y-cream-c-text` | 24 | 3 |
| `--a11y-deuter-c-accent` | 24 | 1 |
| `--a11y-proto-c-accent` | 24 | 1 |
| `--a11y-trit-c-accent` | 24 | 1 |
| `--a11y-deuter-c-text` | 22 | 1 |
| `--a11y-mono-c-text` | 22 | 1 |
| `--a11y-proto-c-text` | 22 | 1 |
| `--a11y-trit-c-text` | 22 | 1 |
| `--shadow-lg` | 21 | 13 |
| `--color-Primary-800` | 21 | 10 |
| `--color-Secondary-400` | 20 | 5 |
| `--border-radius-lg` | 20 | 15 |
| `--color-Black` | 20 | 5 |
| `--color-Text-400` | 20 | 13 |
| `--color-Neutral-100` | 20 | 11 |
| `--a11y-dark-c-bg` | 20 | 5 |
| `--color-AccentTwo-500` | 19 | 10 |
| `--color-AccentTwo-600` | 19 | 10 |
| `--a11y-dark-c-text` | 18 | 5 |
| `--a11y-hc-c-text` | 17 | 1 |
| `--color-AccentOne-600` | 16 | 8 |
| `--text-5xl` | 16 | 16 |
| `--color-Secondary-700` | 15 | 6 |
| `--border-radius-xl` | 15 | 10 |
| `--color-AccentThree-500` | 15 | 7 |
| `--a11y-hc-text` | 15 | 3 |
| `--a11y-hc-c-bg` | 15 | 1 |
| `--border-width-2` | 14 | 9 |
| `--color-Secondary-100` | 14 | 5 |
| `--color-Secondary-800` | 14 | 2 |
| `--a11y-cream-c-primary` | 14 | 2 |
| `--shadow` | 13 | 7 |
| `--color-Primary-900` | 13 | 9 |
| `--a11y-dark-text` | 13 | 3 |
| `--a11y-dark-accent` | 13 | 5 |
| `--a11y-hc-c-primary` | 13 | 1 |
| `--color-Error` | 12 | 3 |
| `--color-AccentFour-500` | 12 | 5 |
| `--color-Text-50` | 12 | 7 |
| `--color-Neutral-50` | 12 | 9 |
| `--color-AccentThree-600` | 12 | 4 |
| `--border-radius-full` | 12 | 9 |
| `--color-AccentTwo-400` | 12 | 3 |
| `--color-Error-500` | 12 | 2 |
| `--a11y-cream-text` | 12 | 5 |
| `--a11y-cream-c-bg` | 12 | 3 |
| `--a11y-mono-c-primary` | 12 | 1 |
| `--color-Text-300` | 11 | 8 |
| `--color-AccentFour-600` | 11 | 3 |
| `--color-AccentFive-600` | 11 | 3 |
| `--color-Neutral-400` | 10 | 2 |
| `--color-AccentOne-200` | 10 | 5 |
| `--color-AccentTwo-100` | 10 | 4 |
| `--border-radius-sm` | 10 | 8 |
| `--color-AccentFive-500` | 10 | 4 |
| `--color-AccentFive-400` | 10 | 2 |
| `--a11y-deuter-c-bg` | 10 | 1 |
| `--a11y-mono-c-bg` | 10 | 1 |
| `--a11y-proto-c-bg` | 10 | 1 |
| `--a11y-trit-c-bg` | 10 | 1 |
| `--color-Success` | 9 | 4 |
| `--badge-color` | 9 | 1 |
| `--color-Primary-50` | 9 | 7 |
| `--shadow-2xl` | 9 | 7 |
| `--color-Neutral-900` | 9 | 4 |
| `--color-AccentOne-100` | 9 | 3 |
| `--color-Secondary-200` | 9 | 3 |
| `--color-AccentOne-400` | 9 | 1 |
| `--color-AccentOne-300` | 8 | 6 |
| `--color-Text-200` | 8 | 5 |
| `--overlay-opacity` | 8 | 2 |
| `--btn-filled-text` | 8 | 1 |
| `--a11y-hc-bg` | 8 | 2 |
| `--color-AccentFour-100` | 8 | 2 |
| `--color-AccentFive-100` | 8 | 2 |
| `--color-AccentOne-700` | 8 | 2 |
| `--color-AccentTwo-700` | 8 | 2 |
| `--brand-text-muted` | 8 | 1 |
| `--color-AccentThree-400` | 8 | 1 |
| `--color-AccentFour-400` | 8 | 1 |
| `--color-Success-500` | 7 | 3 |
| `--color-AccentTwo-200` | 7 | 3 |
| `--color-AccentThree-200` | 7 | 3 |
| `--text-6xl` | 7 | 7 |
| `--color-Secondary-300` | 7 | 5 |
| `--a11y-cream-bg` | 7 | 3 |
| `--color-AccentThree-100` | 7 | 2 |
| `--color-AccentThree-700` | 7 | 2 |
| `--color-AccentFour-700` | 7 | 1 |
| `--color-AccentFive-700` | 7 | 1 |
| `--color-Info-500` | 6 | 3 |
| `--brand-c-bg` | 6 | 4 |
| `--brand-c-primary` | 6 | 3 |
| `--color-AccentFour-200` | 6 | 2 |
| `--color-AccentFive-200` | 6 | 2 |
| `--border-radius` | 6 | 5 |
| `--a11y-cvd-accent` | 6 | 1 |
| `--color-AccentOne-800` | 6 | 2 |
| `--color-AccentTwo-800` | 6 | 2 |
| `--color-AccentThree-800` | 6 | 2 |
| `--color-AccentFour-800` | 6 | 2 |
| `--color-AccentFive-800` | 6 | 2 |
| `--color-Background-400` | 6 | 1 |
| `--text` | 5 | 1 |
| `--color-Warning` | 5 | 4 |
| `--color-Neutral-800` | 5 | 3 |
| `--text-2xs` | 5 | 1 |
| `--color-Text-100` | 5 | 3 |
| `--color-Warning-500` | 5 | 2 |
| `--a11y-dark-c-surface` | 5 | 2 |
| `--brand-text` | 5 | 1 |
| `--brand-success` | 5 | 1 |
| `--color-Danger` | 4 | 3 |
| `--gradient-primary` | 4 | 3 |
| `--gradient-secondary` | 4 | 3 |
| `--text-7xl` | 4 | 3 |
| `--a11y-dark-c-border` | 4 | 2 |
| `--slider-color` | 4 | 1 |
| `--brand-neutral-200` | 4 | 1 |
| `--brand-success-dark` | 4 | 1 |
| `--shadow-inner-lg` | 3 | 2 |
| `--text-md` | 3 | 3 |
| `--color-Text-950` | 3 | 2 |
| `--color-AccentTwo-300` | 3 | 2 |
| `--color-AccentThree-300` | 3 | 2 |
| `--img-shadow-lg` | 3 | 2 |
| `--glass-bg` | 3 | 3 |
| `--glass-shadow` | 3 | 3 |
| `--brand-success-light` | 3 | 1 |
| `--brand-neutral-100` | 3 | 1 |
| `--focusRing` | 2 | 1 |
| `--surface` | 2 | 1 |
| `--color-Neutral-500` | 2 | 2 |
| `--color-Info` | 2 | 1 |
| `--gradient-primary-soft` | 2 | 2 |
| `--gradient-primary-light` | 2 | 2 |
| `--gradient-secondary-soft` | 2 | 2 |
| `--color-Neutral-700` | 2 | 2 |
| `--color-Black-10` | 2 | 2 |
| `--color-Black-5` | 2 | 2 |
| `--color-Secondary-50` | 2 | 2 |
| `--color-Success-200` | 2 | 2 |
| `--color-Error-200` | 2 | 2 |
| `--img-shadow-sm` | 2 | 2 |
| `--img-shadow-md` | 2 | 2 |
| `--a11y-mono-bg-100` | 2 | 1 |
| `--a11y-dark-bg` | 2 | 1 |
| `--a11y-cvd-accent-rgb` | 2 | 1 |
| `--shadow-btn` | 2 | 2 |
| `--brand-c-text` | 2 | 2 |
| `--a11y-high-contrast-c-bg` | 2 | 2 |
| `--a11y-high-contrast-c-text` | 2 | 2 |
| `--a11y-protanopia-c-bg` | 2 | 2 |
| `--a11y-protanopia-c-text` | 2 | 2 |
| `--a11y-deuteranopia-c-bg` | 2 | 2 |
| `--a11y-deuteranopia-c-text` | 2 | 2 |
| `--a11y-tritanopia-c-bg` | 2 | 2 |
| `--a11y-tritanopia-c-text` | 2 | 2 |
| `--a11y-monochrome-c-bg` | 2 | 2 |
| `--a11y-monochrome-c-text` | 2 | 2 |
| `--glass-border` | 2 | 2 |
| `--color-Error-100` | 2 | 1 |
| `--color-Success-100` | 2 | 1 |
| `--color-Primary-500-rgb` | 2 | 1 |
| `--brand-neutral-300` | 2 | 1 |
| `--a11y-high-contrast-c-primary` | 2 | 1 |
| `--a11y-protanopia-c-primary` | 2 | 1 |
| `--a11y-deuteranopia-c-primary` | 2 | 1 |
| `--a11y-tritanopia-c-primary` | 2 | 1 |
| `--a11y-monochrome-c-primary` | 2 | 1 |
| `--color-Background-500` | 2 | 1 |
| `--color-AccentFour-300` | 2 | 1 |
| `--color-AccentFive-300` | 2 | 1 |
| `--link` | 1 | 1 |
| `--textMuted` | 1 | 1 |
| `--disabledBg` | 1 | 1 |
| `--disabledText` | 1 | 1 |
| `--color-surface` | 1 | 1 |
| `--color-Neutral-600` | 1 | 1 |
| `--feedback-error-bg` | 1 | 1 |
| `--feedback-success-bg` | 1 | 1 |
| `--interactive-primary` | 1 | 1 |
| `--surface-raised` | 1 | 1 |
| `--border-subtle` | 1 | 1 |
| `--border-interactive` | 1 | 1 |
| `--btn-text-color` | 1 | 1 |
| `--shadow-dropdown-md` | 1 | 1 |
| `--dropdown-border-color` | 1 | 1 |
| `--dropdown-primary-border` | 1 | 1 |
| `--dropdown-secondary-border` | 1 | 1 |
| `--dropdown-accent1-border` | 1 | 1 |
| `--dropdown-accent2-border` | 1 | 1 |
| `--dropdown-accent3-border` | 1 | 1 |
| `--dropdown-accent4-border` | 1 | 1 |
| `--dropdown-accent5-border` | 1 | 1 |
| `--dropdown-primary-hover-bg` | 1 | 1 |
| `--dropdown-primary-hover-text` | 1 | 1 |
| `--dropdown-secondary-hover-bg` | 1 | 1 |
| `--dropdown-secondary-hover-text` | 1 | 1 |
| `--dropdown-accent1-hover-bg` | 1 | 1 |
| `--dropdown-accent1-hover-text` | 1 | 1 |
| `--dropdown-accent2-hover-bg` | 1 | 1 |
| `--dropdown-accent2-hover-text` | 1 | 1 |
| `--dropdown-accent3-hover-bg` | 1 | 1 |
| `--dropdown-accent3-hover-text` | 1 | 1 |
| `--dropdown-accent4-hover-bg` | 1 | 1 |
| `--dropdown-accent4-hover-text` | 1 | 1 |
| `--dropdown-accent5-hover-bg` | 1 | 1 |
| `--dropdown-accent5-hover-text` | 1 | 1 |
| `--dropdown-selected-bg` | 1 | 1 |
| `--dropdown-selected-text` | 1 | 1 |
| `--color-secondary-500` | 1 | 1 |
| `--glass-overlay-blur` | 1 | 1 |
| `--color-Success-600` | 1 | 1 |
| `--gradient-brand-emerge` | 1 | 1 |
| `--gradient-brand-fade` | 1 | 1 |
| `--gradient-background-light` | 1 | 1 |
| `--gradient-background-warm` | 1 | 1 |
| `--gradient-background-cool` | 1 | 1 |
| `--border-radius-2xl` | 1 | 1 |
| `--color-White-80` | 1 | 1 |
| `--shadow-inner-sm` | 1 | 1 |
| `--section-title-color` | 1 | 1 |
| `--color-Success-50` | 1 | 1 |
| `--color-Success-700` | 1 | 1 |
| `--color-Error-50` | 1 | 1 |
| `--color-Error-700` | 1 | 1 |
| `--img-border-width` | 1 | 1 |
| `--img-border-style` | 1 | 1 |
| `--img-border-color` | 1 | 1 |
| `--img-shadow` | 1 | 1 |
| `--img-hover-scale` | 1 | 1 |
| `--img-hover-shadow` | 1 | 1 |
| `--img-hover-filter` | 1 | 1 |
| `--svg-fill` | 1 | 1 |
| `--svg-stroke` | 1 | 1 |
| `--svg-stroke-width` | 1 | 1 |
| `--svg-drop-shadow` | 1 | 1 |
| `--svg-drop-shadow-md` | 1 | 1 |
| `--svg-hover-scale` | 1 | 1 |
| `--svg-hover-filter` | 1 | 1 |
| `--focus-ring-width` | 1 | 1 |
| `--focus-ring-color` | 1 | 1 |
| `--color-Background-800` | 1 | 1 |
| `--color-Warning-100` | 1 | 1 |
| `--color-Warning-200` | 1 | 1 |
| `--glass-bg-hover` | 1 | 1 |
| `--glass-shadow-hover` | 1 | 1 |
| `--shadow-btn-hover` | 1 | 1 |
| `--gradient-accent1` | 1 | 1 |
| `--gradient-accent2` | 1 | 1 |
| `--border-width-md` | 1 | 1 |
| `--card-hover-border` | 1 | 1 |
| `--color-Accent-500` | 1 | 1 |
| `--page-bg` | 1 | 1 |
| `--color-White-5` | 1 | 1 |
| `--color-White-15` | 1 | 1 |
| `--btn-color-500` | 1 | 1 |
| `--brand-primary` | 1 | 1 |
| `--brand-danger` | 1 | 1 |
| `--color-Warning-50` | 1 | 1 |
| `--color-Warning-700` | 1 | 1 |
| `--a11y-dark-c-surface-raised` | 1 | 1 |
| `--brand-c-accent` | 1 | 1 |
| `--a11y-high-contrast-c-accent` | 1 | 1 |
| `--a11y-protanopia-c-accent` | 1 | 1 |
| `--a11y-deuteranopia-c-accent` | 1 | 1 |
| `--a11y-tritanopia-c-accent` | 1 | 1 |
| `--a11y-monochrome-c-accent` | 1 | 1 |
| `--gradient-btn-primary` | 1 | 1 |
| `--gradient-btn-secondary` | 1 | 1 |
| `--gradient-btn-primary-hover` | 1 | 1 |
| `--gradient-btn-secondary-hover` | 1 | 1 |

---

## 📋 All Colour Token Definitions

| Token | Value | Defined In | Line |
|-------|-------|-----------|------|
| `--a11y-cream-c-accent` | `#6b8e7a` | `src\styles\themes\a11y\a11y-cream.css` | 17 |
| `--a11y-cream-c-accent` | `#6b8e7a` | `src\styles\themes\Preview\coretokens.css` | 16 |
| `--a11y-cream-c-bg` | `#ddd9d3` | `src\styles\themes\a11y\a11y-cream.css` | 14 |
| `--a11y-cream-c-bg` | `#ddd9d3` | `src\styles\themes\Preview\coretokens.css` | 13 |
| `--a11y-cream-c-primary` | `#8b7355` | `src\styles\themes\a11y\a11y-cream.css` | 16 |
| `--a11y-cream-c-primary` | `#8b7355` | `src\styles\themes\Preview\coretokens.css` | 15 |
| `--a11y-cream-c-text` | `#4a3f2f` | `src\styles\themes\a11y\a11y-cream.css` | 15 |
| `--a11y-cream-c-text` | `#4a3f2f` | `src\styles\themes\Preview\coretokens.css` | 14 |
| `--a11y-dark-c-accent` | `#272596` | `docs\Markdown Notes\Theme-Preview-System.md` | 35 |
| `--a11y-dark-c-accent` | `#272596` | `src\styles\themes\a11y\a11y-dark.css` | 20 |
| `--a11y-dark-c-accent` | `#272596` | `src\styles\themes\Preview\coretokens.css` | 22 |
| `--a11y-dark-c-bg` | `#040913` | `docs\Markdown Notes\Theme-Preview-System.md` | 32 |
| `--a11y-dark-c-bg` | `#121212` | `src\styles\themes\a11y\a11y-dark.css` | 14 |
| `--a11y-dark-c-bg` | `#121212` | `src\styles\themes\Preview\coretokens.css` | 19 |
| `--a11y-dark-c-border` | `#3a3a3a` | `src\styles\themes\a11y\a11y-dark.css` | 17 |
| `--a11y-dark-c-primary` | `#962587` | `docs\Markdown Notes\Theme-Preview-System.md` | 34 |
| `--a11y-dark-c-primary` | `#C5E1A5` | `src\styles\themes\a11y\a11y-dark.css` | 19 |
| `--a11y-dark-c-primary` | `#C5E1A5` | `src\styles\themes\Preview\coretokens.css` | 21 |
| `--a11y-dark-c-surface` | `#1e1e1e` | `src\styles\themes\a11y\a11y-dark.css` | 15 |
| `--a11y-dark-c-surface-raised` | `#2a2a2a` | `src\styles\themes\a11y\a11y-dark.css` | 16 |
| `--a11y-dark-c-text` | `#ccd3da` | `docs\Markdown Notes\Theme-Preview-System.md` | 33 |
| `--a11y-dark-c-text` | `#ccd3da` | `src\styles\themes\a11y\a11y-dark.css` | 18 |
| `--a11y-dark-c-text` | `#ccd3da` | `src\styles\themes\Preview\coretokens.css` | 20 |
| `--a11y-deuter-c-accent` | `#f97316` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 17 |
| `--a11y-deuter-c-bg` | `#f6f5fa` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 14 |
| `--a11y-deuter-c-primary` | `#6d28d9` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 16 |
| `--a11y-deuter-c-text` | `#1c1b29` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 15 |
| `--a11y-deuteranopia-c-accent` | `#f97316` | `src\styles\themes\Preview\coretokens.css` | 28 |
| `--a11y-deuteranopia-c-bg` | `#f6f5fa` | `src\styles\themes\Preview\coretokens.css` | 25 |
| `--a11y-deuteranopia-c-primary` | `#6d28d9` | `src\styles\themes\Preview\coretokens.css` | 27 |
| `--a11y-deuteranopia-c-text` | `#1c1b29` | `src\styles\themes\Preview\coretokens.css` | 26 |
| `--a11y-hc-border` | `var(--a11y-hc-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 142 |
| `--a11y-hc-c-accent` | `#00ffff` | `src\styles\themes\a11y\a11y-high-contrast.css` | 17 |
| `--a11y-hc-c-bg` | `#000000` | `src\styles\themes\a11y\a11y-high-contrast.css` | 14 |
| `--a11y-hc-c-primary` | `#00ff00` | `src\styles\themes\a11y\a11y-high-contrast.css` | 16 |
| `--a11y-hc-c-text` | `#ffffff` | `src\styles\themes\a11y\a11y-high-contrast.css` | 15 |
| `--a11y-high-contrast-c-accent` | `#00ffff` | `src\styles\themes\Preview\coretokens.css` | 34 |
| `--a11y-high-contrast-c-bg` | `#000000` | `src\styles\themes\Preview\coretokens.css` | 31 |
| `--a11y-high-contrast-c-primary` | `#00ff00` | `src\styles\themes\Preview\coretokens.css` | 33 |
| `--a11y-high-contrast-c-text` | `#ffffff` | `src\styles\themes\Preview\coretokens.css` | 32 |
| `--a11y-mono-c-accent` | `#777777` | `src\styles\themes\a11y\a11y-monochrome.css` | 17 |
| `--a11y-mono-c-bg` | `#e6e4e2` | `src\styles\themes\a11y\a11y-monochrome.css` | 14 |
| `--a11y-mono-c-primary` | `#555555` | `src\styles\themes\a11y\a11y-monochrome.css` | 16 |
| `--a11y-mono-c-text` | `#333333` | `src\styles\themes\a11y\a11y-monochrome.css` | 15 |
| `--a11y-monochrome-c-accent` | `#777777` | `src\styles\themes\Preview\coretokens.css` | 40 |
| `--a11y-monochrome-c-bg` | `#e6e4e2` | `src\styles\themes\Preview\coretokens.css` | 37 |
| `--a11y-monochrome-c-primary` | `#555555` | `src\styles\themes\Preview\coretokens.css` | 39 |
| `--a11y-monochrome-c-text` | `#333333` | `src\styles\themes\Preview\coretokens.css` | 38 |
| `--a11y-protanopia-c-accent` | `#f59e0b` | `src\styles\themes\Preview\coretokens.css` | 46 |
| `--a11y-protanopia-c-bg` | `#f5f7fb` | `src\styles\themes\Preview\coretokens.css` | 43 |
| `--a11y-protanopia-c-primary` | `#1e40af` | `src\styles\themes\Preview\coretokens.css` | 45 |
| `--a11y-protanopia-c-text` | `#0f172a` | `src\styles\themes\Preview\coretokens.css` | 44 |
| `--a11y-proto-c-accent` | `#f59e0b` | `src\styles\themes\a11y\a11y-protanopia.css` | 17 |
| `--a11y-proto-c-bg` | `#f5f7fb` | `src\styles\themes\a11y\a11y-protanopia.css` | 14 |
| `--a11y-proto-c-primary` | `#1e40af` | `src\styles\themes\a11y\a11y-protanopia.css` | 16 |
| `--a11y-proto-c-text` | `#0f172a` | `src\styles\themes\a11y\a11y-protanopia.css` | 15 |
| `--a11y-trit-c-accent` | `#06b6d4` | `src\styles\themes\a11y\a11y-tritanopia.css` | 17 |
| `--a11y-trit-c-bg` | `#fdf4ff` | `src\styles\themes\a11y\a11y-tritanopia.css` | 14 |
| `--a11y-trit-c-primary` | `#cc3399` | `src\styles\themes\a11y\a11y-tritanopia.css` | 16 |
| `--a11y-trit-c-text` | `#1e293b` | `src\styles\themes\a11y\a11y-tritanopia.css` | 15 |
| `--a11y-tritanopia-c-accent` | `#06b6d4` | `src\styles\themes\Preview\coretokens.css` | 52 |
| `--a11y-tritanopia-c-bg` | `#fdf4ff` | `src\styles\themes\Preview\coretokens.css` | 49 |
| `--a11y-tritanopia-c-primary` | `#cc3399` | `src\styles\themes\Preview\coretokens.css` | 51 |
| `--a11y-tritanopia-c-text` | `#1e293b` | `src\styles\themes\Preview\coretokens.css` | 50 |
| `--badge-color` | `var(--color-Primary-500)` | `src\components\Badge\Badge.astro` | 271 |
| `--badge-color` | `var(--color-Primary-600)` | `src\components\Badge\Badge.astro` | 276 |
| `--badge-color` | `var(--color-Secondary-600)` | `src\components\Badge\Badge.astro` | 281 |
| `--badge-color` | `var(--color-AccentOne-600)` | `src\components\Badge\Badge.astro` | 286 |
| `--badge-color` | `var(--color-AccentTwo-600)` | `src\components\Badge\Badge.astro` | 291 |
| `--badge-color` | `var(--color-AccentThree-600)` | `src\components\Badge\Badge.astro` | 296 |
| `--badge-color` | `var(--color-AccentFour-600)` | `src\components\Badge\Badge.astro` | 301 |
| `--badge-color` | `var(--color-AccentFive-600)` | `src\components\Badge\Badge.astro` | 306 |
| `--badge-color` | `var(--color-Error)` | `src\components\Badge\Badge.astro` | 311 |
| `--badge-color` | `var(--color-Success)` | `src\components\Badge\Badge.astro` | 316 |
| `--badge-color` | `var(--color-Success)` | `src\components\Badge\Badge.astro` | 321 |
| `--badge-color` | `var(--color-Info, var(--color-Primary-500))` | `src\components\Badge\Badge.astro` | 326 |
| `--bg` | `var(--color-Background-50)` | `docs\Markdown Notes\accessibility-color-themes.md` | 20 |
| `--bg` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 242 |
| `--border-focus` | `var(--color-Info-500)` | `docs\todo\TODO.md` | 369 |
| `--border-interactive` | `var(--color-Primary-500)` | `docs\todo\TODO.md` | 368 |
| `--border-medium` | `var(--color-Neutral-400)` | `docs\todo\TODO.md` | 366 |
| `--border-radius` | `8px !important` | `src\styles\components\a11y-panel.css` | 83 |
| `--border-radius` | `0.5rem` | `src\styles\tokens\spacing.css` | 51 |
| `--border-radius-full` | `9999px` | `src\styles\tokens\spacing.css` | 55 |
| `--border-radius-lg` | `16px !important` | `src\styles\components\a11y-panel.css` | 85 |
| `--border-radius-lg` | `1rem` | `src\styles\tokens\spacing.css` | 53 |
| `--border-radius-md` | `12px !important` | `src\styles\components\a11y-panel.css` | 84 |
| `--border-radius-md` | `0.75rem` | `src\styles\tokens\spacing.css` | 52 |
| `--border-radius-sm` | `4px !important` | `src\styles\components\a11y-panel.css` | 82 |
| `--border-radius-sm` | `0.25rem` | `src\styles\tokens\spacing.css` | 50 |
| `--border-radius-xl` | `24px !important` | `src\styles\components\a11y-panel.css` | 86 |
| `--border-radius-xl` | `1.5rem` | `src\styles\tokens\spacing.css` | 54 |
| `--border-strong` | `var(--color-Neutral-600)` | `docs\todo\TODO.md` | 367 |
| `--border-subtle` | `var(--color-Neutral-200)` | `docs\todo\TODO.md` | 365 |
| `--border-width` | `1px` | `src\styles\tokens\spacing.css` | 46 |
| `--border-width-2` | `2px` | `src\styles\tokens\spacing.css` | 47 |
| `--border-width-4` | `4px` | `src\styles\tokens\spacing.css` | 48 |
| `--brand-accent1` | `#9C8579` | `src\scripts\ThemeTokenGen\brand-template.css` | 13 |
| `--brand-accent1` | `#9C8579` | `src\scripts\ThemeTokenGen\brand-template.css` | 64 |
| `--brand-accent1` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 29 |
| `--brand-accent1` | `#8ac7b2` | `src\scripts\ThemeTokenGen\color-input.css` | 77 |
| `--brand-accent1` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 24 |
| `--brand-accent2` | `#8390b5` | `src\scripts\ThemeTokenGen\brand-template.css` | 68 |
| `--brand-accent2` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 32 |
| `--brand-accent2` | `#c78a9f` | `src\scripts\ThemeTokenGen\color-input.css` | 78 |
| `--brand-accent2` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 32 |
| `--brand-accent3` | `#978692` | `src\scripts\ThemeTokenGen\brand-template.css` | 72 |
| `--brand-accent3` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 33 |
| `--brand-accent3` | `#8abdc7` | `src\scripts\ThemeTokenGen\color-input.css` | 79 |
| `--brand-accent3` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 33 |
| `--brand-accent4` | `#3e4a5a` | `src\scripts\ThemeTokenGen\brand-template.css` | 76 |
| `--brand-accent4` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 36 |
| `--brand-accent4` | `#bdc78a` | `src\scripts\ThemeTokenGen\color-input.css` | 80 |
| `--brand-accent4` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 41 |
| `--brand-accent5` | `#a28aad` | `src\scripts\ThemeTokenGen\brand-template.css` | 80 |
| `--brand-accent5` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 39 |
| `--brand-accent5` | `#938ac7` | `src\scripts\ThemeTokenGen\color-input.css` | 82 |
| `--brand-accent5` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 42 |
| `--brand-background` | `#EEEBE2` | `src\scripts\ThemeTokenGen\brand-template.css` | 43 |
| `--brand-background` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 46 |
| `--brand-background` | `#f2efd4` | `src\scripts\ThemeTokenGen\color-input.css` | 74 |
| `--brand-background` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 47 |
| `--brand-background-dark` | `#394e43` | `src\scripts\ThemeTokenGen\brand-template.css` | 48 |
| `--brand-background-dark` | `#2a3328` | `src\scripts\ThemeTokenGen\color-input.css` | 50 |
| `--brand-background-dark` | `#0e3f2e` | `src\scripts\ThemeTokenGen\color-input.css` | 83 |
| `--brand-background-dark` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 50 |
| `--brand-c-accent` | `#c4907c` | `docs\Markdown Notes\Theme-Preview-System.md` | 29 |
| `--brand-c-accent` | `#c4907c` | `src\styles\themes\brand\BrandDefault.css` | 8 |
| `--brand-c-accent` | `#c4907c` | `src\styles\themes\Preview\coretokens.css` | 58 |
| `--brand-c-bg` | `#f9f8f6` | `docs\Markdown Notes\Theme-Preview-System.md` | 26 |
| `--brand-c-bg` | `#ddd9d3` | `files\example-a11y-cream-NEW.css` | 5 |
| `--brand-c-bg` | `#faf8f7` | `files\example-BrandDefault-NEW.css` | 5 |
| `--brand-c-bg` | `#faf8f7` | `src\styles\themes\brand\BrandDefault.css` | 5 |
| `--brand-c-bg` | `#faf8f7` | `src\styles\themes\Preview\coretokens.css` | 55 |
| `--brand-c-bg-dark` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 33 |
| `--brand-c-bg-dark` | `#394e43` | `files\example-BrandDefault-NEW.css` | 33 |
| `--brand-c-bg-light` | `#ddd9d3` | `files\example-a11y-cream-NEW.css` | 32 |
| `--brand-c-bg-light` | `#ffffff` | `files\example-BrandDefault-NEW.css` | 32 |
| `--brand-c-neutral` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 26 |
| `--brand-c-neutral` | `#c2bdb8` | `files\example-BrandDefault-NEW.css` | 26 |
| `--brand-c-neutral-dark` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 27 |
| `--brand-c-neutral-dark` | `#393531` | `files\example-BrandDefault-NEW.css` | 27 |
| `--brand-c-neutral-light` | `#ddd9d3` | `files\example-a11y-cream-NEW.css` | 25 |
| `--brand-c-neutral-light` | `#e0dedb` | `files\example-BrandDefault-NEW.css` | 25 |
| `--brand-c-primary` | `#8fa68a` | `docs\Markdown Notes\Theme-Preview-System.md` | 28 |
| `--brand-c-primary` | `#8b7355` | `files\example-a11y-cream-NEW.css` | 7 |
| `--brand-c-primary` | `#8fa68a` | `files\example-BrandDefault-NEW.css` | 7 |
| `--brand-c-primary` | `#8fa68a` | `src\styles\themes\brand\BrandDefault.css` | 6 |
| `--brand-c-primary` | `#8fa68a` | `src\styles\themes\Preview\coretokens.css` | 57 |
| `--brand-c-primary-dark` | `#8b7355` | `files\example-a11y-cream-NEW.css` | 14 |
| `--brand-c-primary-dark` | `#556a50` | `files\example-BrandDefault-NEW.css` | 14 |
| `--brand-c-primary-light` | `#8b7355` | `files\example-a11y-cream-NEW.css` | 13 |
| `--brand-c-primary-light` | `#cee6c8` | `files\example-BrandDefault-NEW.css` | 13 |
| `--brand-c-secondary` | `#6b8e7a` | `files\example-a11y-cream-NEW.css` | 8 |
| `--brand-c-secondary` | `#c4907c` | `files\example-BrandDefault-NEW.css` | 8 |
| `--brand-c-secondary-dark` | `#6b8e7a` | `files\example-a11y-cream-NEW.css` | 20 |
| `--brand-c-secondary-dark` | `#855543` | `files\example-BrandDefault-NEW.css` | 20 |
| `--brand-c-secondary-light` | `#6b8e7a` | `files\example-a11y-cream-NEW.css` | 19 |
| `--brand-c-secondary-light` | `#ffcfba` | `files\example-BrandDefault-NEW.css` | 19 |
| `--brand-c-text` | `#474747` | `docs\Markdown Notes\Theme-Preview-System.md` | 27 |
| `--brand-c-text` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 6 |
| `--brand-c-text` | `#474747` | `files\example-BrandDefault-NEW.css` | 6 |
| `--brand-c-text` | `#474747` | `src\styles\themes\brand\BrandDefault.css` | 7 |
| `--brand-c-text` | `#474747` | `src\styles\themes\Preview\coretokens.css` | 56 |
| `--brand-c-text-dark` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 39 |
| `--brand-c-text-dark` | `#262626` | `files\example-BrandDefault-NEW.css` | 39 |
| `--brand-c-text-light` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 38 |
| `--brand-c-text-light` | `#777777` | `files\example-BrandDefault-NEW.css` | 38 |
| `--brand-neutral` | `#FDF8F3` | `src\scripts\ThemeTokenGen\brand-template.css` | 60 |
| `--brand-neutral` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 58 |
| `--brand-neutral` | `#c7948a` | `src\scripts\ThemeTokenGen\color-input.css` | 81 |
| `--brand-neutral` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 58 |
| `--brand-primary` | `#8FA68A` | `src\scripts\ThemeTokenGen\brand-template.css` | 7 |
| `--brand-primary` | `#8FA68A` | `src\scripts\ThemeTokenGen\brand-template.css` | 35 |
| `--brand-primary` | `#8FA68A` | `src\scripts\ThemeTokenGen\color-input.css` | 20 |
| `--brand-primary` | `#86a182` | `src\scripts\ThemeTokenGen\color-input.css` | 75 |
| `--brand-primary` | `#8FA68A` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 15 |
| `--brand-secondary` | `auto` | `src\scripts\ThemeTokenGen\brand-template.css` | 10 |
| `--brand-secondary` | `#C4907C` | `src\scripts\ThemeTokenGen\brand-template.css` | 38 |
| `--brand-secondary` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 28 |
| `--brand-secondary` | `#b9a26e` | `src\scripts\ThemeTokenGen\color-input.css` | 76 |
| `--brand-secondary` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 23 |
| `--brand-text` | `#5A5A5A` | `src\scripts\ThemeTokenGen\brand-template.css` | 56 |
| `--brand-text` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 55 |
| `--brand-text` | `#0e3f2e` | `src\scripts\ThemeTokenGen\color-input.css` | 84 |
| `--brand-text` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 55 |
| `--btn-filled-text` | `var(--color-White)` | `files\example-a11y-cream-NEW.css` | 46 |
| `--btn-filled-text` | `var(--color-White)` | `files\example-BrandDefault-NEW.css` | 46 |
| `--btn-filled-text` | `var(--color-White)` | `src\styles\themes\a11y\a11y-cream.css` | 144 |
| `--btn-filled-text` | `var(--a11y-dark-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 146 |
| `--btn-filled-text` | `var(--color-White)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 144 |
| `--btn-filled-text` | `#000000` | `src\styles\themes\a11y\a11y-high-contrast.css` | 146 |
| `--btn-filled-text` | `var(--color-White)` | `src\styles\themes\a11y\a11y-monochrome.css` | 144 |
| `--btn-filled-text` | `var(--color-White)` | `src\styles\themes\a11y\a11y-protanopia.css` | 144 |
| `--btn-filled-text` | `var(--color-White)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 144 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `files\example-a11y-cream-NEW.css` | 48 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `files\example-BrandDefault-NEW.css` | 48 |
| `--btn-ghost-text` | `var(--a11y-cream-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 146 |
| `--btn-ghost-text` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 148 |
| `--btn-ghost-text` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 146 |
| `--btn-ghost-text` | `var(--a11y-hc-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 148 |
| `--btn-ghost-text` | `var(--a11y-mono-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 146 |
| `--btn-ghost-text` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 146 |
| `--btn-ghost-text` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 146 |
| `--btn-icon-color` | `${iconColor` | `src\components\Button\Button.astro` | 81 |
| `--btn-icon-hover` | `${iconHoverColor` | `src\components\Button\Button.astro` | 82 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `files\example-a11y-cream-NEW.css` | 47 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `files\example-BrandDefault-NEW.css` | 47 |
| `--btn-outline-text` | `var(--a11y-cream-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 145 |
| `--btn-outline-text` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 147 |
| `--btn-outline-text` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 145 |
| `--btn-outline-text` | `var(--a11y-hc-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 147 |
| `--btn-outline-text` | `var(--a11y-mono-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 145 |
| `--btn-outline-text` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 145 |
| `--btn-outline-text` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 145 |
| `--btn-text-color` | `${textColor` | `src\components\Button\Button.astro` | 79 |
| `--btn-text-hover` | `${textHoverColor` | `src\components\Button\Button.astro` | 80 |
| `--card-hover-border` | `${hoverBorder` | `src\components\Masonry\MasonryCards\MasonryCard.astro` | 100 |
| `--color-AccentFive-100` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 130 |
| `--color-AccentFive-100` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 132 |
| `--color-AccentFive-100` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 130 |
| `--color-AccentFive-100` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 130 |
| `--color-AccentFive-100` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 130 |
| `--color-AccentFive-100` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 130 |
| `--color-AccentFive-100` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 130 |
| `--color-AccentFive-100` | `#fdf5ff` | `src\styles\themes\brand\BrandDefault.css` | 108 |
| `--color-AccentFive-200` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 131 |
| `--color-AccentFive-200` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 133 |
| `--color-AccentFive-200` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 131 |
| `--color-AccentFive-200` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 131 |
| `--color-AccentFive-200` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 131 |
| `--color-AccentFive-200` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 131 |
| `--color-AccentFive-200` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 131 |
| `--color-AccentFive-200` | `#fcefff` | `src\styles\themes\brand\BrandDefault.css` | 109 |
| `--color-AccentFive-300` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 132 |
| `--color-AccentFive-300` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 134 |
| `--color-AccentFive-300` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 132 |
| `--color-AccentFive-300` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 132 |
| `--color-AccentFive-300` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 132 |
| `--color-AccentFive-300` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 132 |
| `--color-AccentFive-300` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 132 |
| `--color-AccentFive-300` | `#e2c8ee` | `src\styles\themes\brand\BrandDefault.css` | 110 |
| `--color-AccentFive-400` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 133 |
| `--color-AccentFive-400` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 135 |
| `--color-AccentFive-400` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 133 |
| `--color-AccentFive-400` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 133 |
| `--color-AccentFive-400` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 133 |
| `--color-AccentFive-400` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 133 |
| `--color-AccentFive-400` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 133 |
| `--color-AccentFive-400` | `#c1a9cd` | `src\styles\themes\brand\BrandDefault.css` | 111 |
| `--color-AccentFive-500` | `oklch(0.70 0.14 30)` | `docs\Markdown Notes\accessibility-color-themes.md` | 110 |
| `--color-AccentFive-500` | `oklch(0.62 0.10 350)` | `docs\Markdown Notes\accessibility-color-themes.md` | 186 |
| `--color-AccentFive-500` | `#ff00ff` | `docs\Markdown Notes\accessibility-color-themes.md` | 233 |
| `--color-AccentFive-500` | `oklch(0.62 0.10 300)` | `docs\Markdown Notes\accessibility-color-themes.md` | 267 |
| `--color-AccentFive-500` | `oklch(0.62 0.10 25)` | `docs\Markdown Notes\accessibility-color-themes.md` | 289 |
| `--color-AccentFive-500` | `oklch(0.62 0.10 280)` | `docs\Markdown Notes\accessibility-color-themes.md` | 311 |
| `--color-AccentFive-500` | `oklch(0.55 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 333 |
| `--color-AccentFive-500` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 134 |
| `--color-AccentFive-500` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 136 |
| `--color-AccentFive-500` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 134 |
| `--color-AccentFive-500` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 134 |
| `--color-AccentFive-500` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 134 |
| `--color-AccentFive-500` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 134 |
| `--color-AccentFive-500` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 134 |
| `--color-AccentFive-500` | `#a28aad` | `src\styles\themes\brand\BrandDefault.css` | 112 |
| `--color-AccentFive-600` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 135 |
| `--color-AccentFive-600` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 137 |
| `--color-AccentFive-600` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 135 |
| `--color-AccentFive-600` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 135 |
| `--color-AccentFive-600` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 135 |
| `--color-AccentFive-600` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 135 |
| `--color-AccentFive-600` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 135 |
| `--color-AccentFive-600` | `#846c8e` | `src\styles\themes\brand\BrandDefault.css` | 113 |
| `--color-AccentFive-700` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 136 |
| `--color-AccentFive-700` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 138 |
| `--color-AccentFive-700` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 136 |
| `--color-AccentFive-700` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 136 |
| `--color-AccentFive-700` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 136 |
| `--color-AccentFive-700` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 136 |
| `--color-AccentFive-700` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 136 |
| `--color-AccentFive-700` | `#665070` | `src\styles\themes\brand\BrandDefault.css` | 114 |
| `--color-AccentFive-800` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 137 |
| `--color-AccentFive-800` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 139 |
| `--color-AccentFive-800` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 137 |
| `--color-AccentFive-800` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 137 |
| `--color-AccentFive-800` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 137 |
| `--color-AccentFive-800` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 137 |
| `--color-AccentFive-800` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 137 |
| `--color-AccentFive-800` | `#533d5c` | `src\styles\themes\brand\BrandDefault.css` | 115 |
| `--color-AccentFour-100` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 121 |
| `--color-AccentFour-100` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 123 |
| `--color-AccentFour-100` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 121 |
| `--color-AccentFour-100` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 121 |
| `--color-AccentFour-100` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 121 |
| `--color-AccentFour-100` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 121 |
| `--color-AccentFour-100` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 121 |
| `--color-AccentFour-100` | `#b5b9bf` | `src\styles\themes\brand\BrandDefault.css` | 98 |
| `--color-AccentFour-200` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 122 |
| `--color-AccentFour-200` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 124 |
| `--color-AccentFour-200` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 122 |
| `--color-AccentFour-200` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 122 |
| `--color-AccentFour-200` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 122 |
| `--color-AccentFour-200` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 122 |
| `--color-AccentFour-200` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 122 |
| `--color-AccentFour-200` | `#9aa1aa` | `src\styles\themes\brand\BrandDefault.css` | 99 |
| `--color-AccentFour-300` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 123 |
| `--color-AccentFour-300` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 125 |
| `--color-AccentFour-300` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 123 |
| `--color-AccentFour-300` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 123 |
| `--color-AccentFour-300` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 123 |
| `--color-AccentFour-300` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 123 |
| `--color-AccentFour-300` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 123 |
| `--color-AccentFour-300` | `#768395` | `src\styles\themes\brand\BrandDefault.css` | 100 |
| `--color-AccentFour-400` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 124 |
| `--color-AccentFour-400` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 126 |
| `--color-AccentFour-400` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 124 |
| `--color-AccentFour-400` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 124 |
| `--color-AccentFour-400` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 124 |
| `--color-AccentFour-400` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 124 |
| `--color-AccentFour-400` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 124 |
| `--color-AccentFour-400` | `#596677` | `src\styles\themes\brand\BrandDefault.css` | 101 |
| `--color-AccentFour-500` | `oklch(0.74 0.12 85)` | `docs\Markdown Notes\accessibility-color-themes.md` | 109 |
| `--color-AccentFour-500` | `oklch(0.60 0.10 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 185 |
| `--color-AccentFour-500` | `#ff6600` | `docs\Markdown Notes\accessibility-color-themes.md` | 232 |
| `--color-AccentFour-500` | `oklch(0.75 0.12 90)` | `docs\Markdown Notes\accessibility-color-themes.md` | 266 |
| `--color-AccentFour-500` | `oklch(0.78 0.12 90)` | `docs\Markdown Notes\accessibility-color-themes.md` | 288 |
| `--color-AccentFour-500` | `oklch(0.60 0.18 25)` | `docs\Markdown Notes\accessibility-color-themes.md` | 310 |
| `--color-AccentFour-500` | `oklch(0.65 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 332 |
| `--color-AccentFour-500` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 125 |
| `--color-AccentFour-500` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 127 |
| `--color-AccentFour-500` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 125 |
| `--color-AccentFour-500` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 125 |
| `--color-AccentFour-500` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 125 |
| `--color-AccentFour-500` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 125 |
| `--color-AccentFour-500` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 125 |
| `--color-AccentFour-500` | `#3e4a5a` | `src\styles\themes\brand\BrandDefault.css` | 102 |
| `--color-AccentFour-600` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 126 |
| `--color-AccentFour-600` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 128 |
| `--color-AccentFour-600` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 126 |
| `--color-AccentFour-600` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 126 |
| `--color-AccentFour-600` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 126 |
| `--color-AccentFour-600` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 126 |
| `--color-AccentFour-600` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 126 |
| `--color-AccentFour-600` | `#25303f` | `src\styles\themes\brand\BrandDefault.css` | 103 |
| `--color-AccentFour-700` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 127 |
| `--color-AccentFour-700` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 129 |
| `--color-AccentFour-700` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 127 |
| `--color-AccentFour-700` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 127 |
| `--color-AccentFour-700` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 127 |
| `--color-AccentFour-700` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 127 |
| `--color-AccentFour-700` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 127 |
| `--color-AccentFour-700` | `#0d1825` | `src\styles\themes\brand\BrandDefault.css` | 104 |
| `--color-AccentFour-800` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 128 |
| `--color-AccentFour-800` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 130 |
| `--color-AccentFour-800` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 128 |
| `--color-AccentFour-800` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 128 |
| `--color-AccentFour-800` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 128 |
| `--color-AccentFour-800` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 128 |
| `--color-AccentFour-800` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 128 |
| `--color-AccentFour-800` | `#020815` | `src\styles\themes\brand\BrandDefault.css` | 105 |
| `--color-AccentOne-100` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 94 |
| `--color-AccentOne-100` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 96 |
| `--color-AccentOne-100` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 94 |
| `--color-AccentOne-100` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 94 |
| `--color-AccentOne-100` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 94 |
| `--color-AccentOne-100` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 94 |
| `--color-AccentOne-100` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 94 |
| `--color-AccentOne-100` | `#fef7f3` | `src\styles\themes\brand\BrandDefault.css` | 68 |
| `--color-AccentOne-200` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 95 |
| `--color-AccentOne-200` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 97 |
| `--color-AccentOne-200` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 95 |
| `--color-AccentOne-200` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 95 |
| `--color-AccentOne-200` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 95 |
| `--color-AccentOne-200` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 95 |
| `--color-AccentOne-200` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 95 |
| `--color-AccentOne-200` | `#f3e6e0` | `src\styles\themes\brand\BrandDefault.css` | 69 |
| `--color-AccentOne-300` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 96 |
| `--color-AccentOne-300` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 98 |
| `--color-AccentOne-300` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 96 |
| `--color-AccentOne-300` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 96 |
| `--color-AccentOne-300` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 96 |
| `--color-AccentOne-300` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 96 |
| `--color-AccentOne-300` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 96 |
| `--color-AccentOne-300` | `#dcc3b6` | `src\styles\themes\brand\BrandDefault.css` | 70 |
| `--color-AccentOne-400` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 97 |
| `--color-AccentOne-400` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 99 |
| `--color-AccentOne-400` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 97 |
| `--color-AccentOne-400` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 97 |
| `--color-AccentOne-400` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 97 |
| `--color-AccentOne-400` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 97 |
| `--color-AccentOne-400` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 97 |
| `--color-AccentOne-400` | `#bba397` | `src\styles\themes\brand\BrandDefault.css` | 71 |
| `--color-AccentOne-500` | `oklch(0.70 0.12 145)` | `docs\Markdown Notes\accessibility-color-themes.md` | 106 |
| `--color-AccentOne-500` | `oklch(0.62 0.10 145)` | `docs\Markdown Notes\accessibility-color-themes.md` | 182 |
| `--color-AccentOne-500` | `#00ffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 229 |
| `--color-AccentOne-500` | `oklch(0.70 0.12 195)` | `docs\Markdown Notes\accessibility-color-themes.md` | 263 |
| `--color-AccentOne-500` | `oklch(0.62 0.14 255)` | `docs\Markdown Notes\accessibility-color-themes.md` | 285 |
| `--color-AccentOne-500` | `oklch(0.66 0.14 145)` | `docs\Markdown Notes\accessibility-color-themes.md` | 307 |
| `--color-AccentOne-500` | `oklch(0.70 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 329 |
| `--color-AccentOne-500` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 98 |
| `--color-AccentOne-500` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 100 |
| `--color-AccentOne-500` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 98 |
| `--color-AccentOne-500` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 98 |
| `--color-AccentOne-500` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 98 |
| `--color-AccentOne-500` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 98 |
| `--color-AccentOne-500` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 98 |
| `--color-AccentOne-500` | `#9c8579` | `src\styles\themes\brand\BrandDefault.css` | 72 |
| `--color-AccentOne-600` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 99 |
| `--color-AccentOne-600` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 101 |
| `--color-AccentOne-600` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 99 |
| `--color-AccentOne-600` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 99 |
| `--color-AccentOne-600` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 99 |
| `--color-AccentOne-600` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 99 |
| `--color-AccentOne-600` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 99 |
| `--color-AccentOne-600` | `#7e685c` | `src\styles\themes\brand\BrandDefault.css` | 73 |
| `--color-AccentOne-700` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 100 |
| `--color-AccentOne-700` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 102 |
| `--color-AccentOne-700` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 100 |
| `--color-AccentOne-700` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 100 |
| `--color-AccentOne-700` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 100 |
| `--color-AccentOne-700` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 100 |
| `--color-AccentOne-700` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 100 |
| `--color-AccentOne-700` | `#614c41` | `src\styles\themes\brand\BrandDefault.css` | 74 |
| `--color-AccentOne-800` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 101 |
| `--color-AccentOne-800` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 103 |
| `--color-AccentOne-800` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 101 |
| `--color-AccentOne-800` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 101 |
| `--color-AccentOne-800` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 101 |
| `--color-AccentOne-800` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 101 |
| `--color-AccentOne-800` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 101 |
| `--color-AccentOne-800` | `#4d392f` | `src\styles\themes\brand\BrandDefault.css` | 75 |
| `--color-AccentThree-100` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 112 |
| `--color-AccentThree-100` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 114 |
| `--color-AccentThree-100` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 112 |
| `--color-AccentThree-100` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 112 |
| `--color-AccentThree-100` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 112 |
| `--color-AccentThree-100` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 112 |
| `--color-AccentThree-100` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 112 |
| `--color-AccentThree-100` | `#fcf6fa` | `src\styles\themes\brand\BrandDefault.css` | 88 |
| `--color-AccentThree-200` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 113 |
| `--color-AccentThree-200` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 115 |
| `--color-AccentThree-200` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 113 |
| `--color-AccentThree-200` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 113 |
| `--color-AccentThree-200` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 113 |
| `--color-AccentThree-200` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 113 |
| `--color-AccentThree-200` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 113 |
| `--color-AccentThree-200` | `#f1e8ee` | `src\styles\themes\brand\BrandDefault.css` | 89 |
| `--color-AccentThree-300` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 114 |
| `--color-AccentThree-300` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 116 |
| `--color-AccentThree-300` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 114 |
| `--color-AccentThree-300` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 114 |
| `--color-AccentThree-300` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 114 |
| `--color-AccentThree-300` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 114 |
| `--color-AccentThree-300` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 114 |
| `--color-AccentThree-300` | `#d6c4d1` | `src\styles\themes\brand\BrandDefault.css` | 90 |
| `--color-AccentThree-400` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 115 |
| `--color-AccentThree-400` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 117 |
| `--color-AccentThree-400` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 115 |
| `--color-AccentThree-400` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 115 |
| `--color-AccentThree-400` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 115 |
| `--color-AccentThree-400` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 115 |
| `--color-AccentThree-400` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 115 |
| `--color-AccentThree-400` | `#b6a4b1` | `src\styles\themes\brand\BrandDefault.css` | 91 |
| `--color-AccentThree-500` | `oklch(0.66 0.10 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 108 |
| `--color-AccentThree-500` | `oklch(0.55 0.08 280)` | `docs\Markdown Notes\accessibility-color-themes.md` | 184 |
| `--color-AccentThree-500` | `#00ff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 231 |
| `--color-AccentThree-500` | `oklch(0.60 0.14 250)` | `docs\Markdown Notes\accessibility-color-themes.md` | 265 |
| `--color-AccentThree-500` | `oklch(0.60 0.14 300)` | `docs\Markdown Notes\accessibility-color-themes.md` | 287 |
| `--color-AccentThree-500` | `oklch(0.62 0.16 350)` | `docs\Markdown Notes\accessibility-color-themes.md` | 309 |
| `--color-AccentThree-500` | `oklch(0.50 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 331 |
| `--color-AccentThree-500` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 116 |
| `--color-AccentThree-500` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 118 |
| `--color-AccentThree-500` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 116 |
| `--color-AccentThree-500` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 116 |
| `--color-AccentThree-500` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 116 |
| `--color-AccentThree-500` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 116 |
| `--color-AccentThree-500` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 116 |
| `--color-AccentThree-500` | `#978692` | `src\styles\themes\brand\BrandDefault.css` | 92 |
| `--color-AccentThree-600` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 117 |
| `--color-AccentThree-600` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 119 |
| `--color-AccentThree-600` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 117 |
| `--color-AccentThree-600` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 117 |
| `--color-AccentThree-600` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 117 |
| `--color-AccentThree-600` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 117 |
| `--color-AccentThree-600` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 117 |
| `--color-AccentThree-600` | `#796974` | `src\styles\themes\brand\BrandDefault.css` | 93 |
| `--color-AccentThree-700` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 118 |
| `--color-AccentThree-700` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 120 |
| `--color-AccentThree-700` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 118 |
| `--color-AccentThree-700` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 118 |
| `--color-AccentThree-700` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 118 |
| `--color-AccentThree-700` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 118 |
| `--color-AccentThree-700` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 118 |
| `--color-AccentThree-700` | `#5c4d58` | `src\styles\themes\brand\BrandDefault.css` | 94 |
| `--color-AccentThree-800` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 119 |
| `--color-AccentThree-800` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 121 |
| `--color-AccentThree-800` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 119 |
| `--color-AccentThree-800` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 119 |
| `--color-AccentThree-800` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 119 |
| `--color-AccentThree-800` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 119 |
| `--color-AccentThree-800` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 119 |
| `--color-AccentThree-800` | `#493a45` | `src\styles\themes\brand\BrandDefault.css` | 95 |
| `--color-AccentTwo-100` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 103 |
| `--color-AccentTwo-100` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 105 |
| `--color-AccentTwo-100` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 103 |
| `--color-AccentTwo-100` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 103 |
| `--color-AccentTwo-100` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 103 |
| `--color-AccentTwo-100` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 103 |
| `--color-AccentTwo-100` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 103 |
| `--color-AccentTwo-100` | `#f4f8ff` | `src\styles\themes\brand\BrandDefault.css` | 78 |
| `--color-AccentTwo-200` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 104 |
| `--color-AccentTwo-200` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 106 |
| `--color-AccentTwo-200` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 104 |
| `--color-AccentTwo-200` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 104 |
| `--color-AccentTwo-200` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 104 |
| `--color-AccentTwo-200` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 104 |
| `--color-AccentTwo-200` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 104 |
| `--color-AccentTwo-200` | `#e9f0ff` | `src\styles\themes\brand\BrandDefault.css` | 79 |
| `--color-AccentTwo-300` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 105 |
| `--color-AccentTwo-300` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 107 |
| `--color-AccentTwo-300` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 105 |
| `--color-AccentTwo-300` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 105 |
| `--color-AccentTwo-300` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 105 |
| `--color-AccentTwo-300` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 105 |
| `--color-AccentTwo-300` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 105 |
| `--color-AccentTwo-300` | `#c1cff6` | `src\styles\themes\brand\BrandDefault.css` | 80 |
| `--color-AccentTwo-400` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 106 |
| `--color-AccentTwo-400` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 108 |
| `--color-AccentTwo-400` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 106 |
| `--color-AccentTwo-400` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 106 |
| `--color-AccentTwo-400` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 106 |
| `--color-AccentTwo-400` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 106 |
| `--color-AccentTwo-400` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 106 |
| `--color-AccentTwo-400` | `#a1afd5` | `src\styles\themes\brand\BrandDefault.css` | 81 |
| `--color-AccentTwo-500` | `oklch(0.68 0.13 350)` | `docs\Markdown Notes\accessibility-color-themes.md` | 107 |
| `--color-AccentTwo-500` | `oklch(0.60 0.10 25)` | `docs\Markdown Notes\accessibility-color-themes.md` | 183 |
| `--color-AccentTwo-500` | `#ffff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 230 |
| `--color-AccentTwo-500` | `oklch(0.75 0.14 70)` | `docs\Markdown Notes\accessibility-color-themes.md` | 264 |
| `--color-AccentTwo-500` | `oklch(0.72 0.16 55)` | `docs\Markdown Notes\accessibility-color-themes.md` | 286 |
| `--color-AccentTwo-500` | `oklch(0.74 0.14 80)` | `docs\Markdown Notes\accessibility-color-themes.md` | 308 |
| `--color-AccentTwo-500` | `oklch(0.60 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 330 |
| `--color-AccentTwo-500` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 107 |
| `--color-AccentTwo-500` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 109 |
| `--color-AccentTwo-500` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 107 |
| `--color-AccentTwo-500` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 107 |
| `--color-AccentTwo-500` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 107 |
| `--color-AccentTwo-500` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 107 |
| `--color-AccentTwo-500` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 107 |
| `--color-AccentTwo-500` | `#8390b5` | `src\styles\themes\brand\BrandDefault.css` | 82 |
| `--color-AccentTwo-600` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 108 |
| `--color-AccentTwo-600` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 110 |
| `--color-AccentTwo-600` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 108 |
| `--color-AccentTwo-600` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 108 |
| `--color-AccentTwo-600` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 108 |
| `--color-AccentTwo-600` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 108 |
| `--color-AccentTwo-600` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 108 |
| `--color-AccentTwo-600` | `#667296` | `src\styles\themes\brand\BrandDefault.css` | 83 |
| `--color-AccentTwo-700` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 109 |
| `--color-AccentTwo-700` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 111 |
| `--color-AccentTwo-700` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 109 |
| `--color-AccentTwo-700` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 109 |
| `--color-AccentTwo-700` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 109 |
| `--color-AccentTwo-700` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 109 |
| `--color-AccentTwo-700` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 109 |
| `--color-AccentTwo-700` | `#4a5677` | `src\styles\themes\brand\BrandDefault.css` | 84 |
| `--color-AccentTwo-800` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 110 |
| `--color-AccentTwo-800` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 112 |
| `--color-AccentTwo-800` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 110 |
| `--color-AccentTwo-800` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 110 |
| `--color-AccentTwo-800` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 110 |
| `--color-AccentTwo-800` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 110 |
| `--color-AccentTwo-800` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 110 |
| `--color-AccentTwo-800` | `#384263` | `src\styles\themes\brand\BrandDefault.css` | 85 |
| `--color-Background-100` | `oklch(0.17 0.02 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 61 |
| `--color-Background-100` | `oklch(0.965 0.020 88)` | `docs\Markdown Notes\accessibility-color-themes.md` | 137 |
| `--color-Background-100` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 211 |
| `--color-Background-100` | `oklch(0.948 0.011 95.09)` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 13 |
| `--color-Background-100` | `var(--a11y-cream-c-bg)` | `src\styles\themes\a11y\a11y-cream.css` | 49 |
| `--color-Background-100` | `var(--a11y-dark-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 52 |
| `--color-Background-100` | `var(--a11y-deuter-c-bg)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 49 |
| `--color-Background-100` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 49 |
| `--color-Background-100` | `var(--a11y-mono-c-bg)` | `src\styles\themes\a11y\a11y-monochrome.css` | 49 |
| `--color-Background-100` | `var(--a11y-proto-c-bg)` | `src\styles\themes\a11y\a11y-protanopia.css` | 49 |
| `--color-Background-100` | `var(--a11y-trit-c-bg)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 49 |
| `--color-Background-100` | `#faf8f7` | `src\styles\themes\brand\BrandDefault.css` | 36 |
| `--color-Background-200` | `oklch(0.20 0.02 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 62 |
| `--color-Background-200` | `oklch(0.950 0.022 85)` | `docs\Markdown Notes\accessibility-color-themes.md` | 138 |
| `--color-Background-200` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 212 |
| `--color-Background-200` | `var(--a11y-cream-c-bg)` | `src\styles\themes\a11y\a11y-cream.css` | 50 |
| `--color-Background-200` | `var(--a11y-dark-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 53 |
| `--color-Background-200` | `var(--a11y-deuter-c-bg)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 50 |
| `--color-Background-200` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 50 |
| `--color-Background-200` | `var(--a11y-mono-c-bg)` | `src\styles\themes\a11y\a11y-monochrome.css` | 50 |
| `--color-Background-200` | `var(--a11y-proto-c-bg)` | `src\styles\themes\a11y\a11y-protanopia.css` | 50 |
| `--color-Background-200` | `var(--a11y-trit-c-bg)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 50 |
| `--color-Background-200` | `#d2d1cc` | `src\styles\themes\brand\BrandDefault.css` | 37 |
| `--color-Background-300` | `oklch(0.23 0.02 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 63 |
| `--color-Background-300` | `oklch(0.935 0.025 82)` | `docs\Markdown Notes\accessibility-color-themes.md` | 139 |
| `--color-Background-300` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 213 |
| `--color-Background-300` | `var(--a11y-cream-c-bg)` | `src\styles\themes\a11y\a11y-cream.css` | 51 |
| `--color-Background-300` | `var(--a11y-dark-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 54 |
| `--color-Background-300` | `var(--a11y-deuter-c-bg)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 51 |
| `--color-Background-300` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 51 |
| `--color-Background-300` | `var(--a11y-mono-c-bg)` | `src\styles\themes\a11y\a11y-monochrome.css` | 51 |
| `--color-Background-300` | `var(--a11y-proto-c-bg)` | `src\styles\themes\a11y\a11y-protanopia.css` | 51 |
| `--color-Background-300` | `var(--a11y-trit-c-bg)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 51 |
| `--color-Background-300` | `#b4b1a8` | `src\styles\themes\brand\BrandDefault.css` | 38 |
| `--color-Background-400` | `oklch(0.26 0.02 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 64 |
| `--color-Background-400` | `oklch(0.920 0.028 78)` | `docs\Markdown Notes\accessibility-color-themes.md` | 140 |
| `--color-Background-400` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 214 |
| `--color-Background-400` | `var(--a11y-cream-c-bg)` | `src\styles\themes\a11y\a11y-cream.css` | 52 |
| `--color-Background-400` | `var(--a11y-dark-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 55 |
| `--color-Background-400` | `var(--a11y-deuter-c-bg)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 52 |
| `--color-Background-400` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 52 |
| `--color-Background-400` | `var(--a11y-mono-c-bg)` | `src\styles\themes\a11y\a11y-monochrome.css` | 52 |
| `--color-Background-400` | `var(--a11y-proto-c-bg)` | `src\styles\themes\a11y\a11y-protanopia.css` | 52 |
| `--color-Background-400` | `var(--a11y-trit-c-bg)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 52 |
| `--color-Background-400` | `#95928a` | `src\styles\themes\brand\BrandDefault.css` | 39 |
| `--color-Background-50` | `oklch(0.14 0.02 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 60 |
| `--color-Background-50` | `oklch(0.98 0.015 90)` | `docs\Markdown Notes\accessibility-color-themes.md` | 136 |
| `--color-Background-50` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 210 |
| `--color-Background-50` | `oklch(97.948% 0.01376 88.669)` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 12 |
| `--color-Background-50` | `var(--a11y-cream-c-bg)` | `src\styles\themes\a11y\a11y-cream.css` | 48 |
| `--color-Background-50` | `var(--a11y-dark-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 51 |
| `--color-Background-50` | `var(--a11y-deuter-c-bg)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 48 |
| `--color-Background-50` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 48 |
| `--color-Background-50` | `var(--a11y-mono-c-bg)` | `src\styles\themes\a11y\a11y-monochrome.css` | 48 |
| `--color-Background-50` | `var(--a11y-proto-c-bg)` | `src\styles\themes\a11y\a11y-protanopia.css` | 48 |
| `--color-Background-50` | `var(--a11y-trit-c-bg)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 48 |
| `--color-Background-50` | `#faf8f7` | `src\styles\themes\brand\BrandDefault.css` | 35 |
| `--color-Background-500` | `oklch(0.30 0.02 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 65 |
| `--color-Background-500` | `oklch(0.905 0.030 75)` | `docs\Markdown Notes\accessibility-color-themes.md` | 141 |
| `--color-Background-500` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 215 |
| `--color-Background-500` | `var(--a11y-cream-c-bg)` | `src\styles\themes\a11y\a11y-cream.css` | 53 |
| `--color-Background-500` | `var(--a11y-dark-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 56 |
| `--color-Background-500` | `var(--a11y-deuter-c-bg)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 53 |
| `--color-Background-500` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 53 |
| `--color-Background-500` | `var(--a11y-mono-c-bg)` | `src\styles\themes\a11y\a11y-monochrome.css` | 53 |
| `--color-Background-500` | `var(--a11y-proto-c-bg)` | `src\styles\themes\a11y\a11y-protanopia.css` | 53 |
| `--color-Background-500` | `var(--a11y-trit-c-bg)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 53 |
| `--color-Background-500` | `#77746c` | `src\styles\themes\brand\BrandDefault.css` | 40 |
| `--color-Background-600` | `#5a5754`** (line 41)` | `docs\reports\FIXES-APPLIED.md` | 56 |
| `--color-Background-600` | `#5a5754` | `src\styles\themes\brand\BrandDefault.css` | 41 |
| `--color-Background-700` | `#3e3b39`** (line 42)` | `docs\reports\FIXES-APPLIED.md` | 57 |
| `--color-Background-700` | `#3e3b39` | `src\styles\themes\brand\BrandDefault.css` | 42 |
| `--color-Background-800` | `#2b2927`** (line 43)` | `docs\reports\FIXES-APPLIED.md` | 58 |
| `--color-Background-800` | `#2b2927` | `src\styles\themes\brand\BrandDefault.css` | 43 |
| `--color-Background-900` | `oklch(0.065 0.010 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 71 |
| `--color-Background-900` | `oklch(0.18 0.02 30)` | `docs\Markdown Notes\accessibility-color-themes.md` | 147 |
| `--color-Background-900` | `#1a1918`** (line 44)` | `docs\reports\FIXES-APPLIED.md` | 59 |
| `--color-Background-900` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 62 |
| `--color-Background-900` | `var(--a11y-dark-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 64 |
| `--color-Background-900` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 62 |
| `--color-Background-900` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 62 |
| `--color-Background-900` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 62 |
| `--color-Background-900` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 62 |
| `--color-Background-900` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 62 |
| `--color-Background-900` | `#1a1918` | `src\styles\themes\brand\BrandDefault.css` | 44 |
| `--color-BackgroundDark-600` | `oklch(0.13 0.02 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 67 |
| `--color-BackgroundDark-600` | `oklch(0.40 0.04 45)` | `docs\Markdown Notes\accessibility-color-themes.md` | 143 |
| `--color-BackgroundDark-600` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 58 |
| `--color-BackgroundDark-600` | `var(--a11y-dark-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 61 |
| `--color-BackgroundDark-600` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 58 |
| `--color-BackgroundDark-600` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 58 |
| `--color-BackgroundDark-600` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 58 |
| `--color-BackgroundDark-600` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 58 |
| `--color-BackgroundDark-600` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 58 |
| `--color-BackgroundDark-700` | `oklch(0.11 0.015 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 68 |
| `--color-BackgroundDark-700` | `oklch(0.34 0.04 42)` | `docs\Markdown Notes\accessibility-color-themes.md` | 144 |
| `--color-BackgroundDark-700` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 59 |
| `--color-BackgroundDark-700` | `var(--a11y-dark-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 62 |
| `--color-BackgroundDark-700` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 59 |
| `--color-BackgroundDark-700` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 59 |
| `--color-BackgroundDark-700` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 59 |
| `--color-BackgroundDark-700` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 59 |
| `--color-BackgroundDark-700` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 59 |
| `--color-BackgroundDark-800` | `oklch(0.095 0.012 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 69 |
| `--color-BackgroundDark-800` | `oklch(0.28 0.03 40)` | `docs\Markdown Notes\accessibility-color-themes.md` | 145 |
| `--color-BackgroundDark-800` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 60 |
| `--color-BackgroundDark-800` | `var(--a11y-dark-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 63 |
| `--color-BackgroundDark-800` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 60 |
| `--color-BackgroundDark-800` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 60 |
| `--color-BackgroundDark-800` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 60 |
| `--color-BackgroundDark-800` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 60 |
| `--color-BackgroundDark-800` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 60 |
| `--color-BackgroundDark-900` | `oklch(0.08 0.010 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 70 |
| `--color-BackgroundDark-900` | `oklch(0.22 0.03 35)` | `docs\Markdown Notes\accessibility-color-themes.md` | 146 |
| `--color-BackgroundDark-900` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 61 |
| `--color-BackgroundDark-900` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 61 |
| `--color-BackgroundDark-900` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 61 |
| `--color-BackgroundDark-900` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 61 |
| `--color-BackgroundDark-900` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 61 |
| `--color-BackgroundDark-900` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 61 |
| `--color-Black` | `#121212` | `src\styles\tokens\status.css` | 10 |
| `--color-Danger` | `var(--color-Error)` | `docs\Markdown Notes\accessibility-color-themes.md` | 116 |
| `--color-Danger` | `var(--color-Error)` | `docs\Markdown Notes\accessibility-color-themes.md` | 192 |
| `--color-Danger` | `#ff0000` | `docs\Markdown Notes\accessibility-color-themes.md` | 238 |
| `--color-Danger` | `var(--color-Error)` | `docs\Markdown Notes\accessibility-color-themes.md` | 272 |
| `--color-Danger` | `var(--color-Error)` | `docs\Markdown Notes\accessibility-color-themes.md` | 294 |
| `--color-Danger` | `var(--color-Error)` | `docs\Markdown Notes\accessibility-color-themes.md` | 316 |
| `--color-Danger` | `var(--color-Error)` | `docs\Markdown Notes\accessibility-color-themes.md` | 338 |
| `--color-Error` | `oklch(0.62 0.18 25)` | `docs\Markdown Notes\accessibility-color-themes.md` | 115 |
| `--color-Error` | `oklch(0.56 0.14 25)` | `docs\Markdown Notes\accessibility-color-themes.md` | 191 |
| `--color-Error` | `#ff0000` | `docs\Markdown Notes\accessibility-color-themes.md` | 237 |
| `--color-Error` | `oklch(0.55 0.14 250)` | `docs\Markdown Notes\accessibility-color-themes.md` | 271 |
| `--color-Error` | `oklch(0.62 0.10 25)` | `docs\Markdown Notes\accessibility-color-themes.md` | 293 |
| `--color-Error` | `oklch(0.60 0.18 25)` | `docs\Markdown Notes\accessibility-color-themes.md` | 315 |
| `--color-Error` | `oklch(0.48 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 337 |
| `--color-Error` | `#f44336` | `src\styles\tokens\status.css` | 19 |
| `--color-Error-100` | `${toOKLCH(chroma.hsl(15, 0.4 * satAdjust, 0.92 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1936 |
| `--color-Error-200` | `${toOKLCH(chroma.hsl(15, 0.6 * satAdjust, 0.80 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1937 |
| `--color-Error-500` | `${toOKLCH(chroma.hsl(15, 0.8 * satAdjust, 0.55 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1938 |
| `--color-Info` | `oklch(0.68 0.12 250)` | `docs\Markdown Notes\accessibility-color-themes.md` | 117 |
| `--color-Info` | `oklch(0.56 0.08 250)` | `docs\Markdown Notes\accessibility-color-themes.md` | 193 |
| `--color-Info` | `#00ffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 239 |
| `--color-Info` | `oklch(0.66 0.10 280)` | `docs\Markdown Notes\accessibility-color-themes.md` | 273 |
| `--color-Info` | `oklch(0.62 0.10 300)` | `docs\Markdown Notes\accessibility-color-themes.md` | 295 |
| `--color-Info` | `oklch(0.62 0.16 350)` | `docs\Markdown Notes\accessibility-color-themes.md` | 317 |
| `--color-Info` | `oklch(0.66 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 339 |
| `--color-Info` | `#2196f3` | `src\styles\tokens\status.css` | 20 |
| `--color-Info-100` | `${toOKLCH(chroma.hsl(215, 0.4 * satAdjust, 0.92 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1941 |
| `--color-Info-200` | `${toOKLCH(chroma.hsl(215, 0.6 * satAdjust, 0.80 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1942 |
| `--color-Info-500` | `${toOKLCH(chroma.hsl(215, 0.7 * satAdjust, 0.55 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1943 |
| `--color-Neutral-100` | `var(--a11y-cream-c-bg)` | `src\styles\themes\a11y\a11y-cream.css` | 81 |
| `--color-Neutral-100` | `var(--a11y-dark-c-surface)` | `src\styles\themes\a11y\a11y-dark.css` | 83 |
| `--color-Neutral-100` | `var(--a11y-deuter-c-bg)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 81 |
| `--color-Neutral-100` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 81 |
| `--color-Neutral-100` | `var(--a11y-mono-c-bg)` | `src\styles\themes\a11y\a11y-monochrome.css` | 81 |
| `--color-Neutral-100` | `var(--a11y-proto-c-bg)` | `src\styles\themes\a11y\a11y-protanopia.css` | 81 |
| `--color-Neutral-100` | `var(--a11y-trit-c-bg)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 81 |
| `--color-Neutral-100` | `#faf8f7` | `src\styles\themes\brand\BrandDefault.css` | 61 |
| `--color-Neutral-200` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 82 |
| `--color-Neutral-200` | `var(--a11y-dark-c-surface-raised)` | `src\styles\themes\a11y\a11y-dark.css` | 84 |
| `--color-Neutral-200` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 82 |
| `--color-Neutral-200` | `var(--a11y-hc-c-text)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 82 |
| `--color-Neutral-200` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 82 |
| `--color-Neutral-200` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 82 |
| `--color-Neutral-200` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 82 |
| `--color-Neutral-200` | `#e0dedb` | `src\styles\themes\brand\BrandDefault.css` | 62 |
| `--color-Neutral-300` | `oklch(0.992 0.003 67.83)` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 17 |
| `--color-Neutral-300` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 83 |
| `--color-Neutral-300` | `var(--a11y-dark-c-border)` | `src\styles\themes\a11y\a11y-dark.css` | 85 |
| `--color-Neutral-300` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 83 |
| `--color-Neutral-300` | `var(--a11y-hc-c-text)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 83 |
| `--color-Neutral-300` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 83 |
| `--color-Neutral-300` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 83 |
| `--color-Neutral-300` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 83 |
| `--color-Neutral-300` | `#c2bdb8` | `src\styles\themes\brand\BrandDefault.css` | 63 |
| `--color-Neutral-400` | `oklch(0.984 0.008 73.73)` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 18 |
| `--color-Neutral-400` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 84 |
| `--color-Neutral-400` | `#555` | `src\styles\themes\a11y\a11y-dark.css` | 86 |
| `--color-Neutral-400` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 84 |
| `--color-Neutral-400` | `var(--a11y-hc-c-text)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 84 |
| `--color-Neutral-400` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 84 |
| `--color-Neutral-400` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 84 |
| `--color-Neutral-400` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 84 |
| `--color-Neutral-50` | `var(--a11y-cream-c-bg)` | `src\styles\themes\a11y\a11y-cream.css` | 80 |
| `--color-Neutral-50` | `var(--a11y-dark-c-surface)` | `src\styles\themes\a11y\a11y-dark.css` | 82 |
| `--color-Neutral-50` | `var(--a11y-deuter-c-bg)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 80 |
| `--color-Neutral-50` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 80 |
| `--color-Neutral-50` | `var(--a11y-mono-c-bg)` | `src\styles\themes\a11y\a11y-monochrome.css` | 80 |
| `--color-Neutral-50` | `var(--a11y-proto-c-bg)` | `src\styles\themes\a11y\a11y-protanopia.css` | 80 |
| `--color-Neutral-50` | `var(--a11y-trit-c-bg)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 80 |
| `--color-Neutral-50` | `#faf8f7` | `src\styles\themes\brand\BrandDefault.css` | 60 |
| `--color-Neutral-500` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 85 |
| `--color-Neutral-500` | `#777` | `src\styles\themes\a11y\a11y-dark.css` | 87 |
| `--color-Neutral-500` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 85 |
| `--color-Neutral-500` | `var(--a11y-hc-c-text)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 85 |
| `--color-Neutral-500` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 85 |
| `--color-Neutral-500` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 85 |
| `--color-Neutral-500` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 85 |
| `--color-Neutral-600` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 86 |
| `--color-Neutral-600` | `#999` | `src\styles\themes\a11y\a11y-dark.css` | 88 |
| `--color-Neutral-600` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 86 |
| `--color-Neutral-600` | `var(--a11y-hc-c-text)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 86 |
| `--color-Neutral-600` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 86 |
| `--color-Neutral-600` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 86 |
| `--color-Neutral-600` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 86 |
| `--color-Neutral-700` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 87 |
| `--color-Neutral-700` | `#aaa` | `src\styles\themes\a11y\a11y-dark.css` | 89 |
| `--color-Neutral-700` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 87 |
| `--color-Neutral-700` | `var(--a11y-hc-c-text)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 87 |
| `--color-Neutral-700` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 87 |
| `--color-Neutral-700` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 87 |
| `--color-Neutral-700` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 87 |
| `--color-Neutral-800` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 88 |
| `--color-Neutral-800` | `var(--a11y-dark-c-text)` | `src\styles\themes\a11y\a11y-dark.css` | 90 |
| `--color-Neutral-800` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 88 |
| `--color-Neutral-800` | `var(--a11y-hc-c-text)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 88 |
| `--color-Neutral-800` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 88 |
| `--color-Neutral-800` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 88 |
| `--color-Neutral-800` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 88 |
| `--color-Neutral-800` | `#393531` | `src\styles\themes\brand\BrandDefault.css` | 64 |
| `--color-Neutral-900` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 89 |
| `--color-Neutral-900` | `var(--a11y-dark-c-text)` | `src\styles\themes\a11y\a11y-dark.css` | 91 |
| `--color-Neutral-900` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 89 |
| `--color-Neutral-900` | `var(--a11y-hc-c-text)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 89 |
| `--color-Neutral-900` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 89 |
| `--color-Neutral-900` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 89 |
| `--color-Neutral-900` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 89 |
| `--color-Neutral-900` | `#292624` | `src\styles\themes\brand\BrandDefault.css` | 65 |
| `--color-Primary-100` | `oklch(0.86 0.04 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 85 |
| `--color-Primary-100` | `oklch(0.92 0.04 65)` | `docs\Markdown Notes\accessibility-color-themes.md` | 161 |
| `--color-Primary-100` | `var(--a11y-cream-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 23 |
| `--color-Primary-100` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 26 |
| `--color-Primary-100` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 23 |
| `--color-Primary-100` | `var(--a11y-hc-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 23 |
| `--color-Primary-100` | `var(--a11y-mono-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 23 |
| `--color-Primary-100` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 23 |
| `--color-Primary-100` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 23 |
| `--color-Primary-100` | `#f4fbf2` | `src\styles\themes\brand\BrandDefault.css` | 13 |
| `--color-Primary-200` | `oklch(0.78 0.06 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 86 |
| `--color-Primary-200` | `oklch(0.86 0.06 60)` | `docs\Markdown Notes\accessibility-color-themes.md` | 162 |
| `--color-Primary-200` | `var(--a11y-cream-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 24 |
| `--color-Primary-200` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 27 |
| `--color-Primary-200` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 24 |
| `--color-Primary-200` | `var(--a11y-hc-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 24 |
| `--color-Primary-200` | `var(--a11y-mono-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 24 |
| `--color-Primary-200` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 24 |
| `--color-Primary-200` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 24 |
| `--color-Primary-200` | `#f0fdee` | `src\styles\themes\brand\BrandDefault.css` | 14 |
| `--color-Primary-300` | `oklch(0.70 0.09 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 87 |
| `--color-Primary-300` | `oklch(0.78 0.08 55)` | `docs\Markdown Notes\accessibility-color-themes.md` | 163 |
| `--color-Primary-300` | `var(--a11y-cream-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 25 |
| `--color-Primary-300` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 28 |
| `--color-Primary-300` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 25 |
| `--color-Primary-300` | `var(--a11y-hc-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 25 |
| `--color-Primary-300` | `var(--a11y-mono-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 25 |
| `--color-Primary-300` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 25 |
| `--color-Primary-300` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 25 |
| `--color-Primary-300` | `#cee6c8` | `src\styles\themes\brand\BrandDefault.css` | 15 |
| `--color-Primary-400` | `oklch(0.64 0.12 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 88 |
| `--color-Primary-400` | `oklch(0.70 0.10 50)` | `docs\Markdown Notes\accessibility-color-themes.md` | 164 |
| `--color-Primary-400` | `var(--a11y-cream-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 26 |
| `--color-Primary-400` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 29 |
| `--color-Primary-400` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 26 |
| `--color-Primary-400` | `var(--a11y-hc-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 26 |
| `--color-Primary-400` | `var(--a11y-mono-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 26 |
| `--color-Primary-400` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 26 |
| `--color-Primary-400` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 26 |
| `--color-Primary-400` | `#aec6a9` | `src\styles\themes\brand\BrandDefault.css` | 16 |
| `--color-Primary-50` | `oklch(0.93 0.02 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 84 |
| `--color-Primary-50` | `oklch(0.96 0.02 70)` | `docs\Markdown Notes\accessibility-color-themes.md` | 160 |
| `--color-Primary-50` | `var(--a11y-cream-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 22 |
| `--color-Primary-50` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 25 |
| `--color-Primary-50` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 22 |
| `--color-Primary-50` | `var(--a11y-hc-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 22 |
| `--color-Primary-50` | `var(--a11y-mono-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 22 |
| `--color-Primary-50` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 22 |
| `--color-Primary-50` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 22 |
| `--color-Primary-500` | `oklch(0.58 0.14 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 89 |
| `--color-Primary-500` | `oklch(0.62 0.10 45)` | `docs\Markdown Notes\accessibility-color-themes.md` | 165 |
| `--color-Primary-500` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 226 |
| `--color-Primary-500` | `#8fa68a` | `docs\todo\TODO.md` | 344 |
| `--color-Primary-500` | `oklch(0.699 0.048 140.05)` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 10 |
| `--color-Primary-500` | `var(--a11y-cream-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 27 |
| `--color-Primary-500` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 30 |
| `--color-Primary-500` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 27 |
| `--color-Primary-500` | `var(--a11y-hc-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 27 |
| `--color-Primary-500` | `var(--a11y-mono-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 27 |
| `--color-Primary-500` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 27 |
| `--color-Primary-500` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 27 |
| `--color-Primary-500` | `#8fa68a` | `src\styles\themes\brand\BrandDefault.css` | 17 |
| `--color-Primary-600` | `oklch(0.52 0.13 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 90 |
| `--color-Primary-600` | `oklch(0.54 0.10 40)` | `docs\Markdown Notes\accessibility-color-themes.md` | 166 |
| `--color-Primary-600` | `oklch(0.591 0.041 140.19)` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 11 |
| `--color-Primary-600` | `var(--a11y-cream-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 28 |
| `--color-Primary-600` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 31 |
| `--color-Primary-600` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 28 |
| `--color-Primary-600` | `var(--a11y-hc-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 28 |
| `--color-Primary-600` | `var(--a11y-mono-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 28 |
| `--color-Primary-600` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 28 |
| `--color-Primary-600` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 28 |
| `--color-Primary-600` | `#71876c` | `src\styles\themes\brand\BrandDefault.css` | 18 |
| `--color-Primary-700` | `oklch(0.46 0.11 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 91 |
| `--color-Primary-700` | `oklch(0.46 0.08 38)` | `docs\Markdown Notes\accessibility-color-themes.md` | 167 |
| `--color-Primary-700` | `var(--a11y-cream-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 29 |
| `--color-Primary-700` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 32 |
| `--color-Primary-700` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 29 |
| `--color-Primary-700` | `var(--a11y-hc-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 29 |
| `--color-Primary-700` | `var(--a11y-mono-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 29 |
| `--color-Primary-700` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 29 |
| `--color-Primary-700` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 29 |
| `--color-Primary-700` | `#556a50` | `src\styles\themes\brand\BrandDefault.css` | 19 |
| `--color-Primary-800` | `oklch(0.40 0.09 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 92 |
| `--color-Primary-800` | `oklch(0.38 0.07 35)` | `docs\Markdown Notes\accessibility-color-themes.md` | 168 |
| `--color-Primary-800` | `var(--a11y-cream-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 30 |
| `--color-Primary-800` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 33 |
| `--color-Primary-800` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 30 |
| `--color-Primary-800` | `var(--a11y-hc-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 30 |
| `--color-Primary-800` | `var(--a11y-mono-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 30 |
| `--color-Primary-800` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 30 |
| `--color-Primary-800` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 30 |
| `--color-Primary-800` | `#42563d` | `src\styles\themes\brand\BrandDefault.css` | 20 |
| `--color-Primary-900` | `oklch(0.34 0.07 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 93 |
| `--color-Primary-900` | `oklch(0.30 0.06 32)` | `docs\Markdown Notes\accessibility-color-themes.md` | 169 |
| `--color-Primary-900` | `var(--a11y-cream-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 31 |
| `--color-Primary-900` | `var(--a11y-dark-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 34 |
| `--color-Primary-900` | `var(--a11y-deuter-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 31 |
| `--color-Primary-900` | `var(--a11y-hc-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 31 |
| `--color-Primary-900` | `var(--a11y-mono-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 31 |
| `--color-Primary-900` | `var(--a11y-proto-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 31 |
| `--color-Primary-900` | `var(--a11y-trit-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 31 |
| `--color-Primary-900` | `#364433` | `src\styles\themes\brand\BrandDefault.css` | 21 |
| `--color-Secondary-100` | `oklch(0.88 0.06 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 96 |
| `--color-Secondary-100` | `oklch(0.92 0.04 35)` | `docs\Markdown Notes\accessibility-color-themes.md` | 172 |
| `--color-Secondary-100` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 36 |
| `--color-Secondary-100` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 39 |
| `--color-Secondary-100` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 36 |
| `--color-Secondary-100` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 36 |
| `--color-Secondary-100` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 36 |
| `--color-Secondary-100` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 36 |
| `--color-Secondary-100` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 36 |
| `--color-Secondary-100` | `#fff4ee` | `src\styles\themes\brand\BrandDefault.css` | 24 |
| `--color-Secondary-200` | `oklch(0.80 0.08 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 97 |
| `--color-Secondary-200` | `oklch(0.86 0.06 32)` | `docs\Markdown Notes\accessibility-color-themes.md` | 173 |
| `--color-Secondary-200` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 37 |
| `--color-Secondary-200` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 40 |
| `--color-Secondary-200` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 37 |
| `--color-Secondary-200` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 37 |
| `--color-Secondary-200` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 37 |
| `--color-Secondary-200` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 37 |
| `--color-Secondary-200` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 37 |
| `--color-Secondary-200` | `#fff1e7` | `src\styles\themes\brand\BrandDefault.css` | 25 |
| `--color-Secondary-300` | `oklch(0.72 0.10 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 98 |
| `--color-Secondary-300` | `oklch(0.79 0.08 30)` | `docs\Markdown Notes\accessibility-color-themes.md` | 174 |
| `--color-Secondary-300` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 38 |
| `--color-Secondary-300` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 41 |
| `--color-Secondary-300` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 38 |
| `--color-Secondary-300` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 38 |
| `--color-Secondary-300` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 38 |
| `--color-Secondary-300` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 38 |
| `--color-Secondary-300` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 38 |
| `--color-Secondary-300` | `#ffcfba` | `src\styles\themes\brand\BrandDefault.css` | 26 |
| `--color-Secondary-400` | `oklch(0.66 0.11 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 99 |
| `--color-Secondary-400` | `oklch(0.71 0.10 28)` | `docs\Markdown Notes\accessibility-color-themes.md` | 175 |
| `--color-Secondary-400` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 39 |
| `--color-Secondary-400` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 42 |
| `--color-Secondary-400` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 39 |
| `--color-Secondary-400` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 39 |
| `--color-Secondary-400` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 39 |
| `--color-Secondary-400` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 39 |
| `--color-Secondary-400` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 39 |
| `--color-Secondary-400` | `#e5af9a` | `src\styles\themes\brand\BrandDefault.css` | 27 |
| `--color-Secondary-500` | `oklch(0.60 0.12 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 100 |
| `--color-Secondary-500` | `oklch(0.63 0.10 25)` | `docs\Markdown Notes\accessibility-color-themes.md` | 176 |
| `--color-Secondary-500` | `#ffff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 227 |
| `--color-Secondary-500` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 40 |
| `--color-Secondary-500` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 43 |
| `--color-Secondary-500` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 40 |
| `--color-Secondary-500` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 40 |
| `--color-Secondary-500` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 40 |
| `--color-Secondary-500` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 40 |
| `--color-Secondary-500` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 40 |
| `--color-Secondary-500` | `#c4907c` | `src\styles\themes\brand\BrandDefault.css` | 28 |
| `--color-Secondary-600` | `oklch(0.54 0.10 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 101 |
| `--color-Secondary-600` | `oklch(0.55 0.10 22)` | `docs\Markdown Notes\accessibility-color-themes.md` | 177 |
| `--color-Secondary-600` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 41 |
| `--color-Secondary-600` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 44 |
| `--color-Secondary-600` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 41 |
| `--color-Secondary-600` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 41 |
| `--color-Secondary-600` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 41 |
| `--color-Secondary-600` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 41 |
| `--color-Secondary-600` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 41 |
| `--color-Secondary-600` | `#a4725f` | `src\styles\themes\brand\BrandDefault.css` | 29 |
| `--color-Secondary-700` | `oklch(0.48 0.08 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 102 |
| `--color-Secondary-700` | `oklch(0.47 0.08 20)` | `docs\Markdown Notes\accessibility-color-themes.md` | 178 |
| `--color-Secondary-700` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 42 |
| `--color-Secondary-700` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 45 |
| `--color-Secondary-700` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 42 |
| `--color-Secondary-700` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 42 |
| `--color-Secondary-700` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 42 |
| `--color-Secondary-700` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 42 |
| `--color-Secondary-700` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 42 |
| `--color-Secondary-700` | `#855543` | `src\styles\themes\brand\BrandDefault.css` | 30 |
| `--color-Secondary-800` | `oklch(0.42 0.06 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 103 |
| `--color-Secondary-800` | `oklch(0.39 0.06 18)` | `docs\Markdown Notes\accessibility-color-themes.md` | 179 |
| `--color-Secondary-800` | `var(--a11y-cream-c-accent)` | `src\styles\themes\a11y\a11y-cream.css` | 43 |
| `--color-Secondary-800` | `var(--a11y-dark-c-accent)` | `src\styles\themes\a11y\a11y-dark.css` | 46 |
| `--color-Secondary-800` | `var(--a11y-deuter-c-accent)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 43 |
| `--color-Secondary-800` | `var(--a11y-hc-c-accent)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 43 |
| `--color-Secondary-800` | `var(--a11y-mono-c-accent)` | `src\styles\themes\a11y\a11y-monochrome.css` | 43 |
| `--color-Secondary-800` | `var(--a11y-proto-c-accent)` | `src\styles\themes\a11y\a11y-protanopia.css` | 43 |
| `--color-Secondary-800` | `var(--a11y-trit-c-accent)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 43 |
| `--color-Secondary-800` | `#6f4230` | `src\styles\themes\brand\BrandDefault.css` | 31 |
| `--color-Secondary-900` | `#5a3420` | `docs\reports\color-token-usage-report.md` | 193 |
| `--color-Secondary-900` | `#5a3420` | `docs\reports\color-token-usage-report.md` | 648 |
| `--color-Secondary-900` | `#5a3420` | `docs\reports\color-token-usage-report.md` | 691 |
| `--color-Secondary-900` | `#5a3420`** (line 32)` | `docs\reports\FIXES-APPLIED.md` | 12 |
| `--color-Secondary-900` | `#5a3420` | `docs\todo\TODO.md` | 257 |
| `--color-Secondary-900` | `#5a3420` | `src\styles\themes\brand\BrandDefault.css` | 32 |
| `--color-Success` | `oklch(0.68 0.12 145)` | `docs\Markdown Notes\accessibility-color-themes.md` | 113 |
| `--color-Success` | `oklch(0.56 0.10 145)` | `docs\Markdown Notes\accessibility-color-themes.md` | 189 |
| `--color-Success` | `#00ff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 235 |
| `--color-Success` | `oklch(0.62 0.12 220)` | `docs\Markdown Notes\accessibility-color-themes.md` | 269 |
| `--color-Success` | `oklch(0.62 0.14 255)` | `docs\Markdown Notes\accessibility-color-themes.md` | 291 |
| `--color-Success` | `oklch(0.66 0.14 145)` | `docs\Markdown Notes\accessibility-color-themes.md` | 313 |
| `--color-Success` | `oklch(0.62 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 335 |
| `--color-Success` | `#4caf50` | `src\styles\tokens\status.css` | 17 |
| `--color-Success-100` | `${toOKLCH(chroma.hsl(145, 0.3 * satAdjust, 0.92 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1926 |
| `--color-Success-200` | `${toOKLCH(chroma.hsl(145, 0.5 * satAdjust, 0.80 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1927 |
| `--color-Success-500` | `${toOKLCH(chroma.hsl(145, 0.6 * satAdjust, 0.50 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1928 |
| `--color-Text-100` | `#e8e8e8` | `docs\reports\color-token-usage-report.md` | 692 |
| `--color-Text-100` | `#e8e8e8`** (line 48)` | `docs\reports\FIXES-APPLIED.md` | 16 |
| `--color-Text-100` | `#e8e8e8` | `src\styles\themes\brand\BrandDefault.css` | 48 |
| `--color-Text-200` | `#dbdbdb`** (line 49)` | `docs\reports\FIXES-APPLIED.md` | 20 |
| `--color-Text-200` | `#dbdbdb` | `src\styles\themes\brand\BrandDefault.css` | 49 |
| `--color-Text-300` | `oklch(0.92 0.01 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 74 |
| `--color-Text-300` | `oklch(0.36 0.03 40)` | `docs\Markdown Notes\accessibility-color-themes.md` | 150 |
| `--color-Text-300` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 217 |
| `--color-Text-300` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 68 |
| `--color-Text-300` | `var(--a11y-dark-c-text)` | `src\styles\themes\a11y\a11y-dark.css` | 70 |
| `--color-Text-300` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 68 |
| `--color-Text-300` | `var(--a11y-hc-c-text)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 68 |
| `--color-Text-300` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 68 |
| `--color-Text-300` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 68 |
| `--color-Text-300` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 68 |
| `--color-Text-300` | `#d3d3d3` | `src\styles\themes\brand\BrandDefault.css` | 50 |
| `--color-Text-400` | `oklch(0.88 0.01 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 75 |
| `--color-Text-400` | `oklch(0.33 0.03 38)` | `docs\Markdown Notes\accessibility-color-themes.md` | 151 |
| `--color-Text-400` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 218 |
| `--color-Text-400` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 69 |
| `--color-Text-400` | `var(--a11y-dark-c-text)` | `src\styles\themes\a11y\a11y-dark.css` | 71 |
| `--color-Text-400` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 69 |
| `--color-Text-400` | `var(--a11y-hc-c-text)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 69 |
| `--color-Text-400` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 69 |
| `--color-Text-400` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 69 |
| `--color-Text-400` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 69 |
| `--color-Text-400` | `#b3b3b3` | `src\styles\themes\brand\BrandDefault.css` | 51 |
| `--color-Text-50` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 67 |
| `--color-Text-50` | `var(--a11y-dark-c-text)` | `src\styles\themes\a11y\a11y-dark.css` | 69 |
| `--color-Text-50` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 67 |
| `--color-Text-50` | `var(--a11y-hc-c-text)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 67 |
| `--color-Text-50` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 67 |
| `--color-Text-50` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 67 |
| `--color-Text-50` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 67 |
| `--color-Text-50` | `#f8f8f8` | `src\styles\themes\brand\BrandDefault.css` | 47 |
| `--color-Text-500` | `oklch(0.84 0.01 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 76 |
| `--color-Text-500` | `oklch(0.30 0.03 36)` | `docs\Markdown Notes\accessibility-color-themes.md` | 152 |
| `--color-Text-500` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 219 |
| `--color-Text-500` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 70 |
| `--color-Text-500` | `var(--a11y-dark-c-text)` | `src\styles\themes\a11y\a11y-dark.css` | 72 |
| `--color-Text-500` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 70 |
| `--color-Text-500` | `var(--a11y-hc-c-text)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 70 |
| `--color-Text-500` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 70 |
| `--color-Text-500` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 70 |
| `--color-Text-500` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 70 |
| `--color-Text-500` | `#949494` | `src\styles\themes\brand\BrandDefault.css` | 52 |
| `--color-Text-600` | `oklch(0.78 0.015 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 77 |
| `--color-Text-600` | `oklch(0.27 0.03 34)` | `docs\Markdown Notes\accessibility-color-themes.md` | 153 |
| `--color-Text-600` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 220 |
| `--color-Text-600` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 71 |
| `--color-Text-600` | `var(--a11y-dark-c-text)` | `src\styles\themes\a11y\a11y-dark.css` | 73 |
| `--color-Text-600` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 71 |
| `--color-Text-600` | `var(--a11y-hc-c-text)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 71 |
| `--color-Text-600` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 71 |
| `--color-Text-600` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 71 |
| `--color-Text-600` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 71 |
| `--color-Text-600` | `#777777` | `src\styles\themes\brand\BrandDefault.css` | 53 |
| `--color-Text-700` | `oklch(0.72 0.015 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 78 |
| `--color-Text-700` | `oklch(0.24 0.025 33)` | `docs\Markdown Notes\accessibility-color-themes.md` | 154 |
| `--color-Text-700` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 221 |
| `--color-Text-700` | `#373737` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 14 |
| `--color-Text-700` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 72 |
| `--color-Text-700` | `var(--a11y-dark-c-text)` | `src\styles\themes\a11y\a11y-dark.css` | 74 |
| `--color-Text-700` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 72 |
| `--color-Text-700` | `var(--a11y-hc-c-text)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 72 |
| `--color-Text-700` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 72 |
| `--color-Text-700` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 72 |
| `--color-Text-700` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 72 |
| `--color-Text-700` | `#5a5a5a` | `src\styles\themes\brand\BrandDefault.css` | 54 |
| `--color-Text-800` | `oklch(0.66 0.015 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 79 |
| `--color-Text-800` | `oklch(0.21 0.020 32)` | `docs\Markdown Notes\accessibility-color-themes.md` | 155 |
| `--color-Text-800` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 222 |
| `--color-Text-800` | `#262626` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 15 |
| `--color-Text-800` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 73 |
| `--color-Text-800` | `var(--a11y-dark-c-text)` | `src\styles\themes\a11y\a11y-dark.css` | 75 |
| `--color-Text-800` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 73 |
| `--color-Text-800` | `var(--a11y-hc-c-text)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 73 |
| `--color-Text-800` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 73 |
| `--color-Text-800` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 73 |
| `--color-Text-800` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 73 |
| `--color-Text-800` | `#474747` | `src\styles\themes\brand\BrandDefault.css` | 55 |
| `--color-Text-900` | `oklch(0.60 0.015 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 80 |
| `--color-Text-900` | `oklch(0.18 0.018 30)` | `docs\Markdown Notes\accessibility-color-themes.md` | 156 |
| `--color-Text-900` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 223 |
| `--color-Text-900` | `#181818` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 16 |
| `--color-Text-900` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 74 |
| `--color-Text-900` | `var(--a11y-dark-c-text)` | `src\styles\themes\a11y\a11y-dark.css` | 76 |
| `--color-Text-900` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 74 |
| `--color-Text-900` | `var(--a11y-hc-c-text)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 74 |
| `--color-Text-900` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 74 |
| `--color-Text-900` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 74 |
| `--color-Text-900` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 74 |
| `--color-Text-900` | `#373737` | `src\styles\themes\brand\BrandDefault.css` | 56 |
| `--color-Text-950` | `oklch(0.56 0.015 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 81 |
| `--color-Text-950` | `oklch(0.16 0.016 28)` | `docs\Markdown Notes\accessibility-color-themes.md` | 157 |
| `--color-Text-950` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 224 |
| `--color-Text-950` | `var(--a11y-cream-c-text)` | `src\styles\themes\a11y\a11y-cream.css` | 75 |
| `--color-Text-950` | `var(--a11y-dark-c-text)` | `src\styles\themes\a11y\a11y-dark.css` | 77 |
| `--color-Text-950` | `var(--a11y-deuter-c-text)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 75 |
| `--color-Text-950` | `var(--a11y-hc-c-text)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 75 |
| `--color-Text-950` | `var(--a11y-mono-c-text)` | `src\styles\themes\a11y\a11y-monochrome.css` | 75 |
| `--color-Text-950` | `var(--a11y-proto-c-text)` | `src\styles\themes\a11y\a11y-protanopia.css` | 75 |
| `--color-Text-950` | `var(--a11y-trit-c-text)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 75 |
| `--color-Text-950` | `#262626` | `src\styles\themes\brand\BrandDefault.css` | 57 |
| `--color-Warning` | `oklch(0.76 0.14 85)` | `docs\Markdown Notes\accessibility-color-themes.md` | 114 |
| `--color-Warning` | `oklch(0.72 0.12 70)` | `docs\Markdown Notes\accessibility-color-themes.md` | 190 |
| `--color-Warning` | `#ffff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 236 |
| `--color-Warning` | `oklch(0.78 0.14 85)` | `docs\Markdown Notes\accessibility-color-themes.md` | 270 |
| `--color-Warning` | `oklch(0.72 0.16 55)` | `docs\Markdown Notes\accessibility-color-themes.md` | 292 |
| `--color-Warning` | `oklch(0.74 0.14 80)` | `docs\Markdown Notes\accessibility-color-themes.md` | 314 |
| `--color-Warning` | `oklch(0.78 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 336 |
| `--color-Warning` | `#ff9800` | `src\styles\tokens\status.css` | 18 |
| `--color-Warning-100` | `${toOKLCH(chroma.hsl(45, 0.4 * satAdjust, 0.92 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1931 |
| `--color-Warning-200` | `${toOKLCH(chroma.hsl(45, 0.6 * satAdjust, 0.80 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1932 |
| `--color-Warning-500` | `${toOKLCH(chroma.hsl(45, 0.8 * satAdjust, 0.60 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1933 |
| `--color-White` | `#ffffff` | `src\styles\tokens\status.css` | 11 |
| `--disabledBg` | `color-mix(in oklch, var(--surface) 92%, var(--text) 8%)` | `docs\Markdown Notes\accessibility-color-themes.md` | 46 |
| `--disabledText` | `color-mix(in oklch, var(--text) 45%, transparent)` | `docs\Markdown Notes\accessibility-color-themes.md` | 47 |
| `--dropdown-accent1-border` | `var(--color-AccentOne-500)` | `src\styles\buttons\dropdown-tokens.css` | 42 |
| `--dropdown-accent1-hover-bg` | `var(--color-AccentOne-100)` | `src\styles\buttons\dropdown-tokens.css` | 23 |
| `--dropdown-accent1-hover-text` | `var(--color-AccentOne-800)` | `src\styles\buttons\dropdown-tokens.css` | 24 |
| `--dropdown-accent2-border` | `var(--color-AccentTwo-500)` | `src\styles\buttons\dropdown-tokens.css` | 43 |
| `--dropdown-accent2-hover-bg` | `var(--color-AccentTwo-100)` | `src\styles\buttons\dropdown-tokens.css` | 26 |
| `--dropdown-accent2-hover-text` | `var(--color-AccentTwo-800)` | `src\styles\buttons\dropdown-tokens.css` | 27 |
| `--dropdown-accent3-border` | `var(--color-AccentThree-500)` | `src\styles\buttons\dropdown-tokens.css` | 44 |
| `--dropdown-accent3-hover-bg` | `var(--color-AccentThree-100)` | `src\styles\buttons\dropdown-tokens.css` | 29 |
| `--dropdown-accent3-hover-text` | `var(--color-AccentThree-800)` | `src\styles\buttons\dropdown-tokens.css` | 30 |
| `--dropdown-accent4-border` | `var(--color-AccentFour-500)` | `src\styles\buttons\dropdown-tokens.css` | 45 |
| `--dropdown-accent4-hover-bg` | `var(--color-AccentFour-100)` | `src\styles\buttons\dropdown-tokens.css` | 32 |
| `--dropdown-accent4-hover-text` | `var(--color-AccentFour-800)` | `src\styles\buttons\dropdown-tokens.css` | 33 |
| `--dropdown-accent5-border` | `var(--color-AccentFive-500)` | `src\styles\buttons\dropdown-tokens.css` | 46 |
| `--dropdown-accent5-hover-bg` | `var(--color-AccentFive-100)` | `src\styles\buttons\dropdown-tokens.css` | 35 |
| `--dropdown-accent5-hover-text` | `var(--color-AccentFive-800)` | `src\styles\buttons\dropdown-tokens.css` | 36 |
| `--dropdown-border-color` | `var(--color-Primary-500)` | `src\styles\buttons\dropdown-tokens.css` | 39 |
| `--dropdown-hover-bg` | `var(--color-Primary-100)` | `src\styles\buttons\dropdown-tokens.css` | 9 |
| `--dropdown-hover-text` | `var(--color-Primary-800)` | `src\styles\buttons\dropdown-tokens.css` | 10 |
| `--dropdown-primary-border` | `var(--color-Primary-500)` | `src\styles\buttons\dropdown-tokens.css` | 40 |
| `--dropdown-primary-hover-bg` | `var(--color-Primary-100)` | `src\styles\buttons\dropdown-tokens.css` | 15 |
| `--dropdown-primary-hover-text` | `var(--color-Primary-800)` | `src\styles\buttons\dropdown-tokens.css` | 16 |
| `--dropdown-secondary-border` | `var(--color-Secondary-500)` | `src\styles\buttons\dropdown-tokens.css` | 41 |
| `--dropdown-secondary-hover-bg` | `var(--color-Secondary-100)` | `src\styles\buttons\dropdown-tokens.css` | 19 |
| `--dropdown-secondary-hover-text` | `var(--color-Secondary-800)` | `src\styles\buttons\dropdown-tokens.css` | 20 |
| `--dropdown-selected-bg` | `var(--color-Primary-100)` | `src\styles\buttons\dropdown-tokens.css` | 11 |
| `--dropdown-selected-text` | `var(--color-Primary-800)` | `src\styles\buttons\dropdown-tokens.css` | 12 |
| `--error` | `var(--color-Error)` | `docs\Markdown Notes\accessibility-color-themes.md` | 40 |
| `--feedback-error-bg` | `var(--color-Error)` | `docs\todo\TODO.md` | 382 |
| `--feedback-error-border` | `var(--color-Error)` | `docs\todo\TODO.md` | 384 |
| `--feedback-error-text` | `#7f1d1d` | `docs\todo\TODO.md` | 383 |
| `--feedback-success-bg` | `var(--color-Success)` | `docs\todo\TODO.md` | 379 |
| `--feedback-success-border` | `#10b981` | `docs\todo\TODO.md` | 381 |
| `--feedback-success-text` | `#065f46` | `docs\todo\TODO.md` | 380 |
| `--feedback-warning-bg` | `var(--color-Warning)` | `docs\todo\TODO.md` | 385 |
| `--feedback-warning-text` | `#92400e` | `docs\todo\TODO.md` | 386 |
| `--focus-ring-color` | `CanvasText` | `src\styles\a11y\contrast.css` | 19 |
| `--focus-ring-width` | `3px` | `src\styles\a11y\contrast.css` | 20 |
| `--focusRing` | `var(--color-Info-500)` | `docs\Markdown Notes\accessibility-color-themes.md` | 35 |
| `--focusRing` | `oklch(0.76 0.10 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 123 |
| `--focusRing` | `oklch(0.62 0.10 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 198 |
| `--focusRing` | `#00ffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 248 |
| `--focusRing` | `var(--color-AccentOne-500)` | `docs\Markdown Notes\accessibility-color-themes.md` | 276 |
| `--focusRing` | `var(--color-AccentOne-500)` | `docs\Markdown Notes\accessibility-color-themes.md` | 298 |
| `--focusRing` | `var(--color-AccentOne-500)` | `docs\Markdown Notes\accessibility-color-themes.md` | 320 |
| `--focusRing` | `oklch(0.92 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 343 |
| `--font-secondary` | `'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | `src\styles\tokens\typography.css` | 14 |
| `--form-bg` | `var(--color-White)` | `docs\todo\TODO.md` | 389 |
| `--form-border` | `var(--color-Neutral-300)` | `docs\todo\TODO.md` | 390 |
| `--form-border-error` | `var(--color-Error)` | `docs\todo\TODO.md` | 393 |
| `--form-border-focus` | `var(--color-Primary-500)` | `docs\todo\TODO.md` | 392 |
| `--form-border-hover` | `var(--color-Neutral-400)` | `docs\todo\TODO.md` | 391 |
| `--form-border-success` | `var(--color-Success)` | `docs\todo\TODO.md` | 394 |
| `--form-invalid-bg` | `color-mix(in oklch, var(--feedback-error-bg) 5%, transparent)` | `docs\todo\TODO.md` | 395 |
| `--form-valid-bg` | `color-mix(in oklch, var(--feedback-success-bg) 5%, transparent)` | `docs\todo\TODO.md` | 396 |
| `--glass-bg` | `rgba(255, 255, 255, 0.1)` | `src\styles\tokens\shadows.css` | 80 |
| `--glass-border` | `rgba(255, 255, 255, 0.2)` | `src\styles\tokens\shadows.css` | 81 |
| `--glass-card-bg` | `color-mix(in oklch, var(--color-Background-50) 15%, transparent)` | `src\styles\tokens\shadows.css` | 96 |
| `--glass-card-bg` | `color-mix(in oklch, var(--color-Background-900) 25%, transparent)` | `src\styles\tokens\shadows.css` | 107 |
| `--glass-card-border` | `color-mix(in oklch, var(--color-Background-50) 18%, transparent)` | `src\styles\tokens\shadows.css` | 99 |
| `--glass-card-border` | `color-mix(in oklch, var(--color-Background-50) 10%, transparent)` | `src\styles\tokens\shadows.css` | 108 |
| `--glass-card-shadow` | `0 8px 24px 0 color-mix(in oklch, var(--color-Primary-700) 30%, transparent)` | `src\styles\tokens\shadows.css` | 98 |
| `--glass-overlay-bg` | `color-mix(in oklch, var(--color-Background-50) 5%, transparent)` | `src\styles\tokens\shadows.css` | 91 |
| `--glass-overlay-bg` | `color-mix(in oklch, var(--color-Background-900) 10%, transparent)` | `src\styles\tokens\shadows.css` | 106 |
| `--glass-overlay-blur` | `8px` | `src\styles\tokens\shadows.css` | 92 |
| `--glass-overlay-shadow` | `0 4px 16px 0 color-mix(in oklch, var(--color-Primary-700) 20%, transparent)` | `src\styles\tokens\shadows.css` | 93 |
| `--glass-shadow` | `0 8px 32px 0 rgba(31, 38, 135, 0.37)` | `src\styles\tokens\shadows.css` | 82 |
| `--glass-surface-bg` | `color-mix(in oklch, var(--color-Background-50) 10%, transparent)` | `src\styles\tokens\shadows.css` | 86 |
| `--glass-surface-bg` | `color-mix(in oklch, var(--color-Background-900) 20%, transparent)` | `src\styles\tokens\shadows.css` | 105 |
| `--glass-surface-blur` | `12px` | `src\styles\tokens\shadows.css` | 87 |
| `--glass-surface-shadow` | `0 8px 32px 0 color-mix(in oklch, var(--color-Primary-700) 37%, transparent)` | `src\styles\tokens\shadows.css` | 88 |
| `--glint-gradient` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)` | `src\styles\tokens\shadows.css` | 73 |
| `--glint-gradient-strong` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)` | `src\styles\tokens\shadows.css` | 74 |
| `--glint-gradient-subtle` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)` | `src\styles\tokens\shadows.css` | 75 |
| `--gradient-accent-border` | `linear-gradient(90deg, var(--color-Primary-600) 0%, var(--color-Secondary-600) 100%)` | `src\styles\tokens\gradients.css` | 226 |
| `--gradient-accent1` | `linear-gradient(135deg, var(--color-AccentOne-600) 0%, var(--color-AccentOne-800) 100%)` | `src\styles\tokens\gradients.css` | 99 |
| `--gradient-accent1-glow` | `linear-gradient(135deg, var(--color-AccentOne-200) 0%, var(--color-AccentOne-400) 30%, var(--color-AccentOne-600) 60%, var(--color-AccentOne-800) 100%)` | `src\styles\tokens\gradients.css` | 103 |
| `--gradient-accent1-intense` | `linear-gradient(135deg, var(--color-AccentOne-700) 0%, var(--color-AccentOne-800) 100%)` | `src\styles\tokens\gradients.css` | 102 |
| `--gradient-accent1-light` | `linear-gradient(135deg, var(--color-AccentOne-200) 0%, var(--color-AccentOne-400) 100%)` | `src\styles\tokens\gradients.css` | 101 |
| `--gradient-accent1-soft` | `linear-gradient(135deg, var(--color-AccentOne-400) 0%, var(--color-AccentOne-600) 100%)` | `src\styles\tokens\gradients.css` | 100 |
| `--gradient-accent2` | `linear-gradient(135deg, var(--color-AccentTwo-600) 0%, var(--color-AccentTwo-800) 100%)` | `src\styles\tokens\gradients.css` | 106 |
| `--gradient-accent2-glow` | `linear-gradient(135deg, var(--color-AccentTwo-200) 0%, var(--color-AccentTwo-400) 30%, var(--color-AccentTwo-600) 60%, var(--color-AccentTwo-800) 100%)` | `src\styles\tokens\gradients.css` | 110 |
| `--gradient-accent2-intense` | `linear-gradient(135deg, var(--color-AccentTwo-700) 0%, var(--color-AccentTwo-800) 100%)` | `src\styles\tokens\gradients.css` | 109 |
| `--gradient-accent2-light` | `linear-gradient(135deg, var(--color-AccentTwo-200) 0%, var(--color-AccentTwo-400) 100%)` | `src\styles\tokens\gradients.css` | 108 |
| `--gradient-accent2-soft` | `linear-gradient(135deg, var(--color-AccentTwo-400) 0%, var(--color-AccentTwo-600) 100%)` | `src\styles\tokens\gradients.css` | 107 |
| `--gradient-accent3` | `linear-gradient(135deg, var(--color-AccentThree-600) 0%, var(--color-AccentThree-800) 100%)` | `src\styles\tokens\gradients.css` | 113 |
| `--gradient-accent3-glow` | `linear-gradient(135deg, var(--color-AccentThree-200) 0%, var(--color-AccentThree-400) 30%, var(--color-AccentThree-600) 60%, var(--color-AccentThree-800) 100%)` | `src\styles\tokens\gradients.css` | 117 |
| `--gradient-accent3-intense` | `linear-gradient(135deg, var(--color-AccentThree-700) 0%, var(--color-AccentThree-800) 100%)` | `src\styles\tokens\gradients.css` | 116 |
| `--gradient-accent3-light` | `linear-gradient(135deg, var(--color-AccentThree-200) 0%, var(--color-AccentThree-400) 100%)` | `src\styles\tokens\gradients.css` | 115 |
| `--gradient-accent3-soft` | `linear-gradient(135deg, var(--color-AccentThree-400) 0%, var(--color-AccentThree-600) 100%)` | `src\styles\tokens\gradients.css` | 114 |
| `--gradient-accent4` | `linear-gradient(135deg, var(--color-AccentFour-600) 0%, var(--color-AccentFour-800) 100%)` | `src\styles\tokens\gradients.css` | 120 |
| `--gradient-accent4-glow` | `linear-gradient(135deg, var(--color-AccentFour-200) 0%, var(--color-AccentFour-400) 30%, var(--color-AccentFour-600) 60%, var(--color-AccentFour-800) 100%)` | `src\styles\tokens\gradients.css` | 124 |
| `--gradient-accent4-intense` | `linear-gradient(135deg, var(--color-AccentFour-700) 0%, var(--color-AccentFour-800) 100%)` | `src\styles\tokens\gradients.css` | 123 |
| `--gradient-accent4-light` | `linear-gradient(135deg, var(--color-AccentFour-200) 0%, var(--color-AccentFour-400) 100%)` | `src\styles\tokens\gradients.css` | 122 |
| `--gradient-accent4-soft` | `linear-gradient(135deg, var(--color-AccentFour-400) 0%, var(--color-AccentFour-600) 100%)` | `src\styles\tokens\gradients.css` | 121 |
| `--gradient-accent5` | `linear-gradient(135deg, var(--color-AccentFive-600) 0%, var(--color-AccentFive-800) 100%)` | `src\styles\tokens\gradients.css` | 127 |
| `--gradient-accent5-glow` | `linear-gradient(135deg, var(--color-AccentFive-200) 0%, var(--color-AccentFive-400) 30%, var(--color-AccentFive-600) 60%, var(--color-AccentFive-800) 100%)` | `src\styles\tokens\gradients.css` | 131 |
| `--gradient-accent5-intense` | `linear-gradient(135deg, var(--color-AccentFive-700) 0%, var(--color-AccentFive-800) 100%)` | `src\styles\tokens\gradients.css` | 130 |
| `--gradient-accent5-light` | `linear-gradient(135deg, var(--color-AccentFive-200) 0%, var(--color-AccentFive-400) 100%)` | `src\styles\tokens\gradients.css` | 129 |
| `--gradient-accent5-soft` | `linear-gradient(135deg, var(--color-AccentFive-400) 0%, var(--color-AccentFive-600) 100%)` | `src\styles\tokens\gradients.css` | 128 |
| `--gradient-background-cool` | `linear-gradient(135deg, var(--color-Background-100) 0%, var(--color-Neutral-200) 100%)` | `src\styles\tokens\gradients.css` | 178 |
| `--gradient-background-glow` | `linear-gradient(135deg, var(--color-Background-50) 0%, var(--color-Background-200) 30%, var(--color-Background-300) 60%, var(--color-Neutral-300) 100%)` | `src\styles\tokens\gradients.css` | 183 |
| `--gradient-background-light` | `linear-gradient(135deg, var(--color-Background-50) 0%, var(--color-Background-200) 100%)` | `src\styles\tokens\gradients.css` | 175 |
| `--gradient-background-radial` | `radial-gradient(circle at center, var(--color-Background-50) 0%, var(--color-Background-300) 100%)` | `src\styles\tokens\gradients.css` | 186 |
| `--gradient-background-radial-complex` | `radial-gradient(ellipse at 40% 60%, var(--color-Background-50) 0%, var(--color-Background-200) 40%, var(--color-Neutral-200) 80%, var(--color-Neutral-300) 100%)` | `src\styles\tokens\gradients.css` | 188 |
| `--gradient-background-radial-soft` | `radial-gradient(circle at 30% 30%, var(--color-Background-50) 0%, var(--color-Background-200) 50%, var(--color-Background-400) 100%)` | `src\styles\tokens\gradients.css` | 187 |
| `--gradient-background-rainbow` | `linear-gradient(135deg, var(--color-Background-50) 0%, var(--color-Background-100) 25%, var(--color-Background-200) 50%, var(--color-Background-300) 75%, var(--color-Background-400) 100%)` | `src\styles\tokens\gradients.css` | 181 |
| `--gradient-background-soft` | `linear-gradient(135deg, var(--color-Background-100) 0%, var(--color-Background-300) 100%)` | `src\styles\tokens\gradients.css` | 176 |
| `--gradient-background-warm` | `linear-gradient(135deg, var(--color-Background-200) 0%, var(--color-Background-400) 100%)` | `src\styles\tokens\gradients.css` | 177 |
| `--gradient-background-wave` | `linear-gradient(90deg, var(--color-Background-100) 0%, var(--color-Background-300) 20%, var(--color-Background-200) 40%, var(--color-Background-400) 60%, var(--color-Background-300) 80%, var(--color-Background-500) 100%)` | `src\styles\tokens\gradients.css` | 182 |
| `--gradient-brand-burst` | `radial-gradient(ellipse at 30% 30%, var(--color-Primary-300) 0%, var(--color-Secondary-400) 30%, var(--color-Background-200) 60%, var(--color-Primary-600) 100%)` | `src\styles\tokens\gradients.css` | 156 |
| `--gradient-brand-emerge` | `linear-gradient(135deg, var(--color-Background-50) 0%, var(--color-Primary-400) 50%, var(--color-Secondary-600) 100%)` | `src\styles\tokens\gradients.css` | 146 |
| `--gradient-brand-fade` | `linear-gradient(135deg, var(--color-Primary-600) 0%, var(--color-Secondary-500) 50%, var(--color-Background-200) 100%)` | `src\styles\tokens\gradients.css` | 147 |
| `--gradient-brand-radial` | `radial-gradient(circle at center, var(--color-Background-50) 0%, var(--color-Primary-400) 40%, var(--color-Secondary-600) 80%, var(--color-Background-500) 100%)` | `src\styles\tokens\gradients.css` | 155 |
| `--gradient-btn-ghost-hover` | `linear-gradient(135deg, color-mix(in oklch, var(--color-Text-700) 10%, transparent) 0%, color-mix(in oklch, var(--color-Text-700) 20%, transparent) 100%)` | `src\styles\tokens\gradients.css` | 201 |
| `--gradient-btn-primary` | `var(--gradient-primary)` | `src\styles\tokens\gradients.css` | 194 |
| `--gradient-btn-primary-hover` | `linear-gradient(135deg, var(--color-Primary-400) 0%, var(--color-Primary-600) 100%)` | `src\styles\tokens\gradients.css` | 195 |
| `--gradient-btn-secondary` | `var(--gradient-secondary)` | `src\styles\tokens\gradients.css` | 197 |
| `--gradient-btn-secondary-hover` | `linear-gradient(135deg, var(--color-Secondary-400) 0%, var(--color-Secondary-600) 100%)` | `src\styles\tokens\gradients.css` | 198 |
| `--gradient-deep-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 523 |
| `--gradient-deep-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 865 |
| `--gradient-deep-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 531 |
| `--gradient-deep-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 875 |
| `--gradient-deep-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 539 |
| `--gradient-deep-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 885 |
| `--gradient-deep-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 547 |
| `--gradient-deep-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 895 |
| `--gradient-deep-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 555 |
| `--gradient-deep-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 905 |
| `--gradient-deep-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 507 |
| `--gradient-deep-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 844 |
| `--gradient-deep-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 515 |
| `--gradient-deep-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 855 |
| `--gradient-error` | `linear-gradient(135deg, var(--color-Danger) 0%, color-mix(in oklch, var(--color-Danger) 70%, black) 100%)` | `src\styles\tokens\gradients.css` | 235 |
| `--gradient-header-subtle` | `linear-gradient(180deg, var(--color-Background-300) 0%, var(--color-Background-200) 100%)` | `src\styles\tokens\gradients.css` | 208 |
| `--gradient-light-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 379 |
| `--gradient-light-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 387 |
| `--gradient-light-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 395 |
| `--gradient-light-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 403 |
| `--gradient-light-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 411 |
| `--gradient-light-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 363 |
| `--gradient-light-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 371 |
| `--gradient-overlay-dark` | `linear-gradient(180deg, transparent 0%, color-mix(in oklch, var(--color-Background-900) 70%, transparent) 100%)` | `src\styles\tokens\gradients.css` | 223 |
| `--gradient-overlay-light` | `linear-gradient(180deg, color-mix(in oklch, var(--color-Background-50) 90%, transparent) 0%, transparent 100%)` | `src\styles\tokens\gradients.css` | 224 |
| `--gradient-pastel-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 658 |
| `--gradient-pastel-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 668 |
| `--gradient-pastel-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 678 |
| `--gradient-pastel-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 688 |
| `--gradient-pastel-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 698 |
| `--gradient-pastel-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 637 |
| `--gradient-pastel-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 648 |
| `--gradient-primary` | `linear-gradient(135deg, var(--color-Primary-600) 0%, var(--color-Primary-800) 100%)` | `src\styles\tokens\gradients.css` | 59 |
| `--gradient-primary-glow` | `linear-gradient(135deg, var(--color-Primary-200) 0%, var(--color-Primary-400) 30%, var(--color-Primary-600) 60%, var(--color-Primary-800) 100%)` | `src\styles\tokens\gradients.css` | 67 |
| `--gradient-primary-intense` | `linear-gradient(135deg, var(--color-Primary-700) 0%, var(--color-Primary-900) 100%)` | `src\styles\tokens\gradients.css` | 62 |
| `--gradient-primary-light` | `linear-gradient(135deg, var(--color-Primary-200) 0%, var(--color-Primary-400) 100%)` | `src\styles\tokens\gradients.css` | 61 |
| `--gradient-primary-radial` | `radial-gradient(circle at 30% 40%, var(--color-Primary-400) 0%, var(--color-Primary-800) 100%)` | `src\styles\tokens\gradients.css` | 70 |
| `--gradient-primary-radial-center` | `radial-gradient(circle at center, var(--color-Primary-300) 0%, var(--color-Primary-600) 50%, var(--color-Primary-900) 100%)` | `src\styles\tokens\gradients.css` | 71 |
| `--gradient-primary-radial-complex` | `radial-gradient(ellipse at 20% 30%, var(--color-Primary-200) 0%, var(--color-Primary-500) 40%, var(--color-Primary-700) 80%, var(--color-Primary-900) 100%)` | `src\styles\tokens\gradients.css` | 72 |
| `--gradient-primary-rainbow` | `linear-gradient(135deg, var(--color-Primary-300) 0%, var(--color-Primary-500) 25%, var(--color-Primary-600) 50%, var(--color-Primary-700) 75%, var(--color-Primary-900) 100%)` | `src\styles\tokens\gradients.css` | 65 |
| `--gradient-primary-soft` | `linear-gradient(135deg, var(--color-Primary-400) 0%, var(--color-Primary-600) 100%)` | `src\styles\tokens\gradients.css` | 60 |
| `--gradient-primary-wave` | `linear-gradient(90deg, var(--color-Primary-400) 0%, var(--color-Primary-600) 20%, var(--color-Primary-500) 40%, var(--color-Primary-700) 60%, var(--color-Primary-600) 80%, var(--color-Primary-800) 100%)` | `src\styles\tokens\gradients.css` | 66 |
| `--gradient-rainbow-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 282 |
| `--gradient-rainbow-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 295 |
| `--gradient-rainbow-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 308 |
| `--gradient-rainbow-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 321 |
| `--gradient-rainbow-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 334 |
| `--gradient-rainbow-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 256 |
| `--gradient-rainbow-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 269 |
| `--gradient-secondary` | `linear-gradient(135deg, var(--color-Secondary-600) 0%, var(--color-Secondary-800) 100%)` | `src\styles\tokens\gradients.css` | 79 |
| `--gradient-secondary-glow` | `linear-gradient(135deg, var(--color-Secondary-100) 0%, var(--color-Secondary-400) 30%, var(--color-Secondary-600) 60%, var(--color-Secondary-800) 100%)` | `src\styles\tokens\gradients.css` | 87 |
| `--gradient-secondary-intense` | `linear-gradient(135deg, var(--color-Secondary-700) 0%, var(--color-Secondary-800) 100%)` | `src\styles\tokens\gradients.css` | 82 |
| `--gradient-secondary-light` | `linear-gradient(135deg, var(--color-Secondary-200) 0%, var(--color-Secondary-400) 100%)` | `src\styles\tokens\gradients.css` | 81 |
| `--gradient-secondary-radial` | `radial-gradient(circle at 70% 30%, var(--color-Secondary-400) 0%, var(--color-Secondary-800) 100%)` | `src\styles\tokens\gradients.css` | 90 |
| `--gradient-secondary-radial-center` | `radial-gradient(circle at center, var(--color-Secondary-200) 0%, var(--color-Secondary-500) 50%, var(--color-Secondary-800) 100%)` | `src\styles\tokens\gradients.css` | 91 |
| `--gradient-secondary-radial-complex` | `radial-gradient(ellipse at 80% 20%, var(--color-Secondary-100) 0%, var(--color-Secondary-400) 40%, var(--color-Secondary-600) 80%, var(--color-Secondary-800) 100%)` | `src\styles\tokens\gradients.css` | 92 |
| `--gradient-secondary-rainbow` | `linear-gradient(135deg, var(--color-Secondary-200) 0%, var(--color-Secondary-400) 25%, var(--color-Secondary-500) 50%, var(--color-Secondary-600) 75%, var(--color-Secondary-800) 100%)` | `src\styles\tokens\gradients.css` | 85 |
| `--gradient-secondary-soft` | `linear-gradient(135deg, var(--color-Secondary-400) 0%, var(--color-Secondary-600) 100%)` | `src\styles\tokens\gradients.css` | 80 |
| `--gradient-secondary-wave` | `linear-gradient(90deg, var(--color-Secondary-300) 0%, var(--color-Secondary-500) 20%, var(--color-Secondary-400) 40%, var(--color-Secondary-600) 60%, var(--color-Secondary-500) 80%, var(--color-Secondary-700) 100%)` | `src\styles\tokens\gradients.css` | 86 |
| `--gradient-soft-brand` | `linear-gradient(180deg, var(--color-Background-100) 0%, var(--color-Primary-300) 30%, var(--color-Secondary-400) 70%, var(--color-Background-300) 100%)` | `src\styles\tokens\gradients.css` | 148 |
| `--gradient-subtle` | `linear-gradient(180deg, var(--color-Background-300) 0%, var(--color-Background-100) 100%)` | `src\styles\tokens\gradients.css` | 168 |
| `--gradient-success` | `linear-gradient(135deg, var(--color-Success) 0%, color-mix(in oklch, var(--color-Success) 70%, black) 100%)` | `src\styles\tokens\gradients.css` | 233 |
| `--gradient-vivid-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 451 |
| `--gradient-vivid-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 761 |
| `--gradient-vivid-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 459 |
| `--gradient-vivid-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 771 |
| `--gradient-vivid-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 467 |
| `--gradient-vivid-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 781 |
| `--gradient-vivid-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 475 |
| `--gradient-vivid-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 791 |
| `--gradient-vivid-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 483 |
| `--gradient-vivid-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 801 |
| `--gradient-vivid-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 435 |
| `--gradient-vivid-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 740 |
| `--gradient-vivid-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 443 |
| `--gradient-vivid-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 751 |
| `--gradient-warning` | `linear-gradient(135deg, var(--color-Warning) 0%, color-mix(in oklch, var(--color-Warning) 70%, black) 100%)` | `src\styles\tokens\gradients.css` | 234 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `files\example-a11y-cream-NEW.css` | 45 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `files\example-BrandDefault-NEW.css` | 45 |
| `--hero-overlay-color` | `var(--a11y-cream-c-bg)` | `src\styles\themes\a11y\a11y-cream.css` | 143 |
| `--hero-overlay-color` | `var(--a11y-dark-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 145 |
| `--hero-overlay-color` | `var(--a11y-deuter-c-bg)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 143 |
| `--hero-overlay-color` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 145 |
| `--hero-overlay-color` | `var(--a11y-mono-c-bg)` | `src\styles\themes\a11y\a11y-monochrome.css` | 143 |
| `--hero-overlay-color` | `var(--a11y-proto-c-bg)` | `src\styles\themes\a11y\a11y-protanopia.css` | 143 |
| `--hero-overlay-color` | `var(--a11y-trit-c-bg)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 143 |
| `--img-border-color` | `var(--color-Neutral-200)` | `src\styles\tokens\images.css` | 11 |
| `--img-border-style` | `solid` | `src\styles\tokens\images.css` | 10 |
| `--img-border-width` | `0` | `src\styles\tokens\images.css` | 9 |
| `--img-hover-filter` | `brightness(1.05)` | `src\styles\tokens\images.css` | 37 |
| `--img-hover-scale` | `1.02` | `src\styles\tokens\images.css` | 35 |
| `--img-hover-shadow` | `var(--img-shadow-lg)` | `src\styles\tokens\images.css` | 36 |
| `--img-shadow` | `none` | `src\styles\tokens\images.css` | 20 |
| `--img-shadow-lg` | `0 8px 16px color-mix(in oklch, var(--color-Background-900) 20%, transparent)` | `src\styles\tokens\images.css` | 23 |
| `--img-shadow-md` | `0 4px 8px color-mix(in oklch, var(--color-Background-900) 15%, transparent)` | `src\styles\tokens\images.css` | 22 |
| `--img-shadow-sm` | `0 2px 4px color-mix(in oklch, var(--color-Background-900) 10%, transparent)` | `src\styles\tokens\images.css` | 21 |
| `--interactive-disabled-bg` | `var(--color-Neutral-100)` | `docs\todo\TODO.md` | 375 |
| `--interactive-disabled-text` | `var(--color-Text-400)` | `docs\todo\TODO.md` | 376 |
| `--interactive-primary` | `var(--color-Primary-500)` | `docs\todo\TODO.md` | 372 |
| `--interactive-primary-active` | `var(--color-Primary-700)` | `docs\todo\TODO.md` | 374 |
| `--interactive-primary-hover` | `var(--color-Primary-600)` | `docs\todo\TODO.md` | 373 |
| `--link` | `var(--color-Secondary-500)` | `docs\Markdown Notes\accessibility-color-themes.md` | 30 |
| `--link` | `oklch(0.74 0.12 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 121 |
| `--link` | `oklch(0.42 0.10 45)` | `docs\Markdown Notes\accessibility-color-themes.md` | 196 |
| `--link` | `#ffff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 246 |
| `--link` | `var(--color-AccentTwo-500)` | `docs\Markdown Notes\accessibility-color-themes.md` | 275 |
| `--link` | `var(--color-AccentFour-500)` | `docs\Markdown Notes\accessibility-color-themes.md` | 297 |
| `--link` | `var(--color-AccentTwo-500)` | `docs\Markdown Notes\accessibility-color-themes.md` | 319 |
| `--link` | `oklch(0.80 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 341 |
| `--link` | `hover          /* 38 chars - OK */` | `docs\reports\css-class-names-recommendations.md` | 237 |
| `--link` | `hover {` | `src\styles\components\announcement-ticker.css` | 88 |
| `--link` | `hover {` | `src\styles\components\announcement-ticker.css` | 121 |
| `--linkHover` | `var(--color-Secondary-400)` | `docs\Markdown Notes\accessibility-color-themes.md` | 31 |
| `--linkHover` | `oklch(0.80 0.10 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 122 |
| `--linkHover` | `oklch(0.34 0.10 45)` | `docs\Markdown Notes\accessibility-color-themes.md` | 197 |
| `--linkHover` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 247 |
| `--linkHover` | `oklch(0.92 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 342 |
| `--linkVisited` | `color-mix(in oklch, var(--link) 60%, var(--text) 40%)` | `docs\Markdown Notes\accessibility-color-themes.md` | 32 |
| `--overlay-opacity` | `${overlayOpacity` | `src\components\Presentation\Sections\TitleSection.astro` | 30 |
| `--overlay-opacity` | `${overlayOpacity` | `src\components\Sections\HeroSection.astro` | 73 |
| `--page-bg` | `var(--brand-c-bg)` | `files\example-a11y-cream-NEW.css` | 44 |
| `--page-bg` | `var(--brand-c-bg)` | `files\example-BrandDefault-NEW.css` | 44 |
| `--page-bg` | `var(--a11y-cream-c-bg)` | `src\styles\themes\a11y\a11y-cream.css` | 142 |
| `--page-bg` | `var(--a11y-dark-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 144 |
| `--page-bg` | `var(--a11y-deuter-c-bg)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 142 |
| `--page-bg` | `var(--a11y-hc-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 144 |
| `--page-bg` | `var(--a11y-mono-c-bg)` | `src\styles\themes\a11y\a11y-monochrome.css` | 142 |
| `--page-bg` | `var(--a11y-proto-c-bg)` | `src\styles\themes\a11y\a11y-protanopia.css` | 142 |
| `--page-bg` | `var(--a11y-trit-c-bg)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 142 |
| `--pause-hover` | `hover {` | `src\styles\components\announcement-ticker.css` | 117 |
| `--primary` | `hover {` | `src\components\Presentation\Sections\TitleSection.astro` | 254 |
| `--primary` | `hover .title-section__btn-icon {` | `src\components\Presentation\Sections\TitleSection.astro` | 276 |
| `--print-background` | `var(--color-White)`` | `docs\todo\TODO.md` | 488 |
| `--print-muted` | `var(--color-Neutral-500)`` | `docs\todo\TODO.md` | 489 |
| `--print-text` | `var(--color-Black)`` | `docs\todo\TODO.md` | 487 |
| `--rainbow-border-animation` | `glowloop 8s linear infinite` | `src\styles\tokens\gradients.css` | 44 |
| `--rainbow-border-hover-opacity` | `0.4` | `src\styles\tokens\gradients.css` | 45 |
| `--rainbow-halo-hover-opacity` | `0.83` | `src\styles\tokens\gradients.css` | 46 |
| `--rainbow-hover-accent` | `rgba(128, 225, 204, 0.15)` | `src\styles\tokens\gradients.css` | 51 |
| `--rainbow-hover-cream` | `rgba(255, 248, 237, 0.8)` | `src\styles\tokens\gradients.css` | 52 |
| `--rainbow-hover-primary` | `rgba(255, 153, 200, 0.15)` | `src\styles\tokens\gradients.css` | 49 |
| `--rainbow-hover-secondary` | `rgba(174, 136, 191, 0.15)` | `src\styles\tokens\gradients.css` | 50 |
| `--rainbow-light-gradient-accent` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 35 |
| `--rainbow-light-gradient-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 17 |
| `--rainbow-light-gradient-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 27 |
| `--secondary` | `hover {` | `src\components\Presentation\Sections\TitleSection.astro` | 150 |
| `--secondary` | `hover {` | `src\components\Presentation\Sections\TitleSection.astro` | 265 |
| `--section-title-color` | `${textColor` | `src\components\Typography\SectionTitle.astro` | 112 |
| `--selectionBg` | `color-mix(in oklch, var(--focusRing) 25%, transparent)` | `docs\Markdown Notes\accessibility-color-themes.md` | 44 |
| `--selectionText` | `var(--text)` | `docs\Markdown Notes\accessibility-color-themes.md` | 45 |
| `--shadow` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 158 |
| `--shadow` | `0 1px 3px 0 color-mix(in oklch, var(--color-Background-900) 10%, transparent), 0 1px 2px 0 color-mix(in oklch, var(--color-Background-900) 6%, transparent)` | `src\styles\tokens\shadows.css` | 10 |
| `--shadow-2xl` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 163 |
| `--shadow-2xl` | `0 25px 50px -12px color-mix(in oklch, var(--color-Background-900) 25%, transparent)` | `src\styles\tokens\shadows.css` | 15 |
| `--shadow-base` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 159 |
| `--shadow-base` | `var(--shadow)` | `src\styles\tokens\shadows.css` | 11 |
| `--shadow-btn` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 164 |
| `--shadow-btn` | `0 4px 8px color-mix(in oklch, var(--color-Background-900) 15%, transparent), 0 2px 4px color-mix(in oklch, var(--color-Background-900) 10%, transparent)` | `src\styles\tokens\shadows.css` | 65 |
| `--shadow-btn-hover` | `0 0 12px color-mix(in oklch, var(--a11y-dark-c-primary) 40%, transparent)` | `src\styles\themes\a11y\a11y-dark.css` | 165 |
| `--shadow-btn-hover` | `0 6px 12px color-mix(in oklch, var(--color-Primary-500) 30%, transparent), 0 3px 6px color-mix(in oklch, var(--color-Background-900) 10%, transparent)` | `src\styles\tokens\shadows.css` | 66 |
| `--shadow-dropdown` | `4px 4px 6px color-mix(in oklch, var(--color-Background-900) 20%, transparent), 4px 4px 6px color-mix(in oklch, var(--color-Background-50) 70%, transparent), inset 4px 4px 6px color-mix(in oklch, var(--color-Background-900) 40%, transparent), inset 4px 4px 6px color-mix(in oklch, var(--color-Background-50) 20%, transparent)` | `src\styles\tokens\shadows.css` | 58 |
| `--shadow-dropdown-lg` | `0 8px 16px color-mix(in oklch, var(--color-Background-900) 12%, transparent), 0 4px 8px color-mix(in oklch, var(--color-Background-900) 10%, transparent)` | `src\styles\tokens\shadows.css` | 61 |
| `--shadow-dropdown-md` | `0 4px 8px color-mix(in oklch, var(--color-Background-900) 10%, transparent), 0 2px 4px color-mix(in oklch, var(--color-Background-900) 8%, transparent)` | `src\styles\tokens\shadows.css` | 60 |
| `--shadow-dropdown-sm` | `0 2px 4px color-mix(in oklch, var(--color-Background-900) 8%, transparent), 0 1px 2px color-mix(in oklch, var(--color-Background-900) 6%, transparent)` | `src\styles\tokens\shadows.css` | 59 |
| `--shadow-dropdown-soft` | `4px 4px 6px color-mix(in oklch, var(--color-Background-900) 20%, transparent), -4px -4px 6px color-mix(in oklch, var(--color-Background-50) 60%, transparent), inset 2px 2px 4px color-mix(in oklch, var(--color-Background-900) 15%, transparent), inset -2px -2px 4px color-mix(in oklch, var(--color-Background-50) 30%, transparent)` | `src\styles\tokens\shadows.css` | 62 |
| `--shadow-glow-primary` | `0 0 14px color-mix(in oklch, var(--a11y-dark-c-primary) 50%, transparent)` | `src\styles\themes\a11y\a11y-dark.css` | 166 |
| `--shadow-glow-primary` | `0 0 12px color-mix(in oklch, var(--color-Primary-500) 60%, transparent)` | `src\styles\tokens\shadows.css` | 69 |
| `--shadow-glow-secondary` | `0 0 14px color-mix(in oklch, var(--a11y-dark-c-accent) 50%, transparent)` | `src\styles\themes\a11y\a11y-dark.css` | 167 |
| `--shadow-glow-secondary` | `0 0 12px color-mix(in oklch, var(--color-Secondary-500) 60%, transparent)` | `src\styles\tokens\shadows.css` | 70 |
| `--shadow-inner-2xl` | `inset 0 0 40px 16px` | `src\styles\tokens\shadows.css` | 31 |
| `--shadow-inner-lg` | `inset 0 0 20px 8px` | `src\styles\tokens\shadows.css` | 25 |
| `--shadow-inner-md` | `inset 0 0 10px 4px` | `src\styles\tokens\shadows.css` | 22 |
| `--shadow-inner-sm` | `inset 0 0 6px 2px` | `src\styles\tokens\shadows.css` | 19 |
| `--shadow-inner-xl` | `inset 0 0 30px 12px` | `src\styles\tokens\shadows.css` | 28 |
| `--shadow-lg` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 161 |
| `--shadow-lg` | `0 10px 15px -3px color-mix(in oklch, var(--color-Background-900) 10%, transparent), 0 4px 6px -2px color-mix(in oklch, var(--color-Background-900) 5%, transparent)` | `src\styles\tokens\shadows.css` | 13 |
| `--shadow-md` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 160 |
| `--shadow-md` | `0 4px 6px -1px color-mix(in oklch, var(--color-Background-900) 10%, transparent), 0 2px 4px -1px color-mix(in oklch, var(--color-Background-900) 6%, transparent)` | `src\styles\tokens\shadows.css` | 12 |
| `--shadow-sm` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 157 |
| `--shadow-sm` | `0 1px 2px 0 color-mix(in oklch, var(--color-Background-900) 5%, transparent)` | `src\styles\tokens\shadows.css` | 9 |
| `--shadow-xl` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 162 |
| `--shadow-xl` | `0 20px 25px -5px color-mix(in oklch, var(--color-Background-900) 10%, transparent), 0 10px 10px -5px color-mix(in oklch, var(--color-Background-900) 4%, transparent)` | `src\styles\tokens\shadows.css` | 14 |
| `--shadow-xs` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 156 |
| `--shadow-xs` | `0 1px 2px 0 color-mix(in oklch, var(--color-Background-900) 5%, transparent)` | `src\styles\tokens\shadows.css` | 8 |
| `--slider-color` | `var(--color-Text-900)` | `src\styles\components\presentation\ReaderNav.css` | 407 |
| `--slider-color` | `var(--color-Text-50)` | `src\styles\components\presentation\ReaderNav.css` | 459 |
| `--slider-color` | `var(--color-Text-900)` | `src\styles\components\presentation\ReaderNav.css` | 463 |
| `--state-disabled-opacity` | `0.5` | `docs\todo\TODO.md` | 402 |
| `--state-focus-ring` | `var(--color-Info-500)` | `docs\todo\TODO.md` | 400 |
| `--state-focus-ring-width` | `3px` | `docs\todo\TODO.md` | 401 |
| `--state-hover-bg` | `color-mix(in oklch, var(--interactive-primary) 5%, transparent)` | `docs\todo\TODO.md` | 399 |
| `--success` | `var(--color-Success)` | `docs\Markdown Notes\accessibility-color-themes.md` | 38 |
| `--surface` | `var(--color-Background-100)` | `docs\Markdown Notes\accessibility-color-themes.md` | 21 |
| `--surface` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 243 |
| `--surface-base` | `var(--color-Background-50)` | `docs\todo\TODO.md` | 352 |
| `--surface-elevated` | `var(--color-Background-200)` | `docs\todo\TODO.md` | 354 |
| `--surface-overlay` | `var(--color-Neutral-50)` | `docs\todo\TODO.md` | 355 |
| `--surface-raised` | `var(--color-Background-100)` | `docs\todo\TODO.md` | 353 |
| `--surface2` | `var(--color-Background-200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 22 |
| `--surface3` | `var(--color-Background-300)` | `docs\Markdown Notes\accessibility-color-themes.md` | 23 |
| `--svg-drop-shadow` | `drop-shadow(0 1px 2px color-mix(in oklch, var(--color-Background-900) 20%, transparent))` | `src\styles\tokens\images.css` | 71 |
| `--svg-drop-shadow-md` | `drop-shadow(0 2px 4px color-mix(in oklch, var(--color-Background-900) 25%, transparent))` | `src\styles\tokens\images.css` | 72 |
| `--svg-fill` | `currentColor` | `src\styles\tokens\images.css` | 60 |
| `--svg-hover-filter` | `brightness(1.1)` | `src\styles\tokens\images.css` | 76 |
| `--svg-hover-scale` | `1.1` | `src\styles\tokens\images.css` | 75 |
| `--svg-stroke` | `currentColor` | `src\styles\tokens\images.css` | 61 |
| `--svg-stroke-width` | `1.5` | `src\styles\tokens\images.css` | 62 |
| `--text` | `var(--color-Text-900)` | `docs\Markdown Notes\accessibility-color-themes.md` | 26 |
| `--text` | `var(--color-Text-300)` | `docs\Markdown Notes\accessibility-color-themes.md` | 120 |
| `--text` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 244 |
| `--text-2xl` | `1.5rem` | `src\styles\tokens\typography.css` | 23 |
| `--text-3xl` | `1.875rem` | `src\styles\tokens\typography.css` | 24 |
| `--text-3xl` | `2rem` | `src\styles\tokens\typography.css` | 57 |
| `--text-4xl` | `2rem` | `src\styles\responsive\phone.css` | 9 |
| `--text-4xl` | `2.25rem` | `src\styles\responsive\tablet.css` | 9 |
| `--text-4xl` | `2.25rem` | `src\styles\tokens\typography.css` | 25 |
| `--text-4xl` | `2.5rem` | `src\styles\tokens\typography.css` | 58 |
| `--text-4xl` | `3rem` | `src\styles\tokens\typography.css` | 67 |
| `--text-5xl` | `3.5rem` | `src\styles\responsive\desktop.css` | 9 |
| `--text-5xl` | `4.5rem` | `src\styles\responsive\max.css` | 9 |
| `--text-5xl` | `2.5rem` | `src\styles\responsive\phone.css` | 10 |
| `--text-5xl` | `3rem` | `src\styles\responsive\tablet.css` | 10 |
| `--text-5xl` | `2rem` | `src\styles\responsive\xs.css` | 9 |
| `--text-5xl` | `3rem` | `src\styles\tokens\typography.css` | 26 |
| `--text-5xl` | `3.5rem` | `src\styles\tokens\typography.css` | 59 |
| `--text-5xl` | `4rem` | `src\styles\tokens\typography.css` | 68 |
| `--text-6xl` | `4.5rem` | `src\styles\responsive\desktop.css` | 10 |
| `--text-6xl` | `6rem` | `src\styles\responsive\max.css` | 10 |
| `--text-6xl` | `3rem` | `src\styles\responsive\phone.css` | 11 |
| `--text-6xl` | `3.75rem` | `src\styles\responsive\tablet.css` | 11 |
| `--text-6xl` | `2.5rem` | `src\styles\responsive\xs.css` | 10 |
| `--text-6xl` | `3.75rem` | `src\styles\tokens\typography.css` | 27 |
| `--text-6xl` | `4.5rem` | `src\styles\tokens\typography.css` | 60 |
| `--text-6xl` | `5rem` | `src\styles\tokens\typography.css` | 69 |
| `--text-7xl` | `6rem` | `src\styles\tokens\typography.css` | 28 |
| `--text-base` | `1rem` | `src\styles\tokens\typography.css` | 20 |
| `--text-disabled` | `var(--color-Text-400)` | `docs\todo\TODO.md` | 361 |
| `--text-inverse` | `var(--color-White)` | `docs\todo\TODO.md` | 362 |
| `--text-lg` | `1.125rem` | `src\styles\tokens\typography.css` | 21 |
| `--text-primary` | `var(--color-Text-900)` | `docs\todo\TODO.md` | 358 |
| `--text-secondary` | `var(--color-Text-700)` | `docs\todo\TODO.md` | 359 |
| `--text-sm` | `0.875rem` | `src\styles\tokens\typography.css` | 19 |
| `--text-tertiary` | `var(--color-Text-500)` | `docs\todo\TODO.md` | 360 |
| `--text-xl` | `1.25rem` | `src\styles\tokens\typography.css` | 22 |
| `--text-xs` | `0.75rem` | `src\styles\tokens\typography.css` | 18 |
| `--textMuted` | `var(--color-Text-600)` | `docs\Markdown Notes\accessibility-color-themes.md` | 27 |
| `--textMuted` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 245 |
| `--universal-danger` | `#9c5151` | `src\scripts\ThemeTokenGen\brand-template.css` | 89 |
| `--universal-info` | `#47638f` | `src\scripts\ThemeTokenGen\brand-template.css` | 90 |
| `--universal-success` | `#80a575` | `src\scripts\ThemeTokenGen\brand-template.css` | 87 |
| `--universal-warning` | `#cea96a` | `src\scripts\ThemeTokenGen\brand-template.css` | 88 |
| `--warning` | `var(--color-Warning)` | `docs\Markdown Notes\accessibility-color-themes.md` | 39 |

---

## 🔄 Duplicate Token Values (Same Colour, Different Token Names)

These tokens resolve to the same colour value and may be candidates
for consolidation into base tokens (ally pattern).

| Colour Value | Tokens Using This Value |
|-------------|------------------------|
| `#000000` | `--a11y-hc-c-bg`, `--a11y-high-contrast-c-bg`, `--bg`, `--btn-filled-text`, `--color-Background-100`, `--color-Background-200`, `--color-Background-300`, `--color-Background-400`, `--color-Background-50`, `--color-Background-500`, `--surface` |
| `#00ff00` | `--a11y-hc-c-primary`, `--a11y-high-contrast-c-primary`, `--color-AccentThree-500`, `--color-Success` |
| `#00ffff` | `--a11y-hc-c-accent`, `--a11y-high-contrast-c-accent`, `--color-AccentOne-500`, `--color-Info`, `--focusRing` |
| `#06b6d4` | `--a11y-trit-c-accent`, `--a11y-tritanopia-c-accent` |
| `#0e3f2e` | `--brand-background-dark`, `--brand-text` |
| `#0f172a` | `--a11y-protanopia-c-text`, `--a11y-proto-c-text` |
| `#121212` | `--a11y-dark-c-bg`, `--color-Black` |
| `#1c1b29` | `--a11y-deuter-c-text`, `--a11y-deuteranopia-c-text` |
| `#1e293b` | `--a11y-trit-c-text`, `--a11y-tritanopia-c-text` |
| `#1e40af` | `--a11y-protanopia-c-primary`, `--a11y-proto-c-primary` |
| `#262626` | `--brand-c-text-dark`, `--color-Text-800`, `--color-Text-950` |
| `#333333` | `--a11y-mono-c-text`, `--a11y-monochrome-c-text` |
| `#373737` | `--color-Text-700`, `--color-Text-900` |
| `#393531` | `--brand-c-neutral-dark`, `--color-Neutral-800` |
| `#394e43` | `--brand-background-dark`, `--brand-c-bg-dark` |
| `#3e4a5a` | `--brand-accent4`, `--color-AccentFour-500` |
| `#474747` | `--brand-c-text`, `--color-Text-800` |
| `#4a3f2f` | `--a11y-cream-c-text`, `--brand-c-bg-dark`, `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light` |
| `#555555` | `--a11y-mono-c-primary`, `--a11y-monochrome-c-primary` |
| `#556a50` | `--brand-c-primary-dark`, `--color-Primary-700` |
| `#5a5a5a` | `--brand-text`, `--color-Text-700` |
| `#6b8e7a` | `--a11y-cream-c-accent`, `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light` |
| `#6d28d9` | `--a11y-deuter-c-primary`, `--a11y-deuteranopia-c-primary` |
| `#777777` | `--a11y-mono-c-accent`, `--a11y-monochrome-c-accent`, `--brand-c-text-light`, `--color-Text-600` |
| `#8390b5` | `--brand-accent2`, `--color-AccentTwo-500` |
| `#855543` | `--brand-c-secondary-dark`, `--color-Secondary-700` |
| `#8b7355` | `--a11y-cream-c-primary`, `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light` |
| `#8fa68a` | `--brand-c-primary`, `--brand-primary`, `--color-Primary-500` |
| `#978692` | `--brand-accent3`, `--color-AccentThree-500` |
| `#9c8579` | `--brand-accent1`, `--color-AccentOne-500` |
| `#a28aad` | `--brand-accent5`, `--color-AccentFive-500` |
| `#c2bdb8` | `--brand-c-neutral`, `--color-Neutral-300` |
| `#c4907c` | `--brand-c-accent`, `--brand-c-secondary`, `--brand-secondary`, `--color-Secondary-500` |
| `#cc3399` | `--a11y-trit-c-primary`, `--a11y-tritanopia-c-primary` |
| `#cee6c8` | `--brand-c-primary-light`, `--color-Primary-300` |
| `#ddd9d3` | `--a11y-cream-c-bg`, `--brand-c-bg`, `--brand-c-bg-light`, `--brand-c-neutral-light` |
| `#e0dedb` | `--brand-c-neutral-light`, `--color-Neutral-200` |
| `#e6e4e2` | `--a11y-mono-c-bg`, `--a11y-monochrome-c-bg` |
| `#f59e0b` | `--a11y-protanopia-c-accent`, `--a11y-proto-c-accent` |
| `#f5f7fb` | `--a11y-protanopia-c-bg`, `--a11y-proto-c-bg` |
| `#f6f5fa` | `--a11y-deuter-c-bg`, `--a11y-deuteranopia-c-bg` |
| `#f97316` | `--a11y-deuter-c-accent`, `--a11y-deuteranopia-c-accent` |
| `#faf8f7` | `--brand-c-bg`, `--color-Background-100`, `--color-Background-50`, `--color-Neutral-100`, `--color-Neutral-50` |
| `#fdf4ff` | `--a11y-trit-c-bg`, `--a11y-tritanopia-c-bg` |
| `#ff0000` | `--color-Danger`, `--color-Error` |
| `#ffcfba` | `--brand-c-secondary-light`, `--color-Secondary-300` |
| `#ffff00` | `--color-AccentTwo-500`, `--color-Secondary-500`, `--color-Warning`, `--link` |
| `#ffffff` | `--a11y-hc-c-text`, `--a11y-high-contrast-c-text`, `--brand-c-bg-light`, `--color-Primary-500`, `--color-Text-300`, `--color-Text-400`, `--color-Text-500`, `--color-Text-600`, `--color-Text-700`, `--color-Text-800`, `--color-Text-900`, `--color-Text-950`, `--color-White`, `--linkHover`, `--text`, `--textMuted` |
| `${textcolor` | `--btn-text-color`, `--section-title-color` |
| `0 1px 2px 0 color-mix(in oklch, var(--color-background-900) 5%, transparent)` | `--shadow-sm`, `--shadow-xs` |
| `0.75rem` | `--border-radius-md`, `--text-xs` |
| `1.5rem` | `--border-radius-xl`, `--text-2xl` |
| `1rem` | `--border-radius-lg`, `--text-base` |
| `2.5rem` | `--text-4xl`, `--text-5xl`, `--text-6xl` |
| `2rem` | `--text-3xl`, `--text-4xl`, `--text-5xl` |
| `3px` | `--focus-ring-width`, `--state-focus-ring-width` |
| `3rem` | `--text-4xl`, `--text-5xl`, `--text-6xl` |
| `4.5rem` | `--text-5xl`, `--text-6xl` |
| `6rem` | `--text-6xl`, `--text-7xl` |
| `auto` | `--brand-accent1`, `--brand-accent2`, `--brand-accent3`, `--brand-accent4`, `--brand-accent5`, `--brand-background`, `--brand-background-dark`, `--brand-neutral`, `--brand-secondary`, `--brand-text` |
| `color-mix(in oklch, var(--color-background-50) 10%, transparent)` | `--glass-card-border`, `--glass-surface-bg` |
| `currentcolor` | `--svg-fill`, `--svg-stroke` |
| `hover {` | `--link`, `--pause-hover`, `--primary`, `--secondary` |
| `linear-gradient(` | `--gradient-deep-accent1`, `--gradient-deep-accent2`, `--gradient-deep-accent3`, `--gradient-deep-accent4`, `--gradient-deep-accent5`, `--gradient-deep-primary`, `--gradient-deep-secondary`, `--gradient-light-accent1`, `--gradient-light-accent2`, `--gradient-light-accent3`, `--gradient-light-accent4`, `--gradient-light-accent5`, `--gradient-light-primary`, `--gradient-light-secondary`, `--gradient-pastel-accent1`, `--gradient-pastel-accent2`, `--gradient-pastel-accent3`, `--gradient-pastel-accent4`, `--gradient-pastel-accent5`, `--gradient-pastel-primary`, `--gradient-pastel-secondary`, `--gradient-rainbow-accent1`, `--gradient-rainbow-accent2`, `--gradient-rainbow-accent3`, `--gradient-rainbow-accent4`, `--gradient-rainbow-accent5`, `--gradient-rainbow-primary`, `--gradient-rainbow-secondary`, `--gradient-vivid-accent1`, `--gradient-vivid-accent2`, `--gradient-vivid-accent3`, `--gradient-vivid-accent4`, `--gradient-vivid-accent5`, `--gradient-vivid-primary`, `--gradient-vivid-secondary`, `--rainbow-light-gradient-accent`, `--rainbow-light-gradient-primary`, `--rainbow-light-gradient-secondary` |
| `linear-gradient(135deg, var(--color-primary-400) 0%, var(--color-primary-600) 100%)` | `--gradient-btn-primary-hover`, `--gradient-primary-soft` |
| `linear-gradient(135deg, var(--color-secondary-400) 0%, var(--color-secondary-600) 100%)` | `--gradient-btn-secondary-hover`, `--gradient-secondary-soft` |
| `none` | `--img-shadow`, `--shadow`, `--shadow-2xl`, `--shadow-base`, `--shadow-btn`, `--shadow-lg`, `--shadow-md`, `--shadow-sm`, `--shadow-xl`, `--shadow-xs` |
| `oklch(0.60 0.18 25)` | `--color-AccentFour-500`, `--color-Error` |
| `oklch(0.62 0.10 25)` | `--color-AccentFive-500`, `--color-Error` |
| `oklch(0.62 0.10 300)` | `--color-AccentFive-500`, `--color-Info` |
| `oklch(0.62 0.14 255)` | `--color-AccentOne-500`, `--color-Success` |
| `oklch(0.62 0.16 350)` | `--color-AccentThree-500`, `--color-Info` |
| `oklch(0.66 0.14 145)` | `--color-AccentOne-500`, `--color-Success` |
| `oklch(0.72 0.16 55)` | `--color-AccentTwo-500`, `--color-Warning` |
| `oklch(0.74 0.14 80)` | `--color-AccentTwo-500`, `--color-Warning` |
| `oklch(0.92 0 0)` | `--focusRing`, `--linkHover` |

---

## 🎯 Base Colour Candidates (Ally Pattern)

Based on usage frequency, these are your most important colour values.
These would form your base colour set (like ally's four + black/white).

| Colour Value | Total References | Potential Base Token |
|-------------|-----------------|---------------------|
| `#8fa68a` | 366 | candidate-1 |
| `#faf8f7` | 269 | candidate-2 |
| `#ffffff` | 258 | candidate-3 |
| `0.75rem` | 243 | candidate-4 |
| `white` | 225 | candidate-5 |
| `0.875rem` | 208 | candidate-6 |
| `#71876c` | 173 | candidate-7 |
| `#5a5a5a` | 153 | candidate-8 |
| `#777777` | 144 | candidate-9 |
| `1rem` | 141 | candidate-10 |
| `1.125rem` | 98 | candidate-11 |
| `#556a50` | 95 | candidate-12 |
| `#373737` | 76 | candidate-13 |
| `#949494` | 74 | candidate-14 |
| `1.25rem` | 73 | candidate-15 |
| `1.5rem` | 68 | candidate-16 |
| `#e0dedb` | 59 | candidate-17 |
| `#333333` | 58 | candidate-18 |
| `#474747` | 57 | candidate-19 |
| `#c4907c` | 56 | candidate-20 |

---

## ✅ Recommendations

1. **Tokenise 1217 hardcoded colour values** across 106 files. Start with the most frequently used values and the worst-offending files listed above.

2. **Remove 349 unused token definitions** to reduce dead code and confusion about which tokens are active.

3. **Move 24 inline colour styles** to CSS classes using tokens for consistency and maintainability.

4. **Consolidate 76 duplicate colour values** into shared base tokens following the ally pattern.

5. **Consider reducing to a base colour set** of 10-ish values that all component tokens map back to, matching your ally architecture.
