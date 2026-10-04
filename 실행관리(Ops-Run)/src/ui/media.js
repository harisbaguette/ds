(() => {
  const tracked = image => image instanceof HTMLImageElement && image.matches('.illustrated-icon,.search-thumb>img');
  const host = image => image.closest('.dict-thumb,.icon-detail-preview,.search-thumb');
  function failed(image) {
    const frame=host(image);if(!frame)return;
    image.dataset.originalSrc ||= image.getAttribute('src');
    frame.classList.add('has-image-error');
    const message=frame.querySelector('.image-fallback')||document.createElement('span');message.className='image-fallback';
    message.textContent=frame.matches('.icon-detail-preview')?'이미지를 불러오지 못했어요.':'미리보기 없음';
    frame.append(message);
    if(frame.matches('.icon-detail-preview')) {
      message.setAttribute('role','status');
      const button=frame.querySelector('.image-retry')||document.createElement('button');button.type='button';button.className='image-retry';button.dataset.retryImage='';button.textContent='다시 불러오기';button.removeAttribute('aria-disabled');button.removeAttribute('aria-busy');frame.append(button);
    }
  }
  document.addEventListener('error',event=>{if(tracked(event.target))failed(event.target);},true);
  document.addEventListener('load',event=>{
    if(!tracked(event.target))return;
    const frame=host(event.target);if(!frame)return;
    const retry=frame.querySelector('.image-retry');
    if(retry===document.activeElement)frame.closest('.icon-detail')?.querySelector('[data-icon-download]')?.focus({preventScroll:true});
    frame.classList.remove('has-image-error');frame.querySelector('.image-fallback')?.remove();retry?.remove();
  },true);
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-retry-image]');if(!button||button.getAttribute('aria-disabled')==='true')return;
    const frame=button.parentElement,image=frame.querySelector('img');
    frame.querySelector('.image-fallback').textContent='이미지를 불러오고 있어요.';button.setAttribute('aria-disabled','true');button.setAttribute('aria-busy','true');button.textContent='불러오는 중';
    const retry=new URL(image.dataset.originalSrc||image.src,document.baseURI);retry.searchParams.set('retry',Date.now());image.src=retry.href;
  });
  window.Pattove.mediaUI={hydrate(root=document){root.querySelectorAll('.illustrated-icon,.search-thumb>img').forEach(image=>{if(image.complete&&!image.naturalWidth)failed(image);});}};
})();
