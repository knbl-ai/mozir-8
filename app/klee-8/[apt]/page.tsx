import { notFound } from 'next/navigation';
import { getKleeHome, kleeHomes } from '@/content/projects/klee';
import KleeApartment from '@/components/klee/KleeApartment';
export function generateStaticParams() { return kleeHomes.map(h => ({ apt: h.id })); }
export async function generateMetadata({ params }: { params: Promise<{ apt: string }> }) {
 const h = getKleeHome((await params).apt);
 return { title: h ? `${h.shortTitle} · N°8 KLEE · RE/MAX Ocean` : 'N°8 KLEE', description: h?.description, openGraph: { title: h?.title, images: h ? [h.cover] : [] } };
}
export default async function Page({ params }: { params: Promise<{ apt: string }> }) {
 const h = getKleeHome((await params).apt);
 if (!h) notFound();
 return <KleeApartment home={h} />;
}
