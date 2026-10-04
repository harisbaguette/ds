import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parseArgs} from 'node:util';
import {Zip,ZipPassThrough,ZipDeflate} from 'fflate';
import {root} from './lib/system-store.mjs';
const {values}=parseArgs({options:{out:{type:'string'},list:{type:'boolean'}}});
const packageRoot=path.dirname(root),prefix=path.basename(root),files=[];
function collect(relative){
  const file=path.join(packageRoot,relative),stat=fs.lstatSync(file);
  if(stat.isSymbolicLink())throw Error('Release input must not be a symlink: '+relative);
  if(stat.isDirectory())for(const name of fs.readdirSync(file).sort())collect(path.join(relative,name));
  else if(stat.isFile())files.push({file,name:relative.split(path.sep).join('/'),bytes:stat.size});
}
try{
  for(const name of ['src','assets','scripts','tests','문서','영감보관함','index.html','package.json','package-lock.json','README.md','DESIGN.md'])collect(path.join(prefix,name));
  for(const name of ['사용방법.md','패토브 실행.command','.github','.gitattributes','.gitignore'])collect(name);
  if(fs.existsSync(path.join(packageRoot,'패토브 실행.exe')))collect('패토브 실행.exe');
  if(values.list){console.log(JSON.stringify({files:files.length,bytes:files.reduce((n,f)=>n+f.bytes,0),paths:files.map(f=>f.name)},null,2));}
  else{
    if(!values.out)throw Error('--out is required');
    const target=path.resolve(values.out);
    if(fs.existsSync(target))throw Error('Archive already exists; choose a new path');
    if(files.some(f=>f.file===target))throw Error('Output conflicts with an input');
    await fsp.mkdir(path.dirname(target),{recursive:true});
    const handle=await fsp.open(target,'wx'),hash=createHash('sha256'),manifest=[];
    let chunks=[],finished=false,total=0;
    const zip=new Zip((error,data,final)=>{if(error)throw error;chunks.push(data);if(final)finished=true;});
    const flush=async()=>{for(const chunk of chunks){await handle.writeFile(chunk);hash.update(chunk);total+=chunk.length;}chunks=[];};
    try{
      for(const item of files){
        const compressed=/\.(?:json|js|cjs|mjs|jsx|css|html|md|txt|toml|yml|command|cs|ps1|svg)$/.test(item.name);
        const entry=compressed?new ZipDeflate(item.name,{level:6}):new ZipPassThrough(item.name),contentHash=createHash('sha256');
        entry.mtime=new Date('2020-01-01T00:00:00Z');entry.os=3;entry.attrs=(item.name.endsWith('.command')?0o100755:0o100644)<<16;zip.add(entry);
        const input=compressed?[Buffer.from(fs.readFileSync(item.file,'utf8').replace(/\r\n/g,'\n'))]:fs.createReadStream(item.file,{highWaterMark:64*1024});
        let bytes=0;
        for await(const chunk of input){bytes+=chunk.length;contentHash.update(chunk);entry.push(chunk,false);await flush();}
        entry.push(new Uint8Array(),true);await flush();
        manifest.push({path:item.name,bytes,sha256:contentHash.digest('hex')});
      }
      const entry=new ZipDeflate('release-manifest.json',{level:6});entry.mtime=new Date('2020-01-01T00:00:00Z');zip.add(entry);
      entry.push(Buffer.from(JSON.stringify({version:JSON.parse(fs.readFileSync(path.join(root,'package.json'))).version,files:manifest},null,2)),true);
      zip.end();await flush();if(!finished)throw Error('Incomplete archive');
    }finally{await handle.close();}
    const sha256=hash.digest('hex');await fsp.writeFile(target+'.sha256',sha256+'  '+path.basename(target)+'\n',{flag:'wx'});
    console.log(JSON.stringify({archive:target,files:files.length,bytes:total,sha256},null,2));
  }
}catch(error){console.error(error.message);process.exitCode=1;}
