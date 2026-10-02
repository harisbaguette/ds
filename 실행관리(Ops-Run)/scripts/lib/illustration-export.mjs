import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { Zip, ZipPassThrough } from 'fflate';
import { asset, metadata, packIds, getRecord, defaultStyle, exportRoot, AssetError, trimCache, noteCacheFile, inventory } from './illustration-store.mjs';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const esc=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function selection({ids=[],pack}={}) {
  if(!Array.isArray(ids)||ids.some(id=>typeof id!=='string'))throw new AssetError('ids must be an array of IDs');
  const selected=[...new Set([...ids,...(pack?packIds(pack):[])])];
  if(!selected.length)throw new AssetError('Select at least one illustration');
  return selected;
}
async function* files(options) {
  const {style=defaultStyle,format='webp',size=512}=options;
  const ids=selection(options),entries=[],seen=new Map(),imports=[];
  // Resolve every ID first so a typo cannot leave a seemingly successful partial pack.
  ids.forEach(id=>getRecord(id,style));
  for(const id of ids) {
    const info=metadata(id,style);
    if(!seen.has(info.canonicalId)) {
      const image=await asset(id,{style,format,size}),name='assets/'+getRecord(id,style).record.name+'.'+format;
      const entry={file:name,sha256:sha(image.bytes),bytes:image.bytes.length};
      seen.set(info.canonicalId,entry);imports.push(name);
      yield {name,bytes:image.bytes};
    }
    entries.push({id,name:info.name,canonicalId:info.canonicalId,sourceHash:info.sourceHash,...seen.get(info.canonicalId)});
  }
  const manifest={schemaVersion:1,catalogRevision:inventory().revision,style,format,size,items:entries};
  yield {name:'manifest.json',bytes:Buffer.from(JSON.stringify(manifest,null,2)+'\n')};
  const markup=entries.map(e=>'<figure><img src="'+esc(e.file)+'" width="'+size+'" height="'+size+'" alt="'+esc(e.name)+'"><figcaption>'+esc(e.id)+' · '+esc(e.name)+'</figcaption></figure>').join('\n');
  yield {name:'index.html',bytes:Buffer.from('<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>일러스트 팩</title><style>body{font:16px system-ui;margin:24px;display:flex;flex-wrap:wrap;gap:24px}figure{margin:0;width:160px}img{width:128px;height:128px;object-fit:contain}figcaption{overflow-wrap:anywhere}</style>'+markup+'</html>')};
  const index=new Map(imports.map((file,i)=>[file,i]));
  const source="import React from 'react';\n"+imports.map((file,i)=>'import image'+i+' from '+JSON.stringify('./'+file)+';').join('\n')+'\nconst images={'+entries.map(e=>JSON.stringify(e.id)+':image'+index.get(e.file)).join(',')+'};\nexport function Illustration({id,alt="",size=24,...props}){const image=images[id];if(!image)throw new Error("Unknown illustration: "+id);return <img {...props} src={typeof image==="string"?image:image.src} width={size} height={size} alt={alt} style={{objectFit:"contain",...props.style}}/>;}\n';
  yield {name:'Illustration.jsx',bytes:Buffer.from(source)};
  yield {name:'README.md',bytes:Buffer.from('# 일러스트 사용\n\nindex.html을 직접 열면 포함된 그림을 볼 수 있습니다. HTML에서는 assets/의 파일을 img로 사용합니다. React에서는 Illustration.jsx를 import하고 id와 alt를 지정합니다. 장식용 그림의 alt는 빈 문자열로 둡니다. manifest.json에는 ID, 공유 관계, 파일 해시가 있습니다.\n\n배포 크기: '+size+'px. PNG와 WebP는 픽셀 이미지입니다. 큰 인쇄물에는 별도 고해상도 원본이 필요합니다. 브랜드·서비스를 나타내는 그림은 해당 브랜드의 사용 지침을 확인하세요.\n')};
}
export async function exportDirectory(options,destination) {
  const target=path.resolve(destination),parent=path.dirname(target);
  await fs.mkdir(parent,{recursive:true});
  try{await fs.lstat(target);throw new AssetError('Destination already exists; choose a new folder',409);}catch(e){if(e.code!=='ENOENT')throw e;}
  const temporary=await fs.mkdtemp(path.join(parent,'.pattove-export-'));
  try {
    let count=0,bytes=0;
    for await(const file of files(options)){const targetFile=path.join(temporary,file.name);await fs.mkdir(path.dirname(targetFile),{recursive:true});await fs.writeFile(targetFile,file.bytes,{flag:'wx'});count++;bytes+=file.bytes.length;}
    // Never replace a folder created by another process during export.
    try{await fs.lstat(target);throw new AssetError('Destination appeared during export',409);}catch(e){if(e.code!=='ENOENT')throw e;}
    await fs.rename(temporary,target);return {directory:target,files:count,bytes,items:selection(options).length};
  } catch(error){await fs.rm(temporary,{recursive:true,force:true});throw error;}
}
let activeExports=0;
export async function exportZip(options) {
  const ids=selection(options);
  if(ids.length>2500)throw new AssetError('ZIP supports up to 2500 selections; use CLI --out for the entire library',413);
  if(activeExports>=1)throw new AssetError('Another export is running; retry shortly',429);
  activeExports++;
  const temp=path.join(exportRoot,randomUUID()+'.tmp');
  let handle;
  try {
    await fs.mkdir(exportRoot,{recursive:true});
    handle=await fs.open(temp,'wx');
    let chunks=[],total=0,ended=false;
    const digestHash=createHash('sha256');
    const zip=new Zip((error,data,final)=>{if(error)throw error;chunks.push(Buffer.from(data));if(final)ended=true;});
    async function flush(){for(const chunk of chunks){total+=chunk.length;if(total>256*1024*1024)throw new AssetError('ZIP exceeds 256 MB; use CLI --out',413);digestHash.update(chunk);await handle.writeFile(chunk);}chunks=[];}
    for await(const file of files({...options,ids,pack:undefined})) {
      const entry=new ZipPassThrough(file.name);entry.mtime=new Date('2020-01-01T00:00:00Z');
      zip.add(entry);entry.push(file.bytes,true);await flush();
    }
    zip.end();await flush();if(!ended)throw Error('Incomplete ZIP');
    await handle.close();handle=null;
    const digest=digestHash.digest('hex'),filename=digest+'.zip';
    await fs.rename(temp,path.join(exportRoot,filename));
    noteCacheFile(exportRoot,filename,total);
    await trimCache(exportRoot,512*1024*1024);
    return {filename,path:path.join(exportRoot,filename),download:'/api/illustrations/exports/'+filename,sha256:digest,bytes:total,items:ids.length};
  }finally{activeExports--;if(handle)await handle.close();await fs.unlink(temp).catch(()=>{});}
}
