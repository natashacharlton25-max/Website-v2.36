/**
 * Text-path resolver — single source of truth for `logo:KEY` and
 * `phrase:KEY` shorthand resolution. Called at build time from Astro
 * frontmatter (SSR-only — does fs.readFileSync for logos).
 *
 * Two atoms consume this:
 *   - Burst: feeds path data into the particle/strand engines
 *   - Shape: feeds inline SVG markup into its draw infrastructure
 *
 * The resolver returns both representations so each atom takes what it
 * needs — Burst grabs `paths`, Shape grabs `markup`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { BRAND_CONFIG } from '../config/brand';
import { TEXT_PATHS_META } from './generated';

export type LogoKey = 'primary' | 'monochrome' | 'favicon' | 'wordmark';
export type PhraseKey = string;

export interface ResolvedSvg {
  /** Array of path `d` attribute values — multi-path logos give N
   *  entries, phrases give one per non-space character. */
  paths: string[];
  /** "minX minY width height" — fitted to the union bbox of all paths. */
  viewBox: string;
  /** Ready-to-inline SVG document with the paths inside a properly-
   *  sized viewBox. Paths have no fill/stroke attributes so the
   *  consumer's CSS (or GSAP draw) controls appearance. */
  markup: string;
}

/**
 * Build an inline SVG document from a viewBox and path array.
 * Shape consumes this verbatim via its existing svgContent pipeline.
 */
function buildSvgMarkup(viewBox: string, paths: string[]): string {
  // fill="currentColor" lets Shape's .color--{name} mixin flow through
  // for static rendering, AND lets Shape's draw-mode regex catch the
  // path and convert it to a stroke for GSAP DrawSVG animation. Without
  // this attribute the paths render with the user-agent default fill
  // and draw mode can't find a fill to swap.
  const pathTags = paths.map(d => `<path d="${d}" fill="currentColor" />`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet">${pathTags}</svg>`;
}

/**
 * Extract viewBox + path d-attributes from an SVG file's contents.
 * Falls back to "0 0 100 100" if no viewBox is present (matches Shape's
 * built-in shape coordinate system).
 */
function parseSvgFile(svgText: string): { viewBox: string; paths: string[] } {
  const viewBoxMatch = svgText.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 100 100';
  const paths = Array.from(svgText.matchAll(/<path[^>]*\sd="([^"]+)"/g)).map(m => m[1]);
  return { viewBox, paths };
}

/**
 * Resolve a BRAND_CONFIG.logo key into a ResolvedSvg.
 * Returns null if the key is unknown or the file can't be read.
 */
export function resolveLogoToSvg(key: LogoKey): ResolvedSvg | null {
  const logoPath = (BRAND_CONFIG as any).logo?.[key] as string | undefined;
  if (!logoPath) {
    console.warn(`[text-paths] Unknown logo key "${key}" — valid keys: primary, monochrome, favicon, wordmark`);
    return null;
  }
  const relative = logoPath.startsWith('/') ? logoPath.slice(1) : logoPath;
  const absPath = path.join(process.cwd(), 'public', relative);
  let svgText: string;
  try {
    svgText = fs.readFileSync(absPath, 'utf-8');
  } catch (err) {
    console.warn(`[text-paths] Could not read logo "${key}" at ${absPath}:`, err);
    return null;
  }
  const { viewBox, paths } = parseSvgFile(svgText);
  // Return the original SVG file as markup (it may have multiple paths,
  // attributes, gradients, etc. that we want preserved verbatim). The
  // parsed paths + viewBox are also provided for consumers that want
  // raw geometry rather than the full document.
  return { paths, viewBox, markup: svgText };
}

/**
 * Resolve a phrase key from registry.json into a ResolvedSvg.
 * Returns null if the key isn't in the generated map.
 */
export function resolvePhraseToSvg(key: PhraseKey): ResolvedSvg | null {
  const meta = TEXT_PATHS_META[key];
  if (!meta) {
    console.warn(`[text-paths] Unknown phrase "${key}" — add it to src/lib/text-paths/registry.json and run npm run build:text-paths`);
    return null;
  }
  return {
    paths: meta.paths,
    viewBox: meta.viewBox,
    markup: buildSvgMarkup(meta.viewBox, meta.paths),
  };
}

/**
 * Dispatch helper for `logo:KEY` / `phrase:KEY` shorthand strings.
 * Returns null when input is not a recognised shorthand.
 */
export function resolveTraceShorthand(shorthand: string): ResolvedSvg | null {
  if (shorthand.startsWith('logo:')) {
    return resolveLogoToSvg(shorthand.slice('logo:'.length) as LogoKey);
  }
  if (shorthand.startsWith('phrase:')) {
    return resolvePhraseToSvg(shorthand.slice('phrase:'.length));
  }
  return null;
}
