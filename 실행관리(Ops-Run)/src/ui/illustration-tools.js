(() => {
  const selected=new Set();
  const update=()=>document.querySelectorAll('[data-export-selected]').forEach(button=>{
    button.textContent='선택한 '+selected.size+'개 받기';button.disabled=!selected.size;
  });
  window.Pattove.illustrationTools={
    toolbar(groups,ids) {
      return '<div class="illustration-tools"><label>팩 <select class="ds-input" data-illustration-pack aria-label="일러스트 팩"><option value="core-ui">기본 UI</option>'+groups.map(g=>'<option value="'+g.id+'">'+Pattove.parts.esc(g.name)+'</option>').join('')+'</select></label><button class="ds-button" data-size="sm" data-variant="outline" data-export-pack>팩 받기</button><button class="ds-button" data-size="sm" data-variant="outline" data-export-page="'+Pattove.parts.esc(JSON.stringify(ids))+'"'+(!ids.length?' disabled':'')+'>이 페이지 받기</button><button class="ds-button" data-size="sm" data-variant="outline" data-export-selected'+(!selected.size?' disabled':'')+'>선택한 '+selected.size+'개 받기</button><button class="ds-button" data-size="sm" data-variant="ghost" data-clear-illustrations>선택 비우기</button><span role="status" data-export-status></span></div>';
    },
    pick(id){return '<button class="ds-button" data-variant="outline" data-pick-illustration="'+Pattove.parts.esc(id)+'" aria-pressed="'+selected.has(id)+'">'+(selected.has(id)?'선택 해제':'팩에 담기')+'</button>';}
  };
  document.addEventListener('click',async event=>{
    const button=event.target.closest('button');if(!button||button.disabled)return;
    const d=button.dataset;
    if(d.pickIllustration) {
      if(selected.has(d.pickIllustration))selected.delete(d.pickIllustration);else selected.add(d.pickIllustration);
      button.setAttribute('aria-pressed',String(selected.has(d.pickIllustration)));
      button.textContent=selected.has(d.pickIllustration)?'선택 해제':'팩에 담기';update();return;
    }
    if('clearIllustrations' in d){selected.clear();update();return;}
    if(!('exportPack' in d||'exportPage' in d||'exportSelected' in d))return;
    const status=document.querySelector('[data-export-status]');
    if(location.protocol==='file:'){status.textContent='팩 다운로드는 패토브 실행 파일로 서버를 켠 뒤 사용하세요.';return;}
    const params=new URLSearchParams();
    if('exportPack' in d)params.set('pack',document.querySelector('[data-illustration-pack]').value);
    else for(const id of ('exportPage' in d?JSON.parse(d.exportPage):selected))params.append('id',id);
    button.disabled=true;button.setAttribute('aria-busy','true');status.textContent='그림을 묶고 있어요.';
    try {
      const response=await fetch('/api/illustrations/export?'+params);const result=await response.json();
      if(!response.ok)throw Error(result.error);
      const link=document.createElement('a');link.href=result.download;link.download='pattove-illustrations.zip';document.body.append(link);link.click();link.remove();
      status.textContent=result.items+'개를 다운로드했습니다.';
    }catch(error){status.textContent='다운로드하지 못했어요. '+error.message;}
    finally{button.disabled=false;button.removeAttribute('aria-busy');update();}
  });
})();

