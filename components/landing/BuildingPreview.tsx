'use client';
import { useEffect, useRef } from 'react';
import s from './landing.module.css';

const FPS = 18; // 36 frames, 10° apart: one full turn in two seconds
const BUILDING_SPAN = 0.72, BUILDING_CENTRE = 0.53; // of the frame's height

// The Sales Gallery's own building, turning. It turns while the card is hovered or focused, and on
// touch screens while it is on screen — the preview shows what the product does, not a picture of it.
export default function BuildingPreview({ frames, active }: { frames: string[]; active: boolean }) {
 const canvas = useRef<HTMLCanvasElement>(null);
 const images = useRef<HTMLImageElement[]>([]);
 const ready = useRef<boolean[]>([]);
 const at = useRef(0);
 const visible = useRef(false);
 const running = useRef(false);

 const draw = () => {
  const c = canvas.current, img = images.current[at.current];
  if (!c || !img || !ready.current[at.current]) return;
  const ctx = c.getContext('2d');
  if (!ctx) return;
  // Cover the card, but keep the building itself (roof to street, the middle ~72% of the frame's
  // height) in view whatever the card's shape: a wide card trims sky and ground, never the roof.
  const scale = Math.max(c.width / img.naturalWidth, Math.min(c.height / img.naturalHeight, c.height / (img.naturalHeight * BUILDING_SPAN)));
  const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
  const y = Math.min(0, Math.max(c.height - h, c.height / 2 - h * BUILDING_CENTRE));
  ctx.drawImage(img, (c.width - w) / 2, y, w, h);
 };

 // Load after the page settles, first frame first; the rest only once the card is near the screen.
 useEffect(() => {
  const c = canvas.current;
  if (!c || !frames.length) return;
  let cancelled = false;
  const load = (i: number) => {
   const img = new Image();
   img.decoding = 'async';
   img.src = frames[i];
   images.current[i] = img;
   return img.decode().then(() => { if (!cancelled) { ready.current[i] = true; if (i === at.current) draw(); } }).catch(() => {});
  };
  const resize = () => {
   const ratio = Math.min(window.devicePixelRatio || 1, 2);
   c.width = Math.round(c.clientWidth * ratio); c.height = Math.round(c.clientHeight * ratio);
   draw();
  };
  resize();
  const sizes = new ResizeObserver(resize); sizes.observe(c);
  let rest = false;
  const seen = new IntersectionObserver(([entry]) => {
   visible.current = entry.isIntersecting;
   if (entry.isIntersecting && !rest) { rest = true; frames.forEach((_, i) => { if (i) load(i); }); }
  }, { rootMargin: '200px' });
  load(0).then(() => seen.observe(c));
  return () => { cancelled = true; sizes.disconnect(); seen.disconnect(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [frames.join('|')]);

 useEffect(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = window.matchMedia('(hover: none)').matches;
  if (reduced || !(active || touch)) return;
  running.current = true;
  let last = 0, id = 0;
  const tick = (now: number) => {
   if (!running.current) return;
   if (now - last >= 1000 / FPS && visible.current) {
    const next = (at.current + 1) % frames.length;
    if (ready.current[next]) { at.current = next; draw(); last = now; }
   }
   id = requestAnimationFrame(tick);
  };
  id = requestAnimationFrame(tick);
  return () => { running.current = false; cancelAnimationFrame(id); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [active, frames.length]);

 return <canvas ref={canvas} className={s.previewMedia} aria-hidden />;
}
