'use client';
import { useEffect, useRef, useState } from 'react';
import { film } from '@/components/landing/media';
import { M, views, pieces, type ViewId } from './content';
import s from './oryx.module.css';

const X = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
 <path d="M5 5 19 19M19 5 5 19" strokeWidth="4.2" strokeLinecap="round" />
</svg>;

type Open = { kind: 'view'; i: number } | { kind: 'piece'; code: string } | null;
const vi = (id: ViewId) => views.findIndex(v => v.id === id);

// The film plays muted while it is on screen and pauses when it leaves (never with reduced motion).
function RoomFilm() {
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
   <button onClick={toggle}>{playing ? 'Pause' : 'Play'}</button>
   <button onClick={() => setMuted(m => !m)} aria-pressed={!muted}>{muted ? 'Sound on' : 'Sound off'}</button>
  </div>
 </div>;
}

function Shot({ id, onOpen, className }: { id: ViewId; onOpen: (i: number) => void; className?: string }) {
 const v = views[vi(id)];
 return <button className={`${s.shot} ${className ?? ''}`} onClick={() => onOpen(vi(id))} aria-label={`${v.title}: view full screen`}>
  <img src={M + id + '.jpg'} alt={v.text} loading="lazy" />
  <span className={s.shotCap}>{v.title}</span>
 </button>;
}

export default function OryxSite() {
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
 const move = (d: number) => setOpen(o => o?.kind === 'view' ? { kind: 'view', i: (o.i + d + views.length) % views.length } : o);
 const piece = open?.kind === 'piece' ? pieces.find(p => p.code === open.code) : undefined;

 return <div className={s.page}>
  <header className={s.header}>
   <a href="#" className={s.mark}><X className={s.markX} />Studio ORYX</a>
   <a href="#room-film" className={s.headerLink} onClick={e => { e.preventDefault(); const f = document.getElementById('room-film'); if (f) window.scrollTo({ top: f.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' }); }}>Watch the room</a>
  </header>

  <main>
   <section className={s.hero} aria-labelledby="oryx-title">
    <img className={s.heroImg} src={M + 'v1-hero.jpg'} alt="A calm Cancún bedroom furnished with Studio ORYX pieces, seen from the door" fetchPriority="high" />
    <div className={s.heroShade} />
    <div className={s.heroCopy}>
     <h1 id="oryx-title">A bedroom in Cancún,<br />furnished by Studio ORYX</h1>
     <a href="#room" className={s.down} aria-label="Step into the room">↓</a>
    </div>
   </section>

   <section id="room" className={s.walk} aria-label="The room">
    <Shot id="v2-bed" onOpen={showView} className={s.full} />
    <div className={s.pair}>
     <Shot id="c1-headboard" onOpen={showView} />
     <Shot id="c2-chair" onOpen={showView} />
    </div>
    <Shot id="v3-nook" onOpen={showView} className={s.full} />
   </section>

   <section id="film" className={s.film} aria-labelledby="film-title">
    <h2 id="film-title" className={s.filmTitle}>Walk through the room</h2>
    <RoomFilm />
    <p className={s.filmNote}>Review draft · 480p</p>
   </section>

   <section className={s.walk} aria-label="More of the room">
    <div className={s.pair}>
     <Shot id="v5-mirror" onOpen={showView} />
     <Shot id="v4-tv" onOpen={showView} />
    </div>
   </section>

   <section id="pieces" className={s.pieces} aria-labelledby="pieces-title">
    <div className={s.piecesHead}>
     <h2 id="pieces-title">The pieces</h2>
     <p>Hand-made in Cancún. Each piece as Studio ORYX photographed it, with its catalogue code.</p>
    </div>
    <ol className={s.pieceList}>
     {pieces.map(p => <li key={p.code} className={s.piece}>
      <button className={s.pieceImg} onClick={() => setOpen({ kind: 'piece', code: p.code })} aria-label={`${p.name}: enlarge the ORYX photo`}>
       <img src={M + p.photo + '.jpg'} alt={`${p.name}, ORYX studio photo`} loading="lazy" />
      </button>
      <span className={s.code}>{p.code}</span>
      <h3>{p.name}{p.count ? <span className={s.count}> ×{p.count}</span> : null}</h3>
     </li>)}
    </ol>
   </section>

   <p className={s.note}>The room, its light and styling are a proposal, shown in AI-generated images and film made from the floor plan and ORYX product photos. The ORYX photos are the reference for every piece.</p>
  </main>

  <footer className={s.footer}>
   <a href="#" className={s.mark}><X className={s.markX} />Studio ORYX</a>
   <a href="https://www.studioryx.com" target="_blank" rel="noreferrer">studioryx.com</a>
   <span>Visualised by <a href="/">residence.tech</a></span>
  </footer>

  <dialog ref={dialog} className={s.dialog} onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === dialog.current) close(); }}
   onKeyDown={e => { if (open?.kind === 'view' && e.key === 'ArrowRight') move(1); if (open?.kind === 'view' && e.key === 'ArrowLeft') move(-1); }}
   aria-label={open?.kind === 'piece' ? 'ORYX piece' : 'Room view'}>
   <button className={s.close} autoFocus onClick={close} aria-label="Close">✕</button>
   {open?.kind === 'view' && <>
    <img className={s.big} src={M + views[open.i].id + '.jpg'} alt={views[open.i].text} />
    <div className={s.caption}>
     <h3>{views[open.i].title}</h3>
     <div className={s.arrows}><button onClick={() => move(-1)} aria-label="Previous view">←</button><span>{open.i + 1} of {views.length}</span><button onClick={() => move(1)} aria-label="Next view">→</button></div>
    </div>
   </>}
   {piece && <div className={s.pieceDialog}>
    <img src={M + piece.photo + '.jpg'} alt={`${piece.name}, ORYX studio photo`} />
    <div>
     <span className={s.code}>{piece.code}</span>
     <h3>{piece.name}{piece.count ? <span className={s.count}> ×{piece.count}</span> : null}</h3>
     <p>{piece.text}</p>
     <div className={s.seen}><span>In the room:</span>{piece.seenIn.map(id => <button key={id} onClick={() => showView(vi(id))}>{views[vi(id)].title}</button>)}</div>
    </div>
   </div>}
  </dialog>
 </div>;
}
