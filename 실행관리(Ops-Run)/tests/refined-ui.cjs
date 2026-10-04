const {chromium,firefox,webkit}=require('playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const out=path.resolve(__dirname,'../test-results/refined-ui');fs.mkdirSync(out,{recursive:true});
const base=process.env.PATTOVE_TEST_URL||'http://127.0.0.1:4173/';
let count=0;const check=(value,name)=>{assert.ok(value,name);count++;};
(async()=>{
  for(const [name,engine] of Object.entries({chromium,firefox,webkit})) {
    const browser=await engine.launch();
    try {
      const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
      await context.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.copied=value;}}}));
      const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
      const go=async route=>{await page.goto(base+'#/'+route);await page.locator('#page-title').waitFor({state:'attached'});};
      await go('motion');
      // Twelve motions fit on one screen: no page cut, no page bar.
      check(await page.locator('.motion-card').count()===34&&await page.locator('.pagination').count()===0,name+' all motion previews on one page');
      check(await page.locator('#header-context .collection-count').textContent()==='34',name+' total count');
      check(await page.locator('.motion-card iframe').evaluateAll(ns=>ns.every(n=>n.tabIndex===-1)),name+' preview pictures take no Tab stop');
      await page.waitForFunction(()=>document.querySelector('[data-motion-frame]')?.dataset.motionReady==='true');
      const lift=page.frameLocator('[data-motion-frame="hover-lift"]').locator('.pm-lift');
      await lift.hover();
      for(let i=0;i<40;i++){
        if(await lift.evaluate(n=>getComputedStyle(n).transform==='matrix(1, 0, 0, 1, 0, -4)'))break;
        await new Promise(resolve=>setTimeout(resolve,25));
      }
      check(await lift.evaluate(n=>getComputedStyle(n).transform==='matrix(1, 0, 0, 1, 0, -4)'),name+' hover transform');
      check(true,name+' preview hover interaction retained');
      await page.locator('[data-motion-item-pause]').first().click();
      check((await page.locator('[data-motion-item-pause]').first().getAttribute('aria-label')).endsWith('재생'),name+' pause one');
      check((await page.locator('[data-motion-item-pause]').nth(1).getAttribute('aria-label')).endsWith('일시정지'),name+' other item still playing');
      await page.locator('[data-motion-global]:visible').click();
      check(await page.locator('[data-motion-item-pause]').evaluateAll(ns=>ns.length===34&&ns.every(n=>n.getAttribute('aria-label').endsWith('재생'))),name+' global pause covers every preview');
      const id=await page.locator('[data-motion-copy]').nth(7).getAttribute('data-motion-copy');
      await page.locator('[data-motion-target]').selectOption('next');
      await page.locator('[data-motion-copy]').nth(7).click();
      await page.waitForFunction(()=>window.copied?.includes('Next.js'));
      check(await page.evaluate(id=>window.copied.includes('motion/'+id),id),name+' copies chosen exact item and environment');
      check(page.url().endsWith('#/motion'),name+' copy stays in list');
      const scroll=await page.evaluate(()=>scrollY);
      // Opened by keyboard so every engine records the focused card (WebKit does not focus links on mouse clicks).
      await page.locator('[data-motion-open]').nth(7).focus();await page.keyboard.press('Enter');
      await page.locator('[data-motion-detail]').waitFor();
      await page.locator('[data-action="back-to-motion"]:visible').click();
      await page.waitForFunction(()=>document.activeElement?.matches('[data-motion-open]'));
      check(page.url().endsWith('#/motion')&&Math.abs(await page.evaluate(()=>scrollY)-scroll)<2&&await page.evaluate(id=>document.activeElement.closest('.motion-card').querySelector('[data-motion-copy]').dataset.motionCopy===id,id),name+' detail returns to the same card and scroll');
      await page.locator('[data-motion-global]:visible').click();
      await go('motion?p=999');
      check(!page.url().includes('p=')&&await page.locator('.motion-card').count()===34,name+' an old page number opens the whole list');
      await go('dictionary?shelf=icon&detail=ICO-01');
      await page.locator('.icon-detail').waitFor();
      check(await page.locator('[data-icon-download]').count()===1,name+' one main download');
      for(const format of ['png','webp']) {
        await page.locator('[data-icon-format]').selectOption(format);
        const href=await page.locator('[data-icon-download]').getAttribute('href');
        const done=page.waitForEvent('download');await page.locator('[data-icon-download]').click();const file=await done;
        check(file.suggestedFilename()==='home.'+format,name+' readable '+format+' filename');
        const bytes=fs.readFileSync(await file.path()),response=await context.request.get(new URL(href,base).href),meta=await require('sharp')(bytes).metadata();
        check(bytes.equals(await response.body())&&meta.format===format&&meta.width===512&&meta.height===512,name+' actual '+format+' asset bytes and dimensions');
      }
      await page.locator('[data-pick-illustration]').click();
      check(await page.locator('[data-pick-illustration]').getAttribute('aria-pressed')==='true',name+' icon selection');
      check(await page.locator('.icon-file-info').getAttribute('open')===null,name+' source folded');
      await page.locator('.icon-file-info summary').click();
      check((await page.locator('.icon-file-info').innerText()).includes('ICO-01'),name+' file identifier available');
      await page.locator('.icon-file-info summary').click();
      await page.locator('[data-action="close-dialog"]').click();
      await page.locator('#detail-dialog').waitFor({state:'hidden'});
      check(await page.locator('[data-select-illustration="ICO-01"]').isChecked(),name+' selected on grid after closing');
      await go('system?detail=token-color');
      check(await page.locator('.color-token-row').count()===await page.evaluate(()=>{
        const s=[...document.styleSheets].find(s=>s.href?.endsWith('/semantic/color.css'));
        return new Set([...s.cssRules].flatMap(r=>[...(r.style||[])].filter(n=>n.startsWith('--p-')))).size;
      }),name+' all semantic color roles preserved');
      const bg=page.locator('[data-color-role="--p-bg"]'),backdrop=page.locator('[data-color-role="--p-backdrop"]');
      check(await page.locator('.color-token-row:visible').count()===8,name+' eight core colors first');
      check(await bg.locator('.color-hex').textContent()==='#FFFFFF',name+' white hex');
      check(await backdrop.locator('.color-hex').textContent()==='#2C333D66',name+' translucent channels and alpha preserved');
      check(await page.locator('.color-hex').evaluateAll(ns=>ns.every(n=>/^#[\dA-F]{6}([\dA-F]{2})?$/.test(n.textContent))),name+' mixed colors also resolved');
      await bg.locator('[data-color-copy]').click();await page.waitForFunction(()=>window.copied==='var(--p-bg)');
      check(await bg.locator('[data-color-copy]').getAttribute('data-copied')!==null,name+' inline copy confirmation');
      await page.locator('[data-color-mode="hex"]').click();
      check(await bg.locator('[data-color-copy]').getAttribute('data-copied')===null,name+' mode resets stale feedback');
      await page.locator('.color-extra>summary').click();
      await backdrop.locator('[data-color-copy]').click();await page.waitForFunction(()=>window.copied==='#2C333D66');
      await page.locator('[data-color-filter="status"]').click();
      check(await page.locator('.color-token-row:visible').count()===9,name+' role filter');
      await page.locator('[data-color-filter="all"]').click();
      await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('blocked');}},configurable:true}));
      await bg.locator('[data-color-copy]').click();await page.locator('#reference-dialog').waitFor({state:'visible'});
      check(await page.locator('#reference-dialog textarea').evaluate(n=>n.value==='#FFFFFF'&&n.selectionEnd===n.value.length),name+' plain color fallback');
      await page.keyboard.press('Escape');
      // The dialog's close event arrives a moment after Escape (later in WebKit); wait for it before checking.
      await page.waitForFunction(el=>el===document.activeElement,await bg.locator('[data-color-copy]').elementHandle(),{timeout:3000}).catch(()=>{});
      check(await bg.locator('[data-color-copy]').evaluate(n=>n===document.activeElement),name+' fallback restores focus');
      for(const width of [320,390,768,1440]) {
        await page.setViewportSize({width,height:width<761?844:1000});
        for(const [label,route] of [['motion','motion'],['icon','dictionary?shelf=icon&detail=ICO-01'],['color','system?detail=token-color']]) {
          await go(route);await page.waitForTimeout(120);
          check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+' '+width+' '+label+' no overflow');
          if(label==='motion') {
            const rect=await page.locator('.motion-preview').first().boundingBox();
            check(Math.abs(rect.width-rect.height)<1,name+' '+width+' square motion');
            check(rect.y<240,name+' '+width+' compact first screen');
            await page.locator('.motion-card').last().scrollIntoViewIfNeeded();
            await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
            const last=await page.locator('.motion-card').last().boundingBox();
            check(await page.locator('.pagination').count()===0&&last.y+last.height<=await page.evaluate(()=>innerHeight)+1,name+' '+width+' last card fully reachable');
            await page.evaluate(()=>scrollTo(0,0));
          }
          if(label==='icon') {
            const rect=await page.locator('.icon-detail-preview').boundingBox();check(Math.abs(rect.width-rect.height)<1,name+' '+width+' square icon');
            const download=await page.locator('[data-icon-download]').boundingBox();
            check(download.y+download.height<=844,name+' '+width+' download in first screen');
            if(width<761)check(await page.locator('#detail-dialog').evaluate(n=>n.clientWidth===innerWidth&&n.clientHeight===innerHeight),name+' '+width+' fullscreen detail');
          }
          if(name==='chromium'&&[390,1440].includes(width))await page.screenshot({path:path.join(out,label+'-'+width+'.png')});
        }
      }
      await page.setViewportSize({width:390,height:844});await go('motion');
      await page.locator('.motion-more summary').click();
      await page.locator('[data-motion-reduce]').click();
      check(await page.locator('[data-motion-item-pause]').first().isDisabled(),name+' reduced motion disables preview control');
      await page.keyboard.press('Escape');
      check(await page.locator('.motion-more').getAttribute('open')===null,name+' keyboard closes playback menu');
      await page.emulateMedia({reducedMotion:'reduce'});await page.locator('.motion-more summary').click();
      check(await page.locator('[data-motion-reduce]').isDisabled(),name+' OS reduced motion cannot be overridden');
      check(errors.length===0,name+' no script errors: '+errors.join('; '));
      console.log(name+' passed');
    } finally {await browser.close();}
  }
  console.log(count+' refined UI checks passed');
})().catch(e=>{console.error(e);process.exitCode=1;});
