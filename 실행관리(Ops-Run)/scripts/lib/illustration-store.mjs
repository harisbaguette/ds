import fs from 'node:fs/promises';
import sync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
import sharp from 'sharp';

export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
export const cacheRoot=path.join(root,'.cache/illustrations');
export const exportRoot=path.join(root,'.cache/illustration-exports');
export const CACHE_LIMIT=128*1024*1024;
const catalog=JSON.parse(sync.readFileSync(path.join(root,'src/data/illustrations.json'),'utf8'));
const config=JSON.parse(sync.readFileSync(path.join(root,'assets/icons/styles.json'),'utf8'));
const items=new Map(catalog.items.map(item=>[item.id,item]));
const normalize=value=>String(value).normalize('NFKC').toLocaleLowerCase();
const searchText=new Map(catalog.items.map(item=>[item.id,normalize([item.id,item.name,item.description,item.category,...item.keywords].join(' '))]));
const hash=data=>createHash('sha256').update(data).digest('hex');
const styles=new Map();
export class AssetError extends Error { constructor(message,status=400){super(message);this.status=status;} }
const inside=(parent,file)=>file.startsWith(parent+path.sep);
export async function confinedFile(base,file) {
  const target=path.resolve(base,file);
  if(!inside(base,target))throw new AssetError('Path outside asset store',403);
  const real=await fs.realpath(target);
  if(!inside(await fs.realpath(base),real))throw new AssetError('Symlink outside asset store',403);
  return real;
}
for(const style of config.styles) {
  if(!/^[a-z0-9][a-z0-9-]*$/.test(style.id)||styles.has(style.id))throw Error('Invalid style ID');
  const manifestPath=path.resolve(root,style.manifest);
  if(!inside(path.join(root,'assets/icons'),manifestPath))throw Error('Invalid manifest path');
  const manifest=JSON.parse(sync.readFileSync(manifestPath,'utf8'));
  const records=new Map(),names=new Map();
  for(const batch of manifest.batches) {
    if(!Number.isInteger(batch.columns)||!Number.isInteger(batch.rows)||batch.columns<1||batch.rows<1||batch.icons.length!==batch.columns*batch.rows)throw Error('Invalid source grid');
    batch.icons.forEach((item,index)=>{
      if(!item)return;
      if(!items.has(item.entry)||records.has(item.entry)||names.has(item.name)||!/^[a-z][a-z0-9-]*$/.test(item.name))throw Error('Invalid illustration '+item.entry);
      const source=manifest.schemaVersion===2?path.resolve(root,batch.source):path.resolve(path.dirname(manifestPath),batch.source);
      if(!inside(path.join(root,'assets/icons'),source))throw Error('Invalid source path');
      const record={...item,index,batch,source};records.set(item.entry,record);names.set(item.name,item.entry);
    });
  }
  for(const [id,target] of Object.entries(manifest.aliases||{})) {
    if(!items.has(id)||!records.has(target)||records.has(id))throw Error('Invalid alias '+id);
    records.set(id,records.get(target));
  }
  styles.set(style.id,{...style,manifest,records,names});
}
export const defaultStyle=config.defaultStyle;
export function getStyle(id=defaultStyle) {const style=styles.get(id);if(!style)throw new AssetError('Unknown style: '+id,404);return style;}
export function listStyles(){return [...styles.values()].map(s=>({id:s.id,name:s.name,available:s.records.size,total:items.size}));}
export function listPacks(){return catalog.packs.map(({ids,...pack})=>({...pack,count:ids.length}));}
export function packIds(id){const pack=catalog.packs.find(p=>p.id===id);if(!pack)throw new AssetError('Unknown pack: '+id,404);return pack.ids;}
export function getRecord(id,style=defaultStyle) {
  const s=getStyle(style),item=items.get(id),record=s.records.get(id);
  if(!item)throw new AssetError('Unknown illustration: '+id,404);
  if(!record)throw new AssetError('Illustration unavailable in requested style: '+id,404);
  return {item,record,style:s};
}
export function metadata(id,style=defaultStyle) {
  const {item,record}=getRecord(id,style);
  const query='?id='+encodeURIComponent(id)+'&style='+encodeURIComponent(style);
  return {...item,style,canonicalId:record.entry,formats:['webp','png'],sizes:[24,48,96,192,512],
    assets:{webp:'/api/illustrations/asset'+query+'&format=webp&size=512',png:'/api/illustrations/asset'+query+'&format=png&size=512',thumbnail:'/api/illustrations/asset'+query+'&format=webp&size=192'},
    sourceHash:record.batch.sha256||null};
}
export function search({query='',category,pack,style=defaultStyle,offset=0,limit=20}={}) {
  if(typeof query!=='string'||query.length>300||!Number.isInteger(offset)||offset<0||!Number.isInteger(limit)||limit<1||limit>100)throw new AssetError('query <= 300 chars; offset >= 0; limit 1..100');
  const s=getStyle(style),terms=normalize(query).trim().split(/\s+/).filter(Boolean),selected=pack?new Set(packIds(pack)):null;
  const hits=catalog.items.filter(item=>s.records.has(item.id)&&(!category||item.category===category)&&(!selected||selected.has(item.id))&&terms.every(term=>searchText.get(item.id).includes(term)));
  if(query)hits.sort((a,b)=>Number(normalize(b.id)===normalize(query))-Number(normalize(a.id)===normalize(query)));
  return {total:hits.length,offset,limit,nextOffset:offset+limit<hits.length?offset+limit:null,style,revision:catalog.revision,
    items:hits.slice(offset,offset+limit).map(({id,name,category,description})=>({id,name,category,description}))};
}
export function resolveLegacy(filename) {
  const style=getStyle();
  // Preserve the existing filename convention for thumbnails and detail images.
  for(const [suffix,format,size] of [['-192.webp','webp',192],['.webp','webp',512],['.png','png',512]]) {
    if(filename.endsWith(suffix)){const id=style.names.get(filename.slice(0,-suffix.length));if(id)return {id,format,size};}
  }
  return null;
}
async function renderPNG(record) {
  const source=await confinedFile(path.join(root,'assets/icons'),path.relative(path.join(root,'assets/icons'),record.source));
  const {width,height}=await sharp(source,{limitInputPixels:25_000_000}).metadata();
  const b=record.batch,grid=b.crop||{left:0,top:0,width,height};
  const col=record.index%b.columns,row=Math.floor(record.index/b.columns);
  const x=Math.round(col*grid.width/b.columns),y=Math.round(row*grid.height/b.rows);
  const region=record.crop?{...record.crop}:{left:grid.left+x,top:grid.top+y,width:Math.round((col+1)*grid.width/b.columns)-x,height:Math.round((row+1)*grid.height/b.rows)-y};
  region.left+=record.offset?.x||0;region.top+=record.offset?.y||0;
  if(Object.values(region).some(v=>!Number.isInteger(v))||region.left<0||region.top<0||region.width<1||region.height<1||region.left+region.width>width||region.top+region.height>height)throw new AssetError('Invalid crop',500);
  let tile=sharp(source,{limitInputPixels:25_000_000}).extract(region).resize(b.normalized?384:512,b.normalized?384:512,{fit:'contain',background:{r:255,g:255,b:255,alpha:0}});
  if(b.normalized)tile=tile.extend({top:64,bottom:64,left:64,right:64,background:{r:255,g:255,b:255,alpha:0}});
  return tile.png().toBuffer();
}
const masterImages=new Map();
export async function render(record,{format='webp',size=512,revisionKey}={}) {
  if(!['webp','png'].includes(format)||![24,48,96,192,512].includes(size))throw new AssetError('Unsupported format or size');
  if(revisionKey&&!masterImages.has(revisionKey)) {
    const pending=renderPNG(record);masterImages.set(revisionKey,pending);
    pending.catch(()=>masterImages.delete(revisionKey));
    while(masterImages.size>8)masterImages.delete(masterImages.keys().next().value);
  }
  const png=await (revisionKey?masterImages.get(revisionKey):renderPNG(record));
  if(format==='png'&&size===512)return png;
  let output=sharp(png);
  if(size!==512)output=output.resize(size,size);
  return format==='png'?output.png().toBuffer():output.webp({quality:size===512?88:85,effort:4}).toBuffer();
}
let running=0;const queue=[],pending=new Map(),sourceHashes=new Map();
async function bounded(task){
  if(running>=3){if(queue.length>=150)throw new AssetError('Image service busy; retry shortly',429);await new Promise(resolve=>queue.push(resolve));}
  running++;
  try{return await task();}finally{running--;queue.shift()?.();}
}
async function revision(record) {
  const source=await confinedFile(path.join(root,'assets/icons'),path.relative(path.join(root,'assets/icons'),record.source));
  const stat=await fs.stat(source),key=source+'|'+stat.size+'|'+stat.mtimeMs;
  if(!sourceHashes.has(key)){
    const actual=hash(await fs.readFile(source));
    if(record.batch.sha256&&actual!==record.batch.sha256)throw new AssetError('Source checksum mismatch',500);
    sourceHashes.set(key,actual);
  }
  return hash(JSON.stringify({source:sourceHashes.get(key),batch:{columns:record.batch.columns,rows:record.batch.rows,crop:record.batch.crop,normalized:record.batch.normalized},item:{crop:record.crop,offset:record.offset,index:record.index},encoder:sharp.versions,recipe:2}));
}
let trimChain=Promise.resolve();
const cacheIndexes=new Map();
export function noteCacheFile(directory,name,size) {
  const index=cacheIndexes.get(directory)||new Map();cacheIndexes.set(directory,index);
  index.set(name,{path:path.join(directory,name),size,time:Date.now()});
}
export function trimCache(directory=cacheRoot,maxBytes=CACHE_LIMIT) {
  const job=trimChain.then(async()=>{
    let names;try{names=await fs.readdir(directory);}catch(e){if(e.code==='ENOENT')return {bytes:0,files:0};throw e;}
    const index=cacheIndexes.get(directory)||new Map();cacheIndexes.set(directory,index);
    const live=new Set(names.filter(n=>/^[a-f0-9]{64}\.(png|webp|zip)$/.test(n)));
    for(const name of index.keys())if(!live.has(name))index.delete(name);
    await Promise.all([...live].filter(name=>!index.has(name)).map(async name=>{try{const p=path.join(directory,name),s=await fs.lstat(p);if(s.isFile())index.set(name,{path:p,size:s.size,time:s.mtimeMs});}catch{}}));
    const stats=[...index.values()];
    let bytes=stats.reduce((n,s)=>n+s.size,0);
    for(const item of stats.sort((a,b)=>a.time-b.time)){if(bytes<=maxBytes)break;await fs.unlink(item.path).catch(()=>{});index.delete(path.basename(item.path));bytes-=item.size;}
    return {bytes};
  });
  trimChain=job.catch(()=>{});return job;
}
export async function asset(id,{style=defaultStyle,format='webp',size=512}={}) {
  if(!['webp','png'].includes(format)||![24,48,96,192,512].includes(size))throw new AssetError('Unsupported format or size');
  const {record}=getRecord(id,style),revisionKey=await revision(record);
  const key=hash(revisionKey+'|'+format+'|'+size),file=path.join(cacheRoot,key+'.'+format);
  try {const bytes=await fs.readFile(await confinedFile(cacheRoot,key+'.'+format));const cached=cacheIndexes.get(cacheRoot)?.get(key+'.'+format);if(cached)cached.time=Date.now();await fs.utimes(file,new Date(),new Date()).catch(()=>{});return {bytes,etag:'"'+key+'"',format,size,key};}catch(e){if(e.code!=='ENOENT')throw e;}
  if(!pending.has(key)){
    const work=bounded(async()=>{
      const bytes=await render(record,{format,size,revisionKey});await fs.mkdir(cacheRoot,{recursive:true});
      const temp=file+'.'+randomUUID()+'.tmp';
      await fs.writeFile(temp,bytes,{flag:'wx'});await fs.rename(temp,file);noteCacheFile(cacheRoot,path.basename(file),bytes.length);await trimCache();
      return {bytes,etag:'"'+key+'"',format,size,key};
    });
    pending.set(key,work);work.finally(()=>pending.delete(key)).catch(()=>{});
  }
  return pending.get(key);
}
export function inventory(){return {revision:catalog.revision,total:items.size,styles:listStyles(),packs:listPacks(),cacheLimitBytes:CACHE_LIMIT};}
export function allIds(){return [...items.keys()];}
