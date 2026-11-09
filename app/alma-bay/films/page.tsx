import type { Metadata } from 'next';
import StyleHub from '@/components/films/StyleHub';

// Unlisted until approved: not on / or /projects, not indexed.
export const metadata: Metadata = {
 title: 'Alma Bay · Residence 01 — choose a film style',
 description: 'One home, three films: Riviera Editorial, Monograph and Sunday House.',
 robots: { index: false, follow: false, nocache: true },
 openGraph: { title: 'Alma Bay · Residence 01 — three films', description: 'One home, three visual languages.', images: ['/projects/shirat-hayam/highlights/hero-poster.jpg'] },
};

export default function Page() { return <StyleHub />; }
