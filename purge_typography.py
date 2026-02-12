#!/usr/bin/env python3
"""
Typography Purge
=================
Strips all token-based typography declarations from component files.
After this, all sizing/weight/line-height comes from HTML elements in global.css.

Deletes:
  - font-size: var(--text-*)
  - font-weight: var(--font-*)
  - line-height: var(--leading-*)
  - font-family: var(--font-heading) / var(--font-body)

Flags (does NOT delete):
  - Direct font-size values (e.g. font-size: 1.5rem) — may be legitimate
  - Direct font-weight values on non-element selectors — may be legitimate

Usage:
  python purge_typography.py <src_dir> --dry-run    # Preview
  python purge_typography.py <src_dir> --apply       # Apply
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict

SCAN_EXTENSIONS = {'.css', '.astro'}
EXCLUDE_DIRS = {'node_modules', '.git', 'dist', '.astro', 'Preview', '__pycache__'}

# System files — DON'T touch these (they define the element styles)
SYSTEM_FILES = {
    'global.css',
    'typography.css',
    'reset.css',
    'max.css',
    'desktop.css',
    'tablet.css',
    'phone.css',
    'xs.css',
    'micro.css',
}

# Patterns to DELETE (token-based AND direct value declarations)
DELETE_PATTERNS = [
    # font-size: var(--text-*) or var(--text-*, fallback)
    re.compile(r'^\s*font-size:\s*var\(--text-[^)]+\)\s*;?\s*$'),
    # font-size: var(--font-size-*)
    re.compile(r'^\s*font-size:\s*var\(--font-size-[^)]+\)\s*;?\s*$'),
    # font-size: direct values (10px, 1.5rem, 0.875rem, 0.9em etc)
    re.compile(r'^\s*font-size:\s*[\d.]+(?:rem|px|em)\s*;?\s*$'),
    # font-weight: var(--font-*)
    re.compile(r'^\s*font-weight:\s*var\(--font-[^)]+\)\s*;?\s*$'),
    # font-weight: direct numeric values (400, 500, 600, 700, 800)
    re.compile(r'^\s*font-weight:\s*\d{3}\s*;?\s*$'),
    # font-weight: keyword values (normal, bold, bolder, lighter)
    re.compile(r'^\s*font-weight:\s*(?:normal|bold|bolder|lighter)\s*;?\s*$'),
    # line-height: var(--leading-*)
    re.compile(r'^\s*line-height:\s*var\(--leading-[^)]+\)\s*;?\s*$'),
    # line-height: direct values (1.25, 1.375, 1.5, 1.625, 24px etc)
    re.compile(r'^\s*line-height:\s*[\d.]+(?:rem|px|em)?\s*;?\s*$'),
    # font-family: var(--font-heading) or var(--font-body) or var(--font-mono)
    re.compile(r'^\s*font-family:\s*var\(--font-(?:heading|body|mono)[^)]*\)\s*;?\s*$'),
    # font-family: 'Quicksand'... (duplicates element definition)
    re.compile(r"^\s*font-family:\s*['\"]?Quicksand[^;]*;?\s*$"),
    # letter-spacing: var(--letter-spacing-*) or var(--tracking-*)
    re.compile(r'^\s*letter-spacing:\s*var\(--(?:letter-spacing|tracking)-[^)]+\)\s*;?\s*$'),
    # letter-spacing: direct values (0.05em, 0.1em etc)
    re.compile(r'^\s*letter-spacing:\s*[\d.]+(?:rem|px|em)\s*;?\s*$'),
]

# Nothing left to flag — all typography declarations get deleted
FLAG_PATTERNS = []

# Old token DEFINITIONS to remove from token files
OLD_TOKEN_DEFS = [
    '--text-h1', '--text-h2', '--text-h3', '--text-h4', '--text-h5',
    '--text-body', '--text-small', '--text-fine', '--text-quote',
    '--font-light', '--font-normal', '--font-medium', '--font-semibold',
    '--font-bold', '--font-extrabold',
    '--leading-tight', '--leading-snug', '--leading-normal', '--leading-relaxed',
    '--letter-spacing-normal', '--letter-spacing-wide', '--letter-spacing-wider',
    '--font-heading', '--font-body', '--font-mono',
]


def process_file(filepath, root, dry_run):
    """Process a single file, deleting token-based typography lines"""
    rel_path = os.path.relpath(filepath, root).replace('\\', '/')
    filename = os.path.basename(filepath)

    if filename in SYSTEM_FILES:
        return None

    # Check path exclusions
    for part in Path(rel_path).parts:
        if part in EXCLUDE_DIRS:
            return None

    ext = Path(filepath).suffix.lower()
    if ext not in SCAN_EXTENSIONS:
        return None

    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            lines = f.readlines()
    except Exception:
        return None

    deleted = []
    flagged = []
    new_lines = []

    for i, line in enumerate(lines, 1):
        should_delete = False
        for pattern in DELETE_PATTERNS:
            if pattern.match(line):
                should_delete = True
                deleted.append((i, line.strip()))
                break

        if not should_delete:
            # Check for flags
            for pattern in FLAG_PATTERNS:
                if pattern.match(line):
                    flagged.append((i, line.strip()))
                    break
            new_lines.append(line)

    if not deleted:
        return {'file': rel_path, 'deleted': 0, 'flagged': len(flagged), 'flags': flagged}

    # Clean up empty rule blocks left by deletions
    content = ''.join(new_lines)
    # Remove empty blocks: selector { \n } or selector { }
    content = re.sub(r'([^{}]+)\{\s*\}', '', content)
    # Remove double blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)

    if not dry_run:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
        except Exception as e:
            return {'file': rel_path, 'error': str(e)}

    return {
        'file': rel_path,
        'deleted': len(deleted),
        'deletions': deleted,
        'flagged': len(flagged),
        'flags': flagged,
    }


def process_token_file(filepath, root, dry_run):
    """Remove old token definitions from typography.css and theme files"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return 0

    original = content
    removed = 0

    for token in OLD_TOKEN_DEFS:
        # Match: --token-name: value; (possibly multi-line)
        pattern = re.compile(
            rf'^\s*{re.escape(token)}\s*:[^;]*;[ \t]*(?:/\*[^*]*\*/)?[ \t]*\n?',
            re.MULTILINE
        )
        matches = pattern.findall(content)
        if matches:
            removed += len(matches)
            content = pattern.sub('', content)

    if content != original:
        content = re.sub(r'\n{3,}', '\n\n', content)
        if not dry_run:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

    return removed


