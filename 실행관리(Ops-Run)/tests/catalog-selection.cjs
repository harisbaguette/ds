const {chromium,firefox,webkit}=require('playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {unzipSync,strFromU8}=require('fflate');
const base=process.env.PATTOVE_TEST_URL||'http://127.0.0.1:4173/';
const out=path.resolve(__dirname,'../test-results/catalog-implementation');
fs.mkdirSync(out,{recursive:true});
let checks=0;
const ok=(value,message)=>{assert.ok(value,message);checks++;};
(async()=>{
  for(const [engineName,engine] of Object.entries({chromium,firefox,webkit})){
    const browser=await engine.launch({headless:true});
    try{
      const page=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true});
      page.setDefaultTimeout(10000);
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      const goto=async route=>{await page.goto(base+'#/'+route);await page.evaluate(()=>document.fonts.ready);};
      for(const [shelf,count]of Object.entries({token:20,part:53,block:21,template:5})){
        await goto('dictionary?shelf='+shelf);
        ok(await page.locator('.dict-entry.is-built').count()===Math.min(48,count),shelf+' ready specimens');
        ok(await page.locator('.is-todo').count()===0,shelf+' no empty specimens by default');
        ok(await page.locator('.pagination').count()===(count>48?1:0),shelf+' pagination matches specimen count');
        await page.getByRole('switch',{name:'견본 있음'}).click();
        ok(page.url().includes('available=all'),shelf+' full archive selected');
        if(count>=48)await page.locator('.page-step[aria-label="다음"]').click();
        ok(await page.locator('.is-todo,.is-guideline').count()>0,shelf+' full archive accessible');
        await page.reload();
        ok(await page.getByRole('switch',{name:'견본 있음'}).getAttribute('aria-checked')==='false',shelf+' filter survives reload');
      }
      await goto('dictionary?shelf=part');
      await page.locator('[data-focus="nav-part-buttons"]').click();
      ok(await page.locator('.dict-entry').count()===4,'button/action shortcut contains modal too');
      await page.locator('[data-action="toggle-specimens"]').click();
      await page.locator('[data-focus="nav-part-fields"]').click();
      ok(page.url().includes('available=all'),'shortcuts preserve full-archive setting');
      await page.locator('[data-focus="all-categories"]').click();
      ok(await page.locator('.nav-all-categories').getAttribute('open')!==null,'full taxonomy is expandable');
      for(const width of [320,390,768,1440]){
        await page.setViewportSize({width,height:900});
        await goto('dictionary?shelf=part');
        ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'parts fit '+width);
        ok(await page.locator('.dict-thumb').evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect();return Math.abs(r.width-r.height)<1.5;})),'parts square '+width);
        await page.reload();
        await goto('dictionary?shelf=icon');
        await page.locator('.illustration-open').first().click();
        ok(await page.locator('#detail-dialog').isVisible(),'normal icon click opens detail '+width);
        await page.keyboard.press('Escape');
        await page.locator('[data-selection-mode]').click();
        await page.locator('[data-select-illustration="ICO-01"]').check();
        await page.locator('[data-library-entry="ICO-02"]').click();
        ok(await page.locator('.is-selected').count()===2&&!await page.locator('#detail-dialog').isVisible(),'inline selection '+width);
        await page.locator('.page-step[aria-label="다음"]').click();
        ok(await page.locator('[data-selection-count]').innerText()==='2개 선택','selection survives pagination '+width);
        await page.locator('.page-step[aria-label="이전"]').click();
        ok(await page.locator('[data-select-illustration="ICO-01"]').isChecked()&&await page.locator('[data-select-illustration="ICO-02"]').isChecked(),'returned tiles stay checked '+width);
        ok(await page.locator('.dict-thumb').evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect();return Math.abs(r.width-r.height)<1.5;})),'icon previews square '+width);
        ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'icons fit '+width);
        ok(await page.evaluate(()=>{const a=document.querySelector('.illustration-selection').getBoundingClientRect(),b=document.querySelector('.pagination').getBoundingClientRect();return a.left>=0&&a.right<=innerWidth&&Math.abs(a.bottom-b.top)<1.5&&Math.abs(b.bottom-innerHeight)<1.5;}),'selection bar clears pager '+width);
        if(engineName==='chromium')await page.screenshot({path:path.join(out,'icons-selected-'+width+'.png')});
        await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
        ok(await page.evaluate(()=>document.querySelector('.dict-entry:last-child').getBoundingClientRect().bottom<=document.querySelector('.illustration-selection').getBoundingClientRect().top+1),'last tile clears both bars '+width);
        await page.locator('[data-clear-illustrations]').click();
        ok(await page.locator('[data-export-selected]').isDisabled(),'empty selection disables download '+width);
        await page.locator('[data-selection-mode]').click();
        ok(!await page.locator('.illustration-selection').isVisible(),'cancel closes action strip '+width);
      }
      await page.setViewportSize({width:1440,height:900});
      await goto('dictionary?shelf=icon');
      await page.locator('[data-selection-mode]').click();
      await page.locator('[data-select-illustration="ICO-01"]').focus();
      await page.keyboard.press('Space');
      ok(await page.locator('[data-select-illustration="ICO-01"]').isChecked(),'keyboard checkbox selection');
      await page.locator('[data-illustration-pack]').selectOption('navigation');
      await page.locator('.page-step[aria-label="다음"]').click();
      ok(await page.locator('[data-illustration-pack]').inputValue()==='navigation','pack selection survives pagination');
      await page.route('**/api/illustrations/export?*',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'retry-test'})}));
      await page.locator('[data-export-selected]').click();
      await page.waitForFunction(()=>document.querySelector('[data-export-status]').textContent.includes('retry-test'));
      ok(!await page.locator('[data-export-selected]').isDisabled(),'export failure allows retry');
      await page.unroute('**/api/illustrations/export?*');
      if(engineName==='chromium'){
        const downloadPromise=page.waitForEvent('download');
        await page.locator('[data-export-selected]').click();
        const download=await downloadPromise,zipPath=path.join(out,'selection.zip');
        await download.saveAs(zipPath);
        const files=unzipSync(fs.readFileSync(zipPath)),manifest=JSON.parse(strFromU8(files['manifest.json']));
        assert.deepEqual(manifest.items.map(i=>i.id),['ICO-01']);
        ok(manifest.items.every(i=>files[i.file]?.length>0),'real ZIP contains exactly the selection and its image');
      }
      assert.deepEqual(errors,[]);
      console.log(engineName+' catalog and selection passed');
    }finally{await browser.close();}
  }
  console.log(checks+' catalog/selection checks passed');
})().catch(e=>{console.error(e);process.exitCode=1});
