'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MotionConfig } from 'motion/react';
import { ArrowUpRight, Play } from 'lucide-react';
import LanguageSwitch from '@/components/LanguageSwitch';
import Logo from '@/components/brand/Logo';
import { useLang, withLang } from '@/lib/i18n';
import { copy, type ProjectCopy } from './copy';
import BuildingPreview from './BuildingPreview';
import FilmPreview from './FilmPreview';
import Button from './Button';
import DimensionLine from './DimensionLine';
import Process from './Process';
import Package from './Package';
import StylesSection from './StylesSection';
import Rotator from './Rotator';
import TrialForm from './TrialForm';
import WhatsAppButton from './WhatsAppButton';
import { film } from './media';
import s from './landing.module.css';

// The promo film (English for every visitor). The still shows until play is pressed; phones get the 720p cut.
function PromoFilm({ lang, play, label, playing, onPlay }: { lang: 'en' | 'he'; play: string; label: string; playing: boolean; onPlay: () => void }) {
 return <div id="film" className={s.film}>
  {['tl', 'tr', 'bl', 'br'].map(c => <i key={c} className={s.corner} data-c={c} aria-hidden />)}
  <div className={s.filmFrame}>
   {playing
    ? <video key={lang} className={s.filmMedia} controls autoPlay playsInline poster={`/landing/poster-${lang}.webp`} aria-label={label}>
      <source src={film(`/landing/promo-${lang}-720.mp4`)} type="video/mp4" media="(max-width: 800px)" />
      <source src={film(`/landing/promo-${lang}.mp4`)} type="video/mp4" />
     </video>
    : <button type="button" className={s.filmStart} onClick={onPlay} aria-label={`${play}: ${label}`}>
      <img src={`/landing/poster-${lang}.webp`} alt="" className={s.filmMedia} />
      <span className={s.playButton}><span className={s.playChip}><Play size={18} strokeWidth={1.8} fill="currentColor" aria-hidden /></span>{play}</span>
     </button>}
  </div>
 </div>;
}

function Project({ href, text, newTab, tone, preview }: { href: string; text: ProjectCopy; newTab: string; tone?: 'dark'; preview: (active: boolean) => React.ReactNode }) {
 const [active, setActive] = useState(false);
 return <Link href={href} target="_blank" rel="noopener" className={s.project} aria-label={`${text.cta} (${newTab})`}
  onPointerEnter={e => e.pointerType === 'mouse' && setActive(true)} onPointerLeave={() => setActive(false)}
  onFocus={() => setActive(true)} onBlur={() => setActive(false)}>
  <span className={s.projectPreview} data-tone={tone}>
   {preview(active)}
   <span className={s.projectChip} aria-hidden><ArrowUpRight size={18} strokeWidth={2} /></span>
  </span>
  <span className={s.projectKind}>{text.kind}</span>
  <span className={s.projectName}>{text.name}</span>
  <span className={s.projectBody}>{text.body}</span>
 </Link>;
}

