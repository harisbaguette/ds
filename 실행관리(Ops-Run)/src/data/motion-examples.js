(() => {
  const data = window.Pattove.motionData;
  data.categories = [
    ['entrance','등장·퇴장'],['loading','상태·피드백'],['layout','레이아웃·전환'],['text','텍스트·숫자'],
    ['scroll','스크롤'],['interaction','포인터·제스처'],['background','배경·장식'],['spatial','3D']
  ].map(([id,name])=>({id,name}));
  const sources = {
    layout:'https://motion.dev/docs/react-layout-animations',
    timing:'https://www.carbondesignsystem.com/building-blocks/foundations/motion/overview',
    text:'https://magicui.design/docs/components/text-animate',
    scroll:'https://motion.dev/docs/react-scroll-animations',
    path:'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Motion_path',
    beam:'https://magicui.design/docs/components/animated-beam'
  };
  const existing = {
    'fade-up':['ANM-01'],stagger:['ANM-02'],'hover-lift':['ANM-22'],underline:['ANM-10'],aurora:['FX-05'],glitch:['FX-28'],
    'scroll-reveal':['ANM-05'],orbit:['STA-04'],skeleton:['ANM-19'],pulse:['ANM-40'],flip:['ANM-36'],carousel:['ANM-11']
  };
  for (const item of data.items) {
    item.dictionaryRefs=existing[item.id];
    item.aliases=[item.english,...item.dictionaryRefs];
  }
  // Portable defaults follow the host tokens when they are available.
  data.baseCSS += `
.pm-demo { color:var(--p-ink, #2c333d); font:16px/1.5 system-ui,sans-serif; --pm-enter:var(--p-duration-enter,240ms); --pm-exit:var(--p-duration-exit,180ms); --pm-layout:var(--p-duration-layout,320ms); --pm-reveal:var(--p-duration-reveal,420ms); }
.pm-demo .pm-stage { display:grid; place-items:center; }
.pm-demo [hidden] { display:none !important; }
.pm-demo [data-motion-still], .pm-demo[data-motion-still] *, .pm-demo[data-motion-still] *::before, .pm-demo[data-motion-still] *::after { animation:none !important; transition:none !important; }
.pm-demo[data-motion-paused] *, .pm-demo[data-motion-paused] *::before, .pm-demo[data-motion-paused] *::after { animation-play-state:paused !important; transition:none !important; }
.pm-demo .pm-stack { display:grid; gap:14px; width:min(100%,300px); }
.pm-demo .pm-actions { display:flex; flex-wrap:wrap; justify-content:center; gap:8px; }
.pm-demo .pm-button { border:1px solid var(--p-accent, #303b48); background:var(--p-accent, #303b48); color:var(--p-on-accent, #ffffff); min-height:40px; padding:8px 14px; border-radius:10px; cursor:pointer; font:600 13px/1.4 system-ui,sans-serif; }
.pm-demo .pm-button[data-secondary] { background:transparent; color:var(--p-ink, #2c333d); border-color:var(--p-line, #c2cad5); }
.pm-demo .pm-button:active { background:var(--p-accent, #303b48); }
.pm-demo .pm-button[aria-busy="true"] { opacity:.75; cursor:wait; }
.pm-demo .pm-caption { font-size:12px; color:var(--p-muted, #59636f); margin:0; text-align:center; }
.pm-demo .pm-row { display:flex; align-items:center; justify-content:space-between; gap:8px; min-height:44px; padding:8px 12px; border:1px solid var(--p-line, #c2cad5); border-radius:10px; background:var(--p-bg, #ffffff); font-size:13px; }
.pm-demo .pm-row button { flex-shrink:0; min-width:32px; min-height:32px; border:1px solid var(--p-line, #c2cad5); border-radius:8px; background:transparent; color:var(--p-ink, #2c333d); cursor:pointer; font-size:12px; }
.pm-demo .pm-rows { display:grid; gap:8px; padding:0; margin:0; list-style:none; }
.pm-demo .pm-dialog { color:var(--p-ink, #2c333d); background:var(--p-bg, #ffffff); border:1px solid var(--p-line, #c2cad5); border-radius:16px; width:min(280px,calc(100% - 32px)); padding:24px; margin:auto; max-height:calc(100% - 24px); overflow:auto; }
.pm-demo .pm-dialog::backdrop { background:var(--p-backdrop, #222c3daa); }
.pm-demo .pm-dialog h3 { margin:0; font-size:22px; }
.pm-demo .pm-dialog p { font-size:13px; margin:12px 0 20px; }
.pm-demo .pm-art { position:relative; height:132px; overflow:hidden; border-radius:12px; background:linear-gradient(135deg,var(--p-soft, #e7edf3),var(--p-disabled, #d8dee7)); }
.pm-demo .pm-art::before { content:''; position:absolute; width:110px; height:110px; border-radius:50%; background:var(--p-accent, #303b48); top:25px; left:50%; transform:translateX(-50%); }
.pm-demo .pm-art::after { content:''; position:absolute; width:180px; height:130px; border-radius:50%; background:var(--p-bg, #ffffff); top:84px; left:50%; transform:translateX(-50%); }
.pm-demo .pm-scroll-box { height:195px; overflow-y:auto; overscroll-behavior:contain; border:1px solid var(--p-line, #c2cad5); border-radius:12px; position:relative; }
.pm-demo .pm-scroll-copy { min-height:470px; padding:20px; display:grid; gap:50px; align-content:start; }
.pm-demo .pm-scroll-copy p { font-size:14px; line-height:1.8; }
`;
  const button=(text,attr='',secondary=false)=>`<button type="button" class="pm-button" ${secondary?'data-secondary ':''}${attr}>${text}</button>`;
  const status='<p class="pm-caption" role="status" data-status></p>';
  const wrap=html=>`<div class="pm-stage"><div class="pm-stack">${html}</div></div>`;
  function add(item) {
    data.items.push({cost:'low',properties:'transform · opacity',performance:'짧은 전환과 작은 영역에 사용합니다. 실제 크기와 기기에서 측정하세요.',
      reduced:'이동을 없애고 선택한 내용과 최종 상태를 바로 표시합니다.',css:'',sources:[sources.timing],...item,
      aliases:[item.english,...item.dictionaryRefs,...(item.aliases||[])]});
  }
  add({id:'accordion',name:'부드럽게 펼치기',english:'Accordion expand collapse',category:'layout',trigger:'클릭·키보드',behavior:'accordion',dictionaryRefs:['ANM-03'],
    description:'같은 자리에서 설명이 펼쳐지고 접힙니다. 도중에 다시 눌러 방향을 바꿀 수 있습니다.',cost:'medium',properties:'height · opacity',performance:'내용 높이를 바꾸므로 레이아웃 계산이 생깁니다. 긴 목록 전체에 동시에 적용하지 마세요.',
    html:wrap(`<div class="pm-accordion">${button('자세히 알아보기 ＋','data-toggle aria-expanded="false" aria-controls="__ID__-panel"')}<div data-panel id="__ID__-panel" hidden><p>필요한 만큼, 한 단계씩.</p><p>접었다 펼쳐도 같은 맥락을 유지합니다.</p></div></div>`),
    css:'.pm-accordion { border:1px solid var(--p-line, #c2cad5); border-radius:12px; padding:12px; } .pm-accordion [data-toggle] { width:100%; text-align:start; } .pm-accordion [data-panel] { overflow:hidden; } .pm-accordion p { padding:4px 6px; font-size:14px; }',sources:[sources.layout]});
  add({id:'modal',name:'대화상자 열고 닫기',english:'Dialog enter exit',category:'entrance',trigger:'클릭·키보드',behavior:'modal',dictionaryRefs:['ANM-01','ACT-07','MOT-10'],
    description:'작업 창이 들어오고 나갑니다. 닫으면 열었던 버튼으로 초점이 돌아옵니다.',
    html:wrap(`${button('작업 창 열기','data-open')}<p class="pm-caption">Escape로도 닫을 수 있어요.</p><dialog class="pm-dialog" aria-labelledby="__ID__-title"><h3 id="__ID__-title">잠깐, 여기에 집중.</h3><p>작은 움직임으로 새 작업 영역을 알립니다.</p>${button('작업 창 닫기','data-close')}</dialog>`)});
  add({id:'toast',name:'알림 쌓고 닫기',english:'Toast enter exit stack',category:'loading',trigger:'클릭·키보드',behavior:'toast',dictionaryRefs:['ANM-01','STA-03'],
    description:'새 알림이 들어오고, 닫은 자리에는 다음 알림이 이어집니다. 직접 닫을 때까지 남습니다.',
    html:wrap(`${button('알림 띄우기','data-add')}<ul class="pm-rows" data-list aria-label="알림"><li class="pm-row" data-row="1"><span>첫 번째 저장 완료</span><button type="button" data-remove aria-label="첫 번째 알림 닫기">닫기</button></li></ul>${status}`)});
  add({id:'tabs',name:'선택을 따라가는 밑줄',english:'Sliding tab indicator',category:'layout',trigger:'클릭·방향키',behavior:'tabs',dictionaryRefs:['ANM-38'],
    description:'선택한 탭의 너비와 위치에 맞춰 밑줄이 이동합니다. 방향키로도 선택할 수 있습니다.',
    html:wrap(`<div class="pm-tabs"><div role="tablist" aria-label="작업 단계">${['발견','살펴보기','완성하기'].map((text,i)=>`<button type="button" role="tab" id="__ID__-tab-${i}" aria-controls="__ID__-panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}">${text}</button>`).join('')}<i data-indicator aria-hidden="true"></i></div>${['새로운 생각을 만나요.','작은 차이를 살펴봐요.','내 작업에 가져다 써요.'].map((text,i)=>`<div class="pm-tab-panel" role="tabpanel" id="__ID__-panel-${i}" aria-labelledby="__ID__-tab-${i}" tabindex="0"${i?' hidden':''}>${text}</div>`).join('')}</div>`),
    css:'.pm-tabs [role="tablist"] { display:flex; position:relative; border-bottom:1px solid var(--p-line, #c2cad5); } .pm-tabs [role="tab"] { flex:1; min-height:44px; border:0; background:none; font-size:12px; cursor:pointer; padding:8px 4px; } .pm-tabs [aria-selected="true"] { color:var(--p-accent, #303b48); } .pm-tabs [data-indicator] { position:absolute; left:0; bottom:-1px; height:3px; background:var(--p-accent, #303b48); transform-origin:left; pointer-events:none; } .pm-tab-panel { padding:32px 12px; text-align:center; font-size:15px; }',sources:[sources.layout]});
  add({id:'list-change',name:'빈자리를 채우는 목록',english:'List insert remove layout',category:'layout',trigger:'클릭·키보드',behavior:'list-change',dictionaryRefs:['ANM-32'],
    description:'항목을 더하거나 지우면 나머지가 자리를 찾아갑니다. 무엇이 바뀌었는지 놓치지 않습니다.',
    html:wrap(`${button('항목 추가','data-add')}<ul class="pm-rows" data-list aria-label="작업 목록">${['관찰하기','다듬기'].map((t,i)=>`<li class="pm-row" data-row="${i+1}"><span>${t}</span><button type="button" data-remove aria-label="${t} 삭제">삭제</button></li>`).join('')}</ul>${status}`),sources:[sources.layout]});
  add({id:'save-state',name:'저장에서 완료까지',english:'Button loading success error',category:'loading',trigger:'클릭·키보드',behavior:'save-state',dictionaryRefs:['STA-40'],
    description:'저장 중·완료·실패 상태를 버튼과 문구로 전달합니다. 결과를 선택해 예제 요청을 실행합니다.',
    html:wrap(`<label class="pm-caption" for="__ID__-result">예제 요청 결과</label><select class="pm-outcome" id="__ID__-result" data-outcome><option value="success">성공</option><option value="error">실패</option></select>${button('저장하기','data-save aria-busy="false"')}${status}`),
    css:'.pm-outcome { min-height:40px; padding:8px; border:1px solid var(--p-line, #c2cad5); border-radius:10px; color:var(--p-ink, #2c333d); background:var(--p-bg, #ffffff); font:inherit; } .pm-demo [data-save] { min-width:150px; } .pm-demo [data-save][data-state="error"] { background:var(--p-error-soft, #f8deda); border-color:var(--p-error-line, #d5958d); color:var(--p-error, #88342b); }'});
  add({id:'checkmark',name:'완료를 그리는 체크',english:'Animated SVG checkmark',category:'loading',trigger:'클릭·키보드',behavior:'checkmark',dictionaryRefs:['ANM-37','ANM-28'],
    description:'완료 순간 체크가 한 번 그려집니다. 동작을 줄여도 완료 문구와 체크가 남습니다.',cost:'medium',properties:'stroke-dashoffset',performance:'SVG 선을 다시 그립니다. 작은 아이콘 한 개에 사용하세요.',
    html:wrap(`<svg class="pm-check" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="none" stroke="var(--p-line, #c2cad5)" stroke-width="2"></circle><path data-check pathLength="1" d="M18 32 L28 42 L47 22" fill="none" stroke="var(--p-accent, #303b48)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></svg>${button('완료하기','data-complete')}${status}`),
    css:'.pm-check { width:76px; height:76px; margin:auto; } .pm-check path { stroke-dasharray:1; stroke-dashoffset:1; }'});
  add({id:'split-text',name:'단어마다 한 걸음',english:'Split text stagger reveal',category:'text',trigger:'진입',previewRepeat:true,dictionaryRefs:['ANM-09'],
    description:'단어가 차례로 올라오며 짧은 문장을 완성합니다. 읽는 기기에는 문장 전체를 전달합니다.',
    html:wrap('<p class="pm-split"><span class="pm-sr">작은 움직임, 또렷한 의미.</span><span aria-hidden="true"><span>작은</span> <span>움직임,</span><br><span>또렷한</span> <span>의미.</span></span></p>'),
    css:'.pm-split { text-align:center; font-size:clamp(24px,6vw,34px); font-weight:700; color:var(--p-ink, #2c333d) !important; line-height:1.5; } .pm-split [aria-hidden] > span { display:inline-block; animation:pm-word-in var(--pm-reveal) ease-out both; } .pm-split [aria-hidden] > span:nth-of-type(2) { animation-delay:70ms; } .pm-split [aria-hidden] > span:nth-of-type(3) { animation-delay:140ms; } .pm-split [aria-hidden] > span:nth-of-type(4) { animation-delay:210ms; } @keyframes pm-word-in { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }',sources:[sources.text]});
  add({id:'count-up',name:'목표에 닿는 숫자',english:'Count up number ticker',category:'text',trigger:'진입·클릭',behavior:'count-up',dictionaryRefs:['ANM-20'],
    description:'숫자가 목표값에 도착합니다. 한 번에 최종값을 읽을 수 있고 다시 재생할 수 있습니다.',cost:'medium',properties:'textContent',performance:'숫자 변경은 텍스트 페인트를 일으킵니다. 고정 폭 숫자와 자리 확보로 흔들림을 줄입니다.',
    html:wrap(`<div class="pm-number"><span class="pm-sr">총 1,280.5 킬로미터</span><strong data-output data-value="1280.5" data-decimals="1" aria-hidden="true">1,280.5</strong><span aria-hidden="true">km / 함께한 거리</span></div>${button('다시 세기','data-start',true)}`),
    css:'.pm-number { text-align:center; } .pm-number strong { font-size:clamp(30px,9vw,46px); font-variant-numeric:tabular-nums; color:var(--p-accent, #303b48); min-height:56px; } .pm-number > span { font-size:12px; color:var(--p-muted, #59636f); }',sources:['https://magicui.design/docs/components/number-ticker']});
  add({id:'mask-reveal',name:'커튼처럼 열리는 장면',english:'Image mask reveal',category:'entrance',trigger:'진입',previewRepeat:true,dictionaryRefs:['ANM-08'],
    description:'작은 풍경이 아래에서 열립니다. 이미지 자리는 처음부터 확보되어 있습니다.',cost:'medium',properties:'clip-path',performance:'마스크 변화의 합성 여부와 페인트 비용은 브라우저에 따라 다릅니다. 큰 이미지에서 측정하세요.',
    html:wrap('<div class="pm-art pm-mask" role="img" aria-label="초록 달이 떠 있는 산 풍경"></div><p class="pm-caption">한 장면을 천천히 발견하기.</p>'),
    css:'.pm-mask { animation:pm-mask-in var(--pm-reveal) cubic-bezier(.2,0,.38,.9) both; } @keyframes pm-mask-in { from { clip-path:inset(100% 0 0); } to { clip-path:inset(0); } }',reduceCSS:'.pm-mask { clip-path:none; }'});
  add({id:'sort-list',name:'잡고 바꾸는 순서',english:'Drag to reorder sortable list',category:'interaction',trigger:'드래그·버튼·키보드',behavior:'sort-list',dictionaryRefs:['MOT-05','ANM-03'],
    description:'손잡이를 끌거나 위아래 버튼을 눌러 순서를 바꿉니다. 끌던 중 Escape로 취소할 수 있습니다.',
    html:wrap(`<ol class="pm-rows" data-sort-list aria-label="정렬 가능한 단계">${['발견','정리','완성'].map(t=>`<li class="pm-row" data-sort-row data-name="${t}"><button type="button" data-drag-handle aria-label="${t} 끌기 손잡이">⠿</button><span>${t}</span><div><button type="button" data-move="-1" aria-label="${t} 위로">↑</button> <button type="button" data-move="1" aria-label="${t} 아래로">↓</button></div></li>`).join('')}</ol>${status}`),
    css:'.pm-demo [data-drag-handle] { touch-action:none; cursor:grab; } .pm-demo [data-sort-row] { position:relative; user-select:none; } .pm-demo [data-sort-row] > span { flex:1; } .pm-demo .pm-dragging { z-index:3; background:var(--p-soft, #e7edf3); border-color:var(--p-accent, #303b48); } .pm-demo .pm-drop-target { outline:2px solid var(--p-accent, #303b48); }',sources:[sources.layout]});
  add({id:'shared-card',name:'카드에서 자세히 보기',english:'Shared element card detail',category:'layout',trigger:'클릭·키보드',behavior:'shared-card',dictionaryRefs:['ANM-04','MOT-08'],
    description:'선택한 카드의 위치에서 상세 창이 이어집니다. 이동을 줄이면 창이 바로 열립니다.',cost:'medium',properties:'transform · opacity · geometry measurement',
    html:wrap(`<button type="button" class="pm-shared-card" data-open><span class="pm-art" aria-hidden="true"></span><b>달빛 산책</b><span>눌러서 더 알아보기 ↗</span></button><dialog class="pm-dialog" aria-labelledby="__ID__-title"><div class="pm-art" aria-hidden="true"></div><h3 id="__ID__-title">달빛 산책</h3><p>선택했던 장면과 같은 이야기가 이어집니다.</p>${button('카드로 돌아가기','data-close')}</dialog>`),
    css:'.pm-shared-card { display:grid; gap:8px; width:100%; text-align:start; padding:12px; border:1px solid var(--p-line, #c2cad5); border-radius:16px; background:var(--p-bg, #ffffff); cursor:pointer; } .pm-shared-card > span:last-child { font-size:12px; color:var(--p-muted, #59636f); } .pm-shared-card .pm-art { height:95px; width:100%; } .pm-dialog .pm-art { height:80px; margin-bottom:12px; }',sources:[sources.layout]});
  add({id:'typewriter',name:'한 글자씩 전하는 문장',english:'Typewriter text',category:'text',trigger:'진입·클릭',behavior:'typewriter',dictionaryRefs:['ANM-26'],
    description:'짧은 문장을 한 글자씩 보여 줍니다. 기다리지 않고 전체 문장을 바로 볼 수 있습니다.',cost:'medium',properties:'textContent',performance:'문자가 바뀔 때 텍스트를 다시 그립니다. 긴 본문에 적용하지 마세요.',
    html:wrap(`<p class="pm-type"><span class="pm-sr">오늘도, 당신의 속도로 🌿</span><span data-output aria-hidden="true">오늘도, 당신의 속도로 🌿</span></p><div class="pm-actions">${button('다시 쓰기','data-start',true)}${button('전체 보기','data-skip',true)}</div>`),
    css:'.pm-type { min-height:96px; margin:0 !important; font-size:25px; font-weight:600; color:var(--p-ink, #2c333d) !important; line-height:1.6; overflow-wrap:anywhere; }',sources:['https://magicui.design/docs/components/typing-animation']});
  add({id:'gradient-text',name:'글자 안에 흐르는 빛',english:'Animated gradient text',category:'text',trigger:'자동',behavior:'passive',loop:true,dictionaryRefs:['ANM-09','ANM-35'],
    description:'짧은 제목 안에서 색이 천천히 흐릅니다. 글자의 위치와 모양은 그대로 남습니다.',cost:'medium',properties:'background-position',performance:'배경 위치 변화가 페인트를 유발할 수 있습니다. 짧은 제목 한 곳에 사용하세요.',reduced:'색 흐름을 멈추고 밝은 단색 글자를 표시합니다.',
    html:wrap('<strong class="pm-gradient-text">빛나는<br>작은 생각.</strong>'),
    css:'.pm-gradient-text { font-size:clamp(30px,8vw,44px) !important; text-align:center; line-height:1.4 !important; color:var(--p-accent, #303b48); } @supports (background-clip:text) { .pm-gradient-text { color:transparent; background:linear-gradient(90deg,var(--p-accent, #303b48),var(--p-highlight, #6153b5),var(--p-ink, #2c333d),var(--p-accent, #303b48)); background-size:200% 100%; background-clip:text; animation:pm-text-light 5s linear infinite; } } @keyframes pm-text-light { to { background-position:200% 0; } }',reduceCSS:'.pm-gradient-text { color:var(--p-accent, #303b48); background:none; }',sources:['https://magicui.design/docs/components/animated-gradient-text']});
  add({id:'reading-progress',name:'읽은 만큼 차오르는 띠',english:'Reading progress scroll linked',category:'scroll',trigger:'스크롤',behavior:'reading-progress',dictionaryRefs:['ANM-33','ANM-05'],
    description:'상자 안에서 읽은 위치를 얇은 띠로 보여 줍니다. 스크롤 위치에 정확히 연결됩니다.',reduced:'부드러운 보간 없이 현재 읽은 비율을 즉시 표시합니다.',
    html:wrap('<div class="pm-reading-bar" role="progressbar" aria-label="읽은 비율" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i data-progress></i></div><div class="pm-scroll-box" data-scroller tabindex="0" role="region" aria-label="읽기 진행 예시"><article class="pm-scroll-copy"><strong>작은 관찰 노트</strong><p>아래로 읽어 보세요.<br>중요한 것은 얼마나 빠른지가 아니라, 어디까지 왔는지 아는 일입니다.</p><p>여기까지 읽었다면 끝에 가까워졌습니다.</p><p>모든 이야기를 읽었습니다.</p></article></div>'),
    css:'.pm-reading-bar { height:4px; overflow:hidden; border-radius:3px; background:var(--p-line, #c2cad5); } .pm-reading-bar i { display:block; width:100%; height:100%; background:var(--p-accent, #303b48); transform:scaleX(0); transform-origin:left; }',sources:[sources.scroll]});
  add({id:'parallax',name:'조금 다르게 흐르는 풍경',english:'Subtle parallax scroll',category:'scroll',trigger:'스크롤',behavior:'parallax',dictionaryRefs:['ANM-07'],
    description:'작은 풍경 안에서 배경만 느리게 움직입니다. 스크롤을 가로채지 않습니다.',reduced:'배경을 고정하고 원래 스크롤만 유지합니다.',
    html:wrap('<div class="pm-scroll-box" data-scroller tabindex="0" role="region" aria-label="패럴랙스 예시"><div class="pm-parallax-content"><div class="pm-art" data-parallax role="img" aria-label="작은 달과 산"></div><div class="pm-scroll-copy"><strong>멀고 가까운 사이.</strong><p>아래로 스크롤하면 풍경과 문장이 서로 다른 속도로 지나갑니다.</p><p>배경의 이동은 28px 안에서 멈춥니다.</p></div></div></div>'),
    css:'.pm-parallax-content { overflow:hidden; } .pm-parallax-content .pm-art { margin:12px; } .pm-parallax-content .pm-scroll-copy { position:relative; background:var(--p-surface, #f1f3f6); }',sources:[sources.scroll]});
  add({id:'marquee',name:'이어지는 로고 띠',english:'Marquee seamless logo loop',category:'background',trigger:'자동',behavior:'passive',loop:true,dictionaryRefs:['FX-14'],
    description:'로고가 끊김 없이 이어집니다. 정지 버튼으로 멈추고 천천히 살펴볼 수 있습니다.',reduced:'중복 로고를 숨기고 원래 로고를 정적인 격자로 보여 줍니다.',
    html:wrap('<div class="pm-marquee"><div class="pm-marquee-track"><ul aria-label="함께하는 브랜드"><li>STUDIO</li><li>GROVE</li><li>ORBIT</li></ul><ul aria-hidden="true"><li>STUDIO</li><li>GROVE</li><li>ORBIT</li></ul></div></div><p class="pm-caption">함께하는 이름들.</p>'),
    css:'.pm-marquee { overflow:hidden; width:100%; } .pm-marquee-track { display:flex; width:max-content; animation:pm-marquee-move 12s linear infinite; } .pm-marquee ul { display:flex; gap:14px; padding:0 14px 0 0; margin:0; list-style:none; } .pm-marquee li { display:grid; place-items:center; min-width:100px; height:72px; padding:12px; border:1px solid var(--p-line, #c2cad5); border-radius:12px; font-size:13px; letter-spacing:.1em; color:var(--p-accent, #303b48); } @keyframes pm-marquee-move { to { transform:translateX(-50%); } }',
    reduceCSS:'.pm-marquee-track { width:100%; transform:none; } .pm-marquee ul { display:flex; flex-wrap:wrap; padding:0; } .pm-marquee li { min-width:70px; flex:1; } .pm-marquee [aria-hidden] { display:none; }',sources:['https://magicui.design/docs/components/marquee']});
  add({id:'border-beam',name:'테두리를 도는 빛',english:'Border beam',category:'background',trigger:'자동',behavior:'passive',loop:true,dictionaryRefs:['FX-35'],
    description:'카드 테두리를 따라 작은 빛이 순환합니다. 핵심 카드 한 곳에만 강조를 더합니다.',cost:'medium',properties:'SVG stroke-dashoffset',performance:'SVG 테두리를 다시 그립니다. 여러 카드에 반복 배치하지 마세요.',reduced:'흐르는 빛을 없애고 고정된 테두리를 유지합니다.',
    html:wrap('<div class="pm-beam-card"><svg viewBox="0 0 280 150" preserveAspectRatio="none" aria-hidden="true"><rect x="2" y="2" width="276" height="146" rx="14" pathLength="100" fill="none" stroke="var(--p-accent, #303b48)" stroke-width="2"></rect></svg><span class="pm-eyebrow">ONE GOOD IDEA</span><strong>여기에 주목.</strong><p>빛은 가장자리에만.</p></div>'),
    css:'.pm-beam-card { position:relative; padding:30px 22px; min-height:150px; border:1px solid var(--p-line, #c2cad5); border-radius:16px; background:var(--p-bg, #ffffff); } .pm-beam-card svg { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; } .pm-beam-card rect { stroke-dasharray:18 82; animation:pm-border-flow 4s linear infinite; } .pm-beam-card strong { margin-top:10px; } @keyframes pm-border-flow { to { stroke-dashoffset:-100; } }',reduceCSS:'.pm-beam-card svg { display:none; }',sources:['https://magicui.design/docs/components/border-beam']});
  add({id:'spotlight',name:'포인터를 따라오는 조명',english:'Pointer spotlight card',category:'interaction',trigger:'포인터·초점',behavior:'spotlight',dictionaryRefs:['FX-25'],
    description:'카드 안에서만 작은 조명이 움직입니다. 터치와 키보드에서는 가운데 조명을 유지합니다.',cost:'medium',properties:'radial-gradient',performance:'포인터 이동마다 그라디언트를 다시 그릴 수 있습니다. 카드 한 장으로 범위를 제한하세요.',reduced:'포인터 추적을 멈추고 고정 조명을 사용합니다.',
    html:wrap('<button type="button" class="pm-pointer-card pm-spotlight" data-pointer-card><span class="pm-eyebrow">LOOK CLOSER</span><strong>작은 발견.</strong><span>카드 위로 포인터를 옮겨 보세요.</span></button>'),
    css:'.pm-pointer-card { width:100%; min-height:170px; padding:24px; display:grid; align-content:center; gap:14px; text-align:start; border:1px solid var(--p-line, #c2cad5); border-radius:16px; background:var(--p-bg, #ffffff); cursor:default; } .pm-pointer-card > span:last-child { color:var(--p-muted, #59636f); font-size:12px; } .pm-spotlight { background:radial-gradient(circle at var(--spot-x,50%) var(--spot-y,50%),var(--p-soft, #e7edf3) 0, var(--p-bg, #ffffff) 65%); }'});
  add({id:'tilt',name:'손끝에 기우는 카드',english:'Pointer tilt 3D card',category:'interaction',trigger:'포인터·초점',behavior:'tilt',dictionaryRefs:['FX-24'],
    description:'포인터를 따라 카드가 최대 5도 기울어집니다. 포인터를 떼면 제자리로 돌아옵니다.',cost:'medium',properties:'transform · perspective',performance:'카드의 합성 레이어가 필요할 수 있습니다. 고해상도 영상이나 큰 블러를 겹치지 마세요.',reduced:'카드를 정면에 고정합니다.',
    html:wrap('<button type="button" class="pm-tilt-card" data-pointer-card><span class="pm-eyebrow">A DIFFERENT ANGLE</span><strong>다른 각도로.</strong><span>조금만 움직여도 충분해요.</span></button>'),
    css:'.pm-tilt-card { display:grid; align-content:center; gap:18px; width:100%; min-height:178px; padding:24px; text-align:start; background:linear-gradient(135deg,var(--p-soft, #e7edf3),var(--p-bg, #ffffff)); border:1px solid var(--p-line, #c2cad5); border-radius:16px; transition:transform var(--pm-enter) ease-out; cursor:default; } .pm-tilt-card > span:last-child { font-size:12px; color:var(--p-muted, #59636f); }'});
  add({id:'motion-path',name:'곡선을 따라가는 점',english:'Motion path animation',category:'background',trigger:'자동',behavior:'passive',loop:true,dictionaryRefs:['ANM-43'],
    description:'점 하나가 곡선을 따라 이동합니다. 경로 위의 위치와 방향으로 흐름을 보여 줍니다.',cost:'medium',properties:'offset-path · offset-distance',performance:'offset-path의 렌더링 비용은 기기와 경로 복잡도에 따라 달라집니다. 단순한 경로에서 시작하세요.',reduced:'움직이는 점을 멈추고 경로와 설명을 남깁니다.',
    html:wrap('<div class="pm-path-scene" role="img" aria-label="두 언덕을 따라 이동하는 점"><svg viewBox="0 0 240 120" aria-hidden="true"><path d="M12 90 C50 10 85 10 120 60 S195 115 228 25" fill="none" stroke="var(--p-line, #c2cad5)" stroke-width="2"></path></svg><i class="pm-path-dot" aria-hidden="true"></i></div><p class="pm-caption">흐름에도 길이 있어요.</p>'),
    css:'.pm-path-scene { position:relative; width:240px; max-width:100%; height:120px; margin:auto; overflow:hidden; } .pm-path-scene svg { width:240px; height:120px; } .pm-path-dot { position:absolute; top:90px; left:12px; width:12px; height:12px; border-radius:50%; background:var(--p-accent, #303b48); } @supports (offset-path:path("M0 0 L1 1")) { .pm-path-dot { top:0; left:0; offset-path:path("M12 90 C50 10 85 10 120 60 S195 115 228 25"); animation:pm-path-follow 4s ease-in-out infinite alternate; } } @keyframes pm-path-follow { to { offset-distance:100%; } }',sources:[sources.path]});
  add({id:'connection-beam',name:'연결을 따라 흐르는 빛',english:'Animated connection beam',category:'background',trigger:'자동',behavior:'passive',loop:true,dictionaryRefs:['FX-36','CAN-10'],
    description:'두 서비스 사이 연결선을 따라 빛이 흐릅니다. 연결 구조를 설명하는 장식 예제입니다.',cost:'medium',properties:'SVG stroke-dashoffset',performance:'연결선 개수에 따라 페인트 비용이 늘어납니다. 필요한 연결만 움직이세요.',reduced:'흐르는 빛을 숨기고 연결선과 서비스 이름을 유지합니다.',
    html:wrap('<div class="pm-connection"><div class="pm-connection-labels"><span>자료</span><span>작업 공간</span></div><svg viewBox="0 0 280 100" aria-hidden="true"><path d="M24 20 C24 100 256 100 256 20" pathLength="100" fill="none" stroke="var(--p-line, #c2cad5)" stroke-width="2"></path><path class="pm-connection-light" d="M24 20 C24 100 256 100 256 20" pathLength="100" fill="none" stroke="var(--p-accent, #303b48)" stroke-width="3" stroke-linecap="round"></path></svg></div><p class="pm-caption">연결 구조 예시 · 실제 전송 상태가 아닙니다.</p>'),
    css:'.pm-connection-labels { display:flex; justify-content:space-between; gap:20px; } .pm-connection-labels span { display:grid; place-items:center; padding:12px; border:1px solid var(--p-line, #c2cad5); border-radius:12px; background:var(--p-bg, #ffffff); font-size:13px; } .pm-connection svg { display:block; width:100%; height:100px; } .pm-connection-light { stroke-dasharray:12 88; animation:pm-connection-flow 3s linear infinite; } @keyframes pm-connection-flow { from { stroke-dashoffset:12; } to { stroke-dashoffset:-100; } }',reduceCSS:'.pm-connection-light { display:none; }',sources:[sources.beam]});
})();
