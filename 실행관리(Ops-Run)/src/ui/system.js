(() => {
  const { parts: p, systemRegistry: r, views, catalog } = window.Pattove;
  const e = p.esc;
  const icons = Object.keys(window.Pattove.iconMarkup);
  const sourceButton = id => `<button class="source-button" data-system-detail="${id}" data-focus="source-${id}">코드 보기 ${p.icon('arrow')}</button>`;
  const panel = (id, body, wide = false) => `<section class="specimen${wide ? ' specimen-wide' : ''}" data-specimen="${id}"><header class="specimen-heading"><h3>${r.index.get(id).name}</h3><span>${r.index.get(id).layer}</span>${sourceButton(id)}</header><div class="specimen-body">${body}</div></section>`;
  const label = text => `<p class="specimen-label">${text}</p>`;
  const line = children => `<div class="specimen-line">${children}</div>`;
  const tokenNames = { bg: '배경', surface: '표면', text: '본문', muted: '보조 글자', accent: '강조', 'on-accent': '강조 위 글자', soft: '보조 면', border: '경계', focus: '초점', success: '성공', warning: '주의', error: '오류' };
  function foundations() {
    return `<div class="foundation-grid"><div><p class="specimen-label">역할별 색</p><div class="token-grid">${Object.entries(tokenNames).map(([key, name]) => `<div class="token-swatch"><i style="background:var(--ds-${key})"></i><span>${name}</span><code data-token-value="--ds-${key}"></code></div>`).join('')}</div></div><div class="type-specimen"><p class="specimen-label">글꼴 · Pretendard / Outfit</p><p class="type-display">Aa 가나다</p><p class="type-title">부드러운 표면, 또렷한 기준</p><p class="type-body">버튼 하나부터 화면 전체까지.<br>같은 색과 간격, 글꼴을 사용합니다.</p><p class="type-caption">본문 16 · 제목 24 · 보조 13 px</p><div class="spacing-specimen">${[4,8,12,16,24,32].map(n => `<span><i style="width:${n}px"></i><code>${n}</code></span>`).join('')}</div><div class="shape-specimen"><i></i><span>모서리 <code data-token-value="--ds-radius"></code><br>표면의 그림자</span></div></div></div><div class="surface-study">${[["raised","양각 · 행동"],["inset","음각 · 입력"],["glass","유리 · 탐색"]].map(([material,name])=>`<div class="ds-surface" data-material="${material}">${name}</div>`).join('')}</div>`;
  }
  function buttons() {
    const states = [['','기본'],['hover','Hover'],['pressed','Pressed'],['focus','Focus'],['disabled','Disabled'],['loading','Loading']];
    return `<div class="specimen-scroll" role="region" aria-label="버튼 상태 비교" tabindex="0"><table class="button-matrix"><thead><tr><th scope="col">상태</th>${['채움','윤곽','글자'].map(n => `<th scope="col">${n}</th>`).join('')}</tr></thead><tbody>${states.map(([state, name]) => `<tr><th scope="row">${name}</th>${['primary','outline','ghost'].map(variant => `<td>${p.button({ label: '계속하기', variant, state })}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="button-options"><div>${label('크기 · 높이 44 / 48 / 56 px')}${line(['sm','md','lg'].map((size, i) => p.button({ label: ['Small','Medium','Large'][i], size })).join(''))}</div><div>${label('아이콘과 함께')}${line(p.button({ label: '추가하기', iconName: 'folder' }) + p.button({ label: '검색', iconName: 'search', iconOnly: true, variant: 'outline' }))}</div></div><p class="specimen-caption">상태를 나란히 고정해 비교합니다. 실제 포인터·키보드 조작에도 같은 표현을 사용합니다.</p><p class="ds-demo-note" role="status"></p>`;
  }
  const renderers = {
    tokens: foundations,
    icon: () => `<div class="icon-specimens">${icons.map(name => `<button data-system-detail="icon" data-system-icon="${name}" data-focus="icon-${name}" aria-label="${name} 아이콘 코드 보기">${p.icon(name)}<span>${name}</span></button>`).join('')}</div>`,
    divider: () => `${label('영역 사이의 경계')}${p.divider()}`,
    'status-dot': () => line(p.statusDot()),
    button: buttons,
    input: () => `<label class="ds-field" for="board-input">입력창만${p.input({ id: 'board-input', placeholder: '한 줄을 입력하세요' })}</label>`,
    field: () => `<div class="field-matrix">${[['','기본',''],['focus','초점','컬렉션 이름'],['disabled','사용 불가','수정할 수 없는 이름'],['error','오류',''],['success','완료','봄의 기록']].map(([state, name, value], i) => p.field({ id: 'board-field-' + i, label: name, state, value, help: state === 'error' ? '이름을 입력해 주세요.' : state === 'success' ? '사용할 수 있는 이름이에요.' : '나중에 바꿀 수 있어요.' })).join('')}</div>`,
    ...Object.fromEntries(['checkbox','radio','switch'].map(kind => [kind, () => `<div class="ds-choices"><fieldset><legend>기본 · 선택 · 사용 불가</legend>${p.choice({kind,label:'기본',name:'board-'+kind})}${p.choice({kind,label:'선택됨',checked:true,name:'board-'+kind})}${kind === 'checkbox' ? p.choice({kind,label:'일부 선택',indeterminate:true}) : ''}${p.choice({kind,label:'사용 불가',disabled:true,name:'board-'+kind})}</fieldset></div>`])),
    badge: () => line(['neutral','success','warning','error'].map((tone, i) => p.badge(['진행 중','완료','확인 필요','실패'][i], tone)).join('')),
    tabs: () => p.tabs('board'),
    'bottom-nav': () => `<div class="nav-variants"><div>${label('밑줄')}${p.navigation('line')}</div><div>${label('독')}${p.navigation('dock')}</div></div>`,
    feedback: p.feedback,
    card: () => `<div class="single-card">${p.card()}</div><p class="ds-demo-note" role="status"></p>`,
    'search-module': () => p.searchModule('board'),
    template: () => p.template(),
    page: () => p.page('board-page')
  };
  function currentItems(state) { return r.matching(state.query).filter(item => state.category === 'all' || item.section === state.category); }
  function sidebar(state) {
    const groups = [['기초',['Token','Primitive']],['부품',['Atom','Molecule']],['조합',['Module','Template','Page']]];
    return '<a class="component-sidebar-link" href="#/system?style=main"'+(!state.detail&&state.category==='all'?' aria-current="page"':'')+'>전체 보기</a>'+groups.map(([name,layers])=>'<p class="system-nav-group">'+name+'</p>'+r.items.filter(item=>layers.includes(item.layer)).map(item=>'<a class="component-sidebar-link" href="#/system?style=main&detail='+item.id+'"'+(state.detail===item.id?' aria-current="page"':'')+'>'+e(item.name)+'</a>').join('')).join('');
  }
  function main(state) {
    const items = currentItems(state);
    const style = catalog.styles.find(s => s.id === state.style);
    return `<section class="system-workspace" aria-labelledby="system-title"><div class="system-heading"><div><h2 id="system-title">${state.query ? '“' + e(state.query) + '”' : (state.category === 'all' ? '메인 스타일' : r.sections.find(s => s.id === state.category).name)}</h2></div></div><label class="system-mobile-nav"><span class="sr-only">부품 분류</span><select data-system-category>${r.sections.map(s => `<option value="${s.id}"${state.category === s.id ? ' selected' : ''}>${s.name}</option>`).join('')}</select></label>${state.query ? `<div class="system-query">${items.length}개 부품 <button data-action="clear-query">검색 해제</button></div>` : ''}${items.length ? `<div class="system-board ds theme-${state.style}" data-style="${state.style}"${state.category==='all'&&!state.query?' data-overview':''}>${r.sections.filter(s => s.id !== 'all').sort((a,b)=>['foundations','buttons','fields','selection','navigation','feedback','composition','primitives','page'].indexOf(a.id)-['foundations','buttons','fields','selection','navigation','feedback','composition','primitives','page'].indexOf(b.id)).map(section => {
      const found = items.filter(i => i.section === section.id);
      return found.length ? `<section class="specimen-section section-${section.id}" aria-labelledby="section-${section.id}"><h2 class="${state.category !== 'all' || (found.length === 1 && found[0].name === section.name) ? 'sr-only' : 'section-heading'}" id="section-${section.id}">${section.name}</h2><div class="specimen-grid">${found.map(item => panel(item.id, renderers[item.id](), ['tokens','button','field','selection','bottom-nav','search-module','template','page'].includes(item.id))).join('')}</div></section>` : '';
    }).join('')}</div>` : '<div class="empty-state"><h2>일치하는 부품이 없어요</h2><button class="secondary" data-action="reset">전체 보기</button></div>'}<details class="style-provenance"><summary>스타일 기준·개선한 점</summary>${views.styleReferences(style)}<a class="style-spec-link" href="문서/메인%20스타일%20명세.md" target="_blank" rel="noopener">스타일 명세 읽기 ${p.icon('arrow')}</a></details><footer class="system-footnote">대표 부품으로 구조와 조합을 검증하는 시험판입니다. <a href="#/dictionary">더 많은 패턴은 사전에서 ${p.icon('arrow')}</a></footer></section>`;
  }
  function itemMarkup(state, options = {}) {
    const content = p.renderItem(state.detail, undefined, r.normalizeOptions(state.detail, { ...state.options, ...options }));
    return `<div class="ds theme-${state.style}" data-style="${state.style}">${content}</div>`;
  }
  const choices = (name, label, values, selected) => `<label>${label}<select data-part-option="${name}" data-focus="option-${name}">${values.map(([value, text]) => `<option value="${value}"${selected === value ? ' selected' : ''}>${text}</option>`).join('')}</select></label>`;
  function detail(state) { return window.Pattove.componentDocs.page(state); }
  function hydrate(root) {
    root.querySelectorAll('[data-token-value]').forEach(node => { node.textContent = getComputedStyle(node.closest('.ds')).getPropertyValue(node.dataset.tokenValue).trim(); });
    window.Pattove.mountParts(root);
    window.Pattove.installUI.hydrate(root);
  }
  function updateInspector(state) {
    const root = document.querySelector('.system-inspector');
    const options = Object.fromEntries([...root.querySelectorAll('[data-part-option]')].map(el => [el.dataset.partOption, el.value]));
    const markup = itemMarkup(state, options);
    root.querySelector('.part-demo').innerHTML = markup + '<p class="ds-demo-note" role="status"></p>';
    root.querySelector('#part-source').value = markup;
    const install = root.querySelector('.install-panel');
    if (install && options.icon) { install.dataset.installIcon=options.icon; window.Pattove.installUI.refresh(install); }
    window.Pattove.componentDocs.refresh(state);
    hydrate(document);
  }
  window.Pattove.systemUI = { sidebar, main, detail, currentItems, hydrate, updateInspector, itemMarkup };
})();
