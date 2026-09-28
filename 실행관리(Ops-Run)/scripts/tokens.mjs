// Reads the two token layers, one file per kind (primitive/<kind>.css → semantic/<kind>.css).
// Enforces that each role points at a primitive of its own kind, that a token's name matches the
// file it lives in, that part CSS reads only --p-* roles and writes no raw values, and resolves
// values for distribution.
import fs from 'node:fs';
import path from 'node:path';

export const kinds = ['color', 'typography', 'text', 'weight', 'leading', 'tracking', 'space', 'size', 'radius', 'border', 'shadow', 'opacity', 'motion', 'layer', 'breakpoint'];
// Primitive name prefixes per kind file. A primitive in the wrong file stops the build.
const prefixes = {
  color: ['--color-'], typography: ['--font-'], text: ['--text-'], weight: ['--weight-'], leading: ['--leading-'], tracking: ['--tracking-'],
  space: ['--space-'], size: ['--size-'], radius: ['--radius-'], border: ['--border-'], shadow: ['--shadow-'], opacity: ['--opacity-'],
  motion: ['--duration-', '--ease-'], layer: ['--layer-'], breakpoint: ['--bp-']
};
const allPrefixes = Object.values(prefixes).flat();
for (const a of allPrefixes) for (const b of allPrefixes) if (a !== b && b.startsWith(a)) throw new Error(`tokens.mjs: prefix ${b} overlaps ${a}`);
if (kinds.some(kind => !prefixes[kind])) throw new Error('tokens.mjs: every kind needs a prefix');
const primitiveRead = new RegExp(`var\\((${allPrefixes.join('|')})[\\w-]*`);

// Every token source file, in load order (primitive → semantic).
export function tokenFiles() {
  return [...kinds.map(kind => `src/tokens/primitive/${kind}.css`), ...kinds.map(kind => `src/tokens/semantic/${kind}.css`)];
}

