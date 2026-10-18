'use client';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { ArrowUpRight, BookOpen, House, Layers, Box, Building2, Check, DoorOpen, Dumbbell, Flame, Flower2, Gamepad2, Sofa, Volleyball, WavesLadder, Wine, ChevronLeft as ChevronL, ChevronRight as ChevronR, Download, Expand, Eye, EyeOff, Hand, Images, Info, LayoutPanelLeft, Link2, Minus, Play, Plus, Search, X } from 'lucide-react';
import LanguageSwitch from '@/components/LanguageSwitch';
import { useLang } from '@/lib/i18n';
import { useFrameSequence } from '@/components/building/useFrameSequence';
import { ORBIT_URL, ORBIT_VIDEO, PLATES, SHOWCASE, UNITS, homeBase, mediaFor, plateKeyOf, project, unitById, type HomeMedia, type Orbit, type OrbitSpot, type ShiratUnit } from '@/content/projects/shirat-hayam';
import { shiratText } from './strings';
import ResidenceModel from '@/components/building/ResidenceModel';
import { film } from '@/components/landing/media';   // films straight from the bucket (Vercel caches a partial Range answer)
import s from './shirat.module.css';

type Tab = 'plan' | 'film' | 'images' | 'model' | 'about';
type TowerFilter = 'all' | 'A' | 'B';
const TABS: { value: Tab; icon: typeof Play }[] = [
 { value: 'plan', icon: LayoutPanelLeft }, { value: 'film', icon: Play }, { value: 'images', icon: Images }, { value: 'model', icon: Box }, { value: 'about', icon: Info },
];
const EASE = [0.22, 1, 0.36, 1] as const;
// in the order of strings.story.amenities
// wellness · leisure · arrival & community (indexes into strings.story.amenities)
const AMENITY_GROUPS = [[1, 2, 3, 4], [5, 7, 8, 9], [0, 6]];
const AMENITY_ICONS = [DoorOpen, WavesLadder, Flame, Dumbbell, Flower2, Sofa, BookOpen, Gamepad2, Wine, Volleyball];
const ZOOM_IN = 1.9;
// the frame box is drawn at this share of its fit (between the full fit and 0.8): the towers sit whole in the stage; the backdrop fills the rest
const FRAME_SHARE = 0.765;
// the picture fades out at its edges, so no hard line shows where it meets the backdrop
const FRAME_MASK = 'radial-gradient(ellipse 66% 70% at 50% 50%, #000 60%, transparent 100%)';
const HOVER_MS = 70;
// the towers' extent in the 1000×625 orbit frame, over all 72 views (homes span x 367–634, y 142–479; plus crowns + podium)
const TOWERS = { x0: 345, x1: 655, y0: 112, y1: 535 };
const HOMES_X = { x0: 362, x1: 640 }, HOMES_Y1 = 482;

const polyArea = (pts: string) => {
 const p = pts.split(' ').map(q => q.split(',').map(Number));
 let a = 0;
 for (let i = 0; i < p.length; i++) { const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length]; a += x0 * y1 - x1 * y0; }
 return Math.abs(a / 2);
};
// Camera bearing (where the viewer stands, seen from the towers): the orbit angle is CCW from east.
const bearingOf = (angle: number) => ((90 - angle) % 360 + 360) % 360;
const DIRS = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
const dirOf = (bearing: number) => DIRS[Math.round(bearing / 45) % 8];
const pad = (n: number) => String(n).padStart(2, '0');
const ringMode = (views: number): { video?: string; stride: number } => {
 const ua = navigator.userAgent;
 const ios = /iP(hone|ad|od)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
 const safari = /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg|FxiOS|Android/.test(ua);
 const force = new URLSearchParams(window.location.search).get('ring');     // ?ring=video | pictures, to compare on a device
 const video = force ? force === 'video' : !(ios || safari);
 // in production straight from the bucket (CORS allows the site), like the films; locally from public/
 const src = window.location.hostname.endsWith('residence.tech') ? film(ORBIT_VIDEO) : ORBIT_VIDEO;
 return video ? { video: src, stride: views >= 300 ? 12 : 4 } : { stride: views >= 300 ? 3 : 1 };
};
const readDeepLink = () => { try { return new URLSearchParams(window.location.search).get('home'); } catch { return null; } };

