(() => {
  const { catalog, previews } = window.Pattove;
  const { preview, icon } = previews;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const styles = catalog.styles.filter(s => s.id !== 'base');
  const styleName = id => catalog.styles.find(s => s.id === id)?.name || '메인 스타일';
  const palette = id => `<span class="swatches theme-${id}" aria-hidden="true"><i></i><i></i><i></i></span>`;
  function styleReferences(style) {
    return `<p>${escape(style.rules)}</p>${style.references.length ? `<div class="reference-images">${style.references.map(ref => {
      const url = '영감보관함/이미지/' + ref.file.split('/').map(encodeURIComponent).join('/');
      return `<a href="${url}" target="_blank" rel="noopener" aria-label="${escape(ref.name)} 원본 새 탭에서 보기"><img src="${url}" alt="${escape(ref.name)}" loading="lazy"><span>${escape(ref.name)}</span></a>`;
    }).join('')}</div>` : ''}`;
  }
  function header(state) {
    return `<h1 id="page-title" class="sr-only">${escape(state.page === 'docs' ? window.Pattove.libraryUI.documentName(state.doc) : ({styles:'메인 스타일',system:'메인 스타일',patterns:'패턴',saved:'저장',dictionary:'사전',components:'구성요소'})[state.page])}</h1>`;
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
    const style = styles.find(s => s.id === state.style);
    return `<section aria-labelledby="page-title"><label class="legacy-mobile-category"><span class="sr-only">패턴 분류</span><select data-legacy-category>${catalog.categories.map(c=>`<option value="${c.id}"${c.id===state.category?' selected':''}>${c.name}</option>`).join('')}</select></label>${filterStatus(state, results.length)}
      ${results.length ? `<div class="pattern-grid">${results.map(p => card(p, state.style, state)).join('')}</div>` : `<div class="empty-state"><span class="empty-generated nav-sprite nav-sprite-search" aria-hidden="true"></span><h2>검색 결과가 없어요</h2><button class="secondary" data-action="reset">전체 보기</button></div>`}
      ${style ? `<details class="style-notes"><summary>${escape(style.name)}의 특징·참고 이미지 ${icon('chevron-down')}</summary>${styleReferences(style)}</details>` : ''}
    </section>`;
  }
  function saved(state, results) {
    const groups = catalog.styles.map(s => ({ ...s, items: results.filter(item => item.style === s.id) })).filter(s => s.items.length);
    return `<section aria-labelledby="page-title"><label class="legacy-mobile-category"><span class="sr-only">패턴 분류</span><select data-legacy-category>${catalog.categories.map(c=>`<option value="${c.id}"${c.id===state.category?' selected':''}>${c.name}</option>`).join('')}</select></label>${filterStatus(state, results.length)}${groups.length ? groups.map(group => `
      <section class="saved-group" aria-label="${group.name} 저장한 패턴"><a class="saved-group-title" href="#/patterns?style=${group.id}">${palette(group.id)}<h2>${group.name}</h2>${icon('arrow')}</a>
        <div class="pattern-grid">${group.items.map(item => card(catalog.patterns.find(p => p.id === item.id), item.style, state, true)).join('')}</div></section>`).join('') : `
      <div class="empty-state"><span class="empty-generated nav-sprite nav-sprite-bookmark" aria-hidden="true"></span><h2>${state.query ? '검색 결과가 없어요' : '아직 저장한 패턴이 없어요'}</h2>
        ${state.query ? '<button class="secondary" data-action="clear-query">검색 해제</button>' : '<a class="secondary" href="#/styles">스타일 둘러보기</a>'}</div>`}</section>`;
  }
  function detail(state, pattern) {
    const isSaved = state.saved.some(item => item.id === pattern.id && item.style === state.style);
    const entry = window.Pattove.library.entries.find(e => e.id === pattern.entry);
    const style = styles.find(s => s.id === state.style);
    return `<header class="dialog-header"><div><span class="dialog-category">${styleName(state.style)} · ${catalog.categories.find(c => c.id === pattern.category).name}</span>
      <h2 id="detail-title" tabindex="-1">${pattern.name}</h2></div><button class="icon-button" data-action="close-dialog" aria-label="상세 닫기">${icon('close')}</button></header>
      <div class="detail-layout"><div class="detail-preview">${preview(pattern.id, state.style, true)}</div>
        <div class="detail-content">
          <div class="content-slot"><h3>언제 쓰나요?</h3><p class="pattern-usage">${escape(entry?.usage || pattern.name)}</p></div>
          ${style ? `<div class="content-slot"><h3>${escape(style.name)}의 표현</h3><p class="pattern-usage">${escape(style.rules)}</p></div>` : ''}
          ${entry ? `<a class="secondary pattern-dictionary-link" href="#/dictionary?category=${entry.category}&detail=${entry.id}">사전에서 자세히 보기 ${icon('arrow')}</a>` : ''}
        </div></div>
      <footer class="dialog-footer"><span class="preview-note">스타일 미리보기</span><button class="primary" data-save="${pattern.id}" data-focus="detail-save" aria-pressed="${isSaved}">${icon(isSaved ? 'check' : 'bookmark')}${isSaved ? '저장됨' : '패턴 저장'}</button></footer>`;
  }
  window.Pattove.views = { escape, styleName, styleReferences, header, sidebar, patterns, saved, detail };
})();
