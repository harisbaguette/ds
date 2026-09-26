const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium,firefox,webkit}=require('playwright-core');
const {unzipSync,strFromU8}=require('fflate');
const out=path.resolve(__dirname,'../test-results/atlas');fs.mkdirSync(out,{recursive:true});
const checks=[],errors=[];const check=(name,result)=>{assert.ok(result,name);checks.push(name);};
(async()=>{
  for(const [name,engine] of Object.entries({chromium,firefox,webkit})){
    const browser=await engine.launch({headless:true});
    try{
      const page=await browser.newPage({viewport:{width:1440,height:1080},acceptDownloads:true});page.setDefaultTimeout(8000);page.on('pageerror',e=>errors.push(e.message));
      await page.goto('http://127.0.0.1:4173/#/styles');await page.evaluate(()=>document.fonts.ready);
      check(name+' 시작 화면에 부품·상태 시트',await page.locator('.specimen').count()===18&&await page.locator('.button-matrix tbody tr').count()===6);
      check(name+' 옆 열에 부품별 바로가기',await page.locator('#sidebar a[href="#/system?style=main&detail=button"]').count()===1);
      await page.locator('[data-system-detail="button"]').click();
      await page.locator('[data-doc-environment]').selectOption('react');
      await page.waitForFunction(()=>document.querySelector('[data-install-source]')?.textContent.includes('export default'));
      check(name+' React 설치 명령과 실제 JSX', (await page.locator('[data-install-command]').textContent()).includes('pattove-main-button-react.json')&&(await page.locator('[data-install-source]').textContent()).includes('<Button'));
      const download=page.waitForEvent('download');await page.locator('[data-install-zip]').click();const zip=await download;const file=path.join(out,name+'-button-react.zip');await zip.saveAs(file);const files=unzipSync(fs.readFileSync(file));
      check(name+' 다운로드에 수정 가능한 부품·스타일·예시·글꼴 포함',['design/react/button.jsx','design/css/button.css','design/styles/main.css','design/examples/main/button.jsx','design/fonts.css'].every(f=>!!files[f]));
      check(name+' 버튼 하나에 관련 없는 검색 모듈을 배포하지 않음',!Object.keys(files).some(f=>f.includes('search-module')||f.includes('page.jsx')));
      const source=fs.readFileSync(path.resolve(__dirname,'../src/system/react/button.jsx'),'utf8');check(name+' 내려받은 React 부품이 정본과 일치',strFromU8(files['design/react/button.jsx'])===source);
      await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog').open);
      await page.locator('.brand').click();
      check(name+' 사전 첫 화면은 대분류 8개 그림 입구',await page.locator('.dict-group').count()===await page.evaluate(()=>Pattove.library.groups.length));
      const inputGroup=await page.evaluate(()=>Pattove.library.groups.find(g=>g.codes.includes('INP')).id);await page.locator('[data-focus="group-'+inputGroup+'"]').click();await page.locator('[data-focus="leaf-INP"]').click();check(name+' 대분류→중분류→소분류로 탐색',await page.locator('.dict-entry.is-built').count()>=1);
      await page.locator('[data-library-entry="field"]').click();check(name+' 사전에서 시각 예시와 소스로 연결',await page.locator('.component-page .part-demo input').count()>=1&&await page.locator('.install-panel').count()===1);
      await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog').open);
      await page.locator('.brand').click();await page.locator('#query').fill('TOK-01');await page.locator('#query').press('Enter');
      check(name+' 원문 ID로 같은 구현 조회',await page.locator('[data-library-entry="tokens"]').count()===1);
      for(const width of [320,375,768,1440]){
        await page.setViewportSize({width,height:1080});
        for(const route of ['styles','dictionary','dictionary?detail=field','system?style=main&detail=page']){
          await page.goto('http://127.0.0.1:4173/#/'+route);
          check(`${name} ${width} ${route} 넘침 없음`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1&&(!document.querySelector('dialog[open]')||document.querySelector('dialog').scrollWidth<=document.querySelector('dialog').clientWidth+1)));
        }
      }
      await page.setViewportSize({width:1440,height:1080});await page.goto('http://127.0.0.1:4173/#/styles');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(out,name+'-system.png')});
      await page.goto('http://127.0.0.1:4173/#/dictionary');await page.screenshot({path:path.join(out,name+'-dictionary.png')});
      await page.setViewportSize({width:375,height:900});await page.screenshot({path:path.join(out,name+'-mobile.png')});
    }finally{await browser.close();}
  }
  check('브라우저 실행 예외 없음',errors.length===0);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks,errors},null,2));console.log(`${checks.length} atlas checks passed.`);
})().catch(e=>{console.error(e);process.exitCode=1;});
