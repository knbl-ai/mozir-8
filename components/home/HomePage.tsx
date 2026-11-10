'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, BedDouble, ChefHat, ChevronLeft, ChevronRight, Compass, Croissant, Download, Footprints, GraduationCap, Mail, MapPin, Phone, Play, ShoppingBag, Sofa, Sunrise, Trees, Waves, X } from 'lucide-react';
import Logo from '@/components/brand/Logo';
import ResidenceModel from '@/components/building/ResidenceModel';
import BuildingSection from './BuildingSection';
import { Film, Intro, useSolo } from '@/components/films/StylePage';
import { filmStyle } from '@/content/projects/alma-bay-films';
import { HE_FILMS, HOME, ROOMS, type Place, type PlanRoom } from '@/content/projects/alma-bay-home';
import { useInView } from '@/components/films/useScroll';
import st from '@/components/films/style.module.css';
import s from './home.module.css';
import LanguageSwitch from '@/components/LanguageSwitch';
import { useHome } from './strings';

// One apartment's highlights page, set in one film style: the address opens it, then the three films, the plan you can
// explore room by room (photos + a clip of each room), the 3D model, the gallery, the neighbourhood map with walking
// routes, and who to talk to. Data: content/projects/alma-bay-home.ts (pipeline/highlights/sitepack.py).

type Shot = { kind: 'img' | 'video'; src: string; caption: string };

// model-viewer logs "Mesh is missing primitive index association" for the baked GLB (merged primitives; the model
// renders fine). Drop exactly that message so it doesn't surface as an error; everything else passes through.
if (typeof window !== 'undefined' && !(window as unknown as { __meshQuiet?: boolean }).__meshQuiet) {
 (window as unknown as { __meshQuiet?: boolean }).__meshQuiet = true;
 const err = console.error.bind(console);
 console.error = (...a: unknown[]) => { if (typeof a[0] === 'string' && a[0].startsWith('Mesh is missing primitive index association')) return; err(...a); };
}

/* ---------------------------------------------------------------- hero loop: one calm continuous loop (dissolves, no cuts) */
function HeroLoop({ className }: { className: string }) {
 const [tall, setTall] = useState(false);
 useEffect(() => { const mq = window.matchMedia('(max-aspect-ratio: 4/5)'); const pick = () => setTall(mq.matches); pick(); mq.addEventListener('change', pick); return () => mq.removeEventListener('change', pick); }, []);
 const H = HOME.hero; const src = tall ? H.tall : H.wide; const still = tall ? H.tallStill : H.wideStill;
 const [ready, setReady] = useState(false);
 return <><img src={still} alt="" className={`${className} ${st.graded}`} aria-hidden fetchPriority="high" />
  <video key={src} className={`${className} ${st.graded}`} src={src} poster={still} autoPlay muted loop playsInline preload="auto" aria-hidden
   style={{ opacity: ready ? 1 : 0, transition: 'opacity .4s' }} onPlaying={() => setReady(true)} /></>;
}

/* ---------------------------------------------------------------- hero facts: the numbers as a small infographic */
function HeroFacts() {
 const { t } = useHome();
 const [go, setGo] = useState(false);
 useEffect(() => { const t = setTimeout(() => setGo(true), 1250); return () => clearTimeout(t); }, []);
 const area = useCount(go ? HOME.plan.headline.area_m2 : 0, String(go), 1100);
 const inside = HOME.plan.headline.area_m2, out = HOME.plan.headline.balcony_m2, floor = HOME.unit.floor, floors = HOME.tower.floors;
 const share = inside / (inside + out);
 return <aside className={s.facts} data-go={go || undefined} aria-label={t.facts.aria}>
  <div className={s.fArea}>
   <svg viewBox="0 0 120 120" className={s.ring} aria-hidden>
    <circle cx="60" cy="60" r="52" className={s.ringBg} />
    <circle cx="60" cy="60" r="52" className={s.ringIn} pathLength={1} style={{ strokeDasharray: `${go ? share - 0.01 : 0} 1` }} />
    <circle cx="60" cy="60" r="52" className={s.ringOut} pathLength={1} style={{ strokeDasharray: `${go ? 1 - share - 0.01 : 0} 1`, strokeDashoffset: -share }} />
   </svg>
   <div><b>{area.toFixed(1)}</b><small>{t.facts.interior}</small><span><i data-k="in" />{inside} {t.facts.inside} <i data-k="out" />{out} {t.facts.balcony}</span></div>
  </div>
  <div className={s.fRow}>
   <div className={s.fRooms}><b>{HOME.stats[1].value}</b><small>{t.facts.rooms}</small><span aria-hidden>{Array.from({ length: Number(HOME.stats[1].value) }, (_, k) => <i key={k} style={{ transitionDelay: `${1.5 + k * 0.08}s` }} />)}</span></div>
   <div className={s.fFloor}><b>{floor}</b><small>{t.facts.floorOf(floors)}</small><span aria-hidden><i style={{ height: go ? `${floor / floors * 100}%` : 0 }} /></span></div>
   <div className={s.fSea}><b>13</b><small>{t.facts.beach}</small><Waves size={18} aria-hidden /></div>
  </div>
 </aside>;
}

