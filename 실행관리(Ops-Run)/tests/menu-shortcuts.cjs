const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const base=process.env.PATTOVE_TEST_URL||'http://127.0.0.1:4173/';
(async()=>{
  const browser=await chromium.launch();
  try{
    const context=await browser.newContext({viewport:{width:1440,height:900}});
    const page=await context.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base);await page.waitForSelector('#content');
    assert.ok(page.url().endsWith('#/styles'),'처음 열면 스타일 카드 격자');

    // 견본이 하나뿐인 토큰 분류는 카드 한 장짜리 목록을 거치지 않고 상세로 바로 간다.
    await page.goto(base+'#/dictionary?shelf=token');await page.waitForSelector('#app-menu .nav-subcategory');
    const color=page.locator('#app-menu .nav-subcategory',{hasText:'색'}).first();
    assert.equal(await color.getAttribute('href'),'#/system?detail=token-color');
    await color.click();await page.waitForURL(/detail=token-color/);
    assert.equal(await page.locator('#app-menu .nav-subcategory[aria-current]').innerText(),'색','상세에서도 고른 분류가 표시됨');
    await page.goBack();await page.waitForURL(/shelf=token$/);

    // 다시 켜면 마지막으로 보던 목록 화면을 연다. 상세 화면은 남기지 않는다.
    await page.goto(base+'#/dictionary?shelf=icon');await page.waitForSelector('#content');
    await page.goto(base+'#/system?detail=button');await page.waitForSelector('#detail-title');
    const again=await context.newPage();await again.goto(base);await again.waitForSelector('#content');
    assert.ok(again.url().endsWith('#/dictionary?shelf=icon'),'마지막 목록 화면 복원: '+again.url());
    assert.deepEqual(errors,[]);
    console.log('menu shortcuts: 6 checks passed');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
