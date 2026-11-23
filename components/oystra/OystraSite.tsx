'use client';
// Oystra by Richmind: the first Signature (luxury) project page. In order: the pinned scroll opening, the project in a dark
// band (statement, facts with icons), the developer's film, the living room built by scroll, and the apartment tour (the home seen from above beside one large photograph; the two change together, room by room).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import OystraOpening from './OystraOpening';
import ResidenceTour from './ResidenceTour';
import BuildScroll, { BUILD, DIVE } from './BuildScroll';
import LocationUnfold from './LocationUnfold';
import { Edge } from './BuildScroll';
import HomeSelector, { FULL, type Picked } from './HomeSelector';
import ContactFooter from './ContactFooter';
import EnquiryPanel from './EnquiryPanel';
import { MEDIA, ROOMS } from './content';
import s from './oystra.module.css';

const FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Hanken+Grotesk:wght@300;400;500&family=Cinzel:wght@400;500&display=swap';
const still = (id: string) => `${MEDIA}/c905/${id}.webp`;

export default function OystraSite() {
 const shots = useMemo(() => ROOMS.flatMap(r => r.shots), []);
 const [open, setOpen] = useState<number | null>(null);
 // the home chosen in the selector opens in the section above it. The page never scrolls by itself: when that section is
 // out of sight a pearl rises from the chosen home to a slim note at the top of the screen, which leads up when clicked
 const [home, setHome] = useState<Picked | undefined>();
 const [sign, setSign] = useState<{ id: string; x: number; y: number; n: number } | null>(null);
 const up = useCallback(() => { setSign(null); document.getElementById('residence')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, []);
 const choose = useCallback((h: Picked, from: { x: number; y: number }) => {
  setHome(h);
  const r = document.getElementById('residence')?.getBoundingClientRect();
  if (r && r.top < -innerHeight * .25) setSign(s => ({ id: h.id, ...from, n: (s?.n ?? 0) + 1 }));
 }, []);
 useEffect(() => {
  if (!sign) return;
  const done = setTimeout(() => setSign(null), 12000);
  const seen = () => { const r = document.getElementById('residence')?.getBoundingClientRect(); if (r && r.top > -innerHeight * .25) setSign(null); };
  addEventListener('scroll', seen, { passive: true });
  return () => { clearTimeout(done); removeEventListener('scroll', seen); };
 }, [sign]);
 // both actions on the opening's final screen lead to the one section below it
 const go = useCallback(() => document.getElementById('film')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), []);
 useEffect(() => {
  if (open === null) return;
  const key = (e: KeyboardEvent) => {
   if (e.key === 'Escape') setOpen(null);
   if (e.key === 'ArrowRight') setOpen(i => i === null ? i : (i + 1) % shots.length);
   if (e.key === 'ArrowLeft') setOpen(i => i === null ? i : (i - 1 + shots.length) % shots.length);
  };
  addEventListener('keydown', key);
  return () => removeEventListener('keydown', key);
 }, [open, shots.length]);

 // the page's general rule (see oystra.module.css): whatever is marked data-reveal arrives when it scrolls into view, once
 const page = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const root = page.current;
  if (!root) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.setAttribute('data-in', ''); io.unobserve(e.target); } }), { threshold: .18, rootMargin: '0px 0px -6% 0px' });
  const seen = new WeakSet<Element>();
  const scan = () => root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-in])').forEach(e => { if (!seen.has(e)) { seen.add(e); io.observe(e); } });
  scan();
  // parts that arrive after their data has loaded (the home selector) are marked too
  const mo = new MutationObserver(scan); mo.observe(root, { childList: true, subtree: true });
  return () => { io.disconnect(); mo.disconnect(); };
 }, []);

 return <MotionConfig reducedMotion="user"><div className={s.page} ref={page}>
  <link rel="stylesheet" href={FONTS} precedence="default" />
  <OystraOpening onGo={go} />

  <main>
   {/* the place kept for the film: empty for now, under the foot of the hero */}
   <section id="film" className={s.filmSlot} aria-label="The film">
    <Edge side="bottom" tone="night" lift />
    <div className={s.filmSlotFrame} />
   </section>
   <BuildScroll film={DIVE} />
   <section id="residence" className={`${s.band} ${s.pearl} ${s.resBand}`}>
    <ResidenceTour layout="beside" hold={open !== null} onOpen={id => setOpen(shots.findIndex(x => x.id === id))} home={home}
     onPick={() => document.getElementById('homes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
     onEnquire={() => document.getElementById('build')?.scrollIntoView({ behavior: 'smooth', block: 'end' })} />
    <HomeSelector chosen={home?.id ?? FULL} onChoose={choose} onShow={up} />
   </section>
   <LocationUnfold />
   <BuildScroll film={BUILD} cut after="night" over={<EnquiryPanel />} />
  </main>
  <ContactFooter />

  <AnimatePresence>
   {sign && <motion.i key={`p${sign.n}`} className={s.signPearl} aria-hidden="true" initial={{ x: sign.x, y: sign.y, opacity: 0, scale: .6 }} animate={{ x: '50vw', y: 34, opacity: [0, 1, 1, 0], scale: 1 }} transition={{ duration: 1.1, ease: [0.5, 0, 0.2, 1], opacity: { duration: 1.1, times: [0, .15, .85, 1] } }} />}
   {sign && <motion.button key={`n${sign.n}`} type="button" className={s.signNote} onClick={up} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .5, delay: .95, ease: [0.16, 0.8, 0.2, 1] }}>
    <i aria-hidden="true" />{sign.id} is shown above <span aria-hidden="true"><b>↑</b><b>↑</b></span>
   </motion.button>}
  </AnimatePresence>

  {open !== null && <div className={s.lightbox} role="dialog" aria-modal="true" aria-label={shots[open].alt} onClick={() => setOpen(null)}>
   <img src={still(shots[open].id)} alt={shots[open].alt} />
   <p>{shots[open].alt}</p>
   <button type="button" className={s.close} onClick={() => setOpen(null)}>Close</button>
   <button type="button" className={s.prev} aria-label="Previous picture" onClick={e => { e.stopPropagation(); setOpen((open - 1 + shots.length) % shots.length); }}>‹</button>
   <button type="button" className={s.next} aria-label="Next picture" onClick={e => { e.stopPropagation(); setOpen((open + 1) % shots.length); }}>›</button>
  </div>}
 </div></MotionConfig>;
}
