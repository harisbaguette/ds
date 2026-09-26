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
  const items = [
    { id: 'tokens', name: '디자인 토큰', section: 'foundations', layer: 'Token', keywords: '색상 컬러 글꼴 타이포 간격 모서리 그림자 color typography spacing radius', deps: [], entry: 'TOK-01' },
    { id: 'icon', name: '아이콘', section: 'primitives', layer: 'Primitive', keywords: '검색 닫기 화살표 svg icon', deps: [], entry: 'ICO-01' },
    { id: 'divider', name: '구분선', section: 'primitives', layer: 'Primitive', keywords: '선 분리 경계 divider separator', deps: ['tokens'] },
    { id: 'status-dot', name: '상태 점', section: 'primitives', layer: 'Primitive', keywords: '상태 온라인 성공 status dot', deps: ['tokens'] },
    { id: 'button', name: '버튼', section: 'buttons', layer: 'Atom', keywords: 'button 행동 실행 크기 상태 hover focus disabled loading', deps: ['tokens', 'icon'], entry: 'ACT-01' },
    { id: 'input', name: '입력창', section: 'fields', layer: 'Atom', keywords: 'input text email 입력 텍스트', deps: ['tokens'] },
    { id: 'field', name: '입력 필드', section: 'fields', layer: 'Molecule', keywords: 'label 오류 검증 validation error 폼 라벨 설명', deps: ['input'], entry: 'INP-47' },
    ...['checkbox','radio','switch'].map((id, i) => ({ id, name: ['체크박스','라디오','스위치'][i], section: 'selection', layer: 'Atom', keywords: 'checkbox radio switch toggle 선택 체크박스 토글', deps: ['tokens'], behavior: true })),
    { id: 'badge', name: '배지', section: 'feedback', layer: 'Atom', keywords: 'badge status 상태 태그', deps: ['tokens'] },
    { id: 'tabs', name: '탭', section: 'navigation', layer: 'Molecule', keywords: 'tabs 메뉴 전환 탐색', deps: ['tokens'], entry: 'NAV-06' },
    { id: 'bottom-nav', name: '하단 탐색', section: 'navigation', layer: 'Molecule', keywords: 'navigation bottom dock 모바일 하단 메뉴', deps: ['tokens', 'icon'], entry: 'NAV-05' },
    { id: 'feedback', name: '알림·진행률', section: 'feedback', layer: 'Molecule', keywords: 'toast alert progress 알림 저장 완료 진행률', deps: ['button', 'status-dot'], entry: 'STA-03' },
    { id: 'card', name: '카드', section: 'composition', layer: 'Molecule', keywords: 'card 카드 제목 본문 행동', deps: ['button', 'badge', 'divider'] },
    { id: 'search-module', name: '검색 모듈', section: 'composition', layer: 'Module', keywords: 'search filter 검색 필터 목록 결과 빈 상태', deps: ['field', 'button', 'card'], entry: 'DAT-01', behavior: true },
    { id: 'template', name: '목록 레이아웃', section: 'page', layer: 'Template', keywords: 'template layout 틀 레이아웃 배치 슬롯', deps: ['badge', 'bottom-nav'] },
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
    'bottom-nav': [control('variant','형태',[['line','밑줄'],['dock','독']])]
  };
  const contracts = {
    tokens: ['공통 디자인 값', 'CSS 변수로 색·간격·서체를 참조', [], []],
    icon: ['한 개의 그림 기호', '아이콘만 있는 행동에는 접근 가능한 이름을 제공', ['icon'], []],
    divider: ['영역의 경계', '부모의 가로 너비에 맞춰 사용', [], []],
    'status-dot': ['상태를 색과 글자로 표시', '상태 이름을 함께 유지', ['label'], []],
    button: ['행동 실행', '아이콘만 쓸 때도 label 유지. 실행할 일은 click에 연결', ['label','variant','size','state','iconName','iconOnly','type','action'], ['click','pattove:action']],
    input: ['한 줄 값 입력', 'label과 id를 연결. 오류에는 설명과 aria-invalid를 함께 사용', ['id','value','placeholder','type','name','disabled','invalid','description'], ['input','change']],
    field: ['라벨·입력·설명·오류의 연결', '라벨과 도움말의 id 관계를 함께 가져오기', ['id','label','value','state','help','name','type'], ['input','change']],
    checkbox: ['여러 개 중 선택', '연결된 label을 조작 영역으로 유지', ['label','checked','disabled','indeterminate','name','value'], ['change']],
    radio: ['같은 그룹에서 하나 선택', '같은 그룹은 name 공유, 다른 그룹은 name 분리', ['label','checked','disabled','name','value'], ['change']],
    switch: ['설정을 켜고 끄기', '동작 이름을 label로 제공', ['label','checked','disabled'], ['change']],
    badge: ['짧은 상태 이름', '색만으로 상태를 구분하지 않음', ['label','tone'], []],
    tabs: ['같은 영역의 내용 전환', '탭과 패널의 id 연결을 유지', ['prefix'], ['pattove:tabchange']],
    'bottom-nav': ['주요 목적지 선택', '목적지 이동은 pattove:navigate 이벤트에 연결. 표본은 선택 상태를 제공', ['variant'], ['pattove:navigate']],
    feedback: ['행동의 결과와 진행률', '표본 저장 알림과 68% 진행률. 실제 저장·업로드는 프로젝트에서 연결', [], []],
    card: ['제목·본문·상태·행동 조합', '단독 표본은 선택 토글, 검색 모듈에서는 상세 열기', ['title','description','tag','action','behavior'], ['pattove:select']],
    'search-module': ['이름·상태로 검색하고 상세 확인', 'records에 고유 id·title·description·tag 필요. HTML은 화면 안의 보관 상태를 바꾸고 이벤트로 알림. React는 onSave(record)의 성공·실패와 대기 상태를 처리. 영구 저장은 프로젝트에서 연결', ['prefix','records','onSave (React)'], ['pattove:save (HTML)','onSave(record) (React)']],
    template: ['제목·본문·하단 탐색의 배치', 'body에는 신뢰할 수 있는 부품 마크업만 전달', ['title','eyebrow','count','body'], []],
    page: ['실제 콘텐츠가 들어간 조합', '템플릿·모듈을 재사용. 서버·로그인 없이 예시 데이터로 실행', ['prefix'], []]
  };
  for (const item of items) {
    const [purpose, compatibility, inputs, events] = contracts[item.id];
    Object.assign(item, { purpose, compatibility, inputs, events, controls: controls[item.id] || [],
      css: ['checkbox','radio','switch'].includes(item.id) ? ['selection'] : ['page','icon'].includes(item.id) ? [] : [item.id],
      source: 'src/system/parts.js', reactSource: ['tokens','icon'].includes(item.id) ? null : 'src/system/react/'+item.id+'.jsx', styles: window.Pattove.catalog.styles.filter(s => s.id !== 'base').map(s => s.id),
      minInlineSize: ({ 'bottom-nav': 224, 'search-module': 240, template: 240, page: 240, card: 200, input: 160, field: 160, tabs: 240, feedback: 224 })[item.id] || 160,
      support: { html: 'implemented', react: 'implemented', native: 'not-implemented', print: 'not-verified' },
      verification: { suite: 'tests/system-audit.cjs', evidence: 'test-results/system-audit/results.json' }
    });
  }
  indexOptions('icon').forEach(c => c.values.sort(([a],[b]) => a === 'search' ? -1 : b === 'search' ? 1 : a.localeCompare(b)));
  items.find(i => i.id === 'field').publicParts = [{ name: 'label', selector: '.ds-field > label', requires: 'input', relation: 'for → input.id' }, { name: 'help / error', selector: '.ds-help', requires: 'input', relation: 'input.aria-describedby → help.id' }];
  items.find(i => i.id === 'card').publicParts = [{ name: 'body', selector: '.ds-card-body', requires: 'card' }, { name: 'title', selector: '.ds-card h3', requires: 'card' }, { name: 'description', selector: '.ds-card-body > p', requires: 'card' }, { name: 'actions', selector: '.ds-card-actions', requires: 'card' }];
  items.find(i => i.id === 'button').publicParts = [{ name: 'focus', selector: '[data-state="focus"]', requires: 'button' }, { name: 'loading', selector: '.ds-spinner', requires: 'button' }];
  const normalizeOptions = (id, provided = {}) => Object.fromEntries((indexOptions(id)).map(c => [c.key, c.values.some(([value]) => value === provided[c.key]) ? provided[c.key] : c.key === 'icon' && id === 'icon' ? 'search' : c.values[0][0]]));
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
