#!/usr/bin/env python3
"""
CSS Colour Audit Script
========================
Scans all files in an Astro project for:
1. CSS custom property (token) DEFINITIONS  (--colour-xxx: value)
2. CSS custom property (token) USAGE         (var(--colour-xxx))
3. Hardcoded colours                         (hex, rgb, rgba, hsl, hsla, named)
4. Inline styles with colours
5. Tokens defined but never used
6. Tokens used but never defined

Outputs a detailed report with file paths, line numbers, and consolidation suggestions.

Usage:
    python colour_audit.py /path/to/your/astro-project
    python colour_audit.py /path/to/your/astro-project --output report.md
"""

import os
import re
import sys
import argparse
from collections import defaultdict
from pathlib import Path

# ── File extensions to scan ──────────────────────────────────────────────────
SCAN_EXTENSIONS = {
    '.astro', '.css', '.scss', '.less', '.sass',
    '.js', '.jsx', '.ts', '.tsx',
    '.html', '.htm', '.md', '.mdx',
    '.svelte', '.vue', '.json',
}

# ── Directories to skip ──────────────────────────────────────────────────────
SKIP_DIRS = {
    'node_modules', '.git', 'dist', '.output', '.astro',
    '__pycache__', '.vscode', '.idea', 'build', '.cache',
    '.netlify', '.vercel',
}

# ── CSS named colours (common set) ──────────────────────────────────────────
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

# Colours to ignore (functional, not design choices)
IGNORE_COLOURS = {'inherit', 'currentcolor', 'currentColor', 'transparent', 'none', 'unset', 'initial', 'revert'}

# ── Regex patterns ───────────────────────────────────────────────────────────

# Token definitions: --something: value
RE_TOKEN_DEFINITION = re.compile(
    r'(--[\w-]+)\s*:\s*([^;}\n]+)',
)

# Token usage: var(--something) or var(--something, fallback)
RE_TOKEN_USAGE = re.compile(
    r'var\(\s*(--[\w-]+)(?:\s*,\s*[^)]+)?\s*\)',
)

# Hex colours: #fff, #ffffff, #ffffffff
RE_HEX = re.compile(
    r'(?<![&\w])#([0-9a-fA-F]{3,8})\b',
)

# RGB/RGBA
RE_RGB = re.compile(
    r'\brgba?\s*\([^)]+\)',
    re.IGNORECASE,
)

# HSL/HSLA
RE_HSL = re.compile(
    r'\bhsla?\s*\([^)]+\)',
    re.IGNORECASE,
)

# Inline style attributes
RE_INLINE_STYLE = re.compile(
    r'style\s*=\s*["\']([^"\']*)["\']',
    re.IGNORECASE,
)

# CSS colour properties (to check if named colour is in a colour context)
COLOUR_PROPERTIES = [
    'color', 'colour', 'background', 'background-color', 'border-color',
    'border-top-color', 'border-right-color', 'border-bottom-color',
    'border-left-color', 'outline-color', 'text-decoration-color',
    'fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color',
    'box-shadow', 'text-shadow', 'border', 'outline',
    'column-rule-color', 'caret-color', 'accent-color',
]


def should_scan(filepath):
    """Check if file should be scanned based on extension."""
    return Path(filepath).suffix.lower() in SCAN_EXTENSIONS


def is_colour_token(name):
    """Check if a CSS custom property name looks like a colour token."""
    colour_indicators = [
        'color', 'colour', 'bg', 'background', 'text', 'border',
        'fill', 'stroke', 'shadow', 'primary', 'secondary', 'accent',
        'neutral', 'surface', 'brand', 'link', 'hover', 'active',
        'focus', 'disabled', 'error', 'warning', 'success', 'info',
        'highlight', 'muted', 'subtle', 'overlay',
    ]
    name_lower = name.lower()
    return any(indicator in name_lower for indicator in colour_indicators)


def is_colour_value(value):
    """Check if a CSS value looks like a colour."""
    value = value.strip()
    if RE_HEX.search(value):
        return True
    if RE_RGB.search(value):
        return True
    if RE_HSL.search(value):
        return True
    if value.lower() in CSS_NAMED_COLOURS:
        return True
    return False


