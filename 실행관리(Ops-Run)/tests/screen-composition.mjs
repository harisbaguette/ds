import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import {spawn,spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {chromium,firefox,webkit} from 'playwright-core';
import {root,compareInstallation} from '../scripts/lib/system-store.mjs';
import {screenContract,validateScreen,composeScreen} from '../scripts/lib/screen-spec.mjs';
import {evaluateScreen} from '../scripts/lib/evaluate-screen.mjs';

const parent=fs.mkdtempSync(path.join(root,'test-results/screen-composition-'));
const spec=screenContract().example;
spec.sections[0].props.fields.push(
  {name:'memo',label:'요청',type:'textarea',value:'줄바꿈\n<script>window.injection=true</script>'},
  {name:'course',label:'수업',type:'select',value:'print',items:[{value:'drawing',label:'드로잉'},{value:'print',label:'판화'}]},
  {name:'consent',label:'연락에 동의',type:'checkbox',required:true},
  {name:'quantity',label:'참여 인원',type:'number',min:1,max:5,step:1,value:2}
);
spec.sections.push(
  {id:'details',component:'summary-list',props:{title:'수업 안내',items:[{label:'준비물',value:'앞치마\n편한 옷'},{label:'일정',value:'토요일 오전'}]}},
  {id:'compare',component:'comparison',props:{title:'과정 비교',items:[{id:'drawing',name:'드로잉',price:'3만 원',detail:'2시간'},{id:'print',name:'판화',price:'5만 원',detail:'3시간'}]}},
  {id:'reading',component:'article-page',props:{title:'작업 준비',sections:[{title:'종이 고르기',body:'번짐과 두께를 먼저 확인합니다.'},{title:'도구 정리',body:'마른 붓을 준비합니다.'}]}},
  {id:'faq',component:'accordion',props:{items:[{title:'도구는 빌릴 수 있나요?',body:'수업 도구는 작업실에서 제공합니다.'}]}},
  {id:'cost',component:'input-result',props:{title:'예상 금액',initialPrice:35000,initialQuantity:2}},
  {id:'login',component:'login-form',props:{title:'회원 로그인'}},
  {id:'profile',component:'settings-form',props:{title:'내 정보',initialValues:{name:'학습자',memo:'수업 기록',visibility:'public',notification:false}}}
);
assert(validateScreen(spec).valid);
const bad=change=>{const copy=structuredClone(spec);change(copy);assert(!validateScreen(copy).valid);return copy;};
bad(s=>s.sections[1].id=s.sections[0].id);
bad(s=>s.sections[0].props.fields.push({...s.sections[0].props.fields[0]}));
bad(s=>s.sections[0].props.fields[3].value='missing');
bad(s=>s.sections[0].props.fields[4].value='false');
bad(s=>s.sections[0].props.fields[5].min=10);
bad(s=>s.sections[0].props.fields[0].type='file');
bad(s=>s.sections[0].props.fields[0].name='elements');
bad(s=>s.sections[0].id='constructor');
bad(s=>s.sections[0].props.fields[0]={name:'secret',label:'Password',type:'password',value:'do-not-store'});
bad(s=>s.sections[1].props.items[0].href='javascript:alert(1)');
bad(s=>s.sections[1].props.items[0].href='/\\evil.example');
bad(s=>s.sections[0].props.dangerouslySetInnerHTML={__html:'bad'});
const invalid=bad(s=>s.style='missing'),invalidPath=path.join(parent,'invalid.json');fs.writeFileSync(invalidPath,JSON.stringify(invalid));
const invalidOutput=path.join(parent,'must-not-exist');
const invalidCLI=spawnSync(process.execPath,['scripts/system.mjs','compose','--spec',invalidPath,'--out',invalidOutput],{cwd:root,encoding:'utf8'});
assert.equal(invalidCLI.status,1);assert(!fs.existsSync(invalidOutput));
const html=composeScreen({spec,out:path.join(parent,'html')});
assert.throws(()=>composeScreen({spec,out:html.directory}));
assert(compareInstallation(html.directory).every(i=>i.files.every(f=>f.status==='unchanged')));
const evaluate=await evaluateScreen({project:html.directory});assert.deepEqual(evaluate.findings,[]);

async function exercise(page,react=false){
  assert.equal(await page.locator('h1').count(),1);
  assert.equal(await page.evaluate(()=>window.injection),undefined);
  assert.equal(await page.locator('#screen-profile [name="name"]').inputValue(),'학습자');
  assert.equal(await page.locator('#screen-profile [name="visibility"]').inputValue(),'public');
  assert.equal(await page.locator('#screen-profile [name="notification"]').isChecked(),false);
  await page.locator('#screen-cost').getByRole('button',{name:'계산'}).click();
  await page.waitForFunction(()=>document.querySelector('#screen-cost output').textContent.includes('70,000'));
  assert.match(await page.locator('#screen-cost output').textContent(),/70,000/);
  await page.locator('#screen-compare').getByRole('button',{name:'판화 선택'}).click();
  assert.equal(await page.locator('#screen-compare [aria-pressed="true"]').count(),1);
  const form=page.locator('#screen-application form');
  await form.getByRole('button',{name:'신청',exact:true}).click();
  await form.locator('.ds-error-summary').waitFor({state:'visible'});
  assert.equal(await form.locator('.ds-error-summary a').count(),3);
  assert.deepEqual(await form.locator('.ds-error-summary a').allTextContents(),['이름: 값을 입력하세요.','이메일: 값을 입력하세요.','연락에 동의: 체크해 주세요.']);
  assert(await form.locator('.ds-error-summary').evaluate(n=>document.activeElement===n));
  await form.locator('.ds-error-summary a').first().click();
  assert(await form.getByLabel('이름',{exact:true}).evaluate(n=>document.activeElement===n));
  await form.getByLabel('이름',{exact:true}).fill('김하나');await form.getByLabel('이메일',{exact:true}).fill('reader@example.com');await form.getByLabel('연락에 동의').check();
  if(!react)await page.evaluate(()=>{
    window.calls=0;
    window.pattoveScreenHandlers.application=async values=>{window.submitted=values;window.calls++;if(window.calls===1)throw {fieldErrors:{email:'이미 신청한 이메일입니다.'}};await new Promise(r=>window.finish=r);};
  });
  await form.getByRole('button',{name:'신청',exact:true}).click();
  await form.locator('.ds-error-summary').getByText('이미 신청한 이메일입니다.').waitFor();
  assert.equal(await form.getByLabel('이름',{exact:true}).inputValue(),'김하나');
  await form.getByLabel('이메일',{exact:true}).fill('another@example.com');
  await form.getByRole('button',{name:'신청',exact:true}).click();
  await page.waitForFunction(()=>window.finish);
  assert(await form.getByRole('button',{name:'신청',exact:true}).isDisabled());
  await form.evaluate(n=>n.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  assert.equal(await page.evaluate(()=>window.calls),2);
  await page.evaluate(()=>window.finish());
  await form.getByRole('status').getByText('신청을 받았어요.').waitFor();
  assert.deepEqual(await page.evaluate(()=>({consent:window.submitted.consent,course:window.submitted.course})),{consent:true,course:'print'});
  assert.equal(await form.locator('.ds-error-summary:visible').count(),0);
  await page.keyboard.press('Tab');
}
for(const [name,type]of Object.entries({chromium,firefox,webkit})){
  const browser=await type.launch();
  try{const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(pathToFileURL(path.join(html.directory,'index.html')).href);await exercise(page);assert.deepEqual(errors,[]);console.log(name+': content, native validation, server field errors, focus, retry and duplicate submission passed');}
  finally{await browser.close();}
}

const react=composeScreen({spec,environment:'react',out:path.join(parent,'react')});
fs.mkdirSync(path.join(react.directory,'app'));
fs.writeFileSync(path.join(react.directory,'package.json'),JSON.stringify({name:'screen-consumer',private:true}));
fs.writeFileSync(path.join(react.directory,'app/layout.jsx'),`import React from 'react';export default function Layout({children}){return <html lang="ko"><body>{children}</body></html>}`);
fs.writeFileSync(path.join(react.directory,'app/page.jsx'),`'use client';import React from 'react';import Screen from '../screen.jsx';export default function Page(){return <Screen handlers={{application:async values=>{window.submitted=values;window.calls=(window.calls||0)+1;if(window.calls===1)throw {fieldErrors:{email:'이미 신청한 이메일입니다.'}};await new Promise(r=>window.finish=r);}}}/>;}`);
const port=await new Promise(resolve=>{const server=net.createServer();server.listen(0,'127.0.0.1',()=>{const port=server.address().port;server.close(()=>resolve(port));});});
const server=spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'dev','--webpack','--hostname','127.0.0.1','--port',String(port)],{cwd:react.directory,windowsHide:true,stdio:['ignore','pipe','pipe'],env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}});
let log='',browser;server.stdout.on('data',s=>log+=s);server.stderr.on('data',s=>log+=s);
try{
  for(let i=0;i<200&&!/Ready in/.test(log);i++){if(server.exitCode!==null)throw Error(log);await new Promise(r=>setTimeout(r,200));}
  assert(/Ready in/.test(log),log);browser=await chromium.launch();const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));const response=await page.goto('http://127.0.0.1:'+port,{timeout:120000});assert.equal(response.status(),200,log);
  await exercise(page,true);assert.deepEqual(errors,[]);
  const noJS=await browser.newContext({javaScriptEnabled:false}),staticPage=await noJS.newPage();await staticPage.goto('http://127.0.0.1:'+port);
  assert.equal(await staticPage.locator('form').count(),4);
  for(const form of await staticPage.locator('form').all()){
    assert.equal(await form.getAttribute('method'),'post');assert(await form.locator('fieldset').evaluate(n=>n.disabled));
    for(const control of await form.locator('input,textarea,select,button').all())assert(await control.isDisabled());
  }
  await noJS.close();console.log('React: generated content, real source compilation, hydration guards and matching form/keyboard behavior passed');
}finally{await browser?.close();server.kill();fs.writeFileSync(path.join(parent,'next.log'),log);}
console.log('Screen specification validation, non-overwrite export, offline resources and 3 viewport checks passed.');
