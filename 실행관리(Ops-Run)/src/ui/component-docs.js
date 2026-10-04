(() => {
  const { parts: p, systemRegistry: r } = window.Pattove;
  const e = p.esc;
  // References carry the exact part, shape and source to the project where it will be used.
  const url = (id, extras = {}) => '#/system?' + new URLSearchParams({ detail:id, ...extras });
  // The explicit default action changes the specimen shown on future visits.
  const choiceKey = 'pattove-part-choice';
  const memory = {};
  const stored = () => { try { return JSON.parse(localStorage.getItem(choiceKey) || '{}') || {}; } catch { return {}; } };
  function chosen(id) {
    const gallery = r.index.get(id)?.gallery, value = memory[id] ?? stored()[id];
    return gallery?.list.some(v => v.id === value) ? value : null;
  }
  function choose(id, value) {
    memory[id] = value;
    try {
      const next = { ...stored(), [id]: value };
      if (value == null) delete next[id];
      localStorage.setItem(choiceKey, JSON.stringify(next));return true;
    } catch {return false;}
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
    if (['input','tabs','card','bottom-nav'].includes(id)) part=`<div class="variant-scene" data-preview-scene data-preview-fit="both" data-frame="${frame}">${frame==='phone-bottom'?screen:''}${part}</div>`;
    return frame ? `<div class="ds theme-${style} variant-frame" data-style="${style}" data-frame="${frame}">${part}</div>` : `<div class="ds theme-${style}" data-style="${style}">${part}</div>`;
  }
  const shortName = v => v.name.replace(/\s*\([^)]*\)\s*$/, '');
  const defaultShape = item => chosen(item.id) || r.normalizeOptions(item.id, {})[item.gallery.key];
  let galleryView='compare';
  try {if(localStorage.getItem('pattove-gallery-view')==='large')galleryView='large';} catch {}
  const galleryControls=item=>['button','icon-button'].includes(item.id)?'':`<div class="gallery-tools"><span>${item.gallery.list.length}가지 모양</span><div role="group" aria-label="견본 크기"><button type="button" data-gallery-view="compare" aria-pressed="${galleryView==='compare'}">한눈에</button><button type="button" data-gallery-view="large" aria-pressed="${galleryView==='large'}">크게</button></div></div>`;
  // Copy, enlarge, and save a default are separate, explicit actions.
  function card(item, v, current, style) {
    current=defaultShape(item);
    const label = ['button','icon-button'].includes(item.id) ? ({primary:'채움',outline:'윤곽선',ghost:'텍스트'})[v.id] : shortName(v);
    return `<li class="variant-card" data-variant-card="${v.id}"${v.id === current ? ' data-current' : ''}>${live(item.id, { [item.gallery.key]: v.id }, style, undefined, item.gallery.sample).replace('<div ', '<div inert aria-hidden="true" ')}<button type="button" class="variant-enlarge" data-variant-preview="${v.id}" data-focus="enlarge-${v.id}" aria-label="${e(shortName(v))} 크게 보기"><span aria-hidden="true">↗</span></button><span class="variant-name">${e(label)}</span><div class="variant-pick"><div class="variant-pick-name"><strong>${e(shortName(v))}</strong></div><button type="button" class="variant-pick-button ds-button" data-variant="${v.id === current ? 'ghost' : 'outline'}" data-size="sm" data-focus="variant-${v.id}" data-variant-pick="${v.id}" aria-label="${e(shortName(v))} ${pickName(v.id === current)}" aria-pressed="${v.id === current}">${pickLabel(v.id === current)}</button></div>${window.Pattove.references.control(window.Pattove.references.shapeID(item, v.id), true)}</li>`;
  }
  const pickName = current => current ? '기본 모양' : '기본 모양으로 지정';
  const pickLabel = current => `<span class="variant-status">${current?'<span class="variant-kept" aria-hidden="true">'+p.icon('check')+'</span>':''}${current?'기본 모양':'기본으로 지정'}</span>`;
  // Keeps focus on the pressed card: only the marks change.
  // undoable: the notice offers 되돌리기 for the save just made. undone: the notice confirms the undo.
  function refresh(state, persisted=true, undoable=false, undone=false) {
    const item = r.index.get(state.detail), g = item?.gallery;
    if (!g) return;
    document.querySelectorAll('.variant-card[data-variant-card]').forEach(node => {
      const v = g.list.find(x => x.id === node.dataset.variantCard), current = v.id === defaultShape(item), pick = node.querySelector('[data-variant-pick]');
      if (pick.getAttribute('aria-pressed') === String(current)) return;
      node.toggleAttribute('data-current', current);
      pick.setAttribute('aria-pressed', String(current));
      // An unpicked shape shows a real button; the kept one reads as a quiet status.
      pick.dataset.variant = current ? 'ghost' : 'outline';
      pick.setAttribute('aria-label',`${shortName(v)} ${pickName(current)}`);
      pick.innerHTML = pickLabel(current);
    });
    const name = shortName(g.list.find(v=>v.id===defaultShape(item)));
    const feedback = document.querySelector('.gallery-feedback');
    feedback.querySelector('[role="status"]').textContent = name + (undone ? ' · 기본 모양을 되돌렸어요.' : persisted ? ' · 목록 견본으로 지정했어요.' : ' · 이번 방문 동안만 적용돼요.');
    feedback.querySelector('[data-variant-undo]')?.remove();
    if (undoable) feedback.insertAdjacentHTML('beforeend', '<button type="button" class="ds-button" data-variant="ghost" data-size="sm" data-variant-undo data-focus="variant-undo">되돌리기</button>');
  }
  // Sizes and states of the button, drawn with the shape kept as default. Pictures only: nothing here is pressed.
  function buttonStates(item, style) {
    const variant = defaultShape(item);
    const specimens = [['sm','작게'],['md','보통'],['lg','크게']].map(([size, name]) => [name, p.button({ label:'저장', variant, size })])
      .concat([['비활성', p.button({ label:'저장', variant, state:'disabled' })], ['로딩 중', p.button({ label:'저장', variant, state:'loading' })]]);
    return `<ul class="variant-grid variant-states" role="list" aria-label="크기와 상태">${specimens.map(([name, html]) => `<li class="variant-card"><div class="ds theme-${style}" data-style="${style}" inert aria-hidden="true">${html}</div><span class="variant-name">${e(name)}</span><div class="variant-pick"><div class="variant-pick-name"><strong>${e(name)}</strong></div></div></li>`).join('')}</ul>`;
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
    const inner = sampleText[kind] || (/underline/.test(role) ? '가나 Aa' : '') || (kind === 'motion' ? '<i></i>' : '');
    return kind === 'layer' ? '' : `<span class="token-swatch" data-kind="${kind}"${detail} style="--token-value:var(${role})${kind === 'typography' && /font$/.test(role) ? `;font-family:var(${role})` : ''}">${inner}</span>`;
  }
  function tokenTable(item, style) {
    const kind = item.id.slice('token-'.length), roles = tokenRoles(kind);
    if (!roles) return live(item.id, {}, style, 'component-live');
    if (kind === 'color') return window.Pattove.colorTokens.render(roles,style);
    return `<div class="ds theme-${style}" data-style="${style}"><table class="token-table" role="table" aria-label="${e(item.name)}"><thead role="rowgroup"><tr role="row"><th role="columnheader" scope="col">역할</th><th role="columnheader" scope="col">값</th><th role="columnheader" scope="col">견본</th><th role="columnheader" scope="col"><span class="sr-only">CSS 변수 복사</span></th></tr></thead><tbody role="rowgroup">${roles.map(role => `<tr role="row"><th role="rowheader" scope="row"><code>${role}</code></th><td role="cell"><code data-token-value="${role}"></code></td><td role="cell">${tokenSwatch(kind, role)}</td><td role="cell" class="token-copy-cell"><button type="button" class="token-copy" data-token-copy="${role}" aria-label="${role} CSS 변수 복사">${window.Pattove.uiIcon('copy','token-copy-icon')}${window.Pattove.uiIcon('check','token-check-icon')}</button><span class="sr-only" role="status"></span></td></tr>`).join('')}</tbody></table></div>`;
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
      ? `${galleryControls(item)}<p class="gallery-feedback"><span role="status"></span></p><ul class="variant-grid" id="component-variants" role="list" aria-label="표현 방식">${g.list.map(v => card(item, v, options[g.key], style)).join('')}</ul>${item.id === 'button' ? buttonStates(item, style) : ''}`
      : `<div class="part-demo" id="component-preview"${token ? ' data-token="true"' : item.browse.fit ? ' data-wide="true"' : ''}>${token ? tokenTable(item, style) : live(item.id, options, style, 'component-live', sample)}<p class="ds-demo-note" role="status"></p></div>`;
    const compact = item.id === 'button', color = item.id === 'token-color', folded = !!g || token;
    const reference = window.Pattove.references.control(item.id);
    const primaryCopy = window.Pattove.references.control(item.id,true);
    const back = `<a class="mobile-detail-back" href="#/dictionary?shelf=${item.browse.shelf}" data-action="back-to-list" data-focus="mobile-back" aria-label="${history.state?.pattoveSearchDetail ? '이전 화면으로 돌아가기' : '목록으로 돌아가기'}">${p.icon('chevron-left')}</a>`;
    return `<article class="component-page" data-component="${item.id}" data-shelf="${item.browse.shelf}"${g?' data-gallery data-gallery-view="'+galleryView+'"':''} aria-labelledby="detail-title"><header class="component-heading">${back}<h2 id="detail-title" tabindex="-1">${color ? '색 토큰' : e(item.name)}${alias && !token ? ` <span class="component-alias">${compact ? e(alias) : `(${e(alias)})`}</span>` : ''}</h2>${folded ? '' : primaryCopy}</header>${body}${folded ? `<details class="component-reference"><summary>${token ? '전체 정보' : '요소 정보'}</summary>${reference}</details>` : ''}</article>`;
  }
  let preview=null, opener=null;
  function drawPreview(step=0) {
    const item=r.index.get(preview.id), list=item.gallery.list;
    preview.index=(preview.index+step+list.length)%list.length;
    const v=list[preview.index], dialog=document.getElementById('variant-dialog'), focused=document.activeElement?.dataset.previewStep;
    dialog.innerHTML=`<div class="variant-dialog-head"><div><p>${e(item.name)} · ${preview.index+1} / ${list.length}</p><h2 id="variant-preview-title">${e(shortName(v))}</h2></div><button type="button" data-preview-close aria-label="크게 보기 닫기">${p.icon('close')}</button></div><div class="variant-dialog-stage">${live(item.id,{[item.gallery.key]:v.id},preview.style,'enlarged-preview',item.gallery.sample)}</div><div class="variant-dialog-footer"><div><button type="button" data-preview-step="-1" aria-label="이전 모양"${preview.index===0?' disabled':''}>${p.icon('chevron-left')}</button><button type="button" data-preview-step="1" aria-label="다음 모양"${preview.index===list.length-1?' disabled':''}>${p.icon('chevron')}</button></div>${window.Pattove.references.control(window.Pattove.references.shapeID(item,v.id),true)}</div>`;
    if(!dialog.open)dialog.showModal();
    window.Pattove.systemUI.hydrate(document);
    const next=focused&&dialog.querySelector(`[data-preview-step="${focused}"]`);
    (next&&!next.disabled?next:focused?dialog.querySelector(`[data-preview-step="${-Number(focused)}"]`):dialog.querySelector('[data-preview-close]')).focus({preventScroll:true});
  }
  function openPreview(value,state) {
    const item=r.index.get(state.detail), index=item.gallery.list.findIndex(v=>v.id===value);if(index<0)return;
    opener=document.activeElement;preview={id:item.id,index,style:window.Pattove.views.previewStyle(state)};drawPreview();
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-token-copy]');
    if(button)window.Pattove.references.copyValue(`var(${button.dataset.tokenCopy})`,button);
    const size=event.target.closest('button[data-gallery-view]');
    if(size) {
      galleryView=size.dataset.galleryView;try {localStorage.setItem('pattove-gallery-view',galleryView);} catch {}
      size.closest('.component-page').dataset.galleryView=galleryView;
      document.querySelectorAll('button[data-gallery-view]').forEach(n=>n.setAttribute('aria-pressed',String(n===size)));
      window.Pattove.systemUI.hydrate(document);
    }
    if(event.target.closest('[data-preview-close]'))document.getElementById('variant-dialog').close();
    const step=event.target.closest('[data-preview-step]');if(step&&!step.disabled)drawPreview(Number(step.dataset.previewStep));
  });
  const previewDialog=document.getElementById('variant-dialog');
  previewDialog.addEventListener('click',event=>{if(event.target!==previewDialog)return;const box=previewDialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)previewDialog.close();});
  previewDialog.addEventListener('close',()=>{if(previewDialog.open)return;if(opener?.isConnected)opener.focus({preventScroll:true});preview=null;opener=null;previewDialog.replaceChildren();});
  // A specimen's own form submits in place; it never reloads the page or closes the window.
  previewDialog.addEventListener('submit',event=>{if(event.target.closest('.variant-dialog-stage'))event.preventDefault();});
  previewDialog.addEventListener('keydown',event=>{if(event.target.closest('.variant-dialog-head button,.variant-dialog-footer button')&&!document.getElementById('reference-dialog').open&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();const direction=event.key==='ArrowLeft'?-1:1;const next=previewDialog.querySelector(`[data-preview-step="${direction}"]`);if(!next.disabled)drawPreview(direction);}});
  window.Pattove.componentDocs = { page, url, live, refresh, chosen, choose, defaults, openPreview };
})();
