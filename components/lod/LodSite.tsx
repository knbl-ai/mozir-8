'use client';
// Lod plot 4008 · rehabilitative day care. The Rua da Lapa / Symbol page order (360 stage → project on scroll →
// location → contact), rewritten for day care OPERATORS: what the building is for and how a child's day works.
// Stills: photoreal building stills + the approved classroom keyframes (no people). The 360 stage, the project film
// and the location map are still placeholders until those deliver. Hebrew first (RTL), English toggle. No people in any image until the user decides how to show children.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Expand, Mail, MapPin, MessageCircle, Phone, Play, Rotate3d, X } from 'lucide-react';
import LanguageSwitch from '@/components/LanguageSwitch';
import { useLang } from '@/lib/i18n';
import { CLASSES, FIGURES, FINISHES, HOTSPOTS, project, type Age, type Programme } from '@/content/projects/lod-daycare';
import { lodText } from './strings';
import LodOrbit from './LodOrbit';
import s from './lod.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;
const AGES: Age[] = ['infants', 'toddlers', 'children'];
const PROGRAMMES: Programme[] = ['mixed', 'comm'];
// scroll reveal: elements carry data-reveal; the page arms them only when JS runs and motion is allowed, and an
// IntersectionObserver marks each one data-in once (CSS does the 16-24 px rise / fade, staggered by --i)
const reveal = { 'data-reveal': '' } as const;
const rv = (i: number) => ({ 'data-reveal': '', style: { ['--i' as string]: i } as React.CSSProperties });

type Still = { src: string; label: string; full?: string; line?: string };

