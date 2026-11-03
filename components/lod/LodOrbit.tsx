'use client';
// Lod 4008 · the building in 360° (building track orbit-l2-360: 360 views, 1° steps CCW, frame 0 = NE entrance corner).
// Same engine as Symbol / Rua da Lapa (components/building/useFrameSequence): a ring of pre-rendered frames on a canvas,
// drag / swipe / wheel to turn, the ring video where it plays well (not iOS/Safari), per-view hotspot outlines from
// frames.json (1000×625 space). Starts on frame 0 as a plain <img> poster (no blank stage), then waits for the visitor
// (no auto-rotation: whole-view steps can't look smooth at a slow speed). Hover highlights a zone, click/tap opens a small card.
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Hand, X } from 'lucide-react';
import { useFrameSequence } from '@/components/building/useFrameSequence';
import { useLang } from '@/lib/i18n';
import { CLASSES } from '@/content/projects/lod-daycare';
import { lodText } from './strings';
import s from './lod.module.css';

const BASE = '/projects/lod-daycare/orbit';
type Spot = { id: string; points: string; c?: [number, number] };
type Frame = { src: string; angle: number; sky?: string; spots: Spot[] };
type Orbit = { count: number; width: number; height: number; frames: Frame[] };

const area = (pts: string) => {
 const p = pts.split(' ').map(q => q.split(',').map(Number)); let a = 0;
 for (let i = 0; i < p.length; i++) { const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length]; a += x0 * y1 - x1 * y0; }
 return Math.abs(a / 2);
};
const ringMode = (n: number): { video?: string; stride: number } => {
 const ua = navigator.userAgent;
 const ios = /iP(hone|ad|od)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
 const safari = /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg|FxiOS|Android/.test(ua);
 return ios || safari ? { stride: n >= 300 ? 3 : 1 } : { video: `${BASE}/ring.mp4`, stride: n >= 300 ? 8 : 4 };
};

