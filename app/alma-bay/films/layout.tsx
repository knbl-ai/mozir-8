import { bricolage, dmMono, geistMono, hanken, heMono, heRivieraD, heRivieraT, heSundayD, heSundayT, instrument, spaceMono } from '@/components/films/fonts';

// The six faces of the three film styles, loaded once for the hub and the three style pages, so every page is set in its
// own film's type.
export default function Layout({ children }: { children: React.ReactNode }) {
 return <div className={[instrument, dmMono, hanken, geistMono, bricolage, spaceMono, heRivieraD, heRivieraT, heMono, heSundayD, heSundayT].map(f => f.variable).join(' ')}>{children}</div>;
}
