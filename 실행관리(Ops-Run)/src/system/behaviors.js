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
  if (root.__pattovePartsMounted) return;
  root.__pattovePartsMounted = true;
  const emit = (node, name, detail) => node.dispatchEvent(new CustomEvent('pattove:' + name, {bubbles:true, detail}));
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
    const tabs = [...list.querySelectorAll('.ds-tab')];
    const current = tabs.indexOf(tab);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === forward ? 1 : -1) + tabs.length) % tabs.length;
    selectTab(tabs[next]); tabs[next].focus();
  });
};
