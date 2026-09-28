// Reads the two token layers, one file per kind (primitive/<kind>.css → semantic/<kind>.css).
// Enforces that each role points at a primitive of its own kind (or composes other roles), that a
// token's name matches the file it lives in, that part CSS reads only --p-* roles and writes no raw
// values, and resolves values for distribution.
import fs from 'node:fs';
import path from 'node:path';

export const kinds = ['color', 'gradient', 'typography', 'text', 'weight', 'leading', 'tracking', 'space', 'size', 'container', 'radius', 'border', 'stroke', 'shadow', 'blur', 'opacity', 'aspect', 'motion', 'layer', 'breakpoint'];
// Korean display name of each kind; the registry names its token item "<label> 토큰".
export const kindLabels = {
  color: '색', gradient: '그러데이션', typography: '글꼴', text: '글자 크기', weight: '굵기', leading: '줄 간격', tracking: '자간',
  space: '간격', size: '크기', container: '너비', radius: '모서리', border: '테두리', stroke: '선 모양', shadow: '그림자', blur: '흐림',
  opacity: '불투명도', aspect: '비율', motion: '움직임', layer: '쌓임 순서', breakpoint: '화면 폭 기준'
};
// Primitive name prefixes per kind file. A primitive in the wrong file stops the build.
const prefixes = {
  color: ['--color-'], gradient: ['--gradient-'], typography: ['--font-'], text: ['--text-'], weight: ['--weight-'], leading: ['--leading-'],
  tracking: ['--tracking-'], space: ['--space-'], size: ['--size-'], container: ['--container-'], radius: ['--radius-'], border: ['--border-'],
  stroke: ['--stroke-'], shadow: ['--shadow-'], blur: ['--blur-'], opacity: ['--opacity-'], aspect: ['--aspect-'],
  motion: ['--duration-', '--ease-', '--distance-'], layer: ['--layer-'], breakpoint: ['--bp-']
};
const allPrefixes = Object.values(prefixes).flat();
for (const a of allPrefixes) for (const b of allPrefixes) if (a !== b && b.startsWith(a)) throw new Error(`tokens.mjs: prefix ${b} overlaps ${a}`);
if (kinds.some(kind => !prefixes[kind] || !kindLabels[kind])) throw new Error('tokens.mjs: every kind needs a prefix and a label');
const primitiveRead = new RegExp(`var\\((${allPrefixes.join('|')})[\\w-]*`);

// Every token source file, in load order (primitive → semantic).
export function tokenFiles() {
  return [...kinds.map(kind => `src/tokens/primitive/${kind}.css`), ...kinds.map(kind => `src/tokens/semantic/${kind}.css`)];
}

