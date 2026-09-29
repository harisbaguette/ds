import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'assets/icons/illustrated');
const production=JSON.parse(await fs.readFile(path.join(dir,'production.json'),'utf8'));
const manifest=JSON.parse(await fs.readFile(path.join(dir,'manifest.json'),'utf8'));
const id=process.argv[2],job=production.jobs.find(j=>j.id===id);
if(!job)throw new Error('Unknown production job: '+id);
if(manifest.batches.some(b=>b.job===id)){console.log(id+' already imported');process.exit(0);}
const source='source/'+id+'.png';
const metadata=await sharp(path.join(dir,source)).metadata();
if(!metadata.hasAlpha)throw new Error(id+': source needs a transparent background');
const {data,info}=await sharp(path.join(dir,source)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const w=info.width,h=info.height;
if(w!==h)throw new Error(id+': source must be square');
const seen=new Uint8Array(w*h),queue=new Int32Array(w*h),bounds=Array(9).fill(null);
// Alpha geometry only locates/crops the generated objects; meaning and style are reviewed on the source sheet.
for(let start=0;start<w*h;start++){
  if(seen[start]||data[start*4+3]<180)continue;
  let head=0,tail=1,x0=w,y0=h,x1=0,y1=0;queue[0]=start;seen[start]=1;
  while(head<tail){
    const p=queue[head++],x=p%w,y=Math.floor(p/w);
    x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);
    for(const next of [x>0?p-1:-1,x<w-1?p+1:-1,y>0?p-w:-1,y<h-1?p+w:-1]){
      if(next>=0&&!seen[next]&&data[next*4+3]>=180){seen[next]=1;queue[tail++]=next;}
    }
  }
  if(tail<Math.max(24,w*h/60000))continue;
  const col=Math.min(2,Math.floor(((x0+x1)/2)/w*3)),row=Math.min(2,Math.floor(((y0+y1)/2)/h*3)),index=row*3+col;
  const old=bounds[index];
  bounds[index]=old?{x0:Math.min(old.x0,x0),y0:Math.min(old.y0,y0),x1:Math.max(old.x1,x1),y1:Math.max(old.y1,y1)}:{x0,y0,x1,y1};
}
const icons=job.icons.map((item,i)=>{
  const b=bounds[i];
  if(!b||b.x1-b.x0>w*.34||b.y1-b.y0>h*.34)throw new Error(id+' cell '+(i+1)+': missing or overlapping silhouette; inspect the sheet');
  const left=Math.max(0,b.x0-3),top=Math.max(0,b.y0-3);
  return {entry:item.entry,name:item.name,crop:{left,top,width:Math.min(w,b.x1+4)-left,height:Math.min(h,b.y1+4)-top}};
});
manifest.batches.push({job:id,source,columns:3,rows:3,normalized:true,icons});
manifest.aliases||={};
for(const item of job.icons)for(const alias of item.aliases)manifest.aliases[alias]=item.entry;
job.status='imported';
await fs.writeFile(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
await fs.writeFile(path.join(dir,'production.json'),JSON.stringify(production,null,2)+'\n');
console.log(id+': '+icons.length+' cropped icons imported');