export default function ShiratSite() {
 const lang = useLang();
 const [ChevronLeft, ChevronRight] = lang === 'he' ? [ChevronR, ChevronL] : [ChevronL, ChevronR];
 const t = shiratText[lang];
 const [orbit, setOrbit] = useState<Orbit | null>(null);
 useEffect(() => { fetch(ORBIT_URL).then(r => r.json()).then(setOrbit).catch(() => setOrbit({ count: 0, width: 1000, height: 625, frames: [] })); }, []);
 const frames = orbit?.frames ?? [];
 // Chrome, Edge, Firefox (desktop and Android) seek a buffered video in a few ms: they turn the ring as
 // one video, with every 12th view as pictures until it is in. Safari / iOS seek slowly: a picture ring.
 const [ring, setRing] = useState<{ video?: string; stride: number } | null>(null);
 useEffect(() => { if (orbit?.count) setRing(ringMode(orbit.count)); }, [orbit?.count]);
 const sources = useMemo(() => ring ? frames.map(f => f.src) : [], [frames, ring]);
 const engine = useFrameSequence(sources, 0, 1, { aspect: 625 / 1000, maxWidth: 2000, turnPerWidth: 260, inertia: 480, video: ring?.video, stride: ring?.stride ?? 1, onVideoFail: () => setRing({ stride: (orbit?.count ?? 0) >= 300 ? 3 : 1 }) });

 // Where each home shows best (largest outline over the 72 views), so choosing it from a list turns to it.
 const best = useMemo(() => {
  const m = new Map<string, { frame: number; area: number }>();
  frames.forEach((f, i) => {
   const per = new Map<string, number>();
   f.spots.forEach(sp => per.set(sp.id, (per.get(sp.id) ?? 0) + polyArea(sp.points)));
   per.forEach((a, id) => { const cur = m.get(id); if (!cur || a > cur.area) m.set(id, { frame: i, area: a }); });
  });
  return m;
 }, [frames]);

 const [selected, setSelected] = useState<string>(SHOWCASE.ph02);
 const [hovered, setHovered] = useState<string | null>(null);
 const [tower, setTower] = useState<TowerFilter>('all');
 const [showAll, setShowAll] = useState(false);
 const [tab, setTab] = useState<Tab>('film');
 const [lightbox, setLightbox] = useState<{ items: { src: string; label: string }[]; i: number } | null>(null);
 const [finder, setFinder] = useState(false);
 const [register, setRegister] = useState(false);
 const [zoom, setZoom] = useState(1);
 const [copied, setCopied] = useState(false);
 const [compact, setCompact] = useState(false);     // compact card = more stage for the towers
 // Step inside (standard): the top bar and the towers step aside and the home gets the whole screen (Esc returns)
 const [focus, setFocus] = useState(false);
 useEffect(() => {
  if (!focus) return;
  const k = (e: KeyboardEvent) => { if (e.key === 'Escape' && !document.querySelector('[role="dialog"]')) setFocus(false); };
  window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
 }, [focus]);
 const [tip, setTip] = useState<{ x: number; y: number; id: string } | null>(null);
 const [hintSeen, setHintSeen] = useState(true);
 const [touch, setTouch] = useState(false);
 useEffect(() => { try { setHintSeen(localStorage.getItem('shirat.hint') === '1'); setCompact(localStorage.getItem('shirat.compact') === '1'); } catch { /* private */ } setTouch(window.matchMedia('(hover: none)').matches); }, []);
 const toggleCompact = () => setCompact(v => { try { localStorage.setItem('shirat.compact', v ? '0' : '1'); } catch { /* private */ } return !v; });
 const dismissHint = () => { if (hintSeen) return; setHintSeen(true); try { localStorage.setItem('shirat.hint', '1'); } catch { /* private */ } };
 const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

 const unit = unitById(selected) ?? UNITS[0];
 const media = mediaFor(unit);
 const ordered = useMemo(() => [...UNITS].sort((a, b) => a.b.localeCompare(b.b) || a.f - b.f || a.u.localeCompare(b.u)), []);
 const idx = ordered.findIndex(u => u.id === unit.id);

 // ---- stage geometry: the 16:10 frame covers the stage, its centre pulled right of the panel on wide screens
 const stageRef = useRef<HTMLDivElement>(null);
 const panelRef = useRef<HTMLElement>(null);
 const [box, setBox] = useState({ w: 1000, h: 625, left: 0, top: 0, scale: 1, rx0: 0, rx1: 100000 });
 useLayoutEffect(() => {
  const el = stageRef.current;
  if (!el) return;
  const fit = () => {
   if (document.querySelector('[data-focus]')) return;     // stepped inside: the stage is hidden, keep its frame
   const W = el.clientWidth, H = el.clientHeight;
   // the towers fill the part of the stage beside the residence card (the card sits over the rest)
   const pw = W > 1100 ? (panelRef.current?.offsetWidth ?? 0) + 26 : 0;
   const region = W - pw;
   // frame the towers (crowns to podium, every view of the orbit), not the whole render: they fill the free
   // area between the top controls and the dock, never less than covering the stage
   // crowns sit clear below the top controls; the podium may run behind the dock; width = the homes' span, edge to edge
   // (the lowest homes end just above the dock, so every home stays clickable)
   const top0 = W > 1100 ? 150 : 64, dockTop = W > 1100 ? 80 : 110;
   const cover = Math.max(region / 1000, H / 625);
   const sc = Math.max(cover, Math.min(region * 0.9 / (TOWERS.x1 - TOWERS.x0), (H - dockTop - top0) / (TOWERS.y1 - TOWERS.y0)));
   const availH = (TOWERS.y1 - TOWERS.y0) * sc;
   const w = 1000 * sc, h = 625 * sc;
   const rtl = document.documentElement.dir === 'rtl';     // the card sits at the end side (right in English)
   const cx = rtl ? pw + region / 2 : region / 2, cy = top0 + availH / 2;
   const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
   const rx0 = rtl ? pw : 0, rx1 = rtl ? W : region;     // the free area must stay covered (the backdrop fills behind the card)
   setBox({ w, h, left: clamp(cx - (TOWERS.x0 + TOWERS.x1) / 2 * sc, rx1 - w, rx0), top: clamp(cy - (TOWERS.y0 + TOWERS.y1) / 2 * sc, H - h, 0), scale: sc, rx0, rx1 });
  };
  fit();
  const ro = new ResizeObserver(fit); ro.observe(el); if (panelRef.current) ro.observe(panelRef.current);
  return () => ro.disconnect();
 }, [lang]);

 const frame = frames[engine.displayed];
 const spotsOf = useCallback((id: string) => frame?.spots.filter(sp => sp.id === id) ?? [], [frame]);
 const centreOf = (id: string) => spotsOf(id).find(sp => sp.c)?.c;
 const turning = engine.moving;

 const select = (id: string, { turn = true } = {}) => {
  setSelected(id);
  const b = best.get(id);
  if (!turn || !b) return;
  const here = frames[engine.settled]?.spots.filter(sp => sp.id === id).reduce((a, sp) => a + polyArea(sp.points), 0) ?? 0;
  if (here < b.area * 0.45 || engine.moving) engine.rotateTo(b.frame);
 };
 const step = (d: number) => { const u = ordered[(idx + d + ordered.length) % ordered.length]; select(u.id); };

 // ?home=a-f12-01 opens on that home
 const linkRead = useRef(false);   // the URL keeps ?home= untouched until it has been read (the frames load later than the first select)
 useEffect(() => {
  if (!frames.length) return;
  linkRead.current = true;
  const id = readDeepLink();
  if (id && unitById(id)) { select(id); return; }
  // no link: open on Penthouse 02, the sea-facing hero (it turns the towers to it)
  select(SHOWCASE.ph02);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [frames.length]);
 useEffect(() => {
  if (!linkRead.current) return;
  const timer = setTimeout(() => { try { const url = new URL(window.location.href); url.searchParams.set('home', selected); window.history.replaceState(window.history.state, '', url); } catch { /* sandboxed */ } }, 350);
  return () => clearTimeout(timer);
 }, [selected]);
 useEffect(() => { document.title = `${t.name} · ${t.place} · BRIGA`; }, [t]);

 // ---- pointer on the stage: drag turns, a still click picks the home under it
 const press = useRef<{ x: number; moved: boolean } | null>(null);
 const zoneAt = (x: number, y: number) => {
  const el = document.elementFromPoint(x, y)?.closest('[data-home]');
  return el && stageRef.current?.contains(el) ? el.getAttribute('data-home') : null;
 };
 const hover = (id: string | null, x?: number, y?: number) => {
  if (hoverTimer.current) clearTimeout(hoverTimer.current);
  if (!id) { setHovered(null); setTip(null); return; }
  hoverTimer.current = setTimeout(() => setHovered(id), HOVER_MS);
  const r = stageRef.current?.getBoundingClientRect();
  if (r && x !== undefined && y !== undefined) setTip({ x: x - r.left, y: y - r.top, id });
 };
 useEffect(() => {
  const el = stageRef.current;
  if (!el || !frames.length) return;
  const wheel = (e: WheelEvent) => {
   if (e.ctrlKey || engine.isDragging() || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
   e.preventDefault(); dismissHint(); engine.nudgePixels(e.deltaX);
  };
  el.addEventListener('wheel', wheel, { passive: false });
  return () => el.removeEventListener('wheel', wheel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [frames.length, hintSeen]);

 // zoom centres on the chosen home (or the towers), clamped so the frame still covers the stage
 const origin = (() => {
  const c = centreOf(selected);
  return c ? `${(c[0] / 10).toFixed(2)}% ${(c[1] / 6.25).toFixed(2)}%` : '50% 50%';
 })();

 const spotClass = (sp: OrbitSpot) => {
  const u = unitById(sp.id);
  const out = tower !== 'all' && u?.b !== tower;
  if (sp.id === selected) return s.spotSelected;
  if (sp.id === hovered) return s.spotHover;
  if (out) return s.spotOut;
  return showAll || tower !== 'all' || finder ? s.spotShown : s.spotIdle;
 };

 const bearing = frame ? bearingOf(frame.angle) : 270;
 const fromSea = bearing > 225 && bearing < 315;
 const selCentre = centreOf(selected);
 // the tag opens away from the card: flip it when it would run past the free edge of the stage
 const pinFlip = (() => {
  if (!selCentre) return false;
  const x = box.left + selCentre[0] / 1000 * box.w, room = 250;
  return x + room > box.rx1;     // the tag opens to the right (in both languages)
 })();
 const tipUnit = tip ? unitById(tip.id) : undefined;

 const copyLink = async () => {
  try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* blocked */ }
 };
 const chooseTower = (v: TowerFilter) => {
  setTower(v);
  if (v === 'all') return;
  if (unit.b !== v) {
   const same = UNITS.find(u => u.b === v && u.f === unit.f && u.u === unit.u) ?? UNITS.find(u => u.b === v)!;
   select(same.id);
  }
 };

 return <MotionConfig reducedMotion="user"><div className={s.page} data-compact={(compact && !focus) || undefined} data-focus={focus || undefined}>
  {/* ---------------------------------------------------------------- top bar */}
  <header className={s.bar}>
   <a href={project.developerUrl} target="_blank" rel="noreferrer" className={s.logo} aria-label="BRIGA">
    <img src={project.logoBlack} alt="BRIGA · Real estate since 1979" width={1600} height={452} />
   </a>
   <div className={s.wordmark} aria-label={`${t.name}, ${t.place}`}>
    <span>SHIRAT HAYAM</span><small>NETANYA</small>
   </div>
   <div className={s.barEnd}>
    <LanguageSwitch id="shirat-lang" compact tone="glass" />
    <div className={s.navFind}>
     <button type="button" className={s.findBtn} onClick={() => { setFocus(false); setFinder(v => !v); }} aria-pressed={finder} aria-label={t.find} title={t.find}>
      <Search size={14} strokeWidth={1.7} aria-hidden /><span>{t.find}</span>
     </button>
     <div className={s.stepper}>
      <button type="button" aria-label={t.prev} title={t.prev} onClick={() => step(-1)}><ChevronLeft size={15} strokeWidth={1.6} aria-hidden /></button>
      <span className={s.stepCount} aria-live="polite" title={t.tipLine(unit.b, unit.f, unit.u, unit.ph)}><HomeCode unit={unit} /></span>
      <button type="button" aria-label={t.next} title={t.next} onClick={() => step(1)}><ChevronRight size={15} strokeWidth={1.6} aria-hidden /></button>
     </div>
    </div>
   </div>
  </header>

  {/* ---------------------------------------------------------------- explorer */}
  <section id="residences" className={s.explorer} aria-label={t.stage}>
   <div ref={stageRef} className={s.stage} data-moving={turning || undefined} tabIndex={0} role="group" aria-label={t.stage}
    onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); dismissHint(); engine.step((e.key === 'ArrowRight' ? -1 : 1) * Math.max(1, Math.round(frames.length / 72))); } }}
    onPointerDown={e => { if (e.button !== 0 || (e.target as HTMLElement).closest('[data-ui]')) return; press.current = { x: e.clientX, moved: false }; engine.beginDrag(e.clientX); e.currentTarget.setPointerCapture(e.pointerId); }}
    onPointerMove={e => {
     if (!press.current) { if (!turning && !(e.target as HTMLElement).closest('[data-ui]')) hover(zoneAt(e.clientX, e.clientY), e.clientX, e.clientY); return; }
     if (Math.abs(e.clientX - press.current.x) > 5) { press.current.moved = true; dismissHint(); hover(null); }
     engine.dragTo(e.clientX);
    }}
    onPointerUp={e => {
     const moved = press.current?.moved; const pressed = !!press.current;
     press.current = null; engine.endDrag();
     if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
     if (pressed && !moved) { const id = zoneAt(e.clientX, e.clientY); if (id) { dismissHint(); select(id, { turn: false }); } }
    }}
    onPointerCancel={() => { press.current = null; engine.endDrag(); }}
    onPointerLeave={() => { if (!press.current) hover(null); }}>

    {frames[engine.settled] && <div className={s.backdrop} aria-hidden style={{ backgroundImage: `url(${frames[engine.settled].src})` }} />}
    <div className={s.skyFade} aria-hidden />{/* the sky of the picture, over the stage top: the gap above the building reads as sky */}
    <div className={s.frameBox} style={{ width: box.w, height: box.h, left: box.left, top: box.top, transform: `translateY(50px) scale(${FRAME_SHARE})`, transformOrigin: '50% 50%', WebkitMaskImage: FRAME_MASK, maskImage: FRAME_MASK, WebkitMaskComposite: 'source-in', maskComposite: 'intersect' }}>
     <div className={s.zoomLayer} style={{ transform: `scale(${zoom})`, transformOrigin: origin }}>
      {frames[0] && !engine.firstReady && <img className={s.poster} src={frames[0].src} alt="" draggable={false} />}
      <canvas ref={engine.canvasRef} className={s.canvas} role="img" aria-label={t.stage} />
      {frame && !engine.failed && <svg viewBox="0 0 1000 625" className={s.spots} aria-hidden={turning || undefined}>
       <defs><filter id="shirat-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="b" /><feFlood floodColor="#d9c7b2" floodOpacity="0.9" />
        <feComposite in2="b" operator="in" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
       </filter></defs>
       {frame.spots.map((sp, i) => <polygon key={`${sp.id}-${i}`} data-home={sp.id} points={sp.points} className={spotClass(sp)} vectorEffect="non-scaling-stroke" />)}
      </svg>}
      {/* the chosen home's tag, pinned to its facade */}
      <AnimatePresence>
       {selCentre && !turning && <motion.div key={`${selected}-${engine.displayed}`} className={s.pin} data-flip={pinFlip || undefined} style={{ left: `${selCentre[0] / 10}%`, top: `${selCentre[1] / 6.25}%` }}
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
        <span className={s.pinDot} /><span className={s.pinTag} style={{ transform: `scale(${1 / zoom})` }}><HomeCode unit={unit} /></span>
       </motion.div>}
      </AnimatePresence>
     </div>
    </div>
    <div className={s.vignette} aria-hidden />

    {/* hover tooltip */}
    <AnimatePresence>
     {tip && tipUnit && tip.id !== selected && !turning && <motion.div key="tip" className={s.tip} data-flip={tip.x + 300 > box.rx1 || undefined} style={{ left: tip.x, top: tip.y }} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
      {t.tipLine(tipUnit.b, tipUnit.f, tipUnit.u, tipUnit.ph)}
     </motion.div>}
    </AnimatePresence>

    {/* top-right: towers + finder */}
    <div className={s.stageTop} data-ui data-hidden={finder || undefined}>
     <div className={s.seg} role="radiogroup" aria-label={t.tower}>
      {(['all', 'A', 'B'] as TowerFilter[]).map(v => <button key={v} type="button" role="radio" aria-checked={tower === v} className={s.segBtn} onClick={() => chooseTower(v)}>
       <span>{v === 'all' ? t.both : t.towerN(v)}</span>
      </button>)}
     </div>
    </div>

    {/* top-start corner: show homes, closer · top-end corner of the stage: the compass rose */}
    <div className={s.cornerTools} data-ui data-hidden={finder || undefined}>
     <div className={s.viewTools}>
     <button type="button" className={s.dockIcon} aria-pressed={showAll} aria-label={showAll ? t.hideHomes : t.showHomes} title={showAll ? t.hideHomes : t.showHomes} onClick={() => setShowAll(v => !v)}>
      {showAll ? <Eye size={17} strokeWidth={1.7} aria-hidden /> : <EyeOff size={17} strokeWidth={1.7} aria-hidden />}
     </button>
     <button type="button" className={s.dockIcon} aria-pressed={zoom > 1} aria-label={zoom > 1 ? t.zoomOut : t.zoomIn} title={zoom > 1 ? t.zoomOut : t.zoomIn} onClick={() => setZoom(z => z > 1 ? 1 : ZOOM_IN)}>
      {zoom > 1 ? <Minus size={17} strokeWidth={1.7} aria-hidden /> : <Plus size={17} strokeWidth={1.7} aria-hidden />}
     </button>
     </div>
    </div>
    <div className={s.compassRose} aria-hidden title={t.dirName[dirOf(bearing)]}>
     <span className={s.dial}><i style={{ transform: `rotate(${-((bearing + 180) % 360)}deg)`, ['--r' as string]: `${-((bearing + 180) % 360)}deg` }}><b>N</b></i><em /><u /></span>
    </div>

    {/* bottom: turn, compass */}
    <div className={s.dock} data-ui>
     <button type="button" className={s.dockIcon} aria-label={t.turnLeft} onClick={() => { dismissHint(); engine.step(Math.max(1, Math.round(frames.length / 24))); }}><ChevronLeft size={18} strokeWidth={1.7} aria-hidden /></button>
     <div className={s.compass} aria-live="polite">
      <span className={s.compassText}><small>{fromSea ? t.viewFromSea : t.viewFrom}</small><strong>{t.dirName[dirOf(bearing)]}</strong></span>
     </div>
     <button type="button" className={s.dockIcon} aria-label={t.turnRight} onClick={() => { dismissHint(); engine.step(-Math.max(1, Math.round(frames.length / 24))); }}><ChevronRight size={18} strokeWidth={1.7} aria-hidden /></button>
    </div>

    <AnimatePresence>
     {!hintSeen && engine.firstReady && <motion.div key="hint" className={s.hint} data-ui initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: EASE, delay: 0.6 }}>
      <Hand size={15} strokeWidth={1.6} aria-hidden />{touch ? t.hintTouch : t.hintMouse}
     </motion.div>}
    </AnimatePresence>
    {frames.length > 0 && !engine.firstReady && !engine.failed && <div className={s.loading} role="status"><span className={s.spinner} />{t.preparing}</div>}

   </div>
    {/* ---------------------------------------------------------------- the chosen residence */}
    <motion.aside ref={panelRef} className={s.panel} data-ui aria-label={t.homeTitle(unit.u, unit.ph)} initial={{ opacity: 0, x: lang === 'he' ? -16 : 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE }}>
     <button type="button" className={s.edgeToggle} onClick={toggleCompact} aria-pressed={compact} aria-label={compact ? t.widen : t.shrink} title={compact ? t.widen : t.shrink}>
      {/* the arrow points where the card's edge will move */}
      {(compact !== (lang === 'he')) ? <ChevronL size={16} strokeWidth={1.6} aria-hidden /> : <ChevronR size={16} strokeWidth={1.6} aria-hidden />}
     </button>
     <div className={s.panelHead}>
      <AnimatePresence mode="popLayout" initial={false}>
       <motion.div key={unit.id} className={s.headTitle} initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }} transition={{ duration: 0.38, ease: EASE }}>
        <div className={s.eyebrowRow}>
         <span className={s.status} data-preview={media ? '' : undefined} data-final={media?.final ? '' : undefined}
          title={media && (media.shownOn.b !== unit.b || media.shownOn.f !== unit.f) ? t.shownOn(media.shownOn.b, media.shownOn.f) : undefined}>
          <i />{media ? (media.final ? (media.model ? t.ready : t.readyNo3d) : t.preview) : t.comingSoon}{media && (media.shownOn.b !== unit.b || media.shownOn.f !== unit.f) && <Info size={12} strokeWidth={1.8} aria-hidden />}
         </span>
        </div>
        <h1 className={s.title}>{t.homeTitle(unit.u, unit.ph)}</h1>
       </motion.div>
      </AnimatePresence>
      <KeyPlan unit={unit} hovered={hovered} onHover={setHovered} onPick={id => select(id)} />
      <div className={s.headActions}>
       <div className={s.actRow}>
        <button type="button" className={s.secondary} onClick={copyLink} aria-label={t.share} title={t.share}>{copied ? <Check size={15} strokeWidth={1.8} aria-hidden /> : <Link2 size={15} strokeWidth={1.6} aria-hidden />}</button>
        {media && <a className={s.dlBtn} href={`/downloads/shirat-hayam/${media.key}.zip`} download={`shirat-hayam-${media.key}.zip`} aria-label={t.downloadTitle} title={t.downloadTitle}>
         <Download size={14} strokeWidth={1.6} aria-hidden /><span>{t.download}</span>
        </a>}
        <button type="button" className={s.stepBtn} aria-pressed={focus} aria-label={focus ? t.back : t.step} onClick={() => { setFinder(false); setFocus(v => !v); }} title={focus ? t.backTitle : t.stepTitle}>
         {focus ? <Building2 size={15} strokeWidth={1.6} aria-hidden /> : <Eye size={15} strokeWidth={1.6} aria-hidden />}<span>{focus ? t.back : t.step}</span>
        </button>
        <button type="button" className={s.primary} onClick={() => setRegister(true)}><span>{t.register}</span></button>
       </div>
      </div>
     </div>
     <dl className={s.facts}>
      <div><dt>{t.facts.rooms}</dt><dd data-on={media ? '' : undefined}>{media ? media.rooms : '—'}</dd></div>
      <div><dt>{t.facts.interior}</dt><dd data-on={media ? '' : undefined}>{media ? <>{Math.round(media.interior)}<small>{t.sqm}</small></> : '—'}</dd></div>
      <div><dt>{media?.outdoorKind === 'terrace' ? t.terrace : t.facts.balcony}</dt><dd data-on={media ? '' : undefined}>{media ? <>{media.outdoor}<small>{t.sqm}</small></> : '—'}</dd></div>
      <div><dt>{t.floor}</dt><dd data-on="">{unit.f}</dd></div>
      <div><dt>{t.facts.aspect}</dt><dd data-on={media ? '' : undefined} data-text="">{media ? (lang === 'he' ? media.aspect.he : media.aspect.en) : '—'}</dd></div>
      <div><dt>{t.facts.price}</dt><dd>—</dd></div>
     </dl>
     <div className={s.tabs} role="tablist" aria-label={t.homeTitle(unit.u, unit.ph)}>
      {TABS.map(({ value, icon: Icon }) => <button key={value} type="button" role="tab" aria-selected={tab === value} className={s.tab} onClick={() => setTab(value)}>
       {tab === value && <motion.span layoutId="shirat-tab" className={s.tabThumb} transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
       <Icon size={15} strokeWidth={1.7} aria-hidden /><span>{t.tabs[value]}</span>
      </button>)}
     </div>
     <div className={s.media} role="tabpanel" data-dark={media && tab === 'film' ? '' : undefined}>
      <AnimatePresence mode="wait" initial={false}>
       {tab === 'model' && media?.model
        ? <motion.div key={`model-${media.key}`} className={s.mediaFill} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}><div className={s.model3d}>{media.hq
          ? <ResidenceModel src={`${homeBase(media.key)}/${media.hq.glb}`} poster={`${homeBase(media.key)}/${media.hq.poster}`} defaultOrbit={media.hq.orbit} outdoorOrbit={media.hq.outdoorOrbit} stage="paper" />
          : <ResidenceModel src={`${homeBase(media.key)}/model.glb`} />}</div></motion.div>
        : tab === 'about'
        ? <motion.div key={`about-${unit.id}`} className={s.mediaFill} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}><AboutView unit={unit} media={media} /></motion.div>
        : media && tab !== 'model'
        ? <motion.div key={`${media.key}-${tab}`} className={s.mediaFill} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
         <HomeView media={media} tab={tab} onOpen={(items, i) => setLightbox({ items, i })} />
        </motion.div>
        : <motion.div key={tab} className={s.empty} initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
         <span className={s.emptyIcon}>{(() => { const Icon = TABS.find(x => x.value === tab)!.icon; return <Icon size={22} strokeWidth={1.3} aria-hidden />; })()}</span>
         <strong>{t.empty[tab][0]}</strong><span>{t.empty[tab][1]}</span>
         {!media && <div className={s.tryRow}><small>{t.tryHome}</small>
          <button type="button" onClick={() => select(SHOWCASE.apt01)}>{t.tryApt}</button>
          <button type="button" onClick={() => select(SHOWCASE.ph02)}>{t.tryPh}</button>
         </div>}
        </motion.div>}
      </AnimatePresence>
     </div>
    </motion.aside>
  </section>

  {/* ---------------------------------------------------------------- story */}
  <section id="project" className={s.story}>
   <motion.div className={s.storyHead} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease: EASE }}>
    <p className={s.kicker}>{t.story.kicker}</p>
    <h2 className={s.display} data-one-line="">{t.story.title[0]} <em>{t.story.title[1]}</em></h2>
    <p className={s.lead}>{t.story.lead}</p>
   </motion.div>
   <div className={s.figures}>
    {[project.figures.towers, project.figures.floors, project.figures.homes, project.figures.plot].map((v, i) =>
     <motion.div key={i} className={s.figure} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}>
      <strong>{v.toLocaleString('en-US')}</strong><span>{t.story.figures[i][0]}</span><small>{t.story.figures[i][1]}</small>
     </motion.div>)}
   </div>
   <motion.figure className={`${s.wide} ${s.wideFilm}`} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1.1, ease: EASE }}>
    {/* locally from public/ (not uploaded yet), in production straight from the bucket like the home films */}
    {(() => { const f = project.film[lang === 'he' ? 'he' : 'en']; return <FilmPlayer key={lang} src={process.env.NODE_ENV === 'development' ? f.src : film(f.src)} poster={f.poster} label={t.tabs.film} />; })()}
   </motion.figure>
  </section>

  <section id="amenities" className={s.amenities}>
   <div className={s.split}>
    <div>
     <p className={s.kicker}>{t.story.amenitiesKicker}</p>
     <h2 className={s.display2}>{t.story.amenitiesTitle}</h2>
    </div>
    <div>
     <p className={s.lead}>{t.story.amenitiesLead}</p>

    </div>
   </div>
   <div className={s.amenityGroups}>
    {AMENITY_GROUPS.map((g, gi) => <motion.section key={gi} className={s.amenityGroup} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.8, ease: EASE, delay: gi * 0.08 }}>
     <h3>{t.story.amenityGroups[gi]}</h3>
     <ul>{g.map(i => { const Icon = AMENITY_ICONS[i] ?? Flower2; return <li key={i}><span className={s.amenityIcon}><Icon size={16} strokeWidth={1.3} aria-hidden /></span><span className={s.amenityName}>{t.story.amenities[i]}</span></li>; })}</ul>
    </motion.section>)}
   </div>
   <div className={s.tiles}>
    {(['pool', 'lobby', 'tennis', 'terrace'] as const).map((k, i) => <motion.figure key={k} className={s.tile} data-k={k} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.9, ease: EASE, delay: i * 0.06 }}>
     <FadeImg src={project.stills[k]} alt={t.story.tiles[k]} loading="lazy" />
     <figcaption><span>{t.story.tiles[k]}</span><small>{t.studyRender}</small></figcaption>
    </motion.figure>)}
   </div>
   <div className={s.lobbyBlock}>
    <motion.div className={s.lobbyHead} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.9, ease: EASE }}>
     <p className={s.kicker}>{t.story.lobbyKicker}</p>
     <h3 className={s.display2}>{t.story.lobbyTitle}</h3>
     <p className={s.lead}>{t.story.lobbyLead}</p>
    </motion.div>
    <div className={s.lobbyTiles}>
     {(['hall', 'salon', 'entry'] as const).map((k, i) => {
      const src = { hall: project.stills.lobbyHall, salon: project.stills.lobbySalon, entry: project.stills.lobbyEntry }[k];
      const items = (['hall', 'salon', 'entry'] as const).map(x => ({ src: { hall: project.stills.lobbyHall, salon: project.stills.lobbySalon, entry: project.stills.lobbyEntry }[x], label: t.story.lobbyTiles[x] }));
      return <motion.figure key={k} className={s.tile} data-k={`lobby-${k}`} onClick={() => setLightbox({ items, i })} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}>
       <FadeImg src={src} alt={t.story.lobbyTiles[k]} loading="lazy" />
       <figcaption><span>{t.story.lobbyTiles[k]}</span><small>{t.studyRender}</small></figcaption>
      </motion.figure>;
     })}
    </div>
   </div>
  </section>

  <section id="location" className={s.location}>
   <FadeImg className={s.locationImg} src={project.stills.hero} alt="" loading="lazy" />
   <div className={s.locationShade} aria-hidden />
   <motion.div className={s.locationCopy} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE }}>
    <p className={s.kicker}>{t.story.locationKicker}</p>
    <h2 className={s.display2}>{t.story.locationTitle}</h2>
    <p className={s.lead}>{t.story.locationLead}</p>
    <a className={s.linkBtn} href={project.mapsUrl} target="_blank" rel="noreferrer">{t.story.openMaps}<ArrowUpRight size={15} strokeWidth={1.8} aria-hidden /></a>
   </motion.div>
  </section>

  <footer className={s.footer}>
   <img src={project.logoWhite} alt="BRIGA" width={1600} height={452} />
   <p className={s.brandLine}>{t.story.brandLine}</p>
   <a className={s.footLink} href={project.developerUrl} target="_blank" rel="noreferrer">{t.story.developer}<ArrowUpRight size={14} strokeWidth={1.8} aria-hidden /></a>
   <p className={s.disclaimer}>{t.story.disclaimer}</p>
  </footer>

  <AnimatePresence>{lightbox && <Lightbox key="lb" {...lightbox} onClose={() => setLightbox(null)} />}</AnimatePresence>

  {/* ---------------------------------------------------------------- floor finder */}
  <AnimatePresence>
   {finder && <Finder key="finder" tower={tower === 'all' ? unit.b : tower} selected={selected} hovered={hovered}
    onTower={v => chooseTower(v)} onHover={setHovered} onSelect={id => { select(id); if (window.innerWidth < 900) setFinder(false); }} onClose={() => setFinder(false)} />}
  </AnimatePresence>

  <AnimatePresence>
   {register && <motion.div key="reg" className={s.scrim} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRegister(false)}>
    <motion.div className={s.dialog} role="dialog" aria-modal="true" aria-label={t.registerTitle} onClick={e => e.stopPropagation()}
     initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.45, ease: EASE }}>
     <button type="button" className={s.close} aria-label={t.close} onClick={() => setRegister(false)}><X size={18} strokeWidth={1.7} aria-hidden /></button>
     <p className={s.eyebrow}>{t.eyebrow(unit.b, unit.f)} · {t.homeTitle(unit.u, unit.ph)}</p>
     <h3 className={s.display3}>{t.registerTitle}</h3>
     <p className={s.dialogBody}>{t.registerBody}</p>
     <a className={s.primary} href={project.developerUrl} target="_blank" rel="noreferrer">{t.registerCta}<ArrowUpRight size={15} strokeWidth={1.8} aria-hidden /></a>
    </motion.div>
   </motion.div>}
  </AnimatePresence>
 </div></MotionConfig>;
}

