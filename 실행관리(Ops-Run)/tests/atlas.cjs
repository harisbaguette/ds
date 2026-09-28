const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium,firefox,webkit}=require('playwright-core');
const out=path.resolve(__dirname,'../test-results/atlas');fs.mkdirSync(out,{recursive:true});
const checks=[],errors=[];const check=(name,result)=>{assert.ok(result,name);checks.push(name);};
(async()=>{
  for(const [name,engine] of Object.entries({chromium,firefox,webkit})){
    const browser=await engine.launch({headless:true});
    try{
      const page=await browser.newPage({viewport:{width:1440,height:1080}});page.setDefaultTimeout(8000);page.on('pageerror',e=>errors.push(e.message));
      await page.goto('http://127.0.0.1:4173/#/system');await page.evaluate(()=>document.fonts.ready);
      check(name+' 시작 화면은 첫 부품 한 장',await page.locator('.component-page[data-component="tokens"]').count()===1&&await page.locator('.specimen').count()===0);
      check(name+' 옆 메뉴 부품 목록에서 부품 고르기',await page.locator('#filter-bar .part-list a[href="#/system?detail=button"]').count()===1);
      await page.locator('#filter-bar .part-list a[href="#/system?detail=button"]').click();
      check(name+' 고른 부품이 메뉴에 지금 부품으로 표시',await page.locator('#filter-bar a[aria-current="page"][href="#/system?detail=button"]').count()===1);
      await page.locator('.brand').click();
      check(name+' 사전 첫 화면은 부품 탭 격자, 탭은 부품·블록·템플릿·아이콘',await page.locator('[data-focus="tab-part"][aria-current="page"]').count()===1&&await page.locator('[data-focus^="tab-"]').count()===await page.evaluate(()=>Pattove.library.shelves.length)&&await page.locator('.dict-entry').count()>0);
      check(name+' 목록과 상세의 디자인 토큰 그림이 같음',await page.locator('.atlas-sample[data-kind="tokens"] .ds-token-swatches i').count()===4);
      const code=page.locator('#filter-bar details[data-section="code"]');if(!await code.evaluate(d=>d.open))await code.locator('summary').click();
      await page.locator('#filter-bar .filter-option[data-filter="code:INP"]').click();check(name+' 탭→세부 분류 칸→항목으로 탐색',await page.locator('.dict-entry.is-built').count()>=1);
      await page.locator('[data-library-entry="field"]').click();check(name+' 사전에서 부품 그림으로 연결, 설치 칸 없음',await page.locator('.component-page .part-demo input').count()>=1&&await page.locator('.install-panel,[data-system-download]').count()===0);
      await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog').open);
      await page.locator('.brand').click();await page.locator('#query').fill('TOK-01');await page.locator('#query').press('Enter');
      check(name+' 원문 ID로 같은 구현 조회',await page.locator('[data-library-entry="tokens"]').count()===1);
      for(const width of [320,375,768,1440]){
        await page.setViewportSize({width,height:1080});
        for(const route of ['styles','system','dictionary','dictionary?detail=field','system?style=main&detail=page']){
          await page.goto('http://127.0.0.1:4173/#/'+route);
          check(`${name} ${width} ${route} 넘침 없음`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1&&(!document.querySelector('dialog[open]')||document.querySelector('dialog').scrollWidth<=document.querySelector('dialog').clientWidth+1)));
        }
      }
      await page.setViewportSize({width:1440,height:1080});await page.goto('http://127.0.0.1:4173/#/system');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(out,name+'-system.png')});
      await page.goto('http://127.0.0.1:4173/#/dictionary');await page.screenshot({path:path.join(out,name+'-dictionary.png')});
      await page.setViewportSize({width:375,height:900});await page.screenshot({path:path.join(out,name+'-mobile.png')});
    }finally{await browser.close();}
  }
  check('브라우저 실행 예외 없음',errors.length===0);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks,errors},null,2));console.log(`${checks.length} atlas checks passed.`);
})().catch(e=>{console.error(e);process.exitCode=1;});
