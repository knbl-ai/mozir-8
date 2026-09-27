import { notFound } from 'next/navigation';
import fs from 'node:fs';
import path from 'node:path';
import { applyListings, developments, getDevelopment, type BuildingFrame } from '@/content/projects';
import BuildingExplorer from '@/components/building/BuildingExplorer';
import styles from '@/components/building/explorer.module.css';
export function generateStaticParams(){return developments.map(p=>({project:p.id}));}
export async function generateMetadata({params}:{params:Promise<{project:string}>}){const p=getDevelopment((await params).project);return {title:p?`${p.info.address} · ${p.contact.agency}`:'Project',description:p?.description,openGraph:{title:p?.name,images:p?.references.slice(0,1)}};}
export default async function Project({params}:{params:Promise<{project:string}>}){
 const p=getDevelopment((await params).project);if(!p)notFound();
 const manifest=path.join(process.cwd(),'public/projects',p.id,'building/frames.json');
 const frames:BuildingFrame[]=fs.existsSync(manifest)?JSON.parse(fs.readFileSync(manifest,'utf8')):[];
 return <div className={styles.shell}><BuildingExplorer project={p} frames={applyListings(frames,p)}/></div>;
}
