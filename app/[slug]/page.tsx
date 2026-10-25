import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ApartmentPage from '@/components/apartment/ApartmentPage';
import { loadPage, textIn } from '@/content/apartment-page';

// A pipeline apartment page (content/apartment-page.ts): data and media from the bucket, built on the first visit and
// refreshed every minute, so a 480p page becomes 1080p in place. Unknown slugs are 404; static routes win over this one.
export const revalidate = 60;
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
 const d = await loadPage((await params).slug);
 const robots = { index: false, follow: false, nocache: true };
 if (!d) return { robots };
 const name = textIn(d.building.name, 'en'), home = textIn(d.home.shortTitle, 'en');
 return { title: `${home} · ${name}`, description: `${home}, ${textIn(d.building.address, 'en')}: film, plan, images and 3D.`, robots };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
 const d = await loadPage((await params).slug);
 if (!d) notFound();
 return <ApartmentPage data={d} />;
}
