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
check('모든 항목이 토큰·부품·블록·템플릿·아이콘 중 정확히 한 갈래에 들어가고, 아이콘 사전은 통째로 아이콘 갈래',data.shelves.length===5&&data.entries.every(e=>data.shelves.filter(s=>s.id===e.shelf).length===1)&&data.entries.every(e=>(e.category==='ICO')===(e.shelf==='icon')));
check('토큰 갈래가 맨 앞이고 TOK 146개를 모두 담음',data.shelves[0].id==='token'&&data.entries.filter(e=>e.shelf==='token').length===146&&data.entries.filter(e=>e.category==='TOK').every(e=>e.shelf==='token'));
check('쓰는 곳 태그가 서비스·게임·영역 분류를 한 번씩 덮음',(()=>{const codes=data.places.flatMap(p=>p.codes),use=data.groups.filter(g=>['service','game','domain'].includes(g.id)).flatMap(g=>g.codes);return new Set(codes).size===codes.length&&codes.length===use.length&&use.every(c=>codes.includes(c));})());
check('아이콘은 모두 카테고리 하나를 가지고, 빈 카테고리가 없음',data.iconGroups.every(g=>data.entries.some(e=>e.sub===g.id))&&data.entries.filter(e=>e.category==='ICO').every(e=>data.iconGroups.some(g=>g.id===e.sub))&&data.entries.every(e=>!e.sub||e.category==='ICO'));
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
  check('레일은 토큰·부품·블록·템플릿·아이콘과 스타일',await page.locator('#primary-nav a').count()===data.shelves.length+1);
  await shot('01-styles');
  // The count is not printed on screen any more; the screen-reader announcement still carries it.
  const shown=async()=>Number((await page.locator('#announcer').textContent()).replace(/[^0-9]/g,''));
  // The side menu holds tabs and folding filter sections; content fills the rest.
  const menuSide=async()=>await page.locator('#app-menu').isVisible()&&await page.evaluate(()=>Math.round(document.querySelector('main').getBoundingClientRect().left)===Math.round(document.querySelector('#app-menu').getBoundingClientRect().right));
  const option=(key,id)=>page.locator('#filter-bar .filter-option[data-filter="'+key+':'+id+'"]');
  const section=key=>page.locator('#filter-bar details.filter-section[data-section="'+key+'"]');
  const openSection=async key=>{if(!await section(key).evaluate(d=>d.open))await section(key).locator('summary').click();};
  const pick=async(key,id)=>{await openSection(key);await option(key,id).click();};
  const pressed=()=>page.locator('#filter-bar .filter-option[aria-pressed="true"]').count();
  const sections=()=>page.locator('#filter-bar .filter-section > summary > span:first-child').allTextContents();
  await goto('components');
  check('구성요소는 옆 메뉴에 계층 칸',await menuSide()&&JSON.stringify(await sections())==='["계층"]'&&await page.locator('#filter-bar .filter-option[data-filter^="layer:"]').count()===data.layers.length&&await shown()===data.components.length);
  await shot('02-components');
  for(const layer of data.layers){
   await pick('layer',layer.id);
   check(layer.english+' 계층을 고르면 그 계층만',await pressed()===1&&await page.locator('.entry-tile').count()===Math.min(48,layer.count)&&await shown()===layer.count);
   await page.locator('.entry-tile').first().click();
   check(layer.english+' 상세에 대표 항목 표시',await page.locator('.record-detail section p').count()===1);
   await close();
   await pick('layer',layer.id);
   check(layer.english+' 계층을 다시 끄면 전부',await pressed()===0&&await shown()===data.components.length);
  }
  await page.locator('.brand').click();
  check('사전 첫 화면은 부품 탭 격자',await menuSide()&&await page.locator('[data-focus^="tab-"]').count()===data.shelves.length&&await page.locator('[data-focus="tab-part"][aria-current="page"]').count()===1&&await page.locator('.dict-entry').count()>0);
  check('필터에 전체 항목 없음',await page.locator('#app-menu :is(a,button,label)').evaluateAll(els=>els.every(e=>e.textContent.trim()!=='전체')));
  await shot('03-dictionary');
  const itemsOf=qs=>page.evaluate(qs=>{const ui=Pattove.libraryUI;return ui.currentItems({page:'dictionary',filters:ui.readFilters('dictionary',new URLSearchParams(qs)),query:''});},qs);
  let shelfTotal=0;
  for(const shelf of data.shelves){
   await goto('dictionary?shelf='+shelf.id);
   const total=await shown();shelfTotal+=total;
   check(shelf.id+' 탭 항목 수 일치',total===(await itemsOf('shelf='+shelf.id)).length);
   // The icon tab narrows by its own categories; the other tabs by source category.
   const key=shelf.codes?.includes('ICO')?'icon':'code';
   const codes=await page.locator('#filter-bar .filter-option[data-filter^="'+key+':"]').evaluateAll(els=>els.map(e=>e.dataset.filter.split(':')[1]));
   const counts=[];for(const code of codes)counts.push((await itemsOf('shelf='+shelf.id+'&'+key+'='+code)).length);
   check(shelf.id+' 분류 칸은 이 탭에 있는 분류만',codes.length>0&&counts.every(n=>n>0));
   for(const [i,code] of codes.entries()){
    await goto('dictionary?shelf='+shelf.id+'&'+key+'='+code);
    const items=await itemsOf('shelf='+shelf.id+'&'+key+'='+code);
    check(shelf.id+'.'+code+' 분류 항목 수 일치',items.length===counts[i]&&await shown()===counts[i]&&await page.locator('.dict-entry:not(.is-built)').count()===Math.min(48,items.filter(e=>!e.implementation).length));
   }
  }
  const tokenComponents=data.components.filter(c=>c.layer==='token').length;
  check('모든 탭을 합치면 사전 전체·토큰 계층 구성요소·구현 부품이 빠짐없이 들어감',tokenComponents===30&&shelfTotal===data.entries.length+tokenComponents+await page.evaluate(()=>Pattove.systemRegistry.items.filter(i=>!i.entry).length));
  // 토큰 탭 종류 필터 = 이름의 " — " 앞부분(색·글자·간격 …), 하나뿐인 갈래와 이름만 있는 항목은 기타.
  await goto('dictionary?shelf=token');
  const tokenKinds=await page.locator('#filter-bar .filter-option[data-filter^="kind:"]').evaluateAll(els=>els.map(e=>e.dataset.filter.slice(5)));
  const colorCount=data.entries.filter(e=>e.category==='TOK'&&e.name.startsWith('색 — ')).length;
  check('토큰 탭 종류 필터는 이름 앞부분으로 나뉨',['색','글자','간격','움직임','기타','토큰 묶음'].every(k=>tokenKinds.includes(k))&&(await itemsOf('shelf=token&kind=색')).length===colorCount&&(await itemsOf('shelf=token&kind=토큰 묶음')).length===tokenComponents);
  check('토큰 탭 종류 칸 개수를 합치면 탭 전체',(await Promise.all(tokenKinds.map(k=>itemsOf('shelf=token&kind='+encodeURIComponent(k))))).reduce((n,l)=>n+l.length,0)===(await itemsOf('shelf=token')).length);
  // 어지러움 기준: 결과 개수 글자 없음, 필터 칸 제목은 탭과 겹치지 않음.
  for(const route of [...data.shelves.map(s=>'dictionary?shelf='+s.id),'components','patterns']){
   await goto(route);
   const tab=(await page.locator('#primary-nav [aria-current="page"]').allTextContents()).join('').trim();
   check(route+' 개수 글자 없고 필터 칸 제목은 탭 이름과 겹치지 않음',await page.locator('.filter-count').count()===0&&(await sections()).every(t=>t.trim().length>0&&t.trim()!==tab));
  }
  await goto('dictionary?shelf=part');
  const kindNames=await page.locator('#filter-bar .filter-option[data-filter^="kind:"]').allTextContents();
  check('부품 탭 필터 칸은 종류·쓰임·분야·세부 분류, 종류 안에서 낱개 부품',JSON.stringify(await sections())==='["종류","쓰임","분야","세부 분류"]'&&kindNames.includes('낱개 부품')&&!kindNames.includes('부품'));
  await openSection('role');
  const whole=await shown(),role=page.locator('#filter-bar .filter-option[data-filter^="role:"]:not([disabled])');
  const firstKey=(await role.first().getAttribute('data-filter')).slice(5),secondKey=(await role.nth(1).getAttribute('data-filter')).slice(5);
  await option('role',firstKey).click();const one=await shown();
  check('쓰임 한 줄 누르면 바로 줄고 칸 제목에 1, 칸은 열린 채, 모두 지우기가 생김',one<whole&&await pressed()===1&&await section('role').evaluate(d=>d.open)&&(await section('role').locator('.filter-section-num').textContent()).includes('1')&&await page.locator('#filter-bar .filter-clear').count()===1);
  await option('role',secondKey).click();const two=await shown();
  check('여러 개를 함께 켜면 합쳐서 보여줌',two>one&&two<=whole&&await pressed()===2);
  await page.reload();
  check('고른 값과 개수 새로고침 유지',await shown()===two&&await pressed()===2);
  await page.locator('#filter-bar [data-action="clear-filters"]').click();
  check('모두 지우기로 전부 복귀, 모두 지우기도 사라짐',await shown()===whole&&await pressed()===0&&await page.locator('#filter-bar .filter-clear').count()===0);
  await openSection('role');
  await option('role',firstKey).focus();await page.keyboard.press('Space');
  check('키보드 스페이스로 켜기',await shown()===one&&await pressed()===1);
  await page.keyboard.press('Space');
  check('스페이스로 다시 끄기, 초점은 그 줄에 남음',await shown()===whole&&await page.evaluate(()=>document.activeElement.matches('.filter-option')));
  await openSection('code');
  const codeSearch=section('code').locator('.facet-search');
  check('긴 세부 분류만 칸 안 검색이 있음',await codeSearch.count()===1&&await page.locator('#filter-bar .facet-search').count()===1);
  await codeSearch.fill('입력');
  const codeRows=page.locator('#filter-bar .filter-option[data-filter^="code:"]'),codeShown=page.locator('#filter-bar .filter-option[data-filter^="code:"]:not([hidden])');
  check('세부 분류 안에서 찾기',await codeShown.count()>=1&&await codeShown.count()<await codeRows.count());
  check('아이콘은 부품 탭 세부 분류에 없음',await option('code','ICO').count()===0);
  await goto('dictionary?shelf=icon');
  check('아이콘 탭 필터 칸은 종류·카테고리, 카테고리는 전부',JSON.stringify(await sections())==='["종류","카테고리"]'&&await page.locator('#filter-bar .filter-option[data-filter^="icon:"]').count()===data.iconGroups.length);
  await pick('icon','navigation');
  const navigation=data.entries.filter(e=>e.sub==='navigation').length;
  check('아이콘 카테고리로 좁히기',await page.locator('.dict-entry').count()===Math.min(48,navigation)&&await shown()===navigation&&(await itemsOf('shelf=icon&icon=navigation')).length===navigation&&await pressed()===1);
  check('쓰는 곳으로 게임 전용 부품 모으기',(await itemsOf('shelf=part&place=game')).every(e=>data.places.find(p=>p.id==='game').codes.includes(e.category)&&e.shelf==='part'));
  await goto('dictionary?category=ICO');
  check('옛 분류 주소는 아이콘 탭에서 아이콘 전체를 보여줌',(await itemsOf('category=ICO')).length===data.entries.filter(e=>e.category==='ICO').length&&page.url().includes('shelf=icon'));
  await page.locator('[data-action="load-more"]').click();
  check('대량 분류 더 보기 48개씩',await page.locator('.dict-entry:not(.is-built)').count()===96);
  check('더 보기 뒤 새 항목으로 초점',await page.locator('.dict-entry:not(.is-built)').nth(48).evaluate(e=>e===document.activeElement));
  await page.reload();
  check('표시한 범위 새로고침 유지',await page.locator('.dict-entry:not(.is-built)').count()===96);
  // Suggestions stay inside the current tab, and TOK-01 lives in the token tab.
  await goto('dictionary?shelf=token');
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
  await goto('dictionary?code=VIS');
  await page.locator('button.dict-entry').first().click();
  check('사전 상세는 그림 크게 보기만',await page.locator('dialog .detail-art svg').isVisible()&&await page.locator('dialog .dialog-footer, dialog .record-detail').count()===0);
  await shot('06-entry-art');
  await close();
  await goto('docs?doc=definition');await page.waitForFunction(()=>!location.hash.startsWith('#/docs'));
  check('없앤 문서 주소는 문서 화면을 열지 않음',!page.url().includes('docs')&&await page.locator('.document-body').count()===0);
  const inView=sel=>page.locator(sel).evaluate(p=>{const r=p.getBoundingClientRect();return r.width>0&&r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;});
  // The drawer slides in; measure once it has settled.
  const openMenu=async()=>{await page.locator('#menu-toggle').click();await page.waitForFunction(()=>document.querySelector('#app-menu').getBoundingClientRect().left===0);};
  for(const width of [320,375,390,760,768,1440]){
   await page.setViewportSize({width,height:1000});
   for(const route of ['components','components?layer=organism','dictionary','dictionary?code=CLI','dictionary?shelf=icon&icon=navigation','dictionary?shelf=template&role=work,quality']){
    await goto(route);
    check(width+' '+route+' 페이지 넘침 없음',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    if(width===375)await shot('mobile-'+route.replace(/[?=&,]/g,'-'));
   }
   if(width<=760){
    await goto('dictionary?shelf=part');
    await openMenu();
    await pick('code','NAV');
    check(width+' 모바일 메뉴가 옆 서랍으로 화면 안에 열리고 고른 분류가 켜짐',await inView('#app-menu')&&await option('code','NAV').getAttribute('aria-pressed')==='true');
    await page.keyboard.press('Escape');
    check(width+' Esc로 메뉴 서랍 닫기',!await page.evaluate(()=>document.documentElement.classList.contains('menu-open')));
    await goto('system?detail=button');await page.evaluate(()=>document.fonts.ready);
    await openMenu();
    check(width+' 부품 화면 메뉴 서랍에 지금 부품이 화면 안에 보임',await inView('#app-menu')&&await inView('#filter-bar a[aria-current="page"][href="#/system?detail=button"]'));
    await page.keyboard.press('Escape');
   }
  }
  check('브라우저 오류 없음',errors.length===0);
  fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({checks,errors},null,2));
  console.log(checks.length+' library checks passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

