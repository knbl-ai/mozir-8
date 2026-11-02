'use client';
// Rua da Lapa, Porto: the building in 360° with every home selectable, then the project on scroll.
// Built from components/symbol/SymbolSite.tsx (one low building in a street instead of a tower; homes by floor and fração).
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { ArrowUpRight, Box, Building2, Check, ChevronLeft, ChevronRight, Church, Coffee, DoorOpen, Expand, Eye, EyeOff, Footprints, Hand, Images, Info, Layers, LayoutPanelLeft, Link2, Minus, Package, Paintbrush, Play, Plus, Search, Sun, TrainFront, Trees, TreePine, Warehouse, X } from 'lucide-react';
import LanguageSwitch from '@/components/LanguageSwitch';
import { useLang } from '@/lib/i18n';
import { useFrameSequence } from '@/components/building/useFrameSequence';
import ResidenceModel from '@/components/building/ResidenceModel';
import { film } from '@/components/landing/media';
import { FLOOR_ORDER, NORTH_DEG, ORBIT_URL, ORBIT_VIDEO, PLATES, SHOWCASE, SIDE, UNITS, floorLabel, floorsOf, mediaFor, project, unitById, type Floor, type HomeMedia, type L as LT, type LapaUnit, type Orbit, type OrbitSpot } from '@/content/projects/rua-da-lapa';
import { lapaText } from './strings';
import s from './lapa.module.css';

type Tab = 'plan' | 'film' | 'images' | 'model' | 'about';
const TABS: { value: Tab; icon: typeof Play }[] = [
 { value: 'plan', icon: LayoutPanelLeft }, { value: 'film', icon: Play }, { value: 'images', icon: Images }, { value: 'model', icon: Box }, { value: 'about', icon: Info },
];
const EASE = [0.22, 1, 0.36, 1] as const;
const SPEC_GROUPS = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]];
const SPEC_ICONS = [Paintbrush, DoorOpen, Sun, Package, Building2, Sun, Paintbrush, TreePine, Church, Coffee, TrainFront, Footprints];
const ZOOM_IN = 1.7;
const PHONE_SHIFT = -30;
const FRAME_MASK = 'radial-gradient(ellipse 70% 74% at 50% 50%, #000 62%, transparent 100%)';
const HOVER_MS = 70;
// the two houses' extent in the 1000×625 orbit frame (the camera circles 34 m out, so the house swings across the view)
const TOWERS = { x0: 300, x1: 700, y0: 80, y1: 560 };
const TILE_STILL = { entrance: 'entrance', staircase: 'staircase', landing: 'landing', garden: 'garden' } as const;

const polyArea = (pts: string) => {
 const p = pts.split(' ').map(q => q.split(',').map(Number));
 let a = 0;
 for (let i = 0; i < p.length; i++) { const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length]; a += x0 * y1 - x1 * y0; }
 return Math.abs(a / 2);
};
// bearing of the viewpoint seen from the building (orbit angle CCW from the plan's +X; the plan's +X points to 115°)
const bearingOf = (angle: number) => ((90 - angle - NORTH_DEG) % 360 + 360) % 360;
const DIRS = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
const dirOf = (bearing: number) => DIRS[Math.round(bearing / 45) % 8];
const T = ['T0', 'T1', 'T2'] as const;
const ringMode = (views: number): { video?: string; stride: number } => {
 const ua = navigator.userAgent;
 const ios = /iP(hone|ad|od)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
 const safari = /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg|FxiOS|Android/.test(ua);
 const force = new URLSearchParams(window.location.search).get('ring');
 const video = force ? force === 'video' : !(ios || safari);
 const src = window.location.hostname.endsWith('residence.tech') ? film(ORBIT_VIDEO) : ORBIT_VIDEO;
 return video ? { video: src, stride: views >= 300 ? 12 : 4 } : { stride: views >= 300 ? 3 : 1 };
};
const readDeepLink = () => { try { return new URLSearchParams(window.location.search).get('home'); } catch { return null; } };
const prod = (src: string) => process.env.NODE_ENV === 'development' ? src : film(src);

