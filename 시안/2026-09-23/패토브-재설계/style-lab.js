const styleLab={view:'focus',clocks:{},tasks:{},forms:{}};
let styleClockTimer;
const timerText=seconds=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
function clockFor(key){return styleLab.clocks[key]||(styleLab.clocks[key]={minutes:25,seconds:1500,running:false,end:0});}
function lineEmblem(){
 return '<svg class="line-emblem" viewBox="0 0 180 100" aria-hidden="true"><path d="M35 77c-7-17-7-47 5-52l22 13c17-5 35-4 51 3l23-13c8 17 12 34 7 48-24 11-81 15-108 1Z"/><path d="m33 27-2-12 16 12m72 0 15-10 2 11M57 58q8-9 16 0m25 0q8-9 16 0m-37 10q6 8 12 0M19 59l19 3m-19 9 19-3m111-6 14-4m-14 11 17 2"/><path class="emblem-ground" d="M20 88h141"/><circle cx="153" cy="20" r="5"/></svg>';
}
function landscape(){
 return '<svg class="landscape" viewBox="0 0 400 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path fill="#bdcbd2" d="M0 0h400v440H0z"/><circle fill="#f4eee2" cx="318" cy="134" r="22"/><path fill="#91a9b7" d="M0 223h400v217H0z"/><path fill="#708d9f" d="M0 244h400v196H0z"/><path fill="#466679" d="M0 267h400v173H0z"/><path fill="#2d4a5d" d="M0 294h400v146H0z"/><path fill="#d5cdba" d="M0 350h162l54 23h184v67H0z"/><path fill="#b8b0a1" d="M0 389h400v51H0z"/><path fill="#f2ebdc" d="m93 278 9-38 3 38Z"/><path fill="#273c4a" d="M83 282h37l-7 6H90zm19-44h2v45h-2Z"/><path stroke="#829dab" stroke-width="2" d="M92 305h34m-48 10h62m86-51h39m70 56h32"/></svg>';
}
function focusTasks(key){
 const tasks=styleLab.tasks[key]||(styleLab.tasks[key]=[false,true]);
 return `<div class="focus-tasks"><div class="task-heading"><b>오늘 할 일</b><span class="task-count">${tasks.filter(Boolean).length} / 2</span></div>${['브랜드 리뉴얼','레퍼런스 정리'].map((task,i)=>`<label class="focus-task"><input type="checkbox" data-lab-task="${key}" data-task-index="${i}" ${tasks[i]?'checked':''}><span>${task}</span><small>${i?'10':'25'}분</small></label>`).join('')}</div>`;
}
function focusScreen(key){
 const c=clockFor(key);
 return `<div class="focus-app sample-app focus-${key}"><div class="focus-top"><b>집중</b><span>9월 23일</span></div><div class="focus-hero">${key==='calm'?landscape():''}<div class="focus-duration" aria-label="${styleName(key)} 집중 시간">${[25,50,90].map(n=>`<button data-lab-duration="${key}" data-minutes="${n}" aria-pressed="${c.minutes===n}">${n}분</button>`).join('')}</div>${key==='ink'?lineEmblem():''}<div class="focus-clock" role="timer" aria-label="남은 집중 시간">${timerText(c.seconds)}</div><div class="focus-subject">브랜드 리뉴얼</div><button class="focus-start" data-lab-clock="${key}" aria-pressed="${c.running}">${c.running?'일시정지':'시작'}<span aria-hidden="true">${c.running?'Ⅱ':'↗'}</span></button></div>${focusTasks(key)}</div>`;
}
function formScreen(key){
 const name=styleLab.forms[key]||'';
 return `<form class="lab-form sample-app" data-lab-form="${key}" novalidate><div class="lab-form-head"><h3>새 컬렉션</h3></div><div class="lab-form-body">${key==='ink'?lineEmblem():key==='calm'?landscape():''}<label for="collection-${key}">이름</label><input id="collection-${key}" name="collection" value="${escapeText(name)}" placeholder="예: 여름의 색" autocomplete="off" required aria-describedby="collection-error-${key}"><p class="lab-form-error" id="collection-error-${key}" aria-live="polite"></p><fieldset><legend>공개 범위</legend><label><input type="radio" name="visibility-${key}" value="private" checked> 나만 보기</label><label><input type="radio" name="visibility-${key}" value="link"> 링크로 공유</label></fieldset><button class="lab-submit" type="submit">만들기 <span aria-hidden="true">↗</span></button><div class="lab-form-result" role="status"></div></div></form>`;
}
function feedbackScreen(key){
 return `<div class="lab-feedback sample-app"><div class="lab-feedback-head"><b>컬렉션</b><span>2개</span></div><div class="feedback-stack"><div class="feedback-tile"><span class="tile-number">01</span><b>여름의 색</b><span class="tile-count">12개</span></div><div class="feedback-tile"><span class="tile-number">02</span><b>좋아하는 장면</b><span class="tile-count">8개</span></div></div><div class="feedback-actions"><button class="lab-submit" data-lab-feedback="${key}">저장 <span aria-hidden="true">↗</span></button></div><div class="lab-toast" role="status" data-lab-toast="${key}">${icon('check')}<span>변경사항 저장됨</span><button data-lab-dismiss="${key}" aria-label="${styleName(key)} 예시 알림 닫기">${icon('close')}</button></div></div>`;
}
function sourceImages(key){
 return `<details class="style-sources"><summary>참고 이미지 <span>3</span></summary><div class="source-images">${STYLES[key].refs.map(([file,alt])=>`<a href="../../../영감보관함/이미지/${file}" target="_blank" rel="noopener" title="${alt}"><img src="../../../영감보관함/이미지/${file}" alt="${alt}" loading="lazy"></a>`).join('')}</div></details>`;
}
function styleSample(key){return styleLab.view==='focus'?focusScreen(key):styleLab.view==='form'?formScreen(key):feedbackScreen(key);}
function renderStyles(){
 $('#style-page').innerHTML=`<div class="style-toolbar"><div class="page-heading"><h1>스타일</h1><span>3</span></div><div class="style-view-controls" role="group" aria-label="스타일 비교 예시">${[['focus','집중'],['form','입력'],['feedback','피드백']].map(([key,label])=>`<button data-lab-view="${key}" aria-pressed="${styleLab.view===key}">${label}</button>`).join('')}</div><button class="style-reset" data-apply-style="clear">기본으로</button></div><div class="style-grid">${STYLE_FAMILIES.map(key=>`<article class="style-card ${state.style===key?'selected':''}" aria-labelledby="style-name-${key}"><div class="style-sample theme-${key}" role="group" aria-label="${styleName(key)} ${styleLab.view==='focus'?'집중 타이머':styleLab.view==='form'?'입력':'피드백'} 예시">${styleSample(key)}</div><div class="style-meta"><h2 id="style-name-${key}">${styleName(key)}</h2><div class="style-swatches" aria-hidden="true">${STYLES[key].colors.map(color=>`<i style="background:${color}"></i>`).join('')}</div><button class="style-apply" data-apply-style="${key}" aria-label="${styleName(key)} 패턴에 적용" aria-pressed="${state.style===key}">${state.style===key?'적용됨':'적용'} ${icon(state.style===key?'check':'arrow')}</button></div>${sourceImages(key)}</article>`).join('')}</div>`;
}
function updateStyleClocks(){
 for(const [key,c] of Object.entries(styleLab.clocks)){
  if(!c.running)continue;
  c.seconds=Math.max(0,Math.ceil((c.end-Date.now())/1000));
  const clock=$(`.focus-${key} .focus-clock`);if(clock)clock.textContent=timerText(c.seconds);
  if(c.seconds===0){c.running=false;const button=$(`[data-lab-clock="${key}"]`);if(button){button.innerHTML='다시 시작 <span aria-hidden="true">↗</span>';button.setAttribute('aria-pressed','false');}announce(`${styleName(key)} 집중 시간이 끝났습니다.`);}
 }
 if(!Object.values(styleLab.clocks).some(c=>c.running)){clearInterval(styleClockTimer);styleClockTimer=null;}
}
function pauseStyleClocks(){
 updateStyleClocks();Object.values(styleLab.clocks).forEach(c=>c.running=false);clearInterval(styleClockTimer);styleClockTimer=null;
}
document.addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b)return;
 if(b.dataset.labView){pauseStyleClocks();styleLab.view=b.dataset.labView;renderStyles();$(`[data-lab-view="${styleLab.view}"]`).focus();}
 if(b.dataset.labClock){
  const c=clockFor(b.dataset.labClock);c.running=!c.running;if(!c.seconds)c.seconds=c.minutes*60;
  if(c.running)c.end=Date.now()+c.seconds*1000;
  b.innerHTML=`${c.running?'일시정지':'계속'} <span aria-hidden="true">${c.running?'Ⅱ':'↗'}</span>`;b.setAttribute('aria-pressed',String(c.running));
  if(c.running&&!styleClockTimer)styleClockTimer=setInterval(updateStyleClocks,250);
  announce(`${styleName(b.dataset.labClock)} 타이머 ${c.running?'시작':'일시정지'}`);
 }
 if(b.dataset.labDuration){
  const key=b.dataset.labDuration,c=clockFor(key);c.minutes=Number(b.dataset.minutes);c.seconds=c.minutes*60;c.running=false;
  const app=b.closest('.focus-app');$('.focus-clock',app).textContent=timerText(c.seconds);$$('[data-lab-duration]',app).forEach(el=>el.setAttribute('aria-pressed',String(el===b)));
  const start=$('[data-lab-clock]',app);start.innerHTML='시작 <span aria-hidden="true">↗</span>';start.setAttribute('aria-pressed','false');
 }
 if(b.dataset.labFeedback){const toast=$(`[data-lab-toast="${b.dataset.labFeedback}"]`);toast.hidden=false;announce(`${styleName(b.dataset.labFeedback)} 예시: 변경사항 저장됨`);}
 if(b.dataset.labDismiss){$(`[data-lab-toast="${b.dataset.labDismiss}"]`).hidden=true;$(`[data-lab-feedback="${b.dataset.labDismiss}"]`).focus();}
});
document.addEventListener('change',event=>{
 const input=event.target;if(!input.dataset.labTask)return;
 const key=input.dataset.labTask;styleLab.tasks[key][Number(input.dataset.taskIndex)]=input.checked;
 $('.task-count',input.closest('.focus-tasks')).textContent=`${styleLab.tasks[key].filter(Boolean).length} / 2`;
});
document.addEventListener('input',event=>{
 const input=event.target;if(!input.closest('[data-lab-form]')||input.name!=='collection')return;
 styleLab.forms[input.closest('form').dataset.labForm]=input.value;
 input.removeAttribute('aria-invalid');$('.lab-form-error',input.closest('form')).textContent='';$('.lab-form-result',input.closest('form')).textContent='';
});
document.addEventListener('submit',event=>{
 const form=event.target;if(!form.dataset.labForm)return;event.preventDefault();
 const input=$('input[name=collection]',form),name=input.value.trim(),error=$('.lab-form-error',form);
 if(!name){input.setAttribute('aria-invalid','true');error.textContent='컬렉션 이름을 입력해 주세요.';input.focus();return;}
 input.removeAttribute('aria-invalid');error.textContent='';$('.lab-form-result',form).textContent=`‘${name}’ 컬렉션이 만들어졌어요.`;
});

if(['styles','saved'].includes(location.hash.slice(1)))setPage(location.hash.slice(1));
