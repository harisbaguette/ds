(() => {
  const {esc:e}=window.Pattove.parts;
  const groups=[
    ['surface','배경',[['bg','기본 배경'],['surface','보조 배경'],['high','밝은 배경'],['hover','마우스 올림'],['row-active','활성 행'],['disabled','비활성 배경'],['glass','반투명 배경'],['backdrop','화면 덮개'],['tile','카드 배경'],['tile-header','카드 머리글'],['image-well','이미지 배경'],['selected-surface','선택 배경']]],
    ['content','글자',[['ink','기본 글자'],['muted','보조 글자'],['on-accent','강조색 위 글자']]],
    ['action','강조',[['accent','주요 동작'],['accent-hover','주요 동작 · 마우스 올림'],['shade','음영'],['highlight','강조'],['highlight-soft','연한 강조'],['soft','부드러운 강조'],['mark','표시'],['mark-hover','표시 · 마우스 올림'],['mark-alt','보조 표시']]],
    ['status','상태',[['success','성공'],['success-soft','성공 배경'],['success-line','성공 테두리'],['error','오류'],['error-soft','오류 배경'],['error-line','오류 테두리'],['warning','주의'],['warning-soft','주의 배경'],['warning-line','주의 테두리']]],
    ['line','테두리',[['line','기본 선'],['line-subtle','옅은 선'],['control-border','입력 테두리'],['edge','밝은 가장자리'],['edge-soft','연한 가장자리']]],
    ['mixed','혼합',[['accent-shaded','어두운 강조'],['glass-veil','반투명 덮개'],['high-veil','밝은 덮개'],['current-tint','현재 글자색 틴트'],['on-accent-muted','강조색 위 보조 글자'],['accent-wash','강조색 틴트'],['success-wash','성공색 틴트'],['soft-success','부드러운 성공 배경']]]
  ];
  const roles=new Map(groups.flatMap(([group,,items])=>items.map(([key,name])=>['--p-'+key,{group,name}])));
  let mode='variable', filter='all';
  const timers=new WeakMap();
  const modeName=()=>mode==='hex'?'HEX':'CSS 변수';
  const coreBackground=['--p-bg','--p-surface','--p-selected-surface'];
  const coreContent=['--p-ink','--p-muted','--p-accent','--p-success','--p-error'];
  function row(key) {
    const role=roles.get(key)||{name:key,group:'other'};
    return `<li class="color-token-row" data-color-role="${key}" data-color-category="${role.group}" data-color-name="${e(role.name)}"><span class="color-swatch" aria-hidden="true"><i style="background:var(${key})"></i></span><div class="color-token-name"><strong>${e(role.name)}</strong><code>${key}</code></div><code class="color-hex"></code><button type="button" data-color-copy aria-label="${e(role.name)} ${modeName()} 복사">${window.Pattove.uiIcon('copy','color-copy-icon')}${window.Pattove.uiIcon('check','color-check-icon')}</button><span class="sr-only" role="status"></span></li>`;
  }
  const section=(name,names)=>names.length?`<section class="color-token-group"><h3>${name}</h3><ul>${names.map(row).join('')}</ul></section>`:'';
  function render(names,style) {
    const activeGroups=[...groups.map(([id,name])=>({id,name})),{id:'other',name:'기타'}].filter(g=>names.some(key=>(roles.get(key)?.group||'other')===g.id));
    if(filter!=='all'&&!activeGroups.some(g=>g.id===filter))filter='all';
    const other=names.filter(key=>!coreBackground.includes(key)&&!coreContent.includes(key));
    const core=section('배경과 표면',coreBackground.filter(key=>names.includes(key)))+section('글자와 상태',coreContent.filter(key=>names.includes(key)));
    const extra=activeGroups.map(g=>section(g.name,other.filter(key=>(roles.get(key)?.group||'other')===g.id))).join('');
    return `<section class="color-palette ds theme-${e(style)}" data-style="${e(style)}" aria-label="색 토큰"><div class="color-token-toolbar"><div class="color-filters" role="group" aria-label="색 쓰임 필터">${[{id:'all',name:'전체'},...activeGroups].map(g=>`<button type="button" data-color-filter="${g.id}" aria-pressed="${filter===g.id}">${g.name}</button>`).join('')}</div><div class="color-copy-mode" role="group" aria-label="색 복사 형식"><button type="button" data-color-mode="variable" aria-pressed="${mode==='variable'}">CSS 변수</button><button type="button" data-color-mode="hex" aria-pressed="${mode==='hex'}">HEX</button></div></div><div class="color-token-groups">${core}</div><details class="color-extra"${filter!=='all'?' open':''}><summary>세부 색 <span data-color-extra-count>${other.length}개</span></summary>${extra}<p class="color-token-note">혼합색의 HEX는 현재 스타일 기준입니다. 투명도는 마지막 두 자리에 포함됩니다.</p></details></section>`;
  }
  function applyFilter(palette) {
    palette.querySelectorAll('.color-token-row').forEach(row=>row.hidden=filter!=='all'&&row.dataset.colorCategory!==filter);
    palette.querySelectorAll('.color-token-group').forEach(group=>group.hidden=![...group.querySelectorAll('.color-token-row')].some(row=>!row.hidden));
    const extra=palette.querySelector('.color-extra'),count=extra.querySelectorAll('.color-token-row:not([hidden])').length;
    extra.hidden=!count;extra.querySelector('[data-color-extra-count]').textContent=count+'개';
  }
  function hydrate() {
    const palette=document.querySelector('.color-palette');if(!palette)return;
    applyFilter(palette);
    // Resolve through CSS, preserving the unpremultiplied channels of translucent colors.
    const probe=document.createElement('span');probe.hidden=true;palette.append(probe);
    palette.querySelectorAll('.color-token-row').forEach(row=>{
      const resolved=getComputedStyle(row.querySelector('.color-swatch i')).backgroundColor;
      probe.style.color=`rgb(from ${resolved} r g b / alpha)`;
      const value=getComputedStyle(probe).color;
      const channels=value.match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi)?.map(Number);
      if(!channels||channels.length<3)return;
      const rgba=[...channels.slice(0,3).map(n=>Math.round(Math.max(0,Math.min(255,n*(value.startsWith('color(')?255:1))))),Math.round((channels[3]??1)*255)];
      const hex='#'+rgba.slice(0,rgba[3]===255?3:4).map(n=>n.toString(16).padStart(2,'0')).join('').toUpperCase();
      row.dataset.hex=hex;row.querySelector('.color-hex').textContent=hex;
    });
    probe.remove();
  }
  function resetFeedback(button) {
    clearTimeout(timers.get(button));button.removeAttribute('data-copied');
    button.closest('.color-token-row').querySelector('[role="status"]').textContent='';
  }
  function setMode(palette,next) {
    mode=next;
    palette.querySelectorAll('[data-color-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.colorMode===mode)));
    palette.querySelectorAll('[data-color-copy]').forEach(b=>{resetFeedback(b);b.setAttribute('aria-label',b.closest('.color-token-row').dataset.colorName+' '+modeName()+' 복사');});
  }
  function reveal(value,role) {
    const palette=document.querySelector('.color-palette');if(!palette)return;
    const variable=value.startsWith('var('), key=variable?value.slice(4,-1):role;
    const row=(key&&palette.querySelector(`[data-color-role="${CSS.escape(key)}"]`))||[...palette.querySelectorAll('.color-token-row')].find(row=>row.dataset.hex===value.toUpperCase());
    if(!row)return;
    filter='all';
    palette.querySelectorAll('[data-color-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.colorFilter==='all')));
    applyFilter(palette);setMode(palette,variable?'variable':'hex');
    const extra=row.closest('details');if(extra)extra.open=true;
    const button=row.querySelector('[data-color-copy]');button.focus({preventScroll:true});row.scrollIntoView({block:'center'});
  }
  document.addEventListener('click',async event=>{
    const button=event.target.closest('button');if(!button)return;
    const palette=button.closest('.color-palette');if(!palette)return;
    if(button.dataset.colorFilter) {
      filter=button.dataset.colorFilter;
      palette.querySelectorAll('[data-color-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.colorFilter===filter)));
      palette.querySelector('.color-extra').open=filter!=='all';applyFilter(palette);
    }
    if(button.dataset.colorMode) {
      setMode(palette,button.dataset.colorMode);
    }
    if(!button.hasAttribute('data-color-copy')||button.getAttribute('aria-busy')==='true')return;
    const row=button.closest('.color-token-row'), copyMode=mode, text=mode==='hex'?row.dataset.hex:`var(${row.dataset.colorRole})`;
    button.setAttribute('aria-busy','true');
    try {
      await navigator.clipboard.writeText(text);
      if(!button.isConnected||mode!==copyMode)return;
      window.Pattove.searchUI?.remember('token-color',{preview:palette.dataset.style,colorRole:row.dataset.colorRole},text);
      resetFeedback(button);button.setAttribute('data-copied','');
      row.querySelector('[role="status"]').textContent=text+' 복사됨';
      timers.set(button,setTimeout(()=>resetFeedback(button),2000));
    } catch {
      if(!button.isConnected||mode!==copyMode)return;
      const dialog=document.getElementById('reference-dialog'),area=dialog.querySelector('textarea');area.value=text;
      dialog.addEventListener('close',()=>{if(button.isConnected)button.focus({preventScroll:true});},{once:true});
      if(!dialog.open)dialog.showModal();area.focus();area.select();
    } finally {button.removeAttribute('aria-busy');}
  });
  window.Pattove.colorTokens={render,hydrate,reveal};
})();
