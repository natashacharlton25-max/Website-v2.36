#!/usr/bin/env python3
"""
CSS Colour Audit Script — Source Only
=======================================
Same as colour_audit.py but excludes docs, reports, .md files,
audit outputs, and changelogs to show only real source issues.

Usage:
    python colour_audit_src.py src
    python colour_audit_src.py src --output report.md
"""

import os
import re
import sys
import argparse
from collections import defaultdict
from pathlib import Path

# ── SCAN ONLY SOURCE FILES ───────────────────────────────────────────────────
SCAN_EXTENSIONS = {
    '.astro', '.css', '.scss',
    '.js', '.jsx', '.ts', '.tsx',
    '.html', '.htm',
}

# ── Directories to skip ──────────────────────────────────────────────────────
SKIP_DIRS = {
    'node_modules', '.git', 'dist', '.output', '.astro',
    '__pycache__', '.vscode', '.idea', 'build', '.cache',
    '.netlify', '.vercel',
    'docs', 'reports', 'Preview',
}

# ── Files to exclude ─────────────────────────────────────────────────────────
EXCLUDE_PATTERNS = {
    'audit', 'report', 'changelog', 'FIXES', 'README',
    'colour_audit', 'fix_a11y',
}

EXCLUDE_EXTENSIONS = {'.md', '.mdx', '.txt', '.json', '.log'}

# Generator files — report separately
GENERATOR_MARKERS = {'ThemeTokenGen', 'brand-template.css', 'simple-theme-gen',
                     'generate-core-tokens'}

# ── Colours to ignore ────────────────────────────────────────────────────────
IGNORE_COLOURS = {'inherit', 'currentcolor', 'currentColor', 'transparent',
                  'none', 'unset', 'initial', 'revert'}

CSS_NAMED_COLOURS = {
    'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure',
    'beige', 'bisque', 'black', 'blanchedalmond', 'blue',
    'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse',
    'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson',
    'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray',
    'darkgrey', 'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen',
    'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen',
    'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise',
    'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey',
    'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia',
    'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'grey',
    'green', 'greenyellow', 'honeydew', 'hotpink', 'indianred',
    'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush',
    'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan',
    'lightgoldenrodyellow', 'lightgray', 'lightgrey', 'lightgreen',
    'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue',
    'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow',
    'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine',
    'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen',
    'mediumslateblue', 'mediumspringgreen', 'mediumturquoise',
    'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose',
    'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab',
    'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen',
    'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru',
    'pink', 'plum', 'powderblue', 'purple', 'rebeccapurple', 'red',
    'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown',
    'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue',
    'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue',
    'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat',
    'white', 'whitesmoke', 'yellow', 'yellowgreen',
    'transparent', 'currentcolor', 'currentColor', 'inherit',
}

# ── MIGRATION PATTERNS ───────────────────────────────────────────────────────
RE_OLD_SCALE = re.compile(
    r'--color-(?:Primary|Secondary|AccentOne|AccentTwo|AccentThree|AccentFour|AccentFive'
    r'|Background|BackgroundDark|Text|Neutral|Success|Warning|Error|Info'
    r')-\d{2,3}\b'
)
RE_OLD_ACCENT_TOKEN = re.compile(
    r'--[\w-]*(?:accent[1-5]|AccentOne|AccentTwo|AccentThree|AccentFour|AccentFive)[\w-]*'
)
RE_OLD_ACCENT_CLASS = re.compile(r'\baccent[1-5]\b')
RE_OLD_A11Y = re.compile(r'--a11y-[\w-]+-c-[\w-]+')
RE_OLD_GRADIENT = re.compile(r'--gradient-(?:rainbow|pastel|vivid|deep|accent[3-5])[\w-]*')

