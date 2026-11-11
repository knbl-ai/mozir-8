import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import IntakeForm from '@/components/start/IntakeForm';
import { formOrder, orderFromToken } from '@/lib/server/orders';

// The client order's intake form: one page, every question, uploads. Reached only by the signed link the WhatsApp
// concierge sends (/start/<order>.<sig>); nothing here is listed or indexed. Rendered per request (the order changes).
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Your apartment · residence.tech', robots: { index: false, follow: false, nocache: true } };

export default async function Start({ params }: { params: Promise<{ token: string }> }) {
 let token = '';
 try { token = decodeURIComponent((await params).token); } catch { notFound(); }
 const id = orderFromToken(token);
 if (!id) notFound();
 const o = await formOrder(id);
 if (!o) notFound();
 const { id: _id, ...order } = o;
 return <IntakeForm token={token} order={order} wa={process.env.NEXT_PUBLIC_WA_NUMBER || ''} />;
}
