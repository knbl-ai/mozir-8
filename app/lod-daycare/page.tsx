import type { Metadata } from 'next';
import localFont from 'next/font/local';
import LodSite from '@/components/lod/LodSite';

// Brand type (public/brand/lod/BRAND.md): Rubik for display, Assistant (the architect's deck face) for text.
// Self-hosted (OFL, Google Fonts' Hebrew + Latin subsets): next/font/google fetches at build time and has failed there
// (Vercel 11-09, a local build 11-10). Each subset is its own face; the page joins them into --font-rubik / --font-assistant.
const rubikHe = localFont({ variable: '--rubik-he', display: 'swap', adjustFontFallback: false, declarations: [{ prop: 'unicode-range', value: 'U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F' }], src: [{ path: './fonts/rubik-hebrew.woff2', weight: '500 700', style: 'normal' }] });
const rubikLa = localFont({ variable: '--rubik-la', display: 'swap', declarations: [{ prop: 'unicode-range', value: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD' }], src: [{ path: './fonts/rubik-latin.woff2', weight: '500 700', style: 'normal' }] });
const assistantHe = localFont({ variable: '--assistant-he', display: 'swap', adjustFontFallback: false, declarations: [{ prop: 'unicode-range', value: 'U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F' }], src: [{ path: './fonts/assistant-hebrew.woff2', weight: '400 700', style: 'normal' }] });
const assistantLa = localFont({ variable: '--assistant-la', display: 'swap', declarations: [{ prop: 'unicode-range', value: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD' }], src: [{ path: './fonts/assistant-latin.woff2', weight: '400 700', style: 'normal' }] });
const fontVars = { '--font-rubik': 'var(--rubik-he), var(--rubik-la)', '--font-assistant': 'var(--assistant-he), var(--assistant-la)' } as React.CSSProperties;

// Unlisted until the client approves it: not on / or /projects, not indexed.
export const metadata: Metadata = {
 title: 'מעון יום שיקומי · לוד · מגרש 4008',
 description: 'A municipal rehabilitative day care for children aged 0–3 in Lod: six classes, a therapy wing and a yard for every class. Kalkalit Lod tender for operators.',
 robots: { index: false, follow: false },
 openGraph: { title: 'מעון יום שיקומי · לוד', description: 'Six classes, ages 0–3 · Kalkalit Lod', images: ['/projects/lod-daycare/placeholders/street-entrance.webp'] },
};

export default function Page() {
 return <div className={`${rubikHe.variable} ${rubikLa.variable} ${assistantHe.variable} ${assistantLa.variable}`} style={fontVars}><LodSite /></div>;
}
