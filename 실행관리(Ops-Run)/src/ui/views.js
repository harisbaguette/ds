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
  function sidebar(state) {
    return catalog.categories.map(cat => `<button class="category" data-category="${cat.id}" data-focus="category-${cat.id}" aria-pressed="${state.category === cat.id}">${cat.name}</button>`).join('');
  }
  function card(pattern, style) {
    const key = `${pattern.id}-${style}`;
    return `<article class="pattern-card" data-pattern="${pattern.id}">
      <button class="card-open" data-open="${pattern.id}" data-style="${style}" data-focus="card-${key}" aria-label="${pattern.name} 상세, ${styleName(style)}">
        ${preview(pattern.id, style)}<div class="card-caption"><h2>${pattern.name}</h2></div>
      </button>
    </article>`;
  }
  function filterStatus(state, count) {
    if (!state.query) return '';
    return `<div class="search-summary"><span>“${escape(state.query)}” <span class="result-count">${count}</span></span><button data-action="clear-query" aria-label="검색 해제">${icon('close')}</button></div>`;
  }
  function patterns(state, results) {
    const style = styles.find(s => s.id === state.style);
    return `<section aria-labelledby="page-title">${filterStatus(state, results.length)}
      ${results.length ? `<div class="pattern-grid">${results.map(p => card(p, state.style)).join('')}</div>` : `<div class="empty-state"><span class="empty-generated nav-sprite nav-sprite-search" aria-hidden="true"></span><h2>검색 결과가 없어요</h2><button class="secondary" data-action="reset">전체 보기</button></div>`}
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
          ${entry ? `<a class="secondary pattern-dictionary-link" href="#/dictionary?category=${entry.category}&detail=${entry.id}">사전에서 자세히 보기 ${icon('arrow')}</a>` : ''}
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
  window.Pattove.views = { escape, styleName, styleReferences, header, sidebar, patterns, detail, styleGrid };
})();
