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
check('5개 계층 모두 실제 구성요소를 가짐',data.layers.length===5&&data.layers.every(l=>data.components.some(c=>c.layer===l.id)));
const shelfOf=e=>data.shelves.filter(s=>s.kinds.includes(e.kind));
check('모든 항목이 부품·블록·템플릿 중 정확히 한 갈래에 들어감',data.shelves.length===3&&data.entries.every(e=>shelfOf(e).length===1));
check('쓰는 곳 태그가 서비스·게임·영역 분류를 한 번씩 덮음',(()=>{const codes=data.places.flatMap(p=>p.codes),use=data.groups.filter(g=>['service','game','domain'].includes(g.id)).flatMap(g=>g.codes);return new Set(codes).size===codes.length&&codes.length===use.length&&use.every(c=>codes.includes(c));})());
check('아이콘은 모두 아이콘 안쪽 분류 하나를 가짐',data.entries.filter(e=>e.category==='ICO').every(e=>data.iconGroups.some(g=>g.id===e.sub))&&data.entries.every(e=>!e.sub||e.category==='ICO'));
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
  check('레일은 부품·블록·템플릿과 스타일',await page.locator('#primary-nav a').count()===data.shelves.length+1);
  await shot('01-styles');
  await goto('components');
  check('구성요소 계층 입구',await page.locator('.category-tile').count()===data.layers.length);
  await shot('02-components');
  for(const layer of data.layers){
   await page.locator('#sidebar a[href="#/components?category='+layer.id+'"]').click();
   check(layer.english+' 메뉴에 실제 항목 표시',await page.locator('.entry-tile').count()===Math.min(48,layer.count));
   await page.locator('.entry-tile').first().click();
   check(layer.english+' 상세에 대표 항목 표시',await page.locator('.record-detail section p').count()===1);
   await close();
  }
  await page.locator('.brand').click();
  check('사전 첫 화면은 세 갈래 그림 입구와 세 갈래 레일',await page.locator('.dict-group').count()===data.shelves.length&&await page.locator('[data-focus^="rail-"]').count()===data.shelves.length);
  await shot('03-dictionary');
  const itemsOf=category=>page.evaluate(category=>Pattove.libraryUI.currentItems({page:'dictionary',category,query:''}),category);
  let shelfTotal=0;
  for(const shelf of data.shelves){
   await goto('dictionary?category='+shelf.id);
   const links=await page.locator('#sidebar a').evaluateAll(as=>as.map(a=>[a.getAttribute('href').split('category=')[1],Number(a.querySelector('small').textContent)]));
   shelfTotal+=links[0][1];
   for(const [category,count] of links){
    await goto('dictionary?category='+category);
    const items=await itemsOf(category);
    check(category+' 메뉴 숫자와 항목 수 일치',items.length===count&&await page.locator('.dict-entry:not(.is-built)').count()===Math.min(48,items.filter(e=>!e.implementation).length));
    check(category+' 현재 분류 메뉴 열림',await page.locator('#sidebar a[aria-current="page"]').isVisible());
   }
  }
  check('세 갈래를 합치면 사전 전체와 구현 부품이 빠짐없이 들어감',shelfTotal===data.entries.length+await page.evaluate(()=>Pattove.systemRegistry.items.filter(i=>!i.entry).length));
  await goto('dictionary?category=part.ICO');
  check('아이콘은 안쪽 분류가 한 단계 더 열림',await page.locator('.dict-sub').count()===data.iconGroups.length);
  await page.locator('[data-focus="leaf-ICO-move"]').click();
  check('아이콘 안쪽 분류로 좁히기',await page.locator('.dict-entry').count()===data.entries.filter(e=>e.sub==='move').length&&(await itemsOf('part.ICO.move')).length===data.entries.filter(e=>e.sub==='move').length&&await page.locator('.dict-sub').count()===data.iconGroups.length);
  await goto('dictionary?category=part.game');
  check('쓰는 곳 태그로 게임 전용 부품 모으기',(await itemsOf('part.game')).every(e=>data.places.find(p=>p.id==='game').codes.includes(e.category)&&shelfOf(e)[0].id==='part'));
  await goto('dictionary?category=ICO');
  check('옛 분류 주소도 그 분류 전체를 보여줌',(await itemsOf('ICO')).length===data.entries.filter(e=>e.category==='ICO').length);
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
   for(const route of ['components','components?category=module','dictionary','dictionary?category=CLI','dictionary?category=part.ICO.move']){
    await goto(route);
    check(width+' '+route+' 페이지 넘침 없음',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    if(width===375)await shot('mobile-'+route.split('?')[0]+(route.includes('category')?'-'+route.split('=')[1]:''));
   }
   if(width<=760){
    await goto('dictionary');
    await page.locator('[data-focus="rail-part"]').click();
    await page.locator('[data-focus="leaf-TOK"]').click();
    check(width+' 모바일 갈래→분류 선택',(await page.locator('.dict-leaf[aria-current]').getAttribute('data-focus'))==='leaf-TOK');
   }
  }
  check('브라우저 오류 없음',errors.length===0);
  fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({checks,errors},null,2));
  console.log(checks.length+' library checks passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

