'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, BedDouble, ChefHat, ChevronDown, Clapperboard, ChevronLeft, ChevronRight, Compass, Croissant, Download, Footprints, GraduationCap, Hammer, Mail, MapPin, Phone, Play, ShoppingBag, Sofa, Sunrise, Trees, Waves, X } from 'lucide-react';
import Logo from '@/components/brand/Logo';
import ResidenceModel from '@/components/building/ResidenceModel';
import BuildingSection from './BuildingSection';
import { Film, Intro, useSolo } from '@/components/films/StylePage';
import { useInView } from '@/components/films/useScroll';
import st from '@/components/films/style.module.css';
import s from './home.module.css';
import LanguageSwitch from '@/components/LanguageSwitch';
import { setPageLangs } from '@/lib/i18n';
import { HomeDataProvider, useHome, type HomeData, type PlanRoom, type Section, type Tx } from './data';

// One apartment's highlights page, set in one film style: the address opens it, then the three films, the plan you can
// explore room by room (photos + a clip of each room), the 3D model, the building, the neighbourhood map with walking
// routes, and who to talk to. Everything comes from one HomeData (components/home/data.ts): Alma Bay builds it from its
// content files, a client order's page loads it from the bucket. Sections still being made show "under construction".

export type Shot = { kind: 'img' | 'video'; src: string; caption: string };

// model-viewer logs "Mesh is missing primitive index association" for the baked GLB (merged primitives; the model
// renders fine). Drop exactly that message so it doesn't surface as an error; everything else passes through.
if (typeof window !== 'undefined' && !(window as unknown as { __meshQuiet?: boolean }).__meshQuiet) {
 (window as unknown as { __meshQuiet?: boolean }).__meshQuiet = true;
 const err = console.error.bind(console);
 console.error = (...a: unknown[]) => { if (typeof a[0] === 'string' && a[0].startsWith('Mesh is missing primitive index association')) return; err(...a); };
}

