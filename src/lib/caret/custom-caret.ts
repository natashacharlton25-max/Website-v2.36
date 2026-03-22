/**
 * Custom Caret System
 *
 * Hides OS caret (caret-color: transparent via CSS) and renders a
 * custom caret element positioned via selectionStart.
 *
 * TRACKS cursor position on every keypress, click, arrow key, and selection change.
 * Uses a hidden measurer span with inherited font styles to calculate pixel position.
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

const INPUT_SELECTOR = 'input[type="text"], input[type="email"], input[type="search"], input[type="url"], input[type="tel"], input[type="password"], input[type="number"], textarea';

function createCaret(): HTMLElement {
  const el = document.createElement('span');
  el.className = 'form-field__caret';
  el.setAttribute('aria-hidden', 'true');
  return el;
}

function updateCaretPosition() {
  if (!_activeInput || !_caretEl) return;

  const input = _activeInput;
  const pos = input.selectionStart ?? 0;
  const text = input.value.slice(0, pos);

  // Create measurer with inherited font styles
  const measurer = document.createElement('span');
  const styles = getComputedStyle(input);
  measurer.style.cssText = 'font:inherit;visibility:hidden;position:absolute;white-space:pre;top:0;left:0;';
  measurer.style.font = styles.font;
  measurer.style.letterSpacing = styles.letterSpacing;
  measurer.style.wordSpacing = styles.wordSpacing;
  measurer.style.textTransform = styles.textTransform;

  const paddingLeft = parseFloat(styles.paddingLeft) || 0;
  const paddingTop = parseFloat(styles.paddingTop) || 0;
  const lineHeight = parseFloat(styles.lineHeight) || parseFloat(styles.fontSize) * 1.2;

  if (input.tagName === 'TEXTAREA') {
    // Textarea: handle line wrapping
    measurer.style.whiteSpace = 'pre-wrap';
    measurer.style.wordBreak = 'break-word';
    measurer.style.width = `${input.clientWidth - paddingLeft - (parseFloat(styles.paddingRight) || 0)}px`;
    measurer.textContent = text || '\u200B';
    input.parentNode?.appendChild(measurer);

    // Get height of all text up to cursor
    const fullHeight = measurer.offsetHeight;

    // Get width of last line only
    const lastLine = text.split('\n').pop() || '';
    const lastLineMeasurer = document.createElement('span');
    lastLineMeasurer.style.cssText = `font:${styles.font};visibility:hidden;position:absolute;white-space:pre;letter-spacing:${styles.letterSpacing};`;
    lastLineMeasurer.textContent = lastLine || '\u200B';
    document.body.appendChild(lastLineMeasurer);

    // Position caret relative to input's position within form-field
    const inputRect = input.getBoundingClientRect();
    const wrapperRect = (input.closest('.form-field') || input.parentNode as Element).getBoundingClientRect();
    const offsetLeft = inputRect.left - wrapperRect.left;
    const offsetTop = inputRect.top - wrapperRect.top;

    _caretEl.style.left = `${offsetLeft + paddingLeft + lastLineMeasurer.offsetWidth}px`;
    _caretEl.style.top = `${offsetTop + paddingTop + fullHeight - lineHeight - input.scrollTop}px`;

    lastLineMeasurer.remove();
    measurer.remove();
  } else {
    // Single-line input
    measurer.textContent = text || '\u200B';
    input.parentNode?.appendChild(measurer);

    // Position relative to form-field wrapper
    const inputRect = input.getBoundingClientRect();
    const wrapperRect = (input.closest('.form-field') || input.parentNode as Element).getBoundingClientRect();
    const offsetLeft = inputRect.left - wrapperRect.left;
    const offsetTop = inputRect.top - wrapperRect.top;

    _caretEl.style.left = `${offsetLeft + paddingLeft + measurer.offsetWidth}px`;
    _caretEl.style.top = `${offsetTop + paddingTop}px`;

    measurer.remove();
  }

  // Set caret height
  _caretEl.style.height = `${lineHeight}px`;

  // Rainbow colour sync
  if (document.documentElement.hasAttribute('data-focus-rainbow')) {
    const focusColor = getComputedStyle(document.documentElement).getPropertyValue('--focus-color').trim();
    if (focusColor) {
      _caretEl.style.setProperty('--caret-color', focusColor);
    }
  }
}

function showCaret(input: HTMLInputElement | HTMLTextAreaElement) {
  if (_activeInput === input && _caretEl) return;

  hideCaret();

  _activeInput = input;
  _caretEl = createCaret();

  // Insert into form-field wrapper (has position: relative)
  const wrapper = input.closest('.form-field');
  if (wrapper) {
    wrapper.appendChild(_caretEl);
  } else {
    input.parentNode?.appendChild(_caretEl);
  }

  // Initial position
  updateCaretPosition();
  _caretEl.classList.add('form-field__caret--visible');

  // Attach tracking listeners directly to the input
  input.addEventListener('input', updateCaretPosition);
  input.addEventListener('click', handleDelayedUpdate);
  input.addEventListener('keyup', updateCaretPosition);
  input.addEventListener('select', updateCaretPosition);
  input.addEventListener('mouseup', handleDelayedUpdate);
}

function handleDelayedUpdate() {
  // Click/mouseup: selectionStart updates after the event
  setTimeout(updateCaretPosition, 0);
}

function hideCaret() {
  if (_activeInput) {
    _activeInput.removeEventListener('input', updateCaretPosition);
    _activeInput.removeEventListener('click', handleDelayedUpdate);
    _activeInput.removeEventListener('keyup', updateCaretPosition);
    _activeInput.removeEventListener('select', updateCaretPosition);
    _activeInput.removeEventListener('mouseup', handleDelayedUpdate);
  }
  if (_caretEl) {
    _caretEl.remove();
    _caretEl = null;
  }
  _activeInput = null;
}

export function initCustomCaret() {
  // Check attribute at focus time, not init time — setting may load after init
  document.addEventListener('focusin', (e) => {
    if (!document.documentElement.hasAttribute('data-custom-caret')) return;
    const target = e.target as HTMLElement;
    if (target.matches(INPUT_SELECTOR)) {
      showCaret(target as HTMLInputElement | HTMLTextAreaElement);
    }
  });

  document.addEventListener('focusout', () => {
    hideCaret();
  });

  // selectionchange covers arrow keys, home/end, shift+arrows
  document.addEventListener('selectionchange', () => {
    if (!document.documentElement.hasAttribute('data-custom-caret')) return;
    if (_activeInput && document.activeElement === _activeInput) {
      updateCaretPosition();
    }
  });
}
