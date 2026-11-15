'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLang, type Lang } from '@/lib/i18n';
import { CONSENT_OPEN_EVENT, openConsent, readConsent, saveConsent, type ConsentChoice } from '@/lib/consent';
import s from './CookieConsent.module.css';

const T: Record<Lang, { title: string; body: string; accept: string; reject: string }> = {
 en: { title: 'Cookies', body: 'We use cookies to measure visits and our ads. They stay off unless you accept. You can change your choice anytime from “Cookie settings” in the footer.', accept: 'Accept', reject: 'Reject' },
 he: { title: 'עוגיות', body: 'אנחנו משתמשים בעוגיות כדי למדוד ביקורים ואת הפרסום שלנו. הן כבויות עד שתאשרו. אפשר לשנות את הבחירה בכל עת ב״הגדרות עוגיות״ בתחתית העמוד.', accept: 'אישור', reject: 'דחייה' },
 pt: { title: 'Cookies', body: 'Usamos cookies para medir visitas e os nossos anúncios. Ficam desligados a menos que aceite. Pode mudar a sua escolha a qualquer momento em “Definições de cookies”, no rodapé.', accept: 'Aceitar', reject: 'Recusar' },
 el: { title: 'Cookies', body: 'Χρησιμοποιούμε cookies για να μετράμε τις επισκέψεις και τις διαφημίσεις μας. Μένουν απενεργοποιημένα αν δεν τα αποδεχτείτε. Μπορείτε να αλλάξετε την επιλογή σας οποιαδήποτε στιγμή από τις «Ρυθμίσεις cookies» στο κάτω μέρος.', accept: 'Αποδοχή', reject: 'Απόρριψη' },
};

export const COOKIE_SETTINGS_LABEL: Record<Lang, string> = { en: 'Cookie settings', he: 'הגדרות עוגיות', pt: 'Definições de cookies', el: 'Ρυθμίσεις cookies' };

// The apartment pages (a client order's /r/<slug> and the example pages sent to clients) carry no banner: the page is the
// client's, and Consent Mode keeps ads and analytics storage denied there (lib/consent.ts defaults).
export const NO_BANNER = [/^\/r\//, /^\/alma-bay\/films\//];

// The consent banner on every other page: shown until the visitor accepts or rejects, reopened by openConsent().
export default function CookieConsent() {
 const lang = useLang();
 const path = usePathname() ?? '';
 const [open, setOpen] = useState(false);
 useEffect(() => {
  if (!readConsent()) setOpen(true);
  const reopen = () => setOpen(true);
  window.addEventListener(CONSENT_OPEN_EVENT, reopen);
  return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
 }, []);
 if (!open || NO_BANNER.some(r => r.test(path))) return null;
 const t = T[lang];
 const choose = (v: ConsentChoice) => { saveConsent(v); setOpen(false); };
 return <div className={s.banner} role="dialog" aria-live="polite" aria-label={t.title}>
  <p className={s.text}><strong>{t.title}.</strong> {t.body}</p>
  <div className={s.actions}>
   <button type="button" className={s.btn} onClick={() => choose('denied')}>{t.reject}</button>
   <button type="button" className={s.btn} onClick={() => choose('granted')}>{t.accept}</button>
  </div>
 </div>;
}

// "Cookie settings" for a footer: reopens the banner so a visitor can withdraw or give consent.
export function CookieSettingsLink({ className }: { className?: string }) {
 const lang = useLang();
 return <button type="button" className={`${s.settings} ${className ?? ''}`} onClick={openConsent}>{COOKIE_SETTINGS_LABEL[lang]}</button>;
}
