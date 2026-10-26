import type { Metadata } from 'next';
import StylesPage from '@/components/landing/StylesPage';

export const metadata: Metadata = {
 title: 'The style library — residence.tech',
 description: 'Eighteen curated interior design styles. Every apartment gets one, and every room is a variation of it.',
 alternates: { canonical: '/styles' },
};
export default function Page() { return <StylesPage />; }
