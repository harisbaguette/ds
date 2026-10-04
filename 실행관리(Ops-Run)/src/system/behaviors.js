/* Self-contained so the exact same behavior can travel with an exported HTML file. */
window.Pattove.mountParts = function mountParts(root) {
  window.Pattove?.admin?.mount(root);
  root.querySelectorAll('[data-await-script]').forEach(fieldset=>{fieldset.disabled=false;fieldset.removeAttribute('data-await-script');});
  root.querySelectorAll('[data-indeterminate]').forEach(input => {
    if (!input.__pattoveInitialized) { input.indeterminate = true; input.__pattoveInitialized = true; }
  });
  const syncStepper=input=>{
    const box=input.closest('.ds-stepper');if(!box)return;
    for(const button of box.querySelectorAll('[data-step]'))button.disabled=input.disabled||(input.value!==''&&(Number(button.dataset.step)<0?input.min!==''&&input.valueAsNumber<=Number(input.min):input.max!==''&&input.valueAsNumber>=Number(input.max)));
  };
  root.querySelectorAll('.ds-stepper input').forEach(syncStepper);
  const placeLayouts=()=>root.querySelectorAll('[data-layout-append]').forEach(node=>{
    const movable=node.querySelector('[data-layout-movable]');
    const target=node.querySelector(innerWidth<=760?'[data-layout-narrow-slot]':'[data-layout-wide-slot]');
    if(movable&&target&&movable.parentElement!==target){const focus=movable.contains(document.activeElement)?document.activeElement:null;target.append(movable);focus?.focus({preventScroll:true});}
  });
  placeLayouts();
  root.querySelectorAll('[data-priority-navigation]').forEach(nav=>{
    if(nav.__priorityMounted)return;nav.__priorityMounted=true;
    const visible=nav.querySelector('[data-overflow-visible]'),extra=nav.querySelector('[data-overflow-extra]'),menu=nav.querySelector('[data-overflow-menu]'),measure=nav.querySelector('[data-overflow-measure]'),more=nav.querySelector('[data-overflow-measure-more]'),items=[...visible.children];
    let disconnected=false;
    const fit=()=>{
      if(disconnected)return;
      const widths=[...measure.children].map(n=>n.getBoundingClientRect().width),gap=parseFloat(getComputedStyle(measure).columnGap)||0,available=nav.clientWidth,all=widths.reduce((sum,n)=>sum+n,0)+Math.max(0,widths.length-1)*gap;
      let count=items.length;if(all>available){const limit=Math.max(0,available-more.offsetWidth-gap);let used=0;count=0;while(count<widths.length&&used+widths[count]+(count?gap:0)<=limit){used+=widths[count]+(count?gap:0);count++;}}
      const focus=nav.contains(document.activeElement)?document.activeElement:null;
      items.forEach((item,i)=>{const target=i<count?visible:extra;if(item.parentElement!==target)target.append(item);});menu.hidden=count===items.length;
      if(focus?.isConnected){if(extra.contains(focus))menu.open=true;focus.focus({preventScroll:true});}
    };
    const observer=new ResizeObserver(fit);observer.observe(nav);observer.observe(measure);
    const removal=new MutationObserver(()=>{if(!nav.isConnected){disconnected=true;observer.disconnect();removal.disconnect();}});removal.observe(document,{childList:true,subtree:true});fit();document.fonts.ready.then(fit);
  });
  if (root.__pattovePartsMounted) return;
  root.__pattovePartsMounted = true;
  const emit = (node, name, detail) => node.dispatchEvent(new CustomEvent('pattove:' + name, {bubbles:true, detail}));
  window.addEventListener('resize',placeLayouts);
  const updatePicker=picker=>{
    const tabs=[...picker.querySelectorAll('[role="tab"]')],count=Number(picker.dataset.visibleCount),select=picker.querySelector('[data-picker-select]');
    tabs.forEach((tab,i)=>{tab.hidden=i>=count&&tab.getAttribute('aria-selected')!=='true';});
    const active=tabs.find(t=>t.getAttribute('aria-selected')==='true');if(select)select.value=tabs.indexOf(active)>=count?active.dataset.pickerValue:'';
  };
  root.addEventListener('change',e=>{if(e.target.matches('[data-picker-select]')){const picker=e.target.closest('[data-tabs-picker]'),tab=[...picker.querySelectorAll('[role="tab"]')].find(t=>t.dataset.pickerValue===e.target.value);if(tab){tab.hidden=false;selectTab(tab);updatePicker(picker);}}});
  const updateSpy=host=>{
    const nav=host.closest('[data-scrollspy]'),sections=[...host.children];let index=0;
    for(let i=0;i<sections.length;i++)if(sections[i].offsetTop<=host.scrollTop+20)index=i;
    if(host.scrollHeight>host.clientHeight+1&&host.scrollTop>=host.scrollHeight-host.clientHeight-1)index=sections.length-1;
    nav.querySelectorAll('[data-spy-target]').forEach((link,i)=>{if(i===index)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  };
  root.addEventListener('scroll',e=>{
    const host=e.target;
    if(host.matches?.('[data-nav-auto-scroll]')){const before=host.__previousTop||0,top=host.scrollTop,header=host.querySelector('header');if(Math.abs(top-before)>=2){header.dataset.hidden=String(top>48&&top>before&&!header.contains(document.activeElement));host.__previousTop=top;}}
    if(host.matches?.('[data-spy-scroll]'))updateSpy(host);
  },true);
  root.addEventListener('focusin',e=>{const header=e.target.closest('.ds-nav-auto-header');if(header)header.dataset.hidden='false';});
  root.addEventListener('input',e=>{
    if(e.target.matches('[data-restore-search]')){const list=e.target.closest('[data-scroll-restore]').querySelector('[data-restore-scroll]'),query=e.target.value.toLocaleLowerCase();list.querySelectorAll('li').forEach(item=>{item.hidden=!item.textContent.toLocaleLowerCase().includes(query);});list.scrollTop=0;}
  });
  root.addEventListener('click',e=>{
    const drill=e.target.closest('[data-drill-next],[data-drill-back]');
    if(drill){const nav=drill.closest('[data-drill-navigation]'),current=drill.closest('[data-drill-level]'),back=drill.hasAttribute('data-drill-back'),next=document.getElementById(back?drill.dataset.drillBack:drill.dataset.drillNext);if(next&&nav.contains(next)){nav.dataset.direction=back?'back':'next';current.hidden=true;next.hidden=false;const previous=[...next.querySelectorAll('[data-drill-next]')].find(b=>b.dataset.drillNext===current.id);(back?previous||next.querySelector('h2'):next.querySelector('h2'))?.focus();emit(nav,'drillchange',{path:JSON.parse(next.dataset.drillPath)});}return;}
    const pin=e.target.closest('[data-pin-toggle]');if(pin){const nav=pin.closest('[data-pinned-navigation]'),row=pin.closest('li'),next=row.dataset.pinned!=='true';row.dataset.pinned=String(next);pin.setAttribute('aria-pressed',String(next));pin.textContent=next?'고정 해제':'고정';const list=nav.querySelector('ul'),rows=[...list.children].sort((a,b)=>Number(b.dataset.pinned==='true')-Number(a.dataset.pinned==='true')||Number(a.dataset.pinOrder)-Number(b.dataset.pinOrder));list.replaceChildren(...rows);pin.focus();nav.querySelector('[role="status"]').textContent=row.querySelector('a').textContent+(next?'을 고정했어요.':' 고정을 해제했어요.');emit(nav,'pinchange',{ids:rows.filter(r=>r.dataset.pinned==='true').map(r=>r.dataset.pinId)});return;}
    const history=e.target.closest('[data-history-target],[data-history-back],[data-history-forward]');
    if(history){const nav=history.closest('[data-history-navigation]'),first=nav.querySelector('[data-history-page]:not([hidden])');if(!first)return;const state=nav.__history??={ids:[first.id],index:0};let direction;
      if(history.hasAttribute('data-history-target')){const id=history.dataset.historyTarget;if(state.ids[state.index]===id)return;state.ids=[...state.ids.slice(0,state.index+1),id];state.index=state.ids.length-1;direction='new';}else{const next=state.index+(history.hasAttribute('data-history-back')?-1:1);if(next<0||next>=state.ids.length)return;direction=next<state.index?'back':'forward';state.index=next;}
      const id=state.ids[state.index],page=document.getElementById(id);nav.querySelectorAll('[data-history-page]').forEach(n=>n.hidden=n.id!==id);nav.querySelectorAll('[data-history-target]').forEach(n=>{if(n.dataset.historyTarget===id)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');});nav.querySelector('[data-history-back]').disabled=state.index===0;nav.querySelector('[data-history-forward]').disabled=state.index===state.ids.length-1;page.querySelector('h2').focus();emit(nav,'navigate',{id:page.dataset.recordId,direction});return;
    }
    const restore=e.target.closest('[data-restore-open],[data-restore-back]');if(restore){const root=restore.closest('[data-scroll-restore]'),list=root.querySelector('[data-restore-list-view]'),scroll=root.querySelector('[data-restore-scroll]');
      if(restore.hasAttribute('data-restore-open')){root.__restore={id:restore.id,top:scroll.scrollTop};list.hidden=true;const detail=document.getElementById(restore.dataset.restoreOpen);detail.hidden=false;detail.querySelector('h2').focus();emit(root,'recordopen',{id:restore.dataset.recordId});}
      else{root.querySelectorAll('[data-restore-detail]').forEach(n=>n.hidden=true);list.hidden=false;scroll.scrollTop=root.__restore?.top||0;(document.getElementById(root.__restore?.id)||root.querySelector('[data-restore-search]')).focus({preventScroll:true});}return;
    }
    const spy=e.target.closest('[data-spy-target]');if(spy){e.preventDefault();const host=spy.closest('[data-scrollspy]').querySelector('[data-spy-scroll]'),target=document.getElementById(spy.dataset.spyTarget);host.scrollTop=target.offsetTop;target.focus({preventScroll:true});updateSpy(host);}
  });
  const commandOptions=box=>[...box.querySelectorAll('[data-command-option]:not([hidden])')];
  const filterCommands=box=>{const input=box.querySelector('input'),query=input.value.trim().toLocaleLowerCase();box.querySelectorAll('[data-command-option]').forEach(option=>{option.hidden=!(option.dataset.commandLabel+' '+option.dataset.commandKeywords).toLocaleLowerCase().includes(query);option.setAttribute('aria-selected','false');});input.removeAttribute('aria-activedescendant');const n=commandOptions(box).length;box.querySelector('[role="status"]').textContent=n?n+'개 명령':'일치하는 명령이 없어요.';};
  const chooseCommand=(box,option)=>{const dialog=box.querySelector('dialog');if(!dialog.open)return;const detail={id:option.dataset.commandId,label:option.dataset.commandLabel,href:option.dataset.commandHref,keywords:option.dataset.commandKeywords};const native=box.dispatchEvent(new CustomEvent('pattove:command',{bubbles:true,cancelable:true,detail}));if(native&&!detail.href){box.querySelector('[role="status"]').textContent='실행할 명령을 연결해 주세요.';return;}dialog.close();if(native&&detail.href)location.assign(detail.href);};
  root.addEventListener('click',e=>{const open=e.target.closest('[data-command-open]');if(open){const box=open.closest('[data-command-palette]'),dialog=box.querySelector('dialog'),input=box.querySelector('input');if(dialog.open)return;input.value='';filterCommands(box);input.setAttribute('aria-expanded','true');dialog.showModal();input.focus();dialog.addEventListener('close',()=>{input.setAttribute('aria-expanded','false');open.focus();},{once:true});}const option=e.target.closest('[data-command-option]');if(option&&!option.hidden)chooseCommand(option.closest('[data-command-palette]'),option);});
  root.addEventListener('pointerdown',e=>{if(e.target.closest('[data-command-option]'))e.preventDefault();});
  root.addEventListener('input',e=>{if(e.target.matches('[data-command-input]'))filterCommands(e.target.closest('[data-command-palette]'));});
  root.addEventListener('keydown',e=>{
    if(!e.target.matches('[data-command-input]')||e.isComposing)return;
    const box=e.target.closest('[data-command-palette]'),options=commandOptions(box),index=options.findIndex(o=>o.getAttribute('aria-selected')==='true');
    if(e.key==='Enter'&&index>=0){e.preventDefault();chooseCommand(box,options[index]);}
    else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!options.length)return;const next=e.key==='ArrowDown'?Math.min(index+1,options.length-1):index<0?options.length-1:Math.max(0,index-1);options.forEach((o,i)=>o.setAttribute('aria-selected',String(i===next)));e.target.setAttribute('aria-activedescendant',options[next].id);options[next].scrollIntoView({block:'nearest'});}
  });
  root.addEventListener('click',async e=>{
    const cancel=e.target.closest('[data-more-cancel]');if(cancel){cancel.closest('[data-load-more]').__moreRequest?.abort();return;}
    const button=e.target.closest('[data-more-request]');if(!button)return;const box=button.closest('[data-load-more]');if(box.__moreRequest||box.dataset.more==='false')return;
    const controller=new AbortController(),list=box.querySelector('[data-more-list]'),status=box.querySelector('[role="status"]'),cancelButton=box.querySelector('[data-more-cancel]');box.__moreRequest=controller;button.disabled=true;cancelButton.hidden=false;list.setAttribute('aria-busy','true');status.textContent='불러오는 중…';
    let response,responded=false,dispatching=true,onAbort;
    const removal=new MutationObserver(()=>{if(!box.isConnected)controller.abort();});removal.observe(document,{childList:true,subtree:true});
    try{
      box.dispatchEvent(new CustomEvent('pattove:loadmore',{bubbles:true,detail:{cursor:JSON.parse(box.dataset.cursor),signal:controller.signal,respondWith(value){if(!dispatching||responded)return false;responded=true;response=Promise.resolve(value);return true;}}}));dispatching=false;
      if(!responded)throw Error('Missing load handler');
      const aborted=new Promise((_,reject)=>{onAbort=()=>reject(new DOMException('Aborted','AbortError'));controller.signal.addEventListener('abort',onAbort,{once:true});if(controller.signal.aborted)onAbort();});
      const result=await Promise.race([response,aborted]);if(controller.signal.aborted||!box.isConnected)return;
      if(!result||!Array.isArray(result.items)||result.items.length>100||result.items.some(i=>!i||typeof i.id!=='string'||!i.id||typeof i.label!=='string'||(i.href!=null&&typeof i.href!=='string')||(i.description!=null&&typeof i.description!=='string'))||new Set(result.items.map(i=>i.id)).size!==result.items.length||typeof result.hasMore!=='boolean'||!(result.cursor==null||typeof result.cursor==='string'))throw Error('Invalid response');
      for(const item of result.items){let row=[...list.children].find(n=>n.dataset.recordId===item.id);if(!row){row=document.createElement('li');row.dataset.recordId=item.id;list.append(row);}const focused=row.contains(document.activeElement);row.replaceChildren();const label=document.createElement(item.href?'a':'span');label.textContent=item.label;if(item.href)label.href=/^(?:https?:|mailto:|tel:|#|\/(?!\/)|\.\.?\/)/i.test(item.href)?item.href:'#';row.append(label);if(item.description){const p=document.createElement('p');p.textContent=item.description;row.append(p);}if(focused){label.tabIndex=-1;label.focus({preventScroll:true});}}
      box.dataset.cursor=JSON.stringify(result.cursor??null);box.dataset.more=String(result.hasMore);button.hidden=!result.hasMore;status.textContent=result.hasMore?result.items.length+'개를 불러왔어요.':'모두 불러왔어요.';emit(box,'loadcomplete',{count:result.items.length,hasMore:result.hasMore});
    }catch(error){if(box.isConnected)status.textContent=controller.signal.aborted?'불러오기를 취소했어요.':'불러오지 못했어요. 다시 시도하세요.';}
    finally{dispatching=false;removal.disconnect();if(onAbort)controller.signal.removeEventListener('abort',onAbort);if(box.__moreRequest===controller)box.__moreRequest=null;button.disabled=false;cancelButton.hidden=true;list.setAttribute('aria-busy','false');}
  });
  root.addEventListener('keydown',e=>{
    const disclosure=e.target.closest('[data-nav-disclosure]');
    if(e.key==='Escape'&&disclosure?.open){e.preventDefault();e.stopPropagation();disclosure.open=false;disclosure.querySelector(':scope > summary')?.focus();}
  });
  root.addEventListener('focusout',e=>{
    const disclosure=e.target.closest('[data-nav-disclosure]');
    if(disclosure&&e.relatedTarget&&!disclosure.contains(e.relatedTarget))disclosure.open=false;
  });
  root.addEventListener('submit',e=>{
    const form=e.target.closest('[data-nav-select]');if(!form)return;e.preventDefault();const selected=form.querySelector('select').selectedOptions[0];if(!selected)return;
    const href=selected.value,event=new CustomEvent('pattove:navigate',{bubbles:true,cancelable:true,detail:{href,label:selected.textContent}});
    if(form.dispatchEvent(event))location.assign(href);
  });
  root.addEventListener('click',e=>{
    const jump=e.target.closest('[data-nav-target]');if(jump){const target=document.getElementById(jump.dataset.navTarget);if(target){if(!target.hasAttribute('tabindex'))target.tabIndex=-1;target.focus({preventScroll:true});}}
    const link=e.target.closest('[data-nav-dialog] a');if(link)link.closest('dialog')?.close();
    const button=e.target.closest('[data-nav-step],[data-nav-page]');if(!button)return;
    const nav=button.closest('[data-nav-pagination]'),total=Number(nav.dataset.total),page=Math.max(1,Math.min(total,button.hasAttribute('data-nav-page')?Number(button.dataset.navPage):Number(nav.dataset.page)+Number(button.dataset.navStep)));
    const wasNumber=button.hasAttribute('data-nav-page');nav.dataset.page=String(page);nav.querySelector('output').textContent=page+' / '+total;
    nav.querySelector('[data-nav-step="-1"]').disabled=page===1;nav.querySelector('[data-nav-step="1"]').disabled=page===total;
    const summary=nav.querySelector('summary');if(summary)summary.textContent=page+' / '+total;
    const numbers=[...new Set([1,total,...Array.from({length:5},(_,i)=>page-2+i).filter(n=>n>0&&n<=total)])].sort((a,b)=>a-b),list=nav.querySelector('.ds-nav-pages');list.replaceChildren();
    numbers.forEach((n,i)=>{if(i&&n>numbers[i-1]+1){const gap=document.createElement('span');gap.textContent='…';gap.setAttribute('aria-hidden','true');list.append(gap);}const b=document.createElement('button');b.type='button';b.className='ds-nav-button';b.dataset.navPage=String(n);b.setAttribute('aria-label',n+'쪽');if(n===page)b.setAttribute('aria-current','page');b.textContent=String(n);list.append(b);});
    if(wasNumber)list.querySelector('[aria-current="page"]')?.focus();emit(nav,'pagechange',{page});
  });
  const setSplit=(handle,value)=>{
    value=Math.round(Math.min(80,Math.max(0,value)));
    const box=handle.closest('[data-layout-resizer]'),primary=box.querySelector('[data-layout-primary]'),secondary=box.querySelector('[data-layout-secondary]');
    handle.setAttribute('aria-valuenow',String(value));handle.setAttribute('aria-valuetext',value+'%');
    primary.hidden=value===0;primary.style.flex=value+' 1 0%';secondary.style.flex=(100-value)+' 1 0%';
    emit(box,'layoutchange',{type:'resize',value});
  };
  const moveFloat=(panel,x,y)=>{
    const host=panel.closest('[data-layout-float-host]');
    x=Math.min(Math.max(0,x),Math.max(0,host.clientWidth-panel.offsetWidth));
    y=Math.min(Math.max(0,y),Math.max(0,host.clientHeight-panel.offsetHeight));
    panel.dataset.x=String(x);panel.dataset.y=String(y);panel.style.transform='translate('+x+'px,'+y+'px)';
    emit(panel,'layoutchange',{type:'move',x,y});
  };
  window.addEventListener('resize',()=>root.querySelectorAll('[data-layout-float]').forEach(n=>moveFloat(n,Number(n.dataset.x)||0,Number(n.dataset.y)||0)));
  let layoutDrag=null;
  root.addEventListener('pointerdown',e=>{
    const handle=e.target.closest('[data-layout-separator],[data-layout-drag]');if(!handle||e.button!==0)return;
    e.preventDefault();handle.focus();handle.setPointerCapture(e.pointerId);
    const panel=handle.closest('[data-layout-float]');
    layoutDrag={handle,pointer:e.pointerId,x:e.clientX,y:e.clientY,startX:Number(panel?.dataset.x)||0,startY:Number(panel?.dataset.y)||0};
  });
  root.addEventListener('pointermove',e=>{
    const d=layoutDrag;if(!d||d.pointer!==e.pointerId)return;
    if(d.handle.hasAttribute('data-layout-separator')){
      const box=d.handle.closest('[data-layout-resizer]'),rect=box.getBoundingClientRect(),rtl=getComputedStyle(box).direction==='rtl';
      const offset=(rtl?rect.right-e.clientX:e.clientX-rect.left)-d.handle.offsetWidth/2;
      setSplit(d.handle,offset/Math.max(1,rect.width-d.handle.offsetWidth)*100);
    }else moveFloat(d.handle.closest('[data-layout-float]'),d.startX+e.clientX-d.x,d.startY+e.clientY-d.y);
  });
  for(const event of ['pointerup','pointercancel','lostpointercapture'])root.addEventListener(event,e=>{if(layoutDrag?.pointer===e.pointerId)layoutDrag=null;});
  root.addEventListener('scroll',e=>{
    const node=e.target;if(node.matches?.('[data-layout-scroll]'))node.dataset.shrunk=String(node.scrollTop>40);
  },true);
  root.addEventListener('click',e=>{
    const button=e.target.closest('[data-layout-focus],[data-layout-rail],[data-layout-stack-next],[data-layout-stack-back],[data-layout-action]');if(!button)return;
    const node=button.closest('[data-interactive-layout]');
    if(button.hasAttribute('data-layout-focus')){
      const next=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(next));button.textContent=next?'집중 모드 끝내기':'집중 모드';
      node.querySelectorAll('[data-layout-distraction]').forEach(n=>{n.hidden=next;});node.dataset.focused=String(next);emit(node,'layoutchange',{type:'focus',value:next});
    }else if(button.hasAttribute('data-layout-rail')){
      const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));button.textContent=open?'탐색 접기':'탐색 펴기';node.dataset.collapsed=String(!open);emit(node,'layoutchange',{type:'navigation',value:open});
    }else if(button.hasAttribute('data-layout-action'))emit(node,'layoutaction',{});
    else{
      const current=button.closest('[data-layout-stack-page]'),pages=[...current.parentElement.children],index=pages.indexOf(current),back=button.hasAttribute('data-layout-stack-back'),next=pages[index+(back?-1:1)];
      if(next){node.dataset.depth=String(pages.indexOf(next));node.dataset.direction=back?'back':'next';current.hidden=true;next.hidden=false;(back?next.querySelector('[data-layout-stack-next]')||next:next).focus();emit(node,'layoutchange',{type:'depth',value:pages.indexOf(next)});}
    }
  });
  root.addEventListener('keydown',e=>{
    const handle=e.target.closest('[data-layout-separator]');
    if(handle&&['ArrowLeft','ArrowRight','Home','End','Enter'].includes(e.key)){
      e.preventDefault();const value=Number(handle.getAttribute('aria-valuenow')),rtl=getComputedStyle(handle).direction==='rtl';let next=value;
      if(e.key==='Home')next=0;else if(e.key==='End')next=80;else if(e.key==='Enter'){if(value)handle.dataset.saved=String(value);next=value?0:Number(handle.dataset.saved)||50;}
      else next=value+((e.key==='ArrowRight')!==rtl?1:-1)*(e.shiftKey?10:1);
      setSplit(handle,next);return;
    }
    const drag=e.target.closest('[data-layout-drag]');
    if(drag&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key)){
      e.preventDefault();const panel=drag.closest('[data-layout-float]'),step=e.shiftKey?40:10,x=Number(panel.dataset.x)||0,y=Number(panel.dataset.y)||0;
      moveFloat(panel,e.key==='Home'?0:x+(e.key==='ArrowRight'?step:e.key==='ArrowLeft'?-step:0),e.key==='Home'?0:y+(e.key==='ArrowDown'?step:e.key==='ArrowUp'?-step:0));
    }
    if(e.key==='Escape'){
      const focused=e.target.closest('[data-interactive-layout="focus-layout"][data-focused="true"]');
      if(focused){const button=focused.querySelector('[data-layout-focus]');button.click();button.focus();}
    }
  });
  const fieldError=(control,label)=>{
    const v=control.validity;
    const message=v.valueMissing?(control.type==='checkbox'?'체크해 주세요.':control.tagName==='SELECT'?'항목을 선택하세요.':'값을 입력하세요.'):
      v.typeMismatch?(control.type==='email'?'이메일 주소를 확인하세요.':'주소 형식을 확인하세요.'):
      v.rangeUnderflow?control.min+' 이상 입력하세요.':v.rangeOverflow?control.max+' 이하로 입력하세요.':
      v.stepMismatch?(control.step||'1')+' 간격으로 입력하세요.':v.tooLong?control.maxLength+'자 이내로 입력하세요.':
      v.customError?control.validationMessage:'입력 형식을 확인하세요.';
    return label+': '+message;
  };
  root.addEventListener('input',event=>{if(event.target.matches('.ds-stepper input'))syncStepper(event.target);});
  const formErrors = (form, errors) => {
    const summary=form.querySelector('.ds-error-summary');if(!summary)return;
    for(const control of form.querySelectorAll('[data-field-label]')){
      const error=errors.find(e=>e.id===control.id),help=document.getElementById(control.id+'-help');
      control.setAttribute('aria-invalid',String(!!error));
      if(help)help.textContent=error?.message||help.dataset.fieldHelp||'';
    }
    const list=summary.querySelector('ul');list.replaceChildren();summary.hidden=!errors.length;
    for(const error of errors){const li=document.createElement('li'),a=document.createElement('a');a.href='#'+encodeURIComponent(error.id);a.dataset.errorTarget=error.id;a.textContent=error.message;li.append(a);list.append(li);}
    if(errors.length)summary.focus();
  };
  root.addEventListener('click',event=>{const link=event.target.closest('[data-error-target]');if(!link)return;const input=document.getElementById(link.dataset.errorTarget);if(input){event.preventDefault();input.focus();input.scrollIntoView({block:'center'});}});
  // A host claims async work with event.detail.respondWith(promise). No response is never success.
  root.addEventListener('submit',async event=>{
    const form=event.target;
    if(form.matches('[data-calculator]')) {
      event.preventDefault();if(!form.reportValidity())return;
      const data=new FormData(form),result=Number(data.get('price'))*Number(data.get('quantity'));
      form.querySelector('output').textContent=Number.isFinite(result)?new Intl.NumberFormat('ko-KR',{style:'currency',currency:'KRW',maximumFractionDigits:2}).format(result):'금액을 확인하세요.';return;
    }
    if(!form.matches('[data-async-form]'))return;
    event.preventDefault();if(form.dataset.pending)return;
    if(form.matches('.ds-data-form')){
      const invalid=[...form.querySelectorAll('[data-field-label]')].filter(n=>!n.validity.valid).map(n=>({id:n.id,message:fieldError(n,n.dataset.fieldLabel)}));
      formErrors(form,invalid);form.querySelector('[role="status"]').textContent='';if(invalid.length)return;
    }else if(!form.reportValidity())return;
    const data=Object.fromEntries(new FormData(form)),status=form.querySelector('[role="status"]'),field=form.querySelector('fieldset'),controller=new AbortController();
    if(form.matches('.ds-data-form'))for(const checkbox of form.querySelectorAll('input[type="checkbox"][name]'))data[checkbox.name]=checkbox.checked;
    // Claim the form before invoking host handlers, including synchronous resubmission.
    form.dataset.pending='true';
    let promise,claimed=false,accepting=true;
    const detail={kind:form.dataset.asyncForm,values:data,signal:controller.signal,respondWith(value){if(!accepting)throw Error('respondWith must be called during the submit event');if(claimed)throw Error('Submission already handled');claimed=true;promise=Promise.resolve(value);},abort:()=>controller.abort()};
    emit(form,'submit',detail);
    accepting=false;
    if(!claimed){delete form.dataset.pending;status.textContent='요청을 처리할 수 없어요. 잠시 후 다시 시도하세요.';return;}
    form.dataset.pending='true';field.disabled=true;form.setAttribute('aria-busy','true');status.textContent='처리하고 있어요.';
    try {
      await new Promise((resolve,reject)=>{
        const abort=()=>reject(new DOMException('Request aborted','AbortError'));
        promise.then(value=>{controller.signal.removeEventListener('abort',abort);resolve(value);},error=>{controller.signal.removeEventListener('abort',abort);reject(error);});
        if(controller.signal.aborted)abort();else controller.signal.addEventListener('abort',abort,{once:true});
      });
      if(!controller.signal.aborted&&form.isConnected)status.textContent=form.dataset.successMessage||(form.dataset.asyncForm==='login'?'로그인했어요.':'저장했어요.');
    }
    catch(error) {if(form.isConnected&&!controller.signal.aborted){
      const server=[...form.querySelectorAll('[data-field-label]')].filter(n=>typeof error?.fieldErrors?.[n.name]==='string'&&error.fieldErrors[n.name]).map(n=>({id:n.id,message:error.fieldErrors[n.name]}));
      formErrors(form,server);status.textContent=server.length?'':'처리하지 못했어요. 입력한 내용을 유지했으니 다시 시도하세요.';
    }}
    finally {delete form.dataset.pending;field.disabled=false;form.removeAttribute('aria-busy');if(controller.signal.aborted&&form.isConnected)status.textContent='요청을 취소했어요. 다시 시도할 수 있어요.';}
  });
  const comboClose = box => {
    box.querySelector('[role="listbox"]').hidden = true;
    const input = box.querySelector('input'); input.setAttribute('aria-expanded','false'); input.removeAttribute('aria-activedescendant');
    box.querySelectorAll('[role="option"]').forEach(n=>n.setAttribute('aria-selected','false'));
  };
  const comboOpen = box => {
    const input=box.querySelector('input'), query=input.value.toLocaleLowerCase();
    box.querySelectorAll('[role="option"]').forEach(n=>{n.hidden=!n.dataset.value.toLocaleLowerCase().includes(query);n.setAttribute('aria-selected','false');});
    const options=[...box.querySelectorAll('[role="option"]')].filter(n=>!n.hidden);
    box.querySelector('[role="listbox"]').hidden=!options.length;
    input.setAttribute('aria-expanded',String(!!options.length));input.removeAttribute('aria-activedescendant');
    box.querySelector('[role="status"]').textContent=options.length?'':'일치하는 항목이 없어요.';
    return options;
  };
  const comboPick = (box, item) => {
    const input=box.querySelector('input');input.value=item.dataset.value;comboClose(box);
    input.dispatchEvent(new Event('change',{bubbles:true}));input.focus();
    emit(box,'select',{value:input.value});
  };
  root.addEventListener('input',event=>{const box=event.target.closest('[data-combobox]');if(box&&event.target.matches('input'))comboOpen(box);});
  root.addEventListener('focusout',event=>{
    const box=event.target.closest('[data-combobox]');if(box&&!box.contains(event.relatedTarget))comboClose(box);
    event.target.closest('.ds-tooltip')?.removeAttribute('data-dismissed');
  });
  root.addEventListener('pointerdown',event=>{const item=event.target.closest('[data-combobox] [role="option"]');if(item){event.preventDefault();comboPick(item.closest('[data-combobox]'),item);}});
  root.addEventListener('pointerover',event=>event.target.closest('.ds-tooltip')?.removeAttribute('data-dismissed'));
  root.addEventListener('keydown',event=>{
    if(event.key==='Escape')event.target.closest('.ds-tooltip')?.setAttribute('data-dismissed','');
    const box=event.target.closest('[data-combobox]');if(!box)return;
    const input=box.querySelector('input');
    if(event.key==='Escape'||event.key==='Tab'){comboClose(box);return;}
    if(!['ArrowDown','ArrowUp','Enter'].includes(event.key))return;
    let options=[...box.querySelectorAll('[role="option"]')].filter(n=>!n.hidden);
    const active=input.getAttribute('aria-activedescendant'), index=options.findIndex(n=>n.id===active);
    if(event.key==='Enter'){if(index>=0){event.preventDefault();comboPick(box,options[index]);}return;}
    event.preventDefault();if(input.getAttribute('aria-expanded')!=='true')options=comboOpen(box);if(!options.length)return;
    const next=options[(index+(event.key==='ArrowDown'?1:index<0?0:-1)+options.length)%options.length];
    options.forEach(n=>n.setAttribute('aria-selected',String(n===next)));input.setAttribute('aria-activedescendant',next.id);next.scrollIntoView({block:'nearest'});
  });
  root.addEventListener('change',event=>{
    const input=event.target,box=input.closest('[data-file-upload]');if(!box||input.type!=='file')return;
    const files=[...input.files],max=Number(box.dataset.maxBytes),accept=input.accept.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
    const invalid=files.find(f=>(max>0&&f.size>max)||(accept.length&&!accept.some(a=>a.startsWith('.')?f.name.toLowerCase().endsWith(a):a.endsWith('/*')?f.type.startsWith(a.slice(0,-1)):f.type===a)));
    const message=invalid?'파일 형식 또는 크기를 확인하세요.':files.length?files.map(f=>f.name).join(', '):'선택한 파일이 없어요.';
    input.setCustomValidity(invalid?message:'');input.setAttribute('aria-invalid',String(!!invalid));box.querySelector('[role="status"]').textContent=message;
    if(!invalid)emit(box,'files',{files});
  });
  root.addEventListener('click',event=>{
    const open=event.target.closest('[data-dialog-open]');
    if(open){const dialog=document.getElementById(open.dataset.dialogOpen);if(dialog&&!dialog.open){dialog.returnValue='';dialog.showModal();dialog.addEventListener('close',()=>{if(open.isConnected)open.focus();emit(open,'dialogclose',{value:dialog.returnValue});},{once:true});}}
    const step=event.target.closest('[data-page-step]');
    if(step){const nav=step.closest('.ds-pagination'),total=Number(nav.dataset.total),page=Math.max(1,Math.min(total,Number(nav.dataset.page)+Number(step.dataset.pageStep)));nav.dataset.page=page;nav.querySelector('[role="status"]').textContent=page+' / '+total;nav.querySelector('[data-page-step="-1"]').disabled=page===1;nav.querySelector('[data-page-step="1"]').disabled=page===total;emit(nav,'pagechange',{page});}
    const retry=event.target.closest('[data-retry]');if(retry)emit(retry,'retry',{});
    const choice=event.target.closest('[data-compare-id]');if(choice){const section=choice.closest('.ds-comparison');section.querySelectorAll('[data-compare-id]').forEach(b=>b.setAttribute('aria-pressed',String(b===choice)));section.querySelector('[role="status"]').textContent=choice.dataset.compareName+' 선택됨';emit(section,'choose',{id:choice.dataset.compareId});}
  });
  function selectTab(tab) {
    const tabs = tab.closest('.ds-tabs');
    tabs.querySelectorAll('[role="tab"]').forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1;
      tabs.querySelector('#' + CSS.escape(item.getAttribute('aria-controls'))).hidden = !active;
    });
    // A sideways-scrolling list brings the chosen tab fully into view.
    if (tabs.dataset.look === 'scroll') {
      const list = tab.parentElement;
      const pad = parseFloat(getComputedStyle(list).scrollPaddingLeft) || 0, lr = list.getBoundingClientRect(), tr = tab.getBoundingClientRect();
      if (tr.left - pad < lr.left) list.scrollLeft -= lr.left - tr.left + pad;
      else if (tr.right + pad > lr.right) list.scrollLeft += tr.right - lr.right + pad;
    }
    const picker=tabs.closest('[data-tabs-picker]');if(picker)updatePicker(picker);
    tabs.dispatchEvent(new CustomEvent('pattove:tabchange', { bubbles: true, detail: { label: tab.textContent.trim(), panel: tab.getAttribute('aria-controls') } }));
  }
  function filter(form) {
    // A search block on its own has no results to narrow; inside a search module it filters them.
    const module = form.closest('.ds-search-module');
    if (!module) return;
    const query = form.elements.query.value.trim().toLocaleLowerCase();
    // The people picker has no status menu, so it always searches every status.
    const status = form.elements.status?.value ?? 'all';
    let count = 0;
    module.querySelectorAll('[data-result]').forEach(item => {
      const match = query.split(/\s+/).every(term => item.dataset.result.toLocaleLowerCase().includes(term)) && (status === 'all' || item.dataset.resultStatus === status);
      item.hidden = !match; if (match) count++;
    });
    const counter = module.querySelector('.ds-result-count');
    if (counter) counter.textContent = count + (counter.dataset.unit || '개의 컬렉션');
    const empty = module.querySelector('.ds-empty');
    if (empty) empty.hidden = count > 0;
    const note = module.querySelector('.ds-demo-note');
    if (note) note.textContent = '';
  }
  root.addEventListener('submit', event => {
    if (!event.target.matches('[data-part-search]')) return;
    event.preventDefault(); filter(event.target);
  });
  // The people picker filters as the person types; the search forms wait for the search button.
  root.addEventListener('input', event => {
    if (event.target.matches('[data-part-search][data-live] [name="query"]')) filter(event.target.form);
  });
  root.addEventListener('change', event => {
    // The status filter is a select, or a filter-chip row of radios with the same name.
    if (event.target.matches('[data-part-search] [name="status"]')) filter(event.target.form);
    // Select-all: the parent sets every child, and each child sets the parent to all, some, or none.
    const group = event.target.closest('.ds-select-all');
    if (group) {
      const parent = group.querySelector('[data-part="select-all"]');
      const kids = [...group.querySelectorAll('input[type="checkbox"]:not([data-part="select-all"])')];
      if (event.target === parent) kids.forEach(kid => { kid.checked = parent.checked; });
      const on = kids.filter(kid => kid.checked).length;
      parent.checked = on === kids.length; parent.indeterminate = on > 0 && on < kids.length;
    }
  });
  root.addEventListener('click', event => {
    const tab = event.target.closest('.ds-tabs .ds-tab[role="tab"]');
    if (tab) selectTab(tab);
    const button = event.target.closest('[data-part-action]');
    if (!button || button.disabled) return;
    const action = button.dataset.partAction;
    if (['open-record', 'close-record', 'save-record'].includes(action)) {
      const module = button.closest('.ds-search-module');
      if (!module?.querySelector('.ds-record-detail')) return;
      const detail = module.querySelector('.ds-record-detail');
      if (action === 'save-record') {
        button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
        module.__recordOpener.dataset.saved = button.getAttribute('aria-pressed');
        module.__recordOpener.setAttribute('aria-label', module.querySelector('.ds-record-detail h3').textContent + (button.getAttribute('aria-pressed') === 'true' ? ', 보관됨, 상세 열기' : ', 상세 열기'));
        module.querySelector('.ds-demo-note').textContent = button.getAttribute('aria-pressed') === 'true' ? '이 화면에서 컬렉션에 보관했어요.' : '보관을 해제했어요.';
        const record = module.__recordOpener.closest('[data-result]');
        module.dispatchEvent(new CustomEvent('pattove:save', { bubbles: true, detail: {
          id: record.dataset.recordId,
          title: detail.querySelector('h3').textContent,
          description: detail.querySelector('p').textContent,
          tag: record.dataset.resultStatus,
          saved: button.getAttribute('aria-pressed') === 'true'
        } }));
        return;
      }
      const open = action === 'open-record';
      if (open) {
        module.__recordOpener = button;
        const card = button.closest('.ds-card');
        detail.querySelector('h3').textContent = card.querySelector('h3').textContent;
        detail.querySelector('p').textContent = card.querySelector('.ds-card-body > p').textContent;
        detail.querySelector('[data-part-action="save-record"]').setAttribute('aria-pressed', button.dataset.saved || 'false');
      }
      module.querySelectorAll(':scope > form, :scope > .ds-result-count, :scope > .ds-results').forEach(element => { element.hidden = open; });
      detail.hidden = !open;
      module.querySelector('.ds-demo-note').textContent = '';
      if (open) detail.focus(); else module.__recordOpener?.focus();
    } else if (action === 'clear-input') {
      const input = button.closest('.ds-input-group').querySelector('input');
      input.value = ''; input.dispatchEvent(new Event('input', { bubbles: true })); input.focus();
    } else if (action === 'reveal') {
      const input = button.closest('.ds-input-group').querySelector('input');
      const shown = input.type === 'password';
      input.type = shown ? 'text' : 'password';
      button.textContent = shown ? '숨기기' : '보기';
      button.setAttribute('aria-label', button.getAttribute('aria-label').replace(/ (보기|숨기기)$/, shown ? ' 숨기기' : ' 보기'));
    } else if (action === 'step') {
      const input = button.closest('.ds-input-group').querySelector('input');
      if(Number(button.dataset.step)>0)input.stepUp();else input.stepDown();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (action === 'undo') {
      // Undo closes the toast; the project reverses the action it reported.
      button.dispatchEvent(new CustomEvent('pattove:undo', { bubbles: true }));
      button.closest('[data-part-feedback]').hidden = true;
    } else if (action === 'nav') {
      const items = [...button.closest('nav').querySelectorAll(':scope > [data-part-action="nav"]')];
      items.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      button.dispatchEvent(new CustomEvent('pattove:navigate', { bubbles: true, detail: { index: items.indexOf(button), label: button.textContent.trim() } }));
    } else if (action === 'create') {
      button.dispatchEvent(new CustomEvent('pattove:create', { bubbles: true }));
    } else if (action === 'select-card') {
      const card = button.closest('.ds-card');
      const selected = card.dataset.selected !== 'true';
      card.dataset.selected = String(selected);
      button.setAttribute('aria-pressed', String(selected));
      button.lastChild.textContent = selected ? '선택됨' : '선택하기';
      card.dispatchEvent(new CustomEvent('pattove:select', { bubbles: true, detail: { selected, title: card.querySelector('h3').textContent } }));
    } else if (action === 'reset-search') {
      // An empty state on its own has nothing to reset.
      const form = button.closest('.ds-search-module')?.querySelector('form');
      if (!form) return;
      form.reset(); filter(form); form.elements.query.focus();
    } else if (action === 'press') {
      button.dispatchEvent(new CustomEvent('pattove:action', { bubbles: true, detail: { label: button.getAttribute('aria-label') || button.textContent.trim() } }));
      const region = button.closest('.ds-search-module, .part-demo, .specimen') || root;
      const output = region.querySelector('.ds-demo-note');
      if (output) {
        const card = button.closest('.ds-card');
        output.textContent = card ? card.querySelector('h3').textContent + ' 선택됨' : (button.getAttribute('aria-label') || button.textContent.trim()) + ' 버튼을 눌렀어요.';
      }
    }
  });
  root.addEventListener('keydown', event => {
    const tab = event.target.closest('.ds-tabs .ds-tab[role="tab"]');
    if (!tab) return;
    const list = tab.closest('[role="tablist"]');
    // A vertical tab list moves with the up and down arrows, a horizontal one with left and right.
    const [back, forward] = list.getAttribute('aria-orientation') === 'vertical' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
    if (![back, forward, 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...list.querySelectorAll('.ds-tab')].filter(tab=>!tab.hidden);
    const current = tabs.indexOf(tab);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === forward ? 1 : -1) + tabs.length) % tabs.length;
    selectTab(tabs[next]); tabs[next].focus();
  });
};
