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
  // Three shelves by kind (부품 → 블록 → 템플릿). Inside a shelf, common role categories come first and use categories are "쓰는 곳" tags.
  // The category parameter reads shelf[.code[.icon group]] or shelf.place; a bare source code still opens that code across every kind.
  const categoryById=new Map(data.categories.map(c=>[c.id,c]));
  const shelves=new Map(data.shelves.map(s=>[s.id,s]));
  const places=new Map(data.places.map(p=>[p.id,p]));
  const iconGroups=new Map(data.iconGroups.map(g=>[g.id,g]));
  const placeOf=new Map(data.places.flatMap(p=>p.codes.map(code=>[code,p.id])));
  const commonGroups=data.roleOrder.map(id=>data.groups.find(g=>g.id===id)).filter(Boolean).map(g=>({...g,codes:g.codes.filter(code=>!placeOf.has(code))}));
  const shelfOf=kind=>data.shelves.find(s=>s.kinds.includes(kind))?.id;
  const itemShelf=item=>item.entry?shelfOf(entries.get(item.entry).kind):['Template','Page'].includes(item.layer)?'template':item.layer==='Module'?'block':'part';
  function scope(category) {
    if (category==='all') return {};
    if (typeof category!=='string') return null;
    if (categoryById.has(category)) return {code:category};
    const [shelf,key,sub,extra]=category.split('.');
    if (!shelves.has(shelf)||extra!==undefined) return null;
    if (!key) return {shelf};
    if (places.has(key)&&!sub) return {shelf,place:key};
    if (categoryById.has(key)&&!placeOf.has(key)&&(!sub||(key==='ICO'&&iconGroups.has(sub)))) return sub?{shelf,code:key,sub}:{shelf,code:key};
    return null;
  }
  const fits=(s,e)=>(!s.shelf||shelfOf(e.kind)===s.shelf)&&(!s.code||e.category===s.code)&&(!s.sub||e.sub===s.sub)&&(!s.place||placeOf.get(e.category)===s.place);
  const builtFits=(s,item)=>item.entry?fits(s,entries.get(item.entry)):!s.code&&!s.place&&(!s.shelf||itemShelf(item)===s.shelf);
  const tally=new Map(), bump=key=>tally.set(key,(tally.get(key)||0)+1);
  for (const e of data.entries) { const shelf=shelfOf(e.kind); bump(shelf); bump(shelf+'.'+(placeOf.get(e.category)||e.category)); if (e.sub) bump(shelf+'.'+e.category+'.'+e.sub); }
  for (const item of registry.items) if (!item.entry) bump(itemShelf(item));
  const builtIn=(shelf,code)=>registry.items.some(i=>i.entry&&itemShelf(i)===shelf&&entries.get(i.entry).category===code);
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
    const body = item.id === 'tokens' ? '<div class="atlas-colors"><i></i><i></i><i></i><i></i></div><strong class="atlas-type">Aa 가나</strong>'
      : item.id === 'button' ? p.button({label:'계속하기'}) + p.button({label:'취소',variant:'outline'}) + p.button({label:'검색',iconName:'search',iconOnly:true})
      : item.id === 'icon' ? ['search','arrow','bookmark','grid','close','check','folder','bell'].map(p.icon).join('')
      : item.id === 'input' ? '<label class="ds-field">이름'+p.input({id:prefix,placeholder:'이름을 입력하세요'})+'</label>'
      : p.renderItem(item.id, prefix);
    return '<div class="atlas-sample ds theme-'+style+'" data-style="'+style+'" data-kind="'+item.id+'">'+body+'</div>';
  }
  const match=(entry,query)=>query.trim().toLocaleLowerCase().split(/\s+/).every(term=>searches.get(entry.id).includes(term));
  const options=(items,current)=>items.map(e=>'<option value="'+e.id+'"'+(e.id===current?' selected':'')+'>'+escape(e.name)+'</option>').join('');
  // Rail = the three shelves (style-independent); only 스타일 sits below the divider. Built parts open on the system page, which belongs to 부품.
  const groupName={vocabulary:'기초',interaction:'조작',expression:'표현',work:'작업',quality:'품질',additional:'추가'};
  function navigation(state) {
    const link=(href,focus,name,label,art,current)=>'<a href="'+href+'" data-focus="'+focus+'" aria-label="'+escape(name)+'" title="'+escape(name)+'"'+(current?' aria-current="page"':'')+'>'+art+'<span aria-hidden="true">'+label+'</span></a>';
    const open=state.page==='system'?'part':state.page==='dictionary'?scope(state.category)?.shelf:null;
    return data.shelves.map(s=>link('#/dictionary?category='+s.id,'rail-'+s.id,s.name,s.name,icon(s.icon),open===s.id)).join('')+
      '<i class="rail-divider" aria-hidden="true"></i>'+link('#/styles','page-styles','스타일','스타일',icon('layers'),['styles','patterns'].includes(state.page));
  }
  function currentItems(state) {
    if (state.page === 'dictionary') {
      const s = scope(state.category) || {};
      const matches = new Set(registry.matching(state.query).map(e=>e.id));
      const built = registry.items.filter(e=>(matches.has(e.id)||(e.entry&&match(entries.get(e.entry),state.query)))&&builtFits(s,e)).map(implemented);
      return [...built, ...data.entries.filter(e => !part(e.id) && fits(s, e) && match(e,state.query))];
    }
    return state.page==='dictionary'?[]
      :data.components.filter(e=>(state.category==='all'||e.layer===state.category)&&match(e,state.query));
  }
  function suggestions(state,query) {
    return state.page==='dictionary' ? currentItems({...state,category:'all',query}).slice(0,6) : data.components.filter(e=>match(e,query)).slice(0,6);
  }
  function categoryTitle(state) {
    return data.layers.find(c=>c.id===state.category)?.name || '전체 계층';
  }
  function navLink(state,item) {
    return '<a class="library-nav-link" href="#/'+state.page+'?category='+item.id+'"'+(state.category===item.id?' aria-current="page"':'')+'>'+escape(item.name)+'</a>';
  }
  function sidebar(state) {
    if(state.page==='components') return navLink(state,{id:'all',name:'전체 계층'})+data.layers.map(l=>navLink(state,l)).join('');
    // Column = the open shelf only: 전체, common role categories under their group heads (icons open a second level), then 쓰는 곳. The overview and search need no column.
    const s=scope(state.category)||{};
    if(!s.shelf||state.query) return '';
    const leaf=(id,focus,name,count,built,sub)=>'<a class="library-nav-link dict-leaf'+(sub?' dict-sub':'')+'" href="#/dictionary?category='+id+'" data-focus="'+focus+'"'+(state.category===id?' aria-current="page"':'')+' title="'+escape(name)+'"><span>'+escape(name)+'</span>'+(built?'<i class="dict-built-dot" role="img" aria-label="구현 있음"></i>':'')+'<small>'+count+'</small></a>';
    const head=name=>'<p class="system-nav-group dict-col-head">'+escape(name)+'</p>';
    const icons=code=>code==='ICO'&&s.code==='ICO'?data.iconGroups.filter(i=>tally.get(s.shelf+'.ICO.'+i.id)).map(i=>leaf(s.shelf+'.ICO.'+i.id,'leaf-ICO-'+i.id,i.name,tally.get(s.shelf+'.ICO.'+i.id),false,true)).join(''):'';
    const common=commonGroups.map(g=>[g,g.codes.filter(code=>tally.get(s.shelf+'.'+code))]).filter(([,codes])=>codes.length)
      .map(([g,codes])=>head(groupName[g.id]||short(g.name))+codes.map(code=>leaf(s.shelf+'.'+code,'leaf-'+code,short(categoryById.get(code).name),tally.get(s.shelf+'.'+code),builtIn(s.shelf,code))+icons(code)).join('')).join('');
    const used=data.places.filter(p=>tally.get(s.shelf+'.'+p.id));
    return '<div class="dict-col">'+leaf(s.shelf,'leaf-'+s.shelf,'전체',tally.get(s.shelf))+common+(used.length?head('쓰는 곳')+used.map(p=>leaf(s.shelf+'.'+p.id,'place-'+p.id,p.name,tally.get(s.shelf+'.'+p.id))).join(''):'')+'</div>';
  }
  function heading(state,count) {
    return '<div class="library-heading"><h2>'+escape(state.query?'“'+state.query+'”':categoryTitle(state))+'</h2><span>'+count+'</span>'+(state.query?'<button class="icon-button" data-action="clear-query" aria-label="검색 해제">'+icon('close')+'</button>':'')+'</div>';
  }
  function indexCard(state,item) {
    const code=item.english;
    return '<a class="catalog-tile category-tile" href="#/'+state.page+'?category='+item.id+'"><span class="record-code">'+code+'</span><h3>'+escape(item.name)+'</h3><span class="tile-foot">'+item.count+'개'+icon('arrow')+'</span></a>';
  }
  function entryCard(state,e) {
    const label=data.layers.find(l=>l.id===e.layer).english;
    return '<button class="catalog-tile entry-tile" data-library-entry="'+e.id+'" data-focus="entry-'+e.id+'"><span class="record-code">'+label+'</span><h3>'+escape(e.name)+'</h3><span class="tile-foot">'+escape(e.kind||'')+icon('arrow')+'</span></button>';
  }
  function dictEntry(state,e) {
    if (e.implementation) return '<div class="dict-entry is-built"><span class="dict-thumb atlas-preview" inert aria-hidden="true">'+sample(e,state.style,'thumb-'+e.id)+'</span><button class="dict-hit" data-library-entry="'+e.id+'" data-focus="entry-'+e.id+'"><strong>'+escape(e.name)+'</strong></button></div>';
    return '<button class="dict-entry" data-library-entry="'+e.id+'" data-focus="entry-'+e.id+'" data-kind="'+escape(e.kind||'')+'" title="'+escape(e.name)+'"><span class="dict-thumb">'+kindSvg(e.kind)+'</span><strong>'+escape(short(e.name))+'</strong></button>';
  }
  function dictionary(state) {
    // Rail and column already say where you are; main carries only pictures. Search alone gets a one-line head.
    let body;
    if (state.category==='all'&&!state.query) {
      body='<div class="dict-grid dict-groups dict-shelves">'+data.shelves.map(s=>'<a class="dict-card dict-group" href="#/dictionary?category='+s.id+'" data-focus="shelf-'+s.id+'" aria-label="'+escape(s.name+' — '+s.note)+'"><span class="dict-glyph">'+icon(s.icon)+'</span><strong aria-hidden="true">'+escape(s.name)+'</strong><span class="dict-note" aria-hidden="true">'+escape(s.note)+'</span><small aria-hidden="true">'+escape(s.english)+' · '+tally.get(s.id)+'</small></a>').join('')+'</div>';
    } else {
      const items=currentItems(state), built=items.filter(e=>e.implementation), rest=items.filter(e=>!e.implementation);
      body=(state.query?'<div class="dict-head"><h2>“'+escape(state.query)+'”</h2><span class="dict-count">'+items.length+'</span><button class="icon-button" data-action="clear-query" aria-label="검색 해제">'+icon('close')+'</button></div>':'')+
        (items.length?'<div class="dict-grid dict-entries">'+built.map(e=>dictEntry(state,e)).join('')+rest.slice(0,state.limit).map(e=>dictEntry(state,e)).join('')+'</div>'+(rest.length>state.limit?'<div class="load-more"><button class="secondary" data-action="load-more" data-focus="load-more">더 보기 <span>'+state.limit+' / '+rest.length+'</span></button></div>':'')
        :'<div class="empty-state"><span class="empty-generated nav-sprite nav-sprite-search" aria-hidden="true"></span><h2>일치하는 항목이 없어요</h2><button class="secondary" data-action="reset">전체 보기</button></div>');
    }
    return '<section class="atlas dict" aria-labelledby="page-title">'+body+'</section>';
  }
  function collection(state) {
    if (state.page === 'dictionary') return dictionary(state);
    const index=state.category==='all'&&!state.query;
    const items=index?data.layers:currentItems(state);
    const intro='<div class="library-intro"><a class="library-back" href="#/dictionary">'+icon('arrow')+' 사전</a><p>버튼부터 화면까지, 부품을 크기별로 모았어요.</p></div>';
    return '<section aria-labelledby="page-title">'+intro+heading(state,items.length)+
      (items.length?'<div class="catalog-grid">'+(index?items.map(i=>indexCard(state,i)).join(''):items.slice(0,state.limit).map(e=>entryCard(state,e)).join(''))+'</div>':'<div class="empty-state"><span class="empty-generated nav-sprite nav-sprite-search" aria-hidden="true"></span><h2>검색 결과가 없어요</h2><button class="secondary" data-action="reset">전체 보기</button></div>')+
      (!index&&items.length>state.limit?'<div class="load-more"><button class="secondary" data-action="load-more" data-focus="load-more">더 보기 <span>'+Math.min(state.limit,items.length)+' / '+items.length+'</span></button></div>':'')+'</section>';
  }
  function detail(state) {
    const e=state.page==='dictionary'?entries.get(state.detail):components.get(state.detail);
    const dict=state.page==='dictionary', category=dict?null:data.layers.find(l=>l.id===e.layer);
    // The dictionary detail is only the enlarged picture; the tile already carries the name.
    return '<header class="dialog-header"><div><span class="dialog-category">'+escape(dict?[shelves.get(shelfOf(e.kind))?.name,short(categoryById.get(e.category)?.name||''),places.get(placeOf.get(e.category))?.name,iconGroups.get(e.sub)?.name].filter(Boolean).join(' · '):category.english)+'</span><h2 id="detail-title" tabindex="-1">'+escape(e.name)+'</h2></div><button class="icon-button" data-action="close-dialog" aria-label="상세 닫기">'+icon('close')+'</button></header>'+
      (dict?'<div class="detail-art" data-kind="'+escape(e.kind||'')+'">'+kindSvg(e.kind)+'</div>'
        :'<div class="record-detail"><p class="record-kind">'+escape(category.name)+'</p><section><h3>대표 항목</h3><p>'+escape(e.examples)+'</p></section></div>');
  }
  window.Pattove.libraryUI={
    pages,navigation,sidebar,collection,detail,currentItems,suggestions,
    validCategory:(page,id)=>page==='dictionary'?id!=='all'&&!!scope(id):data.layers.some(c=>c.id===id),
    validDetail:(page,id)=>(page==='dictionary'?entries:components).has(id)||(page==='dictionary'&&registry.index.has(id)),
    suggestionGroup:(page,e)=>page==='dictionary'?(e.implementation?'구현 · '+e.layer:shelves.get(shelfOf(e.kind))?.name+' · '+short(categoryById.get(e.category)?.name||'')):data.layers.find(l=>l.id===e.layer).name,
    sample
  };
})();
