const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { execFileSync, spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright-core');
const root = path.resolve(__dirname,'..');
const out = path.join(root,'test-results/source-consumers'); fs.mkdirSync(out,{recursive:true});
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const write = (file, text) => { fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,text); };
const checks = [], errors = [];
const check = (name, value) => { assert.ok(value,name); checks.push(name); };
const cli = path.join(root,'node_modules/shadcn/dist/index.js');
function install(names, folder) {
  fs.mkdirSync(folder,{recursive:true});
  try { execFileSync(process.execPath,[cli,'add',...names.map(name=>`http://127.0.0.1:4173/src/registry/r/${name}.json`),'--cwd',folder,'--yes','--overwrite'],{cwd:root,stdio:'pipe',timeout:120000,windowsHide:true}); }
  catch(error) { throw Error(String(error.stdout || error.message)); }
}
(async()=>{
  const { registryItemSchema, registrySchema } = await import('shadcn/schema');
  const registry = JSON.parse(read('src/registry/registry.json'));
  registrySchema.parse(registry);
  for(const listed of registry.items) {
    const item=JSON.parse(read('src/registry/r/'+listed.name+'.json'));
    registryItemSchema.parse(item);
    assert.ok(item.files.every(file=>file.target.startsWith('~/design/')&&typeof file.content==='string'));
    assert.equal(new Set(item.files.map(f=>f.target)).size,item.files.length);
  }
  check('모든 배포 항목이 공식 shadcn 스키마와 명시적 설치 경로를 따름',true);
  const fixture = fs.mkdtempSync(path.join(out,'run-'));
  const html = path.join(fixture,'html'), react = path.join(fixture,'react'), illustration = path.join(fixture,'illustration');
  install(['pattove-main-page-html','pattove-main-tabs-html','pattove-main-field-html'],html);
  install(['pattove-main-page-react','pattove-main-tabs-react','pattove-main-checkbox-react','pattove-main-select-all-list-react','pattove-main-password-input-react','pattove-main-count-badge-react','pattove-main-stepper-react','pattove-main-clear-input-react','pattove-main-media-card-react','pattove-main-bottom-nav-react'],react);
  install(['pattove-icon-search-html'],illustration);
  const { exportDirectory } = await import('../scripts/lib/illustration-export.mjs');
  await exportDirectory({ids:['material:yard','ICO-62']},path.join(react,'design/illustrations'));
  check('일러스트 하나에는 폰트·프레임워크·다른 아이콘이 설치되지 않음',fs.readdirSync(path.join(illustration,'design')).join(',')==='icons' && fs.readdirSync(path.join(illustration,'design/icons')).join(',')==='search.html');
  check('HTML과 React 소비자가 별도 components.json 없이 설치됨',!fs.existsSync(path.join(html,'components.json'))&&!fs.existsSync(path.join(react,'components.json')));
  const reactFiles = fs.readdirSync(path.join(react,'design/react'));
  check('React 페이지 설치 시 실제 하위 부품·블록 소스 포함', ['page.jsx','template.jsx','search-form.jsx','search-bar.jsx','filter-chip-row.jsx','result-grid.jsx','result-list.jsx','empty-state.jsx','field.jsx','input.jsx','button.jsx','card.jsx'].every(file=>reactFiles.includes(file)) && !reactFiles.includes('search-module.jsx'));
  const demo = `'use client';
import React,{useState} from 'react';
import Example from '../design/examples/main/page.jsx';
import { Illustration } from '../design/illustrations/Illustration.jsx';
import StepperExample from '../design/examples/main/stepper.jsx';
import ClearExample from '../design/examples/main/clear-input.jsx';
import MediaExample from '../design/examples/main/media-card.jsx';
import NavExample from '../design/examples/main/bottom-nav.jsx';
import { CollectionPage } from '../design/react/page.jsx';
import { Tabs } from '../design/react/tabs.jsx';
import { Checkbox } from '../design/react/checkbox.jsx';
import { SelectAllList } from '../design/react/select-all-list.jsx';
import { PasswordInput } from '../design/react/password-input.jsx';
import { CountBadge } from '../design/react/count-badge.jsx';
import { Field } from '../design/react/field.jsx';
import { Button } from '../design/react/button.jsx';
import '../design/css/tabs.css';import '../design/css/selection.css';import '../design/css/select-all-list.css';import '../design/css/input.css';import '../design/css/input-group.css';import '../design/css/password-input.css';import '../design/css/count-badge.css';
const many=['전체','진행 중','완료','보관함','공유받음','휴지통'].map((label,i)=>({value:'t'+i,label,content:label}));
function Alerts(){const [picked,setPicked]=useState([]);return <SelectAllList items={[{value:'c',label:'댓글'},{value:'l',label:'좋아요'},{value:'f',label:'새 팔로워'}]} value={picked} onChange={setPicked}/>;}
export default function Page(){const [saved,setSaved]=useState(0);return <><Example/><section className="ds" data-style="main" style={{padding:32}}><h2>다른 콘텐츠로 재사용</h2><CollectionPage title="도서 목록" records={[{id:'book-1',title:'긴 한글 제목이 들어가는 책과 오래도록 기억하고 싶은 문장들',description:'디자인과 편집',tag:'진행 중'},{id:'book-2',title:'그림으로 설명하기',description:'시각 언어',tag:'완료'}]} onSave={async(record)=>{if(record.id==='book-2'){if(!window.bookSaveAttempt){window.bookSaveAttempt=1;throw Error('저장 실패');}await new Promise(resolve=>{window.finishBookSave=resolve;});}setSaved(n=>n+1);}}/><output aria-label="저장 횟수">{saved}</output><Tabs label="첫 번째 탭"/><Tabs label="두 번째 탭"/><form aria-label="다른 폼"><Field label="배송 이름" error="이름을 다시 확인해 주세요."/><Checkbox name="consent">동의하기</Checkbox><Button type="submit">신청하기</Button></form><PasswordInput aria-label="비밀번호" defaultValue="pattove8"/><Alerts/><CountBadge count={3}>알림</CountBadge><CountBadge count={0}>알림</CountBadge><div style={{maxWidth:240}}><Tabs label="많은 탭" look="scroll" items={many} defaultValue="t5"/></div></section><section id="illustration-consumer"><StepperExample/><ClearExample/><MediaExample/><NavExample/><Illustration id="material:yard" alt="정원 일러스트" size={96}/></section></>;}
`;
  write(path.join(react,'package.json'),JSON.stringify({name:'pattove-consumer-proof',private:true,scripts:{dev:'next dev'}}));
  write(path.join(react,'app/page.jsx'),demo);
  write(path.join(react,'app/layout.jsx'),`import React from 'react';export default function Layout({children}){return <html lang="ko"><body style={{margin:0}}>{children}</body></html>}`);
  write(path.join(react,'next.config.mjs'),`export default {devIndicators:false,allowedDevOrigins:['127.0.0.1']};`);
  const server = spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'dev','--webpack','--hostname','127.0.0.1','--port','4184'],{cwd:react,stdio:['ignore','pipe','pipe'],windowsHide:true});
  const logs=[];server.stdout.on('data',d=>logs.push(String(d)));server.stderr.on('data',d=>logs.push(String(d)));
  const browser = await chromium.launch({headless:true});
  try {
    const page=await browser.newPage({viewport:{width:1280,height:1000}});page.on('pageerror',e=>errors.push(e.message));
    await page.route('http**',route=>route.abort());
    await page.goto(pathToFileURL(path.join(illustration,'design/icons/search.html')).href);
    check('개별 일러스트를 네트워크 없이 열 수 있음',await page.locator('img[data-ui-icon="search"]').evaluate(async node=>{await node.decode();return node.naturalWidth===192&&node.src.startsWith('data:image/webp;base64,');}));
    await page.goto(pathToFileURL(path.join(html,'design/examples/main/page.html')).href);
    await page.evaluate(()=>document.fonts.ready);
    check('내려받은 HTML의 일러스트도 네트워크 없이 표시됨',await page.locator('img.ui-icon').evaluateAll(async nodes=>{await Promise.all(nodes.map(node=>node.decode()));return nodes.length>0&&nodes.every(node=>node.naturalWidth===192&&node.src.startsWith('data:image/webp;base64,'));}));
    check('내려받은 HTML은 네트워크 없이 직접 열림',await page.locator('.ds-card').count()===3);
    await page.getByRole('textbox',{name:'컬렉션 검색'}).fill('없는 결과');await page.getByRole('button',{name:'검색',exact:true}).click();
    check('HTML 빈 결과',await page.locator('.ds-empty').isVisible());
    await page.getByRole('button',{name:'전체 보기',exact:true}).click();await page.locator('.ds-card button').first().click();
    check('HTML 상세 열기',await page.locator('.ds-record-detail').isVisible());
    await page.evaluate(()=>document.addEventListener('pattove:save',event=>{window.savedRecord=event.detail;}));
    await page.getByRole('button',{name:'컬렉션에 보관',exact:true}).click();await page.getByRole('button',{name:'목록으로',exact:true}).click();
    check('HTML의 실제 보관 행동을 소비 프로젝트에 전달',await page.evaluate(()=>window.savedRecord?.saved===true&&window.savedRecord?.id==='0'&&!!window.savedRecord?.title));
    check('HTML 복귀 초점과 선택 유지',await page.locator('.ds-card button').first().evaluate(n=>n===document.activeElement));
    await page.screenshot({path:path.join(out,'html-offline.png')});
    const noJS=await browser.newContext({javaScriptEnabled:false});const staticPage=await noJS.newPage();
    await staticPage.goto(pathToFileURL(path.join(html,'design/examples/main/field.html')).href);
    check('정적 HTML은 JavaScript 없이 라벨·내용을 읽고 입력 가능',await staticPage.locator('label').textContent()==='컬렉션 이름');await staticPage.locator('input').fill('수정한 이름');await noJS.close();
    await page.unroute('http**');
    let ready=false;for(let i=0;i<80;i++){try{const response=await fetch('http://127.0.0.1:4184');if(response.ok){ready=true;break;}}catch{} await new Promise(r=>setTimeout(r,500));}
    assert.ok(ready,'Next.js 서버 기동');
    await page.goto('http://127.0.0.1:4184');await page.evaluate(()=>document.fonts.ready);
    await page.getByRole('tablist',{name:'많은 탭'}).waitFor();
    // Server HTML shows before React attaches its handlers; a press before that would submit the form natively.
    await page.waitForFunction(()=>{const form=document.querySelector('main form');return !!form&&Object.keys(form).some(key=>key.startsWith('__reactProps'));});const topAfterLoad=await page.evaluate(()=>scrollY);
    const example=page.locator('main').first();
    await example.getByRole('textbox',{name:'컬렉션 검색'}).fill('없는 결과');await example.getByRole('button',{name:'검색',exact:true}).click();
    check('설치한 React 예시의 빈 결과·복구',await example.locator('.ds-empty').isVisible());await example.getByRole('button',{name:'전체 보기',exact:true}).click();
    const custom=page.locator('body>section').first();
    check('같은 컴포넌트에 다른 제목·콘텐츠를 넣어 조합',await custom.locator('.ds-page-header h2').textContent()==='도서 목록');
    await custom.locator('.ds-card button').first().click();await custom.getByRole('button',{name:'컬렉션에 보관',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('output')?.textContent==='1');
    check('소비자 onSave 콜백이 실제 실행',await custom.getByRole('button',{name:'보관됨',exact:true}).getAttribute('aria-pressed')==='true');
    await custom.getByRole('button',{name:'목록으로',exact:true}).click();
    await page.waitForFunction(()=>document.activeElement?.closest('.ds-results'));
    check('React 상세 복귀 후 초점 보존',await custom.locator('.ds-card button').first().evaluate(n=>n===document.activeElement));
    await custom.locator('.ds-card button').nth(1).click();
    await custom.getByRole('button',{name:'컬렉션에 보관',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('body>section .ds-record-detail [role="status"]')?.textContent.includes('다시 시도'));
    check('React 저장 실패 시 완료로 표시하지 않고 재시도 가능',await custom.getByRole('button',{name:'컬렉션에 보관',exact:true}).isEnabled());
    await custom.getByRole('button',{name:'컬렉션에 보관',exact:true}).click();
    check('비동기 저장 중 중복 요청 방지',await custom.locator('.ds-record-detail [aria-busy="true"]').isDisabled());
    await custom.getByRole('button',{name:'목록으로',exact:true}).click();
    await custom.locator('.ds-card button').first().click();
    check('저장 중 다른 레코드로 이동해도 상태가 섞이지 않음',await custom.getByRole('button',{name:'보관됨',exact:true}).isEnabled()&&await custom.locator('.ds-record-detail [role="status"]').textContent()==='보관했어요.');
    await page.evaluate(()=>window.finishBookSave());
    await page.waitForFunction(()=>document.querySelector('output')?.textContent==='2');
    await custom.getByRole('button',{name:'목록으로',exact:true}).click();
    await custom.locator('.ds-card button').nth(1).click();
    check('이동 후에도 원래 레코드의 저장 결과 유지',await custom.getByRole('button',{name:'보관됨',exact:true}).getAttribute('aria-pressed')==='true');
    await custom.getByRole('button',{name:'목록으로',exact:true}).click();
    const first=page.getByRole('tablist',{name:'첫 번째 탭'}),second=page.getByRole('tablist',{name:'두 번째 탭'});
    await first.getByRole('tab').first().focus();await page.keyboard.press('End');
    check('React 탭 키보드와 여러 인스턴스 독립',await first.getByRole('tab').last().getAttribute('aria-selected')==='true'&&await second.getByRole('tab').first().getAttribute('aria-selected')==='true');
    const input=page.getByRole('textbox',{name:'배송 이름'});check('필드의 라벨·오류를 다른 폼에 재사용',await input.getAttribute('aria-invalid')==='true'&&!!await input.getAttribute('aria-describedby'));
    await page.getByRole('checkbox',{name:'동의하기'}).check();check('React native checkbox',await page.getByRole('checkbox',{name:'동의하기'}).isChecked());
    const secret=page.getByLabel('비밀번호',{exact:true});await page.getByRole('button',{name:'비밀번호 보기'}).click();
    check('React 비밀번호 보기는 이름으로 상태를 알리고 값은 그대로',await secret.getAttribute('type')==='text'&&await secret.inputValue()==='pattove8'&&await page.getByRole('button',{name:'비밀번호 숨기기'}).getAttribute('aria-pressed')===null);
    const all=page.getByRole('checkbox',{name:'모두 선택'});await page.getByRole('checkbox',{name:'댓글'}).check();
    check('React 전체 선택: 하나만 고르면 부모는 일부 선택',await all.evaluate(n=>n.indeterminate&&!n.checked));
    await all.click();check('React 전체 선택: 부모를 누르면 모두 켜짐',await page.getByRole('checkbox',{name:'새 팔로워'}).isChecked()&&await all.evaluate(n=>n.checked&&!n.indeterminate));
    check('React 개수 배지: 3은 읽고 0은 숫자를 숨김',await page.getByRole('img',{name:'새 알림 3개'}).count()===1&&await page.getByRole('img',{name:'새 알림 없음'}).locator('.ds-badge-count').count()===0);
    const row=page.getByRole('tablist',{name:'많은 탭'});
    check('React 옆으로 미는 탭: 처음부터 고른 탭이 보이고 페이지는 끌려가지 않음',topAfterLoad===0&&await row.evaluate(list=>{const l=list.getBoundingClientRect(),t=list.querySelector('[aria-selected="true"]').getBoundingClientRect();return list.scrollLeft>0&&t.left>=l.left-1&&t.right<=l.right+1;}));
    const icons=page.locator('#illustration-consumer img.ui-icon');
    check('설치한 React의 일러스트도 자체 포함 이미지로 표시됨',await icons.evaluateAll(async nodes=>{await Promise.all(nodes.map(node=>node.decode()));return nodes.length>=4&&nodes.every(node=>node.naturalWidth===192&&node.src.startsWith('data:image/webp;base64,'));}));
    await page.locator('#illustration-consumer').getByRole('button',{name:'하나 더하기'}).click();
    check('일러스트 버튼으로 React 수량 증가',await page.locator('#illustration-consumer input[type="number"]').inputValue()==='2');
    await page.locator('#illustration-consumer').getByRole('button',{name:'하나 빼기'}).click();
    check('일러스트 버튼으로 React 수량 감소',await page.locator('#illustration-consumer input[type="number"]').inputValue()==='1');
    await page.locator('#illustration-consumer').getByRole('button',{name:'검색어 지우기'}).click();
    check('일러스트 버튼으로 React 입력 초기화',await page.locator('#illustration-consumer .ds-clear-input input').inputValue()==='');
    check('UI 37종 밖의 일러스트 팩도 Next.js에서 import하고 표시됨',await page.getByRole('img',{name:'정원 일러스트'}).evaluate(async node=>{await node.decode();return node.naturalWidth===512;}));
    check('조합 후 중복 ID 없음',await page.locator('[id]').evaluateAll(nodes=>new Set(nodes.map(n=>n.id)).size===nodes.length));
    await page.screenshot({path:path.join(out,'next-react.png'),fullPage:true});
    for(const width of [320,375,768,1440]) { await page.setViewportSize({width,height:900});check(`Next.js ${width}px 가로 넘침 없음`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)); }
    check('React·HTML 실행 중 예외 없음',errors.length===0);
  } finally {await browser.close();server.kill();write(path.join(out,'next.log'),logs.join(''));write(path.join(out,'results.json'),JSON.stringify({checks,errors},null,2));}
  console.log(`Source consumers: ${checks.length} checks passed.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
