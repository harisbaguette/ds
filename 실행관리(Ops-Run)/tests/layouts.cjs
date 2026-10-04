const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {chromium,firefox,webkit}=require('playwright-core');
(async()=>{
 const {root,system,exportSources,coverage}=await import('../scripts/lib/system-store.mjs');
 const items=system().systemRegistry.items.filter(i=>i.layoutMode);
 assert(items.length>=37);
 const out=fs.mkdtempSync(path.join(root,'test-results/layouts-'));
 exportSources({ids:items.map(i=>i.id),environment:'html',out:path.join(out,'html')});
 let checks=0;
 for(const [engine,type]of Object.entries({chromium,firefox,webkit})){
  const browser=await type.launch({headless:true});
  try{
   const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   for(const width of [320,760,1440]){
    await page.setViewportSize({width,height:900});
    for(const item of items){
     await page.goto(pathToFileURL(path.join(out,'html/design/examples/main',item.id+'.html')).href);
     await page.evaluate(()=>document.fonts.ready);
     const geometry=await page.locator('.ds-layout').evaluate(n=>({width:n.getBoundingClientRect().width,overflow:document.documentElement.scrollWidth>innerWidth+1,display:getComputedStyle(n).display}));
     assert(!geometry.overflow,`${engine}/${width}/${item.id}: page overflows`);
     if(item.id!=='toolbar-spacer')assert(geometry.width>0,`${item.id}: no layout`);
     if(['reel-layout','scroll-area','scroll-fog'].includes(item.id)){
      const region=page.getByRole('region');await region.focus();
      await page.keyboard.press(item.id==='reel-layout'?'ArrowRight':'PageDown');
      await page.waitForFunction(()=>{const n=document.querySelector('[role=region]');return n.scrollLeft>0||n.scrollTop>0||n.scrollHeight===n.clientHeight&&n.scrollWidth===n.clientWidth;});
     }
     checks++;
    }
   }
   await page.goto(pathToFileURL(path.join(out,'html/design/examples/main/print-layout.html')).href);
   await page.emulateMedia({media:'print'});assert(!(await page.locator('.ds-layout-no-print').isVisible()));
   assert.equal(await page.locator('.ds-layout-page-break').evaluate(n=>getComputedStyle(n).breakBefore),'page');
   if(engine==='chromium')await page.pdf({path:path.join(out,'print.pdf'),format:'A4'});
   await page.emulateMedia({media:'screen'});
   await page.setViewportSize({width:1440,height:900});
   await page.goto(pathToFileURL(path.join(out,'html/design/examples/main/bento-layout.html')).href);
   const wide=await page.locator('.ds-bento-layout > *').evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().width));assert(wide[0]>wide[1]*1.5,'Bento featured content must span two columns');
   await page.locator('main').evaluate(n=>n.style.width='520px');
   const narrow=await page.locator('.ds-bento-layout > *').evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().width));assert(narrow.every(w=>w>=500),'Nested layouts must respond to available container width');
   await page.goto(pathToFileURL(path.join(out,'html/design/examples/main/equal-height-grid.html')).href);
   const heights=await page.locator('.ds-layout > *').evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().height));
   assert(Math.max(...heights)-Math.min(...heights)<1);
   assert.deepEqual(errors,[]);
   console.log(engine+': layout geometry, scrolling and print passed');
  }finally{await browser.close();}
 }
 const c=coverage();assert.equal(c.categories.find(c=>c.id==='LAY').states['not-implemented']||0,0,'Every LAY implementation must remain reachable');for(const item of items)assert.equal(c.records.find(r=>r.id===item.entry).implementation,item.id);
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks,implementations:items.length,passed:true},null,2));
 console.log(checks+' independent HTML layout checks passed');
})().catch(e=>{console.error(e);process.exitCode=1;});
