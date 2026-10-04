const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.PATTOVE_TEST_URL || 'http://127.0.0.1:4173/';
const out = path.resolve(__dirname, '../test-results/shell-refinement');
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
    for (const width of [320, 390, 500, 768, 1120, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await goto('dictionary?shelf=part');
      check(width + ' 상단 메뉴 일곱 개가 한 줄이며 작은 화면에서 가로 스크롤 가능', await page.locator('#primary-nav a').evaluateAll(links => links.length === 7 && links.every(link => {
        const r = link.getBoundingClientRect();
        return r.width >= 44 && r.height >= 44 && (innerWidth<=760 || (r.left >= 0 && r.right <= innerWidth)) && Math.abs(r.top - links[0].getBoundingClientRect().top) < 1;
      })));
      check(width + ' 브랜드는 이름 없이 심볼만 표시', await page.locator('.top-brand').innerText() === '' && await page.locator('.top-brand img').isVisible());
      if (width > 1100) check(width + ' 상단 메뉴와 본문 시작선 정렬', await page.evaluate(() => Math.abs(document.querySelector('#primary-nav a').getBoundingClientRect().left - document.querySelector('#content').getBoundingClientRect().left) < 1));
      check(width + ' 짧은 버튼 문구는 한 줄이고 서로 겹치지 않음', await page.locator('.dict-thumb [data-kind="button"] button').evaluateAll(buttons => buttons.length === 3 && buttons.every((button, i) => {
        const range = document.createRange(); range.selectNodeContents(button);
        const r = button.getBoundingClientRect(), text = range.getBoundingClientRect();
        const next = buttons[i + 1]?.getBoundingClientRect();
        return text.height <= parseFloat(getComputedStyle(button).lineHeight) + 1 &&
          text.left >= r.left && text.right <= r.right && (!next || next.left >= r.right || next.top >= r.bottom);
      })));
      check(width + ' 모든 목록 견본은 1:1', await page.locator('.dict-thumb').evaluateAll(nodes => nodes.every(n => { const r=n.getBoundingClientRect(); return Math.abs(r.width-r.height)<1.5; })));
      check(width + ' 견본이 48개를 넘으면 쪽 막대 표시', await page.locator('.pagination').count() === (await page.evaluate(()=>Pattove.systemRegistry.items.filter(i=>i.browse.shelf==='part').length)>48?1:0));
      await page.locator('[data-action="toggle-specimens"]').click();
      check(width + ' 쪽이 여럿이면 페이지 이동은 첫 화면 하단에 표시', await page.locator('.pagination').evaluate(n => { const r=n.getBoundingClientRect(); return r.top>0 && Math.abs(r.bottom-innerHeight)<1; }));
      await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
      check(width + ' 마지막 카드가 하단 페이지 이동에 가리지 않음', await page.evaluate(() => document.querySelector('.dict-entry:last-child').getBoundingClientRect().bottom <= document.querySelector('.pagination').getBoundingClientRect().top));
      await page.locator('.page-step[aria-label="다음"]').click();
      await page.waitForURL(/p=2/);
      check(width + ' 하단 다음 버튼으로 이동 후 현재 페이지와 스크롤 갱신', await page.evaluate(() => scrollY === 0) && await page.locator('.page-num[aria-current]').innerText() === '2');
      await page.reload();
      check(width + ' 새로고침해도 현재 페이지 유지', await page.locator('.page-num[aria-current]').innerText() === '2');
      await goto('dictionary?shelf=part');
      check(width + ' 제목과 개수의 위계 구분', await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#page-title')).fontSize) > parseFloat(getComputedStyle(document.querySelector('.collection-count')).fontSize)));
      check(width + ' 스타일 선택창 펼침 표시 중복 없음', await page.locator('.preview-style-field .ui-icon').count() === 0);
      check(width + ' 검색은 아이콘만 보이며 접근 가능한 이름과 터치 영역 유지', await page.locator('#search-open').evaluate(n => n.textContent.trim() === '' && n.getAttribute('aria-label') === '부품 검색' && n.getBoundingClientRect().width >= 44 && n.getBoundingClientRect().height >= 44));
      await page.locator('#search-open').click();
      check(width + ' 검색 아이콘이 검색창을 열고 초점 이동', await page.locator('#query').evaluate(n => n === document.activeElement));
      await page.keyboard.press('Escape');
      check(width + ' 검색을 닫으면 아이콘으로 초점 복귀', await page.locator('#search-open').evaluate(n => n === document.activeElement));
      if (width <= 1100) {
        check(width + ' 분류와 견본 필터가 같은 행과 높이로 정렬됨', await page.evaluate(() => {
          const category = document.querySelector('#menu-toggle').getBoundingClientRect();
          const preview = document.querySelector('.specimen-filter').getBoundingClientRect();
          return Math.abs(category.top - preview.top) < 1 && Math.abs(category.height - preview.height) < 1 && category.height >= 44 && category.right < preview.left;
        }));
        check(width + ' 분류와 견본 필터의 접근 가능한 이름 유지', await page.locator('#category-label').innerText() === '부품 분류' && await page.getByRole('switch',{name:'견본 있음'}).getAttribute('aria-checked') === 'true');
        await page.locator('#menu-toggle').click();
        const category = page.locator('#secondary-nav .nav-subcategory').first();
        const categoryName = (await category.innerText()).trim();
        await category.click();
        check(width + ' 선택한 분류를 메뉴 버튼에 표시하고 목록으로 복귀', await page.locator('#category-current').innerText() === categoryName && !await page.locator('#app-menu').isVisible());
        await page.locator('#menu-toggle').click();
        await page.locator('#secondary-nav .nav-all').click();
        check(width + ' 전체 보기로 돌아오면 분류 표시도 갱신', await page.locator('#category-current').innerText() === '전체 보기');
      }
      await page.locator('#main').focus();
      await page.screenshot({ path: path.join(out, 'parts-' + width + '.png') });

      check(width + ' 상단 선택은 채움·그림자 없이 밑줄로 표시', await page.locator('#primary-nav [aria-current]').evaluate(el => {
        const style = getComputedStyle(el);
        return style.backgroundColor === 'rgba(0, 0, 0, 0)' && style.boxShadow === 'none' && parseFloat(getComputedStyle(el,'::after').height)>0;
      }));
      await goto('system?detail=button');
      check(width + ' 기존 버튼 모서리와 그림자 유지', await page.locator('.variant-card .ds-button').first().evaluate(el => {
        const style = getComputedStyle(el);
        return style.borderRadius === '16px' && style.boxShadow.includes('inset');
      }));
      const detail = await page.locator('.variant-card[data-variant-card]').evaluateAll(cards => cards.map(card => ({ height: card.getBoundingClientRect().height, previewWidth:card.querySelector('.variant-frame').getBoundingClientRect().width, preview: card.querySelector('.variant-frame').getBoundingClientRect().height, reference: card.querySelector('.element-reference').getBoundingClientRect().height })));
      measurements.push({ width, detail });
      // Phones draw button rows in a wide, short 5:3 box so the enlarge badge stays clear of the button; wider screens keep 1:1.
      const ratio = width <= 760 ? 3 / 5 : 1;
      check(width + ' 상세의 모양 견본 비율(휴대폰 5:3, 그 밖 1:1)이며 복사는 견본 밖에 표시', detail.every(card => Math.abs(card.preview-card.previewWidth*ratio)<1.5 && card.reference <= 64));
      if(width>760) {
      await page.locator('[data-variant-pick="outline"]').click();
      check(width + ' 모양을 선택하면 상태가 바뀜', await page.locator('[data-variant-pick="outline"]').getAttribute('aria-pressed') === 'true');
      await page.reload();
      check(width + ' 선택한 모양이 새로고침 뒤에도 유지됨', await page.locator('[data-variant-pick="outline"]').getAttribute('aria-pressed') === 'true');
      await page.locator('[data-variant-pick="primary"]').click();
      } else {
        check(width + ' 모바일은 선택 단계 없이 모양별로 바로 복사', await page.locator('[data-copy-reference="button/variant/outline"]').isVisible());
      }
      await page.mouse.move(0, 0);
      await page.screenshot({ path: path.join(out, 'button-' + width + '.png') });
      if (width > 1100) {
        check(width + ' 긴 좌측 메뉴가 한 줄 안에 전부 표시', await page.locator('.nav-minor span, .nav-subcategory span').evaluateAll(nodes => nodes.every(n => n.scrollWidth <= n.clientWidth + 1 && n.clientHeight <= parseFloat(getComputedStyle(n).lineHeight) + 1)));
      }

      await goto('dictionary?shelf=part&group=selection');
      check(width + ' 한 페이지 목록은 쪽 막대를 숨김', await page.locator('.pagination').count() === 0 && await page.locator('.dict-entry').count() > 0);

      await goto('styles');
      check(width + ' 첫 스타일 목록도 견본을 정사각형으로 표시', await page.locator('.style-card .variant-phone').count() === 1 && await page.locator('.style-card .dict-thumb').evaluate(el => { const r=el.getBoundingClientRect(); return Math.abs(r.width-r.height)<1.5; }));
      check(width + ' 스타일 하나뿐인 목록은 쪽 막대를 숨김', await page.locator('.pagination').count() === 0);
      if ([390, 500, 1440].includes(width)) {
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
