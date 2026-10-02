const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright-core');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'test-results/frontend-icons');
const origin = process.env.PATTOVE_TEST_URL || 'http://127.0.0.1:4173/';
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(origin + '#/styles?detail=main');
    await page.evaluate(() => document.fonts.ready);
    const mapping = JSON.parse(fs.readFileSync(path.join(root, 'src/data/ui-icons.json'), 'utf8'));
    const installed = await page.evaluate(() => Pattove.iconAssets);
    assert.deepEqual(Object.keys(installed), Object.keys(mapping));
    for (const [name, asset] of Object.entries(installed)) {
      assert.equal(asset.entry, mapping[name]);
      assert.ok(fs.existsSync(path.join(root, asset.src)));
    }
    await page.evaluate(() => {
      const panel = document.createElement('section');
      panel.id = 'icon-proof'; panel.className = 'ds';
      panel.style.cssText = 'padding:24px;display:grid;grid-template-columns:repeat(8,1fr);gap:16px;background:#fff';
      panel.innerHTML = Object.entries(Pattove.iconAssets).map(([name, asset]) =>
        '<div style="display:grid;justify-items:center;gap:8px;font-size:12px">' +
        Pattove.uiIcon(name).replace('class="ui-icon"', 'class="ui-icon" style="width:72px;height:72px"') +
        '<b>' + name + '</b><span>' + asset.entry + '</span></div>').join('');
      document.querySelector('main').replaceChildren(panel);
    });
    await page.locator('#icon-proof img').evaluateAll(nodes => Promise.all(nodes.map(node => node.decode())));
    await page.locator('#icon-proof').screenshot({ path: path.join(out, 'mapped-illustrations.png') });
    const checkImages = async selector => {
      const images = await page.locator(selector).evaluateAll(async nodes => {
        await Promise.all(nodes.map(node => node.decode()));
        return nodes.map(node => ({
          icon: node.dataset.uiIcon, entry: node.dataset.illustration, src: node.getAttribute('src'),
          width: node.naturalWidth, alt: node.alt, hidden: node.getAttribute('aria-hidden'),
          square: getComputedStyle(node).width === getComputedStyle(node).height
        }));
      });
      assert.ok(images.length > 0);
      for (const icon of images) {
        assert.equal(icon.width, 192, icon.icon);
        assert.equal(icon.src, installed[icon.icon].src);
        assert.equal(icon.entry, mapping[icon.icon]);
        assert.equal(icon.alt, '');
        assert.equal(icon.hidden, 'true');
        assert.ok(icon.square, icon.icon + ' square');
      }
    };
    await checkImages('#icon-proof img');
    await page.reload();
    await page.evaluate(() => {
      const fixture = document.createElement('section');
      fixture.id = 'parts-proof'; fixture.className = 'ds theme-main';
      fixture.innerHTML = Pattove.systemRegistry.items.map(item =>
        '<div>' + Pattove.parts.renderItem(item.id, 'icon-proof-' + item.id) + '</div>').join('');
      document.querySelector('main').replaceChildren(fixture);
    });
    assert.equal(await page.locator('#parts-proof svg').count(), 0);
    await checkImages('#parts-proof img.ui-icon');
    await page.reload();
    for (const width of [1440, 375]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(origin + '#/styles?detail=main');
      await page.reload();
      await checkImages('img.ui-icon');
      await page.screenshot({ path: path.join(out, 'frontend-' + width + '.png') });
      if (width === 375) {
        await page.locator('#menu-toggle').click();
        await page.locator('.menu-close').waitFor({ state: 'visible' });
        await page.locator('.menu-close').click();
      }
      await page.locator('#search-open').click();
      await page.locator('#query').fill('버튼');
      await checkImages('#search-form img.ui-icon');
      await page.locator('#search-clear').click();
      assert.equal(await page.locator('#query').inputValue(), '');
      await page.keyboard.press('Escape');
      await page.goto(origin + '#/dictionary?shelf=icon');
      await page.locator('.page-step').first().waitFor();
      await checkImages('.page-step img');
      await page.locator('.page-step').last().click();
      await page.waitForFunction(() => document.querySelector('.page-step:last-of-type')?.disabled);
      await checkImages('img.ui-icon');
      assert.ok(await page.locator('.dict-entry.is-illustrated').count() > 0);
      await page.locator('.dict-entry.is-illustrated').first().click();
      await page.locator('dialog[open]').waitFor();
      await checkImages('dialog[open] img.ui-icon');
      assert.equal(await page.locator('dialog[open] a[download]').count(), 2);
      await page.keyboard.press('Escape');
    }
    assert.deepEqual(errors, []);
    console.log('Frontend illustrations: ' + Object.keys(mapping).length + ' mappings, all shared parts, desktop/mobile controls and last-page downloads passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
