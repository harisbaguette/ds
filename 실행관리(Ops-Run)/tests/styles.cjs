const { chromium } = require('playwright-core');
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const root=path.resolve(__dirname,'..'), out=path.join(root,'test-results/main-style');fs.mkdirSync(out,{recursive:true});
const retired=['ikdeor','soft','ink','routine','block','sticker','garden','landscape','night'];
const origin='http://127.0.0.1:4173';
const checks=[],errors=[];const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  const context=await browser.newContext({viewport:{width:1440,height:1080}});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(8000);
  await page.goto(origin+'#/styles');await page.evaluate(()=>document.fonts.ready);
  check('메인 스타일 하나만 등록',await page.evaluate(()=>Pattove.catalog.styles.length===1&&Pattove.catalog.styles[0].id==='main'));
  check('이전 스타일 선택 UI 제거',await page.locator('.style-picker,#style-switch,#style-menu,.style-cover').count()===0);
  check('시작 화면은 첫 부품 한 장, 전체 보드 없음',page.url().includes('detail=tokens')&&await page.locator('.component-page').count()===1&&await page.locator('.specimen,.system-board').count()===0);
  const registry=JSON.parse(fs.readFileSync(path.join(root,'src/registry/registry.json'),'utf8'));
  check('배포 목록은 메인과 공용 아이콘·글꼴뿐',registry.items.every(i=>!i.meta.style||i.meta.style==='main'));
  for(const style of retired){
   check(style+' 생성 파일 제거',!fs.readdirSync(path.join(root,'src/registry/r')).some(f=>f.startsWith('pattove-'+style+'-')));
   check(style+' 이전 설치 URL 제거',(await fetch(origin+'/src/registry/r/pattove-'+style+'-button-html.json')).status===404);
   await page.goto(origin+'/#/system?style='+style+'&category=buttons');
   await page.waitForURL('**/#/system?style=main&detail=tokens');
   check(style+' 이전 주소는 메인으로 이동',page.url().includes('style=main')&&await page.locator('.component-page').count()===1);
  }
  check('이전 스타일 표지 소스 제거',!fs.existsSync(path.join(root,'src/ui/style-covers.js'))&&!fs.existsSync(path.join(root,'src/styles/style-covers.css')));
  const css=fs.readFileSync(path.join(root,'src/system/parts.css'),'utf8')+fs.readFileSync(path.join(root,'src/styles/themes.css'),'utf8');
  check('배포 CSS에 이전 스타일 분기 없음',retired.every(s=>!css.includes('theme-'+s)&&!css.includes('data-style="'+s+'"')));
  await page.goto(origin+'/#/system?style=main&detail=button');
  const contrast=await page.evaluate(()=>{
   const source=document.querySelector('.part-demo .ds'),s=getComputedStyle(source);
   const rgb=value=>{const canvas=document.createElement('canvas'),c=canvas.getContext('2d');c.fillStyle=value.trim();c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data].slice(0,3);};
   const luminance=c=>c.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((v,x,i)=>v+x*[.2126,.7152,.0722][i],0);
   const ratio=(a,b)=>{const x=luminance(rgb(a)),y=luminance(rgb(b));return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
   const token=n=>s.getPropertyValue('--ds-'+n);
   return {text:ratio(token('text'),token('bg')),muted:ratio(token('muted'),token('bg')),primary:ratio(token('on-accent'),token('accent')),inputBoundary:ratio(token('control-border'),token('bg')),focus:ratio(token('focus'),token('bg')),success:ratio(token('success'),token('surface')),error:ratio(token('error'),token('surface'))};
  });
  for(const name of ['text','muted','primary','success','error'])check(name+' 글자 대비 4.5:1 이상',contrast[name]>=4.5);
  for(const name of ['inputBoundary','focus'])check(name+' 조작 경계 대비 3:1 이상',contrast[name]>=3);
  fs.writeFileSync(path.join(out,'contrast.json'),JSON.stringify(contrast,null,2));
  check('외곽과 부품이 같은 바탕 토큰 사용',await page.evaluate(()=>getComputedStyle(document.body).getPropertyValue('--p-bg').trim()===getComputedStyle(document.querySelector('.part-demo .ds')).getPropertyValue('--ds-bg').trim()));
  check('비활성 버튼의 그림자 제거',await page.locator('.component-page [data-state="disabled"]').evaluateAll(ns=>ns.length>0&&ns.every(n=>getComputedStyle(n).boxShadow==='none'&&n.disabled)));
  const stateButton=async s=>{await page.goto(origin+'/#/system?style=main&detail=button&option-state='+s);return page.locator('.part-demo [data-state="'+s+'"]').first();};
  check('누름과 키보드 초점은 다른 상태',await (await stateButton('pressed')).evaluate(n=>getComputedStyle(n).boxShadow.includes('inset'))&&await (await stateButton('focus')).evaluate(n=>getComputedStyle(n).outlineStyle==='solid'&&getComputedStyle(n).outlineWidth==='3px'));
  await page.goto(origin+'/#/system?style=main&detail=checkbox');const choice=page.locator('.component-page input[type=checkbox]:not(:checked):not(:disabled)').first();await choice.check();
  check('선택은 실제 값과 체크 기호로 표시',await choice.isChecked()&&await choice.evaluate(n=>getComputedStyle(n,'::after').content==='""'));
  await page.emulateMedia({forcedColors:'active'});
  check('고대비 환경에서 네이티브 체크 표현 복구',await choice.evaluate(n=>getComputedStyle(n).appearance==='auto'));
  await page.emulateMedia({forcedColors:'none',reducedMotion:'reduce'});
  await page.goto(origin+'/#/system?style=main&detail=button');
  check('움직임 감소 설정에서 로딩 회전 정지',await page.locator('.ds-spinner').first().evaluate(n=>getComputedStyle(n).animationName==='none'));
  await page.emulateMedia({reducedMotion:'no-preference'});
  for(const width of [320,375,768,1101,1440,1920]) {
   await page.setViewportSize({width,height:1080});
   for(const route of ['styles','dictionary','system?style=main&detail=page','system?style=main&detail=button']) {
    await page.goto(origin+'/#/'+route);
    check(width+' '+route+' 가로 넘침 없음',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    check(width+' '+route+' 중복 ID 없음',await page.locator('[id]').evaluateAll(ns=>ns.length===new Set(ns.map(n=>n.id)).size));
   }
  }
  await page.setViewportSize({width:1440,height:1080});await page.goto(origin+'/#/system?style=main');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(out,'desktop.png')});
  await page.goto(origin+'/#/system?style=main&detail=page');await page.screenshot({path:path.join(out,'page.png'),fullPage:true});
  await page.goto(origin+'/#/dictionary');await page.screenshot({path:path.join(out,'dictionary.png')});
  await page.setViewportSize({width:375,height:900});await page.goto(origin+'/#/system?style=main&detail=checkbox');await page.screenshot({path:path.join(out,'mobile.png'),fullPage:true});
  check('실행 예외 없음',errors.length===0);
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks,errors,contrast},null,2));console.log(checks.length+' main-style checks passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
