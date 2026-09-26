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
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(i => !i.closest('details:not([open])')).map(i => i.decode().catch(() => {}))); });
    await page.screenshot({ path: path.join(out, name + '.png') });
  };
  try {
    for (const width of [320, 375, 768, 1101, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of ['styles', 'system', 'patterns?style=ink']) {
        await page.goto(url + '#/' + route);
        check(width + ' ' + route + ' 가로 넘침 없음', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        const navigation = await page.evaluate(() => {
          const links = [...document.querySelectorAll('.primary-nav a')];
          const controls = links;
          return {
            unnamed: links.filter(el => !el.innerText.trim()).map(el => el.getAttribute('aria-label')),
            covered: controls.filter(el => {
              el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
              const r = el.getBoundingClientRect();
              return !el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
            }).map(el => el.getAttribute('aria-label'))
          };
        });
        check(width + ' ' + route + ' 메뉴 이름이 화면에 보임: ' + navigation.unnamed.join(', '), navigation.unnamed.length === 0);
        check(width + ' ' + route + ' 메뉴 클릭 영역 가림 없음: ' + navigation.covered.join(', '), navigation.covered.length === 0);
        check(width + ' ' + route + ' 제목 16px 이하', await page.locator('#page-title').evaluate(e => parseFloat(getComputedStyle(e).fontSize) <= 16));
        check(width + ' ' + route + ' 불필요 조작 제거', await page.locator('[data-view], [data-compare], [data-action="compare-mode"], [data-filter="sort"], .compare-tray, .mobile-nav, .brand span').count() === 0);
        if (route === 'styles') {
          check(width + ' 스타일 진입에서 스타일 카드 격자 표시', await page.locator('.style-card').first().isVisible() && await page.locator('.component-page').count() === 0);
          if ([375,1440].includes(width)) await shot(width + '-styles');
        } else if (route === 'system') {
          check(width + ' 부품 진입에서 부품 검색과 부품 한 장 표시', await page.locator('.search-area').isVisible() && await page.locator('.component-page').isVisible() && await page.locator('.system-board').count() === 0);
          if ([375,1440].includes(width)) await shot(width + '-system');
        } else if (route.startsWith('patterns')) {
          check(width + ' 첫 그리드 즉시 보임', (await page.locator('.pattern-grid').boundingBox()).y < (width <= 760 ? 350 : 150));
          if ([375,1440].includes(width)) await shot(width + '-ink');
          await page.evaluate(() => scrollTo(0, 500));
          const categoryObscured = await page.locator('.category').first().evaluate(el => {
            const r = el.getBoundingClientRect();
            const header = document.querySelector('.app-header').getBoundingClientRect();
            return (r.left < header.right && r.top < header.bottom - 1) || [r.top + 4, r.bottom - 4].some(y => !el.contains(document.elementFromPoint(r.x + r.width / 2, y)));
          });
          check(width + ' 스크롤 뒤 분류 버튼 위아래가 가려지지 않음', !categoryObscured);
          check(width + ' 불필요한 스타일 선택 UI 없음', await page.locator('#style-switch,#style-menu').count() === 0);
          await page.evaluate(() => scrollTo(0, 0));
          await page.locator('[data-open="toast"]').click();
          check(width + ' 상세 넘침 없음', await page.locator('#detail-dialog').evaluate(e => e.scrollWidth <= e.clientWidth));
          await page.locator('#detail-dialog .pattern-dictionary-link').focus();
          await page.keyboard.press('Tab');
          check(width + ' 상세 마지막 동작에서 Tab 초점 유지', await page.locator('#detail-dialog').evaluate(e => e.contains(document.activeElement)));
          await page.locator('[data-action="close-dialog"]').focus();
          await page.keyboard.press('Shift+Tab');
          check(width + ' 상세 첫 동작에서 Shift+Tab 초점 유지', await page.locator('#detail-dialog').evaluate(e => e.contains(document.activeElement)));
          if ([375,1440].includes(width)) await shot(width + '-detail');
          await page.keyboard.press('Escape');
          await page.waitForFunction(() => !document.querySelector('dialog').open);
        }
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(url + '#/patterns?style=ink');
    check('메인 스타일의 패턴 유지', await page.locator('.pattern-card .theme-main').count() === 12);
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