# ── GENERAL PATTERNS ─────────────────────────────────────────────────────────
RE_TOKEN_DEFINITION = re.compile(r'(--[\w-]+)\s*:\s*([^;}\n]+)')
RE_TOKEN_USAGE = re.compile(r'var\(\s*(--[\w-]+)(?:\s*,\s*[^)]+)?\s*\)')
RE_HEX = re.compile(r'(?<![&\w])#([0-9a-fA-F]{3,8})\b')
RE_RGB = re.compile(r'\brgba?\s*\([^)]+\)', re.IGNORECASE)
RE_HSL = re.compile(r'\bhsla?\s*\([^)]+\)', re.IGNORECASE)
RE_OKLCH = re.compile(r'\boklch\s*\([^)]+\)', re.IGNORECASE)
RE_COLOR_MIX = re.compile(r'\bcolor-mix\s*\([^)]+\)', re.IGNORECASE)
RE_INLINE_STYLE = re.compile(r'style\s*=\s*["\']([^"\']*)["\']', re.IGNORECASE)

COLOUR_PROPERTIES = [
    'color', 'colour', 'background', 'background-color', 'border-color',
    'border-top-color', 'border-right-color', 'border-bottom-color',
    'border-left-color', 'outline-color', 'text-decoration-color',
    'fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color',
    'box-shadow', 'text-shadow', 'border', 'outline',
    'column-rule-color', 'caret-color', 'accent-color',
]


def is_excluded(filepath, rel_path):
    filename = os.path.basename(filepath).lower()
    ext = Path(filepath).suffix.lower()
    if ext in EXCLUDE_EXTENSIONS:
        return True
    for pat in EXCLUDE_PATTERNS:
        if pat.lower() in filename:
            return True
    return False


def is_generator_file(filepath):
    return any(marker in filepath for marker in GENERATOR_MARKERS)


def should_scan(filepath):
    return Path(filepath).suffix.lower() in SCAN_EXTENSIONS


def is_colour_token(name):
    indicators = [
        'color', 'colour', 'bg', 'background', 'text', 'border',
        'fill', 'stroke', 'shadow', 'primary', 'secondary', 'accent',
        'neutral', 'surface', 'brand', 'link', 'hover', 'active',
        'focus', 'disabled', 'error', 'warning', 'success', 'info',
        'highlight', 'muted', 'subtle', 'overlay', 'gradient', 'confetti',
    ]
    return any(ind in name.lower() for ind in indicators)


def is_colour_value(value):
    value = value.strip()
    return (RE_HEX.search(value) or RE_RGB.search(value) or
            RE_HSL.search(value) or RE_OKLCH.search(value) or
            value.lower() in CSS_NAMED_COLOURS)


def is_in_comment(line, stripped):
    return (stripped.startswith('//') or stripped.startswith('/*') or
            stripped.startswith('*') or stripped.startswith('<!--'))