// Raw-value guard for part and screen CSS. Every property is covered, custom properties included:
// numbers reach a declaration only through var(--p-*) roles. allowedToken is the complete list of
// bare numbers a declaration may keep, each with the reason it is not a design value.
const counted = /^(order|grid-(column|row|area)(-start|-end)?|flex(-grow|-shrink)?|(-webkit-)?line-clamp)$/;
const quarterTurns = new Set([45, 90, 180, 270, 360]);
export function allowedToken(property, token, { fn = '', prev = '' } = {}) {
  if (/^-?0(\.0+)?[a-z%]*$/.test(token)) return 'zero: no amount, the same in every unit';
  if (/^-?100%$/.test(token)) return 'the whole box, or a move by the element\'s own size';
  if (/^100[dsl]?v[hw]$/.test(token)) return 'the whole viewport';
  if (/^-?50%$/.test(token) && !/radius/.test(property)) return 'centring: half of the box';
  if (/^\d*\.?\d+fr$/.test(token)) return 'proportional grid track';
  const turn = token.match(/^-?(\d+)deg$/);
  if (turn && quarterTurns.has(Number(turn[1]))) return 'quarter or half turn (direction, not a design value)';
  if (['calc', 'min', 'max', 'clamp'].includes(fn) && (prev === '*' || prev === '/') && /^\d+$/.test(token)) return 'a count that multiplies or divides a role';
  if (fn === 'calc' && prev === '*' && token === '1%') return 'unit converter for a unitless custom property';
  if (/^-?\d*\.?\d+$/.test(token) && (counted.test(property) || (fn === 'repeat' && prev === '(') || prev === 'n')) return 'structural count or flex factor';
  if (property === 'zoom' && token === '1') return 'identity zoom';
  return '';
}
const bareNumber = /(?<![\w.#-])-?\d*\.?\d+[a-z%]*/g;
const styleKeywords = /\b(dashed|dotted|double|groove|ridge|inset|outset)\b/;
// Blank out everything that carries no raw value, keeping string length so indexes stay valid.
export function maskValue(value) {
  const blank = text => ' '.repeat(text.length);
  return value
    .replace(/"[^"]*"|'[^']*'/g, blank)                                   // strings
    .replace(/url\([^)]*\)/g, blank)                                      // file and data URLs
    .replace(/!important/g, blank)
    .replace(/var\(--[\w-]+\s*,/g, m => 'var(' + ' '.repeat(m.length - 4)) // a fallback carries a value, keep scanning it
    .replace(/var\(--[\w-]+\)/g, blank)                                   // a role read carries no raw value
    .replace(/\*\s*-1(?![\d.])/g, blank)                                  // calc(role * -1) flips a role's sign
    .replace(/#[0-9a-f]{3,8}\b/gi, blank);                                // colours have their own hex check
}
// Bare numbers of one value with the function they sit in and the character before them.
export function numbersIn(value) {
  const masked = maskValue(value), found = [], stack = [];
  const fnAt = [];
  for (let i = 0; i < masked.length; i++) {
    if (masked[i] === '(') stack.push((masked.slice(0, i).match(/([\w-]+)\s*$/) || [, ''])[1]);
    else if (masked[i] === ')') stack.pop();
    fnAt[i] = stack[stack.length - 1] || '';
  }
  for (const match of masked.matchAll(bareNumber)) {
    const before = masked.slice(0, match.index).trimEnd();
    const prev = /\bspan$/.test(before) ? 'n' : before.slice(-1);
    found.push({ token: match[0], index: match.index, fn: fnAt[match.index] || '', prev, masked });
  }
  return found;
}
// Innermost rule bodies of a stylesheet (at-rule preludes such as @supports are not bodies).
const ruleBodies = css => [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/\{([^{}]*)\}/g)].map(match => match[1]);
export function rawValues(css) {
  const found = [];
  for (const body of ruleBodies(css)) {
    for (const declaration of body.split(/;(?![^(]*\))/)) {
      const colon = declaration.indexOf(':');
      if (colon < 0) continue;
      const property = declaration.slice(0, colon).trim(), value = declaration.slice(colon + 1);
      for (const number of numbersIn(value)) if (!allowedToken(property, number.token, number)) found.push({ property, token: number.token });
      if (/^(border|outline)(-[a-z-]+)?$/.test(property) && !/radius|width|offset|color|image|collapse|spacing/.test(property)) {
        const keyword = maskValue(value).match(styleKeywords);
        if (keyword) found.push({ property, token: keyword[1] });
      }
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
const refsOf = value => [...value.matchAll(/var\((--[\w-]+)\)/g)].map(match => match[1]);

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

  // Layer 2: --p-* roles. A role is var(--own-kind primitive), or a composite written only with
  // own-kind primitives and other --p-* roles (no bare number left once the var() reads are removed).
  const semanticText = Object.fromEntries(kinds.map(kind => [kind, read(`src/tokens/semantic/${kind}.css`)]));
  const roleKind = {}, roleRefs = {};
  const semantic = style => {
    const vars = {}, seen = new Map();
    for (const kind of kinds) {
      const file = `src/tokens/semantic/${kind}.css`;
      for (const [name, value] of Object.entries(declarations(block(semanticText[kind], '\\.theme-' + style, file), file))) {
        if (!name.startsWith('--p-')) throw new Error(`${file}: semantic ${name} must be named --p-*`);
        const refs = refsOf(value);
        if (!refs.length || refs.length !== (value.match(/var\(/g) || []).length) throw new Error(`${file}: ${name} must be built from var(--primitive) or var(--p-*) reads without fallbacks, got ${value}`);
        for (const ref of refs) {
          if (ref in primitive) { if (primitiveKind[ref] !== kind) throw new Error(`${file}: ${name} points at ${ref}, a ${primitiveKind[ref]} primitive`); }
          else if (!ref.startsWith('--p-')) throw new Error(`${file}: ${name} reads unknown ${ref}`);
        }
        if (/\d/.test(value.replace(/var\(--[\w-]+\)/g, ' '))) throw new Error(`${file}: ${name} writes a raw number; put it in a primitive, got ${value}`);
        claim(seen, name, file);
        vars[name] = value;
        roleKind[name] = kind;
        roleRefs[name] = refs.filter(ref => ref.startsWith('--p-'));
      }
    }
    for (const [name, refs] of Object.entries(roleRefs)) for (const ref of refs) if (!(ref in vars)) throw new Error(`semantic ${name} reads ${ref}, which is not a role`);
    const visit = (name, trail = []) => {
      if (trail.includes(name)) throw new Error(`semantic role cycle: ${[...trail, name].join(' → ')}`);
      roleRefs[name].forEach(ref => visit(ref, [...trail, name]));
    };
    Object.keys(vars).forEach(name => visit(name));
    return vars;
  };
  const main = semantic('main');
  // Kinds each kind's roles read through composites, followed to the end (the kind closure).
  const kindDeps = Object.fromEntries(kinds.map(kind => [kind, new Set()]));
  for (const [name, refs] of Object.entries(roleRefs)) for (const ref of refs) if (roleKind[ref] !== roleKind[name]) kindDeps[roleKind[name]].add(roleKind[ref]);
  const closure = list => {
    const result = new Set(list);
    for (let grew = true; grew;) { grew = false; for (const kind of [...result]) for (const dep of kindDeps[kind]) if (!result.has(dep)) { result.add(dep); grew = true; } }
    return kinds.filter(kind => result.has(kind));
  };

  // Semantic value of one role in one style: own-kind primitives resolved to raw values, role reads kept.
  const resolve = (style, name) => semantic(style)[name].replace(/var\((--[\w-]+)\)/g, (read, ref) => ref in primitive ? primitive[ref] : read);
  // Token kinds a piece of part or screen CSS reads, with the kinds those roles read in turn. It reads
  // --p-* roles only and writes no raw values: a primitive read, an unknown role, a bare number or a
  // query width that is not a registered breakpoint stops the build.
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
    return closure(found);
  };
  // Semantic roles of a style (optionally one kind set) for installs that ship without primitives.
  const styleCSS = (style, only = kinds, selector = `.ds[data-style="${style}"]`) => `${selector}{${Object.keys(semantic(style)).filter(name => only.includes(roleKind[name])).map(name => `${name}:${resolve(style, name)};`).join('')}}\n`;
  return { primitive, semantic, resolve, kindsIn, styleCSS, roleKind, kindDeps: Object.fromEntries(kinds.map(kind => [kind, closure([kind]).filter(k => k !== kind)])), closure };
}
