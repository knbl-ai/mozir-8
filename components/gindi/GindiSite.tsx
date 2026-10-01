'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Box, ChevronLeft, ChevronRight, Eye, EyeOff, Hand, Map as MapIcon, MapPin } from 'lucide-react';
import LanguageSwitch from '@/components/LanguageSwitch';
import { useLang } from '@/lib/i18n';
import { BUILDINGS, TYPES, UNITS, orbitUrl, project, unitById, type Orbit, type Unit } from '@/content/projects/gindi';
import { useOrbit, FRAME_W, FRAME_H } from './useOrbit';
import { gindiText } from './strings';
import { type Filter, matches } from './FloorMatrix';
import HomePanel, { Plate, type HomeTab } from './HomePanel';
import HomePicker from './HomePicker';
import ContactDialog from './ContactDialog';
import ComplexInfo from './ComplexInfo';
import s from './gindi.module.css';

type View = 'complex' | number;
const COUNT = 60;
const EASE = 'cubic-bezier(.62,.02,.2,1)';
const ZOOM_MS = 1500;
const ringKey = (v: View) => v === 'complex' ? 'complex' : `b${v}`;

const area = (pts: string) => {
 const p = pts.split(' ').map(q => q.split(',').map(Number));
 let a = 0; for (let i = 0; i < p.length; i++) { const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length]; a += x0 * y1 - x1 * y0; }
 return Math.abs(a / 2);
};
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const nextFrame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

// The circular brand line from gindi.co.il, set on a slowly turning ring.
function DreamRing() {
 return <svg className={s.ring} viewBox="0 0 200 200" aria-hidden>
  <defs><path id="gindi-ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
  <text><textPath href="#gindi-ring" startOffset="0" textLength="486" lengthAdjust="spacing">DREAM WE BUILD YOUR FAMILY · DREAM WE BUILD YOUR FAMILY ·</textPath></text>
 </svg>;
}

