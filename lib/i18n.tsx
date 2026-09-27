'use client';
import { useEffect, useSyncExternalStore } from 'react';

export type Lang = 'en' | 'he';
export const LANG_PARAM = 'lang';
export const LANG_STORAGE_KEY = 'residences-lang';
const isLang = (value: unknown): value is Lang => value === 'en' || value === 'he';

// ?lang= wins (a shared link says which language it was sent in), then the visitor's last choice.
// The layout's inline script runs the same rule before first paint; see LANG_BOOT_SCRIPT.
export function readLang(): Lang {
 try {
  const fromUrl = new URLSearchParams(window.location.search).get(LANG_PARAM);
  if (isLang(fromUrl)) return fromUrl;
  const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
  if (isLang(stored)) return stored;
 } catch { /* storage blocked */ }
 return 'en';
}

let current: Lang | null = null;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener); };
const snapshot = () => (current ??= readLang());

const applyToDocument = (lang: Lang) => {
 const root = document.documentElement;
 root.lang = lang;
 root.dir = lang === 'he' ? 'rtl' : 'ltr';
 root.dataset.lang = lang;
 root.setAttribute('data-lang-ready', '');
};

// The address always names the language shown, English included, so a copied link opens in the
// language it was copied in, whatever the recipient used last.
const writeLangToUrl = (lang: Lang) => {
 try {
  const url = new URL(window.location.href);
  if (url.searchParams.get(LANG_PARAM) === lang) return;
  url.searchParams.set(LANG_PARAM, lang);
  window.history.replaceState(window.history.state, '', url);
 } catch { /* sandboxed */ }
};

export function setLang(lang: Lang) {
 current = lang;
 try { window.localStorage.setItem(LANG_STORAGE_KEY, lang); } catch { /* storage blocked */ }
 writeLangToUrl(lang);
 applyToDocument(lang);
 listeners.forEach(l => l());
}

// Static pages render in English; the client swaps in the visitor's language on hydration. Until
// then a Hebrew visit keeps the body hidden (see globals.css), so English never flashes.
export function useLang(): Lang {
 const lang = useSyncExternalStore(subscribe, snapshot, () => 'en' as Lang);
 useEffect(() => { applyToDocument(lang); writeLangToUrl(lang); }, [lang]);
 return lang;
}

// Keep the language on links that open another demo, so a new tab opens in the same language.
export function withLang(href: string, lang: Lang) {
 const [path, hash] = href.split('#');
 const joined = `${path}${path.includes('?') ? '&' : '?'}${LANG_PARAM}=${lang}`;
 return hash === undefined ? joined : `${joined}#${hash}`;
}

export const LANG_BOOT_SCRIPT = `(function(){try{var d=document.documentElement,q=new URLSearchParams(location.search).get('${LANG_PARAM}'),l=(q==='he'||q==='en')?q:localStorage.getItem('${LANG_STORAGE_KEY}');if(q==='he'||q==='en')localStorage.setItem('${LANG_STORAGE_KEY}',q);if(l==='he'){d.lang='he';d.dir='rtl';d.setAttribute('data-lang','he');setTimeout(function(){d.setAttribute('data-lang-ready','')},2500);}}catch(e){}})();`;

export const LANGUAGES: { value: Lang; label: string }[] = [{ value: 'en', label: 'English' }, { value: 'he', label: 'עברית' }];