function Finder({ tower, selected, hovered, onTower, onHover, onSelect, onClose }: {
 tower: 'A' | 'B'; selected: string; hovered: string | null; onTower: (b: 'A' | 'B') => void; onHover: (id: string | null) => void; onSelect: (id: string) => void; onClose: () => void;
}) {
 const lang = useLang(); const t = shiratText[lang];
 // floors grouped by plate (penthouses · upper · lower), each home in its own column so 01 always sits over 01
 const groups = useMemo(() => {
  const m = new Map<number, ShiratUnit[]>();
  UNITS.filter(u => u.b === tower).forEach(u => (m.get(u.f) ?? m.set(u.f, []).get(u.f)!).push(u));
  const rows = [...m.entries()].sort((a, b) => b[0] - a[0]).map(([f, us]) => ({ f, us: us.sort((a, b) => a.u.localeCompare(b.u)) }));
  const low = tower === 'A' ? 12 : 13;
  return [
   { key: 'ph', label: t.groupPh, range: '32', rows: rows.filter(r => r.f === 32) },
   { key: 'hi', label: t.groupHigh, range: `${low + 1}–31`, rows: rows.filter(r => r.f < 32 && r.f > low) },
   { key: 'lo', label: t.groupLow, range: `1–${low}`, rows: rows.filter(r => r.f <= low) },
  ];
 }, [tower, t]);
 useEffect(() => {
  const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
  window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
 }, [onClose]);
 const listRef = useRef<HTMLDivElement>(null);
 useEffect(() => { listRef.current?.querySelector('[data-on]')?.scrollIntoView({ block: 'center' }); }, [tower]);
 const count = UNITS.filter(u => u.b === tower).length;
 return <motion.aside className={s.finder} aria-label={t.finderTitle} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }}>
  <div className={s.finderHead}>
   <div><p className={s.eyebrow}>{t.residencesCount(count)}</p><h3 className={s.display3}>{t.finderTitle}</h3></div>
   <button type="button" className={s.close} aria-label={t.close} onClick={onClose}><X size={16} strokeWidth={1.7} aria-hidden /></button>
  </div>
  <div className={s.finderBar}>
   <div className={s.seg} role="radiogroup" aria-label={t.tower}>
    {(['A', 'B'] as const).map(v => <button key={v} type="button" role="radio" aria-checked={tower === v} className={s.segBtn} onClick={() => onTower(v)}><span>{t.towerN(v)}</span></button>)}
   </div>
   <span className={s.legend}><i />{t.legendPreview}</span>
  </div>
  <div className={s.colHead} aria-hidden><span>{t.floor}</span>{['01', '02', '03', '04'].map(c => <span key={c}>{c}</span>)}</div>
  <div ref={listRef} className={s.floors} onPointerLeave={() => onHover(null)}>
   {groups.map(g => g.rows.length > 0 && <section key={g.key} className={s.floorGroup} data-g={g.key}>
    <p className={s.groupLabel}><span>{g.label}</span><small>{g.range}</small></p>
    {g.rows.map(({ f, us }) => <div key={f} className={s.floorRow} data-ph={g.key === 'ph' || undefined}>
     <span className={s.floorNo}>{f}</span>
     {(g.key === 'ph' ? us : ['01', '02', '03', '04'].map(c => us.find(u => u.u === c))).map((u, i) => u
      ? <button key={u.id} type="button" className={s.unitChip} data-on={u.id === selected || undefined} data-hover={u.id === hovered || undefined}
        style={g.key === 'ph' ? { gridColumn: i === 0 ? '2 / span 2' : '4 / span 2' } : undefined}
        aria-label={t.tipLine(u.b, u.f, u.u, u.ph)} aria-pressed={u.id === selected} onPointerEnter={() => onHover(u.id)} onFocus={() => onHover(u.id)} onClick={() => onSelect(u.id)}>
        <span>{u.ph ? `PH ${u.u}` : u.u}</span>{mediaFor(u) && <i aria-hidden />}
       </button>
      : <span key={i} className={s.unitNone} aria-hidden />)}
    </div>)}
   </section>)}
  </div>
 </motion.aside>;
}

