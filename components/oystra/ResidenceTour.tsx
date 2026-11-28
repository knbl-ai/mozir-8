'use client';
// The residence as a tour that plays by itself: the home seen from above beside (or over) one large photograph.
// Every HOLD ms the photograph changes; a room with several photographs shows them all, then the plan moves on to
// the next room. Pointing at a room on the plan (or its name) jumps there and holds the tour until the pointer leaves.
// The tour also holds while the pointer rests on the photograph and while `hold` is set (the full-screen viewer is open).
// It plays only while it is on screen, and not at all for people who asked for reduced motion.
// Its parts are marked data-reveal: they arrive on scroll by the page's general rule (oystra.module.css).
// layout "beside": plan on the left, photograph on the right. layout "over": the plan as a card on the photograph.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MEDIA, ROOMS } from './content';
import { FULL, type Picked } from './HomeSelector';
import s from './oystra.module.css';
import t from './tour.module.css';

const HOLD = 4200; // ms each photograph stays
const EASE = [0.16, 0.8, 0.2, 1] as const;
const still = (id: string, small = false) => `${MEDIA}/c905/${id}${small ? '.sm' : ''}.webp`;
// everything outside a room, as one path with the room cut out of it
const wash = (zone: string) => `M0 0H1000V1000H0Z M${zone.split(' ').join(' L')}Z`;
// every photograph of the home in the order the tour shows them, each knowing its room and its place in it
const SEQ = ROOMS.flatMap((room, r) => room.shots.map((x, k) => ({ ...x, r, k, room: room.name })));
const AHEAD = 9; // how many photographs the strip under the picture holds: the one on show, then the ones to come
const two = (n: number) => String(n).padStart(2, '0');

// the box of a path "M x y x y …Z", with a margin, as an SVG viewBox
const boxOf = (d: string, pad = .12) => { const n = d.match(/-?[\d.]+/g)!.map(Number), xs = n.filter((_, i) => i % 2 === 0), ys = n.filter((_, i) => i % 2 === 1); const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), s = Math.max(x1 - x0, y1 - y0) * (1 + 2 * pad); return `${(x0 + x1 - s) / 2} ${(y0 + y1 - s) / 2} ${s} ${s}`; };
const m2 = (n: number) => `${n.toFixed(2)} m²`;

