'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, Hand, Play } from 'lucide-react';
import { useFrameSequence } from '@/components/building/useFrameSequence';
import { film } from '@/components/landing/media';
import s from './home.module.css';
import { useHome, type Orbit } from './data';

// The building: the measured 360° orbit on the left when the building was modelled (drag / swipe / arrows to turn; this
// residence outlined on every view), its stills and films on the right (they open in the page's lightbox). Without an
// orbit the media viewer takes the whole width (the developer's renders, or stills made from a simple massing model).

type Shot = { kind: 'img' | 'video'; src: string; caption: string };
const area = (pts: string) => { const p = pts.trim().split(/\s+/).map(q => q.split(',').map(Number)); let a = 0; for (let i = 0; i < p.length; i++) { const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length]; a += x0 * y1 - x1 * y0; } return Math.abs(a) / 2; };

function useRing(count: number, ringVideo?: string) {
 const [ring, setRing] = useState<{ video?: string; stride: number } | null>(null);
 useEffect(() => {
  if (!count) return;
  const ua = navigator.userAgent;
  const ios = /iP(hone|ad|od)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const safari = /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg|FxiOS|Android/.test(ua);
  const src = ringVideo && (window.location.hostname.endsWith('residence.tech') && ringVideo.startsWith('/') ? film(ringVideo) : ringVideo);
  setRing(src && !(ios || safari) ? { video: src, stride: count >= 300 ? 12 : 4 } : { stride: count >= 300 ? 3 : 1 });
 }, [count, ringVideo]);
 return [ring, setRing] as const;
}

function Orbit360() {
 const { d, t, tx } = useHome(); const B = d.building!.orbit!;
 const [orbit, setOrbit] = useState<Orbit | null>(null);
 const host = useRef<HTMLDivElement>(null);
 const [near, setNear] = useState(false);
 useEffect(() => {
  const el = host.current; if (!el) return;
  const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { setNear(true); io.disconnect(); } }, { rootMargin: '800px' });
  io.observe(el); return () => io.disconnect();
 }, []);
 useEffect(() => { if (near) fetch(B.frames).then(r => r.json()).then(setOrbit).catch(() => {}); }, [near, B.frames]);
 const frames = orbit?.frames ?? [];
 const [ring, setRing] = useRing(orbit?.count ?? 0, B.ringVideo);
 const sources = useMemo(() => ring ? frames.map(f => f.src) : [], [frames, ring]);
 // the orbit opens on the front: both towers side by side, the pool between them (admin 11-10)
 const best = frames.length ? B.startView % frames.length : 0;
 const engine = useFrameSequence(sources, 0, 1, { aspect: B.aspect ?? 625 / 1000, maxWidth: 2000, turnPerWidth: 260, inertia: 480, video: ring?.video, stride: ring?.stride ?? 1, onVideoFail: () => setRing({ stride: (orbit?.count ?? 0) >= 300 ? 3 : 1 }) });
 const turned = useRef(false);
 useEffect(() => { if (!turned.current && sources.length && best) { turned.current = true; engine.rotateTo(best); } }, [sources.length, best, engine]);
 const press = useRef<number | null>(null);
 const [hint, setHint] = useState(true);
 // this residence on the current view: its outline, and a leader line from it to "Your apartment" (on the side with
 // more room, inside the visible middle 60 % of the frame: x 200–800 of 1000)
 const frame = frames[engine.displayed];
 const mine = frame?.spots.filter(sp => sp.id === B.unit) ?? [];
 // the label's width in frame units (the crop shows x 200–800 of 1000 across the stage), measured, so it always fits
 const labelRef = useRef<HTMLSpanElement>(null);
 const [lw, setLw] = useState(260);
 useEffect(() => {
  const l = labelRef.current, st = l?.closest<HTMLElement>('[data-stage]'); if (!l || !st) return;
  const m = () => setLw(l.offsetWidth / st.offsetWidth * 600);
  m(); const ro = new ResizeObserver(m); ro.observe(st); ro.observe(l); return () => ro.disconnect();
 });
 const lead = useMemo(() => {
  const pts = mine.flatMap(sp => sp.points.trim().split(/\s+/).map(q => q.split(',').map(Number)));
  if (!pts.length) return null;
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const L = 212, R = 788, gap = 60;                      // the visible band, with a small margin
  const fitsR = x1 + gap + lw <= R, fitsL = x0 - gap - lw >= L;
  const right = fitsR && (!fitsL || (x0 + x1) / 2 < 500);
  const ax = right ? x1 + 4 : x0 - 4;
  // where the label's near edge sits: beside the apartment if it fits, else pushed inside the band (over the tower)
  const lx = right ? Math.min(ax + Math.max(gap, 120), R - lw) : Math.max(ax - Math.max(gap, 120), L + lw);
  const ly = Math.max(cy - 70, 40);
  return { right, ax, ay: cy, ex: lx + (right ? -18 : 18), lx, ly };
 }, [mine, lw]);
 const step = (d: number) => { setHint(false); engine.step(d * Math.max(1, Math.round(frames.length / 24))); };

 return <div className={s.orbit} ref={host}>
  <div className={s.orbitStage} data-stage tabIndex={0} role="group" aria-label={t.building.stage}
   onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); step(e.key === 'ArrowRight' ? -1 : 1); } }}
   onPointerDown={e => { if (e.button !== 0 || (e.target as HTMLElement).closest('[data-ui]')) return; press.current = e.clientX; setHint(false); engine.beginDrag(e.clientX); e.currentTarget.setPointerCapture(e.pointerId); }}
   onPointerMove={e => { if (press.current != null) engine.dragTo(e.clientX); }}
   onPointerUp={e => { press.current = null; engine.endDrag(); if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); }}
   onPointerCancel={() => { press.current = null; engine.endDrag(); }}
   onWheel={e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { setHint(false); engine.nudgePixels(e.deltaX); } }}>
   <div className={s.orbitCrop}>
   {frames[0] && !engine.firstReady && <img className={s.orbitPoster} src={frames[best]?.src ?? frames[0].src} alt="" draggable={false} />}
   <canvas ref={engine.canvasRef} className={s.orbitCanvas} role="img" aria-label={t.building.canvas} />
   {frame && !engine.failed && <svg viewBox="0 0 1000 625" className={s.orbitSpots} aria-hidden data-moving={engine.moving || undefined}>
    {mine.map((sp, i) => <polygon key={i} points={sp.points} vectorEffect="non-scaling-stroke" />)}
    {lead && <g className={s.lead}>
     <circle cx={lead.ax} cy={lead.ay} r={3.2} />
     <polyline points={`${lead.ax},${lead.ay} ${lead.ex},${lead.ly} ${lead.lx},${lead.ly}`} pathLength={1} vectorEffect="non-scaling-stroke" />
    </g>}
   </svg>}
   {lead && !engine.failed && <span ref={labelRef} className={s.leadLabel} data-side={lead.right ? 'r' : 'l'} data-moving={engine.moving || undefined}
    style={{ left: `${lead.lx / 10}%`, top: `${lead.ly / 6.25}%` }}><i />{t.building.yours}{d.where.floor != null && <small>{t.building.floor(tx(d.unit), d.where.floor)}</small>}</span>}
   </div>
   {hint && <span className={s.orbitHint}><Hand size={15} aria-hidden />{t.building.hint}</span>}
   <div className={s.orbitTools} data-ui>
    <button type="button" aria-label={t.building.left} onClick={() => step(1)}><ChevronLeft size={18} /></button>
    <button type="button" aria-label={t.building.right} onClick={() => step(-1)}><ChevronRight size={18} /></button>
   </div>
  </div>
  <ul className={s.bFigures}>{d.building!.figures.map(f => <li key={f.label.en}><b>{f.value}</b><span>{tx(f.label)}</span></li>)}</ul>
 </div>;
}

