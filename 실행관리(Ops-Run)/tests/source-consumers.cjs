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
  const html = path.join(fixture,'html'), react = path.join(fixture,'react'), svg = path.join(fixture,'svg');
  install(['pattove-main-page-html','pattove-main-tabs-html','pattove-main-field-html'],html);
  install(['pattove-main-page-react','pattove-main-tabs-react','pattove-main-checkbox-react'],react);
  install(['pattove-icon-search-html'],svg);
  check('SVG 하나에는 폰트·프레임워크·다른 아이콘이 설치되지 않음',fs.readdirSync(path.join(svg,'design')).join(',')==='icons' && fs.readdirSync(path.join(svg,'design/icons')).join(',')==='search.svg');
  check('HTML과 React 소비자가 별도 components.json 없이 설치됨',!fs.existsSync(path.join(html,'components.json'))&&!fs.existsSync(path.join(react,'components.json')));
  const reactFiles = fs.readdirSync(path.join(react,'design/react'));
  check('React 페이지 설치 시 실제 하위 컴포넌트 소스 포함', ['page.jsx','search-module.jsx','field.jsx','input.jsx','button.jsx','card.jsx'].every(file=>reactFiles.includes(file)));
  const demo = `'use client';
import React,{useState} from 'react';
import Example from '../design/examples/main/page.jsx';
import { CollectionPage } from '../design/react/page.jsx';
import { Tabs } from '../design/react/tabs.jsx';
import { Checkbox } from '../design/react/checkbox.jsx';
import { Field } from '../design/react/field.jsx';
import { Button } from '../design/react/button.jsx';
import '../design/css/tabs.css';import '../design/css/selection.css';
export default function Page(){const [saved,setSaved]=useState(0);return <><Example/><section className="ds" data-style="main" style={{padding:32}}><h2>다른 콘텐츠로 재사용</h2><CollectionPage title="도서 목록" records={[{id:'book-1',title:'긴 한글 제목이 들어가는 책과 오래도록 기억하고 싶은 문장들',description:'디자인과 편집',tag:'진행 중'},{id:'book-2',title:'그림으로 설명하기',description:'시각 언어',tag:'완료'}]} onSave={async(record)=>{if(record.id==='book-2'){if(!window.bookSaveAttempt){window.bookSaveAttempt=1;throw Error('저장 실패');}await new Promise(resolve=>{window.finishBookSave=resolve;});}setSaved(n=>n+1);}}/><output aria-label="저장 횟수">{saved}</output><Tabs label="첫 번째 탭"/><Tabs label="두 번째 탭"/><form aria-label="다른 폼"><Field label="배송 이름" error="이름을 다시 확인해 주세요."/><Checkbox name="consent">동의하기</Checkbox><Button type="submit">신청하기</Button></form></section></>;}
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
    await page.goto(pathToFileURL(path.join(html,'design/examples/main/page.html')).href);
    await page.evaluate(()=>document.fonts.ready);
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
    const example=page.locator('main').first();
    await example.getByRole('textbox',{name:'컬렉션 검색'}).fill('없는 결과');await example.getByRole('button',{name:'검색',exact:true}).click();
    check('설치한 React 예시의 빈 결과·복구',await example.locator('.ds-empty').isVisible());await example.getByRole('button',{name:'전체 보기',exact:true}).click();
    const custom=page.locator('body>section');
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
    check('조합 후 중복 ID 없음',await page.locator('[id]').evaluateAll(nodes=>new Set(nodes.map(n=>n.id)).size===nodes.length));
    await page.screenshot({path:path.join(out,'next-react.png'),fullPage:true});
    for(const width of [320,375,768,1440]) { await page.setViewportSize({width,height:900});check(`Next.js ${width}px 가로 넘침 없음`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)); }
    check('React·HTML 실행 중 예외 없음',errors.length===0);
  } finally {await browser.close();server.kill();write(path.join(out,'next.log'),logs.join(''));write(path.join(out,'results.json'),JSON.stringify({checks,errors},null,2));}
  console.log(`Source consumers: ${checks.length} checks passed.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
