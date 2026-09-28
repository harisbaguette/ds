import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { Lexer } from 'marked';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'src/data');
const plain = tokens => tokens.map(t => t.tokens ? plain(t.tokens) : t.text ?? t.raw ?? '').join('');
const text = cell => plain(cell.tokens).trim();
const groups = [
  {id:'expression', name:'시각 표현', codes:'VIS ART TYP IMG ANM FX'},
  {id:'interaction', name:'구성과 조작', codes:'LAY NAV ACT INP DAT STA SRH MOT MOB'},
  {id:'work', name:'콘텐츠와 작업', codes:'EDT CHR ANA RTE CAN COL FIL SCH GEO MED DOC'},
  {id:'service', name:'서비스와 흐름', codes:'WEB COM ACC SOC FLW AIX BIL HLP EDU PRV OPS TOO DOM MSG ADM DEV SEC GRO XR DVC VUI CLI'},
  {id:'game', name:'게임', codes:'GAM GHD GEC GLV GGN GIO GFX GTK GAC'},
  {id:'domain', name:'영역별 화면', codes:'KOR CNT OBS PRO DSK IND AGE MAG BLG SLD PRT VID FIN LIF HLT'},
  {id:'quality', name:'품질과 검증', codes:'ACS DSO PRF ANT STR LAW'},
  {id:'vocabulary', name:'기초 사전', codes:'ICO ATM MOD TOK STT GES SND CPY FMT ARI AST'}
].map(g => ({...g,codes:g.codes.split(' ')}));
// One layer vocabulary for code, data and UI. The hierarchy document keeps its eight source levels; each maps to one of these five.
const layers = [['token','토큰','Token'],['atom','원자','Atom'],['molecule','분자','Molecule'],['organism','유기체','Organism'],['screen','화면','Screen']].map(([id,name,english]) => ({id,name,english}));
const levelLayer = ['token','atom','atom','molecule','organism','organism','screen','screen'];
const uses = {
  token:[['color','색'],['type','글꼴'],['space','간격'],['shape','모양'],['shadow','그림자'],['motion','움직임']],
  part:[['action','행동'],['input','입력'],['navigation','탐색'],['display','보여주기'],['feedback','알림'],['layout','배치'],['media','미디어']],
  screen:[['template','템플릿'],['page','페이지'],['flow','흐름']]
};
const usesOf = layer => layer==='token'?uses.token:layer==='screen'?uses.screen:uses.part;
// Only the dictionary chapters and the hierarchy table feed the library; the Markdown is not published as pages.
const dictionaryDir = '문서/사전';
const read = source => {
  const tokens = Lexer.lex(fs.readFileSync(path.join(root,source),'utf8').replace(/^﻿/,''));
  const heading = tokens.find(t => t.type === 'heading');
  return {source,tokens,name:heading ? plain(heading.tokens) : path.basename(source,'.md')};
};
const chapters = fs.readdirSync(path.join(root,dictionaryDir)).filter(n => n.endsWith('.md')).sort()
  .map(n => ({...read(dictionaryDir+'/'+n), id:n.split('-')[1]}));
