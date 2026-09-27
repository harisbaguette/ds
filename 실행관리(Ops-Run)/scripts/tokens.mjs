// Reads the three token layers (primitive → semantic → component), enforces that each layer
// references only the layer directly below it, and resolves values for distribution.
import fs from 'node:fs';
import path from 'node:path';

export const tokenFiles = { primitive: 'src/tokens/primitive.css', semantic: 'src/tokens/semantic.css', component: 'src/tokens/component.css' };

const declarations = text => Object.fromEntries([...text.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]));
const block = (text, selector, file) => {
  const match = text.match(new RegExp(selector + '\\s*\\{([^}]*)\\}'));
  if (!match) throw new Error(`${file}: missing ${selector} block`);
  return match[1];
};
const reference = value => value.match(/^var\((--[\w-]+)\)$/)?.[1];

export function loadTokens(root) {
  const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/^﻿/, '');
  const primitive = declarations(block(read(tokenFiles.primitive), ':root', tokenFiles.primitive));
  const semanticText = read(tokenFiles.semantic);
  const component = declarations(block(read(tokenFiles.component), '\\.ds', tokenFiles.component));

  for (const [name, value] of Object.entries(primitive)) if (value.includes('var(')) throw new Error(`primitive ${name} must be a raw value`);
  const semantic = style => {
    const vars = declarations(block(semanticText, '\\.theme-' + style, tokenFiles.semantic));
    for (const [name, value] of Object.entries(vars)) {
      if (!name.startsWith('--p-') || !(reference(value) in primitive)) throw new Error(`semantic ${name} must be var(--primitive), got ${value}`);
    }
    return vars;
  };
  const main = semantic('main');
  for (const [name, value] of Object.entries(component)) {
    if (!name.startsWith('--ds-') || !(reference(value) in main)) throw new Error(`component ${name} must be var(--p-*), got ${value}`);
  }

  // Semantic value of one role in one style, resolved down to its raw primitive value.
  const resolve = (style, name) => primitive[reference(semantic(style)[name])];
  // Semantic roles of a style as raw values, for installs that ship without primitive.css.
  const styleCSS = style => `.ds[data-style="${style}"]{${Object.keys(semantic(style)).map(name => `${name}:${resolve(style, name)};`).join('')}}\n`;
  // Component tokens with standalone fallbacks: parts render even when no semantic layer is loaded.
  const componentCSS = (style = 'main') => `.ds {\n${Object.entries(component).map(([name, value]) => {
    const role = reference(value);
    return `  ${name}:var(${role},${resolve(style, role)});`;
  }).join('\n')}\n}`;
  return { primitive, semantic, component, resolve, styleCSS, componentCSS };
}
