/**
 * Regression test — (B) nested-slot validation locks.
 * Run: node --experimental-strip-types scripts/test-nested-locks.ts   (npm run test:locks)
 * Exits 1 on any failure. Mirrors validate-data's schema loading: ATOM schemas
 * into globalThis.__schemaMap (child-lookup), the 9 AUDITED_COMPONENTS as the
 * top-level gate.
 *
 * Proves, by deliberate good + bad input:
 *  - Card slots, FormField options[*].media, Badge/Button/Heading/List media —
 *    good passes (incl. child appearance props); wrong atom / bad child enum /
 *    unknown child prop / missing required all reject.
 *  - SCOPE RULE: validatePage's top-level walk validates AUDITED atoms only —
 *    unaudited scaffolding (Grid/Section) is skipped — while an audited atom's
 *    _lockProps media slot still deep-validates its child (the opt-in composition).
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateComponent, validatePage } from '../src/lib/schema-validator.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ATOMS = path.resolve(__dirname, '..', 'src', 'components', 'atoms');

const all = new Map<string, any>();
(function load(dir: string) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) load(f);
    else if (f.endsWith('.schema.json')) { try { const j = JSON.parse(readFileSync(f, 'utf8')); if (j.component) all.set(j.component, j); } catch {} }
  }
})(ATOMS);
(globalThis as any).__schemaMap = all;

const AUDITED = ['Badge', 'Button', 'FigCaption', 'FormField', 'Heading', 'Link', 'List', 'Text', 'Tooltip'];
const audited = new Map<string, any>();
for (const n of AUDITED) if (all.get(n)) audited.set(n, all.get(n));

let pass = 0, fail = 0;
const fails: string[] = [];
function check(ok: boolean, label: string, detail: () => string) {
  if (ok) { pass++; }
  else { fail++; fails.push(label); console.log(`  XX ${label}\n${detail()}`); }
}
// component-level (the locks)
function expectComp(label: string, comp: string, item: any, want: 'valid' | 'invalid', msg?: string) {
  const r = validateComponent(item, all.get(comp));
  const valid = r.valid;
  let ok = valid === (want === 'valid');
  if (want === 'invalid' && msg) ok = ok && r.errors.some(e => `${e.prop}: ${e.message}`.includes(msg));
  check(ok, label, () => r.errors.map(e => `        · ${e.prop}: ${e.message}`).join('\n') || '        (no errors)');
}
// page-level (the scope rule) — uses the audited-only top-level gate
function expectPage(label: string, page: any, want: 'valid' | 'invalid', msg?: string) {
  const errs = validatePage(page, audited).filter((e: any) => e.severity !== 'warn');
  let ok = (errs.length === 0) === (want === 'valid');
  if (want === 'invalid' && msg) ok = ok && errs.some((e: any) => e.message.includes(msg));
  check(ok, label, () => errs.map((e: any) => `        · ${e.message}`).join('\n') || '        (no errors)');
}

// ---------- Card slots ----------
const card = (slots: any) => ({ component: 'Card', cardType: 'horizontal', ...slots });
expectComp('Card good (title size/weight = appearance freedom)', 'Card', card({
  title: { component: 'Heading', contentHeading: 'Hi', level: 2, size: 'h2', weight: 'bold' },
  meta: { component: 'Text', contentText: 'meta', size: 'sm' },
  body: { component: 'Text', contentText: 'body' },
  button: { component: 'Button', contentButton: 'Go', variant: 'fill' },
  media: { component: 'Image', src: 'x.jpg', semanticRole: 'content-symbol', contentAltWord: 'cat' },
}), 'valid');
expectComp('Card title wrong atom', 'Card', card({ title: { component: 'Paragraph', contentHeading: 'x', level: 2 } }), 'invalid', 'title.component');
expectComp('Card title bad child enum (level 99)', 'Card', card({ title: { component: 'Heading', contentHeading: 'x', level: 99 } }), 'invalid', 'title.level');
expectComp('Card title unknown child prop (LOCK)', 'Card', card({ title: { component: 'Heading', contentHeading: 'x', level: 2, fontSize: 'huge' } }), 'invalid', 'title.fontSize');
expectComp('Card meta wrong atom', 'Card', card({ meta: { component: 'Span', contentText: 'm' } }), 'invalid', 'meta.component');
expectComp('Card body missing required (contentText)', 'Card', card({ body: { component: 'Text' } }), 'invalid', 'body.contentText');
expectComp('Card button wrong atom', 'Card', card({ button: { component: 'Link', contentButton: 'x' } }), 'invalid', 'button.component');

// ---------- FormField options[*].media + Button dropdownItems[*] ----------
const ff = (opts: any[]) => ({ component: 'FormField', id: 'fav', labelForm: 'Favourite', type: 'card-select', options: opts });
expectComp('FF option Image good (contentAlt satisfies rule)', 'FormField', ff([{ value: 'r', contentOption: 'Red', media: { component: 'Image', src: 'r.jpg', contentAlt: 'red' } }]), 'valid');
expectComp('FF option Icon good (labelIcon, real pattern)', 'FormField', ff([{ value: 'h', contentOption: 'Happy', media: { component: 'Icon', name: 'smiley-fill', labelIcon: 'smiley' } }]), 'valid');
expectComp('FF option decorative Image (no alt needed)', 'FormField', ff([{ value: 'b', contentOption: 'BG', media: { component: 'Image', src: 'b.jpg', semanticRole: 'decorative' } }]), 'valid');
expectComp('FF option media wrong component', 'FormField', ff([{ value: 'v', contentOption: 'V', media: { component: 'Video', src: 'v.jpg' } }]), 'invalid', 'options[0].media.component');
expectComp('FF option media bad child enum (fit)', 'FormField', ff([{ value: 'g', contentOption: 'G', media: { component: 'Image', src: 'g.jpg', contentAlt: 'g', fit: 'bogus' } }]), 'invalid', 'options[0].media.fit');
expectComp('FF option media unknown child prop (LOCK)', 'FormField', ff([{ value: 'p', contentOption: 'P', media: { component: 'Image', src: 'p.jpg', contentAlt: 'p', bogusProp: 'x' } }]), 'invalid', 'options[0].media.bogusProp');
expectComp('FF unknown option-level prop', 'FormField', ff([{ value: 'p', contentOption: 'P', notAnOptionProp: 'x' }]), 'invalid', 'options[0].notAnOptionProp');
expectComp('FF missing required option prop (contentOption)', 'FormField', ff([{ value: 'p' }]), 'invalid', 'options[0].contentOption');
const btn = (extra: any) => ({ component: 'Button', contentButton: 'Menu', shape: 'dropdown', ...extra });
expectComp('Button dropdownItems good', 'Button', btn({ dropdownItems: [{ label: 'One', href: '/1' }, { label: 'Two', fontFamily: 'mono' }] }), 'valid');
expectComp('Button dropdownItems unknown item prop', 'Button', btn({ dropdownItems: [{ label: 'One', bogus: 'x' }] }), 'invalid', 'dropdownItems[0].bogus');
expectComp('Button dropdownItems bad fontFamily enum', 'Button', btn({ dropdownItems: [{ label: 'One', fontFamily: 'comic-sans' }] }), 'invalid', 'dropdownItems[0].fontFamily');

// ---------- Badge / Button / Heading / List media ----------
const bases: Record<string, (m: any) => any> = {
  Badge: (m) => ({ component: 'Badge', contentBadge: 'New', media: m }),
  Button: (m) => ({ component: 'Button', contentButton: 'Go', media: m }),
  Heading: (m) => ({ component: 'Heading', contentHeading: 'Title', level: 2, media: m }),
  List: (m) => ({ component: 'List', contentList: ['one', 'two'], media: m }),
};
const goodIcon = { component: 'Icon', name: 'star', weight: 'bold', size: 'lg', semanticRole: 'decorative' };
const badComponent: Record<string, string> = { Badge: 'Image', Button: 'Shape', Heading: 'Text', List: 'Image' };
for (const atom of ['Badge', 'Button', 'Heading', 'List']) {
  const b = bases[atom];
  expectComp(`${atom}.media good Icon (appearance freedom)`, atom, b(goodIcon), 'valid');
  expectComp(`${atom}.media wrong-but-real atom`, atom, b({ component: badComponent[atom], name: 'x', semanticRole: 'decorative' }), 'invalid', 'media.component');
  expectComp(`${atom}.media bad child enum (weight)`, atom, b({ component: 'Icon', name: 'star', weight: 'heavy', semanticRole: 'decorative' }), 'invalid', 'media.weight');
  expectComp(`${atom}.media unknown child prop (LOCK)`, atom, b({ component: 'Icon', name: 'star', bogusProp: 'x', semanticRole: 'decorative' }), 'invalid', 'media.bogusProp');
}
expectComp('Heading.media good Image child', 'Heading', bases.Heading({ component: 'Image', src: 'x.jpg', fit: 'cover', semanticRole: 'decorative' }), 'valid');
expectComp('Heading.media Image bad enum (fit)', 'Heading', bases.Heading({ component: 'Image', src: 'x.jpg', fit: 'bogus', semanticRole: 'decorative' }), 'invalid', 'media.fit');
expectComp('Heading.media good Shape child', 'Heading', bases.Heading({ component: 'Shape', shape: 'hexagon', semanticRole: 'decorative' }), 'valid');
expectComp('List.media good Shape child', 'List', bases.List({ component: 'Shape', shape: 'circle', semanticRole: 'decorative' }), 'valid');
expectComp('List.media Shape bad enum (shape)', 'List', bases.List({ component: 'Shape', shape: 'blobby', semanticRole: 'decorative' }), 'invalid', 'media.shape');

// ---------- SCOPE RULE ----------
// Unaudited scaffolding (Grid/Section) with deliberately bad props is SKIPPED at
// the top-level walk — it neither passes nor fails the audited atom's page.
expectPage('scope: unaudited Grid scaffold (bad variant) skipped; audited child good',
  { component: 'Page', children: [{ component: 'Grid', variant: 'BOGUS', columns: 99, children: [{ component: 'Badge', contentBadge: 'x' }] }] }, 'valid');
expectPage('scope: unaudited Section scaffold (bad gap) skipped; audited child good',
  { component: 'Page', children: [{ component: 'Section', gap: '9xl', children: [{ component: 'Text', contentText: 'hi' }] }] }, 'valid');
// ...but the media-lock on an audited atom STILL fires inside that scaffolding.
expectPage('scope: media-lock fires on audited atom inside skipped scaffold',
  { component: 'Page', children: [{ component: 'Grid', variant: 'BOGUS', children: [{ component: 'Badge', contentBadge: 'x', media: { component: 'Icon', name: 'y', bogusProp: 'z', semanticRole: 'decorative' } }] }] }, 'invalid', 'media.bogusProp');

console.log(`\n[test:locks] ${pass} passed, ${fail} failed`);
if (fail) { console.log(`[test:locks] FAILURES: ${fails.join(' | ')}`); process.exit(1); }
console.log('[test:locks] ✓ all nested-slot locks + scope rule verified');
