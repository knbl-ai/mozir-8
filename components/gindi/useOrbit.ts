'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// One turning angle shared by several pre-rendered rings (the complex and each tower): frame i of every ring
// looks the same way, so the site can zoom from the complex into a tower without the view jumping.
// Position is a fractional frame index eased from a rAF loop; each canvas shows its ring's nearest whole frame.

const INERTIA_TAU = 280, KEY_TAU = 130, SETTLE_TAU = 110, WHEEL_TAU = 90;
const CONCURRENT = 6;
export const FRAME_W = 1600, FRAME_H = 900;

type Ring = { sources: string[]; images: (HTMLImageElement | null)[]; ready: boolean[]; queue: number[] };
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useOrbit(count: number, initial = 0) {
 const position = useRef(initial);
 const rings = useRef(new Map<string, Ring>());
 const canvases = useRef(new Map<string, HTMLCanvasElement>());
 const drawn = useRef(new Map<string, number>());
 const inflight = useRef(0);
 const tween = useRef<{ from: number; to: number; start: number; duration: number } | null>(null);
 const settled = useRef<(() => void)[]>([]);
 const chase = useRef<{ to: number; tau: number } | null>(null);
 const drag = useRef<{ x: number; from: number; samples: { t: number; p: number }[] } | null>(null);
 const raf = useRef(0);
 const last = useRef(0);
 const [displayed, setDisplayed] = useState(initial);
 const [moving, setMoving] = useState(false);
 const [readyTick, setReadyTick] = useState(0);
 const movingRef = useRef(false);

 const wrap = useCallback((p: number) => ((p % count) + count) % count, [count]);
 const index = () => Math.round(wrap(position.current)) % count;

 const nearest = (ring: Ring, i: number) => {
  for (let o = 0; o <= count / 2; o++) {
   if (ring.ready[(i + o) % count]) return (i + o) % count;
   if (ring.ready[(i - o + count) % count]) return (i - o + count) % count;
  }
  return -1;
 };

 const paint = (view: string, force = false) => {
  const canvas = canvases.current.get(view), ring = rings.current.get(view);
  if (!canvas || !ring) return;
  const shown = nearest(ring, index());
  if (shown < 0 || (!force && drawn.current.get(view) === shown)) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(ring.images[shown]!, 0, 0, canvas.width, canvas.height);
  drawn.current.set(view, shown);
 };
 const paintAll = (force = false) => {
  canvases.current.forEach((_, v) => paint(v, force));
  const i = index();
  setDisplayed(d => d === i ? d : i);
 };

 const pump = () => {
  const order = [...rings.current.entries()];
  for (const [view, ring] of order) {
   while (inflight.current < CONCURRENT && ring.queue.length) {
    const i = ring.queue.shift()!;
    if (ring.images[i]) continue;
    const img = new Image(); img.decoding = 'async'; img.src = ring.sources[i]; ring.images[i] = img; inflight.current++;
    img.decode().then(() => {
     ring.ready[i] = true;
     if (i === index() || drawn.current.get(view) === undefined) paint(view, true);
     setReadyTick(t => t + 1);
    }).catch(() => { ring.images[i] = null; }).finally(() => { inflight.current--; pump(); });
   }
  }
 };

 // Load a ring, outward from the current angle. `urgent` puts it first in line.
 const load = (view: string, sources: string[], urgent = false) => {
  let ring = rings.current.get(view);
  if (!ring) {
   ring = { sources, images: sources.map(() => null), ready: sources.map(() => false), queue: [] };
   if (urgent) rings.current = new Map([[view, ring], ...rings.current]); else rings.current.set(view, ring);
  } else if (urgent) {
   rings.current = new Map([[view, ring], ...[...rings.current].filter(([v]) => v !== view)]);
  }
  const o = index();
  ring.queue = Array.from({ length: count }, (_, k) => wrap(o + (k % 2 ? Math.ceil(k / 2) : -k / 2))).filter(i => !ring!.images[i]);
  pump();
 };
 const isReady = (view: string, i = index()) => !!rings.current.get(view)?.ready[i];
 const whenReady = (view: string, i = index()) => new Promise<void>(res => {
  const check = () => { if (isReady(view, i)) res(); else setTimeout(check, 40); };
  check();
 });

 const canvasRef = (view: string) => (el: HTMLCanvasElement | null) => {
  if (el) { el.width = FRAME_W; el.height = FRAME_H; canvases.current.set(view, el); drawn.current.delete(view); paint(view, true); }
  else canvases.current.delete(view);
 };

 const setMovingState = (v: boolean) => { if (movingRef.current !== v) { movingRef.current = v; setMoving(v); } };
 const tick = (now: number) => {
  const dt = last.current ? Math.min(48, now - last.current) : 16; last.current = now;
  let active = true;
  if (drag.current) { /* follows the pointer */ }
  else if (tween.current) {
   const t = tween.current, k = Math.min(1, (now - t.start) / t.duration);
   const e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
   position.current = t.from + (t.to - t.from) * e;
   if (k >= 1) { tween.current = null; active = false; }
  } else if (chase.current) {
   const c = chase.current;
   position.current += (c.to - position.current) * (1 - Math.exp(-dt / c.tau));
   if (Math.abs(c.to - position.current) < .004) { position.current = c.to; chase.current = null; active = false; }
  } else if (Math.abs(position.current - Math.round(position.current)) > .004) {
   chase.current = { to: Math.round(position.current), tau: SETTLE_TAU };
  } else active = false;
  paintAll();
  if (active) raf.current = requestAnimationFrame(tick);
  else { raf.current = 0; last.current = 0; position.current = wrap(Math.round(position.current)); paintAll(true); setMovingState(false); settled.current.splice(0).forEach(f => f()); }
 };
 const run = () => { setMovingState(true); if (!raf.current) raf.current = requestAnimationFrame(tick); };

 const perFrame = (width: number) => Math.max(6, width / 34);
 const beginDrag = (x: number) => { tween.current = null; chase.current = null; drag.current = { x, from: position.current, samples: [{ t: performance.now(), p: position.current }] }; run(); };
 const dragTo = (x: number, width: number) => {
  const d = drag.current; if (!d) return;
  position.current = d.from - (x - d.x) / perFrame(width);
  const now = performance.now(); d.samples.push({ t: now, p: position.current });
  while (d.samples.length > 2 && now - d.samples[0].t > 90) d.samples.shift();
 };
 const endDrag = () => {
  const d = drag.current; if (!d) return; drag.current = null;
  const a = d.samples[0], b = d.samples[d.samples.length - 1];
  const v = b.t - a.t > 8 ? (b.p - a.p) / (b.t - a.t) : 0;
  const travel = reduced() ? 0 : Math.max(-count / 3, Math.min(count / 3, v * INERTIA_TAU));
  chase.current = { to: Math.round(position.current + travel), tau: Math.abs(travel) > .5 ? INERTIA_TAU : SETTLE_TAU };
  run();
 };
 const nudge = (pixels: number, width: number) => { tween.current = null; const from = chase.current?.to ?? position.current; chase.current = { to: from + pixels / perFrame(width), tau: WHEEL_TAU }; run(); };
 const step = (frames: number) => { tween.current = null; const from = Math.round(chase.current?.to ?? position.current); chase.current = { to: from + frames, tau: KEY_TAU }; run(); };
 // Turns to a frame; resolves once the turn has come to rest.
 const rotateTo = (frame: number) => new Promise<void>(res => {
  let delta = wrap(frame - position.current); if (delta > count / 2) delta -= count;
  if (Math.abs(delta) < .01) { res(); return; }
  drag.current = null; chase.current = null;
  if (reduced()) { position.current = frame; paintAll(true); setMovingState(false); res(); return; }
  tween.current = { from: position.current, to: position.current + delta, start: performance.now(), duration: Math.min(1600, 520 + 1000 * Math.abs(delta) / (count / 2)) };
  settled.current.push(res);
  run();
 });

 useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); raf.current = 0; last.current = 0; }, []);

 return { displayed, moving, readyTick, load, isReady, whenReady, canvasRef, beginDrag, dragTo, endDrag, nudge, step, rotateTo, isDragging: () => !!drag.current, index };
}
export type OrbitEngine = ReturnType<typeof useOrbit>;
