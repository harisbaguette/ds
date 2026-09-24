(() => {
  'use strict';
  const { catalog, views, libraryUI: library } = window.Pattove;
  const isCollection = () => ['dictionary', 'components'].includes(state.page);
  const $ = selector => document.querySelector(selector);
  const validPattern = id => catalog.patterns.some(p => p.id === id);
  const validStyle = id => catalog.styles.some(s => s.id === id);
  const storageKey = 'pattove-shell:v1';
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch { /* 저장소 없이도 탐색 */ }
  const saved = Array.isArray(stored.saved) ? stored.saved.filter(item => item && validPattern(item.id) && validStyle(item.style)) : [];
  const state = {
    page: 'styles', category: 'all', query: '', style: validStyle(stored.style) ? stored.style : 'ink', detail: null, doc: 'definition', section: '', limit: 48,
    saved: saved.filter((item, i, all) => all.findIndex(other => other.id === item.id && other.style === item.style) === i)
  };
  let lastOpener = null;
  let noticeTimer;
  let renderedHash = '';
  let undoSaved = null;
  let suggestions = [];
  let suggestionIndex = -1;
  let documentRequest = 0;
  const dialog = $('#detail-dialog');

  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify({ saved: state.saved, style: state.style })); return true; }
    catch { return false; }
  }
  function notify(message, undo = false) {
    clearTimeout(noticeTimer);
    $('#notice-text').textContent = message;
    $('#notice [data-action="undo-save"]').hidden = !undo;
    $('#notice').hidden = false;
    noticeTimer = setTimeout(() => { $('#notice').hidden = true; }, 5000);
  }
  function hash(overrides = {}) {
    const next = { ...state, ...overrides };
    const params = new URLSearchParams();
    if (next.page === 'patterns' || (next.page === 'saved' && next.detail)) params.set('style', next.style);
    if (['patterns', 'dictionary', 'components'].includes(next.page) && next.category !== 'all') params.set('category', next.category);
    if (next.query && !['styles', 'docs'].includes(next.page)) params.set('q', next.query);
    if (['dictionary', 'components'].includes(next.page) && next.limit > 48) params.set('shown', next.limit);
    if (next.page === 'docs') {
      params.set('doc', next.doc);
      if (next.section) params.set('section', next.section);
    }
    if (next.detail) params.set('detail', next.detail);
    const query = params.toString();
    return `#/${next.page}${query ? `?${query}` : ''}`;
  }
  function readRoute() {
    const [path, query = ''] = location.hash.slice(1).split('?');
    const params = new URLSearchParams(query);
    const page = path.replace(/^\//, '');
    state.page = ['patterns', 'styles', 'saved', ...library.pages].includes(page) ? page : 'styles';
    state.category = (state.page === 'patterns' ? catalog.categories.some(c => c.id === params.get('category')) : isCollection() && library.validCategory(state.page, params.get('category'))) ? params.get('category') : 'all';
    state.query = ['styles', 'docs'].includes(state.page) ? '' : (params.get('q') || '').slice(0, 100);
    state.doc = library.validDocument(params.get('doc')) ? params.get('doc') : 'definition';
    state.section = (params.get('section') || '').slice(0, 250);
    state.limit = Math.min(5000, Math.max(48, Number.parseInt(params.get('shown'), 10) || 48));
    if (validStyle(params.get('style'))) state.style = params.get('style');
    state.detail = (isCollection() ? library.validDetail(state.page, params.get('detail')) : ['patterns', 'saved'].includes(state.page) && validPattern(params.get('detail'))) ? params.get('detail') : null;
  }
  function navigate(overrides, { replace = false, overlay = false } = {}) {
    if (overlay && !state.detail) {
      lastOpener = document.activeElement?.dataset.focus || null;
      $('#notice').hidden = true;
    }
    const entry = overlay ? { pattoveOverlay: true, origin: location.hash } : {};
    if (replace) history.replaceState(state.detail ? history.state : entry, '', hash(overrides));
    else history.pushState(entry, '', hash(overrides));
    renderRoute();
  }
  function closeDetail() {
    if (history.state?.pattoveOverlay && history.state.origin) history.back();
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
  function savedResults() {
    return state.saved.filter(item => matches(catalog.patterns.find(p => p.id === item.id), state.query)).reverse();
  }
  function hideStyleMenu(restore = false) {
    const menu = $('#style-menu');
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    $('#style-switch').setAttribute('aria-expanded', 'false');
    if (restore) $('#style-switch').focus();
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
    hideStyleMenu();
    suggestions = isCollection() ? library.suggestions(state, query) : catalog.patterns.filter(p => matches(p, query) && (state.page !== 'saved' || state.saved.some(item => item.id === p.id))).slice(0, 6);
    suggestionIndex = -1;
    $('#search-suggestions').innerHTML = suggestions.length ? suggestions.map((p, i) => `<button type="button" role="option" aria-selected="false" tabindex="-1" class="search-suggestion" id="suggestion-${i}" data-suggest-open="${p.id}"><span>${views.escape(p.name)}</span><small>${views.escape(isCollection() ? library.suggestionGroup(state.page, p) : catalog.categories.find(c => c.id === p.category).name)}</small></button>`).join('') : '<p class="search-no-match">일치하는 항목이 없어요</p>';
    $('#search-popover').hidden = false;
    $('#query').setAttribute('aria-expanded', 'true');
    $('#query').removeAttribute('aria-activedescendant');
  }
  function submitSearch() {
    const query = $('#query').value.trim();
    hideSuggestions();
    navigate({ query, category: 'all', limit: 48 }, { replace: true });
    $('#main').focus({ preventScroll: true });
  }
  function openSuggestion(id) {
    if (isCollection()) { navigate({ detail: id }, { overlay: true }); lastOpener = 'search-query'; return; }
    const style = state.page === 'saved' ? [...state.saved].reverse().find(item => item.id === id)?.style : state.style;
    navigate({ detail: id, style }, { overlay: true });
    lastOpener = 'search-query';
  }
  function render(previousDetail = state.detail, focus = document.activeElement?.dataset.focus) {
    document.body.dataset.page = state.page;
    const searchable = !['styles', 'docs'].includes(state.page);
    document.body.dataset.search = String(searchable);
    document.title = `패토브 · ${state.page === 'patterns' ? views.styleName(state.style) : state.page === 'docs' ? library.documentName(state.doc) : ({ saved: '저장', styles: '스타일', components: '구성요소', dictionary: '사전' })[state.page]}`;
    $('#primary-nav').innerHTML = library.navigation(state);
    $('#header-context').innerHTML = views.header(state);
    $('#site-navigation').hidden = !['patterns', ...library.pages].includes(state.page);
    $('#sidebar').innerHTML = state.page === 'patterns' ? views.sidebar(state) : library.pages.includes(state.page) ? library.sidebar(state) : '';
    $('.search-area').hidden = !searchable;
    $('#query').placeholder = ({ saved: '저장한 패턴 검색', dictionary: '사전 검색', components: '구성요소 검색' })[state.page] || '패턴 검색';
    $('#query').setAttribute('aria-label', $('#query').placeholder);
    if (document.activeElement !== $('#query')) $('#query').value = state.query;
    $('#clear-search').hidden = !$('#query').value;
    $('#saved-link').setAttribute('aria-label', `저장한 패턴${state.saved.length ? `, ${state.saved.length}개` : ''}`);
    if (state.page === 'saved') $('#saved-link').setAttribute('aria-current', 'page');
    else $('#saved-link').removeAttribute('aria-current');
    $('.saved-dot').hidden = !state.saved.length;
    const found = state.page === 'saved' ? savedResults() : results();
    $('#main').innerHTML = state.page === 'docs' ? library.docPage(state) : isCollection() ? library.collection(state) : state.page === 'styles' ? views.styles() : state.page === 'patterns' ? views.patterns(state, found) : views.saved(state, found);
    if (state.detail) {
      const scroll = dialog.scrollTop;
      dialog.innerHTML = isCollection() ? library.detail(state) : views.detail(state, catalog.patterns.find(p => p.id === state.detail));
      if (!dialog.open) dialog.showModal();
      if (previousDetail === state.detail && focusKey(focus)) dialog.scrollTop = scroll;
      else $('#detail-title').focus({ preventScroll: true });
    } else {
      if (dialog.open) dialog.close();
      dialog.replaceChildren();
      if (previousDetail) {
        if (!focusKey(lastOpener)) $('#main').focus({ preventScroll: true });
        lastOpener = null;
      } else focusKey(focus);
    }
  }
  function renderRoute() {
    hideSuggestions(); hideStyleMenu();
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
    if (previousPage !== state.page || (!state.detail && (previousStyle !== state.style || previousCategory !== state.category || previousDocument !== state.doc))) {
      window.scrollTo(0, 0);
      if (!state.detail) $('#main').focus({ preventScroll: true });
    }
    $('#announcer').textContent = state.page === 'styles' ? '스타일 3개' : state.page === 'docs' ? library.documentName(state.doc) : `${isCollection() ? '항목' : '패턴'} ${isCollection() ? library.currentItems(state).length : state.page === 'saved' ? savedResults().length : results().length}개`;
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
  function toggleSave(id, style = state.style) {
    const exists = state.saved.some(item => item.id === id && item.style === style);
    undoSaved = [...state.saved];
    state.saved = exists ? state.saved.filter(item => item.id !== id || item.style !== style) : [...state.saved, { id, style }];
    const persisted = persist();
    render();
    if (state.detail) {
      // Native modal makes outside notifications inert; feedback belongs inside it.
      if (!persisted) dialog.querySelector('.dialog-footer').insertAdjacentHTML('afterbegin', '<p class="save-status" role="status">지금 열린 화면에서만 저장됩니다.</p>');
    } else notify(persisted ? `${catalog.patterns.find(p => p.id === id).name} ${exists ? '저장 해제됨' : '저장됨'}` : '지금 열린 화면에서만 저장됩니다.', true);
  }
  document.addEventListener('click', event => {
    if (!event.target.closest('.style-switcher')) hideStyleMenu();
    if (!event.target.closest('.search-area')) hideSuggestions();
    const target = event.target.closest('button, a');
    if (!target || target.disabled) return;
    const data = target.dataset;
    if (target.matches('a') && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
    if (target.classList.contains('skip-link')) { event.preventDefault(); $('#main').focus(); return; }
    if (data.applyStyle) {
      event.preventDefault();
      const inLibrary = !!target.closest('#style-menu');
      navigate({ page: 'patterns', style: data.applyStyle, category: inLibrary ? state.category : 'all', query: inLibrary ? state.query : '', detail: null });
      persist();
    } else if (target.matches('a[href^="#/"]')) {
      event.preventDefault();
      history.pushState({}, '', target.getAttribute('href'));
      renderRoute();
    } else if (data.suggestOpen) openSuggestion(data.suggestOpen);
    else if (data.libraryEntry) navigate({ detail: data.libraryEntry }, { overlay: true });
    else if (data.open) navigate({ detail: data.open, style: data.style || state.style }, { overlay: true });
    else if (data.category) navigate({ category: data.category }, { replace: true });
    else if (data.quickSave) toggleSave(data.quickSave, data.style);
    else if (data.save) toggleSave(data.save);
    else if (data.remove) {
      const nextKey = target.closest('.pattern-card').nextElementSibling?.querySelector('.card-open')?.dataset.focus;
      toggleSave(data.remove, data.style);
      if (!focusKey(nextKey)) ($('#main .card-open') || $('#main a') || $('#main')).focus();
    } else if (data.action === 'style-menu') {
      const menu = $('#style-menu');
      const open = menu.hidden;
      hideSuggestions();
      menu.hidden = !open; target.setAttribute('aria-expanded', String(open));
      if (open) (menu.querySelector('[aria-pressed="true"]') || menu.querySelector('button')).focus();
    } else if (data.action === 'reset' || data.action === 'clear-query') {
      navigate({ query: '', limit: 48, ...(data.action === 'reset' ? { category: 'all' } : {}) }, { replace: true });
    } else if (data.action === 'load-more') {
      const firstNew = library.currentItems(state)[state.limit]?.id;
      navigate({ limit: state.limit + 48 }, { replace: true });
      if (firstNew) document.querySelector(`[data-focus="entry-${CSS.escape(firstNew)}"]`)?.focus();
    } else if (data.action === 'retry-document') renderRoute();
    else if (data.action === 'search-all') submitSearch();
    else if (data.action === 'undo-save' && undoSaved) {
      state.saved = undoSaved; undoSaved = null;
      const persisted = persist(); render();
      $('#notice').hidden = true;
      $('#announcer').textContent = '이전 저장 상태로 되돌렸어요.';
      if (!persisted) notify('지금 열린 화면에서만 저장됩니다.');
      if (!dialog.open) $('#main').focus({ preventScroll: true });
    } else if (data.action === 'close-dialog') closeDetail();
  });
  document.addEventListener('change', event => {
    if (event.target.matches('[data-library-category]')) navigate({ category: event.target.value, limit: 48 }, { replace: true });
    if (event.target.matches('[data-document-select]')) navigate({ doc: event.target.value, section: '' });
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
    if (event.key === 'Escape') hideStyleMenu(true);
    if (event.key === '/' && !['styles', 'docs'].includes(state.page) && !dialog.open && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input,textarea,select,[contenteditable="true"]')) {
      event.preventDefault(); $('#query').focus();
    }
    const menu = event.target.closest('#style-menu');
    if (menu && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const options = [...menu.querySelectorAll('button')];
      const i = options.indexOf(document.activeElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (i + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      options[next].focus();
    }
  });
  document.addEventListener('focusin', event => { if (!event.target.closest('.style-switcher')) hideStyleMenu(); });
  $('#clear-search').addEventListener('click', () => { navigate({ query: '' }, { replace: true }); $('#query').focus(); });
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeDetail(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDetail();
  });
  window.addEventListener('popstate', renderRoute);
  window.addEventListener('hashchange', () => { if (location.hash !== renderedHash && location.hash !== '#main') renderRoute(); });
  if (!location.hash || location.hash === '#main') history.replaceState({}, '', '#/styles');
  renderRoute();
})();