const categories=[], entries=[];
const ids=new Set();
for (const doc of chapters) {
  const table = doc.tokens.find(t=>t.type==='table' && text(t.header[0])==='ID');
  if(!table)throw new Error('Missing dictionary table: '+doc.source);
  const category={id:doc.id,name:doc.name.replace(/^\d+\.\s*/,''),count:table.rows.length,source:doc.source};
  categories.push(category);
  for(const row of table.rows) {
    const [id,name,kind,usage,evidence]=row.map(text);
    if(!id.startsWith(category.id+'-')||ids.has(id)||!name||!usage)throw new Error('Invalid dictionary record: '+id);
    ids.add(id);entries.push({id,name,kind,usage,evidence,category:category.id});
  }
}
// Layer, use and rule flag per entry are judged item by item and kept beside the dictionary source.
const classificationFile=path.join(root,'문서/사전 층 분류.json');
if(fs.existsSync(classificationFile)){
  const classification=JSON.parse(fs.readFileSync(classificationFile,'utf8').replace(/^﻿/,''));
  for(const e of entries){
    const c=classification[e.id];
    if(!c||!layers.some(l=>l.id===c[0])||!usesOf(c[0]).some(([id])=>id===c[1]))throw new Error('Invalid layer classification: '+e.id);
    e.layer=c[0];e.use=c[1];e.rule=!!c[2];
  }
}
categories.sort((a,b)=>Number(path.basename(a.source).slice(0,2))-Number(path.basename(b.source).slice(0,2)));
// New source categories stay reachable even before an editorial grouping is assigned.
const ungrouped=categories.filter(c=>!groups.some(g=>g.codes.includes(c.id)));
if(ungrouped.length)groups.push({id:'additional',name:'추가 분류',codes:ungrouped.map(c=>c.id)});
const covered=groups.flatMap(g=>g.codes);
if(covered.length!==categories.length||new Set(covered).size!==covered.length||categories.some(c=>!covered.includes(c.id)))throw new Error('Category group coverage mismatch');
// Browsing taxonomy: three shelves by kind (부품·블록·템플릿), common role groups vs "쓰는 곳" tags, and a second level inside icons.
const taxonomy=JSON.parse(fs.readFileSync(path.join(root,'문서/사전 갈래.json'),'utf8').replace(/^﻿/,''));
const {shelves,places,iconGroups,roleOrder}=taxonomy;
// A shelf claims entries by source code first (토큰 = TOK), then by kind; every entry lands on exactly one shelf.
const shelfCodes=shelves.flatMap(s=>s.codes||[]);
if(new Set(shelfCodes).size!==shelfCodes.length||shelfCodes.some(code=>!categories.some(c=>c.id===code)))throw new Error('Shelf codes must be unique existing categories');
if(shelves.some(s=>(s.layers||[]).some(id=>!layers.some(l=>l.id===id))))throw new Error('Shelf layers must be known component layers');
const shelfKinds=shelves.flatMap(s=>s.kinds), entryKinds=[...new Set(entries.filter(e=>!shelfCodes.includes(e.category)).map(e=>e.kind))];
if(new Set(shelfKinds).size!==shelfKinds.length||entryKinds.some(k=>!shelfKinds.includes(k)))throw new Error('Shelf kinds must cover every entry kind once: '+entryKinds.filter(k=>!shelfKinds.includes(k)).join(','));
const placeCodes=places.flatMap(p=>p.codes);
if(new Set(placeCodes).size!==placeCodes.length||placeCodes.some(code=>!categories.some(c=>c.id===code)))throw new Error('Place codes must be unique existing categories');
const useGroups=['service','game','domain'].flatMap(id=>groups.find(g=>g.id===id)?.codes||[]);
if(useGroups.some(code=>!placeCodes.includes(code))||placeCodes.some(code=>!useGroups.includes(code)))throw new Error('Places must cover exactly the service, game and domain categories');
if(groups.some(g=>!useGroups.some(code=>g.codes.includes(code))&&!roleOrder.includes(g.id)))throw new Error('Role order is missing a common group');
const icoNumber=id=>Number(id.slice(4));
for(const e of entries.filter(e=>e.category==='ICO')){
  const hit=iconGroups.filter(g=>g.ranges.some(r=>{const [a,b]=r.split('-').map(Number);return icoNumber(e.id)>=a&&icoNumber(e.id)<=b;}));
  if(hit.length!==1)throw new Error('Icon must fall in exactly one icon group: '+e.id);
  e.sub=hit[0].id;
}
const layerDoc=read('문서/구성요소 계층표.md');
const table=layerDoc.tokens.find(t=>t.type==='table' && text(t.header[0])==='레벨');
if(!table)throw new Error('Missing hierarchy table');
const components=[];let layer;
for(const row of table.rows) {
  const [level,name,examples]=row.map(text);
  if(level)layer=layers.find(l=>l.id===levelLayer[Number(level.match(/^\d+/)?.[0])]);
  if(!layer||!name||!examples)throw new Error('Invalid component row');
  const id=layer.id+'-'+crypto.createHash('sha1').update(name).digest('hex').slice(0,8);
  if(components.some(c=>c.id===id))throw new Error('Duplicate component '+name);
  components.push({id,layer:layer.id,name,examples});
}
for(const l of layers)l.count=components.filter(c=>c.layer===l.id).length;
const payload={categories,groups,layers,uses,shelves,places,roleOrder,iconGroups:iconGroups.map(({id,name})=>({id,name})),entries,components};
fs.writeFileSync(path.join(out,'library.js'),'/* Generated from repository Markdown by scripts/build-library.mjs. */\nwindow.Pattove=window.Pattove||{};\nwindow.Pattove.library='+JSON.stringify(payload)+';\n');
fs.mkdirSync(path.join(root,'test-results/library'),{recursive:true});
fs.writeFileSync(path.join(root,'test-results/library/source-audit.json'),JSON.stringify({categories:categories.length,entries:entries.length,layers:layers.length,components:components.length},null,2));
console.log(JSON.stringify({categories:categories.length,entries:entries.length,layers:layers.length,components:components.length}));