// ---- a home's address at a glance: tower disc · floor · residence, each with its own glyph and a tiny label
function HomeCode({ unit }: { unit: ShiratUnit }) {
 const lang = useLang(); const t = shiratText[lang];
 return <span className={s.code}>
  <b title={t.towerN(unit.b)}>{unit.b}</b>
  <span className={s.codePart} title={t.floorN(unit.f)}><Layers size={11} strokeWidth={1.6} aria-hidden /><em>{t.codeFloor}</em>{unit.f}</span>
  <i aria-hidden />
  <span className={s.codePart} title={unit.ph ? t.penthouse : t.residence}><House size={11} strokeWidth={1.6} aria-hidden /><em>{unit.ph ? 'PH' : t.codeHome}</em>{unit.u}</span>
 </span>;
}

// ---- the film: one big play button over the poster (a single tap starts it on phones, where a tap on a
// native <video> only reveals its controls), then the native controls take over
function FilmPlayer({ src, poster, label }: { src: string; poster: string; label: string }) {
 const ref = useRef<HTMLVideoElement>(null);
 const [started, setStarted] = useState(false);
 const [busy, setBusy] = useState(false);
 const start = () => { const v = ref.current; if (!v) return; setBusy(true); v.play().then(() => setStarted(true)).catch(() => { setStarted(true); }).finally(() => setBusy(false)); };
 return <>
  <video ref={ref} src={src} poster={poster} controls={started} playsInline preload="metadata" onPlay={() => setStarted(true)} />
  {!started && <button type="button" className={s.filmPlay} onClick={start} aria-label={label} data-busy={busy || undefined}>
   <span>{busy ? <i className={s.filmSpin} /> : <Play size={26} strokeWidth={1.6} fill="currentColor" aria-hidden />}</span>
  </button>}
 </>;
}

