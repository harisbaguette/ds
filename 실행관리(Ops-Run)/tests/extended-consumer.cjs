const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),net=require('node:net');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright-core');
const freePort=()=>new Promise(resolve=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const port=s.address().port;s.close(()=>resolve(port));});});
(async()=>{
  const {root,system,exportSources}=await import('../scripts/lib/system-store.mjs');
  const ids=system().systemRegistry.items.filter(i=>i.reactExport).map(i=>i.id),parent=fs.mkdtempSync(path.join(root,'test-results/extended-consumer-')),dir=path.join(parent,'app');
  exportSources({ids,environment:'react',out:dir});fs.mkdirSync(path.join(dir,'app'));
  fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({name:'pattove-extended-consumer',private:true}));
  fs.writeFileSync(path.join(dir,'app/layout.jsx'),`import React from 'react';export default function Layout({children}){return <html lang="ko"><body>{children}</body></html>}`);
  const imports=ids.map((id,i)=>`import Example${i} from '../design/examples/main/${id}.jsx';`).join('\n');
  fs.writeFileSync(path.join(dir,'app/page.jsx'),`'use client';
import React,{useRef} from 'react';
import {SettingsForm} from '../design/react/settings-form.jsx';
import {LoginForm} from '../design/react/login-form.jsx';
import {Dialog} from '../design/react/dialog.jsx';
${imports}
export default function Page(){const attempt=useRef(0);return <main className="ds" data-style="main"><section id="confirm-contract"><Dialog confirmLabel="확인" onConfirm={()=>window.confirmCount=(window.confirmCount||0)+1}/></section><section id="save-contract"><SettingsForm onSave={async(values)=>{window.lastValues=values;if(++attempt.current===1)throw Error('offline');await new Promise(r=>{window.finishSave=r;});}}/></section><section id="login-contract"><LoginForm onAuthenticate={async(values)=>{window.authValues=values;}}/></section>${ids.map((id,i)=>`<section data-example="${id}"><Example${i}/></section>`).join('')}</main>;}
`);
  const port=await freePort(),server=spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'dev','--webpack','--hostname','127.0.0.1','--port',String(port)],{cwd:dir,stdio:['ignore','pipe','pipe'],windowsHide:true,env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}});
  let log='';server.stdout.on('data',s=>log+=s);server.stderr.on('data',s=>log+=s);
  let browser;
  try{
    let ready=false;for(let i=0;i<150;i++){if(/Ready in/.test(log)){ready=true;break;}if(server.exitCode!==null)throw Error(log);await new Promise(r=>setTimeout(r,200));}assert(ready,log);
    browser=await chromium.launch();const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(12000);
    const response=await page.goto('http://127.0.0.1:'+port,{timeout:120000});assert.equal(response.status(),200,log);await page.locator('[data-example="combobox"] input').waitFor();
    assert.equal(await page.locator('[data-example]').count(),22);
    const combo=page.locator('[data-example="combobox"] input');await combo.fill('제');await combo.press('ArrowDown');await combo.press('Enter');assert.equal(await combo.inputValue(),'제주');
    const dialog=page.locator('[data-example="dialog"]');await dialog.getByRole('button',{name:'열기'}).click();assert(await dialog.locator('dialog').evaluate(n=>n.open));await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('[data-example="dialog"] dialog').open);
    const confirmation=page.locator('#confirm-contract');await confirmation.getByRole('button',{name:'열기'}).click();await confirmation.getByRole('button',{name:'확인',exact:true}).click();await page.waitForFunction(()=>window.confirmCount===1);await confirmation.getByRole('button',{name:'열기'}).click();await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('#confirm-contract dialog').open);assert.equal(await page.evaluate(()=>window.confirmCount),1,'Escape must never replay the previous confirmation');
    const form=page.locator('#save-contract form');await form.getByLabel('표시 이름').fill('다른 프로젝트');await form.getByRole('button',{name:'저장'}).click();await form.getByRole('status').filter({hasText:'처리하지 못했어요.'}).waitFor();assert.equal(await form.getByLabel('표시 이름').inputValue(),'다른 프로젝트');await form.getByRole('button',{name:'저장'}).click();assert(await form.getByRole('button',{name:'저장'}).isDisabled());await page.evaluate(()=>window.finishSave());await form.getByRole('status').filter({hasText:'저장했어요.'}).waitFor();assert.equal(await page.evaluate(()=>window.lastValues.name),'다른 프로젝트');
    const login=page.locator('#login-contract');await login.getByLabel('이메일').fill('reader@example.com');await login.getByLabel('비밀번호').fill('safe-test-value');await login.getByRole('button',{name:'로그인'}).click();await login.getByRole('status').filter({hasText:'로그인했어요.'}).waitFor();assert.equal(await page.evaluate(()=>window.authValues.email),'reader@example.com');
    assert(await page.locator('[data-example="spinner"] .ds-spinner').evaluate(n=>getComputedStyle(n).animationName==='ds-spin'),'React export includes transitive spinner CSS');
    assert(await page.locator('[data-example="textarea"] textarea').evaluate(n=>n.getBoundingClientRect().height>=96));
    assert.deepEqual(errors,[]);await page.screenshot({path:path.join(parent,'mobile.png'),fullPage:true});console.log('22 React exports compiled in Next.js; independent callbacks, failure, retry, keyboard and CSS dependencies verified.');
  }finally{await browser?.close();server.kill();fs.writeFileSync(path.join(parent,'next.log'),log);}
})().catch(e=>{console.error(e);process.exitCode=1;});
