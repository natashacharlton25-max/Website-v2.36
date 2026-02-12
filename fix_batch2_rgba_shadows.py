#!/usr/bin/env python3
"""
Batch 2: RGBA Shadows → color-mix with Tokens
================================================
Replaces hardcoded rgba() colours with color-mix() using tokens.
Preserves shadow geometry, just tokenises the colour.

Targets:
  rgba(0, 0, 0, 0.15)    → color-mix(in oklch, var(--color-Black) 15%, transparent)
  rgba(0,0,0,0.1)         → color-mix(in oklch, var(--color-Black) 10%, transparent)
  rgba(255, 255, 255, 0.15) → color-mix(in oklch, var(--color-White) 15%, transparent)
  ...and all other rgba(0,0,0,X) / rgba(255,255,255,X) patterns

Excludes:
  - emailit.ts, contact.ts (email templates)
  - Token definition files (shadows.css etc - already use tokens)
  - Theme definition files

DRY RUN by default. Add --apply to write.
Usage: python fix_batch2_rgba_shadows.py <src_dir> [--apply]
"""

import os
import re
import sys
from pathlib import Path

# ─── Configuration ───────────────────────────────────────────────────────────

SCAN_EXTENSIONS = {'.css', '.astro', '.scss', '.jsx', '.tsx', '.html'}

EXCLUDE_FILES = {
    'emailit.ts', 'contact.ts',   # Email templates
    'shadows.css',                  # Already tokenised
    'print.css',                    # Print needs literal
    'coretokens.css',
    'theme-cards.css',
}

EXCLUDE_DIRS = {
    'node_modules', '.git', 'dist', '.astro', 'Preview',
    'ThemeTokenGen',
}

THEME_DEF_DIRS = {
    os.path.join('styles', 'themes', 'brand'),
    os.path.join('styles', 'themes', 'a11y'),
}

# ─── RGBA Patterns ────────────────────────────────────────────────────────────

# Match rgba(0, 0, 0, X) with any spacing — black with alpha
RE_RGBA_BLACK = re.compile(
    r'rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*(0?\.\d+)\s*\)'
)

# Match rgba(255, 255, 255, X) with any spacing — white with alpha
RE_RGBA_WHITE = re.compile(
    r'rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*(0?\.\d+)\s*\)'
)

# Match rgba with brand primary colour (143,166,138 = #8fa68a)
RE_RGBA_PRIMARY = re.compile(
    r'rgba\(\s*143\s*,\s*166\s*,\s*138\s*,\s*(0?\.\d+)\s*\)'
)

# Match rgba with brand secondary colour (196,144,124 = #c4907c)
RE_RGBA_SECONDARY = re.compile(
    r'rgba\(\s*196\s*,\s*144\s*,\s*124\s*,\s*(0?\.\d+)\s*\)'
)


def alpha_to_percent(alpha_str):
    """Convert 0.15 → 15%, 0.08 → 8%, etc."""
    val = float(alpha_str)
    percent = int(round(val * 100))
    return f"{percent}%"


def is_excluded(filepath, rel_path):
    filename = os.path.basename(filepath)
    if filename in EXCLUDE_FILES:
        return True
    parts = Path(rel_path).parts
    for part in parts:
        if part in EXCLUDE_DIRS:
            return True
    return False


def is_theme_definition(rel_path):
    for theme_dir in THEME_DEF_DIRS:
        if rel_path.startswith(theme_dir):
            return True
    return False


def is_token_definition_line(line):
    stripped = line.strip()
    return bool(re.match(r'\s*--[\w-]+\s*:', stripped))


def is_comment_line(line):
    stripped = line.strip()
    return (stripped.startswith('//') or stripped.startswith('/*') or
            stripped.startswith('*') or stripped.startswith('<!--'))


