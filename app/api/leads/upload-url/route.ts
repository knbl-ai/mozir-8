import { bucket, PLAN_MAX_BYTES, PLAN_TYPES } from '@/lib/server/storage';
import { env } from '@/lib/server/env';

// Step 1 of the demo form: a short-lived signed PUT URL, so the plan goes from the browser straight to GCS
// (Vercel functions cap request bodies at ~4.5 MB).
export async function POST(request: Request) {
 const body = await request.json().catch(() => null) as { filename?: unknown; contentType?: unknown; size?: unknown } | null;
 const contentType = typeof body?.contentType === 'string' ? body.contentType : '';
 const size = typeof body?.size === 'number' ? body.size : 0;
 const filename = typeof body?.filename === 'string' ? body.filename : '';
 if (!PLAN_TYPES[contentType]) return Response.json({ error: 'type' }, { status: 400 });
 if (size <= 0 || size > PLAN_MAX_BYTES) return Response.json({ error: 'size' }, { status: 400 });

 const base = filename.replace(/\.[^.]*$/, '').normalize('NFKD').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'plan';
 const month = new Date().toISOString().slice(0, 7);
 const path = `${env.leadsPrefix()}/${month}/${crypto.randomUUID()}/${base}.${PLAN_TYPES[contentType]}`;
 const [url] = await bucket().file(path).getSignedUrl({
  version: 'v4', action: 'write', contentType, expires: Date.now() + 15 * 60 * 1000,
 });
 return Response.json({ url, path });
}
