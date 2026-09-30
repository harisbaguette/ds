/* Representative implementations for validating the system structure, not the full dictionary. */
(() => {
  const version = '0.6.0';
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
    part('icon', '아이콘', 'primitives', 'Primitive', 'ICO', '검색 닫기 화살표 svg icon', []),
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
    part('badge', '배지', 'feedback', 'Atom', 'STA', 'badge status 상태 태그 연한 면 아이콘', ['icon', ...T('color','text','weight','leading','space','size','radius','border','stroke')], { entry: 'STA-01' }),
    part('count-badge', '카운터 배지', 'feedback', 'Atom', 'NAV', '개수 숫자 알림 배지 count badge', ['icon', ...T('color','text','weight','leading','space','size','radius','border')], { entry: 'NAV-25' }),
    part('tabs', '탭', 'navigation', 'Molecule', 'NAV', 'tabs 메뉴 전환 탐색', T('color','text','weight','leading','space','size','radius','border','stroke','shadow'), { entry: 'NAV-06' }),
    part('bottom-nav', '탭바', 'navigation', 'Molecule', 'NAV', 'navigation bottom tab bar 모바일 하단 메뉴', ['icon', ...T('color','text','weight','space','size','radius','border','stroke','shadow','blur','layer')], { entry: 'NAV-05' }),
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
  ].map(item => ({ ...item, english: english[item.id], version, lifecycle: 'Trial', environments: ['HTML','React'], behavior: item.behavior || interactive.includes(item.id) }));
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
      css: cssBlocks[item.id] || (item.id === 'page' ? ['page'] : [item.id]),
      source: 'src/system/parts.js', reactSource: item.layer === 'Token' ? null : 'src/system/react/'+item.id+'.jsx', styles: window.Pattove.catalog.styles.filter(s => s.id !== 'base').map(s => s.id),
      minInlineSize: minInline[item.id] || 160,
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
  window.Pattove.systemRegistry = { sections, items, index, matching, dependencies, patterns, normalizeOptions, version };
})();
