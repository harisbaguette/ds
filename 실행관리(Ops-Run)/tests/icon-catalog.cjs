const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright-core');
const out = path.resolve(__dirname, '../test-results/icon-catalog');
const origin = process.env.PATTOVE_TEST_URL || 'http://127.0.0.1:4173/';
const allowPending = process.argv.includes('--allow-pending');
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + '#/dictionary?shelf=icon');
    const catalog = await page.evaluate(() => {
      const ui = Pattove.libraryUI;
      const state = { page: 'dictionary', filters: ui.readFilters('dictionary', new URLSearchParams('shelf=icon')), query: '' };
      const items = ui.currentItems(state);
      return { ids: items.map(e => e.id), pages: ui.pageCount(state),
        pending: items.filter(e => e.kind !== '기준' && !e.art).map(e => e.id),
        illustrated: items.filter(e => e.art).map(e => e.id),
        guidelines: items.filter(e => e.kind === '기준').map(e => e.id) };
    });
    assert.equal(catalog.ids.length, 10930, 'Keep all 10,908 icon subjects and 22 guidelines');
    if (!allowPending) assert.deepEqual(catalog.pending, [], 'Every catalog icon must have an illustration');
    const seen = [], pictured = [];
    for (let n = 1; n <= catalog.pages; n++) {
      await page.waitForFunction(n => document.querySelector('.page-num[aria-current="true"]')?.textContent === String(n), n);
      await page.locator('.dict-entry img').evaluateAll(images => Promise.all(images.map(img => { img.loading = 'eager'; return img.decode(); })));
      assert.equal(await page.locator('.dict-entry svg').count(), 0, 'Never substitute SVG on page ' + n);
      const cards = await page.locator('.dict-entry').evaluateAll(entries => entries.map(e => ({
        id: e.dataset.libraryEntry || e.dataset.illustrationId, pending: e.classList.contains('is-todo'),
        illustrated: !!e.querySelector('img')?.naturalWidth,
        guideline: e.classList.contains('is-guideline') && !!e.querySelector('.guideline-summary')?.textContent.trim()
      })));
      assert.deepEqual(cards.map(e => e.id), catalog.ids.slice((n - 1) * 72, n * 72), 'Page ' + n + ': no missing or duplicate subjects');
      assert.ok(cards.every(e => e.illustrated || e.guideline || (allowPending && e.pending)), 'Page ' + n + ': real artwork required');
      seen.push(...cards.map(e => e.id));
      pictured.push(...cards.filter(e => e.illustrated).map(e => e.id));
      if (n === catalog.pages) await page.screenshot({ path: path.join(out, 'last-page.png'), fullPage: true });
      else await page.locator('.page-step[aria-label="다음"]').click();
    }
    assert.deepEqual(seen, catalog.ids);
    assert.deepEqual(pictured, catalog.illustrated);
    for (const id of ['material:yard', 'material:zoom_out_map']) {
      await page.goto(origin + '#/dictionary?shelf=icon&detail=' + encodeURIComponent(id));
      const picture = page.locator('dialog .illustrated-icon');
      await picture.evaluate(img => img.decode());
      assert.equal(await picture.evaluate(img => img.naturalWidth), 512);
      assert.equal(await page.locator('dialog .detail-art svg, dialog .glyph-ref svg, dialog [data-download-glyph]').count(), 0);
      // One download link; the format menu switches it between PNG and WebP.
      assert.equal(await page.locator('dialog a[download]').count(), 1);
      assert.equal(await page.locator('dialog [data-icon-format] option').count(), 2);
      const asset = await page.evaluate(id => Pattove.references.payload(id), id);
      assert.equal(asset.status, 'asset-ready');
      assert.ok(asset.assets.png.endsWith('.png') && asset.assets.webp.endsWith('.webp') && !asset.assets.svg);
      await page.screenshot({ path: path.join(out, id.replace(':','-') + '-illustration.png') });
    }
    assert.deepEqual(errors, []);
    console.log(`${catalog.pages} pages: ${pictured.length} illustrated, ${catalog.pending.length} still pending, ${catalog.guidelines.length} guidelines; no SVG substitutions or removed subjects.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
