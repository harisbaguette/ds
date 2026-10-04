/* Representative implementations for validating the system structure, not the full dictionary. */
(() => {
  const version = '0.8.0';
  const sections = [
    { id: 'all', name: '전체 보기', group: '' },
    { id: 'foundations', name: '색·글꼴·간격', group: '기초' },
    { id: 'primitives', name: '아이콘·세부 표현', group: '기초' },
    { id: 'buttons', name: '버튼', group: '부품' },
    { id: 'fields', name: '입력', group: '부품' },
    { id: 'selection', name: '선택', group: '부품' },
    { id: 'navigation', name: '탐색', group: '부품' },
    { id: 'feedback', name: '상태·피드백', group: '부품' },
    { id: 'composition', name: '카드·검색 결과', group: '조합' },
    { id: 'page', name: '화면 예시', group: '조합' }
  ];
  // Token deps name the token kinds a part's own CSS reads (checked at build against the --p-* roles the part's CSS blocks read).
  const T = (...kinds) => kinds.map(kind => 'token-' + kind);
  // How things are split (Material 3 · shadcn/ui):
  //   look  = same structure, same job, only the surface differs → one entry in that part's gallery.
  //   part  = a different structure or job → its own item on the 부품 shelf.
  //   block = several parts placed together → an item on the 블록 shelf.
  // Items whose markup carries data-part-action or data-indeterminate, so behaviors.js travels with them.
  const interactive = ['button','icon-button','tabs','bottom-nav','clear-input','stepper','password-input','toast','card','list-card','media-card','action-row','confirm-row','action-bar','check-list','select-all-list','search-bar','filter-chip-row','result-grid','result-list','featured-results'];
  // Parts with no width of their own (bars and rules) are shown across the whole stage, like blocks.
  const wide = ['text-divider','search-bar','progress-bar','step-bar'];
  const part = (id, name, section, layer, code, keywords, deps, extra = {}) => ({ id, browse: { shelf: 'part', kind: '부품', code, ...(wide.includes(id) ? { fit: true } : {}) }, name, section, layer, keywords, deps, ...extra });
  const block = (id, name, section, code, keywords, deps, extra = {}) => ({ id, browse: { shelf: 'block', kind: '모듈', code, fit: true }, name, section, layer: 'Module', keywords, deps, ...extra });
  // English name beside the detail title for items with no linked dictionary term (a linked term's own English wins, so the card and the title say the same word).
  const english = {
    'icon': 'Icon',
    'icon-label': 'Label',
    'divider': 'Divider',
    'text-divider': 'Divider with title',
    'status-dot': 'Status light',
    'input': 'Text field',
    'checkbox': 'Checkbox',
    'radio': 'Radio button',
    'switch': 'Switch',
    'progress-bar': 'Progress bar',
    'list-card': 'Horizontal card',
    'media-card': 'Card with cover',
    'confirm-row': 'Confirm / dismiss buttons',
    'select-all-list': 'Check all',
    'radio-list': 'Radio group'
  };
  const items = [
    block('data-table', '데이터 표', 'composition', 'DAT', '표 검색 필터 정렬 페이지 선택 table filter sort', ['button','field','checkbox', ...T('color','space','text','weight','border','radius','size','breakpoint')], { entry:'DAT-05', behavior:true }),
    part('record-editor', '자료 편집', 'fields', 'Molecule', 'ACT', '대화상자 편집 저장 오류 복구 dialog editor', ['button','field', ...T('color','space','border','radius','shadow','container','text')], { entry:'ACT-07', behavior:true, browse:{shelf:'part',kind:'부품',code:'ACT',fit:true} }),
    { id:'admin-shell', name:'관리 화면 틀', section:'page', layer:'Template', browse:{shelf:'template',kind:'템플릿',code:'LAY',fit:true}, keywords:'관리 화면 틀 사이드바 admin shell layout', entry:'LAY-03', deps:T('breakpoint','space','size','radius','color','text','border','stroke') },
    { id:'admin-page', name:'자료 관리 화면', section:'page', layer:'Page', browse:{shelf:'template',kind:'페이지',code:'ADM',fit:true}, keywords:'관리자 자료 목록 상세 편집 저장 실패 재시도 admin CRUD', entry:'ADM-01', deps:['admin-shell','data-table','record-editor',...T('color','text')], behavior:true },
    { id: 'token-color', browse: { shelf: 'token', kind: '색', code: 'TOK' }, name: '색 토큰', section: 'foundations', layer: 'Token', keywords: '색 색상 컬러 배경 글자색 강조 color', deps: [], entry: 'TOK-01' },
    { id: 'token-gradient', browse: { shelf: 'token', kind: '그러데이션', code: 'TOK' }, name: '그러데이션 토큰', section: 'foundations', layer: 'Token', keywords: '그러데이션 그라디언트 배경 번짐 gradient', deps: T('color') },
    { id: 'token-typography', browse: { shelf: 'token', kind: '글꼴', code: 'TOK' }, name: '글꼴 토큰', section: 'foundations', layer: 'Token', keywords: '글꼴 서체 타이포 글자 설정 font typography', deps: T('text','weight','leading'), entry: 'TOK-62' },
    { id: 'token-text', browse: { shelf: 'token', kind: '글자', code: 'TOK' }, name: '글자 크기 토큰', section: 'foundations', layer: 'Token', keywords: '글자 크기 본문 제목 크기 font-size text', deps: [] },
    { id: 'token-weight', browse: { shelf: 'token', kind: '글자', code: 'TOK' }, name: '굵기 토큰', section: 'foundations', layer: 'Token', keywords: '굵기 글자 두께 font-weight weight', deps: [] },
    { id: 'token-leading', browse: { shelf: 'token', kind: '글자', code: 'TOK' }, name: '줄 간격 토큰', section: 'foundations', layer: 'Token', keywords: '줄 간격 행간 line-height leading', deps: [] },
    { id: 'token-tracking', browse: { shelf: 'token', kind: '글자', code: 'TOK' }, name: '자간 토큰', section: 'foundations', layer: 'Token', keywords: '자간 글자 사이 letter-spacing tracking', deps: [] },
    { id: 'token-space', browse: { shelf: 'token', kind: '간격', code: 'TOK' }, name: '간격 토큰', section: 'foundations', layer: 'Token', keywords: '간격 여백 거리 spacing space', deps: [], entry: 'TOK-76' },
    { id: 'token-size', browse: { shelf: 'token', kind: '크기', code: 'TOK' }, name: '크기 토큰', section: 'foundations', layer: 'Token', keywords: '크기 너비 높이 아이콘 조작 크기 size', deps: [] },
    { id: 'token-container', browse: { shelf: 'token', kind: '너비', code: 'TOK' }, name: '너비 토큰', section: 'foundations', layer: 'Token', keywords: '너비 폭 컨테이너 읽기 폭 container measure', deps: [] },
    { id: 'token-radius', browse: { shelf: 'token', kind: '반경', code: 'TOK' }, name: '모서리 토큰', section: 'foundations', layer: 'Token', keywords: '모서리 둥글기 반경 radius', deps: [], entry: 'TOK-91' },
    { id: 'token-border', browse: { shelf: 'token', kind: '테두리', code: 'TOK' }, name: '테두리 토큰', section: 'foundations', layer: 'Token', keywords: '테두리 선 두께 초점 링 border outline', deps: [] },
    { id: 'token-stroke', browse: { shelf: 'token', kind: '선 모양', code: 'TOK' }, name: '선 모양 토큰', section: 'foundations', layer: 'Token', keywords: '선 모양 점선 파선 아이콘 선 굵기 stroke dashed dotted', deps: [] },
    { id: 'token-shadow', browse: { shelf: 'token', kind: '그림자', code: 'TOK' }, name: '그림자 토큰', section: 'foundations', layer: 'Token', keywords: '그림자 입체 층 깊이 shadow elevation', deps: [], entry: 'TOK-95' },
    { id: 'token-blur', browse: { shelf: 'token', kind: '흐림', code: 'TOK' }, name: '흐림 토큰', section: 'foundations', layer: 'Token', keywords: '흐림 유리 블러 backdrop blur', deps: [] },
    { id: 'token-opacity', browse: { shelf: 'token', kind: '불투명도', code: 'TOK' }, name: '불투명도 토큰', section: 'foundations', layer: 'Token', keywords: '불투명도 투명도 흐리게 opacity', deps: [] },
    { id: 'token-aspect', browse: { shelf: 'token', kind: '비율', code: 'TOK' }, name: '비율 토큰', section: 'foundations', layer: 'Token', keywords: '비율 가로세로 비 aspect ratio', deps: [] },
    { id: 'token-motion', browse: { shelf: 'token', kind: '움직임', code: 'TOK' }, name: '움직임 토큰', section: 'foundations', layer: 'Token', keywords: '움직임 시간 전환 애니메이션 가속 motion duration easing', deps: [], entry: 'TOK-113' },
    { id: 'token-layer', browse: { shelf: 'token', kind: '층', code: 'TOK' }, name: '쌓임 순서 토큰', section: 'foundations', layer: 'Token', keywords: '쌓임 순서 겹침 z-index layer', deps: [] },
    { id: 'token-breakpoint', browse: { shelf: 'token', kind: '브레이크포인트', code: 'TOK' }, name: '화면 폭 기준 토큰', section: 'foundations', layer: 'Token', keywords: '화면 폭 기준 반응형 분기 breakpoint media query', deps: [] },
    // 부품: one thing with one job. Looks, if any, only change its surface.
    part('icon', '아이콘', 'primitives', 'Primitive', 'ICO', '검색 닫기 화살표 일러스트 WebP icon', []),
    part('icon-label', '레이블', 'primitives', 'Primitive', 'ATM','아이콘 이름 라벨 글자 icon label caption', ['icon', ...T('color','text','leading','space','size')]),
    part('divider', '구분선', 'primitives', 'Primitive', 'LAY', '선 분리 경계 divider separator', T('color','border')),
    part('text-divider', '제목이 있는 구분선', 'primitives', 'Primitive', 'LAY', '또는 가운데 글자 구분선 or divider label', T('color','gradient','text','leading','space','border')),
    part('status-dot', '상태 표시등', 'primitives', 'Primitive', 'STA', '상태 온라인 성공 status dot', T('color','text','space','size','radius')),
    part('avatar', '아바타', 'primitives', 'Atom', 'SOC', '프로필 사진 아바타 접속 온라인 avatar presence', T('color','text','weight','size','radius','border'), { entry: 'SOC-01' }),
    part('button', '버튼', 'buttons', 'Atom', 'ACT', 'button 행동 실행 크기 상태 채움 윤곽 글자 hover focus disabled loading', ['icon', ...T('color','text','weight','leading','space','size','radius','border','stroke','shadow','opacity','motion')], { entry: 'ACT-01' }),
    part('icon-button', '아이콘 버튼', 'buttons', 'Atom', 'ATM', '아이콘 버튼 그림 버튼 icon button', ['button', ...T('space')], { entry: 'ATM-08' }),
    part('segmented-button', '세그먼트 버튼', 'buttons', 'Molecule', 'NAV', '세그먼트 나란한 버튼 분할 선택 segmented button control', T('color','text','weight','space','size','radius','border','layer'), { entry: 'NAV-07' }),
    part('input', '텍스트 필드', 'fields', 'Atom', 'INP', 'input text email 입력 텍스트 윤곽 채움 outlined filled', T('color','text','leading','space','size','radius','border','shadow','opacity')),
    part('clear-input', '지우기 버튼이 있는 텍스트 필드', 'fields', 'Molecule', 'INP', '지우기 삭제 입력 clear text field', ['input', 'icon', ...T('color','typography','text','weight','leading','size','radius','border','shadow')], { entry: 'INP-92' }),
    part('unit-input', '접두사·접미사가 있는 텍스트 필드', 'fields', 'Molecule', 'INP', '단위 금액 통화 숫자 입력 suffix unit', ['input', ...T('color','typography','text','weight','leading','space','size','radius','border','shadow')], { entry: 'INP-34' }),
    part('stepper', '스텝퍼', 'fields', 'Molecule', 'INP', '수량 빼기 더하기 숫자 증감 stepper', ['input', 'icon', ...T('color','typography','text','weight','leading','space','size','radius','border','shadow')], { entry: 'INP-10' }),
    part('password-input', '비밀번호 입력', 'fields', 'Molecule', 'INP', '비밀번호 보기 숨기기 password reveal', ['input', ...T('color','typography','text','weight','leading','space','size','radius','border','shadow')], { entry: 'INP-15' }),
    part('field', '텍스트 입력 필드', 'fields', 'Molecule', 'INP', 'label 오류 검증 validation error 폼 라벨 설명', ['input', ...T('color','text','weight','leading','space','size','radius','border')], { entry: 'INP-47' }),
    part('date-range', '범위 입력 필드', 'fields', 'Molecule', 'INP', '기간 시작 끝 범위 날짜 date range', ['field', ...T('color','typography','text','weight','leading','size','radius','border','shadow')], { entry: 'INP-11' }),
    part('search-bar', '검색 필드', 'fields', 'Molecule', 'ATM', '검색창 알약 검색 막대 search bar', ['field', 'button', ...T('color','space','size','radius','border','shadow','breakpoint')], { entry: 'ATM-89' }),
    ...['checkbox','radio','switch'].map((id, i) => part(id, ['체크박스','라디오 버튼','스위치'][i], 'selection', 'Atom', 'INP', 'checkbox radio switch toggle 선택 체크박스 토글', T('color','text','weight','space','size','radius','border','shadow','opacity','motion'), { behavior: true })),
    part('check-card', '다중 선택 타일', 'selection', 'Atom', 'INP', '선택 카드 체크박스 카드 설명 checkbox card', ['checkbox', ...T('color','text','weight','space','radius','border')], { entry: 'INP-77' }),
    part('radio-card', '단일 선택 타일', 'selection', 'Atom', 'INP', '선택 카드 라디오 카드 설명 radio card', ['radio', ...T('color','text','weight','space','radius','border')], { entry: 'INP-78' }),
    part('filter-chip', '필터 칩', 'selection', 'Atom', 'ACT', '필터 칩 알약 선택 chip filter', T('color','text','weight','space','size','radius','border'), { entry: 'ACT-36' }),
    part('badge', '배지', 'feedback', 'Atom', 'STA', 'badge status 상태 태그 연한 면 아이콘', ['icon', ...T('color','text','weight','leading','space','size','radius','border')], { entry: 'STA-01' }),
    part('count-badge', '카운터 배지', 'feedback', 'Atom', 'NAV', '개수 숫자 알림 배지 count badge', ['icon', ...T('color','text','weight','leading','space','size','radius','border')], { entry: 'NAV-25' }),
    part('tabs', '탭', 'navigation', 'Molecule', 'NAV', 'tabs 메뉴 전환 탐색', T('color','text','weight','leading','space','size','radius','border','shadow'), { entry: 'NAV-06' }),
    part('bottom-nav', '탭바', 'navigation', 'Molecule', 'NAV', 'navigation bottom tab bar 모바일 하단 메뉴', ['icon', ...T('color','text','weight','space','size','radius','border','shadow','blur','layer')], { entry: 'NAV-05' }),
    part('notice', '인라인 알림', 'feedback', 'Atom', 'STA', '알림 안내 저장 완료 alert banner notice', ['status-dot', ...T('color','space','radius','border','shadow')], { entry: 'STA-02' }),
    part('toast', '스낵바', 'feedback', 'Molecule', 'STA', '토스트 스낵바 되돌리기 toast snackbar undo', ['status-dot', ...T('color','text','weight','space','size','radius','border','shadow')], { entry: 'STA-03' }),
    part('progress-bar', '진행 과정 막대', 'feedback', 'Atom', 'STA', '진행률 막대 업로드 progress bar', T('color','text','space','size','radius','border','shadow')),
    part('progress-ring', '원형 진행 과정 표시기', 'feedback', 'Atom', 'STA', '원형 진행률 고리 progress ring circle', ['progress-bar', ...T('color','typography','text','weight','leading','tracking','space','size','radius','border','aspect')], { entry: 'STA-49' }),
    part('step-bar', '단계 표시기', 'feedback', 'Atom', 'ATM', '단계 마디 진행 막대 steps progress', ['progress-bar', ...T('color','space','size')], { entry: 'ATM-123' }),
    part('card', '카드', 'composition', 'Molecule', 'LAY', 'card 카드 제목 본문 행동 띄움 면 윤곽 elevated filled outlined', ['button', 'badge', 'divider', ...T('color','text','weight','leading','tracking','space','radius','border','shadow')], { entry: 'LAY-15' }),
    part('list-card', '가로형 카드', 'composition', 'Molecule', 'LAY', '가로형 카드 목록 카드 썸네일 list card', ['card', ...T('color','text','weight','space','radius','opacity','aspect')]),
    part('media-card', '커버가 있는 카드', 'composition', 'Molecule', 'LAY', '이미지 카드 사진 미디어 media card', ['card', ...T('color','space','opacity')]),
    // 블록: several parts placed together.
    block('action-row', '버튼 그룹', 'buttons', 'ACT', '행동 줄 주 버튼 아이콘 버튼 묶음 button group', ['button', 'icon-button', ...T('color','space','size')], { entry: 'ACT-03' }),
    block('confirm-row', '확인·취소 버튼', 'buttons', 'ACT', '확인 취소 삭제 결정 한 줄 confirm cancel', ['button', ...T('space')]),
    block('action-bar', '하단 고정 버튼', 'buttons', 'ACT', '하단 고정 버튼 엄지 자리 sticky bottom cta', ['button', ...T('color','space','border')], { entry: 'ACT-49' }),
    block('inline-form', '옆 라벨', 'fields', 'INP', '옆 라벨 양식 설정 값 여러 줄 inline form', ['field', ...T('space')], { entry: 'INP-67' }),
    block('check-list', '체크박스 그룹', 'selection', 'ATM', '체크 목록 여러 항목 설정 checklist', ['checkbox', ...T('color','text','weight','space','border')], { entry: 'ATM-153' }),
    block('select-all-list', '전체 선택', 'selection', 'INP', '전체 선택 모두 선택 일부 선택 select all', ['checkbox', ...T('color','text','weight','space','size','border')]),
    block('radio-list', '라디오 그룹', 'selection', 'INP', '라디오 목록 하나 고르기 설정 radio list', ['radio', ...T('color','text','weight','space','border')]),
    block('switch-list', '목록 행의 스위치', 'selection', 'ATM', '스위치 목록 켜기 끄기 설정 switch list', ['switch', ...T('color','text','weight','space','border')], { entry: 'ATM-203' }),
    block('search-form', '검색 양식', 'composition', 'DAT', '검색 입력 상태 필터 검색 단추 search form', ['field', 'button', ...T('space','breakpoint')], { entry: 'DAT-01', behavior: true }),
    block('filter-chip-row', '필터 칩', 'composition', 'ATM', '필터 칩 줄 상태 거르기 chips', ['filter-chip', ...T('space','size')], { entry: 'ATM-120' }),
    block('result-grid', '결과 격자', 'composition', 'LAY', '결과 격자 카드 목록 grid results', ['card', ...T('color','text','space')], { entry: 'LAY-49' }),
    block('result-list', '결과 목록', 'composition', 'LAY', '결과 목록 행 이름 비교 list results', ['card', ...T('color','text','space','border')], { entry: 'LAY-27' }),
    block('featured-results', '큰 첫 결과', 'composition', 'LAY', '추천 대표 첫 결과 featured', ['card', 'media-card', ...T('color','text','leading','space')], { entry: 'LAY-12' }),
    block('people-picker', '사용자 선택', 'composition', 'INP', '사람 고르기 얼굴 목록 검색 people picker', ['field', 'list-card', 'empty-state', ...T('color','text','space','size','radius','border')], { entry: 'INP-69', behavior: true }),
    block('empty-state', '빈 상태', 'composition', 'STA', '빈 상태 결과 없음 전체 보기 empty state', ['button', ...T('color','space','radius','border','stroke')], { entry: 'STA-06', behavior: true }),
    block('stat-row', '요약 숫자 줄', 'composition', 'DAT', '요약 숫자 개수 지표 stat', T('color','typography','text','weight','leading','tracking','space','radius','border'), { entry: 'DAT-16' }),
    { id: 'template', browse: { shelf: 'template', kind: '구성', code: 'LAY' }, name: '목록 레이아웃', section: 'page', layer: 'Template', keywords: 'template layout 틀 레이아웃 배치 슬롯', deps: ['badge', 'bottom-nav', 'stat-row', ...T('color','text','weight','leading','tracking','space','container','radius','border','stroke')] },
    { id: 'page', browse: { shelf: 'template', kind: '구성', code: 'LAY' }, name: '컬렉션 화면', section: 'page', layer: 'Page', keywords: 'page layout template 레이아웃 템플릿 화면 흐름 검색 결과', deps: ['template', 'search-form', 'search-bar', 'filter-chip-row', 'result-grid', 'result-list', 'empty-state', ...T('color','text','weight','space','radius','border')], behavior: true }
  ].concat([{"id":"settings-form","name":"프로필 설정","english":"SettingsForm","reactExport":"SettingsForm","section":"composition","layer":"Module","browse":{"shelf":"block","kind":"모듈","code":"ACC","fit":true},"keywords":"SettingsForm 프로필을 수정하고 저장 실패 후 재시도","deps":["field","textarea","select","switch","button","token-color","token-text","token-space","token-container"],"behavior":true},{"id":"login-form","name":"로그인","english":"LoginForm","reactExport":"LoginForm","section":"composition","layer":"Module","browse":{"shelf":"block","kind":"모듈","code":"ACC","fit":true},"entry":"ACC-01","keywords":"LoginForm 인증 서비스에 연결하는 로그인 폼","deps":["field","button","settings-form"],"behavior":true},{"id":"input-result","name":"입력과 계산 결과","english":"InputResult","reactExport":"InputResult","section":"composition","layer":"Module","browse":{"shelf":"block","kind":"모듈","code":"TOO","fit":true},"keywords":"InputResult 입력값을 검증하고 계산 결과 표시","deps":["field","button","settings-form","token-text","token-weight"],"behavior":true},{"id":"comparison","name":"비교와 선택","english":"Comparison","reactExport":"Comparison","section":"composition","layer":"Module","browse":{"shelf":"block","kind":"모듈","code":"COM","fit":true},"keywords":"Comparison 대상의 차이를 비교한 뒤 하나 선택","deps":["button","token-color","token-space","token-container","token-radius","token-border"],"behavior":true},{"id":"article-page","name":"본문과 목차","english":"ArticlePage","reactExport":"ArticlePage","section":"page","layer":"Page","browse":{"shelf":"template","kind":"페이지","code":"BLG","fit":true},"keywords":"ArticlePage 목차에서 긴 본문으로 이동해 읽기","deps":["token-color","token-text","token-leading","token-space","token-size","token-container"],"behavior":false}]).concat([
  {
    "id": "textarea",
    "name": "여러 줄 입력",
    "section": "fields",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "INP",
      "fit": false
    },
    "entry": "INP-03",
    "english": "Textarea",
    "reactExport": "Textarea",
    "keywords": "Textarea 긴 글을 입력하고 수정",
    "deps": [
      "input",
      "field",
      "token-space"
    ],
    "behavior": true
  },
  {
    "id": "select",
    "name": "선택 상자",
    "section": "fields",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "INP",
      "fit": false
    },
    "entry": "INP-06",
    "english": "Select",
    "reactExport": "Select",
    "keywords": "Select 정해진 값 중 하나 선택",
    "deps": [
      "input",
      "field",
      "token-size"
    ],
    "behavior": true
  },
  {
    "id": "combobox",
    "name": "검색 가능한 선택",
    "section": "fields",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "INP",
      "fit": false
    },
    "entry": "INP-07",
    "english": "Combobox",
    "reactExport": "Combobox",
    "keywords": "Combobox 입력으로 후보를 좁혀 선택",
    "deps": [
      "input",
      "field",
      "token-color",
      "token-space",
      "token-size",
      "token-radius",
      "token-border",
      "token-layer"
    ],
    "behavior": true
  },
  {
    "id": "file-upload",
    "name": "파일 선택",
    "section": "fields",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "INP",
      "fit": false
    },
    "entry": "INP-12",
    "english": "FileUpload",
    "reactExport": "FileUpload",
    "keywords": "FileUpload 파일 형식과 크기를 확인하고 전달",
    "deps": [
      "field",
      "token-color",
      "token-space",
      "token-size",
      "token-radius",
      "token-border"
    ],
    "behavior": true
  },
  {
    "id": "dialog",
    "name": "대화상자",
    "section": "feedback",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "ACT",
      "fit": false
    },
    "entry": "ACT-07",
    "english": "Dialog",
    "reactExport": "Dialog",
    "keywords": "Dialog 배경을 잠그고 내용을 확인",
    "deps": [
      "button",
      "confirm-row",
      "token-color",
      "token-text",
      "token-space",
      "token-container",
      "token-radius",
      "token-border"
    ],
    "behavior": true
  },
  {
    "id": "confirmation-dialog",
    "name": "실행 전 확인",
    "section": "feedback",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "ACT",
      "fit": false
    },
    "entry": "ACT-08",
    "english": "ConfirmationDialog",
    "reactExport": "ConfirmationDialog",
    "keywords": "ConfirmationDialog 취소 가능한 확인 뒤 행동 실행",
    "deps": [
      "dialog"
    ],
    "behavior": true
  },
  {
    "id": "drawer",
    "name": "옆에서 열리는 창",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "ACT",
      "fit": false
    },
    "english": "Drawer",
    "reactExport": "Drawer",
    "keywords": "Drawer 보조 작업을 별도 창에서 처리",
    "deps": [
      "dialog"
    ],
    "behavior": true
  },
  {
    "id": "popover",
    "name": "팝오버",
    "section": "feedback",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "ACT",
      "fit": false
    },
    "entry": "ACT-09",
    "english": "Popover",
    "reactExport": "Popover",
    "keywords": "Popover 필요한 부가 정보를 열어 확인",
    "deps": [
      "button",
      "token-color",
      "token-space",
      "token-container",
      "token-radius",
      "token-border"
    ],
    "behavior": true
  },
  {
    "id": "tooltip",
    "name": "툴팁",
    "section": "feedback",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "ACT",
      "fit": false
    },
    "entry": "ACT-10",
    "english": "Tooltip",
    "reactExport": "Tooltip",
    "keywords": "Tooltip 행동의 짧은 부가 설명",
    "deps": [
      "button",
      "token-color",
      "token-text",
      "token-space",
      "token-container",
      "token-radius",
      "token-layer"
    ],
    "behavior": false
  },
  {
    "id": "accordion",
    "name": "접고 펼치기",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "english": "Accordion",
    "reactExport": "Accordion",
    "keywords": "Accordion 필요한 설명을 선택해서 읽기",
    "deps": [
      "token-color",
      "token-space",
      "token-size",
      "token-border"
    ],
    "behavior": true
  },
  {
    "id": "breadcrumb",
    "name": "현재 위치 경로",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": false
    },
    "entry": "NAV-08",
    "english": "Breadcrumb",
    "reactExport": "Breadcrumb",
    "keywords": "Breadcrumb 상위 위치로 돌아가기",
    "deps": [
      "token-color",
      "token-space",
      "token-size"
    ],
    "behavior": false
  },
  {
    "id": "pagination",
    "name": "페이지 이동",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": false
    },
    "entry": "NAV-10",
    "english": "Pagination",
    "reactExport": "Pagination",
    "keywords": "Pagination 결과를 쪽 단위로 탐색",
    "deps": [
      "button",
      "token-space"
    ],
    "behavior": true
  },
  {
    "id": "side-nav",
    "name": "사이드 탐색",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "english": "SideNav",
    "reactExport": "SideNav",
    "keywords": "SideNav 주요 작업 화면 사이 이동",
    "deps": [
      "token-color",
      "token-space",
      "token-size",
      "token-radius"
    ],
    "behavior": false
  },
  {
    "id": "spinner",
    "name": "로딩 표시",
    "section": "feedback",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "STA",
      "fit": false
    },
    "english": "Spinner",
    "reactExport": "Spinner",
    "keywords": "Spinner 진행 중인 작업을 알림",
    "deps": [
      "button",
      "token-space"
    ],
    "behavior": false
  },
  {
    "id": "skeleton",
    "name": "로딩 자리 표시",
    "section": "feedback",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "STA",
      "fit": true
    },
    "english": "Skeleton",
    "reactExport": "Skeleton",
    "keywords": "Skeleton 불러올 콘텐츠 위치를 표시",
    "deps": [
      "token-color",
      "token-space",
      "token-size",
      "token-radius"
    ],
    "behavior": false
  },
  {
    "id": "error-state",
    "name": "오류와 재시도",
    "section": "feedback",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "STA",
      "fit": false
    },
    "english": "ErrorState",
    "reactExport": "ErrorState",
    "keywords": "ErrorState 실패 원인과 재시도 행동 제공",
    "deps": [
      "button",
      "token-color",
      "token-space",
      "token-radius",
      "token-border"
    ],
    "behavior": true
  },
  {
    "id": "offline-state",
    "name": "연결 끊김 안내",
    "section": "feedback",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "STA",
      "fit": false
    },
    "english": "OfflineState",
    "reactExport": "OfflineState",
    "keywords": "OfflineState 연결을 회복하고 다시 시도",
    "deps": [
      "error-state",
      "token-color"
    ],
    "behavior": true
  }
]).concat([{"id":"error-summary","name":"입력 오류 요약","english":"ErrorSummary","reactExport":"ErrorSummary","section":"feedback","layer":"Molecule","browse":{"shelf":"part","kind":"부품","code":"STA","fit":true},"entry":"STA-07","keywords":"Error summary 입력 오류 위치 수정 초점","deps":["token-color","token-text","token-space","token-size","token-radius","token-border"],"behavior":true},{"id":"summary-list","entry":"DAT-54","name":"이름과 값 요약","english":"SummaryList","reactExport":"SummaryList","section":"composition","layer":"Molecule","browse":{"shelf":"part","kind":"부품","code":"DAT","fit":true},"keywords":"Summary list 요약 정의 목록 검토 확인","deps":["token-color","token-text","token-weight","token-space","token-size","token-container","token-border"]},{"id":"data-form","name":"입력과 제출","english":"DataForm","reactExport":"DataForm","section":"fields","layer":"Module","browse":{"shelf":"block","kind":"모듈","code":"INP","fit":true},"keywords":"Data form 신청 입력 검증 오류 제출 재시도","deps":["field","textarea","select","checkbox","button","error-summary","settings-form","token-color"],"behavior":true}]).map(item => ({ ...item, english: item.english || english[item.id], version:item.version || version, lifecycle: item.lifecycle || 'Trial', environments: ['HTML','React'], behavior: item.behavior || interactive.includes(item.id) }));
  // A dictionary concept and its reusable implementation must resolve identically.
  const dictionaryLinks = { input:'INP-02', checkbox:'INP-04', 'radio-list':'INP-05', switch:'INP-08' };
  for (const [id, entry] of Object.entries(dictionaryLinks)) items.find(item => item.id === id).entry = entry;
  // A record editor is a use of a dialog, not the generic dialog contract.
  delete items.find(item => item.id === 'record-editor').entry;
  const control = (key, label, values) => ({ key, label, values });
  const choiceStates = [['checked','선택됨'],['unchecked','선택 안 됨'],['disabled','사용 불가']];
  const plainStates = [['','기본'],['disabled','사용 불가']];
  const buttonStates = [['','기본'],['hover','Hover'],['pressed','Pressed'],['focus','Focus'],['disabled','Disabled'],['loading','Loading']];
  const sizes = [['md','Medium · 48'],['sm','Small · 44'],['lg','Large · 56']];
  const controls = {
    button: [control('size','크기',sizes), control('state','상태',buttonStates), control('icon','아이콘',[['','없음'],['search','검색'],['arrow','화살표']])],
    'icon-button': [control('size','크기',sizes), control('state','상태',buttonStates), control('icon','아이콘',[['search','검색'],['bookmark','보관'],['edit','수정']])],
    icon: [control('icon','아이콘',Object.keys(window.Pattove.iconMarkup).map(name => [name,name]))],
    'icon-label': [control('icon','아이콘',[['search','검색'],['bell','알림'],['bookmark','보관'],['upload','올리기']])],
    input: [control('state','상태',plainStates), control('type','입력 종류',[['text','텍스트'],['email','이메일'],['search','검색'],['password','비밀번호']])],
    'clear-input': [control('state','상태',plainStates)], 'unit-input': [control('state','상태',plainStates)],
    stepper: [control('state','상태',plainStates)], 'password-input': [control('state','상태',plainStates)],
    field: [control('state','상태',[['','기본'],['focus','초점'],['error','오류'],['success','완료'],['disabled','사용 불가']])],
    'date-range': [control('state','상태',[['','기본'],['focus','초점'],['error','오류'],['success','완료'],['disabled','사용 불가']])],
    checkbox: [control('state','상태',[...choiceStates,['indeterminate','일부 선택']])],
    radio: [control('state','상태',choiceStates)], switch: [control('state','상태',choiceStates)],
    'check-card': [control('state','상태',choiceStates)], 'radio-card': [control('state','상태',choiceStates)], 'filter-chip': [control('state','상태',choiceStates)],
    'segmented-button': [control('state','상태',plainStates)],
    'check-list': [control('state','상태',plainStates)], 'radio-list': [control('state','상태',plainStates)], 'switch-list': [control('state','상태',plainStates)],
    'select-all-list': [control('state','상태',[['checked','모두 선택'],['indeterminate','일부 선택'],['unchecked','선택 안 됨'],['disabled','사용 불가']])],
    badge: [control('tone','상태',[['neutral','진행 중'],['success','완료'],['warning','확인 필요'],['error','실패']])],
    'count-badge': [control('count','개수',[['3','3개'],['120','99개 넘음'],['0','없음']])],
  };
  // Looks of one part: the same structure doing the same job, only the surface changes.
  // `when` = the situation it fits, `saves` = the effort it takes away from the person using it.
  const look = (no, id, name, when, saves) => ({ no, id, name, when, saves });
  // Template and page share the screen arrangements; the page fills each with matching search blocks.
  const pageLooks = [
    look('01','stack','기본 쌓기','처음 만드는 목록 화면','배치 고민'),
    look('02','hero','큰 제목 (Large title)','검색이 첫 할 일인 화면','검색창 찾기'),
    look('03','appbar','가운데 정렬 앱 바 (Center aligned)','목록을 한 화면에 더 보고 싶을 때','더 보려고 스크롤'),
    look('04','sheet','모달 바텀 시트 (Modal bottom sheet)','필터를 자주 바꿀 때','드롭다운 열기'),
    look('05','dashboard','대시보드 (Dashboard)','개수부터 파악할 때','탭마다 세어 보기')
  ];
  // Filled · outlined · text, as in Material 3 common buttons and shadcn/ui button variants. First entry = current shape.
  const buttonLooks = [
    look('01','primary','채운 버튼 (Filled)','화면의 주 행동','무엇을 누를지 고르기'),
    look('02','outline','윤곽선 버튼 (Outlined)','주 행동 옆의 보조 행동','주 행동과 헷갈리기'),
    look('03','ghost','텍스트 버튼 (Text)','덜 중요한 행동·취소','눈이 여러 번 멈추기')
  ];
  const galleries = {
    'bottom-nav': { key: 'variant', label: '모양', default: 'line', frame: 'phone-bottom', list: [
      look('01','minimal','내비게이션 바 (Navigation bar)','내용이 주인공인 읽기 앱','메뉴가 눈을 뺏는 일'),
      look('02','glass','Liquid Glass 탭 막대','사진·지도가 바닥까지 깔릴 때','가려진 내용 보러 스크롤'),
      look('03','float','FAB이 있는 하단 앱 바 (Bottom app bar)','만들기가 가장 잦은 앱','만들기 버튼 찾기'),
      look('04','pill','활성 표시기 (Active indicator)','지금 위치를 한눈에 알아야 할 때','현재 탭 찾기'),
      look('05','line','위쪽 표시줄','처음 쓰는 사람이 많은 앱','낯선 표시 알아보기')
    ] },
    button: { key: 'variant', list: buttonLooks },
    'icon-button': { key: 'variant', list: buttonLooks },
    // Outlined · filled text fields (Material 3). The input keeps one structure; only the box surface changes.
    input: { list: [
      look('01','box','윤곽선 텍스트 필드 (Outlined)','여러 칸이 모인 양식','칸 경계 찾기'),
      look('02','filled','채운 텍스트 필드 (Filled)','칸이 적고 여백이 넓은 화면','빈칸 알아보기')
    ] },
    badge: { list: [
      look('01','soft','Tint 배지','목록 옆 짧은 상태','상태 글 읽기'),
      look('02','icon','아이콘이 있는 배지 (With icon)','색을 구분하기 어려운 사람도 볼 때','색으로 뜻 해석')
    ] },
    tabs: { list: [
      look('01','filled','버튼형 탭 (Contained)','이름이 짧은 2~4개 화면','지금 탭 찾기'),
      look('02','icon','아이콘 탭 (Tabs with icons)','휴대폰 좁은 폭의 탭','긴 이름 읽기'),
      look('03','count','배지가 있는 탭 (With badge)','탭마다 쌓인 수가 중요할 때','하나씩 눌러 보기'),
      look('04','vertical','수직 탭 (Vertical)','탭이 5개 넘는 넓은 화면','가로 스크롤'),
      look('05','scroll','스크롤 가능한 탭 (Scrollable tabs)','휴대폰에서 탭이 5개 넘을 때','메뉴 열어 탭 찾기')
    ] },
    // Elevated · filled · outlined cards (Material 3).
    card: { list: [
      look('01','raised','Elevated 카드','글이 주인공인 카드','무엇인지 알아보기'),
      look('02','filled','Filled 카드','카드가 여러 장 모인 목록','카드 경계 찾기'),
      look('03','outlined','Outlined 카드','그림자가 많은 화면 위','겹친 그림자 읽기')
    ] },
    template: { frame: 'phone', list: pageLooks },
    page: { frame: 'phone', list: pageLooks }
  };
  for (const g of Object.values(galleries)) Object.assign(g, { key: g.key || 'look', label: g.label || '모양', frame: g.frame || 'stage' });
  for (const [id, g] of Object.entries(galleries)) {
    let c = controls[id]?.find(c => c.key === g.key);
    if (!c) (controls[id] ||= []).unshift(c = control(g.key, g.label, []));
    Object.assign(c, { values: g.list.map(v => [v.id, v.name]), default: g.default ?? g.list[0].id });
  }
  const contracts = {
    'data-table':['자료를 검색·필터·정렬하고 쪽 단위로 선택', 'records의 id는 유일하고 안정적이어야 함. 검색·필터 변경 시 첫 쪽과 선택을 초기화. React는 TanStack React Table, HTML은 동봉한 Table Core 필요. Toolbar·Pagination은 table 인스턴스를 받아 따로 배치 가능.', ['records','statuses','titleLabel','ownerLabel','searchLabel','onEdit','onSelectionChange','loading','error','onRetry','actions'], ['onEdit(record)','onSelectionChange(records)']],
    'record-editor':['상세 확인과 비동기 저장·실패 복구', '저장 중 중복 요청과 닫기를 막음. 실패하면 입력 유지. 변경 취소는 재확인. React는 record·onSave·onClose, HTML은 Pattove.admin.connectEditor(root, options).open(record, trigger)로 단독 사용. null이나 잘못된 저장 응답은 실패로 처리.', ['record','statuses','titleLabel','ownerLabel','onSave','onClose'], ['onSave(record)','onClose()']],
    'admin-shell':['관리 메뉴와 본문 배치', 'navigation은 실제 목적지와 label을 제공. 작은 화면에서는 메뉴를 본문 위로 이동. 인증이나 권한 검사는 소비 프로젝트가 연결.', ['title','navigation','children','notice'], []],
    'admin-page':['목록·상세·편집·저장·복귀 흐름', 'initialRecords로 초기 콘텐츠를 제공. onSave는 Promise 또는 저장된 record를 반환하며 실패 시 reject. 연결하지 않은 예제는 화면 안에서만 유지. loadRecords({signal})로 목록 읽기와 새로고침·실패 재시도를 연결. 늦은 응답은 폐기. initialRecords는 초기값이며 편집 중 목록 교체 금지.', ['title','initialRecords','statuses','titleLabel','ownerLabel','searchLabel','navigation','onSave','loadRecords'], ['onSave(record)','pattove:admin-saved']],
    'token-color': ['배경·글자·선·강조 색의 역할 이름', 'var(--p-*) 역할 이름으로만 참조. 새 색은 원시값에 추가하고 역할에 연결. 섞은 색(veil·wash·tint)도 색 역할끼리 섞어 만든 역할로 참조', [], []],
    'token-gradient': ['넓은 배경과 구분선에 쓰는 그러데이션', 'var(--p-gradient-*)로 참조. 색은 색 역할에서만 가져오고 각도·멈춤 위치는 원시값에서 가져옴', [], []],
    'token-typography': ['글꼴과 글자 설정 묶음', 'var(--p-font)·var(--p-display-font)·var(--p-type-*)로 참조. 글꼴 파일은 pattove-fonts 항목이 제공. 크기·굵기·줄 간격은 각 토큰 종류에서 가져옴', [], []],
    'token-text': ['글자 크기 단계', 'var(--p-text-*) 8단계(sm 12px~display 40px)로만 참조. 글자 크기를 px로 직접 쓰지 않음. 단계에 없는 장식용 큰 글자만 calc(var(--p-space-unit) * N)', [], []],
    'token-weight': ['글자 굵기 단계', 'var(--p-weight-*) 6단계(light 300~extrabold 800)로 참조. 숫자 굵기를 부품에 직접 쓰지 않음', [], []],
    'token-leading': ['줄 간격 단계', 'var(--p-leading-*) 6단계(none 1~loose 1.8)로 참조', [], []],
    'token-tracking': ['자간 단계', '큰 제목은 tighter, 숫자·제목은 tight, 넓힌 이름표는 wide', [], []],
    'token-space': ['여백과 간격의 단계', 'var(--p-space-*) 4px 격자 단계(3xs 2px~5xl 80px)를 사용. 단계에 없는 4px 배수는 calc(var(--p-space-unit) * N), 음수는 calc(단계 * -1)', [], []],
    'token-size': ['상자·아이콘·조작 요소의 크기', 'var(--p-size-*)·var(--p-icon-*)·var(--p-control-size-*)로 참조. 한 번 쓰는 패널 크기는 calc(var(--p-space-unit) * N), 부모 대비 몫은 calc(100% * n / d)', [], []],
    'token-container': ['카드·패널·페이지의 너비', 'var(--p-container-*)·var(--p-measure*)로 참조. 한 번 쓰는 열 너비는 calc(var(--p-space-unit) * N)', [], []],
    'token-radius': ['표면·조작 요소·안쪽 모서리 둥글기', 'var(--p-radius)·var(--p-control-radius)·var(--p-inner-radius)와 var(--p-radius-*) 단계(xs 2px~2xl 24px, full, circle)로 참조', [], []],
    'token-border': ['테두리 두께와 초점 링 간격', 'var(--p-border-width*)·var(--p-focus-offset*)·var(--p-underline-offset)로 참조', [], []],
    'token-stroke': ['선 모양과 아이콘 선 굵기', '점선·파선은 var(--p-stroke-dashed|dotted), 아이콘 선 굵기는 var(--p-icon-stroke*)로 참조', [], []],
    'token-shadow': ['띄움·눌림·떠 있는 층의 그림자', 'var(--p-shadow)·var(--p-inset)·var(--p-float) 등 역할 이름으로 참조. box-shadow를 부품에 직접 쓰지 않음', [], []],
    'token-blur': ['유리 표면과 배경 흐림', 'filter·backdrop-filter 값은 var(--p-blur-*)로 참조', [], []],
    'token-opacity': ['상태별 불투명도', 'var(--p-opacity-*)로 참조', [], []],
    'token-aspect': ['그림·표본의 가로세로 비율', 'aspect-ratio는 var(--p-aspect-*)로 참조', [], []],
    'token-motion': ['상태 전환 시간과 가속 곡선', 'var(--p-duration*)·var(--p-ease-*)·var(--p-rise-*)로 참조. 전환 시간 값을 부품마다 따로 쓰지 않음', [], []],
    'token-layer': ['겹치는 층의 앞뒤 순서', 'z-index는 var(--p-layer-*)로만 참조', [], []],
    'token-breakpoint': ['화면 폭과 영역 폭의 분기 기준', '@media·@container는 var()를 못 읽으므로 px를 쓰되 이 목록의 값만 사용(빌드가 검사)', [], []],
    icon: ['한 개의 그림 기호', '아이콘만 있는 행동에는 접근 가능한 이름을 제공', ['icon'], []],
    'icon-label': ['그림 기호와 그 이름', '처음 보는 아이콘은 이름을 함께 보여 줌. 이름은 아이콘 아래 한 줄', ['icon','label'], []],
    divider: ['영역의 경계', '부모의 가로 너비에 맞춰 사용', [], []],
    'text-divider': ['두 방법 사이의 경계와 그 관계', '가운데 글자는 짧게(또는·그리고). 부모의 가로 너비에 맞춰 사용', ['label'], []],
    'status-dot': ['상태를 색과 글자로 표시', '상태 이름을 함께 유지', ['label'], []],
    avatar: ['사람의 얼굴 자리와 접속 여부', '읽는 이름에 사람 이름과 접속 상태를 함께 제공. 사진이 없으면 이름 첫 글자', ['name','online'], []],
    button: ['행동 실행', '글자가 있는 버튼. 실행할 일은 click에 연결. 한 화면의 채움 버튼은 하나', ['label','variant','size','state','iconName','count','type','action'], ['click','pattove:action']],
    'icon-button': ['그림 하나로 행동 실행', '읽는 이름(label)을 반드시 제공. 누르는 칸은 44px 이상', ['label','iconName','variant','size','state','action'], ['click','pattove:action']],
    'segmented-button': ['2~4개 중 하나를 바로 바꾸기', '같은 그룹은 name 공유. 고른 칸은 색과 체크 표시로 구분', ['legend','items','value','name','disabled'], ['change']],
    input: ['한 줄 값 입력', 'label과 id를 연결. 오류에는 설명과 aria-invalid를 함께 사용', ['id','value','placeholder','type','name','disabled','invalid','description','look'], ['input','change']],
    'clear-input': ['통째로 다시 쓰는 값 입력', '지우기 단추는 값이 있을 때만 보임. 이름은 "라벨 지우기"', ['id','label','value','placeholder','disabled'], ['input','change']],
    'unit-input': ['단위가 붙는 숫자 입력', '숫자와 단위를 한 칸에. 단위 고르기에도 이름 제공', ['id','label','value','units','disabled'], ['input','change']],
    stepper: ['작은 수를 빼기·더하기로 바꾸기', '빼기·더하기 단추에 이름 제공. 최솟값 아래로 내려가지 않음', ['id','value','min','max','disabled'], ['input','change']],
    'password-input': ['가려진 비밀번호 입력', '보기 단추는 이름(보기·숨기기)으로 상태 제공. 값은 그대로 유지', ['id','label','value','disabled'], ['input','change']],
    field: ['라벨·입력·설명·오류의 연결', '라벨과 도움말의 id 관계를 함께 가져오기', ['id','label','value','state','help','name','type'], ['input','change']],
    'date-range': ['시작과 끝 값을 한 칸에', '끝 칸은 "라벨 끝" 이름을 가짐. 오류·도움말은 두 칸 모두에 연결', ['id','label','start','end','state','help'], ['input','change']],
    'search-bar': ['검색어 하나로 찾기', '라벨은 화면에서만 숨김. 검색 단추는 submit', ['prefix','placeholder'], ['submit','change']],
    checkbox: ['여러 개 중 선택', '연결된 label을 조작 영역으로 유지', ['label','checked','disabled','indeterminate','name','value'], ['change']],
    radio: ['같은 그룹에서 하나 선택', '같은 그룹은 name 공유, 다른 그룹은 name 분리', ['label','checked','disabled','name','value'], ['change']],
    switch: ['설정을 켜고 끄기', '동작 이름을 label로 제공', ['label','checked','disabled'], ['change']],
    'check-card': ['설명이 붙은 선택지 고르기', '카드 전체가 누르는 칸. 고르면 테두리와 체크 표시가 함께 바뀜', ['label','description','checked','disabled','name','value'], ['change']],
    'radio-card': ['설명이 붙은 선택지 중 하나 고르기', '카드 전체가 누르는 칸. 같은 그룹은 name 공유', ['label','description','checked','disabled','name','value'], ['change']],
    'filter-chip': ['필터 하나를 켜고 끄기', '켜진 칩은 색과 체크 표시로 구분. 여러 개는 checkbox, 하나만은 radio', ['label','checked','disabled','name','value','type'], ['change']],
    badge: ['짧은 상태 이름', '색만으로 상태를 구분하지 않음', ['label','tone','look'], []],
    'count-badge': ['아이콘 뒤에 쌓인 개수', '읽는 이름(예: 새 알림 3개)을 함께 제공. 0이면 숫자를 숨기고 99를 넘으면 99+', ['count','icon'], []],
    tabs: ['같은 영역의 내용 전환', '탭과 패널의 id 연결을 유지. 세로 탭은 위아래 방향키. 옆으로 밀기 탭은 고른 탭이 화면 안에 보이도록 스크롤', ['prefix','look'], ['pattove:tabchange']],
    'bottom-nav': ['주요 목적지 선택', '목적지 이동은 pattove:navigate 이벤트에 연결. 가운데 만들기 버튼(float)은 pattove:create(React는 onCreate)에 연결. 표본은 선택 상태를 제공', ['variant','onCreate (React)'], ['pattove:navigate','pattove:create (HTML)']],
    notice: ['행동의 결과 알림', 'role="status"로 읽힘. 점과 글자로 상태를 함께 표시', ['text'], []],
    toast: ['되돌릴 수 있는 행동 직후의 잠깐 알림', '되돌리기는 pattove:undo(React는 onUndo)에 연결. 확인 창 대신 바로 실행하고 되돌리기를 줌', ['text','open','onUndo (React)'], ['pattove:undo']],
    'progress-bar': ['작업이 얼마나 됐는지', '진짜 progress 요소와 숫자를 함께 유지', ['value','label'], []],
    'progress-ring': ['남은 양을 고리로', '고리는 그림일 뿐, 읽는 값은 숨긴 progress 요소가 제공', ['value','label'], []],
    'step-bar': ['정해진 단계 중 몇 번째인지', 'progress의 value·max를 단계 수로 사용. 숫자(3/5)를 함께 표시', ['step','steps','label'], []],
    card: ['제목·본문·상태·행동 조합', '단독 표본은 선택 토글. 결과 블록에서는 상세 열기', ['title','description','tag','action','behavior','look'], ['pattove:select']],
    'list-card': ['위아래로 비교하는 가로형 카드', '왼쪽 그림 자리(사진이 없으면 첫 글자), 오른쪽 글. 행동은 카드와 같은 위치', ['title','description','tag','action','initial'], ['pattove:select']],
    'media-card': ['사진으로 고르는 카드', '그림 자리는 꾸밈(aria-hidden). 제목이 뜻을 전함', ['title','description','tag','action'], ['pattove:select']],
    'action-row': ['주 행동 하나와 보조 행동 아이콘들', '주 행동이 넓게, 나머지는 아이콘 버튼. 아이콘 버튼마다 읽는 이름', ['label','count','actions'], ['click']],
    'confirm-row': ['되돌리기 어려운 결정 직전의 확인·취소', '취소는 글자 버튼, 결정은 채움 버튼. 결정 버튼은 오른쪽', ['confirmLabel','cancelLabel'], ['click']],
    'action-bar': ['긴 화면 끝의 결정 버튼', '화면 아래에 가로로 가득. 엄지가 닿는 자리', ['label'], ['click']],
    'inline-form': ['짧은 설정 값 여러 줄', '라벨이 왼쪽, 값이 오른쪽. 좁은 칸에서도 라벨과 id 연결 유지', ['fields'], ['input','change']],
    'check-list': ['설정 화면의 여러 항목 켜기', '줄 전체가 누르는 칸. 이름은 왼쪽, 체크는 오른쪽', ['legend','items'], ['change']],
    'select-all-list': ['같은 종류 여러 개를 한 번에', '일부만 고르면 부모가 중간 상태(indeterminate)', ['legend','items','value'], ['change']],
    'radio-list': ['설정 화면에서 하나 고르기', '같은 그룹은 name 공유. 줄 전체가 누르는 칸', ['legend','items','name'], ['change']],
    'switch-list': ['바로 적용되는 설정 여러 개', '줄마다 스위치 하나. 동작 이름을 label로', ['legend','items'], ['change']],
    'search-form': ['이름과 상태로 찾기', '검색어·상태 고르기·검색 단추. 상태 칸 대신 필터 칩 줄을 넣을 수 있음. 결과 블록과 함께 쓰면 거름', ['prefix','filter'], ['submit','change']],
    'filter-chip-row': ['몇 가지 상태로 자주 거르기', '하나만 고르는 radio 칩 줄. 검색 양식 안에 넣으면 바로 거름', ['name','items','value'], ['change']],
    'result-grid': ['훑어보며 고르는 카드 격자', '개수 줄(role="status")과 카드 격자. 좁으면 한 줄에 하나', ['records','action'], ['pattove:select']],
    'result-list': ['이름으로 빠르게 비교하는 목록', '개수 줄과 한 줄짜리 행. 행동은 행 끝', ['records','action'], ['pattove:select']],
    'featured-results': ['추천 하나를 앞세운 결과', '첫 결과만 이미지 카드로 한 줄을 차지', ['records','action'], ['pattove:select']],
    'people-picker': ['사람이 많을 때 골라 담기', '치는 동안 바로 좁힘. 행 전체가 누르는 칸. 없으면 빈 상태', ['prefix','people'], ['input','pattove:select']],
    'empty-state': ['결과가 없을 때 되돌아가기', '이유 한 줄과 전체 보기 단추. 검색 블록 안에서는 거른 조건을 풂', ['text','action'], ['click']],
    'stat-row': ['개수부터 파악하는 숫자 줄', '숫자는 크게, 이름은 작게. 3칸', ['items'], []],
    template: ['제목·본문·하단 탐색의 배치', 'body에는 신뢰할 수 있는 부품 마크업만 전달', ['title','eyebrow','count','body','look'], []],
    page: ['실제 콘텐츠가 들어간 조합', '템플릿과 검색 양식·결과 블록을 재사용. HTML은 화면 안의 보관 상태를 바꾸고 pattove:save로 알림. React는 onSave(record)의 성공·실패와 대기 상태를 처리. 서버·로그인 없이 예시 데이터로 실행', ['prefix','look','records','onSave (React)'], ['pattove:save (HTML)','onSave(record) (React)']]
  };
  Object.assign(contracts, {
  "textarea": [
    "긴 글을 입력하고 수정",
    "HTML은 renderItem의 options로 콘텐츠를 전달합니다. React는 명명된 props를 사용합니다. 서버 작업은 이벤트·콜백으로 연결하고 실패 시 입력을 보존합니다.",
    [
      "label",
      "value",
      "name",
      "help",
      "error",
      "required",
      "disabled"
    ],
    [
      "input",
      "change"
    ]
  ],
  "select": [
    "정해진 값 중 하나 선택",
    "HTML은 renderItem의 options로 콘텐츠를 전달합니다. React는 명명된 props를 사용합니다. 서버 작업은 이벤트·콜백으로 연결하고 실패 시 입력을 보존합니다.",
    [
      "label",
      "items",
      "value",
      "name",
      "required",
      "error",
      "disabled"
    ],
    [
      "change"
    ]
  ],
  "combobox": [
    "입력으로 후보를 좁혀 선택",
    "HTML은 renderItem의 options로 콘텐츠를 전달합니다. React는 명명된 props를 사용합니다. 서버 작업은 이벤트·콜백으로 연결하고 실패 시 입력을 보존합니다.",
    [
      "label",
      "items",
      "value",
      "name",
      "disabled"
    ],
    [
      "pattove:select",
      "change"
    ]
  ],
  "file-upload": [
    "파일 형식과 크기를 확인하고 전달",
    "HTML은 renderItem의 options로 콘텐츠를 전달합니다. React는 명명된 props를 사용합니다. 서버 작업은 이벤트·콜백으로 연결하고 실패 시 입력을 보존합니다.",
    [
      "label",
      "accept",
      "multiple",
      "maxBytes",
      "disabled"
    ],
    [
      "pattove:files"
    ]
  ],
  "dialog": [
    "배경을 잠그고 내용을 확인",
    "HTML은 renderItem의 options로 콘텐츠를 전달합니다. React는 명명된 props를 사용합니다. 서버 작업은 이벤트·콜백으로 연결하고 실패 시 입력을 보존합니다.",
    [
      "title",
      "body",
      "trigger",
      "confirmLabel"
    ],
    [
      "pattove:dialogclose"
    ]
  ],
  "confirmation-dialog": [
    "취소 가능한 확인 뒤 행동 실행",
    "HTML은 renderItem의 options로 콘텐츠를 전달합니다. React는 명명된 props를 사용합니다. 서버 작업은 이벤트·콜백으로 연결하고 실패 시 입력을 보존합니다.",
    [
      "title",
      "body",
      "trigger",
      "confirmLabel"
    ],
    [
      "pattove:dialogclose"
    ]
  ],
  "drawer": [
    "보조 작업을 별도 창에서 처리",
    "HTML은 renderItem의 options로 콘텐츠를 전달합니다. React는 명명된 props를 사용합니다. 서버 작업은 이벤트·콜백으로 연결하고 실패 시 입력을 보존합니다.",
    [
      "title",
      "body",
      "trigger"
    ],
    [
      "pattove:dialogclose"
    ]
  ],
  "popover": [
    "필요한 부가 정보를 열어 확인",
    "HTML은 renderItem의 options로 콘텐츠를 전달합니다. React는 명명된 props를 사용합니다. 서버 작업은 이벤트·콜백으로 연결하고 실패 시 입력을 보존합니다.",
    [
      "label",
      "text"
    ],
    [
      "toggle"
    ]
  ],
  "tooltip": [
    "행동의 짧은 부가 설명",
    "HTML은 renderItem의 options로 콘텐츠를 전달합니다. React는 명명된 props를 사용합니다. 서버 작업은 이벤트·콜백으로 연결하고 실패 시 입력을 보존합니다.",
    [
      "label",
      "text"
    ],
    []
  ],
  "accordion": [
    "필요한 설명을 선택해서 읽기",
    "HTML은 renderItem의 options로 콘텐츠를 전달합니다. React는 명명된 props를 사용합니다. 서버 작업은 이벤트·콜백으로 연결하고 실패 시 입력을 보존합니다.",
    [
      "items"
    ],
    [
      "toggle"
    ]
  ],
  "breadcrumb": [
    "상위 위치로 돌아가기",
    "HTML은 renderItem의 options로 콘텐츠를 전달합니다. React는 명명된 props를 사용합니다. 서버 작업은 이벤트·콜백으로 연결하고 실패 시 입력을 보존합니다.",
    [
      "items"
    ],
    []
  ],
  "pagination": [
    "결과를 쪽 단위로 탐색",
    "HTML은 renderItem의 options로 콘텐츠를 전달합니다. React는 명명된 props를 사용합니다. 서버 작업은 이벤트·콜백으로 연결하고 실패 시 입력을 보존합니다.",
    [
      "page",
      "total"
    ],
    [
      "pattove:pagechange"
    ]
  ],
  "side-nav": [
    "주요 작업 화면 사이 이동",
    "HTML은 renderItem의 options로 콘텐츠를 전달합니다. React는 명명된 props를 사용합니다. 서버 작업은 이벤트·콜백으로 연결하고 실패 시 입력을 보존합니다.",
    [
      "label",
      "items",
      "current"
    ],
    []
  ],
  "spinner": [
    "진행 중인 작업을 알림",
    "HTML은 renderItem의 options로 콘텐츠를 전달합니다. React는 명명된 props를 사용합니다. 서버 작업은 이벤트·콜백으로 연결하고 실패 시 입력을 보존합니다.",
    [
      "label"
    ],
    []
  ],
  "skeleton": [
    "불러올 콘텐츠 위치를 표시",
    "HTML은 renderItem의 options로 콘텐츠를 전달합니다. React는 명명된 props를 사용합니다. 서버 작업은 이벤트·콜백으로 연결하고 실패 시 입력을 보존합니다.",
    [
      "label"
    ],
    []
  ],
  "error-state": [
    "실패 원인과 재시도 행동 제공",
    "HTML은 renderItem의 options로 콘텐츠를 전달합니다. React는 명명된 props를 사용합니다. 서버 작업은 이벤트·콜백으로 연결하고 실패 시 입력을 보존합니다.",
    [
      "title",
      "message",
      "action"
    ],
    [
      "pattove:retry"
    ]
  ],
  "offline-state": [
    "연결을 회복하고 다시 시도",
    "HTML은 renderItem의 options로 콘텐츠를 전달합니다. React는 명명된 props를 사용합니다. 서버 작업은 이벤트·콜백으로 연결하고 실패 시 입력을 보존합니다.",
    [
      "title",
      "message",
      "action"
    ],
    [
      "pattove:retry"
    ]
  ]
});
  for (const id of ['textarea','select','combobox','file-upload']) controls[id] = [control('state','상태',[['','기본'],['disabled','사용 불가'],...(id === 'textarea' || id === 'select' ? [['error','오류']] : [])])];
  Object.assign(contracts, {"settings-form":["프로필을 수정하고 저장 실패 후 재시도","실제 콘텐츠를 props/options로 교체합니다. 로그인·저장은 호스트 콜백이 성공한 뒤에만 완료를 알리며 입력은 실패해도 유지합니다. 인증·영구 저장 서비스는 포함하지 않습니다.",["title","name","memo"],["pattove:submit"]],"login-form":["인증 서비스에 연결하는 로그인 폼","실제 콘텐츠를 props/options로 교체합니다. 로그인·저장은 호스트 콜백이 성공한 뒤에만 완료를 알리며 입력은 실패해도 유지합니다. 인증·영구 저장 서비스는 포함하지 않습니다.",["title"],["pattove:submit"]],"input-result":["입력값을 검증하고 계산 결과 표시","실제 콘텐츠를 props/options로 교체합니다. 로그인·저장은 호스트 콜백이 성공한 뒤에만 완료를 알리며 입력은 실패해도 유지합니다. 인증·영구 저장 서비스는 포함하지 않습니다.",["title"],["submit"]],"comparison":["대상의 차이를 비교한 뒤 하나 선택","실제 콘텐츠를 props/options로 교체합니다. 로그인·저장은 호스트 콜백이 성공한 뒤에만 완료를 알리며 입력은 실패해도 유지합니다. 인증·영구 저장 서비스는 포함하지 않습니다.",["title","items"],["pattove:choose"]],"article-page":["목차에서 긴 본문으로 이동해 읽기","실제 콘텐츠를 props/options로 교체합니다. 로그인·저장은 호스트 콜백이 성공한 뒤에만 완료를 알리며 입력은 실패해도 유지합니다. 인증·영구 저장 서비스는 포함하지 않습니다.",["title","sections"],[]]});
  Object.assign(contracts,{"error-summary":["잘못된 입력의 위치와 수정 방법을 연결","오류가 있을 때 입력 옆에 같은 메시지를 표시하고 요약으로 초점을 옮깁니다. 링크의 id는 실제 입력을 가리켜야 합니다.",["title","errors","focus"],["focus"]],"summary-list":["대상의 이름과 값을 한 쌍씩 확인","항목 간 열 비교에는 표를 사용합니다. 수정 링크는 실제 입력 화면으로 연결해야 합니다.",["title","items"],[]],"data-form":["신청 내용을 검증하고 호스트에 제출","필드 이름은 고유해야 합니다. 호스트 Promise 성공 뒤에만 완료를 표시합니다. 서버 검증은 fieldErrors로 각 입력과 연결합니다.",["title","fields","submitLabel","successMessage","onSubmit"],["pattove:submit"]]});
  contracts['settings-form'][2]=['title','name','memo','initialValues'];
  contracts['input-result'][2]=['title','initialPrice','initialQuantity'];
  contracts['article-page'][2]=['title','sections','headingLevel'];
  const layoutItems = [
  {
    "id": "reading-layout",
    "entry": "LAY-01",
    "name": "읽기 배치",
    "reactExport": "ReadingLayout",
    "english": "ReadingLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "긴 글의 읽기 폭을 제한하고 가운데 배치 ReadingLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "body",
    "layoutTag": "article",
    "purpose": "긴 글의 읽기 폭을 제한하고 가운데 배치",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "sidebar-layout",
    "entry": "LAY-02",
    "name": "본문과 사이드바",
    "reactExport": "SidebarLayout",
    "english": "SidebarLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "본문과 보조 탐색을 넓이에 따라 나란히 배치 SidebarLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "body-aside",
    "layoutTag": "div",
    "purpose": "본문과 보조 탐색을 넓이에 따라 나란히 배치",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "split-layout",
    "entry": "LAY-05",
    "name": "분할 배치",
    "reactExport": "SplitLayout",
    "english": "SplitLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "동등한 두 영역을 나란히 배치하고 좁은 폭에서 쌓기 SplitLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "body-aside",
    "layoutTag": "div",
    "purpose": "동등한 두 영역을 나란히 배치하고 좁은 폭에서 쌓기",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "grid-layout",
    "entry": "LAY-06",
    "name": "균등 격자",
    "reactExport": "GridLayout",
    "english": "GridLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "같은 비중의 항목을 폭에 맞는 격자로 배치 GridLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "cards",
    "layoutTag": "div",
    "purpose": "같은 비중의 항목을 폭에 맞는 격자로 배치",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "masonry-layout",
    "entry": "LAY-07",
    "name": "높이가 다른 격자",
    "reactExport": "MasonryLayout",
    "english": "MasonryLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "높이가 다른 비순차 콘텐츠를 세로 열로 배치 MasonryLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "cards",
    "layoutTag": "div",
    "purpose": "높이가 다른 비순차 콘텐츠를 세로 열로 배치",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "bento-layout",
    "entry": "LAY-08",
    "name": "강약 격자",
    "reactExport": "BentoLayout",
    "english": "BentoLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "첫 항목을 넓게 두고 나머지를 작은 칸에 배치 BentoLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "cards",
    "layoutTag": "div",
    "purpose": "첫 항목을 넓게 두고 나머지를 작은 칸에 배치",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "full-bleed-layout",
    "entry": "LAY-09",
    "name": "너비를 채우는 배치",
    "reactExport": "FullBleedLayout",
    "english": "FullBleedLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "부모 컨테이너의 전체 너비로 미디어를 배치 FullBleedLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "media",
    "layoutTag": "div",
    "purpose": "부모 컨테이너의 전체 너비로 미디어를 배치",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "sticky-sidebar",
    "entry": "LAY-10",
    "name": "고정 보조 영역",
    "reactExport": "StickySidebar",
    "english": "StickySidebar",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "긴 본문 옆의 보조 영역을 스크롤 중 유지 StickySidebar",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "body-aside",
    "layoutTag": "div",
    "purpose": "긴 본문 옆의 보조 영역을 스크롤 중 유지",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "alternating-layout",
    "entry": "LAY-13",
    "name": "교차 배치",
    "reactExport": "AlternatingLayout",
    "english": "AlternatingLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "그림과 설명의 위치를 행마다 바꾸어 배치 AlternatingLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "pairs",
    "layoutTag": "div",
    "purpose": "그림과 설명의 위치를 행마다 바꾸어 배치",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "print-layout",
    "entry": "LAY-14",
    "name": "인쇄 문서",
    "reactExport": "PrintLayout",
    "english": "PrintLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "화면 문서를 인쇄할 때 탐색을 숨기고 페이지를 나누기 PrintLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "print",
    "layoutTag": "article",
    "purpose": "화면 문서를 인쇄할 때 탐색을 숨기고 페이지를 나누기",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "stack-layout",
    "entry": "LAY-16",
    "name": "세로 간격 묶음",
    "reactExport": "StackLayout",
    "english": "StackLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "자식 사이의 일정한 세로 간격 유지 StackLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "cards",
    "layoutTag": "div",
    "purpose": "자식 사이의 일정한 세로 간격 유지",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "cluster-layout",
    "entry": "LAY-18",
    "name": "줄바꿈 묶음",
    "reactExport": "ClusterLayout",
    "english": "ClusterLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "관련 항목을 가로로 두고 남는 폭에 맞추어 줄바꿈 ClusterLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "labels",
    "layoutTag": "div",
    "purpose": "관련 항목을 가로로 두고 남는 폭에 맞추어 줄바꿈",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "switcher-layout",
    "entry": "LAY-19",
    "name": "가로·세로 전환",
    "reactExport": "SwitcherLayout",
    "english": "SwitcherLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "가용 폭이 기준보다 작으면 모든 항목을 한 열로 전환 SwitcherLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "cards",
    "layoutTag": "div",
    "purpose": "가용 폭이 기준보다 작으면 모든 항목을 한 열로 전환",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "reel-layout",
    "entry": "LAY-20",
    "name": "가로 탐색 띠",
    "reactExport": "ReelLayout",
    "english": "ReelLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "연속된 항목을 키보드로도 스크롤할 수 있는 가로 띠에 배치 ReelLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "cards",
    "layoutTag": "div",
    "purpose": "연속된 항목을 키보드로도 스크롤할 수 있는 가로 띠에 배치",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "cover-layout",
    "entry": "LAY-21",
    "name": "중앙 표지",
    "reactExport": "CoverLayout",
    "english": "CoverLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "상하 정보 사이 중앙에 주요 메시지 배치 CoverLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "cover",
    "layoutTag": "section",
    "purpose": "상하 정보 사이 중앙에 주요 메시지 배치",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "frame-layout",
    "entry": "LAY-22",
    "name": "비율 프레임",
    "reactExport": "FrameLayout",
    "english": "FrameLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "콘텐츠 영역의 가로세로 비율 유지 FrameLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "media",
    "layoutTag": "div",
    "purpose": "콘텐츠 영역의 가로세로 비율 유지",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "imposter-layout",
    "entry": "LAY-23",
    "name": "겹침 배치",
    "reactExport": "ImposterLayout",
    "english": "ImposterLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "기준 영역 위 가운데에 보조 콘텐츠 겹치기 ImposterLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "overlay",
    "layoutTag": "div",
    "purpose": "기준 영역 위 가운데에 보조 콘텐츠 겹치기",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "supporting-pane",
    "entry": "LAY-24",
    "name": "보조 작업 배치",
    "reactExport": "SupportingPane",
    "english": "SupportingPane",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "주 작업과 보조 작업을 분리된 영역에 배치 SupportingPane",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "body-aside",
    "layoutTag": "div",
    "purpose": "주 작업과 보조 작업을 분리된 영역에 배치",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "holy-grail-layout",
    "entry": "LAY-28",
    "name": "양쪽 사이드바",
    "reactExport": "HolyGrailLayout",
    "english": "HolyGrailLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "탐색·본문·보조 영역을 세 열로 배치 HolyGrailLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "three",
    "layoutTag": "div",
    "purpose": "탐색·본문·보조 영역을 세 열로 배치",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "three-pane-layout",
    "entry": "LAY-29",
    "name": "목록·상세·보조 배치",
    "reactExport": "ThreePaneLayout",
    "english": "ThreePaneLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "목록과 본문과 추가 정보를 각각 독립된 영역에 배치 ThreePaneLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "three",
    "layoutTag": "div",
    "purpose": "목록과 본문과 추가 정보를 각각 독립된 영역에 배치",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "editor-layout",
    "entry": "LAY-35",
    "name": "도구·작업·속성 배치",
    "reactExport": "EditorLayout",
    "english": "EditorLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "도구와 작업면과 속성을 가진 편집기 뼈대 EditorLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "three",
    "layoutTag": "div",
    "purpose": "도구와 작업면과 속성을 가진 편집기 뼈대",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "letterbox-layout",
    "entry": "LAY-39",
    "name": "고정 비율 무대",
    "reactExport": "LetterboxLayout",
    "english": "LetterboxLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "주어진 공간 안에 비율을 유지한 무대를 가운데 배치 LetterboxLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "media",
    "layoutTag": "div",
    "purpose": "주어진 공간 안에 비율을 유지한 무대를 가운데 배치",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "breakout-layout",
    "entry": "LAY-40",
    "name": "본문 밖 확장",
    "reactExport": "BreakoutLayout",
    "english": "BreakoutLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "본문은 읽기 폭으로 유지하고 별도 미디어는 더 넓게 배치 BreakoutLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "breakout",
    "layoutTag": "article",
    "purpose": "본문은 읽기 폭으로 유지하고 별도 미디어는 더 넓게 배치",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "settings-layout",
    "entry": "LAY-41",
    "name": "설정 화면 배치",
    "reactExport": "SettingsLayout",
    "english": "SettingsLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "설정 목록과 선택한 설정 본문을 분리 SettingsLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "aside-body",
    "layoutTag": "div",
    "purpose": "설정 목록과 선택한 설정 본문을 분리",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "toolbar-spacer",
    "entry": "LAY-44",
    "name": "도구 사이 간격",
    "reactExport": "ToolbarSpacer",
    "english": "ToolbarSpacer",
    "section": "page",
    "layer": "Atom",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "LAY",
      "fit": true
    },
    "keywords": "도구 모음의 양쪽 그룹 사이 남는 공간 차지 ToolbarSpacer",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "spacer",
    "layoutTag": "span",
    "purpose": "도구 모음의 양쪽 그룹 사이 남는 공간 차지",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "scroll-area",
    "entry": "LAY-45",
    "name": "스크롤 영역",
    "reactExport": "ScrollArea",
    "english": "ScrollArea",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "제한된 높이 안에서 키보드로 스크롤하고 스크롤바 꾸미기 ScrollArea",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "long",
    "layoutTag": "div",
    "purpose": "제한된 높이 안에서 키보드로 스크롤하고 스크롤바 꾸미기",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "scroll-fog",
    "entry": "LAY-47",
    "name": "스크롤 가장자리 표시",
    "reactExport": "ScrollFog",
    "english": "ScrollFog",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "스크롤 위치에 따라 위아래 가장자리에서 남은 콘텐츠 표시 ScrollFog",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "long",
    "layoutTag": "div",
    "purpose": "스크롤 위치에 따라 위아래 가장자리에서 남은 콘텐츠 표시",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "generic-header",
    "entry": "LAY-48",
    "name": "서비스 머리글",
    "reactExport": "GenericHeader",
    "english": "GenericHeader",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "서비스명과 주요 탐색을 담는 상단 영역 GenericHeader",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "header",
    "layoutTag": "header",
    "purpose": "서비스명과 주요 탐색을 담는 상단 영역",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "bottom-info-bar",
    "entry": "LAY-50",
    "name": "하단 정보 바",
    "reactExport": "BottomInfoBar",
    "english": "BottomInfoBar",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "본문 스크롤 중 하단에 보조 정보를 유지 BottomInfoBar",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "footer",
    "layoutTag": "aside",
    "purpose": "본문 스크롤 중 하단에 보조 정보를 유지",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "fluid-layout",
    "entry": "LAY-51",
    "name": "유동 열 배치",
    "reactExport": "FluidLayout",
    "english": "FluidLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "넓은 화면에서는 다단으로, 좁아지면 한 열로 전환 FluidLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "cards",
    "layoutTag": "div",
    "purpose": "넓은 화면에서는 다단으로, 좁아지면 한 열로 전환",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "column-drop-layout",
    "entry": "LAY-52",
    "name": "단 떨어뜨리기",
    "reactExport": "ColumnDropLayout",
    "english": "ColumnDropLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "폭이 부족할 때 보조 영역부터 아래로 이동 ColumnDropLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "three",
    "layoutTag": "div",
    "purpose": "폭이 부족할 때 보조 영역부터 아래로 이동",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "layout-shifter",
    "entry": "LAY-53",
    "name": "배치 재구성",
    "reactExport": "LayoutShifter",
    "english": "LayoutShifter",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "화면 폭에 따라 탐색·본문·보조 정보의 배치 변경 LayoutShifter",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "three",
    "layoutTag": "div",
    "purpose": "화면 폭에 따라 탐색·본문·보조 정보의 배치 변경",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "tiny-tweaks-layout",
    "entry": "LAY-54",
    "name": "읽기 폭 미세 조정",
    "reactExport": "TinyTweaksLayout",
    "english": "TinyTweaksLayout",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "화면 폭에 맞춰 한 열의 글자 크기와 여백 조절 TinyTweaksLayout",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "body",
    "layoutTag": "article",
    "purpose": "화면 폭에 맞춰 한 열의 글자 크기와 여백 조절",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "equal-columns",
    "entry": "LAY-58",
    "name": "같은 폭 단",
    "reactExport": "EqualColumns",
    "english": "EqualColumns",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "2~6개의 같은 폭 단을 만들고 좁은 폭에서 축소 EqualColumns",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "cards",
    "layoutTag": "div",
    "purpose": "2~6개의 같은 폭 단을 만들고 좁은 폭에서 축소",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "wide-grid-block",
    "entry": "LAY-59",
    "name": "두 칸 격자",
    "reactExport": "WideGridBlock",
    "english": "WideGridBlock",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "여러 열의 격자에서 첫 콘텐츠가 두 칸을 차지 WideGridBlock",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "cards",
    "layoutTag": "div",
    "purpose": "여러 열의 격자에서 첫 콘텐츠가 두 칸을 차지",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "equal-height-grid",
    "entry": "LAY-60",
    "name": "같은 높이 격자",
    "reactExport": "EqualHeightGrid",
    "english": "EqualHeightGrid",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "모든 격자 행을 가장 긴 콘텐츠 높이에 맞추기 EqualHeightGrid",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "cards",
    "layoutTag": "div",
    "purpose": "모든 격자 행을 가장 긴 콘텐츠 높이에 맞추기",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  },
  {
    "id": "thumbnail-list",
    "entry": "LAY-61",
    "name": "섬네일 목록",
    "reactExport": "ThumbnailList",
    "english": "ThumbnailList",
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "작은 그림과 제목을 연결하고 넓은 화면에서 요약 표시 ThumbnailList",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "thumbnails",
    "layoutTag": "ul",
    "purpose": "작은 그림과 제목을 연결하고 넓은 화면에서 요약 표시",
    "compatibility": "children과 aside·secondary·header·footer 슬롯에 실제 콘텐츠를 넣습니다. HTML 슬롯은 신뢰할 수 있는 마크업만 사용합니다. DOM 순서를 읽기 순서와 일치시키세요.",
    "inputs": [
      "children",
      "aside",
      "secondary",
      "header",
      "footer",
      "label",
      "columns"
    ],
    "events": [],
    "css": [
      "layout-base",
      "layout-patterns"
    ],
    "minInlineSize": 160
  }
];
  layoutItems.push(...[
  {
    "id": "list-detail-layout",
    "entry": "LAY-04",
    "name": "목록과 상세",
    "reactExport": "ListDetailLayout",
    "english": "ListDetailLayout",
    "purpose": "목록에서 항목을 선택하고 대응하는 상세 내용 열기",
    "deps": [
      "tabs",
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "interactive",
    "layoutTag": "div",
    "behavior": true,
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "ListDetailLayout 목록에서 항목을 선택하고 대응하는 상세 내용 열기",
    "compatibility": "React는 children과 콜백으로 연결하고 HTML은 data 속성과 pattove 이벤트를 사용합니다. 호스트 작업의 완료 상태는 서비스 응답으로 판단하세요.",
    "inputs": [
      "children",
      "items",
      "title",
      "aside",
      "onChange"
    ],
    "events": [
      "pattove:layoutchange"
    ],
    "css": [
      "layout-base",
      "layout-patterns",
      "layout-interactive"
    ],
    "minInlineSize": 240
  },
  {
    "id": "resizable-panels",
    "entry": "LAY-11",
    "name": "크기 조절 패널",
    "reactExport": "ResizablePanels",
    "english": "ResizablePanels",
    "purpose": "경계선을 끌거나 방향키로 두 작업 영역의 크기 조절",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "interactive",
    "layoutTag": "div",
    "behavior": true,
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "ResizablePanels 경계선을 끌거나 방향키로 두 작업 영역의 크기 조절",
    "compatibility": "React는 children과 콜백으로 연결하고 HTML은 data 속성과 pattove 이벤트를 사용합니다. 호스트 작업의 완료 상태는 서비스 응답으로 판단하세요.",
    "inputs": [
      "children",
      "items",
      "title",
      "aside",
      "onChange"
    ],
    "events": [
      "pattove:layoutchange"
    ],
    "css": [
      "layout-base",
      "layout-patterns",
      "layout-interactive"
    ],
    "minInlineSize": 240
  },
  {
    "id": "focus-layout",
    "entry": "LAY-25",
    "name": "집중 작업 모드",
    "reactExport": "FocusLayout",
    "english": "FocusLayout",
    "purpose": "보조 영역을 숨겼다가 입력 상태를 유지하며 복귀",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "interactive",
    "layoutTag": "div",
    "behavior": true,
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "FocusLayout 보조 영역을 숨겼다가 입력 상태를 유지하며 복귀",
    "compatibility": "React는 children과 콜백으로 연결하고 HTML은 data 속성과 pattove 이벤트를 사용합니다. 호스트 작업의 완료 상태는 서비스 응답으로 판단하세요.",
    "inputs": [
      "children",
      "items",
      "title",
      "aside",
      "onChange"
    ],
    "events": [
      "pattove:layoutchange"
    ],
    "css": [
      "layout-base",
      "layout-patterns",
      "layout-interactive"
    ],
    "minInlineSize": 240
  },
  {
    "id": "object-hub",
    "entry": "LAY-26",
    "name": "객체 상세 허브",
    "reactExport": "ObjectHub",
    "english": "ObjectHub",
    "purpose": "대상 요약과 관련 자료·활동을 탭으로 연결",
    "deps": [
      "tabs",
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "interactive",
    "layoutTag": "div",
    "behavior": true,
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "ObjectHub 대상 요약과 관련 자료·활동을 탭으로 연결",
    "compatibility": "React는 children과 콜백으로 연결하고 HTML은 data 속성과 pattove 이벤트를 사용합니다. 호스트 작업의 완료 상태는 서비스 응답으로 판단하세요.",
    "inputs": [
      "children",
      "items",
      "title",
      "aside",
      "onChange"
    ],
    "events": [
      "pattove:layoutchange"
    ],
    "css": [
      "layout-base",
      "layout-patterns",
      "layout-interactive"
    ],
    "minInlineSize": 240
  },
  {
    "id": "shrinking-header",
    "entry": "LAY-30",
    "name": "축소되는 고정 헤더",
    "reactExport": "ShrinkingHeader",
    "english": "ShrinkingHeader",
    "purpose": "스크롤하면 머리글을 축소하고 상단에서 원래 크기로 복원",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "interactive",
    "layoutTag": "div",
    "behavior": true,
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "ShrinkingHeader 스크롤하면 머리글을 축소하고 상단에서 원래 크기로 복원",
    "compatibility": "React는 children과 콜백으로 연결하고 HTML은 data 속성과 pattove 이벤트를 사용합니다. 호스트 작업의 완료 상태는 서비스 응답으로 판단하세요.",
    "inputs": [
      "children",
      "items",
      "title",
      "aside",
      "onChange"
    ],
    "events": [
      "pattove:layoutchange"
    ],
    "css": [
      "layout-base",
      "layout-patterns",
      "layout-interactive"
    ],
    "minInlineSize": 240
  },
  {
    "id": "sticky-action-layout",
    "entry": "LAY-31",
    "name": "고정 행동 바",
    "reactExport": "StickyActionLayout",
    "english": "StickyActionLayout",
    "purpose": "긴 콘텐츠 아래에 주 행동을 유지",
    "deps": [
      "button",
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "interactive",
    "layoutTag": "div",
    "behavior": true,
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "StickyActionLayout 긴 콘텐츠 아래에 주 행동을 유지",
    "compatibility": "React는 children과 콜백으로 연결하고 HTML은 data 속성과 pattove 이벤트를 사용합니다. 호스트 작업의 완료 상태는 서비스 응답으로 판단하세요.",
    "inputs": [
      "children",
      "items",
      "title",
      "aside",
      "onChange"
    ],
    "events": [
      "pattove:layoutchange"
    ],
    "css": [
      "layout-base",
      "layout-patterns",
      "layout-interactive"
    ],
    "minInlineSize": 240
  },
  {
    "id": "snap-sections",
    "entry": "LAY-32",
    "name": "장면 단위 스크롤",
    "reactExport": "SnapSections",
    "english": "SnapSections",
    "purpose": "가로 장면마다 스크롤 위치를 맞추어 순서대로 탐색",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "interactive",
    "layoutTag": "div",
    "behavior": true,
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "SnapSections 가로 장면마다 스크롤 위치를 맞추어 순서대로 탐색",
    "compatibility": "React는 children과 콜백으로 연결하고 HTML은 data 속성과 pattove 이벤트를 사용합니다. 호스트 작업의 완료 상태는 서비스 응답으로 판단하세요.",
    "inputs": [
      "children",
      "items",
      "title",
      "aside",
      "onChange"
    ],
    "events": [
      "pattove:layoutchange"
    ],
    "css": [
      "layout-base",
      "layout-patterns",
      "layout-interactive"
    ],
    "minInlineSize": 240
  },
  {
    "id": "collapsible-sidebar",
    "entry": "LAY-33",
    "name": "접히는 탐색 레일",
    "reactExport": "CollapsibleSidebar",
    "english": "CollapsibleSidebar",
    "purpose": "탐색을 아이콘 열로 축소하고 이름을 유지",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "interactive",
    "layoutTag": "div",
    "behavior": true,
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "CollapsibleSidebar 탐색을 아이콘 열로 축소하고 이름을 유지",
    "compatibility": "React는 children과 콜백으로 연결하고 HTML은 data 속성과 pattove 이벤트를 사용합니다. 호스트 작업의 완료 상태는 서비스 응답으로 판단하세요.",
    "inputs": [
      "children",
      "items",
      "title",
      "aside",
      "onChange"
    ],
    "events": [
      "pattove:layoutchange"
    ],
    "css": [
      "layout-base",
      "layout-patterns",
      "layout-interactive"
    ],
    "minInlineSize": 240
  },
  {
    "id": "document-workspace",
    "entry": "LAY-34",
    "name": "문서 탭 작업 공간",
    "reactExport": "DocumentWorkspace",
    "english": "DocumentWorkspace",
    "purpose": "열린 문서를 키보드와 탭으로 전환",
    "deps": [
      "tabs",
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "interactive",
    "layoutTag": "div",
    "behavior": true,
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "DocumentWorkspace 열린 문서를 키보드와 탭으로 전환",
    "compatibility": "React는 children과 콜백으로 연결하고 HTML은 data 속성과 pattove 이벤트를 사용합니다. 호스트 작업의 완료 상태는 서비스 응답으로 판단하세요.",
    "inputs": [
      "children",
      "items",
      "title",
      "aside",
      "onChange"
    ],
    "events": [
      "pattove:layoutchange"
    ],
    "css": [
      "layout-base",
      "layout-patterns",
      "layout-interactive"
    ],
    "minInlineSize": 240
  },
  {
    "id": "stacked-panels",
    "entry": "LAY-38",
    "name": "쌓이는 상세 패널",
    "reactExport": "StackedPanels",
    "english": "StackedPanels",
    "purpose": "하위 상세로 들어가고 이전 상세와 초점으로 복귀",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint",
      "token-motion"
    ],
    "layoutMode": "interactive",
    "layoutTag": "div",
    "behavior": true,
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "StackedPanels 하위 상세로 들어가고 이전 상세와 초점으로 복귀",
    "compatibility": "React는 children과 콜백으로 연결하고 HTML은 data 속성과 pattove 이벤트를 사용합니다. 호스트 작업의 완료 상태는 서비스 응답으로 판단하세요.",
    "inputs": [
      "children",
      "items",
      "title",
      "aside",
      "onChange"
    ],
    "events": [
      "pattove:layoutchange"
    ],
    "css": [
      "layout-base",
      "layout-patterns",
      "layout-interactive",
      "stacked-panels"
    ],
    "minInlineSize": 240
  },
  {
    "id": "profile-tabs",
    "entry": "LAY-42",
    "name": "프로필과 탭 본문",
    "reactExport": "ProfileTabs",
    "english": "ProfileTabs",
    "purpose": "대상의 소개와 활동을 탭으로 나누어 탐색",
    "deps": [
      "tabs",
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "interactive",
    "layoutTag": "div",
    "behavior": true,
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "ProfileTabs 대상의 소개와 활동을 탭으로 나누어 탐색",
    "compatibility": "React는 children과 콜백으로 연결하고 HTML은 data 속성과 pattove 이벤트를 사용합니다. 호스트 작업의 완료 상태는 서비스 응답으로 판단하세요.",
    "inputs": [
      "children",
      "items",
      "title",
      "aside",
      "onChange"
    ],
    "events": [
      "pattove:layoutchange"
    ],
    "css": [
      "layout-base",
      "layout-patterns",
      "layout-interactive"
    ],
    "minInlineSize": 240
  },
  {
    "id": "window-splitter",
    "entry": "LAY-43",
    "name": "창 분할 경계선",
    "reactExport": "WindowSplitter",
    "english": "WindowSplitter",
    "purpose": "이동 가능한 경계선으로 창의 두 영역 비율 조절",
    "deps": [
      "resizable-panels",
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "interactive",
    "layoutTag": "div",
    "behavior": true,
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "WindowSplitter 이동 가능한 경계선으로 창의 두 영역 비율 조절",
    "compatibility": "React는 children과 콜백으로 연결하고 HTML은 data 속성과 pattove 이벤트를 사용합니다. 호스트 작업의 완료 상태는 서비스 응답으로 판단하세요.",
    "inputs": [
      "children",
      "items",
      "title",
      "aside",
      "onChange"
    ],
    "events": [
      "pattove:layoutchange"
    ],
    "css": [
      "layout-base",
      "layout-patterns",
      "layout-interactive"
    ],
    "minInlineSize": 240
  },
  {
    "id": "floating-panel",
    "entry": "LAY-46",
    "name": "플로팅 패널",
    "reactExport": "FloatingPanel",
    "english": "FloatingPanel",
    "purpose": "포인터와 키보드로 부모 영역 안에서 작업 창 이동",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "interactive",
    "layoutTag": "div",
    "behavior": true,
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "FloatingPanel 포인터와 키보드로 부모 영역 안에서 작업 창 이동",
    "compatibility": "React는 children과 콜백으로 연결하고 HTML은 data 속성과 pattove 이벤트를 사용합니다. 호스트 작업의 완료 상태는 서비스 응답으로 판단하세요.",
    "inputs": [
      "children",
      "items",
      "title",
      "aside",
      "onChange"
    ],
    "events": [
      "pattove:layoutchange"
    ],
    "css": [
      "layout-base",
      "layout-patterns",
      "layout-interactive"
    ],
    "minInlineSize": 240
  },
  {
    "id": "off-canvas-layout",
    "entry": "LAY-55",
    "name": "화면 밖 서랍",
    "reactExport": "OffCanvasLayout",
    "english": "OffCanvasLayout",
    "purpose": "보조 영역을 모달 서랍으로 열고 닫기",
    "deps": [
      "drawer",
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "interactive",
    "layoutTag": "div",
    "behavior": true,
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "OffCanvasLayout 보조 영역을 모달 서랍으로 열고 닫기",
    "compatibility": "React는 children과 콜백으로 연결하고 HTML은 data 속성과 pattove 이벤트를 사용합니다. 호스트 작업의 완료 상태는 서비스 응답으로 판단하세요.",
    "inputs": [
      "children",
      "items",
      "title",
      "aside",
      "onChange"
    ],
    "events": [
      "pattove:layoutchange"
    ],
    "css": [
      "layout-base",
      "layout-patterns",
      "layout-interactive"
    ],
    "minInlineSize": 240
  },
  {
    "id": "append-around",
    "entry": "LAY-57",
    "name": "폭에 따른 자리 이동",
    "reactExport": "AppendAround",
    "english": "AppendAround",
    "purpose": "동일한 콘텐츠를 화면 폭에 맞는 자리로 이동하며 입력 유지",
    "deps": [
      "token-color",
      "token-text",
      "token-space",
      "token-radius",
      "token-border",
      "token-size",
      "token-container",
      "token-aspect",
      "token-breakpoint"
    ],
    "layoutMode": "interactive",
    "layoutTag": "div",
    "behavior": true,
    "section": "page",
    "layer": "Template",
    "browse": {
      "shelf": "template",
      "kind": "템플릿",
      "code": "LAY",
      "fit": true
    },
    "keywords": "AppendAround 동일한 콘텐츠를 화면 폭에 맞는 자리로 이동하며 입력 유지",
    "compatibility": "React는 children과 콜백으로 연결하고 HTML은 data 속성과 pattove 이벤트를 사용합니다. 호스트 작업의 완료 상태는 서비스 응답으로 판단하세요.",
    "inputs": [
      "children",
      "items",
      "title",
      "aside",
      "onChange"
    ],
    "events": [
      "pattove:layoutchange"
    ],
    "css": [
      "layout-base",
      "layout-patterns",
      "layout-interactive"
    ],
    "minInlineSize": 240
  }
]);
  items.find(i=>i.id==='divider').entry='LAY-17';
  for(const item of layoutItems){
    contracts[item.id]=[item.purpose,item.compatibility,item.inputs,item.events];
    items.push({...item,version,lifecycle:'Trial',environments:['HTML','React'],behavior:!!item.behavior});
  }
  const navigationItems = [
  {
    "id": "site-header",
    "entry": "NAV-01",
    "name": "헤더와 주 탐색",
    "english": "SiteHeader",
    "reactExport": "SiteHeader",
    "purpose": "사이트 정체성과 주요 경로 제공",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "site-header",
    "keywords": "GNB (Global Navigation Bar) 사이트 정체성과 주요 경로 제공",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "mega-menu",
    "entry": "NAV-02",
    "name": "메가 메뉴",
    "english": "MegaMenu",
    "reactExport": "MegaMenu",
    "purpose": "많은 경로를 범주별로 탐색",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "mega-menu",
    "keywords": "메가 메뉴 (Mega Menu) 많은 경로를 범주별로 탐색",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "hamburger-menu",
    "entry": "NAV-03",
    "name": "접히는 탐색 메뉴",
    "english": "HamburgerMenu",
    "reactExport": "HamburgerMenu",
    "purpose": "좁은 공간에서 탐색을 열기",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "hamburger-menu",
    "keywords": "햄버거 메뉴 (Hamburger Menu) 좁은 공간에서 탐색을 열기",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "table-of-contents",
    "entry": "NAV-09",
    "name": "목차·앵커 탐색",
    "english": "TableOfContents",
    "reactExport": "TableOfContents",
    "purpose": "긴 페이지의 필요한 구간으로 이동",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "table-of-contents",
    "keywords": "목차 (Table of Contents) 긴 페이지의 필요한 구간으로 이동",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "site-footer",
    "entry": "NAV-13",
    "name": "푸터 탐색",
    "english": "SiteFooter",
    "reactExport": "SiteFooter",
    "purpose": "보조 경로와 운영 정보 제공",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "site-footer",
    "keywords": "푸터 (Footer) 보조 경로와 운영 정보 제공",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "skip-link",
    "entry": "NAV-14",
    "name": "본문 바로 가기",
    "english": "SkipLink",
    "reactExport": "SkipLink",
    "purpose": "반복 탐색 영역 건너뛰기",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "skip-link",
    "keywords": "스킵 링크 (Skip Link) 반복 탐색 영역 건너뛰기",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "back-to-top",
    "entry": "NAV-15",
    "name": "맨 위로 이동",
    "english": "BackToTop",
    "reactExport": "BackToTop",
    "purpose": "긴 페이지의 시작으로 복귀",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "back-to-top",
    "keywords": "맨 위로 버튼 (Back to Top) 긴 페이지의 시작으로 복귀",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "app-switcher",
    "entry": "NAV-17",
    "name": "앱 전환 런처",
    "english": "AppSwitcher",
    "reactExport": "AppSwitcher",
    "purpose": "연결된 여러 제품 사이 이동",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "app-switcher",
    "keywords": "앱 스위처 (App Switcher) 연결된 여러 제품 사이 이동",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "site-map",
    "entry": "NAV-23",
    "name": "사이트 전체 지도 페이지",
    "english": "SiteMap",
    "reactExport": "SiteMap",
    "purpose": "모든 페이지를 한 곳에 계층으로 나열",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "site-map",
    "keywords": "사이트맵 (Sitemap) 모든 페이지를 한 곳에 계층으로 나열",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "navigation-rail",
    "entry": "NAV-28",
    "name": "탐색 레일",
    "english": "NavigationRail",
    "reactExport": "NavigationRail",
    "purpose": "태블릿 폭에서 세로로 세운 아이콘 탐색",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "navigation-rail",
    "keywords": "내비게이션 레일 (Navigation Rail) 태블릿 폭에서 세로로 세운 아이콘 탐색",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "page-header",
    "entry": "NAV-29",
    "name": "페이지 제목 영역",
    "english": "PageHeader",
    "reactExport": "PageHeader",
    "purpose": "제목·설명·주 행동·경로를 묶은 상단",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "page-header",
    "keywords": "페이지 헤더 (Page Header) 제목·설명·주 행동·경로를 묶은 상단",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "tag-cloud",
    "entry": "NAV-30",
    "name": "태그·주제 구름 탐색",
    "english": "TagCloud",
    "reactExport": "TagCloud",
    "purpose": "주제 목록을 크기·빈도로 보여 주고 이동",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "tag-cloud",
    "keywords": "태그 클라우드 (Tag Cloud) 주제 목록을 크기·빈도로 보여 주고 이동",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "alphabet-index",
    "entry": "NAV-31",
    "name": "가나다·알파벳 색인 점프",
    "english": "AlphabetIndex",
    "reactExport": "AlphabetIndex",
    "purpose": "긴 목록 옆 글자 색인으로 바로 이동",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "alphabet-index",
    "keywords": "인덱스 스크롤 (Alphabet Index Bar) 긴 목록 옆 글자 색인으로 바로 이동",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "navigation-progress",
    "entry": "NAV-32",
    "name": "페이지 전환 진행 띠",
    "english": "NavigationProgress",
    "reactExport": "NavigationProgress",
    "purpose": "상단 얇은 띠로 다음 화면 불러오는 중 표시",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "navigation-progress",
    "keywords": "상단 로딩 바 (Top Progress Bar) 상단 얇은 띠로 다음 화면 불러오는 중 표시",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "utility-header",
    "entry": "NAV-33",
    "name": "유틸리티 바와 주 탐색의 2단 헤더",
    "english": "UtilityHeader",
    "reactExport": "UtilityHeader",
    "purpose": "언어·로그인 같은 보조 링크 줄을 위에 따로",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "utility-header",
    "keywords": "유틸리티 바 (Utility Bar) 언어·로그인 같은 보조 링크 줄을 위에 따로",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "step-list",
    "entry": "NAV-35",
    "name": "단계 목록",
    "english": "StepList",
    "reactExport": "StepList",
    "purpose": "여러 단계 중 지금 어디인지 줄지어 보여주는 표시",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "step-list",
    "keywords": "스텝 리스트 (Step List) 여러 단계 중 지금 어디인지 줄지어 보여주는 표시",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "service-navigation",
    "entry": "NAV-37",
    "name": "서비스 전용 상단 메뉴 바",
    "english": "ServiceNavigation",
    "reactExport": "ServiceNavigation",
    "purpose": "서비스명 옆에 붙는 해당 서비스 전용 상단 메뉴 바",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "service-navigation",
    "keywords": "서비스 내비게이션 (Service Navigation) 서비스명 옆에 붙는 해당 서비스 전용 상단 메뉴 바",
    "behavior": true,
    "deps": [
      "site-header",
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "in-page-navigation",
    "entry": "NAV-38",
    "name": "페이지 내 목차 이동",
    "english": "InPageNavigation",
    "reactExport": "InPageNavigation",
    "purpose": "긴 글 옆에 붙어 클릭하면 해당 섹션으로 이동하는 목차",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "in-page-navigation",
    "keywords": "페이지 내 내비게이션 (In-Page Navigation) 긴 글 옆에 붙어 클릭하면 해당 섹션으로 이동하는 목차",
    "behavior": true,
    "deps": [
      "table-of-contents",
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "horizontal-menu",
    "entry": "NAV-40",
    "name": "수평 메뉴",
    "english": "HorizontalMenu",
    "reactExport": "HorizontalMenu",
    "purpose": "가로로 나열한 상단 메뉴 항목 묶음",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "horizontal-menu",
    "keywords": "가로 메뉴 (Horizontal Menu) 가로로 나열한 상단 메뉴 항목 묶음",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "page-counter",
    "entry": "NAV-41",
    "name": "페이지 카운터",
    "english": "PageCounter",
    "reactExport": "PageCounter",
    "purpose": "여러 페이지 중 현재·전체 쪽수를 숫자로 표시",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "page-counter",
    "keywords": "페이지 카운터 (Page Counter) 여러 페이지 중 현재·전체 쪽수를 숫자로 표시",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "navigation-drawer",
    "entry": "NAV-42",
    "name": "사이드 드로어",
    "english": "NavigationDrawer",
    "reactExport": "NavigationDrawer",
    "purpose": "화면 옆에서 밀려 나오는 전체 높이 메뉴 패널",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "navigation-drawer",
    "keywords": "사이드 드로어 (Navigation Drawer) 화면 옆에서 밀려 나오는 전체 높이 메뉴 패널",
    "behavior": true,
    "deps": [
      "drawer",
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "journey-navigation",
    "entry": "NAV-43",
    "name": "여정 전체 단계 목차",
    "english": "JourneyNavigation",
    "reactExport": "JourneyNavigation",
    "purpose": "여러 화면·서비스에 흩어진 절차 전체를 하나의 목차 지도로 묶어 지금 몇 단계인지 보여줌",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "journey-navigation",
    "keywords": "단계별 내비게이션 (Step by Step Navigation) 여러 화면·서비스에 흩어진 절차 전체를 하나의 목차 지도로 묶어 지금 몇 단계인지 보여줌",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "select-navigation",
    "entry": "NAV-44",
    "name": "선택 상자로 바꾼 탐색",
    "english": "SelectNavigation",
    "reactExport": "SelectNavigation",
    "purpose": "좁은 화면에서 메뉴를 선택 상자 하나로 접어 기기 기본 선택기를 쓰게 하기",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "select-navigation",
    "keywords": "셀렉트 내비게이션 (Select Menu Navigation) 좁은 화면에서 메뉴를 선택 상자 하나로 접어 기기 기본 선택기를 쓰게 하기",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "fullscreen-navigation",
    "entry": "NAV-45",
    "name": "화면 전체를 덮는 탐색",
    "english": "FullscreenNavigation",
    "reactExport": "FullscreenNavigation",
    "purpose": "메뉴를 열면 화면 전체를 덮어 목록만 보이게 하기",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "fullscreen-navigation",
    "keywords": "풀스크린 메뉴 (Fullscreen Overlay Menu) 메뉴를 열면 화면 전체를 덮어 목록만 보이게 하기",
    "behavior": true,
    "deps": [
      "drawer",
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "overflow-navigation",
    "entry": "NAV-46",
    "name": "가로로 넘치는 탐색 띠",
    "english": "OverflowNavigation",
    "reactExport": "OverflowNavigation",
    "purpose": "메뉴를 한 줄로 두고 넘치는 항목은 옆으로 밀어 보게 하기",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "overflow-navigation",
    "keywords": "가로 스크롤 내비게이션 (Horizontal Scroll Nav) 메뉴를 한 줄로 두고 넘치는 항목은 옆으로 밀어 보게 하기",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "direct-subnav",
    "entry": "NAV-47",
    "name": "상위 메뉴를 건너뛰는 하위 탐색",
    "english": "DirectSubnav",
    "reactExport": "DirectSubnav",
    "purpose": "상위 항목을 누르면 목록을 펴지 않고 바로 하위 화면으로 넘기기",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "direct-subnav",
    "keywords": "서브내비 건너뛰기 (Skip the Subnav) 상위 항목을 누르면 목록을 펴지 않고 바로 하위 화면으로 넘기기",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "multi-toggle-navigation",
    "entry": "NAV-49",
    "name": "상위 링크를 함께 두는 다단 토글",
    "english": "MultiToggleNavigation",
    "reactExport": "MultiToggleNavigation",
    "purpose": "하위 목록을 펼치면서 상위 항목 자체로 가는 링크도 같이 남겨 두기",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "multi-toggle-navigation",
    "keywords": "멀티 토글 메뉴 (Multi-Toggle Menu) 하위 목록을 펼치면서 상위 항목 자체로 가는 링크도 같이 남겨 두기",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "compact-breadcrumb",
    "entry": "NAV-51",
    "name": "마지막 단계만 보이는 경로",
    "english": "CompactBreadcrumb",
    "reactExport": "CompactBreadcrumb",
    "purpose": "좁은 화면에서 현재 위치 경로 중 바로 위 한 단계만 남기기",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "compact-breadcrumb",
    "keywords": "축약 브레드크럼 (Truncated Breadcrumb) 좁은 화면에서 현재 위치 경로 중 바로 위 한 단계만 남기기",
    "behavior": true,
    "deps": [
      "breadcrumb",
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "breadcrumb-dropdown",
    "entry": "NAV-52",
    "name": "경로를 접어 넣은 드롭다운",
    "english": "BreadcrumbDropdown",
    "reactExport": "BreadcrumbDropdown",
    "purpose": "긴 경로를 버튼 하나로 접고 눌렀을 때 전체 단계를 펴 보이기",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "breadcrumb-dropdown",
    "keywords": "브레드크럼 드롭다운 (Breadcrumb Dropdown) 긴 경로를 버튼 하나로 접고 눌렀을 때 전체 단계를 펴 보이기",
    "behavior": true,
    "deps": [
      "breadcrumb",
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "breadcrumb-back",
    "entry": "NAV-53",
    "name": "경로를 뒤로 버튼으로 바꾸기",
    "english": "BreadcrumbBack",
    "reactExport": "BreadcrumbBack",
    "purpose": "좁은 화면에서 경로 전체 대신 바로 위로 가는 버튼 하나만 두기",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "breadcrumb-back",
    "keywords": "뒤로 가기 링크 (Back Link) 좁은 화면에서 경로 전체 대신 바로 위로 가는 버튼 하나만 두기",
    "behavior": true,
    "deps": [
      "breadcrumb",
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "responsive-pagination",
    "entry": "NAV-54",
    "name": "번호 대신 이전·다음으로 바꾸기",
    "english": "ResponsivePagination",
    "reactExport": "ResponsivePagination",
    "purpose": "좁은 화면에서 페이지 번호를 접고 이전·다음 두 버튼만 남기기",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "responsive-pagination",
    "keywords": "이전·다음 페이지네이션 (Prev/Next Pagination) 좁은 화면에서 페이지 번호를 접고 이전·다음 두 버튼만 남기기",
    "behavior": true,
    "deps": [
      "button",
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "conditional-pagination",
    "entry": "NAV-55",
    "name": "필요할 때만 펴는 페이지 번호",
    "english": "ConditionalPagination",
    "reactExport": "ConditionalPagination",
    "purpose": "평소에는 번호를 접어 두고 누르면 전체 번호를 펴 보이기",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "conditional-pagination",
    "keywords": "접이식 페이지네이션 (Collapsed Pagination) 평소에는 번호를 접어 두고 누르면 전체 번호를 펴 보이기",
    "behavior": true,
    "deps": [
      "responsive-pagination",
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  },
  {
    "id": "footer-anchor",
    "entry": "NAV-56",
    "name": "푸터로 보내는 탐색 링크",
    "english": "FooterAnchor",
    "reactExport": "FooterAnchor",
    "purpose": "상단 메뉴 버튼을 눌러 화면 아래 탐색 영역으로 이동시키기",
    "section": "navigation",
    "layer": "Molecule",
    "browse": {
      "shelf": "part",
      "kind": "부품",
      "code": "NAV",
      "fit": true
    },
    "navigationMode": "footer-anchor",
    "keywords": "푸터 앵커 내비게이션 (Footer Anchor) 상단 메뉴 버튼을 눌러 화면 아래 탐색 영역으로 이동시키기",
    "behavior": true,
    "deps": [
      "token-color",
      "token-text",
      "token-weight",
      "token-space",
      "token-size",
      "token-container",
      "token-radius",
      "token-border",
      "token-breakpoint"
    ],
    "css": [
      "navigation-parts"
    ],
    "compatibility": "링크는 실제 목적지로 연결합니다. 탐색을 가리는 요소가 있으면 대상의 scroll-margin을 조절하세요. 링크 탐색에 애플리케이션 메뉴 역할을 부여하지 않습니다.",
    "inputs": [
      "items",
      "title",
      "label",
      "current",
      "children"
    ],
    "events": [
      "pattove:navigate"
    ],
    "minInlineSize": 160
  }
];
  items.find(i=>i.id==='side-nav').entry='NAV-04';
  for(const item of navigationItems){contracts[item.id]=[item.purpose,item.compatibility,item.inputs,item.events];items.push({...item,version,lifecycle:'Trial',environments:['HTML','React']});}
  // Shared CSS blocks: a part's own block plus the helper blocks it is drawn with.
  const cssBlocks = {
    checkbox: ['selection'], radio: ['selection'], switch: ['selection'],
    'clear-input': ['input-group','clear-input'], 'unit-input': ['input-group','unit-input'], stepper: ['input-group','stepper'], 'password-input': ['input-group','password-input'], 'date-range': ['input-group','date-range'],
    'check-card': ['choice-card'], 'radio-card': ['choice-card'],
    'check-list': ['choice-list'], 'radio-list': ['choice-list'], 'switch-list': ['choice-list'],
    'list-card': ['card-media','list-card'], 'media-card': ['card-media'],
    'result-grid': ['results'], 'result-list': ['results','result-list'], 'featured-results': ['results','featured-results'], 'people-picker': ['results','people-picker'],
    'confirm-row': ['confirm-row'], 'action-row': ['action-row'], 'icon-button': ['icon-button']
  };
  // Minimum inline size (px) at which a part still reads; wide blocks need more room than a single control.
  const minInline = { 'data-table':280, 'record-editor':240, 'admin-shell':280, 'admin-page':280, 'bottom-nav': 224, template: 240, page: 240, card: 200, 'list-card': 240, 'media-card': 200, input: 160, field: 160, 'date-range': 200, 'search-bar': 288, tabs: 240, 'search-form': 240, 'result-grid': 240, 'result-list': 240, 'featured-results': 240, 'people-picker': 240, 'action-row': 240, 'action-bar': 240, 'inline-form': 240, 'check-list': 200, 'radio-list': 200, 'switch-list': 200, 'select-all-list': 200, 'stat-row': 240, toast: 224, notice: 200, 'progress-bar': 200, 'step-bar': 200 };
  for (const item of items) {
    const [purpose, compatibility, inputs, events] = contracts[item.id];
    Object.assign(item, { purpose, compatibility, inputs, events, controls: controls[item.id] || [], gallery: galleries[item.id] || null,
      css: item.css || cssBlocks[item.id] || (item.id === 'page' ? ['page'] : [item.id]),
      source: 'src/system/parts.js', reactSource: item.layer === 'Token' ? null : 'src/system/react/'+item.id+'.jsx', styles: window.Pattove.catalog.styles.filter(s => s.id !== 'base').map(s => s.id),
      minInlineSize: item.minInlineSize || minInline[item.id] || 160,
      support: { html: 'implemented', react: 'implemented', native: 'not-implemented', print: 'not-verified' },
      verification: { suite: 'tests/system-audit.cjs', evidence: 'test-results/system-audit/results.json' }
    });
  }
  for (const id of ['data-table','record-editor','admin-shell','admin-page']) {
    const item = items.find(i => i.id === id);
    item.source = 'src/system/admin.js';
    item.verification = { suite:'tests/admin.cjs', evidence:'test-results/admin/results.json' };
    item.provenance = { repository:'https://github.com/satnaing/shadcn-admin', commit:'e16c87f213a5ba5e45964e9b67c792105ec74d26', license:'MIT', relationship:id === 'data-table' ? 'adapted' : 'reference', record:'src/system/upstream/shadcn-admin/provenance.json' };
  }
  items.find(i => i.id === 'data-table').publicParts = [{name:'TableToolbar', source:'src/system/react/table-toolbar.jsx', requires:'TanStack table instance'}, {name:'TablePagination', source:'src/system/react/table-pagination.jsx', requires:'TanStack table instance'}];
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
  const patterns = [{ id: 'search-filter-results', name: '검색·필터·결과', layer: 'Pattern', items: ['search-form', 'filter-chip-row', 'result-grid', 'result-list', 'empty-state', 'template', 'page'], rules: ['입력 필드와 상태 필터 뒤에 검색 동작을 둡니다.', '결과 개수는 바뀔 때마다 알리고, 결과가 없으면 전체 보기로 복구합니다.', '제목이 길어져도 카드의 행동은 같은 위치에 둡니다.'] }];
  patterns.push({ id:'admin-edit-save', name:'관리 목록·편집·저장·복구', layer:'Pattern', items:['admin-shell','data-table','record-editor','admin-page'], rules:['검색과 필터를 바꾸면 첫 쪽으로 돌아갑니다.','저장이 실패하면 입력을 유지하고 다시 시도합니다.','저장 결과가 확인된 뒤 목록을 갱신하고 원래 위치로 초점을 돌립니다.'] });
  patterns.push(...[{"id":"settings-form","name":"프로필 설정","layer":"Pattern","items":["settings-form","field","textarea","select","switch","button"],"rules":["프로필을 수정하고 저장 실패 후 재시도","실제 콘텐츠와 실패·복구 상태를 확인합니다."]},{"id":"login-form","name":"로그인","layer":"Pattern","items":["login-form","field","button","settings-form"],"rules":["인증 서비스에 연결하는 로그인 폼","실제 콘텐츠와 실패·복구 상태를 확인합니다."]},{"id":"input-result","name":"입력과 계산 결과","layer":"Pattern","items":["input-result","field","button","settings-form"],"rules":["입력값을 검증하고 계산 결과 표시","실제 콘텐츠와 실패·복구 상태를 확인합니다."]},{"id":"comparison","name":"비교와 선택","layer":"Pattern","items":["comparison","button"],"rules":["대상의 차이를 비교한 뒤 하나 선택","실제 콘텐츠와 실패·복구 상태를 확인합니다."]},{"id":"article-page","name":"본문과 목차","layer":"Pattern","items":["article-page"],"rules":["목차에서 긴 본문으로 이동해 읽기","실제 콘텐츠와 실패·복구 상태를 확인합니다."]}]);
  window.Pattove.systemRegistry = { sections, items, index, matching, dependencies, patterns, normalizeOptions, version };
})();
