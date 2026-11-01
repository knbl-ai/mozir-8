import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { db } from './mongo';

// Webhook relay for the office-box bridge (services/bridge): the box has no public address, so WhatsApp (Zernio) and
// PayMe callbacks land here, are checked, stored in Mongo and answered at once. The bridge reads them from Mongo.
// Nothing here decides anything: a payment is only marked paid by the bridge after it re-checks the sale with PayMe.

export type WaEvent = { _id: string; source: 'zernio'; event: string; body: unknown; receivedAt: Date; processed: false };
export type PayEvent = { paymentId: string; source: 'payme'; body: Record<string, string>; receivedAt: Date; processed: false };

export const waEvents = async () => (await db()).collection<WaEvent>('wa_events');
export const payEvents = async () => (await db()).collection<PayEvent>('pay_events');

const same = (a: string, b: string) => {
 const x = Buffer.from(a), y = Buffer.from(b);
 return x.length === y.length && timingSafeEqual(x, y);
};

/** Zernio signs the raw body: X-Zernio-Signature = lowercase hex HMAC-SHA256(secret, body). */
export function zernioSigned(raw: string, signature: string | null, secret: string) {
 if (!signature || !secret) return false;
 return same(createHmac('sha256', secret).update(raw).digest('hex'), signature.trim().toLowerCase());
}

/** The token in a PayMe callback URL; the bridge builds the same one (services/bridge/src/payments.ts). */
export const payToken = (paymentId: string, secret: string) => createHash('sha256').update(`${paymentId}:${secret}`).digest('hex').slice(0, 32);
export const payTokenOk = (paymentId: string, token: string | null, secret: string) => !!token && !!secret && same(payToken(paymentId, secret), token);