// Raw-value guard for part and screen CSS. Covered properties may carry numbers only through
// var(--p-*) roles; the allowlist below is the complete set of bare numbers they may keep.
const guarded = /^(font|font-size|font-weight|line-height|letter-spacing|(padding|margin)(-[a-z-]+)?|(row-|column-)?gap|(border|outline)(-[a-z-]+)?|(min-|max-)?(width|height|inline-size|block-size)|opacity|z-index|(transition|animation)(-[a-z-]+)?|--[\w-]+)$/;
const allowed = [
  /^-?0(\.0+)?[a-z%]*$/,       // zero: no amount, the same in every unit
  /^100%$/,                     // fill the containing box
  /^100d?v[hw]$/,               // the whole viewport
];
const bareNumber = /(?<![\w.#-])-?\d*\.?\d+[a-z%]*/g;
// Innermost rule bodies of a stylesheet, with the selector or at-rule prelude in front of each.
const ruleBodies = css => {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return [...text.matchAll(/\{([^{}]*)\}/g)].map(match => ({ body: match[1], at: match.index }));
};
export function rawValues(css) {
  const found = [];
  for (const { body } of ruleBodies(css)) {
    for (const declaration of body.split(';')) {
      const colon = declaration.indexOf(':');
      if (colon < 0) continue;
      const property = declaration.slice(0, colon).trim();
      if (!guarded.test(property)) continue;
      const value = declaration.slice(colon + 1)
        .replace(/!important/g, '')
        .replace(/var\(--[\w-]+\)/g, ' ')          // a role read carries no raw value
        .replace(/var\(--[\w-]+\s*,/g, '(')         // a fallback does, so keep scanning it
        .replace(/\*\s*-1(?![\d.])/g, ' ')          // calc(role * -1) flips a role's sign
        .replace(/#[0-9a-f]{3,8}\b/gi, ' ');        // colours have their own hex check
      for (const [token] of value.matchAll(bareNumber)) if (!allowed.some(rule => rule.test(token))) found.push({ property, token });
    }
  }
  return found;
}
// px widths written in @media / @container preludes (custom properties cannot be read there).
const queryWidths = css => [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/@(media|container)\b([^{]*)\{/g)]
  .flatMap(([, , prelude]) => [...prelude.matchAll(/(\d*\.?\d+)(px|em|rem)\b/g)].map(([token, number, unit]) => ({ token, px: unit === 'px' ? Number(number) : NaN })));

const declarations = (text, file) => {
  const result = {};
  for (const [, name, value] of text.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    if (name in result) throw new Error(`${file}: ${name} declared twice`);
    result[name] = value.trim();
  }
  return result;
};
const block = (text, selector, file) => {
  const match = text.replace(/\/\*[\s\S]*?\*\//g, '').match(new RegExp(selector + '\\s*\\{([^}]*)\\}'));
  if (!match) throw new Error(`${file}: missing ${selector} block`);
  return match[1];
};
const reference = value => value.match(/^var\((--[\w-]+)\)$/)?.[1];

export function loadTokens(root) {
  const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/^﻿/, '');
  const claim = (seen, name, file) => {
    if (seen.has(name)) throw new Error(`${file}: ${name} already declared in ${seen.get(name)}`);
    seen.set(name, file);
  };

  // Layer 1: raw values only, name prefix fixed by the kind file.
  const primitive = {}, primitiveKind = {}, primitiveSeen = new Map();
  for (const kind of kinds) {
    const file = `src/tokens/primitive/${kind}.css`;
    for (const [name, value] of Object.entries(declarations(block(read(file), ':root', file), file))) {
      if (!prefixes[kind].some(prefix => name.startsWith(prefix))) throw new Error(`${file}: ${name} must start with ${prefixes[kind].join(' or ')}`);
      if (value.includes('var(')) throw new Error(`${file}: primitive ${name} must be a raw value`);
      claim(primitiveSeen, name, file);
      primitive[name] = value;
      primitiveKind[name] = kind;
    }
  }
  // Registered query widths: every --bp-* primitive, in px.
  const breakpoints = new Set(Object.entries(primitive).filter(([name]) => primitiveKind[name] === 'breakpoint').map(([name, value]) => {
    if (!/^\d+px$/.test(value)) throw new Error(`src/tokens/primitive/breakpoint.css: ${name} must be whole px`);
    return parseInt(value, 10);
  }));

  // Layer 2: --p-* roles, each pointing at one primitive of the same kind.
  const semanticText = Object.fromEntries(kinds.map(kind => [kind, read(`src/tokens/semantic/${kind}.css`)]));
  const roleKind = {};
  const semantic = style => {
    const vars = {}, seen = new Map();
    for (const kind of kinds) {
      const file = `src/tokens/semantic/${kind}.css`;
      for (const [name, value] of Object.entries(declarations(block(semanticText[kind], '\\.theme-' + style, file), file))) {
        const target = reference(value);
        if (!name.startsWith('--p-')) throw new Error(`${file}: semantic ${name} must be named --p-*`);
        if (!(target in primitive)) throw new Error(`${file}: semantic ${name} must be var(--primitive), got ${value}`);
        if (primitiveKind[target] !== kind) throw new Error(`${file}: ${name} points at ${target}, a ${primitiveKind[target]} primitive`);
        claim(seen, name, file);
        vars[name] = value;
        roleKind[name] = kind;
      }
    }
    return vars;
  };
  const main = semantic('main');

  // Semantic value of one role in one style, resolved down to its raw primitive value.
  const resolve = (style, name) => primitive[reference(semantic(style)[name])];
  // Token kinds a piece of part or screen CSS reads. It reads --p-* roles only and writes no raw
  // values: a primitive read, an unknown role, a bare number in a covered property or a query
  // width that is not a registered breakpoint stops the build.
  const kindsIn = (css, where) => {
    const raw = css.match(primitiveRead);
    if (raw) throw new Error(`${where}: reads primitive ${raw[1]}…; parts read --p-* roles only`);
    const values = rawValues(css);
    if (values.length) throw new Error(`${where}: ${values.length} raw value(s), use a --p-* role: ${values.slice(0, 8).map(v => `${v.property}:${v.token}`).join(', ')}`);
    const widths = queryWidths(css);
    const stray = widths.filter(width => !breakpoints.has(width.px));
    if (stray.length) throw new Error(`${where}: query width ${stray.map(w => w.token).join(', ')} is not a breakpoint; register it in src/tokens/primitive/breakpoint.css (${[...breakpoints].join('/')})`);
    const found = new Set(widths.length ? ['breakpoint'] : []);
    for (const [, name] of css.matchAll(/var\((--p-[\w-]+)/g)) {
      if (!(name in main)) throw new Error(`${where}: ${name} is not a semantic role`);
      found.add(roleKind[name]);
    }
    return kinds.filter(kind => found.has(kind));
  };
  // Semantic roles of a style (optionally one kind set) as raw values, for installs that ship without primitives.
  const styleCSS = (style, only = kinds, selector = `.ds[data-style="${style}"]`) => `${selector}{${Object.keys(semantic(style)).filter(name => only.includes(roleKind[name])).map(name => `${name}:${resolve(style, name)};`).join('')}}\n`;
  return { primitive, semantic, resolve, kindsIn, styleCSS, roleKind };
}
