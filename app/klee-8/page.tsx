import type { Metadata } from 'next';
import KleeSite from '@/components/klee/KleeSite';
export const metadata: Metadata = {
 title: 'N°8 KLEE — New North, Tel Aviv · RE/MAX Ocean',
 description: 'A boutique building on Klee Street, Tel Aviv: step inside a two-room, a three-room and a garden duplex — films, plans, images and 3D.',
 openGraph: { title: 'N°8 KLEE · New North, Tel Aviv', description: 'Three homes, three ways to live.', images: ['/projects/klee-8/media/apt-3/v-garden.webp'] },
};
export default function Page() { return <KleeSite />; }
