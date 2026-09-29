const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright-core');
const sharp = require('sharp');
const out = path.resolve(__dirname, '../test-results/illustrated-icons');
const manifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../assets/icons/illustrated/manifest.json'), 'utf8'));
const expected = [...manifest.batches.flatMap(batch => batch.icons.filter(Boolean).map(icon => icon.entry)),...Object.keys(manifest.aliases||{})];
fs.mkdirSync(out, { recursive: true });
(async () => {
  for (const item of manifest.batches.flatMap(batch => batch.icons.filter(Boolean))) {
    const file = path.resolve(__dirname, '../assets/icons/illustrated', item.name + '.png');
    const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(info.width, info.height, item.name + ': square export');
    assert.equal(info.width, 512, item.name + ': PNG size');
    for (const [suffix, size] of [['.webp', 512], ['-192.webp', 192]]) {
      const meta = await sharp(path.resolve(__dirname, '../assets/icons/illustrated', item.name + suffix)).metadata();
      assert.equal(meta.width, size, item.name + suffix + ': width');
      assert.equal(meta.height, size, item.name + suffix + ': height');
      assert.ok(meta.hasAlpha, item.name + suffix + ': transparency');
    }
    let edgePixels = 0;
    for (let y=0; y<info.height; y++) for (let x=0; x<info.width; x++) {
      if ((x<2 || y<2 || x>=info.width-2 || y>=info.height-2) && data[(y*info.width+x)*4+3]>128) edgePixels++;
    }
    assert.equal(edgePixels, 0, item.name + ': no cropped silhouette or neighboring icon at canvas edge');
  }
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/#/dictionary?shelf=icon');
    const artwork = await page.evaluate(() => Pattove.library.entries.filter(e => e.art));
    if (process.argv.includes('--complete')) {
      const missing = await page.evaluate(() => Pattove.library.entries.filter(e => e.category === 'ICO' && e.kind !== '기준' && !e.art).map(e => e.id));
      assert.deepEqual(missing, [], 'Every drawable dictionary meaning has an illustration');
      const queue = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../assets/icons/illustrated/production.json'), 'utf8'));
      assert.ok(queue.jobs.every(job => job.status === 'imported'), 'Every production sheet is imported');
    }
    assert.deepEqual(artwork.map(e => e.id).sort(), expected.slice().sort());
    const visibleCount=Math.min(expected.length,96);
    while (await page.locator('.is-illustrated').count() < visibleCount) await page.locator('[data-action="load-more"]').click();
    assert.equal(await page.locator('.is-illustrated').count(), visibleCount);
    await page.locator('.is-illustrated img').evaluateAll(images => Promise.all(images.map(img => { img.loading='eager'; return img.decode(); })));
    assert.ok(await page.locator('.is-illustrated img').evaluateAll(images => images.every(img => { const r=img.getBoundingClientRect(), p=img.parentElement.getBoundingClientRect(); return r.top>=p.top && r.bottom<=p.bottom+1; })), 'Thumbnails fit without clipping');
    assert.ok(await page.locator('.is-illustrated .dict-thumb').evaluateAll(els => els.every(el => { const r=el.getBoundingClientRect(); return Math.abs(r.width-r.height)<1; })), 'Thumbnail canvases are square');
    await page.screenshot({ path: path.join(out, 'desktop.png'), fullPage: true });
    await page.locator('.illustrated-collection').screenshot({ path: path.join(out, 'collection.png') });
    const samples=artwork.length<=48?artwork:[artwork[0],...new Map(artwork.map(e=>[e.sub,e])).values()];
    for (const entry of samples) {
      await page.goto('http://127.0.0.1:4173/#/dictionary?shelf=icon&detail='+entry.id);
      const img = page.locator('dialog .illustrated-icon');
      await img.evaluate(img => img.decode());
      assert.equal(await img.evaluate(img => img.naturalWidth), 512);
      assert.equal(await img.evaluate(img => img.naturalHeight), 512);
      assert.equal(await page.locator('dialog .detail-art.is-todo').count(), 0);
      for (const ext of ['png', 'webp']) {
        const link = page.locator(`dialog a[download][href$=".${ext}"]`);
        const response = await page.request.get(new URL(await link.getAttribute('href'), page.url()).href);
        assert.equal(response.status(), 200);
        assert.match(response.headers()['content-type'], new RegExp('image/' + ext));
        assert.ok((await response.body()).length > 100);
        // Exercise both formats once; repeated rapid downloads trigger Chromium's download limiter.
        if (entry.id === 'ICO-01') {
          const event = page.waitForEvent('download');
          await link.click();
          const download = await event;
          assert.equal(await download.failure(), null);
          assert.ok(fs.statSync(await download.path()).size > 100);
        }
      }
      if (entry.id === 'ICO-01') await page.screenshot({ path: path.join(out, 'detail.png') });
      await page.keyboard.press('Escape');
    }
    await page.goto('http://127.0.0.1:4173/#/dictionary?shelf=icon&q=ICO-62');
    // ID search is partial: ICO-62 also matches ICO-620 through ICO-629.
    const searchMatches=artwork.filter(entry => entry.id.includes('ICO-62'));
    assert.equal(await page.locator('.is-illustrated').count(), searchMatches.length);
    await page.locator('.is-illustrated[data-library-entry="ICO-62"]').click();
    assert.match(await page.locator('#detail-title').textContent(), /검색/);
    for (const width of [320, 375, 768]) {
      await page.setViewportSize({ width, height: 950 });
      await page.goto('http://127.0.0.1:4173/#/dictionary?shelf=icon');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (width === 375) await page.screenshot({ path: path.join(out, 'mobile.png'), fullPage: true });
      await page.locator('.is-illustrated').first().click();
      assert.ok(await page.locator('#detail-dialog').evaluate(el => el.scrollWidth <= el.clientWidth));
    }
    assert.deepEqual(errors, []);
    console.log(`${artwork.length} illustrated entries, all PNG edges, ${samples.length} detail samples, PNG/WebP downloads, search, 3 responsive widths: passed.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
