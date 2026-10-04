const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { execFileSync, spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const { chromium, firefox, webkit } = require('playwright-core');
const root = path.resolve(__dirname, '..'), out = path.join(root, 'test-results/admin');
fs.mkdirSync(out, { recursive: true });
const checks = [], errors = [];
const check = (name, value) => { assert.ok(value, name); checks.push(name); };
const write = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value); };
const cli = path.join(root, 'node_modules/shadcn/dist/index.js');
function install(name, target) {
  fs.mkdirSync(target, { recursive: true });
  try { execFileSync(process.execPath, [cli, 'add', `http://127.0.0.1:4173/src/registry/r/pattove-main-${name}.json`, '--cwd', target, '--yes', '--overwrite'], { cwd: root, stdio: 'pipe', timeout: 120000 }); }
  catch (error) { throw Error(String(error.stdout) + '\n' + String(error.stderr)); }
}
async function flow(page, scope, label) {
  const query = scope.getByRole('searchbox', { name: '자료 검색' });
  await query.fill('없는 결과');
  await scope.getByText('조건에 맞는 자료가 없습니다.').waitFor();
  await scope.getByRole('button', { name: '전체 보기', exact: true }).click();
  check(label + ' 빈 결과 복구', await scope.locator('tbody tr').count() === 5);
  await scope.getByRole('button', { name: '다음', exact: true }).click();
  check(label + ' 페이지 이동', await scope.locator('tbody tr').count() === 1);
  await scope.getByRole('button', { name: '이전', exact: true }).click();
  await scope.getByRole('columnheader').nth(1).getByRole('button').click();
  await scope.getByRole('combobox', { name: '상태', exact: true }).selectOption('draft');
  const all = scope.getByRole('checkbox', { name: '현재 쪽 모두 선택' });
  await all.check();
  check(label + ' 현재 쪽 선택', await scope.getByText('3개 선택', { exact: true }).isVisible());
  await all.uncheck();
  const edit = scope.locator('[data-record-edit="icons"]');
  await edit.click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: '제목', exact: true }).fill('   ');
  await dialog.getByRole('button', { name: '저장', exact: true }).click();
  check(label + ' 필수 입력 검증', await dialog.locator('[name="title"]').getAttribute('aria-invalid') === 'true');
  await dialog.locator('[name="title"]').fill('아이콘 수정');
  await dialog.getByRole('button', { name: '저장', exact: true }).click();
  await dialog.getByRole('alert').filter({ hasText: '연결 실패' }).waitFor();
  check(label + ' 실패 시 입력 유지', await dialog.locator('[name="title"]').inputValue() === '아이콘 수정');
  await dialog.getByRole('button', { name: '다시 저장', exact: true }).click();
  await page.waitForFunction(() => typeof window.finishAdminSave === 'function');
  check(label + ' 비동기 저장 잠금', await dialog.getByRole('button', { name: '저장 중', exact: true }).isDisabled());
  await page.keyboard.press('Escape');
  check(label + ' 저장 중 닫기 차단', await dialog.isVisible());
  await dialog.locator('form').evaluate(form => { form.requestSubmit(); form.requestSubmit(); });
  check(label + ' 중복 요청 차단', await page.evaluate(() => window.adminAttempts === 2));
  await page.evaluate(() => window.finishAdminSave());
  await dialog.waitFor({ state: 'hidden' });
  await scope.getByRole('button', { name: '아이콘 수정', exact: true }).waitFor();
  check(label + ' 저장 후 정렬과 필터 유지', await scope.getByRole('combobox', { name: '상태', exact: true }).inputValue() === 'draft' && await scope.getByRole('columnheader').nth(1).getAttribute('aria-sort') === 'ascending');
  await page.waitForFunction(() => document.activeElement?.dataset.recordEdit === 'icons');
  check(label + ' 저장 후 초점 복귀', await scope.locator('[data-record-edit="icons"]').evaluate(n => n === document.activeElement));
  await scope.locator('[data-record-edit="icons"]').click();
  await dialog.locator('[name="title"]').fill('버릴 변경');
  await page.keyboard.press('Escape');
  check(label + ' 변경을 버리기 전 확인', await dialog.getByRole('button', { name: '변경 버리고 닫기' }).isVisible());
  await page.keyboard.press('Escape');
  check(label + ' Escape 반복으로 입력을 버리지 않음', await dialog.isVisible());
  await dialog.getByRole('button', { name: '변경 버리고 닫기' }).click();
  check(label + ' 취소 시 기존 값 유지', await scope.getByRole('button', { name: '아이콘 수정', exact: true }).isVisible());
  await query.fill('아이콘');
  await scope.locator('[data-record-edit="icons"]').click();
  await dialog.locator('[name="title"]').fill('검색에서 빠진 제목');
  await dialog.getByRole('button', { name: '저장', exact: true }).click();
  await dialog.waitFor({ state: 'hidden' });
  await page.waitForFunction(() => document.activeElement?.type === 'search');
  check(label + ' 저장 후 필터에서 사라져도 초점 복구', await query.evaluate(n => n === document.activeElement));
  await scope.getByRole('button', { name: '전체 보기', exact: true }).click();
}
(async () => {
  const { registryItemSchema } = await import('shadcn/schema');
  for (const id of ['data-table','record-editor','admin-shell','admin-page']) for (const env of ['html','react']) {
    const item = JSON.parse(fs.readFileSync(path.join(root, `src/registry/r/pattove-main-${id}-${env}.json`)));
    registryItemSchema.parse(item);
    check(`${id}/${env} 공식 스키마·중복 경로`, new Set(item.files.map(f => f.target)).size === item.files.length);
    if (id === 'admin-page') check(`${env} MIT 출처와 라이선스 포함`, item.files.some(f => f.path.endsWith('licenses/shadcn-admin.txt')) && item.files.some(f => f.path.endsWith('provenance/shadcn-admin.json')));
  }
  const fixture = fs.mkdtempSync(path.join(out, 'run-')), html = path.join(fixture,'html'), react = path.join(fixture,'react');
  install('admin-page-html', html);
  write(path.join(react, 'package.json'), JSON.stringify({ name: 'pattove-admin-consumer', private: true, dependencies: { '@tanstack/react-table':'8.21.3' } }));
  install('admin-page-react', react);
  check('React 설치에 툴바·페이지 탐색 소스 포함', ['table-toolbar.jsx','table-pagination.jsx'].every(f => fs.existsSync(path.join(react,'design/react',f))));
  write(path.join(react,'app/layout.jsx'), `import React from 'react';export default function Layout({children}){return <html lang="ko"><body style={{margin:0}}>{children}</body></html>}`);
  write(path.join(react,'next.config.mjs'), `export default {devIndicators:false,allowedDevOrigins:['127.0.0.1']};`);
  write(path.join(react,'app/page.jsx'), `'use client';
import React,{useState,useEffect} from 'react';import Example from '../design/examples/main/admin-page.jsx';import {AdminPage} from '../design/react/admin-page.jsx';import {RecordEditorDemo} from '../design/react/record-editor.jsx';import {DataTable,exampleRecords} from '../design/react/data-table.jsx';
async function save(record){window.adminAttempts=(window.adminAttempts||0)+1;if(window.adminAttempts===1)throw Error('연결 실패');if(window.adminAttempts===2)await new Promise(resolve=>window.finishAdminSave=resolve);return record;}
const loadA=({signal})=>new Promise((resolve,reject)=>{window.loadA={resolve,reject,signal};});
const loadB=({signal})=>new Promise((resolve,reject)=>{window.loadB={resolve,reject,signal};});
function Remote(){const [loader,setLoader]=useState(()=>loadA);useEffect(()=>{window.switchLoader=()=>setLoader(()=>loadB);},[]);return <AdminPage title="서버 자료" initialRecords={[]} loadRecords={loader}/>;}
function Standalone(){const [records,setRecords]=useState(exampleRecords),[selected,setSelected]=useState([]);useEffect(()=>{window.replaceReactRecords=setRecords;},[]);return <><DataTable records={records} onEdit={()=>{}} onSelectionChange={setSelected}/><output aria-label="독립 선택">{selected.map(r=>r.id).join(',')}</output></>;}
export default function Page(){return <main className="ds" data-style="main" style={{padding:16}}><section id="primary"><AdminPage onSave={save}/></section><section id="requests"><AdminPage title="고객 요청" titleLabel="요청" ownerLabel="담당팀" initialRecords={[{id:'ticket-1',title:'배송 문의',owner:'지원팀',status:'open'}]} statuses={[{value:'open',label:'접수'},{value:'closed',label:'해결'}]}/></section><section id="products"><AdminPage title="상품 관리" titleLabel="상품명" ownerLabel="판매자" initialRecords={[{id:'sku-1',title:'아주 긴 한글 상품 이름과 옵션 — 유기농 원두 500g / 정기 배송',owner:'봄 상점',status:'sold'}]} statuses={[{value:'sale',label:'판매'},{value:'sold',label:'품절'}]}/></section><RecordEditorDemo/><section id="remote"><Remote/></section><section id="standalone"><Standalone/></section><section hidden><Example/></section></main>}
`);
  const server = spawn(process.execPath, [path.join(root,'node_modules/next/dist/bin/next'),'dev','--webpack','--hostname','127.0.0.1','--port','4186'], { cwd:react, stdio:['ignore','pipe','pipe'] });
  let logs='';server.stdout.on('data',b=>logs+=b);server.stderr.on('data',b=>logs+=b);
  try {
    for (const [name, engine] of Object.entries({chromium,firefox,webkit})) {
      const browser = await engine.launch({headless:true});
      try {
        const page = await browser.newPage({ viewport:{width:1280,height:900} });
        page.setDefaultTimeout(10000);page.on('pageerror', e => errors.push(`${name}: ${e.message}`));
        await page.route('http**', route => route.abort());
        await page.goto(pathToFileURL(path.join(html,'design/examples/main/admin-page.html')).href);
        await page.evaluate(() => { Pattove.admin.connect(document.querySelector('[data-admin-page]'), {onSave:async record => { window.adminAttempts=(window.adminAttempts||0)+1;if(window.adminAttempts===1)throw Error('연결 실패');if(window.adminAttempts===2)await new Promise(resolve=>window.finishAdminSave=resolve);return record; }}); });
        await flow(page,page.locator('[data-admin-page]'),name+' HTML');
        for (const width of [320,375,768,1440]) { await page.setViewportSize({width,height:900});check(`${name} HTML ${width}px 문서 넘침 없음`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)); }
        await page.screenshot({path:path.join(out,`${name}-html.png`),fullPage:true});
        await page.goto(pathToFileURL(path.join(root,'src/registry/examples/admin-page.html')).href);
        check(`${name} 단독 HTML 오프라인 작동`,await page.locator('tbody tr').count()===5);
        // Different data and status vocabularies use the same runtime and layout.
        await page.evaluate(() => {const main=document.querySelector('main');main.innerHTML=Pattove.admin.renderPage('requests',{title:'고객 요청',titleLabel:'요청',statuses:[{value:'open',label:'접수'}],records:[{id:'r1',title:'배송 문의',status:'open',owner:'지원팀'}]})+Pattove.admin.renderPage('products',{title:'상품 관리',titleLabel:'상품명',statuses:[{value:'sold',label:'품절'}],records:[{id:'s1',title:'원두 정기 배송',status:'sold',owner:'봄 상점'}]});Pattove.admin.mount(main);});
        await page.getByRole('button',{name:'배송 문의',exact:true}).click();await page.getByRole('dialog').getByRole('textbox',{name:'요청',exact:true}).fill('배송 문의 수정');await page.getByRole('dialog').getByRole('button',{name:'저장',exact:true}).click();
        check(`${name} HTML 두 소비 데이터 독립`,await page.getByRole('button',{name:'배송 문의 수정',exact:true}).isVisible()&&await page.getByRole('button',{name:'원두 정기 배송',exact:true}).isVisible());
        // Replacing a record cannot silently overwrite an open editor or resurrect a removed selection.
        await page.evaluate(() => { const host=document.querySelector('[data-admin-page]');window.tableHost=host;window.controller=Pattove.admin.connect(host,{onSelectionChange:rows=>window.selection=rows}); });
        await page.locator('[data-admin-page]').first().getByRole('checkbox',{name:'배송 문의 수정 선택',exact:true}).check();
        await page.evaluate(() => controller.replaceRecords([]));
        check(`${name} HTML 자료 제거 시 선택 통지`,await page.evaluate(()=>selection.length===0));
        await page.evaluate(() => controller.replaceRecords([{id:'r1',title:'다시 추가',status:'open'}]));
        check(`${name} HTML 제거 후 재등장한 자료는 미선택`,!await page.getByRole('checkbox',{name:'다시 추가 선택',exact:true}).isChecked());
        await page.getByRole('button',{name:'다시 추가',exact:true}).click();
        check(`${name} 편집 중 자료 교체 차단`,await page.evaluate(()=>{try{controller.replaceRecords([]);return false;}catch{return true;}}));
        await page.getByRole('dialog').getByRole('button',{name:'취소',exact:true}).click();
        await page.evaluate(() => controller.connect({loadRecords:({signal})=>new Promise((resolve,reject)=>{(window.loads||=[]).push({resolve,reject,signal});})}));
        check(`${name} HTML 로딩 중 오래된 목록 숨김`,await page.locator('[data-admin-page]').first().getByText('자료를 불러오는 중입니다.',{exact:true}).isVisible()&&!await page.getByRole('button',{name:'다시 추가',exact:true}).isVisible());
        await page.evaluate(()=>{controller.reload(); loads[1].resolve([{id:'r-new',title:'최신 목록',status:'open'}]);});
        await page.getByRole('button',{name:'최신 목록',exact:true}).waitFor();
        await page.evaluate(()=>loads[0].resolve([{id:'r-old',title:'늦은 응답',status:'open'}]));
        check(`${name} HTML 늦은 응답 폐기와 취소 신호`,await page.evaluate(()=>loads[0].signal.aborted)&&await page.getByRole('button',{name:'최신 목록',exact:true}).isVisible()&&await page.getByRole('button',{name:'늦은 응답',exact:true}).count()===0);
        await page.locator('[data-admin-page]').first().getByRole('button',{name:'새로고침',exact:true}).click();
        await page.evaluate(()=>loads[2].reject(Error('목록 연결 실패')));
        await page.getByRole('alert').filter({hasText:'목록 연결 실패'}).waitFor();
        await page.locator('[data-admin-page]').first().getByRole('button',{name:'다시 불러오기',exact:true}).click();
        await page.evaluate(()=>loads[3].resolve([{id:'bad',title:'중복',status:'open'},{id:'bad',title:'중복',status:'open'}]));
        await page.getByRole('alert').filter({hasText:'고유 ID'}).waitFor();
        check(`${name} HTML 중복 ID 응답 거부`,await page.locator('[data-admin-page]').first().getByRole('button',{name:'다시 불러오기'}).isVisible());
        await page.locator('[data-admin-page]').first().getByRole('button',{name:'다시 불러오기',exact:true}).click();
        await page.evaluate(()=>loads[4].resolve([{id:'fixed',title:'복구된 목록',status:'open'}]));
        await page.getByRole('button',{name:'복구된 목록',exact:true}).waitFor();
        check(`${name} HTML 읽기 실패 후 재시도`,await page.locator('[data-admin-page]').first().getByRole('searchbox').evaluate(n=>n===document.activeElement));
        if(name==='chromium') {
          const noJS=await browser.newContext({javaScriptEnabled:false}), staticPage=await noJS.newPage();await staticPage.goto(pathToFileURL(path.join(root,'src/registry/examples/admin-page.html')).href);check('JavaScript 없이도 6개 자료 읽기',await staticPage.locator('tbody tr').count()===6);await noJS.close();
          await page.goto(pathToFileURL(path.join(root,'src/registry/examples/record-editor.html')).href);await page.getByRole('button',{name:'편집 열기'}).click();check('편집기 단독 배포에서 열기',await page.getByRole('dialog').isVisible());
          await page.getByRole('dialog').getByRole('textbox',{name:'제목',exact:true}).fill('단독 저장한 내용');await page.getByRole('dialog').getByRole('button',{name:'저장',exact:true}).click();await page.getByRole('button',{name:'편집 열기'}).click();
          check('HTML 편집기를 다시 열어도 저장값 유지',await page.getByRole('dialog').getByRole('textbox',{name:'제목',exact:true}).inputValue()==='단독 저장한 내용');
          await page.getByRole('dialog').getByRole('button',{name:'취소',exact:true}).click();
          await page.evaluate(()=>{const host=document.querySelector('main');host.innerHTML='<button id="opener">직접 편집</button>'+Pattove.admin.renderEditor('custom');window.editor=Pattove.admin.connectEditor(host,{statuses:[{value:'open',label:'접수'}],titleLabel:'요청',onSave:()=>null});editor.open({id:'custom',title:'개별 자료',status:'open'},document.querySelector('#opener'));});
          await page.getByRole('dialog').getByRole('button',{name:'저장',exact:true}).click();await page.getByRole('alert').filter({hasText:'저장 응답'}).waitFor();
          check('HTML 단독 편집기의 잘못된 저장 응답 거부',await page.getByRole('dialog').isVisible());
          await page.evaluate(()=>editor.connect({onSave:record=>record}));await page.getByRole('dialog').getByRole('button',{name:'다시 저장',exact:true}).click();
          check('HTML 단독 편집기의 저장·초점 복귀',await page.getByRole('button',{name:'직접 편집'}).evaluate(n=>n===document.activeElement));
          await page.unroute('http**');
          let ready=false;for(let i=0;i<80;i++){try{if((await fetch('http://127.0.0.1:4186')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,500));}assert.ok(ready,'Next.js 기동: '+logs);
          await page.goto('http://127.0.0.1:4186');await page.waitForFunction(()=>{const n=document.querySelector('#primary input');return n&&Object.keys(n).some(k=>k.startsWith('__reactProps'));});
          await flow(page,page.locator('#primary'),'React');
          await page.getByRole('button',{name:'배송 문의',exact:true}).click();await page.getByRole('dialog').getByRole('textbox',{name:'요청',exact:true}).fill('배송 문의 수정');await page.getByRole('dialog').getByRole('button',{name:'저장',exact:true}).click();
          check('React 다른 데이터·상태·인스턴스 독립',await page.locator('#requests').getByRole('button',{name:'배송 문의 수정',exact:true}).isVisible()&&await page.locator('#products').getByRole('cell',{name:'품절',exact:true}).isVisible());
          check('React 복수 인스턴스 ID 중복 없음',await page.locator('[id]').evaluateAll(nodes=>new Set(nodes.map(n=>n.id)).size===nodes.length));
          const remote=page.locator('#remote');
          check('React 자료 읽기 중 표시',await remote.getByText('자료를 불러오는 중입니다.',{exact:true}).isVisible());
          await page.evaluate(()=>loadA.reject(Error('목록 연결 실패')));
          await remote.getByRole('alert').filter({hasText:'목록 연결 실패'}).waitFor();await remote.getByRole('button',{name:'다시 불러오기'}).click();
          await page.evaluate(()=>{window.oldLoad=loadA;switchLoader();});await page.waitForFunction(()=>!!window.loadB);
          await page.evaluate(()=>loadB.resolve([{id:'latest',title:'서버의 최신 자료',status:'draft'}]));await remote.getByRole('button',{name:'서버의 최신 자료',exact:true}).waitFor();
          await page.evaluate(()=>oldLoad.resolve([{id:'stale',title:'늦은 응답',status:'draft'}]));
          check('React 늦은 응답 폐기와 취소 신호',await page.evaluate(()=>oldLoad.signal.aborted)&&await remote.getByRole('button',{name:'늦은 응답',exact:true}).count()===0);
          await remote.getByRole('button',{name:'새로고침',exact:true}).click();await page.evaluate(()=>loadB.resolve([{id:'x',title:'중복',status:'draft'},{id:'x',title:'중복',status:'draft'}]));await remote.getByRole('alert').filter({hasText:'고유 ID'}).waitFor();
          check('React 중복 ID 응답 거부',await remote.getByRole('button',{name:'다시 불러오기'}).isVisible());
          await remote.getByRole('button',{name:'다시 불러오기'}).click();await page.evaluate(()=>loadB.resolve([]));await remote.getByText('조건에 맞는 자료가 없습니다.').waitFor();
          const independent=page.locator('#standalone'), selected=independent.getByRole('checkbox',{name:'아이콘 사용 원칙 선택',exact:true});
          await selected.check();await independent.getByRole('status').filter({hasText:'1개 선택'}).waitFor();
          check('React 부모 콜백 재렌더 후 체크박스 초점 유지',await selected.evaluate(n=>n===document.activeElement));
          await page.evaluate(()=>replaceReactRecords([]));await independent.getByRole('status').filter({hasText:'0개 선택'}).waitFor();await page.evaluate(()=>replaceReactRecords([{id:'icons',title:'다시 나타난 아이콘',status:'draft'}]));
          check('React 제거 후 재등장한 자료는 미선택',!await independent.getByRole('checkbox',{name:'다시 나타난 아이콘 선택',exact:true}).isChecked());
          await page.screenshot({path:path.join(out,'react-desktop.png'),fullPage:true});
          for(const width of [320,375,768,1440]){await page.setViewportSize({width,height:900});check(`React ${width}px 문서 넘침 없음`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
          await page.setViewportSize({width:375,height:900});await page.screenshot({path:path.join(out,'react-mobile.png'),fullPage:true});
          await page.locator('#products [data-record-edit]').click();await page.screenshot({path:path.join(out,'react-editor-mobile.png')});
          await page.goto('http://127.0.0.1:4173/#/system?detail=admin-page');await page.locator('.component-page[data-component="admin-page"]').waitFor();check('상세 화면에는 설치·다운로드·사용 조건 칸이 없음',await page.locator('.component-install, main a[download]').count()===0&&!(await page.locator('main').innerText()).toLowerCase().includes('shadcn'));
        }
      } finally { await browser.close(); }
    }
    check('브라우저 실행 예외 없음',errors.length===0);
  } finally {server.kill();write(path.join(out,'next.log'),logs);write(path.join(out,'results.json'),JSON.stringify({checks,errors},null,2));}
  console.log(`Admin consumers: ${checks.length} checks passed.`);
})().catch(error => {console.error(error);process.exitCode=1;});
