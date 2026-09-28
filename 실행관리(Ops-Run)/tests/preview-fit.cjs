const { chromium, firefox, webkit } = require('playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const origin = process.env.PATTOVE_TEST_URL || 'http://127.0.0.1:4173/';
const out = path.resolve(__dirname, '../test-results/preview-fit');
fs.mkdirSync(out, { recursive: true });
const checks = [], errors = [];

// Page overflow is insufficient: a card may clip its contents without widening the page.
async function inspect(page, label) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const failures = await page.evaluate(() => {
    const result = [];
    const contains = (outer, inner, name, vertical = true) => {
      const a = outer.getBoundingClientRect(), b = inner.getBoundingClientRect();
      if (b.left < a.left - 1 || b.right > a.right + 1 || (vertical && (b.top < a.top - 1 || b.bottom > a.bottom + 1))) {
        result.push({ name, outer: a.toJSON(), inner: b.toJSON() });
      }
    };
    document.querySelectorAll('.overview-preview .ds-bottom-nav, .dict-thumb .ds-bottom-nav, .variant-frame .ds-bottom-nav').forEach(nav => {
      for (const item of nav.children) contains(nav, item, 'navigation: ' + item.textContent.trim());
      const tray = nav.closest('.overview-preview, .dict-thumb, .variant-frame');
      contains(tray, nav, 'navigation tray');
    });
    document.querySelectorAll('.variant-phone').forEach(phone => contains(phone.parentElement, phone, 'whole phone'));
    document.querySelectorAll('[data-preview-scene]').forEach(scene => contains(scene.parentElement, scene, 'fitted scene', scene.dataset.previewFit === 'both'));
    const buttons = [...document.querySelectorAll('.overview-actions > button')];
    if (buttons.length && buttons.some(b => Math.abs(b.getBoundingClientRect().top - buttons[0].getBoundingClientRect().top) > 1)) result.push('overview buttons wrap');
    if (document.documentElement.scrollWidth > innerWidth) result.push('page overflow');
    return result;
  });
  assert.deepEqual(failures, [], label);
  checks.push(label);
}

(async () => {
  for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await engine.launch({ headless: true });
    try {
      const page = await browser.newPage({ viewport: { width: 768, height: 900 }, deviceScaleFactor: 1.25, reducedMotion: 'reduce' });
      page.on('pageerror', error => errors.push(name + ': ' + error.message));
      await page.goto(origin + '#/styles');
      await page.evaluate(() => document.fonts.ready);
      // Resize the same document across both breakpoints, then grow again. No reload may be required.
      for (const width of [768, 761, 800, 955, 1100, 1101, 1200, 1440, 760, 390, 320, 1440, 768]) {
        await page.setViewportSize({ width, height: 900 });
        await inspect(page, name + ' overview ' + width);
      }
      await page.evaluate(() => scrollTo(0, 160));
      await page.screenshot({ path: path.join(out, name + '-overview-768.png') });
      await page.locator('[data-focus="overview-bottom-nav"]').click();
      assert.equal(await page.locator('#detail-title').innerText(), '하단 탐색');
      await page.locator('[data-variant-pick="float"]').click();
      assert.equal(await page.locator('.part-demo .ds-bottom-nav > button').count(), 5);
      const live = page.locator('.part-demo .ds-bottom-nav > button').nth(1);
      await live.click();
      assert.equal(await live.getAttribute('aria-pressed'), 'true');
      checks.push(name + ' full-size navigation remains interactive');
      for (const width of [320, 768, 955, 1101, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        for (const route of ['dictionary?shelf=part', 'dictionary?shelf=block', 'dictionary?shelf=template', 'system?detail=bottom-nav', 'system?detail=page']) {
          await page.goto(origin + '#/' + route);
          await inspect(page, name + ' ' + width + ' ' + route);
        }
      }
    } finally { await browser.close(); }
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ checks, errors }, null, 2));
  console.log(checks.length + ' preview containment checks passed across Chromium, Firefox and WebKit.');
})().catch(error => { console.error(error); process.exitCode = 1; });
