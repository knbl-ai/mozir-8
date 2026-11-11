import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HomePage from '@/components/home/HomePage';
import { loadHome } from '@/content/home-page';

// A client order's apartment page (the WhatsApp client flow): one deploy for all of them, data from the bucket
// (content/home-page.ts), built on the first visit and refreshed every minute. Unlisted and never indexed.
export const revalidate = 60;
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
 const d = await loadHome((await params).slug);
 const robots = { index: false, follow: false, nocache: true };
 if (!d) return { robots };
 const where = [d.address.no, d.address.street.en].filter(Boolean).join(' ');
 return { title: `${d.unit.en} · ${where}, ${d.address.city.en}`, description: `${d.unit.en}, ${where}: films, plan, images and 3D.`, robots,
  openGraph: { title: `${d.unit.en} · ${d.project.en}`, images: [d.hero.wideStill] } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
 const d = await loadHome((await params).slug);
 if (!d) notFound();
 return <HomePage data={d} />;
}
