'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MotionConfig } from 'motion/react';
import { ArrowUpRight, Check } from 'lucide-react';
import LanguageSwitch from '@/components/LanguageSwitch';
import { useLang, withLang } from '@/lib/i18n';
import { copy, type DemoCopy } from './copy';
import BuildingPreview from './BuildingPreview';
import FilmPreview from './FilmPreview';
import s from './landing.module.css';

function Demo({ href, text, newTab, preview, id, tone }: { href: string; text: DemoCopy; newTab: string; id: string; tone?: 'dark'; preview: (active: boolean) => React.ReactNode }) {
 const [active, setActive] = useState(false);
 return <article className={s.demo} aria-labelledby={`${id}-name`}>
  <Link href={href} target="_blank" rel="noopener" className={s.previewLink} data-tone={tone} aria-label={`${text.cta} (${newTab})`}
   onPointerEnter={e => e.pointerType === 'mouse' && setActive(true)} onPointerLeave={() => setActive(false)}
   onFocus={() => setActive(true)} onBlur={() => setActive(false)}>
   <span className={s.preview}>{preview(active)}</span>
   <span className={s.previewHint} data-active={active || undefined}>
    <span className={s.hintMouse}>{text.hint}</span><span className={s.hintTouch}>{text.touchHint}</span>
   </span>
  </Link>
  <div className={s.demoBody}>
   <div className={s.demoHead}>
    <div>
     <p className={s.kind}>{text.kind}</p>
     <h2 id={`${id}-name`} className={s.name}>{text.name}</h2>
    </div>
    <Link href={href} target="_blank" rel="noopener" className={s.cta} aria-label={`${text.cta} (${newTab})`}>{text.cta}<ArrowUpRight className={s.ctaIcon} size={16} strokeWidth={1.8} aria-hidden /></Link>
   </div>
   <p className={s.body}>{text.body}</p>
   <ul className={s.features}>{text.features.map(f => <li key={f}><Check size={15} strokeWidth={1.8} aria-hidden />{f}</li>)}</ul>
  </div>
 </article>;
}

export default function DemoHome({ buildingFrames, penthouseFrames, complexFrames }: { buildingFrames: string[]; penthouseFrames: string[]; complexFrames: string[] }) {
 const lang = useLang();
 const t = copy[lang];

 return <MotionConfig reducedMotion="user"><div className={s.page}>
  <header className={s.header}>
   <Link href="/" className={s.brand}>
    <svg className={s.brandMark} viewBox="0 0 32 40" aria-hidden="true"><path d="M3 37V16a13 13 0 0 1 26 0v21M10 37V17a6 6 0 0 1 12 0v20M3 27h26" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
    <span>{t.brand}<small>{t.brandNote}</small></span>
   </Link>
   <LanguageSwitch id="hub-lang" />
  </header>

  <main className={s.main}>
   <section className={s.intro}>
    <h1 className={s.title}>{t.title}</h1>
    <div className={s.introText}>
     <p className={s.lede}>{t.lede}</p>
     <p className={s.sample}>{t.sample}</p>
    </div>
   </section>

   <div className={s.demos}>
    <Demo id="sales-gallery" href={withLang('/projects/building-preview#explore', lang)} text={t.salesGallery} newTab={t.newTab}
     preview={active => <BuildingPreview frames={buildingFrames} active={active} />} />
    <Demo id="open-house" href={withLang('/mozir-8', lang)} text={t.openHouse} newTab={t.newTab}
     preview={active => <FilmPreview poster="/media/01_living.webp" film="/media/residence-film.mp4" active={active} />} />
    <Demo id="penthouse" href={withLang('/projects/afk-urban-comfort#explore', lang)} text={t.penthouse} newTab={t.newTab}
     preview={active => <BuildingPreview frames={penthouseFrames} active={active} span={0.6} centre={0.5} />} />
    <Demo id="gindi-colors" href={withLang('/gindi-colors', lang)} text={t.complex} newTab={t.newTab} tone="dark"
     preview={active => <BuildingPreview frames={complexFrames} active={active} span={0.7} centre={0.47} />} />
    <Demo id="klee-8" href={withLang('/klee-8', lang)} text={t.boutique} newTab={t.newTab}
     preview={active => <FilmPreview poster="/projects/klee-8/media/apt-3/g-garden.webp" film="/projects/klee-8/media/apt-3/film.mp4" active={active} />} />
   </div>
  </main>

  <footer className={s.footer}><p>{t.footer}</p></footer>
 </div></MotionConfig>;
}
