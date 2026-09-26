(() => {
  const { library: data, views, previews } = window.Pattove;
  const { escape } = views, { icon } = previews;
  const entries=new Map(data.entries.map(e=>[e.id,e]));
  const components=new Map(data.components.map(e=>[e.id,e]));
  const documents=new Map(data.documents.map(e=>[e.id,e]));
  const pages=['dictionary','components','docs'];
  const searches=new Map([...data.entries,...data.components].map(e=>[e.id,[e.id,e.name,e.usage,e.examples,e.kind].filter(Boolean).join(' ').toLocaleLowerCase()]));
  const pending=new Map();
  const registry = window.Pattove.systemRegistry;
  const part = id => registry.index.get(id) || registry.items.find(item => item.entry === id);
  const implemented = e => ({ ...e, usage:e.purpose, category:e.section, kind:e.layer, implementation:true });
  // 대분류(groups) → 중분류(categories) → 소분류(entries). Group ids and category codes share the category parameter.
  const categoryById=new Map(data.categories.map(c=>[c.id,c]));
  const groups=new Map(data.groups.map(g=>[g.id,{...g,count:g.codes.reduce((n,code)=>n+(categoryById.get(code)?.count||0),0)}]));
  const groupOf=code=>data.groups.find(g=>g.codes.includes(code));
  const inScope=(state,code)=>state.category==='all'||code===state.category||!!groups.get(state.category)?.codes.includes(code);
  const builtIn=code=>registry.items.filter(i=>i.entry&&entries.get(i.entry)?.category===code).length;
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
  const navArt={styles:'nav-art-svg nav-art-styles',components:'nav-sprite nav-sprite-layers',dictionary:'nav-sprite nav-sprite-search',docs:'nav-sprite nav-sprite-document'};
  function navigation(state) {
    const active=['patterns','system'].includes(state.page)?'styles':pages.includes(state.page)?'dictionary':state.page;
    return [['styles','스타일'],['dictionary','사전']].map(([id,name])=>'<a href="#/'+id+'" data-focus="page-'+id+'" aria-label="'+name+'" title="'+name+'"'+(active===id?' aria-current="page"':'')+'><span class="nav-art '+navArt[id]+'" aria-hidden="true"></span><span>'+name+'</span></a>').join('');
  }
  function currentItems(state) {
    if (state.page === 'dictionary') {
      const matches = new Set(registry.matching(state.query).map(e=>e.id));
      const built = registry.items.filter(e=>matches.has(e.id)||(e.entry&&match(entries.get(e.entry),state.query))).filter(e => e.section === state.category || inScope(state, entries.get(e.entry)?.category)).map(implemented);
      if (!state.query && (state.category === 'all' || registry.sections.some(s => s.id === state.category))) return built;
      return [...built, ...data.entries.filter(e => !part(e.id) && inScope(state, e.category) && match(e,state.query))];
    }
    return state.page==='dictionary'?[]
      :data.components.filter(e=>(state.category==='all'||e.layer===state.category)&&match(e,state.query));
  }
  function suggestions(state,query) {
    return state.page==='dictionary' ? currentItems({...state,category:'all',query}).slice(0,6) : data.components.filter(e=>match(e,query)).slice(0,6);
  }
  function categoryTitle(state) {
    if (state.page === 'dictionary' && groups.has(state.category)) return groups.get(state.category).name;
    if (state.page === 'dictionary' && registry.sections.some(s => s.id === state.category)) return state.category === 'all' ? '전체' : registry.sections.find(s => s.id === state.category).name;
    return (state.page==='dictionary'?data.categories:data.layers).find(c=>c.id===state.category)?.name || (state.page==='dictionary'?'전체 분류':'전체 계층');
  }
  function navLink(state,item) {
    return '<a class="library-nav-link" href="#/'+state.page+'?category='+item.id+'"'+(state.category===item.id?' aria-current="page"':'')+'>'+escape(item.name)+'</a>';
  }
  function sidebar(state) {
    if(state.page==='docs') {
      const links=ids=>ids.map(id=>{const d=documents.get(id);return '<a class="library-nav-link" href="#/docs?doc='+id+'"'+(state.doc===id?' aria-current="page"':'')+'>'+escape(d.name)+'</a>';}).join('');
      return links(data.coreDocuments)+(data.noteDocuments.length?'<details class="nav-group"'+(data.noteDocuments.includes(state.doc)?' open':'')+'><summary>작업 기록'+icon('chevron-down')+'</summary>'+links(data.noteDocuments)+'</details>':'');
    }
    const all=navLink(state,{id:'all',name:state.page==='dictionary'?'전체 분류':'전체 계층'});
    if(state.page==='components') return all+data.layers.map(l=>navLink(state,l)).join('');
    const open=groups.has(state.category)?state.category:groupOf(state.category)?.id;
    const current=id=>state.category===id?' aria-current="page"':'';
    return '<div class="dict-tree"><a class="library-nav-link dict-root" href="#/dictionary"'+current('all')+'>전체<small>'+data.entries.length+'</small></a>'+[...groups.values()].map(g=>'<div class="dict-branch"><a class="library-nav-link dict-group-link" href="#/dictionary?category='+g.id+'"'+current(g.id)+(g.id===open?' data-open':'')+'>'+icon('group-'+g.id)+'<span>'+escape(g.name)+'</span><small>'+g.count+'</small></a>'+
      (g.id===open?'<div class="dict-leaves">'+g.codes.map(code=>categoryById.get(code)).map(c=>'<a class="library-nav-link dict-leaf" href="#/dictionary?category='+c.id+'"'+current(c.id)+' title="'+escape(c.name)+'"><b>'+c.id+'</b><span>'+escape(short(c.name))+'</span></a>').join('')+'</div>':'')+'</div>').join('')+'</div>';
  }
  function mobileNavigation(state) {
    if(state.page==='docs') return '<label class="mobile-library-nav"><span class="sr-only">문서 선택</span><select data-document-select aria-label="문서 선택">'+options([...data.coreDocuments,...data.noteDocuments].map(id=>documents.get(id)),state.doc)+(data.coreDocuments.includes(state.doc)||data.noteDocuments.includes(state.doc)?'':options([documents.get(state.doc)],state.doc))+'</select></label>';
    const section=registry.sections.find(s=>s.id===state.category&&s.id!=='all');
    const choices=state.page==='dictionary'?(section?options([section],state.category):'')+[...groups.values()].map(g=>'<optgroup label="'+escape(g.name)+'">'+options([{id:g.id,name:g.name+' 전체'}],state.category)+options(g.codes.map(code=>categoryById.get(code)),state.category)+'</optgroup>').join(''):options(data.layers,state.category);
    return '<label class="mobile-library-nav"><span class="sr-only">분류 선택</span><select data-library-category aria-label="분류 선택"><option value="all">'+(state.page==='dictionary'?'전체':'전체 계층')+'</option>'+choices+'</select></label>';
  }
  function heading(state,count) {
    return '<div class="library-heading"><h2>'+escape(state.query?'“'+state.query+'”':categoryTitle(state))+'</h2><span>'+count+'</span>'+(state.query?'<button class="icon-button" data-action="clear-query" aria-label="검색 해제">'+icon('close')+'</button>':'')+'</div>';
  }
  function indexCard(state,item) {
    const code=state.page==='dictionary'?item.id:item.english;
    return '<a class="catalog-tile category-tile" href="#/'+state.page+'?category='+item.id+'"><span class="record-code">'+code+'</span><h3>'+escape(item.name)+'</h3><span class="tile-foot">'+item.count+'개'+icon('arrow')+'</span></a>';
  }
  function entryCard(state,e) {
    const label=state.page==='dictionary'?e.id:data.layers.find(l=>l.id===e.layer).english;
    return '<button class="catalog-tile entry-tile" data-library-entry="'+e.id+'" data-focus="entry-'+e.id+'"><span class="record-code">'+label+'</span><h3>'+escape(e.name)+'</h3><span class="tile-foot">'+escape(e.kind||'')+icon('arrow')+'</span></button>';
  }
  function dictEntry(state,e) {
    if (e.implementation) return '<div class="dict-entry is-built"><span class="dict-thumb atlas-preview" inert aria-hidden="true">'+sample(e,state.style,'thumb-'+e.id)+'</span><button class="dict-hit" data-library-entry="'+e.id+'" data-focus="entry-'+e.id+'"><strong>'+escape(e.name)+'</strong><small>'+escape(e.entry||e.id)+'</small></button></div>';
    return '<button class="dict-entry" data-library-entry="'+e.id+'" data-focus="entry-'+e.id+'" data-kind="'+escape(e.kind||'')+'" title="'+escape(e.name)+'"><span class="dict-thumb">'+kindSvg(e.kind)+'</span><strong>'+escape(short(e.name))+'</strong><small>'+e.id+'</small></button>';
  }
  function dictionary(state) {
    const group=groups.get(state.category), category=categoryById.get(state.category);
    const parent=group||(category&&groups.get(groupOf(category.id)?.id));
    const crumb=(href,name)=>'<li><a href="'+href+'">'+escape(name)+'</a></li>';
    const path='<ol class="dict-path" aria-label="사전 위치">'+(state.category==='all'&&!state.query?'':crumb('#/dictionary','전체'))+(category&&parent?crumb('#/dictionary?category='+parent.id,parent.name):'')+'</ol>';
    const title=state.query?'“'+state.query+'”':category?category.name:categoryTitle(state);
    const head=(count,mark)=>'<div class="atlas-heading dict-head"><div>'+path+'<h2>'+(mark||'')+'<span>'+escape(title)+'</span></h2></div><span class="dict-total">'+count+'</span></div>';
    const foot='<footer class="atlas-footer"><a href="#/system?style='+state.style+'">부품 시트</a><a href="#/components">부품 관계</a><a href="#/docs?doc=guide">사전 원문</a></footer>';
    let body, count;
    if (state.category==='all'&&!state.query) {
      count=data.entries.length;
      body='<div class="dict-grid dict-groups">'+[...groups.values()].map(g=>'<a class="dict-card dict-group" href="#/dictionary?category='+g.id+'" data-focus="group-'+g.id+'"><span class="dict-glyph">'+icon('group-'+g.id)+'</span><strong>'+escape(g.name)+'</strong><span class="dict-meta"><span>'+g.codes.length+'</span><span>'+g.count+'</span></span></a>').join('')+'</div>';
    } else if (group&&!state.query) {
      count=group.count;
      body='<div class="dict-grid dict-categories">'+group.codes.map(code=>categoryById.get(code)).map(c=>{const n=builtIn(c.id);return '<a class="dict-card dict-category" href="#/dictionary?category='+c.id+'" data-focus="category-'+c.id+'" title="'+escape(c.name)+'"><span class="dict-code">'+c.id+'</span><strong>'+escape(short(c.name))+'</strong><span class="dict-meta"><span>'+c.count+'</span>'+(n?'<i class="dict-built" aria-label="구현 '+n+'개">'+'<b></b>'.repeat(Math.min(n,6))+'</i>':'')+'</span></a>';}).join('')+'</div>';
    } else {
      const items=currentItems(state), built=items.filter(e=>e.implementation), rest=items.filter(e=>!e.implementation);
      count=items.length;
      body=items.length?'<div class="dict-grid dict-entries">'+built.map(e=>dictEntry(state,e)).join('')+rest.slice(0,state.limit).map(e=>dictEntry(state,e)).join('')+'</div>'+(rest.length>state.limit?'<div class="load-more"><button class="secondary" data-action="load-more" data-focus="load-more">더 보기 <span>'+state.limit+' / '+rest.length+'</span></button></div>':'')
        :'<div class="empty-state"><span class="empty-generated nav-sprite nav-sprite-search" aria-hidden="true"></span><h2>일치하는 항목이 없어요</h2><button class="secondary" data-action="reset">전체 보기</button></div>';
    }
    const mark=group?'<span class="dict-glyph">'+icon('group-'+group.id)+'</span>':category?'<span class="dict-code">'+category.id+'</span>':'';
    return '<section class="atlas dict" aria-labelledby="page-title" data-level="'+(state.query?'search':state.category==='all'?1:group?2:category?3:'section')+'">'+head(count,mark)+mobileNavigation(state)+body+foot+'</section>';
  }
  function collection(state) {
    if (state.page === 'dictionary') return dictionary(state);
    const index=state.category==='all'&&!state.query;
    const items=index?(state.page==='dictionary'?data.categories:data.layers):currentItems(state);
    const intro=state.page==='dictionary'?'<div class="library-intro"><p>필요한 UI를 찾고, 언제 쓰는지 확인하세요.</p><details class="library-resources"><summary>사전 안내 '+icon('chevron-down')+'</summary><p>사전은 사용 목적별로 찾는 곳이에요. 부품의 구조와 자세한 원문은 아래에서 볼 수 있어요.</p><a href="#/components">부품 구조 <span>버튼부터 화면까지, 크기별로 보기</span>'+icon('arrow')+'</a><a href="#/docs?doc=guide">사전 사용법 '+icon('arrow')+'</a><a href="#/docs?doc=definition">원문·작업 기록 '+icon('arrow')+'</a></details></div>':'<div class="library-intro"><a class="library-back" href="#/dictionary">'+icon('arrow')+' 사전</a><p>버튼부터 화면까지, 부품을 크기별로 모았어요.</p></div>';
    return '<section aria-labelledby="page-title">'+intro+mobileNavigation(state)+heading(state,items.length)+
      (items.length?'<div class="catalog-grid">'+(index?items.map(i=>indexCard(state,i)).join(''):items.slice(0,state.limit).map(e=>entryCard(state,e)).join(''))+'</div>':'<div class="empty-state"><span class="empty-generated nav-sprite nav-sprite-search" aria-hidden="true"></span><h2>검색 결과가 없어요</h2><button class="secondary" data-action="reset">전체 보기</button></div>')+
      (!index&&items.length>state.limit?'<div class="load-more"><button class="secondary" data-action="load-more" data-focus="load-more">더 보기 <span>'+Math.min(state.limit,items.length)+' / '+items.length+'</span></button></div>':'')+'</section>';
  }
  function detail(state) {
    const e=state.page==='dictionary'?entries.get(state.detail):components.get(state.detail);
    const category=state.page==='dictionary'?data.categories.find(c=>c.id===e.category):data.layers.find(l=>l.id===e.layer);
    const source=state.page==='dictionary'?e.category:'layers';
    return '<header class="dialog-header"><div><span class="dialog-category">'+escape(state.page==='dictionary'?e.id:category.english)+'</span><h2 id="detail-title" tabindex="-1">'+escape(e.name)+'</h2></div><button class="icon-button" data-action="close-dialog" aria-label="상세 닫기">'+icon('close')+'</button></header>'+
      '<div class="record-detail"><p class="record-kind">'+escape(category.name+(e.kind?' · '+e.kind:''))+'</p><section><h3>'+ (state.page==='dictionary'?'역할·사용할 때':'대표 항목')+'</h3><p>'+escape(e.usage||e.examples)+'</p></section>'+
      (e.evidence?'<section><h3>근거</h3><p>'+escape(e.evidence)+'</p></section>':'')+'</div>'+
      '<footer class="dialog-footer"><a class="secondary" href="#/docs?doc='+source+'">원문 보기 '+icon('arrow')+'</a></footer>';
  }
  function docPage(state) {
    const doc=documents.get(state.doc), page=window.Pattove.documentPages?.[state.doc];
    if(!page)return mobileNavigation(state)+'<div class="document-loading" role="status">문서를 여는 중…</div>';
    const toc=page.toc.length?'<details class="document-toc"><summary>목차 '+icon('chevron-down')+'</summary><nav aria-label="문서 목차">'+page.toc.map(t=>'<a class="toc-level-'+t.depth+'" href="#/docs?doc='+doc.id+'&section='+encodeURIComponent(t.id)+'">'+escape(t.title)+'</a>').join('')+'</nav></details>':'';
    return '<a class="library-back" href="#/dictionary">'+icon('arrow')+' 사전</a>'+mobileNavigation(state)+toc+'<article class="document-body" aria-label="'+escape(doc.name)+'">'+page.html+'</article>';
  }
  function loadDocument(id) {
    if(window.Pattove.documentPages?.[id])return Promise.resolve();
    if(pending.has(id))return pending.get(id);
    const promise=new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src='src/data/documents/'+id+'.js';
      script.onload=()=>{script.remove();pending.delete(id);resolve();};
      script.onerror=()=>{script.remove();pending.delete(id);reject(new Error('문서를 열 수 없어요.'));};
      document.head.append(script);
    });
    pending.set(id,promise);return promise;
  }
  window.Pattove.libraryUI={
    pages,navigation,sidebar,collection,detail,docPage,loadDocument,currentItems,suggestions,
    validCategory:(page,id)=>(page==='dictionary'?[...data.categories,...data.groups,...registry.sections]:data.layers).some(c=>c.id===id),
    validDetail:(page,id)=>(page==='dictionary'?entries:components).has(id)||(page==='dictionary'&&registry.index.has(id)),
    validDocument:id=>documents.has(id),
    documentName:id=>documents.get(id)?.name,
    suggestionGroup:(page,e)=>page==='dictionary'?(e.implementation?'구현 · '+e.layer:e.id):data.layers.find(l=>l.id===e.layer).name,
    sample
  };
})();
