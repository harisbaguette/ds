(() => {
  const { parts: p, systemRegistry: r } = window.Pattove;
  const e = p.esc;
  // Part links sit in the filter row under the header, smallest layer first; the open part is dark like a pressed chip.
  function partLinks(state) {
    const order = ['Token','Primitive','Atom','Molecule','Module','Template','Page'];
    const items = [...r.items].sort((x, y) => order.indexOf(x.layer) - order.indexOf(y.layer));
    return '<div class="filter-row"><nav class="filter-scroll" aria-label="부품 목록">'+items.map(item=>'<a class="chip" href="#/system?detail='+item.id+'" data-focus="part-'+item.id+'"'+(state.detail===item.id?' aria-current="page"':'')+'>'+e(item.name)+'</a>').join('')+'</nav></div>';
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
