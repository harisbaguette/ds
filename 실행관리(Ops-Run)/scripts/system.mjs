import {parseArgs} from 'node:util';
import {search,describe,coverage,recipes,plan,exportSources,compareInstallation} from './lib/system-store.mjs';
import {readProfile,configureProfile,recordDecision} from './lib/project-profile.mjs';
const {values:v,positionals:p}=parseArgs({allowPositionals:true,options:{query:{type:'string'},id:{type:'string',multiple:true},env:{type:'string'},style:{type:'string'},category:{type:'string'},limit:{type:'string'},offset:{type:'string'},implemented:{type:'boolean'},out:{type:'string'},recipe:{type:'string'},title:{type:'string'},project:{type:'string'},url:{type:'string'},intent:{type:'string'},decision:{type:'string'},reason:{type:'string'}}});
try {
  let result;
  switch(p[0]) {
    case 'search':result=search({query:v.query||p.slice(1).join(' '),environment:v.env,category:v.category,limit:v.limit,offset:v.offset,implementedOnly:v.implemented});break;
    case 'get':result=describe(p[1]||v.id?.[0],{environment:v.env,style:v.style});break;
    case 'coverage':result=coverage();break;
    case 'recipes':result=recipes();break;
    case 'plan':{const profile=v.project?readProfile(v.project):undefined;result={...plan(v.recipe||p[1]||profile?.recipe,{environment:v.env||profile?.environment,style:v.style||profile?.style}),profile};break;}
    case 'export':case 'compose':{if(!v.out)throw Error('--out is required');const profile=v.project?readProfile(v.project):undefined;result=exportSources({ids:v.id,environment:v.env||profile?.environment,style:v.style||profile?.style,out:v.out,recipe:v.recipe||(p[0]==='compose'?profile?.recipe:undefined),title:v.title});break;}
    case 'diff':if(!v.project)throw Error('--project is required');result=compareInstallation(v.project);break;
    case 'profile':if(!v.project)throw Error('--project is required');result=readProfile(v.project);break;
    case 'configure':if(!v.project)throw Error('--project is required');result=configureProfile(v.project,{style:v.style,environment:v.env,recipe:v.recipe,intent:v.intent});break;
    case 'record':if(!v.project)throw Error('--project is required');result=recordDecision(v.project,{id:v.id?.[0],decision:v.decision,reason:v.reason});break;
    case 'evaluate':{const {evaluateScreen}=await import('./lib/evaluate-screen.mjs');result=await evaluateScreen({project:v.project,url:v.url,out:v.out});if(!result.passed)process.exitCode=1;break;}
    default:result={commands:['search <query> [--implemented] [--category INP]','get <id> [--env html|react]','recipes','plan <recipe> [--project <directory>]','export --id <id> --out <new-directory>','compose --recipe <recipe> --out <new-directory>','diff --project <directory>','configure --project <directory> --env html --recipe <recipe> --intent <text>','profile --project <directory>','record --project <directory> --id <id> --decision accept|reject --reason <text>','evaluate --project <directory> | --url <local-url> [--out <new-directory>]','coverage']};
  }
  console.log(JSON.stringify(result,null,2));
}catch(error){console.error(error.message);process.exitCode=1;}
