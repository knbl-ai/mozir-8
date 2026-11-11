import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from './env';

// A lasting link for the team to a client's private file (e.g. the plan cell in the leads sheet): /api/files checks the
// signature and redirects to a fresh 10-minute signed read URL. The link never exposes the bucket.
const sig = (path: string) => createHmac('sha256', env.fileLinkSecret()).update(`file:${path}`).digest('base64url').slice(0, 32);
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.residence.tech').replace(/\/$/, '');
export const fileLink = (path: string) => `${SITE}/api/files?p=${encodeURIComponent(path)}&t=${sig(path)}`;
export function fileLinkOk(path: string, t: string | null) {
 if (!t) return false;
 const a = Buffer.from(sig(path)), b = Buffer.from(t);
 return a.length === b.length && timingSafeEqual(a, b);
}
