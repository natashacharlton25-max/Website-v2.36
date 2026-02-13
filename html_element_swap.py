#!/usr/bin/env python3
"""
HTML Element Swap
==================
Replaces <div>/<span> with semantic elements based on class names.

Safe swaps (automated):
  - __label, __badge, __meta, __date, __category, __role, __type → <small>
  - __body, __text, __subtitle → <p> (only if no block children)

Manual review:
  - __title, __heading, __name → needs h2/h3/h4 decision

Usage:
  python html_element_swap.py <src_dir> --dry-run
  python html_element_swap.py <src_dir> --apply
"""

import os
import re
import sys
from pathlib import Path

SCAN_EXTENSIONS = {'.astro'}
EXCLUDE_DIRS = {'node_modules', '.git', 'dist', '.astro', 'Preview', '__pycache__'}

# Swap rules: class pattern → new element
# Only targets <div> and <span>, preserves all attributes
SWAP_RULES = [
    # Meta / Labels → <small>
    (re.compile(r'(?:__label|__badge|__meta|__date|__caption|__tag|__note|__timestamp|__category|__type|__role|__sku|-label|-badge|-meta|-date|-caption)(?:\s|"|\'|$)'), 'small'),
    # Body text → <p>
    (re.compile(r'(?:__body|__text|__subtitle|__lead|__excerpt|__message|__description|-description|-text|-subtitle)(?:\s|"|\'|$)'), 'p'),
]

# Skip these specific classes (not text content)
SKIP_CLASSES = {
    'a11y-toggle-card__text',  # wrapper div with children
    'a11y-panel__body',        # wrapper div with children
    'a11y-preset-btn__text',   # wrapper div with children
}