def scan_file(filepath, project_root):
    rel_path = os.path.relpath(filepath, project_root)
    is_gen = is_generator_file(rel_path)

    results = {
        'token_definitions': [],
        'token_usages': [],
        'hardcoded_hex': [],
        'hardcoded_rgb': [],
        'hardcoded_hsl': [],
        'hardcoded_oklch': [],
        'hardcoded_color_mix': [],
        'hardcoded_named': [],
        'inline_styles': [],
        'old_scale_tokens': [],
        'old_accent_refs': [],
        'old_a11y_tokens': [],
        'old_gradients': [],
        'is_generator': is_gen,
    }

    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            file_lines = f.readlines()
    except (IOError, OSError):
        return rel_path, results

    for line_num, line in enumerate(file_lines, 1):
        stripped = line.strip()
        in_comment = is_in_comment(line, stripped)

        # Migration checks (even in comments for awareness)
        for match in RE_OLD_SCALE.finditer(line):
            results['old_scale_tokens'].append(
                (match.group(0), line_num, stripped[:120], in_comment))

        for match in RE_OLD_ACCENT_TOKEN.finditer(line):
            results['old_accent_refs'].append(
                (match.group(0), line_num, stripped[:120], 'token', in_comment))
        for match in RE_OLD_ACCENT_CLASS.finditer(line):
            prefix = line[:match.start()]
            if '--' not in prefix[-30:]:
                results['old_accent_refs'].append(
                    (match.group(0), line_num, stripped[:120], 'class/prop', in_comment))

        for match in RE_OLD_A11Y.finditer(line):
            results['old_a11y_tokens'].append(
                (match.group(0), line_num, stripped[:120], in_comment))

        for match in RE_OLD_GRADIENT.finditer(line):
            results['old_gradients'].append(
                (match.group(0), line_num, stripped[:120], in_comment))

        if in_comment:
            continue

        # Token definitions
        for match in RE_TOKEN_DEFINITION.finditer(line):
            token_name = match.group(1)
            token_value = match.group(2).strip().rstrip(';').strip()
            if is_colour_token(token_name) or is_colour_value(token_value):
                results['token_definitions'].append(
                    (token_name, token_value, line_num))

        # Token usage
        for match in RE_TOKEN_USAGE.finditer(line):
            results['token_usages'].append(
                (match.group(1), line_num, stripped[:120]))

        # Hardcoded hex — skip inside token definitions and var() fallbacks
        # First, find token def positions on this line
        token_def_ranges = []
        for td in RE_TOKEN_DEFINITION.finditer(line):
            val_start = td.start(2)
            val_end = td.end(2)
            token_def_ranges.append((val_start, val_end, td.group(1)))

        for match in RE_HEX.finditer(line):
            hex_val = f'#{match.group(1)}'
            prefix = line[:match.start()]
            if any(skip in prefix.lower() for skip in ['url(', 'data:', 'id=', 'href=']):
                continue
            if line[match.start():].startswith('#a11y'):
                continue
            # Skip hex inside var() as fallback e.g. var(--token, #fff)
            if re.search(r'var\([^)]*$', prefix):
                continue
            # Skip hex inside a token definition value (it's the definition, not hardcoded)
            in_token_def = False
            for vs, ve, tn in token_def_ranges:
                if vs <= match.start() <= ve:
                    in_token_def = True
                    break
            if in_token_def:
                continue
            results['hardcoded_hex'].append(
                (hex_val, line_num, stripped[:120]))

        # RGB/RGBA — skip inside token definitions
        for match in RE_RGB.finditer(line):
            in_token_def = False
            for vs, ve, tn in token_def_ranges:
                if vs <= match.start() <= ve:
                    in_token_def = True
                    break
            if in_token_def:
                continue
            results['hardcoded_rgb'].append(
                (match.group(0), line_num, stripped[:120]))

        # HSL/HSLA — skip inside token definitions
        for match in RE_HSL.finditer(line):
            in_token_def = False
            for vs, ve, tn in token_def_ranges:
                if vs <= match.start() <= ve:
                    in_token_def = True
                    break
            if in_token_def:
                continue
            results['hardcoded_hsl'].append(
                (match.group(0), line_num, stripped[:120]))

        # OKLCH — skip inside token definitions
        for match in RE_OKLCH.finditer(line):
            in_token_def = False
            for vs, ve, tn in token_def_ranges:
                if vs <= match.start() <= ve:
                    in_token_def = True
                    break
            if in_token_def:
                continue
            results['hardcoded_oklch'].append(
                (match.group(0), line_num, stripped[:120]))

        # color-mix — skip if it uses tokens (var(--) inside), only flag fully hardcoded ones
        for match in RE_COLOR_MIX.finditer(line):
            val = match.group(0)
            if 'var(--' in val:
                continue  # Using tokens — not hardcoded
            in_token_def = False
            for vs, ve, tn in token_def_ranges:
                if vs <= match.start() <= ve:
                    in_token_def = True
                    break
            if in_token_def:
                continue
            results['hardcoded_color_mix'].append(
                (val, line_num, stripped[:120]))

        # Named colours — skip matches inside var() and token names
        line_lower = line.lower()
        for colour_prop in COLOUR_PROPERTIES:
            if colour_prop in line_lower:
                for named in CSS_NAMED_COLOURS:
                    if named.lower() in IGNORE_COLOURS:
                        continue
                    pattern = re.compile(r'\b' + re.escape(named) + r'\b', re.IGNORECASE)
                    for m in pattern.finditer(line):
                        # Skip if inside a var() reference e.g. var(--color-White)
                        before = line[:m.end()]
                        if re.search(r'var\([^)]*$', before):
                            continue
                        # Skip if part of a CSS custom property name e.g. --color-White:
                        if re.search(r'--[\w-]*$', line[:m.start()]):
                            continue
                        results['hardcoded_named'].append(
                            (named, line_num, stripped[:120]))
                break

        # Inline styles
        for match in RE_INLINE_STYLE.finditer(line):
            style_content = match.group(1)
            if is_colour_value(style_content) or any(
                cp in style_content.lower() for cp in COLOUR_PROPERTIES
            ):
                results['inline_styles'].append((style_content, line_num))

    return rel_path, results


