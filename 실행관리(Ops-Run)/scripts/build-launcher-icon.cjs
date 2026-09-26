// Convert the existing brand SVG to a Windows icon without changing its design.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright-core');
const root = path.resolve(__dirname, '..');
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 256, height: 256 } });
    await page.setContent('<style>html,body{margin:0;background:transparent}svg{display:block;width:256px;height:256px}</style>' + fs.readFileSync(path.join(root, 'assets/mark.svg'), 'utf8'));
    const png = await page.screenshot({ omitBackground: true });
    const header = Buffer.alloc(22);
    header.writeUInt16LE(1, 2); // Icon type.
    header.writeUInt16LE(1, 4); // One 256x256 PNG entry (zero dimension bytes mean 256).
    header.writeUInt16LE(1, 10);
    header.writeUInt16LE(32, 12);
    header.writeUInt32LE(png.length, 14);
    header.writeUInt32LE(22, 18);
    fs.writeFileSync(path.join(root, 'assets/mark.ico'), Buffer.concat([header, png]));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