/* ---------------------------------------------------------------- hero while the films are being made: the home's stills */
// A slow crossfade with a gentle push-in (each still ~6 s); the hero loop video replaces it once the films are ready.
function HeroSlides({ className, slides }: { className: string; slides: string[] }) {
 const [i, setI] = useState(0);
 useEffect(() => {
  if (slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const t = window.setInterval(() => setI(k => (k + 1) % slides.length), 6000);
  return () => window.clearInterval(t);
 }, [slides.length]);
 return <>{slides.map((src, k) => <img key={src} src={src} alt="" aria-hidden className={`${className} ${st.graded} ${s.slide}`}
  data-on={k === i || undefined} fetchPriority={k === 0 ? 'high' : 'low'} loading={k === 0 ? 'eager' : 'lazy'} />)}</>;
}

/* ---------------------------------------------------------------- hero loop: one calm continuous loop (dissolves, no cuts) */
function HeroLoop({ className }: { className: string }) {
 const { d } = useHome();
 // until the films are ready there is no footage of the home: its stills instead (a client page mid-order)
 const slides = d.status.films !== 'ready' || !d.hero.wide ? (d.hero.slides?.length ? d.hero.slides : [d.hero.wideStill, ...d.gallery.map(g => g.src)]).slice(0, 8) : null;
 if (slides) return <HeroSlides className={className} slides={slides} />;
 const [tall, setTall] = useState(false);
 useEffect(() => { const mq = window.matchMedia('(max-aspect-ratio: 4/5)'); const pick = () => setTall(mq.matches); pick(); mq.addEventListener('change', pick); return () => mq.removeEventListener('change', pick); }, []);
 const H = d.hero; const src = tall ? H.tall ?? H.wide : H.wide; const still = (tall ? H.tallStill : undefined) ?? H.wideStill;
 const [ready, setReady] = useState(false);
 return <><img src={still} alt="" className={`${className} ${st.graded}`} aria-hidden fetchPriority="high" />
  {src && <video key={src} className={`${className} ${st.graded}`} src={src} poster={still} autoPlay muted loop playsInline preload="auto" aria-hidden
   style={{ opacity: ready ? 1 : 0, transition: 'opacity .4s' }} onPlaying={() => setReady(true)} />}</>;
}

/* ---------------------------------------------------------------- hero facts: the numbers as a small infographic */
const NEAR_ICON = { beach: Waves, park: Trees, school: GraduationCap, mall: ShoppingBag, bakery: Croissant } as Record<string, typeof Waves>;
function HeroFacts() {
 const { t, d, tx } = useHome();
 const [go, setGo] = useState(false);
 useEffect(() => { const t = setTimeout(() => setGo(true), 1250); return () => clearTimeout(t); }, []);
 const F = d.facts;
 const area = useCount(go ? F.area : 0, String(go), 1100);
 const inside = F.area, out = F.balcony, floor = d.where.floor, floors = d.where.floors;
 const share = inside / (inside + out || 1);
 const N = F.nearest, NI = N ? NEAR_ICON[N.icon] ?? MapPin : null;
 return <aside className={s.facts} data-go={go || undefined} aria-label={t.facts.aria}>
  <div className={s.fArea}>
   <svg viewBox="0 0 120 120" className={s.ring} aria-hidden>
    <circle cx="60" cy="60" r="52" className={s.ringBg} />
    <circle cx="60" cy="60" r="52" className={s.ringIn} pathLength={1} style={{ strokeDasharray: `${go ? share - 0.01 : 0} 1` }} />
    {out > 0 && <circle cx="60" cy="60" r="52" className={s.ringOut} pathLength={1} style={{ strokeDasharray: `${go ? 1 - share - 0.01 : 0} 1`, strokeDashoffset: -share }} />}
   </svg>
   <div><b>{area.toFixed(1)}</b><small>{t.facts.interior}</small><span><i data-k="in" />{inside} {t.facts.inside}{out > 0 && <> <i data-k="out" />{out} {t.facts.balcony}</>}</span></div>
  </div>
  <div className={s.fRow}>
   <div className={s.fRooms}><b>{F.rooms}</b><small>{t.facts.rooms}</small><span aria-hidden>{Array.from({ length: Math.ceil(F.rooms) }, (_, k) => <i key={k} style={{ transitionDelay: `${1.5 + k * 0.08}s` }} />)}</span></div>
   {floor != null && <div className={s.fFloor}><b>{floor}</b><small>{floors ? t.facts.floorOf(floors) : t.facts.floor}</small><span aria-hidden><i style={{ height: go && floors ? `${floor / floors * 100}%` : 0 }} /></span></div>}
   {N && NI && <div className={s.fSea}><b>{N.minutes}</b><small>{tx(N.label)}</small><NI size={18} aria-hidden /></div>}
  </div>
 </aside>;
}

const POINT_ICON = { compass: Compass, chef: ChefHat, sofa: Sofa, waves: Waves, bed: BedDouble, sunrise: Sunrise, trees: Trees, pin: MapPin } as Record<string, typeof Waves>;

/* ---------------------------------------------------------------- under construction: a section that is still being made */
function Soon({ what }: { what: Section }) {
 const { t } = useHome();
 return <div className={s.soon} role="status"><Hammer size={20} strokeWidth={1.6} aria-hidden /><b>{t.soon.title}</b><span>{t.soon[what]}</span></div>;
}

/* ---------------------------------------------------------------- enquiry: the agent + the developer */
function Enquiry() {
 const { d, t, tx } = useHome();
 const ag = d.agent, dev = d.developer;
 return <div className={s.enquiry}>
  {ag && <div className={s.agent}>
   <p className={s.cardKicker}>{t.contact.yours}</p>
   <div className={s.agentId}>
    <span className={s.avatar}>{ag.photo ? <img src={ag.photo} alt={tx(ag.name)} /> : tx(ag.name).split(' ').map(w => w[0]).join('')}</span>
    <div><p className={s.agentName}>{tx(ag.name)}</p>{ag.role && <p className={s.agentRole}>{tx(ag.role)}</p>}</div>
   </div>
   <div className={s.agentLines}>
    {ag.phone && <a href={`tel:${ag.phone.replace(/[^+\d]/g, '')}`}><span><Phone size={16} /></span><small>{t.contact.phone}</small><bdi dir="ltr">{ag.phone}</bdi></a>}
    {ag.email && <a href={`mailto:${ag.email}`}><span><Mail size={16} /></span><small>{t.contact.email}</small><bdi dir="ltr">{ag.email}</bdi></a>}
   </div>
  </div>}
  {dev && <div className={s.devInfo}>
   <p className={s.cardKicker}>{t.contact.developer}</p>
   {dev.logoBlack ? <img className={s.devLogo} src={dev.logoBlack} alt={tx(dev.name)} /> : <p className={s.agentName}>{tx(dev.name)}</p>}
   {dev.about && <p className={s.devAbout}>{tx(dev.about)}</p>}
   {dev.facts.length > 0 && <ul className={s.devFacts}>{dev.facts.map(f => <li key={f.label.en}><b>{f.value}</b><span>{tx(f.label)}</span></li>)}</ul>}
   {dev.url && <Link className={s.devLink} href={dev.url}>{tx(dev.linkLabel) || dev.url.replace(/^https?:\/\//, '')}<ArrowUpRight size={17} /></Link>}
  </div>}
 </div>;
}

/* ---------------------------------------------------------------- lightbox (photos and room clips) */
function Lightbox({ items, at, onClose }: { items: Shot[]; at: number; onClose: () => void }) {
 const { t, rtl } = useHome();
 const [i, setI] = useState(at);
 const go = useCallback((d: number) => setI(k => (k + d + items.length) % items.length), [items.length]);
 useEffect(() => {
  const on = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') go(rtl ? -1 : 1); if (e.key === 'ArrowLeft') go(rtl ? 1 : -1); };
  window.addEventListener('keydown', on); document.body.style.overflow = 'hidden';
  return () => { window.removeEventListener('keydown', on); document.body.style.overflow = ''; };
 }, [go, onClose, rtl]);
 const it = items[i];
 return <div className={s.lb} role="dialog" aria-modal aria-label={it.caption} onClick={onClose}>
  <figure className={s.lbFig} key={it.src} onClick={e => e.stopPropagation()}>
   {it.kind === 'video' ? <video src={it.src} autoPlay muted loop playsInline controls /> : <img src={it.src} alt={it.caption} />}
   <figcaption><span>{it.caption}</span>{items.length > 1 && <span><bdi dir="ltr">{i + 1} / {items.length}</bdi></span>}</figcaption>
  </figure>
  <button type="button" className={s.lbClose} aria-label={t.lb.close} onClick={onClose}><X size={22} /></button>
  {items.length > 1 && <>
   <button type="button" className={s.lbPrev} aria-label={rtl ? t.lb.next : t.lb.prev} onClick={e => { e.stopPropagation(); go(rtl ? 1 : -1); }}><ChevronLeft size={26} /></button>
   <button type="button" className={s.lbNext} aria-label={rtl ? t.lb.prev : t.lb.next} onClick={e => { e.stopPropagation(); go(rtl ? -1 : 1); }}><ChevronRight size={26} /></button>
  </>}
 </div>;
}

/* ---------------------------------------------------------------- the plan, room by room */
const fmt = (n: number | null | undefined, k = 1) => n == null ? '' : n.toFixed(k);
const thumbOf = (src: string) => src.replace(/\.webp$/, '-t.webp');

function useCount(to: number, key: string, ms = 700) {
 const [v, setV] = useState(to);
 useEffect(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(to); return; }
  let raf = 0; const t0 = performance.now();
  const step = (t: number) => { const k = Math.min(1, (t - t0) / ms); setV(to * (1 - Math.pow(1 - k, 3))); if (k < 1) raf = requestAnimationFrame(step); };
  raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
 }, [to, key, ms]);
 return v;
}

function bbox(p: number[][]) {
 const xs = p.map(q => q[0]), ys = p.map(q => q[1]);
 return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

function PlanExplorer({ open }: { open: (items: Shot[], at?: number) => void }) {
 const { d, t, tx, L } = useHome();
 const P = d.plan, R = d.rooms;
 const rooms = useMemo(() => {
  const order = d.roomOrder.length ? d.roomOrder : P.rooms.map(r => r.id);
  return order.map(id => P.rooms.find(r => r.id === id)).filter(Boolean).map(r => ({ ...r!, name: R[r!.id]?.name ? tx(R[r!.id].name) : r!.name })) as PlanRoom[];
 }, [P.rooms, L, d.roomOrder]); // eslint-disable-line react-hooks/exhaustive-deps
 const [cur, setCur] = useState<string | null>(null);
 const [pinned, setPinned] = useState<string | null>(null);
 const [seeing, setSeeing] = useState<string | null>(null);   // the room of the photo under the pointer (strip)
 const id = cur ?? pinned;
 const room = rooms.find(r => r.id === id);
 const lit = rooms.find(r => r.id === (id ?? seeing));             // what the plan lights up
 const info = room ? R[room.id] : undefined;
 const area = useCount(room?.area ?? P.headline.area_m2, id ?? 'all');
 const [vx, vy, vw, vh] = P.view;
 const k = vw / 1000;                                      // stroke/text scale: 1 unit at a 1000-wide view
 const dp = (r: PlanRoom) => 'M' + r.poly.map(q => q.join(',')).join('L') + 'Z';
 const b = lit ? bbox(lit.poly) : null;
 const strip = useRef<HTMLDivElement>(null);
 const slide = (dir: number) => strip.current?.scrollBy({ left: dir * strip.current.clientWidth * 0.8, behavior: 'smooth' });
 const shots = (r: PlanRoom): Shot[] => { const i = R[r.id]; return [
  ...(i?.clip ? [{ kind: 'video' as const, src: i.clip, caption: t.plan.fromFilm(r.name) }] : []),
  ...(i?.images ?? []).map(src => ({ kind: 'img' as const, src, caption: r.name })),
 ]; };
 const no = room ? rooms.indexOf(room) + 1 : 0;
 const G = d.gallery;

 return <div className={s.planWrap} onMouseLeave={() => setCur(null)}>
  <div className={s.planStage}>
   <svg className={s.planSvg} viewBox={P.view.join(' ')} role="img" aria-label={t.plan.aria}>
    <defs>
     <mask id="plan-spot" maskUnits="userSpaceOnUse" x={vx} y={vy} width={vw} height={vh}>
      <rect x={vx} y={vy} width={vw} height={vh} fill="#fff" />
      {lit && <path d={dp(lit)} fill="#000" />}
     </mask>
     {/* the apartment only, as an ink silhouette: dims everything but the room in view */}
     <filter id="plan-ink" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0.11  0 0 0 0 0.1  0 0 0 0 0.09  0 0 0 1 0" /></filter>
    </defs>
    {/* the cut-out of the apartment (transparent around it), so no photo background shows on any page colour */}
    <image href={P.cutout.image} x={P.cutout.x} y={P.cutout.y} width={P.cutout.w} height={P.cutout.h} preserveAspectRatio="none" className={s.planPhoto} />
    <image href={P.cutout.image} x={P.cutout.x} y={P.cutout.y} width={P.cutout.w} height={P.cutout.h} preserveAspectRatio="none" filter="url(#plan-ink)"
     className={s.planDim} data-on={lit ? '' : undefined} mask="url(#plan-spot)" />
    {rooms.map(r => <path key={r.id} d={dp(r)} className={s.room} data-on={r.id === lit?.id || undefined} style={{ strokeWidth: 3 * k }}
     tabIndex={0} role="button" aria-label={`${r.name}, ${fmt(r.area)} m²`} aria-pressed={pinned === r.id}
     onMouseEnter={() => setCur(r.id)} onFocus={() => setCur(r.id)} onBlur={() => setCur(null)}
     onClick={() => setPinned(p => p === r.id && !cur ? null : r.id)}
     onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const sh = shots(r); if (sh.length) open(sh); } }} />)}
    {lit && b && <g key={lit.id} className={s.dims} direction="ltr" style={{ strokeWidth: 2 * k, fontSize: 24 * k }}>
     {lit.w != null && <g className={s.dimLine}>
      <path pathLength={1} d={`M${b[0]},${b[1] - 18 * k}H${b[2]}M${b[0]},${b[1] - 28 * k}v20M${b[2]},${b[1] - 28 * k}v20`} />
      <text x={(b[0] + b[2]) / 2} y={b[1] - 30 * k} textAnchor="middle">{fmt(lit.w, 2)} m</text>
     </g>}
     {lit.d != null && <g className={s.dimLine}>
      <path pathLength={1} d={`M${b[2] + 18 * k},${b[1]}V${b[3]}M${b[2] + 8 * k},${b[1]}h20M${b[2] + 8 * k},${b[3]}h20`} />
      <text x={b[2] + 34 * k} y={(b[1] + b[3]) / 2} transform={`rotate(90 ${b[2] + 34 * k} ${(b[1] + b[3]) / 2})`} textAnchor="middle">{fmt(lit.d, 2)} m</text>
     </g>}
     <g className={s.tag} transform={`translate(${lit.c[0]} ${lit.c[1]})`}>
      <circle r={40 * k} /><text dy={7 * k} textAnchor="middle" style={{ fontSize: 22 * k }}>{fmt(lit.area)}</text>
     </g>
    </g>}
   </svg>
   <span className={s.north} aria-label={t.plan.north}><b>N</b><i /></span>
   <p className={s.planHint}>{room ? t.plan.hintOn : t.plan.hintOff}</p>
  </div>

  <aside className={s.panel} aria-live="polite">
   <div className={s.panelInner} key={id ?? 'all'}>
    <p className={s.panelNo}>{room ? <bdi dir="ltr">{`${String(no).padStart(2, '0')} / ${String(rooms.length).padStart(2, '0')}`}</bdi> : t.plan.whole}</p>
    <h3 className={s.panelName}><span>{room ? room.name : tx(d.unit)}</span></h3>
    <p className={s.panelArea}><b>{area.toFixed(1)}</b><small>m²</small>
     {room?.w != null && room.d != null && <span><bdi dir="ltr">{fmt(room.w, 2)} × {fmt(room.d, 2)} m</bdi></span>}
     {!room && <span>{t.plan.wholeSpec(String(d.facts.rooms), String(d.facts.balcony), tx(d.copy.aspect))}</span>}</p>
    <p className={s.panelLine}>{room ? tx(info?.line) : tx(d.copy.wholeLine)}</p>
    {room && (() => { const sh = shots(room); return sh.length > 0 && <div className={s.panelMedia}>
     {sh.map((m, j) => <button key={m.src} type="button" className={s.thumb} data-video={m.kind === 'video' || undefined} onClick={() => open(sh, j)}
      aria-label={m.kind === 'video' ? t.plan.watchAria(room.name) : t.plan.photoAria(room.name)} style={{ animationDelay: `${0.18 + j * 0.06}s` }}>
      <img src={m.kind === 'video' ? m.src.replace(/\.mp4$/, '.jpg') : thumbOf(m.src)} alt="" />
      {m.kind === 'video' && <span><Play size={14} fill="currentColor" />{t.plan.watch}</span>}
     </button>)}
    </div>; })()}
    {room && !shots(room).length && <p className={s.panelNone}>{t.plan.none}</p>}
   </div>
   <ul className={s.roomList}><li><button type="button" data-on={!id || undefined} onMouseEnter={() => setCur(null)}
    onClick={() => { setPinned(null); setCur(null); }}>{t.plan.all}<small>{fmt(P.headline.area_m2)}</small></button></li>{rooms.map(r => <li key={r.id}>
    <button type="button" data-on={r.id === id || undefined} onMouseEnter={() => setCur(r.id)} onFocus={() => setCur(r.id)} onBlur={() => setCur(null)}
     onClick={() => setPinned(p => p === r.id ? null : r.id)}>{r.name}<small>{fmt(r.area)}</small></button></li>)}</ul>
   {!room && G.length > 0 && <div className={s.stripWrap}>
    <div className={s.stripHead}><span>{t.plan.photos} · {G.length}</span>
     <span><button type="button" aria-label={t.plan.back} onClick={() => slide(-1)}><ChevronLeft size={16} /></button><button type="button" aria-label={t.plan.on} onClick={() => slide(1)}><ChevronRight size={16} /></button></span></div>
    <div className={s.strip} ref={strip} onMouseLeave={() => setSeeing(null)}>{G.map((g, j) => <button key={g.src} type="button" className={s.sItem}
     onMouseEnter={() => setSeeing(g.room ?? null)} onFocus={() => setSeeing(g.room ?? null)} onBlur={() => setSeeing(null)}
     onClick={() => open(G.map(q => ({ kind: 'img' as const, src: q.src, caption: tx(q.caption) })), j)} aria-label={t.plan.openAria(tx(g.caption))}>
     <img src={g.thumb} alt="" loading="lazy" /><span>{tx(g.caption)}</span></button>)}</div>
   </div>}
  </aside>
 </div>;
}

