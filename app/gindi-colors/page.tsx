import type { Metadata } from 'next';
import GindiSite from '@/components/gindi/GindiSite';
export const metadata: Metadata = {
 title: 'Gindi Colors — The new neighbourhood in Kiryat HaSharon',
 description: 'Four towers by Gindi Holdings in Kiryat HaSharon, Netanya. Choose a building, a floor and your home: plans, interiors and outlooks for every residence.',
 openGraph: { title: 'Gindi Colors · Kiryat HaSharon', description: 'Choose a building, a floor and your home.', images: ['/projects/gindi-colors/orbit/complex/000.webp'] },
};
export default function Page() { return <GindiSite />; }
