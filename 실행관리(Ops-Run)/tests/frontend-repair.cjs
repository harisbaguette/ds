const { chromium, firefox, webkit } = require('playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const base = process.env.PATTOVE_TEST_URL || 'http://127.0.0.1:4173/';
const out = path.resolve(__dirname, '../test-results/frontend-repair');
fs.mkdirSync(out, { recursive:true });
const errors = [];

(async () => {
  for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await engine.launch({ headless:true });
    try {
      const page = await browser.newPage({ viewport:{width:1440,height:1000}, reducedMotion:'reduce' });
      page.on('pageerror', e => errors.push(name + ': ' + e.message));
      const goto = async route => {
        await page.goto(base + '#/' + route);
        await page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
      };
      await goto('styles');
      assert.equal(await page.locator('.style-card').count(), 1);
      assert.equal(await page.locator('[data-studio],.studio-hero,.collection-summary').count(), 0);
      if (name === 'chromium') await page.screenshot({path:path.join(out,'after-home.png')});

      await goto('dictionary?shelf=part');
      await page.keyboard.press('Tab');
      await page.locator('.dict-hit').first().focus();
      const highlight = await page.locator('.dict-entry').first().evaluate(node=>{
        const context=document.createElement('canvas').getContext('2d');
        context.fillStyle=getComputedStyle(node).getPropertyValue('--p-highlight');
        context.fillRect(0,0,1,1);
        return [...context.getImageData(0,0,1,1).data].slice(0,3);
      });
      const card = await page.locator('.dict-entry').first().boundingBox();
      const ring = await page.screenshot({clip:{x:card.x-8,y:card.y-8,width:card.width+16,height:card.height+16}});
      const { data, info } = await sharp(ring).removeAlpha().raw().toBuffer({resolveWithObject:true});
      let purple = 0;
      for (let i=0; i<data.length; i+=info.channels) if (highlight.every((channel,j)=>Math.abs(data[i+j]-channel)<3)) purple++;
      assert.ok(purple>200, name + ': keyboard focus must actually paint outside the clipped card');
      if (name === 'chromium') await page.screenshot({path:path.join(out,'after-card-focus.png')});

      await goto('system?detail=button');
      await page.evaluate(() => {
        window.copyCalls = 0;
        Object.defineProperty(navigator,'clipboard',{ configurable:true, value:{writeText:()=>{window.copyCalls++; return new Promise(resolve=>{window.finishCopy=resolve;});}} });
      });
      const copy = page.locator('[data-copy-reference="button"]');
      await copy.focus();
      await page.keyboard.press('Enter');
      assert.equal(await copy.getAttribute('aria-busy'),'true');
      assert.ok(await copy.evaluate(n=>n===document.activeElement),name + ': a pending copy keeps focus');
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(()=>window.copyCalls),1,name + ': a pending copy cannot run twice');
      await page.keyboard.press('Tab');
      await page.evaluate(()=>{ window.nextFocus=document.activeElement; window.finishCopy(); });
      await page.waitForFunction(()=>!document.querySelector('[aria-busy="true"]'));
      assert.ok(await page.evaluate(()=>window.nextFocus===document.activeElement),name + ': resolving copy must not steal focus back');
      await copy.focus();
      await page.keyboard.press('Enter');
      await page.evaluate(()=>window.finishCopy());
      await page.waitForFunction(()=>!document.querySelector('[aria-busy="true"]'));
      assert.ok(await copy.evaluate(n=>n===document.activeElement),name + ': successful copy preserves the keyboard position');
      await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw new Error('denied');};});
      await page.keyboard.press('Enter');
      assert.ok(await page.locator('#reference-dialog').evaluate(n=>n.open),name + ': denied clipboard still opens the existing fallback');
      await page.keyboard.press('Escape');
      await page.waitForFunction(()=>document.activeElement.matches('[data-copy-reference="button"]'));

      for (const width of [320,375,760,768,1440]) {
        await page.setViewportSize({width,height:900});
        for (const id of ['token-typography','token-text','token-tracking','token-shadow','token-aspect']) {
          await goto('system?detail='+id);
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name + ' ' + width + ': no horizontal page scroll');
          assert.ok(await page.locator('.token-swatch').evaluateAll(nodes=>nodes.every(n=>n.scrollWidth<=n.clientWidth+1)),name + ' ' + width + ' ' + id + ': full specimen is visible');
          const rows = await page.locator('.token-table tbody tr').count();
          assert.equal(await page.getByRole('rowheader').count(),rows);
          assert.equal(await page.getByRole('columnheader').count(),3);
          if (width<=760) assert.ok(await page.locator('.token-table tbody tr').evaluateAll(nodes=>nodes.every(row=>{
            const [label,value,sample]=[...row.children].map(n=>n.getBoundingClientRect());
            return value.top>=label.bottom && sample.left>=Math.max(label.right,value.right) && sample.right<=row.getBoundingClientRect().right;
          })),name + ' ' + width + ': labels and values remain alongside their specimen');
          if (name==='chromium' && [375,1440].includes(width)) await page.screenshot({path:path.join(out,`after-${id}-${width}.png`),fullPage:true});
        }
      }
      console.log(name + ': focus visibility, clipboard keyboard flow and token readability passed.');
    } finally { await browser.close(); }
  }
  assert.deepEqual(errors,[]);
})().catch(error=>{console.error(error);process.exitCode=1;});
