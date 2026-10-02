#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { search, metadata, inventory, listPacks, asset, cacheRoot, exportRoot, defaultStyle, allIds, getStyle, root } from './lib/illustration-store.mjs';
import { exportDirectory, exportZip } from './lib/illustration-export.mjs';
const {values,positionals}=parseArgs({allowPositionals:true,options:{
  query:{type:'string'},id:{type:'string',multiple:true},pack:{type:'string'},style:{type:'string'},format:{type:'string'},size:{type:'string'},
  offset:{type:'string'},limit:{type:'string'},out:{type:'string'},all:{type:'boolean'}
}});
const [command='help',subject]=positionals;
const options={ids:values.id||[],pack:values.pack,style:values.style||defaultStyle,format:values.format||'webp',size:Number(values.size||512)};
try {
  let result;
  if(command==='search')result=search({query:values.query||subject||'',style:options.style,pack:options.pack,offset:Number(values.offset||0),limit:Number(values.limit||20)});
  else if(command==='get')result=metadata(subject||options.ids[0],options.style);
  else if(command==='packs')result=listPacks();
  else if(command==='status')result=inventory();
  else if(command==='export') {
    if(values.all)options.ids=allIds();
    result=values.out?await exportDirectory(options,values.out):await exportZip(options);
  } else if(command==='cache-clear') {
    await fs.rm(cacheRoot,{recursive:true,force:true});await fs.rm(exportRoot,{recursive:true,force:true});result={cleared:true};
  } else if(command==='materialize') {
    const ids=values.all?allIds():options.ids;
    if(!ids.length)throw Error('Use --all or --id ID');
    const s=getStyle(options.style);
    if(options.style!==defaultStyle)throw Error('Use export --out for a non-default style');
    let count=0;
    for(const id of new Set(ids.map(id=>s.records.get(id)?.entry))) {
      if(!id)throw Error('Unknown illustration');
      const record=s.records.get(id);
      for(const [format,size,suffix] of [['webp',192,'-192.webp'],['webp',512,'.webp'],['png',512,'.png']]) {
        const image=await asset(id,{style:options.style,format,size});
        await fs.writeFile(path.join(root,'assets/icons/illustrated',record.name+suffix),image.bytes);
      }
      count++;
    }
    result={materialized:count,note:'These generated files are ignored by Git. They support the file:// catalog.'};
  } else if(command==='help')result={commands:[
    'npm run icons -- search 검색','npm run icons -- get ICO-62','npm run icons -- packs',
    'npm run icons -- export --id ICO-62 --id material:yard --out ./my-icons',
    'npm run icons -- export --pack core-ui --format webp --out ./ui-icons',
    'npm run icons -- export --all --out ./all-icons','npm run icons -- materialize --all','npm run icons -- cache-clear'
  ]};
  else throw Error('Unknown command: '+command);
  console.log(JSON.stringify(result,null,2));
}catch(error){console.error(JSON.stringify({error:error.message}));process.exitCode=1;}
