'use client';
// Hayarkon 56, apartment 2 (Noga Group, Tel Aviv): the interior-design edition. Built around the apartment's materials:
// six swatches cut from the renders lead into the rooms, then the film, the 3D model and the style library.
// The apartment's own sales page stays at /hayarkon-56-apt-2 (pipeline page, app/[slug]).
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Smartphone, X } from 'lucide-react';
import LanguageSwitch from '@/components/LanguageSwitch';
import ResidenceModel from '@/components/building/ResidenceModel';
import { film } from '@/components/landing/media';
import { useLang, withLang } from '@/lib/i18n';
import { FILMS, MATERIALS, ROOMS, hayarkonText, type MaterialId } from './strings';
import s from './hayarkon.module.css';

const BASE = '/projects/hayarkon-56';
const img = (n: string, size: '' | '-m' = '') => `${BASE}/${n}${size}.webp`;
// every room image, in walk order, for the lightbox
const GALLERY = ROOMS.flatMap(r => [r.image, ...(r.alt ? [r.alt] : [])]);

export default function HayarkonSite() {
 const lang = useLang(); const t = hayarkonText[lang];
 const L = (l: { en: string; he: string }) => lang === 'he' ? l.he : l.en;
 const [active, setActive] = useState<MaterialId>('teak');
 const [playing, setPlaying] = useState(false);
 const [cut, setCut] = useState(0);
 const shown = FILMS[cut];
 const [open, setOpen] = useState<number | null>(null);
 const video = useRef<HTMLVideoElement>(null);
 const material = MATERIALS.find(m => m.id === active)!;
 const roomsWith = ROOMS.filter(r => r.materials.includes(active)).map(r => lang === 'he' ? L(r.name) : L(r.name).toLowerCase());
 const roomOf = (image: string) => ROOMS.find(r => r.image === image || r.alt === image)!;

 // The hero buttons bring the film / the model itself to the middle of the window, not the top of its section.
 const show = (id: string) => (e: React.MouseEvent) => {
  const el = document.getElementById(id); if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
 };
 const play = () => { const v = video.current; if (!v) return; v.muted = false; void v.play(); setPlaying(true); };
 // A film card: that film plays in the frame (brought into view when it is off screen); if the browser blocks the
 // start, its play button comes back.
 const pick = (i: number) => {
  setCut(i); setPlaying(true);
  const frame = document.getElementById('film-frame')?.getBoundingClientRect();
  if (frame && (frame.top < 0 || frame.bottom > window.innerHeight)) document.getElementById('film-frame')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
 };
 useEffect(() => {
  const v = video.current;
  if (v && playing && v.paused) { v.muted = false; v.play().catch(() => setPlaying(false)); }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only when another film is picked
 }, [cut]);

 return <div className={s.page}>
  <header className={s.bar}>
   <a href={withLang('/', lang)} className={s.home}>{t.home}</a>
   <LanguageSwitch id="hayarkon-lang" compact />
  </header>

  <section className={s.hero}>
   <img className={s.heroImage} src={img('living')} alt={t.heroAlt} fetchPriority="high" />
   <div className={s.heroText}>
    <h1 className={s.title}>{t.title}</h1>
    <div className={s.heroSide}>
     <p className={s.lede}>{t.lede}</p>
     <div className={s.actions}>
      <a className={s.filmButton} href="#film" onClick={show('film-frame')}>
       <span className={s.filmThumb} aria-hidden>
        <video src={film(`${BASE}/film-preview.mp4`)} poster={img('living', '-m')} muted loop playsInline autoPlay preload="metadata" />
        <Play size={14} strokeWidth={0} fill="currentColor" />
       </span>
       <span className={s.filmLabel}>{t.watch}<small>{t.filmLength}</small></span>
      </a>
      <a className={s.secondary} href="#model" onClick={show('model-frame')}>{t.turn}</a>
     </div>
     <p className={s.credit}>{t.credit}</p>
    </div>
   </div>
  </section>

  <section className={s.materials} aria-labelledby="materials-title">
   <div className={s.materialsHead}>
    <h2 id="materials-title" className={s.h2}>{t.materialsTitle}</h2>
    <p>{t.materialsLede}</p>
   </div>
   <div className={s.swatches} role="radiogroup" aria-labelledby="materials-title">
    {MATERIALS.map(m => <button key={m.id} type="button" role="radio" aria-checked={active === m.id} className={s.swatch}
     onClick={() => setActive(m.id)} onMouseEnter={() => setActive(m.id)} onFocus={() => setActive(m.id)}>
     <img src={`${BASE}/swatches/${m.id}.webp`} alt="" loading="lazy" />
     <span className={s.swatchName}>{L(m.name)}</span>
     <span className={s.swatchHex} dir="ltr">{m.hex}</span>
    </button>)}
   </div>
   <p className={s.where} aria-live="polite">
    <span className={s.chip} style={{ background: material.hex }} aria-hidden />
    <span><b>{L(material.name)}.</b> {L(material.where)} <span className={s.found}>{t.foundIn}: {roomsWith.join(', ')}.</span></span>
   </p>
  </section>

  <section className={s.rooms} aria-labelledby="rooms-title">
   <h2 id="rooms-title" className={s.h2}>{t.roomsTitle}</h2>
   {ROOMS.map((r, i) => <article key={r.id} className={s.room} data-side={i % 2 ? 'end' : 'start'} data-match={r.materials.includes(active) || undefined}>
    <button type="button" className={s.roomImage} onClick={() => setOpen(GALLERY.indexOf(r.image))} aria-label={t.open(L(r.name))}>
     <img src={img(r.image, '-m')} srcSet={`${img(r.image, '-m')} 960w, ${img(r.image)} 2048w`} sizes="(max-width: 760px) 100vw, 62vw" alt={L(r.name)} loading="lazy" />
    </button>
    <div className={s.roomText}>
     <h3 className={s.h3}>{L(r.name)}</h3>
     <p>{L(r.note)}</p>
     <ul className={s.roomMaterials}>
      {r.materials.map(id => { const m = MATERIALS.find(x => x.id === id)!;
       return <li key={id} data-on={id === active || undefined}><span className={s.chip} style={{ background: m.hex }} aria-hidden />{L(m.name)}</li>; })}
     </ul>
     {r.alt && <button type="button" className={s.more} onClick={() => setOpen(GALLERY.indexOf(r.alt!))}>
      <img src={img(r.alt, '-m')} alt="" loading="lazy" /><span>{t.another}</span>
     </button>}
    </div>
   </article>)}
  </section>

  <section id="film" className={s.film} aria-labelledby="film-title">
   <div className={s.filmHead}>
    <h2 id="film-title" className={s.h2}>{t.filmTitle}</h2>
    <p>{t.filmLede}</p>
   </div>
   <div id="film-frame" className={s.filmFrame} data-vertical={'vertical' in shown || undefined}>
    {'vertical' in shown && <img className={s.filmBlur} src={`${BASE}/${shown.poster}`} alt="" aria-hidden />}
    <video key={shown.id} ref={video} src={film(`${BASE}/${shown.src}`)} poster={`${BASE}/${shown.poster}`} playsInline preload="metadata"
     controls={playing} onPlay={() => setPlaying(true)} onEnded={() => setPlaying(false)} />
    {!playing && <button type="button" className={s.play} onClick={play} aria-label={t.play}><Play size={28} strokeWidth={1.5} fill="currentColor" aria-hidden /></button>}
   </div>
   <div className={s.cuts} role="radiogroup" aria-label={t.films}>
    {FILMS.map((f, i) => <button key={f.id} type="button" role="radio" aria-checked={i === cut} className={s.cut} onClick={() => pick(i)}>
     <span className={s.cutThumb}>
      <img src={`${BASE}/${f.poster}`} alt="" loading="lazy" />
      {'vertical' in f && <span className={s.cutBadge}><Smartphone size={12} strokeWidth={2} aria-hidden />{t.vertical}</span>}
      <span className={s.cutTime}>{f.length}</span>
     </span>
     <span className={s.cutName}>{L(f.name)}</span>
     <span className={s.cutNote}>{L(f.note)}</span>
    </button>)}
   </div>
  </section>

  <section id="model" className={s.model} aria-labelledby="model-title">
   <div className={s.modelHead}>
    <h2 id="model-title" className={s.h2}>{t.modelTitle}</h2>
    <p>{t.modelLede}</p>
    <button type="button" className={s.plan} onClick={() => setOpen(GALLERY.length)}><img src={img('top', '-m')} alt={t.planAlt} loading="lazy" /></button>
   </div>
   <div id="model-frame" className={s.modelFrame}>
    <ResidenceModel src={`${BASE}/model.glb`} poster={`${BASE}/model-poster.webp`} defaultOrbit="-45deg 52deg 100%" outdoorOrbit="-70deg 58deg 72%" stage="paper" />
   </div>
  </section>

  <section className={s.closing}>
   <h2 className={s.h2}>{t.closingTitle}</h2>
   <p>{t.closingLede}</p>
   <div className={s.actions}>
    <a className={s.primary} href={withLang('/styles', lang)}>{t.styles}</a>
    <a className={s.secondary} href={withLang('/#try', lang)}>{t.tryIt}</a>
   </div>
  </section>

  <footer className={s.footer}>
   <p><b>{t.address}</b><br />{t.credit}</p>
   <nav><a href={withLang('/hayarkon-56-apt-2', lang)}>{t.salesPage}</a><a href={withLang('/', lang)}>{t.home}</a></nav>
   <p className={s.disclaimer}>{t.disclaimer}</p>
  </footer>

  {open !== null && <Lightbox index={open} onClose={() => setOpen(null)} onMove={setOpen}
   items={[...GALLERY.map(n => ({ src: img(n), label: L(roomOf(n).name) })), { src: img('top'), label: t.planAlt }]} />}
 </div>;
}

