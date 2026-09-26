'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, MotionConfig } from 'motion/react';
import { ArrowUpRight, Check } from 'lucide-react';
import { copy, type DemoCopy, type Lang } from './copy';
import BuildingPreview from './BuildingPreview';
import FilmPreview from './FilmPreview';
import s from './landing.module.css';

const STORAGE_KEY = 'residences-lang';
const LANGUAGES: { value: Lang; label: string; lang: string }[] = [{ value: 'en', label: 'English', lang: 'en' }, { value: 'he', label: 'עברית', lang: 'he' }];

function Demo({ href, text, preview, id }: { href: string; text: DemoCopy; id: string; preview: (active: boolean) => React.ReactNode }) {
 const [active, setActive] = useState(false);
 return <article className={s.demo} aria-labelledby={`${id}-name`}>
  <Link href={href} className={s.previewLink} aria-label={text.cta}
   onPointerEnter={e => e.pointerType === 'mouse' && setActive(true)} onPointerLeave={() => setActive(false)}
   onFocus={() => setActive(true)} onBlur={() => setActive(false)}>
   <span className={s.preview}>{preview(active)}</span>
   <span className={s.previewHint} data-active={active || undefined}>
    <span className={s.hintMouse}>{text.hint}</span><span className={s.hintTouch}>{text.touchHint}</span>
   </span>
  </Link>
  <div className={s.demoBody}>
   <p className={s.kind}>{text.kind}</p>
   <h2 id={`${id}-name`} className={s.name}>{text.name}</h2>
   <p className={s.body}>{text.body}</p>
   <ul className={s.features}>{text.features.map(f => <li key={f}><Check size={15} strokeWidth={1.8} aria-hidden />{f}</li>)}</ul>
   <Link href={href} className={s.cta}>{text.cta}<ArrowUpRight className={s.ctaIcon} size={16} strokeWidth={1.8} aria-hidden /></Link>
  </div>
 </article>;
}

export default function DemoHome({ buildingFrames }: { buildingFrames: string[] }) {
 const [lang, setLang] = useState<Lang>('en');
 useEffect(() => {
  let stored: string | null = null;
  try { stored = new URLSearchParams(window.location.search).get('lang') ?? window.localStorage.getItem(STORAGE_KEY); } catch { /* storage blocked */ }
  if (stored === 'he' || stored === 'en') setLang(stored);
 }, []);
 const choose = (next: Lang) => {
  setLang(next);
  try {
   window.localStorage.setItem(STORAGE_KEY, next);
   const url = new URL(window.location.href);
   if (next === 'en') url.searchParams.delete('lang'); else url.searchParams.set('lang', next);
   window.history.replaceState(window.history.state, '', url);
  } catch { /* sandboxed */ }
 };
 const t = copy[lang];
 const dir = lang === 'he' ? 'rtl' : 'ltr';

 return <MotionConfig reducedMotion="user"><div className={s.page} dir={dir} lang={lang === 'he' && !t.pending ? 'he' : 'en'}>
  <header className={s.header}>
   <Link href="/" className={s.brand}>
    <svg className={s.brandMark} viewBox="0 0 32 40" aria-hidden="true"><path d="M3 37V16a13 13 0 0 1 26 0v21M10 37V17a6 6 0 0 1 12 0v20M3 27h26" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
    <span>{t.brand}<small>{t.brandNote}</small></span>
   </Link>
   <div role="radiogroup" aria-label={t.languageLabel} className={s.langSwitch}>
    {LANGUAGES.map(l => <button key={l.value} type="button" role="radio" aria-checked={lang === l.value} lang={l.lang}
     className={s.langOption} data-active={lang === l.value || undefined} onClick={() => choose(l.value)}>
     {lang === l.value && <motion.span layoutId="lang-thumb" className={s.langThumb} transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
     <span className={s.langLabel}>{l.label}</span>
    </button>)}
   </div>
  </header>

  <main className={s.main}>
   {t.pending && <p className={s.pending} role="status">{t.pending}</p>}
   <section className={s.intro}>
    <h1 className={s.title}>{t.title}</h1>
    <div className={s.introText}>
     <p className={s.lede}>{t.lede}</p>
     <p className={s.sample}>{t.sample}</p>
    </div>
   </section>

   <div className={s.demos}>
    <Demo id="sales-gallery" href="/projects/building-preview#explore" text={t.salesGallery}
     preview={active => <BuildingPreview frames={buildingFrames} active={active} />} />
    <Demo id="open-house" href="/mozir-8" text={t.openHouse}
     preview={active => <FilmPreview poster="/media/01_living.webp" film="/media/residence-film.mp4" active={active} />} />
   </div>
  </main>

  <footer className={s.footer}><p>{t.footer}</p></footer>
 </div></MotionConfig>;
}
