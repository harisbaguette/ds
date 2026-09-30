import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'assets/icons/illustrated');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'src/data/library.js'),'utf8'),context);
const data=context.window.Pattove.library;
const production=JSON.parse(fs.readFileSync(path.join(dir,'production.json'),'utf8'));
const linked=new Set(data.entries.flatMap(e=>e.glyph||[]));
const planned=new Set(production.jobs.flatMap(job=>job.icons.map(icon=>icon.entry)));
const pending=data.glyphs.filter(([id])=>!linked.has(id)&&!planned.has(id));
// Start at the end of the catalog, where the missing illustrations were reported.
let next=1+Math.max(0,...production.jobs.filter(job=>job.id.startsWith('glyph-')).map(job=>Number(job.id.slice(6))));
while(pending.length){
  const icons=pending.splice(Math.max(0,pending.length-9),9).map(([id,label,category])=>({
    entry:id,name:'illustrated-'+id.replaceAll(':','-').replaceAll('_','-'),label,
    description:label+' ('+id.slice(id.indexOf(':')+1).replaceAll('_',' ').replaceAll('-',' ')+')',
    glyph:id,aliases:[],category
  }));
  production.jobs.push({id:'glyph-'+String(next++).padStart(4,'0'),status:'pending',columns:3,rows:3,icons});
}
production.scope='all-catalog-icons';
fs.writeFileSync(path.join(dir,'production.json'),JSON.stringify(production,null,2)+'\n');
const jobs=production.jobs.filter(job=>job.id.startsWith('glyph-'));
console.log(JSON.stringify({jobs:jobs.length,icons:jobs.reduce((n,job)=>n+job.icons.length,0),pending:jobs.filter(job=>job.status==='pending').length}));
