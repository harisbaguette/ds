(() => {
  'use strict';
  const { catalog, views, previews, libraryUI: library, systemUI: system, systemRegistry, componentDocs } = window.Pattove;
  const isCollection = () => ['dictionary', 'components'].includes(state.page);
  const $ = selector => document.querySelector(selector);
  const validPattern = id => catalog.patterns.some(p => p.id === id);
  const validStyle = id => catalog.styles.some(s => s.id === id);
  // 스타일 화면에서 고른 디자인 스타일은 앱 전체에 입혀지고 다음 방문에도 유지된다.
  const styleKey = 'pattove-style';
  const storedStyle = (() => { try { return localStorage.getItem(styleKey); } catch { return null; } })();
  // 부품·블록·템플릿 화면의 견본만 다른 스타일로 그려 보는 선택. 사이트는 그대로이고, 이번 방문 동안 탭을 옮겨도 유지된다.
  const previewKey = 'pattove-preview-style';
  const storedPreview = (() => { try { return sessionStorage.getItem(previewKey); } catch { return null; } })();
  const state = {
    page: 'styles', filters: {}, query: '', style: validStyle(storedStyle) ? storedStyle : 'main', preview: validStyle(storedPreview) ? storedPreview : null, detail: null, options: {}, section: '', pageNo: 1
  };
  let lastOpener = null;
  let renderedHash = '';
  let suggestions = [];
  let suggestionIndex = -1;
  let mainRenderKey = '';
  history.scrollRestoration = 'manual';
  const dialog = $('#detail-dialog');
  // Search is used rarely, so it lives in one modal opened from the top bar's search button (or /).
  const searchDialog = $('#search-dialog');

  // In-page anchors clear the persistent style/search header at every viewport size.
  function updateChromeOffset() {
    const bar = $('.app-top');
    const shown = bar.getClientRects().length && getComputedStyle(bar).position === 'sticky';
    document.documentElement.style.setProperty('--chrome-bottom', `${shown ? Math.ceil(bar.getBoundingClientRect().height + 16) : 16}px`);
  }
  const list = value => [...new Set(String(value || '').split(',').filter(Boolean))];
  function readFilters(page, params) {
    if (page === 'patterns') return { category: list(params.get('category')).filter(id => id !== 'all' && catalog.categories.some(c => c.id === id)) };
    return isCollection() ? library.readFilters(page, params) : {};
  }
  const cleared = filters => Object.fromEntries(Object.entries(filters).map(([key, value]) => [key, Array.isArray(value) ? [] : value]));
  const phone = matchMedia('(max-width: 760px)');
  function rememberLocation(focus = document.activeElement?.dataset.focus) {
    history.replaceState({...history.state,pattoveScroll:[scrollX,scrollY],pattoveFocus:focus},'',location.href);
  }
  function hash(overrides = {}) {
    const next = { ...state, ...overrides };
    const params = new URLSearchParams();
    if (next.page === 'patterns') params.set('style', next.style);
    if (next.page === 'patterns' && next.filters.category?.length) params.set('category', next.filters.category.join(','));
    if (library.pages.includes(next.page)) library.writeFilters(next, params);
    if (next.query && !['styles'].includes(next.page)) params.set('q', next.query);
    if (['dictionary', 'components'].includes(next.page) && next.pageNo > 1) params.set('p', next.pageNo);
    if (next.detail) params.set('detail', next.detail);
    if (next.page === 'system' && next.detail) {
      if (next.section) params.set('section', next.section);
      const defaults = systemRegistry.normalizeOptions(next.detail, componentDocs.defaults(next.detail));
      for (const [key, value] of Object.entries(systemRegistry.normalizeOptions(next.detail, next.options))) if (value !== defaults[key]) params.set('option-' + key, value);
    }
    const query = params.toString();
    return `#/${next.page}${query ? `?${query}` : ''}`;
  }
  function readRoute() {
    const [path, query = ''] = location.hash.slice(1).split('?');
    const params = new URLSearchParams(query);
    const page = path.replace(/^\//, '');
    state.page = ['styles', 'patterns', 'system', ...library.pages].includes(page) ? page : 'styles';
    state.filters = readFilters(state.page, params);
    state.query = ['styles'].includes(state.page) ? '' : (params.get('q') || '').slice(0, 100);
    state.section = (params.get('section') || '').slice(0, 250);
    state.pageNo = Math.min(9999, Math.max(1, Number.parseInt(params.get('p'), 10) || 1));
    if (validStyle(params.get('style'))) state.style = params.get('style');
    state.detail = (state.page === 'styles' ? validStyle(params.get('detail')) && params.get('detail') !== 'base' : state.page === 'system' ? systemRegistry.index.has(params.get('detail')) : isCollection() ? library.validDetail(state.page, params.get('detail')) : state.page === 'patterns' && validPattern(params.get('detail'))) ? params.get('detail') : null;
    if (state.page === 'system' && !state.detail) { state.detail = (systemRegistry.matching(state.query)[0] || systemRegistry.items[0]).id; state.query = ''; }
    state.options = state.page === 'system' && state.detail ? systemRegistry.normalizeOptions(state.detail, { ...componentDocs.defaults(state.detail), ...Object.fromEntries([...params].filter(([key]) => key.startsWith('option-')).map(([key,value]) => [key.slice(7),value])) }) : {};
    if (isCollection()) state.pageNo = Math.min(state.pageNo, library.pageCount(state));
    if (state.page === 'dictionary' && state.detail) {
      const implementation = systemRegistry.index.get(state.detail) || systemRegistry.items.find(i=>i.entry===state.detail);
      if (implementation) { state.page='system'; state.detail=implementation.id; state.filters={}; state.options=systemRegistry.normalizeOptions(implementation.id, componentDocs.defaults(implementation.id)); }
    }
  }
  function navigate(overrides, { replace = false, overlay = false, opener } = {}) {
    rememberLocation(opener);
    if (overlay && state.page !== 'system' && !state.detail) lastOpener = opener || document.activeElement?.dataset.focus || null;
    const entry = overlay && state.page !== 'system' ? { pattoveOverlay: true, origin: history.state?.pattoveOverlay ? history.state.origin : location.hash, depth: (history.state?.pattoveOverlay ? history.state.depth || 1 : 0) + 1 } : {};
    if (replace) history.replaceState(state.detail ? history.state : entry, '', hash(overrides));
    else history.pushState(entry, '', hash(overrides));
    renderRoute();
  }
  function closeDetail() {
    if (history.state?.pattoveOverlay && history.state.origin) history.go(-(history.state.depth || 1));
    else navigate({ detail: null }, { replace: true });
  }
  function focusKey(key) {
    if (!key) return false;
    const element = document.querySelector(`[data-focus="${CSS.escape(key)}"]`);
    element?.focus({ preventScroll: true });
    return !!element && document.activeElement === element;
  }
  function matches(pattern, query) {
    const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    const text = `${pattern.name} ${pattern.english} ${pattern.keywords}`.toLocaleLowerCase();
    return terms.every(term => text.includes(term));
  }
  function results() {
    return catalog.patterns.filter(p => (!state.filters.category.length || state.filters.category.includes(p.category)) && matches(p, state.query));
  }
  function hideSuggestions() {
    $('#search-popover').hidden = true;
    $('#query').setAttribute('aria-expanded', 'false');
    $('#query').removeAttribute('aria-activedescendant');
    suggestions = []; suggestionIndex = -1;
  }
  function showSuggestions() {
    const query = $('#query').value.trim();
    if (!query) { hideSuggestions(); return; }
    suggestions = state.page === 'styles' ? library.searchAll(query) : state.page === 'system' ? systemRegistry.matching(query).filter(i=>library.itemShelf(i)===library.shelfFor(state).id).slice(0, 6) : isCollection() ? library.suggestions(state, query) : catalog.patterns.filter(p => matches(p, query)).slice(0, 6);
    suggestionIndex = -1;
    $('#search-suggestions').innerHTML = suggestions.length ? suggestions.map((p, i) => `<button type="button" role="option" aria-selected="false" tabindex="-1" class="search-suggestion" id="suggestion-${i}" data-suggest-open="${p.id}"><span>${views.escape(p.name)}</span><small>${views.escape(state.page === 'styles' ? library.suggestionGroup('dictionary',p) : state.page === 'system' ? p.layer : isCollection() ? library.suggestionGroup(state.page, p) : catalog.categories.find(c => c.id === p.category).name)}</small></button>`).join('') : '<p class="search-no-match">일치하는 항목이 없어요</p>';
    $('#search-popover').hidden = false;
    $('#query').setAttribute('aria-expanded', 'true');
    $('#query').removeAttribute('aria-activedescendant');
  }
  function openSearch() {
    setMenu(false, false);
    if (!searchDialog.open) searchDialog.showModal();
    $('#query').value = state.query;
    $('#search-clear').hidden = !state.query;
    $('#query').select();
    showSuggestions();
  }
  function closeSearch() {
    hideSuggestions();
    if (searchDialog.open) searchDialog.close();
  }
  // Detail search returns to its category's results; the query stays in the address.
  function submitSearch() {
    const query = $('#query').value.trim();
    closeSearch();
    setMenu(false, false);
    if (['styles','system'].includes(state.page)) {
      rememberLocation();
      const shelf = state.page === 'system' ? library.shelfFor(state).id : library.searchAll(query)[0]?.shelf || 'part';
      history.pushState({}, '', '#/dictionary?shelf='+shelf + (query ? '&q=' + encodeURIComponent(query) : '')); renderRoute();
    }
    // Like its suggestions, a search covers the whole tab, so the left rail's pick is dropped.
    else navigate({ query, filters: cleared(state.filters), detail: null, section: '', pageNo: 1 }, { replace: true });
    $('#main').focus({ preventScroll: true });
  }
  // Phones use a navigation-only drawer. Closing by hand returns focus to the menu button.
  function setMenu(open, returnFocus = true) {
    if (open && $('#app-menu').hidden) return;
    if (open === document.documentElement.classList.contains('menu-open')) return;
    document.documentElement.classList.toggle('menu-open', open);
    $('#menu-toggle').setAttribute('aria-expanded', String(open));
    $('#main').inert = open;
    $('.app-top').inert = open;
    if (open) ($('#secondary-nav [aria-current]') || $('#secondary-nav a'))?.focus();
    else if (returnFocus) $('#menu-toggle').focus();
  }
  // A picked suggestion opens its detail; closing the detail returns focus to the search button.
  function openSuggestion(id) {
    const entry = suggestions.find(e=>e.id===id);
    closeSearch();
    setMenu(false, false);
    $('#search-open').focus({ preventScroll: true });
    if (state.page === 'styles') navigate({page:'dictionary',filters:library.readFilters('dictionary',new URLSearchParams({shelf:entry.shelf})),detail:id},{overlay:true,opener:'search-open'});
    else navigate({ detail: id }, { overlay: true, opener: 'search-open' });
    lastOpener = 'search-open';
  }
  function render(previousDetail = state.detail, focus = document.activeElement?.dataset.focus) {
    if (state.preview === state.style) state.preview = null;
    document.body.dataset.page = state.page;
    document.body.className = 'theme-' + state.style;
    document.title = `${state.page==='system' && state.detail ? systemRegistry.index.get(state.detail).name : state.page === 'styles' && state.detail ? views.styleName(state.detail) : state.page === 'patterns' ? views.styleName(state.style) : ({ styles: '스타일', components: '구성요소', dictionary: '사전' })[state.page]}`;
    const oldShelf = $('#primary-nav [aria-current="page"]')?.dataset.focus;
    const subnavScroll = $('.menu-body').scrollTop;
    $('#primary-nav').innerHTML = library.navigation(state);
    const subnav=library.subnavigation(state);
    $('#secondary-nav').innerHTML=subnav;
    $('#app-menu').hidden=!subnav;
    $('#menu-toggle').hidden=!subnav;
    if (!subnav) setMenu(false,false);
    document.body.classList.toggle('has-subnav',!!subnav);
    $('#top-title').textContent=$('#primary-nav [aria-current="page"]')?.textContent || '';
    $('.menu-body').scrollTop=oldShelf === $('#primary-nav [aria-current="page"]')?.dataset.focus ? subnavScroll : 0;
    $('#header-context').innerHTML = views.header(state);
    // The one active query shows as a chip beside the title; pressing it clears the search.
    const chip = $('#query-chip');
    chip.hidden = !state.query || state.page === 'system';
    chip.innerHTML = state.query ? `‘${views.escape(state.query)}’ 검색${previews.icon('close')}` : '';
    chip.setAttribute('aria-label', `검색어 ${state.query} 지우기`);
    const searchLabel = ['dictionary','system'].includes(state.page) ? library.shelfFor(state).name+' 검색' : ['styles','components'].includes(state.page) ? '구성요소 검색' : '패턴 검색';
    $('#query').placeholder = searchLabel;
    $('#query').setAttribute('aria-label', searchLabel);
    $('#search-open').setAttribute('aria-label', searchLabel);
    $('#search-open').title = searchLabel + ' (/)';
    const nextMainKey = JSON.stringify([state.page, state.style, state.preview, state.filters, state.query, state.pageNo, state.page==='system'?[state.detail,state.options]:state.page==='styles'?state.detail:null]);
    if (mainRenderKey !== nextMainKey) {
      $('#content').innerHTML = state.page === 'styles' ? (state.detail ? views.styleDetail(state) : views.styleGallery(state)) : state.page === 'system' ? system.detail(state) : isCollection() ? library.collection(state) : views.patterns(state, results());
      mainRenderKey = nextMainKey;
    }
    if (state.detail && !['system','styles'].includes(state.page)) {
      const scroll = dialog.scrollTop;
      dialog.innerHTML = state.page === 'system' ? system.detail(state) : isCollection() ? library.detail(state) : views.detail(state, catalog.patterns.find(p => p.id === state.detail));
      if (!dialog.open) dialog.showModal();
      if (previousDetail === state.detail && focusKey(focus)) dialog.scrollTop = scroll;
      else $('#detail-title').focus({ preventScroll: true });
    } else {
      if (dialog.open) dialog.close();
      dialog.replaceChildren();
      if (['system','styles'].includes(state.page) && state.detail) {
        if (previousDetail !== state.detail) $('#detail-title').focus({preventScroll:true});
        else focusKey(focus);
      } else if (previousDetail) {
        if (!focusKey(lastOpener)) $('#main').focus({ preventScroll: true });
        lastOpener = null;
      } else focusKey(focus);
    }
    system.hydrate(document);
    updateChromeOffset();
  }
  function renderRoute({ restore = false } = {}) {
    hideSuggestions();
    const previousPage = state.page;
    const previousDetail = state.detail;
    const previousStyle = state.style;
    const previousShelf = state.filters.shelf;
    const previousPageNo = state.pageNo;
    const previousFilters = JSON.stringify(state.filters);
    const focus = document.activeElement?.dataset.focus;
    readRoute();
    const canonical = hash();
    if (location.hash !== canonical) history.replaceState(history.state, '', canonical);
    $('#query').value = state.query;
    render(previousDetail, focus);
    renderedHash = location.hash;
    // A new page or tab moves focus to the content; a filter change only returns to the top and leaves focus where it was.
    if (previousPage !== state.page || (['system','styles'].includes(state.page) && previousDetail!==state.detail) || (!state.detail && (previousStyle !== state.style || previousShelf !== state.filters.shelf || previousPageNo !== state.pageNo))) {
      window.scrollTo(0, 0);
      if (!state.detail) $('#main').focus({ preventScroll: true });
    } else if (!state.detail && previousFilters !== JSON.stringify(state.filters)) window.scrollTo(0, 0);
    if (state.page==='system' && state.detail && state.section) {
      const section = document.getElementById('component-'+state.section);
      if (section) { section.tabIndex=-1; section.focus({preventScroll:true}); section.scrollIntoView({block:'start'}); }
    }
    if (restore) {
      focusKey(history.state?.pattoveFocus);
      if (history.state?.pattoveScroll) window.scrollTo(...history.state.pattoveScroll);
    }
    $('#announcer').textContent = state.page === 'styles' ? (state.detail ? views.styleName(state.detail) : `스타일 ${catalog.styles.filter(s => s.id !== 'base').length}개 · ${views.styleName(state.style)} 사용 중`) : state.page === 'system' ? systemRegistry.index.get(state.detail).name : `${isCollection() ? '항목' : '패턴'} ${isCollection() ? library.currentItems(state).length : results().length}개${isCollection() && library.pageCount(state) > 1 ? ` · ${state.pageNo} / ${library.pageCount(state)}쪽` : ''}`;
  }
  document.addEventListener('click', event => {
    if (!event.target.closest('.search-area, #search-open')) hideSuggestions();
    const target = event.target.closest('button, a');
    if (!target || target.disabled) return;
    const data = target.dataset;
    if (target.matches('a') && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
    if (target.classList.contains('skip-link')) { event.preventDefault(); $('#main').focus(); return; }
    if (data.styleSelect && validStyle(data.styleSelect)) {
      state.style = data.styleSelect;
      try { localStorage.setItem(styleKey, state.style); } catch {}
      render();
      $('#detail-title')?.focus({ preventScroll: true });
      $('#announcer').textContent = `${views.styleName(state.style)} 적용함`;
    }
    else if (data.previewStyle && validStyle(data.previewStyle)) {
      state.preview = data.previewStyle === state.style ? null : data.previewStyle;
      try { state.preview ? sessionStorage.setItem(previewKey, state.preview) : sessionStorage.removeItem(previewKey); } catch {}
      render();
      $('#announcer').textContent = `${views.styleName(data.previewStyle)}로 미리보기`;
    }
    else if (data.action === 'back-to-list' && history.state?.pattoveOverlay && new URLSearchParams(history.state.origin?.split('?')[1]).get('shelf') === library.shelfFor(state).id) {
      event.preventDefault(); rememberLocation(); history.go(-(history.state.depth || 1));
    } else if (target.matches('a[href^="#/"]')) {
      event.preventDefault();
      if (target.closest('#app-menu')) setMenu(false, false);
      rememberLocation();
      const related = state.page === 'system' && target.getAttribute('href').startsWith('#/system') && history.state?.pattoveOverlay;
      history.pushState(related ? {pattoveOverlay:true,origin:history.state.origin,depth:(history.state.depth||1)+1} : {}, '', target.getAttribute('href'));
      renderRoute();
    } else if (data.suggestOpen) openSuggestion(data.suggestOpen);
    else if (data.libraryEntry) navigate({ detail: data.libraryEntry }, { overlay: true, opener: data.focus });
    else if (data.open) navigate({ detail: data.open, style: data.style || state.style }, { overlay: true, opener: data.focus });
    else if (data.action === 'clear-filters' || data.action === 'clear-query') {
      // Clearing removes the clicked control, so focus moves to the content.
      navigate({ filters: data.action === 'clear-filters' ? cleared(state.filters) : state.filters, query: '', pageNo: 1 }, { replace: true });
      $('#main').focus({ preventScroll: true });
    }
    else if (data.pageGo) navigate({ pageNo: Number(data.pageGo) }, { replace: true });
    else if (data.action === 'search-all') submitSearch();
    else if (data.action === 'close-dialog') closeDetail();
    else if (data.action === 'close-menu') setMenu(false);
    else if (data.variantPick) pickVariant(data.variantPick);
  });
  // Pressing a shape card makes it the shape this part uses, here and everywhere the part is drawn.
  function pickVariant(value) {
    const g = systemRegistry.index.get(state.detail)?.gallery, look = g?.list.find(v => v.id === value);
    if (!look) return;
    componentDocs.choose(state.detail, value);
    state.options = systemRegistry.normalizeOptions(state.detail, { ...state.options, [g.key]: value });
    history.replaceState(history.state, '', hash()); renderedHash = location.hash;
    componentDocs.refresh(state);
    $('#announcer').textContent = `${look.name} 사용 중`;
  }
  // On wide screens the side menu folds to a narrow rail; the choice is kept for the next visit.
  const railKey = 'pattove-rail';
  function setRail(collapsed) {
    document.documentElement.classList.toggle('rail', collapsed);
    const label = collapsed ? '사이드 메뉴 펼치기' : '사이드 메뉴 접기';
    $('#rail-toggle').setAttribute('aria-label', label);
    $('#rail-toggle').setAttribute('aria-expanded', String(!collapsed));
    $('#rail-toggle').title = label;
    try { localStorage.setItem(railKey, collapsed ? '1' : ''); } catch {}
  }
  try { if (localStorage.getItem(railKey)) setRail(true); } catch {}
  $('#rail-toggle').addEventListener('click', () => setRail(!document.documentElement.classList.contains('rail')));
  $('#menu-toggle').addEventListener('click', () => setMenu(true));
  $('#search-open').addEventListener('click', openSearch);
  $('#menu-backdrop').addEventListener('click', () => setMenu(false));
  phone.addEventListener('change', () => setMenu(false, false));
  $('#search-clear').addEventListener('click', () => {
    $('#query').value = '';
    $('#search-clear').hidden = true;
    $('#query').focus();
    hideSuggestions();
  });
  document.addEventListener('submit', event => {
    if (!event.target.matches('[data-page-jump]')) return;
    event.preventDefault();
    const input = event.target.querySelector('input'), to = Number.parseInt(input.value, 10);
    if (!to) { input.focus(); return; }
    navigate({ pageNo: Math.min(Math.max(to, 1), library.pageCount(state)) }, { replace: true });
  });
  $('#search-form').addEventListener('submit', event => { event.preventDefault(); submitSearch(); });
  $('#query').addEventListener('input', () => { $('#search-clear').hidden = !$('#query').value; showSuggestions(); });
  $('#query').addEventListener('focus', showSuggestions);
  $('.search-area').addEventListener('focusout', () => setTimeout(() => { if (!$('.search-area').contains(document.activeElement)) hideSuggestions(); }, 0));
  $('#query').addEventListener('keydown', event => {
    if (event.key === 'Escape') return;
    if (event.key === 'Enter' && suggestionIndex >= 0 && !$('#search-popover').hidden) {
      event.preventDefault(); openSuggestion(suggestions[suggestionIndex].id); return;
    }
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    if ($('#search-popover').hidden) showSuggestions();
    if (!suggestions.length) return;
    suggestionIndex = suggestionIndex < 0 ? (event.key === 'ArrowDown' ? 0 : suggestions.length - 1)
      : (suggestionIndex + (event.key === 'ArrowDown' ? 1 : -1) + suggestions.length) % suggestions.length;
    [...$('#search-suggestions').children].forEach((el, i) => el.setAttribute('aria-selected', String(i === suggestionIndex)));
    $('#query').setAttribute('aria-activedescendant', `suggestion-${suggestionIndex}`);
  });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !dialog.open && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input,textarea,select,[contenteditable="true"]')) {
      event.preventDefault();
      openSearch();
    } else if (event.key === 'Escape' && document.documentElement.classList.contains('menu-open')) { event.preventDefault(); setMenu(false); }
    else if (event.key === 'Tab' && document.documentElement.classList.contains('menu-open')) {
      const nodes = [...$('#app-menu').querySelectorAll('a,button,input,summary')].filter(e=>!e.disabled&&e.checkVisibility());
      const first=nodes[0],last=nodes.at(-1);
      if (event.shiftKey && document.activeElement===first) { event.preventDefault();last.focus(); }
      else if (!event.shiftKey && document.activeElement===last) { event.preventDefault();first.focus(); }
    }
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab' || !dialog.open || event.ctrlKey || event.metaKey || event.altKey) return;
    const focusable = [...dialog.querySelectorAll('button, a[href], summary, input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter(el => !el.disabled && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeDetail(); });
  searchDialog.addEventListener('close', hideSuggestions);
  searchDialog.addEventListener('click', event => {
    if (event.target !== searchDialog) return;
    const r = $('#search-dialog > .search-area').getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeSearch();
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDetail();
  });
  window.addEventListener('popstate', () => renderRoute({restore:true}));
  window.addEventListener('hashchange', () => { if (location.hash !== renderedHash && location.hash !== '#main') renderRoute(); });
  window.addEventListener('resize', updateChromeOffset);
  window.visualViewport?.addEventListener('resize', updateChromeOffset);
  if (!location.hash || location.hash === '#main') history.replaceState({}, '', '#/styles');
  renderRoute();
})();
