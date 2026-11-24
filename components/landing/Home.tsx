'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CookieSettingsLink } from '@/components/CookieConsent';
import { MotionConfig } from 'motion/react';
import { ArrowUpRight, Play } from 'lucide-react';
import LanguageSwitch from '@/components/LanguageSwitch';
import Logo from '@/components/brand/Logo';
import { useLang, withLang } from '@/lib/i18n';
import { copy, type ProjectCopy } from './copy';
import BuildingPreview from './BuildingPreview';
import FilmPreview from './FilmPreview';
import FilmsSection from './FilmsSection';
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

function Project({ href, text, newTab, tone, wide, logo, preview }: { href: string; text: ProjectCopy; newTab: string; tone?: 'dark'; wide?: boolean; logo?: { src: string; alt: string }; preview: (active: boolean) => React.ReactNode }) {
 const [active, setActive] = useState(false);
 return <Link href={href} target="_blank" rel="noopener" className={s.project} data-wide={wide || undefined} aria-label={`${text.cta} (${newTab})`}
  onPointerEnter={e => e.pointerType === 'mouse' && setActive(true)} onPointerLeave={() => setActive(false)}
  onFocus={() => setActive(true)} onBlur={() => setActive(false)}>
  <span className={s.projectPreview} data-tone={tone}>
   {preview(active)}
   <span className={s.projectChip} aria-hidden><ArrowUpRight size={18} strokeWidth={2} /></span>
   {logo && <span className={s.projectLogo}><img src={logo.src} alt={logo.alt} /></span>}
  </span>
  <span className={s.projectKind}>{text.kind}</span>
  <span className={s.projectName}>{text.name}</span>
  <span className={s.projectBody}>{text.body}</span>
 </Link>;
}

const ICON = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true } as const;
// The accounts residence.tech posts to (Instagram: none for now).
const SOCIALS = [
 { name: 'LinkedIn', href: 'https://www.linkedin.com/company/145389579', icon: <svg {...ICON}><path d="M20.450 20.450h-3.550v-5.570c0-1.330-.020-3.040-1.850-3.040-1.850 0-2.140 1.450-2.140 2.950v5.660H9.350V9h3.410v1.560h.050c.470-.900 1.630-1.850 3.360-1.850 3.600 0 4.270 2.370 4.270 5.460v6.280ZM5.340 7.430a2.060 2.060 0 1 1 0-4.130 2.060 2.060 0 0 1 0 4.130ZM7.120 20.450H3.560V9h3.560v11.450ZM22.220 0H1.770C.790 0 0 .770 0 1.730v20.540C0 23.230.790 24 1.770 24h20.450c.980 0 1.780-.770 1.780-1.730V1.730C24 .770 23.200 0 22.220 0Z"/></svg> },
 { name: 'Facebook', href: 'https://www.facebook.com/1452936557894342', icon: <svg {...ICON}><path d="M24 12.070C24 5.410 18.630 0 12 0S0 5.410 0 12.070C0 18.100 4.390 23.090 10.130 24v-8.440H7.080v-3.490h3.050V9.410c0-3.020 1.790-4.690 4.530-4.690 1.310 0 2.690.240 2.690.240v2.970h-1.510c-1.490 0-1.960.930-1.960 1.890v2.260h3.330l-.530 3.490h-2.800V24C19.610 23.090 24 18.100 24 12.070Z"/></svg> },
 { name: 'YouTube', href: 'https://www.youtube.com/@ResidenceTech-p4t', icon: <svg {...ICON}><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.900.5A3 3 0 0 0 1 7.200C.5 9.100.5 12 .5 12s0 2.900.5 4.800a3 3 0 0 0 2.100 2.100c1.900.5 8.900.5 8.900.5s7 0 8.900-.5a3 3 0 0 0 2.100-2.100c.5-1.900.5-4.800.5-4.800s0-2.900-.5-4.800ZM9.600 15.500v-7l6 3.500-6 3.500Z"/></svg> },
];

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
   <Package t={t.package} spinFrames={spinFrames} buildingFrames={tower.frames} />   {/* the building card: Rua da Lapa's 360-view orbit */}
   <FilmsSection />
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
     {/* first card: the newest project, with the developer's logo */}
     <Project href={withLang('/weizmann-97-apt-2', lang)} text={p.garden} newTab={p.newTab}
      logo={{ src: '/projects/weizmann-97/logo.png', alt: p.garden.company ?? '' }}
      preview={a => <FilmPreview poster="/projects/weizmann-97/poster.webp" film={film('/projects/weizmann-97/film-preview.mp4')} active={a} />} />
     <Project href={withLang('/projects/borges-15', lang)} text={p.heritage} newTab={p.newTab}
      preview={a => <BuildingPreview frames={heritageFrames} active={a} span={0.6} centre={0.5} />} />
     <Project href={withLang('/klee-8', lang)} text={p.boutique} newTab={p.newTab}
      preview={a => <FilmPreview poster="/projects/klee-8/media/apt-3/v-garden.webp" film={film("/projects/klee-8/media/apt-3/film.mp4")} active={a} />} />
     <Project href={withLang('/studio-oryx', lang)} text={p.furniture} newTab={p.newTab}
      preview={a => <FilmPreview poster="/projects/studio-oryx/v1-hero-sm.jpg" film={film("/projects/studio-oryx/film-480p.mp4")} active={a} />} />
     <Project href={withLang('/projects/building-preview#explore', lang)} text={p.salesGallery} newTab={p.newTab}
      preview={a => <BuildingPreview frames={buildingFrames} active={a} />} />
     <Project href={withLang('/hayarkon-56', lang)} text={p.interior} newTab={p.newTab}
      preview={a => <FilmPreview poster="/projects/hayarkon-56/living-m.webp" film={film("/projects/hayarkon-56/film-preview.mp4")} active={a} />} />
     <Project href={withLang('/rua-da-lapa', lang)} text={p.tower} newTab={p.newTab}
      preview={a => <BuildingPreview frames={tower.frames} skies={tower.skies} active={a} />} />
     <Project href={withLang('/lod-daycare', lang)} text={p.daycare} newTab={p.newTab}
      preview={a => <FilmPreview poster="/projects/lod-daycare/stills/golden.webp" film={film(`/projects/lod-daycare/film/lod-film-${filmLang}.mp4`)} active={a} />} />
    </div>
   </section>
  </main>

  <footer className={s.footer}>
   <DimensionLine className={s.footerDim} />
   <div className={s.footerRow}>
    <Logo className={s.footerLogo} />
    <a href={`mailto:${t.footer.contact}`}>{t.footer.contact}</a>
    <nav className={s.socials} aria-label="Social media">
     {SOCIALS.map(x => <a key={x.name} href={x.href} target="_blank" rel="noopener noreferrer" aria-label={x.name}>{x.icon}</a>)}
    </nav>
    <span>© {new Date().getFullYear()} {t.footer.line}</span>
    <CookieSettingsLink />
   </div>
  </footer>
  <WhatsAppButton label={t.footer.whatsapp} message={t.footer.whatsappText} />
 </div></MotionConfig>;
}