def scan_file(filepath, project_root):
    """Scan a single file and return findings."""
    rel_path = os.path.relpath(filepath, project_root)
    results = {
        'token_definitions': [],   # (token_name, value, line_num)
        'token_usages': [],        # (token_name, line_num, context)
        'hardcoded_hex': [],       # (value, line_num, context)
        'hardcoded_rgb': [],       # (value, line_num, context)
        'hardcoded_hsl': [],       # (value, line_num, context)
        'hardcoded_named': [],     # (value, line_num, context)
        'inline_styles': [],       # (style_content, line_num)
    }

    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
    except (IOError, OSError):
        return rel_path, results

    for line_num, line in enumerate(lines, 1):
        stripped = line.strip()

        # Skip comments (basic check)
        if stripped.startswith('//') or stripped.startswith('/*') or stripped.startswith('*'):
            continue

        # ── Token definitions ────────────────────────────────────────
        for match in RE_TOKEN_DEFINITION.finditer(line):
            token_name = match.group(1)
            token_value = match.group(2).strip().rstrip(';').strip()
            if is_colour_token(token_name) or is_colour_value(token_value):
                results['token_definitions'].append(
                    (token_name, token_value, line_num)
                )

        # ── Token usage ──────────────────────────────────────────────
        for match in RE_TOKEN_USAGE.finditer(line):
            token_name = match.group(1)
            context = stripped[:120]
            results['token_usages'].append(
                (token_name, line_num, context)
            )

        # ── Hardcoded hex ────────────────────────────────────────────
        for match in RE_HEX.finditer(line):
            hex_val = f'#{match.group(1)}'
            # Skip hex in URLs, data URIs, or IDs
            prefix = line[:match.start()]
            if any(skip in prefix.lower() for skip in ['url(', 'data:', 'id=', 'href=']):
                continue
            context = stripped[:120]
            results['hardcoded_hex'].append(
                (hex_val, line_num, context)
            )

        # ── Hardcoded RGB/RGBA ───────────────────────────────────────
        for match in RE_RGB.finditer(line):
            # Skip if inside a var() or token definition that's already captured
            value = match.group(0)
            context = stripped[:120]
            results['hardcoded_rgb'].append(
                (value, line_num, context)
            )

        # ── Hardcoded HSL/HSLA ───────────────────────────────────────
        for match in RE_HSL.finditer(line):
            value = match.group(0)
            context = stripped[:120]
            results['hardcoded_hsl'].append(
                (value, line_num, context)
            )

        # ── Named colours ────────────────────────────────────────────
        # Only match in colour-relevant contexts
        line_lower = line.lower()
        for colour_prop in COLOUR_PROPERTIES:
            if colour_prop in line_lower:
                for named in CSS_NAMED_COLOURS:
                    if named.lower() in IGNORE_COLOURS:
                        continue
                    # Word boundary match
                    pattern = re.compile(r'\b' + re.escape(named) + r'\b', re.IGNORECASE)
                    if pattern.search(line):
                        context = stripped[:120]
                        results['hardcoded_named'].append(
                            (named, line_num, context)
                        )
                break  # Only check named colours once per line

        # ── Inline styles ────────────────────────────────────────────
        for match in RE_INLINE_STYLE.finditer(line):
            style_content = match.group(1)
            if is_colour_value(style_content) or any(
                cp in style_content.lower() for cp in COLOUR_PROPERTIES
            ):
                results['inline_styles'].append(
                    (style_content, line_num)
                )

    return rel_path, results


def run_audit(project_root):
    """Scan all files in the project and aggregate results."""
    all_results = {}
    file_count = 0

    for root, dirs, files in os.walk(project_root):
        # Skip excluded directories
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]

        for filename in files:
            filepath = os.path.join(root, filename)
            if should_scan(filepath):
                file_count += 1
                rel_path, results = scan_file(filepath, project_root)
                # Only store if there are findings
                has_findings = any(v for v in results.values())
                if has_findings:
                    all_results[rel_path] = results

    return all_results, file_count


