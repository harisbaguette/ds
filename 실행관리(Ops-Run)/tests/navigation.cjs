const { chromium, firefox, webkit } = require('playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const base = process.env.PATTOVE_TEST_URL || 'http://127.0.0.1:4173/';
const out = path.resolve(__dirname, '../test-results/menu-update');
fs.mkdirSync(out, { recursive: true });
const checks = [], errors = [];
const check = (name, value) => { assert.ok(value, name); checks.push(name); };

(async () => {
  for (const [engineName, engine] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await engine.launch({ headless: true });
    try {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      page.setDefaultTimeout(7000);
      page.on('pageerror', e => errors.push(engineName + ': ' + e.message));
      const goto = async route => { await page.goto(base + '#/' + route); await page.locator('#primary-nav a').first().waitFor({state:'attached'}); };
      const visibleNav = () => page.locator('.nav-shelf-link').evaluateAll(links => links.every(a => {
        const r = a.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && a.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
      }));
      const shot = async name => { await page.evaluate(() => document.fonts.ready); await page.screenshot({ path: path.join(out, engineName + '-' + name + '.png'), animations: 'disabled' }); };
      await page.goto(base);
      check(engineName + ' 첫 방문은 단일 메인 스타일 전체 미리보기', page.url().endsWith('#/styles') && await page.locator('.overview-tile').count()===7);
      check(engineName + ' 스타일·주 메뉴 다섯 개·검색은 상단', await page.locator('.app-top #style-context').isVisible() && await page.locator('.app-top #query').isVisible() && await page.locator('.app-top .nav-shelf-link').count()===5 && await visibleNav());
      check(engineName + ' 전체 미리보기는 하위 메뉴 없이 전체 너비 사용', await page.locator('#app-menu').evaluate(e=>e.hidden) && await page.locator('main').evaluate(e=>e.getBoundingClientRect().left)===0);
      await page.locator('[data-focus="overview-button"]').click();
      check(engineName + ' 전체 미리보기의 실물에서 상세로 바로 이동', await page.locator('#detail-title').innerText()==='버튼');
      await page.locator('#style-context').click();
      check(engineName + ' 상단 스타일로 전체 미리보기 복귀', await page.locator('.style-overview').isVisible());
      await page.locator('#query').fill('TOK-01'); await page.locator('#query').press('ArrowDown'); await page.locator('#query').press('Enter');
      await page.waitForURL(/detail=token-color/);
      check(engineName + ' 전체 미리보기에서 모든 갈래의 항목 검색', await page.locator('[data-focus="tab-token"][aria-current="page"]').count()===1);
      await goto('dictionary');
      assert.deepEqual(await page.locator('.nav-shelf-link').allTextContents(), ['토큰','아이콘','부품','블록','템플릿']);
      check(engineName + ' 왼쪽 192px에는 선택한 부품의 여섯 분류만 표시', await page.locator('#app-menu').evaluate(e=>e.getBoundingClientRect().width)===192 && await page.locator('#secondary-nav .nav-subnav').count()===1 && await page.locator('#app-menu .nav-shelf-link').count()===0 && JSON.stringify(await page.locator('.nav-subcategory').allTextContents())===JSON.stringify(['버튼','입력','선택','탐색','표시','피드백']));
      check(engineName + ' 사전 주소는 기존 부품 목록, 주 메뉴 5개 모두 보임', await page.locator('#page-title').innerText()==='부품' && await visibleNav());
      await page.locator('[data-focus="nav-part-selection"]').click();
      assert.deepEqual(await page.locator('[data-library-entry]').evaluateAll(es=>es.map(e=>e.dataset.libraryEntry)),['checkbox','radio','switch']);
      await page.reload();
      check(engineName + ' 선택 분류 새로고침 유지', await page.locator('.nav-subcategory[aria-current="true"]').innerText()==='선택');
      await page.locator('[data-focus="nav-all"]').click();
      check(engineName + ' 전체 보기로 하위 분류 해제', !page.url().includes('group=') && await page.locator('[data-focus="nav-all"][aria-current="page"]').count()===1 && await page.locator('[data-library-entry="button"]').count()===1);
      await page.locator('[data-focus="nav-part-selection"]').click();
      await page.locator('[data-library-entry="checkbox"]').click();
      check(engineName + ' 상세에서도 선택 분류 유지', await page.locator('.nav-subcategory[aria-current="true"]').innerText()==='선택');
      await page.locator('[data-action="back-to-list"]').click(); await page.waitForURL(/group=selection/);
      check(engineName + ' 목록 복귀 시 하위 분류와 초점 복원', await page.locator('[data-library-entry="checkbox"]').evaluate(e=>e===document.activeElement));
      await goto('dictionary');
      check(engineName + ' 필터는 처음에 접힘', await page.locator('#filter-toggle').getAttribute('aria-expanded') === 'false');
      const data = await page.evaluate(() => {
        const { library: d, libraryUI: u, systemRegistry: r } = Pattove;
        const items = qs => u.currentItems({ page:'dictionary', query:'', filters:u.readFilters('dictionary',new URLSearchParams(qs)) });
        const shelves = d.shelves.map(s=>items('shelf='+s.id).filter(i=>i.implementation));
        return {
          registered:r.items.length, ids:shelves.flat().map(i=>i.id),
          valid:r.items.every(i=>d.shelves.some(s=>s.id===i.browse.shelf)&&d.categories.some(c=>c.id===i.browse.code)),
          tokens:items('shelf=token').filter(i=>i.implementation).map(i=>i.id),
          parts:items('shelf=part').filter(i=>i.implementation).map(i=>i.id),
          grouped:['buttons','fields','selection','navigation','display','feedback'].flatMap(group=>items('shelf=part&group='+group).map(i=>i.id)),
          filtered:items('shelf=part&kind='+encodeURIComponent('부품')).filter(i=>i.implementation).map(i=>i.id),
          input:items('shelf=part&code=INP').filter(i=>i.implementation).map(i=>i.id)
        };
      });
      check(engineName + ' 모든 구현의 소속은 유효하고 정확히 한 곳에 존재', data.valid && data.ids.length===data.registered && new Set(data.ids).size===data.registered);
      check(engineName + ' 토큰 20종 모두 토큰, 부품에 토큰 없음', data.tokens.length===20 && data.tokens.every(id=>id.startsWith('token-')) && data.parts.every(id=>!id.startsWith('token-')));
      assert.deepEqual(data.parts, data.filtered);
      check(engineName + ' 여섯 하위 분류가 구현 부품을 누락·중복 없이 포함', data.grouped.length===data.parts.length && new Set(data.grouped).size===data.parts.length && data.parts.every(id=>data.grouped.includes(id)));
      check(engineName + ' 사전 연결 없는 입력 부품도 입력 분류에서 찾음', ['input','field','checkbox','radio','switch'].every(id=>data.input.includes(id)));
      await shot('parts');
      await page.locator('#filter-toggle').click();
      await page.locator('#filter-bar [data-filter="kind:부품"]').click();
      check(engineName + ' 낱개 부품 선택 뒤 모든 구현 유지', await page.locator('.dict-entry.is-built').count() === data.parts.length);
      await page.keyboard.press('Escape');
      check(engineName + ' 닫힌 필터에서도 선택 조건 확인 가능', !await page.locator('#filter-bar').isVisible() && await page.locator('#active-filters .filter-chip').count()===1);
      await page.reload();
      check(engineName + ' 새로고침에도 필터 유지', await page.locator('.dict-entry.is-built').count()===data.parts.length && await page.locator('#active-filters .filter-chip').count()===1);
      await page.locator('#active-filters .filter-chip').click();
      check(engineName + ' 조건 칩으로 해제 후 필터 버튼으로 초점', !await page.locator('#active-filters').isVisible() && await page.locator('#filter-toggle').evaluate(e=>e===document.activeElement));

      await goto('dictionary?shelf=part&kind='+encodeURIComponent('부품'));
      await page.locator('#filter-toggle').click(); await shot('filters'); await page.locator('#filter-toggle').click();
      const card = page.locator('[data-library-entry="card"]');
      await card.scrollIntoViewIfNeeded();
      const listY = await page.evaluate(()=>scrollY);
      await card.click(); await page.waitForURL(/system\?detail=card/);
      check(engineName + ' 상세에서도 주 메뉴 유지, 같은 분류만 선택', await visibleNav() && await page.locator('[data-item-switch] option').count()===data.parts.length);
      await page.locator('[data-item-switch]').selectOption('button'); await page.waitForURL(/detail=button/); await shot('detail');
      check(engineName + ' 상세 이동 뒤에도 메뉴 스크롤 없음', await visibleNav() && await page.locator('.menu-body').evaluate(e=>e.scrollTop)===0);
      await page.locator('[data-action="back-to-list"]').click(); await page.waitForURL(/dictionary/);
      check(engineName + ' 목록 복귀 시 필터·스크롤·원래 카드 초점 복원', page.url().includes('kind=') && Math.abs((await page.evaluate(()=>scrollY))-listY)<3 && await card.evaluate(e=>e===document.activeElement));
      await page.goForward(); await page.waitForURL(/detail=card/);
      await page.goBack(); await page.waitForURL(/dictionary/);
      check(engineName + ' 브라우저 앞뒤 이동에서도 주 메뉴 유지', await visibleNav());

      await goto('dictionary?shelf=part&q='+encodeURIComponent('입력'));
      await page.locator('[data-library-entry="input"]').click();
      await page.locator('#query').fill('토큰');
      check(engineName + ' 부품 상세의 검색 제안에 토큰이 섞이지 않음', await page.locator('.search-suggestion').count()===0);
      await page.locator('#query').fill('버튼'); await page.locator('#query').press('Enter'); await page.waitForURL(/dictionary/);
      check(engineName + ' 상세 검색 제출은 해당 분류 결과로 이동', page.url().includes('shelf=part') && await page.locator('[data-library-entry="button"]').count()===1);
      await goto('dictionary?shelf=token');
      await page.locator('#query').fill('TOK-01'); await page.locator('#query').press('ArrowDown'); await page.locator('#query').press('Enter');
      await page.waitForURL(/detail=token-color/);
      check(engineName + ' 사전 ID 검색과 상세 소속 유지', await page.locator('[data-focus="tab-token"][aria-current="page"]').count()===1);
      await goto('dictionary?category=ICO.navigation');
      check(engineName + ' 예전 분류 주소 유지', page.url().includes('shelf=icon') && page.url().includes('icon=navigation'));
      check(engineName + ' 아이콘 목록에는 구현 예시 카드가 없음', await page.locator('.dict-entry.is-built').count()===0);
      check(engineName + ' 홈 아이콘은 일반 아이콘으로 복원', await page.locator('[data-library-entry="ICO-01"] .dict-glyph use').getAttribute('href')==='assets/icons/sets/lucide.svg#house');
      await page.locator('[data-library-entry="ICO-01"]').click();
      check(engineName + ' 홈 아이콘 상세는 홈 그림', await page.locator('dialog .detail-glyph use').getAttribute('href')==='assets/icons/sets/lucide.svg#house');
      await page.keyboard.press('Escape'); await page.waitForFunction(()=>!document.querySelector('dialog').open);
      await goto('system?detail=icon');
      check(engineName + ' 아이콘 표시 부품은 부품 메뉴에 소속', await page.locator('[data-focus="tab-part"][aria-current="page"]').count()===1 && await page.locator('#detail-title').innerText()==='아이콘 표시');
      await goto('dictionary?shelf=icon');
      const topBefore = await page.locator('#primary-nav').boundingBox();
      await page.locator('.menu-body').evaluate(e=>e.scrollTop=e.scrollHeight);
      check(engineName + ' 긴 하위 분류를 스크롤해도 상단 메뉴 위치 유지', await page.locator('.menu-body').evaluate(e=>e.scrollTop)>0 && JSON.stringify(await page.locator('#primary-nav').boundingBox())===JSON.stringify(topBefore) && await visibleNav());
      await page.locator('[data-focus="tab-token"]').click();
      check(engineName + ' 주 메뉴 변경 시 하위 목록과 스크롤 갱신', await page.locator('.menu-body').evaluate(e=>e.scrollTop)===0 && await page.locator('#secondary-nav [data-focus^="nav-icon-"]').count()===0);
      await goto('dictionary?shelf=icon');
      await shot('icons');
      await page.locator('button.dict-entry').first().click();
      check(engineName + ' 사전 그림 상세 유지', await page.locator('dialog').isVisible());
      await page.keyboard.press('Escape'); await page.waitForFunction(()=>!document.querySelector('dialog').open);
      await goto('styles');
      check(engineName + ' 전체 스타일 적용 유지', await page.evaluate(()=>document.body.className==='theme-main') && await page.locator('#style-context[aria-current="page"]').count()===1);
      await goto('patterns?style=main');
      check(engineName + ' 기존 패턴 화면 유지', await page.locator('.pattern-card').count()===12);
      await page.locator('[data-open="toast"]').click(); await page.keyboard.press('Escape'); await page.waitForFunction(()=>!document.querySelector('dialog').open);

      for (const width of [320,390,760,768,955,1100,1101,1440]) {
        await page.setViewportSize({width,height:900});
        for (const route of ['dictionary','dictionary?shelf=token','dictionary?shelf=icon','styles','system?detail=button','system?detail=page']) {
          await goto(route);
          check(`${engineName} ${width} ${route} 가로 넘침 없음`, await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
          check(`${engineName} ${width} ${route} 주 메뉴 다섯 개가 상단에 보임`, await visibleNav());
        }
        if (width<=760) {
          await goto('dictionary'); await page.locator('#menu-toggle').click();
          check(`${engineName} ${width} 모바일 서랍에는 선택한 분류만 표시`, await page.locator('#secondary-nav .nav-subcategory').count()===6 && await page.locator('#main').evaluate(e=>e.inert) && await page.locator('.app-top').evaluate(e=>e.inert));
          await page.locator('#secondary-nav a').last().focus(); await page.keyboard.press('Tab');
          check(`${engineName} ${width} 메뉴 안에서 키보드 초점 유지`, await page.evaluate(()=>!!document.activeElement.closest('#app-menu')));
          await page.locator('[data-focus="nav-part-selection"]').click();
          check(`${engineName} ${width} 분류 이동 후 서랍 닫힘`, page.url().includes('group=selection') && !await page.locator('#main').evaluate(e=>e.inert) && !await page.locator('.app-top').evaluate(e=>e.inert));
          await page.locator('[data-focus="tab-token"]').click();
          await page.keyboard.press('/');
          check(`${engineName} ${width} 검색 단축키는 상단 검색으로`, await page.locator('#query').evaluate(e=>e===document.activeElement) && await page.locator('#menu-toggle').getAttribute('aria-expanded')==='false');
          check(`${engineName} ${width} 검색 입력 중에도 상단 주 메뉴를 가리지 않음`, await visibleNav() && await page.locator('.search-area').evaluate(e=>e.getBoundingClientRect().width>=innerWidth-24));
          await page.locator('#filter-toggle').click();
          check(`${engineName} ${width} 필터는 메뉴와 별도로 열림`, await page.locator('#filter-bar').isVisible() && await page.locator('#menu-toggle').getAttribute('aria-expanded')==='false');
          await page.keyboard.press('Escape');
          if(width===390) {
            await shot('mobile'); await page.locator('#menu-toggle').click(); await shot('mobile-menu');
            await page.locator('[data-action="close-menu"]').click();
          }
        }
      }
      await page.setViewportSize({width:1440,height:1000});
      await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href+'#/dictionary?shelf=token');
      check(engineName + ' 파일 직접 열기에서도 토큰 20종 탐색', await page.locator('.dict-entry.is-built').count()===20);
    } finally { await browser.close(); }
  }
  check('브라우저 실행 오류 없음', errors.length===0);
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks,errors},null,2));
  console.log(checks.length+' navigation checks passed across Chromium, Firefox and WebKit.');
})().catch(e=>{console.error(e);process.exitCode=1;});