export default function LapaSite() {
 const lang = useLang();
 const t = lapaText[lang];
 const L = (l: LT) => lang === 'pt' ? l.pt : l.en;
 const [orbit, setOrbit] = useState<Orbit | null>(null);
 useEffect(() => { fetch(ORBIT_URL).then(r => r.json()).then(setOrbit).catch(() => setOrbit({ count: 0, width: 1000, height: 625, frames: [] })); }, []);
 const frames = useMemo(() => orbit?.frames ?? [], [orbit]);
 const [ring, setRing] = useState<{ video?: string; stride: number } | null>(null);
 useEffect(() => { if (orbit?.count) setRing(ringMode(orbit.count)); }, [orbit?.count]);
 const sources = useMemo(() => ring ? frames.map(f => f.src) : [], [frames, ring]);
 const engine = useFrameSequence(sources, 0, 1, { aspect: 625 / 1000, maxWidth: 2000, turnPerWidth: 260, inertia: 480, video: ring?.video, stride: ring?.stride ?? 1, onVideoFail: () => setRing({ stride: (orbit?.count ?? 0) >= 300 ? 3 : 1 }) });
 const engineRef = useRef(engine);
 engineRef.current = engine;

 const best = useMemo(() => {
  const m = new Map<string, { frame: number; area: number }>();
  frames.forEach((f, i) => {
   const per = new Map<string, number>();
   f.spots.forEach(sp => per.set(sp.id, (per.get(sp.id) ?? 0) + polyArea(sp.points)));
   per.forEach((a, id) => { const cur = m.get(id); if (!cur || a > cur.area) m.set(id, { frame: i, area: a }); });
  });
  return m;
 }, [frames]);

 // orbit spot ids are the fração letters in capitals
 const [selected, setSelected] = useState<string>(SHOWCASE);
 const [hovered, setHovered] = useState<string | null>(null);
 const [showAll, setShowAll] = useState(false);
 const [tab, setTab] = useState<Tab>('plan');
 const [lightbox, setLightbox] = useState<{ items: { src: string; label: string }[]; i: number } | null>(null);
 const [finder, setFinder] = useState(false);
 const [register, setRegister] = useState(false);
 const [zoom, setZoom] = useState(1);
 const [copied, setCopied] = useState(false);
 const [compact, setCompact] = useState(false);
 const [focus, setFocus] = useState(false);
 useEffect(() => {
  if (!focus) return;
  const k = (e: KeyboardEvent) => { if (e.key === 'Escape' && !document.querySelector('[role="dialog"]')) setFocus(false); };
  window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
 }, [focus]);
 const [tip, setTip] = useState<{ x: number; y: number; id: string } | null>(null);
 const [hintSeen, setHintSeen] = useState(true);
 const [touch, setTouch] = useState(false);
 useEffect(() => { try { setHintSeen(localStorage.getItem('lapa.hint') === '1'); setCompact(localStorage.getItem('lapa.compact') === '1'); } catch { /* private */ } setTouch(window.matchMedia('(hover: none)').matches); }, []);
 const toggleCompact = () => setCompact(v => { try { localStorage.setItem('lapa.compact', v ? '0' : '1'); } catch { /* private */ } return !v; });
 const dismissHint = () => { if (hintSeen) return; setHintSeen(true); try { localStorage.setItem('lapa.hint', '1'); } catch { /* private */ } };
 const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

 const unit = unitById(selected) ?? UNITS[0];
 const media = mediaFor(unit);
 const idx = UNITS.findIndex(x => x.id === unit.id);
 const spotOf = (id: string) => id.toUpperCase();

 // ---- stage geometry (as Symbol): the 16:10 frame covers the stage, its centre pulled beside the panel on wide screens
 const stageRef = useRef<HTMLDivElement>(null);
 const panelRef = useRef<HTMLElement>(null);
 const [box, setBox] = useState({ w: 1000, h: 625, left: 0, top: 0, scale: 1, rx0: 0, rx1: 100000, shift: 50, cx: 500 });
 useLayoutEffect(() => {
  const el = stageRef.current;
  if (!el) return;
  const fit = () => {
   if (document.querySelector('[data-focus]')) return;
   const W = el.clientWidth, H = el.clientHeight;
   const pw = W > 1100 ? (panelRef.current?.offsetWidth ?? 0) + 26 : 0;
   const region = W - pw;
   const top0 = W > 1100 ? 90 : 64, dockTop = W > 1100 ? 80 : 110;
   const shift = W <= 640 ? PHONE_SHIFT : 0;
   const cover = Math.max(region / 1000, (H + Math.max(0, -shift)) / 625);
   const sc = Math.max(cover, Math.min(region * 0.9 / (TOWERS.x1 - TOWERS.x0), (H - dockTop - top0) / (TOWERS.y1 - TOWERS.y0)));
   const availH = (TOWERS.y1 - TOWERS.y0) * sc;
   const w = 1000 * sc, h = 625 * sc;
   const cx = region / 2, cy = top0 + availH / 2;
   const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
   setBox({ w, h, left: clamp(cx - (TOWERS.x0 + TOWERS.x1) / 2 * sc, region - w, 0), top: clamp(cy - (TOWERS.y0 + TOWERS.y1) / 2 * sc, H - h - shift, 0), scale: sc, rx0: 0, rx1: region, shift, cx });
  };
  fit();
  const ro = new ResizeObserver(fit); ro.observe(el); if (panelRef.current) ro.observe(panelRef.current);
  return () => ro.disconnect();
 }, [lang]);

 const frame = frames[engine.displayed];
 // the house swings across the picture as the camera circles: centre each view on its homes (smoothed over ±12 views)
 const houseX = useMemo(() => {
  const raw = frames.map(f => {
   const cs = f.spots.filter(sp => sp.c).map(sp => sp.c![0]);
   return cs.length ? (Math.min(...cs) + Math.max(...cs)) / 2 : 500;
  });
  const n = raw.length, k = 12;
  return raw.map((_, i) => { let sum = 0; for (let d = -k; d <= k; d++) sum += raw[(i + d + n) % n]; return sum / (2 * k + 1); });
 }, [frames]);
 const frameLeft = (() => {
  const x = houseX[engine.displayed] ?? 500;
  return Math.min(box.rx0, Math.max(box.rx1 - box.w, box.cx - x / 1000 * box.w));
 })();
 const spotsOf = useCallback((id: string) => frame?.spots.filter(sp => sp.id === spotOf(id)) ?? [], [frame]);
 const centreOf = (id: string) => spotsOf(id).find(sp => sp.c)?.c;
 const turning = engine.moving;

 const select = (id: string, { turn = true } = {}) => {
  setSelected(id);
  const nu = unitById(id); if (nu) setTab(mediaFor(nu) ? 'film' : 'plan');   // the film first wherever a home has one
  const b = best.get(spotOf(id));
  if (!turn || !b) return;
  const here = frames[engine.settled]?.spots.filter(sp => sp.id === spotOf(id)).reduce((a, sp) => a + polyArea(sp.points), 0) ?? 0;
  if (here < b.area * 0.45 || engine.moving) engine.rotateTo(b.frame);
 };
 const step = (d: number) => { const x = UNITS[(idx + d + UNITS.length) % UNITS.length]; select(x.id); };

 const linkRead = useRef(false);
 useEffect(() => {
  if (!frames.length || !engine.firstReady || linkRead.current) return;
  linkRead.current = true;
  const id = readDeepLink()?.toLowerCase();
  if (id && unitById(id)) { select(id); return; }
  select(SHOWCASE, { turn: false }); setTab('film');     // no link: Fração I on its film, the building in its street view
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [frames.length, engine.firstReady]);
 useEffect(() => {
  if (!linkRead.current) return;
  const timer = setTimeout(() => { try { const url = new URL(window.location.href); url.searchParams.set('home', selected); window.history.replaceState(window.history.state, '', url); } catch { /* sandboxed */ } }, 350);
  return () => clearTimeout(timer);
 }, [selected]);
 useEffect(() => { document.title = `Rua da Lapa · Porto`; }, [t]);

 const press = useRef<{ x: number; moved: boolean } | null>(null);
 const zoneAt = (x: number, y: number) => {
  const el = document.elementFromPoint(x, y)?.closest('[data-home]');
  return el && stageRef.current?.contains(el) ? el.getAttribute('data-home')!.toLowerCase() : null;
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
  const id = sp.id.toLowerCase();
  if (id === selected) return s.spotSelected;
  if (id === hovered) return s.spotHover;
  return showAll || finder ? s.spotShown : s.spotIdle;
 };

 const bearing = frame ? bearingOf(frame.angle) : 115;
 const selCentre = centreOf(selected);
 const pinFlip = (() => {
  if (!selCentre) return false;
  const x = frameLeft + selCentre[0] / 1000 * box.w;
  return x + 250 > box.rx1;
 })();
 const tipUnit = tip ? unitById(tip.id) : undefined;
 const copyLink = async () => {
  try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* blocked */ }
 };

 const stills = project.stills;
 const status = unit.id === 'i' ? t.produced : media ? t.sharedMedia : t.planOnly;
 const side = SIDE[unit.side];
 const planItem = { src: unit.plan, label: `${t.planSheet} · ${t.homeTitle(unit.letter)}` };

 return <MotionConfig reducedMotion="user"><div className={s.page} data-compact={(compact && !focus) || undefined} data-focus={focus || undefined}>
  <header className={s.bar}>
   <a href="#project" className={s.logo} aria-label="Rua da Lapa">
    <img src={project.wordmark} alt="Rua da Lapa · Porto" width={240} height={44} />
   </a>
   <div className={s.wordmark} aria-hidden />
   <div className={s.barEnd}>
    <LanguageSwitch id="lapa-lang" compact tone="glass" />
    <div className={s.navFind}>
     <button type="button" className={s.findBtn} onClick={() => { setFocus(false); setFinder(v => !v); }} aria-pressed={finder} aria-label={t.find} title={t.find}>
      <Search size={14} strokeWidth={1.7} aria-hidden /><span>{t.find}</span>
     </button>
     <div className={s.stepper}>
      <button type="button" aria-label={t.prev} title={t.prev} onClick={() => step(-1)}><ChevronLeft size={15} strokeWidth={1.6} aria-hidden /></button>
      <span className={s.stepCount} aria-live="polite" title={t.tipLine(floorsOf(unit), unit.letter)}><HomeCode unit={unit} /></span>
      <button type="button" aria-label={t.next} title={t.next} onClick={() => step(1)}><ChevronRight size={15} strokeWidth={1.6} aria-hidden /></button>
     </div>
    </div>
   </div>
  </header>

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
    <div className={s.frameBox} style={{ width: box.w, height: box.h, left: frameLeft, top: box.top, transform: `translateY(${box.shift}px)`, WebkitMaskImage: FRAME_MASK, maskImage: FRAME_MASK }}>
     <div className={s.zoomLayer} style={{ transform: `scale(${zoom})`, transformOrigin: origin }}>
      {frames[0] && !engine.firstReady && <img className={s.poster} src={frames[0].src} alt="" draggable={false} />}
      <canvas ref={engine.canvasRef} className={s.canvas} role="img" aria-label={t.stage} />
      {frame && !engine.failed && <svg viewBox="0 0 1000 625" className={s.spots} aria-hidden={turning || undefined}>
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
      {t.tipLine(floorsOf(tipUnit), tipUnit.letter)} · {t.typeLine(T[tipUnit.t], tipUnit.t + 1)}
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

   {/* ---------------------------------------------------------------- the chosen home */}
   <motion.aside ref={panelRef} className={s.panel} data-ui aria-label={t.homeTitle(unit.letter)} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE }}>
    <button type="button" className={s.edgeToggle} onClick={toggleCompact} aria-pressed={compact} aria-label={compact ? t.widen : t.shrink} title={compact ? t.widen : t.shrink}>
     {compact ? <ChevronLeft size={16} strokeWidth={1.6} aria-hidden /> : <ChevronRight size={16} strokeWidth={1.6} aria-hidden />}
    </button>
    <div className={s.panelHead}>
     <AnimatePresence mode="popLayout" initial={false}>
      <motion.div key={unit.id} className={s.headTitle} initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }} transition={{ duration: 0.38, ease: EASE }}>
       <div className={s.eyebrowRow}><span className={s.status} data-preview={media ? '' : undefined}><i />{status}</span></div>
       <h1 className={s.title}>{t.homeTitle(unit.letter)}</h1>
       <p className={s.typeLine}><b>{t.typeLine(T[unit.t], unit.t + 1)}</b> · {L(side.aspect)}</p>
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
     <div><dt>{t.facts.rooms}</dt><dd data-on="">{T[unit.t]}</dd></div>
     <div><dt>{t.facts.interior}</dt><dd data-on="">{lang === 'pt' ? String(unit.area).replace('.', ',') : unit.area}<small>{t.sqm}</small></dd></div>
     <div><dt>{t.facts.outdoor}</dt><dd data-on={unit.outdoor ? '' : undefined} data-text="">{unit.outdoor ? L(unit.outdoor) : unit.side === 'street' ? (lang === 'pt' ? 'Varandins' : 'Juliet balconies') : t.none}</dd></div>
     <div><dt>{t.floor}</dt><dd data-on="">{floorsOf(unit)}</dd></div>
     <div><dt>{t.facts.aspect}</dt><dd data-on="" data-text="">{L(side.aspect)}</dd></div>
     <div><dt>{t.facts.price}</dt><dd data-text="">{t.onRequest}</dd></div>
    </dl>
    <div className={s.tabs} role="tablist" aria-label={t.homeTitle(unit.letter)}>
     {TABS.map(({ value, icon: Icon }) => <button key={value} type="button" role="tab" aria-selected={tab === value} className={s.tab} onClick={() => setTab(value)}>
      {tab === value && <motion.span layoutId="lapa-tab" className={s.tabThumb} transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
      <Icon size={15} strokeWidth={1.7} aria-hidden /><span>{t.tabs[value]}</span>
     </button>)}
    </div>
    <div className={s.media} role="tabpanel" data-dark={media && tab === 'film' ? '' : undefined}>
     <AnimatePresence mode="wait" initial={false}>
      {tab === 'about'
       ? <motion.div key={`about-${unit.id}`} className={s.mediaFill} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}><AboutView unit={unit} /></motion.div>
       : tab === 'model' && media
       ? <motion.div key={`model-${media.key}`} className={s.mediaFill} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}><div className={s.model3d}>
        <ResidenceModel src={prod(media.hq.glb)} poster={media.hq.poster} defaultOrbit={media.hq.orbit} outdoorOrbit={media.hq.outdoorOrbit} stage="paper" />
       </div></motion.div>
       : media && (tab === 'film' || tab === 'images')
       ? <motion.div key={`${tab}-${media.key}`} className={s.mediaFill} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
        <HomeView media={media} tab={tab} onOpen={(items, i) => setLightbox({ items, i })} />
       </motion.div>
       : tab === 'plan'
       ? <motion.div key={`plan-${unit.id}`} className={s.mediaFill} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
        <div className={s.plan} data-kind="sheet">
         <FadeImg src={unit.plan} alt={t.planSheet} onClick={() => setLightbox({ items: [planItem], i: 0 })} draggable={false} />
         <span className={s.sheetNote}>{t.planSheet} · {t.floorN(floorsOf(unit))}</span>
         <button type="button" className={s.expand} aria-label={t.expand} title={t.expand} onClick={() => setLightbox({ items: [planItem], i: 0 })}><Expand size={15} strokeWidth={1.8} aria-hidden /></button>
        </div>
       </motion.div>
       : <motion.div key={tab} className={s.empty} initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
        <span className={s.emptyIcon}>{(() => { const Icon = TABS.find(x => x.value === tab)!.icon; return <Icon size={22} strokeWidth={1.3} aria-hidden />; })()}</span>
        <strong>{t.empty[tab][0]}</strong><span>{t.empty[tab][1]}</span>
        <div className={s.tryRow}><small>{t.tryHome}</small>
         {['i', 'm'].map(k => <button key={k} type="button" onClick={() => select(k)}>{t.homeTitle(k.toUpperCase())}</button>)}
        </div>
       </motion.div>}
     </AnimatePresence>
    </div>
   </motion.aside>
  </section>

  {/* ---------------------------------------------------------------- the project */}
  <section id="project" className={s.story}>
   <motion.div className={s.storyHead} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease: EASE }}>
    <p className={s.kicker}>{t.story.kicker}</p>
    <h2 className={s.display}>{t.story.title[0]} <em>{t.story.title[1]}</em></h2>
    <p className={s.lead}>{t.story.lead}</p>
   </motion.div>
   <div className={s.figures}>
    {[project.figures.homes, project.figures.houses, project.figures.floors, project.figures.plot].map((v, i) =>
     <motion.div key={i} className={s.figure} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}>
      <strong>{v}</strong><span>{t.story.figures[i][0]}</span><small>{t.story.figures[i][1]}</small>
     </motion.div>)}
   </div>
   <motion.figure className={s.wide} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1.1, ease: EASE }}
    onClick={() => setLightbox({ items: [{ src: stills.street, label: 'Rua da Lapa' }, { src: stills.front, label: 'Rua da Lapa' }], i: 0 })}>
    <FadeImg src={stills.street} alt="Rua da Lapa" loading="lazy" />
   </motion.figure>

   <div className={s.buildings}>
    <motion.div className={s.lobbyHead} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.9, ease: EASE }}>
     <p className={s.kicker}>{t.story.housesKicker}</p>
     <h3 className={s.display2}>{t.story.housesTitle}</h3>
    </motion.div>
    <div className={s.buildingsGrid}>
     {t.story.houses.map((b, i) => {
      const items = [{ src: stills.ornate, label: t.story.houses[0].name }, { src: stills.eave, label: t.story.houses[1].name }];
      return <motion.figure key={b.name} className={s.buildingCard} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}>
       <div className={s.tile} onClick={() => setLightbox({ items, i })}><FadeImg src={items[i].src} alt={b.name} loading="lazy" /></div>
       <figcaption><h3>{b.name}</h3><p><b>{b.line}</b>{b.body}</p></figcaption>
      </motion.figure>;
     })}
    </div>
   </div>
  </section>

  <section id="restoration" className={s.amenities}>
   <div className={s.split}>
    <div>
     <p className={s.kicker}>{t.story.specKicker}</p>
     <h2 className={s.display2}>{t.story.specTitle}</h2>
    </div>
    <div><p className={s.lead}>{t.story.specLead}</p></div>
   </div>
   <div className={s.amenityGroups}>
    {SPEC_GROUPS.map((g, gi) => <motion.section key={gi} className={s.amenityGroup} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.8, ease: EASE, delay: gi * 0.08 }}>
     <h3>{t.story.specGroups[gi]}</h3>
     <ul>{g.map(i => { const Icon = SPEC_ICONS[i] ?? Trees; return <li key={i}><span className={s.amenityIcon}><Icon size={16} strokeWidth={1.3} aria-hidden /></span><span className={s.amenityName}>{t.story.spec[i]}</span></li>; })}</ul>
    </motion.section>)}
   </div>
   <motion.div className={s.lobbyHead} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.9, ease: EASE }}>
    <p className={s.kicker}>{t.story.tilesKicker}</p>
   </motion.div>
   <div className={s.tiles}>
    {(['entrance', 'staircase', 'landing', 'garden'] as const).map((k, i) => {
     const items = (['entrance', 'staircase', 'landing', 'garden'] as const).map(x => ({ src: stills[TILE_STILL[x]], label: t.story.tiles[x] }));
     return <motion.figure key={k} className={s.tile} data-k={k} onClick={() => setLightbox({ items, i })} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.9, ease: EASE, delay: i * 0.06 }}>
      <FadeImg src={stills[TILE_STILL[k]]} alt={t.story.tiles[k]} loading="lazy" />
      <figcaption><span>{t.story.tiles[k]}</span><small>{t.studyRender}</small></figcaption>
     </motion.figure>;
    })}
   </div>
  </section>

  <section id="location" className={s.location}>
   <FadeImg className={s.locationImg} src={stills.lapa} alt="" loading="lazy" />
   <div className={s.locationShade} aria-hidden />
   <motion.div className={s.locationCopy} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE }}>
    <p className={s.kicker}>{t.story.locationKicker}</p>
    <h2 className={s.display2}>{t.story.locationTitle}</h2>
    <p className={s.lead}>{t.story.locationLead}</p>
    <a className={s.footLink} href="https://www.google.com/maps/search/?api=1&query=Rua%20da%20Lapa%2052%2C%20Porto" target="_blank" rel="noreferrer">Google Maps<ArrowUpRight size={14} strokeWidth={1.8} aria-hidden /></a>
   </motion.div>
  </section>

  <footer className={s.footer}>
   <img src={project.wordmark} alt="Rua da Lapa" width={240} height={44} style={{ filter: 'brightness(0) invert(1)' }} />
   <p className={s.brandLine}>{t.story.brandLine}</p>
   <a className={s.footLink} href="https://residence.tech" target="_blank" rel="noreferrer">residence.tech<ArrowUpRight size={14} strokeWidth={1.8} aria-hidden /></a>
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
     <p className={s.eyebrow}>{t.tipLine(floorsOf(unit), unit.letter)}</p>
     <h3 className={s.display3}>{t.registerTitle}</h3>
     <p className={s.dialogBody}>{t.registerBody}</p>
     <a className={s.primary} href={`mailto:${project.contactEmail}?subject=${encodeURIComponent(`Rua da Lapa · ${t.homeTitle(unit.letter)}`)}`}>{t.registerCta}<ArrowUpRight size={15} strokeWidth={1.8} aria-hidden /></a>
     <p className={s.dialogBody} style={{ userSelect: 'all' }}>{project.contactEmail}</p>
    </motion.div>
   </motion.div>}
  </AnimatePresence>
 </div></MotionConfig>;
}

