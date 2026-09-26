import type { Metadata } from 'next';
import MozirSite from '@/components/mozir/MozirSite';
export const metadata: Metadata = {
 title: 'Mozir 8 — A quieter kind of Tel Aviv living',
 description: 'Discover Apartment 02 at 8 Yaakov Mozir, Tel Aviv. Explore the garden residence in 3D, watch the residence film and discover the proposed interiors.',
 openGraph: { title: 'Mozir 8 | The Garden Residence', description: 'Space to slow down. Room to live. Apartment 02, Tel Aviv.', images: ['/media/01_living.webp'] },
};
export default function Page() { return <MozirSite />; }
