const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),net=require('node:net');
const {spawn}=require('node:child_process');
const {pathToFileURL}=require('node:url');
const {chromium,firefox,webkit}=require('playwright-core');
const browsers=Object.entries({chromium,firefox,webkit}).filter(([name])=>!process.env.PATTOVE_BROWSER||name===process.env.PATTOVE_BROWSER);
const freePort=()=>new Promise(resolve=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const port=s.address().port;s.close(()=>resolve(port));});});
async function exercise(page,open){
 for(const id of ['resizable-panels','window-splitter']){
  const n=await open(id),separator=n.getByRole('separator');
  await separator.focus();await separator.press('ArrowRight');assert.equal(await separator.getAttribute('aria-valuenow'),'51');
  await separator.press('End');assert.equal(await separator.getAttribute('aria-valuenow'),'80');
  await separator.press('Enter');assert.equal(await separator.getAttribute('aria-valuenow'),'0');
  await separator.press('Enter');assert.equal(await separator.getAttribute('aria-valuenow'),'80');
  await separator.press('Home');assert.equal(await separator.getAttribute('aria-valuenow'),'0');
  await separator.press('Enter');
  await separator.scrollIntoViewIfNeeded();
  await page.evaluate(()=>{window.layoutPointerEvents=[];if(window.layoutPointerWatch)return;window.layoutPointerWatch=true;for(const name of ['pointerdown','pointermove','pointerup','gotpointercapture','lostpointercapture'])document.addEventListener(name,e=>window.layoutPointerEvents.push({name,target:e.target.outerHTML?.slice(0,100),x:e.clientX,y:e.clientY,pointer:e.pointerId}),true);});
  const box=await n.locator('.ds-layout-resizer').boundingBox(),handle=await separator.boundingBox();
  await page.mouse.move(handle.x+handle.width/2,handle.y+10);await page.mouse.down();await page.mouse.move(box.x+box.width/3,handle.y+10,{steps:5});await page.mouse.up();
  await page.waitForFunction(n=>Number(n.getAttribute('aria-valuenow'))>15&&Number(n.getAttribute('aria-valuenow'))<45,await separator.elementHandle());
  const v=Number(await separator.getAttribute('aria-valuenow'));assert(v>15&&v<45,'pointer must resize panes: '+JSON.stringify({id,v,box,handle,events:await page.evaluate(()=>window.layoutPointerEvents)}));
  await n.evaluate(n=>n.dir='rtl');await separator.press('ArrowRight');assert.equal(Number(await separator.getAttribute('aria-valuenow')),v-1);
 }
 const focus=await open('focus-layout');await focus.getByLabel('여행 메모').fill('계속 유지할 기록');await focus.getByRole('button',{name:'집중 모드',exact:true}).click();assert(!(await focus.locator('aside').isVisible()));
 await focus.getByLabel('여행 메모').press('Escape');assert(await focus.locator('aside').isVisible());assert.equal(await focus.getByLabel('여행 메모').inputValue(),'계속 유지할 기록');assert(await focus.getByRole('button',{name:'집중 모드',exact:true}).evaluate(n=>n===document.activeElement));
 const stack=await open('stacked-panels');await stack.getByRole('button',{name:'상세 보기'}).click();assert(await stack.getByRole('heading',{name:'준비물'}).isVisible());await stack.getByRole('button',{name:'이전'}).click();assert(await stack.getByRole('button',{name:'상세 보기'}).evaluate(n=>n===document.activeElement));
 for(const id of ['list-detail-layout','document-workspace','object-hub','profile-tabs']){
  const n=await open(id),tabs=n.getByRole('tab');await tabs.first().focus();await tabs.first().press(id==='list-detail-layout'?'ArrowDown':'ArrowRight');assert.equal(await tabs.nth(1).getAttribute('aria-selected'),'true');assert.equal(await n.getByRole('tabpanel').count(),1);
 }
 const shrink=await open('shrinking-header'),before=await shrink.locator('header').evaluate(n=>n.offsetHeight);await shrink.getByRole('region').focus();await shrink.getByRole('region').press('PageDown');await page.waitForFunction(()=>{const n=document.querySelector('.ds-shrinking-header header');return n&&n.parentElement.dataset.shrunk==='true';});assert((await shrink.locator('header').evaluate(n=>n.offsetHeight))<before);
 const rail=await open('collapsible-sidebar');await rail.getByRole('button',{name:'탐색 접기'}).click();assert.equal(await rail.getByRole('button',{name:'탐색 펴기'}).getAttribute('aria-expanded'),'false');assert.equal(await rail.getByRole('link',{name:'산책',exact:true}).count(),1);
 const floating=await open('floating-panel'),move=floating.getByRole('button',{name:'위치 조절'});await move.focus();await move.press('ArrowRight');await move.press('ArrowDown');await page.waitForFunction(n=>getComputedStyle(n).transform.includes('10, 10'),await floating.locator('.ds-layout-float').elementHandle());assert((await floating.locator('.ds-layout-float').evaluate(n=>getComputedStyle(n).transform)).includes('10, 10'));await move.press('Home');await page.waitForFunction(n=>getComputedStyle(n).transform.includes('0, 0'),await floating.locator('.ds-layout-float').elementHandle());assert((await floating.locator('.ds-layout-float').evaluate(n=>getComputedStyle(n).transform)).includes('0, 0'));
 const off=await open('off-canvas-layout');await off.getByRole('button',{name:'안내 열기'}).click();assert(await off.getByRole('dialog').isVisible());await page.keyboard.press('Escape');assert(await off.getByRole('button',{name:'안내 열기'}).evaluate(n=>n===document.activeElement));
 const append=await open('append-around');
 if(!await append.getByLabel('이동할 메모').count())await append.locator('[data-layout-movable]').evaluate(n=>{const label=document.createElement('label');label.textContent='이동할 메모';const input=document.createElement('input');input.value='원래 메모';label.append(input);n.append(label);});
 const input=append.getByLabel('이동할 메모');await input.fill('작성 중인 메모');await input.focus();
 await page.setViewportSize({width:320,height:900});await page.waitForFunction(()=>document.querySelector('[data-layout-narrow-slot] [data-layout-movable]'));
 assert.equal(await input.inputValue(),'작성 중인 메모');assert(await input.evaluate(n=>n===document.activeElement));await input.fill('좁은 화면에서 수정');
 await page.setViewportSize({width:1100,height:900});await page.waitForFunction(()=>document.querySelector('[data-layout-wide-slot] [data-layout-movable]'));assert.equal(await input.inputValue(),'좁은 화면에서 수정');
 if(await page.getByRole('button',{name:'이동 부품 숨기기'}).count()){await page.getByRole('button',{name:'이동 부품 숨기기'}).click();assert.equal(await page.locator('.ds-append-around').count(),0);}
}
(async()=>{
 const {root,system,exportSources}=await import('../scripts/lib/system-store.mjs');
 const items=system().systemRegistry.items.filter(i=>i.layoutMode==='interactive'),ids=items.map(i=>i.id),out=fs.mkdtempSync(path.join(root,'test-results/layout-consumers-'));
 const html=path.join(out,'html');exportSources({ids,environment:'html',out:html});
 for(const [name,type]of browsers){
  const browser=await type.launch();try{const page=await browser.newPage({viewport:{width:1100,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await exercise(page,async id=>{await page.goto(pathToFileURL(path.join(html,'design/examples/main',id+'.html')).href);return page.locator('main');});assert.deepEqual(errors,[]);console.log(name+': exported HTML interaction contracts passed');}finally{await browser.close();}
 }
 const dir=path.join(out,'react');exportSources({ids,environment:'react',out:dir});fs.mkdirSync(path.join(dir,'app'));fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({name:'layout-consumer',private:true}));
 fs.writeFileSync(path.join(dir,'app/layout.jsx'),`import React from 'react';export default function Layout({children}){return <html lang="ko"><body>{children}</body></html>;}`);
 const css=['design/fonts.css','design/base.css',...fs.readdirSync(path.join(dir,'design/css')).map(n=>'design/css/'+n),...fs.readdirSync(path.join(dir,'design/styles/main')).map(n=>'design/styles/main/'+n)];
 fs.writeFileSync(path.join(dir,'app/page.jsx'),`'use client';
import React,{useState,useEffect} from 'react';
${items.map(i=>`import {${i.reactExport}} from '../design/react/${i.id}.jsx';`).join('\n')}
${css.map(f=>`import '../${f}';`).join('\n')}
export default function Page(){const [memo,setMemo]=useState('원래 메모'),[show,setShow]=useState(true);useEffect(()=>{document.documentElement.dataset.ready='true';},[]);return <main className="ds">${items.map(i=>`<section data-layout-case="${i.id}">${i.id==='append-around'?`<button type="button" onClick={()=>setShow(false)}>이동 부품 숨기기</button>{show&&<AppendAround aside={<label>이동할 메모<input value={memo} onChange={e=>setMemo(e.target.value)}/></label>}/>}<output>{memo}</output>`:`<${i.reactExport}/>`}</section>`).join('')}</main>;}`);
 const port=await freePort(),server=spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'dev','--webpack','--hostname','127.0.0.1','--port',String(port)],{cwd:dir,stdio:['ignore','pipe','pipe'],windowsHide:true,env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}});
 let log='';server.stdout.on('data',s=>log+=s);server.stderr.on('data',s=>log+=s);
 try{
  let ready=false;for(let i=0;i<150;i++){if(/Ready in/.test(log)){ready=true;break;}if(server.exitCode!==null)throw Error(log);await new Promise(r=>setTimeout(r,200));}assert(ready,log);
  for(const [name,type]of browsers){
   const browser=await type.launch();try{const page=await browser.newPage({viewport:{width:1100,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));const response=await page.goto('http://127.0.0.1:'+port,{timeout:120000});assert.equal(response.status(),200,log);await page.waitForFunction(()=>document.documentElement.dataset.ready==='true');await exercise(page,async id=>{const n=page.locator('[data-layout-case="'+id+'"]');await n.scrollIntoViewIfNeeded();return n;});assert.deepEqual(errors,[]);console.log(name+': React props, keyboard, pointer, input persistence and unmount passed');}finally{await browser.close();}
  }
 }finally{server.kill();fs.writeFileSync(path.join(out,'next.log'),log);}
})().catch(e=>{console.error(e);process.exitCode=1;});