export default function LodOrbit() {
 const lang = useLang(); const t = lodText[lang];
 const [orbit, setOrbit] = useState<Orbit | null>(null);
 useEffect(() => { fetch(`${BASE}/frames.json`).then(r => r.json()).then(setOrbit).catch(() => {}); }, []);
 const frames = useMemo(() => orbit?.frames ?? [], [orbit]);
 const [ring, setRing] = useState<{ video?: string; stride: number } | null>(null);
 useEffect(() => { if (orbit?.count) setRing(ringMode(orbit.count)); }, [orbit?.count]);
 const sources = useMemo(() => ring ? frames.map(f => `${BASE}/${f.src}`) : [], [frames, ring]);
 const engine = useFrameSequence(sources, 0, 1, { aspect: 625 / 1000, maxWidth: 2000, turnPerWidth: 220, video: ring?.video, videoFps: 30, stride: ring?.stride ?? 1,
  onVideoFail: () => setRing({ stride: 3 }) });
 const eng = useRef(engine); eng.current = engine;

 // the frame covers the stage; on phones it is centred on the building (smoothed centre of the hotspots of each view)
 const stageRef = useRef<HTMLDivElement>(null);
 const [box, setBox] = useState({ w: 1600, h: 1000, W: 1600, H: 1000 });
 useEffect(() => {
  const el = stageRef.current; if (!el) return;
  const fit = () => { const W = el.clientWidth, H = el.clientHeight, sc = Math.max(W / 1000, H / 625) * (W < 700 ? 1 : 1.06); setBox({ w: 1000 * sc, h: 625 * sc, W, H }); };
  fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect();
 }, []);
 const cx = useMemo(() => {
  const raw = frames.map(f => { const cs = f.spots.filter(p => p.c).map(p => p.c![0]); return cs.length ? (Math.min(...cs) + Math.max(...cs)) / 2 : 500; });
  const n = raw.length, k = 10;
  return raw.map((_, i) => { let sum = 0; for (let d = -k; d <= k; d++) sum += raw[(i + d + n) % n]; return sum / (2 * k + 1); });
 }, [frames]);
 const shown = engine.displayed;
 const fx = cx[shown] ?? 500;
 const left = Math.min(0, Math.max(box.W - box.w, box.W / 2 - fx / 1000 * box.w));
 const top = Math.min(0, Math.max(box.H - box.h, box.H * 0.66 - 0.62 * box.h));   // building band slightly below the middle
 const frame = frames[shown];

 // No auto-rotation (user 2026-11-03): the ring is 360 whole 1° views and the engine draws the nearest whole view
 // (never a blend), so a slow 6-10°/s turn can only show 6-10 views a second, which reads as stepping on every engine.
 // The stage rests on frame 0 with the drag hint; turning is the visitor's.
 const [touched, setTouched] = useState(false);
 const touch = () => { if (!touched) setTouched(true); };

 const [hover, setHover] = useState<string | null>(null);
 const [card, setCard] = useState<{ id: string; x: number; y: number } | null>(null);
 const [hero, setHero] = useState<DOMRect | null>(null);
 useEffect(() => {
  const el = stageRef.current; const h = el?.parentElement?.querySelector('[data-hero-copy]') as HTMLElement | null;
  if (!el || !h) return;
  const m = () => {
   const a = el.getBoundingClientRect(); let r: DOMRect | null = null;
   h.querySelectorAll(':scope > *').forEach(c => { const b = (c as HTMLElement).getBoundingClientRect(); r = r ? new DOMRect(Math.min(r.x, b.x), Math.min(r.y, b.y), Math.max(r.right, b.right) - Math.min(r.x, b.x), Math.max(r.bottom, b.bottom) - Math.min(r.y, b.y)) : b; });
   const rr = r as DOMRect | null; if (rr) setHero(new DOMRect(rr.x - a.x, rr.y - a.y, rr.width, rr.height));
  };
  m(); const ro = new ResizeObserver(m); ro.observe(el); ro.observe(h); return () => ro.disconnect();
 }, [lang]);
 // a tap / click anywhere outside the stage closes the pinned label
 useEffect(() => {
  if (!card) return;
  const off = (e: PointerEvent) => { if (!stageRef.current?.contains(e.target as Node)) setCard(null); };
  document.addEventListener('pointerdown', off); return () => document.removeEventListener('pointerdown', off);
 }, [card]);
 const press = useRef<{ x: number; moved: boolean } | null>(null);
 useEffect(() => {
  const el = stageRef.current; if (!el || !frames.length) return;
  const wheel = (e: WheelEvent) => { if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; e.preventDefault(); touch(); eng.current.nudgePixels(e.deltaX); };
  el.addEventListener('wheel', wheel, { passive: false }); return () => el.removeEventListener('wheel', wheel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [frames.length]);
 const zoneAt = (x: number, y: number) => document.elementFromPoint(x, y)?.closest('[data-zone]')?.getAttribute('data-zone') ?? null;
 // best view per zone (largest outline) for the card's "turn to" — not needed for the hero, kept small
 const largest = useMemo(() => { const m = new Map<string, number>(); frames.forEach(f => f.spots.forEach(p => m.set(p.id, Math.max(m.get(p.id) ?? 0, area(p.points))))); return m; }, [frames]);
 void largest;

 const info = (id: string) => {
  if (id.startsWith('class-')) {
   const n = Number(id.slice(6)); const c = CLASSES.find(x => x.n === n)!;
   return { title: t.classN(n), line: `${t.programme[c.programme]} · ${t.ages[c.age]}`, line2: t.orbit.classLine, colour: c.colour };
  }
  const z = t.orbit.zones[id as keyof typeof t.orbit.zones];
  return z ? { title: z[0], line: z[1], line2: '', colour: '#1d85c7' } : { title: id, line: '', line2: '', colour: '#1d85c7' };
 };
  // the label point of a zone in the current view (centre of its largest outline), in stage pixels
 const labelAt = (id: string) => {
  let best: Spot | null = null, ba = 0;
  frame?.spots.forEach(p => { if (p.id === id && p.c) { const a = area(p.points); if (a > ba) { ba = a; best = p; } } });
  const c = (best as Spot | null)?.c; return c ? { x: left + c[0] / 1000 * box.w, y: top + c[1] / 625 * box.h } : null;
 };
 // one label at a time: the pinned / tapped card wins, else the zone under the mouse
 const showId = card?.id ?? hover;
 const showAt = card ?? (hover ? labelAt(hover) : null);
 // place the label above the zone, else below it, and never over the headline / intro block (measured below)
 const place = (at: { x: number; y: number }) => {
  const cw = Math.min(290, box.W - 32), ch = 104, half = cw / 2;
  const clampX = (x: number) => Math.min(Math.max(x, half + 12), box.W - half - 12);
  const clampY = (y: number) => Math.min(Math.max(y, 70), box.H - ch - 80);
  const hits = (x: number, y: number) => !!hero && x - half < hero.right + 12 && x + half > hero.x - 12 && y < hero.bottom + 12 && y + ch > hero.y - 12;
  const x = clampX(at.x);
  for (const y of [at.y - ch - 22, at.y + 26].map(clampY)) if (!hits(x, y)) return { left: x, top: y };
  // still over the text: slide sideways off the text block, then below it
  if (hero) {
   const away = hero.x > box.W / 2 ? clampX(hero.x - half - 16) : clampX(hero.right + half + 16);
   if (!hits(away, clampY(at.y - ch - 22))) return { left: away, top: clampY(at.y - ch - 22) };
   return { left: x, top: clampY(Math.max(hero.bottom + 16, at.y + 26)) };
  }
  return { left: x, top: clampY(at.y + 26) };
 };
 const si = showId ? info(showId) : null;

 return <div ref={stageRef} className={s.orbit} data-moving={engine.moving || undefined} tabIndex={0} role="group" aria-label={t.orbit.aria}
  onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); touch(); engine.step((e.key === 'ArrowRight' ? -1 : 1) * 6); } }}
  onPointerDown={e => { if (e.button !== 0 || (e.target as HTMLElement).closest('[data-ui]')) return; touch(); press.current = { x: e.clientX, moved: false }; engine.beginDrag(e.clientX); e.currentTarget.setPointerCapture(e.pointerId); }}
  onPointerMove={e => {
   if (!press.current) { if (e.pointerType === 'mouse') setHover(zoneAt(e.clientX, e.clientY)); return; }
   if (Math.abs(e.clientX - press.current.x) > 5) { press.current.moved = true; setHover(null); setCard(null); }
   engine.dragTo(e.clientX);
  }}
  onPointerUp={e => {
   const moved = press.current?.moved; const pressed = !!press.current; press.current = null; engine.endDrag();
   if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
   if (pressed && !moved) { const id = zoneAt(e.clientX, e.clientY); const at = id ? labelAt(id) : null; setCard(id && at && card?.id !== id ? { id, ...at } : null); }
  }}
  onPointerCancel={() => { press.current = null; engine.endDrag(); }}
  onPointerLeave={e => { if (!press.current) setHover(null); }}>
  <div className={s.orbitSky} style={{ background: frame?.sky ?? '#abb9cc' }} aria-hidden />
  <div className={s.orbitFrame} style={{ width: box.w, height: box.h, left, top }}>
   {/* first paint: frame 0 as a plain image until the canvas has its first frame */}
   <img className={s.orbitPoster} src={`${BASE}/000.webp`} alt="" draggable={false} data-hide={engine.firstReady || undefined} fetchPriority="high" />
   <canvas ref={engine.canvasRef} className={s.orbitCanvas} />
   {frame && <svg viewBox="0 0 1000 625" className={s.orbitSpots}>
    {frame.spots.map((p, i) => <polygon key={`${p.id}-${i}`} data-zone={p.id} points={p.points} data-on={(p.id === hover || p.id === card?.id) || undefined} vectorEffect="non-scaling-stroke" />)}
   </svg>}
  </div>
  <AnimatePresence>
   {showId && showAt && si && <motion.div key={showId} data-ui={card ? '' : undefined} data-pinned={card ? '' : undefined} className={s.orbitCard} role={card ? 'dialog' : 'tooltip'} aria-label={si.title}
    style={place(showAt)}
    initial={{ opacity: 0, y: 6, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, x: '-50%' }} transition={{ duration: 0.15 }}>
    <i style={{ background: si.colour }} />
    <div><strong>{si.title}</strong>{si.line && <span>{si.line}</span>}{si.line2 && <small>{si.line2}</small>}</div>
    {card && <button type="button" aria-label={t.galleryUi.close} onClick={() => setCard(null)}><X size={14} strokeWidth={1.8} aria-hidden /></button>}
   </motion.div>}
  </AnimatePresence>
  <div className={s.orbitTurn} data-ui>
   <button type="button" aria-label={t.orbit.left} onClick={() => { touch(); engine.step(12); }}><ChevronLeft size={18} strokeWidth={1.8} aria-hidden /></button>
   <span><Hand size={14} strokeWidth={1.7} aria-hidden />{t.orbit.hint}</span>
   <button type="button" aria-label={t.orbit.right} onClick={() => { touch(); engine.step(-12); }}><ChevronRight size={18} strokeWidth={1.8} aria-hidden /></button>
  </div>
 </div>;
}
