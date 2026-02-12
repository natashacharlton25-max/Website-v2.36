#!/usr/bin/env python3
"""
Semantic Typography Audit
==========================
Finds components using raw --text-* size tokens directly in CSS
instead of inheriting from semantic HTML elements (h1-h6, p).

Reports:
  1. Every font-size: var(--text-*) usage with file/line/selector
  2. Maps each token to which heading level it corresponds to
  3. Flags components that should be using semantic elements
  4. Summary of how many raw references vs semantic inheritance

Also audits:
  - font-family: var(--font-heading/body) set explicitly (should inherit)
  - font-weight: var(--font-*) that duplicates the heading default
  - line-height: var(--leading-*) that duplicates the heading default

Usage: python semantic_typography_audit.py <src_dir> [--report <output.md>]
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict

# ─── Configuration ───────────────────────────────────────────────────────────

SCAN_EXTENSIONS = {'.css', '.astro', '.html', '.svelte'}

EXCLUDE_DIRS = {
    'node_modules', '.git', 'dist', '.astro', 'Preview',
    'ThemeTokenGen', '__pycache__',
}

# Files that legitimately define base styles (not components)
BASE_STYLE_FILES = {
    'global.css', 'reset.css', 'typography.css', 'utilities.css',
    'micro.css', 'xs.css', 'phone.css', 'tablet.css', 'desktop.css', 'max.css',
}

# The heading → token mapping from global.css
HEADING_MAP = {
    '--text-7xl': {'element': 'h1', 'also': 'blockquote', 'weight': '--font-extrabold', 'line-height': '--leading-tight'},
    '--text-5xl': {'element': 'h2', 'weight': '--font-semibold', 'line-height': '--leading-tight'},
    '--text-4xl': {'element': 'h3', 'weight': '--font-semibold', 'line-height': '--leading-snug'},
    '--text-lg':  {'element': 'h4 / p', 'weight': '--font-medium', 'line-height': '--leading-snug'},
    '--text-base': {'element': 'h5', 'weight': '--font-medium', 'line-height': '--leading-snug'},
    '--text-sm':  {'element': 'h6 / small', 'weight': '--font-bold', 'line-height': '--leading-snug'},
}

# All text size tokens
TEXT_SIZE_TOKENS = [
    '--text-2xs', '--text-xs', '--text-sm', '--text-base',
    '--text-md', '--text-lg', '--text-xl', '--text-2xl',
    '--text-3xl', '--text-4xl', '--text-5xl', '--text-6xl', '--text-7xl',
]

# Regex patterns
RE_FONT_SIZE = re.compile(r'font-size\s*:\s*var\(\s*(--text-[\w-]+)')
RE_FONT_FAMILY = re.compile(r'font-family\s*:\s*var\(\s*(--font-(?:heading|body|special|secondary))')
RE_FONT_WEIGHT = re.compile(r'font-weight\s*:\s*var\(\s*(--font-[\w-]+)')
RE_LINE_HEIGHT = re.compile(r'line-height\s*:\s*var\(\s*(--leading-[\w-]+)')
RE_SELECTOR = re.compile(r'^([^{/]+)\{')
RE_COMMENT = re.compile(r'/\*.*?\*/', re.DOTALL)


def is_base_file(filepath):
    """Check if file is a base/system file rather than a component"""
    name = os.path.basename(filepath)
    return name in BASE_STYLE_FILES


def extract_selector_context(lines, target_line_idx):
    """Walk backwards from a line to find the nearest CSS selector"""
    for i in range(target_line_idx, -1, -1):
        line = lines[i].strip()
        # Skip empty lines and pure property lines
        if not line or line.startswith('/*') or (': ' in line and not '{' in line):
            continue
        # Found a selector line
        m = RE_SELECTOR.match(line)
        if m:
            return m.group(1).strip()
        # Check if line contains selector chars
        if '{' in line:
            return line.split('{')[0].strip()
    return '(unknown)'


def scan_file(filepath, project_root):
    """Scan a file for raw typography token usage"""
    rel_path = os.path.relpath(filepath, project_root).replace('\\', '/')
    
    # Skip excluded dirs
    parts = Path(rel_path).parts
    for part in parts:
        if part in EXCLUDE_DIRS:
            return []

    ext = Path(filepath).suffix.lower()
    if ext not in SCAN_EXTENSIONS:
        return []

    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
            lines = content.split('\n')
    except Exception:
        return []

    findings = []
    is_base = is_base_file(filepath)

    # Track if we're inside a <style> tag (for .astro files)
    in_style = ext == '.css'  # CSS files are always "in style"

    for i, line in enumerate(lines):
        # Track style blocks in astro/html files
        if ext in {'.astro', '.html', '.svelte'}:
            if '<style' in line:
                in_style = True
            if '</style>' in line:
                in_style = False

        if not in_style:
            continue

        line_num = i + 1

        # Check font-size: var(--text-*)
        for m in RE_FONT_SIZE.finditer(line):
            token = m.group(1)
            selector = extract_selector_context(lines, i)
            heading_info = HEADING_MAP.get(token)
            
            findings.append({
                'type': 'font-size',
                'token': token,
                'file': rel_path,
                'line': line_num,
                'selector': selector,
                'is_base': is_base,
                'semantic_element': heading_info['element'] if heading_info else None,
                'raw_line': line.strip(),
            })

        # Check font-family: var(--font-heading/body)
        for m in RE_FONT_FAMILY.finditer(line):
            token = m.group(1)
            selector = extract_selector_context(lines, i)
            findings.append({
                'type': 'font-family',
                'token': token,
                'file': rel_path,
                'line': line_num,
                'selector': selector,
                'is_base': is_base,
                'semantic_element': None,
                'raw_line': line.strip(),
            })

        # Check font-weight: var(--font-*)
        for m in RE_FONT_WEIGHT.finditer(line):
            token = m.group(1)
            selector = extract_selector_context(lines, i)
            findings.append({
                'type': 'font-weight',
                'token': token,
                'file': rel_path,
                'line': line_num,
                'selector': selector,
                'is_base': is_base,
                'semantic_element': None,
                'raw_line': line.strip(),
            })

    return findings


def generate_report(project_root, findings, output_path):
    """Generate the semantic typography audit report"""
    
    # Separate base definitions from component usage
    base_findings = [f for f in findings if f['is_base']]
    component_findings = [f for f in findings if not f['is_base']]
    
    # ── Analysis ──
    
    # font-size usage in components
    size_findings = [f for f in component_findings if f['type'] == 'font-size']
    family_findings = [f for f in component_findings if f['type'] == 'font-family']
    weight_findings = [f for f in component_findings if f['type'] == 'font-weight']
    
    # Group by token
    by_token = defaultdict(list)
    for f in size_findings:
        by_token[f['token']].append(f)
    
    # Group by file
    by_file = defaultdict(list)
    for f in size_findings:
        by_file[f['file']].append(f)
    
    # Count semantic-mapped vs non-mapped
    has_semantic = [f for f in size_findings if f['semantic_element']]
    no_semantic = [f for f in size_findings if not f['semantic_element']]
    
    lines = []
    lines.append("# Semantic Typography Audit\n")
    lines.append(f"**Project:** `{project_root}`\n")
    lines.append("")
    
    # ── Executive Summary ──
    lines.append("## Executive Summary\n")
    lines.append("| Metric | Count |")
    lines.append("|--------|-------|")
    lines.append(f"| Total font-size: var(--text-*) in components | {len(size_findings)} |")
    lines.append(f"| ↳ Could use semantic element (h1-h6, p) instead | {len(has_semantic)} |")
    lines.append(f"| ↳ Uses sizes not mapped to headings (fine) | {len(no_semantic)} |")
    lines.append(f"| font-family set explicitly in components | {len(family_findings)} |")
    lines.append(f"| font-weight set explicitly in components | {len(weight_findings)} |")
    lines.append(f"| Components with raw size tokens | {len(by_file)} |")
    lines.append(f"| Base/system definitions (expected) | {len(base_findings)} |")
    lines.append("")
    
    # ── Heading map reference ──
    lines.append("## Heading → Token Reference (from global.css)\n")
    lines.append("| Element | font-size | font-weight | line-height |")
    lines.append("|---------|-----------|-------------|-------------|")
    lines.append("| h1 | `--text-7xl` | `--font-extrabold` | `--leading-tight` |")
    lines.append("| h2 | `--text-5xl` | `--font-semibold` | `--leading-tight` |")
    lines.append("| h3 | `--text-4xl` | `--font-semibold` | `--leading-snug` |")
    lines.append("| h4 | `--text-lg` | `--font-medium` | `--leading-snug` |")
    lines.append("| h5 | `--text-base` | `--font-medium` | `--leading-snug` |")
    lines.append("| h6 | `--text-sm` | `--font-bold` | `--leading-snug` |")
    lines.append("| p | `--text-lg` | (inherited) | `--leading-relaxed` |")
    lines.append("| blockquote | `--text-7xl` | `--font-semibold` | `--leading-relaxed` |")
    lines.append("")
    
    # ── Section 1: Raw size tokens that have semantic equivalents ──
    lines.append("---\n")
    lines.append(f"## 1. Should Use Semantic Elements ({len(has_semantic)} usages)\n")
    lines.append("These set font-size to a token that matches a heading/body level.\n")
    lines.append("**Instead of** `font-size: var(--text-5xl)` → **use** `<h2>` and inherit.\n")
    
    # Group by token, sorted by heading level
    heading_order = ['--text-7xl', '--text-5xl', '--text-4xl', '--text-lg', '--text-base', '--text-sm']
    
    for token in heading_order:
        if token not in by_token:
            continue
        token_findings = by_token[token]
        info = HEADING_MAP[token]
        element = info['element']
        
        lines.append(f"\n### `{token}` → should be `<{element}>` ({len(token_findings)} usages)\n")
        lines.append("| File | Line | Selector |")
        lines.append("|------|------|----------|")
        for f in sorted(token_findings, key=lambda x: (x['file'], x['line'])):
            lines.append(f"| {f['file']} | L{f['line']} | `{f['selector'][:80]}` |")
    
    # ── Section 2: Non-heading sizes (these are fine) ──
    lines.append("\n---\n")
    lines.append(f"## 2. Non-Heading Sizes ({len(no_semantic)} usages) — Likely Fine\n")
    lines.append("These use sizes that don't map 1:1 to heading levels (--text-xs, --text-xl, --text-2xl, --text-3xl, --text-6xl).\n")
    lines.append("Some may still be candidates for utility classes.\n")
    
    non_heading_tokens = sorted(set(f['token'] for f in no_semantic))
    for token in non_heading_tokens:
        token_findings = [f for f in no_semantic if f['token'] == token]
        lines.append(f"\n### `{token}` ({len(token_findings)} usages)\n")
        lines.append("| File | Line | Selector |")
        lines.append("|------|------|----------|")
        for f in sorted(token_findings, key=lambda x: (x['file'], x['line'])):
            lines.append(f"| {f['file']} | L{f['line']} | `{f['selector'][:80]}` |")

    # ── Section 3: Redundant font-family ──
    lines.append("\n---\n")
    lines.append(f"## 3. Explicit font-family in Components ({len(family_findings)})\n")
    lines.append("These set font-family explicitly. If using semantic elements, this inherits from global.css.\n")
    lines.append("`font-family: var(--font-heading)` is only needed if the element isn't h1-h6.\n")
    
    if family_findings:
        lines.append("\n| File | Line | Selector | Token |")
        lines.append("|------|------|----------|-------|")
        for f in sorted(family_findings, key=lambda x: (x['file'], x['line'])):
            lines.append(f"| {f['file']} | L{f['line']} | `{f['selector'][:60]}` | `{f['token']}` |")
    else:
        lines.append("\n✅ No redundant font-family declarations.\n")

    # ── Section 4: font-weight in components ──
    lines.append("\n---\n")
    lines.append(f"## 4. Explicit font-weight in Components ({len(weight_findings)})\n")
    lines.append("Components setting font-weight. If using semantic headings, only needed for overrides.\n")
    
    if weight_findings:
        # Group by token
        weight_by_token = defaultdict(list)
        for f in weight_findings:
            weight_by_token[f['token']].append(f)
        
        for token, token_findings in sorted(weight_by_token.items(), key=lambda x: -len(x[1])):
            lines.append(f"\n### `{token}` ({len(token_findings)} usages)\n")
            lines.append("| File | Line | Selector |")
            lines.append("|------|------|----------|")
            for f in sorted(token_findings, key=lambda x: (x['file'], x['line'])):
                lines.append(f"| {f['file']} | L{f['line']} | `{f['selector'][:80]}` |")
    
    # ── Section 5: Worst offenders (files with most raw tokens) ──
    lines.append("\n---\n")
    lines.append(f"## 5. Files with Most Raw Size Tokens (Top 30)\n")
    lines.append("| File | Raw font-size calls | Tokens used |")
    lines.append("|------|--------------------:|-------------|")
    
    for filepath, file_findings in sorted(by_file.items(), key=lambda x: -len(x[1]))[:30]:
        tokens = sorted(set(f['token'] for f in file_findings))
        token_str = ', '.join(f'`{t}`' for t in tokens)
        lines.append(f"| {filepath} | {len(file_findings)} | {token_str} |")
    
    # ── Section 6: Token frequency ──
    lines.append("\n---\n")
    lines.append("## 6. Token Usage Frequency (in components)\n")
    lines.append("| Token | Component uses | Maps to | Action |")
    lines.append("|-------|---------------:|---------|--------|")
    
    for token in TEXT_SIZE_TOKENS:
        count = len(by_token.get(token, []))
        if count == 0:
            continue
        info = HEADING_MAP.get(token)
        if info:
            maps_to = f"`<{info['element']}>`"
            action = "Use semantic element"
        else:
            maps_to = "—"
            action = "Keep / utility class"
        lines.append(f"| `{token}` | {count} | {maps_to} | {action} |")
    
    report = '\n'.join(lines)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"\nReport saved to: {output_path}")
    
    # Print summary
    print(f"\nSemantic Typography Audit Summary:")
    print(f"  Total font-size: var(--text-*) in components: {len(size_findings)}")
    print(f"  Could use semantic element instead:           {len(has_semantic)}")
    print(f"  Non-heading sizes (likely fine):              {len(no_semantic)}")
    print(f"  Explicit font-family in components:           {len(family_findings)}")
    print(f"  Explicit font-weight in components:           {len(weight_findings)}")
    print(f"  Files with raw size tokens:                   {len(by_file)}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python semantic_typography_audit.py <src_dir> [--report <output.md>]")
        sys.exit(1)

    root = sys.argv[1]

    if not os.path.isdir(root):
        print(f"Error: {root} is not a directory")
        sys.exit(1)

    output_path = None
    if '--report' in sys.argv:
        idx = sys.argv.index('--report')
        if idx + 1 < len(sys.argv):
            output_path = sys.argv[idx + 1]
    
    if not output_path:
        output_path = os.path.join(os.path.dirname(root), 'semantic_typography_audit.md')

    print(f"Scanning {root} for raw typography token usage...\n")

    all_findings = []
    file_count = 0

    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for filename in files:
            filepath = os.path.join(dirpath, filename)
            findings = scan_file(filepath, root)
            if findings:
                all_findings.extend(findings)
                file_count += 1

    print(f"Scanned {file_count} files with typography usage.")

    generate_report(root, all_findings, output_path)


if __name__ == '__main__':
    main()