/* ---------------------------------------------------------------- the neighbourhood */
const ICON = NEAR_ICON;

function AreaMap() {
 const { d, t, tx, L } = useHome();
 const M = d.map!;
 const [vx, vy, vw, vh] = M.view;
 const pct = (p: number[]) => ({ left: `${(p[0] - vx) / vw * 100}%`, top: `${(p[1] - vy) / vh * 100}%` });
 const places = useMemo(() => [...M.items].map(p => ({ ...p, name: tx(p.name), label: tx(p.label) })).sort((a, b) => (a.walk_min ?? 99) - (b.walk_min ?? 99)), [L, M]); // eslint-disable-line react-hooks/exhaustive-deps
 const [act, setAct] = useState<string>(places.find(p => p.kind === 'beach')?.id ?? places[0]?.id ?? '');
 const k = vw / 1000;
 const cur = places.find(p => p.id === act);
 return <div className={s.area}>
  <div className={s.map}>
   <img src={M.image} alt="" className={s.mapImg} />
   <svg className={s.mapSvg} viewBox={M.view.join(' ')} preserveAspectRatio="xMidYMid slice" aria-hidden>
    {places.map(p => p.route && <path key={p.id} d={p.route} className={s.route} style={{ strokeWidth: 3 * k }} />)}
    {cur?.route && <path key={`on-${cur.id}`} d={cur.route} pathLength={1} className={s.routeOn} style={{ strokeWidth: 7 * k }} />}
   </svg>
   <span className={s.homePin} style={pct(M.home)}><i /><b>{tx(d.project)}</b></span>
   {places.map(p => { const I = ICON[p.kind] ?? MapPin; return <button key={p.id} type="button" className={s.pin} style={pct(p.xy)} data-on={p.id === act || undefined}
    onMouseEnter={() => setAct(p.id)} onFocus={() => setAct(p.id)} onClick={() => setAct(p.id)} aria-label={t.map.walkAria(p.name, p.walk_min)}>
    <I size={17} strokeWidth={1.8} aria-hidden /><span className={s.pinChip}><b>{p.walk_min} {t.map.min}</b>{p.name}</span>
   </button>; })}
   <span className={s.mapNorth} aria-hidden>N<i /></span>
  </div>
  <div className={s.places}>
   <ol>{places.map(p => { const I = ICON[p.kind] ?? MapPin; return <li key={p.id}>
    <button type="button" data-on={p.id === act || undefined} onMouseEnter={() => setAct(p.id)} onFocus={() => setAct(p.id)} onClick={() => setAct(p.id)}>
     <span className={s.placeIcon}><I size={18} strokeWidth={1.7} aria-hidden /></span>
     <span className={s.placeName}>{p.name}<small>{p.label}</small></span>
     <span className={s.placeWalk}><b>{p.walk_min}</b> {t.map.min}<small>{p.walk_m != null ? t.map.km((p.walk_m / 1000).toFixed(2)) : ''}</small></span>
    </button></li>; })}</ol>
   <p className={s.note}><Footprints size={14} aria-hidden /> {t.map.note}</p>
  </div>
 </div>;
}

