import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
let cached;
export function system() {
  if(cached)return cached;
  const context=vm.createContext({window:{}});
  for(const file of ['src/data/catalog.js','src/data/library.js','src/ui/icons.js','src/system/registry.js','src/system/parts.js','src/system/admin.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
  return cached=context.window.Pattove;
}
export function describe(id,{environment='html',style='main',baseURL='http://127.0.0.1:4173'}={}) {
  if(typeof id!=='string'||!id)throw Error('An ID is required');
  const {systemRegistry:r,library:l,catalog}=system();
  if(!['html','react','native','print'].includes(environment))throw Error('Unknown environment');
  const selected=catalog.styles.find(s=>s.id===style);if(!selected)throw Error('Unknown style');
  const item=r.index.get(id)||r.items.find(i=>i.entry===id),entry=l.entries.find(e=>e.id===(item?.entry||id));
  if(!item&&!entry)throw Error('Unknown ID: '+id);
  if(!item)return {id:entry.id,name:entry.name,kind:entry.kind,status:entry.art?'asset-ready':entry.kind==='기준'?'guideline':'not-implemented',purpose:entry.usage,evidence:entry.evidence,source:l.categories.find(c=>c.id===entry.category)?.source,assets:entry.art||null,style:selected.id,implementation:null};
  const installable=['html','react'].includes(environment),name=item.layer==='Token'?`pattove-${style}-${item.id}`:item.id==='icon'?null:`pattove-${style}-${item.id}-${environment}`;
  return {id:item.id,dictionaryId:item.entry||null,name:item.name,status:'implemented',lifecycle:item.lifecycle,version:item.version,purpose:item.purpose,compatibility:item.compatibility,inputs:item.inputs,events:item.events,style:selected,support:item.support,verification:item.verification,dependencies:r.dependencies(item.id).map(i=>i.id),specification:JSON.parse(fs.readFileSync(path.join(root,'src/system/specifications.json'),'utf8'))[item.id]||null,source:{html:item.source,react:item.reactSource,css:'src/system/parts.css'},installation:installable&&name?{registry:`${baseURL.replace(/\/$/,'')}/src/registry/r/${name}.json`,command:`npx shadcn@4.21.0 add ${baseURL.replace(/\/$/,'')}/src/registry/r/${name}.json`}:null,limitations:installable?[]:[environment+' support has not been verified']};
}
export function search({query='',environment='html',implementedOnly=false,category,limit=20,offset=0}={}) {
  const {library:l,systemRegistry:r}=system(),claimed=new Set(r.items.map(i=>i.entry).filter(Boolean));
  const rows=[...r.items.map(i=>({id:i.id,name:i.name,purpose:i.purpose,keywords:i.keywords,category:i.browse.code,status:'implemented',lifecycle:i.lifecycle,support:i.support})),...l.entries.filter(e=>!claimed.has(e.id)).map(e=>({id:e.id,name:e.name,purpose:e.usage,keywords:e.term,category:e.category,status:e.art?'asset-ready':e.kind==='기준'?'guideline':'not-implemented',evidence:e.evidence}))];
  const terms=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const found=rows.filter(i=>(!category||i.category===category)&&(!implementedOnly||(i.status==='implemented'&&i.support?.[environment]==='implemented'))).map(item=>{
    const name=(item.name+' '+item.id).toLocaleLowerCase(),body=(item.purpose+' '+item.keywords).toLocaleLowerCase();
    return {...item,score:terms.reduce((n,t)=>n+(item.id.toLowerCase()===t?100:name.includes(t)?10:body.includes(t)?3:0),0)};
  }).filter(i=>!terms.length||i.score>0).sort((a,b)=>b.score-a.score||(a.status==='implemented'?-1:0)-(b.status==='implemented'?-1:0)||a.id.localeCompare(b.id));
  offset=Math.max(0,Number(offset)||0);limit=Math.min(100,Math.max(1,Number(limit)||20));
  return {total:found.length,offset,limit,items:found.slice(offset,offset+limit)};
}
export function recipes() {return system().systemRegistry.patterns;}
export function plan(id,{environment='html',style='main'}={}) {
  const recipe=recipes().find(r=>r.id===id);if(!recipe)throw Error('Unknown recipe: '+id);
  return {recipe,style,environment,components:recipe.items.map(id=>describe(id,{environment,style})),requiredChecks:['실제 콘텐츠의 길이·빈 값·이미지 실패','키보드·모바일·확대','실패 시 입력 유지와 재시도','소비 프로젝트에서 스타일·의존성 충돌'],automaticVisualApproval:false};
}
export function coverage() {
  const {library:l,systemRegistry:r}=system(),linked=new Map(r.items.filter(i=>i.entry).map(i=>[i.entry,i]));
  const records=l.entries.map(e=>({id:e.id,category:e.category,kind:e.kind,status:linked.has(e.id)?'implemented':e.art?'asset-ready':e.kind==='기준'?'guideline':'not-implemented',implementation:linked.get(e.id)?.id||null,evidence:e.evidence,needsSourceReview:e.evidence.includes('[MK]')&&!e.evidence.includes('대조')}));
  return {version:r.version,implementations:r.items.length,recipes:r.patterns.length,dictionaryEntries:records.length,categories:l.categories.map(c=>({id:c.id,total:records.filter(e=>e.category===c.id).length,states:records.filter(e=>e.category===c.id).reduce((o,e)=>(o[e.status]=(o[e.status]||0)+1,o),{})})),records};
}
export function registryFiles(ids,environment,style) {
  const files=new Map(),visited=new Set(),dependencies=new Set();
  const visit=name=>{
    if(!/^pattove-[a-z0-9-]+$/.test(name))throw Error('Invalid registry item');if(visited.has(name))return;visited.add(name);
    const item=JSON.parse(fs.readFileSync(path.join(root,'src/registry/r',name+'.json'),'utf8'));
    for(const url of item.registryDependencies||[])visit(new URL(url).pathname.split('/').pop().replace(/\.json$/,''));
    for(const dep of item.dependencies||[])dependencies.add(dep);
    for(const file of item.files||[]){const target=file.target.replace(/^~\//,'');if(!target.startsWith('design/')||target.split('/').includes('..'))throw Error('Unsafe target');if(files.has(target)&&files.get(target)!==file.content)throw Error('Conflicting file: '+target);files.set(target,file.content);}
  };
  for(const id of ids){const item=system().systemRegistry.index.get(id);if(!item)throw Error('Unknown implementation: '+id);visit(item.layer==='Token'?`pattove-${style}-${id}`:`pattove-${style}-${id}-${environment}`);}
  return {files,dependencies:[...dependencies]};
}
export function exportSources({ids,environment='html',style='main',out,recipe,title='패토브 화면'}) {
  if(!['html','react'].includes(environment)||style!=='main')throw Error('Unsupported environment or style');
  const chosen=recipe?recipes().find(r=>r.id===recipe):null;if(recipe&&!chosen)throw Error('Unknown recipe');
  ids=chosen?.items||ids;if(!Array.isArray(ids)||!ids.length)throw Error('Choose implementation IDs or a recipe');
  const {files,dependencies}=registryFiles(ids,environment,style),target=path.resolve(out);
  const entryID=chosen&&(chosen.items.find(id=>system().systemRegistry.index.get(id)?.layer==='Page')||chosen.items[0]);
  if(fs.existsSync(target))throw Error('Output must be a new directory');
  // Validate every path and construct the composition before creating any files.
  for(const name of files.keys()){const resolved=path.resolve(target,name);if(!resolved.startsWith(target+path.sep))throw Error('Unsafe output path');}
  if(recipe&&environment==='html'){
    const p=system().parts,main=entryID;
    const links=[...files.keys()].filter(f=>f.endsWith('.css')).map(f=>`<link rel="stylesheet" href="${f}">`).join('\n');
    const scripts=['design/html/table-core.min.js','design/html/admin.js','design/html/behaviors.js'].filter(f=>files.has(f)).map(f=>`<script src="${f}"></script>`).join('\n');
    const markup=files.get('design/html/'+main+'.html');
    if(!markup)throw Error('Missing HTML entry: '+main);
    files.set('index.html',`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${p.esc(title)}</title>${links}<body class="ds" data-style="main"><main>${markup}</main>${scripts}</body></html>`);
  }
  if(recipe&&environment==='react')files.set('page.jsx',`export { default } from './design/examples/main/${entryID}.jsx';\n`);
  writeExport(files,target);
  return {directory:target,files:files.size,dependencies,entry:recipe?(environment==='html'?'index.html':'page.jsx'):ids.map(id=>'design/examples/'+style+'/'+id+'.'+(environment==='html'?'html':'jsx')),integration:recipe&&['login-form','settings-form'].includes(chosen.items[0])?'Connect the async submit callback before use':undefined};
}
export function writeExport(files,out){
  if(typeof out!=='string'||!out.trim())throw Error('Output directory is required');
  const target=path.resolve(out);
  if(fs.existsSync(target))throw Error('Output must be a new directory');
  for(const [name,content]of files){
    const resolved=path.resolve(target,name);
    if(!resolved.startsWith(target+path.sep)||typeof content!=='string')throw Error('Unsafe output file: '+name);
  }
  // Claim a new directory atomically; never follow a pre-existing consumer directory.
  fs.mkdirSync(target);
  try{for(const [name,content]of files){const file=path.join(target,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content,{flag:'wx'});}}
  catch(error){throw Error('Export interrupted; partial output remains at '+target+': '+error.message);}
  return target;
}
export function compareInstallation(project) {
  const base=path.resolve(project),dir=path.join(base,'design/manifests');if(!fs.existsSync(dir))throw Error('No installation manifests');
  return fs.readdirSync(dir).filter(n=>n.endsWith('.json')).map(name=>{
    const manifest=JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
    if(!/^[a-z0-9-]+$/.test(manifest.item)||!['main'].includes(manifest.style)||!['html','react'].includes(manifest.environment))throw Error('Invalid installation manifest');
    const item=system().systemRegistry.index.get(manifest.item),currentPath=path.join(root,'src/registry/r',`pattove-${manifest.style}-${manifest.item}-${manifest.environment}.json`),current=item&&fs.existsSync(currentPath)?JSON.parse(fs.readFileSync(currentPath)):null;
    return {item:manifest.item,installedVersion:manifest.version,currentVersion:item?.version||null,lifecycle:item?.lifecycle||'unavailable',replacement:item?.replacement||null,updateAvailable:!!current&&current.meta.sourceRevision!==manifest.sourceRevision,files:manifest.files.map(f=>{
      const file=path.resolve(base,f.path.replace(/^~\//,''));if(!file.startsWith(base+path.sep))throw Error('Unsafe manifest path');
      return {path:f.path,status:!fs.existsSync(file)?'missing':crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')===f.sha256?'unchanged':'locally-modified'};
    })};
  });
}
