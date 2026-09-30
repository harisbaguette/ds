(() => {
  function detail(state) { return window.Pattove.componentDocs.page(state); }
  // Inert specimens retain their real proportions. Fit the entire scene to its tray,
  // rather than clipping the last control or changing the reusable component itself.
  function fitPreview(scene) {
    const viewport=scene.parentElement, tray=viewport.parentElement, style=getComputedStyle(tray);
    const width=tray.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight);
    const previous=parseFloat(scene.style.getPropertyValue('--preview-scale')) || 1;
    const bounds=scene.getBoundingClientRect(), naturalWidth=bounds.width/previous, naturalHeight=bounds.height/previous;
    if (!width || !naturalWidth || !naturalHeight) return;
    const maxWidth=parseFloat(getComputedStyle(viewport).maxWidth) || width;
    let scale=Math.min(1,width/naturalWidth,maxWidth/naturalWidth);
    const height=tray.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom);
    if (scene.dataset.previewFit==='both' && height>0) scale=Math.min(scale,height/naturalHeight);
    viewport.style.width=naturalWidth*scale+'px';
    viewport.style.height=naturalHeight*scale+'px';
    scene.style.setProperty('--preview-scale',String(scale));
  }
  const previewScenes=new Map();
  const pendingPreviews=new Set();
  let previewFrame=0;
  const previewResize=new ResizeObserver(entries=>{
    for (const {target,contentRect} of entries) {
      const item=previewScenes.get(target);
      if (!item) continue;
      if (item.width===contentRect.width && (!item.watchHeight || item.height===contentRect.height)) continue;
      item.width=contentRect.width; item.height=contentRect.height;
      pendingPreviews.add(item.scene);
    }
    // A fitted phone changes its tray's height. Write after this resize delivery,
    // and react only to dimensions that affect fitting, to avoid observer feedback.
    if (pendingPreviews.size && !previewFrame) previewFrame=requestAnimationFrame(()=>{
      previewFrame=0;
      pendingPreviews.forEach(scene=>{ if (scene.isConnected) fitPreview(scene); });
      pendingPreviews.clear();
    });
  });
  function fitPreviews(root) {
    previewResize.disconnect();
    previewScenes.clear();
    cancelAnimationFrame(previewFrame); previewFrame=0; pendingPreviews.clear();
    const scenes=root.querySelectorAll('[data-preview-scene], .variant-frame[data-frame="phone"] > .variant-phone');
    scenes.forEach(scene=>{
      if (scene.closest('.part-demo')) return;
      scene.dataset.previewScene='';
      // Every grid cell is square, so a whole phone shrinks until it fits the height too.
      if (scene.matches('.variant-phone')) scene.dataset.previewFit='both';
      if (!scene.parentElement.matches('.preview-viewport')) {
        const viewport=document.createElement('div');
        viewport.className='preview-viewport';
        if (scene.matches('.variant-phone')) viewport.dataset.phone='';
        scene.before(viewport);
        viewport.append(scene);
      }
      fitPreview(scene);
      const tray=scene.parentElement.parentElement;
      previewScenes.set(tray,{scene,watchHeight:scene.dataset.previewFit==='both'});
      previewScenes.set(scene,{scene,watchHeight:true});
      previewResize.observe(tray);
      previewResize.observe(scene);
    });
  }
  function hydrate(root) {
    root.querySelectorAll('[data-token-value]').forEach(node => { node.textContent = getComputedStyle(node.closest('.ds')).getPropertyValue(node.dataset.tokenValue).trim(); });
    window.Pattove.mountParts(root);
    fitPreviews(root);
  }
  window.Pattove.systemUI = { detail, hydrate };
})();
