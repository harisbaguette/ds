(() => {
  const { catalog, previews } = window.Pattove;
  const { preview, stylePreview, icon } = previews;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const styles = catalog.styles.filter(s => s.id !== 'base');
  const styleName = id => catalog.styles.find(s => s.id === id)?.name || '선화';
  const palette = id => `<span class="swatches theme-${id}" aria-hidden="true"><i></i><i></i><i></i></span>`;
  function header(state) {
    if (state.page !== 'patterns') return `<h1 id="page-title" class="sr-only">${escape(state.page === 'docs' ? window.Pattove.libraryUI.documentName(state.doc) : ({styles:'스타일',saved:'저장',dictionary:'사전',components:'구성요소'})[state.page])}</h1>`;
    return `<div class="style-switcher">
      <h1 id="page-title"><button id="style-switch" data-action="style-menu" data-focus="style-switch" aria-expanded="false" aria-controls="style-menu" aria-label="스타일 바꾸기, ${styleName(state.style)}">${palette(state.style)}<span>${styleName(state.style)}</span>${icon('chevron-down')}</button></h1>
      <div class="style-menu" id="style-menu" role="group" aria-label="스타일 선택" hidden>${styles.map(s => `<button data-apply-style="${s.id}" aria-pressed="${state.style === s.id}">${palette(s.id)}<span>${s.name}</span>${state.style === s.id ? icon('check') : ''}</button>`).join('')}</div>
    </div>`;
  }
  function sidebar(state) {
    return catalog.categories.map(cat => `<button class="category" data-category="${cat.id}" data-focus="category-${cat.id}" aria-pressed="${state.category === cat.id}">${cat.name}</button>`).join('');
  }
  function card(pattern, style, state, saved = false) {
    const key = `${pattern.id}-${style}`;
    const isSaved = state.saved.some(item => item.id === pattern.id && item.style === style);
    return `<article class="pattern-card" data-pattern="${pattern.id}">
      <button class="card-open" data-open="${pattern.id}" data-style="${style}" data-focus="card-${key}" aria-label="${pattern.name} 상세, ${styleName(style)}">
        ${preview(pattern.id, style)}<div class="card-caption"><h2>${pattern.name}</h2></div>
      </button>
      <button class="card-save icon-button" ${saved ? 'data-remove' : 'data-quick-save'}="${pattern.id}" data-style="${style}" data-focus="save-${key}"
        aria-label="${pattern.name} ${isSaved ? '저장 해제' : '저장'}" aria-pressed="${isSaved}">${icon('bookmark')}</button>
    </article>`;
  }
  function filterStatus(state, count) {
    if (!state.query) return '';
    return `<div class="search-summary"><span>“${escape(state.query)}” <span class="result-count">${count}</span></span><button data-action="clear-query" aria-label="검색 해제">${icon('close')}</button></div>`;
  }
  function patterns(state, results) {
    return `<section aria-labelledby="page-title">${filterStatus(state, results.length)}
      ${results.length ? `<div class="pattern-grid">${results.map(p => card(p, state.style, state)).join('')}</div>` : `<div class="empty-state"><span class="empty-generated nav-sprite nav-sprite-search" aria-hidden="true"></span><h2>검색 결과가 없어요</h2><button class="secondary" data-action="reset">전체 보기</button></div>`}
    </section>`;
  }
  function styleOverview() {
    return `<section aria-labelledby="page-title"><div class="style-grid">${styles.map(style => `
      <a class="style-card" href="#/patterns?style=${style.id}" data-apply-style="${style.id}" aria-label="${style.name} 스타일 열기">
        <div class="style-cover">${stylePreview(style.id, 'focus')}</div>
        <div class="style-caption">${palette(style.id)}<h2>${style.name}</h2>${icon('arrow')}</div>
      </a>`).join('')}</div></section>`;
  }
  function saved(state, results) {
    const groups = catalog.styles.map(s => ({ ...s, items: results.filter(item => item.style === s.id) })).filter(s => s.items.length);
    return `<section aria-labelledby="page-title">${filterStatus(state, results.length)}${groups.length ? groups.map(group => `
      <section class="saved-group" aria-label="${group.name} 저장한 패턴"><a class="saved-group-title" href="#/patterns?style=${group.id}" data-apply-style="${group.id}">${palette(group.id)}<h2>${group.name}</h2>${icon('arrow')}</a>
        <div class="pattern-grid">${group.items.map(item => card(catalog.patterns.find(p => p.id === item.id), item.style, state, true)).join('')}</div></section>`).join('') : `
      <div class="empty-state"><span class="empty-generated nav-sprite nav-sprite-bookmark" aria-hidden="true"></span><h2>${state.query ? '검색 결과가 없어요' : '아직 저장한 패턴이 없어요'}</h2>
        ${state.query ? '<button class="secondary" data-action="clear-query">검색 해제</button>' : '<a class="secondary" href="#/styles">스타일 둘러보기</a>'}</div>`}</section>`;
  }
  function detail(state, pattern) {
    const isSaved = state.saved.some(item => item.id === pattern.id && item.style === state.style);
    return `<header class="dialog-header"><div><span class="dialog-category">${styleName(state.style)} · ${catalog.categories.find(c => c.id === pattern.category).name}</span>
      <h2 id="detail-title" tabindex="-1">${pattern.name}</h2></div><button class="icon-button" data-action="close-dialog" aria-label="상세 닫기">${icon('close')}</button></header>
      <div class="detail-layout"><div class="detail-preview">${preview(pattern.id, state.style, true)}</div>
        <div class="detail-content"><p class="pending-label">상세 내용 준비 중</p>
          <div class="content-slot"><h3>용도</h3><div class="pending-copy" aria-label="본문 미작성">—</div></div>
          <div class="content-slot"><h3>피할 때</h3><div class="pending-copy" aria-label="본문 미작성">—</div></div>
          <details class="content-slot"><summary>설계 메모</summary><span class="slot-label">아직 작성되지 않았어요.</span></details>
        </div></div>
      <footer class="dialog-footer"><button class="primary" data-save="${pattern.id}" data-focus="detail-save" aria-pressed="${isSaved}">${icon(isSaved ? 'check' : 'bookmark')}${isSaved ? '저장됨' : '패턴 저장'}</button></footer>`;
  }
  window.Pattove.views = { escape, styleName, header, sidebar, patterns, styles: styleOverview, saved, detail };
})();
