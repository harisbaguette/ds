const {chromium,firefox,webkit}=require('playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const base=process.env.PATTOVE_TEST_URL||'http://127.0.0.1:4173/';
const out=path.resolve(__dirname,'../test-results/frontend-polish');fs.mkdirSync(out,{recursive:true});
let checks=0;const check=(value,label)=>{assert.ok(value,label);checks++;};
(async()=>{
 for(const [name,engine] of Object.entries({chromium,firefox,webkit})) {
  const browser=await engine.launch();
  try {
   const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
   await context.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.lastCopy=text;}}}));
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(8000);
   const go=async route=>{await page.goto(base+'#/'+route);await page.locator('#page-title').waitFor({state:'attached'});};
   await go('styles');
   check(await page.locator('#main').evaluate(n=>getComputedStyle(n).outlineStyle)==='none',name+' no programmatic focus border');
   await page.locator('.style-card a').focus();
   await page.keyboard.press('Enter');await page.locator('.style-page').waitFor();
   check(await page.locator('.style-in-use').innerText()==='사용 중',name+' explicit current style');
   check((await page.locator('.overview-preview').first().boundingBox()).y<270,name+' style preview in first screen');
   check(!await page.locator('#catalog-toolbar').isVisible(),name+' no duplicated mobile style navigation');
   await page.locator('[data-action="back-to-styles"]:visible').click();
   await page.waitForFunction(()=>document.activeElement?.dataset.focus==='style-card-main');
   check(page.url().endsWith('#/styles'),name+' style returns to original list and focus');
   await go('system?detail=page');
   check((await page.locator('.variant-frame').first().boundingBox()).y<300,name+' comparison controls and previews within first screen');
   check(await page.locator('.variant-card .reference-identity').evaluateAll(ns=>ns.every(n=>n.getBoundingClientRect().width<=1&&getComputedStyle(n).clipPath!=='none')),name+' shape identifiers not foregrounded');
   const second=page.locator('.variant-card').nth(1),id=await second.locator('[data-copy-reference]').getAttribute('data-copy-reference');
   await second.locator('[data-copy-reference]').click();await page.waitForFunction(id=>window.lastCopy?.includes(id),id);
   const payload=await page.evaluate(()=>JSON.parse(window.lastCopy.slice(window.lastCopy.indexOf('{'))));
   check(payload.id===id,name+' template copies exact shape');
   check(await page.locator('[data-variant-pick][aria-pressed="true"]').count()===1&&await second.locator('[data-variant-pick]').getAttribute('aria-pressed')==='false',name+' copying does not change selection');
   // The shape name is plain text; only the small named button sets the default, and the notice offers 되돌리기.
   check(await second.locator('.variant-pick-name').evaluate(n=>!n.closest('button')),name+' shape name is not a button');
   await second.locator('[data-variant-pick]').click();
   check(await second.locator('[data-variant-pick]').getAttribute('aria-pressed')==='true'&&await page.locator('[data-variant-undo]').isVisible(),name+' selection still available with undo');
   await go('system?detail=token-text');
   const families=await page.evaluate(()=>Pattove.systemRegistry.items.filter(x=>x.id.startsWith('token-')&&x.id!=='token-color').map(x=>x.id));
   for(const family of families) {
    await go('system?detail='+family);
    const buttons=page.locator('[data-token-copy]');check(await buttons.count()>0,name+' '+family+' has row copies');
    const button=buttons.first(),role=await button.getAttribute('data-token-copy');
    await button.click();await page.waitForFunction(role=>window.lastCopy==='var('+role+')',role);
    check(await button.getAttribute('data-copied')!==null,name+' '+family+' confirms exact CSS variable');
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+' '+family+' reflows');
   }
   await go('system?detail=token-text');
   await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw Error('blocked');};});
   await page.locator('[data-token-copy]').first().click();await page.locator('#reference-dialog').waitFor({state:'visible'});
   check(await page.locator('#reference-dialog textarea').evaluate(n=>n.value==='var(--p-text-sm)'&&n.selectionEnd===n.value.length),name+' row copy fallback exact and selected');
   await page.keyboard.press('Escape');
   await page.waitForFunction(()=>document.querySelector('[data-token-copy]')===document.activeElement);
   await page.waitForFunction(el=>el===document.activeElement,await page.locator('[data-token-copy]').first().elementHandle(),{timeout:3000}).catch(()=>{});
   check(await page.locator('[data-token-copy]').first().evaluate(n=>n===document.activeElement),name+' row copy fallback restores focus');
   // A delayed permission failure must not interrupt the next page.
   await page.evaluate(()=>{navigator.clipboard.writeText=()=>new Promise((_,reject)=>window.rejectCopy=reject);});
   await page.locator('[data-token-copy]').first().click();await page.locator('[data-focus="tab-part"]').click();
   await page.evaluate(()=>window.rejectCopy(Error('late denial')));
   check(!await page.locator('#reference-dialog').isVisible(),name+' detached copy does not open stale dialog');
   const long='아주긴검색어'.repeat(16);
   await go('dictionary?shelf=part&group=buttons&q='+encodeURIComponent(long));
   check((await page.locator('#query-chip').boundingBox()).height<=52,name+' long query remains one row');
   check(await page.locator('.empty-state .empty-generated').count()===0,name+' empty state omits decorative clutter');
   await page.locator('.empty-state [data-action="clear-query"]').click();
   check(!page.url().includes('q=')&&page.url().includes('group=buttons')&&await page.locator('.dict-entry').count()>0,name+' empty recovery preserves category');
   await go('motion?sources=1&q=zzzz');
   await page.locator('.empty-state button').click();
   check(await page.locator('.motion-source').count()===8&&page.url().includes('sources=1'),name+' source search recovers in current section');
   // Reproduce a missing local image, then recover the same asset without closing the detail.
   let deny=true;
   await context.route('**/assets/icons/illustrated/home*',route=>deny?route.abort():route.continue());
   await go('dictionary?shelf=icon');
   await page.locator('[data-illustration-id="ICO-01"] .image-fallback').waitFor();
   const frameBefore=await page.locator('[data-illustration-id="ICO-01"] .dict-thumb').boundingBox();
   await page.locator('[data-library-entry="ICO-01"]').click();await page.locator('[data-retry-image]').waitFor();
   const frame=await page.locator('.icon-detail-preview').boundingBox();
   await page.locator('[data-retry-image]').click();
   await page.waitForFunction(()=>!document.querySelector('[data-retry-image]').hasAttribute('aria-busy'));
   check((await page.locator('.image-fallback').last().textContent()).includes('못했어요'),name+' failed retry remains recoverable');
   deny=false;await page.locator('[data-retry-image]').focus();await page.keyboard.press('Enter');
   await page.waitForFunction(()=>!document.querySelector('.icon-detail-preview').classList.contains('has-image-error'));
   const restored=await page.locator('.icon-detail-preview').boundingBox();
   check(frame.width===restored.width&&frame.height===restored.height&&Math.abs(frameBefore.width-frameBefore.height)<1,name+' failed image preserves square layout');
   check(await page.locator('[data-icon-download]').evaluate(n=>n===document.activeElement),name+' recovered image keeps useful keyboard focus');
   await page.locator('[data-action="close-dialog"]').click();
   for(const viewport of [{width:320,height:844},{width:667,height:320},{width:375,height:280},{width:1440,height:900}]) {
    await page.setViewportSize(viewport);await go('dictionary?shelf=part');
    await page.locator('#search-open').click();await page.locator('#query').fill('버튼');
    const count=await page.locator('.search-suggestion:visible').count();
    for(let i=0;i<count;i++)await page.keyboard.press('ArrowDown');
    check(await page.locator('.search-suggestion:focus').evaluate(n=>{const r=n.getBoundingClientRect(),s=document.querySelector('#search-suggestions').getBoundingClientRect();return r.top>=s.top-1&&r.bottom<=s.bottom+1;}),name+' focused search result visible at '+viewport.width+'×'+viewport.height);
    await page.keyboard.press('Escape');check(await page.locator('#search-open').evaluate(n=>n===document.activeElement),name+' search dismissal restores focus');
   }
   check(!errors.length,name+' no script errors '+errors.join(';'));
   console.log(name+' frontend polish passed');
  } finally {await browser.close();}
 }
 console.log(checks+' frontend polish checks passed');
})().catch(e=>{console.error(e);process.exitCode=1;});
