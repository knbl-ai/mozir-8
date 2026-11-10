import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HomePage from '@/components/home/HomePage';
import { FILM_STYLES, filmStyle } from '@/content/projects/alma-bay-films';

// One page per film style, each a standalone presentation that can be sent on its own. Unlisted, not indexed.
export function generateStaticParams() { return FILM_STYLES.map(s => ({ style: s.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ style: string }> }): Promise<Metadata> {
 const st = filmStyle((await params).style);
 if (!st) return {};
 return {
  title: `Residence 01 · Alma Bay, Netanya — ${st.name}`,
  description: st.concept,
  robots: { index: false, follow: false, nocache: true },
  openGraph: { title: `${st.name} · Alma Bay`, description: st.tagline, images: [st.cuts[0].poster] },
 };
}

export default async function Page({ params }: { params: Promise<{ style: string }> }) {
 const st = filmStyle((await params).style);
 if (!st) notFound();
 // the apartment page (address, films, plan, 3D, building, area, contact, media kit), set in each film style
 return <HomePage styleSlug={st.slug} />;
}
