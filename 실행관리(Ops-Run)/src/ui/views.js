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
  // Filter bar under the header: one named button per criterion (종류 ▾, 영역 ▾ …) opens a checklist with counts, several at once.
  // No selection means everything; a button with picks goes dark with its count, and picks repeat below as removable tags. groups: [{key, label, options}].
  const count = n => n.toLocaleString('ko-KR') + '개';
  // The shared pop-up list: a title with a close button (shown on phones, where it rises from the bottom), then its own search past 12 rows.
  function facetPanel(id, label, rows, many) {
    return `<div class="facet-panel" id="${id}" popover aria-label="${escape(label)}">
        <div class="facet-head"><strong>${escape(label)}</strong><button type="button" class="facet-close" popovertarget="${id}" popovertargetaction="hide" aria-label="${escape(label)} 닫기">${icon('close')}</button></div>
        ${many ? `<input type="search" class="facet-search" data-facet-search placeholder="${escape(label)} 찾기" aria-label="${escape(label)} 찾기" autocomplete="off">` : ''}
        ${rows}
      </div>`;
  }
  function checkItem(key, option, nested) {
    const on = !!option.pressed;
    return `<label class="facet-option${nested ? ' is-nested' : ''}" data-facet-name="${escape(option.name.toLocaleLowerCase())}"><input type="checkbox" data-filter-check="${key}" value="${escape(option.id)}" data-focus="opt-${key}-${escape(option.id)}"${on ? ' checked' : ''}${!on && option.count === 0 ? ' disabled' : ''}><span>${escape(option.name)}</span><small>${option.count}</small></label>`
      + (option.children ? option.children.options.map(child => checkItem(option.children.key, child, true)).join('') : '');
  }
  function menu(group) {
    const selected = group.options.reduce((n, o) => n + (o.pressed ? 1 : 0) + (o.children ? o.children.options.filter(c => c.pressed).length : 0), 0);
    const id = 'facet-' + group.key;
    return `<button type="button" class="filter-menu${selected ? ' is-on' : ''}" popovertarget="${id}" data-focus="menu-${group.key}"><span>${escape(group.label)}</span>${selected ? `<span class="filter-menu-num"><span aria-hidden="true">· </span>${selected}<span class="sr-only">개 선택</span></span>` : ''}${icon('chevron-down')}</button>
      ${facetPanel(id, group.label, `<div class="facet-list" role="group" aria-label="${escape(group.label)}">${group.options.map(o => checkItem(group.key, o)).join('')}</div>`, group.options.length > 12)}`;
  }
  function filterBar({ groups, tags, query, total }) {
    const tagList = tags.map(t => `<button type="button" class="filter-tag" data-filter="${t.key}:${escape(t.id)}" data-focus="tag-${t.key}-${escape(t.id)}" aria-label="${escape(t.name)} 필터 끄기">${escape(t.name)}${icon('close')}</button>`).join('')
      + (query ? `<button type="button" class="filter-tag" data-action="clear-query" data-focus="tag-query" aria-label="검색어 ${escape(query)} 지우기">“${escape(query)}”${icon('close')}</button>` : '');
    return `<div class="filter-row"><div class="filter-scroll" role="group" aria-label="필터">${groups.map(menu).join('')}</div><p class="filter-count">${count(total)}</p></div>`
      + (tagList ? `<div class="filter-tags">${tagList}<button type="button" class="filter-clear" data-action="clear-filters" data-focus="filter-clear">모두 지우기</button></div>` : '');
  }
  function patternFilters(state, total) {
    const options = catalog.categories.filter(c => c.id !== 'all').map(c => ({ id: c.id, name: c.name, pressed: state.filters.category.includes(c.id) }));
    return filterBar({ groups: [{ key: 'category', label: '목적', options }], tags: options.filter(o => o.pressed).map(o => ({ key: 'category', ...o })), query: state.query, total });
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
          ${p.navigation('dock')}
        </div>
        <button type="button" class="style-choose" data-style-select="${style.id}" data-focus="style-${style.id}" aria-pressed="${active}">
          <strong>${escape(style.name)}</strong>
          ${active ? `<span class="style-badge">${icon('check')} 사용 중</span>` : ''}
        </button>
      </article>`;
    }).join('')}</div></section>`;
  }
  window.Pattove.views = { escape, styleName, styleReferences, header, filterBar, facetPanel, patternFilters, patterns, detail, styleGrid };
})();
