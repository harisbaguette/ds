const { chromium, firefox, webkit } = require('playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.PATTOVE_TEST_URL || 'http://127.0.0.1:4173/';
const out = path.resolve(__dirname, '../test-results/responsive');
fs.mkdirSync(out, { recursive:true });
const checks = [], errors = [];
const check = (label, value) => { assert.ok(value, label); checks.push(label); };
const settle = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const noOverflow = page => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
const inViewport = locator => locator.evaluate(el => {
  const r = el.getBoundingClientRect();
  return r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight;
});
const sameRow = (page, selector) => page.locator(selector).evaluateAll(nodes => {
  const [a,b] = nodes.map(node => node.getBoundingClientRect());
  return a && b && Math.abs(a.top - b.top) < 1 && b.left >= a.right;
});

(async () => {
  for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await engine.launch({ headless:true });
    try {
      const page = await browser.newPage({ viewport:{width:375,height:812}, reducedMotion:'reduce' });
      page.on('pageerror', error => errors.push(name + ': ' + error.message));
      const goto = async route => {
        await page.goto(base + '#/' + route);
        await page.evaluate(() => document.fonts.ready);
        await settle(page);
      };
      // A page can have no overflow while making every specimen too small to read.
      await goto('patterns');
      check(name + ' phone patterns use the full row', await page.locator('.pattern-card').evaluateAll(nodes => {
        const [a,b] = nodes.map(node => node.getBoundingClientRect());
        return a.width >= 320 && Math.abs(a.left-b.left) < 1 && b.top >= a.bottom;
      }));
      check(name + ' phone pattern specimens remain full size', await page.locator('.pattern-card [data-preview-scene]').evaluateAll(nodes => nodes.length === 12 && nodes.every(node => node.getBoundingClientRect().width / node.offsetWidth >= .95)));
      await page.screenshot({ path:path.join(out, name + '-patterns-375.png') });
      for (const width of [768,1440,320,375]) {
        await page.setViewportSize({width,height:900}); await settle(page);
        check(name + ' patterns resize without reload at ' + width, await noOverflow(page) && await sameRow(page, '.pattern-card') === (width >= 768));
        check(name + ' patterns remain readable at ' + width, await page.locator('.pattern-card [data-preview-scene]').evaluateAll(nodes => nodes.every(node => node.getBoundingClientRect().width / node.offsetWidth >= .8)));
      }
      await goto('dictionary?shelf=part');
      check(name + ' phone dictionary uses the full row', !await sameRow(page, '.dict-entry') && await page.locator('.dict-entry').first().evaluate(el => el.getBoundingClientRect().width >= 320));
      await page.setViewportSize({width:768,height:900}); await settle(page);
      check(name + ' tablet dictionary uses multiple columns', await sameRow(page, '.dict-entry'));
      await page.screenshot({ path:path.join(out, name + '-dictionary-768.png') });
      for (const width of [768,1024,1100]) {
        await page.setViewportSize({width,height:900}); await settle(page);
        check(name + ' tablet menu stays out of the content at ' + width, !await page.locator('#app-menu').isVisible() && await page.locator('#menu-toggle').isVisible() && await page.locator('#main').evaluate(el => el.getBoundingClientRect().left === 0));
        await page.locator('#menu-toggle').click();
        check(name + ' tablet drawer opens within the viewport at ' + width, await inViewport(page.locator('#app-menu')) && await page.locator('#main').evaluate(el => el.inert));
        await page.keyboard.press('Escape');
        check(name + ' tablet drawer restores focus at ' + width, await page.locator('#menu-toggle').evaluate(el => el === document.activeElement) && !await page.locator('#main').evaluate(el => el.inert));
      }
      // Crossing the drawer boundary must not leave hidden focus or an inert page.
      await page.locator('#menu-toggle').click();
      await page.setViewportSize({width:1440,height:900}); await settle(page);
      check(name + ' open drawer becomes desktop menu without locking the page', await page.locator('#app-menu').isVisible() && !await page.locator('#main').evaluate(el => el.inert) && await page.locator('#menu-toggle').getAttribute('aria-expanded') === 'false');
      await page.locator('#secondary-nav a').first().focus();
      await page.setViewportSize({width:768,height:900}); await settle(page);
      check(name + ' desktop menu focus moves to the visible tablet toggle', await page.locator('#menu-toggle').evaluate(el => el === document.activeElement));
      await page.setViewportSize({width:1440,height:900}); await settle(page);
      check(name + ' hidden tablet toggle releases focus to the page title', await page.locator('#page-title').evaluate(el => el === document.activeElement));
      await page.locator('#rail-toggle').click();
      await page.setViewportSize({width:768,height:900}); await page.locator('#menu-toggle').click();
      check(name + ' collapsed desktop rail does not hide tablet categories', await page.locator('#secondary-nav a').first().isVisible());
      await page.keyboard.press('Escape');
      await page.evaluate(() => { localStorage.removeItem('pattove-rail'); document.documentElement.classList.remove('rail'); });

      for (const viewport of [{width:667,height:320},{width:375,height:280}]) {
        await page.setViewportSize(viewport); await goto('dictionary');
        await page.locator('#search-open').click(); await page.locator('#query').fill('버튼');
        const count = await page.locator('#search-suggestions .search-suggestion:visible').count();
        check(name + ' search fits a short viewport ' + JSON.stringify(viewport), count > 1 && await inViewport(page.locator('#search-dialog')));
        await page.locator('#query').focus();
        for (let i=0; i<count; i++) await page.keyboard.press('ArrowDown');
        check(name + ' keyboard selection scrolls into view ' + JSON.stringify(viewport), await inViewport(page.locator('#search-suggestions .search-suggestion:focus')));
        check(name + ' search input and action remain visible while scrolling results', await inViewport(page.locator('#query')) && await inViewport(page.locator('.search-all')));
        await page.keyboard.press('Escape');
        check(name + ' short search returns focus to its opener', await page.locator('#search-open').evaluate(el => el === document.activeElement));
        await goto('patterns?detail=toast');
        check(name + ' detail dialog fits a short viewport ' + JSON.stringify(viewport), await inViewport(page.locator('#detail-dialog')));
      }

      // Scan every registered part as well as collections; tables may scroll inside their own frame.
      await goto('dictionary');
      const items = await page.evaluate(() => Pattove.systemRegistry.items.map(item => item.id));
      const routes = ['styles','styles?detail=main','patterns','dictionary?shelf=part','dictionary?shelf=block','dictionary?shelf=template','dictionary?shelf=icon','dictionary?shelf=token','components', 'dictionary?shelf=part&q=' + encodeURIComponent('긴검색어'.repeat(25))];
      const widths = name === 'chromium' ? [320,375,580,768,1024,1440] : [320,768,1024];
      for (const width of widths) {
        await page.setViewportSize({width,height:900});
        const scan = [...routes, ...(name === 'chromium' ? items : ['button','page','admin-page','record-editor']).map(id => 'system?detail=' + id)];
        for (const route of scan) {
          await goto(route);
          check(name + ' no horizontal page scroll ' + width + ' ' + route, await noOverflow(page));
        }
      }
    } finally { await browser.close(); }
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({checks,errors}, null, 2));
  console.log(checks.length + ' responsive checks passed across Chromium, Firefox and WebKit.');
})().catch(error => { console.error(error); process.exitCode = 1; });
