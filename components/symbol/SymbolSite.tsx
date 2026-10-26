'use client';
// SYMBOL, Givat Shmuel (Levinstein): the tower in 360° with every home selectable, then the project on scroll.
// Built from components/shirat/ShiratSite.tsx (one tower instead of two, six homes a floor, the sales types).
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { ArrowUpRight, BedDouble, Box, Building2, Check, ChevronLeft as ChevronL, ChevronRight as ChevronR, Expand, Eye, EyeOff, Gem, Hammer, Hand, House, Images, Info, Layers, LayoutPanelLeft, Link2, Minus, Play, Plus, Search, ShieldPlus, Sofa, SquareParking, Store, Sun, TramFront, Trees, TreePine, Users, X } from 'lucide-react';
import LanguageSwitch from '@/components/LanguageSwitch';
import { useLang } from '@/lib/i18n';
import { useFrameSequence } from '@/components/building/useFrameSequence';
import { NORTH_DEG, ORBIT_URL, ORBIT_VIDEO, PLATE, SHOWCASE, TYPES, UNITS, homeBase, mediaFor, project, typeOf, unitById, type HomeMedia, type Orbit, type OrbitSpot, type SymbolUnit } from '@/content/projects/symbol';
import { symbolText } from './strings';
import ResidenceModel from '@/components/building/ResidenceModel';
import { film } from '@/components/landing/media';   // the ring straight from the bucket in production, like the films
import s from './symbol.module.css';

type Tab = 'plan' | 'film' | 'images' | 'model' | 'about';
const TABS: { value: Tab; icon: typeof Play }[] = [
 { value: 'plan', icon: LayoutPanelLeft }, { value: 'film', icon: Play }, { value: 'images', icon: Images }, { value: 'model', icon: Box }, { value: 'about', icon: Info },
];
const EASE = [0.22, 1, 0.36, 1] as const;
// the home · the building · the neighbourhood (indexes into strings.story.amenities)
const AMENITY_GROUPS = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]];
const AMENITY_ICONS = [BedDouble, ShieldPlus, Gem, Hammer, Sofa, Users, SquareParking, Sun, TreePine, Trees, TramFront, Store];
const ZOOM_IN = 1.9;
const PHONE_SHIFT = -30;   // px the tower moves on a phone (negative = up, clear of the view pills and the bar; desktop: 0)
// the picture fades out at its edges, so no hard line shows where it meets the backdrop
const FRAME_MASK = 'radial-gradient(ellipse 66% 70% at 50% 50%, #000 60%, transparent 100%)';
const HOVER_MS = 70;
// the complex's extent in the 1000×625 orbit frame over all 360 views (homes span x 294–707, y 84–538; plus the crown and podium)
const TOWERS = { x0: 286, x1: 714, y0: 58, y1: 585 };
const PAIR_PULL = 0.6;    // 0 = the tower's homes centred, 1 = the plot's centre
const COLS = ['01', '02', '03', '04', '05', '06'];
// the stills under the four tiles (the garden camera sits inside the podium: not used)
const TILE_STILL = { shops: 'shops', street: 'street', boutique: 'mirkami-w', crown: 'crown' } as const;

const polyArea = (pts: string) => {
 const p = pts.split(' ').map(q => q.split(',').map(Number));
 let a = 0;
 for (let i = 0; i < p.length; i++) { const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length]; a += x0 * y1 - x1 * y0; }
 return Math.abs(a / 2);
};
// Camera bearing (where the viewer stands, seen from the tower): the orbit angle is CCW from the model's +X, whose
// north is NORTH_DEG off sheet-up (frame 0 = bearing 300, the developer's render 2).
const bearingOf = (angle: number) => ((90 - angle - NORTH_DEG) % 360 + 360) % 360;
const DIRS = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
const dirOf = (bearing: number) => DIRS[Math.round(bearing / 45) % 8];
const pad = (n: number) => String(n).padStart(2, '0');
const ringMode = (views: number): { video?: string; stride: number } => {
 const ua = navigator.userAgent;
 const ios = /iP(hone|ad|od)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
 const safari = /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg|FxiOS|Android/.test(ua);
 const force = new URLSearchParams(window.location.search).get('ring');     // ?ring=video | pictures, to compare on a device
 const video = force ? force === 'video' : !(ios || safari);
 const src = window.location.hostname.endsWith('residence.tech') ? film(ORBIT_VIDEO) : ORBIT_VIDEO;
 return video ? { video: src, stride: views >= 300 ? 12 : 4 } : { stride: views >= 300 ? 3 : 1 };
};
const readDeepLink = () => { try { return new URLSearchParams(window.location.search).get('home'); } catch { return null; } };

