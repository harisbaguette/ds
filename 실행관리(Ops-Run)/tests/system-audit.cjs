const { chromium, firefox, webkit } = require('playwright-core');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname,'..');
const origin = 'http://127.0.0.1:4173/';
const fileURL = pathToFileURL(path.join(root,'index.html')).href;
const out = path.join(root,'test-results/system-audit');
fs.mkdirSync(out,{recursive:true});
const checks = [], failures = [], errors = [];
const check = (name, value, detail) => { checks.push({name,pass:!!value}); if(!value) failures.push({name,detail}); };
const integrity = root => {
  const all=[root,...root.querySelectorAll('*')],ids=all.filter(n=>n.id).map(n=>n.id),bad=[];
  if(new Set(ids).size!==ids.length)bad.push('duplicate-id');
  all.forEach(n=>{
    for(const attr of ['for','aria-controls','aria-labelledby','aria-describedby']) if(n.hasAttribute(attr)) for(const id of n.getAttribute(attr).split(/\s+/)) if(!all.some(el=>el.id===id)) bad.push(attr+':'+id);
    if(n.matches('button')&&!((n.getAttribute('aria-label')||n.textContent).trim()))bad.push('unnamed-button');
    if(n.matches('input,select')&&!n.labels?.length&&!n.getAttribute('aria-label'))bad.push('unnamed-input');
  });return bad;
};
async function route(page,style,id='') {
  await page.goto(origin+'#/system?style='+style+(id?'&detail='+id:''));
  await page.locator('.system-inspector').waitFor();
  await page.evaluate(()=>document.fonts.ready);
}
async function run() {
  const browser=await chromium.launch({headless:true});
  try {
    const context=await browser.newContext({viewport:{width:1440,height:1000}});
    const page=await context.newPage();
    page.setDefaultTimeout(7000);page.on('pageerror',e=>errors.push(e.message));
    await route(page,'main');
    const metadata=await page.evaluate(()=>({styles:Pattove.catalog.styles.filter(s=>s.id!=='base').map(s=>s.id),items:Pattove.systemRegistry.items}));
    // Every implementation, every style: do not substitute button-only coverage.
    for(const style of metadata.styles) {
      for(const item of metadata.items) {
        await route(page,style,item.id);
        check(style+'/'+item.id+' preview relationships', (await page.locator('.part-demo > .ds').evaluate(integrity)).length===0);
      }
      console.log(style+': 18 implementations checked');
    }
    // Every declared variant must be selectable, serializable and deep-linkable.
    for(const item of metadata.items) for(const control of item.controls) for(const [value] of control.values) {
      await route(page,'main',item.id);
      const card=item.gallery?.key===control.key, picked=()=>card?page.locator('[data-variant-pick="'+value+'"]').getAttribute('aria-pressed').then(v=>v==='true'?value:null):page.locator('[data-part-option="'+control.key+'"]').inputValue();
      if(card) await page.locator('[data-variant-pick="'+value+'"]').click(); else await page.locator('[data-part-option="'+control.key+'"]').selectOption(value);
      const stateBefore=await page.locator('.part-demo > .ds').evaluate(integrity);
      check(item.id+'/'+control.key+'/'+value+' accessible variant',stateBefore.length===0,stateBefore);
      const href=page.url();await page.reload();
      check(item.id+'/'+control.key+'/'+value+' reload restores variant', await picked()===value && page.url()===href);
    }
    await route(page,'main','search-module');
    const demo=page.locator('.part-demo');
    await demo.locator('[data-result] button').first().click();await demo.locator('[data-part-action="save-record"]').click();await demo.locator('[data-part-action="close-record"]').click();await demo.locator('[data-result] button').first().click();
    check('record keeps saved state when reopened',await demo.locator('[data-part-action="save-record"]').getAttribute('aria-pressed')==='true');
    await demo.locator('[data-part-action="save-record"]').click();await demo.locator('[data-part-action="close-record"]').click();await demo.locator('[data-result] button').first().click();
    check('record keeps unsaved state when reopened',await demo.locator('[data-part-action="save-record"]').getAttribute('aria-pressed')==='false');
    // Two runtimes mounting an existing document must not duplicate actions.
    await route(page,'main','card');await page.evaluate(()=>{Pattove.mountParts(document);Pattove.mountParts(document);});
    await page.locator('.part-demo .ds-card button').click();check('repeated mount does not double toggle',await page.locator('.part-demo .ds-card').getAttribute('data-selected')==='true');
    await context.close();
  } finally {await browser.close();}
  for(const [name,engine] of [['Firefox',firefox],['WebKit',webkit]]) {
    const browser=await engine.launch({headless:true});
    try {
      const page=await browser.newPage();page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(name+': '+e.message));
      for(const width of [320,375,768,1440,1920]) for(const style of ['main']) {
        await page.setViewportSize({width,height:900});await route(page,style);
        check(name+'/'+width+'/'+style+' single part layout',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)&&await page.locator('.component-page').count()===1&&await page.locator('.specimen').count()===0);
      }
      for(const id of ['field','checkbox','radio','switch','tabs','bottom-nav','card','search-module','page']) {
        await route(page,'main',id);
        check(name+'/'+id+' valid relationships',(await page.locator('.part-demo > .ds').evaluate(integrity)).length===0);
        if(id==='tabs') {await page.locator('.part-demo [role="tab"]').first().focus();await page.keyboard.press('ArrowRight');check(name+' keyboard tabs',await page.locator('.part-demo [role="tab"]').nth(1).getAttribute('aria-selected')==='true');}
        if(id==='checkbox'||id==='switch') {await page.locator('.part-demo input').uncheck();check(name+' '+id+' toggles',!await page.locator('.part-demo input').isChecked());}
        if(id==='search-module'||id==='page') {await page.locator('.part-demo [name="query"]').fill('없는결과');await page.locator('.part-demo [type="submit"]').click();check(name+' '+id+' empty recovery',await page.locator('.part-demo .ds-empty').isVisible());await page.locator('.part-demo [data-part-action="reset-search"]').click();check(name+' '+id+' recovered',await page.locator('.part-demo [data-result]:visible').count()===3);}
      }
      await page.goto(fileURL+'#/system?style=main&detail=button');check(name+' file execution',await page.locator('.part-demo .ds-button').count()>=1);
      await page.screenshot({path:path.join(out,name+'-mobile.png')});console.log(name+': responsive controls checked');
    } finally {await browser.close();}
  }
}
run().catch(error=>{failures.push({name:'audit interrupted',detail:error.stack});}).finally(()=>{
  check('no browser execution errors',errors.length===0,errors);
  const result={checkedAt:new Date().toISOString(),checks,failures,errors};fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify({checks:checks.length,failures:failures.length,examples:failures.slice(0,12)},null,2));
  if(failures.length)process.exitCode=1;
});
