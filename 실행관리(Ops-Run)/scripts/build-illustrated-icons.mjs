import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'assets/icons/illustrated');
const manifest = JSON.parse(await fs.readFile(path.join(dir, 'manifest.json'), 'utf8'));
const seen = new Set(), entries = new Set();
const cachePath = path.join(root, 'test-results/illustrated-icons/build-cache.json');
let cache = {};
try { cache = JSON.parse(await fs.readFile(cachePath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT' && !(error instanceof SyntaxError)) throw error; }
const nextCache = {}, builder = await fs.readFile(fileURLToPath(import.meta.url));
let pngBytes = 0, webpBytes = 0, generated = 0, reused = 0;
// Generation is separate: this command only slices the approved sheet and encodes delivery sizes.
for (const batch of manifest.batches) {
  if (!Number.isInteger(batch.columns) || batch.columns < 1 || !Number.isInteger(batch.rows) || batch.rows < 1 || batch.icons.length !== batch.columns * batch.rows) throw new Error('Invalid sheet grid');
  const source = path.join(dir, batch.source);
  const sourceBytes = await fs.readFile(source);
  const batchHash = createHash('sha256').update(builder).update(sourceBytes).update(JSON.stringify(batch)).update(JSON.stringify(sharp.versions)).digest('hex');
  const { width, height } = await sharp(source).metadata();
  const grid = batch.crop || { left: 0, top: 0, width, height };
  if (Object.values(grid).some(n => !Number.isInteger(n)) || grid.left < 0 || grid.top < 0 || grid.width < 1 || grid.height < 1 || grid.left + grid.width > width || grid.top + grid.height > height) throw new Error('Grid crop exceeds source');
  if (Math.abs(grid.width / batch.columns - grid.height / batch.rows) > 1) throw new Error('Icon cells must be square');
  for (const [index, item] of batch.icons.entries()) {
    if (item === null) continue;
    if (!/^[a-z][a-z0-9-]*$/.test(item.name) || seen.has(item.name) || entries.has(item.entry)) throw new Error('Duplicate or invalid icon: ' + item.name);
    seen.add(item.name); entries.add(item.entry);
    const paths = ['.png', '.webp', '-192.webp'].map(ext => path.join(dir, item.name + ext));
    if (cache[item.name] === batchHash) {
      const existing = await Promise.all(paths.map(file => fs.stat(file).catch(error => { if (error.code === 'ENOENT') return null; throw error; })));
      if (existing.every(stat => stat?.size > 0)) {
        pngBytes += existing[0].size; webpBytes += existing[2].size; reused++;
        nextCache[item.name] = batchHash;
        continue;
      }
    }
    const col = index % batch.columns, row = Math.floor(index / batch.columns);
    const x = Math.round(col * grid.width / batch.columns), y = Math.round(row * grid.height / batch.rows);
    const region = item.crop ? {...item.crop} : { left: grid.left + x, top: grid.top + y, width: Math.round((col + 1) * grid.width / batch.columns) - x, height: Math.round((row + 1) * grid.height / batch.rows) - y };
    region.left += item.offset?.x || 0;
    region.top += item.offset?.y || 0;
    if (region.left < 0 || region.top < 0 || region.left + region.width > width || region.top + region.height > height) throw new Error('Icon crop exceeds source: ' + item.name);
    const background={r:255,g:255,b:255,alpha:0};
    let tile = sharp(source).extract(region).resize(batch.normalized?384:512, batch.normalized?384:512, { fit: 'contain', background });
    if(batch.normalized)tile=tile.extend({top:64,bottom:64,left:64,right:64,background});
    const buffer=await tile.png().toBuffer();
    await fs.writeFile(paths[0],buffer);
    const png={size:buffer.length};
    const [webp,thumb]=await Promise.all([
      sharp(buffer).webp({quality:88,effort:4}).toFile(paths[1]),
      sharp(buffer).resize(192,192).webp({quality:85,effort:4}).toFile(paths[2])
    ]);
    pngBytes += png.size; webpBytes += thumb.size;
    generated++; nextCache[item.name] = batchHash;
    console.log(`${item.name}: PNG ${png.size} B · WebP ${webp.size} B · thumbnail ${thumb.size} B`);
  }
}
await fs.mkdir(path.dirname(cachePath), { recursive: true });
await fs.writeFile(cachePath, JSON.stringify(nextCache, null, 2) + '\n');
console.log(`${seen.size} icons · generated ${generated}, reused ${reused} · PNG downloads ${pngBytes} B · gallery thumbnails ${webpBytes} B`);
