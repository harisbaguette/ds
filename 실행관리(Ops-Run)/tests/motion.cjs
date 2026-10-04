const { exercise } = require('./motion-interactions.cjs');
const { chromium, firefox, webkit } = require('playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'test-results/motion');
fs.mkdirSync(out, {recursive:true});
const base = process.env.PATTOVE_TEST_URL || 'http://127.0.0.1:4173/';
const checks = [], errors = [];
const check = (name, value) => { assert.ok(value, name); checks.push(name); if(process.env.MOTION_DEBUG)console.log(name); };
const parse = text => JSON.parse(text.slice(text.indexOf('{')));
const write = (file, text) => { fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,text); };
const framesReady = page => page.waitForFunction(() => [...document.querySelectorAll('[data-motion-frame]')].some(f => f.dataset.motionReady === 'true'));
let exported;
(async () => {
  for (const [engineName, engine] of Object.entries({chromium,firefox,webkit})) {
    const browser = await engine.launch({headless:true});
    try {
      const context = await browser.newContext({viewport:{width:1440,height:1000}, reducedMotion:'no-preference', ...(engineName === 'chromium' ? {permissions:['clipboard-read','clipboard-write']} : {})});
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      page.on('pageerror', error => errors.push(engineName + ': ' + error.message));
      const goto = async route => { await page.goto(base + '#/motion' + route); const id=new URLSearchParams(route).get('detail'); await page.locator(id ? '[data-motion-detail="'+id+'"]' : '.motion-library').waitFor(); };
      await goto('');
      check(engineName + ' 모션 주 메뉴와 34개 미리보기를 한 쪽에', await page.locator('[data-focus="tab-motion"][aria-current="page"]').count() === 1 && await page.locator('.motion-card').count() === 34 && await page.locator('.pagination').count() === 0);
      await framesReady(page);
      await page.locator('[data-motion-global]:visible').click();
      await page.frameLocator('[data-motion-frame]').first().locator('html[data-paused]').waitFor();
      check(engineName + ' 전체 일시정지', (await page.locator('[data-motion-global]:visible').innerText()).includes('재생') && await page.frameLocator('[data-motion-frame]').first().locator('html').evaluate(n => n.hasAttribute('data-paused')));
      await page.locator('[data-motion-global]:visible').click();
      await page.locator('[data-focus="motion-nav-spatial"]').click();
      check(engineName + ' 카테고리 필터와 주소', await page.locator('.motion-card').count() === 2 && page.url().includes('category=spatial'));
      await page.locator('#search-open').click();
      await page.locator('#query').fill('오로라');
      await page.locator('#query').press('Enter');
      check(engineName + ' 검색 시 이전 카테고리 해제', await page.locator('.motion-card').count() === 1 && !page.url().includes('category=') && await page.locator('.motion-card h2').textContent() === '오로라 메쉬');
      await page.locator('.motion-card h2 a').click();
      await framesReady(page);
      // The screen shows pictures only: no code view, conditions or download; one 사용 환경 choice drives both copies.
      check(engineName + ' 모션 상세는 그림과 복사 단추만', await page.locator('[data-motion-detail="aurora"]').count() === 1 && await page.locator('[data-motion-tab],#motion-code,.motion-conditions,.motion-files,[data-motion-download]').count() === 0 && await page.locator('[data-motion-target]').count() === 1 && await page.locator('[data-motion-code-copy]').count() === 1 && await page.locator('[data-motion-copy]').count() === 1);
      await page.locator('[data-motion-target]').selectOption('next');
      check(engineName + ' 사용 환경을 바꾸면 두 복사 단추가 함께 바뀜', (await page.locator('[data-motion-code-copy]').getAttribute('aria-label')).includes('Next.js') && (await page.locator('[data-motion-copy]').getAttribute('aria-label')).includes('Next.js'));
      let pack = parse(await page.evaluate(() => Pattove.motionUI.aiText(Pattove.motionUI.index.get('aurora'))));
      check(engineName + ' Next.js 전체 파일·환경·성능·접근성 포함', pack.target === 'Next.js' && pack.files.length === 3 && pack.files[0].content.startsWith("'use client'") && pack.files.some(f => f.path === 'motion-effect.css' && f.content.includes('@media (prefers-reduced-motion: reduce)')) && pack.browserSupport && pack.rendering.measured === false && pack.reducedMotion.included);
      if (engineName === 'chromium') {
        await page.locator('[data-motion-copy]').click();
        await page.waitForFunction(() => document.querySelector('.motion-delivery .motion-copy-status').textContent.includes('복사됨'));
        const clipboard = parse(await page.evaluate(() => navigator.clipboard.readText()));
        check('실제 클립보드가 선택한 Next.js AI 패키지와 동일', JSON.stringify(clipboard) === JSON.stringify(pack));
        await page.locator('[data-motion-code-copy]').click();
        await page.waitForFunction(() => document.querySelector('.motion-delivery .motion-copy-status').textContent.includes('코드 복사됨'));
        const code = await page.evaluate(() => navigator.clipboard.readText());
        check('코드 복사 한 번에 JSX와 그것이 부르는 CSS·페이지 파일이 함께 담김', ['// MotionEffect.jsx', "import './motion-effect.css'", '/* motion-effect.css */', '// app/page.jsx', '@keyframes pm-aurora-drift'].every(part => code.includes(part)));
        exported = await page.evaluate(() => Pattove.motionData.items.map(item => ({id:item.id, html:Pattove.motionUI.documentHTML(item), next:Pattove.motionUI.files(item,'next'), react:Pattove.motionUI.files(item,'react')})));
      }
      await page.locator('[data-motion-reduce]').click();
      await page.locator('[data-motion-frame]').scrollIntoViewIfNeeded();
      await page.frameLocator('[data-motion-frame]').locator('html[data-reduced]').waitFor();
      check(engineName + ' 강제 reduced-motion이 실제 애니메이션 제거', true);
      await page.locator('[data-motion-reduce]').click();
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.waitForFunction(() => document.querySelector('[data-motion-reduce]').disabled);
      check(engineName + ' OS 움직임 줄이기 우선', await page.locator('[data-motion-reduce]').getAttribute('aria-pressed') === 'true');
      // Check browser-reduced CSS inside exported markup, not only the gallery preview overlay.
      for (const id of ['fade-up','stagger','aurora','glitch','scroll-reveal','orbit','skeleton','pulse','carousel']) {
        await goto('?detail=' + id);
        await framesReady(page);
        const reduced = await page.frameLocator('[data-motion-frame]').locator('html').evaluate(html => {
          const d = html.ownerDocument, win = d.defaultView;
          return [...d.querySelectorAll('.pm-demo *')].every(n => ['','::before','::after'].every(pseudo => win.getComputedStyle(n,pseudo || null).animationName === 'none'));
        });
        check(engineName + ' ' + id + ' OS 설정에서 모션 제거', reduced);
      }
      await goto('?detail=carousel'); await framesReady(page);
      const carousel = page.frameLocator('[data-motion-frame]');
      await carousel.locator('input[type="radio"]').first().focus();
      await page.keyboard.press('ArrowRight');
      check(engineName + ' 캐러셀 방향키·정적 대체 카드', await carousel.locator('input[type="radio"]').nth(1).isChecked() && await carousel.locator('.pm-slide').nth(1).evaluate(n => getComputedStyle(n).visibility === 'visible' && getComputedStyle(n).transform === 'none'));
      await goto('?detail=flip'); await framesReady(page);
      const flip = page.frameLocator('[data-motion-frame]');
      await flip.locator('.pm-flip-toggle').check();
      check(engineName + ' reduced-motion에서도 앞뒷면 선택 유지', await flip.locator('.pm-flip-back').isVisible() && !await flip.locator('.pm-flip-front').isVisible());
      await goto('?detail=scroll-reveal'); await framesReady(page);
      await page.frameLocator('[data-motion-frame]').locator('.pm-scroll').evaluate(n => { n.scrollTop = 170; });
      check(engineName + ' reduced-motion 스크롤 콘텐츠 가시성', await page.frameLocator('[data-motion-frame]').locator('.pm-reveal').evaluate(n => getComputedStyle(n).opacity === '1' && getComputedStyle(n).transform === 'none'));
      await page.emulateMedia({reducedMotion:'no-preference'});
      await goto('?detail=aurora'); await framesReady(page);
      await page.locator('[data-motion-frame]').scrollIntoViewIfNeeded();
      await page.frameLocator('[data-motion-frame]').locator('html:not([data-paused])').waitFor();
      await page.frameLocator('[data-motion-frame]').locator('.pm-pause').check();
      check(engineName + ' 내보낼 코드 자체의 일시정지', await page.frameLocator('[data-motion-frame]').locator('.pm-aurora-orb').first().evaluate(n => getComputedStyle(n).animationPlayState === 'paused'));
      // Clipboard failure must preserve full content and return focus after Escape.
      await page.evaluate(() => Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied');}}}));
      await page.locator('[data-motion-copy]').click();
      await page.locator('#reference-dialog').waitFor({state:'visible'});
      check(engineName + ' 복사 거부 시 전체 선택된 수동 복사', await page.locator('#reference-dialog textarea').evaluate(n => n.selectionStart === 0 && n.selectionEnd === n.value.length && n.value.includes('reducedMotion')));
      await page.keyboard.press('Escape');
      // The dialog's close event arrives a moment after Escape (later in WebKit); wait for it before checking.
      await page.waitForFunction(el=>el===document.activeElement,await page.locator('[data-motion-copy]').elementHandle(),{timeout:3000}).catch(()=>{});
      check(engineName + ' 수동 복사 닫기 후 초점 복귀', await page.locator('[data-motion-copy]').evaluate(n => n === document.activeElement));
      await goto('?sources=1');
      check(engineName + ' 공식 출처가 있는 외부 레퍼런스 8개', await page.locator('.motion-source').count() === 8 && await page.locator('.motion-source a[target="_blank"]').count() === 16);
      await page.evaluate(() => Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied');}}}));
      await page.locator('[data-motion-source="react-bits"]').click();
      await page.locator('#reference-dialog').waitFor({state:'visible'});
      check(engineName + ' 외부 레퍼런스는 코드 미포함을 명시', parse(await page.locator('#reference-dialog textarea').inputValue()).codeIncluded === false);
      await page.keyboard.press('Escape');
      for (const width of [320,390,1440]) {
        await page.setViewportSize({width,height:1000});
        for (const route of ['', '?detail=carousel', '?sources=1']) {
          await goto(route);
          check(engineName + ' ' + width + ' ' + route + ' 가로 넘침 없음', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        }
        if (engineName === 'chromium' && width !== 320) {
          await goto('?detail=aurora'); await framesReady(page);
          await page.screenshot({path:path.join(out,'detail-' + width + '.png'),fullPage:true});
        }
      }
      await exercise(async id => { await goto('?detail='+id); await framesReady(page); return page.frameLocator('[data-motion-frame]').locator('.pm-demo'); }, engineName+' preview', check, page);
      check(engineName + ' 모션의 모든 사전 참조가 실제 항목으로 연결', await page.evaluate(() => {
        const ids = new Set(Pattove.library.entries.map(entry => entry.id));
        return Pattove.motionData.items.every(item => item.dictionaryRefs?.length && item.dictionaryRefs.every(id => ids.has(id)));
      }));
      await goto('?detail=motion-path');
      await page.locator('.motion-related a').click();
      await page.locator('dialog[open] .motion-related-record').waitFor();
      check(engineName + ' 사전 AI 정보에 실행 예제 주소 포함', await page.evaluate(() => Pattove.references.payload('ANM-43').motionExamples.some(example => example.id === 'motion/motion-path')));
      await page.locator('.motion-related-record a[href="#/motion?detail=motion-path"]').click();
      await page.locator('[data-motion-detail="motion-path"]').waitFor();
      check(engineName + ' 사전과 실행 예제 왕복', true);
      // Existing AI IDs can resolve a motion reference too.
      check(engineName + ' 기존 ID 복사 경로와 연동', await page.evaluate(() => Pattove.references.payload('motion/aurora').url.includes('#/motion?detail=aurora')));
      await page.goto(pathToFileURL(path.join(root,'index.html')).href + '#/motion?detail=orbit');
      await page.locator('[data-motion-detail="orbit"]').waitFor();
      check(engineName + ' file://에서도 패키지 생성', parse(await page.evaluate(() => Pattove.motionUI.aiText(Pattove.motionUI.index.get('orbit')))).files.length > 0);
    } finally { await browser.close(); }
  }
  // Use the exact exported files in an independent consumer, with no extra runtime dependencies.
  const fixture = fs.mkdtempSync(path.join(out,'consumer-'));
  for (const item of exported) {
    write(path.join(out,item.id + '.html'),item.html);
    for (const env of ['next','react']) for (const file of item[env]) if (file.path !== 'app/page.jsx') write(path.join(fixture,env,item.id,file.path),file.content);
  }
  write(path.join(fixture,'package.json'),JSON.stringify({name:'pattove-motion-consumer',private:true}));
  write(path.join(fixture,'next.config.mjs'),"export default {devIndicators:false,allowedDevOrigins:['127.0.0.1']};");
  write(path.join(fixture,'app/layout.jsx'),"export default function Layout({children}) { return <html lang='ko'><body>{children}</body></html>; }");
  for (const env of ['next','react']) {
    const imports = exported.map((item,i) => `import Effect${i} from '${env === 'react' ? '../..' : '..'}/${env}/${item.id}/MotionEffect';`).join('\n');
    const content = exported.map((item,i) => `<section data-effect="${item.id}"><Effect${i}/></section>`).join('');
    const carousel = exported.findIndex(item => item.id === 'carousel');
    write(path.join(fixture,env === 'next' ? 'app/page.jsx' : 'app/react/page.jsx'), (env === 'react' ? "'use client';\n" : '') + imports + `\nexport default function Page(){return <main>${content}<section data-effect="carousel-copy"><Effect${carousel}/></section></main>;}`);
  }
  const logs = [];
  const server = spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'dev','--webpack','--hostname','127.0.0.1','--port','4187'],{cwd:fixture,stdio:['ignore','pipe','pipe'],windowsHide:true});
  server.stdout.on('data',data => logs.push(String(data))); server.stderr.on('data',data => logs.push(String(data)));
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1100,height:1000}});
    page.on('pageerror',e => errors.push('consumer: ' + e.message));
    page.on('console',msg => { if (msg.type() === 'error') errors.push('consumer console: ' + msg.text()); });
    let ready = false;
    for (let i=0;i<80;i++) {
      try { const response = await fetch('http://127.0.0.1:4187'); if (response.ok) { ready=true; break; } } catch {}
      await new Promise(r=>setTimeout(r,250));
    }
    assert.ok(ready, logs.join('\n'));
    for (const route of ['/','/react']) {
      await page.goto('http://127.0.0.1:4187' + route);
      await page.locator('[data-effect="carousel-copy"] input').first().waitFor();
      check(route + ' 전체 내보낸 컴포넌트 렌더링', await page.locator('.pm-demo').count() === 35);
      check(route + ' 복수 인스턴스 ID 고유', await page.locator('[id]').evaluateAll(nodes => new Set(nodes.map(n=>n.id)).size === nodes.length));
      const first = page.locator('[data-effect="carousel"] input[type="radio"]');
      const second = page.locator('[data-effect="carousel-copy"] input[type="radio"]');
      await first.nth(1).check();
      check(route + ' 캐러셀 복수 인스턴스 독립', await first.nth(1).isChecked() && await second.first().isChecked());
      await page.locator('.pm-flip-toggle').check();
      check(route + ' 카드 뒤집기', await page.locator('.pm-flip-back').isVisible());
      await page.emulateMedia({reducedMotion:'reduce'});
      check(route + ' 소비 앱의 OS reduced-motion', await page.locator('.pm-demo').evaluateAll(nodes => nodes.every(node => [...node.querySelectorAll('*')].every(n => getComputedStyle(n).animationName === 'none'))));
      await page.emulateMedia({reducedMotion:'no-preference'});
      await exercise(async id => page.locator('[data-effect="'+id+'"] .pm-demo'), route+' exported', check, page);
    }
    await page.route('http**',route => route.abort());
    await page.goto(pathToFileURL(path.join(out,'aurora.html')).href);
    await page.locator('.pm-pause').check();
    check('내보낸 단독 HTML 네트워크 없이 실행·일시정지', await page.locator('.pm-aurora-orb').first().evaluate(n => getComputedStyle(n).animationPlayState === 'paused'));
    await exercise(async id => {
      await page.goto(pathToFileURL(path.join(out,id + '.html')).href);
      return page.locator('.pm-demo');
    }, 'offline HTML', check, page);
    check('브라우저·React hydration 오류 없음', errors.length === 0);
  } finally { await browser.close(); server.kill(); write(path.join(out,'consumer.log'),logs.join('')); }
  write(path.join(out,'results.json'),JSON.stringify({checks,errors},null,2));
  console.log(checks.length + ' motion checks passed.');
})().catch(error => { console.error(error); if (errors.length) console.error(errors); process.exitCode=1; });
