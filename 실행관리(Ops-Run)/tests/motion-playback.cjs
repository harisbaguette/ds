exports.exercisePlayback = async function exercisePlayback(get, label, check, page) {
  const wait = async (root, predicate) => {
    for (let i=0;i<120;i++) {
      if (await root.evaluate(predicate)) return;
      await new Promise(resolve => setTimeout(resolve,25));
    }
    throw new Error(label + ' preview playback did not reach the expected frame');
  };
  const finished = root => root.getAnimations({subtree:true}).length > 0 && root.getAnimations({subtree:true}).every(a=>a.playState === 'finished');
  const started = root => root.getAnimations({subtree:true}).some(a=>a.playState === 'running' && a.currentTime < a.effect.getComputedTiming().endTime);
  for (const id of ['fade-up','stagger','split-text','mask-reveal']) {
    const root = await get(id);
    await wait(root, finished);
    await wait(root, started);
    const sample = () => root.evaluate(n => [...n.querySelectorAll('*')].map(el => {
      const s = getComputedStyle(el); return [s.opacity,s.transform,s.clipPath];
    }));
    const before = await sample();
    await new Promise(resolve => setTimeout(resolve,100));
    check(label + ' ' + id + ' preview visibly repeats after its first entrance', JSON.stringify(before) !== JSON.stringify(await sample()));
  }
  const root = await get('fade-up', true);
  const toggle = page.locator('[data-motion-item-pause="fade-up"]');
  await wait(root, finished);
  await toggle.click();
  await root.evaluate(n => new Promise(resolve => {
    if(n.ownerDocument.documentElement.hasAttribute('data-paused'))return resolve();
    const observer = new MutationObserver(()=>{if(n.ownerDocument.documentElement.hasAttribute('data-paused')){observer.disconnect();resolve();}});
    observer.observe(n.ownerDocument.documentElement,{attributes:true});
  }));
  await toggle.click();
  await wait(root, started);
  check(label + ' play restarts a completed entrance', true);
  await toggle.click();
  await wait(root, n => n.getAnimations({subtree:true}).every(a => a.playState === 'paused'));
  const time = () => root.evaluate(n => n.getAnimations({subtree:true})[0].currentTime);
  const pausedAt = await time();
  await new Promise(resolve => setTimeout(resolve,300));
  check(label + ' preview pause actually freezes animation time', await time() === pausedAt);
  await toggle.click();
  await page.locator('[data-motion-frame="marquee"]').scrollIntoViewIfNeeded();
  await wait(root, n => n.ownerDocument.documentElement.hasAttribute('data-paused') && n.getAnimations({subtree:true}).every(a => !a.pending));
  const offscreenAt = await time();
  await new Promise(resolve => setTimeout(resolve,1600));
  check(label + ' offscreen preview stays frozen through the repeat interval', await time() === offscreenAt);
  await page.locator('[data-motion-frame="fade-up"]').scrollIntoViewIfNeeded();
  await page.emulateMedia({reducedMotion:'reduce'});
  await wait(root, n => n.getAnimations({subtree:true}).length === 0);
  await new Promise(resolve => setTimeout(resolve,1600));
  check(label + ' automatic repeat stays off with reduced motion', await root.evaluate(n => n.getAnimations({subtree:true}).length === 0));
  await page.emulateMedia({reducedMotion:'no-preference'});
};
