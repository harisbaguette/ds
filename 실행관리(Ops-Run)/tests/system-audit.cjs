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
const snapshot = root => [...root.querySelectorAll('*')].filter(n=>!n.closest('svg')).map(n=>{
  const s=getComputedStyle(n), r=n.getBoundingClientRect();
  return {tag:n.tagName, class:n.className, props:Object.fromEntries(['display','fontFamily','fontSize','fontWeight','lineHeight','color','backgroundColor','borderRadius','borderWidth','borderStyle','borderColor','boxShadow','padding','margin','minWidth','minHeight','gap'].map(key=>[key,s[key]]))};
});
const integrity = root => {
  const all=[root,...root.querySelectorAll('*')],ids=all.filter(n=>n.id).map(n=>n.id),bad=[];
  if(new Set(ids).size!==ids.length)bad.push('duplicate-id');
  all.forEach(n=>{
    for(const attr of ['for','aria-controls','aria-labelledby','aria-describedby']) if(n.hasAttribute(attr)) for(const id of n.getAttribute(attr).split(/\s+/)) if(!all.some(el=>el.id===id)) bad.push(attr+':'+id);
    if(n.matches('button')&&!((n.getAttribute('aria-label')||n.textContent).trim()))bad.push('unnamed-button');
    if(n.matches('input,select')&&!n.labels?.length&&!n.getAttribute('aria-label'))bad.push('unnamed-input');
  });return bad;
};
async function route(page,style,id='',category='all') {
  await page.goto(origin+'#/system?style='+style+(id?'&detail='+id:'')+'&category='+category);
  await page.locator(id?'.system-inspector':'.system-board').waitFor();
  await page.evaluate(()=>document.fonts.ready);
}
async function exportBlob(page,style,id) {
  return page.evaluate(async ({style,id})=>{
    const options=Object.fromEntries([...document.querySelectorAll('[data-part-option]')].map(n=>[n.dataset.partOption,n.value]));
    const html=await Pattove.systemExport.html({style,detail:id,options},document.querySelector('.part-demo > .ds'),document.querySelector('#part-source').value);
    return URL.createObjectURL(new Blob([html],{type:'text/html'}));
  },{style,id});
}
async function run() {
  const browser=await chromium.launch({headless:true});
  try {
    const context=await browser.newContext({viewport:{width:1440,height:1000}});
    const page=await context.newPage(), exported=await context.newPage();
    for(const p of [page,exported]) {p.setDefaultTimeout(7000);p.on('pageerror',e=>errors.push(e.message));}
    await route(page,'main');
    const metadata=await page.evaluate(()=>({styles:Pattove.catalog.styles.filter(s=>s.id!=='base').map(s=>s.id),items:Pattove.systemRegistry.items}));
    // Every implementation, every style: do not substitute button-only coverage.
    for(const style of metadata.styles) {
      for(const item of metadata.items) {
        await route(page,style,item.id);
        check(style+'/'+item.id+' preview relationships', (await page.locator('.part-demo > .ds').evaluate(integrity)).length===0);
        const original=await page.locator('.part-demo > .ds').evaluate(snapshot);
        const contentWidth=await page.locator('.part-demo > .ds').evaluate(n=>n.clientWidth-parseFloat(getComputedStyle(n).paddingLeft)-parseFloat(getComputedStyle(n).paddingRight));
        const blob=await exportBlob(page,style,item.id);
        await exported.goto(blob);await exported.evaluate(()=>document.fonts.ready);
        await exported.locator('body > .ds').evaluate((node,width)=>{node.style.width=width+'px';},contentWidth);
        const copy=await exported.locator('body > .ds').evaluate(snapshot);
        const differences=original.flatMap((node,i)=>!copy[i]?['missing '+node.tag]:Object.keys(node.props).filter(key=>node.props[key]!==copy[i].props[key]).map(key=>({node:i,tag:node.tag,class:node.class,key,preview:node.props[key],exported:copy[i].props[key]})));
        check(style+'/'+item.id+' standalone CSS parity',differences.length===0&&original.length===copy.length,differences);
        check(style+'/'+item.id+' standalone relationships',(await exported.locator('body > .ds').evaluate(integrity)).length===0);
        await exported.locator('body > .ds').evaluate((node,width)=>{node.style.width=width+'px';},item.minInlineSize);
        check(style+'/'+item.id+' minimum container width', await exported.locator('body > .ds').evaluate(node=>node.scrollWidth<=node.clientWidth+1));
        await page.evaluate(url=>URL.revokeObjectURL(url),blob);
      }
      console.log(style+': 18 implementations exported and compared');
    }
    // Every declared variant must be selectable, serializable and deep-linkable.
    for(const item of metadata.items) for(const control of item.controls) for(const [value] of control.values) {
      await route(page,'main',item.id);
      await page.locator('[data-part-option="'+control.key+'"]').selectOption(value);
      const stateBefore=await page.locator('.part-demo > .ds').evaluate(integrity);
      check(item.id+'/'+control.key+'/'+value+' accessible variant',stateBefore.length===0,stateBefore);
      const href=page.url();await page.reload();
      check(item.id+'/'+control.key+'/'+value+' reload restores variant', await page.locator('[data-part-option="'+control.key+'"]').inputValue()===value && page.url()===href);
      check(item.id+'/'+control.key+'/'+value+' source matches preview',await page.evaluate(()=>{
        const t=document.createElement('template');t.innerHTML=document.querySelector('#part-source').value;
        return t.content.firstElementChild.outerHTML===document.querySelector('.part-demo > .ds').outerHTML;
      }));
    }
    // Inspector overlays must preserve an already-used board.
    await route(page,'main','','composition');
    await page.locator('.system-board [name="query"]').fill('주말');await page.locator('.system-board button[type="submit"]').click();
    await page.locator('[data-system-detail="card"]').click();await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('dialog').open);
    check('overlay keeps query and filtered results',await page.locator('.system-board [name="query"]').inputValue()==='주말'&&await page.locator('[data-result]:visible').count()===1);
    await route(page,'main','','selection');
    await page.locator('[data-indeterminate]').click();
    await page.locator('[data-system-detail="checkbox"]').click();await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('dialog').open);
    check('overlay does not reinitialize mixed checkbox',!await page.locator('[data-indeterminate]').evaluate(n=>n.indeterminate));
    await route(page,'main','search-module');
    const demo=page.locator('.part-demo');
    await demo.locator('[data-result] button').first().click();await demo.locator('[data-part-action="save-record"]').click();await demo.locator('[data-part-action="close-record"]').click();await demo.locator('[data-result] button').first().click();
    check('record keeps saved state when reopened',await demo.locator('[data-part-action="save-record"]').getAttribute('aria-pressed')==='true');
    await demo.locator('[data-part-action="save-record"]').click();await demo.locator('[data-part-action="close-record"]').click();await demo.locator('[data-result] button').first().click();
    check('record keeps unsaved state when reopened',await demo.locator('[data-part-action="save-record"]').getAttribute('aria-pressed')==='false');
    // Compose multiple exported fragments without duplicate IDs, radio coupling or theme bleed.
    const fragments=[];
    for(const [style,id] of [['main','tabs'],['main','tabs'],['main','radio'],['main','radio']]) {
      await route(page,style,id);const blob=await exportBlob(page,style,id);await exported.goto(blob);
      fragments.push(await exported.evaluate(()=>({css:document.querySelector('style').textContent,markup:document.querySelector('body > .ds').outerHTML})));
      await page.evaluate(url=>URL.revokeObjectURL(url),blob);
    }
    await exported.setContent('<!doctype html><html><head>'+fragments.map(f=>'<style>'+f.css+'</style>').join('')+'</head><body>'+fragments.map(f=>f.markup).join('')+'</body></html>');
    await exported.evaluate(source=>{(0,eval)('('+source+')(document)');},await page.evaluate(()=>Pattove.mountParts.toString()));
    check('composed exports have independent ID relationships',(await exported.locator('body').evaluate(integrity)).length===0);
    await exported.locator('body').evaluate(n=>n.insertAdjacentHTML('beforeend','<button id="outside-control" class="ds-button">외부 버튼</button>'));
    check('exported component styles stay scoped',await exported.locator('#outside-control').evaluate(n=>getComputedStyle(n).borderRadius==='0px'));
    await exported.locator('.ds').nth(0).locator('[role="tab"]').nth(1).click();
    check('composed tabs change their own panel only',await exported.locator('.ds').nth(1).locator('[role="tab"]').first().getAttribute('aria-selected')==='true');
    await exported.locator('.ds').nth(2).locator('input').last().check();
    check('composed radio groups remain independent',await exported.locator('.ds').nth(3).locator('input').first().isChecked());
    // Preserve async export identity while the user moves to another screen.
    const delayed=await context.newPage();let release;
    const gate=new Promise(resolve=>{release=resolve;});
    await delayed.route('**/system-fonts.js',async route=>{await gate;await route.continue();});
    await route(delayed,'main','field');
    const requested=delayed.waitForRequest('**/system-fonts.js');const downloadEvent=delayed.waitForEvent('download');
    await delayed.locator('[data-system-download]').click();await requested;await delayed.keyboard.press('Escape');
    await delayed.getByRole('link',{name:'사전',exact:true}).first().click();release();
    const download=await downloadEvent;const filename=path.join(out,download.suggestedFilename());await download.saveAs(filename);
    check('async export filename is frozen',download.suggestedFilename()==='pattove-main-field.html');
    const content=fs.readFileSync(filename,'utf8');check('async export theme is frozen',content.includes('background: #e9edf2')&&content.includes('"style":"main"'));
    await delayed.close();
    // Failed font fetch must offer a real retry and keep the dialog usable.
    const retry=await context.newPage();await retry.route('**/system-fonts.js',route=>route.abort());
    await route(retry,'main','button');await retry.locator('[data-system-download]').click();
    await retry.locator('.export-status').filter({hasText:'다시 시도'}).waitFor();
    check('failed export unlocks download button',await retry.locator('[data-system-download]').isEnabled());
    await retry.unroute('**/system-fonts.js');const recovered=retry.waitForEvent('download');await retry.locator('[data-system-download]').click();await recovered;
    check('failed export can recover',true);await retry.close();
    // Real clipboard failures must retain selectable source, not claim success.
    await route(page,'main','field');await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(new Error('denied'))}}));
    await page.locator('[data-system-copy]').click();
    check('clipboard failure leaves selectable source',await page.locator('#part-source').evaluate(n=>n===document.activeElement&&n.selectionEnd===n.value.length));
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
        check(name+'/'+width+'/'+style+' board layout',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)&&await page.locator('.specimen').count()===18);
      }
      for(const id of ['field','checkbox','radio','switch','tabs','bottom-nav','card','search-module','page']) {
        await route(page,'main',id);
        check(name+'/'+id+' valid relationships',(await page.locator('.part-demo > .ds').evaluate(integrity)).length===0);
        if(id==='tabs') {await page.locator('.part-demo [role="tab"]').first().focus();await page.keyboard.press('ArrowRight');check(name+' keyboard tabs',await page.locator('.part-demo [role="tab"]').nth(1).getAttribute('aria-selected')==='true');}
        if(id==='checkbox'||id==='switch') {await page.locator('.part-demo input').uncheck();check(name+' '+id+' toggles',!await page.locator('.part-demo input').isChecked());}
        if(id==='search-module'||id==='page') {await page.locator('.part-demo [name="query"]').fill('없는결과');await page.locator('.part-demo [type="submit"]').click();check(name+' '+id+' empty recovery',await page.locator('.part-demo .ds-empty').isVisible());await page.locator('.part-demo [data-part-action="reset-search"]').click();check(name+' '+id+' recovered',await page.locator('.part-demo [data-result]:visible').count()===3);}
        const downloadEvent=page.waitForEvent('download');await page.locator('[data-system-download]').click();const download=await downloadEvent;await download.saveAs(path.join(out,name+'-'+download.suggestedFilename()));check(name+'/'+id+' download',true);
      }
      await page.goto(fileURL+'#/system?style=main&category=buttons');check(name+' file execution',await page.locator('.button-matrix tbody tr').count()===6);
      await page.screenshot({path:path.join(out,name+'-mobile.png')});console.log(name+': responsive controls and exports checked');
    } finally {await browser.close();}
  }
}
run().catch(error=>{failures.push({name:'audit interrupted',detail:error.stack});}).finally(()=>{
  check('no browser execution errors',errors.length===0,errors);
  const result={checkedAt:new Date().toISOString(),checks,failures,errors};fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify({checks:checks.length,failures:failures.length,examples:failures.slice(0,12)},null,2));
  if(failures.length)process.exitCode=1;
});
