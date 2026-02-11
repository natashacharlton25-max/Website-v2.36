#!/usr/bin/env python3
"""
Token Migration Script
======================
Replaces all old --color-Scale-NNN tokens with new --brand-c-* tokens.

New token system: 21 tokens total
  - 5 colour groups x 3 levels (light/default/dark) = 15 brand tokens
  - 6 universal (Black, White, Success, Warning, Error, Info)

Groups: primary, secondary, neutral, bg, text
All accents collapse into neutral.

Usage:
    python migrate_tokens.py /path/to/your/astro-project

Git revert if anything goes wrong.
"""

import os
import re
import sys
from pathlib import Path

# ── Config ───────────────────────────────────────────────────────────────────

SCAN_EXTENSIONS = {
    '.astro', '.css', '.scss', '.less', '.sass',
    '.js', '.jsx', '.ts', '.tsx',
    '.html', '.htm', '.md', '.mdx',
    '.svelte', '.vue', '.json',
}

SKIP_DIRS = {
    'node_modules', '.git', 'dist', '.output', '.astro',
    '__pycache__', '.vscode', '.idea', 'build', '.cache',
    '.netlify', '.vercel',
}

SKIP_FILES = {
    'BrandDefault.css',
    'a11y-cream.css',
    'a11y-dark.css',
    'a11y-high-contrast.css',
    'a11y-monochrome.css',
    'a11y-protanopia.css',
    'a11y-deuteranopia.css',
    'a11y-tritanopia.css',
    'status.css',
    'brand-template.css',
    'color-input.css',
    'color-theory-explorer.css',
    'simple-theme-gen.js',
    'generate-core-tokens.js',
    'color-theory-comparison.js',
    'preview-colors.js',
    'migrate_tokens.py',
    'colour_audit.py',
}

# ── Token map ────────────────────────────────────────────────────────────────

