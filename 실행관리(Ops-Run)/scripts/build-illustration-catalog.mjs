import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'src/data/library.js'),'utf8'),context);
const d=context.window.Pattove.library;
const linked=new Set(d.entries.flatMap(e=>e.glyph||[]));
const items=[...d.entries.filter(e=>e.category==='ICO'&&e.kind!=='기준'),...d.glyphs.filter(([id])=>!linked.has(id)).map(([id,name,sub,also])=>({id,name,sub,also}))].map(e=>({
  id:e.id,name:e.name,description:e.usage||e.term||e.name,category:e.sub,keywords:[e.term,...(e.glyph||[]),...(e.also||[])].filter(Boolean)
}));
if(new Set(items.map(e=>e.id)).size!==items.length)throw Error('Duplicate catalog IDs');
const core=[...new Set(Object.values(JSON.parse(fs.readFileSync(path.join(root,'src/data/ui-icons.json')))))];
const packs=[{id:'core-ui',name:'기본 UI',ids:core},...d.iconGroups.map(g=>({id:g.id,name:g.name,ids:items.filter(e=>e.category===g.id||e.keywords.includes(g.id)).map(e=>e.id)}))];
const body={schemaVersion:1,items,packs};
const revision=createHash('sha256').update(JSON.stringify(body)).digest('hex');
fs.writeFileSync(path.join(root,'src/data/illustrations.json'),JSON.stringify({revision,...body})+'\n');
console.log(items.length+' illustrations; '+packs.length+' packs indexed.');

