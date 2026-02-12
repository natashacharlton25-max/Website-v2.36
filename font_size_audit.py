#!/usr/bin/env python3
"""
Font-Size Inheritance Audit
=============================
Scans component files to determine which font-size declarations are:
  ✅ REDUNDANT — selector targets an h1-h6/p/blockquote element → delete font-size
  🔄 CHANGE HTML — selector targets a div/span but should be a heading → change element
  ✔️ KEEP — non-heading content (badges, prices, labels) that genuinely needs a size

Checks BOTH the CSS selectors AND the actual HTML templates in .astro files.

Usage:
  python font_size_audit.py <src_dir>
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict

SCAN_EXTENSIONS = {'.css', '.astro'}
EXCLUDE_DIRS = {'node_modules', '.git', 'dist', '.astro', 'Preview', '__pycache__'}

# These are heading tokens — if used on an actual heading element, redundant
HEADING_TOKENS = {
    '--text-h1', '--text-h2', '--text-h3', '--text-h4', '--text-h5',
    '--text-quote', '--text-body', '--text-small', '--text-fine',
}

# HTML elements that get size from global.css
SEMANTIC_ELEMENTS = {'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote', 'small'}

# Token → expected element mapping
TOKEN_TO_ELEMENT = {
    '--text-h1': 'h1',
    '--text-h2': 'h2',
    '--text-h3': 'h3',
    '--text-h4': 'h4',
    '--text-h5': 'h5',
    '--text-body': 'p',
    '--text-small': 'h6/small',
    '--text-fine': 'small',
    '--text-quote': 'blockquote',
}

# Selectors that are clearly NOT headings (keep font-size)
NON_HEADING_PATTERNS = [
    r'badge', r'btn', r'button', r'price', r'tag', r'label', r'meta',
    r'date', r'time', r'count', r'icon', r'link', r'copyright',
    r'breadcrumb', r'input', r'toast', r'tooltip', r'dropdown',
    r'sku', r'note', r'hint', r'caption', r'read-?time', r'excerpt',
    r'description', r'desc', r'subtitle', r'body', r'text(?!-)',
    r'chip', r'pill', r'stat', r'value', r'number', r'step',
    r'cart-item', r'order-item', r'summary', r'total', r'row',
    r'info', r'detail', r'spec', r'feature', r'list',
    r'switcher', r'nav\b', r'menu', r'tab', r'toggle',
    r'form', r'field', r'placeholder', r'search',
    r'ticker', r'announcement', r'cookie', r'banner',
    r'checkout-info', r'checkout-subtitle',
    r'\.lead', r'\.text-small', r'\.text-fine',
    r'\.compact-description',
]

# Selectors that ARE likely headings (should use semantic element)
HEADING_PATTERNS = [
    r'__title', r'__name$', r'__heading', r'-title\b',
    r'\.section-title', r'\.legal-title', r'\.cart-page__title',
    r'\.cta-title', r'\.checkout-title', r'brand-name',
]

# Skip these files — they define the system, not consume it
SYSTEM_FILES = {
    'global.css', 'typography.css', 'utilities.css',
    'reset.css', 'images.css',
}


def extract_font_size_declarations(content, filepath):
    """Find all font-size: var(--text-*) declarations with their selectors"""
    results = []
    lines = content.split('\n')
    current_selector = ''
    brace_depth = 0

    for i, line in enumerate(lines, 1):
        stripped = line.strip()

        # Track selectors
        if '{' in stripped and '}' not in stripped:
            # New selector block
            selector_match = re.match(r'^([^{]+)\{', stripped)
            if selector_match:
                current_selector = selector_match.group(1).strip()
            brace_depth += stripped.count('{') - stripped.count('}')
        elif '{' in stripped and '}' in stripped:
            # Single-line block
            selector_match = re.match(r'^([^{]+)\{', stripped)
            if selector_match:
                current_selector = selector_match.group(1).strip()
        elif '}' in stripped:
            brace_depth -= stripped.count('}')
            if brace_depth <= 0:
                current_selector = ''
                brace_depth = 0

        # Find font-size declarations
        fs_match = re.search(r'font-size:\s*var\((--text-[a-z0-9-]+)', stripped)
        if fs_match:
            token = fs_match.group(1)
            results.append({
                'file': filepath,
                'line': i,
                'selector': current_selector,
                'token': token,
                'raw_line': stripped,
            })

    return results


def extract_html_elements(content):
    """Extract class → element mapping from Astro/HTML template"""
    class_to_element = {}

    # Match opening tags with class attributes
    # e.g. <h2 class="section-title"> or <div class="card__title">
    tag_pattern = re.compile(
        r'<([\w-]+)(?:\s[^>]*?)?\sclass\s*=\s*["\']([^"\']+)["\']',
        re.IGNORECASE
    )

    for match in tag_pattern.finditer(content):
        element = match.group(1).lower()
        classes = match.group(2).split()
        for cls in classes:
            cls_clean = cls.strip()
            if cls_clean:
                class_to_element[cls_clean] = element

    # Also match class:list={[...]} Astro syntax
    classlist_pattern = re.compile(
        r'<([\w-]+)(?:\s[^>]*?)?\sclass:list\s*=\s*\{?\[([^\]]+)\]',
        re.IGNORECASE
    )
    for match in classlist_pattern.finditer(content):
        element = match.group(1).lower()
        classes_raw = match.group(2)
        # Extract string literals
        for cls_match in re.finditer(r'["\']([^"\']+)["\']', classes_raw):
            for cls in cls_match.group(1).split():
                class_to_element[cls.strip()] = element

    return class_to_element


def get_element_for_selector(selector, class_map):
    """Given a CSS selector, determine what HTML element it targets"""
    # Direct element selectors: h1, h2, p etc
    element_match = re.match(r'^(h[1-6]|p|blockquote|small)\b', selector.strip())
    if element_match:
        return element_match.group(1)

    # Class selector: .foo or .foo .bar
    # Get the last class in the chain (the one being styled)
    classes = re.findall(r'\.([\w-]+)', selector)
    if classes:
        target_class = classes[-1]
        if target_class in class_map:
            return class_map[target_class]

        # Check compound: .parent .child h2
        # Look for element at end of selector
        parts = selector.split()
        if parts:
            last = parts[-1].strip()
            el_match = re.match(r'^(h[1-6]|p|blockquote|small)\b', last)
            if el_match:
                return el_match.group(1)

    return None


def classify_declaration(decl, class_map):
    """Classify a font-size declaration as REDUNDANT, CHANGE_HTML, or KEEP"""
    selector = decl['selector']
    token = decl['token']

    # Check if selector targets a semantic element
    element = get_element_for_selector(selector, class_map)

    # Check if selector matches non-heading patterns
    selector_lower = selector.lower()
    is_non_heading = any(re.search(p, selector_lower) for p in NON_HEADING_PATTERNS)
    is_heading_named = any(re.search(p, selector_lower) for p in HEADING_PATTERNS)

    if element and element in SEMANTIC_ELEMENTS:
        # HTML uses a heading element already
        expected = TOKEN_TO_ELEMENT.get(token, '')
        if element in expected or (element in {'h1','h2','h3','h4','h5','h6'} and token.startswith('--text-h')):
            return 'REDUNDANT', f'Already <{element}>, inherits from global.css'
        else:
            return 'REDUNDANT_MISMATCH', f'Element is <{element}> but token is {token} (→ {expected}). Check if element or token is wrong.'

    # Non-heading content — keep
    if is_non_heading and not is_heading_named:
        return 'KEEP', f'Non-heading content ({selector_lower})'

    # Heading-named but on a div/span — should change HTML
    if is_heading_named:
        expected = TOKEN_TO_ELEMENT.get(token, 'heading')
        if element:
            return 'CHANGE_HTML', f'Currently <{element}>, should be <{expected}>'
        else:
            return 'CHANGE_HTML', f'Unknown element, should be <{expected}>'

    # Ambiguous — check token scale
    if token in ('--text-h1', '--text-h2', '--text-h3', '--text-quote'):
        # Big sizes on unknown elements — probably should be headings
        expected = TOKEN_TO_ELEMENT.get(token, 'heading')
        if element:
            return 'CHANGE_HTML', f'Currently <{element}> at {token} scale, should be <{expected}>'
        else:
            return 'REVIEW', f'Large size ({token}) — check if should be <{expected}>'

    # Small/body tokens on non-heading — keep
    if token in ('--text-body', '--text-small', '--text-fine', '--text-h5', '--text-h4'):
        return 'KEEP', f'Body/utility size on component element'

    return 'REVIEW', f'Ambiguous — manual check needed'


def process_directory(root):
    """Process all files and generate audit"""
    all_declarations = []
    all_class_maps = {}

    # First pass: build class → element maps from all .astro files
    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for filename in files:
            if filename.endswith('.astro') or filename.endswith('.html'):
                filepath = os.path.join(dirpath, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
                        content = f.read()
                    class_map = extract_html_elements(content)
                    all_class_maps.update(class_map)
                except Exception:
                    pass

    # Second pass: find all font-size declarations
    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for filename in files:
            if filename in SYSTEM_FILES:
                continue
            ext = Path(filename).suffix.lower()
            if ext not in SCAN_EXTENSIONS:
                continue

            filepath = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(filepath, root).replace('\\', '/')

            try:
                with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
                    content = f.read()
            except Exception:
                continue

            # For .astro files, also extract local class map
            local_map = dict(all_class_maps)
            if filename.endswith('.astro'):
                local_map.update(extract_html_elements(content))

            decls = extract_font_size_declarations(content, rel_path)
            for decl in decls:
                classification, reason = classify_declaration(decl, local_map)
                decl['classification'] = classification
                decl['reason'] = reason
                all_declarations.append(decl)

    return all_declarations


def generate_report(declarations, output_path):
    """Generate markdown report grouped by classification"""

    # Group by classification
    groups = defaultdict(list)
    for d in declarations:
        groups[d['classification']].append(d)

    # Count by file
    file_counts = defaultdict(lambda: defaultdict(int))
    for d in declarations:
        file_counts[d['file']][d['classification']] += 1

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Font-Size Inheritance Audit\n\n")

        # Summary
        f.write("## Summary\n\n")
        f.write("| Action | Count | Meaning |\n")
        f.write("|--------|------:|--------|\n")
        f.write(f"| ✅ REDUNDANT | {len(groups['REDUNDANT'])} | Delete font-size — element inherits from global.css |\n")
        f.write(f"| ⚠️ MISMATCH | {len(groups['REDUNDANT_MISMATCH'])} | Element and token disagree — check which is right |\n")
        f.write(f"| 🔄 CHANGE HTML | {len(groups['CHANGE_HTML'])} | Change div/span to h1-h6/p, then delete font-size |\n")
        f.write(f"| ✔️ KEEP | {len(groups['KEEP'])} | Non-heading content, font-size stays |\n")
        f.write(f"| 🔍 REVIEW | {len(groups['REVIEW'])} | Ambiguous — manual decision needed |\n")
        f.write(f"| **Total** | **{len(declarations)}** | |\n\n")

        # REDUNDANT — safe to delete
        if groups['REDUNDANT']:
            f.write("---\n\n## ✅ REDUNDANT — Delete font-size (element inherits)\n\n")
            f.write("These use a semantic HTML element that already gets the right size from global.css.\n")
            f.write("**Action:** Remove the `font-size` line from CSS.\n\n")
            f.write("| File | Line | Selector | Token | Element |\n")
            f.write("|------|------|----------|-------|---------|\n")
            for d in sorted(groups['REDUNDANT'], key=lambda x: (x['file'], x['line'])):
                f.write(f"| {d['file']} | L{d['line']} | `{d['selector']}` | `{d['token']}` | {d['reason']} |\n")

        # MISMATCH
        if groups['REDUNDANT_MISMATCH']:
            f.write("\n---\n\n## ⚠️ MISMATCH — Element vs token disagree\n\n")
            f.write("The HTML uses a heading element but the token doesn't match it.\n")
            f.write("**Action:** Decide if the element or the token is wrong, fix one, delete font-size.\n\n")
            f.write("| File | Line | Selector | Token | Issue |\n")
            f.write("|------|------|----------|-------|-------|\n")
            for d in sorted(groups['REDUNDANT_MISMATCH'], key=lambda x: (x['file'], x['line'])):
                f.write(f"| {d['file']} | L{d['line']} | `{d['selector']}` | `{d['token']}` | {d['reason']} |\n")

        # CHANGE HTML
        if groups['CHANGE_HTML']:
            f.write("\n---\n\n## 🔄 CHANGE HTML — Swap element to heading, then delete font-size\n\n")
            f.write("These use a non-semantic element (div/span) with a heading-scale size.\n")
            f.write("**Action:** Change the HTML element to the right heading, then remove font-size from CSS.\n\n")
            f.write("| File | Line | Selector | Token | Recommendation |\n")
            f.write("|------|------|----------|-------|----------------|\n")
            for d in sorted(groups['CHANGE_HTML'], key=lambda x: (x['file'], x['line'])):
                f.write(f"| {d['file']} | L{d['line']} | `{d['selector']}` | `{d['token']}` | {d['reason']} |\n")

        # KEEP
        if groups['KEEP']:
            f.write("\n---\n\n## ✔️ KEEP — Non-heading content (font-size stays)\n\n")
            f.write("These are badges, prices, labels, meta text etc. They need explicit sizes.\n\n")
            f.write("| File | Line | Selector | Token |\n")
            f.write("|------|------|----------|-------|\n")
            for d in sorted(groups['KEEP'], key=lambda x: (x['file'], x['line'])):
                f.write(f"| {d['file']} | L{d['line']} | `{d['selector']}` | `{d['token']}` |\n")

        # REVIEW
        if groups['REVIEW']:
            f.write("\n---\n\n## 🔍 REVIEW — Manual decision needed\n\n")
            f.write("| File | Line | Selector | Token | Notes |\n")
            f.write("|------|------|----------|-------|-------|\n")
            for d in sorted(groups['REVIEW'], key=lambda x: (x['file'], x['line'])):
                f.write(f"| {d['file']} | L{d['line']} | `{d['selector']}` | `{d['token']}` | {d['reason']} |\n")

        # File summary
        f.write("\n---\n\n## Files Overview\n\n")
        f.write("| File | Redundant | Mismatch | Change HTML | Keep | Review |\n")
        f.write("|------|-----------|----------|-------------|------|--------|\n")
        for filepath in sorted(file_counts.keys()):
            counts = file_counts[filepath]
            f.write(f"| {filepath} | {counts.get('REDUNDANT',0)} | {counts.get('REDUNDANT_MISMATCH',0)} | {counts.get('CHANGE_HTML',0)} | {counts.get('KEEP',0)} | {counts.get('REVIEW',0)} |\n")

    return groups


def main():
    if len(sys.argv) < 2:
        print("Usage: python font_size_audit.py <src_dir>")
        sys.exit(1)

    root = sys.argv[1]
    if not os.path.isdir(root):
        print(f"Error: {root} is not a directory")
        sys.exit(1)

    print(f"Scanning {root} for font-size declarations...\n")

    declarations = process_directory(root)
    output_path = os.path.join(os.path.dirname(root), 'font_size_audit.md')
    groups = generate_report(declarations, output_path)

    print(f"{'='*50}")
    print(f"Font-Size Inheritance Audit")
    print(f"{'='*50}\n")
    print(f"  ✅ REDUNDANT (delete font-size):  {len(groups['REDUNDANT'])}")
    print(f"  ⚠️  MISMATCH (check element vs token): {len(groups['REDUNDANT_MISMATCH'])}")
    print(f"  🔄 CHANGE HTML (swap to heading):  {len(groups['CHANGE_HTML'])}")
    print(f"  ✔️  KEEP (non-heading, stays):      {len(groups['KEEP'])}")
    print(f"  🔍 REVIEW (manual check):          {len(groups['REVIEW'])}")
    print(f"  ─────────────────────────────────")
    print(f"  Total: {len(declarations)}\n")
    print(f"Report: {output_path}")


if __name__ == '__main__':
    main()