def generate_report(all_results, file_count, project_root):
    """Generate a markdown audit report."""
    lines = []
    ln = lines.append

    # ── Aggregate stats ──────────────────────────────────────────────────────
    all_definitions = {}        # token_name -> [(file, value, line)]
    all_usages = defaultdict(list)  # token_name -> [(file, line, context)]
    all_hardcoded = defaultdict(list)  # value -> [(file, line, context)]
    hardcoded_by_file = defaultdict(list)
    inline_style_locations = []
    colour_token_defs = {}      # token_name -> value (most recent)

    for filepath, results in all_results.items():
        for token_name, value, line_num in results['token_definitions']:
            if token_name not in all_definitions:
                all_definitions[token_name] = []
            all_definitions[token_name].append((filepath, value, line_num))
            colour_token_defs[token_name] = value

        for token_name, line_num, context in results['token_usages']:
            all_usages[token_name].append((filepath, line_num, context))

        for value, line_num, context in results['hardcoded_hex']:
            all_hardcoded[value.lower()].append((filepath, line_num, context))
            hardcoded_by_file[filepath].append((value, line_num, 'hex'))

        for value, line_num, context in results['hardcoded_rgb']:
            all_hardcoded[value.lower()].append((filepath, line_num, context))
            hardcoded_by_file[filepath].append((value, line_num, 'rgb'))

        for value, line_num, context in results['hardcoded_hsl']:
            all_hardcoded[value.lower()].append((filepath, line_num, context))
            hardcoded_by_file[filepath].append((value, line_num, 'hsl'))

        for value, line_num, context in results['hardcoded_named']:
            all_hardcoded[value.lower()].append((filepath, line_num, context))
            hardcoded_by_file[filepath].append((value, line_num, 'named'))

        for style, line_num in results['inline_styles']:
            inline_style_locations.append((filepath, line_num, style))

    # Defined but never used
    defined_never_used = []
    for token_name in all_definitions:
        if token_name not in all_usages:
            for filepath, value, line_num in all_definitions[token_name]:
                defined_never_used.append((token_name, value, filepath, line_num))

    # Used but never defined (might be from external/framework)
    used_never_defined = []
    for token_name in all_usages:
        if token_name not in all_definitions:
            used_never_defined.append((
                token_name,
                len(all_usages[token_name]),
                all_usages[token_name][:3]  # first 3 examples
            ))

    # ── Report header ────────────────────────────────────────────────────────
    ln('# CSS Colour Audit Report')
    ln('')
    ln(f'**Project:** `{project_root}`')
    ln(f'**Files scanned:** {file_count}')
    ln(f'**Files with colour findings:** {len(all_results)}')
    ln('')

    # ── Summary ──────────────────────────────────────────────────────────────
    ln('## Summary')
    ln('')
    ln(f'| Metric | Count |')
    ln(f'|--------|-------|')
    ln(f'| Colour token definitions | {sum(len(v) for v in all_definitions.values())} |')
    ln(f'| Unique colour tokens defined | {len(all_definitions)} |')
    ln(f'| Token usages (var references) | {sum(len(v) for v in all_usages.values())} |')
    ln(f'| Unique tokens referenced | {len(all_usages)} |')
    ln(f'| Hardcoded colour values | {sum(len(v) for v in all_hardcoded.values())} |')
    ln(f'| Unique hardcoded values | {len(all_hardcoded)} |')
    ln(f'| Inline styles with colours | {len(inline_style_locations)} |')
    ln(f'| Tokens defined but NEVER used | {len(defined_never_used)} |')
    ln(f'| Tokens used but NEVER defined | {len(used_never_defined)} |')
    ln('')

    # ── Hardcoded colours (the main problem) ────────────────────────────────
    ln('---')
    ln('')
    ln('## 🔴 Hardcoded Colours (Need Tokenising)')
    ln('')
    ln('These are colour values written directly in files instead of using tokens.')
    ln('')

    # Sort by frequency (most used first)
    sorted_hardcoded = sorted(
        all_hardcoded.items(),
        key=lambda x: len(x[1]),
        reverse=True
    )

    if sorted_hardcoded:
        ln(f'| Colour Value | Times Used | Files | Suggested Action |')
        ln(f'|-------------|------------|-------|-----------------|')
        for value, locations in sorted_hardcoded:
            count = len(locations)
            unique_files = sorted(set(loc[0] for loc in locations))
            file_count_for_val = len(unique_files)

            # Check if this value matches an existing token
            matching_tokens = [
                tn for tn, tv in colour_token_defs.items()
                if tv.strip().lower() == value.lower()
            ]
            if matching_tokens:
                suggestion = f'Replace with `var({matching_tokens[0]})`'
            elif count >= 3:
                suggestion = 'Create new token — used frequently'
            elif count >= 2:
                suggestion = 'Consider creating token'
            else:
                suggestion = 'Review — single use'

            ln(f'| `{value}` | {count} | {file_count_for_val} | {suggestion} |')
        ln('')

        # Detailed locations
        ln('### Hardcoded Colour Locations')
        ln('')
        for value, locations in sorted_hardcoded:
            ln(f'#### `{value}` ({len(locations)} occurrences)')
            ln('')
            for filepath, line_num, context in locations:
                ln(f'- **{filepath}** line {line_num}')
                ln(f'  `{context}`')
            ln('')
    else:
        ln('✅ No hardcoded colours found!')
        ln('')

    # ── Hardcoded by file view ───────────────────────────────────────────────
    if hardcoded_by_file:
        ln('---')
        ln('')
        ln('## 🔴 Hardcoded Colours By File')
        ln('')
        ln('Files sorted by number of hardcoded colours (worst offenders first).')
        ln('')

        sorted_files = sorted(
            hardcoded_by_file.items(),
            key=lambda x: len(x[1]),
            reverse=True
        )

        ln(f'| File | Hardcoded Count | Types |')
        ln(f'|------|----------------|-------|')
        for filepath, items in sorted_files:
            types = sorted(set(t for _, _, t in items))
            ln(f'| `{filepath}` | {len(items)} | {", ".join(types)} |')
        ln('')

    # ── Inline styles ────────────────────────────────────────────────────────
    if inline_style_locations:
        ln('---')
        ln('')
        ln('## 🟠 Inline Styles with Colours')
        ln('')
        ln('These should ideally use CSS classes with tokens instead.')
        ln('')
        for filepath, line_num, style in inline_style_locations:
            ln(f'- **{filepath}** line {line_num}')
            ln(f'  `{style[:120]}`')
        ln('')

    # ── Tokens defined but never used ────────────────────────────────────────
    ln('---')
    ln('')
    ln('## 🟡 Tokens Defined But Never Used')
    ln('')
    if defined_never_used:
        ln('These tokens exist in your codebase but nothing references them.')
        ln('They are candidates for removal (dead code).')
        ln('')
        ln(f'| Token | Value | Defined In | Line |')
        ln(f'|-------|-------|-----------|------|')
        for token_name, value, filepath, line_num in sorted(defined_never_used, key=lambda x: x[0]):
            ln(f'| `{token_name}` | `{value}` | `{filepath}` | {line_num} |')
        ln('')
    else:
        ln('✅ All defined tokens are being used.')
        ln('')

    # ── Tokens used but never defined ────────────────────────────────────────
    ln('---')
    ln('')
    ln('## 🟡 Tokens Used But Never Defined (In Scanned Files)')
    ln('')
    if used_never_defined:
        ln('These tokens are referenced but no definition was found.')
        ln('They may come from a framework, external stylesheet, or be errors.')
        ln('')
        ln(f'| Token | Times Used | Example Locations |')
        ln(f'|-------|-----------|------------------|')
        for token_name, count, examples in sorted(used_never_defined, key=lambda x: x[1], reverse=True):
            example_locs = '; '.join(f'{f} L{l}' for f, l, _ in examples)
            ln(f'| `{token_name}` | {count} | {example_locs} |')
        ln('')
    else:
        ln('✅ All used tokens have definitions.')
        ln('')

    # ── Token usage frequency ────────────────────────────────────────────────
    ln('---')
    ln('')
    ln('## 📊 Token Usage Frequency')
    ln('')
    ln('How often each colour token is actually used across the project.')
    ln('')

    sorted_usage = sorted(
        all_usages.items(),
        key=lambda x: len(x[1]),
        reverse=True
    )

    # Only show colour-related tokens
    colour_usage = [(name, locs) for name, locs in sorted_usage if is_colour_token(name)]

    if colour_usage:
        ln(f'| Token | Times Used | Unique Files |')
        ln(f'|-------|-----------|-------------|')
        for token_name, locations in colour_usage:
            count = len(locations)
            unique_files = len(set(loc[0] for loc in locations))
            ln(f'| `{token_name}` | {count} | {unique_files} |')
        ln('')
    else:
        ln('No colour token usage found.')
        ln('')

    # ── Token definitions ────────────────────────────────────────────────────
    ln('---')
    ln('')
    ln('## 📋 All Colour Token Definitions')
    ln('')

    if all_definitions:
        ln(f'| Token | Value | Defined In | Line |')
        ln(f'|-------|-------|-----------|------|')
        for token_name in sorted(all_definitions.keys()):
            for filepath, value, line_num in all_definitions[token_name]:
                ln(f'| `{token_name}` | `{value}` | `{filepath}` | {line_num} |')
        ln('')
    else:
        ln('No colour token definitions found.')
        ln('')

    # ── Duplicate values ─────────────────────────────────────────────────────
    ln('---')
    ln('')
    ln('## 🔄 Duplicate Token Values (Same Colour, Different Token Names)')
    ln('')
    ln('These tokens resolve to the same colour value and may be candidates')
    ln('for consolidation into base tokens (ally pattern).')
    ln('')

    value_to_tokens = defaultdict(list)
    for token_name, defs in all_definitions.items():
        for filepath, value, line_num in defs:
            clean_val = value.strip().lower()
            # Resolve var() references
            if not clean_val.startswith('var('):
                value_to_tokens[clean_val].append(token_name)

    duplicates = {v: list(set(tokens)) for v, tokens in value_to_tokens.items() if len(set(tokens)) > 1}

    if duplicates:
        ln(f'| Colour Value | Tokens Using This Value |')
        ln(f'|-------------|------------------------|')
        for value, tokens in sorted(duplicates.items()):
            token_list = ', '.join(f'`{t}`' for t in sorted(tokens))
            ln(f'| `{value}` | {token_list} |')
        ln('')
    else:
        ln('✅ No duplicate colour values found across tokens.')
        ln('')

    # ── Base colour candidates ───────────────────────────────────────────────
    ln('---')
    ln('')
    ln('## 🎯 Base Colour Candidates (Ally Pattern)')
    ln('')
    ln('Based on usage frequency, these are your most important colour values.')
    ln('These would form your base colour set (like ally\'s four + black/white).')
    ln('')

    # Combine token values used most with hardcoded values used most
    all_colour_values = defaultdict(int)

    for token_name, locations in all_usages.items():
        if token_name in colour_token_defs:
            value = colour_token_defs[token_name].strip().lower()
            if not value.startswith('var('):
                all_colour_values[value] += len(locations)

    for value, locations in all_hardcoded.items():
        all_colour_values[value] += len(locations)

    sorted_colours = sorted(all_colour_values.items(), key=lambda x: x[1], reverse=True)

    if sorted_colours:
        ln(f'| Colour Value | Total References | Potential Base Token |')
        ln(f'|-------------|-----------------|---------------------|')
        for i, (value, count) in enumerate(sorted_colours[:20]):
            ln(f'| `{value}` | {count} | candidate-{i+1} |')
        ln('')
    else:
        ln('Not enough data to suggest base colours.')
        ln('')

    # ── Recommendations ──────────────────────────────────────────────────────
    ln('---')
    ln('')
    ln('## ✅ Recommendations')
    ln('')

    total_hardcoded = sum(len(v) for v in all_hardcoded.values())
    total_unused = len(defined_never_used)
    total_inline = len(inline_style_locations)

    if total_hardcoded > 0:
        ln(f'1. **Tokenise {total_hardcoded} hardcoded colour values** across '
           f'{len(hardcoded_by_file)} files. Start with the most frequently '
           f'used values and the worst-offending files listed above.')
        ln('')

    if total_unused > 0:
        ln(f'2. **Remove {total_unused} unused token definitions** to reduce '
           f'dead code and confusion about which tokens are active.')
        ln('')

    if total_inline > 0:
        ln(f'3. **Move {total_inline} inline colour styles** to CSS classes '
           f'using tokens for consistency and maintainability.')
        ln('')

    if duplicates:
        ln(f'4. **Consolidate {len(duplicates)} duplicate colour values** '
           f'into shared base tokens following the ally pattern.')
        ln('')

    ln(f'5. **Consider reducing to a base colour set** of '
       f'{min(len(sorted_colours), 10)}-ish values that all component '
       f'tokens map back to, matching your ally architecture.')
    ln('')

    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(
        description='Audit CSS colour tokens and hardcoded colours in an Astro project'
    )
    parser.add_argument(
        'project_path',
        help='Path to the project root directory'
    )
    parser.add_argument(
        '--output', '-o',
        default=None,
        help='Output file path (default: prints to stdout and saves to colour_audit_report.md)'
    )

    args = parser.parse_args()

    project_root = os.path.abspath(args.project_path)

    if not os.path.isdir(project_root):
        print(f'Error: {project_root} is not a valid directory', file=sys.stderr)
        sys.exit(1)

    print(f'Scanning {project_root}...', file=sys.stderr)
    all_results, file_count = run_audit(project_root)
    print(f'Scanned {file_count} files, found issues in {len(all_results)} files.', file=sys.stderr)

    report = generate_report(all_results, file_count, project_root)

    output_path = args.output or os.path.join(project_root, 'colour_audit_report.md')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(report)
    print(f'Report saved to: {output_path}', file=sys.stderr)


if __name__ == '__main__':
    main()