// ---- every home: floors top down, the homes of a floor in a row
function Finder({ selected, hovered, onHover, onSelect, onClose }: {
 selected: string; hovered: string | null; onHover: (id: string | null) => void; onSelect: (id: string) => void; onClose: () => void;
}) {
 const lang = useLang(); const t = lapaText[lang];
 useEffect(() => {
  const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
  window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
 }, [onClose]);
 const rows = FLOOR_ORDER.filter(f => f !== '4').map(f => ({ f, us: UNITS.filter(x => x.floors[0] === f) }));
 return <motion.aside className={s.finder} aria-label={t.finderTitle} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }}>
  <div className={s.finderHead}>
   <div><p className={s.eyebrow}>{t.homesCount(UNITS.length)}</p><h3 className={s.display3}>{t.finderTitle}</h3></div>
   <button type="button" className={s.close} aria-label={t.close} onClick={onClose}><X size={16} strokeWidth={1.7} aria-hidden /></button>
  </div>
  <div className={s.finderBar}><span className={s.legend}><i />{t.produced}</span></div>
  <div className={s.floors} onPointerLeave={() => onHover(null)}>
   <section className={s.floorGroup}>
    {rows.map(({ f, us }) => <div key={f} className={s.floorRow}>
     <span className={s.floorNo}>{floorLabel(f)}</span>
     {us.map(x => <button key={x.id} type="button" className={s.unitChip} data-on={x.id === selected || undefined} data-hover={x.id === hovered || undefined}
      aria-label={t.tipLine(floorsOf(x), x.letter)} aria-pressed={x.id === selected} onPointerEnter={() => onHover(x.id)} onFocus={() => onHover(x.id)} onClick={() => onSelect(x.id)}>
      <span>{x.letter} · {T[x.t]}</span>{mediaFor(x) && <i aria-hidden />}
     </button>)}
    </div>)}
   </section>
  </div>
 </motion.aside>;
}

