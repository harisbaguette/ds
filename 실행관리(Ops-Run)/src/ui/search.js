(() => {
  const { systemRegistry: registry, references, componentDocs, views, library } = window.Pattove;
  const e = views.escape;
  const short = value => value.replace(/\s*\([^)]*\)\s*$/, '');
  const name = item => item.id === 'clear-input' ? '지우기 버튼' : item.name;
  const key = item => item.id+(item.value?'::'+item.value:'');
  const recentKey = 'pattove-recent-copies';
  let recentMemory;
  function recentRecords() {
    if (!recentMemory) {
      try { const saved=JSON.parse(localStorage.getItem(recentKey)||'[]'); recentMemory=Array.isArray(saved)?saved:[]; } catch { recentMemory=[]; }
    }
    return recentMemory.filter(record=>record && typeof record.id==='string' && references.resolve(record.id)
      && (!record.value || /^var\(--p-[\w-]+\)$|^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(record.value))).slice(0,8);
  }
  function remember(id, state={}, value) {
    const ref=references.resolve(id); if(!ref)return;
    if(ref.type==='implementation' && !ref.shape && ref.item.gallery) {
      const options=registry.normalizeOptions(ref.item.id,state.detail===ref.item.id?state.options:componentDocs.defaults(ref.item.id));
      id=references.shapeID(ref.item,options[ref.item.gallery.key]);
    }
    const style=state.preview||state.style||'main';
    const copyTarget=ref.type==='motion'?(state.copyTarget||window.Pattove.motionUI.environment()):undefined;
    const options=ref.type==='implementation'&&!ref.item.gallery?registry.normalizeOptions(ref.item.id,state.page==='system'&&state.detail===ref.item.id?state.options:{}):undefined;
    const colorRole=id==='token-color'?(state.colorRole||recentRecords().find(x=>x.id===id&&x.value===value)?.colorRole):undefined;
    recentMemory=[{id,style,copyTarget,options,colorRole,...(value?{value}: {})},...recentRecords().filter(x=>x.id!==id||x.value!==value)].slice(0,8);
    try {localStorage.setItem(recentKey,JSON.stringify(recentMemory));} catch {}
  }
  function recent() {
    return recentRecords().map(record=>({...references.resolve(record.id).item,id:record.id,recent:true,copyStyle:window.Pattove.catalog.styles.some(s=>s.id===record.style)?record.style:'main',copyTarget:['html','react','next'].includes(record.copyTarget)?record.copyTarget:undefined,value:record.value,copyOptions:record.options&&typeof record.options==='object'?record.options:undefined,colorRole:typeof record.colorRole==='string'?record.colorRole:undefined}));
  }
  function clearRecent() {recentMemory=[];try {localStorage.removeItem(recentKey);} catch {}}
  function all(query) {
    const words=query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    const styles=window.Pattove.catalog.styles.filter(item=>item.id!=='base'&&words.every(word=>`${item.id} ${item.name} ${views.styleName(item.id)}`.toLocaleLowerCase().includes(word))).map(item=>({...item,id:'style/'+item.id}));
    return [...styles,...window.Pattove.libraryUI.searchAll(query,Infinity),...window.Pattove.motionUI.matching(query).map(item=>({...item,id:'motion/'+item.id,shelf:'motion'}))];
  }
  function describe(item, state) {
    if (item.value) return {id:item.id,subtitle:item.value.startsWith('#')?'HEX 색상':'CSS 변수',value:item.value};
    if (item.id.startsWith('motion/')) return { id:item.id, subtitle:'모션 · '+({html:'HTML',react:'React',next:'Next.js'})[item.copyTarget||window.Pattove.motionUI.environment()], motion:true };
    if (state.page === 'patterns' && window.Pattove.catalog.patterns.includes(item)) return { subtitle:item.english,pattern:true };
    const ref = references.resolve(item.id);
    if(ref?.type==='style'||ref?.type==='pattern')return {id:item.id,style:ref.type==='style',subtitle:ref.type==='style'?'스타일 · AI용 정보':'패턴 · AI용 정보'};
    if (ref?.type === 'implementation') {
      const built = ref.item, options = registry.normalizeOptions(built.id, ref.shape?{[built.gallery.key]:ref.shape.id}:item.copyOptions||componentDocs.defaults(built.id));
      const shape = built.gallery?.list.find(v => v.id === options[built.gallery.key]);
      return { id:shape ? references.shapeID(built, shape.id) : built.id, built, options,
        subtitle:shape ? short(shape.name) + ' · AI용 정보' : 'AI용 정보' };
    }
    return { id:item.art ? item.id : null, subtitle:item.art ? '일러스트 · AI용 정보' : item.term || '참고 설명', reference:!item.art };
  }
  function thumbnail(item, info, state) {
    if(info.style)return `<span class="search-style-mark ds theme-${e(item.id.slice(6))}"><i></i><i></i><i></i></span>`;
    if(info.value?.startsWith('#'))return `<span class="recent-color" style="background:${e(info.value)}"></span>`;
    if (info.built) return `<span class="search-sample" data-kind="${e(info.built.id)}">${componentDocs.live(info.built.id, info.options, views.previewStyle(state), 'search-' + item.id, info.built.gallery?.sample)}</span>`;
    if (item.art) return `<img src="${e(item.art.thumb || item.art.src)}" alt="" loading="lazy">`;
    if (info.motion) return '<span class="search-motion-mark"><i></i><i></i><i></i></span>';
    return window.Pattove.uiIcon('file');
  }
  function row(item, info, state, option) {
    const label=item.value?(item.value.startsWith('#')?item.value:item.value.slice(4,-1)):name(item), style=window.Pattove.catalog.styles.some(s=>s.id===item.copyStyle)?item.copyStyle:views.previewStyle(state);
    const copy=info.value?`<div class="element-reference reference-compact"><button type="button" class="token-copy" data-recent-value="${e(info.value)}" data-recent-id="${e(item.id)}" aria-label="${e(label)} ${e(info.subtitle)} 복사">${window.Pattove.uiIcon('copy','token-copy-icon')}${window.Pattove.uiIcon('check','token-check-icon')}</button><span class="sr-only" role="status"></span></div>`:info.id?references.control(info.id,true).replace('data-copy-reference=',`data-copy-style="${e(style)}"${item.copyTarget?` data-copy-target="${item.copyTarget}"`:''}${info.options?` data-copy-options="${e(JSON.stringify(info.options))}"`:''} data-copy-reference=`):'';
    return `<li class="search-result" role="none"><span class="search-thumb" inert aria-hidden="true">${thumbnail(item, info, {...state,preview:style})}</span><button type="button" class="search-suggestion" id="${option}" role="option" aria-selected="false" data-suggest-open="${e(key(item))}" data-focus="suggestion-${e(key(item))}" aria-label="${e(label)} 상세 보기" data-copy-style="${e(style)}"><span class="search-result-label"><strong>${e(label)}</strong><small>${e(info.subtitle)}</small></span></button>${copy}</li>`;
  }
  function render(items, state, expanded={}) {
    if (!items.length) return '<div role="listbox" id="search-listbox" aria-label="검색 결과"></div><p class="search-no-match">일치하는 항목이 없어요.</p>';
    // The listbox owns only the result buttons (aria-owns); copy buttons, group titles and 더 보기 stay outside it.
    const options = [];
    const groups = new Map();
    for (const item of items) {
      const info = describe(item, state);
      const label = item.recent?'최근 복사': info.reference ? '참고 설명' : info.motion ? '모션' : info.style ? '스타일' : info.pattern ? '패턴'
        : library.shelves.find(s => s.id === (item.shelf || (info.built && window.Pattove.libraryUI.itemShelf(info.built))))?.name || '구성요소';
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push({item, info});
    }
    const html = [...groups].map(([label, results]) => {
      const heading = `<span>${e(label)}</span><span class="search-result-count">${results.length}</span>`;
      const limit=expanded[label]||8;
      const rows = `<ul role="none">${results.slice(0, limit).map(({item,info}) => { const id = 'search-option-' + options.length; options.push(id); return row(item,info,state,id); }).join('')}</ul>${results.length > limit ? `<button type="button" class="search-more" data-search-more="${e(label)}">${e(label)} 더 보기 · ${results.length-limit}개</button>` : ''}`;
      return label === '참고 설명' ? `<details class="search-reference-group"${groups.size===1?' open':''}><summary>${heading}${window.Pattove.uiIcon('chevron-down')}</summary>${rows}</details>`
        : `<section class="search-result-group" role="group" aria-label="${e(label)}"><h2>${heading}</h2>${rows}</section>`;
    }).join('');
    return `<div role="listbox" id="search-listbox" aria-label="검색 결과" aria-owns="${options.join(' ')}"></div>` + html;
  }
  function context(item,state) {
    const ref=references.resolve(item.id), info=describe(item,state);
    return {...state,preview:item.copyStyle||state.preview,copyTarget:item.copyTarget,...(ref?.type==='implementation'?{page:'system',detail:ref.item.id,options:info.options||registry.normalizeOptions(ref.item.id,{})}:{})};
  }
  window.Pattove.searchUI = { render, all, recent, remember, clearRecent, key, context };
})();