/** the media: one large viewer (videos play on their own) + a row of thumbnails that scrolls sideways; hovering a
 *  thumbnail shows it in the viewer, clicking the viewer or a thumbnail opens the lightbox */
function MediaViewer({ open, height }: { open: (items: Shot[], at?: number) => void; height?: number }) {
 const { d, t, tx } = useHome();
 const M = d.building!.media;
 const cap = (j: number) => tx(M[j].caption);
 const items: Shot[] = M.map((m, j) => ({ kind: m.kind, src: m.src, caption: cap(j) }));
 const [cur, setCur] = useState(0);
 const row = useRef<HTMLDivElement>(null);
 const m = M[cur];
 const slide = (d: number) => row.current?.scrollBy({ left: d * row.current.clientWidth * 0.8, behavior: 'smooth' });
 return <div className={s.bMedia} style={height ? { height } : undefined}>
  <button type="button" className={s.bBig} onClick={() => open(items, cur)} aria-label={t.building.open(cap(cur))}>
   {M.map((q, j) => q.kind === 'video'
    ? <video key={q.src} src={j === cur ? q.src : undefined} poster={q.thumb} muted loop playsInline autoPlay preload="none" data-on={j === cur || undefined} aria-hidden />
    : <img key={q.src} src={q.src} alt="" loading="lazy" data-on={j === cur || undefined} />)}
   <span className={s.bBigCap}>{m.kind === 'video' && <Play size={12} fill="currentColor" aria-hidden />}{cap(cur)}<small><bdi dir="ltr">{cur + 1} / {M.length}</bdi></small></span>
   <span className={s.bExpand} aria-hidden><Expand size={16} /></span>
  </button>
  <div className={s.bRowWrap}>
   <button type="button" className={s.bArrow} aria-label={t.plan.back} onClick={() => slide(-1)}><ChevronLeft size={16} /></button>
   <div className={s.bRow} ref={row}>{M.map((q, j) => <button key={q.src} type="button" className={s.bThumb} data-on={j === cur || undefined} data-video={q.kind === 'video' || undefined}
    onMouseEnter={() => setCur(j)} onFocus={() => setCur(j)} onClick={() => open(items, j)} aria-label={`${cap(j)}${q.kind === 'video' ? t.building.video : ''}`}>
    <img src={q.thumb} alt="" loading="lazy" />{q.kind === 'video' && <span><Play size={10} fill="currentColor" aria-hidden /></span>}</button>)}</div>
   <button type="button" className={s.bArrow} aria-label={t.plan.on} onClick={() => slide(1)}><ChevronRight size={16} /></button>
  </div>
 </div>;
}

export default function BuildingSection({ open }: { open: (items: Shot[], at?: number) => void }) {
 const { d } = useHome();
 const host = useRef<HTMLDivElement>(null);
 const orbit = !!d.building?.orbit;
 const [h, setH] = useState<number>();
 // the media column is as tall as the orbit stage beside it (one column under the other on small screens)
 useEffect(() => {
  const st = host.current?.querySelector<HTMLElement>('[data-stage]'); if (!st) return;
  const ro = new ResizeObserver(() => setH(window.innerWidth > 960 ? st.offsetHeight : undefined)); ro.observe(st); return () => ro.disconnect();
 }, [orbit]);
 if (!d.building?.media.length && !orbit) return null;
 return <div className={s.building} ref={host} data-solo={!orbit || undefined}>
  {orbit && <Orbit360 />}
  {d.building!.media.length > 0 && <MediaViewer open={open} height={orbit ? h : undefined} />}
 </div>;
}
