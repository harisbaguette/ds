(() => {
  'use strict';
  const { catalog, views, libraryUI: library, systemUI: system, systemRegistry, componentDocs } = window.Pattove;
  const isCollection = () => ['dictionary', 'components'].includes(state.page);
  const $ = selector => document.querySelector(selector);
  const validPattern = id => catalog.patterns.some(p => p.id === id);
  const validStyle = id => catalog.styles.some(s => s.id === id);
  // 스타일 화면에서 고른 디자인 스타일은 앱 전체에 입혀지고 다음 방문에도 유지된다.
  const styleKey = 'pattove-style';
  const storedStyle = (() => { try { return localStorage.getItem(styleKey); } catch { return null; } })();
  const state = {
    page: 'styles', filters: {}, query: '', style: validStyle(storedStyle) ? storedStyle : 'main', detail: null, options: {}, section: '', limit: 48
  };
  let lastOpener = null;
  let renderedHash = '';
  let suggestions = [];
  let suggestionIndex = -1;
  let mainRenderKey = '';
  let filterBarHTML = '';
  // The filter area remembers, per tab, which sections are folded and what each section search holds.
  let filterScope = '';
  let sectionOpen = {};
  let facetSearch = {};
  const dialog = $('#detail-dialog');

  // In-page anchors land below the thin top bar on phones; on wider screens the menu sits at the side and nothing covers the top.
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
  function toggleFilter(key, id) {
    const filters = { ...state.filters, [key]: state.filters[key]?.includes(id) ? state.filters[key].filter(x => x !== id) : [...(state.filters[key] || []), id] };
    navigate({ filters, limit: 48 }, { replace: true });
  }
  const firstFilter = () => $('#filter-bar summary, #filter-bar [data-focus]')?.focus({ preventScroll: true });
  const phone = matchMedia('(max-width: 760px)');
  const searchKey = input => input.closest('[data-section]')?.dataset.section || 'part';
  function searchPanel(input) {
    const term = input.value.trim().toLocaleLowerCase();
    facetSearch[searchKey(input)] = input.value;
    input.parentElement.querySelectorAll('[data-facet-name]').forEach(option => { option.hidden = !!term && !option.dataset.facetName.includes(term); });
  }
  function renderFilterBar() {
    const html = state.page === 'system' ? system.partLinks(state) : state.page === 'patterns' ? views.patternFilters(state) : isCollection() ? library.filters(state) : '';
    const bar = $('#filter-bar'), body = $('.menu-body');
    bar.hidden = !html;
    if (html === filterBarHTML) return;
    filterBarHTML = html;
    // Inside one tab a re-render keeps folds, section searches and the menu scroll; a section that newly appears opens.
    // A new tab starts over from the folds written in the markup and shows the open part.
    const scope = state.page + '|' + (state.filters.shelf || ''), sameTab = scope === filterScope, top = body.scrollTop;
    if (!sameTab) { filterScope = scope; sectionOpen = {}; facetSearch = {}; }
    bar.innerHTML = html;
    bar.querySelectorAll('details[data-section]').forEach(d => {
      const key = d.dataset.section;
      if (sameTab) d.open = key in sectionOpen ? sectionOpen[key] : true;
      sectionOpen[key] = d.open;
    });
    bar.querySelectorAll('[data-facet-search]').forEach(input => { if (facetSearch[searchKey(input)]) { input.value = facetSearch[searchKey(input)]; searchPanel(input); } });
    if (sameTab) body.scrollTop = top;
    else { body.scrollTop = 0; bar.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest' }); }
  }
  function hash(overrides = {}) {
    const next = { ...state, ...overrides };
    const params = new URLSearchParams();
    if (next.page === 'patterns') params.set('style', next.style);
    if (next.page === 'patterns' && next.filters.category?.length) params.set('category', next.filters.category.join(','));
    if (library.pages.includes(next.page)) library.writeFilters(next, params);
    if (next.query && !['styles'].includes(next.page)) params.set('q', next.query);
    if (['dictionary', 'components'].includes(next.page) && next.limit > 48) params.set('shown', next.limit);
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
    state.page = ['styles', 'patterns', 'system', ...library.pages].includes(page) ? page : 'system';
    state.filters = readFilters(state.page, params);
    state.query = ['styles'].includes(state.page) ? '' : (params.get('q') || '').slice(0, 100);
    state.section = (params.get('section') || '').slice(0, 250);
    state.limit = Math.min(5000, Math.max(48, Number.parseInt(params.get('shown'), 10) || 48));
    if (validStyle(params.get('style'))) state.style = params.get('style');
    state.detail = (state.page === 'system' ? systemRegistry.index.has(params.get('detail')) : isCollection() ? library.validDetail(state.page, params.get('detail')) : state.page === 'patterns' && validPattern(params.get('detail'))) ? params.get('detail') : null;
    if (state.page === 'system' && !state.detail) { state.detail = (systemRegistry.matching(state.query)[0] || systemRegistry.items[0]).id; state.query = ''; }
    state.options = state.page === 'system' && state.detail ? systemRegistry.normalizeOptions(state.detail, { ...componentDocs.defaults(state.detail), ...Object.fromEntries([...params].filter(([key]) => key.startsWith('option-')).map(([key,value]) => [key.slice(7),value])) }) : {};
    if (state.page === 'dictionary' && state.detail) {
      const implementation = systemRegistry.index.get(state.detail) || systemRegistry.items.find(i=>i.entry===state.detail);
      if (implementation) { state.page='system'; state.detail=implementation.id; state.filters={}; state.options=systemRegistry.normalizeOptions(implementation.id, componentDocs.defaults(implementation.id)); }
    }
  }
  function navigate(overrides, { replace = false, overlay = false } = {}) {
    if (overlay && state.page !== 'system' && !state.detail) lastOpener = document.activeElement?.dataset.focus || null;
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
    if (!query || ['styles'].includes(state.page)) { hideSuggestions(); return; }
    suggestions = state.page === 'system' ? systemRegistry.matching(query).slice(0, 6) : isCollection() ? library.suggestions(state, query) : catalog.patterns.filter(p => matches(p, query)).slice(0, 6);
    suggestionIndex = -1;
    $('#search-suggestions').innerHTML = suggestions.length ? suggestions.map((p, i) => `<button type="button" role="option" aria-selected="false" tabindex="-1" class="search-suggestion" id="suggestion-${i}" data-suggest-open="${p.id}"><span>${views.escape(p.name)}</span><small>${views.escape(state.page === 'system' ? p.layer : isCollection() ? library.suggestionGroup(state.page, p) : catalog.categories.find(c => c.id === p.category).name)}</small></button>`).join('') : '<p class="search-no-match">일치하는 항목이 없어요</p>';
    $('#search-popover').hidden = false;
    $('#query').setAttribute('aria-expanded', 'true');
    $('#query').removeAttribute('aria-activedescendant');
  }
  // Searching from 스타일 looks through 부품. On phones the menu folds away so the results show.
  function submitSearch() {
    const query = $('#query').value.trim();
    hideSuggestions();
    setMenu(false, false);
    if (state.page === 'styles') { history.pushState({}, '', '#/dictionary?shelf=part' + (query ? '&q=' + encodeURIComponent(query) : '')); renderRoute(); }
    else navigate({ query, detail: null, section: '', limit: 48 }, { replace: true });
    $('#main').focus({ preventScroll: true });
  }
  // Phones keep the side menu as a drawer: the menu button slides it in over a dimmed page; Esc, a tap outside or a link inside closes it,
  // and a close by hand gives focus back to the menu button. Picking a filter leaves it open.
  function setMenu(open, returnFocus = true) {
    if (open === document.documentElement.classList.contains('menu-open')) return;
    document.documentElement.classList.toggle('menu-open', open);
    $('#menu-toggle').setAttribute('aria-expanded', String(open));
    $('#main').inert = open;
    $('.app-top').inert = open;
    // Opening lands on where the reader is: the current item of a long list (focus also scrolls it into view), else the current tab.
    if (open) [$('#filter-bar:not([hidden]) a[aria-current="page"]'), $('#primary-nav [aria-current="page"]'), $('#primary-nav a')].find(e => e?.checkVisibility())?.focus();
    else if (returnFocus) $('#menu-toggle').focus();
  }
  function openSuggestion(id) {
    setMenu(false, false);
    if (isCollection()) { navigate({ detail: id }, { overlay: true }); lastOpener = 'search-query'; return; }
    navigate({ detail: id }, { overlay: true });
    lastOpener = 'search-query';
  }
  function render(previousDetail = state.detail, focus = document.activeElement?.dataset.focus) {
    document.body.dataset.page = state.page;
    document.body.className = 'theme-' + state.style;
    document.title = `${state.page==='system' && state.detail ? systemRegistry.index.get(state.detail).name : state.page === 'patterns' ? views.styleName(state.style) : ({ styles: '스타일', components: '구성요소', dictionary: '사전' })[state.page]}`;
    $('#primary-nav').innerHTML = library.navigation(state);
    $('#header-context').innerHTML = views.header(state);
    $('#top-title').textContent = $('#primary-nav [aria-current="page"]')?.textContent || ({ components: '구성요소' })[state.page] || '';
    renderFilterBar();
    $('#query').placeholder = ({ system: '부품 검색', styles: '부품 검색', dictionary: '사전 검색', components: '구성요소 검색' })[state.page] || '패턴 검색';
    $('#query').setAttribute('aria-label', $('#query').placeholder);
    if (document.activeElement !== $('#query')) $('#query').value = state.query;
    $('#search-clear').hidden = !$('#query').value;
    const nextMainKey = JSON.stringify([state.page, state.style, state.filters, state.query, state.limit, state.page==='system'?[state.detail,state.options]:null]);
    if (mainRenderKey !== nextMainKey) {
      $('#main').innerHTML = state.page === 'styles' ? views.styleGrid(state) : state.page === 'system' ? system.detail(state) : isCollection() ? library.collection(state) : views.patterns(state, results());
      mainRenderKey = nextMainKey;
    }
    if (state.detail && state.page !== 'system') {
      const scroll = dialog.scrollTop;
      dialog.innerHTML = state.page === 'system' ? system.detail(state) : isCollection() ? library.detail(state) : views.detail(state, catalog.patterns.find(p => p.id === state.detail));
      if (!dialog.open) dialog.showModal();
      if (previousDetail === state.detail && focusKey(focus)) dialog.scrollTop = scroll;
      else $('#detail-title').focus({ preventScroll: true });
    } else {
      if (dialog.open) dialog.close();
      dialog.replaceChildren();
      if (state.page==='system' && state.detail) {
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
  function renderRoute() {
    hideSuggestions();
    const previousPage = state.page;
    const previousDetail = state.detail;
    const previousStyle = state.style;
    const previousShelf = state.filters.shelf;
    const previousFilters = JSON.stringify(state.filters);
    const focus = document.activeElement?.dataset.focus;
    readRoute();
    const canonical = hash();
    if (location.hash !== canonical) history.replaceState(history.state, '', canonical);
    $('#query').value = state.query;
    render(previousDetail, focus);
    renderedHash = location.hash;
    // A new page or tab moves focus to the content; a filter change only returns to the top and leaves focus where it was.
    if (previousPage !== state.page || (state.page==='system' && previousDetail!==state.detail) || (!state.detail && (previousStyle !== state.style || previousShelf !== state.filters.shelf))) {
      window.scrollTo(0, 0);
      if (!state.detail) $('#main').focus({ preventScroll: true });
    } else if (!state.detail && previousFilters !== JSON.stringify(state.filters)) window.scrollTo(0, 0);
    if (state.page==='system' && state.detail && state.section) {
      const section = document.getElementById('component-'+state.section);
      if (section) { section.tabIndex=-1; section.focus({preventScroll:true}); section.scrollIntoView({block:'start'}); }
    }
    $('#announcer').textContent = state.page === 'styles' ? `스타일 ${catalog.styles.filter(s => s.id !== 'base').length}개, ${views.styleName(state.style)} 사용 중` : state.page === 'system' ? systemRegistry.index.get(state.detail).name : `${isCollection() ? '항목' : '패턴'} ${isCollection() ? library.currentItems(state).length : results().length}개`;
  }
  document.addEventListener('click', event => {
    if (!event.target.closest('.search-area')) hideSuggestions();
    const target = event.target.closest('button, a');
    if (!target || target.disabled) return;
    const data = target.dataset;
    if (target.matches('a') && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
    if (target.classList.contains('skip-link')) { event.preventDefault(); $('#main').focus(); return; }
    if (data.docSection) {
      event.preventDefault(); navigate({section:data.docSection}, {replace:true});
    } else if (data.styleSelect && validStyle(data.styleSelect)) {
      state.style = data.styleSelect;
      try { localStorage.setItem(styleKey, state.style); } catch {}
      render();
      $('#announcer').textContent = `${views.styleName(state.style)} 적용함`;
    }
    else if (target.matches('a[href^="#/"]')) {
      event.preventDefault();
      if (target.closest('#app-menu')) setMenu(false, false);
      history.pushState({}, '', target.getAttribute('href'));
      renderRoute();
    } else if (data.suggestOpen) openSuggestion(data.suggestOpen);
    else if (data.filter) toggleFilter(...data.filter.split(/:(.*)/s, 2));
    else if (data.libraryEntry) navigate({ detail: data.libraryEntry }, { overlay: true });
    else if (data.open) navigate({ detail: data.open, style: data.style || state.style }, { overlay: true });
    else if (data.action === 'clear-filters') {
      // From the menu focus moves to the first section (the link itself goes away); from an empty result, to the content.
      const inMenu = target.closest('#filter-bar');
      navigate({ filters: cleared(state.filters), query: '', limit: 48 }, { replace: true });
      if (inMenu) firstFilter();
      else $('#main').focus({ preventScroll: true });
    } else if (data.action === 'clear-query') navigate({ query: '', limit: 48 }, { replace: true });
    else if (data.action === 'load-more') {
      const firstNew = library.currentItems(state).filter(e=>!e.implementation)[state.limit]?.id;
      navigate({ limit: state.limit + 48 }, { replace: true });
      if (firstNew) document.querySelector(`[data-focus="entry-${CSS.escape(firstNew)}"]`)?.focus();
    } else if (data.action === 'search-all') submitSearch();
    else if (data.action === 'close-dialog') closeDetail();
    else if (data.variantPick || data.variantUse) pickVariant(data.variantPick || data.variantUse, Boolean(data.variantUse));
  });
  // A version card swaps the big preview; "이걸로 쓰기" also keeps it as this part's opening version.
  function pickVariant(value, keep) {
    const g = systemRegistry.index.get(state.detail)?.gallery, look = g?.list.find(v => v.id === value);
    if (!look) return;
    if (keep) componentDocs.choose(state.detail, value);
    state.options = systemRegistry.normalizeOptions(state.detail, { ...state.options, [g.key]: value });
    history.replaceState(history.state, '', hash()); renderedHash = location.hash;
    componentDocs.refresh(state);
    if (keep) document.querySelector(`[data-variant-use="${CSS.escape(value)}"]`)?.focus();
    $('#announcer').textContent = `${look.name} ${keep ? '사용 중' : '미리보기'}`;
  }
  document.addEventListener('change', event => {
    if (event.target.matches('[data-part-option]')) {
      state.options = systemRegistry.normalizeOptions(state.detail, { ...state.options, ...Object.fromEntries([...document.querySelectorAll('.system-inspector [data-part-option]')].map(el => [el.dataset.partOption,el.value])) });
      history.replaceState(history.state, '', hash()); renderedHash = location.hash;
      system.updateInspector(state);
    }
  });
  document.addEventListener('input', event => { if (event.target.matches('[data-facet-search]')) searchPanel(event.target); });
  document.addEventListener('toggle', event => {
    if (event.target.matches?.('#filter-bar details[data-section]')) sectionOpen[event.target.dataset.section] = event.target.open;
  }, true);
  $('#menu-toggle').addEventListener('click', () => setMenu(true));
  $('#menu-backdrop').addEventListener('click', () => setMenu(false));
  phone.addEventListener('change', () => setMenu(false, false));
  $('#search-clear').addEventListener('click', () => {
    $('#query').value = '';
    $('#search-clear').hidden = true;
    $('#query').focus();
    if (state.query) navigate({ query: '', limit: 48 }, { replace: true });
  });
  $('#search-form').addEventListener('submit', event => { event.preventDefault(); submitSearch(); });
  $('#query').addEventListener('input', () => { $('#search-clear').hidden = !$('#query').value; showSuggestions(); });
  $('#query').addEventListener('focus', showSuggestions);
  $('.search-area').addEventListener('focusout', () => setTimeout(() => { if (!$('.search-area').contains(document.activeElement)) hideSuggestions(); }, 0));
  $('#query').addEventListener('keydown', event => {
    // Esc first folds the suggestions; with none showing it falls through and closes the phone menu.
    if (event.key === 'Escape') { if (!$('#search-popover').hidden) { event.preventDefault(); event.stopPropagation(); hideSuggestions(); } return; }
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
      if (phone.matches) setMenu(true, false);
      $('#query').focus();
    } else if (event.key === 'Escape' && document.documentElement.classList.contains('menu-open')) { event.preventDefault(); setMenu(false); }
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
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDetail();
  });
  window.addEventListener('popstate', renderRoute);
  window.addEventListener('hashchange', () => { if (location.hash !== renderedHash && location.hash !== '#main') renderRoute(); });
  window.addEventListener('resize', updateChromeOffset);
  window.visualViewport?.addEventListener('resize', updateChromeOffset);
  if (!location.hash || location.hash === '#main') history.replaceState({}, '', '#/dictionary');
  renderRoute();
})();
