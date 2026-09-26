(() => {
  'use strict';
  const { catalog, views, libraryUI: library, systemUI: system, systemRegistry } = window.Pattove;
  const isCollection = () => ['dictionary', 'components'].includes(state.page);
  const $ = selector => document.querySelector(selector);
  const validPattern = id => catalog.patterns.some(p => p.id === id);
  const validStyle = id => catalog.styles.some(s => s.id === id);
  const state = {
    page: 'styles', category: 'all', query: '', style: 'main', detail: null, options: {}, environment: 'html', previewTab: 'preview', doc: 'definition', section: '', limit: 48
  };
  let lastOpener = null;
  let renderedHash = '';
  let suggestions = [];
  let suggestionIndex = -1;
  let documentRequest = 0;
  let mainRenderKey = '';
  const dialog = $('#detail-dialog');

  function updateMobileChromeOffset() {
    const header = $('.app-header');
    if (!header) return;
    document.documentElement.style.setProperty('--mobile-chrome-bottom', `${Math.ceil(header.getBoundingClientRect().bottom + 8)}px`);
  }
  function hash(overrides = {}) {
    const next = { ...state, ...overrides };
    const params = new URLSearchParams();
    if (['patterns', 'system'].includes(next.page)) params.set('style', next.style);
    if (['patterns', 'system', 'dictionary', 'components'].includes(next.page) && next.category !== 'all') params.set('category', next.category);
    if (next.query && !['styles', 'docs'].includes(next.page)) params.set('q', next.query);
    if (['dictionary', 'components'].includes(next.page) && next.limit > 48) params.set('shown', next.limit);
    if (next.page === 'docs') {
      params.set('doc', next.doc);
      if (next.section) params.set('section', next.section);
    }
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
    state.page = page === 'styles' || !page ? 'system' : ['patterns', 'system', ...library.pages].includes(page) ? page : 'system';
    state.category = (state.page === 'patterns' ? catalog.categories.some(c => c.id === params.get('category')) : isCollection() && library.validCategory(state.page, params.get('category'))) ? params.get('category') : 'all';
    state.query = ['styles', 'docs'].includes(state.page) ? '' : (params.get('q') || '').slice(0, 100);
    state.doc = library.validDocument(params.get('doc')) ? params.get('doc') : 'definition';
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
      if (implementation) { state.page='system'; state.detail=implementation.id; state.category='all'; state.options=systemRegistry.normalizeOptions(implementation.id); }
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
    return catalog.patterns.filter(p => (state.category === 'all' || p.category === state.category) && matches(p, state.query));
  }
  function hideSuggestions() {
    $('#search-popover').hidden = true;
    $('#query').setAttribute('aria-expanded', 'false');
    $('#query').removeAttribute('aria-activedescendant');
    suggestions = []; suggestionIndex = -1;
  }
  function showSuggestions() {
    const query = $('#query').value.trim();
    if (!query || ['styles', 'docs'].includes(state.page)) { hideSuggestions(); return; }
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
    navigate({ query, category: 'all', detail: null, section: '', limit: 48 }, { replace: true });
    $('#main').focus({ preventScroll: true });
  }
  function openSuggestion(id) {
    if (isCollection()) { navigate({ detail: id }, { overlay: true }); lastOpener = 'search-query'; return; }
    navigate({ detail: id }, { overlay: true });
    lastOpener = 'search-query';
  }
  function render(previousDetail = state.detail, focus = document.activeElement?.dataset.focus) {
    document.body.dataset.page = state.page;
    const searchable = !['styles', 'docs'].includes(state.page);
    document.body.dataset.search = String(searchable);
    document.title = `${state.page==='system' && state.detail ? systemRegistry.index.get(state.detail).name : ['patterns', 'system'].includes(state.page) ? views.styleName(state.style) : state.page === 'docs' ? library.documentName(state.doc) : ({ styles: '스타일', components: '구성요소', dictionary: '사전' })[state.page]}`;
    $('#primary-nav').innerHTML = library.navigation(state);
    $('#header-context').innerHTML = views.header(state);
    const column = state.page === 'system' ? system.sidebar(state) : state.page === 'patterns' ? views.sidebar(state) : library.pages.includes(state.page) ? library.sidebar(state) : '';
    $('#sidebar').innerHTML = column;
    $('#site-navigation').hidden = !column;
    $('.search-area').hidden = !searchable;
    $('#query').placeholder = ({ system: '부품 검색', dictionary: '사전 검색', components: '구성요소 검색' })[state.page] || '패턴 검색';
    $('#query').setAttribute('aria-label', $('#query').placeholder);
    if (document.activeElement !== $('#query')) $('#query').value = state.query;
    $('#clear-search').hidden = !$('#query').value;
    const nextMainKey = JSON.stringify([state.page, state.style, state.category, state.query, state.doc, state.page==='docs'?state.section:'', state.limit, state.page==='system'?[state.detail,state.options]:null, state.environment, state.previewTab]);
    if (mainRenderKey !== nextMainKey) {
      $('#main').innerHTML = state.page === 'system' ? system.detail(state) : state.page === 'docs' ? library.docPage(state) : isCollection() ? library.collection(state) : views.patterns(state, results());
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
    updateMobileChromeOffset();
  }
  function renderRoute() {
    hideSuggestions();
    const previousPage = state.page;
    const previousDetail = state.detail;
    const previousStyle = state.style;
    const previousCategory = state.category;
    const previousDocument = state.doc;
    const focus = document.activeElement?.dataset.focus;
    readRoute();
    const canonical = hash();
    if (location.hash !== canonical) history.replaceState(history.state, '', canonical);
    $('#query').value = state.query;
    render(previousDetail, focus);
    renderedHash = location.hash;
    if (previousPage !== state.page || (state.page==='system' && previousDetail!==state.detail) || (!state.detail && (previousStyle !== state.style || previousCategory !== state.category || previousDocument !== state.doc))) {
      window.scrollTo(0, 0);
      if (!state.detail) $('#main').focus({ preventScroll: true });
    }
    if (state.page==='system' && state.detail && state.section) {
      const section = document.getElementById('component-'+state.section);
      if (section) { section.tabIndex=-1; section.focus({preventScroll:true}); section.scrollIntoView({block:'start'}); }
    }
    $('#announcer').textContent = state.page === 'styles' ? `스타일 ${catalog.styles.filter(s => s.id !== 'base').length}개` : state.page === 'system' ? systemRegistry.index.get(state.detail).name : state.page === 'docs' ? library.documentName(state.doc) : `${isCollection() ? '항목' : '패턴'} ${isCollection() ? library.currentItems(state).length : results().length}개`;
    const request = ++documentRequest;
    if (state.page === 'docs') library.loadDocument(state.doc).then(() => {
      if (request !== documentRequest || state.page !== 'docs') return;
      $('#main').innerHTML = library.docPage(state);
      if (state.section) {
        const section = $('#main').querySelector(`#${CSS.escape(state.section)}`);
        if (section) { section.tabIndex = -1; section.focus({ preventScroll: true }); section.scrollIntoView({ block: 'start' }); }
      }
    }).catch(() => {
      if (request === documentRequest && state.page === 'docs') $('#main').innerHTML = '<div class="empty-state"><h2>문서를 열 수 없어요</h2><button class="secondary" data-action="retry-document">다시 열기</button></div>';
    });
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
    else if (target.matches('a[href^="#/"]')) {
      event.preventDefault();
      history.pushState({}, '', target.getAttribute('href'));
      renderRoute();
    } else if (data.suggestOpen) openSuggestion(data.suggestOpen);
    else if (data.libraryEntry) navigate({ detail: data.libraryEntry }, { overlay: true });
    else if (data.open) navigate({ detail: data.open, style: data.style || state.style }, { overlay: true });
    else if (data.category) navigate({ category: data.category }, { replace: true });
    else if (data.action === 'reset' || data.action === 'clear-query') {
      navigate({ query: '', limit: 48, ...(data.action === 'reset' ? { category: 'all' } : {}) }, { replace: true });
    } else if (data.action === 'load-more') {
      const firstNew = library.currentItems(state).filter(e=>!e.implementation)[state.limit]?.id;
      navigate({ limit: state.limit + 48 }, { replace: true });
      if (firstNew) document.querySelector(`[data-focus="entry-${CSS.escape(firstNew)}"]`)?.focus();
    } else if (data.action === 'retry-document') renderRoute();
    else if (data.action === 'search-all') submitSearch();
    else if (data.action === 'close-dialog') closeDetail();
  });
  document.addEventListener('change', event => {
    if (event.target.matches('[data-doc-environment]')) navigate({environment:event.target.value, section:''},{replace:true});
    if (event.target.matches('[data-part-option]')) {
      state.options = systemRegistry.normalizeOptions(state.detail, Object.fromEntries([...document.querySelectorAll('.system-inspector [data-part-option]')].map(el => [el.dataset.partOption,el.value])));
      history.replaceState(history.state, '', hash()); renderedHash = location.hash;
      system.updateInspector(state);
    }
  });
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
    if (event.key === '/' && !['styles', 'docs'].includes(state.page) && !dialog.open && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input,textarea,select,[contenteditable="true"]')) {
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
  window.addEventListener('resize', updateMobileChromeOffset);
  window.visualViewport?.addEventListener('resize', updateMobileChromeOffset);
  if (!location.hash || location.hash === '#main') history.replaceState({}, '', '#/dictionary');
  renderRoute();
})();
