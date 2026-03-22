/**
 * Custom Caret System
 *
 * Hides OS caret (caret-color: transparent via CSS) and renders a
 * custom caret element positioned via selectionStart.
 *
 * Fully tokenised:
 *   --caret-width, --caret-color, --caret-blink-speed, --caret-radius
 *
 * Gate-aware:
 *   data-hover="none"    → solid, no blink
 *   data-hover="gentle"  → slow pulse (2s)
 *   data-focus-rainbow   → colour cycles with rainbow tokens
 *   data-enhanced-focus  → thicker (4px)
 *
 * Activated by data-custom-caret on <html>.
 */

let _caretEl: HTMLElement | null = null;
let _activeInput: HTMLInputElement | HTMLTextAreaElement | null = null;
let _measurer: HTMLSpanElement | null = null;
let _raf: number | null = null;

function createCaret(): HTMLElement {
  const el = document.createElement('span');
  el.className = 'form-field__caret';
  el.setAttribute('aria-hidden', 'true');
  return el;
}

function createMeasurer(): HTMLSpanElement {
  const el = document.createElement('span');
  el.className = 'form-field__caret-measurer';
  el.setAttribute('aria-hidden', 'true');
  return el;
}

function positionCaret(input: HTMLInputElement | HTMLTextAreaElement, caret: HTMLElement, measurer: HTMLSpanElement) {
  const pos = input.selectionStart ?? 0;
  const text = input.value.slice(0, pos);

  // Copy font styles to measurer
  const styles = getComputedStyle(input);
  measurer.style.font = styles.font;
  measurer.style.letterSpacing = styles.letterSpacing;
  measurer.style.wordSpacing = styles.wordSpacing;
  measurer.style.textTransform = styles.textTransform;
  measurer.style.whiteSpace = 'pre';

  // For textarea, handle line wrapping
  if (input.tagName === 'TEXTAREA') {
    measurer.style.whiteSpace = 'pre-wrap';
    measurer.style.wordBreak = 'break-word';
    measurer.style.width = `${input.clientWidth}px`;
  }

  measurer.textContent = text || '\u200B'; // Zero-width space for empty input

  // Get position
  const inputRect = input.getBoundingClientRect();
  const paddingLeft = parseFloat(styles.paddingLeft) || 0;
  const paddingTop = parseFloat(styles.paddingTop) || 0;

  // Append measurer temporarily to get dimensions
  input.parentNode?.appendChild(measurer);

  if (input.tagName === 'TEXTAREA') {
    // For textarea: use measurer height for vertical position
    const lines = measurer.offsetHeight;
    const lastLine = measurer.textContent.split('\n').pop() || '';
    const lastLineMeasurer = document.createElement('span');
    lastLineMeasurer.style.font = styles.font;
    lastLineMeasurer.style.letterSpacing = styles.letterSpacing;
    lastLineMeasurer.style.visibility = 'hidden';
    lastLineMeasurer.style.position = 'absolute';
    lastLineMeasurer.style.whiteSpace = 'pre';
    lastLineMeasurer.textContent = lastLine || '\u200B';
    document.body.appendChild(lastLineMeasurer);

    caret.style.left = `${paddingLeft + lastLineMeasurer.offsetWidth}px`;
    caret.style.top = `${paddingTop + lines - parseFloat(styles.lineHeight || styles.fontSize)}px`;
    lastLineMeasurer.remove();
  } else {
    // For input: simple horizontal position
    caret.style.left = `${paddingLeft + measurer.offsetWidth}px`;
    caret.style.top = `${paddingTop}px`;
  }

  // Set caret height to match line-height
  const lineHeight = parseFloat(styles.lineHeight) || parseFloat(styles.fontSize) * 1.2;
  caret.style.height = `${lineHeight}px`;

  measurer.remove();
}

function showCaret(input: HTMLInputElement | HTMLTextAreaElement) {
  if (_activeInput === input && _caretEl) return;

  hideCaret();

  _activeInput = input;
  _caretEl = createCaret();
  _measurer = createMeasurer();

  // Insert caret into the form-field wrapper (relative positioned)
  const wrapper = input.closest('.form-field');
  if (wrapper) {
    wrapper.appendChild(_caretEl);
  } else {
    // Fallback: insert next to input
    input.parentNode?.appendChild(_caretEl);
  }

  // Rainbow: set initial colour
  updateCaretColour();

  positionCaret(input, _caretEl, _measurer);
  _caretEl.classList.add('form-field__caret--visible');

  // Track position changes
  const update = () => {
    if (_activeInput && _caretEl && _measurer) {
      positionCaret(_activeInput, _caretEl, _measurer);
      updateCaretColour();
    }
    _raf = requestAnimationFrame(update);
  };
  _raf = requestAnimationFrame(update);
}

function hideCaret() {
  if (_raf) {
    cancelAnimationFrame(_raf);
    _raf = null;
  }
  if (_caretEl) {
    _caretEl.remove();
    _caretEl = null;
  }
  _activeInput = null;
}

function updateCaretColour() {
  if (!_caretEl) return;

  const html = document.documentElement;
  if (html.hasAttribute('data-focus-rainbow')) {
    // Use current rainbow focus colour
    const focusColor = getComputedStyle(html).getPropertyValue('--focus-color').trim();
    if (focusColor) {
      _caretEl.style.setProperty('--caret-color', focusColor);
    }
  }
}

export function initCustomCaret() {
  // Only activate when data-custom-caret is on <html>
  const html = document.documentElement;
  if (!html.hasAttribute('data-custom-caret')) return;

  document.addEventListener('focusin', (e) => {
    const target = e.target as HTMLElement;
    if (target.matches('input[type="text"], input[type="email"], input[type="search"], input[type="url"], input[type="tel"], input[type="password"], input[type="number"], textarea')) {
      showCaret(target as HTMLInputElement | HTMLTextAreaElement);
    }
  });

  document.addEventListener('focusout', () => {
    hideCaret();
  });

  // Also update on click (mouse repositions cursor)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (_activeInput && target === _activeInput) {
      setTimeout(() => {
        if (_activeInput && _caretEl && _measurer) {
          positionCaret(_activeInput, _caretEl, _measurer);
        }
      }, 0);
    }
  });

  // Update on input (typing moves cursor)
  document.addEventListener('input', () => {
    if (_activeInput && _caretEl && _measurer) {
      positionCaret(_activeInput, _caretEl, _measurer);
    }
  });
}
