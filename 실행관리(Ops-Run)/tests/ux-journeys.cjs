const {chromium,firefox,webkit}=require('playwright-core');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.PATTOVE_TEST_URL||'http://127.0.0.1:4173/';
const out=path.resolve('test-results/ux-journeys');fs.mkdirSync(out,{recursive:true});
let count=0;const ok=(condition,label)=>{assert.ok(condition,label);count++;};
(async()=>{for(const [name,engine] of Object.entries({chromium,firefox,webkit})){
 const browser=await engine.launch();try{
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await context.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.lastCopy=value;}}}));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(8000);
 const go=async route=>{await page.goto(base+'#/'+route);await page.locator('#main').waitFor();};
 await go('system?detail=page');
 const heights=[];
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:844});
  await page.locator('button[data-gallery-view="compare"]').click();
  await page.waitForFunction(()=>[...document.querySelectorAll('.variant-grid .variant-frame')].every(n=>{const r=n.getBoundingClientRect();return Math.abs(r.width-r.height)<1.5;}));
  const compact=await page.locator('.variant-grid').boundingBox();
  ok(await page.locator('.variant-grid .variant-frame').evaluateAll(ns=>ns.every(n=>{const r=n.getBoundingClientRect();return Math.abs(r.width-r.height)<1.5;})),name+' all square '+width);
  if(width<=390){const boxes=await page.locator('.variant-card').evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().top));ok(boxes[0]===boxes[1],name+' side by side '+width);}
  await page.locator('button[data-gallery-view="large"]').click();
  const large=await page.locator('.variant-grid').boundingBox();if(width<=390)ok(compact.height<large.height*.65,name+' comparison reduces scroll '+width);
  heights.push({width,compact:Math.round(compact.height),large:Math.round(large.height)});
  await page.locator('button[data-gallery-view="compare"]').click();
  ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+' no overflow '+width);
 }
 await page.setViewportSize({width:390,height:844});
 const second=page.locator('.variant-card').nth(1),shape=await second.getAttribute('data-variant-card');
 await second.locator('[data-variant-pick]').click();
 ok(await second.locator('[data-variant-pick]').getAttribute('aria-pressed')==='true',name+' one action saves default');
 ok(await page.locator('[data-action="save-variant"]').count()===0,name+' no second save step');
 await page.reload();ok(await second.locator('[data-variant-pick]').getAttribute('aria-pressed')==='true',name+' default persists');
 const copy=page.locator('.variant-card').nth(2).locator('[data-copy-reference]'),id=await copy.getAttribute('data-copy-reference');
 await copy.click();await page.waitForFunction(id=>window.lastCopy?.includes('"id": "'+id+'"'),id);
 ok(await second.locator('[data-variant-pick]').getAttribute('aria-pressed')==='true',name+' copy does not change default');
 const opener=page.locator('.variant-enlarge').nth(2);await opener.focus();const y=await page.evaluate(()=>scrollY);
 await page.keyboard.press('Enter');await page.locator('#variant-dialog').waitFor({state:'visible'});
 await page.waitForFunction(()=>document.querySelector('#variant-dialog .variant-phone').getBoundingClientRect().width>250);
 ok(await page.locator('#variant-dialog .variant-phone').evaluate(n=>{const r=n.getBoundingClientRect(),s=n.closest('.variant-frame').getBoundingClientRect();return r.left>=s.left-1&&r.right<=s.right+1&&r.bottom<=s.bottom+1;}),name+' enlarged phone is readable and fits');
 ok(await page.locator('#variant-dialog [data-copy-reference]').getAttribute('data-copy-reference')===id,name+' enlarged copy exact');
 await page.locator('[data-preview-step="1"]').click();const nextID=await page.locator('#variant-dialog [data-copy-reference]').getAttribute('data-copy-reference');
 ok(nextID!==id,name+' next preview without closing');await page.locator('#variant-dialog [data-copy-reference]').click();
 await page.waitForFunction(id=>window.lastCopy?.includes('"id": "'+id+'"'),nextID);
 await page.keyboard.press('Escape');await page.waitForFunction(()=>document.activeElement?.classList.contains('variant-enlarge'));
 ok(Math.abs((await page.evaluate(()=>scrollY))-y)<2,name+' enlarged closes to original scroll');
 ok(await second.locator('[data-variant-pick]').getAttribute('aria-pressed')==='true',name+' preview never changes saved default');
 // Recently copied exact shapes can be copied again with no query or detail visit.
 await page.locator('#search-open').click();
 ok(await page.locator('#search-suggestions h2').first().innerText().then(x=>x.includes('최근 복사')),name+' recent copies appear immediately');
 await page.locator('#search-dialog [data-copy-reference]').first().click();
 await page.waitForFunction(id=>window.lastCopy?.includes('"id": "'+id+'"'),nextID);
 const recentOpen=page.locator('#search-dialog [data-suggest-open]').first();await recentOpen.click();
 await page.waitForFunction(()=>!document.querySelector('#search-dialog').open);
 ok(page.url().includes('detail=page'),name+' exact recent shape opens detail');
 // Back from an item opened in search returns to the page the search was opened from, like a card: search closed, focus on the search button.
 await page.locator('[data-action="back-to-list"]:visible').click();await page.waitForFunction(()=>!document.querySelector('#search-dialog').open&&document.activeElement?.id==='search-open');
 ok(page.url().includes('detail=page'),name+' back returns to where search was opened');
 // A user in the wrong category can find an item without learning the taxonomy.
 // Search covers every menu by default, so the wrong tab is no dead end.
 await go('dictionary?shelf=token');await page.locator('#search-open').click();await page.locator('#query').fill('체크박스');
 ok(await page.locator('[data-search-scope="all"]').getAttribute('aria-pressed')==='true'&&await page.locator('[data-suggest-open="checkbox"]').count()===1,name+' wrong shelf still finds the part');
 await page.locator('[data-suggest-open="checkbox"]').click();await page.waitForURL(/detail=checkbox/);
 await page.locator('[data-action="back-to-list"]:visible').click();await page.waitForFunction(()=>!document.querySelector('#search-dialog').open&&document.activeElement?.id==='search-open');
 ok(page.url().includes('shelf=token'),name+' cross-category back returns to the tab it came from');
 await page.locator('#search-open').click();await page.locator('#query').fill('홈');
 ok(await page.locator('[data-suggest-open="ICO-01"]').count()===1,name+' all finds icon from token tab');
 await page.locator('[data-suggest-open="ICO-01"]').click();await page.locator('#detail-dialog').waitFor({state:'visible'});
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('#search-dialog').open&&document.activeElement?.id==='search-open');
 ok(!await page.locator('#detail-dialog').evaluate(d=>d.open),name+' closing the icon returns to the list');
 await page.locator('#search-open').click();await page.locator('#query').fill('button/variant/outline');await page.keyboard.press('Enter');await page.waitForURL(/detail=button/);
 ok(page.url().includes('option-variant=outline'),name+' exact shape ID preserves target');
 await page.locator('[data-action="back-to-list"]:visible').click();await page.waitForFunction(()=>!document.querySelector('#search-dialog').open&&document.activeElement?.id==='search-open');
 // CSS variables participate in the same recent-copy workflow.
 await go('system?detail=token-text');await page.locator('[data-token-copy]').first().click();
 await page.locator('#search-open').click();const variable=page.locator('[data-recent-value]').first();
 ok(await variable.count()===1,name+' recent CSS variable available');await variable.click();
 ok(await page.evaluate(()=>window.lastCopy==='var(--p-text-sm)'),name+' recent CSS variable copies exact value');
 await page.keyboard.press('Escape');await page.locator('[data-token-copy]').nth(1).click();await page.locator('#search-open').click();
 const earlierVariable=page.locator('[data-suggest-open="token-text::var(--p-text-sm)"]');
 await earlierVariable.click();await page.waitForFunction(()=>document.activeElement?.dataset.tokenCopy==='--p-text-sm');
 await page.locator('[data-action="back-to-list"]:visible').click();await page.waitForFunction(()=>!document.querySelector('#search-dialog').open&&document.activeElement?.id==='search-open');
 await page.locator('#search-open').click();
 ok(await earlierVariable.count()===1,name+' multiple recent variables kept as separate rows');
 await page.locator('[data-action="clear-recent"]').click();ok(await page.locator('#search-idle').isVisible(),name+' recent record can be cleared');
 await page.keyboard.press('Escape');await page.keyboard.press('Control+k');ok(await page.locator('#search-dialog').isVisible(),name+' standard keyboard shortcut');
 const beforeEmpty=page.url();await page.locator('#query').press('Enter');ok(page.url()===beforeEmpty&&await page.locator('#search-dialog').isVisible(),name+' empty submit keeps current page');
 await page.locator('#query').fill('버튼');await page.keyboard.press('Control+k');ok(await page.locator('#query').inputValue()==='버튼',name+' shortcut preserves active query');
 await page.keyboard.press('Escape');
 await go('system?detail=token-color');await page.locator('[data-color-mode="hex"]').click();await page.locator('[data-color-copy]').first().click();
 const hex=await page.evaluate(()=>window.lastCopy);await page.locator('#search-open').click();await page.locator('[data-recent-value]').first().click();
 ok(await page.evaluate(()=>window.lastCopy)===hex,name+' recent HEX preserves exact color');await page.keyboard.press('Escape');
 await go('motion');await page.locator('[data-motion-target]').selectOption('react');await page.locator('[data-motion-copy]').first().click();
 await page.locator('[data-motion-target]').selectOption('html');await page.locator('#search-open').click();await page.locator('#search-dialog [data-copy-reference]').first().click();
 ok(await page.evaluate(()=>JSON.parse(window.lastCopy.slice(window.lastCopy.indexOf('{'))).target)==='React',name+' recent motion retains copied environment');
 await page.locator('[data-search-scope="all"]').click();await page.locator('#query').fill('ICO-');
 const countBefore=await page.locator('.search-suggestion:visible').count();await page.locator('[data-search-more]:visible').first().click();
 ok(await page.locator('.search-suggestion:visible').count()>countBefore,name+' more reveals additional results in place');
 ok(await page.locator('.search-suggestion:focus').evaluate(n=>{const row=n.getBoundingClientRect(),list=document.getElementById('search-suggestions').getBoundingClientRect();return row.top>=list.top-1&&row.bottom<=list.bottom+1;}),name+' expanded result receives visible focus');
 await page.keyboard.press('Escape');
 ok(errors.length===0,name+' no runtime errors '+errors.join(';'));
 fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify({heights,errors},null,2));console.log(name+' journeys passed '+JSON.stringify(heights));
 }finally{await browser.close();}
 }console.log(count+' UX journey checks passed');})().catch(e=>{console.error(e);process.exitCode=1;});
