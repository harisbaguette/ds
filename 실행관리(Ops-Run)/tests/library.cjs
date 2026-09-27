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
  check('구성요소는 왼쪽 열 없이 계층 칩',await noSide()&&await page.locator('.chip[data-filter^="layer:"]').count()===data.layers.length&&await shown()===data.components.length);
  await shot('02-components');
  for(const layer of data.layers){
   const chip=page.locator('.chip[data-filter="layer:'+layer.id+'"]');
   await chip.click();
   check(layer.english+' 칩을 누르면 그 계층만',await chip.getAttribute('aria-pressed')==='true'&&await page.locator('.entry-tile').count()===Math.min(48,layer.count)&&await shown()===layer.count);
   await page.locator('.entry-tile').first().click();
   check(layer.english+' 상세에 대표 항목 표시',await page.locator('.record-detail section p').count()===1);
   await close();
   await chip.click();
   check(layer.english+' 칩을 다시 누르면 전부',await chip.getAttribute('aria-pressed')==='false'&&await shown()===data.components.length);
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
  await goto('dictionary?shelf=part');
  const whole=await shown(),role=page.locator('.chip[data-filter^="role:"]:not([disabled])');
  const firstKey=await role.first().getAttribute('data-filter'),secondKey=await role.nth(1).getAttribute('data-filter');
  const first=page.locator('.chip[data-filter="'+firstKey+'"]'),second=page.locator('.chip[data-filter="'+secondKey+'"]');
  await first.click();const one=await shown();
  check('칩을 누르면 개수가 줄고 이름표가 생김',one<whole&&await first.getAttribute('aria-pressed')==='true'&&await page.locator('.filter-tag[data-filter="'+firstKey+'"]').count()===1);
  await second.click();const two=await shown();
  check('칩 여러 개를 함께 켜면 합쳐서 보여줌',two>one&&two<=whole&&await page.locator('.chip[aria-pressed="true"]').count()===2);
  await page.reload();
  check('켠 칩과 개수 새로고침 유지',await shown()===two&&await page.locator('.chip[aria-pressed="true"]').count()===2);
  await page.locator('[data-action="clear-filters"]').first().click();
  check('모두 지우기로 전부 복귀',await shown()===whole&&await page.locator('.chip[aria-pressed="true"]').count()===0&&await page.locator('.filter-tag').count()===0);
  await first.focus();await page.keyboard.press('Space');
  check('키보드 스페이스로 칩 켜기',await shown()===one&&await page.locator('.chip[aria-pressed="true"]').count()===1);
  await page.keyboard.press('Enter');
  check('키보드 엔터로 칩 끄기, 초점은 칩에 남음',await shown()===whole&&await page.evaluate(()=>document.activeElement.classList.contains('chip')));
  await page.locator('[data-focus="menu-code"]').focus();await page.keyboard.press('Enter');
  check('분류는 자기 검색이 있는 체크 목록으로 열림',await page.locator('#facet-code:popover-open .facet-search').count()===1);
  await page.locator('#facet-code .facet-search').fill('아이콘');
  check('분류 목록 안에서 찾기',await page.locator('#facet-code .facet-option:not([hidden])').count()>=1&&await page.locator('#facet-code .facet-option:not([hidden])').count()<await page.locator('#facet-code .facet-option').count());
  await page.locator('#facet-code [data-filter-check="code"][value="ICO"]').check();
  check('아이콘을 고르면 안쪽 분류가 목록에 열리고 목록은 열린 채',await page.locator('#facet-code:popover-open').count()===1&&await page.locator('#facet-code .facet-option.is-nested').count()===data.iconGroups.length&&await page.locator('[data-focus="menu-code"] .chip-num').textContent()==='1');
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
    check(width+' 모바일 분류 목록이 화면 안에 열리고 고른 분류가 이름표로',await page.locator('#facet-code').evaluate(p=>{const r=p.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;})&&await page.locator('.filter-tag[data-filter="code:TOK"]').count()===1);
    await page.keyboard.press('Escape');
    await goto('system?detail=button');await page.evaluate(()=>document.fonts.ready);
    check(width+' 부품 화면에서 지금 부품 칩이 필터 줄 안에 보임',await page.evaluate(()=>{const row=document.querySelector('#filter-bar .filter-scroll'),c=row.querySelector('[aria-current="page"]').getBoundingClientRect(),b=row.getBoundingClientRect();return c.left>=b.left&&c.right<=b.right;}));
   }
  }
  check('브라우저 오류 없음',errors.length===0);
  fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({checks,errors},null,2));
  console.log(checks.length+' library checks passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

