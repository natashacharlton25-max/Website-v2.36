#!/usr/bin/env python3
"""
Safe Font-Size Purge
=====================
ONLY removes font-size: var(--text-*) lines from component files.
Does NOT touch:
  - font-weight, line-height, font-family, letter-spacing
  - Hardcoded px/rem values
  - JS/script blocks
  - Empty block cleanup (this broke things last time)

Usage:
  python safe_purge_fontsize.py <src_dir> --dry-run
  python safe_purge_fontsize.py <src_dir> --apply
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict

SCAN_EXTENSIONS = {'.css', '.astro'}
EXCLUDE_DIRS = {'node_modules', '.git', 'dist', '.astro', 'Preview', '__pycache__'}

# System files — don't touch
SYSTEM_FILES = {
    'global.css', 'typography.css', 'reset.css', 'images.css',
    'max.css', 'desktop.css', 'tablet.css', 'phone.css', 'xs.css', 'micro.css',
}

# Only this pattern gets deleted
FONT_SIZE_VAR = re.compile(r'^\s*font-size:\s*var\(--text-[^)]+\)\s*;?\s*$')


def process_file(filepath, root, dry_run):
    """Remove font-size: var(--text-*) lines only"""
    rel_path = os.path.relpath(filepath, root).replace('\\', '/')
    filename = os.path.basename(filepath)

    if filename in SYSTEM_FILES:
        return None

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

    # For .astro files, only process lines inside <style> blocks
    in_style = False if filepath.endswith('.astro') else True
    deleted = []
    new_lines = []

    for i, line in enumerate(lines, 1):
        if filepath.endswith('.astro'):
            if re.match(r'^\s*<style', line, re.IGNORECASE):
                in_style = True
            elif re.match(r'^\s*</style', line, re.IGNORECASE):
                in_style = False

        if in_style and FONT_SIZE_VAR.match(line):
            deleted.append((i, line.strip()))
        else:
            new_lines.append(line)

    if not deleted:
        return None

    if not dry_run:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)
        except Exception as e:
            return {'file': rel_path, 'error': str(e)}

    return {
        'file': rel_path,
        'deleted': len(deleted),
        'deletions': deleted,
    }


def main():
    if len(sys.argv) < 3:
        print("Usage: python safe_purge_fontsize.py <src_dir> --dry-run|--apply")
        sys.exit(1)

    root = sys.argv[1]
    mode = sys.argv[2]
    dry_run = mode != '--apply'

    if not os.path.isdir(root):
        print(f"Error: {root} is not a directory")
        sys.exit(1)

    print(f"{'DRY RUN' if dry_run else 'APPLYING'}: Purging font-size: var(--text-*) from {root}\n")

    results = []
    total_deleted = 0
    files_changed = 0

    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for filename in files:
            filepath = os.path.join(dirpath, filename)
            result = process_file(filepath, root, dry_run)
            if result:
                results.append(result)
                total_deleted += result['deleted']
                files_changed += 1

    print(f"{'='*50}")
    print(f"Font-Size Purge {'Preview' if dry_run else 'Complete'}")
    print(f"{'='*50}\n")
    print(f"  Lines deleted:  {total_deleted}")
    print(f"  Files changed:  {files_changed}\n")

    print("Top files:")
    for r in sorted(results, key=lambda x: x['deleted'], reverse=True)[:20]:
        print(f"  {r['deleted']:>4}  {r['file']}")

    # Save report
    report_path = os.path.join(os.path.dirname(root), 'fontsize_purge_report.md')
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("# Font-Size Purge Report\n\n")
        f.write(f"**Mode:** {'Dry run' if dry_run else 'Applied'}\n")
        f.write(f"**Lines deleted:** {total_deleted}\n")
        f.write(f"**Files changed:** {files_changed}\n\n")

        for r in sorted(results, key=lambda x: x['deleted'], reverse=True):
            f.write(f"### {r['file']} ({r['deleted']} deleted)\n\n")
            for line_num, line_text in r['deletions']:
                f.write(f"- L{line_num}: `{line_text}`\n")
            f.write("\n")

    print(f"\nReport: {report_path}")
    if dry_run:
        print("Dry run. Use --apply to make changes.")


if __name__ == '__main__':
    main()
