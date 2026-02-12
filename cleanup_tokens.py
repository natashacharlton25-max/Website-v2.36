#!/usr/bin/env python3
"""
Token Cleanup
==============
1. Removes unused token definitions from token files
2. Adds missing token definitions
3. Removes duplicate utility classes from global.css

Run AFTER migrate_typography.py (which renames the size tokens).

Usage:
  python cleanup_tokens.py <src_dir> --dry-run    # Preview
  python cleanup_tokens.py <src_dir> --apply       # Apply
"""

import os
import re
import sys

# ─── Tokens to REMOVE (defined, never used) ─────────────────────────────────

# shadows.css removals
REMOVE_FROM_SHADOWS = [
    '--shadow-base',
    '--shadow-xs',
    '--shadow-dropdown:',      # careful: only the main --shadow-dropdown, not -md
    '--shadow-dropdown-sm',
    '--shadow-dropdown-lg',
    '--shadow-dropdown-soft',
    '--shadow-glow-primary',
    '--shadow-glow-secondary',
    '--shadow-inner-md',
    '--shadow-inner-xl',
    '--shadow-inner-2xl',
    '--shadow-neomorph-sm',
    '--shadow-neomorph:',      # only the base, regex will handle
    '--shadow-neomorph-lg',
    '--shadow-neomorph-xl',
    '--glass-card-bg',
    '--glass-card-blur',
    '--glass-card-border',
    '--glass-card-shadow',
    '--glass-overlay-bg',
    '--glass-overlay-shadow',
    '--glass-surface-bg',
    '--glass-surface-blur',
    '--glass-surface-shadow',
    '--glint-gradient-strong',
    '--glint-gradient-subtle',
]

# gradients.css removals
REMOVE_FROM_GRADIENTS = [
    '--gradient-btn-ghost',
]

# spacing.css removals
REMOVE_FROM_SPACING = [
    '--page-margin-expansive',
    '--space-6xl',
    '--space-8xl',
    '--border-width-4',
    '--z-fixed',
    '--z-modal-backdrop',
    '--z-popover',
    '--z-tooltip',
]

# typography.css removals (handled by new file, but just in case)
REMOVE_FROM_TYPOGRAPHY = [
    '--font-secondary',
    '--font-special',
    '--leading-loose',
    '--letter-spacing-tight',
]

# Theme file removals (remove from ALL theme files)
REMOVE_FROM_THEMES = [
    '--btn-ghost-text',
    '--btn-outline-text',
    '--hero-overlay-color',
    '--a11y-hc-border',
]

# dropdown-tokens.css removals
REMOVE_FROM_DROPDOWN = [
    '--dropdown-hover-bg',
    '--dropdown-hover-text',
]

# ─── Tokens to ADD (used but never defined) ─────────────────────────────────

# Add to spacing.css
ADD_TO_SPACING = """
  /* ========== MICRO SPACING ========== */
  --space-2xs: 0.125rem;    /* 2px */
  --space-3xs: 0.0625rem;   /* 1px */

  /* ========== ADDITIONAL BORDERS ========== */
  --radius-xs: 0.125rem;    /* 2px */
  --border-radius-2xl: 2rem; /* 32px */
  --border-width-md: 3px;

  /* ========== ASPECT RATIOS ========== */
  --aspect-square: 1 / 1;
  --aspect-video: 16 / 9;
  --aspect-3-2: 3 / 2;
  --aspect-4-5: 4 / 5;
  --aspect-3-4: 3 / 4;
"""

# Add to status.css
ADD_TO_STATUS = """
  /* ========== OPACITY ========== */
  --opacity-high: 0.9;
  --opacity-medium-high: 0.75;
  --opacity-medium: 0.6;
"""


