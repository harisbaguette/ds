(() => {
  const { parts: p, systemRegistry: r } = window.Pattove;
  const e = p.esc;
  function sidebar(state) {
    const groups = [['기초',['Token','Primitive']],['부품',['Atom','Molecule']],['조합',['Module','Template','Page']]];
    return groups.map(([name,layers])=>'<p class="system-nav-group">'+name+'</p>'+r.items.filter(item=>layers.includes(item.layer)).map(item=>'<a class="component-sidebar-link" href="#/system?style=main&detail='+item.id+'"'+(state.detail===item.id?' aria-current="page"':'')+'>'+e(item.name)+'</a>').join('')).join('');
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
  window.Pattove.systemUI = { sidebar, detail, hydrate, updateInspector, itemMarkup };
})();
