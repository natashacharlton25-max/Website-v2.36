#!/usr/bin/env python3
"""
Batch 1: Hardcoded Hex → Token Vars
=====================================
Replaces hardcoded hex colours with CSS token references.

Targets:
  #ffffff / #fff  → var(--color-White)
  #000000         → var(--color-Black)
  #333333 / #333  → var(--brand-c-text)
  #666666 / #666  → var(--brand-c-neutral-dark)
  #1a1a1a         → var(--color-Black)
  #111111         → var(--color-Black)
  #8fa68a         → var(--brand-c-primary)
  #474747         → var(--brand-c-text)
  #c4907c         → var(--brand-c-secondary)
  #8b9d83         → var(--brand-c-primary)  [CSS files only; hero-morph.ts in batch 3]
  white (keyword) → var(--color-White)  [in color-mix and direct usage]
  black (keyword) → var(--color-Black)  [in color-mix]

Excludes:
  - emailit.ts, contact.ts (email templates need literal values)
  - print.css (print needs literal values)
  - Token definition files (where hex IS the definition)
  - Comments
  - hero-morph.ts (handled in batch 3 via JS constant)

DRY RUN by default. Add --apply to write.
Usage: python fix_batch1_hex_tokens.py <src_dir> [--apply]
"""

import os
import re
import sys
from pathlib import Path

# ─── Configuration ───────────────────────────────────────────────────────────

SCAN_EXTENSIONS = {'.css', '.astro', '.scss', '.jsx', '.tsx', '.html'}

EXCLUDE_FILES = {
    'emailit.ts', 'contact.ts',   # Email templates - need literal hex
    'print.css',                    # Print styles - need literal values
    'hero-morph.ts',                # Handled in batch 3 via JS constant
    'particle-burst.ts',            # JS animation - handled in batch 3
    'coretokens.css',               # Preview system - intentional
    'theme-cards.css',              # Preview system - intentional
}

EXCLUDE_DIRS = {
    'node_modules', '.git', 'dist', '.astro', 'Preview',
    'ThemeTokenGen',
}

# Theme definition files - hex IS the source of truth here
THEME_DEF_DIRS = {
    os.path.join('styles', 'themes', 'brand'),
    os.path.join('styles', 'themes', 'a11y'),
}

# ─── Hex Replacements ────────────────────────────────────────────────────────
# Order matters: longer patterns first to avoid partial matches

HEX_REPLACEMENTS = [
    # 6-digit hex
    (re.compile(r'#ffffff', re.IGNORECASE), 'var(--color-White)'),
    (re.compile(r'#000000', re.IGNORECASE), 'var(--color-Black)'),
    (re.compile(r'#333333'), 'var(--brand-c-text)'),
    (re.compile(r'#666666'), 'var(--brand-c-neutral-dark)'),
    (re.compile(r'#1a1a1a'), 'var(--color-Black)'),
    (re.compile(r'#111111'), 'var(--color-Black)'),
    (re.compile(r'#8fa68a', re.IGNORECASE), 'var(--brand-c-primary)'),
    (re.compile(r'#474747'), 'var(--brand-c-text)'),
    (re.compile(r'#c4907c', re.IGNORECASE), 'var(--brand-c-secondary)'),
    (re.compile(r'#8b9d83', re.IGNORECASE), 'var(--brand-c-primary)'),
    # 3-digit hex (must come after 6-digit to avoid false matches)
    (re.compile(r'#fff(?![0-9a-fA-F])'), 'var(--color-White)'),
    (re.compile(r'#333(?![0-9a-fA-F])'), 'var(--brand-c-text)'),
    (re.compile(r'#666(?![0-9a-fA-F])'), 'var(--brand-c-neutral-dark)'),
    (re.compile(r'#555(?![0-9a-fA-F])'), 'var(--brand-c-neutral-dark)'),
]

# ─── Named Colour Replacements ───────────────────────────────────────────────
# Only in CSS property contexts, not inside var() or token names

NAMED_REPLACEMENTS = [
    # white keyword in color-mix: color-mix(in oklch, white 80%, ...)
    (re.compile(r'\bwhite\b(?![-\w])'), 'var(--color-White)'),
    # black keyword in color-mix: color-mix(in oklch, black 10%, ...)
    (re.compile(r'\bblack\b(?![-\w])'), 'var(--color-Black)'),
]


def is_excluded(filepath, rel_path):
    """Check if file should be excluded"""
    filename = os.path.basename(filepath)
    if filename in EXCLUDE_FILES:
        return True

    # Check excluded dirs
    parts = Path(rel_path).parts
    for part in parts:
        if part in EXCLUDE_DIRS:
            return True

    return False


def is_theme_definition(rel_path):
    """Check if file is a theme definition (hex values are source of truth)"""
    for theme_dir in THEME_DEF_DIRS:
        if rel_path.startswith(theme_dir):
            return True
    return False