// ---- an image that shows a quiet shimmer while it loads, then fades in (stills are 1920 px WebP)
function FadeImg({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
 const ref = useRef<HTMLImageElement>(null);
 const [loaded, setLoaded] = useState(false);
 useEffect(() => { setLoaded(!!ref.current?.complete && !!ref.current.naturalWidth); }, [props.src]);
 return <>
  <img ref={ref} {...props} className={`${className ?? ''} ${s.fade}`} data-loaded={loaded || undefined}
   onLoad={e => { setLoaded(true); props.onLoad?.(e); }} onError={() => setLoaded(true)} />
  {!loaded && <span className={s.imgLoading} aria-hidden><i /></span>}
 </>;
}

// ---- About: every home. With media, its story and highlights beside an interior; without, its place in the tower beside the key plan.
function AboutView({ unit, media }: { unit: ShiratUnit; media?: HomeMedia }) {
 const lang = useLang(); const t = shiratText[lang]; const L = (l: { en: string; he: string }) => lang === 'he' ? l.he : l.en;
 const n = Object.keys(PLATES[plateKeyOf(unit)].units).length;
 const text = media ? L(media.about) : t.aboutGeneric(unit.b, unit.f, unit.u, unit.ph, n);
 const list = media ? media.highlights.map(L) : t.genericHighlights(unit.b, unit.f, n);
 return <div className={s.about} data-generic={media ? undefined : ''}>
  <div className={s.aboutText}>
   <p className={s.kicker}>{t.aboutKicker}</p>
   <p className={s.aboutLead}>{text}</p>
   <h4 className={s.aboutSub}>{t.highlightsTitle}</h4>
   <ul className={s.aboutList}>{list.map(x => <li key={x}>{x}</li>)}</ul>
  </div>
  <figure className={s.aboutFig}>
   {media ? <FadeImg src={`${homeBase(media.key)}/${media.images.find(i => i.id.startsWith('g-'))?.id ?? media.images[0].id}.webp`} alt="" />
    : <div className={s.aboutPlan}><KeyPlan unit={unit} hovered={null} onHover={() => {}} onPick={() => {}} /></div>}
  </figure>
 </div>;
}

// ---- the residence's media: film, gallery, plans, about (draft placeholders from the apartment pipeline)
function HomeView({ media, tab, onOpen }: { media: HomeMedia; tab: Tab; onOpen: (items: { src: string; label: string }[], i: number) => void }) {
 const lang = useLang(); const t = shiratText[lang]; const L = (l: { en: string; he: string }) => lang === 'he' ? l.he : l.en;
 const dir = homeBase(media.key);
 const [i, setI] = useState(0);
 const [plan, setPlan] = useState<'photo' | 'drawing'>('photo');
 const [ChevronLeft, ChevronRight] = lang === 'he' ? [ChevronR, ChevronL] : [ChevronL, ChevronR];
 const thumbs = useRef<HTMLDivElement>(null);
 useEffect(() => { thumbs.current?.querySelector('[data-on]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); }, [i]);
 const items = media.images.map(im => ({ src: `${dir}/${im.id}.webp`, label: L(im.label) }));
 const n = items.length;
 if (tab === 'film') return <div className={s.film}>
  <div className={s.filmFrame}>
   <FilmPlayer key={media.key} src={film(`${dir}/film.mp4`)} poster={`${dir}/g-entry.webp`} label={t.tabs.film} />
   {!media.final && <span className={s.badge}>{t.draft}</span>}
  </div>
  {!media.final && <p className={s.filmNote}>{t.filmNote}</p>}
 </div>;
 if (tab === 'images') return <div className={s.gallery}>
  <div className={s.galleryMain}>
   <FadeImg key={items[i].src} src={items[i].src} alt={items[i].label}
     onClick={() => onOpen(items, i)} draggable={false} />
   
   <button type="button" className={s.navBtn} data-side="prev" aria-label={t.prev} onClick={() => setI((i - 1 + n) % n)}><ChevronLeft size={18} strokeWidth={1.8} aria-hidden /></button>
   <button type="button" className={s.navBtn} data-side="next" aria-label={t.next} onClick={() => setI((i + 1) % n)}><ChevronRight size={18} strokeWidth={1.8} aria-hidden /></button>
   <button type="button" className={s.expand} aria-label={t.expand} title={t.expand} onClick={() => onOpen(items, i)}><Expand size={15} strokeWidth={1.8} aria-hidden /></button>
   <span className={s.caption}>{items[i].label}<small>{t.ofN(i + 1, n)}</small></span>
  </div>
  <div ref={thumbs} className={s.thumbs}>
   {media.images.map((im, k) => <button key={im.id} type="button" data-on={k === i || undefined} aria-label={L(im.label)} onClick={() => setI(k)}>
    <FadeImg src={`${dir}/${im.id}-t.webp`} alt="" loading="lazy" draggable={false} />
   </button>)}
  </div>
 </div>;
 if (tab === 'plan') {
  const src = `${dir}/${plan === 'photo' ? 'plan' : 'drawing'}.webp`;
  const label = plan === 'photo' ? t.planPhoto : t.planDrawing;
  return <div className={s.plan} data-kind={plan}>
   <FadeImg key={src} src={src} alt={label} onClick={() => onOpen([{ src, label }], 0)} draggable={false} />
   <div className={`${s.seg} ${s.planSeg}`} role="radiogroup" aria-label={t.tabs.plan}>
    {(['photo', 'drawing'] as const).map(v => <button key={v} type="button" role="radio" aria-checked={plan === v} className={s.segBtn} onClick={() => setPlan(v)}>
     <span>{v === 'photo' ? t.planPhoto : t.planDrawing}</span></button>)}
   </div>
   <button type="button" className={s.expand} aria-label={t.expand} title={t.expand} onClick={() => onOpen([{ src, label }], 0)}><Expand size={15} strokeWidth={1.8} aria-hidden /></button>
  </div>;
 }
 return null;
}

function Lightbox({ items, i: start, onClose }: { items: { src: string; label: string }[]; i: number; onClose: () => void }) {
 const lang = useLang(); const t = shiratText[lang];
 const [ChevronLeft, ChevronRight] = lang === 'he' ? [ChevronR, ChevronL] : [ChevronL, ChevronR];
 const [i, setI] = useState(start); const n = items.length;
 useEffect(() => {
  const k = (e: KeyboardEvent) => {
   if (e.key === 'Escape') onClose();
   const fwd = lang === 'he' ? 'ArrowLeft' : 'ArrowRight', back = lang === 'he' ? 'ArrowRight' : 'ArrowLeft';
   if (e.key === fwd) setI(v => (v + 1) % n); if (e.key === back) setI(v => (v - 1 + n) % n);
  };
  window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
 }, [n, onClose, lang]);
 return <motion.div className={s.lightbox} role="dialog" aria-modal="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={onClose}>
  <FadeImg key={items[i].src} src={items[i].src} alt={items[i].label} onClick={e => e.stopPropagation()} />
  
  <p className={s.lbCaption} onClick={e => e.stopPropagation()}>{items[i].label}{n > 1 && <small>{t.ofN(i + 1, n)}</small>}</p>
  {n > 1 && <>
   <button type="button" className={s.lbNav} data-side="prev" aria-label={t.prev} onClick={e => { e.stopPropagation(); setI((i - 1 + n) % n); }}><ChevronLeft size={22} strokeWidth={1.6} aria-hidden /></button>
   <button type="button" className={s.lbNav} data-side="next" aria-label={t.next} onClick={e => { e.stopPropagation(); setI((i + 1) % n); }}><ChevronRight size={22} strokeWidth={1.6} aria-hidden /></button>
  </>}
  <button type="button" className={`${s.close} ${s.lbClose}`} aria-label={t.close} onClick={onClose}><X size={18} strokeWidth={1.7} aria-hidden /></button>
 </motion.div>;
}

// ---- the floor's key plan: where this home sits on its floor (north up, the sea to the west); neighbours are clickable
function KeyPlan({ unit, hovered, onHover, onPick }: { unit: ShiratUnit; hovered: string | null; onHover: (id: string | null) => void; onPick: (id: string) => void }) {
 const lang = useLang(); const t = shiratText[lang];
 const plate = PLATES[plateKeyOf(unit)];
 const [x, y, w, h] = plate.bbox; const m = 2.2;
 const vb = `${x - m - 3.2} ${y - m} ${w + 2 * m + 3.2} ${h + 2 * m}`;
 return <div className={s.keyPlan}>
  <svg viewBox={vb} role="img" aria-label={t.keyPlan(unit.f)}>
   {plate.outline.map((p, i) => <polygon key={`o${i}`} points={p} className={s.kpOutline} />)}
   {plate.balconies.map((p, i) => <polygon key={`b${i}`} points={p} className={s.kpBalcony} />)}
   {Object.entries(plate.units).map(([u, d]) => {
    const id = `${unit.b.toLowerCase()}-f${pad(unit.f)}-${u}`;
    const on = u === unit.u; const ok = !!unitById(id);
    return <g key={u} className={s.kpHome} data-on={on || undefined} data-hover={id === hovered || undefined}
     onPointerEnter={ok ? () => onHover(id) : undefined} onPointerLeave={ok ? () => onHover(null) : undefined}
     onClick={ok && !on ? () => onPick(id) : undefined}>
     <title>{t.tipLine(unit.b, unit.f, u, unit.ph)}</title>
     {d.points.map((p, i) => <polygon key={i} points={p} />)}
     <text x={d.cx} y={d.cy}>{u}</text>
    </g>;
   })}
   {plate.core.map((p, i) => <polygon key={`c${i}`} points={p} className={s.kpCore} />)}
   <text x={x - m - 1.2} y={y + h / 2} className={s.kpSea} transform={`rotate(-90 ${x - m - 1.2} ${y + h / 2})`}>{t.sea}</text>
   <g transform={`translate(${x + w + m - 1.4} ${y + 0.4})`} className={s.kpNorth}><path d="M0,-1.8 L1,1.3 L0,0.6 L-1,1.3 Z" /><text y="3.6">N</text></g>
  </svg>
  <span className={s.kpLabel}><b>{t.towerN(unit.b)}</b>{t.floorN(unit.f)}</span>
 </div>;
}
