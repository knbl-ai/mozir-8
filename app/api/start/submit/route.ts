import { formOrder, orderEvents, orderFromToken, submitForm, type FormFile } from '@/lib/server/orders';
import { privateBucket, PLAN_MAX_BYTES } from '@/lib/server/storage';

// Intake form, step 2: the answers + the uploaded files' paths. Checked here (link, open order, files in the order's
// folder and really uploaded), then stored for the bridge, which validates the fields again with the chat's rules.
const str = (v: unknown, max: number) => typeof v === 'string' ? v.trim().slice(0, max) : '';
const web = (v: unknown, max: number) => { const s = str(v, max); return /^https?:\/\/[^\s]+$/i.test(s) ? s : ''; };   // links: http(s) only
const LANG = /^[a-z]{2,3}(-[A-Za-z]{2,4})?$/;
const PER_HOUR = 10;

export async function POST(request: Request) {
 const body = await request.json().catch(() => null) as Record<string, any> | null;
 const id = orderFromToken(String(body?.token ?? ''));
 if (!id) return Response.json({ error: 'link' }, { status: 403 });
 const o = await formOrder(id);
 if (!o?.open) return Response.json({ error: 'closed' }, { status: 409 });
 const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
 if (await (await orderEvents()).countDocuments({ orderId: id, receivedAt: { $gt: new Date(Date.now() - 3600_000) } }) >= PER_HOUR)
  return Response.json({ error: 'rate' }, { status: 429 });

 const files: FormFile[] = [];
 const seen = new Set<string>();
 for (const f of Array.isArray(body?.files) ? body!.files.slice(0, 30) : []) {
  const path = str(f?.path, 300), kind = f?.kind;
  if (seen.has(path)) continue;
  seen.add(path);
  if (!['plan', 'building', 'reference'].includes(kind) || !path.startsWith(`orders/${id}/${kind}/`) || path.includes('..')) return Response.json({ error: 'file' }, { status: 400 });
  const file = privateBucket().file(path);
  const [exists] = await file.exists();
  if (!exists) return Response.json({ error: 'file' }, { status: 400 });
  const [meta] = await file.getMetadata();
  if (Number(meta.size) > PLAN_MAX_BYTES) { await file.delete().catch(() => {}); return Response.json({ error: 'size' }, { status: 400 }); }
  // the bridge downloads it within minutes; a week covers a box that was off
  const [url] = await file.getSignedUrl({ version: 'v4', action: 'read', expires: Date.now() + 7 * 24 * 3600 * 1000 });
  files.push({ kind, path, name: path.split('/').pop()!, url });
 }
 if (!o.intake.planCount && !files.some(f => f.kind === 'plan')) return Response.json({ error: 'plan' }, { status: 400 });

 const contact = body?.contactOnPage ?? {};
 const fields = {
  address: str(body?.address, 300), developerUrl: web(body?.developerUrl, 500), audience: str(body?.audience, 500), notes: str(body?.notes, 2000),
  referenceLinks: (Array.isArray(body?.referenceLinks) ? body!.referenceLinks : []).map((x: unknown) => web(x, 500)).filter(Boolean).slice(0, 20),
  languages: (Array.isArray(body?.languages) ? body!.languages : []).map((x: unknown) => str(x, 12).toLowerCase()).filter((x: string) => LANG.test(x)).slice(0, 6),
  contactOnPage: { name: str(contact.name, 120), phone: str(contact.phone, 40), email: str(contact.email, 200), company: str(contact.company, 120) },
 };
 await submitForm({ orderId: id, fields, files, ip });
 return Response.json({ ok: true });
}
