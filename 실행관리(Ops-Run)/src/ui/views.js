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
    return `<h1 id="page-title" class="sr-only">${escape(({styles:'스타일',system:'부품',patterns:'패턴',dictionary:'사전',components:'구성요소'})[state.page])}</h1>`;
  }
  // Side-menu filters: folding sections of plain rows. A row switches at once (no apply step) and shows a check while on;
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
    return (on ? '<div class="filter-top"><button type="button" class="filter-clear" data-action="clear-filters" data-focus="filter-clear">모두 지우기</button></div>' : '')
      + groups.map((g, i) => section(g, on ? g.options.some(o => o.pressed) : i === 0)).join('');
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
  // 스타일 화면: 디자인 스타일마다 휴대폰 첫 화면 견본 한 장. 누르면 앱 전체가 그 스타일로 갈아입는다.
  function styleGrid(state) {
    const p = window.Pattove.parts;
    return `<section class="style-gallery" aria-labelledby="page-title"><div class="style-grid">${styles.map(style => {
      const active = style.id === state.style;
      return `<article class="style-card${active ? ' is-active' : ''}">
        <div class="style-sample ds theme-${style.id}" data-style="${style.id}" inert aria-hidden="true">
          <div class="style-phone-screen">
            <header class="ds-page-header"><div><span class="ds-eyebrow">나의 작업실</span><h2>컬렉션</h2></div>${p.badge('3개')}</header>
            ${p.input({id:'style-sample-'+style.id, type:'search', placeholder:'이름으로 검색'})}
            ${p.card({title:'봄의 색', description:'연한 초록과 따뜻한 노랑', action:'열기'})}
            ${p.card({title:'주말의 기록', description:'산책하며 모은 장면들', tag:'완료', action:'열기'})}
          </div>
          ${p.navigation('float')}
        </div>
        <button type="button" class="style-choose" data-style-select="${style.id}" data-focus="style-${style.id}" aria-pressed="${active}">
          <strong>${escape(style.name)}</strong>
          ${active ? `<span class="style-badge">${icon('check')} 사용 중</span>` : ''}
        </button>
      </article>`;
    }).join('')}</div></section>`;
  }
  window.Pattove.views = { escape, styleName, styleReferences, header, filterBar, facetSearch, patternFilters, patterns, detail, styleGrid };
})();