function HomeCode({ unit }: { unit: LapaUnit }) {
 const lang = useLang(); const t = lapaText[lang];
 return <span className={s.code}>
  <span className={s.codePart} title={t.floorN(floorsOf(unit))}><Layers size={11} strokeWidth={1.6} aria-hidden /><em>{t.codeFloor}</em>{floorsOf(unit)}</span>
  <i aria-hidden />
  <span className={s.codePart} title={t.homeTitle(unit.letter)}><Warehouse size={11} strokeWidth={1.6} aria-hidden /><em>{t.codeHome}</em>{unit.letter}</span>
 </span>;
}

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

function HomeView({ media, tab, onOpen }: { media: HomeMedia; tab: Tab; onOpen: (items: { src: string; label: string }[], i: number) => void }) {
 const lang = useLang(); const t = lapaText[lang]; const L = (l: LT) => lang === 'pt' ? l.pt : l.en;
 const [i, setI] = useState(0);
 const thumbs = useRef<HTMLDivElement>(null);
 useEffect(() => { thumbs.current?.querySelector('[data-on]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); }, [i]);
 const items = media.images.map(im => ({ src: im.src, label: L(im.label) }));
 const n = items.length;
 if (tab === 'film') return <div className={s.film}><FilmPlayer key={media.key} src={prod(media.film)} poster={media.poster} label={t.playFilm} /></div>;
 return <div className={s.gallery}>
  <div className={s.galleryMain}>
   <FadeImg key={items[i].src} src={items[i].src} alt={items[i].label} onClick={() => onOpen(items, i)} draggable={false} />
   <button type="button" className={s.navBtn} data-side="prev" aria-label={t.photoPrev} onClick={() => setI((i - 1 + n) % n)}><ChevronLeft size={18} strokeWidth={1.8} aria-hidden /></button>
   <button type="button" className={s.navBtn} data-side="next" aria-label={t.photoNext} onClick={() => setI((i + 1) % n)}><ChevronRight size={18} strokeWidth={1.8} aria-hidden /></button>
   <button type="button" className={s.expand} aria-label={t.expand} title={t.expand} onClick={() => onOpen(items, i)}><Expand size={15} strokeWidth={1.8} aria-hidden /></button>
   <span className={s.caption}>{items[i].label}<small>{t.ofN(i + 1, n)}</small></span>
  </div>
  <div ref={thumbs} className={s.thumbs}>
   {items.map((im, k) => <button key={im.src} type="button" data-on={k === i || undefined} aria-label={im.label} onClick={() => setI(k)}>
    <FadeImg src={im.src} alt="" loading="lazy" draggable={false} />
   </button>)}
  </div>
 </div>;
}

function AboutView({ unit }: { unit: LapaUnit }) {
 const lang = useLang(); const t = lapaText[lang]; const L = (l: LT) => lang === 'pt' ? l.pt : l.en;
 const side = SIDE[unit.side];
 const text = t.about(t.kinds[unit.t], floorsOf(unit), t.houses[unit.house], L(side.view), unit.floors.length > 1);
 const list = [t.hlArea(unit.area), unit.outdoor ? `${L(unit.outdoor)}${unit.outdoorArea ? ` · ${unit.outdoorArea} m²` : ''}` : '', unit.storage ? t.hlStorage(unit.storage) : '',
  unit.id === 'i' ? t.hlOwn : mediaFor(unit) ? t.hlShared : ''].filter(Boolean);
 return <div className={s.about}>
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
 const lang = useLang(); const t = lapaText[lang];
 const [i, setI] = useState(start); const n = items.length;
 useEffect(() => {
  const k = (e: KeyboardEvent) => {
   if (e.key === 'Escape') onClose();
   if (e.key === 'ArrowRight') setI(v => (v + 1) % n); if (e.key === 'ArrowLeft') setI(v => (v - 1 + n) % n);
  };
  window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
 }, [n, onClose]);
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

// ---- the home's floor (the duplexes: their entry floor), every home on it clickable; north arrow from the OSM fit
function KeyPlan({ unit, hovered, onHover, onPick }: { unit: LapaUnit; hovered: string | null; onHover: (id: string | null) => void; onPick: (id: string) => void }) {
 const lang = useLang(); const t = lapaText[lang];
 const f: Floor = unit.floors[0];
 const P = PLATES.floors[f];
 const [x, y, w, h] = P.bbox; const m = 1.2;
 const vb = `${x - m} ${y - m} ${w + 2 * m + 3.2} ${h + 2 * m}`;
 return <div className={s.keyPlan}>
  <svg viewBox={vb} role="img" aria-label={t.keyPlan(floorLabel(f))}>
   <polygon points={P.outline} className={s.kpOutline} />
   {Object.entries(P.units).map(([id, d]) => {
    const on = id === unit.id; const other = unitById(id)!;
    return <g key={id} className={s.kpHome} data-on={on || undefined} data-hover={id === hovered || undefined}
     onPointerEnter={() => onHover(id)} onPointerLeave={() => onHover(null)} onClick={!on ? () => onPick(id) : undefined}>
     <title>{t.tipLine(floorsOf(other), other.letter)}</title>
     <polygon points={d.points} />
     <text x={d.cx} y={d.cy}>{other.letter}</text>
    </g>;
   })}
   <g transform={`translate(${x + w + m + 0.6} ${y + 1.8}) rotate(${PLATES.north_deg})`} className={s.kpNorth}><path d="M0,-1.8 L1,1.3 L0,0.6 L-1,1.3 Z" /><text y="3.6">N</text></g>
  </svg>
  <span className={s.kpLabel}><b>LAPA</b>{t.floorN(floorLabel(f))}</span>
 </div>;
}