export default function SymbolSite() {
 const lang = useLang();
 const [ChevronLeft, ChevronRight] = lang === 'he' ? [ChevronR, ChevronL] : [ChevronL, ChevronR];
 const t = symbolText[lang];
 const L = (l: { en: string; he: string }) => lang === 'he' ? l.he : l.en;
 const [orbit, setOrbit] = useState<Orbit | null>(null);
 useEffect(() => { fetch(ORBIT_URL).then(r => r.json()).then(setOrbit).catch(() => setOrbit({ count: 0, width: 1000, height: 625, frames: [] })); }, []);
 const frames = orbit?.frames ?? [];
 const [ring, setRing] = useState<{ video?: string; stride: number } | null>(null);
 useEffect(() => { if (orbit?.count) setRing(ringMode(orbit.count)); }, [orbit?.count]);
 const sources = useMemo(() => ring ? frames.map(f => f.src) : [], [frames, ring]);
 const engine = useFrameSequence(sources, 0, 1, { aspect: 625 / 1000, maxWidth: 2000, turnPerWidth: 260, inertia: 480, video: ring?.video, stride: ring?.stride ?? 1, onVideoFail: () => setRing({ stride: (orbit?.count ?? 0) >= 300 ? 3 : 1 }) });
 const engineRef = useRef(engine);
 engineRef.current = engine;

 // where each home shows best (largest outline over the views), so choosing it from a list turns to it
 const best = useMemo(() => {
  const m = new Map<string, { frame: number; area: number }>();
  frames.forEach((f, i) => {
   const per = new Map<string, number>();
   f.spots.forEach(sp => per.set(sp.id, (per.get(sp.id) ?? 0) + polyArea(sp.points)));
   per.forEach((a, id) => { const cur = m.get(id); if (!cur || a > cur.area) m.set(id, { frame: i, area: a }); });
  });
  return m;
 }, [frames]);

 const [selected, setSelected] = useState<string>(SHOWCASE.c1);
 const [hovered, setHovered] = useState<string | null>(null);
 const [showAll, setShowAll] = useState(false);
 const [tab, setTab] = useState<Tab>('plan');
 const [lightbox, setLightbox] = useState<{ items: { src: string; label: string }[]; i: number } | null>(null);
 const [finder, setFinder] = useState(false);
 const [register, setRegister] = useState(false);
 const [zoom, setZoom] = useState(1);
 const [copied, setCopied] = useState(false);
 const [compact, setCompact] = useState(false);     // compact card = more stage for the tower
 const [focus, setFocus] = useState(false);         // Step inside: the home gets the whole screen (Esc returns)
 useEffect(() => {
  if (!focus) return;
  const k = (e: KeyboardEvent) => { if (e.key === 'Escape' && !document.querySelector('[role="dialog"]')) setFocus(false); };
  window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
 }, [focus]);
 const [tip, setTip] = useState<{ x: number; y: number; id: string } | null>(null);
 const [hintSeen, setHintSeen] = useState(true);
 const [touch, setTouch] = useState(false);
 useEffect(() => { try { setHintSeen(localStorage.getItem('symbol.hint') === '1'); setCompact(localStorage.getItem('symbol.compact') === '1'); } catch { /* private */ } setTouch(window.matchMedia('(hover: none)').matches); }, []);
 const toggleCompact = () => setCompact(v => { try { localStorage.setItem('symbol.compact', v ? '0' : '1'); } catch { /* private */ } return !v; });
 const dismissHint = () => { if (hintSeen) return; setHintSeen(true); try { localStorage.setItem('symbol.hint', '1'); } catch { /* private */ } };
 const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

 const unit = unitById(selected) ?? UNITS[0];
 const info = typeOf(unit);
 const media = mediaFor(unit);   // a home with pipeline media (C1): film + gallery
 const ordered = useMemo(() => [...UNITS].sort((a, b) => a.f - b.f || a.u.localeCompare(b.u)), []);
 const idx = ordered.findIndex(u => u.id === unit.id);

 // ---- stage geometry: the 16:10 frame covers the stage, its centre pulled beside the panel on wide screens
 const stageRef = useRef<HTMLDivElement>(null);
 const panelRef = useRef<HTMLElement>(null);
 const [box, setBox] = useState({ w: 1000, h: 625, left: 0, top: 0, scale: 1, rx0: 0, rx1: 100000, shift: 50, cx: 500 });
 useLayoutEffect(() => {
  const el = stageRef.current;
  if (!el) return;
  const fit = () => {
   if (document.querySelector('[data-focus]')) return;     // stepped inside: the stage is hidden, keep its frame
   const W = el.clientWidth, H = el.clientHeight;
   const pw = W > 1100 ? (panelRef.current?.offsetWidth ?? 0) + 26 : 0;
   const region = W - pw;
   const top0 = W > 1100 ? 120 : 64, dockTop = W > 1100 ? 80 : 110;
   const shift = W <= 640 ? PHONE_SHIFT : 0;
   const cover = Math.max(region / 1000, (H + Math.max(0, -shift)) / 625);
   const sc = Math.max(cover, Math.min(region * 0.9 / (TOWERS.x1 - TOWERS.x0), (H - dockTop - top0) / (TOWERS.y1 - TOWERS.y0)));
   const availH = (TOWERS.y1 - TOWERS.y0) * sc;
   const w = 1000 * sc, h = 625 * sc;
   const rtl = document.documentElement.dir === 'rtl';
   const cx = rtl ? pw + region / 2 : region / 2, cy = top0 + availH / 2;
   const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
   const rx0 = rtl ? pw : 0, rx1 = rtl ? W : region;
   setBox({ w, h, left: clamp(cx - (TOWERS.x0 + TOWERS.x1) / 2 * sc, rx1 - w, rx0), top: clamp(cy - (TOWERS.y0 + TOWERS.y1) / 2 * sc, H - h - shift, 0), scale: sc, rx0, rx1, shift, cx });
  };
  fit();
  const ro = new ResizeObserver(fit); ro.observe(el); if (panelRef.current) ro.observe(panelRef.current);
  return () => ro.disconnect();
 }, [lang]);

 const frame = frames[engine.displayed];
 // The orbit turns about the plot's centre, so the tower swings across the picture (the boutique building beside it):
 // each view is placed so the tower's homes sit in the middle of the free area, within the frame's cover limits.
 const towerX = useMemo(() => {
  const raw = frames.map(f => {
   const cs = f.spots.filter(sp => sp.c).map(sp => sp.c![0]);
   return cs.length ? (Math.min(...cs) + Math.max(...cs)) / 2 : 500;
  });
  // homes come into view and leave at the edges: smooth over ±12 views (around the ring) so the frame glides
  const n = raw.length, k = 12;
  const smooth = raw.map((_, i) => { let sum = 0; for (let d = -k; d <= k; d++) sum += raw[(i + d + n) % n]; return sum / (2 * k + 1); });
  // the boutique building sits on the far side of the plot's centre (the picture's centre): pull the aim toward it
  // so the pair is framed, not the tower alone (the tower alone left the boutique cut by the panel)
  return smooth.map(x => x + (500 - x) * PAIR_PULL);
 }, [frames]);
 const frameLeft = (() => {
  const x = towerX[engine.displayed] ?? (TOWERS.x0 + TOWERS.x1) / 2;
  return Math.min(box.rx0, Math.max(box.rx1 - box.w, box.cx - x / 1000 * box.w));
 })();
 const spotsOf = useCallback((id: string) => frame?.spots.filter(sp => sp.id === id) ?? [], [frame]);
 const centreOf = (id: string) => spotsOf(id).find(sp => sp.c)?.c;
 const turning = engine.moving;

 const select = (id: string, { turn = true } = {}) => {
  setSelected(id);
  const u = unitById(id);
  if (u && !typeOf(u)?.sheet && tab === 'plan') setTab('about');
  const b = best.get(id);
  if (!turn || !b) return;
  const here = frames[engine.settled]?.spots.filter(sp => sp.id === id).reduce((a, sp) => a + polyArea(sp.points), 0) ?? 0;
  if (here < b.area * 0.45 || engine.moving) engine.rotateTo(b.frame);
 };
 const step = (d: number) => { const u = ordered[(idx + d + ordered.length) % ordered.length]; select(u.id); };

 // ?home=T_F20_02 opens on that home
 const linkRead = useRef(false);
 // after the first view is drawn: a turn asked for before the ring is in is lost
 useEffect(() => {
  if (!frames.length || !engine.firstReady || linkRead.current) return;
  linkRead.current = true;
  const id = readDeepLink();
  if (id && unitById(id)) { select(id); return; }
  select(SHOWCASE.c1, { turn: false }); setTab('film');     // no link: C1 on floor 20 on its film, the tower kept in its front view (the developer's render angle)
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [frames.length, engine.firstReady]);
 useEffect(() => {
  if (!linkRead.current) return;
  const timer = setTimeout(() => { try { const url = new URL(window.location.href); url.searchParams.set('home', selected); window.history.replaceState(window.history.state, '', url); } catch { /* sandboxed */ } }, 350);
  return () => clearTimeout(timer);
 }, [selected]);
 useEffect(() => { document.title = `SYMBOL · ${t.place} · Levinstein`; }, [t]);

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
   if (e.ctrlKey || engineRef.current.isDragging() || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
   e.preventDefault(); dismissHint(); engineRef.current.nudgePixels(e.deltaX);
  };
  el.addEventListener('wheel', wheel, { passive: false });
  return () => el.removeEventListener('wheel', wheel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [frames.length, hintSeen]);

 const origin = (() => {
  const c = centreOf(selected);
  return c ? `${(c[0] / 10).toFixed(2)}% ${(c[1] / 6.25).toFixed(2)}%` : '50% 50%';
 })();

 const spotClass = (sp: OrbitSpot) => {
  if (sp.id === selected) return s.spotSelected;
  if (sp.id === hovered) return s.spotHover;
  return showAll || finder ? s.spotShown : s.spotIdle;
 };

 const bearing = frame ? bearingOf(frame.angle) : 300;
 const selCentre = centreOf(selected);
 const pinFlip = (() => {
  if (!selCentre) return false;
  const x = frameLeft + selCentre[0] / 1000 * box.w, room = 250;
  return x + room > box.rx1;
 })();
 const tipUnit = tip ? unitById(tip.id) : undefined;

 const copyLink = async () => {
  try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* blocked */ }
 };

 const stills = project.stills;
 const status = unit.crown ? t.comingSoon : info?.sheet ? t.fromSheet : t.keyPlanOnly;

 return <MotionConfig reducedMotion="user"><div className={s.page} data-compact={(compact && !focus) || undefined} data-focus={focus || undefined}>
  {/* ---------------------------------------------------------------- top bar */}
  <header className={s.bar}>
   <a href={project.developerUrl} target="_blank" rel="noreferrer" className={s.logo} aria-label="Levinstein">
    <img src={project.logoDark} alt="Levinstein Group" width={440} height={162} />
   </a>
   <div className={s.wordmark} aria-label="SYMBOL">
    <img className={s.wordmarkImg} src={project.wordmarkDark} alt="SYMBOL" width={112} height={56} />
   </div>
   <div className={s.barEnd}>
    <LanguageSwitch id="symbol-lang" compact tone="glass" />
    <div className={s.navFind}>
     <button type="button" className={s.findBtn} onClick={() => { setFocus(false); setFinder(v => !v); }} aria-pressed={finder} aria-label={t.find} title={t.find}>
      <Search size={14} strokeWidth={1.7} aria-hidden /><span>{t.find}</span>
     </button>
     <div className={s.stepper}>
      <button type="button" aria-label={t.prev} title={t.prev} onClick={() => step(-1)}><ChevronLeft size={15} strokeWidth={1.6} aria-hidden /></button>
      <span className={s.stepCount} aria-live="polite" title={t.tipLine(unit.f, unit.apt)}><HomeCode unit={unit} /></span>
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
    <div className={s.skyFade} aria-hidden style={{ background: frames[engine.settled]?.sky ?? '#e6e9ec' }} />
    <div className={s.frameBox} style={{ width: box.w, height: box.h, left: frameLeft, top: box.top, transform: `translateY(${box.shift}px)`, WebkitMaskImage: FRAME_MASK, maskImage: FRAME_MASK }}>
     <div className={s.zoomLayer} style={{ transform: `scale(${zoom})`, transformOrigin: origin }}>
      {frames[0] && !engine.firstReady && <img className={s.poster} src={frames[0].src} alt="" draggable={false} />}
      <canvas ref={engine.canvasRef} className={s.canvas} role="img" aria-label={t.stage} />
      {frame && !engine.failed && <svg viewBox="0 0 1000 625" className={s.spots} aria-hidden={turning || undefined}>
       <defs><filter id="symbol-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="b" /><feFlood floodColor="#cec2b2" floodOpacity="0.9" />
        <feComposite in2="b" operator="in" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
       </filter></defs>
       {frame.spots.map((sp, i) => <polygon key={`${sp.id}-${i}`} data-home={sp.id} points={sp.points} className={spotClass(sp)} vectorEffect="non-scaling-stroke" />)}
      </svg>}
      <AnimatePresence>
       {selCentre && !turning && <motion.div key={`${selected}-${engine.displayed}`} className={s.pin} data-flip={pinFlip || undefined} style={{ left: `${selCentre[0] / 10}%`, top: `${selCentre[1] / 6.25}%` }}
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
        <span className={s.pinDot} /><span className={s.pinTag} style={{ transform: `scale(${1 / zoom})` }}><HomeCode unit={unit} /></span>
       </motion.div>}
      </AnimatePresence>
     </div>
    </div>
    <div className={s.vignette} aria-hidden />

    <AnimatePresence>
     {tip && tipUnit && tip.id !== selected && !turning && <motion.div key="tip" className={s.tip} data-flip={tip.x + 300 > box.rx1 || undefined} style={{ left: tip.x, top: tip.y }} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
      {t.tipLine(tipUnit.f, tipUnit.apt)}{typeOf(tipUnit)?.rooms ? ` · ${t.typeLine(typeOf(tipUnit)!.code, typeOf(tipUnit)!.rooms)}` : ''}
     </motion.div>}
    </AnimatePresence>

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

    <div className={s.dock} data-ui>
     <button type="button" className={s.dockIcon} aria-label={t.turnLeft} onClick={() => { dismissHint(); engine.step(Math.max(1, Math.round(frames.length / 24))); }}><ChevronLeft size={18} strokeWidth={1.7} aria-hidden /></button>
     <div className={s.compass} aria-live="polite">
      <span className={s.compassText}><small>{t.viewFrom}</small><strong>{t.dirName[dirOf(bearing)]}</strong></span>
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
   <motion.aside ref={panelRef} className={s.panel} data-ui aria-label={t.homeTitle(unit.apt, unit.f)} initial={{ opacity: 0, x: lang === 'he' ? -16 : 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE }}>
    <button type="button" className={s.edgeToggle} onClick={toggleCompact} aria-pressed={compact} aria-label={compact ? t.widen : t.shrink} title={compact ? t.widen : t.shrink}>
     {(compact !== (lang === 'he')) ? <ChevronL size={16} strokeWidth={1.6} aria-hidden /> : <ChevronR size={16} strokeWidth={1.6} aria-hidden />}
    </button>
    <div className={s.panelHead}>
     <AnimatePresence mode="popLayout" initial={false}>
      <motion.div key={unit.id} className={s.headTitle} initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }} transition={{ duration: 0.38, ease: EASE }}>
       <div className={s.eyebrowRow}>
        <span className={s.status} data-preview={info?.sheet ? '' : undefined} title={info?.sheet ? t.sameLayout(info.code) : undefined}>
         <i />{status}{info?.sheet && <Info size={12} strokeWidth={1.8} aria-hidden />}
        </span>
       </div>
       <h1 className={s.title}>{t.homeTitle(unit.apt, unit.f)}</h1>
       {info && <p className={s.typeLine}><b>{t.typeLine(info.code, info.rooms)}</b> · {L(info.aspect)}</p>}
      </motion.div>
     </AnimatePresence>
     <KeyPlan unit={unit} hovered={hovered} onHover={setHovered} onPick={id => select(id)} />
     <div className={s.headActions}>
      <div className={s.actRow}>
       <button type="button" className={s.secondary} onClick={copyLink} aria-label={t.share} title={t.share}>{copied ? <Check size={15} strokeWidth={1.8} aria-hidden /> : <Link2 size={15} strokeWidth={1.6} aria-hidden />}</button>
       <button type="button" className={s.stepBtn} aria-pressed={focus} aria-label={focus ? t.back : t.step} onClick={() => { setFinder(false); setFocus(v => !v); }} title={focus ? t.backTitle : t.stepTitle}>
        {focus ? <Building2 size={15} strokeWidth={1.6} aria-hidden /> : <Eye size={15} strokeWidth={1.6} aria-hidden />}<span>{focus ? t.back : t.step}</span>
       </button>
       <button type="button" className={s.primary} onClick={() => setRegister(true)}><span>{t.register}</span></button>
      </div>
     </div>
    </div>
    <dl className={s.facts}>
     <div><dt>{t.facts.rooms}</dt><dd data-on={info?.rooms ? '' : undefined}>{info?.rooms ?? '—'}</dd></div>
     <div><dt>{t.facts.interior}</dt><dd data-on={info?.interior ? '' : undefined}>{info?.interior ? <>{t.approx}{info.interior}<small>{t.sqm}</small></> : '—'}</dd></div>
     <div><dt>{t.facts.balcony}</dt><dd data-on={info?.balcony ? '' : undefined}>{info?.balcony ? <>{t.approx}{info.balcony}<small>{t.sqm}</small></> : '—'}</dd></div>
     <div><dt>{t.floor}</dt><dd data-on="">{unit.f}</dd></div>
     <div><dt>{t.facts.aspect}</dt><dd data-on={info ? '' : undefined} data-text="">{info ? L(info.aspect) : '—'}</dd></div>
     <div><dt>{t.facts.price}</dt><dd>—</dd></div>
    </dl>
    <div className={s.tabs} role="tablist" aria-label={t.homeTitle(unit.apt, unit.f)}>
     {TABS.map(({ value, icon: Icon }) => <button key={value} type="button" role="tab" aria-selected={tab === value} className={s.tab} onClick={() => setTab(value)}>
      {tab === value && <motion.span layoutId="symbol-tab" className={s.tabThumb} transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
      <Icon size={15} strokeWidth={1.7} aria-hidden /><span>{t.tabs[value]}</span>
     </button>)}
    </div>
    <div className={s.media} role="tabpanel" data-dark={media && tab === 'film' ? '' : undefined}>
     <AnimatePresence mode="wait" initial={false}>
      {tab === 'about'
       ? <motion.div key={`about-${unit.id}`} className={s.mediaFill} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}><AboutView unit={unit} /></motion.div>
       : tab === 'model' && media?.hq
       ? <motion.div key={`model-${media.key}`} className={s.mediaFill} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}><div className={s.model3d}>
        <ResidenceModel src={`${homeBase(media)}/${media.hq.glb}`} poster={`${homeBase(media)}/${media.hq.poster}`} defaultOrbit={media.hq.orbit} outdoorOrbit={media.hq.outdoorOrbit} stage="paper" />
       </div></motion.div>
       : media && (tab === 'film' || tab === 'images')
       ? <motion.div key={`${tab}-${media.key}`} className={s.mediaFill} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
        <HomeView media={media} tab={tab} code={info?.code ?? ''} onOpen={(items, i) => setLightbox({ items, i })} />
       </motion.div>
       : tab === 'plan' && info?.sheet
       ? <motion.div key={`plan-${info.code}`} className={s.mediaFill} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
        <div className={s.plan} data-kind="sheet">
         <FadeImg src={info.sheet} alt={t.planSheet} onClick={() => setLightbox({ items: [{ src: info.sheet!, label: `${t.planSheet} · ${info.code}` }], i: 0 })} draggable={false} />
         <span className={s.sheetNote}>{t.planSheet} · {t.sameLayout(info.code)}</span>
         <button type="button" className={s.expand} aria-label={t.expand} title={t.expand} onClick={() => setLightbox({ items: [{ src: info.sheet!, label: `${t.planSheet} · ${info.code}` }], i: 0 })}><Expand size={15} strokeWidth={1.8} aria-hidden /></button>
        </div>
       </motion.div>
       : <motion.div key={tab} className={s.empty} initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
        <span className={s.emptyIcon}>{(() => { const Icon = TABS.find(x => x.value === tab)!.icon; return <Icon size={22} strokeWidth={1.3} aria-hidden />; })()}</span>
        <strong>{t.empty[tab][0]}</strong><span>{t.empty[tab][1]}</span>
        {!info?.sheet && <div className={s.tryRow}><small>{t.tryHome}</small>
         {(['c1', 'd1', 'e1'] as const).map(k => { const ty = TYPES[k.toUpperCase() as 'C1']; return <button key={k} type="button" onClick={() => { select(SHOWCASE[k]); setTab('plan'); }}>{t.tryType(ty.code, ty.rooms!)}</button>; })}
        </div>}
       </motion.div>}
     </AnimatePresence>
    </div>
   </motion.aside>
  </section>

  {/* ---------------------------------------------------------------- the project */}
  <section id="project" className={s.story}>
   <motion.div className={s.storyHead} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease: EASE }}>
    <p className={s.kicker}>{t.story.kicker}</p>
    <h2 className={s.display} data-one-line="">{t.story.title[0]} <em>{t.story.title[1]}</em></h2>
    <p className={s.lead}>{t.story.lead}</p>
   </motion.div>
   <div className={s.figures}>
    {[project.figures.towerFloors, project.figures.boutiqueFloors, project.figures.perFloor, project.figures.plot].map((v, i) =>
     <motion.div key={i} className={s.figure} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}>
      <strong>{v.toLocaleString('en-US')}</strong><span>{t.story.figures[i][0]}</span><small>{t.story.figures[i][1]}</small>
     </motion.div>)}
   </div>
   {/* the presentation film; straight from the bucket in production (Vercel's CDN caches partial Range responses) */}
   <motion.figure className={`${s.wide} ${s.wideFilm}`} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1.1, ease: EASE }}>
    <FilmPlayer src={process.env.NODE_ENV === 'development' ? project.film.src : film(project.film.src)} poster={project.film.poster} label={t.playFilm} />
   </motion.figure>

   <div className={s.buildings}>
    <motion.div className={s.lobbyHead} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.9, ease: EASE }}>
     <p className={s.kicker}>{t.story.buildingsKicker}</p>
     <h3 className={s.display2}>{t.story.buildingsTitle}</h3>
    </motion.div>
    <div className={s.buildingsGrid}>
     {t.story.buildings.map((b, i) => {
      const items = [{ src: stills.facade, label: t.story.buildings[0].name }, { src: stills.mirkami, label: t.story.buildings[1].name }];
      return <motion.figure key={b.name} className={s.buildingCard} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}>
       <div className={s.tile} onClick={() => setLightbox({ items, i })}><FadeImg src={items[i].src} alt={b.name} loading="lazy" /></div>
       <figcaption><h3>{b.name}</h3><p><b>{b.line}</b>{b.body}</p></figcaption>
      </motion.figure>;
     })}
    </div>
   </div>
  </section>

  <section id="amenities" className={s.amenities}>
   <div className={s.split}>
    <div>
     <p className={s.kicker}>{t.story.amenitiesKicker}</p>
     <h2 className={s.display2}>{t.story.amenitiesTitle}</h2>
    </div>
    <div><p className={s.lead}>{t.story.amenitiesLead}</p></div>
   </div>
   <div className={s.amenityGroups}>
    {AMENITY_GROUPS.map((g, gi) => <motion.section key={gi} className={s.amenityGroup} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.8, ease: EASE, delay: gi * 0.08 }}>
     <h3>{t.story.amenityGroups[gi]}</h3>
     <ul>{g.map(i => { const Icon = AMENITY_ICONS[i] ?? Trees; return <li key={i}><span className={s.amenityIcon}><Icon size={16} strokeWidth={1.3} aria-hidden /></span><span className={s.amenityName}>{t.story.amenities[i]}</span></li>; })}</ul>
    </motion.section>)}
   </div>
   <div className={s.tiles}>
    {(['shops', 'street', 'boutique', 'crown'] as const).map((k, i) => {
     const items = (['shops', 'street', 'boutique', 'crown'] as const).map(x => ({ src: stills[TILE_STILL[x]], label: t.story.tiles[x] }));
     return <motion.figure key={k} className={s.tile} data-k={k} onClick={() => setLightbox({ items, i })} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.9, ease: EASE, delay: i * 0.06 }}>
      <FadeImg src={stills[TILE_STILL[k]]} alt={t.story.tiles[k]} loading="lazy" />
      <figcaption><span>{t.story.tiles[k]}</span><small>{t.studyRender}</small></figcaption>
     </motion.figure>;
    })}
   </div>
  </section>

  <section id="location" className={s.location}>
   <FadeImg className={s.locationImg} src={stills.top} alt="" loading="lazy" />
   <div className={s.locationShade} aria-hidden />
   <motion.div className={s.locationCopy} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE }}>
    <p className={s.kicker}>{t.story.locationKicker}</p>
    <h2 className={s.display2}>{t.story.locationTitle}</h2>
    <p className={s.lead}>{t.story.locationLead}</p>
   </motion.div>
  </section>

  <footer className={s.footer}>
   <img src={project.logoWhite} alt="Levinstein Group" width={440} height={162} />
   <p className={s.brandLine}>{t.story.brandLine}</p>
   <a className={s.footLink} href={project.developerUrl} target="_blank" rel="noreferrer">{t.story.developer}<ArrowUpRight size={14} strokeWidth={1.8} aria-hidden /></a>
   <a className={s.footLink} href={project.projectUrl} target="_blank" rel="noreferrer">{t.story.projectSite}<ArrowUpRight size={14} strokeWidth={1.8} aria-hidden /></a>
   <p className={s.disclaimer}>{t.story.disclaimer}</p>
  </footer>

  <AnimatePresence>{lightbox && <Lightbox key="lb" {...lightbox} onClose={() => setLightbox(null)} />}</AnimatePresence>

  <AnimatePresence>
   {finder && <Finder key="finder" selected={selected} hovered={hovered} onHover={setHovered}
    onSelect={id => { select(id); if (window.innerWidth < 900) setFinder(false); }} onClose={() => setFinder(false)} />}
  </AnimatePresence>

  <AnimatePresence>
   {register && <motion.div key="reg" className={s.scrim} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRegister(false)}>
    <motion.div className={s.dialog} role="dialog" aria-modal="true" aria-label={t.registerTitle} onClick={e => e.stopPropagation()}
     initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.45, ease: EASE }}>
     <button type="button" className={s.close} aria-label={t.close} onClick={() => setRegister(false)}><X size={18} strokeWidth={1.7} aria-hidden /></button>
     <p className={s.eyebrow}>{t.tipLine(unit.f, unit.apt)}</p>
     <h3 className={s.display3}>{t.registerTitle}</h3>
     <p className={s.dialogBody}>{t.registerBody}</p>
     <a className={s.primary} href={project.projectUrl} target="_blank" rel="noreferrer">{t.registerCta}<ArrowUpRight size={15} strokeWidth={1.8} aria-hidden /></a>
    </motion.div>
   </motion.div>}
  </AnimatePresence>
 </div></MotionConfig>;
}

