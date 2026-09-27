(() => {
  const { parts: p, systemRegistry: r } = window.Pattove;
  const e = p.esc;
  // On the part page the side menu's filter area lists every built part, smallest layer first, with a search box once the list is long.
  function partLinks(state) {
    const order = ['Token','Primitive','Atom','Molecule','Module','Template','Page'];
    const items = [...r.items].sort((x, y) => order.indexOf(x.layer) - order.indexOf(y.layer));
    const { facetSearch } = window.Pattove.views, { icon } = window.Pattove.previews;
    return '<div class="part-list">'+facetSearch('부품', items.length > 12)+'<nav class="filter-rows" aria-label="부품 목록">'+items.map(item=>'<a class="filter-option" href="#/system?detail='+item.id+'" data-focus="part-'+item.id+'" data-facet-name="'+e(item.name.toLocaleLowerCase())+'"'+(state.detail===item.id?' aria-current="page"':'')+'><span>'+e(item.name)+'</span>'+icon('check')+'</a>').join('')+'</nav></div>';
  }

  function itemMarkup(state, options = {}) {
    return window.Pattove.componentDocs.live(state.detail, { ...state.options, ...options }, state.style, 'component-live');
  }
  function detail(state) { return window.Pattove.componentDocs.page(state); }
  function hydrate(root) {
    root.querySelectorAll('[data-token-value]').forEach(node => { node.textContent = getComputedStyle(node.closest('.ds')).getPropertyValue(node.dataset.tokenValue).trim(); });
    window.Pattove.mountParts(root);
  }
  function updateInspector(state) {
    document.querySelector('.system-inspector .part-demo').innerHTML = itemMarkup(state) + '<p class="ds-demo-note" role="status"></p>';
    hydrate(document);
  }
  window.Pattove.systemUI = { partLinks, detail, hydrate, updateInspector, itemMarkup };
})();
