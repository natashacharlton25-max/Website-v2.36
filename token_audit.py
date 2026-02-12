#!/usr/bin/env python3
"""
Full CSS Token Audit
=====================
Scans ALL CSS custom property definitions and usages across the entire project.

Reports:
  1. DEFINED BUT NEVER USED — tokens defined but never referenced via var()
  2. USED BUT NEVER DEFINED — tokens referenced via var() but never defined
  3. NAMING MISMATCHES — likely old/wrong names with suggestions
  4. DUPLICATE DEFINITIONS — same token defined in multiple files
  5. TOKEN INVENTORY — full list grouped by category

Scans: .css, .astro, .html, .jsx, .tsx, .ts, .js, .scss, .svelte
Excludes: node_modules, dist, .git, .astro build cache

Usage: python token_audit.py <src_dir> [--report <output.md>]
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

EXCLUDE_FILES = set()  # Add specific files to skip if needed

# Regex: token definition  --token-name: value;
# Captures: (token-name, value)
RE_DEFINITION = re.compile(r'--([a-zA-Z][\w-]*)\s*:\s*([^;}{]+)')

# Regex: token usage  var(--token-name) or var(--token-name, fallback)
# Captures: (token-name)
RE_USAGE = re.compile(r'var\(\s*--([\w-]+)')

# Regex: comment lines
RE_COMMENT_LINE = re.compile(r'^\s*(?://|/\*|\*|<!--)')

# Known naming patterns — maps old/wrong names to likely correct ones
KNOWN_ALIASES = {
    'font-size-xs': 'text-xs',
    'font-size-sm': 'text-sm',
    'font-size-base': 'text-base',
    'font-size-lg': 'text-lg',
    'font-size-xl': 'text-xl',
    'font-size-2xl': 'text-2xl',
    'font-size-3xl': 'text-3xl',
    'font-size-4xl': 'text-4xl',
    'font-size-5xl': 'text-5xl',
    'font-size-6xl': 'text-6xl',
    'font-weight-bold': 'font-bold',
    'font-weight-medium': 'font-medium',
    'font-weight-semibold': 'font-semibold',
    'font-weight-normal': 'font-normal',
    'font-weight-light': 'font-light',
    'font-extra-bold': 'font-extrabold',
    'font-regular': 'font-normal',
    'tracking-wide': 'letter-spacing-wide',
    'tracking-wider': 'letter-spacing-wider',
    'tracking-normal': 'letter-spacing-normal',
    'tracking-tight': 'letter-spacing-tight',
    'color-Danger': 'color-Error',
    'color-secondary-500': 'brand-c-secondary',
}

# Token categories (prefix-based grouping)
TOKEN_CATEGORIES = [
    ('Brand Colour', ['brand-c-']),
    ('Status Colour', ['color-']),
    ('Confetti', ['confetti-']),
    ('Typography', ['font-', 'text-', 'leading-', 'letter-spacing-']),
    ('Spacing', ['space-', 'page-margin', 'container-']),
    ('Borders', ['border-', 'radius-']),
    ('Shadows', ['shadow-']),
    ('Glass', ['glass-']),
    ('Gradients', ['gradient-']),
    ('Images', ['img-', 'svg-']),
    ('Z-Index', ['z-']),
    ('Transitions', ['transition-', 'glint-']),
    ('Buttons', ['btn-']),
    ('Navigation', ['nav-']),
    ('Layout', ['body-', 'section-', 'spec-', 'selector-']),
    ('A11Y', ['a11y-']),
    ('Opacity', ['opacity-']),
    ('Aspect Ratio', ['aspect-']),
    ('Other', []),  # Catch-all
]


def categorise_token(name):
    """Assign a token to a category based on prefix"""
    for cat_name, prefixes in TOKEN_CATEGORIES:
        if not prefixes:  # 'Other' catch-all
            continue
        for prefix in prefixes:
            if name.startswith(prefix):
                return cat_name
    return 'Other'


def is_excluded(filepath, rel_path):
    filename = os.path.basename(filepath)
    if filename in EXCLUDE_FILES:
        return True
    parts = Path(rel_path).parts
    for part in parts:
        if part in EXCLUDE_DIRS:
            return True
    return False


def scan_file(filepath, project_root):
    """Scan a single file for token definitions and usages"""
    rel_path = os.path.relpath(filepath, project_root)

    if is_excluded(filepath, rel_path):
        return [], []

    ext = Path(filepath).suffix.lower()
    if ext not in SCAN_EXTENSIONS:
        return [], []

    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            lines = f.readlines()
    except Exception:
        return [], []

    definitions = []  # (token_name, value, rel_path, line_num)
    usages = []       # (token_name, rel_path, line_num)

    for i, line in enumerate(lines):
        line_num = i + 1

        # Skip pure comment lines
        if RE_COMMENT_LINE.match(line):
            # Still check for usages in comments (sometimes var() in comments)
            pass

        # Find definitions (only in CSS-like contexts)
        if ext in {'.css', '.scss', '.astro', '.html', '.svelte'}:
            for m in RE_DEFINITION.finditer(line):
                token_name = m.group(1)
                value = m.group(2).strip().rstrip(';').strip()

                # Skip if this looks like a :hover or other selector false positive
                # e.g. `--primary:hover {` isn't a definition
                if re.match(r'^(hover|focus|active|visited|checked|disabled)\b', value):
                    continue

                # Skip if inside a comment block
                before = line[:m.start()]
                if '/*' in before and '*/' not in before:
                    continue

                definitions.append((token_name, value, rel_path, line_num))

        # Find usages — in all file types
        for m in RE_USAGE.finditer(line):
            token_name = m.group(1)
            usages.append((token_name, rel_path, line_num))

    return definitions, usages


def find_suggestions(token_name, all_defined):
    """Find likely correct name for a misspelled/old token"""
    # Check known aliases
    if token_name in KNOWN_ALIASES:
        correct = KNOWN_ALIASES[token_name]
        if correct in all_defined:
            return correct

    # Try fuzzy: strip common prefixes and find similar
    # e.g. font-size-lg → text-lg
    return None


def generate_report(project_root, definitions, usages, output_path=None):
    """Generate the audit report"""

    # Build lookup structures
    defined_tokens = defaultdict(list)   # token_name → [(value, file, line), ...]
    used_tokens = defaultdict(list)      # token_name → [(file, line), ...]

    for token_name, value, filepath, line_num in definitions:
        defined_tokens[token_name].append((value, filepath, line_num))

    for token_name, filepath, line_num in usages:
        used_tokens[token_name].append((filepath, line_num))

    all_defined = set(defined_tokens.keys())
    all_used = set(used_tokens.keys())

    # ── Analysis ──

    defined_never_used = all_defined - all_used
    used_never_defined = all_used - all_defined

    # Find naming mismatches in used-never-defined
    naming_mismatches = {}  # old_name → (suggested, uses)
    truly_undefined = set()

    for token in sorted(used_never_defined):
        suggestion = find_suggestions(token, all_defined)
        if suggestion:
            naming_mismatches[token] = (suggestion, len(used_tokens[token]))
        else:
            truly_undefined.add(token)

    # Find tokens defined in multiple files with different values
    multi_defined = {}
    for token, defs in defined_tokens.items():
        if len(defs) > 1:
            unique_values = set(v for v, _, _ in defs)
            if len(unique_values) > 1:
                multi_defined[token] = defs

    # ── Build Report ──

    lines = []
    lines.append("# Full CSS Token Audit Report\n")
    lines.append(f"**Project:** `{project_root}`\n")
    lines.append(f"**Tokens defined:** {len(all_defined)}\n")
    lines.append(f"**Tokens used:** {len(all_used)}\n")
    lines.append("")

    # Executive Summary
    lines.append("## Executive Summary\n")
    lines.append("| Category | Count | Status |")
    lines.append("|----------|-------|--------|")
    lines.append(f"| Defined, never used | {len(defined_never_used)} | {'✅' if len(defined_never_used) == 0 else '🟡 TIDY'} |")
    lines.append(f"| Naming mismatches (old → correct) | {len(naming_mismatches)} | {'✅' if len(naming_mismatches) == 0 else '🟠 FIX'} |")
    lines.append(f"| Truly undefined (used, never defined) | {len(truly_undefined)} | {'✅' if len(truly_undefined) == 0 else '🟠 REVIEW'} |")
    lines.append(f"| Multi-defined (conflicting values) | {len(multi_defined)} | {'✅' if len(multi_defined) == 0 else '🟡 CHECK'} |")
    lines.append(f"| Total definitions | {len(definitions)} | ⚪ INFO |")
    lines.append(f"| Total var() references | {len(usages)} | ⚪ INFO |")
    lines.append("")

    # ── Section 1: Defined But Never Used ──
    lines.append("---\n")
    lines.append(f"## 1. Defined But Never Used ({len(defined_never_used)})\n")

    if defined_never_used:
        # Group by category
        by_category = defaultdict(list)
        for token in sorted(defined_never_used):
            cat = categorise_token(token)
            defs = defined_tokens[token]
            by_category[cat].append((token, defs))

        for cat_name, cat_tokens in sorted(by_category.items()):
            lines.append(f"\n### {cat_name} ({len(cat_tokens)})\n")
            lines.append("| Token | Value | File(s) |")
            lines.append("|-------|-------|---------|")
            for token, defs in cat_tokens:
                # Show first definition value (truncated)
                val = defs[0][0][:60]
                files = ', '.join(set(f for _, f, _ in defs))
                lines.append(f"| `--{token}` | `{val}` | {files} |")
    else:
        lines.append("✅ All defined tokens are used.\n")

    # ── Section 2: Naming Mismatches ──
    lines.append("\n---\n")
    lines.append(f"## 2. Naming Mismatches ({len(naming_mismatches)})\n")
    lines.append("These tokens are used but appear to be old/wrong names for existing tokens.\n")

    if naming_mismatches:
        lines.append("| Used (wrong) | Should be | Uses | Example locations |")
        lines.append("|-------------|-----------|------|-------------------|")
        for old_name, (correct, count) in sorted(naming_mismatches.items(), key=lambda x: -x[1][1]):
            examples = used_tokens[old_name][:3]
            ex_str = '; '.join(f"{f} L{l}" for f, l in examples)
            lines.append(f"| `--{old_name}` | `--{correct}` | {count} | {ex_str} |")
    else:
        lines.append("✅ No naming mismatches found.\n")

    # ── Section 3: Truly Undefined ──
    lines.append("\n---\n")
    lines.append(f"## 3. Used But Never Defined ({len(truly_undefined)})\n")
    lines.append("These tokens are referenced via var() but have no definition anywhere.\n")

    if truly_undefined:
        # Group by category
        by_category = defaultdict(list)
        for token in sorted(truly_undefined):
            cat = categorise_token(token)
            count = len(used_tokens[token])
            examples = used_tokens[token][:3]
            by_category[cat].append((token, count, examples))

        for cat_name, cat_tokens in sorted(by_category.items()):
            lines.append(f"\n### {cat_name} ({len(cat_tokens)})\n")
            lines.append("| Token | Uses | Example locations |")
            lines.append("|-------|------|-------------------|")
            for token, count, examples in sorted(cat_tokens, key=lambda x: -x[1]):
                ex_str = '; '.join(f"{f} L{l}" for f, l in examples)
                lines.append(f"| `--{token}` | {count} | {ex_str} |")
    else:
        lines.append("✅ All used tokens are defined.\n")

    # ── Section 4: Multi-Defined ──
    lines.append("\n---\n")
    lines.append(f"## 4. Multi-Defined with Different Values ({len(multi_defined)})\n")
    lines.append("Tokens defined in multiple places with conflicting values (theme overrides are expected).\n")

    if multi_defined:
        # Separate theme overrides from genuine conflicts
        theme_overrides = {}
        genuine_conflicts = {}

        for token, defs in sorted(multi_defined.items()):
            theme_files = [f for _, f, _ in defs if 'themes' in f or 'a11y' in f]
            non_theme = [f for _, f, _ in defs if 'themes' not in f and 'a11y' not in f]

            if len(non_theme) > 1:
                genuine_conflicts[token] = defs
            else:
                theme_overrides[token] = defs

        if genuine_conflicts:
            lines.append(f"\n### Genuine Conflicts ({len(genuine_conflicts)})\n")
            lines.append("| Token | Values | Files |")
            lines.append("|-------|--------|-------|")
            for token, defs in sorted(genuine_conflicts.items()):
                vals = '; '.join(f"`{v[:40]}`" for v, _, _ in defs)
                files = '; '.join(f"{f} L{l}" for _, f, l in defs)
                lines.append(f"| `--{token}` | {vals} | {files} |")

        lines.append(f"\n### Theme Overrides ({len(theme_overrides)}) — Expected\n")
        lines.append(f"_{len(theme_overrides)} tokens have per-theme values. This is correct._\n")
    else:
        lines.append("✅ No conflicting definitions.\n")

    # ── Section 5: Token Inventory by Category ──
    lines.append("\n---\n")
    lines.append("## 5. Token Inventory\n")

    by_category = defaultdict(list)
    for token in sorted(all_defined | all_used):
        cat = categorise_token(token)
        is_def = token in all_defined
        is_used = token in all_used
        use_count = len(used_tokens.get(token, []))
        by_category[cat].append((token, is_def, is_used, use_count))

    for cat_name, cat_tokens in sorted(by_category.items()):
        defined_count = sum(1 for _, d, _, _ in cat_tokens if d)
        used_count = sum(1 for _, _, u, _ in cat_tokens if u)
        lines.append(f"\n### {cat_name} ({len(cat_tokens)} tokens, {defined_count} defined, {used_count} used)\n")
        lines.append("| Token | Defined | Used | References |")
        lines.append("|-------|---------|------|------------|")
        for token, is_def, is_used, use_count in sorted(cat_tokens, key=lambda x: -x[3]):
            def_mark = '✅' if is_def else '❌'
            use_mark = f'{use_count}' if is_used else '—'
            status = ''
            if is_def and not is_used:
                status = ' 🗑️'
            elif not is_def and is_used:
                if token in naming_mismatches:
                    status = f' → `--{naming_mismatches[token][0]}`'
                else:
                    status = ' ⚠️ UNDEFINED'
            lines.append(f"| `--{token}` | {def_mark} | {use_mark} | {status} |")

    # ── Section 6: Usage Frequency Top 50 ──
    lines.append("\n---\n")
    lines.append("## 6. Most Used Tokens (Top 50)\n")
    lines.append("| Token | References | Defined |")
    lines.append("|-------|------------|---------|")

    top_used = sorted(used_tokens.items(), key=lambda x: -len(x[1]))[:50]
    for token, uses in top_used:
        is_def = '✅' if token in all_defined else '❌'
        lines.append(f"| `--{token}` | {len(uses)} | {is_def} |")

    report = '\n'.join(lines)

    if output_path:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(report)
        print(f"\nReport saved to: {output_path}")

    return report, {
        'defined': len(all_defined),
        'used': len(all_used),
        'defined_never_used': len(defined_never_used),
        'naming_mismatches': len(naming_mismatches),
        'truly_undefined': len(truly_undefined),
        'multi_defined': len(multi_defined),
        'total_definitions': len(definitions),
        'total_references': len(usages),
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: python token_audit.py <src_dir> [--report <output.md>]")
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
        else:
            output_path = os.path.join(os.path.dirname(root), 'token_audit_report.md')
    else:
        output_path = os.path.join(os.path.dirname(root), 'token_audit_report.md')

    print(f"Scanning {root} for all CSS custom properties...\n")

    all_definitions = []
    all_usages = []
    file_count = 0

    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for filename in files:
            filepath = os.path.join(dirpath, filename)
            defs, uses = scan_file(filepath, root)
            if defs or uses:
                all_definitions.extend(defs)
                all_usages.extend(uses)
                file_count += 1

    print(f"Scanned {file_count} files with token activity.")
    print(f"Found {len(all_definitions)} definitions, {len(all_usages)} var() references.\n")

    report, stats = generate_report(root, all_definitions, all_usages, output_path)

    # Print summary
    print("Executive Summary:")
    print(f"  Tokens defined:           {stats['defined']}")
    print(f"  Tokens used:              {stats['used']}")
    print(f"  Defined, never used:      {stats['defined_never_used']}")
    print(f"  Naming mismatches:        {stats['naming_mismatches']}")
    print(f"  Truly undefined:          {stats['truly_undefined']}")
    print(f"  Multi-defined conflicts:  {stats['multi_defined']}")
    print(f"  Total definitions:        {stats['total_definitions']}")
    print(f"  Total var() references:   {stats['total_references']}")


if __name__ == '__main__':
    main()
