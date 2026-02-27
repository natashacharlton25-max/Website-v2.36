/**
 * Metadata extraction — pulls structural info from asset content.
 * SVG: viewBox, width, height, hasGradients
 * Lottie: width, height, frameRate, duration, totalFrames
 * Binary: dimensions from headers where possible
 */

export function extractSvgMetadata(svg: string): Record<string, unknown> {
  const meta: Record<string, unknown> = {};

  // viewBox
  const vbMatch = svg.match(/viewBox=["']([^"']+)["']/);
  if (vbMatch) {
    meta.viewBox = vbMatch[1];
    const parts = vbMatch[1].split(/\s+/).map(Number);
    if (parts.length === 4) {
      meta.width = parts[2];
      meta.height = parts[3];
    }
  }

  // Explicit width/height attrs (override viewBox-derived)
  const wMatch = svg.match(/<svg[^>]+width=["'](\d+)/);
  const hMatch = svg.match(/<svg[^>]+height=["'](\d+)/);
  if (wMatch) meta.width = parseInt(wMatch[1], 10);
  if (hMatch) meta.height = parseInt(hMatch[1], 10);

  // Has gradients?
  meta.hasGradients = /<(linearGradient|radialGradient)/.test(svg);

  return meta;
}

export function extractLottieMetadata(json: string): Record<string, unknown> {
  try {
    const data = JSON.parse(json);
    return {
      width: data.w ?? null,
      height: data.h ?? null,
      frameRate: data.fr ?? null,
      totalFrames: data.op != null && data.ip != null ? data.op - data.ip : null,
      duration: data.fr && data.op != null && data.ip != null
        ? (data.op - data.ip) / data.fr
        : null,
    };
  } catch {
    return {};
  }
}

/** Extract PNG dimensions from first 24 bytes of IHDR chunk */
export function extractPngDimensions(buffer: ArrayBuffer): Record<string, unknown> {
  const view = new DataView(buffer);
  // PNG header: 8 bytes magic + 4 len + 4 IHDR + 4 width + 4 height
  if (buffer.byteLength >= 24) {
    return {
      width: view.getUint32(16),
      height: view.getUint32(20),
    };
  }
  return {};
}

export function extractMetadata(type: string, content: string | ArrayBuffer): string {
  let meta: Record<string, unknown> = {};

  if (type === 'svg' && typeof content === 'string') {
    meta = extractSvgMetadata(content);
  } else if (type === 'lottie' && typeof content === 'string') {
    meta = extractLottieMetadata(content);
  } else if (type === 'png' && content instanceof ArrayBuffer) {
    meta = extractPngDimensions(content);
  }

  return JSON.stringify(meta);
}
