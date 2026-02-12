#!/usr/bin/env python3
"""
Purge Small px Font-Sizes
==========================
Removes only: font-size: Npx where N <= 10
Leaves everything else untouched.

Usage:
  python purge_small_px.py <src_dir> --dry-run
  python purge_small_px.py <src_dir> --apply
"""

import os
import re
import sys
from pathlib import Path

SCAN_EXTENSIONS = {'.css', '.astro'}
EXCLUDE_DIRS = {'node_modules', '.git', 'dist', '.astro', 'Preview', '__pycache__'}

SYSTEM_FILES = {
    'global.css', 'typography.css', 'reset.css', 'images.css',
    'max.css', 'desktop.css', 'tablet.css', 'phone.css', 'xs.css', 'micro.css',
}

FONT_SIZE_PX = re.compile(r'^\s*font-size:\s*(\d+(?:\.\d+)?)px\s*;?\s*$')


def process_file(filepath, root, dry_run):
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

    in_style = False if filepath.endswith('.astro') else True
    deleted = []
    new_lines = []

    for i, line in enumerate(lines, 1):
        if filepath.endswith('.astro'):
            if re.match(r'^\s*<style', line, re.IGNORECASE):
                in_style = True
            elif re.match(r'^\s*</style', line, re.IGNORECASE):
                in_style = False

        should_delete = False
        if in_style:
            px_match = FONT_SIZE_PX.match(line)
            if px_match:
                px_val = float(px_match.group(1))
                if px_val <= 10:
                    should_delete = True

        if should_delete:
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
        print("Usage: python purge_small_px.py <src_dir> --dry-run|--apply")
        sys.exit(1)

    root = sys.argv[1]
    mode = sys.argv[2]
    dry_run = mode != '--apply'

    if not os.path.isdir(root):
        print(f"Error: {root} is not a directory")
        sys.exit(1)

    print(f"{'DRY RUN' if dry_run else 'APPLYING'}: Purging font-size px<=10 from {root}\n")

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
    print(f"Small px Purge {'Preview' if dry_run else 'Complete'}")
    print(f"{'='*50}\n")
    print(f"  Lines deleted:  {total_deleted}")
    print(f"  Files changed:  {files_changed}\n")

    print("Top files:")
    for r in sorted(results, key=lambda x: x['deleted'], reverse=True)[:20]:
        print(f"  {r['deleted']:>4}  {r['file']}")

    if dry_run:
        print("\nDry run. Use --apply to make changes.")


if __name__ == '__main__':
    main()
