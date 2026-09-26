import fs from 'node:fs';
import path from 'node:path';
import type { BuildingFrame } from '@/content/projects';
import DemoHome from '@/components/landing/DemoHome';

// Every second frame of the Sales Gallery's building is enough for the preview's turn.
export default function Home() {
 const manifest = path.join(process.cwd(), 'public/projects/building-preview/building/frames.json');
 const frames: BuildingFrame[] = fs.existsSync(manifest) ? JSON.parse(fs.readFileSync(manifest, 'utf8')) : [];
 return <DemoHome buildingFrames={frames.filter((_, i) => i % 2 === 0).map(f => f.src)} />;
}