// ---- every residence: floors top down (sky floors · upper · lower), the six homes of a floor in columns in plate order
function Finder({ selected, hovered, onHover, onSelect, onClose }: {
 selected: string; hovered: string | null; onHover: (id: string | null) => void; onSelect: (id: string) => void; onClose: () => void;
}) {
 const lang = useLang(); const t = symbolText[lang];
 const groups = useMemo(() => {
  const m = new Map<number, SymbolUnit[]>();
  UNITS.forEach(u => (m.get(u.f) ?? m.set(u.f, []).get(u.f)!).push(u));
  const rows = [...m.entries()].sort((a, b) => b[0] - a[0]).map(([f, us]) => ({ f, us: us.sort((a, b) => a.u.localeCompare(b.u)) }));
  return [
   { key: 'sky', label: t.groupSky, range: '21–24', rows: rows.filter(r => r.f > 20) },
   { key: 'hi', label: t.groupHigh, range: '11–20', rows: rows.filter(r => r.f <= 20 && r.f > 10) },
   { key: 'lo', label: t.groupLow, range: '2–10', rows: rows.filter(r => r.f <= 10) },
  ];
 }, [t]);
 useEffect(() => {
  const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
  window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
 }, [onClose]);
 const listRef = useRef<HTMLDivElement>(null);
 useEffect(() => { listRef.current?.querySelector('[data-on]')?.scrollIntoView({ block: 'center' }); }, []);
 return <motion.aside className={s.finder} aria-label={t.finderTitle} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }}>
  <div className={s.finderHead}>
   <div><p className={s.eyebrow}>{t.residencesCount(UNITS.filter(u => !u.crown).length)}</p><h3 className={s.display3}>{t.finderTitle}</h3></div>
   <button type="button" className={s.close} aria-label={t.close} onClick={onClose}><X size={16} strokeWidth={1.7} aria-hidden /></button>
  </div>
  <div className={s.finderBar}><span className={s.legend}><i />{t.legendSheet}</span></div>
  <div className={s.colHead} aria-hidden><span>{t.floor}</span>{COLS.map(c => <span key={c}>{PLATE.units[c] ? TYPES[PLATE.units[c].type].code : c}</span>)}</div>
  <div ref={listRef} className={s.floors} onPointerLeave={() => onHover(null)}>
   {groups.map(g => g.rows.length > 0 && <section key={g.key} className={s.floorGroup} data-g={g.key}>
    <p className={s.groupLabel}><span>{g.label}</span><small>{g.range}</small></p>
    {g.rows.map(({ f, us }) => <div key={f} className={s.floorRow} data-ph={g.key === 'sky' || undefined}>
     <span className={s.floorNo}>{f}</span>
     {(g.key === 'sky' ? us : COLS.map(c => us.find(u => u.u === c))).map((u, i) => u
      ? <button key={u.id} type="button" className={s.unitChip} data-on={u.id === selected || undefined} data-hover={u.id === hovered || undefined}
        style={g.key === 'sky' ? { gridColumn: '2 / span 6' } : undefined}
        aria-label={t.tipLine(u.f, u.apt)} aria-pressed={u.id === selected} onPointerEnter={() => onHover(u.id)} onFocus={() => onHover(u.id)} onClick={() => onSelect(u.id)}>
        <span>{u.apt ?? t.skyFloor}</span>{typeOf(u)?.sheet && <i aria-hidden />}
       </button>
      : <span key={i} className={s.unitNone} aria-hidden />)}
    </div>)}
   </section>)}
  </div>
 </motion.aside>;
}

