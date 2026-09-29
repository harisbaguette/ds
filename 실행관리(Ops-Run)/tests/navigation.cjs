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
      const goto = async route => { await page.goto(base + '#/' + route); await page.locator('#side-nav a').first().waitFor({state:'attached'}); };
      // Wide screens keep all five shelves on the left; phones keep the menu button in the top bar and the shelves in the drawer.
      const visibleNav = () => page.evaluate(() => {
        if (innerWidth <= 760) { const r = document.querySelector('#menu-toggle').getBoundingClientRect(); return r.width >= 44 && r.right <= innerWidth && r.left >= 0; }
        return [...document.querySelectorAll('.side-parent')].length === 5 && [...document.querySelectorAll('.side-parent')].every(a => {
          const r = a.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && a.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
        });
      });
      const shot = async name => { await page.evaluate(() => document.fonts.ready); await page.screenshot({ path: path.join(out, engineName + '-' + name + '.png'), animations: 'disabled' }); };
      await page.goto(base);
      check(engineName + ' 첫 방문은 단일 메인 스타일 전체 미리보기', page.url().endsWith('#/styles') && await page.locator('.overview-tile').count()===7);
      check(engineName + ' 스타일·검색 단추는 상단, 다섯 갈래는 왼쪽 나무, 검색 칸은 창 안에만', await page.locator('.app-top #style-context').isVisible() && await page.locator('.app-top #search-open').isVisible() && await page.locator('#query').count()===1 && !await page.locator('#query').isVisible() && await page.locator('.app-top .side-parent').count()===0 && await page.locator('#app-menu .side-parent').count()===5 && await visibleNav());
      check(engineName + ' 전체 미리보기에서도 왼쪽 나무는 다섯 갈래를 모두 접어서 보여줌', await page.locator('.side-group.is-open').count()===0 && await page.locator('.side-parent[aria-expanded="false"]').count()===5 && await page.locator('main').evaluate(e=>e.getBoundingClientRect().left)===224);
      await page.locator('[data-focus="overview-button"]').click();
      check(engineName + ' 전체 미리보기의 실물에서 상세로 바로 이동', await page.locator('#detail-title').innerText()==='버튼');
      await page.locator('#style-context').click();
      check(engineName + ' 상단 스타일로 전체 미리보기 복귀', await page.locator('.style-overview').isVisible());
      await page.locator('#search-open').click();
      check(engineName + ' 검색 단추를 누르면 검색 창이 열리고 입력 칸에 초점', await page.locator('#search-dialog').evaluate(d=>d.open) && await page.locator('#query').evaluate(e=>e===document.activeElement));
      await page.locator('#query').fill('TOK-01'); await page.locator('#query').press('ArrowDown'); await page.locator('#query').press('Enter');
      await page.waitForURL(/detail=token-color/);
      check(engineName + ' 전체 미리보기에서 모든 갈래의 항목 검색', await page.locator('[data-focus="tab-token"][aria-expanded="true"]').count()===1);
      await goto('dictionary');
      assert.deepEqual((await page.locator('.side-parent').allTextContents()).map(t=>t.trim()), ['토큰','아이콘','부품','블록','템플릿']);
      check(engineName + ' 왼쪽 224px 나무: 대분류 다섯 줄, 열린 부품 아래에만 여섯 소분류', await page.locator('#app-menu').evaluate(e=>e.getBoundingClientRect().width)===224 && await page.locator('#side-nav .side-group.is-open').count()===1 && await page.locator('#app-menu .side-parent').count()===5 && JSON.stringify(await page.locator('.side-group.is-open .side-child').allTextContents())===JSON.stringify(['버튼','입력','선택','탐색','표시','피드백']));
      check(engineName + ' 사전 주소는 기존 부품 목록, 주 메뉴 5개 모두 보임', await page.locator('#page-title').innerText()==='부품' && await visibleNav());
      await page.locator('[data-focus="nav-part-selection"]').click();
      assert.deepEqual(await page.locator('[data-library-entry]').evaluateAll(es=>es.map(e=>e.dataset.libraryEntry)),['checkbox','radio','switch']);
      await page.reload();
      check(engineName + ' 선택 분류 새로고침 유지', await page.locator('.side-child[aria-current="true"]').innerText()==='선택');
      await page.locator('[data-focus="tab-part"]').click();
      check(engineName + ' 대분류 줄을 누르면 소분류 해제', !page.url().includes('group=') && await page.locator('[data-focus="tab-part"][aria-current="page"]').count()===1 && await page.locator('[data-library-entry="button"]').count()===1);
      await page.locator('[data-focus="nav-part-selection"]').click();
      await page.locator('[data-library-entry="checkbox"]').click();
      check(engineName + ' 상세에서도 선택 분류 유지', await page.locator('.side-child[aria-current="true"]').innerText()==='선택');
      await page.locator('[data-action="back-to-list"]').click(); await page.waitForURL(/group=selection/);
      check(engineName + ' 목록 복귀 시 하위 분류와 초점 복원', await page.locator('[data-library-entry="checkbox"]').evaluate(e=>e===document.activeElement));
      await goto('dictionary');
      check(engineName + ' 필터 단추·필터 칸·분류 찾기 칸 없음', await page.locator('#filter-toggle, #filter-bar, #active-filters, .facet-search, [data-filter]').count() === 0);
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
      await goto('dictionary?shelf=icon&icon=navigation');
      await page.locator('#search-open').click(); await page.locator('#query').fill('홈'); await page.locator('#query').press('Enter');
      await page.waitForURL(/q=/);
      check(engineName + ' 검색은 왼쪽 분류와 상관없이 탭 전체에서 찾고 창은 닫힘', !page.url().includes('icon=navigation') && !await page.locator('#search-dialog').evaluate(d=>d.open) && await page.locator('[data-focus="tab-icon"][aria-current="page"]').count()===1 && await page.locator('[data-library-entry="ICO-01"]').count()===1);
      check(engineName + ' 쓰는 중인 검색어는 제목 옆 칩으로 보임', (await page.locator('#query-chip').innerText()).includes('홈'));
      await page.reload();
      check(engineName + ' 새로고침에도 검색어 칩 유지', await page.locator('#query-chip').isVisible());
      await page.locator('#query-chip').click();
      check(engineName + ' 검색어 칩으로 검색 해제 후 본문으로 초점', !page.url().includes('q=') && !await page.locator('#query-chip').isVisible() && await page.locator('#main').evaluate(e=>e===document.activeElement));
      await page.locator('#search-open').click(); await page.mouse.click(5, 995);
      check(engineName + ' 검색 창 바깥을 누르면 닫힘', !await page.locator('#search-dialog').evaluate(d=>d.open));

      await goto('dictionary?shelf=part&kind='+encodeURIComponent('부품'));
      check(engineName + ' 주소의 종류 조건은 그대로 거름', await page.locator('.dict-entry.is-built').count() === data.parts.length);
      const card = page.locator('[data-library-entry="card"]');
      await card.scrollIntoViewIfNeeded();
      const listY = await page.evaluate(()=>scrollY);
      await card.click(); await page.waitForURL(/system\?detail=card/);
      check(engineName + ' 상세에서도 메뉴 유지, 같은 분류만 선택', await visibleNav() && await page.locator('[data-item-switch] option').count()===data.parts.length);
      await page.locator('[data-item-switch]').selectOption('button'); await page.waitForURL(/detail=button/); await shot('detail');
      check(engineName + ' 상세 이동 뒤에도 메뉴 스크롤 없음', await visibleNav() && await page.locator('.menu-body').evaluate(e=>e.scrollTop)===0);
      await page.locator('[data-action="back-to-list"]').click(); await page.waitForURL(/dictionary/);
      check(engineName + ' 목록 복귀 시 필터·스크롤·원래 카드 초점 복원', page.url().includes('kind=') && Math.abs((await page.evaluate(()=>scrollY))-listY)<3 && await card.evaluate(e=>e===document.activeElement));
      await page.goForward(); await page.waitForURL(/detail=card/);
      await page.goBack(); await page.waitForURL(/dictionary/);
      check(engineName + ' 브라우저 앞뒤 이동에서도 메뉴 유지', await visibleNav());

      await goto('dictionary?shelf=part&q='+encodeURIComponent('입력'));
      await page.locator('[data-library-entry="input"]').click();
      await page.locator('#search-open').click(); await page.locator('#query').fill('토큰');
      check(engineName + ' 부품 상세의 검색 제안에 토큰이 섞이지 않음', await page.locator('.search-suggestion').count()===0);
      await page.locator('#query').fill('버튼'); await page.locator('#query').press('Enter'); await page.waitForURL(/dictionary/);
      check(engineName + ' 상세 검색 제출은 해당 분류 결과로 이동', page.url().includes('shelf=part') && await page.locator('[data-library-entry="button"]').count()===1);
      await goto('dictionary?shelf=token');
      await page.locator('#search-open').click(); await page.locator('#query').fill('TOK-01'); await page.locator('#query').press('ArrowDown'); await page.locator('#query').press('Enter');
      await page.waitForURL(/detail=token-color/);
      check(engineName + ' 사전 ID 검색과 상세 소속 유지', await page.locator('[data-focus="tab-token"][aria-expanded="true"]').count()===1);
      await goto('dictionary?category=ICO.navigation');
      check(engineName + ' 예전 분류 주소 유지', page.url().includes('shelf=icon') && page.url().includes('icon=navigation'));
      check(engineName + ' 아이콘 목록에는 구현 예시 카드가 없음', await page.locator('.dict-entry.is-built').count()===0);
      check(engineName + ' 홈 아이콘 카드는 일러스트 그림으로 표시', await page.locator('[data-library-entry="ICO-01"].is-illustrated .illustrated-icon').isVisible());
      await goto('dictionary?shelf=icon&p=99999');
      check(engineName + ' 그림이 아직 없는 아이콘 카드는 미구현 표시', await page.locator('.dict-entry.is-todo .dict-todo').first().textContent()==='미구현');
      await page.locator('.dict-entry.is-todo').first().click();
      check(engineName + ' 미구현 아이콘 상세는 미구현 안내', await page.locator('dialog .detail-art.is-todo').count()===1);
      await page.keyboard.press('Escape'); await page.waitForFunction(()=>!document.querySelector('dialog').open);
      await goto('system?detail=icon');
      check(engineName + ' 아이콘 표시 부품은 부품 메뉴에 소속', await page.locator('[data-focus="tab-part"][aria-expanded="true"]').count()===1 && await page.locator('#detail-title').innerText()==='아이콘 표시');
      await goto('dictionary?shelf=icon');
      const partBefore = await page.locator('[data-focus="tab-part"]').boundingBox();
      check(engineName + ' 아이콘 소분류가 길어도 나무 안에서만 스크롤됨', await page.locator('.side-children').evaluate(e=>e.scrollHeight>e.clientHeight));
      await page.locator('.side-children').evaluate(e=>e.scrollTop=e.scrollHeight);
      check(engineName + ' 긴 소분류를 스크롤해도 다른 대분류 위치 유지', await page.locator('.side-children').evaluate(e=>e.scrollTop)>0 && JSON.stringify(await page.locator('[data-focus="tab-part"]').boundingBox())===JSON.stringify(partBefore) && await visibleNav());
      await page.locator('[data-focus="tab-token"]').click();
      check(engineName + ' 대분류 변경 시 소분류 목록 교체', await page.locator('#side-nav [data-focus^="nav-icon-"]').count()===0 && await page.locator('#side-nav [data-focus^="nav-token-"]').count()>0);
      await goto('dictionary?shelf=icon');
      await shot('icons');
      await page.locator('button.dict-entry').first().click();
      check(engineName + ' 사전 그림 상세 유지', await page.locator('#detail-dialog').isVisible());
      await page.keyboard.press('Escape'); await page.waitForFunction(()=>!document.querySelector('dialog').open);
      await goto('styles');
      check(engineName + ' 전체 스타일 적용 유지', await page.evaluate(()=>document.body.className==='theme-main') && await page.locator('#style-context[aria-current="page"]').count()===1);
      await goto('patterns?style=main');
      check(engineName + ' 기존 패턴 화면 유지', await page.locator('.pattern-card').count()===12);
      await page.locator('[data-open="toast"]').click(); await page.keyboard.press('Escape'); await page.waitForFunction(()=>!document.querySelector('dialog').open);

      // Icon tiles are square, and long shelves are cut into numbered pages.
      await goto('dictionary?shelf=icon');
      check(engineName + ' 아이콘 칸은 모두 1:1', await page.locator('.dict[data-shelf="icon"] .dict-entry').evaluateAll(es=>es.length===72&&es.every(e=>{const r=e.getBoundingClientRect();return Math.abs(r.width-r.height)<1.5;})));
      check(engineName + ' 아이콘 목록은 72개씩 쪽으로 나뉘고 지금 쪽이 표시됨', await page.locator('.pagination [aria-current="page"]').innerText()==='1' && await page.locator('.page-step[aria-label="이전"]').isDisabled());
      await page.locator('.page-step[aria-label="다음"]').click(); await page.waitForURL(/p=2/);
      check(engineName + ' 다음 쪽으로 이동하면 맨 위에서 시작하고 주소에 쪽 번호가 남음', await page.evaluate(()=>scrollY)===0 && await page.locator('.pagination [aria-current="page"]').innerText()==='2' && await page.locator('.dict-entry').count()===72);
      await page.reload();
      check(engineName + ' 새로고침해도 같은 쪽', await page.locator('.pagination [aria-current="page"]').innerText()==='2');
      await page.locator('.page-jump input').fill('9'); await page.locator('.page-jump input').press('Enter'); await page.waitForURL(/p=9/);
      check(engineName + ' 쪽 번호를 적어 바로 이동', await page.locator('.pagination [aria-current="page"]').innerText()==='9');
      await page.goto(base + '#/dictionary?shelf=icon&p=99999');
      check(engineName + ' 범위를 넘은 쪽 번호는 마지막 쪽으로 고침', await page.locator('.pagination .page-num.is-current').innerText()===await page.locator('.pagination .page-num').last().innerText());
      await page.locator('[data-focus="nav-icon-navigation"]').click(); await page.waitForURL(/icon=navigation/);
      check(engineName + ' 분류를 바꾸면 1쪽부터', !page.url().includes('p=') && await page.locator('.pagination [aria-current="page"]').count()===1 && await page.locator('.pagination [aria-current="page"]').innerText()==='1');
      await goto('dictionary?shelf=part&group=selection');
      check(engineName + ' 한 쪽에 다 들어가는 목록에는 쪽 이동 없음', await page.locator('.pagination').count()===0);
      await page.locator('#rail-toggle').click();
      check(engineName + ' 메뉴 접기: 대분류 그림만 남고 본문이 넓어짐', await page.locator('#app-menu').evaluate(e=>e.getBoundingClientRect().width)===80 && await page.locator('main').evaluate(e=>e.getBoundingClientRect().left)===80);
      await page.reload(); await page.locator('#side-nav a').first().waitFor({state:'attached'});
      check(engineName + ' 접은 메뉴는 새로고침해도 유지', await page.locator('#app-menu').evaluate(e=>e.getBoundingClientRect().width)===80);
      await page.locator('#rail-toggle').click();
      check(engineName + ' 다시 펼침', await page.locator('#app-menu').evaluate(e=>e.getBoundingClientRect().width)===224);

      for (const width of [320,390,760,768,955,1100,1101,1440]) {
        await page.setViewportSize({width,height:900});
        for (const route of ['dictionary','dictionary?shelf=token','dictionary?shelf=icon','styles','system?detail=button','system?detail=page']) {
          await goto(route);
          check(`${engineName} ${width} ${route} 가로 넘침 없음`, await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
          check(`${engineName} ${width} ${route} 메뉴가 보임`, await visibleNav());
        }
        if (width<=760) {
          await goto('dictionary'); await page.locator('#menu-toggle').click();
          check(`${engineName} ${width} 모바일 서랍에는 대분류 다섯과 선택한 부품의 소분류 여섯`, await page.locator('#side-nav .side-parent').count()===5 && await page.locator('#side-nav .side-child').count()===6 && await page.locator('#main').evaluate(e=>e.inert) && await page.locator('.app-top').evaluate(e=>e.inert));
          await page.locator('#side-nav a').last().focus(); await page.keyboard.press('Tab');
          check(`${engineName} ${width} 메뉴 안에서 키보드 초점 유지`, await page.evaluate(()=>!!document.activeElement.closest('#app-menu')));
          await page.locator('[data-focus="nav-part-selection"]').click();
          check(`${engineName} ${width} 분류 이동 후 서랍 닫힘`, page.url().includes('group=selection') && !await page.locator('#main').evaluate(e=>e.inert) && !await page.locator('.app-top').evaluate(e=>e.inert));
          await page.locator('#menu-toggle').click(); await page.locator('[data-focus="tab-token"]').click();
          await page.keyboard.press('/');
          check(`${engineName} ${width} 검색 단축키는 검색 창으로`, await page.locator('#search-dialog').evaluate(d=>d.open) && await page.locator('#query').evaluate(e=>e===document.activeElement) && await page.locator('#menu-toggle').getAttribute('aria-expanded')==='false');
          check(`${engineName} ${width} 검색 창은 화면 안에 들어감`, await page.locator('#search-dialog').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}));
          await page.keyboard.press('Escape');
          check(`${engineName} ${width} Esc로 검색 창을 닫으면 열기 전 자리로 초점`, !await page.locator('#search-dialog').evaluate(d=>d.open) && await page.locator('#main').evaluate(e=>e===document.activeElement));
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
