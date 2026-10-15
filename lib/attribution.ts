'use client';
// Where a visitor came from, for ad campaigns: the UTM tags and ad click ids of the link they arrived by.
// Kept in localStorage for 90 days (the last campaign link wins; the first one is kept too), sent with a lead,
// and carried onto the thank-you page so a campaign's conversion page sees the same tags.

export const CAMPAIGN_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
 'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'ttclid', 'li_fat_id'] as const;
type Touch = { params: Record<string, string>; landingPage: string; referrer: string; at: string };
export type Attribution = { first: Touch; last: Touch };

const KEY = 'rt-attribution';
const TTL = 90 * 24 * 3600 * 1000;

export function captureAttribution() {
 try {
  const url = new URL(window.location.href);
  const params: Record<string, string> = {};
  for (const k of CAMPAIGN_KEYS) { const v = url.searchParams.get(k); if (v) params[k] = v.slice(0, 300); }
  const stored = readAttribution();
  const external = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : '';
  if (!Object.keys(params).length && (stored || !external)) return;   // nothing new: keep what we have
  const touch: Touch = { params, landingPage: (url.pathname + url.search).slice(0, 500), referrer: external.slice(0, 500), at: new Date().toISOString() };
  const next: Attribution = { first: stored?.first ?? touch, last: Object.keys(params).length || !stored ? touch : stored.last };
  localStorage.setItem(KEY, JSON.stringify(next));
 } catch { /* storage blocked */ }
}

export function readAttribution(): Attribution | null {
 try {
  const a = JSON.parse(localStorage.getItem(KEY) || 'null') as Attribution | null;
  return a && Date.now() - Date.parse(a.last.at) < TTL ? a : null;
 } catch { return null; }
}

// "utm_source=…&gclid=…" of the latest campaign, to append to the thank-you link.
export function campaignQuery(): string {
 const p = readAttribution()?.last.params ?? {};
 return new URLSearchParams(p).toString();
}
