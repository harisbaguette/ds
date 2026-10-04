import fs from 'node:fs';
import path from 'node:path';
import {z} from 'zod';
import {zodToJsonSchema} from 'zod-to-json-schema';
import {system,registryFiles,writeExport,root} from './system-store.mjs';
import {loadTokens} from '../tokens.mjs';

const text=z.string().trim().min(1).max(500);
const body=z.string().max(20000);
const identifier=z.string().regex(/^[a-z][a-z0-9-]{0,63}$/).refine(v=>!['constructor','prototype'].includes(v),'Reserved identifier');
const object=shape=>z.object(shape).strict();
const unique=(values,key)=>new Set(values.map(v=>v[key])).size===values.length;
const href=z.string().max(2000).refine(value=>/^(?:https?:\/\/|mailto:|tel:|#|\/(?!\/)|\.\.?\/)/i.test(value)&&!/[\u0000-\u0020\\]/.test(value),'Use a local path, fragment, HTTP, mailto or tel URL');
const choice=object({value:z.string().max(200),label:text});
export const formFieldSchema=object({
  name:identifier.refine(v=>!['__proto__','constructor','prototype','elements','matches','dataset','closest','children','attributes','remove','append','contains','submit','reset'].includes(v),'Reserved field name'),label:text,
  type:z.enum(['text','email','password','tel','url','number','date','time','textarea','select','checkbox']).default('text'),
  value:z.union([z.string().max(20000),z.number().finite(),z.boolean()]).optional(),help:body.optional(),required:z.boolean().optional(),
  autoComplete:z.enum(['name','given-name','family-name','email','tel','organization','street-address','postal-code','country-name','username','current-password','new-password','one-time-code','off','on']).optional(),
  min:z.number().finite().optional(),max:z.number().finite().optional(),step:z.number().positive().finite().optional(),maxLength:z.number().int().positive().max(20000).optional(),
  items:z.array(choice).min(1).max(100).optional()
}).superRefine((field,ctx)=>{
  const fail=(message)=>ctx.addIssue({code:'custom',message});
  if(field.type==='select'&&(!field.items||!unique(field.items,'value')))fail('Select options must exist and have unique values');
  if(field.type!=='select'&&field.items)fail('Only selects accept items');
  if(field.type==='select'&&field.value!==undefined&&!field.items?.some(i=>i.value===field.value))fail('Select value must match an option');
  if(field.type==='checkbox'&&field.value!==undefined&&typeof field.value!=='boolean')fail('Checkbox value must be boolean');
  if(field.type!=='checkbox'&&typeof field.value==='boolean')fail('Text fields cannot have boolean values');
  if(field.type==='password'&&field.value)fail('Do not put passwords in screen specifications');
  if(field.min!==undefined&&field.max!==undefined&&field.min>field.max)fail('min must not exceed max');
  if(field.type!=='number'&&[field.min,field.max,field.step].some(v=>v!==undefined))fail('Numeric limits require type number');
  if(field.maxLength!==undefined&&!['text','email','password','tel','url','textarea'].includes(field.type))fail('maxLength requires a text field');
  if(['date','time'].includes(field.type)&&field.value!==undefined&&typeof field.value!=='string')fail('Date and time defaults must be strings');
});
const props={
  'data-form':object({title:text,fields:z.array(formFieldSchema).min(1).max(40).refine(v=>unique(v,'name'),'Field names must be unique'),submitLabel:text,successMessage:text}),
  'summary-list':object({title:text,items:z.array(object({label:text,value:body,href:href.optional()})).min(1).max(100)}),
  comparison:object({title:text,items:z.array(object({id:identifier,name:text,price:text,detail:body})).min(2).max(8).refine(v=>unique(v,'id'),'Item IDs must be unique')}),
  'article-page':object({title:text,sections:z.array(object({title:text,body})).min(1).max(30)}),
  accordion:object({items:z.array(object({title:text,body})).min(1).max(30)}),
  'input-result':object({title:text,initialPrice:z.number().nonnegative().finite().max(1e12),initialQuantity:z.number().int().positive().max(1e9)}),
  'login-form':object({title:text}),
  'settings-form':object({title:text,initialValues:object({name:z.string().max(200),memo:body,visibility:z.enum(['private','team','public']),notification:z.boolean()})})
};
export const screenSchema=object({
  version:z.literal(1),intent:text,title:text,language:z.literal('ko').default('ko'),style:z.literal('main').default('main'),
  sections:z.array(z.discriminatedUnion('component',Object.entries(props).map(([component,schema])=>object({id:identifier,component:z.literal(component),props:schema})))).min(1).max(20)
}).superRefine((spec,ctx)=>{
  if(!unique(spec.sections,'id'))ctx.addIssue({code:'custom',path:['sections'],message:'Section IDs must be unique'});
  const interactive=spec.sections.filter(s=>['data-form','login-form','settings-form'].includes(s.component));
  if(interactive.length>3)ctx.addIssue({code:'custom',path:['sections'],message:'Split unrelated submission tasks into separate screens (maximum 3 forms)'});
});

export function screenContract(){return {
  version:1,styles:['main'],environments:['html','react'],
  schema:zodToJsonSchema(screenSchema,{$refStrategy:'none'}),
  components:Object.keys(props).map(id=>({id,inputs:system().systemRegistry.index.get(id).inputs})),
  example:{version:1,intent:'원하는 수업을 신청한다',title:'수업 신청',sections:[{id:'application',component:'data-form',props:{title:'신청자 정보',submitLabel:'신청',successMessage:'신청을 받았어요.',fields:[{name:'name',label:'이름',type:'text',required:true,autoComplete:'name'},{name:'email',label:'이메일',type:'email',required:true,autoComplete:'email'}]}}]},
  steps:['목적과 실제 콘텐츠로 구현 후보를 선택','섹션마다 고유 id와 component·props를 작성','validate-screen으로 계약 확인','compose --spec으로 새 폴더에 출력','호스트의 저장·인증 콜백 연결','evaluate와 실제 조작으로 확인한 뒤 원본 spec 수정'],
  constraints:['입력은 JSON 데이터이며 HTML·JavaScript·CSS를 실행하지 않습니다.','화면 명세에 비밀번호·인증 토큰을 넣지 않습니다.','지원 목록 밖의 부품은 개별 소스로 가져와 조합합니다.','검사 통과는 시각 품질·사용자 이해 검증을 대신하지 않습니다.']
};}

export function validateScreen(input){
  const result=screenSchema.safeParse(input);
  if(!result.success)return {valid:false,issues:result.error.issues.map(i=>({path:i.path.join('.'),message:i.message}))};
  const spec=result.data;
  return {valid:true,spec,components:[...new Set(spec.sections.map(s=>s.component))],bindings:spec.sections.filter(s=>['data-form','settings-form','login-form','comparison'].includes(s.component)).map(s=>({section:s.id,event:s.component==='comparison'?'choose':'submit',required:s.component!=='comparison'})),manualReviewRequired:true};
}
export function readScreen(file){
  if(fs.statSync(file).size>1048576)throw Error('Screen specification exceeds 1 MiB');
  return JSON.parse(fs.readFileSync(file,'utf8'));
}

export function composeScreen({spec:input,environment='html',out}){
  const result=validateScreen(input);if(!result.valid)throw Error(result.issues.map(i=>i.path+': '+i.message).join('\n'));
  if(!['html','react'].includes(environment))throw Error('Only HTML and React are supported');
  const {spec}=result,p=system().parts;
  const css=fs.readFileSync(path.join(root,'src/system/screen.css'),'utf8').replace(/\r\n/g,'\n');
  const kinds=loadTokens(root).kindsIn(css,'screen.css');
  const {files,dependencies}=registryFiles([...result.components,...kinds.map(k=>'token-'+k)],environment,spec.style);
  files.set('design/screen.css',css);
  const styles=[...files.keys()].filter(f=>f.endsWith('.css'));
  if(environment==='html'){
    const sections=spec.sections.map(s=>`<section id="screen-${s.id}" class="ds-screen-section" data-screen-section="${s.id}">${p.renderItem(s.component,'screen-'+s.id+'-content',{...s.props,...s.component==='article-page'?{headingLevel:2}:{}})}</section>`).join('\n');
    const scripts=['design/html/table-core.min.js','design/html/admin.js','design/html/behaviors.js'].filter(f=>files.has(f));
    files.set('index.html',`<!doctype html>\n<html lang="${spec.language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${p.esc(spec.title)}</title>\n${styles.map(f=>`<link rel="stylesheet" href="${f}">`).join('\n')}</head><body class="ds" data-style="main"><a class="ds-screen-skip" href="#screen-main">본문으로</a><main id="screen-main" class="ds-screen" tabindex="-1"><header><h1>${p.esc(spec.title)}</h1></header>${sections}</main>${scripts.map(f=>`<script src="${f}"></script>`).join('')}<script src="bindings.js"></script></body></html>\n`);
    const comparisons=Object.fromEntries(spec.sections.filter(s=>s.component==='comparison').map(s=>[s.id,s.props.items]));
    files.set('bindings.js',`// Register a handler by section ID before the user submits. Handlers return a Promise.\nwindow.pattoveScreenHandlers = Object.create(null);\nconst comparisonItems = ${JSON.stringify(comparisons)};\ndocument.addEventListener('pattove:submit', event => {\n  const id = event.target.closest('[data-screen-section]')?.dataset.screenSection;\n  const handler = window.pattoveScreenHandlers[id];\n  if (typeof handler === 'function') event.detail.respondWith(Promise.resolve().then(() => handler(event.detail.values, {signal:event.detail.signal})));\n});\ndocument.addEventListener('pattove:choose', event => {\n  const id = event.target.closest('[data-screen-section]')?.dataset.screenSection;\n  const handler = window.pattoveScreenHandlers[id];\n  if (typeof handler === 'function') handler(comparisonItems[id]?.find(item => item.id === event.detail.id) || event.detail);\n});\n`);
  }else{
    const names=Object.fromEntries(result.components.map(id=>[id,system().systemRegistry.index.get(id).reactExport]));
    const declarations=spec.sections.map((s,i)=>`const props${i} = ${JSON.stringify({...s.props,...s.component==='article-page'?{headingLevel:2}:{}}).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')};`).join('\n');
    const callback={'data-form':'onSubmit','settings-form':'onSave','login-form':'onAuthenticate',comparison:'onChoose'};
    files.set('screen.jsx',`'use client';\nimport React from 'react';\n${Object.entries(names).map(([id,name])=>`import {${name}} from './design/react/${id}.jsx';`).join('\n')}\n${styles.map(f=>`import './${f}';`).join('\n')}\n${declarations}\nexport default function Screen({handlers={}}){const handler=id=>Object.hasOwn(handlers,id)&&typeof handlers[id]==='function'?handlers[id]:undefined;return <div className="ds" data-style="main"><a className="ds-screen-skip" href="#screen-main">본문으로</a><main id="screen-main" className="ds-screen" tabIndex={-1}><header><h1>{${JSON.stringify(spec.title).replace(/</g,'\\u003c')}}</h1></header>${spec.sections.map((s,i)=>`<section id="screen-${s.id}" className="ds-screen-section" data-screen-section="${s.id}"><${names[s.component]} {...props${i}} ${callback[s.component]?`${callback[s.component]}={handler(${JSON.stringify(s.id)})}`:''}/></section>`).join('')}</main></div>;}\n`);
    files.set('page.jsx',`export {default} from './screen.jsx';\n`);
  }
  files.set('pattove.screen.json',JSON.stringify(spec,null,2)+'\n');
  files.set('screen-contract.json',JSON.stringify({version:1,environment,bindings:result.bindings,manualReviewRequired:true},null,2)+'\n');
  const directory=writeExport(files,out);
  return {directory,files:files.size,dependencies,entry:environment==='html'?'index.html':'page.jsx',bindings:result.bindings,manualReviewRequired:true};
}
