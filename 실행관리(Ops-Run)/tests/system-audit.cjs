const { chromium, firefox, webkit } = require('playwright-core');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname,'..');
const origin = 'http://127.0.0.1:4173/';
const fileURL = pathToFileURL(path.join(root,'index.html')).href;
const out = path.join(root,'test-results/system-audit');
fs.mkdirSync(out,{recursive:true});
// The part page shows still pictures only, so a part's own behaviour is pressed on a stage built from the same renderer.
const stage = async (page, id, options = {}) => {
  await page.evaluate(([id, options]) => {
    document.querySelector('#test-stage')?.remove();
    const node = document.createElement('div');
    node.id = 'test-stage'; node.className = 'part-demo ds theme-main'; node.dataset.style = 'main';
    node.innerHTML = Pattove.parts.renderItem(id, 'stage', Pattove.systemRegistry.normalizeOptions(id, options));
    document.querySelector('main').append(node);
    Pattove.mountParts(document);
  }, [id, options]);
  return page.locator('#test-stage');
};
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
  await page.locator('.component-page'+(id?'[data-component="'+id+'"]':'')).waitFor();
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
        check(style+'/'+item.id+' preview relationships', (await page.locator('.component-page').evaluate(integrity)).length===0);
      }
      console.log(style+': '+metadata.items.length+' implementations checked');
    }
    // Every shape on the grid can be picked and stays picked after a reload; every other declared variant still renders with sound relationships.
    for(const item of metadata.items) for(const control of item.controls) for(const [value] of control.values) {
      await route(page,'main',item.id);
      if(item.gallery?.key===control.key) {
        const picked=()=>page.locator('[data-variant-pick="'+value+'"]').getAttribute('aria-pressed');
        await page.locator('[data-variant-pick="'+value+'"]').click();
        const stateBefore=await page.locator('.component-page').evaluate(integrity);
        check(item.id+'/'+control.key+'/'+value+' accessible variant',stateBefore.length===0,stateBefore);
        const href=page.url();await page.reload();await page.locator('.variant-card').first().waitFor();
        check(item.id+'/'+control.key+'/'+value+' reload keeps the picked shape', await picked()==='true' && page.url()===href);
      } else {
        const stateBefore=await (await stage(page,item.id,{[control.key]:value})).evaluate(integrity);
        check(item.id+'/'+control.key+'/'+value+' accessible variant',stateBefore.length===0,stateBefore);
      }
    }
    await page.evaluate(()=>localStorage.removeItem('pattove-part-choice'));
    await route(page,'main','page');
    const demo=await stage(page,'page');
    await demo.locator('[data-result] button').first().click();await demo.locator('[data-part-action="save-record"]').click();await demo.locator('[data-part-action="close-record"]').click();await demo.locator('[data-result] button').first().click();
    check('record keeps saved state when reopened',await demo.locator('[data-part-action="save-record"]').getAttribute('aria-pressed')==='true');
    await demo.locator('[data-part-action="save-record"]').click();await demo.locator('[data-part-action="close-record"]').click();await demo.locator('[data-result] button').first().click();
    check('record keeps unsaved state when reopened',await demo.locator('[data-part-action="save-record"]').getAttribute('aria-pressed')==='false');
    // Two runtimes mounting an existing document must not duplicate actions.
    await route(page,'main','card');await stage(page,'card');await page.evaluate(()=>{Pattove.mountParts(document);Pattove.mountParts(document);});
    await page.locator('#test-stage .ds-card button').click();check('repeated mount does not double toggle',await page.locator('#test-stage .ds-card').getAttribute('data-selected')==='true');
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
      for(const id of ['field','checkbox','radio','switch','tabs','bottom-nav','card','people-picker','page']) {
        await route(page,'main',id);
        check(name+'/'+id+' valid relationships',(await page.locator('.component-page').evaluate(integrity)).length===0);
        await stage(page,id);
        if(id==='tabs') {await page.locator('#test-stage [role="tab"]').first().focus();await page.keyboard.press('ArrowRight');check(name+' keyboard tabs',await page.locator('#test-stage [role="tab"]').nth(1).getAttribute('aria-selected')==='true');}
        if(id==='checkbox'||id==='switch') {await page.locator('#test-stage input').uncheck();check(name+' '+id+' toggles',!await page.locator('#test-stage input').isChecked());}
        if(id==='people-picker') {await page.locator('#test-stage [name="query"]').fill('없는결과');check(name+' '+id+' empty while typing',await page.locator('#test-stage .ds-empty').isVisible());await page.locator('#test-stage [data-part-action="reset-search"]').click();check(name+' '+id+' recovered',await page.locator('#test-stage [data-result]:visible').count()===3);}
        if(id==='page') {await page.locator('#test-stage [name="query"]').fill('없는결과');await page.locator('#test-stage [type="submit"]').click();check(name+' '+id+' empty recovery',await page.locator('#test-stage .ds-empty').isVisible());await page.locator('#test-stage [data-part-action="reset-search"]').click();check(name+' '+id+' recovered',await page.locator('#test-stage [data-result]:visible').count()===3);}
      }
      await page.goto(fileURL+'#/system?style=main&detail=button');check(name+' file execution',await page.locator('.variant-card .ds-button').count()>=1);
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
