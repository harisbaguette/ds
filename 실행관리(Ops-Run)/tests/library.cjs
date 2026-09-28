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
check('아이콘은 모두 카테고리 하나를 가지고, 빈 카테고리가 없음',data.iconGroups.every(g=>data.entries.some(e=>e.sub===g.id))&&data.entries.filter(e=>e.category==='ICO').every(e=>e.kind==='기준'?!e.sub:data.iconGroups.some(g=>g.id===e.sub))&&data.entries.every(e=>!e.sub||e.category==='ICO'));
// Every installed icon-set picture is named and filed; the ones no meaning entry points at join the icon tab as 세트 그림.
const glyphOnly=data.glyphs.filter(([key])=>!data.entries.some(e=>e.glyph?.includes(key)));
check('설치된 아이콘 세트 그림은 모두 한국어 이름과 아이콘 카테고리 하나를 가짐',data.glyphs.length===data.glyphSets.reduce((n,s)=>n+s.count,0)&&data.glyphs.every(([key,name,sub,also=[]])=>key.includes(':')&&name&&[sub,...also].every(id=>data.iconGroups.some(g=>g.id===id))&&also.length<=2&&!also.includes(sub))&&new Set(data.glyphs.map(g=>g[0])).size===data.glyphs.length);
check('아이콘 부품은 모두 실제 그림 키를 가짐',data.entries.filter(e=>e.category==='ICO'&&e.kind==='부품').every(e=>e.glyph?.length>0)&&data.entries.flatMap(e=>e.glyph||[]).every(g=>g.startsWith('emoji:')||data.glyphs.some(([key])=>key===g)));
check('아이콘 카테고리마다 세트 그림이 들어 있음',data.iconGroups.every(g=>data.glyphs.some(([,,sub])=>sub===g.id)));
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
  check('상단에 구성요소 다섯 갈래와 스타일',await page.locator('.app-top .nav-shelf-link').count()===data.shelves.length&&await page.locator('.app-top #style-context').isVisible());
  await shot('01-styles');
  // The count is not printed on screen any more; the screen-reader announcement still carries it.
  const shown=async()=>Number((await page.locator('#announcer').textContent()).replace(/[^0-9]/g,''));
  // The side menu is the only way to narrow a tab; there is no separate filter panel.
  const menuSide=async()=>await page.locator('#app-menu').isVisible()&&await page.evaluate(()=>Math.round(document.querySelector('main').getBoundingClientRect().left)===Math.round(document.querySelector('#app-menu').getBoundingClientRect().right));
  const noFilterUI=async()=>await page.locator('#filter-bar, #filter-toggle, #active-filters, .facet-search, [data-filter]').count()===0;
  // Each left-rail row is an address: [key, value] of its one narrowing.
  const railPicks=()=>page.locator('#secondary-nav .nav-subcategory').evaluateAll(els=>els.map(a=>[...new URLSearchParams(a.getAttribute('href').split('?')[1])].find(([k])=>k!=='shelf')));
  await goto('components');
  check('구성요소 화면에 필터 칸 없이 전부 보임',await page.locator('#app-menu').evaluate(e=>e.hidden)&&await noFilterUI()&&await shown()===data.components.length);
  await shot('02-components');
  for(const layer of data.layers){
   await goto('components?layer='+layer.id);
   check(layer.english+' 계층 주소는 그 계층만',await page.locator('.entry-tile').count()===Math.min(48,layer.count)&&await shown()===layer.count);
   await page.locator('.entry-tile').first().click();
   check(layer.english+' 상세에 대표 항목 표시',await page.locator('.record-detail section p').count()===1);
   await close();
  }
  await page.locator('[data-focus="tab-part"]').click();
  check('사전 첫 화면은 부품 탭 격자',await menuSide()&&await page.locator('[data-focus^="tab-"]').count()===data.shelves.length&&await page.locator('[data-focus="tab-part"][aria-current="page"]').count()===1&&await page.locator('.dict-entry').count()>0);
  check('필터에 전체 항목 없음',await page.locator('#app-menu :is(a,button,label)').evaluateAll(els=>els.every(e=>e.textContent.trim()!=='전체')));
  await shot('03-dictionary');
  const itemsOf=qs=>page.evaluate(qs=>{const ui=Pattove.libraryUI;return ui.currentItems({page:'dictionary',filters:ui.readFilters('dictionary',new URLSearchParams(qs)),query:''});},qs);
  let shelfTotal=0;
  for(const shelf of data.shelves){
   await goto('dictionary?shelf='+shelf.id);
   const total=await shown();shelfTotal+=total;
   check(shelf.id+' 탭 항목 수 일치',total===(await itemsOf('shelf='+shelf.id)).length);
   // Each tab's left rail narrows by its own facet (부품 by group, 아이콘 by icon category, 토큰·템플릿 by kind, 블록 by source category).
   const picks=await railPicks();
   const counts=[];for(const [key,code] of picks)counts.push((await itemsOf('shelf='+shelf.id+'&'+key+'='+encodeURIComponent(code))).length);
   check(shelf.id+' 왼쪽 분류는 이 탭에 있는 분류만',picks.length>0&&counts.every(n=>n>0));
   for(const [i,[key,code]] of picks.entries()){
    await goto('dictionary?shelf='+shelf.id+'&'+key+'='+encodeURIComponent(code));
    const items=await itemsOf('shelf='+shelf.id+'&'+key+'='+encodeURIComponent(code));
    check(shelf.id+'.'+code+' 분류 항목 수 일치',items.length===counts[i]&&await shown()===counts[i]&&await page.locator('.dict-entry:not(.is-built)').count()===Math.min(48,items.filter(e=>!e.implementation).length));
   }
  }
  const tokenComponents=data.components.filter(c=>c.layer==='token').length;
  check('모든 탭을 합치면 사전 전체·토큰 계층 구성요소·구현 부품이 빠짐없이 들어감',tokenComponents===30&&shelfTotal===data.entries.length+glyphOnly.length+tokenComponents+await page.evaluate(()=>Pattove.systemRegistry.items.filter(i=>!i.entry).length));
  // 토큰 탭 왼쪽 분류 = 이름의 " — " 앞부분(색·글자·간격 …), 하나뿐인 갈래와 이름만 있는 항목은 기타.
  await goto('dictionary?shelf=token');
  const tokenKinds=(await railPicks()).filter(([k])=>k==='kind').map(([,v])=>v);
  const colorCount=data.entries.filter(e=>e.category==='TOK'&&e.name.startsWith('색 — ')).length;
  check('토큰 탭 왼쪽 분류는 이름 앞부분으로 나뉨',['색','글자','간격','움직임','기타','토큰 묶음'].every(k=>tokenKinds.includes(k))&&(await itemsOf('shelf=token&kind=색')).length===colorCount&&(await itemsOf('shelf=token&kind=토큰 묶음')).length===tokenComponents);
  check('토큰 탭 종류 칸 개수를 합치면 탭 전체',(await Promise.all(tokenKinds.map(k=>itemsOf('shelf=token&kind='+encodeURIComponent(k))))).reduce((n,l)=>n+l.length,0)===(await itemsOf('shelf=token')).length);
  // 어지러움 기준: 결과 개수 글자 없음, 왼쪽 분류와 겹치는 필터 칸·분류 찾기 칸 없음.
  for(const route of [...data.shelves.map(s=>'dictionary?shelf='+s.id),'components','patterns']){
   await goto(route);
   check(route+' 개수 글자·필터 칸·분류 찾기 칸 없음',await page.locator('.filter-count').count()===0&&await noFilterUI());
  }
  await goto('dictionary?shelf=part');
  const whole=await shown(),role=data.roleOrder[0];
  await goto('dictionary?shelf=part&role='+role);
  check('예전 쓰임 주소도 그대로 좁혀 보여줌',await shown()<=whole&&await shown()===(await itemsOf('shelf=part&role='+role)).length);
  check('아이콘 표시 부품은 부품 탭, 개별 아이콘은 아이콘 탭',(await itemsOf('shelf=part&code=ICO')).every(e=>e.id==='icon')&&(await itemsOf('shelf=icon')).every(e=>!e.implementation));
  await goto('dictionary?shelf=icon');
  check('아이콘 탭 왼쪽 분류는 카테고리 전부, 분류 찾기 칸 없음',(await railPicks()).filter(([k])=>k==='icon').length===data.iconGroups.length&&await page.locator('#app-menu input').count()===0);
  await page.locator('[data-focus="nav-icon-navigation"]').click();await page.waitForURL(/icon=navigation/);
  // An icon shows in its home category and in the up-to-two categories it also belongs to.
  const navigation=data.entries.filter(e=>e.sub==='navigation'||e.also?.includes('navigation')).length+glyphOnly.filter(([,,sub,also=[]])=>sub==='navigation'||also.includes('navigation')).length;
  check('아이콘은 아직 그리지 않았으니 카드마다 빌린 그림 대신 미구현 표시',await page.locator('.dict-entry').count()>0&&await page.locator('.dict-entry:not(.is-todo), .dict-entry svg').count()===0);
  const navItems=await itemsOf('shelf=icon&icon=navigation');
  check('아이콘 카테고리로 좁히기',await page.locator('.dict-entry:not(.is-built)').count()===Math.min(48,navItems.filter(e=>!e.implementation).length)&&await shown()===navigation&&navItems.length===navigation&&await page.locator('[data-focus="nav-icon-navigation"][aria-current="true"]').count()===1);
  check('쓰는 곳으로 게임 전용 부품 모으기',(await itemsOf('shelf=part&place=game')).every(e=>data.places.find(p=>p.id==='game').codes.includes(e.category)&&e.shelf==='part'));
  const [alsoKey,,alsoHome,[alsoCat]]=glyphOnly.find(g=>g[3]);
  check('여러 칸에 속한 그림은 주 칸과 함께 보일 칸 모두에서 보임',(await itemsOf('shelf=icon&icon='+alsoCat)).some(e=>e.id===alsoKey)&&(await itemsOf('shelf=icon&icon='+alsoHome)).some(e=>e.id===alsoKey));
  await goto('dictionary?category=ICO');
  check('옛 분류 주소는 아이콘 탭에서 아이콘 전체를 보여줌',(await itemsOf('category=ICO')).length===data.entries.filter(e=>e.category==='ICO').length+glyphOnly.length&&page.url().includes('shelf=icon'));
  await page.locator('[data-action="load-more"]').click();
  check('대량 분류 더 보기 48개씩',await page.locator('.dict-entry:not(.is-built)').count()===96);
  check('더 보기 뒤 새 항목으로 초점',await page.locator('.dict-entry:not(.is-built)').nth(48).evaluate(e=>e===document.activeElement));
  await page.reload();
  check('표시한 범위 새로고침 유지',await page.locator('.dict-entry:not(.is-built)').count()===96);
  // Suggestions stay inside the current tab, and TOK-01 lives in the token tab.
  await goto('dictionary?shelf=token');
  await page.locator('#search-open').click();await page.locator('#query').fill('TOK-01');
  check('ID 검색 제안',await page.locator('.search-suggestion').count()===1);
  await page.locator('#query').press('ArrowDown');await page.locator('#query').press('Enter');
  check('구현된 사전 항목의 검색 제안은 실제 부품 상세로 연결',await page.locator('#detail-title').textContent()===await page.evaluate(()=>Pattove.systemRegistry.items.find(i=>i.entry==='TOK-01').name));
  await shot('04-entry');
  await page.goBack();
  check('부품 상세에서 뒤로 가면 사전으로 복귀',await page.locator('.dict').count()===1);
  await page.locator('#search-open').click();await page.locator('#query').fill('색');await page.locator('#query').press('Enter');
  check('사전 전체 검색',await page.locator('.dict-entry').count()>0);
  await shot('05-search');
  await goto('dictionary?code=VIS');
  check('견본 없는 항목은 가짜 그림 대신 미구현 표시',await page.locator('button.dict-entry.is-todo').count()>0&&await page.locator('button.dict-entry.is-todo svg').count()===0&&(await page.locator('button.dict-entry.is-todo .dict-todo').first().textContent())==='미구현');
  await page.locator('button.dict-entry.is-todo').first().click();
  check('미구현 항목 상세도 미구현이라고 말함',/미구현/.test(await page.locator('dialog .detail-art.is-todo').textContent())&&await page.locator('dialog .detail-art svg, dialog .dialog-footer, dialog .record-detail').count()===0);
  await shot('06-entry-art');
  await close();
  await goto('dictionary?shelf=icon&kind='+encodeURIComponent('세트 그림'));
  check('아이콘 탭 종류에 세트 그림이 있고 이름 없는 그림이 없음',await shown()===glyphOnly.length&&await page.locator('.dict-entry strong').first().textContent()!=='');
  await page.locator('button.dict-entry').first().click();
  const glyphKey=await page.locator('dialog .glyph-keys code').first().textContent();
  check('세트 그림 상세는 미구현을 먼저 말하고, 빌린 그림은 참고로 키·출처와 함께 보여 줌',/미구현/.test(await page.locator('dialog .detail-art.is-todo').textContent())&&await page.locator('dialog .detail-art svg').count()===0&&/빌려 온/.test(await page.locator('dialog .glyph-ref h3').textContent())&&glyphOnly.some(([key])=>key===glyphKey)&&/Lucide|Tabler|Phosphor|Material/.test(await page.locator('dialog .glyph-keys span').first().textContent()));
  await shot('07-glyph-art');
  await close();
  await page.locator('#search-open').click();await page.locator('#query').fill('rocket');await page.locator('#query').press('Enter');
  check('영문 그림 이름으로도 아이콘을 찾음',await page.locator('.dict-entry.is-todo').count()>0);
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
    check(width+' 모바일 메뉴는 이동 링크만 표시',await inView('#app-menu')&&await page.locator('#app-menu input, #app-menu #filter-bar').count()===0);
    await page.keyboard.press('Escape');
    check(width+' Esc로 메뉴 서랍 닫기',!await page.evaluate(()=>document.documentElement.classList.contains('menu-open')));
    await goto('system?detail=button');await page.evaluate(()=>document.fonts.ready);
    await openMenu();
    check(width+' 부품 상세에서도 소속 분류가 서랍 안에 보임',await inView('#app-menu')&&await inView('#secondary-nav [aria-current="true"]'));
    await page.keyboard.press('Escape');
   }
  }
  check('브라우저 오류 없음',errors.length===0);
  fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({checks,errors},null,2));
  console.log(checks.length+' library checks passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

