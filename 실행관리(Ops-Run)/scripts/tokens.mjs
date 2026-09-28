// Reads the three token layers, one file per kind (primitive/<kind>.css → semantic/<kind>.css)
// and one file per part (component/<part>.css). Enforces that each layer references only the
// layer directly below it, that a token's name matches the file it lives in, and resolves values
// for distribution.
import fs from 'node:fs';
import path from 'node:path';

export const kinds = ['color', 'typography', 'space', 'radius', 'shadow', 'motion'];
// Primitive name prefix per kind file. A primitive in the wrong file stops the build.
const prefixes = { color: '--color-', typography: '--font-', space: '--space-', radius: '--radius-', shadow: '--shadow-', motion: '--duration-' };
const componentDir = 'src/tokens/component';

// Every token source file, in load order (primitive → semantic → component).
export function tokenFiles(root) {
  const component = fs.readdirSync(path.join(root, componentDir)).filter(name => name.endsWith('.css')).sort().map(name => `${componentDir}/${name}`);
  return [...kinds.map(kind => `src/tokens/primitive/${kind}.css`), ...kinds.map(kind => `src/tokens/semantic/${kind}.css`), ...component];
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

  // Layer 3: --ds-<part>-* names, declared only in component/<part>.css, each pointing at one --p-* role.
  const components = {};
  for (const file of tokenFiles(root).filter(f => f.startsWith(componentDir))) {
    const id = path.basename(file, '.css');
    const vars = declarations(block(read(file), '\\.ds', file), file);
    for (const [name, value] of Object.entries(vars)) {
      if (!name.startsWith(`--ds-${id}-`)) throw new Error(`${file}: ${name} must be named --ds-${id}-*`);
      if (!(reference(value) in main)) throw new Error(`${file}: component ${name} must be var(--p-*), got ${value}`);
    }
    components[id] = vars;
  }

  // Semantic value of one role in one style, resolved down to its raw primitive value.
  const resolve = (style, name) => primitive[reference(semantic(style)[name])];
  // Token kinds one component file reads.
  const kindsOf = id => [...new Set(Object.values(components[id] || {}).map(value => roleKind[reference(value)]))].sort((a, b) => kinds.indexOf(a) - kinds.indexOf(b));
  // Semantic roles of a style (optionally one kind set) as raw values, for installs that ship without primitives.
  const styleCSS = (style, only = kinds) => `.ds[data-style="${style}"]{${Object.keys(semantic(style)).filter(name => only.includes(roleKind[name])).map(name => `${name}:${resolve(style, name)};`).join('')}}\n`;
  // One part's component tokens with standalone fallbacks: the part renders even when no semantic layer is loaded.
  const componentCSS = (id, style = 'main') => `.ds {\n${Object.entries(components[id]).map(([name, value]) => {
    const role = reference(value);
    return `  ${name}:var(${role},${resolve(style, role)});`;
  }).join('\n')}\n}`;
  return { primitive, semantic, components, resolve, kindsOf, styleCSS, componentCSS };
}