# Block elements that can't be inside <p> or <small>
BLOCK_ELEMENTS = {'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'table', 'section', 'article', 'header', 'footer', 'form', 'blockquote'}


def find_closing_tag(lines, start_idx, tag, cls_name):
    """Find the matching closing tag, checking for block children"""
    depth = 0
    has_block_children = False
    
    for i in range(start_idx, len(lines)):
        line = lines[i]
        
        # Count opening tags of same type
        opens = len(re.findall(rf'<{tag}[\s>]', line, re.IGNORECASE))
        closes = len(re.findall(rf'</{tag}>', line, re.IGNORECASE))
        
        # Check for block elements inside
        for block in BLOCK_ELEMENTS:
            if re.search(rf'<{block}[\s>]', line, re.IGNORECASE):
                if i != start_idx:  # Don't count the element itself
                    has_block_children = True
        
        depth += opens - closes
        
        if depth <= 0:
            return i, has_block_children
    
    return None, has_block_children


def get_class_from_line(line):
    """Extract the primary BEM class from a line"""
    match = re.search(r'class\s*=\s*["\']([^"\']+)["\']', line)
    if match:
        classes = match.group(1).split()
        # Return first class that matches a swap rule
        for cls in classes:
            for pattern, _ in SWAP_RULES:
                if pattern.search(cls):
                    return cls
    
    # Try class:list
    match = re.search(r'class:list\s*=\s*\{?\[([^\]]+)\]', line)
    if match:
        for cls_match in re.findall(r'["\']([^"\']+)["\']', match.group(1)):
            for pattern, _ in SWAP_RULES:
                if pattern.search(cls_match):
                    return cls_match
    
    return None


def process_file(filepath, root, dry_run):
    """Process a single .astro file"""
    rel_path = os.path.relpath(filepath, root).replace('\\', '/')
    
    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            lines = f.readlines()
    except Exception:
        return None

    # Track style/script blocks
    in_script = False
    in_style = False
    
    swaps = []
    skipped = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip().lower()
        
        if '<script' in stripped:
            in_script = True
        elif '</script' in stripped:
            in_script = False
        elif '<style' in stripped:
            in_style = True
        elif '</style' in stripped:
            in_style = False
        
        if in_script or in_style:
            i += 1
            continue
        
        # Check for div/span with matching class
        for tag in ['div', 'span']:
            tag_pattern = re.compile(
                rf'(<){tag}(\s[^>]*?class\s*=\s*["\'][^"\']*)',
                re.IGNORECASE
            )
            match = tag_pattern.search(line)
            if not match:
                continue
            
            cls = get_class_from_line(line)
            if not cls or cls in SKIP_CLASSES:
                continue
            
            # Determine target element
            new_tag = None
            for pattern, target in SWAP_RULES:
                if pattern.search(cls):
                    new_tag = target
                    break
            
            if not new_tag:
                continue
            
            # Find closing tag
            close_line, has_block = find_closing_tag(
                [l.lower() for l in lines], i, tag, cls
            )
            
            if close_line is None:
                skipped.append((i + 1, cls, f"Can't find closing </{tag}>"))
                continue
            
            # Don't put block elements inside <p> or <small>
            if has_block and new_tag in ('p', 'small'):
                skipped.append((i + 1, cls, f"Has block children, can't use <{new_tag}>"))
                continue
            
            swaps.append({
                'open_line': i,
                'close_line': close_line,
                'old_tag': tag,
                'new_tag': new_tag,
                'class': cls,
            })
        
        i += 1
    
    if not swaps and not skipped:
        return None
    
    # Apply swaps (in reverse order to preserve line numbers)
    if swaps and not dry_run:
        for swap in sorted(swaps, key=lambda x: x['close_line'], reverse=True):
            # Replace closing tag
            close_idx = swap['close_line']
            lines[close_idx] = re.sub(
                rf'</{swap["old_tag"]}>',
                f'</{swap["new_tag"]}>',
                lines[close_idx],
                count=1,
                flags=re.IGNORECASE
            )
            
            # Replace opening tag
            open_idx = swap['open_line']
            lines[open_idx] = re.sub(
                rf'<{swap["old_tag"]}(\s)',
                f'<{swap["new_tag"]}\\1',
                lines[open_idx],
                count=1,
                flags=re.IGNORECASE
            )
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    
    return {
        'file': rel_path,
        'swaps': [(s['open_line'] + 1, s['old_tag'], s['new_tag'], s['class']) for s in swaps],
        'skipped': skipped,
    }


def main():
    if len(sys.argv) < 3:
        print("Usage: python html_element_swap.py <src_dir> --dry-run|--apply")
        sys.exit(1)

    root = sys.argv[1]
    mode = sys.argv[2]
    dry_run = mode != '--apply'

    if not os.path.isdir(root):
        print(f"Error: {root} is not a directory")
        sys.exit(1)

    print(f"{'DRY RUN' if dry_run else 'APPLYING'}: HTML element swaps in {root}\n")

    results = []
    total_swaps = 0
    total_skipped = 0

    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for filename in files:
            if not filename.endswith('.astro'):
                continue
            filepath = os.path.join(dirpath, filename)
            result = process_file(filepath, root, dry_run)
            if result:
                results.append(result)
                total_swaps += len(result['swaps'])
                total_skipped += len(result['skipped'])

    print(f"{'='*50}")
    print(f"HTML Element Swap {'Preview' if dry_run else 'Complete'}")
    print(f"{'='*50}\n")
    print(f"  Swaps made:     {total_swaps}")
    print(f"  Skipped:        {total_skipped}\n")

    # Count by type
    to_small = sum(1 for r in results for s in r['swaps'] if s[2] == 'small')
    to_p = sum(1 for r in results for s in r['swaps'] if s[2] == 'p')
    print(f"  div/span -> small: {to_small}")
    print(f"  div/span -> p:     {to_p}\n")

    print("By file:")
    for r in sorted(results, key=lambda x: len(x['swaps']), reverse=True):
        print(f"  {len(r['swaps']):>3} swaps  {r['file']}")

    if total_skipped > 0:
        print(f"\nSkipped (need manual review):")
        for r in results:
            for line, cls, reason in r['skipped']:
                print(f"  {r['file']} L{line}: .{cls} - {reason}")

    report_path = os.path.join(os.path.dirname(root), 'html_swap_report.md')
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("# HTML Element Swap Report\n\n")
        f.write(f"**Mode:** {'Dry run' if dry_run else 'Applied'}\n")
        f.write(f"**Swaps:** {total_swaps} (small: {to_small}, p: {to_p})\n")
        f.write(f"**Skipped:** {total_skipped}\n\n")

        f.write("## Swaps\n\n")
        for r in sorted(results, key=lambda x: x['file']):
            if r['swaps']:
                f.write(f"### {r['file']}\n\n")
                for line, old, new, cls in r['swaps']:
                    f.write(f"- L{line}: `<{old}>` -> `<{new}>` (.{cls})\n")
                f.write("\n")

        if total_skipped > 0:
            f.write("## Skipped (Manual Review)\n\n")
            for r in results:
                for line, cls, reason in r['skipped']:
                    f.write(f"- {r['file']} L{line}: .{cls} - {reason}\n")

        f.write("\n## Still Manual: Heading Swaps\n\n")
        f.write("These need a decision about which heading level:\n\n")
        f.write("| File | Class | Suggested |\n")
        f.write("|------|-------|-----------|\n")
        f.write("| PresetButton.astro | .a11y-preset-btn__title | `<h4>` (small UI title) |\n")
        f.write("| CookieBanner.astro (x3) | .cookie-option-title | `<h4>` (option label) |\n")
        f.write("| ReaderNav.astro | .info-tooltip__title | `<h5>` (tooltip) |\n")
        f.write("| ReaderNav.astro | .current-section-title | `<h5>` (nav indicator) |\n")
        f.write("| ReaderNav.astro | .section-name | `<h5>` (nav label) |\n")
        f.write("| MiniCart.astro | .mini-cart__title | `<h4>` (panel title) |\n")

    print(f"\nReport: {report_path}")
    if dry_run:
        print("Dry run. Use --apply to make changes.")


if __name__ == '__main__':
    main()