def is_token_definition_line(line):
    """Check if line defines a CSS custom property (token)"""
    stripped = line.strip()
    # Matches: --token-name: #value;
    return bool(re.match(r'\s*--[\w-]+\s*:', stripped))


def is_comment_line(line):
    """Check if line is a comment"""
    stripped = line.strip()
    return (stripped.startswith('//') or stripped.startswith('/*') or
            stripped.startswith('*') or stripped.startswith('<!--'))


def is_inside_var(line, match_start):
    """Check if match position is inside a var() call"""
    before = line[:match_start]
    # Count unmatched var( before this position
    return bool(re.search(r'var\([^)]*$', before))


def is_inside_token_name(line, match_start):
    """Check if match is part of a --token-name"""
    before = line[:match_start]
    return bool(re.search(r'--[\w-]*$', before))


def fix_line(line, line_num, rel_path, is_theme_def):
    """Apply fixes to a single line, returns (fixed_line, list_of_changes)"""
    changes = []

    # Skip comments
    if is_comment_line(line):
        return line, changes

    # Skip token definitions (the hex IS the value)
    if is_token_definition_line(line):
        return line, changes

    # Skip theme definition files entirely
    if is_theme_def:
        return line, changes

    fixed = line

    # Apply hex replacements
    for pattern, replacement in HEX_REPLACEMENTS:
        new_fixed = fixed
        offset = 0
        for match in pattern.finditer(fixed):
            pos = match.start()
            # Skip if inside var() or token name
            if is_inside_var(fixed, pos) or is_inside_token_name(fixed, pos):
                continue
            # Skip if inside a JS string that's building a token reference
            # (e.g., already has var(-- nearby)
            before = fixed[:pos]
            if 'var(--' in before[max(0, pos-30):pos]:
                continue

            old_val = match.group(0)
            new_fixed = fixed[:pos] + replacement + fixed[pos + len(old_val):]
            changes.append((line_num, old_val, replacement))
            # After first replacement, re-run from scratch to handle offset changes
            fixed = new_fixed
            break  # Re-scan after each replacement to handle offset shifts

    # Re-run until no more hex replacements found
    more = True
    while more:
        more = False
        for pattern, replacement in HEX_REPLACEMENTS:
            for match in pattern.finditer(fixed):
                pos = match.start()
                if is_inside_var(fixed, pos) or is_inside_token_name(fixed, pos):
                    continue
                old_val = match.group(0)
                fixed = fixed[:pos] + replacement + fixed[pos + len(old_val):]
                changes.append((line_num, old_val, replacement))
                more = True
                break
            if more:
                break

    # Apply named colour replacements (white/black keywords)
    # Only in CSS contexts, not in JS strings or comments
    ext = Path(rel_path).suffix.lower()
    if ext in {'.css', '.scss'}:
        for pattern, replacement in NAMED_REPLACEMENTS:
            new_fixed = fixed
            for match in pattern.finditer(fixed):
                pos = match.start()
                if is_inside_var(fixed, pos) or is_inside_token_name(fixed, pos):
                    continue
                old_val = match.group(0)
                new_fixed = fixed[:pos] + replacement + fixed[pos + len(old_val):]
                changes.append((line_num, old_val, replacement))
                fixed = new_fixed
                break

    return fixed, changes


def process_file(filepath, project_root, apply=False):
    """Process a single file, returns list of changes"""
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
        print("Usage: python fix_batch1_hex_tokens.py <src_dir> [--apply]")
        sys.exit(1)

    root = sys.argv[1]
    apply = '--apply' in sys.argv

    if not os.path.isdir(root):
        print(f"Error: {root} is not a directory")
        sys.exit(1)

    print(f"\n{'APPLYING' if apply else 'DRY RUN'} — Batch 1: Hex → Tokens\n")

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

    # Report
    if all_changes:
        print(f"{'Applied' if apply else 'Would fix'}: {len(all_changes)} replacements in {file_count} files\n")

        # Group by file
        by_file = {}
        for (fpath, line_num, old, new) in all_changes:
            by_file.setdefault(fpath, []).append((line_num, old, new))

        for fpath, changes in sorted(by_file.items()):
            print(f"  {fpath} ({len(changes)} fixes)")
            for line_num, old, new in changes[:5]:
                print(f"    L{line_num}: {old} → {new}")
            if len(changes) > 5:
                print(f"    ... and {len(changes) - 5} more")
            print()

        # Summary by replacement
        print("  Summary:")
        by_replacement = {}
        for (_, _, old, new) in all_changes:
            key = f"{old} → {new}"
            by_replacement[key] = by_replacement.get(key, 0) + 1
        for key, count in sorted(by_replacement.items(), key=lambda x: -x[1]):
            print(f"    {key}: {count}")

    else:
        print("  No replacements needed.")

    if not apply and all_changes:
        print(f"\nRun with --apply to write changes:")
        print(f"  python fix_batch1_hex_tokens.py {root} --apply")


if __name__ == '__main__':
    main()
