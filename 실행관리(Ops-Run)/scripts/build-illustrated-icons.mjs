import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { asset, allIds, getStyle, root, trimCache } from './lib/illustration-store.mjs';
import path from 'node:path';
const style=getStyle();
const missing=allIds().filter(id=>!style.records.has(id));
if(missing.length)throw Error('Missing illustrations: '+missing.join(', '));
const sources=new Map([...style.records.values()].map(r=>[r.source,r.batch.sha256]));
for(const [source,expected] of sources) {
  const bytes=await fs.readFile(source);
  if(expected&&createHash('sha256').update(bytes).digest('hex')!==expected)throw Error('Source checksum mismatch: '+source);
}
const ui=JSON.parse(await fs.readFile(path.join(root,'src/data/ui-icons.json'),'utf8'));
for(const id of new Set(Object.values(ui)))await asset(id,{size:192});
await trimCache();
console.log(allIds().length+' illustrations verified; '+sources.size+' source objects; UI cache prepared. Delivery images are generated on demand.');
