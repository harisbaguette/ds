const { chromium } = require('playwright-core');
const { pathToFileURL } = require('node:url');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const url = pathToFileURL(path.join(root, 'index.html')).href;
const origin = process.env.ORIGIN || 'http://127.0.0.1:4173';
const output = path.join(root, 'test-results/system');
fs.mkdirSync(output, { recursive: true });
const checks = [], errors = [];
const check = (name, value) => { assert.ok(value, name); checks.push(name); };
const inspect = async (page, style, id) => {
  await page.goto(url + '#/system?style=' + style + '&detail=' + id);
  // Wait for this part's page, not any inspector: a hash-only move keeps the previous page on screen for a moment.
  await page.locator('.component-page[data-component="' + id + '"]').waitFor();
  await page.evaluate(() => document.fonts.ready);
};
// The part page shows still pictures only, so a part's own behaviour is pressed on a stage built from the same renderer.
const stage = async (page, id, options = {}) => {
  await page.evaluate(([id, options]) => {
    document.querySelector('#test-stage')?.remove();
    const node = document.createElement('div');
    node.id = 'test-stage'; node.className = 'part-demo ds theme-main'; node.dataset.style = 'main';
    node.innerHTML = Pattove.parts.renderItem(id, 'stage', Pattove.systemRegistry.normalizeOptions(id, options));
    document.querySelector('main').append(node);
    Pattove.mountParts(document);
  }, [id, options]);
  return page.locator('#test-stage');
};
const fingerprint = element => {
  const s = getComputedStyle(element);
  return Object.fromEntries(['color','backgroundColor','borderColor','borderWidth','borderRadius','boxShadow','fontFamily','fontSize','fontWeight','padding','minHeight','outlineColor'].map(key => [key,s[key]]));
};
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    page.setDefaultTimeout(7000);
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url + '#/system');
    await page.evaluate(() => document.fonts.ready);
    check('부품 진입은 첫 부품 한 장', page.url().endsWith('detail='+await page.evaluate(()=>Pattove.systemRegistry.matching('')[0].id)) && await page.locator('.component-page').count() === 1 && await page.locator('.specimen,.system-board').count() === 0 && await page.locator('[data-style-choice]').count() === 0);
    check('현재 스타일은 하나', await page.evaluate(()=>Pattove.catalog.styles.length===1 && Pattove.catalog.styles[0].id==='main'));
    await page.screenshot({ path: path.join(output, 'styles.png') });
    const expectedItems=JSON.parse(fs.readFileSync(path.join(root,'src/data/system-registry.json'),'utf8')).items;
    check('브라우저의 구현·분류 목록이 배포 목록과 일치하고 8개 역할 포함', await page.evaluate(expected => {
      const r=Pattove.systemRegistry, inventory=items=>items.map(i=>[i.id,i.layer,i.browse.shelf]);
      return JSON.stringify(inventory(r.items))===JSON.stringify(inventory(expected)) && new Set([...r.items,...r.patterns].map(i=>i.layer)).size===8;
    },expectedItems));
    check('의존 관계는 존재하는 구현을 참조', await page.evaluate(() => Pattove.systemRegistry.items.every(item => item.deps.every(id=>Pattove.systemRegistry.index.has(id)))));
    const sourceBlocks = Object.fromEntries([...fs.readFileSync(path.join(root,'src/system/parts.css'),'utf8').matchAll(/\/\* @part ([\w-]+) \*\/([\s\S]*?)(?=\/\* @part |$)/g)].map(match=>[match[1],match[2].trim()]));
    const generated = { window: { Pattove: {} } };
    vm.runInNewContext(fs.readFileSync(path.join(root,'src/data/system-source.js'),'utf8'), generated);
    check('공용 CSS 생성본이 원본과 일치', JSON.stringify(generated.window.Pattove.systemSource)===JSON.stringify(sourceBlocks));
    // Two token layers only: parts read --p-* roles that exist in the live semantic layer, never primitives.
    const partRoles = [...new Set([...Object.values(sourceBlocks).join('').matchAll(/var\((--p-[\w-]+)/g)].map(m=>m[1]))];
    const liveRoles = await page.evaluate(names => names.map(n => getComputedStyle(document.querySelector('.ds') || document.documentElement).getPropertyValue(n).trim()), partRoles);
    check('토큰은 원시값·역할 두 층, 부품은 존재하는 --p-* 역할만 읽음', !fs.existsSync(path.join(root,'src/tokens/component')) && fs.readdirSync(path.join(root,'src/tokens')).sort().join()==='primitive,semantic' && partRoles.length > 0 && liveRoles.every(Boolean) && !/var\(--(color|font|space|radius|shadow|duration)-/.test(Object.values(sourceBlocks).join('')) && !('systemTokens' in generated.window.Pattove));
    check('사전 연결 무결성', await page.evaluate(() => Pattove.systemRegistry.items.every(item => !item.entry || Pattove.library.entries.some(e=>e.id===item.entry))));
    await inspect(page, 'main', 'button');
    const buttonLooks = await page.evaluate(() => Pattove.systemRegistry.index.get('button').gallery.list.length);
    check('부품 화면은 표현 방식 격자만: 옵션 칸·큰 미리보기·예시·함께 쓰는 부품·목차 없음', await page.locator('.variant-card').count() === buttonLooks && await page.locator('[data-part-option],.part-demo,#component-examples,.part-dependencies,.component-toc,.variant-when,.variant-save,[data-variant-use]').count() === 0);
    await page.screenshot({ path: path.join(output, 'button.png') });
    await page.locator('#search-open').click();
    await page.locator('#query').fill('버튼');
    await page.locator('#query').press('Enter');
    await page.waitForURL(/dictionary/);
    await page.reload();
    check('검색 결과와 검색어가 새로고침해도 유지', await page.locator('[data-library-entry="button"]').count() === 1 && (await page.locator('#query-chip').innerText()).includes('버튼'));
    await page.locator('[data-library-entry="button"]').click();
    check('검색에서 부품을 열면 표현 방식 격자', await page.locator('.component-page[data-component="button"] .variant-card').count() === buttonLooks);
    check('부품 화면에는 그림만: 설치·코드·내려받기 칸 없음', await page.locator('[data-system-download],.install-panel,[data-doc-tab],[data-doc-environment],#part-source,.component-code,#component-usage').count() === 0 && !(await page.locator('main').innerText()).toLowerCase().includes('shadcn'));
    // Shapes: a card grid only. Pressing a card makes it the shape in use, and that survives a reload.
    await inspect(page, 'main', 'bottom-nav');
    const looks = await page.locator('.variant-card .ds-bottom-nav').evaluateAll(nodes => nodes.map(n => n.dataset.variant));
    check('하단 탐색 모양 5가지 이상, 모두 다른 모양', looks.length >= 5 && new Set(looks).size === looks.length && looks.includes('line') && looks.includes('pill'));
    check('형태 선택 칸은 모양 격자로 흡수', await page.locator('[data-part-option="variant"]').count() === 0);
    await page.locator('[data-variant-pick="float"]').click();
    check('카드를 누르면 그 모양에 사용 중 체크 표시', await page.locator('[data-variant-pick="float"]').getAttribute('aria-pressed') === 'true' && await page.locator('[data-variant-pick="float"] .variant-kept[aria-label="사용 중"]').count() === 1 && await page.locator('.variant-card[data-current]').count() === 1 && await page.locator('[data-variant-pick="float"]').evaluate(n => n === document.activeElement));
    check('모양 미리보기는 조작 대상이 아님', await page.locator('.variant-card .variant-frame[inert]').count() === looks.length);
    await page.goto(url + '#/system?style=main&detail=bottom-nav');
    await page.reload();
    await page.locator('.variant-card').first().waitFor();
    check('고른 모양은 새로고침 뒤에도 사용 중', await page.locator('[data-variant-pick="float"]').getAttribute('aria-pressed') === 'true' && !page.url().includes('option-variant'));
    await page.evaluate(() => localStorage.removeItem('pattove-part-choice'));
    const blocked = await browser.newContext({ viewport: { width: 390, height: 900 } });
    await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('storage blocked'); } }));
    const locked = await blocked.newPage(), lockedErrors = [];
    locked.on('pageerror', error => lockedErrors.push(error.message));
    await locked.goto(url + '#/system?style=main&detail=bottom-nav');
    await locked.locator('[data-variant-pick="glass"]').click();
    check('저장소가 막혀도 모양 고르기 동작', lockedErrors.length === 0 && await locked.locator('[data-variant-pick="glass"]').getAttribute('aria-pressed') === 'true');
    await blocked.close();
    // The collection screen composes the search form, a result block and the empty state; the search is pressed there.
    await inspect(page, 'main', 'page');
    let demo = await stage(page, 'page');
    await demo.locator('[name="query"]').fill('없는이름');
    await demo.locator('button[type="submit"]').click();
    check('빈 결과와 복구 동작', await demo.locator('.ds-empty').isVisible() && await demo.locator('[data-result]:visible').count() === 0);
    await demo.locator('[data-part-action="reset-search"]').click();
    check('검색 복구 후 결과와 입력 초점', await demo.locator('[data-result]:visible').count() === 3 && await demo.locator('[name="query"]').evaluate(n=>n===document.activeElement));
    await demo.locator('[name="status"]').selectOption('완료');
    check('실제 상태 필터', await demo.locator('[data-result]:visible').count() === 1);
    await demo.locator('[data-result]:visible button').click();
    check('검색 결과에서 상세로', await demo.locator('.ds-record-detail').isVisible() && await demo.locator('.ds-record-detail h3').textContent() === '타이포그래피');
    await demo.locator('[data-part-action="save-record"]').click();
    check('상세의 주요 행동 피드백', await demo.locator('[data-part-action="save-record"]').getAttribute('aria-pressed') === 'true');
    await demo.locator('[data-part-action="close-record"]').click();
    check('목록으로 돌아오면 필터와 초점 유지', await demo.locator('[data-result]:visible').count() === 1 && await demo.locator('[data-result]:visible button').evaluate(n=>n===document.activeElement));
    await inspect(page,'main','tabs');
    demo = await stage(page, 'tabs');
    await demo.locator('[role="tab"]').first().focus();
    await page.keyboard.press('ArrowRight');
    check('탭 방향키, 선택, 패널 동기화', await demo.locator('[role="tab"]').nth(1).getAttribute('aria-selected') === 'true' && await demo.locator('[role="tabpanel"]:visible').textContent() === '진행 중인 컬렉션을 보고 있어요.');
    await page.keyboard.press('End');
    check('탭 End 키', await demo.locator('[role="tab"]').last().evaluate(n=>n===document.activeElement));
    // Parts split out of the old looks earn their place by a hand action they remove; press each one and check it really works.
    await inspect(page,'main','password-input');
    demo = await stage(page, 'password-input');
    const secret = demo.locator('.ds-password-input input'), show = demo.locator('[data-part-action="reveal"]');
    await secret.fill('pattove8');
    await show.click();
    check('비밀번호 보기는 다시 치지 않고 글자로 보여 줌', await secret.getAttribute('type') === 'text' && await secret.inputValue() === 'pattove8' && (await show.getAttribute('aria-label')).endsWith('숨기기') && await show.getAttribute('aria-pressed') === null);
    await show.click();
    check('숨기기를 누르면 다시 가림', await secret.getAttribute('type') === 'password' && (await show.getAttribute('aria-label')).endsWith('보기'));
    await inspect(page,'main','select-all-list');
    demo = await stage(page, 'select-all-list');
    const parentBox = demo.locator('[data-part="select-all"]'), kids = demo.locator('.ds-select-all input:not([data-part="select-all"])');
    await parentBox.uncheck();
    check('전체 선택을 끄면 자식이 모두 꺼짐', await kids.evaluateAll(n => n.length === 3 && n.every(k => !k.checked)));
    await kids.first().check();
    check('자식 하나만 켜면 부모는 일부 선택', await parentBox.evaluate(n => n.indeterminate && !n.checked));
    await parentBox.click();
    check('일부 선택에서 부모를 누르면 모두 켜짐', await kids.evaluateAll(n => n.every(k => k.checked)) && await parentBox.evaluate(n => n.checked && !n.indeterminate));
    await inspect(page,'main','count-badge');
    demo = await stage(page, 'count-badge');
    check('개수 배지는 읽는 이름에 개수를 담음', await demo.locator('.ds-count-badge').getAttribute('aria-label') === '새 알림 3개');
    demo = await stage(page, 'count-badge', { count: '120' });
    check('개수 배지는 99를 넘으면 99+', (await demo.locator('.ds-badge-count').textContent()) === '99+');
    await inspect(page,'main','clear-input');
    demo = await stage(page, 'clear-input');
    await demo.locator('[data-part-action="clear-input"]').click();
    check('지우기 단추는 값을 한 번에 비우고 입력칸에 초점', await demo.locator('input').inputValue() === '' && await demo.locator('input').evaluate(n => n === document.activeElement));
    await inspect(page,'main','stepper');
    demo = await stage(page, 'stepper');
    await demo.locator('[data-step="1"]').click();
    check('수량 조절은 더하기로 1 늘어남', await demo.locator('input').inputValue() === '2');
    await demo.locator('[data-step="-1"]').click(); await demo.locator('[data-step="-1"]').click(); await demo.locator('[data-step="-1"]').click();
    check('수량 조절은 최솟값 아래로 안 내려감', await demo.locator('input').inputValue() === '0');
    await inspect(page,'main','people-picker');
    demo = await stage(page, 'people-picker');
    await demo.locator('[name="query"]').fill('이도');
    check('사람 고르기는 치는 동안 좁힘', await demo.locator('[data-result]:visible').count() === 1 && (await demo.locator('.ds-result-count').textContent()) === '1명');
    await demo.locator('[name="query"]').fill('없는사람');
    check('사람 고르기 결과 없음', await demo.locator('.ds-empty').isVisible());
    await demo.locator('[data-part-action="reset-search"]').click();
    check('사람 고르기 복구', await demo.locator('[data-result]:visible').count() === 3);
    await page.setViewportSize({width:390,height:844});
    await inspect(page,'main','tabs');
    demo = await stage(page, 'tabs', { look: 'scroll' });
    await demo.locator('[role="tab"]').first().focus();
    await page.keyboard.press('End');
    const inView = await demo.locator('.ds-tablist').evaluate(list => { const l = list.getBoundingClientRect(), t = list.lastElementChild.getBoundingClientRect(); return t.left >= l.left - 1 && t.right <= l.right + 1; });
    check('옆으로 미는 탭은 End로 고른 마지막 탭이 다 보이고 페이지는 옆으로 안 밀림', inView && await demo.locator('[role="tab"]').last().getAttribute('aria-selected') === 'true' && await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.setViewportSize({width:1280,height:1000});
    for (const id of ['checkbox','radio','switch']) {
      await inspect(page,'main',id);
      demo = await stage(page, id);
      const inputs = demo.locator('input');
      if(id==='radio') { await inputs.last().check(); check('라디오 상호 배타 선택', !await inputs.first().isChecked() && await inputs.last().isChecked()); }
      else { await inputs.first().uncheck(); check(id+' 네이티브 선택 동작', !await inputs.first().isChecked()); }
    }
    await inspect(page,'main','toast');
    demo = await stage(page, 'toast');
    check('잠깐 알림 실제 표시', await demo.locator('[data-part-feedback]').isVisible());
    await demo.locator('[data-part-action="undo"]').click();
    check('되돌리기를 누르면 잠깐 알림이 닫힘', await demo.locator('[data-part-feedback]').isHidden());
    // Look galleries on the larger parts: every card shows its own look, and pressing one makes it the one in use.
    for (const id of ['tabs','card','template','page']) {
      await inspect(page,'main',id);
      const cards = await page.locator('.variant-card').evaluateAll(nodes => nodes.map(n => [n.dataset.variantCard, n.querySelector('.variant-frame [data-look]')?.dataset.look]));
      check(id+' 모양 2가지 이상, 카드마다 제 모양', cards.length >= 2 && new Set(cards.map(c => c[0])).size === cards.length && cards.every(([v, look]) => v === look));
      const last = cards.at(-1)[0];
      await page.locator('[data-variant-pick="'+last+'"]').click();
      check(id+' 카드를 누르면 그 모양만 사용 중', await page.locator('[data-variant-pick="'+last+'"]').getAttribute('aria-pressed') === 'true' && await page.locator('[data-variant-pick][aria-pressed="true"]').count() === 1);
    }
    check('모양 카드는 그림과 이름만', await page.locator('.variant-card .variant-when,.variant-card .variant-save,.variant-no,.variant-tags').count() === 0);
    await page.evaluate(() => localStorage.removeItem('pattove-part-choice'));
    await inspect(page,'main','page');
    demo = await stage(page, 'page', { look: 'sheet' });
    await demo.locator('.ds-chip', { hasText: '완료' }).click();
    check('칩 모양의 상태 필터도 실제로 거름', await demo.locator('[name="status"]:checked').getAttribute('value') === '완료' && await demo.locator('[data-result]:visible').count() === 1);
    await inspect(page,'main','tabs');
    demo = await stage(page, 'tabs', { look: 'vertical' });
    await demo.locator('[role="tab"]').first().focus();
    await page.keyboard.press('ArrowDown');
    check('세로 탭은 아래 방향키로 이동', await demo.locator('[role="tablist"]').getAttribute('aria-orientation') === 'vertical' && await demo.locator('[role="tab"]').nth(1).getAttribute('aria-selected') === 'true' && await demo.locator('[role="tab"]').nth(1).evaluate(n=>n===document.activeElement));
    for(const width of [320,375,768,1440]) {
      await page.setViewportSize({width,height:1000});
      for(const [style,id] of [['main','page'],['main','bottom-nav']]) {
        await page.goto(url+'#/system?style='+style+'&detail='+id);await page.locator('.component-page[data-component="'+id+'"] .variant-grid').waitFor();
        check(width+' '+style+' '+id+' 부품 화면 가로 넘침 없음', await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        const duplicates=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(n=>n.id);return ids.length!==new Set(ids).size;});
        check(width+' '+style+' '+id+' 중복 ID 없음', !duplicates);

      }
    }
    await page.goto(url+'#/system?style=main&detail=button');await page.screenshot({path:path.join(output,'button-page.png')});
    await page.setViewportSize({width:375,height:1000});
    await page.goto(url+'#/system?style=main&detail=page');await page.screenshot({path:path.join(output,'mobile-page.png'),fullPage:true});
    // One part, one thing: a look only changes the surface, so every look card holds exactly one of that part.
    // A part with a single look shows one picture and no grid (like a token).
    const lookShots = path.join(root, 'test-results/look-atoms');
    fs.mkdirSync(lookShots, { recursive: true });
    const single = await page.evaluate(() => Pattove.systemRegistry.items.filter(i => i.layer !== 'Token' && !i.gallery).map(i => i.id));
    for (const id of single) {
      await page.goto(url + '#/system?style=main&detail=' + id); await page.locator('.component-page[data-component="' + id + '"] .part-demo').waitFor();
      check(id + ' 모양 하나: 격자 없이 그림 하나', await page.locator('.variant-card').count() === 0 && await page.locator('.component-page .part-demo').count() === 1);
    }
    const roots = { button: '.ds-button', 'icon-button': '.ds-button[data-icon-only]', input: '.ds-input', badge: '.ds-badge', card: '.ds-card', tabs: '.ds-tabs', 'bottom-nav': '.ds-bottom-nav', template: '.ds-page', page: '.ds-page' };
    for (const [id, selector] of Object.entries(roots)) {
      await page.goto(url + '#/system?style=main&detail=' + id); await page.locator('.component-page[data-component="' + id + '"] .variant-grid').waitFor();
      check(id + ' 모양 카드마다 그 부품 한 개만', await page.locator('.variant-card .variant-frame').evaluateAll((frames, selector) => frames.length >= 2 && frames.every(frame => frame.querySelectorAll(selector).length === 1), selector));
    }
    check('버튼 모양은 채움·윤곽·글자 버튼 한 개씩', (await page.evaluate(() => Pattove.systemRegistry.index.get('button').gallery.list.map(v => v.id).join())) === 'primary,outline,ghost');
    // Old look ids kept from before the split (button hero, input reveal …) fall back to the first look without errors.
    const stale = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await stale.addInitScript(() => localStorage.setItem('pattove-part-choice', JSON.stringify({ button: 'hero', input: 'reveal', checkbox: 'all', badge: 'count', card: 'media', 'search-module': 'chips', feedback: 'ring' })));
    const sp = await stale.newPage(), staleErrors = [];
    sp.on('pageerror', error => staleErrors.push(error.message));
    for (const id of ['button','input','badge','card','checkbox']) { await sp.goto(origin + '/#/system?style=main&detail=' + id); await sp.locator('.component-page[data-component="' + id + '"]').waitFor(); }
    await sp.goto(origin + '/#/system?style=main&detail=button'); await sp.locator('.variant-card').first().waitFor();
    check('예전 모양 id가 저장돼 있어도 오류 없이 첫 모양', staleErrors.length === 0 && await sp.locator('[data-variant-pick][aria-pressed="true"]').getAttribute('data-variant-pick') === 'primary');
    await stale.close();
    for (const id of ['button','icon-button','input','badge']) {
      const fresh = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
      const lp = await fresh.newPage();
      lp.on('pageerror', error => errors.push(id + ' look: ' + error.message));
      await lp.goto(origin + '/#/system?style=main&detail=' + id);
      await lp.locator('.component-page[data-component="' + id + '"] .variant-grid').waitFor();
      await lp.evaluate(() => document.fonts.ready);
      const [looks, key] = await lp.evaluate(id => { const g = window.Pattove.systemRegistry.index.get(id).gallery; return [g.list.map(v => v.id), g.key]; }, id);
      check(id + ' 모양 2개 이상', looks.length >= 2 && await lp.locator('.variant-card').count() === looks.length);
      check(id + ' 모양 이름 중복 없음', new Set(looks).size === looks.length);
      const current = () => lp.locator('[data-variant-pick][aria-pressed="true"]').getAttribute('data-variant-pick');
      check(id + ' 기본 사용 중은 첫 모양', await current() === looks[0]);
      check(id + ' 카드마다 제 모양', (await lp.locator('.variant-card').evaluateAll((nodes, key) => nodes.map(n => n.querySelector('.variant-frame [data-' + key + ']')?.dataset[key]), key)).join() === looks.join());
      check(id + ' 모양은 옵션 목록이 아닌 격자로만', await lp.locator('[data-part-option="look"]').count() === 0);
      await lp.locator('.variant-grid').first().screenshot({ path: path.join(lookShots, id + '-1440.png') });
      await lp.locator('[data-variant-pick]').nth(1).click();
      check(id + ' 카드를 누르면 사용 중 변경', await current() === looks[1]);
      await lp.setViewportSize({ width: 390, height: 900 });
      await lp.waitForTimeout(100);
      check(id + ' 390 가로 넘침 없음', await lp.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const small = await lp.evaluate(() => [...document.querySelectorAll('[data-variant-pick]')]
        .filter(n => n.offsetParent).map(n => n.getBoundingClientRect()).filter(r => r.width < 44 || r.height < 44).length);
      check(id + ' 390 터치 칸 44px 이상', small === 0);
      await lp.screenshot({ path: path.join(lookShots, id + '-390.png'), fullPage: true });
      await fresh.close();
    }
    for (const id of ['card','result-grid','page']) {
      await inspect(page, 'main', id); await stage(page, id);
      // The card or block carries its own look; the small parts inside it keep their plain default.
      check(id + ' 안 작은 부품은 기본 모양 유지(data-look 없음)', await page.locator('#test-stage :is(.ds-button,.ds-badge,.ds-input,.ds-field,.ds-choice,.ds-divider,.ds-status,.ds-icon)[data-look]').count() === 0);
    }
    await page.goto(origin + '/#/system?style=main&detail=button');
    check('HTTP 실행에서도 같은 부품 화면', await page.locator('.variant-card .ds-button').count()>=1);
    check('브라우저 실행 오류 없음', errors.length===0);
    fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({checks,errors},null,2));
    console.log(checks.length+' atomic system checks passed.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
