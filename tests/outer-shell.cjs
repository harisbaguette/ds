const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const url = pathToFileURL(path.resolve(__dirname, '../index.html')).href;
const out = path.resolve(__dirname, '../test-results/lean');
fs.mkdirSync(out, { recursive: true });
const checks = [];
const check = (name, value) => { assert.ok(value, name); checks.push(name); };
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(5000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const shot = async name => {
    await page.mouse.move(0, 0);
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
    await page.screenshot({ path: path.join(out, name + '.png') });
  };
  try {
    for (const width of [320, 375, 768, 1101, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of ['styles', 'patterns?style=ink', 'saved']) {
        await page.goto(url + '#/' + route);
        check(width + ' ' + route + ' 가로 넘침 없음', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        check(width + ' ' + route + ' 제목 16px 이하', await page.locator('#page-title').evaluate(e => parseFloat(getComputedStyle(e).fontSize) <= 16));
        check(width + ' ' + route + ' 불필요 조작 제거', await page.locator('[data-view], [data-compare], [data-action="compare-mode"], [data-filter="sort"], .compare-tray, .mobile-nav, .brand span').count() === 0);
        if (route === 'styles') {
          check(width + ' 스타일 입구에 검색과 분류 없음', !(await page.locator('.search-area').isVisible()) && !(await page.locator('#site-navigation').isVisible()));
          if ([375,1440].includes(width)) await shot(width + '-styles');
        } else if (route.startsWith('patterns')) {
          check(width + ' 첫 그리드 즉시 보임', (await page.locator('.pattern-grid').boundingBox()).y < (width <= 760 ? 190 : 110));
          if ([375,1440].includes(width)) await shot(width + '-ink');
          await page.locator('#style-switch').click();
          check(width + ' 스타일 메뉴 가로 넘침 없음', await page.locator('#style-menu').evaluate(e => { const r=e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }));
          if ([375,1440].includes(width)) await shot(width + '-style-menu');
          await page.keyboard.press('Escape');
          check(width + ' 스타일 메뉴 Escape 초점 복귀', await page.locator('#style-switch').evaluate(e => e === document.activeElement) && !(await page.locator('#style-menu').isVisible()));
          await page.locator('[data-open="toast"]').click();
          check(width + ' 상세 넘침 없음', await page.locator('#detail-dialog').evaluate(e => e.scrollWidth <= e.clientWidth));
          if ([375,1440].includes(width)) await shot(width + '-detail');
          await page.keyboard.press('Escape');
          await page.waitForFunction(() => !document.querySelector('dialog').open);
        }
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(url + '#/patterns?style=ink');
    await page.locator('#style-switch').click();
    await page.keyboard.press('ArrowDown');
    check('스타일 메뉴 방향키 이동', await page.locator('[data-apply-style="block"]').evaluate(e => e === document.activeElement));
    await page.keyboard.press('Enter');
    check('키보드로 스타일 전체 전환', await page.locator('.pattern-card .theme-block').count() === 12);
    await shot('1440-block');
    await page.locator('[data-quick-save="toast"]').click();
    await page.locator('[data-quick-save="tabs"]').click();
    await page.locator('#saved-link').click();
    await shot('1440-saved');
    await page.locator('.saved-group-title').click();
    check('저장한 스타일에서 전체 패턴으로 복귀', await page.locator('.pattern-card .theme-block').count() === 12);
    await page.locator('#query').fill('저장 완료');
    await shot('1440-search');
    await page.locator('#clear-search').click();
    await page.locator('#query').press('ArrowDown');
    check('빈 검색에 오래된 제안 초점 없음', !(await page.locator('#query').getAttribute('aria-activedescendant')));
    check('브라우저 오류 없음', errors.length === 0);
    fs.writeFileSync(path.join(out, 'outer.json'), JSON.stringify({ checks, errors }, null, 2));
    console.log(checks.length + ' lean-shell checks passed.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });

