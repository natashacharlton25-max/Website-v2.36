#!/usr/bin/env python3
"""
Base Class Audit
=================
Scans all .astro components to identify BEM-named elements that should
share a base class (.card, .section, .grid, etc).

Reports:
  1. Which components need which base class
  2. The exact HTML line to change
  3. Which global.css overrides become possible

Usage:
  python base_class_audit.py <src_dir>
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict

SCAN_EXTENSIONS = {'.astro'}
EXCLUDE_DIRS = {'node_modules', '.git', 'dist', '.astro', 'Preview', '__pycache__'}

# ─── Base Class Patterns ─────────────────────────────────────────────────────
# suffix → base class it should get
# Matches class names like "insight-card", "product-card__wrapper" etc.

BASE_CLASS_RULES = {
    'card': {
        'base_class': 'card',
        'description': 'Cards — compact headings, body text, padding, radius, shadow',
        # Match: *-card or *-card__* as the outermost wrapper
        'class_pattern': re.compile(r'^[a-z][\w]*-card$'),
        # Also catch standalone "card" variants
        'extra_patterns': [
            re.compile(r'^card-offset$'),
            re.compile(r'^masonry-card$'),
        ],
    },
    'section': {
        'base_class': 'section',
        'description': 'Sections — page-level containers with vertical spacing',
        'class_pattern': re.compile(r'^[a-z][\w]*-section$'),
        'extra_patterns': [
            re.compile(r'^hero-morph$'),
        ],
    },
    'grid': {
        'base_class': 'grid',
        'description': 'Grids — layout containers for cards',
        'class_pattern': re.compile(r'^[a-z][\w]*-grid$'),
        'extra_patterns': [],
    },
    'modal': {
        'base_class': 'modal',
        'description': 'Modals/popups — overlay containers',
        'class_pattern': re.compile(r'^[a-z][\w]*-(?:popup|modal|overlay)$'),
        'extra_patterns': [
            re.compile(r'^search-overlay$'),
            re.compile(r'^contact-popup$'),
        ],
    },
    'form': {
        'base_class': 'form',
        'description': 'Forms — input groups, labels, validation',
        'class_pattern': re.compile(r'^[a-z][\w]*-form$'),
        'extra_patterns': [],
    },
}

# Elements that already have good base classes — skip these
SKIP_CLASSES = {
    'btn', 'btn-sm', 'btn-lg', 'badge', 'toast',
    'breadcrumbs', 'footer', 'container',
}

# Skip wrapper/layout classes
SKIP_PATTERNS = [
    re.compile(r'__'),           # BEM element (not block)
    re.compile(r'--'),           # BEM modifier
    re.compile(r'^is-'),         # State classes
    re.compile(r'^has-'),        # State classes
    re.compile(r'^a11y-'),       # Accessibility
    re.compile(r'^page-'),       # Page wrappers
    re.compile(r'^layout-'),     # Layout wrappers
]


def find_root_element(content):
    """Find the outermost HTML element in the template section of an .astro file.
    Returns list of (line_number, full_line, tag, classes) tuples.
    """
    results = []
    
    # Get template section (between --- frontmatter and <style>)
    # In .astro, template is after the last --- and before <style>
    template = content
    
    # Remove frontmatter
    fm_matches = list(re.finditer(r'^---\s*$', content, re.MULTILINE))
    if len(fm_matches) >= 2:
        template = content[fm_matches[1].end():]
    
    # Remove script blocks
    template = re.sub(r'<script[^>]*>.*?</script>', '', template, flags=re.DOTALL)
    
    # Remove style blocks  
    template = re.sub(r'<style[^>]*>.*?</style>', '', template, flags=re.DOTALL)
    
    lines = content.split('\n')
    
    # Find all opening tags with class attributes
    tag_pattern = re.compile(
        r'<([\w-]+)(?:\s[^>]*?)?\sclass\s*=\s*["\']([^"\']+)["\']',
        re.IGNORECASE
    )
    
    # Also match class:list
    classlist_pattern = re.compile(
        r'<([\w-]+)(?:\s[^>]*?)?\sclass:list\s*=\s*\{?\[([^\]]+)\]',
        re.IGNORECASE
    )
    
    for i, line in enumerate(lines, 1):
        for pattern in [tag_pattern, classlist_pattern]:
            for match in pattern.finditer(line):
                tag = match.group(1).lower()
                if tag in ('style', 'script', 'link', 'meta', 'slot'):
                    continue
                    
                classes_raw = match.group(2)
                
                # Extract class names
                if pattern == classlist_pattern:
                    classes = []
                    for cls_match in re.finditer(r'["\']([^"\']+)["\']', classes_raw):
                        classes.extend(cls_match.group(1).split())
                else:
                    classes = classes_raw.split()
                
                for cls in classes:
                    cls = cls.strip()
                    if cls:
                        results.append((i, line.strip(), tag, cls))
    
    return results


def classify_element(cls):
    """Check if a class name should get a base class"""
    # Skip known base classes
    if cls in SKIP_CLASSES:
        return None, None
    
    # Skip BEM elements/modifiers and state classes
    for pattern in SKIP_PATTERNS:
        if pattern.search(cls):
            return None, None
    
    # Check against base class rules
    for category, rule in BASE_CLASS_RULES.items():
        if rule['class_pattern'].match(cls):
            return category, rule['base_class']
        for extra in rule['extra_patterns']:
            if extra.match(cls):
                return category, rule['base_class']
    
    return None, None


def process_directory(root):
    """Scan all .astro files and find elements needing base classes"""
    findings = defaultdict(list)  # category → list of findings
    all_classes = defaultdict(list)  # class → list of (file, line, tag)
    
    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for filename in files:
            if not filename.endswith('.astro'):
                continue
            
            filepath = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(filepath, root).replace('\\', '/')
            
            try:
                with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
                    content = f.read()
            except Exception:
                continue
            
            elements = find_root_element(content)
            seen_in_file = set()
            
            for line_num, line_text, tag, cls in elements:
                category, base_class = classify_element(cls)
                
                if category and cls not in seen_in_file:
                    seen_in_file.add(cls)
                    
                    # Check if base class already present on same element
                    has_base = False
                    # Re-check the line for existing base class
                    class_match = re.search(r'class\s*=\s*["\']([^"\']+)["\']', line_text)
                    if class_match:
                        existing = class_match.group(1).split()
                        if base_class in existing:
                            has_base = True
                    
                    findings[category].append({
                        'file': rel_path,
                        'line': line_num,
                        'tag': tag,
                        'class': cls,
                        'base_class': base_class,
                        'has_base': has_base,
                        'line_text': line_text[:120],
                    })
                
                all_classes[cls].append((rel_path, line_num, tag))
    
    return findings, all_classes


def generate_report(findings, output_path):
    """Generate the audit report"""
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Base Class Audit\n\n")
        
        # Summary
        total_need = sum(
            len([x for x in items if not x['has_base']])
            for items in findings.values()
        )
        total_have = sum(
            len([x for x in items if x['has_base']])
            for items in findings.values()
        )
        
        f.write("## Summary\n\n")
        f.write(f"| Category | Need base class | Already have it |\n")
        f.write(f"|----------|----------------:|----------------:|\n")
        for category, items in sorted(findings.items()):
            need = len([x for x in items if not x['has_base']])
            have = len([x for x in items if x['has_base']])
            rule = BASE_CLASS_RULES[category]
            f.write(f"| `.{rule['base_class']}` — {rule['description'][:40]} | {need} | {have} |\n")
        f.write(f"| **Total** | **{total_need}** | **{total_have}** |\n\n")
        
        # Global CSS overrides this enables
        f.write("## Global CSS Overrides This Enables\n\n")
        f.write("Once base classes are added, add these to global.css:\n\n")
        f.write("```css\n")
        f.write("/* Cards — compact typography */\n")
        f.write(".card h2, .card h3, .card h4 { font-size: 1.125rem; line-height: 1.375; }\n")
        f.write(".card h5, .card h6 { font-size: 0.875rem; }\n")
        f.write(".card p { font-size: 0.875rem; line-height: 1.5; }\n")
        f.write(".card small { font-size: 0.75rem; }\n\n")
        f.write("/* Sections — vertical rhythm */\n")
        f.write(".section { padding: var(--space-section) 0; }\n\n")
        f.write("/* Grids — layout */\n")
        f.write(".grid { display: grid; gap: var(--space-lg); }\n\n")
        f.write("/* Modals — overlay sizing */\n")
        f.write(".modal h2, .modal h3 { font-size: 1.25rem; }\n")
        f.write(".modal p { font-size: 1rem; }\n")
        f.write("```\n\n")
        
        # Detail by category
        for category in sorted(findings.keys()):
            items = findings[category]
            rule = BASE_CLASS_RULES[category]
            need = [x for x in items if not x['has_base']]
            have = [x for x in items if x['has_base']]
            
            f.write(f"---\n\n## `.{rule['base_class']}` — {rule['description']}\n\n")
            
            if need:
                f.write(f"### Need base class added ({len(need)})\n\n")
                f.write("| File | Line | Tag | Current class | Change to |\n")
                f.write("|------|------|-----|---------------|----------|\n")
                for item in sorted(need, key=lambda x: (x['file'], x['line'])):
                    new_class = f"{rule['base_class']} {item['class']}"
                    f.write(f"| {item['file']} | L{item['line']} | `<{item['tag']}>` | `{item['class']}` | `{new_class}` |\n")
                f.write("\n")
            
            if have:
                f.write(f"### Already have base class ({len(have)})\n\n")
                for item in sorted(have, key=lambda x: x['file']):
                    f.write(f"- {item['file']} L{item['line']}: `{item['class']}` ✅\n")
                f.write("\n")
        
        # Unique component classes found
        f.write("---\n\n## All Component Classes Found\n\n")
        f.write("Unique BEM block-level classes that matched a category:\n\n")
        seen = set()
        for category, items in sorted(findings.items()):
            rule = BASE_CLASS_RULES[category]
            for item in items:
                if item['class'] not in seen:
                    seen.add(item['class'])
                    status = "✅" if item['has_base'] else f"→ add `.{rule['base_class']}`"
                    f.write(f"- `{item['class']}` ({item['file'].split('/')[-1]}) {status}\n")
    
    return findings


def main():
    if len(sys.argv) < 2:
        print("Usage: python base_class_audit.py <src_dir>")
        sys.exit(1)
    
    root = sys.argv[1]
    if not os.path.isdir(root):
        print(f"Error: {root} is not a directory")
        sys.exit(1)
    
    print(f"Scanning {root} for components needing base classes...\n")
    
    findings, all_classes = process_directory(root)
    output_path = os.path.join(os.path.dirname(root), 'base_class_audit.md')
    generate_report(findings, output_path)
    
    total_need = sum(
        len([x for x in items if not x['has_base']])
        for items in findings.values()
    )
    
    print(f"{'='*50}")
    print(f"Base Class Audit")
    print(f"{'='*50}\n")
    
    for category in sorted(findings.keys()):
        items = findings[category]
        rule = BASE_CLASS_RULES[category]
        need = len([x for x in items if not x['has_base']])
        have = len([x for x in items if x['has_base']])
        print(f"  .{rule['base_class']:10} {need:>3} need it, {have:>3} already have it")
    
    print(f"\n  Total changes needed: {total_need}")
    print(f"\nReport: {output_path}")


if __name__ == '__main__':
    main()
