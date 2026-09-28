// Reads the two token layers, one file per kind (primitive/<kind>.css → semantic/<kind>.css).
// Enforces that each role points at a primitive of its own kind, that a token's name matches the
// file it lives in, that part CSS reads only --p-* roles, and resolves values for distribution.
import fs from 'node:fs';
import path from 'node:path';

export const kinds = ['color', 'typography', 'space', 'radius', 'shadow', 'motion'];
// Primitive name prefix per kind file. A primitive in the wrong file stops the build.
const prefixes = { color: '--color-', typography: '--font-', space: '--space-', radius: '--radius-', shadow: '--shadow-', motion: '--duration-' };
const primitiveRead = new RegExp(`var\\((${Object.values(prefixes).join('|')})[\\w-]*`);

// Every token source file, in load order (primitive → semantic).
export function tokenFiles() {
  return [...kinds.map(kind => `src/tokens/primitive/${kind}.css`), ...kinds.map(kind => `src/tokens/semantic/${kind}.css`)];
}

const declarations = (text, file) => {
  const result = {};
  for (const [, name, value] of text.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    if (name in result) throw new Error(`${file}: ${name} declared twice`);
    result[name] = value.trim();
  }
  return result;
};
const block = (text, selector, file) => {
  const match = text.match(new RegExp(selector + '\\s*\\{([^}]*)\\}'));
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
      if (!name.startsWith(prefixes[kind])) throw new Error(`${file}: ${name} must start with ${prefixes[kind]}`);
      if (value.includes('var(')) throw new Error(`${file}: primitive ${name} must be a raw value`);
      claim(primitiveSeen, name, file);
      primitive[name] = value;
      primitiveKind[name] = kind;
    }
  }

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
  // Token kinds a piece of part CSS reads. Parts read --p-* roles only: a primitive read or an
  // unknown role stops the build.
  const kindsIn = (css, where) => {
    const raw = css.match(primitiveRead);
    if (raw) throw new Error(`${where}: reads primitive ${raw[1]}…; parts read --p-* roles only`);
    const found = new Set();
    for (const [, name] of css.matchAll(/var\((--p-[\w-]+)/g)) {
      if (!(name in main)) throw new Error(`${where}: ${name} is not a semantic role`);
      found.add(roleKind[name]);
    }
    return kinds.filter(kind => found.has(kind));
  };
  // Semantic roles of a style (optionally one kind set) as raw values, for installs that ship without primitives.
  const styleCSS = (style, only = kinds, selector = `.ds[data-style="${style}"]`) => `${selector}{${Object.keys(semantic(style)).filter(name => only.includes(roleKind[name])).map(name => `${name}:${resolve(style, name)};`).join('')}}\n`;
  return { primitive, semantic, resolve, kindsIn, styleCSS };
}
