const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.PATTOVE_TEST_URL || 'http://127.0.0.1:4173/';
const out = path.resolve(__dirname, '../test-results/ui-layout');
fs.mkdirSync(out, { recursive: true });
const checks = [], errors = [], measurements = [];
const check = (label, pass) => { assert.ok(pass, label); checks.push(label); };

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    const goto = async route => {
      await page.goto(base + '#/' + route);
      await page.evaluate(() => document.fonts.ready);
      await page.mouse.move(0, 0);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    };
    for (const width of [320, 375, 500, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await goto('dictionary?shelf=part');
      check(width + ' 상단 메뉴 여섯 개가 모두 보이고 터치 가능', await page.locator('#primary-nav a').evaluateAll(links => links.length === 6 && links.every(link => {
        const r = link.getBoundingClientRect();
        return r.width >= 44 && r.height >= 44 && r.left >= 0 && r.right <= innerWidth;
      })));
      check(width + ' 짧은 버튼 문구는 한 줄이고 서로 겹치지 않음', await page.locator('.dict-thumb [data-kind="button"] button').evaluateAll(buttons => buttons.length === 3 && buttons.every((button, i) => {
        const range = document.createRange(); range.selectNodeContents(button);
        const r = button.getBoundingClientRect(), text = range.getBoundingClientRect();
        const next = buttons[i + 1]?.getBoundingClientRect();
        return text.height <= parseFloat(getComputedStyle(button).lineHeight) + 1 &&
          text.left >= r.left && text.right <= r.right && (!next || next.left >= r.right || next.top >= r.bottom);
      })));
      check(width + ' 목록의 다음 카드까지 첫 화면에서 비교 가능', await page.locator('.dict-entry').nth(1).evaluate(el => el.getBoundingClientRect().bottom <= innerHeight));
      check(width + ' 제목과 메타데이터의 위계 구분', await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#page-title')).fontSize) > parseFloat(getComputedStyle(document.querySelector('.dict-entry .dict-term')).fontSize)));
      check(width + ' 스타일 선택창 펼침 표시 중복 없음', await page.locator('.preview-style-field .ui-icon').count() === 0);
      check(width + ' 검색 범위가 아이콘 옆에 보임', await page.locator('#search-label').isVisible() && await page.locator('#search-label').innerText() === '부품 검색');
      check(width + ' 검색 문구가 잘리지 않음', await page.locator('#search-label').evaluate(el => el.scrollWidth <= el.clientWidth));
      if (width <= 1100) {
        check(width + ' 분류와 미리보기 선택이 같은 행과 높이로 정렬됨', await page.evaluate(() => {
          const category = document.querySelector('#menu-toggle').getBoundingClientRect();
          const preview = document.querySelector('[data-preview-select]').getBoundingClientRect();
          return Math.abs(category.top - preview.top) < 1 && Math.abs(category.height - preview.height) < 1 && category.height >= 44 && category.right < preview.left;
        }));
        check(width + ' 분류와 미리보기의 용도가 표시됨', await page.locator('#category-label').innerText() === '부품 분류' && await page.locator('.preview-style .toolbar-label').isVisible());
        await page.locator('#menu-toggle').click();
        const category = page.locator('#secondary-nav .nav-subcategory').first();
        const categoryName = (await category.innerText()).trim();
        await category.click();
        check(width + ' 선택한 분류를 메뉴 버튼에 표시하고 목록으로 복귀', await page.locator('#category-current').innerText() === categoryName && !await page.locator('#app-menu').isVisible());
        await page.locator('#menu-toggle').click();
        await page.locator('#secondary-nav .nav-all').click();
        check(width + ' 전체 보기로 돌아오면 분류 표시도 갱신', await page.locator('#category-current').innerText() === '전체 보기');
      }
      if ([375, 500, 1440].includes(width)) await page.screenshot({ path: path.join(out, 'parts-' + width + '.png') });

      check(width + ' 기존 선택 탭의 채움과 입체감 유지', await page.locator('#primary-nav [aria-current]').evaluate(el => {
        const style = getComputedStyle(el);
        return style.backgroundColor === 'rgb(48, 59, 72)' && style.boxShadow !== 'none';
      }));
      await goto('system?detail=button');
      check(width + ' 기존 버튼 모서리와 그림자 유지', await page.locator('.variant-card .ds-button').first().evaluate(el => {
        const style = getComputedStyle(el);
        return style.borderRadius === '16px' && style.boxShadow.includes('inset');
      }));
      const detail = await page.locator('.variant-card').evaluateAll(cards => cards.map(card => ({ height: card.getBoundingClientRect().height, preview: card.querySelector('.variant-frame').getBoundingClientRect().height, reference: card.querySelector('.element-reference').getBoundingClientRect().height })));
      measurements.push({ width, detail });
      check(width + ' 버튼 견본과 보조 ID 행의 높이를 제한', detail.every(card => card.preview >= 120 && card.preview <= 180 && card.reference <= 64));
      check(width + ' 두 번째 모양의 버튼이 첫 화면에 보임', await page.locator('.variant-card .variant-frame .ds-button').nth(1).evaluate(el => el.getBoundingClientRect().bottom <= innerHeight));
      await page.locator('[data-variant-pick="outline"]').click();
      check(width + ' 모양을 선택하면 상태가 바뀜', await page.locator('[data-variant-pick="outline"]').getAttribute('aria-pressed') === 'true');
      await page.reload();
      check(width + ' 선택한 모양이 새로고침 뒤에도 유지됨', await page.locator('[data-variant-pick="outline"]').getAttribute('aria-pressed') === 'true');
      await page.locator('[data-variant-pick="primary"]').click();
      await page.mouse.move(0, 0);
      if ([375, 500, 1440].includes(width)) await page.screenshot({ path: path.join(out, 'button-' + width + '.png') });

      await goto('styles');
      check(width + ' 원래 휴대폰 견본을 유지하고 영역 높이만 제한', await page.locator('.style-card .variant-phone').count() === 1 && await page.locator('.style-card .dict-thumb').evaluate(el => el.getBoundingClientRect().height <= 420));
      if ([375, 500, 1440].includes(width)) {
        check(width + ' 스타일 설명과 상세 진입이 첫 화면에 보임', await page.locator('.style-card-open').evaluate(el => el.getBoundingClientRect().bottom <= innerHeight));
        await page.screenshot({ path: path.join(out, 'styles-' + width + '.png') });
      }
      check(width + ' 가로 넘침 없음', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ checks, measurements, errors }, null, 2));
    console.log(checks.length + ' UI layout checks passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
