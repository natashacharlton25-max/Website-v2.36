const fs = require('fs');
const path = require('path');

// Collect all target files
const glob = require('child_process').execSync(
  'find src -type f \( -name "*.css" -o -name "*.astro" \) ! -path "*node_modules*" ! -path "*_reference*"',
  { cwd: 'c:/Users/Business/Website v2.36', encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

let totalDisabled = 0;
let filesModified = 0;

for (const rel of glob) {
  const file = path.join('c:/Users/Business/Website v2.36', rel);
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  let result = '';
  let i = 0;

  while (i < content.length) {
    // Check if we're inside a CSS comment already
    if (content.slice(i, i + 2) === '/*') {
      const endComment = content.indexOf('*/', i + 2);
      if (endComment !== -1) {
        result += content.slice(i, endComment + 2);
        i = endComment + 2;
        continue;
      }
    }

    // Check if we're at a // comment line (JS/TS style in .astro frontmatter)
    if (content.slice(i, i + 2) === '//' && (i === 0 || content[i-1] === '\n')) {
      const endLine = content.indexOf('\n', i);
      if (endLine !== -1) {
        result += content.slice(i, endLine + 1);
        i = endLine + 1;
        continue;
      }
    }

    // Look for @media
    const mediaMatch = content.slice(i).match(/^@media\s*[\s\S]*?\{/);
    if (mediaMatch && content.slice(i, i + 6) === '@media') {
      // Find the full @media block by tracking brace depth
      const blockStart = i;
      let j = i + mediaMatch[0].length;
      let depth = 1;

      while (j < content.length && depth > 0) {
        if (content[j] === '{') depth++;
        else if (content[j] === '}') depth--;
        j++;
      }

      const block = content.slice(blockStart, j);

      // Skip if already disabled
      if (block.includes('TEMP DISABLED')) {
        result += block;
        i = j;
        continue;
      }

      // Comment it out
      result += '/* TEMP DISABLED\n' + block + '\nTEMP DISABLED */';
      i = j;
      modified = true;
      totalDisabled++;
    } else {
      result += content[i];
      i++;
    }
  }

  if (modified) {
    fs.writeFileSync(file, result);
    filesModified++;
  }
}

console.log(`Disabled ${totalDisabled} @media blocks across ${filesModified} files`);
