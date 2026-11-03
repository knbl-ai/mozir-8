import type { Metadata } from 'next';
import { Assistant, Rubik } from 'next/font/google';
import LodSite from '@/components/lod/LodSite';

// Brand type (public/brand/lod/BRAND.md): Rubik for display, Assistant (the architect's deck face) for text.
const rubik = Rubik({ subsets: ['hebrew', 'latin'], weight: ['500', '700'], variable: '--font-rubik', display: 'swap' });
const assistant = Assistant({ subsets: ['hebrew', 'latin'], weight: ['400', '600', '700'], variable: '--font-assistant', display: 'swap' });

// Unlisted until the client approves it: not on / or /projects, not indexed.
export const metadata: Metadata = {
 title: 'מעון יום שיקומי · לוד · מגרש 4008',
 description: 'A municipal rehabilitative day care for children aged 0–3 in Lod: six classes, a therapy wing and a yard for every class. Kalkalit Lod tender for operators.',
 robots: { index: false, follow: false },
 openGraph: { title: 'מעון יום שיקומי · לוד', description: 'Six classes, ages 0–3 · Kalkalit Lod', images: ['/projects/lod-daycare/placeholders/street-entrance.webp'] },
};

export default function Page() {
 return <div className={`${rubik.variable} ${assistant.variable}`}><LodSite /></div>;
}
