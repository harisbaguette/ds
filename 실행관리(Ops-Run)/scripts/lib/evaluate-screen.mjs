import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright-core';
import {root} from './system-store.mjs';

export async function evaluateScreen({project,url,out}){
  if(!project&&!url)throw Error('--project or --url is required');
  if(project&&url)throw Error('Choose either --project or --url');
  let target;
  if(project){
    const index=path.join(path.resolve(project),'index.html');
    if(!fs.existsSync(index))throw Error('Missing index.html; use --url for a running React app');
    target=pathToFileURL(index).href;
  }else{
    const parsed=new URL(url);
    if(!['http:','https:'].includes(parsed.protocol)||!['localhost','127.0.0.1','[::1]'].includes(parsed.hostname)||parsed.username||parsed.password)throw Error('Evaluation URL must be a local development server');
    target=parsed.href;
  }
  fs.mkdirSync(path.join(root,'test-results'),{recursive:true});
  const directory=out?path.resolve(out):fs.mkdtempSync(path.join(root,'test-results/screen-'));
  if(out){if(fs.existsSync(directory))throw Error('Evaluation output must be a new directory');fs.mkdirSync(directory,{recursive:true});}
  const browser=await chromium.launch({headless:true}),checks=[],errors=[];
  try{
    for(const width of [320,768,1440]){
      const context=await browser.newContext({viewport:{width,height:960},reducedMotion:'reduce'});
      const page=await context.newPage();
      page.setDefaultTimeout(15000);
      page.on('pageerror',e=>errors.push({width,kind:'runtime',message:e.message}));
      page.on('requestfailed',request=>errors.push({width,kind:'resource',url:request.url(),message:request.failure()?.errorText}));
      page.on('response',response=>{if(response.status()>=400)errors.push({width,kind:'http',url:response.url(),status:response.status()});});
      await page.goto(target,{waitUntil:'load',timeout:30000});
      await page.evaluate(async()=>{
        await document.fonts.ready;
        for(const img of document.images){img.loading='eager';await img.decode().catch(()=>{});}
      });
      const findings=await page.evaluate(()=>{
        const result=[],ids=new Set();
        const visible=el=>{const r=el.getBoundingClientRect();return el.checkVisibility({visibilityProperty:true})&&r.width>0&&r.height>0&&!el.closest('[hidden],[inert]');};
        if(document.documentElement.scrollWidth>innerWidth)result.push({kind:'overflow',width:document.documentElement.scrollWidth});
        for(const node of document.querySelectorAll('[id]')){if(ids.has(node.id))result.push({kind:'duplicate-id',id:node.id});ids.add(node.id);}
        for(const node of document.querySelectorAll('[aria-labelledby],[aria-describedby],[aria-controls],label[for]')){
          for(const attr of ['aria-labelledby','aria-describedby','aria-controls','for'])for(const id of (node.getAttribute(attr)||'').split(/\s+/).filter(Boolean))if(!document.getElementById(id))result.push({kind:'broken-reference',attribute:attr,id});
        }
        for(const img of document.images)if(!img.complete||img.naturalWidth===0)result.push({kind:'broken-image',src:img.getAttribute('src')?.slice(0,200)});
        for(const img of document.images)if(!img.hasAttribute('alt'))result.push({kind:'missing-alt',src:img.getAttribute('src')?.slice(0,200)});
        for(const node of document.querySelectorAll('input,textarea,select,button,a[href],[role="button"],[role="combobox"]')){
          if(!visible(node)||node.matches(':disabled'))continue;
          const name=node.getAttribute('aria-label')||node.getAttribute('aria-labelledby')?.split(/\s+/).map(id=>document.getElementById(id)?.textContent).join(' ')||[...(node.labels||[])].map(n=>n.textContent).join(' ')||node.textContent||node.querySelector('img')?.alt;
          if(!name?.trim())result.push({kind:'missing-name',element:node.outerHTML.slice(0,200)});
          const hit=node.matches('input[type="checkbox"],input[type="radio"]')&&node.labels?.[0]?node.labels[0]:node,r=hit.getBoundingClientRect();
          if(r.width<24||r.height<24)result.push({kind:'small-target',name:name?.trim(),width:r.width,height:r.height});
        }
        return result;
      });
      const focus=[];
      await page.keyboard.press('Tab');
      for(let i=0;i<30;i++){
        const current=await page.evaluate(()=>{const n=document.activeElement,r=n.getBoundingClientRect(),s=getComputedStyle(n);return {tag:n.tagName,id:n.id,name:n.getAttribute('aria-label')||n.textContent?.trim().slice(0,60),visible:!!r.width&&!!r.height&&s.visibility!=='hidden',outline:s.outlineStyle,shadow:s.boxShadow};});
        focus.push(current);await page.keyboard.press('Tab');
      }
      await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0);});
      await page.screenshot({path:path.join(directory,width+'.png'),fullPage:true,animations:'disabled'});
      checks.push({width,findings,focus});await context.close();
    }
  }finally{await browser.close();}
  const findings=[...checks.flatMap(c=>c.findings.map(f=>({width:c.width,...f}))),...errors];
  const report={url:target,checks,findings,passed:findings.length===0,manualReviewRequired:true,manualChecks:['읽는 순서와 핵심 행동의 강조','실제 콘텐츠와 빈 상태·오류·복구','스크린리더·키보드 조작·초점 표시','색 대비·텍스트 확대·동작 선호'],directory};
  fs.writeFileSync(path.join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');
  return report;
}
