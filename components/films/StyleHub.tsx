'use client';
import { useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { ALMA_BAY_FILMS, FILM_STYLES } from '@/content/projects/alma-bay-films';
import { useScrollProgress } from './useScroll';
import h from './hub.module.css';

const N = FILM_STYLES.length;

// The style hub: a pinned stage where scrolling turns a 3D carousel of the three films (each card plays its phone cut).
// Scroll, drag, arrows or ←/→ turn it; the front card opens its style page.
export default function StyleHub() {
 const track = useRef<HTMLDivElement>(null);
 const router = useRouter();
 const prog = useScrollProgress(track);
 const p = prog * (N - 1);                       // 0 … N-1, continuous
 const active = Math.round(p);
 const vids = useRef<(HTMLVideoElement | null)[]>([]);

 const goTo = useCallback((i: number) => {
  const el = track.current; if (!el) return;
  const k = Math.max(0, Math.min(N - 1, i));
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + (k / (N - 1)) * (el.offsetHeight - window.innerHeight), behavior: 'smooth' });
 }, []);

 // settle on the nearest card when scrolling stops (reads the live position, not a render's snapshot)
 useEffect(() => {
  let t = 0;
  const live = () => {
   const el = track.current; if (!el) return 0;
   const r = el.getBoundingClientRect(), sp = r.height - window.innerHeight;
   return sp <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / sp)) * (N - 1);
  };
  const on = () => {
   clearTimeout(t);
   t = window.setTimeout(() => { const q = live(), k = Math.round(q); if (Math.abs(q - k) > 0.03 && q > 0.001 && q < N - 1.001) goTo(k); }, 180);
  };
  window.addEventListener('scroll', on, { passive: true });
  return () => { window.removeEventListener('scroll', on); clearTimeout(t); };
 }, [goTo]);

 // only the front card plays
 useEffect(() => {
  vids.current.forEach((v, i) => { if (!v) return; if (i === active) v.play().catch(() => {}); else v.pause(); });
 }, [active]);

 useEffect(() => {
  const on = (e: KeyboardEvent) => {
   if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goTo(active + 1); }
   if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goTo(active - 1); }
   if (e.key === 'Enter') router.push(`/alma-bay/films/${FILM_STYLES[active].slug}`);
  };
  window.addEventListener('keydown', on); return () => window.removeEventListener('keydown', on);
 }, [active, goTo, router]);

 const st = FILM_STYLES[active];
 return <main className={h.page}>
  <div className={h.backdrops} aria-hidden>
   {FILM_STYLES.map((s, i) => <img key={s.slug} src={s.cuts[2].poster} alt="" style={{ opacity: Math.max(0, 1 - Math.abs(p - i)) }} />)}
  </div>

  <nav className={h.bar}>
   <Link href="/" className={h.logo} aria-label="residence.tech"><Logo /></Link>
   <ul className={h.tabs}>{FILM_STYLES.map(s => <li key={s.slug}><Link href={`/alma-bay/films/${s.slug}`} data-style={s.slug}>{s.name}</Link></li>)}</ul>
   <Link href="/alma-bay" className={h.cta}>Alma Bay</Link>
  </nav>

  <div ref={track} className={h.track} style={{ height: `${N * 100}svh` }}>
   <section className={h.stage} aria-roledescription="carousel" aria-label="Film styles">
    <header className={h.head}>
     <p className={h.kicker}>{ALMA_BAY_FILMS.title}</p>
     <h1 className={h.h1}>Three films. <em>One home.</em></h1>
    </header>
    <p className={h.count} aria-hidden><b>{String(active + 1).padStart(2, '0')}</b> / {String(N).padStart(2, '0')}</p>

    <div className={h.ring}>
     {FILM_STYLES.map((s, i) => {
      const off = i - p, a = Math.abs(off);
      const style = {
       transform: `translateX(${off * 96}%) translateZ(${-a * 240}px) rotateY(${off * -40}deg) scale(${1 - a * 0.08})`,
       opacity: Math.max(0, 1 - a * 0.38), zIndex: 10 - Math.round(a * 3),
       filter: a > 0.05 ? `brightness(${1 - Math.min(0.45, a * 0.35)})` : undefined,
      } as React.CSSProperties;
      const front = i === active;
      const card = <>
       <video ref={el => { vids.current[i] = el; }} src={s.cuts[2].src} poster={s.cuts[2].poster} muted loop playsInline preload={front ? 'auto' : 'none'} aria-hidden />
       <span className={h.cardShade} />
       <span className={h.cardNo}>{s.no}</span>
       <span className={h.cardName}>{s.name}</span>
       <span className={h.cardTag}>{s.tagline}</span>
      </>;
      return front
       ? <Link key={s.slug} href={`/alma-bay/films/${s.slug}`} className={h.card} data-style={s.slug} data-front style={style} aria-label={`Open ${s.name}`}>{card}</Link>
       : <button key={s.slug} type="button" className={h.card} data-style={s.slug} style={style} onClick={() => goTo(i)} aria-label={`Show ${s.name}`}>{card}</button>;
     })}
    </div>

    <div className={h.info} data-style={st.slug}>
     <p className={h.concept}>{st.concept}</p>
     <div className={h.ctrls}>
      <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous style"><ArrowLeft size={18} aria-hidden /></button>
      <Link href={`/alma-bay/films/${st.slug}`} className={h.open}>Open {st.name}</Link>
      <button type="button" onClick={() => goTo(active + 1)} disabled={active === N - 1} aria-label="Next style"><ArrowRight size={18} aria-hidden /></button>
     </div>
    </div>

    <div className={h.bars} aria-hidden>
     {FILM_STYLES.map((s, i) => <span key={s.slug}><i style={{ transform: `scaleX(${Math.max(0, Math.min(1, p - i + 1))})` }} /></span>)}
    </div>
    <p className={h.hint} aria-hidden>Scroll to turn · click to open</p>
   </section>
  </div>
 </main>;
}