const POINT_ICON = { compass: Compass, chef: ChefHat, sofa: Sofa, waves: Waves, bed: BedDouble, sunrise: Sunrise } as Record<string, typeof Waves>;

/* ---------------------------------------------------------------- enquiry: the agent + a contact form (not wired yet) */
function Enquiry() {
 const ag = HOME.agent; const { t, x } = useHome();
 return <div className={s.enquiry}>
  <div className={s.agent}>
   <p className={s.cardKicker}>{t.contact.yours}</p>
   <div className={s.agentId}>
    <span className={s.avatar}>{ag.photo ? <img src={ag.photo} alt={x.agentName} /> : ag.name?.split(' ').map(w => w[0]).join('')}</span>
    <div><p className={s.agentName}>{x.agentName}</p><p className={s.agentRole}>{x.agentRole}</p></div>
   </div>
   <div className={s.agentLines}>
    {ag.phone && <a href={`tel:${ag.phone.replace(/[^+\d]/g, '')}`}><span><Phone size={16} /></span><small>{t.contact.phone}</small><bdi dir="ltr">{ag.phone}</bdi></a>}
    {ag.email && <a href={`mailto:${ag.email}`}><span><Mail size={16} /></span><small>{t.contact.email}</small><bdi dir="ltr">{ag.email}</bdi></a>}
   </div>
  </div>
  <div className={s.devInfo}>
   <p className={s.cardKicker}>{t.contact.developer}</p>
   <img className={s.devLogo} src={HOME.developer.logoBlack} alt={x.devName} />
   <p className={s.devAbout}>{x.devAbout}</p>
   <ul className={s.devFacts}>{HOME.developer.facts.map(f => <li key={f.label}><b>{f.value}</b><span>{x.figure(f.label)}</span></li>)}</ul>
   {HOME.developer.url && <Link className={s.devLink} href={HOME.developer.url}>{x.devLink}<ArrowUpRight size={17} /></Link>}
  </div>
 </div>;
}

