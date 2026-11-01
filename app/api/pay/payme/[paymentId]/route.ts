import { payEvents, payTokenOk } from '@/lib/server/inbound';

// PayMe sale callback (sale_callback_url) for a WhatsApp client's payment. Only stores the notice: the bridge
// re-checks the sale with PayMe (get-sales) before it unlocks anything, so a forged callback can't start work.
export async function POST(request: Request, { params }: { params: Promise<{ paymentId: string }> }) {
 const { paymentId } = await params;
 const url = new URL(request.url);
 if (!/^[\w-]{8,64}$/.test(paymentId) || !payTokenOk(paymentId, url.searchParams.get('token'), process.env.PAY_WEBHOOK_SECRET || ''))
  return Response.json({ error: 'token' }, { status: 401 });
 const type = request.headers.get('content-type') || '';
 let body: Record<string, string> = {};
 if (type.includes('json')) body = await request.json().catch(() => ({}));
 else for (const [k, v] of (await request.formData().catch(() => new FormData())).entries()) body[k] = String(v);
 // keep the fields the bridge logs; no card data is stored
 const keep = ['payme_status', 'status_code', 'notify_type', 'payme_sale_id', 'payme_sale_code', 'transaction_id', 'sale_status', 'price', 'currency', 'payme_transaction_id'];
 const stored = Object.fromEntries(Object.entries(body).filter(([k]) => keep.includes(k)).map(([k, v]) => [k, String(v).slice(0, 200)]));
 await (await payEvents()).insertOne({ paymentId, source: 'payme', body: stored, receivedAt: new Date(), processed: false });
 return Response.json({ ok: true });
}
