'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LanguageSwitch from '@/components/LanguageSwitch';
import Logo from '@/components/brand/Logo';
import { useLang, withLang } from '@/lib/i18n';
import { copy } from './copy';
import Button from './Button';
import DimensionLine from './DimensionLine';
import s from './landing.module.css';

// After the demo form. A real send leaves `rt-lead` in sessionStorage: the email is shown and one
// `lead_submitted` event goes to dataLayer (for a tag manager later); a reload or a direct visit sends nothing.
export default function ThankYou() {
 const lang = useLang();
 const t = copy[lang].thanks, f = copy[lang].footer;
 const [email, setEmail] = useState<string | null>(null);
 useEffect(() => {
  try {
   const lead = JSON.parse(sessionStorage.getItem('rt-lead') || 'null') as { email: string; at: number; counted?: boolean } | null;
   if (!lead) return;
   setEmail(lead.email);
   if (!lead.counted) {
    const w = window as unknown as { dataLayer?: unknown[] };
    (w.dataLayer ??= []).push({ event: 'lead_submitted', form: 'trial', lang });
    sessionStorage.setItem('rt-lead', JSON.stringify({ ...lead, counted: true }));
   }
  } catch { /* storage blocked */ }
 }, [lang]);

 return <div className={s.page}>
  <header className={s.header}>
   <Link href={withLang('/', lang)} className={s.brand} aria-label="residence.tech"><Logo /></Link>
   <LanguageSwitch id="thanks-lang" compact />
  </header>
  <main className={s.thanks}>
   <div className={s.formPanel} role="status">
    <svg className={s.doneIcon} viewBox="0 0 52 52" aria-hidden><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg>
    <p className={s.thanksKicker}>{t.kicker}</p>
    <h1 className={s.stepTitle}>{t.title}</h1>
    <p className={s.stepBody}>{t.body(email)}</p>
    <p className={s.stepBody}>{t.next}</p>
    <div className={s.thanksActions}>
     <Button href={withLang('/#projects', lang)}>{t.projects}</Button>
     <Link href={withLang('/', lang)} className={s.linkButton}>{t.home}</Link>
    </div>
   </div>
  </main>
  <footer className={s.footer}>
   <DimensionLine className={s.footerDim} />
   <div className={s.footerRow}>
    <Logo className={s.footerLogo} />
    <a href={`mailto:${f.contact}`}>{f.contact}</a>
    <span>© {new Date().getFullYear()} {f.line}</span>
   </div>
  </footer>
 </div>;
}
