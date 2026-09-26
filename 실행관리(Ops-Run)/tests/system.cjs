const { chromium } = require('playwright-core');
const { pathToFileURL } = require('node:url');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const url = pathToFileURL(path.join(root, 'index.html')).href;
const output = path.join(root, 'test-results/system');
fs.mkdirSync(output, { recursive: true });
const checks = [], errors = [];
const check = (name, value) => { assert.ok(value, name); checks.push(name); };
const inspect = async (page, style, id) => {
  await page.goto(url + '#/system?style=' + style + '&detail=' + id);
  await page.locator('.system-inspector').waitFor();
  await page.evaluate(() => document.fonts.ready);
};
const fingerprint = element => {
  const s = getComputedStyle(element);
  return Object.fromEntries(['color','backgroundColor','borderColor','borderWidth','borderRadius','boxShadow','fontFamily','fontSize','fontWeight','padding','minHeight','outlineColor'].map(key => [key,s[key]]));
};
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
    const page = await context.newPage();
    page.setDefaultTimeout(7000);
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url + '#/styles');
    await page.evaluate(() => document.fonts.ready);
    check('메인 스타일 시트로 바로 진입', await page.locator('.system-board .specimen').count() === 18 && await page.locator('[data-style-choice]').count() === 0);
    check('현재 스타일은 하나', await page.evaluate(()=>Pattove.catalog.styles.length===1 && Pattove.catalog.styles[0].id==='main'));
    await page.screenshot({ path: path.join(output, 'styles.png') });
    check('18개 대표 구현과 8개 역할', await page.locator('.specimen').count() === 18 && await page.evaluate(() => new Set([...Pattove.systemRegistry.items, ...Pattove.systemRegistry.patterns].map(i=>i.layer)).size === 8));
    check('의존 관계는 존재하는 구현을 참조', await page.evaluate(() => Pattove.systemRegistry.items.every(item => item.deps.every(id=>Pattove.systemRegistry.index.has(id)))));
    const sourceBlocks = Object.fromEntries([...fs.readFileSync(path.join(root,'src/system/parts.css'),'utf8').matchAll(/\/\* @part ([\w-]+) \*\/([\s\S]*?)(?=\/\* @part |$)/g)].map(match=>[match[1],match[2].trim()]));
    check('내보내기 CSS 생성본이 공용 원본과 일치', await page.evaluate(expected=>JSON.stringify(Pattove.systemSource)===JSON.stringify(expected),sourceBlocks));
    check('사전 연결 무결성', await page.evaluate(() => Pattove.systemRegistry.items.every(item => !item.entry || Pattove.library.entries.some(e=>e.id===item.entry))));
    check('크기와 상태는 버튼의 변형', await page.locator('.button-matrix tbody tr').count() === 6 && await page.locator('.button-options [data-size]').count() === 5);
    await page.screenshot({ path: path.join(output, 'board.png') });
    await page.locator('#query').fill('버튼');
    await page.locator('#query').press('Enter');
    check('검색 조건 유지', await page.locator('#query').inputValue() === '버튼' && await page.locator('.specimen').count() === 1);
    await page.reload();
    check('주소에서 상태 복원', await page.locator('.system-board[data-style="main"]').count() === 1 && await page.locator('.specimen').count() === 1);
    await page.locator('[data-system-detail="button"]').click();
    await page.locator('[data-part-option="variant"]').selectOption('outline');
    await page.locator('[data-part-option="size"]').selectOption('lg');
    check('선택한 변형과 가져갈 마크업 일치', (await page.locator('#part-source').inputValue()).includes('data-size="lg"') && await page.locator('.part-demo .ds-button').getAttribute('data-variant') === 'outline');
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('dialog').open);
    check('상세 닫기 후 원래 코드 버튼에 초점 복귀', await page.locator('[data-system-detail="button"]').evaluate(n=>n===document.activeElement));
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
    await page.locator('.part-dependencies [data-system-detail="field"]').click();
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
    const styles = await page.evaluate(()=>Pattove.catalog.styles.filter(s=>s.id!=='base').map(s=>s.id));
    const standalone = await context.newPage();
    standalone.on('pageerror', error => errors.push(error.message));
    const externalRequests=[];
    standalone.on('request', request=>{if(/^https?:/.test(request.url())) externalRequests.push(request.url());});
    for (const style of styles) {
      await inspect(page, style, 'button');
      const original = await demo.locator('.ds-button').evaluate(fingerprint);
      const downloadEvent = page.waitForEvent('download');
      await page.locator('[data-system-download]').click();
      const download = await downloadEvent;
      const file = path.join(output,download.suggestedFilename());
      await download.saveAs(file);
      await standalone.goto(pathToFileURL(file).href);
      await standalone.evaluate(()=>document.fonts.ready);
      check(style+' 단독 HTML 표현 동일', JSON.stringify(await standalone.locator('.ds-button').evaluate(fingerprint)) === JSON.stringify(original));
      check(style+' 외부 앱 없이 글꼴 포함', await standalone.evaluate(()=>document.fonts.check('16px Pretendard')));
      const html=fs.readFileSync(file,'utf8');
      check(style+' 관련 없는 모듈 소스 미포함', !html.includes('.ds-search-module {'));
    }
    for (const id of ['page','checkbox','radio','switch','input','tabs']) {
      await inspect(page,'main',id);
      const pending=page.waitForEvent('download'); await page.locator('[data-system-download]').click();
      const download=await pending; const file=path.join(output,download.suggestedFilename());await download.saveAs(file);
      await standalone.goto(pathToFileURL(file).href);
      check(id+' 단독 HTML 마운트', await standalone.locator('.ds').count()===1);
      if(id==='page') {
        await standalone.locator('[name="query"]').fill('없는이름'); await standalone.locator('button[type="submit"]').click();
        check('내보낸 화면에서도 검색·빈 결과 동작', await standalone.locator('.ds-empty').isVisible());
        await standalone.locator('[data-part-action="reset-search"]').click();
        check('내보낸 화면 복구', await standalone.locator('[data-result]:visible').count()===3);
        await standalone.setViewportSize({width:320,height:800});
        check('내보낸 화면 320px 넘침 없음', await standalone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      }
    }
    await inspect(page,'main','icon');
    await page.locator('[data-part-option="icon"]').selectOption('bookmark');
    const svgEvent=page.waitForEvent('download');await page.locator('[data-system-download]').click();
    const svgDownload=await svgEvent;const svgFile=path.join(output,svgDownload.suggestedFilename());await svgDownload.saveAs(svgFile);
    check('아이콘은 독립 SVG로 가져오기', svgFile.endsWith('bookmark.svg') && fs.readFileSync(svgFile,'utf8').includes('xmlns="http://www.w3.org/2000/svg"') && fs.statSync(svgFile).size<2000);
    check('내보낸 파일의 네트워크 의존 없음', externalRequests.length===0);
    const staticContext = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await staticContext.newPage();
    await staticPage.goto(pathToFileURL(path.join(output,'pattove-main-checkbox.html')).href);
    check('JavaScript 없는 HTML에서도 기본 표현과 입력 유지', await staticPage.locator('input[type="checkbox"]').isChecked());
    await staticPage.locator('input').uncheck();
    check('JavaScript 없는 네이티브 체크 조작', !await staticPage.locator('input').isChecked());
    await staticContext.close();
    for(const width of [320,375,768,1440]) {
      await page.setViewportSize({width,height:1000});
      for(const style of ['main']) {
        await page.goto(url+'#/system?style='+style);
        check(width+' '+style+' 보드 가로 넘침 없음', await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        const duplicates=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(n=>n.id);return ids.length!==new Set(ids).size;});
        check(width+' '+style+' 중복 ID 없음', !duplicates);

      }
    }
    await page.goto(url+'#/system?style=main&category=buttons');await page.screenshot({path:path.join(output,'button-matrix.png')});
    await page.setViewportSize({width:375,height:1000});
    await page.goto(url+'#/system?style=main&category=page');await page.screenshot({path:path.join(output,'mobile-page.png'),fullPage:true});
    await page.goto('http://127.0.0.1:4173/#/system?style=main&category=buttons');
    check('HTTP 실행에서도 동일한 보드', await page.locator('.button-matrix tbody tr').count()===6);
    check('브라우저 실행 오류 없음', errors.length===0);
    fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({checks,errors},null,2));
    console.log(checks.length+' atomic system checks passed.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
