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
  const shown=async()=>Number((await page.locator('.filter-count').textContent()).replace(/[^0-9]/g,''));
  const noSide=async()=>await page.locator('#sidebar, .app-sidebar, #site-navigation').count()===0&&await page.locator('main').evaluate(m=>m.getBoundingClientRect().left)===0;
  await goto('components');
  const picked=async key=>{const n=page.locator('[data-focus="menu-'+key+'"] .filter-menu-num');return await n.count()?Number((await n.textContent()).replace(/[^0-9]/g,'')):0;};
  const checked=()=>page.locator('.filter-scroll [data-filter-check]:checked').count();
  check('구성요소는 왼쪽 열 없이 계층 버튼 하나',await noSide()&&await page.locator('.filter-scroll > .filter-menu').count()===1&&await page.locator('#facet-layer [data-filter-check="layer"]').count()===data.layers.length&&await shown()===data.components.length);
  await shot('02-components');
  for(const layer of data.layers){
   const box=page.locator('#facet-layer [data-filter-check="layer"][value="'+layer.id+'"]');
   await page.locator('[data-focus="menu-layer"]').click();await box.check();await page.keyboard.press('Escape');
   check(layer.english+' 계층을 고르면 그 계층만',await picked('layer')===1&&await page.locator('.entry-tile').count()===Math.min(48,layer.count)&&await shown()===layer.count);
   await page.locator('.entry-tile').first().click();
   check(layer.english+' 상세에 대표 항목 표시',await page.locator('.record-detail section p').count()===1);
   await close();
   await page.locator('[data-focus="menu-layer"]').click();await box.uncheck();await page.keyboard.press('Escape');
   check(layer.english+' 계층을 다시 끄면 전부',await picked('layer')===0&&await shown()===data.components.length);
  }
  await page.locator('.brand').click();
  check('사전 첫 화면은 부품 탭 전체 폭 격자',await noSide()&&await page.locator('[data-focus^="tab-"]').count()===data.shelves.length&&await page.locator('[data-focus="tab-part"][aria-current="page"]').count()===1&&await page.locator('.dict-entry').count()>0);
  check('필터 줄에 전체 항목 없음',await page.locator('.app-header :is(a,button,label)').evaluateAll(els=>els.every(e=>e.textContent.trim()!=='전체')));
  await shot('03-dictionary');
  const itemsOf=qs=>page.evaluate(qs=>{const ui=Pattove.libraryUI;return ui.currentItems({page:'dictionary',filters:ui.readFilters('dictionary',new URLSearchParams(qs)),query:''});},qs);
  let shelfTotal=0;
  for(const shelf of data.shelves){
   await goto('dictionary?shelf='+shelf.id);
   const total=await shown();shelfTotal+=total;
   check(shelf.id+' 탭 숫자와 항목 수 일치',total===(await itemsOf('shelf='+shelf.id)).length);
   const codes=await page.locator('#facet-code [data-filter-check="code"]').evaluateAll(els=>els.map(e=>[e.value,Number(e.closest('label').querySelector('small').textContent)]));
   check(shelf.id+' 분류 목록은 이 탭에 있는 분류만',codes.length>0&&codes.every(([,n])=>n>0));
   for(const [code,count] of codes){
    await goto('dictionary?shelf='+shelf.id+'&code='+code);
    const items=await itemsOf('shelf='+shelf.id+'&code='+code);
    check(shelf.id+'.'+code+' 분류 숫자와 항목 수 일치',items.length===count&&await shown()===count&&await page.locator('.dict-entry:not(.is-built)').count()===Math.min(48,items.filter(e=>!e.implementation).length));
   }
  }
  check('세 탭을 합치면 사전 전체와 구현 부품이 빠짐없이 들어감',shelfTotal===data.entries.length+await page.evaluate(()=>Pattove.systemRegistry.items.filter(i=>!i.entry).length));
  // 어지러움 기준: 기준마다 이름 붙은 버튼 하나, 탭과 같은 이름 없음, 줄 높이·눈에 보이는 버튼 높이 상한.
  const menus=()=>page.locator('.filter-scroll > .filter-menu > span:first-child').allTextContents();
  for(const route of [...data.shelves.map(s=>'dictionary?shelf='+s.id),'components','patterns','system?detail=button']){
   await goto(route);
   const tab=(await page.locator('#primary-nav [aria-current="page"]').allTextContents()).join('').trim();
   check(route+' 필터 줄에 이름 없는 값 칩 0개',await page.locator('.filter-scroll > :not(.filter-menu, .facet-panel)').count()===0&&(await menus()).every(t=>t.trim().length>0&&t.trim()!==tab));
   const box=await page.evaluate(()=>({row:document.querySelector('.filter-row').getBoundingClientRect().height,pill:Math.max(...[...document.querySelectorAll('.filter-scroll > .filter-menu')].map(b=>parseFloat(getComputedStyle(b,'::before').height)))}));
   check(route+' 필터 줄 높이 52 이하, 눈에 보이는 버튼 40 이하',box.row<=52&&box.pill<=40);
  }
  await goto('dictionary?shelf=part');
  const kindNames=await page.locator('#facet-kind .facet-option span').allTextContents();
  check('부품 탭 필터 줄에 부품 버튼·값 없음, 종류 안에서 낱개 부품',JSON.stringify(await menus())==='["종류","영역","분야","분류"]'&&kindNames.includes('낱개 부품')&&!kindNames.includes('부품'));
  const whole=await shown(),roleMenu=page.locator('[data-focus="menu-role"]'),role=page.locator('#facet-role [data-filter-check="role"]:not([disabled])');
  const firstKey=await role.first().getAttribute('value'),secondKey=await role.nth(1).getAttribute('value');
  const first=page.locator('#facet-role [value="'+firstKey+'"]'),second=page.locator('#facet-role [value="'+secondKey+'"]');
  await roleMenu.click();await first.check();const one=await shown();
  check('영역에서 하나 고르면 개수가 줄고 버튼이 영역 · 1, 이름표가 생김',one<whole&&await picked('role')===1&&(await roleMenu.locator('.filter-menu-num').textContent()).startsWith('· ')&&await roleMenu.evaluate(b=>b.classList.contains('is-on'))&&await page.locator('.filter-tag[data-filter="role:'+firstKey+'"]').count()===1);
  await second.check();const two=await shown();
  check('여러 개를 함께 켜면 합쳐서 보여주고 버튼은 · 2',two>one&&two<=whole&&await picked('role')===2);
  await page.reload();
  check('고른 값과 개수 새로고침 유지',await shown()===two&&await checked()===2);
  await page.locator('[data-action="clear-filters"]').first().click();
  check('모두 지우기로 전부 복귀, 이름표 줄도 사라짐',await shown()===whole&&await checked()===0&&await page.locator('.filter-tags').count()===0&&await picked('role')===0);
  await roleMenu.focus();await page.keyboard.press('Enter');await first.focus();await page.keyboard.press('Space');
  check('키보드로 목록을 열고 스페이스로 켜기',await shown()===one&&await checked()===1);
  await page.keyboard.press('Space');
  check('스페이스로 다시 끄기, 초점은 체크 칸에 남음',await shown()===whole&&await page.evaluate(()=>document.activeElement.matches('[data-filter-check]')));
  await page.keyboard.press('Escape');
  check('Esc로 영역 목록 닫기',await page.locator('.facet-panel:popover-open').count()===0);
  await page.locator('[data-focus="menu-code"]').focus();await page.keyboard.press('Enter');
  check('분류는 자기 검색이 있는 체크 목록으로 열림',await page.locator('#facet-code:popover-open .facet-search').count()===1);
  await page.locator('#facet-code .facet-search').fill('아이콘');
  check('분류 목록 안에서 찾기',await page.locator('#facet-code .facet-option:not([hidden])').count()>=1&&await page.locator('#facet-code .facet-option:not([hidden])').count()<await page.locator('#facet-code .facet-option').count());
  await page.locator('#facet-code [data-filter-check="code"][value="ICO"]').check();
  check('아이콘을 고르면 안쪽 분류가 목록에 열리고 목록은 열린 채',await page.locator('#facet-code:popover-open').count()===1&&await page.locator('#facet-code .facet-option.is-nested').count()===data.iconGroups.length&&await page.locator('[data-focus="menu-code"] .filter-menu-num').count()===1&&await picked('code')===1);
  await page.locator('#facet-code [data-filter-check="icon"][value="move"]').check();
  const move=data.entries.filter(e=>e.sub==='move').length;
  check('아이콘 안쪽 분류로 좁히기',await page.locator('.dict-entry').count()===move&&(await itemsOf('shelf=part&code=ICO&icon=move')).length===move);
  await page.keyboard.press('Escape');
  check('Esc로 목록 닫기',await page.locator('.facet-panel:popover-open').count()===0);
  check('쓰는 곳으로 게임 전용 부품 모으기',(await itemsOf('shelf=part&place=game')).every(e=>data.places.find(p=>p.id==='game').codes.includes(e.category)&&shelfOf(e)[0].id==='part'));
  await goto('dictionary?category=ICO');
  check('옛 분류 주소도 그 분류 전체를 보여줌',(await itemsOf('category=ICO')).length===data.entries.filter(e=>e.category==='ICO').length&&page.url().includes('code=ICO'));
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
    await page.locator('[data-focus="menu-code"]').click();
    await page.locator('#facet-code [data-filter-check="code"][value="TOK"]').check();
    check(width+' 모바일 분류 목록이 아래 시트로 화면 안에 열리고 고른 분류가 이름표로',await page.locator('#facet-code').evaluate(p=>{const r=p.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;})&&await page.locator('.filter-tag[data-filter="code:TOK"]').count()===1);
    await page.keyboard.press('Escape');
    await goto('system?detail=button');await page.evaluate(()=>document.fonts.ready);
    check(width+' 부품 화면에서 부품 버튼이 지금 부품 이름을 보여주고 필터 줄 안에 보임',(await page.locator('[data-focus="menu-part"] .filter-menu-value').textContent())==='버튼'&&await page.evaluate(()=>{const row=document.querySelector('#filter-bar .filter-scroll'),c=row.querySelector('[data-focus="menu-part"]').getBoundingClientRect(),b=row.getBoundingClientRect();return c.left>=b.left&&c.right<=b.right;}));
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