// ---- a home's address at a glance: floor · residence number (sky floors: the floor only)
function HomeCode({ unit }: { unit: SymbolUnit }) {
 const lang = useLang(); const t = symbolText[lang];
 return <span className={s.code}>
  <span className={s.codePart} title={t.floorN(unit.f)}><Layers size={11} strokeWidth={1.6} aria-hidden /><em>{t.codeFloor}</em>{unit.f}</span>
  <i aria-hidden />
  <span className={s.codePart} title={t.residence}><House size={11} strokeWidth={1.6} aria-hidden /><em>{unit.apt ? t.codeHome : t.codeSky}</em>{unit.apt ?? '·'}</span>
 </span>;
}

// ---- an image that shows a quiet shimmer while it loads, then fades in
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

// ---- the film: one big play button over the poster (a single tap starts it on phones, where a tap on a
// native <video> only reveals its controls), then the native controls take over (from ShiratSite)
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

// ---- a home's pipeline media: the 1080p walkthrough film and the photoreal gallery (from ShiratSite's HomeView)
function HomeView({ media, tab, code, onOpen }: { media: HomeMedia; tab: Tab; code: string; onOpen: (items: { src: string; label: string }[], i: number) => void }) {
 const lang = useLang(); const t = symbolText[lang]; const L = (l: { en: string; he: string }) => lang === 'he' ? l.he : l.en;
 const dir = homeBase(media);
 const [i, setI] = useState(0);
 const [ChevronLeft, ChevronRight] = lang === 'he' ? [ChevronR, ChevronL] : [ChevronL, ChevronR];
 const thumbs = useRef<HTMLDivElement>(null);
 useEffect(() => { thumbs.current?.querySelector('[data-on]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); }, [i]);
 const items = media.images.map(im => ({ src: `${dir}/${im.id}.webp`, label: L(im.label) }));
 const n = items.length;
 if (tab === 'film') return <div className={s.film}>
  <FilmPlayer key={media.key} src={film(`${dir}/film.mp4`)} poster={`${dir}/film-poster.jpg`} label={t.playFilm} />
 </div>;
 return <div className={s.gallery}>
  <div className={s.galleryMain}>
   <FadeImg key={items[i].src} src={items[i].src} alt={items[i].label} onClick={() => onOpen(items, i)} draggable={false} />
   <button type="button" className={s.navBtn} data-side="prev" aria-label={t.photoPrev} onClick={() => setI((i - 1 + n) % n)}><ChevronLeft size={18} strokeWidth={1.8} aria-hidden /></button>
   <button type="button" className={s.navBtn} data-side="next" aria-label={t.photoNext} onClick={() => setI((i + 1) % n)}><ChevronRight size={18} strokeWidth={1.8} aria-hidden /></button>
   <button type="button" className={s.expand} aria-label={t.expand} title={t.expand} onClick={() => onOpen(items, i)}><Expand size={15} strokeWidth={1.8} aria-hidden /></button>
   <span className={s.caption}>{items[i].label}<small>{t.ofN(i + 1, n)}</small></span>
  </div>
  <div ref={thumbs} className={s.thumbs}>
   {media.images.map((im, k) => <button key={im.id} type="button" data-on={k === i || undefined} aria-label={L(im.label)} onClick={() => setI(k)}>
    <FadeImg src={`${dir}/${im.id}-t.webp`} alt="" loading="lazy" draggable={false} />
   </button>)}
  </div>
 </div>;
}

// ---- About: every home. A sales type has its story and highlights; the rest their place in the tower beside the key plan.
function AboutView({ unit }: { unit: SymbolUnit }) {
 const lang = useLang(); const t = symbolText[lang]; const L = (l: { en: string; he: string }) => lang === 'he' ? l.he : l.en;
 const info = typeOf(unit);
 const text = info?.about ? L(info.about) : t.aboutGeneric(unit.f, unit.apt, info ? L(info.aspect) : '');
 const list = info?.highlights ? info.highlights.map(L) : t.genericHighlights(unit.f);
 return <div className={s.about} data-generic={info?.about ? undefined : ''}>
  <div className={s.aboutText}>
   <p className={s.kicker}>{t.aboutKicker}</p>
   <p className={s.aboutLead}>{text}</p>
   <h4 className={s.aboutSub}>{t.highlightsTitle}</h4>
   <ul className={s.aboutList}>{list.map(x => <li key={x}>{x}</li>)}</ul>
  </div>
  <figure className={s.aboutFig}><div className={s.aboutPlan}><KeyPlan unit={unit} hovered={null} onHover={() => {}} onPick={() => {}} /></div></figure>
 </div>;
}

function Lightbox({ items, i: start, onClose }: { items: { src: string; label: string }[]; i: number; onClose: () => void }) {
 const lang = useLang(); const t = symbolText[lang];
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

// ---- the typical floor's key plan: where this home sits on its floor (sheet-up, the north arrow from the site sheet);
// the neighbours are clickable. A sky floor lights the whole floor.
function KeyPlan({ unit, hovered, onHover, onPick }: { unit: SymbolUnit; hovered: string | null; onHover: (id: string | null) => void; onPick: (id: string) => void }) {
 const lang = useLang(); const t = symbolText[lang];
 const [x, y, w, h] = PLATE.bbox; const m = 2.2;
 const vb = `${x - m} ${y - m} ${w + 2 * m + 3.2} ${h + 2 * m}`;
 return <div className={s.keyPlan}>
  <svg viewBox={vb} role="img" aria-label={t.keyPlan(unit.f)}>
   {PLATE.outline.map((p, i) => <polygon key={`o${i}`} points={p} className={s.kpOutline} />)}
   {PLATE.balconies.map((p, i) => <polygon key={`b${i}`} points={p} className={s.kpBalcony} />)}
   {Object.entries(PLATE.units).map(([u, d]) => {
    const id = `T_F${pad(unit.f)}_${u}`;
    const on = unit.crown || u === unit.u; const ok = !unit.crown && !!unitById(id);
    return <g key={u} className={s.kpHome} data-on={on || undefined} data-hover={id === hovered || undefined}
     onPointerEnter={ok ? () => onHover(id) : undefined} onPointerLeave={ok ? () => onHover(null) : undefined}
     onClick={ok && !on ? () => onPick(id) : undefined}>
     <title>{ok ? `${t.tipLine(unit.f, unitById(id)?.apt ?? null)} · ${TYPES[d.type].code}` : t.floorN(unit.f)}</title>
     {d.points.map((p, i) => <polygon key={i} points={p} />)}
     {!unit.crown && <text x={d.cx} y={d.cy}>{unitById(id)?.apt ?? TYPES[d.type].code}</text>}
    </g>;
   })}
   {PLATE.core.map((p, i) => <polygon key={`c${i}`} points={p} className={s.kpCore} />)}
   <g transform={`translate(${x + w + m + 0.4} ${y + 1.6}) rotate(${PLATE.north_deg})`} className={s.kpNorth}><path d="M0,-1.8 L1,1.3 L0,0.6 L-1,1.3 Z" /><text y="3.6">N</text></g>
  </svg>
  <span className={s.kpLabel}><b>SYMBOL</b>{t.floorN(unit.f)}</span>
 </div>;
}