export default function Home({ buildingFrames, penthouseFrames, heritageFrames, spinFrames, tower }: { buildingFrames: string[]; penthouseFrames: string[]; heritageFrames: string[]; spinFrames: string[]; tower: { frames: string[]; skies: string[] } }) {
 const lang = useLang();
 const t = copy[lang];
 const filmLang = lang === 'he' ? 'he' : 'en';
 const [playing, setPlaying] = useState(false);
 const [scrolled, setScrolled] = useState(false);
 const header = useRef<HTMLElement>(null);
 const p = t.projects;

 useEffect(() => {
  const on = () => setScrolled(window.scrollY > 8);
  on(); window.addEventListener('scroll', on, { passive: true });
  return () => window.removeEventListener('scroll', on);
 }, []);
 const watch = () => { document.getElementById('film')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); setPlaying(true); };

 return <MotionConfig reducedMotion="user"><div className={s.page}>
  <header ref={header} className={s.header} data-scrolled={scrolled || undefined}>
   <Link href="/" className={s.brand} aria-label="residence.tech"><Logo /></Link>
   <nav className={s.nav} aria-label="Main">
    <a href="#how">{t.nav.how}</a>
    <a href="#package">{t.nav.package}</a>
    <a href="#projects">{t.nav.projects}</a>
   </nav>
   <LanguageSwitch id="home-lang" compact />
   <Button href="#try" size="sm" className={s.headerCta}>{t.nav.trial}</Button>
  </header>

  <main>
   <section className={s.hero}>
    <h1 className={s.title} aria-label={`${t.hero.lead} ${t.hero.to} ${t.hero.words[0]}`.replace(/\s+/g, ' ')}>
     <span className={s.titleLine} style={{ '--i': 0 } as React.CSSProperties} aria-hidden>{t.hero.lead}</span>
     <span className={s.titleLine} style={{ '--i': 1 } as React.CSSProperties} aria-hidden>{t.hero.to && <>{t.hero.to} </>}<Rotator words={t.hero.words} /></span>
    </h1>
    <div className={s.heroRow}>
     <div className={s.heroText}>
      <p className={s.lede}>{t.hero.ledeLead && <strong className={s.ledeLead}>{t.hero.ledeLead[0]}<u>{t.hero.ledeLead[1]}</u>{t.hero.ledeLead[2]}</strong>}{t.hero.lede}</p>
     </div>
     <div className={s.heroActions}>
      <Button href="#try">{t.hero.cta}</Button>
      <Button variant="ghost" icon={Play} onClick={watch}>{t.hero.watch}</Button>
     </div>
    </div>
    <PromoFilm lang="en" play={t.hero.play} label={t.hero.filmLabel} playing={playing} onPlay={() => setPlaying(true)} />
   </section>

   <Process t={t.process} />
   <Package t={t.package} spinFrames={spinFrames} buildingFrames={tower.frames} />   {/* the building card: SYMBOL's 360-view orbit */}
   <StylesSection />
   <TrialForm t={t.form} lang={filmLang} />

   <section id="projects" className={s.projects} aria-labelledby="projects-title">
    <div className={s.sectionHead}>
     <div>
      <h2 id="projects-title" className={s.sectionTitle}>{p.title}</h2>
      <p className={s.sectionLede}>{p.lede}</p>
     </div>
    </div>
    <div className={s.projectGrid}>
     <Project href={withLang('/projects/borges-15', lang)} text={p.heritage} newTab={p.newTab}
      preview={a => <BuildingPreview frames={heritageFrames} active={a} span={0.6} centre={0.5} />} />
     <Project href={withLang('/klee-8', lang)} text={p.boutique} newTab={p.newTab}
      preview={a => <FilmPreview poster="/projects/klee-8/media/apt-3/v-garden.webp" film={film("/projects/klee-8/media/apt-3/film.mp4")} active={a} />} />
     <Project href={withLang('/symbol', lang)} text={p.tower} newTab={p.newTab}
      preview={a => <BuildingPreview frames={tower.frames} skies={tower.skies} active={a} />} />
     <Project href={withLang('/projects/building-preview#explore', lang)} text={p.salesGallery} newTab={p.newTab}
      preview={a => <BuildingPreview frames={buildingFrames} active={a} />} />
     <Project href={withLang('/mozir-8', lang)} text={p.openHouse} newTab={p.newTab}
      preview={a => <FilmPreview poster="/media/01_living.webp" film={film("/media/residence-film.mp4")} active={a} />} />
     <Project href={withLang('/projects/afk-urban-comfort#explore', lang)} text={p.penthouse} newTab={p.newTab}
      preview={a => <BuildingPreview frames={penthouseFrames} active={a} span={0.6} centre={0.5} />} />
     <Project href={withLang('/studio-oryx', lang)} text={p.furniture} newTab={p.newTab}
      preview={a => <FilmPreview poster="/projects/studio-oryx/v1-hero-sm.jpg" film={film("/projects/studio-oryx/film-480p.mp4")} active={a} />} />
    </div>
   </section>
  </main>

  <footer className={s.footer}>
   <DimensionLine className={s.footerDim} />
   <div className={s.footerRow}>
    <Logo className={s.footerLogo} />
    <a href={`mailto:${t.footer.contact}`}>{t.footer.contact}</a>
    <span>© {new Date().getFullYear()} {t.footer.line}</span>
   </div>
  </footer>
  <WhatsAppButton label={t.footer.whatsapp} message={t.footer.whatsappText} />
 </div></MotionConfig>;
}
