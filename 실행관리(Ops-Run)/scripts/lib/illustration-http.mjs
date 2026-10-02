import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import { search, metadata, inventory, listPacks, listStyles, asset, resolveLegacy, exportRoot, confinedFile, AssetError, defaultStyle } from './illustration-store.mjs';
import { exportZip } from './illustration-export.mjs';
const json=(res,value,status=200)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
export async function handleIllustrations(req,res,url) {
  const p=url.pathname;
  if(p.startsWith('/assets/icons/illustrated/')) {
    const name=p.slice('/assets/icons/illustrated/'.length),found=resolveLegacy(name);
    if(found) {await sendAsset(req,res,found);return true;}
  }
  if(!p.startsWith('/api/illustrations'))return false;
  const q=url.searchParams,style=q.get('style')||defaultStyle;
  if(req.headers['sec-fetch-site']==='cross-site')throw new AssetError('Cross-site API access denied',403);
  if(!['GET','HEAD'].includes(req.method))throw new AssetError('Read-only API; use GET',405);
  if(p==='/api/illustrations/search')json(res,search({query:q.get('q')||'',style,category:q.get('category')||undefined,pack:q.get('pack')||undefined,limit:Number(q.get('limit')||20),offset:Number(q.get('offset')||0)}));
  else if(p==='/api/illustrations/get')json(res,metadata(q.get('id'),style));
  else if(p==='/api/illustrations/packs')json(res,listPacks());
  else if(p==='/api/illustrations/styles')json(res,listStyles());
  else if(p==='/api/illustrations/status')json(res,inventory());
  else if(p==='/api/illustrations/asset')await sendAsset(req,res,{id:q.get('id'),style,format:q.get('format')||'webp',size:Number(q.get('size')||512)});
  else if(p==='/api/illustrations/export') {
    const result=await exportZip({ids:q.getAll('id'),pack:q.get('pack')||undefined,style,format:q.get('format')||'webp',size:Number(q.get('size')||512)});
    json(res,{download:result.download,sha256:result.sha256,bytes:result.bytes,items:result.items});
  } else if(/^\/api\/illustrations\/exports\/[a-f0-9]{64}\.zip$/.test(p)) {
    const filename=p.split('/').at(-1),file=await confinedFile(exportRoot,filename);
    const info=await fs.stat(file);
    res.writeHead(200,{'Content-Type':'application/zip','Content-Disposition':'attachment; filename="pattove-illustrations.zip"','Cache-Control':'private, max-age=300','Content-Length':info.size});
    if(req.method==='HEAD')res.end();else {const stream=createReadStream(file);stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);}
  } else throw new AssetError('Unknown illustration endpoint',404);
  return true;
}
async function sendAsset(req,res,options) {
  const image=await asset(options.id,options);
  const headers={'Content-Type':'image/'+image.format,'Cache-Control':'public, max-age=0, must-revalidate',ETag:image.etag};
  if(req.headers['if-none-match']===image.etag){res.writeHead(304,headers);res.end();return;}
  res.writeHead(200,{...headers,'Content-Length':image.bytes.length});res.end(req.method==='HEAD'?undefined:image.bytes);
}
