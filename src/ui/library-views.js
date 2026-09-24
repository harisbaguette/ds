(() => {
  const { library: data, views, previews } = window.Pattove;
  const { escape } = views, { icon } = previews;
  const entries=new Map(data.entries.map(e=>[e.id,e]));
  const components=new Map(data.components.map(e=>[e.id,e]));
  const documents=new Map(data.documents.map(e=>[e.id,e]));
  const pages=['dictionary','components','docs'];
  const searches=new Map([...data.entries,...data.components].map(e=>[e.id,[e.id,e.name,e.usage,e.examples,e.kind].filter(Boolean).join(' ').toLocaleLowerCase()]));
  const pending=new Map();
  const match=(entry,query)=>query.trim().toLocaleLowerCase().split(/\s+/).every(term=>searches.get(entry.id).includes(term));
  const options=(items,current)=>items.map(e=>'<option value="'+e.id+'"'+(e.id===current?' selected':'')+'>'+escape(e.name)+'</option>').join('');
  const navArt={styles:'nav-art-svg nav-art-styles',components:'nav-sprite nav-sprite-layers',dictionary:'nav-sprite nav-sprite-search',docs:'nav-sprite nav-sprite-document'};
  function navigation(state) {
    const active=state.page==='patterns'?'styles':state.page;
    return [['styles','스타일'],['components','구성요소'],['dictionary','사전'],['docs','문서']].map(([id,name])=>'<a href="#/'+id+'" data-focus="page-'+id+'" aria-label="'+name+'" title="'+name+'"'+(active===id?' aria-current="page"':'')+'><span class="nav-art '+navArt[id]+'" aria-hidden="true"></span><span>'+name+'</span></a>').join('');
  }
  function currentItems(state) {
    return state.page==='dictionary'?data.entries.filter(e=>(state.category==='all'||e.category===state.category)&&match(e,state.query))
      :data.components.filter(e=>(state.category==='all'||e.layer===state.category)&&match(e,state.query));
  }
  function suggestions(state,query) {
    return (state.page==='dictionary'?data.entries:data.components).filter(e=>match(e,query)).slice(0,6);
  }
  function categoryTitle(state) {
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
    return all+data.groups.map(g=>'<details class="nav-group" name="dictionary-navigation"'+(g.codes.includes(state.category)?' open':'')+'><summary>'+g.name+icon('chevron-down')+'</summary>'+data.categories.filter(c=>g.codes.includes(c.id)).map(c=>navLink(state,c)).join('')+'</details>').join('');
  }
  function mobileNavigation(state) {
    if(state.page==='docs') return '<label class="mobile-library-nav"><span class="sr-only">문서 선택</span><select data-document-select aria-label="문서 선택">'+options([...data.coreDocuments,...data.noteDocuments].map(id=>documents.get(id)),state.doc)+(data.coreDocuments.includes(state.doc)||data.noteDocuments.includes(state.doc)?'':options([documents.get(state.doc)],state.doc))+'</select></label>';
    const choices=state.page==='dictionary'?data.groups.map(g=>'<optgroup label="'+g.name+'">'+options(data.categories.filter(c=>g.codes.includes(c.id)),state.category)+'</optgroup>').join(''):options(data.layers,state.category);
    return '<label class="mobile-library-nav"><span class="sr-only">분류 선택</span><select data-library-category aria-label="분류 선택"><option value="all">'+(state.page==='dictionary'?'전체 분류':'전체 계층')+'</option>'+choices+'</select></label>';
  }
  function heading(state,count) {
    return '<div class="library-heading"><span class="heading-badge" aria-hidden="true"></span><h2>'+escape(state.query?'“'+state.query+'”':categoryTitle(state))+'</h2><span>'+count+'</span>'+(state.query?'<button class="icon-button" data-action="clear-query" aria-label="검색 해제">'+icon('close')+'</button>':'')+'</div>';
  }
  function indexCard(state,item) {
    const code=state.page==='dictionary'?item.id:item.english;
    return '<a class="catalog-tile category-tile" href="#/'+state.page+'?category='+item.id+'"><span class="record-code">'+code+'</span><h3>'+escape(item.name)+'</h3><span class="tile-foot">'+item.count+'개'+icon('arrow')+'</span></a>';
  }
  function entryCard(state,e) {
    const label=state.page==='dictionary'?e.id:data.layers.find(l=>l.id===e.layer).english;
    return '<button class="catalog-tile entry-tile" data-library-entry="'+e.id+'" data-focus="entry-'+e.id+'"><span class="record-code">'+label+'</span><h3>'+escape(e.name)+'</h3><span class="tile-foot">'+escape(e.kind||'')+icon('arrow')+'</span></button>';
  }
  function collection(state) {
    const index=state.category==='all'&&!state.query;
    const items=index?(state.page==='dictionary'?data.categories:data.layers):currentItems(state);
    return '<section aria-labelledby="page-title">'+mobileNavigation(state)+heading(state,items.length)+
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
    return mobileNavigation(state)+toc+'<article class="document-body" aria-label="'+escape(doc.name)+'">'+page.html+'</article>';
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
    validCategory:(page,id)=>(page==='dictionary'?data.categories:data.layers).some(c=>c.id===id),
    validDetail:(page,id)=>(page==='dictionary'?entries:components).has(id),
    validDocument:id=>documents.has(id),
    documentName:id=>documents.get(id)?.name,
    suggestionGroup:(page,e)=>page==='dictionary'?e.id:data.layers.find(l=>l.id===e.layer).name
  };
})();
