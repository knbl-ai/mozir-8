import type { Metadata } from 'next';
import HayarkonSite from '@/components/hayarkon/HayarkonSite';
// The interior-design edition of Hayarkon 56, apartment 2. The pipeline's sales page stays at /hayarkon-56-apt-2.
export const metadata: Metadata = {
 title: 'Hayarkon 56 · A gallery home in teak, limestone and one blue',
 description: 'Apartment 2 at HaYarkon 56, Tel Aviv (Noga Group): six materials, seven rooms, the walkthrough film and a 3D model, by residence.tech.',
 openGraph: { title: 'Hayarkon 56 · Tel Aviv', description: 'A gallery home in teak, limestone and one blue.', images: ['/projects/hayarkon-56/living-m.webp'] },
};
export default function Page() { return <HayarkonSite />; }
