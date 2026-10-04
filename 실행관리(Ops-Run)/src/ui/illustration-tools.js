(() => {
  const selected=new Set();
  let selecting=false, pack='core-ui', pageIds=[], busy=false, message='', format='png';
  const esc=value=>Pattove.parts.esc(value);
  const more=()=>'<details class="illustration-more"><summary aria-label="다른 받기 옵션" title="다른 받기 옵션">···</summary><div class="illustration-more-menu"><button type="button" data-export-page>이 페이지 받기</button></div></details>';
  // The mode button's name says what pressing it does next; it carries no separate pressed state, so the change is announced once.
  // Like a phone's photo grid: 선택 enters the mode and 취소 leaves it; 선택 해제 in the bar only empties the selection.
  const modeLabel=()=>selecting?'취소':'<span class="illustration-select-label">여러 개 </span>선택';
  const modeName=()=>selecting?'여러 개 선택 취소':'여러 개 선택';
  function update() {
    document.body.classList.toggle('is-selecting-icons',selecting&&document.body.dataset.shelf==='icon');
    document.querySelectorAll('[data-select-illustration]').forEach(input=>{
      const checked=selected.has(input.dataset.selectIllustration);
      input.checked=checked;input.closest('.is-illustrated')?.classList.toggle('is-selected',checked);
      // Outside selection mode the hidden check boxes take no Tab stop: one stop per icon.
      input.tabIndex=selecting?0:-1;
    });
    document.querySelectorAll('[data-illustration-id] .illustration-open').forEach(button=>{
      if(selecting)button.setAttribute('aria-pressed',String(selected.has(button.dataset.libraryEntry)));
      else button.removeAttribute('aria-pressed');
    });
    document.querySelectorAll('[data-selection-mode]').forEach(button=>{
      button.innerHTML=modeLabel();button.setAttribute('aria-label',modeName());
    });
    document.querySelectorAll('.illustration-selection').forEach(bar=>bar.hidden=!selecting);
    document.querySelectorAll('[data-selection-count]').forEach(node=>node.textContent=selected.size+'개 선택');
    document.querySelectorAll('[data-export-selected]').forEach(button=>{
      button.innerHTML='<span class="illustration-selected-label">선택한 '+selected.size+'개 </span>받기';button.disabled=busy||!selected.size;
    });
    document.querySelectorAll('[data-export-pack],[data-export-page]').forEach(button=>button.disabled=busy||('exportPage' in button.dataset&&!pageIds.length));
    document.querySelectorAll('[data-export-status]').forEach(node=>{node.textContent=message;node.hidden=!message;});
    document.querySelectorAll('[data-pick-illustration]').forEach(button=>{
      const checked=selected.has(button.dataset.pickIllustration);button.setAttribute('aria-pressed',String(checked));button.textContent=button.classList.contains('icon-selection-add')?(checked?'✓ 선택됨 · 선택 해제':'+ 선택에 추가'):(checked?'선택 해제':'팩에 담기');
    });
  }
  function toggle(id,checked=!selected.has(id)) {
    selecting=true;checked?selected.add(id):selected.delete(id);message='';update();
    document.querySelector('#announcer').textContent=selected.size+'개 선택';
  }
  window.Pattove.illustrationTools={
    toolbar(groups,ids) {
      pageIds=ids;
      // The pack menu only picks what 팩 받기 downloads, so its label and button sit together and it is not read as a filter.
      return '<div class="illustration-tools"><label class="illustration-pack-label toolbar-label" for="illustration-pack"><span class="illustration-select-label">받을 팩</span></label><select class="illustration-pack" id="illustration-pack" data-illustration-pack data-focus="illustration-pack" aria-label="받을 팩">'+[{id:'core-ui',name:'기본 UI'},...groups].map(g=>'<option value="'+esc(g.id)+'"'+(pack===g.id?' selected':'')+'>'+esc(g.name)+'</option>').join('')+'</select><button type="button" class="illustration-pack-download ds-button" data-variant="outline" data-size="sm" data-export-pack data-focus="illustration-pack-download" aria-label="팩 받기">'+Pattove.uiIcon('download')+'<span class="illustration-select-label">팩 받기</span></button><button type="button" class="illustration-select" data-selection-mode data-focus="illustration-select" aria-label="'+modeName()+'">'+modeLabel()+'</button><div class="illustration-toolbar-more">'+more()+'</div><p class="illustration-status" role="status" data-export-status hidden></p></div>';
    },
    selectionBar() {
      return '<div class="illustration-selection"'+(!selecting?' hidden':'')+' aria-label="선택한 아이콘"><span data-selection-count>'+selected.size+'개 선택</span><button type="button" class="illustration-clear" data-clear-illustrations data-focus="illustration-clear">선택 해제</button>'+more()+'<button type="button" class="illustration-download" data-export-selected data-focus="illustration-download"'+(!selected.size||busy?' disabled':'')+'><span class="illustration-selected-label">선택한 '+selected.size+'개 </span>받기</button></div>';
    },
    checkbox(id,name) {
      return '<label class="illustration-pick"><input type="checkbox" data-select-illustration="'+esc(id)+'" data-focus="select-'+esc(id)+'" aria-label="'+esc(name)+' 선택"'+(selecting?'':' tabindex="-1"')+(selected.has(id)?' checked':'')+'><span aria-hidden="true"></span></label>';
    },
    pick(id,quiet=false){return '<button type="button" class="'+(quiet?'icon-selection-add':'ds-button')+'" data-variant="outline" data-pick-illustration="'+esc(id)+'" aria-pressed="'+selected.has(id)+'">'+(quiet?(selected.has(id)?'✓ 선택됨 · 선택 해제':'+ 선택에 추가'):(selected.has(id)?'선택 해제':'팩에 담기'))+'</button>';},
    format:()=>format,
    hydrate:update,
    selectEntry(id) {
      if(!selecting||!document.querySelector('[data-illustration-id="'+CSS.escape(id)+'"]'))return false;
      toggle(id);return true;
    }
  };
  document.addEventListener('change',event=>{
    const d=event.target.dataset;
    if(d.selectIllustration)toggle(d.selectIllustration,event.target.checked);
    if('illustrationPack' in d)pack=event.target.value;
    if('iconFormat' in d) {
      format=event.target.value;
      const link=event.target.closest('.icon-download-row').querySelector('[data-icon-download]');
      link.href=link.dataset[format];link.download=link.dataset.file+'.'+format;
      link.setAttribute('aria-label',(format==='png'?'PNG':'WebP')+' 다운로드');
    }
  });
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    document.querySelectorAll('.illustration-more[open]').forEach(menu=>{menu.open=false;menu.querySelector('summary').focus();event.preventDefault();});
  });
  document.addEventListener('click',async event=>{
    document.querySelectorAll('.illustration-more[open]').forEach(menu=>{if(!menu.contains(event.target))menu.open=false;});
    const button=event.target.closest('button');if(!button||button.disabled)return;
    const d=button.dataset;
    if(d.pickIllustration){toggle(d.pickIllustration);return;}
    if('selectionMode' in d){selecting=!selecting;if(!selecting)selected.clear();message='';update();return;}
    if('clearIllustrations' in d){selected.clear();message='';update();return;}
    if(!('exportPack' in d||'exportPage' in d||'exportSelected' in d)||busy)return;
    const menu=button.closest('details');if(menu){menu.open=false;menu.querySelector('summary').focus();}
    if(location.protocol==='file:'){message='팩 다운로드는 패토브 실행 파일로 서버를 켠 뒤 사용하세요.';update();return;}
    const params=new URLSearchParams();
    if('exportPack' in d)params.set('pack',pack);
    else for(const id of ('exportPage' in d?pageIds:[...selected]))params.append('id',id);
    busy=true;message='그림을 묶고 있어요.';update();
    try {
      const response=await fetch('/api/illustrations/export?'+params),result=await response.json();
      if(!response.ok)throw Error(result.error);
      const link=document.createElement('a');link.href=result.download;link.download='pattove-illustrations.zip';document.body.append(link);link.click();link.remove();
      message=result.items+'개를 다운로드했습니다.';
    }catch(error){message='다운로드하지 못했어요. '+error.message;}
    finally{busy=false;update();}
  });
})();

