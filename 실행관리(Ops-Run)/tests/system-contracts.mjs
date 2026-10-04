import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js';
import {describe,search,coverage,exportSources,compareInstallation,root} from '../scripts/lib/system-store.mjs';
import {loadTokens} from '../scripts/tokens.mjs';
const {kindsIn}=loadTokens(root);
for(const name of fs.readdirSync(path.join(root,'src/styles')).filter(n=>n.endsWith('.css')))kindsIn(fs.readFileSync(path.join(root,'src/styles',name),'utf8'),name);
for(const [id,expected]of Object.entries({'INP-02':'input','INP-04':'checkbox','INP-08':'switch','ACT-07':'dialog','INP-03':'textarea','INP-06':'select','INP-07':'combobox'}))assert.equal(describe(id).id,expected);
assert.equal(describe('DAT-54').id,'summary-list');assert(describe('STA-07').specification.references.length);assert.equal(describe('VIS-01').status,'guideline');assert.equal(describe('input',{environment:'native'}).installation,null);assert.throws(()=>describe(undefined));
assert.equal(describe('ICO-01').status,'asset-ready');assert(describe('ICO-01').assets);
assert(search({query:'checkbox',implementedOnly:true}).items.some(i=>i.id==='checkbox'));
assert.equal(search({query:'checkbox',implementedOnly:true,environment:'native'}).total,0);
const cov=coverage();assert(cov.records.length>=8047);assert(cov.records.some(e=>e.status==='not-implemented'));assert(cov.records.some(e=>e.needsSourceReview));
const out=fs.mkdtempSync(path.join(root,'test-results/contracts-'));
const exported=exportSources({ids:['textarea','dialog','spinner'],out:path.join(out,'export')});assert(exported.files>10);
assert.throws(()=>exportSources({ids:['input'],out:exported.directory}));
let diff=compareInstallation(exported.directory);assert(diff.every(i=>i.files.every(f=>f.status==='unchanged')));
fs.appendFileSync(path.join(exported.directory,'design/css/textarea.css'),'\n/* consumer edit */');
diff=compareInstallation(exported.directory);assert(diff.some(i=>i.files.some(f=>f.status==='locally-modified')));
fs.appendFileSync(path.join(exported.directory,'design/fonts.css'),'\n/* consumer font edit */');assert(compareInstallation(exported.directory).some(i=>i.files.some(f=>f.path.endsWith('/fonts.css')&&f.status==='locally-modified')));
assert.throws(()=>exportSources({ids:['../../outside'],out:path.join(out,'escape')}));assert(!fs.existsSync(path.join(out,'escape')));
for(const recipe of ['settings-form','input-result','article-page','search-filter-results']){
  const result=exportSources({recipe,out:path.join(out,recipe)});assert(fs.existsSync(path.join(result.directory,'index.html')));
  const html=fs.readFileSync(path.join(result.directory,'index.html'),'utf8');assert(!html.includes('undefined'));if(recipe==='search-filter-results')assert(html.includes('ds-page'));
}
const client=new Client({name:'pattove-test',version:'1.0.0'}),transport=new StdioClientTransport({command:process.execPath,args:[path.join(root,'scripts/system-mcp.mjs')]});
try{await client.connect(transport);assert.equal((await client.listTools()).tools.length,7);const result=await client.callTool({name:'get_design_component',arguments:{id:'INP-04'}});assert.equal(JSON.parse(result.content[0].text).id,'checkbox');const missing=await client.callTool({name:'get_design_component',arguments:{id:'missing'}});assert(missing.isError);const contract=JSON.parse((await client.callTool({name:'get_screen_contract',arguments:{}})).content[0].text);assert.equal(contract.schema.additionalProperties,false);const valid=JSON.parse((await client.callTool({name:'validate_design_screen',arguments:{spec:contract.example}})).content[0].text);assert(valid.valid);assert.equal(valid.bindings[0].section,'application');assert((await client.callTool({name:'validate_design_screen',arguments:{spec:{version:1}}})).isError);}finally{await client.close();}
console.log('System contracts, portable export, local modifications and MCP verified.');
