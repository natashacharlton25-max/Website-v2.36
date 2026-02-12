#!/usr/bin/env python3
"""
Batch 3: Misc Fixes — Hero-morph, Neumorphic, Remaining
=========================================================

1. hero-morph.ts: Replace hardcoded #8B9D83 with JS constant from CSS token
2. particle-burst.ts: Replace hardcoded 'white' with CSS token read
3. Neumorphic shadows: #bdbab3/#e6e2da pairs → token-based
4. RevealCanvas: #000000 → token read

DRY RUN by default. Add --apply to write.
Usage: python fix_batch3_misc.py <src_dir> [--apply]
"""

import os
import re
import sys
from pathlib import Path

EXCLUDE_DIRS = {'node_modules', '.git', 'dist', '.astro', 'Preview', 'ThemeTokenGen'}


def fix_hero_morph(filepath, apply=False):
    """
    Replace hardcoded '#8B9D83' with a JS constant that reads from CSS.
    Adds a constant at the top and replaces all occurrences.
    """
    if not os.path.exists(filepath):
        print(f"  ❌ NOT FOUND: {filepath}")
        return 0

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    changes = 0

    # Add constant after imports if not already there
    CONST_LINE = "const BRAND_PRIMARY = getComputedStyle(document.documentElement).getPropertyValue('--brand-c-primary').trim() || '#8B9D83';"

    if 'BRAND_PRIMARY' not in content:
        # Find the right insertion point — after last import or at top of file
        # Look for the last import statement or first function/const
        lines = content.split('\n')
        insert_idx = 0
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                insert_idx = i + 1
            elif line.strip().startswith('export') or line.strip().startswith('function') or line.strip().startswith('const '):
                if insert_idx == 0:
                    insert_idx = i
                break

        # Insert blank line + constant
        lines.insert(insert_idx, '')
        lines.insert(insert_idx + 1, CONST_LINE)
        lines.insert(insert_idx + 2, '')
        content = '\n'.join(lines)
        changes += 1
        print(f"    Added BRAND_PRIMARY constant at line {insert_idx + 1}")

    # Replace all '#8B9D83' and "#8B9D83" with BRAND_PRIMARY
    # In setAttribute contexts: .setAttribute('fill', '#8B9D83') → .setAttribute('fill', BRAND_PRIMARY)
    pattern_single = re.compile(r"'#8[Bb]9[Dd]83'")
    pattern_double = re.compile(r'"#8[Bb]9[Dd]83"')

    for pattern in [pattern_single, pattern_double]:
        count = len(pattern.findall(content))
        if count > 0:
            content = pattern.sub('BRAND_PRIMARY', content)
            changes += count
            print(f"    Replaced {count} occurrences of hardcoded #8B9D83")

    # Handle fill="#8B9D83" in template literals (inside backtick strings)
    # fill="#8B9D83" → fill="${BRAND_PRIMARY}"
    pattern_attr = re.compile(r'fill="#8[Bb]9[Dd]83"')
    count = len(pattern_attr.findall(content))
    if count > 0:
        content = pattern_attr.sub('fill="${BRAND_PRIMARY}"', content)
        changes += count
        print(f"    Replaced {count} fill attribute occurrences")

    if apply and changes > 0:
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            f.write(content)

    return changes


def fix_particle_burst(filepath, apply=False):
    """Replace hardcoded 'white' with CSS token read in particle-burst.ts"""
    if not os.path.exists(filepath):
        print(f"  ❌ NOT FOUND: {filepath}")
        return 0

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    changes = 0

    # Add constant if not there
    CONST_LINE = "const COLOR_WHITE = getComputedStyle(document.documentElement).getPropertyValue('--color-White').trim() || '#ffffff';"

    if 'COLOR_WHITE' not in content:
        lines = content.split('\n')
        insert_idx = 0
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                insert_idx = i + 1
            elif line.strip().startswith('export') or line.strip().startswith('function') or line.strip().startswith('const '):
                if insert_idx == 0:
                    insert_idx = i
                break

        lines.insert(insert_idx, '')
        lines.insert(insert_idx + 1, CONST_LINE)
        lines.insert(insert_idx + 2, '')
        content = '\n'.join(lines)
        changes += 1
        print(f"    Added COLOR_WHITE constant at line {insert_idx + 1}")

    # Replace '2px solid white' → `2px solid ${COLOR_WHITE}`
    # This is in a JS string context
    old_pattern = re.compile(r"'2px solid white'")
    count = len(old_pattern.findall(content))
    if count > 0:
        content = old_pattern.sub('`2px solid ${COLOR_WHITE}`', content)
        changes += count
        print(f"    Replaced {count} hardcoded 'white' references")

    # Also replace any other bare 'white' in style assignments
    old_pattern2 = re.compile(r"=\s*'white'")
    count = len(old_pattern2.findall(content))
    if count > 0:
        content = old_pattern2.sub("= COLOR_WHITE", content)
        changes += count
        print(f"    Replaced {count} bare 'white' style assignments")

    if apply and changes > 0:
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            f.write(content)

    return changes