TOKEN_MAP = [
    # Primary
    ('--color-Primary-50',  '--brand-c-primary-light'),
    ('--color-Primary-100', '--brand-c-primary-light'),
    ('--color-Primary-200', '--brand-c-primary-light'),
    ('--color-Primary-300', '--brand-c-primary-light'),
    ('--color-Primary-400', '--brand-c-primary'),
    ('--color-Primary-500', '--brand-c-primary'),
    ('--color-Primary-600', '--brand-c-primary-dark'),
    ('--color-Primary-700', '--brand-c-primary-dark'),
    ('--color-Primary-800', '--brand-c-primary-dark'),
    ('--color-Primary-900', '--brand-c-primary-dark'),

    # Secondary
    ('--color-Secondary-100', '--brand-c-secondary-light'),
    ('--color-Secondary-200', '--brand-c-secondary-light'),
    ('--color-Secondary-300', '--brand-c-secondary-light'),
    ('--color-Secondary-400', '--brand-c-secondary'),
    ('--color-Secondary-500', '--brand-c-secondary'),
    ('--color-Secondary-600', '--brand-c-secondary-dark'),
    ('--color-Secondary-700', '--brand-c-secondary-dark'),
    ('--color-Secondary-800', '--brand-c-secondary-dark'),
    ('--color-Secondary-900', '--brand-c-secondary-dark'),

    # Background
    ('--color-Background-50',  '--brand-c-bg'),
    ('--color-Background-100', '--brand-c-bg'),
    ('--color-Background-200', '--brand-c-bg-light'),
    ('--color-Background-300', '--brand-c-bg-light'),
    ('--color-Background-400', '--brand-c-bg-light'),
    ('--color-Background-500', '--brand-c-bg-light'),
    ('--color-Background-900', '--brand-c-bg-dark'),

    # Background Dark
    ('--color-BackgroundDark-600', '--brand-c-bg-dark'),
    ('--color-BackgroundDark-700', '--brand-c-bg-dark'),
    ('--color-BackgroundDark-800', '--brand-c-bg-dark'),
    ('--color-BackgroundDark-900', '--brand-c-bg-dark'),
    ('--color-BackgroundDark-950', '--brand-c-bg-dark'),

    # Text
    ('--color-Text-50',  '--brand-c-text-light'),
    ('--color-Text-100', '--brand-c-text-light'),
    ('--color-Text-200', '--brand-c-text-light'),
    ('--color-Text-300', '--brand-c-text-light'),
    ('--color-Text-400', '--brand-c-text-light'),
    ('--color-Text-500', '--brand-c-text-light'),
    ('--color-Text-600', '--brand-c-text'),
    ('--color-Text-700', '--brand-c-text'),
    ('--color-Text-800', '--brand-c-text'),
    ('--color-Text-900', '--brand-c-text-dark'),
    ('--color-Text-950', '--brand-c-text-dark'),

    # Neutral
    ('--color-Neutral-50',  '--brand-c-neutral-light'),
    ('--color-Neutral-100', '--brand-c-neutral-light'),
    ('--color-Neutral-200', '--brand-c-neutral-light'),
    ('--color-Neutral-300', '--brand-c-neutral'),
    ('--color-Neutral-400', '--brand-c-neutral'),
    ('--color-Neutral-500', '--brand-c-neutral'),
    ('--color-Neutral-600', '--brand-c-neutral-dark'),
    ('--color-Neutral-700', '--brand-c-neutral-dark'),
    ('--color-Neutral-800', '--brand-c-neutral-dark'),
    ('--color-Neutral-900', '--brand-c-neutral-dark'),

    # All Accents → Neutral
    ('--color-AccentOne-100', '--brand-c-neutral-light'),
    ('--color-AccentOne-200', '--brand-c-neutral-light'),
    ('--color-AccentOne-300', '--brand-c-neutral-light'),
    ('--color-AccentOne-400', '--brand-c-neutral'),
    ('--color-AccentOne-500', '--brand-c-neutral'),
    ('--color-AccentOne-600', '--brand-c-neutral-dark'),
    ('--color-AccentOne-700', '--brand-c-neutral-dark'),
    ('--color-AccentOne-800', '--brand-c-neutral-dark'),

    ('--color-AccentTwo-100', '--brand-c-neutral-light'),
    ('--color-AccentTwo-200', '--brand-c-neutral-light'),
    ('--color-AccentTwo-300', '--brand-c-neutral-light'),
    ('--color-AccentTwo-400', '--brand-c-neutral'),
    ('--color-AccentTwo-500', '--brand-c-neutral'),
    ('--color-AccentTwo-600', '--brand-c-neutral-dark'),
    ('--color-AccentTwo-700', '--brand-c-neutral-dark'),
    ('--color-AccentTwo-800', '--brand-c-neutral-dark'),

    ('--color-AccentThree-100', '--brand-c-neutral-light'),
    ('--color-AccentThree-200', '--brand-c-neutral-light'),
    ('--color-AccentThree-300', '--brand-c-neutral-light'),
    ('--color-AccentThree-400', '--brand-c-neutral'),
    ('--color-AccentThree-500', '--brand-c-neutral'),
    ('--color-AccentThree-600', '--brand-c-neutral-dark'),
    ('--color-AccentThree-700', '--brand-c-neutral-dark'),
    ('--color-AccentThree-800', '--brand-c-neutral-dark'),

    ('--color-AccentFour-100', '--brand-c-neutral-light'),
    ('--color-AccentFour-200', '--brand-c-neutral-light'),
    ('--color-AccentFour-300', '--brand-c-neutral-light'),
    ('--color-AccentFour-400', '--brand-c-neutral'),
    ('--color-AccentFour-500', '--brand-c-neutral'),
    ('--color-AccentFour-600', '--brand-c-neutral-dark'),
    ('--color-AccentFour-700', '--brand-c-neutral-dark'),
    ('--color-AccentFour-800', '--brand-c-neutral-dark'),

    ('--color-AccentFive-100', '--brand-c-neutral-light'),
    ('--color-AccentFive-200', '--brand-c-neutral-light'),
    ('--color-AccentFive-300', '--brand-c-neutral-light'),
    ('--color-AccentFive-400', '--brand-c-neutral'),
    ('--color-AccentFive-500', '--brand-c-neutral'),
    ('--color-AccentFive-600', '--brand-c-neutral-dark'),
    ('--color-AccentFive-700', '--brand-c-neutral-dark'),
    ('--color-AccentFive-800', '--brand-c-neutral-dark'),

    # Old brand-c-accent alias
    ('--brand-c-accent', '--brand-c-secondary'),
]

# Sort longest first to avoid partial matches
TOKEN_MAP.sort(key=lambda x: len(x[0]), reverse=True)

# ── Hardcoded colour patterns ────────────────────────────────────────────────

