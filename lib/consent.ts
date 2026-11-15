// Cookie consent (Google Consent Mode v2). Every visitor starts with ads and analytics storage denied; the
// tags in GTM wait (Google tags read the consent state; non-Google tags need "Additional consent checks" in GTM).
// The choice is kept for a year in localStorage under CONSENT_KEY as {v: 'granted'|'denied', t: epoch ms}.
export const CONSENT_KEY = 'rt-consent';
export const CONSENT_MAX_AGE = 365 * 24 * 3600 * 1000;
export const CONSENT_OPEN_EVENT = 'rt-consent-open';
export type ConsentChoice = 'granted' | 'denied';

const GRANTED = "{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'}";

// Runs in <head> before GTM: the default state, then the stored choice if it is still fresh.
export const CONSENT_BOOT_SCRIPT = `(function(){window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments);};gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true);try{var c=JSON.parse(localStorage.getItem('${CONSENT_KEY}')||'null');if(c&&c.v==='granted'&&Date.now()-c.t<${CONSENT_MAX_AGE})gtag('consent','update',${GRANTED});}catch(e){}})();`;

type Gtag = (...args: unknown[]) => void;

export function readConsent(): ConsentChoice | null {
 try {
  const c = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
  if (c && (c.v === 'granted' || c.v === 'denied') && Date.now() - c.t < CONSENT_MAX_AGE) return c.v;
 } catch { /* storage blocked */ }
 return null;
}

export function saveConsent(v: ConsentChoice) {
 try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ v, t: Date.now() })); } catch { /* storage blocked */ }
 const w = window as unknown as { gtag?: Gtag; dataLayer?: unknown[] };
 const state = v === 'granted' ? 'granted' : 'denied';
 w.gtag?.('consent', 'update', { ad_storage: state, ad_user_data: state, ad_personalization: state, analytics_storage: state });
 (w.dataLayer ??= []).push({ event: 'consent_update', consent: v });
}

// For a "Cookie settings" link anywhere on a page.
export const openConsent = () => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
