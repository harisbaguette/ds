(() => {
  const { motionData: data, parts } = window.Pattove;
  const e = parts.esc;
  const index = new Map(data.items.map(item => [item.id, item]));
  const costs = { low:'낮음', medium:'중간', high:'높음' };
  const targets = { html:'HTML', react:'React', next:'Next.js' };
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false, reduced = false, target = 'html', tab = 'ai', observed = new Set();
  const categoryName = id => data.categories.find(c => c.id === id)?.name || '전체 보기';
  const url = (values = {}) => '#/motion' + (Object.keys(values).length ? '?' + new URLSearchParams(values) : '');
  const matches = (item, query) => query.toLocaleLowerCase().trim().split(/\s+/).every(word => `${item.id} ${item.name} ${item.english} ${item.description} ${categoryName(item.category)} ${item.properties} ${item.trigger} HTML CSS React Next.js`.toLocaleLowerCase().includes(word));
  const matching = query => data.items.filter(item => matches(item, query || ''));
  const currentItems = state => matching(state.query).filter(item => !state.filters.category || state.filters.category === item.category);
  function filters(params) {
    const category = params.get('category');
    return { category:data.categories.some(c => c.id === category) ? category : '', sources:params.get('sources') === '1' ? '1' : '' };
  }
  function writeFilters(state, params) {
    if (state.filters.category) params.set('category', state.filters.category);
    if (state.filters.sources) params.set('sources', '1');
  }
  function subnavigation(state) {
    const active = index.get(state.detail)?.category || state.filters.category;
    const suffix = state.query ? { q:state.query } : {};
    return `<div class="nav-subnav" role="group" aria-label="모션 분류"><a class="nav-all ds-tab" href="${e(url(suffix))}" data-focus="motion-all"${!active && !state.filters.sources ? ' aria-current="page"' : ''}>전체 보기</a><div class="nav-subnav-scroll">${data.categories.map(c => `<a class="nav-subcategory ds-tab" href="${e(url({category:c.id,...suffix}))}" data-focus="motion-nav-${c.id}"${active === c.id && !state.filters.sources ? ' aria-current="true"' : ''}>${e(c.name)}</a>`).join('')}<a class="nav-subcategory ds-tab" href="${url({sources:'1'})}" data-focus="motion-sources"${state.filters.sources ? ' aria-current="true"' : ''}>외부 레퍼런스</a></div></div>`;
  }
  function markup(item, prefix = 'pm-' + item.id) {
    const pause = item.loop ? `<input class="pm-pause" type="checkbox" id="__ID__-pause"><label class="pm-pause-label" for="__ID__-pause">움직임 멈추기</label>` : '';
    return `<div class="pm-demo pm-example-${item.id}">${pause}${item.html}</div>`.replaceAll('__ID__', prefix);
  }
  const stopCSS = '.pm-demo *, .pm-demo *::before, .pm-demo *::after { animation:none !important; transition:none !important; }';
  function css(item) {
    return data.baseCSS + '\n' + item.css + '\n\n@media (prefers-reduced-motion: reduce) {\n' + stopCSS + '\n' + (item.reduceCSS || '') + '\n}\n';
  }
  // Parse the shared HTML into native JSX, including per-instance IDs. No HTML injection in React.
  function jsx(item) {
    const doc = new DOMParser().parseFromString(markup(item, '__ID__'), 'text/html');
    const names = { class:'className', for:'htmlFor', tabindex:'tabIndex', checked:'defaultChecked' };
    const voids = new Set(['input','br','hr','img']);
    function nodeText(node) {
      if (node.nodeType === Node.TEXT_NODE) return '{' + JSON.stringify(node.textContent) + '}';
      if (node.nodeType !== Node.ELEMENT_NODE) return '';
      const tagName = node.localName;
      const attrs = [...node.attributes].map(attr => {
        const name = names[attr.name] || attr.name;
        if (attr.name === 'checked') return ' defaultChecked';
        return ' ' + name + (attr.value.includes('__ID__') ? '={id + ' + JSON.stringify(attr.value.replace('__ID__', '')) + '}' : '=' + JSON.stringify(attr.value));
      }).join('');
      return '<' + tagName + attrs + (voids.has(tagName) ? ' />' : '>' + [...node.childNodes].map(nodeText).join('') + '</' + tagName + '>');
    }
    return `import React, { useId } from 'react';\nimport './motion-effect.css';\n\nexport default function MotionEffect() {\n  const id = useId();\n  return (\n    ${nodeText(doc.body.firstElementChild)}\n  );\n}\n`;
  }
  function files(item, environment = target) {
    if (environment === 'html') return [{path:'index.html', language:'html', content:documentHTML(item)}];
    return [
      {path:'MotionEffect.jsx', language:'jsx', content:(environment === 'next' ? "'use client';\n\n" : '') + jsx(item)},
      {path:'motion-effect.css', language:'css', content:css(item)},
      ...(environment === 'next' ? [{path:'app/page.jsx', language:'jsx', content:"import MotionEffect from '../MotionEffect';\n\nexport default function Page() {\n  return <main><MotionEffect /></main>;\n}\n"}] : [])
    ];
  }
  function documentHTML(item) {
    return `<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${e(item.name)}</title>\n<style>\n${css(item)}\n</style>\n</head>\n<body>\n${markup(item)}\n</body>\n</html>`;
  }
  function compatibility(item) {
    return item.experimental
      ? 'CSS view() 타임라인과 animation-range를 모두 지원하면 스크롤 연동. Chrome·Edge·Firefox·Safari에서 @supports로 기능을 감지하며 미지원 환경은 정적 카드를 표시합니다. 브라우저 버전별 표는 MDN을 확인하세요.'
      : 'Chrome·Edge·Firefox·Safari의 현대 CSS 환경 대상. CSS animations/transforms와 prefers-reduced-motion을 사용합니다. 특정 최소 버전을 보증하지 않으며 배포 대상 기기에서 확인하세요.';
  }
  function payload(item, environment = target) {
    return {
      schemaVersion:1, system:'Pattove', id:'motion/' + item.id, name:item.name, target:targets[environment],
      purpose:item.description, trigger:item.trigger, dependencies:environment === 'html' ? [] : ['react', ...(environment === 'next' ? ['next'] : [])],
      browserSupport:compatibility(item), fallback:item.experimental ? '기능 미지원 시 opacity:1, transform:none인 정적 콘텐츠.' : '애니메이션이 적용되지 않아도 본문과 기본 입력 조작을 유지.',
      rendering:{ estimate:costs[item.cost], measured:false, properties:item.properties, guidance:item.performance },
      reducedMotion:{ media:'(prefers-reduced-motion: reduce)', behavior:item.reduced, included:true },
      instructions:[
        '첨부 파일을 기준으로 구현하고 기존 프로젝트의 색·간격·글꼴 토큰에 연결하세요.',
        '텍스트·배치·초점·상태 의미를 유지하고 모션만 장식으로 사용하세요.',
        ...(item.loop ? ['예제의 일시정지 입력을 유지하세요. 화면 밖과 비활성 탭에서는 반복 모션을 중지하도록 소비 앱에서 연결하세요.'] : []),
        ...(environment === 'html' ? ['한 페이지에 여러 번 넣을 때 id와 radio name의 pm 접두사를 인스턴스마다 다르게 지정하세요.'] : ['useId를 유지해 여러 인스턴스의 입력 ID와 radio 그룹이 충돌하지 않게 하세요.']),
        ...(environment === 'next' ? ["MotionEffect.jsx는 useId를 사용하는 Client Component입니다. 'use client' 경계를 유지하고 app/page.jsx는 기존 페이지에 병합하세요."] : []),
        '실제 기기에서 프레임·페인트·레이아웃 이동을 측정하세요. 예상 비용을 벤치마크 결과로 취급하지 마세요.'
      ],
      acceptance:['키보드·터치 조작 가능', '움직임 줄이기 설정에서 내용과 상태 유지', '여러 인스턴스의 선택 상태 독립', '지원하지 않는 CSS에서도 핵심 내용 표시'],
      sources:[...new Set([data.docs.motion, data.docs.performance, ...(item.sources || []), ...(environment === 'next' ? [data.docs.next] : [])])],
      files:files(item, environment)
    };
  }
  const aiText = (item, environment = target) => '다음 모션을 프로젝트에 적용해 주세요. 코드와 접근성·성능 조건을 함께 지켜 주세요.\n\n' + JSON.stringify(payload(item, environment), null, 2);
  const sourceText = source => '다음 공식 레퍼런스를 확인해 프로젝트에 적합한 구현을 제안해 주세요.\n\n' + JSON.stringify({ name:source.name, url:source.url, documentation:source.evidence, stack:source.stack, delivery:source.delivery, caution:source.caution, requirements:['선택한 항목의 실제 코드·의존성·사용 조건 확인', 'HTML/React/Next.js 중 프로젝트 환경에 맞게 적용', '지원 브라우저·미지원 fallback 명시', '렌더링 비용은 근거와 측정 여부 표시', 'prefers-reduced-motion과 키보드 조작 포함'], status:'external-reference', codeIncluded:false }, null, 2);
  const badges = item => `<div class="motion-badges"><span>${e(item.trigger)}</span><span data-cost="${item.cost}">예상 비용 ${costs[item.cost]}</span>${item.experimental ? '<span>미지원 시 정적 표시</span>' : ''}</div>`;
  const frame = item => `<iframe class="motion-preview" data-motion-frame="${item.id}" title="${e(item.name)} 움직임 미리보기" sandbox="allow-same-origin" loading="lazy"></iframe>`;
  const targetControl = () => `<label class="motion-target">사용 환경 <select class="ds-input" data-motion-target>${Object.entries(targets).map(([id,name]) => `<option value="${id}"${target === id ? ' selected' : ''}>${name}</option>`).join('')}</select></label>`;
  const copyButton = id => `<button type="button" class="ds-button" data-variant="primary" data-size="sm" data-motion-copy="${id}">${window.Pattove.uiIcon('copy')}AI용 전체 복사</button>`;
  function controls() {
    return `<div class="motion-controls"><button type="button" class="ds-button" data-variant="outline" data-size="sm" data-motion-pause aria-pressed="${paused}">${paused ? '재생' : '일시정지'}</button><button type="button" class="ds-button" data-variant="outline" data-size="sm" data-motion-replay>다시 재생</button><button type="button" class="ds-button" data-variant="outline" data-size="sm" data-motion-reduce aria-pressed="${reduced || media.matches}"${media.matches ? ' disabled' : ''}>움직임 줄여 보기</button><span class="motion-system-note">${media.matches ? '시스템의 움직임 줄이기 적용 중' : ''}</span></div>`;
  }
  function collection(state) {
    if (state.filters.sources) return sourcePage(state);
    const items = currentItems(state);
    return `<section class="motion-library" aria-labelledby="page-title"><div class="motion-intro"><div><p>움직임을 보고, 구현 조건까지 한 번에 가져가세요.</p><p class="motion-muted">${items.length}개 · HTML · React · Next.js</p></div>${targetControl()}</div>${controls()}${items.length ? `<div class="motion-grid">${items.map(item => `<article class="motion-card ds-surface" data-material="raised">${frame(item,true)}<div class="motion-card-body"><span class="motion-kicker">${e(categoryName(item.category))} / ${e(item.english)}</span><h2><a href="${e(url({...(state.filters.category ? {category:state.filters.category} : {}), ...(state.query ? {q:state.query} : {}), detail:item.id}))}" data-focus="motion-card-${item.id}">${e(item.name)}</a></h2><p>${e(item.description)}</p>${badges(item)}<div class="motion-card-actions">${copyButton(item.id)}<a class="ds-button" data-variant="ghost" data-size="sm" href="${e(url({...(state.filters.category ? {category:state.filters.category} : {}), ...(state.query ? {q:state.query} : {}), detail:item.id}))}" aria-label="${e(item.name)} 코드와 상세 보기">코드 보기 ↗</a></div><span class="motion-copy-status" role="status"></span></div></article>`).join('')}</div>` : `<div class="empty-state ds-surface"><h2>검색 결과가 없어요</h2><a class="ds-button" data-variant="outline" href="#/motion">전체 보기</a></div>`}</section>`;
  }
  function sourcePage(state) {
    const sources = data.sources.filter(s => `${s.name} ${s.stack} ${s.description} ${s.delivery}`.toLowerCase().includes((state.query || '').toLowerCase()));
    return `<section class="motion-library" aria-labelledby="page-title"><p class="motion-intro">구현 코드와 AI 전달 방식을 살펴볼 수 있는 ${sources.length}개 레퍼런스입니다.</p><div class="motion-source-grid">${sources.map(source => `<article class="motion-source ds-surface"><span class="motion-kicker">${e(source.stack)}</span><h2><a href="${source.url}" target="_blank" rel="noopener noreferrer">${e(source.name)} ↗</a></h2><p>${e(source.description)}</p><dl><dt>가져오는 방법</dt><dd>${e(source.delivery)}</dd><dt>확인할 점</dt><dd>${e(source.caution)}</dd></dl><div class="motion-card-actions"><a href="${source.evidence}" target="_blank" rel="noopener noreferrer">공식 설명 ↗</a><button type="button" class="ds-button" data-variant="outline" data-size="sm" data-motion-source="${source.id}">AI용 조사 조건 복사</button></div><span class="motion-copy-status" role="status"></span></article>`).join('')}</div></section>`;
  }
  function codeContent(item) {
    if (tab === 'ai') return aiText(item);
    if (tab === 'css') return css(item);
    if (tab === 'html') return markup(item);
    return (tab === 'next' ? "'use client';\n\n" : '') + jsx(item);
  }
  function codePanel(item) {
    const tabs = {ai:'AI',html:'HTML',css:'CSS',react:'React',next:'Next.js'};
    return `<div class="motion-code-head"><div class="motion-tabs" role="tablist" aria-label="코드 형식">${Object.entries(tabs).map(([id,name]) => `<button type="button" role="tab" class="ds-tab" id="motion-tab-${id}" aria-controls="motion-code" aria-selected="${tab === id}" tabindex="${tab === id ? 0 : -1}" data-motion-tab="${id}">${name}</button>`).join('')}</div><button type="button" class="ds-button" data-variant="ghost" data-size="sm" data-motion-code-copy>현재 탭 복사</button></div><pre id="motion-code" role="tabpanel" aria-labelledby="motion-tab-${tab}" tabindex="0"><code>${e(codeContent(item))}</code></pre><span class="motion-copy-status" role="status"></span>`;
  }
  function detail(state) {
    const item = index.get(state.detail);
    return `<article class="motion-detail" data-motion-detail="${item.id}" aria-labelledby="detail-title"><header class="motion-detail-heading"><div><span class="motion-kicker">${e(item.english)}</span><h2 id="detail-title" tabindex="-1">${e(item.name)}</h2><p>${e(item.description)}</p></div><div class="motion-delivery">${targetControl()}${copyButton(item.id)}<span class="motion-copy-status" role="status"></span></div></header><div class="motion-detail-grid"><div>${frame(item)}${controls()}</div><aside class="motion-spec ds-surface" aria-label="구현 조건">${badges(item)}<dl><dt>지원 브라우저·대체 표현</dt><dd>${e(compatibility(item))}</dd><dt>렌더링 비용 · 속성 기반 추정</dt><dd>${e(item.performance)}<small>실측 FPS나 기기별 성능 보장이 아닙니다.</small></dd><dt>움직임 줄이기</dt><dd>${e(item.reduced)}</dd><dt>의존성</dt><dd>HTML은 외부 패키지 없음. React / Next.js는 해당 런타임만 사용.</dd></dl><a href="${item.sources?.[0] || data.docs.performance}" target="_blank" rel="noopener noreferrer">기술 근거 ↗</a></aside></div><div class="motion-export"><p>AI 탭에는 선택한 환경의 전체 파일과 구현 조건이 들어 있습니다.</p><button type="button" class="ds-button" data-variant="outline" data-size="sm" data-motion-download="${item.id}">단독 HTML 다운로드</button></div><section class="motion-code ds-surface" aria-label="구현 코드">${codePanel(item)}</section></article>`;
  }
  function header(state) {
    const item = index.get(state.detail);
    return item ? `<h1 id="page-title" class="sr-only">${e(item.name)}</h1><nav class="content-breadcrumb" aria-label="현재 위치"><a href="${e(url({...(state.filters.category ? {category:state.filters.category} : {}), ...(state.query ? {q:state.query} : {})}))}" data-focus="motion-back">모션</a>${window.Pattove.uiIcon('chevron')}<span aria-current="page">${e(item.name)}</span></nav>` : `<h1 id="page-title" class="collection-title">${state.filters.sources ? '외부 레퍼런스' : e(categoryName(state.filters.category) === '전체 보기' ? '모션' : categoryName(state.filters.category))}</h1>`;
  }
  function syncFrame(frame) {
    const root = frame.contentDocument?.documentElement;
    if (!root) return;
    const offscreen = frame.dataset.visible !== 'true';
    root.toggleAttribute('data-paused', paused || document.hidden || offscreen);
    root.toggleAttribute('data-reduced', reduced || media.matches);
  }
  const observer = new IntersectionObserver(entries => entries.forEach(({target:frame,isIntersecting}) => { frame.dataset.visible = String(isIntersecting); syncFrame(frame); }));
  function hydrate() {
    for (const frame of observed) if (!frame.isConnected) { observer.unobserve(frame); observed.delete(frame); }
    document.querySelectorAll('[data-motion-frame]').forEach(frame => {
      if (observed.has(frame)) { syncFrame(frame); return; }
      const item = index.get(frame.dataset.motionFrame);
      // Scripts are disallowed by the sandbox. Only locally authored HTML/CSS enters srcdoc.
      const previewCSS = 'html,body { margin:0; background:#111e26; } .pm-demo { border-radius:0; }\nhtml[data-paused] *,html[data-paused] *::before,html[data-paused] *::after { animation-play-state:paused !important; transition:none !important; }\n' +
        'html[data-reduced] { ' + stopCSS + '\n' + (item.reduceCSS || '') + ' }';
      frame.srcdoc = documentHTML(item).replace('<html lang="ko">', `<html lang="ko" data-paused${reduced || media.matches ? ' data-reduced' : ''}>`).replace('</style>', previewCSS + '\n</style>');
      frame.addEventListener('load', () => syncFrame(frame));
      observed.add(frame); observer.observe(frame);
    });
  }
  function updateControls() {
    document.querySelectorAll('[data-motion-pause]').forEach(button => { button.setAttribute('aria-pressed', String(paused)); button.textContent = paused ? '재생' : '일시정지'; });
    document.querySelectorAll('[data-motion-reduce]').forEach(button => { button.setAttribute('aria-pressed', String(reduced || media.matches)); button.disabled = media.matches; });
    document.querySelectorAll('.motion-system-note').forEach(node => { node.textContent = media.matches ? '시스템의 움직임 줄이기 적용 중' : ''; });
    observed.forEach(syncFrame);
  }
  function refreshCode(focusTab = false) {
    const article = document.querySelector('[data-motion-detail]');
    if (!article) return;
    article.querySelector('.motion-code').innerHTML = codePanel(index.get(article.dataset.motionDetail));
    if (focusTab) article.querySelector('[data-motion-tab="' + tab + '"]').focus();
  }
  async function copy(value, button) {
    if (button.getAttribute('aria-busy') === 'true') return;
    const status = button.closest('.motion-card-body,.motion-source,.motion-delivery,.motion-code')?.querySelector('.motion-copy-status');
    button.setAttribute('aria-busy','true');
    try {
      await navigator.clipboard.writeText(value);
      if (status) status.textContent = '복사됨 · AI에게 붙여 넣으세요';
    } catch {
      const dialog = document.getElementById('reference-dialog'), area = dialog.querySelector('textarea');
      area.value = value;
      dialog.addEventListener('close', () => { if (button.isConnected) button.focus({preventScroll:true}); }, {once:true});
      if (!dialog.open) dialog.showModal();
      area.focus(); area.select();
    } finally { button.removeAttribute('aria-busy'); }
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    if (button.hasAttribute('data-motion-pause')) { paused = !paused; updateControls(); }
    if (button.hasAttribute('data-motion-reduce')) { reduced = !reduced; updateControls(); }
    if (button.hasAttribute('data-motion-replay')) {
      paused = false;
      observed.forEach(frame => { observer.unobserve(frame); }); observed.clear(); hydrate(); updateControls();
    }
    if (button.dataset.motionTab) { tab = button.dataset.motionTab; refreshCode(true); }
    if (button.dataset.motionCopy) copy(aiText(index.get(button.dataset.motionCopy)),button);
    if (button.dataset.motionSource) copy(sourceText(data.sources.find(s => s.id === button.dataset.motionSource)),button);
    if (button.hasAttribute('data-motion-code-copy')) copy(codeContent(index.get(button.closest('[data-motion-detail]').dataset.motionDetail)),button);
    if (button.dataset.motionDownload) {
      const item = index.get(button.dataset.motionDownload), blob = new Blob([documentHTML(item)],{type:'text/html;charset=utf-8'});
      const href = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = href; a.download = 'pattove-' + item.id + '.html'; a.click(); setTimeout(() => URL.revokeObjectURL(href),1000);
    }
  });
  document.addEventListener('change', event => {
    if (!event.target.matches('[data-motion-target]')) return;
    target = event.target.value;
    document.querySelectorAll('[data-motion-target]').forEach(select => { select.value = target; });
    refreshCode();
  });
  document.addEventListener('keydown', event => {
    if (!event.target.matches('[data-motion-tab]')) return;
    const tabs = ['ai','html','css','react','next'];
    let next = tabs.indexOf(tab);
    if (event.key === 'ArrowRight') next = (next + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (next + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault(); tab = tabs[next]; refreshCode(true);
  });
  media.addEventListener('change',updateControls);
  document.addEventListener('visibilitychange',updateControls);
  window.Pattove.motionUI = { index, filters, writeFilters, subnavigation, matching, currentItems, collection, detail, header, hydrate, payload, files, documentHTML, css, markup, aiText };
})();
