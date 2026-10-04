import fs from 'node:fs';
import path from 'node:path';
import {z} from 'zod';
import {recipes,describe} from './system-store.mjs';

const schema=z.object({
  schemaVersion:z.literal(1),
  style:z.literal('main'),
  environment:z.enum(['html','react']),
  intent:z.string().max(2000),
  recipe:z.string().nullable(),
  decisions:z.array(z.object({id:z.string(),decision:z.enum(['accept','reject']),reason:z.string().min(1).max(2000)}).strict()).max(500)
}).strict();
const location=project=>{
  const dir=fs.realpathSync(path.resolve(project));
  if(!fs.statSync(dir).isDirectory())throw Error('Project must be a directory');
  const file=path.join(dir,'pattove.project.json');
  if(fs.existsSync(file)&&fs.lstatSync(file).isSymbolicLink())throw Error('Project profile must not be a symlink');
  return file;
};
export function readProfile(project){
  return schema.parse(JSON.parse(fs.readFileSync(location(project),'utf8')));
}
export function configureProfile(project,options={}){
  const file=location(project),previous=fs.existsSync(file)?readProfile(project):{schemaVersion:1,style:'main',environment:'html',intent:'',recipe:null,decisions:[]};
  const changes=Object.fromEntries(Object.entries(options).filter(([,v])=>v!==undefined));
  const profile=schema.parse({...previous,...changes});
  if(profile.recipe&&!recipes().some(r=>r.id===profile.recipe))throw Error('Unknown recipe');
  fs.writeFileSync(file,JSON.stringify(profile,null,2)+'\n');
  return profile;
}
export function recordDecision(project,{id,decision,reason}){
  describe(id);
  const previous=readProfile(project),decisions=previous.decisions.filter(d=>d.id!==id);
  decisions.push({id,decision,reason});
  return configureProfile(project,{decisions});
}
