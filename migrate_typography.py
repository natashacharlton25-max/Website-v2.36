#!/usr/bin/env python3
"""
Typography Token Migration
===========================
Replaces all old --text-* size tokens with new semantic --text-h1/h2/h3/h4/h5/body/small/fine tokens.
Also fixes naming mismatches (--font-weight-bold → --font-bold etc).

Usage:
  python migrate_typography.py <src_dir> --dry-run     # Preview changes
  python migrate_typography.py <src_dir> --apply        # Apply changes
  python migrate_typography.py <src_dir> --report       # Just generate report
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict

# ─── Configuration ───────────────────────────────────────────────────────────

SCAN_EXTENSIONS = {'.css', '.astro', '.html', '.jsx', '.tsx', '.ts', '.js', '.scss', '.svelte'}

EXCLUDE_DIRS = {
    'node_modules', '.git', 'dist', '.astro', 'Preview',
    'ThemeTokenGen', '__pycache__',
}

# Files to skip (they define the tokens, not consume them)
SKIP_FILES = {
    'typography.css',  # Will be replaced manually with new version
}

# ─── Token Mapping ──────────────────────────────────────────────────────────
# Old token → New token

SIZE_TOKEN_MAP = {
    # Heading scale (top → bottom)
    '--text-7xl':   '--text-h1',
    '--text-6xl':   '--text-h1',
    '--text-5xl':   '--text-h2',
    '--text-4xl':   '--text-h3',
    '--text-3xl':   '--text-h3',
    '--text-2xl':   '--text-h4',      # Review: 10 of 48 may want --text-h3
    '--text-xl':    '--text-h4',
    '--text-lg':    '--text-h5',
    '--text-base':  '--text-body',
    '--text-md':    '--text-body',
    '--text-sm':    '--text-small',
    '--text-xs':    '--text-fine',
    '--text-2xs':   '--text-fine',
}

# Naming mismatches (from token audit)
NAMING_FIXES = {
    '--font-weight-bold':     '--font-bold',
    '--font-weight-medium':   '--font-medium',
    '--font-weight-semibold': '--font-semibold',
    '--font-weight-normal':   '--font-normal',
    '--font-weight-light':    '--font-light',
    '--font-extra-bold':      '--font-extrabold',
    '--font-regular':         '--font-normal',
    '--tracking-wide':        '--letter-spacing-wide',
    '--tracking-wider':       '--letter-spacing-wider',
    '--tracking-normal':      '--letter-spacing-normal',
    '--tracking-tight':       '--letter-spacing-tight',
    '--color-Danger':         '--color-Error',
    '--color-secondary-500':  '--brand-c-secondary',
    '--font-size-xs':         '--text-fine',
    '--font-size-sm':         '--text-small',
    '--font-size-base':       '--text-body',
    '--font-size-lg':         '--text-h5',
    '--font-size-xl':         '--text-h4',
    '--font-size-2xl':        '--text-h4',
    '--font-size-3xl':        '--text-h3',
}

# Removed tokens — warn if found in definitions
REMOVED_FONT_TOKENS = {
    '--font-secondary',
    '--font-special',
    '--leading-loose',
    '--letter-spacing-tight',
}

# ─── Regex ──────────────────────────────────────────────────────────────────

def build_var_pattern(token_map):
    """Build regex that matches var(--old-token) or var(--old-token, fallback)"""
    # Sort by length descending so --text-2xl matches before --text-2
    tokens = sorted(token_map.keys(), key=len, reverse=True)
    escaped = [re.escape(t) for t in tokens]
    pattern = r'var\(\s*(' + '|'.join(escaped) + r')(\s*(?:,\s*[^)]+)?)\)'
    return re.compile(pattern)

def build_def_pattern(token_map):
    """Build regex that matches --old-token: (definition lines)"""
    tokens = sorted(token_map.keys(), key=len, reverse=True)
    escaped = [re.escape(t.lstrip('-')) for t in tokens]
    pattern = r'(--(?:' + '|'.join(escaped) + r'))\s*:'
    return re.compile(pattern)


# ─── Processing ─────────────────────────────────────────────────────────────

def process_file(filepath, project_root, size_var_re, naming_var_re, dry_run=False):
    """Process a single file, replacing old tokens with new ones"""
    rel_path = os.path.relpath(filepath, project_root).replace('\\', '/')
    filename = os.path.basename(filepath)

    if filename in SKIP_FILES:
        return [], 0

    # Check exclusions
    parts = Path(rel_path).parts
    for part in parts:
        if part in EXCLUDE_DIRS:
            return [], 0

    ext = Path(filepath).suffix.lower()
    if ext not in SCAN_EXTENSIONS:
        return [], 0

    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            original = f.read()
    except Exception:
        return [], 0

    changes = []
    result = original

    # Pass 1: Replace size tokens in var() calls
    def replace_size_var(m):
        old_token = m.group(1)
        fallback = m.group(2) if m.group(2) else ''
        new_token = SIZE_TOKEN_MAP.get(old_token, old_token)
        if old_token != new_token:
            changes.append((old_token, new_token, 'size'))
        return f'var({new_token}{fallback})'

    result = size_var_re.sub(replace_size_var, result)

    # Pass 2: Replace naming mismatches in var() calls
    def replace_naming_var(m):
        old_token = m.group(1)
        fallback = m.group(2) if m.group(2) else ''
        new_token = NAMING_FIXES.get(old_token, old_token)
        if old_token != new_token:
            changes.append((old_token, new_token, 'naming'))
        return f'var({new_token}{fallback})'

    result = naming_var_re.sub(replace_naming_var, result)

    # Pass 3: Check for old token definitions (in token/theme files)
    # Just warn, don't auto-replace definitions
    warnings = []
    for line_num, line in enumerate(result.split('\n'), 1):
        for removed in REMOVED_FONT_TOKENS:
            if f'{removed}:' in line or f'{removed} :' in line:
                warnings.append(f"  REMOVE: {rel_path} L{line_num}: {removed} (unused token definition)")

    if changes and not dry_run:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(result)
        except Exception as e:
            return [f"ERROR writing {rel_path}: {e}"], 0

    return changes, len(changes), warnings if warnings else []


def main():
    if len(sys.argv) < 3:
        print("Usage: python migrate_typography.py <src_dir> --dry-run|--apply|--report")
        sys.exit(1)

    root = sys.argv[1]
    mode = sys.argv[2]

    if mode not in ('--dry-run', '--apply', '--report'):
        print("Mode must be --dry-run, --apply, or --report")
        sys.exit(1)

    if not os.path.isdir(root):
        print(f"Error: {root} is not a directory")
        sys.exit(1)

    dry_run = mode != '--apply'

    # Build regex patterns
    size_var_re = build_var_pattern(SIZE_TOKEN_MAP)
    naming_var_re = build_var_pattern(NAMING_FIXES)

    print(f"{'DRY RUN' if dry_run else 'APPLYING'}: Migrating typography tokens in {root}\n")

    # Counters
    total_changes = 0
    files_changed = 0
    by_replacement = defaultdict(int)  # (old, new) → count
    by_file = defaultdict(int)
    all_warnings = []

    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for filename in files:
            filepath = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(filepath, root).replace('\\', '/')

            result = process_file(filepath, root, size_var_re, naming_var_re, dry_run)
            if len(result) == 3:
                changes, count, warnings = result
                all_warnings.extend(warnings)
            else:
                changes, count = result
                warnings = []

            if count > 0:
                total_changes += count
                files_changed += 1
                by_file[rel_path] = count
                for old, new, _ in changes:
                    by_replacement[(old, new)] += 1

    # ── Report ──
    print(f"\n{'='*60}")
    print(f"Typography Migration {'Preview' if dry_run else 'Complete'}")
    print(f"{'='*60}\n")

    print(f"Total replacements: {total_changes}")
    print(f"Files affected: {files_changed}\n")

    print("Replacement summary:")
    print(f"{'Old token':<25} {'New token':<20} {'Count':>6}")
    print(f"{'-'*25} {'-'*20} {'-'*6}")
    for (old, new), count in sorted(by_replacement.items(), key=lambda x: -x[1]):
        print(f"{old:<25} {new:<20} {count:>6}")

    print(f"\nFiles changed (top 30):")
    for filepath, count in sorted(by_file.items(), key=lambda x: -x[1])[:30]:
        print(f"  {count:>4}  {filepath}")

    if all_warnings:
        print(f"\nWarnings ({len(all_warnings)}):")
        for w in all_warnings:
            print(w)

    # Also flag --text-2xl → --text-h4 for review
    text_2xl_count = by_replacement.get(('--text-2xl', '--text-h4'), 0)
    if text_2xl_count > 0:
        print(f"\n⚠️  REVIEW: {text_2xl_count} --text-2xl → --text-h4 replacements.")
        print("   Some may want --text-h3 instead. Search for 'text-h4' in files that")
        print("   previously used --text-2xl and check if the element is heading-scale.\n")

    if dry_run and mode != '--report':
        print(f"\nThis was a dry run. Run with --apply to make changes.")

    # Save report
    report_path = os.path.join(os.path.dirname(root), 'typography_migration_report.md')
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(f"# Typography Migration Report\n\n")
        f.write(f"**Mode:** {'Dry run' if dry_run else 'Applied'}\n")
        f.write(f"**Total replacements:** {total_changes}\n")
        f.write(f"**Files affected:** {files_changed}\n\n")

        f.write("## Replacement Summary\n\n")
        f.write("| Old token | New token | Count |\n")
        f.write("|-----------|-----------|-------|\n")
        for (old, new), count in sorted(by_replacement.items(), key=lambda x: -x[1]):
            f.write(f"| `{old}` | `{new}` | {count} |\n")

        f.write(f"\n## Files Changed\n\n")
        f.write("| File | Changes |\n")
        f.write("|------|---------|\n")
        for filepath, count in sorted(by_file.items(), key=lambda x: -x[1]):
            f.write(f"| {filepath} | {count} |\n")

        if all_warnings:
            f.write(f"\n## Warnings\n\n")
            for w in all_warnings:
                f.write(f"- {w}\n")

    print(f"Report saved to: {report_path}")


if __name__ == '__main__':
    main()
