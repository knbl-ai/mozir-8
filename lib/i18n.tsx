'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';

export type Lang = 'en' | 'he' | 'pt';
export const LANG_PARAM = 'lang';
export const LANG_STORAGE_KEY = 'residences-lang';
const isLang = (value: unknown): value is Lang => value === 'en' || value === 'he' || value === 'pt';

// Each page offers English and one second language: Hebrew by default, Portuguese on the Lisbon project.
// A visitor's choice is kept as is; on a page that doesn't offer it, the page shows English.
const LANG_PAGES: [string, Lang[]][] = [['/projects/borges-15', ['en', 'pt']]];
const DEFAULT_LANGS: Lang[] = ['en', 'he'];
export const langsFor = (pathname: string | null | undefined): Lang[] =>
 LANG_PAGES.find(([prefix]) => pathname?.includes(prefix))?.[1] ?? DEFAULT_LANGS;
const fitLang = (lang: Lang, pathname: string | null | undefined): Lang => langsFor(pathname).includes(lang) ? lang : 'en';

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
// then a Hebrew or Portuguese visit keeps the body hidden (see globals.css), so English never flashes.
export function useLang(): Lang {
 const pathname = usePathname();
 const lang = fitLang(useSyncExternalStore(subscribe, snapshot, () => 'en' as Lang), pathname);
 useEffect(() => { applyToDocument(lang); writeLangToUrl(lang); }, [lang]);
 return lang;
}

// The languages the current page offers, for the switch.
export const usePageLangs = (): Lang[] => langsFor(usePathname());

// Keep the language on links that open another demo, so a new tab opens in the same language.
export function withLang(href: string, lang: Lang) {
 const [path, hash] = href.split('#');
 const joined = `${path}${path.includes('?') ? '&' : '?'}${LANG_PARAM}=${lang}`;
 return hash === undefined ? joined : `${joined}#${hash}`;
}

export const LANG_BOOT_SCRIPT = `(function(){try{var d=document.documentElement,pages=${JSON.stringify(LANG_PAGES)},ok=['en','he'];for(var i=0;i<pages.length;i++)if(location.pathname.indexOf(pages[i][0])>=0)ok=pages[i][1];var q=new URLSearchParams(location.search).get('${LANG_PARAM}'),l=ok.indexOf(q)>=0?q:localStorage.getItem('${LANG_STORAGE_KEY}');if(ok.indexOf(q)>=0)localStorage.setItem('${LANG_STORAGE_KEY}',q);if(l!=='en'&&ok.indexOf(l)>=0){d.lang=l;if(l==='he')d.dir='rtl';d.setAttribute('data-lang',l);setTimeout(function(){d.setAttribute('data-lang-ready','')},2500);}}catch(e){}})();`;

export const LANGUAGES: { value: Lang; label: string; short: string }[] = [{ value: 'en', label: 'English', short: 'EN' }, { value: 'he', label: 'עברית', short: 'עב' }, { value: 'pt', label: 'Português', short: 'PT' }];
