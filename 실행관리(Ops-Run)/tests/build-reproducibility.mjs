import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {root} from '../scripts/lib/system-store.mjs';
const target=fs.mkdtempSync(path.join(root,'test-results/build-newlines-')),textFiles=[];
function copy(relative){
  const source=path.join(root,relative),destination=path.join(target,relative);
  if(fs.statSync(source).isDirectory()){fs.mkdirSync(destination,{recursive:true});for(const name of fs.readdirSync(source))copy(path.join(relative,name));}
  else{
    fs.mkdirSync(path.dirname(destination),{recursive:true});fs.copyFileSync(source,destination);
    if(/\.(js|mjs|jsx|json|css|html|txt|md)$/.test(relative))textFiles.push(destination);
  }
}
for(const file of ['scripts/build-system.mjs','scripts/tokens.mjs','src/system','src/styles','src/tokens','src/data/catalog.js','src/data/ui-icons.json','src/ui/icons.js','assets/fonts','index.html'])copy(file);
const run=newline=>{
  for(const file of textFiles)fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n').replace(/\n/g,newline));
  execFileSync(process.execPath,['scripts/build-system.mjs'],{cwd:target,windowsHide:true});
  return ['system-registry.json','system-source.js','system-fonts.js'].map(file=>fs.readFileSync(path.join(target,'src/data',file),'utf8'));
};
assert.deepEqual(run('\n'),run('\r\n'));
console.log('Fresh system build outputs are identical for LF and CRLF source files.');
