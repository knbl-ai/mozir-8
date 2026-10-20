'use client';
import { useEffect, useRef, useState } from 'react';
import LanguageSwitch from '@/components/LanguageSwitch';
import { useLang } from '@/lib/i18n';
import { film } from '@/components/landing/media';
import { M, viewIds, pieces, oryxText, type OryxText, type ViewId } from './content';
import s from './oryx.module.css';

const X = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
 <path d="M5 5 19 19M19 5 5 19" strokeWidth="4.2" strokeLinecap="round" />
</svg>;

type Open = { kind: 'view'; i: number } | { kind: 'piece'; code: string } | null;
const vi = (id: ViewId) => viewIds.indexOf(id);

// The film plays muted while it is on screen and pauses when it leaves (never with reduced motion).
function RoomFilm({ t }: { t: OryxText }) {
 const box = useRef<HTMLDivElement>(null);
 const video = useRef<HTMLVideoElement>(null);
 const [muted, setMuted] = useState(true);
 const [playing, setPlaying] = useState(false);
 useEffect(() => {
  const v = video.current, el = box.current;
  if (!v || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: .55 });
  io.observe(el);
  return () => io.disconnect();
 }, []);
 const toggle = () => { const v = video.current; if (!v) return; if (v.paused) v.play().catch(() => {}); else v.pause(); };
 return <div ref={box} id="room-film" className={s.filmBox}>
  <video ref={video} src={film(M + 'film-480p.mp4')} poster={M + 'film-poster.jpg'} muted={muted} loop playsInline preload="metadata"
   onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onClick={toggle} />
  <div className={s.filmControls}>
   <button onClick={toggle}>{playing ? t.pause : t.play}</button>
   <button onClick={() => setMuted(m => !m)} aria-pressed={!muted}>{muted ? t.soundOn : t.soundOff}</button>
  </div>
 </div>;
}

function Shot({ id, t, onOpen, className }: { id: ViewId; t: OryxText; onOpen: (i: number) => void; className?: string }) {
 const v = t.views[id];
 return <button className={`${s.shot} ${className ?? ''}`} onClick={() => onOpen(vi(id))} aria-label={t.fullScreen(v.title)}>
  <img src={M + id + '.jpg'} alt={v.text} loading="lazy" />
  <span className={s.shotCap}>{v.title}</span>
 </button>;
}

