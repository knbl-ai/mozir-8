'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { bricolage as sunday, hanken as mono, instrument as riviera } from '@/components/films/fonts';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Link2 } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { FILM_STYLES } from '@/content/projects/alma-bay-films';
import { copy } from './copy';
import f from './films.module.css';

// Each style's name is set in its own film's display face (the same self-hosted fonts as the style pages).

const N = FILM_STYLES.length;
const AUTO_MS = 6000;
const M = '/projects/shirat-hayam/highlights';

// Landing section (#films, shareable): one home's directed films in three styles on a 3D carousel. The band takes the
// colour of the style in front; the front card plays its phone cut; clicking it (or "Open") opens the style page in a new tab.
export default function FilmsSection() {
 const lang = useLang();
 const t = copy[lang].films;
 const rtl = lang === 'he';
 const [i, setI] = useState(0);
 const [copied, setCopied] = useState(false);
 const [seen, setSeen] = useState(false);
 const band = useRef<HTMLDivElement>(null);
 const vids = useRef<(HTMLVideoElement | null)[]>([]);
 const drag = useRef<{ x: number; moved: boolean } | null>(null);
 const [held, setHeld] = useState(false);                 // pointer over the stage or focus inside: no auto-advance
 const [loaded, setLoaded] = useState<Set<number>>(() => new Set());
 const wheel = useRef({ x: 0, lock: 0 });
 const go = useCallback((k: number) => setI(((k % N) + N) % N), []);

 // auto-advance every 6 s while on screen and not held (restarts after every change)
 useEffect(() => {
  if (!seen || held || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const id = setTimeout(() => go(i + 1), AUTO_MS);
  return () => clearTimeout(id);
 }, [i, seen, held, go]);
 // a film once loaded keeps its source, so coming back to a card doesn't reload it
 useEffect(() => { if (seen) setLoaded(prev => prev.has(i) ? prev : new Set(prev).add(i)); }, [i, seen]);
 // two-finger horizontal swipe on a touchpad anywhere on the band (wheel deltaX): one step per gesture
 const ringRef = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const el = band.current; if (!el) return;
  const on = (e: WheelEvent) => {
   if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
   e.preventDefault();
   const w = wheel.current, now = performance.now();
   if (now < w.lock) return;
   w.x += e.deltaX;
   if (Math.abs(w.x) > 40) { setI(c => (((c + (w.x > 0 ? 1 : -1) * (rtl ? -1 : 1)) % N) + N) % N); w.x = 0; w.lock = now + 650; }
  };
  el.addEventListener('wheel', on, { passive: false });
  return () => el.removeEventListener('wheel', on);
 }, [rtl]);

 useEffect(() => {
  const el = band.current; if (!el) return;
  const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 });
  io.observe(el); return () => io.disconnect();
 }, []);
 // only the front card plays, and only while the band is on screen (re-run once its source is set: the source arrives a
 // render after the card comes to the front)
 useEffect(() => {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  vids.current.forEach((v, k) => { if (!v) return; if (k === i && seen && !still && v.getAttribute('src')) v.play().catch(() => {}); else v.pause(); });
 }, [i, seen, loaded]);

 const share = async () => {
  const url = `${location.origin}${location.pathname}${location.search}#films`;
  try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { location.hash = 'films'; }
 };
 const st = FILM_STYLES[i];
 const dir = rtl ? -1 : 1;

 return <div id="films" ref={band} className={`${f.band} ${riviera.variable} ${mono.variable} ${sunday.variable}`} data-style={st.slug}>
  <div className={f.backdrops} aria-hidden>
   {FILM_STYLES.map((s, k) => <img key={s.slug} src={`${M}/card-${s.slug}.jpg`} alt="" data-on={k === i || undefined} loading="lazy" />)}
  </div>
  <section className={f.inner} aria-labelledby="films-title">
   <h2 id="films-title" className={f.title}>{t.title[0]} <em>{t.title[1]}</em></h2>
   <p className={f.sub}>{t.sub}</p>

   <div className={f.stage}>
   <aside className={f.side} data-side="get">
    <h3 className={f.sideTitle}>{t.getTitle}</h3>
    <ul className={f.get}>{t.get.map(g => <li key={g.name}>
     <span className={f.ratio} data-r={g.ratio} aria-hidden />
     <span><b>{g.name}</b><span className={f.spec}>{g.spec}</span><span className={f.use}>{g.use}</span></span>
    </li>)}</ul>
   </aside>

   <div className={f.centre}>
   <div ref={ringRef} className={f.ring} role="region" aria-roledescription="carousel" aria-label={t.region}
    onPointerEnter={e => e.pointerType === 'mouse' && setHeld(true)} onPointerLeave={() => setHeld(false)}
    onFocus={() => setHeld(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false); }}
    onKeyDown={e => { if (e.key === 'ArrowRight') go(i + dir); if (e.key === 'ArrowLeft') go(i - dir); }}
    onPointerDown={e => { drag.current = { x: e.clientX, moved: false }; }}
    onPointerMove={e => { const d = drag.current; if (d && Math.abs(e.clientX - d.x) > 12) d.moved = true; }}
    onPointerUp={e => { const d = drag.current; drag.current = null; if (!d || !d.moved) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 40) go(i + (dx < 0 ? dir : -dir)); }}
    onClickCapture={e => { if (drag.current?.moved) e.preventDefault(); }}>
    {FILM_STYLES.map((s, k) => {
     let d = k - i; if (d > N / 2) d -= N; if (d < -N / 2) d += N;  // a ring: one card on each side
     const off = d * dir, a = Math.abs(off);
     const style = {
      transform: `translateX(${off * 64}%) translateZ(${-a * 240}px) rotateY(${off * -34}deg) scale(${1 - a * 0.08})`,
      opacity: Math.max(0, 1 - a * 0.3), zIndex: 10 - a,
      filter: a ? `brightness(${1 - Math.min(0.5, a * 0.4)})` : undefined,
     } as React.CSSProperties;
     const front = k === i;
     const body = <>
      <img src={`${M}/card-${s.slug}.jpg`} alt="" className={f.media} draggable={false} />
      <video ref={el => { vids.current[k] = el; }} className={f.media} src={loaded.has(k) ? s.cuts[2].src : undefined} muted loop playsInline preload="none" aria-hidden
       onLoadedMetadata={e => { e.currentTarget.currentTime = 4; }}  // start inside the home, past the map and towers
       onPlaying={e => e.currentTarget.setAttribute('data-playing', '')} onPause={e => e.currentTarget.removeAttribute('data-playing')} />
      <span className={f.shade} aria-hidden />
      <span className={f.no} aria-hidden>{s.no}</span>
      <span className={f.chip} aria-hidden><ArrowUpRight size={18} strokeWidth={2} /></span>
      <span className={f.cardName}>{s.name}</span>
      <span className={f.cardTag}>{s.tagline}</span>
     </>;
     // the same element for every position, so a change glides instead of swapping elements: the front card opens the
     // apartment page in that style (in the visitor's language) in a new tab, a side card turns the ring to itself
     return <Link key={s.slug} href={`/alma-bay/films/${s.slug}?lang=${lang}`} target="_blank" rel="noopener" className={f.card} data-style={s.slug}
      data-front={front || undefined} data-side={!front ? (off < 0 ? 'start' : 'end') : undefined} style={style} draggable={false}
      aria-label={front ? `${t.open(s.name)} (${t.newTab})` : t.show(s.name)}
      onClick={e => { if (!front) { e.preventDefault(); go(k); } }}>{body}</Link>;
    })}
   </div>

   <div className={f.info}>
    <p className={f.tagline} aria-live="polite"><b>{st.name}</b> — {st.tagline}</p>
    <div className={f.ctrls}>
     <button type="button" onClick={() => go(i - 1)} aria-label={t.prev}>{rtl ? <ArrowRight size={18} aria-hidden /> : <ArrowLeft size={18} aria-hidden />}</button>
     <Link href={`/alma-bay/films/${st.slug}?lang=${lang}`} target="_blank" rel="noopener" className={f.open}>{t.open(st.name)}<ArrowUpRight size={16} aria-hidden /></Link>
     <button type="button" onClick={() => go(i + 1)} aria-label={t.next}>{rtl ? <ArrowLeft size={18} aria-hidden /> : <ArrowRight size={18} aria-hidden />}</button>
    </div>
    <ul className={f.dots}>{FILM_STYLES.map((s, k) => <li key={s.slug}>
     <button type="button" onClick={() => go(k)} aria-current={k === i || undefined}><i />{s.name}</button></li>)}</ul>
    <p className={f.note}>{t.note} <Link href={`/alma-bay/films/${st.slug}?lang=${lang}`} target="_blank" rel="noopener">{t.all}</Link>
     <button type="button" className={f.share} onClick={share} aria-live="polite">{copied ? <Check size={14} aria-hidden /> : <Link2 size={14} aria-hidden />}{copied ? t.copied : t.share}</button></p>
   </div>
   </div>

   <aside className={f.side} data-side="why">
    <h3 className={f.sideTitle}>{t.whyTitle}</h3>
    <ol className={f.why}>{t.why.map((w, k) => <li key={w.title}><span className={f.n} aria-hidden>{String(k + 1).padStart(2, '0')}</span><span><b>{w.title}</b><span className={f.use}>{w.body}</span></span></li>)}</ol>
   </aside>
   </div>

  </section>
 </div>;
}
