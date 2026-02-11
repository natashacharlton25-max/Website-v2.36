# CSS Colour Audit Report

**Project:** `C:\Users\Business\Website v2.36`
**Files scanned:** 376
**Files with colour findings:** 199

## Summary

| Metric | Count |
|--------|-------|
| Colour token definitions | 1230 |
| Unique colour tokens defined | 401 |
| Token usages (var references) | 9395 |
| Unique tokens referenced | 408 |
| Hardcoded colour values | 3657 |
| Unique hardcoded values | 350 |
| Inline styles with colours | 28 |
| Tokens defined but NEVER used | 302 |
| Tokens used but NEVER defined | 192 |

---

## 🔴 Hardcoded Colours (Need Tokenising)

These are colour values written directly in files instead of using tokens.

| Colour Value | Times Used | Files | Suggested Action |
|-------------|------------|-------|-----------------|
| `white` | 484 | 68 | Create new token — used frequently |
| `#ffffff` | 173 | 21 | Replace with `var(--color-White)` |
| `black` | 89 | 17 | Create new token — used frequently |
| `#333333` | 83 | 8 | Replace with `var(--a11y-mono-c-text)` |
| `#000000` | 74 | 10 | Replace with `var(--bg)` |
| `#8fa68a` | 60 | 12 | Replace with `var(--brand-primary)` |
| `#4a3f2f` | 49 | 6 | Replace with `var(--a11y-cream-c-text)` |
| `rgba(0, 0, 0, 0.1)` | 33 | 11 | Create new token — used frequently |
| `#c4907c` | 30 | 7 | Create new token — used frequently |
| `rgba(0, 0, 0, 0.15)` | 30 | 10 | Create new token — used frequently |
| `#8b9d83` | 27 | 3 | Create new token — used frequently |
| `#faf8f7` | 25 | 4 | Create new token — used frequently |
| `#5a3420` | 25 | 4 | Create new token — used frequently |
| `#474747` | 24 | 6 | Create new token — used frequently |
| `#777777` | 23 | 6 | Replace with `var(--brand-c-text-light)` |
| `#6b8e7a` | 23 | 4 | Replace with `var(--a11y-cream-c-accent)` |
| `rgba(0, 0, 0, 0.2)` | 23 | 7 | Create new token — used frequently |
| `green` | 23 | 5 | Create new token — used frequently |
| `#8b6914` | 22 | 5 | Create new token — used frequently |
| `#ddd9d3` | 22 | 4 | Replace with `var(--a11y-cream-c-bg)` |
| `#8b7355` | 22 | 4 | Replace with `var(--a11y-cream-c-primary)` |
| `#666666` | 20 | 6 | Create new token — used frequently |
| `#bdbab3` | 20 | 6 | Create new token — used frequently |
| `#f59e0b` | 20 | 5 | Replace with `var(--a11y-proto-c-accent)` |
| `#00ffff` | 20 | 4 | Replace with `var(--a11y-hc-c-accent)` |
| `rgba(0,0,0,0.1)` | 20 | 6 | Create new token — used frequently |
| `#f5f5f5` | 19 | 7 | Create new token — used frequently |
| `#1a1a1a` | 18 | 4 | Create new token — used frequently |
| `#121212` | 18 | 5 | Replace with `var(--color-Black)` |
| `#555555` | 18 | 5 | Replace with `var(--a11y-mono-c-primary)` |
| `#e6e2da` | 17 | 5 | Create new token — used frequently |
| `#00ff00` | 17 | 4 | Replace with `var(--a11y-hc-c-primary)` |
| `#ccd3da` | 17 | 5 | Replace with `var(--a11y-dark-c-text)` |
| `rgba(255, 255, 255, 0.1)` | 17 | 5 | Replace with `var(--glass-bg)` |
| `#dc2626` | 16 | 2 | Create new token — used frequently |
| `#fff` | 16 | 4 | Create new token — used frequently |
| `#e0dedb` | 16 | 4 | Replace with `var(--brand-c-neutral-light)` |
| `rgba(255, 255, 255, 0.15)` | 16 | 5 | Create new token — used frequently |
| `rgba(0, 0, 0, 0.25)` | 16 | 4 | Create new token — used frequently |
| `hsl((h + offset)` | 16 | 3 | Create new token — used frequently |
| `#9c8579` | 15 | 3 | Create new token — used frequently |
| `#556a50` | 15 | 4 | Replace with `var(--brand-c-primary-dark)` |
| `#ffff00` | 15 | 2 | Create new token — used frequently |
| `rgba(0, 0, 0, 0.06)` | 15 | 5 | Create new token — used frequently |
| `rgba(0, 0, 0, 0.04)` | 15 | 5 | Create new token — used frequently |
| `#f9f8f6` | 14 | 5 | Create new token — used frequently |
| `#2dd4bf` | 14 | 2 | Create new token — used frequently |
| `#393531` | 14 | 4 | Replace with `var(--brand-c-neutral-dark)` |
| `#1c1b29` | 14 | 3 | Replace with `var(--a11y-deuter-c-text)` |
| `#0f172a` | 14 | 3 | Replace with `var(--a11y-proto-c-text)` |
| `#1e293b` | 14 | 3 | Replace with `var(--a11y-trit-c-text)` |
| `rgba(0,0,0,0.15)` | 14 | 4 | Create new token — used frequently |
| `#8390b5` | 13 | 3 | Create new token — used frequently |
| `#978692` | 13 | 4 | Create new token — used frequently |
| `#272596` | 13 | 4 | Replace with `var(--a11y-dark-c-accent)` |
| `#262626` | 13 | 4 | Replace with `var(--brand-c-text-dark)` |
| `#ff99c8` | 13 | 3 | Create new token — used frequently |
| `#e9bc88` | 13 | 3 | Create new token — used frequently |
| `#f4fbf2` | 12 | 4 | Create new token — used frequently |
| `#666` | 12 | 5 | Create new token — used frequently |
| `#ddd` | 12 | 5 | Create new token — used frequently |
| `#c5e1a5` | 12 | 4 | Replace with `var(--a11y-dark-c-primary)` |
| `#ae88bf` | 12 | 3 | Create new token — used frequently |
| `#80e1cc` | 12 | 3 | Create new token — used frequently |
| `#394e43` | 12 | 4 | Replace with `var(--brand-c-bg-dark)` |
| `rgba(0, 0, 0, 0.08)` | 12 | 6 | Create new token — used frequently |
| `rgba(0,0,0,0.3)` | 12 | 4 | Create new token — used frequently |
| `#22c55e` | 11 | 3 | Create new token — used frequently |
| `#ef4444` | 11 | 3 | Create new token — used frequently |
| `#3b82f6` | 11 | 3 | Create new token — used frequently |
| `#555` | 11 | 3 | Create new token — used frequently |
| `#999` | 11 | 4 | Create new token — used frequently |
| `#4caf50` | 11 | 4 | Replace with `var(--color-Success)` |
| `#f6f5fa` | 11 | 3 | Replace with `var(--a11y-deuter-c-bg)` |
| `#6d28d9` | 11 | 3 | Replace with `var(--a11y-deuter-c-primary)` |
| `#f97316` | 11 | 3 | Replace with `var(--a11y-deuter-c-accent)` |
| `#e6e4e2` | 11 | 3 | Replace with `var(--a11y-mono-c-bg)` |
| `#f5f7fb` | 11 | 3 | Replace with `var(--a11y-proto-c-bg)` |
| `#1e40af` | 11 | 3 | Replace with `var(--a11y-proto-c-primary)` |
| `#fdf4ff` | 11 | 3 | Replace with `var(--a11y-trit-c-bg)` |
| `#cc3399` | 11 | 3 | Replace with `var(--a11y-trit-c-primary)` |
| `#06b6d4` | 11 | 3 | Replace with `var(--a11y-trit-c-accent)` |
| `#0066ff` | 10 | 2 | Create new token — used frequently |
| `#111827` | 10 | 2 | Create new token — used frequently |
| `#333` | 10 | 3 | Create new token — used frequently |
| `#5d4f3a` | 10 | 2 | Create new token — used frequently |
| `#4a4a4a` | 10 | 2 | Create new token — used frequently |
| `#e5e0db` | 10 | 2 | Create new token — used frequently |
| `#e8e8e8` | 10 | 3 | Create new token — used frequently |
| `#cee6c8` | 10 | 3 | Replace with `var(--brand-c-primary-light)` |
| `#ffcfba` | 10 | 3 | Replace with `var(--brand-c-secondary-light)` |
| `#855543` | 10 | 3 | Replace with `var(--brand-c-secondary-dark)` |
| `#c2bdb8` | 10 | 3 | Replace with `var(--brand-c-neutral)` |
| `#8aa5e5` | 10 | 2 | Create new token — used frequently |
| `#0e3f2e` | 10 | 2 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.3)` | 10 | 3 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.5)` | 10 | 4 | Create new token — used frequently |
| `rgba(0, 0, 0, 0.6)` | 10 | 3 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.2)` | 10 | 3 | Replace with `var(--glass-border)` |
| `hsl(h, news, newl)` | 10 | 2 | Create new token — used frequently |
| `#d4b98c` | 9 | 2 | Create new token — used frequently |
| `#ff0000` | 9 | 2 | Create new token — used frequently |
| `#eeebe2` | 9 | 3 | Create new token — used frequently |
| `#5a5754` | 9 | 2 | Create new token — used frequently |
| `#3e3b39` | 9 | 2 | Create new token — used frequently |
| `#5a5a5a` | 9 | 2 | Create new token — used frequently |
| `#3e4a5a` | 9 | 2 | Create new token — used frequently |
| `#a28aad` | 9 | 2 | Create new token — used frequently |
| `#373737` | 9 | 2 | Create new token — used frequently |
| `#4a90e2` | 9 | 2 | Create new token — used frequently |
| `#6b7280` | 8 | 4 | Create new token — used frequently |
| `#171717` | 8 | 2 | Create new token — used frequently |
| `#10b981` | 8 | 3 | Replace with `var(--feedback-success-border)` |
| `#ff9800` | 8 | 3 | Replace with `var(--color-Warning)` |
| `#f44336` | 8 | 3 | Replace with `var(--color-Error)` |
| `#2196f3` | 8 | 3 | Replace with `var(--color-Info)` |
| `rgba(0, 0, 0, 0.12)` | 8 | 4 | Create new token — used frequently |
| `rgba(0,0,0,0.06)` | 8 | 4 | Create new token — used frequently |
| `rgba(255,255,255,0.85)` | 8 | 4 | Create new token — used frequently |
| `rgba(0,0,0,0.2)` | 8 | 2 | Create new token — used frequently |
| `rgba(0,0,0,0.5)` | 8 | 3 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.4)` | 8 | 3 | Create new token — used frequently |
| `rgba(143,166,138,0.1)` | 8 | 3 | Create new token — used frequently |
| `rgba(196,144,124,0.1)` | 8 | 3 | Create new token — used frequently |
| `beige` | 8 | 2 | Create new token — used frequently |
| `#71876c` | 7 | 2 | Create new token — used frequently |
| `#dbdbdb` | 7 | 2 | Create new token — used frequently |
| `#2b2927` | 7 | 2 | Create new token — used frequently |
| `#1a1918` | 7 | 2 | Create new token — used frequently |
| `#80a575` | 7 | 2 | Replace with `var(--universal-success)` |
| `#cea96a` | 7 | 2 | Replace with `var(--universal-warning)` |
| `#9c5151` | 7 | 2 | Replace with `var(--universal-danger)` |
| `#47638f` | 7 | 2 | Replace with `var(--universal-info)` |
| `#2a3328` | 7 | 2 | Create new token — used frequently |
| `#aaaaaa` | 6 | 3 | Create new token — used frequently |
| `#7a9175` | 6 | 3 | Create new token — used frequently |
| `#e8e6e3` | 6 | 3 | Create new token — used frequently |
| `#f0ebe6` | 6 | 3 | Create new token — used frequently |
| `#fafafa` | 6 | 3 | Create new token — used frequently |
| `#e0e0e0` | 6 | 3 | Create new token — used frequently |
| `#888888` | 6 | 2 | Create new token — used frequently |
| `#111111` | 6 | 2 | Create new token — used frequently |
| `#1f2937` | 6 | 2 | Create new token — used frequently |
| `#111` | 6 | 2 | Create new token — used frequently |
| `#fef2f2` | 6 | 2 | Create new token — used frequently |
| `#f0fdfa` | 6 | 2 | Create new token — used frequently |
| `#065f46` | 6 | 2 | Replace with `var(--feedback-success-text)` |
| `#7f1d1d` | 6 | 2 | Replace with `var(--feedback-error-text)` |
| `#92400e` | 6 | 2 | Replace with `var(--feedback-warning-text)` |
| `#fdf8f3` | 6 | 2 | Create new token — used frequently |
| `#f2efd4` | 6 | 2 | Create new token — used frequently |
| `#b9a26e` | 6 | 2 | Create new token — used frequently |
| `#8ac7b2` | 6 | 2 | Create new token — used frequently |
| `#c78a9f` | 6 | 2 | Create new token — used frequently |
| `#8abdc7` | 6 | 2 | Create new token — used frequently |
| `#bdc78a` | 6 | 2 | Create new token — used frequently |
| `#c7948a` | 6 | 2 | Create new token — used frequently |
| `#938ac7` | 6 | 2 | Create new token — used frequently |
| `#e74c3c` | 6 | 2 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.12)` | 6 | 3 | Create new token — used frequently |
| `rgba(0,0,0,0.08)` | 6 | 2 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.6)` | 6 | 3 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.25)` | 6 | 3 | Create new token — used frequently |
| `rgba(0, 0, 0, 0.3)` | 6 | 3 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.18)` | 6 | 3 | Create new token — used frequently |
| `rgba(255,255,255,0.9)` | 6 | 3 | Create new token — used frequently |
| `rgba(0,0,0,0.9)` | 6 | 2 | Create new token — used frequently |
| `rgba(255,255,255,0.95)` | 6 | 2 | Create new token — used frequently |
| `rgba(0,0,0,0.12)` | 6 | 3 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.8)` | 6 | 2 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.7)` | 6 | 2 | Create new token — used frequently |
| `rgba(var(--a11y-cvd-accent-rgb)` | 6 | 2 | Create new token — used frequently |
| `rgba(255, 153, 200, 0.15)` | 6 | 2 | Replace with `var(--rainbow-hover-primary)` |
| `rgba(174, 136, 191, 0.15)` | 6 | 2 | Replace with `var(--rainbow-hover-secondary)` |
| `rgba(128, 225, 204, 0.15)` | 6 | 2 | Replace with `var(--rainbow-hover-accent)` |
| `rgba(255, 248, 237, 0.8)` | 6 | 2 | Replace with `var(--rainbow-hover-cream)` |
| `hsl((h + 180)` | 6 | 3 | Create new token — used frequently |
| `hsl((h + offset + 360)` | 6 | 3 | Create new token — used frequently |
| `hsl(215, 0.4 * satadjust, 0.92 * lightadjust)` | 6 | 2 | Create new token — used frequently |
| `hsl(215, 0.6 * satadjust, 0.80 * lightadjust)` | 6 | 2 | Create new token — used frequently |
| `red` | 6 | 4 | Create new token — used frequently |
| `gold` | 6 | 3 | Create new token — used frequently |
| `#ff6600` | 5 | 2 | Create new token — used frequently |
| `#ff00ff` | 5 | 2 | Create new token — used frequently |
| `#c17c5a` | 5 | 2 | Create new token — used frequently |
| `#040913` | 5 | 2 | Create new token — used frequently |
| `#962587` | 5 | 2 | Create new token — used frequently |
| `#86a182` | 5 | 2 | Create new token — used frequently |
| `#181818` | 5 | 2 | Create new token — used frequently |
| `#c0c0c0` | 5 | 2 | Create new token — used frequently |
| `#ede7de` | 5 | 2 | Create new token — used frequently |
| `#000` | 5 | 2 | Create new token — used frequently |
| `#1e1e1e` | 5 | 2 | Replace with `var(--a11y-dark-c-surface)` |
| `#2a2a2a` | 5 | 2 | Replace with `var(--a11y-dark-c-surface-raised)` |
| `#3a3a3a` | 5 | 2 | Replace with `var(--a11y-dark-c-border)` |
| `#949494` | 5 | 1 | Create new token — used frequently |
| `rgba(196,144,124,0.15)` | 5 | 2 | Create new token — used frequently |
| `rgba(196,144,124,0.08)` | 5 | 2 | Create new token — used frequently |
| `rgba(31, 38, 135, 0.37)` | 5 | 2 | Create new token — used frequently |
| `hsl(neutralhue, neutralsat, neutrallight)` | 5 | 2 | Create new token — used frequently |
| `hsl(145, 0.3 * satadjust, 0.92 * lightadjust)` | 5 | 2 | Create new token — used frequently |
| `hsl(145, 0.5 * satadjust, 0.80 * lightadjust)` | 5 | 2 | Create new token — used frequently |
| `hsl(145, 0.6 * satadjust, 0.50 * lightadjust)` | 5 | 2 | Create new token — used frequently |
| `hsl(45, 0.4 * satadjust, 0.92 * lightadjust)` | 5 | 2 | Create new token — used frequently |
| `hsl(45, 0.6 * satadjust, 0.80 * lightadjust)` | 5 | 2 | Create new token — used frequently |
| `hsl(45, 0.8 * satadjust, 0.60 * lightadjust)` | 5 | 2 | Create new token — used frequently |
| `hsl(15, 0.4 * satadjust, 0.92 * lightadjust)` | 5 | 2 | Create new token — used frequently |
| `hsl(15, 0.6 * satadjust, 0.80 * lightadjust)` | 5 | 2 | Create new token — used frequently |
| `hsl(15, 0.8 * satadjust, 0.55 * lightadjust)` | 5 | 2 | Create new token — used frequently |
| `hsl(215, 0.7 * satadjust, 0.55 * lightadjust)` | 5 | 2 | Create new token — used frequently |
| `blue` | 5 | 3 | Create new token — used frequently |
| `#fffbf2` | 4 | 2 | Create new token — used frequently |
| `#f9fafb` | 4 | 2 | Create new token — used frequently |
| `#0052cc` | 4 | 2 | Create new token — used frequently |
| `#e5e7eb` | 4 | 2 | Create new token — used frequently |
| `#8b5cf6` | 4 | 2 | Create new token — used frequently |
| `#374151` | 4 | 2 | Create new token — used frequently |
| `#8b6b5a` | 4 | 2 | Create new token — used frequently |
| `#7a5c4d` | 4 | 2 | Create new token — used frequently |
| `#222` | 4 | 2 | Create new token — used frequently |
| `#f9f9f9` | 4 | 2 | Create new token — used frequently |
| `#444` | 4 | 2 | Create new token — used frequently |
| `#b8a89d` | 4 | 2 | Create new token — used frequently |
| `#f7a072` | 4 | 2 | Create new token — used frequently |
| `#ffd966` | 4 | 2 | Create new token — used frequently |
| `#7a8b99` | 4 | 2 | Create new token — used frequently |
| `#c9b8a8` | 4 | 2 | Create new token — used frequently |
| `#ff6b6b` | 4 | 2 | Create new token — used frequently |
| `#4ecdc4` | 4 | 2 | Create new token — used frequently |
| `#2c3e50` | 4 | 2 | Create new token — used frequently |
| `#d4af37` | 4 | 2 | Create new token — used frequently |
| `#a0826d` | 4 | 2 | Create new token — used frequently |
| `#7d9d7c` | 4 | 2 | Create new token — used frequently |
| `#5d6d7e` | 4 | 2 | Create new token — used frequently |
| `#85929e` | 4 | 2 | Create new token — used frequently |
| `#48839e` | 4 | 2 | Create new token — used frequently |
| `#e3f2fd` | 4 | 2 | Create new token — used frequently |
| `#1976d2` | 4 | 2 | Create new token — used frequently |
| `#cccccc` | 4 | 2 | Create new token — used frequently |
| `#7a6b54` | 4 | 2 | Create new token — used frequently |
| `#f1f5f9` | 4 | 2 | Create new token — used frequently |
| `#ccc` | 4 | 2 | Create new token — used frequently |
| `#0a0a0a` | 4 | 2 | Create new token — used frequently |
| `#fecaca` | 4 | 2 | Create new token — used frequently |
| `#14b8a6` | 4 | 2 | Create new token — used frequently |
| `#99f6e4` | 4 | 2 | Create new token — used frequently |
| `#b45309` | 4 | 2 | Create new token — used frequently |
| `#fffbeb` | 4 | 2 | Create new token — used frequently |
| `#fde68a` | 4 | 2 | Create new token — used frequently |
| `#777` | 4 | 1 | Create new token — used frequently |
| `#aaa` | 4 | 1 | Create new token — used frequently |
| `#f0fdee` | 4 | 1 | Create new token — used frequently |
| `#aec6a9` | 4 | 1 | Create new token — used frequently |
| `#42563d` | 4 | 1 | Create new token — used frequently |
| `#364433` | 4 | 1 | Create new token — used frequently |
| `#fff4ee` | 4 | 1 | Create new token — used frequently |
| `#fff1e7` | 4 | 1 | Create new token — used frequently |
| `#e5af9a` | 4 | 1 | Create new token — used frequently |
| `#a4725f` | 4 | 1 | Create new token — used frequently |
| `#6f4230` | 4 | 1 | Create new token — used frequently |
| `#d2d1cc` | 4 | 1 | Create new token — used frequently |
| `#b4b1a8` | 4 | 1 | Create new token — used frequently |
| `#95928a` | 4 | 1 | Create new token — used frequently |
| `#77746c` | 4 | 1 | Create new token — used frequently |
| `#f8f8f8` | 4 | 1 | Create new token — used frequently |
| `#d3d3d3` | 4 | 1 | Create new token — used frequently |
| `#b3b3b3` | 4 | 1 | Create new token — used frequently |
| `#292624` | 4 | 1 | Create new token — used frequently |
| `#fef7f3` | 4 | 1 | Create new token — used frequently |
| `#f3e6e0` | 4 | 1 | Create new token — used frequently |
| `#dcc3b6` | 4 | 1 | Create new token — used frequently |
| `#bba397` | 4 | 1 | Create new token — used frequently |
| `#7e685c` | 4 | 1 | Create new token — used frequently |
| `#614c41` | 4 | 1 | Create new token — used frequently |
| `#4d392f` | 4 | 1 | Create new token — used frequently |
| `#f4f8ff` | 4 | 1 | Create new token — used frequently |
| `#e9f0ff` | 4 | 1 | Create new token — used frequently |
| `#c1cff6` | 4 | 1 | Create new token — used frequently |
| `#a1afd5` | 4 | 1 | Create new token — used frequently |
| `#667296` | 4 | 1 | Create new token — used frequently |
| `#4a5677` | 4 | 1 | Create new token — used frequently |
| `#384263` | 4 | 1 | Create new token — used frequently |
| `#fcf6fa` | 4 | 1 | Create new token — used frequently |
| `#f1e8ee` | 4 | 1 | Create new token — used frequently |
| `#d6c4d1` | 4 | 1 | Create new token — used frequently |
| `#b6a4b1` | 4 | 1 | Create new token — used frequently |
| `#796974` | 4 | 1 | Create new token — used frequently |
| `#5c4d58` | 4 | 1 | Create new token — used frequently |
| `#493a45` | 4 | 1 | Create new token — used frequently |
| `#b5b9bf` | 4 | 1 | Create new token — used frequently |
| `#9aa1aa` | 4 | 1 | Create new token — used frequently |
| `#768395` | 4 | 1 | Create new token — used frequently |
| `#596677` | 4 | 1 | Create new token — used frequently |
| `#25303f` | 4 | 1 | Create new token — used frequently |
| `#0d1825` | 4 | 1 | Create new token — used frequently |
| `#020815` | 4 | 1 | Create new token — used frequently |
| `#fdf5ff` | 4 | 1 | Create new token — used frequently |
| `#fcefff` | 4 | 1 | Create new token — used frequently |
| `#e2c8ee` | 4 | 1 | Create new token — used frequently |
| `#c1a9cd` | 4 | 1 | Create new token — used frequently |
| `#846c8e` | 4 | 1 | Create new token — used frequently |
| `#665070` | 4 | 1 | Create new token — used frequently |
| `#533d5c` | 4 | 1 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.75)` | 4 | 2 | Create new token — used frequently |
| `rgba(0, 0, 0, 0.9)` | 4 | 2 | Create new token — used frequently |
| `rgba(196,144,124,0.3)` | 4 | 2 | Create new token — used frequently |
| `rgb(248, 245, 242)` | 4 | 2 | Create new token — used frequently |
| `rgba(0, 0, 0, 0.03)` | 4 | 2 | Create new token — used frequently |
| `rgba(255,255,255,0.1)` | 4 | 2 | Create new token — used frequently |
| `rgba(0,0,0,0.95)` | 4 | 2 | Create new token — used frequently |
| `rgba(0,0,0,0.4)` | 4 | 2 | Create new token — used frequently |
| `rgba(255,255,255,0.2)` | 4 | 2 | Create new token — used frequently |
| `rgba(0, 0, 0, 0.05)` | 4 | 2 | Create new token — used frequently |
| `rgba(0, 0, 0, 0.85)` | 4 | 2 | Create new token — used frequently |
| `rgba(250, 248, 244, 0.9)` | 4 | 2 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.9)` | 4 | 2 | Create new token — used frequently |
| `rgba(0, 0, 0, 0.45)` | 4 | 2 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.45)` | 4 | 2 | Create new token — used frequently |
| `rgba(209, 213, 219, 0.3)` | 4 | 2 | Create new token — used frequently |
| `rgba(20, 20, 30, 0.35)` | 4 | 2 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.05)` | 4 | 2 | Create new token — used frequently |
| `rgba(255, 255, 255, 0.85)` | 4 | 2 | Create new token — used frequently |
| `rgba(255,255,255,0.3)` | 4 | 2 | Create new token — used frequently |
| `rgba(var(--brand-c-primary-rgb, 99, 102, 241)` | 4 | 2 | Create new token — used frequently |
| `hsl(h, news, l)` | 4 | 2 | Create new token — used frequently |
| `hsl(warmh, news, newl)` | 4 | 2 | Create new token — used frequently |
| `hsl(hue, sat, light)` | 4 | 2 | Create new token — used frequently |
| `hsl((h1 + 180)` | 4 | 2 | Create new token — used frequently |
| `hsl((h1 + 30)` | 4 | 2 | Create new token — used frequently |
| `hsl((h2 - 30 + 360)` | 4 | 2 | Create new token — used frequently |
| `hsl((h1 + 120)` | 4 | 2 | Create new token — used frequently |
| `hsl((h2 + 120)` | 4 | 2 | Create new token — used frequently |
| `hsl((avghue + 45)` | 4 | 2 | Create new token — used frequently |
| `hsl(h, s * 0.6, math.min(0.75, l * 1.15)` | 4 | 2 | Create new token — used frequently |
| `hsl(h, math.min(1, s * 1.3)` | 4 | 2 | Create new token — used frequently |
| `hsl(h, s * 0.5, math.min(0.7, l * 1.1)` | 4 | 2 | Create new token — used frequently |
| `hsl(h, math.min(1, s * 1.4)` | 4 | 2 | Create new token — used frequently |
| `hsl(h, math.min(0.9, s * 1.1)` | 4 | 2 | Create new token — used frequently |
| `hsl((h + 10)` | 4 | 2 | Create new token — used frequently |
| `hsl(h, s * 0.75, l)` | 4 | 2 | Create new token — used frequently |
| `hsl(neutralhue, saturation, lightness)` | 4 | 2 | Create new token — used frequently |
| `hsl(newhue, saturation, lightness)` | 4 | 2 | Create new token — used frequently |
| `hsl(hsl[0] || 0, hsl[1], targetlightness)` | 4 | 2 | Create new token — used frequently |
| `orange` | 3 | 2 | Create new token — used frequently |
| `pink` | 3 | 2 | Create new token — used frequently |
| `coral` | 3 | 2 | Create new token — used frequently |
| `silver` | 3 | 2 | Create new token — used frequently |
| `rgba(var(--color-primary-500-rgb, 99, 102, 241)` | 2 | 1 | Consider creating token |
| `teal` | 2 | 2 | Consider creating token |
| `gray` | 2 | 2 | Consider creating token |

### Hardcoded Colour Locations

#### `white` (484 occurrences)

- **audit-BEFORE.md** line 388
  ``"buttonPrimary": "Sage green background (#8fa68a), white text, rounded corners (8px), soft shadow, hover lifts with enh`
- **audit-BEFORE.md** line 392
  ``color: var(--color-White);  /* Change this */``
- **audit-BEFORE.md** line 394
  ``.badge { background: #4CAF50; color: white; }``
- **audit-BEFORE.md** line 396
  ``--color-White``
- **audit-BEFORE.md** line 398
  ``background: color-mix(in oklch, var(--color-White) 12%, transparent);``
- **audit-BEFORE.md** line 400
  ``color-mix(in oklch, var(--color-White) 12%, transparent)``
- **audit-BEFORE.md** line 402
  ``### --color-White``
- **audit-BEFORE.md** line 404
  ``- **Purposes:** Button text, white text overlays, hero text, neumorphic shadows, presentation reader backgrounds, glass`
- **audit-BEFORE.md** line 406
  ``8. **--color-White** (77 uses) - WHITE TEXT/BACKGROUNDS``
- **audit-BEFORE.md** line 408
  ``--text-inverse: var(--color-White);``
- **audit-BEFORE.md** line 410
  ``--form-bg: var(--color-White);``
- **audit-BEFORE.md** line 412
  ``- [ ] Replace `#ffffff` with `var(--color-White)```
- **audit-BEFORE.md** line 414
  ``- [ ] Replace `white` keyword with `var(--color-White)```
- **audit-BEFORE.md** line 416
  ``- [ ] Replace `background: white` with token``
- **audit-BEFORE.md** line 418
  ``- `--print-background: var(--color-White)```
- **audit-BEFORE.md** line 420
  ``--btn-filled-text: var(--color-White);``
- **audit-BEFORE.md** line 422
  ``--btn-filled-text: var(--color-White);``
- **audit-BEFORE.md** line 424
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 426
  ``color: var(--color-White) !important;``
- **audit-BEFORE.md** line 428
  ``color: white;``
- **audit-BEFORE.md** line 430
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 432
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 434
  ``color: color-mix(in srgb, var(--color-White) 85%, transparent);``
- **audit-BEFORE.md** line 436
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 438
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 440
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 442
  ``border: 2px solid var(--color-White);``
- **audit-BEFORE.md** line 444
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 446
  ``border: 2px solid var(--color-White);``
- **audit-BEFORE.md** line 448
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 450
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 452
  ``border: 3px solid var(--color-White);``
- **audit-BEFORE.md** line 454
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 456
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 458
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 460
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 462
  ``border: 3px solid var(--color-White);``
- **audit-BEFORE.md** line 464
  ``border: 4px solid var(--color-White);``
- **audit-BEFORE.md** line 466
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 468
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 470
  ``background: var(--color-White);``
- **audit-BEFORE.md** line 472
  ``border-color: var(--color-White);``
- **audit-BEFORE.md** line 474
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 476
  ``color: var(--color-White) !important;``
- **audit-BEFORE.md** line 478
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 480
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 482
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 484
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 486
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 488
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 490
  ``color: var(--color-White, #fff);``
- **audit-BEFORE.md** line 492
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 494
  ``background: var(--color-White);``
- **audit-BEFORE.md** line 496
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 498
  ``border-color: var(--color-White);``
- **audit-BEFORE.md** line 500
  ``background: color-mix(in oklch, var(--color-White) 20%, transparent);``
- **audit-BEFORE.md** line 502
  ``border-color: var(--color-White);``
- **audit-BEFORE.md** line 504
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 506
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 508
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 510
  ``color: white;``
- **audit-BEFORE.md** line 512
  ``background: var(--color-White-80);``
- **audit-BEFORE.md** line 514
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 516
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 520
  ``background: ${BRAND_COLORS.white};``
- **audit-BEFORE.md** line 522
  ``color: ${BRAND_COLORS.white};``
- **audit-BEFORE.md** line 524
  ``color: ${BRAND_COLORS.white} !important;``
- **audit-BEFORE.md** line 526
  ``background: ${BRAND_COLORS.white};``
- **audit-BEFORE.md** line 528
  ``particle.style.border = '2px solid white';``
- **audit-BEFORE.md** line 530
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 532
  ``color: color-mix(in srgb, var(--color-White) 85%, transparent);``
- **audit-BEFORE.md** line 534
  ``background: var(--color-White);``
- **audit-BEFORE.md** line 536
  ``box-shadow: var(--shadow-2xl), 0 0 0 var(--space-xs) color-mix(in srgb, var(--color-White) 30%, transparent);``
- **audit-BEFORE.md** line 538
  ``background: var(--color-White);``
- **audit-BEFORE.md** line 540
  ``background: white;``
- **audit-BEFORE.md** line 542
  ``background: ${BRAND_COLORS.white};``
- **audit-BEFORE.md** line 544
  ``color: ${BRAND_COLORS.white};``
- **audit-BEFORE.md** line 546
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 548
  ``background: var(--color-White);``
- **audit-BEFORE.md** line 550
  ``background: white;``
- **audit-BEFORE.md** line 552
  ``background: white;``
- **audit-BEFORE.md** line 554
  ``background: white;``
- **audit-BEFORE.md** line 556
  ``background: white;``
- **audit-BEFORE.md** line 558
  ``color: white;``
- **audit-BEFORE.md** line 560
  ``color: white;``
- **audit-BEFORE.md** line 562
  ``background: white;``
- **audit-BEFORE.md** line 564
  ``color: white;``
- **audit-BEFORE.md** line 566
  ``color: white;``
- **audit-BEFORE.md** line 568
  ``background: white;``
- **audit-BEFORE.md** line 570
  ``color: white;``
- **audit-BEFORE.md** line 572
  ``color: white;``
- **audit-BEFORE.md** line 574
  ``color: white;``
- **audit-BEFORE.md** line 576
  ``background: white;``
- **audit-BEFORE.md** line 578
  ``color: white;``
- **audit-BEFORE.md** line 580
  ``<button class="generate-btn" onclick="chooseAgain()" style="background: #4A90E2; color: white; flex: 0.5; min-width: 15`
- **audit-BEFORE.md** line 582
  ``<button class="generate-btn" onclick="clearAll()" style="background: #E74C3C; color: white; flex: 0.5; min-width: 150px`
- **audit-BEFORE.md** line 584
  ``color: white;``
- **audit-BEFORE.md** line 586
  ``background: white;``
- **audit-BEFORE.md** line 588
  ``color: white;``
- **audit-BEFORE.md** line 590
  ``background: white;``
- **audit-BEFORE.md** line 592
  ``background: white;``
- **audit-BEFORE.md** line 594
  ``color: white;``
- **audit-BEFORE.md** line 596
  ``background: white !important;``
- **audit-BEFORE.md** line 598
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 600
  ``color: var(--color-White) !important;``
- **audit-BEFORE.md** line 602
  ``color: var(--color-White) !important;``
- **audit-BEFORE.md** line 604
  ``color: white !important;``
- **audit-BEFORE.md** line 606
  ``color: white !important;``
- **audit-BEFORE.md** line 608
  ``color: white !important;``
- **audit-BEFORE.md** line 610
  ``color: white !important;``
- **audit-BEFORE.md** line 612
  ``color: var(--color-White) !important;``
- **audit-BEFORE.md** line 614
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 616
  ``color: var(--color-White) !important;``
- **audit-BEFORE.md** line 618
  ``color: var(--color-White) !important;``
- **audit-BEFORE.md** line 620
  ``color: var(--color-White) !important;``
- **audit-BEFORE.md** line 622
  ``color: var(--color-White) !important;``
- **audit-BEFORE.md** line 624
  ``color: var(--color-White) !important;``
- **audit-BEFORE.md** line 626
  ``color: var(--color-White) !important;``
- **audit-BEFORE.md** line 628
  ``color: var(--color-White) !important;``
- **audit-BEFORE.md** line 630
  ``box-shadow: 6px 6px 12px var(--brand-c-bg-light), -6px -6px 12px var(--color-White) !important;``
- **audit-BEFORE.md** line 632
  ``color: var(--color-White) !important;``
- **audit-BEFORE.md** line 634
  ``background: var(--color-White);``
- **audit-BEFORE.md** line 636
  ``background: var(--color-White);``
- **audit-BEFORE.md** line 638
  ``color: var(--color-White) !important;``
- **audit-BEFORE.md** line 640
  ``text-decoration-color: var(--color-White) !important;``
- **audit-BEFORE.md** line 642
  ``color: var(--color-White) !important;``
- **audit-BEFORE.md** line 644
  ``background: var(--color-White) !important;``
- **audit-BEFORE.md** line 646
  ``.bg-white { background-color: var(--brand-c-bg); }``
- **audit-BEFORE.md** line 648
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 650
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 652
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 654
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 656
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 658
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 660
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 662
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 664
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 666
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 668
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 670
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 672
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 674
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 676
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 678
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 680
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 682
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 684
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 686
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 688
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 690
  ``box-shadow: 6px 6px 12px var(--brand-c-bg-light), -6px -6px 12px var(--color-White);``
- **audit-BEFORE.md** line 692
  ``box-shadow: 4px 4px 8px var(--brand-c-bg-light), -4px -4px 8px var(--color-White);``
- **audit-BEFORE.md** line 694
  ``box-shadow: inset 4px 4px 8px var(--brand-c-bg-light), inset -4px -4px 8px var(--color-White);``
- **audit-BEFORE.md** line 696
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 698
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 700
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 702
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 704
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 706
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 708
  ``background: var(--color-White);``
- **audit-BEFORE.md** line 710
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 712
  ``color: color-mix(in oklch, var(--color-White) 90%, transparent);``
- **audit-BEFORE.md** line 714
  ``color: color-mix(in oklch, var(--color-White) 80%, transparent);``
- **audit-BEFORE.md** line 716
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 718
  ``background: var(--color-White);``
- **audit-BEFORE.md** line 720
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 722
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 724
  ``background: var(--color-White);``
- **audit-BEFORE.md** line 726
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 728
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 730
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 732
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 734
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 736
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 738
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 740
  ``border-bottom: var(--border-width) solid var(--color-White);``
- **audit-BEFORE.md** line 742
  ``background: var(--color-White-5);``
- **audit-BEFORE.md** line 744
  ``background: color-mix(in oklch, var(--color-White) 50%, transparent);``
- **audit-BEFORE.md** line 746
  ``background: color-mix(in oklch, var(--color-White) 60%, transparent);``
- **audit-BEFORE.md** line 748
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 750
  ``border-bottom: 1px solid color-mix(in oklch, var(--color-White) 20%, transparent);``
- **audit-BEFORE.md** line 752
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 754
  ``background: color-mix(in oklch, var(--color-White) 15%, transparent);``
- **audit-BEFORE.md** line 756
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 758
  ``stroke: color-mix(in oklch, var(--color-White) 25%, transparent);``
- **audit-BEFORE.md** line 760
  ``stroke: var(--color-White);``
- **audit-BEFORE.md** line 762
  ``border: var(--border-width) solid var(--color-White-15);``
- **audit-BEFORE.md** line 764
  ``background: var(--color-White);``
- **audit-BEFORE.md** line 766
  ``stroke: color-mix(in oklch, var(--color-White) 25%, transparent);``
- **audit-BEFORE.md** line 768
  ``stroke: var(--color-White);``
- **audit-BEFORE.md** line 770
  ``stroke: color-mix(in oklch, var(--color-White) 30%, transparent);``
- **audit-BEFORE.md** line 772
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 774
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 776
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 778
  ``border: 1px solid color-mix(in oklch, var(--color-White) 20%, transparent);``
- **audit-BEFORE.md** line 780
  ``background: color-mix(in oklch, var(--color-White) 10%, transparent);``
- **audit-BEFORE.md** line 782
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 784
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 786
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 788
  ``color: white;``
- **audit-BEFORE.md** line 790
  ``color: white;``
- **audit-BEFORE.md** line 792
  ``background: white;``
- **audit-BEFORE.md** line 794
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 796
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 798
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 800
  ``border-color: var(--color-White);``
- **audit-BEFORE.md** line 802
  ``background: var(--color-White);``
- **audit-BEFORE.md** line 804
  ``color: var(--color-White) !important;``
- **audit-BEFORE.md** line 806
  ``color: var(--color-White) !important;``
- **audit-BEFORE.md** line 808
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 810
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 812
  ``color: var(--color-White);``
- **audit-BEFORE.md** line 814
  ``--btn-filled-text: var(--color-White);``
- **audit-BEFORE.md** line 816
  ``--btn-filled-text: var(--color-White);``
- **audit-BEFORE.md** line 818
  ``--btn-filled-text: var(--color-White);``
- **audit-BEFORE.md** line 820
  ``--btn-filled-text: var(--color-White);``
- **audit-BEFORE.md** line 822
  ``--btn-filled-text: var(--color-White);``
- **audit-BEFORE.md** line 824
  ``@import './status.css';       /* Status colors, black/white - universal across themes */``
- **audit-BEFORE.md** line 826
  ``inset -10px -10px 82px color-mix(in oklch, var(--color-White) 60%, transparent);``
- **audit-BEFORE.md** line 828
  ``inset -28px -28px 47px var(--color-White);``
- **audit-BEFORE.md** line 830
  ``inset -15px -15px 45px color-mix(in oklch, var(--color-White) 40%, transparent),``
- **audit-BEFORE.md** line 832
  ``inset -20px -20px 60px color-mix(in oklch, var(--color-White) 50%, transparent),``
- **audit-BEFORE.md** line 834
  ``--color-White: #ffffff;``
- **audit-BEFORE.md** line 865
  ``- [ ] Replace `#ffffff` with `var(--color-White)```
- **audit-BEFORE.md** line 967
  ``--color-White: #ffffff;``
- **audit-BEFORE.md** line 1014
  ``@import './status.css';       /* Status colors, black/white - universal across themes */``
- **audit-BEFORE.md** line 1124
  ``"buttonPrimary": "Sage green background (#8fa68a), white text, rounded corners (8px), soft shadow, hover lifts with enh`
- **audit-BEFORE.md** line 1377
  ``"buttonPrimary": "Sage green background (#8fa68a), white text, rounded corners (8px), soft shadow, hover lifts with enh`
- **audit-BEFORE.md** line 1705
  ``color: var(--color-White, #fff);``
- **audit-BEFORE.md** line 2301
  ``.badge { background: #4CAF50; color: white; }``
- **audit-BEFORE.md** line 2766
  ``<button class="generate-btn" onclick="chooseAgain()" style="background: #4A90E2; color: white; flex: 0.5; min-width: 15`
- **audit-BEFORE.md** line 3163
  ``<button class="generate-btn" onclick="clearAll()" style="background: #E74C3C; color: white; flex: 0.5; min-width: 150px`
- **audit-BEFORE.md** line 4026
  ``background: #4A90E2; color: white; flex: 0.5; min-width: 150px;``
- **audit-BEFORE.md** line 4028
  ``background: #E74C3C; color: white; flex: 0.5; min-width: 150px;``
- **audit-BEFORE.md** line 4196
  `| `--form-bg` | `var(--color-White)` | `docs\todo\TODO.md` | 389 |`
- **audit-BEFORE.md** line 4346
  `| `--print-background` | `var(--color-White)`` | `docs\todo\TODO.md` | 488 |`
- **audit-BEFORE.md** line 4389
  `| `--text-inverse` | `var(--color-White)` | `docs\todo\TODO.md` | 362 |`
- **audit-BEFORE.md** line 4542
  `| `--color-White-80` | 1 | src\components\Sections\ShareSection.astro L143 |`
- **audit-BEFORE.md** line 4579
  `| `--color-White-5` | 1 | src\styles\components\nav\GlassNav-base.css L26 |`
- **audit-BEFORE.md** line 4582
  `| `--color-White-15` | 1 | src\styles\components\presentation\ReaderNav.css L810 |`
- **audit-BEFORE.md** line 4606
  `| `--color-White` | 168 | 46 |`
- **audit-BEFORE.md** line 4868
  `| `--color-White-80` | 1 | 1 |`
- **audit-BEFORE.md** line 4903
  `| `--color-White-5` | 1 | 1 |`
- **audit-BEFORE.md** line 4904
  `| `--color-White-15` | 1 | 1 |`
- **audit-BEFORE.md** line 5114
  `| `--btn-filled-text` | `var(--color-White)` | `files\example-a11y-cream-NEW.css` | 46 |`
- **audit-BEFORE.md** line 5115
  `| `--btn-filled-text` | `var(--color-White)` | `files\example-BrandDefault-NEW.css` | 46 |`
- **audit-BEFORE.md** line 5116
  `| `--btn-filled-text` | `var(--color-White)` | `src\styles\themes\a11y\a11y-cream.css` | 144 |`
- **audit-BEFORE.md** line 5118
  `| `--btn-filled-text` | `var(--color-White)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 144 |`
- **audit-BEFORE.md** line 5120
  `| `--btn-filled-text` | `var(--color-White)` | `src\styles\themes\a11y\a11y-monochrome.css` | 144 |`
- **audit-BEFORE.md** line 5121
  `| `--btn-filled-text` | `var(--color-White)` | `src\styles\themes\a11y\a11y-protanopia.css` | 144 |`
- **audit-BEFORE.md** line 5122
  `| `--btn-filled-text` | `var(--color-White)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 144 |`
- **audit-BEFORE.md** line 6045
  `| `--color-White` | `#ffffff` | `src\styles\tokens\status.css` | 11 |`
- **audit-BEFORE.md** line 6094
  `| `--form-bg` | `var(--color-White)` | `docs\todo\TODO.md` | 389 |`
- **audit-BEFORE.md** line 6298
  `| `--print-background` | `var(--color-White)`` | `docs\todo\TODO.md` | 488 |`
- **audit-BEFORE.md** line 6403
  `| `--text-inverse` | `var(--color-White)` | `docs\todo\TODO.md` | 362 |`
- **audit-BEFORE.md** line 6475
  `| `#ffffff` | `--a11y-hc-c-text`, `--a11y-high-contrast-c-text`, `--brand-c-bg-light`, `--brand-c-primary`, `--brand-c-t`
- **audit-BEFORE.md** line 6510
  `These would form your base colour set (like ally's four + black/white).`
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
- **files\example-BrandDefault-NEW.css** line 32
  `--brand-c-bg-light: var(--color-White);`
- **files\example-BrandDefault-NEW.css** line 46
  `--btn-filled-text: var(--color-White);`
- **src\components\Badge\Badge.astro** line 198
  `color: var(--color-White);`
- **src\components\Badge\Badge.astro** line 225
  `color: var(--color-White) !important;`
- **src\components\Cards\StepCard.astro** line 51
  `color: var(--color-White);`
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
  `color: var(--color-White);`
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
  `background: var(--color-White);`
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
  `background: var(--color-White);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 132
  `background: var(--color-White);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 283
  `color: var(--color-White);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 341
  `color: var(--color-White);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 404
  `background: var(--color-White);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 423
  `color: var(--color-White);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 438
  `color: var(--color-White);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 475
  `background: var(--color-White);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 483
  `color: var(--color-White);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 575
  `color: var(--color-White);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 632
  `color: var(--color-White);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 667
  `background: var(--color-White);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 684
  `color: var(--color-White);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 795
  `<button class="generate-btn" onclick="chooseAgain()" style="background: #4A90E2; color: var(--color-White); flex: 0.5; m`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 796
  `<button class="generate-btn" onclick="clearAll()" style="background: #E74C3C; color: var(--color-White); flex: 0.5; min-`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2107
  `color: var(--color-White);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2129
  `background: var(--color-White);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2268
  `color: var(--color-White);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2284
  `background: var(--color-White);`
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
  `box-shadow: 6px 6px 12px var(--brand-c-bg-light), -6px -6px 12px var(--color-White) !important;`
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
  `.bg-white { background-color: var(--brand-c-bg); }`
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
  `box-shadow: 6px 6px 12px var(--brand-c-bg-light), -6px -6px 12px var(--color-White);`
- **src\styles\buttons\basic-button.css** line 245
  `box-shadow: 4px 4px 8px var(--brand-c-bg-light), -4px -4px 8px var(--color-White);`
- **src\styles\buttons\basic-button.css** line 249
  `box-shadow: inset 4px 4px 8px var(--brand-c-bg-light), inset -4px -4px 8px var(--color-White);`
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
  `color: var(--color-White);`
- **src\styles\pages\checkout.css** line 114
  `color: var(--color-White);`
- **src\styles\pages\checkout.css** line 166
  `background: var(--color-White);`
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
- **src\styles\themes\a11y\a11y-cream.css** line 25
  `--btn-filled-text: var(--color-White);`
- **src\styles\themes\a11y\a11y-deuteranopia.css** line 25
  `--btn-filled-text: var(--color-White);`
- **src\styles\themes\a11y\a11y-monochrome.css** line 25
  `--btn-filled-text: var(--color-White);`
- **src\styles\themes\a11y\a11y-protanopia.css** line 25
  `--btn-filled-text: var(--color-White);`
- **src\styles\themes\a11y\a11y-tritanopia.css** line 25
  `--btn-filled-text: var(--color-White);`
- **src\styles\themes\brand\BrandDefault.css** line 46
  `--btn-filled-text: var(--color-White);`
- **src\styles\themes\Preview\coretokens.css** line 32
  `--a11y-high-contrast-c-text: var(--color-White);`
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

#### `#ffffff` (173 occurrences)

- **audit-BEFORE.md** line 30
  `| `#ffffff` | 65 | 21 | Replace with `var(--text)` |`
- **audit-BEFORE.md** line 412
  ``- [ ] Replace `#ffffff` with `var(--color-White)```
- **audit-BEFORE.md** line 834
  ``--color-White: #ffffff;``
- **audit-BEFORE.md** line 836
  `#### `#ffffff` (65 occurrences)`
- **audit-BEFORE.md** line 839
  ``"background": { "type": "string", "description": "Page background hex", "example": "#FFFFFF" },``
- **audit-BEFORE.md** line 841
  ``--brand-c-text-light: #ffffff;``
- **audit-BEFORE.md** line 843
  ``--brand-c-text-light: #ffffff;``
- **audit-BEFORE.md** line 845
  ``--brand-c-text-light: #ffffff;``
- **audit-BEFORE.md** line 847
  ``--brand-c-text: #ffffff;``
- **audit-BEFORE.md** line 849
  ``--brand-c-text: #ffffff;``
- **audit-BEFORE.md** line 851
  ``--brand-c-text: #ffffff;``
- **audit-BEFORE.md** line 853
  ``--brand-c-text-dark: #ffffff;``
- **audit-BEFORE.md** line 855
  ``--brand-c-text-dark: #ffffff;``
- **audit-BEFORE.md** line 857
  ``--brand-c-primary: #ffffff;``
- **audit-BEFORE.md** line 859
  ``--text: #ffffff;``
- **audit-BEFORE.md** line 861
  ``--textMuted: #ffffff;``
- **audit-BEFORE.md** line 863
  ``--linkHover: #ffffff;``
- **audit-BEFORE.md** line 865
  ``- [ ] Replace `#ffffff` with `var(--color-White)```
- **audit-BEFORE.md** line 867
  ``- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens``
- **audit-BEFORE.md** line 869
  ``- [ ] Replace `#ffffff`, `#000000`, `#333333` with tokens``
- **audit-BEFORE.md** line 871
  ``--brand-c-bg-light: #ffffff;``
- **audit-BEFORE.md** line 873
  ``color: #ffffff !important;``
- **audit-BEFORE.md** line 875
  ``white: '#ffffff',``
- **audit-BEFORE.md** line 877
  ``white: '#ffffff',``
- **audit-BEFORE.md** line 879
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 881
  ``box-shadow: 20px 20px 40px #bdbab3, -20px -20px 40px #ffffff;``
- **audit-BEFORE.md** line 883
  ``cta.style.color = '#ffffff';``
- **audit-BEFORE.md** line 885
  ``sidebar.style.color = '#ffffff';``
- **audit-BEFORE.md** line 887
  ``document.getElementById('previewSidebarTitle').style.color = '#ffffff';``
- **audit-BEFORE.md** line 889
  ``background: #ffffff !important;``
- **audit-BEFORE.md** line 891
  ``color: #ffffff !important;``
- **audit-BEFORE.md** line 893
  ``color: #ffffff !important;``
- **audit-BEFORE.md** line 895
  ``color: #ffffff !important;``
- **audit-BEFORE.md** line 897
  ``color: #ffffff !important;``
- **audit-BEFORE.md** line 899
  ``background: #ffffff !important;``
- **audit-BEFORE.md** line 901
  ``color: #ffffff !important;``
- **audit-BEFORE.md** line 903
  ``color: #ffffff !important;``
- **audit-BEFORE.md** line 905
  ``color: #ffffff !important;``
- **audit-BEFORE.md** line 907
  ``color: #ffffff !important;``
- **audit-BEFORE.md** line 909
  ``background: color-mix(in oklch, #ffffff 95%, transparent) !important;``
- **audit-BEFORE.md** line 911
  ``background: #ffffff !important;``
- **audit-BEFORE.md** line 913
  ``background: #ffffff !important;``
- **audit-BEFORE.md** line 915
  ``color: #ffffff !important;``
- **audit-BEFORE.md** line 917
  ``color: #ffffff !important;``
- **audit-BEFORE.md** line 919
  ``color: #ffffff !important;``
- **audit-BEFORE.md** line 921
  ``color: #ffffff !important;``
- **audit-BEFORE.md** line 923
  ``color: #ffffff !important;``
- **audit-BEFORE.md** line 925
  ``box-shadow: 8px 8px 20px #bdbab3, -8px -8px 20px #ffffff !important;``
- **audit-BEFORE.md** line 927
  ``color: var(--a11y-hc-text, #ffffff) !important;``
- **audit-BEFORE.md** line 929
  ``color: var(--a11y-hc-text, #ffffff) !important;``
- **audit-BEFORE.md** line 931
  ``color: var(--a11y-hc-text, #ffffff) !important;``
- **audit-BEFORE.md** line 933
  ``color: var(--a11y-hc-text, #ffffff) !important;``
- **audit-BEFORE.md** line 935
  ``color: var(--a11y-hc-text, #ffffff) !important;``
- **audit-BEFORE.md** line 937
  ``color: var(--a11y-hc-text, #ffffff) !important;``
- **audit-BEFORE.md** line 939
  ``color: var(--a11y-hc-text, #ffffff) !important;``
- **audit-BEFORE.md** line 941
  ``color: var(--a11y-hc-text, #ffffff) !important;``
- **audit-BEFORE.md** line 943
  ``color: var(--a11y-hc-text, #ffffff) !important;``
- **audit-BEFORE.md** line 945
  ``color: var(--a11y-hc-text, #ffffff) !important;``
- **audit-BEFORE.md** line 947
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 949
  ``box-shadow: 29px 29px 60px #bdbab3, -29px -29px 60px #ffffff;``
- **audit-BEFORE.md** line 951
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 953
  ``box-shadow: 29px 29px 60px #bdbab3, -29px -29px 60px #ffffff;``
- **audit-BEFORE.md** line 955
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 957
  ``box-shadow: 20px 20px 40px #bdbab3, -20px -20px 40px #ffffff;``
- **audit-BEFORE.md** line 959
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 961
  ``box-shadow: 8px 8px 20px #bdbab3, -8px -8px 20px #ffffff;``
- **audit-BEFORE.md** line 963
  ``--a11y-hc-c-text: #ffffff;``
- **audit-BEFORE.md** line 965
  ``--a11y-high-contrast-c-text: #ffffff;``
- **audit-BEFORE.md** line 967
  ``--color-White: #ffffff;``
- **audit-BEFORE.md** line 1047
  ``- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens``
- **audit-BEFORE.md** line 1049
  ``- [ ] Replace `#ffffff`, `#000000`, `#333333` with tokens``
- **audit-BEFORE.md** line 1191
  ``- [ ] Replace `#ffffff`, `#000000`, `#333333` with tokens``
- **audit-BEFORE.md** line 1547
  ``- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens``
- **audit-BEFORE.md** line 1720
  ``box-shadow: 20px 20px 40px #bdbab3, -20px -20px 40px #ffffff;``
- **audit-BEFORE.md** line 1722
  ``box-shadow: 8px 8px 20px #bdbab3, -8px -8px 20px #ffffff !important;``
- **audit-BEFORE.md** line 1724
  ``box-shadow: 29px 29px 60px #bdbab3, -29px -29px 60px #ffffff;``
- **audit-BEFORE.md** line 1726
  ``box-shadow: 29px 29px 60px #bdbab3, -29px -29px 60px #ffffff;``
- **audit-BEFORE.md** line 1728
  ``box-shadow: 20px 20px 40px #bdbab3, -20px -20px 40px #ffffff;``
- **audit-BEFORE.md** line 1730
  ``box-shadow: 8px 8px 20px #bdbab3, -8px -8px 20px #ffffff;``
- **audit-BEFORE.md** line 1949
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 1951
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 1953
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 1955
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 1957
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 2129
  ``- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens``
- **audit-BEFORE.md** line 4088
  `| `--brand-c-bg-light` | `#ffffff` | `files\example-BrandDefault-NEW.css` | 32 |`
- **audit-BEFORE.md** line 4340
  `| `--linkHover` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 247 |`
- **audit-BEFORE.md** line 4963
  `| `--a11y-hc-c-text` | `#ffffff` | `src\styles\themes\a11y\a11y-high-contrast.css` | 15 |`
- **audit-BEFORE.md** line 4967
  `| `--a11y-high-contrast-c-text` | `#ffffff` | `src\styles\themes\Preview\coretokens.css` | 32 |`
- **audit-BEFORE.md** line 5065
  `| `--brand-c-bg-light` | `#ffffff` | `files\example-BrandDefault-NEW.css` | 32 |`
- **audit-BEFORE.md** line 5780
  `| `--brand-c-primary` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 226 |`
- **audit-BEFORE.md** line 5937
  `| `--brand-c-text-light` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 217 |`
- **audit-BEFORE.md** line 5948
  `| `--brand-c-text-light` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 218 |`
- **audit-BEFORE.md** line 5967
  `| `--brand-c-text-light` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 219 |`
- **audit-BEFORE.md** line 5978
  `| `--brand-c-text` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 220 |`
- **audit-BEFORE.md** line 5989
  `| `--brand-c-text` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 221 |`
- **audit-BEFORE.md** line 6001
  `| `--brand-c-text` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 222 |`
- **audit-BEFORE.md** line 6013
  `| `--brand-c-text-dark` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 223 |`
- **audit-BEFORE.md** line 6025
  `| `--brand-c-text-dark` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 224 |`
- **audit-BEFORE.md** line 6045
  `| `--color-White` | `#ffffff` | `src\styles\tokens\status.css` | 11 |`
- **audit-BEFORE.md** line 6281
  `| `--linkHover` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 247 |`
- **audit-BEFORE.md** line 6375
  `| `--text` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 244 |`
- **audit-BEFORE.md** line 6412
  `| `--textMuted` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 245 |`
- **audit-BEFORE.md** line 6475
  `| `#ffffff` | `--a11y-hc-c-text`, `--a11y-high-contrast-c-text`, `--brand-c-bg-light`, `--brand-c-primary`, `--brand-c-t`
- **audit-BEFORE.md** line 6516
  `| `#ffffff` | 258 | candidate-3 |`
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 169
  `"background": { "type": "string", "description": "Page background hex", "example": "#FFFFFF" },`
- **docs\Markdown Notes\accessibility-color-themes.md** line 217
  `--brand-c-text-light: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 218
  `--brand-c-text-light: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 219
  `--brand-c-text-light: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 220
  `--brand-c-text: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 221
  `--brand-c-text: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 222
  `--brand-c-text: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 223
  `--brand-c-text-dark: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 224
  `--brand-c-text-dark: #ffffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 226
  `--brand-c-primary: #ffffff;`
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
- **src\styles\themes\a11y\a11y-high-contrast.css** line 3
  `--brand-c-text: #ffffff;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 14
  `--brand-c-neutral: #ffffff;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 15
  `--brand-c-neutral-dark: #ffffff;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 20
  `--brand-c-text-light: #ffffff;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 21
  `--brand-c-text-dark: #ffffff;`
- **src\styles\themes\brand\BrandDefault.css** line 32
  `--brand-c-bg-light: #ffffff;`
- **src\styles\tokens\status.css** line 11
  `--color-White: #ffffff;`

#### `black` (89 occurrences)

- **audit-BEFORE.md** line 824
  ``@import './status.css';       /* Status colors, black/white - universal across themes */``
- **audit-BEFORE.md** line 974
  ``--color-Black``
- **audit-BEFORE.md** line 976
  ``color-mix(in oklch, var(--color-Black) 85%, transparent)``
- **audit-BEFORE.md** line 978
  ``### --color-Black``
- **audit-BEFORE.md** line 980
  ``- [ ] Replace `#000000` with `var(--color-Black)```
- **audit-BEFORE.md** line 982
  ``- [ ] Replace `rgba(0, 0, 0, 0.1)` with `color-mix(in oklch, var(--color-Black) 10%, transparent)```
- **audit-BEFORE.md** line 984
  ``- [ ] Replace `rgba(0, 0, 0, 0.6)` with `color-mix(in oklch, var(--color-Black) 60%, transparent)```
- **audit-BEFORE.md** line 986
  ``- [ ] Replace `color: black` with token``
- **audit-BEFORE.md** line 988
  ``- `--print-text: var(--color-Black)```
- **audit-BEFORE.md** line 990
  ``background: color-mix(in oklch, var(--color-Black) 10%, transparent);``
- **audit-BEFORE.md** line 992
  ``box-shadow: inset 0 2px 4px color-mix(in oklch, var(--color-Black) 20%, transparent);``
- **audit-BEFORE.md** line 994
  ``box-shadow: 0 6px 20px var(--color-Black-10);``
- **audit-BEFORE.md** line 996
  ``box-shadow: 0 2px 8px var(--color-Black-5);``
- **audit-BEFORE.md** line 1000
  ``color-mix(in oklch, var(--color-Black) 70%, transparent) 0%,``
- **audit-BEFORE.md** line 1002
  ``color-mix(in oklch, var(--color-Black) 50%, transparent) 50%,``
- **audit-BEFORE.md** line 1004
  ``box-shadow: 0 4px 12px var(--color-Black-5);``
- **audit-BEFORE.md** line 1006
  ``box-shadow: 0 4px 12px var(--color-Black-10);``
- **audit-BEFORE.md** line 1008
  ``--gradient-success: linear-gradient(135deg, var(--color-Success) 0%, color-mix(in oklch, var(--color-Success) 70%, blac`
- **audit-BEFORE.md** line 1010
  ``--gradient-warning: linear-gradient(135deg, var(--color-Warning) 0%, color-mix(in oklch, var(--color-Warning) 70%, blac`
- **audit-BEFORE.md** line 1012
  ``--gradient-error: linear-gradient(135deg, var(--color-Danger) 0%, color-mix(in oklch, var(--color-Danger) 70%, black) 1`
- **audit-BEFORE.md** line 1014
  ``@import './status.css';       /* Status colors, black/white - universal across themes */``
- **audit-BEFORE.md** line 1016
  ``color-mix(in oklch, var(--color-Black) 4%, transparent);``
- **audit-BEFORE.md** line 1018
  ``color-mix(in oklch, var(--color-Black) 5%, transparent);``
- **audit-BEFORE.md** line 1020
  ``color-mix(in oklch, var(--color-Black) 6%, transparent);``
- **audit-BEFORE.md** line 1022
  ``color-mix(in oklch, var(--color-Black) 7%, transparent);``
- **audit-BEFORE.md** line 1024
  ``color-mix(in oklch, var(--color-Black) 8%, transparent);``
- **audit-BEFORE.md** line 1026
  ``inset 10px 10px 82px  color-mix(in oklch, var(--color-Black) 12%, transparent),``
- **audit-BEFORE.md** line 1028
  ``inset 28px 28px 47px color-mix(in oklch, var(--color-Black) 43%, transparent),``
- **audit-BEFORE.md** line 1030
  ``inset 15px 15px 45px color-mix(in oklch, var(--color-Black) 35%, transparent),``
- **audit-BEFORE.md** line 1032
  ``inset 0 0 0 3px color-mix(in oklch, var(--color-Black) 20%, transparent);``
- **audit-BEFORE.md** line 1034
  ``inset 20px 20px 60px color-mix(in oklch, var(--color-Black) 45%, transparent),``
- **audit-BEFORE.md** line 1036
  ``inset 0 0 0 4px color-mix(in oklch, var(--color-Black) 25%, transparent);``
- **audit-BEFORE.md** line 1038
  ``--color-Black: #121212;``
- **audit-BEFORE.md** line 1187
  ``- [ ] Replace `#000000` with `var(--color-Black)```
- **audit-BEFORE.md** line 1226
  ``- [ ] Replace `rgba(0, 0, 0, 0.1)` with `color-mix(in oklch, var(--color-Black) 10%, transparent)```
- **audit-BEFORE.md** line 2124
  ``--color-Black: #121212;``
- **audit-BEFORE.md** line 2337
  ``- [ ] Replace `rgba(0, 0, 0, 0.6)` with `color-mix(in oklch, var(--color-Black) 60%, transparent)```
- **audit-BEFORE.md** line 4266
  `| `--gradient-error` | `linear-gradient(135deg, var(--color-Danger) 0%, color-mix(in oklch, var(--color-Danger) 70%, bla`
- **audit-BEFORE.md** line 4308
  `| `--gradient-success` | `linear-gradient(135deg, var(--color-Success) 0%, color-mix(in oklch, var(--color-Success) 70%,`
- **audit-BEFORE.md** line 4323
  `| `--gradient-warning` | `linear-gradient(135deg, var(--color-Warning) 0%, color-mix(in oklch, var(--color-Warning) 70%,`
- **audit-BEFORE.md** line 4348
  `| `--print-text` | `var(--color-Black)`` | `docs\todo\TODO.md` | 487 |`
- **audit-BEFORE.md** line 4503
  `| `--color-Black-10` | 2 | src\components\Sections\ShareSection.astro L146; src\styles\components\nav\GlassNav-expandabl`
- **audit-BEFORE.md** line 4504
  `| `--color-Black-5` | 2 | src\components\Sections\ShareSection.astro L150; src\styles\components\nav\GlassNav-base.css L`
- **audit-BEFORE.md** line 4660
  `| `--color-Black` | 20 | 5 |`
- **audit-BEFORE.md** line 4786
  `| `--color-Black-10` | 2 | 2 |`
- **audit-BEFORE.md** line 4787
  `| `--color-Black-5` | 2 | 2 |`
- **audit-BEFORE.md** line 5621
  `| `--color-Black` | `#121212` | `src\styles\tokens\status.css` | 10 |`
- **audit-BEFORE.md** line 6180
  `| `--gradient-error` | `linear-gradient(135deg, var(--color-Danger) 0%, color-mix(in oklch, var(--color-Danger) 70%, bla`
- **audit-BEFORE.md** line 6227
  `| `--gradient-success` | `linear-gradient(135deg, var(--color-Success) 0%, color-mix(in oklch, var(--color-Success) 70%,`
- **audit-BEFORE.md** line 6242
  `| `--gradient-warning` | `linear-gradient(135deg, var(--color-Warning) 0%, color-mix(in oklch, var(--color-Warning) 70%,`
- **audit-BEFORE.md** line 6300
  `| `--print-text` | `var(--color-Black)`` | `docs\todo\TODO.md` | 487 |`
- **audit-BEFORE.md** line 6434
  `| `#121212` | `--a11y-dark-c-bg`, `--color-Black` |`
- **audit-BEFORE.md** line 6510
  `These would form your base colour set (like ally's four + black/white).`
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
- **src\styles\themes\a11y\a11y-high-contrast.css** line 30
  `--btn-filled-text: var(--color-Black);`
- **src\styles\themes\Preview\coretokens.css** line 31
  `--a11y-high-contrast-c-bg: var(--color-Black);`
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

#### `#333333` (83 occurrences)

- **audit-BEFORE.md** line 32
  `| `#333333` | 34 | 8 | Replace with `var(--a11y-mono-c-text)` |`
- **audit-BEFORE.md** line 867
  ``- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens``
- **audit-BEFORE.md** line 869
  ``- [ ] Replace `#ffffff`, `#000000`, `#333333` with tokens``
- **audit-BEFORE.md** line 1040
  `#### `#333333` (34 occurrences)`
- **audit-BEFORE.md** line 1043
  ``- [ ] Replace `#333333` with `var(--brand-c-neutral-dark)` or semantic token``
- **audit-BEFORE.md** line 1045
  ``- [ ] Replace 12+ instances of `#333333```
- **audit-BEFORE.md** line 1047
  ``- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens``
- **audit-BEFORE.md** line 1049
  ``- [ ] Replace `#ffffff`, `#000000`, `#333333` with tokens``
- **audit-BEFORE.md** line 1051
  ``border: 2px solid #333333 !important;``
- **audit-BEFORE.md** line 1053
  ``color: #333333 !important;``
- **audit-BEFORE.md** line 1055
  ``background: #333333 !important;``
- **audit-BEFORE.md** line 1057
  ``background: #333333 !important;``
- **audit-BEFORE.md** line 1059
  ``border-color: #333333 !important;``
- **audit-BEFORE.md** line 1061
  ``border: 2px solid #333333 !important;``
- **audit-BEFORE.md** line 1063
  ``color: #333333 !important;``
- **audit-BEFORE.md** line 1065
  ``color: #333333 !important;``
- **audit-BEFORE.md** line 1067
  ``background: #333333 !important;``
- **audit-BEFORE.md** line 1069
  ``background: #333333 !important;``
- **audit-BEFORE.md** line 1071
  ``border: 1px solid #333333 !important;``
- **audit-BEFORE.md** line 1073
  ``color: #333333 !important;``
- **audit-BEFORE.md** line 1075
  ``fill: #333333 !important;``
- **audit-BEFORE.md** line 1077
  ``fill: #333333 !important;``
- **audit-BEFORE.md** line 1079
  ``color: #333333 !important;``
- **audit-BEFORE.md** line 1081
  ``border: 2px solid #333333 !important;``
- **audit-BEFORE.md** line 1083
  ``color: #333333 !important;``
- **audit-BEFORE.md** line 1085
  ``border-color: #333333 !important;``
- **audit-BEFORE.md** line 1087
  ``color: #333333 !important;``
- **audit-BEFORE.md** line 1089
  ``color: #333333 !important;``
- **audit-BEFORE.md** line 1091
  ``background: #333333 !important;``
- **audit-BEFORE.md** line 1093
  ``border: 2px solid #333333 !important;``
- **audit-BEFORE.md** line 1095
  ``color: #333333 !important;``
- **audit-BEFORE.md** line 1097
  ``background: #333333 !important;``
- **audit-BEFORE.md** line 1099
  ``background: #333333 !important;``
- **audit-BEFORE.md** line 1101
  ``color: #333333 !important;``
- **audit-BEFORE.md** line 1103
  ``color: #333333 !important;``
- **audit-BEFORE.md** line 1105
  ``color: #333333 !important;``
- **audit-BEFORE.md** line 1107
  ``--a11y-mono-c-text: #333333;``
- **audit-BEFORE.md** line 1109
  ``--a11y-monochrome-c-text: #333333;``
- **audit-BEFORE.md** line 1191
  ``- [ ] Replace `#ffffff`, `#000000`, `#333333` with tokens``
- **audit-BEFORE.md** line 1547
  ``- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens``
- **audit-BEFORE.md** line 2129
  ``- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens``
- **audit-BEFORE.md** line 4971
  `| `--a11y-mono-c-text` | `#333333` | `src\styles\themes\a11y\a11y-monochrome.css` | 15 |`
- **audit-BEFORE.md** line 4975
  `| `--a11y-monochrome-c-text` | `#333333` | `src\styles\themes\Preview\coretokens.css` | 38 |`
- **audit-BEFORE.md** line 6439
  `| `#333333` | `--a11y-mono-c-text`, `--a11y-monochrome-c-text` |`
- **audit-BEFORE.md** line 6531
  `| `#333333` | 58 | candidate-18 |`
- **docs\todo\TODO.md** line 454
  `- [ ] Replace `#333333` with `var(--brand-c-neutral-dark)` or semantic token`
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
- **src\styles\themes\a11y\a11y-monochrome.css** line 3
  `--brand-c-text: #333333;`
- **src\styles\themes\a11y\a11y-monochrome.css** line 14
  `--brand-c-neutral: #333333;`
- **src\styles\themes\a11y\a11y-monochrome.css** line 15
  `--brand-c-neutral-dark: #333333;`
- **src\styles\themes\a11y\a11y-monochrome.css** line 18
  `--brand-c-bg-dark: #333333;`
- **src\styles\themes\a11y\a11y-monochrome.css** line 20
  `--brand-c-text-light: #333333;`
- **src\styles\themes\a11y\a11y-monochrome.css** line 21
  `--brand-c-text-dark: #333333;`

#### `#000000` (74 occurrences)

- **audit-BEFORE.md** line 34
  `| `#000000` | 26 | 10 | Replace with `var(--bg)` |`
- **audit-BEFORE.md** line 869
  ``- [ ] Replace `#ffffff`, `#000000`, `#333333` with tokens``
- **audit-BEFORE.md** line 980
  ``- [ ] Replace `#000000` with `var(--color-Black)```
- **audit-BEFORE.md** line 1049
  ``- [ ] Replace `#ffffff`, `#000000`, `#333333` with tokens``
- **audit-BEFORE.md** line 1168
  `#### `#000000` (26 occurrences)`
- **audit-BEFORE.md** line 1171
  ``--brand-c-bg: #000000;``
- **audit-BEFORE.md** line 1173
  ``--brand-c-bg: #000000;``
- **audit-BEFORE.md** line 1175
  ``--brand-c-bg-light: #000000;``
- **audit-BEFORE.md** line 1177
  ``--brand-c-bg-light: #000000;``
- **audit-BEFORE.md** line 1179
  ``--brand-c-bg-light: #000000;``
- **audit-BEFORE.md** line 1181
  ``--brand-c-bg-light: #000000;``
- **audit-BEFORE.md** line 1183
  ``--bg: #000000;``
- **audit-BEFORE.md** line 1185
  ``--surface: #000000;``
- **audit-BEFORE.md** line 1187
  ``- [ ] Replace `#000000` with `var(--color-Black)```
- **audit-BEFORE.md** line 1189
  ``- [ ] Replace `#000000`, `#666666`, `#8b6914` with tokens``
- **audit-BEFORE.md** line 1191
  ``- [ ] Replace `#ffffff`, `#000000`, `#333333` with tokens``
- **audit-BEFORE.md** line 1193
  ``context.fillStyle = "#000000";``
- **audit-BEFORE.md** line 1195
  ``hexColor = '#000000';``
- **audit-BEFORE.md** line 1197
  ``color: #000000 !important;``
- **audit-BEFORE.md** line 1199
  ``color: #000000 !important;``
- **audit-BEFORE.md** line 1201
  ``color: #000000 !important;``
- **audit-BEFORE.md** line 1203
  ``color: #000000 !important;``
- **audit-BEFORE.md** line 1205
  ``color: #000000 !important;``
- **audit-BEFORE.md** line 1207
  ``color: #000000 !important;``
- **audit-BEFORE.md** line 1209
  ``background: var(--a11y-hc-bg, #000000) !important;``
- **audit-BEFORE.md** line 1211
  ``background: var(--a11y-hc-bg, #000000) !important;``
- **audit-BEFORE.md** line 1213
  ``background: var(--a11y-hc-bg, #000000) !important;``
- **audit-BEFORE.md** line 1215
  ``background: var(--a11y-hc-bg, #000000) !important;``
- **audit-BEFORE.md** line 1217
  ``--a11y-hc-c-bg: #000000;``
- **audit-BEFORE.md** line 1219
  ``--btn-filled-text: #000000;``
- **audit-BEFORE.md** line 1221
  ``--a11y-high-contrast-c-bg: #000000;``
- **audit-BEFORE.md** line 1465
  ``- [ ] Replace `#000000`, `#666666`, `#8b6914` with tokens``
- **audit-BEFORE.md** line 1509
  ``- [ ] Replace `#000000`, `#666666`, `#8b6914` with tokens``
- **audit-BEFORE.md** line 3992
  ``#000000``
- **audit-BEFORE.md** line 4051
  `| `--bg` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 242 |`
- **audit-BEFORE.md** line 4961
  `| `--a11y-hc-c-bg` | `#000000` | `src\styles\themes\a11y\a11y-high-contrast.css` | 14 |`
- **audit-BEFORE.md** line 4965
  `| `--a11y-high-contrast-c-bg` | `#000000` | `src\styles\themes\Preview\coretokens.css` | 31 |`
- **audit-BEFORE.md** line 5005
  `| `--bg` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 242 |`
- **audit-BEFORE.md** line 5119
  `| `--btn-filled-text` | `#000000` | `src\styles\themes\a11y\a11y-high-contrast.css` | 146 |`
- **audit-BEFORE.md** line 5503
  `| `--brand-c-bg` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 211 |`
- **audit-BEFORE.md** line 5515
  `| `--brand-c-bg-light` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 212 |`
- **audit-BEFORE.md** line 5526
  `| `--brand-c-bg-light` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 213 |`
- **audit-BEFORE.md** line 5537
  `| `--brand-c-bg-light` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 214 |`
- **audit-BEFORE.md** line 5548
  `| `--brand-c-bg` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 210 |`
- **audit-BEFORE.md** line 5560
  `| `--brand-c-bg-light` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 215 |`
- **audit-BEFORE.md** line 6359
  `| `--surface` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 243 |`
- **audit-BEFORE.md** line 6428
  `| `#000000` | `--a11y-hc-c-bg`, `--a11y-high-contrast-c-bg`, `--bg`, `--btn-filled-text`, `--brand-c-bg`, `--brand-c-bg-`
- **docs\Markdown Notes\accessibility-color-themes.md** line 210
  `--brand-c-bg: #000000;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 211
  `--brand-c-bg: #000000;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 212
  `--brand-c-bg-light: #000000;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 213
  `--brand-c-bg-light: #000000;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 214
  `--brand-c-bg-light: #000000;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 215
  `--brand-c-bg-light: #000000;`
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
- **src\styles\themes\a11y\a11y-high-contrast.css** line 2
  `--brand-c-bg: #000000;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 13
  `--brand-c-neutral-light: #000000;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 17
  `--brand-c-bg-light: #000000;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 18
  `--brand-c-bg-dark: #000000;`

#### `#8fa68a` (60 occurrences)

- **audit-BEFORE.md** line 33
  `| `#8fa68a` | 27 | 14 | Replace with `var(--brand-c-primary)` |`
- **audit-BEFORE.md** line 388
  ``"buttonPrimary": "Sage green background (#8fa68a), white text, rounded corners (8px), soft shadow, hover lifts with enh`
- **audit-BEFORE.md** line 1111
  `#### `#8fa68a` (27 occurrences)`
- **audit-BEFORE.md** line 1114
  ``"hex": "#8fa68a",``
- **audit-BEFORE.md** line 1116
  ``"link": "#8fa68a",``
- **audit-BEFORE.md** line 1118
  ``"accent1": "#8fa68a",``
- **audit-BEFORE.md** line 1120
  ``"focusOutline": "2px solid #8fa68a"``
- **audit-BEFORE.md** line 1122
  ``"h2Color": "#8fa68a",``
- **audit-BEFORE.md** line 1124
  ``"buttonPrimary": "Sage green background (#8fa68a), white text, rounded corners (8px), soft shadow, hover lifts with enh`
- **audit-BEFORE.md** line 1128
  ``--brand-c-primary: #8fa68a;``
- **audit-BEFORE.md** line 1130
  ``--brand-c-primary: #8fa68a;  /* Precise shade control */``
- **audit-BEFORE.md** line 1132
  ``--brand-c-primary: #8fa68a;``
- **audit-BEFORE.md** line 1134
  ``primary: '#8fa68a',      // Sage green``
- **audit-BEFORE.md** line 1136
  ``primary: '#8fa68a',``
- **audit-BEFORE.md** line 1138
  ``'#8FA68A';``
- **audit-BEFORE.md** line 1140
  ``--brand-primary: #8FA68A; /* base: 500 */``
- **audit-BEFORE.md** line 1142
  ``--brand-primary: #8FA68A; /* base: 500 */``
- **audit-BEFORE.md** line 1144
  ``--brand-primary: #8FA68A; /* base: 500 */``
- **audit-BEFORE.md** line 1146
  ``console.log('Example: node color-theory-comparison.js #8FA68A');``
- **audit-BEFORE.md** line 1148
  ``--brand-primary: #8FA68A; /* base: 500 - Your main color */``
- **audit-BEFORE.md** line 1150
  ``primaryColor: '#8FA68A',``
- **audit-BEFORE.md** line 1152
  ``primary: '#8FA68A',      // Soft sage green``
- **audit-BEFORE.md** line 1154
  ``alert('Please enter a valid primary color in hex format (e.g., #8FA68A)');``
- **audit-BEFORE.md** line 1156
  ``document.getElementById('primaryColorPicker').value = '#8FA68A';``
- **audit-BEFORE.md** line 1158
  ``document.getElementById('primaryColorHex').value = '#8FA68A';``
- **audit-BEFORE.md** line 1160
  ``state.primaryColor = '#8FA68A';``
- **audit-BEFORE.md** line 1162
  ``--brand-c-primary: #8fa68a;``
- **audit-BEFORE.md** line 1164
  ``--brand-c-primary: #8fa68a;``
- **audit-BEFORE.md** line 1166
  ``--brand-c-primary: #8fa68a;``
- **audit-BEFORE.md** line 1377
  ``"buttonPrimary": "Sage green background (#8fa68a), white text, rounded corners (8px), soft shadow, hover lifts with enh`
- **audit-BEFORE.md** line 5072
  `| `--brand-c-primary` | `#8fa68a` | `docs\Markdown Notes\Theme-Preview-System.md` | 28 |`
- **audit-BEFORE.md** line 5074
  `| `--brand-c-primary` | `#8fa68a` | `files\example-BrandDefault-NEW.css` | 7 |`
- **audit-BEFORE.md** line 5075
  `| `--brand-c-primary` | `#8fa68a` | `src\styles\themes\brand\BrandDefault.css` | 6 |`
- **audit-BEFORE.md** line 5076
  `| `--brand-c-primary` | `#8fa68a` | `src\styles\themes\Preview\coretokens.css` | 57 |`
- **audit-BEFORE.md** line 5100
  `| `--brand-primary` | `#8FA68A` | `src\scripts\ThemeTokenGen\brand-template.css` | 7 |`
- **audit-BEFORE.md** line 5101
  `| `--brand-primary` | `#8FA68A` | `src\scripts\ThemeTokenGen\brand-template.css` | 35 |`
- **audit-BEFORE.md** line 5102
  `| `--brand-primary` | `#8FA68A` | `src\scripts\ThemeTokenGen\color-input.css` | 20 |`
- **audit-BEFORE.md** line 5104
  `| `--brand-primary` | `#8FA68A` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 15 |`
- **audit-BEFORE.md** line 5781
  `| `--brand-c-primary` | `#8fa68a` | `docs\todo\TODO.md` | 344 |`
- **audit-BEFORE.md** line 5790
  `| `--brand-c-primary` | `#8fa68a` | `src\styles\themes\brand\BrandDefault.css` | 17 |`
- **audit-BEFORE.md** line 6455
  `| `#8fa68a` | `--brand-c-primary`, `--brand-primary`, `--brand-c-primary` |`
- **audit-BEFORE.md** line 6514
  `| `#8fa68a` | 366 | candidate-1 |`
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
  `--brand-c-primary: #8fa68a;  /* Precise shade control */`
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
- **src\styles\themes\brand\BrandDefault.css** line 7
  `--brand-c-primary: #8fa68a;`

#### `#4a3f2f` (49 occurrences)

- **audit-BEFORE.md** line 36
  `| `#4a3f2f` | 14 | 5 | Replace with `var(--a11y-cream-c-text)` |`
- **audit-BEFORE.md** line 1256
  `#### `#4a3f2f` (14 occurrences)`
- **audit-BEFORE.md** line 1259
  ``--brand-c-text: #4a3f2f;``
- **audit-BEFORE.md** line 1261
  ``--brand-c-neutral: #4a3f2f;``
- **audit-BEFORE.md** line 1263
  ``--brand-c-neutral-dark: #4a3f2f;``
- **audit-BEFORE.md** line 1265
  ``--brand-c-bg-dark: #4a3f2f;``
- **audit-BEFORE.md** line 1267
  ``--brand-c-text-light: #4a3f2f;``
- **audit-BEFORE.md** line 1269
  ``--brand-c-text-dark: #4a3f2f;``
- **audit-BEFORE.md** line 1271
  ``color: var(--a11y-cream-text, #4a3f2f) !important;``
- **audit-BEFORE.md** line 1273
  ``color: var(--a11y-cream-text, #4a3f2f) !important;``
- **audit-BEFORE.md** line 1275
  ``color: var(--a11y-cream-text, #4a3f2f) !important;``
- **audit-BEFORE.md** line 1277
  ``color: var(--a11y-cream-text, #4a3f2f) !important;``
- **audit-BEFORE.md** line 1279
  ``color: var(--a11y-cream-text, #4a3f2f) !important;``
- **audit-BEFORE.md** line 1281
  ``color: var(--a11y-cream-text, #4a3f2f) !important;``
- **audit-BEFORE.md** line 1283
  ``--a11y-cream-c-text: #4a3f2f;``
- **audit-BEFORE.md** line 1285
  ``--a11y-cream-c-text: #4a3f2f;``
- **audit-BEFORE.md** line 4085
  `| `--brand-c-bg-dark` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 33 |`
- **audit-BEFORE.md** line 4089
  `| `--brand-c-neutral` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 26 |`
- **audit-BEFORE.md** line 4091
  `| `--brand-c-neutral-dark` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 27 |`
- **audit-BEFORE.md** line 4105
  `| `--brand-c-text-dark` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 39 |`
- **audit-BEFORE.md** line 4107
  `| `--brand-c-text-light` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 38 |`
- **audit-BEFORE.md** line 4934
  `| `--a11y-cream-c-text` | `#4a3f2f` | `src\styles\themes\a11y\a11y-cream.css` | 15 |`
- **audit-BEFORE.md** line 4935
  `| `--a11y-cream-c-text` | `#4a3f2f` | `src\styles\themes\Preview\coretokens.css` | 14 |`
- **audit-BEFORE.md** line 5062
  `| `--brand-c-bg-dark` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 33 |`
- **audit-BEFORE.md** line 5066
  `| `--brand-c-neutral` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 26 |`
- **audit-BEFORE.md** line 5068
  `| `--brand-c-neutral-dark` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 27 |`
- **audit-BEFORE.md** line 5088
  `| `--brand-c-text` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 6 |`
- **audit-BEFORE.md** line 5092
  `| `--brand-c-text-dark` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 39 |`
- **audit-BEFORE.md** line 5094
  `| `--brand-c-text-light` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 38 |`
- **audit-BEFORE.md** line 6445
  `| `#4a3f2f` | `--a11y-cream-c-text`, `--brand-c-bg-dark`, `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-text`
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
- **src\styles\themes\a11y\a11y-cream.css** line 3
  `--brand-c-text: #4a3f2f;`
- **src\styles\themes\a11y\a11y-cream.css** line 14
  `--brand-c-neutral: #4a3f2f;`
- **src\styles\themes\a11y\a11y-cream.css** line 15
  `--brand-c-neutral-dark: #4a3f2f;`
- **src\styles\themes\a11y\a11y-cream.css** line 18
  `--brand-c-bg-dark: #4a3f2f;`
- **src\styles\themes\a11y\a11y-cream.css** line 20
  `--brand-c-text-light: #4a3f2f;`
- **src\styles\themes\a11y\a11y-cream.css** line 21
  `--brand-c-text-dark: #4a3f2f;`
- **src\styles\themes\Preview\coretokens.css** line 14
  `--a11y-cream-c-text: #4a3f2f;`

#### `rgba(0, 0, 0, 0.1)` (33 occurrences)

- **audit-BEFORE.md** line 35
  `| `rgba(0, 0, 0, 0.1)` | 15 | 10 | Create new token — used frequently |`
- **audit-BEFORE.md** line 982
  ``- [ ] Replace `rgba(0, 0, 0, 0.1)` with `color-mix(in oklch, var(--color-Black) 10%, transparent)```
- **audit-BEFORE.md** line 1223
  `#### `rgba(0, 0, 0, 0.1)` (15 occurrences)`
- **audit-BEFORE.md** line 1226
  ``- [ ] Replace `rgba(0, 0, 0, 0.1)` with `color-mix(in oklch, var(--color-Black) 10%, transparent)```
- **audit-BEFORE.md** line 1228
  ``- [ ] `src/styles/pages/legal.css`: `rgba(0, 0, 0, 0.1)```
- **audit-BEFORE.md** line 1230
  ``background: rgba(0, 0, 0, 0.1);``
- **audit-BEFORE.md** line 1232
  ``- [ ] `src/styles/pages/legal.css`: `border-bottom: 1px solid rgba(0, 0, 0, 0.1)` → use border token``
- **audit-BEFORE.md** line 1234
  ``box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);``
- **audit-BEFORE.md** line 1236
  ``box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);``
- **audit-BEFORE.md** line 1238
  ``box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);``
- **audit-BEFORE.md** line 1240
  ``box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);``
- **audit-BEFORE.md** line 1242
  ``box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);``
- **audit-BEFORE.md** line 1244
  ``background: rgba(0, 0, 0, 0.1) !important;``
- **audit-BEFORE.md** line 1246
  ``0 2px 8px rgba(0, 0, 0, 0.1);``
- **audit-BEFORE.md** line 1248
  ``0 0 0 1px rgba(0, 0, 0, 0.1);``
- **audit-BEFORE.md** line 1250
  ``0 2px 8px rgba(0, 0, 0, 0.1),``
- **audit-BEFORE.md** line 1252
  ``border-bottom: 1px solid rgba(0, 0, 0, 0.1);``
- **audit-BEFORE.md** line 1254
  ``box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);``
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

#### `#c4907c` (30 occurrences)

- **audit-BEFORE.md** line 39
  `| `#c4907c` | 11 | 8 | Replace with `var(--brand-c-secondary)` |`
- **audit-BEFORE.md** line 1345
  `#### `#c4907c` (11 occurrences)`
- **audit-BEFORE.md** line 1348
  ``"hex": "#c4907c",``
- **audit-BEFORE.md** line 1350
  ``"accent2": "#c4907c",``
- **audit-BEFORE.md** line 1354
  ``--brand-c-secondary: #c4907c;``
- **audit-BEFORE.md** line 1356
  ``--brand-c-secondary: #c4907c;``
- **audit-BEFORE.md** line 1358
  ``accent: '#c4907c',       // Terracotta``
- **audit-BEFORE.md** line 1360
  ``accent: '#c4907c',``
- **audit-BEFORE.md** line 1362
  ``--brand-secondary: #C4907C; /* base: 500 */``
- **audit-BEFORE.md** line 1364
  ``--brand-c-secondary: #c4907c;``
- **audit-BEFORE.md** line 1366
  ``--brand-c-secondary: #c4907c;``
- **audit-BEFORE.md** line 1368
  ``--brand-c-secondary: #c4907c;``
- **audit-BEFORE.md** line 4100
  `| `--brand-c-secondary` | `#c4907c` | `files\example-BrandDefault-NEW.css` | 8 |`
- **audit-BEFORE.md** line 4114
  `| `--brand-secondary` | `#C4907C` | `src\scripts\ThemeTokenGen\brand-template.css` | 38 |`
- **audit-BEFORE.md** line 5054
  `| `--brand-c-secondary` | `#c4907c` | `docs\Markdown Notes\Theme-Preview-System.md` | 29 |`
- **audit-BEFORE.md** line 5055
  `| `--brand-c-secondary` | `#c4907c` | `src\styles\themes\brand\BrandDefault.css` | 8 |`
- **audit-BEFORE.md** line 5056
  `| `--brand-c-secondary` | `#c4907c` | `src\styles\themes\Preview\coretokens.css` | 58 |`
- **audit-BEFORE.md** line 5082
  `| `--brand-c-secondary` | `#c4907c` | `files\example-BrandDefault-NEW.css` | 8 |`
- **audit-BEFORE.md** line 5106
  `| `--brand-secondary` | `#C4907C` | `src\scripts\ThemeTokenGen\brand-template.css` | 38 |`
- **audit-BEFORE.md** line 5882
  `| `--brand-c-secondary` | `#c4907c` | `src\styles\themes\brand\BrandDefault.css` | 28 |`
- **audit-BEFORE.md** line 6460
  `| `#c4907c` | `--brand-c-secondary`, `--brand-c-secondary`, `--brand-secondary`, `--brand-c-secondary` |`
- **audit-BEFORE.md** line 6533
  `| `#c4907c` | 56 | candidate-20 |`
- **docs\Brand\BRAND-PROFILE.json** line 40
  `"hex": "#c4907c",`
- **docs\Brand\BRAND-PROFILE.json** line 116
  `"accent2": "#c4907c",`
- **docs\Brand\BRAND-PROFILE.json** line 398
  `"snippetLong": "Walking with a Smile is a trauma recovery platform dedicated to helping survivors shift from pain-center`
- **docs\Markdown Notes\Theme-Preview-System.md** line 29
  `--brand-c-secondary: #c4907c;`
- **src\lib\emailit.ts** line 82
  `accent: '#c4907c',       // Terracotta`
- **src\pages\api\contact.ts** line 15
  `accent: '#c4907c',`
- **src\scripts\ThemeTokenGen\brand-template.css** line 38
  `--brand-secondary: #C4907C; /* base: 500 */`
- **src\styles\themes\brand\BrandDefault.css** line 8
  `--brand-c-secondary: #c4907c;`

#### `rgba(0, 0, 0, 0.15)` (30 occurrences)

- **audit-BEFORE.md** line 37
  `| `rgba(0, 0, 0, 0.15)` | 14 | 9 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1287
  `#### `rgba(0, 0, 0, 0.15)` (14 occurrences)`
- **audit-BEFORE.md** line 1290
  ``box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);``
- **audit-BEFORE.md** line 1292
  ``box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);``
- **audit-BEFORE.md** line 1294
  ``box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);``
- **audit-BEFORE.md** line 1296
  ``box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);``
- **audit-BEFORE.md** line 1298
  ``box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);``
- **audit-BEFORE.md** line 1300
  ``box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);``
- **audit-BEFORE.md** line 1302
  ``box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);``
- **audit-BEFORE.md** line 1304
  ``box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);``
- **audit-BEFORE.md** line 1306
  ``0 4px 20px rgba(0, 0, 0, 0.15),``
- **audit-BEFORE.md** line 1308
  ``0 4px 20px rgba(0, 0, 0, 0.15);``
- **audit-BEFORE.md** line 1310
  ``0 4px 20px rgba(0, 0, 0, 0.15);``
- **audit-BEFORE.md** line 1312
  ``0 4px 20px rgba(0, 0, 0, 0.15);``
- **audit-BEFORE.md** line 1314
  ``inset 0 1px 2px rgba(0, 0, 0, 0.15),``
- **audit-BEFORE.md** line 1316
  ``0 6px 20px rgba(0, 0, 0, 0.15),``
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

#### `#8b9d83` (27 occurrences)

- **audit-BEFORE.md** line 38
  `| `#8b9d83` | 12 | 2 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1318
  `#### `#8b9d83` (12 occurrences)`
- **audit-BEFORE.md** line 1321
  ``- SVG fill: Sage green (#8B9D83)``
- **audit-BEFORE.md** line 1323
  ``<path d="${circlePath}" fill="#8B9D83" fill-opacity="0.98"/>``
- **audit-BEFORE.md** line 1325
  ``<path d="${circlePath}" fill="#8B9D83" fill-opacity="0.98" data-position="center"/>``
- **audit-BEFORE.md** line 1327
  ``<path d="${circlePath}" fill="#8B9D83" fill-opacity="0.98" data-position="left"/>``
- **audit-BEFORE.md** line 1329
  ``<path d="${circlePath}" fill="#8B9D83" fill-opacity="0.98" data-position="right"/>``
- **audit-BEFORE.md** line 1331
  ``leftCircle.setAttribute('fill', '#8B9D83');``
- **audit-BEFORE.md** line 1333
  ``rightCircle.setAttribute('fill', '#8B9D83');``
- **audit-BEFORE.md** line 1335
  ``circle.setAttribute('fill', '#8B9D83');``
- **audit-BEFORE.md** line 1337
  ``circle.setAttribute('fill', '#8B9D83');``
- **audit-BEFORE.md** line 1339
  ``tempPath.setAttribute('fill', '#8B9D83');``
- **audit-BEFORE.md** line 1341
  ``tempPath.setAttribute('fill', '#8B9D83');``
- **audit-BEFORE.md** line 1343
  ``circle.setAttribute('fill', '#8B9D83');``
- **audit-BEFORE.md** line 1389
  ``- SVG fill: Sage green (#8B9D83)``
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

#### `#faf8f7` (25 occurrences)

- **audit-BEFORE.md** line 41
  `| `#faf8f7` | 10 | 5 | Replace with `var(--brand-c-bg)` |`
- **audit-BEFORE.md** line 1395
  `#### `#faf8f7` (10 occurrences)`
- **audit-BEFORE.md** line 1398
  ``"cardPattern": "Neutral background (#faf8f7), rounded corners (16px), soft shadow, subtle hover elevation",``
- **audit-BEFORE.md** line 1400
  ``--brand-c-bg: #faf8f7;``
- **audit-BEFORE.md** line 1402
  ``color: var(--brand-c-neutral-light, #faf8f7);``
- **audit-BEFORE.md** line 1404
  ``color: var(--brand-c-neutral-light, #faf8f7);``
- **audit-BEFORE.md** line 1406
  ``--brand-c-bg: #faf8f7;``
- **audit-BEFORE.md** line 1408
  ``--brand-c-bg: #faf8f7;``
- **audit-BEFORE.md** line 1410
  ``--brand-c-bg: #faf8f7;``
- **audit-BEFORE.md** line 1412
  ``--brand-c-neutral-light: #faf8f7;``
- **audit-BEFORE.md** line 1414
  ``--brand-c-neutral-light: #faf8f7;``
- **audit-BEFORE.md** line 1416
  ``--brand-c-bg: #faf8f7;``
- **audit-BEFORE.md** line 5059
  `| `--brand-c-bg` | `#faf8f7` | `files\example-BrandDefault-NEW.css` | 5 |`
- **audit-BEFORE.md** line 5060
  `| `--brand-c-bg` | `#faf8f7` | `src\styles\themes\brand\BrandDefault.css` | 5 |`
- **audit-BEFORE.md** line 5061
  `| `--brand-c-bg` | `#faf8f7` | `src\styles\themes\Preview\coretokens.css` | 55 |`
- **audit-BEFORE.md** line 5512
  `| `--brand-c-bg` | `#faf8f7` | `src\styles\themes\brand\BrandDefault.css` | 36 |`
- **audit-BEFORE.md** line 5557
  `| `--brand-c-bg` | `#faf8f7` | `src\styles\themes\brand\BrandDefault.css` | 35 |`
- **audit-BEFORE.md** line 5658
  `| `--brand-c-neutral-light` | `#faf8f7` | `src\styles\themes\brand\BrandDefault.css` | 61 |`
- **audit-BEFORE.md** line 5691
  `| `--brand-c-neutral-light` | `#faf8f7` | `src\styles\themes\brand\BrandDefault.css` | 60 |`
- **audit-BEFORE.md** line 6470
  `| `#faf8f7` | `--brand-c-bg`, `--brand-c-bg`, `--brand-c-bg`, `--brand-c-neutral-light`, `--brand-c-neutral-light` |`
- **audit-BEFORE.md** line 6515
  `| `#faf8f7` | 269 | candidate-2 |`
- **docs\Brand\BRAND-PROFILE.json** line 335
  `"cardPattern": "Neutral background (#faf8f7), rounded corners (16px), soft shadow, subtle hover elevation",`
- **src\styles\components\toast.css** line 45
  `color: var(--brand-c-neutral-light, #faf8f7);`
- **src\styles\components\toast.css** line 113
  `color: var(--brand-c-neutral-light, #faf8f7);`
- **src\styles\themes\brand\BrandDefault.css** line 5
  `--brand-c-bg: #faf8f7;`

#### `#5a3420` (25 occurrences)

- **audit-BEFORE.md** line 57
  `| `#5a3420` | 6 | 4 | Replace with `var(--brand-c-secondary-dark)` |`
- **audit-BEFORE.md** line 1687
  `#### `#5a3420` (6 occurrences)`
- **audit-BEFORE.md** line 1690
  ``- **Fix:** Add to BrandDefault.css line 32: `--brand-c-secondary-dark: #5a3420;```
- **audit-BEFORE.md** line 1692
  ``- Add to BrandDefault.css: `--brand-c-secondary-dark: #5a3420;```
- **audit-BEFORE.md** line 1694
  ``- `--brand-c-secondary-dark: #5a3420;```
- **audit-BEFORE.md** line 1696
  ``- ✓ **Added `--brand-c-secondary-dark: #5a3420`** (line 32)``
- **audit-BEFORE.md** line 1698
  ``- Add after line 32: `--brand-c-secondary-dark: #5a3420;```
- **audit-BEFORE.md** line 1700
  ``--brand-c-secondary-dark: #5a3420;``
- **audit-BEFORE.md** line 4180
  `| `--brand-c-secondary-dark` | `#5a3420` | `docs\reports\color-token-usage-report.md` | 193 |`
- **audit-BEFORE.md** line 4181
  `| `--brand-c-secondary-dark` | `#5a3420` | `docs\reports\color-token-usage-report.md` | 648 |`
- **audit-BEFORE.md** line 4182
  `| `--brand-c-secondary-dark` | `#5a3420` | `docs\reports\color-token-usage-report.md` | 691 |`
- **audit-BEFORE.md** line 4183
  `| `--brand-c-secondary-dark` | `#5a3420`** (line 32)` | `docs\reports\FIXES-APPLIED.md` | 12 |`
- **audit-BEFORE.md** line 4184
  `| `--brand-c-secondary-dark` | `#5a3420` | `docs\todo\TODO.md` | 257 |`
- **audit-BEFORE.md** line 4185
  `| `--brand-c-secondary-dark` | `#5a3420` | `src\styles\themes\brand\BrandDefault.css` | 32 |`
- **audit-BEFORE.md** line 5913
  `| `--brand-c-secondary-dark` | `#5a3420` | `docs\reports\color-token-usage-report.md` | 193 |`
- **audit-BEFORE.md** line 5914
  `| `--brand-c-secondary-dark` | `#5a3420` | `docs\reports\color-token-usage-report.md` | 648 |`
- **audit-BEFORE.md** line 5915
  `| `--brand-c-secondary-dark` | `#5a3420` | `docs\reports\color-token-usage-report.md` | 691 |`
- **audit-BEFORE.md** line 5916
  `| `--brand-c-secondary-dark` | `#5a3420`** (line 32)` | `docs\reports\FIXES-APPLIED.md` | 12 |`
- **audit-BEFORE.md** line 5917
  `| `--brand-c-secondary-dark` | `#5a3420` | `docs\todo\TODO.md` | 257 |`
- **audit-BEFORE.md** line 5918
  `| `--brand-c-secondary-dark` | `#5a3420` | `src\styles\themes\brand\BrandDefault.css` | 32 |`
- **docs\reports\color-token-usage-report.md** line 193
  `- **Fix:** Add to BrandDefault.css line 32: `--brand-c-secondary-dark: #5a3420;``
- **docs\reports\color-token-usage-report.md** line 648
  `- Add to BrandDefault.css: `--brand-c-secondary-dark: #5a3420;``
- **docs\reports\color-token-usage-report.md** line 691
  `- `--brand-c-secondary-dark: #5a3420;``
- **docs\reports\FIXES-APPLIED.md** line 12
  `- ✓ **Added `--brand-c-secondary-dark: #5a3420`** (line 32)`
- **docs\todo\TODO.md** line 257
  `- Add after line 32: `--brand-c-secondary-dark: #5a3420;``

#### `#474747` (24 occurrences)

- **audit-BEFORE.md** line 43
  `| `#474747` | 9 | 7 | Replace with `var(--brand-c-text)` |`
- **audit-BEFORE.md** line 1441
  `#### `#474747` (9 occurrences)`
- **audit-BEFORE.md** line 1444
  ``"hex": "#474747",``
- **audit-BEFORE.md** line 1446
  ``"textPrimary": "#474747",``
- **audit-BEFORE.md** line 1448
  ``--brand-c-text: #474747;``
- **audit-BEFORE.md** line 1450
  ``--brand-c-text: #474747;``
- **audit-BEFORE.md** line 1452
  ``text: '#474747',``
- **audit-BEFORE.md** line 1454
  ``text: '#474747',``
- **audit-BEFORE.md** line 1456
  ``--brand-c-text: #474747;``
- **audit-BEFORE.md** line 1458
  ``--brand-c-text: #474747;``
- **audit-BEFORE.md** line 1460
  ``--brand-c-text: #474747;``
- **audit-BEFORE.md** line 5087
  `| `--brand-c-text` | `#474747` | `docs\Markdown Notes\Theme-Preview-System.md` | 27 |`
- **audit-BEFORE.md** line 5089
  `| `--brand-c-text` | `#474747` | `files\example-BrandDefault-NEW.css` | 6 |`
- **audit-BEFORE.md** line 5090
  `| `--brand-c-text` | `#474747` | `src\styles\themes\brand\BrandDefault.css` | 7 |`
- **audit-BEFORE.md** line 5091
  `| `--brand-c-text` | `#474747` | `src\styles\themes\Preview\coretokens.css` | 56 |`
- **audit-BEFORE.md** line 6010
  `| `--brand-c-text` | `#474747` | `src\styles\themes\brand\BrandDefault.css` | 55 |`
- **audit-BEFORE.md** line 6444
  `| `#474747` | `--brand-c-text`, `--brand-c-text` |`
- **audit-BEFORE.md** line 6532
  `| `#474747` | 57 | candidate-19 |`
- **docs\Brand\BRAND-PROFILE.json** line 54
  `"hex": "#474747",`
- **docs\Brand\BRAND-PROFILE.json** line 110
  `"textPrimary": "#474747",`
- **docs\Markdown Notes\Theme-Preview-System.md** line 27
  `--brand-c-text: #474747;`
- **src\lib\emailit.ts** line 78
  `text: '#474747',`
- **src\pages\api\contact.ts** line 11
  `text: '#474747',`
- **src\styles\themes\brand\BrandDefault.css** line 6
  `--brand-c-text: #474747;`

#### `#777777` (23 occurrences)

- **audit-BEFORE.md** line 54
  `| `#777777` | 6 | 5 | Replace with `var(--brand-c-text)` |`
- **audit-BEFORE.md** line 1642
  `#### `#777777` (6 occurrences)`
- **audit-BEFORE.md** line 1645
  ``"textSecondary": "#777777",``
- **audit-BEFORE.md** line 1647
  ``"bodyColor": "#777777"``
- **audit-BEFORE.md** line 1649
  ``--brand-c-text-light: #777777;``
- **audit-BEFORE.md** line 1651
  ``--a11y-mono-c-accent: #777777;``
- **audit-BEFORE.md** line 1653
  ``--brand-c-text: #777777;``
- **audit-BEFORE.md** line 1655
  ``--a11y-monochrome-c-accent: #777777;``
- **audit-BEFORE.md** line 4108
  `| `--brand-c-text-light` | `#777777` | `files\example-BrandDefault-NEW.css` | 38 |`
- **audit-BEFORE.md** line 4968
  `| `--a11y-mono-c-accent` | `#777777` | `src\styles\themes\a11y\a11y-monochrome.css` | 17 |`
- **audit-BEFORE.md** line 4972
  `| `--a11y-monochrome-c-accent` | `#777777` | `src\styles\themes\Preview\coretokens.css` | 40 |`
- **audit-BEFORE.md** line 5095
  `| `--brand-c-text-light` | `#777777` | `files\example-BrandDefault-NEW.css` | 38 |`
- **audit-BEFORE.md** line 5986
  `| `--brand-c-text` | `#777777` | `src\styles\themes\brand\BrandDefault.css` | 53 |`
- **audit-BEFORE.md** line 6451
  `| `#777777` | `--a11y-mono-c-accent`, `--a11y-monochrome-c-accent`, `--brand-c-text-light`, `--brand-c-text` |`
- **audit-BEFORE.md** line 6522
  `| `#777777` | 144 | candidate-9 |`
- **docs\Brand\BRAND-PROFILE.json** line 111
  `"textSecondary": "#777777",`
- **docs\Brand\BRAND-PROFILE.json** line 153
  `"bodyColor": "#777777"`
- **files\example-BrandDefault-NEW.css** line 38
  `--brand-c-text-light: #777777;`
- **src\styles\themes\a11y\a11y-monochrome.css** line 5
  `--brand-c-secondary: #777777;`
- **src\styles\themes\a11y\a11y-monochrome.css** line 10
  `--brand-c-secondary-light: #777777;`
- **src\styles\themes\a11y\a11y-monochrome.css** line 11
  `--brand-c-secondary-dark: #777777;`
- **src\styles\themes\brand\BrandDefault.css** line 38
  `--brand-c-text-light: #777777;`
- **src\styles\themes\Preview\coretokens.css** line 40
  `--a11y-monochrome-c-accent: #777777;`

#### `#6b8e7a` (23 occurrences)

- **audit-BEFORE.md** line 74
  `| `#6b8e7a` | 5 | 3 | Replace with `var(--a11y-cream-c-accent)` |`
- **audit-BEFORE.md** line 1920
  `#### `#6b8e7a` (5 occurrences)`
- **audit-BEFORE.md** line 1923
  ``--brand-c-secondary: #6b8e7a;``
- **audit-BEFORE.md** line 1925
  ``--brand-c-secondary-light: #6b8e7a;``
- **audit-BEFORE.md** line 1927
  ``--brand-c-secondary-dark: #6b8e7a;``
- **audit-BEFORE.md** line 1929
  ``--a11y-cream-c-accent: #6b8e7a;``
- **audit-BEFORE.md** line 1931
  ``--a11y-cream-c-accent: #6b8e7a;``
- **audit-BEFORE.md** line 4099
  `| `--brand-c-secondary` | `#6b8e7a` | `files\example-a11y-cream-NEW.css` | 8 |`
- **audit-BEFORE.md** line 4101
  `| `--brand-c-secondary-dark` | `#6b8e7a` | `files\example-a11y-cream-NEW.css` | 20 |`
- **audit-BEFORE.md** line 4103
  `| `--brand-c-secondary-light` | `#6b8e7a` | `files\example-a11y-cream-NEW.css` | 19 |`
- **audit-BEFORE.md** line 4928
  `| `--a11y-cream-c-accent` | `#6b8e7a` | `src\styles\themes\a11y\a11y-cream.css` | 17 |`
- **audit-BEFORE.md** line 4929
  `| `--a11y-cream-c-accent` | `#6b8e7a` | `src\styles\themes\Preview\coretokens.css` | 16 |`
- **audit-BEFORE.md** line 5081
  `| `--brand-c-secondary` | `#6b8e7a` | `files\example-a11y-cream-NEW.css` | 8 |`
- **audit-BEFORE.md** line 5083
  `| `--brand-c-secondary-dark` | `#6b8e7a` | `files\example-a11y-cream-NEW.css` | 20 |`
- **audit-BEFORE.md** line 5085
  `| `--brand-c-secondary-light` | `#6b8e7a` | `files\example-a11y-cream-NEW.css` | 19 |`
- **audit-BEFORE.md** line 6449
  `| `#6b8e7a` | `--a11y-cream-c-accent`, `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light` |`
- **files\example-a11y-cream-NEW.css** line 8
  `--brand-c-secondary: #6b8e7a;`
- **files\example-a11y-cream-NEW.css** line 19
  `--brand-c-secondary-light: #6b8e7a;`
- **files\example-a11y-cream-NEW.css** line 20
  `--brand-c-secondary-dark: #6b8e7a;`
- **src\styles\themes\a11y\a11y-cream.css** line 5
  `--brand-c-secondary: #6b8e7a;`
- **src\styles\themes\a11y\a11y-cream.css** line 10
  `--brand-c-secondary-light: #6b8e7a;`
- **src\styles\themes\a11y\a11y-cream.css** line 11
  `--brand-c-secondary-dark: #6b8e7a;`
- **src\styles\themes\Preview\coretokens.css** line 16
  `--a11y-cream-c-accent: #6b8e7a;`

#### `rgba(0, 0, 0, 0.2)` (23 occurrences)

- **audit-BEFORE.md** line 42
  `| `rgba(0, 0, 0, 0.2)` | 10 | 6 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1418
  `#### `rgba(0, 0, 0, 0.2)` (10 occurrences)`
- **audit-BEFORE.md** line 1421
  ``- [ ] Replace `rgba(0, 0, 0, 0.2)` and `rgba(0, 0, 0, 0.6)` with `color-mix()```
- **audit-BEFORE.md** line 1423
  ``- [ ] `src/styles/a11y/components/accessibility-panel.css`: `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2)` → `var(--shadow-`
- **audit-BEFORE.md** line 1425
  ``box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);``
- **audit-BEFORE.md** line 1427
  ``box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);``
- **audit-BEFORE.md** line 1429
  ``box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);``
- **audit-BEFORE.md** line 1431
  ``text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);``
- **audit-BEFORE.md** line 1433
  ``text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);``
- **audit-BEFORE.md** line 1435
  ``box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);``
- **audit-BEFORE.md** line 1437
  ``inset 0 2px 6px rgba(0, 0, 0, 0.2),``
- **audit-BEFORE.md** line 1439
  ``0 10px 40px rgba(0, 0, 0, 0.2),``
- **audit-BEFORE.md** line 2339
  ``- [ ] Replace `rgba(0, 0, 0, 0.2)` and `rgba(0, 0, 0, 0.6)` with `color-mix()```
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

#### `green` (23 occurrences)

- **audit-BEFORE.md** line 388
  ``"buttonPrimary": "Sage green background (#8fa68a), white text, rounded corners (8px), soft shadow, hover lifts with enh`
- **audit-BEFORE.md** line 1124
  ``"buttonPrimary": "Sage green background (#8fa68a), white text, rounded corners (8px), soft shadow, hover lifts with enh`
- **audit-BEFORE.md** line 1321
  ``- SVG fill: Sage green (#8B9D83)``
- **audit-BEFORE.md** line 1373
  ``"colorName": "Sage Green",``
- **audit-BEFORE.md** line 1377
  ``"buttonPrimary": "Sage green background (#8fa68a), white text, rounded corners (8px), soft shadow, hover lifts with enh`
- **audit-BEFORE.md** line 1379
  ``"buttonSecondary": "Outlined style with sage green border, sage green text, transparent background, rounded corners (8p`
- **audit-BEFORE.md** line 1381
  ``"buttonGhost": "Transparent background, sage green text, no border, subtle hover background",``
- **audit-BEFORE.md** line 1383
  ``"formPattern": "Clean inputs with soft borders (#e0dedb), focus state with sage green outline, generous spacing",``
- **audit-BEFORE.md** line 1387
  ``--color-Success    /* #4caf50 - green */``
- **audit-BEFORE.md** line 1389
  ``- SVG fill: Sage green (#8B9D83)``
- **audit-BEFORE.md** line 1391
  ``--brand-background-dark: #2a3328; /* base: 850 - dark sage green for dark mode */``
- **audit-BEFORE.md** line 2010
  ``"formPattern": "Clean inputs with soft borders (#e0dedb), focus state with sage green outline, generous spacing",``
- **audit-BEFORE.md** line 2303
  ``--color-Success    /* #4caf50 - green */``
- **audit-BEFORE.md** line 3093
  ``--brand-background-dark: #2a3328; /* base: 850 - dark sage green for dark mode */``
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
- **docs\Markdown Notes\CSS-Tokens.md** line 92
  `--color-Success    /* #4caf50 - green */`
- **docs\Markdown Notes\new hero.md** line 50
  `- SVG fill: Sage green (#8B9D83)`
- **src\scripts\ThemeTokenGen\color-input.css** line 50
  `--brand-background-dark: #2a3328; /* base: 850 - dark sage green for dark mode */`

#### `#8b6914` (22 occurrences)

- **audit-BEFORE.md** line 44
  `| `#8b6914` | 9 | 4 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1189
  ``- [ ] Replace `#000000`, `#666666`, `#8b6914` with tokens``
- **audit-BEFORE.md** line 1462
  `#### `#8b6914` (9 occurrences)`
- **audit-BEFORE.md** line 1465
  ``- [ ] Replace `#000000`, `#666666`, `#8b6914` with tokens``
- **audit-BEFORE.md** line 1467
  ``border: 2px solid var(--a11y-cream-accent, #8b6914) !important;``
- **audit-BEFORE.md** line 1469
  ``border-left-color: var(--a11y-cream-accent, #8b6914) !important;``
- **audit-BEFORE.md** line 1471
  ``color: var(--a11y-cream-accent, #8b6914) !important;``
- **audit-BEFORE.md** line 1473
  ``color: var(--a11y-cream-accent, #8b6914) !important;``
- **audit-BEFORE.md** line 1475
  ``border-color: var(--a11y-cream-accent, #8b6914) !important;``
- **audit-BEFORE.md** line 1477
  ``border-color: var(--a11y-cream-accent, #8b6914) !important;``
- **audit-BEFORE.md** line 1479
  ``border-color: var(--a11y-cream-accent, #8b6914) !important;``
- **audit-BEFORE.md** line 1481
  ``color: var(--a11y-cream-accent, #8b6914) !important;``
- **audit-BEFORE.md** line 1509
  ``- [ ] Replace `#000000`, `#666666`, `#8b6914` with tokens``
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

#### `#ddd9d3` (22 occurrences)

- **audit-BEFORE.md** line 72
  `| `#ddd9d3` | 5 | 3 | Replace with `var(--a11y-cream-c-bg)` |`
- **audit-BEFORE.md** line 1894
  `#### `#ddd9d3` (5 occurrences)`
- **audit-BEFORE.md** line 1897
  ``--brand-c-bg: #ddd9d3;``
- **audit-BEFORE.md** line 1899
  ``--brand-c-neutral-light: #ddd9d3;``
- **audit-BEFORE.md** line 1901
  ``--brand-c-bg-light: #ddd9d3;``
- **audit-BEFORE.md** line 1903
  ``--a11y-cream-c-bg: #ddd9d3;``
- **audit-BEFORE.md** line 1905
  ``--a11y-cream-c-bg: #ddd9d3;``
- **audit-BEFORE.md** line 4087
  `| `--brand-c-bg-light` | `#ddd9d3` | `files\example-a11y-cream-NEW.css` | 32 |`
- **audit-BEFORE.md** line 4093
  `| `--brand-c-neutral-light` | `#ddd9d3` | `files\example-a11y-cream-NEW.css` | 25 |`
- **audit-BEFORE.md** line 4930
  `| `--a11y-cream-c-bg` | `#ddd9d3` | `src\styles\themes\a11y\a11y-cream.css` | 14 |`
- **audit-BEFORE.md** line 4931
  `| `--a11y-cream-c-bg` | `#ddd9d3` | `src\styles\themes\Preview\coretokens.css` | 13 |`
- **audit-BEFORE.md** line 5058
  `| `--brand-c-bg` | `#ddd9d3` | `files\example-a11y-cream-NEW.css` | 5 |`
- **audit-BEFORE.md** line 5064
  `| `--brand-c-bg-light` | `#ddd9d3` | `files\example-a11y-cream-NEW.css` | 32 |`
- **audit-BEFORE.md** line 5070
  `| `--brand-c-neutral-light` | `#ddd9d3` | `files\example-a11y-cream-NEW.css` | 25 |`
- **audit-BEFORE.md** line 6463
  `| `#ddd9d3` | `--a11y-cream-c-bg`, `--brand-c-bg`, `--brand-c-bg-light`, `--brand-c-neutral-light` |`
- **files\example-a11y-cream-NEW.css** line 5
  `--brand-c-bg: #ddd9d3;`
- **files\example-a11y-cream-NEW.css** line 25
  `--brand-c-neutral-light: #ddd9d3;`
- **files\example-a11y-cream-NEW.css** line 32
  `--brand-c-bg-light: #ddd9d3;`
- **src\styles\themes\a11y\a11y-cream.css** line 2
  `--brand-c-bg: #ddd9d3;`
- **src\styles\themes\a11y\a11y-cream.css** line 13
  `--brand-c-neutral-light: #ddd9d3;`
- **src\styles\themes\a11y\a11y-cream.css** line 17
  `--brand-c-bg-light: #ddd9d3;`
- **src\styles\themes\Preview\coretokens.css** line 13
  `--a11y-cream-c-bg: #ddd9d3;`

#### `#8b7355` (22 occurrences)

- **audit-BEFORE.md** line 73
  `| `#8b7355` | 5 | 3 | Replace with `var(--a11y-cream-c-primary)` |`
- **audit-BEFORE.md** line 1907
  `#### `#8b7355` (5 occurrences)`
- **audit-BEFORE.md** line 1910
  ``--brand-c-primary: #8b7355;``
- **audit-BEFORE.md** line 1912
  ``--brand-c-primary-light: #8b7355;``
- **audit-BEFORE.md** line 1914
  ``--brand-c-primary-dark: #8b7355;``
- **audit-BEFORE.md** line 1916
  ``--a11y-cream-c-primary: #8b7355;``
- **audit-BEFORE.md** line 1918
  ``--a11y-cream-c-primary: #8b7355;``
- **audit-BEFORE.md** line 4095
  `| `--brand-c-primary-dark` | `#8b7355` | `files\example-a11y-cream-NEW.css` | 14 |`
- **audit-BEFORE.md** line 4097
  `| `--brand-c-primary-light` | `#8b7355` | `files\example-a11y-cream-NEW.css` | 13 |`
- **audit-BEFORE.md** line 4932
  `| `--a11y-cream-c-primary` | `#8b7355` | `src\styles\themes\a11y\a11y-cream.css` | 16 |`
- **audit-BEFORE.md** line 4933
  `| `--a11y-cream-c-primary` | `#8b7355` | `src\styles\themes\Preview\coretokens.css` | 15 |`
- **audit-BEFORE.md** line 5073
  `| `--brand-c-primary` | `#8b7355` | `files\example-a11y-cream-NEW.css` | 7 |`
- **audit-BEFORE.md** line 5077
  `| `--brand-c-primary-dark` | `#8b7355` | `files\example-a11y-cream-NEW.css` | 14 |`
- **audit-BEFORE.md** line 5079
  `| `--brand-c-primary-light` | `#8b7355` | `files\example-a11y-cream-NEW.css` | 13 |`
- **audit-BEFORE.md** line 6454
  `| `#8b7355` | `--a11y-cream-c-primary`, `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light` |`
- **files\example-a11y-cream-NEW.css** line 7
  `--brand-c-primary: #8b7355;`
- **files\example-a11y-cream-NEW.css** line 13
  `--brand-c-primary-light: #8b7355;`
- **files\example-a11y-cream-NEW.css** line 14
  `--brand-c-primary-dark: #8b7355;`
- **src\styles\themes\a11y\a11y-cream.css** line 4
  `--brand-c-primary: #8b7355;`
- **src\styles\themes\a11y\a11y-cream.css** line 7
  `--brand-c-primary-light: #8b7355;`
- **src\styles\themes\a11y\a11y-cream.css** line 8
  `--brand-c-primary-dark: #8b7355;`
- **src\styles\themes\Preview\coretokens.css** line 15
  `--a11y-cream-c-primary: #8b7355;`

#### `#666666` (20 occurrences)

- **audit-BEFORE.md** line 46
  `| `#666666` | 8 | 5 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1189
  ``- [ ] Replace `#000000`, `#666666`, `#8b6914` with tokens``
- **audit-BEFORE.md** line 1465
  ``- [ ] Replace `#000000`, `#666666`, `#8b6914` with tokens``
- **audit-BEFORE.md** line 1504
  `#### `#666666` (8 occurrences)`
- **audit-BEFORE.md** line 1507
  ``color: #666666;``
- **audit-BEFORE.md** line 1509
  ``- [ ] Replace `#000000`, `#666666`, `#8b6914` with tokens``
- **audit-BEFORE.md** line 1511
  ``border: 2px solid #666666 !important;``
- **audit-BEFORE.md** line 1513
  ``border-left-color: #666666 !important;``
- **audit-BEFORE.md** line 1515
  ``border-color: #666666 !important;``
- **audit-BEFORE.md** line 1517
  ``color: #666666 !important;``
- **audit-BEFORE.md** line 1519
  ``border-color: #666666 !important;``
- **audit-BEFORE.md** line 1521
  ``border-color: #666666 !important;``
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

#### `#bdbab3` (20 occurrences)

- **audit-BEFORE.md** line 59
  `| `#bdbab3` | 6 | 5 | Create new token — used frequently |`
- **audit-BEFORE.md** line 881
  ``box-shadow: 20px 20px 40px #bdbab3, -20px -20px 40px #ffffff;``
- **audit-BEFORE.md** line 925
  ``box-shadow: 8px 8px 20px #bdbab3, -8px -8px 20px #ffffff !important;``
- **audit-BEFORE.md** line 949
  ``box-shadow: 29px 29px 60px #bdbab3, -29px -29px 60px #ffffff;``
- **audit-BEFORE.md** line 953
  ``box-shadow: 29px 29px 60px #bdbab3, -29px -29px 60px #ffffff;``
- **audit-BEFORE.md** line 957
  ``box-shadow: 20px 20px 40px #bdbab3, -20px -20px 40px #ffffff;``
- **audit-BEFORE.md** line 961
  ``box-shadow: 8px 8px 20px #bdbab3, -8px -8px 20px #ffffff;``
- **audit-BEFORE.md** line 1717
  `#### `#bdbab3` (6 occurrences)`
- **audit-BEFORE.md** line 1720
  ``box-shadow: 20px 20px 40px #bdbab3, -20px -20px 40px #ffffff;``
- **audit-BEFORE.md** line 1722
  ``box-shadow: 8px 8px 20px #bdbab3, -8px -8px 20px #ffffff !important;``
- **audit-BEFORE.md** line 1724
  ``box-shadow: 29px 29px 60px #bdbab3, -29px -29px 60px #ffffff;``
- **audit-BEFORE.md** line 1726
  ``box-shadow: 29px 29px 60px #bdbab3, -29px -29px 60px #ffffff;``
- **audit-BEFORE.md** line 1728
  ``box-shadow: 20px 20px 40px #bdbab3, -20px -20px 40px #ffffff;``
- **audit-BEFORE.md** line 1730
  ``box-shadow: 8px 8px 20px #bdbab3, -8px -8px 20px #ffffff;``
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

#### `#f59e0b` (20 occurrences)

- **audit-BEFORE.md** line 60
  `| `#f59e0b` | 6 | 4 | Replace with `var(--a11y-proto-c-accent)` |`
- **audit-BEFORE.md** line 1732
  `#### `#f59e0b` (6 occurrences)`
- **audit-BEFORE.md** line 1735
  ``--universal-warning: #cea96a; /* #f59e0b - Amber warning/caution */``
- **audit-BEFORE.md** line 1737
  ``background: var(--color-Warning-500, #f59e0b);``
- **audit-BEFORE.md** line 1739
  ``border-top-color: var(--color-Warning-500, #f59e0b);``
- **audit-BEFORE.md** line 1741
  ``border-bottom-color: var(--color-Warning-500, #f59e0b);``
- **audit-BEFORE.md** line 1743
  ``--a11y-proto-c-accent: #f59e0b;``
- **audit-BEFORE.md** line 1745
  ``--a11y-protanopia-c-accent: #f59e0b;``
- **audit-BEFORE.md** line 3078
  ``--universal-warning: #cea96a; /* #f59e0b - Amber warning/caution */``
- **audit-BEFORE.md** line 4976
  `| `--a11y-protanopia-c-accent` | `#f59e0b` | `src\styles\themes\Preview\coretokens.css` | 46 |`
- **audit-BEFORE.md** line 4980
  `| `--a11y-proto-c-accent` | `#f59e0b` | `src\styles\themes\a11y\a11y-protanopia.css` | 17 |`
- **audit-BEFORE.md** line 6466
  `| `#f59e0b` | `--a11y-protanopia-c-accent`, `--a11y-proto-c-accent` |`
- **src\scripts\ThemeTokenGen\brand-template.css** line 88
  `--universal-warning: #cea96a; /* #f59e0b - Amber warning/caution */`
- **src\styles\base\utilities.css** line 469
  `background: var(--color-Warning-500, #f59e0b);`
- **src\styles\base\utilities.css** line 474
  `border-top-color: var(--color-Warning-500, #f59e0b);`
- **src\styles\base\utilities.css** line 479
  `border-bottom-color: var(--color-Warning-500, #f59e0b);`
- **src\styles\themes\a11y\a11y-protanopia.css** line 5
  `--brand-c-secondary: #f59e0b;`
- **src\styles\themes\a11y\a11y-protanopia.css** line 10
  `--brand-c-secondary-light: #f59e0b;`
- **src\styles\themes\a11y\a11y-protanopia.css** line 11
  `--brand-c-secondary-dark: #f59e0b;`
- **src\styles\themes\Preview\coretokens.css** line 46
  `--a11y-protanopia-c-accent: #f59e0b;`

#### `#00ffff` (20 occurrences)

- **audit-BEFORE.md** line 64
  `| `#00ffff` | 5 | 3 | Replace with `var(--a11y-hc-c-accent)` |`
- **audit-BEFORE.md** line 1790
  `#### `#00ffff` (5 occurrences)`
- **audit-BEFORE.md** line 1793
  ``--brand-c-neutral: #00ffff;``
- **audit-BEFORE.md** line 1795
  ``--color-Info:    #00ffff;``
- **audit-BEFORE.md** line 1797
  ``--focusRing: #00ffff;``
- **audit-BEFORE.md** line 1799
  ``--a11y-hc-c-accent: #00ffff;``
- **audit-BEFORE.md** line 1801
  ``--a11y-high-contrast-c-accent: #00ffff;``
- **audit-BEFORE.md** line 4960
  `| `--a11y-hc-c-accent` | `#00ffff` | `src\styles\themes\a11y\a11y-high-contrast.css` | 17 |`
- **audit-BEFORE.md** line 4964
  `| `--a11y-high-contrast-c-accent` | `#00ffff` | `src\styles\themes\Preview\coretokens.css` | 34 |`
- **audit-BEFORE.md** line 5322
  `| `--brand-c-neutral` | `#00ffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 229 |`
- **audit-BEFORE.md** line 5642
  `| `--color-Info` | `#00ffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 239 |`
- **audit-BEFORE.md** line 6088
  `| `--focusRing` | `#00ffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 248 |`
- **audit-BEFORE.md** line 6430
  `| `#00ffff` | `--a11y-hc-c-accent`, `--a11y-high-contrast-c-accent`, `--brand-c-neutral`, `--color-Info`, `--focusRing` `
- **docs\Markdown Notes\accessibility-color-themes.md** line 229
  `--brand-c-neutral: #00ffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 239
  `--color-Info:    #00ffff;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 248
  `--focusRing: #00ffff;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 5
  `--brand-c-secondary: #00ffff;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 10
  `--brand-c-secondary-light: #00ffff;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 11
  `--brand-c-secondary-dark: #00ffff;`
- **src\styles\themes\Preview\coretokens.css** line 34
  `--a11y-high-contrast-c-accent: #00ffff;`

#### `rgba(0,0,0,0.1)` (20 occurrences)

- **audit-BEFORE.md** line 45
  `| `rgba(0,0,0,0.1)` | 9 | 5 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1483
  `#### `rgba(0,0,0,0.1)` (9 occurrences)`
- **audit-BEFORE.md** line 1486
  ``text-shadow: 0 1px 2px rgba(0,0,0,0.1);``
- **audit-BEFORE.md** line 1488
  ``box-shadow: 0 2px 8px rgba(0,0,0,0.1);``
- **audit-BEFORE.md** line 1490
  ``box-shadow: 0 2px 4px rgba(0,0,0,0.1);``
- **audit-BEFORE.md** line 1492
  ``box-shadow: 0 1px 3px rgba(0,0,0,0.1);``
- **audit-BEFORE.md** line 1494
  ``box-shadow: 0 1px 2px rgba(0,0,0,0.1);``
- **audit-BEFORE.md** line 1496
  ``box-shadow: 0 4px 20px rgba(0,0,0,0.1);``
- **audit-BEFORE.md** line 1498
  ``border-bottom: 1px solid rgba(0,0,0,0.1);``
- **audit-BEFORE.md** line 1500
  ``box-shadow: 0 2px 8px rgba(0,0,0,0.1);``
- **audit-BEFORE.md** line 1502
  ``border: 2px solid rgba(0,0,0,0.1);``
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

#### `#f5f5f5` (19 occurrences)

- **audit-BEFORE.md** line 48
  `| `#f5f5f5` | 7 | 6 | Create new token — used frequently |`
- **audit-BEFORE.md** line 867
  ``- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens``
- **audit-BEFORE.md** line 1047
  ``- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens``
- **audit-BEFORE.md** line 1542
  `#### `#f5f5f5` (7 occurrences)`
- **audit-BEFORE.md** line 1545
  ``background: #f5f5f5;``
- **audit-BEFORE.md** line 1547
  ``- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens``
- **audit-BEFORE.md** line 1549
  ``- [ ] Replace `background: #f5f5f5` (code blocks) with token``
- **audit-BEFORE.md** line 1551
  ``background: #f5f5f5;``
- **audit-BEFORE.md** line 1553
  ``background: #f5f5f5;``
- **audit-BEFORE.md** line 1555
  ``background: #f5f5f5 !important;``
- **audit-BEFORE.md** line 1557
  ``background: #f5f5f5 !important;``
- **audit-BEFORE.md** line 2129
  ``- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens``
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

#### `#1a1a1a` (18 occurrences)

- **audit-BEFORE.md** line 47
  `| `#1a1a1a` | 8 | 3 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1523
  `#### `#1a1a1a` (8 occurrences)`
- **audit-BEFORE.md** line 1526
  ``color: var(--brand-c-text, #1a1a1a) !important;``
- **audit-BEFORE.md** line 1528
  ``color: #1a1a1a !important;``
- **audit-BEFORE.md** line 1530
  ``color: #1a1a1a !important;``
- **audit-BEFORE.md** line 1532
  ``color: #1a1a1a !important;``
- **audit-BEFORE.md** line 1534
  ``color: #1a1a1a !important;``
- **audit-BEFORE.md** line 1536
  ``color: #1a1a1a !important;``
- **audit-BEFORE.md** line 1538
  ``border-left-color: var(--brand-c-text, #1a1a1a);``
- **audit-BEFORE.md** line 1540
  ``border-right-color: var(--brand-c-text, #1a1a1a);``
- **src\styles\a11y\components\masonry-grid.css** line 10
  `color: var(--brand-c-text, #1a1a1a) !important;`
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
  `border-left-color: var(--brand-c-text, #1a1a1a);`
- **src\styles\base\utilities.css** line 371
  `border-right-color: var(--brand-c-text, #1a1a1a);`

#### `#121212` (18 occurrences)

- **audit-BEFORE.md** line 91
  `| `#121212` | 4 | 4 | Replace with `var(--a11y-dark-c-bg)` |`
- **audit-BEFORE.md** line 1038
  ``--color-Black: #121212;``
- **audit-BEFORE.md** line 2115
  `#### `#121212` (4 occurrences)`
- **audit-BEFORE.md** line 2118
  ``- Background-50 through Background-500 → single color (#121212 in dark mode)``
- **audit-BEFORE.md** line 2120
  ``--a11y-dark-c-bg: #121212;``
- **audit-BEFORE.md** line 2122
  ``--a11y-dark-c-bg: #121212;``
- **audit-BEFORE.md** line 2124
  ``--color-Black: #121212;``
- **audit-BEFORE.md** line 4940
  `| `--a11y-dark-c-bg` | `#121212` | `src\styles\themes\a11y\a11y-dark.css` | 14 |`
- **audit-BEFORE.md** line 4941
  `| `--a11y-dark-c-bg` | `#121212` | `src\styles\themes\Preview\coretokens.css` | 19 |`
- **audit-BEFORE.md** line 5621
  `| `--color-Black` | `#121212` | `src\styles\tokens\status.css` | 10 |`
- **audit-BEFORE.md** line 6434
  `| `#121212` | `--a11y-dark-c-bg`, `--color-Black` |`
- **docs\todo\TODO.md** line 320
  `- Background-50 through Background-500 → single color (#121212 in dark mode)`
- **src\styles\themes\a11y\a11y-dark.css** line 2
  `--brand-c-bg: #121212;`
- **src\styles\themes\a11y\a11y-dark.css** line 13
  `--brand-c-neutral-light: #121212;`
- **src\styles\themes\a11y\a11y-dark.css** line 17
  `--brand-c-bg-light: #121212;`
- **src\styles\themes\a11y\a11y-dark.css** line 18
  `--brand-c-bg-dark: #121212;`
- **src\styles\themes\Preview\coretokens.css** line 19
  `--a11y-dark-c-bg: #121212;`
- **src\styles\tokens\status.css** line 10
  `--color-Black: #121212;`

#### `#555555` (18 occurrences)

- **audit-BEFORE.md** line 92
  `| `#555555` | 4 | 4 | Replace with `var(--a11y-mono-c-primary)` |`
- **audit-BEFORE.md** line 867
  ``- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens``
- **audit-BEFORE.md** line 1047
  ``- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens``
- **audit-BEFORE.md** line 1547
  ``- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens``
- **audit-BEFORE.md** line 2126
  `#### `#555555` (4 occurrences)`
- **audit-BEFORE.md** line 2129
  ``- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens``
- **audit-BEFORE.md** line 2131
  ``color: #555555 !important;``
- **audit-BEFORE.md** line 2133
  ``--a11y-mono-c-primary: #555555;``
- **audit-BEFORE.md** line 2135
  ``--a11y-monochrome-c-primary: #555555;``
- **audit-BEFORE.md** line 4970
  `| `--a11y-mono-c-primary` | `#555555` | `src\styles\themes\a11y\a11y-monochrome.css` | 16 |`
- **audit-BEFORE.md** line 4974
  `| `--a11y-monochrome-c-primary` | `#555555` | `src\styles\themes\Preview\coretokens.css` | 39 |`
- **audit-BEFORE.md** line 6446
  `| `#555555` | `--a11y-mono-c-primary`, `--a11y-monochrome-c-primary` |`
- **docs\todo\TODO.md** line 464
  `- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens`
- **src\styles\a11y\components\search-overlay.css** line 140
  `color: #555555 !important;`
- **src\styles\themes\a11y\a11y-monochrome.css** line 4
  `--brand-c-primary: #555555;`
- **src\styles\themes\a11y\a11y-monochrome.css** line 7
  `--brand-c-primary-light: #555555;`
- **src\styles\themes\a11y\a11y-monochrome.css** line 8
  `--brand-c-primary-dark: #555555;`
- **src\styles\themes\Preview\coretokens.css** line 39
  `--a11y-monochrome-c-primary: #555555;`

#### `#e6e2da` (17 occurrences)

- **audit-BEFORE.md** line 76
  `| `#e6e2da` | 5 | 4 | Create new token — used frequently |`
- **audit-BEFORE.md** line 879
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 947
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 951
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 955
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 959
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 1946
  `#### `#e6e2da` (5 occurrences)`
- **audit-BEFORE.md** line 1949
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 1951
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 1953
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 1955
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
- **audit-BEFORE.md** line 1957
  ``background: linear-gradient(145deg, #e6e2da, #ffffff);``
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

#### `#00ff00` (17 occurrences)

- **audit-BEFORE.md** line 86
  `| `#00ff00` | 4 | 3 | Replace with `var(--a11y-hc-c-primary)` |`
- **audit-BEFORE.md** line 2060
  `#### `#00ff00` (4 occurrences)`
- **audit-BEFORE.md** line 2063
  ``--brand-c-neutral: #00ff00;``
- **audit-BEFORE.md** line 2065
  ``--color-Success: #00ff00;``
- **audit-BEFORE.md** line 2067
  ``--a11y-hc-c-primary: #00ff00;``
- **audit-BEFORE.md** line 2069
  ``--a11y-high-contrast-c-primary: #00ff00;``
- **audit-BEFORE.md** line 4962
  `| `--a11y-hc-c-primary` | `#00ff00` | `src\styles\themes\a11y\a11y-high-contrast.css` | 16 |`
- **audit-BEFORE.md** line 4966
  `| `--a11y-high-contrast-c-primary` | `#00ff00` | `src\styles\themes\Preview\coretokens.css` | 33 |`
- **audit-BEFORE.md** line 5393
  `| `--brand-c-neutral` | `#00ff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 231 |`
- **audit-BEFORE.md** line 5921
  `| `--color-Success` | `#00ff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 235 |`
- **audit-BEFORE.md** line 6429
  `| `#00ff00` | `--a11y-hc-c-primary`, `--a11y-high-contrast-c-primary`, `--brand-c-neutral`, `--color-Success` |`
- **docs\Markdown Notes\accessibility-color-themes.md** line 231
  `--brand-c-neutral: #00ff00;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 235
  `--color-Success: #00ff00;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 4
  `--brand-c-primary: #00ff00;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 7
  `--brand-c-primary-light: #00ff00;`
- **src\styles\themes\a11y\a11y-high-contrast.css** line 8
  `--brand-c-primary-dark: #00ff00;`
- **src\styles\themes\Preview\coretokens.css** line 33
  `--a11y-high-contrast-c-primary: #00ff00;`

#### `#ccd3da` (17 occurrences)

- **audit-BEFORE.md** line 90
  `| `#ccd3da` | 4 | 4 | Replace with `var(--a11y-dark-c-text)` |`
- **audit-BEFORE.md** line 2104
  `#### `#ccd3da` (4 occurrences)`
- **audit-BEFORE.md** line 2107
  ``--a11y-dark-c-text: #ccd3da;``
- **audit-BEFORE.md** line 2109
  ``- Text-50 through Text-950 → single color (#ccd3da in dark mode)``
- **audit-BEFORE.md** line 2111
  ``--a11y-dark-c-text: #ccd3da;``
- **audit-BEFORE.md** line 2113
  ``--a11y-dark-c-text: #ccd3da;``
- **audit-BEFORE.md** line 4948
  `| `--a11y-dark-c-text` | `#ccd3da` | `docs\Markdown Notes\Theme-Preview-System.md` | 33 |`
- **audit-BEFORE.md** line 4949
  `| `--a11y-dark-c-text` | `#ccd3da` | `src\styles\themes\a11y\a11y-dark.css` | 18 |`
- **audit-BEFORE.md** line 4950
  `| `--a11y-dark-c-text` | `#ccd3da` | `src\styles\themes\Preview\coretokens.css` | 20 |`
- **docs\Markdown Notes\Theme-Preview-System.md** line 33
  `--a11y-dark-c-text: #ccd3da;`
- **docs\todo\TODO.md** line 321
  `- Text-50 through Text-950 → single color (#ccd3da in dark mode)`
- **src\styles\themes\a11y\a11y-dark.css** line 3
  `--brand-c-text: #ccd3da;`
- **src\styles\themes\a11y\a11y-dark.css** line 14
  `--brand-c-neutral: #ccd3da;`
- **src\styles\themes\a11y\a11y-dark.css** line 15
  `--brand-c-neutral-dark: #ccd3da;`
- **src\styles\themes\a11y\a11y-dark.css** line 20
  `--brand-c-text-light: #ccd3da;`
- **src\styles\themes\a11y\a11y-dark.css** line 21
  `--brand-c-text-dark: #ccd3da;`
- **src\styles\themes\Preview\coretokens.css** line 20
  `--a11y-dark-c-text: #ccd3da;`

#### `rgba(255, 255, 255, 0.1)` (17 occurrences)

- **audit-BEFORE.md** line 61
  `| `rgba(255, 255, 255, 0.1)` | 6 | 4 | Replace with `var(--glass-bg)` |`
- **audit-BEFORE.md** line 1747
  `#### `rgba(255, 255, 255, 0.1)` (6 occurrences)`
- **audit-BEFORE.md** line 1750
  ``border-top: 1px solid rgba(255, 255, 255, 0.1);``
- **audit-BEFORE.md** line 1752
  ``border: var(--border-width) solid rgba(255, 255, 255, 0.1);``
- **audit-BEFORE.md** line 1754
  ``0 1px 0 rgba(255, 255, 255, 0.1);``
- **audit-BEFORE.md** line 1756
  ``background: rgba(255, 255, 255, 0.1);``
- **audit-BEFORE.md** line 1758
  ``--glint-gradient-subtle: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);``
- **audit-BEFORE.md** line 1760
  ``--glass-bg: rgba(255, 255, 255, 0.1);``
- **audit-BEFORE.md** line 4217
  `| `--glint-gradient-subtle` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)` | `src\styles`
- **audit-BEFORE.md** line 6102
  `| `--glass-bg` | `rgba(255, 255, 255, 0.1)` | `src\styles\tokens\shadows.css` | 80 |`
- **audit-BEFORE.md** line 6120
  `| `--glint-gradient-subtle` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)` | `src\styles`
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

#### `#dc2626` (16 occurrences)

- **audit-BEFORE.md** line 52
  `| `#dc2626` | 7 | 1 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1610
  `#### `#dc2626` (7 occurrences)`
- **audit-BEFORE.md** line 1613
  ``color: var(--color-Error-500, #dc2626);``
- **audit-BEFORE.md** line 1615
  ``color: var(--color-Error-500, #dc2626);``
- **audit-BEFORE.md** line 1617
  ``border-color: var(--color-Error-500, #dc2626) !important;``
- **audit-BEFORE.md** line 1619
  ``outline-color: var(--color-Error-500, #dc2626);``
- **audit-BEFORE.md** line 1621
  ``box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-Error-500, #dc2626) 10%, transparent);``
- **audit-BEFORE.md** line 1623
  ``outline: 2px solid var(--color-Error-500, #dc2626);``
- **audit-BEFORE.md** line 1625
  ``color: var(--color-Error-500, #dc2626);``
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

#### `#fff` (16 occurrences)

- **audit-BEFORE.md** line 58
  `| `#fff` | 6 | 3 | Create new token — used frequently |`
- **audit-BEFORE.md** line 490
  ``color: var(--color-White, #fff);``
- **audit-BEFORE.md** line 1702
  `#### `#fff` (6 occurrences)`
- **audit-BEFORE.md** line 1705
  ``color: var(--color-White, #fff);``
- **audit-BEFORE.md** line 1707
  ``const textColor = luminance > 0.5 ? '#000' : '#fff';``
- **audit-BEFORE.md** line 1709
  ``background: color-mix(in oklch, var(--brand-c-bg, #fff) 85%, transparent);``
- **audit-BEFORE.md** line 1711
  ``border: 1px solid color-mix(in oklch, var(--brand-c-bg, #fff) 25%, transparent);``
- **audit-BEFORE.md** line 1713
  ``border-top-color: color-mix(in oklch, var(--brand-c-bg, #fff) 85%, transparent);``
- **audit-BEFORE.md** line 1715
  ``border-bottom-color: color-mix(in oklch, var(--brand-c-bg, #fff) 85%, transparent);``
- **audit-BEFORE.md** line 3438
  ``const textColor = luminance > 0.5 ? '#000' : '#fff';``
- **src\components\Presentation\Sections\HeroSection.astro** line 94
  `color: var(--color-White, #fff);`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 143
  `const textColor = luminance > 0.5 ? '#000' : '#fff';`
- **src\styles\base\utilities.css** line 384
  `background: color-mix(in oklch, var(--brand-c-bg, #fff) 85%, transparent);`
- **src\styles\base\utilities.css** line 386
  `border: 1px solid color-mix(in oklch, var(--brand-c-bg, #fff) 25%, transparent);`
- **src\styles\base\utilities.css** line 392
  `border-top-color: color-mix(in oklch, var(--brand-c-bg, #fff) 85%, transparent);`
- **src\styles\base\utilities.css** line 397
  `border-bottom-color: color-mix(in oklch, var(--brand-c-bg, #fff) 85%, transparent);`

#### `#e0dedb` (16 occurrences)

- **audit-BEFORE.md** line 81
  `| `#e0dedb` | 4 | 3 | Replace with `var(--brand-c-neutral-light)` |`
- **audit-BEFORE.md** line 1383
  ``"formPattern": "Clean inputs with soft borders (#e0dedb), focus state with sage green outline, generous spacing",``
- **audit-BEFORE.md** line 2005
  `#### `#e0dedb` (4 occurrences)`
- **audit-BEFORE.md** line 2008
  ``"border": "#e0dedb",``
- **audit-BEFORE.md** line 2010
  ``"formPattern": "Clean inputs with soft borders (#e0dedb), focus state with sage green outline, generous spacing",``
- **audit-BEFORE.md** line 2012
  ``--brand-c-neutral-light: #e0dedb;``
- **audit-BEFORE.md** line 2014
  ``--brand-c-neutral-light: #e0dedb;``
- **audit-BEFORE.md** line 4094
  `| `--brand-c-neutral-light` | `#e0dedb` | `files\example-BrandDefault-NEW.css` | 25 |`
- **audit-BEFORE.md** line 5071
  `| `--brand-c-neutral-light` | `#e0dedb` | `files\example-BrandDefault-NEW.css` | 25 |`
- **audit-BEFORE.md** line 5666
  `| `--brand-c-neutral-light` | `#e0dedb` | `src\styles\themes\brand\BrandDefault.css` | 62 |`
- **audit-BEFORE.md** line 6464
  `| `#e0dedb` | `--brand-c-neutral-light`, `--brand-c-neutral-light` |`
- **audit-BEFORE.md** line 6530
  `| `#e0dedb` | 59 | candidate-17 |`
- **docs\Brand\BRAND-PROFILE.json** line 114
  `"border": "#e0dedb",`
- **docs\Brand\BRAND-PROFILE.json** line 338
  `"formPattern": "Clean inputs with soft borders (#e0dedb), focus state with sage green outline, generous spacing",`
- **files\example-BrandDefault-NEW.css** line 25
  `--brand-c-neutral-light: #e0dedb;`
- **src\styles\themes\brand\BrandDefault.css** line 25
  `--brand-c-neutral-light: #e0dedb;`

#### `rgba(255, 255, 255, 0.15)` (16 occurrences)

- **audit-BEFORE.md** line 49
  `| `rgba(255, 255, 255, 0.15)` | 7 | 4 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1559
  `#### `rgba(255, 255, 255, 0.15)` (7 occurrences)`
- **audit-BEFORE.md** line 1562
  ``background: rgba(255, 255, 255, 0.15) !important;``
- **audit-BEFORE.md** line 1564
  ``background: rgba(255, 255, 255, 0.15);``
- **audit-BEFORE.md** line 1566
  ``background: rgba(255, 255, 255, 0.15);``
- **audit-BEFORE.md** line 1568
  ``background: rgba(255, 255, 255, 0.15);``
- **audit-BEFORE.md** line 1570
  ``background: rgba(255, 255, 255, 0.15);``
- **audit-BEFORE.md** line 1572
  ``background: rgba(255, 255, 255, 0.15) !important;``
- **audit-BEFORE.md** line 1574
  ``border: var(--border-width) solid rgba(255, 255, 255, 0.15);``
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

#### `rgba(0, 0, 0, 0.25)` (16 occurrences)

- **audit-BEFORE.md** line 50
  `| `rgba(0, 0, 0, 0.25)` | 7 | 3 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1576
  `#### `rgba(0, 0, 0, 0.25)` (7 occurrences)`
- **audit-BEFORE.md** line 1579
  ``box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);``
- **audit-BEFORE.md** line 1581
  ``box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);``
- **audit-BEFORE.md** line 1583
  ``box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);``
- **audit-BEFORE.md** line 1585
  ``box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25) !important;``
- **audit-BEFORE.md** line 1587
  ``box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);``
- **audit-BEFORE.md** line 1589
  ``0 8px 32px rgba(0, 0, 0, 0.25);``
- **audit-BEFORE.md** line 1591
  ``4px 4px 0 rgba(0, 0, 0, 0.25),``
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

#### `hsl((h + offset)` (16 occurrences)

- **audit-BEFORE.md** line 51
  `| `hsl((h + offset)` | 7 | 2 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1593
  `#### `hsl((h + offset)` (7 occurrences)`
- **audit-BEFORE.md** line 1596
  ``return chroma.hsl((h + offset) % 360, s, l);``
- **audit-BEFORE.md** line 1598
  ``return chroma.hsl((h + offset) % 360, s, l);``
- **audit-BEFORE.md** line 1600
  ``return chroma.hsl((h + offset) % 360, s, l);``
- **audit-BEFORE.md** line 1602
  ``return chroma.hsl((h + offset) % 360, s, l);``
- **audit-BEFORE.md** line 1604
  ``return chroma.hsl((h + offset) % 360, s, l);``
- **audit-BEFORE.md** line 1606
  ``return chroma.hsl((h + offset) % 360, s, l);``
- **audit-BEFORE.md** line 1608
  ``return chroma.hsl((h + offset) % 360, s, l);``
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

#### `#9c8579` (15 occurrences)

- **audit-BEFORE.md** line 78
  `| `#9c8579` | 4 | 3 | Replace with `var(--brand-c-neutral)` |`
- **audit-BEFORE.md** line 1972
  `#### `#9c8579` (4 occurrences)`
- **audit-BEFORE.md** line 1975
  ``"hex": "#9c8579",``
- **audit-BEFORE.md** line 1977
  ``--brand-accent1: #9C8579; /* from: primary, theory: triadic, index: 0, base: 400 */``
- **audit-BEFORE.md** line 1979
  ``--brand-accent1: #9C8579; /* base: 500 */``
- **audit-BEFORE.md** line 1981
  ``--brand-c-neutral: #9c8579;``
- **audit-BEFORE.md** line 4056
  `| `--brand-accent1` | `#9C8579` | `src\scripts\ThemeTokenGen\brand-template.css` | 13 |`
- **audit-BEFORE.md** line 4057
  `| `--brand-accent1` | `#9C8579` | `src\scripts\ThemeTokenGen\brand-template.css` | 64 |`
- **audit-BEFORE.md** line 5025
  `| `--brand-accent1` | `#9C8579` | `src\scripts\ThemeTokenGen\brand-template.css` | 13 |`
- **audit-BEFORE.md** line 5026
  `| `--brand-accent1` | `#9C8579` | `src\scripts\ThemeTokenGen\brand-template.css` | 64 |`
- **audit-BEFORE.md** line 5334
  `| `--brand-c-neutral` | `#9c8579` | `src\styles\themes\brand\BrandDefault.css` | 72 |`
- **audit-BEFORE.md** line 6457
  `| `#9c8579` | `--brand-accent1`, `--brand-c-neutral` |`
- **docs\Brand\BRAND-PROFILE.json** line 61
  `"hex": "#9c8579",`
- **src\scripts\ThemeTokenGen\brand-template.css** line 13
  `--brand-accent1: #9C8579; /* from: primary, theory: triadic, index: 0, base: 400 */`
- **src\scripts\ThemeTokenGen\brand-template.css** line 64
  `--brand-accent1: #9C8579; /* base: 500 */`

#### `#556a50` (15 occurrences)

- **audit-BEFORE.md** line 82
  `| `#556a50` | 4 | 3 | Replace with `var(--brand-c-primary-dark)` |`
- **audit-BEFORE.md** line 2016
  `#### `#556a50` (4 occurrences)`
- **audit-BEFORE.md** line 2019
  ``"h1Color": "#556a50",``
- **audit-BEFORE.md** line 2021
  ``"h3Color": "#556a50",``
- **audit-BEFORE.md** line 2023
  ``--brand-c-primary-dark: #556a50;``
- **audit-BEFORE.md** line 2025
  ``--brand-c-primary-dark: #556a50;``
- **audit-BEFORE.md** line 4096
  `| `--brand-c-primary-dark` | `#556a50` | `files\example-BrandDefault-NEW.css` | 14 |`
- **audit-BEFORE.md** line 5078
  `| `--brand-c-primary-dark` | `#556a50` | `files\example-BrandDefault-NEW.css` | 14 |`
- **audit-BEFORE.md** line 5811
  `| `--brand-c-primary-dark` | `#556a50` | `src\styles\themes\brand\BrandDefault.css` | 19 |`
- **audit-BEFORE.md** line 6447
  `| `#556a50` | `--brand-c-primary-dark`, `--brand-c-primary-dark` |`
- **audit-BEFORE.md** line 6525
  `| `#556a50` | 95 | candidate-12 |`
- **docs\Brand\BRAND-PROFILE.json** line 144
  `"h1Color": "#556a50",`
- **docs\Brand\BRAND-PROFILE.json** line 150
  `"h3Color": "#556a50",`
- **files\example-BrandDefault-NEW.css** line 14
  `--brand-c-primary-dark: #556a50;`
- **src\styles\themes\brand\BrandDefault.css** line 14
  `--brand-c-primary-dark: #556a50;`

#### `#ffff00` (15 occurrences)

- **audit-BEFORE.md** line 85
  `| `#ffff00` | 4 | 1 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2049
  `#### `#ffff00` (4 occurrences)`
- **audit-BEFORE.md** line 2052
  ``--brand-c-secondary: #ffff00;``
- **audit-BEFORE.md** line 2054
  ``--brand-c-neutral: #ffff00;``
- **audit-BEFORE.md** line 2056
  ``--color-Warning: #ffff00;``
- **audit-BEFORE.md** line 2058
  ``--link: #ffff00;``
- **audit-BEFORE.md** line 5464
  `| `--brand-c-neutral` | `#ffff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 230 |`
- **audit-BEFORE.md** line 5874
  `| `--brand-c-secondary` | `#ffff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 227 |`
- **audit-BEFORE.md** line 6036
  `| `--color-Warning` | `#ffff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 236 |`
- **audit-BEFORE.md** line 6270
  `| `--link` | `#ffff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 246 |`
- **audit-BEFORE.md** line 6474
  `| `#ffff00` | `--brand-c-neutral`, `--brand-c-secondary`, `--color-Warning`, `--link` |`
- **docs\Markdown Notes\accessibility-color-themes.md** line 227
  `--brand-c-secondary: #ffff00;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 230
  `--brand-c-neutral: #ffff00;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 236
  `--color-Warning: #ffff00;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 246
  `--link: #ffff00;`

#### `rgba(0, 0, 0, 0.06)` (15 occurrences)

- **audit-BEFORE.md** line 70
  `| `rgba(0, 0, 0, 0.06)` | 5 | 4 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1868
  `#### `rgba(0, 0, 0, 0.06)` (5 occurrences)`
- **audit-BEFORE.md** line 1871
  ``- [ ] `src/styles/pages/asset-detail.css`: `rgba(0, 0, 0, 0.06)`, `rgba(0, 0, 0, 0.04)```
- **audit-BEFORE.md** line 1873
  ``box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);``
- **audit-BEFORE.md** line 1875
  ``box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);``
- **audit-BEFORE.md** line 1877
  ``box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06), inset 0 1px 3px rgba(0, 0, 0, 0.04);``
- **audit-BEFORE.md** line 1879
  ``box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06), inset 0 1px 3px rgba(0, 0, 0, 0.04);``
- **audit-BEFORE.md** line 1884
  ``- [ ] `src/styles/pages/asset-detail.css`: `rgba(0, 0, 0, 0.06)`, `rgba(0, 0, 0, 0.04)```
- **audit-BEFORE.md** line 1890
  ``box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06), inset 0 1px 3px rgba(0, 0, 0, 0.04);``
- **audit-BEFORE.md** line 1892
  ``box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06), inset 0 1px 3px rgba(0, 0, 0, 0.04);``
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

#### `rgba(0, 0, 0, 0.04)` (15 occurrences)

- **audit-BEFORE.md** line 71
  `| `rgba(0, 0, 0, 0.04)` | 5 | 4 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1871
  ``- [ ] `src/styles/pages/asset-detail.css`: `rgba(0, 0, 0, 0.06)`, `rgba(0, 0, 0, 0.04)```
- **audit-BEFORE.md** line 1877
  ``box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06), inset 0 1px 3px rgba(0, 0, 0, 0.04);``
- **audit-BEFORE.md** line 1879
  ``box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06), inset 0 1px 3px rgba(0, 0, 0, 0.04);``
- **audit-BEFORE.md** line 1881
  `#### `rgba(0, 0, 0, 0.04)` (5 occurrences)`
- **audit-BEFORE.md** line 1884
  ``- [ ] `src/styles/pages/asset-detail.css`: `rgba(0, 0, 0, 0.06)`, `rgba(0, 0, 0, 0.04)```
- **audit-BEFORE.md** line 1886
  ``box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.04);``
- **audit-BEFORE.md** line 1888
  ``0 1px 3px rgba(0, 0, 0, 0.04),``
- **audit-BEFORE.md** line 1890
  ``box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06), inset 0 1px 3px rgba(0, 0, 0, 0.04);``
- **audit-BEFORE.md** line 1892
  ``box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06), inset 0 1px 3px rgba(0, 0, 0, 0.04);``
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

#### `#f9f8f6` (14 occurrences)

- **audit-BEFORE.md** line 53
  `| `#f9f8f6` | 6 | 4 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1627
  `#### `#f9f8f6` (6 occurrences)`
- **audit-BEFORE.md** line 1630
  ``"hex": "#f9f8f6",``
- **audit-BEFORE.md** line 1632
  ``"background": "#f9f8f6",``
- **audit-BEFORE.md** line 1636
  ``--brand-c-bg: #f9f8f6;``
- **audit-BEFORE.md** line 1638
  ``background: '#f9f8f6',``
- **audit-BEFORE.md** line 1640
  ``background: '#f9f8f6',``
- **audit-BEFORE.md** line 5057
  `| `--brand-c-bg` | `#f9f8f6` | `docs\Markdown Notes\Theme-Preview-System.md` | 26 |`
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

#### `#2dd4bf` (14 occurrences)

- **audit-BEFORE.md** line 62
  `| `#2dd4bf` | 6 | 1 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1762
  `#### `#2dd4bf` (6 occurrences)`
- **audit-BEFORE.md** line 1765
  ``color: var(--brand-c-primary, #2dd4bf);``
- **audit-BEFORE.md** line 1767
  ``border: 1.5px solid var(--brand-c-primary, #2dd4bf);``
- **audit-BEFORE.md** line 1769
  ``text-shadow: 0 0 4px var(--brand-c-primary, #2dd4bf);``
- **audit-BEFORE.md** line 1771
  ``border-top-color: var(--brand-c-primary, #2dd4bf);``
- **audit-BEFORE.md** line 1773
  ``border-bottom-color: var(--brand-c-primary, #2dd4bf);``
- **audit-BEFORE.md** line 1775
  ``border-color: var(--color-Success-500, var(--brand-c-primary, #2dd4bf)) !important;``
- **src\styles\base\utilities.css** line 403
  `color: var(--brand-c-primary, #2dd4bf);`
- **src\styles\base\utilities.css** line 404
  `border: 1.5px solid var(--brand-c-primary, #2dd4bf);`
- **src\styles\base\utilities.css** line 405
  `text-shadow: 0 0 4px var(--brand-c-primary, #2dd4bf);`
- **src\styles\base\utilities.css** line 411
  `border-top-color: var(--brand-c-primary, #2dd4bf);`
- **src\styles\base\utilities.css** line 416
  `border-bottom-color: var(--brand-c-primary, #2dd4bf);`
- **src\styles\base\utilities.css** line 577
  `border-color: var(--color-Success-500, var(--brand-c-primary, #2dd4bf)) !important;`

#### `#393531` (14 occurrences)

- **audit-BEFORE.md** line 93
  `| `#393531` | 4 | 3 | Replace with `var(--brand-c-neutral-dark)` |`
- **audit-BEFORE.md** line 2137
  `#### `#393531` (4 occurrences)`
- **audit-BEFORE.md** line 2140
  ``--brand-c-neutral-dark: #393531;``
- **audit-BEFORE.md** line 2142
  ``background: var(--brand-c-neutral-dark, #393531);``
- **audit-BEFORE.md** line 2144
  ``background: var(--brand-c-neutral-dark, #393531);``
- **audit-BEFORE.md** line 2146
  ``--brand-c-neutral-dark: #393531;``
- **audit-BEFORE.md** line 4092
  `| `--brand-c-neutral-dark` | `#393531` | `files\example-BrandDefault-NEW.css` | 27 |`
- **audit-BEFORE.md** line 5069
  `| `--brand-c-neutral-dark` | `#393531` | `files\example-BrandDefault-NEW.css` | 27 |`
- **audit-BEFORE.md** line 5720
  `| `--brand-c-neutral-dark` | `#393531` | `src\styles\themes\brand\BrandDefault.css` | 64 |`
- **audit-BEFORE.md** line 6441
  `| `#393531` | `--brand-c-neutral-dark`, `--brand-c-neutral-dark` |`
- **files\example-BrandDefault-NEW.css** line 27
  `--brand-c-neutral-dark: #393531;`
- **src\styles\components\toast.css** line 35
  `background: var(--brand-c-neutral-dark, #393531);`
- **src\styles\components\toast.css** line 112
  `background: var(--brand-c-neutral-dark, #393531);`
- **src\styles\themes\brand\BrandDefault.css** line 27
  `--brand-c-neutral-dark: #393531;`

#### `#1c1b29` (14 occurrences)

- **audit-BEFORE.md** line 184
  `| `#1c1b29` | 2 | 2 | Replace with `var(--a11y-deuter-c-text)` |`
- **audit-BEFORE.md** line 2868
  `#### `#1c1b29` (2 occurrences)`
- **audit-BEFORE.md** line 2871
  ``--a11y-deuter-c-text: #1c1b29;``
- **audit-BEFORE.md** line 2873
  ``--a11y-deuteranopia-c-text: #1c1b29;``
- **audit-BEFORE.md** line 4954
  `| `--a11y-deuter-c-text` | `#1c1b29` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 15 |`
- **audit-BEFORE.md** line 4958
  `| `--a11y-deuteranopia-c-text` | `#1c1b29` | `src\styles\themes\Preview\coretokens.css` | 26 |`
- **audit-BEFORE.md** line 6435
  `| `#1c1b29` | `--a11y-deuter-c-text`, `--a11y-deuteranopia-c-text` |`
- **src\styles\themes\a11y\a11y-deuteranopia.css** line 3
  `--brand-c-text: #1c1b29;`
- **src\styles\themes\a11y\a11y-deuteranopia.css** line 14
  `--brand-c-neutral: #1c1b29;`
- **src\styles\themes\a11y\a11y-deuteranopia.css** line 15
  `--brand-c-neutral-dark: #1c1b29;`
- **src\styles\themes\a11y\a11y-deuteranopia.css** line 18
  `--brand-c-bg-dark: #1c1b29;`
- **src\styles\themes\a11y\a11y-deuteranopia.css** line 20
  `--brand-c-text-light: #1c1b29;`
- **src\styles\themes\a11y\a11y-deuteranopia.css** line 21
  `--brand-c-text-dark: #1c1b29;`
- **src\styles\themes\Preview\coretokens.css** line 26
  `--a11y-deuteranopia-c-text: #1c1b29;`

#### `#0f172a` (14 occurrences)

- **audit-BEFORE.md** line 189
  `| `#0f172a` | 2 | 2 | Replace with `var(--a11y-proto-c-text)` |`
- **audit-BEFORE.md** line 2903
  `#### `#0f172a` (2 occurrences)`
- **audit-BEFORE.md** line 2906
  ``--a11y-proto-c-text: #0f172a;``
- **audit-BEFORE.md** line 2908
  ``--a11y-protanopia-c-text: #0f172a;``
- **audit-BEFORE.md** line 4979
  `| `--a11y-protanopia-c-text` | `#0f172a` | `src\styles\themes\Preview\coretokens.css` | 44 |`
- **audit-BEFORE.md** line 4983
  `| `--a11y-proto-c-text` | `#0f172a` | `src\styles\themes\a11y\a11y-protanopia.css` | 15 |`
- **audit-BEFORE.md** line 6433
  `| `#0f172a` | `--a11y-protanopia-c-text`, `--a11y-proto-c-text` |`
- **src\styles\themes\a11y\a11y-protanopia.css** line 3
  `--brand-c-text: #0f172a;`
- **src\styles\themes\a11y\a11y-protanopia.css** line 14
  `--brand-c-neutral: #0f172a;`
- **src\styles\themes\a11y\a11y-protanopia.css** line 15
  `--brand-c-neutral-dark: #0f172a;`
- **src\styles\themes\a11y\a11y-protanopia.css** line 18
  `--brand-c-bg-dark: #0f172a;`
- **src\styles\themes\a11y\a11y-protanopia.css** line 20
  `--brand-c-text-light: #0f172a;`
- **src\styles\themes\a11y\a11y-protanopia.css** line 21
  `--brand-c-text-dark: #0f172a;`
- **src\styles\themes\Preview\coretokens.css** line 44
  `--a11y-protanopia-c-text: #0f172a;`

#### `#1e293b` (14 occurrences)

- **audit-BEFORE.md** line 192
  `| `#1e293b` | 2 | 2 | Replace with `var(--a11y-trit-c-text)` |`
- **audit-BEFORE.md** line 2924
  `#### `#1e293b` (2 occurrences)`
- **audit-BEFORE.md** line 2927
  ``--a11y-trit-c-text: #1e293b;``
- **audit-BEFORE.md** line 2929
  ``--a11y-tritanopia-c-text: #1e293b;``
- **audit-BEFORE.md** line 4987
  `| `--a11y-trit-c-text` | `#1e293b` | `src\styles\themes\a11y\a11y-tritanopia.css` | 15 |`
- **audit-BEFORE.md** line 4991
  `| `--a11y-tritanopia-c-text` | `#1e293b` | `src\styles\themes\Preview\coretokens.css` | 50 |`
- **audit-BEFORE.md** line 6436
  `| `#1e293b` | `--a11y-trit-c-text`, `--a11y-tritanopia-c-text` |`
- **src\styles\themes\a11y\a11y-tritanopia.css** line 3
  `--brand-c-text: #1e293b;`
- **src\styles\themes\a11y\a11y-tritanopia.css** line 14
  `--brand-c-neutral: #1e293b;`
- **src\styles\themes\a11y\a11y-tritanopia.css** line 15
  `--brand-c-neutral-dark: #1e293b;`
- **src\styles\themes\a11y\a11y-tritanopia.css** line 18
  `--brand-c-bg-dark: #1e293b;`
- **src\styles\themes\a11y\a11y-tritanopia.css** line 20
  `--brand-c-text-light: #1e293b;`
- **src\styles\themes\a11y\a11y-tritanopia.css** line 21
  `--brand-c-text-dark: #1e293b;`
- **src\styles\themes\Preview\coretokens.css** line 50
  `--a11y-tritanopia-c-text: #1e293b;`

#### `rgba(0,0,0,0.15)` (14 occurrences)

- **audit-BEFORE.md** line 55
  `| `rgba(0,0,0,0.15)` | 6 | 3 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1657
  `#### `rgba(0,0,0,0.15)` (6 occurrences)`
- **audit-BEFORE.md** line 1660
  ``"buttonShadow": "0 4px 8px rgba(0,0,0,0.15)",``
- **audit-BEFORE.md** line 1662
  ``box-shadow: 0 2px 4px rgba(0,0,0,0.15);``
- **audit-BEFORE.md** line 1664
  ``box-shadow: 0 4px 12px rgba(0,0,0,0.15);``
- **audit-BEFORE.md** line 1666
  ``box-shadow: 0 2px 8px rgba(0,0,0,0.15);``
- **audit-BEFORE.md** line 1668
  ``box-shadow: 0 4px 12px rgba(0,0,0,0.15);``
- **audit-BEFORE.md** line 1670
  ``box-shadow: 0 4px 12px rgba(0,0,0,0.15);``
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

#### `#8390b5` (13 occurrences)

- **audit-BEFORE.md** line 79
  `| `#8390b5` | 4 | 3 | Replace with `var(--brand-c-neutral)` |`
- **audit-BEFORE.md** line 1983
  `#### `#8390b5` (4 occurrences)`
- **audit-BEFORE.md** line 1986
  ``"hex": "#8390b5",``
- **audit-BEFORE.md** line 1988
  ``"accent3": "#8390b5"``
- **audit-BEFORE.md** line 1990
  ``--brand-accent2: #8390b5; /* base: 500 */``
- **audit-BEFORE.md** line 1992
  ``--brand-c-neutral: #8390b5;``
- **audit-BEFORE.md** line 4061
  `| `--brand-accent2` | `#8390b5` | `src\scripts\ThemeTokenGen\brand-template.css` | 68 |`
- **audit-BEFORE.md** line 5030
  `| `--brand-accent2` | `#8390b5` | `src\scripts\ThemeTokenGen\brand-template.css` | 68 |`
- **audit-BEFORE.md** line 5476
  `| `--brand-c-neutral` | `#8390b5` | `src\styles\themes\brand\BrandDefault.css` | 82 |`
- **audit-BEFORE.md** line 6452
  `| `#8390b5` | `--brand-accent2`, `--brand-c-neutral` |`
- **docs\Brand\BRAND-PROFILE.json** line 68
  `"hex": "#8390b5",`
- **docs\Brand\BRAND-PROFILE.json** line 117
  `"accent3": "#8390b5"`
- **src\scripts\ThemeTokenGen\brand-template.css** line 68
  `--brand-accent2: #8390b5; /* base: 500 */`

#### `#978692` (13 occurrences)

- **audit-BEFORE.md** line 80
  `| `#978692` | 4 | 4 | Replace with `var(--brand-c-neutral)` |`
- **audit-BEFORE.md** line 1994
  `#### `#978692` (4 occurrences)`
- **audit-BEFORE.md** line 1997
  ``"hex": "#978692",``
- **audit-BEFORE.md** line 1999
  ``styles.getPropertyValue('--particle-confetti-6').trim() || '#978692',``
- **audit-BEFORE.md** line 2001
  ``--brand-accent3: #978692; /* base: 500 */``
- **audit-BEFORE.md** line 2003
  ``--brand-c-neutral: #978692;``
- **audit-BEFORE.md** line 4065
  `| `--brand-accent3` | `#978692` | `src\scripts\ThemeTokenGen\brand-template.css` | 72 |`
- **audit-BEFORE.md** line 5034
  `| `--brand-accent3` | `#978692` | `src\scripts\ThemeTokenGen\brand-template.css` | 72 |`
- **audit-BEFORE.md** line 5405
  `| `--brand-c-neutral` | `#978692` | `src\styles\themes\brand\BrandDefault.css` | 92 |`
- **audit-BEFORE.md** line 6456
  `| `#978692` | `--brand-accent3`, `--brand-c-neutral` |`
- **docs\Brand\BRAND-PROFILE.json** line 75
  `"hex": "#978692",`
- **src\lib\animation\particle-burst.ts** line 54
  `styles.getPropertyValue('--particle-confetti-6').trim() || '#978692',`
- **src\scripts\ThemeTokenGen\brand-template.css** line 72
  `--brand-accent3: #978692; /* base: 500 */`

#### `#272596` (13 occurrences)

- **audit-BEFORE.md** line 109
  `| `#272596` | 3 | 3 | Replace with `var(--a11y-dark-c-accent)` |`
- **audit-BEFORE.md** line 2307
  `#### `#272596` (3 occurrences)`
- **audit-BEFORE.md** line 2310
  ``--a11y-dark-c-accent: #272596;``
- **audit-BEFORE.md** line 2312
  ``--a11y-dark-c-accent: #272596;``
- **audit-BEFORE.md** line 2314
  ``--a11y-dark-c-accent: #272596;``
- **audit-BEFORE.md** line 4936
  `| `--a11y-dark-c-accent` | `#272596` | `docs\Markdown Notes\Theme-Preview-System.md` | 35 |`
- **audit-BEFORE.md** line 4937
  `| `--a11y-dark-c-accent` | `#272596` | `src\styles\themes\a11y\a11y-dark.css` | 20 |`
- **audit-BEFORE.md** line 4938
  `| `--a11y-dark-c-accent` | `#272596` | `src\styles\themes\Preview\coretokens.css` | 22 |`
- **docs\Markdown Notes\Theme-Preview-System.md** line 35
  `--a11y-dark-c-accent: #272596;`
- **src\styles\themes\a11y\a11y-dark.css** line 5
  `--brand-c-secondary: #272596;`
- **src\styles\themes\a11y\a11y-dark.css** line 10
  `--brand-c-secondary-light: #272596;`
- **src\styles\themes\a11y\a11y-dark.css** line 11
  `--brand-c-secondary-dark: #272596;`
- **src\styles\themes\Preview\coretokens.css** line 22
  `--a11y-dark-c-accent: #272596;`

#### `#262626` (13 occurrences)

- **audit-BEFORE.md** line 113
  `| `#262626` | 3 | 3 | Replace with `var(--brand-c-text-dark)` |`
- **audit-BEFORE.md** line 2343
  `#### `#262626` (3 occurrences)`
- **audit-BEFORE.md** line 2346
  ``--brand-c-text-dark: #262626;``
- **audit-BEFORE.md** line 2348
  ``--brand-c-text: #262626;``
- **audit-BEFORE.md** line 2350
  ``--brand-c-text-dark: #262626;``
- **audit-BEFORE.md** line 4106
  `| `--brand-c-text-dark` | `#262626` | `files\example-BrandDefault-NEW.css` | 39 |`
- **audit-BEFORE.md** line 5093
  `| `--brand-c-text-dark` | `#262626` | `files\example-BrandDefault-NEW.css` | 39 |`
- **audit-BEFORE.md** line 6002
  `| `--brand-c-text` | `#262626` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 15 |`
- **audit-BEFORE.md** line 6033
  `| `--brand-c-text-dark` | `#262626` | `src\styles\themes\brand\BrandDefault.css` | 57 |`
- **audit-BEFORE.md** line 6438
  `| `#262626` | `--brand-c-text-dark`, `--brand-c-text`, `--brand-c-text-dark` |`
- **files\example-BrandDefault-NEW.css** line 39
  `--brand-c-text-dark: #262626;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 15
  `--brand-c-text: #262626;`
- **src\styles\themes\brand\BrandDefault.css** line 39
  `--brand-c-text-dark: #262626;`

#### `#ff99c8` (13 occurrences)

- **audit-BEFORE.md** line 117
  `| `#ff99c8` | 3 | 2 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2098
  ``background: var(--confetti-pink, #FF99C8);``
- **audit-BEFORE.md** line 2379
  `#### `#ff99c8` (3 occurrences)`
- **audit-BEFORE.md** line 2382
  ``styles.getPropertyValue('--particle-confetti-1').trim() || '#FF99C8',``
- **audit-BEFORE.md** line 2384
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2386
  ``background: var(--confetti-pink, #FF99C8);``
- **audit-BEFORE.md** line 2393
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2402
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2411
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2691
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **src\lib\animation\particle-burst.ts** line 44
  `styles.getPropertyValue('--particle-confetti-1').trim() || '#FF99C8',`
- **src\lib\animation\particle-burst.ts** line 189
  `opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];`
- **src\styles\buttons\confetti-button.css** line 48
  `background: var(--confetti-pink, #FF99C8);`

#### `#e9bc88` (13 occurrences)

- **audit-BEFORE.md** line 120
  `| `#e9bc88` | 3 | 2 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2384
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2393
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2402
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2406
  `#### `#e9bc88` (3 occurrences)`
- **audit-BEFORE.md** line 2409
  ``styles.getPropertyValue('--particle-confetti-5').trim() || '#e9bc88',``
- **audit-BEFORE.md** line 2411
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2413
  ``background: var(--confetti-gold, #e9bc88);``
- **audit-BEFORE.md** line 2456
  ``background: var(--confetti-gold, #e9bc88);``
- **audit-BEFORE.md** line 2691
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **src\lib\animation\particle-burst.ts** line 52
  `styles.getPropertyValue('--particle-confetti-5').trim() || '#e9bc88',`
- **src\lib\animation\particle-burst.ts** line 189
  `opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];`
- **src\styles\buttons\confetti-button.css** line 21
  `background: var(--confetti-gold, #e9bc88);`

#### `#f4fbf2` (12 occurrences)

- **audit-BEFORE.md** line 67
  `| `#f4fbf2` | 5 | 4 | Replace with `var(--brand-c-primary-light)` |`
- **audit-BEFORE.md** line 1829
  `#### `#f4fbf2` (5 occurrences)`
- **audit-BEFORE.md** line 1832
  ``4. **Duplicate Primary-50 = Primary-100** - Both `#f4fbf2```
- **audit-BEFORE.md** line 1834
  ``- Was identical to Primary-100 (#f4fbf2)``
- **audit-BEFORE.md** line 1836
  ``- [ ] `--brand-c-primary-light` and `--brand-c-primary-light` both `#f4fbf2```
- **audit-BEFORE.md** line 1838
  ``- [ ] **Primary-50 = Primary-100** both `#f4fbf2` (DUPLICATE - remove Primary-50)``
- **audit-BEFORE.md** line 1840
  ``--brand-c-primary-light: #f4fbf2;``
- **audit-BEFORE.md** line 5738
  `| `--brand-c-primary-light` | `#f4fbf2` | `src\styles\themes\brand\BrandDefault.css` | 13 |`
- **docs\reports\color-token-usage-report.md** line 656
  `4. **Duplicate Primary-50 = Primary-100** - Both `#f4fbf2``
- **docs\reports\FIXES-APPLIED.md** line 28
  `- Was identical to Primary-100 (#f4fbf2)`
- **docs\todo\TODO.md** line 225
  `- [ ] `--brand-c-primary-light` and `--brand-c-primary-light` both `#f4fbf2``
- **docs\todo\TODO.md** line 277
  `- [ ] **Primary-50 = Primary-100** both `#f4fbf2` (DUPLICATE - remove Primary-50)`

#### `#666` (12 occurrences)

- **audit-BEFORE.md** line 68
  `| `#666` | 5 | 4 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1842
  `#### `#666` (5 occurrences)`
- **audit-BEFORE.md** line 1845
  ``- [ ] Replace `color: #666` (link URLs) with token``
- **audit-BEFORE.md** line 1847
  ``color: #666;``
- **audit-BEFORE.md** line 1849
  ``color: #666;``
- **audit-BEFORE.md** line 1851
  ``color: #666;``
- **audit-BEFORE.md** line 1853
  ``color: #666 !important;``
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

#### `#ddd` (12 occurrences)

- **audit-BEFORE.md** line 69
  `| `#ddd` | 5 | 4 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1855
  `#### `#ddd` (5 occurrences)`
- **audit-BEFORE.md** line 1858
  ``- [ ] Replace `border: 1px solid #ddd` with token``
- **audit-BEFORE.md** line 1860
  ``border: 3px solid #ddd;``
- **audit-BEFORE.md** line 1862
  ``border: 1px solid #ddd;``
- **audit-BEFORE.md** line 1864
  ``border: 1px solid #ddd !important;``
- **audit-BEFORE.md** line 1866
  ``border: 1px solid #ddd !important;``
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

#### `#c5e1a5` (12 occurrences)

- **audit-BEFORE.md** line 111
  `| `#c5e1a5` | 3 | 3 | Replace with `var(--a11y-dark-c-primary)` |`
- **audit-BEFORE.md** line 2325
  `#### `#c5e1a5` (3 occurrences)`
- **audit-BEFORE.md** line 2328
  ``- Primary-50 through Primary-900 → single color (#C5E1A5 in dark mode)``
- **audit-BEFORE.md** line 2330
  ``--a11y-dark-c-primary: #C5E1A5;``
- **audit-BEFORE.md** line 2332
  ``--a11y-dark-c-primary: #C5E1A5;``
- **audit-BEFORE.md** line 4944
  `| `--a11y-dark-c-primary` | `#C5E1A5` | `src\styles\themes\a11y\a11y-dark.css` | 19 |`
- **audit-BEFORE.md** line 4945
  `| `--a11y-dark-c-primary` | `#C5E1A5` | `src\styles\themes\Preview\coretokens.css` | 21 |`
- **docs\todo\TODO.md** line 319
  `- Primary-50 through Primary-900 → single color (#C5E1A5 in dark mode)`
- **src\styles\themes\a11y\a11y-dark.css** line 4
  `--brand-c-primary: #C5E1A5;`
- **src\styles\themes\a11y\a11y-dark.css** line 7
  `--brand-c-primary-light: #C5E1A5;`
- **src\styles\themes\a11y\a11y-dark.css** line 8
  `--brand-c-primary-dark: #C5E1A5;`
- **src\styles\themes\Preview\coretokens.css** line 21
  `--a11y-dark-c-primary: #C5E1A5;`

#### `#ae88bf` (12 occurrences)

- **audit-BEFORE.md** line 118
  `| `#ae88bf` | 3 | 2 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2384
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2388
  `#### `#ae88bf` (3 occurrences)`
- **audit-BEFORE.md** line 2391
  ``styles.getPropertyValue('--particle-confetti-2').trim() || '#AE88BF',``
- **audit-BEFORE.md** line 2393
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2395
  ``12px 4px 0 0 var(--confetti-purple, #AE88BF),``
- **audit-BEFORE.md** line 2402
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2411
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2691
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **src\lib\animation\particle-burst.ts** line 46
  `styles.getPropertyValue('--particle-confetti-2').trim() || '#AE88BF',`
- **src\lib\animation\particle-burst.ts** line 189
  `opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];`
- **src\styles\buttons\confetti-button.css** line 54
  `12px 4px 0 0 var(--confetti-purple, #AE88BF),`

#### `#80e1cc` (12 occurrences)

- **audit-BEFORE.md** line 119
  `| `#80e1cc` | 3 | 2 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2384
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2393
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2397
  `#### `#80e1cc` (3 occurrences)`
- **audit-BEFORE.md** line 2400
  ``styles.getPropertyValue('--particle-confetti-3').trim() || '#80E1CC',``
- **audit-BEFORE.md** line 2402
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2404
  ``-8px 8px 0 0 var(--confetti-teal, #80E1CC);``
- **audit-BEFORE.md** line 2411
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2691
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **src\lib\animation\particle-burst.ts** line 48
  `styles.getPropertyValue('--particle-confetti-3').trim() || '#80E1CC',`
- **src\lib\animation\particle-burst.ts** line 189
  `opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];`
- **src\styles\buttons\confetti-button.css** line 55
  `-8px 8px 0 0 var(--confetti-teal, #80E1CC);`

#### `#394e43` (12 occurrences)

- **audit-BEFORE.md** line 147
  `| `#394e43` | 2 | 2 | Replace with `var(--brand-c-bg-dark)` |`
- **audit-BEFORE.md** line 2609
  `#### `#394e43` (2 occurrences)`
- **audit-BEFORE.md** line 2612
  ``--brand-c-bg-dark: #394e43;``
- **audit-BEFORE.md** line 2614
  ``--brand-background-dark: #394e43; /* base: 800 - dark colors for dark mode */``
- **audit-BEFORE.md** line 4081
  `| `--brand-background-dark` | `#394e43` | `src\scripts\ThemeTokenGen\brand-template.css` | 48 |`
- **audit-BEFORE.md** line 4086
  `| `--brand-c-bg-dark` | `#394e43` | `files\example-BrandDefault-NEW.css` | 33 |`
- **audit-BEFORE.md** line 5050
  `| `--brand-background-dark` | `#394e43` | `src\scripts\ThemeTokenGen\brand-template.css` | 48 |`
- **audit-BEFORE.md** line 5063
  `| `--brand-c-bg-dark` | `#394e43` | `files\example-BrandDefault-NEW.css` | 33 |`
- **audit-BEFORE.md** line 6442
  `| `#394e43` | `--brand-background-dark`, `--brand-c-bg-dark` |`
- **files\example-BrandDefault-NEW.css** line 33
  `--brand-c-bg-dark: #394e43;`
- **src\scripts\ThemeTokenGen\brand-template.css** line 48
  `--brand-background-dark: #394e43; /* base: 800 - dark colors for dark mode */`
- **src\styles\themes\brand\BrandDefault.css** line 33
  `--brand-c-bg-dark: #394e43;`

#### `rgba(0, 0, 0, 0.08)` (12 occurrences)

- **audit-BEFORE.md** line 75
  `| `rgba(0, 0, 0, 0.08)` | 5 | 5 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1933
  `#### `rgba(0, 0, 0, 0.08)` (5 occurrences)`
- **audit-BEFORE.md** line 1936
  ``box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);``
- **audit-BEFORE.md** line 1938
  ``box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);``
- **audit-BEFORE.md** line 1940
  ``box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);``
- **audit-BEFORE.md** line 1942
  ``box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);``
- **audit-BEFORE.md** line 1944
  ``box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);``
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

#### `rgba(0,0,0,0.3)` (12 occurrences)

- **audit-BEFORE.md** line 77
  `| `rgba(0,0,0,0.3)` | 5 | 3 | Create new token — used frequently |`
- **audit-BEFORE.md** line 1959
  `#### `rgba(0,0,0,0.3)` (5 occurrences)`
- **audit-BEFORE.md** line 1962
  ``box-shadow: 0 4px 12px rgba(0,0,0,0.3);``
- **audit-BEFORE.md** line 1964
  ``color: rgba(0,0,0,0.3);``
- **audit-BEFORE.md** line 1966
  ``color: rgba(0,0,0,0.3);``
- **audit-BEFORE.md** line 1968
  ``text-shadow: 0 1px 2px rgba(0,0,0,0.3);``
- **audit-BEFORE.md** line 1970
  ``box-shadow: 0 20px 60px rgba(0,0,0,0.3);``
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

#### `#22c55e` (11 occurrences)

- **audit-BEFORE.md** line 96
  `| `#22c55e` | 4 | 2 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2170
  `#### `#22c55e` (4 occurrences)`
- **audit-BEFORE.md** line 2173
  ``--universal-success: #80a575; /* #22c55e - Green success/positive */``
- **audit-BEFORE.md** line 2175
  ``background: var(--color-Success-500, #22c55e);``
- **audit-BEFORE.md** line 2177
  ``border-top-color: var(--color-Success-500, #22c55e);``
- **audit-BEFORE.md** line 2179
  ``border-bottom-color: var(--color-Success-500, #22c55e);``
- **audit-BEFORE.md** line 3073
  ``--universal-success: #80a575; /* #22c55e - Green success/positive */``
- **src\scripts\ThemeTokenGen\brand-template.css** line 87
  `--universal-success: #80a575; /* #22c55e - Green success/positive */`
- **src\styles\base\utilities.css** line 454
  `background: var(--color-Success-500, #22c55e);`
- **src\styles\base\utilities.css** line 459
  `border-top-color: var(--color-Success-500, #22c55e);`
- **src\styles\base\utilities.css** line 464
  `border-bottom-color: var(--color-Success-500, #22c55e);`

#### `#ef4444` (11 occurrences)

- **audit-BEFORE.md** line 97
  `| `#ef4444` | 4 | 2 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2181
  `#### `#ef4444` (4 occurrences)`
- **audit-BEFORE.md** line 2184
  ``--universal-danger: #9c5151;  /* #ef4444 - Red error/danger */``
- **audit-BEFORE.md** line 2186
  ``background: var(--color-Error-500, #ef4444);``
- **audit-BEFORE.md** line 2188
  ``border-top-color: var(--color-Error-500, #ef4444);``
- **audit-BEFORE.md** line 2190
  ``border-bottom-color: var(--color-Error-500, #ef4444);``
- **audit-BEFORE.md** line 3083
  ``--universal-danger: #9c5151;  /* #ef4444 - Red error/danger */``
- **src\scripts\ThemeTokenGen\brand-template.css** line 89
  `--universal-danger: #9c5151;  /* #ef4444 - Red error/danger */`
- **src\styles\base\utilities.css** line 439
  `background: var(--color-Error-500, #ef4444);`
- **src\styles\base\utilities.css** line 444
  `border-top-color: var(--color-Error-500, #ef4444);`
- **src\styles\base\utilities.css** line 449
  `border-bottom-color: var(--color-Error-500, #ef4444);`

#### `#3b82f6` (11 occurrences)

- **audit-BEFORE.md** line 98
  `| `#3b82f6` | 4 | 2 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2192
  `#### `#3b82f6` (4 occurrences)`
- **audit-BEFORE.md** line 2195
  ``--universal-info: #47638f;    /* #3b82f6 - Blue info/neutral */``
- **audit-BEFORE.md** line 2197
  ``background: var(--color-Info-500, #3b82f6);``
- **audit-BEFORE.md** line 2199
  ``border-top-color: var(--color-Info-500, #3b82f6);``
- **audit-BEFORE.md** line 2201
  ``border-bottom-color: var(--color-Info-500, #3b82f6);``
- **audit-BEFORE.md** line 3088
  ``--universal-info: #47638f;    /* #3b82f6 - Blue info/neutral */``
- **src\scripts\ThemeTokenGen\brand-template.css** line 90
  `--universal-info: #47638f;    /* #3b82f6 - Blue info/neutral */`
- **src\styles\base\utilities.css** line 484
  `background: var(--color-Info-500, #3b82f6);`
- **src\styles\base\utilities.css** line 489
  `border-top-color: var(--color-Info-500, #3b82f6);`
- **src\styles\base\utilities.css** line 494
  `border-bottom-color: var(--color-Info-500, #3b82f6);`

#### `#555` (11 occurrences)

- **audit-BEFORE.md** line 99
  `| `#555` | 4 | 3 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2203
  `#### `#555` (4 occurrences)`
- **audit-BEFORE.md** line 2206
  ``color: #555;``
- **audit-BEFORE.md** line 2208
  ``color: #555;``
- **audit-BEFORE.md** line 2210
  ``<p style="font-size: 0.9rem; color: #555;">``
- **audit-BEFORE.md** line 2212
  ``--brand-c-neutral: #555;``
- **audit-BEFORE.md** line 4036
  ``font-size: 0.9rem; color: #555;``
- **audit-BEFORE.md** line 5678
  `| `--brand-c-neutral` | `#555` | `src\styles\themes\a11y\a11y-dark.css` | 86 |`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 234
  `color: #555;`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 74
  `color: #555;`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 125
  `<p style="font-size: 0.9rem; color: #555;">`

#### `#999` (11 occurrences)

- **audit-BEFORE.md** line 101
  `| `#999` | 4 | 4 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2225
  `#### `#999` (4 occurrences)`
- **audit-BEFORE.md** line 2228
  ``<button class="generate-btn" onclick="generateColorTheories()" style="background: #999; flex: 1;">Or Generate Variation`
- **audit-BEFORE.md** line 2230
  ``color: #999;``
- **audit-BEFORE.md** line 2232
  ``color: var(--brand-c-text-light, #999);``
- **audit-BEFORE.md** line 2234
  ``--brand-c-neutral-dark: #999;``
- **audit-BEFORE.md** line 4024
  ``background: #999; flex: 1;``
- **audit-BEFORE.md** line 5700
  `| `--brand-c-neutral-dark` | `#999` | `src\styles\themes\a11y\a11y-dark.css` | 88 |`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 794
  `<button class="generate-btn" onclick="generateColorTheories()" style="background: #999; flex: 1;">Or Generate Variations`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 105
  `color: #999;`
- **src\styles\base\utilities.css** line 623
  `color: var(--brand-c-text-light, #999);`

#### `#4caf50` (11 occurrences)

- **audit-BEFORE.md** line 108
  `| `#4caf50` | 3 | 3 | Replace with `var(--color-Success)` |`
- **audit-BEFORE.md** line 394
  ``.badge { background: #4CAF50; color: white; }``
- **audit-BEFORE.md** line 1387
  ``--color-Success    /* #4caf50 - green */``
- **audit-BEFORE.md** line 2298
  `#### `#4caf50` (3 occurrences)`
- **audit-BEFORE.md** line 2301
  ``.badge { background: #4CAF50; color: white; }``
- **audit-BEFORE.md** line 2303
  ``--color-Success    /* #4caf50 - green */``
- **audit-BEFORE.md** line 2305
  ``--color-Success: #4caf50;``
- **audit-BEFORE.md** line 5926
  `| `--color-Success` | `#4caf50` | `src\styles\tokens\status.css` | 17 |`
- **docs\Markdown Notes\CSS-Standards.md** line 460
  `.badge { background: #4CAF50; color: white; }`
- **docs\Markdown Notes\CSS-Tokens.md** line 92
  `--color-Success    /* #4caf50 - green */`
- **src\styles\tokens\status.css** line 17
  `--color-Success: #4caf50;`

#### `#f6f5fa` (11 occurrences)

- **audit-BEFORE.md** line 183
  `| `#f6f5fa` | 2 | 2 | Replace with `var(--a11y-deuter-c-bg)` |`
- **audit-BEFORE.md** line 2861
  `#### `#f6f5fa` (2 occurrences)`
- **audit-BEFORE.md** line 2864
  ``--a11y-deuter-c-bg: #f6f5fa;``
- **audit-BEFORE.md** line 2866
  ``--a11y-deuteranopia-c-bg: #f6f5fa;``
- **audit-BEFORE.md** line 4952
  `| `--a11y-deuter-c-bg` | `#f6f5fa` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 14 |`
- **audit-BEFORE.md** line 4956
  `| `--a11y-deuteranopia-c-bg` | `#f6f5fa` | `src\styles\themes\Preview\coretokens.css` | 25 |`
- **audit-BEFORE.md** line 6468
  `| `#f6f5fa` | `--a11y-deuter-c-bg`, `--a11y-deuteranopia-c-bg` |`
- **src\styles\themes\a11y\a11y-deuteranopia.css** line 2
  `--brand-c-bg: #f6f5fa;`
- **src\styles\themes\a11y\a11y-deuteranopia.css** line 13
  `--brand-c-neutral-light: #f6f5fa;`
- **src\styles\themes\a11y\a11y-deuteranopia.css** line 17
  `--brand-c-bg-light: #f6f5fa;`
- **src\styles\themes\Preview\coretokens.css** line 25
  `--a11y-deuteranopia-c-bg: #f6f5fa;`

#### `#6d28d9` (11 occurrences)

- **audit-BEFORE.md** line 185
  `| `#6d28d9` | 2 | 2 | Replace with `var(--a11y-deuter-c-primary)` |`
- **audit-BEFORE.md** line 2875
  `#### `#6d28d9` (2 occurrences)`
- **audit-BEFORE.md** line 2878
  ``--a11y-deuter-c-primary: #6d28d9;``
- **audit-BEFORE.md** line 2880
  ``--a11y-deuteranopia-c-primary: #6d28d9;``
- **audit-BEFORE.md** line 4953
  `| `--a11y-deuter-c-primary` | `#6d28d9` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 16 |`
- **audit-BEFORE.md** line 4957
  `| `--a11y-deuteranopia-c-primary` | `#6d28d9` | `src\styles\themes\Preview\coretokens.css` | 27 |`
- **audit-BEFORE.md** line 6450
  `| `#6d28d9` | `--a11y-deuter-c-primary`, `--a11y-deuteranopia-c-primary` |`
- **src\styles\themes\a11y\a11y-deuteranopia.css** line 4
  `--brand-c-primary: #6d28d9;`
- **src\styles\themes\a11y\a11y-deuteranopia.css** line 7
  `--brand-c-primary-light: #6d28d9;`
- **src\styles\themes\a11y\a11y-deuteranopia.css** line 8
  `--brand-c-primary-dark: #6d28d9;`
- **src\styles\themes\Preview\coretokens.css** line 27
  `--a11y-deuteranopia-c-primary: #6d28d9;`

#### `#f97316` (11 occurrences)

- **audit-BEFORE.md** line 186
  `| `#f97316` | 2 | 2 | Replace with `var(--a11y-deuter-c-accent)` |`
- **audit-BEFORE.md** line 2882
  `#### `#f97316` (2 occurrences)`
- **audit-BEFORE.md** line 2885
  ``--a11y-deuter-c-accent: #f97316;``
- **audit-BEFORE.md** line 2887
  ``--a11y-deuteranopia-c-accent: #f97316;``
- **audit-BEFORE.md** line 4951
  `| `--a11y-deuter-c-accent` | `#f97316` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 17 |`
- **audit-BEFORE.md** line 4955
  `| `--a11y-deuteranopia-c-accent` | `#f97316` | `src\styles\themes\Preview\coretokens.css` | 28 |`
- **audit-BEFORE.md** line 6469
  `| `#f97316` | `--a11y-deuter-c-accent`, `--a11y-deuteranopia-c-accent` |`
- **src\styles\themes\a11y\a11y-deuteranopia.css** line 5
  `--brand-c-secondary: #f97316;`
- **src\styles\themes\a11y\a11y-deuteranopia.css** line 10
  `--brand-c-secondary-light: #f97316;`
- **src\styles\themes\a11y\a11y-deuteranopia.css** line 11
  `--brand-c-secondary-dark: #f97316;`
- **src\styles\themes\Preview\coretokens.css** line 28
  `--a11y-deuteranopia-c-accent: #f97316;`

#### `#e6e4e2` (11 occurrences)

- **audit-BEFORE.md** line 187
  `| `#e6e4e2` | 2 | 2 | Replace with `var(--a11y-mono-c-bg)` |`
- **audit-BEFORE.md** line 2889
  `#### `#e6e4e2` (2 occurrences)`
- **audit-BEFORE.md** line 2892
  ``--a11y-mono-c-bg: #e6e4e2;``
- **audit-BEFORE.md** line 2894
  ``--a11y-monochrome-c-bg: #e6e4e2;``
- **audit-BEFORE.md** line 4969
  `| `--a11y-mono-c-bg` | `#e6e4e2` | `src\styles\themes\a11y\a11y-monochrome.css` | 14 |`
- **audit-BEFORE.md** line 4973
  `| `--a11y-monochrome-c-bg` | `#e6e4e2` | `src\styles\themes\Preview\coretokens.css` | 37 |`
- **audit-BEFORE.md** line 6465
  `| `#e6e4e2` | `--a11y-mono-c-bg`, `--a11y-monochrome-c-bg` |`
- **src\styles\themes\a11y\a11y-monochrome.css** line 2
  `--brand-c-bg: #e6e4e2;`
- **src\styles\themes\a11y\a11y-monochrome.css** line 13
  `--brand-c-neutral-light: #e6e4e2;`
- **src\styles\themes\a11y\a11y-monochrome.css** line 17
  `--brand-c-bg-light: #e6e4e2;`
- **src\styles\themes\Preview\coretokens.css** line 37
  `--a11y-monochrome-c-bg: #e6e4e2;`

#### `#f5f7fb` (11 occurrences)

- **audit-BEFORE.md** line 188
  `| `#f5f7fb` | 2 | 2 | Replace with `var(--a11y-proto-c-bg)` |`
- **audit-BEFORE.md** line 2896
  `#### `#f5f7fb` (2 occurrences)`
- **audit-BEFORE.md** line 2899
  ``--a11y-proto-c-bg: #f5f7fb;``
- **audit-BEFORE.md** line 2901
  ``--a11y-protanopia-c-bg: #f5f7fb;``
- **audit-BEFORE.md** line 4977
  `| `--a11y-protanopia-c-bg` | `#f5f7fb` | `src\styles\themes\Preview\coretokens.css` | 43 |`
- **audit-BEFORE.md** line 4981
  `| `--a11y-proto-c-bg` | `#f5f7fb` | `src\styles\themes\a11y\a11y-protanopia.css` | 14 |`
- **audit-BEFORE.md** line 6467
  `| `#f5f7fb` | `--a11y-protanopia-c-bg`, `--a11y-proto-c-bg` |`
- **src\styles\themes\a11y\a11y-protanopia.css** line 2
  `--brand-c-bg: #f5f7fb;`
- **src\styles\themes\a11y\a11y-protanopia.css** line 13
  `--brand-c-neutral-light: #f5f7fb;`
- **src\styles\themes\a11y\a11y-protanopia.css** line 17
  `--brand-c-bg-light: #f5f7fb;`
- **src\styles\themes\Preview\coretokens.css** line 43
  `--a11y-protanopia-c-bg: #f5f7fb;`

#### `#1e40af` (11 occurrences)

- **audit-BEFORE.md** line 190
  `| `#1e40af` | 2 | 2 | Replace with `var(--a11y-proto-c-primary)` |`
- **audit-BEFORE.md** line 2910
  `#### `#1e40af` (2 occurrences)`
- **audit-BEFORE.md** line 2913
  ``--a11y-proto-c-primary: #1e40af;``
- **audit-BEFORE.md** line 2915
  ``--a11y-protanopia-c-primary: #1e40af;``
- **audit-BEFORE.md** line 4978
  `| `--a11y-protanopia-c-primary` | `#1e40af` | `src\styles\themes\Preview\coretokens.css` | 45 |`
- **audit-BEFORE.md** line 4982
  `| `--a11y-proto-c-primary` | `#1e40af` | `src\styles\themes\a11y\a11y-protanopia.css` | 16 |`
- **audit-BEFORE.md** line 6437
  `| `#1e40af` | `--a11y-protanopia-c-primary`, `--a11y-proto-c-primary` |`
- **src\styles\themes\a11y\a11y-protanopia.css** line 4
  `--brand-c-primary: #1e40af;`
- **src\styles\themes\a11y\a11y-protanopia.css** line 7
  `--brand-c-primary-light: #1e40af;`
- **src\styles\themes\a11y\a11y-protanopia.css** line 8
  `--brand-c-primary-dark: #1e40af;`
- **src\styles\themes\Preview\coretokens.css** line 45
  `--a11y-protanopia-c-primary: #1e40af;`

#### `#fdf4ff` (11 occurrences)

- **audit-BEFORE.md** line 191
  `| `#fdf4ff` | 2 | 2 | Replace with `var(--a11y-trit-c-bg)` |`
- **audit-BEFORE.md** line 2917
  `#### `#fdf4ff` (2 occurrences)`
- **audit-BEFORE.md** line 2920
  ``--a11y-trit-c-bg: #fdf4ff;``
- **audit-BEFORE.md** line 2922
  ``--a11y-tritanopia-c-bg: #fdf4ff;``
- **audit-BEFORE.md** line 4985
  `| `--a11y-trit-c-bg` | `#fdf4ff` | `src\styles\themes\a11y\a11y-tritanopia.css` | 14 |`
- **audit-BEFORE.md** line 4989
  `| `--a11y-tritanopia-c-bg` | `#fdf4ff` | `src\styles\themes\Preview\coretokens.css` | 49 |`
- **audit-BEFORE.md** line 6471
  `| `#fdf4ff` | `--a11y-trit-c-bg`, `--a11y-tritanopia-c-bg` |`
- **src\styles\themes\a11y\a11y-tritanopia.css** line 2
  `--brand-c-bg: #fdf4ff;`
- **src\styles\themes\a11y\a11y-tritanopia.css** line 13
  `--brand-c-neutral-light: #fdf4ff;`
- **src\styles\themes\a11y\a11y-tritanopia.css** line 17
  `--brand-c-bg-light: #fdf4ff;`
- **src\styles\themes\Preview\coretokens.css** line 49
  `--a11y-tritanopia-c-bg: #fdf4ff;`

#### `#cc3399` (11 occurrences)

- **audit-BEFORE.md** line 193
  `| `#cc3399` | 2 | 2 | Replace with `var(--a11y-trit-c-primary)` |`
- **audit-BEFORE.md** line 2931
  `#### `#cc3399` (2 occurrences)`
- **audit-BEFORE.md** line 2934
  ``--a11y-trit-c-primary: #cc3399;``
- **audit-BEFORE.md** line 2936
  ``--a11y-tritanopia-c-primary: #cc3399;``
- **audit-BEFORE.md** line 4986
  `| `--a11y-trit-c-primary` | `#cc3399` | `src\styles\themes\a11y\a11y-tritanopia.css` | 16 |`
- **audit-BEFORE.md** line 4990
  `| `--a11y-tritanopia-c-primary` | `#cc3399` | `src\styles\themes\Preview\coretokens.css` | 51 |`
- **audit-BEFORE.md** line 6461
  `| `#cc3399` | `--a11y-trit-c-primary`, `--a11y-tritanopia-c-primary` |`
- **src\styles\themes\a11y\a11y-tritanopia.css** line 4
  `--brand-c-primary: #cc3399;`
- **src\styles\themes\a11y\a11y-tritanopia.css** line 7
  `--brand-c-primary-light: #cc3399;`
- **src\styles\themes\a11y\a11y-tritanopia.css** line 8
  `--brand-c-primary-dark: #cc3399;`
- **src\styles\themes\Preview\coretokens.css** line 51
  `--a11y-tritanopia-c-primary: #cc3399;`

#### `#06b6d4` (11 occurrences)

- **audit-BEFORE.md** line 194
  `| `#06b6d4` | 2 | 2 | Replace with `var(--a11y-trit-c-accent)` |`
- **audit-BEFORE.md** line 2938
  `#### `#06b6d4` (2 occurrences)`
- **audit-BEFORE.md** line 2941
  ``--a11y-trit-c-accent: #06b6d4;``
- **audit-BEFORE.md** line 2943
  ``--a11y-tritanopia-c-accent: #06b6d4;``
- **audit-BEFORE.md** line 4984
  `| `--a11y-trit-c-accent` | `#06b6d4` | `src\styles\themes\a11y\a11y-tritanopia.css` | 17 |`
- **audit-BEFORE.md** line 4988
  `| `--a11y-tritanopia-c-accent` | `#06b6d4` | `src\styles\themes\Preview\coretokens.css` | 52 |`
- **audit-BEFORE.md** line 6431
  `| `#06b6d4` | `--a11y-trit-c-accent`, `--a11y-tritanopia-c-accent` |`
- **src\styles\themes\a11y\a11y-tritanopia.css** line 5
  `--brand-c-secondary: #06b6d4;`
- **src\styles\themes\a11y\a11y-tritanopia.css** line 10
  `--brand-c-secondary-light: #06b6d4;`
- **src\styles\themes\a11y\a11y-tritanopia.css** line 11
  `--brand-c-secondary-dark: #06b6d4;`
- **src\styles\themes\Preview\coretokens.css** line 52
  `--a11y-tritanopia-c-accent: #06b6d4;`

#### `#0066ff` (10 occurrences)

- **audit-BEFORE.md** line 83
  `| `#0066ff` | 4 | 1 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2027
  `#### `#0066ff` (4 occurrences)`
- **audit-BEFORE.md** line 2030
  ``"example": "#0066FF"``
- **audit-BEFORE.md** line 2032
  ``"link": { "type": "string", "example": "#0066FF" },``
- **audit-BEFORE.md** line 2034
  ``"accent1": { "type": "string", "description": "Primary CTA color", "example": "#0066FF" },``
- **audit-BEFORE.md** line 2036
  ``"focusOutline": { "type": "string", "example": "2px solid #0066FF" }``
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 121
  `"example": "#0066FF"`
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 173
  `"link": { "type": "string", "example": "#0066FF" },`
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 176
  `"accent1": { "type": "string", "description": "Primary CTA color", "example": "#0066FF" },`
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 200
  `"focusOutline": { "type": "string", "example": "2px solid #0066FF" }`

#### `#111827` (10 occurrences)

- **audit-BEFORE.md** line 84
  `| `#111827` | 4 | 1 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2038
  `#### `#111827` (4 occurrences)`
- **audit-BEFORE.md** line 2041
  ``"textPrimary": { "type": "string", "example": "#111827" },``
- **audit-BEFORE.md** line 2043
  ``"h1Color": { "type": "string", "example": "#111827" },``
- **audit-BEFORE.md** line 2045
  ``"h2Color": { "type": "string", "example": "#111827" },``
- **audit-BEFORE.md** line 2047
  ``"h3Color": { "type": "string", "example": "#111827" },``
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 171
  `"textPrimary": { "type": "string", "example": "#111827" },`
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 214
  `"h1Color": { "type": "string", "example": "#111827" },`
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 217
  `"h2Color": { "type": "string", "example": "#111827" },`
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 220
  `"h3Color": { "type": "string", "example": "#111827" },`

#### `#333` (10 occurrences)

- **audit-BEFORE.md** line 100
  `| `#333` | 4 | 2 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2214
  `#### `#333` (4 occurrences)`
- **audit-BEFORE.md** line 2217
  ``color: #333;``
- **audit-BEFORE.md** line 2219
  ``color: #333;``
- **audit-BEFORE.md** line 2221
  ``color: #333;``
- **audit-BEFORE.md** line 2223
  ``color: #333;``
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 248
  `color: #333;`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 296
  `color: #333;`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 336
  `color: #333;`
- **src\scripts\ThemeTokenGen\preview-colors.js** line 61
  `color: #333;`

#### `#5d4f3a` (10 occurrences)

- **audit-BEFORE.md** line 103
  `| `#5d4f3a` | 4 | 1 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2247
  `#### `#5d4f3a` (4 occurrences)`
- **audit-BEFORE.md** line 2250
  ``color: #5d4f3a !important;``
- **audit-BEFORE.md** line 2252
  ``color: #5d4f3a !important;``
- **audit-BEFORE.md** line 2254
  ``color: #5d4f3a !important;``
- **audit-BEFORE.md** line 2256
  ``color: #5d4f3a !important;``
- **src\styles\a11y\pages\asset-detail.css** line 51
  `color: #5d4f3a !important;`
- **src\styles\a11y\pages\asset-detail.css** line 174
  `color: #5d4f3a !important;`
- **src\styles\a11y\pages\asset-detail.css** line 190
  `color: #5d4f3a !important;`
- **src\styles\a11y\pages\asset-detail.css** line 431
  `color: #5d4f3a !important;`

#### `#4a4a4a` (10 occurrences)

- **audit-BEFORE.md** line 104
  `| `#4a4a4a` | 4 | 1 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2258
  `#### `#4a4a4a` (4 occurrences)`
- **audit-BEFORE.md** line 2261
  ``color: #4a4a4a !important;``
- **audit-BEFORE.md** line 2263
  ``color: #4a4a4a !important;``
- **audit-BEFORE.md** line 2265
  ``color: #4a4a4a !important;``
- **audit-BEFORE.md** line 2267
  ``color: #4a4a4a !important;``
- **src\styles\a11y\pages\asset-detail.css** line 76
  `color: #4a4a4a !important;`
- **src\styles\a11y\pages\asset-detail.css** line 215
  `color: #4a4a4a !important;`
- **src\styles\a11y\pages\asset-detail.css** line 235
  `color: #4a4a4a !important;`
- **src\styles\a11y\pages\asset-detail.css** line 453
  `color: #4a4a4a !important;`

#### `#e5e0db` (10 occurrences)

- **audit-BEFORE.md** line 105
  `| `#e5e0db` | 4 | 1 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2269
  `#### `#e5e0db` (4 occurrences)`
- **audit-BEFORE.md** line 2272
  ``border-bottom: 1px solid var(--brand-c-neutral-light, #e5e0db) !important;``
- **audit-BEFORE.md** line 2274
  ``border-bottom: 1px solid var(--brand-c-neutral-light, #e5e0db) !important;``
- **audit-BEFORE.md** line 2276
  ``border-color: var(--brand-c-neutral-light, #e5e0db) !important;``
- **audit-BEFORE.md** line 2278
  ``background: var(--brand-c-neutral-light, #e5e0db) !important;``
- **src\styles\a11y\visual\text-only.css** line 2085
  `border-bottom: 1px solid var(--brand-c-neutral-light, #e5e0db) !important;`
- **src\styles\a11y\visual\text-only.css** line 2126
  `border-bottom: 1px solid var(--brand-c-neutral-light, #e5e0db) !important;`
- **src\styles\a11y\visual\text-only.css** line 2141
  `border-color: var(--brand-c-neutral-light, #e5e0db) !important;`
- **src\styles\a11y\visual\text-only.css** line 2157
  `background: var(--brand-c-neutral-light, #e5e0db) !important;`

#### `#e8e8e8` (10 occurrences)

- **audit-BEFORE.md** line 110
  `| `#e8e8e8` | 3 | 3 | Replace with `var(--brand-c-text-light)` |`
- **audit-BEFORE.md** line 2316
  `#### `#e8e8e8` (3 occurrences)`
- **audit-BEFORE.md** line 2319
  ``- `--brand-c-text-light: #e8e8e8;` (interpolated value)``
- **audit-BEFORE.md** line 2321
  ``- ✓ **Added `--brand-c-text-light: #e8e8e8`** (line 48)``
- **audit-BEFORE.md** line 2323
  ``--brand-c-text-light: #e8e8e8;``
- **audit-BEFORE.md** line 5930
  `| `--brand-c-text-light` | `#e8e8e8` | `docs\reports\color-token-usage-report.md` | 692 |`
- **audit-BEFORE.md** line 5931
  `| `--brand-c-text-light` | `#e8e8e8`** (line 48)` | `docs\reports\FIXES-APPLIED.md` | 16 |`
- **audit-BEFORE.md** line 5932
  `| `--brand-c-text-light` | `#e8e8e8` | `src\styles\themes\brand\BrandDefault.css` | 48 |`
- **docs\reports\color-token-usage-report.md** line 692
  `- `--brand-c-text-light: #e8e8e8;` (interpolated value)`
- **docs\reports\FIXES-APPLIED.md** line 16
  `- ✓ **Added `--brand-c-text-light: #e8e8e8`** (line 48)`

#### `#cee6c8` (10 occurrences)

- **audit-BEFORE.md** line 143
  `| `#cee6c8` | 2 | 2 | Replace with `var(--brand-c-primary-light)` |`
- **audit-BEFORE.md** line 2581
  `#### `#cee6c8` (2 occurrences)`
- **audit-BEFORE.md** line 2584
  ``--brand-c-primary-light: #cee6c8;``
- **audit-BEFORE.md** line 2586
  ``--brand-c-primary-light: #cee6c8;``
- **audit-BEFORE.md** line 4098
  `| `--brand-c-primary-light` | `#cee6c8` | `files\example-BrandDefault-NEW.css` | 13 |`
- **audit-BEFORE.md** line 5080
  `| `--brand-c-primary-light` | `#cee6c8` | `files\example-BrandDefault-NEW.css` | 13 |`
- **audit-BEFORE.md** line 5758
  `| `--brand-c-primary-light` | `#cee6c8` | `src\styles\themes\brand\BrandDefault.css` | 15 |`
- **audit-BEFORE.md** line 6462
  `| `#cee6c8` | `--brand-c-primary-light`, `--brand-c-primary-light` |`
- **files\example-BrandDefault-NEW.css** line 13
  `--brand-c-primary-light: #cee6c8;`
- **src\styles\themes\brand\BrandDefault.css** line 13
  `--brand-c-primary-light: #cee6c8;`

#### `#ffcfba` (10 occurrences)

- **audit-BEFORE.md** line 144
  `| `#ffcfba` | 2 | 2 | Replace with `var(--brand-c-secondary-light)` |`
- **audit-BEFORE.md** line 2588
  `#### `#ffcfba` (2 occurrences)`
- **audit-BEFORE.md** line 2591
  ``--brand-c-secondary-light: #ffcfba;``
- **audit-BEFORE.md** line 2593
  ``--brand-c-secondary-light: #ffcfba;``
- **audit-BEFORE.md** line 4104
  `| `--brand-c-secondary-light` | `#ffcfba` | `files\example-BrandDefault-NEW.css` | 19 |`
- **audit-BEFORE.md** line 5086
  `| `--brand-c-secondary-light` | `#ffcfba` | `files\example-BrandDefault-NEW.css` | 19 |`
- **audit-BEFORE.md** line 5861
  `| `--brand-c-secondary-light` | `#ffcfba` | `src\styles\themes\brand\BrandDefault.css` | 26 |`
- **audit-BEFORE.md** line 6473
  `| `#ffcfba` | `--brand-c-secondary-light`, `--brand-c-secondary-light` |`
- **files\example-BrandDefault-NEW.css** line 19
  `--brand-c-secondary-light: #ffcfba;`
- **src\styles\themes\brand\BrandDefault.css** line 19
  `--brand-c-secondary-light: #ffcfba;`

#### `#855543` (10 occurrences)

- **audit-BEFORE.md** line 145
  `| `#855543` | 2 | 2 | Replace with `var(--brand-c-secondary-dark)` |`
- **audit-BEFORE.md** line 2595
  `#### `#855543` (2 occurrences)`
- **audit-BEFORE.md** line 2598
  ``--brand-c-secondary-dark: #855543;``
- **audit-BEFORE.md** line 2600
  ``--brand-c-secondary-dark: #855543;``
- **audit-BEFORE.md** line 4102
  `| `--brand-c-secondary-dark` | `#855543` | `files\example-BrandDefault-NEW.css` | 20 |`
- **audit-BEFORE.md** line 5084
  `| `--brand-c-secondary-dark` | `#855543` | `files\example-BrandDefault-NEW.css` | 20 |`
- **audit-BEFORE.md** line 5902
  `| `--brand-c-secondary-dark` | `#855543` | `src\styles\themes\brand\BrandDefault.css` | 30 |`
- **audit-BEFORE.md** line 6453
  `| `#855543` | `--brand-c-secondary-dark`, `--brand-c-secondary-dark` |`
- **files\example-BrandDefault-NEW.css** line 20
  `--brand-c-secondary-dark: #855543;`
- **src\styles\themes\brand\BrandDefault.css** line 20
  `--brand-c-secondary-dark: #855543;`

#### `#c2bdb8` (10 occurrences)

- **audit-BEFORE.md** line 146
  `| `#c2bdb8` | 2 | 2 | Replace with `var(--brand-c-neutral)` |`
- **audit-BEFORE.md** line 2602
  `#### `#c2bdb8` (2 occurrences)`
- **audit-BEFORE.md** line 2605
  ``--brand-c-neutral: #c2bdb8;``
- **audit-BEFORE.md** line 2607
  ``--brand-c-neutral: #c2bdb8;``
- **audit-BEFORE.md** line 4090
  `| `--brand-c-neutral` | `#c2bdb8` | `files\example-BrandDefault-NEW.css` | 26 |`
- **audit-BEFORE.md** line 5067
  `| `--brand-c-neutral` | `#c2bdb8` | `files\example-BrandDefault-NEW.css` | 26 |`
- **audit-BEFORE.md** line 5675
  `| `--brand-c-neutral` | `#c2bdb8` | `src\styles\themes\brand\BrandDefault.css` | 63 |`
- **audit-BEFORE.md** line 6459
  `| `#c2bdb8` | `--brand-c-neutral`, `--brand-c-neutral` |`
- **files\example-BrandDefault-NEW.css** line 26
  `--brand-c-neutral: #c2bdb8;`
- **src\styles\themes\brand\BrandDefault.css** line 26
  `--brand-c-neutral: #c2bdb8;`

#### `#8aa5e5` (10 occurrences)

- **audit-BEFORE.md** line 158
  `| `#8aa5e5` | 2 | 1 | Consider creating token |`
- **audit-BEFORE.md** line 2384
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2393
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2402
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2411
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **audit-BEFORE.md** line 2686
  `#### `#8aa5e5` (2 occurrences)`
- **audit-BEFORE.md** line 2689
  ``styles.getPropertyValue('--particle-confetti-4').trim() || '#8AA5E5',``
- **audit-BEFORE.md** line 2691
  ``opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];``
- **src\lib\animation\particle-burst.ts** line 50
  `styles.getPropertyValue('--particle-confetti-4').trim() || '#8AA5E5',`
- **src\lib\animation\particle-burst.ts** line 189
  `opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];`

#### `#0e3f2e` (10 occurrences)

- **audit-BEFORE.md** line 162
  `| `#0e3f2e` | 2 | 1 | Consider creating token |`
- **audit-BEFORE.md** line 2714
  `#### `#0e3f2e` (2 occurrences)`
- **audit-BEFORE.md** line 2717
  ``--brand-background-dark: #0e3f2e; /* base: 950 - Primary */``
- **audit-BEFORE.md** line 2719
  ``--brand-text: #0e3f2e; /* base: 700 - Primary */``
- **audit-BEFORE.md** line 4083
  `| `--brand-background-dark` | `#0e3f2e` | `src\scripts\ThemeTokenGen\color-input.css` | 83 |`
- **audit-BEFORE.md** line 5052
  `| `--brand-background-dark` | `#0e3f2e` | `src\scripts\ThemeTokenGen\color-input.css` | 83 |`
- **audit-BEFORE.md** line 5112
  `| `--brand-text` | `#0e3f2e` | `src\scripts\ThemeTokenGen\color-input.css` | 84 |`
- **audit-BEFORE.md** line 6432
  `| `#0e3f2e` | `--brand-background-dark`, `--brand-text` |`
- **src\scripts\ThemeTokenGen\color-input.css** line 83
  `--brand-background-dark: #0e3f2e; /* base: 950 - Primary */`
- **src\scripts\ThemeTokenGen\color-input.css** line 84
  `--brand-text: #0e3f2e; /* base: 700 - Primary */`

#### `rgba(255, 255, 255, 0.3)` (10 occurrences)

- **audit-BEFORE.md** line 94
  `| `rgba(255, 255, 255, 0.3)` | 4 | 2 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2148
  `#### `rgba(255, 255, 255, 0.3)` (4 occurrences)`
- **audit-BEFORE.md** line 2151
  ``border: 1px solid rgba(255, 255, 255, 0.3) !important;``
- **audit-BEFORE.md** line 2153
  ``border: 1px solid rgba(255, 255, 255, 0.3);``
- **audit-BEFORE.md** line 2155
  ``border: 1px solid rgba(255, 255, 255, 0.3);``
- **audit-BEFORE.md** line 2157
  ``border-color: rgba(255, 255, 255, 0.3) !important;``
- **src\components\Badge\Badge.astro** line 224
  `border: 1px solid rgba(255, 255, 255, 0.3) !important;`
- **src\components\Grids\RelatedGrid.astro** line 409
  `border: 1px solid rgba(255, 255, 255, 0.3);`
- **src\components\Grids\RelatedGrid.astro** line 523
  `border: 1px solid rgba(255, 255, 255, 0.3);`
- **src\components\Grids\RelatedGrid.astro** line 804
  `border-color: rgba(255, 255, 255, 0.3) !important;`

#### `rgba(255, 255, 255, 0.5)` (10 occurrences)

- **audit-BEFORE.md** line 95
  `| `rgba(255, 255, 255, 0.5)` | 4 | 3 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2159
  `#### `rgba(255, 255, 255, 0.5)` (4 occurrences)`
- **audit-BEFORE.md** line 2162
  ``background: rgba(255, 255, 255, 0.5) !important;``
- **audit-BEFORE.md** line 2164
  ``border: 1px solid rgba(255, 255, 255, 0.5) !important;``
- **audit-BEFORE.md** line 2166
  ``particle.style.border = '1px solid rgba(255, 255, 255, 0.5)';``
- **audit-BEFORE.md** line 2168
  ``border-color: rgba(255, 255, 255, 0.5);``
- **src\components\Badge\Badge.astro** line 231
  `background: rgba(255, 255, 255, 0.5) !important;`
- **src\components\Badge\Badge.astro** line 234
  `border: 1px solid rgba(255, 255, 255, 0.5) !important;`
- **src\lib\animation\particle-burst.ts** line 106
  `particle.style.border = '1px solid rgba(255, 255, 255, 0.5)';`
- **src\styles\pages\service-detail.css** line 286
  `border-color: rgba(255, 255, 255, 0.5);`

#### `rgba(0, 0, 0, 0.6)` (10 occurrences)

- **audit-BEFORE.md** line 112
  `| `rgba(0, 0, 0, 0.6)` | 3 | 2 | Create new token — used frequently |`
- **audit-BEFORE.md** line 984
  ``- [ ] Replace `rgba(0, 0, 0, 0.6)` with `color-mix(in oklch, var(--color-Black) 60%, transparent)```
- **audit-BEFORE.md** line 1421
  ``- [ ] Replace `rgba(0, 0, 0, 0.2)` and `rgba(0, 0, 0, 0.6)` with `color-mix()```
- **audit-BEFORE.md** line 2334
  `#### `rgba(0, 0, 0, 0.6)` (3 occurrences)`
- **audit-BEFORE.md** line 2337
  ``- [ ] Replace `rgba(0, 0, 0, 0.6)` with `color-mix(in oklch, var(--color-Black) 60%, transparent)```
- **audit-BEFORE.md** line 2339
  ``- [ ] Replace `rgba(0, 0, 0, 0.2)` and `rgba(0, 0, 0, 0.6)` with `color-mix()```
- **audit-BEFORE.md** line 2341
  ``rgba(0, 0, 0, 0.6) 50%,``
- **docs\todo\TODO.md** line 461
  `- [ ] Replace `rgba(0, 0, 0, 0.6)` with `color-mix(in oklch, var(--color-Black) 60%, transparent)``
- **docs\todo\TODO.md** line 467
  `- [ ] Replace `rgba(0, 0, 0, 0.2)` and `rgba(0, 0, 0, 0.6)` with `color-mix()``
- **src\components\Presentation\Sections\HeroSection.astro** line 72
  `rgba(0, 0, 0, 0.6) 50%,`

#### `rgba(255, 255, 255, 0.2)` (10 occurrences)

- **audit-BEFORE.md** line 124
  `| `rgba(255, 255, 255, 0.2)` | 3 | 2 | Replace with `var(--glass-border)` |`
- **audit-BEFORE.md** line 2442
  `#### `rgba(255, 255, 255, 0.2)` (3 occurrences)`
- **audit-BEFORE.md** line 2445
  ``border-bottom: 1px solid rgba(255, 255, 255, 0.2);``
- **audit-BEFORE.md** line 2447
  ``--glint-gradient: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);``
- **audit-BEFORE.md** line 2449
  ``--glass-border: rgba(255, 255, 255, 0.2);``
- **audit-BEFORE.md** line 6103
  `| `--glass-border` | `rgba(255, 255, 255, 0.2)` | `src\styles\tokens\shadows.css` | 81 |`
- **audit-BEFORE.md** line 6118
  `| `--glint-gradient` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)` | `src\styles\tokens`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2072
  `border-bottom: 1px solid rgba(255, 255, 255, 0.2);`
- **src\styles\tokens\shadows.css** line 73
  `--glint-gradient: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);`
- **src\styles\tokens\shadows.css** line 81
  `--glass-border: rgba(255, 255, 255, 0.2);`

#### `hsl(h, news, newl)` (10 occurrences)

- **audit-BEFORE.md** line 102
  `| `hsl(h, news, newl)` | 4 | 1 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2236
  `#### `hsl(h, news, newl)` (4 occurrences)`
- **audit-BEFORE.md** line 2239
  ``return chroma.hsl(h, newS, newL);``
- **audit-BEFORE.md** line 2241
  ``return chroma.hsl(h, newS, newL);``
- **audit-BEFORE.md** line 2243
  ``return chroma.hsl(h, newS, newL);``
- **audit-BEFORE.md** line 2245
  ``return chroma.hsl(h, newS, newL);``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1066
  `return chroma.hsl(h, newS, newL);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1072
  `return chroma.hsl(h, newS, newL);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1078
  `return chroma.hsl(h, newS, newL);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1084
  `return chroma.hsl(h, newS, newL);`

#### `#d4b98c` (9 occurrences)

- **audit-BEFORE.md** line 121
  `| `#d4b98c` | 3 | 1 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2415
  `#### `#d4b98c` (3 occurrences)`
- **audit-BEFORE.md** line 2418
  ``colors.push({ color: '#D4B98C', theory: 'Metallic Gold' });``
- **audit-BEFORE.md** line 2420
  ``document.getElementById('secondaryColorPicker').value = '#D4B98C';``
- **audit-BEFORE.md** line 2422
  ``document.getElementById('secondaryColorHex').value = '#D4B98C';``
- **audit-BEFORE.md** line 2454
  ``colors.push({ color: '#D4B98C', theory: 'Metallic Gold' });``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1127
  `colors.push({ color: '#D4B98C', theory: 'Metallic Gold' });`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2009
  `document.getElementById('secondaryColorPicker').value = '#D4B98C';`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2010
  `document.getElementById('secondaryColorHex').value = '#D4B98C';`

#### `#ff0000` (9 occurrences)

- **audit-BEFORE.md** line 130
  `| `#ff0000` | 2 | 1 | Consider creating token |`
- **audit-BEFORE.md** line 2490
  `#### `#ff0000` (2 occurrences)`
- **audit-BEFORE.md** line 2493
  ``--color-Error:   #ff0000;``
- **audit-BEFORE.md** line 2495
  ``--color-Danger:  #ff0000;``
- **audit-BEFORE.md** line 5624
  `| `--color-Danger` | `#ff0000` | `docs\Markdown Notes\accessibility-color-themes.md` | 238 |`
- **audit-BEFORE.md** line 5631
  `| `--color-Error` | `#ff0000` | `docs\Markdown Notes\accessibility-color-themes.md` | 237 |`
- **audit-BEFORE.md** line 6472
  `| `#ff0000` | `--color-Danger`, `--color-Error` |`
- **docs\Markdown Notes\accessibility-color-themes.md** line 237
  `--color-Error:   #ff0000;`
- **docs\Markdown Notes\accessibility-color-themes.md** line 238
  `--color-Danger:  #ff0000;`

#### `#eeebe2` (9 occurrences)

- **audit-BEFORE.md** line 135
  `| `#eeebe2` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2525
  `#### `#eeebe2` (2 occurrences)`
- **audit-BEFORE.md** line 2528
  ``- Text: Consider terracotta (#C17C5A) or dark text on cream background (#EEEBE2)``
- **audit-BEFORE.md** line 2530
  ``--brand-background: #EEEBE2; /* base: 100 - light colors work best for backgrounds */``
- **audit-BEFORE.md** line 2993
  ``- Text: Consider terracotta (#C17C5A) or dark text on cream background (#EEEBE2)``
- **audit-BEFORE.md** line 4077
  `| `--brand-background` | `#EEEBE2` | `src\scripts\ThemeTokenGen\brand-template.css` | 43 |`
- **audit-BEFORE.md** line 5046
  `| `--brand-background` | `#EEEBE2` | `src\scripts\ThemeTokenGen\brand-template.css` | 43 |`
- **docs\Markdown Notes\new hero.md** line 51
  `- Text: Consider terracotta (#C17C5A) or dark text on cream background (#EEEBE2)`
- **src\scripts\ThemeTokenGen\brand-template.css** line 43
  `--brand-background: #EEEBE2; /* base: 100 - light colors work best for backgrounds */`

#### `#5a5754` (9 occurrences)

- **audit-BEFORE.md** line 137
  `| `#5a5754` | 2 | 2 | Replace with `var(--color-Background-600)` |`
- **audit-BEFORE.md** line 2539
  `#### `#5a5754` (2 occurrences)`
- **audit-BEFORE.md** line 2542
  ``- ✓ **Added `--color-Background-600: #5a5754`** (line 41)``
- **audit-BEFORE.md** line 2544
  ``--color-Background-600: #5a5754;``
- **audit-BEFORE.md** line 4139
  `| `--color-Background-600` | `#5a5754`** (line 41)` | `docs\reports\FIXES-APPLIED.md` | 56 |`
- **audit-BEFORE.md** line 4140
  `| `--color-Background-600` | `#5a5754` | `src\styles\themes\brand\BrandDefault.css` | 41 |`
- **audit-BEFORE.md** line 5569
  `| `--color-Background-600` | `#5a5754`** (line 41)` | `docs\reports\FIXES-APPLIED.md` | 56 |`
- **audit-BEFORE.md** line 5570
  `| `--color-Background-600` | `#5a5754` | `src\styles\themes\brand\BrandDefault.css` | 41 |`
- **docs\reports\FIXES-APPLIED.md** line 56
  `- ✓ **Added `--color-Background-600: #5a5754`** (line 41)`

#### `#3e3b39` (9 occurrences)

- **audit-BEFORE.md** line 138
  `| `#3e3b39` | 2 | 2 | Replace with `var(--color-Background-700)` |`
- **audit-BEFORE.md** line 2546
  `#### `#3e3b39` (2 occurrences)`
- **audit-BEFORE.md** line 2549
  ``- ✓ **Added `--color-Background-700: #3e3b39`** (line 42)``
- **audit-BEFORE.md** line 2551
  ``--color-Background-700: #3e3b39;``
- **audit-BEFORE.md** line 4141
  `| `--color-Background-700` | `#3e3b39`** (line 42)` | `docs\reports\FIXES-APPLIED.md` | 57 |`
- **audit-BEFORE.md** line 4142
  `| `--color-Background-700` | `#3e3b39` | `src\styles\themes\brand\BrandDefault.css` | 42 |`
- **audit-BEFORE.md** line 5571
  `| `--color-Background-700` | `#3e3b39`** (line 42)` | `docs\reports\FIXES-APPLIED.md` | 57 |`
- **audit-BEFORE.md** line 5572
  `| `--color-Background-700` | `#3e3b39` | `src\styles\themes\brand\BrandDefault.css` | 42 |`
- **docs\reports\FIXES-APPLIED.md** line 57
  `- ✓ **Added `--color-Background-700: #3e3b39`** (line 42)`

#### `#5a5a5a` (9 occurrences)

- **audit-BEFORE.md** line 159
  `| `#5a5a5a` | 2 | 2 | Replace with `var(--brand-c-text)` |`
- **audit-BEFORE.md** line 2693
  `#### `#5a5a5a` (2 occurrences)`
- **audit-BEFORE.md** line 2696
  ``--brand-text: #5A5A5A; /* base: 700 - medium-dark for readability */``
- **audit-BEFORE.md** line 2698
  ``--brand-c-text: #5a5a5a;``
- **audit-BEFORE.md** line 5110
  `| `--brand-text` | `#5A5A5A` | `src\scripts\ThemeTokenGen\brand-template.css` | 56 |`
- **audit-BEFORE.md** line 5998
  `| `--brand-c-text` | `#5a5a5a` | `src\styles\themes\brand\BrandDefault.css` | 54 |`
- **audit-BEFORE.md** line 6448
  `| `#5a5a5a` | `--brand-text`, `--brand-c-text` |`
- **audit-BEFORE.md** line 6521
  `| `#5a5a5a` | 153 | candidate-8 |`
- **src\scripts\ThemeTokenGen\brand-template.css** line 56
  `--brand-text: #5A5A5A; /* base: 700 - medium-dark for readability */`

#### `#3e4a5a` (9 occurrences)

- **audit-BEFORE.md** line 160
  `| `#3e4a5a` | 2 | 2 | Replace with `var(--brand-c-neutral)` |`
- **audit-BEFORE.md** line 2700
  `#### `#3e4a5a` (2 occurrences)`
- **audit-BEFORE.md** line 2703
  ``--brand-accent4: #3e4a5a; /* base: 500 */``
- **audit-BEFORE.md** line 2705
  ``--brand-c-neutral: #3e4a5a;``
- **audit-BEFORE.md** line 4069
  `| `--brand-accent4` | `#3e4a5a` | `src\scripts\ThemeTokenGen\brand-template.css` | 76 |`
- **audit-BEFORE.md** line 5038
  `| `--brand-accent4` | `#3e4a5a` | `src\scripts\ThemeTokenGen\brand-template.css` | 76 |`
- **audit-BEFORE.md** line 5263
  `| `--brand-c-neutral` | `#3e4a5a` | `src\styles\themes\brand\BrandDefault.css` | 102 |`
- **audit-BEFORE.md** line 6443
  `| `#3e4a5a` | `--brand-accent4`, `--brand-c-neutral` |`
- **src\scripts\ThemeTokenGen\brand-template.css** line 76
  `--brand-accent4: #3e4a5a; /* base: 500 */`

#### `#a28aad` (9 occurrences)

- **audit-BEFORE.md** line 161
  `| `#a28aad` | 2 | 2 | Replace with `var(--brand-c-neutral)` |`
- **audit-BEFORE.md** line 2707
  `#### `#a28aad` (2 occurrences)`
- **audit-BEFORE.md** line 2710
  ``--brand-accent5: #a28aad; /* base: 500 */``
- **audit-BEFORE.md** line 2712
  ``--brand-c-neutral: #a28aad;``
- **audit-BEFORE.md** line 4073
  `| `--brand-accent5` | `#a28aad` | `src\scripts\ThemeTokenGen\brand-template.css` | 80 |`
- **audit-BEFORE.md** line 5042
  `| `--brand-accent5` | `#a28aad` | `src\scripts\ThemeTokenGen\brand-template.css` | 80 |`
- **audit-BEFORE.md** line 5192
  `| `--brand-c-neutral` | `#a28aad` | `src\styles\themes\brand\BrandDefault.css` | 112 |`
- **audit-BEFORE.md** line 6458
  `| `#a28aad` | `--brand-accent5`, `--brand-c-neutral` |`
- **src\scripts\ThemeTokenGen\brand-template.css** line 80
  `--brand-accent5: #a28aad; /* base: 500 */`

#### `#373737` (9 occurrences)

- **audit-BEFORE.md** line 168
  `| `#373737` | 2 | 2 | Replace with `var(--brand-c-text-dark)` |`
- **audit-BEFORE.md** line 2756
  `#### `#373737` (2 occurrences)`
- **audit-BEFORE.md** line 2759
  ``--brand-c-text: #373737;``
- **audit-BEFORE.md** line 2761
  ``--brand-c-text-dark: #373737;``
- **audit-BEFORE.md** line 5990
  `| `--brand-c-text` | `#373737` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 14 |`
- **audit-BEFORE.md** line 6022
  `| `--brand-c-text-dark` | `#373737` | `src\styles\themes\brand\BrandDefault.css` | 56 |`
- **audit-BEFORE.md** line 6440
  `| `#373737` | `--brand-c-text`, `--brand-c-text-dark` |`
- **audit-BEFORE.md** line 6526
  `| `#373737` | 76 | candidate-13 |`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 14
  `--brand-c-text: #373737;`

#### `#4a90e2` (9 occurrences)

- **audit-BEFORE.md** line 169
  `| `#4a90e2` | 2 | 1 | Consider creating token |`
- **audit-BEFORE.md** line 580
  ``<button class="generate-btn" onclick="chooseAgain()" style="background: #4A90E2; color: white; flex: 0.5; min-width: 15`
- **audit-BEFORE.md** line 2763
  `#### `#4a90e2` (2 occurrences)`
- **audit-BEFORE.md** line 2766
  ``<button class="generate-btn" onclick="chooseAgain()" style="background: #4A90E2; color: white; flex: 0.5; min-width: 15`
- **audit-BEFORE.md** line 2768
  ``<button class="export-btn" onclick="openLiveDemo()" style="background: #4A90E2;">Open Live Demo Page</button>``
- **audit-BEFORE.md** line 4026
  ``background: #4A90E2; color: white; flex: 0.5; min-width: 150px;``
- **audit-BEFORE.md** line 4030
  ``background: #4A90E2;``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 795
  `<button class="generate-btn" onclick="chooseAgain()" style="background: #4A90E2; color: var(--color-White); flex: 0.5; m`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 840
  `<button class="export-btn" onclick="openLiveDemo()" style="background: #4A90E2;">Open Live Demo Page</button>`

#### `#6b7280` (8 occurrences)

- **audit-BEFORE.md** line 107
  `| `#6b7280` | 3 | 3 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2289
  `#### `#6b7280` (3 occurrences)`
- **audit-BEFORE.md** line 2292
  ``"textSecondary": { "type": "string", "example": "#6B7280" },``
- **audit-BEFORE.md** line 2294
  ``textLight: '#6b7280',``
- **audit-BEFORE.md** line 2296
  ``textLight: '#6b7280',``
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 172
  `"textSecondary": { "type": "string", "example": "#6B7280" },`
- **src\lib\emailit.ts** line 79
  `textLight: '#6b7280',`
- **src\pages\api\contact.ts** line 12
  `textLight: '#6b7280',`

#### `#171717` (8 occurrences)

- **audit-BEFORE.md** line 126
  `| `#171717` | 3 | 1 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2460
  `#### `#171717` (3 occurrences)`
- **audit-BEFORE.md** line 2463
  ``border: 2px solid var(--brand-c-neutral-dark, #171717);``
- **audit-BEFORE.md** line 2465
  ``border-top-color: var(--brand-c-neutral-dark, #171717);``
- **audit-BEFORE.md** line 2467
  ``border-bottom-color: var(--brand-c-neutral-dark, #171717);``
- **src\styles\base\utilities.css** line 423
  `border: 2px solid var(--brand-c-neutral-dark, #171717);`
- **src\styles\base\utilities.css** line 429
  `border-top-color: var(--brand-c-neutral-dark, #171717);`
- **src\styles\base\utilities.css** line 434
  `border-bottom-color: var(--brand-c-neutral-dark, #171717);`

#### `#10b981` (8 occurrences)

- **audit-BEFORE.md** line 129
  `| `#10b981` | 2 | 2 | Replace with `var(--feedback-success-border)` |`
- **audit-BEFORE.md** line 2483
  `#### `#10b981` (2 occurrences)`
- **audit-BEFORE.md** line 2486
  ``"accent3": { "type": "string", "example": "#10B981" }``
- **audit-BEFORE.md** line 2488
  ``--feedback-success-border: #10b981;``
- **audit-BEFORE.md** line 4191
  `| `--feedback-success-border` | `#10b981` | `docs\todo\TODO.md` | 381 |`
- **audit-BEFORE.md** line 6079
  `| `--feedback-success-border` | `#10b981` | `docs\todo\TODO.md` | 381 |`
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 178
  `"accent3": { "type": "string", "example": "#10B981" }`
- **docs\todo\TODO.md** line 381
  `--feedback-success-border: #10b981;`

#### `#ff9800` (8 occurrences)

- **audit-BEFORE.md** line 131
  `| `#ff9800` | 2 | 2 | Replace with `var(--color-Warning)` |`
- **audit-BEFORE.md** line 2080
  ``--color-Warning    /* #ff9800 - orange */``
- **audit-BEFORE.md** line 2497
  `#### `#ff9800` (2 occurrences)`
- **audit-BEFORE.md** line 2500
  ``--color-Warning    /* #ff9800 - orange */``
- **audit-BEFORE.md** line 2502
  ``--color-Warning: #ff9800;``
- **audit-BEFORE.md** line 6041
  `| `--color-Warning` | `#ff9800` | `src\styles\tokens\status.css` | 18 |`
- **docs\Markdown Notes\CSS-Tokens.md** line 93
  `--color-Warning    /* #ff9800 - orange */`
- **src\styles\tokens\status.css** line 18
  `--color-Warning: #ff9800;`

#### `#f44336` (8 occurrences)

- **audit-BEFORE.md** line 132
  `| `#f44336` | 2 | 2 | Replace with `var(--color-Error)` |`
- **audit-BEFORE.md** line 1786
  ``--color-Error      /* #f44336 - red */``
- **audit-BEFORE.md** line 2504
  `#### `#f44336` (2 occurrences)`
- **audit-BEFORE.md** line 2507
  ``--color-Error      /* #f44336 - red */``
- **audit-BEFORE.md** line 2509
  ``--color-Error: #f44336;``
- **audit-BEFORE.md** line 5636
  `| `--color-Error` | `#f44336` | `src\styles\tokens\status.css` | 19 |`
- **docs\Markdown Notes\CSS-Tokens.md** line 94
  `--color-Error      /* #f44336 - red */`
- **src\styles\tokens\status.css** line 19
  `--color-Error: #f44336;`

#### `#2196f3` (8 occurrences)

- **audit-BEFORE.md** line 133
  `| `#2196f3` | 2 | 2 | Replace with `var(--color-Info)` |`
- **audit-BEFORE.md** line 1681
  ``--color-Info       /* #2196f3 - blue */``
- **audit-BEFORE.md** line 2511
  `#### `#2196f3` (2 occurrences)`
- **audit-BEFORE.md** line 2514
  ``--color-Info       /* #2196f3 - blue */``
- **audit-BEFORE.md** line 2516
  ``--color-Info: #2196f3;``
- **audit-BEFORE.md** line 5647
  `| `--color-Info` | `#2196f3` | `src\styles\tokens\status.css` | 20 |`
- **docs\Markdown Notes\CSS-Tokens.md** line 96
  `--color-Info       /* #2196f3 - blue */`
- **src\styles\tokens\status.css** line 20
  `--color-Info: #2196f3;`

#### `rgba(0, 0, 0, 0.12)` (8 occurrences)

- **audit-BEFORE.md** line 114
  `| `rgba(0, 0, 0, 0.12)` | 3 | 3 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2352
  `#### `rgba(0, 0, 0, 0.12)` (3 occurrences)`
- **audit-BEFORE.md** line 2355
  ``box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);``
- **audit-BEFORE.md** line 2357
  ``box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);``
- **audit-BEFORE.md** line 2359
  ``box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);``
- **src\components\A11y Panel\FontCard.astro** line 56
  `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);`
- **src\components\A11y Panel\PresetButton.astro** line 59
  `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);`
- **src\components\A11y Panel\ToggleCard.astro** line 71
  `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);`

#### `rgba(0,0,0,0.06)` (8 occurrences)

- **audit-BEFORE.md** line 115
  `| `rgba(0,0,0,0.06)` | 3 | 3 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2361
  `#### `rgba(0,0,0,0.06)` (3 occurrences)`
- **audit-BEFORE.md** line 2364
  ``box-shadow: 0 4px 24px rgba(0,0,0,0.06);``
- **audit-BEFORE.md** line 2366
  ``box-shadow: 0 4px 24px rgba(0,0,0,0.06);``
- **audit-BEFORE.md** line 2368
  ``box-shadow: 0 2px 12px rgba(0,0,0,0.06);``
- **src\lib\emailit.ts** line 138
  `box-shadow: 0 4px 24px rgba(0,0,0,0.06);`
- **src\pages\api\contact.ts** line 55
  `box-shadow: 0 4px 24px rgba(0,0,0,0.06);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 51
  `box-shadow: 0 2px 12px rgba(0,0,0,0.06);`

#### `rgba(255,255,255,0.85)` (8 occurrences)

- **audit-BEFORE.md** line 116
  `| `rgba(255,255,255,0.85)` | 3 | 3 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2370
  `#### `rgba(255,255,255,0.85)` (3 occurrences)`
- **audit-BEFORE.md** line 2373
  ``color: rgba(255,255,255,0.85);``
- **audit-BEFORE.md** line 2375
  ``color: rgba(255,255,255,0.85);``
- **audit-BEFORE.md** line 2377
  ``background: rgba(255,255,255,0.85);``
- **src\lib\emailit.ts** line 159
  `color: rgba(255,255,255,0.85);`
- **src\pages\api\contact.ts** line 71
  `color: rgba(255,255,255,0.85);`
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 333
  `background: rgba(255,255,255,0.85);`

#### `rgba(0,0,0,0.2)` (8 occurrences)

- **audit-BEFORE.md** line 122
  `| `rgba(0,0,0,0.2)` | 3 | 1 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2424
  `#### `rgba(0,0,0,0.2)` (3 occurrences)`
- **audit-BEFORE.md** line 2427
  ``box-shadow: 0 4px 12px rgba(0,0,0,0.2);``
- **audit-BEFORE.md** line 2429
  ``box-shadow: 0 4px 12px rgba(0,0,0,0.2);``
- **audit-BEFORE.md** line 2431
  ``box-shadow: 0 6px 16px rgba(0,0,0,0.2);``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 189
  `box-shadow: 0 4px 12px rgba(0,0,0,0.2);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 320
  `box-shadow: 0 4px 12px rgba(0,0,0,0.2);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 551
  `box-shadow: 0 6px 16px rgba(0,0,0,0.2);`

#### `rgba(0,0,0,0.5)` (8 occurrences)

- **audit-BEFORE.md** line 123
  `| `rgba(0,0,0,0.5)` | 3 | 2 | Create new token — used frequently |`
- **audit-BEFORE.md** line 2433
  `#### `rgba(0,0,0,0.5)` (3 occurrences)`
- **audit-BEFORE.md** line 2436
  ``text-shadow: 0 2px 4px rgba(0,0,0,0.5);``
- **audit-BEFORE.md** line 2438
  ``text-shadow: 0 2px 4px rgba(0,0,0,0.5);``
- **audit-BEFORE.md** line 2440
  ``background: rgba(0,0,0,0.5);``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 425
  `text-shadow: 0 2px 4px rgba(0,0,0,0.5);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 634
  `text-shadow: 0 2px 4px rgba(0,0,0,0.5);`
- **src\styles\components\a11y-panel.css** line 416
  `background: rgba(0,0,0,0.5);`

#### `rgba(255, 255, 255, 0.4)` (8 occurrences)

- **audit-BEFORE.md** line 150
  `| `rgba(255, 255, 255, 0.4)` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2630
  `#### `rgba(255, 255, 255, 0.4)` (2 occurrences)`
- **audit-BEFORE.md** line 2633
  ``border-color: rgba(255, 255, 255, 0.4);``
- **audit-BEFORE.md** line 2635
  ``--glint-gradient-strong: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);``
- **audit-BEFORE.md** line 4216
  `| `--glint-gradient-strong` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)` | `src\styles`
- **audit-BEFORE.md** line 6119
  `| `--glint-gradient-strong` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)` | `src\styles`
- **src\components\Grids\RelatedGrid.astro** line 416
  `border-color: rgba(255, 255, 255, 0.4);`
- **src\styles\tokens\shadows.css** line 74
  `--glint-gradient-strong: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);`

#### `rgba(143,166,138,0.1)` (8 occurrences)

- **audit-BEFORE.md** line 156
  `| `rgba(143,166,138,0.1)` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2672
  `#### `rgba(143,166,138,0.1)` (2 occurrences)`
- **audit-BEFORE.md** line 2675
  ``background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);``
- **audit-BEFORE.md** line 2677
  ``background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);``
- **audit-BEFORE.md** line 2682
  ``background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);``
- **audit-BEFORE.md** line 2684
  ``background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);``
- **src\lib\emailit.ts** line 272
  `background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);`
- **src\pages\api\contact.ts** line 122
  `background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);`

#### `rgba(196,144,124,0.1)` (8 occurrences)

- **audit-BEFORE.md** line 157
  `| `rgba(196,144,124,0.1)` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2675
  ``background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);``
- **audit-BEFORE.md** line 2677
  ``background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);``
- **audit-BEFORE.md** line 2679
  `#### `rgba(196,144,124,0.1)` (2 occurrences)`
- **audit-BEFORE.md** line 2682
  ``background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);``
- **audit-BEFORE.md** line 2684
  ``background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);``
- **src\lib\emailit.ts** line 272
  `background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);`
- **src\pages\api\contact.ts** line 122
  `background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);`

#### `beige` (8 occurrences)

- **audit-BEFORE.md** line 1375
  ``"summary": "Our color palette reflects calm, warmth, and gentle hope. Soft neutrals (warm beige, light grays) create a `
- **audit-BEFORE.md** line 2283
  ``"name": "Background Beige",``
- **audit-BEFORE.md** line 2285
  ``"colorName": "Warm Beige",``
- **audit-BEFORE.md** line 2287
  ``"summary": "Our color palette reflects calm, warmth, and gentle hope. Soft neutrals (warm beige, light grays) create a `
- **audit-BEFORE.md** line 2481
  ``"summary": "Our color palette reflects calm, warmth, and gentle hope. Soft neutrals (warm beige, light grays) create a `
- **docs\Brand\BRAND-PROFILE.json** line 46
  `"name": "Background Beige",`
- **docs\Brand\BRAND-PROFILE.json** line 48
  `"colorName": "Warm Beige",`
- **docs\Brand\BRAND-PROFILE.json** line 268
  `"summary": "Our color palette reflects calm, warmth, and gentle hope. Soft neutrals (warm beige, light grays) create a c`

#### `#71876c` (7 occurrences)

- **audit-BEFORE.md** line 127
  `| `#71876c` | 2 | 2 | Replace with `var(--brand-c-primary-dark)` |`
- **audit-BEFORE.md** line 2469
  `#### `#71876c` (2 occurrences)`
- **audit-BEFORE.md** line 2472
  ``"linkHover": "#71876c",``
- **audit-BEFORE.md** line 2474
  ``--brand-c-primary-dark: #71876c;``
- **audit-BEFORE.md** line 5801
  `| `--brand-c-primary-dark` | `#71876c` | `src\styles\themes\brand\BrandDefault.css` | 18 |`
- **audit-BEFORE.md** line 6520
  `| `#71876c` | 173 | candidate-7 |`
- **docs\Brand\BRAND-PROFILE.json** line 113
  `"linkHover": "#71876c",`

#### `#dbdbdb` (7 occurrences)

- **audit-BEFORE.md** line 136
  `| `#dbdbdb` | 2 | 2 | Replace with `var(--brand-c-text-light)` |`
- **audit-BEFORE.md** line 2532
  `#### `#dbdbdb` (2 occurrences)`
- **audit-BEFORE.md** line 2535
  ``- ✓ **Added `--brand-c-text-light: #dbdbdb`** (line 49)``
- **audit-BEFORE.md** line 2537
  ``--brand-c-text-light: #dbdbdb;``
- **audit-BEFORE.md** line 5933
  `| `--brand-c-text-light` | `#dbdbdb`** (line 49)` | `docs\reports\FIXES-APPLIED.md` | 20 |`
- **audit-BEFORE.md** line 5934
  `| `--brand-c-text-light` | `#dbdbdb` | `src\styles\themes\brand\BrandDefault.css` | 49 |`
- **docs\reports\FIXES-APPLIED.md** line 20
  `- ✓ **Added `--brand-c-text-light: #dbdbdb`** (line 49)`

#### `#2b2927` (7 occurrences)

- **audit-BEFORE.md** line 139
  `| `#2b2927` | 2 | 2 | Replace with `var(--color-Background-800)` |`
- **audit-BEFORE.md** line 2553
  `#### `#2b2927` (2 occurrences)`
- **audit-BEFORE.md** line 2556
  ``- ✓ **Added `--color-Background-800: #2b2927`** (line 43)``
- **audit-BEFORE.md** line 2558
  ``--color-Background-800: #2b2927;``
- **audit-BEFORE.md** line 5573
  `| `--color-Background-800` | `#2b2927`** (line 43)` | `docs\reports\FIXES-APPLIED.md` | 58 |`
- **audit-BEFORE.md** line 5574
  `| `--color-Background-800` | `#2b2927` | `src\styles\themes\brand\BrandDefault.css` | 43 |`
- **docs\reports\FIXES-APPLIED.md** line 58
  `- ✓ **Added `--color-Background-800: #2b2927`** (line 43)`

#### `#1a1918` (7 occurrences)

- **audit-BEFORE.md** line 140
  `| `#1a1918` | 2 | 2 | Replace with `var(--brand-c-bg-dark)` |`
- **audit-BEFORE.md** line 2560
  `#### `#1a1918` (2 occurrences)`
- **audit-BEFORE.md** line 2563
  ``- ✓ **Added `--brand-c-bg-dark: #1a1918`** (line 44)``
- **audit-BEFORE.md** line 2565
  ``--brand-c-bg-dark: #1a1918;``
- **audit-BEFORE.md** line 5577
  `| `--brand-c-bg-dark` | `#1a1918`** (line 44)` | `docs\reports\FIXES-APPLIED.md` | 59 |`
- **audit-BEFORE.md** line 5585
  `| `--brand-c-bg-dark` | `#1a1918` | `src\styles\themes\brand\BrandDefault.css` | 44 |`
- **docs\reports\FIXES-APPLIED.md** line 59
  `- ✓ **Added `--brand-c-bg-dark: #1a1918`** (line 44)`

#### `#80a575` (7 occurrences)

- **audit-BEFORE.md** line 220
  `| `#80a575` | 1 | 1 | Replace with `var(--universal-success)` |`
- **audit-BEFORE.md** line 2173
  ``--universal-success: #80a575; /* #22c55e - Green success/positive */``
- **audit-BEFORE.md** line 3070
  `#### `#80a575` (1 occurrences)`
- **audit-BEFORE.md** line 3073
  ``--universal-success: #80a575; /* #22c55e - Green success/positive */``
- **audit-BEFORE.md** line 4395
  `| `--universal-success` | `#80a575` | `src\scripts\ThemeTokenGen\brand-template.css` | 87 |`
- **audit-BEFORE.md** line 6415
  `| `--universal-success` | `#80a575` | `src\scripts\ThemeTokenGen\brand-template.css` | 87 |`
- **src\scripts\ThemeTokenGen\brand-template.css** line 87
  `--universal-success: #80a575; /* #22c55e - Green success/positive */`

#### `#cea96a` (7 occurrences)

- **audit-BEFORE.md** line 221
  `| `#cea96a` | 1 | 1 | Replace with `var(--universal-warning)` |`
- **audit-BEFORE.md** line 1735
  ``--universal-warning: #cea96a; /* #f59e0b - Amber warning/caution */``
- **audit-BEFORE.md** line 3075
  `#### `#cea96a` (1 occurrences)`
- **audit-BEFORE.md** line 3078
  ``--universal-warning: #cea96a; /* #f59e0b - Amber warning/caution */``
- **audit-BEFORE.md** line 4396
  `| `--universal-warning` | `#cea96a` | `src\scripts\ThemeTokenGen\brand-template.css` | 88 |`
- **audit-BEFORE.md** line 6416
  `| `--universal-warning` | `#cea96a` | `src\scripts\ThemeTokenGen\brand-template.css` | 88 |`
- **src\scripts\ThemeTokenGen\brand-template.css** line 88
  `--universal-warning: #cea96a; /* #f59e0b - Amber warning/caution */`

#### `#9c5151` (7 occurrences)

- **audit-BEFORE.md** line 222
  `| `#9c5151` | 1 | 1 | Replace with `var(--universal-danger)` |`
- **audit-BEFORE.md** line 2184
  ``--universal-danger: #9c5151;  /* #ef4444 - Red error/danger */``
- **audit-BEFORE.md** line 3080
  `#### `#9c5151` (1 occurrences)`
- **audit-BEFORE.md** line 3083
  ``--universal-danger: #9c5151;  /* #ef4444 - Red error/danger */``
- **audit-BEFORE.md** line 4393
  `| `--universal-danger` | `#9c5151` | `src\scripts\ThemeTokenGen\brand-template.css` | 89 |`
- **audit-BEFORE.md** line 6413
  `| `--universal-danger` | `#9c5151` | `src\scripts\ThemeTokenGen\brand-template.css` | 89 |`
- **src\scripts\ThemeTokenGen\brand-template.css** line 89
  `--universal-danger: #9c5151;  /* #ef4444 - Red error/danger */`

#### `#47638f` (7 occurrences)

- **audit-BEFORE.md** line 223
  `| `#47638f` | 1 | 1 | Replace with `var(--universal-info)` |`
- **audit-BEFORE.md** line 2195
  ``--universal-info: #47638f;    /* #3b82f6 - Blue info/neutral */``
- **audit-BEFORE.md** line 3085
  `#### `#47638f` (1 occurrences)`
- **audit-BEFORE.md** line 3088
  ``--universal-info: #47638f;    /* #3b82f6 - Blue info/neutral */``
- **audit-BEFORE.md** line 4394
  `| `--universal-info` | `#47638f` | `src\scripts\ThemeTokenGen\brand-template.css` | 90 |`
- **audit-BEFORE.md** line 6414
  `| `--universal-info` | `#47638f` | `src\scripts\ThemeTokenGen\brand-template.css` | 90 |`
- **src\scripts\ThemeTokenGen\brand-template.css** line 90
  `--universal-info: #47638f;    /* #3b82f6 - Blue info/neutral */`

#### `#2a3328` (7 occurrences)

- **audit-BEFORE.md** line 224
  `| `#2a3328` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 1391
  ``--brand-background-dark: #2a3328; /* base: 850 - dark sage green for dark mode */``
- **audit-BEFORE.md** line 3090
  `#### `#2a3328` (1 occurrences)`
- **audit-BEFORE.md** line 3093
  ``--brand-background-dark: #2a3328; /* base: 850 - dark sage green for dark mode */``
- **audit-BEFORE.md** line 4082
  `| `--brand-background-dark` | `#2a3328` | `src\scripts\ThemeTokenGen\color-input.css` | 50 |`
- **audit-BEFORE.md** line 5051
  `| `--brand-background-dark` | `#2a3328` | `src\scripts\ThemeTokenGen\color-input.css` | 50 |`
- **src\scripts\ThemeTokenGen\color-input.css** line 50
  `--brand-background-dark: #2a3328; /* base: 850 - dark sage green for dark mode */`

#### `#aaaaaa` (6 occurrences)

- **audit-BEFORE.md** line 141
  `| `#aaaaaa` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2567
  `#### `#aaaaaa` (2 occurrences)`
- **audit-BEFORE.md** line 2570
  ``- [ ] Replace `#aaaaaa` with neutral token``
- **audit-BEFORE.md** line 2572
  ``border: 1px solid #aaaaaa !important;``
- **docs\todo\TODO.md** line 458
  `- [ ] Replace `#aaaaaa` with neutral token`
- **src\styles\a11y\components\masonry-grid.css** line 310
  `border: 1px solid #aaaaaa !important;`

#### `#7a9175` (6 occurrences)

- **audit-BEFORE.md** line 153
  `| `#7a9175` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2651
  `#### `#7a9175` (2 occurrences)`
- **audit-BEFORE.md** line 2654
  ``primaryDark: '#7a9175',``
- **audit-BEFORE.md** line 2656
  ``primaryDark: '#7a9175',``
- **src\lib\emailit.ts** line 81
  `primaryDark: '#7a9175',`
- **src\pages\api\contact.ts** line 14
  `primaryDark: '#7a9175',`

#### `#e8e6e3` (6 occurrences)

- **audit-BEFORE.md** line 154
  `| `#e8e6e3` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2658
  `#### `#e8e6e3` (2 occurrences)`
- **audit-BEFORE.md** line 2661
  ``border: '#e8e6e3',``
- **audit-BEFORE.md** line 2663
  ``border: '#e8e6e3',``
- **src\lib\emailit.ts** line 84
  `border: '#e8e6e3',`
- **src\pages\api\contact.ts** line 17
  `border: '#e8e6e3',`

#### `#f0ebe6` (6 occurrences)

- **audit-BEFORE.md** line 155
  `| `#f0ebe6` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2665
  `#### `#f0ebe6` (2 occurrences)`
- **audit-BEFORE.md** line 2668
  ``highlight: '#f0ebe6'``
- **audit-BEFORE.md** line 2670
  ``highlight: '#f0ebe6'``
- **src\lib\emailit.ts** line 85
  `highlight: '#f0ebe6'`
- **src\pages\api\contact.ts** line 18
  `highlight: '#f0ebe6'`

#### `#fafafa` (6 occurrences)

- **audit-BEFORE.md** line 163
  `| `#fafafa` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2721
  `#### `#fafafa` (2 occurrences)`
- **audit-BEFORE.md** line 2724
  ``background: #fafafa;``
- **audit-BEFORE.md** line 2726
  ``background: var(--brand-c-neutral-light, #fafafa);``
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 241
  `background: #fafafa;`
- **src\styles\base\utilities.css** line 421
  `background: var(--brand-c-neutral-light, #fafafa);`

#### `#e0e0e0` (6 occurrences)

- **audit-BEFORE.md** line 164
  `| `#e0e0e0` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2728
  `#### `#e0e0e0` (2 occurrences)`
- **audit-BEFORE.md** line 2731
  ``border: 1px solid #e0e0e0;``
- **audit-BEFORE.md** line 2733
  ``border-bottom: 2px solid #e0e0e0;``
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 243
  `border: 1px solid #e0e0e0;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 140
  `border-bottom: 2px solid #e0e0e0;`

#### `#888888` (6 occurrences)

- **audit-BEFORE.md** line 170
  `| `#888888` | 2 | 1 | Consider creating token |`
- **audit-BEFORE.md** line 2770
  `#### `#888888` (2 occurrences)`
- **audit-BEFORE.md** line 2773
  ``const getColor = (key) => a[key]?.color || '#888888';``
- **audit-BEFORE.md** line 2775
  ``const getColor = (key) => a[key]?.color || '#888888';``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1814
  `const getColor = (key) => a[key]?.color || '#888888';`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2043
  `const getColor = (key) => a[key]?.color || '#888888';`

#### `#111111` (6 occurrences)

- **audit-BEFORE.md** line 177
  `| `#111111` | 2 | 1 | Consider creating token |`
- **audit-BEFORE.md** line 2819
  `#### `#111111` (2 occurrences)`
- **audit-BEFORE.md** line 2822
  ``background: #111111 !important;``
- **audit-BEFORE.md** line 2824
  ``background: #111111 !important;``
- **src\styles\a11y\pages\asset-detail.css** line 127
  `background: #111111 !important;`
- **src\styles\a11y\pages\asset-detail.css** line 283
  `background: #111111 !important;`

#### `#1f2937` (6 occurrences)

- **audit-BEFORE.md** line 178
  `| `#1f2937` | 2 | 1 | Consider creating token |`
- **audit-BEFORE.md** line 2826
  `#### `#1f2937` (2 occurrences)`
- **audit-BEFORE.md** line 2829
  ``border-top-color: var(--brand-c-neutral-dark, #1f2937);``
- **audit-BEFORE.md** line 2831
  ``border-bottom-color: var(--brand-c-neutral-dark, #1f2937);``
- **src\styles\base\utilities.css** line 297
  `border-top-color: var(--brand-c-neutral-dark, #1f2937);`
- **src\styles\base\utilities.css** line 321
  `border-bottom-color: var(--brand-c-neutral-dark, #1f2937);`

#### `#111` (6 occurrences)

- **audit-BEFORE.md** line 179
  `| `#111` | 2 | 1 | Consider creating token |`
- **audit-BEFORE.md** line 2833
  `#### `#111` (2 occurrences)`
- **audit-BEFORE.md** line 2836
  ``color: var(--brand-c-text-dark, #111);``
- **audit-BEFORE.md** line 2838
  ``color: var(--brand-c-text-dark, #111);``
- **src\styles\base\utilities.css** line 385
  `color: var(--brand-c-text-dark, #111);`
- **src\styles\base\utilities.css** line 422
  `color: var(--brand-c-text-dark, #111);`

#### `#fef2f2` (6 occurrences)

- **audit-BEFORE.md** line 180
  `| `#fef2f2` | 2 | 1 | Consider creating token |`
- **audit-BEFORE.md** line 2840
  `#### `#fef2f2` (2 occurrences)`
- **audit-BEFORE.md** line 2843
  ``background: var(--color-Error-100, #fef2f2);``
- **audit-BEFORE.md** line 2845
  ``background-color: var(--color-Error-100, #fef2f2);``
- **src\styles\base\utilities.css** line 518
  `background: var(--color-Error-100, #fef2f2);`
- **src\styles\base\utilities.css** line 552
  `background-color: var(--color-Error-100, #fef2f2);`

#### `#f0fdfa` (6 occurrences)

- **audit-BEFORE.md** line 181
  `| `#f0fdfa` | 2 | 1 | Consider creating token |`
- **audit-BEFORE.md** line 2847
  `#### `#f0fdfa` (2 occurrences)`
- **audit-BEFORE.md** line 2850
  ``background-color: var(--color-Success-100, var(--brand-c-primary-light, #f0fdfa));``
- **audit-BEFORE.md** line 2852
  ``background: var(--color-Success-100, var(--brand-c-primary-light, #f0fdfa));``
- **src\styles\base\utilities.css** line 578
  `background-color: var(--color-Success-100, var(--brand-c-primary-light, #f0fdfa));`
- **src\styles\base\utilities.css** line 585
  `background: var(--color-Success-100, var(--brand-c-primary-light, #f0fdfa));`

#### `#065f46` (6 occurrences)

- **audit-BEFORE.md** line 207
  `| `#065f46` | 1 | 1 | Replace with `var(--feedback-success-text)` |`
- **audit-BEFORE.md** line 3005
  `#### `#065f46` (1 occurrences)`
- **audit-BEFORE.md** line 3008
  ``--feedback-success-text: #065f46;``
- **audit-BEFORE.md** line 4192
  `| `--feedback-success-text` | `#065f46` | `docs\todo\TODO.md` | 380 |`
- **audit-BEFORE.md** line 6080
  `| `--feedback-success-text` | `#065f46` | `docs\todo\TODO.md` | 380 |`
- **docs\todo\TODO.md** line 380
  `--feedback-success-text: #065f46;`

#### `#7f1d1d` (6 occurrences)

- **audit-BEFORE.md** line 208
  `| `#7f1d1d` | 1 | 1 | Replace with `var(--feedback-error-text)` |`
- **audit-BEFORE.md** line 3010
  `#### `#7f1d1d` (1 occurrences)`
- **audit-BEFORE.md** line 3013
  ``--feedback-error-text: #7f1d1d;``
- **audit-BEFORE.md** line 4190
  `| `--feedback-error-text` | `#7f1d1d` | `docs\todo\TODO.md` | 383 |`
- **audit-BEFORE.md** line 6077
  `| `--feedback-error-text` | `#7f1d1d` | `docs\todo\TODO.md` | 383 |`
- **docs\todo\TODO.md** line 383
  `--feedback-error-text: #7f1d1d;`

#### `#92400e` (6 occurrences)

- **audit-BEFORE.md** line 209
  `| `#92400e` | 1 | 1 | Replace with `var(--feedback-warning-text)` |`
- **audit-BEFORE.md** line 3015
  `#### `#92400e` (1 occurrences)`
- **audit-BEFORE.md** line 3018
  ``--feedback-warning-text: #92400e;``
- **audit-BEFORE.md** line 4194
  `| `--feedback-warning-text` | `#92400e` | `docs\todo\TODO.md` | 386 |`
- **audit-BEFORE.md** line 6082
  `| `--feedback-warning-text` | `#92400e` | `docs\todo\TODO.md` | 386 |`
- **docs\todo\TODO.md** line 386
  `--feedback-warning-text: #92400e;`

#### `#fdf8f3` (6 occurrences)

- **audit-BEFORE.md** line 219
  `| `#fdf8f3` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3065
  `#### `#fdf8f3` (1 occurrences)`
- **audit-BEFORE.md** line 3068
  ``--brand-neutral: #FDF8F3; /* base: 100 - very light for subtle borders */``
- **audit-BEFORE.md** line 4109
  `| `--brand-neutral` | `#FDF8F3` | `src\scripts\ThemeTokenGen\brand-template.css` | 60 |`
- **audit-BEFORE.md** line 5096
  `| `--brand-neutral` | `#FDF8F3` | `src\scripts\ThemeTokenGen\brand-template.css` | 60 |`
- **src\scripts\ThemeTokenGen\brand-template.css** line 60
  `--brand-neutral: #FDF8F3; /* base: 100 - very light for subtle borders */`

#### `#f2efd4` (6 occurrences)

- **audit-BEFORE.md** line 225
  `| `#f2efd4` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3095
  `#### `#f2efd4` (1 occurrences)`
- **audit-BEFORE.md** line 3098
  ``--brand-background: #f2efd4; /* base: 50 - Primary */``
- **audit-BEFORE.md** line 4079
  `| `--brand-background` | `#f2efd4` | `src\scripts\ThemeTokenGen\color-input.css` | 74 |`
- **audit-BEFORE.md** line 5048
  `| `--brand-background` | `#f2efd4` | `src\scripts\ThemeTokenGen\color-input.css` | 74 |`
- **src\scripts\ThemeTokenGen\color-input.css** line 74
  `--brand-background: #f2efd4; /* base: 50 - Primary */`

#### `#b9a26e` (6 occurrences)

- **audit-BEFORE.md** line 227
  `| `#b9a26e` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3105
  `#### `#b9a26e` (1 occurrences)`
- **audit-BEFORE.md** line 3108
  ``--brand-secondary: #b9a26e; /* base: 500 - Primary */``
- **audit-BEFORE.md** line 4116
  `| `--brand-secondary` | `#b9a26e` | `src\scripts\ThemeTokenGen\color-input.css` | 76 |`
- **audit-BEFORE.md** line 5108
  `| `--brand-secondary` | `#b9a26e` | `src\scripts\ThemeTokenGen\color-input.css` | 76 |`
- **src\scripts\ThemeTokenGen\color-input.css** line 76
  `--brand-secondary: #b9a26e; /* base: 500 - Primary */`

#### `#8ac7b2` (6 occurrences)

- **audit-BEFORE.md** line 228
  `| `#8ac7b2` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3110
  `#### `#8ac7b2` (1 occurrences)`
- **audit-BEFORE.md** line 3113
  ``--brand-accent1: #8ac7b2; /* base: 500 - Primary */``
- **audit-BEFORE.md** line 4059
  `| `--brand-accent1` | `#8ac7b2` | `src\scripts\ThemeTokenGen\color-input.css` | 77 |`
- **audit-BEFORE.md** line 5028
  `| `--brand-accent1` | `#8ac7b2` | `src\scripts\ThemeTokenGen\color-input.css` | 77 |`
- **src\scripts\ThemeTokenGen\color-input.css** line 77
  `--brand-accent1: #8ac7b2; /* base: 500 - Primary */`

#### `#c78a9f` (6 occurrences)

- **audit-BEFORE.md** line 229
  `| `#c78a9f` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3115
  `#### `#c78a9f` (1 occurrences)`
- **audit-BEFORE.md** line 3118
  ``--brand-accent2: #c78a9f; /* base: 500 - Complement */``
- **audit-BEFORE.md** line 4063
  `| `--brand-accent2` | `#c78a9f` | `src\scripts\ThemeTokenGen\color-input.css` | 78 |`
- **audit-BEFORE.md** line 5032
  `| `--brand-accent2` | `#c78a9f` | `src\scripts\ThemeTokenGen\color-input.css` | 78 |`
- **src\scripts\ThemeTokenGen\color-input.css** line 78
  `--brand-accent2: #c78a9f; /* base: 500 - Complement */`

#### `#8abdc7` (6 occurrences)

- **audit-BEFORE.md** line 230
  `| `#8abdc7` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3120
  `#### `#8abdc7` (1 occurrences)`
- **audit-BEFORE.md** line 3123
  ``--brand-accent3: #8abdc7; /* base: 500 - Analogous Right */``
- **audit-BEFORE.md** line 4067
  `| `--brand-accent3` | `#8abdc7` | `src\scripts\ThemeTokenGen\color-input.css` | 79 |`
- **audit-BEFORE.md** line 5036
  `| `--brand-accent3` | `#8abdc7` | `src\scripts\ThemeTokenGen\color-input.css` | 79 |`
- **src\scripts\ThemeTokenGen\color-input.css** line 79
  `--brand-accent3: #8abdc7; /* base: 500 - Analogous Right */`

#### `#bdc78a` (6 occurrences)

- **audit-BEFORE.md** line 231
  `| `#bdc78a` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3125
  `#### `#bdc78a` (1 occurrences)`
- **audit-BEFORE.md** line 3128
  ``--brand-accent4: #bdc78a; /* base: 500 - Tetradic 3 */``
- **audit-BEFORE.md** line 4071
  `| `--brand-accent4` | `#bdc78a` | `src\scripts\ThemeTokenGen\color-input.css` | 80 |`
- **audit-BEFORE.md** line 5040
  `| `--brand-accent4` | `#bdc78a` | `src\scripts\ThemeTokenGen\color-input.css` | 80 |`
- **src\scripts\ThemeTokenGen\color-input.css** line 80
  `--brand-accent4: #bdc78a; /* base: 500 - Tetradic 3 */`

#### `#c7948a` (6 occurrences)

- **audit-BEFORE.md** line 232
  `| `#c7948a` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3130
  `#### `#c7948a` (1 occurrences)`
- **audit-BEFORE.md** line 3133
  ``--brand-neutral: #c7948a; /* base: 50 - Split 2 */``
- **audit-BEFORE.md** line 4111
  `| `--brand-neutral` | `#c7948a` | `src\scripts\ThemeTokenGen\color-input.css` | 81 |`
- **audit-BEFORE.md** line 5098
  `| `--brand-neutral` | `#c7948a` | `src\scripts\ThemeTokenGen\color-input.css` | 81 |`
- **src\scripts\ThemeTokenGen\color-input.css** line 81
  `--brand-neutral: #c7948a; /* base: 50 - Split 2 */`

#### `#938ac7` (6 occurrences)

- **audit-BEFORE.md** line 233
  `| `#938ac7` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3135
  `#### `#938ac7` (1 occurrences)`
- **audit-BEFORE.md** line 3138
  ``--brand-accent5: #938ac7; /* base: 500 - Tetradic 1 */``
- **audit-BEFORE.md** line 4075
  `| `--brand-accent5` | `#938ac7` | `src\scripts\ThemeTokenGen\color-input.css` | 82 |`
- **audit-BEFORE.md** line 5044
  `| `--brand-accent5` | `#938ac7` | `src\scripts\ThemeTokenGen\color-input.css` | 82 |`
- **src\scripts\ThemeTokenGen\color-input.css** line 82
  `--brand-accent5: #938ac7; /* base: 500 - Tetradic 1 */`

#### `#e74c3c` (6 occurrences)

- **audit-BEFORE.md** line 238
  `| `#e74c3c` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 582
  ``<button class="generate-btn" onclick="clearAll()" style="background: #E74C3C; color: white; flex: 0.5; min-width: 150px`
- **audit-BEFORE.md** line 3160
  `#### `#e74c3c` (1 occurrences)`
- **audit-BEFORE.md** line 3163
  ``<button class="generate-btn" onclick="clearAll()" style="background: #E74C3C; color: white; flex: 0.5; min-width: 150px`
- **audit-BEFORE.md** line 4028
  ``background: #E74C3C; color: white; flex: 0.5; min-width: 150px;``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 796
  `<button class="generate-btn" onclick="clearAll()" style="background: #E74C3C; color: var(--color-White); flex: 0.5; min-`

#### `rgba(255, 255, 255, 0.12)` (6 occurrences)

- **audit-BEFORE.md** line 134
  `| `rgba(255, 255, 255, 0.12)` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2518
  `#### `rgba(255, 255, 255, 0.12)` (2 occurrences)`
- **audit-BEFORE.md** line 2521
  ``background: rgba(255, 255, 255, 0.12);``
- **audit-BEFORE.md** line 2523
  ``border: var(--border-width) solid rgba(255, 255, 255, 0.12);``
- **docs\Markdown Notes\CSS-Tokens.md** line 105
  `background: rgba(255, 255, 255, 0.12);`
- **src\styles\components\presentation\ReaderNav.css** line 760
  `border: var(--border-width) solid rgba(255, 255, 255, 0.12);`

#### `rgba(0,0,0,0.08)` (6 occurrences)

- **audit-BEFORE.md** line 142
  `| `rgba(0,0,0,0.08)` | 2 | 1 | Consider creating token |`
- **audit-BEFORE.md** line 2574
  `#### `rgba(0,0,0,0.08)` (2 occurrences)`
- **audit-BEFORE.md** line 2577
  ``- [ ] `src/styles/pages/cart.css`: `rgba(0,0,0,0.08)```
- **audit-BEFORE.md** line 2579
  ``- [ ] `src/styles/pages/cart.css`: `box-shadow: 0 2px 8px rgba(0,0,0,0.08)` → `var(--shadow-sm)```
- **docs\todo\TODO.md** line 497
  `- [ ] `src/styles/pages/cart.css`: `rgba(0,0,0,0.08)``
- **docs\todo\TODO.md** line 523
  `- [ ] `src/styles/pages/cart.css`: `box-shadow: 0 2px 8px rgba(0,0,0,0.08)` → `var(--shadow-sm)``

#### `rgba(255, 255, 255, 0.6)` (6 occurrences)

- **audit-BEFORE.md** line 148
  `| `rgba(255, 255, 255, 0.6)` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2616
  `#### `rgba(255, 255, 255, 0.6)` (2 occurrences)`
- **audit-BEFORE.md** line 2619
  ``background: rgba(255, 255, 255, 0.6);``
- **audit-BEFORE.md** line 2621
  ``color: rgba(255, 255, 255, 0.6);``
- **src\components\Checkout\DownloadSummary.astro** line 130
  `background: rgba(255, 255, 255, 0.6);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2340
  `color: rgba(255, 255, 255, 0.6);`

#### `rgba(255, 255, 255, 0.25)` (6 occurrences)

- **audit-BEFORE.md** line 149
  `| `rgba(255, 255, 255, 0.25)` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2623
  `#### `rgba(255, 255, 255, 0.25)` (2 occurrences)`
- **audit-BEFORE.md** line 2626
  ``background: rgba(255, 255, 255, 0.25);``
- **audit-BEFORE.md** line 2628
  ``border: var(--border-width) solid rgba(255, 255, 255, 0.25);``
- **src\components\Grids\RelatedGrid.astro** line 415
  `background: rgba(255, 255, 255, 0.25);`
- **src\styles\components\presentation\ReaderNav.css** line 778
  `border: var(--border-width) solid rgba(255, 255, 255, 0.25);`

#### `rgba(0, 0, 0, 0.3)` (6 occurrences)

- **audit-BEFORE.md** line 151
  `| `rgba(0, 0, 0, 0.3)` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2637
  `#### `rgba(0, 0, 0, 0.3)` (2 occurrences)`
- **audit-BEFORE.md** line 2640
  ``box-shadow: 0 20px 45px rgba(0, 0, 0, 0.3);``
- **audit-BEFORE.md** line 2642
  ``box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);``
- **src\components\Grids\RelatedGrid.astro** line 488
  `box-shadow: 0 20px 45px rgba(0, 0, 0, 0.3);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2141
  `box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);`

#### `rgba(255, 255, 255, 0.18)` (6 occurrences)

- **audit-BEFORE.md** line 152
  `| `rgba(255, 255, 255, 0.18)` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2644
  `#### `rgba(255, 255, 255, 0.18)` (2 occurrences)`
- **audit-BEFORE.md** line 2647
  ``border: 1px solid rgba(255, 255, 255, 0.18);``
- **audit-BEFORE.md** line 2649
  ``background-color: rgba(255, 255, 255, 0.18);``
- **src\components\Presentation\Sections\FullWidthSection.astro** line 72
  `border: 1px solid rgba(255, 255, 255, 0.18);`
- **src\styles\components\presentation\ReaderNav.css** line 777
  `background-color: rgba(255, 255, 255, 0.18);`

#### `rgba(255,255,255,0.9)` (6 occurrences)

- **audit-BEFORE.md** line 165
  `| `rgba(255,255,255,0.9)` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2735
  `#### `rgba(255,255,255,0.9)` (2 occurrences)`
- **audit-BEFORE.md** line 2738
  ``background: rgba(255,255,255,0.9);``
- **audit-BEFORE.md** line 2740
  ``background: rgba(255,255,255,0.9);``
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 291
  `background: rgba(255,255,255,0.9);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 650
  `background: rgba(255,255,255,0.9);`

#### `rgba(0,0,0,0.9)` (6 occurrences)

- **audit-BEFORE.md** line 171
  `| `rgba(0,0,0,0.9)` | 2 | 1 | Consider creating token |`
- **audit-BEFORE.md** line 2777
  `#### `rgba(0,0,0,0.9)` (2 occurrences)`
- **audit-BEFORE.md** line 2780
  ``background: rgba(0,0,0,0.9);``
- **audit-BEFORE.md** line 2782
  ``background: rgba(0,0,0,0.9);``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 437
  `background: rgba(0,0,0,0.9);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 574
  `background: rgba(0,0,0,0.9);`

#### `rgba(255,255,255,0.95)` (6 occurrences)

- **audit-BEFORE.md** line 172
  `| `rgba(255,255,255,0.95)` | 2 | 1 | Consider creating token |`
- **audit-BEFORE.md** line 2784
  `#### `rgba(255,255,255,0.95)` (2 occurrences)`
- **audit-BEFORE.md** line 2787
  ``background: rgba(255,255,255,0.95);``
- **audit-BEFORE.md** line 2789
  ``background: rgba(255,255,255,0.95);``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 458
  `background: rgba(255,255,255,0.95);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 565
  `background: rgba(255,255,255,0.95);`

#### `rgba(0,0,0,0.12)` (6 occurrences)

- **audit-BEFORE.md** line 173
  `| `rgba(0,0,0,0.12)` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2791
  `#### `rgba(0,0,0,0.12)` (2 occurrences)`
- **audit-BEFORE.md** line 2794
  ``box-shadow: 0 2px 8px rgba(0,0,0,0.12);``
- **audit-BEFORE.md** line 2796
  ``border: 1px solid rgba(0,0,0,0.12);``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 538
  `box-shadow: 0 2px 8px rgba(0,0,0,0.12);`
- **src\styles\themes\Preview\theme-cards.css** line 75
  `border: 1px solid rgba(0,0,0,0.12);`

#### `rgba(255, 255, 255, 0.8)` (6 occurrences)

- **audit-BEFORE.md** line 174
  `| `rgba(255, 255, 255, 0.8)` | 2 | 1 | Consider creating token |`
- **audit-BEFORE.md** line 2798
  `#### `rgba(255, 255, 255, 0.8)` (2 occurrences)`
- **audit-BEFORE.md** line 2801
  ``background: rgba(255, 255, 255, 0.8);``
- **audit-BEFORE.md** line 2803
  ``color: rgba(255, 255, 255, 0.8);``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2069
  `background: rgba(255, 255, 255, 0.8);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2230
  `color: rgba(255, 255, 255, 0.8);`

#### `rgba(255, 255, 255, 0.7)` (6 occurrences)

- **audit-BEFORE.md** line 175
  `| `rgba(255, 255, 255, 0.7)` | 2 | 1 | Consider creating token |`
- **audit-BEFORE.md** line 2805
  `#### `rgba(255, 255, 255, 0.7)` (2 occurrences)`
- **audit-BEFORE.md** line 2808
  ``color: rgba(255, 255, 255, 0.7);``
- **audit-BEFORE.md** line 2810
  ``color: rgba(255, 255, 255, 0.7);``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2254
  `color: rgba(255, 255, 255, 0.7);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2327
  `color: rgba(255, 255, 255, 0.7);`

#### `rgba(var(--a11y-cvd-accent-rgb)` (6 occurrences)

- **audit-BEFORE.md** line 176
  `| `rgba(var(--a11y-cvd-accent-rgb)` | 2 | 1 | Consider creating token |`
- **audit-BEFORE.md** line 2812
  `#### `rgba(var(--a11y-cvd-accent-rgb)` (2 occurrences)`
- **audit-BEFORE.md** line 2815
  ``background: rgba(var(--a11y-cvd-accent-rgb), 0.15) !important;``
- **audit-BEFORE.md** line 2817
  ``border: 1px solid rgba(var(--a11y-cvd-accent-rgb), 0.3) !important;``
- **src\styles\a11y\components\masonry-grid.css** line 452
  `background: rgba(var(--a11y-cvd-accent-rgb), 0.15) !important;`
- **src\styles\a11y\components\masonry-grid.css** line 454
  `border: 1px solid rgba(var(--a11y-cvd-accent-rgb), 0.3) !important;`

#### `rgba(255, 153, 200, 0.15)` (6 occurrences)

- **audit-BEFORE.md** line 375
  `| `rgba(255, 153, 200, 0.15)` | 1 | 1 | Replace with `var(--rainbow-hover-primary)` |`
- **audit-BEFORE.md** line 3845
  `#### `rgba(255, 153, 200, 0.15)` (1 occurrences)`
- **audit-BEFORE.md** line 3848
  ``--rainbow-hover-primary: rgba(255, 153, 200, 0.15);``
- **audit-BEFORE.md** line 4354
  `| `--rainbow-hover-primary` | `rgba(255, 153, 200, 0.15)` | `src\styles\tokens\gradients.css` | 49 |`
- **audit-BEFORE.md** line 6306
  `| `--rainbow-hover-primary` | `rgba(255, 153, 200, 0.15)` | `src\styles\tokens\gradients.css` | 49 |`
- **src\styles\tokens\gradients.css** line 49
  `--rainbow-hover-primary: rgba(255, 153, 200, 0.15);`

#### `rgba(174, 136, 191, 0.15)` (6 occurrences)

- **audit-BEFORE.md** line 376
  `| `rgba(174, 136, 191, 0.15)` | 1 | 1 | Replace with `var(--rainbow-hover-secondary)` |`
- **audit-BEFORE.md** line 3850
  `#### `rgba(174, 136, 191, 0.15)` (1 occurrences)`
- **audit-BEFORE.md** line 3853
  ``--rainbow-hover-secondary: rgba(174, 136, 191, 0.15);``
- **audit-BEFORE.md** line 4355
  `| `--rainbow-hover-secondary` | `rgba(174, 136, 191, 0.15)` | `src\styles\tokens\gradients.css` | 50 |`
- **audit-BEFORE.md** line 6307
  `| `--rainbow-hover-secondary` | `rgba(174, 136, 191, 0.15)` | `src\styles\tokens\gradients.css` | 50 |`
- **src\styles\tokens\gradients.css** line 50
  `--rainbow-hover-secondary: rgba(174, 136, 191, 0.15);`

#### `rgba(128, 225, 204, 0.15)` (6 occurrences)

- **audit-BEFORE.md** line 377
  `| `rgba(128, 225, 204, 0.15)` | 1 | 1 | Replace with `var(--rainbow-hover-accent)` |`
- **audit-BEFORE.md** line 3855
  `#### `rgba(128, 225, 204, 0.15)` (1 occurrences)`
- **audit-BEFORE.md** line 3858
  ``--rainbow-hover-accent: rgba(128, 225, 204, 0.15);``
- **audit-BEFORE.md** line 4352
  `| `--rainbow-hover-accent` | `rgba(128, 225, 204, 0.15)` | `src\styles\tokens\gradients.css` | 51 |`
- **audit-BEFORE.md** line 6304
  `| `--rainbow-hover-accent` | `rgba(128, 225, 204, 0.15)` | `src\styles\tokens\gradients.css` | 51 |`
- **src\styles\tokens\gradients.css** line 51
  `--rainbow-hover-accent: rgba(128, 225, 204, 0.15);`

#### `rgba(255, 248, 237, 0.8)` (6 occurrences)

- **audit-BEFORE.md** line 378
  `| `rgba(255, 248, 237, 0.8)` | 1 | 1 | Replace with `var(--rainbow-hover-cream)` |`
- **audit-BEFORE.md** line 3860
  `#### `rgba(255, 248, 237, 0.8)` (1 occurrences)`
- **audit-BEFORE.md** line 3863
  ``--rainbow-hover-cream: rgba(255, 248, 237, 0.8);``
- **audit-BEFORE.md** line 4353
  `| `--rainbow-hover-cream` | `rgba(255, 248, 237, 0.8)` | `src\styles\tokens\gradients.css` | 52 |`
- **audit-BEFORE.md** line 6305
  `| `--rainbow-hover-cream` | `rgba(255, 248, 237, 0.8)` | `src\styles\tokens\gradients.css` | 52 |`
- **src\styles\tokens\gradients.css** line 52
  `--rainbow-hover-cream: rgba(255, 248, 237, 0.8);`

#### `hsl((h + 180)` (6 occurrences)

- **audit-BEFORE.md** line 166
  `| `hsl((h + 180)` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2742
  `#### `hsl((h + 180)` (2 occurrences)`
- **audit-BEFORE.md** line 2745
  ``complementary: () => chroma.hsl((h + 180) % 360, s, l),``
- **audit-BEFORE.md** line 2747
  ``complementary: () => chroma.hsl((h + 180) % 360, s, l),``
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 23
  `complementary: () => chroma.hsl((h + 180) % 360, s, l),`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1039
  `complementary: () => chroma.hsl((h + 180) % 360, s, l),`

#### `hsl((h + offset + 360)` (6 occurrences)

- **audit-BEFORE.md** line 167
  `| `hsl((h + offset + 360)` | 2 | 2 | Consider creating token |`
- **audit-BEFORE.md** line 2749
  `#### `hsl((h + offset + 360)` (2 occurrences)`
- **audit-BEFORE.md** line 2752
  ``return chroma.hsl((h + offset + 360) % 360, s, l);``
- **audit-BEFORE.md** line 2754
  ``return chroma.hsl((h + offset + 360) % 360, s, l);``
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 26
  `return chroma.hsl((h + offset + 360) % 360, s, l);`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1042
  `return chroma.hsl((h + offset + 360) % 360, s, l);`

#### `hsl(215, 0.4 * satadjust, 0.92 * lightadjust)` (6 occurrences)

- **audit-BEFORE.md** line 287
  `| `hsl(215, 0.4 * satadjust, 0.92 * lightadjust)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3405
  `#### `hsl(215, 0.4 * satadjust, 0.92 * lightadjust)` (1 occurrences)`
- **audit-BEFORE.md** line 3408
  ``css += `  --color-Info-100: ${toOKLCH(chroma.hsl(215, 0.4 * satAdjust, 0.92 * lightAdjust).hex())};\n`;``
- **audit-BEFORE.md** line 4178
  `| `--color-Info-100` | `${toOKLCH(chroma.hsl(215, 0.4 * satAdjust, 0.92 * lightAdjust).hex())` | `src\scripts\ThemeToken`
- **audit-BEFORE.md** line 5648
  `| `--color-Info-100` | `${toOKLCH(chroma.hsl(215, 0.4 * satAdjust, 0.92 * lightAdjust).hex())` | `src\scripts\ThemeToken`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1941
  `css += `  --color-Info-100: ${toOKLCH(chroma.hsl(215, 0.4 * satAdjust, 0.92 * lightAdjust).hex())};\n`;`

#### `hsl(215, 0.6 * satadjust, 0.80 * lightadjust)` (6 occurrences)

- **audit-BEFORE.md** line 288
  `| `hsl(215, 0.6 * satadjust, 0.80 * lightadjust)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3410
  `#### `hsl(215, 0.6 * satadjust, 0.80 * lightadjust)` (1 occurrences)`
- **audit-BEFORE.md** line 3413
  ``css += `  --color-Info-200: ${toOKLCH(chroma.hsl(215, 0.6 * satAdjust, 0.80 * lightAdjust).hex())};\n`;``
- **audit-BEFORE.md** line 4179
  `| `--color-Info-200` | `${toOKLCH(chroma.hsl(215, 0.6 * satAdjust, 0.80 * lightAdjust).hex())` | `src\scripts\ThemeToken`
- **audit-BEFORE.md** line 5649
  `| `--color-Info-200` | `${toOKLCH(chroma.hsl(215, 0.6 * satAdjust, 0.80 * lightAdjust).hex())` | `src\scripts\ThemeToken`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1942
  `css += `  --color-Info-200: ${toOKLCH(chroma.hsl(215, 0.6 * satAdjust, 0.80 * lightAdjust).hex())};\n`;`

#### `red` (6 occurrences)

- **audit-BEFORE.md** line 1786
  ``--color-Error      /* #f44336 - red */``
- **audit-BEFORE.md** line 1788
  ``outline: 3px solid red !important;``
- **audit-BEFORE.md** line 2507
  ``--color-Error      /* #f44336 - red */``
- **docs\Brand\BRAND-PROFILE.json** line 270
  `"dont": "Avoid bright, aggressive colors that might trigger anxiety. Don't use high-contrast or neon shades. Avoid pure `
- **docs\Markdown Notes\CSS-Tokens.md** line 94
  `--color-Error      /* #f44336 - red */`
- **src\styles\a11y\base\screen-reader.css** line 81
  `outline: 3px solid red !important;`

#### `gold` (6 occurrences)

- **audit-BEFORE.md** line 2413
  ``background: var(--confetti-gold, #e9bc88);``
- **audit-BEFORE.md** line 2418
  ``colors.push({ color: '#D4B98C', theory: 'Metallic Gold' });``
- **audit-BEFORE.md** line 2454
  ``colors.push({ color: '#D4B98C', theory: 'Metallic Gold' });``
- **audit-BEFORE.md** line 2456
  ``background: var(--confetti-gold, #e9bc88);``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1127
  `colors.push({ color: '#D4B98C', theory: 'Metallic Gold' });`
- **src\styles\buttons\confetti-button.css** line 21
  `background: var(--confetti-gold, #e9bc88);`

#### `#ff6600` (5 occurrences)

- **audit-BEFORE.md** line 202
  `| `#ff6600` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 2980
  `#### `#ff6600` (1 occurrences)`
- **audit-BEFORE.md** line 2983
  ``--brand-c-neutral: #ff6600;``
- **audit-BEFORE.md** line 5251
  `| `--brand-c-neutral` | `#ff6600` | `docs\Markdown Notes\accessibility-color-themes.md` | 232 |`
- **docs\Markdown Notes\accessibility-color-themes.md** line 232
  `--brand-c-neutral: #ff6600;`

#### `#ff00ff` (5 occurrences)

- **audit-BEFORE.md** line 203
  `| `#ff00ff` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 2985
  `#### `#ff00ff` (1 occurrences)`
- **audit-BEFORE.md** line 2988
  ``--brand-c-neutral: #ff00ff;``
- **audit-BEFORE.md** line 5180
  `| `--brand-c-neutral` | `#ff00ff` | `docs\Markdown Notes\accessibility-color-themes.md` | 233 |`
- **docs\Markdown Notes\accessibility-color-themes.md** line 233
  `--brand-c-neutral: #ff00ff;`

#### `#c17c5a` (5 occurrences)

- **audit-BEFORE.md** line 204
  `| `#c17c5a` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 2528
  ``- Text: Consider terracotta (#C17C5A) or dark text on cream background (#EEEBE2)``
- **audit-BEFORE.md** line 2990
  `#### `#c17c5a` (1 occurrences)`
- **audit-BEFORE.md** line 2993
  ``- Text: Consider terracotta (#C17C5A) or dark text on cream background (#EEEBE2)``
- **docs\Markdown Notes\new hero.md** line 51
  `- Text: Consider terracotta (#C17C5A) or dark text on cream background (#EEEBE2)`

#### `#040913` (5 occurrences)

- **audit-BEFORE.md** line 205
  `| `#040913` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 2995
  `#### `#040913` (1 occurrences)`
- **audit-BEFORE.md** line 2998
  ``--a11y-dark-c-bg: #040913;``
- **audit-BEFORE.md** line 4939
  `| `--a11y-dark-c-bg` | `#040913` | `docs\Markdown Notes\Theme-Preview-System.md` | 32 |`
- **docs\Markdown Notes\Theme-Preview-System.md** line 32
  `--a11y-dark-c-bg: #040913;`

#### `#962587` (5 occurrences)

- **audit-BEFORE.md** line 206
  `| `#962587` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3000
  `#### `#962587` (1 occurrences)`
- **audit-BEFORE.md** line 3003
  ``--a11y-dark-c-primary: #962587;``
- **audit-BEFORE.md** line 4943
  `| `--a11y-dark-c-primary` | `#962587` | `docs\Markdown Notes\Theme-Preview-System.md` | 34 |`
- **docs\Markdown Notes\Theme-Preview-System.md** line 34
  `--a11y-dark-c-primary: #962587;`

#### `#86a182` (5 occurrences)

- **audit-BEFORE.md** line 226
  `| `#86a182` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3100
  `#### `#86a182` (1 occurrences)`
- **audit-BEFORE.md** line 3103
  ``--brand-primary: #86a182; /* base: 500 - Primary */``
- **audit-BEFORE.md** line 5103
  `| `--brand-primary` | `#86a182` | `src\scripts\ThemeTokenGen\color-input.css` | 75 |`
- **src\scripts\ThemeTokenGen\color-input.css** line 75
  `--brand-primary: #86a182; /* base: 500 - Primary */`

#### `#181818` (5 occurrences)

- **audit-BEFORE.md** line 237
  `| `#181818` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3155
  `#### `#181818` (1 occurrences)`
- **audit-BEFORE.md** line 3158
  ``--brand-c-text-dark: #181818;``
- **audit-BEFORE.md** line 6014
  `| `--brand-c-text-dark` | `#181818` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 16 |`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 16
  `--brand-c-text-dark: #181818;`

#### `#c0c0c0` (5 occurrences)

- **audit-BEFORE.md** line 239
  `| `#c0c0c0` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3165
  `#### `#c0c0c0` (1 occurrences)`
- **audit-BEFORE.md** line 3168
  ``colors.push({ color: '#C0C0C0', theory: 'Metallic Silver' });``
- **audit-BEFORE.md** line 3423
  ``colors.push({ color: '#C0C0C0', theory: 'Metallic Silver' });``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1128
  `colors.push({ color: '#C0C0C0', theory: 'Metallic Silver' });`

#### `#ede7de` (5 occurrences)

- **audit-BEFORE.md** line 253
  `| `#ede7de` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3235
  `#### `#ede7de` (1 occurrences)`
- **audit-BEFORE.md** line 3238
  ``palette.push(chroma.hsl(neutralHue, neutralSat, neutralLight).hex()); // #ede7de range``
- **audit-BEFORE.md** line 3313
  ``palette.push(chroma.hsl(neutralHue, neutralSat, neutralLight).hex()); // #ede7de range``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1324
  `palette.push(chroma.hsl(neutralHue, neutralSat, neutralLight).hex()); // #ede7de range`

#### `#000` (5 occurrences)

- **audit-BEFORE.md** line 293
  `| `#000` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 1707
  ``const textColor = luminance > 0.5 ? '#000' : '#fff';``
- **audit-BEFORE.md** line 3435
  `#### `#000` (1 occurrences)`
- **audit-BEFORE.md** line 3438
  ``const textColor = luminance > 0.5 ? '#000' : '#fff';``
- **src\scripts\ThemeTokenGen\preview-colors.js** line 143
  `const textColor = luminance > 0.5 ? '#000' : '#fff';`

#### `#1e1e1e` (5 occurrences)

- **audit-BEFORE.md** line 316
  `| `#1e1e1e` | 1 | 1 | Replace with `var(--a11y-dark-c-surface)` |`
- **audit-BEFORE.md** line 3550
  `#### `#1e1e1e` (1 occurrences)`
- **audit-BEFORE.md** line 3553
  ``--a11y-dark-c-surface: #1e1e1e;``
- **audit-BEFORE.md** line 4946
  `| `--a11y-dark-c-surface` | `#1e1e1e` | `src\styles\themes\a11y\a11y-dark.css` | 15 |`
- **src\styles\themes\a11y\a11y-dark.css** line 26
  `--a11y-dark-c-surface: #1e1e1e;`

#### `#2a2a2a` (5 occurrences)

- **audit-BEFORE.md** line 317
  `| `#2a2a2a` | 1 | 1 | Replace with `var(--a11y-dark-c-surface-raised)` |`
- **audit-BEFORE.md** line 3555
  `#### `#2a2a2a` (1 occurrences)`
- **audit-BEFORE.md** line 3558
  ``--a11y-dark-c-surface-raised: #2a2a2a;``
- **audit-BEFORE.md** line 4947
  `| `--a11y-dark-c-surface-raised` | `#2a2a2a` | `src\styles\themes\a11y\a11y-dark.css` | 16 |`
- **src\styles\themes\a11y\a11y-dark.css** line 27
  `--a11y-dark-c-surface-raised: #2a2a2a;`

#### `#3a3a3a` (5 occurrences)

- **audit-BEFORE.md** line 318
  `| `#3a3a3a` | 1 | 1 | Replace with `var(--a11y-dark-c-border)` |`
- **audit-BEFORE.md** line 3560
  `#### `#3a3a3a` (1 occurrences)`
- **audit-BEFORE.md** line 3563
  ``--a11y-dark-c-border: #3a3a3a;``
- **audit-BEFORE.md** line 4942
  `| `--a11y-dark-c-border` | `#3a3a3a` | `src\styles\themes\a11y\a11y-dark.css` | 17 |`
- **src\styles\themes\a11y\a11y-dark.css** line 28
  `--a11y-dark-c-border: #3a3a3a;`

#### `#949494` (5 occurrences)

- **audit-BEFORE.md** line 337
  `| `#949494` | 1 | 1 | Replace with `var(--brand-c-text-light)` |`
- **audit-BEFORE.md** line 3655
  `#### `#949494` (1 occurrences)`
- **audit-BEFORE.md** line 3658
  ``--brand-c-text-light: #949494;``
- **audit-BEFORE.md** line 5975
  `| `--brand-c-text-light` | `#949494` | `src\styles\themes\brand\BrandDefault.css` | 52 |`
- **audit-BEFORE.md** line 6527
  `| `#949494` | 74 | candidate-14 |`

#### `rgba(196,144,124,0.15)` (5 occurrences)

- **audit-BEFORE.md** line 214
  `| `rgba(196,144,124,0.15)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3040
  `#### `rgba(196,144,124,0.15)` (1 occurrences)`
- **audit-BEFORE.md** line 3043
  ``background: linear-gradient(135deg, rgba(196,144,124,0.15) 0%, rgba(196,144,124,0.08) 100%);``
- **audit-BEFORE.md** line 3048
  ``background: linear-gradient(135deg, rgba(196,144,124,0.15) 0%, rgba(196,144,124,0.08) 100%);``
- **src\lib\emailit.ts** line 287
  `background: linear-gradient(135deg, rgba(196,144,124,0.15) 0%, rgba(196,144,124,0.08) 100%);`

#### `rgba(196,144,124,0.08)` (5 occurrences)

- **audit-BEFORE.md** line 215
  `| `rgba(196,144,124,0.08)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3043
  ``background: linear-gradient(135deg, rgba(196,144,124,0.15) 0%, rgba(196,144,124,0.08) 100%);``
- **audit-BEFORE.md** line 3045
  `#### `rgba(196,144,124,0.08)` (1 occurrences)`
- **audit-BEFORE.md** line 3048
  ``background: linear-gradient(135deg, rgba(196,144,124,0.15) 0%, rgba(196,144,124,0.08) 100%);``
- **src\lib\emailit.ts** line 287
  `background: linear-gradient(135deg, rgba(196,144,124,0.15) 0%, rgba(196,144,124,0.08) 100%);`

#### `rgba(31, 38, 135, 0.37)` (5 occurrences)

- **audit-BEFORE.md** line 379
  `| `rgba(31, 38, 135, 0.37)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3865
  `#### `rgba(31, 38, 135, 0.37)` (1 occurrences)`
- **audit-BEFORE.md** line 3868
  ``--glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);``
- **audit-BEFORE.md** line 6113
  `| `--glass-shadow` | `0 8px 32px 0 rgba(31, 38, 135, 0.37)` | `src\styles\tokens\shadows.css` | 82 |`
- **src\styles\tokens\shadows.css** line 82
  `--glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);`

#### `hsl(neutralhue, neutralsat, neutrallight)` (5 occurrences)

- **audit-BEFORE.md** line 268
  `| `hsl(neutralhue, neutralsat, neutrallight)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3238
  ``palette.push(chroma.hsl(neutralHue, neutralSat, neutralLight).hex()); // #ede7de range``
- **audit-BEFORE.md** line 3310
  `#### `hsl(neutralhue, neutralsat, neutrallight)` (1 occurrences)`
- **audit-BEFORE.md** line 3313
  ``palette.push(chroma.hsl(neutralHue, neutralSat, neutralLight).hex()); // #ede7de range``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1324
  `palette.push(chroma.hsl(neutralHue, neutralSat, neutralLight).hex()); // #ede7de range`

#### `hsl(145, 0.3 * satadjust, 0.92 * lightadjust)` (5 occurrences)

- **audit-BEFORE.md** line 278
  `| `hsl(145, 0.3 * satadjust, 0.92 * lightadjust)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3360
  `#### `hsl(145, 0.3 * satadjust, 0.92 * lightadjust)` (1 occurrences)`
- **audit-BEFORE.md** line 3363
  ``css += `  --color-Success-100: ${toOKLCH(chroma.hsl(145, 0.3 * satAdjust, 0.92 * lightAdjust).hex())};\n`;``
- **audit-BEFORE.md** line 5927
  `| `--color-Success-100` | `${toOKLCH(chroma.hsl(145, 0.3 * satAdjust, 0.92 * lightAdjust).hex())` | `src\scripts\ThemeTo`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1926
  `css += `  --color-Success-100: ${toOKLCH(chroma.hsl(145, 0.3 * satAdjust, 0.92 * lightAdjust).hex())};\n`;`

#### `hsl(145, 0.5 * satadjust, 0.80 * lightadjust)` (5 occurrences)

- **audit-BEFORE.md** line 279
  `| `hsl(145, 0.5 * satadjust, 0.80 * lightadjust)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3365
  `#### `hsl(145, 0.5 * satadjust, 0.80 * lightadjust)` (1 occurrences)`
- **audit-BEFORE.md** line 3368
  ``css += `  --color-Success-200: ${toOKLCH(chroma.hsl(145, 0.5 * satAdjust, 0.80 * lightAdjust).hex())};\n`;``
- **audit-BEFORE.md** line 5928
  `| `--color-Success-200` | `${toOKLCH(chroma.hsl(145, 0.5 * satAdjust, 0.80 * lightAdjust).hex())` | `src\scripts\ThemeTo`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1927
  `css += `  --color-Success-200: ${toOKLCH(chroma.hsl(145, 0.5 * satAdjust, 0.80 * lightAdjust).hex())};\n`;`

#### `hsl(145, 0.6 * satadjust, 0.50 * lightadjust)` (5 occurrences)

- **audit-BEFORE.md** line 280
  `| `hsl(145, 0.6 * satadjust, 0.50 * lightadjust)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3370
  `#### `hsl(145, 0.6 * satadjust, 0.50 * lightadjust)` (1 occurrences)`
- **audit-BEFORE.md** line 3373
  ``css += `  --color-Success-500: ${toOKLCH(chroma.hsl(145, 0.6 * satAdjust, 0.50 * lightAdjust).hex())};\n`;``
- **audit-BEFORE.md** line 5929
  `| `--color-Success-500` | `${toOKLCH(chroma.hsl(145, 0.6 * satAdjust, 0.50 * lightAdjust).hex())` | `src\scripts\ThemeTo`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1928
  `css += `  --color-Success-500: ${toOKLCH(chroma.hsl(145, 0.6 * satAdjust, 0.50 * lightAdjust).hex())};\n`;`

#### `hsl(45, 0.4 * satadjust, 0.92 * lightadjust)` (5 occurrences)

- **audit-BEFORE.md** line 281
  `| `hsl(45, 0.4 * satadjust, 0.92 * lightadjust)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3375
  `#### `hsl(45, 0.4 * satadjust, 0.92 * lightadjust)` (1 occurrences)`
- **audit-BEFORE.md** line 3378
  ``css += `  --color-Warning-100: ${toOKLCH(chroma.hsl(45, 0.4 * satAdjust, 0.92 * lightAdjust).hex())};\n`;``
- **audit-BEFORE.md** line 6042
  `| `--color-Warning-100` | `${toOKLCH(chroma.hsl(45, 0.4 * satAdjust, 0.92 * lightAdjust).hex())` | `src\scripts\ThemeTok`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1931
  `css += `  --color-Warning-100: ${toOKLCH(chroma.hsl(45, 0.4 * satAdjust, 0.92 * lightAdjust).hex())};\n`;`

#### `hsl(45, 0.6 * satadjust, 0.80 * lightadjust)` (5 occurrences)

- **audit-BEFORE.md** line 282
  `| `hsl(45, 0.6 * satadjust, 0.80 * lightadjust)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3380
  `#### `hsl(45, 0.6 * satadjust, 0.80 * lightadjust)` (1 occurrences)`
- **audit-BEFORE.md** line 3383
  ``css += `  --color-Warning-200: ${toOKLCH(chroma.hsl(45, 0.6 * satAdjust, 0.80 * lightAdjust).hex())};\n`;``
- **audit-BEFORE.md** line 6043
  `| `--color-Warning-200` | `${toOKLCH(chroma.hsl(45, 0.6 * satAdjust, 0.80 * lightAdjust).hex())` | `src\scripts\ThemeTok`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1932
  `css += `  --color-Warning-200: ${toOKLCH(chroma.hsl(45, 0.6 * satAdjust, 0.80 * lightAdjust).hex())};\n`;`

#### `hsl(45, 0.8 * satadjust, 0.60 * lightadjust)` (5 occurrences)

- **audit-BEFORE.md** line 283
  `| `hsl(45, 0.8 * satadjust, 0.60 * lightadjust)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3385
  `#### `hsl(45, 0.8 * satadjust, 0.60 * lightadjust)` (1 occurrences)`
- **audit-BEFORE.md** line 3388
  ``css += `  --color-Warning-500: ${toOKLCH(chroma.hsl(45, 0.8 * satAdjust, 0.60 * lightAdjust).hex())};\n`;``
- **audit-BEFORE.md** line 6044
  `| `--color-Warning-500` | `${toOKLCH(chroma.hsl(45, 0.8 * satAdjust, 0.60 * lightAdjust).hex())` | `src\scripts\ThemeTok`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1933
  `css += `  --color-Warning-500: ${toOKLCH(chroma.hsl(45, 0.8 * satAdjust, 0.60 * lightAdjust).hex())};\n`;`

#### `hsl(15, 0.4 * satadjust, 0.92 * lightadjust)` (5 occurrences)

- **audit-BEFORE.md** line 284
  `| `hsl(15, 0.4 * satadjust, 0.92 * lightadjust)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3390
  `#### `hsl(15, 0.4 * satadjust, 0.92 * lightadjust)` (1 occurrences)`
- **audit-BEFORE.md** line 3393
  ``css += `  --color-Error-100: ${toOKLCH(chroma.hsl(15, 0.4 * satAdjust, 0.92 * lightAdjust).hex())};\n`;``
- **audit-BEFORE.md** line 5637
  `| `--color-Error-100` | `${toOKLCH(chroma.hsl(15, 0.4 * satAdjust, 0.92 * lightAdjust).hex())` | `src\scripts\ThemeToken`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1936
  `css += `  --color-Error-100: ${toOKLCH(chroma.hsl(15, 0.4 * satAdjust, 0.92 * lightAdjust).hex())};\n`;`

#### `hsl(15, 0.6 * satadjust, 0.80 * lightadjust)` (5 occurrences)

- **audit-BEFORE.md** line 285
  `| `hsl(15, 0.6 * satadjust, 0.80 * lightadjust)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3395
  `#### `hsl(15, 0.6 * satadjust, 0.80 * lightadjust)` (1 occurrences)`
- **audit-BEFORE.md** line 3398
  ``css += `  --color-Error-200: ${toOKLCH(chroma.hsl(15, 0.6 * satAdjust, 0.80 * lightAdjust).hex())};\n`;``
- **audit-BEFORE.md** line 5638
  `| `--color-Error-200` | `${toOKLCH(chroma.hsl(15, 0.6 * satAdjust, 0.80 * lightAdjust).hex())` | `src\scripts\ThemeToken`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1937
  `css += `  --color-Error-200: ${toOKLCH(chroma.hsl(15, 0.6 * satAdjust, 0.80 * lightAdjust).hex())};\n`;`

#### `hsl(15, 0.8 * satadjust, 0.55 * lightadjust)` (5 occurrences)

- **audit-BEFORE.md** line 286
  `| `hsl(15, 0.8 * satadjust, 0.55 * lightadjust)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3400
  `#### `hsl(15, 0.8 * satadjust, 0.55 * lightadjust)` (1 occurrences)`
- **audit-BEFORE.md** line 3403
  ``css += `  --color-Error-500: ${toOKLCH(chroma.hsl(15, 0.8 * satAdjust, 0.55 * lightAdjust).hex())};\n`;``
- **audit-BEFORE.md** line 5639
  `| `--color-Error-500` | `${toOKLCH(chroma.hsl(15, 0.8 * satAdjust, 0.55 * lightAdjust).hex())` | `src\scripts\ThemeToken`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1938
  `css += `  --color-Error-500: ${toOKLCH(chroma.hsl(15, 0.8 * satAdjust, 0.55 * lightAdjust).hex())};\n`;`

#### `hsl(215, 0.7 * satadjust, 0.55 * lightadjust)` (5 occurrences)

- **audit-BEFORE.md** line 289
  `| `hsl(215, 0.7 * satadjust, 0.55 * lightadjust)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3415
  `#### `hsl(215, 0.7 * satadjust, 0.55 * lightadjust)` (1 occurrences)`
- **audit-BEFORE.md** line 3418
  ``css += `  --color-Info-500: ${toOKLCH(chroma.hsl(215, 0.7 * satAdjust, 0.55 * lightAdjust).hex())};\n`;``
- **audit-BEFORE.md** line 5650
  `| `--color-Info-500` | `${toOKLCH(chroma.hsl(215, 0.7 * satAdjust, 0.55 * lightAdjust).hex())` | `src\scripts\ThemeToken`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1943
  `css += `  --color-Info-500: ${toOKLCH(chroma.hsl(215, 0.7 * satAdjust, 0.55 * lightAdjust).hex())};\n`;`

#### `blue` (5 occurrences)

- **audit-BEFORE.md** line 1675
  ``"colorName": "Soft Blue",``
- **audit-BEFORE.md** line 1681
  ``--color-Info       /* #2196f3 - blue */``
- **audit-BEFORE.md** line 2514
  ``--color-Info       /* #2196f3 - blue */``
- **docs\Brand\BRAND-PROFILE.json** line 69
  `"colorName": "Soft Blue",`
- **docs\Markdown Notes\CSS-Tokens.md** line 96
  `--color-Info       /* #2196f3 - blue */`

#### `#fffbf2` (4 occurrences)

- **audit-BEFORE.md** line 195
  `| `#fffbf2` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 2945
  `#### `#fffbf2` (1 occurrences)`
- **audit-BEFORE.md** line 2948
  ``"surface": "#fffbf2",``
- **docs\Brand\BRAND-PROFILE.json** line 109
  `"surface": "#fffbf2",`

#### `#f9fafb` (4 occurrences)

- **audit-BEFORE.md** line 197
  `| `#f9fafb` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 2955
  `#### `#f9fafb` (1 occurrences)`
- **audit-BEFORE.md** line 2958
  ``"surface": { "type": "string", "description": "Card/panel background hex", "example": "#F9FAFB" },``
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 170
  `"surface": { "type": "string", "description": "Card/panel background hex", "example": "#F9FAFB" },`

#### `#0052cc` (4 occurrences)

- **audit-BEFORE.md** line 198
  `| `#0052cc` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 2960
  `#### `#0052cc` (1 occurrences)`
- **audit-BEFORE.md** line 2963
  ``"linkHover": { "type": "string", "example": "#0052CC" },``
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 174
  `"linkHover": { "type": "string", "example": "#0052CC" },`

#### `#e5e7eb` (4 occurrences)

- **audit-BEFORE.md** line 199
  `| `#e5e7eb` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 2965
  `#### `#e5e7eb` (1 occurrences)`
- **audit-BEFORE.md** line 2968
  ``"border": { "type": "string", "example": "#E5E7EB" },``
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 175
  `"border": { "type": "string", "example": "#E5E7EB" },`

#### `#8b5cf6` (4 occurrences)

- **audit-BEFORE.md** line 200
  `| `#8b5cf6` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 2970
  `#### `#8b5cf6` (1 occurrences)`
- **audit-BEFORE.md** line 2973
  ``"accent2": { "type": "string", "example": "#8B5CF6" },``
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 177
  `"accent2": { "type": "string", "example": "#8B5CF6" },`

#### `#374151` (4 occurrences)

- **audit-BEFORE.md** line 201
  `| `#374151` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 2975
  `#### `#374151` (1 occurrences)`
- **audit-BEFORE.md** line 2978
  ``"bodyColor": { "type": "string", "example": "#374151" }``
- **docs\Brand\COMPLETE-BRAND-SCHEMA.md** line 223
  `"bodyColor": { "type": "string", "example": "#374151" }`

#### `#8b6b5a` (4 occurrences)

- **audit-BEFORE.md** line 212
  `| `#8b6b5a` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3030
  `#### `#8b6b5a` (1 occurrences)`
- **audit-BEFORE.md** line 3033
  ``color: #8b6b5a;``
- **src\lib\emailit.ts** line 292
  `color: #8b6b5a;`

#### `#7a5c4d` (4 occurrences)

- **audit-BEFORE.md** line 213
  `| `#7a5c4d` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3035
  `#### `#7a5c4d` (1 occurrences)`
- **audit-BEFORE.md** line 3038
  ``color: #7a5c4d;``
- **src\lib\emailit.ts** line 297
  `color: #7a5c4d;`

#### `#222` (4 occurrences)

- **audit-BEFORE.md** line 234
  `| `#222` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3140
  `#### `#222` (1 occurrences)`
- **audit-BEFORE.md** line 3143
  ``color: #222;``
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 211
  `color: #222;`

#### `#f9f9f9` (4 occurrences)

- **audit-BEFORE.md** line 235
  `| `#f9f9f9` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3145
  `#### `#f9f9f9` (1 occurrences)`
- **audit-BEFORE.md** line 3148
  ``background: #f9f9f9;``
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 226
  `background: #f9f9f9;`

#### `#444` (4 occurrences)

- **audit-BEFORE.md** line 236
  `| `#444` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3150
  `#### `#444` (1 occurrences)`
- **audit-BEFORE.md** line 3153
  ``color: #444;``
- **src\scripts\ThemeTokenGen\color-theory-comparison.js** line 274
  `color: #444;`

#### `#b8a89d` (4 occurrences)

- **audit-BEFORE.md** line 240
  `| `#b8a89d` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3170
  `#### `#b8a89d` (1 occurrences)`
- **audit-BEFORE.md** line 3173
  ``secondary: '#B8A89D'     // Warm taupe``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1215
  `secondary: '#B8A89D'     // Warm taupe`

#### `#f7a072` (4 occurrences)

- **audit-BEFORE.md** line 241
  `| `#f7a072` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3175
  `#### `#f7a072` (1 occurrences)`
- **audit-BEFORE.md** line 3178
  ``primary: '#F7A072',      // Coral``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1218
  `primary: '#F7A072',      // Coral`

#### `#ffd966` (4 occurrences)

- **audit-BEFORE.md** line 242
  `| `#ffd966` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3180
  `#### `#ffd966` (1 occurrences)`
- **audit-BEFORE.md** line 3183
  ``secondary: '#FFD966'     // Sunny yellow``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1219
  `secondary: '#FFD966'     // Sunny yellow`

#### `#7a8b99` (4 occurrences)

- **audit-BEFORE.md** line 243
  `| `#7a8b99` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3185
  `#### `#7a8b99` (1 occurrences)`
- **audit-BEFORE.md** line 3188
  ``primary: '#7A8B99',      // Muted blue-grey``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1222
  `primary: '#7A8B99',      // Muted blue-grey`

#### `#c9b8a8` (4 occurrences)

- **audit-BEFORE.md** line 244
  `| `#c9b8a8` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3190
  `#### `#c9b8a8` (1 occurrences)`
- **audit-BEFORE.md** line 3193
  ``secondary: '#C9B8A8'     // Soft beige``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1223
  `secondary: '#C9B8A8'     // Soft beige`

#### `#ff6b6b` (4 occurrences)

- **audit-BEFORE.md** line 245
  `| `#ff6b6b` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3195
  `#### `#ff6b6b` (1 occurrences)`
- **audit-BEFORE.md** line 3198
  ``primary: '#FF6B6B',      // Vibrant red``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1226
  `primary: '#FF6B6B',      // Vibrant red`

#### `#4ecdc4` (4 occurrences)

- **audit-BEFORE.md** line 246
  `| `#4ecdc4` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3200
  `#### `#4ecdc4` (1 occurrences)`
- **audit-BEFORE.md** line 3203
  ``secondary: '#4ECDC4'     // Turquoise``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1227
  `secondary: '#4ECDC4'     // Turquoise`

#### `#2c3e50` (4 occurrences)

- **audit-BEFORE.md** line 247
  `| `#2c3e50` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3205
  `#### `#2c3e50` (1 occurrences)`
- **audit-BEFORE.md** line 3208
  ``primary: '#2C3E50',      // Deep navy``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1230
  `primary: '#2C3E50',      // Deep navy`

#### `#d4af37` (4 occurrences)

- **audit-BEFORE.md** line 248
  `| `#d4af37` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3210
  `#### `#d4af37` (1 occurrences)`
- **audit-BEFORE.md** line 3213
  ``secondary: '#D4AF37'     // Gold``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1231
  `secondary: '#D4AF37'     // Gold`

#### `#a0826d` (4 occurrences)

- **audit-BEFORE.md** line 249
  `| `#a0826d` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3215
  `#### `#a0826d` (1 occurrences)`
- **audit-BEFORE.md** line 3218
  ``primary: '#A0826D',      // Terracotta``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1234
  `primary: '#A0826D',      // Terracotta`

#### `#7d9d7c` (4 occurrences)

- **audit-BEFORE.md** line 250
  `| `#7d9d7c` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3220
  `#### `#7d9d7c` (1 occurrences)`
- **audit-BEFORE.md** line 3223
  ``secondary: '#7D9D7C'     // Sage``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1235
  `secondary: '#7D9D7C'     // Sage`

#### `#5d6d7e` (4 occurrences)

- **audit-BEFORE.md** line 251
  `| `#5d6d7e` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3225
  `#### `#5d6d7e` (1 occurrences)`
- **audit-BEFORE.md** line 3228
  ``primary: '#5D6D7E',      // Cool grey``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1238
  `primary: '#5D6D7E',      // Cool grey`

#### `#85929e` (4 occurrences)

- **audit-BEFORE.md** line 252
  `| `#85929e` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3230
  `#### `#85929e` (1 occurrences)`
- **audit-BEFORE.md** line 3233
  ``secondary: '#85929E'     // Light grey``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1239
  `secondary: '#85929E'     // Light grey`

#### `#48839e` (4 occurrences)

- **audit-BEFORE.md** line 254
  `| `#48839e` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3240
  `#### `#48839e` (1 occurrences)`
- **audit-BEFORE.md** line 3243
  ``const primaryBase = state.generatedScales['primary'] ? state.generatedScales['primary']['500'] : '#48839e';``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1916
  `const primaryBase = state.generatedScales['primary'] ? state.generatedScales['primary']['500'] : '#48839e';`

#### `#e3f2fd` (4 occurrences)

- **audit-BEFORE.md** line 291
  `| `#e3f2fd` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3425
  `#### `#e3f2fd` (1 occurrences)`
- **audit-BEFORE.md** line 3428
  ``background: #e3f2fd;``
- **src\scripts\ThemeTokenGen\preview-colors.js** line 109
  `background: #e3f2fd;`

#### `#1976d2` (4 occurrences)

- **audit-BEFORE.md** line 292
  `| `#1976d2` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3430
  `#### `#1976d2` (1 occurrences)`
- **audit-BEFORE.md** line 3433
  ``color: #1976d2;``
- **src\scripts\ThemeTokenGen\preview-colors.js** line 116
  `color: #1976d2;`

#### `#cccccc` (4 occurrences)

- **audit-BEFORE.md** line 296
  `| `#cccccc` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3450
  `#### `#cccccc` (1 occurrences)`
- **audit-BEFORE.md** line 3453
  ``color: #cccccc !important;``
- **src\styles\a11y\pages\asset-detail.css** line 274
  `color: #cccccc !important;`

#### `#7a6b54` (4 occurrences)

- **audit-BEFORE.md** line 297
  `| `#7a6b54` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3455
  `#### `#7a6b54` (1 occurrences)`
- **audit-BEFORE.md** line 3458
  ``color: #7a6b54 !important;``
- **src\styles\a11y\pages\asset-detail.css** line 294
  `color: #7a6b54 !important;`

#### `#f1f5f9` (4 occurrences)

- **audit-BEFORE.md** line 298
  `| `#f1f5f9` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3460
  `#### `#f1f5f9` (1 occurrences)`
- **audit-BEFORE.md** line 3463
  ``color: var(--a11y-dark-text, #f1f5f9) !important;``
- **src\styles\a11y\pages\asset-detail.css** line 339
  `color: var(--a11y-dark-text, #f1f5f9) !important;`

#### `#ccc` (4 occurrences)

- **audit-BEFORE.md** line 299
  `| `#ccc` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3465
  `#### `#ccc` (1 occurrences)`
- **audit-BEFORE.md** line 3468
  ``border: 2px solid var(--brand-c-neutral, #ccc) !important;``
- **src\styles\a11y\visual\text-only.css** line 1990
  `border: 2px solid var(--brand-c-neutral, #ccc) !important;`

#### `#0a0a0a` (4 occurrences)

- **audit-BEFORE.md** line 300
  `| `#0a0a0a` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3470
  `#### `#0a0a0a` (1 occurrences)`
- **audit-BEFORE.md** line 3473
  ``background: var(--brand-c-bg-dark, #0a0a0a);``
- **src\styles\base\utilities.css** line 402
  `background: var(--brand-c-bg-dark, #0a0a0a);`

#### `#fecaca` (4 occurrences)

- **audit-BEFORE.md** line 301
  `| `#fecaca` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3475
  `#### `#fecaca` (1 occurrences)`
- **audit-BEFORE.md** line 3478
  ``border: 1px solid var(--color-Error-200, #fecaca);``
- **src\styles\base\utilities.css** line 519
  `border: 1px solid var(--color-Error-200, #fecaca);`

#### `#14b8a6` (4 occurrences)

- **audit-BEFORE.md** line 302
  `| `#14b8a6` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3480
  `#### `#14b8a6` (1 occurrences)`
- **audit-BEFORE.md** line 3483
  ``color: var(--color-Success-500, var(--brand-c-primary-dark, #14b8a6));``
- **src\styles\base\utilities.css** line 584
  `color: var(--color-Success-500, var(--brand-c-primary-dark, #14b8a6));`

#### `#99f6e4` (4 occurrences)

- **audit-BEFORE.md** line 303
  `| `#99f6e4` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3485
  `#### `#99f6e4` (1 occurrences)`
- **audit-BEFORE.md** line 3488
  ``border: 1px solid var(--color-Success-200, var(--brand-c-primary-light, #99f6e4));``
- **src\styles\base\utilities.css** line 586
  `border: 1px solid var(--color-Success-200, var(--brand-c-primary-light, #99f6e4));`

#### `#b45309` (4 occurrences)

- **audit-BEFORE.md** line 304
  `| `#b45309` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3490
  `#### `#b45309` (1 occurrences)`
- **audit-BEFORE.md** line 3493
  ``color: var(--color-Warning-500, var(--brand-c-neutral-dark, #b45309));``
- **src\styles\base\utilities.css** line 601
  `color: var(--color-Warning-500, var(--brand-c-neutral-dark, #b45309));`

#### `#fffbeb` (4 occurrences)

- **audit-BEFORE.md** line 305
  `| `#fffbeb` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3495
  `#### `#fffbeb` (1 occurrences)`
- **audit-BEFORE.md** line 3498
  ``background: var(--color-Warning-100, var(--brand-c-neutral-light, #fffbeb));``
- **src\styles\base\utilities.css** line 602
  `background: var(--color-Warning-100, var(--brand-c-neutral-light, #fffbeb));`

#### `#fde68a` (4 occurrences)

- **audit-BEFORE.md** line 306
  `| `#fde68a` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3500
  `#### `#fde68a` (1 occurrences)`
- **audit-BEFORE.md** line 3503
  ``border: 1px solid var(--color-Warning-200, var(--brand-c-neutral-light, #fde68a));``
- **src\styles\base\utilities.css** line 603
  `border: 1px solid var(--color-Warning-200, var(--brand-c-neutral-light, #fde68a));`

#### `#777` (4 occurrences)

- **audit-BEFORE.md** line 319
  `| `#777` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3565
  `#### `#777` (1 occurrences)`
- **audit-BEFORE.md** line 3568
  ``--brand-c-neutral: #777;``
- **audit-BEFORE.md** line 5693
  `| `--brand-c-neutral` | `#777` | `src\styles\themes\a11y\a11y-dark.css` | 87 |`

#### `#aaa` (4 occurrences)

- **audit-BEFORE.md** line 320
  `| `#aaa` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3570
  `#### `#aaa` (1 occurrences)`
- **audit-BEFORE.md** line 3573
  ``--brand-c-neutral-dark: #aaa;``
- **audit-BEFORE.md** line 5707
  `| `--brand-c-neutral-dark` | `#aaa` | `src\styles\themes\a11y\a11y-dark.css` | 89 |`

#### `#f0fdee` (4 occurrences)

- **audit-BEFORE.md** line 321
  `| `#f0fdee` | 1 | 1 | Replace with `var(--brand-c-primary-light)` |`
- **audit-BEFORE.md** line 3575
  `#### `#f0fdee` (1 occurrences)`
- **audit-BEFORE.md** line 3578
  ``--brand-c-primary-light: #f0fdee;``
- **audit-BEFORE.md** line 5748
  `| `--brand-c-primary-light` | `#f0fdee` | `src\styles\themes\brand\BrandDefault.css` | 14 |`

#### `#aec6a9` (4 occurrences)

- **audit-BEFORE.md** line 322
  `| `#aec6a9` | 1 | 1 | Replace with `var(--brand-c-primary)` |`
- **audit-BEFORE.md** line 3580
  `#### `#aec6a9` (1 occurrences)`
- **audit-BEFORE.md** line 3583
  ``--brand-c-primary: #aec6a9;``
- **audit-BEFORE.md** line 5768
  `| `--brand-c-primary` | `#aec6a9` | `src\styles\themes\brand\BrandDefault.css` | 16 |`

#### `#42563d` (4 occurrences)

- **audit-BEFORE.md** line 323
  `| `#42563d` | 1 | 1 | Replace with `var(--brand-c-primary-dark)` |`
- **audit-BEFORE.md** line 3585
  `#### `#42563d` (1 occurrences)`
- **audit-BEFORE.md** line 3588
  ``--brand-c-primary-dark: #42563d;``
- **audit-BEFORE.md** line 5821
  `| `--brand-c-primary-dark` | `#42563d` | `src\styles\themes\brand\BrandDefault.css` | 20 |`

#### `#364433` (4 occurrences)

- **audit-BEFORE.md** line 324
  `| `#364433` | 1 | 1 | Replace with `var(--brand-c-primary-dark)` |`
- **audit-BEFORE.md** line 3590
  `#### `#364433` (1 occurrences)`
- **audit-BEFORE.md** line 3593
  ``--brand-c-primary-dark: #364433;``
- **audit-BEFORE.md** line 5831
  `| `--brand-c-primary-dark` | `#364433` | `src\styles\themes\brand\BrandDefault.css` | 21 |`

#### `#fff4ee` (4 occurrences)

- **audit-BEFORE.md** line 325
  `| `#fff4ee` | 1 | 1 | Replace with `var(--brand-c-secondary-light)` |`
- **audit-BEFORE.md** line 3595
  `#### `#fff4ee` (1 occurrences)`
- **audit-BEFORE.md** line 3598
  ``--brand-c-secondary-light: #fff4ee;``
- **audit-BEFORE.md** line 5841
  `| `--brand-c-secondary-light` | `#fff4ee` | `src\styles\themes\brand\BrandDefault.css` | 24 |`

#### `#fff1e7` (4 occurrences)

- **audit-BEFORE.md** line 326
  `| `#fff1e7` | 1 | 1 | Replace with `var(--brand-c-secondary-light)` |`
- **audit-BEFORE.md** line 3600
  `#### `#fff1e7` (1 occurrences)`
- **audit-BEFORE.md** line 3603
  ``--brand-c-secondary-light: #fff1e7;``
- **audit-BEFORE.md** line 5851
  `| `--brand-c-secondary-light` | `#fff1e7` | `src\styles\themes\brand\BrandDefault.css` | 25 |`

#### `#e5af9a` (4 occurrences)

- **audit-BEFORE.md** line 327
  `| `#e5af9a` | 1 | 1 | Replace with `var(--brand-c-secondary)` |`
- **audit-BEFORE.md** line 3605
  `#### `#e5af9a` (1 occurrences)`
- **audit-BEFORE.md** line 3608
  ``--brand-c-secondary: #e5af9a;``
- **audit-BEFORE.md** line 5871
  `| `--brand-c-secondary` | `#e5af9a` | `src\styles\themes\brand\BrandDefault.css` | 27 |`

#### `#a4725f` (4 occurrences)

- **audit-BEFORE.md** line 328
  `| `#a4725f` | 1 | 1 | Replace with `var(--brand-c-secondary-dark)` |`
- **audit-BEFORE.md** line 3610
  `#### `#a4725f` (1 occurrences)`
- **audit-BEFORE.md** line 3613
  ``--brand-c-secondary-dark: #a4725f;``
- **audit-BEFORE.md** line 5892
  `| `--brand-c-secondary-dark` | `#a4725f` | `src\styles\themes\brand\BrandDefault.css` | 29 |`

#### `#6f4230` (4 occurrences)

- **audit-BEFORE.md** line 329
  `| `#6f4230` | 1 | 1 | Replace with `var(--brand-c-secondary-dark)` |`
- **audit-BEFORE.md** line 3615
  `#### `#6f4230` (1 occurrences)`
- **audit-BEFORE.md** line 3618
  ``--brand-c-secondary-dark: #6f4230;``
- **audit-BEFORE.md** line 5912
  `| `--brand-c-secondary-dark` | `#6f4230` | `src\styles\themes\brand\BrandDefault.css` | 31 |`

#### `#d2d1cc` (4 occurrences)

- **audit-BEFORE.md** line 330
  `| `#d2d1cc` | 1 | 1 | Replace with `var(--brand-c-bg-light)` |`
- **audit-BEFORE.md** line 3620
  `#### `#d2d1cc` (1 occurrences)`
- **audit-BEFORE.md** line 3623
  ``--brand-c-bg-light: #d2d1cc;``
- **audit-BEFORE.md** line 5523
  `| `--brand-c-bg-light` | `#d2d1cc` | `src\styles\themes\brand\BrandDefault.css` | 37 |`

#### `#b4b1a8` (4 occurrences)

- **audit-BEFORE.md** line 331
  `| `#b4b1a8` | 1 | 1 | Replace with `var(--brand-c-bg-light)` |`
- **audit-BEFORE.md** line 3625
  `#### `#b4b1a8` (1 occurrences)`
- **audit-BEFORE.md** line 3628
  ``--brand-c-bg-light: #b4b1a8;``
- **audit-BEFORE.md** line 5534
  `| `--brand-c-bg-light` | `#b4b1a8` | `src\styles\themes\brand\BrandDefault.css` | 38 |`

#### `#95928a` (4 occurrences)

- **audit-BEFORE.md** line 332
  `| `#95928a` | 1 | 1 | Replace with `var(--brand-c-bg-light)` |`
- **audit-BEFORE.md** line 3630
  `#### `#95928a` (1 occurrences)`
- **audit-BEFORE.md** line 3633
  ``--brand-c-bg-light: #95928a;``
- **audit-BEFORE.md** line 5545
  `| `--brand-c-bg-light` | `#95928a` | `src\styles\themes\brand\BrandDefault.css` | 39 |`

#### `#77746c` (4 occurrences)

- **audit-BEFORE.md** line 333
  `| `#77746c` | 1 | 1 | Replace with `var(--brand-c-bg-light)` |`
- **audit-BEFORE.md** line 3635
  `#### `#77746c` (1 occurrences)`
- **audit-BEFORE.md** line 3638
  ``--brand-c-bg-light: #77746c;``
- **audit-BEFORE.md** line 5568
  `| `--brand-c-bg-light` | `#77746c` | `src\styles\themes\brand\BrandDefault.css` | 40 |`

#### `#f8f8f8` (4 occurrences)

- **audit-BEFORE.md** line 334
  `| `#f8f8f8` | 1 | 1 | Replace with `var(--brand-c-text-light)` |`
- **audit-BEFORE.md** line 3640
  `#### `#f8f8f8` (1 occurrences)`
- **audit-BEFORE.md** line 3643
  ``--brand-c-text-light: #f8f8f8;``
- **audit-BEFORE.md** line 5964
  `| `--brand-c-text-light` | `#f8f8f8` | `src\styles\themes\brand\BrandDefault.css` | 47 |`

#### `#d3d3d3` (4 occurrences)

- **audit-BEFORE.md** line 335
  `| `#d3d3d3` | 1 | 1 | Replace with `var(--brand-c-text-light)` |`
- **audit-BEFORE.md** line 3645
  `#### `#d3d3d3` (1 occurrences)`
- **audit-BEFORE.md** line 3648
  ``--brand-c-text-light: #d3d3d3;``
- **audit-BEFORE.md** line 5945
  `| `--brand-c-text-light` | `#d3d3d3` | `src\styles\themes\brand\BrandDefault.css` | 50 |`

#### `#b3b3b3` (4 occurrences)

- **audit-BEFORE.md** line 336
  `| `#b3b3b3` | 1 | 1 | Replace with `var(--brand-c-text-light)` |`
- **audit-BEFORE.md** line 3650
  `#### `#b3b3b3` (1 occurrences)`
- **audit-BEFORE.md** line 3653
  ``--brand-c-text-light: #b3b3b3;``
- **audit-BEFORE.md** line 5956
  `| `--brand-c-text-light` | `#b3b3b3` | `src\styles\themes\brand\BrandDefault.css` | 51 |`

#### `#292624` (4 occurrences)

- **audit-BEFORE.md** line 338
  `| `#292624` | 1 | 1 | Replace with `var(--brand-c-neutral-dark)` |`
- **audit-BEFORE.md** line 3660
  `#### `#292624` (1 occurrences)`
- **audit-BEFORE.md** line 3663
  ``--brand-c-neutral-dark: #292624;``
- **audit-BEFORE.md** line 5728
  `| `--brand-c-neutral-dark` | `#292624` | `src\styles\themes\brand\BrandDefault.css` | 65 |`

#### `#fef7f3` (4 occurrences)

- **audit-BEFORE.md** line 339
  `| `#fef7f3` | 1 | 1 | Replace with `var(--brand-c-neutral-light)` |`
- **audit-BEFORE.md** line 3665
  `#### `#fef7f3` (1 occurrences)`
- **audit-BEFORE.md** line 3668
  ``--brand-c-neutral-light: #fef7f3;``
- **audit-BEFORE.md** line 5295
  `| `--brand-c-neutral-light` | `#fef7f3` | `src\styles\themes\brand\BrandDefault.css` | 68 |`

#### `#f3e6e0` (4 occurrences)

- **audit-BEFORE.md** line 340
  `| `#f3e6e0` | 1 | 1 | Replace with `var(--brand-c-neutral-light)` |`
- **audit-BEFORE.md** line 3670
  `#### `#f3e6e0` (1 occurrences)`
- **audit-BEFORE.md** line 3673
  ``--brand-c-neutral-light: #f3e6e0;``
- **audit-BEFORE.md** line 5303
  `| `--brand-c-neutral-light` | `#f3e6e0` | `src\styles\themes\brand\BrandDefault.css` | 69 |`

#### `#dcc3b6` (4 occurrences)

- **audit-BEFORE.md** line 341
  `| `#dcc3b6` | 1 | 1 | Replace with `var(--brand-c-neutral-light)` |`
- **audit-BEFORE.md** line 3675
  `#### `#dcc3b6` (1 occurrences)`
- **audit-BEFORE.md** line 3678
  ``--brand-c-neutral-light: #dcc3b6;``
- **audit-BEFORE.md** line 5311
  `| `--brand-c-neutral-light` | `#dcc3b6` | `src\styles\themes\brand\BrandDefault.css` | 70 |`

#### `#bba397` (4 occurrences)

- **audit-BEFORE.md** line 342
  `| `#bba397` | 1 | 1 | Replace with `var(--brand-c-neutral)` |`
- **audit-BEFORE.md** line 3680
  `#### `#bba397` (1 occurrences)`
- **audit-BEFORE.md** line 3683
  ``--brand-c-neutral: #bba397;``
- **audit-BEFORE.md** line 5319
  `| `--brand-c-neutral` | `#bba397` | `src\styles\themes\brand\BrandDefault.css` | 71 |`

#### `#7e685c` (4 occurrences)

- **audit-BEFORE.md** line 343
  `| `#7e685c` | 1 | 1 | Replace with `var(--brand-c-neutral-dark)` |`
- **audit-BEFORE.md** line 3685
  `#### `#7e685c` (1 occurrences)`
- **audit-BEFORE.md** line 3688
  ``--brand-c-neutral-dark: #7e685c;``
- **audit-BEFORE.md** line 5342
  `| `--brand-c-neutral-dark` | `#7e685c` | `src\styles\themes\brand\BrandDefault.css` | 73 |`

#### `#614c41` (4 occurrences)

- **audit-BEFORE.md** line 344
  `| `#614c41` | 1 | 1 | Replace with `var(--brand-c-neutral-dark)` |`
- **audit-BEFORE.md** line 3690
  `#### `#614c41` (1 occurrences)`
- **audit-BEFORE.md** line 3693
  ``--brand-c-neutral-dark: #614c41;``
- **audit-BEFORE.md** line 5350
  `| `--brand-c-neutral-dark` | `#614c41` | `src\styles\themes\brand\BrandDefault.css` | 74 |`

#### `#4d392f` (4 occurrences)

- **audit-BEFORE.md** line 345
  `| `#4d392f` | 1 | 1 | Replace with `var(--brand-c-neutral-dark)` |`
- **audit-BEFORE.md** line 3695
  `#### `#4d392f` (1 occurrences)`
- **audit-BEFORE.md** line 3698
  ``--brand-c-neutral-dark: #4d392f;``
- **audit-BEFORE.md** line 5358
  `| `--brand-c-neutral-dark` | `#4d392f` | `src\styles\themes\brand\BrandDefault.css` | 75 |`

#### `#f4f8ff` (4 occurrences)

- **audit-BEFORE.md** line 346
  `| `#f4f8ff` | 1 | 1 | Replace with `var(--brand-c-neutral-light)` |`
- **audit-BEFORE.md** line 3700
  `#### `#f4f8ff` (1 occurrences)`
- **audit-BEFORE.md** line 3703
  ``--brand-c-neutral-light: #f4f8ff;``
- **audit-BEFORE.md** line 5437
  `| `--brand-c-neutral-light` | `#f4f8ff` | `src\styles\themes\brand\BrandDefault.css` | 78 |`

#### `#e9f0ff` (4 occurrences)

- **audit-BEFORE.md** line 347
  `| `#e9f0ff` | 1 | 1 | Replace with `var(--brand-c-neutral-light)` |`
- **audit-BEFORE.md** line 3705
  `#### `#e9f0ff` (1 occurrences)`
- **audit-BEFORE.md** line 3708
  ``--brand-c-neutral-light: #e9f0ff;``
- **audit-BEFORE.md** line 5445
  `| `--brand-c-neutral-light` | `#e9f0ff` | `src\styles\themes\brand\BrandDefault.css` | 79 |`

#### `#c1cff6` (4 occurrences)

- **audit-BEFORE.md** line 348
  `| `#c1cff6` | 1 | 1 | Replace with `var(--brand-c-neutral-light)` |`
- **audit-BEFORE.md** line 3710
  `#### `#c1cff6` (1 occurrences)`
- **audit-BEFORE.md** line 3713
  ``--brand-c-neutral-light: #c1cff6;``
- **audit-BEFORE.md** line 5453
  `| `--brand-c-neutral-light` | `#c1cff6` | `src\styles\themes\brand\BrandDefault.css` | 80 |`

#### `#a1afd5` (4 occurrences)

- **audit-BEFORE.md** line 349
  `| `#a1afd5` | 1 | 1 | Replace with `var(--brand-c-neutral)` |`
- **audit-BEFORE.md** line 3715
  `#### `#a1afd5` (1 occurrences)`
- **audit-BEFORE.md** line 3718
  ``--brand-c-neutral: #a1afd5;``
- **audit-BEFORE.md** line 5461
  `| `--brand-c-neutral` | `#a1afd5` | `src\styles\themes\brand\BrandDefault.css` | 81 |`

#### `#667296` (4 occurrences)

- **audit-BEFORE.md** line 350
  `| `#667296` | 1 | 1 | Replace with `var(--brand-c-neutral-dark)` |`
- **audit-BEFORE.md** line 3720
  `#### `#667296` (1 occurrences)`
- **audit-BEFORE.md** line 3723
  ``--brand-c-neutral-dark: #667296;``
- **audit-BEFORE.md** line 5484
  `| `--brand-c-neutral-dark` | `#667296` | `src\styles\themes\brand\BrandDefault.css` | 83 |`

#### `#4a5677` (4 occurrences)

- **audit-BEFORE.md** line 351
  `| `#4a5677` | 1 | 1 | Replace with `var(--brand-c-neutral-dark)` |`
- **audit-BEFORE.md** line 3725
  `#### `#4a5677` (1 occurrences)`
- **audit-BEFORE.md** line 3728
  ``--brand-c-neutral-dark: #4a5677;``
- **audit-BEFORE.md** line 5492
  `| `--brand-c-neutral-dark` | `#4a5677` | `src\styles\themes\brand\BrandDefault.css` | 84 |`

#### `#384263` (4 occurrences)

- **audit-BEFORE.md** line 352
  `| `#384263` | 1 | 1 | Replace with `var(--brand-c-neutral-dark)` |`
- **audit-BEFORE.md** line 3730
  `#### `#384263` (1 occurrences)`
- **audit-BEFORE.md** line 3733
  ``--brand-c-neutral-dark: #384263;``
- **audit-BEFORE.md** line 5500
  `| `--brand-c-neutral-dark` | `#384263` | `src\styles\themes\brand\BrandDefault.css` | 85 |`

#### `#fcf6fa` (4 occurrences)

- **audit-BEFORE.md** line 353
  `| `#fcf6fa` | 1 | 1 | Replace with `var(--brand-c-neutral-light)` |`
- **audit-BEFORE.md** line 3735
  `#### `#fcf6fa` (1 occurrences)`
- **audit-BEFORE.md** line 3738
  ``--brand-c-neutral-light: #fcf6fa;``
- **audit-BEFORE.md** line 5366
  `| `--brand-c-neutral-light` | `#fcf6fa` | `src\styles\themes\brand\BrandDefault.css` | 88 |`

#### `#f1e8ee` (4 occurrences)

- **audit-BEFORE.md** line 354
  `| `#f1e8ee` | 1 | 1 | Replace with `var(--brand-c-neutral-light)` |`
- **audit-BEFORE.md** line 3740
  `#### `#f1e8ee` (1 occurrences)`
- **audit-BEFORE.md** line 3743
  ``--brand-c-neutral-light: #f1e8ee;``
- **audit-BEFORE.md** line 5374
  `| `--brand-c-neutral-light` | `#f1e8ee` | `src\styles\themes\brand\BrandDefault.css` | 89 |`

#### `#d6c4d1` (4 occurrences)

- **audit-BEFORE.md** line 355
  `| `#d6c4d1` | 1 | 1 | Replace with `var(--brand-c-neutral-light)` |`
- **audit-BEFORE.md** line 3745
  `#### `#d6c4d1` (1 occurrences)`
- **audit-BEFORE.md** line 3748
  ``--brand-c-neutral-light: #d6c4d1;``
- **audit-BEFORE.md** line 5382
  `| `--brand-c-neutral-light` | `#d6c4d1` | `src\styles\themes\brand\BrandDefault.css` | 90 |`

#### `#b6a4b1` (4 occurrences)

- **audit-BEFORE.md** line 356
  `| `#b6a4b1` | 1 | 1 | Replace with `var(--brand-c-neutral)` |`
- **audit-BEFORE.md** line 3750
  `#### `#b6a4b1` (1 occurrences)`
- **audit-BEFORE.md** line 3753
  ``--brand-c-neutral: #b6a4b1;``
- **audit-BEFORE.md** line 5390
  `| `--brand-c-neutral` | `#b6a4b1` | `src\styles\themes\brand\BrandDefault.css` | 91 |`

#### `#796974` (4 occurrences)

- **audit-BEFORE.md** line 357
  `| `#796974` | 1 | 1 | Replace with `var(--brand-c-neutral-dark)` |`
- **audit-BEFORE.md** line 3755
  `#### `#796974` (1 occurrences)`
- **audit-BEFORE.md** line 3758
  ``--brand-c-neutral-dark: #796974;``
- **audit-BEFORE.md** line 5413
  `| `--brand-c-neutral-dark` | `#796974` | `src\styles\themes\brand\BrandDefault.css` | 93 |`

#### `#5c4d58` (4 occurrences)

- **audit-BEFORE.md** line 358
  `| `#5c4d58` | 1 | 1 | Replace with `var(--brand-c-neutral-dark)` |`
- **audit-BEFORE.md** line 3760
  `#### `#5c4d58` (1 occurrences)`
- **audit-BEFORE.md** line 3763
  ``--brand-c-neutral-dark: #5c4d58;``
- **audit-BEFORE.md** line 5421
  `| `--brand-c-neutral-dark` | `#5c4d58` | `src\styles\themes\brand\BrandDefault.css` | 94 |`

#### `#493a45` (4 occurrences)

- **audit-BEFORE.md** line 359
  `| `#493a45` | 1 | 1 | Replace with `var(--brand-c-neutral-dark)` |`
- **audit-BEFORE.md** line 3765
  `#### `#493a45` (1 occurrences)`
- **audit-BEFORE.md** line 3768
  ``--brand-c-neutral-dark: #493a45;``
- **audit-BEFORE.md** line 5429
  `| `--brand-c-neutral-dark` | `#493a45` | `src\styles\themes\brand\BrandDefault.css` | 95 |`

#### `#b5b9bf` (4 occurrences)

- **audit-BEFORE.md** line 360
  `| `#b5b9bf` | 1 | 1 | Replace with `var(--brand-c-neutral-light)` |`
- **audit-BEFORE.md** line 3770
  `#### `#b5b9bf` (1 occurrences)`
- **audit-BEFORE.md** line 3773
  ``--brand-c-neutral-light: #b5b9bf;``
- **audit-BEFORE.md** line 5224
  `| `--brand-c-neutral-light` | `#b5b9bf` | `src\styles\themes\brand\BrandDefault.css` | 98 |`

#### `#9aa1aa` (4 occurrences)

- **audit-BEFORE.md** line 361
  `| `#9aa1aa` | 1 | 1 | Replace with `var(--brand-c-neutral-light)` |`
- **audit-BEFORE.md** line 3775
  `#### `#9aa1aa` (1 occurrences)`
- **audit-BEFORE.md** line 3778
  ``--brand-c-neutral-light: #9aa1aa;``
- **audit-BEFORE.md** line 5232
  `| `--brand-c-neutral-light` | `#9aa1aa` | `src\styles\themes\brand\BrandDefault.css` | 99 |`

#### `#768395` (4 occurrences)

- **audit-BEFORE.md** line 362
  `| `#768395` | 1 | 1 | Replace with `var(--brand-c-neutral-light)` |`
- **audit-BEFORE.md** line 3780
  `#### `#768395` (1 occurrences)`
- **audit-BEFORE.md** line 3783
  ``--brand-c-neutral-light: #768395;``
- **audit-BEFORE.md** line 5240
  `| `--brand-c-neutral-light` | `#768395` | `src\styles\themes\brand\BrandDefault.css` | 100 |`

#### `#596677` (4 occurrences)

- **audit-BEFORE.md** line 363
  `| `#596677` | 1 | 1 | Replace with `var(--brand-c-neutral)` |`
- **audit-BEFORE.md** line 3785
  `#### `#596677` (1 occurrences)`
- **audit-BEFORE.md** line 3788
  ``--brand-c-neutral: #596677;``
- **audit-BEFORE.md** line 5248
  `| `--brand-c-neutral` | `#596677` | `src\styles\themes\brand\BrandDefault.css` | 101 |`

#### `#25303f` (4 occurrences)

- **audit-BEFORE.md** line 364
  `| `#25303f` | 1 | 1 | Replace with `var(--brand-c-neutral-dark)` |`
- **audit-BEFORE.md** line 3790
  `#### `#25303f` (1 occurrences)`
- **audit-BEFORE.md** line 3793
  ``--brand-c-neutral-dark: #25303f;``
- **audit-BEFORE.md** line 5271
  `| `--brand-c-neutral-dark` | `#25303f` | `src\styles\themes\brand\BrandDefault.css` | 103 |`

#### `#0d1825` (4 occurrences)

- **audit-BEFORE.md** line 365
  `| `#0d1825` | 1 | 1 | Replace with `var(--brand-c-neutral-dark)` |`
- **audit-BEFORE.md** line 3795
  `#### `#0d1825` (1 occurrences)`
- **audit-BEFORE.md** line 3798
  ``--brand-c-neutral-dark: #0d1825;``
- **audit-BEFORE.md** line 5279
  `| `--brand-c-neutral-dark` | `#0d1825` | `src\styles\themes\brand\BrandDefault.css` | 104 |`

#### `#020815` (4 occurrences)

- **audit-BEFORE.md** line 366
  `| `#020815` | 1 | 1 | Replace with `var(--brand-c-neutral-dark)` |`
- **audit-BEFORE.md** line 3800
  `#### `#020815` (1 occurrences)`
- **audit-BEFORE.md** line 3803
  ``--brand-c-neutral-dark: #020815;``
- **audit-BEFORE.md** line 5287
  `| `--brand-c-neutral-dark` | `#020815` | `src\styles\themes\brand\BrandDefault.css` | 105 |`

#### `#fdf5ff` (4 occurrences)

- **audit-BEFORE.md** line 367
  `| `#fdf5ff` | 1 | 1 | Replace with `var(--brand-c-neutral-light)` |`
- **audit-BEFORE.md** line 3805
  `#### `#fdf5ff` (1 occurrences)`
- **audit-BEFORE.md** line 3808
  ``--brand-c-neutral-light: #fdf5ff;``
- **audit-BEFORE.md** line 5153
  `| `--brand-c-neutral-light` | `#fdf5ff` | `src\styles\themes\brand\BrandDefault.css` | 108 |`

#### `#fcefff` (4 occurrences)

- **audit-BEFORE.md** line 368
  `| `#fcefff` | 1 | 1 | Replace with `var(--brand-c-neutral-light)` |`
- **audit-BEFORE.md** line 3810
  `#### `#fcefff` (1 occurrences)`
- **audit-BEFORE.md** line 3813
  ``--brand-c-neutral-light: #fcefff;``
- **audit-BEFORE.md** line 5161
  `| `--brand-c-neutral-light` | `#fcefff` | `src\styles\themes\brand\BrandDefault.css` | 109 |`

#### `#e2c8ee` (4 occurrences)

- **audit-BEFORE.md** line 369
  `| `#e2c8ee` | 1 | 1 | Replace with `var(--brand-c-neutral-light)` |`
- **audit-BEFORE.md** line 3815
  `#### `#e2c8ee` (1 occurrences)`
- **audit-BEFORE.md** line 3818
  ``--brand-c-neutral-light: #e2c8ee;``
- **audit-BEFORE.md** line 5169
  `| `--brand-c-neutral-light` | `#e2c8ee` | `src\styles\themes\brand\BrandDefault.css` | 110 |`

#### `#c1a9cd` (4 occurrences)

- **audit-BEFORE.md** line 370
  `| `#c1a9cd` | 1 | 1 | Replace with `var(--brand-c-neutral)` |`
- **audit-BEFORE.md** line 3820
  `#### `#c1a9cd` (1 occurrences)`
- **audit-BEFORE.md** line 3823
  ``--brand-c-neutral: #c1a9cd;``
- **audit-BEFORE.md** line 5177
  `| `--brand-c-neutral` | `#c1a9cd` | `src\styles\themes\brand\BrandDefault.css` | 111 |`

#### `#846c8e` (4 occurrences)

- **audit-BEFORE.md** line 371
  `| `#846c8e` | 1 | 1 | Replace with `var(--brand-c-neutral-dark)` |`
- **audit-BEFORE.md** line 3825
  `#### `#846c8e` (1 occurrences)`
- **audit-BEFORE.md** line 3828
  ``--brand-c-neutral-dark: #846c8e;``
- **audit-BEFORE.md** line 5200
  `| `--brand-c-neutral-dark` | `#846c8e` | `src\styles\themes\brand\BrandDefault.css` | 113 |`

#### `#665070` (4 occurrences)

- **audit-BEFORE.md** line 372
  `| `#665070` | 1 | 1 | Replace with `var(--brand-c-neutral-dark)` |`
- **audit-BEFORE.md** line 3830
  `#### `#665070` (1 occurrences)`
- **audit-BEFORE.md** line 3833
  ``--brand-c-neutral-dark: #665070;``
- **audit-BEFORE.md** line 5208
  `| `--brand-c-neutral-dark` | `#665070` | `src\styles\themes\brand\BrandDefault.css` | 114 |`

#### `#533d5c` (4 occurrences)

- **audit-BEFORE.md** line 373
  `| `#533d5c` | 1 | 1 | Replace with `var(--brand-c-neutral-dark)` |`
- **audit-BEFORE.md** line 3835
  `#### `#533d5c` (1 occurrences)`
- **audit-BEFORE.md** line 3838
  ``--brand-c-neutral-dark: #533d5c;``
- **audit-BEFORE.md** line 5216
  `| `--brand-c-neutral-dark` | `#533d5c` | `src\styles\themes\brand\BrandDefault.css` | 115 |`

#### `rgba(255, 255, 255, 0.75)` (4 occurrences)

- **audit-BEFORE.md** line 210
  `| `rgba(255, 255, 255, 0.75)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3020
  `#### `rgba(255, 255, 255, 0.75)` (1 occurrences)`
- **audit-BEFORE.md** line 3023
  ``color: rgba(255, 255, 255, 0.75);``
- **src\components\Grids\RelatedGrid.astro** line 511
  `color: rgba(255, 255, 255, 0.75);`

#### `rgba(0, 0, 0, 0.9)` (4 occurrences)

- **audit-BEFORE.md** line 211
  `| `rgba(0, 0, 0, 0.9)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3025
  `#### `rgba(0, 0, 0, 0.9)` (1 occurrences)`
- **audit-BEFORE.md** line 3028
  ``rgba(0, 0, 0, 0.9) 0%,``
- **src\components\Presentation\Sections\HeroSection.astro** line 71
  `rgba(0, 0, 0, 0.9) 0%,`

#### `rgba(196,144,124,0.3)` (4 occurrences)

- **audit-BEFORE.md** line 216
  `| `rgba(196,144,124,0.3)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3050
  `#### `rgba(196,144,124,0.3)` (1 occurrences)`
- **audit-BEFORE.md** line 3053
  ``border: 1px solid rgba(196,144,124,0.3);``
- **src\lib\emailit.ts** line 288
  `border: 1px solid rgba(196,144,124,0.3);`

#### `rgb(248, 245, 242)` (4 occurrences)

- **audit-BEFORE.md** line 217
  `| `rgb(248, 245, 242)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3055
  `#### `rgb(248, 245, 242)` (1 occurrences)`
- **audit-BEFORE.md** line 3058
  ``const fallbackColor = 'rgb(248, 245, 242)';``
- **src\lib\animation\scroll-color-background.ts** line 68
  `const fallbackColor = 'rgb(248, 245, 242)';`

#### `rgba(0, 0, 0, 0.03)` (4 occurrences)

- **audit-BEFORE.md** line 218
  `| `rgba(0, 0, 0, 0.03)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3060
  `#### `rgba(0, 0, 0, 0.03)` (1 occurrences)`
- **audit-BEFORE.md** line 3063
  ``0 4px 12px rgba(0, 0, 0, 0.03);``
- **src\pages\verify.astro** line 205
  `0 4px 12px rgba(0, 0, 0, 0.03);`

#### `rgba(255,255,255,0.1)` (4 occurrences)

- **audit-BEFORE.md** line 255
  `| `rgba(255,255,255,0.1)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3245
  `#### `rgba(255,255,255,0.1)` (1 occurrences)`
- **audit-BEFORE.md** line 3248
  ``border-top: 2px solid rgba(255,255,255,0.1);``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 238
  `border-top: 2px solid rgba(255,255,255,0.1);`

#### `rgba(0,0,0,0.95)` (4 occurrences)

- **audit-BEFORE.md** line 256
  `| `rgba(0,0,0,0.95)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3250
  `#### `rgba(0,0,0,0.95)` (1 occurrences)`
- **audit-BEFORE.md** line 3253
  ``background: rgba(0,0,0,0.95);``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 340
  `background: rgba(0,0,0,0.95);`

#### `rgba(0,0,0,0.4)` (4 occurrences)

- **audit-BEFORE.md** line 257
  `| `rgba(0,0,0,0.4)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3255
  `#### `rgba(0,0,0,0.4)` (1 occurrences)`
- **audit-BEFORE.md** line 3258
  ``color: rgba(0,0,0,0.4);``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 713
  `color: rgba(0,0,0,0.4);`

#### `rgba(255,255,255,0.2)` (4 occurrences)

- **audit-BEFORE.md** line 258
  `| `rgba(255,255,255,0.2)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3260
  `#### `rgba(255,255,255,0.2)` (1 occurrences)`
- **audit-BEFORE.md** line 3263
  ``item.style.borderBottomColor = a[accentKey]?.color || 'rgba(255,255,255,0.2)';``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1861
  `item.style.borderBottomColor = a[accentKey]?.color || 'rgba(255,255,255,0.2)';`

#### `rgba(0, 0, 0, 0.05)` (4 occurrences)

- **audit-BEFORE.md** line 259
  `| `rgba(0, 0, 0, 0.05)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3265
  `#### `rgba(0, 0, 0, 0.05)` (1 occurrences)`
- **audit-BEFORE.md** line 3268
  ``box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 2078
  `box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);`

#### `rgba(0, 0, 0, 0.85)` (4 occurrences)

- **audit-BEFORE.md** line 307
  `| `rgba(0, 0, 0, 0.85)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3505
  `#### `rgba(0, 0, 0, 0.85)` (1 occurrences)`
- **audit-BEFORE.md** line 3508
  ``background: rgba(0, 0, 0, 0.85);``
- **src\styles\components\philosophy-flip-cards.css** line 302
  `background: rgba(0, 0, 0, 0.85);`

#### `rgba(250, 248, 244, 0.9)` (4 occurrences)

- **audit-BEFORE.md** line 308
  `| `rgba(250, 248, 244, 0.9)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3510
  `#### `rgba(250, 248, 244, 0.9)` (1 occurrences)`
- **audit-BEFORE.md** line 3513
  ``background: rgba(250, 248, 244, 0.9);``
- **src\styles\components\philosophy-flip-cards.css** line 306
  `background: rgba(250, 248, 244, 0.9);`

#### `rgba(255, 255, 255, 0.9)` (4 occurrences)

- **audit-BEFORE.md** line 309
  `| `rgba(255, 255, 255, 0.9)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3515
  `#### `rgba(255, 255, 255, 0.9)` (1 occurrences)`
- **audit-BEFORE.md** line 3518
  ``background: rgba(255, 255, 255, 0.9);``
- **src\styles\components\philosophy-flip-cards.css** line 310
  `background: rgba(255, 255, 255, 0.9);`

#### `rgba(0, 0, 0, 0.45)` (4 occurrences)

- **audit-BEFORE.md** line 310
  `| `rgba(0, 0, 0, 0.45)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3520
  `#### `rgba(0, 0, 0, 0.45)` (1 occurrences)`
- **audit-BEFORE.md** line 3523
  ``background-color: rgba(0, 0, 0, 0.45);``
- **src\styles\components\presentation\ReaderNav.css** line 741
  `background-color: rgba(0, 0, 0, 0.45);`

#### `rgba(255, 255, 255, 0.45)` (4 occurrences)

- **audit-BEFORE.md** line 311
  `| `rgba(255, 255, 255, 0.45)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3525
  `#### `rgba(255, 255, 255, 0.45)` (1 occurrences)`
- **audit-BEFORE.md** line 3528
  ``background-color: rgba(255, 255, 255, 0.45);``
- **src\styles\components\presentation\ReaderNav.css** line 750
  `background-color: rgba(255, 255, 255, 0.45);`

#### `rgba(209, 213, 219, 0.3)` (4 occurrences)

- **audit-BEFORE.md** line 312
  `| `rgba(209, 213, 219, 0.3)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3530
  `#### `rgba(209, 213, 219, 0.3)` (1 occurrences)`
- **audit-BEFORE.md** line 3533
  ``border: var(--border-width) solid rgba(209, 213, 219, 0.3);``
- **src\styles\components\presentation\ReaderNav.css** line 751
  `border: var(--border-width) solid rgba(209, 213, 219, 0.3);`

#### `rgba(20, 20, 30, 0.35)` (4 occurrences)

- **audit-BEFORE.md** line 313
  `| `rgba(20, 20, 30, 0.35)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3535
  `#### `rgba(20, 20, 30, 0.35)` (1 occurrences)`
- **audit-BEFORE.md** line 3538
  ``background-color: rgba(20, 20, 30, 0.35);``
- **src\styles\components\presentation\ReaderNav.css** line 759
  `background-color: rgba(20, 20, 30, 0.35);`

#### `rgba(255, 255, 255, 0.05)` (4 occurrences)

- **audit-BEFORE.md** line 314
  `| `rgba(255, 255, 255, 0.05)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3540
  `#### `rgba(255, 255, 255, 0.05)` (1 occurrences)`
- **audit-BEFORE.md** line 3543
  ``0 0 0 1px rgba(255, 255, 255, 0.05);``
- **src\styles\components\presentation\ReaderNav.css** line 909
  `0 0 0 1px rgba(255, 255, 255, 0.05);`

#### `rgba(255, 255, 255, 0.85)` (4 occurrences)

- **audit-BEFORE.md** line 315
  `| `rgba(255, 255, 255, 0.85)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3545
  `#### `rgba(255, 255, 255, 0.85)` (1 occurrences)`
- **audit-BEFORE.md** line 3548
  ``color: rgba(255, 255, 255, 0.85);``
- **src\styles\pages\service-detail.css** line 273
  `color: rgba(255, 255, 255, 0.85);`

#### `rgba(255,255,255,0.3)` (4 occurrences)

- **audit-BEFORE.md** line 374
  `| `rgba(255,255,255,0.3)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3840
  `#### `rgba(255,255,255,0.3)` (1 occurrences)`
- **audit-BEFORE.md** line 3843
  ``box-shadow: inset 0 1px 2px rgba(255,255,255,0.3);``
- **src\styles\themes\Preview\theme-cards.css** line 76
  `box-shadow: inset 0 1px 2px rgba(255,255,255,0.3);`

#### `rgba(var(--brand-c-primary-rgb, 99, 102, 241)` (4 occurrences)

- **audit-BEFORE.md** line 2857
  ``0 0 30px rgba(var(--brand-c-primary-rgb, 99, 102, 241), 0.4),``
- **audit-BEFORE.md** line 2859
  ``0 0 60px rgba(var(--brand-c-primary-rgb, 99, 102, 241), 0.2),``
- **src\styles\components\presentation\ReaderNav.css** line 873
  `0 0 30px rgba(var(--brand-c-primary-rgb, 99, 102, 241), 0.4),`
- **src\styles\components\presentation\ReaderNav.css** line 874
  `0 0 60px rgba(var(--brand-c-primary-rgb, 99, 102, 241), 0.2),`

#### `hsl(h, news, l)` (4 occurrences)

- **audit-BEFORE.md** line 260
  `| `hsl(h, news, l)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3270
  `#### `hsl(h, news, l)` (1 occurrences)`
- **audit-BEFORE.md** line 3273
  ``return chroma.hsl(h, newS, l);``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1089
  `return chroma.hsl(h, newS, l);`

#### `hsl(warmh, news, newl)` (4 occurrences)

- **audit-BEFORE.md** line 261
  `| `hsl(warmh, news, newl)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3275
  `#### `hsl(warmh, news, newl)` (1 occurrences)`
- **audit-BEFORE.md** line 3278
  ``return chroma.hsl(warmH, newS, newL);``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1096
  `return chroma.hsl(warmH, newS, newL);`

#### `hsl(hue, sat, light)` (4 occurrences)

- **audit-BEFORE.md** line 262
  `| `hsl(hue, sat, light)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3280
  `#### `hsl(hue, sat, light)` (1 occurrences)`
- **audit-BEFORE.md** line 3283
  ``return chroma.hsl(hue, sat, light).hex();``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1173
  `return chroma.hsl(hue, sat, light).hex();`

#### `hsl((h1 + 180)` (4 occurrences)

- **audit-BEFORE.md** line 263
  `| `hsl((h1 + 180)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3285
  `#### `hsl((h1 + 180)` (1 occurrences)`
- **audit-BEFORE.md** line 3288
  ``secondaryColor = chroma.hsl((h1 + 180) % 360, s1 * 0.9, l1).hex();``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1294
  `secondaryColor = chroma.hsl((h1 + 180) % 360, s1 * 0.9, l1).hex();`

#### `hsl((h1 + 30)` (4 occurrences)

- **audit-BEFORE.md** line 264
  `| `hsl((h1 + 30)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3290
  `#### `hsl((h1 + 30)` (1 occurrences)`
- **audit-BEFORE.md** line 3293
  ``palette.push(chroma.hsl((h1 + 30) % 360, s1 * 0.95, l1 * 1.05).hex());``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1308
  `palette.push(chroma.hsl((h1 + 30) % 360, s1 * 0.95, l1 * 1.05).hex());`

#### `hsl((h2 - 30 + 360)` (4 occurrences)

- **audit-BEFORE.md** line 265
  `| `hsl((h2 - 30 + 360)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3295
  `#### `hsl((h2 - 30 + 360)` (1 occurrences)`
- **audit-BEFORE.md** line 3298
  ``palette.push(chroma.hsl((h2 - 30 + 360) % 360, s2 * 0.95, l2 * 1.05).hex());``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1311
  `palette.push(chroma.hsl((h2 - 30 + 360) % 360, s2 * 0.95, l2 * 1.05).hex());`

#### `hsl((h1 + 120)` (4 occurrences)

- **audit-BEFORE.md** line 266
  `| `hsl((h1 + 120)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3300
  `#### `hsl((h1 + 120)` (1 occurrences)`
- **audit-BEFORE.md** line 3303
  ``palette.push(chroma.hsl((h1 + 120) % 360, s1 * 0.85, l1 * 0.95).hex());``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1314
  `palette.push(chroma.hsl((h1 + 120) % 360, s1 * 0.85, l1 * 0.95).hex());`

#### `hsl((h2 + 120)` (4 occurrences)

- **audit-BEFORE.md** line 267
  `| `hsl((h2 + 120)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3305
  `#### `hsl((h2 + 120)` (1 occurrences)`
- **audit-BEFORE.md** line 3308
  ``palette.push(chroma.hsl((h2 + 120) % 360, s2 * 0.85, l2 * 0.95).hex());``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1317
  `palette.push(chroma.hsl((h2 + 120) % 360, s2 * 0.85, l2 * 0.95).hex());`

#### `hsl((avghue + 45)` (4 occurrences)

- **audit-BEFORE.md** line 269
  `| `hsl((avghue + 45)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3315
  `#### `hsl((avghue + 45)` (1 occurrences)`
- **audit-BEFORE.md** line 3318
  ``palette.push(chroma.hsl((avgHue + 45) % 360, avgSat * 1.05, avgLight).hex());``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1330
  `palette.push(chroma.hsl((avgHue + 45) % 360, avgSat * 1.05, avgLight).hex());`

#### `hsl(h, s * 0.6, math.min(0.75, l * 1.15)` (4 occurrences)

- **audit-BEFORE.md** line 270
  `| `hsl(h, s * 0.6, math.min(0.75, l * 1.15)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3320
  `#### `hsl(h, s * 0.6, math.min(0.75, l * 1.15)` (1 occurrences)`
- **audit-BEFORE.md** line 3323
  ``return chroma.hsl(h, s * 0.6, Math.min(0.75, l * 1.15)).hex();``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1460
  `return chroma.hsl(h, s * 0.6, Math.min(0.75, l * 1.15)).hex();`

#### `hsl(h, math.min(1, s * 1.3)` (4 occurrences)

- **audit-BEFORE.md** line 271
  `| `hsl(h, math.min(1, s * 1.3)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3325
  `#### `hsl(h, math.min(1, s * 1.3)` (1 occurrences)`
- **audit-BEFORE.md** line 3328
  ``return chroma.hsl(h, Math.min(1, s * 1.3), Math.max(0.5, Math.min(0.7, l))).hex();``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1464
  `return chroma.hsl(h, Math.min(1, s * 1.3), Math.max(0.5, Math.min(0.7, l))).hex();`

#### `hsl(h, s * 0.5, math.min(0.7, l * 1.1)` (4 occurrences)

- **audit-BEFORE.md** line 272
  `| `hsl(h, s * 0.5, math.min(0.7, l * 1.1)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3330
  `#### `hsl(h, s * 0.5, math.min(0.7, l * 1.1)` (1 occurrences)`
- **audit-BEFORE.md** line 3333
  ``return chroma.hsl(h, s * 0.5, Math.min(0.7, l * 1.1)).hex();``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1468
  `return chroma.hsl(h, s * 0.5, Math.min(0.7, l * 1.1)).hex();`

#### `hsl(h, math.min(1, s * 1.4)` (4 occurrences)

- **audit-BEFORE.md** line 273
  `| `hsl(h, math.min(1, s * 1.4)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3335
  `#### `hsl(h, math.min(1, s * 1.4)` (1 occurrences)`
- **audit-BEFORE.md** line 3338
  ``return chroma.hsl(h, Math.min(1, s * 1.4), Math.max(0.45, Math.min(0.65, l))).hex();``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1472
  `return chroma.hsl(h, Math.min(1, s * 1.4), Math.max(0.45, Math.min(0.65, l))).hex();`

#### `hsl(h, math.min(0.9, s * 1.1)` (4 occurrences)

- **audit-BEFORE.md** line 274
  `| `hsl(h, math.min(0.9, s * 1.1)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3340
  `#### `hsl(h, math.min(0.9, s * 1.1)` (1 occurrences)`
- **audit-BEFORE.md** line 3343
  ``return chroma.hsl(h, Math.min(0.9, s * 1.1), Math.max(0.3, l * 0.8)).hex();``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1476
  `return chroma.hsl(h, Math.min(0.9, s * 1.1), Math.max(0.3, l * 0.8)).hex();`

#### `hsl((h + 10)` (4 occurrences)

- **audit-BEFORE.md** line 275
  `| `hsl((h + 10)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3345
  `#### `hsl((h + 10)` (1 occurrences)`
- **audit-BEFORE.md** line 3348
  ``return chroma.hsl((h + 10) % 360, s * 0.55, Math.min(0.65, l)).hex();``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1480
  `return chroma.hsl((h + 10) % 360, s * 0.55, Math.min(0.65, l)).hex();`

#### `hsl(h, s * 0.75, l)` (4 occurrences)

- **audit-BEFORE.md** line 276
  `| `hsl(h, s * 0.75, l)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3350
  `#### `hsl(h, s * 0.75, l)` (1 occurrences)`
- **audit-BEFORE.md** line 3353
  ``return chroma.hsl(h, s * 0.75, l).hex();``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1484
  `return chroma.hsl(h, s * 0.75, l).hex();`

#### `hsl(neutralhue, saturation, lightness)` (4 occurrences)

- **audit-BEFORE.md** line 277
  `| `hsl(neutralhue, saturation, lightness)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3355
  `#### `hsl(neutralhue, saturation, lightness)` (1 occurrences)`
- **audit-BEFORE.md** line 3358
  ``scale[pos] = chroma.hsl(neutralHue, saturation, lightness).hex();``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1720
  `scale[pos] = chroma.hsl(neutralHue, saturation, lightness).hex();`

#### `hsl(newhue, saturation, lightness)` (4 occurrences)

- **audit-BEFORE.md** line 294
  `| `hsl(newhue, saturation, lightness)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3440
  `#### `hsl(newhue, saturation, lightness)` (1 occurrences)`
- **audit-BEFORE.md** line 3443
  ``return chroma.hsl(newHue, saturation, lightness).hex();``
- **src\scripts\ThemeTokenGen\simple-theme-gen.js** line 63
  `return chroma.hsl(newHue, saturation, lightness).hex();`

#### `hsl(hsl[0] || 0, hsl[1], targetlightness)` (4 occurrences)

- **audit-BEFORE.md** line 295
  `| `hsl(hsl[0] || 0, hsl[1], targetlightness)` | 1 | 1 | Review — single use |`
- **audit-BEFORE.md** line 3445
  `#### `hsl(hsl[0] || 0, hsl[1], targetlightness)` (1 occurrences)`
- **audit-BEFORE.md** line 3448
  ``const fallbackColor = chroma.hsl(hsl[0] || 0, hsl[1], targetLightness);``
- **src\scripts\ThemeTokenGen\simple-theme-gen.js** line 138
  `const fallbackColor = chroma.hsl(hsl[0] || 0, hsl[1], targetLightness);`

#### `orange` (3 occurrences)

- **audit-BEFORE.md** line 2080
  ``--color-Warning    /* #ff9800 - orange */``
- **audit-BEFORE.md** line 2500
  ``--color-Warning    /* #ff9800 - orange */``
- **docs\Markdown Notes\CSS-Tokens.md** line 93
  `--color-Warning    /* #ff9800 - orange */`

#### `pink` (3 occurrences)

- **audit-BEFORE.md** line 2098
  ``background: var(--confetti-pink, #FF99C8);``
- **audit-BEFORE.md** line 2386
  ``background: var(--confetti-pink, #FF99C8);``
- **src\styles\buttons\confetti-button.css** line 48
  `background: var(--confetti-pink, #FF99C8);`

#### `coral` (3 occurrences)

- **audit-BEFORE.md** line 2479
  ``"colorName": "Dusty Coral",``
- **docs\Brand\BRAND-PROFILE.json** line 41
  `"colorName": "Dusty Coral",`
- **docs\Brand\BRAND-PROFILE.json** line 268
  `"summary": "Our color palette reflects calm, warmth, and gentle hope. Soft neutrals (warm beige, light grays) create a c`

#### `silver` (3 occurrences)

- **audit-BEFORE.md** line 3168
  ``colors.push({ color: '#C0C0C0', theory: 'Metallic Silver' });``
- **audit-BEFORE.md** line 3423
  ``colors.push({ color: '#C0C0C0', theory: 'Metallic Silver' });``
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 1128
  `colors.push({ color: '#C0C0C0', theory: 'Metallic Silver' });`

#### `rgba(var(--color-primary-500-rgb, 99, 102, 241)` (2 occurrences)

- **audit-BEFORE.md** line 182
  `| `rgba(var(--color-primary-500-rgb, 99, 102, 241)` | 2 | 1 | Consider creating token |`
- **audit-BEFORE.md** line 2854
  `#### `rgba(var(--color-primary-500-rgb, 99, 102, 241)` (2 occurrences)`

#### `teal` (2 occurrences)

- **audit-BEFORE.md** line 1823
  ``- design/confetti.css (1 use - teal confetti color)``
- **docs\reports\color-token-usage-report.md** line 58
  `- design/confetti.css (1 use - teal confetti color)`

#### `gray` (2 occurrences)

- **audit-BEFORE.md** line 2953
  ``"colorName": "Charcoal Gray",``
- **docs\Brand\BRAND-PROFILE.json** line 55
  `"colorName": "Charcoal Gray",`

---

## 🔴 Hardcoded Colours By File

Files sorted by number of hardcoded colours (worst offenders first).

| File | Hardcoded Count | Types |
|------|----------------|-------|
| `audit-BEFORE.md` | 2483 | hex, hsl, named, rgb |
| `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 130 | hex, hsl, named, rgb |
| `src\styles\base\utilities.css` | 56 | hex, named |
| `docs\todo\TODO.md` | 53 | hex, named, rgb |
| `src\styles\a11y\pages\asset-detail.css` | 49 | hex |
| `docs\Brand\BRAND-PROFILE.json` | 46 | hex, named, rgb |
| `src\styles\components\presentation\ReaderNav.css` | 43 | named, rgb |
| `docs\Markdown Notes\accessibility-color-themes.md` | 33 | hex |
| `src\components\Grids\RelatedGrid.astro` | 32 | named, rgb |
| `src\scripts\ThemeTokenGen\color-theory-comparison.js` | 28 | hex, hsl, named, rgb |
| `src\styles\themes\Preview\coretokens.css` | 27 | hex, named |
| `src\styles\a11y\base\theme-overrides.css` | 25 | hex, named |
| `src\lib\emailit.ts` | 23 | hex, named, rgb |
| `src\styles\buttons\basic-button.css` | 22 | named |
| `src\scripts\ThemeTokenGen\brand-template.css` | 21 | hex |
| `src\styles\tokens\shadows.css` | 21 | named, rgb |
| `src\styles\themes\a11y\a11y-dark.css` | 18 | hex |
| `docs\Brand\COMPLETE-BRAND-SCHEMA.md` | 16 | hex |
| `files\example-a11y-cream-NEW.css` | 16 | hex, named |
| `src\scripts\ThemeTokenGen\preview-colors.js` | 16 | hex, named, rgb |
| `src\styles\themes\a11y\a11y-cream.css` | 16 | hex, named |
| `src\styles\themes\a11y\a11y-deuteranopia.css` | 16 | hex, named |
| `src\styles\themes\a11y\a11y-high-contrast.css` | 16 | hex, named |
| `src\styles\themes\a11y\a11y-monochrome.css` | 16 | hex, named |
| `src\styles\themes\a11y\a11y-protanopia.css` | 16 | hex, named |
| `src\styles\themes\a11y\a11y-tritanopia.css` | 16 | hex, named |
| `src\styles\themes\brand\BrandDefault.css` | 16 | hex, named |
| `src\pages\api\contact.ts` | 15 | hex, named, rgb |
| `src\styles\a11y\components\masonry-grid.css` | 15 | hex, named, rgb |
| `docs\Markdown Notes\CSS-Tokens.md` | 14 | hex, named, rgb |
| `src\scripts\ThemeTokenGen\color-input.css` | 14 | hex, named |
| `src\lib\animation\particle-burst.ts` | 13 | hex, named, rgb |
| `src\styles\a11y\components\search-overlay.css` | 13 | hex |
| `src\styles\a11y\motion\reduced-motion.css` | 13 | hex, named |
| `src\styles\pages\service-detail.css` | 13 | hex, named, rgb |
| `files\example-BrandDefault-NEW.css` | 12 | hex, named |
| `src\styles\pages\asset-detail.css` | 12 | hex, rgb |
| `src\lib\animation\hero-morph.ts` | 11 | hex |
| `docs\reports\color-token-usage-report.md` | 10 | hex, named |
| `src\components\Presentation\Sections\TitleSection.astro` | 10 | named, rgb |
| `src\styles\a11y\components\switcher.css` | 10 | hex, named |
| `src\components\Badge\Badge.astro` | 9 | named, rgb |
| `src\components\Grids\ForYouGrid.astro` | 9 | named, rgb |
| `src\styles\pages\services.css` | 9 | hex, named |
| `docs\Markdown Notes\Theme-Preview-System.md` | 8 | hex |
| `docs\reports\FIXES-APPLIED.md` | 8 | hex |
| `src\styles\components\search-results.css` | 8 | named |
| `src\styles\tokens\status.css` | 8 | hex, named |
| `src\styles\tokens\gradients.css` | 7 | named, rgb |
| `src\components\ContactForm\Contact-Popup.astro` | 6 | named |
| `src\components\Presentation\Sections\FullWidthSection.astro` | 6 | named, rgb |
| `src\styles\a11y\visual\text-only.css` | 6 | hex, named |
| `src\styles\buttons\confetti-button.css` | 6 | hex, named |
| `src\styles\components\philosophy-flip-cards.css` | 6 | named, rgb |
| `src\pages\search.astro` | 5 | named |
| `src\pages\services\[slug].astro` | 5 | hex, named |
| `src\styles\a11y\base\print.css` | 5 | hex, named |
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

- **audit-BEFORE.md** line 1193
  `#000000`
- **audit-BEFORE.md** line 2210
  `font-size: 0.9rem; color: #555;`
- **audit-BEFORE.md** line 2228
  `background: #999; flex: 1;`
- **audit-BEFORE.md** line 2768
  `background: #4A90E2;`
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
  `font-size: 0.85rem; font-weight: 600; color: var(--brand-c-text); margin-bottom: 0.5rem; display: block;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 769
  `font-size: 0.85rem; font-weight: 600; color: var(--brand-c-text); margin-bottom: 0.5rem; display: block;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 777
  `padding: 0.75rem 1rem; border-radius: 10px; border: 2px solid var(--brand-c-neutral); font-size: 1rem; flex: 1; min-widt`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 794
  `background: #999; flex: 1;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 795
  `background: #4A90E2; color: var(--color-White); flex: 0.5; min-width: 150px;`
- **src\scripts\ThemeTokenGen\interactive-palette-builder.html** line 796
  `background: #E74C3C; color: var(--color-White); flex: 0.5; min-width: 150px;`
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
| `--a11y-hc-border` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 26 |
| `--border-focus` | `var(--color-Info-500)` | `docs\todo\TODO.md` | 369 |
| `--border-medium` | `var(--brand-c-neutral)` | `docs\todo\TODO.md` | 366 |
| `--border-strong` | `var(--brand-c-neutral-dark)` | `docs\todo\TODO.md` | 367 |
| `--border-width-4` | `4px` | `src\styles\tokens\spacing.css` | 48 |
| `--brand-accent1` | `#9C8579` | `audit-BEFORE.md` | 1977 |
| `--brand-accent1` | `#9C8579` | `audit-BEFORE.md` | 1979 |
| `--brand-accent1` | `#8ac7b2` | `audit-BEFORE.md` | 3113 |
| `--brand-accent1` | `#9C8579` | `src\scripts\ThemeTokenGen\brand-template.css` | 13 |
| `--brand-accent1` | `#9C8579` | `src\scripts\ThemeTokenGen\brand-template.css` | 64 |
| `--brand-accent1` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 29 |
| `--brand-accent1` | `#8ac7b2` | `src\scripts\ThemeTokenGen\color-input.css` | 77 |
| `--brand-accent1` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 24 |
| `--brand-accent2` | `#8390b5` | `audit-BEFORE.md` | 1990 |
| `--brand-accent2` | `#c78a9f` | `audit-BEFORE.md` | 3118 |
| `--brand-accent2` | `#8390b5` | `src\scripts\ThemeTokenGen\brand-template.css` | 68 |
| `--brand-accent2` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 32 |
| `--brand-accent2` | `#c78a9f` | `src\scripts\ThemeTokenGen\color-input.css` | 78 |
| `--brand-accent2` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 32 |
| `--brand-accent3` | `#978692` | `audit-BEFORE.md` | 2001 |
| `--brand-accent3` | `#8abdc7` | `audit-BEFORE.md` | 3123 |
| `--brand-accent3` | `#978692` | `src\scripts\ThemeTokenGen\brand-template.css` | 72 |
| `--brand-accent3` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 33 |
| `--brand-accent3` | `#8abdc7` | `src\scripts\ThemeTokenGen\color-input.css` | 79 |
| `--brand-accent3` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 33 |
| `--brand-accent4` | `#3e4a5a` | `audit-BEFORE.md` | 2703 |
| `--brand-accent4` | `#bdc78a` | `audit-BEFORE.md` | 3128 |
| `--brand-accent4` | `#3e4a5a` | `src\scripts\ThemeTokenGen\brand-template.css` | 76 |
| `--brand-accent4` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 36 |
| `--brand-accent4` | `#bdc78a` | `src\scripts\ThemeTokenGen\color-input.css` | 80 |
| `--brand-accent4` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 41 |
| `--brand-accent5` | `#a28aad` | `audit-BEFORE.md` | 2710 |
| `--brand-accent5` | `#938ac7` | `audit-BEFORE.md` | 3138 |
| `--brand-accent5` | `#a28aad` | `src\scripts\ThemeTokenGen\brand-template.css` | 80 |
| `--brand-accent5` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 39 |
| `--brand-accent5` | `#938ac7` | `src\scripts\ThemeTokenGen\color-input.css` | 82 |
| `--brand-accent5` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 42 |
| `--brand-background` | `#EEEBE2` | `audit-BEFORE.md` | 2530 |
| `--brand-background` | `#f2efd4` | `audit-BEFORE.md` | 3098 |
| `--brand-background` | `#EEEBE2` | `src\scripts\ThemeTokenGen\brand-template.css` | 43 |
| `--brand-background` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 46 |
| `--brand-background` | `#f2efd4` | `src\scripts\ThemeTokenGen\color-input.css` | 74 |
| `--brand-background` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 47 |
| `--brand-background-dark` | `#2a3328` | `audit-BEFORE.md` | 1391 |
| `--brand-background-dark` | `#394e43` | `audit-BEFORE.md` | 2614 |
| `--brand-background-dark` | `#0e3f2e` | `audit-BEFORE.md` | 2717 |
| `--brand-background-dark` | `#2a3328` | `audit-BEFORE.md` | 3093 |
| `--brand-background-dark` | `#394e43` | `src\scripts\ThemeTokenGen\brand-template.css` | 48 |
| `--brand-background-dark` | `#2a3328` | `src\scripts\ThemeTokenGen\color-input.css` | 50 |
| `--brand-background-dark` | `#0e3f2e` | `src\scripts\ThemeTokenGen\color-input.css` | 83 |
| `--brand-background-dark` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 50 |
| `--brand-neutral` | `#FDF8F3` | `audit-BEFORE.md` | 3068 |
| `--brand-neutral` | `#c7948a` | `audit-BEFORE.md` | 3133 |
| `--brand-neutral` | `#FDF8F3` | `src\scripts\ThemeTokenGen\brand-template.css` | 60 |
| `--brand-neutral` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 58 |
| `--brand-neutral` | `#c7948a` | `src\scripts\ThemeTokenGen\color-input.css` | 81 |
| `--brand-neutral` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 58 |
| `--brand-secondary` | `#C4907C` | `audit-BEFORE.md` | 1362 |
| `--brand-secondary` | `#b9a26e` | `audit-BEFORE.md` | 3108 |
| `--brand-secondary` | `auto` | `src\scripts\ThemeTokenGen\brand-template.css` | 10 |
| `--brand-secondary` | `#C4907C` | `src\scripts\ThemeTokenGen\brand-template.css` | 38 |
| `--brand-secondary` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 28 |
| `--brand-secondary` | `#b9a26e` | `src\scripts\ThemeTokenGen\color-input.css` | 76 |
| `--brand-secondary` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 23 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `files\example-a11y-cream-NEW.css` | 48 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `files\example-BrandDefault-NEW.css` | 48 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 27 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 34 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 27 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 32 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 27 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 27 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 27 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `src\styles\themes\brand\BrandDefault.css` | 48 |
| `--btn-icon-color` | `${iconColor` | `src\components\Button\Button.astro` | 81 |
| `--btn-icon-hover` | `${iconHoverColor` | `src\components\Button\Button.astro` | 82 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `files\example-a11y-cream-NEW.css` | 47 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `files\example-BrandDefault-NEW.css` | 47 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 26 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 33 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 26 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 31 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 26 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 26 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 26 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `src\styles\themes\brand\BrandDefault.css` | 47 |
| `--btn-text-hover` | `${textHoverColor` | `src\components\Button\Button.astro` | 80 |
| `--color-Info-100` | `${toOKLCH(chroma.hsl(215, 0.4 * satAdjust, 0.92 * lightAdjust).hex())` | `audit-BEFORE.md` | 3408 |
| `--color-Info-100` | `${toOKLCH(chroma.hsl(215, 0.4 * satAdjust, 0.92 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1941 |
| `--color-Info-200` | `${toOKLCH(chroma.hsl(215, 0.6 * satAdjust, 0.80 * lightAdjust).hex())` | `audit-BEFORE.md` | 3413 |
| `--color-Info-200` | `${toOKLCH(chroma.hsl(215, 0.6 * satAdjust, 0.80 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1942 |
| `--dropdown-hover-bg` | `var(--brand-c-primary-light)` | `src\styles\buttons\dropdown-tokens.css` | 9 |
| `--dropdown-hover-text` | `var(--brand-c-primary-dark)` | `src\styles\buttons\dropdown-tokens.css` | 10 |
| `--error` | `var(--color-Error)` | `docs\Markdown Notes\accessibility-color-themes.md` | 40 |
| `--feedback-error-border` | `var(--color-Error)` | `docs\todo\TODO.md` | 384 |
| `--feedback-warning-bg` | `var(--color-Warning)` | `docs\todo\TODO.md` | 385 |
| `--font-secondary` | `'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | `src\styles\tokens\typography.css` | 14 |
| `--form-bg` | `var(--color-White)` | `audit-BEFORE.md` | 410 |
| `--form-bg` | `var(--color-White)` | `docs\todo\TODO.md` | 389 |
| `--form-border` | `var(--brand-c-neutral)` | `docs\todo\TODO.md` | 390 |
| `--form-border-error` | `var(--color-Error)` | `docs\todo\TODO.md` | 393 |
| `--form-border-focus` | `var(--brand-c-primary)` | `docs\todo\TODO.md` | 392 |
| `--form-border-hover` | `var(--brand-c-neutral)` | `docs\todo\TODO.md` | 391 |
| `--form-border-success` | `var(--color-Success)` | `docs\todo\TODO.md` | 394 |
| `--form-invalid-bg` | `color-mix(in oklch, var(--feedback-error-bg) 5%, transparent)` | `docs\todo\TODO.md` | 395 |
| `--form-valid-bg` | `color-mix(in oklch, var(--feedback-success-bg) 5%, transparent)` | `docs\todo\TODO.md` | 396 |
| `--glass-card-bg` | `color-mix(in oklch, var(--brand-c-bg) 15%, transparent)` | `src\styles\tokens\shadows.css` | 96 |
| `--glass-card-bg` | `color-mix(in oklch, var(--brand-c-bg-dark) 25%, transparent)` | `src\styles\tokens\shadows.css` | 107 |
| `--glass-card-border` | `color-mix(in oklch, var(--brand-c-bg) 18%, transparent)` | `src\styles\tokens\shadows.css` | 99 |
| `--glass-card-border` | `color-mix(in oklch, var(--brand-c-bg) 10%, transparent)` | `src\styles\tokens\shadows.css` | 108 |
| `--glass-card-shadow` | `0 8px 24px 0 color-mix(in oklch, var(--brand-c-primary-dark) 30%, transparent)` | `src\styles\tokens\shadows.css` | 98 |
| `--glass-overlay-bg` | `color-mix(in oklch, var(--brand-c-bg) 5%, transparent)` | `src\styles\tokens\shadows.css` | 91 |
| `--glass-overlay-bg` | `color-mix(in oklch, var(--brand-c-bg-dark) 10%, transparent)` | `src\styles\tokens\shadows.css` | 106 |
| `--glass-overlay-shadow` | `0 4px 16px 0 color-mix(in oklch, var(--brand-c-primary-dark) 20%, transparent)` | `src\styles\tokens\shadows.css` | 93 |
| `--glass-surface-bg` | `color-mix(in oklch, var(--brand-c-bg) 10%, transparent)` | `src\styles\tokens\shadows.css` | 86 |
| `--glass-surface-bg` | `color-mix(in oklch, var(--brand-c-bg-dark) 20%, transparent)` | `src\styles\tokens\shadows.css` | 105 |
| `--glass-surface-blur` | `12px` | `src\styles\tokens\shadows.css` | 87 |
| `--glass-surface-shadow` | `0 8px 32px 0 color-mix(in oklch, var(--brand-c-primary-dark) 37%, transparent)` | `src\styles\tokens\shadows.css` | 88 |
| `--glint-gradient-strong` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)` | `audit-BEFORE.md` | 2635 |
| `--glint-gradient-strong` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)` | `src\styles\tokens\shadows.css` | 74 |
| `--glint-gradient-subtle` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)` | `audit-BEFORE.md` | 1758 |
| `--glint-gradient-subtle` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)` | `src\styles\tokens\shadows.css` | 75 |
| `--gradient-accent-border` | `linear-gradient(90deg, var(--brand-c-primary-dark) 0%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 226 |
| `--gradient-accent1-glow` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 30%, var(--brand-c-neutral-dark) 60%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 103 |
| `--gradient-accent1-intense` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 102 |
| `--gradient-accent1-light` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 100%)` | `src\styles\tokens\gradients.css` | 101 |
| `--gradient-accent1-soft` | `linear-gradient(135deg, var(--brand-c-neutral) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 100 |
| `--gradient-accent2-glow` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 30%, var(--brand-c-neutral-dark) 60%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 110 |
| `--gradient-accent2-intense` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 109 |
| `--gradient-accent2-light` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 100%)` | `src\styles\tokens\gradients.css` | 108 |
| `--gradient-accent2-soft` | `linear-gradient(135deg, var(--brand-c-neutral) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 107 |
| `--gradient-accent3` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 113 |
| `--gradient-accent3-glow` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 30%, var(--brand-c-neutral-dark) 60%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 117 |
| `--gradient-accent3-intense` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 116 |
| `--gradient-accent3-light` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 100%)` | `src\styles\tokens\gradients.css` | 115 |
| `--gradient-accent3-soft` | `linear-gradient(135deg, var(--brand-c-neutral) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 114 |
| `--gradient-accent4` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 120 |
| `--gradient-accent4-glow` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 30%, var(--brand-c-neutral-dark) 60%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 124 |
| `--gradient-accent4-intense` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 123 |
| `--gradient-accent4-light` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 100%)` | `src\styles\tokens\gradients.css` | 122 |
| `--gradient-accent4-soft` | `linear-gradient(135deg, var(--brand-c-neutral) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 121 |
| `--gradient-accent5` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 127 |
| `--gradient-accent5-glow` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 30%, var(--brand-c-neutral-dark) 60%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 131 |
| `--gradient-accent5-intense` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 130 |
| `--gradient-accent5-light` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 100%)` | `src\styles\tokens\gradients.css` | 129 |
| `--gradient-accent5-soft` | `linear-gradient(135deg, var(--brand-c-neutral) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 128 |
| `--gradient-background-glow` | `linear-gradient(135deg, var(--brand-c-bg) 0%, var(--brand-c-bg-light) 30%, var(--brand-c-bg-light) 60%, var(--brand-c-neutral) 100%)` | `src\styles\tokens\gradients.css` | 183 |
| `--gradient-background-radial` | `radial-gradient(circle at center, var(--brand-c-bg) 0%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 186 |
| `--gradient-background-radial-complex` | `radial-gradient(ellipse at 40% 60%, var(--brand-c-bg) 0%, var(--brand-c-bg-light) 40%, var(--brand-c-neutral-light) 80%, var(--brand-c-neutral) 100%)` | `src\styles\tokens\gradients.css` | 188 |
| `--gradient-background-radial-soft` | `radial-gradient(circle at 30% 30%, var(--brand-c-bg) 0%, var(--brand-c-bg-light) 50%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 187 |
| `--gradient-background-rainbow` | `linear-gradient(135deg, var(--brand-c-bg) 0%, var(--brand-c-bg) 25%, var(--brand-c-bg-light) 50%, var(--brand-c-bg-light) 75%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 181 |
| `--gradient-background-soft` | `linear-gradient(135deg, var(--brand-c-bg) 0%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 176 |
| `--gradient-background-wave` | `linear-gradient(90deg, var(--brand-c-bg) 0%, var(--brand-c-bg-light) 20%, var(--brand-c-bg-light) 40%, var(--brand-c-bg-light) 60%, var(--brand-c-bg-light) 80%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 182 |
| `--gradient-brand-burst` | `radial-gradient(ellipse at 30% 30%, var(--brand-c-primary-light) 0%, var(--brand-c-secondary) 30%, var(--brand-c-bg-light) 60%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 156 |
| `--gradient-brand-radial` | `radial-gradient(circle at center, var(--brand-c-bg) 0%, var(--brand-c-primary) 40%, var(--brand-c-secondary-dark) 80%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 155 |
| `--gradient-btn-ghost-hover` | `linear-gradient(135deg, color-mix(in oklch, var(--brand-c-text) 10%, transparent) 0%, color-mix(in oklch, var(--brand-c-text) 20%, transparent) 100%)` | `src\styles\tokens\gradients.css` | 201 |
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
| `--gradient-error` | `linear-gradient(135deg, var(--color-Danger) 0%, color-mix(in oklch, var(--color-Danger) 70%, black) 10`` | `audit-BEFORE.md` | 1012 |
| `--gradient-error` | `linear-gradient(135deg, var(--color-Danger) 0%, color-mix(in oklch, var(--color-Danger) 70%, black) 100%)` | `src\styles\tokens\gradients.css` | 235 |
| `--gradient-header-subtle` | `linear-gradient(180deg, var(--brand-c-bg-light) 0%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 208 |
| `--gradient-light-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 379 |
| `--gradient-light-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 387 |
| `--gradient-light-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 395 |
| `--gradient-light-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 403 |
| `--gradient-light-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 411 |
| `--gradient-light-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 363 |
| `--gradient-light-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 371 |
| `--gradient-overlay-dark` | `linear-gradient(180deg, transparent 0%, color-mix(in oklch, var(--brand-c-bg-dark) 70%, transparent) 100%)` | `src\styles\tokens\gradients.css` | 223 |
| `--gradient-overlay-light` | `linear-gradient(180deg, color-mix(in oklch, var(--brand-c-bg) 90%, transparent) 0%, transparent 100%)` | `src\styles\tokens\gradients.css` | 224 |
| `--gradient-pastel-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 658 |
| `--gradient-pastel-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 668 |
| `--gradient-pastel-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 678 |
| `--gradient-pastel-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 688 |
| `--gradient-pastel-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 698 |
| `--gradient-pastel-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 637 |
| `--gradient-pastel-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 648 |
| `--gradient-primary-glow` | `linear-gradient(135deg, var(--brand-c-primary-light) 0%, var(--brand-c-primary) 30%, var(--brand-c-primary-dark) 60%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 67 |
| `--gradient-primary-intense` | `linear-gradient(135deg, var(--brand-c-primary-dark) 0%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 62 |
| `--gradient-primary-radial` | `radial-gradient(circle at 30% 40%, var(--brand-c-primary) 0%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 70 |
| `--gradient-primary-radial-center` | `radial-gradient(circle at center, var(--brand-c-primary-light) 0%, var(--brand-c-primary-dark) 50%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 71 |
| `--gradient-primary-radial-complex` | `radial-gradient(ellipse at 20% 30%, var(--brand-c-primary-light) 0%, var(--brand-c-primary) 40%, var(--brand-c-primary-dark) 80%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 72 |
| `--gradient-primary-rainbow` | `linear-gradient(135deg, var(--brand-c-primary-light) 0%, var(--brand-c-primary) 25%, var(--brand-c-primary-dark) 50%, var(--brand-c-primary-dark) 75%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 65 |
| `--gradient-primary-wave` | `linear-gradient(90deg, var(--brand-c-primary) 0%, var(--brand-c-primary-dark) 20%, var(--brand-c-primary) 40%, var(--brand-c-primary-dark) 60%, var(--brand-c-primary-dark) 80%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 66 |
| `--gradient-rainbow-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 282 |
| `--gradient-rainbow-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 295 |
| `--gradient-rainbow-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 308 |
| `--gradient-rainbow-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 321 |
| `--gradient-rainbow-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 334 |
| `--gradient-rainbow-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 256 |
| `--gradient-rainbow-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 269 |
| `--gradient-secondary-glow` | `linear-gradient(135deg, var(--brand-c-secondary-light) 0%, var(--brand-c-secondary) 30%, var(--brand-c-secondary-dark) 60%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 87 |
| `--gradient-secondary-intense` | `linear-gradient(135deg, var(--brand-c-secondary-dark) 0%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 82 |
| `--gradient-secondary-light` | `linear-gradient(135deg, var(--brand-c-secondary-light) 0%, var(--brand-c-secondary) 100%)` | `src\styles\tokens\gradients.css` | 81 |
| `--gradient-secondary-radial` | `radial-gradient(circle at 70% 30%, var(--brand-c-secondary) 0%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 90 |
| `--gradient-secondary-radial-center` | `radial-gradient(circle at center, var(--brand-c-secondary-light) 0%, var(--brand-c-secondary) 50%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 91 |
| `--gradient-secondary-radial-complex` | `radial-gradient(ellipse at 80% 20%, var(--brand-c-secondary-light) 0%, var(--brand-c-secondary) 40%, var(--brand-c-secondary-dark) 80%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 92 |
| `--gradient-secondary-rainbow` | `linear-gradient(135deg, var(--brand-c-secondary-light) 0%, var(--brand-c-secondary) 25%, var(--brand-c-secondary) 50%, var(--brand-c-secondary-dark) 75%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 85 |
| `--gradient-secondary-wave` | `linear-gradient(90deg, var(--brand-c-secondary-light) 0%, var(--brand-c-secondary) 20%, var(--brand-c-secondary) 40%, var(--brand-c-secondary-dark) 60%, var(--brand-c-secondary) 80%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 86 |
| `--gradient-soft-brand` | `linear-gradient(180deg, var(--brand-c-bg) 0%, var(--brand-c-primary-light) 30%, var(--brand-c-secondary) 70%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 148 |
| `--gradient-subtle` | `linear-gradient(180deg, var(--brand-c-bg-light) 0%, var(--brand-c-bg) 100%)` | `src\styles\tokens\gradients.css` | 168 |
| `--gradient-success` | `linear-gradient(135deg, var(--color-Success) 0%, color-mix(in oklch, var(--color-Success) 70%, black`` | `audit-BEFORE.md` | 1008 |
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
| `--gradient-warning` | `linear-gradient(135deg, var(--color-Warning) 0%, color-mix(in oklch, var(--color-Warning) 70%, black`` | `audit-BEFORE.md` | 1010 |
| `--gradient-warning` | `linear-gradient(135deg, var(--color-Warning) 0%, color-mix(in oklch, var(--color-Warning) 70%, black) 100%)` | `src\styles\tokens\gradients.css` | 234 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `files\example-a11y-cream-NEW.css` | 45 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `files\example-BrandDefault-NEW.css` | 45 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-cream.css` | 24 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 31 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 24 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 29 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-monochrome.css` | 24 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-protanopia.css` | 24 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 24 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `src\styles\themes\brand\BrandDefault.css` | 45 |
| `--interactive-disabled-bg` | `var(--brand-c-neutral-light)` | `docs\todo\TODO.md` | 375 |
| `--interactive-disabled-text` | `var(--brand-c-text-light)` | `docs\todo\TODO.md` | 376 |
| `--interactive-primary-active` | `var(--brand-c-primary-dark)` | `docs\todo\TODO.md` | 374 |
| `--interactive-primary-hover` | `var(--brand-c-primary-dark)` | `docs\todo\TODO.md` | 373 |
| `--linkHover` | `#ffffff` | `audit-BEFORE.md` | 863 |
| `--linkHover` | `var(--brand-c-secondary)` | `docs\Markdown Notes\accessibility-color-themes.md` | 31 |
| `--linkHover` | `oklch(0.80 0.10 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 122 |
| `--linkHover` | `oklch(0.34 0.10 45)` | `docs\Markdown Notes\accessibility-color-themes.md` | 197 |
| `--linkHover` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 247 |
| `--linkHover` | `oklch(0.92 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 342 |
| `--linkVisited` | `color-mix(in oklch, var(--link) 60%, var(--text) 40%)` | `docs\Markdown Notes\accessibility-color-themes.md` | 32 |
| `--pause-hover` | `hover {` | `src\styles\components\announcement-ticker.css` | 117 |
| `--primary` | `hover {` | `src\components\Presentation\Sections\TitleSection.astro` | 254 |
| `--primary` | `hover .title-section__btn-icon {` | `src\components\Presentation\Sections\TitleSection.astro` | 276 |
| `--print-background` | `var(--color-White)``` | `audit-BEFORE.md` | 418 |
| `--print-background` | `var(--color-White)`` | `docs\todo\TODO.md` | 488 |
| `--print-muted` | `var(--brand-c-neutral)`` | `docs\todo\TODO.md` | 489 |
| `--print-text` | `var(--color-Black)``` | `audit-BEFORE.md` | 988 |
| `--print-text` | `var(--color-Black)`` | `docs\todo\TODO.md` | 487 |
| `--rainbow-border-animation` | `glowloop 8s linear infinite` | `src\styles\tokens\gradients.css` | 44 |
| `--rainbow-border-hover-opacity` | `0.4` | `src\styles\tokens\gradients.css` | 45 |
| `--rainbow-halo-hover-opacity` | `0.83` | `src\styles\tokens\gradients.css` | 46 |
| `--rainbow-light-gradient-accent` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 35 |
| `--rainbow-light-gradient-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 17 |
| `--rainbow-light-gradient-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 27 |
| `--secondary` | `hover {` | `src\components\Presentation\Sections\TitleSection.astro` | 150 |
| `--secondary` | `hover {` | `src\components\Presentation\Sections\TitleSection.astro` | 265 |
| `--selectionBg` | `color-mix(in oklch, var(--focusRing) 25%, transparent)` | `docs\Markdown Notes\accessibility-color-themes.md` | 44 |
| `--selectionText` | `var(--text)` | `docs\Markdown Notes\accessibility-color-themes.md` | 45 |
| `--shadow-base` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 45 |
| `--shadow-base` | `var(--shadow)` | `src\styles\tokens\shadows.css` | 11 |
| `--shadow-dropdown` | `4px 4px 6px color-mix(in oklch, var(--brand-c-bg-dark) 20%, transparent), 4px 4px 6px color-mix(in oklch, var(--brand-c-bg) 70%, transparent), inset 4px 4px 6px color-mix(in oklch, var(--brand-c-bg-dark) 40%, transparent), inset 4px 4px 6px color-mix(in oklch, var(--brand-c-bg) 20%, transparent)` | `src\styles\tokens\shadows.css` | 58 |
| `--shadow-dropdown-lg` | `0 8px 16px color-mix(in oklch, var(--brand-c-bg-dark) 12%, transparent), 0 4px 8px color-mix(in oklch, var(--brand-c-bg-dark) 10%, transparent)` | `src\styles\tokens\shadows.css` | 61 |
| `--shadow-dropdown-sm` | `0 2px 4px color-mix(in oklch, var(--brand-c-bg-dark) 8%, transparent), 0 1px 2px color-mix(in oklch, var(--brand-c-bg-dark) 6%, transparent)` | `src\styles\tokens\shadows.css` | 59 |
| `--shadow-dropdown-soft` | `4px 4px 6px color-mix(in oklch, var(--brand-c-bg-dark) 20%, transparent), -4px -4px 6px color-mix(in oklch, var(--brand-c-bg) 60%, transparent), inset 2px 2px 4px color-mix(in oklch, var(--brand-c-bg-dark) 15%, transparent), inset -2px -2px 4px color-mix(in oklch, var(--brand-c-bg) 30%, transparent)` | `src\styles\tokens\shadows.css` | 62 |
| `--shadow-glow-primary` | `0 0 14px color-mix(in oklch, var(--brand-c-primary) 50%, transparent)` | `src\styles\themes\a11y\a11y-dark.css` | 52 |
| `--shadow-glow-primary` | `0 0 12px color-mix(in oklch, var(--brand-c-primary) 60%, transparent)` | `src\styles\tokens\shadows.css` | 69 |
| `--shadow-glow-secondary` | `0 0 14px color-mix(in oklch, var(--brand-c-secondary) 50%, transparent)` | `src\styles\themes\a11y\a11y-dark.css` | 53 |
| `--shadow-glow-secondary` | `0 0 12px color-mix(in oklch, var(--brand-c-secondary) 60%, transparent)` | `src\styles\tokens\shadows.css` | 70 |
| `--shadow-inner-2xl` | `inset 0 0 40px 16px` | `src\styles\tokens\shadows.css` | 31 |
| `--shadow-inner-md` | `inset 0 0 10px 4px` | `src\styles\tokens\shadows.css` | 22 |
| `--shadow-inner-xl` | `inset 0 0 30px 12px` | `src\styles\tokens\shadows.css` | 28 |
| `--shadow-xs` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 42 |
| `--shadow-xs` | `0 1px 2px 0 color-mix(in oklch, var(--brand-c-bg-dark) 5%, transparent)` | `src\styles\tokens\shadows.css` | 8 |
| `--state-disabled-opacity` | `0.5` | `docs\todo\TODO.md` | 402 |
| `--state-focus-ring` | `var(--color-Info-500)` | `docs\todo\TODO.md` | 400 |
| `--state-focus-ring-width` | `3px` | `docs\todo\TODO.md` | 401 |
| `--state-hover-bg` | `color-mix(in oklch, var(--interactive-primary) 5%, transparent)` | `docs\todo\TODO.md` | 399 |
| `--success` | `var(--color-Success)` | `docs\Markdown Notes\accessibility-color-themes.md` | 38 |
| `--surface-base` | `var(--brand-c-bg)` | `docs\todo\TODO.md` | 352 |
| `--surface-elevated` | `var(--brand-c-bg-light)` | `docs\todo\TODO.md` | 354 |
| `--surface-overlay` | `var(--brand-c-neutral-light)` | `docs\todo\TODO.md` | 355 |
| `--surface2` | `var(--brand-c-bg-light)` | `docs\Markdown Notes\accessibility-color-themes.md` | 22 |
| `--surface3` | `var(--brand-c-bg-light)` | `docs\Markdown Notes\accessibility-color-themes.md` | 23 |
| `--text-disabled` | `var(--brand-c-text-light)` | `docs\todo\TODO.md` | 361 |
| `--text-inverse` | `var(--color-White)` | `audit-BEFORE.md` | 408 |
| `--text-inverse` | `var(--color-White)` | `docs\todo\TODO.md` | 362 |
| `--text-primary` | `var(--brand-c-text-dark)` | `docs\todo\TODO.md` | 358 |
| `--text-secondary` | `var(--brand-c-text)` | `docs\todo\TODO.md` | 359 |
| `--text-tertiary` | `var(--brand-c-text-light)` | `docs\todo\TODO.md` | 360 |
| `--warning` | `var(--color-Warning)` | `docs\Markdown Notes\accessibility-color-themes.md` | 39 |

---

## 🟡 Tokens Used But Never Defined (In Scanned Files)

These tokens are referenced but no definition was found.
They may come from a framework, external stylesheet, or be errors.

| Token | Times Used | Example Locations |
|-------|-----------|------------------|
| `--space-md` | 483 | docs\Markdown Notes\CSS-Standards.md L259; docs\Markdown Notes\CSS-Standards.md L336; docs\Markdown Notes\CSS-Tokens.md L514 |
| `--space-sm` | 450 | docs\Markdown Notes\CSS-Standards.md L567; src\components\A11y Panel\FontCard.astro L86; src\components\A11y Panel\NavigationSection.astro L65 |
| `--space-xs` | 389 | audit-BEFORE.md L536; src\components\A11y Panel\PresetButton.astro L103; src\components\A11y Panel\PresetButton.astro L129 |
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
| `--a11y-cream-accent` | 32 | audit-BEFORE.md L1467; audit-BEFORE.md L1469; audit-BEFORE.md L1471 |
| `--radius-sm` | 27 | docs\todo\TODO.md L517; src\components\A11y Panel\ToggleCard.astro L136; src\components\Badge\Badge.astro L177 |
| `--a11y-hc-accent` | 26 | src\styles\a11y\base\theme-overrides.css L219; src\styles\a11y\base\theme-overrides.css L246; src\styles\a11y\base\theme-overrides.css L253 |
| `--a11y-hc-text` | 25 | audit-BEFORE.md L927; audit-BEFORE.md L929; audit-BEFORE.md L931 |
| `--leading-tight` | 21 | docs\Markdown Notes\CSS-Standards.md L199; docs\Markdown Notes\CSS-Standards.md L207; src\components\Presentation\AuthorCard.astro L102 |
| `--a11y-cream-text` | 18 | audit-BEFORE.md L1271; audit-BEFORE.md L1273; audit-BEFORE.md L1275 |
| `--nav-height` | 18 | src\pages\search.astro L178; src\pages\search.astro L179; src\pages\search.astro L469 |
| `--space-2xs` | 15 | src\components\A11y Panel\PresetButton.astro L130; src\components\A11y Panel\PresetButton.astro L167; src\components\A11y Panel\PresetsSidebar.astro L133 |
| `--a11y-dark-text` | 14 | audit-BEFORE.md L3463; src\styles\a11y\components\masonry-grid.css L20; src\styles\a11y\components\masonry-grid.css L35 |
| `--a11y-dark-accent` | 13 | src\styles\a11y\components\masonry-grid.css L26; src\styles\a11y\components\masonry-grid.css L39; src\styles\a11y\components\masonry-grid.css L41 |
| `--a11y-hc-bg` | 12 | audit-BEFORE.md L1209; audit-BEFORE.md L1211; audit-BEFORE.md L1213 |
| `--radius-xl` | 12 | src\components\ContactForm\Contact-Popup.astro L154; src\components\Grids\RelatedGrid.astro L454; src\components\Grids\RelatedGrid.astro L471 |
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
| `--page-margin` | 8 | src\styles\a11y\visual\text-only.css L514; src\styles\a11y\visual\text-only.css L515; src\styles\a11y\visual\text-only.css L660 |
| `--brand-text-muted` | 8 | src\styles\pages\checkout.css L81; src\styles\pages\checkout.css L266; src\styles\pages\checkout.css L282 |
| `--letter-spacing-wide` | 7 | docs\todo\TODO.md L554; docs\todo\TODO.md L555; src\components\Button\ButtonDropdown.astro L145 |
| `--font-size-base` | 7 | src\components\A11y Panel\FontCard.astro L90; src\components\A11y Panel\NavigationSection.astro L71; src\components\A11y Panel\PresetButton.astro L93 |
| `--gradient-hero` | 7 | src\components\Insights\InsightHeader.astro L149; src\components\Typography\SectionTitle.astro L235; src\components\Typography\SectionTitle.astro L333 |
| `--a11y-cream-bg` | 7 | src\styles\a11y\base\theme-overrides.css L267; src\styles\a11y\base\theme-overrides.css L499; src\styles\a11y\components\search-overlay.css L84 |
| `--a11y-cvd-accent-rgb` | 6 | audit-BEFORE.md L176; audit-BEFORE.md L2812; audit-BEFORE.md L2815 |
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
| `--color-Black-10` | 4 | audit-BEFORE.md L994; audit-BEFORE.md L1006; src\components\Sections\ShareSection.astro L146 |
| `--color-Black-5` | 4 | audit-BEFORE.md L996; audit-BEFORE.md L1004; src\components\Sections\ShareSection.astro L150 |
| `--brand-c-primary-rgb` | 4 | audit-BEFORE.md L2857; audit-BEFORE.md L2859; src\styles\components\presentation\ReaderNav.css L873 |
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
| `--confetti-pink` | 3 | audit-BEFORE.md L2098; audit-BEFORE.md L2386; src\styles\buttons\confetti-button.css L48 |
| `--confetti-gold` | 3 | audit-BEFORE.md L2413; audit-BEFORE.md L2456; src\styles\buttons\confetti-button.css L21 |
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
| `--color-primary-500-rgb` | 2 | audit-BEFORE.md L182; audit-BEFORE.md L2854 |
| `--color-White-80` | 2 | audit-BEFORE.md L512; src\components\Sections\ShareSection.astro L143 |
| `--color-White-5` | 2 | audit-BEFORE.md L742; src\styles\components\nav\GlassNav-base.css L26 |
| `--color-White-15` | 2 | audit-BEFORE.md L762; src\styles\components\presentation\ReaderNav.css L810 |
| `--confetti-purple` | 2 | audit-BEFORE.md L2395; src\styles\buttons\confetti-button.css L54 |
| `--confetti-teal` | 2 | audit-BEFORE.md L2404; src\styles\buttons\confetti-button.css L55 |
| `--z-dropdown` | 2 | docs\Markdown Notes\CSS-Tokens.md L536; src\components\Button\ButtonDropdown.astro L91 |
| `--container-xs` | 2 | src\components\Button\ButtonDropdown.astro L92; src\styles\base\utilities.css L26 |
| `--letter-spacing-normal` | 2 | src\components\Button\ButtonDropdown.astro L151; src\styles\components\hero-morph.css L214 |
| `--transition-slow` | 2 | src\components\ContactForm\Contact-Popup.astro L163; src\styles\base\utilities.css L225 |
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
| `--font-light` | 2 | src\styles\base\utilities.css L133; src\styles\components\nav\GlassNav-mobile.css L245 |
| `--z-base` | 2 | src\styles\components\footer-mask.css L23; src\styles\components\footer-mask.css L29 |
| `--tracking-normal` | 2 | src\styles\components\masonry-card.css L78; src\styles\components\masonry-card.css L179 |
| `--nav-top-offset` | 2 | src\styles\components\nav\GlassNav-base.css L9; src\styles\components\nav\GlassNav-mobile.css L37 |
| `--btn-gradient-glow` | 2 | src\styles\design\GlowTokens.css L13; src\styles\design\GlowTokens.css L24 |
| `--brand-neutral-300` | 2 | src\styles\pages\checkout.css L253; src\styles\pages\checkout.css L485 |
| `--page-margin-compact` | 2 | src\styles\responsive\phone.css L14; src\styles\responsive\xs.css L13 |
| `--page-margin-comfortable` | 2 | src\styles\responsive\tablet.css L14; src\styles\tokens\spacing.css L43 |
| `--color-background-900` | 1 | audit-BEFORE.md L6477 |
| `--color-background-50` | 1 | audit-BEFORE.md L6488 |
| `--color-primary-400` | 1 | audit-BEFORE.md L6492 |
| `--color-primary-600` | 1 | audit-BEFORE.md L6492 |
| `--color-secondary-400` | 1 | audit-BEFORE.md L6493 |
| `--color-secondary-600` | 1 | audit-BEFORE.md L6493 |
| `--color-surface` | 1 | docs\reports\css-class-names-recommendations.md L1344 |
| `--font-size-2xl` | 1 | src\components\A11y Panel\Stepper.astro L108 |
| `--font-weight-semibold` | 1 | src\components\A11y Panel\Stepper.astro L109 |
| `--font-size-xl` | 1 | src\components\A11y Panel\Stepper.astro L177 |
| `--color-secondary-500` | 1 | src\components\Cards\ProductCard.astro L123 |
| `--color-Success-600` | 1 | src\components\ContactForm\Contact-Popup.astro L359 |
| `--gradient-sunset` | 1 | src\components\Insights\InsightHeader.astro L155 |
| `--space-2` | 1 | src\components\Nav\Tabs\SideTabs.astro L144 |
| `--border-radius-2xl` | 1 | src\components\Search\SearchOverlay.astro L122 |
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
| `--font-regular` | 1 | src\styles\components\nav\GlassNav-mobile.css L291 |
| `--section-count` | 1 | src\styles\components\presentation\Reader.css L21 |
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
| `--brand-c-primary` | 450 | 92 |
| `--color-White` | 379 | 54 |
| `--brand-c-primary-dark` | 356 | 73 |
| `--brand-c-bg` | 310 | 90 |
| `--brand-c-text` | 306 | 81 |
| `--brand-c-neutral-dark` | 256 | 20 |
| `--brand-c-neutral-light` | 242 | 48 |
| `--brand-c-neutral` | 233 | 33 |
| `--text-sm` | 208 | 68 |
| `--text-xs` | 202 | 56 |
| `--brand-c-bg-light` | 147 | 20 |
| `--brand-c-text-light` | 144 | 55 |
| `--brand-c-primary-light` | 122 | 32 |
| `--text-base` | 121 | 53 |
| `--brand-c-secondary` | 104 | 24 |
| `--brand-c-secondary-dark` | 100 | 15 |
| `--text-lg` | 98 | 47 |
| `--brand-c-text-dark` | 86 | 39 |
| `--brand-c-bg-dark` | 86 | 7 |
| `--text-xl` | 73 | 44 |
| `--text-2xl` | 53 | 34 |
| `--a11y-cream-c-accent` | 50 | 2 |
| `--a11y-hc-c-accent` | 49 | 1 |
| `--a11y-mono-c-accent` | 48 | 1 |
| `--color-Black` | 47 | 8 |
| `--brand-c-secondary-light` | 46 | 10 |
| `--text-3xl` | 46 | 28 |
| `--a11y-dark-c-accent` | 42 | 4 |
| `--shadow-md` | 42 | 20 |
| `--border-radius-md` | 41 | 17 |
| `--a11y-deuter-c-primary` | 39 | 1 |
| `--a11y-proto-c-primary` | 39 | 1 |
| `--a11y-trit-c-primary` | 39 | 1 |
| `--a11y-dark-c-primary` | 36 | 2 |
| `--border-width` | 35 | 14 |
| `--a11y-cream-accent` | 32 | 7 |
| `--text-4xl` | 31 | 27 |
| `--a11y-cream-c-text` | 29 | 3 |
| `--a11y-mono-c-text` | 27 | 1 |
| `--color-Error` | 27 | 4 |
| `--a11y-deuter-c-text` | 27 | 1 |
| `--a11y-proto-c-text` | 27 | 1 |
| `--a11y-trit-c-text` | 27 | 1 |
| `--shadow-xl` | 26 | 13 |
| `--a11y-hc-accent` | 26 | 6 |
| `--a11y-proto-c-accent` | 25 | 1 |
| `--a11y-deuter-c-accent` | 25 | 1 |
| `--a11y-trit-c-accent` | 25 | 1 |
| `--a11y-hc-text` | 25 | 4 |
| `--shadow-sm` | 25 | 12 |
| `--a11y-dark-c-bg` | 24 | 5 |
| `--color-Success` | 23 | 5 |
| `--color-Error-500` | 22 | 3 |
| `--shadow-lg` | 21 | 13 |
| `--a11y-hc-c-bg` | 20 | 1 |
| `--border-radius-lg` | 20 | 15 |
| `--a11y-dark-c-text` | 19 | 5 |
| `--a11y-cream-text` | 18 | 6 |
| `--a11y-cream-c-primary` | 17 | 2 |
| `--a11y-hc-c-primary` | 17 | 1 |
| `--a11y-hc-c-text` | 17 | 1 |
| `--color-Warning` | 16 | 5 |
| `--text-5xl` | 16 | 16 |
| `--a11y-mono-c-primary` | 15 | 1 |
| `--shadow` | 15 | 8 |
| `--border-radius-xl` | 15 | 10 |
| `--a11y-cream-c-bg` | 14 | 3 |
| `--color-Info-500` | 14 | 4 |
| `--a11y-dark-text` | 14 | 4 |
| `--border-width-2` | 14 | 9 |
| `--a11y-dark-accent` | 13 | 5 |
| `--text` | 12 | 2 |
| `--a11y-deuter-c-bg` | 12 | 1 |
| `--a11y-mono-c-bg` | 12 | 1 |
| `--a11y-proto-c-bg` | 12 | 1 |
| `--a11y-trit-c-bg` | 12 | 1 |
| `--a11y-hc-bg` | 12 | 3 |
| `--color-Success-500` | 12 | 4 |
| `--border-radius-full` | 12 | 9 |
| `--shadow-2xl` | 10 | 8 |
| `--color-Danger` | 10 | 4 |
| `--border-radius-sm` | 10 | 8 |
| `--color-Warning-500` | 9 | 3 |
| `--badge-color` | 9 | 1 |
| `--overlay-opacity` | 8 | 2 |
| `--btn-filled-text` | 8 | 1 |
| `--brand-text-muted` | 8 | 1 |
| `--text-6xl` | 7 | 7 |
| `--a11y-cream-bg` | 7 | 3 |
| `--a11y-cvd-accent-rgb` | 6 | 2 |
| `--a11y-dark-c-surface` | 6 | 3 |
| `--border-radius` | 6 | 5 |
| `--a11y-cvd-accent` | 6 | 1 |
| `--a11y-dark-c-border` | 5 | 3 |
| `--gradient-primary` | 5 | 4 |
| `--gradient-secondary` | 5 | 4 |
| `--text-2xs` | 5 | 1 |
| `--brand-text` | 5 | 1 |
| `--brand-success` | 5 | 1 |
| `--glass-bg` | 4 | 4 |
| `--color-Info` | 4 | 2 |
| `--color-Black-10` | 4 | 3 |
| `--color-Black-5` | 4 | 3 |
| `--color-Error-100` | 4 | 2 |
| `--color-Success-100` | 4 | 2 |
| `--brand-c-primary-rgb` | 4 | 2 |
| `--focusRing` | 4 | 2 |
| `--img-shadow-lg` | 4 | 3 |
| `--text-7xl` | 4 | 3 |
| `--slider-color` | 4 | 1 |
| `--brand-neutral-200` | 4 | 1 |
| `--brand-success-dark` | 4 | 1 |
| `--glass-border` | 3 | 3 |
| `--color-Error-200` | 3 | 3 |
| `--color-Success-200` | 3 | 3 |
| `--feedback-error-bg` | 3 | 2 |
| `--feedback-success-bg` | 3 | 2 |
| `--link` | 3 | 2 |
| `--interactive-primary` | 3 | 2 |
| `--surface` | 3 | 2 |
| `--shadow-inner-lg` | 3 | 2 |
| `--text-md` | 3 | 3 |
| `--glass-shadow` | 3 | 3 |
| `--brand-success-light` | 3 | 1 |
| `--brand-neutral-100` | 3 | 1 |
| `--color-Background-800` | 2 | 2 |
| `--color-primary-500-rgb` | 2 | 1 |
| `--a11y-dark-c-surface-raised` | 2 | 1 |
| `--color-White-80` | 2 | 2 |
| `--color-White-5` | 2 | 2 |
| `--color-White-15` | 2 | 2 |
| `--color-Warning-100` | 2 | 2 |
| `--color-Warning-200` | 2 | 2 |
| `--gradient-primary-soft` | 2 | 2 |
| `--gradient-primary-light` | 2 | 2 |
| `--gradient-secondary-soft` | 2 | 2 |
| `--color-Secondary-50` | 2 | 2 |
| `--img-shadow-sm` | 2 | 2 |
| `--img-shadow-md` | 2 | 2 |
| `--a11y-mono-bg-100` | 2 | 1 |
| `--a11y-dark-bg` | 2 | 1 |
| `--shadow-btn` | 2 | 2 |
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
| `--brand-neutral-300` | 2 | 1 |
| `--a11y-high-contrast-c-primary` | 2 | 1 |
| `--a11y-protanopia-c-primary` | 2 | 1 |
| `--a11y-deuteranopia-c-primary` | 2 | 1 |
| `--a11y-tritanopia-c-primary` | 2 | 1 |
| `--a11y-monochrome-c-primary` | 2 | 1 |
| `--bg` | 1 | 1 |
| `--feedback-success-border` | 1 | 1 |
| `--color-Background-600` | 1 | 1 |
| `--color-Background-700` | 1 | 1 |
| `--feedback-success-text` | 1 | 1 |
| `--feedback-error-text` | 1 | 1 |
| `--feedback-warning-text` | 1 | 1 |
| `--universal-success` | 1 | 1 |
| `--universal-warning` | 1 | 1 |
| `--universal-info` | 1 | 1 |
| `--rainbow-hover-primary` | 1 | 1 |
| `--rainbow-hover-secondary` | 1 | 1 |
| `--rainbow-hover-accent` | 1 | 1 |
| `--rainbow-hover-cream` | 1 | 1 |
| `--color-background-900` | 1 | 1 |
| `--color-background-50` | 1 | 1 |
| `--color-primary-400` | 1 | 1 |
| `--color-primary-600` | 1 | 1 |
| `--color-secondary-400` | 1 | 1 |
| `--color-secondary-600` | 1 | 1 |
| `--textMuted` | 1 | 1 |
| `--disabledBg` | 1 | 1 |
| `--disabledText` | 1 | 1 |
| `--color-surface` | 1 | 1 |
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
| `--glass-bg-hover` | 1 | 1 |
| `--glass-shadow-hover` | 1 | 1 |
| `--shadow-btn-hover` | 1 | 1 |
| `--gradient-accent1` | 1 | 1 |
| `--gradient-accent2` | 1 | 1 |
| `--border-width-md` | 1 | 1 |
| `--card-hover-border` | 1 | 1 |
| `--color-Accent-500` | 1 | 1 |
| `--page-bg` | 1 | 1 |
| `--btn-color-500` | 1 | 1 |
| `--brand-primary` | 1 | 1 |
| `--brand-danger` | 1 | 1 |
| `--color-Warning-50` | 1 | 1 |
| `--color-Warning-700` | 1 | 1 |
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
| `--a11y-cream-c-accent` | `#6b8e7a` | `audit-BEFORE.md` | 1929 |
| `--a11y-cream-c-accent` | `#6b8e7a` | `audit-BEFORE.md` | 1931 |
| `--a11y-cream-c-accent` | `#6b8e7a` | `src\styles\themes\Preview\coretokens.css` | 16 |
| `--a11y-cream-c-bg` | `#ddd9d3` | `audit-BEFORE.md` | 1903 |
| `--a11y-cream-c-bg` | `#ddd9d3` | `audit-BEFORE.md` | 1905 |
| `--a11y-cream-c-bg` | `#ddd9d3` | `src\styles\themes\Preview\coretokens.css` | 13 |
| `--a11y-cream-c-primary` | `#8b7355` | `audit-BEFORE.md` | 1916 |
| `--a11y-cream-c-primary` | `#8b7355` | `audit-BEFORE.md` | 1918 |
| `--a11y-cream-c-primary` | `#8b7355` | `src\styles\themes\Preview\coretokens.css` | 15 |
| `--a11y-cream-c-text` | `#4a3f2f` | `audit-BEFORE.md` | 1283 |
| `--a11y-cream-c-text` | `#4a3f2f` | `audit-BEFORE.md` | 1285 |
| `--a11y-cream-c-text` | `#4a3f2f` | `src\styles\themes\Preview\coretokens.css` | 14 |
| `--a11y-dark-c-accent` | `#272596` | `audit-BEFORE.md` | 2310 |
| `--a11y-dark-c-accent` | `#272596` | `audit-BEFORE.md` | 2312 |
| `--a11y-dark-c-accent` | `#272596` | `audit-BEFORE.md` | 2314 |
| `--a11y-dark-c-accent` | `#272596` | `docs\Markdown Notes\Theme-Preview-System.md` | 35 |
| `--a11y-dark-c-accent` | `#272596` | `src\styles\themes\Preview\coretokens.css` | 22 |
| `--a11y-dark-c-bg` | `#121212` | `audit-BEFORE.md` | 2120 |
| `--a11y-dark-c-bg` | `#121212` | `audit-BEFORE.md` | 2122 |
| `--a11y-dark-c-bg` | `#040913` | `audit-BEFORE.md` | 2998 |
| `--a11y-dark-c-bg` | `#040913` | `docs\Markdown Notes\Theme-Preview-System.md` | 32 |
| `--a11y-dark-c-bg` | `#121212` | `src\styles\themes\Preview\coretokens.css` | 19 |
| `--a11y-dark-c-border` | `#3a3a3a` | `audit-BEFORE.md` | 3563 |
| `--a11y-dark-c-border` | `#3a3a3a` | `src\styles\themes\a11y\a11y-dark.css` | 28 |
| `--a11y-dark-c-primary` | `#C5E1A5` | `audit-BEFORE.md` | 2330 |
| `--a11y-dark-c-primary` | `#C5E1A5` | `audit-BEFORE.md` | 2332 |
| `--a11y-dark-c-primary` | `#962587` | `audit-BEFORE.md` | 3003 |
| `--a11y-dark-c-primary` | `#962587` | `docs\Markdown Notes\Theme-Preview-System.md` | 34 |
| `--a11y-dark-c-primary` | `#C5E1A5` | `src\styles\themes\Preview\coretokens.css` | 21 |
| `--a11y-dark-c-surface` | `#1e1e1e` | `audit-BEFORE.md` | 3553 |
| `--a11y-dark-c-surface` | `#1e1e1e` | `src\styles\themes\a11y\a11y-dark.css` | 26 |
| `--a11y-dark-c-surface-raised` | `#2a2a2a` | `audit-BEFORE.md` | 3558 |
| `--a11y-dark-c-surface-raised` | `#2a2a2a` | `src\styles\themes\a11y\a11y-dark.css` | 27 |
| `--a11y-dark-c-text` | `#ccd3da` | `audit-BEFORE.md` | 2107 |
| `--a11y-dark-c-text` | `#ccd3da` | `audit-BEFORE.md` | 2111 |
| `--a11y-dark-c-text` | `#ccd3da` | `audit-BEFORE.md` | 2113 |
| `--a11y-dark-c-text` | `#ccd3da` | `docs\Markdown Notes\Theme-Preview-System.md` | 33 |
| `--a11y-dark-c-text` | `#ccd3da` | `src\styles\themes\Preview\coretokens.css` | 20 |
| `--a11y-deuter-c-accent` | `#f97316` | `audit-BEFORE.md` | 2885 |
| `--a11y-deuter-c-bg` | `#f6f5fa` | `audit-BEFORE.md` | 2864 |
| `--a11y-deuter-c-primary` | `#6d28d9` | `audit-BEFORE.md` | 2878 |
| `--a11y-deuter-c-text` | `#1c1b29` | `audit-BEFORE.md` | 2871 |
| `--a11y-deuteranopia-c-accent` | `#f97316` | `audit-BEFORE.md` | 2887 |
| `--a11y-deuteranopia-c-accent` | `#f97316` | `src\styles\themes\Preview\coretokens.css` | 28 |
| `--a11y-deuteranopia-c-bg` | `#f6f5fa` | `audit-BEFORE.md` | 2866 |
| `--a11y-deuteranopia-c-bg` | `#f6f5fa` | `src\styles\themes\Preview\coretokens.css` | 25 |
| `--a11y-deuteranopia-c-primary` | `#6d28d9` | `audit-BEFORE.md` | 2880 |
| `--a11y-deuteranopia-c-primary` | `#6d28d9` | `src\styles\themes\Preview\coretokens.css` | 27 |
| `--a11y-deuteranopia-c-text` | `#1c1b29` | `audit-BEFORE.md` | 2873 |
| `--a11y-deuteranopia-c-text` | `#1c1b29` | `src\styles\themes\Preview\coretokens.css` | 26 |
| `--a11y-hc-border` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 26 |
| `--a11y-hc-c-accent` | `#00ffff` | `audit-BEFORE.md` | 1799 |
| `--a11y-hc-c-bg` | `#000000` | `audit-BEFORE.md` | 1217 |
| `--a11y-hc-c-primary` | `#00ff00` | `audit-BEFORE.md` | 2067 |
| `--a11y-hc-c-text` | `#ffffff` | `audit-BEFORE.md` | 963 |
| `--a11y-high-contrast-c-accent` | `#00ffff` | `audit-BEFORE.md` | 1801 |
| `--a11y-high-contrast-c-accent` | `#00ffff` | `src\styles\themes\Preview\coretokens.css` | 34 |
| `--a11y-high-contrast-c-bg` | `#000000` | `audit-BEFORE.md` | 1221 |
| `--a11y-high-contrast-c-bg` | `var(--color-Black)` | `src\styles\themes\Preview\coretokens.css` | 31 |
| `--a11y-high-contrast-c-primary` | `#00ff00` | `audit-BEFORE.md` | 2069 |
| `--a11y-high-contrast-c-primary` | `#00ff00` | `src\styles\themes\Preview\coretokens.css` | 33 |
| `--a11y-high-contrast-c-text` | `#ffffff` | `audit-BEFORE.md` | 965 |
| `--a11y-high-contrast-c-text` | `var(--color-White)` | `src\styles\themes\Preview\coretokens.css` | 32 |
| `--a11y-mono-c-accent` | `#777777` | `audit-BEFORE.md` | 1651 |
| `--a11y-mono-c-bg` | `#e6e4e2` | `audit-BEFORE.md` | 2892 |
| `--a11y-mono-c-primary` | `#555555` | `audit-BEFORE.md` | 2133 |
| `--a11y-mono-c-text` | `#333333` | `audit-BEFORE.md` | 1107 |
| `--a11y-monochrome-c-accent` | `#777777` | `audit-BEFORE.md` | 1655 |
| `--a11y-monochrome-c-accent` | `#777777` | `src\styles\themes\Preview\coretokens.css` | 40 |
| `--a11y-monochrome-c-bg` | `#e6e4e2` | `audit-BEFORE.md` | 2894 |
| `--a11y-monochrome-c-bg` | `#e6e4e2` | `src\styles\themes\Preview\coretokens.css` | 37 |
| `--a11y-monochrome-c-primary` | `#555555` | `audit-BEFORE.md` | 2135 |
| `--a11y-monochrome-c-primary` | `#555555` | `src\styles\themes\Preview\coretokens.css` | 39 |
| `--a11y-monochrome-c-text` | `#333333` | `audit-BEFORE.md` | 1109 |
| `--a11y-monochrome-c-text` | `var(--brand-c-text)` | `src\styles\themes\Preview\coretokens.css` | 38 |
| `--a11y-protanopia-c-accent` | `#f59e0b` | `audit-BEFORE.md` | 1745 |
| `--a11y-protanopia-c-accent` | `#f59e0b` | `src\styles\themes\Preview\coretokens.css` | 46 |
| `--a11y-protanopia-c-bg` | `#f5f7fb` | `audit-BEFORE.md` | 2901 |
| `--a11y-protanopia-c-bg` | `#f5f7fb` | `src\styles\themes\Preview\coretokens.css` | 43 |
| `--a11y-protanopia-c-primary` | `#1e40af` | `audit-BEFORE.md` | 2915 |
| `--a11y-protanopia-c-primary` | `#1e40af` | `src\styles\themes\Preview\coretokens.css` | 45 |
| `--a11y-protanopia-c-text` | `#0f172a` | `audit-BEFORE.md` | 2908 |
| `--a11y-protanopia-c-text` | `#0f172a` | `src\styles\themes\Preview\coretokens.css` | 44 |
| `--a11y-proto-c-accent` | `#f59e0b` | `audit-BEFORE.md` | 1743 |
| `--a11y-proto-c-bg` | `#f5f7fb` | `audit-BEFORE.md` | 2899 |
| `--a11y-proto-c-primary` | `#1e40af` | `audit-BEFORE.md` | 2913 |
| `--a11y-proto-c-text` | `#0f172a` | `audit-BEFORE.md` | 2906 |
| `--a11y-trit-c-accent` | `#06b6d4` | `audit-BEFORE.md` | 2941 |
| `--a11y-trit-c-bg` | `#fdf4ff` | `audit-BEFORE.md` | 2920 |
| `--a11y-trit-c-primary` | `#cc3399` | `audit-BEFORE.md` | 2934 |
| `--a11y-trit-c-text` | `#1e293b` | `audit-BEFORE.md` | 2927 |
| `--a11y-tritanopia-c-accent` | `#06b6d4` | `audit-BEFORE.md` | 2943 |
| `--a11y-tritanopia-c-accent` | `#06b6d4` | `src\styles\themes\Preview\coretokens.css` | 52 |
| `--a11y-tritanopia-c-bg` | `#fdf4ff` | `audit-BEFORE.md` | 2922 |
| `--a11y-tritanopia-c-bg` | `#fdf4ff` | `src\styles\themes\Preview\coretokens.css` | 49 |
| `--a11y-tritanopia-c-primary` | `#cc3399` | `audit-BEFORE.md` | 2936 |
| `--a11y-tritanopia-c-primary` | `#cc3399` | `src\styles\themes\Preview\coretokens.css` | 51 |
| `--a11y-tritanopia-c-text` | `#1e293b` | `audit-BEFORE.md` | 2929 |
| `--a11y-tritanopia-c-text` | `#1e293b` | `src\styles\themes\Preview\coretokens.css` | 50 |
| `--badge-color` | `var(--brand-c-primary)` | `src\components\Badge\Badge.astro` | 271 |
| `--badge-color` | `var(--brand-c-primary-dark)` | `src\components\Badge\Badge.astro` | 276 |
| `--badge-color` | `var(--brand-c-secondary-dark)` | `src\components\Badge\Badge.astro` | 281 |
| `--badge-color` | `var(--brand-c-neutral-dark)` | `src\components\Badge\Badge.astro` | 286 |
| `--badge-color` | `var(--brand-c-neutral-dark)` | `src\components\Badge\Badge.astro` | 291 |
| `--badge-color` | `var(--brand-c-neutral-dark)` | `src\components\Badge\Badge.astro` | 296 |
| `--badge-color` | `var(--brand-c-neutral-dark)` | `src\components\Badge\Badge.astro` | 301 |
| `--badge-color` | `var(--brand-c-neutral-dark)` | `src\components\Badge\Badge.astro` | 306 |
| `--badge-color` | `var(--color-Error)` | `src\components\Badge\Badge.astro` | 311 |
| `--badge-color` | `var(--color-Success)` | `src\components\Badge\Badge.astro` | 316 |
| `--badge-color` | `var(--color-Success)` | `src\components\Badge\Badge.astro` | 321 |
| `--badge-color` | `var(--color-Info, var(--brand-c-primary))` | `src\components\Badge\Badge.astro` | 326 |
| `--bg` | `#000000` | `audit-BEFORE.md` | 1183 |
| `--bg` | `var(--brand-c-bg)` | `docs\Markdown Notes\accessibility-color-themes.md` | 20 |
| `--bg` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 242 |
| `--border-focus` | `var(--color-Info-500)` | `docs\todo\TODO.md` | 369 |
| `--border-interactive` | `var(--brand-c-primary)` | `docs\todo\TODO.md` | 368 |
| `--border-medium` | `var(--brand-c-neutral)` | `docs\todo\TODO.md` | 366 |
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
| `--border-strong` | `var(--brand-c-neutral-dark)` | `docs\todo\TODO.md` | 367 |
| `--border-subtle` | `var(--brand-c-neutral-light)` | `docs\todo\TODO.md` | 365 |
| `--border-width` | `1px` | `src\styles\tokens\spacing.css` | 46 |
| `--border-width-2` | `2px` | `src\styles\tokens\spacing.css` | 47 |
| `--border-width-4` | `4px` | `src\styles\tokens\spacing.css` | 48 |
| `--brand-accent1` | `#9C8579` | `audit-BEFORE.md` | 1977 |
| `--brand-accent1` | `#9C8579` | `audit-BEFORE.md` | 1979 |
| `--brand-accent1` | `#8ac7b2` | `audit-BEFORE.md` | 3113 |
| `--brand-accent1` | `#9C8579` | `src\scripts\ThemeTokenGen\brand-template.css` | 13 |
| `--brand-accent1` | `#9C8579` | `src\scripts\ThemeTokenGen\brand-template.css` | 64 |
| `--brand-accent1` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 29 |
| `--brand-accent1` | `#8ac7b2` | `src\scripts\ThemeTokenGen\color-input.css` | 77 |
| `--brand-accent1` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 24 |
| `--brand-accent2` | `#8390b5` | `audit-BEFORE.md` | 1990 |
| `--brand-accent2` | `#c78a9f` | `audit-BEFORE.md` | 3118 |
| `--brand-accent2` | `#8390b5` | `src\scripts\ThemeTokenGen\brand-template.css` | 68 |
| `--brand-accent2` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 32 |
| `--brand-accent2` | `#c78a9f` | `src\scripts\ThemeTokenGen\color-input.css` | 78 |
| `--brand-accent2` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 32 |
| `--brand-accent3` | `#978692` | `audit-BEFORE.md` | 2001 |
| `--brand-accent3` | `#8abdc7` | `audit-BEFORE.md` | 3123 |
| `--brand-accent3` | `#978692` | `src\scripts\ThemeTokenGen\brand-template.css` | 72 |
| `--brand-accent3` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 33 |
| `--brand-accent3` | `#8abdc7` | `src\scripts\ThemeTokenGen\color-input.css` | 79 |
| `--brand-accent3` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 33 |
| `--brand-accent4` | `#3e4a5a` | `audit-BEFORE.md` | 2703 |
| `--brand-accent4` | `#bdc78a` | `audit-BEFORE.md` | 3128 |
| `--brand-accent4` | `#3e4a5a` | `src\scripts\ThemeTokenGen\brand-template.css` | 76 |
| `--brand-accent4` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 36 |
| `--brand-accent4` | `#bdc78a` | `src\scripts\ThemeTokenGen\color-input.css` | 80 |
| `--brand-accent4` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 41 |
| `--brand-accent5` | `#a28aad` | `audit-BEFORE.md` | 2710 |
| `--brand-accent5` | `#938ac7` | `audit-BEFORE.md` | 3138 |
| `--brand-accent5` | `#a28aad` | `src\scripts\ThemeTokenGen\brand-template.css` | 80 |
| `--brand-accent5` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 39 |
| `--brand-accent5` | `#938ac7` | `src\scripts\ThemeTokenGen\color-input.css` | 82 |
| `--brand-accent5` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 42 |
| `--brand-background` | `#EEEBE2` | `audit-BEFORE.md` | 2530 |
| `--brand-background` | `#f2efd4` | `audit-BEFORE.md` | 3098 |
| `--brand-background` | `#EEEBE2` | `src\scripts\ThemeTokenGen\brand-template.css` | 43 |
| `--brand-background` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 46 |
| `--brand-background` | `#f2efd4` | `src\scripts\ThemeTokenGen\color-input.css` | 74 |
| `--brand-background` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 47 |
| `--brand-background-dark` | `#2a3328` | `audit-BEFORE.md` | 1391 |
| `--brand-background-dark` | `#394e43` | `audit-BEFORE.md` | 2614 |
| `--brand-background-dark` | `#0e3f2e` | `audit-BEFORE.md` | 2717 |
| `--brand-background-dark` | `#2a3328` | `audit-BEFORE.md` | 3093 |
| `--brand-background-dark` | `#394e43` | `src\scripts\ThemeTokenGen\brand-template.css` | 48 |
| `--brand-background-dark` | `#2a3328` | `src\scripts\ThemeTokenGen\color-input.css` | 50 |
| `--brand-background-dark` | `#0e3f2e` | `src\scripts\ThemeTokenGen\color-input.css` | 83 |
| `--brand-background-dark` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 50 |
| `--brand-c-bg` | `#000000` | `audit-BEFORE.md` | 1171 |
| `--brand-c-bg` | `#000000` | `audit-BEFORE.md` | 1173 |
| `--brand-c-bg` | `#faf8f7` | `audit-BEFORE.md` | 1400 |
| `--brand-c-bg` | `#faf8f7` | `audit-BEFORE.md` | 1406 |
| `--brand-c-bg` | `#faf8f7` | `audit-BEFORE.md` | 1408 |
| `--brand-c-bg` | `#faf8f7` | `audit-BEFORE.md` | 1410 |
| `--brand-c-bg` | `#faf8f7` | `audit-BEFORE.md` | 1416 |
| `--brand-c-bg` | `#f9f8f6` | `audit-BEFORE.md` | 1636 |
| `--brand-c-bg` | `#ddd9d3` | `audit-BEFORE.md` | 1897 |
| `--brand-c-bg` | `oklch(0.14 0.02 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 60 |
| `--brand-c-bg` | `oklch(0.17 0.02 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 61 |
| `--brand-c-bg` | `oklch(0.98 0.015 90)` | `docs\Markdown Notes\accessibility-color-themes.md` | 136 |
| `--brand-c-bg` | `oklch(0.965 0.020 88)` | `docs\Markdown Notes\accessibility-color-themes.md` | 137 |
| `--brand-c-bg` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 210 |
| `--brand-c-bg` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 211 |
| `--brand-c-bg` | `#f9f8f6` | `docs\Markdown Notes\Theme-Preview-System.md` | 26 |
| `--brand-c-bg` | `#ddd9d3` | `files\example-a11y-cream-NEW.css` | 5 |
| `--brand-c-bg` | `var(--brand-c-bg)` | `files\example-BrandDefault-NEW.css` | 5 |
| `--brand-c-bg` | `oklch(97.948% 0.01376 88.669)` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 12 |
| `--brand-c-bg` | `oklch(0.948 0.011 95.09)` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 13 |
| `--brand-c-bg` | `#ddd9d3` | `src\styles\themes\a11y\a11y-cream.css` | 2 |
| `--brand-c-bg` | `#121212` | `src\styles\themes\a11y\a11y-dark.css` | 2 |
| `--brand-c-bg` | `#f6f5fa` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 2 |
| `--brand-c-bg` | `#000000` | `src\styles\themes\a11y\a11y-high-contrast.css` | 2 |
| `--brand-c-bg` | `#e6e4e2` | `src\styles\themes\a11y\a11y-monochrome.css` | 2 |
| `--brand-c-bg` | `#f5f7fb` | `src\styles\themes\a11y\a11y-protanopia.css` | 2 |
| `--brand-c-bg` | `#fdf4ff` | `src\styles\themes\a11y\a11y-tritanopia.css` | 2 |
| `--brand-c-bg` | `#faf8f7` | `src\styles\themes\brand\BrandDefault.css` | 5 |
| `--brand-c-bg` | `var(--brand-c-bg)` | `src\styles\themes\Preview\coretokens.css` | 55 |
| `--brand-c-bg-dark` | `#4a3f2f` | `audit-BEFORE.md` | 1265 |
| `--brand-c-bg-dark` | `#1a1918`** (line 44)`` | `audit-BEFORE.md` | 2563 |
| `--brand-c-bg-dark` | `#1a1918` | `audit-BEFORE.md` | 2565 |
| `--brand-c-bg-dark` | `#394e43` | `audit-BEFORE.md` | 2612 |
| `--brand-c-bg-dark` | `oklch(0.13 0.02 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 67 |
| `--brand-c-bg-dark` | `oklch(0.11 0.015 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 68 |
| `--brand-c-bg-dark` | `oklch(0.095 0.012 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 69 |
| `--brand-c-bg-dark` | `oklch(0.08 0.010 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 70 |
| `--brand-c-bg-dark` | `oklch(0.065 0.010 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 71 |
| `--brand-c-bg-dark` | `oklch(0.40 0.04 45)` | `docs\Markdown Notes\accessibility-color-themes.md` | 143 |
| `--brand-c-bg-dark` | `oklch(0.34 0.04 42)` | `docs\Markdown Notes\accessibility-color-themes.md` | 144 |
| `--brand-c-bg-dark` | `oklch(0.28 0.03 40)` | `docs\Markdown Notes\accessibility-color-themes.md` | 145 |
| `--brand-c-bg-dark` | `oklch(0.22 0.03 35)` | `docs\Markdown Notes\accessibility-color-themes.md` | 146 |
| `--brand-c-bg-dark` | `oklch(0.18 0.02 30)` | `docs\Markdown Notes\accessibility-color-themes.md` | 147 |
| `--brand-c-bg-dark` | `#1a1918`** (line 44)` | `docs\reports\FIXES-APPLIED.md` | 59 |
| `--brand-c-bg-dark` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 33 |
| `--brand-c-bg-dark` | `#394e43` | `files\example-BrandDefault-NEW.css` | 33 |
| `--brand-c-bg-dark` | `#4a3f2f` | `src\styles\themes\a11y\a11y-cream.css` | 18 |
| `--brand-c-bg-dark` | `#121212` | `src\styles\themes\a11y\a11y-dark.css` | 18 |
| `--brand-c-bg-dark` | `#1c1b29` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 18 |
| `--brand-c-bg-dark` | `#000000` | `src\styles\themes\a11y\a11y-high-contrast.css` | 18 |
| `--brand-c-bg-dark` | `#333333` | `src\styles\themes\a11y\a11y-monochrome.css` | 18 |
| `--brand-c-bg-dark` | `#0f172a` | `src\styles\themes\a11y\a11y-protanopia.css` | 18 |
| `--brand-c-bg-dark` | `#1e293b` | `src\styles\themes\a11y\a11y-tritanopia.css` | 18 |
| `--brand-c-bg-dark` | `#394e43` | `src\styles\themes\brand\BrandDefault.css` | 33 |
| `--brand-c-bg-light` | `#ffffff` | `audit-BEFORE.md` | 871 |
| `--brand-c-bg-light` | `#000000` | `audit-BEFORE.md` | 1175 |
| `--brand-c-bg-light` | `#000000` | `audit-BEFORE.md` | 1177 |
| `--brand-c-bg-light` | `#000000` | `audit-BEFORE.md` | 1179 |
| `--brand-c-bg-light` | `#000000` | `audit-BEFORE.md` | 1181 |
| `--brand-c-bg-light` | `#ddd9d3` | `audit-BEFORE.md` | 1901 |
| `--brand-c-bg-light` | `#d2d1cc` | `audit-BEFORE.md` | 3623 |
| `--brand-c-bg-light` | `#b4b1a8` | `audit-BEFORE.md` | 3628 |
| `--brand-c-bg-light` | `#95928a` | `audit-BEFORE.md` | 3633 |
| `--brand-c-bg-light` | `#77746c` | `audit-BEFORE.md` | 3638 |
| `--brand-c-bg-light` | `oklch(0.20 0.02 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 62 |
| `--brand-c-bg-light` | `oklch(0.23 0.02 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 63 |
| `--brand-c-bg-light` | `oklch(0.26 0.02 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 64 |
| `--brand-c-bg-light` | `oklch(0.30 0.02 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 65 |
| `--brand-c-bg-light` | `oklch(0.950 0.022 85)` | `docs\Markdown Notes\accessibility-color-themes.md` | 138 |
| `--brand-c-bg-light` | `oklch(0.935 0.025 82)` | `docs\Markdown Notes\accessibility-color-themes.md` | 139 |
| `--brand-c-bg-light` | `oklch(0.920 0.028 78)` | `docs\Markdown Notes\accessibility-color-themes.md` | 140 |
| `--brand-c-bg-light` | `oklch(0.905 0.030 75)` | `docs\Markdown Notes\accessibility-color-themes.md` | 141 |
| `--brand-c-bg-light` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 212 |
| `--brand-c-bg-light` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 213 |
| `--brand-c-bg-light` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 214 |
| `--brand-c-bg-light` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 215 |
| `--brand-c-bg-light` | `#ddd9d3` | `files\example-a11y-cream-NEW.css` | 32 |
| `--brand-c-bg-light` | `var(--color-White)` | `files\example-BrandDefault-NEW.css` | 32 |
| `--brand-c-bg-light` | `#ddd9d3` | `src\styles\themes\a11y\a11y-cream.css` | 17 |
| `--brand-c-bg-light` | `#121212` | `src\styles\themes\a11y\a11y-dark.css` | 17 |
| `--brand-c-bg-light` | `#f6f5fa` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 17 |
| `--brand-c-bg-light` | `#000000` | `src\styles\themes\a11y\a11y-high-contrast.css` | 17 |
| `--brand-c-bg-light` | `#e6e4e2` | `src\styles\themes\a11y\a11y-monochrome.css` | 17 |
| `--brand-c-bg-light` | `#f5f7fb` | `src\styles\themes\a11y\a11y-protanopia.css` | 17 |
| `--brand-c-bg-light` | `#fdf4ff` | `src\styles\themes\a11y\a11y-tritanopia.css` | 17 |
| `--brand-c-bg-light` | `#ffffff` | `src\styles\themes\brand\BrandDefault.css` | 32 |
| `--brand-c-neutral` | `#4a3f2f` | `audit-BEFORE.md` | 1261 |
| `--brand-c-neutral` | `oklch(0.66 0.14 145)` | `audit-BEFORE.md` | 1385 |
| `--brand-c-neutral` | `oklch(0.60 0.14 250)` | `audit-BEFORE.md` | 1677 |
| `--brand-c-neutral` | `oklch(0.62 0.14 255)` | `audit-BEFORE.md` | 1679 |
| `--brand-c-neutral` | `oklch(0.62 0.10 25)` | `audit-BEFORE.md` | 1782 |
| `--brand-c-neutral` | `oklch(0.60 0.18 25)` | `audit-BEFORE.md` | 1784 |
| `--brand-c-neutral` | `#00ffff` | `audit-BEFORE.md` | 1793 |
| `--brand-c-neutral` | `oklch(0.55 0.08 280)` | `audit-BEFORE.md` | 1806 |
| `--brand-c-neutral` | `oklch(0.62 0.10 300)` | `audit-BEFORE.md` | 1808 |
| `--brand-c-neutral` | `oklch(0.60 0.14 300)` | `audit-BEFORE.md` | 1810 |
| `--brand-c-neutral` | `oklch(0.62 0.10 280)` | `audit-BEFORE.md` | 1812 |
| `--brand-c-neutral` | `oklch(0.60 0.10 200)` | `audit-BEFORE.md` | 1819 |
| `--brand-c-neutral` | `oklch(0.70 0.12 195)` | `audit-BEFORE.md` | 1821 |
| `--brand-c-neutral` | `#9c8579` | `audit-BEFORE.md` | 1981 |
| `--brand-c-neutral` | `#8390b5` | `audit-BEFORE.md` | 1992 |
| `--brand-c-neutral` | `#978692` | `audit-BEFORE.md` | 2003 |
| `--brand-c-neutral` | `#ffff00` | `audit-BEFORE.md` | 2054 |
| `--brand-c-neutral` | `#00ff00` | `audit-BEFORE.md` | 2063 |
| `--brand-c-neutral` | `oklch(0.75 0.14 70)` | `audit-BEFORE.md` | 2074 |
| `--brand-c-neutral` | `oklch(0.72 0.16 55)` | `audit-BEFORE.md` | 2076 |
| `--brand-c-neutral` | `oklch(0.62 0.10 25)` | `audit-BEFORE.md` | 2078 |
| `--brand-c-neutral` | `oklch(0.75 0.14 70)` | `audit-BEFORE.md` | 2085 |
| `--brand-c-neutral` | `oklch(0.75 0.12 90)` | `audit-BEFORE.md` | 2087 |
| `--brand-c-neutral` | `oklch(0.78 0.12 90)` | `audit-BEFORE.md` | 2089 |
| `--brand-c-neutral` | `oklch(0.74 0.14 80)` | `audit-BEFORE.md` | 2091 |
| `--brand-c-neutral` | `oklch(0.62 0.16 350)` | `audit-BEFORE.md` | 2096 |
| `--brand-c-neutral` | `#555` | `audit-BEFORE.md` | 2212 |
| `--brand-c-neutral` | `#c2bdb8` | `audit-BEFORE.md` | 2605 |
| `--brand-c-neutral` | `#c2bdb8` | `audit-BEFORE.md` | 2607 |
| `--brand-c-neutral` | `#3e4a5a` | `audit-BEFORE.md` | 2705 |
| `--brand-c-neutral` | `#a28aad` | `audit-BEFORE.md` | 2712 |
| `--brand-c-neutral` | `#ff6600` | `audit-BEFORE.md` | 2983 |
| `--brand-c-neutral` | `#ff00ff` | `audit-BEFORE.md` | 2988 |
| `--brand-c-neutral` | `#777` | `audit-BEFORE.md` | 3568 |
| `--brand-c-neutral` | `#bba397` | `audit-BEFORE.md` | 3683 |
| `--brand-c-neutral` | `#a1afd5` | `audit-BEFORE.md` | 3718 |
| `--brand-c-neutral` | `#b6a4b1` | `audit-BEFORE.md` | 3753 |
| `--brand-c-neutral` | `#596677` | `audit-BEFORE.md` | 3788 |
| `--brand-c-neutral` | `#c1a9cd` | `audit-BEFORE.md` | 3823 |
| `--brand-c-neutral` | `oklch(0.70 0.12 145)` | `docs\Markdown Notes\accessibility-color-themes.md` | 106 |
| `--brand-c-neutral` | `oklch(0.68 0.13 350)` | `docs\Markdown Notes\accessibility-color-themes.md` | 107 |
| `--brand-c-neutral` | `oklch(0.66 0.10 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 108 |
| `--brand-c-neutral` | `oklch(0.74 0.12 85)` | `docs\Markdown Notes\accessibility-color-themes.md` | 109 |
| `--brand-c-neutral` | `oklch(0.70 0.14 30)` | `docs\Markdown Notes\accessibility-color-themes.md` | 110 |
| `--brand-c-neutral` | `oklch(0.62 0.10 145)` | `docs\Markdown Notes\accessibility-color-themes.md` | 182 |
| `--brand-c-neutral` | `oklch(0.60 0.10 25)` | `docs\Markdown Notes\accessibility-color-themes.md` | 183 |
| `--brand-c-neutral` | `oklch(0.55 0.08 280)` | `docs\Markdown Notes\accessibility-color-themes.md` | 184 |
| `--brand-c-neutral` | `oklch(0.60 0.10 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 185 |
| `--brand-c-neutral` | `oklch(0.62 0.10 350)` | `docs\Markdown Notes\accessibility-color-themes.md` | 186 |
| `--brand-c-neutral` | `#00ffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 229 |
| `--brand-c-neutral` | `#ffff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 230 |
| `--brand-c-neutral` | `#00ff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 231 |
| `--brand-c-neutral` | `#ff6600` | `docs\Markdown Notes\accessibility-color-themes.md` | 232 |
| `--brand-c-neutral` | `#ff00ff` | `docs\Markdown Notes\accessibility-color-themes.md` | 233 |
| `--brand-c-neutral` | `oklch(0.70 0.12 195)` | `docs\Markdown Notes\accessibility-color-themes.md` | 263 |
| `--brand-c-neutral` | `oklch(0.75 0.14 70)` | `docs\Markdown Notes\accessibility-color-themes.md` | 264 |
| `--brand-c-neutral` | `oklch(0.60 0.14 250)` | `docs\Markdown Notes\accessibility-color-themes.md` | 265 |
| `--brand-c-neutral` | `oklch(0.75 0.12 90)` | `docs\Markdown Notes\accessibility-color-themes.md` | 266 |
| `--brand-c-neutral` | `oklch(0.62 0.10 300)` | `docs\Markdown Notes\accessibility-color-themes.md` | 267 |
| `--brand-c-neutral` | `oklch(0.62 0.14 255)` | `docs\Markdown Notes\accessibility-color-themes.md` | 285 |
| `--brand-c-neutral` | `oklch(0.72 0.16 55)` | `docs\Markdown Notes\accessibility-color-themes.md` | 286 |
| `--brand-c-neutral` | `oklch(0.60 0.14 300)` | `docs\Markdown Notes\accessibility-color-themes.md` | 287 |
| `--brand-c-neutral` | `oklch(0.78 0.12 90)` | `docs\Markdown Notes\accessibility-color-themes.md` | 288 |
| `--brand-c-neutral` | `oklch(0.62 0.10 25)` | `docs\Markdown Notes\accessibility-color-themes.md` | 289 |
| `--brand-c-neutral` | `oklch(0.66 0.14 145)` | `docs\Markdown Notes\accessibility-color-themes.md` | 307 |
| `--brand-c-neutral` | `oklch(0.74 0.14 80)` | `docs\Markdown Notes\accessibility-color-themes.md` | 308 |
| `--brand-c-neutral` | `oklch(0.62 0.16 350)` | `docs\Markdown Notes\accessibility-color-themes.md` | 309 |
| `--brand-c-neutral` | `oklch(0.60 0.18 25)` | `docs\Markdown Notes\accessibility-color-themes.md` | 310 |
| `--brand-c-neutral` | `oklch(0.62 0.10 280)` | `docs\Markdown Notes\accessibility-color-themes.md` | 311 |
| `--brand-c-neutral` | `oklch(0.70 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 329 |
| `--brand-c-neutral` | `oklch(0.60 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 330 |
| `--brand-c-neutral` | `oklch(0.50 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 331 |
| `--brand-c-neutral` | `oklch(0.65 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 332 |
| `--brand-c-neutral` | `oklch(0.55 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 333 |
| `--brand-c-neutral` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 26 |
| `--brand-c-neutral` | `#c2bdb8` | `files\example-BrandDefault-NEW.css` | 26 |
| `--brand-c-neutral` | `oklch(0.992 0.003 67.83)` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 17 |
| `--brand-c-neutral` | `oklch(0.984 0.008 73.73)` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 18 |
| `--brand-c-neutral` | `#4a3f2f` | `src\styles\themes\a11y\a11y-cream.css` | 14 |
| `--brand-c-neutral` | `#ccd3da` | `src\styles\themes\a11y\a11y-dark.css` | 14 |
| `--brand-c-neutral` | `#1c1b29` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 14 |
| `--brand-c-neutral` | `#ffffff` | `src\styles\themes\a11y\a11y-high-contrast.css` | 14 |
| `--brand-c-neutral` | `#333333` | `src\styles\themes\a11y\a11y-monochrome.css` | 14 |
| `--brand-c-neutral` | `#0f172a` | `src\styles\themes\a11y\a11y-protanopia.css` | 14 |
| `--brand-c-neutral` | `#1e293b` | `src\styles\themes\a11y\a11y-tritanopia.css` | 14 |
| `--brand-c-neutral` | `#c2bdb8` | `src\styles\themes\brand\BrandDefault.css` | 26 |
| `--brand-c-neutral-dark` | `#4a3f2f` | `audit-BEFORE.md` | 1263 |
| `--brand-c-neutral-dark` | `#393531` | `audit-BEFORE.md` | 2140 |
| `--brand-c-neutral-dark` | `#393531` | `audit-BEFORE.md` | 2146 |
| `--brand-c-neutral-dark` | `#999` | `audit-BEFORE.md` | 2234 |
| `--brand-c-neutral-dark` | `#aaa` | `audit-BEFORE.md` | 3573 |
| `--brand-c-neutral-dark` | `#292624` | `audit-BEFORE.md` | 3663 |
| `--brand-c-neutral-dark` | `#7e685c` | `audit-BEFORE.md` | 3688 |
| `--brand-c-neutral-dark` | `#614c41` | `audit-BEFORE.md` | 3693 |
| `--brand-c-neutral-dark` | `#4d392f` | `audit-BEFORE.md` | 3698 |
| `--brand-c-neutral-dark` | `#667296` | `audit-BEFORE.md` | 3723 |
| `--brand-c-neutral-dark` | `#4a5677` | `audit-BEFORE.md` | 3728 |
| `--brand-c-neutral-dark` | `#384263` | `audit-BEFORE.md` | 3733 |
| `--brand-c-neutral-dark` | `#796974` | `audit-BEFORE.md` | 3758 |
| `--brand-c-neutral-dark` | `#5c4d58` | `audit-BEFORE.md` | 3763 |
| `--brand-c-neutral-dark` | `#493a45` | `audit-BEFORE.md` | 3768 |
| `--brand-c-neutral-dark` | `#25303f` | `audit-BEFORE.md` | 3793 |
| `--brand-c-neutral-dark` | `#0d1825` | `audit-BEFORE.md` | 3798 |
| `--brand-c-neutral-dark` | `#020815` | `audit-BEFORE.md` | 3803 |
| `--brand-c-neutral-dark` | `#846c8e` | `audit-BEFORE.md` | 3828 |
| `--brand-c-neutral-dark` | `#665070` | `audit-BEFORE.md` | 3833 |
| `--brand-c-neutral-dark` | `#533d5c` | `audit-BEFORE.md` | 3838 |
| `--brand-c-neutral-dark` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 27 |
| `--brand-c-neutral-dark` | `#393531` | `files\example-BrandDefault-NEW.css` | 27 |
| `--brand-c-neutral-dark` | `#4a3f2f` | `src\styles\themes\a11y\a11y-cream.css` | 15 |
| `--brand-c-neutral-dark` | `#ccd3da` | `src\styles\themes\a11y\a11y-dark.css` | 15 |
| `--brand-c-neutral-dark` | `#1c1b29` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 15 |
| `--brand-c-neutral-dark` | `#ffffff` | `src\styles\themes\a11y\a11y-high-contrast.css` | 15 |
| `--brand-c-neutral-dark` | `#333333` | `src\styles\themes\a11y\a11y-monochrome.css` | 15 |
| `--brand-c-neutral-dark` | `#0f172a` | `src\styles\themes\a11y\a11y-protanopia.css` | 15 |
| `--brand-c-neutral-dark` | `#1e293b` | `src\styles\themes\a11y\a11y-tritanopia.css` | 15 |
| `--brand-c-neutral-dark` | `#393531` | `src\styles\themes\brand\BrandDefault.css` | 27 |
| `--brand-c-neutral-light` | `#faf8f7` | `audit-BEFORE.md` | 1412 |
| `--brand-c-neutral-light` | `#faf8f7` | `audit-BEFORE.md` | 1414 |
| `--brand-c-neutral-light` | `#ddd9d3` | `audit-BEFORE.md` | 1899 |
| `--brand-c-neutral-light` | `#e0dedb` | `audit-BEFORE.md` | 2012 |
| `--brand-c-neutral-light` | `#e0dedb` | `audit-BEFORE.md` | 2014 |
| `--brand-c-neutral-light` | `#fef7f3` | `audit-BEFORE.md` | 3668 |
| `--brand-c-neutral-light` | `#f3e6e0` | `audit-BEFORE.md` | 3673 |
| `--brand-c-neutral-light` | `#dcc3b6` | `audit-BEFORE.md` | 3678 |
| `--brand-c-neutral-light` | `#f4f8ff` | `audit-BEFORE.md` | 3703 |
| `--brand-c-neutral-light` | `#e9f0ff` | `audit-BEFORE.md` | 3708 |
| `--brand-c-neutral-light` | `#c1cff6` | `audit-BEFORE.md` | 3713 |
| `--brand-c-neutral-light` | `#fcf6fa` | `audit-BEFORE.md` | 3738 |
| `--brand-c-neutral-light` | `#f1e8ee` | `audit-BEFORE.md` | 3743 |
| `--brand-c-neutral-light` | `#d6c4d1` | `audit-BEFORE.md` | 3748 |
| `--brand-c-neutral-light` | `#b5b9bf` | `audit-BEFORE.md` | 3773 |
| `--brand-c-neutral-light` | `#9aa1aa` | `audit-BEFORE.md` | 3778 |
| `--brand-c-neutral-light` | `#768395` | `audit-BEFORE.md` | 3783 |
| `--brand-c-neutral-light` | `#fdf5ff` | `audit-BEFORE.md` | 3808 |
| `--brand-c-neutral-light` | `#fcefff` | `audit-BEFORE.md` | 3813 |
| `--brand-c-neutral-light` | `#e2c8ee` | `audit-BEFORE.md` | 3818 |
| `--brand-c-neutral-light` | `#ddd9d3` | `files\example-a11y-cream-NEW.css` | 25 |
| `--brand-c-neutral-light` | `#e0dedb` | `files\example-BrandDefault-NEW.css` | 25 |
| `--brand-c-neutral-light` | `#ddd9d3` | `src\styles\themes\a11y\a11y-cream.css` | 13 |
| `--brand-c-neutral-light` | `#121212` | `src\styles\themes\a11y\a11y-dark.css` | 13 |
| `--brand-c-neutral-light` | `#f6f5fa` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 13 |
| `--brand-c-neutral-light` | `#000000` | `src\styles\themes\a11y\a11y-high-contrast.css` | 13 |
| `--brand-c-neutral-light` | `#e6e4e2` | `src\styles\themes\a11y\a11y-monochrome.css` | 13 |
| `--brand-c-neutral-light` | `#f5f7fb` | `src\styles\themes\a11y\a11y-protanopia.css` | 13 |
| `--brand-c-neutral-light` | `#fdf4ff` | `src\styles\themes\a11y\a11y-tritanopia.css` | 13 |
| `--brand-c-neutral-light` | `#e0dedb` | `src\styles\themes\brand\BrandDefault.css` | 25 |
| `--brand-c-primary` | `#ffffff` | `audit-BEFORE.md` | 857 |
| `--brand-c-primary` | `#8fa68a` | `audit-BEFORE.md` | 1128 |
| `--brand-c-primary` | `#8fa68a` | `audit-BEFORE.md` | 1130 |
| `--brand-c-primary` | `#8fa68a` | `audit-BEFORE.md` | 1132 |
| `--brand-c-primary` | `#8fa68a` | `audit-BEFORE.md` | 1162 |
| `--brand-c-primary` | `#8fa68a` | `audit-BEFORE.md` | 1164 |
| `--brand-c-primary` | `#8fa68a` | `audit-BEFORE.md` | 1166 |
| `--brand-c-primary` | `#8b7355` | `audit-BEFORE.md` | 1910 |
| `--brand-c-primary` | `#aec6a9` | `audit-BEFORE.md` | 3583 |
| `--brand-c-primary` | `oklch(0.64 0.12 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 88 |
| `--brand-c-primary` | `oklch(0.58 0.14 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 89 |
| `--brand-c-primary` | `oklch(0.70 0.10 50)` | `docs\Markdown Notes\accessibility-color-themes.md` | 164 |
| `--brand-c-primary` | `oklch(0.62 0.10 45)` | `docs\Markdown Notes\accessibility-color-themes.md` | 165 |
| `--brand-c-primary` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 226 |
| `--brand-c-primary` | `#8fa68a` | `docs\Markdown Notes\Theme-Preview-System.md` | 28 |
| `--brand-c-primary` | `#8fa68a` | `docs\todo\TODO.md` | 344 |
| `--brand-c-primary` | `#8b7355` | `files\example-a11y-cream-NEW.css` | 7 |
| `--brand-c-primary` | `var(--brand-c-primary)` | `files\example-BrandDefault-NEW.css` | 7 |
| `--brand-c-primary` | `oklch(0.699 0.048 140.05)` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 10 |
| `--brand-c-primary` | `#8b7355` | `src\styles\themes\a11y\a11y-cream.css` | 4 |
| `--brand-c-primary` | `#C5E1A5` | `src\styles\themes\a11y\a11y-dark.css` | 4 |
| `--brand-c-primary` | `#6d28d9` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 4 |
| `--brand-c-primary` | `#00ff00` | `src\styles\themes\a11y\a11y-high-contrast.css` | 4 |
| `--brand-c-primary` | `#555555` | `src\styles\themes\a11y\a11y-monochrome.css` | 4 |
| `--brand-c-primary` | `#1e40af` | `src\styles\themes\a11y\a11y-protanopia.css` | 4 |
| `--brand-c-primary` | `#cc3399` | `src\styles\themes\a11y\a11y-tritanopia.css` | 4 |
| `--brand-c-primary` | `#8fa68a` | `src\styles\themes\brand\BrandDefault.css` | 7 |
| `--brand-c-primary` | `var(--brand-c-primary)` | `src\styles\themes\Preview\coretokens.css` | 57 |
| `--brand-c-primary-dark` | `#8b7355` | `audit-BEFORE.md` | 1914 |
| `--brand-c-primary-dark` | `#556a50` | `audit-BEFORE.md` | 2023 |
| `--brand-c-primary-dark` | `#556a50` | `audit-BEFORE.md` | 2025 |
| `--brand-c-primary-dark` | `#71876c` | `audit-BEFORE.md` | 2474 |
| `--brand-c-primary-dark` | `#42563d` | `audit-BEFORE.md` | 3588 |
| `--brand-c-primary-dark` | `#364433` | `audit-BEFORE.md` | 3593 |
| `--brand-c-primary-dark` | `oklch(0.52 0.13 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 90 |
| `--brand-c-primary-dark` | `oklch(0.46 0.11 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 91 |
| `--brand-c-primary-dark` | `oklch(0.40 0.09 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 92 |
| `--brand-c-primary-dark` | `oklch(0.34 0.07 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 93 |
| `--brand-c-primary-dark` | `oklch(0.54 0.10 40)` | `docs\Markdown Notes\accessibility-color-themes.md` | 166 |
| `--brand-c-primary-dark` | `oklch(0.46 0.08 38)` | `docs\Markdown Notes\accessibility-color-themes.md` | 167 |
| `--brand-c-primary-dark` | `oklch(0.38 0.07 35)` | `docs\Markdown Notes\accessibility-color-themes.md` | 168 |
| `--brand-c-primary-dark` | `oklch(0.30 0.06 32)` | `docs\Markdown Notes\accessibility-color-themes.md` | 169 |
| `--brand-c-primary-dark` | `#8b7355` | `files\example-a11y-cream-NEW.css` | 14 |
| `--brand-c-primary-dark` | `#556a50` | `files\example-BrandDefault-NEW.css` | 14 |
| `--brand-c-primary-dark` | `oklch(0.591 0.041 140.19)` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 11 |
| `--brand-c-primary-dark` | `#8b7355` | `src\styles\themes\a11y\a11y-cream.css` | 8 |
| `--brand-c-primary-dark` | `#C5E1A5` | `src\styles\themes\a11y\a11y-dark.css` | 8 |
| `--brand-c-primary-dark` | `#6d28d9` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 8 |
| `--brand-c-primary-dark` | `#00ff00` | `src\styles\themes\a11y\a11y-high-contrast.css` | 8 |
| `--brand-c-primary-dark` | `#555555` | `src\styles\themes\a11y\a11y-monochrome.css` | 8 |
| `--brand-c-primary-dark` | `#1e40af` | `src\styles\themes\a11y\a11y-protanopia.css` | 8 |
| `--brand-c-primary-dark` | `#cc3399` | `src\styles\themes\a11y\a11y-tritanopia.css` | 8 |
| `--brand-c-primary-dark` | `#556a50` | `src\styles\themes\brand\BrandDefault.css` | 14 |
| `--brand-c-primary-light` | `#f4fbf2` | `audit-BEFORE.md` | 1840 |
| `--brand-c-primary-light` | `#8b7355` | `audit-BEFORE.md` | 1912 |
| `--brand-c-primary-light` | `#cee6c8` | `audit-BEFORE.md` | 2584 |
| `--brand-c-primary-light` | `#cee6c8` | `audit-BEFORE.md` | 2586 |
| `--brand-c-primary-light` | `#f0fdee` | `audit-BEFORE.md` | 3578 |
| `--brand-c-primary-light` | `oklch(0.93 0.02 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 84 |
| `--brand-c-primary-light` | `oklch(0.86 0.04 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 85 |
| `--brand-c-primary-light` | `oklch(0.78 0.06 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 86 |
| `--brand-c-primary-light` | `oklch(0.70 0.09 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 87 |
| `--brand-c-primary-light` | `oklch(0.96 0.02 70)` | `docs\Markdown Notes\accessibility-color-themes.md` | 160 |
| `--brand-c-primary-light` | `oklch(0.92 0.04 65)` | `docs\Markdown Notes\accessibility-color-themes.md` | 161 |
| `--brand-c-primary-light` | `oklch(0.86 0.06 60)` | `docs\Markdown Notes\accessibility-color-themes.md` | 162 |
| `--brand-c-primary-light` | `oklch(0.78 0.08 55)` | `docs\Markdown Notes\accessibility-color-themes.md` | 163 |
| `--brand-c-primary-light` | `#8b7355` | `files\example-a11y-cream-NEW.css` | 13 |
| `--brand-c-primary-light` | `#cee6c8` | `files\example-BrandDefault-NEW.css` | 13 |
| `--brand-c-primary-light` | `#8b7355` | `src\styles\themes\a11y\a11y-cream.css` | 7 |
| `--brand-c-primary-light` | `#C5E1A5` | `src\styles\themes\a11y\a11y-dark.css` | 7 |
| `--brand-c-primary-light` | `#6d28d9` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 7 |
| `--brand-c-primary-light` | `#00ff00` | `src\styles\themes\a11y\a11y-high-contrast.css` | 7 |
| `--brand-c-primary-light` | `#555555` | `src\styles\themes\a11y\a11y-monochrome.css` | 7 |
| `--brand-c-primary-light` | `#1e40af` | `src\styles\themes\a11y\a11y-protanopia.css` | 7 |
| `--brand-c-primary-light` | `#cc3399` | `src\styles\themes\a11y\a11y-tritanopia.css` | 7 |
| `--brand-c-primary-light` | `#cee6c8` | `src\styles\themes\brand\BrandDefault.css` | 13 |
| `--brand-c-secondary` | `#c4907c` | `audit-BEFORE.md` | 1354 |
| `--brand-c-secondary` | `#c4907c` | `audit-BEFORE.md` | 1356 |
| `--brand-c-secondary` | `#c4907c` | `audit-BEFORE.md` | 1364 |
| `--brand-c-secondary` | `#c4907c` | `audit-BEFORE.md` | 1366 |
| `--brand-c-secondary` | `#c4907c` | `audit-BEFORE.md` | 1368 |
| `--brand-c-secondary` | `#6b8e7a` | `audit-BEFORE.md` | 1923 |
| `--brand-c-secondary` | `#ffff00` | `audit-BEFORE.md` | 2052 |
| `--brand-c-secondary` | `#e5af9a` | `audit-BEFORE.md` | 3608 |
| `--brand-c-secondary` | `oklch(0.66 0.11 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 99 |
| `--brand-c-secondary` | `oklch(0.60 0.12 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 100 |
| `--brand-c-secondary` | `oklch(0.71 0.10 28)` | `docs\Markdown Notes\accessibility-color-themes.md` | 175 |
| `--brand-c-secondary` | `oklch(0.63 0.10 25)` | `docs\Markdown Notes\accessibility-color-themes.md` | 176 |
| `--brand-c-secondary` | `#ffff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 227 |
| `--brand-c-secondary` | `#c4907c` | `docs\Markdown Notes\Theme-Preview-System.md` | 29 |
| `--brand-c-secondary` | `#6b8e7a` | `files\example-a11y-cream-NEW.css` | 8 |
| `--brand-c-secondary` | `var(--brand-c-secondary)` | `files\example-BrandDefault-NEW.css` | 8 |
| `--brand-c-secondary` | `#6b8e7a` | `src\styles\themes\a11y\a11y-cream.css` | 5 |
| `--brand-c-secondary` | `#272596` | `src\styles\themes\a11y\a11y-dark.css` | 5 |
| `--brand-c-secondary` | `#f97316` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 5 |
| `--brand-c-secondary` | `#00ffff` | `src\styles\themes\a11y\a11y-high-contrast.css` | 5 |
| `--brand-c-secondary` | `#777777` | `src\styles\themes\a11y\a11y-monochrome.css` | 5 |
| `--brand-c-secondary` | `#f59e0b` | `src\styles\themes\a11y\a11y-protanopia.css` | 5 |
| `--brand-c-secondary` | `#06b6d4` | `src\styles\themes\a11y\a11y-tritanopia.css` | 5 |
| `--brand-c-secondary` | `#c4907c` | `src\styles\themes\brand\BrandDefault.css` | 8 |
| `--brand-c-secondary` | `var(--brand-c-secondary)` | `src\styles\themes\Preview\coretokens.css` | 58 |
| `--brand-c-secondary-dark` | `#5a3420` | `audit-BEFORE.md` | 1690 |
| `--brand-c-secondary-dark` | `#5a3420` | `audit-BEFORE.md` | 1692 |
| `--brand-c-secondary-dark` | `#5a3420` | `audit-BEFORE.md` | 1694 |
| `--brand-c-secondary-dark` | `#5a3420`** (line 32)`` | `audit-BEFORE.md` | 1696 |
| `--brand-c-secondary-dark` | `#5a3420` | `audit-BEFORE.md` | 1698 |
| `--brand-c-secondary-dark` | `#5a3420` | `audit-BEFORE.md` | 1700 |
| `--brand-c-secondary-dark` | `#6b8e7a` | `audit-BEFORE.md` | 1927 |
| `--brand-c-secondary-dark` | `#855543` | `audit-BEFORE.md` | 2598 |
| `--brand-c-secondary-dark` | `#855543` | `audit-BEFORE.md` | 2600 |
| `--brand-c-secondary-dark` | `#a4725f` | `audit-BEFORE.md` | 3613 |
| `--brand-c-secondary-dark` | `#6f4230` | `audit-BEFORE.md` | 3618 |
| `--brand-c-secondary-dark` | `oklch(0.54 0.10 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 101 |
| `--brand-c-secondary-dark` | `oklch(0.48 0.08 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 102 |
| `--brand-c-secondary-dark` | `oklch(0.42 0.06 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 103 |
| `--brand-c-secondary-dark` | `oklch(0.55 0.10 22)` | `docs\Markdown Notes\accessibility-color-themes.md` | 177 |
| `--brand-c-secondary-dark` | `oklch(0.47 0.08 20)` | `docs\Markdown Notes\accessibility-color-themes.md` | 178 |
| `--brand-c-secondary-dark` | `oklch(0.39 0.06 18)` | `docs\Markdown Notes\accessibility-color-themes.md` | 179 |
| `--brand-c-secondary-dark` | `#5a3420` | `docs\reports\color-token-usage-report.md` | 193 |
| `--brand-c-secondary-dark` | `#5a3420` | `docs\reports\color-token-usage-report.md` | 648 |
| `--brand-c-secondary-dark` | `#5a3420` | `docs\reports\color-token-usage-report.md` | 691 |
| `--brand-c-secondary-dark` | `#5a3420`** (line 32)` | `docs\reports\FIXES-APPLIED.md` | 12 |
| `--brand-c-secondary-dark` | `#5a3420` | `docs\todo\TODO.md` | 257 |
| `--brand-c-secondary-dark` | `#6b8e7a` | `files\example-a11y-cream-NEW.css` | 20 |
| `--brand-c-secondary-dark` | `#855543` | `files\example-BrandDefault-NEW.css` | 20 |
| `--brand-c-secondary-dark` | `#6b8e7a` | `src\styles\themes\a11y\a11y-cream.css` | 11 |
| `--brand-c-secondary-dark` | `#272596` | `src\styles\themes\a11y\a11y-dark.css` | 11 |
| `--brand-c-secondary-dark` | `#f97316` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 11 |
| `--brand-c-secondary-dark` | `#00ffff` | `src\styles\themes\a11y\a11y-high-contrast.css` | 11 |
| `--brand-c-secondary-dark` | `#777777` | `src\styles\themes\a11y\a11y-monochrome.css` | 11 |
| `--brand-c-secondary-dark` | `#f59e0b` | `src\styles\themes\a11y\a11y-protanopia.css` | 11 |
| `--brand-c-secondary-dark` | `#06b6d4` | `src\styles\themes\a11y\a11y-tritanopia.css` | 11 |
| `--brand-c-secondary-dark` | `#855543` | `src\styles\themes\brand\BrandDefault.css` | 20 |
| `--brand-c-secondary-light` | `#6b8e7a` | `audit-BEFORE.md` | 1925 |
| `--brand-c-secondary-light` | `#ffcfba` | `audit-BEFORE.md` | 2591 |
| `--brand-c-secondary-light` | `#ffcfba` | `audit-BEFORE.md` | 2593 |
| `--brand-c-secondary-light` | `#fff4ee` | `audit-BEFORE.md` | 3598 |
| `--brand-c-secondary-light` | `#fff1e7` | `audit-BEFORE.md` | 3603 |
| `--brand-c-secondary-light` | `oklch(0.88 0.06 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 96 |
| `--brand-c-secondary-light` | `oklch(0.80 0.08 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 97 |
| `--brand-c-secondary-light` | `oklch(0.72 0.10 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 98 |
| `--brand-c-secondary-light` | `oklch(0.92 0.04 35)` | `docs\Markdown Notes\accessibility-color-themes.md` | 172 |
| `--brand-c-secondary-light` | `oklch(0.86 0.06 32)` | `docs\Markdown Notes\accessibility-color-themes.md` | 173 |
| `--brand-c-secondary-light` | `oklch(0.79 0.08 30)` | `docs\Markdown Notes\accessibility-color-themes.md` | 174 |
| `--brand-c-secondary-light` | `#6b8e7a` | `files\example-a11y-cream-NEW.css` | 19 |
| `--brand-c-secondary-light` | `#ffcfba` | `files\example-BrandDefault-NEW.css` | 19 |
| `--brand-c-secondary-light` | `#6b8e7a` | `src\styles\themes\a11y\a11y-cream.css` | 10 |
| `--brand-c-secondary-light` | `#272596` | `src\styles\themes\a11y\a11y-dark.css` | 10 |
| `--brand-c-secondary-light` | `#f97316` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 10 |
| `--brand-c-secondary-light` | `#00ffff` | `src\styles\themes\a11y\a11y-high-contrast.css` | 10 |
| `--brand-c-secondary-light` | `#777777` | `src\styles\themes\a11y\a11y-monochrome.css` | 10 |
| `--brand-c-secondary-light` | `#f59e0b` | `src\styles\themes\a11y\a11y-protanopia.css` | 10 |
| `--brand-c-secondary-light` | `#06b6d4` | `src\styles\themes\a11y\a11y-tritanopia.css` | 10 |
| `--brand-c-secondary-light` | `#ffcfba` | `src\styles\themes\brand\BrandDefault.css` | 19 |
| `--brand-c-text` | `#ffffff` | `audit-BEFORE.md` | 847 |
| `--brand-c-text` | `#ffffff` | `audit-BEFORE.md` | 849 |
| `--brand-c-text` | `#ffffff` | `audit-BEFORE.md` | 851 |
| `--brand-c-text` | `#4a3f2f` | `audit-BEFORE.md` | 1259 |
| `--brand-c-text` | `#474747` | `audit-BEFORE.md` | 1448 |
| `--brand-c-text` | `#474747` | `audit-BEFORE.md` | 1450 |
| `--brand-c-text` | `#474747` | `audit-BEFORE.md` | 1456 |
| `--brand-c-text` | `#474747` | `audit-BEFORE.md` | 1458 |
| `--brand-c-text` | `#474747` | `audit-BEFORE.md` | 1460 |
| `--brand-c-text` | `#777777` | `audit-BEFORE.md` | 1653 |
| `--brand-c-text` | `#262626` | `audit-BEFORE.md` | 2348 |
| `--brand-c-text` | `#5a5a5a` | `audit-BEFORE.md` | 2698 |
| `--brand-c-text` | `#373737` | `audit-BEFORE.md` | 2759 |
| `--brand-c-text` | `oklch(0.78 0.015 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 77 |
| `--brand-c-text` | `oklch(0.72 0.015 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 78 |
| `--brand-c-text` | `oklch(0.66 0.015 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 79 |
| `--brand-c-text` | `oklch(0.27 0.03 34)` | `docs\Markdown Notes\accessibility-color-themes.md` | 153 |
| `--brand-c-text` | `oklch(0.24 0.025 33)` | `docs\Markdown Notes\accessibility-color-themes.md` | 154 |
| `--brand-c-text` | `oklch(0.21 0.020 32)` | `docs\Markdown Notes\accessibility-color-themes.md` | 155 |
| `--brand-c-text` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 220 |
| `--brand-c-text` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 221 |
| `--brand-c-text` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 222 |
| `--brand-c-text` | `#474747` | `docs\Markdown Notes\Theme-Preview-System.md` | 27 |
| `--brand-c-text` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 6 |
| `--brand-c-text` | `var(--brand-c-text)` | `files\example-BrandDefault-NEW.css` | 6 |
| `--brand-c-text` | `#373737` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 14 |
| `--brand-c-text` | `#262626` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 15 |
| `--brand-c-text` | `#4a3f2f` | `src\styles\themes\a11y\a11y-cream.css` | 3 |
| `--brand-c-text` | `#ccd3da` | `src\styles\themes\a11y\a11y-dark.css` | 3 |
| `--brand-c-text` | `#1c1b29` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 3 |
| `--brand-c-text` | `#ffffff` | `src\styles\themes\a11y\a11y-high-contrast.css` | 3 |
| `--brand-c-text` | `#333333` | `src\styles\themes\a11y\a11y-monochrome.css` | 3 |
| `--brand-c-text` | `#0f172a` | `src\styles\themes\a11y\a11y-protanopia.css` | 3 |
| `--brand-c-text` | `#1e293b` | `src\styles\themes\a11y\a11y-tritanopia.css` | 3 |
| `--brand-c-text` | `#474747` | `src\styles\themes\brand\BrandDefault.css` | 6 |
| `--brand-c-text` | `var(--brand-c-text)` | `src\styles\themes\Preview\coretokens.css` | 56 |
| `--brand-c-text-dark` | `#ffffff` | `audit-BEFORE.md` | 853 |
| `--brand-c-text-dark` | `#ffffff` | `audit-BEFORE.md` | 855 |
| `--brand-c-text-dark` | `#4a3f2f` | `audit-BEFORE.md` | 1269 |
| `--brand-c-text-dark` | `#262626` | `audit-BEFORE.md` | 2346 |
| `--brand-c-text-dark` | `#262626` | `audit-BEFORE.md` | 2350 |
| `--brand-c-text-dark` | `#373737` | `audit-BEFORE.md` | 2761 |
| `--brand-c-text-dark` | `#181818` | `audit-BEFORE.md` | 3158 |
| `--brand-c-text-dark` | `oklch(0.60 0.015 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 80 |
| `--brand-c-text-dark` | `oklch(0.56 0.015 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 81 |
| `--brand-c-text-dark` | `oklch(0.18 0.018 30)` | `docs\Markdown Notes\accessibility-color-themes.md` | 156 |
| `--brand-c-text-dark` | `oklch(0.16 0.016 28)` | `docs\Markdown Notes\accessibility-color-themes.md` | 157 |
| `--brand-c-text-dark` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 223 |
| `--brand-c-text-dark` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 224 |
| `--brand-c-text-dark` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 39 |
| `--brand-c-text-dark` | `#262626` | `files\example-BrandDefault-NEW.css` | 39 |
| `--brand-c-text-dark` | `#181818` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 16 |
| `--brand-c-text-dark` | `#4a3f2f` | `src\styles\themes\a11y\a11y-cream.css` | 21 |
| `--brand-c-text-dark` | `#ccd3da` | `src\styles\themes\a11y\a11y-dark.css` | 21 |
| `--brand-c-text-dark` | `#1c1b29` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 21 |
| `--brand-c-text-dark` | `#ffffff` | `src\styles\themes\a11y\a11y-high-contrast.css` | 21 |
| `--brand-c-text-dark` | `#333333` | `src\styles\themes\a11y\a11y-monochrome.css` | 21 |
| `--brand-c-text-dark` | `#0f172a` | `src\styles\themes\a11y\a11y-protanopia.css` | 21 |
| `--brand-c-text-dark` | `#1e293b` | `src\styles\themes\a11y\a11y-tritanopia.css` | 21 |
| `--brand-c-text-dark` | `#262626` | `src\styles\themes\brand\BrandDefault.css` | 39 |
| `--brand-c-text-light` | `#ffffff` | `audit-BEFORE.md` | 841 |
| `--brand-c-text-light` | `#ffffff` | `audit-BEFORE.md` | 843 |
| `--brand-c-text-light` | `#ffffff` | `audit-BEFORE.md` | 845 |
| `--brand-c-text-light` | `#4a3f2f` | `audit-BEFORE.md` | 1267 |
| `--brand-c-text-light` | `#777777` | `audit-BEFORE.md` | 1649 |
| `--brand-c-text-light` | `#e8e8e8` | `audit-BEFORE.md` | 2319 |
| `--brand-c-text-light` | `#e8e8e8`** (line 48)`` | `audit-BEFORE.md` | 2321 |
| `--brand-c-text-light` | `#e8e8e8` | `audit-BEFORE.md` | 2323 |
| `--brand-c-text-light` | `#dbdbdb`** (line 49)`` | `audit-BEFORE.md` | 2535 |
| `--brand-c-text-light` | `#dbdbdb` | `audit-BEFORE.md` | 2537 |
| `--brand-c-text-light` | `#f8f8f8` | `audit-BEFORE.md` | 3643 |
| `--brand-c-text-light` | `#d3d3d3` | `audit-BEFORE.md` | 3648 |
| `--brand-c-text-light` | `#b3b3b3` | `audit-BEFORE.md` | 3653 |
| `--brand-c-text-light` | `#949494` | `audit-BEFORE.md` | 3658 |
| `--brand-c-text-light` | `oklch(0.92 0.01 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 74 |
| `--brand-c-text-light` | `oklch(0.88 0.01 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 75 |
| `--brand-c-text-light` | `oklch(0.84 0.01 260)` | `docs\Markdown Notes\accessibility-color-themes.md` | 76 |
| `--brand-c-text-light` | `oklch(0.36 0.03 40)` | `docs\Markdown Notes\accessibility-color-themes.md` | 150 |
| `--brand-c-text-light` | `oklch(0.33 0.03 38)` | `docs\Markdown Notes\accessibility-color-themes.md` | 151 |
| `--brand-c-text-light` | `oklch(0.30 0.03 36)` | `docs\Markdown Notes\accessibility-color-themes.md` | 152 |
| `--brand-c-text-light` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 217 |
| `--brand-c-text-light` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 218 |
| `--brand-c-text-light` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 219 |
| `--brand-c-text-light` | `#e8e8e8` | `docs\reports\color-token-usage-report.md` | 692 |
| `--brand-c-text-light` | `#e8e8e8`** (line 48)` | `docs\reports\FIXES-APPLIED.md` | 16 |
| `--brand-c-text-light` | `#dbdbdb`** (line 49)` | `docs\reports\FIXES-APPLIED.md` | 20 |
| `--brand-c-text-light` | `#4a3f2f` | `files\example-a11y-cream-NEW.css` | 38 |
| `--brand-c-text-light` | `#777777` | `files\example-BrandDefault-NEW.css` | 38 |
| `--brand-c-text-light` | `#4a3f2f` | `src\styles\themes\a11y\a11y-cream.css` | 20 |
| `--brand-c-text-light` | `#ccd3da` | `src\styles\themes\a11y\a11y-dark.css` | 20 |
| `--brand-c-text-light` | `#1c1b29` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 20 |
| `--brand-c-text-light` | `#ffffff` | `src\styles\themes\a11y\a11y-high-contrast.css` | 20 |
| `--brand-c-text-light` | `#333333` | `src\styles\themes\a11y\a11y-monochrome.css` | 20 |
| `--brand-c-text-light` | `#0f172a` | `src\styles\themes\a11y\a11y-protanopia.css` | 20 |
| `--brand-c-text-light` | `#1e293b` | `src\styles\themes\a11y\a11y-tritanopia.css` | 20 |
| `--brand-c-text-light` | `#777777` | `src\styles\themes\brand\BrandDefault.css` | 38 |
| `--brand-neutral` | `#FDF8F3` | `audit-BEFORE.md` | 3068 |
| `--brand-neutral` | `#c7948a` | `audit-BEFORE.md` | 3133 |
| `--brand-neutral` | `#FDF8F3` | `src\scripts\ThemeTokenGen\brand-template.css` | 60 |
| `--brand-neutral` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 58 |
| `--brand-neutral` | `#c7948a` | `src\scripts\ThemeTokenGen\color-input.css` | 81 |
| `--brand-neutral` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 58 |
| `--brand-primary` | `#8FA68A` | `audit-BEFORE.md` | 1140 |
| `--brand-primary` | `#8FA68A` | `audit-BEFORE.md` | 1142 |
| `--brand-primary` | `#8FA68A` | `audit-BEFORE.md` | 1144 |
| `--brand-primary` | `#8FA68A` | `audit-BEFORE.md` | 1148 |
| `--brand-primary` | `#86a182` | `audit-BEFORE.md` | 3103 |
| `--brand-primary` | `#8FA68A` | `src\scripts\ThemeTokenGen\brand-template.css` | 7 |
| `--brand-primary` | `#8FA68A` | `src\scripts\ThemeTokenGen\brand-template.css` | 35 |
| `--brand-primary` | `#8FA68A` | `src\scripts\ThemeTokenGen\color-input.css` | 20 |
| `--brand-primary` | `#86a182` | `src\scripts\ThemeTokenGen\color-input.css` | 75 |
| `--brand-primary` | `#8FA68A` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 15 |
| `--brand-secondary` | `#C4907C` | `audit-BEFORE.md` | 1362 |
| `--brand-secondary` | `#b9a26e` | `audit-BEFORE.md` | 3108 |
| `--brand-secondary` | `auto` | `src\scripts\ThemeTokenGen\brand-template.css` | 10 |
| `--brand-secondary` | `#C4907C` | `src\scripts\ThemeTokenGen\brand-template.css` | 38 |
| `--brand-secondary` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 28 |
| `--brand-secondary` | `#b9a26e` | `src\scripts\ThemeTokenGen\color-input.css` | 76 |
| `--brand-secondary` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 23 |
| `--brand-text` | `#5A5A5A` | `audit-BEFORE.md` | 2696 |
| `--brand-text` | `#0e3f2e` | `audit-BEFORE.md` | 2719 |
| `--brand-text` | `#5A5A5A` | `src\scripts\ThemeTokenGen\brand-template.css` | 56 |
| `--brand-text` | `auto` | `src\scripts\ThemeTokenGen\color-input.css` | 55 |
| `--brand-text` | `#0e3f2e` | `src\scripts\ThemeTokenGen\color-input.css` | 84 |
| `--brand-text` | `auto` | `src\scripts\ThemeTokenGen\color-theory-explorer.css` | 55 |
| `--btn-filled-text` | `var(--color-White)` | `audit-BEFORE.md` | 420 |
| `--btn-filled-text` | `var(--color-White)` | `audit-BEFORE.md` | 422 |
| `--btn-filled-text` | `var(--color-White)` | `audit-BEFORE.md` | 814 |
| `--btn-filled-text` | `var(--color-White)` | `audit-BEFORE.md` | 816 |
| `--btn-filled-text` | `var(--color-White)` | `audit-BEFORE.md` | 818 |
| `--btn-filled-text` | `var(--color-White)` | `audit-BEFORE.md` | 820 |
| `--btn-filled-text` | `var(--color-White)` | `audit-BEFORE.md` | 822 |
| `--btn-filled-text` | `#000000` | `audit-BEFORE.md` | 1219 |
| `--btn-filled-text` | `var(--color-White)` | `files\example-a11y-cream-NEW.css` | 46 |
| `--btn-filled-text` | `var(--color-White)` | `files\example-BrandDefault-NEW.css` | 46 |
| `--btn-filled-text` | `var(--color-White)` | `src\styles\themes\a11y\a11y-cream.css` | 25 |
| `--btn-filled-text` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 32 |
| `--btn-filled-text` | `var(--color-White)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 25 |
| `--btn-filled-text` | `var(--color-Black)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 30 |
| `--btn-filled-text` | `var(--color-White)` | `src\styles\themes\a11y\a11y-monochrome.css` | 25 |
| `--btn-filled-text` | `var(--color-White)` | `src\styles\themes\a11y\a11y-protanopia.css` | 25 |
| `--btn-filled-text` | `var(--color-White)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 25 |
| `--btn-filled-text` | `var(--color-White)` | `src\styles\themes\brand\BrandDefault.css` | 46 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `files\example-a11y-cream-NEW.css` | 48 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `files\example-BrandDefault-NEW.css` | 48 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 27 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 34 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 27 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 32 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 27 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 27 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 27 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `src\styles\themes\brand\BrandDefault.css` | 48 |
| `--btn-icon-color` | `${iconColor` | `src\components\Button\Button.astro` | 81 |
| `--btn-icon-hover` | `${iconHoverColor` | `src\components\Button\Button.astro` | 82 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `files\example-a11y-cream-NEW.css` | 47 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `files\example-BrandDefault-NEW.css` | 47 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-cream.css` | 26 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-dark.css` | 33 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 26 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 31 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-monochrome.css` | 26 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-protanopia.css` | 26 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 26 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `src\styles\themes\brand\BrandDefault.css` | 47 |
| `--btn-text-color` | `${textColor` | `src\components\Button\Button.astro` | 79 |
| `--btn-text-hover` | `${textHoverColor` | `src\components\Button\Button.astro` | 80 |
| `--card-hover-border` | `${hoverBorder` | `src\components\Masonry\MasonryCards\MasonryCard.astro` | 100 |
| `--color-Background-600` | `#5a5754`** (line 41)`` | `audit-BEFORE.md` | 2542 |
| `--color-Background-600` | `#5a5754` | `audit-BEFORE.md` | 2544 |
| `--color-Background-600` | `#5a5754`** (line 41)` | `docs\reports\FIXES-APPLIED.md` | 56 |
| `--color-Background-700` | `#3e3b39`** (line 42)`` | `audit-BEFORE.md` | 2549 |
| `--color-Background-700` | `#3e3b39` | `audit-BEFORE.md` | 2551 |
| `--color-Background-700` | `#3e3b39`** (line 42)` | `docs\reports\FIXES-APPLIED.md` | 57 |
| `--color-Background-800` | `#2b2927`** (line 43)`` | `audit-BEFORE.md` | 2556 |
| `--color-Background-800` | `#2b2927` | `audit-BEFORE.md` | 2558 |
| `--color-Background-800` | `#2b2927`** (line 43)` | `docs\reports\FIXES-APPLIED.md` | 58 |
| `--color-Black` | `#121212` | `audit-BEFORE.md` | 1038 |
| `--color-Black` | `#121212` | `audit-BEFORE.md` | 2124 |
| `--color-Black` | `#121212` | `src\styles\tokens\status.css` | 10 |
| `--color-Danger` | `#ff0000` | `audit-BEFORE.md` | 2495 |
| `--color-Danger` | `var(--color-Error)` | `docs\Markdown Notes\accessibility-color-themes.md` | 116 |
| `--color-Danger` | `var(--color-Error)` | `docs\Markdown Notes\accessibility-color-themes.md` | 192 |
| `--color-Danger` | `#ff0000` | `docs\Markdown Notes\accessibility-color-themes.md` | 238 |
| `--color-Danger` | `var(--color-Error)` | `docs\Markdown Notes\accessibility-color-themes.md` | 272 |
| `--color-Danger` | `var(--color-Error)` | `docs\Markdown Notes\accessibility-color-themes.md` | 294 |
| `--color-Danger` | `var(--color-Error)` | `docs\Markdown Notes\accessibility-color-themes.md` | 316 |
| `--color-Danger` | `var(--color-Error)` | `docs\Markdown Notes\accessibility-color-themes.md` | 338 |
| `--color-Error` | `#ff0000` | `audit-BEFORE.md` | 2493 |
| `--color-Error` | `#f44336` | `audit-BEFORE.md` | 2509 |
| `--color-Error` | `oklch(0.62 0.18 25)` | `docs\Markdown Notes\accessibility-color-themes.md` | 115 |
| `--color-Error` | `oklch(0.56 0.14 25)` | `docs\Markdown Notes\accessibility-color-themes.md` | 191 |
| `--color-Error` | `#ff0000` | `docs\Markdown Notes\accessibility-color-themes.md` | 237 |
| `--color-Error` | `oklch(0.55 0.14 250)` | `docs\Markdown Notes\accessibility-color-themes.md` | 271 |
| `--color-Error` | `oklch(0.62 0.10 25)` | `docs\Markdown Notes\accessibility-color-themes.md` | 293 |
| `--color-Error` | `oklch(0.60 0.18 25)` | `docs\Markdown Notes\accessibility-color-themes.md` | 315 |
| `--color-Error` | `oklch(0.48 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 337 |
| `--color-Error` | `#f44336` | `src\styles\tokens\status.css` | 19 |
| `--color-Error-100` | `${toOKLCH(chroma.hsl(15, 0.4 * satAdjust, 0.92 * lightAdjust).hex())` | `audit-BEFORE.md` | 3393 |
| `--color-Error-100` | `${toOKLCH(chroma.hsl(15, 0.4 * satAdjust, 0.92 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1936 |
| `--color-Error-200` | `${toOKLCH(chroma.hsl(15, 0.6 * satAdjust, 0.80 * lightAdjust).hex())` | `audit-BEFORE.md` | 3398 |
| `--color-Error-200` | `${toOKLCH(chroma.hsl(15, 0.6 * satAdjust, 0.80 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1937 |
| `--color-Error-500` | `${toOKLCH(chroma.hsl(15, 0.8 * satAdjust, 0.55 * lightAdjust).hex())` | `audit-BEFORE.md` | 3403 |
| `--color-Error-500` | `${toOKLCH(chroma.hsl(15, 0.8 * satAdjust, 0.55 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1938 |
| `--color-Info` | `#00ffff` | `audit-BEFORE.md` | 1795 |
| `--color-Info` | `#2196f3` | `audit-BEFORE.md` | 2516 |
| `--color-Info` | `oklch(0.68 0.12 250)` | `docs\Markdown Notes\accessibility-color-themes.md` | 117 |
| `--color-Info` | `oklch(0.56 0.08 250)` | `docs\Markdown Notes\accessibility-color-themes.md` | 193 |
| `--color-Info` | `#00ffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 239 |
| `--color-Info` | `oklch(0.66 0.10 280)` | `docs\Markdown Notes\accessibility-color-themes.md` | 273 |
| `--color-Info` | `oklch(0.62 0.10 300)` | `docs\Markdown Notes\accessibility-color-themes.md` | 295 |
| `--color-Info` | `oklch(0.62 0.16 350)` | `docs\Markdown Notes\accessibility-color-themes.md` | 317 |
| `--color-Info` | `oklch(0.66 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 339 |
| `--color-Info` | `#2196f3` | `src\styles\tokens\status.css` | 20 |
| `--color-Info-100` | `${toOKLCH(chroma.hsl(215, 0.4 * satAdjust, 0.92 * lightAdjust).hex())` | `audit-BEFORE.md` | 3408 |
| `--color-Info-100` | `${toOKLCH(chroma.hsl(215, 0.4 * satAdjust, 0.92 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1941 |
| `--color-Info-200` | `${toOKLCH(chroma.hsl(215, 0.6 * satAdjust, 0.80 * lightAdjust).hex())` | `audit-BEFORE.md` | 3413 |
| `--color-Info-200` | `${toOKLCH(chroma.hsl(215, 0.6 * satAdjust, 0.80 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1942 |
| `--color-Info-500` | `${toOKLCH(chroma.hsl(215, 0.7 * satAdjust, 0.55 * lightAdjust).hex())` | `audit-BEFORE.md` | 3418 |
| `--color-Info-500` | `${toOKLCH(chroma.hsl(215, 0.7 * satAdjust, 0.55 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1943 |
| `--color-Success` | `#00ff00` | `audit-BEFORE.md` | 2065 |
| `--color-Success` | `#4caf50` | `audit-BEFORE.md` | 2305 |
| `--color-Success` | `oklch(0.68 0.12 145)` | `docs\Markdown Notes\accessibility-color-themes.md` | 113 |
| `--color-Success` | `oklch(0.56 0.10 145)` | `docs\Markdown Notes\accessibility-color-themes.md` | 189 |
| `--color-Success` | `#00ff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 235 |
| `--color-Success` | `oklch(0.62 0.12 220)` | `docs\Markdown Notes\accessibility-color-themes.md` | 269 |
| `--color-Success` | `oklch(0.62 0.14 255)` | `docs\Markdown Notes\accessibility-color-themes.md` | 291 |
| `--color-Success` | `oklch(0.66 0.14 145)` | `docs\Markdown Notes\accessibility-color-themes.md` | 313 |
| `--color-Success` | `oklch(0.62 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 335 |
| `--color-Success` | `#4caf50` | `src\styles\tokens\status.css` | 17 |
| `--color-Success-100` | `${toOKLCH(chroma.hsl(145, 0.3 * satAdjust, 0.92 * lightAdjust).hex())` | `audit-BEFORE.md` | 3363 |
| `--color-Success-100` | `${toOKLCH(chroma.hsl(145, 0.3 * satAdjust, 0.92 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1926 |
| `--color-Success-200` | `${toOKLCH(chroma.hsl(145, 0.5 * satAdjust, 0.80 * lightAdjust).hex())` | `audit-BEFORE.md` | 3368 |
| `--color-Success-200` | `${toOKLCH(chroma.hsl(145, 0.5 * satAdjust, 0.80 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1927 |
| `--color-Success-500` | `${toOKLCH(chroma.hsl(145, 0.6 * satAdjust, 0.50 * lightAdjust).hex())` | `audit-BEFORE.md` | 3373 |
| `--color-Success-500` | `${toOKLCH(chroma.hsl(145, 0.6 * satAdjust, 0.50 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1928 |
| `--color-Warning` | `#ffff00` | `audit-BEFORE.md` | 2056 |
| `--color-Warning` | `#ff9800` | `audit-BEFORE.md` | 2502 |
| `--color-Warning` | `oklch(0.76 0.14 85)` | `docs\Markdown Notes\accessibility-color-themes.md` | 114 |
| `--color-Warning` | `oklch(0.72 0.12 70)` | `docs\Markdown Notes\accessibility-color-themes.md` | 190 |
| `--color-Warning` | `#ffff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 236 |
| `--color-Warning` | `oklch(0.78 0.14 85)` | `docs\Markdown Notes\accessibility-color-themes.md` | 270 |
| `--color-Warning` | `oklch(0.72 0.16 55)` | `docs\Markdown Notes\accessibility-color-themes.md` | 292 |
| `--color-Warning` | `oklch(0.74 0.14 80)` | `docs\Markdown Notes\accessibility-color-themes.md` | 314 |
| `--color-Warning` | `oklch(0.78 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 336 |
| `--color-Warning` | `#ff9800` | `src\styles\tokens\status.css` | 18 |
| `--color-Warning-100` | `${toOKLCH(chroma.hsl(45, 0.4 * satAdjust, 0.92 * lightAdjust).hex())` | `audit-BEFORE.md` | 3378 |
| `--color-Warning-100` | `${toOKLCH(chroma.hsl(45, 0.4 * satAdjust, 0.92 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1931 |
| `--color-Warning-200` | `${toOKLCH(chroma.hsl(45, 0.6 * satAdjust, 0.80 * lightAdjust).hex())` | `audit-BEFORE.md` | 3383 |
| `--color-Warning-200` | `${toOKLCH(chroma.hsl(45, 0.6 * satAdjust, 0.80 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1932 |
| `--color-Warning-500` | `${toOKLCH(chroma.hsl(45, 0.8 * satAdjust, 0.60 * lightAdjust).hex())` | `audit-BEFORE.md` | 3388 |
| `--color-Warning-500` | `${toOKLCH(chroma.hsl(45, 0.8 * satAdjust, 0.60 * lightAdjust).hex())` | `src\scripts\ThemeTokenGen\interactive-palette-builder.html` | 1933 |
| `--color-White` | `#ffffff` | `audit-BEFORE.md` | 834 |
| `--color-White` | `#ffffff` | `audit-BEFORE.md` | 967 |
| `--color-White` | `#ffffff` | `src\styles\tokens\status.css` | 11 |
| `--disabledBg` | `color-mix(in oklch, var(--surface) 92%, var(--text) 8%)` | `docs\Markdown Notes\accessibility-color-themes.md` | 46 |
| `--disabledText` | `color-mix(in oklch, var(--text) 45%, transparent)` | `docs\Markdown Notes\accessibility-color-themes.md` | 47 |
| `--dropdown-accent1-border` | `var(--brand-c-neutral)` | `src\styles\buttons\dropdown-tokens.css` | 42 |
| `--dropdown-accent1-hover-bg` | `var(--brand-c-neutral-light)` | `src\styles\buttons\dropdown-tokens.css` | 23 |
| `--dropdown-accent1-hover-text` | `var(--brand-c-neutral-dark)` | `src\styles\buttons\dropdown-tokens.css` | 24 |
| `--dropdown-accent2-border` | `var(--brand-c-neutral)` | `src\styles\buttons\dropdown-tokens.css` | 43 |
| `--dropdown-accent2-hover-bg` | `var(--brand-c-neutral-light)` | `src\styles\buttons\dropdown-tokens.css` | 26 |
| `--dropdown-accent2-hover-text` | `var(--brand-c-neutral-dark)` | `src\styles\buttons\dropdown-tokens.css` | 27 |
| `--dropdown-accent3-border` | `var(--brand-c-neutral)` | `src\styles\buttons\dropdown-tokens.css` | 44 |
| `--dropdown-accent3-hover-bg` | `var(--brand-c-neutral-light)` | `src\styles\buttons\dropdown-tokens.css` | 29 |
| `--dropdown-accent3-hover-text` | `var(--brand-c-neutral-dark)` | `src\styles\buttons\dropdown-tokens.css` | 30 |
| `--dropdown-accent4-border` | `var(--brand-c-neutral)` | `src\styles\buttons\dropdown-tokens.css` | 45 |
| `--dropdown-accent4-hover-bg` | `var(--brand-c-neutral-light)` | `src\styles\buttons\dropdown-tokens.css` | 32 |
| `--dropdown-accent4-hover-text` | `var(--brand-c-neutral-dark)` | `src\styles\buttons\dropdown-tokens.css` | 33 |
| `--dropdown-accent5-border` | `var(--brand-c-neutral)` | `src\styles\buttons\dropdown-tokens.css` | 46 |
| `--dropdown-accent5-hover-bg` | `var(--brand-c-neutral-light)` | `src\styles\buttons\dropdown-tokens.css` | 35 |
| `--dropdown-accent5-hover-text` | `var(--brand-c-neutral-dark)` | `src\styles\buttons\dropdown-tokens.css` | 36 |
| `--dropdown-border-color` | `var(--brand-c-primary)` | `src\styles\buttons\dropdown-tokens.css` | 39 |
| `--dropdown-hover-bg` | `var(--brand-c-primary-light)` | `src\styles\buttons\dropdown-tokens.css` | 9 |
| `--dropdown-hover-text` | `var(--brand-c-primary-dark)` | `src\styles\buttons\dropdown-tokens.css` | 10 |
| `--dropdown-primary-border` | `var(--brand-c-primary)` | `src\styles\buttons\dropdown-tokens.css` | 40 |
| `--dropdown-primary-hover-bg` | `var(--brand-c-primary-light)` | `src\styles\buttons\dropdown-tokens.css` | 15 |
| `--dropdown-primary-hover-text` | `var(--brand-c-primary-dark)` | `src\styles\buttons\dropdown-tokens.css` | 16 |
| `--dropdown-secondary-border` | `var(--brand-c-secondary)` | `src\styles\buttons\dropdown-tokens.css` | 41 |
| `--dropdown-secondary-hover-bg` | `var(--brand-c-secondary-light)` | `src\styles\buttons\dropdown-tokens.css` | 19 |
| `--dropdown-secondary-hover-text` | `var(--brand-c-secondary-dark)` | `src\styles\buttons\dropdown-tokens.css` | 20 |
| `--dropdown-selected-bg` | `var(--brand-c-primary-light)` | `src\styles\buttons\dropdown-tokens.css` | 11 |
| `--dropdown-selected-text` | `var(--brand-c-primary-dark)` | `src\styles\buttons\dropdown-tokens.css` | 12 |
| `--error` | `var(--color-Error)` | `docs\Markdown Notes\accessibility-color-themes.md` | 40 |
| `--feedback-error-bg` | `var(--color-Error)` | `docs\todo\TODO.md` | 382 |
| `--feedback-error-border` | `var(--color-Error)` | `docs\todo\TODO.md` | 384 |
| `--feedback-error-text` | `#7f1d1d` | `audit-BEFORE.md` | 3013 |
| `--feedback-error-text` | `#7f1d1d` | `docs\todo\TODO.md` | 383 |
| `--feedback-success-bg` | `var(--color-Success)` | `docs\todo\TODO.md` | 379 |
| `--feedback-success-border` | `#10b981` | `audit-BEFORE.md` | 2488 |
| `--feedback-success-border` | `#10b981` | `docs\todo\TODO.md` | 381 |
| `--feedback-success-text` | `#065f46` | `audit-BEFORE.md` | 3008 |
| `--feedback-success-text` | `#065f46` | `docs\todo\TODO.md` | 380 |
| `--feedback-warning-bg` | `var(--color-Warning)` | `docs\todo\TODO.md` | 385 |
| `--feedback-warning-text` | `#92400e` | `audit-BEFORE.md` | 3018 |
| `--feedback-warning-text` | `#92400e` | `docs\todo\TODO.md` | 386 |
| `--focus-ring-color` | `CanvasText` | `src\styles\a11y\contrast.css` | 19 |
| `--focus-ring-width` | `3px` | `src\styles\a11y\contrast.css` | 20 |
| `--focusRing` | `#00ffff` | `audit-BEFORE.md` | 1797 |
| `--focusRing` | `var(--color-Info-500)` | `docs\Markdown Notes\accessibility-color-themes.md` | 35 |
| `--focusRing` | `oklch(0.76 0.10 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 123 |
| `--focusRing` | `oklch(0.62 0.10 200)` | `docs\Markdown Notes\accessibility-color-themes.md` | 198 |
| `--focusRing` | `#00ffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 248 |
| `--focusRing` | `var(--brand-c-neutral)` | `docs\Markdown Notes\accessibility-color-themes.md` | 276 |
| `--focusRing` | `var(--brand-c-neutral)` | `docs\Markdown Notes\accessibility-color-themes.md` | 298 |
| `--focusRing` | `var(--brand-c-neutral)` | `docs\Markdown Notes\accessibility-color-themes.md` | 320 |
| `--focusRing` | `oklch(0.92 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 343 |
| `--font-secondary` | `'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | `src\styles\tokens\typography.css` | 14 |
| `--form-bg` | `var(--color-White)` | `audit-BEFORE.md` | 410 |
| `--form-bg` | `var(--color-White)` | `docs\todo\TODO.md` | 389 |
| `--form-border` | `var(--brand-c-neutral)` | `docs\todo\TODO.md` | 390 |
| `--form-border-error` | `var(--color-Error)` | `docs\todo\TODO.md` | 393 |
| `--form-border-focus` | `var(--brand-c-primary)` | `docs\todo\TODO.md` | 392 |
| `--form-border-hover` | `var(--brand-c-neutral)` | `docs\todo\TODO.md` | 391 |
| `--form-border-success` | `var(--color-Success)` | `docs\todo\TODO.md` | 394 |
| `--form-invalid-bg` | `color-mix(in oklch, var(--feedback-error-bg) 5%, transparent)` | `docs\todo\TODO.md` | 395 |
| `--form-valid-bg` | `color-mix(in oklch, var(--feedback-success-bg) 5%, transparent)` | `docs\todo\TODO.md` | 396 |
| `--glass-bg` | `rgba(255, 255, 255, 0.1)` | `audit-BEFORE.md` | 1760 |
| `--glass-bg` | `rgba(255, 255, 255, 0.1)` | `src\styles\tokens\shadows.css` | 80 |
| `--glass-border` | `rgba(255, 255, 255, 0.2)` | `audit-BEFORE.md` | 2449 |
| `--glass-border` | `rgba(255, 255, 255, 0.2)` | `src\styles\tokens\shadows.css` | 81 |
| `--glass-card-bg` | `color-mix(in oklch, var(--brand-c-bg) 15%, transparent)` | `src\styles\tokens\shadows.css` | 96 |
| `--glass-card-bg` | `color-mix(in oklch, var(--brand-c-bg-dark) 25%, transparent)` | `src\styles\tokens\shadows.css` | 107 |
| `--glass-card-border` | `color-mix(in oklch, var(--brand-c-bg) 18%, transparent)` | `src\styles\tokens\shadows.css` | 99 |
| `--glass-card-border` | `color-mix(in oklch, var(--brand-c-bg) 10%, transparent)` | `src\styles\tokens\shadows.css` | 108 |
| `--glass-card-shadow` | `0 8px 24px 0 color-mix(in oklch, var(--brand-c-primary-dark) 30%, transparent)` | `src\styles\tokens\shadows.css` | 98 |
| `--glass-overlay-bg` | `color-mix(in oklch, var(--brand-c-bg) 5%, transparent)` | `src\styles\tokens\shadows.css` | 91 |
| `--glass-overlay-bg` | `color-mix(in oklch, var(--brand-c-bg-dark) 10%, transparent)` | `src\styles\tokens\shadows.css` | 106 |
| `--glass-overlay-blur` | `8px` | `src\styles\tokens\shadows.css` | 92 |
| `--glass-overlay-shadow` | `0 4px 16px 0 color-mix(in oklch, var(--brand-c-primary-dark) 20%, transparent)` | `src\styles\tokens\shadows.css` | 93 |
| `--glass-shadow` | `0 8px 32px 0 rgba(31, 38, 135, 0.37)` | `audit-BEFORE.md` | 3868 |
| `--glass-shadow` | `0 8px 32px 0 rgba(31, 38, 135, 0.37)` | `src\styles\tokens\shadows.css` | 82 |
| `--glass-surface-bg` | `color-mix(in oklch, var(--brand-c-bg) 10%, transparent)` | `src\styles\tokens\shadows.css` | 86 |
| `--glass-surface-bg` | `color-mix(in oklch, var(--brand-c-bg-dark) 20%, transparent)` | `src\styles\tokens\shadows.css` | 105 |
| `--glass-surface-blur` | `12px` | `src\styles\tokens\shadows.css` | 87 |
| `--glass-surface-shadow` | `0 8px 32px 0 color-mix(in oklch, var(--brand-c-primary-dark) 37%, transparent)` | `src\styles\tokens\shadows.css` | 88 |
| `--glint-gradient` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)` | `audit-BEFORE.md` | 2447 |
| `--glint-gradient` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)` | `src\styles\tokens\shadows.css` | 73 |
| `--glint-gradient-strong` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)` | `audit-BEFORE.md` | 2635 |
| `--glint-gradient-strong` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)` | `src\styles\tokens\shadows.css` | 74 |
| `--glint-gradient-subtle` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)` | `audit-BEFORE.md` | 1758 |
| `--glint-gradient-subtle` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)` | `src\styles\tokens\shadows.css` | 75 |
| `--gradient-accent-border` | `linear-gradient(90deg, var(--brand-c-primary-dark) 0%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 226 |
| `--gradient-accent1` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 99 |
| `--gradient-accent1-glow` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 30%, var(--brand-c-neutral-dark) 60%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 103 |
| `--gradient-accent1-intense` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 102 |
| `--gradient-accent1-light` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 100%)` | `src\styles\tokens\gradients.css` | 101 |
| `--gradient-accent1-soft` | `linear-gradient(135deg, var(--brand-c-neutral) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 100 |
| `--gradient-accent2` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 106 |
| `--gradient-accent2-glow` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 30%, var(--brand-c-neutral-dark) 60%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 110 |
| `--gradient-accent2-intense` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 109 |
| `--gradient-accent2-light` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 100%)` | `src\styles\tokens\gradients.css` | 108 |
| `--gradient-accent2-soft` | `linear-gradient(135deg, var(--brand-c-neutral) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 107 |
| `--gradient-accent3` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 113 |
| `--gradient-accent3-glow` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 30%, var(--brand-c-neutral-dark) 60%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 117 |
| `--gradient-accent3-intense` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 116 |
| `--gradient-accent3-light` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 100%)` | `src\styles\tokens\gradients.css` | 115 |
| `--gradient-accent3-soft` | `linear-gradient(135deg, var(--brand-c-neutral) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 114 |
| `--gradient-accent4` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 120 |
| `--gradient-accent4-glow` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 30%, var(--brand-c-neutral-dark) 60%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 124 |
| `--gradient-accent4-intense` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 123 |
| `--gradient-accent4-light` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 100%)` | `src\styles\tokens\gradients.css` | 122 |
| `--gradient-accent4-soft` | `linear-gradient(135deg, var(--brand-c-neutral) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 121 |
| `--gradient-accent5` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 127 |
| `--gradient-accent5-glow` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 30%, var(--brand-c-neutral-dark) 60%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 131 |
| `--gradient-accent5-intense` | `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 130 |
| `--gradient-accent5-light` | `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 100%)` | `src\styles\tokens\gradients.css` | 129 |
| `--gradient-accent5-soft` | `linear-gradient(135deg, var(--brand-c-neutral) 0%, var(--brand-c-neutral-dark) 100%)` | `src\styles\tokens\gradients.css` | 128 |
| `--gradient-background-cool` | `linear-gradient(135deg, var(--brand-c-bg) 0%, var(--brand-c-neutral-light) 100%)` | `src\styles\tokens\gradients.css` | 178 |
| `--gradient-background-glow` | `linear-gradient(135deg, var(--brand-c-bg) 0%, var(--brand-c-bg-light) 30%, var(--brand-c-bg-light) 60%, var(--brand-c-neutral) 100%)` | `src\styles\tokens\gradients.css` | 183 |
| `--gradient-background-light` | `linear-gradient(135deg, var(--brand-c-bg) 0%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 175 |
| `--gradient-background-radial` | `radial-gradient(circle at center, var(--brand-c-bg) 0%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 186 |
| `--gradient-background-radial-complex` | `radial-gradient(ellipse at 40% 60%, var(--brand-c-bg) 0%, var(--brand-c-bg-light) 40%, var(--brand-c-neutral-light) 80%, var(--brand-c-neutral) 100%)` | `src\styles\tokens\gradients.css` | 188 |
| `--gradient-background-radial-soft` | `radial-gradient(circle at 30% 30%, var(--brand-c-bg) 0%, var(--brand-c-bg-light) 50%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 187 |
| `--gradient-background-rainbow` | `linear-gradient(135deg, var(--brand-c-bg) 0%, var(--brand-c-bg) 25%, var(--brand-c-bg-light) 50%, var(--brand-c-bg-light) 75%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 181 |
| `--gradient-background-soft` | `linear-gradient(135deg, var(--brand-c-bg) 0%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 176 |
| `--gradient-background-warm` | `linear-gradient(135deg, var(--brand-c-bg-light) 0%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 177 |
| `--gradient-background-wave` | `linear-gradient(90deg, var(--brand-c-bg) 0%, var(--brand-c-bg-light) 20%, var(--brand-c-bg-light) 40%, var(--brand-c-bg-light) 60%, var(--brand-c-bg-light) 80%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 182 |
| `--gradient-brand-burst` | `radial-gradient(ellipse at 30% 30%, var(--brand-c-primary-light) 0%, var(--brand-c-secondary) 30%, var(--brand-c-bg-light) 60%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 156 |
| `--gradient-brand-emerge` | `linear-gradient(135deg, var(--brand-c-bg) 0%, var(--brand-c-primary) 50%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 146 |
| `--gradient-brand-fade` | `linear-gradient(135deg, var(--brand-c-primary-dark) 0%, var(--brand-c-secondary) 50%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 147 |
| `--gradient-brand-radial` | `radial-gradient(circle at center, var(--brand-c-bg) 0%, var(--brand-c-primary) 40%, var(--brand-c-secondary-dark) 80%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 155 |
| `--gradient-btn-ghost-hover` | `linear-gradient(135deg, color-mix(in oklch, var(--brand-c-text) 10%, transparent) 0%, color-mix(in oklch, var(--brand-c-text) 20%, transparent) 100%)` | `src\styles\tokens\gradients.css` | 201 |
| `--gradient-btn-primary` | `var(--gradient-primary)` | `src\styles\tokens\gradients.css` | 194 |
| `--gradient-btn-primary-hover` | `linear-gradient(135deg, var(--brand-c-primary) 0%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 195 |
| `--gradient-btn-secondary` | `var(--gradient-secondary)` | `src\styles\tokens\gradients.css` | 197 |
| `--gradient-btn-secondary-hover` | `linear-gradient(135deg, var(--brand-c-secondary) 0%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 198 |
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
| `--gradient-error` | `linear-gradient(135deg, var(--color-Danger) 0%, color-mix(in oklch, var(--color-Danger) 70%, black) 10`` | `audit-BEFORE.md` | 1012 |
| `--gradient-error` | `linear-gradient(135deg, var(--color-Danger) 0%, color-mix(in oklch, var(--color-Danger) 70%, black) 100%)` | `src\styles\tokens\gradients.css` | 235 |
| `--gradient-header-subtle` | `linear-gradient(180deg, var(--brand-c-bg-light) 0%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 208 |
| `--gradient-light-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 379 |
| `--gradient-light-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 387 |
| `--gradient-light-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 395 |
| `--gradient-light-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 403 |
| `--gradient-light-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 411 |
| `--gradient-light-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 363 |
| `--gradient-light-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 371 |
| `--gradient-overlay-dark` | `linear-gradient(180deg, transparent 0%, color-mix(in oklch, var(--brand-c-bg-dark) 70%, transparent) 100%)` | `src\styles\tokens\gradients.css` | 223 |
| `--gradient-overlay-light` | `linear-gradient(180deg, color-mix(in oklch, var(--brand-c-bg) 90%, transparent) 0%, transparent 100%)` | `src\styles\tokens\gradients.css` | 224 |
| `--gradient-pastel-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 658 |
| `--gradient-pastel-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 668 |
| `--gradient-pastel-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 678 |
| `--gradient-pastel-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 688 |
| `--gradient-pastel-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 698 |
| `--gradient-pastel-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 637 |
| `--gradient-pastel-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 648 |
| `--gradient-primary` | `linear-gradient(135deg, var(--brand-c-primary-dark) 0%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 59 |
| `--gradient-primary-glow` | `linear-gradient(135deg, var(--brand-c-primary-light) 0%, var(--brand-c-primary) 30%, var(--brand-c-primary-dark) 60%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 67 |
| `--gradient-primary-intense` | `linear-gradient(135deg, var(--brand-c-primary-dark) 0%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 62 |
| `--gradient-primary-light` | `linear-gradient(135deg, var(--brand-c-primary-light) 0%, var(--brand-c-primary) 100%)` | `src\styles\tokens\gradients.css` | 61 |
| `--gradient-primary-radial` | `radial-gradient(circle at 30% 40%, var(--brand-c-primary) 0%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 70 |
| `--gradient-primary-radial-center` | `radial-gradient(circle at center, var(--brand-c-primary-light) 0%, var(--brand-c-primary-dark) 50%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 71 |
| `--gradient-primary-radial-complex` | `radial-gradient(ellipse at 20% 30%, var(--brand-c-primary-light) 0%, var(--brand-c-primary) 40%, var(--brand-c-primary-dark) 80%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 72 |
| `--gradient-primary-rainbow` | `linear-gradient(135deg, var(--brand-c-primary-light) 0%, var(--brand-c-primary) 25%, var(--brand-c-primary-dark) 50%, var(--brand-c-primary-dark) 75%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 65 |
| `--gradient-primary-soft` | `linear-gradient(135deg, var(--brand-c-primary) 0%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 60 |
| `--gradient-primary-wave` | `linear-gradient(90deg, var(--brand-c-primary) 0%, var(--brand-c-primary-dark) 20%, var(--brand-c-primary) 40%, var(--brand-c-primary-dark) 60%, var(--brand-c-primary-dark) 80%, var(--brand-c-primary-dark) 100%)` | `src\styles\tokens\gradients.css` | 66 |
| `--gradient-rainbow-accent1` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 282 |
| `--gradient-rainbow-accent2` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 295 |
| `--gradient-rainbow-accent3` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 308 |
| `--gradient-rainbow-accent4` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 321 |
| `--gradient-rainbow-accent5` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 334 |
| `--gradient-rainbow-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 256 |
| `--gradient-rainbow-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 269 |
| `--gradient-secondary` | `linear-gradient(135deg, var(--brand-c-secondary-dark) 0%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 79 |
| `--gradient-secondary-glow` | `linear-gradient(135deg, var(--brand-c-secondary-light) 0%, var(--brand-c-secondary) 30%, var(--brand-c-secondary-dark) 60%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 87 |
| `--gradient-secondary-intense` | `linear-gradient(135deg, var(--brand-c-secondary-dark) 0%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 82 |
| `--gradient-secondary-light` | `linear-gradient(135deg, var(--brand-c-secondary-light) 0%, var(--brand-c-secondary) 100%)` | `src\styles\tokens\gradients.css` | 81 |
| `--gradient-secondary-radial` | `radial-gradient(circle at 70% 30%, var(--brand-c-secondary) 0%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 90 |
| `--gradient-secondary-radial-center` | `radial-gradient(circle at center, var(--brand-c-secondary-light) 0%, var(--brand-c-secondary) 50%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 91 |
| `--gradient-secondary-radial-complex` | `radial-gradient(ellipse at 80% 20%, var(--brand-c-secondary-light) 0%, var(--brand-c-secondary) 40%, var(--brand-c-secondary-dark) 80%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 92 |
| `--gradient-secondary-rainbow` | `linear-gradient(135deg, var(--brand-c-secondary-light) 0%, var(--brand-c-secondary) 25%, var(--brand-c-secondary) 50%, var(--brand-c-secondary-dark) 75%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 85 |
| `--gradient-secondary-soft` | `linear-gradient(135deg, var(--brand-c-secondary) 0%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 80 |
| `--gradient-secondary-wave` | `linear-gradient(90deg, var(--brand-c-secondary-light) 0%, var(--brand-c-secondary) 20%, var(--brand-c-secondary) 40%, var(--brand-c-secondary-dark) 60%, var(--brand-c-secondary) 80%, var(--brand-c-secondary-dark) 100%)` | `src\styles\tokens\gradients.css` | 86 |
| `--gradient-soft-brand` | `linear-gradient(180deg, var(--brand-c-bg) 0%, var(--brand-c-primary-light) 30%, var(--brand-c-secondary) 70%, var(--brand-c-bg-light) 100%)` | `src\styles\tokens\gradients.css` | 148 |
| `--gradient-subtle` | `linear-gradient(180deg, var(--brand-c-bg-light) 0%, var(--brand-c-bg) 100%)` | `src\styles\tokens\gradients.css` | 168 |
| `--gradient-success` | `linear-gradient(135deg, var(--color-Success) 0%, color-mix(in oklch, var(--color-Success) 70%, black`` | `audit-BEFORE.md` | 1008 |
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
| `--gradient-warning` | `linear-gradient(135deg, var(--color-Warning) 0%, color-mix(in oklch, var(--color-Warning) 70%, black`` | `audit-BEFORE.md` | 1010 |
| `--gradient-warning` | `linear-gradient(135deg, var(--color-Warning) 0%, color-mix(in oklch, var(--color-Warning) 70%, black) 100%)` | `src\styles\tokens\gradients.css` | 234 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `files\example-a11y-cream-NEW.css` | 45 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `files\example-BrandDefault-NEW.css` | 45 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-cream.css` | 24 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 31 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 24 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 29 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-monochrome.css` | 24 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-protanopia.css` | 24 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 24 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `src\styles\themes\brand\BrandDefault.css` | 45 |
| `--img-border-color` | `var(--brand-c-neutral-light)` | `src\styles\tokens\images.css` | 11 |
| `--img-border-style` | `solid` | `src\styles\tokens\images.css` | 10 |
| `--img-border-width` | `0` | `src\styles\tokens\images.css` | 9 |
| `--img-hover-filter` | `brightness(1.05)` | `src\styles\tokens\images.css` | 37 |
| `--img-hover-scale` | `1.02` | `src\styles\tokens\images.css` | 35 |
| `--img-hover-shadow` | `var(--img-shadow-lg)` | `src\styles\tokens\images.css` | 36 |
| `--img-shadow` | `none` | `src\styles\tokens\images.css` | 20 |
| `--img-shadow-lg` | `0 8px 16px color-mix(in oklch, var(--brand-c-bg-dark) 20%, transparent)` | `src\styles\tokens\images.css` | 23 |
| `--img-shadow-md` | `0 4px 8px color-mix(in oklch, var(--brand-c-bg-dark) 15%, transparent)` | `src\styles\tokens\images.css` | 22 |
| `--img-shadow-sm` | `0 2px 4px color-mix(in oklch, var(--brand-c-bg-dark) 10%, transparent)` | `src\styles\tokens\images.css` | 21 |
| `--interactive-disabled-bg` | `var(--brand-c-neutral-light)` | `docs\todo\TODO.md` | 375 |
| `--interactive-disabled-text` | `var(--brand-c-text-light)` | `docs\todo\TODO.md` | 376 |
| `--interactive-primary` | `var(--brand-c-primary)` | `docs\todo\TODO.md` | 372 |
| `--interactive-primary-active` | `var(--brand-c-primary-dark)` | `docs\todo\TODO.md` | 374 |
| `--interactive-primary-hover` | `var(--brand-c-primary-dark)` | `docs\todo\TODO.md` | 373 |
| `--link` | `#ffff00` | `audit-BEFORE.md` | 2058 |
| `--link` | `var(--brand-c-secondary)` | `docs\Markdown Notes\accessibility-color-themes.md` | 30 |
| `--link` | `oklch(0.74 0.12 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 121 |
| `--link` | `oklch(0.42 0.10 45)` | `docs\Markdown Notes\accessibility-color-themes.md` | 196 |
| `--link` | `#ffff00` | `docs\Markdown Notes\accessibility-color-themes.md` | 246 |
| `--link` | `var(--brand-c-neutral)` | `docs\Markdown Notes\accessibility-color-themes.md` | 275 |
| `--link` | `var(--brand-c-neutral)` | `docs\Markdown Notes\accessibility-color-themes.md` | 297 |
| `--link` | `var(--brand-c-neutral)` | `docs\Markdown Notes\accessibility-color-themes.md` | 319 |
| `--link` | `oklch(0.80 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 341 |
| `--link` | `hover          /* 38 chars - OK */` | `docs\reports\css-class-names-recommendations.md` | 237 |
| `--link` | `hover {` | `src\styles\components\announcement-ticker.css` | 88 |
| `--link` | `hover {` | `src\styles\components\announcement-ticker.css` | 121 |
| `--linkHover` | `#ffffff` | `audit-BEFORE.md` | 863 |
| `--linkHover` | `var(--brand-c-secondary)` | `docs\Markdown Notes\accessibility-color-themes.md` | 31 |
| `--linkHover` | `oklch(0.80 0.10 270)` | `docs\Markdown Notes\accessibility-color-themes.md` | 122 |
| `--linkHover` | `oklch(0.34 0.10 45)` | `docs\Markdown Notes\accessibility-color-themes.md` | 197 |
| `--linkHover` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 247 |
| `--linkHover` | `oklch(0.92 0 0)` | `docs\Markdown Notes\accessibility-color-themes.md` | 342 |
| `--linkVisited` | `color-mix(in oklch, var(--link) 60%, var(--text) 40%)` | `docs\Markdown Notes\accessibility-color-themes.md` | 32 |
| `--overlay-opacity` | `${overlayOpacity` | `src\components\Presentation\Sections\TitleSection.astro` | 30 |
| `--overlay-opacity` | `${overlayOpacity` | `src\components\Sections\HeroSection.astro` | 73 |
| `--page-bg` | `var(--brand-c-bg)` | `files\example-a11y-cream-NEW.css` | 44 |
| `--page-bg` | `var(--brand-c-bg)` | `files\example-BrandDefault-NEW.css` | 44 |
| `--page-bg` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-cream.css` | 23 |
| `--page-bg` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-dark.css` | 30 |
| `--page-bg` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-deuteranopia.css` | 23 |
| `--page-bg` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-high-contrast.css` | 28 |
| `--page-bg` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-monochrome.css` | 23 |
| `--page-bg` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-protanopia.css` | 23 |
| `--page-bg` | `var(--brand-c-bg)` | `src\styles\themes\a11y\a11y-tritanopia.css` | 23 |
| `--page-bg` | `var(--brand-c-bg)` | `src\styles\themes\brand\BrandDefault.css` | 44 |
| `--pause-hover` | `hover {` | `src\styles\components\announcement-ticker.css` | 117 |
| `--primary` | `hover {` | `src\components\Presentation\Sections\TitleSection.astro` | 254 |
| `--primary` | `hover .title-section__btn-icon {` | `src\components\Presentation\Sections\TitleSection.astro` | 276 |
| `--print-background` | `var(--color-White)``` | `audit-BEFORE.md` | 418 |
| `--print-background` | `var(--color-White)`` | `docs\todo\TODO.md` | 488 |
| `--print-muted` | `var(--brand-c-neutral)`` | `docs\todo\TODO.md` | 489 |
| `--print-text` | `var(--color-Black)``` | `audit-BEFORE.md` | 988 |
| `--print-text` | `var(--color-Black)`` | `docs\todo\TODO.md` | 487 |
| `--rainbow-border-animation` | `glowloop 8s linear infinite` | `src\styles\tokens\gradients.css` | 44 |
| `--rainbow-border-hover-opacity` | `0.4` | `src\styles\tokens\gradients.css` | 45 |
| `--rainbow-halo-hover-opacity` | `0.83` | `src\styles\tokens\gradients.css` | 46 |
| `--rainbow-hover-accent` | `rgba(128, 225, 204, 0.15)` | `audit-BEFORE.md` | 3858 |
| `--rainbow-hover-accent` | `rgba(128, 225, 204, 0.15)` | `src\styles\tokens\gradients.css` | 51 |
| `--rainbow-hover-cream` | `rgba(255, 248, 237, 0.8)` | `audit-BEFORE.md` | 3863 |
| `--rainbow-hover-cream` | `rgba(255, 248, 237, 0.8)` | `src\styles\tokens\gradients.css` | 52 |
| `--rainbow-hover-primary` | `rgba(255, 153, 200, 0.15)` | `audit-BEFORE.md` | 3848 |
| `--rainbow-hover-primary` | `rgba(255, 153, 200, 0.15)` | `src\styles\tokens\gradients.css` | 49 |
| `--rainbow-hover-secondary` | `rgba(174, 136, 191, 0.15)` | `audit-BEFORE.md` | 3853 |
| `--rainbow-hover-secondary` | `rgba(174, 136, 191, 0.15)` | `src\styles\tokens\gradients.css` | 50 |
| `--rainbow-light-gradient-accent` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 35 |
| `--rainbow-light-gradient-primary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 17 |
| `--rainbow-light-gradient-secondary` | `linear-gradient(` | `src\styles\tokens\gradients.css` | 27 |
| `--secondary` | `hover {` | `src\components\Presentation\Sections\TitleSection.astro` | 150 |
| `--secondary` | `hover {` | `src\components\Presentation\Sections\TitleSection.astro` | 265 |
| `--section-title-color` | `${textColor` | `src\components\Typography\SectionTitle.astro` | 112 |
| `--selectionBg` | `color-mix(in oklch, var(--focusRing) 25%, transparent)` | `docs\Markdown Notes\accessibility-color-themes.md` | 44 |
| `--selectionText` | `var(--text)` | `docs\Markdown Notes\accessibility-color-themes.md` | 45 |
| `--shadow` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 44 |
| `--shadow` | `0 1px 3px 0 color-mix(in oklch, var(--brand-c-bg-dark) 10%, transparent), 0 1px 2px 0 color-mix(in oklch, var(--brand-c-bg-dark) 6%, transparent)` | `src\styles\tokens\shadows.css` | 10 |
| `--shadow-2xl` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 49 |
| `--shadow-2xl` | `0 25px 50px -12px color-mix(in oklch, var(--brand-c-bg-dark) 25%, transparent)` | `src\styles\tokens\shadows.css` | 15 |
| `--shadow-base` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 45 |
| `--shadow-base` | `var(--shadow)` | `src\styles\tokens\shadows.css` | 11 |
| `--shadow-btn` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 50 |
| `--shadow-btn` | `0 4px 8px color-mix(in oklch, var(--brand-c-bg-dark) 15%, transparent), 0 2px 4px color-mix(in oklch, var(--brand-c-bg-dark) 10%, transparent)` | `src\styles\tokens\shadows.css` | 65 |
| `--shadow-btn-hover` | `0 0 12px color-mix(in oklch, var(--brand-c-primary) 40%, transparent)` | `src\styles\themes\a11y\a11y-dark.css` | 51 |
| `--shadow-btn-hover` | `0 6px 12px color-mix(in oklch, var(--brand-c-primary) 30%, transparent), 0 3px 6px color-mix(in oklch, var(--brand-c-bg-dark) 10%, transparent)` | `src\styles\tokens\shadows.css` | 66 |
| `--shadow-dropdown` | `4px 4px 6px color-mix(in oklch, var(--brand-c-bg-dark) 20%, transparent), 4px 4px 6px color-mix(in oklch, var(--brand-c-bg) 70%, transparent), inset 4px 4px 6px color-mix(in oklch, var(--brand-c-bg-dark) 40%, transparent), inset 4px 4px 6px color-mix(in oklch, var(--brand-c-bg) 20%, transparent)` | `src\styles\tokens\shadows.css` | 58 |
| `--shadow-dropdown-lg` | `0 8px 16px color-mix(in oklch, var(--brand-c-bg-dark) 12%, transparent), 0 4px 8px color-mix(in oklch, var(--brand-c-bg-dark) 10%, transparent)` | `src\styles\tokens\shadows.css` | 61 |
| `--shadow-dropdown-md` | `0 4px 8px color-mix(in oklch, var(--brand-c-bg-dark) 10%, transparent), 0 2px 4px color-mix(in oklch, var(--brand-c-bg-dark) 8%, transparent)` | `src\styles\tokens\shadows.css` | 60 |
| `--shadow-dropdown-sm` | `0 2px 4px color-mix(in oklch, var(--brand-c-bg-dark) 8%, transparent), 0 1px 2px color-mix(in oklch, var(--brand-c-bg-dark) 6%, transparent)` | `src\styles\tokens\shadows.css` | 59 |
| `--shadow-dropdown-soft` | `4px 4px 6px color-mix(in oklch, var(--brand-c-bg-dark) 20%, transparent), -4px -4px 6px color-mix(in oklch, var(--brand-c-bg) 60%, transparent), inset 2px 2px 4px color-mix(in oklch, var(--brand-c-bg-dark) 15%, transparent), inset -2px -2px 4px color-mix(in oklch, var(--brand-c-bg) 30%, transparent)` | `src\styles\tokens\shadows.css` | 62 |
| `--shadow-glow-primary` | `0 0 14px color-mix(in oklch, var(--brand-c-primary) 50%, transparent)` | `src\styles\themes\a11y\a11y-dark.css` | 52 |
| `--shadow-glow-primary` | `0 0 12px color-mix(in oklch, var(--brand-c-primary) 60%, transparent)` | `src\styles\tokens\shadows.css` | 69 |
| `--shadow-glow-secondary` | `0 0 14px color-mix(in oklch, var(--brand-c-secondary) 50%, transparent)` | `src\styles\themes\a11y\a11y-dark.css` | 53 |
| `--shadow-glow-secondary` | `0 0 12px color-mix(in oklch, var(--brand-c-secondary) 60%, transparent)` | `src\styles\tokens\shadows.css` | 70 |
| `--shadow-inner-2xl` | `inset 0 0 40px 16px` | `src\styles\tokens\shadows.css` | 31 |
| `--shadow-inner-lg` | `inset 0 0 20px 8px` | `src\styles\tokens\shadows.css` | 25 |
| `--shadow-inner-md` | `inset 0 0 10px 4px` | `src\styles\tokens\shadows.css` | 22 |
| `--shadow-inner-sm` | `inset 0 0 6px 2px` | `src\styles\tokens\shadows.css` | 19 |
| `--shadow-inner-xl` | `inset 0 0 30px 12px` | `src\styles\tokens\shadows.css` | 28 |
| `--shadow-lg` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 47 |
| `--shadow-lg` | `0 10px 15px -3px color-mix(in oklch, var(--brand-c-bg-dark) 10%, transparent), 0 4px 6px -2px color-mix(in oklch, var(--brand-c-bg-dark) 5%, transparent)` | `src\styles\tokens\shadows.css` | 13 |
| `--shadow-md` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 46 |
| `--shadow-md` | `0 4px 6px -1px color-mix(in oklch, var(--brand-c-bg-dark) 10%, transparent), 0 2px 4px -1px color-mix(in oklch, var(--brand-c-bg-dark) 6%, transparent)` | `src\styles\tokens\shadows.css` | 12 |
| `--shadow-sm` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 43 |
| `--shadow-sm` | `0 1px 2px 0 color-mix(in oklch, var(--brand-c-bg-dark) 5%, transparent)` | `src\styles\tokens\shadows.css` | 9 |
| `--shadow-xl` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 48 |
| `--shadow-xl` | `0 20px 25px -5px color-mix(in oklch, var(--brand-c-bg-dark) 10%, transparent), 0 10px 10px -5px color-mix(in oklch, var(--brand-c-bg-dark) 4%, transparent)` | `src\styles\tokens\shadows.css` | 14 |
| `--shadow-xs` | `none` | `src\styles\themes\a11y\a11y-dark.css` | 42 |
| `--shadow-xs` | `0 1px 2px 0 color-mix(in oklch, var(--brand-c-bg-dark) 5%, transparent)` | `src\styles\tokens\shadows.css` | 8 |
| `--slider-color` | `var(--brand-c-text-dark)` | `src\styles\components\presentation\ReaderNav.css` | 407 |
| `--slider-color` | `var(--brand-c-text-light)` | `src\styles\components\presentation\ReaderNav.css` | 459 |
| `--slider-color` | `var(--brand-c-text-dark)` | `src\styles\components\presentation\ReaderNav.css` | 463 |
| `--state-disabled-opacity` | `0.5` | `docs\todo\TODO.md` | 402 |
| `--state-focus-ring` | `var(--color-Info-500)` | `docs\todo\TODO.md` | 400 |
| `--state-focus-ring-width` | `3px` | `docs\todo\TODO.md` | 401 |
| `--state-hover-bg` | `color-mix(in oklch, var(--interactive-primary) 5%, transparent)` | `docs\todo\TODO.md` | 399 |
| `--success` | `var(--color-Success)` | `docs\Markdown Notes\accessibility-color-themes.md` | 38 |
| `--surface` | `#000000` | `audit-BEFORE.md` | 1185 |
| `--surface` | `var(--brand-c-bg)` | `docs\Markdown Notes\accessibility-color-themes.md` | 21 |
| `--surface` | `#000000` | `docs\Markdown Notes\accessibility-color-themes.md` | 243 |
| `--surface-base` | `var(--brand-c-bg)` | `docs\todo\TODO.md` | 352 |
| `--surface-elevated` | `var(--brand-c-bg-light)` | `docs\todo\TODO.md` | 354 |
| `--surface-overlay` | `var(--brand-c-neutral-light)` | `docs\todo\TODO.md` | 355 |
| `--surface-raised` | `var(--brand-c-bg)` | `docs\todo\TODO.md` | 353 |
| `--surface2` | `var(--brand-c-bg-light)` | `docs\Markdown Notes\accessibility-color-themes.md` | 22 |
| `--surface3` | `var(--brand-c-bg-light)` | `docs\Markdown Notes\accessibility-color-themes.md` | 23 |
| `--svg-drop-shadow` | `drop-shadow(0 1px 2px color-mix(in oklch, var(--brand-c-bg-dark) 20%, transparent))` | `src\styles\tokens\images.css` | 71 |
| `--svg-drop-shadow-md` | `drop-shadow(0 2px 4px color-mix(in oklch, var(--brand-c-bg-dark) 25%, transparent))` | `src\styles\tokens\images.css` | 72 |
| `--svg-fill` | `currentColor` | `src\styles\tokens\images.css` | 60 |
| `--svg-hover-filter` | `brightness(1.1)` | `src\styles\tokens\images.css` | 76 |
| `--svg-hover-scale` | `1.1` | `src\styles\tokens\images.css` | 75 |
| `--svg-stroke` | `currentColor` | `src\styles\tokens\images.css` | 61 |
| `--svg-stroke-width` | `1.5` | `src\styles\tokens\images.css` | 62 |
| `--text` | `#ffffff` | `audit-BEFORE.md` | 859 |
| `--text` | `var(--brand-c-text-dark)` | `docs\Markdown Notes\accessibility-color-themes.md` | 26 |
| `--text` | `var(--brand-c-text-light)` | `docs\Markdown Notes\accessibility-color-themes.md` | 120 |
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
| `--text-disabled` | `var(--brand-c-text-light)` | `docs\todo\TODO.md` | 361 |
| `--text-inverse` | `var(--color-White)` | `audit-BEFORE.md` | 408 |
| `--text-inverse` | `var(--color-White)` | `docs\todo\TODO.md` | 362 |
| `--text-lg` | `1.125rem` | `src\styles\tokens\typography.css` | 21 |
| `--text-primary` | `var(--brand-c-text-dark)` | `docs\todo\TODO.md` | 358 |
| `--text-secondary` | `var(--brand-c-text)` | `docs\todo\TODO.md` | 359 |
| `--text-sm` | `0.875rem` | `src\styles\tokens\typography.css` | 19 |
| `--text-tertiary` | `var(--brand-c-text-light)` | `docs\todo\TODO.md` | 360 |
| `--text-xl` | `1.25rem` | `src\styles\tokens\typography.css` | 22 |
| `--text-xs` | `0.75rem` | `src\styles\tokens\typography.css` | 18 |
| `--textMuted` | `#ffffff` | `audit-BEFORE.md` | 861 |
| `--textMuted` | `var(--brand-c-text)` | `docs\Markdown Notes\accessibility-color-themes.md` | 27 |
| `--textMuted` | `#ffffff` | `docs\Markdown Notes\accessibility-color-themes.md` | 245 |
| `--universal-danger` | `#9c5151` | `audit-BEFORE.md` | 2184 |
| `--universal-danger` | `#9c5151` | `audit-BEFORE.md` | 3083 |
| `--universal-danger` | `#9c5151` | `src\scripts\ThemeTokenGen\brand-template.css` | 89 |
| `--universal-info` | `#47638f` | `audit-BEFORE.md` | 2195 |
| `--universal-info` | `#47638f` | `audit-BEFORE.md` | 3088 |
| `--universal-info` | `#47638f` | `src\scripts\ThemeTokenGen\brand-template.css` | 90 |
| `--universal-success` | `#80a575` | `audit-BEFORE.md` | 2173 |
| `--universal-success` | `#80a575` | `audit-BEFORE.md` | 3073 |
| `--universal-success` | `#80a575` | `src\scripts\ThemeTokenGen\brand-template.css` | 87 |
| `--universal-warning` | `#cea96a` | `audit-BEFORE.md` | 1735 |
| `--universal-warning` | `#cea96a` | `audit-BEFORE.md` | 3078 |
| `--universal-warning` | `#cea96a` | `src\scripts\ThemeTokenGen\brand-template.css` | 88 |
| `--warning` | `var(--color-Warning)` | `docs\Markdown Notes\accessibility-color-themes.md` | 39 |

---

## 🔄 Duplicate Token Values (Same Colour, Different Token Names)

These tokens resolve to the same colour value and may be candidates
for consolidation into base tokens (ally pattern).

| Colour Value | Tokens Using This Value |
|-------------|------------------------|
| `#000000` | `--a11y-hc-c-bg`, `--a11y-high-contrast-c-bg`, `--bg`, `--brand-c-bg`, `--brand-c-bg-dark`, `--brand-c-bg-light`, `--brand-c-neutral-light`, `--btn-filled-text`, `--surface` |
| `#00ff00` | `--a11y-hc-c-primary`, `--a11y-high-contrast-c-primary`, `--brand-c-neutral`, `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light`, `--color-Success` |
| `#00ffff` | `--a11y-hc-c-accent`, `--a11y-high-contrast-c-accent`, `--brand-c-neutral`, `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light`, `--color-Info`, `--focusRing` |
| `#06b6d4` | `--a11y-trit-c-accent`, `--a11y-tritanopia-c-accent`, `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light` |
| `#0e3f2e` | `--brand-background-dark`, `--brand-text` |
| `#0f172a` | `--a11y-protanopia-c-text`, `--a11y-proto-c-text`, `--brand-c-bg-dark`, `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light` |
| `#121212` | `--a11y-dark-c-bg`, `--brand-c-bg`, `--brand-c-bg-dark`, `--brand-c-bg-light`, `--brand-c-neutral-light`, `--color-Black` |
| `#1c1b29` | `--a11y-deuter-c-text`, `--a11y-deuteranopia-c-text`, `--brand-c-bg-dark`, `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light` |
| `#1e293b` | `--a11y-trit-c-text`, `--a11y-tritanopia-c-text`, `--brand-c-bg-dark`, `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light` |
| `#1e40af` | `--a11y-protanopia-c-primary`, `--a11y-proto-c-primary`, `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light` |
| `#262626` | `--brand-c-text`, `--brand-c-text-dark` |
| `#272596` | `--a11y-dark-c-accent`, `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light` |
| `#333333` | `--a11y-mono-c-text`, `--a11y-monochrome-c-text`, `--brand-c-bg-dark`, `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light` |
| `#373737` | `--brand-c-text`, `--brand-c-text-dark` |
| `#394e43` | `--brand-background-dark`, `--brand-c-bg-dark` |
| `#3e4a5a` | `--brand-accent4`, `--brand-c-neutral` |
| `#4a3f2f` | `--a11y-cream-c-text`, `--brand-c-bg-dark`, `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light` |
| `#555555` | `--a11y-mono-c-primary`, `--a11y-monochrome-c-primary`, `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light` |
| `#5a5a5a` | `--brand-c-text`, `--brand-text` |
| `#6b8e7a` | `--a11y-cream-c-accent`, `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light` |
| `#6d28d9` | `--a11y-deuter-c-primary`, `--a11y-deuteranopia-c-primary`, `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light` |
| `#777777` | `--a11y-mono-c-accent`, `--a11y-monochrome-c-accent`, `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light`, `--brand-c-text`, `--brand-c-text-light` |
| `#8390b5` | `--brand-accent2`, `--brand-c-neutral` |
| `#8b7355` | `--a11y-cream-c-primary`, `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light` |
| `#8fa68a` | `--brand-c-primary`, `--brand-primary` |
| `#978692` | `--brand-accent3`, `--brand-c-neutral` |
| `#9c8579` | `--brand-accent1`, `--brand-c-neutral` |
| `#a28aad` | `--brand-accent5`, `--brand-c-neutral` |
| `#c4907c` | `--brand-c-secondary`, `--brand-secondary` |
| `#c5e1a5` | `--a11y-dark-c-primary`, `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light` |
| `#cc3399` | `--a11y-trit-c-primary`, `--a11y-tritanopia-c-primary`, `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light` |
| `#ccd3da` | `--a11y-dark-c-text`, `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light` |
| `#ddd9d3` | `--a11y-cream-c-bg`, `--brand-c-bg`, `--brand-c-bg-light`, `--brand-c-neutral-light` |
| `#e6e4e2` | `--a11y-mono-c-bg`, `--a11y-monochrome-c-bg`, `--brand-c-bg`, `--brand-c-bg-light`, `--brand-c-neutral-light` |
| `#f59e0b` | `--a11y-protanopia-c-accent`, `--a11y-proto-c-accent`, `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light` |
| `#f5f7fb` | `--a11y-protanopia-c-bg`, `--a11y-proto-c-bg`, `--brand-c-bg`, `--brand-c-bg-light`, `--brand-c-neutral-light` |
| `#f6f5fa` | `--a11y-deuter-c-bg`, `--a11y-deuteranopia-c-bg`, `--brand-c-bg`, `--brand-c-bg-light`, `--brand-c-neutral-light` |
| `#f97316` | `--a11y-deuter-c-accent`, `--a11y-deuteranopia-c-accent`, `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light` |
| `#faf8f7` | `--brand-c-bg`, `--brand-c-neutral-light` |
| `#fdf4ff` | `--a11y-trit-c-bg`, `--a11y-tritanopia-c-bg`, `--brand-c-bg`, `--brand-c-bg-light`, `--brand-c-neutral-light` |
| `#ff0000` | `--color-Danger`, `--color-Error` |
| `#ffff00` | `--brand-c-neutral`, `--brand-c-secondary`, `--color-Warning`, `--link` |
| `#ffffff` | `--a11y-hc-c-text`, `--a11y-high-contrast-c-text`, `--brand-c-bg-light`, `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-primary`, `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light`, `--color-White`, `--linkHover`, `--text`, `--textMuted` |
| `${textcolor` | `--btn-text-color`, `--section-title-color` |
| `0 1px 2px 0 color-mix(in oklch, var(--brand-c-bg-dark) 5%, transparent)` | `--shadow-sm`, `--shadow-xs` |
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
| `color-mix(in oklch, var(--brand-c-bg) 10%, transparent)` | `--glass-card-border`, `--glass-surface-bg` |
| `currentcolor` | `--svg-fill`, `--svg-stroke` |
| `hover {` | `--link`, `--pause-hover`, `--primary`, `--secondary` |
| `linear-gradient(` | `--gradient-deep-accent1`, `--gradient-deep-accent2`, `--gradient-deep-accent3`, `--gradient-deep-accent4`, `--gradient-deep-accent5`, `--gradient-deep-primary`, `--gradient-deep-secondary`, `--gradient-light-accent1`, `--gradient-light-accent2`, `--gradient-light-accent3`, `--gradient-light-accent4`, `--gradient-light-accent5`, `--gradient-light-primary`, `--gradient-light-secondary`, `--gradient-pastel-accent1`, `--gradient-pastel-accent2`, `--gradient-pastel-accent3`, `--gradient-pastel-accent4`, `--gradient-pastel-accent5`, `--gradient-pastel-primary`, `--gradient-pastel-secondary`, `--gradient-rainbow-accent1`, `--gradient-rainbow-accent2`, `--gradient-rainbow-accent3`, `--gradient-rainbow-accent4`, `--gradient-rainbow-accent5`, `--gradient-rainbow-primary`, `--gradient-rainbow-secondary`, `--gradient-vivid-accent1`, `--gradient-vivid-accent2`, `--gradient-vivid-accent3`, `--gradient-vivid-accent4`, `--gradient-vivid-accent5`, `--gradient-vivid-primary`, `--gradient-vivid-secondary`, `--rainbow-light-gradient-accent`, `--rainbow-light-gradient-primary`, `--rainbow-light-gradient-secondary` |
| `linear-gradient(135deg, var(--brand-c-bg) 0%, var(--brand-c-bg-light) 100%)` | `--gradient-background-light`, `--gradient-background-soft` |
| `linear-gradient(135deg, var(--brand-c-neutral) 0%, var(--brand-c-neutral-dark) 100%)` | `--gradient-accent1-soft`, `--gradient-accent2-soft`, `--gradient-accent3-soft`, `--gradient-accent4-soft`, `--gradient-accent5-soft` |
| `linear-gradient(135deg, var(--brand-c-neutral-dark) 0%, var(--brand-c-neutral-dark) 100%)` | `--gradient-accent1`, `--gradient-accent1-intense`, `--gradient-accent2`, `--gradient-accent2-intense`, `--gradient-accent3`, `--gradient-accent3-intense`, `--gradient-accent4`, `--gradient-accent4-intense`, `--gradient-accent5`, `--gradient-accent5-intense` |
| `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 100%)` | `--gradient-accent1-light`, `--gradient-accent2-light`, `--gradient-accent3-light`, `--gradient-accent4-light`, `--gradient-accent5-light` |
| `linear-gradient(135deg, var(--brand-c-neutral-light) 0%, var(--brand-c-neutral) 30%, var(--brand-c-neutral-dark) 60%, var(--brand-c-neutral-dark) 100%)` | `--gradient-accent1-glow`, `--gradient-accent2-glow`, `--gradient-accent3-glow`, `--gradient-accent4-glow`, `--gradient-accent5-glow` |
| `linear-gradient(135deg, var(--brand-c-primary) 0%, var(--brand-c-primary-dark) 100%)` | `--gradient-btn-primary-hover`, `--gradient-primary-soft` |
| `linear-gradient(135deg, var(--brand-c-primary-dark) 0%, var(--brand-c-primary-dark) 100%)` | `--gradient-primary`, `--gradient-primary-intense` |
| `linear-gradient(135deg, var(--brand-c-secondary) 0%, var(--brand-c-secondary-dark) 100%)` | `--gradient-btn-secondary-hover`, `--gradient-secondary-soft` |
| `linear-gradient(135deg, var(--brand-c-secondary-dark) 0%, var(--brand-c-secondary-dark) 100%)` | `--gradient-secondary`, `--gradient-secondary-intense` |
| `none` | `--img-shadow`, `--shadow`, `--shadow-2xl`, `--shadow-base`, `--shadow-btn`, `--shadow-lg`, `--shadow-md`, `--shadow-sm`, `--shadow-xl`, `--shadow-xs` |
| `oklch(0.60 0.18 25)` | `--brand-c-neutral`, `--color-Error` |
| `oklch(0.62 0.10 25)` | `--brand-c-neutral`, `--color-Error` |
| `oklch(0.62 0.10 300)` | `--brand-c-neutral`, `--color-Info` |
| `oklch(0.62 0.14 255)` | `--brand-c-neutral`, `--color-Success` |
| `oklch(0.62 0.16 350)` | `--brand-c-neutral`, `--color-Info` |
| `oklch(0.66 0.14 145)` | `--brand-c-neutral`, `--color-Success` |
| `oklch(0.72 0.16 55)` | `--brand-c-neutral`, `--color-Warning` |
| `oklch(0.74 0.14 80)` | `--brand-c-neutral`, `--color-Warning` |
| `oklch(0.92 0 0)` | `--focusRing`, `--linkHover` |

---

## 🎯 Base Colour Candidates (Ally Pattern)

Based on usage frequency, these are your most important colour values.
These would form your base colour set (like ally's four + black/white).

| Colour Value | Total References | Potential Base Token |
|-------------|-----------------|---------------------|
| `#ffffff` | 729 | candidate-1 |
| `white` | 484 | candidate-2 |
| `#556a50` | 371 | candidate-3 |
| `#393531` | 270 | candidate-4 |
| `#e0dedb` | 258 | candidate-5 |
| `#c2bdb8` | 243 | candidate-6 |
| `0.75rem` | 243 | candidate-7 |
| `#777777` | 216 | candidate-8 |
| `0.875rem` | 208 | candidate-9 |
| `1rem` | 141 | candidate-10 |
| `#cee6c8` | 132 | candidate-11 |
| `#333333` | 110 | candidate-12 |
| `#855543` | 110 | candidate-13 |
| `#262626` | 99 | candidate-14 |
| `#000000` | 98 | candidate-15 |
| `#394e43` | 98 | candidate-16 |
| `1.125rem` | 98 | candidate-17 |
| `#121212` | 89 | candidate-18 |
| `black` | 89 | candidate-19 |
| `#4a3f2f` | 78 | candidate-20 |

---

## ✅ Recommendations

1. **Tokenise 3657 hardcoded colour values** across 106 files. Start with the most frequently used values and the worst-offending files listed above.

2. **Remove 302 unused token definitions** to reduce dead code and confusion about which tokens are active.

3. **Move 28 inline colour styles** to CSS classes using tokens for consistency and maintainability.

4. **Consolidate 78 duplicate colour values** into shared base tokens following the ally pattern.

5. **Consider reducing to a base colour set** of 10-ish values that all component tokens map back to, matching your ally architecture.