def run_audit(project_root):
    all_results = {}
    file_count = 0
    skipped = 0

    for root, dirs, files in os.walk(project_root):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for filename in files:
            filepath = os.path.join(root, filename)
            rel_path = os.path.relpath(filepath, project_root)

            if not should_scan(filepath):
                continue
            if is_excluded(filepath, rel_path):
                skipped += 1
                continue

            file_count += 1
            rel_path, results = scan_file(filepath, project_root)
            has_findings = any(v for k, v in results.items() if k != 'is_generator')
            if has_findings:
                all_results[rel_path] = results

    return all_results, file_count, skipped


def generate_report(all_results, file_count, skipped, project_root):
    lines = []
    ln = lines.append

    # Aggregate
    all_definitions = {}
    all_usages = defaultdict(list)
    all_hardcoded = defaultdict(list)
    hardcoded_by_file = defaultdict(list)
    inline_style_locations = []
    colour_token_defs = {}

    migration_old_scale = []
    migration_old_accent = []
    migration_old_a11y = []
    migration_old_gradient = []
    generator_findings = []

    for filepath, results in all_results.items():
        is_gen = results.get('is_generator', False)

        for token, lno, ctx, in_comment in results.get('old_scale_tokens', []):
            entry = (token, filepath, lno, ctx, in_comment)
            if is_gen:
                generator_findings.append(('old_scale', *entry))
            else:
                migration_old_scale.append(entry)

        for ref, lno, ctx, rtype, in_comment in results.get('old_accent_refs', []):
            entry = (ref, filepath, lno, ctx, rtype, in_comment)
            if is_gen:
                generator_findings.append(('old_accent', ref, filepath, lno, ctx, in_comment))
            else:
                migration_old_accent.append(entry)

        for token, lno, ctx, in_comment in results.get('old_a11y_tokens', []):
            entry = (token, filepath, lno, ctx, in_comment)
            if is_gen:
                generator_findings.append(('old_a11y', *entry))
            else:
                migration_old_a11y.append(entry)

        for token, lno, ctx, in_comment in results.get('old_gradients', []):
            entry = (token, filepath, lno, ctx, in_comment)
            if is_gen:
                generator_findings.append(('old_gradient', *entry))
            else:
                migration_old_gradient.append(entry)

        for token_name, value, lno in results['token_definitions']:
            if token_name not in all_definitions:
                all_definitions[token_name] = []
            all_definitions[token_name].append((filepath, value, lno))
            colour_token_defs[token_name] = value

        for token_name, lno, context in results['token_usages']:
            all_usages[token_name].append((filepath, lno, context))

        for cat in ('hardcoded_hex', 'hardcoded_rgb', 'hardcoded_hsl',
                     'hardcoded_oklch', 'hardcoded_color_mix'):
            label = cat.replace('hardcoded_', '')
            for value, lno, context in results.get(cat, []):
                all_hardcoded[value.lower()].append((filepath, lno, context))
                hardcoded_by_file[filepath].append((value, lno, label))

        for value, lno, context in results.get('hardcoded_named', []):
            all_hardcoded[value.lower()].append((filepath, lno, context))
            hardcoded_by_file[filepath].append((value, lno, 'named'))

        for style, lno in results['inline_styles']:
            inline_style_locations.append((filepath, lno, style))

    # Defined never used / used never defined
    defined_never_used = []
    for tn in all_definitions:
        if tn not in all_usages:
            for fp, val, lno in all_definitions[tn]:
                defined_never_used.append((tn, val, fp, lno))

    used_never_defined = []
    for tn in all_usages:
        if tn not in all_definitions:
            used_never_defined.append((tn, len(all_usages[tn]), all_usages[tn][:3]))

    # Migration counts
    scale_code = [x for x in migration_old_scale if not x[4]]
    scale_comments = [x for x in migration_old_scale if x[4]]
    accent_code = [x for x in migration_old_accent if not x[5]]
    accent_comments = [x for x in migration_old_accent if x[5]]
    a11y_code = [x for x in migration_old_a11y if not x[4]]
    a11y_comments = [x for x in migration_old_a11y if x[4]]
    gradient_code = [x for x in migration_old_gradient if not x[4]]

    total_migration = len(scale_code) + len(accent_code) + len(a11y_code) + len(gradient_code)
    total_hardcoded = sum(len(v) for v in all_hardcoded.values())

    # ═════════════════════════════════════════════════════════════════════
    # REPORT
    # ═════════════════════════════════════════════════════════════════════

    ln('# CSS Colour Audit Report — SOURCE ONLY')
    ln('')
    ln(f'**Project:** `{project_root}`')
    ln(f'**Source files scanned:** {file_count}')
    ln(f'**Files excluded (docs/reports/md):** {skipped}')
    ln(f'**Files with findings:** {len(all_results)}')
    ln('')

    # Executive Summary
    ln('## Executive Summary')
    ln('')
    ln('| Category | Count | Status |')
    ln('|----------|-------|--------|')
    ln(f'| Old scale tokens (code) | {len(scale_code)} | {"✅" if not scale_code else "🔴 FIX"} |')
    ln(f'| Old scale tokens (comments) | {len(scale_comments)} | {"✅" if not scale_comments else "🟡 TIDY"} |')
    ln(f'| Old accent refs (code) | {len(accent_code)} | {"✅" if not accent_code else "🔴 FIX"} |')
    ln(f'| Old accent refs (comments) | {len(accent_comments)} | {"✅" if not accent_comments else "🟡 TIDY"} |')
    ln(f'| Old a11y tokens (code) | {len(a11y_code)} | {"✅" if not a11y_code else "🔴 FIX"} |')
    ln(f'| Old a11y tokens (comments) | {len(a11y_comments)} | {"✅" if not a11y_comments else "🟡 TIDY"} |')
    ln(f'| Old gradient tokens | {len(gradient_code)} | {"✅" if not gradient_code else "🔴 FIX"} |')
    ln(f'| Generator refs (excluded) | {len(generator_findings)} | ⚪ INFO |')
    ln(f'| Hardcoded colours | {total_hardcoded} | {"✅" if not total_hardcoded else "🟠 REVIEW"} |')
    ln(f'| Inline colour styles | {len(inline_style_locations)} | {"✅" if not inline_style_locations else "🟠 REVIEW"} |')
    ln(f'| Defined, never used | {len(defined_never_used)} | {"✅" if not defined_never_used else "🟡 TIDY"} |')
    ln(f'| Used, never defined | {len(used_never_defined)} | {"✅" if not used_never_defined else "🟡 CHECK"} |')
    ln(f'| Unique tokens defined | {len(all_definitions)} | ⚪ INFO |')
    ln(f'| Token var() references | {sum(len(v) for v in all_usages.values())} | ⚪ INFO |')
    ln('')

    # ═════════════════════════════════════════════════════════════════════
    # PART 1: MIGRATION
    # ═════════════════════════════════════════════════════════════════════
    ln('---')
    ln('')
    ln('# Part 1: Migration Issues')
    ln('')
    if total_migration == 0:
        ln('✅ **No migration issues in source code.**')
        ln('')
    else:
        ln(f'⚠️ **{total_migration} migration issues in source code.**')
        ln('')

    # M1 Old Scale
    ln('## M1. Old Scale Tokens')
    ln('')
    if scale_code:
        ln(f'🔴 **{len(scale_code)} in code.**')
        ln('')
        ln('| Token | File | Line |')
        ln('|-------|------|------|')
        for token, fp, lno, ctx, _ in sorted(scale_code, key=lambda x: (x[1], x[2])):
            ln(f'| `{token}` | `{fp}` | {lno} |')
        ln('')
    else:
        ln('✅ None in code.')
        ln('')

    # M2 Old Accent
    ln('## M2. Old Accent References')
    ln('')
    if accent_code:
        ln(f'🔴 **{len(accent_code)} in code.**')
        ln('')
        ln('| Reference | Type | File | Line |')
        ln('|-----------|------|------|------|')
        for ref, fp, lno, ctx, rtype, _ in sorted(accent_code, key=lambda x: (x[1], x[2])):
            ln(f'| `{ref}` | {rtype} | `{fp}` | {lno} |')
        ln('')
    else:
        ln('✅ None in code.')
        ln('')

    # M3 Old A11Y
    ln('## M3. Old A11Y Tokens')
    ln('')
    if a11y_code:
        ln(f'🔴 **{len(a11y_code)} in code.**')
        ln('')
        # Group by file
        by_file = defaultdict(list)
        for token, fp, lno, ctx, _ in a11y_code:
            by_file[fp].append((token, lno))
        for fp, refs in sorted(by_file.items()):
            unique = sorted(set(r[0] for r in refs))
            ln(f'- `{fp}` ({len(refs)} refs): {", ".join(f"`{u}`" for u in unique[:5])}{"..." if len(unique) > 5 else ""}')
        ln('')
    else:
        ln('✅ None in code.')
        ln('')

    # M4 Old Gradients
    ln('## M4. Old Gradient Tokens')
    ln('')
    if gradient_code:
        ln(f'🔴 **{len(gradient_code)} in code.**')
        ln('')
        for token, fp, lno, ctx, _ in gradient_code:
            ln(f'- `{fp}` L{lno}: `{token}`')
        ln('')
    else:
        ln('✅ None.')
        ln('')

    # Generators
    if generator_findings:
        ln('## Generator Files (Excluded)')
        ln('')
        for entry in generator_findings:
            ln(f'- `{entry[2]}` L{entry[3]}: `{entry[1]}` ({entry[0]})')
        ln('')

    # ═════════════════════════════════════════════════════════════════════
    # PART 2: HARDCODED COLOURS
    # ═════════════════════════════════════════════════════════════════════
    ln('---')
    ln('')
    ln('# Part 2: Hardcoded Colours')
    ln('')

    sorted_hardcoded = sorted(all_hardcoded.items(), key=lambda x: len(x[1]), reverse=True)

    if sorted_hardcoded:
        ln(f'**{total_hardcoded} hardcoded values** across {len(hardcoded_by_file)} files, '
           f'{len(all_hardcoded)} unique.')
        ln('')

        # Type breakdown
        type_counts = defaultdict(int)
        for fp, items in hardcoded_by_file.items():
            for _, _, t in items:
                type_counts[t] += 1
        ln('| Type | Count |')
        ln('|------|-------|')
        for t, c in sorted(type_counts.items(), key=lambda x: -x[1]):
            ln(f'| {t} | {c} |')
        ln('')

        ln('## Most Frequent')
        ln('')
        ln('| Colour | Times | Files | Action |')
        ln('|--------|-------|-------|--------|')
        for value, locations in sorted_hardcoded[:50]:
            count = len(locations)
            ufiles = len(set(loc[0] for loc in locations))
            matching = [tn for tn, tv in colour_token_defs.items()
                       if tv.strip().lower() == value.lower()]
            if matching:
                action = f'-> `var({matching[0]})`'
            elif count >= 5:
                action = 'Create token'
            elif count >= 3:
                action = 'Consider token'
            else:
                action = 'Review'
            ln(f'| `{value}` | {count} | {ufiles} | {action} |')
        ln('')

        ln('## Worst Offender Files')
        ln('')
        sorted_files = sorted(hardcoded_by_file.items(), key=lambda x: len(x[1]), reverse=True)
        ln('| File | Count | Types |')
        ln('|------|-------|-------|')
        for fp, items in sorted_files[:40]:
            types = sorted(set(t for _, _, t in items))
            ln(f'| `{fp}` | {len(items)} | {", ".join(types)} |')
        ln('')

        ln('## Top 15 — Detailed Locations')
        ln('')
        for value, locations in sorted_hardcoded[:15]:
            ln(f'### `{value}` ({len(locations)})')
            ln('')
            for fp, lno, ctx in locations[:20]:
                ln(f'- `{fp}` L{lno}: `{ctx[:100]}`')
            if len(locations) > 20:
                ln(f'- ... and {len(locations) - 20} more')
            ln('')
    else:
        ln('✅ No hardcoded colours!')
        ln('')

    # ═════════════════════════════════════════════════════════════════════
    # PART 3: TOKEN HEALTH
    # ═════════════════════════════════════════════════════════════════════
    ln('---')
    ln('')
    ln('# Part 3: Token Health')
    ln('')

    # Inline styles
    if inline_style_locations:
        ln(f'## Inline Colour Styles ({len(inline_style_locations)})')
        ln('')
        for fp, lno, style in inline_style_locations:
            ln(f'- `{fp}` L{lno}: `{style[:100]}`')
        ln('')

    # Defined never used
    ln(f'## Defined But Never Used ({len(defined_never_used)})')
    ln('')
    if defined_never_used:
        ln('| Token | Value | File | Line |')
        ln('|-------|-------|------|------|')
        for tn, val, fp, lno in sorted(defined_never_used, key=lambda x: x[0]):
            ln(f'| `{tn}` | `{val[:50]}` | `{fp}` | {lno} |')
        ln('')
    else:
        ln('✅ All defined tokens are used.')
        ln('')

    # Used never defined
    ln(f'## Used But Never Defined ({len(used_never_defined)})')
    ln('')
    if used_never_defined:
        ln('| Token | Uses | Examples |')
        ln('|-------|------|----------|')
        for tn, count, examples in sorted(used_never_defined, key=lambda x: x[1], reverse=True):
            locs = '; '.join(f'{f} L{l}' for f, l, _ in examples)
            ln(f'| `{tn}` | {count} | {locs} |')
        ln('')
    else:
        ln('✅ All used tokens have definitions.')
        ln('')

    # Duplicates
    value_to_tokens = defaultdict(list)
    for tn, defs in all_definitions.items():
        for fp, val, lno in defs:
            cv = val.strip().lower()
            if not cv.startswith('var('):
                value_to_tokens[cv].append(tn)
    duplicates = {v: sorted(set(t)) for v, t in value_to_tokens.items() if len(set(t)) > 1}

    ln(f'## Duplicate Values ({len(duplicates)} groups)')
    ln('')
    if duplicates:
        ln('| Value | Tokens |')
        ln('|-------|--------|')
        for val, tokens in sorted(duplicates.items()):
            tlist = ', '.join(f'`{t}`' for t in tokens)
            ln(f'| `{val}` | {tlist} |')
        ln('')
    else:
        ln('✅ No duplicates.')
        ln('')

    # Usage frequency
    ln('## Token Usage Frequency (Top 30)')
    ln('')
    sorted_usage = sorted(all_usages.items(), key=lambda x: len(x[1]), reverse=True)
    colour_usage = [(n, l) for n, l in sorted_usage if is_colour_token(n)]
    if colour_usage:
        ln('| Token | Uses | Files |')
        ln('|-------|------|-------|')
        for tn, locs in colour_usage[:30]:
            ln(f'| `{tn}` | {len(locs)} | {len(set(l[0] for l in locs))} |')
        ln('')

    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(
        description='CSS colour audit — source files only (excludes docs/reports/md)'
    )
    parser.add_argument('project_path', help='Path to project root or src/ directory')
    parser.add_argument('--output', '-o', default=None, help='Output file path')

    args = parser.parse_args()
    project_root = os.path.abspath(args.project_path)

    if not os.path.isdir(project_root):
        print(f'Error: {project_root} is not a valid directory', file=sys.stderr)
        sys.exit(1)

    print(f'Scanning {project_root} (source only)...', file=sys.stderr)
    all_results, file_count, skipped = run_audit(project_root)
    print(f'Scanned {file_count} source files, skipped {skipped} docs/reports.', file=sys.stderr)
    print(f'Findings in {len(all_results)} files.', file=sys.stderr)

    report = generate_report(all_results, file_count, skipped, project_root)

    output_path = args.output or os.path.join(project_root, '..', 'colour_audit_src_report.md')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(report)
    print(f'\nReport saved to: {output_path}', file=sys.stderr)


if __name__ == '__main__':
    main()