export default function LodSite() {
 const lang = useLang();
 const t = lodText[lang];
 const he = lang === 'he';
 const [lightbox, setLightbox] = useState<{ items: Still[]; i: number } | null>(null);
 const pageRef = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const root = pageRef.current;
  if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const els = [...root.querySelectorAll<HTMLElement>('[data-reveal]')];
  // arm everything below the hero; the observer reveals what is already in view on its first callback, the rest on scroll
  // (works after scroll restoration on reload, and when lang flips after hydration the attributes are simply re-applied)
  els.forEach(el => { if (!el.hasAttribute('data-in')) el.setAttribute('data-armed', ''); });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).setAttribute('data-in', ''); io.unobserve(e.target); } }),
   { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  els.forEach(el => { if (!el.hasAttribute('data-in')) io.observe(el); });
  return () => io.disconnect();
 }, [lang]);
 useEffect(() => { document.title = he ? 'מעון יום שיקומי · לוד · מגרש 4008' : 'Rehabilitative day care · Lod · Plot 4008'; }, [he]);
 const ph = project.placeholders;
 const st = project.stills;
 const G = (k: string, label: string): Still => ({ src: st[k].src, full: st[k].full, label });
 // lower gallery: the building and its facilities (no classroom images, so nothing repeats)
 const gallery: Still[] = ['aerial', 'street-ne', 'park-nw', 'park-front', 'golden', 'minibus']
  .map((k, i) => G(k, t.buildingGallery[i]));
 // interior gallery: classroom keyframes + the interior stills + the cut-away top view
 const classGal: Still[] = ['class-entry', 'class', 'kitchenette', 'changing', 'yard', 'car-seat-store', 'corridor', 'snoezelen', 'building-top']
  .map((k, i) => ({ ...G(k, t.classGallery[i][0]), line: t.classGallery[i][1] }));
 const figures = [String(FIGURES.classes), FIGURES.ages, String(FIGURES.classArea), FIGURES.footprint];
 const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${project.location.lat},${project.location.lng}`;

 return <MotionConfig reducedMotion="user"><div ref={pageRef} className={s.page}>
  {/* ---------------------------------------------------------------- header: crest, Kalkalit Lod, project */}
  <header className={s.bar}>
   <a href="#top" className={s.brand} aria-label={t.name}>
    <img src={project.brand.crest} alt={he ? 'עיריית לוד' : 'Lod Municipality'} className={s.crest} width={36} height={44} />
    <span className={s.brandSep} aria-hidden />
    <img src={project.brand.kalkalit} alt={he ? 'כלכלית לוד' : 'Kalkalit Lod'} className={s.kalkalit} width={112} height={45} />
    <span className={s.brandSep} data-wide aria-hidden />
    <span className={s.brandName} data-wide>{t.name}</span>
   </a>
   <div className={s.barEnd}>
    <LanguageSwitch id="lod-lang" compact tone="glass" />
    <a href="#tender" className={s.barCta}>{t.tender}</a>
   </div>
  </header>

  {/* ---------------------------------------------------------------- 360 stage (placeholder) */}
  <section id="top" className={s.stage}>
   <LodOrbit />
   <div className={s.stageShade} aria-hidden />
   <div className={s.stageCopy} data-hero-copy>
    <p className={s.eyebrow}>{t.stage.eyebrow}</p>
    <h1 className={s.hero}>{t.stage.title[0]} <span>{t.stage.title[1]}</span></h1>
    <p className={s.heroLead}>{t.stage.lead}</p>
   </div>
  </section>
  <div className={s.louvreBar} aria-hidden>{Array.from({ length: 48 }, (_, i) => <i key={i} />)}</div>

  {/* ---------------------------------------------------------------- the 30 s project film */}
  <section id="project-film" className={s.filmSection}>
   <div className={s.section} data-flush>
    <div className={s.head} {...reveal}>
     <p className={s.kicker}>{t.projectFilm.kicker}</p>
     <h2 className={s.display}>{t.projectFilm.title}</h2>
     <p className={s.lead}>{t.projectFilm.caption}</p>
    </div>
    <div className={s.filmFrame} {...reveal}>
     {project.projectFilm[he ? 'he' : 'en']
      ? <video key={lang} src={project.projectFilm[he ? 'he' : 'en']!.src} poster={project.projectFilm[he ? 'he' : 'en']!.poster} controls playsInline preload="none" />
      : <div className={s.filmPoster}>
       <img src={project.projectFilmPoster} alt="" loading="lazy" draggable={false} />
       <div className={s.filmEmpty}><span className={s.filmIcon}><Play size={26} strokeWidth={1.5} fill="currentColor" aria-hidden /></span><strong>{t.projectFilm.soon}</strong></div>
      </div>}
    </div>
   </div>
  </section>

  {/* ---------------------------------------------------------------- what this place is */}
  <section id="place" className={s.section}>
   <div className={s.head} {...reveal}>
    <p className={s.kicker}>{t.what.kicker}</p>
    <h2 className={s.display}>{t.what.title}</h2>
    <p className={s.lead}>{t.what.lead}</p>
   </div>
   <div className={s.figures}>
    {figures.map((v, i) => <div key={i} className={s.figure} {...rv(i)}>
     <strong><bdi dir="ltr"><CountUp text={v} /></bdi></strong><span>{t.what.figures[i][0]}</span><small>{t.what.figures[i][1]}</small>
    </div>)}
   </div>

   <div className={s.classGrid} role="table" aria-label={t.what.gridTitle}>
    <div className={s.cgCorner} role="columnheader">{t.what.gridTitle}</div>
    {AGES.map(a => <div key={a} className={s.cgAge} role="columnheader">{t.ages[a]}</div>)}
    {PROGRAMMES.map(p => <div key={p} className={s.cgRow} role="row">
     <div className={s.cgProg} role="rowheader">{t.programme[p]}</div>
     {AGES.map(a => { const c = CLASSES.find(x => x.programme === p && x.age === a)!; return <div key={a} className={s.cgCell} role="cell" data-reveal="" style={{ ['--c' as string]: c.colour, ['--i' as string]: c.n - 1 }}>
      <b>{c.n}</b><span>{t.classN(c.n)}</span><small>{t.programme[p]} · {t.ages[a]}</small>
     </div>; })}
    </div>)}
   </div>

   <div className={s.wings}>
    {t.what.wings.map((w, i) => <section key={w.title} className={s.wing} {...rv(i)}>
     <h3>{w.title}</h3>
     <ul>{w.items.map(x => <li key={x}>{x}</li>)}</ul>
    </section>)}
   </div>
   <p className={s.note}>{t.what.areaNote(FIGURES.net, FIGURES.gross)}</p>
  </section>

  {/* ---------------------------------------------------------------- a child's day */}
  <section id="day" className={s.daySection}>
   <div className={s.section} data-flush>
    <div className={s.head} {...reveal}>
     <p className={s.kicker}>{t.day.kicker}</p>
     <h2 className={s.display}>{t.day.title}</h2>
     <p className={s.lead}>{t.day.lead}</p>
    </div>
    <AutoGallery items={classGal} onOpen={i => setLightbox({ items: classGal, i })} captions />
   </div>
  </section>

  {/* ---------------------------------------------------------------- gallery */}
  <section id="gallery" className={s.darkBand}>
   <div className={s.section} data-flush>
   <div className={s.head} {...reveal}>
    <p className={s.kicker}>{t.gallery.kicker}</p>
    <h2 className={s.display}>{t.gallery.title}</h2>
    <p className={s.lead}>{t.gallery.note}</p>
   </div>
   <div className={s.gallery}>
    {gallery.map((g, i) => <figure key={g.src} className={s.tile} data-k={i} {...rv(i)}>
     <button type="button" onClick={() => setLightbox({ items: gallery, i })} aria-label={g.label}><img src={g.src} alt={g.label} loading="lazy" draggable={false} /></button>
     <figcaption><span>{g.label}</span></figcaption>
    </figure>)}
   </div>
   </div>
  </section>

  {/* ---------------------------------------------------------------- finishes */}
  <section id="finishes" className={s.section}>
   <div className={s.split}>
    <div {...reveal}><p className={s.kicker}>{t.finishes.kicker}</p><h2 className={s.display}>{t.finishes.title}</h2></div>
    <p className={s.lead} {...reveal}>{t.finishes.lead}</p>
   </div>
   <div className={s.finishGrid}>
    <section className={s.finishGroup} {...reveal}>
     <h3>{t.finishes.facade}</h3>
     <ul className={s.plain}>{t.finishes.facadeItems.map(x => <li key={x}>{x}</li>)}</ul>
     <p className={s.finishNote}>{t.finishes.facadeNote}</p>
    </section>
    <section className={s.finishGroup} {...reveal}>
     <h3>{t.finishes.louvres}</h3>
     <ul className={s.swatches}>{FINISHES.louvres.map(f => <li key={f.code}><i style={{ background: f.hex }} /><span>{f.name[he ? 'he' : 'en']}</span><code dir="ltr">Abet {f.code}</code></li>)}</ul>
     <figure className={s.louvreImg}><img src={st['park-front'].src} alt={t.stills.parkFront} loading="lazy" /></figure>
    </section>
    <section className={s.finishGroup} {...reveal}>
     <h3>{t.finishes.interior}</h3>
     <ul className={s.plain}>{t.finishes.inside.map(x => <li key={x}>{x}</li>)}</ul>
    </section>
   </div>
  </section>

  {/* ---------------------------------------------------------------- location */}
  <section id="location" className={s.section}>
   <div className={s.locGrid}>
    <div {...reveal}>
     <p className={s.kicker}>{t.location.kicker}</p>
     <h2 className={s.display}>{t.location.title}</h2>
     <p className={s.lead}>{t.location.lead}</p>
     <a className={s.textLink} href={mapsUrl} target="_blank" rel="noreferrer"><MapPin size={15} strokeWidth={1.7} aria-hidden />{t.location.map}<ArrowUpRight size={14} strokeWidth={1.8} aria-hidden /></a>
    </div>
    <figure className={s.mapFig} {...reveal}><img src={ph.map} alt={t.location.title} loading="lazy" /><small>{t.location.mapNote}</small></figure>
   </div>
  </section>

  {/* ---------------------------------------------------------------- tender / operator contact */}
  <section id="tender" className={s.tender}>
   <div className={s.tenderCard} {...reveal}>
    <p className={s.kicker}>{t.contact.kicker}</p>
    <h2 className={s.display}>{t.contact.title}</h2>
    <p className={s.lead}>{t.contact.lead}</p>
    <ContactCard />
   </div>
  </section>

  <footer className={s.footer}>
   <div className={s.footBrand}>
    <img src={project.brand.crest} alt="" width={34} height={42} />
    <img src={project.brand.kalkalitWhite} alt={he ? 'כלכלית לוד' : 'Kalkalit Lod'} width={120} height={48} />
   </div>
   <p>{t.footer.client}</p>
   <p className={s.archLine}>{t.footer.architect}</p>
   <a className={s.textLink} href="https://residence.tech" target="_blank" rel="noreferrer">residence.tech<ArrowUpRight size={14} strokeWidth={1.8} aria-hidden /></a>
   <p className={s.disclaimer}>{t.footer.disclaimer}</p>
  </footer>

  <AnimatePresence>{lightbox && <Lightbox key="lb" {...lightbox} onClose={() => setLightbox(null)} />}</AnimatePresence>
 </div></MotionConfig>;
}

// the tender contact card (KLEE agent-card pattern): placeholders + inactive buttons until content has a real contact
function ContactCard() {
 const lang = useLang(); const t = lodText[lang]; const c = project.contact;
 const initials = c.name ? c.name.split(/\s+/).map(w => w[0]).join('').slice(0, 2) : 'NA';
 const intl = (c.phoneIntl || c.phone || '').replace(/[^\d+]/g, '');
 return <div className={s.agent}>
  <div className={s.agentWho}>
   <span className={s.agentAvatar} aria-hidden>{initials}</span>
   <span><strong>{c.name || t.contact.namePending}</strong><small>{t.contact.role}</small></span>
  </div>
  <div className={s.agentActions}>
   {c.phone
    ? <>
     <a className={s.agentPrimary} href={`tel:${intl}`}><Phone size={15} strokeWidth={1.8} aria-hidden /><span dir="ltr">{c.phone}</span></a>
     <a className={s.agentButton} href={`https://wa.me/${intl.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"><MessageCircle size={15} strokeWidth={1.8} aria-hidden />{t.contact.whatsapp}</a>
    </>
    : <span className={s.agentPrimary} role="link" aria-disabled="true" data-off=""><Phone size={15} strokeWidth={1.8} aria-hidden />{t.contact.phonePending}</span>}
   {c.email && <a className={s.agentButton} href={`mailto:${c.email}`}><Mail size={15} strokeWidth={1.8} aria-hidden />{t.contact.email}</a>}
  </div>
 </div>;
}

