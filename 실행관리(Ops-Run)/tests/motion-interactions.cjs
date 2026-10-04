const assert = require('node:assert/strict');
// The same behavioral checks run against sandboxed previews and exported consumers.
exports.exercise = async function exercise(get, label, check, page) {
  const settle = async root => {
    for(let i=0;i<80;i++) {
      if(await root.evaluate(n=>n.getAnimations({subtree:true}).every(a=>a.effect.getTiming().iterations===Infinity||['finished','idle','paused'].includes(a.playState))))return;
      await new Promise(resolve=>setTimeout(resolve,30));
    }
    throw new Error(label+' finite animations did not settle');
  };
  let root = await get('accordion');
  const toggle = root.locator('[data-toggle]');
  await toggle.click();
  await root.locator('[data-panel]').waitFor({state:'visible'});
  // Inject repeat activation before the animation ends; waiting for stability would miss this case.
  await toggle.evaluate(button=>{button.click();button.click();});
  check(label+' accordion reverses during transition', await toggle.getAttribute('aria-expanded')==='true');
  await page.emulateMedia({reducedMotion:'reduce'});
  await settle(root);
  await toggle.click(); await root.locator('[data-panel]').waitFor({state:'hidden'});
  check(label+' reduced accordion still closes', true);
  await page.emulateMedia({reducedMotion:'no-preference'});

  for(const id of ['modal','shared-card']) {
    root=await get(id);
    await root.locator('[data-open]').click();
    await root.locator('dialog').waitFor({state:'visible'});
    await page.keyboard.press('Tab');
    check(label+' '+id+' keeps focus in modal',await root.locator('dialog').evaluate(n=>n.contains(n.ownerDocument.activeElement)));
    await page.keyboard.press('Escape');
    await root.locator('dialog').waitFor({state:'hidden'});
    for(let i=0;i<40;i++) {
      if(await root.locator('[data-open]').evaluate(n=>n===n.ownerDocument.activeElement))break;
      await new Promise(resolve=>setTimeout(resolve,25));
    }
    check(label+' '+id+' restores opener focus',await root.locator('[data-open]').evaluate(n=>n===n.ownerDocument.activeElement));
  }
  for(const id of ['toast','list-change']) {
    root=await get(id); const rows=root.locator('[data-row]'); const count=await rows.count();
    await root.locator('[data-add]').click();
    check(label+' '+id+' inserts',await rows.count()===count+1);
    await settle(root);
    await rows.last().locator('[data-remove]').focus();
    await page.keyboard.press('Enter');
    await rows.nth(count).waitFor({state:'detached'});
    check(label+' '+id+' removes and restores focus',await rows.count()===count&&await root.locator('[data-add]').evaluate(n=>n===n.ownerDocument.activeElement));
  }
  root=await get('tabs');
  await root.locator('[role="tab"]').first().focus();await page.keyboard.press('ArrowRight');
  check(label+' tabs arrow navigation',await root.locator('[role="tab"]').nth(1).getAttribute('aria-selected')==='true'&&await root.locator('[role="tabpanel"]:visible').count()===1);
  await page.keyboard.press('End');
  check(label+' tabs End navigation',await root.locator('[role="tab"]').last().getAttribute('aria-selected')==='true');

  root=await get('save-state');
  await root.locator('[data-outcome]').selectOption('success');await root.locator('[data-save]').click();
  check(label+' save announces pending',await root.locator('[data-save]').getAttribute('aria-busy')==='true');
  await root.locator('[data-save][data-state="success"]').waitFor();
  await settle(root);
  await root.locator('[data-outcome]').selectOption('error');await root.locator('[data-save]').click();
  await root.locator('[data-save][data-state="error"]').waitFor();
  check(label+' save failure offers retry',(await root.locator('[data-status]').textContent()).includes('다시 시도'));

  root=await get('checkmark');await root.locator('[data-complete]').click();
  check(label+' completed SVG and text remain',await root.locator('[data-check]').evaluate(n=>parseFloat(n.style.strokeDashoffset)===0)&&(await root.locator('[data-status]').textContent()).includes('완료'));
  root=await get('typewriter');await root.locator('[data-skip]').click();
  check(label+' typewriter skip preserves graphemes',await root.locator('[data-output]').textContent()==='오늘도, 당신의 속도로 🌿');
  await page.emulateMedia({reducedMotion:'reduce'});
  root=await get('count-up');await root.locator('[data-start]').click();
  check(label+' count up reduced final value',await root.locator('[data-output]').textContent()==='1,280.5');
  await page.emulateMedia({reducedMotion:'no-preference'});

  root=await get('sort-list');
  const original=await root.locator('[data-sort-row]').evaluateAll(ns=>ns.map(n=>n.dataset.name));
  await root.locator('[data-sort-row]').first().locator('[data-move="1"]').click();
  check(label+' accessible reorder',await root.locator('[data-sort-row]').nth(1).getAttribute('data-name')===original[0]);
  await settle(root);
  await root.locator('[data-sort-row]').nth(1).locator('[data-move="-1"]').click();
  await settle(root);
  await root.locator('[data-drag-handle]').first().scrollIntoViewIfNeeded();
  // Wait for layout motion to settle before measuring the drag target.
  await settle(root);
  const handle=root.locator('[data-drag-handle]').first();const start=await handle.boundingBox();const end=await root.locator('[data-sort-row]').last().boundingBox();
  await page.mouse.move(start.x+start.width/2,start.y+start.height/2);await page.mouse.down();await page.mouse.move(start.x+start.width/2,end.y+end.height/2,{steps:8});await page.mouse.up();
  check(label+' pointer reorder',await root.locator('[data-sort-row]').last().getAttribute('data-name')===original[0]);

  root=await get('reading-progress');
  await root.locator('[data-scroller]').evaluate(n=>{n.scrollTop=n.scrollHeight;n.dispatchEvent(new Event('scroll'));});
  check(label+' scroll progress reaches end',await root.locator('[role="progressbar"]').getAttribute('aria-valuenow')==='100');
  root=await get('parallax');await page.emulateMedia({reducedMotion:'reduce'});
  // The browser dispatches matchMedia change asynchronously after emulation is applied.
  for(let i=0;i<40&&await root.getAttribute('data-motion-still')===null;i++)await new Promise(resolve=>setTimeout(resolve,25));
  await root.locator('[data-scroller]').evaluate(n=>{n.scrollTop=180;n.dispatchEvent(new Event('scroll'));});
  check(label+' parallax disabled while scrolling remains',await root.locator('[data-parallax]').evaluate(n=>n.ownerDocument.defaultView.getComputedStyle(n).transform==='none'));
  await page.emulateMedia({reducedMotion:'no-preference'});

  for(const id of ['marquee','border-beam','motion-path','connection-beam','gradient-text']) {
    root=await get(id);await root.locator('.pm-pause').check();
    check(label+' '+id+' exported pause works',await root.evaluate(n=>[...n.querySelectorAll('*')].every(el=>{const s=el.ownerDocument.defaultView.getComputedStyle(el);return s.animationName==='none'||s.animationPlayState==='paused';})));
    await root.locator('.pm-pause').uncheck();
  }
  console.log(label+' interaction checks passed');
};
