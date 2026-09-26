'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { easeInOutCubic } from './motion';

// The building is a ring of pre-rendered frames. Position is a fractional frame index held in a
// ref and eased from a rAF loop; the canvas always shows one whole, sharp frame (the nearest), so
// a turn reads as the building rotating, never two frames dissolving. `displayed` follows the drawn
// frame so the apartment overlays turn with the building instead of disappearing.

const INERTIA_TAU = 260; // ms — how long a flick keeps travelling
const WHEEL_TAU = 90;
const KEY_TAU = 120;
const SETTLE_TAU = 110;
const CONCURRENT_LOADS = 4;

type Tween = { from: number; to: number; start: number; duration: number };
type Chase = { to: number; tau: number };

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useFrameSequence(sources: string[], initial: number, zoom: number) {
 const count = sources.length;
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const zoomRef = useRef<HTMLDivElement>(null);
 const images = useRef<(HTMLImageElement | null)[]>([]);
 const ready = useRef<boolean[]>([]);
 const position = useRef(initial);
 const tween = useRef<Tween | null>(null);
 const chase = useRef<Chase | null>(null);
 const drag = useRef<{ x: number; from: number; samples: { t: number; p: number }[] } | null>(null);
 const priority = useRef<number[]>([]);
 const pump = useRef<() => void>(() => {});
 const frameRequest = useRef(0);
 const lastTick = useRef(0);
 const drawnFrame = useRef(-1);
 const movingRef = useRef(false);
 const [settled, setSettled] = useState(initial);
 const [displayed, setDisplayed] = useState(initial);
 const [moving, setMoving] = useState(false);
 const [firstReady, setFirstReady] = useState(false);
 const [failed, setFailed] = useState(false);

 const wrap = useCallback((p: number) => ((p % count) + count) % count, [count]);

 const nearestReady = (i: number) => {
  for (let offset = 0; offset <= count / 2; offset++) {
   if (ready.current[(i + offset) % count]) return (i + offset) % count;
   if (ready.current[(i - offset + count) % count]) return (i - offset + count) % count;
  }
  return -1;
 };

 const draw = (force = false) => {
  const canvas = canvasRef.current;
  if (!canvas || !count) return;
  const shown = nearestReady(Math.round(wrap(position.current)) % count);
  if (shown < 0 || (!force && shown === drawnFrame.current)) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.drawImage(images.current[shown]!, 0, 0, canvas.width, canvas.height);
  if (shown !== drawnFrame.current) { drawnFrame.current = shown; setDisplayed(shown); }
 };

 const setMovingState = (value: boolean) => {
  if (movingRef.current === value) return;
  movingRef.current = value;
  setMoving(value);
 };

 const finish = () => {
  position.current = wrap(Math.round(position.current));
  draw(true);
  setMovingState(false);
  setSettled(position.current);
 };

 const tick = (now: number) => {
  const dt = lastTick.current ? Math.min(48, now - lastTick.current) : 16;
  lastTick.current = now;
  let active = true;
  if (drag.current) {
   // Position follows the pointer directly; nothing to integrate.
  } else if (tween.current) {
   const t = tween.current, progress = Math.min(1, (now - t.start) / t.duration);
   position.current = t.from + (t.to - t.from) * easeInOutCubic(progress);
   if (progress >= 1) { tween.current = null; active = false; }
  } else if (chase.current) {
   // Exponential approach: it starts at the flick's speed and lands exactly on a frame.
   const c = chase.current;
   position.current += (c.to - position.current) * (1 - Math.exp(-dt / c.tau));
   if (Math.abs(c.to - position.current) < 0.004) { position.current = c.to; chase.current = null; active = false; }
  } else if (Math.abs(position.current - Math.round(position.current)) > 0.004) {
   chase.current = { to: Math.round(position.current), tau: SETTLE_TAU };
  } else {
   active = false;
  }
  draw();
  if (active) frameRequest.current = requestAnimationFrame(tick);
  else { frameRequest.current = 0; lastTick.current = 0; finish(); }
 };

 const run = () => {
  setMovingState(true);
  if (!frameRequest.current) frameRequest.current = requestAnimationFrame(tick);
 };

 const pixelsPerFrame = () => {
  const width = canvasRef.current?.parentElement?.parentElement?.clientWidth ?? 600;
  return Math.max(5, width / 30); // one stage-width drag turns the building ~150°
 };

 const beginDrag = (x: number) => {
  tween.current = null; chase.current = null;
  drag.current = { x, from: position.current, samples: [{ t: performance.now(), p: position.current }] };
  run();
 };

 const dragTo = (x: number) => {
  const d = drag.current;
  if (!d) return;
  position.current = d.from - (x - d.x) / pixelsPerFrame();
  const now = performance.now();
  d.samples.push({ t: now, p: position.current });
  while (d.samples.length > 2 && now - d.samples[0].t > 90) d.samples.shift();
 };

 const endDrag = () => {
  const d = drag.current;
  if (!d) return;
  drag.current = null;
  const first = d.samples[0], last = d.samples[d.samples.length - 1];
  const velocity = last.t - first.t > 8 ? (last.p - first.p) / (last.t - first.t) : 0; // frames per ms
  const travel = prefersReducedMotion() ? 0 : Math.max(-count / 2, Math.min(count / 2, velocity * INERTIA_TAU));
  chase.current = { to: Math.round(position.current + travel), tau: Math.abs(travel) > 0.5 ? INERTIA_TAU : SETTLE_TAU };
  priority.current = [];
  run();
 };

 // Wheel and trackpad deltas, in pixels; accumulates so a long swipe keeps turning.
 const nudgePixels = (pixels: number) => {
  tween.current = null;
  const from = chase.current?.to ?? position.current;
  chase.current = { to: from + pixels / pixelsPerFrame(), tau: WHEEL_TAU };
  run();
 };

 const step = (frames: number) => {
  tween.current = null;
  const from = Math.round(chase.current?.to ?? position.current);
  chase.current = { to: from + frames, tau: KEY_TAU };
  run();
 };

 // A deliberate turn to a view: shortest way round, long enough to watch it happen.
 const rotateTo = (frame: number) => {
  if (!count) return;
  const start = position.current;
  let delta = wrap(frame - start);
  if (delta > count / 2) delta -= count;
  if (Math.abs(delta) < 0.01 && !movingRef.current) return;
  drag.current = null; chase.current = null;
  const target = start + delta, span = Math.abs(delta);
  tween.current = null;
  if (prefersReducedMotion()) { position.current = Math.round(target); finish(); return; }
  if (span < 0.5) { chase.current = { to: Math.round(target), tau: SETTLE_TAU }; run(); return; }
  priority.current = Array.from({ length: Math.ceil(span) + 1 }, (_, i) => wrap(Math.round(start + Math.sign(delta) * i)));
  pump.current();
  tween.current = { from: start, to: target, start: performance.now(), duration: Math.min(1500, 520 + 950 * (span / (count / 2))) };
  run();
 };

 // Load every frame once, nearest the current angle first, a few at a time.
 useEffect(() => {
  if (!count) return;
  images.current = sources.map(() => null);
  ready.current = sources.map(() => false);
  let cancelled = false, inflight = 0;
  const origin = Math.round(wrap(position.current));
  const outward = Array.from({ length: count }, (_, i) => wrap(origin + (i % 2 ? Math.ceil(i / 2) : -i / 2)));
  const next = () => {
   while (priority.current.length) { const i = priority.current.shift()!; if (!images.current[i]) return i; }
   while (outward.length) { const i = outward.shift()!; if (!images.current[i]) return i; }
   return -1;
  };
  pump.current = () => {
   while (!cancelled && inflight < CONCURRENT_LOADS) {
    const i = next();
    if (i < 0) return;
    const img = new Image();
    img.decoding = 'async';
    img.src = sources[i];
    images.current[i] = img;
    inflight++;
    img.decode().then(() => {
     if (cancelled) return;
     ready.current[i] = true;
     const p = wrap(position.current);
     if (i === Math.round(p) % count || drawnFrame.current < 0) draw(true);
     if (i === origin) setFirstReady(true);
    }).catch(() => { if (!cancelled && i === origin) setFailed(true); })
     .finally(() => { inflight--; pump.current(); });
   }
  };
  pump.current();
  return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [sources.join('|')]);

 // Size the canvas backing store to what is actually shown, zoom included, up to the source size.
 useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const resize = () => {
   const ratio = Math.min(window.devicePixelRatio || 1, 2) * zoom;
   const width = Math.min(1600, Math.round(canvas.clientWidth * ratio));
   if (!width) return;
   canvas.width = width;
   canvas.height = Math.round(width * 9 / 8);
   draw(true);
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [zoom]);

 // Reset the handle too: React's dev double-mount runs this cleanup and then mounts again, and a
 // stale id would make run() believe a loop is alive — the building would never move again.
 useEffect(() => () => {
  if (frameRequest.current) cancelAnimationFrame(frameRequest.current);
  frameRequest.current = 0; lastTick.current = 0;
 }, []);

 return { canvasRef, zoomRef, settled, displayed, moving, firstReady, failed, beginDrag, dragTo, endDrag, nudgePixels, step, rotateTo, isDragging: () => !!drag.current };
}
export type FrameSequence = ReturnType<typeof useFrameSequence>;