def remove_token_lines(content, tokens_to_remove):
    """Remove lines that define any of the given tokens.
    Handles multi-line values (continuation lines before semicolon).
    """
    lines = content.split('\n')
    result = []
    skip_until_semicolon = False
    removed = 0

    for line in lines:
        if skip_until_semicolon:
            if ';' in line:
                skip_until_semicolon = False
                removed += 1
            continue

        should_remove = False
        for token in tokens_to_remove:
            # Handle tokens with colons (exact match needed)
            clean_token = token.rstrip(':')
            # Match: --token-name: or --token-name :
            if re.search(rf'^\s*{re.escape(clean_token)}\s*:', line):
                should_remove = True
                break

        if should_remove:
            if ';' in line:
                removed += 1
                continue  # Single-line definition, skip it
            else:
                skip_until_semicolon = True
                removed += 1
                continue

        result.append(line)

    # Clean up double blank lines left by removals
    cleaned = re.sub(r'\n{3,}', '\n\n', '\n'.join(result))
    return cleaned, removed


def add_tokens_before_closing(content, tokens_to_add):
    """Add token definitions before the last closing brace in :root"""
    # Find last } that closes :root
    last_brace = content.rfind('}')
    if last_brace == -1:
        return content, 0

    # Count how many tokens we're adding
    count = len([l for l in tokens_to_add.strip().split('\n') if '--' in l])

    return content[:last_brace] + tokens_to_add + '\n' + content[last_brace:], count


def remove_dark_mode_glass(content):
    """Remove the @media (prefers-color-scheme: dark) block for glass tokens"""
    # Match the entire dark mode media query block
    pattern = r'/\*\s*Dark mode glass adjustments\s*\*/\s*@media\s*\(prefers-color-scheme:\s*dark\)\s*\{[^}]*\{[^}]*\}[^}]*\}'
    result, count = re.subn(pattern, '', content, flags=re.DOTALL)
    return result, count


