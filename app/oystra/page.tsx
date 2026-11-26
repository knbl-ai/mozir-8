import type { Metadata } from 'next';
import OystraSite from '@/components/oystra/OystraSite';
// Signature (luxury) package, first project. In development: unlisted, not on / or /projects, not indexed.
export const metadata: Metadata = {
 title: 'Oystra · Al Marjan Island · Richmind',
 description: 'Oystra by Richmind on Al Marjan Island: four shell-shaped residences by Zaha Hadid Architects. Residence C-905 room by room.',
 robots: { index: false, follow: false },
 openGraph: { title: 'Oystra · Al Marjan Island', description: 'A living masterpiece on the water.', images: ['/projects/oystra/opening/hd-front-night.webp'] },
};
export default function Page() { return <OystraSite />; }