HARDCODED_PATTERNS = [
    (re.compile(r'(?<=:\s)#ffffff(?=\s*[;,)}])', re.I), 'var(--color-White)'),
    (re.compile(r'(?<=:\s)#fff(?=\s*[;,)}])'),          'var(--color-White)'),
    (re.compile(r'(?<=:\s)white(?=\s*[;,)}])'),          'var(--color-White)'),
    (re.compile(r'(?<=:\s)#000000(?=\s*[;,)}])', re.I), 'var(--color-Black)'),
    (re.compile(r'(?<=:\s)#000(?=\s*[;,)}])'),          'var(--color-Black)'),
    (re.compile(r'(?<=:\s)black(?=\s*[;,)}])'),          'var(--color-Black)'),
    (re.compile(r'#8fa68a', re.I),                       'var(--brand-c-primary)'),
    (re.compile(r'#c4907c', re.I),                       'var(--brand-c-secondary)'),
    (re.compile(r'(?<=:\s)#333333(?=\s*[;,)}])'),        'var(--brand-c-text)'),
    (re.compile(r'(?<=:\s)#474747(?=\s*[;,)}])'),        'var(--brand-c-text)'),
    (re.compile(r'#8b9d83', re.I),                       'var(--brand-c-primary-dark)'),
    (re.compile(r'(?<=:\s)#faf8f7(?=\s*[;,)}])', re.I), 'var(--brand-c-bg)'),
]

CSS_EXTENSIONS = {'.css', '.scss', '.less', '.astro', '.html', '.htm', '.svelte', '.vue'}


def migrate_file(filepath, project_root):
    """Process one file. Returns (rel_path, token_swaps, hardcoded_fixes)."""
    rel_path = os.path.relpath(filepath, project_root)

    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            original = f.read()
    except (IOError, OSError):
        return rel_path, 0, 0

    content = original
    token_swaps = 0
    hardcoded_fixes = 0

    # Token replacements
    for old, new in TOKEN_MAP:
        count = content.count(old)
        if count > 0:
            content = content.replace(old, new)
            token_swaps += count

    # Hardcoded replacements (CSS-like files only)
    if Path(filepath).suffix.lower() in CSS_EXTENSIONS:
        for pattern, replacement in HARDCODED_PATTERNS:
            matches = pattern.findall(content)
            if matches:
                content = pattern.sub(replacement, content)
                hardcoded_fixes += len(matches)

    # Write if changed
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

    return rel_path, token_swaps, hardcoded_fixes


def main():
    if len(sys.argv) < 2:
        print('Usage: python migrate_tokens.py /path/to/project')
        sys.exit(1)

    project_root = os.path.abspath(sys.argv[1])
    if not os.path.isdir(project_root):
        print(f'Error: {project_root} is not a directory')
        sys.exit(1)

    print(f'Migrating: {project_root}')
    print(f'Target: 15 brand tokens + 6 universal = 21 total\n')

    total_files = 0
    changed_files = 0
    total_tokens = 0
    total_hardcoded = 0
    skipped = []
    changed = []

    for root, dirs, files in os.walk(project_root):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]

        for filename in files:
            filepath = os.path.join(root, filename)
            if not Path(filepath).suffix.lower() in SCAN_EXTENSIONS:
                continue

            total_files += 1

            if filename in SKIP_FILES:
                skipped.append(os.path.relpath(filepath, project_root))
                continue

            rel_path, tc, hc = migrate_file(filepath, project_root)
            if tc > 0 or hc > 0:
                changed_files += 1
                total_tokens += tc
                total_hardcoded += hc
                changed.append((rel_path, tc, hc))

    # Report
    print('=' * 60)
    print('DONE')
    print('=' * 60)
    print(f'Scanned:          {total_files}')
    print(f'Changed:          {changed_files}')
    print(f'Token swaps:      {total_tokens}')
    print(f'Hardcoded fixes:  {total_hardcoded}')
    print()

    if skipped:
        print(f'Skipped ({len(skipped)} theme/generator files):')
        for f in skipped:
            print(f'  - {f}')
        print()

    if changed:
        changed.sort(key=lambda x: x[1] + x[2], reverse=True)
        print('Changed files:')
        for rel_path, tc, hc in changed:
            parts = []
            if tc: parts.append(f'{tc} tokens')
            if hc: parts.append(f'{hc} hardcoded')
            print(f'  {rel_path}  ({", ".join(parts)})')
        print()

    print('Next steps:')
    print('  1. Replace theme files (BrandDefault + ally) with new format')
    print('  2. Update simple-theme-gen.js output')
    print('  3. Test')
    print('  4. If broken: git checkout .')


if __name__ == '__main__':
    main()
