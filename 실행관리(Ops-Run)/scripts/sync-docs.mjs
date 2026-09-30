import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const update=(p,fn)=>{const before=read(p),after=fn(before);if(after!==before)fs.writeFileSync(path.join(root,p),after);};
const entries=[], categories=[];
for(const name of fs.readdirSync(path.join(root,'문서/사전')).filter(f=>f.endsWith('.md')).sort()) {
  const rows=read('문서/사전/'+name).split('\n').filter(l=>/^\|\s*[A-Z]+-\d+\s*\|/.test(l)).map(l=>l.split('|').slice(1,-1).map(v=>v.trim()));
  categories.push({id:name.split('-')[1],count:rows.length});
  entries.push(...rows.map(r=>({id:r[0],kind:r[3],evidence:r[5]})));
}
if(new Set(entries.map(e=>e.id)).size!==entries.length)throw Error('중복 사전 ID');
const count=fn=>entries.filter(fn).length;
const kinds=['기준','부품','구성','모듈','흐름'].map(k=>`${k} ${count(e=>e.kind===k)}개`).join(', ');
const summary=`**${categories.length}개 분류, ${entries.length}개 수록 항목**이다. ${kinds}다. 원문 개념 확인 ${count(e=>e.evidence.startsWith('확인'))}개, 프로젝트 요구에 따른 확장 ${count(e=>e.evidence.startsWith('확장'))}개다. 확장 중 [MK] 항목은 ${count(e=>e.evidence.startsWith('확장')&&e.evidence.includes('[MK]'))}개이며, 그중 ${count(e=>e.evidence.startsWith('확장')&&e.evidence.includes('[MK]')&&e.evidence.includes('대조'))}개에 원문 대조가 붙어 있다. 전체 대조 표시는 ${count(e=>e.evidence.includes('대조'))}개다. 이 수는 서로 다른 층위의 사전 레코드 수이며, 독립 부품 수나 완성률이 아니다.`;
update('문서/패턴 사전 색인과 사용법.md',s=>s.replace(/^\*\*\d+개 분류, \d+개 수록 항목\*\*.*$/m,summary).replace(/\(\d+개 분류, 파일 이름은/,`(${categories.length}개 분류, 파일 이름은`).replace(/^(\| \[.*?\]\(<사전\/.*?>\) \| ([A-Z]+) \| )\d+( \|)$/gm,(line,start,id,end)=>start+categories.find(c=>c.id===id).count+end));
const system=JSON.parse(read('src/data/system-registry.json'));
for(const p of ['README.md','문서/아토믹 뼈대 정합성.md'])update(p,s=>s.replace(/\*\*\d+\.\d+\.\d+ \/ Trial\*\*/g,`**${system.version} / Trial**`));
update('문서/메인 스타일 명세.md',s=>s.replace(/· \d+\.\d+\.\d+ · Trial/,`· ${system.version} · Trial`));
console.log(`Docs: ${categories.length} categories, ${entries.length} entries, system ${system.version}.`);
