globalThis.process ??= {}; globalThis.process.env ??= {};
function escHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function pictogramCard(word, src) {
  const clean = word.replace(/[.,!?;:]+$/, "");
  return `<span class="aac-card"><img class="aac-card__pictogram" src="${escHtml(src)}" alt="${escHtml(clean)}" width="32" height="32" loading="lazy" /><span class="aac-card__word">${escHtml(word)}</span></span>`;
}
function iconCard(word, svg) {
  const styledSvg = svg.replace(
    "<svg",
    '<svg class="aac-card__icon" aria-hidden="true" width="32" height="32"'
  );
  return `<span class="aac-card aac-card--icon">${styledSvg}<span class="aac-card__word">${escHtml(word)}</span></span>`;
}
function textOnlyCard(word) {
  return `<span class="aac-card aac-card--text-only"><span class="aac-card__word">${escHtml(word)}</span></span>`;
}

export { iconCard as i, pictogramCard as p, textOnlyCard as t };
