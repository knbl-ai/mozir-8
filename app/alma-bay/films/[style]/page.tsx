import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StylePage from '@/components/films/StylePage';
import { FILM_STYLES, filmStyle } from '@/content/projects/alma-bay-films';

// One page per film style, each a standalone presentation that can be sent on its own. Unlisted, not indexed.
export function generateStaticParams() { return FILM_STYLES.map(s => ({ style: s.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ style: string }> }): Promise<Metadata> {
 const st = filmStyle((await params).style);
 if (!st) return {};
 return {
  title: `${st.name} — Alma Bay · Residence 01`,
  description: st.concept,
  robots: { index: false, follow: false, nocache: true },
  openGraph: { title: `${st.name} · Alma Bay`, description: st.tagline, images: [st.cuts[0].poster] },
 };
}

export default async function Page({ params }: { params: Promise<{ style: string }> }) {
 const st = filmStyle((await params).style);
 if (!st) notFound();
 return <StylePage slug={st.slug} />;
}
