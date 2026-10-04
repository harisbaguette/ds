const {chromium, firefox, webkit} = require('playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.PATTOVE_TEST_URL || 'http://127.0.0.1:4173/';
const out = path.resolve(__dirname, '../test-results/mobile-a');
fs.mkdirSync(out, {recursive:true});
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; };
const parse = value => JSON.parse(value.slice(value.indexOf('{')));
(async () => {
  for (const [name, engine] of Object.entries({chromium, firefox, webkit})) {
    const browser = await engine.launch({headless:true});
    try {
      const page = await browser.newPage({viewport:{width:390,height:844}});
      page.setDefaultTimeout(10000);
      await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', {configurable:true,value:{writeText:async value => {window.copiedReference = value;}}}));
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      const goto = async route => { const same=page.url()===base+'#/'+route; await page.goto(base + '#/' + route); if(same) await page.reload(); await page.waitForFunction(route => document.body.dataset.page===route.split('?')[0],route); await page.evaluate(() => document.fonts.ready); if(route.startsWith('system?')) await page.locator('.component-page[data-component="'+new URLSearchParams(route.split('?')[1]).get('detail')+'"]').waitFor(); };
      const snapshot = async file => { if (name === 'chromium') await page.screenshot({path:path.join(out,file),fullPage:true}); };
      for (const width of [320,390,768,1440]) {
        await page.setViewportSize({width,height:844});
        await goto('system?detail=button');
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), name+' button fits '+width);
        // Phones draw button rows in a wide, short 5:3 box; wider screens keep square cells.
        check(await page.locator('.component-page .variant-frame').evaluateAll((nodes,ratio) => nodes.every(n => {const r=n.getBoundingClientRect();return Math.abs(r.width*ratio-r.height)<1.5;}), width<=760?3/5:1), name+' button specimen ratio '+width);
        if (width<=760) {
          check(await page.locator('.variant-card [data-copy-reference]').count()===3, 'each shape has direct copy independent of its default action');
          check(await page.locator('.component-page .variant-frame').last().boundingBox().then(r => r.y+r.height<700), 'three button shapes within initial view');
          await page.locator('.mobile-detail-back').waitFor();
          check(await page.locator('.mobile-detail-back').boundingBox().then(async r => {const h=await page.locator('#detail-title').boundingBox();return r&&h&&Math.abs(r.y-h.y)<20;}), 'single title line '+width);
        }
        for (const variant of ['primary','outline','ghost']) {
          const button = page.locator(`.component-page [data-copy-reference="button/variant/${variant}"]`), before = page.url();
          const bounds = await button.boundingBox();
          check(bounds.width>=44 && bounds.height>=44, 'copy touch target '+width);
          await button.click();
          const value = parse(await page.evaluate(() => window.copiedReference));
          check(value.options.variant===variant && value.html && page.url()===before, 'copy exact variant without changing page '+variant);
          check(await button.locator('..').getAttribute('data-copied')!==null, 'local copy feedback');
        }
        await snapshot('button-'+width+'.png');
        await page.locator('#search-open').click();
        await page.locator('#query').fill('button');
        check(await page.locator('.search-result-group[aria-label="부품"] .search-result').count()===4, 'all four implemented button results');
        check(!await page.locator('.search-reference-group').evaluate(n => n.open), 'reference definitions collapsed');
        const searchBounds = await page.locator('#search-dialog').boundingBox();
        check(searchBounds.x>=0 && searchBounds.x+searchBounds.width<=width+1 && searchBounds.y>=0 && searchBounds.y+searchBounds.height<=845, 'search fits viewport '+width);
        const beforeCopy = page.url();
        await page.locator('#search-dialog [data-copy-reference="button/variant/primary"]').click();
        check(page.url()===beforeCopy && await page.locator('#search-dialog').isVisible(), 'search copy keeps results open');
        check(parse(await page.evaluate(() => window.copiedReference)).options.variant==='primary', 'search preview and copy agree');
        await snapshot('search-'+width+'.png');
        await page.locator('[data-suggest-open="icon-button"]').click();
        check(page.url().includes('detail=icon-button')&&!await page.locator('#search-dialog').isVisible(),'open detail separately');
        await page.goBack();
        // Back returns to the page the search was opened from, like a card: search closed, focus on the search button.
        await page.waitForFunction(()=>location.hash.includes('detail=button') && document.activeElement?.id==='search-open');
        check(!await page.locator('#search-dialog').isVisible(),'back closes search and returns to the page');
        check(await page.locator('#search-open').evaluate(n=>document.activeElement===n),'back returns focus to the search button');
      }
      await page.setViewportSize({width:390,height:844});
      await goto('dictionary?shelf=part');
      await page.locator('[data-library-entry="checkbox"]').scrollIntoViewIfNeeded();
      const listScroll = await page.evaluate(()=>scrollY);
      // Click the visible sticky button without Playwright scrolling its ancestor first.
      const opener = await page.locator('#search-open').boundingBox();
      await page.mouse.click(opener.x+opener.width/2,opener.y+opener.height/2);
      await page.locator('#query').fill('button');
      await page.locator('.search-reference-group>summary').click();
      await page.locator('#search-suggestions').evaluate(n=>{n.scrollTop=260;});
      const plain = page.locator('.search-reference-group [data-suggest-open]').first();
      await plain.scrollIntoViewIfNeeded();
      await plain.click();
      await page.keyboard.press('Escape');
      // Closing a definition opened from search returns to the list as it was: search closed, same scroll, focus on the search button.
      await page.waitForFunction(()=>!document.querySelector('#detail-dialog').open && document.activeElement?.id==='search-open');
      check(!await page.locator('#search-dialog').isVisible(),'dictionary definition returns to the list, not the search');
      check(Math.abs(await page.evaluate(()=>scrollY)-listScroll)<2,'underlying library scroll retained');
      await page.locator('#search-open').click();
      await page.locator('#query').fill('button');
      await page.keyboard.press('ArrowDown');
      check(await page.locator('[data-suggest-open="button"]').evaluate(n=>n===document.activeElement),'keyboard moves to result');
      await page.keyboard.press('Tab');
      check(await page.locator('#search-dialog [data-copy-reference="button/variant/primary"]').evaluate(n=>n===document.activeElement),'keyboard copy is a separate stop');
      await page.keyboard.press('Enter');
      check(await page.locator('#search-dialog').isVisible(),'keyboard copy stays in search');
      await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw new Error('denied');};});
      await page.locator('#search-dialog [data-copy-reference="button/variant/primary"]').click();
      check(await page.locator('#reference-dialog textarea').evaluate(n=>n===document.activeElement && n.selectionEnd===n.value.length),'copy denial gives selected manual text');
      await page.keyboard.press('Escape');
      check(await page.locator('#search-dialog').isVisible(),'manual copy returns to search');
      await page.evaluate(()=>{navigator.clipboard.writeText=async value=>{window.copiedReference=value;};});
      // A short visual viewport represents the space remaining above a keyboard.
      await page.setViewportSize({width:320,height:380});
      check(await page.locator('#search-close').boundingBox().then(r=>r.y>=0&&r.y+r.height<380),'close remains reachable with short viewport');
      await page.locator('#query').fill('no-result-493837');
      check(await page.locator('.search-no-match').isVisible(),'empty search state');
      await page.locator('#search-clear').click();
      check(await page.locator('#query').inputValue()==='' && await page.locator('#search-suggestions h2').first().innerText().then(t=>t.includes('최근 복사')),'clearing query reveals recent copies');
      await snapshot('search-short-320.png');
      await page.locator('#search-close').click();
      await page.locator('#search-open').click();
      await page.locator('#query').fill('button');
      await page.locator('[data-action="search-all"]').click();
      // A search keeps 견본 있음 on; the definitions without a specimen come after the results, one press away.
      check(!page.url().includes('available=all') && await page.locator('.is-todo').count()===0 && await page.locator('[data-action="show-unbuilt"]').isVisible(),'search keeps the specimen switch and offers the rest after the results');
      await page.locator('[data-action="show-unbuilt"]').click();
      check(await page.locator('.is-todo').count()>0 && page.url().includes('available=all'),'all search results include reference definitions');
      await goto('system?detail=button');
      await page.evaluate(()=>localStorage.setItem('pattove-part-choice',JSON.stringify({button:'outline'})));
      await page.locator('#search-open').click();
      await page.locator('#query').fill('button');
      await page.locator('#search-dialog [data-copy-reference="button/variant/outline"]').click();
      check(parse(await page.evaluate(()=>window.copiedReference)).options.variant==='outline','search uses the saved default shape');
      await page.locator('#search-close').click();
      await goto('motion');
      await page.locator('#search-open').click();
      await page.locator('#query').fill('fade');
      await page.locator('[data-suggest-open="motion/fade-up"]').click();
      await page.locator('.mobile-detail-back').click();
      await page.waitForFunction(()=>!location.hash.includes('detail=') && document.activeElement?.id==='search-open');
      check(!await page.locator('#search-dialog').isVisible(),'motion back returns to the list, not the search');
      for (const width of [320,390,768,1440]) {
        await page.setViewportSize({width,height:844});
        await goto('motion?detail=fade-up');
        await page.locator('[data-motion-frame][data-motion-ready="true"]').waitFor();
        await page.frameLocator('[data-motion-frame]').locator('.pm-demo').waitFor();
        check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'motion fits '+width);
        if(width<=760){
          const r=await page.locator('.motion-preview').boundingBox();
          check(Math.abs(r.width-r.height)<1.5,'square motion preview');
          check(await page.locator('.motion-conditions,.motion-code-disclosure,.motion-files,#motion-code').count()===0,'no code, condition or download panels on screen');
          const copy=await page.locator('[data-motion-copy]').boundingBox();
          check(copy.y+copy.height<844,'primary motion copy in first screen');
        }
        await page.locator('[data-motion-pause]').click();
        check((await page.locator('[data-motion-pause]').innerText()).includes('재생'),'pause action changes to play');
        await page.locator('[data-motion-replay]').click();
        check((await page.locator('[data-motion-pause]').innerText()).includes('일시정지'),'replay updates action label');
        await page.locator('[data-motion-target]').selectOption('react');
        await page.locator('[data-motion-copy]').click();
        const payload=parse(await page.evaluate(()=>window.copiedReference));
        check(payload.target==='React'&&payload.files.some(f=>f.path==='MotionEffect.jsx')&&payload.reducedMotion.included,'motion copy includes selected environment and conditions');
        await snapshot('motion-'+width+'.png');
        await page.locator('[data-motion-code-copy]').click();
        await page.waitForFunction(()=>window.copiedReference?.includes('// MotionEffect.jsx'));
        check(await page.evaluate(()=>window.copiedReference.includes('/* motion-effect.css */')&&window.copiedReference.includes('@keyframes')),'one code copy carries the JSX and the CSS it imports');
        await page.emulateMedia({reducedMotion:'reduce'});
        await page.waitForFunction(()=>document.querySelector('[data-motion-reduce]').disabled);
        check(await page.locator('[data-motion-reduce]').getAttribute('aria-pressed')==='true','OS reduced motion kept');
        await page.emulateMedia({reducedMotion:'no-preference'});
      }
      await page.setViewportSize({width:320,height:844});
      await goto('motion');
      await page.locator('[data-motion-open]').last().scrollIntoViewIfNeeded();
      const motionScroll=await page.evaluate(()=>scrollY);
      await page.locator('[data-motion-open]').last().click();
      await page.locator('.mobile-detail-back').click();
      await page.waitForFunction(()=>!location.hash.includes('detail='));
      check(Math.abs(await page.evaluate(()=>scrollY)-motionScroll)<2,'motion back restores original list position');
      check(await page.locator('#primary-nav [aria-current="page"]').boundingBox().then(r=>r.x>=0&&r.x+r.width<=320),'active shelf scrolled into view');
      check(errors.length===0,name+' no browser errors: '+errors.join(', '));
      console.log(name+': mobile copy, search restoration, keyboard, short viewport, motion and responsive checks passed');
    } finally { await browser.close(); }
  }
  console.log(checks+' checks passed');
})().catch(error=>{console.error(error);process.exitCode=1;});
