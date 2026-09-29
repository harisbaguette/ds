import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'assets/icons/illustrated');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'src/data/library.js'),'utf8'),context);
const data=context.window.Pattove.library;
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
const drawn=new Map(manifest.batches.flatMap(b=>b.icons.filter(Boolean)).map(i=>[i.entry,i.name]));
const groups=new Map();
for(const entry of data.entries.filter(e=>e.category==='ICO'&&e.kind!=='기준')){
  const key=entry.glyph.join('|');
  if(!groups.has(key))groups.set(key,[]);
  groups.get(key).push(entry);
}
const queueFile=path.join(dir,'production.json');
const previous=fs.existsSync(queueFile)?JSON.parse(fs.readFileSync(queueFile,'utf8')):null;
if(previous){console.log('Production queue already exists; kept existing job IDs and progress.');process.exit(0);}
const aliases={},pending=[];
for(const [glyph,entries] of groups){
  const ready=entries.find(e=>drawn.has(e.id));
  if(ready){for(const e of entries)if(e.id!==ready.id)aliases[e.id]=ready.id;continue;}
  const [entry,...others]=entries;
  pending.push({entry:entry.id,name:'meaning-'+entry.id.toLowerCase(),label:entry.name,description:entry.usage,glyph,aliases:others.map(e=>e.id),category:entry.sub});
}
const jobs=[];
for(let i=0;i<pending.length;i+=9)jobs.push({id:'catalog-'+String(jobs.length+1).padStart(3,'0'),status:'pending',columns:3,rows:3,icons:pending.slice(i,i+9)});
fs.writeFileSync(queueFile,JSON.stringify({scope:'dictionary-meanings',style:manifest.style,aliases,jobs},null,2)+'\n');
console.log(JSON.stringify({jobs:jobs.length,newPictures:pending.length,existingAliases:Object.keys(aliases).length}));