def process_theme_files(root, tokens_to_remove, dry_run):
    """Remove tokens from all theme files"""
    theme_dirs = [
        os.path.join(root, 'styles', 'themes', 'a11y'),
        os.path.join(root, 'styles', 'themes', 'brand'),
    ]

    total_removed = 0
    files_changed = []

    for theme_dir in theme_dirs:
        if not os.path.isdir(theme_dir):
            continue
        for filename in os.listdir(theme_dir):
            if not filename.endswith('.css'):
                continue
            filepath = os.path.join(theme_dir, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                new_content, removed = remove_token_lines(content, tokens_to_remove)

                if removed > 0:
                    total_removed += removed
                    rel = os.path.relpath(filepath, root)
                    files_changed.append((rel, removed))
                    if not dry_run:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
            except Exception as e:
                print(f"  Error processing {filepath}: {e}")

    return total_removed, files_changed


def remove_duplicate_image_utils(content):
    """Remove duplicate image/SVG utility classes from global.css
    (already defined in images.css via tokens/index.css)"""

    # Sections to remove — marked by comments in global.css
    sections_to_remove = [
        # Image radius variants (duplicated from images.css)
        (r'/\*\s*Border radius variants\s*\*/.*?\.img-radius-full\s*\{[^}]*\}',),
        # Width variants
        (r'/\*\s*Width variants\s*\*/.*?\.img-w-3xl\s*\{[^}]*\}',),
        # Height variants
        (r'/\*\s*Height variants\s*\*/.*?\.img-h-3xl\s*\{[^}]*\}',),
        # Square sizes
        (r'/\*\s*Square sizes[^*]*\*/.*?\.img-sq-3xl\s*\{[^}]*\}',),
        # Tall/Portrait sizes
        (r'/\*\s*Tall/Portrait[^*]*\*/.*?\.img-tall-xl\s*\{[^}]*\}',),
        # Wide/Landscape sizes
        (r'/\*\s*Wide/Landscape[^*]*\*/.*?\.img-wide-xl\s*\{[^}]*\}',),
        # Shadow variants
        (r'/\*\s*Shadow variants\s*\*/.*?\.img-shadow-lg\s*\{[^}]*\}',),
        # Filter variants
        (r'/\*\s*Filter variants\s*\*/.*?\.img-blur\s*\{[^}]*\}',),
    ]

    removed_count = 0
    for patterns in sections_to_remove:
        for pattern in patterns:
            new_content = re.sub(pattern, '', content, flags=re.DOTALL)
            if new_content != content:
                removed_count += 1
                content = new_content

    return content, removed_count


def main():
    if len(sys.argv) < 3:
        print("Usage: python cleanup_tokens.py <src_dir> --dry-run|--apply")
        sys.exit(1)

    root = sys.argv[1]
    mode = sys.argv[2]
    dry_run = mode != '--apply'

    if not os.path.isdir(root):
        print(f"Error: {root} is not a directory")
        sys.exit(1)

    print(f"{'DRY RUN' if dry_run else 'APPLYING'}: Token cleanup in {root}\n")

    total_removed = 0
    total_added = 0
    report = []

    # 1. shadows.css — remove unused + dark mode glass block
    shadows_path = os.path.join(root, 'styles', 'tokens', 'shadows.css')
    if os.path.exists(shadows_path):
        with open(shadows_path, 'r', encoding='utf-8') as f:
            content = f.read()

        content, r1 = remove_token_lines(content, REMOVE_FROM_SHADOWS)
        content, r2 = remove_dark_mode_glass(content)
        removed = r1 + r2

        if removed and not dry_run:
            with open(shadows_path, 'w', encoding='utf-8') as f:
                f.write(content)

        total_removed += removed
        report.append(f"shadows.css: removed {removed} tokens/blocks")
        print(f"  shadows.css: {removed} removals")

    # 2. gradients.css
    gradients_path = os.path.join(root, 'styles', 'tokens', 'gradients.css')
    if os.path.exists(gradients_path):
        with open(gradients_path, 'r', encoding='utf-8') as f:
            content = f.read()

        content, removed = remove_token_lines(content, REMOVE_FROM_GRADIENTS)

        if removed and not dry_run:
            with open(gradients_path, 'w', encoding='utf-8') as f:
                f.write(content)

        total_removed += removed
        report.append(f"gradients.css: removed {removed} tokens")
        print(f"  gradients.css: {removed} removals")

    # 3. spacing.css — remove unused + add missing
    spacing_path = os.path.join(root, 'styles', 'tokens', 'spacing.css')
    if os.path.exists(spacing_path):
        with open(spacing_path, 'r', encoding='utf-8') as f:
            content = f.read()

        content, removed = remove_token_lines(content, REMOVE_FROM_SPACING)
        content, added = add_tokens_before_closing(content, ADD_TO_SPACING)

        if (removed or added) and not dry_run:
            with open(spacing_path, 'w', encoding='utf-8') as f:
                f.write(content)

        total_removed += removed
        total_added += added
        report.append(f"spacing.css: removed {removed}, added {added}")
        print(f"  spacing.css: {removed} removals, {added} additions")

    # 4. status.css — add opacity tokens
    status_path = os.path.join(root, 'styles', 'tokens', 'status.css')
    if os.path.exists(status_path):
        with open(status_path, 'r', encoding='utf-8') as f:
            content = f.read()

        content, added = add_tokens_before_closing(content, ADD_TO_STATUS)

        if added and not dry_run:
            with open(status_path, 'w', encoding='utf-8') as f:
                f.write(content)

        total_added += added
        report.append(f"status.css: added {added} opacity tokens")
        print(f"  status.css: {added} additions")

    # 5. Theme files — remove unused tokens
    theme_removed, theme_files = process_theme_files(root, REMOVE_FROM_THEMES, dry_run)
    total_removed += theme_removed
    for rel, count in theme_files:
        report.append(f"{rel}: removed {count}")
        print(f"  {rel}: {count} removals")

    # 6. dropdown-tokens.css
    dropdown_path = os.path.join(root, 'styles', 'buttons', 'dropdown-tokens.css')
    if os.path.exists(dropdown_path):
        with open(dropdown_path, 'r', encoding='utf-8') as f:
            content = f.read()

        content, removed = remove_token_lines(content, REMOVE_FROM_DROPDOWN)

        if removed and not dry_run:
            with open(dropdown_path, 'w', encoding='utf-8') as f:
                f.write(content)

        total_removed += removed
        report.append(f"dropdown-tokens.css: removed {removed}")
        print(f"  dropdown-tokens.css: {removed} removals")

    # Summary
    print(f"\n{'='*50}")
    print(f"Token Cleanup {'Preview' if dry_run else 'Complete'}")
    print(f"{'='*50}")
    print(f"Tokens removed:  {total_removed}")
    print(f"Tokens added:    {total_added}")

    if dry_run:
        print(f"\nDry run. Use --apply to make changes.")


if __name__ == '__main__':
    main()
