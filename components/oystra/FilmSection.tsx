'use client';
// The film section (under the opening): the architects and the project in one line on top, the facts as a strip that counts
// up, the film in its bronze frame with chapters under it (a click plays from there, the chapter on screen lights while it
// plays), then what the residents have and how far the places are, each with a drawn icon.
// Sources: "Four residences · 846 homes" is the film's own title (admin 2026-11-26); bedrooms, floors and handover from the
// developer's material (see LocationUnfold.tsx); the facilities from the developer's fact sheet; drive times from
// public/projects/oystra/map/geo.json. Chapter times are the film's (pipeline/signature/film/firstlight/index.html).
import { useEffect, useRef, useState } from 'react';
import { MEDIA } from './content';
import s from './oystra.module.css';
import fs from './filmswitch.module.css';

const HEAD = { by: 'Zaha Hadid Architects', line: 'Four residences · 846 homes' };
const FACTS: { n: number; pre?: string; post?: string; label: string }[] = [
 { n: 4, label: 'Residences' },
 { n: 4, pre: '1 – ', label: 'Bedrooms' },
 { n: 19, pre: '14 & ', label: 'Floors' },
 { n: 150, post: ' m', label: 'Crystal lagoon' },
 { n: 2029, pre: 'Q2 ', label: 'Handover · Residence B' },
];
const CHAPTERS: [number, string][] = [
 [6.2, 'The site'], [13.1, 'Arrival'], [20.4, 'Floor nine'], [31.2, 'Residence C-905'],
 [46.9, 'The beach club'], [62.2, 'Four residences'], [66.2, 'The coast'], [73.8, 'Dusk'],
];
// the highlights (pipeline/signature/film/highlights, 40 s): the opening, then one run of the film's shots with no plans or map
const SHORT: [number, string][] = [
 [0, 'The shore'], [5.9, 'Arrival'], [9.5, 'Floor nine'], [17.8, 'Residence C-905'],
 [23.1, 'The beach club'], [33.3, 'Four residences'], [35.1, 'Dusk'],
];
const CUTS = {
 full: { src: 'film/oystra-film.mp4', poster: 'film/oystra-film.jpg', chapters: CHAPTERS, label: 'The film' },
 short: { src: 'film/oystra-highlights.mp4', poster: 'film/oystra-highlights.jpg', chapters: SHORT, label: 'The highlights' },
} as const;
// icons on a 48 grid, drawn with one stroke
const I = {
 wave: 'M4 20c5-6 9-6 14 0s9 6 14 0 9-6 12 0M4 32c5-6 9-6 14 0s9 6 14 0 9-6 12 0',
 pool: 'M6 36c4-4 8-4 12 0s8 4 12 0 8-4 12 0M16 30V11a4 4 0 0 1 8 0M30 30V11a4 4 0 0 1 8 0M16 21h14',
 shade: 'M24 8v34M6 22a18 18 0 0 1 36 0zM24 8c-6 4-8 9-8 14M24 8c6 4 8 9 8 14M16 42h16',
 leaf: 'M24 42c-10-6-14-16-10-30 12 2 20 12 10 30zM24 42c3-10 1-19-6-25',
 racket: 'M30 26a11 11 0 1 0-12-12c0 5 2 9 5 12L8 42',
 film: 'M6 14h36v24H6zM6 20h36M12 14l4 6M22 14l4 6M32 14l4 6M20 26l10 5-10 5z',
 flag: 'M17 42V6l17 7-17 7M9 42h18',
 bell: 'M8 36h32M12 36a12 12 0 0 1 24 0M24 24v-4M20 20h8M6 42h36',
 gem: 'M12 8h24l8 10-20 24L4 18zM4 18h40M18 8l-4 10 10 24 10-24-4-10',
 bag: 'M9 16h30l-2 26H11zM17 16v-4a7 7 0 0 1 14 0v4',
 plane: 'M42 31v-4L26 17V7a3 3 0 0 0-6 0v10L4 27v4l16-5v10l-4 3v3l7-2 7 2v-3l-4-3V26z',
 city: 'M6 42h36M10 42V22h8v20M20 42V6l6 6v30M30 42V26h10v16',
};
const HAS: [string, string][] = [[I.wave, 'Crystal lagoon'], [I.shade, 'Beach club'], [I.pool, '360° rooftop pool'], [I.leaf, 'Spa & wellness'],
 [I.flag, 'Golf simulator'], [I.racket, 'Padel court'], [I.film, 'Private cinema'], [I.bell, '24-hour concierge']];
// four places, so both lists have four rows (admin 2026-11-26: the two malls taken out)
const NEAR: [string, string, number][] = [[I.gem, 'Wynn Al Marjan Island', 3], [I.flag, 'Al Hamra Golf Club', 10],
 [I.plane, 'RAK International Airport', 20], [I.plane, 'Dubai International Airport', 55]];
const MAXMIN = 55;
const mmss = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

// a number that counts up once its block has come into view (the page's reveal sets data-in on the block)
function Count({ to, on }: { to: number; on: boolean }) {
 const [v, setV] = useState(to);
 useEffect(() => {
  if (!on) { setV(0); return; }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(to); return; }
  let raf = 0; const t0 = performance.now(), dur = 1400 + Math.min(to, 300) * 2;
  const step = (t: number) => { const u = Math.min(1, (t - t0) / dur); setV(Math.round(to * (1 - Math.pow(1 - u, 3)))); if (u < 1) raf = requestAnimationFrame(step); };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
 }, [on, to]);
 return <>{v}</>;
}

