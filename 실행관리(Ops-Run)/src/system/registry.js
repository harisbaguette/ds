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
  // Token deps name the token kinds a part's own CSS reads (checked against src/tokens/component/<part>.css at build).
  const T = (...kinds) => kinds.map(kind => 'token-' + kind);
  const items = [
    { id: 'token-color', name: '색 토큰', section: 'foundations', layer: 'Token', keywords: '색 색상 컬러 배경 글자색 강조 color', deps: [], entry: 'TOK-01' },
    { id: 'token-typography', name: '글꼴 토큰', section: 'foundations', layer: 'Token', keywords: '글꼴 서체 글자 크기 타이포 font typography', deps: [], entry: 'TOK-62' },
    { id: 'token-space', name: '간격 토큰', section: 'foundations', layer: 'Token', keywords: '간격 여백 거리 spacing space', deps: [], entry: 'TOK-76' },
    { id: 'token-radius', name: '모서리 토큰', section: 'foundations', layer: 'Token', keywords: '모서리 둥글기 반경 radius', deps: [], entry: 'TOK-91' },
    { id: 'token-shadow', name: '그림자 토큰', section: 'foundations', layer: 'Token', keywords: '그림자 입체 층 깊이 shadow elevation', deps: [], entry: 'TOK-95' },
    { id: 'token-motion', name: '움직임 토큰', section: 'foundations', layer: 'Token', keywords: '움직임 시간 전환 애니메이션 motion duration', deps: [], entry: 'TOK-113' },
    { id: 'icon', name: '아이콘', section: 'primitives', layer: 'Primitive', keywords: '검색 닫기 화살표 svg icon', deps: T('color','shadow'), entry: 'ICO-01' },
    { id: 'divider', name: '구분선', section: 'primitives', layer: 'Primitive', keywords: '선 분리 경계 divider separator', deps: T('color','typography') },
    { id: 'status-dot', name: '상태 점', section: 'primitives', layer: 'Primitive', keywords: '상태 온라인 성공 status dot', deps: T('color','typography','space') },
    { id: 'button', name: '버튼', section: 'buttons', layer: 'Atom', keywords: 'button 행동 실행 크기 상태 hover focus disabled loading', deps: ['icon', ...T('color','space','radius','shadow','motion')], entry: 'ACT-01' },
    { id: 'input', name: '입력창', section: 'fields', layer: 'Atom', keywords: 'input text email 입력 텍스트', deps: T('color','space','radius','shadow') },
    { id: 'field', name: '입력 필드', section: 'fields', layer: 'Molecule', keywords: 'label 오류 검증 validation error 폼 라벨 설명', deps: ['input', ...T('color','typography','space','radius')], entry: 'INP-47' },
    ...['checkbox','radio','switch'].map((id, i) => ({ id, name: ['체크박스','라디오','스위치'][i], section: 'selection', layer: 'Atom', keywords: 'checkbox radio switch toggle 선택 체크박스 토글', deps: T('color','space','radius','shadow','motion'), behavior: true })),
    { id: 'badge', name: '배지', section: 'feedback', layer: 'Atom', keywords: 'badge status 상태 태그', deps: T('color','shadow') },
    { id: 'tabs', name: '탭', section: 'navigation', layer: 'Molecule', keywords: 'tabs 메뉴 전환 탐색', deps: T('color','space','radius','shadow'), entry: 'NAV-06' },
    { id: 'bottom-nav', name: '하단 탐색', section: 'navigation', layer: 'Molecule', keywords: 'navigation bottom dock 모바일 하단 메뉴', deps: ['icon', ...T('color','space','radius','shadow')], entry: 'NAV-05' },
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
  // Look-alike versions of one part. Same tokens, different shape. Adding a list here is all another part needs for the variant grid.
  const look = (no, id, name, tags) => ({ no, id, name, tags });
  // Template and page share the screen arrangements; the page fills each with a matching search look.
  const pageLooks = [
    look('01','stack','기본 쌓기',['제목','독','기본']), look('02','hero','큰 머리글',['첫인상','여백','브랜드']),
    look('03','appbar','가운데 앱 바',['앱','익숙함','단정']), look('04','sheet','겹친 시트',['진함','겹침','몰입']),
    look('05','magazine','잡지형',['큰 글자','편집','위계']), look('06','dashboard','대시보드형',['숫자','요약','관리'])
  ];
  const galleries = {
    'bottom-nav': { key: 'variant', label: '모양', default: 'line', frame: 'phone-bottom', list: [
      look('01','minimal','미니멀',['가벼움','정돈','기본']), look('02','glass','유리',['투명','겹침','가벼움']),
      look('03','float','떠 있는 바',['떠 있음','중심 행동','둥긂']), look('04','neumorph','뉴모피즘',['부드러움','입체감','촉감']),
      look('05','pill','알약 강조',['또렷함','집중','간결']), look('06','fab','가운데 큰 버튼',['만들기 강조','솟음','역동']),
      look('07','gradient','그라데이션',['진함','고급','대비']), look('08','outline','윤곽 아이콘',['얇음','단정','여백']),
      look('09','line','위쪽 표시줄',['익숙함','명확','평평함']), look('10','curve','곡선 진한 바',['곡선','몰입','개성']),
      look('11','dock','독',['떠 있음','고급','입체감'])
    ] },
    // Atoms share one key: `look` → data-look on the markup, drawn by [data-look] rules in parts.css. First entry = current shape.
    button: { list: [
      look('01','fill','채움',['기본','또렷함','단단함']), look('02','soft','부드러운 채움',['차분함','연함','보조']),
      look('03','line','굵은 윤곽',['가벼움','선명','평평함']), look('04','text','밑줄 글자',['최소','링크','조용함']),
      look('05','pill','알약',['둥긂','친근함','모바일']), look('06','gradient','그라데이션',['진함','고급','대비']),
      look('07','3d','눌리는 입체',['손맛','놀이','턱']), look('08','neumorph','뉴모피즘',['부드러움','입체감','촉감']),
      look('09','glass','유리',['투명','겹침','가벼움']), look('10','cta','화살표 원',['행동 유도','방향','강조'])
    ] },
    input: { list: [
      look('01','box','테두리 상자',['기본','익숙함','단정']), look('02','underline','밑줄',['최소','여백','가벼움']),
      look('03','filled','채운 칸',['머티리얼','면','또렷함']), look('04','pill','알약',['검색','둥긂','모바일']),
      look('05','float','테두리 라벨',['공간 절약','정돈','라벨']), look('06','neumorph','오목 뉴모피즘',['부드러움','눌림','촉감']),
      look('07','glass','유리',['투명','떠 있음','가벼움']), look('08','sharp','각진 굵은 선',['대담함','각','개성'])
    ] },
    field: { list: [
      look('01','stack','위 라벨',['기본','읽기 쉬움','세로']), look('02','inline','옆 라벨',['가로','조밀','설정']),
      look('03','float','테두리 라벨',['공간 절약','정돈','라벨']), look('04','underline','밑줄',['최소','여백','가벼움']),
      look('05','filled','안쪽 라벨',['머티리얼','면','조밀']), look('06','card','카드 묶음',['묶음','구획','또렷함']),
      look('07','pill','알약',['둥긂','친근함','모바일']), look('08','neumorph','뉴모피즘',['부드러움','눌림','촉감'])
    ] },
    checkbox: { list: [
      look('01','square','네모',['기본','익숙함','단정']), look('02','round','동그라미',['둥긂','친근함','할 일']),
      look('03','outline','윤곽 체크',['가벼움','선','조용함']), look('04','card','선택 카드',['넓은 칸','또렷함','묶음']),
      look('05','chip','알약 칩',['필터','조밀','모바일']), look('06','list','목록 줄',['설정','오른쪽','정돈']),
      look('07','neumorph','뉴모피즘',['부드러움','입체감','촉감'])
    ] },
    radio: { list: [
      look('01','dot','가운데 점',['기본','익숙함','단정']), look('02','check','체크 원',['확정','또렷함','둥긂']),
      look('03','outline','윤곽 점',['가벼움','선','고전']), look('04','card','선택 카드',['넓은 칸','또렷함','묶음']),
      look('05','segment','나란한 버튼',['전환','조밀','가로']), look('06','list','목록 줄',['설정','오른쪽','정돈']),
      look('07','neumorph','뉴모피즘',['부드러움','입체감','촉감'])
    ] },
    switch: { list: [
      look('01','track','기본 트랙',['기본','단정','익숙함']), look('02','ios','큰 초록',['모바일','또렷함','켜짐']),
      look('03','slim','가는 트랙',['머티리얼','가벼움','손잡이']), look('04','text','켬·끔 글자',['명확','글자','안내']),
      look('05','square','네모',['각','단단함','개성']), look('06','outline','커지는 손잡이',['윤곽','변화','또렷함']),
      look('07','neumorph','뉴모피즘',['부드러움','입체감','촉감']), look('08','list','설정 줄',['설정','오른쪽','정돈'])
    ] },
    badge: { list: [
      look('01','soft','연한 면',['기본','차분함','둥긂']), look('02','outline','윤곽',['가벼움','선','조용함']),
      look('03','solid','진한 면',['강조','대비','또렷함']), look('04','dot','점 붙음',['상태','작음','정돈']),
      look('05','square','네모',['각','표','단단함']), look('06','tag','꼬리표',['분류','물건','개성']),
      look('07','raised','떠 있는',['입체감','가벼움','부드러움'])
    ] },
    divider: { list: [
      look('01','solid','실선',['기본','단정','얇음']), look('02','dashed','파선',['임시','가벼움','구획']),
      look('03','dotted','점선',['부드러움','리듬','가벼움']), look('04','label','가운데 글자',['또는','나눔','안내']),
      look('05','inset','들여쓴 선',['목록','정렬','조용함']), look('06','bar','짧은 막대',['강조','제목','중심']),
      look('07','fade','흐려지는 선',['부드러움','여운','고급']), look('08','thick','두꺼운 띠',['구역','모바일','또렷함'])
    ] },
    'status-dot': { list: [
      look('01','dot','점',['기본','작음','단정']), look('02','ring','후광',['또렷함','부드러움','주목']),
      look('03','pulse','맥박',['실시간','움직임','주목']), look('04','badge','배지형',['묶음','또렷함','면']),
      look('05','avatar','프로필 모서리',['사람','접속','익숙함']), look('06','bar','세로 막대',['목록','정렬','조용함']),
      look('07','check','체크 원',['완료','확정','또렷함'])
    ] },
    icon: { list: [
      look('01','line','선',['기본','가벼움','단정']), look('02','bold','굵은 선',['또렷함','작은 크기','강조']),
      look('03','duotone','두 톤',['깊이','부드러움','면']), look('04','filled','채움',['선택됨','단단함','강조']),
      look('05','circle','동그라미 받침',['둥긂','친근함','면']), look('06','square','진한 네모 받침',['앱','강조','대비']),
      look('07','ring','윤곽 원',['가벼움','선','단정']), look('08','raised','떠 있는 받침',['입체감','부드러움','촉감'])
    ] },
    tabs: { key: 'look', label: '모양', frame: 'stage', list: [
      look('01','filled','채움 트랙',['또렷함','단단함','기본']), look('02','underline','밑줄',['익숙함','가벼움','평평함']),
      look('03','segmented','분할 버튼',['떠 있는 칸','단정','설정']), look('04','outline','윤곽 상자',['경계','분리','문서']),
      look('05','float','떠 있는 알약',['여백','부드러움','가벼움']), look('06','icon','아이콘 위 글자',['그림','앱','직관']),
      look('07','vertical','세로',['옆 메뉴','넓은 화면','설정']), look('08','folder','폴더 탭',['서류철','연결','고전'])
    ] },
    // sample: options that only the gallery cards add, so the chosen shape is visible without pressing anything.
    feedback: { key: 'look', label: '모양', frame: 'stage', sample: { open: true }, list: [
      look('01','card','떠 있는 카드',['입체','안정','기본']), look('02','dot','점 알림',['최소','여백','가벼움']),
      look('03','stripe','왼쪽 띠',['상태 강조','문서','단정']), look('04','toast','진한 토스트',['대비','순간','또렷함']),
      look('05','glass','떠 있는 유리',['투명','겹침','가벼움']), look('06','ring','진행 고리',['원형','숫자 강조','대시보드']),
      look('07','pill','두꺼운 알약 막대',['굵음','숫자 강조','친근']), look('08','steps','마디 막대',['단계','리듬','정돈'])
    ] },
    card: { key: 'look', label: '모양', frame: 'stage', list: [
      look('01','raised','기본 입체',['테두리','얕은 그림자','기본']), look('02','line','테두리만',['평평함','단정','문서']),
      look('03','float','그림자 떠 있음',['떠 있음','경계 없음','가벼움']), look('04','fill','채움 배경',['부드러움','묶음','색면']),
      look('05','row','가로형',['목록','조밀','한 줄 행동']), look('06','media','이미지 위',['그림','갤러리','첫인상']),
      look('07','glass','유리',['투명','겹침','고급']), look('08','neumorph','뉴모피즘',['촉감','입체감','부드러움']),
      look('09','accent','강조 윗띠',['표시','분류','또렷함'])
    ] },
    'search-module': { key: 'look', label: '모양', frame: 'stage', list: [
      look('01','grid','카드 격자',['훑어보기','넓음','기본']), look('02','pill','알약 검색창',['한 줄','간결','모바일']),
      look('03','chips','필터 칩 줄',['빠른 필터','손가락','한눈에']), look('04','list','목록형',['조밀','빠른 비교','글 중심']),
      look('05','command','명령 팔레트형',['키보드','집중','떠 있음']), look('06','media','이미지 카드',['그림','갤러리','탐색']),
      look('07','feature','큰 첫 결과',['추천','위계','잡지'])
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
    input: ['한 줄 값 입력', 'label과 id를 연결. 오류에는 설명과 aria-invalid를 함께 사용', ['id','value','placeholder','type','name','disabled','invalid','description'], ['input','change']],
    field: ['라벨·입력·설명·오류의 연결', '라벨과 도움말의 id 관계를 함께 가져오기', ['id','label','value','state','help','name','type'], ['input','change']],
    checkbox: ['여러 개 중 선택', '연결된 label을 조작 영역으로 유지', ['label','checked','disabled','indeterminate','name','value'], ['change']],
    radio: ['같은 그룹에서 하나 선택', '같은 그룹은 name 공유, 다른 그룹은 name 분리', ['label','checked','disabled','name','value'], ['change']],
    switch: ['설정을 켜고 끄기', '동작 이름을 label로 제공', ['label','checked','disabled'], ['change']],
    badge: ['짧은 상태 이름', '색만으로 상태를 구분하지 않음', ['label','tone'], []],
    tabs: ['같은 영역의 내용 전환', '탭과 패널의 id 연결을 유지. 세로 모양은 위아래 방향키', ['prefix','look'], ['pattove:tabchange']],
    'bottom-nav': ['주요 목적지 선택', '목적지 이동은 pattove:navigate 이벤트에 연결. 가운데 만들기 버튼(float·fab)은 pattove:create(React는 onCreate)에 연결. 표본은 선택 상태를 제공', ['variant','onCreate (React)'], ['pattove:navigate','pattove:create (HTML)']],
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
