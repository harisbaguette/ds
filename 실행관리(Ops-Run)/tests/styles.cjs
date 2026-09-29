const { chromium } = require('playwright-core');
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const root=path.resolve(__dirname,'..'), out=path.join(root,'test-results/main-style');fs.mkdirSync(out,{recursive:true});
const retired=['ikdeor','soft','ink','routine','block','sticker','garden','landscape','night'];
const origin='http://127.0.0.1:4173';
// The part page shows still pictures only, so a part's own behaviour is pressed on a stage built from the same renderer.
const stage = async (page, id, options = {}) => {
  await page.evaluate(([id, options]) => {
    document.querySelector('#test-stage')?.remove();
    const node = document.createElement('div');
    node.id = 'test-stage'; node.className = 'part-demo ds theme-main'; node.dataset.style = 'main';
    node.innerHTML = Pattove.parts.renderItem(id, 'stage', Pattove.systemRegistry.normalizeOptions(id, options));
    document.querySelector('main').append(node);
    Pattove.mountParts(document);
  }, [id, options]);
  return page.locator('#test-stage');
};
const checks=[],errors=[];const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  const context=await browser.newContext({viewport:{width:1440,height:1080}});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(8000);
  await page.goto(origin+'#/styles?detail=main');await page.evaluate(()=>document.fonts.ready);
  check('메인 스타일 하나만 등록',await page.evaluate(()=>Pattove.catalog.styles.length===1&&Pattove.catalog.styles[0].id==='main'));
  check('이전 스타일 선택 UI 제거',await page.locator('.style-picker,#style-switch,#style-menu,.style-cover').count()===0);
  check('스타일 화면은 실제 부품과 완성 화면 미리보기',await page.locator('.style-overview .overview-tile').count()===7&&await page.locator('.style-overview .variant-phone .ds-page').count()===1&&await page.locator('.component-page,.style-choose').count()===0);
  { // Switching: a second style (added only in this test page) can be opened, applied, and stays applied across tabs and reloads.
    const ctx=await browser.newContext({viewport:{width:1440,height:1080}});
    await ctx.addInitScript(()=>{const freeze=Object.freeze;Object.freeze=o=>{if(o&&Array.isArray(o.styles)&&Array.isArray(o.patterns)&&!o.styles.some(s=>s.id==='alt'))o.styles.push({id:'alt',name:'시험 스타일',description:'전환 시험',rules:'시험',references:[],constraints:[]});return freeze(o);};});
    const sp=await ctx.newPage();sp.on('pageerror',e=>errors.push(e.message));
    await sp.goto(origin+'#/styles');
    check('스타일 격자는 스타일마다 카드 한 장',await sp.locator('.style-card').count()===2&&await sp.locator('[data-style-card="main"] .variant-kept').count()===1);
    await sp.locator('[data-style-card="alt"] .dict-hit').click();
    check('사용 중이 아닌 스타일 화면에는 적용 단추',sp.url().endsWith('#/styles?detail=alt')&&await sp.locator('[data-style-select="alt"]').isVisible()&&await sp.locator('.style-page .overview-preview.theme-alt').count()===7);
    await sp.locator('[data-style-select="alt"]').click();
    check('적용하면 사이트 전체가 그 스타일로 바뀌고 단추는 사용 중 표시로',await sp.evaluate(()=>document.body.classList.contains('theme-alt'))&&await sp.locator('[data-style-select]').count()===0&&await sp.locator('.style-heading .variant-kept').isVisible());
    await sp.goto(origin+'#/dictionary?shelf=part');await sp.reload();
    check('적용한 스타일은 다른 탭과 다시 열기에서도 유지',await sp.evaluate(()=>document.body.classList.contains('theme-alt')));
    await sp.goto(origin+'#/styles');
    check('격자의 사용 중 표시도 옮겨 감',await sp.locator('[data-style-card="alt"] .variant-kept').count()===1&&await sp.locator('[data-style-card="main"] .variant-kept').count()===0);
    await ctx.close();
  }
  { // Preview: on the part, block, template and token tabs the specimens can be redrawn in another style without changing the site's style.
    check('스타일이 하나여도 미리보기 선택이 부품 탭에 있음',await (async()=>{await page.goto(origin+'#/dictionary?shelf=part');return await page.locator('.preview-style [data-preview-style]').count()===1&&await page.locator('[data-preview-style="main"][aria-pressed="true"]').count()===1;})());
    const ctx=await browser.newContext({viewport:{width:1440,height:1080}});
    await ctx.addInitScript(()=>{const freeze=Object.freeze;Object.freeze=o=>{if(o&&Array.isArray(o.styles)&&Array.isArray(o.patterns)&&!o.styles.some(s=>s.id==='alt'))o.styles.push({id:'alt',name:'시험 스타일',description:'전환 시험',rules:'시험',references:[],constraints:[]});return freeze(o);};});
    const sp=await ctx.newPage();sp.on('pageerror',e=>errors.push(e.message));
    await sp.goto(origin+'#/dictionary?shelf=part');
    await sp.addStyleTag({content:'.theme-alt{--p-accent:rgb(200,0,0)}'});
    const themes=()=>sp.evaluate(()=>[...new Set([...document.querySelectorAll('#content .ds[data-style]')].map(n=>n.dataset.style))]);
    check('처음에는 견본이 사이트 스타일로 그려짐',JSON.stringify(await themes())==='["main"]');
    await sp.locator('[data-preview-style="alt"]').click();
    check('미리보기를 바꾸면 견본만 그 스타일로, 사이트는 그대로',JSON.stringify(await themes())==='["alt"]'&&await sp.evaluate(()=>document.body.classList.contains('theme-main'))&&await sp.evaluate(()=>document.activeElement?.dataset.previewStyle==='alt')&&await sp.locator('[data-preview-style="alt"][aria-pressed="true"]').count()===1);
    check('미리보기 견본에 그 스타일의 토큰이 실제로 입혀짐',await sp.evaluate(()=>getComputedStyle(document.querySelector('#content .ds.theme-alt')).getPropertyValue('--p-accent').trim()==='rgb(200,0,0)'));
    for (const shelf of ['block','template','token']) { await sp.goto(origin+'#/dictionary?shelf='+shelf); check(shelf+' 탭에서도 미리보기 유지',JSON.stringify(await themes())==='["alt"]'); }
    await sp.goto(origin+'#/system?detail=button');
    check('부품 상세의 모양 카드도 미리보기 스타일로',JSON.stringify(await themes())==='["alt"]'&&await sp.locator('.variant-card .ds.theme-alt').count()>0);
    await sp.reload();
    check('다시 열어도 이번 방문 동안 유지',JSON.stringify(await themes())==='["alt"]');
    await sp.goto(origin+'#/dictionary?shelf=icon');
    check('아이콘 탭과 스타일 탭에는 미리보기 선택 없음',await sp.locator('.preview-style').count()===0&&await (async()=>{await sp.goto(origin+'#/styles');return await sp.locator('.preview-style').count()===0;})());
    await sp.goto(origin+'#/dictionary?shelf=part');
    await sp.locator('[data-preview-style="main"]').click();
    check('사이트 스타일을 다시 누르면 미리보기가 사이트를 따라감',JSON.stringify(await themes())==='["main"]'&&await sp.evaluate(()=>sessionStorage.getItem('pattove-preview-style'))===null);
    await ctx.close();
  }
  const registry=JSON.parse(fs.readFileSync(path.join(root,'src/registry/registry.json'),'utf8'));
  check('배포 목록은 메인과 공용 아이콘·글꼴뿐',registry.items.every(i=>!i.meta.style||i.meta.style==='main'));
  for(const style of retired){
   check(style+' 생성 파일 제거',!fs.readdirSync(path.join(root,'src/registry/r')).some(f=>f.startsWith('pattove-'+style+'-')));
   check(style+' 이전 설치 URL 제거',(await fetch(origin+'/src/registry/r/pattove-'+style+'-button-html.json')).status===404);
   await page.goto(origin+'/#/system?style='+style+'&category=buttons');
   await page.waitForURL('**/#/system?detail=token-color');
   check(style+' 이전 주소는 첫 부품으로 이동',!page.url().includes('style=')&&await page.locator('.component-page').count()===1);
  }
  check('이전 스타일 표지 소스 제거',!fs.existsSync(path.join(root,'src/ui/style-covers.js'))&&!fs.existsSync(path.join(root,'src/styles/style-covers.css')));
  const css=['src/system/parts.css','src/styles/themes.css',...['primitive','semantic'].flatMap(d=>fs.readdirSync(path.join(root,'src/tokens',d)).map(f=>'src/tokens/'+d+'/'+f))].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('');
  check('배포 CSS에 이전 스타일 분기 없음',retired.every(s=>!css.includes('theme-'+s)&&!css.includes('data-style="'+s+'"')));
  await page.goto(origin+'/#/system?style=main&detail=button');
  const contrast=await page.evaluate(()=>{
   const source=document.querySelector('.variant-card .ds'),s=getComputedStyle(source);
   const rgb=value=>{const canvas=document.createElement('canvas'),c=canvas.getContext('2d');c.fillStyle=value.trim();c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data].slice(0,3);};
   const luminance=c=>c.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((v,x,i)=>v+x*[.2126,.7152,.0722][i],0);
   const ratio=(a,b)=>{const x=luminance(rgb(a)),y=luminance(rgb(b));return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
   const token=n=>s.getPropertyValue('--p-'+n);
   return {text:ratio(token('ink'),token('bg')),muted:ratio(token('muted'),token('bg')),primary:ratio(token('on-accent'),token('accent')),inputBoundary:ratio(token('control-border'),token('bg')),focus:ratio(token('highlight'),token('bg')),success:ratio(token('success'),token('surface')),error:ratio(token('error'),token('surface'))};
  });
  for(const name of ['text','muted','primary','success','error'])check(name+' 글자 대비 4.5:1 이상',contrast[name]>=4.5);
  for(const name of ['inputBoundary','focus'])check(name+' 조작 경계 대비 3:1 이상',contrast[name]>=3);
  fs.writeFileSync(path.join(out,'contrast.json'),JSON.stringify(contrast,null,2));
  check('외곽과 부품이 같은 바탕 토큰 사용',await page.evaluate(()=>getComputedStyle(document.body).getPropertyValue('--p-bg').trim()===getComputedStyle(document.querySelector('.variant-card .ds')).getPropertyValue('--p-bg').trim()));
  // Central tokens: editing one role in src/tokens/semantic/color.css must repaint the shell and every part.
  const partIds=await page.evaluate(()=>Pattove.systemRegistry.items.map(item=>item.id));
  check('부품 목록 확보',partIds.length>=20);
  const linkage={},partBlocks=Object.fromEntries([...fs.readFileSync(path.join(root,'src/system/parts.css'),'utf8').matchAll(/\/\* @part ([\w-]+) \*\/([\s\S]*?)(?=\/\* @part |$)/g)].map(m=>[m[1],m[2]]));
  for(const id of partIds){
   await page.goto(origin+'/#/system?style=main&detail='+id);await page.locator('.component-page[data-component="'+id+'"] .ds').first().waitFor();
   linkage[id]=await page.evaluate(()=>{
    const rules=[...document.styleSheets].filter(x=>(x.href||'').includes('/src/tokens/semantic/color.css')).flatMap(x=>[...x.cssRules]).filter(r=>r.style&&r.style.getPropertyValue('--p-bg'));
    const nodes=[...document.querySelectorAll('body, body *')],read=()=>nodes.map(n=>[getComputedStyle(n).backgroundColor,getComputedStyle(n).color]);
    const before=read(),old=rules.map(r=>[r.style.getPropertyValue('--p-bg'),r.style.getPropertyValue('--p-ink')]);
    rules.forEach(r=>{r.style.setProperty('--p-bg','rgb(255, 0, 170)');r.style.setProperty('--p-ink','rgb(0, 170, 255)');});
    const after=read();
    // Other roles may share the bg primitive (e.g. on-accent = white); repaint them too so only hard-coded colors stay behind.
    const twins=rules.flatMap(r=>[...r.style].filter(k=>k.startsWith('--p-')&&k!=='--p-bg'&&r.style.getPropertyValue(k).trim()===old[0][0].trim()).map(k=>[r,k,r.style.getPropertyValue(k)]));
    twins.forEach(([r,k],i)=>r.style.setProperty(k,'rgb(1, 2, '+(3+i)+')'));
    const oldBg=before[0][0],stale=read().filter(c=>c[0]===oldBg).length;
    twins.forEach(([r,k,v])=>r.style.setProperty(k,v));rules.forEach((r,i)=>{r.style.setProperty('--p-bg',old[i][0]);r.style.setProperty('--p-ink',old[i][1]);});
    const inDemo=i=>!!nodes[i].closest('.part-demo, .variant-card .ds');
    return {rules:rules.length,shell:after[0][0]==='rgb(255, 0, 170)',
     partBg:after.filter((c,i)=>inDemo(i)&&c[0]==='rgb(255, 0, 170)').length,partInk:after.filter((c,i)=>inDemo(i)&&c[1]==='rgb(0, 170, 255)').length,stale};
   });
   const r=linkage[id];
   check(id+' 바탕·글자 역할 한 줄 수정이 외곽과 부품에 함께 반영',r.rules===1&&r.shell&&r.partBg>0&&r.partInk>0);
   check(id+' 옛 바탕색에 머문 요소 없음',r.stale===0);
   // Size roles: one line in a semantic file must reach the shell and, whenever a rule of the part's own CSS (or of a
   // part it composes) reading the role styles a rendered element, the part too; then it must revert cleanly.
   const blocks=await page.evaluate(id=>{const reg=Pattove.systemRegistry,of=k=>{const it=reg.index.get(k);return it?[...it.css,...it.deps.filter(d=>!d.startsWith('token-')).flatMap(of)]:[];};return of(id);},id);
   const own=[...new Set(blocks)].map(k=>partBlocks[k]||'').join('\n');
   r.sizes=await page.evaluate(({own,sizeRoles})=>{
    const freeze=document.createElement('style');freeze.textContent='*,*::before,*::after{transition:none!important;animation:none!important}';document.head.append(freeze);
    const live=x=>!(x instanceof CSSMediaRule)||matchMedia(x.conditionText||x.media.mediaText).matches;
    const flat=list=>[...list].filter(live).flatMap(x=>x.cssRules&&!x.style?flat(x.cssRules):[x]);
    const all=flat([...document.styleSheets].flatMap(x=>{try{return [...x.cssRules];}catch{return [];}}));
    // Rules of the part's own CSS (and the parts it composes), parsed the same way the page parses them.
    const ownSheet=new CSSStyleSheet();ownSheet.replaceSync(own);const ownSelectors=new Set(flat(ownSheet.cssRules).map(x=>x.selectorText).filter(Boolean));
    const nodes=[...document.querySelectorAll('body, body *')],side=n=>n.closest('.part-demo .ds, .variant-card .ds')?'part':n.closest('.part-demo')?null:'shell';
    const out=Object.fromEntries(sizeRoles.map(([kind,role,value])=>{
     const home=all.filter(x=>x.style&&(x.parentStyleSheet?.href||'').includes('/src/tokens/semantic/'+kind+'.css')&&x.style.getPropertyValue(role));
     const reads=new RegExp('var\\('+role+'\\s*[,)]');
     const pairs=[];
     for(const x of all.filter(x=>x.style&&x.selectorText&&!home.includes(x)))for(const [prop,v] of x.style.cssText.split(/;(?![^(]*\))/).map(d=>d.split(/:(.*)/s)))if(v&&reads.test(v))for(const sel of x.selectorText.split(/,(?![^(]*\))/)){
      const pe=sel.match(/::?(before|after|placeholder|marker)\s*$/),base=(pe?sel.slice(0,pe.index):sel).trim();if(base.includes('::'))continue;
      for(const n of nodes){let hit=false;try{hit=n.matches(base||'*');}catch{}if(hit&&side(n))pairs.push([n,pe?'::'+pe[1]:null,prop.trim(),side(n),ownSelectors.has(x.selectorText)]);}
     }
     const read=()=>pairs.map(([n,pe,p])=>getComputedStyle(n,pe).getPropertyValue(p));
     const before=read(),old=home.map(x=>x.style.getPropertyValue(role));
     home.forEach(x=>x.style.setProperty(role,value));const after=read();home.forEach((x,i)=>x.style.setProperty(role,old[i]));
     const moved=w=>pairs.filter((q,i)=>q[3]===w&&after[i]!==before[i]).length;
     return [role,{rules:home.length,shell:moved('shell'),part:moved('part'),partReads:pairs.filter(q=>q[3]==='part'&&q[4]).length,restored:read().every((v,i)=>v===before[i])}];
    }));
    freeze.remove();return out;
   },{own,sizeRoles:[['text','--p-text-md','29px'],['space','--p-space-sm','37px'],['radius','--p-control-radius','31px'],['size','--p-control-size-sm','83px']]});
   for(const [role,v] of Object.entries(r.sizes))check(id+' '+role+' 한 줄 수정이 외곽과 부품에 함께 반영되고 되돌림',v.rules===1&&v.shell>0&&(!v.partReads||v.part>0)&&v.restored);
  }
  fs.writeFileSync(path.join(out,'token-linkage.json'),JSON.stringify(linkage,null,2));
  await page.goto(origin+'/#/system?style=main&detail=button');await stage(page,'button',{state:'disabled'});
  check('비활성 버튼의 그림자 제거',await page.locator('#test-stage [data-state="disabled"]').evaluateAll(ns=>ns.length>0&&ns.every(n=>getComputedStyle(n).boxShadow==='none'&&n.disabled)));
  const stateButton=async s=>{await page.goto(origin+'/#/system?style=main&detail=button');return (await stage(page,'button',{state:s})).locator('[data-state="'+s+'"]').first();};
  check('누름과 키보드 초점은 다른 상태',await (await stateButton('pressed')).evaluate(n=>getComputedStyle(n).boxShadow.includes('inset'))&&await (await stateButton('focus')).evaluate(n=>getComputedStyle(n).outlineStyle==='solid'&&getComputedStyle(n).outlineWidth==='3px'));
  await page.goto(origin+'/#/system?style=main&detail=checkbox');const choice=(await stage(page,'checkbox',{state:'unchecked'})).locator('input[type=checkbox]').first();await choice.check();
  check('선택은 실제 값과 체크 기호로 표시',await choice.isChecked()&&await choice.evaluate(n=>getComputedStyle(n,'::after').content==='""'));
  await page.emulateMedia({forcedColors:'active'});
  check('고대비 환경에서 네이티브 체크 표현 복구',await choice.evaluate(n=>getComputedStyle(n).appearance==='auto'));
  await page.emulateMedia({forcedColors:'none',reducedMotion:'reduce'});
  await page.goto(origin+'/#/system?style=main&detail=button');await stage(page,'button',{state:'loading'});
  check('움직임 감소 설정에서 로딩 회전 정지',await page.locator('#test-stage .ds-spinner').first().evaluate(n=>getComputedStyle(n).animationName==='none'));
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
