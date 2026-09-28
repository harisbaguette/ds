(() => {
  const { library: data, views, previews } = window.Pattove;
  const { escape } = views, { icon } = previews;
  const entries=new Map(data.entries.map(e=>[e.id,e]));
  const components=new Map(data.components.map(e=>[e.id,e]));
  const pages=['dictionary','components'];
  const searches=new Map([...data.entries,...data.components].map(e=>[e.id,[e.id,e.name,e.usage,e.examples,e.kind].filter(Boolean).join(' ').toLocaleLowerCase()]));
  const registry = window.Pattove.systemRegistry;
  const part = id => registry.index.get(id) || registry.items.find(item => item.entry === id);
  const implemented = e => ({ ...e, usage:e.purpose, category:e.section, kind:e.layer, implementation:true });
  // The shelves (부품 → 블록 → 템플릿 by kind, then 아이콘 as its own library) are the header tabs. Each entry carries its shelf from the build.
  // Inside a tab the filter bar narrows by kind, role group or 분야 (one "area" facet, since the two split the categories between them),
  // source category and, in the icon tab, icon category: OR inside a facet, AND across facets.
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
  const iconShelf=data.shelves.find(s=>s.codes?.includes('ICO'))?.id;
  const itemShelf=item=>item.entry?entries.get(item.entry).shelf:['Template','Page'].includes(item.layer)?'template':item.layer==='Module'?'block':'part';
  const inShelf=new Map(), bump=key=>inShelf.set(key,(inShelf.get(key)||0)+1);
  for (const e of data.entries) { bump(e.shelf+'|'+e.category); if (e.sub) bump(e.shelf+'|ICO.'+e.sub); }
  const short=name=>String(name).split(' — ')[0];
  const kindArt={
    부품:'<rect x="16" y="26" width="54" height="20" rx="10" class="k-fill"/><rect x="80" y="28" width="26" height="16" rx="8"/><circle cx="98" cy="36" r="4.5" class="k-ink"/>',
    모듈:'<rect x="34" y="8" width="52" height="56" rx="7"/><rect x="40" y="14" width="40" height="20" rx="4" class="k-fill"/><path d="M40 43h28M40 51h18"/>',
    구성:'<rect x="16" y="8" width="88" height="56" rx="6"/><path d="M16 20h88M40 20v44"/><rect x="48" y="28" width="22" height="14" rx="3" class="k-fill"/><rect x="76" y="28" width="22" height="14" rx="3"/><rect x="48" y="47" width="50" height="9" rx="3"/>',
    흐름:'<rect x="8" y="20" width="24" height="32" rx="4"/><rect x="48" y="20" width="24" height="32" rx="4" class="k-fill"/><rect x="88" y="20" width="24" height="32" rx="4"/><path d="M35 36h9m-3-3 3 3-3 3M75 36h9m-3-3 3 3-3 3"/>',
    기준:'<rect x="18" y="14" width="16" height="16" rx="4" class="k-ink"/><rect x="40" y="14" width="16" height="16" rx="4"/><rect x="62" y="14" width="16" height="16" rx="4" class="k-fill"/><rect x="84" y="14" width="16" height="16" rx="4" class="k-soft"/><path d="M18 50h82M18 45v10M38.5 47v6M59 45v10M79.5 47v6M100 45v10"/>'
  };
  const kindSvg=kind=>'<svg viewBox="0 0 120 72" class="dict-kind-art" aria-hidden="true" data-src="self:diagram">'+(kindArt[kind]||kindArt.모듈)+'</svg>';
  function sample(item, style = 'main', prefix = 'atlas') {
    const p = window.Pattove.parts;
    const body = item.id === 'button' ? p.button({label:'계속하기'}) + p.button({label:'취소',variant:'outline'}) + p.button({label:'검색',iconName:'search',iconOnly:true})
      : item.id === 'icon' ? ['search','arrow','bookmark','grid','close','check','folder','bell'].map(p.icon).join('')
      : item.id === 'input' ? '<label class="ds-field">이름'+p.input({id:prefix,placeholder:'이름을 입력하세요'})+'</label>'
      : p.renderItem(item.id, prefix);
    return '<div class="atlas-sample ds theme-'+style+'" data-style="'+style+'" data-kind="'+item.id+'">'+body+'</div>';
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
    const detail=entries.get(params.get('detail'));
    const code=[...new Set(list(params.get('code')).concat(categoryById.has(oldKey)?[oldKey]:[]))].filter(id=>categoryById.has(id));
    const wanted=params.get('shelf');
    const shelf=shelves.has(wanted)?wanted:legacyShelf||(detail?detail.shelf:code.length?homeShelf(code[0]):'part');
    return {
      shelf,
      kind:list(params.get('kind')).filter(k=>shelves.get(shelf).kinds.includes(k)),
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
  const active=f=>['kind','role','place','code','icon'].some(k=>f[k].length);
  // skip leaves one facet out, so each option counts what it would show if pressed.
  const passes=(f,e,skip)=>(skip==='kind'||!f.kind.length||f.kind.includes(e.kind))
    &&(skip==='area'||!(f.role.length||f.place.length)||f.role.includes(roleOf.get(e.category))||f.place.includes(placeOf.get(e.category)))
    &&(skip==='code'||!f.code.length||f.code.includes(e.category))
    &&(skip==='icon'||!f.icon.length||e.category!=='ICO'||f.icon.includes(e.sub));

  // Header tabs = the shelves, then 스타일. Built parts open on the system page, which belongs to 부품. A search stays across tabs.
  function navigation(state) {
    const open=state.page==='system'?'part':state.page==='dictionary'?state.filters.shelf:null;
    const q=state.query&&['dictionary','system'].includes(state.page)?'&q='+encodeURIComponent(state.query):'';
    const tab=(href,focus,name,art,current)=>'<a href="'+href+'" data-focus="'+focus+'"'+(current?' aria-current="page"':'')+'>'+art+'<span>'+escape(name)+'</span></a>';
    return data.shelves.map(s=>tab('#/dictionary?shelf='+s.id+q,'tab-'+s.id,s.name,icon(s.icon),open===s.id)).join('')+
      tab('#/styles','page-styles','스타일',icon('layers'),['styles','patterns'].includes(state.page));
  }
  function shelfItems(state) {
    const shelf=state.filters.shelf, found=new Set(registry.matching(state.query).map(e=>e.id));
    return {
      built:registry.items.filter(i=>itemShelf(i)===shelf&&(found.has(i.id)||(i.entry&&match(entries.get(i.entry),state.query)))),
      plain:data.entries.filter(e=>!part(e.id)&&e.shelf===shelf&&match(e,state.query))
    };
  }
  function currentItems(state) {
    const f=state.filters;
    if (state.page==='components') return data.components.filter(e=>(!f.layer.length||f.layer.includes(e.layer))&&match(e,state.query));
    const {built,plain}=shelfItems(state);
    // A built part with no dictionary entry has no facets, so it shows only while nothing is pressed.
    return [...built.filter(i=>i.entry?passes(f,entries.get(i.entry)):!active(f)).map(implemented), ...plain.filter(e=>passes(f,e))];
  }
  function filters(state) {
    const f=state.filters;
    if (state.page==='components') {
      const options=data.layers.map(l=>({key:'layer',id:l.id,name:l.name,pressed:f.layer.includes(l.id),count:data.components.filter(e=>e.layer===l.id&&match(e,state.query)).length}));
      return views.filterBar([{key:'layer',label:'계층',options}]);
    }
    const {built,plain}=shelfItems(state);
    const pool=[...built.filter(i=>i.entry).map(i=>entries.get(i.entry)),...plain];
    const tallyBy=(skip,key)=>{ const m=new Map(); for (const e of pool) if (passes(f,e,skip)) { const k=key(e); if (k) m.set(k,(m.get(k)||0)+1); } return m; };
    const kinds=tallyBy('kind',e=>e.kind), area=tallyBy('area',e=>e.category), codes=tallyBy('code',e=>e.category), icons=tallyBy('icon',e=>e.category==='ICO'&&e.sub);
    const sum=cs=>cs.reduce((n,c)=>n+(area.get(c)||0),0);
    const here=code=>inShelf.has(f.shelf+'|'+code);
    const option=(key,id,name,count)=>({key,id,name,count,pressed:f[key].includes(id)});
    const shelf=shelves.get(f.shelf);
    // A kind named like its tab (부품 inside 부품) reads as 낱개 부품, so the panel never repeats the tab.
    const kindOptions=shelf.kinds.length>1?shelf.kinds.map(k=>option('kind',k,k===shelf.name?'낱개 '+k:k,kinds.get(k)||0)):[];
    const roleOptions=roles.filter(r=>r.codes.some(here)).map(r=>option('role',r.id,r.name,sum(r.codes)));
    const placeOptions=data.places.filter(p=>p.codes.some(here)).map(p=>option('place',p.id,p.name,sum(p.codes)));
    const iconOptions=data.iconGroups.filter(g=>inShelf.has(f.shelf+'|ICO.'+g.id)).map(g=>option('icon',g.id,g.name,icons.get(g.id)||0));
    const codeOptions=data.categories.filter(c=>here(c.id)).map(c=>option('code',c.id,short(c.name),codes.get(c.id)||0));
    // Sections read top to bottom from broad to fine. The icon tab holds one source category, so it shows its own categories instead of 쓰임·분야·세부 분류.
    const groups=(f.shelf===iconShelf?[{key:'kind',label:'종류',options:kindOptions},{key:'icon',label:'카테고리',options:iconOptions}]
      :[{key:'kind',label:'종류',options:kindOptions},{key:'role',label:'쓰임',options:roleOptions},
        {key:'place',label:'분야',options:placeOptions},{key:'code',label:'세부 분류',options:codeOptions}]).filter(g=>g.options.length);
    return views.filterBar(groups);
  }
  function suggestions(state,query) {
    // Suggestions jump anywhere in the current tab, so picked filters do not narrow them.
    const whole=readFilters(state.page,new URLSearchParams(state.page==='dictionary'?'shelf='+state.filters.shelf:''));
    return currentItems({...state,filters:whole,query}).slice(0,6);
  }
  function entryCard(state,e) {
    const label=data.layers.find(l=>l.id===e.layer).english;
    return '<button class="catalog-tile entry-tile" data-library-entry="'+e.id+'" data-focus="entry-'+e.id+'"><span class="record-code">'+label+'</span><h3>'+escape(e.name)+'</h3><span class="tile-foot">'+escape(e.kind||'')+icon('arrow')+'</span></button>';
  }
  function dictEntry(state,e) {
    if (e.implementation) return '<div class="dict-entry is-built"><span class="dict-thumb atlas-preview" inert aria-hidden="true">'+sample(e,state.style,'thumb-'+e.id)+'</span><button class="dict-hit" data-library-entry="'+e.id+'" data-focus="entry-'+e.id+'"><strong>'+escape(e.name)+'</strong></button></div>';
    return '<button class="dict-entry" data-library-entry="'+e.id+'" data-focus="entry-'+e.id+'" data-kind="'+escape(e.kind||'')+'" title="'+escape(e.name+(e.lucide?' · Lucide '+e.lucide:''))+'"><span class="dict-thumb">'+kindSvg(e.kind)+'</span><strong>'+escape(short(e.name))+'</strong></button>';
  }
  const empty='<div class="empty-state"><span class="empty-generated nav-sprite nav-sprite-search" aria-hidden="true"></span><h2>일치하는 항목이 없어요</h2><button class="secondary" data-action="clear-filters" data-focus="empty-clear">필터 지우기</button></div>';
  const more=(shown,total)=>total>shown?'<div class="load-more"><button class="secondary" data-action="load-more" data-focus="load-more">더 보기 <span>'+shown+' / '+total+'</span></button></div>':'';
  // The tabs and the filter bar say where you are; main carries only pictures.
  function collection(state) {
    const items=currentItems(state);
    if (!items.length) return '<section aria-labelledby="page-title">'+empty+'</section>';
    if (state.page==='components') return '<section aria-labelledby="page-title"><div class="catalog-grid">'+items.slice(0,state.limit).map(e=>entryCard(state,e)).join('')+'</div>'+more(Math.min(state.limit,items.length),items.length)+'</section>';
    const built=items.filter(e=>e.implementation), rest=items.filter(e=>!e.implementation);
    return '<section class="atlas dict" aria-labelledby="page-title"><div class="dict-grid dict-entries">'+built.map(e=>dictEntry(state,e)).join('')+rest.slice(0,state.limit).map(e=>dictEntry(state,e)).join('')+'</div>'+more(state.limit,rest.length)+'</section>';
  }
  function detail(state) {
    const e=state.page==='dictionary'?entries.get(state.detail):components.get(state.detail);
    const dict=state.page==='dictionary', category=dict?null:data.layers.find(l=>l.id===e.layer);
    // The dictionary detail is only the enlarged picture; the tile already carries the name.
    return '<header class="dialog-header"><div><span class="dialog-category">'+escape(dict?[shelves.get(e.shelf)?.name,e.sub?'':short(categoryById.get(e.category)?.name||''),places.get(placeOf.get(e.category))?.name,iconGroups.get(e.sub)?.name].filter(Boolean).join(' · '):category.english)+'</span><h2 id="detail-title" tabindex="-1">'+escape(e.name)+'</h2></div><button class="icon-button" data-action="close-dialog" aria-label="상세 닫기">'+icon('close')+'</button></header>'+
      (dict?'<div class="detail-art" data-kind="'+escape(e.kind||'')+'">'+kindSvg(e.kind)+'</div>'
        :'<div class="record-detail"><p class="record-kind">'+escape(category.name)+'</p><section><h3>대표 항목</h3><p>'+escape(e.examples)+'</p></section></div>');
  }
  window.Pattove.libraryUI={
    pages,navigation,filters,readFilters,writeFilters,collection,detail,currentItems,suggestions,
    validDetail:(page,id)=>(page==='dictionary'?entries:components).has(id)||(page==='dictionary'&&registry.index.has(id)),
    suggestionGroup:(page,e)=>page==='dictionary'?(e.implementation?'구현 · '+e.layer:shelves.get(e.shelf)?.name+' · '+(e.sub?iconGroups.get(e.sub).name:short(categoryById.get(e.category)?.name||''))):data.layers.find(l=>l.id===e.layer).name,
    sample
  };
})();
