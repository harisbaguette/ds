import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { loadTokens, tokenFiles, kinds, kindLabels } from './tokens.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const css = read('src/system/parts.css');
const blocks = {};
for (const match of css.matchAll(/\/\* @part ([\w-]+) \*\/([\s\S]*?)(?=\/\* @part |$)/g)) {
  if (blocks[match[1]]) throw new Error('Duplicate CSS block: ' + match[1]);
  blocks[match[1]] = match[2].trim();
}
// Parts read only --p-* roles (tokens.mjs stops on a primitive read or an unknown role). The only
// --ds-* names are part-local adjustment values, declared inside parts.css and never token values.
const tokens = loadTokens(root);
const localNames = new Set([...css.matchAll(/(--ds-[\w-]+)\s*:/g)].map(m => m[1]));
const blockKinds = {};
for (const [block, rules] of Object.entries(blocks)) {
  blockKinds[block] = tokens.kindsIn(rules, `parts.css @part ${block}`);
  for (const [, name] of rules.matchAll(/var\((--ds-[\w-]+)/g)) if (!localNames.has(name)) throw new Error(`parts.css @part ${block}: ${name} is not declared in parts.css; read a --p-* role instead`);
}
for (const file of fs.readdirSync(path.join(root, 'src/styles')).filter(name => name.endsWith('.css'))) tokens.kindsIn(read('src/styles/' + file), 'src/styles/' + file);
const context = vm.createContext({ window: {} });
for (const file of ['src/data/catalog.js','src/ui/icons.js','src/system/registry.js','src/system/parts.js','src/system/admin.js']) vm.runInContext(read(file), context, { filename: file });
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
  // Token deps must be exactly the kinds the item's own CSS blocks read. A token item instead needs the kinds its
  // semantic values are composed from (its demo swatches ship those theme files without making the kinds depend on each other).
  const usedKinds = (item.layer === 'Token' ? tokens.kindDeps[item.id.slice(6)] : [...new Set(item.css.flatMap(block => blockKinds[block]))]).map(kind => 'token-' + kind).filter(id => id !== item.id);
  const tokenDeps = item.deps.filter(dep => dep.startsWith('token-'));
  if (usedKinds.sort().join() !== [...tokenDeps].sort().join()) throw new Error(`${item.id}: token deps [${tokenDeps}] must be [${usedKinds}]`);
  context.window.Pattove.parts.renderItem(item.id, 'build-check', registry.normalizeOptions(item.id));
  for (const control of item.controls) for (const [value] of control.values) context.window.Pattove.parts.renderItem(item.id, 'build-check', registry.normalizeOptions(item.id,{[control.key]:value}));
}
// One token item per kind, named after the kind, and the page links every token file in layer order.
const tokenItems = registry.items.filter(item => item.layer === 'Token');
if (tokenItems.map(item => item.id).join() !== kinds.map(kind => 'token-' + kind).join()) throw new Error(`Token items [${tokenItems.map(item => item.id)}] must be one per kind in tokens.mjs order`);
for (const item of tokenItems) if (item.name !== kindLabels[item.id.slice(6)] + ' 토큰') throw new Error(`${item.id}: name must be "${kindLabels[item.id.slice(6)]} 토큰"`);
const linked = [...read('index.html').matchAll(/href="(src\/tokens\/[^"]+)"/g)].map(m => m[1]);
if (linked.join() !== tokenFiles().join()) throw new Error('index.html must link exactly the token files, primitives first: ' + tokenFiles().filter(f => !linked.includes(f)).join(', '));
const sources = ['src/system/react/admin-records.jsx','src/system/react/table-toolbar.jsx','src/system/react/table-pagination.jsx','src/system/admin.js','src/system/react/data-table.jsx','src/system/react/record-editor.jsx','src/system/react/admin-shell.jsx','src/system/react/admin-page.jsx','src/system/parts.js','src/system/parts.css','src/system/behaviors.js','src/system/registry.js','src/data/catalog.js',...tokenFiles()];
const revision = crypto.createHash('sha256').update(sources.map(file => file + '\0' + read(file)).join('\0')).digest('hex');
fs.writeFileSync(path.join(root, 'src/data/system-registry.json'), JSON.stringify({ version: registry.version, revision, sources, sections: registry.sections, items: registry.items, patterns: registry.patterns }, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'src/data/system-source.js'), '// Generated by npm run build:system.\nwindow.Pattove.systemSource = ' + JSON.stringify(blocks) + ';\nwindow.Pattove.systemSourceRevision = ' + JSON.stringify(revision) + ';\n');
const fonts = {};
for (const [name, file, license] of [
  ['Pretendard', 'PretendardVariable.woff2', 'Pretendard-LICENSE.txt'],
  ['Outfit', 'Outfit-Variable.woff2', 'Outfit-OFL.txt']
]) {
  fonts[name] = { data: fs.readFileSync(path.join(root, 'assets/fonts', file)).toString('base64'), license: read('assets/fonts/' + license) };
}
fs.writeFileSync(path.join(root, 'src/data/system-fonts.js'), '// Generated by npm run build:system; packed into the pattove-fonts registry item.\nwindow.Pattove.systemFonts = ' + JSON.stringify(fonts) + ';\n');
console.log('System CSS blocks: ' + Object.keys(blocks).length + '; offline font bundle generated.');
