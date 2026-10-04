// Regression checks for the 2026-10-04 front-end UX audit: each block is one finding that was fixed.
const { chromium, firefox, webkit } = require('playwright-core');
const assert = require('node:assert/strict');
const base = process.env.PATTOVE_TEST_URL || 'http://127.0.0.1:4173/';
let count = 0;
const check = (value, name) => { assert.ok(value, name); count++; };
const backToPage = page => page.waitForFunction(() => !document.querySelector('#search-dialog').open && document.activeElement?.id === 'search-open');

(async () => {
  for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await engine.launch();
    try {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
      await context.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.copied = text; } } }));
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.setDefaultTimeout(10000);
      const go = async route => { await page.goto(base + '#/' + route); await page.locator('#page-title').waitFor({ state: 'attached' }); await page.evaluate(() => new Promise(r => requestAnimationFrame(r))); };

      // 1. Operator rule: the screen shows pictures to pick and check; no install commands, downloads, usage conditions or shadcn.
      await go('styles');
      for (const id of await page.evaluate(() => Pattove.systemRegistry.items.filter(item => item.provenance).map(item => item.id))) {
        await go('system?detail=' + id);
        const text = (await page.locator('main').innerText()).toLowerCase();
        check(await page.locator('.component-install, main a[download], main pre').count() === 0 && !text.includes('shadcn') && !text.includes('사용 조건'), name + ' ' + id + ' detail has no install, download or conditions');
      }
      await go('motion?detail=aurora');
      check(await page.locator('.motion-conditions, .motion-files, .motion-code-disclosure, #motion-code, [data-motion-download]').count() === 0, name + ' motion detail has no conditions, download or code view');
      check(await page.locator('[data-motion-copy]').innerText() === 'AI용 정보 복사', name + ' motion keeps the AI copy');

      // 2. An address that names nothing shows "찾을 수 없음" and a way to search, never some other item.
      for (const route of ['system?detail=zzz-nothing', 'system?detail=text-field', 'system?detail=modal', 'nope', 'dictionary?shelf=bogus', 'dictionary?shelf=part&detail=NOPE-1', 'motion?detail=zzz', 'styles?detail=zzz']) {
        await go(route);
        check(await page.locator('#page-title').innerText() === '찾을 수 없음' && page.url().endsWith('#/' + route) && await page.locator('.component-page, .motion-detail, .style-page, .dict-entry').count() === 0, name + ' not found: ' + route);
      }
      await go('system?detail=text-field');
      await page.locator('[data-action="open-search"]').click();
      check(await page.locator('#search-dialog').evaluate(d => d.open) && await page.locator('#query').inputValue() === 'text field', name + ' not found opens search with the missing name');
      await page.keyboard.press('Escape');

      // 3. Typing in the enlarged specimen and pressing Enter keeps the window open.
      await go('system?detail=page');
      await page.locator('[data-variant-preview]').first().click();
      const field = page.locator('#variant-dialog input[name="query"]');
      await field.click(); await page.keyboard.type('여름'); await page.keyboard.press('Enter');
      await page.waitForTimeout(150);
      check(await page.locator('#variant-dialog').evaluate(d => d.open) && await field.evaluate(n => n === document.activeElement) && page.url().endsWith('#/system?detail=page'), name + ' Enter inside the enlarged specimen keeps the window');
      await page.keyboard.press('Escape');
      check(!await page.locator('#variant-dialog').evaluate(d => d.open), name + ' Escape still closes the enlarged view');

      // 4. Search → detail → Back returns like a card: search closed, same scroll, focus on the search button.
      await go('dictionary?shelf=part');
      await page.evaluate(() => scrollTo(0, 1400)); const listY = await page.evaluate(() => scrollY);
      await page.keyboard.press('/'); await page.locator('#query').fill('버튼');
      await page.locator('[data-suggest-open="button"]').click(); await page.waitForURL(/detail=button/);
      await page.goBack(); await backToPage(page);
      check(Math.abs(await page.evaluate(() => scrollY) - listY) < 2 && page.url().endsWith('shelf=part'), name + ' back from a searched item restores the list scroll');

      // 5. Searching keeps 견본 있음; items without a specimen come after the results.
      await page.keyboard.press('/'); await page.locator('#query').fill('입력'); await page.locator('#query').press('Enter');
      await page.waitForURL(/q=/);
      check(!page.url().includes('available=all') && await page.locator('.is-todo').count() === 0 && await page.locator('[data-action="toggle-specimens"]').getAttribute('aria-checked') === 'true', name + ' search keeps 견본 있음');
      await page.locator('#query-chip').click();
      check(!page.url().includes('q=') && !page.url().includes('available=all'), name + ' clearing the search keeps 견본 있음');
      await go('dictionary?shelf=part&available=all&q=' + encodeURIComponent('입력'));
      check(await page.locator('.dict-entry').evaluateAll(nodes => { const first = nodes.findIndex(n => !n.classList.contains('is-built')); return first > 0 && nodes.slice(first).every(n => !n.classList.contains('is-built')); }), name + ' unbuilt matches follow the built ones');

      // 6. The specimen switch replaces the history entry; turning a page adds one.
      await go('dictionary?shelf=part');
      let length = await page.evaluate(() => history.length);
      for (let i = 0; i < 4; i++) await page.locator('[data-action="toggle-specimens"]').click();
      check(await page.evaluate(() => history.length) === length, name + ' switch adds no history');
      await go('dictionary?shelf=icon'); length = await page.evaluate(() => history.length);
      await page.locator('.page-step[aria-label="다음"]').click(); await page.waitForURL(/p=2/);
      check(await page.evaluate(() => history.length) === length + 1, name + ' next page adds history');
      await page.goBack(); await page.waitForFunction(() => !location.hash.includes('p=2'));
      check(await page.locator('.page-num[aria-current="true"]').innerText() === '1', name + ' Back returns to the previous page');

      // 8. A number past the last page goes to the last page and says so.
      await page.locator('.page-jump input').fill('200'); await page.locator('.page-jump input').press('Enter');
      await page.waitForURL(/p=152/);
      check((await page.locator('#announcer').textContent()).includes('152쪽'), name + ' out-of-range page is corrected and announced');

      // 7. With 견본 있음 on, no side-menu row leads to an empty list.
      for (const shelf of ['part', 'block', 'token', 'template']) {
        await go('dictionary?shelf=' + shelf);
        const empty = await page.evaluate(() => {
          const ui = Pattove.libraryUI;
          return [...document.querySelectorAll('#secondary-nav a.nav-subcategory, #secondary-nav a.nav-minor')].map(a => new URLSearchParams(a.getAttribute('href').split('?')[1]))
            .filter(params => ui.currentItems({ page: 'dictionary', query: '', filters: ui.readFilters('dictionary', params) }).length === 0).length;
        });
        check(empty === 0, name + ' ' + shelf + ' side menu has no empty rows');
      }

      // 9. Search starts with every menu; with no result its Enter button is off.
      await go('dictionary?shelf=icon');
      await page.keyboard.press('/');
      check(await page.locator('[data-search-scope="all"]').getAttribute('aria-pressed') === 'true', name + ' search scope defaults to 전체');
      await page.locator('#query').fill('button');
      check(await page.locator('.search-result-group[aria-label="부품"]').count() === 1, name + ' icon tab search also finds parts');
      // 13. The search field is a combobox over one listbox of options.
      check(await page.locator('#query').evaluate(n => n.getAttribute('role') === 'combobox' && n.getAttribute('aria-expanded') === 'true' && document.getElementById(n.getAttribute('aria-controls'))?.getAttribute('role') === 'listbox'), name + ' combobox semantics');
      check(await page.evaluate(() => { const owned = document.getElementById('search-listbox').getAttribute('aria-owns').split(' '), rows = [...document.querySelectorAll('.search-suggestion')]; return owned.length === rows.length && rows.every(n => n.getAttribute('role') === 'option' && owned.includes(n.id)); }), name + ' the listbox owns every result as an option');
      await page.locator('#query').fill('zzqqxx');
      check(await page.locator('.search-all').isDisabled() && await page.locator('#query').getAttribute('aria-expanded') === 'false', name + ' no results: Enter button off');
      const before = page.url(); await page.locator('#query').press('Enter');
      check(page.url() === before && await page.locator('#search-dialog').evaluate(d => d.open), name + ' Enter with no results stays');
      await page.keyboard.press('Escape');

      // 13. Only the top menu says "page"; switching screens moves focus to the new title.
      for (const route of ['styles', 'dictionary?shelf=part', 'dictionary?shelf=icon', 'motion', 'system?detail=button']) {
        await go(route);
        check(await page.locator('[aria-current="page"]').evaluateAll(nodes => nodes.filter(n => !n.closest('[aria-hidden="true"], [inert]')).every(n => n.closest('#primary-nav, .content-breadcrumb'))), name + ' aria-current page only on the top menu: ' + route);
      }
      await go('dictionary?shelf=part');
      await page.locator('[data-focus="tab-token"]').click();
      await page.waitForFunction(() => document.activeElement?.id === 'page-title');
      check(await page.evaluate(() => document.activeElement.tagName) === 'H1', name + ' screen change focuses the h1');
      check(await page.locator('.dict-open-arrow').count() === 0, name + ' list cards carry no outside-link arrow');

      // 12. Icons: the pack menu is labelled and its download sits beside it; check boxes take no Tab stop until selecting.
      await go('dictionary?shelf=icon');
      check(await page.locator('label[for="illustration-pack"]').innerText() === '받을 팩' && await page.locator('#illustration-pack + [data-export-pack]').count() === 1, name + ' pack label and download together');
      check(await page.locator('[data-select-illustration]').evaluateAll(nodes => nodes.every(n => n.tabIndex === -1)), name + ' hidden check boxes skipped by Tab');
      const mode = page.locator('[data-selection-mode]');
      check(!await mode.evaluate(n => n.hasAttribute('aria-pressed')), name + ' selection mode announced once (no aria-pressed)');
      await mode.click();
      check(await mode.innerText() === '취소' && await page.locator('[data-clear-illustrations]').innerText() === '선택 해제' && await page.locator('[data-select-illustration]').first().evaluate(n => n.tabIndex === 0), name + ' selecting: 취소 leaves, 선택 해제 empties, boxes tabbable');
      await mode.click();
      await go('dictionary?shelf=icon&detail=ICO-62');
      const download = page.waitForEvent('download'); await page.locator('[data-icon-download]').click();
      check((await download).suggestedFilename() === 'search.png', name + ' icon file named by what it shows');

      // 11. The default is set by a small named button, shows on the list card and can be undone.
      await page.evaluate(() => localStorage.removeItem('pattove-part-choice'));
      await go('system?detail=bottom-nav');
      check(await page.locator('.variant-pick-name').evaluateAll(nodes => nodes.every(n => !n.closest('button'))), name + ' shape names are not buttons');
      await page.locator('[data-variant-pick="float"]').click();
      check(await page.locator('[data-variant-undo]').isVisible(), name + ' saving offers undo');
      await go('dictionary?shelf=part');
      check(await page.locator('.dict-entry:has([data-library-entry="bottom-nav"]) .ds-bottom-nav').getAttribute('data-variant') === 'float', name + ' list card shows the saved default');
      await go('system?detail=bottom-nav');
      await page.locator('[data-variant-pick="pill"]').click(); await page.locator('[data-variant-undo]').click();
      check(await page.locator('[data-variant-pick="float"]').getAttribute('aria-pressed') === 'true' && await page.evaluate(() => JSON.parse(localStorage.getItem('pattove-part-choice'))['bottom-nav']) === 'float', name + ' undo restores the previous default');
      await page.evaluate(() => localStorage.removeItem('pattove-part-choice'));

      // 16. The button page shows its sizes, disabled and loading states.
      await go('system?detail=button');
      check(JSON.stringify(await page.locator('.variant-states .ds-button').evaluateAll(nodes => nodes.map(n => [n.dataset.size, n.disabled, n.getAttribute('aria-busy')]))) === JSON.stringify([['sm', false, null], ['md', false, null], ['lg', false, null], ['md', true, null], ['md', true, 'true']]), name + ' button sizes and states shown');

      // 15. Phones fold the toolbar on detail pages; the page still has its h1.
      await page.setViewportSize({ width: 375, height: 844 });
      for (const route of ['system?detail=button', 'motion?detail=fade-up', 'styles?detail=main']) {
        await go(route);
        check(/heading "[^"]+" \[level=1\]/.test(await page.locator('body').ariaSnapshot()), name + ' 375 h1 present: ' + route);
      }
      check(errors.length === 0, name + ' no script errors: ' + errors.join('; '));
      await context.close();

      // 14. The side menu's space is there before the scripts run, so the first screen does not shift.
      if (name === 'chromium') {
        for (const [width, height] of [[1440, 900], [375, 844]]) for (const route of ['styles', 'dictionary?shelf=icon', 'dictionary?shelf=part', 'motion', 'patterns']) {
          const fresh = await browser.newContext({ viewport: { width, height } });
          await fresh.addInitScript(() => { window.__cls = 0; new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
          const p = await fresh.newPage(); await p.goto(base + '#/' + route, { waitUntil: 'load' }); await p.waitForTimeout(800);
          const cls = await p.evaluate(() => window.__cls);
          check(cls < 0.1, name + ' ' + width + ' ' + route + ' first-screen CLS ' + cls.toFixed(4));
          await fresh.close();
        }
      }
      console.log(name + ' audit fixes passed');
    } finally { await browser.close(); }
  }
  console.log(count + ' audit-fix checks passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
