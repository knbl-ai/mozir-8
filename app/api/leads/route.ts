import { leads, type Lead } from '@/lib/server/mongo';
import { bucket, PLAN_MAX_BYTES } from '@/lib/server/storage';
import { sendMail } from '@/lib/server/gmail';
import { teamMail, userMail } from '@/lib/server/lead-emails';
import { env } from '@/lib/server/env';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const str = (v: unknown, max: number) => typeof v === 'string' ? v.trim().slice(0, max) : '';
const HOURLY_LIMIT = 5;

// Step 2 of the trial form: store the lead, then mail the visitor and the team. A mail failure never loses the lead.
export async function POST(request: Request) {
 const body = await request.json().catch(() => null) as Record<string, unknown> | null;
 if (!body) return Response.json({ error: 'body' }, { status: 400 });
 if (str(body.website, 200)) return Response.json({ ok: true });  // honeypot: quietly accept, store nothing

 const email = str(body.email, 200).toLowerCase();
 if (!EMAIL.test(email)) return Response.json({ error: 'email' }, { status: 400 });

 const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
 const col = await leads();
 const recent = await col.countDocuments({ ip, createdAt: { $gt: new Date(Date.now() - 3600_000) } });
 if (recent >= HOURLY_LIMIT) return Response.json({ error: 'rate' }, { status: 429 });

 let plan: Lead['plan'] = null;
 const planPath = str(body.planPath, 300);
 if (planPath) {
  if (!planPath.startsWith(`${env.leadsPrefix()}/`) || planPath.includes('..')) return Response.json({ error: 'plan' }, { status: 400 });
  const file = bucket().file(planPath);
  const [exists] = await file.exists();
  if (!exists) return Response.json({ error: 'plan' }, { status: 400 });
  const [meta] = await file.getMetadata();
  const size = Number(meta.size);
  if (size > PLAN_MAX_BYTES) { await file.delete().catch(() => {}); return Response.json({ error: 'size' }, { status: 400 }); }
  plan = { path: planPath, filename: str(body.planName, 200) || planPath.split('/').pop()!, contentType: meta.contentType || '', size };
 }

 const lead: Lead = {
  schemaVersion: 1,
  name: str(body.name, 120),
  email,
  phone: str(body.phone, 40),
  description: str(body.description, 4000),
  plan,
  lang: body.lang === 'he' ? 'he' : 'en',
  source: 'landing',
  status: 'new',
  ip,
  userAgent: str(request.headers.get('user-agent'), 300),
  createdAt: new Date(),
 };
 const { insertedId } = await col.insertOne(lead);

 const planUrl = plan ? (await bucket().file(plan.path).getSignedUrl({ version: 'v4', action: 'read', expires: Date.now() + 7 * 24 * 3600 * 1000 }))[0] : null;
 const [user, team] = await Promise.allSettled([sendMail(userMail(lead)), sendMail(teamMail(lead, env.leadsNotify(), planUrl))]);
 const error = [user, team].filter(r => r.status === 'rejected').map(r => String((r as PromiseRejectedResult).reason?.message || r.reason)).join(' | ');
 if (error) console.error('lead mail failed', insertedId.toString(), error);
 await col.updateOne({ _id: insertedId }, { $set: { emails: {
  user: user.status === 'fulfilled' ? 'sent' : 'failed', team: team.status === 'fulfilled' ? 'sent' : 'failed', ...(error ? { error: error.slice(0, 1000) } : {}), at: new Date(),
 } } });

 return Response.json({ ok: true });
}
