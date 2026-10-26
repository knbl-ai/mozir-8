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
// SYMBOL's 360-view orbit (one view a degree): every 10th view, with each view's sky colour for the band above the tower
const readTower = (): { frames: string[]; skies: string[] } => {
 const manifest = path.join(process.cwd(), 'public/projects/symbol/orbit-s12-360/frames.json');
 if (!fs.existsSync(manifest)) return { frames: [], skies: [] };
 const views = (JSON.parse(fs.readFileSync(manifest, 'utf8')) as { frames: { src: string; sky?: string }[] }).frames.filter((_, i) => i % 10 === 0);
 return { frames: views.map(v => v.src), skies: views.map(v => v.sky ?? '#8aa7c6') };
};
export default function Page() {
 // The display face sets the first screen: fetch it with the HTML, not after the CSS.
 preload('/fonts/archivo-var-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
 return <Home buildingFrames={everySecond(readFrames('building-preview'))} penthouseFrames={everySecond(readFrames('afk-urban-comfort'))} heritageFrames={everySecond(readFrames('borges-15'))} spinFrames={readSpin()} tower={readTower()} />;
}
