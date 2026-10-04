const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium, firefox, webkit } = require('playwright-core');
const origin = process.env.PATTOVE_TEST_URL || 'http://127.0.0.1:4173/';
const output = path.resolve(__dirname, '../test-results/ux-refinement');
fs.mkdirSync(output, { recursive: true });
const results = [];

(async () => {
  for (const [engine, launcher] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await launcher.launch({ headless: true });
    try {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      // Observe the real payload without writing into the user's system clipboard.
      await context.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
        writeText: async value => { window.copiedReference = value; }
      } }));
      const page = await context.newPage(), errors = [];
      page.on('pageerror', e => errors.push(e.message));
      const goto = route => page.goto(origin + '#/' + route);
      const pick = value => page.locator(`[data-variant-pick="${value}"]`);
      const copy = value => page.locator(`[data-copy-reference="button/variant/${value}"]`);
      const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('pattove-part-choice') || '{}').button);
      await goto('dictionary?shelf=part');
      assert.equal(await page.locator('[data-preview-select]').count(), 0);
      assert.equal(await page.locator('.preview-style-static').count(), 0);
      // A below-the-fold entry exercises the history's real scroll and focus restoration.
      const opener = page.locator('[data-library-entry="switch"]');
      await opener.scrollIntoViewIfNeeded();
      const scroll = await page.evaluate(() => scrollY);
      assert.ok(scroll > 0);
      await opener.click();
      await page.locator('[data-action="back-to-list"]:visible').click();
      await page.waitForFunction(y => Math.abs(scrollY - y) < 2 && document.activeElement?.dataset.libraryEntry === 'switch', scroll);

      await page.locator('[data-library-entry="button"]').click();
      assert.equal(await page.locator('.component-reference').getAttribute('open'), null);
      await pick('outline').focus();
      await page.keyboard.press('Enter');
      assert.equal(await pick('outline').getAttribute('aria-pressed'), 'true');
      assert.equal(await saved(), 'outline');
      await goto('system?detail=button');
      assert.equal(await pick('outline').getAttribute('aria-pressed'), 'true');
      await pick('outline').focus();await page.keyboard.press('Enter');
      assert.equal(await saved(), 'outline');
      assert.equal(await page.evaluate(() => document.activeElement.dataset.variantPick), 'outline');
      await goto('dictionary?shelf=part');
      await page.locator('[data-library-entry="button"]').click();
      assert.equal(await pick('outline').getAttribute('aria-pressed'), 'true');

      // Copying a different card must neither select it nor change the saved preference.
      const url = page.url();
      const width = (await copy('ghost').boundingBox()).width;
      await copy('ghost').click();
      const payload = await page.evaluate(() => JSON.parse(window.copiedReference.slice(window.copiedReference.indexOf('{'))));
      assert.equal(payload.id, 'button/variant/ghost');
      assert.equal(payload.options.variant, 'ghost');
      assert.equal(payload.reactProps.variant, 'ghost');
      assert.ok(payload.html.includes('data-variant="ghost"'));
      assert.equal(page.url(), url);
      assert.equal(await saved(), 'outline');
      assert.equal(await pick('outline').getAttribute('aria-pressed'), 'true');
      assert.equal(await copy('ghost').locator('.reference-copy-label>span:last-child').isVisible(), true);
      assert.equal((await copy('ghost').boundingBox()).width, width);
      await page.waitForFunction(() => !document.querySelector('[data-copy-reference="button/variant/ghost"]').parentElement.hasAttribute('data-copied'));
      assert.equal(await copy('ghost').locator('.reference-copy-label>span:first-child').isVisible(), true);

      await page.locator('.component-reference>summary').click();
      await page.locator('[data-copy-reference="button"]').click();
      assert.equal(await page.evaluate(() => JSON.parse(window.copiedReference.slice(window.copiedReference.indexOf('{'))).options.variant), 'outline');
      await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('denied'); }; });
      await copy('primary').click();
      assert.equal(await page.locator('#reference-dialog textarea').evaluate(n => document.activeElement === n && n.selectionStart === 0 && n.selectionEnd === n.value.length), true);
      await page.keyboard.press('Escape');
      await page.waitForFunction(()=>document.activeElement?.dataset.copyReference==='button/variant/primary');
      assert.equal(await copy('primary').evaluate(n => document.activeElement === n), true);

      const layouts = [];
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 844 });
        await goto('system?detail=button');
        await page.reload();
        await page.evaluate(() => document.fonts.ready);
        const layout = await page.evaluate(() => ({
          width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth,
          firstPreview: document.querySelector('.variant-frame').getBoundingClientRect().top,
          copyTargets: [...document.querySelectorAll('.variant-card .reference-copy')].map(n => {
            const r = n.getBoundingClientRect(); return { width: r.width, height: r.height, right: r.right };
          })
        }));
        assert.equal(layout.overflow, false);
        assert.ok(layout.firstPreview < (width <= 390 ? 300 : 320), JSON.stringify(layout));
        assert.ok(layout.copyTargets.every(r => r.width >= 44 && r.height >= 44 && r.right <= width));
        layouts.push(layout);
        if (engine === 'chromium') {
          await page.screenshot({ path: path.join(output, `button-${width}.png`), fullPage: true });
          await goto('dictionary?shelf=part');
          await page.screenshot({ path: path.join(output, `parts-${width}.png`) });
        }
      }
      // A user who blocks browser storage can still save within the current visit.
      const blocked = await browser.newContext();
      await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }));
      const temporary = await blocked.newPage();
      await temporary.goto(origin + '#/system?detail=button');
      await temporary.locator('[data-variant-pick="ghost"]').click();
      await temporary.goto(origin + '#/dictionary?shelf=part');
      await temporary.locator('[data-library-entry="button"]').click();
      assert.equal(await temporary.locator('[data-variant-pick="ghost"]').getAttribute('aria-pressed'), 'true');
      await blocked.close();
      assert.deepEqual(errors, []);
      results.push({ engine, layouts, errors });
      console.log(`${engine}: selection, save, copy, fallback, return and four responsive widths passed.`);
    } finally { await browser.close(); }
  }
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
