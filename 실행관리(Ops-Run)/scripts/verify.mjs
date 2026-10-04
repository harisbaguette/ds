import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {root} from './lib/system-store.mjs';
const all=process.argv.includes('--all');
const suites=all?fs.readdirSync(path.join(root,'tests')).filter(n=>/\.(cjs|mjs)$/.test(n)&&!['frontend-repair.cjs','launcher.cjs','motion-interactions.cjs'].includes(n)).sort():['build-reproducibility.mjs','tokens.mjs','system-contracts.mjs','system-workflow.mjs','extended-parts.cjs','system-audit.cjs','navigation.cjs','references.cjs','ux-journeys.cjs'];
const run=(script,args=[])=>new Promise(resolve=>{
  const child=spawn(process.execPath,[script,...args],{cwd:root,stdio:'inherit',windowsHide:true});
  const timeout=setTimeout(()=>{console.error('Test timed out:',script);child.kill();},20*60*1000);
  const finish=code=>{clearTimeout(timeout);resolve(code);};
  child.once('error',e=>{console.error(e.message);finish(1);});child.once('exit',code=>finish(code??1));
});
let server;
const failures=[];
try {
  for(const script of ['build-library.mjs','build-illustration-catalog.mjs','build-ui-icons.mjs','build-system.mjs','sync-docs.mjs','build-registry.mjs']) {
    console.log('Build:',script);if(await run('scripts/'+script)){throw Error('Build failed: '+script);}
  }
  let status;try{status=await fetch('http://127.0.0.1:4173/__pattove/status').then(r=>r.json());}catch{}
  if(status&&path.resolve(status.root)!==root)throw Error('Port 4173 belongs to a different checkout');
  if(!status){server=spawn(process.execPath,['scripts/serve.cjs'],{cwd:root,stdio:'inherit',windowsHide:true});server.on('error',e=>console.error(e));for(let i=0;i<100;i++){try{status=await fetch('http://127.0.0.1:4173/__pattove/status').then(r=>r.json());break;}catch{await new Promise(r=>setTimeout(r,100));}}if(!status||path.resolve(status.root)!==root)throw Error('Test server did not start');}
  for(const suite of suites){console.log('\nTest:',suite);if(await run('tests/'+suite,suite==='illustrated-icons.cjs'?['--complete']:[]))failures.push(suite);}
  console.log(JSON.stringify({suites:suites.length,failures},null,2));if(failures.length)process.exitCode=1;
}catch(error){console.error(error.message);process.exitCode=1;}
finally{server?.kill();}