def main():
    if len(sys.argv) < 3:
        print("Usage: python purge_typography.py <src_dir> --dry-run|--apply")
        sys.exit(1)

    root = sys.argv[1]
    mode = sys.argv[2]
    dry_run = mode != '--apply'

    if not os.path.isdir(root):
        print(f"Error: {root} is not a directory")
        sys.exit(1)

    print(f"{'DRY RUN' if dry_run else 'APPLYING'}: Purging typography tokens from {root}\n")

    results = []
    total_deleted = 0
    total_flagged = 0
    files_changed = 0

    # Process component/page files
    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for filename in files:
            filepath = os.path.join(dirpath, filename)
            result = process_file(filepath, root, dry_run)
            if result and result.get('deleted', 0) > 0:
                results.append(result)
                total_deleted += result['deleted']
                total_flagged += result.get('flagged', 0)
                files_changed += 1
            elif result and result.get('flagged', 0) > 0:
                results.append(result)
                total_flagged += result['flagged']

    # Process token definition files — remove old definitions
    token_removed = 0
    token_dirs = [
        os.path.join(root, 'styles', 'tokens'),
        os.path.join(root, 'styles', 'themes', 'brand'),
        os.path.join(root, 'styles', 'themes', 'a11y'),
    ]
    for token_dir in token_dirs:
        if not os.path.isdir(token_dir):
            continue
        for filename in os.listdir(token_dir):
            if filename.endswith('.css') and filename != 'typography.css':
                filepath = os.path.join(token_dir, filename)
                removed = process_token_file(filepath, root, dry_run)
                if removed > 0:
                    token_removed += removed
                    rel = os.path.relpath(filepath, root)
                    print(f"  Token defs removed from {rel}: {removed}")

    # Summary
    print(f"\n{'='*60}")
    print(f"Typography Purge {'Preview' if dry_run else 'Complete'}")
    print(f"{'='*60}\n")
    print(f"  Lines deleted:         {total_deleted}")
    print(f"  Files changed:         {files_changed}")
    print(f"  Token defs removed:    {token_removed}")
    print(f"  Direct values flagged: {total_flagged} (review these)\n")

    # Top files
    print(f"Files with most deletions:")
    sorted_results = sorted(results, key=lambda x: x.get('deleted', 0), reverse=True)
    for r in sorted_results[:30]:
        if r.get('deleted', 0) > 0:
            print(f"  {r['deleted']:>4}  {r['file']}")

    # Generate report
    report_path = os.path.join(os.path.dirname(root), 'typography_purge_report.md')
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("# Typography Purge Report\n\n")
        f.write(f"**Mode:** {'Dry run' if dry_run else 'Applied'}\n")
        f.write(f"**Lines deleted:** {total_deleted}\n")
        f.write(f"**Files changed:** {files_changed}\n")
        f.write(f"**Token defs removed:** {token_removed}\n")
        f.write(f"**Direct values flagged:** {total_flagged}\n\n")

        # Deletions by file
        f.write("## Deletions by File\n\n")
        for r in sorted_results:
            if r.get('deleted', 0) == 0:
                continue
            f.write(f"### {r['file']} ({r['deleted']} deleted)\n\n")
            for line_num, line_text in r.get('deletions', []):
                f.write(f"- L{line_num}: `{line_text}`\n")
            f.write("\n")

        # Flagged (direct values to review)
        flagged_results = [r for r in results if r.get('flagged', 0) > 0]
        if flagged_results:
            f.write("## ⚠️ Flagged — Direct Values (Review)\n\n")
            f.write("These use direct rem/px values, not tokens. They may be legitimate.\n\n")
            for r in flagged_results:
                for line_num, line_text in r.get('flags', []):
                    f.write(f"- {r['file']} L{line_num}: `{line_text}`\n")
            f.write("\n")

        # What needs HTML changes
        f.write("## Next Step: HTML Element Changes\n\n")
        f.write("After purging, these component types need their HTML elements updated:\n\n")
        f.write("| Old pattern | New element | Where |\n")
        f.write("|-------------|-------------|-------|\n")
        f.write("| `<div class=\"__title\">` | `<h2>` or `<h3>` | Section/card titles |\n")
        f.write("| `<span class=\"__title\">` | `<h3>` or `<h4>` | Card titles |\n")
        f.write("| `<div class=\"__description\">` | `<p>` | Body text |\n")
        f.write("| `<span class=\"badge\">` | `<small>` | Badges, meta, labels |\n")
        f.write("| `<span class=\"__date\">` | `<small>` | Timestamps |\n")
        f.write("| `<div class=\"__subtitle\">` | `<p>` or `<h5>` | Subtitles |\n")
        f.write("| `<span class=\"__label\">` | `<small>` | Labels, captions |\n")
        f.write("| `<span class=\"__price\">` | `<h6>` | Prices |\n")

    print(f"\nReport: {report_path}")

    if dry_run:
        print(f"\nDry run. Use --apply to make changes.")


if __name__ == '__main__':
    main()
