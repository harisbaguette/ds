(() => {
  const { catalog, previews } = window.Pattove;
  const { preview, icon } = previews;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const styles = catalog.styles.filter(s => s.id !== 'base');
  const styleName = id => catalog.styles.find(s => s.id === id)?.name || '메인 스타일';
  function styleReferences(style) {
    return `<p>${escape(style.rules)}</p>${style.references.length ? `<div class="reference-images">${style.references.map(ref => {
      const url = '영감보관함/이미지/' + ref.file.split('/').map(encodeURIComponent).join('/');
      return `<a href="${url}" target="_blank" rel="noopener" aria-label="${escape(ref.name)} 원본 새 탭에서 보기"><img src="${url}" alt="${escape(ref.name)}" loading="lazy"><span>${escape(ref.name)}</span></a>`;
    }).join('')}</div>` : ''}`;
  }
  function header(state) {
    const library = window.Pattove.libraryUI;
    const shelf = ['dictionary','system'].includes(state.page) ? library.shelfFor(state) : null;
    if (state.page === 'system') {
      const item = window.Pattove.systemRegistry.index.get(state.detail);
      return `<h1 id="page-title" class="sr-only">${escape(item.name)}</h1><nav class="content-breadcrumb" aria-label="현재 위치"><a href="#/dictionary?shelf=${shelf.id}" data-action="back-to-list" data-focus="back-to-list">${escape(shelf.name)}</a>${icon('chevron')}<span aria-current="page">${escape(item.name)}</span></nav>${window.Pattove.systemUI.partLinks(state)}`;
    }
    const current = document.querySelector('.nav-subcategory[aria-current="true"]')?.textContent;
    return `<h1 id="page-title" class="collection-title">${escape(current || shelf?.name || ({styles:'전체 미리보기',patterns:'패턴',components:'구성요소'})[state.page])}</h1>`;
  }
  // Content filters: folding sections of plain rows. A row switches at once (no apply step) and shows a check while on;
  // nothing picked shows everything. At first only the sections holding a pick are open (the first one when nothing is picked).
  // groups: [{key, label, options}]; an option is {id, name, count, pressed}.
  // A long list gets its own search box; it hides the rows whose name does not match.
  const facetSearch = (label, many) => many ? `<input type="search" class="facet-search" data-facet-search placeholder="${escape(label)} 찾기" aria-label="${escape(label)} 찾기" autocomplete="off">` : '';
  const row = (key, o) => `<button type="button" class="filter-option" aria-pressed="${!!o.pressed}" data-filter="${key}:${escape(o.id)}" data-focus="opt-${key}-${escape(o.id)}" data-facet-name="${escape(o.name.toLocaleLowerCase())}"${!o.pressed && o.count === 0 ? ' disabled' : ''}><span>${escape(o.name)}</span>${icon('check')}</button>`;
  function section(g, open) {
    const on = g.options.filter(o => o.pressed).length;
    return `<details class="filter-section" data-section="${g.key}"${open ? ' open' : ''}><summary data-focus="section-${g.key}"><span>${escape(g.label)}</span>${on ? `<span class="filter-section-num"><span class="sr-only">켠 조건 </span>${on}</span>` : ''}${icon('chevron-down')}</summary>
      <div class="filter-rows" role="group" aria-label="${escape(g.label)}">${facetSearch(g.label, g.options.length > 20)}${g.options.map(o => row(g.key, o)).join('')}</div></details>`;
  }
  function filterBar(groups) {
    const on = groups.some(g => g.options.some(o => o.pressed));
    return groups.map((g, i) => section(g, on ? g.options.some(o => o.pressed) : i === 0)).join('');
  }
  function patternFilters(state) {
    const options = catalog.categories.filter(c => c.id !== 'all').map(c => ({ id: c.id, name: c.name, pressed: state.filters.category.includes(c.id) }));
    return filterBar([{ key: 'category', label: '목적', options }]);
  }
  function card(pattern, style) {
    const key = `${pattern.id}-${style}`;
    return `<article class="pattern-card" data-pattern="${pattern.id}">
      <button class="card-open" data-open="${pattern.id}" data-style="${style}" data-focus="card-${key}" aria-label="${pattern.name} 상세, ${styleName(style)}">
        ${preview(pattern.id, style)}<div class="card-caption"><h2>${pattern.name}</h2></div>
      </button>
    </article>`;
  }
  function patterns(state, results) {
    const style = styles.find(s => s.id === state.style);
    return `<section aria-labelledby="page-title">
      ${results.length ? `<div class="pattern-grid">${results.map(p => card(p, state.style)).join('')}</div>` : `<div class="empty-state"><span class="empty-generated nav-sprite nav-sprite-search" aria-hidden="true"></span><h2>검색 결과가 없어요</h2><button class="secondary" data-action="clear-filters">필터 지우기</button></div>`}
      ${style ? `<details class="style-notes"><summary>${escape(style.name)}의 특징·참고 이미지 ${icon('chevron-down')}</summary>${styleReferences(style)}</details>` : ''}
    </section>`;
  }
  function detail(state, pattern) {
    const entry = window.Pattove.library.entries.find(e => e.id === pattern.entry);
    const style = styles.find(s => s.id === state.style);
    return `<header class="dialog-header"><div><span class="dialog-category">${styleName(state.style)} · ${catalog.categories.find(c => c.id === pattern.category).name}</span>
      <h2 id="detail-title" tabindex="-1">${pattern.name}</h2></div><button class="icon-button" data-action="close-dialog" aria-label="상세 닫기">${icon('close')}</button></header>
      <div class="detail-layout"><div class="detail-preview">${preview(pattern.id, state.style, true)}</div>
        <div class="detail-content">
          <div class="content-slot"><h3>언제 쓰나요?</h3><p class="pattern-usage">${escape(entry?.usage || pattern.name)}</p></div>
          ${style ? `<div class="content-slot"><h3>${escape(style.name)}의 표현</h3><p class="pattern-usage">${escape(style.rules)}</p></div>` : ''}
          ${entry ? `<a class="secondary pattern-dictionary-link" href="#/dictionary?code=${entry.category}&detail=${entry.id}">사전에서 자세히 보기 ${icon('arrow')}</a>` : ''}
        </div></div>`;
  }
  // One main style: its real parts and a composed screen, with direct links to the specimens.
  function styleGrid(state) {
    const p = window.Pattove.parts;
    const tile = (id,name,body,href='#/system?detail='+id) => `<article class="overview-tile" data-overview="${id}"><div class="overview-preview ds theme-${state.style}" data-style="${state.style}" inert aria-hidden="true">${body}</div><a class="overview-link" href="${href}" data-focus="overview-${id}"><h2>${name}</h2>${icon('arrow')}</a></article>`;
    return `<section class="style-overview" aria-label="메인 스타일 전체 미리보기">
      <h1 class="sr-only">메인 스타일 전체 미리보기</h1>
      ${tile('button','버튼','<div class="preview-fit"><div class="preview-scene overview-actions" data-preview-scene>'+p.button({label:'계속하기'})+p.button({label:'취소',variant:'outline'})+p.button({label:'검색',iconName:'search',iconOnly:true})+'</div></div>')}
      ${tile('input','입력',p.field({id:'overview-field',label:'이름',placeholder:'이름을 입력하세요'}))}
      ${tile('page','컬렉션 화면',window.Pattove.componentDocs.live('page',{},state.style,'overview-page'))}
      ${tile('selection','선택',p.renderItem('checkbox','overview-checkbox')+p.renderItem('switch','overview-switch'),'#/dictionary?shelf=part&group=selection')}
      ${tile('bottom-nav','탐색','<div class="preview-fit"><div class="preview-scene" data-preview-scene>'+p.navigation('float')+'</div></div>')}
      ${tile('token-color','색·표면','<div class="overview-colors"><i></i><i></i><i></i><i></i></div><div class="overview-surfaces"><i></i><i></i><i></i></div>')}
      ${tile('card','카드',p.card({title:'봄의 색',description:'연한 초록과 따뜻한 노랑',action:'열기'}))}
    </section>`;
  }
  window.Pattove.views = { escape, styleName, styleReferences, header, filterBar, facetSearch, patternFilters, patterns, detail, styleGrid };
})();