/* ---------------------------------------------------------------- lightbox (photos and room clips) */
function Lightbox({ items, at, onClose }: { items: Shot[]; at: number; onClose: () => void }) {
 const { t, L } = useHome(); const rtl = L === 'he';
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
const ORDER = ['living', 'balcony', 'master', 'ensuite', 'bed2', 'bed3', 'safe', 'bath', 'wc', 'corridor', 'laundry'];
const fmt = (n: number | null | undefined, d = 1) => n == null ? '' : n.toFixed(d);

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
 const P = HOME.plan; const { t, x, L } = useHome();
 const rooms = useMemo(() => ORDER.map(id => P.rooms.find(r => r.id === id)).filter(Boolean).map(r => ({ ...r!, name: x.room(r!.id, r!.name) })) as PlanRoom[], [P.rooms, L]); // eslint-disable-line react-hooks/exhaustive-deps
 const [cur, setCur] = useState<string | null>(null);
 const [pinned, setPinned] = useState<string | null>(null);
 const [seeing, setSeeing] = useState<string | null>(null);   // the room of the photo under the pointer (strip)
 const id = cur ?? pinned;
 const room = rooms.find(r => r.id === id);
 const lit = rooms.find(r => r.id === (id ?? seeing));             // what the plan lights up
 const info = room ? ROOMS[room.id] : undefined;
 const area = useCount(room?.area ?? HOME.plan.headline.area_m2, id ?? 'all');
 const [vx, vy, vw, vh] = P.view;
 const k = vw / 1000;                                      // stroke/text scale: 1 unit at a 1000-wide view
 const d = (r: PlanRoom) => 'M' + r.poly.map(q => q.join(',')).join('L') + 'Z';
 const b = lit ? bbox(lit.poly) : null;
 const strip = useRef<HTMLDivElement>(null);
 const slide = (dir: number) => strip.current?.scrollBy({ left: dir * strip.current.clientWidth * 0.8, behavior: 'smooth' });
 const shots = (r: PlanRoom): Shot[] => { const i = ROOMS[r.id]; return [
  ...(i?.clip ? [{ kind: 'video' as const, src: i.clip, caption: t.plan.fromFilm(r.name) }] : []),
  ...(i?.images ?? []).map(src => ({ kind: 'img' as const, src, caption: r.name })),
 ]; };
 const no = room ? rooms.indexOf(room) + 1 : 0;

 return <div className={s.planWrap} onMouseLeave={() => setCur(null)}>
  <div className={s.planStage}>
   <svg className={s.planSvg} viewBox={P.view.join(' ')} role="img" aria-label={t.plan.aria}>
    <defs>
     <mask id="plan-spot" maskUnits="userSpaceOnUse" x={vx} y={vy} width={vw} height={vh}>
      <rect x={vx} y={vy} width={vw} height={vh} fill="#fff" />
      {lit && <path d={d(lit)} fill="#000" />}
     </mask>
     {/* the apartment only, as an ink silhouette: dims everything but the room in view */}
     <filter id="plan-ink" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0.11  0 0 0 0 0.1  0 0 0 0 0.09  0 0 0 1 0" /></filter>
    </defs>
    {/* the cut-out of the apartment (transparent around it), so no photo background shows on any page colour */}
    <image href={P.cutout.image} x={P.cutout.x} y={P.cutout.y} width={P.cutout.w} height={P.cutout.h} preserveAspectRatio="none" className={s.planPhoto} />
    <image href={P.cutout.image} x={P.cutout.x} y={P.cutout.y} width={P.cutout.w} height={P.cutout.h} preserveAspectRatio="none" filter="url(#plan-ink)"
     className={s.planDim} data-on={lit ? '' : undefined} mask="url(#plan-spot)" />
    {rooms.map(r => <path key={r.id} d={d(r)} className={s.room} data-on={r.id === lit?.id || undefined} style={{ strokeWidth: 3 * k }}
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
    <h3 className={s.panelName}><span>{room ? room.name : x.unit}</span></h3>
    <p className={s.panelArea}><b>{area.toFixed(1)}</b><small>m²</small>
     {room?.w != null && room.d != null && <span><bdi dir="ltr">{fmt(room.w, 2)} × {fmt(room.d, 2)} m</bdi></span>}
     {!room && <span>{t.plan.wholeSpec(HOME.stats[1].value, HOME.stats[2].value, x.aspect)}</span>}</p>
    <p className={s.panelLine}>{room ? x.line(room.id, info?.line ?? '') : t.plan.wholeLine}</p>
    {room && (() => { const sh = shots(room); return sh.length > 0 && <div className={s.panelMedia}>
     {sh.map((m, j) => <button key={m.src} type="button" className={s.thumb} data-video={m.kind === 'video' || undefined} onClick={() => open(sh, j)}
      aria-label={m.kind === 'video' ? t.plan.watchAria(room.name) : t.plan.photoAria(room.name)} style={{ animationDelay: `${0.18 + j * 0.06}s` }}>
      <img src={m.kind === 'video' ? m.src.replace(/\.mp4$/, '.jpg') : m.src.replace(/\.webp$/, '-t.webp')} alt="" />
      {m.kind === 'video' && <span><Play size={14} fill="currentColor" />{t.plan.watch}</span>}
     </button>)}
    </div>; })()}
    {room && !shots(room).length && <p className={s.panelNone}>{t.plan.none}</p>}
   </div>
   <ul className={s.roomList}><li><button type="button" data-on={!id || undefined} onMouseEnter={() => setCur(null)}
    onClick={() => { setPinned(null); setCur(null); }}>{t.plan.all}<small>{fmt(HOME.plan.headline.area_m2)}</small></button></li>{rooms.map(r => <li key={r.id}>
    <button type="button" data-on={r.id === id || undefined} onMouseEnter={() => setCur(r.id)} onFocus={() => setCur(r.id)} onBlur={() => setCur(null)}
     onClick={() => setPinned(p => p === r.id ? null : r.id)}>{r.name}<small>{fmt(r.area)}</small></button></li>)}</ul>
   {!room && <div className={s.stripWrap}>
    <div className={s.stripHead}><span>{t.plan.photos} · {HOME.gallery.length}</span>
     <span><button type="button" aria-label={t.plan.back} onClick={() => slide(-1)}><ChevronLeft size={16} /></button><button type="button" aria-label={t.plan.on} onClick={() => slide(1)}><ChevronRight size={16} /></button></span></div>
    <div className={s.strip} ref={strip} onMouseLeave={() => setSeeing(null)}>{HOME.gallery.map((g, j) => <button key={g.src} type="button" className={s.sItem}
     onMouseEnter={() => setSeeing(g.room ?? null)} onFocus={() => setSeeing(g.room ?? null)} onBlur={() => setSeeing(null)}
     onClick={() => open(HOME.gallery.map((q, n) => ({ kind: 'img' as const, src: q.src, caption: x.gallery(n, q.caption) })), j)} aria-label={t.plan.openAria(x.gallery(j, g.caption))}>
     <img src={g.thumb} alt="" loading="lazy" /><span>{x.gallery(j, g.caption)}</span></button>)}</div>
   </div>}
  </aside>
 </div>;
}

/* ---------------------------------------------------------------- the neighbourhood */
const ICON = { beach: Waves, park: Trees, school: GraduationCap, mall: ShoppingBag, bakery: Croissant } as Record<string, typeof Waves>;

function AreaMap({ image }: { image: string }) {
 const { t, x, L } = useHome();
 const M = { ...HOME.map, image, items: HOME.map.items.map(p => { const [name, label] = x.place(p.id, [p.name, p.label]); return { ...p, name, label }; }) };
 const [vx, vy, vw, vh] = M.view;
 const pct = (p: number[]) => ({ left: `${(p[0] - vx) / vw * 100}%`, top: `${(p[1] - vy) / vh * 100}%` });
 const places = useMemo(() => [...M.items].sort((a, b) => (a.walk_min ?? 99) - (b.walk_min ?? 99)), [L, image]); // eslint-disable-line react-hooks/exhaustive-deps
 const [act, setAct] = useState<string>(places.find(p => p.kind === 'beach')?.id ?? places[0].id);
 const k = vw / 1000;
 const cur = places.find(p => p.id === act) as Place;
 return <div className={s.area}>
  <div className={s.map}>
   <img src={M.image} alt="" className={s.mapImg} />
   <svg className={s.mapSvg} viewBox={M.view.join(' ')} preserveAspectRatio="xMidYMid slice" aria-hidden>
    {places.map(p => p.route && <path key={p.id} d={p.route} className={s.route} style={{ strokeWidth: 3 * k }} />)}
    {cur.route && <path key={`on-${cur.id}`} d={cur.route} pathLength={1} className={s.routeOn} style={{ strokeWidth: 7 * k }} />}
   </svg>
   <span className={s.homePin} style={pct(M.home)}><i /><b>{x.project}</b></span>
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
 const { t } = useHome();
 const ref = useRef<HTMLDivElement>(null);
 const near = useInView(ref, '600px');
 const [on, setOn] = useState(false);
 useEffect(() => { if (near) setOn(true); }, [near]);
 return <div className={s.model} ref={ref} style={on ? undefined : { backgroundImage: `url(${HOME.model.poster})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
  {on && <ResidenceModel src={HOME.model.glb} poster={HOME.model.poster} defaultOrbit={HOME.model.orbit} outdoorOrbit={HOME.model.outdoorOrbit} stage="paper" />}
  {HOME.model.walk && <a className={s.walk} href={HOME.model.walk} target="_blank" rel="noreferrer"><Footprints size={15} aria-hidden />{t.model.walk}<small>{t.model.early}</small></a>}
 </div>;
}

/* ---------------------------------------------------------------- page */
export default function HomePage({ styleSlug }: { styleSlug: string }) {
 useSolo();
 const { t, x, L } = useHome();
 const style = filmStyle(styleSlug)!;
 const [long, short, phone] = style.cuts;
 // section markers in the style's own vernacular (as on the style pages: folio, sheet number, sticker)
 const mark = (n: number, t: string) => style.slug === 'monograph' ? `A-10${n} · ${t}` : style.slug === 'sunday-house' ? `0${n} · ${t}` : `Nº 0${n} — ${t}`;
 const kit0 = HOME.kits[style.slug];
 // the Hebrew page's media kit carries the Hebrew films (…-he.zip)
 const kit = L === 'he' && HE_FILMS.has(style.slug) ? { ...kit0, href: kit0.href.replace(/\.zip$/, '-he.zip') } : kit0;
 const map = HOME.maps[style.slug];
 const A = x.address;
 const title = L === 'he' ? `${A.street} ${A.no}` : `${A.no} ${A.street}`;   // Hebrew writes the number after the street
 const word = L === 'he' ? `${A.word} ${A.no}` : `${A.no} ${A.word}`.toUpperCase();
 const [scrolled, setScrolled] = useState(false);
 const [opening, setOpening] = useState(true);
 const done = useCallback(() => setOpening(false), []);
 const [lb, setLb] = useState<{ items: Shot[]; at: number } | null>(null);
 const open = useCallback((items: Shot[], at = 0) => setLb({ items, at }), []);
 useEffect(() => { const on = () => setScrolled(window.scrollY > 40); on(); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on); }, []);
 const nav = (['films', 'plan', 'model', 'building', 'area', 'contact'] as const).map(k => [k, t.nav[k]]);
 // the Hebrew page plays the Hebrew films (<slug>[-20|-916]-he.mp4 + posters) once they are published (HE_FILMS)

 const heFilm = L === 'he' && HE_FILMS.has(style.slug);
 const he = (u: string) => heFilm ? u.replace(/(-poster)?\.(mp4|jpg)$/, '-he$1.$2') : u;
 const cut = (c: typeof long, k: 'long' | 'short' | 'phone') => ({ ...c, label: t.cuts[k], src: he(c.src), poster: he(c.poster) });

 return <main className={`${st.page} ${s.home}`} data-style={style.slug} data-opening={opening || undefined}>
  {opening && <Intro word={word} under={`${A.street} · ${A.city}`} id={`home-${style.slug}-${L}`} onDone={done} />}
  <nav className={st.bar} data-solid={scrolled || undefined}>
   <Link href="/" className={st.logo} aria-label="residence.tech"><Logo /></Link>
   <ul className={st.tabs}>{nav.map(([h, t]) => <li key={h}><a href={`#${h}`}>{t}</a></li>)}</ul>
   <LanguageSwitch id="home-lang" compact tone={scrolled ? 'light' : 'glass'} className={s.lang} />
   <a href={kit.href} download className={s.dl} aria-label={t.downloadAria(kit.size)}><Download size={15} aria-hidden /><span>{t.download}</span></a>
   <a href="#contact" className={s.cta}><Phone size={15} aria-hidden />{t.enquire}<ArrowUpRight size={15} aria-hidden /></a>
  </nav>

  <header className={st.hero}>
   <HeroLoop className={st.heroVideo} />
   <div className={st.heroShade} />
   <div className={`${st.heroText} ${s.heroText}`}>
    <p className={st.kicker}><span>{x.unit}</span>{t.tower(HOME.unit.tower, HOME.unit.floor)}</p>
    <h1 className={st.h1}>{title}</h1>
    <p className={st.tagline}>{A.city}, {A.country}</p>
    <div className={s.dev}>
     <small>{t.developedBy}</small>
     {HOME.developer.url ? <Link href={HOME.developer.url}><img src={HOME.developer.logoWhite} alt={x.devName} /></Link> : <img src={HOME.developer.logoWhite} alt={x.devName} />}
    </div>
   </div>
   <HeroFacts />
   <a href="#films" className={`${st.cue} ${s.cue}`}><ArrowDown size={16} aria-hidden />{t.scroll}</a>
  </header>

  <section className={s.points}>
   <h2 className={s.pointsHead}>{t.pointsHead[0]}<em>{t.pointsHead[1]}</em></h2>
   <ul>{HOME.points.map((pt, j) => { const I = POINT_ICON[pt.icon] ?? Compass; const [ti, te] = x.point(j, [pt.title, pt.text]); return <li key={pt.title} style={{ ['--i' as string]: j }}>
    <span className={s.pIcon}><I size={22} strokeWidth={1.5} aria-hidden /></span><b>{ti}</b><span>{te}</span></li>; })}</ul>
  </section>

  <section className={st.section} id="films">
   <p className={st.mark}>{mark(1, t.marks.films)}</p>
   <Film cut={cut(long, 'long')} name={x.unit} big />
   <div className={`${st.pair} ${s.pairGap}`}><Film cut={cut(short, 'short')} name={x.unit} /><Film cut={cut(phone, 'phone')} name={x.unit} /></div>
  </section>

  <section className={st.section} id="plan">
   <p className={st.mark}>{mark(2, t.marks.plan)}</p>
   <h2 className={s.h2}>{t.h2.plan[0]}<em>{t.h2.plan[1]}</em></h2>
   <PlanExplorer open={open} />
  </section>

  <section className={st.section} id="model">
   <p className={st.mark}>{mark(3, t.marks.model)}</p>
   <div className={s.modelHead}>
    <h2 className={s.h2}>{t.h2.model[0]}<em>{t.h2.model[1]}</em></h2>
    <p className={s.sub}>{t.sub.model}</p>
   </div>
   <ModelBlock />
  </section>

  <section className={st.section} id="building">
   <p className={st.mark}>{mark(4, t.marks.building)}</p>
   <div className={s.modelHead}>
    <h2 className={s.h2}>{t.h2.building[0]}<em>{t.h2.building[1]}</em></h2>
    <p className={s.sub}>{t.sub.building}</p>
   </div>
   <BuildingSection open={open} />
  </section>

  <section className={st.section} id="area">
   <p className={st.mark}>{mark(5, t.marks.area)}</p>
   <h2 className={s.h2}>{t.h2.area[0]}<em>{t.h2.area[1]}</em></h2>
   <AreaMap image={map} />
  </section>

  <section className={st.section} id="contact">
   <p className={st.mark}>{mark(6, t.marks.contact)}</p>
   <Enquiry />
  </section>

  <section className={st.section} id="download">
   <div className={s.kit}>
    <div><p className={s.cardKicker}>{t.kit.kicker}</p><h2 className={s.kitTitle}>{t.kit.title[0]}<em>{t.kit.title[1]}</em></h2>
     <ul className={s.kitParts}>{kit.parts.map((q, j) => <li key={q.label}><b>{q.n}</b>{x.kitPart(j, q.label)}</li>)}</ul></div>
    <a href={kit.href} download className={s.kitBtn}><Download size={20} aria-hidden /><span>{t.kit.btn}<small>{t.kit.meta(kit.size, kit.files)}</small></span></a>
   </div>
  </section>

  <footer className={st.foot}>
   <Logo />
   <p>{t.foot(x.project, x.unit)}</p>
   <Link href="/alma-bay">{t.allResidences(x.project)}</Link>
  </footer>
  {lb && <Lightbox items={lb.items} at={lb.at} onClose={() => setLb(null)} />}
 </main>;
}
