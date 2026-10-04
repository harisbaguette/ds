(() => {
  const { catalog, previews } = window.Pattove;
  const { preview, icon } = previews;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const styles = catalog.styles.filter(s => s.id !== 'base');
  const styleName = id => catalog.styles.find(s => s.id === id)?.name || '메인 스타일';
  function emptyState(state) {
    const searched=!!state.query;
    return `<div class="empty-state"><h2>${searched ? '검색 결과가 없어요' : '이 분류에는 아직 견본이 없어요'}</h2><p>${searched ? '검색어를 줄이거나 다른 이름으로 찾아보세요.' : '전체 목록에서 다른 항목을 살펴보세요.'}</p><button type="button" class="ds-button" data-variant="outline" data-action="${searched ? 'clear-query' : 'clear-filters'}" data-focus="empty-clear">${searched ? '검색어 지우기' : '전체 보기'}</button></div>`;
  }
  function styleReferences(style) {
    return `<p>${escape(style.rules)}</p>${style.references.length ? `<div class="reference-images">${style.references.map(ref => {
      const url = '영감보관함/이미지/' + ref.file.split('/').map(encodeURIComponent).join('/');
      return `<a href="${url}" target="_blank" rel="noopener" aria-label="${escape(ref.name)} 원본 새 탭에서 보기"><img src="${url}" alt="${escape(ref.name)}" loading="lazy"><span>${escape(ref.name)}</span></a>`;
    }).join('')}</div>` : ''}`;
  }
  // The style the specimens are drawn in: the one picked for preview, else the style the site wears.
  const previewStyle = state => state.preview || state.style;
  // Shown where built specimens are drawn (토큰·부품·블록·템플릿 and a part's page). Pressing a style redraws only the specimens.
  function stylePicker(state) {
    const shelf = ['dictionary','system'].includes(state.page) ? window.Pattove.libraryUI.shelfFor(state)?.id : null;
    if (!['token','part','block','template'].includes(shelf)) return '';
    const current = previewStyle(state);
    if (styles.length === 1) return state.page==='dictionary'?'':`<span class="preview-style-static" aria-label="미리보기 스타일: ${escape(styles[0].name)}">${escape(styles[0].name)}</span>`;
    return `<label class="preview-style"><span class="toolbar-label">미리보기 스타일</span><span class="preview-style-field"><select class="ds-input" data-preview-select data-focus="preview-style">${styles.map(s => `<option value="${escape(s.id)}"${s.id === current ? ' selected' : ''}>${escape(s.name)}${styles.length > 1 && s.id === state.style ? ' (사용 중)' : ''}</option>`).join('')}</select></span></label>`;
  }
  function header(state) {
    if (state.page === 'motion') return window.Pattove.motionUI.header(state);
    return headline(state);
  }
  function headline(state) {
    const library = window.Pattove.libraryUI;
    const shelf = ['dictionary','system'].includes(state.page) ? library.shelfFor(state) : null;
    if (state.page === 'styles' && state.detail) return `<h1 id="page-title" class="sr-only">${escape(styleName(state.detail))}</h1><nav class="content-breadcrumb" aria-label="현재 위치"><a href="#/styles" data-action="back-to-styles" data-focus="back-to-styles">스타일</a>${icon('chevron')}<span aria-current="page">${escape(styleName(state.detail))}</span></nav>`;
    if (state.page === 'system') {
      const item = window.Pattove.systemRegistry.index.get(state.detail);
      return `<h1 id="page-title" class="sr-only">${escape(item.name)}</h1><nav class="content-breadcrumb" aria-label="현재 위치"><a href="#/dictionary?shelf=${shelf.id}" data-action="back-to-list" data-focus="back-to-list">${escape(shelf.name)}</a>${icon('chevron')}<span aria-current="page">${escape(item.name)}</span></nav>`;
    }
    const current = document.querySelector('.nav-minor[aria-current="true"], .nav-subcategory[aria-current="true"]')?.textContent;
    return `<h1 id="page-title" class="collection-title">${escape(current || shelf?.name || ({styles:'스타일',patterns:'패턴',components:'구성요소'})[state.page])}</h1>`+(state.page==='dictionary'&&shelf.id!=='icon'?`<span class="collection-count">${library.currentItems(state).length.toLocaleString('ko-KR')}개</span>`:'');
  }
  function card(pattern, style) {
    const key = `${pattern.id}-${style}`;
    return `<article class="pattern-card" data-pattern="${pattern.id}">
      <div class="card-open ds-surface" data-material="raised">
        ${preview(pattern.id, style)}<button class="card-caption" data-open="${pattern.id}" data-style="${style}" data-focus="card-${key}" aria-label="${pattern.name} 상세, ${styleName(style)}"><strong>${pattern.name}</strong>${window.Pattove.references.label('pattern/'+pattern.id)}</button>
      </div>
    </article>`;
  }
  function patterns(state, results) {
    const style = styles.find(s => s.id === state.style);
    return `<section aria-labelledby="page-title">
      ${results.length ? `<div class="pattern-grid">${results.map(p => card(p, state.style)).join('')}</div>` : emptyState(state)}
      ${style ? `<details class="style-notes"><summary>${escape(style.name)}의 특징·참고 이미지 ${icon('chevron-down')}</summary>${styleReferences(style)}</details>` : ''}
    </section>`;
  }
  function detail(state, pattern) {
    const entry = window.Pattove.library.entries.find(e => e.id === pattern.entry);
    const style = styles.find(s => s.id === state.style);
    return `<header class="dialog-header"><div><span class="dialog-category">${styleName(state.style)} · ${catalog.categories.find(c => c.id === pattern.category).name}</span>
      <h2 id="detail-title" tabindex="-1">${pattern.name}</h2>${window.Pattove.references.control('pattern/'+pattern.id)}</div><button class="icon-button ds-button" data-variant="outline" data-icon-only data-action="close-dialog" aria-label="상세 닫기">${icon('close')}</button></header>
      <div class="detail-layout"><div class="detail-preview">${preview(pattern.id, state.style, true)}</div>
        <div class="detail-content">
          <div class="content-slot"><h3>언제 쓰나요?</h3><p class="pattern-usage">${escape(entry?.usage || pattern.name)}</p></div>
          ${style ? `<div class="content-slot"><h3>${escape(style.name)}의 표현</h3><p class="pattern-usage">${escape(style.rules)}</p></div>` : ''}
          ${entry ? `<a class="secondary ds-button pattern-dictionary-link" data-variant="outline" href="#/dictionary?code=${entry.category}&detail=${entry.id}">사전에서 자세히 보기 ${icon('arrow')}</a>` : ''}
        </div></div>`;
  }
  // 스타일 = the clothes the whole site wears. The tab lists every style as a card (picture: its collection screen);
  // a card opens that style's page, and 적용 switches the whole site to it.
  const inUse = `<span class="style-in-use">${icon('check')}사용 중</span>`;
  function styleGallery(state) {
    return `<section class="atlas dict" data-shelf="style" aria-labelledby="page-title"><div class="dict-grid dict-entries">${styles.map(s => `<div class="dict-entry ds-surface is-built style-card${s.id === state.style ? ' is-active' : ''}" data-style-card="${s.id}">
      <span class="dict-thumb atlas-preview" inert aria-hidden="true">${window.Pattove.componentDocs.live('page', {}, s.id, 'style-card-' + s.id)}</span>
      <a class="dict-hit" href="#/styles?detail=${encodeURIComponent(s.id)}" data-focus="style-card-${escape(s.id)}" aria-labelledby="style-name-${escape(s.id)} style-open-${escape(s.id)}" aria-describedby="style-description-${escape(s.id)}${s.id === state.style ? ' style-status-' + escape(s.id) : ''}">
        <span class="style-card-heading"><strong id="style-name-${escape(s.id)}">${escape(s.name)}</strong>${s.id === state.style ? `<span class="variant-kept style-card-status" id="style-status-${escape(s.id)}">${icon('check')}<span>사용 중</span></span>` : ''}</span>
        <span class="dict-term" id="style-description-${escape(s.id)}">${escape(s.description)}</span>
        <span class="style-card-footer">${window.Pattove.references.label('style/'+s.id)}<span class="style-card-open" id="style-open-${escape(s.id)}">자세히 보기 ${icon('arrow')}</span></span>
      </a>
    </div>`).join('')}</div>${window.Pattove.libraryUI.pagination(state,{n:1,pages:1,total:styles.length})}</section>`;
  }
  // One style's page: its real parts and a composed screen in that style, what it is for, and the switch.
  function styleDetail(state) {
    const s = styles.find(x => x.id === state.detail), id = s.id, p = window.Pattove.parts;
    const tile = (key,name,body,href='#/system?detail='+key) => `<article class="overview-tile ds-surface" data-overview="${key}"><div class="overview-preview ds theme-${id}" data-style="${id}" inert aria-hidden="true">${body}</div><a class="overview-link" href="${href}" data-focus="overview-${key}"><h2>${name}</h2>${icon('arrow')}</a></article>`;
    const list = (title, items) => items?.length ? `<div class="style-fact"><h3>${title}</h3><ul>${items.map(x => `<li>${escape(x)}</li>`).join('')}</ul></div>` : '';
    return `<article class="style-page" data-style-page="${id}" aria-labelledby="detail-title">
      <header class="component-heading style-heading"><div class="style-title-row"><a class="mobile-detail-back" href="#/styles" data-action="back-to-styles" data-focus="mobile-back" aria-label="스타일 목록으로 돌아가기">${icon('chevron-left')}</a><h2 id="detail-title" tabindex="-1">${escape(s.name)}</h2>${id===state.style?inUse:''}</div><p>${escape(s.description)}</p><div class="style-heading-actions">${window.Pattove.references.control('style/'+s.id,true)}${id!==state.style?`<button type="button" class="primary ds-button" data-variant="primary" data-style-select="${id}" data-focus="style-apply">이 스타일 적용</button>`:''}</div></header>
      <section class="style-overview" aria-label="${escape(s.name)} 미리보기">
      ${tile('button','버튼','<div class="preview-fit"><div class="preview-scene overview-actions" data-preview-scene>'+p.button({label:'계속하기'})+p.button({label:'취소',variant:'outline'})+p.button({label:'검색',iconName:'search',iconOnly:true})+'</div></div>')}
      ${tile('input','입력',p.field({id:'overview-field',label:'이름',placeholder:'이름을 입력하세요'}))}
      ${tile('page','컬렉션 화면',window.Pattove.componentDocs.live('page',{},id,'overview-page'))}
      ${tile('selection','선택',p.renderItem('checkbox','overview-checkbox')+p.renderItem('switch','overview-switch'),'#/dictionary?shelf=part&group=selection')}
      ${tile('bottom-nav','탐색','<div class="preview-fit"><div class="preview-scene" data-preview-scene>'+p.navigation('float')+'</div></div>')}
      ${tile('token-color','색·표면','<div class="overview-colors"><i></i><i></i><i></i><i></i></div><div class="overview-surfaces"><i></i><i></i><i></i></div>')}
      ${tile('card','카드',p.card({title:'봄의 색',description:'연한 초록과 따뜻한 노랑',action:'열기'}))}
      </section>
      <section class="style-facts" aria-label="${escape(s.name)} 규칙">
        <div class="style-fact"><h3>표현 규칙</h3><p>${escape(s.rules)}</p></div>
        ${s.suitability ? `<div class="style-fact"><h3>어울리는 곳</h3><p>${escape(s.suitability)}</p></div>` : ''}
        ${list('지키는 것', s.constraints)}
      </section>
    </article>`;
  }
  window.Pattove.views = { escape, styleName, previewStyle, stylePicker, styleReferences, header, patterns, detail, styleGallery, styleDetail, emptyState };
})();
