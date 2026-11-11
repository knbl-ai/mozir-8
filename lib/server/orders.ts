import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { db } from './mongo';
import { env } from './env';

// The client order's intake form (/start/<order>.<sig>): the WhatsApp concierge (services/bridge/src/concierge) sends
// the link; the bridge signs it with ORDER_FORM_SECRET (tools.ts formLink) and this side checks the same signature.
// The site never changes an order: it stores the answers + files as an `order_events` row; the bridge applies them
// through its order API (same validation as the chat) and tells the concierge.

export const ORDER_ID = /^ord_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const sig = (id: string) => createHmac('sha256', env.orderFormSecret()).update(id).digest('base64url').slice(0, 22);

/** "<order>.<sig>" → the order id, or null. */
export function orderFromToken(token: string): string | null {
 const i = token.lastIndexOf('.');
 if (i < 0) return null;
 const id = token.slice(0, i), s = token.slice(i + 1);
 if (!ORDER_ID.test(id)) return null;
 const a = Buffer.from(sig(id)), b = Buffer.from(s);
 return a.length === b.length && timingSafeEqual(a, b) ? id : null;
}

// What the form may show and prefill (never payments, history or the conversation).
export interface FormOrder {
 id: string; state: string; lang: string;
 intake: { planCount: number; address?: string; developerUrl?: string; referenceLinks?: string[]; audience?: string; notes?: string;
  contactOnPage?: { name?: string; phone?: string; email?: string; company?: string } };
 languages: string[];
}
const OPEN = ['intake', 'choosing', 'quoted'];   // the setup can still change (bridge orders/index.ts EDITABLE)

export async function formOrder(id: string): Promise<(FormOrder & { open: boolean }) | null> {
 const o = await (await db()).collection<any>('orders').findOne({ _id: id }, { projection: { state: 1, lang: 1, intake: 1, choices: 1 } });
 if (!o) return null;
 const i = o.intake ?? {};
 return {
  id, state: o.state, lang: o.lang ?? 'en', open: OPEN.includes(o.state), languages: o.choices?.languages ?? [],
  intake: { planCount: (i.planFiles ?? []).length, address: i.address, developerUrl: i.developerUrl, referenceLinks: i.referenceLinks, audience: i.audience, notes: i.notes, contactOnPage: i.contactOnPage },
 };
}

export type FormFile = { kind: 'plan' | 'building' | 'reference'; path: string; name: string; url: string };
export interface FormSubmission { orderId: string; fields: Record<string, unknown>; files: FormFile[]; ip: string }
export const orderEvents = async () => (await db()).collection<any>('order_events');
// signed upload URLs handed out (rate limit per order and per IP; rows expire after a day)
export const uploadRequests = async () => {
 const c = (await db()).collection<{ orderId: string; ip: string; at: Date }>('upload_requests');
 await c.createIndex({ at: 1 }, { expireAfterSeconds: 86400 }).catch(() => {});
 return c;
};

/** One row for the bridge to apply (services/bridge/src/concierge/form.ts). */
export async function submitForm(s: FormSubmission) {
 await (await orderEvents()).insertOne({ orderId: s.orderId, kind: 'form', fields: s.fields, files: s.files, ip: s.ip, receivedAt: new Date(), processed: false });
}
