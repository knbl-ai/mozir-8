import fs from 'node:fs';
import path from 'node:path';
import type { BuildingFrame } from '@/content/projects';
import { preload } from 'react-dom';
import Home from '@/components/landing/Home';

// Every second frame of the Sales Gallery's building is enough for the preview's turn.
const readFrames = (project: string): BuildingFrame[] => {
 const manifest = path.join(process.cwd(), 'public/projects', project, 'building/frames.json');
 return fs.existsSync(manifest) ? JSON.parse(fs.readFileSync(manifest, 'utf8')) : [];
};
const everySecond = (frames: BuildingFrame[]) => frames.filter((_, i) => i % 2 === 0).map(f => f.src);
// The apartment turntable (KLEE apt 2, the baked HQ dollhouse: pipeline/hq/blender/turntable_web.py): 72 frames, 5° apart.
const readSpin = (): string[] => {
 const manifest = path.join(process.cwd(), 'public/landing/spin-apt2/spin.json');
 return fs.existsSync(manifest) ? (JSON.parse(fs.readFileSync(manifest, 'utf8')) as { src: string }[]).map(f => f.src) : [];
};
// Shirat HaYam's 360° orbit (S13: 360 views, 1° apart): every tenth view, 36 views 10° apart like the other building previews.
const readShirat = (): { src: string; sky: string }[] => {
 const manifest = path.join(process.cwd(), 'public/projects/shirat-hayam/orbit-s13-360/frames.json');
 return fs.existsSync(manifest) ? (JSON.parse(fs.readFileSync(manifest, 'utf8')) as { frames: { src: string; sky?: string }[] }).frames.filter((_, i) => i % 10 === 0).map(f => ({ src: f.src, sky: f.sky ?? '#eaebea' })) : [];
};
export default function Page() {
 // The display face sets the first screen: fetch it with the HTML, not after the CSS.
 preload('/fonts/archivo-var-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
 const towers = readShirat();
 return <Home buildingFrames={everySecond(readFrames('building-preview'))} penthouseFrames={everySecond(readFrames('afk-urban-comfort'))} heritageFrames={everySecond(readFrames('borges-15'))} spinFrames={readSpin()} towersFrames={towers.map(f => f.src)} towersSky={towers.map(f => f.sky)} />;
}
