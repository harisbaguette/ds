const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'test-results/references');
fs.mkdirSync(out, { recursive: true });
const checks = [], errors = [];
const check = (name, value) => { assert.ok(value, name); checks.push(name); };
const parse = text => JSON.parse(text.slice(text.indexOf('{')));
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    const goto = async route => { await page.goto('http://127.0.0.1:4173/#/' + route); await page.reload(); };
    const copy = async id => {
      const button = page.locator('[data-copy-reference="' + id + '"]');
      await button.click();
      await page.waitForFunction(id => document.querySelector('[data-copy-reference="' + id + '"]').parentElement.querySelector('.reference-status').textContent === '복사됨', id);
      return parse(await page.evaluate(() => navigator.clipboard.readText()));
    };
    await goto('system?detail=button');
    const inventory = await page.evaluate(() => {
      const { library: d, systemRegistry: r, references: ref, catalog } = Pattove;
      const ids = [...d.entries, ...d.components, ...r.items].map(item => item.id);
      ids.push(...d.glyphs.map(([id]) => id), ...catalog.styles.map(item => 'style/' + item.id), ...catalog.patterns.map(item => 'pattern/' + item.id));
      const shapes = r.items.flatMap(item => (item.gallery?.list || []).map(shape => ref.shapeID(item, shape.id)));
      return { unique: new Set([...ids, ...shapes]).size === ids.length + shapes.length, missing: [...ids, ...shapes].filter(id => !ref.resolve(id)), shapes, payloads: r.items.flatMap(item => [ref.payload(item.id), ...(item.gallery?.list || []).map(shape => ref.payload(ref.shapeID(item, shape.id)))]) };
    });
    check('모든 사전·구현·아이콘·스타일·하위 모양의 ID가 고유하고 해석 가능', inventory.unique && inventory.missing.length === 0);
    for (const info of inventory.payloads) {
      check(info.id + ' 원본과 설치 파일이 실제 존재', [info.source.renderer, info.source.css, info.source.behaviors, info.source.react, info.style.source, ...info.source.registry].filter(Boolean).every(file => fs.existsSync(path.join(root, file))));
      if (info.shape) check(info.id + ' 하위 모양을 HTML·React·주소에 같은 값으로 전달', info.html.includes('data-' + info.shape.prop + '="' + info.shape.value + '"') && info.reactProps[info.shape.prop] === info.shape.value && new URL(info.url).hash.includes('option-' + info.shape.prop + '=' + info.shape.value));
    }
    for (const shelf of ['token', 'icon', 'part', 'block', 'template']) {
      await goto('dictionary?shelf=' + shelf);
      check(shelf + ' 목록 카드에 ID 코드를 표시하지 않음', await page.locator('.dict-entry').evaluateAll(cards => cards.length > 0 && cards.every(card => !card.querySelector('.element-id'))));
    }
    await goto('system?detail=button&option-variant=primary');
    const before = page.url();
    const outline = await copy('button/variant/outline');
    check('모양 복사는 선택 상태와 페이지를 바꾸지 않음', page.url() === before && await page.locator('[data-variant-pick="primary"]').getAttribute('aria-pressed') === 'true');
    check('버튼 하위 모양을 이름·ID·스타일·소스·실제 마크업과 함께 복사', outline.id === 'button/variant/outline' && outline.elementId === 'button' && outline.dictionaryId === 'ACT-01' && outline.style.id === 'main' && outline.status === 'implemented' && outline.options.variant === 'outline' && outline.reactProps.variant === 'outline' && outline.source.registry.length === 2 && outline.html.includes('data-variant="outline"'));
    await page.locator('[data-variant-pick="ghost"]').click();
    const parent = await copy('button');
    check('요소 복사는 현재 선택한 하위 모양을 반영', parent.id === 'button' && parent.shape.id === 'button/variant/ghost');
    await page.goto(outline.url);
    check('복사한 주소는 저장된 다른 선택보다 지정 모양을 우선', await page.locator('[data-variant-pick="outline"]').getAttribute('aria-pressed') === 'true');
    await page.locator('#search-open').click();
    await page.locator('#query').fill('tabs/look/vertical');
    await page.locator('#query').press('Enter');
    check('하위 모양 ID를 검색하면 해당 모양으로 바로 이동', await page.locator('[data-variant-pick="vertical"]').getAttribute('aria-pressed') === 'true' && page.url().includes('detail=tabs'));
    // The specimen preview takes priority over the site's style.
    const chosenStyle = await page.evaluate(() => Pattove.references.payload('button/variant/outline', { style: 'unused', preview: 'main' }).style.id);
    check('복사에는 사이트의 스타일보다 견본의 스타일을 우선 반영', chosenStyle === 'main');
    await goto('dictionary?shelf=part&detail=VIS-01');
    const pending = await copy('VIS-01');
    check('미구현 항목은 사전 정의만 전달하고 구현 코드·설치 경로를 만들지 않음', pending.status === 'not-implemented' && pending.purpose && typeof pending.source === 'string' && !pending.html && !pending.reactProps && pending.instructions.includes('아직 구현되지 않은'));
    await goto('dictionary?shelf=icon&detail=ICO-01');
    const art = await copy('ICO-01');
    check('완성된 아이콘은 실제 그림 파일 경로로 전달', art.status === 'asset-ready' && Object.values(art.assets).every(file => fs.existsSync(path.join(root, file))));
    const glyphSamples = await page.evaluate(() => Pattove.library.glyphSets.map(set => Pattove.library.glyphs.find(([id]) => id.startsWith(set.id + ':'))[0]));
    for (const key of glyphSamples) {
      const glyph = await page.evaluate(key => Pattove.references.payload(key), key);
      check(key + ' 완성 일러스트 또는 제작 중 상태를 전달하고 SVG로 대체하지 않음', !glyph.html && !glyph.assets?.svg && (glyph.status === 'not-implemented' || (glyph.status === 'asset-ready' && ['png','webp'].every(ext => fs.existsSync(path.join(root,glyph.assets[ext]))))));
    }
    const guideline = await page.evaluate(() => Pattove.references.payload('ICO-497'));
    check('아이콘 기준은 사용 규칙으로 전달', guideline.status === 'guideline' && guideline.purpose && !guideline.instructions.includes('미구현'));
    // Browser-denied clipboard access must leave the full text selectable, including inside a detail dialog.
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('denied'); } } }));
    await page.locator('[data-copy-reference="ICO-01"]').click();
    await page.locator('#reference-dialog').waitFor({ state: 'visible' });
    check('복사 권한이 없으면 전체 내용을 선택한 수동 복사 창 제공', await page.locator('#reference-dialog textarea').evaluate(area => area === document.activeElement && area.selectionStart === 0 && area.selectionEnd === area.value.length && JSON.parse(area.value.slice(area.value.indexOf('{'))).id === 'ICO-01'));
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#reference-dialog').open && document.activeElement.dataset.copyReference === 'ICO-01');
    check('수동 복사 창을 닫으면 원래 상세와 복사 단추의 초점 유지', await page.locator('#detail-dialog').evaluate(dialog => dialog.open) && await page.locator('[data-copy-reference="ICO-01"]').evaluate(button => button === document.activeElement));
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of ['system?detail=button', 'system?detail=bottom-nav', 'dictionary?shelf=icon', 'dictionary?shelf=part&detail=VIS-01', 'styles?detail=main']) {
        await goto(route);
        check(width + ' ' + route + ' ID·복사 단추 가로 넘침 없음', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && [...document.querySelectorAll('dialog[open]')].every(dialog => dialog.scrollWidth <= dialog.clientWidth)));
      }
      await goto('system?detail=button');
      await page.screenshot({ path: path.join(out, 'button-' + width + '.png'), fullPage: true });
    }
    const filePage = await context.newPage();
    await filePage.goto(pathToFileURL(path.join(root, 'index.html')).href + '#/system?detail=button');
    check('파일로 직접 열어도 요소와 하위 모양 ID 표시', await filePage.locator('[data-copy-reference]').count() === 4);
    check('브라우저 오류 없음', errors.length === 0);
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ checks, errors, example: outline }, null, 2));
    console.log(checks.length + ' reference checks passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
