'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang, withLang } from '@/lib/i18n';
import { copy } from './copy';
import Button from './Button';
import { altFor, cover, styles, useSwipe } from './styleData';
import s from './landing.module.css';
import x from './styles.module.css';

const INTERVAL = 4000;
const CHIPS = 8;

// Landing section: a slideshow of the library's styles, a row of chips that jump to one, and the way to the full library.
export default function StylesSection() {
 const lang = useLang();
 const t = copy[lang].styles;
 const rtl = lang === 'he';
 const n = styles.length;
 const [i, setI] = useState(0);
 const [held, setHeld] = useState(false);       // pointer over or focus inside
 const [visible, setVisible] = useState(false); // on screen
 const [reduced, setReduced] = useState(true);  // until known, no motion
 const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
 const root = useRef<HTMLDivElement>(null);
 const chipRow = useRef<HTMLDivElement>(null);

 const go = useCallback((to: number) => setI(((to % n) + n) % n), [n]);
 // Phones: the chip row scrolls sideways; keep the current style's chip in view (the row only, never the page).
 useEffect(() => {
  const row = chipRow.current, chip = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
  if (!row || !chip || row.scrollWidth <= row.clientWidth) return;
  const left = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
  row.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' });
 }, [i, reduced]);
 // Only the slides already shown and the next one are in the page, so the section adds one image to the first load.
 useEffect(() => { setSeen(prev => (prev.has(i) && prev.has((i + 1) % n)) ? prev : new Set(prev).add(i).add((i + 1) % n)); }, [i, n]);
 useEffect(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const on = () => setReduced(mq.matches); on();
  mq.addEventListener('change', on);
  const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
  if (root.current) io.observe(root.current);
  return () => { mq.removeEventListener('change', on); io.disconnect(); };
 }, []);
 useEffect(() => {
  if (reduced || held || !visible) return;
  const id = setTimeout(() => go(i + 1), INTERVAL);
  return () => clearTimeout(id);
 }, [i, reduced, held, visible, go]);

 const swipe = useSwipe(() => go(i - 1), () => go(i + 1), rtl);
 const Prev = rtl ? ChevronRight : ChevronLeft, Next = rtl ? ChevronLeft : ChevronRight;
 const cur = styles[i];

 return <section id="styles" className={x.styles} aria-labelledby="styles-title">
  <div className={s.sectionHead}>
   <div>
    <h2 id="styles-title" className={s.sectionTitle}>{t.title}</h2>
    <p className={s.sectionLede}>{t.lede}</p>
   </div>
  </div>

  <div ref={root} className={x.show} role="region" aria-roledescription="carousel" aria-label={t.region}
   onPointerEnter={e => e.pointerType === 'mouse' && setHeld(true)} onPointerLeave={e => e.pointerType === 'mouse' && setHeld(false)}
   onFocus={() => setHeld(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false); }}
   onKeyDown={e => { if (e.key === 'ArrowLeft') go(i + (rtl ? 1 : -1)); if (e.key === 'ArrowRight') go(i + (rtl ? -1 : 1)); }}>
   <div className={x.frame} {...swipe}>
    {styles.map((st, k) => <figure key={st.slug} className={x.slide} data-on={k === i || undefined} aria-hidden={k !== i} role="group" aria-roledescription="slide" aria-label={`${k + 1} / ${n}`}>
     {seen.has(k) && <img src={cover(st).src} alt={k === i ? altFor(t, st, 'living') : ''} width={1600} height={900} className={x.slideImg}
      loading={k === 0 ? 'eager' : 'lazy'} fetchPriority={k === 0 ? 'high' : 'auto'} decoding="async" draggable={false} />}
    </figure>)}
    <div className={x.caption} aria-live={held || reduced ? 'polite' : 'off'}>
     <span className={x.count} aria-hidden>{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
     <h3 className={x.captionName}>{cur.name}</h3>
     <p className={x.captionConcept}>{cur.concept}</p>
     <ul className={x.swatches} aria-hidden>{cur.palette.map(c => <li key={c.hex} style={{ background: c.hex }} title={c.name} />)}</ul>
    </div>
    <button type="button" className={x.arrow} data-side="start" onClick={() => go(i - 1)} aria-label={t.prev}><Prev size={22} strokeWidth={1.8} aria-hidden /></button>
    <button type="button" className={x.arrow} data-side="end" onClick={() => go(i + 1)} aria-label={t.next}><Next size={22} strokeWidth={1.8} aria-hidden /></button>
    {!reduced && visible && !held && <i key={i} className={x.progress} style={{ animationDuration: `${INTERVAL}ms` }} aria-hidden />}
   </div>

   <div className={x.dots} role="group" aria-label={t.region}>
    {styles.map((st, k) => <button key={st.slug} type="button" className={x.dot} data-on={k === i || undefined} onClick={() => go(k)} aria-label={t.goTo(st.name)} aria-current={k === i || undefined} />)}
   </div>
  </div>

  <div ref={chipRow} className={x.chips} role="group" aria-label={t.chips}>
   {/* every style: desktop shows the first CHIPS (data-extra hidden), phones scroll the whole row */}
   {styles.map((st, k) => <button key={st.slug} type="button" className={x.chip} data-on={k === i || undefined} data-extra={k >= CHIPS || undefined} aria-pressed={k === i} onClick={() => go(k)}>
    <i style={{ background: st.palette[0].hex }} aria-hidden />{st.name}
   </button>)}
   <Link href={withLang('/styles', lang)} className={`${x.chip} ${x.chipAll}`}>{t.all} <span aria-hidden>{rtl ? '←' : '→'}</span></Link>
  </div>

  <div className={x.cta}><Button href={withLang('/styles', lang)}>{t.cta}</Button></div>
 </section>;
}
