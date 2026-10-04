(() => {
  const docs = {
    motion: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion',
    performance: 'https://web.dev/articles/animations-guide',
    timeline: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline',
    next: 'https://nextjs.org/docs/app/api-reference/directives/use-client'
  };
  const categories = [
    ['entrance', '등장'], ['interaction', '반응·조작'], ['background', '배경'],
    ['text', '텍스트'], ['scroll', '스크롤'], ['loading', '로딩'], ['spatial', '3D']
  ].map(([id, name]) => ({ id, name }));
  // Colours, corners and type read Pattove roles with the role's own value as the fallback, so a copied effect
  // matches a Pattove app and still renders the same in a project without the tokens.
  // baseCSS travels with every copied effect; stageCSS is the demo tray (ground, height, padding) and is for previews only.
  const baseCSS = `.pm-demo *, .pm-demo *::before, .pm-demo *::after { box-sizing:border-box; }
.pm-demo .pm-sample { width:min(100%,260px); padding:24px; border:1px solid var(--p-line, #c2cad5); border-radius:var(--p-radius-xl, 16px); background:var(--p-bg, #ffffff); }
.pm-demo strong { display:block; font-size:var(--p-text-lg, 24px); line-height:1.2; }
.pm-demo p { margin:8px 0 0; color:var(--p-muted, #59636f); }
.pm-demo button, .pm-demo a { font:inherit; color:inherit; }
.pm-demo :focus-visible { outline:var(--p-border-width-focus, 3px) solid var(--p-highlight, #6153b5); outline-offset:var(--p-focus-offset, 3px); }
.pm-demo .pm-pause-label { margin-left:8px; font-size:var(--p-text-body, 14px); color:var(--p-muted, #59636f); }
.pm-demo > .pm-pause:checked ~ .pm-stage *, .pm-demo > .pm-pause:checked ~ .pm-stage *::before, .pm-demo > .pm-pause:checked ~ .pm-stage *::after { animation-play-state:paused !important; }
.pm-demo .pm-sr { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip-path:inset(50%); white-space:nowrap; }
`;
  const stageCSS = `.pm-demo { box-sizing:border-box; width:100%; min-height:260px; padding:24px; overflow:hidden; border-radius:var(--p-radius, 24px); background:var(--p-surface, #f1f3f6); color:var(--p-ink, #2c333d); font:16px/1.5 Pretendard, system-ui, sans-serif; }
.pm-demo .pm-stage { display:grid; place-items:center; min-height:212px; }
`;
  const ledge = 'color-mix(in srgb, var(--p-accent, #303b48) 70%, var(--p-shade, #000000))';
  const items = [
    {
      id: 'fade-up', name: '가볍게 올라오기', english: 'Fade up', category: 'entrance', trigger: '진입', cost: 'low',
      description: '짧은 거리만 올라오며 내용을 보여 줍니다. 카드와 안내 문구에 어울립니다.',
      properties: 'transform · opacity', performance: '위치와 투명도만 변경합니다. 합성 처리 후보이며 실제 레이어 승격은 브라우저가 결정합니다.',
      reduced: '이동과 페이드를 없애고 처음부터 내용을 표시합니다.',
      html: '<div class="pm-stage"><div class="pm-sample pm-fade"><strong>새 프로젝트</strong><p>팀원 4명이 함께 작업 중입니다.</p></div></div>',
      css: '.pm-fade { animation:pm-fade-in 600ms cubic-bezier(.2,.8,.2,1) both; }\n@keyframes pm-fade-in { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }'
    },
    {
      id: 'stagger', name: '차례로 나타나기', english: 'Staggered list', category: 'entrance', trigger: '진입', cost: 'low',
      description: '세 항목을 90ms 간격으로 보여 줍니다. 길어진 목록도 기다리게 하지 않습니다.',
      properties: 'transform · opacity', performance: '세 요소만 순차 실행합니다. 긴 목록에서는 지연 시간을 계속 누적하지 마세요.',
      reduced: '지연 없이 모든 항목을 바로 표시합니다.',
      html: '<div class="pm-stage"><ul class="pm-stagger"><li>회의록 정리</li><li>견적서 보내기</li><li>디자인 검토</li></ul></div>',
      css: '.pm-stagger { display:grid; gap:8px; width:min(100%,260px); margin:0; padding:0; list-style:none; }\n.pm-stagger > li { padding:12px 16px; border:1px solid var(--p-line, #c2cad5); border-radius:var(--p-radius-md, 8px); background:var(--p-bg, #ffffff); font-weight:600; animation:pm-stagger-in 500ms ease-out both; }\n.pm-stagger > :nth-child(2) { animation-delay:90ms; }\n.pm-stagger > :nth-child(3) { animation-delay:180ms; }\n@keyframes pm-stagger-in { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }'
    },
    {
      id: 'hover-lift', name: '살짝 떠오르는 버튼', english: 'Hover lift', category: 'interaction', trigger: '호버·초점', cost: 'low',
      description: '마우스와 키보드 초점에 같은 반응을 줍니다. 누르면 원래 높이로 돌아옵니다.',
      properties: 'transform', performance: '버튼과 아래 턱 그림자만 바뀝니다. 크기와 주변 배치는 바뀌지 않습니다.',
      reduced: '버튼의 위치를 고정하고 초점 테두리를 유지합니다.',
      html: '<div class="pm-stage"><button type="button" class="pm-lift">시작하기</button></div>',
      css: `.pm-lift { padding:16px 24px; border:1px solid var(--p-accent, #303b48); border-radius:var(--p-control-radius, 16px); background:var(--p-accent, #303b48); color:var(--p-on-accent, #ffffff) !important; font-weight:600; box-shadow:0 6px 0 ${ledge}; cursor:pointer; transition:transform 180ms ease-out, box-shadow 180ms ease-out; }\n.pm-lift:is(:hover,:focus-visible) { transform:translateY(-4px); box-shadow:0 10px 0 ${ledge}; }\n.pm-lift:active { transform:translateY(2px); box-shadow:0 4px 0 ${ledge}; }`,
      reduceCSS: `.pm-lift:is(:hover,:focus-visible,:active) { transform:none; box-shadow:0 6px 0 ${ledge}; }`
    },
    {
      id: 'underline', name: '밑줄로 응답하기', english: 'Focus underline', category: 'interaction', trigger: '호버·초점', cost: 'low',
      description: '짧은 밑줄이 왼쪽에서 펼쳐집니다. 텍스트의 위치와 크기는 그대로입니다.',
      properties: 'transform', performance: '작은 가상 요소 하나만 scaleX로 바뀝니다.',
      reduced: '초점과 호버 시 밑줄이 즉시 표시됩니다.',
      html: '<div class="pm-stage"><button class="pm-underline" type="button">자세히 보기</button></div>',
      css: '.pm-underline { position:relative; padding:12px 0; background:transparent; border:0; font-weight:600; cursor:pointer; }\n.pm-underline::after { content:""; position:absolute; bottom:4px; left:0; width:100%; height:2px; background:var(--p-accent, #303b48); transform:scaleX(0); transform-origin:left; transition:transform 220ms ease-out; }\n.pm-underline:is(:hover,:focus-visible)::after { transform:scaleX(1); }'
    },
    {
      id: 'aurora', name: '오로라 메쉬', english: 'Aurora mesh', category: 'background', trigger: '자동', cost: 'high', loop: true,
      description: '두 개의 빛이 천천히 교차합니다. 글자는 별도 층에 또렷하게 남습니다.',
      properties: 'transform · blur · gradient', performance: '블러와 넓은 그라데이션은 래스터화·레이어 메모리 비용이 큽니다. 작은 영역 하나에 사용하고 저사양 기기에서 측정하세요.',
      reduced: '움직임을 멈춘 그라데이션 배경으로 남깁니다.',
      html: '<div class="pm-stage pm-aurora"><i class="pm-aurora-orb" aria-hidden="true"></i><i class="pm-aurora-orb" aria-hidden="true"></i><div class="pm-aurora-copy"><strong>이번 주 새 소식</strong><p>업데이트 3건을 확인하세요.</p></div></div>',
      css: '.pm-aurora { position:relative; display:grid; place-items:center; min-height:212px; overflow:hidden; border-radius:var(--p-radius-lg, 12px); background:var(--p-bg, #ffffff); }\n.pm-aurora-orb { position:absolute; width:230px; height:180px; border-radius:50%; background:radial-gradient(ellipse,var(--p-mark-alt, #9ad9aa),transparent 70%); filter:blur(24px); animation:pm-aurora-drift 9s ease-in-out infinite alternate; }\n.pm-aurora-orb:nth-child(2) { background:radial-gradient(ellipse,var(--p-mark, #ffbf63),transparent 70%); animation-direction:alternate-reverse; animation-duration:12s; }\n.pm-aurora-copy { position:relative; text-align:center; padding:24px; border-radius:var(--p-radius-lg, 12px); background:color-mix(in srgb, var(--p-bg, #ffffff) 60%, transparent); }\n@keyframes pm-aurora-drift { from { transform:translate(-65px,-20px) scale(.9); } to { transform:translate(65px,20px) scale(1.2); } }'
    },
    {
      id: 'glitch', name: '짧은 글리치', english: 'Glitch text', category: 'text', trigger: '호버·초점', cost: 'medium',
      description: '글자 옆의 색상 잔상이 한 번 어긋납니다. 번쩍임과 무한 반복은 없습니다.',
      properties: 'transform · text-shadow', performance: 'text-shadow는 다시 그리기를 일으킬 수 있습니다. 짧은 제목 하나에만 쓰세요.',
      reduced: '잔상과 흔들림을 제거하고 본문 글자만 유지합니다.',
      html: '<div class="pm-stage"><button type="button" class="pm-glitch">연결 끊김<span>마우스를 올리거나 Tab으로 초점을 옮기세요</span></button></div>',
      css: '.pm-demo .pm-glitch { border:0; background:transparent; font-size:var(--p-text-heading, 30px); font-weight:700; line-height:1.3; cursor:pointer; }\n.pm-glitch span { display:block; margin-top:12px; color:var(--p-muted, #59636f); font-size:var(--p-text-body, 14px); font-weight:400; line-height:1.5; }\n.pm-glitch:is(:hover,:focus-visible) { animation:pm-glitch-once 360ms ease-out; }\n@keyframes pm-glitch-once { 30% { text-shadow:-3px 0 var(--p-error, #a3313e),3px 0 var(--p-success, #26614f); transform:translateX(2px); } 70% { text-shadow:1px 0 var(--p-error, #a3313e),-1px 0 var(--p-success, #26614f); transform:translateX(-1px); } }'
    },
    {
      id: 'scroll-reveal', name: '스크롤 리빌', english: 'Scroll driven reveal', category: 'scroll', trigger: '스크롤', cost: 'low', experimental: true,
      description: '상자 안을 스크롤하면 카드가 나타납니다. 지원하지 않는 환경에서도 내용은 보입니다.',
      properties: 'animation-timeline · transform · opacity', performance: '스크롤 이벤트 리스너 없이 CSS 타임라인을 사용합니다. 합성 여부는 엔진에 따라 달라집니다.',
      reduced: '스크롤과 관계없이 카드를 완전히 표시합니다.',
      html: '<div class="pm-stage"><div class="pm-scroll" tabindex="0" role="region" aria-label="스크롤 리빌 예시"><p>이 안을 아래로 스크롤하세요</p><div class="pm-scroll-gap"></div><div class="pm-sample pm-reveal"><strong>다음 장면</strong><p>스크롤한 만큼 나타납니다.</p></div><div class="pm-scroll-gap"></div></div></div>',
      css: '.pm-scroll { height:212px; width:min(100%,300px); overflow-y:auto; padding:12px; border:1px solid var(--p-line, #c2cad5); border-radius:var(--p-radius-xl, 16px); background:var(--p-bg, #ffffff); }\n.pm-scroll-gap { height:150px; }\n.pm-reveal { opacity:1; transform:none; }\n@supports (animation-timeline:view()) and (animation-range:entry 0% cover 40%) {\n  .pm-reveal { animation:pm-scroll-reveal linear both; animation-timeline:view(); animation-range:entry 0% cover 40%; }\n}\n@keyframes pm-scroll-reveal { from { opacity:.15; transform:translateY(20px); } to { opacity:1; transform:none; } }',
      reduceCSS: '.pm-reveal { opacity:1; transform:none; }', sources: [docs.timeline]
    },
    {
      id: 'orbit', name: '오빗 로더', english: 'Orbit loader', category: 'loading', trigger: '자동', cost: 'low', loop: true,
      description: '작은 링 하나가 회전하며 대기 상태를 알립니다. 설명 문구를 함께 표시합니다.',
      properties: 'transform', performance: '하나의 고정 크기 링만 회전합니다. 로딩이 끝나면 컴포넌트를 제거하세요.',
      reduced: '고정된 링과 “불러오는 중” 텍스트를 표시합니다.',
      html: '<div class="pm-stage"><div class="pm-loading" role="status"><i class="pm-orbit" aria-hidden="true"></i><p>불러오는 중</p></div></div>',
      css: '.pm-loading { text-align:center; }\n.pm-orbit { display:block; width:48px; height:48px; margin:auto; border:3px solid var(--p-hover, #e1e6ed); border-top-color:var(--p-accent, #303b48); border-radius:50%; animation:pm-orbit-spin 1.2s linear infinite; }\n@keyframes pm-orbit-spin { to { transform:rotate(360deg); } }'
    },
    {
      id: 'skeleton', name: '스켈레톤 쉬머', english: 'Skeleton shimmer', category: 'loading', trigger: '자동', cost: 'low', loop: true,
      description: '내용이 들어올 자리를 미리 확보하고 빛을 한 번씩 통과시킵니다.',
      properties: 'transform', performance: '고정된 그라데이션 층을 이동합니다. 부모 크기를 실제 콘텐츠와 맞춰 레이아웃 이동을 줄이세요.',
      reduced: '빛의 이동을 멈추고 고정된 자리 표시자를 남깁니다.',
      html: '<div class="pm-stage"><div class="pm-sample pm-skeleton" role="status"><span class="pm-sr">내용을 불러오는 중</span><div class="pm-skeleton-lines" aria-hidden="true"><i></i><i></i><i></i></div></div></div>',
      css: '.pm-skeleton { position:relative; overflow:hidden; }\n.pm-skeleton-lines { display:grid; gap:12px; }\n.pm-skeleton-lines i { height:12px; border-radius:var(--p-radius-md, 8px); background:var(--p-hover, #e1e6ed); }\n.pm-skeleton-lines i:last-child { width:60%; }\n.pm-skeleton::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,transparent,color-mix(in srgb, var(--p-bg, #ffffff) 70%, transparent),transparent); animation:pm-shimmer 2s ease-in-out infinite; }\n@keyframes pm-shimmer { from { transform:translateX(-100%); } to { transform:translateX(100%); } }',
      reduceCSS: '.pm-skeleton::after { display:none; }'
    },
    {
      id: 'pulse', name: '잔잔한 상태 표시', english: 'Status pulse', category: 'loading', trigger: '자동', cost: 'low', loop: true,
      description: '연결 상태를 작은 원으로 표시합니다. 상태의 뜻은 텍스트로도 전달합니다.',
      properties: 'transform · opacity', performance: '작은 링 하나의 크기와 투명도만 변경합니다. 화면 전체에 반복 배치하지 마세요.',
      reduced: '고정된 점과 상태 문구만 남깁니다.',
      html: '<div class="pm-stage"><div class="pm-status"><i class="pm-pulse" aria-hidden="true"></i><span>연결됨</span></div></div>',
      css: '.pm-status { display:flex; align-items:center; gap:16px; font-weight:600; }\n.pm-pulse { position:relative; width:12px; height:12px; border-radius:50%; background:var(--p-success, #26614f); }\n.pm-pulse::after { content:""; position:absolute; inset:-6px; border:1px solid var(--p-success, #26614f); border-radius:50%; animation:pm-pulse-ring 2.4s ease-out infinite; }\n@keyframes pm-pulse-ring { from { transform:scale(.5); opacity:.8; } to { transform:scale(1.5); opacity:0; } }',
      reduceCSS: '.pm-pulse::after { display:none; }'
    },
    {
      id: 'flip', name: '뒤집는 카드', english: 'Flip card', category: 'spatial', trigger: '클릭·키보드', cost: 'medium',
      description: '선택 상자로 앞뒷면을 전환합니다. 터치와 키보드에서도 같은 내용을 볼 수 있습니다.',
      properties: 'transform · perspective', performance: '두 면의 3D 합성이 필요합니다. 카드에 영상이나 무거운 그림자를 겹치지 마세요.',
      reduced: '회전 없이 앞뒷면이 바로 바뀝니다.',
      html: '<div class="pm-stage"><div class="pm-flip"><input type="checkbox" id="__ID__-flip" class="pm-flip-toggle"><label for="__ID__-flip">뒷면 보기</label><div class="pm-flip-scene"><div class="pm-flip-inner"><div class="pm-flip-front"><strong>apple</strong><p>영어 단어</p></div><div class="pm-flip-back"><strong>사과</strong><p>뜻</p></div></div></div></div></div>',
      css: '.pm-flip { width:min(100%,280px); }\n.pm-flip > label { margin-left:8px; font-size:var(--p-text-body, 14px); }\n.pm-flip-scene { perspective:800px; margin-top:12px; }\n.pm-flip-inner { position:relative; height:160px; transform-style:preserve-3d; transition:transform 600ms ease; }\n.pm-flip-front,.pm-flip-back { position:absolute; inset:0; padding:24px; border:1px solid var(--p-line, #c2cad5); border-radius:var(--p-radius-xl, 16px); backface-visibility:hidden; background:var(--p-bg, #ffffff); display:flex; flex-direction:column; justify-content:center; }\n.pm-flip-back { background:var(--p-soft, #d3e8de); transform:rotateY(180deg); visibility:hidden; }\n.pm-flip-toggle:checked ~ .pm-flip-scene .pm-flip-inner { transform:rotateY(180deg); }\n.pm-flip-toggle:checked ~ .pm-flip-scene .pm-flip-front { visibility:hidden; }\n.pm-flip-toggle:checked ~ .pm-flip-scene .pm-flip-back { visibility:visible; }'
    },
    {
      id: 'carousel', name: '3D 캐러셀', english: '3D carousel', category: 'spatial', trigger: '클릭·방향키', cost: 'medium',
      description: '세 장의 카드를 직접 선택해 넘깁니다. 자동 회전 없이 사용자가 속도를 정합니다.',
      properties: 'transform · perspective', performance: '세 카드의 합성 레이어가 필요할 수 있습니다. 많은 슬라이드를 한 번에 쌓지 마세요.',
      reduced: '입체 배치와 이동을 제거하고 선택한 카드만 표시합니다.',
      html: '<div class="pm-stage"><fieldset class="pm-carousel"><legend class="pm-sr">카드 선택</legend><input id="__ID__-one" name="__ID__-slide" type="radio" checked><label for="__ID__-one">봄</label><input id="__ID__-two" name="__ID__-slide" type="radio"><label for="__ID__-two">여름</label><input id="__ID__-three" name="__ID__-slide" type="radio"><label for="__ID__-three">가을</label><div class="pm-deck"><div class="pm-slide"><strong>봄 컬렉션</strong></div><div class="pm-slide"><strong>여름 컬렉션</strong></div><div class="pm-slide"><strong>가을 컬렉션</strong></div></div></fieldset></div>',
      css: '.pm-carousel { width:min(100%,310px); min-width:0; margin:0; padding:0; border:0; text-align:center; }\n.pm-carousel > label { margin:0 12px 0 4px; cursor:pointer; font-size:var(--p-text-body, 14px); }\n.pm-deck { position:relative; perspective:700px; height:172px; margin-top:16px; }\n.pm-slide { position:absolute; inset:0 16%; display:grid; align-content:center; gap:12px; padding:16px; border:1px solid var(--p-line, #c2cad5); border-radius:var(--p-radius-xl, 16px); background:var(--p-soft, #d3e8de); transition:transform 480ms ease,opacity 480ms ease; transform:translateX(34%) rotateY(-28deg) scale(.85); opacity:.45; }\n.pm-slide:nth-child(2) { background:var(--p-mark, #ffbf63); }\n.pm-slide:nth-child(3) { background:var(--p-bg, #ffffff); }\n.pm-carousel > input:nth-of-type(1):checked ~ .pm-deck > :nth-child(1), .pm-carousel > input:nth-of-type(2):checked ~ .pm-deck > :nth-child(2), .pm-carousel > input:nth-of-type(3):checked ~ .pm-deck > :nth-child(3) { transform:none; opacity:1; z-index:1; }\n.pm-carousel > input:nth-of-type(2):checked ~ .pm-deck > :nth-child(1), .pm-carousel > input:nth-of-type(3):checked ~ .pm-deck > :not(:nth-child(3)) { transform:translateX(-34%) rotateY(28deg) scale(.85); }',
      reduceCSS: '.pm-slide { visibility:hidden; transform:none !important; }\n.pm-carousel > input:nth-of-type(1):checked ~ .pm-deck > :nth-child(1), .pm-carousel > input:nth-of-type(2):checked ~ .pm-deck > :nth-child(2), .pm-carousel > input:nth-of-type(3):checked ~ .pm-deck > :nth-child(3) { visibility:visible; }'
    }
  ];
  const sources = [
    { id:'react-bits', name:'React Bits', stack:'React · CSS / Tailwind', url:'https://reactbits.dev', evidence:'https://github.com/DavidHDev/react-bits', delivery:'컴포넌트 코드 복사 · shadcn / jsrepo 설치', description:'텍스트, 배경, 인터랙션을 실제 React 컴포넌트로 살펴볼 수 있습니다.', caution:'효과마다 의존성·WebGL 사용 여부·움직임 줄이기 처리가 다릅니다. 저장소의 MIT + Commons Clause 조건을 확인하세요.' },
    { id:'magic-ui', name:'Magic UI', stack:'React · Next.js · Tailwind', url:'https://magicui.design', evidence:'https://magicui.design/docs/mcp', delivery:'Copy Page · 공식 MCP · 컴포넌트 설치', description:'움직이는 랜딩 페이지 부품을 AI 편집기에서 찾고 가져오는 흐름을 제공합니다.', caution:'무료 컴포넌트와 Pro 상품을 구분하세요. 성능 비용과 reduced-motion은 선택한 소스에서 별도로 확인해야 합니다.' },
    { id:'motion', name:'Motion', stack:'React · JavaScript · Vue', url:'https://motion.dev', evidence:'https://motion.dev/docs/react-accessibility', delivery:'문서 Copy page · 예제 코드', description:'전환·스크롤·제스처와 접근성 정책을 함께 설계할 때 참고할 수 있습니다.', caution:'MotionConfig reducedMotion="user"는 transform·layout을 줄입니다. opacity 등은 계속 움직일 수 있어 개별 제어가 필요합니다.' },
    { id:'shadcn', name:'shadcn/ui', stack:'React · Next.js', url:'https://ui.shadcn.com', evidence:'https://ui.shadcn.com/docs/mcp', delivery:'레지스트리 · CLI · MCP · llms.txt', description:'AI가 부품을 검색하고 의존 소스까지 설치하게 하는 구조를 참고할 수 있습니다.', caution:'모션 비용을 자동 보증하는 형식은 아닙니다. 레지스트리의 파일·의존성과 실제 브라우저 동작을 확인하세요.' },
    { id:'motion-lab', name:'Motion Lab', stack:'HTML · CSS · JavaScript', url:'https://motion.luvisyouth.com', evidence:'https://motion.luvisyouth.com/effects/aurora-text', delivery:'COPY ALL · AI PROMPT', description:'실물 효과와 구현 코드, AI에게 전달할 프롬프트를 나란히 제공합니다.', caution:'예제의 CSS와 프롬프트가 실제로 같은 reduced-motion 동작을 지키는지 확인하세요.' },
    { id:'effect-labs', name:'Effect.Labs', stack:'HTML · CSS · JavaScript', url:'https://effect-labs.com/en/effects/backgrounds/aurora-mesh.html', evidence:'https://effect-labs.com/en/effects/backgrounds/aurora-mesh.html', delivery:'라이브 데모 · 코드 블록 · 접근성·호환성 설명', description:'한 효과의 사용 장면, 구현 원리, 지원 환경을 함께 읽는 형식을 참고할 수 있습니다.', caution:'오로라 예제는 reduced-motion을 기본 코드에 포함하지 않는다고 명시합니다. 제공된 추가 대응을 적용해야 합니다.' },
    { id:'animate-css', name:'Animate.css', stack:'HTML · CSS · 모든 프레임워크', url:'https://animate.style', evidence:'https://animate.style', delivery:'클래스 이름 · CSS · 설치 안내', description:'등장·퇴장 등 범용 동작을 정해진 클래스와 시간 변수로 적용할 수 있습니다.', caution:'문서에 reduced-motion 대응이 있습니다. 전체 번들 크기와 무한 반복 사용은 프로젝트에서 검토하세요.' },
    { id:'animista', name:'Animista', stack:'HTML · CSS', url:'https://animista.net', evidence:'https://animista.net', delivery:'설정 가능한 미리보기 · CSS 생성·복사', description:'시간, 지연, 반복과 이징을 직접 조절하며 CSS 키프레임을 고를 수 있습니다.', caution:'AI용 요구사항, 브라우저 fallback, reduced-motion 정책은 전달할 때 별도로 덧붙이세요.' }
  ];
  window.Pattove.motionData = { items, categories, sources, docs, baseCSS, stageCSS };
})();
