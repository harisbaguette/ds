(() => {
  const { library: data, views, previews } = window.Pattove;
  const { escape } = views, { icon } = previews;
  // Finished specimens open first; the full dictionary remains available through the list filter.
  // An icon lives in one home category (sub) and may also show in up to two more (also), the way Font Awesome and Lucide list one icon under several categories.
  const iconShelf=data.shelves.find(s=>s.codes?.includes('ICO'))?.id;
  const glyphSets=new Map(data.glyphSets.map(s=>[s.id,s]));
  const glyphName=new Map(data.glyphs.map(([key,name])=>[key,name]));
  const linked=new Set(data.entries.flatMap(e=>e.glyph||[]));
  const dictionary=[...data.entries,...data.glyphs.filter(([key])=>!linked.has(key)).map(([key,name,sub,also])=>({id:key,name,kind:'세트 그림',category:'ICO',sub,...(also&&{also}),shelf:iconShelf,glyph:[key],...(data.glyphIllustrations?.[key]&&{art:data.glyphIllustrations[key]})}))];
  const iconCats=e=>e.sub?[e.sub,...(e.also||[])]:[];
  const entries=new Map(dictionary.map(e=>[e.id,e]));
  const components=new Map(data.components.map(e=>[e.id,e]));
  const pages=['dictionary','components'];
  const searches=new Map([...dictionary,...data.components].map(e=>[e.id,[e.id,e.name,e.term,e.usage,e.examples,e.kind,...(e.glyph||[]).map(g=>g+' '+(glyphName.get(g)||''))].filter(Boolean).join(' ').toLocaleLowerCase()]));
  const registry = window.Pattove.systemRegistry;
  const claimed = new Set(registry.items.map(item => item.entry).filter(Boolean));
  const part = id => registry.index.get(id) || (claimed.has(id) && registry.items.find(item => item.entry === id));
  const implemented = e => ({ ...e, usage:e.purpose, category:e.section, kind:e.layer, implementation:true });
  // The shelves (토큰 by source code, 부품 → 블록 → 템플릿 by kind, then 아이콘 as its own library) are the header tabs. Each entry carries its shelf from the build.
  // Inside a tab the left rail narrows by one facet (group, kind, source category or icon category); an address may still carry
  // role group or 분야 (one "area" facet, since the two split the categories between them): OR inside a facet, AND across facets.
  const categoryById=new Map(data.categories.map(c=>[c.id,c]));
  const shelves=new Map(data.shelves.map(s=>[s.id,s]));
  const places=new Map(data.places.map(p=>[p.id,p]));
  const iconGroups=new Map(data.iconGroups.map(g=>[g.id,g]));
  const layers=new Map(data.layers.map(l=>[l.id,l]));
  const placeOf=new Map(data.places.flatMap(p=>p.codes.map(code=>[code,p.id])));
  const groupName={vocabulary:'기초',interaction:'조작',expression:'표현',work:'작업',quality:'품질',additional:'추가'};
  const roles=data.roleOrder.map(id=>data.groups.find(g=>g.id===id)).filter(Boolean)
    .map(g=>({id:g.id,name:groupName[g.id]||g.name,codes:g.codes.filter(code=>!placeOf.has(code))}));
  const roleOf=new Map(roles.flatMap(r=>r.codes.map(code=>[code,r.id])));
  // A dictionary entry carries its shelf from the build; a hierarchy component (no category) lands on the shelf that claims its layer.
  const shelfOf=e=>e.category?e.shelf:data.shelves.find(s=>s.layers?.includes(e.layer))?.id;
  const itemShelf=item=>item.browse.shelf;
  const browseSections=['buttons','fields','selection','navigation','composition','feedback','primitives','foundations','page'];
  // Specimen shortcuts sit above the complete dictionary taxonomy.
  const partGroups=[
    {id:'buttons',name:'버튼과 동작',items:['button','icon-button','segmented-button','record-editor']},
    {id:'fields',name:'입력',items:['input','clear-input','unit-input','stepper','password-input','field','date-range','search-bar']},
    {id:'selection',name:'선택',items:['checkbox','radio','switch','check-card','radio-card','filter-chip']},
    {id:'navigation',name:'탐색',items:['tabs','bottom-nav']},
    {id:'display',name:'표시',items:['icon','icon-label','divider','text-divider','status-dot','avatar','badge','count-badge','card','list-card','media-card']},
    {id:'feedback',name:'피드백',items:['notice','toast','progress-bar','progress-ring','step-bar']}
  ];
  const builtInShelf=shelf=>registry.items.filter(i=>itemShelf(i)===shelf).sort((a,b)=>browseSections.indexOf(a.section)-browseSections.indexOf(b.section));
  // Implementations own their browsing metadata; a missing dictionary link never changes their category.
  const browseEntry=item=>({...entries.get(item.entry),id:item.id,name:item.name,shelf:item.browse.shelf,kind:item.browse.kind,category:item.browse.code});
  const inShelf=new Map(), bump=key=>inShelf.set(key,(inShelf.get(key)||0)+1);
  for (const e of dictionary.filter(e=>!part(e.id))) { bump(e.shelf+'|'+e.category); for (const sub of iconCats(e)) bump(e.shelf+'|ICO.'+sub); }
  for (const item of registry.items) bump(itemShelf(item)+'|'+item.browse.code);
  const short=name=>String(name).split(' — ')[0];
  // Navigation uses short labels; the full category name remains in the link title.
  const navLabels={
    VIS:'스타일 기준',LAY:'레이아웃',NAV:'탐색과 위치',ACT:'버튼·메뉴·오버레이',INP:'입력과 폼',DAT:'검색·목록·데이터',STA:'상태와 피드백',
    EDT:'글과 미디어',WEB:'웹사이트·브랜드',COM:'상품과 비교',ACC:'계정·시작·설정',SOC:'소통·활동·저장',MOT:'모바일 조작',FLW:'사용자 흐름',SRH:'검색과 발견',
    CHR:'데이터 시각화',ANA:'분석과 탐색',RTE:'문서 편집',CAN:'캔버스·다이어그램',COL:'협업',FIL:'파일과 자료',SCH:'날짜·예약·일정',GEO:'지도와 위치',
    AIX:'AI 인터페이스',BIL:'요금·결제·사용량',HLP:'고객지원',EDU:'학습과 평가',MOB:'모바일 시스템',ACS:'접근성과 환경',ART:'시각 구성',TYP:'타이포그래피',
    IMG:'이미지와 자산',ANM:'움직임과 전환',DOC:'문서·인쇄·내보내기',MED:'음성·영상·통화',PRV:'동의와 정보 통제',OPS:'업무와 자동화',TOO:'계산·변환·생성',DOM:'업종별 패턴',
    FX:'배경·재질·효과',GAM:'게임 화면 요소',MSG:'이메일·푸시·문자',ADM:'관리자·CMS',DSO:'디자인 시스템',DEV:'개발 문서·API',PRF:'속도와 대기',SEC:'보안과 위험 알림',
    GRO:'전환과 재방문',ANT:'피해야 할 패턴',STR:'극단값 테스트',XR:'AR·VR·공간',DVC:'TV·차량·키오스크',VUI:'대화와 음성',ICO:'아이콘·기호',ATM:'아토믹 디자인',MOD:'페이지 구역',
    TOK:'디자인 토큰',STT:'상호작용 상태',GES:'제스처·키보드',SND:'소리와 햅틱',CPY:'문구와 카피',FMT:'날짜·숫자·단위',ARI:'접근성 역할',AST:'자산 규격',LAW:'인지와 동기',CLI:'명령줄',
    GHD:'HUD·전투 표시',GEC:'게임 상점과 경제',GLV:'라이브 운영·소셜',GGN:'장르별 화면',GIO:'게임 입력',GFX:'게임 감각과 연출',GTK:'게임 UI 도구',GAC:'게임 접근성',KOR:'국내 인증·결제',
    CNT:'콘텐츠 뷰어',OBS:'운영 콘솔',PRO:'제작 도구',DSK:'데스크톱·브라우저',IND:'산업·기기 제어',AGE:'연령·생활 맞춤',MAG:'매거진·뉴스',BLG:'블로그·포트폴리오',
    SLD:'발표·슬라이드',PRT:'인쇄·패키지',VID:'영상·모션 그래픽',FIN:'금융과 자산',LIF:'예약과 거래',HLT:'건강·의료·운동'
  };
  // A shelf with no kinds (토큰) sorts by the family named before " — " (색, 글자, 간격 …); a family of one or a bare name reads as 기타,
  // and the hierarchy components on that shelf share one 묶음 kind.
  const byName=id=>!shelves.get(id)?.kinds.length;
  const family=e=>e.name.includes(' — ')?short(e.name):'';
  const families=new Map();
  for (const e of data.entries) if (byName(shelfOf(e))) families.set(family(e),(families.get(family(e))||0)+1);
  const kindOf=e=>registry.index.has(e.id)?registry.index.get(e.id).browse.kind:!e.category?shelves.get(shelfOf(e))?.name+' 묶음':!byName(shelfOf(e))?e.kind:family(e)&&families.get(family(e))>1?family(e):'기타';
  const shelfKinds=new Map(data.shelves.map(s=>[s.id,[...new Set([...(s.kinds.length?s.kinds:[...data.entries,...data.components].filter(e=>shelfOf(e)===s.id).map(kindOf)),...registry.items.filter(i=>itemShelf(i)===s.id).map(i=>i.browse.kind)])]
    .sort((x,y)=>(x==='기타')-(y==='기타')||0)]));
  // Guidelines explain icon usage; only generated illustrations are finished icon assets.
  const isGuideline=e=>e.kind==='기준';
  const todoArt=cls=>'<span class="'+cls+'">미구현</span>';
  const illustration=(e,large=false)=>'<img class="illustrated-icon" src="'+escape(large?e.art.src:e.art.thumb)+'" width="'+e.art.width+'" height="'+e.art.height+'" alt="'+(large?escape(short(e.name))+' 일러스트':'')+'" decoding="async"'+(large?'':' loading="lazy"')+'>';
  const fileName=e=>{
    const english=String(e.name).split(' — ')[1]||'', slug=value=>String(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
    return slug(english)||slug(e.id.includes(':')?e.id.slice(e.id.indexOf(':')+1):'')||slug((e.art.png.split('/').pop()||'').replace(/\.png$/,'').replace(/^illustrated-/,''))||e.id;
  };
  const glyphSource=key=>{ const s=glyphSets.get(key.slice(0,key.indexOf(':'))); return s?s.name+' '+s.version+' · '+s.license:'유니코드 이모지'; };
  function sample(item, style = 'main', prefix = 'atlas') {
    const p = window.Pattove.parts, built = registry.index.get(item.id);
    const kept = built ? registry.normalizeOptions(item.id, window.Pattove.componentDocs?.defaults(item.id) || {}) : {};
    // Button: its three shapes side by side, the kept default first, with labels short enough to stay on one line in the narrowest card.
    const shapes = [['primary','저장'],['outline','취소'],['ghost','닫기']].sort((x,y)=>(y[0]===kept.variant)-(x[0]===kept.variant));
    const body = item.id === 'button' ? shapes.map(([variant,label])=>p.button({label,variant})).join('')
      : item.id === 'icon' ? ['search','arrow','bookmark','grid','close','check','folder','bell'].map(p.icon).join('')
      : item.id === 'input' ? '<label class="ds-field">이름'+p.input({id:prefix,placeholder:'이름을 입력하세요'})+'</label>'
      : p.renderItem(item.id, prefix, kept);
    // Bottom bars are drawn on the card's lower edge at real size, as on a screen, so they are not shrunk scenes.
    const fitted=!['action-bar','bottom-nav'].includes(item.id)&&(['card','list-card','media-card'].includes(item.id)||!!built?.browse.fit);
    // A part or block is laid out at the narrowest width it supports (plus the scene's padding), so the card shows it at or near real size.
    // Templates keep the wider screen scene and shrink to fit, as whole screens do.
    const width=fitted&&built&&built.browse.shelf!=='template'?' style="width:calc(var(--p-space-unit) * '+(built.minInlineSize/4+8)+')"':'';
    return '<div class="atlas-sample ds theme-'+style+'" data-style="'+style+'" data-kind="'+item.id+'"'+(fitted?' data-preview-scene data-preview-fit="both"':'')+width+'>'+body+'</div>';
  }
  const match=(entry,query)=>query.trim().toLocaleLowerCase().split(/\s+/).every(term=>searches.get(entry.id).includes(term));

  // Filters live in the address: shelf=part&kind=부품&role=interaction&place=shop&code=ACT, shelf=icon&icon=navigation (lists are comma-separated).
  // An old ?category=shelf[.code[.icon]] or bare code address still opens; with no shelf, the tab holding most of that category opens.
  const list=value=>[...new Set(String(value||'').split(',').filter(Boolean))];
  const homeShelf=code=>data.shelves.map(s=>s.id).sort((x,y)=>(inShelf.get(y+'|'+code)||0)-(inShelf.get(x+'|'+code)||0))[0];
  function readFilters(page, params) {
    const legacy=String(params.get('category')||'').split('.');
    if (page==='components') return {layer:list(params.get('layer')).concat(layers.has(legacy[0])?[legacy[0]]:[]).filter(id=>layers.has(id))};
    const legacyShelf=shelves.has(legacy[0])?legacy.shift():null;
    const [oldKey,oldSub]=legacy;
    const detail=entries.get(params.get('detail'))||components.get(params.get('detail'));
    const code=[...new Set(list(params.get('code')).concat(categoryById.has(oldKey)?[oldKey]:[]))].filter(id=>categoryById.has(id));
    const wanted=params.get('shelf');
    const shelf=shelves.has(wanted)?wanted:legacyShelf||(detail?shelfOf(detail):code.length?homeShelf(code[0]):'part');
    return {
      shelf,
      available:shelf!==iconShelf&&params.get('available')!=='all',
      group:shelf==='part'?list(params.get('group')).filter(id=>partGroups.some(g=>g.id===id)):[],
      kind:list(params.get('kind')).filter(k=>shelfKinds.get(shelf).includes(k)),
      role:list(params.get('role')).filter(id=>roles.some(r=>r.id===id)),
      place:list(params.get('place')).concat(places.has(oldKey)?[oldKey]:[]).filter(id=>places.has(id)),
      code,
      icon:shelf===iconShelf?list(params.get('icon')).concat(oldKey==='ICO'&&oldSub?[oldSub]:[]).filter(id=>iconGroups.has(id)):[]
    };
  }
  function writeFilters(state, params) {
    const f=state.filters;
    if (state.page==='dictionary') params.set('shelf',f.shelf);
    if (state.page==='dictionary'&&f.shelf!==iconShelf&&f.available===false) params.set('available','all');
    for (const [key,value] of Object.entries(f)) if (Array.isArray(value)&&value.length) params.set(key,value.join(','));
  }
  const passes=(f,e)=>(!f.group?.length||f.group.some(id=>partGroups.find(g=>g.id===id)?.items.includes(e.id)))
    &&(!f.kind.length||f.kind.includes(kindOf(e)))
    &&(!(f.role.length||f.place.length)||f.role.includes(roleOf.get(e.category))||f.place.includes(placeOf.get(e.category)))
    &&(!f.code.length||f.code.includes(e.category))
    &&(!f.icon.length||e.category!=='ICO'||iconCats(e).some(sub=>f.icon.includes(sub)));

  const activeShelf=state=>state.page==='system'?itemShelf(registry.index.get(state.detail)):state.page==='dictionary'?state.filters.shelf:null;
  const querySuffix=state=>state.query&&['dictionary','system'].includes(state.page)?'&q='+encodeURIComponent(state.query):'';
  // 대메뉴 = the top tabs (스타일 and the five shelves). 중메뉴 = the left rows of the open shelf. 소메뉴 = the rows that open under a 중 row when it is clicked.
  function navigation(state) {
    const open=activeShelf(state), q=querySuffix(state);
    return '<a class="nav-shelf-link ds-tab" id="style-context" href="#/styles" data-focus="style-context"'+(state.page==='styles'?' aria-current="page"':'')+'><span>스타일</span></a>'
      +['token','icon','part','block','template'].map(id=>{
        const s=shelves.get(id);
        return '<a class="nav-shelf-link ds-tab" href="#/dictionary?shelf='+id+q+'" data-focus="tab-'+id+'"'+(open===id?' aria-current="page"':'')+'><span>'+s.name+'</span></a>';
      }).join('') + '<a class="nav-shelf-link ds-tab" href="#/motion" data-focus="tab-motion"'+(state.page==='motion'?' aria-current="page"':'')+'><span>모션</span></a>';
  }
  // The 55 icon categories are too many for one list, so eight 중 bundles hold them; a category the table forgets falls into 기타.
  const iconBundles=(()=>{
    const table=[
      ['interface','화면·조작',['navigation','actions','status','arrows','layout','accessibility','security']],
      ['document','글·문서·업무',['text','letters','files','business','charts','math','time','finance']],
      ['media','미디어·소통',['media','music','communication','ai','design','arts','emoji']],
      ['device','기기·개발',['devices','development','tools','science','energy']],
      ['life','사람·생활',['people','hands','home','food','clothing','medical','sports','education','shopping']],
      ['place','이동·장소',['logistics','maps','travel','transportation','buildings','flags']],
      ['nature','자연·동물',['nature','farming','weather','space','animals']],
      ['society','놀이·사회·상징',['gaming','badges','events','religion','fantasy','brands','safety','civic']]
    ].map(([id,name,ids])=>({id,name,ids:ids.filter(g=>iconGroups.has(g))}));
    const placed=new Set(table.flatMap(b=>b.ids)), rest=data.iconGroups.map(g=>g.id).filter(g=>!placed.has(g));
    return rest.length?[...table,{id:'etc',name:'기타',ids:rest}]:table;
  })();
  // A 중 row is one address (key=ids); when it has two or more 소 rows it opens them. Shelves with nothing to split show 중 rows only.
  function menusOf(id) {
    const plain=(key,list)=>list.map(([mid,name])=>({key,id:mid,name,ids:[mid],kids:[]}));
    if (id==='icon') return [
      ...iconBundles.map(b=>({key:'icon',id:b.id,name:b.name,ids:b.ids,kids:b.ids.map(g=>({id:g,name:iconGroups.get(g).name}))})),
      ...plain('kind',shelfKinds.get(id).filter(kind=>dictionary.some(e=>e.shelf===id&&e.kind===kind&&!e.sub)).map(kind=>[kind,'아이콘 '+kind]))
    ];
    if (['token','template'].includes(id)) return plain('kind',shelfKinds.get(id).map(k=>[k,k]));
    return data.groups.map(g=>{
      const kids=data.categories.filter(c=>g.codes.includes(c.id)&&inShelf.has(id+'|'+c.id)).map(c=>({id:c.id,name:short(c.name)}));
      return kids.length&&{key:'code',id:g.id,name:g.name,ids:kids.map(k=>k.id),kids};
    }).filter(Boolean);
  }
  // The 스타일 tab's left menu, shaped like every shelf's: 전체 보기 is the card grid, each row opens one style's page.
  function styleMenu(state) {
    const rows=window.Pattove.catalog.styles.filter(s=>s.id!=='base');
    const all='<a class="nav-all ds-tab" href="#/styles" data-focus="nav-all"'+(!state.detail?' aria-current="true"':'')+'>전체 보기</a>';
    return '<div class="nav-subnav" role="group" aria-label="스타일 목록">'+all+'<div class="nav-subnav-scroll">'+rows.map(s=>
      '<a class="nav-subcategory ds-tab" href="#/styles?detail='+encodeURIComponent(s.id)+'" data-focus="style-'+escape(s.id)+'" title="'+escape(s.description)+'"'+(state.detail===s.id?' aria-current="true"':'')+'><span>'+escape(s.name)+'</span></a>').join('')+'</div></div>';
  }
  function subnavigation(state) {
    if (state.page==='motion') return window.Pattove.motionUI.subnavigation(state);
    if (state.page==='styles') return styleMenu(state);
    const id=activeShelf(state);
    if (!id) return '';
    const s=shelves.get(id), f=state.filters, q=querySuffix(state);
    const built=state.page==='system'&&registry.index.get(state.detail);
    const menus=menusOf(id), shortcuts=id==='part'?partGroups.map(g=>({key:'group',id:g.id,name:g.name,ids:[g.id],kids:[]})):[], split=m=>m.kids.length>1;
    const same=(a,b)=>a.length===b.length&&a.every(x=>b.includes(x));
    // In a part's detail page the part decides what is picked, the same way the list's address would.
    const picked=m=>built?(m.key==='group'?partGroups.find(g=>g.id===m.id).items.includes(built.id):m.key==='kind'?built.browse.kind===m.id:m.ids.includes(built.browse.code)):(f[m.key]||[]).some(x=>m.ids.includes(x));
    const pickedKid=(m,k)=>built?built.browse.code===k.id:(f[m.key]||[]).length===1&&f[m.key][0]===k.id;
    const whole=m=>!built&&same(f[m.key]||[],m.ids);
    const current=m=>split(m)?whole(m):picked(m);
    const available=id!==iconShelf&&f.available===false?'&available=all':'';
    const link=(m,ids)=>'#/dictionary?'+new URLSearchParams({shelf:id,[m.key]:ids.join(',')})+available+q;
    const all='<a class="nav-all ds-tab" href="#/dictionary?shelf='+id+available+q+'" data-focus="nav-all"'+(![...menus,...shortcuts].some(picked)?' aria-current="true"':'')+'>전체 보기</a>';
    // While 견본 있음 is on, a row that would open an empty list is left out; the row in use always stays.
    const pool=id!==iconShelf&&f.available!==false?builtMatches(id,built?'':state.query).map(browseEntry):null;
    const none={...f,group:[],kind:[],role:[],place:[],code:[],icon:[]};
    const filled=(key,ids)=>!pool||pool.some(e=>passes({...none,[key]:ids},e));
    const shown=m=>picked(m)||filled(m.key,m.ids);
    // 토큰은 견본이 하나뿐인 분류를 누르면 카드 한 장짜리 목록을 거치지 않고 그 토큰 상세로 바로 간다.
    const only=(key,ids)=>{ if(id!=='token'||!pool)return null; const hit=pool.filter(e=>passes({...none,[key]:ids},e)); return hit.length===1?hit[0]:null; };
    const target=(m,ids)=>{ const one=only(m.key,ids); return one?'#/system?detail='+encodeURIComponent(one.id):link(m,ids); };
    const rows=list=>list.filter(shown).map(m=>{
      const open=split(m)&&picked(m), kidsHtml=open?'<div class="nav-minor-group" role="group" aria-label="'+escape(m.name)+' 세부 분류">'+m.kids.filter(k=>pickedKid(m,k)||filled(m.key,[k.id])).map(k=>
        '<a class="nav-minor ds-tab" href="'+target(m,[k.id])+'" data-focus="nav-'+id+'-'+escape(k.id)+'" title="'+escape(k.name)+'"'+(pickedKid(m,k)?' aria-current="true"':'')+'><span>'+escape(navLabels[k.id]||k.name)+'</span></a>').join('')+'</div>':'';
      return '<a class="nav-subcategory ds-tab" href="'+(split(m)?link(m,m.ids):target(m,m.ids))+'" data-focus="nav-'+id+'-'+escape(m.id)+'" title="'+escape(m.name)+'"'+(split(m)?' aria-expanded="'+open+'"':'')+(current(m)?' aria-current="true"':'')+'><span>'+escape(m.name)+'</span>'+(split(m)?icon('chevron-down'):'')+'</a>'+kidsHtml;
    }).join('');
    const taxonomy=rows(menus);
    return '<div class="nav-subnav" role="group" aria-label="'+s.name+' 분류">'+all+'<div class="nav-subnav-scroll">'+(shortcuts.length?rows(shortcuts)+(!taxonomy?'':'<details class="nav-all-categories"'+(!built&&menus.some(picked)?' open':'')+'><summary data-focus="all-categories">모든 분류'+icon('chevron-down')+'</summary>'+taxonomy+'</details>'):taxonomy)+'</div></div>';
  }
  function builtMatches(shelf,query) {
    const found=new Set(registry.matching(query).map(e=>e.id));
    return builtInShelf(shelf).filter(i=>found.has(i.id)||(i.entry&&entries.has(i.entry)&&match(entries.get(i.entry),query)));
  }
  function shelfItems(state) {
    const shelf=state.filters.shelf;
    return {
      built:builtMatches(shelf,state.query),
      plain:[...dictionary,...data.components].filter(e=>!part(e.id)&&shelfOf(e)===shelf&&match(e,state.query))
    };
  }
  function currentItems(state) {
    const f=state.filters;
    if (state.page==='components') return data.components.filter(e=>(!f.layer.length||f.layer.includes(e.layer))&&match(e,state.query));
    const {built,plain}=shelfItems(state);
    return [...built.filter(i=>passes(f,browseEntry(i))).map(i=>({...implemented(i),...browseEntry(i),implementation:true})), ...(f.available?[]:plain.filter(e=>passes(f,e)))];
  }
  function suggestions(state,query,limit=6) {
    // Suggestions jump anywhere in the current tab, so picked filters do not narrow them.
    const whole=readFilters(state.page,new URLSearchParams(state.page==='dictionary'?'shelf='+state.filters.shelf:''));
    whole.available=false;
    return currentItems({...state,filters:whole,query}).slice(0,limit);
  }
  function searchAll(query,limit=6) {
    const found=new Set(registry.matching(query).map(i=>i.id));
    return [...registry.items.filter(i=>found.has(i.id)||(i.entry&&entries.has(i.entry)&&match(entries.get(i.entry),query))).map(i=>({...implemented(i),...browseEntry(i)})),...dictionary.filter(e=>!part(e.id)&&match(e,query))].slice(0,limit);
  }
  function entryCard(state,e) {
    const label=data.layers.find(l=>l.id===e.layer).english;
    return '<button class="catalog-tile entry-tile ds-surface" data-library-entry="'+e.id+'" data-focus="entry-'+e.id+'"><span class="record-code ds-badge">'+label+'</span><h3>'+escape(e.name)+'</h3>'+window.Pattove.references.label(e.id)+'<span class="tile-foot">'+escape(e.kind||'')+icon('arrow')+'</span></button>';
  }
  // The industry name sits under the dictionary name so a tile is recognised by the word people say (햄버거 메뉴, 페이지네이션).
  const termLine=e=>{
    const alias=e.term?.match(/^(.+?)\s*\(([^)]+)\)$/);
    const term=alias?.[1].trim()===e.name.trim()?alias[2]:e.term;
    return term?'<small class="dict-term">'+escape(term)+'</small>':'';
  };
  function dictEntry(state,e) {
    if (e.art) return '<div class="dict-entry ds-surface is-illustrated" data-illustration-id="'+escape(e.id)+'"><button class="illustration-open" data-library-entry="'+escape(e.id)+'" data-focus="entry-'+escape(e.id)+'" title="'+escape(e.name+(e.term?' · '+e.term:''))+'"><span class="dict-thumb">'+illustration(e)+'</span><strong>'+escape(short(e.name))+'</strong></button>'+window.Pattove.illustrationTools.checkbox(e.id,short(e.name))+'</div>';
    if (isGuideline(e)) return '<button class="dict-entry ds-surface is-guideline" data-library-entry="'+e.id+'" data-focus="entry-'+e.id+'"><span class="guideline-label">사용 기준</span><strong>'+escape(short(e.name))+'</strong><span class="guideline-summary">'+escape(e.usage)+'</span></button>';
    if (e.implementation) {
      const label=({'clear-input':'지우기 버튼','unit-input':'단위 입력','stepper':'스테퍼'})[e.id]||e.name;
      return '<div class="dict-entry ds-surface is-built"><span class="dict-thumb atlas-preview" inert aria-hidden="true">'+(['template','page'].includes(e.id)?window.Pattove.componentDocs.live(e.id,window.Pattove.componentDocs.defaults(e.id),views.previewStyle(state),'thumb-'+e.id):sample(e,views.previewStyle(state),'thumb-'+e.id))+'</span><button class="dict-hit" data-library-entry="'+e.id+'" data-focus="entry-'+e.id+'" title="'+escape(e.name+(e.term?' · '+e.term:''))+'"><strong>'+escape(label)+'</strong></button></div>';
    }
    // On a family-sorted shelf the family is the filter, so the tile keeps the whole name (색 — primary), not just 색.
    const kind=e.kind||'기준', label=byName(shelfOf(e))?e.name:short(e.name);
    return '<button class="dict-entry ds-surface is-todo" data-library-entry="'+e.id+'" data-focus="entry-'+e.id+'" data-kind="'+escape(kind)+'" title="'+escape(e.name+(e.term?' · '+e.term:''))+'"><span class="dict-thumb">'+todoArt('dict-todo')+'</span><strong>'+escape(label)+'</strong>'+termLine(e)+'</button>';
  }
  // Long shelves are cut into numbered pages. The icon shelf holds thousands of square tiles, so its page is a little longer.
  const pageSize=state=>state.page==='dictionary'&&state.filters.shelf===iconShelf?72:48;
  function paging(state,total) {
    const size=pageSize(state), pages=Math.max(1,Math.ceil(total/size));
    return {size,pages,total,n:Math.min(Math.max(1,state.pageNo||1),pages)};
  }
  const pageCount=state=>paging(state,currentItems(state).length).pages;
  // 1 … 4 5 6 … 30: the ends and the neighbours of the current page; a gap of one number is written out, longer gaps become an ellipsis.
  // On phones the numbers give way to a single "n / total" so the row still fits (see .page-status).
  function pageNumbers(n,pages) {
    const keep=new Set([1,pages,n-1,n,n+1]);
    if (n<=3) for (let i=1;i<=4;i++) keep.add(i);
    if (n>=pages-2) for (let i=pages-3;i<=pages;i++) keep.add(i);
    const seq=[...keep].filter(i=>i>=1&&i<=pages).sort((x,y)=>x-y), out=[];
    seq.forEach((i,at)=>{
      const prev=seq[at-1];
      if (prev&&i-prev===2) out.push(prev+1);
      else if (prev&&i-prev>2) out.push('…');
      out.push(i);
    });
    return out;
  }
  function pagination(state,{n,pages,total}) {
    if (pages<=1) return '';
    const step=(to,label,name)=>'<button type="button" class="page-step ds-button" data-variant="outline" data-size="sm" data-icon-only data-page-go="'+to+'" data-focus="page-'+label+'" aria-label="'+label+'" title="'+label+'"'+(to<1||to>pages||to===n?' disabled':'')+'>'+icon(name)+'</button>';
    const numbers=pageNumbers(n,pages).map(i=>i==='…'?'<span class="page-gap" aria-hidden="true">…</span>'
      :'<button type="button" class="page-num ds-button'+(i===n?' is-current':'')+'" data-page-go="'+i+'" data-focus="page-'+i+'"'+(i===n?' aria-current="true"':'')+' data-size="sm" data-variant="'+(i===n?'primary':'outline')+'" aria-label="'+i+'쪽">'+i+'</button>').join('');
    const jump=pages>7?'<form class="page-jump" data-page-jump novalidate><label><span class="sr-only">이동할 쪽</span><input class="ds-input" type="number" inputmode="numeric" min="1" max="'+pages+'" placeholder="'+n+'" data-focus="page-jump"></label><span class="page-total">/ '+pages+'</span><button type="submit" class="secondary ds-button" data-variant="outline" data-size="sm" data-icon-only data-focus="page-jump-go" aria-label="입력한 쪽으로 이동" title="입력한 쪽으로 이동">'+icon('arrow')+'</button></form>':'';
    return '<nav class="pagination" aria-label="쪽 이동"><span class="page-count">'+total.toLocaleString('ko-KR')+'개</span>'+
      '<div class="page-list">'+step(n-1,'이전','chevron-left')+numbers+'<span class="page-status" aria-label="'+pages+'쪽 중 '+n+'쪽">'+n+' / '+pages+'</span>'+step(n+1,'다음','chevron')+'</div>'+jump+'</nav>';
  }
  // A search keeps 견본 있음 on; the matches without a specimen wait after the results, one press away.
  function unbuilt(state) {
    const f=state.filters;
    if (state.page!=='dictionary'||f.shelf===iconShelf||!f.available||!state.query) return '';
    const count=shelfItems(state).plain.filter(e=>passes(f,e)).length;
    return count?'<div class="empty-state unbuilt-more"><button type="button" class="ds-button" data-variant="outline" data-action="show-unbuilt" data-focus="show-unbuilt">미구현 항목 '+count.toLocaleString('ko-KR')+'개도 보기</button></div>':'';
  }
  // The tabs and the left tree say where you are; main carries only pictures.
  function collectionControls(state) {
    if (state.page!=='dictionary') return '';
    if (state.filters.shelf===iconShelf) {
      const items=currentItems(state),page=paging(state,items.length);
      return window.Pattove.illustrationTools.toolbar(data.iconGroups,items.slice((page.n-1)*page.size,page.n*page.size).filter(e=>e.art).map(e=>e.id));
    }
    return '<button type="button" class="specimen-filter" role="switch" aria-checked="'+state.filters.available+'" data-action="toggle-specimens" data-focus="specimen-filter">견본 있음<span class="specimen-filter-track" aria-hidden="true"></span></button>';
  }
  function collection(state) {
    const items=currentItems(state);
    const page=paging(state,items.length), shown=items.slice((page.n-1)*page.size,page.n*page.size);
    if (!items.length) return '<section aria-labelledby="page-title">'+views.emptyState(state)+unbuilt(state)+'</section>';
    if (state.page==='components') return '<section aria-labelledby="page-title"><div class="catalog-grid">'+shown.map(e=>entryCard(state,e)).join('')+'</div>'+pagination(state,page)+'</section>';
    const tools=state.filters.shelf===iconShelf?window.Pattove.illustrationTools.selectionBar():'';
    return '<section class="atlas dict" data-shelf="'+state.filters.shelf+'" aria-labelledby="page-title"><div class="dict-grid dict-entries">'+shown.map(e=>dictEntry(state,e)).join('')+'</div>'+(page.n===page.pages?unbuilt(state):'')+tools+pagination(state,page)+'</section>';
  }
  function iconDetail(e) {
    const format=window.Pattove.illustrationTools.format();
    return `<article class="icon-detail"><header class="icon-detail-heading"><div><h2 id="detail-title" tabindex="-1">${escape(short(e.name))}</h2><p>${escape(iconGroups.get(e.sub)?.name || '일러스트 아이콘')}</p></div><button type="button" class="icon-detail-close" data-action="close-dialog" aria-label="상세 닫기">${icon('close')}</button></header><div class="icon-detail-body"><div class="icon-detail-preview">${illustration(e,true)}</div><div class="icon-detail-actions"><p class="icon-detail-description">${escape(e.usage || '')}</p><p class="icon-detail-meta">${e.art.width} × ${e.art.height}<span>투명 배경</span></p><div class="icon-download-row"><select data-icon-format aria-label="다운로드 파일 형식"><option value="png"${format==='png'?' selected':''}>PNG</option><option value="webp"${format==='webp'?' selected':''}>WebP</option></select><a class="icon-download" data-icon-download data-png="${escape(e.art.png)}" data-webp="${escape(e.art.src)}" data-id="${escape(e.id)}" data-file="${escape(fileName(e))}" href="${escape(format==='png'?e.art.png:e.art.src)}" download="${escape(fileName(e))}.${format}" aria-label="${format==='png'?'PNG':'WebP'} 다운로드">${icon('download')}다운로드</a></div>${window.Pattove.illustrationTools.pick(e.id,true)}</div></div><footer class="icon-detail-footer"><details class="icon-file-info"><summary>파일 정보</summary><dl><dt>식별자</dt><dd>${escape(e.id)}</dd><dt>크기</dt><dd>${e.art.width} × ${e.art.height} px</dd><dt>파일</dt><dd>PNG · WebP</dd></dl>${e.glyph?.length?`<h3>참고 출처</h3><ul>${e.glyph.map(g=>`<li><code>${escape(g)}</code><span>${escape(glyphSource(g))}</span></li>`).join('')}</ul>`:''}</details><div class="icon-reference">${window.Pattove.references.control(e.id,true).replace('<span>복사</span>','<span>AI용 정보 복사</span>')}</div></footer></article>`;
  }
  function detail(state) {
    // A hierarchy component opened from the 토큰 shelf reads like its components-page record.
    const e=state.page==='dictionary'&&entries.get(state.detail)||components.get(state.detail);
    if(e.art)return iconDetail(e);
    const motionExamples=(window.Pattove.motionData?.items || []).filter(item=>item.dictionaryRefs?.includes(e.id));
    const motionLinks=motionExamples.length?'<section class="motion-related-record"><h3>움직임 보기</h3><div class="motion-related">'+motionExamples.map(item=>'<a href="#/motion?detail='+item.id+'">'+escape(item.name)+'</a>').join('')+'</div></section>':'';
    const dict=!!e.category, category=dict?null:data.layers.find(l=>l.id===e.layer);
    const downloadIcon=icon('download');
    return '<header class="dialog-header"><div><span class="dialog-category">'+escape(dict?[shelves.get(shelfOf(e))?.name,e.sub?'':short(categoryById.get(e.category)?.name||''),places.get(placeOf.get(e.category))?.name,iconGroups.get(e.sub)?.name].filter(Boolean).join(' · '):category.english)+'</span><h2 id="detail-title" tabindex="-1">'+escape(e.name)+'</h2>'+(e.term?'<p class="detail-term"><span>통용 용어</span>'+escape(e.term)+'</p>':'')+window.Pattove.references.control(e.id)+'</div><button class="icon-button ds-button" data-variant="outline" data-icon-only data-action="close-dialog" aria-label="상세 닫기">'+icon('close')+'</button></header>'+
      (dict?(e.art?'<div class="detail-art illustrated-detail">'+illustration(e,true)+'</div><div class="illustrated-downloads"><p>'+escape(e.usage||'')+'</p><a class="secondary ds-button" data-variant="outline" href="'+escape(e.art.png)+'" download="'+escape(fileName(e))+'.png" aria-label="PNG 다운로드" title="PNG 다운로드">'+downloadIcon+'<span>PNG</span></a><a class="secondary ds-button" data-variant="outline" href="'+escape(e.art.src)+'" download="'+escape(fileName(e))+'.webp" aria-label="WebP 다운로드" title="WebP 다운로드">'+downloadIcon+'<span>WebP</span></a>'+window.Pattove.illustrationTools.pick(e.id)+'</div>':isGuideline(e)?motionLinks:motionExamples.length?motionLinks:'<div class="detail-art is-todo">'+todoArt('detail-todo')+'<p>'+(e.glyph?'아직 그리지 않았어요':'아직 견본이 없어요')+'</p></div>')
        +(!e.art&&e.usage?'<div class="record-detail"><p class="record-kind">'+escape(e.id)+' · '+escape(e.kind)+'</p><section><h3>쓰임</h3><p>'+escape(e.usage)+'</p></section></div>':'')
        +(e.glyph?'<section class="glyph-ref"><h3>참고 출처</h3><ul class="glyph-keys">'+e.glyph.map(g=>'<li><code>'+escape(g)+'</code><span>'+escape(glyphSource(g))+'</span></li>').join('')+'</ul></section>':'')
        :'<div class="record-detail"><p class="record-kind">'+escape(category.name)+'</p><section><h3>대표 항목</h3><p>'+escape(e.examples)+'</p></section></div>');
  }
  window.Pattove.libraryUI={
    pages,navigation,subnavigation,pageCount,pagination,readFilters,writeFilters,collection,collectionControls,detail,currentItems,suggestions,searchAll,
    validDetail:(page,id)=>components.has(id)||(page==='dictionary'&&(entries.has(id)||registry.index.has(id))),
    suggestionGroup:(page,e)=>page==='dictionary'?(e.term?e.term+' · ':'')+(e.art?'일러스트 아이콘 · '+iconGroups.get(e.sub).name:isGuideline(e)?'사용 기준':e.implementation?'구현 · '+e.layer:'미구현 · '+shelves.get(shelfOf(e))?.name+' · '+(e.sub?iconGroups.get(e.sub).name:e.category?short(categoryById.get(e.category)?.name||''):kindOf(e))):data.layers.find(l=>l.id===e.layer).name,
    sample,itemShelf,
    shelfFor:state=>shelves.get(state.page==='system'?itemShelf(registry.index.get(state.detail)):state.filters.shelf)
  };
})();
