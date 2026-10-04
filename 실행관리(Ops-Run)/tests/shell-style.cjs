const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const origin=process.env.PATTOVE_TEST_URL||'http://127.0.0.1:4173/';
const out=path.resolve(__dirname,'../test-results/shell-style');
fs.mkdirSync(out,{recursive:true});
const checks=[],errors=[];
const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
(async()=>{
  const browser=await chromium.launch({headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
    page.on('pageerror',e=>errors.push(e.message));
    const goto=async route=>{await page.goto(origin+'#/'+route);await page.evaluate(()=>document.fonts.ready);await page.mouse.move(0,0);};
    await goto('styles?detail=main');
    check('검색은 이름과 조작 영역을 갖춘 보조 동작',await page.locator('#search-open').evaluate(n=>{
      const s=getComputedStyle(n),r=n.getBoundingClientRect();return !!n.getAttribute('aria-label')&&r.width>=44&&r.height>=44&&s.boxShadow==='none';
    }));
    check('현재 주 메뉴는 밑줄로 표시',await page.locator('#primary-nav [aria-current]').evaluate(n=>getComputedStyle(n).backgroundColor==='rgba(0, 0, 0, 0)'&&parseFloat(getComputedStyle(n,'::after').height)>0));
    check('하위 메뉴 현재 위치도 별도 표시',await page.locator('#secondary-nav [aria-current]').evaluate(n=>getComputedStyle(n).boxShadow.includes('inset')));
    check('복사 동작은 공유 버튼 부품 사용',await page.locator('.reference-copy.ds-button').count()>0);
    const changed=await page.evaluate(()=>{
      const style=document.body.style;style.setProperty('--p-radius-md','13px');style.setProperty('--p-control-size-sm','52px');style.setProperty('--p-accent','rgb(83, 45, 99)');
      const button=document.querySelector('#search-open'),s=getComputedStyle(button),r=button.getBoundingClientRect();
      const current=getComputedStyle(document.querySelector('#primary-nav [aria-current]'),'::after');
      return {radius:s.borderRadius,width:r.width,height:r.height,accent:current.backgroundColor};
    });
    assert.deepEqual(changed,{radius:'13px',width:52,height:52,accent:'rgb(83, 45, 99)'});checks.push('상단 크기·모서리·현재 표시가 공유 토큰 변경을 따름');
    await page.evaluate(()=>['--p-radius-md','--p-control-size-sm','--p-accent'].forEach(n=>document.body.style.removeProperty(n)));
    await page.keyboard.press('Tab');await page.locator('.reference-copy').first().focus();
    check('복사 키보드 초점 표시',await page.locator('.reference-copy').first().evaluate(n=>{const s=getComputedStyle(n);return s.outlineStyle!=='none'&&parseFloat(s.outlineWidth)>0;}));
    await page.locator('#search-open').click();
    check('검색창은 공유 입력 사용',await page.locator('#search-form.ds-input-group > #query.ds-input').count()===1);
    await page.keyboard.press('Escape');
    await goto('dictionary?shelf=icon');
    check('이동 버튼과 쪽 번호 입력은 공유 부품 사용',await page.locator('.page-step.ds-button').count()>0&&await page.locator('.page-jump input.ds-input').count()===1);
    check('첫 쪽 이전 버튼은 비활성',await page.locator('.page-step[aria-label="이전"]').isDisabled());
    await goto('patterns');
    check('패턴은 공유 부품으로 구성',await page.locator('.pattern-card .preview[inert] .sample :is(.ds-button,.ds-tabs,.ds-field,.ds-surface,.ds-toast,.ds-search-bar)').count()>=12);
    check('조합의 ID 중복 없음',await page.locator('[id]').evaluateAll(ns=>new Set(ns.map(n=>n.id)).size===ns.length));
    for(const width of [320,375,768,1440]){
      await page.setViewportSize({width,height:1000});
      for(const route of ['styles?detail=main','dictionary?shelf=icon','dictionary?shelf=part','system?detail=button','system?detail=data-table','patterns']){
        await goto(route);check(width+' '+route+' 가로 넘침 없음',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      }
      if([375,1440].includes(width))await page.screenshot({path:path.join(out,'after-'+width+'.png')});
    }
    assert.deepEqual(errors,[]);
    fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks,errors},null,2));
    console.log(checks.length+' shell-style checks passed.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
