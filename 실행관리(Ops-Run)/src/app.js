(() => {
  'use strict';
  const { catalog, views, previews, libraryUI: library, systemUI: system, systemRegistry, componentDocs, motionUI: motion } = window.Pattove;
  const isCollection = () => ['dictionary', 'components'].includes(state.page);
  const $ = selector => document.querySelector(selector);
  document.querySelectorAll('[data-ui-icon-slot]').forEach(node => {
    node.outerHTML = window.Pattove.uiIcon(node.dataset.uiIconSlot);
  });
  const validPattern = id => catalog.patterns.some(p => p.id === id);
  const validStyle = id => catalog.styles.some(s => s.id === id);
  // 스타일 화면에서 고른 디자인 스타일은 앱 전체에 입혀지고 다음 방문에도 유지된다.
  const styleKey = 'pattove-style';
  const storedStyle = (() => { try { return localStorage.getItem(styleKey); } catch { return null; } })();
  // 부품·블록·템플릿 화면의 견본만 다른 스타일로 그려 보는 선택. 사이트는 그대로이고, 이번 방문 동안 탭을 옮겨도 유지된다.
  const previewKey = 'pattove-preview-style';
  const storedPreview = (() => { try { return sessionStorage.getItem(previewKey); } catch { return null; } })();
  const state = {
    page: 'styles', filters: {}, query: '', style: validStyle(storedStyle) ? storedStyle : 'main', preview: validStyle(storedPreview) ? storedPreview : null, detail: null, options: {}, section: '', pageNo: 1, missing: null
  };
  let lastOpener = null;
  let renderedHash = '';
  let suggestions = [];
  let searchScope='all', searchExpanded={}, searchCross=false;
  // The last default shape saved on a part page, so the notice can undo it.
  let lastPick = null;
  let mainRenderKey = '';
  // The first screen keeps the browser's own starting focus; later screen changes move focus to the new title.
  let firstRoute = true;
  history.scrollRestoration = 'manual';
  const dialog = $('#detail-dialog');
  // Search is used rarely, so it lives in one modal opened from the top bar's search button (or /).
  const searchDialog = $('#search-dialog');
  let searchPageScroll = [0, 0];

  // In-page anchors clear the persistent style/search header at every viewport size.
  function updateChromeOffset() {
    const bar = $('.app-top');
    const shown = bar.getClientRects().length && getComputedStyle(bar).position === 'sticky';
    const gap = getComputedStyle(bar).getPropertyValue('--p-space-md').trim();
    document.documentElement.style.setProperty('--chrome-bottom', `calc(${shown ? Math.ceil(bar.getBoundingClientRect().height) : 0}px + ${gap})`);
  }
  function revealActiveShelf() {
    const nav = $('#primary-nav'), active = nav.querySelector('[aria-current="page"]');
    if (!active) return;
    const viewport = nav.getBoundingClientRect(), tab = active.getBoundingClientRect();
    if (tab.left < viewport.left) nav.scrollLeft += tab.left - viewport.left;
    else if (tab.right > viewport.right) nav.scrollLeft += tab.right - viewport.right;
  }
  const list = value => [...new Set(String(value || '').split(',').filter(Boolean))];
  function readFilters(page, params) {
    if (page === 'motion') return motion.filters(params);
    if (page === 'patterns') return { category: list(params.get('category')).filter(id => id !== 'all' && catalog.categories.some(c => c.id === id)) };
    return isCollection() ? library.readFilters(page, params) : {};
  }
  const cleared = filters => Object.fromEntries(Object.entries(filters).map(([key, value]) => [key, Array.isArray(value) ? [] : value]));
  const drawerMedia = matchMedia(`(max-width: ${getComputedStyle(document.documentElement).getPropertyValue('--p-bp-xl').trim()})`);
  function rememberLocation(focus = document.activeElement?.dataset.focus) {
    history.replaceState({...history.state,pattoveScroll:[scrollX,scrollY],pattoveFocus:focus},'',location.href);
  }
  function hash(overrides = {}) {
    const next = { ...state, ...overrides };
    if (next.missing) return location.hash;
    const params = new URLSearchParams();
    if (next.page === 'patterns') params.set('style', next.style);
    if (next.page === 'patterns' && next.filters.category?.length) params.set('category', next.filters.category.join(','));
    if (library.pages.includes(next.page)) library.writeFilters(next, params);
    if (next.page === 'motion') motion.writeFilters(next, params);
    if (next.query && !['styles'].includes(next.page)) params.set('q', next.query);
    if (['dictionary', 'components', 'motion'].includes(next.page) && next.pageNo > 1) params.set('p', next.pageNo);
    if (next.detail) params.set('detail', next.detail);
    if (next.page === 'system' && next.detail) {
      if (next.preview) params.set('preview', next.preview);
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
    const pages = ['styles', 'patterns', 'system', 'motion', ...library.pages];
    state.missing = null;
    // An address naming a page, shelf or item that does not exist shows a not-found page instead of some other item.
    const missing = id => { state.missing = { id: String(id).slice(0, 100) }; state.page = 'missing'; state.filters = {}; state.query = ''; state.detail = null; state.options = {}; state.pageNo = 1; };
    if (page && !pages.includes(page)) return missing(page);
    state.page = pages.includes(page) ? page : 'styles';
    if (state.page === 'dictionary' && params.has('shelf') && !window.Pattove.library.shelves.some(s => s.id === params.get('shelf'))) return missing(params.get('shelf'));
    state.filters = readFilters(state.page, params);
    state.query = ['styles'].includes(state.page) ? '' : (params.get('q') || '').slice(0, 100);
    state.section = (params.get('section') || '').slice(0, 250);
    state.pageNo = Math.min(9999, Math.max(1, Number.parseInt(params.get('p'), 10) || 1));
    if (validStyle(params.get('style'))) state.style = params.get('style');
    if (validStyle(params.get('preview'))) state.preview = params.get('preview');
    state.detail = (state.page === 'motion' ? motion.index.has(params.get('detail')) : state.page === 'styles' ? validStyle(params.get('detail')) && params.get('detail') !== 'base' : state.page === 'system' ? systemRegistry.index.has(params.get('detail')) : isCollection() ? library.validDetail(state.page, params.get('detail')) : state.page === 'patterns' && validPattern(params.get('detail'))) ? params.get('detail') : null;
    if (params.get('detail') && !state.detail) return missing(params.get('detail'));
    if (state.page === 'system' && !state.detail) { state.detail = (systemRegistry.matching(state.query)[0] || systemRegistry.items[0]).id; state.query = ''; }
    state.options = state.page === 'system' && state.detail ? systemRegistry.normalizeOptions(state.detail, { ...componentDocs.defaults(state.detail), ...Object.fromEntries([...params].filter(([key]) => key.startsWith('option-')).map(([key,value]) => [key.slice(7),value])) }) : {};
    if (isCollection()) state.pageNo = Math.min(state.pageNo, library.pageCount(state));
    if (state.page === 'motion') state.pageNo = Math.min(state.pageNo, motion.pageCount(state));
    if (state.page === 'dictionary' && state.detail) {
      const implementation = systemRegistry.index.get(state.detail) || systemRegistry.items.find(i=>i.entry===state.detail);
      if (implementation) { state.page='system'; state.detail=implementation.id; state.filters={}; state.options=systemRegistry.normalizeOptions(implementation.id, componentDocs.defaults(implementation.id)); }
    }
  }
  function navigate(overrides, { replace = false, overlay = false, opener, searchOrigin = false } = {}) {
    rememberLocation(opener);
    if (overlay && state.page !== 'system' && !state.detail) lastOpener = opener || document.activeElement?.dataset.focus || null;
    const entry = searchOrigin ? {pattoveOverlay:true, origin:location.hash, depth:1, pattoveSearchDetail:true}
      : overlay && state.page !== 'system' ? { pattoveOverlay: true, origin: history.state?.pattoveOverlay ? history.state.origin : location.hash, depth: (history.state?.pattoveOverlay ? history.state.depth || 1 : 0) + 1 } : {};
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
  // A new screen moves focus to its title, so a screen reader starts at the heading instead of the whole page.
  function focusHeading() {
    const shown = node => !!node && (node.checkVisibility ? node.checkVisibility() : node.getClientRects().length > 0);
    const heading = [state.detail && document.getElementById('detail-title'), $('#page-title')].find(shown) || $('#page-title');
    if (!heading) return;
    if (!heading.hasAttribute('tabindex')) heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
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
    $('#search-suggestions').replaceChildren();
    $('#search-idle').hidden = !!$('#query').value.trim();
    $('#search-result-status').textContent = '';
    $('#query').setAttribute('aria-expanded', 'false');
    suggestions = [];
  }
  function paintSearchScope() {
    const label=$('#query').placeholder.replace(/ 검색$/,'');
    $('#search-scope').innerHTML=`<button type="button" data-search-scope="all" aria-pressed="${searchScope==='all'}">전체</button>${['styles','missing'].includes(state.page)?'':`<button type="button" data-search-scope="current" aria-pressed="${searchScope==='current'}">${views.escape(label)}</button>`}`;
  }
  function showSuggestions() {
    const query = $('#query').value.trim();
    const search=window.Pattove.searchUI;
    paintSearchScope();searchCross=false;
    if (!query) {
      suggestions=search.recent();
      $('#search-idle').hidden=!!suggestions.length;
      $('#search-popover').hidden=!suggestions.length;
      $('#search-suggestions').innerHTML=suggestions.length?search.render(suggestions,state)+'<button type="button" class="search-more" data-action="clear-recent">최근 복사 기록 지우기</button>':'';
      system.hydrate(document);window.Pattove.mediaUI.hydrate(searchDialog);
      $('.search-all').hidden=true;
      $('#search-result-status').textContent=suggestions.length?`최근 복사 ${suggestions.length}개`:'';
      $('#query').setAttribute('aria-expanded', String(!!suggestions.length));
      return;
    }
    suggestions = searchScope==='all' ? search.all(query) : state.page === 'motion' ? (state.filters.sources ? [] : motion.matching(query).map(item=>({...item,id:'motion/'+item.id,shelf:'motion'})))
      : state.page === 'styles' ? library.searchAll(query, Infinity)
      : state.page === 'system' ? library.suggestions({page:'dictionary',filters:{shelf:library.shelfFor(state).id}}, query, Infinity)
      : isCollection() ? library.suggestions(state, query, Infinity) : catalog.patterns.filter(p => matches(p, query));
    const exact=window.Pattove.references.resolve(query);
    if(exact && query.includes('/'))suggestions=[{...exact.item,id:query}];
    const ready=item=>{const ref=window.Pattove.references.resolve(item.id);return item.art||['implementation','motion','style'].includes(ref?.type);};
    if(!suggestions.some(ready) && searchScope==='current' && !state.filters.sources && state.page!=='patterns') {
      const elsewhere=search.all(query).filter(ready);
      if(elsewhere.length){suggestions=[...elsewhere,...suggestions];searchCross=true;}
    }
    $('#search-suggestions').innerHTML = (searchCross?'<p class="search-cross-note">다른 메뉴에서 쓸 수 있는 견본을 찾았습니다.</p>':'')+search.render(suggestions, state, searchExpanded);
    system.hydrate(document);
    window.Pattove.mediaUI.hydrate(searchDialog);
    $('#search-suggestions').scrollTop = 0;
    $('#search-idle').hidden = true;
    $('#search-popover').hidden = false;
    $('.search-all').hidden=false;
    // Enter always shows the results list; only an exact ID (button/variant/outline) opens its item.
    // Its name says where Enter goes: the list that will open, or the item for an exact ID.
    const direct=query.includes('/')&&!!exact, target=direct||!suggestions.length?null:searchTarget(query);
    const where=typeof target==='string'?(target==='motion'?'모션':window.Pattove.library.shelves.find(s=>s.id===target)?.name):null;
    $('.search-all').innerHTML=(where?where+' 결과 보기':direct||target?'첫 번째 결과 열기':'검색 결과 보기')+' <span aria-hidden="true">↵</span>';
    $('.search-all').disabled=!suggestions.length;
    $('#query').setAttribute('aria-expanded', String(!!suggestions.length));
    $('#search-result-status').textContent = `검색 결과 ${suggestions.length}개`;
  }
  function openSearch(saved = null) {
    if(searchDialog.open && !saved){$('#query').focus({preventScroll:true});$('#query').select();return;}
    setMenu(false, false);
    searchPageScroll = [scrollX, scrollY];
    $('#query').value = saved?.query ?? state.query;
    searchScope=saved?.scope||'all';searchExpanded=saved?.expanded||{};
    $('#query').readOnly = !!saved;
    if (!searchDialog.open) searchDialog.showModal();
    $('#query').readOnly = false;
    $('#search-clear').hidden = !$('#query').value;
    showSuggestions();
    updateSearchViewport();
    if (saved) {
      const referenceGroup = $('.search-reference-group');
      if (referenceGroup) referenceGroup.open = saved.referencesOpen;
      if (!focusKey(saved.focus)) $('#search-close').focus({preventScroll:true});
      $('#search-suggestions').scrollTop = saved.scroll;
    } else { $('#query').focus({preventScroll:true}); $('#query').select(); }
    window.scrollTo(...searchPageScroll);
  }
  function closeSearch() {
    hideSuggestions();
    if (searchDialog.open) { searchDialog.close(); window.scrollTo(...searchPageScroll); }
  }
  // Detail search returns to its category's results; the query stays in the address.
  // Where Enter takes a search: the current list when it has matches, otherwise the list holding the first match.
  function searchTarget(query) {
    const shelf = state.page === 'dictionary' ? state.filters.shelf : state.page === 'system' ? library.shelfFor(state).id : null;
    const here = state.page === 'motion' ? (!state.filters.sources && motion.matching(query).length ? 'motion' : null)
      : shelf && library.suggestions({page:'dictionary', filters:{shelf}}, query, 1).length ? shelf : null;
    if (searchScope === 'current' && !searchCross) return here || (state.page === 'motion' ? 'motion' : shelf || 'part');
    if (here) return here;
    const first = suggestions.find(item => !item.recent);
    return first?.shelf === 'motion' ? 'motion' : first?.id?.startsWith('style/') ? first : first?.shelf || library.searchAll(query, 1)[0]?.shelf || 'part';
  }
  function submitSearch() {
    const query = $('#query').value.trim();
    if(!query || !suggestions.length)return;
    if(query.includes('/')&&window.Pattove.references.resolve(query)) {
      const first=$('#search-suggestions .search-suggestion');
      if(first)openSuggestion(first.dataset.suggestOpen);
      return;
    }
    const target = searchTarget(query);
    if (typeof target === 'object') { openSuggestion(window.Pattove.searchUI.key(target)); return; }
    closeSearch();
    setMenu(false, false);
    if (target === 'motion') navigate({page:'motion', query, filters:{category:'',sources:''}, detail:null, pageNo:1}, {replace: state.page === 'motion'});
    else {
      const same = state.page === 'dictionary' && state.filters.shelf === target;
      // Like its suggestions, a search covers the whole tab, so the left rail's pick is dropped; the 견본 있음 switch stays as it was.
      const filters = {...library.readFilters('dictionary', new URLSearchParams({shelf: target})), ...(state.page === 'dictionary' && target !== 'icon' ? {available: state.filters.available} : {})};
      navigate({ page:'dictionary', query, filters, detail: null, section: '', pageNo: 1, options: {} }, { replace: same });
    }
    focusHeading();
  }
  // Narrow screens use a navigation drawer. Closing by hand returns focus to the menu button.
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
  function openSuggestion(key) {
    const entry = suggestions.find(e=>window.Pattove.searchUI.key(e)===key);
    if(!entry)return;
    const id=entry.id;
    $('#query').blur();
    closeSearch();
    setMenu(false, false);
    $('#search-open').focus({ preventScroll: true });
    // Back returns to the page as it was before searching: same scroll, focus on the search button, search closed.
    rememberLocation('search-open');
    const ref=window.Pattove.references.resolve(id), cross=entry.recent||id.includes('/')||searchScope==='all'||searchCross||ref?.type==='implementation';
    if(cross && ref) {
      const origin=location.hash, href=new URL(window.Pattove.references.payload(id,window.Pattove.searchUI.context(entry,state)).url).hash;
      history.pushState({pattoveOverlay:true,origin,depth:1,pattoveSearchDetail:true},'',href);
      renderRoute();
      if(entry.id==='token-color'&&entry.value)window.Pattove.colorTokens.reveal(entry.value,entry.colorRole);
      else if(entry.value?.startsWith('var(')) {
        const target=$(`[data-token-copy="${CSS.escape(entry.value.slice(4,-1))}"]`);
        target?.focus({preventScroll:true});target?.scrollIntoView({block:'center'});
      }
    }
    else if (state.page === 'styles') navigate({page:'dictionary',filters:library.readFilters('dictionary',new URLSearchParams({shelf:entry.shelf})),detail:id},{overlay:true,opener:'search-open',searchOrigin:true});
    else if (state.page === 'system' && !systemRegistry.index.has(id)) navigate({page:'dictionary',filters:library.readFilters('dictionary',new URLSearchParams({shelf:library.shelfFor(state).id})),detail:id},{overlay:true,opener:'search-open',searchOrigin:true});
    else navigate({ detail: id }, { overlay: true, opener: 'search-open', searchOrigin:true });
    lastOpener = 'search-open';
  }
  // The page an unknown address opens: what was not found and one way on, the search.
  function notFound() {
    return `<section class="not-found" aria-labelledby="page-title"><div class="empty-state"><h2>‘${views.escape(state.missing.id)}’ 항목을 찾을 수 없어요</h2><button type="button" class="ds-button" data-variant="primary" data-action="open-search" data-focus="missing-search">${window.Pattove.uiIcon('search')}검색 열기</button></div></section>`;
  }
  function render(previousDetail = state.detail, focus = document.activeElement?.dataset.focus) {
    if (state.preview === state.style) state.preview = null;
    document.body.dataset.page = state.page;
    document.body.dataset.shelf = state.page==='dictionary'?state.filters.shelf:'';
    document.body.className = 'ds theme-' + state.style;
    document.querySelector('meta[name="theme-color"]').content = getComputedStyle(document.body).backgroundColor;
    document.title = state.page==='missing' ? '찾을 수 없음' : `${state.page==='motion' ? (motion.index.get(state.detail)?.name || '모션') : state.page==='system' && state.detail ? systemRegistry.index.get(state.detail).name : state.page === 'styles' && state.detail ? views.styleName(state.detail) : state.page === 'patterns' ? views.styleName(state.style) : ({ styles: '스타일', components: '구성요소', dictionary: '사전' })[state.page]}`;
    const oldShelf = $('#primary-nav [aria-current="page"]')?.dataset.focus;
    const subnavScroll = $('.menu-body').scrollTop;
    $('#primary-nav').innerHTML = library.navigation(state);
    revealActiveShelf();
    const subnav=library.subnavigation(state);
    $('#secondary-nav').innerHTML=subnav;
    $('#app-menu').hidden=!subnav;
    $('#menu-toggle').hidden=!subnav;
    $('#catalog-categories').hidden=!subnav;
    if (!subnav) setMenu(false,false);
    document.body.classList.toggle('has-subnav',!!subnav);
    $('#top-title').textContent=$('#primary-nav [aria-current="page"]')?.textContent || '';
    $('.menu-body').scrollTop=oldShelf === $('#primary-nav [aria-current="page"]')?.dataset.focus ? subnavScroll : 0;
    $('#header-context').innerHTML = state.page==='missing' ? '<h1 id="page-title" class="collection-title">찾을 수 없음</h1>' : views.header(state);
    // A detail page's title is read aloud but not drawn. It sits outside the toolbar, which phones fold away on detail pages.
    const hiddenTitle = $('#header-context > h1.sr-only');
    $('#page-heading').replaceChildren(...(hiddenTitle ? [hiddenTitle] : []));
    const shelfName = $('#primary-nav [aria-current="page"]')?.textContent || '메뉴';
    const currentCategory = $('#secondary-nav .nav-minor[aria-current="true"], #secondary-nav .nav-subcategory[aria-current="true"]')?.textContent.trim() || '전체 보기';
    $('#category-label').textContent = shelfName === '스타일' ? '스타일 목록' : shelfName + ' 분류';
    $('#category-current').textContent = currentCategory;
    $('#menu-toggle').title = `${shelfName} 분류 열기 · ${currentCategory}`;
    $('#preview-context').innerHTML = views.stylePicker(state);
    $('#preview-context').hidden = !$('#preview-context').firstElementChild;
    $('#collection-controls').innerHTML = state.page === 'motion' && !state.detail && !state.filters.sources ? motion.collectionControls() : library.collectionControls(state);
    $('#collection-controls').hidden = !$('#collection-controls').firstElementChild;
    $('#catalog-toolbar').classList.toggle('is-library-list', state.page==='dictionary');
    $('#catalog-toolbar').classList.toggle('is-icon-list', state.page==='dictionary'&&state.filters.shelf==='icon');
    $('#catalog-toolbar').classList.toggle('has-location', !!$('#header-context .content-breadcrumb'));
    $('#catalog-toolbar').classList.toggle('is-part-detail', state.page === 'system');
    $('#catalog-toolbar').classList.toggle('is-motion-detail', state.page === 'motion' && !!state.detail);
    $('#catalog-toolbar').classList.toggle('is-motion-list', state.page === 'motion' && !state.detail && !state.filters.sources);
    $('#catalog-toolbar').classList.toggle('is-style-detail', state.page === 'styles' && !!state.detail);
    // The one active query shows as a chip beside the title; pressing it clears the search.
    const chip = $('#query-chip');
    chip.hidden = !state.query || state.page === 'system';
    chip.innerHTML = state.query ? `<span>‘${views.escape(state.query)}’ 검색</span>${previews.icon('close')}` : '';
    chip.title = state.query ? `검색어: ${state.query}` : '';
    chip.setAttribute('aria-label', `검색어 ${state.query} 지우기`);
    const searchLabel = state.page === 'missing' ? '전체 검색' : state.page === 'motion' ? (state.filters.sources ? '레퍼런스 검색' : '모션 검색') : ['dictionary','system'].includes(state.page) ? library.shelfFor(state).name+' 검색' : ['styles','components'].includes(state.page) ? '구성요소 검색' : '패턴 검색';
    $('#query').placeholder = searchLabel;
    $('#query').setAttribute('aria-label', searchLabel);
    $('#search-open').setAttribute('aria-label', searchLabel);
    $('#search-open').title = searchLabel + ' (/ 또는 Ctrl/⌘ K)';
    const nextMainKey = JSON.stringify([state.page, state.style, state.preview, state.filters, state.query, state.pageNo, state.page==='system'?[state.detail,state.options]:['styles','motion'].includes(state.page)?state.detail:null]);
    if (mainRenderKey !== nextMainKey) {
      $('#content').innerHTML = state.page === 'missing' ? notFound() : state.page === 'motion' ? (state.detail ? motion.detail(state) : motion.collection(state)) : state.page === 'styles' ? (state.detail ? views.styleDetail(state) : views.styleGallery(state)) : state.page === 'system' ? system.detail(state) : isCollection() ? library.collection(state) : views.patterns(state, results());
      mainRenderKey = nextMainKey;
    }
    if (state.detail && !['system','styles','motion'].includes(state.page)) {
      const scroll = dialog.scrollTop;
      dialog.innerHTML = state.page === 'system' ? system.detail(state) : isCollection() ? library.detail(state) : views.detail(state, catalog.patterns.find(p => p.id === state.detail));
      if (!dialog.open) dialog.showModal();
      if (previousDetail === state.detail && focusKey(focus)) dialog.scrollTop = scroll;
      else $('#detail-title').focus({ preventScroll: true });
    } else {
      if (dialog.open) dialog.close();
      dialog.replaceChildren();
      if (['system','styles','motion'].includes(state.page) && state.detail) {
        if (previousDetail !== state.detail) $('#detail-title').focus({preventScroll:true});
        else focusKey(focus);
      } else if (previousDetail) {
        if (!focusKey(lastOpener)) focusHeading();
        lastOpener = null;
      } else focusKey(focus);
    }
    system.hydrate(document);
    window.Pattove.colorTokens.hydrate();
    window.Pattove.illustrationTools.hydrate();
    window.Pattove.mediaUI.hydrate();
    motion.hydrate();
    updateChromeOffset();
  }
  function renderRoute({ restore = false } = {}) {
    document.getElementById('variant-dialog')?.close();
    if (searchDialog.open) closeSearch();
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
    if (previousPage !== state.page || (['system','styles','motion'].includes(state.page) && previousDetail!==state.detail) || (!state.detail && (previousStyle !== state.style || previousShelf !== state.filters.shelf || previousPageNo !== state.pageNo))) {
      window.scrollTo(0, 0);
      if (!state.detail && !firstRoute) focusHeading();
    } else if (!state.detail && previousFilters !== JSON.stringify(state.filters)) window.scrollTo(0, 0);
    if (state.page==='system' && state.detail && state.section) {
      const section = document.getElementById('component-'+state.section);
      if (section) { section.tabIndex=-1; section.focus({preventScroll:true}); section.scrollIntoView({block:'start'}); }
    }
    if(!(restore && history.state?.pattoveScroll) && state.page==='system' && !state.section) {
      const gallery=systemRegistry.index.get(state.detail)?.gallery;
      if(gallery && new URLSearchParams(location.hash.split('?')[1]).has('option-'+gallery.key)) {
        const target=$(`[data-variant-preview="${CSS.escape(state.options[gallery.key])}"]`);
        target?.focus({preventScroll:true});target?.scrollIntoView({block:'center'});
      }
    }
    if (restore) {
      focusKey(history.state?.pattoveFocus);
      if (history.state?.pattoveScroll) window.scrollTo(...history.state.pattoveScroll);
    }
    $('#announcer').textContent = state.page === 'missing' ? '찾을 수 없음' : state.page === 'motion' ? (motion.index.get(state.detail)?.name || (state.filters.sources ? '외부 레퍼런스' : `모션 ${motion.currentItems(state).length}개`)) : state.page === 'styles' ? (state.detail ? views.styleName(state.detail) : `스타일 ${catalog.styles.filter(s => s.id !== 'base').length}개 · ${views.styleName(state.style)} 사용 중`) : state.page === 'system' ? systemRegistry.index.get(state.detail).name : `${isCollection() ? '항목' : '패턴'} ${isCollection() ? library.currentItems(state).length : results().length}개${isCollection() && library.pageCount(state) > 1 ? ` · ${state.pageNo} / ${library.pageCount(state)}쪽` : ''}`;
    firstRoute = false;
  }
  document.addEventListener('click', event => {
    if (!event.target.closest('.search-area, #search-open, #reference-dialog') && !searchDialog.open) hideSuggestions();
    const target = event.target.closest('button, a');
    if (!target || target.disabled) return;
    const data = target.dataset;
    if (data.copyReference) {
      event.preventDefault();
      window.Pattove.references.copy(target,{...state,...(validStyle(data.copyStyle)?{preview:data.copyStyle}:{}),copyTarget:data.copyTarget});
      return;
    }
    if(data.recentValue) {window.Pattove.references.copyValue(data.recentValue,target);return;}
    if(data.searchScope) {searchScope=data.searchScope;searchExpanded={};showSuggestions();$('#query').focus({preventScroll:true});return;}
    if(data.searchMore) {
      const scroll=$('#search-suggestions').scrollTop, referencesOpen=$('.search-reference-group')?.open;
      const previousLimit=searchExpanded[data.searchMore]||8;
      searchExpanded[data.searchMore]=previousLimit+16;
      showSuggestions();if(referencesOpen&&$('.search-reference-group'))$('.search-reference-group').open=true;
      $('#search-suggestions').scrollTop=scroll;
      const group=data.searchMore==='참고 설명'?$('.search-reference-group'):$(`.search-result-group[aria-label="${CSS.escape(data.searchMore)}"]`);
      group?.querySelectorAll('.search-suggestion')[previousLimit]?.focus({preventScroll:true});return;
    }
    if(data.action==='clear-recent') {window.Pattove.searchUI.clearRecent();showSuggestions();$('#query').focus({preventScroll:true});return;}
    if (target.matches('a') && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
    if (target.classList.contains('skip-link')) { event.preventDefault(); $('#main').focus(); return; }
    if (data.styleSelect && validStyle(data.styleSelect)) {
      state.style = data.styleSelect;
      try { localStorage.setItem(styleKey, state.style); } catch {}
      render();
      $('#detail-title')?.focus({ preventScroll: true });
      $('#announcer').textContent = `${views.styleName(state.style)} 적용함`;
    }
    else if (['back-to-list','back-to-motion','back-to-styles'].includes(data.action) && history.state?.pattoveOverlay && (history.state.pattoveSearchDetail || ['motion','styles'].includes(state.page) || new URLSearchParams(history.state.origin?.split('?')[1]).get('shelf') === library.shelfFor(state).id)) {
      event.preventDefault(); rememberLocation(); history.go(-(history.state.depth || 1));
    } else if (target.matches('a[href^="#/"]')) {
      event.preventDefault();
      if (target.closest('#app-menu')) setMenu(false, false);
      rememberLocation();
      const related = state.page === 'system' && target.getAttribute('href').startsWith('#/system') && history.state?.pattoveOverlay;
      const motionDetail = state.page === 'motion' && !state.detail && target.hasAttribute('data-motion-open');
      const styleDetail = state.page === 'styles' && !state.detail && !!target.closest('.style-card');
      history.pushState(related ? {pattoveOverlay:true,origin:history.state.origin,depth:(history.state.depth||1)+1} : motionDetail || styleDetail ? {pattoveOverlay:true,origin:location.hash,depth:1} : {}, '', target.getAttribute('href'));
      renderRoute();
    } else if (data.suggestOpen) openSuggestion(data.suggestOpen);
    else if (data.libraryEntry) {
      if (!window.Pattove.illustrationTools.selectEntry(data.libraryEntry)) navigate({ detail: data.libraryEntry }, { overlay: true, opener: data.focus });
    }
    else if (data.open) navigate({ detail: data.open, style: data.style || state.style }, { overlay: true, opener: data.focus });
    else if (data.action === 'clear-filters' || data.action === 'clear-query') {
      // Clearing removes the clicked control, so focus moves to the content.
      navigate({ filters: data.action === 'clear-filters' ? cleared(state.filters) : state.filters, query: '', pageNo: 1 }, { replace: true });
      focusHeading();
    }
    // A view switch replaces the history entry; turning a page adds one, so Back returns to the previous page.
    else if (data.action === 'toggle-specimens') navigate({filters:{...state.filters,available:!state.filters.available},pageNo:1}, { replace: true });
    else if (data.action === 'show-unbuilt') {
      const scroll = [scrollX, scrollY];
      navigate({filters:{...state.filters,available:false}}, { replace: true });
      window.scrollTo(...scroll);
      $('[data-focus="specimen-filter"]')?.focus({preventScroll:true});
    }
    else if (data.action === 'open-search') {
      openSearch();
      if (state.missing) { $('#query').value = state.missing.id.replace(/[-_]+/g, ' '); $('#search-clear').hidden = false; showSuggestions(); $('#query').select(); }
    }
    else if (data.pageGo) navigate({ pageNo: Number(data.pageGo) });
    else if (data.action === 'search-all') submitSearch();
    else if (data.action === 'close-search') closeSearch();
    else if (data.action === 'close-dialog') closeDetail();
    else if (data.action === 'close-menu') setMenu(false);
    else if (data.variantPick) pickVariant(data.variantPick);
    else if ('variantUndo' in data) undoVariant();
    else if (data.variantPreview) componentDocs.openPreview(data.variantPreview,state);
  });
  // One explicit action sets the default; copying and enlarging never change it.
  function pickVariant(value) {
    const g = systemRegistry.index.get(state.detail)?.gallery, look = g?.list.find(v => v.id === value);
    if (!look) return;
    lastPick = { id: state.detail, previous: componentDocs.chosen(state.detail) };
    state.options = systemRegistry.normalizeOptions(state.detail, { ...state.options, [g.key]: value });
    const persisted=componentDocs.choose(state.detail,value);
    // The gallery is patched in place; invalidate the cached page for the next navigation.
    mainRenderKey = '';
    history.replaceState(history.state, '', hash()); renderedHash = location.hash;
    componentDocs.refresh(state,persisted,true);
    $('#announcer').textContent = `${look.name} ${persisted?'기본 모양으로 저장됨':'이번 방문 동안 적용됨'}`;
  }
  // The notice's 되돌리기 puts back the default that was kept before the last save.
  function undoVariant() {
    const g = systemRegistry.index.get(state.detail)?.gallery;
    if (!g || lastPick?.id !== state.detail) return;
    const persisted = componentDocs.choose(state.detail, lastPick.previous);
    const value = componentDocs.chosen(state.detail) || systemRegistry.normalizeOptions(state.detail, {})[g.key];
    state.options = systemRegistry.normalizeOptions(state.detail, { ...state.options, [g.key]: value });
    lastPick = null;
    mainRenderKey = '';
    history.replaceState(history.state, '', hash()); renderedHash = location.hash;
    componentDocs.refresh(state, persisted, false, true);
    $(`[data-variant-pick="${CSS.escape(value)}"]`)?.focus({ preventScroll: true });
    $('#announcer').textContent = `${g.list.find(v => v.id === value)?.name || ''} 기본 모양으로 되돌림`;
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
  $('#search-open').addEventListener('click', () => {
    $('#search-open').focus({ preventScroll:true });
    openSearch();
  });
  $('#menu-backdrop').addEventListener('click', () => setMenu(false));
  // Some browsers blur a newly hidden control before notifying matchMedia listeners.
  let hiddenNavigationFocus = null;
  document.addEventListener('focusout', event => {
    if (!event.relatedTarget && event.target.closest('#app-menu, #menu-toggle') && !event.target.checkVisibility({ visibilityProperty:true })) hiddenNavigationFocus = event.target;
  });
  drawerMedia.addEventListener('change', () => {
    const focused = document.activeElement === document.body && hiddenNavigationFocus?.isConnected ? hiddenNavigationFocus : document.activeElement;
    hiddenNavigationFocus = null;
    const focusInMenu = $('#app-menu').contains(focused);
    const focusOnToggle = focused === $('#menu-toggle');
    setMenu(false, false);
    if (focusInMenu) drawerMedia.matches ? $('#menu-toggle').focus({ preventScroll:true }) : focusHeading();
    else if (focusOnToggle && !drawerMedia.matches) focusHeading();
  });
  $('#search-clear').addEventListener('click', () => {
    $('#query').value = '';
    $('#search-clear').hidden = true;
    $('#query').focus();
    searchExpanded={};showSuggestions();
  });
  document.addEventListener('submit', event => {
    if (!event.target.matches('[data-page-jump]')) return;
    event.preventDefault();
    const input = event.target.querySelector('input'), to = Number.parseInt(input.value, 10);
    if (!to) { input.focus(); return; }
    // A number past either end goes to the nearest real page and says so.
    const pages = state.page === 'motion' ? motion.pageCount(state) : library.pageCount(state), pageNo = Math.min(Math.max(to, 1), pages);
    navigate({ pageNo });
    if (pageNo !== to) $('#announcer').textContent = `${to}쪽은 없어서 ${pageNo}쪽으로 이동했어요`;
  });
  // Picking a style in the 미리보기 dropdown redraws only the specimens; the site keeps the style it wears.
  document.addEventListener('change', event => {
    const pick = event.target.closest('[data-preview-select]')?.value;
    if (!validStyle(pick)) return;
    state.preview = pick === state.style ? null : pick;
    try { state.preview ? sessionStorage.setItem(previewKey, state.preview) : sessionStorage.removeItem(previewKey); } catch {}
    render();
    $('#announcer').textContent = `${views.styleName(pick)}로 미리보기`;
  });
  $('#search-form').addEventListener('submit', event => { event.preventDefault(); submitSearch(); });
  $('#query').addEventListener('input', () => { $('#search-clear').hidden = !$('#query').value;searchExpanded={}; showSuggestions(); });
  function revealSearchControl(control) {
    const list=$('#search-suggestions'),box=list.getBoundingClientRect(),row=control.getBoundingClientRect();
    if(row.top<box.top+4)list.scrollTop-=Math.ceil(box.top+4-row.top);
    else if(row.bottom>box.bottom-4)list.scrollTop+=Math.ceil(row.bottom-box.bottom+4);
  }
  searchDialog.addEventListener('focusin',event=>{
    if(event.target.closest('.search-result'))revealSearchControl(event.target);
  });
  searchDialog.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    if (event.target.id !== 'query' && !event.target.matches('.search-suggestion')) return;
    event.preventDefault();
    if ($('#search-popover').hidden) showSuggestions();
    const rows = [...searchDialog.querySelectorAll('.search-suggestion')].filter(node => node.checkVisibility());
    if (!rows.length) return;
    const current = rows.indexOf(document.activeElement), next = current + (event.key === 'ArrowDown' ? 1 : -1);
    if (current === 0 && event.key === 'ArrowUp') $('#query').focus();
    else {
      const row=rows[current < 0 ? (event.key === 'ArrowDown' ? 0 : rows.length - 1) : Math.min(rows.length - 1, next)];
      row.focus({preventScroll:true});revealSearchControl(row);
    }
  });
  document.addEventListener('keydown', event => {
    if (((event.key === '/' && !event.ctrlKey && !event.metaKey) || (event.key.toLowerCase()==='k' && (event.ctrlKey||event.metaKey))) && !document.querySelector('dialog[open]:not(#search-dialog)') && !event.altKey && (!event.target.closest('input,textarea,select,[contenteditable="true"]') || event.key.toLowerCase()==='k')) {
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
  searchDialog.addEventListener('close', () => { if (!searchDialog.open) hideSuggestions(); });
  searchDialog.addEventListener('cancel', event => { event.preventDefault(); closeSearch(); });
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
  window.addEventListener('resize', revealActiveShelf);
  function updateSearchViewport() {
    if (!searchDialog.open) return;
    const viewport = window.visualViewport;
    searchDialog.style.setProperty('--search-height', `${viewport?.height || innerHeight}px`);
    searchDialog.style.setProperty('--search-top', `${viewport?.offsetTop || 0}px`);
  }
  window.addEventListener('resize', updateSearchViewport);
  window.visualViewport?.addEventListener('resize', updateSearchViewport);
  window.visualViewport?.addEventListener('scroll', updateSearchViewport);
  window.visualViewport?.addEventListener('resize', updateChromeOffset);
  new ResizeObserver(updateChromeOffset).observe($('.app-top'));
  if (!location.hash || location.hash === '#main') history.replaceState({}, '', '#/styles');
  renderRoute();
})();
