import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { loadTokens, tokenFiles } from './tokens.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const css = read('src/system/parts.css');
const blocks = {};
for (const match of css.matchAll(/\/\* @part ([\w-]+) \*\/([\s\S]*?)(?=\/\* @part |$)/g)) {
  if (blocks[match[1]]) throw new Error('Duplicate CSS block: ' + match[1]);
  blocks[match[1]] = match[2].trim();
}
// Layer check (tokens.mjs) plus the part boundary: a CSS block reads only --ds-<own part>-* names,
// declared in component/<part>.css (the shared block owns component/base.css) or locally in the block.
const tokens = loadTokens(root);
const componentOf = block => block === 'shared' ? 'base' : block;
for (const [block, rules] of Object.entries(blocks)) {
  const id = componentOf(block), own = tokens.components[id] || {};
  const local = new Set([...rules.matchAll(/(--ds-[\w-]+)\s*:/g)].map(m => m[1]));
  for (const [, name] of rules.matchAll(/var\((--ds-[\w-]+)/g)) {
    if (!name.startsWith(`--ds-${id}-`)) throw new Error(`parts.css @part ${block}: ${name} belongs to another part; use --ds-${id}-*`);
    if (!(name in own) && !local.has(name)) throw new Error(`parts.css @part ${block}: ${name} is not declared in src/tokens/component/${id}.css`);
  }
  if (/#[0-9a-f]{3,8}\b/i.test(rules)) throw new Error(`parts.css @part ${block}: raw hex; add a primitive and a semantic role instead`);
}
for (const id of Object.keys(tokens.components)) if (!blocks[id === 'base' ? 'shared' : id]) throw new Error(`src/tokens/component/${id}.css has no @part ${id} block`);
const context = vm.createContext({ window: {} });
for (const file of ['src/data/catalog.js','src/ui/icons.js','src/system/registry.js','src/system/parts.js']) vm.runInContext(read(file), context, { filename: file });
const registry = context.window.Pattove.systemRegistry;
const ids = new Set();
for (const item of registry.items) {
  if (ids.has(item.id)) throw new Error('Duplicate implementation: ' + item.id);
  ids.add(item.id);
  if (!['Token','Primitive','Atom','Molecule','Module','Template','Page'].includes(item.layer)) throw new Error('Invalid layer: ' + item.id);
  if (!['Trial','Stable','Deprecated'].includes(item.lifecycle)) throw new Error('Invalid lifecycle: ' + item.id);
  if (!/^\d+\.\d+\.\d+$/.test(item.version)) throw new Error('Invalid version: ' + item.id);
  if (item.lifecycle === 'Deprecated' && !item.replacement) throw new Error('Missing replacement: ' + item.id);
  for (const key of ['id','name','layer','purpose','compatibility','source','version','lifecycle']) if (!item[key]) throw new Error(item.id + ': missing ' + key);
  if (!fs.existsSync(path.join(root,item.source))) throw new Error('Missing source: ' + item.source);
  for (const block of item.css) if (!blocks[block]) throw new Error(item.id + ': missing CSS ' + block);
  const visit = (id, ancestors = []) => {
    if (ancestors.includes(id)) throw new Error('Dependency cycle: ' + [...ancestors,id].join(' → '));
    const target = registry.index.get(id);
    if (!target) throw new Error('Missing dependency: ' + id);
    target.deps.forEach(dep => visit(dep,[...ancestors,id]));
  };
  visit(item.id);
  // Token deps must be exactly the kinds the item's own CSS blocks read.
  const usedKinds = [...new Set(item.css.flatMap(block => tokens.kindsOf(componentOf(block))))].map(kind => 'token-' + kind).filter(id => id !== item.id);
  const tokenDeps = item.deps.filter(dep => dep.startsWith('token-'));
  if (usedKinds.sort().join() !== [...tokenDeps].sort().join()) throw new Error(`${item.id}: token deps [${tokenDeps}] must be [${usedKinds}]`);
  context.window.Pattove.parts.renderItem(item.id, 'build-check', registry.normalizeOptions(item.id));
  for (const control of item.controls) for (const [value] of control.values) context.window.Pattove.parts.renderItem(item.id, 'build-check', registry.normalizeOptions(item.id,{[control.key]:value}));
}
const sources = ['src/system/parts.js','src/system/parts.css','src/system/behaviors.js','src/system/registry.js','src/data/catalog.js',...tokenFiles(root),'src/styles/themes.css'];
// Per-part component tokens ship with fallbacks resolved from the one primitive source, so each part works standalone.
const systemTokens = Object.fromEntries(Object.keys(tokens.components).map(id => [id, tokens.componentCSS(id)]));
const revision = crypto.createHash('sha256').update(sources.map(file => file + '\0' + read(file)).join('\0')).digest('hex');
fs.writeFileSync(path.join(root, 'src/data/system-registry.json'), JSON.stringify({ version: registry.version, revision, sources, sections: registry.sections, items: registry.items, patterns: registry.patterns }, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'src/data/system-source.js'), '// Generated by npm run build:system.\nwindow.Pattove.systemSource = ' + JSON.stringify(blocks) + ';\nwindow.Pattove.systemTokens = ' + JSON.stringify(systemTokens) + ';\nwindow.Pattove.systemSourceRevision = ' + JSON.stringify(revision) + ';\n');
const fonts = {};
for (const [name, file, license] of [
  ['Pretendard', 'PretendardVariable.woff2', 'Pretendard-LICENSE.txt'],
  ['Outfit', 'Outfit-Variable.woff2', 'Outfit-OFL.txt']
]) {
  fonts[name] = { data: fs.readFileSync(path.join(root, 'assets/fonts', file)).toString('base64'), license: read('assets/fonts/' + license) };
}
fs.writeFileSync(path.join(root, 'src/data/system-fonts.js'), '// Generated by npm run build:system; packed into the pattove-fonts registry item.\nwindow.Pattove.systemFonts = ' + JSON.stringify(fonts) + ';\n');
console.log('System CSS blocks: ' + Object.keys(blocks).length + '; offline font bundle generated.');