// a figure that counts up when it scrolls into view (digits only; "0–3" and "67 × 30" count each number)
function CountUp({ text }: { text: string }) {
 const ref = useRef<HTMLSpanElement>(null);
 const [shown, setShown] = useState(text);
 useEffect(() => {
  const el = ref.current;
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const nums = text.match(/\d+/g)?.map(Number) ?? [];
  if (!nums.length) return;
  const fmt = (k: number) => { let n = 0; return text.replace(/\d+/g, () => String(Math.round(nums[n++] * k))); };
  setShown(fmt(0));
  let raf = 0;
  const io = new IntersectionObserver(([e]) => {
   if (!e.isIntersecting) return; io.disconnect();
   const t0 = performance.now(), d = 1400;
   const step = (t: number) => { const k = Math.min(1, (t - t0) / d); setShown(fmt(1 - Math.pow(1 - k, 3))); if (k < 1) raf = requestAnimationFrame(step); };
   raf = requestAnimationFrame(step);
  }, { threshold: 0.4 });
  io.observe(el);
  return () => { io.disconnect(); cancelAnimationFrame(raf); };
 }, [text]);
 return <span ref={ref} className={s.tab}>{shown}</span>;
}

// big image + thumbnails, auto-advances every 5 s (crossfade), pauses on hover / touch / focus, a thumbnail jumps and
// restarts the timer; no auto-advance with prefers-reduced-motion. The big image opens the lightbox at full size.
function AutoGallery({ items, onOpen, captions = false }: { items: Still[]; onOpen: (i: number) => void; captions?: boolean }) {
 const lang = useLang(); const t = lodText[lang];
 const [i, setI] = useState(0);
 const [prev, setPrev] = useState(-1);
 const [paused, setPaused] = useState(false);
 const [tick, setTick] = useState(0);
 const thumbs = useRef<HTMLDivElement>(null);
 const n = items.length;
 useEffect(() => {
  if (paused || typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const id = setInterval(() => setI(v => { setPrev(v); return (v + 1) % n; }), 5000);
  return () => clearInterval(id);
 }, [paused, n, tick]);
 useEffect(() => {
  const box = thumbs.current, el = box?.querySelector<HTMLElement>('[data-on]');
  if (box && el) box.scrollTo({ left: el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' });
 }, [i]);
 const go = (k: number) => { setPrev(i); setI((k + n) % n); setTick(v => v + 1); };
 const cur = items[i];
 return <div className={s.ag} onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
  onTouchStart={() => setPaused(true)}>
  <div className={s.agStage}>
   {/* clean crossfade: the outgoing image stays fully opaque underneath while the new one fades in on top */}
   {items.map((it, k) => <img key={it.src} src={it.src} alt={k === i ? it.label : ''} aria-hidden={k !== i} className={s.agImg}
    data-on={k === i || undefined} data-prev={(k === prev && k !== i) || undefined} loading={k < 2 ? 'eager' : 'lazy'} draggable={false} />)}
   <button type="button" className={s.agOpen} onClick={() => onOpen(i)} aria-label={`${t.galleryUi.open}: ${cur.label}`}><Expand size={16} strokeWidth={1.8} aria-hidden /></button>
   <button type="button" className={s.agHit} onClick={() => onOpen(i)} aria-label={`${t.galleryUi.open}: ${cur.label}`} />
   <button type="button" className={s.agNav} data-side="prev" aria-label={t.galleryUi.prev} onClick={() => go(i - 1)}><ChevronLeft size={20} strokeWidth={1.8} aria-hidden /></button>
   <button type="button" className={s.agNav} data-side="next" aria-label={t.galleryUi.next} onClick={() => go(i + 1)}><ChevronRight size={20} strokeWidth={1.8} aria-hidden /></button>
  </div>
  <div className={s.agCap} aria-live="polite">
   <div key={cur.src} className={s.agCapText}><strong>{cur.label}</strong>{captions && cur.line && <span>{cur.line}</span>}</div>
   <small dir="ltr">{i + 1} / {n}</small>
  </div>
  <div ref={thumbs} className={s.agThumbs}>
   {items.map((it, k) => <button key={it.src} type="button" data-on={k === i || undefined} aria-label={it.label} aria-current={k === i || undefined} onClick={() => go(k)}>
    <img src={it.src} alt="" loading="lazy" draggable={false} />
   </button>)}
  </div>
 </div>;
}

function Lightbox({ items, i: start, onClose }: { items: Still[]; i: number; onClose: () => void }) {
 const lang = useLang(); const t = lodText[lang]; const rtl = lang === 'he';
 const [i, setI] = useState(start); const n = items.length;
 const [zoom, setZoom] = useState(false);
 const closeRef = useRef<HTMLButtonElement>(null);
 const touch = useRef<number | null>(null);
 const move = (d: number) => { setZoom(false); setI(v => (v + d + n) % n); };
 useEffect(() => {
  closeRef.current?.focus();
  const k = (e: KeyboardEvent) => {
   if (e.key === 'Escape') onClose();
   if (e.key === 'ArrowRight') move(rtl ? -1 : 1); if (e.key === 'ArrowLeft') move(rtl ? 1 : -1);
  };
  window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [n, onClose, rtl]);
 const it = items[i];
 return <motion.div className={s.lightbox} role="dialog" aria-modal="true" aria-label={it.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={onClose}
  onTouchStart={e => { touch.current = e.touches[0].clientX; }}
  onTouchEnd={e => { if (touch.current === null || zoom) return; const dx = e.changedTouches[0].clientX - touch.current; touch.current = null; if (Math.abs(dx) > 50) move((dx < 0 ? 1 : -1) * (rtl ? -1 : 1)); }}>
  <div className={s.lbStage} data-zoom={zoom || undefined} onClick={e => { e.stopPropagation(); setZoom(z => !z); }} title={t.galleryUi.zoom}>
   <img src={it.full ?? it.src} alt={it.label} draggable={false} />
  </div>
  <p className={s.lbCaption} onClick={e => e.stopPropagation()}>{it.label}<small dir="ltr">{i + 1} / {n}</small></p>
  {n > 1 && <>
   <button type="button" className={s.lbNav} data-side="prev" aria-label={t.galleryUi.prev} onClick={e => { e.stopPropagation(); move(-1); }}><ChevronLeft size={22} strokeWidth={1.6} aria-hidden /></button>
   <button type="button" className={s.lbNav} data-side="next" aria-label={t.galleryUi.next} onClick={e => { e.stopPropagation(); move(1); }}><ChevronRight size={22} strokeWidth={1.6} aria-hidden /></button>
  </>}
  <button ref={closeRef} type="button" className={s.lbClose} aria-label={t.galleryUi.close} onClick={onClose}><X size={18} strokeWidth={1.7} aria-hidden /></button>
 </motion.div>;
}
