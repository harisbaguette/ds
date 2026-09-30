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
  const pickLabel = (v, current) => `<strong>${e(v.name)}</strong>${current ? `<span class="variant-status"><span class="variant-kept" role="img" aria-label="사용 중">${p.icon('check')}</span><span aria-hidden="true">사용 중</span></span>` : ''}`;
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
    return `<details class="component-install"><summary>${p.icon('chevron')}가져다 쓰기 · HTML / React</summary><p class="component-install-links"><a class="ds-button" data-variant="outline" data-size="sm" href="src/registry/examples/${item.id}.html" download="${item.id}.html">단독 HTML 다운로드</a><a class="ds-button" data-variant="ghost" data-size="sm" href="문서/관리 화면 재사용.md">데이터 연결과 사용 조건</a></p>${['html','react'].map(env => `<p>${env === 'html' ? 'HTML' : 'React'} 설치</p><pre tabindex="0" aria-label="${env === 'html' ? 'HTML' : 'React'} 설치 명령"><code>${e(`npx shadcn@4.21.0 add ${base}/src/registry/r/pattove-${style}-${item.id}-${env}.json`)}</code></pre>`).join('')}<p>로컬 서버를 켜고 사용할 프로젝트에서 실행합니다. 소스와 사용 허가는 design/에 설치됩니다.</p></details>`;
  }
  // A token kind's roles, read from its semantic stylesheet so the table never drifts from the source.
  // Browsers that hide a file:// stylesheet's rules return null, and the page keeps the kind's one picture.
  function tokenRoles(kind) {
    const sheet = [...document.styleSheets].find(s => s.href?.endsWith('/tokens/semantic/' + kind + '.css'));
    try {
      const names = new Set();
      for (const rule of sheet?.cssRules || []) for (const name of rule.style || []) if (name.startsWith('--p-')) names.add(name);
      return names.size ? [...names] : null;
    } catch { return null; }
  }
  // One row per role: its name, its value in the preview style (filled in by hydrate) and a picture drawn with that role.
  const sampleText = { text: '가', weight: '가나', tracking: 'Aa 가나', typography: '가나 Aa', leading: '가나다<br>라마바' };
  function tokenSwatch(kind, role) {
    const detail = kind === 'motion' ? ` data-motion="${/duration/.test(role) ? 'duration' : /ease/.test(role) ? 'ease' : 'rise'}"`
      : kind === 'typography' ? ` data-font="${/font$/.test(role) ? 'family' : 'type'}"`
      : kind === 'stroke' ? ` data-stroke="${/icon/.test(role) ? 'icon' : /slant/.test(role) ? 'slant' : 'line'}"`
      : kind === 'border' ? ` data-border="${/underline/.test(role) ? 'underline' : /offset/.test(role) ? 'offset' : 'width'}"` : '';
    const inner = sampleText[kind] || (/underline/.test(role) ? '가나 Aa' : '') || (kind === 'stroke' && /icon/.test(role) ? p.icon('check') : kind === 'motion' ? '<i></i>' : '');
    return kind === 'layer' ? '' : `<span class="token-swatch" data-kind="${kind}"${detail} style="--token-value:var(${role})${kind === 'typography' && /font$/.test(role) ? `;font-family:var(${role})` : ''}">${inner}</span>`;
  }
  function tokenTable(item, style) {
    const kind = item.id.slice('token-'.length), roles = tokenRoles(kind);
    if (!roles) return live(item.id, {}, style, 'component-live');
    return `<div class="ds theme-${style}" data-style="${style}"><table class="token-table" role="table" aria-label="${e(item.name)}"><thead role="rowgroup"><tr role="row"><th role="columnheader" scope="col">역할</th><th role="columnheader" scope="col">값</th><th role="columnheader" scope="col">견본</th></tr></thead><tbody role="rowgroup">${roles.map(role => `<tr role="row"><th role="rowheader" scope="row"><code>${role}</code></th><td role="cell"><code data-token-value="${role}"></code></td><td role="cell">${tokenSwatch(kind, role)}</td></tr>`).join('')}</tbody></table></div>`;
  }
  // Every page is the same frame: title, then the stage, then the list of shapes when the part has more than one.
  // Parts with shapes show them as the stage's cells; tokens show one row per role; blocks sit at the width they are used at.
  function page(state) {
    const item = r.index.get(state.detail), g = item.gallery, token = item.layer === 'Token';
    const options = r.normalizeOptions(item.id, state.options), style = window.Pattove.views.previewStyle(state);
    // The card under a built item shows the linked dictionary term, so the title's parenthesis uses that same term; the item's own English name fills in when there is none.
    const term = window.Pattove.library.entries.find(x => x.id === item.entry)?.term, alias = term?.match(/\(([^)]+)\)\s*$/)?.[1] || item.english;
    // A shell's menu links point back at this page, so trying them never leaves it.
    const sample = item.id === 'admin-shell' ? { navigation: ['자료', '사용자', '설정'].map((label, i) => ({ label, href: url(item.id), current: i === 0 })) } : {};
    const body = g
      ? `<ul class="variant-grid" id="component-variants" role="list" aria-label="표현 방식">${g.list.map(v => card(item, v, options[g.key], style)).join('')}</ul>`
      : `<div class="part-demo" id="component-preview"${token ? ' data-token="true"' : item.browse.fit ? ' data-wide="true"' : ''}>${token ? tokenTable(item, style) : live(item.id, options, style, 'component-live', sample)}<p class="ds-demo-note" role="status"></p></div>`;
    return `<article class="component-page" data-component="${item.id}" data-shelf="${item.browse.shelf}" aria-labelledby="detail-title"><header class="component-heading"><h2 id="detail-title" tabindex="-1">${e(item.name)}${alias ? ` <span class="component-alias">(${e(alias)})</span>` : ''}</h2>${window.Pattove.references.control(item.id)}</header>${body}${installation(item, style)}</article>`;
  }
  window.Pattove.componentDocs = { page, url, live, refresh, chosen, choose, defaults };
})();
