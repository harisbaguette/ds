const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html', '.json': 'application/json', '.jsx': 'text/plain', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.md': 'text/plain', '.pdf': 'application/pdf', '.zip': 'application/zip', '.woff2': 'font/woff2' };
const publicRoots = ['assets', 'src', '문서', '시안', '영감보관함'].map(folder => path.join(root, folder));
const evidenceRoot = path.join(root, 'test-results');
const escape = value => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end(); return; }
  if (pathname === '/__pattove/status') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ app: 'pattove-shell', root, pid: process.pid }));
    return;
  }
  if (pathname === '/') pathname = '/index.html';
  const relative = pathname.slice(1);
  let target = path.resolve(root, relative);
  const allowed = target === path.join(root, 'index.html')
    || publicRoots.some(folder => target === folder || target.startsWith(folder + path.sep))
    || (target.startsWith(evidenceRoot + path.sep) && /\.(?:png|jpg|jpeg|webp|svg)$/i.test(target));
  if (!allowed) { res.writeHead(404); res.end(); return; }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    const index = path.join(target, 'index.html');
    if (fs.existsSync(index)) target = index;
    else {
      const items = fs.readdirSync(target, { withFileTypes: true }).map(entry => {
        const href = '/' + path.relative(root, path.join(target, entry.name)).split(path.sep).map(encodeURIComponent).join('/');
        return `<li><a href="${href}">${escape(entry.name)}${entry.isDirectory() ? '/' : ''}</a></li>`;
      }).join('');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escape(path.basename(target))}</title><style>body{font:16px/1.7 system-ui;max-width:900px;margin:40px auto;padding:0 20px}h1{font-size:18px}a{color:#284ceb}li{padding:8px 0;overflow-wrap:anywhere}</style><a href="/#/docs">문서로 돌아가기</a><h1>${escape(path.basename(target))}</h1><ul>${items}</ul></html>`);
      return;
    }
  }
  fs.readFile(target, (error, content) => {
    if (error) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': `${types[path.extname(target)] || 'application/octet-stream'}; charset=utf-8`, 'Cache-Control': 'no-store' });
    res.end(content);
  });
});
server.on('error', error => {
  const logDirectory = path.join(root, 'logs');
  fs.mkdirSync(logDirectory, { recursive: true });
  fs.appendFileSync(path.join(logDirectory, 'server.log'), `${new Date().toISOString()} ${error.stack || error}\n`);
  console.error(error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`패토브 http://127.0.0.1:${port}`));
