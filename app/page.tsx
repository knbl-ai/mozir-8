import fs from 'node:fs';
import path from 'node:path';
import type { BuildingFrame } from '@/content/projects';
import DemoHome from '@/components/landing/DemoHome';

// Every second frame of the Sales Gallery's building is enough for the preview's turn.
const readFrames = (project: string): BuildingFrame[] => {
 const manifest = path.join(process.cwd(), 'public/projects', project, 'building/frames.json');
 return fs.existsSync(manifest) ? JSON.parse(fs.readFileSync(manifest, 'utf8')) : [];
};
const everySecond = (frames: BuildingFrame[]) => frames.filter((_, i) => i % 2 === 0).map(f => f.src);
// Gindi Colors: its complex ring (orbit/complex.json), every second frame.
const readComplex = (): string[] => {
 const manifest = path.join(process.cwd(), 'public/projects/gindi-colors/orbit/complex.json');
 return fs.existsSync(manifest) ? (JSON.parse(fs.readFileSync(manifest, 'utf8')).frames as { src: string }[]).filter((_, i) => i % 2 === 0).map(f => f.src) : [];
};
export default function Home() {
 return <DemoHome buildingFrames={everySecond(readFrames('building-preview'))} penthouseFrames={everySecond(readFrames('afk-urban-comfort'))} complexFrames={readComplex()} />;
}
