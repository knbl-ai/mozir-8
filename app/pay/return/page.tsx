import type { Metadata } from 'next';

// Where PayMe sends a WhatsApp client after paying (sale_return_url). The bridge confirms the payment and continues
// in WhatsApp by itself; this page only says so.
export const metadata: Metadata = { title: 'Payment received · residence.tech', robots: { index: false, follow: false } };

const WA = process.env.NEXT_PUBLIC_WA_NUMBER || '';

export default function PayReturn() {
 return (
  <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f6f4ef', color: '#1d1d1b', fontFamily: 'system-ui, sans-serif' }}>
   <div style={{ maxWidth: 440, textAlign: 'center' }}>
    <h1 style={{ fontSize: 28, margin: '0 0 12px' }}>Thank you — payment received</h1>
    <p style={{ fontSize: 17, lineHeight: 1.5, margin: '0 0 8px' }}>We’ll confirm it in WhatsApp in a moment and carry on with your apartment.</p>
    <p dir="rtl" style={{ fontSize: 17, lineHeight: 1.5, margin: '0 0 24px' }}>תודה, התשלום התקבל. נאשר אותו בוואטסאפ בעוד רגע ונמשיך בעבודה על הדירה שלך.</p>
    {WA && <a href={`https://wa.me/${WA.replace(/\D/g, '')}`} style={{ display: 'inline-block', padding: '12px 22px', borderRadius: 999, background: '#1d1d1b', color: '#fff', textDecoration: 'none' }}>Back to WhatsApp</a>}
   </div>
  </main>
 );
}
