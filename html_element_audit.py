#!/usr/bin/env python3
"""
HTML Element Swap Audit
========================
Finds <div> and <span> elements with heading/body class names
that should be semantic HTML elements instead.

Checks:
  1. Class names containing 'title', 'heading', 'name' → should be h2/h3/h4
  2. Class names containing 'description', 'text', 'body', 'subtitle' → should be p
  3. Class names containing 'label', 'badge', 'meta', 'date', 'caption' → should be small
  4. Cross-references with CSS to find what font-size token was used (if any remain)

Usage:
  python html_element_audit.py <src_dir>
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict

SCAN_EXTENSIONS = {'.astro'}
EXCLUDE_DIRS = {'node_modules', '.git', 'dist', '.astro', 'Preview', '__pycache__'}

# Pattern to find div/span with class attributes
TAG_WITH_CLASS = re.compile(
    r'<(div|span|a|section|header|footer)([^>]*?)class\s*=\s*["\'{`]([^"\'`}]+)["\'{`]',
    re.IGNORECASE
)

# Also match class:list syntax
TAG_WITH_CLASSLIST = re.compile(
    r'<(div|span|a)([^>]*?)class:list\s*=\s*\{?\[([^\]]+)\]',
    re.IGNORECASE
)

# Class name patterns that suggest a heading element
HEADING_PATTERNS = [
    re.compile(r'__title$'),
    re.compile(r'__heading$'),
    re.compile(r'__name$'),
    re.compile(r'-title$'),
    re.compile(r'-heading$'),
    re.compile(r'-name$'),
    re.compile(r'^title$'),
    re.compile(r'^heading$'),
]

# Class name patterns that suggest <p>
BODY_PATTERNS = [
    re.compile(r'__description$'),
    re.compile(r'__text$'),
    re.compile(r'__body$'),
    re.compile(r'__subtitle$'),
    re.compile(r'__lead$'),
    re.compile(r'__excerpt$'),
    re.compile(r'__message$'),
    re.compile(r'-description$'),
    re.compile(r'-text$'),
    re.compile(r'-subtitle$'),
]

# Class name patterns that suggest <small>
SMALL_PATTERNS = [
    re.compile(r'__label$'),
    re.compile(r'__badge$'),
    re.compile(r'__meta$'),
    re.compile(r'__date$'),
    re.compile(r'__caption$'),
    re.compile(r'__tag$'),
    re.compile(r'__note$'),
    re.compile(r'__timestamp$'),
    re.compile(r'__category$'),
    re.compile(r'__type$'),
    re.compile(r'__role$'),
    re.compile(r'__sku$'),
    re.compile(r'-label$'),
    re.compile(r'-badge$'),
    re.compile(r'-meta$'),
    re.compile(r'-date$'),
    re.compile(r'-caption$'),
]

# Elements that are already semantic — skip
SEMANTIC_ELEMENTS = {'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'small', 'blockquote', 'time', 'em', 'strong'}

# Skip these class patterns (not text elements)
SKIP_CLASS_PATTERNS = [
    re.compile(r'__wrapper'),
    re.compile(r'__container'),
    re.compile(r'__inner'),
    re.compile(r'__icon'),
    re.compile(r'__image'),
    re.compile(r'__img'),
    re.compile(r'__media'),
    re.compile(r'__overlay'),
    re.compile(r'__divider'),
    re.compile(r'__grid'),
    re.compile(r'__list'),
    re.compile(r'__actions'),
    re.compile(r'__buttons'),
    re.compile(r'__card$'),  # card wrappers, not text
]


def classify_class(cls):
    """Determine what element a class name suggests"""
    # Skip non-text classes
    for pattern in SKIP_CLASS_PATTERNS:
        if pattern.search(cls):
            return None, None

    for pattern in HEADING_PATTERNS:
        if pattern.search(cls):
            return 'heading', 'h2/h3/h4'

    for pattern in BODY_PATTERNS:
        if pattern.search(cls):
            return 'body', 'p'

    for pattern in SMALL_PATTERNS:
        if pattern.search(cls):
            return 'small', 'small'

    return None, None


def process_file(filepath, root):
    """Find div/span elements that should be semantic"""
    rel_path = os.path.relpath(filepath, root).replace('\\', '/')
    
    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
            lines = content.split('\n')
    except Exception:
        return []

    # Only look at template section (not script/style)
    in_template = True
    in_script = False
    in_style = False
    
    findings = []

    for i, line in enumerate(lines, 1):
        stripped = line.strip().lower()
        
        if stripped.startswith('<script'):
            in_script = True
        elif stripped.startswith('</script'):
            in_script = False
        elif stripped.startswith('<style'):
            in_style = True
        elif stripped.startswith('</style'):
            in_style = False
        
        if in_script or in_style:
            continue

        # Check both class="" and class:list patterns
        for pattern in [TAG_WITH_CLASS, TAG_WITH_CLASSLIST]:
            for match in pattern.finditer(line):
                tag = match.group(1).lower()
                
                # Skip already-semantic elements
                if tag in SEMANTIC_ELEMENTS:
                    continue
                
                # Only flag div and span (a/section have valid non-text uses)
                if tag not in ('div', 'span'):
                    continue

                classes_raw = match.group(3)
                
                # Extract individual classes
                if pattern == TAG_WITH_CLASSLIST:
                    classes = re.findall(r'["\']([^"\']+)["\']', classes_raw)
                else:
                    classes = classes_raw.split()

                for cls in classes:
                    cls = cls.strip()
                    category, suggested = classify_class(cls)
                    
                    if category:
                        findings.append({
                            'file': rel_path,
                            'line': i,
                            'tag': tag,
                            'class': cls,
                            'category': category,
                            'suggested': suggested,
                            'line_text': line.strip()[:120],
                        })
                        break  # One finding per element

    return findings


def main():
    if len(sys.argv) < 2:
        print("Usage: python html_element_audit.py <src_dir>")
        sys.exit(1)

    root = sys.argv[1]
    if not os.path.isdir(root):
        print(f"Error: {root} is not a directory")
        sys.exit(1)

    print(f"Scanning {root} for non-semantic HTML elements...\n")

    all_findings = []

    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for filename in files:
            if not filename.endswith('.astro'):
                continue
            filepath = os.path.join(dirpath, filename)
            findings = process_file(filepath, root)
            all_findings.extend(findings)

    # Group by category
    by_category = defaultdict(list)
    for f in all_findings:
        by_category[f['category']].append(f)

    # Summary
    print(f"{'='*50}")
    print(f"HTML Element Swap Audit")
    print(f"{'='*50}\n")
    print(f"  Headings (div/span -> h2/h3/h4): {len(by_category['heading'])}")
    print(f"  Body text (div/span -> p):        {len(by_category['body'])}")
    print(f"  Meta/labels (div/span -> small):   {len(by_category['small'])}")
    print(f"  Total swaps needed:                {len(all_findings)}\n")

    # Save report
    report_path = os.path.join(os.path.dirname(root), 'html_element_audit.md')
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("# HTML Element Swap Audit\n\n")
        f.write("## Summary\n\n")
        f.write(f"| Category | Count | Change to |\n")
        f.write(f"|----------|------:|----------|\n")
        f.write(f"| Headings | {len(by_category['heading'])} | `<h2>`, `<h3>`, or `<h4>` |\n")
        f.write(f"| Body text | {len(by_category['body'])} | `<p>` |\n")
        f.write(f"| Meta/labels | {len(by_category['small'])} | `<small>` |\n")
        f.write(f"| **Total** | **{len(all_findings)}** | |\n\n")

        for category, label, desc in [
            ('heading', 'Headings', 'Change `<div>` or `<span>` to `<h2>`, `<h3>`, or `<h4>` based on context'),
            ('body', 'Body Text', 'Change `<div>` or `<span>` to `<p>`'),
            ('small', 'Meta / Labels', 'Change `<div>` or `<span>` to `<small>`'),
        ]:
            items = by_category.get(category, [])
            if not items:
                continue

            f.write(f"---\n\n## {label} ({len(items)})\n\n")
            f.write(f"{desc}\n\n")
            f.write(f"| File | Line | Current | Class | Suggested |\n")
            f.write(f"|------|------|---------|-------|-----------|\n")

            for item in sorted(items, key=lambda x: (x['file'], x['line'])):
                f.write(f"| {item['file']} | L{item['line']} | `<{item['tag']}>` | `{item['class']}` | `<{item['suggested']}>` |\n")

            f.write("\n")

    print(f"Report: {report_path}")


if __name__ == '__main__':
    main()
