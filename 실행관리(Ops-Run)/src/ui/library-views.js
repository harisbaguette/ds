(() => {
  const { library: data, views, previews } = window.Pattove;
  const { escape } = views, { icon } = previews;
  // Every installed icon picture is on the icon tab: the ones a meaning entry points at show through that entry, the rest as 세트 그림 of their own.
  // An icon lives in one home category (sub) and may also show in up to two more (also), the way Font Awesome and Lucide list one icon under several categories.
  const iconShelf=data.shelves.find(s=>s.codes?.includes('ICO'))?.id;
  const glyphSets=new Map(data.glyphSets.map(s=>[s.id,s]));
  const glyphName=new Map(data.glyphs.map(([key,name])=>[key,name]));
  const linked=new Set(data.entries.flatMap(e=>e.glyph||[]));
  const dictionary=[...data.entries,...data.glyphs.filter(([key])=>!linked.has(key)).map(([key,name,sub,also])=>({id:key,name,kind:'세트 그림',category:'ICO',sub,...(also&&{also}),shelf:iconShelf,glyph:[key]}))];
  const iconCats=e=>e.sub?[e.sub,...(e.also||[])]:[];
  const entries=new Map(dictionary.map(e=>[e.id,e]));
  const components=new Map(data.components.map(e=>[e.id,e]));
  const pages=['dictionary','components'];
  const searches=new Map([...dictionary,...data.components].map(e=>[e.id,[e.id,e.name,e.usage,e.examples,e.kind,...(e.glyph||[]).map(g=>g+' '+(glyphName.get(g)||''))].filter(Boolean).join(' ').toLocaleLowerCase()]));
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
  // These groups contain working specimens. The shelf itself still includes the complete dictionary.
  const partGroups=[
    {id:'buttons',name:'버튼',items:['button']},
    {id:'fields',name:'입력',items:['input','field']},
    {id:'selection',name:'선택',items:['checkbox','radio','switch']},
    {id:'navigation',name:'탐색',items:['tabs','bottom-nav']},
    {id:'display',name:'표시',items:['icon','divider','status-dot','badge','card']},
    {id:'feedback',name:'피드백',items:['feedback']}
  ];
  const builtInShelf=shelf=>registry.items.filter(i=>itemShelf(i)===shelf).sort((a,b)=>browseSections.indexOf(a.section)-browseSections.indexOf(b.section));
  // Implementations own their browsing metadata; a missing dictionary link never changes their category.
  const browseEntry=item=>({...entries.get(item.entry),id:item.id,name:item.name,shelf:item.browse.shelf,kind:item.browse.kind,category:item.browse.code});
  const inShelf=new Map(), bump=key=>inShelf.set(key,(inShelf.get(key)||0)+1);
  for (const e of dictionary) { bump(e.shelf+'|'+e.category); for (const sub of iconCats(e)) bump(e.shelf+'|ICO.'+sub); }
  for (const item of registry.items) bump(itemShelf(item)+'|'+item.browse.code);
  const short=name=>String(name).split(' — ')[0];
  // A shelf with no kinds (토큰) sorts by the family named before " — " (색, 글자, 간격 …); a family of one or a bare name reads as 기타,
  // and the hierarchy components on that shelf share one 묶음 kind.
  const byName=id=>!shelves.get(id)?.kinds.length;
  const family=e=>e.name.includes(' — ')?short(e.name):'';
  const families=new Map();
  for (const e of data.entries) if (byName(shelfOf(e))) families.set(family(e),(families.get(family(e))||0)+1);
  const kindOf=e=>registry.index.has(e.id)?registry.index.get(e.id).browse.kind:!e.category?shelves.get(shelfOf(e))?.name+' 묶음':!byName(shelfOf(e))?e.kind:family(e)&&families.get(family(e))>1?family(e):'기타';
  const shelfKinds=new Map(data.shelves.map(s=>[s.id,[...new Set([...(s.kinds.length?s.kinds:[...data.entries,...data.components].filter(e=>shelfOf(e)===s.id).map(kindOf)),...registry.items.filter(i=>itemShelf(i)===s.id).map(i=>i.browse.kind)])]
    .sort((x,y)=>(x==='기타')-(y==='기타')||0)]));
  // An entry with no built sample shows only that it is not built yet — a drawn stand-in or a borrowed icon-set picture would read as the finished thing.
  // The icons are drawn later by the operator, so the borrowed set picture stays only in the detail, labeled as a reference.
  const todoArt=cls=>'<span class="'+cls+'">미구현</span>';
  // A picture is drawn from its set's sprite (stroke or fill paint, per set); an emoji key is the character itself.
  function glyphArt(key, cls) {
    const at=key.indexOf(':'), set=key.slice(0,at), name=key.slice(at+1);
    if (set==='emoji') return '<span class="'+cls+' is-emoji" aria-hidden="true">'+escape(name)+'</span>';
    return '<svg class="'+cls+' paint-'+glyphSets.get(set).paint+'" aria-hidden="true" data-src="assets/icons/sets/'+set+'.svg"><use href="assets/icons/sets/'+set+'.svg#'+escape(name)+'"/></svg>';
  }
  const glyphSource=key=>{ const s=glyphSets.get(key.slice(0,key.indexOf(':'))); return s?s.name+' '+s.version+' · '+s.license:'유니코드 이모지'; };
  function sample(item, style = 'main', prefix = 'atlas') {
    const p = window.Pattove.parts;
    const body = item.id === 'button' ? p.button({label:'계속하기'}) + p.button({label:'취소',variant:'outline'}) + p.button({label:'검색',iconName:'search',iconOnly:true})
      : item.id === 'icon' ? ['search','arrow','bookmark','grid','close','check','folder','bell'].map(p.icon).join('')
      : item.id === 'input' ? '<label class="ds-field">이름'+p.input({id:prefix,placeholder:'이름을 입력하세요'})+'</label>'
      : p.renderItem(item.id, prefix);
    const fitted=['bottom-nav','card','search-module'].includes(item.id);
    return '<div class="atlas-sample ds theme-'+style+'" data-style="'+style+'" data-kind="'+item.id+'"'+(fitted?' data-preview-scene data-preview-fit="both"':'')+'>'+body+'</div>';
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
    for (const [key,value] of Object.entries(f)) if (Array.isArray(value)&&value.length) params.set(key,value.join(','));
  }
  const passes=(f,e)=>(!f.group?.length||f.group.some(id=>partGroups.find(g=>g.id===id)?.items.includes(e.id)))
    &&(!f.kind.length||f.kind.includes(kindOf(e)))
    &&(!(f.role.length||f.place.length)||f.role.includes(roleOf.get(e.category))||f.place.includes(placeOf.get(e.category)))
    &&(!f.code.length||f.code.includes(e.category))
    &&(!f.icon.length||e.category!=='ICO'||iconCats(e).some(sub=>f.icon.includes(sub)));

  const activeShelf=state=>state.page==='system'?itemShelf(registry.index.get(state.detail)):state.page==='dictionary'?state.filters.shelf:null;
  const querySuffix=state=>state.query&&['dictionary','system'].includes(state.page)?'&q='+encodeURIComponent(state.query):'';
  // The top bar changes shelves; the left rail only navigates inside the current shelf.
  function navigation(state) {
    const open=activeShelf(state), q=querySuffix(state);
    return ['token','icon','part','block','template'].map(id=>{
      const s=shelves.get(id);
      return '<a class="nav-shelf-link" href="#/dictionary?shelf='+id+q+'" data-focus="tab-'+id+'"'+(open===id?' aria-current="page"':'')+'><span>'+s.name+'</span></a>';
    }).join('');
  }
  function subnavigation(state) {
    const id=activeShelf(state);
    if (!id) return '';
    const s=shelves.get(id), f=state.filters, q=querySuffix(state);
    const built=state.page==='system'&&registry.index.get(state.detail);
    const options=id==='part'?partGroups.map(g=>({key:'group',id:g.id,name:g.name}))
      :id==='icon'?data.iconGroups.map(g=>({key:'icon',id:g.id,name:g.name}))
      :['token','template'].includes(id)?shelfKinds.get(id).map(k=>({key:'kind',id:k,name:k}))
      :data.categories.filter(c=>inShelf.has(id+'|'+c.id)).map(c=>({key:'code',id:c.id,name:short(c.name)}));
    const selected=o=>built?o.key==='group'?partGroups.find(g=>g.id===o.id).items.includes(built.id):o.key==='kind'?built.browse.kind===o.id:o.key==='code'&&built.browse.code===o.id:f[o.key]?.includes(o.id);
    const all='<a class="nav-all" href="#/dictionary?shelf='+id+q+'" data-focus="nav-all"'+(!options.some(selected)?' aria-current="page"':'')+'>전체 보기</a>';
    return '<div class="nav-subnav" role="group" aria-label="'+s.name+' 분류">'+all+'<div class="nav-subnav-scroll">'+options.map(o=>
      '<a class="nav-subcategory" href="#/dictionary?'+new URLSearchParams({shelf:id,[o.key]:o.id})+q+'" data-focus="nav-'+id+'-'+escape(o.id)+'" title="'+escape(o.name)+'"'+(selected(o)?' aria-current="true"':'')+'><span>'+escape(o.name)+'</span></a>'
    ).join('')+'</div></div>';
  }
  function shelfItems(state) {
    const shelf=state.filters.shelf, found=new Set(registry.matching(state.query).map(e=>e.id));
    return {
      built:builtInShelf(shelf).filter(i=>found.has(i.id)||(i.entry&&match(entries.get(i.entry),state.query))),
      plain:[...dictionary,...data.components].filter(e=>!part(e.id)&&shelfOf(e)===shelf&&match(e,state.query))
    };
  }
  function currentItems(state) {
    const f=state.filters;
    if (state.page==='components') return data.components.filter(e=>(!f.layer.length||f.layer.includes(e.layer))&&match(e,state.query));
    const {built,plain}=shelfItems(state);
    return [...built.filter(i=>passes(f,browseEntry(i))).map(i=>({...implemented(i),...browseEntry(i),implementation:true})), ...plain.filter(e=>passes(f,e))];
  }
  function suggestions(state,query) {
    // Suggestions jump anywhere in the current tab, so picked filters do not narrow them.
    const whole=readFilters(state.page,new URLSearchParams(state.page==='dictionary'?'shelf='+state.filters.shelf:''));
    return currentItems({...state,filters:whole,query}).slice(0,6);
  }
  function searchAll(query) {
    return [...registry.matching(query).map(i=>({...implemented(i),...browseEntry(i)})),...dictionary.filter(e=>!part(e.id)&&match(e,query))].slice(0,6);
  }
  function entryCard(state,e) {
    const label=data.layers.find(l=>l.id===e.layer).english;
    return '<button class="catalog-tile entry-tile" data-library-entry="'+e.id+'" data-focus="entry-'+e.id+'"><span class="record-code">'+label+'</span><h3>'+escape(e.name)+'</h3><span class="tile-foot">'+escape(e.kind||'')+icon('arrow')+'</span></button>';
  }
  function dictEntry(state,e) {
    if (e.implementation) return '<div class="dict-entry is-built"><span class="dict-thumb atlas-preview" inert aria-hidden="true">'+(['template','page'].includes(e.id)?window.Pattove.componentDocs.live(e.id,{},state.style,'thumb-'+e.id):sample(e,state.style,'thumb-'+e.id))+'</span><button class="dict-hit" data-library-entry="'+e.id+'" data-focus="entry-'+e.id+'"><strong>'+escape(e.name)+'</strong></button></div>';
    // On a family-sorted shelf the family is the filter, so the tile keeps the whole name (색 — primary), not just 색.
    const kind=e.kind||'기준', label=byName(shelfOf(e))?e.name:short(e.name);
    return '<button class="dict-entry is-todo" data-library-entry="'+e.id+'" data-focus="entry-'+e.id+'" data-kind="'+escape(kind)+'" title="'+escape(e.name)+'"><span class="dict-thumb">'+todoArt('dict-todo')+'</span><strong>'+escape(label)+'</strong></button>';
  }
  const empty='<div class="empty-state"><span class="empty-generated nav-sprite nav-sprite-search" aria-hidden="true"></span><h2>일치하는 항목이 없어요</h2><button class="secondary" data-action="clear-filters" data-focus="empty-clear">전체 보기</button></div>';
  const more=(shown,total)=>total>shown?'<div class="load-more"><button class="secondary" data-action="load-more" data-focus="load-more">더 보기 <span>'+shown+' / '+total+'</span></button></div>':'';
  // The tabs and the left rail say where you are; main carries only pictures.
  function collection(state) {
    const items=currentItems(state);
    if (!items.length) return '<section aria-labelledby="page-title">'+empty+'</section>';
    if (state.page==='components') return '<section aria-labelledby="page-title"><div class="catalog-grid">'+items.slice(0,state.limit).map(e=>entryCard(state,e)).join('')+'</div>'+more(Math.min(state.limit,items.length),items.length)+'</section>';
    const built=items.filter(e=>e.implementation), rest=items.filter(e=>!e.implementation);
    return '<section class="atlas dict" data-shelf="'+state.filters.shelf+'" aria-labelledby="page-title"><div class="dict-grid dict-entries">'+built.map(e=>dictEntry(state,e)).join('')+rest.slice(0,state.limit).map(e=>dictEntry(state,e)).join('')+'</div>'+more(state.limit,rest.length)+'</section>';
  }
  function detail(state) {
    // A hierarchy component opened from the 토큰 shelf reads like its components-page record.
    const e=state.page==='dictionary'&&entries.get(state.detail)||components.get(state.detail);
    const dict=!!e.category, category=dict?null:data.layers.find(l=>l.id===e.layer);
    // An unbuilt entry says so; an icon then lists the borrowed set pictures it stands in for, with their keys and sources.
    return '<header class="dialog-header"><div><span class="dialog-category">'+escape(dict?[shelves.get(shelfOf(e))?.name,e.sub?'':short(categoryById.get(e.category)?.name||''),places.get(placeOf.get(e.category))?.name,iconGroups.get(e.sub)?.name].filter(Boolean).join(' · '):category.english)+'</span><h2 id="detail-title" tabindex="-1">'+escape(e.name)+'</h2></div><button class="icon-button" data-action="close-dialog" aria-label="상세 닫기">'+icon('close')+'</button></header>'+
      (dict?'<div class="detail-art is-todo">'+todoArt('detail-todo')+'<p>'+(e.glyph?'아직 그리지 않았어요':'아직 견본이 없어요')+'</p></div>'
        +(e.glyph?'<section class="glyph-ref"><h3>참고로 빌려 온 그림</h3><ul class="glyph-keys">'+e.glyph.map(g=>'<li>'+glyphArt(g,'glyph-mini')+'<code>'+escape(g)+'</code><span>'+escape(glyphSource(g))+'</span></li>').join('')+'</ul></section>':'')
        :'<div class="record-detail"><p class="record-kind">'+escape(category.name)+'</p><section><h3>대표 항목</h3><p>'+escape(e.examples)+'</p></section></div>');
  }
  window.Pattove.libraryUI={
    pages,navigation,subnavigation,readFilters,writeFilters,collection,detail,currentItems,suggestions,searchAll,
    validDetail:(page,id)=>components.has(id)||(page==='dictionary'&&(entries.has(id)||registry.index.has(id))),
    suggestionGroup:(page,e)=>page==='dictionary'?(e.implementation?'구현 · '+e.layer:'미구현 · '+shelves.get(shelfOf(e))?.name+' · '+(e.sub?iconGroups.get(e.sub).name:e.category?short(categoryById.get(e.category)?.name||''):kindOf(e))):data.layers.find(l=>l.id===e.layer).name,
    sample,itemShelf,
    shelfFor:state=>shelves.get(state.page==='system'?itemShelf(registry.index.get(state.detail)):state.filters.shelf),
    peers:id=>builtInShelf(itemShelf(registry.index.get(id)))
  };
})();
