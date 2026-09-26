const {chromium}=require('playwright-core');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..'),out=path.join(root,'test-results/library');
fs.mkdirSync(out,{recursive:true});
const env={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'src/data/library.js'),'utf8'),env);
const data=env.window.Pattove.library;
const sourceIDs=fs.readdirSync(path.join(root,'문서/사전')).filter(f=>f.endsWith('.md')).flatMap(f=>[...fs.readFileSync(path.join(root,'문서/사전',f),'utf8').matchAll(/^\|\s*([A-Z]+-\d+)\s*\|/gm)].map(m=>m[1]));
const checks=[],errors=[];
const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
check('사전 원본의 모든 ID를 누락·중복 없이 연결',sourceIDs.length===data.entries.length&&new Set(sourceIDs).size===new Set(data.entries.map(e=>e.id)).size&&sourceIDs.every(id=>data.entries.some(e=>e.id===id)));
check('8개 계층 모두 실제 구성요소를 가짐',data.layers.length===8&&data.layers.every(l=>data.components.some(c=>c.layer===l.id)));
check('74개 사전 분류가 메뉴 그룹에 한 번씩 연결',data.categories.length===74&&data.groups.flatMap(g=>g.codes).length===74&&new Set(data.groups.flatMap(g=>g.codes)).size===74);
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();page.setDefaultTimeout(6000);
 page.on('pageerror',e=>errors.push(e.message));
 const origin='http://127.0.0.1:4173/';
 const goto=async route=>{await page.goto(origin+'#/'+route);};
 const close=async()=>{await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog').open);};
 const shot=async name=>{await page.mouse.move(0,0);await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(out,name+'.png')});};
 try{
  await goto('styles');
  check('상단 주 메뉴 네 개',await page.locator('#primary-nav a').count()===4);
  await shot('01-styles');
  await page.locator('#primary-nav a[href="#/components"]').click();
  check('구성요소 8개 계층 입구',await page.locator('.category-tile').count()===8);
  await shot('02-components');
  for(const layer of data.layers){
   await page.locator('#sidebar a[href="#/components?category='+layer.id+'"]').click();
   check(layer.english+' 메뉴에 실제 항목 표시',await page.locator('.entry-tile').count()===Math.min(48,layer.count));
   await page.locator('.entry-tile').first().click();
   check(layer.english+' 상세에 대표 항목 표시',await page.locator('.record-detail section p').count()===1);
   await close();
  }
  await page.locator('#primary-nav a[href="#/dictionary"]').click();
  check('사전 74개 분류 입구',await page.locator('.category-tile').count()===74);
  await shot('03-dictionary');
  for(const category of data.categories){
   await goto('dictionary?category='+category.id);
   const rows=data.entries.filter(e=>e.category===category.id);
   check(category.id+' 메뉴·항목 수 일치',await page.locator('.entry-tile').count()===Math.min(48,rows.length));
   check(category.id+' 현재 분류 메뉴 열림',await page.locator('#sidebar a[aria-current="page"]').isVisible());
  }
  await goto('dictionary?category=ICO');
  await page.locator('[data-action="load-more"]').click();
  check('대량 분류 더 보기 48개씩',await page.locator('.entry-tile').count()===96);
  check('더 보기 뒤 새 항목으로 초점',await page.locator('.entry-tile').nth(48).evaluate(e=>e===document.activeElement));
  await page.reload();
  check('표시한 범위 새로고침 유지',await page.locator('.entry-tile').count()===96);
  await page.locator('#query').fill('TOK-01');
  check('ID 검색 제안',await page.locator('.search-suggestion').count()===1);
  await page.locator('#query').press('ArrowDown');await page.locator('#query').press('Enter');
  check('검색 제안이 실제 사전 원문 역할과 일치',(await page.locator('.record-detail section p').first().textContent())===data.entries.find(e=>e.id==='TOK-01').usage);
  await shot('04-entry');
  await close();
  check('사전 상세 닫기 후 검색 초점',await page.locator('#query').evaluate(e=>e===document.activeElement));
  await page.locator('#query').fill('색');await page.locator('#query').press('Enter');
  check('사전 전체 검색',await page.locator('.entry-tile').count()>0);
  await shot('05-search');
  await goto('dictionary?category=NAV');
  await page.locator('[data-library-entry="NAV-06"]').click();
  await page.locator('#detail-dialog a').click();
  await page.locator('.document-body').waitFor();
  check('사전 상세에서 분류 원문 연결',(await page.locator('.document-body').textContent()).includes('NAV-06'));
  await page.locator('.document-body a[href*="doc=guide"]').first().click();
  await page.locator('.document-body').waitFor();
  check('문서의 내부 링크가 사이트 안에서 연결',page.url().includes('doc=guide'));
  await page.goBack();await page.locator('.document-body').waitFor();
  check('문서 간 뒤로 가기',page.url().includes('doc=NAV'));
  for(const id of data.coreDocuments){
   await goto('docs?doc='+id);await page.locator('.document-body').waitFor();
   check(id+' 문서 본문 로드',await page.locator('.document-body').innerText().then(t=>t.length>100));
  }
  await goto('docs?doc=definition');await page.locator('.document-body').waitFor();await shot('06-docs');
  await page.locator('.document-toc summary').click();
  await page.locator('.document-toc a').nth(1).click();
  const section=new URL(page.url()).hash.split('section=')[1];
  await page.waitForFunction(()=>document.activeElement.id.startsWith('doc-'));
  check('문서 목차에서 제목으로 초점 이동',decodeURIComponent(section)===await page.evaluate(()=>document.activeElement.id));
  for(const width of [320,375,760,768,1440]){
   await page.setViewportSize({width,height:1000});
   for(const route of ['components','components?category=module','dictionary','dictionary?category=CLI','docs?doc=definition']){
    await goto(route);if(route.startsWith('docs'))await page.locator('.document-body').waitFor();
    check(width+' '+route+' 페이지 넘침 없음',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    if(width===375)await shot('mobile-'+route.split('?')[0]+(route.includes('category')?'-items':''));
   }
   if(width<=760){
    await goto('dictionary');
    await page.locator('[data-library-category]').selectOption('TOK');
    check(width+' 모바일 전체 분류 선택',await page.locator('.library-heading h2').textContent()===data.categories.find(c=>c.id==='TOK').name);
    await goto('docs');await page.locator('.document-body').waitFor();
    await page.locator('[data-document-select]').selectOption('guide');await page.locator('.document-body').waitFor();
    check(width+' 모바일 문서 전환',page.url().includes('doc=guide'));
   }
  }
  const filePage=await context.newPage();
  await filePage.goto(pathToFileURL(path.join(root,'index.html')).href+'#/docs?doc=definition');
  await filePage.locator('.document-body').waitFor();
  check('파일 실행에서도 문서 본문 열림',await filePage.locator('.document-body').isVisible());
  await filePage.close();
  // Load every generated document without navigating away to catch broken chunks.
  await goto('docs?doc=definition');await page.locator('.document-body').waitFor();
  const allLoaded=await page.evaluate(async()=>{for(const doc of window.Pattove.library.documents)await window.Pattove.libraryUI.loadDocument(doc.id);return Object.keys(window.Pattove.documentPages).length;});
  check('모든 문서 청크 로드',allLoaded===data.documents.length);
  const failed=await browser.newContext();
  let abort=true;
  await failed.route('**/src/data/documents/definition.js',r=>{if(abort){abort=false;return r.abort();}return r.continue();});
  const failedPage=await failed.newPage();
  await failedPage.goto(origin+'#/docs?doc=definition');
  await failedPage.locator('[data-action="retry-document"]').waitFor();
  await failedPage.locator('[data-action="retry-document"]').click();await failedPage.locator('.document-body').waitFor();
  check('문서 로드 실패 후 재시도',await failedPage.locator('.document-body').isVisible());
  await failed.close();
  check('브라우저 오류 없음',errors.length===0);
  fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({checks,errors},null,2));
  console.log(checks.length+' library checks passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

