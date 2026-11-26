'use client';
// The pinned scroll opening of the Oystra page: the page stays put while the picture follows the scroll
// (shell → pearl → sun in the arch → the island → the sky pool → the bar → the waterfront → night), then releases.
import { useEffect, useRef } from 'react';
import { OPENING_HTML } from './openingMarkup';
import { mountOpening } from './openingEngine';
import './opening.css';
import s from './oystra.module.css';

const GSAP_SRC = '/projects/oystra/vendor/gsap.min.js';
type GsapWindow = Window & { gsap?: unknown };

// one shared load of the animation library, kept beside the project's media so the page asks no other host for it
let gsapLoad: Promise<unknown> | null = null;
export const loadGsap = () => gsapLoad ??= new Promise((resolve, reject) => {
 const w = window as GsapWindow;
 if (w.gsap) return resolve(w.gsap);
 const s = document.createElement('script');
 s.src = GSAP_SRC; s.async = true;
 s.onload = () => resolve(w.gsap); s.onerror = reject;
 document.head.append(s);
});

export default function OystraOpening({ onGo }: { onGo: (id: string) => void }) {
 const ref = useRef<HTMLDivElement>(null);
 const go = useRef(onGo);
 useEffect(() => { go.current = onGo; }, [onGo]);
 useEffect(() => {
  const root = ref.current;
  if (!root) return;
  let off: (() => void) | undefined, gone = false;
  loadGsap().then(gsap => {
   if (gone) return;
   root.innerHTML = OPENING_HTML; // a fresh stage on every mount: the engine splits the headlines into letters in place
   off = mountOpening(root, gsap, id => go.current(id));
  }).catch(() => { /* without the library the opening stays on its dark stage and the page below still works */ });
  return () => { gone = true; off?.(); };
 }, []);
 // The opening is a long scroll: a small button in the corner runs it to its last screen (the hero), and is gone there.
 // It rides in a rail beside the stage (the engine owns the stage's own markup), stuck to the foot of the screen.
 const skip = () => { const w = ref.current?.parentElement; if (w) scrollTo({ top: w.getBoundingClientRect().bottom + scrollY - innerHeight, behavior: 'smooth' }); };
 return <div className={s.openWrap}>
  <div ref={ref} className="oyo" dangerouslySetInnerHTML={{ __html: OPENING_HTML }} suppressHydrationWarning />
  <div className={s.skipRail}><button type="button" className={s.skip} onClick={skip}>Skip <span aria-hidden="true">↓</span></button></div>
 </div>;
}
