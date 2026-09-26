/* Public HTML renderers. The board, composed examples and exports use these same functions. */
(() => {
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
  const icon = name => window.Pattove.iconMarkup[name] || '';
  let instance = 0;
  const uid = kind => `pattove-${kind}-${++instance}`;
  const option = (value, allowed, fallback) => allowed.includes(value) ? value : fallback;
  function button({ label = '계속하기', variant = 'primary', size = 'md', state = '', iconName = '', iconOnly = false, action = 'press', type = 'button' } = {}) {
    variant = option(variant, ['primary','outline','ghost'], 'primary');
    size = option(size, ['sm','md','lg'], 'md');
    state = option(state, ['','hover','pressed','focus','disabled','loading'], '');
    type = option(type, ['button','submit','reset'], 'button');
    const disabled = state === 'disabled' || state === 'loading';
    return `<button type="${type}" class="ds-button" data-variant="${variant}" data-size="${size}"${state ? ` data-state="${state}"` : ''}${disabled ? ' disabled' : ''}${state === 'loading' ? ' aria-busy="true"' : ''}${iconOnly ? ` aria-label="${esc(label)}" data-icon-only` : ''}${action ? ` data-part-action="${esc(action)}"` : ''}${action === 'select-card' ? ' aria-pressed="false"' : ''}>${state === 'loading' ? '<span class="ds-spinner" aria-hidden="true"></span>' : iconName ? icon(iconName) : ''}${iconOnly ? '' : esc(label)}</button>`;
  }
  function input({ id = uid('input'), value = '', placeholder = '이름을 입력하세요', disabled = false, invalid = false, description = '', type = 'text', name = '' } = {}) {
    type = option(type, ['text','email','search','password','tel','url','number'], 'text');
    return `<input class="ds-input" id="${esc(id)}"${name ? ` name="${esc(name)}"` : ''} type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}"${disabled ? ' disabled' : ''}${invalid ? ' aria-invalid="true"' : ''}${description ? ` aria-describedby="${esc(description)}"` : ''}>`;
  }
  function field({ id = uid('field'), label = '컬렉션 이름', value = '', placeholder, state = '', help = '', name = '', type = 'text' } = {}) {
    state = option(state, ['','focus','disabled','error','success'], '');
    return `<div class="ds-field"${state ? ` data-state="${state}"` : ''}>${fieldLabel(id,label)}${input({ id, value, placeholder, disabled: state === 'disabled', invalid: state === 'error', description: help ? id + '-help' : '', name, type })}${help ? fieldDescription(id + '-help',help) : ''}</div>`;
  }
  const fieldLabel = (id, label) => `<label for="${esc(id)}">${esc(label)}</label>`;
  const fieldDescription = (id, text) => `<p class="ds-help" id="${esc(id)}">${esc(text)}</p>`;
  const cardTitle = title => `<h3>${esc(title)}</h3>`;
  const cardDescription = text => `<p>${esc(text)}</p>`;
  // body/actions accept trusted markup from other parts, not unsanitized user text.
  const cardBody = children => `<div class="ds-card-body">${children}</div>`;
  const cardActions = children => `<footer class="ds-card-actions">${children}</footer>`;
  function choice({ kind = 'checkbox', label = '선택하기', checked = false, disabled = false, indeterminate = false, name = 'visibility', value = label } = {}) {
    kind = option(kind, ['checkbox','radio','switch'], 'checkbox');
    return `<label class="ds-choice"><input type="${kind === 'switch' ? 'checkbox' : kind}" value="${esc(value)}"${kind === 'switch' ? ' class="ds-switch" role="switch"' : ''}${name ? ` name="${esc(name)}"` : ''}${checked ? ' checked' : ''}${disabled ? ' disabled' : ''}${indeterminate ? ' data-indeterminate' : ''}>${esc(label)}</label>`;
  }
  const badge = (label = '진행 중', tone = 'neutral') => `<span class="ds-badge" data-tone="${tone}">${esc(label)}</span>`;
  const divider = () => '<hr class="ds-divider">';
  const statusDot = (label = '연결됨') => `<span class="ds-status"><i aria-hidden="true"></i>${esc(label)}</span>`;
  function tabs(prefix = uid('tabs')) {
    return `<div class="ds-tabs"><div class="ds-tablist" role="tablist" aria-label="컬렉션 분류">${['전체','진행 중','완료'].map((name, i) => `<button type="button" class="ds-tab" id="${prefix}-tab-${i}" role="tab" aria-selected="${i === 0}" aria-controls="${prefix}-panel-${i}" tabindex="${i === 0 ? 0 : -1}">${name}</button>`).join('')}</div>${['모든 컬렉션을 보고 있어요.','진행 중인 컬렉션을 보고 있어요.','완료한 컬렉션을 보고 있어요.'].map((text, i) => `<div class="ds-tabpanel" id="${prefix}-panel-${i}" role="tabpanel" aria-labelledby="${prefix}-tab-${i}" tabindex="0"${i ? ' hidden' : ''}>${text}</div>`).join('')}</div>`;
  }
  function navigation(variant = 'line') {
    return `<nav class="ds-bottom-nav" data-variant="${variant}" aria-label="${variant === 'dock' ? '독 형태' : '밑줄 형태'} 하단 탐색">${[['홈','grid'],['탐색','search'],['저장','bookmark'],['설정','layers']].map(([name, art], i) => `<button type="button" data-part-action="nav" aria-pressed="${i === 0}">${icon(art)}<span>${name}</span></button>`).join('')}</nav>`;
  }
  function feedback() {
    return `<div class="ds-feedback-example">${button({ label: '저장 알림 띄우기', iconName: 'check', action: 'notify' })}<div class="ds-alert" role="status" data-part-feedback hidden>${statusDot('변경사항을 저장했어요.')}</div><div class="ds-progress-label"><span>파일 업로드</span><span>68%</span></div><progress class="ds-progress" value="68" max="100" aria-label="파일 업로드">68%</progress></div>`;
  }
  function card({ title = '브랜드 리뉴얼', description = '색과 서체, 첫인상을 모아 둔 컬렉션', tag = '진행 중', action = '선택하기', behavior = 'select-card' } = {}) {
    return `<article class="ds-card">${cardBody(badge(tag)+cardTitle(title)+cardDescription(description))}${divider()}${cardActions(button({ label: action, variant: 'outline', size: 'sm', iconName: 'arrow', action: behavior }))}</article>`;
  }
  function searchModule(prefix = uid('collection'), records = null) {
    const data = records || [
      { title: '봄의 색', description: '연한 초록과 따뜻한 노랑', tag: '진행 중' },
      { title: '주말의 기록', description: '산책하며 모은 장면들', tag: '완료' },
      { title: '작은 작업실', description: '다음 프로젝트의 첫 아이디어', tag: '진행 중' }
    ];
    return `<section class="ds-search-module" aria-label="컬렉션 검색"><form class="ds-search-form" data-part-search>${field({ id: prefix + '-query', label: '컬렉션 검색', name: 'query', placeholder: '이름으로 검색' })}<label class="ds-select-field"><span>상태</span><select class="ds-input" name="status"><option value="all">전체</option><option value="진행 중">진행 중</option><option value="완료">완료</option></select></label>${button({ label: '검색', type: 'submit', iconName: 'search', action: '' })}</form><p class="ds-result-count" role="status">${data.length}개의 컬렉션</p><div class="ds-results">${data.map((item, index) => `<div data-record-id="${esc(item.id ?? index)}" data-result="${esc(item.title + ' ' + item.description)}" data-result-status="${esc(item.tag)}">${card({ ...item, action: '열기', behavior: 'open-record' })}</div>`).join('')}</div><div class="ds-empty" hidden><p>일치하는 컬렉션이 없어요.</p>${button({ label: '전체 보기', variant: 'outline', action: 'reset-search' })}</div><section class="ds-record-detail" aria-label="컬렉션 상세" tabindex="-1" hidden><h3></h3><p></p><div>${button({ label: '목록으로', variant: 'outline', action: 'close-record' })}${button({ label: '컬렉션에 보관', action: 'save-record' })}</div></section><p class="ds-demo-note" role="status"></p></section>`;
  }
  function template({ title = '컬렉션', eyebrow = '나의 작업실', count = '3개', body = '<div class="ds-template-slot">검색·목록 모듈이 들어가는 자리</div>' } = {}) {
    return `<div class="ds-page"><header class="ds-page-header"><div><span class="ds-eyebrow">${esc(eyebrow)}</span><h2>${esc(title)}</h2></div>${badge(count)}</header>${body}${navigation('dock')}</div>`;
  }
  function page(prefix = uid('page')) {
    return template({ body: searchModule(prefix, [
      { title: '도시에서 발견한 작은 색의 조합', description: '걷다가 기록한 간판과 건물, 창가의 색', tag: '진행 중' },
      { title: '타이포그래피', description: '마음에 남은 글자의 표정', tag: '완료' },
      { title: '여름 프로젝트', description: '새 작업을 위한 자료와 메모', tag: '진행 중' }
    ]) });
  }
  function renderItem(id, prefix = uid('example'), options = {}) {
    const renderers = {
      checkbox: () => choice({ label: '링크로 공유', checked: options.state !== 'unchecked', disabled: options.state === 'disabled', indeterminate: options.state === 'indeterminate' }),
      radio: () => `<fieldset class="ds-radio-group"><legend>공개 범위</legend>${choice({kind:'radio',label:'나만 보기',checked:options.state !== 'unchecked',disabled:options.state === 'disabled',name:prefix+'-visibility'})}${choice({kind:'radio',label:'링크로 공유',disabled:options.state === 'disabled',name:prefix+'-visibility'})}</fieldset>`,
      switch: () => choice({ kind: 'switch', label: '알림 받기', checked: options.state !== 'unchecked', disabled: options.state === 'disabled' }),
      tokens: () => '<div class="ds-token-example"><span class="ds-color-example"></span><p>배경 · 본문 · 강조</p><h2>같은 기준으로 만듭니다.</h2><p>토큰을 바꾸면 연결된 부품이 함께 바뀝니다.</p></div>',
      icon: () => icon(options.icon || 'search'), divider, 'status-dot': statusDot,
      button: () => button({ variant: options.variant, size: options.size, state: options.state, iconName: options.icon || (options.iconOnly === 'true' ? 'search' : ''), iconOnly: options.iconOnly === 'true' }),
      input: () => `<label class="ds-field" for="${prefix}-input">이름${input({ id: prefix + '-input', disabled: options.state === 'disabled', type: options.type || 'text' })}</label>`,
      field: () => field({ id: prefix + '-field', state: options.state, value: options.state === 'success' ? '봄의 기록' : '', help: options.state === 'error' ? '이름을 입력해 주세요.' : options.state === 'success' ? '사용할 수 있는 이름이에요.' : '나중에 바꿀 수 있어요.' }),
      badge: () => badge(({success:'완료',warning:'확인 필요',error:'실패'})[options.tone] || '진행 중', options.tone || 'neutral'),
      tabs: () => tabs(prefix), 'bottom-nav': () => navigation(options.variant), feedback, card,
      'search-module': () => searchModule(prefix), template, page: () => page(prefix)
    };
    if (!renderers[id]) throw new RangeError('알 수 없는 부품: ' + id);
    return renderers[id]();
  }
  window.Pattove.parts = { esc, icon, button, input, field, fieldLabel, fieldDescription, cardTitle, cardDescription, cardBody, cardActions, choice, badge, divider, statusDot, tabs, navigation, feedback, card, searchModule, template, page, renderItem };
})();
