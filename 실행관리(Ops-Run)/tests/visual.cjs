const { chromium } = require('playwright-core');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const fs = require('node:fs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'test-results', 'visual');
const url = pathToFileURL(path.join(root, 'index.html')).href;
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const checks = [];
  const failures = [];
  const ready = () => page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].filter(img => !img.closest('details:not([open])')).map(img => img.decode().catch(() => {})));
  });
  async function inspect(name, selector) {
    await ready();
    const problems = await page.locator(selector).evaluateAll(frames => {
      const out = [];
      for (const frame of frames) {
        const bounds = frame.getBoundingClientRect();
        for (const child of frame.querySelectorAll('.sample, .sample > *, .style-clock, .style-start, .style-form-result, .style-task, .style-collection, .sample-toast, .component-sheet > section')) {
          const r = child.getBoundingClientRect();
          if (!r.width || !r.height) continue;
          if (r.left < bounds.left - 1 || r.right > bounds.right + 1 || r.top < bounds.top - 1 || r.bottom > bounds.bottom + 1) {
            out.push(`${frame.className}: ${child.className} clipped`);
          }
        }
        if (frame.scrollWidth > frame.clientWidth + 1) out.push(`${frame.className}: horizontal overflow`);
        const banner = frame.querySelector('.sea-banner');
        const body = frame.querySelector('.style-example-body');
        if (banner && body && banner.getBoundingClientRect().bottom > body.getBoundingClientRect().top + 1) {
          out.push(`${frame.className}: illustration covers form`);
        }
        const subject = frame.querySelector('.focus-subject');
        const start = frame.querySelector('.style-start');
        const coverScale = parseFloat(getComputedStyle(frame.querySelector('.style-example') || frame).zoom) || 1;
        if (subject && start && start.getBoundingClientRect().top - subject.getBoundingClientRect().bottom < 8 * coverScale) {
          out.push(`${frame.className}: focus text crowds start action`);
        }
      }
      if (document.documentElement.scrollWidth > innerWidth) out.push('page overflow');
      if ([...document.images].filter(img => !img.closest('details:not([open])')).some(img => !img.complete || !img.naturalWidth)) out.push('image missing');
      const icons = [...document.querySelectorAll('svg.ui-icon')];
      if (!icons.length || icons.some(icon => !icon.querySelector('path, circle, rect, polyline, line, polygon'))) out.push('icon artwork missing');
      for (const family of ['Pretendard', 'Outfit']) {
        if (![...document.fonts].some(font => font.family === family && font.status === 'loaded')) out.push(`${family}: font missing`);
      }
      if ([...document.querySelectorAll('.sample')].some(el => getComputedStyle(el).transform !== 'none')) out.push('scaled miniature');
      return out;
    });
    checks.push({ name, problems });
    failures.push(...problems.map(problem => `${name}: ${problem}`));
  }
  const shot = async name => {
    await page.mouse.move(0, 0);
    return page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true });
  };
  try {
    for (const width of [320, 375, 768, 1101, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1080 });
      for (const style of ['main']) {
        await page.goto(`${url}#/patterns?style=${style}`);
        await inspect(`${width} patterns ${style}`, '.pattern-card .preview');
        if (width === 1440 && style !== 'base') await shot(`${width}-patterns-${style}`);
      }
      await page.locator('.brand').click();
      await inspect(`${width} styles`, '.specimen');
      if ([375, 1440].includes(width)) await shot(`${width}-styles`);
    }
    fs.writeFileSync(path.join(output, 'checks.json'), JSON.stringify({ checkedAt: new Date().toISOString(), checks, failures }, null, 2));
    console.log(`${checks.length} visual layouts inspected. ${failures.length} failures.`);
    if (failures.length) { console.log(failures.join('\n')); process.exitCode = 1; }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