export default function GindiSite() {
 const lang = useLang();
 const t = gindiText[lang];
 const engine = useOrbit(COUNT, 0);
 const [orbits, setOrbits] = useState<Record<string, Orbit>>({});
 const orbitsRef = useRef(orbits); orbitsRef.current = orbits;
 const [view, setView] = useState<View>('complex');
 const [layers, setLayers] = useState<View[]>(['complex']);          // mounted rings (two while zooming)
 const [busy, setBusy] = useState(false);
 const busyRef = useRef(false);
 const [hoverTower, setHoverTower] = useState<number | null>(null);
 const [hoverUnit, setHoverUnit] = useState<string | null>(null);
 const [selected, setSelected] = useState<string | null>(null);
 const [filter, setFilter] = useState<Filter>('all');
 const [onlyAvailable, setOnlyAvailable] = useState(false);
 const [showAvail, setShowAvail] = useState(false);
 const [homeTab, setHomeTab] = useState<HomeTab>('plan');
 // Step inside (template): the building and the top bar step aside and the home gets the whole screen.
 const [focus, setFocus] = useState(false);
 // The complex as one picture: the developer's aerial in place of the turning towers.
 const [aerial, setAerial] = useState(false);
 const [info, setInfo] = useState(false);
 const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
 const faceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
 const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
 const [contact, setContact] = useState<Unit | null | undefined>(undefined);
 const [hintSeen, setHintSeen] = useState(true);
 const [touch, setTouch] = useState(false);
 const pageRef = useRef<HTMLDivElement>(null);
 const boxRef = useRef<HTMLDivElement>(null);
 const [layout, setLayout] = useState<'complex' | 'tower' | null>(null);
 const layerEls = useRef(new Map<string, { outer: HTMLDivElement | null; inner: HTMLDivElement | null }>());
 const stageRef = useRef<HTMLDivElement>(null);
 const press = useRef<{ x: number; moved: boolean } | null>(null);
 const pendingReveal = useRef<string | null>(null);

 useEffect(() => { setTouch(window.matchMedia('(hover: none)').matches); try { setHintSeen(localStorage.getItem('gindi.hint') === '1'); } catch { setHintSeen(false); } }, []);
 const dismissHint = () => { if (hintSeen) return; setHintSeen(true); try { localStorage.setItem('gindi.hint', '1'); } catch { /* private */ } };

 // ---- data
 const fetchOrbit = useCallback(async (v: View) => {
  const key = ringKey(v);
  if (orbitsRef.current[key]) return orbitsRef.current[key];
  const o: Orbit = await fetch(orbitUrl(v)).then(r => r.json());
  orbitsRef.current = { ...orbitsRef.current, [key]: o };
  setOrbits(prev => ({ ...prev, [key]: o }));
  return o;
 }, []);
 const warm = useCallback(async (v: View, urgent = false) => {
  const o = await fetchOrbit(v);
  engine.load(ringKey(v), o.frames.map(f => f.src), urgent);
  return o;
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [fetchOrbit]);

 // First view from the address (?b=2&u=b2-f12-a), then the complex ring; towers load quietly after it.
 useEffect(() => {
  const q = new URLSearchParams(location.search);
  const u = q.get('u'), b = Number(q.get('b') ?? (u ? unitById.get(u)?.building : 0));
  const first: View = BUILDINGS.includes(b as 1) ? b : 'complex';
  (async () => {
   await warm('complex', first === 'complex');
   if (first !== 'complex') { await warm(first, true); setLayers([first]); setView(first); if (u && unitById.has(u)) { pendingReveal.current = u; setSelected(u); } }
   for (const n of BUILDINGS) if (n !== first) await warm(n).catch(() => {});
  })().catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 // Keep the address in step, so a link opens on the same building and home (the language stays).
 useEffect(() => {
  const url = new URL(location.href);
  if (view === 'complex') url.searchParams.delete('b'); else url.searchParams.set('b', String(view));
  if (selected) url.searchParams.set('u', selected); else url.searchParams.delete('u');
  history.replaceState(history.state, '', url);
 }, [view, selected]);

 const complex = orbits.complex;
 const tower = typeof view === 'number' ? orbits[`b${view}`] : undefined;
 const frameIdx = engine.displayed;

 // ---- the zoom between the complex and a tower
 const zoomMatrix = (n: number, f: number) => {
  const bc = orbitsRef.current.complex?.frames[f]?.boxes[n], bt = orbitsRef.current[`b${n}`]?.frames[f]?.boxes[n];
  if (!bc || !bt) return null;
  const k = (bt[3] - bt[1]) / Math.max(1, bc[3] - bc[1]);
  const tx = (bt[0] + bt[2]) / 2 - k * (bc[0] + bc[2]) / 2, ty = (bt[1] + bt[3]) / 2 - k * (bc[1] + bc[3]) / 2;
  return { k, tx, ty };
 };
 const forward = (m: { k: number; tx: number; ty: number }) => `translate(${m.tx / FRAME_W * 100}%, ${m.ty / FRAME_H * 100}%) scale(${m.k})`;
 const inverse = (m: { k: number; tx: number; ty: number }) => `translate(${-m.tx / m.k / FRAME_W * 100}%, ${-m.ty / m.k / FRAME_H * 100}%) scale(${1 / m.k})`;

 // The stage's frame sits differently in the two views (the tower beside the home panel). The new frame is laid out at
 // once and the old placement is folded into the zoom, so the move is one gesture instead of a zoom and then a slide.
 const switchLayout = (to: View) => {
  const page = pageRef.current, box = boxRef.current, next = to === 'complex' ? 'complex' : 'tower';
  if (!page || !box) return '';
  const r0 = box.getBoundingClientRect();
  page.dataset.view = next;
  const r1 = box.getBoundingClientRect();
  setLayout(next);
  if (!r1.width || (Math.abs(r0.left - r1.left) < .5 && Math.abs(r0.width - r1.width) < .5 && Math.abs(r0.top - r1.top) < .5)) return '';
  return `translate(${(r0.left - r1.left) / r1.width * 100}%, ${(r0.top - r1.top) / r1.height * 100}%) scale(${r0.width / r1.width})`;
 };
 const animatePair = async (from: View, to: View, n: number) => {
  const m = zoomMatrix(n, engine.index());
  const a = layerEls.current.get(ringKey(from)), b = layerEls.current.get(ringKey(to));
  const was = switchLayout(to);
  if (!m || !a?.outer || !a.inner || !b?.outer || !b.inner || reducedMotion()) return [];
  const into = to !== 'complex';
  const opts: KeyframeAnimationOptions = { duration: ZOOM_MS, easing: EASE, fill: 'forwards' };
  const fade: KeyframeAnimationOptions = { duration: ZOOM_MS, easing: 'linear', fill: 'forwards' };
  const t = (x: string) => (was ? `${was} ${x}` : x) || 'none';
  // Into a tower the tower comes up over the complex mid-zoom and the other buildings fall away behind it;
  // out of one the complex gathers in early, so the shrinking tower frame never shows its edges.
  const anims = [
   a.outer.animate([{ transform: t('') }, { transform: into ? forward(m) : inverse(m) }], opts),
   a.inner.animate(into
    ? [{ opacity: 1 }, { opacity: 1, offset: .5 }, { opacity: 0, offset: .82 }, { opacity: 0 }]
    : [{ opacity: 1 }, { opacity: 1, offset: .2 }, { opacity: 0, offset: .55 }, { opacity: 0 }], fade),
   b.outer.animate([{ transform: t(into ? inverse(m) : forward(m)) }, { transform: 'none' }], opts),
   b.inner.animate(into
    ? [{ opacity: 0 }, { opacity: 0, offset: .18 }, { opacity: 1, offset: .55 }, { opacity: 1 }]
    : [{ opacity: 0 }, { opacity: 0, offset: .06 }, { opacity: 1, offset: .42 }, { opacity: 1 }], fade),
  ];
  await Promise.all(anims.map(x => x.finished.catch(() => {})));
  // The incoming ring ends where it rests anyway; it lets go once it is the current view. The outgoing one stays hidden (fill) until it unmounts.
  return anims.slice(2);
 };

 // How clear a tower stands in the complex at each angle: its outline there (nearer towers already cut away) over its box.
 // The zoom flies to the tower's true place, so a tower half hidden behind a neighbour would arrive as a roof over grass.
 const clearFrame = (n: number) => {
  const frames = orbitsRef.current.complex?.frames;
  if (!frames) return engine.index();
  const share = frames.map(f => {
   const b = f.boxes[n], sp = f.spots.find(x => x.id === `b${n}`);
   return b && sp ? sp.points.reduce((x, p) => x + area(p), 0) / Math.max(1, (b[2] - b[0]) * (b[3] - b[1])) : 0;
  });
  const best = Math.max(...share), cur = engine.index();
  if (share[cur] >= best * .9) return cur;
  let pick = cur, dist = Infinity;
  share.forEach((a, i) => { if (a >= best * .9) { const d = Math.min(Math.abs(i - cur), COUNT - Math.abs(i - cur)); if (d < dist) { dist = d; pick = i; } } });
  return pick;
 };

 const go = async (to: View) => {
  if (busyRef.current || to === view) return;
  busyRef.current = true; setBusy(true); setHoverTower(null); setHoverUnit(null); setTip(null);
  try {
   // From the aerial, the towers come back first and the zoom starts from them.
   if (aerial) { setAerial(false); await new Promise(r => setTimeout(r, reducedMotion() ? 0 : 650)); }
   const hops: [View, View][] = view !== 'complex' && to !== 'complex' ? [[view, 'complex'], ['complex', to]] : [[view, to]];
   for (const [from, next] of hops) {
    const n = (next === 'complex' ? from : next) as number;
    await warm(next, true);
    const clear = clearFrame(n);
    if (clear !== engine.index()) { await engine.whenReady(ringKey(from), clear); await engine.rotateTo(clear); }
    await engine.whenReady(ringKey(next));
    setLayers([from, next]); await nextFrame();
    const held = await animatePair(from, next, n);
    setLayers([next]); setView(next); setLayout(null);
    await nextFrame(); held.forEach(x => x.cancel());
   }
   if (to === 'complex') setSelected(null);
  } finally { busyRef.current = false; setBusy(false); }
 };

 useEffect(() => { if (typeof view !== 'number') setFocus(false); }, [view]);
 useEffect(() => {
  if (!focus) return;
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !document.querySelector('[role="dialog"]')) setFocus(false); };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
 }, [focus]);

 // ---- homes
 const unitsHere = useMemo(() => typeof view === 'number' ? UNITS.filter(u => u.building === view) : [], [view]);
 const selectedUnit = selected ? unitById.get(selected) ?? null : null;
 const spotAreas = useMemo(() => {
  const m = new Map<string, number[]>();
  tower?.frames.forEach((f, i) => f.spots.forEach(sp => { const a = sp.points.reduce((x, p) => x + area(p), 0); (m.get(sp.id) ?? m.set(sp.id, Array(COUNT).fill(0)).get(sp.id)!)[i] = a; }));
  return m;
 }, [tower]);
 // Turn to the nearest view that shows the home well; `face` turns the tower until the home looks straight at the visitor.
 const reveal = (id: string, face = false) => {
  const areas = spotAreas.get(id);
  if (!areas) return;
  const best = Math.max(...areas); if (!best) return;
  const cur = engine.index();
  const enough = face ? .93 : .55, near = face ? .93 : .7;
  if (areas[cur] >= best * enough) return;
  let pick = cur, dist = Infinity;
  areas.forEach((a, i) => { if (a >= best * near) { const d = Math.min(Math.abs(i - cur), COUNT - Math.abs(i - cur)); if (d < dist) { dist = d; pick = i; } } });
  engine.rotateTo(pick);
 };
 const selectUnit = (id: string | null, face = false) => {
  setSelected(id);
  if (!id) return;
  const u = unitById.get(id)!;
  if (u.building !== view) { pendingReveal.current = id; go(u.building); } else reveal(id, face);
 };
 // A home picked in another building is shown once that tower's ring has arrived.
 useEffect(() => {
  const id = pendingReveal.current;
  if (!id || busy || unitById.get(id)?.building !== view || !spotAreas.size) return;
  pendingReveal.current = null; reveal(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [busy, view, spotAreas]);

 // ---- pointer on the stage
 const pickAt = (x: number, y: number) => {
  const el = document.elementFromPoint(x, y)?.closest('[data-spot]');
  return el && stageRef.current?.contains(el) ? el.getAttribute('data-spot') : null;
 };
 const onHoverAt = (x: number, y: number) => {
  const id = pickAt(x, y);
  if (view === 'complex') { setHoverTower(id ? Number(id.slice(1)) : null); setTip(null); }
  else hoverHome(id);
 };
 // Hover selects an available home, after a short intent delay, so sweeping across the facade doesn't strobe the panel (template).
 // A sold home is previewed while hovered and the chosen one returns after.
 const hoverHome = (id: string | null) => {
  setHoverUnit(id);
  const u = id ? unitById.get(id) : null;
  if (hoverTimer.current) clearTimeout(hoverTimer.current);
  if (u && u.status === 'available' && id !== selected) hoverTimer.current = setTimeout(() => setSelected(id), 90);
 };
 useEffect(() => () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); if (faceTimer.current) clearTimeout(faceTimer.current); }, []);
 // A tile hovered in the picker turns the tower to face its home, after a short pause so sweeping across the grid doesn't spin it.
 const pickerHover = (id: string | null) => {
  hoverHome(id);
  if (faceTimer.current) clearTimeout(faceTimer.current);
  if (id) faceTimer.current = setTimeout(() => reveal(id, true), 140);
 };
 const onPick = (id: string) => {
  if (view === 'complex') go(Number(id.slice(1)));
  else if (unitById.get(id)?.status === 'available') selectUnit(id);
 };
 // Arriving in a tower opens a home at once (the template never shows an empty panel): the chosen one if it is
 // in this tower, else an available home on the facade in view — a 5-room first, as it has the most to show.
 useEffect(() => {
  if (typeof view !== 'number' || busy || !tower) return;
  if (selected && unitById.get(selected)?.building === view) return;
  const inView = new Set(tower.frames[engine.index()]?.spots.map(sp => sp.id));
  const pool = UNITS.filter(u => u.building === view && u.status === 'available');
  const pick = pool.filter(u => inView.has(u.id)).sort((a, b) => (a.type === 'A' ? 0 : 1) - (b.type === 'A' ? 0 : 1) || b.floor - a.floor)[0] ?? pool[0];
  if (pick) setSelected(pick.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [view, busy, tower]);

 useEffect(() => {
  const el = stageRef.current;
  if (!el) return;
  const wheel = (e: WheelEvent) => {
   if (e.ctrlKey || engine.isDragging() || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
   e.preventDefault(); dismissHint(); engine.nudge(e.deltaX, el.clientWidth);
  };
  el.addEventListener('wheel', wheel, { passive: false });
  return () => el.removeEventListener('wheel', wheel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [hintSeen]);

 // ---- counts
 const stats = (b: number) => { const us = UNITS.filter(u => u.building === b); return { total: us.length, available: us.filter(u => u.status === 'available').length }; };
 const soldHere = unitsHere.filter(u => u.status === 'sold').length;

 // What a home shows on the facade; the fill (multiplied into the render) and the edge (drawn plainly) read it.
 const spotState = (id: string) => {
  const u = unitById.get(id);
  if (!u) return undefined;
  // One home at a time: the hovered one stands in for the chosen one, so the facade, the card and the panel agree.
  if (id === activeId) return id === hoverUnit ? (u.status === 'sold' ? 'hover-sold' : 'hover') : 'selected';
  if (id === selected || id === hoverUnit) return undefined;
  const filtering = filter !== 'all' || onlyAvailable;
  if (filtering && matches(u, filter, onlyAvailable)) return 'match';
  if (showAvail) return u.status === 'sold' ? 'sold' : 'available';
  return undefined;
 };

 const complexFrame = complex?.frames[frameIdx];
 const towerFrame = tower?.frames[frameIdx];
 const hoverBox = hoverTower && complexFrame?.boxes[hoverTower];
 const tipUnit = hoverUnit ? unitById.get(hoverUnit) : null;
 const infoUnit = (tipUnit && tipUnit.building === view ? tipUnit : null) ?? (selectedUnit && selectedUnit.building === view ? selectedUnit : null);
 const activeId = infoUnit?.id ?? null;
 // The floor plan's homes behave like the picker's tiles: hover shows one (the building turns to it), click chooses it.
 const platePick = { onHover: pickerHover, onPick: (id: string) => { if (unitById.get(id)?.status === 'available') selectUnit(id, true); } };

 const renderLayer = (v: View) => {
  const key = ringKey(v);
  const o = orbits[key];
  const frame = o?.frames[frameIdx];
  const live = !busy && v === view;
  return <div key={key} className={s.layer} ref={el => { const r = layerEls.current.get(key) ?? { outer: null, inner: null }; r.outer = el; layerEls.current.set(key, r); }}>
   <div className={s.layerInner} data-ring={v === 'complex' ? 'complex' : 'tower'} style={v !== view ? { opacity: 0 } : undefined} ref={el => { const r = layerEls.current.get(key) ?? { outer: null, inner: null }; r.inner = el; layerEls.current.set(key, r); }}>
    <canvas ref={engine.canvasRef(key)} className={s.canvas} role="img" aria-label={v === 'complex' ? t.complex : t.buildingN(v)} />
    {frame && live && <svg className={s.spots} viewBox={`0 0 ${FRAME_W} ${FRAME_H}`} data-view={v === 'complex' ? 'complex' : 'tower'}>
     <defs>
      {/* Sold homes: a dark veil with fine light hatching, so they read as "taken" on any part of the facade. */}
      <pattern id="gindi-sold" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
       <rect width="7" height="7" fill="rgb(10 10 10 / 0.62)" /><line x1="0" y1="0" x2="0" y2="7" stroke="rgb(255 255 255 / 0.4)" strokeWidth="1.2" />
      </pattern>
     </defs>
     {v === 'complex'
      ? [...frame.spots].sort((a, b) => ((b as { depth?: number }).depth ?? 0) - ((a as { depth?: number }).depth ?? 0)).map(sp => sp.points.map((p, i) =>
       <polygon key={`${sp.id}-${i}`} data-spot={sp.id} points={p} className={`${s.towerSpot} ${hoverTower === Number(sp.id.slice(1)) ? s.towerSpotHover : ''}`} />))
      : frame.spots.map(sp => { const st = spotState(sp.id); return sp.points.map((p, i) => <g key={`${sp.id}-${i}`} data-state={st}>
       <polygon data-spot={sp.id} points={p} className={s.spotFill} />
       {st && <polygon points={p} className={s.spotEdge} />}
      </g>); })}
    </svg>}
   </div>
  </div>;
 };

 const inTower = typeof view === 'number';
 const hintText = inTower ? (touch ? t.towerHintTouch : t.towerHint) : (touch ? t.hintTouch : t.hintMouse);

 return <MotionConfig reducedMotion="user"><div ref={pageRef} className={s.page} data-view={layout ?? (inTower ? 'tower' : 'complex')} data-busy={busy || undefined} data-focus={(focus && inTower) || undefined}>
  <header className={s.header}>
   <a className={s.logo} href="https://www.gindi.co.il/" target="_blank" rel="noopener" aria-label="Gindi Holdings">
    <img src={`${project.base}/brand/gindi-logo.png`} alt="Gindi" width={900} height={462} />
   </a>
   <nav className={s.switcher} aria-label={t.chooseBuilding}>
    <button type="button" className={s.switchBtn} aria-pressed={view === 'complex'} onClick={() => go('complex')}>{t.complex}</button>
    {BUILDINGS.map(n => <button key={n} type="button" className={s.switchBtn} aria-pressed={view === n} aria-label={t.buildingN(n)}
     onPointerEnter={() => { warm(n); if (view === 'complex') setHoverTower(n); }} onPointerLeave={() => view === 'complex' && setHoverTower(null)} onClick={() => go(n)}>
     <small>{t.building}</small>{t.buildingShort(n)}</button>)}
   </nav>
   <div className={s.headerEnd}>
    <LanguageSwitch id="gindi-lang" compact tone="dark" />
    {inTower && !busy && <HomePicker units={unitsHere} selected={selectedUnit && selectedUnit.building === view ? selectedUnit : null} filter={filter} onFilter={setFilter}
     onlyAvailable={onlyAvailable} onOnlyAvailable={setOnlyAvailable} hovered={hoverUnit} onHover={pickerHover} onSelect={id => selectUnit(id, true)} />}
   </div>
  </header>

  <div className={s.body}>
   <div ref={stageRef} className={s.stage} tabIndex={0} role="group" aria-label={inTower ? t.buildingN(view as number) : t.complex}
    onKeyDown={e => { if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && aerial && view === 'complex') return; if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); dismissHint(); engine.step(e.key === 'ArrowRight' ? -2 : 2); } if (e.key === 'Escape' && inTower) go('complex'); }}
    onPointerDown={e => { if (busy || e.button !== 0 || (e.target as Element).closest('button, a, aside, [data-ui]')) return; press.current = { x: e.clientX, moved: false }; engine.beginDrag(e.clientX); e.currentTarget.setPointerCapture(e.pointerId); }}
    onPointerMove={e => {
     if (busy) return;
     // Over a card, a button or the panel the pointer isn't on the building: leave their hover alone.
     if (!press.current && (e.target as Element).closest('button, a, aside, [data-ui]')) return;
     if (!press.current) { if (!engine.moving) onHoverAt(e.clientX, e.clientY); return; }
     if (Math.abs(e.clientX - press.current.x) > 5) { press.current.moved = true; dismissHint(); setHoverTower(null); setHoverUnit(null); setTip(null); }
     engine.dragTo(e.clientX, e.currentTarget.clientWidth);
    }}
    onPointerUp={e => {
     const moved = press.current?.moved; press.current = null; engine.endDrag();
     if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
     if (!moved && !busy) { const id = pickAt(e.clientX, e.clientY); if (id) onPick(id); }
    }}
    onPointerCancel={() => { press.current = null; engine.endDrag(); }}
    onPointerLeave={() => { if (!press.current) { setHoverTower(null); setHoverUnit(null); setTip(null); } }}>
    <div className={s.glow} aria-hidden /><div className={s.scrim} aria-hidden />
    <div ref={boxRef} className={s.box}>
     {layers.map(renderLayer)}
     {/* The hovered tower's name card, pinned on its upper floors. */}
     <AnimatePresence>
      {view === 'complex' && !busy && hoverBox && hoverTower && <motion.div key={hoverTower} className={s.towerCard}
       style={{ left: `${(hoverBox[0] + hoverBox[2]) / 2 / 16}%`, top: `${(hoverBox[1] + (hoverBox[3] - hoverBox[1]) * .34) / 9}%` }}
       initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: .25 }}>
       <span className={s.cardKicker}>{t.building}</span>
       <strong>{t.buildingShort(hoverTower)}</strong>
       <span className={s.cardMeta}>{t.residencesN(stats(hoverTower).total)} · {t.availableN(stats(hoverTower).available)}</span>
       <span className={s.cardGo}>{t.explore}<ArrowUpRight size={14} strokeWidth={1.6} aria-hidden /></span>
      </motion.div>}
     </AnimatePresence>
    </div>

    {!complex && <span className={s.status} role="status"><span className={s.spinner} />{t.loading}</span>}

    <AnimatePresence>
     {!hintSeen && complex && !busy && !(aerial && view === 'complex') && <motion.span key="hint" className={s.hint} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: .6 }}>
      <Hand size={15} strokeWidth={1.5} aria-hidden />{hintText}</motion.span>}
    </AnimatePresence>

    {!(aerial && view === 'complex') && <>
    <button type="button" className={`${s.turn} ${s.turnStart}`} aria-label={t.turnLeft} onClick={() => { dismissHint(); engine.step(5); }}><ChevronLeft size={20} strokeWidth={1.4} aria-hidden /></button>
    <button type="button" className={`${s.turn} ${s.turnEnd}`} aria-label={t.turnRight} onClick={() => { dismissHint(); engine.step(-5); }}><ChevronRight size={20} strokeWidth={1.4} aria-hidden /></button>
    </>}

    {/* The whole complex: the developer's aerial over the towers, the park and the orchard. */}
    <AnimatePresence>
     {aerial && view === 'complex' && <motion.figure key="aerial" className={s.aerial} data-ui
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .6, ease: [.22, 1, .36, 1] }}>
      <motion.img src={`${project.base}/complex/aerial-2560.webp`} srcSet={`${project.base}/complex/aerial-1440.webp 1440w, ${project.base}/complex/aerial-2560.webp 2560w`} sizes="100vw"
       alt={t.aerialAlt} draggable={false} initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: [.22, 1, .36, 1] }} />
      <figcaption className={s.aerialCaption}>{t.aerialCaption} · {t.illustrative}</figcaption>
     </motion.figure>}
    </AnimatePresence>
    {view === 'complex' && !busy && complex && <div className={s.viewMode} role="group" aria-label={t.viewMode} data-ui>
     <button type="button" aria-pressed={!aerial} onClick={() => setAerial(false)}><Box size={14} strokeWidth={1.5} aria-hidden />{t.viewTowers}</button>
     <button type="button" aria-pressed={aerial} onClick={() => { dismissHint(); setAerial(true); }}><MapIcon size={14} strokeWidth={1.5} aria-hidden />{t.viewAerial}</button>
    </div>}

    {/* Complex: the title and the four buildings. */}
    <AnimatePresence>
     {view === 'complex' && !busy && <motion.div key="hero" className={s.hero} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: .6, ease: [.22, 1, .36, 1] }}>
      <DreamRing />
      <p className={s.kicker}>{t.heroKicker}</p>
      <h1 className={s.wordmark}><span>GINDI</span>COLORS</h1>
      <p className={s.tagline}>{lang === 'he' ? project.taglineHe : project.tagline}</p>
      <p className={s.heroLine}>{t.heroLine}</p>
      <button type="button" className={s.aboutBtn} data-ui onClick={() => setInfo(true)}><MapPin size={15} strokeWidth={1.5} aria-hidden />{t.aboutComplex}</button>
     </motion.div>}
    </AnimatePresence>
    <AnimatePresence>
     {view === 'complex' && !busy && <motion.div key="cards" className={s.cards} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: .6, delay: .1, ease: [.22, 1, .36, 1] }}>
      {BUILDINGS.map(n => { const st = stats(n); return <button key={n} type="button" className={s.card} data-card={n} data-hover={hoverTower === n || undefined}
       onPointerEnter={() => { setHoverTower(n); warm(n); }} onPointerLeave={() => setHoverTower(null)} onFocus={() => setHoverTower(n)} onBlur={() => setHoverTower(null)} onClick={() => go(n)}>
       <span className={s.cardKicker}>{t.building}</span>
       <span className={s.cardNum}>{t.buildingShort(n)}</span>
       <span className={s.cardMeta}>{t.residencesN(st.total)}</span>
       <span className={s.cardAvail}>{t.availableN(st.available)}</span>
       <ArrowUpRight className={s.cardArrow} size={16} strokeWidth={1.4} aria-hidden />
      </button>; })}
     </motion.div>}
    </AnimatePresence>

    {/* Tower: its name, the way back, availability on the facade. */}
    <AnimatePresence>
     {inTower && !busy && <motion.div key={`t${view}`} className={s.towerTitle} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: .5, ease: [.22, 1, .36, 1] }}>
      <button type="button" className={s.backLink} onClick={() => go('complex')}><ArrowLeft size={15} strokeWidth={1.5} className={s.dirIcon} aria-hidden />{t.complex}</button>
      <p className={s.kicker}>GINDI COLORS</p>
      <h2 className={s.towerName}><small>{t.building}</small>{t.buildingShort(view as number)}</h2>
      <p className={s.cardMeta}>{t.residencesN(unitsHere.length)} · {t.availableN(unitsHere.length - soldHere)}</p>
      {infoUnit && <div className={s.towerPlate} data-ui>
       <Plate unit={infoUnit} {...platePick} />
      </div>}
      <div className={s.legend}>
       <button type="button" className={s.legendBtn} aria-pressed={showAvail} onClick={() => setShowAvail(v => !v)}>
        {showAvail ? <Eye size={14} strokeWidth={1.6} aria-hidden /> : <EyeOff size={14} strokeWidth={1.6} aria-hidden />}
        <span className={s.swatchAvail} />{t.forSale}<span className={s.swatchSold} />{t.sold}</button>
      </div>
      {/* The home under the pointer (else the chosen one), with its sale status spelled out. */}
      {infoUnit && <div className={s.hoverCard} data-status={infoUnit.status} data-live={infoUnit.id === hoverUnit || undefined}>
       <span className={s.hoverStatus}>{t.statusText(infoUnit.status)}</span>
       <strong>{lang === 'he' ? TYPES[infoUnit.type].nameHe : TYPES[infoUnit.type].name}</strong>
       <span>{t.floorN(infoUnit.floor)}</span>
       <span className={s.hoverFacts}>{[TYPES[infoUnit.type].rooms && t.roomsN(TYPES[infoUnit.type].rooms!), TYPES[infoUnit.type].area && t.m2(TYPES[infoUnit.type].area!), t.exposureText(infoUnit.exposure)].filter(Boolean).join(' · ')}</span>
      </div>}
     </motion.div>}
    </AnimatePresence>
   </div>

   {/* The chosen home: the template's media panel, beside the building. */}
   <AnimatePresence>
    {inTower && !busy && selectedUnit && selectedUnit.building === view && <motion.aside key={`home${view}`} className={s.homePanel} aria-label={t.homeSelected}
     initial={{ opacity: 0, x: lang === 'he' ? -30 : 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: lang === 'he' ? -20 : 20 }} transition={{ duration: .55, ease: [.22, 1, .36, 1] }}>
     <HomePanel unit={infoUnit ?? selectedUnit} tab={homeTab} onTab={setHomeTab} onContact={() => setContact(infoUnit ?? selectedUnit)} focus={focus} onFocus={setFocus} plate={platePick} />
    </motion.aside>}
   </AnimatePresence>
  </div>


  <footer className={s.footer}><p>{t.disclaimer}</p><p>{t.sampleNote}</p></footer>
  <ContactDialog unit={contact} onClose={() => setContact(undefined)} />
  <ComplexInfo open={info} onOpenChange={setInfo} />
 </div></MotionConfig>;
}
