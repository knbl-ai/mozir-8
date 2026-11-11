import { formOrder, orderFromToken, uploadRequests } from '@/lib/server/orders';
import { privateBucket, PLAN_MAX_BYTES, PLAN_TYPES, SIZE_RANGE } from '@/lib/server/storage';

// Intake form, step 1 per file: a 15-minute signed PUT URL into the order's own folder of the private bucket.
const KINDS = new Set(['plan', 'building', 'reference']);
export async function POST(request: Request) {
 const body = await request.json().catch(() => null) as Record<string, unknown> | null;
 const id = orderFromToken(String(body?.token ?? ''));
 if (!id) return Response.json({ error: 'link' }, { status: 403 });
 const o = await formOrder(id);
 if (!o?.open) return Response.json({ error: 'closed' }, { status: 409 });
 const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
 const col = await uploadRequests();
 const since = new Date(Date.now() - 3600_000);
 if (await col.countDocuments({ orderId: id, at: { $gt: since } }) >= 120 || await col.countDocuments({ ip, at: { $gt: since } }) >= 200)
  return Response.json({ error: 'rate' }, { status: 429 });
 await col.insertOne({ orderId: id, ip, at: new Date() });
 const kind = String(body?.kind ?? ''), contentType = String(body?.contentType ?? ''), size = Number(body?.size ?? 0);
 if (!KINDS.has(kind)) return Response.json({ error: 'kind' }, { status: 400 });
 if (!PLAN_TYPES[contentType]) return Response.json({ error: 'type' }, { status: 400 });
 if (!(size > 0 && size <= PLAN_MAX_BYTES)) return Response.json({ error: 'size' }, { status: 400 });
 const base = String(body?.filename ?? '').replace(/\.[^.]*$/, '').normalize('NFKD').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || kind;
 const path = `orders/${id}/${kind}/${crypto.randomUUID().slice(0, 8)}-${base}.${PLAN_TYPES[contentType]}`;
 const [url] = await privateBucket().file(path).getSignedUrl({ version: 'v4', action: 'write', contentType, extensionHeaders: SIZE_RANGE, expires: Date.now() + 15 * 60 * 1000 });
 return Response.json({ url, path });
}