function Lightbox({ items, index, onClose, onMove }: { items: { src: string; label: string }[]; index: number; onClose: () => void; onMove: (i: number) => void }) {
 const t = hayarkonText[useLang()];
 const ref = useRef<HTMLDialogElement>(null);
 const n = items.length, go = (d: number) => onMove((index + d + n) % n);
 useEffect(() => { ref.current?.showModal(); }, []);
 useEffect(() => {
  const rtl = document.documentElement.dir === 'rtl';
  const k = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') go(rtl ? -1 : 1); if (e.key === 'ArrowLeft') go(rtl ? 1 : -1); };
  window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
 });
 return <dialog ref={ref} className={s.lightbox} onClose={onClose} onClick={e => { if (e.target === ref.current) onClose(); }} aria-label={items[index].label}>
  <img src={items[index].src} alt={items[index].label} />
  <div className={s.lightboxBar}>
   <span>{items[index].label}</span>
   <span className={s.lightboxNav}>
    <button type="button" onClick={() => go(-1)} aria-label={t.prev}><ChevronLeft size={18} aria-hidden /></button>
    <span dir="ltr">{index + 1} / {n}</span>
    <button type="button" onClick={() => go(1)} aria-label={t.next}><ChevronRight size={18} aria-hidden /></button>
    <button type="button" onClick={onClose} aria-label={t.close}><X size={18} aria-hidden /></button>
   </span>
  </div>
 </dialog>;
}
