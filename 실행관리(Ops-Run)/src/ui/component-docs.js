(() => {
  const { parts: p, systemRegistry: r } = window.Pattove;
  const e = p.esc;
  // References carry the exact part, shape and source to the project where it will be used.
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
    return `<li class="variant-card" data-variant-card="${v.id}"${v.id === current ? ' data-current' : ''}>${live(item.id, { [item.gallery.key]: v.id }, style, undefined, item.gallery.sample).replace('<div ', '<div inert ')}<button type="button" class="variant-pick ds-button" data-variant="ghost" data-variant-pick="${v.id}" aria-pressed="${v.id === current}">${pickLabel(v, v.id === current)}</button>${window.Pattove.references.control(window.Pattove.references.shapeID(item, v.id))}</li>`;
  }
  const pickLabel = (v, current) => `<strong>${e(v.name)}</strong>${current ? `<span class="variant-kept" role="img" aria-label="사용 중" title="사용 중">${p.icon('check')}</span>` : ''}`;
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
  function installation(item, style) {
    if (!item.provenance) return '';
    const base = location.protocol === 'file:' ? 'http://127.0.0.1:4173' : location.origin;
    return `<details class="component-install"><summary>가져다 쓰기 · HTML / React</summary><p class="component-install-links"><a class="ds-button" data-variant="outline" data-size="sm" href="src/registry/examples/${item.id}.html" download="${item.id}.html">단독 HTML 다운로드</a><a class="ds-button" data-variant="ghost" data-size="sm" href="문서/관리 화면 재사용.md">데이터 연결과 사용 조건</a></p>${['html','react'].map(env => `<p>${env === 'html' ? 'HTML' : 'React'} 설치</p><pre tabindex="0" aria-label="${env === 'html' ? 'HTML' : 'React'} 설치 명령"><code>${e(`npx shadcn@4.21.0 add ${base}/src/registry/r/pattove-${style}-${item.id}-${env}.json`)}</code></pre>`).join('')}<p>로컬 서버를 켜고 사용할 프로젝트에서 실행합니다. 소스와 사용 허가는 design/에 설치됩니다.</p></details>`;
  }
  // The part page is only the grid of shapes, drawn in the current style. Tokens have no shapes, so they show their one picture.
  function page(state) {
    const item = r.index.get(state.detail), g = item.gallery;
    const options = r.normalizeOptions(item.id, state.options), style = window.Pattove.views.previewStyle(state);
    // The dictionary entry a part implements carries the name the industry uses for it; the item's own English name, else that term's parenthesis, sits after the title.
    const term = window.Pattove.library.entries.find(x => x.id === item.entry)?.term, alias = item.english || term?.match(/\(([^)]+)\)\s*$/)?.[1];
    const body = g
      ? `<ul class="variant-grid" id="component-variants" role="list" aria-label="표현 방식">${g.list.map(v => card(item, v, options[g.key], style)).join('')}</ul>`
      : `<div class="part-demo" id="component-preview"${item.browse.fit ? ' data-wide="true"' : ''}>${live(item.id, options, style, 'component-live')}<p class="ds-demo-note" role="status"></p></div>`;
    return `<article class="component-page" data-component="${item.id}" aria-labelledby="detail-title"><header class="component-heading"><h2 id="detail-title" tabindex="-1">${e(item.name)}${alias ? ` (${e(alias)})` : ''}</h2>${window.Pattove.references.control(item.id)}</header>${body}${installation(item, style)}</article>`;
  }
  window.Pattove.componentDocs = { page, url, live, refresh, chosen, choose, defaults };
})();
