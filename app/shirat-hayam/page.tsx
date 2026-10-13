import type { Metadata } from 'next';
import ShiratSite from '@/components/shirat/ShiratSite';
export const metadata: Metadata = {
 title: 'Shirat HaYam · Netanya · BRIGA',
 description: 'Two 32-storey towers by BRIGA on the cliff above Netanya’s southern beaches. Turn the towers in 360° and choose any of the 215 residences.',
 openGraph: { title: 'Shirat HaYam · Netanya', description: 'Turn the towers and choose your residence.', images: ['/projects/shirat-hayam/orbit-s12/000.webp'] },
};
export default function Page() { return <ShiratSite />; }
