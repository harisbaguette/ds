(() => {
  const { parts: p, systemRegistry: r } = window.Pattove;
  const e = p.esc;
  // The built parts sit behind one '부품 ▾' button in the filter row that names the open part; its list runs smallest layer first.
  function partLinks(state) {
    const order = ['Token','Primitive','Atom','Molecule','Module','Template','Page'];
    const items = [...r.items].sort((x, y) => order.indexOf(x.layer) - order.indexOf(y.layer));
    const { facetPanel } = window.Pattove.views, { icon } = window.Pattove.previews, current = r.index.get(state.detail);
    const rows = '<nav class="facet-list" aria-label="부품 목록">'+items.map(item=>'<a class="facet-option" href="#/system?detail='+item.id+'" data-focus="part-'+item.id+'" data-facet-name="'+e(item.name.toLocaleLowerCase())+'"'+(state.detail===item.id?' aria-current="page"':'')+'><span>'+e(item.name)+'</span>'+(state.detail===item.id?icon('check'):'')+'</a>').join('')+'</nav>';
    return '<div class="filter-row"><div class="filter-scroll"><button type="button" class="filter-menu" popovertarget="facet-part" data-focus="menu-part"'+(current?' aria-label="부품 고르기: '+e(current.name)+'"><span class="filter-menu-value">'+e(current.name)+'</span>':'><span>부품 고르기</span>')+icon('chevron-down')+'</button>'
      +facetPanel('facet-part', '부품 고르기', rows, items.length > 12)+'</div></div>';
  }
  function itemMarkup(state, options = {}) {
    const content = p.renderItem(state.detail, undefined, r.normalizeOptions(state.detail, { ...state.options, ...options }));
    return `<div class="ds theme-${state.style}" data-style="${state.style}">${content}</div>`;
  }
  function detail(state) { return window.Pattove.componentDocs.page(state); }
  function hydrate(root) {
    root.querySelectorAll('[data-token-value]').forEach(node => { node.textContent = getComputedStyle(node.closest('.ds')).getPropertyValue(node.dataset.tokenValue).trim(); });
    window.Pattove.mountParts(root);
    window.Pattove.installUI.hydrate(root);
  }
  function updateInspector(state) {
    const root = document.querySelector('.system-inspector');
    const options = Object.fromEntries([...root.querySelectorAll('[data-part-option]')].map(el => [el.dataset.partOption, el.value]));
    const markup = itemMarkup(state, options);
    root.querySelector('.part-demo').innerHTML = markup + '<p class="ds-demo-note" role="status"></p>';
    root.querySelector('#part-source').value = markup;
    const install = root.querySelector('.install-panel');
    if (install && options.icon) { install.dataset.installIcon=options.icon; window.Pattove.installUI.refresh(install); }
    window.Pattove.componentDocs.refresh(state);
    hydrate(document);
  }
  window.Pattove.systemUI = { partLinks, detail, hydrate, updateInspector, itemMarkup };
})();
