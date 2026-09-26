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
check('81개 사전 분류가 메뉴 그룹에 한 번씩 연결',data.categories.length===data.groups.flatMap(g=>g.codes).length&&new Set(data.groups.flatMap(g=>g.codes)).size===data.categories.length);
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
  check('레일은 대분류 8개와 부품·스타일',await page.locator('#primary-nav a').count()===data.groups.length+2);
  await shot('01-styles');
  await goto('components');
  check('구성요소 8개 계층 입구',await page.locator('.category-tile').count()===8);
  await shot('02-components');
  for(const layer of data.layers){
   await page.locator('#sidebar a[href="#/components?category='+layer.id+'"]').click();
   check(layer.english+' 메뉴에 실제 항목 표시',await page.locator('.entry-tile').count()===Math.min(48,layer.count));
   await page.locator('.entry-tile').first().click();
   check(layer.english+' 상세에 대표 항목 표시',await page.locator('.record-detail section p').count()===1);
   await close();
  }
  await page.locator('.brand').click();
  check('사전 첫 화면은 대분류 그림 입구와 부품 입구, 대분류 레일',await page.locator('.dict-group').count()===data.groups.length+1&&await page.locator('[data-focus^="rail-"]:not([data-focus="rail-parts"])').count()===data.groups.length);
  await shot('03-dictionary');
  for(const category of data.categories){
   await goto('dictionary?category='+category.id);
   const rows=data.entries.filter(e=>e.category===category.id);
   check(category.id+' 메뉴·항목 수 일치',await page.locator('.dict-entry:not(.is-built)').count()===Math.min(48,await page.evaluate(code=>Pattove.libraryUI.currentItems({page:'dictionary',category:code,query:''}).filter(e=>!e.implementation).length,category.id)));
   check(category.id+' 현재 분류 메뉴 열림',await page.locator('#sidebar a[aria-current="page"]').isVisible());
  }
  await goto('dictionary?category=ICO');
  await page.locator('[data-action="load-more"]').click();
  check('대량 분류 더 보기 48개씩',await page.locator('.dict-entry:not(.is-built)').count()===96);
  check('더 보기 뒤 새 항목으로 초점',await page.locator('.dict-entry:not(.is-built)').nth(48).evaluate(e=>e===document.activeElement));
  await page.reload();
  check('표시한 범위 새로고침 유지',await page.locator('.dict-entry:not(.is-built)').count()===96);
  await page.locator('#query').fill('TOK-01');
  check('ID 검색 제안',await page.locator('.search-suggestion').count()===1);
  await page.locator('#query').press('ArrowDown');await page.locator('#query').press('Enter');
  check('구현된 사전 항목의 검색 제안은 실제 부품 상세로 연결',await page.locator('#detail-title').textContent()===await page.evaluate(()=>Pattove.systemRegistry.items.find(i=>i.entry==='TOK-01').name));
  await shot('04-entry');
  await page.goBack();
  check('부품 상세에서 뒤로 가면 사전으로 복귀',await page.locator('.dict').count()===1);
  await page.locator('#query').fill('색');await page.locator('#query').press('Enter');
  check('사전 전체 검색',await page.locator('.dict-entry').count()>0);
  await shot('05-search');
  await goto('dictionary?category=VIS');
  await page.locator('button.dict-entry').first().click();
  check('사전 상세는 그림 크게 보기만',await page.locator('dialog .detail-art svg').isVisible()&&await page.locator('dialog .dialog-footer, dialog .record-detail').count()===0);
  await shot('06-entry-art');
  await close();
  await goto('docs?doc=definition');await page.waitForFunction(()=>!location.hash.startsWith('#/docs'));
  check('없앤 문서 주소는 문서 화면을 열지 않음',!page.url().includes('docs')&&await page.locator('.document-body').count()===0);
  for(const width of [320,375,760,768,1440]){
   await page.setViewportSize({width,height:1000});
   for(const route of ['components','components?category=module','dictionary','dictionary?category=CLI']){
    await goto(route);
    check(width+' '+route+' 페이지 넘침 없음',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    if(width===375)await shot('mobile-'+route.split('?')[0]+(route.includes('category')?'-items':''));
   }
   if(width<=760){
    await goto('dictionary');
    await page.locator('[data-focus="rail-'+data.groups.find(g=>g.codes.includes('TOK')).id+'"]').click();
    await page.locator('[data-focus="leaf-TOK"]').click();
    check(width+' 모바일 대분류→중분류 선택',(await page.locator('.dict-leaf[aria-current]').getAttribute('data-focus'))==='leaf-TOK');
   }
  }
  check('브라우저 오류 없음',errors.length===0);
  fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({checks,errors},null,2));
  console.log(checks.length+' library checks passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

