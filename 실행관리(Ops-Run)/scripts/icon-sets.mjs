import fs from 'node:fs';
import path from 'node:path';
// The installed icon packages, in precedence order. A later set's glyph is left out when an earlier set already has that name
// (Material names use "_" where the others use "-"), so every picture is listed once and the catalog is fixed by the lock file.
const SETS = [
  {id:'lucide', name:'Lucide', pkg:'lucide-static', dir:'icons', license:'ISC', paint:'stroke', canonical:p=>Object.keys(JSON.parse(fs.readFileSync(path.join(p,'icon-nodes.json'),'utf8')))},
  {id:'tabler', name:'Tabler Icons', pkg:'@tabler/icons', dir:'icons/outline', license:'MIT', paint:'stroke'},
  {id:'phosphor', name:'Phosphor', pkg:'@phosphor-icons/core', dir:'assets/regular', license:'MIT', paint:'fill'},
  {id:'material', name:'Material Symbols', pkg:'@material-symbols/svg-400', dir:'outlined', license:'Apache-2.0', paint:'fill', skip:n=>n.endsWith('-fill')}
];
// Tabler draws an invisible 24×24 box in every file; it carries no picture.
const FRAME = '<path stroke="none" d="M0 0h24v24H0z" fill="none"/>';
const slug = name => name.replace(/_/g,'-');

export function iconSets(root) {
  const taken = new Set(), glyphs = [], sets = [];
  for (const s of SETS) {
    const base = path.join(root,'node_modules',s.pkg), dir = path.join(base,s.dir);
    if (!fs.existsSync(dir)) throw new Error('Icon package missing, run npm install: '+s.pkg);
    const files = fs.readdirSync(dir).filter(f=>f.endsWith('.svg')).map(f=>f.slice(0,-4)).filter(n=>!s.skip?.(n)).sort();
    const names = s.canonical ? s.canonical(base).sort() : files;
    const kept = names.filter(n=>!taken.has(slug(n)));
    for (const n of files) taken.add(slug(n));
    const {version} = JSON.parse(fs.readFileSync(path.join(base,'package.json'),'utf8'));
    let viewBox;
    const symbols = kept.map(n => {
      const svg = fs.readFileSync(path.join(dir,n+'.svg'),'utf8').replace(/<!--[\s\S]*?-->/g,'');
      const box = svg.match(/viewBox="([^"]+)"/)?.[1], body = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1];
      if (!box || body == null) throw new Error('Unreadable icon file: '+s.id+':'+n);
      viewBox = box;
      glyphs.push({key:s.id+':'+n, set:s.id, name:n});
      return '<symbol id="'+n+'" viewBox="'+box+'">'+body.replace(/\s+/g,' ').replace(/>\s+</g,'><').replace(/\s*\/>/g,'/>').trim().replace(FRAME,'')+'</symbol>';
    });
    sets.push({id:s.id, name:s.name, version, license:s.license, paint:s.paint, count:kept.length, viewBox, pkg:s.pkg, symbols});
  }
  return {sets, glyphs};
}

// Sprites and license texts are written next to the page so the browser needs no node_modules.
export function writeSprites(root, sets) {
  const out = path.join(root,'assets/icons/sets');
  fs.mkdirSync(out,{recursive:true});
  for (const s of sets) {
    fs.writeFileSync(path.join(out,s.id+'.svg'),'<svg xmlns="http://www.w3.org/2000/svg">'+s.symbols.join('')+'</svg>\n');
    fs.copyFileSync(path.join(root,'node_modules',s.pkg,'LICENSE'),path.join(out,s.id+'.LICENSE.txt'));
  }
}

// Every installed glyph needs exactly one Korean name and one home icon category, plus at most two more categories it also shows in;
// a package update that adds or drops pictures stops the build here.
export function checkNames(names, glyphs, groupIds) {
  const keys = new Set(glyphs.map(g=>g.key));
  const unnamed = glyphs.filter(g=>!names[g.key]).map(g=>g.key);
  const stale = Object.keys(names).filter(k=>!keys.has(k));
  const alsoOk = (home, also=[]) => Array.isArray(also) && also.length<=2 && new Set([home,...also]).size===also.length+1 && also.every(id=>groupIds.includes(id));
  const invalid = Object.entries(names).filter(([,v])=>!Array.isArray(v)||v.length>3||!String(v[0]||'').trim()||!groupIds.includes(v[1])||!alsoOk(v[1],v[2])).map(([k])=>k);
  const problems = [[unnamed,'installed glyphs without a name'],[stale,'named glyphs no longer installed'],[invalid,'names with an invalid category']]
    .filter(([list])=>list.length).map(([list,what])=>list.length+' '+what+': '+list.slice(0,12).join(', ')+(list.length>12?' …':''));
  if (problems.length) throw new Error('문서/아이콘 그림 분류.json is out of step with the installed icon sets.\n'+problems.join('\n'));
}
