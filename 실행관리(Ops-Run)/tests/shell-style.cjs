const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const origin = process.env.PATTOVE_TEST_URL || 'http://127.0.0.1:4173/';
const out = path.resolve(__dirname, '../test-results/shell-style');
fs.mkdirSync(out, { recursive: true });
const checks = [], errors = [];
const check = (name, value) => { assert.ok(value, name); checks.push(name); };
const appearance = ['backgroundColor', 'color', 'borderRadius', 'borderColor', 'borderWidth', 'boxShadow', 'fontFamily', 'fontSize', 'fontWeight'];

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    const goto = async route => {
      await page.goto(origin + '#/' + route);
      await page.evaluate(() => document.fonts.ready);
    };
    const compare = async (selector, markup, properties = appearance) => page.evaluate(({ selector, markup, properties }) => {
      const fixture = document.createElement('div');
      fixture.className = 'ds theme-main';
      fixture.innerHTML = markup;
      document.body.append(fixture);
      const actual = getComputedStyle(document.querySelector(selector));
      const expected = getComputedStyle(fixture.firstElementChild);
      const differences = properties.filter(key => actual[key] !== expected[key]).map(key => [key, actual[key], expected[key]]);
      fixture.remove();
      return differences;
    }, { selector, markup, properties });
    const referenceButton = options => page.evaluate(options => Pattove.parts.button({ action: '', ...options }), options);
    const same = async (name, selector, markup, properties) => {
      const differences = await compare(selector, markup, properties);
      check(name + ': ' + JSON.stringify(differences), differences.length === 0);
    };

    await goto('styles?detail=main');
    const outline = await referenceButton({ variant: 'outline', size: 'sm', iconOnly: true });
    await same('검색 단추가 메인 아이콘 버튼과 동일', '#search-open', outline);
    await same('복사 단추가 메인 아이콘 버튼과 동일', '.reference-copy', outline);
    await same('현재 주 메뉴가 메인 선택 탭과 동일', '#primary-nav [aria-current]', '<button class="ds-tab" aria-selected="true">현재</button>');
    await same('현재 하위 메뉴가 메인 선택 탭과 동일', '#secondary-nav [aria-current]', '<button class="ds-tab" aria-selected="true">현재</button>');
    await same('스타일 설명 카드가 공통 표면을 사용', '.overview-tile', '<div class="ds-surface"></div>', appearance.slice(0, 6));
    check('아이콘 선 굵기가 셸·복사 버튼·실제 부품에 함께 적용', await page.evaluate(() => {
      const sheet = [...document.styleSheets].find(sheet => sheet.href?.endsWith('/src/tokens/semantic/stroke.css'));
      const rule = [...sheet.cssRules].find(rule => rule.style?.getPropertyValue('--p-icon-stroke'));
      const old = rule.style.getPropertyValue('--p-icon-stroke');
      rule.style.setProperty('--p-icon-stroke', '3');
      const nodes = [...document.querySelectorAll('#search-open .icon, .reference-icon-copy, .overview-tile[data-overview="button"] .ui-icon')];
      const follows = nodes.length >= 3 && nodes.every(node => getComputedStyle(node).strokeWidth === '3px');
      rule.style.setProperty('--p-icon-stroke', old);
      return follows;
    }));
    for (const state of ['hover', 'pressed']) {
      await page.locator('#search-open').hover();
      if (state === 'pressed') await page.mouse.down();
      await same('검색 단추의 ' + state + '도 메인 상태와 동일', '#search-open', await referenceButton({ variant: 'outline', size: 'sm', iconOnly: true, state }));
      if (state === 'pressed') { await page.mouse.move(0, 0); await page.mouse.up(); }
    }
    await page.mouse.move(0, 0);
    await page.keyboard.press('Tab');
    await page.locator('.reference-copy').focus();
    await same('복사 단추의 키보드 초점은 메인 초점 링', '.reference-copy', await referenceButton({ variant: 'outline', size: 'sm', state: 'focus' }), ['outlineColor', 'outlineStyle', 'outlineWidth', 'outlineOffset']);
    await page.locator('#search-open').click();
    await page.locator('#query').fill('버튼');
    check('검색은 공통 입력 그룹 사용', await page.locator('#search-form.ds-input-group > #query.ds-input').count() === 1);
    await page.locator('#query').press('ArrowDown');
    await same('검색 제안 선택도 메인 선택 색상', '.search-suggestion[aria-selected="true"]', '<button class="ds-tab" aria-selected="true">선택</button>', ['backgroundColor', 'color']);
    await page.keyboard.press('Escape');

    await goto('dictionary?shelf=part');
    await same('미리보기 선택이 메인 입력과 동일', '[data-preview-select]', '<select class="ds-input"><option>메인</option></select>');
    await same('사전 카드가 공통 표면을 사용', '.dict-entry', '<div class="ds-surface"></div>', appearance.slice(0, 6));
    await goto('dictionary?shelf=icon');
    await same('페이지 이동은 메인 보조 버튼', '.page-step:not(:disabled)', outline);
    await same('페이지 이동 비활성도 메인 버튼과 동일', '.page-step:disabled', await referenceButton({ variant: 'outline', size: 'sm', state: 'disabled' }));
    await same('현재 페이지는 메인 주요 버튼', '.page-num[aria-current]', await referenceButton({ variant: 'primary', size: 'sm' }));
    await same('쪽 번호 입력은 메인 입력과 동일', '.page-jump input', '<input class="ds-input">');

    // Mutate the actual shared CSS, not a shell-only override. A duplicate skin cannot pass this check.
    for (const route of ['styles?detail=main', 'dictionary?shelf=part', 'dictionary?shelf=icon', 'system?detail=button', 'system?detail=admin-page', 'patterns']) {
      await goto(route);
      const propagation = await page.evaluate(() => {
        const sheet = [...document.styleSheets].find(sheet => sheet.href?.endsWith('/src/system/parts.css'));
        return ['.ds .ds-button', '.ds .ds-input', '.ds .ds-input-group', '.ds .ds-tab', '.ds .ds-surface', '.ds .ds-search-bar > .ds-button', '.ds .ds-search-bar select.ds-input'].map(selector => {
          const rule = [...sheet.cssRules].find(rule => rule.selectorText === selector);
          const old = rule.style.borderRadius;
          rule.style.borderRadius = '31px';
          const nodes = [...document.querySelectorAll(selector)].filter(node =>
            (!node.closest('[inert]') || node.closest('.preview')) &&
            !(node.matches('.ds-input') && node.closest('.ds-input-group')) &&
            // The search bar has its own shared shape rules, checked separately below.
            !(selector === '.ds .ds-button' && node.matches('.ds-search-bar > .ds-button')) &&
            !(selector === '.ds .ds-input' && node.matches('.ds-search-bar select.ds-input')));
          const stale = nodes.filter(node => getComputedStyle(node).borderRadius !== '31px').map(node => node.className);
          rule.style.borderRadius = old;
          return { selector, count: nodes.length, stale };
        });
      });
      for (const result of propagation) check(route + ' 공통 규칙 수정 전파 ' + JSON.stringify(result), result.stale.length === 0);
    }

    await goto('patterns');
    check('패턴 12종이 공통 부품으로 구성됨', await page.locator('.pattern-card .preview[inert] .sample :is(.ds-button, .ds-tabs, .ds-field, .ds-surface, .ds-toast, .ds-search-bar)').count() >= 12);
    check('각 패턴 미리보기는 하나의 정적 장면', await page.locator('.pattern-card .preview[inert] [data-preview-scene]').count() === 12);
    check('패턴 내부 폼과 탭의 ID가 서로 겹치지 않음', await page.locator('[id]').evaluateAll(nodes => nodes.length === new Set(nodes.map(n => n.id)).size));
    check('카드 열기 버튼 안에 다른 조작 요소가 없음', await page.locator('.card-caption :is(button, input, select, a)').count() === 0);
    await page.locator('[data-open="dialog"]').click();
    check('패턴 상세 열기 유지', await page.locator('#detail-dialog').isVisible());
    await page.keyboard.press('Escape');
    check('패턴 상세를 닫으면 카드로 초점 복귀', await page.locator('[data-open="dialog"]').evaluate(node => node === document.activeElement));

    await goto('system?detail=record-editor');
    await page.locator('[data-editor-open]').click();
    check('편집 창이 선택한 상위 스타일을 상속', await page.locator('.ds-record-editor').evaluate(dialog => {
      const parent = dialog.closest('.ds');
      parent.style.setProperty('--p-bg', 'rgb(245, 232, 210)');
      parent.style.setProperty('--p-ink', 'rgb(40, 60, 80)');
      const s = getComputedStyle(dialog);
      const follows = s.backgroundColor === 'rgb(245, 232, 210)' && s.color === 'rgb(40, 60, 80)';
      parent.style.removeProperty('--p-bg'); parent.style.removeProperty('--p-ink');
      return follows;
    }));
    await page.keyboard.press('Escape');

    // Links keep normal navigation/keyboard behavior when wearing the shared tab appearance.
    await page.locator('[data-focus="style-context"]').click();
    check('주 메뉴는 패널 탭으로 오작동하지 않음', page.url().endsWith('#/styles'));
    await page.locator('[data-focus="style-context"]').focus();
    await page.keyboard.press('ArrowRight');
    check('주 메뉴는 링크 의미를 유지', await page.locator('#primary-nav [role="tab"], #primary-nav [aria-selected]').count() === 0);
    await goto('system?detail=tabs');
    await page.evaluate(() => {
      const stage = document.createElement('div');
      stage.id = 'tab-check'; stage.className = 'ds';
      stage.innerHTML = Pattove.parts.renderItem('tabs', 'shell-style-tabs');
      document.querySelector('main').append(stage);
    });
    await page.locator('#tab-check [role="tab"]').first().focus();
    await page.keyboard.press('ArrowRight');
    check('실제 패널 탭은 화살표로 선택 전환', await page.locator('#tab-check [role="tab"]').nth(1).getAttribute('aria-selected') === 'true');

    // A selected style lives on body. Derived layout sizes must resolve in that scope too.
    for (const width of [1440, 375]) {
      await page.setViewportSize({ width, height: 1000 });
      await goto('dictionary?shelf=part');
      const before = await page.locator('.app-top').evaluate(node => node.getBoundingClientRect().height);
      await page.evaluate(() => {
        document.body.style.setProperty('--p-control-size-sm', '64px');
        document.body.style.setProperty('--p-space-unit', '5px');
        document.body.style.setProperty('--p-space-md', '20px');
      });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const layout = await page.evaluate(() => ({
        height: document.querySelector('.app-top').getBoundingClientRect().height,
        menu: document.querySelector('.app-menu').getBoundingClientRect().width,
        offset: parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)
      }));
      check(width + ' 선택한 스타일의 버튼 크기에 헤더가 맞춰짐', layout.height === before + (width > 760 ? 20 : 40));
      check(width + ' 높이가 바뀌면 앵커의 헤더 여유도 갱신', layout.offset === layout.height + 20);
      if (width > 760) {
        check('선택한 스타일의 간격에 메뉴 폭도 맞춰짐', layout.menu === 240);
        await page.locator('#rail-toggle').click();
        check('접힌 메뉴 폭도 같은 스타일을 사용', await page.locator('.app-menu').evaluate(node => node.getBoundingClientRect().width) === 70);
        await page.locator('#rail-toggle').click();
      }
      await page.evaluate(() => ['--p-control-size-sm','--p-space-unit','--p-space-md'].forEach(name => document.body.style.removeProperty(name)));
    }

    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of ['styles?detail=main', 'dictionary?shelf=icon', 'dictionary?shelf=part', 'system?detail=button', 'system?detail=data-table', 'system?detail=admin-page', 'patterns']) {
        await goto(route);
        check(width + ' ' + route + ' 가로 넘침 없음', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      }
      if ([375, 1440].includes(width)) {
        await goto('styles?detail=main');
        await page.screenshot({ path: path.join(out, 'after-' + width + '.png') });
      }
    }
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ checks, errors }, null, 2));
    console.log(checks.length + ' shell-style checks passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
