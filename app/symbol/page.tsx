import type { Metadata } from 'next';
import SymbolSite from '@/components/symbol/SymbolSite';
// Unlisted until the developer approves it: not on / or /projects, not indexed.
export const metadata: Metadata = {
 title: 'SYMBOL · Givat Shmuel · Levinstein',
 description: 'The Symbol Tower by Levinstein in Givat Shmuel. Turn the tower in 360° and choose any of its residences.',
 robots: { index: false, follow: false },
 openGraph: { title: 'SYMBOL · Givat Shmuel', description: 'Turn the tower and choose your residence.', images: ['/projects/symbol/stills/hero.webp'] },
};
export default function Page() { return <SymbolSite />; }
