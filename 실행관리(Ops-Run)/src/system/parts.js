/* Public HTML renderers. The board, composed examples and exports use these same functions. */
(() => {
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
  const icon = name => window.Pattove.iconMarkup[name] || '';
  let instance = 0;
  const uid = kind => `pattove-${kind}-${++instance}`;
  const option = (value, allowed, fallback) => allowed.includes(value) ? value : fallback;
  // Look of a part from the registry gallery. No look given → no attribute → the part's base shape.
  const lookId = (id, look) => {
    if (!look) return '';
    const list = window.Pattove.systemRegistry?.index.get(id)?.gallery?.list || [];
    return list.some(v => v.id === look) ? look : list[0]?.id || look;
  };
  const lookAttr = (id, look) => look ? ` data-look="${esc(lookId(id, look))}"` : '';
  // ── Buttons ──────────────────────────────────────────────
  function button({ label = '계속하기', variant = 'primary', size = 'md', state = '', iconName = '', iconOnly = false, action = 'press', type = 'button', count = '' } = {}) {
    variant = option(variant, ['primary','outline','ghost'], 'primary');
    size = option(size, ['sm','md','lg'], 'md');
    state = option(state, ['','hover','pressed','focus','disabled','loading'], '');
    type = option(type, ['button','submit','reset'], 'button');
    const disabled = state === 'disabled' || state === 'loading';
    // A count joins the name ("보내기 3개") so the number is read with the action, not as a stray digit.
    const name = iconOnly ? label : count !== '' ? `${label} ${count}개` : '';
    return `<button type="${type}" class="ds-button" data-variant="${variant}" data-size="${size}"${state ? ` data-state="${state}"` : ''}${disabled ? ' disabled' : ''}${state === 'loading' ? ' aria-busy="true"' : ''}${name ? ` aria-label="${esc(name)}"` : ''}${iconOnly ? ' data-icon-only' : ''}${action ? ` data-part-action="${esc(action)}"` : ''}${action === 'select-card' ? ' aria-pressed="false"' : ''}>${state === 'loading' ? '<span class="ds-spinner" aria-hidden="true"></span>' : iconName ? icon(iconName) : ''}${iconOnly ? '' : esc(label)}${count !== '' && !iconOnly ? `<span class="ds-button-count" aria-hidden="true">${esc(count)}</span>` : ''}</button>`;
  }
  // A picture-only button: the label becomes the name that is read aloud.
  const iconButton = ({ label = '검색', iconName = 'search', variant = 'ghost', ...rest } = {}) => button({ ...rest, label, iconName, variant, iconOnly: true });
  const quiet = state => state === 'disabled' ? 'disabled' : '';
  // One main action with its count, the rest as quiet icon buttons.
  const actionRow = ({ size = 'md', state = '' } = {}) => `<div class="ds-action-row">${button({ label: '보내기', count: 3, size, state })}${[['edit','수정'],['bookmark','보관'],['upload','공유']].map(([art, label]) => iconButton({ label, iconName: art, size, state: quiet(state) })).join('')}</div>`;
  // Cancel stays a quiet text button on the left, the decision on the right.
  const confirmRow = ({ size = 'md', state = '' } = {}) => `<div class="ds-confirm-row">${button({ label: '취소', variant: 'ghost', size, state: quiet(state) })}${button({ label: '삭제하기', size, state })}</div>`;
  const actionBar = ({ state = '' } = {}) => `<div class="ds-action-bar">${button({ label: '3개 담기', state })}</div>`;
  // ── Inputs ───────────────────────────────────────────────
  // extra: trusted attribute text from the renderers below (inputmode, min, aria-label).
  function input({ id = uid('input'), value = '', placeholder = '이름을 입력하세요', disabled = false, invalid = false, description = '', type = 'text', name = '', look = '', extra = '' } = {}) {
    type = option(type, ['text','email','search','password','tel','url','number'], 'text');
    return `<input class="ds-input" id="${esc(id)}"${lookAttr('input', look)}${name ? ` name="${esc(name)}"` : ''} type="${type}" value="${esc(value)}"${placeholder ? ` placeholder="${esc(placeholder)}"` : ''}${extra}${disabled ? ' disabled' : ''}${invalid ? ' aria-invalid="true"' : ''}${description ? ` aria-describedby="${esc(description)}"` : ''}>`;
  }
  // The helper a value needs sits inside the same box as the value.
  const tool = (action, label, content, disabled, extra = '') => `<button type="button" class="ds-input-tool" data-part-action="${action}" aria-label="${esc(label)}"${extra}${disabled ? ' disabled' : ''}>${content}</button>`;
  const clearInput = ({ id = uid('clear'), label = '검색어', value = '봄의 색', placeholder = '검색어 입력', disabled = false, name = '' } = {}) =>
    `<span class="ds-input-group ds-clear-input">${input({ id, value, placeholder, disabled, name })}${tool('clear-input', label + ' 지우기', icon('close'), disabled)}</span>`;
  const unitInput = ({ id = uid('unit'), label = '금액', value = '12,000', placeholder = '0', disabled = false, units = ['원','달러'] } = {}) =>
    `<span class="ds-input-group ds-unit-input">${input({ id, value, placeholder, disabled, extra: ' inputmode="numeric"' })}<select class="ds-input-unit" aria-label="${esc(label)} 단위"${disabled ? ' disabled' : ''}>${units.map(unit => `<option>${esc(unit)}</option>`).join('')}</select></span>`;
  const stepper = ({ id = uid('stepper'), value = '1', min = 0, max, disabled = false } = {}) =>
    `<span class="ds-input-group ds-stepper">${tool('step', '하나 빼기', icon('minus'), disabled || Number(value) <= Number(min), ' data-step="-1"')}${input({ id, value, type: 'number', placeholder: '', disabled, extra: ` min="${Number(min)}"${max===undefined?'':` max="${Number(max)}"`} inputmode="numeric"` })}${tool('step', '하나 더하기', icon('plus'), disabled || (max!==undefined && Number(value)>=Number(max)), ' data-step="1"')}</span>`;
  // The show button flips the typed secret to plain text in place, so a typo is seen instead of retyped.
  const passwordInput = ({ id = uid('password'), label = '비밀번호', value = '', placeholder = '8자 이상', disabled = false } = {}) =>
    `<span class="ds-input-group ds-password-input">${input({ id, value, placeholder, disabled, type: 'password' })}${tool('reveal', label + ' 보기', '보기', disabled)}</span>`;
  function field({ id = uid('field'), label = '컬렉션 이름', value = '', placeholder, state = '', help = '', name = '', type = 'text' } = {}) {
    state = option(state, ['','focus','disabled','error','success'], '');
    return `<div class="ds-field"${state ? ` data-state="${state}"` : ''}>${fieldLabel(id,label)}${input({ id, value, placeholder, disabled: state === 'disabled', invalid: state === 'error', description: help ? id + '-help' : '', name, type })}${help ? fieldDescription(id + '-help',help) : ''}</div>`;
  }
  const fieldLabel = (id, label) => `<label for="${esc(id)}">${esc(label)}</label>`;
  const fieldDescription = (id, text) => `<p class="ds-help" id="${esc(id)}">${esc(text)}</p>`;
  // A start and an end value share one box, so the eye stops once instead of twice.
  function dateRange({ id = uid('range'), label = '기간', start = '9월 1일', end = '9월 30일', state = '', help = '' } = {}) {
    state = option(state, ['','focus','disabled','error','success'], '');
    const own = { disabled: state === 'disabled', invalid: state === 'error', description: help ? id + '-help' : '' };
    return `<div class="ds-field ds-date-range"${state ? ` data-state="${state}"` : ''}>${fieldLabel(id, label)}<span class="ds-input-group">${input({ ...own, id, value: start, placeholder: '시작' })}<span class="ds-input-join" aria-hidden="true">~</span>${input({ ...own, id: id + '-end', value: end, placeholder: '끝', extra: ` aria-label="${esc(label)} 끝"` })}</span>${help ? fieldDescription(id + '-help', help) : ''}</div>`;
  }
  // ── Cards ────────────────────────────────────────────────
  const cardTitle = title => `<h3>${esc(title)}</h3>`;
  const cardDescription = text => `<p>${esc(text)}</p>`;
  // body/actions accept trusted markup from other parts, not unsanitized user text.
  const cardBody = children => `<div class="ds-card-body">${children}</div>`;
  const cardActions = children => `<footer class="ds-card-actions">${children}</footer>`;
  const cardInside = ({ title, description, tag, action, behavior }) => `${cardBody(badge(tag)+cardTitle(title)+cardDescription(description))}${divider()}${cardActions(button({ label: action, variant: 'outline', size: 'sm', iconName: 'arrow', action: behavior }))}`;
  const cardSample = { title: '브랜드 리뉴얼', description: '색과 서체, 첫인상을 모아 둔 컬렉션', tag: '진행 중', action: '선택하기', behavior: 'select-card' };
  const cardLooks = ['raised','filled','outlined'];
  function card({ look = 'raised', ...content } = {}) {
    look = option(look, cardLooks, 'raised');
    return `<article class="ds-card" data-look="${look}">${cardInside({ ...cardSample, ...content })}</article>`;
  }
  // A picture well on the left (the first letter when there is no picture), words on the right.
  const listCard = ({ initial = '', ...content } = {}) => `<article class="ds-card ds-list-card"><div class="ds-card-media" aria-hidden="true">${initial ? esc(initial) : icon('image')}</div>${cardInside({ ...cardSample, ...content })}</article>`;
  const mediaCard = (content = {}) => `<article class="ds-card ds-media-card"><div class="ds-card-media" aria-hidden="true">${icon('image')}</div>${cardInside({ ...cardSample, ...content })}</article>`;
  // ── Selection ────────────────────────────────────────────
  function choice({ kind = 'checkbox', label = '선택하기', detail = '', checked = false, disabled = false, indeterminate = false, name = 'visibility', value = label, part = '', className = '' } = {}) {
    kind = option(kind, ['checkbox','radio','switch'], 'checkbox');
    const words = detail ? `<span class="ds-choice-text"><strong>${esc(label)}</strong><small>${esc(detail)}</small></span>` : esc(label);
    return `<label class="ds-choice${className ? ' ' + className : ''}"><input type="${kind === 'switch' ? 'checkbox' : kind}" value="${esc(value)}"${kind === 'switch' ? ' class="ds-switch" role="switch"' : ''}${name ? ` name="${esc(name)}"` : ''}${checked ? ' checked' : ''}${disabled ? ' disabled' : ''}${indeterminate ? ' data-indeterminate' : ''}${part ? ` data-part="${esc(part)}"` : ''}>${words}</label>`;
  }
  const radioGroup = (legend, inner, className = 'ds-radio-group') => `<fieldset class="${className}"><legend>${esc(legend)}</legend>${inner}</fieldset>`;
  const filterChip = ({ label = '디자인', checked = false, disabled = false, type = 'checkbox', name = '', value = label } = {}) =>
    `<label class="ds-chip"><input type="${option(type, ['checkbox','radio'], 'checkbox')}"${name ? ` name="${esc(name)}"` : ''} value="${esc(value)}"${checked ? ' checked' : ''}${disabled ? ' disabled' : ''}><span>${esc(label)}</span></label>`;
  const statuses = [['all','전체'],['진행 중','진행 중'],['완료','완료']];
  const filterChipRow = ({ name = 'status', legend = '상태', items = statuses, picked = 'all' } = {}) =>
    `<fieldset class="ds-chip-group"><legend>${esc(legend)}</legend>${items.map(([value, label]) => filterChip({ type: 'radio', name, value, label, checked: value === picked })).join('')}</fieldset>`;
  const segmentedButton = ({ name = uid('segment'), disabled = false } = {}) =>
    `<fieldset class="ds-segmented"><legend>보기 단위</legend>${['일','주','월'].map((label, i) => `<label class="ds-segment"><input type="radio" name="${esc(name)}" value="${label}"${i === 1 ? ' checked' : ''}${disabled ? ' disabled' : ''}><span>${label}</span></label>`).join('')}</fieldset>`;
  // Settings lists: the whole row is the tap area, the name on the left and the control on the right.
  const choiceList = (legend, rows) => radioGroup(legend, rows, 'ds-choice-list');
  // One parent box above its children; the parent shows "some" when only part is picked.
  function selectAllList({ name = uid('alerts'), state = 'checked' } = {}) {
    const off = { disabled: state === 'disabled' };
    const picked = state === 'unchecked' ? [] : state === 'indeterminate' ? [0] : [0, 1, 2];
    const kids = ['댓글','좋아요','새 팔로워'].map((label, i) => choice({ label, name, checked: picked.includes(i), ...off })).join('');
    const parent = choice({ label: '모두 선택', name: '', part: 'select-all', checked: picked.length === 3, indeterminate: picked.length > 0 && picked.length < 3, ...off });
    return `<fieldset class="ds-select-all"><legend>받을 알림</legend>${parent}${kids}</fieldset>`;
  }
  // ── Status ───────────────────────────────────────────────
  // The icon look repeats the tone as a shape, so the state reads without telling colours apart.
  const toneIcon = { success: 'check', warning: 'warning', error: 'close', neutral: 'rotate' };
  const badge = (label = '진행 중', tone = 'neutral', look = '') => `<span class="ds-badge" data-tone="${tone}"${lookAttr('badge', look)}>${lookId('badge', look) === 'icon' ? icon(toneIcon[tone] || 'rotate') : ''}${esc(label)}</span>`;
  // How many new items wait on the icon, so nobody opens the place just to count.
  const countBadge = ({ count = 3, art = 'bell' } = {}) => {
    const n = Math.max(0, Number(count) || 0);
    return `<span class="ds-count-badge" role="img" aria-label="${n > 0 ? `새 알림 ${n}개` : '새 알림 없음'}">${icon(art)}${n > 0 ? `<span class="ds-badge-count" aria-hidden="true">${n > 99 ? '99+' : n}</span>` : ''}</span>`;
  };
  const divider = () => '<hr class="ds-divider">';
  const textDivider = (label = '또는') => `<hr class="ds-text-divider" data-label="${esc(label)}">`;
  const statusDot = (label = '연결됨') => `<span class="ds-status"><i aria-hidden="true"></i>${esc(label)}</span>`;
  const avatar = ({ name = '김하나', online = true } = {}) => `<span class="ds-avatar" role="img" aria-label="${esc(name)}, ${online ? '접속 중' : '자리 비움'}"><span aria-hidden="true">${esc([...name][0] || '')}</span>${online ? '<i aria-hidden="true"></i>' : ''}</span>`;
  const iconNames = { arrow: '다음', bell: '알림', bookmark: '보관', box: '상자', check: '완료', 'chevron-down': '펼치기', chevron: '더 보기', close: '닫기', compass: '탐색', edit: '수정', file: '파일', folder: '폴더', grid: '전체', info: '안내', layers: '설정', menu: '메뉴', plus: '추가', rotate: '새로 고침', search: '검색', shapes: '모양', upload: '올리기', warning: '주의' };
  const iconMark = (name = 'search') => `<span class="ds-icon">${icon(name)}</span>`;
  // The icon's meaning printed under it, for icons people have not learned yet.
  const iconLabel = (name = 'search') => `<span class="ds-icon-label">${icon(name)}<span class="ds-icon-name">${esc(iconNames[name] || name)}</span></span>`;
  const notice = (text = '변경사항을 저장했어요.') => `<div class="ds-alert" role="status">${statusDot(text)}</div>`;
  // The toast carries its own undo, so the action runs at once instead of asking "are you sure?" first.
  const toast = ({ text = '메일을 보관함으로 옮겼어요.', open = true } = {}) => `<div class="ds-toast" role="status" data-part-feedback${open ? '' : ' hidden'}>${statusDot(text)}<button type="button" class="ds-alert-undo" data-part-action="undo">되돌리기</button></div>`;
  const percent = value => Math.min(100, Math.max(0, Number(value) || 0));
  const progressLabel = (label, right) => `<div class="ds-progress-label"><span>${esc(label)}</span><span>${esc(right)}</span></div>`;
  const progressBar = ({ value = 68, label = '파일 업로드' } = {}) => { const v = percent(value); return `<div class="ds-progress-block">${progressLabel(label, v + '%')}<progress class="ds-progress" value="${v}" max="100" aria-label="${esc(label)}">${v}%</progress></div>`; };
  // The number sits inside a round gauge; the real progress element stays for screen readers.
  const progressRing = ({ value = 68, label = '파일 업로드' } = {}) => { const v = percent(value); return `<div class="ds-progress-block ds-progress-ring-block"><span class="ds-progress-ring" aria-hidden="true" style="--value:${v}"><b>${v}%</b></span>${progressLabel(label, v + '%')}<progress class="ds-progress" value="${v}" max="100" aria-label="${esc(label)}">${v}%</progress></div>`; };
  // The bar is cut into one block per step, so progress reads as a count.
  const stepBar = ({ step = 3, steps = 5, label = '가입 단계' } = {}) => `<div class="ds-progress-block ds-step-bar" style="--steps:${Number(steps)}">${progressLabel(label, `${step}/${steps}`)}<progress class="ds-progress" value="${Number(step)}" max="${Number(steps)}" aria-label="${esc(label)}">${step}/${steps}</progress></div>`;
  // ── Navigation ───────────────────────────────────────────
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
  // ── Search and results ───────────────────────────────────
  const statusSelect = () => `<label class="ds-select-field"><span>상태</span><select class="ds-input" name="status">${statuses.map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}</select></label>`;
  const searchButton = () => button({ label: '검색', type: 'submit', iconName: 'search', action: '' });
  // filter: a status control between the query and the button (a filter-chip row); without it, a status menu.
  const searchForm = ({ prefix = uid('search'), filter = '' } = {}) =>
    `<form class="ds-search-form" data-part-search>${field({ id: prefix + '-query', label: '컬렉션 검색', name: 'query', placeholder: '이름으로 검색' })}${filter || statusSelect()}${searchButton()}</form>`;
  // Query, status and button share one rounded bar; the labels stay for screen readers only.
  const searchBar = ({ prefix = uid('search') } = {}) =>
    `<form class="ds-search-bar" data-part-search role="search">${field({ id: prefix + '-query', label: '컬렉션 검색', name: 'query', placeholder: '이름으로 검색' })}${statusSelect()}${searchButton()}</form>`;
  const sampleRecords = [
    { title: '봄의 색', description: '연한 초록과 따뜻한 노랑', tag: '진행 중' },
    { title: '주말의 기록', description: '산책하며 모은 장면들', tag: '완료' },
    { title: '작은 작업실', description: '다음 프로젝트의 첫 아이디어', tag: '진행 중' }
  ];
  const resultCount = (n, unit) => `<p class="ds-result-count" role="status" data-unit="${esc(unit)}">${n}${esc(unit)}</p>`;
  const cell = (item, index, inner) => `<div data-record-id="${esc(item.id ?? index)}" data-result="${esc(item.title + ' ' + item.description)}" data-result-status="${esc(item.tag)}">${inner}</div>`;
  // Every result block is a count line plus the records; alone, a card press selects it, inside the page it opens the record.
  function results({ records = sampleRecords, action = '선택하기', behavior = 'select-card', layout = 'grid', unit = '개의 컬렉션' } = {}) {
    const own = item => ({ ...item, action, behavior });
    const draw = (item, index) => layout === 'feature' && index === 0 ? mediaCard(own(item)) : layout === 'people' ? listCard({ ...own(item), initial: [...item.title][0] }) : card(own(item));
    const kind = { list: ' ds-result-list', feature: ' ds-result-feature', people: ' ds-people-list' }[layout] || '';
    return `${resultCount(records.length, unit)}<div class="ds-results${kind}">${records.map((item, index) => cell(item, index, draw(item, index))).join('')}</div>`;
  }
  const resultGrid = options => results({ ...options, layout: 'grid' });
  const resultList = options => results({ ...options, layout: 'list' });
  const featuredResults = options => results({ ...options, layout: 'feature' });
  const emptyState = ({ hidden = false, text = '일치하는 컬렉션이 없어요.' } = {}) => `<div class="ds-empty"${hidden ? ' hidden' : ''}><p>${esc(text)}</p>${button({ label: '전체 보기', variant: 'outline', action: 'reset-search' })}</div>`;
  // Narrows the list while typing: one field, no status menu, no search button, each row a face to tap.
  const people = [
    { title: '김하나', description: '디자인팀 · 서울', tag: '접속 중' },
    { title: '이도윤', description: '개발팀 · 부산', tag: '자리 비움' },
    { title: '박서연', description: '기획팀 · 서울', tag: '접속 중' }
  ];
  const peoplePicker = ({ prefix = uid('people') } = {}) =>
    `<section class="ds-search-module ds-people-picker" aria-label="사람 고르기"><form class="ds-people-search" data-part-search data-live>${field({ id: prefix + '-query', label: '사람 찾기', name: 'query', placeholder: '이름 한두 글자', type: 'search' })}</form>${results({ records: people, layout: 'people', unit: '명' })}${emptyState({ hidden: true, text: '일치하는 사람이 없어요.' })}<p class="ds-demo-note" role="status"></p></section>`;
  const statRow = (list = [['전체','3개'],['진행 중','2개'],['완료','1개']]) => `<ul class="ds-page-stats" role="list">${list.map(([label, value]) => `<li><strong>${esc(value)}</strong><span>${esc(label)}</span></li>`).join('')}</ul>`;
  const inlineForm = ({ prefix = uid('settings') } = {}) => `<div class="ds-inline-form">${[['name','표시 이름','하나'],['time','알림 시각','오전 9시'],['city','지역','서울']].map(([key, label, value]) => field({ id: `${prefix}-${key}`, label, value })).join('')}</div>`;
  // ── Screens ──────────────────────────────────────────────
  // The collection search composed from the small blocks: a form (or bar), a result block, the empty state and the record detail.
  function collectionSearch(prefix, records, kind = 'grid') {
    const form = kind === 'bar' ? searchBar({ prefix }) : searchForm({ prefix, filter: kind === 'chips' ? filterChipRow() : '' });
    const list = (kind === 'list' ? resultList : resultGrid)({ records, action: '열기', behavior: 'open-record' });
    return `<section class="ds-search-module" aria-label="컬렉션 검색">${form}${list}${emptyState({ hidden: true })}<section class="ds-record-detail" aria-label="컬렉션 상세" tabindex="-1" hidden><h3></h3><p></p><div>${button({ label: '목록으로', variant: 'outline', action: 'close-record' })}${button({ label: '컬렉션에 보관', action: 'save-record' })}</div></section><p class="ds-demo-note" role="status"></p></section>`;
  }
  // Each screen arrangement brings its own bottom bar shape and, for the page, the search blocks that suit it.
  const pageLooks = { stack: ['minimal','grid'], hero: ['pill','bar'], appbar: ['line','list'], sheet: ['glass','chips'], dashboard: ['float','list'] };
  function template({ title = '컬렉션', eyebrow = '나의 작업실', count = '3개', body = '<div class="ds-template-slot">검색·목록 블록이 들어가는 자리</div>', look = 'stack', summary = [['전체', count], ['진행 중', '2개'], ['완료', '1개']] } = {}) {
    look = option(look, Object.keys(pageLooks), 'stack');
    return `<div class="ds-page" data-look="${look}"><header class="ds-page-header"><div><span class="ds-eyebrow">${esc(eyebrow)}</span><h2>${esc(title)}</h2></div>${badge(count)}</header>${look === 'dashboard' ? statRow(summary) : ''}${body}${navigation(pageLooks[look][0])}</div>`;
  }
  function page(prefix = uid('page'), look = 'stack') {
    look = option(look, Object.keys(pageLooks), 'stack');
    const records = [
      { title: '도시에서 발견한 작은 색의 조합', description: '걷다가 기록한 간판과 건물, 창가의 색', tag: '진행 중' },
      { title: '타이포그래피', description: '마음에 남은 글자의 표정', tag: '완료' },
      { title: '여름 프로젝트', description: '새 작업을 위한 자료와 메모', tag: '진행 중' }
    ];
    const summary = [['전체', records.length + '개'], ...['진행 중','완료'].map(tag => [tag, records.filter(item => item.tag === tag).length + '개'])];
    return template({ look, summary, body: collectionSearch(prefix, records, pageLooks[look][1]) });
  }
  // One swatch row per token kind; an empty name marks the kind's default value.
  // With text, each sample is a span carrying that text (type kinds); otherwise an empty <i> swatch.
  function tokenMarks(className, names, text = '') {
    const mark = t => text ? `<span${t ? ` data-token="${t}"` : ''}>${text}</span>` : t ? `<i data-token="${t}"></i>` : '<i></i>';
    return `<span class="ds-token-row ${className}">${names.map(mark).join('')}</span>`;
  }
  const safeHref = value => /^(?:https?:|mailto:|tel:|#|\/(?!\/)|\.\.?\/)/i.test(String(value)) ? esc(value) : '#';
  const inputChoices = [{value:'private',label:'나만 보기'},{value:'team',label:'팀과 공유'},{value:'public',label:'모두 공개'}];
  const extended = {
    'error-summary'(prefix,{title='입력한 내용을 확인하세요.',errors=[{message:'필수 항목을 확인하세요.'}]}={}) {
      return `<div class="ds-error-summary" tabindex="-1" role="region" aria-label="${esc(title)}"${errors.length?'':' hidden'}><h3>${esc(title)}</h3><ul>${errors.map(error=>`<li>${error.id?`<a href="#${esc(encodeURIComponent(error.id))}" data-error-target="${esc(error.id)}">${esc(error.message)}</a>`:esc(error.message)}</li>`).join('')}</ul></div>`;
    },
    'summary-list'(prefix,{title='신청 내용',items=[{label:'이름',value:'김하나'},{label:'수업',value:'기초반'}]}={}) {
      return `<section class="ds-summary-list"><h2>${esc(title)}</h2><dl>${items.map(item=>`<div><dt>${esc(item.label)}</dt><dd>${esc(item.value)}</dd>${item.href?`<dd><a href="${safeHref(item.href)}" aria-label="${esc(item.label)} 수정">수정</a></dd>`:''}</div>`).join('')}</dl></section>`;
    },
    'data-form'(prefix,{title='신청하기',submitLabel='제출',successMessage='접수했어요.',fields=[{name:'name',label:'이름',type:'text',required:true,autoComplete:'name'},{name:'email',label:'이메일',type:'email',required:true,autoComplete:'email'}]}={}) {
      const content=fields.map(f=>{
        const id=prefix+'-'+f.name,type=option(f.type,['text','email','password','tel','url','number','date','time','textarea','select','checkbox'],'text');
        const attrs=` id="${esc(id)}" name="${esc(f.name)}" data-field-label="${esc(f.label)}"${f.required?' required':''} aria-describedby="${esc(id)}-help"${f.autoComplete?` autocomplete="${esc(f.autoComplete)}"`:''}${['min','max','step','maxLength'].filter(k=>f[k]!==undefined).map(k=>` ${k.toLowerCase()}="${esc(f[k])}"`).join('')}`;
        const control=type==='textarea'?`<textarea class="ds-input ds-textarea"${attrs} rows="4">${esc(f.value??'')}</textarea>`:type==='select'?`<select class="ds-input"${attrs}>${f.items.map(i=>`<option value="${esc(i.value)}"${i.value===f.value?' selected':''}>${esc(i.label)}</option>`).join('')}</select>`:type==='checkbox'?`<label class="ds-choice"><input type="checkbox"${attrs}${f.value?' checked':''}>${esc(f.label)}</label>`:`<input class="ds-input" type="${type}"${attrs} value="${esc(f.value??'')}">`;
        return `<div class="ds-field">${type==='checkbox'?'':fieldLabel(id,f.label)}${control}<p class="ds-help" id="${esc(id)}-help" data-field-help="${esc(f.help||'')}">${esc(f.help||'')}</p></div>`;
      }).join('');
      return `<form method="post" class="ds-workflow ds-data-form" data-async-form="data" data-success-message="${esc(successMessage)}" aria-label="${esc(title)}" novalidate><h2>${esc(title)}</h2>${extended['error-summary'](prefix+'-errors',{errors:[]})}<noscript><p>이 양식을 사용하려면 JavaScript를 켜주세요.</p></noscript><fieldset disabled data-await-script>${content}${button({label:submitLabel,type:'submit',action:''})}</fieldset><p role="status" aria-live="polite"></p></form>`;
    },
    textarea(prefix, {label='메모',value='',help='',error='',disabled=false,required=false,name='memo'}={}) {
      return `<div class="ds-field ds-textarea">${fieldLabel(prefix,label)}<textarea class="ds-input" id="${esc(prefix)}" name="${esc(name)}" rows="4"${disabled?' disabled':''}${required?' required':''}${error?' aria-invalid="true"':''}${help||error?` aria-describedby="${esc(prefix)}-help"`:''}>${esc(value)}</textarea>${help||error?fieldDescription(prefix+'-help',error||help):''}</div>`;
    },
    select(prefix, {label='공개 범위',value='private',items=inputChoices,disabled=false,required=false,name='visibility',error=''}={}) {
      return `<div class="ds-field ds-select">${fieldLabel(prefix,label)}<select class="ds-input" id="${esc(prefix)}" name="${esc(name)}"${disabled?' disabled':''}${required?' required':''}${error?` aria-invalid="true" aria-describedby="${esc(prefix)}-help"`:''}>${items.map(i=>`<option value="${esc(i.value)}"${i.value===value?' selected':''}${i.disabled?' disabled':''}>${esc(i.label)}</option>`).join('')}</select>${error?fieldDescription(prefix+'-help',error):''}</div>`;
    },
    combobox(prefix,{label='도시',items=['서울','부산','제주'],value='',disabled=false,name='city'}={}) {
      return `<div class="ds-field ds-combobox" data-combobox>${fieldLabel(prefix,label)}<input class="ds-input" id="${esc(prefix)}" name="${esc(name)}" value="${esc(value)}" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${esc(prefix)}-list" autocomplete="off"${disabled?' disabled':''}><ul id="${esc(prefix)}-list" role="listbox" aria-label="${esc(label)}" hidden>${items.map((item,i)=>`<li id="${esc(prefix)}-option-${i}" role="option" aria-selected="false" data-value="${esc(item)}">${esc(item)}</li>`).join('')}</ul><span class="ds-help" role="status"></span></div>`;
    },
    'file-upload'(prefix,{label='파일 선택',accept='',multiple=true,disabled=false,maxBytes=10485760}={}) {
      return `<div class="ds-field ds-file-upload" data-file-upload data-max-bytes="${Number(maxBytes)}">${fieldLabel(prefix,label)}<input id="${esc(prefix)}" name="files" type="file"${accept?` accept="${esc(accept)}"`:''}${multiple?' multiple':''}${disabled?' disabled':''} aria-describedby="${esc(prefix)}-status"><p id="${esc(prefix)}-status" class="ds-help" role="status">선택한 파일이 없어요.</p></div>`;
    },
    dialog(prefix,{title='내용 확인',body='선택한 내용을 확인하세요.',trigger='열기',confirmLabel='',drawer=false}={}) {
      return `<div class="ds-dialog-demo">${button({label:trigger,action:''}).replace('<button ',`<button data-dialog-open="${esc(prefix)}" aria-haspopup="dialog" aria-controls="${esc(prefix)}" `)}<dialog id="${esc(prefix)}" class="ds-dialog${drawer?' ds-drawer':''}" aria-labelledby="${esc(prefix)}-title"><h2 id="${esc(prefix)}-title">${esc(title)}</h2><p>${esc(body)}</p><form method="dialog" class="ds-confirm-row"><button class="ds-button" data-variant="outline" value="cancel" autofocus>${confirmLabel?'취소':'닫기'}</button>${confirmLabel?`<button class="ds-button" value="confirm">${esc(confirmLabel)}</button>`:''}</form></dialog><span class="ds-help" role="status"></span></div>`;
    },
    'confirmation-dialog'(prefix,options={}) {return extended.dialog(prefix,{title:'항목을 삭제할까요?',body:'삭제한 항목은 복구할 수 없어요.',trigger:'삭제',confirmLabel:'삭제하기',...options});},
    drawer(prefix,options={}) {return extended.dialog(prefix,{title:'필터',trigger:'필터 열기',drawer:true,...options});},
    popover(prefix,{label='추가 정보',text='링크를 받은 사람만 이 자료를 볼 수 있어요.'}={}) {
      return `<div class="ds-popover-demo"><button class="ds-button" type="button" popovertarget="${esc(prefix)}">${esc(label)}</button><div class="ds-popover" id="${esc(prefix)}" popover><p>${esc(text)}</p><button class="ds-button" type="button" popovertarget="${esc(prefix)}" popovertargetaction="hide">닫기</button></div></div>`;
    },
    tooltip(prefix,{label='보관',text='다음에 다시 볼 수 있게 보관해요.'}={}) {
      return `<span class="ds-tooltip"><button type="button" class="ds-button" aria-describedby="${esc(prefix)}">${esc(label)}</button><span id="${esc(prefix)}" role="tooltip">${esc(text)}</span></span>`;
    },
    accordion(prefix,{items=[{title:'보관한 자료는 어디에서 보나요?',body:'보관함에서 다시 열 수 있어요.'},{title:'공유를 취소할 수 있나요?',body:'공개 범위를 나만 보기로 바꾸세요.'}]}={}) {
      return `<div class="ds-accordion">${items.map(i=>`<details><summary>${esc(i.title)}</summary><p>${esc(i.body)}</p></details>`).join('')}</div>`;
    },
    breadcrumb(prefix,{items=[{label:'홈',href:'#home'},{label:'보관함',href:'#saved'},{label:'봄의 색'}]}={}) {
      return `<nav class="ds-breadcrumb" aria-label="현재 위치"><ol>${items.map((i,n)=>`<li>${n===items.length-1?`<span aria-current="page">${esc(i.label)}</span>`:`<a href="${safeHref(i.href)}">${esc(i.label)}</a>`}</li>`).join('')}</ol></nav>`;
    },
    pagination(prefix,{page=1,total=8}={}) {
      total=Math.max(1,Math.floor(Number(total)||1));page=Math.max(1,Math.min(total,Math.floor(Number(page)||1)));
      return `<nav class="ds-pagination" aria-label="페이지 이동" data-page="${page}" data-total="${total}"><button class="ds-button" type="button" data-page-step="-1"${page===1?' disabled':''}>이전</button><span role="status">${page} / ${total}</span><button class="ds-button" type="button" data-page-step="1"${page===total?' disabled':''}>다음</button></nav>`;
    },
    'side-nav'(prefix,{label='작업 메뉴',items=[{label:'자료',href:'#records'},{label:'보관함',href:'#saved'},{label:'설정',href:'#settings'}],current='#records'}={}) {
      return `<nav class="ds-side-nav" aria-label="${esc(label)}">${items.map(i=>`<a href="${safeHref(i.href)}"${i.href===current?' aria-current="page"':''}>${esc(i.label)}</a>`).join('')}</nav>`;
    },
    spinner(prefix,{label='불러오는 중'}={}) {return `<span class="ds-loading" role="status"><span class="ds-spinner" aria-hidden="true"></span>${esc(label)}</span>`;},
    skeleton(prefix,{label='불러오는 중'}={}) {return `<div class="ds-skeleton" role="status" aria-label="${esc(label)}"><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span></div>`;},
    'error-state'(prefix,{title='불러오지 못했어요.',message='연결 상태를 확인한 뒤 다시 시도하세요.',action='다시 시도'}={}) {
      return `<section class="ds-error-state" aria-labelledby="${esc(prefix)}-title"><h3 id="${esc(prefix)}-title">${esc(title)}</h3><p>${esc(message)}</p><button class="ds-button" type="button" data-retry>${esc(action)}</button></section>`;
    },
    'offline-state'(prefix,options={}) {return extended['error-state'](prefix,{title:'인터넷에 연결되지 않았어요.',message:'작성한 내용은 이 화면에 남아 있어요.',...options});},
    'settings-form'(prefix,{title='프로필 설정',name='하나',memo='',initialValues={}}={}) {
      return `<form method="post" class="ds-workflow" data-async-form="settings" aria-label="${esc(title)}"><h2>${esc(title)}</h2><noscript><p>이 양식을 사용하려면 JavaScript를 켜주세요.</p></noscript><fieldset disabled data-await-script>${field({id:prefix+'-name',label:'표시 이름',value:initialValues.name??name,name:'name'})}${extended.textarea(prefix+'-memo',{label:'소개',value:initialValues.memo??memo,name:'memo'})}${extended.select(prefix+'-visibility',{value:initialValues.visibility??'private'})}${choice({kind:'switch',label:'알림 받기',checked:initialValues.notification??true,name:'notification',value:'on'})}${button({label:'저장',type:'submit',action:''})}</fieldset><p role="status" aria-live="polite"></p></form>`;
    },
    'login-form'(prefix,{title='로그인'}={}) {
      return `<form method="post" class="ds-workflow" data-async-form="login" aria-label="${esc(title)}"><h2>${esc(title)}</h2><noscript><p>이 양식을 사용하려면 JavaScript를 켜주세요.</p></noscript><fieldset disabled data-await-script><div class="ds-field">${fieldLabel(prefix+'-email','이메일')}${input({id:prefix+'-email',type:'email',name:'email',placeholder:'',extra:' required autocomplete="username"'})}</div><div class="ds-field">${fieldLabel(prefix+'-password','비밀번호')}${input({id:prefix+'-password',type:'password',name:'password',placeholder:'',extra:' required autocomplete="current-password"'})}</div>${button({label:'로그인',type:'submit',action:''})}</fieldset><p role="status" aria-live="polite"></p></form>`;
    },
    'input-result'(prefix,{title='금액 계산',initialPrice=12000,initialQuantity=1}={}) {
      return `<form method="post" class="ds-workflow" data-calculator aria-label="${esc(title)}"><h2>${esc(title)}</h2><noscript><p>이 양식을 사용하려면 JavaScript를 켜주세요.</p></noscript><fieldset disabled data-await-script><div class="ds-field">${fieldLabel(prefix+'-price','개당 금액')}${input({id:prefix+'-price',type:'number',name:'price',value:initialPrice,extra:' min="0" step="0.01" required'})}</div><div class="ds-field">${fieldLabel(prefix+'-quantity','수량')}${input({id:prefix+'-quantity',type:'number',name:'quantity',value:initialQuantity,extra:' min="1" step="1" required'})}</div>${button({label:'계산',type:'submit',action:''})}</fieldset><output aria-live="polite" aria-label="계산 결과"></output></form>`;
    },
    'comparison'(prefix,{title='수업 비교',items=[{id:'basic',name:'기초반',price:'30,000원',detail:'주 1회'},{id:'advanced',name:'심화반',price:'50,000원',detail:'주 2회'}]}={}) {
      return `<section class="ds-comparison" aria-labelledby="${esc(prefix)}-title"><h2 id="${esc(prefix)}-title">${esc(title)}</h2><div class="ds-comparison-grid">${items.map(i=>`<article><h3>${esc(i.name)}</h3><p>${esc(i.price)}</p><p>${esc(i.detail)}</p><button type="button" class="ds-button" data-compare-id="${esc(i.id)}" data-compare-name="${esc(i.name)}" aria-pressed="false">${esc(i.name)} 선택</button></article>`).join('')}</div><p role="status"></p></section>`;
    },
    'article-page'(prefix,{title='기록을 오래 남기는 방법',headingLevel=1,sections=[{title:'먼저 고르기',body:'다시 보고 싶은 장면부터 골라 둡니다.'},{title:'이름 붙이기',body:'나중에 찾을 수 있게 날짜와 대상을 적습니다.'},{title:'다시 살펴보기',body:'모아 둔 기록에서 다음 작업의 단서를 찾습니다.'}]}={}) {
      return `<article class="ds-article"><${headingLevel===2?'h2':'h1'}>${esc(title)}</${headingLevel===2?'h2':'h1'}><nav aria-label="목차"><ol>${sections.map((s,i)=>`<li><a href="#${esc(prefix)}-${i}">${esc(s.title)}</a></li>`).join('')}</ol></nav>${sections.map((s,i)=>`<section id="${esc(prefix)}-${i}"><${headingLevel===2?'h3':'h2'}>${esc(s.title)}</${headingLevel===2?'h3':'h2'}><p>${esc(s.body)}</p></section>`).join('')}</article>`;
    }
  };
  function renderItem(id, prefix = uid('example'), options = {}) {
    if (extended[id]) return extended[id](prefix, {...options, disabled:options.disabled || options.state === 'disabled', error:options.state === 'error' ? '입력한 값을 확인하세요.' : options.error});
    if (id === 'data-table') return window.Pattove.admin.renderTable(prefix, options);
    if (id === 'record-editor') return window.Pattove.admin.renderEditorDemo(prefix);
    // The shell's example: side menu, heading band and the slot where the table and editor blocks go.
    if (id === 'admin-shell') return window.Pattove.admin.renderShell(prefix, { navigation: ['자료', '사용자', '설정'].map((label, i) => ({ label, href: '#', current: i === 0 })), body: '<div class="ds-admin-slot">본문 자리</div>', ...options });
    if (id === 'admin-page') return window.Pattove.admin.renderPage(prefix, options);
    const off = options.state === 'disabled';
    const picked = options.state !== 'unchecked';
    const labelled = (inputId, label, control) => `<div class="ds-field">${fieldLabel(inputId, label)}${control}</div>`;
    const renderers = {
      'token-color': () => tokenMarks('ds-token-swatches', ['accent','high','soft','text']),
      'token-typography': () => '<div class="ds-token-typography"><strong class="ds-token-type">Aa 가나</strong><span class="ds-token-sizes">'+['sm','md','lg'].map(t=>'<span data-token="'+t+'">가나 '+t+'</span>').join('')+'</span></div>',
      'token-gradient': () => tokenMarks('ds-token-gradients', ['','backdrop','rule']),
      'token-text': () => tokenMarks('ds-token-text', ['sm','body','title','heading','display'], '가'),
      'token-weight': () => tokenMarks('ds-token-weight', ['regular','medium','semibold','bold','extrabold'], '가'),
      'token-leading': () => tokenMarks('ds-token-leading', ['tight','normal','loose'], '줄<br>간격'),
      'token-tracking': () => tokenMarks('ds-token-tracking', ['tighter','tight','wide'], 'Aa 가나'),
      'token-space': () => tokenMarks('ds-token-space', ['xs','sm','md','lg','xl']),
      'token-size': () => tokenMarks('ds-token-size', ['','icon-md','icon-lg','control']),
      'token-container': () => tokenMarks('ds-token-container', ['','measure','xs','lg']),
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
      icon: () => iconMark(options.icon || 'search'),
      'icon-label': () => iconLabel(options.icon || 'search'),
      divider: () => divider(), 'text-divider': () => textDivider(),
      'status-dot': () => statusDot('연결됨'), avatar: () => avatar(),
      button: () => button({ variant: options.variant, size: options.size, state: options.state, iconName: options.icon || '' }),
      'icon-button': () => iconButton({ label: iconNames[options.icon] || '검색', iconName: options.icon || 'search', variant: options.variant, size: options.size, state: options.state }),
      'action-row': () => actionRow(), 'confirm-row': () => confirmRow(), 'action-bar': () => actionBar(),
      'segmented-button': () => segmentedButton({ name: prefix + '-range', disabled: off }),
      input: () => { const inputId = prefix + '-input'; return `<label class="ds-field" for="${inputId}"><span>이름</span>${input({ id: inputId, look: options.look, disabled: off, type: options.type || 'text' })}</label>`; },
      'clear-input': () => labelled(prefix + '-clear', '검색어', clearInput({ id: prefix + '-clear', disabled: off })),
      'unit-input': () => labelled(prefix + '-unit', '금액', unitInput({ id: prefix + '-unit', disabled: off })),
      stepper: () => labelled(prefix + '-stepper', '수량', stepper({ id: prefix + '-stepper', disabled: off })),
      'password-input': () => labelled(prefix + '-password', '비밀번호', passwordInput({ id: prefix + '-password', disabled: off })),
      field: () => field({ id: prefix + '-field', label: '컬렉션 이름', state: options.state, value: options.state === 'success' ? '봄의 기록' : '', help: options.state === 'error' ? '이름을 입력해 주세요.' : options.state === 'success' ? '사용할 수 있는 이름이에요.' : '나중에 바꿀 수 있어요.' }),
      'date-range': () => dateRange({ id: prefix + '-range', state: options.state, help: options.state === 'error' ? '끝 날짜가 시작보다 빨라요.' : options.state === 'success' ? '30일 동안이에요.' : '시작과 끝을 한 칸에 적어요.' }),
      'inline-form': () => inlineForm({ prefix }),
      'search-bar': () => searchBar({ prefix }),
      checkbox: () => choice({ label: '링크로 공유', checked: picked, indeterminate: options.state === 'indeterminate', disabled: off }),
      radio: () => radioGroup('공개 범위', choice({ kind: 'radio', label: '나만 보기', checked: picked, disabled: off, name: prefix + '-visibility' }) + choice({ kind: 'radio', label: '링크로 공유', disabled: off, name: prefix + '-visibility' })),
      switch: () => choice({ kind: 'switch', label: '알림 받기', checked: picked, disabled: off }),
      'check-card': () => choice({ className: 'ds-choice-card', label: '링크로 공유', detail: '링크를 받은 사람만 볼 수 있어요', checked: picked, disabled: off, name: prefix + '-share' }),
      'radio-card': () => radioGroup('공개 범위', choice({ kind: 'radio', className: 'ds-choice-card', label: '나만 보기', detail: '나만 열어 볼 수 있어요', checked: picked, disabled: off, name: prefix + '-visibility' }) + choice({ kind: 'radio', className: 'ds-choice-card', label: '링크로 공유', detail: '링크를 받은 사람도 볼 수 있어요', disabled: off, name: prefix + '-visibility' })),
      'filter-chip': () => filterChip({ label: '디자인', checked: picked, disabled: off }),
      'check-list': () => choiceList('받을 알림', ['댓글','좋아요','새 팔로워'].map((label, i) => choice({ label, name: prefix + '-alerts', checked: i < 2, disabled: off })).join('')),
      'radio-list': () => choiceList('공개 범위', ['나만 보기','링크로 공유','모두에게 공개'].map((label, i) => choice({ kind: 'radio', label, name: prefix + '-visibility', checked: i === 0, disabled: off })).join('')),
      'switch-list': () => choiceList('알림', ['알림 받기','소리','진동'].map((label, i) => choice({ kind: 'switch', label, name: '', checked: i !== 1, disabled: off })).join('')),
      'select-all-list': () => selectAllList({ name: prefix + '-alerts', state: options.state }),
      badge: () => badge(({success:'완료',warning:'확인 필요',error:'실패'})[options.tone] || '진행 중', options.tone || 'neutral', options.look),
      'count-badge': () => countBadge({ count: options.count ?? 3 }),
      tabs: () => tabs(prefix, options.look), 'bottom-nav': () => navigation(options.variant),
      notice: () => notice(), toast: () => toast(),
      'progress-bar': () => progressBar(), 'progress-ring': () => progressRing(), 'step-bar': () => stepBar(),
      card: () => card({ look: options.look }), 'list-card': () => listCard({ initial: '봄' }), 'media-card': () => mediaCard(),
      'search-form': () => searchForm({ prefix }), 'filter-chip-row': () => filterChipRow({ name: prefix + '-status' }),
      'result-grid': () => resultGrid(), 'result-list': () => resultList(), 'featured-results': () => featuredResults(),
      'people-picker': () => peoplePicker({ prefix }), 'empty-state': () => emptyState(), 'stat-row': () => statRow(),
      template: () => template({ look: options.look }), page: () => page(prefix, options.look)
    };
    if (!renderers[id]) throw new RangeError('알 수 없는 부품: ' + id);
    return renderers[id]();
  }
  window.Pattove.parts = { esc, icon, navCenter, button, iconButton, actionRow, confirmRow, actionBar, input, clearInput, unitInput, stepper, passwordInput, field, fieldLabel, fieldDescription, dateRange, inlineForm, cardTitle, cardDescription, cardBody, cardActions, choice, filterChip, filterChipRow, segmentedButton, selectAllList, badge, countBadge, divider, textDivider, statusDot, avatar, iconMark, iconLabel, notice, toast, progressBar, progressRing, stepBar, tabs, navigation, card, listCard, mediaCard, searchForm, searchBar, resultGrid, resultList, featuredResults, peoplePicker, emptyState, statRow, template, page, renderItem };
})();
