(() => {
  const { parts: p, systemRegistry: r } = window.Pattove;
  const e = p.esc;
  const names = { button:'Button',input:'Input',field:'Field',checkbox:'Checkbox',radio:'Radio',switch:'Switch',badge:'Badge',divider:'Divider','status-dot':'StatusDot',card:'Card',tabs:'Tabs','bottom-nav':'BottomNav',feedback:'Feedback','search-module':'SearchModule',template:'Template',page:'CollectionPage' };
  const wide = id => ['search-module','template','page'].includes(id);
  const url = (id, extras = {}) => '#/system?' + new URLSearchParams({ style:'main', detail:id, ...extras });
  const jsxIcon = name => p.icon(name).replace(/class=/g,'className=').replace(/stroke-width=/g,'strokeWidth=').replace(/stroke-linecap=/g,'strokeLinecap=').replace(/stroke-linejoin=/g,'strokeLinejoin=');
  function jsx(id, provided) {
    const o = r.normalizeOptions(id, provided);
    const chosen = o.state !== 'unchecked' ? ' defaultChecked' : '';
    const disabled = o.state === 'disabled' ? ' disabled' : '';
    if (id === 'icon') return jsxIcon(o.icon);
    if (id === 'tokens') return '<div className="ds-surface" data-material="raised">공통 토큰을 사용하는 표면</div>';
    if (id === 'button') {
      const icon = o.icon || (o.iconOnly === 'true' ? 'search' : '');
      return `<Button variant="${o.variant}" size="${o.size}"${disabled}${o.state === 'loading' ? ' loading' : ''}${['hover','pressed','focus'].includes(o.state) ? ' data-state="'+o.state+'"' : ''}${o.iconOnly === 'true' ? ' data-icon-only="true" aria-label="계속하기"' : ''}>${icon ? '\n  '+jsxIcon(icon) : ''}${o.iconOnly === 'true' ? '' : (icon ? '\n  ' : '')+'계속하기'}${icon ? '\n' : ''}</Button>`;
    }
    if (id === 'input') return `<label className="ds-field" htmlFor="name">이름\n  <Input id="name" type="${o.type}" placeholder="입력해 주세요"${disabled} />\n</label>`;
    if (id === 'field') return `<Field label="컬렉션 이름" placeholder="이름을 입력하세요"${disabled}${o.state === 'error' ? ' error="이름을 입력해 주세요."' : ' help="'+(o.state === 'success' ? '사용할 수 있는 이름이에요.' : '나중에 바꿀 수 있어요.')+'"'}${o.state === 'success' ? ' state="success" defaultValue="봄의 기록"' : o.state === 'focus' ? ' state="focus"' : ''} />`;
    if (id === 'checkbox') return `<Checkbox${chosen}${disabled}${o.state === 'indeterminate' ? ' indeterminate' : ''}>링크로 공유</Checkbox>`;
    if (id === 'switch') return `<Switch${chosen}${disabled}>알림 받기</Switch>`;
    if (id === 'radio') return `<fieldset className="ds-radio-group">\n  <legend>공개 범위</legend>\n  <Radio name="visibility"${chosen}${disabled}>나만 보기</Radio>\n  <Radio name="visibility"${disabled}>링크로 공유</Radio>\n</fieldset>`;
    if (id === 'badge') return `<Badge tone="${o.tone}">${({success:'완료',warning:'확인 필요',error:'실패'})[o.tone] || '진행 중'}</Badge>`;
    if (id === 'card') return '<Card>\n  <CardBody>\n    <CardTitle>브랜드 리뉴얼</CardTitle>\n    <CardDescription>색과 서체, 첫인상을 모아 둔 컬렉션</CardDescription>\n  </CardBody>\n  <CardActions><Button variant="outline">선택하기</Button></CardActions>\n</Card>';
    if (id === 'bottom-nav') return `<BottomNav variant="${o.variant}" current="/" items={[\n  { href: "/", label: "홈" },\n  { href: "/search", label: "탐색" },\n  { href: "/saved", label: "저장" },\n  { href: "/settings", label: "설정" },\n]} />`;
    if (id === 'template') return '<Template title="컬렉션" count="3개">\n  <div className="ds-template-slot">검색·목록 모듈이 들어가는 자리</div>\n</Template>';
    return `<${names[id]} />`;
  }
  function source(id, options, environment) {
    const item = r.index.get(id);
    const blocks = [...new Set([...r.dependencies(id),item].flatMap(i=>i.css).filter(b=>b!=='tokens'))];
    const styles = ['fonts.css','base.css','styles/main.css',...blocks.map(b=>'css/'+b+'.css')];
    if (environment === 'react') {
      const imports = id === 'card' ? "import { Card, CardBody, CardTitle, CardDescription, CardActions } from './design/react/card.jsx';\nimport { Button } from './design/react/button.jsx';" : names[id] ? `import { ${names[id]} } from './design/react/${id}.jsx';` : '';
      return `'use client';\nimport React from 'react';\n${imports}\n${styles.map(s=>`import './design/${s}';`).join('\n')}\n\nexport default function Example() {\n  return (\n    <div className="ds" data-style="main">\n${jsx(id,options).split('\n').map(l=>'      '+l).join('\n')}\n    </div>\n  );\n}`;
    }
    const interactive = [item,...r.dependencies(id)].some(i=>i.behavior || i.id==='card');
    return `${styles.map(s=>'<link rel="stylesheet" href="design/'+s+'">').join('\n')}\n\n<div class="ds" data-style="main">\n  ${p.renderItem(id,'example',r.normalizeOptions(id,options))}\n</div>${interactive ? '\n\n<script src="design/html/behaviors.js"></script>' : ''}`;
  }
  function examples(id) {
    if (id === 'button') return [['채움',{variant:'primary'}],['윤곽',{variant:'outline'}],['글자',{variant:'ghost'}],['작게',{size:'sm'}],['크게',{size:'lg'}],['아이콘과 함께',{icon:'search'}],['아이콘만',{icon:'search',iconOnly:'true'}],['로딩',{state:'loading'}],['사용 불가',{state:'disabled'}]];
    const item = r.index.get(id);
    const control = item.controls.find(c=>['state','tone','variant','type'].includes(c.key));
    return control ? control.values.map(([value,label])=>[label,{[control.key]:value}]) : [];
  }
  const codeBlock = (id, options, environment) => `<div class="component-code"><button type="button" data-usage-copy aria-label="사용 코드 복사">복사</button><pre tabindex="0"><code>${e(source(id,options,environment))}</code></pre><p class="copy-status" role="status"></p></div>`;
  function page(state) {
    const item = r.index.get(state.detail), env = state.environment;
    const options = r.normalizeOptions(item.id, state.options);
    const index = r.items.indexOf(item);
    const adjacent = [[r.items[index-1],'이전'],[r.items[index+1],'다음']].filter(([i])=>i).map(([i,label])=>`<a href="${url(i.id)}" aria-label="${label}: ${i.name}">${label} · ${e(i.name)} ${p.icon('arrow')}</a>`).join('');
    const variants = examples(item.id);
    const sections = [['preview','미리보기'],['installation','설치'],...(variants.length?[['examples','예시']]:[]),['usage','사용 조건'],...(item.deps.length?[['dependencies','함께 쓰는 부품']]:[])];
    return `<article class="component-page" data-component="${item.id}" aria-labelledby="detail-title"><header class="component-heading"><a href="#/system?style=main">전체 부품 ${p.icon('arrow')}</a><h2 id="detail-title" tabindex="-1">${e(item.name)}</h2><p>${e(item.purpose)}</p></header><label class="component-mobile-nav"><span class="sr-only">부품 선택</span><select data-component-select>${r.items.map(i=>`<option value="${i.id}"${i.id===item.id?' selected':''}>${e(i.name)}</option>`).join('')}</select></label><div class="component-layout"><div class="system-inspector component-content"><section id="component-preview" aria-label="미리보기와 코드"><div class="component-toolbar"><div class="component-tabs" role="tablist" aria-label="미리보기와 코드">${[['preview','미리보기'],['code','코드']].map(([value,label])=>`<button type="button" role="tab" id="doc-tab-${value}" aria-controls="doc-panel-${value}" aria-selected="${state.previewTab===value}" tabindex="${state.previewTab===value?'0':'-1'}" data-doc-tab="${value}" data-focus="doc-tab-${value}">${label}</button>`).join('')}</div><label class="component-environment"><span class="sr-only">코드 환경</span><select data-doc-environment data-focus="doc-env"><option value="html"${env==='html'?' selected':''}>HTML</option><option value="react"${env==='react'?' selected':''}>React</option></select></label></div><div id="doc-panel-preview" role="tabpanel" aria-labelledby="doc-tab-preview"${state.previewTab!=='preview'?' hidden':''}><div class="part-demo" data-wide="${wide(item.id)}"><div class="ds theme-main" data-style="main">${p.renderItem(item.id,'component-live',options)}</div><p class="ds-demo-note" role="status"></p></div></div><div id="doc-panel-code" role="tabpanel" aria-labelledby="doc-tab-code"${state.previewTab!=='code'?' hidden':''}>${codeBlock(item.id,options,env)}</div><div class="inspector-options">${item.controls.map(c=>`<label>${e(c.label)}<select data-part-option="${c.key}" data-focus="option-${c.key}">${c.values.map(([value,label])=>`<option value="${value}"${options[c.key]===value?' selected':''}>${e(label)}</option>`).join('')}</select></label>`).join('')}</div><div class="component-download"><button type="button" class="secondary" data-system-download>${item.id==='icon'?'SVG 받기':'단독 HTML 받기'} ${p.icon('arrow')}</button><p class="export-status" role="status"></p></div><textarea id="part-source" hidden readonly>${e(window.Pattove.systemUI.itemMarkup(state))}</textarea></section><section id="component-installation" class="component-section"><h3>설치</h3>${window.Pattove.installUI.markup(item.id,state.style,options.icon,env)}</section>${variants.length?`<section id="component-examples" class="component-section"><h3>예시</h3><div class="component-examples">${variants.map(([label,provided],i)=>`<section class="component-example"><h4>${e(label)}</h4><div class="ds theme-main" data-style="main">${p.renderItem(item.id,'variant-'+i,r.normalizeOptions(item.id,provided))}</div><details><summary>코드 보기</summary>${codeBlock(item.id,provided,env)}</details></section>`).join('')}</div></section>`:''}<section id="component-usage" class="component-section"><h3>사용 조건</h3><p>${e(item.compatibility)}</p>${item.publicParts?.length?`<div class="component-parts">${item.publicParts.map(part=>`<code>${e(part.name)}</code>`).join('')}</div>`:''}${item.controls.length?`<div class="component-table"><table><thead><tr><th>조절할 값</th><th>선택</th></tr></thead><tbody>${item.controls.map(c=>`<tr><th>${e(c.label)}</th><td>${c.values.map(([value,label])=>`<span>${e(label)} <code>${e(value||'default')}</code></span>`).join('')}</td></tr>`).join('')}</tbody></table></div>`:''}${r.patterns.filter(pattern=>pattern.items.includes(item.id)).map(pattern=>`<ul>${pattern.rules.map(rule=>`<li>${e(rule)}</li>`).join('')}</ul>`).join('')}${item.entry?`<a class="component-text-link" href="#/dictionary?category=${item.entry.split('-')[0]}&detail=${item.entry}">사전에서 사용 맥락 보기 ${p.icon('arrow')}</a>`:''}</section>${item.deps.length?`<section id="component-dependencies" class="component-section"><h3>함께 쓰는 부품</h3><div class="part-dependencies">${item.deps.map(id=>`<a href="${url(id)}">${e(r.index.get(id).name)} ${p.icon('arrow')}</a>`).join('')}</div></section>`:''}<footer class="component-pagination">${adjacent}</footer></div><nav class="component-toc" aria-label="이 페이지에서">${sections.map(([id,label])=>`<a href="${url(item.id,{section:id})}" data-doc-section="${id}">${label}</a>`).join('')}</nav></div></article>`;
  }
  function refresh(state) {
    const root = document.querySelector('.component-page');
    if (!root) return;
    root.querySelector('#doc-panel-code').innerHTML = codeBlock(state.detail,state.options,state.environment);
  }
  document.addEventListener('click', async event => {
    const button=event.target.closest('[data-usage-copy]'); if(!button)return;
    const block=button.closest('.component-code'), code=block.querySelector('code'), status=block.querySelector('.copy-status');
    try { await navigator.clipboard.writeText(code.textContent); status.textContent='코드를 복사했어요.'; }
    catch { const range=document.createRange();range.selectNodeContents(code);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='선택한 코드를 복사해 주세요.'; }
  });
  window.Pattove.componentDocs = { page, source, refresh, url };
})();
