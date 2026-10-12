'use client';
import { useEffect, useState } from 'react';
import s from './landing.module.css';

// The headline's last word, in orange, cycling through what can be sold. All words share one grid cell, so the
// line keeps the width of the longest one and never jumps.
export default function Rotator({ words, ms = 2200 }: { words: string[]; ms?: number }) {
 const [i, setI] = useState(0);
 useEffect(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const id = setInterval(() => setI(n => (n + 1) % words.length), ms);
  return () => clearInterval(id);
 }, [words.length, ms]);
 return <span className={s.rotator} aria-hidden>
  {words.map((w, k) => <span key={w} data-state={k === i ? 'on' : k === (i - 1 + words.length) % words.length ? 'out' : undefined}>{w}</span>)}
 </span>;
}
