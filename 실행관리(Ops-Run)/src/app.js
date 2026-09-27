(() => {
  'use strict';
  const { catalog, views, libraryUI: library, systemUI: system, systemRegistry } = window.Pattove;
  const isCollection = () => ['dictionary', 'components'].includes(state.page);
  const $ = selector => document.querySelector(selector);
  const validPattern = id => catalog.patterns.some(p => p.id === id);
  const validStyle = id => catalog.styles.some(s => s.id === id);
  // 스타일 화면에서 고른 디자인 스타일은 앱 전체에 입혀지고 다음 방문에도 유지된다.
  const styleKey = 'pattove-style';
  const storedStyle = (() => { try { return localStorage.getItem(styleKey); } catch { return null; } })();
  const state = {
    page: 'styles', filters: {}, query: '', style: validStyle(storedStyle) ? storedStyle : 'main', detail: null, options: {}, environment: 'html', previewTab: 'preview', section: '', limit: 48
  };
  let lastOpener = null;
  let renderedHash = '';
  let suggestions = [];
  let suggestionIndex = -1;
  let mainRenderKey = '';
  let filterBarHTML = '';
  const facetSearch = {};
  const dialog = $('#detail-dialog');

  // In-page anchors land below the header while it sticks (desktop); on phones the header scrolls away.
  function updateChromeOffset() {
    const header = $('.app-header');
    if (!header) return;
    const sticky = getComputedStyle(header).position === 'sticky';
    document.documentElement.style.setProperty('--chrome-bottom', `${sticky ? Math.ceil(header.getBoundingClientRect().height + 16) : 16}px`);
  }
  const list = value => [...new Set(String(value || '').split(',').filter(Boolean))];
  function readFilters(page, params) {
    if (page === 'patterns') return { category: list(params.get('category')).filter(id => id !== 'all' && catalog.categories.some(c => c.id === id)) };
    return isCollection() ? library.readFilters(page, params) : {};
  }
  const cleared = filters => Object.fromEntries(Object.entries(filters).map(([key, value]) => [key, Array.isArray(value) ? [] : value]));
  function toggleFilter(key, id) {
    const filters = { ...state.filters, [key]: state.filters[key]?.includes(id) ? state.filters[key].filter(x => x !== id) : [...(state.filters[key] || []), id] };
    if (key === 'code' && !filters.code.includes('ICO')) filters.icon = [];
    navigate({ filters, limit: 48 }, { replace: true });
  }
  const firstFilter = () => $('#filter-bar .filter-scroll [data-focus]')?.focus({ preventScroll: true });
  const phone = matchMedia('(max-width: 760px)');
  // The popover sits in the top layer (never clipped by the sideways-scrolling row); it opens under its button, kept inside the screen.
  // On phones CSS makes it a sheet rising from the bottom, so no position is written.
  function placePanel(panel) {
    const opener = document.querySelector(`.filter-menu[popovertarget="${panel.id}"]`);
    if (!opener || phone.matches) return panel.style.removeProperty('top'), panel.style.removeProperty('left'), panel.style.removeProperty('max-height');
    const r = opener.getBoundingClientRect(), width = panel.offsetWidth;
    panel.style.top = `${Math.round(r.bottom + 8)}px`;
    panel.style.left = `${Math.round(Math.max(16, Math.min(r.left, innerWidth - width - 16)))}px`;
    panel.style.maxHeight = `${Math.max(200, Math.floor(innerHeight - r.bottom - 24))}px`;
  }
  const placeOpenPanels = () => document.querySelectorAll('.facet-panel:popover-open').forEach(placePanel);
  function searchPanel(input) {
    const term = input.value.trim().toLocaleLowerCase();
    facetSearch[input.closest('.facet-panel').id] = input.value;
    // Nested rows follow the row they sit under, so opening a found parent shows its children too.
    let parentShown = true;
    input.closest('.facet-panel').querySelectorAll('.facet-option').forEach(option => {
      const match = !term || option.dataset.facetName.includes(term);
      if (option.classList.contains('is-nested')) option.hidden = !match && !parentShown;
      else { option.hidden = !match; parentShown = match; }
    });
  }
  function renderFilterBar() {
    const html = state.page === 'system' ? system.partLinks(state) : state.page === 'patterns' ? views.patternFilters(state, results().length) : isCollection() ? library.filters(state) : '';
    const bar = $('#filter-bar');
    bar.hidden = !html;
    if (html === filterBarHTML) return;
    // A re-render keeps the open checklist open, scrolled and searched where it was, and the button row where it was scrolled.
    const open = bar.querySelector('.facet-panel:popover-open');
    const listTop = open?.querySelector('.facet-list')?.scrollTop || 0;
    const rowLeft = bar.querySelector('.filter-scroll')?.scrollLeft || 0;
    bar.innerHTML = html;
    filterBarHTML = html;
    const row = bar.querySelector('.filter-scroll');
    if (row) row.scrollLeft = rowLeft;
    const panel = open && document.getElementById(open.id);
    if (panel) {
      panel.showPopover();
      const search = panel.querySelector('[data-facet-search]');
      if (search && facetSearch[panel.id]) { search.value = facetSearch[panel.id]; searchPanel(search); }
      panel.querySelector('.facet-list').scrollTop = listTop;
    }
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
      if (next.environment === 'react') params.set('env', 'react');
      if (next.previewTab === 'code') params.set('view', 'code');
      if (next.section) params.set('section', next.section);
      const defaults = systemRegistry.normalizeOptions(next.detail);
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
    state.options = state.page === 'system' && state.detail ? systemRegistry.normalizeOptions(state.detail, Object.fromEntries([...params].filter(([key]) => key.startsWith('option-')).map(([key,value]) => [key.slice(7),value]))) : {};
    state.environment = params.get('env') === 'react' ? 'react' : 'html';
    state.previewTab = params.get('view') === 'code' ? 'code' : 'preview';
    if (state.page === 'dictionary' && state.detail) {
      const implementation = systemRegistry.index.get(state.detail) || systemRegistry.items.find(i=>i.entry===state.detail);
      if (implementation) { state.page='system'; state.detail=implementation.id; state.filters={}; state.options=systemRegistry.normalizeOptions(implementation.id); }
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
    if (element?.getClientRects().length) { element.focus({ preventScroll: true }); return true; }
    return false;
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
  function submitSearch() {
    const query = $('#query').value.trim();
    hideSuggestions();
    navigate({ query, detail: null, section: '', limit: 48 }, { replace: true });
    $('#main').focus({ preventScroll: true });
  }
  function openSuggestion(id) {
    if (isCollection()) { navigate({ detail: id }, { overlay: true }); lastOpener = 'search-query'; return; }
    navigate({ detail: id }, { overlay: true });
    lastOpener = 'search-query';
  }
  function render(previousDetail = state.detail, focus = document.activeElement?.dataset.focus) {
    document.body.dataset.page = state.page;
    document.body.className = 'theme-' + state.style;
    const searchable = !['styles'].includes(state.page);
    document.body.dataset.search = String(searchable);
    document.title = `${state.page==='system' && state.detail ? systemRegistry.index.get(state.detail).name : state.page === 'patterns' ? views.styleName(state.style) : ({ styles: '스타일', components: '구성요소', dictionary: '사전' })[state.page]}`;
    $('#primary-nav').innerHTML = library.navigation(state);
    $('#header-context').innerHTML = views.header(state);
    renderFilterBar();
    $('.search-area').hidden = !searchable;
    $('#query').placeholder = ({ system: '부품 검색', dictionary: '사전 검색', components: '구성요소 검색' })[state.page] || '패턴 검색';
    $('#query').setAttribute('aria-label', $('#query').placeholder);
    if (document.activeElement !== $('#query')) $('#query').value = state.query;
    $('#clear-search').hidden = !$('#query').value;
    const nextMainKey = JSON.stringify([state.page, state.style, state.filters, state.query, state.limit, state.page==='system'?[state.detail,state.options]:null, state.environment, state.previewTab]);
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
    if (data.docTab) {
      navigate({previewTab:data.docTab, section:''}, {replace:true});
    } else if (data.docSection) {
      event.preventDefault(); navigate({section:data.docSection}, {replace:true});
    } else if ('systemDownload' in data) window.Pattove.systemExport.save(state);
    else if ('systemCopy' in data) window.Pattove.systemExport.copy();
    else if (data.styleSelect && validStyle(data.styleSelect)) {
      state.style = data.styleSelect;
      try { localStorage.setItem(styleKey, state.style); } catch {}
      render();
      $('#announcer').textContent = `${views.styleName(state.style)} 적용함`;
    }
    else if (target.matches('a[href^="#/"]')) {
      event.preventDefault();
      target.closest('[popover]')?.hidePopover();
      history.pushState({}, '', target.getAttribute('href'));
      renderRoute();
    } else if (data.suggestOpen) openSuggestion(data.suggestOpen);
    else if (data.libraryEntry) navigate({ detail: data.libraryEntry }, { overlay: true });
    else if (data.open) navigate({ detail: data.open, style: data.style || state.style }, { overlay: true });
    else if (target.classList.contains('filter-tag')) {
      // A removed tag hands focus to the next tag, then 모두 지우기, then the first filter button.
      const keys = [...target.parentElement.querySelectorAll('[data-focus]')].map(el => el.dataset.focus), at = keys.indexOf(data.focus);
      if (data.filter) toggleFilter(...data.filter.split(/:(.*)/s, 2));
      else navigate({ query: '', limit: 48 }, { replace: true });
      if (![...keys.slice(at + 1), ...keys.slice(0, at).reverse()].some(focusKey)) firstFilter();
    } else if (data.action === 'clear-filters') {
      navigate({ filters: cleared(state.filters), query: '', limit: 48 }, { replace: true });
      firstFilter();
    } else if (data.action === 'clear-query') navigate({ query: '', limit: 48 }, { replace: true });
    else if (data.action === 'load-more') {
      const firstNew = library.currentItems(state).filter(e=>!e.implementation)[state.limit]?.id;
      navigate({ limit: state.limit + 48 }, { replace: true });
      if (firstNew) document.querySelector(`[data-focus="entry-${CSS.escape(firstNew)}"]`)?.focus();
    } else if (data.action === 'search-all') submitSearch();
    else if (data.action === 'close-dialog') closeDetail();
  });
  document.addEventListener('change', event => {
    if (event.target.matches('[data-filter-check]')) toggleFilter(event.target.dataset.filterCheck, event.target.value);
    if (event.target.matches('[data-doc-environment]')) navigate({environment:event.target.value, section:''},{replace:true});
    if (event.target.matches('[data-part-option]')) {
      state.options = systemRegistry.normalizeOptions(state.detail, Object.fromEntries([...document.querySelectorAll('.system-inspector [data-part-option]')].map(el => [el.dataset.partOption,el.value])));
      history.replaceState(history.state, '', hash()); renderedHash = location.hash;
      system.updateInspector(state);
    }
  });
  document.addEventListener('input', event => { if (event.target.matches('[data-facet-search]')) searchPanel(event.target); });
  // An opening list is placed, and the open part (or first ticked row) is scrolled into its view.
  // A closing list hands focus back to its button before it hides (synchronously, so the next key already lands there).
  document.addEventListener('beforetoggle', event => {
    if (event.target.matches?.('.facet-panel') && event.newState === 'closed' && event.target.contains(document.activeElement))
      $(`.filter-menu[popovertarget="${event.target.id}"]`)?.focus({ preventScroll: true });
  }, true);
  document.addEventListener('toggle', event => {
    if (!event.target.matches?.('.facet-panel') || event.newState !== 'open') return;
    placePanel(event.target);
    event.target.querySelector('[aria-current="page"], :checked')?.scrollIntoView({ block: 'nearest' });
  }, true);
  phone.addEventListener('change', placeOpenPanels);
  window.addEventListener('scroll', placeOpenPanels, { passive: true });
  $('#filter-bar').addEventListener('scroll', placeOpenPanels, { passive: true, capture: true });
  $('#search-form').addEventListener('submit', event => { event.preventDefault(); submitSearch(); });
  $('#query').addEventListener('input', () => { $('#clear-search').hidden = !$('#query').value; showSuggestions(); });
  $('#query').addEventListener('focus', showSuggestions);
  $('.search-area').addEventListener('focusout', () => setTimeout(() => { if (!$('.search-area').contains(document.activeElement)) hideSuggestions(); }, 0));
  $('#query').addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); hideSuggestions(); return; }
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
    if (event.target.matches('[data-doc-tab]') && ['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key==='Home'?'preview':event.key==='End'?'code':event.target.dataset.docTab==='preview'?'code':'preview';
      navigate({previewTab:next, section:''},{replace:true}); document.querySelector('[data-doc-tab="'+next+'"]').focus();
    }
    if (event.key === '/' && !['styles'].includes(state.page) && !dialog.open && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input,textarea,select,[contenteditable="true"]')) {
      event.preventDefault(); $('#query').focus();
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
  $('#clear-search').addEventListener('click', () => { navigate({ query: '' }, { replace: true }); $('#query').focus(); });
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeDetail(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDetail();
  });
  window.addEventListener('popstate', renderRoute);
  window.addEventListener('hashchange', () => { if (location.hash !== renderedHash && location.hash !== '#main') renderRoute(); });
  window.addEventListener('resize', () => { updateChromeOffset(); placeOpenPanels(); });
  window.visualViewport?.addEventListener('resize', updateChromeOffset);
  if (!location.hash || location.hash === '#main') history.replaceState({}, '', '#/dictionary');
  renderRoute();
})();
