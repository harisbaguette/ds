/* Public HTML renderers. The board, composed examples and exports use these same functions. */
(() => {
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
  const icon = name => window.Pattove.iconMarkup[name] || '';
  let instance = 0;
  const uid = kind => `pattove-${kind}-${++instance}`;
  const option = (value, allowed, fallback) => allowed.includes(value) ? value : fallback;
  // Shape of an atom from the registry gallery. No look given → no attribute → the part's base shape.
  const lookId = (id, look) => {
    if (!look) return '';
    const list = window.Pattove.systemRegistry?.index.get(id)?.gallery?.list || [];
    return list.some(v => v.id === look) ? look : list[0]?.id || look;
  };
  const lookAttr = (id, look) => look ? ` data-look="${esc(lookId(id, look))}"` : '';
  function button({ label = '계속하기', variant = 'primary', size = 'md', state = '', iconName = '', iconOnly = false, action = 'press', type = 'button', look = '', count = '' } = {}) {
    variant = option(variant, ['primary','outline','ghost'], 'primary');
    size = option(size, ['sm','md','lg'], 'md');
    state = option(state, ['','hover','pressed','focus','disabled','loading'], '');
    type = option(type, ['button','submit','reset'], 'button');
    const disabled = state === 'disabled' || state === 'loading';
    // A count joins the name ("보내기 3개") so the number is read with the action, not as a stray digit.
    const name = iconOnly ? label : count !== '' ? `${label} ${count}개` : '';
    return `<button type="${type}" class="ds-button" data-variant="${variant}" data-size="${size}"${lookAttr('button', look)}${state ? ` data-state="${state}"` : ''}${disabled ? ' disabled' : ''}${state === 'loading' ? ' aria-busy="true"' : ''}${name ? ` aria-label="${esc(name)}"` : ''}${iconOnly ? ' data-icon-only' : ''}${action ? ` data-part-action="${esc(action)}"` : ''}${action === 'select-card' ? ' aria-pressed="false"' : ''}>${state === 'loading' ? '<span class="ds-spinner" aria-hidden="true"></span>' : iconName ? icon(iconName) : ''}${iconOnly ? '' : esc(label)}${count !== '' && !iconOnly ? `<span class="ds-button-count" aria-hidden="true">${esc(count)}</span>` : ''}</button>`;
  }
  // Button looks are arrangements of actions. The chosen options shape the main action; helpers stay quiet.
  function actions({ look = 'fill', ...main } = {}) {
    look = lookId('button', look);
    if (look === 'hero') return `<div class="ds-actions" data-look="hero">${button({ ...main, label: '보내기', count: 3 })}${[['edit','수정'],['bookmark','보관'],['upload','공유']].map(([art, label]) => button({ label, iconName: art, iconOnly: true, variant: 'ghost', size: main.size, state: main.state === 'disabled' ? 'disabled' : '' })).join('')}</div>`;
    if (look === 'pair') return `<div class="ds-actions" data-look="pair">${button({ label: '취소', variant: 'ghost', size: main.size, state: main.state === 'disabled' ? 'disabled' : '' })}${button({ ...main, label: '삭제하기' })}</div>`;
    if (look === 'bar') return `<div class="ds-actions" data-look="bar">${button({ ...main, label: '3개 담기' })}</div>`;
    return button({ ...main, look });
  }
  const inputSamples = { box: ['이름', '', '이름을 입력하세요'], clear: ['검색어', '봄의 색', '검색어 입력'], unit: ['금액', '12,000', '0'], stepper: ['수량', '1', ''], reveal: ['비밀번호', '', '8자 이상'] };
  // Input looks put the helper that the value needs inside the same box: a clear button, its unit, − and +, or a show button.
  function input({ id = uid('input'), value = '', placeholder = '이름을 입력하세요', disabled = false, invalid = false, description = '', type = 'text', name = '', look = '', label = '' } = {}) {
    type = option(type, ['text','email','search','password','tel','url','number'], 'text');
    look = lookId('input', look);
    const group = ['clear', 'unit', 'stepper', 'reveal'].includes(look);
    if (look === 'unit') type = 'text';
    if (look === 'stepper') type = 'number';
    if (look === 'reveal') type = 'password';
    const off = disabled ? ' disabled' : '';
    const own = look === 'unit' ? ' inputmode="numeric"' : look === 'stepper' ? ' min="0" inputmode="numeric"' : '';
    const field = `<input class="ds-input" id="${esc(id)}"${group ? '' : lookAttr('input', look)}${name ? ` name="${esc(name)}"` : ''} type="${type}" value="${esc(value)}"${placeholder ? ` placeholder="${esc(placeholder)}"` : ''}${own}${off}${invalid ? ' aria-invalid="true"' : ''}${description ? ` aria-describedby="${esc(description)}"` : ''}>`;
    if (look === 'clear') return `<span class="ds-input-group" data-look="clear">${field}<button type="button" class="ds-input-tool" data-part-action="clear-input" aria-label="${esc(label ? label + ' 지우기' : '지우기')}"${off}>${icon('close')}</button></span>`;
    if (look === 'unit') return `<span class="ds-input-group" data-look="unit">${field}<select class="ds-input-unit" aria-label="통화"${off}><option>원</option><option>달러</option></select></span>`;
    const step = (delta, text) => `<button type="button" class="ds-input-tool" data-part-action="step" data-step="${delta}" aria-label="${delta < 0 ? '하나 빼기' : '하나 더하기'}"${off}>${text}</button>`;
    if (look === 'stepper') return `<span class="ds-input-group" data-look="stepper">${step(-1, '<span aria-hidden="true">−</span>')}${field}${step(1, icon('plus'))}</span>`;
    // The show button flips the typed secret to plain text in place, so a typo is seen instead of retyped.
    if (look === 'reveal') return `<span class="ds-input-group" data-look="reveal">${field}<button type="button" class="ds-input-tool" data-part-action="reveal" aria-label="${esc(label || '비밀번호')} 보기"${off}>보기</button></span>`;
    return field;
  }
  function field({ id = uid('field'), label = '컬렉션 이름', value = '', placeholder, state = '', help = '', name = '', type = 'text', look = '' } = {}) {
    state = option(state, ['','focus','disabled','error','success'], '');
    const own = { disabled: state === 'disabled', invalid: state === 'error', description: help ? id + '-help' : '', name, type };
    // The row look keeps a start and an end value in one box, so the eye stops once instead of twice.
    const control = lookId('field', look) === 'row'
      ? `<span class="ds-input-group">${input({ ...own, id, value: '9월 1일', placeholder: '시작' })}<span class="ds-input-join" aria-hidden="true">~</span>${input({ ...own, id: id + '-end', value: '9월 30일', placeholder: '끝', name: name ? name + '-end' : '' }).replace('<input ', `<input aria-label="${esc(label)} 끝" `)}</span>`
      : input({ ...own, id, value, placeholder });
    return `<div class="ds-field"${lookAttr('field', look)}${state ? ` data-state="${state}"` : ''}>${fieldLabel(id,label)}${control}${help ? fieldDescription(id + '-help',help) : ''}</div>`;
  }
  const fieldLabel = (id, label) => `<label for="${esc(id)}">${esc(label)}</label>`;
  const fieldDescription = (id, text) => `<p class="ds-help" id="${esc(id)}">${esc(text)}</p>`;
  const cardTitle = title => `<h3>${esc(title)}</h3>`;
  const cardDescription = text => `<p>${esc(text)}</p>`;
  // body/actions accept trusted markup from other parts, not unsanitized user text.
  const cardBody = children => `<div class="ds-card-body">${children}</div>`;
  const cardActions = children => `<footer class="ds-card-actions">${children}</footer>`;
  function choice({ kind = 'checkbox', label = '선택하기', checked = false, disabled = false, indeterminate = false, name = 'visibility', value = label, look = '', part = '' } = {}) {
    kind = option(kind, ['checkbox','radio','switch'], 'checkbox');
    return `<label class="ds-choice"${lookAttr(kind, look)}><input type="${kind === 'switch' ? 'checkbox' : kind}" value="${esc(value)}"${kind === 'switch' ? ' class="ds-switch" role="switch"' : ''}${name ? ` name="${esc(name)}"` : ''}${checked ? ' checked' : ''}${disabled ? ' disabled' : ''}${indeterminate ? ' data-indeterminate' : ''}${part ? ` data-part="${esc(part)}"` : ''}>${esc(label)}</label>`;
  }
  // The icon look repeats the tone as a shape, so the state reads without telling colours apart.
  const toneIcon = { success: 'check', warning: 'warning', error: 'close', neutral: 'rotate' };
  // The count look pins how many new items wait on the icon, so nobody opens the place just to count.
  const badge = (label = '진행 중', tone = 'neutral', look = '', count = 3) => lookId('badge', look) === 'count'
    ? `<span class="ds-badge" data-tone="${tone}" data-look="count" role="img" aria-label="${Number(count) > 0 ? `새 알림 ${Number(count)}개` : '새 알림 없음'}">${icon('bell')}${Number(count) > 0 ? `<span class="ds-badge-count" aria-hidden="true">${count > 99 ? '99+' : Number(count)}</span>` : ''}</span>`
    : `<span class="ds-badge" data-tone="${tone}"${lookAttr('badge', look)}>${lookId('badge', look) === 'icon' ? icon(toneIcon[tone] || 'rotate') : ''}${esc(label)}</span>`;
  const divider = (look = '', label = '또는') => `<hr class="ds-divider"${lookAttr('divider', look)}${look === 'label' ? ` data-label="${esc(label)}"` : ''}>`;
  const statusDot = (label = '연결됨', look = '') => `<span class="ds-status"${lookAttr('status-dot', look)}><i aria-hidden="true"></i>${esc(label)}</span>`;
  // The label look prints the icon's meaning under it; unknown names stay picture-only.
  const iconNames = { arrow: '다음', bell: '알림', bookmark: '보관', box: '상자', check: '완료', 'chevron-down': '펼치기', chevron: '더 보기', close: '닫기', compass: '탐색', edit: '수정', file: '파일', folder: '폴더', grid: '전체', info: '안내', layers: '설정', menu: '메뉴', plus: '추가', rotate: '새로 고침', search: '검색', shapes: '모양', upload: '올리기', warning: '주의' };
  const iconMark = (name = 'search', look = '') => {
    const words = lookId('icon', look) === 'label' && iconNames[name] ? `<span class="ds-icon-name">${iconNames[name]}</span>` : '';
    return `<span class="ds-icon"${lookAttr('icon', look)}>${icon(name)}${words}</span>`;
  };
  // Every look keeps the same tab and panel wiring; icon adds a picture, count adds how many wait behind each tab, scroll lets many tabs slide sideways.
  const tabLooks = ['filled','icon','count','vertical','scroll'];
  function tabs(prefix = uid('tabs'), look = 'filled') {
    look = option(look, tabLooks, 'filled');
    const art = look === 'icon' ? ['grid','rotate','check'] : [];
    const counts = look === 'count' ? [3, 2, 1] : [];
    const names = look === 'scroll' ? ['전체','진행 중','완료','보관함','공유받음','휴지통'] : ['전체','진행 중','완료'];
    const texts = look === 'scroll' ? ['모든 컬렉션을 보고 있어요.','진행 중인 컬렉션을 보고 있어요.','완료한 컬렉션을 보고 있어요.','보관한 컬렉션을 보고 있어요.','공유받은 컬렉션을 보고 있어요.','지운 컬렉션을 보고 있어요.'] : ['모든 컬렉션을 보고 있어요.','진행 중인 컬렉션을 보고 있어요.','완료한 컬렉션을 보고 있어요.'];
    return `<div class="ds-tabs" data-look="${look}"><div class="ds-tablist" role="tablist" aria-label="컬렉션 분류"${look === 'vertical' ? ' aria-orientation="vertical"' : ''}>${names.map((name, i) => `<button type="button" class="ds-tab" id="${prefix}-tab-${i}" role="tab" aria-selected="${i === 0}" aria-controls="${prefix}-panel-${i}" tabindex="${i === 0 ? 0 : -1}"${counts.length ? ` aria-label="${name} ${counts[i]}개"` : ''}>${art[i] ? icon(art[i]) : ''}${name}${counts.length ? `<span class="ds-tab-count" aria-hidden="true">${counts[i]}</span>` : ''}</button>`).join('')}</div>${texts.map((text, i) => `<div class="ds-tabpanel" id="${prefix}-panel-${i}" role="tabpanel" aria-labelledby="${prefix}-tab-${i}" tabindex="0"${i ? ' hidden' : ''}>${text}</div>`).join('')}</div>`;
  }
  // Shapes with a raised center action put a create button between the second and third destination.
  const navCenter = ['float'];
  function navigation(variant = 'line', label = '하단 탐색') {
    const items = [['홈','grid'],['탐색','search'],['저장','bookmark'],['설정','layers']].map(([name, art], i) => `<button type="button" data-part-action="nav" aria-pressed="${i === 0}">${icon(art)}<span>${name}</span></button>`);
    if (navCenter.includes(variant)) items.splice(2, 0, `<button type="button" class="ds-bottom-nav-create" data-part-action="create" aria-label="만들기">${icon('plus')}</button>`);
    return `<nav class="ds-bottom-nav" data-variant="${esc(variant)}" aria-label="${esc(label)}">${items.join('')}</nav>`;
  }
  const feedbackLooks = ['card','toast','ring','steps'];
  // open shows the saved notice at once; the part page uses it so each look's notice is visible without a click.
  function feedback({ look = 'card', open = false, progress = 68 } = {}) {
    look = option(look, feedbackLooks, 'card');
    const value = Math.min(100, Math.max(0, Number(progress) || 0));
    const ring = look === 'ring' ? `<span class="ds-progress-ring" aria-hidden="true" style="--value:${value}"><b>${value}%</b></span>` : '';
    // The toast carries its own undo, so the action runs at once instead of asking "are you sure?" first.
    const undo = look === 'toast' ? '<button type="button" class="ds-alert-undo" data-part-action="undo">되돌리기</button>' : '';
    return `<div class="ds-feedback-example" data-look="${look}">${button({ label: '저장 알림 띄우기', iconName: 'check', action: 'notify' })}<div class="ds-alert" role="status" data-part-feedback${open ? '' : ' hidden'}>${statusDot('변경사항을 저장했어요.')}${undo}</div>${ring}<div class="ds-progress-label"><span>파일 업로드</span><span>${value}%</span></div><progress class="ds-progress" value="${value}" max="100" aria-label="파일 업로드">${value}%</progress></div>`;
  }
  const cardLooks = ['raised','row','media'];
  function card({ title = '브랜드 리뉴얼', description = '색과 서체, 첫인상을 모아 둔 컬렉션', tag = '진행 중', action = '선택하기', behavior = 'select-card', look = 'raised', initial = '' } = {}) {
    look = option(look, cardLooks, 'raised');
    const media = look === 'media' || look === 'row' ? `<div class="ds-card-media" aria-hidden="true">${esc(initial)}</div>` : '';
    return `<article class="ds-card" data-look="${look}">${media}${cardBody(badge(tag)+cardTitle(title)+cardDescription(description))}${divider()}${cardActions(button({ label: action, variant: 'outline', size: 'sm', iconName: 'arrow', action: behavior }))}</article>`;
  }
  const searchLooks = ['grid','pill','chips','list','picker','feature'];
  const statuses = [['all','전체'],['진행 중','진행 중'],['완료','완료']];
  // The chips look swaps the status select for a radio group with the same name, so filtering and reset stay identical.
  const statusControl = chips => chips
    ? `<fieldset class="ds-chip-group"><legend>상태</legend>${statuses.map(([value, label], i) => `<label class="ds-chip"><input type="radio" name="status" value="${value}"${i ? '' : ' checked'}><span>${label}</span></label>`).join('')}</fieldset>`
    : `<label class="ds-select-field"><span>상태</span><select class="ds-input" name="status">${statuses.map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}</select></label>`;
  function searchModule(prefix = uid('collection'), records = null, look = 'grid') {
    look = option(look, searchLooks, 'grid');
    const data = records || [
      { title: '봄의 색', description: '연한 초록과 따뜻한 노랑', tag: '진행 중' },
      { title: '주말의 기록', description: '산책하며 모은 장면들', tag: '완료' },
      { title: '작은 작업실', description: '다음 프로젝트의 첫 아이디어', tag: '진행 중' }
    ];
    // The picker narrows the list while typing: one field, no status menu, no search button, each row a face to tap.
    const picker = look === 'picker';
    const cardLook = index => picker ? 'row' : look === 'feature' && index === 0 ? 'media' : 'raised';
    const form = picker
      ? `<form class="ds-search-form" data-part-search data-live>${field({ id: prefix + '-query', label: '컬렉션 찾기', name: 'query', placeholder: '이름 한두 글자', type: 'search' })}</form>`
      : `<form class="ds-search-form" data-part-search>${field({ id: prefix + '-query', label: '컬렉션 검색', name: 'query', placeholder: '이름으로 검색' })}${statusControl(look === 'chips')}${button({ label: '검색', type: 'submit', iconName: 'search', action: '' })}</form>`;
    return `<section class="ds-search-module" data-look="${look}" aria-label="컬렉션 검색">${form}<p class="ds-result-count" role="status">${data.length}개의 컬렉션</p><div class="ds-results">${data.map((item, index) => `<div data-record-id="${esc(item.id ?? index)}" data-result="${esc(item.title + ' ' + item.description)}" data-result-status="${esc(item.tag)}">${card({ ...item, action: picker ? '고르기' : '열기', behavior: 'open-record', look: cardLook(index), initial: picker ? [...item.title][0] : '' })}</div>`).join('')}</div><div class="ds-empty" hidden><p>일치하는 컬렉션이 없어요.</p>${button({ label: '전체 보기', variant: 'outline', action: 'reset-search' })}</div><section class="ds-record-detail" aria-label="컬렉션 상세" tabindex="-1" hidden><h3></h3><p></p><div>${button({ label: '목록으로', variant: 'outline', action: 'close-record' })}${button({ label: '컬렉션에 보관', action: 'save-record' })}</div></section><p class="ds-demo-note" role="status"></p></section>`;
  }
  // Each screen arrangement brings its own bottom bar shape and, for the page, the search look that suits it.
  const pageLooks = { stack: ['minimal','grid'], hero: ['pill','pill'], appbar: ['line','list'], sheet: ['glass','chips'], dashboard: ['float','list'] };
  const stats = list => `<ul class="ds-page-stats" role="list">${list.map(([label, value]) => `<li><strong>${esc(value)}</strong><span>${esc(label)}</span></li>`).join('')}</ul>`;
  function template({ title = '컬렉션', eyebrow = '나의 작업실', count = '3개', body = '<div class="ds-template-slot">검색·목록 모듈이 들어가는 자리</div>', look = 'stack', summary = [['전체', count], ['진행 중', '2개'], ['완료', '1개']] } = {}) {
    look = option(look, Object.keys(pageLooks), 'stack');
    return `<div class="ds-page" data-look="${look}"><header class="ds-page-header"><div><span class="ds-eyebrow">${esc(eyebrow)}</span><h2>${esc(title)}</h2></div>${badge(count)}</header>${look === 'dashboard' ? stats(summary) : ''}${body}${navigation(pageLooks[look][0])}</div>`;
  }
  function page(prefix = uid('page'), look = 'stack') {
    look = option(look, Object.keys(pageLooks), 'stack');
    const records = [
      { title: '도시에서 발견한 작은 색의 조합', description: '걷다가 기록한 간판과 건물, 창가의 색', tag: '진행 중' },
      { title: '타이포그래피', description: '마음에 남은 글자의 표정', tag: '완료' },
      { title: '여름 프로젝트', description: '새 작업을 위한 자료와 메모', tag: '진행 중' }
    ];
    const summary = [['전체', records.length + '개'], ...['진행 중','완료'].map(tag => [tag, records.filter(item => item.tag === tag).length + '개'])];
    return template({ look, summary, body: searchModule(prefix, records, pageLooks[look][1]) });
  }
  // One swatch row per token kind; an empty name marks the kind's default value.
  // With text, each sample is a span carrying that text (type kinds); otherwise an empty <i> swatch.
  function tokenMarks(className, names, text = '') {
    const mark = t => text ? `<span${t ? ` data-token="${t}"` : ''}>${text}</span>` : t ? `<i data-token="${t}"></i>` : '<i></i>';
    return `<span class="ds-token-row ${className}">${names.map(mark).join('')}</span>`;
  }
  function renderItem(id, prefix = uid('example'), options = {}) {
    const renderers = {
      checkbox: () => {
        const state = { disabled: options.state === 'disabled' };
        if (lookId('checkbox', options.look) !== 'all') return choice({ look: options.look, label: '링크로 공유', checked: options.state !== 'unchecked', indeterminate: options.state === 'indeterminate', ...state });
        // The all look puts one parent above its children; the parent shows "some" when only part is picked.
        const picked = options.state === 'unchecked' ? [] : options.state === 'indeterminate' ? [0] : [0, 1, 2];
        const kids = ['댓글','좋아요','새 팔로워'].map((label, i) => choice({ label, name: prefix + '-alerts', checked: picked.includes(i), ...state })).join('');
        const parent = choice({ label: '모두 선택', name: '', part: 'select-all', checked: picked.length === 3, indeterminate: picked.length > 0 && picked.length < 3, ...state });
        return `<fieldset class="ds-select-all" data-look="all"><legend>받을 알림</legend>${parent}${kids}</fieldset>`;
      },
      radio: () => `<fieldset class="ds-radio-group"><legend>공개 범위</legend>${choice({kind:'radio',look:options.look,label:'나만 보기',checked:options.state !== 'unchecked',disabled:options.state === 'disabled',name:prefix+'-visibility'})}${choice({kind:'radio',look:options.look,label:'링크로 공유',disabled:options.state === 'disabled',name:prefix+'-visibility'})}</fieldset>`,
      switch: () => choice({ kind: 'switch', look: options.look, label: '알림 받기', checked: options.state !== 'unchecked', disabled: options.state === 'disabled' }),
      'token-color': () => tokenMarks('ds-token-swatches', ['accent','high','soft','text']),
      'token-typography': () => '<div class="ds-token-typography"><strong class="ds-token-type">Aa 가나</strong><span class="ds-token-sizes">'+['sm','md','lg'].map(t=>'<span data-token="'+t+'">가나 '+t+'</span>').join('')+'</span></div>',
      'token-gradient': () => tokenMarks('ds-token-gradients', ['','backdrop','rule']),
      'token-text': () => tokenMarks('ds-token-text', ['label','body','title','heading','display-sm'], '가'),
      'token-weight': () => tokenMarks('ds-token-weight', ['regular','medium','semibold','bold','extrabold'], '가'),
      'token-leading': () => tokenMarks('ds-token-leading', ['tight','normal','looser'], '줄<br>간격'),
      'token-tracking': () => tokenMarks('ds-token-tracking', ['display','tight','wide'], 'Aa 가나'),
      'token-space': () => tokenMarks('ds-token-space', ['xs','sm','md','lg','xl']),
      'token-size': () => tokenMarks('ds-token-size', ['','icon-md','icon-xl','control']),
      'token-container': () => tokenMarks('ds-token-container', ['','measure','column','container']),
      'token-border': () => tokenMarks('ds-token-border', ['','strong','focus']),
      'token-stroke': () => tokenMarks('ds-token-stroke', ['','dotted']),
      'token-blur': () => tokenMarks('ds-token-blur', ['','md']),
      'token-opacity': () => tokenMarks('ds-token-opacity', ['','dim','disabled','faint']),
      'token-aspect': () => tokenMarks('ds-token-aspect', ['','landscape','portrait']),
      'token-layer': () => tokenMarks('ds-token-layer', ['lifted','raised','']),
      'token-breakpoint': () => tokenMarks('ds-token-breakpoint', ['','md','lg','xl']),
      'token-radius': () => tokenMarks('ds-token-radius', ['','control','surface']),
      'token-shadow': () => tokenMarks('ds-token-shadow', ['','shadow','inset','float']),
      'token-motion': () => '<span class="ds-token-motion" aria-label="전환 시간 표본"><i></i></span>',
      icon: () => iconMark(options.icon || 'search', options.look), divider: () => divider(options.look), 'status-dot': () => statusDot('연결됨', options.look),
      button: () => actions({ look: options.look, variant: options.variant, size: options.size, state: options.state, iconName: options.icon || (options.iconOnly === 'true' ? 'search' : ''), iconOnly: options.iconOnly === 'true' }),
      input: () => {
        const look = lookId('input', options.look), id = prefix + '-input';
        const [label, value, placeholder] = inputSamples[look] || inputSamples.box;
        const own = input({ id, look, label, value, placeholder, disabled: options.state === 'disabled', type: options.type || 'text' });
        return look === 'box' || !look ? `<label class="ds-field" for="${id}"><span>${label}</span>${own}</label>` : `<div class="ds-field">${fieldLabel(id, label)}${own}</div>`;
      },
      field: () => {
        const noun = lookId('field', options.look) === 'row' ? '기간' : '이름';
        return field({ id: prefix + '-field', look: options.look, label: noun === '기간' ? '기간' : '컬렉션 이름', state: options.state, value: options.state === 'success' ? '봄의 기록' : '', help: options.state === 'error' ? noun + '을 입력해 주세요.' : options.state === 'success' ? '사용할 수 있는 ' + noun + '이에요.' : '나중에 바꿀 수 있어요.' });
      },
      badge: () => badge(({success:'완료',warning:'확인 필요',error:'실패'})[options.tone] || '진행 중', options.tone || 'neutral', options.look),
      tabs: () => tabs(prefix, options.look), 'bottom-nav': () => navigation(options.variant),
      feedback: () => feedback({ look: options.look, open: options.open }), card: () => card({ look: options.look }),
      'search-module': () => searchModule(prefix, null, options.look), template: () => template({ look: options.look }), page: () => page(prefix, options.look)
    };
    if (!renderers[id]) throw new RangeError('알 수 없는 부품: ' + id);
    return renderers[id]();
  }
  window.Pattove.parts = { esc, icon, navCenter, button, actions, input, field, fieldLabel, fieldDescription, cardTitle, cardDescription, cardBody, cardActions, choice, badge, divider, statusDot, iconMark, tabs, navigation, feedback, card, searchModule, template, page, renderItem };
})();
