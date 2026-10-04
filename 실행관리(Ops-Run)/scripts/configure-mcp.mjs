import fs from 'node:fs';
import path from 'node:path';
import {root} from './lib/system-store.mjs';
const workspace=path.dirname(root),jsonFile=path.join(workspace,'.mcp.json'),tomlFile=path.join(workspace,'.codex/config.toml');
const config=fs.existsSync(jsonFile)?JSON.parse(fs.readFileSync(jsonFile,'utf8')):{};
config.mcpServers??={};
let toml=fs.existsSync(tomlFile)?fs.readFileSync(tomlFile,'utf8'):'';
for(const [name,file] of [['pattove-illustrations','illustrations-mcp.mjs'],['pattove-system','system-mcp.mjs']]) {
  const script=path.join(root,'scripts',file).split(path.sep).join('/');
  config.mcpServers[name]={command:'node',args:[script]};
  const key=name.replace(/-/g,'_'),section=new RegExp('^\\[mcp_servers\\.'+key+'\\][\\s\\S]*?(?=^\\[|$(?![\\s\\S]))','gm');
  toml=toml.replace(section,'').trimEnd()+`\n\n[mcp_servers.${key}]\ncommand = "node"\nargs = [${JSON.stringify(script)}]\n`;
}
fs.writeFileSync(jsonFile,JSON.stringify(config,null,2)+'\n');fs.mkdirSync(path.dirname(tomlFile),{recursive:true});fs.writeFileSync(tomlFile,toml.trimStart());
console.log('MCP paths configured for this checkout. Restart the MCP client to load them.');