def fix_neumorphic_shadows(root, apply=False):
    """
    Replace hardcoded neumorphic shadow pairs:
      #bdbab3 → color-mix(in oklch, var(--brand-c-neutral-dark) 70%, transparent)
      #e6e2da → var(--brand-c-neutral-light)
    These appear in box-shadow pairs for neumorphic effects.
    """
    NEUMORPHIC_REPLACEMENTS = [
        (re.compile(r'#bdbab3', re.IGNORECASE), 'color-mix(in oklch, var(--brand-c-neutral-dark) 70%, transparent)'),
        (re.compile(r'#e6e2da', re.IGNORECASE), 'var(--brand-c-neutral-light)'),
        (re.compile(r'#f5f5f5', re.IGNORECASE), 'var(--brand-c-neutral-light)'),
        (re.compile(r'#f9f8f6', re.IGNORECASE), 'var(--brand-c-bg)'),
        (re.compile(r'#f0ebe6', re.IGNORECASE), 'var(--brand-c-neutral-light)'),
        (re.compile(r'#e8e6e3', re.IGNORECASE), 'var(--brand-c-neutral-light)'),
        (re.compile(r'#ddd(?![0-9a-fA-F])'), 'var(--brand-c-neutral-light)'),
    ]

    SCAN_EXTENSIONS = {'.css', '.astro', '.scss'}
    EXCLUDE_FILES = {'emailit.ts', 'contact.ts', 'print.css', 'coretokens.css', 'theme-cards.css'}
    THEME_DIRS = {'brand', 'a11y'}

    total_changes = 0

    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for filename in files:
            filepath = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(filepath, root)
            ext = Path(filepath).suffix.lower()

            if ext not in SCAN_EXTENSIONS:
                continue
            if filename in EXCLUDE_FILES:
                continue
            # Skip theme definition files
            parts = Path(rel_path).parts
            if 'themes' in parts and any(t in parts for t in THEME_DIRS):
                continue

            with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()

            original = content
            file_changes = 0

            for pattern, replacement in NEUMORPHIC_REPLACEMENTS:
                matches = pattern.findall(content)
                count = len(matches)
                if count > 0:
                    content = pattern.sub(replacement, content)
                    file_changes += count
                    print(f"    {rel_path}: {pattern.pattern} → {replacement} (×{count})")

            if file_changes > 0 and apply:
                with open(filepath, 'w', encoding='utf-8', newline='') as f:
                    f.write(content)

            total_changes += file_changes

    return total_changes


def fix_reveal_canvas(root, apply=False):
    """Fix RevealCanvas #000000 → reads from CSS token"""
    filepath = os.path.join(root, 'components', 'Canvas', 'RevealCanvas.astro')
    if not os.path.exists(filepath):
        print(f"  ❌ NOT FOUND: RevealCanvas.astro")
        return 0

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace context.fillStyle = "#000000" with token read
    old = 'context.fillStyle = "#000000"'
    new = "context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-Black').trim() || '#000000'"

    if old in content:
        content = content.replace(old, new)
        if apply:
            with open(filepath, 'w', encoding='utf-8', newline='') as f:
                f.write(content)
        print(f"    RevealCanvas.astro: fillStyle → token read")
        return 1

    print(f"    RevealCanvas.astro: pattern not found (may already be fixed)")
    return 0


def main():
    if len(sys.argv) < 2:
        print("Usage: python fix_batch3_misc.py <src_dir> [--apply]")
        sys.exit(1)

    root = sys.argv[1]
    apply = '--apply' in sys.argv

    if not os.path.isdir(root):
        print(f"Error: {root} is not a directory")
        sys.exit(1)

    print(f"\n{'APPLYING' if apply else 'DRY RUN'} — Batch 3: Misc Fixes\n")

    total = 0

    print("  ── hero-morph.ts (#8B9D83 → BRAND_PRIMARY) ──")
    hero_path = os.path.join(root, 'lib', 'animation', 'hero-morph.ts')
    total += fix_hero_morph(hero_path, apply)

    print("\n  ── particle-burst.ts (white → COLOR_WHITE) ──")
    particle_path = os.path.join(root, 'lib', 'animation', 'particle-burst.ts')
    total += fix_particle_burst(particle_path, apply)

    print("\n  ── Neumorphic shadows (#bdbab3, #e6e2da etc) ──")
    total += fix_neumorphic_shadows(root, apply)

    print("\n  ── RevealCanvas (#000000 → token) ──")
    total += fix_reveal_canvas(root, apply)

    print(f"\n{'Applied' if apply else 'Would apply'}: {total} total fixes")

    if not apply and total > 0:
        print(f"\nRun with --apply to write changes:")
        print(f"  python fix_batch3_misc.py {root} --apply")


if __name__ == '__main__':
    main()
