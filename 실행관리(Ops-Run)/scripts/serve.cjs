const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const { promisify } = require('node:util');
const gzip = promisify(zlib.gzip);
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 4173);
const service = import('./lib/illustration-http.mjs');
const types = { '.html':'text/html', '.json':'application/json', '.jsx':'text/plain', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.md':'text/plain', '.pdf':'application/pdf', '.woff2':'font/woff2' };
const publicRoots = ['assets','src','문서','시안','영감보관함'].map(folder=>path.join(root,folder));
const evidenceRoot = path.join(root,'test-results');
const escape = value=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const compressed = new Map();
function privateAsset(target) {
  const relative=path.relative(root,target).split(path.sep).join('/');
  return /^assets\/icons\/(?:objects(?:\/|$)|illustrated\/(?:source(?:\/|$)|(?:production|manifest)\.json$))/.test(relative);
}
function allowed(target) {
  if(privateAsset(target))return false;
  return target===path.join(root,'index.html')||publicRoots.some(folder=>target===folder||target.startsWith(folder+path.sep))||(target.startsWith(evidenceRoot+path.sep)&&/\.(?:png|jpg|jpeg|webp|svg)$/i.test(target));
}
async function handle(req,res) {
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','same-origin');
  const hosts=new Set(['127.0.0.1:'+port,'localhost:'+port]);
  if(!hosts.has(req.headers.host)){res.writeHead(403);res.end('Invalid host');return;}
  if(req.headers.origin&&!['http://127.0.0.1:'+port,'http://localhost:'+port].includes(req.headers.origin)){res.writeHead(403);res.end('Invalid origin');return;}
  if(req.url.length>16000){res.writeHead(414);res.end();return;}
  let url,pathname;
  try{url=new URL(req.url,'http://127.0.0.1:'+port);pathname=decodeURIComponent(url.pathname);if(pathname.includes('\0')||pathname.split('/').some(p=>p.startsWith('.')))throw Error();}
  catch{res.writeHead(400);res.end();return;}
  if(pathname==='/__pattove/status'){
    res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
    res.end(JSON.stringify({app:'pattove-shell',root,pid:process.pid}));return;
  }
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}
  if(await (await service).handleIllustrations(req,res,url))return;
  if(/^\/assets\/icons\/(?:objects|illustrated\/(?:source|production\.json|manifest\.json))\b/.test(pathname)){res.writeHead(404);res.end();return;}
  if(pathname==='/')pathname='/index.html';
  let target=path.resolve(root,pathname.slice(1));
  if(!allowed(target)){res.writeHead(404);res.end();return;}
  let stat=await fs.promises.stat(target),real=await fs.promises.realpath(target);
  if(!allowed(real)){res.writeHead(403);res.end();return;}
  if(stat.isDirectory()){
    const index=path.join(target,'index.html');
    try{stat=await fs.promises.stat(index);target=index;if(!allowed(await fs.promises.realpath(index)))throw Error('Invalid path');}
    catch(error){
      if(error.code!=='ENOENT')throw error;
      const items=fs.readdirSync(target,{withFileTypes:true}).filter(e=>!e.name.startsWith('.')&&!privateAsset(path.join(target,e.name))).map(entry=>{
        const href='/'+path.relative(root,path.join(target,entry.name)).split(path.sep).map(encodeURIComponent).join('/');
        return '<li><a class="ds-tab" href="'+href+'">'+escape(entry.name)+(entry.isDirectory()?'/':'')+'</a></li>';
      }).join('');
      const styles=[...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map(([,href])=>'<link rel="stylesheet" href="/'+href+'">').join('');
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
      res.end('<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>'+escape(path.basename(target))+'</title>'+styles+'<body class="ds theme-main"><main class="directory"><a class="ds-button" data-variant="outline" href="/">처음으로</a><h1>'+escape(path.basename(target))+'</h1><ul>'+items+'</ul></main></body></html>');return;
    }
  }
  const useGzip=/\bgzip\b/.test(req.headers['accept-encoding']||'')&&/\.(?:html|js|json|css|md)$/.test(target)&&stat.size>1024;
  const etag='W/"'+stat.size.toString(16)+'-'+Math.floor(stat.mtimeMs).toString(16)+(useGzip?'-gzip':'')+'"';
  const headers={'Cache-Control':'no-cache',ETag:etag,Vary:'Accept-Encoding'};
  if(req.headers['if-none-match']===etag){res.writeHead(304,headers);res.end();return;}
  let content;
  if(useGzip){
    const key=target+etag;
    if(!compressed.has(key)){if(compressed.size>20)compressed.clear();compressed.set(key,await gzip(await fs.promises.readFile(target)));}
    content=compressed.get(key);headers['Content-Encoding']='gzip';
  }else content=await fs.promises.readFile(target);
  res.writeHead(200,{...headers,'Content-Type':types[path.extname(target)]||'application/octet-stream','Content-Length':content.length});
  res.end(req.method==='HEAD'?undefined:content);
}
const server=http.createServer((req,res)=>{handle(req,res).catch(error=>{
  if(res.headersSent){res.destroy();return;}
  const status=error.status||(error.code==='ENOENT'?404:500);
  res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
  res.end(JSON.stringify({error:status===500?'Asset service error':error.code==='ENOENT'?'Not found':error.message}));
  if(status===500)console.error(error);
});});
server.on('error',error=>{
  const logDirectory=path.join(root,'logs');fs.mkdirSync(logDirectory,{recursive:true});
  fs.appendFileSync(path.join(logDirectory,'server.log'),new Date().toISOString()+' '+(error.stack||error)+'\n');
  console.error(error.message);process.exitCode=1;
});
server.listen(port,'127.0.0.1',()=>console.log('패토브 http://127.0.0.1:'+port));
