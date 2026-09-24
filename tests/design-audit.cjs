const { chromium } = require('playwright-core');
const fs = require('node:fs');
const path = require('node:path');
const output = path.resolve(__dirname, '../test-results');
const origin = 'http://127.0.0.1:4173';
const routes = [
  '/patterns', '/patterns?style=ink', '/patterns?style=block', '/patterns?style=landscape',
  '/patterns?q=zzzz', '/saved', '/styles', '/patterns?detail=toast&style=ink',
  '/components', '/components?category=module', '/dictionary', '/dictionary?category=ICO',
  '/dictionary?category=TOK&detail=TOK-01', '/docs?doc=definition', '/docs?doc=guide'
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const checks = [];
  try {
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 1080 });
      for (const route of routes) {
        await page.goto(`${origin}#${route}`);
        await page.reload();
        if (route.startsWith('/docs')) await page.locator('.document-body').waitFor();
        await page.evaluate(() => document.fonts.ready);
        const result = await page.evaluate(() => {
          const findings = [];
          const root = document.querySelector('dialog[open]') || document.body;
          const visible = el => {
            const s = getComputedStyle(el), r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && !el.closest('[hidden]');
          };
          const controls = [...root.querySelectorAll('button, a, select, input, summary')].filter(visible);
          let minTarget = Infinity;
          for (const el of controls) {
            if (el.classList.contains('skip-link')) continue;
            const r = el.getBoundingClientRect();
            const name = el.getAttribute('aria-label') || el.labels?.[0]?.textContent.trim() || el.textContent.trim();
            if (!name) findings.push({ kind: 'name', target: el.outerHTML.slice(0, 160) });
            // Prose links are inline text, not standalone navigation controls.
            if (el.matches('.document-body a')) continue;
            minTarget = Math.min(minTarget, r.width, r.height);
            if (r.width < 43.5 || r.height < 43.5) findings.push({ kind: 'target', name, width: r.width, height: r.height });
          }
          const rgb = value => (value.match(/[\d.]+/g) || []).map(Number);
          const over = (fg, bg) => fg.slice(0, 3).map((v, i) => v * (fg[3] ?? 1) + bg[i] * (1 - (fg[3] ?? 1)));
          const lum = c => c.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0);
          const contrast = (a, b) => (Math.max(lum(a), lum(b)) + .05) / (Math.min(lum(a), lum(b)) + .05);
          let minTextContrast = Infinity;
          let measuredText = 0;
          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            const node = walker.currentNode, el = node.parentElement;
            if (!node.textContent.trim() || !visible(el) || el.closest('script,style,option,.sr-only,.skip-link')) continue;
            if (el.closest('button:disabled')) continue;
            const s = getComputedStyle(el);
            const chain = []; for (let p = el; p; p = p.parentElement) chain.unshift(p);
            const bg = chain.reduce((c, p) => over(rgb(getComputedStyle(p).backgroundColor), c), [255, 255, 255]);
            const value = contrast(over(rgb(s.color), bg), bg);
            const large = parseFloat(s.fontSize) >= 24 || (parseFloat(s.fontSize) >= 18.66 && Number(s.fontWeight) >= 700);
            measuredText++;
            minTextContrast = Math.min(minTextContrast, value);
            if (value + .01 < (large ? 3 : 4.5)) findings.push({ kind: 'contrast', text: node.textContent.trim().slice(0, 50), value: +value.toFixed(2), class: el.className });
          }
          if (document.documentElement.scrollWidth > innerWidth) findings.push({ kind: 'overflow' });
          return { controls: controls.length, minTarget: +minTarget.toFixed(1), measuredText, minTextContrast: +minTextContrast.toFixed(2), findings };
        });
        checks.push({ width, route, ...result });
        if (route.includes('q=zzzz')) await page.screenshot({ path: path.join(output, `${width}-audit-search-empty.png`), fullPage: true });
      }
      await page.screenshot({ path: path.join(output, `${width}-audit-detail.png`) });
      await page.goto(`${origin}#/saved`);
      await page.screenshot({ path: path.join(output, `${width}-audit-empty.png`), fullPage: true });
    }
    await page.goto(`${origin}#/styles`);
    fs.writeFileSync(path.join(output, 'reading-order.txt'), await page.locator('body').ariaSnapshot());
    // Cold local navigation: diagnostic only; this is not field Core Web Vitals.
    await page.addInitScript(() => {
      window.metrics = { lcp: null, cls: 0, interactions: [] };
      new PerformanceObserver(list => { for (const e of list.getEntries()) window.metrics.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.metrics.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (e.interactionId) window.metrics.interactions.push(e.duration); }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
    });
    await page.goto(`${origin}#/patterns`);
    await page.reload();
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(img => img.decode())); });
    await page.locator('[data-quick-save="tabs"]').click();
    await page.locator('[data-open="toast"]').click();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const metrics = await page.evaluate(() => ({ ...window.metrics, resourceBytes: performance.getEntriesByType('resource').reduce((sum, r) => sum + r.encodedBodySize, 0) }));
    const failures = checks.flatMap(c => c.findings.map(f => ({ width: c.width, route: c.route, ...f })));
    fs.writeFileSync(path.join(output, 'design-audit.json'), JSON.stringify({ checkedAt: new Date().toISOString(), checks, metrics, failures }, null, 2));
    console.log(`${checks.length} routes/viewports; ${failures.length} findings.`);
    console.log(JSON.stringify({ metrics, failures }, null, 2));
    if (failures.length) process.exitCode = 1;
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
