import type { Metadata } from 'next';
import ShiratSite from '@/components/shirat/ShiratSite';
export const metadata: Metadata = {
 title: 'Alma Bay · Orelia',
 description: 'Two 32-storey towers by Orelia on the cliff above the southern beaches. Turn the towers in 360° and choose any of the 215 residences.',
 openGraph: { title: 'Alma Bay', description: 'Turn the towers and choose your residence.', images: ['/projects/shirat-hayam/orbit-s12/000.webp'] },
};
export default function Page() { return <ShiratSite />; }