export default function OryxSite() {
 const lang = useLang(); const t = oryxText[lang]; const rtl = lang === 'he';
 const [open, setOpen] = useState<Open>(null);
 const dialog = useRef<HTMLDialogElement>(null);
 const last = useRef<HTMLElement | null>(null);

 useEffect(() => {
  if (open) { last.current = document.activeElement as HTMLElement; if (!dialog.current?.open) dialog.current?.showModal(); document.body.style.overflow = 'hidden'; }
  else { dialog.current?.close(); document.body.style.overflow = ''; last.current?.focus(); }
  return () => { document.body.style.overflow = ''; };
 }, [open]);

 const close = () => setOpen(null);
 const showView = (i: number) => setOpen({ kind: 'view', i });
 const move = (d: number) => setOpen(o => o?.kind === 'view' ? { kind: 'view', i: (o.i + d + viewIds.length) % viewIds.length } : o);
 const piece = open?.kind === 'piece' ? pieces.find(p => p.code === open.code) : undefined;
 const name = (code: string) => t.pieces[code].title;
 // straight to the video's top edge (the site's global scroll-padding-top would leave the heading in view)
 const toFilm = (e: React.MouseEvent) => { e.preventDefault(); const f = document.getElementById('room-film'); if (f) window.scrollTo({ top: f.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' }); };

 return <div className={s.page}>
  <header className={s.header}>
   <a href="#" className={s.mark}><X className={s.markX} />Studio ORYX</a>
   <div className={s.headerEnd}>
    <LanguageSwitch id="oryx-lang" compact tone="glass" />
    <a href="#room-film" className={s.headerLink} onClick={toFilm}>{t.watch}</a>
   </div>
  </header>

  <main>
   <section className={s.hero} aria-labelledby="oryx-title">
    <img className={s.heroImg} src={M + 'v1-hero.jpg'} alt={t.heroAlt} fetchPriority="high" />
    <div className={s.heroShade} />
    <div className={s.heroCopy}>
     <h1 id="oryx-title">{t.heroTitle[0]}<br />{t.heroTitle[1]}</h1>
     <a href="#room" className={s.down} aria-label={t.down}>↓</a>
    </div>
   </section>

   <section id="room" className={s.walk} aria-label={t.room}>
    <Shot id="v2-bed" t={t} onOpen={showView} className={s.full} />
    <div className={s.pair}>
     <Shot id="c1-headboard" t={t} onOpen={showView} />
     <Shot id="c2-chair" t={t} onOpen={showView} />
    </div>
    <Shot id="v3-nook" t={t} onOpen={showView} className={s.full} />
   </section>

   <section id="film" className={s.film} aria-labelledby="film-title">
    <h2 id="film-title" className={s.filmTitle}>{t.filmTitle}</h2>
    <RoomFilm t={t} />
    <p className={s.filmNote}>{t.filmNote}</p>
   </section>

   <section className={s.walk} aria-label={t.moreRoom}>
    <div className={s.pair}>
     <Shot id="v5-mirror" t={t} onOpen={showView} />
     <Shot id="v4-tv" t={t} onOpen={showView} />
    </div>
   </section>

   <section id="pieces" className={s.pieces} aria-labelledby="pieces-title">
    <div className={s.piecesHead}>
     <h2 id="pieces-title">{t.piecesTitle}</h2>
     <p>{t.piecesText}</p>
    </div>
    <ol className={s.pieceList}>
     {pieces.map(p => <li key={p.code} className={s.piece}>
      <button className={s.pieceImg} onClick={() => setOpen({ kind: 'piece', code: p.code })} aria-label={t.enlarge(name(p.code))}>
       <img src={M + p.photo + '.jpg'} alt={t.photoAlt(name(p.code))} loading="lazy" />
      </button>
      <span className={s.code}>{p.code}</span>
      <h3>{name(p.code)}{p.count ? <span className={s.count}> ×{p.count}</span> : null}</h3>
     </li>)}
    </ol>
   </section>

   <p className={s.note}>{t.note}</p>
  </main>

  <footer className={s.footer}>
   <a href="#" className={s.mark}><X className={s.markX} />Studio ORYX</a>
   <a href="https://www.studioryx.com" target="_blank" rel="noreferrer">studioryx.com</a>
   <span>{t.visualised} <a href="/">residence.tech</a></span>
  </footer>

  <dialog ref={dialog} className={s.dialog} onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === dialog.current) close(); }}
   onKeyDown={e => { if (open?.kind !== 'view') return; if (e.key === 'ArrowRight') move(rtl ? -1 : 1); if (e.key === 'ArrowLeft') move(rtl ? 1 : -1); }}
   aria-label={open?.kind === 'piece' ? t.pieceDialog : t.viewDialog}>
   <button className={s.close} autoFocus onClick={close} aria-label={t.close}>✕</button>
   {open?.kind === 'view' && <>
    <img className={s.big} src={M + viewIds[open.i] + '.jpg'} alt={t.views[viewIds[open.i]].text} />
    <div className={s.caption}>
     <h3>{t.views[viewIds[open.i]].title}</h3>
     <div className={s.arrows}><button onClick={() => move(-1)} aria-label={t.prev}>{rtl ? '→' : '←'}</button><span>{open.i + 1} {t.of} {viewIds.length}</span><button onClick={() => move(1)} aria-label={t.next}>{rtl ? '←' : '→'}</button></div>
    </div>
   </>}
   {piece && <div className={s.pieceDialog}>
    <img src={M + piece.photo + '.jpg'} alt={t.photoAlt(name(piece.code))} />
    <div>
     <span className={s.code}>{piece.code}</span>
     <h3>{name(piece.code)}{piece.count ? <span className={s.count}> ×{piece.count}</span> : null}</h3>
     <p>{t.pieces[piece.code].text}</p>
     <div className={s.seen}><span>{t.inRoom}</span>{piece.seenIn.map(id => <button key={id} onClick={() => showView(vi(id))}>{t.views[id].title}</button>)}</div>
    </div>
   </div>}
  </dialog>
 </div>;
}
