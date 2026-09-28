/* Representative implementations for validating the system structure, not the full dictionary. */
(() => {
  const version = '0.3.0';
  const sections = [
    { id: 'all', name: '전체 보기', group: '' },
    { id: 'foundations', name: '색·글꼴·간격', group: '기초' },
    { id: 'primitives', name: '아이콘·세부 표현', group: '기초' },
    { id: 'buttons', name: '버튼', group: '부품' },
    { id: 'fields', name: '입력', group: '부품' },
    { id: 'selection', name: '선택', group: '부품' },
    { id: 'navigation', name: '탐색', group: '부품' },
    { id: 'feedback', name: '상태·피드백', group: '부품' },
    { id: 'composition', name: '카드·검색 모듈', group: '조합' },
    { id: 'page', name: '화면 예시', group: '조합' }
  ];
  // Token deps name the token kinds a part's own CSS reads (checked at build against the --p-* roles the part's CSS blocks read).
  const T = (...kinds) => kinds.map(kind => 'token-' + kind);
  const items = [
    { id: 'token-color', name: '색 토큰', section: 'foundations', layer: 'Token', keywords: '색 색상 컬러 배경 글자색 강조 color', deps: [], entry: 'TOK-01' },
    { id: 'token-typography', name: '글꼴 토큰', section: 'foundations', layer: 'Token', keywords: '글꼴 서체 글자 크기 타이포 font typography', deps: [], entry: 'TOK-62' },
    { id: 'token-space', name: '간격 토큰', section: 'foundations', layer: 'Token', keywords: '간격 여백 거리 spacing space', deps: [], entry: 'TOK-76' },
    { id: 'token-radius', name: '모서리 토큰', section: 'foundations', layer: 'Token', keywords: '모서리 둥글기 반경 radius', deps: [], entry: 'TOK-91' },
    { id: 'token-shadow', name: '그림자 토큰', section: 'foundations', layer: 'Token', keywords: '그림자 입체 층 깊이 shadow elevation', deps: [], entry: 'TOK-95' },
    { id: 'token-motion', name: '움직임 토큰', section: 'foundations', layer: 'Token', keywords: '움직임 시간 전환 애니메이션 motion duration', deps: [], entry: 'TOK-113' },
    { id: 'icon', name: '아이콘', section: 'primitives', layer: 'Primitive', keywords: '검색 닫기 화살표 svg icon', deps: T('color'), entry: 'ICO-01' },
    { id: 'divider', name: '구분선', section: 'primitives', layer: 'Primitive', keywords: '선 분리 경계 divider separator', deps: T('color','typography') },
    { id: 'status-dot', name: '상태 점', section: 'primitives', layer: 'Primitive', keywords: '상태 온라인 성공 status dot', deps: T('color','typography','space') },
    { id: 'button', name: '버튼', section: 'buttons', layer: 'Atom', keywords: 'button 행동 실행 크기 상태 hover focus disabled loading', deps: ['icon', ...T('color','space','radius','shadow','motion')], entry: 'ACT-01' },
    { id: 'input', name: '입력창', section: 'fields', layer: 'Atom', keywords: 'input text email 입력 텍스트', deps: T('color','typography','space','radius','shadow') },
    { id: 'field', name: '입력 필드', section: 'fields', layer: 'Molecule', keywords: 'label 오류 검증 validation error 폼 라벨 설명', deps: ['input', ...T('color','typography','space')], entry: 'INP-47' },
    ...['checkbox','radio','switch'].map((id, i) => ({ id, name: ['체크박스','라디오','스위치'][i], section: 'selection', layer: 'Atom', keywords: 'checkbox radio switch toggle 선택 체크박스 토글', deps: T('color','space','radius','shadow','motion'), behavior: true })),
    { id: 'badge', name: '배지', section: 'feedback', layer: 'Atom', keywords: 'badge status 상태 태그', deps: T('color') },
    { id: 'tabs', name: '탭', section: 'navigation', layer: 'Molecule', keywords: 'tabs 메뉴 전환 탐색', deps: T('color','space','shadow'), entry: 'NAV-06' },
    { id: 'bottom-nav', name: '하단 탐색', section: 'navigation', layer: 'Molecule', keywords: 'navigation bottom tab bar 모바일 하단 메뉴', deps: ['icon', ...T('color','space','shadow')], entry: 'NAV-05' },
    { id: 'feedback', name: '알림·진행률', section: 'feedback', layer: 'Molecule', keywords: 'toast alert progress 알림 저장 완료 진행률', deps: ['button', 'status-dot', ...T('color','typography','space','radius','shadow')], entry: 'STA-03' },
    { id: 'card', name: '카드', section: 'composition', layer: 'Molecule', keywords: 'card 카드 제목 본문 행동', deps: ['button', 'badge', 'divider', ...T('color','space','radius','shadow')] },
    { id: 'search-module', name: '검색 모듈', section: 'composition', layer: 'Module', keywords: 'search filter 검색 필터 목록 결과 빈 상태', deps: ['field', 'button', 'card', ...T('color','typography','space','radius','shadow')], entry: 'DAT-01', behavior: true },
    { id: 'template', name: '목록 레이아웃', section: 'page', layer: 'Template', keywords: 'template layout 틀 레이아웃 배치 슬롯', deps: ['badge', 'bottom-nav', ...T('color','typography','space','radius')] },
    { id: 'page', name: '컬렉션 화면', section: 'page', layer: 'Page', keywords: 'page layout template 레이아웃 템플릿 화면 흐름', deps: ['template', 'search-module'], behavior: true }
  ].map(item => ({ ...item, version, lifecycle: 'Trial', environments: ['HTML','React'], behavior: item.behavior || ['button', 'tabs', 'bottom-nav', 'feedback'].includes(item.id) }));
  const control = (key, label, values) => ({ key, label, values });
  const choiceStates = [['checked','선택됨'],['unchecked','선택 안 됨'],['disabled','사용 불가']];
  const controls = {
    button: [control('variant','표현',[['primary','채움'],['outline','윤곽'],['ghost','글자']]), control('size','크기',[['md','Medium · 48'],['sm','Small · 44'],['lg','Large · 56']]), control('state','상태',[['','기본'],['hover','Hover'],['pressed','Pressed'],['focus','Focus'],['disabled','Disabled'],['loading','Loading']]), control('icon','아이콘',[['','없음'],['search','검색'],['arrow','화살표']]), control('iconOnly','내용',[['false','글자 함께'],['true','아이콘만']])],
    icon: [control('icon','아이콘',Object.keys(window.Pattove.iconMarkup).map(name => [name,name]))],
    input: [control('state','상태',[['','기본'],['disabled','사용 불가']]), control('type','입력 종류',[['text','텍스트'],['email','이메일'],['search','검색'],['password','비밀번호']])],
    field: [control('state','상태',[['','기본'],['focus','초점'],['error','오류'],['success','완료'],['disabled','사용 불가']])],
    checkbox: [control('state','상태',[...choiceStates,['indeterminate','일부 선택']])],
    radio: [control('state','상태',choiceStates)], switch: [control('state','상태',choiceStates)],
    badge: [control('tone','상태',[['neutral','진행 중'],['success','완료'],['warning','확인 필요'],['error','실패']])],
  };
  // Look-alike versions of one part. Every look is a different structure for a different situation:
  // `when` = the situation it fits, `saves` = the effort it takes away from the person using it.
  const look = (no, id, name, when, saves) => ({ no, id, name, when, saves });
  // Template and page share the screen arrangements; the page fills each with a matching search look.
  const pageLooks = [
    look('01','stack','기본 쌓기','처음 만드는 목록 화면','배치 고민'),
    look('02','hero','큰 머리글','검색이 첫 할 일인 화면','검색창 찾기'),
    look('03','appbar','가운데 앱 바','목록을 한 화면에 더 보고 싶을 때','더 보려고 스크롤'),
    look('04','sheet','겹친 시트','필터를 자주 바꿀 때','드롭다운 열기'),
    look('05','dashboard','대시보드형','개수부터 파악할 때','탭마다 세어 보기')
  ];
  const galleries = {
    'bottom-nav': { key: 'variant', label: '모양', default: 'line', frame: 'phone-bottom', list: [
      look('01','minimal','미니멀','내용이 주인공인 읽기 앱','메뉴가 눈을 뺏는 일'),
      look('02','glass','유리','사진·지도가 바닥까지 깔릴 때','가려진 내용 보러 스크롤'),
      look('03','float','떠 있는 바','만들기가 가장 잦은 앱','만들기 버튼 찾기'),
      look('04','pill','알약 강조','지금 위치를 한눈에 알아야 할 때','현재 탭 찾기'),
      look('05','line','위쪽 표시줄','처음 쓰는 사람이 많은 앱','낯선 표시 알아보기')
    ] },
    // Atoms share one key: `look` → data-look on the markup, drawn by [data-look] rules in parts.css. First entry = current shape.
    // Button colour roles (primary/outline/ghost) stay on `variant`; looks here are arrangements of actions.
    button: { list: [
      look('01','fill','하나','할 일이 하나뿐인 화면','무엇을 누를지 고르기'),
      look('02','hero','주 행동 + 아이콘','행동이 4개 이상 나란할 때','어느 걸 누를지 고민'),
      look('03','pair','확인·취소 한 줄','되돌리기 어려운 결정 직전','잘못 누르기'),
      look('04','bar','엄지 자리 가득','휴대폰 긴 화면 끝의 결정','스크롤해 버튼 찾기')
    ] },
    input: { list: [
      look('01','box','기본 칸','한 번 쓰고 끝나는 값','무엇인지 알아보기'),
      look('02','clear','칸 안 지우기','통째로 다시 쓰는 값','지우기 키 연타'),
      look('03','unit','숫자 + 단위 한 칸','단위가 붙는 숫자','두 칸 오가기'),
      look('04','stepper','빼기·더하기','작은 수를 바꿀 때','키보드 열기'),
      look('05','reveal','보기 단추','가려진 비밀번호를 칠 때','틀렸는지 몰라 다시 치기')
    ] },
    field: { list: [
      look('01','stack','위 라벨','처음 보는 양식','라벨 찾기'),
      look('02','inline','옆 라벨','짧은 설정 값이 여러 줄','세로 스크롤'),
      look('03','row','시작~끝 한 줄','짝을 이루는 값(기간·범위)','눈이 멈추는 곳 절반')
    ] },
    checkbox: { list: [
      look('01','square','네모','항목이 적은 동의·선택','무엇인지 알아보기'),
      look('02','card','선택 카드','설명이 붙은 선택지','작은 네모 겨누기'),
      look('03','chip','알약 칩','여러 필터를 빠르게 켤 때','세로 목록 훑기'),
      look('04','list','목록 줄','설정 화면의 여러 항목','줄과 칸 맞춰 보기'),
      look('05','all','전체 선택','같은 종류 항목이 여러 개일 때','하나씩 누르기')
    ] },
    radio: { list: [
      look('01','dot','가운데 점','선택지가 3~5개','무엇인지 알아보기'),
      look('02','card','선택 카드','설명이 붙은 선택지','작은 원 겨누기'),
      look('03','segment','나란한 버튼','2~4개 중 바로 바꿀 때','세로로 훑기'),
      look('04','list','목록 줄','설정 화면의 한 가지 고르기','줄과 칸 맞춰 보기')
    ] },
    switch: { list: [
      look('01','track','기본 트랙','바로 적용되는 켜기·끄기','저장 버튼 찾기'),
      look('02','list','설정 줄','설정 항목이 여러 개','줄과 칸 맞춰 보기')
    ] },
    badge: { list: [
      look('01','soft','연한 면','목록 옆 짧은 상태','상태 글 읽기'),
      look('02','icon','아이콘 붙음','색을 구분하기 어려운 사람도 볼 때','색으로 뜻 해석'),
      look('03','count','개수 붙음','아이콘 뒤에 새 항목이 쌓일 때','열어서 세기')
    ] },
    divider: { list: [
      look('01','solid','실선','내용 묶음 사이','어디서 끊기는지 찾기'),
      look('02','label','가운데 글자','두 방법 중 하나(또는)','두 묶음 관계 추측')
    ] },
    'status-dot': { list: [
      look('01','dot','점','글 옆 짧은 상태','상태 글 읽기'),
      look('02','avatar','프로필 모서리','사람 목록의 접속 여부','이름 옆 글 찾기')
    ] },
    icon: { list: [
      look('01','line','선','뜻이 널리 알려진 아이콘','글 읽기'),
      look('02','label','아이콘 + 이름','처음 보는 아이콘','뜻 추측')
    ] },
    tabs: { key: 'look', label: '모양', frame: 'stage', list: [
      look('01','filled','채움 트랙','이름이 짧은 2~4개 화면','지금 탭 찾기'),
      look('02','icon','아이콘 위 글자','휴대폰 좁은 폭의 탭','긴 이름 읽기'),
      look('03','count','개수 붙음','탭마다 쌓인 수가 중요할 때','하나씩 눌러 보기'),
      look('04','vertical','세로','탭이 5개 넘는 넓은 화면','가로 스크롤'),
      look('05','scroll','옆으로 밀기','휴대폰에서 탭이 5개 넘을 때','메뉴 열어 탭 찾기')
    ] },
    // sample: options that only the gallery cards add, so the chosen shape is visible without pressing anything.
    feedback: { key: 'look', label: '모양', frame: 'stage', sample: { open: true }, list: [
      look('01','card','떠 있는 카드','결과를 읽고 넘어갈 때','알림 찾기'),
      look('02','toast','되돌리기 붙음','되돌릴 수 있는 행동 직후','확인 창 한 번 더'),
      look('03','ring','진행 고리','남은 양이 중요할 때','막대 길이 가늠'),
      look('04','steps','마디 막대','단계가 정해진 일','몇 단계 남았는지 세기')
    ] },
    card: { key: 'look', label: '모양', frame: 'stage', list: [
      look('01','raised','기본','글이 주인공인 카드','무엇인지 알아보기'),
      look('02','row','가로형','여러 항목을 위아래로 비교','카드 사이 눈 이동'),
      look('03','media','이미지 위','사진으로 고르는 항목','제목 읽기')
    ] },
    'search-module': { key: 'look', label: '모양', frame: 'stage', list: [
      look('01','grid','카드 격자','훑어보며 고를 때','한 줄씩 읽기'),
      look('02','pill','알약 검색창','검색어 하나로 찾을 때','필터 칸 채우기'),
      look('03','chips','필터 칩 줄','몇 가지 상태로 자주 거를 때','드롭다운 열기'),
      look('04','list','목록형','이름으로 빠르게 비교할 때','카드 사이 눈 이동'),
      look('05','picker','검색 + 얼굴 목록','사람·항목이 많아 고를 때','드롭다운 스크롤'),
      look('06','feature','큰 첫 결과','추천 하나를 앞세울 때','무엇부터 볼지 고민')
    ] },
    template: { key: 'look', label: '모양', frame: 'phone', list: pageLooks },
    page: { key: 'look', label: '모양', frame: 'phone', list: pageLooks }
  };
  for (const g of Object.values(galleries)) if (!g.key) Object.assign(g, { key: 'look', label: '모양', frame: 'stage' });
  for (const [id, g] of Object.entries(galleries)) {
    let c = controls[id]?.find(c => c.key === g.key);
    if (!c) (controls[id] ||= []).push(c = control(g.key, g.label, []));
    Object.assign(c, { values: g.list.map(v => [v.id, v.name]), default: g.default ?? g.list[0].id });
  }
  const contracts = {
    'token-color': ['배경·글자·선·강조 색의 역할 이름', 'var(--p-*) 역할 이름으로만 참조. 새 색은 원시값에 추가하고 역할에 연결', [], []],
    'token-typography': ['본문·제목 글꼴과 글자 크기 단계', 'var(--p-font)·var(--p-text-*)로 참조. 글꼴 파일은 pattove-fonts 항목이 제공', [], []],
    'token-space': ['여백과 간격의 단계', 'var(--p-space-*) 단계만 사용. 화면 배치 치수는 부품 CSS에 유지', [], []],
    'token-radius': ['표면·조작 요소·안쪽 모서리 둥글기', 'var(--p-radius)·var(--p-control-radius)·var(--p-inner-radius)로 참조', [], []],
    'token-shadow': ['띄움·눌림·떠 있는 층의 그림자', 'var(--p-shadow)·var(--p-inset)·var(--p-float) 등 역할 이름으로 참조', [], []],
    'token-motion': ['상태 전환 시간', 'var(--p-duration)으로 참조. 전환 시간 값을 부품마다 따로 쓰지 않음', [], []],
    icon: ['한 개의 그림 기호', '아이콘만 있는 행동에는 접근 가능한 이름을 제공', ['icon'], []],
    divider: ['영역의 경계', '부모의 가로 너비에 맞춰 사용', [], []],
    'status-dot': ['상태를 색과 글자로 표시', '상태 이름을 함께 유지', ['label'], []],
    button: ['행동 실행', '아이콘만 쓸 때도 label 유지. 실행할 일은 click에 연결', ['label','variant','size','state','iconName','iconOnly','type','action'], ['click','pattove:action']],
    input: ['한 줄 값 입력', 'label과 id를 연결. 오류에는 설명과 aria-invalid를 함께 사용. 비밀번호 보기 단추는 이름(보기·숨기기)으로 상태 제공', ['id','value','placeholder','type','name','disabled','invalid','description'], ['input','change']],
    field: ['라벨·입력·설명·오류의 연결', '라벨과 도움말의 id 관계를 함께 가져오기', ['id','label','value','state','help','name','type'], ['input','change']],
    checkbox: ['여러 개 중 선택', '연결된 label을 조작 영역으로 유지. 전체 선택은 일부만 고르면 중간 상태(indeterminate)', ['label','checked','disabled','indeterminate','name','value'], ['change']],
    radio: ['같은 그룹에서 하나 선택', '같은 그룹은 name 공유, 다른 그룹은 name 분리', ['label','checked','disabled','name','value'], ['change']],
    switch: ['설정을 켜고 끄기', '동작 이름을 label로 제공', ['label','checked','disabled'], ['change']],
    badge: ['짧은 상태 이름과 쌓인 개수', '색만으로 상태를 구분하지 않음. 개수는 읽을 이름(예: 새 알림 3개)을 함께 제공', ['label','tone','count'], []],
    tabs: ['같은 영역의 내용 전환', '탭과 패널의 id 연결을 유지. 세로 탭은 위아래 방향키. 옆으로 밀기 탭은 고른 탭이 화면 안에 보이도록 스크롤', ['prefix','look'], ['pattove:tabchange']],
    'bottom-nav': ['주요 목적지 선택', '목적지 이동은 pattove:navigate 이벤트에 연결. 가운데 만들기 버튼(float)은 pattove:create(React는 onCreate)에 연결. 표본은 선택 상태를 제공', ['variant','onCreate (React)'], ['pattove:navigate','pattove:create (HTML)']],
    feedback: ['행동의 결과와 진행률', '표본 저장 알림과 68% 진행률. 실제 저장·업로드는 프로젝트에서 연결', ['look'], []],
    card: ['제목·본문·상태·행동 조합', '단독 표본은 선택 토글, 검색 모듈에서는 상세 열기', ['title','description','tag','action','behavior','look'], ['pattove:select']],
    'search-module': ['이름·상태로 검색하고 상세 확인', 'records에 고유 id·title·description·tag 필요. HTML은 화면 안의 보관 상태를 바꾸고 이벤트로 알림. React는 onSave(record)의 성공·실패와 대기 상태를 처리. 영구 저장은 프로젝트에서 연결', ['prefix','records','look','onSave (React)'], ['pattove:save (HTML)','onSave(record) (React)']],
    template: ['제목·본문·하단 탐색의 배치', 'body에는 신뢰할 수 있는 부품 마크업만 전달', ['title','eyebrow','count','body','look'], []],
    page: ['실제 콘텐츠가 들어간 조합', '템플릿·모듈을 재사용. 서버·로그인 없이 예시 데이터로 실행', ['prefix','look'], []]
  };
  for (const item of items) {
    const [purpose, compatibility, inputs, events] = contracts[item.id];
    Object.assign(item, { purpose, compatibility, inputs, events, controls: controls[item.id] || [], gallery: galleries[item.id] || null,
      css: ['checkbox','radio','switch'].includes(item.id) ? ['selection'] : item.id === 'page' ? [] : [item.id],
      source: 'src/system/parts.js', reactSource: item.layer === 'Token' ? null : 'src/system/react/'+item.id+'.jsx', styles: window.Pattove.catalog.styles.filter(s => s.id !== 'base').map(s => s.id),
      minInlineSize: ({ 'bottom-nav': 224, 'search-module': 240, template: 240, page: 240, card: 200, input: 160, field: 160, tabs: 240, feedback: 224 })[item.id] || 160,
      support: { html: 'implemented', react: 'implemented', native: 'not-implemented', print: 'not-verified' },
      verification: { suite: 'tests/system-audit.cjs', evidence: 'test-results/system-audit/results.json' }
    });
  }
  indexOptions('icon').forEach(c => c.values.sort(([a],[b]) => a === 'search' ? -1 : b === 'search' ? 1 : a.localeCompare(b)));
  items.find(i => i.id === 'field').publicParts = [{ name: 'label', selector: '.ds-field > label', requires: 'input', relation: 'for → input.id' }, { name: 'help / error', selector: '.ds-help', requires: 'input', relation: 'input.aria-describedby → help.id' }];
  items.find(i => i.id === 'card').publicParts = [{ name: 'body', selector: '.ds-card-body', requires: 'card' }, { name: 'title', selector: '.ds-card h3', requires: 'card' }, { name: 'description', selector: '.ds-card-body > p', requires: 'card' }, { name: 'actions', selector: '.ds-card-actions', requires: 'card' }];
  items.find(i => i.id === 'button').publicParts = [{ name: 'focus', selector: '[data-state="focus"]', requires: 'button' }, { name: 'loading', selector: '.ds-spinner', requires: 'button' }];
  const normalizeOptions = (id, provided = {}) => Object.fromEntries((indexOptions(id)).map(c => [c.key, c.values.some(([value]) => value === provided[c.key]) ? provided[c.key] : c.key === 'icon' && id === 'icon' ? 'search' : c.default ?? c.values[0][0]]));
  function indexOptions(id) { return items.find(item => item.id === id)?.controls || []; }
  const index = new Map(items.map(item => [item.id, item]));
  const matching = (query = '') => {
    const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return items.filter(item => terms.every(term => `${item.name} ${item.id} ${item.entry || ""} ${item.layer} ${item.purpose} ${item.compatibility} ${item.keywords}`.toLocaleLowerCase().includes(term)));
  };
  const dependencies = id => {
    const result = new Set();
    const visit = key => { for (const dep of index.get(key)?.deps || []) if (!result.has(dep)) { result.add(dep); visit(dep); } };
    visit(id);
    return [...result].map(key => index.get(key));
  };
  const patterns = [{ id: 'search-filter-results', name: '검색·필터·결과', layer: 'Pattern', items: ['search-module', 'template', 'page'], rules: ['입력 필드와 상태 필터 뒤에 검색 동작을 둡니다.', '결과 개수는 바뀔 때마다 알리고, 결과가 없으면 전체 보기로 복구합니다.', '제목이 길어져도 카드의 행동은 같은 위치에 둡니다.'] }];
  window.Pattove.systemRegistry = { sections, items, index, matching, dependencies, patterns, normalizeOptions, version };
})();
