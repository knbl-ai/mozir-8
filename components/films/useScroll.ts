'use client';
import { useEffect, useState, type RefObject } from 'react';

/** 0 → 1 while the element scrolls through the viewport: 0 when its top reaches the top of the screen, 1 when its bottom
 *  reaches the bottom (the span a sticky child stays pinned). rAF-throttled. */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
 const [p, setP] = useState(0);
 useEffect(() => {
  let raf = 0;
  const read = () => {
   raf = 0;
   const el = ref.current; if (!el) return;
   const r = el.getBoundingClientRect(), span = r.height - window.innerHeight;
   setP(span <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / span)));
  };
  const on = () => { if (!raf) raf = requestAnimationFrame(read); };
  read();
  window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on);
  return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
 }, [ref]);
 return p;
}

/** true once the element has been at least partly on screen (used to start muted loops only when seen). */
export function useInView(ref: RefObject<HTMLElement | null>, margin = '200px') {
 const [seen, setSeen] = useState(false);
 useEffect(() => {
  const el = ref.current; if (!el || seen) return;
  const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { setSeen(true); io.disconnect(); } }, { rootMargin: margin });
  io.observe(el); return () => io.disconnect();
 }, [ref, seen, margin]);
 return seen;
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** maps p from [a, b] to [0, 1], clamped */
export const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
