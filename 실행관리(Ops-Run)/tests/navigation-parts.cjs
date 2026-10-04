const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {chromium,firefox,webkit}=require('playwright-core');
(async()=>{
 const {root,system,exportSources}=await import('../scripts/lib/system-store.mjs');
 const items=system().systemRegistry.items.filter(i=>i.navigationMode),out=fs.mkdtempSync(path.join(root,'test-results/navigation-parts-'));
 exportSources({ids:items.map(i=>i.id),environment:'html',out:path.join(out,'html')});
 for(const [name,type]of Object.entries({chromium,firefox,webkit})){
  const browser=await type.launch();try{
   const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   const open=async id=>{await page.goto(pathToFileURL(path.join(out,'html/design/examples/main',id+'.html')).href);return page.locator('main');};
   for(const width of [320,760,1440]){
    await page.setViewportSize({width,height:900});
    for(const item of items){
     const n=await open(item.id);await page.evaluate(()=>document.fonts.ready);
     assert.equal(await n.locator('.ds-nav').count(),1,item.id+' has an exported root');
     assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+'/'+width+'/'+item.id+' overflows');
    }
   }
   await page.setViewportSize({width:1100,height:900});
   for(const id of ['mega-menu','hamburger-menu','app-switcher','multi-toggle-navigation','breadcrumb-dropdown','journey-navigation']){
    const n=await open(id),summary=n.locator('summary').first();await summary.click();const details=n.locator('details').first();assert(await details.evaluate(n=>n.open));await summary.press('Escape');assert(!(await details.evaluate(n=>n.open)));assert(await summary.evaluate(n=>n===document.activeElement));
   }
   for(const id of ['skip-link','back-to-top','footer-anchor','table-of-contents','in-page-navigation','alphabet-index']){
    const n=await open(id),jump=n.locator('[data-nav-target]').first(),target=await jump.getAttribute('data-nav-target');await jump.click();assert.equal(await page.evaluate(()=>document.activeElement.id),target,id+' must focus its destination');
   }
   for(const id of ['navigation-drawer','fullscreen-navigation']){
    const n=await open(id),trigger=n.getByRole('button',{name:'메뉴 열기'});await trigger.click();assert(await n.getByRole('dialog').isVisible());await page.keyboard.press('Escape');assert(await trigger.evaluate(n=>n===document.activeElement));
   }
   const pagination=await open('responsive-pagination');await pagination.getByRole('button',{name:'5쪽',exact:true}).count();await pagination.getByRole('button',{name:'다음',exact:true}).click();assert.equal(await pagination.locator('output').textContent(),'2 / 8');await pagination.getByRole('button',{name:'8쪽',exact:true}).click();assert(await pagination.getByRole('button',{name:'다음',exact:true}).isDisabled());
   await page.setViewportSize({width:320,height:900});await pagination.locator('.ds-nav-pages').waitFor({state:'hidden'});assert.equal(await pagination.getByRole('button',{name:/쪽$/}).count(),0);await pagination.getByRole('button',{name:'이전',exact:true}).click();assert.equal(await pagination.locator('output').textContent(),'7 / 8');
   const conditional=await open('conditional-pagination');await conditional.locator('summary').click();await conditional.getByRole('button',{name:'3쪽',exact:true}).click();assert.equal(await conditional.locator('output').textContent(),'3 / 8');assert(await conditional.getByRole('button',{name:'3쪽',exact:true}).evaluate(n=>n===document.activeElement));await conditional.getByRole('button',{name:'3쪽',exact:true}).press('Escape');assert(!(await conditional.locator('details').evaluate(n=>n.open)));
   const select=await open('select-navigation');await select.locator('select').selectOption('#notes');assert(!page.url().endsWith('#notes'));await select.getByRole('button',{name:'이동',exact:true}).click();assert(page.url().endsWith('#notes'));
   const compact=await open('compact-breadcrumb');assert.equal(await compact.getByRole('link').count(),1);assert.equal(await compact.getByRole('link').textContent(),'산책');
   const back=await open('breadcrumb-back');assert(await back.getByRole('link',{name:'이전: 산책'}).isVisible());
   assert.deepEqual(errors,[]);console.log(name+': '+items.length+' navigation exports, responsive behavior, keyboard and target focus passed');
  }finally{await browser.close();}
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