def fix_line(line, line_num, rel_path, is_theme_def):
    changes = []

    if is_comment_line(line) or is_token_definition_line(line) or is_theme_def:
        return line, changes

    fixed = line

    # Replace rgba(0,0,0,X) → color-mix(in oklch, var(--color-Black) X%, transparent)
    def replace_black(match):
        alpha = match.group(1)
        pct = alpha_to_percent(alpha)
        replacement = f'color-mix(in oklch, var(--color-Black) {pct}, transparent)'
        changes.append((line_num, match.group(0), replacement))
        return replacement

    fixed = RE_RGBA_BLACK.sub(replace_black, fixed)

    # Replace rgba(255,255,255,X) → color-mix(in oklch, var(--color-White) X%, transparent)
    def replace_white(match):
        alpha = match.group(1)
        pct = alpha_to_percent(alpha)
        replacement = f'color-mix(in oklch, var(--color-White) {pct}, transparent)'
        changes.append((line_num, match.group(0), replacement))
        return replacement

    fixed = RE_RGBA_WHITE.sub(replace_white, fixed)

    # Replace rgba(143,166,138,X) → color-mix(in oklch, var(--brand-c-primary) X%, transparent)
    def replace_primary(match):
        alpha = match.group(1)
        pct = alpha_to_percent(alpha)
        replacement = f'color-mix(in oklch, var(--brand-c-primary) {pct}, transparent)'
        changes.append((line_num, match.group(0), replacement))
        return replacement

    fixed = RE_RGBA_PRIMARY.sub(replace_primary, fixed)

    # Replace rgba(196,144,124,X) → color-mix(in oklch, var(--brand-c-secondary) X%, transparent)
    def replace_secondary(match):
        alpha = match.group(1)
        pct = alpha_to_percent(alpha)
        replacement = f'color-mix(in oklch, var(--brand-c-secondary) {pct}, transparent)'
        changes.append((line_num, match.group(0), replacement))
        return replacement

    fixed = RE_RGBA_SECONDARY.sub(replace_secondary, fixed)

    return fixed, changes


def process_file(filepath, project_root, apply=False):
    rel_path = os.path.relpath(filepath, project_root)

    if is_excluded(filepath, rel_path):
        return []

    ext = Path(filepath).suffix.lower()
    if ext not in SCAN_EXTENSIONS:
        return []

    is_theme_def = is_theme_definition(rel_path)

    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        lines = f.readlines()

    all_changes = []
    new_lines = []

    for i, line in enumerate(lines):
        fixed_line, changes = fix_line(line, i + 1, rel_path, is_theme_def)
        new_lines.append(fixed_line)
        for change in changes:
            all_changes.append((rel_path, *change))

    if apply and all_changes:
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            f.writelines(new_lines)

    return all_changes


def main():
    if len(sys.argv) < 2:
        print("Usage: python fix_batch2_rgba_shadows.py <src_dir> [--apply]")
        sys.exit(1)

    root = sys.argv[1]
    apply = '--apply' in sys.argv

    if not os.path.isdir(root):
        print(f"Error: {root} is not a directory")
        sys.exit(1)

    print(f"\n{'APPLYING' if apply else 'DRY RUN'} — Batch 2: RGBA → color-mix Tokens\n")

    all_changes = []
    file_count = 0

    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for filename in files:
            filepath = os.path.join(dirpath, filename)
            changes = process_file(filepath, root, apply)
            if changes:
                all_changes.extend(changes)
                file_count += 1

    if all_changes:
        print(f"{'Applied' if apply else 'Would fix'}: {len(all_changes)} replacements in {file_count} files\n")

        by_file = {}
        for (fpath, line_num, old, new) in all_changes:
            by_file.setdefault(fpath, []).append((line_num, old, new))

        for fpath, changes in sorted(by_file.items()):
            print(f"  {fpath} ({len(changes)} fixes)")
            for line_num, old, new in changes[:3]:
                print(f"    L{line_num}: {old}")
                print(f"         → {new}")
            if len(changes) > 3:
                print(f"    ... and {len(changes) - 3} more")
            print()

        # Summary by alpha value
        print("  Summary by opacity:")
        by_alpha = {}
        for (_, _, old, _) in all_changes:
            by_alpha[old] = by_alpha.get(old, 0) + 1
        for key, count in sorted(by_alpha.items(), key=lambda x: -x[1]):
            print(f"    {key}: {count}")
    else:
        print("  No replacements needed.")

    if not apply and all_changes:
        print(f"\nRun with --apply to write changes:")
        print(f"  python fix_batch2_rgba_shadows.py {root} --apply")


if __name__ == '__main__':
    main()
