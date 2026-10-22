import type { Metadata } from 'next';
import HabaronApartment from '@/components/habaron/HabaronApartment';

// A direct-link page: nothing links here, and search engines are told to stay out.
export const metadata: Metadata = {
 title: 'The Collector’s Flat · HaBaron Hirsh 1',
 description: 'Apartment 28, HaBaron Hirsh 1, Tel Aviv: film, plan, images and 3D.',
 robots: { index: false, follow: false, nocache: true },
};

export default function Page() { return <HabaronApartment />; }
