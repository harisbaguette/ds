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
  await page.locator('.component-page[data-component="' + id + '"] .system-inspector').waitFor();
  await page.evaluate(() => document.fonts.ready);
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
    check('부품 진입은 첫 부품 한 장', page.url().endsWith('detail=tokens') && await page.locator('.component-page').count() === 1 && await page.locator('.specimen,.system-board').count() === 0 && await page.locator('[data-style-choice]').count() === 0);
    check('현재 스타일은 하나', await page.evaluate(()=>Pattove.catalog.styles.length===1 && Pattove.catalog.styles[0].id==='main'));
    await page.screenshot({ path: path.join(output, 'styles.png') });
    check('18개 대표 구현과 8개 역할', await page.evaluate(() => Pattove.systemRegistry.items.length === 18 && new Set([...Pattove.systemRegistry.items, ...Pattove.systemRegistry.patterns].map(i=>i.layer)).size === 8));
    check('의존 관계는 존재하는 구현을 참조', await page.evaluate(() => Pattove.systemRegistry.items.every(item => item.deps.every(id=>Pattove.systemRegistry.index.has(id)))));
    const sourceBlocks = Object.fromEntries([...fs.readFileSync(path.join(root,'src/system/parts.css'),'utf8').matchAll(/\/\* @part ([\w-]+) \*\/([\s\S]*?)(?=\/\* @part |$)/g)].map(match=>[match[1],match[2].trim()]));
    const generated = { window: { Pattove: {} } };
    vm.runInNewContext(fs.readFileSync(path.join(root,'src/data/system-source.js'),'utf8'), generated);
    check('공용 CSS 생성본이 원본과 일치', JSON.stringify(generated.window.Pattove.systemSource)===JSON.stringify(sourceBlocks));
    // Component tokens: shipped copy keeps each var(--p-*) reference and its fallback equals the live semantic value.
    const roles = [...fs.readFileSync(path.join(root,'src/tokens/component.css'),'utf8').matchAll(/(--ds-[\w-]+)\s*:\s*var\((--p-[\w-]+)\)/g)].map(m=>[m[1],m[2]]);
    const shipped = Object.fromEntries([...generated.window.Pattove.systemTokens.matchAll(/(--ds-[\w-]+):var\((--p-[\w-]+),([^;]+)\);/g)].map(m=>[m[1],[m[2],m[3]]]));
    const live = await page.evaluate(names => names.map(n => getComputedStyle(document.documentElement).getPropertyValue(n)), roles.map(r=>r[1]));
    const flat = v => v.replace(/\s+/g,'');
    check('부품 토큰 배포본이 원본·의미 값과 일치', roles.length === Object.keys(shipped).length && roles.every(([ds,p],i) => shipped[ds]?.[0]===p && flat(shipped[ds][1])===flat(live[i])));
    check('사전 연결 무결성', await page.evaluate(() => Pattove.systemRegistry.items.every(item => !item.entry || Pattove.library.entries.some(e=>e.id===item.entry))));
    await inspect(page, 'main', 'button');
    check('크기와 상태는 버튼의 변형', await page.locator('[data-part-option="size"]').count() === 1 && await page.locator('[data-part-option="state"]').count() === 1);
    await page.screenshot({ path: path.join(output, 'button.png') });
    await page.locator('#query').fill('버튼');
    await page.locator('#query').press('Enter');
    await page.waitForURL(/detail=button/);
    await page.reload();
    check('검색하면 첫 맞는 부품으로, 새로고침해도 유지', await page.locator('.component-page[data-component="button"]').count() === 1);
    await page.locator('#filter-bar a[href="#/system?detail=button"]').click();
    await page.locator('[data-part-option="variant"]').selectOption('outline');
    await page.locator('[data-part-option="size"]').selectOption('lg');
    check('고른 변형이 미리보기에 바로 반영', await page.locator('.part-demo .ds-button').getAttribute('data-size') === 'lg' && await page.locator('.part-demo .ds-button').getAttribute('data-variant') === 'outline');
    check('부품 화면에는 그림만: 설치·코드·내려받기 칸 없음', await page.locator('[data-system-download],.install-panel,[data-doc-tab],[data-doc-environment],#part-source,.component-code,#component-usage').count() === 0 && !(await page.locator('main').innerText()).toLowerCase().includes('shadcn'));
    // Look-alike versions: a card grid replaces the shape select, a card swaps the big preview, "이걸로 쓰기" survives a reload.
    await inspect(page, 'main', 'bottom-nav');
    const looks = await page.locator('.variant-card .ds-bottom-nav').evaluateAll(nodes => nodes.map(n => n.dataset.variant));
    check('하단 탐색 모양 10가지 이상, 모두 다른 모양', looks.length >= 10 && new Set(looks).size === looks.length && looks.includes('line') && looks.includes('dock'));
    check('형태 선택 칸은 모양 격자로 흡수', await page.locator('[data-part-option="variant"]').count() === 0);
    await page.locator('[data-variant-pick="fab"]').click();
    check('카드를 누르면 큰 미리보기가 그 모양으로', await page.locator('.part-demo .ds-bottom-nav').getAttribute('data-variant') === 'fab' && await page.locator('.part-demo .ds-bottom-nav-create').count() === 1 && await page.locator('[data-variant-pick="fab"]').getAttribute('aria-pressed') === 'true' && page.url().includes('option-variant=fab'));
    await page.locator('[data-variant-use="curve"]').click();
    check('이걸로 쓰기는 사용 중 표시', await page.locator('[data-variant-use="curve"]').getAttribute('aria-pressed') === 'true' && (await page.locator('[data-variant-use="curve"]').innerText()).includes('사용 중') && await page.locator('.part-demo .ds-bottom-nav').getAttribute('data-variant') === 'curve');
    check('모양 미리보기는 조작 대상이 아님', await page.locator('.variant-card .variant-frame[inert]').count() === looks.length);
    await page.goto(url + '#/system?style=main&detail=bottom-nav');
    await page.reload();
    await page.locator('.variant-card').first().waitFor();
    check('고른 모양은 새로고침 뒤에도 기본', await page.locator('.part-demo .ds-bottom-nav').getAttribute('data-variant') === 'curve' && await page.locator('[data-variant-use="curve"]').getAttribute('aria-pressed') === 'true' && !page.url().includes('option-variant'));
    await page.evaluate(() => localStorage.removeItem('pattove-part-choice'));
    const blocked = await browser.newContext({ viewport: { width: 390, height: 900 } });
    await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('storage blocked'); } }));
    const locked = await blocked.newPage(), lockedErrors = [];
    locked.on('pageerror', error => lockedErrors.push(error.message));
    await locked.goto(url + '#/system?style=main&detail=bottom-nav');
    await locked.locator('[data-variant-use="glass"]').click();
    check('저장소가 막혀도 모양 고르기 동작', lockedErrors.length === 0 && await locked.locator('.part-demo .ds-bottom-nav').getAttribute('data-variant') === 'glass' && await locked.locator('[data-variant-use="glass"]').getAttribute('aria-pressed') === 'true');
    await blocked.close();
    await inspect(page, 'main', 'search-module');
    const demo = page.locator('.part-demo');
    await demo.locator('[name="query"]').fill('없는이름');
    await demo.locator('button[type="submit"]').click();
    check('빈 결과와 복구 동작', await demo.locator('.ds-empty').isVisible() && await demo.locator('[data-result]:visible').count() === 0);
    await demo.locator('[data-part-action="reset-search"]').click();
    check('검색 복구 후 결과와 입력 초점', await demo.locator('[data-result]:visible').count() === 3 && await demo.locator('[name="query"]').evaluate(n=>n===document.activeElement));
    await demo.locator('[name="status"]').selectOption('완료');
    check('실제 상태 필터', await demo.locator('[data-result]:visible').count() === 1);
    await demo.locator('[data-result]:visible button').click();
    check('검색 결과에서 상세로', await demo.locator('.ds-record-detail').isVisible() && await demo.locator('.ds-record-detail h3').textContent() === '주말의 기록');
    await demo.locator('[data-part-action="save-record"]').click();
    check('상세의 주요 행동 피드백', await demo.locator('[data-part-action="save-record"]').getAttribute('aria-pressed') === 'true');
    await demo.locator('[data-part-action="close-record"]').click();
    check('목록으로 돌아오면 필터와 초점 유지', await demo.locator('[data-result]:visible').count() === 1 && await demo.locator('[data-result]:visible button').evaluate(n=>n===document.activeElement));
    await page.locator('.part-dependencies a[href*="detail=field"]').click();
    check('모듈에서 하위 부품으로 탐색', await page.locator('#detail-title').textContent() === '입력 필드');
    await inspect(page,'main','tabs');
    await demo.locator('[role="tab"]').first().focus();
    await page.keyboard.press('ArrowRight');
    check('탭 방향키, 선택, 패널 동기화', await demo.locator('[role="tab"]').nth(1).getAttribute('aria-selected') === 'true' && await demo.locator('[role="tabpanel"]:visible').textContent() === '진행 중인 컬렉션을 보고 있어요.');
    await page.keyboard.press('End');
    check('탭 End 키', await demo.locator('[role="tab"]').last().evaluate(n=>n===document.activeElement));
    for (const id of ['checkbox','radio','switch']) {
      await inspect(page,'main',id);
      const inputs = demo.locator('input');
      if(id==='radio') { await inputs.last().check(); check('라디오 상호 배타 선택', !await inputs.first().isChecked() && await inputs.last().isChecked()); }
      else { await inputs.first().uncheck(); check(id+' 네이티브 선택 동작', !await inputs.first().isChecked()); }
    }
    await inspect(page,'main','feedback');
    await demo.locator('[data-part-action="notify"]').click();
    check('알림 실제 표시', await demo.locator('[data-part-feedback]').isVisible());
    for(const width of [320,375,768,1440]) {
      await page.setViewportSize({width,height:1000});
      for(const [style,id] of [['main','page'],['main','bottom-nav']]) {
        await page.goto(url+'#/system?style='+style+'&detail='+id);await page.locator('.system-inspector').waitFor();
        check(width+' '+style+' '+id+' 부품 화면 가로 넘침 없음', await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        const duplicates=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(n=>n.id);return ids.length!==new Set(ids).size;});
        check(width+' '+style+' '+id+' 중복 ID 없음', !duplicates);

      }
    }
    await page.goto(url+'#/system?style=main&detail=button');await page.screenshot({path:path.join(output,'button-page.png')});
    await page.setViewportSize({width:375,height:1000});
    await page.goto(url+'#/system?style=main&detail=page');await page.screenshot({path:path.join(output,'mobile-page.png'),fullPage:true});
    // Look galleries: every atom offers 6+ distinct looks drawn by parts.css [data-look].
    const lookShots = path.join(root, 'test-results/look-atoms');
    fs.mkdirSync(lookShots, { recursive: true });
    for (const id of ['button','input','field','checkbox','radio','switch','badge','divider','status-dot','icon']) {
      const fresh = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
      const lp = await fresh.newPage();
      lp.on('pageerror', error => errors.push(id + ' look: ' + error.message));
      await lp.goto(origin + '/#/system?style=main&detail=' + id);
      await lp.locator('.component-page[data-component="' + id + '"] .variant-grid').waitFor();
      await lp.evaluate(() => document.fonts.ready);
      const looks = await lp.evaluate(id => window.Pattove.systemRegistry.index.get(id).gallery.list.map(v => v.id), id);
      check(id + ' 모양 6개 이상', looks.length >= 6 && await lp.locator('.variant-card').count() === looks.length);
      check(id + ' 모양 이름 중복 없음', new Set(looks).size === looks.length);
      const current = () => lp.locator('.part-demo [data-look]').first().getAttribute('data-look');
      check(id + ' 기본 data-look은 첫 모양', await current() === looks[0]);
      check(id + ' 모양은 옵션 목록이 아닌 격자로만', await lp.locator('[data-part-option="look"]').count() === 0);
      await lp.locator('.variant-grid').first().screenshot({ path: path.join(lookShots, id + '-1440.png') });
      await lp.locator('[data-variant-pick]').nth(1).click();
      check(id + ' 카드를 누르면 data-look 변경', await current() === looks[1]);
      await lp.setViewportSize({ width: 390, height: 900 });
      await lp.waitForTimeout(100);
      check(id + ' 390 가로 넘침 없음', await lp.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const small = await lp.evaluate(() => [...document.querySelectorAll('.part-demo :is(button,input.ds-input,label.ds-choice),.variant-card :is(button,input.ds-input,label.ds-choice),[data-variant-pick],[data-variant-use]')]
        .filter(n => n.offsetParent).map(n => n.getBoundingClientRect()).filter(r => r.width < 44 || r.height < 44).length);
      check(id + ' 390 터치 칸 44px 이상', small === 0);
      await lp.screenshot({ path: path.join(lookShots, id + '-390.png'), fullPage: true });
      await fresh.close();
    }
    for (const id of ['card','search-module']) {
      await page.goto(url + '#/system?style=main&detail=' + id); await page.locator('.component-page[data-component="' + id + '"] .part-demo').waitFor();
      check(id + ' 안 부품은 기본 모양 유지(data-look 없음)', await page.locator('.part-demo [data-look]').count() === 0);
    }
    await page.goto(origin + '/#/system?style=main&detail=button');
    check('HTTP 실행에서도 같은 부품 화면', await page.locator('.part-demo .ds-button').count()>=1);
    check('브라우저 실행 오류 없음', errors.length===0);
    fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({checks,errors},null,2));
    console.log(checks.length+' atomic system checks passed.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
