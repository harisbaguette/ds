(() => {
  const { motionData: data, parts } = window.Pattove;
  const e = parts.esc;
  const index = new Map(data.items.map(item => [item.id, item]));
  const costs = { low:'낮음', medium:'중간', high:'높음' };
  const targets = { html:'HTML', react:'React', next:'Next.js' };
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = false, target = 'html', observed = new Set();
  const pausedItems = new Set();
  const categoryName = id => data.categories.find(c => c.id === id)?.name || '전체 보기';
  const url = (values = {}) => '#/motion' + (Object.keys(values).length ? '?' + new URLSearchParams(values) : '');
  const matches = (item, query) => query.toLocaleLowerCase().trim().split(/\s+/).every(word => `${item.id} ${item.name} ${item.english} ${(item.aliases || []).join(' ')} ${(item.dictionaryRefs || []).join(' ')} ${item.description} ${categoryName(item.category)} ${item.properties} ${item.trigger} HTML CSS React Next.js`.toLocaleLowerCase().includes(word));
  const matching = query => data.items.filter(item => matches(item, query || ''));
  const currentItems = state => matching(state.query).filter(item => !state.filters.category || state.filters.category === item.category);
  const pageCount = () => 1;
  const listParams = state => ({...(state.filters.category ? {category:state.filters.category} : {}), ...(state.query ? {q:state.query} : {})});
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
    return `<div class="nav-subnav" role="group" aria-label="모션 분류"><a class="nav-all ds-tab" href="${e(url(suffix))}" data-focus="motion-all"${!active && !state.filters.sources ? ' aria-current="true"' : ''}>전체 보기</a><div class="nav-subnav-scroll">${data.categories.map(c => `<a class="nav-subcategory ds-tab" href="${e(url({category:c.id,...suffix}))}" data-focus="motion-nav-${c.id}"${active === c.id && !state.filters.sources ? ' aria-current="true"' : ''}>${e(c.name)}</a>`).join('')}<a class="nav-subcategory ds-tab" href="${url({sources:'1'})}" data-focus="motion-sources"${state.filters.sources ? ' aria-current="true"' : ''}>외부 레퍼런스</a></div></div>`;
  }
  function markup(item, prefix = 'pm-' + item.id) {
    const pause = item.loop ? `<input class="pm-pause" type="checkbox" id="__ID__-pause"><label class="pm-pause-label" for="__ID__-pause">움직임 멈추기</label>` : '';
    return `<div class="pm-demo pm-example-${item.id}">${pause}${item.html}</div>`.replaceAll('__ID__', prefix);
  }
  const stopCSS = '.pm-demo *, .pm-demo *::before, .pm-demo *::after { animation:none !important; transition:none !important; }';
  function css(item) {
    return data.baseCSS + '\n' + item.css + '\n\n@media (prefers-reduced-motion: reduce) {\n' + stopCSS + '\n' + (item.reduceCSS || '') + '\n}\nhtml[data-reduced] {\n' + stopCSS + '\n' + (item.reduceCSS || '') + '\n}\n';
  }
  // Parse the shared HTML into native JSX, including per-instance IDs. No HTML injection in React.
  function jsx(item) {
    const doc = new DOMParser().parseFromString(markup(item, '__ID__'), 'text/html');
    const names = { class:'className', for:'htmlFor', tabindex:'tabIndex', checked:'defaultChecked', 'stroke-width':'strokeWidth', 'stroke-linecap':'strokeLinecap', 'stroke-linejoin':'strokeLinejoin' };
    const voids = new Set(['input','br','hr','img']);
    function nodeText(node) {
      if (node.nodeType === Node.TEXT_NODE) return '{' + JSON.stringify(node.textContent) + '}';
      if (node.nodeType !== Node.ELEMENT_NODE) return '';
      const tagName = node.localName;
      const attrs = [...node.attributes].map(attr => {
        const name = names[attr.name] || attr.name;
        if (attr.name === 'checked') return ' defaultChecked';
        if (['hidden','inert','disabled','multiple','required'].includes(attr.name)) return ' ' + name;
        return ' ' + name + (attr.value.includes('__ID__') ? '={id + ' + JSON.stringify(attr.value.replace('__ID__', '')) + '}' : '=' + JSON.stringify(attr.value));
      }).join('');
      return '<' + tagName + attrs + (item.behavior && node === doc.body.firstElementChild ? ' ref={root}' : '') + (voids.has(tagName) ? ' />' : '>' + [...node.childNodes].map(nodeText).join('') + '</' + tagName + '>');
    }
    const body = nodeText(doc.body.firstElementChild), ids = body.includes('{id + ');
    const hooks = [...(ids ? ['useId'] : []), ...(item.behavior ? ['useEffect','useRef'] : [])];
    return `import React${hooks.length ? ', { ' + hooks.join(', ') + ' }' : ''} from 'react';\n${item.behavior ? "import { mountMotion } from './motion-runtime.js';\n" : ''}import './motion-effect.css';\n\nexport default function MotionEffect() {\n${ids ? '  const id = useId();\n' : ''}${item.behavior ? `  const root = useRef(null);\n  useEffect(() => {\n    const runtime = mountMotion(root.current, ${JSON.stringify(item.behavior)});\n    return () => runtime.destroy();\n  }, []);\n` : ''}  return (\n    ${body}\n  );\n}\n`;
  }
  function files(item, environment = target) {
    if (environment === 'html') return [{path:'index.html', language:'html', content:documentHTML(item)}];
    return [
      {path:'MotionEffect.jsx', language:'jsx', content:(environment === 'next' ? "'use client';\n\n" : '') + jsx(item)},
      {path:'motion-effect.css', language:'css', content:css(item)},
      ...(item.behavior ? [{path:'motion-runtime.js', language:'javascript', content:'export ' + window.Pattove.mountMotion.toString() + '\n'}] : []),
      ...(environment === 'next' ? [{path:'app/page.jsx', language:'jsx', content:"import MotionEffect from '../MotionEffect';\n\nexport default function Page() {\n  return <main><MotionEffect /></main>;\n}\n"}] : [])
    ];
  }
  const fileComment = file => file.language === 'css' ? `/* ${file.path} */` : file.language === 'html' ? `<!-- ${file.path} -->` : `// ${file.path}`;
  function codeText(item, environment = target) {
    const list = files(item, environment);
    return list.length === 1 ? list[0].content : list.map(file => fileComment(file) + '\n' + file.content.trimEnd()).join('\n\n') + '\n';
  }
  // A reference preview repeats short entrances after a readable hold. Exported effects still run once.
  function repeatPreview(root) {
    const doc = root.ownerDocument, win = doc.defaultView;
    const media = win.matchMedia('(prefers-reduced-motion: reduce)');
    let timer = 0, active = false;
    const watched = new WeakMap();
    const animations = () => root.getAnimations({subtree:true}).filter(animation =>
      animation.animationName && Number.isFinite(animation.effect.getComputedTiming().endTime));
    const finished = animation => animation.playState === 'finished' || animation.currentTime >= animation.effect.getComputedTiming().endTime;
    const canRun = () => !doc.hidden && !media.matches && !doc.documentElement.hasAttribute('data-paused') && !doc.documentElement.hasAttribute('data-reduced');
    function watch(animation) {
      const promise = animation.finished;
      if (watched.get(animation) === promise) return;
      watched.set(animation, promise);
      promise.then(schedule).catch(() => {});
    }
    function schedule() {
      win.clearTimeout(timer); timer = 0;
      const list = animations();
      if (!canRun() || !list.length || !list.every(finished)) return;
      timer = win.setTimeout(() => {
        timer = 0;
        if (canRun()) for (const animation of animations()) {
          animation.pause(); animation.currentTime = 0; animation.play(); watch(animation);
        }
      }, 1400);
    }
    function sync() {
      const playing = canRun();
      for (const animation of animations()) {
        if (playing) {
          if (!active && finished(animation)) { animation.pause(); animation.currentTime = 0; }
          if (animation.playState === 'paused') animation.play();
        } else {
          // Pin the hold time even when an offscreen frame cannot process a pending pause.
          const time = animation.currentTime;
          animation.pause(); animation.currentTime = time;
        }
        watch(animation);
      }
      active = playing;
      schedule();
    }
    const observer = new win.MutationObserver(sync);
    observer.observe(doc.documentElement, {attributes:true, attributeFilter:['data-paused','data-reduced']});
    media.addEventListener('change', sync);
    doc.addEventListener('visibilitychange', sync);
    win.addEventListener('pagehide', event => { if (!event.persisted) { win.clearTimeout(timer); observer.disconnect(); } });
    sync();
  }
  function documentHTML(item, preview = false) {
    const setup = item.behavior ? `${window.Pattove.mountMotion.toString()}\nconst runtime = mountMotion(document.currentScript.previousElementSibling, ${JSON.stringify(item.behavior)});\nwindow.addEventListener('pagehide', event => { if (!event.persisted) runtime.destroy(); });` : '';
    const bridge = preview ? `${item.previewRepeat ? `(${repeatPreview.toString()})(document.currentScript.previousElementSibling);\n` : ''}window.addEventListener('message', event => {
  if (event.source !== parent || event.data?.type !== 'pattove:motion-playback') return;
  document.documentElement.toggleAttribute('data-paused', event.data.paused === true);
  document.documentElement.toggleAttribute('data-reduced', event.data.reduced === true);
});
parent.postMessage({type:'pattove:motion-ready'}, '*');` : '';
    const script = setup || bridge ? `<script>\n(() => {\n${setup}\n${bridge}\n})();\n<\/script>` : '';
    return `<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${e(item.name)}</title>\n<style>\n${css(item)}\n</style>\n</head>\n<body>\n${markup(item)}\n${script}\n</body>\n</html>`;
  }
  function compatibility(item) {
    if (item.behavior) return '현대 브라우저의 JavaScript·DOM·IntersectionObserver·ResizeObserver 대상. 전환에는 Web Animations API를 사용하고 미지원 시 이동을 생략합니다. 대화상자 예제는 네이티브 dialog, 드래그 예제는 Pointer Events가 필요합니다. 경로 이동은 offset-path 지원을 감지하고 미지원 시 정지한 점과 경로를 표시합니다.';
    return item.experimental
      ? 'CSS view() 타임라인과 animation-range를 모두 지원하면 스크롤 연동. Chrome·Edge·Firefox·Safari에서 @supports로 기능을 감지하며 미지원 환경은 정적 카드를 표시합니다. 브라우저 버전별 표는 MDN을 확인하세요.'
      : 'Chrome·Edge·Firefox·Safari의 현대 CSS 환경 대상. CSS animations/transforms와 prefers-reduced-motion을 사용합니다. 특정 최소 버전을 보증하지 않으며 배포 대상 기기에서 확인하세요.';
  }
  function payload(item, environment = target) {
    return {
      schemaVersion:1, system:'Pattove', id:'motion/' + item.id, name:item.name, target:targets[environment],
      dictionaryRefs:item.dictionaryRefs || [], aliases:item.aliases || [],
      runtime:item.behavior ? {type:'native-javascript', lifecycle:'mountMotion(root, behavior) → destroy()', externalDependencies:[]} : {type:'css'},
      purpose:item.description, trigger:item.trigger, dependencies:environment === 'html' ? [] : ['react', ...(environment === 'next' ? ['next'] : [])],
      browserSupport:compatibility(item), fallback:item.experimental ? '기능 미지원 시 opacity:1, transform:none인 정적 콘텐츠.' : '애니메이션이 적용되지 않아도 본문과 기본 입력 조작을 유지.',
      rendering:{ estimate:costs[item.cost], measured:false, properties:item.properties, guidance:item.performance },
      reducedMotion:{ media:'(prefers-reduced-motion: reduce)', behavior:item.reduced, included:true },
      instructions:[
        '첨부 파일을 기준으로 구현하고 기존 프로젝트의 색·간격·글꼴 토큰에 연결하세요.',
        '텍스트·배치·초점·상태 의미를 유지하고 모션만 장식으로 사용하세요.',
        ...(item.loop ? ['예제의 일시정지 입력을 유지하세요. 화면 밖과 비활성 탭에서는 반복 모션을 중지하도록 소비 앱에서 연결하세요.'] : []),
        ...(environment === 'html' ? ['한 페이지에 여러 번 넣을 때 id와 radio name의 pm 접두사를 인스턴스마다 다르게 지정하세요.'] : item.html.includes('__ID__') ? ['useId를 유지해 여러 인스턴스의 입력 ID와 radio 그룹이 충돌하지 않게 하세요.'] : []),
        ...(item.behavior ? ['실행 코드와 초기화·해제 동작을 함께 유지하세요. 요청·저장 예제는 실제 서비스의 상태와 연결하세요.'] : []),
        ...(environment === 'next' ? ["MotionEffect.jsx의 'use client' 경계를 유지하고 app/page.jsx는 기존 페이지에 병합하세요."] : []),
        '실제 기기에서 프레임·페인트·레이아웃 이동을 측정하세요. 예상 비용을 벤치마크 결과로 취급하지 마세요.'
      ],
      acceptance:['키보드·터치 조작 가능', '움직임 줄이기 설정에서 내용과 상태 유지', '여러 인스턴스의 선택 상태 독립', '지원하지 않는 CSS에서도 핵심 내용 표시'],
      sources:[...new Set([data.docs.motion, data.docs.performance, ...(item.sources || []), ...(environment === 'next' ? [data.docs.next] : [])])],
      files:files(item, environment)
    };
  }
  const aiText = (item, environment = target) => '다음 모션을 프로젝트에 적용해 주세요. 코드와 접근성·성능 조건을 함께 지켜 주세요.\n\n' + JSON.stringify(payload(item, environment), null, 2);
  const sourceText = source => '다음 공식 레퍼런스를 확인해 프로젝트에 적합한 구현을 제안해 주세요.\n\n' + JSON.stringify({ name:source.name, url:source.url, documentation:source.evidence, stack:source.stack, delivery:source.delivery, caution:source.caution, requirements:['선택한 항목의 실제 코드·의존성·사용 조건 확인', 'HTML/React/Next.js 중 프로젝트 환경에 맞게 적용', '지원 브라우저·미지원 fallback 명시', '렌더링 비용은 근거와 측정 여부 표시', 'prefers-reduced-motion과 키보드 조작 포함'], status:'external-reference', codeIncluded:false }, null, 2);
  const frame = (item, thumbnail=false) => `<iframe class="motion-preview" data-motion-frame="${item.id}"${thumbnail ? ' data-motion-thumbnail tabindex="-1"' : ''} title="${e(item.name)} 움직임 미리보기" sandbox="allow-scripts" loading="lazy"></iframe>`;
  const targetControl = () => `<label class="motion-target"><span>사용 환경</span><select class="ds-input" data-motion-target>${Object.entries(targets).map(([id,name]) => `<option value="${id}"${target === id ? ' selected' : ''}>${name}</option>`).join('')}</select></label>`;
  const copyButton = id => `<button type="button" class="ds-button" data-variant="outline" data-size="sm" data-motion-copy="${id}" aria-label="${e(index.get(id).name)} ${targets[target]} AI용 전체 정보 복사">${window.Pattove.uiIcon('copy')}<span data-motion-copy-label>AI용 정보 복사</span></button>`;
  const codeCopyButton = id => `<button type="button" class="ds-button" data-variant="primary" data-size="sm" data-motion-code-copy="${id}" aria-label="${e(index.get(id).name)} ${targets[target]} 코드 복사">${window.Pattove.uiIcon('copy')}<span data-motion-copy-label>코드 복사</span></button>`;
  const pauseLabel = id => `<span class="motion-play-icon" aria-hidden="true" data-playing="${!pausedItems.has(id)}"></span><span>${pausedItems.has(id) ? '재생' : '일시정지'}</span>`;
  const reduceControl = () => `<button type="button" class="ds-button" data-variant="outline" data-size="sm" data-motion-reduce aria-pressed="${reduced || media.matches}"${media.matches ? ' disabled' : ''}>움직임 줄여 보기</button><span class="motion-system-note">${media.matches ? '시스템의 움직임 줄이기 적용 중' : ''}</span>`;
  function controls(id) {
    return `<div class="motion-controls motion-playback"><button type="button" class="ds-button" data-variant="outline" data-size="sm" data-motion-pause="${id}">${pauseLabel(id)}</button><button type="button" class="ds-button" data-variant="outline" data-size="sm" data-motion-replay><span class="motion-replay-icon" aria-hidden="true">↻</span>다시 재생</button>${reduceControl()}</div>`;
  }
  const allPaused = () => data.items.every(item => pausedItems.has(item.id));
  const globalLabel = () => `<span class="motion-play-icon" aria-hidden="true" data-playing="${!allPaused()}"></span>${allPaused() ? '전체 재생' : '전체 멈춤'}`;
  function collectionControls() {
    return `<div class="motion-list-tools">${targetControl()}<button type="button" class="motion-global-pause" data-motion-global data-focus="motion-global">${globalLabel()}</button><details class="motion-more"><summary aria-label="모션 재생 설정" title="모션 재생 설정">···</summary><div class="motion-more-menu"><button type="button" class="motion-mobile-global" data-motion-global>${globalLabel()}</button><button type="button" data-motion-replay>전체 다시 재생</button>${reduceControl()}</div></details></div>`;
  }
  function collection(state) {
    if (state.filters.sources) return sourcePage(state);
    const items = currentItems(state);
    const cards = items.map(item => `<article class="motion-card"><div class="motion-card-preview">${frame(item,true)}<button type="button" class="motion-item-pause" data-motion-item-pause="${item.id}" aria-label="${e(item.name)} ${pausedItems.has(item.id) ? '재생' : '일시정지'}"><span class="motion-play-icon" aria-hidden="true" data-playing="${!pausedItems.has(item.id)}"></span></button></div><div class="motion-card-body"><h2><a href="${e(url({...listParams(state),detail:item.id}))}" data-motion-open data-focus="motion-card-${item.id}" aria-label="${e(item.name)} 상세 보기">${e(item.name)}</a></h2><button type="button" class="motion-card-copy" data-motion-copy="${item.id}" aria-label="${e(item.name)} ${targets[target]} AI용 전체 정보 복사" title="${e(item.name)} · ${targets[target]} AI용 정보 복사">${window.Pattove.uiIcon('copy','motion-copy-icon')}${window.Pattove.uiIcon('check','motion-check-icon')}<span class="sr-only" data-motion-copy-label>복사</span></button><span class="motion-copy-status" role="status"></span></div></article>`).join('');
    return `<section class="motion-library" aria-labelledby="page-title">${items.length ? `<div class="motion-grid">${cards}</div>` : window.Pattove.views.emptyState(state)}</section>`;
  }
  function sourcePage(state) {
    const sources = data.sources.filter(s => `${s.name} ${s.stack} ${s.description} ${s.delivery}`.toLowerCase().includes((state.query || '').toLowerCase()));
    if(!sources.length)return `<section class="motion-library" aria-labelledby="page-title">${window.Pattove.views.emptyState(state)}</section>`;
    return `<section class="motion-library" aria-labelledby="page-title"><p class="motion-intro">구현 코드와 AI 전달 방식을 살펴볼 수 있는 ${sources.length}개 레퍼런스입니다.</p><div class="motion-source-grid">${sources.map(source => `<article class="motion-source ds-surface"><span class="motion-kicker">${e(source.stack)}</span><h2><a href="${source.url}" target="_blank" rel="noopener noreferrer">${e(source.name)} ↗</a></h2><p>${e(source.description)}</p><dl><dt>가져오는 방법</dt><dd>${e(source.delivery)}</dd><dt>확인할 점</dt><dd>${e(source.caution)}</dd></dl><div class="motion-card-actions"><a href="${source.evidence}" target="_blank" rel="noopener noreferrer">공식 설명 ↗</a><button type="button" class="ds-button" data-variant="outline" data-size="sm" data-motion-source="${source.id}">AI용 조사 조건 복사</button></div><span class="motion-copy-status" role="status"></span></article>`).join('')}</div></section>`;
  }
  function dictionaryLinks(item) {
    return `<nav class="motion-related" aria-label="관련 사전">${(item.dictionaryRefs || []).map(id => {
      const entry = window.Pattove.library.entries.find(entry => entry.id === id);
      if (!entry) return '';
      const name = entry.term.split(' (')[0];
      return `<a href="${e(window.Pattove.references.payload(id).url)}">${e(name)}</a>`;
    }).join('')}</nav>`;
  }
  function detail(state) {
    const item = index.get(state.detail);
    const back = `<a class="mobile-detail-back" href="${e(url(listParams(state)))}" data-action="back-to-motion" data-focus="mobile-back" aria-label="${history.state?.pattoveSearchDetail ? '이전 화면으로 돌아가기' : '모션 목록으로 돌아가기'}">${window.Pattove.uiIcon('chevron-left')}</a>`;
    return `<article class="motion-detail" data-motion-detail="${item.id}" aria-labelledby="detail-title"><header class="motion-detail-heading">${back}<div><span class="motion-kicker">${e(item.english)}</span><h2 id="detail-title" tabindex="-1">${e(item.name)}</h2><p>${e(item.description)}</p>${dictionaryLinks(item)}</div></header><div class="motion-detail-grid"><div class="motion-stage">${frame(item)}${controls(item.id)}</div><div class="motion-delivery">${targetControl()}<div class="ds-confirm-row motion-copy-actions">${codeCopyButton(item.id)}${copyButton(item.id)}</div><span class="motion-copy-status" role="status"></span></div></div></article>`;
  }
  function header(state) {
    const item = index.get(state.detail);
    return item ? `<h1 id="page-title" class="sr-only">${e(item.name)}</h1><nav class="content-breadcrumb" aria-label="현재 위치"><a href="${e(url(listParams(state)))}" data-action="back-to-motion" data-focus="motion-back">모션</a>${window.Pattove.uiIcon('chevron')}<span aria-current="page">${e(item.name)}</span></nav>` : `<h1 id="page-title" class="collection-title">${state.filters.sources ? '외부 레퍼런스' : e(categoryName(state.filters.category) === '전체 보기' ? '모션' : categoryName(state.filters.category))}</h1>${state.filters.sources?'':`<span class="collection-count">${currentItems(state).length}</span>`}`;
  }
  function syncFrame(frame) {
    frame.contentWindow?.postMessage({type:'pattove:motion-playback',
      paused:pausedItems.has(frame.dataset.motionFrame) || document.hidden || frame.dataset.visible !== 'true',
      reduced:reduced || media.matches
    }, '*');
  }
  window.addEventListener('message', event => {
    if (event.data?.type !== 'pattove:motion-ready') return;
    const frame = [...observed].find(frame => frame.contentWindow === event.source);
    if (!frame) return;
    frame.dataset.motionReady = 'true';
    syncFrame(frame);
  });
  const observer = new IntersectionObserver(entries => entries.forEach(({target:frame,isIntersecting}) => { frame.dataset.visible = String(isIntersecting); syncFrame(frame); }));
  function hydrate() {
    for (const frame of observed) if (!frame.isConnected) { observer.unobserve(frame); observed.delete(frame); }
    document.querySelectorAll('[data-motion-frame]').forEach(frame => {
      if (observed.has(frame)) { syncFrame(frame); return; }
      const item = index.get(frame.dataset.motionFrame);
      // Locally authored code runs in an opaque-origin sandbox; only playback flags cross the boundary.
      const previewCSS = (data.stageCSS || '') + '\nhtml,body { margin:0; background:var(--p-surface, #f1f3f6); } .pm-demo { border-radius:0; min-height:100vh; } .pm-demo .pm-stage { min-height:calc(100vh - 48px); }\nhtml[data-paused] *,html[data-paused] *::before,html[data-paused] *::after { animation-play-state:paused !important; transition:none !important; }\n' + (frame.hasAttribute('data-motion-thumbnail') ? '.pm-pause,.pm-pause-label {display:none;}\n' : '') +
        'html[data-reduced] { ' + stopCSS + '\n' + (item.reduceCSS || '') + ' }';
      delete frame.dataset.motionReady;
      frame.onload = () => syncFrame(frame);
      frame.srcdoc = documentHTML(item, true).replace('<html lang="ko">', `<html lang="ko" data-paused${reduced || media.matches ? ' data-reduced' : ''}>`).replace('</style>', previewCSS + '\n</style>');
      observed.add(frame); observer.observe(frame);
    });
    updateControls();
  }
  function updateControls() {
    document.querySelectorAll('[data-motion-pause]').forEach(button => { button.innerHTML = pauseLabel(button.dataset.motionPause); button.disabled = reduced || media.matches; });
    document.querySelectorAll('[data-motion-global]').forEach(button => { button.innerHTML = globalLabel(); button.disabled = reduced || media.matches; });
    document.querySelectorAll('[data-motion-item-pause]').forEach(button => {
      const id = button.dataset.motionItemPause, paused = pausedItems.has(id);
      button.querySelector('.motion-play-icon').dataset.playing = String(!paused);
      button.setAttribute('aria-label', `${index.get(id).name} ${paused ? '재생' : '일시정지'}`);
      button.disabled = reduced || media.matches;
    });
    document.querySelectorAll('[data-motion-reduce]').forEach(button => { button.setAttribute('aria-pressed', String(reduced || media.matches)); button.disabled = media.matches; });
    document.querySelectorAll('.motion-system-note').forEach(node => { node.textContent = media.matches ? '시스템의 움직임 줄이기 적용 중' : ''; });
    observed.forEach(syncFrame);
  }
  const feedback = new WeakMap();
  async function copy(value, button) {
    if (button.getAttribute('aria-busy') === 'true') return;
    const status = button.closest('.motion-card-body,.motion-source,.motion-delivery')?.querySelector('.motion-copy-status');
    const copyTarget=target;
    button.setAttribute('aria-busy','true');
    try {
      await navigator.clipboard.writeText(value);
      if(!button.isConnected||copyTarget!==target)return;
      if(button.dataset.motionCopy)window.Pattove.searchUI?.remember('motion/'+button.dataset.motionCopy);
      if (status) status.textContent = button.dataset.motionCodeCopy ? `${targets[copyTarget]} 코드 복사됨` : '복사됨 · AI에게 붙여 넣으세요';
      const label = button.querySelector('[data-motion-copy-label]');
      if (label) {
        clearTimeout(feedback.get(button));
        label.dataset.original ||= label.textContent;
        label.textContent = '복사됨';
        button.setAttribute('data-copied','');
        feedback.set(button,setTimeout(() => { label.textContent=label.dataset.original; button.removeAttribute('data-copied'); if(status) status.textContent=''; },2400));
      }
    } catch {
      if(!button.isConnected||copyTarget!==target)return;
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
    const pauseId = button.dataset.motionPause || button.dataset.motionItemPause;
    if (pauseId) { pausedItems.has(pauseId) ? pausedItems.delete(pauseId) : pausedItems.add(pauseId); updateControls(); }
    if (button.hasAttribute('data-motion-global')) { const resume = allPaused(); data.items.forEach(item => resume ? pausedItems.delete(item.id) : pausedItems.add(item.id)); updateControls(); }
    if (button.hasAttribute('data-motion-reduce')) { reduced = !reduced; updateControls(); }
    if (button.hasAttribute('data-motion-replay')) {
      if(button.closest('.motion-more'))pausedItems.clear();
      observed.forEach(frame => pausedItems.delete(frame.dataset.motionFrame));
      observed.forEach(frame => { observer.unobserve(frame); }); observed.clear(); hydrate(); updateControls();
    }
    if (button.dataset.motionCopy) copy(aiText(index.get(button.dataset.motionCopy)),button);
    if (button.dataset.motionSource) copy(sourceText(data.sources.find(s => s.id === button.dataset.motionSource)),button);
    if (button.dataset.motionCodeCopy) copy(codeText(index.get(button.dataset.motionCodeCopy)),button);
  });
  document.addEventListener('change', event => {
    if (!event.target.matches('[data-motion-target]')) return;
    target = event.target.value;
    document.querySelectorAll('[data-motion-target]').forEach(select => { select.value = target; });
    document.querySelectorAll('[data-motion-copy]').forEach(button => {
      button.setAttribute('aria-label', `${index.get(button.dataset.motionCopy).name} ${targets[target]} AI용 전체 정보 복사`);
      if(button.hasAttribute('title'))button.title=`${index.get(button.dataset.motionCopy).name} · ${targets[target]} AI용 정보 복사`;
      clearTimeout(feedback.get(button));button.removeAttribute('data-copied');
      const label=button.querySelector('[data-motion-copy-label]');if(label?.dataset.original)label.textContent=label.dataset.original;
    });
    document.querySelectorAll('[data-motion-code-copy]').forEach(button => {
      button.setAttribute('aria-label', `${index.get(button.dataset.motionCodeCopy).name} ${targets[target]} 코드 복사`);
      clearTimeout(feedback.get(button));button.removeAttribute('data-copied');
      const label=button.querySelector('[data-motion-copy-label]');if(label?.dataset.original)label.textContent=label.dataset.original;
    });
    document.querySelectorAll('.motion-delivery .motion-copy-status').forEach(node => { node.textContent = ''; });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') document.querySelectorAll('.motion-more[open]').forEach(menu => { menu.open=false; menu.querySelector('summary').focus(); event.preventDefault(); });
  });
  media.addEventListener('change',updateControls);
  document.addEventListener('visibilitychange',updateControls);
  document.addEventListener('click', event => document.querySelectorAll('.motion-more[open]').forEach(menu => { if (!menu.contains(event.target)) menu.open=false; }));
  window.Pattove.motionUI = { index, filters, writeFilters, subnavigation, matching, currentItems, pageCount, collectionControls, collection, detail, header, hydrate, payload, files, codeText, documentHTML, css, markup, aiText, environment:()=>target };
})();
