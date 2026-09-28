(() => {
  const { parts: p, systemRegistry: r } = window.Pattove;
  const e = p.esc;
  // The part page is for looking only: the live picture with its switches, the look-alike versions side by side, and the parts it leans on.
  // Getting a part into a project happens through the registry files and commands, never on this screen.
  const wide = id => ['search-module','template','page'].includes(id);
  const url = (id, extras = {}) => '#/system?' + new URLSearchParams({ detail:id, ...extras });
  // The version picked with "이걸로 쓰기" is kept per part. Blocked storage falls back to memory for this visit.
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
  function examples(item) {
    if (item.id === 'button') return [['채움',{variant:'primary'}],['윤곽',{variant:'outline'}],['글자',{variant:'ghost'}],['작게',{size:'sm'}],['크게',{size:'lg'}],['아이콘과 함께',{icon:'search'}],['아이콘만',{icon:'search',iconOnly:'true'}],['로딩',{state:'loading'}],['사용 불가',{state:'disabled'}]];
    const control = item.controls.find(c=>['state','tone','variant','type'].includes(c.key) && c.key !== item.gallery?.key);
    return control ? control.values.map(([value,label])=>[label,{[control.key]:value}]) : [];
  }
  function card(item, v, current, kept) {
    return `<li class="variant-card" data-variant-card="${v.id}"${v.id === current ? ' data-current' : ''}><button type="button" class="variant-pick" data-variant-pick="${v.id}" aria-pressed="${v.id === current}"><span class="variant-no">${v.no}</span><strong>${e(v.name)}</strong><span class="variant-when"><b>이럴 때</b>${e(v.when)}</span><span class="variant-save"><b>덜 하는 일</b>${e(v.saves)}</span></button>${live(item.id, { [item.gallery.key]: v.id }, 'main', undefined, item.gallery.sample).replace('<div ', '<div inert ')}${useButton(v, v.id === kept)}</li>`;
  }
  const useButton = (v, kept) => `<button type="button" class="variant-use" data-variant-use="${v.id}" aria-pressed="${kept}" aria-label="${e(v.name)} ${kept ? '사용 중' : '이걸로 쓰기'}">${kept ? p.icon('check') + '사용 중' : '이걸로 쓰기'}</button>`;
  // 스타일 = the whole app's outfit (#/styles); 모양 = one part's shape inside that style.
  function gallery(item, options, style) {
    const g = item.gallery, kept = chosen(item.id);
    return `<section id="component-variants" class="component-section"><h3>${e(g.label)} <span class="variant-count">${g.list.length}</span></h3><ul class="variant-grid" role="list">${g.list.map(v => card(item, v, options[g.key], kept)).join('')}</ul></section>`;
  }
  // Keeps focus where it is: only the big preview and the card marks change.
  function refresh(state) {
    const item = r.index.get(state.detail), g = item.gallery, kept = chosen(item.id);
    window.Pattove.systemUI.updateInspector(state);
    if (!g) return;
    document.querySelectorAll('.variant-card').forEach(node => {
      const v = g.list.find(x => x.id === node.dataset.variantCard), current = v.id === state.options[g.key];
      node.toggleAttribute('data-current', current);
      node.querySelector('.variant-pick').setAttribute('aria-pressed', String(current));
      const use = node.querySelector('.variant-use');
      if ((use.getAttribute('aria-pressed') === 'true') !== (v.id === kept)) use.outerHTML = useButton(v, v.id === kept);
    });
  }
  function page(state) {
    const item = r.index.get(state.detail);
    const options = r.normalizeOptions(item.id, state.options);
    const peers = window.Pattove.libraryUI.peers(item.id), index = peers.indexOf(item);
    const adjacent = [[peers[index-1],'이전','prev'],[peers[index+1],'다음','next']].filter(([i])=>i).map(([i,label,rel])=>`<a href="${url(i.id)}" rel="${rel}" aria-label="${label}: ${i.name}">${label} · ${e(i.name)} ${p.icon('arrow')}</a>`).join('');
    const variants = examples(item);
    const selects = item.controls.filter(c => c.key !== item.gallery?.key);
    const sections = [['preview','미리보기'],...(item.gallery?[['variants',item.gallery.label]]:[]),...(variants.length?[['examples','예시']]:[]),...(item.deps.length?[['dependencies','함께 쓰는 부품']]:[])];
    return `<article class="component-page" data-component="${item.id}" aria-labelledby="detail-title"><header class="component-heading"><h2 id="detail-title" tabindex="-1">${e(item.name)}</h2><p>${e(item.purpose)}</p></header><div class="component-layout"><div class="system-inspector component-content"><section id="component-preview" aria-label="미리보기"><div class="part-demo" data-wide="${wide(item.id)}">${live(item.id,options,state.style,'component-live')}<p class="ds-demo-note" role="status"></p></div>${selects.length?`<div class="inspector-options">${selects.map(c=>`<label>${e(c.label)}<select data-part-option="${c.key}" data-focus="option-${c.key}">${c.values.map(([value,label])=>`<option value="${value}"${options[c.key]===value?' selected':''}>${e(label)}</option>`).join('')}</select></label>`).join('')}</div>`:''}</section>${item.gallery?gallery(item,options,state.style):''}${variants.length?`<section id="component-examples" class="component-section"><h3>예시</h3><div class="component-examples">${variants.map(([label,provided],i)=>`<section class="component-example"><h4>${e(label)}</h4>${live(item.id,provided,'main','variant-'+i)}</section>`).join('')}</div></section>`:''}${item.deps.length?`<section id="component-dependencies" class="component-section"><h3>함께 쓰는 부품</h3><div class="part-dependencies">${item.deps.map(id=>`<a href="${url(id)}">${e(r.index.get(id).name)} ${p.icon('arrow')}</a>`).join('')}</div></section>`:''}<footer class="component-pagination">${adjacent}</footer></div><nav class="component-toc" aria-label="이 페이지에서">${sections.map(([id,label])=>`<a href="${url(item.id,{section:id})}" data-doc-section="${id}">${label}</a>`).join('')}</nav></div></article>`;
  }
  window.Pattove.componentDocs = { page, url, live, refresh, chosen, choose, defaults };
})();
