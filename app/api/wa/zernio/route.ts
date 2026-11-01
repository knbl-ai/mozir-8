import { waEvents, zernioSigned } from '@/lib/server/inbound';

// Zernio → WhatsApp events (message.received / message.sent / message.failed …) for the bridge on the office box.
// Must answer 2xx within 5 s; the event id makes retries and redeliveries idempotent.
export async function POST(request: Request) {
 const raw = await request.text();
 const secret = process.env.ZERNIO_WEBHOOK_SECRET || '';
 if (!zernioSigned(raw, request.headers.get('x-zernio-signature') ?? request.headers.get('x-late-signature'), secret))
  return Response.json({ error: 'signature' }, { status: 401 });
 let body: Record<string, unknown>;
 try { body = JSON.parse(raw); } catch { return Response.json({ error: 'body' }, { status: 400 }); }
 const id = String(request.headers.get('x-zernio-event-id') || body.id || '');
 if (!id) return Response.json({ error: 'id' }, { status: 400 });
 if (body.test) return Response.json({ ok: true, test: true });   // POST /v1/webhooks/test samples: never stored
 try {
  await (await waEvents()).insertOne({ _id: id, source: 'zernio', event: String(body.event ?? ''), body, receivedAt: new Date(), processed: false });
 } catch (e: any) {
  if (e?.code !== 11000) throw e;   // duplicate event id = already stored
 }
 return Response.json({ ok: true });
}
