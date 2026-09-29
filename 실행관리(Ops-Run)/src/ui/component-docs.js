(() => {
  const { parts: p, systemRegistry: r } = window.Pattove;
  const e = p.esc;
  // The part page is for looking and picking only. Getting a part into a project happens through the registry files and commands, never on this screen.
  const url = (id, extras = {}) => '#/system?' + new URLSearchParams({ detail:id, ...extras });
  // The shape picked on the grid is kept per part. Blocked storage falls back to memory for this visit.
  const choiceKey = 'pattove-part-choice';
  const memory = {};
  const stored = () => { try { return JSON.parse(localStorage.getItem(choiceKey) || '{}') || {}; } catch { return {}; } };
  function chosen(id) {
    const gallery = r.index.get(id)?.gallery, value = memory[id] ?? stored()[id];
    return gallery?.list.some(v => v.id === value) ? value : null;
  }
  function choose(id, value) {
    memory[id] = value;
    try { localStorage.setItem(choiceKey, JSON.stringify({ ...stored(), [id]: value })); } catch {}
  }
  // Options a part opens with when the address names none: the kept version, if any.
  const defaults = id => { const g = r.index.get(id)?.gallery, value = chosen(id); return g && value ? { [g.key]: value } : {}; };
  const screen = '<div class="variant-screen" aria-hidden="true"><i></i><i></i><i></i></div>';
  // sample: extra options only a gallery card adds (for example an already-open notice), never part of the address.
  function live(id, options, style = 'main', prefix, sample = {}) {
    const frame = r.index.get(id).gallery?.frame;
    let part = p.renderItem(id, prefix, { ...r.normalizeOptions(id, options), ...sample });
    // Phone frame: a whole screen drawn at device size, shrunk to fit the card.
    if (frame === 'phone') part = `<div class="variant-phone">${part}</div>`;
    return frame ? `<div class="ds theme-${style} variant-frame" data-style="${style}" data-frame="${frame}">${frame === 'phone-bottom' ? screen : ''}${part}</div>` : `<div class="ds theme-${style}" data-style="${style}">${part}</div>`;
  }
  // A card is the picture plus its name. Pressing it makes that shape the one this part uses.
  function card(item, v, current, style) {
    return `<li class="variant-card" data-variant-card="${v.id}"${v.id === current ? ' data-current' : ''}>${live(item.id, { [item.gallery.key]: v.id }, style, undefined, item.gallery.sample).replace('<div ', '<div inert ')}<button type="button" class="variant-pick" data-variant-pick="${v.id}" aria-pressed="${v.id === current}">${pickLabel(v, v.id === current)}</button></li>`;
  }
  const pickLabel = (v, current) => `<strong>${e(v.name)}</strong>${current ? `<span class="variant-kept">${p.icon('check')}사용 중</span>` : ''}`;
  // Keeps focus on the pressed card: only the marks change.
  function refresh(state) {
    const g = r.index.get(state.detail)?.gallery;
    if (!g) return;
    document.querySelectorAll('.variant-card').forEach(node => {
      const v = g.list.find(x => x.id === node.dataset.variantCard), current = v.id === state.options[g.key], pick = node.querySelector('.variant-pick');
      if (pick.getAttribute('aria-pressed') === String(current)) return;
      node.toggleAttribute('data-current', current);
      pick.setAttribute('aria-pressed', String(current));
      pick.innerHTML = pickLabel(v, current);
    });
  }
  // The part page is only the grid of shapes, drawn in the current style. Tokens have no shapes, so they show their one picture.
  function page(state) {
    const item = r.index.get(state.detail), g = item.gallery;
    const options = r.normalizeOptions(item.id, state.options);
    // The dictionary entry a part implements carries the name the industry uses for it; the item's own English name, else that term's parenthesis, sits after the title.
    const term = window.Pattove.library.entries.find(x => x.id === item.entry)?.term, alias = item.english || term?.match(/\(([^)]+)\)\s*$/)?.[1];
    const body = g
      ? `<ul class="variant-grid" id="component-variants" role="list" aria-label="표현 방식">${g.list.map(v => card(item, v, options[g.key], state.style)).join('')}</ul>`
      : `<div class="part-demo" id="component-preview"${item.browse.fit ? ' data-wide="true"' : ''}>${live(item.id, options, state.style, 'component-live')}<p class="ds-demo-note" role="status"></p></div>`;
    return `<article class="component-page" data-component="${item.id}" aria-labelledby="detail-title"><header class="component-heading"><h2 id="detail-title" tabindex="-1">${e(item.name)}${alias ? ` (${e(alias)})` : ''}</h2></header>${body}</article>`;
  }
  window.Pattove.componentDocs = { page, url, live, refresh, chosen, choose, defaults };
})();
