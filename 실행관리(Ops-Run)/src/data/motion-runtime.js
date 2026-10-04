/* Self-contained runtime, also exported with HTML and React examples. */
window.Pattove.mountMotion = function mountMotion(root, behavior) {
  const doc = root.ownerDocument, win = doc.defaultView;
  const scheduler = globalThis;
  const media = win.matchMedia('(prefers-reduced-motion: reduce)');
  const cleanups = [], animations = new Set(), jobs = new Set(), timers = new Set();
  const one = selector => root.querySelector(selector);
  const all = selector => [...root.querySelectorAll(selector)];
  let disposed = false, visible = true, paused = false, reduced = false, raf = 0, last = 0;
  function on(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    cleanups.push(() => node.removeEventListener(event, handler, options));
  }
  function later(fn, delay) {
    const timer = scheduler.setTimeout(() => { timers.delete(timer); if (!disposed) fn(); }, delay);
    timers.add(timer); return timer;
  }
  function frame(time) {
    raf = 0;
    const delta = last ? Math.min(time - last, 80) : 0; last = time;
    for (const job of [...jobs]) {
      if (reduced) job.elapsed = job.duration;
      else if (!paused) job.elapsed += delta;
      job.update(Math.min(1, job.elapsed / job.duration));
      if (job.elapsed >= job.duration) { jobs.delete(job); job.done?.(); }
    }
    if (jobs.size && !paused) raf = scheduler.requestAnimationFrame(frame);
  }
  function run(duration, update, done) {
    if (reduced) { update(1); done?.(); return; }
    jobs.add({duration, update, done, elapsed:0});
    if (!raf && !paused) { last = 0; raf = scheduler.requestAnimationFrame(frame); }
  }
  function animate(node, keyframes, options = {}) {
    if (reduced || paused || !node.animate) return Promise.resolve();
    const role = options.role || 'enter';
    const value = win.getComputedStyle(root).getPropertyValue('--pm-' + role).trim();
    const duration = value ? parseFloat(value) * (value.endsWith('ms') ? 1 : 1000) : 240;
    const {role:ignored, ...timing} = options;
    const animation = node.animate(keyframes, {duration, easing:'cubic-bezier(.2,0,.38,.9)', ...timing});
    animations.add(animation);
    return animation.finished.catch(() => {}).finally(() => { animations.delete(animation); animation.cancel(); });
  }
  function sync() {
    if (disposed) return;
    reduced = media.matches || doc.documentElement.hasAttribute('data-reduced');
    paused = doc.hidden || !visible || doc.documentElement.hasAttribute('data-paused') || !!one('.pm-pause')?.checked;
    root.toggleAttribute('data-motion-still', reduced);
    root.toggleAttribute('data-motion-paused', paused);
    for (const animation of animations) {
      if (reduced) { try { animation.finish(); } catch { animation.cancel(); } }
      else if (paused) animation.pause();
      else if (animation.playState === 'paused') animation.play();
    }
    if (reduced) {
      for (const job of [...jobs]) { jobs.delete(job); job.update(1); job.done?.(); }
    }
    if (jobs.size && !paused && !raf) { last = 0; raf = scheduler.requestAnimationFrame(frame); }
    if (reduced || paused) resetPointer();
  }
  function announce(text) { const status = one('[data-status]'); if (status) status.textContent = text; }
  function resetPointer() {
    const card = one('[data-pointer-card]');
    if (card) { card.style.removeProperty('transform'); card.style.removeProperty('--spot-x'); card.style.removeProperty('--spot-y'); }
  }
  on(media, 'change', sync);
  on(doc, 'visibilitychange', sync);
  if (one('.pm-pause')) on(one('.pm-pause'), 'change', sync);
  const attributes = new win.MutationObserver(sync);
  attributes.observe(doc.documentElement, {attributes:true, attributeFilter:['data-paused','data-reduced']});
  cleanups.push(() => attributes.disconnect());
  if (win.IntersectionObserver) {
    const observer = new win.IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
    observer.observe(root); cleanups.push(() => observer.disconnect());
  }
  sync();

  if (behavior === 'accordion') {
    const button = one('[data-toggle]'), panel = one('[data-panel]');
    let current;
    on(button, 'click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      const height = panel.getBoundingClientRect().height;
      current?.cancel();
      button.setAttribute('aria-expanded', String(open));
      panel.hidden = false; panel.inert = !open;
      if (!open && panel.contains(doc.activeElement)) button.focus();
      if (reduced || paused || !panel.animate) { panel.hidden = !open; return; }
      const target = open ? panel.scrollHeight : 0;
      current = panel.animate([{height:height+'px',opacity:open ? 0.5 : 1},{height:target+'px',opacity:open ? 1 : 0}], {duration:240,easing:'ease-out'});
      animations.add(current);
      const animation = current;
      animation.finished.then(() => { if (current === animation) panel.hidden = !open; }).catch(() => {}).finally(() => animations.delete(animation));
    });
  }

  if (behavior === 'modal' || behavior === 'shared-card') {
    const opener = one('[data-open]'), dialog = one('dialog'), closer = one('[data-close]');
    let revision = 0;
    const fadeIn = [{opacity:0,transform:'translateY(12px) scale(.97)'},{opacity:1,transform:'none'}];
    const sharedFrames = () => {
      const from = opener.getBoundingClientRect(), to = dialog.getBoundingClientRect();
      return [{opacity:0.35,transform:`translate(${from.x + from.width/2 - to.x - to.width/2}px,${from.y + from.height/2 - to.y - to.height/2}px) scale(${from.width/to.width},${from.height/to.height})`},{opacity:1,transform:'none'}];
    };
    on(opener, 'click', () => {
      if (dialog.open) return;
      revision++;
      dialog.showModal(); closer.focus();
      animate(dialog, behavior === 'shared-card' ? sharedFrames() : fadeIn, {role:'layout'});
    });
    const close = () => {
      const ticket = ++revision;
      // Keep the modal's focus scope until its exit finishes.
      animate(dialog, [...(behavior === 'shared-card' ? sharedFrames() : fadeIn)].reverse(), {role:'exit'}).then(() => {
        if (disposed || ticket !== revision) return;
        dialog.close();
        later(() => { if (!dialog.open) opener.focus({preventScroll:true}); }, 0);
      });
    };
    on(closer, 'click', close);
    on(dialog, 'close', () => later(() => opener.focus({preventScroll:true}), 0));
    on(dialog, 'cancel', event => { event.preventDefault(); close(); });
    on(dialog, 'keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; }
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll('button,a[href],input,select,textarea,[tabindex]')].filter(node => !node.disabled && node.tabIndex >= 0 && node.getClientRects().length);
      const first = controls[0], last = controls[controls.length - 1];
      if (!first) { event.preventDefault(); dialog.focus(); }
      else if (event.shiftKey && doc.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && doc.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    on(dialog, 'click', event => { if (event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close(); } });
    cleanups.push(() => { revision++; if (dialog.open) dialog.close(); });
  }

  function positions(nodes) { return new Map(nodes.map(node => [node,node.getBoundingClientRect()])); }
  function reflow(before, nodes) {
    for (const node of nodes) {
      const previous=before.get(node), next=node.getBoundingClientRect();
      if (previous) animate(node,[{transform:`translate(${previous.x-next.x}px,${previous.y-next.y}px)`},{transform:'none'}],{role:'layout'});
    }
  }
  if (behavior === 'toast' || behavior === 'list-change') {
    const list=one('[data-list]'), add=one('[data-add]');
    let serial=all('[data-row]').length;
    on(add,'click',()=>{
      const rows=all('[data-row]');
      if(rows.length>=4){announce('최대 네 개까지 볼 수 있습니다.');return;}
      const before=positions(rows), row=doc.createElement('li'), label=doc.createElement('span'), remove=doc.createElement('button');
      row.dataset.row=String(++serial); row.className='pm-row';
      label.textContent=behavior==='toast' ? `저장 완료 ${serial}` : `새 항목 ${serial}`;
      remove.type='button';remove.dataset.remove='';remove.textContent='닫기';remove.setAttribute('aria-label',label.textContent+' 삭제');
      row.append(label,remove);list.append(row);
      reflow(before,rows);animate(row,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}]);
      announce(label.textContent);
    });
    on(list,'click',event=>{
      const button=event.target.closest('[data-remove]');if(!button)return;
      const row=button.closest('[data-row]');if(row.dataset.removing)return;
      // Safari does not focus a button on pointer activation. Move focus
      // explicitly before removing the control that performed this action.
      add.focus({preventScroll:true});
      row.dataset.removing='true';row.inert=true;
      animate(row,[{opacity:1,transform:'none'},{opacity:0,transform:'translateX(16px)'}],{role:'exit'}).then(()=>{
        if(disposed)return;
        const before=positions(all('[data-row]'));row.remove();reflow(before,all('[data-row]'));announce('항목을 삭제했습니다.');
      });
    });
  }

  if (behavior === 'tabs') {
    const tabs=all('[role="tab"]'), line=one('[data-indicator]');
    function select(tab, focus=false) {
      const old=line.getBoundingClientRect();
      for(const t of tabs){const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;doc.getElementById(t.getAttribute('aria-controls')).hidden=!active;}
      line.style.width=tab.offsetWidth+'px';line.style.left=tab.offsetLeft+'px';
      const next=line.getBoundingClientRect();
      if(old.width)animate(line,[{transform:`translateX(${old.x-next.x}px) scaleX(${old.width/next.width})`},{transform:'none'}]);
      if(focus)tab.focus();
    }
    for(const tab of tabs)on(tab,'click',()=>select(tab));
    on(one('[role="tablist"]'),'keydown',event=>{
      let i=tabs.indexOf(doc.activeElement);if(i<0)return;
      const direction=win.getComputedStyle(root).direction==='rtl'?-1:1;
      if(event.key==='ArrowRight')i+=direction;else if(event.key==='ArrowLeft')i-=direction;else if(event.key==='Home')i=0;else if(event.key==='End')i=tabs.length-1;else return;
      event.preventDefault();select(tabs[(i+tabs.length)%tabs.length],true);
    });
    const resize=new win.ResizeObserver(()=>select(tabs.find(t=>t.getAttribute('aria-selected')==='true')));
    resize.observe(one('[role="tablist"]'));cleanups.push(()=>resize.disconnect());
    select(tabs.find(t=>t.getAttribute('aria-selected')==='true'));
  }

  if (behavior === 'save-state') {
    const save=one('[data-save]'), outcome=one('[data-outcome]');
    on(save,'click',()=>{
      if(save.getAttribute('aria-busy')==='true')return;
      const fail=outcome.value==='error';
      save.setAttribute('aria-busy','true');save.textContent='저장 중…';save.dataset.state='loading';announce('예제 요청을 처리하고 있습니다.');
      later(()=>{
        save.setAttribute('aria-busy','false');save.dataset.state=fail?'error':'success';save.textContent=fail?'다시 시도':'다시 저장';
        announce(fail?'저장하지 못했습니다. 다시 시도하세요.':'저장했습니다.');
        animate(save,[{transform:'scale(.96)'},{transform:'scale(1.02)'},{transform:'none'}]);
      },800);
    });
  }

  if (behavior === 'checkmark') on(one('[data-complete]'),'click',()=>{
    const path=one('[data-check]');path.style.strokeDashoffset='0';
    animate(path,[{strokeDashoffset:'1'},{strokeDashoffset:'0'}],{role:'reveal'});announce('완료했습니다.');
  });

  if (behavior === 'count-up' || behavior === 'typewriter') {
    const output=one('[data-output]'), final=output.textContent;
    const replay=one('[data-start]'), skip=one('[data-skip]');
    function start() {
      jobs.clear();
      if(behavior==='count-up'){
        const target=Number(output.dataset.value), digits=Number(output.dataset.decimals||0);
        run(1100,p=>{output.textContent=(target*(1-(1-p)**3)).toLocaleString('ko-KR',{minimumFractionDigits:digits,maximumFractionDigits:digits});});
      }else{
        const chars=win.Intl.Segmenter?[...new win.Intl.Segmenter('ko',{granularity:'grapheme'}).segment(final)].map(s=>s.segment):Array.from(final);
        run(1600,p=>{output.textContent=chars.slice(0,Math.ceil(chars.length*p)).join('');});
      }
    }
    on(replay,'click',start);
    if(skip)on(skip,'click',()=>{jobs.clear();output.textContent=final;});
    cleanups.push(()=>{output.textContent=final;});
    start();
  }

  if (behavior === 'sort-list') {
    const list=one('[data-sort-list]');let drag;
    function move(row,index) {
      const nodes=all('[data-sort-row]'), before=positions(nodes), rest=nodes.filter(n=>n!==row);
      list.insertBefore(row,rest[Math.max(0,index)]||null);reflow(before,all('[data-sort-row]'));
      announce(`${row.dataset.name}, ${all('[data-sort-row]').indexOf(row)+1}번째로 이동했습니다.`);
    }
    on(list,'click',event=>{
      const button=event.target.closest('[data-move]');if(!button)return;
      const row=button.closest('[data-sort-row]'), rows=all('[data-sort-row]'), index=rows.indexOf(row)+Number(button.dataset.move);
      if(index>=0&&index<rows.length)move(row,index);
    });
    const end=commit=>{
      if(!drag)return;
      const active=drag;drag=null;active.row.style.transform='';active.row.classList.remove('pm-dragging');
      all('[data-sort-row]').forEach(n=>n.classList.remove('pm-drop-target'));
      if(active.handle.hasPointerCapture(active.pointerId))active.handle.releasePointerCapture(active.pointerId);
      if(commit&&active.moved)move(active.row,active.index);
      else if(!commit)announce('이동을 취소했습니다.');
    };
    on(list,'pointerdown',event=>{
      const handle=event.target.closest('[data-drag-handle]');if(!handle||event.button!==0||drag)return;
      event.preventDefault();
      const row=handle.closest('[data-sort-row]'), rows=all('[data-sort-row]');
      drag={row,handle,pointerId:event.pointerId,y:event.clientY,index:rows.indexOf(row),centers:rows.map(n=>{const r=n.getBoundingClientRect();return r.y+r.height/2;}),moved:false};
      handle.setPointerCapture(event.pointerId);handle.focus();
    });
    on(list,'pointermove',event=>{
      if(!drag||event.pointerId!==drag.pointerId)return;
      const dy=event.clientY-drag.y;if(Math.abs(dy)<5&&!drag.moved)return;
      drag.moved=true;drag.row.classList.add('pm-dragging');drag.row.style.transform=`translateY(${dy}px)`;
      const center=drag.centers[all('[data-sort-row]').indexOf(drag.row)]+dy;
      drag.index=drag.centers.reduce((best,y,i)=>Math.abs(y-center)<Math.abs(drag.centers[best]-center)?i:best,0);
      all('[data-sort-row]').forEach((n,i)=>n.classList.toggle('pm-drop-target',i===drag.index&&n!==drag.row));
    });
    on(list,'pointerup',()=>end(true));on(list,'pointercancel',()=>end(false));on(list,'lostpointercapture',()=>end(false));
    on(list,'keydown',event=>{if(event.key==='Escape'&&drag){event.preventDefault();end(false);}});
    cleanups.push(()=>end(false));
  }

  if (behavior === 'reading-progress' || behavior === 'parallax') {
    const scroller=one('[data-scroller]'), indicator=one('[data-progress]'), layer=one('[data-parallax]');
    const update=()=>{
      const progress=scroller.scrollTop/Math.max(1,scroller.scrollHeight-scroller.clientHeight);
      if(indicator){indicator.style.transform=`scaleX(${progress})`;one('[role="progressbar"]').setAttribute('aria-valuenow',String(Math.round(progress*100)));}
      if(layer)layer.style.transform=reduced||paused?'none':`translateY(${Math.min(28,scroller.scrollTop*.12)}px)`;
    };
    on(scroller,'scroll',update,{passive:true});on(media,'change',update);
    const resize=new win.ResizeObserver(update);resize.observe(scroller);if(scroller.firstElementChild)resize.observe(scroller.firstElementChild);
    const changes=new win.MutationObserver(update);changes.observe(root,{attributes:true,attributeFilter:['data-motion-still','data-motion-paused']});
    cleanups.push(()=>{resize.disconnect();changes.disconnect();});update();
  }

  if (behavior === 'spotlight' || behavior === 'tilt') {
    const card=one('[data-pointer-card]');
    on(card,'pointermove',event=>{
      if(reduced||paused||event.pointerType==='touch')return;
      const rect=card.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width,y=(event.clientY-rect.top)/rect.height;
      if(behavior==='spotlight'){card.style.setProperty('--spot-x',x*100+'%');card.style.setProperty('--spot-y',y*100+'%');}
      else card.style.transform=`perspective(700px) rotateX(${(0.5-y)*10}deg) rotateY(${(x-.5)*10}deg)`;
    });
    on(card,'pointerleave',resetPointer);on(card,'blur',resetPointer);
  }

  return {sync, destroy() {
    disposed=true;
    if(raf)scheduler.cancelAnimationFrame(raf);
    timers.forEach(timer=>scheduler.clearTimeout(timer));jobs.clear();animations.forEach(animation=>animation.cancel());animations.clear();
    cleanups.reverse().forEach(cleanup=>cleanup());resetPointer();
  }};
};