// true once the element has been seen (the same rule as the page's data-reveal, kept here for the counters)
function useSeen<T extends Element>() {
 const ref = useRef<T>(null); const [seen, setSeen] = useState(false);
 useEffect(() => {
  const el = ref.current; if (!el) return;
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: .3 });
  io.observe(el); return () => io.disconnect();
 }, []);
 return [ref, seen] as const;
}

export default function FilmSection({ edge }: { edge?: React.ReactNode }) {
 const video = useRef<HTMLVideoElement>(null);
 const [now, setNow] = useState(-1);
 const [cut, setCut] = useState<'full' | 'short'>('full');
 const [swapped, setSwapped] = useState(false);      // after a switch the new chapter row is shown at once (the page's reveal ran already)
 const film = CUTS[cut];
 const [factsRef, factsOn] = useSeen<HTMLDListElement>();
 useEffect(() => {
  const v = video.current; if (!v) return;
  const tick = () => setNow(v.currentTime > 0 ? v.currentTime : -1);
  v.addEventListener('timeupdate', tick); v.addEventListener('seeked', tick);
  return () => { v.removeEventListener('timeupdate', tick); v.removeEventListener('seeked', tick); };
 }, [cut]);
 const at = film.chapters.reduce((k, [t], i) => (now >= t ? i : k), -1);
 const play = (t: number) => { const v = video.current; if (!v) return; v.currentTime = t; v.play().catch(() => {}); };
 // switching films: the other film loads in the same frame, from its start, paused
 const swap = (to: 'full' | 'short') => { video.current?.pause(); setNow(-1); setCut(to); setSwapped(true); };

 return <section id="film" className={s.filmSlot} aria-label="The film">
  {edge}
  <header className={s.fsHead}>
   <p className={s.fsBy} data-reveal>{HEAD.by}</p>
   <i className={s.fsRule} data-reveal style={{ '--i': 1 } as React.CSSProperties} aria-hidden="true" />
   <h2 className={s.fsLine} data-reveal style={{ '--i': 2 } as React.CSSProperties}>{HEAD.line}</h2>
  </header>

  <dl className={s.fsFacts} ref={factsRef}>
   {FACTS.map((f, i) => <div key={f.label} data-reveal style={{ '--i': i } as React.CSSProperties}>
    <dd>{f.pre}{f.n >= 1000 ? f.n : <Count to={f.n} on={factsOn} />}{f.post}</dd><dt>{f.label}</dt>
   </div>)}
  </dl>

  {/* the arrows sit outside the film's frame, which the page's photo reveal clips to its own box */}
  <div className={fs.wrap}>
  <div className={s.fsFilm} data-reveal="photo">
   <video key={cut} ref={video} className={`${s.filmSlotFrame} ${s.filmVideo}`} src={`${MEDIA}/${film.src}`} poster={`${MEDIA}/${film.poster}`}
    controls playsInline preload="metadata" aria-label={film.label} />
  </div>
   {cut === 'full'
    ? <button type="button" className={`${fs.arrow} ${fs.next}`} onClick={() => swap('short')} aria-label="Watch the highlights" title="The highlights">
     <svg viewBox="0 0 18 46" aria-hidden="true"><path d="M2 2 16 23 2 44" /></svg></button>
    : <button type="button" className={`${fs.arrow} ${fs.prev}`} onClick={() => swap('full')} aria-label="Back to the full film" title="The full film">
     <svg viewBox="0 0 18 46" aria-hidden="true"><path d="M16 2 2 23 16 44" /></svg></button>}
  </div>
  <ol className={s.fsChapters} aria-label={`Chapters of ${film.label.toLowerCase()}`} style={{ gridTemplateColumns: `repeat(${film.chapters.length},minmax(0,1fr))` }}>
   {film.chapters.map(([t, name], i) => <li key={cut + name} data-reveal data-in={swapped ? '' : undefined} style={{ '--i': i } as React.CSSProperties}>
    <button type="button" data-on={i === at || undefined} data-past={i < at || undefined} onClick={() => play(t)}>
     <span className={s.fsTime}>{mmss(t)}</span><span>{name}</span>
    </button>
   </li>)}
  </ol>

  <div className={s.fsPanels}>
   <div className={s.fsPanel}>
    <p className={s.fsEye} data-reveal>For residents</p>
    <ul className={s.fsHas}>
     {HAS.map(([d, name], i) => <li key={name} data-reveal style={{ '--i': i } as React.CSSProperties}>
      <svg viewBox="0 0 48 48" aria-hidden="true"><path d={d} pathLength={1} /></svg><span>{name}</span>
     </li>)}
    </ul>
   </div>
   <div className={s.fsPanel}>
    <p className={s.fsEye} data-reveal>Within reach · by car</p>
    <ul className={s.fsNear}>
     {NEAR.map(([d, name, min], i) => <li key={name} data-reveal style={{ '--i': i, '--w': min / MAXMIN } as React.CSSProperties}>
      <svg viewBox="0 0 48 48" aria-hidden="true"><path d={d} pathLength={1} /></svg>
      <span className={s.fsPlace}>{name}</span>
      <span className={s.fsMin}><b>{min}</b> min</span>
      <i className={s.fsBar} aria-hidden="true" />
     </li>)}
    </ul>
   </div>
  </div>
 </section>;
}