// home: the home chosen in the selector below. Only one home has its own plan and photographs (FULL); any other is shown
// with what exists for it (its outline, or the developer's plan where the site has it; its areas where known) and one
// placeholder picture that says its photographs are in preparation. onPick: go down to the selector. onEnquire: go to the enquiry.
export default function ResidenceTour({ layout, hold = false, onOpen, home, onPick, onEnquire }: { layout: 'beside' | 'over'; hold?: boolean; onOpen?: (shotId: string) => void; home?: Picked; onPick?: () => void; onEnquire?: () => void }) {
 const full = !home || home.id === FULL;
 const [at, setAt] = useState({ r: 0, k: 0 }); // room, photograph within it
 const [pointed, setHeld] = useState(false);
 const held = pointed || hold || !full;
 const [seen, setSeen] = useState(false);
 const root = useRef<HTMLDivElement>(null);
 const elapsed = useRef(0);
 // how long the picture on show stays: HOLD for a photograph; for a film take, its own length less the cross-fade, so the
 // next picture fades in over the take's last moments and the take never starts over
 const holdMs = useRef(HOLD);
 const room = ROOMS[at.r];
 const main = room.shots[Math.min(at.k, room.shots.length - 1)];
 const choose = (r: number) => setAt(a => a.r === r ? a : { r, k: 0 });

 useEffect(() => {
  const el = root.current;
  if (!el) return;
  const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: .4 });
  io.observe(el);
  return () => io.disconnect();
 }, []);

 // a new photograph starts its time from zero, and the one after it is fetched ahead
 useEffect(() => {
  elapsed.current = 0;
  holdMs.current = ROOMS[at.r].shots[Math.min(at.k, ROOMS[at.r].shots.length - 1)].video ? 3100 : HOLD;
  root.current?.style.setProperty('--p', '0');
  const next = at.k + 1 < ROOMS[at.r].shots.length ? ROOMS[at.r].shots[at.k + 1] : ROOMS[(at.r + 1) % ROOMS.length].shots[0];
  new Image().src = still(next.id);
 }, [at]);

 useEffect(() => {
  if (!seen || held || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let raf = 0, last = performance.now();
  const tick = (now: number) => {
   elapsed.current += Math.min(now - last, 100); // a hidden tab does not use up the photograph's time
   last = now;
   if (elapsed.current >= holdMs.current) {
    elapsed.current = 0;
    setAt(a => a.k + 1 < ROOMS[a.r].shots.length ? { r: a.r, k: a.k + 1 } : { r: (a.r + 1) % ROOMS.length, k: 0 });
   }
   root.current?.style.setProperty('--p', Math.min(1, elapsed.current / holdMs.current).toFixed(3));
   raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
 }, [seen, held]);

 const plan = <div className={t.plan} data-reveal onPointerLeave={() => setHeld(false)}>
  <img src={still('top', layout === 'over')} alt="Residence C-905 seen from above: the balcony on the left, two bedrooms, two bathrooms, the living and dining room with the kitchen" />
  <svg viewBox="0 0 1000 1000" role="group" aria-label="Choose a room on the plan">
   {ROOMS.map((r, i) => <path key={r.id} className={t.wash} data-on={i === at.r || undefined} d={wash(r.zone)} fillRule="evenodd" />)}
   {ROOMS.map((r, i) => <polygon key={r.id} className={t.zone} data-on={i === at.r || undefined} points={r.zone} pathLength={1}
    onPointerEnter={e => { if (e.pointerType === 'mouse') { choose(i); setHeld(true); } }} onClick={() => choose(i)} aria-label={r.name} />)}
  </svg>
 </div>;

 const caption = <div className={t.caption} aria-live="polite" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
  <AnimatePresence mode="wait">
   <motion.div key={room.id} initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }} transition={{ duration: .45, ease: EASE }}>
    <p className={s.eyebrow}>{two(at.r + 1)} / {two(ROOMS.length)} · {room.size}</p>
    <h3 className={t.name}>{room.name}</h3>
    {layout === 'beside' && <p className={t.line}>{room.line}</p>}
   </motion.div>
  </AnimatePresence>
 </div>;

 // one mark per photograph of this room; the current one fills as its time runs
 // what comes next, as a strip of small pictures: the first is the one on show (the line under it fills as its time
 // runs), then the photographs to come, each room named where it begins. When the picture changes the first one leaves
 // and the rest move up one place. Any of them can be clicked to go straight to it.
 const first = SEQ.findIndex(x => x.id === main.id);
 const queue = Array.from({ length: AHEAD }, (_, i) => SEQ[(first + i) % SEQ.length]);
 const strip = <div className={t.strip} aria-label="Photographs coming next">
  <AnimatePresence mode="popLayout" initial={false}>
   {queue.map((x, i) => <motion.button key={x.id} type="button" layout data-now={i === 0 || undefined} aria-label={`${x.room}: ${x.alt}`} aria-current={i === 0 || undefined}
    initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: .86, transition: { duration: .3 } }} transition={{ duration: .7, ease: EASE }}
    onClick={() => setAt({ r: x.r, k: x.k })}>
    <span>{x.k === 0 || i === 0 ? x.room : '\u00a0'}</span>
    <img src={still(x.id, true)} alt="" loading="lazy" />
    <i />
   </motion.button>)}
  </AnimatePresence>
 </div>;

 const ticks = <div className={t.ticks} aria-hidden="true">
  {room.shots.map((x, i) => <button key={x.id} type="button" tabIndex={-1} data-state={i < at.k ? 'done' : i === at.k ? 'now' : undefined} onClick={() => setAt({ r: at.r, k: i })}><i /></button>)}
 </div>;

 return <div className={t.tour} data-layout={layout} data-held={held || undefined} ref={root} style={{ '--hold': `${HOLD + 900}ms` } as React.CSSProperties}>
  <div className={t.head}>
   <div data-reveal>
    <p className={s.eyebrow}>Selected home · Residence {home?.rid ?? 'C'} · Floor {home?.floor ?? 9}</p>
    <AnimatePresence mode="wait" initial={false}>
     <motion.h2 key={home?.id ?? FULL} className={s.title} initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }} transition={{ duration: .45, ease: EASE }}>
      {full ? `Home ${FULL}, room by room.` : `Home ${home!.id}.`}
     </motion.h2>
    </AnimatePresence>
   </div>
   <div className={t.headSide} data-reveal style={{ '--i': 2 } as React.CSSProperties}>
    {full && <nav className={t.rooms} aria-label="Rooms">
     {ROOMS.map((r, i) => <button key={r.id} type="button" data-on={i === at.r || undefined} aria-pressed={i === at.r}
      onPointerEnter={e => { if (e.pointerType === 'mouse') { choose(i); setHeld(true); } }} onPointerLeave={() => setHeld(false)} onFocus={() => choose(i)} onClick={() => choose(i)}>{r.name}</button>)}
    </nav>}
    {onPick && <button type="button" className={t.other} onClick={onPick}>Choose another home ↓</button>}
   </div>
  </div>

  {full ? <div className={t.stage}>
   {layout === 'beside' && <div className={t.side}>{plan}{caption}</div>}
   <div className={t.photoCol}>
    <button type="button" className={t.photo} data-reveal="photo" onPointerEnter={e => { if (e.pointerType === 'mouse') setHeld(true); }} onPointerLeave={() => setHeld(false)} onClick={() => onOpen?.(main.id)} aria-label={`Enlarge: ${main.alt}`}>
     <AnimatePresence initial={false}>
      {main.video
       ? <motion.video key={main.id} src={`${MEDIA}/c905/${main.id}.mp4`} poster={still(main.id)} aria-label={main.alt} muted autoPlay playsInline preload="auto"
          onLoadedMetadata={e => { const d = e.currentTarget.duration; if (isFinite(d) && d > 1.6) holdMs.current = d * 1000 - 900; }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .9, ease: 'easeInOut' }} />
       : <motion.img key={main.id} src={still(main.id)} alt={main.alt} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .9, ease: 'easeInOut' }} />}
     </AnimatePresence>
    </button>
    {layout === 'over' && <div className={t.card}>{plan}{caption}{ticks}</div>}
    {layout === 'beside' && <div className={t.under} data-reveal style={{ '--i': 2 } as React.CSSProperties}>{strip}<p>{main.alt}</p></div>}
   </div>
  </div> : <motion.div key={home!.id} className={t.stage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .7, ease: 'easeInOut' }}>
   <div className={t.side}>
    <div className={t.plan}>
     {home!.rid === 'C' && home!.floor === 9
      ? <img src={`${MEDIA}/level/${home!.id}.webp`} alt={`The developer's plan of home ${home!.id}`} />
      : <svg className={t.outline} viewBox={boxOf(home!.d)} role="img" aria-label={`Outline of home ${home!.id}`}><path d={home!.d} /></svg>}
     {!(home!.rid === 'C' && home!.floor === 9) && <p className={t.soon}>Plan in preparation</p>}
    </div>
    <div className={t.caption}>
     <p className={s.eyebrow}>Residence {home!.rid} · Floor {home!.floor}</p>
     <h3 className={t.name}>{home!.beds}</h3>
     <p className={t.line}>{home!.total != null ? `${m2(home!.unit!)} interior · ${m2(home!.balcony!)} balcony · ${m2(home!.total)} in all` : 'Sizes on request.'}</p>
    </div>
   </div>
   <div className={t.photoCol}>
    <div className={t.wait}>
     <img src={`${MEDIA}/c905/placeholder.webp`} alt="" />
     <div>
      <p className={s.eyebrow}>Home {home!.id}</p>
      <p className={t.waitLine}>Photographs of this home are in preparation.</p>
      {onEnquire && <button type="button" className={t.other} onClick={onEnquire}>Arrange a private presentation</button>}
     </div>
    </div>
   </div>
  </motion.div>}
 </div>;
}