/* ---------------------------------------------------------------- the 3D model, mounted when it comes near the screen */
function ModelBlock() {
 const { d, t } = useHome();
 const ref = useRef<HTMLDivElement>(null);
 const near = useInView(ref, '600px');
 const [on, setOn] = useState(false);
 useEffect(() => { if (near) setOn(true); }, [near]);
 const m = d.model!;
 return <div className={s.model} ref={ref} style={on ? undefined : { backgroundImage: `url(${JSON.stringify(m.poster)})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
  {on && <ResidenceModel src={m.glb} poster={m.poster} defaultOrbit={m.orbit} outdoorOrbit={m.outdoorOrbit} stage="paper" />}
  {m.walk && <a className={s.walk} href={m.walk} target="_blank" rel="noreferrer"><Footprints size={15} aria-hidden />{t.model.walk}<small>{t.model.early}</small></a>}
 </div>;
}

/* ---------------------------------------------------------------- page */
const pair = (tx: (x: Tx) => string, p: [Tx, Tx] | undefined, fallback: string[]) => p ? [tx(p[0]), tx(p[1])] : fallback;

function Page() {
 useSolo();
 const { d, t, tx, L, byLang } = useHome();
 const show = (k: Section) => d.status[k] !== 'hidden';
 const ready = (k: Section) => d.status[k] === 'ready';
 // the section's content when ready, the under-construction card while it is being made
 const body = (k: Section, el: () => React.ReactNode) => ready(k) ? el() : <Soon what={k} />;
 // section markers in the style's own vernacular (folio, sheet number, sticker); numbered over the shown sections
 const order = (['films', 'plan', 'model', 'building', 'area', 'contact'] as const).filter(k => show(k) && (k !== 'model' || d.model || !ready(k)) && (k !== 'area' || d.map || !ready(k))
  && (k !== 'building' || d.building || !ready(k)) && (k !== 'contact' || !!(d.agent || d.developer)));
 const mark = (k: typeof order[number]) => { const n = order.indexOf(k) + 1, w = t.marks[k];
  return d.style === 'monograph' ? `A-10${n} · ${w}` : d.style === 'sunday-house' ? `0${n} · ${w}` : `Nº 0${n} — ${w}`; };
 const kit = byLang(d.kit);
 const films = byLang(d.films);
 const A = d.address, street = tx(A.street), city = tx(A.city);
 const title = A.no ? (L === 'he' ? `${street} ${A.no}` : `${A.no} ${street}`) : street;   // Hebrew writes the number after the street
 const w = tx(A.word) || street;
 const word = A.no ? (L === 'he' ? `${w} ${A.no}` : `${A.no} ${w}`.toUpperCase()) : (L === 'he' ? w : w.toUpperCase());
 const [scrolled, setScrolled] = useState(false);
 const [opening, setOpening] = useState(true);
 const done = useCallback(() => setOpening(false), []);
 const [lb, setLb] = useState<{ items: Shot[]; at: number } | null>(null);
 const [allFilms, setAllFilms] = useState(false);   // the three cuts stay folded: the page leads with one film
 const open = useCallback((items: Shot[], at = 0) => setLb({ items, at }), []);
 useEffect(() => { const on = () => setScrolled(window.scrollY > 40); on(); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on); }, []);
 const nav = order.map(k => [k, t.nav[k]] as const);
 const cut = (c: { src: string; poster: string; length: string; aspect: string }, k: 'long' | 'short' | 'phone') => ({ ...c, id: k, label: t.cuts[k], aspect: c.aspect as '16:9' | '9:16' });
 const dev = d.developer;
 const kitReady = ready('kit') && !!kit;
 const [bh0, bh1] = pair(tx, d.copy.buildingHead, t.h2.building);

 return <main className={`${st.page} ${s.home}`} data-style={d.style} data-opening={opening || undefined}>
  {opening && <Intro word={word} under={`${street} · ${city}`} id={`home-${d.slug}-${L}`} onDone={done} />}
  <nav className={st.bar} data-solid={scrolled || undefined}>
   <Link href="/" className={st.logo} aria-label="residence.tech"><Logo /></Link>
   <ul className={st.tabs}>{nav.map(([h, w]) => <li key={h}><a href={`#${h}`}>{w}</a></li>)}</ul>
   {d.langs.length > 1 && <LanguageSwitch id="home-lang" compact tone={scrolled ? 'light' : 'glass'} className={s.lang} langs={d.langs} />}
   {kitReady && <a href={kit!.href} download className={s.dl} aria-label={t.downloadAria(kit!.size)}><Download size={15} aria-hidden /><span>{t.download}</span></a>}
   {order.includes('contact') && <a href="#contact" className={s.cta}><Phone size={15} aria-hidden />{t.enquire}<ArrowUpRight size={15} aria-hidden /></a>}
  </nav>

  <header className={st.hero}>
   <HeroLoop className={st.heroVideo} />
   <div className={st.heroShade} />
   <div className={`${st.heroText} ${s.heroText}`}>
    <p className={st.kicker}><span>{tx(d.unit)}</span>{d.where.floor != null && (d.where.tower ? t.tower(d.where.tower, d.where.floor) : t.floorN(d.where.floor))}</p>
    <h1 className={st.h1}>{title}</h1>
    <p className={st.tagline}>{city}, {tx(A.country)}</p>
    {dev?.logoWhite && <div className={s.dev}>
     <small>{t.developedBy}</small>
     {dev.url ? <Link href={dev.url}><img src={dev.logoWhite} alt={tx(dev.name)} /></Link> : <img src={dev.logoWhite} alt={tx(dev.name)} />}
    </div>}
   </div>
   <HeroFacts />
   {d.status.films !== 'ready' && d.status.films !== 'hidden' && <a href="#films" className={s.heroSoon}><Clapperboard size={16} aria-hidden />{t.soon.heroFilm}</a>}
   <a href={`#${order[0] ?? 'contact'}`} className={`${st.cue} ${s.cue}`}><ArrowDown size={16} aria-hidden />{t.scroll}</a>
  </header>

  {d.points.length > 0 && <section className={s.points}>
   <h2 className={s.pointsHead}>{tx(d.copy.pointsHead[0])}<em>{tx(d.copy.pointsHead[1])}</em></h2>
   <ul>{d.points.map((pt, j) => { const I = POINT_ICON[pt.icon] ?? Compass; return <li key={pt.title.en} style={{ ['--i' as string]: j }}>
    <span className={s.pIcon}><I size={22} strokeWidth={1.5} aria-hidden /></span><b>{tx(pt.title)}</b><span>{tx(pt.text)}</span></li>; })}</ul>
  </section>}

  {show('films') && <section className={st.section} id="films">
   <p className={st.mark}>{mark('films')}</p>
   {body('films', () => films && <>
    {/* one film, no frame: the short cut on a wide screen, the phone cut on a phone (CSS picks; preload none, so only the
        one a viewer plays loads) */}
    <video className={`${s.featured} ${s.featWide}`} src={films.short.src} poster={films.short.poster} controls playsInline preload="none"
     aria-label={`${tx(d.unit)} — ${t.cuts.short}, ${films.short.length}`} />
    <video className={`${s.featured} ${s.featTall}`} src={films.phone.src} poster={films.phone.poster} controls playsInline preload="none"
     aria-label={`${tx(d.unit)} — ${t.cuts.phone}, ${films.phone.length}`} />
    <button type="button" className={s.allFilms} aria-expanded={allFilms} aria-controls="all-films" onClick={() => setAllFilms(v => !v)}>
     {allFilms ? t.allFilms.close : t.allFilms.open}<ChevronDown size={18} aria-hidden className={s.allChev} data-open={allFilms || undefined} />
    </button>
    <div id="all-films" className={s.allFilmsBody} hidden={!allFilms}>
     {allFilms && <>
      <Film cut={cut(films.long, 'long')} name={tx(d.unit)} big />
      <div className={`${st.pair} ${s.pairGap}`}><Film cut={cut(films.short, 'short')} name={tx(d.unit)} /><Film cut={cut(films.phone, 'phone')} name={tx(d.unit)} /></div>
     </>}
    </div>
   </>)}
  </section>}

  {show('plan') && <section className={st.section} id="plan">
   <p className={st.mark}>{mark('plan')}</p>
   <h2 className={s.h2}>{t.h2.plan[0]}<em>{t.h2.plan[1]}</em></h2>
   {body('plan', () => <PlanExplorer open={open} />)}
  </section>}

  {order.includes('model') && <section className={st.section} id="model">
   <p className={st.mark}>{mark('model')}</p>
   <div className={s.modelHead}>
    <h2 className={s.h2}>{t.h2.model[0]}<em>{t.h2.model[1]}</em></h2>
    {ready('model') && <p className={s.sub}>{t.sub.model}</p>}
   </div>
   {body('model', () => <ModelBlock />)}
  </section>}

  {order.includes('building') && <section className={st.section} id="building">
   <p className={st.mark}>{mark('building')}</p>
   <div className={s.modelHead}>
    <h2 className={s.h2}>{bh0}<em>{bh1}</em></h2>
    {ready('building') && <p className={s.sub}>{tx(d.copy.buildingSub) || (d.building?.orbit ? t.sub.buildingOrbit : t.sub.building)}</p>}
   </div>
   {body('building', () => <BuildingSection open={open} />)}
  </section>}

  {order.includes('area') && <section className={st.section} id="area">
   <p className={st.mark}>{mark('area')}</p>
   <h2 className={s.h2}>{t.h2.area[0]}<em>{t.h2.area[1]}</em></h2>
   {body('area', () => <AreaMap />)}
  </section>}

  {order.includes('contact') && <section className={st.section} id="contact">
   <p className={st.mark}>{mark('contact')}</p>
   <Enquiry />
  </section>}

  {show('kit') && <section className={st.section} id="download">
   <div className={s.kit}>
    <div><p className={s.cardKicker}>{t.kit.kicker}</p><h2 className={s.kitTitle}>{t.kit.title[0]}<em>{t.kit.title[1]}</em></h2>
     {kitReady ? <ul className={s.kitParts}>{kit!.parts.map(q => <li key={q.label.en}><b>{q.n}</b>{tx(q.label)}</li>)}</ul> : <p className={s.sub}>{t.soon.kit}</p>}</div>
    {kitReady && <a href={kit!.href} download className={s.kitBtn}><Download size={20} aria-hidden /><span>{t.kit.btn}<small>{t.kit.meta(kit!.size, kit!.files)}</small></span></a>}
   </div>
  </section>}

  <footer className={st.foot}>
   <Logo />
   <p>{t.foot(tx(d.project), tx(d.unit))}</p>
   {d.allLink && <Link href={d.allLink.href}>{tx(d.allLink.label)}</Link>}
  </footer>
  {lb && <Lightbox items={lb.items} at={lb.at} onClose={() => setLb(null)} />}
 </main>;
}

/** The page for one HomeData. Client pages name their languages in the data; the switch offers exactly those. */
export default function HomePage({ data }: { data: HomeData }) {
 useState(() => { setPageLangs(data.langs); return null; });
 useEffect(() => { setPageLangs(data.langs); return () => setPageLangs(null); }, [data.langs]);
 return <HomeDataProvider data={data}><Page /></HomeDataProvider>;
}
