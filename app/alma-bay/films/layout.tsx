import { Bricolage_Grotesque, DM_Mono, Geist_Mono, Hanken_Grotesk, Instrument_Serif, Space_Mono } from 'next/font/google';

// The six faces of the three film styles (the same as pipeline/highlights/kit/themes/<slug>), loaded once for the hub and
// the three style pages, so every page is set in its own film's type.
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--f-riviera-d', display: 'swap' });
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--f-riviera-t', display: 'swap' });
const hanken = Hanken_Grotesk({ subsets: ['latin'], weight: ['300', '400', '600', '800'], variable: '--f-mono-d', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--f-mono-t', display: 'swap' });
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], weight: ['400', '700', '800'], variable: '--f-sunday-d', display: 'swap' });
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--f-sunday-t', display: 'swap' });

export default function Layout({ children }: { children: React.ReactNode }) {
 return <div className={[instrument, dmMono, hanken, geistMono, bricolage, spaceMono].map(f => f.variable).join(' ')}>{children}</div>;
}
