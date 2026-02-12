#!/usr/bin/env python3
"""
Find all remaining px-based font-size declarations.
Usage: python find_px_fontsize.py <src_dir>
"""

import os
import re
import sys
from pathlib import Path

SCAN_EXTENSIONS = {'.css', '.astro'}
EXCLUDE_DIRS = {'node_modules', '.git', 'dist', '.astro', 'Preview', '__pycache__'}

# Match font-size with px values
PX_PATTERN = re.compile(r'^\s*font-size:\s*([\d.]+)px\s*;?\s*$')

def main():
    root = sys.argv[1] if len(sys.argv) > 1 else '.'
    
    results = []
    
    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for filename in files:
            ext = Path(filename).suffix.lower()
            if ext not in SCAN_EXTENSIONS:
                continue
            
            filepath = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(filepath, root).replace('\\', '/')
            
            try:
                with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
                    lines = f.readlines()
            except Exception:
                continue
            
            for i, line in enumerate(lines, 1):
                match = PX_PATTERN.match(line)
                if match:
                    px_val = float(match.group(1))
                    rem_val = round(px_val / 16, 4)
                    results.append({
                        'file': rel_path,
                        'line': i,
                        'px': px_val,
                        'rem': rem_val,
                        'text': line.strip(),
                    })
    
    # Summary by px value
    by_value = {}
    for r in results:
        px = r['px']
        by_value.setdefault(px, []).append(r)
    
    print(f"Found {len(results)} px font-size declarations across {len(set(r['file'] for r in results))} files\n")
    
    print(f"{'px':>6}  {'rem':>8}  {'count':>5}  {'element equivalent'}")
    print(f"{'-'*6}  {'-'*8}  {'-'*5}  {'-'*20}")
    for px in sorted(by_value.keys(), reverse=True):
        items = by_value[px]
        rem = round(px / 16, 4)
        
        # Map to nearest element
        element = ''
        if rem >= 1.0625: element = '→ p (1.0625rem)'
        elif rem >= 0.875: element = '→ h6/small (0.875rem)'
        elif rem >= 0.75: element = '→ small (0.75rem)'
        else: element = '→ too small, delete or use small'
        
        print(f"{px:>5}px  {rem:>7}rem  {len(items):>5}  {element}")
    
    # Save full report
    report_path = os.path.join(os.path.dirname(root), 'px_fontsize_report.md')
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("# Hardcoded px Font-Size Report\n\n")
        f.write(f"**Total:** {len(results)} declarations in {len(set(r['file'] for r in results))} files\n\n")
        
        f.write("## By Value\n\n")
        f.write("| px | rem | Count | Nearest element |\n")
        f.write("|----|-----|-------|-----------------|\n")
        for px in sorted(by_value.keys(), reverse=True):
            items = by_value[px]
            rem = round(px / 16, 4)
            if rem >= 1.0625: element = 'p'
            elif rem >= 0.875: element = 'h6 / small (0.875rem)'
            elif rem >= 0.75: element = 'small (0.75rem)'
            else: element = 'delete or use small'
            f.write(f"| {px}px | {rem}rem | {len(items)} | {element} |\n")
        
        f.write("\n## All Declarations\n\n")
        f.write("| File | Line | Value | Suggested |\n")
        f.write("|------|------|-------|-----------|\n")
        for r in sorted(results, key=lambda x: (x['file'], x['line'])):
            rem = r['rem']
            if rem >= 1.0625: suggest = 'inherit from p'
            elif rem >= 0.875: suggest = 'inherit from h6/small'
            elif rem >= 0.75: suggest = 'inherit from small'
            else: suggest = 'delete — use small element'
            f.write(f"| {r['file']} | L{r['line']} | {r['text']} | {suggest} |\n")
    
    print(f"\nFull report: {report_path}")


if __name__ == '__main__':
    main()
