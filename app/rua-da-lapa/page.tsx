import type { Metadata } from 'next';
import LapaSite from '@/components/lapa/LapaSite';
// Unlisted until the developer approves it: not on / or /projects, not indexed.
export const metadata: Metadata = {
 title: 'Rua da Lapa · Porto',
 description: 'Two restored 19th-century town houses on Rua da Lapa, Porto: fifteen homes. Turn the building in 360° and choose any home.',
 robots: { index: false, follow: false },
 openGraph: { title: 'Rua da Lapa · Porto', description: 'Turn the building and choose your home.', images: ['/projects/rua-da-lapa/stills/street.webp'] },
};
export default function Page() { return <LapaSite />; }
