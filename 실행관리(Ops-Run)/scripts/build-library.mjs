import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { Marked, Lexer, Renderer } from 'marked';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'src/data');
const docOut = path.join(out, 'documents');
fs.mkdirSync(docOut, { recursive: true });
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain = tokens => tokens.map(t => t.tokens ? plain(t.tokens) : t.text ?? t.raw ?? '').join('');
const text = cell => plain(cell.tokens).trim();
const fixed = {
  '문서/디자인 시스템 정의.md': ['definition','정의'],
  '문서/구성요소 계층표.md': ['layers','구성요소 계층'],
  '문서/패턴 사전 색인과 사용법.md': ['guide','사전 사용법'],
  '문서/HTML까지 재사용하는 구현 조사.md': ['implementation','HTML·React 지원'],
  '문서/레퍼런스 출처 대장.md': ['references','레퍼런스'],
  '문서/UI 스킬 적용 분석.md': ['design-analysis','이전 설계 기록']
};
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
const layers = [
  ['token','토큰','Token'],['primitive','최소 표현','Primitive'],['atom','단일 부품','Atom'],['molecule','조합 부품','Molecule'],
  ['module','모듈','Module'],['pattern','패턴','Pattern'],['template','템플릿','Template'],['page','페이지','Page']
].map(([id,name,english]) => ({id,name,english}));
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true})) {
    const p = path.posix.join(dir,entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith('.md')) files.push(p);
  }
}
for (const dir of ['문서','시안','영감보관함']) walk(dir);
files.push('README.md','DESIGN.md','ASSETS.md');
files.sort();
const documents = files.map(source => {
  const markdown = fs.readFileSync(path.join(root,source),'utf8').replace(/^\uFEFF/,'');
  const tokens = Lexer.lex(markdown);
  const heading = tokens.find(t => t.type === 'heading');
  const id = fixed[source]?.[0] || (source.startsWith('문서/사전/') ? path.basename(source).split('-')[1] : 'doc-' + crypto.createHash('sha1').update(source).digest('hex').slice(0,10));
  return {id,source,name:fixed[source]?.[1] || (heading ? plain(heading.tokens) : path.basename(source,'.md')), markdown,tokens, toc:[]};
});
const bySource = new Map(documents.map(d => [d.source,d]));
const slug = title => title.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,'').trim().replace(/\s+/g,'-');
const linkAudit = [];
function destination(href, source) {
  if (/^(https?:|mailto:)/i.test(href)) return href;
  if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('//')) return '';
  const [raw, fragment=''] = href.split('#');
  let decoded;
  try { decoded = decodeURIComponent(raw); } catch { return ''; }
  let target = path.resolve(root,path.dirname(source),decoded || path.basename(source));
  if (target !== root && !target.startsWith(root + path.sep)) return '';
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    for (const name of ['README.md','index.html']) if (fs.existsSync(path.join(target,name))) { target=path.join(target,name); break; }
  }
  const relative = path.relative(root,target).split(path.sep).join('/');
  const doc = bySource.get(relative);
  if (doc) {
    const params = new URLSearchParams({doc:doc.id});
    if (fragment) params.set('section', 'doc-' + decodeURIComponent(fragment));
    return '#/docs?' + params;
  }
  const exists = fs.existsSync(target);
  linkAudit.push({source,href,target:relative,exists});
  // A missing historical reference stays readable; it is not made into a dead link.
  if (!exists) return '';
  return relative.split('/').map(encodeURIComponent).join('/') + (fragment ? '#'+fragment : '');
}
for (const doc of documents) {
  const seen = new Map();
  const renderer = {
    html(token) { return esc(token.text); },
    heading(token) {
      const title = plain(token.tokens);
      const base = slug(title), n = seen.get(base) || 0;
      seen.set(base,n+1);
      const id = 'doc-' + base + (n ? '-'+n : '');
      if (token.depth >= 2 && token.depth <= 3) doc.toc.push({id,title,depth:token.depth});
      return '<h'+Math.min(6,token.depth+1)+' id="'+esc(id)+'">'+this.parser.parseInline(token.tokens)+'</h'+Math.min(6,token.depth+1)+'>\n';
    },
    link(token) {
      const href = destination(token.href,doc.source), label=this.parser.parseInline(token.tokens);
      if (!href) return label;
      return '<a href="'+esc(href)+'"'+(/^https?:/i.test(href)?' target="_blank" rel="noopener noreferrer"':'')+'>'+label+'</a>';
    },
    image(token) {
      const href=destination(token.href,doc.source);
      return href ? '<img src="'+esc(href)+'" alt="'+esc(token.text)+'" loading="lazy">' : esc(token.text);
    },
    table(token) { return '<div class="doc-table" tabindex="0" role="region" aria-label="문서 표">'+Renderer.prototype.table.call(this,token)+'</div>'; }
  };
  const parser = new Marked({renderer,gfm:true});
  const html = parser.parse(doc.markdown);
  fs.writeFileSync(path.join(docOut,doc.id+'.js'), 'window.Pattove.documentPages=window.Pattove.documentPages||{};\nwindow.Pattove.documentPages['+JSON.stringify(doc.id)+']='+JSON.stringify({html,toc:doc.toc})+';\n');
}
const categories=[], entries=[];
const ids=new Set();
for (const doc of documents.filter(d=>d.source.startsWith('문서/사전/'))) {
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
categories.sort((a,b)=>Number(path.basename(a.source).slice(0,2))-Number(path.basename(b.source).slice(0,2)));
const covered=groups.flatMap(g=>g.codes);
if(covered.length!==categories.length||new Set(covered).size!==covered.length||categories.some(c=>!covered.includes(c.id)))throw new Error('Category group coverage mismatch');
const layerDoc=bySource.get('문서/구성요소 계층표.md');
const table=layerDoc.tokens.find(t=>t.type==='table' && text(t.header[0])==='레벨');
if(!table)throw new Error('Missing hierarchy table');
const components=[];let layer;
for(const row of table.rows) {
  const [level,name,examples]=row.map(text);
  if(level)layer=layers[Number(level.match(/^\d+/)?.[0])];
  if(!layer||!name||!examples)throw new Error('Invalid component row');
  const id=layer.id+'-'+crypto.createHash('sha1').update(name).digest('hex').slice(0,8);
  if(components.some(c=>c.id===id))throw new Error('Duplicate component '+name);
  components.push({id,layer:layer.id,name,examples});
}
for(const l of layers)l.count=components.filter(c=>c.layer===l.id).length;
const core=Object.values(fixed).map(([id])=>id);
const notes=documents.filter(d=>d.source.startsWith('문서/')&&!d.source.startsWith('문서/사전/')&&!core.includes(d.id)).map(d=>d.id);
const payload={
 categories,groups,layers,entries,components,
 documents:documents.map(({id,name,source})=>({id,name,source})),
 coreDocuments:core,noteDocuments:notes
};
fs.writeFileSync(path.join(out,'library.js'),'/* Generated from repository Markdown by scripts/build-library.mjs. */\nwindow.Pattove=window.Pattove||{};\nwindow.Pattove.library='+JSON.stringify(payload)+';\n');
fs.mkdirSync(path.join(root,'test-results/library'),{recursive:true});
fs.writeFileSync(path.join(root,'test-results/library/source-audit.json'),JSON.stringify({categories:categories.length,entries:entries.length,layers:layers.length,components:components.length,documents:documents.length,missingHistoricalLinks:linkAudit.filter(l=>!l.exists)},null,2));
console.log(JSON.stringify({categories:categories.length,entries:entries.length,layers:layers.length,components:components.length,documents:documents.length,missingHistoricalLinks:linkAudit.filter(l=>!l.exists).length}));

