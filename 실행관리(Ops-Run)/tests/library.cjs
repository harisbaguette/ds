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
const shelfOf=e=>{const byCode=data.shelves.filter(s=>(s.codes||[]).includes(e.category));return byCode.length?byCode:data.shelves.filter(s=>s.kinds.includes(e.kind));};
check('모든 항목이 토큰·부품·블록·템플릿 중 정확히 한 갈래에 들어감',data.shelves.length===4&&data.entries.every(e=>shelfOf(e).length===1));
check('토큰 갈래가 맨 앞이고 TOK 146개를 모두 담음',data.shelves[0].id==='token'&&data.entries.filter(e=>shelfOf(e)[0].id==='token').length===146&&data.entries.filter(e=>e.category==='TOK').every(e=>shelfOf(e)[0].id==='token'));
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
  // The count is not printed on screen any more; the screen-reader announcement still carries it.
  const shown=async()=>Number((await page.locator('#announcer').textContent()).replace(/[^0-9]/g,''));
  const noSide=async()=>await page.locator('#sidebar, .app-sidebar, #site-navigation').count()===0&&await page.locator('main').evaluate(m=>m.getBoundingClientRect().left)===0;
  await goto('components');
  const menu=page.locator('#filter-bar .filter-open'),panelOpen=()=>page.locator('#filter-panel:popover-open').count();
  const picked=async()=>Number(((await menu.textContent()).match(/\d+/)||[0])[0]);
  const pressed=()=>page.locator('#filter-panel .filter-chip[aria-pressed="true"]').count();
  const chip=(key,id)=>page.locator('#filter-panel .filter-chip[data-filter="'+key+':'+id+'"]');
  const openPanel=async()=>{if(!await panelOpen())await menu.click();};
  check('구성요소는 왼쪽 열 없이 필터 버튼 하나, 안에 계층 칩',await noSide()&&await page.locator('#filter-bar > .filter-menu').count()===1&&await page.locator('#filter-panel .filter-chip[data-filter^="layer:"]').count()===data.layers.length&&await shown()===data.components.length);
  await shot('02-components');
  for(const layer of data.layers){
   await openPanel();await chip('layer',layer.id).click();await page.keyboard.press('Escape');
   check(layer.english+' 계층을 고르면 그 계층만',await picked()===1&&await page.locator('.entry-tile').count()===Math.min(48,layer.count)&&await shown()===layer.count);
   await page.locator('.entry-tile').first().click();
   check(layer.english+' 상세에 대표 항목 표시',await page.locator('.record-detail section p').count()===1);
   await close();
   await openPanel();await chip('layer',layer.id).click();await page.keyboard.press('Escape');
   check(layer.english+' 계층을 다시 끄면 전부',await picked()===0&&await shown()===data.components.length);
  }
  await page.locator('.brand').click();
  check('사전 첫 화면은 부품 탭 전체 폭 격자',await noSide()&&await page.locator('[data-focus^="tab-"]').count()===data.shelves.length&&await page.locator('[data-focus="tab-part"][aria-current="page"]').count()===1&&await page.locator('.dict-entry').count()>0);
  check('필터에 전체 항목 없음',await page.locator('.app-header :is(a,button,label)').evaluateAll(els=>els.every(e=>e.textContent.trim()!=='전체')));
  await shot('03-dictionary');
  const itemsOf=qs=>page.evaluate(qs=>{const ui=Pattove.libraryUI;return ui.currentItems({page:'dictionary',filters:ui.readFilters('dictionary',new URLSearchParams(qs)),query:''});},qs);
  let shelfTotal=0;
  for(const shelf of data.shelves){
   await goto('dictionary?shelf='+shelf.id);
   const total=await shown();shelfTotal+=total;
   check(shelf.id+' 탭 항목 수 일치',total===(await itemsOf('shelf='+shelf.id)).length);
   const codes=await page.locator('#filter-panel .filter-chip[data-filter^="code:"]').evaluateAll(els=>els.map(e=>e.dataset.filter.slice(5)));
   const counts=[];for(const code of codes)counts.push((await itemsOf('shelf='+shelf.id+'&code='+code)).length);
   check(shelf.id+' 세부 분류 칩은 이 탭에 있는 분류만',codes.length>0&&counts.every(n=>n>0));
   for(const [i,code] of codes.entries()){
    await goto('dictionary?shelf='+shelf.id+'&code='+code);
    const items=await itemsOf('shelf='+shelf.id+'&code='+code);
    check(shelf.id+'.'+code+' 분류 항목 수 일치',items.length===counts[i]&&await shown()===counts[i]&&await page.locator('.dict-entry:not(.is-built)').count()===Math.min(48,items.filter(e=>!e.implementation).length));
   }
  }
  const tokenComponents=data.components.filter(c=>c.layer==='token').length;
  check('네 탭을 합치면 사전 전체·토큰 계층 구성요소·구현 부품이 빠짐없이 들어감',tokenComponents===30&&shelfTotal===data.entries.length+tokenComponents+await page.evaluate(()=>Pattove.systemRegistry.items.filter(i=>!i.entry).length));
  // 토큰 탭 종류 필터 = 이름의 " — " 앞부분(색·글자·간격 …), 하나뿐인 갈래와 이름만 있는 항목은 기타.
  await goto('dictionary?shelf=token');
  const tokenKinds=await page.locator('#filter-panel .filter-chip[data-filter^="kind:"]').evaluateAll(els=>els.map(e=>e.dataset.filter.slice(5)));
  const colorCount=data.entries.filter(e=>e.category==='TOK'&&e.name.startsWith('색 — ')).length;
  check('토큰 탭 종류 필터는 이름 앞부분으로 나뉨',['색','글자','간격','움직임','기타','토큰 묶음'].every(k=>tokenKinds.includes(k))&&(await itemsOf('shelf=token&kind=색')).length===colorCount&&(await itemsOf('shelf=token&kind=토큰 묶음')).length===tokenComponents);
  check('토큰 탭 종류 칩 개수를 합치면 탭 전체',(await Promise.all(tokenKinds.map(k=>itemsOf('shelf=token&kind='+encodeURIComponent(k))))).reduce((n,l)=>n+l.length,0)===(await itemsOf('shelf=token')).length);
  // 어지러움 기준: 머리는 한 줄(로고·탭·필터·돋보기), 결과 개수 글자 없음, 필터 칸 제목은 탭과 겹치지 않음.
  const sections=()=>page.locator('#filter-panel legend').allTextContents();
  for(const route of [...data.shelves.map(s=>'dictionary?shelf='+s.id),'components','patterns','system?detail=button']){
   await goto(route);
   const tab=(await page.locator('#primary-nav [aria-current="page"]').allTextContents()).join('').trim();
   const head=await page.evaluate(()=>{const kids=[...document.querySelector('.app-bar').children].filter(e=>!e.hidden);return {rows:new Set(kids.map(e=>{const r=e.getBoundingClientRect();return Math.round(r.top+r.height/2);})).size,height:document.querySelector('.app-header').getBoundingClientRect().height,count:document.querySelectorAll('.filter-count').length,query:!!document.querySelector('#query').getClientRects().length};});
   check(route+' 머리는 한 줄 72 이하, 개수 글자·펼친 검색창 없음',head.rows===1&&head.height<=72&&head.count===0&&!head.query);
   check(route+' 필터 칸 제목은 탭 이름과 겹치지 않음',(await sections()).every(t=>t.trim().length>0&&t.trim()!==tab));
  }
  await goto('dictionary?shelf=part');
  const kindNames=await page.locator('#filter-panel .filter-chip[data-filter^="kind:"]').allTextContents();
  check('부품 탭 필터 칸은 종류·쓰임·분야·세부 분류, 종류 안에서 낱개 부품',JSON.stringify(await sections())==='["종류","쓰임","분야","세부 분류"]'&&kindNames.includes('낱개 부품')&&!kindNames.includes('부품'));
  const whole=await shown(),role=page.locator('#filter-panel .filter-chip[data-filter^="role:"]:not([disabled])');
  const firstKey=(await role.first().getAttribute('data-filter')).slice(5),secondKey=(await role.nth(1).getAttribute('data-filter')).slice(5);
  const first=chip('role',firstKey),second=chip('role',secondKey);
  await menu.click();await first.click();const one=await shown();
  check('쓰임 칩 하나 누르면 바로 줄고 버튼이 필터 1, 칸은 열린 채, 이름표가 생김',one<whole&&await picked()===1&&await menu.evaluate(b=>b.classList.contains('is-on'))&&await panelOpen()===1&&await page.locator('.filter-tag[data-filter="role:'+firstKey+'"]').count()===1);
  await second.click();const two=await shown();
  check('여러 개를 함께 켜면 합쳐서 보여주고 버튼은 필터 2',two>one&&two<=whole&&await picked()===2);
  await page.reload();
  check('고른 값과 개수 새로고침 유지',await shown()===two&&await pressed()===2);
  await page.locator('#filter-tags [data-action="clear-filters"]').click();
  check('모두 지우기로 전부 복귀, 이름표 줄도 사라짐',await shown()===whole&&await pressed()===0&&await page.locator('#filter-tags').isHidden()&&await picked()===0);
  await menu.focus();await page.keyboard.press('Enter');await first.focus();await page.keyboard.press('Space');
  check('키보드로 필터 칸을 열고 스페이스로 켜기',await shown()===one&&await pressed()===1);
  await page.keyboard.press('Space');
  check('스페이스로 다시 끄기, 초점은 칩에 남음',await shown()===whole&&await page.evaluate(()=>document.activeElement.matches('.filter-chip')));
  await page.keyboard.press('Escape');
  check('Esc로 필터 칸 닫고 필터 버튼으로 초점',await page.locator('.facet-panel:popover-open').count()===0&&await menu.evaluate(e=>e===document.activeElement));
  await page.keyboard.press('Enter');
  const codeSearch=page.locator('#filter-panel .filter-section:has(.filter-chip[data-filter^="code:"]) .facet-search');
  check('긴 세부 분류만 칸 안 검색이 있음',await codeSearch.count()===1&&await page.locator('#filter-panel .facet-search').count()===1);
  await codeSearch.fill('아이콘');
  const codeChips=page.locator('#filter-panel .filter-chip[data-filter^="code:"]');
  check('세부 분류 안에서 찾기',await page.locator('#filter-panel .filter-chip[data-filter^="code:"]:not([hidden])').count()>=1&&await page.locator('#filter-panel .filter-chip[data-filter^="code:"]:not([hidden])').count()<await codeChips.count());
  await chip('code','ICO').click();
  check('아이콘을 고르면 아이콘 모양 칸이 생기고 칸은 열린 채',await panelOpen()===1&&await page.locator('#filter-panel .filter-chip[data-filter^="icon:"]').count()===data.iconGroups.length&&await picked()===1);
  await chip('icon','move').click();
  const move=data.entries.filter(e=>e.sub==='move').length;
  check('아이콘 안쪽 분류로 좁히기',await page.locator('.dict-entry').count()===move&&(await itemsOf('shelf=part&code=ICO&icon=move')).length===move);
  await page.keyboard.press('Escape');
  check('Esc로 필터 칸 닫기',await page.locator('.facet-panel:popover-open').count()===0);
  check('쓰는 곳으로 게임 전용 부품 모으기',(await itemsOf('shelf=part&place=game')).every(e=>data.places.find(p=>p.id==='game').codes.includes(e.category)&&shelfOf(e)[0].id==='part'));
  await goto('dictionary?category=ICO');
  check('옛 분류 주소도 그 분류 전체를 보여줌',(await itemsOf('category=ICO')).length===data.entries.filter(e=>e.category==='ICO').length&&page.url().includes('code=ICO'));
  await page.locator('[data-action="load-more"]').click();
  check('대량 분류 더 보기 48개씩',await page.locator('.dict-entry:not(.is-built)').count()===96);
  check('더 보기 뒤 새 항목으로 초점',await page.locator('.dict-entry:not(.is-built)').nth(48).evaluate(e=>e===document.activeElement));
  await page.reload();
  check('표시한 범위 새로고침 유지',await page.locator('.dict-entry:not(.is-built)').count()===96);
  await page.locator('#search-open').click();
  await page.locator('#query').fill('TOK-01');
  check('ID 검색 제안',await page.locator('.search-suggestion').count()===1);
  await page.locator('#query').press('ArrowDown');await page.locator('#query').press('Enter');
  check('구현된 사전 항목의 검색 제안은 실제 부품 상세로 연결',await page.locator('#detail-title').textContent()===await page.evaluate(()=>Pattove.systemRegistry.items.find(i=>i.entry==='TOK-01').name));
  await shot('04-entry');
  await page.goBack();
  check('부품 상세에서 뒤로 가면 사전으로 복귀',await page.locator('.dict').count()===1);
  if(!await page.locator('#query').isVisible())await page.locator('#search-open').click();
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
  for(const width of [320,375,390,760,768,1440]){
   await page.setViewportSize({width,height:1000});
   for(const route of ['components','components?layer=organism','dictionary','dictionary?code=CLI','dictionary?shelf=part&code=ICO&icon=move','dictionary?shelf=template&role=work,quality']){
    await goto(route);
    check(width+' '+route+' 페이지 넘침 없음',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    if(width===375)await shot('mobile-'+route.replace(/[?=&,]/g,'-'));
   }
   if(width<=760){
    await goto('dictionary');
    await page.locator('[data-focus="tab-part"]').click();
    await page.locator('#filter-bar .filter-open').click();
    await page.locator('#filter-panel .filter-chip[data-filter="code:TOK"]').click();
    check(width+' 모바일 필터 칸이 아래 시트로 화면 안에 열리고 고른 분류가 이름표로',await page.locator('#filter-panel').evaluate(p=>{const r=p.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;})&&await page.locator('.filter-tag[data-filter="code:TOK"]').count()===1);
    await page.keyboard.press('Escape');
    await goto('system?detail=button');await page.evaluate(()=>document.fonts.ready);
    check(width+' 부품 화면에서 부품 버튼이 지금 부품 이름을 알리고 머리 줄 화면 안에 보임',(await page.locator('[data-focus="menu-part"]').getAttribute('aria-label'))==='부품 고르기: 버튼'&&await page.evaluate(()=>{const c=document.querySelector('[data-focus="menu-part"]').getBoundingClientRect(),s=document.querySelector('#search-open').getBoundingClientRect();return c.left>=0&&s.right<=innerWidth&&Math.abs((c.top+c.bottom)-(s.top+s.bottom))<2;}));
    await page.locator('[data-focus="menu-part"]').click();
    check(width+' 부품 고르기 시트가 화면 안에 열리고 지금 부품이 보임',await page.locator('#facet-part').evaluate(p=>{const r=p.getBoundingClientRect(),c=p.querySelector('[aria-current="page"]').getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight&&c.top>=r.top&&c.bottom<=r.bottom;}));
    await page.keyboard.press('Escape');
   }
  }
  check('브라우저 오류 없음',errors.length===0);
  fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({checks,errors},null,2));
  console.log(checks.length+' library checks passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

