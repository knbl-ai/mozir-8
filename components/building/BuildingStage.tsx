'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Hand, Image as ImageIcon, Rotate3d } from 'lucide-react';
import type { ApartmentZone, BuildingFrame, Development } from '@/content/projects';
import { DUR, EASE } from './motion';
import { polygonArea } from './inventory';
import SegmentedControl from './SegmentedControl';
import type { FrameSequence } from './useFrameSequence';
import s from './explorer.module.css';

// Map a flat label onto a projected facade quad, including perspective foreshortening.
function facadeTransform(p: [number, number][]) {
 const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = p;
 const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
 const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
 const denominator = dx1 * dy2 - dx2 * dy1;
 const g = Math.abs(denominator) > 1e-8 ? (dx3 * dy2 - dx2 * dy3) / denominator : 0;
 const h = Math.abs(denominator) > 1e-8 ? (dx1 * dy3 - dx3 * dy1) / denominator : 0;
 return `matrix3d(${[(x1 - x0 + g * x1) / 160, (y1 - y0 + g * y1) / 160, 0, g / 160, (x3 - x0 + h * x3) / 28, (y3 - y0 + h * y3) / 28, 0, h / 28, 0, 0, 1, 0, x0, y0, 0, 1].join(',')})`;
}

const HINT_KEY = 'explorer.dragHintSeen';
const readHintSeen = () => { try { return localStorage.getItem(HINT_KEY) === '1'; } catch { return false; } };

export type StageMode = 'rotation' | 'reference';

export default function BuildingStage({ project, frames, engine, mode, onModeChange, selectedApartment, hovered, onHover, onSelect, counts, mobileSummary }: {
 project: Development; frames: BuildingFrame[]; engine: FrameSequence; mode: StageMode; onModeChange: (mode: StageMode) => void;
 selectedApartment?: string; hovered: string | null; onHover: (zone: ApartmentZone | null, commit: boolean) => void; onSelect: (zone: ApartmentZone) => void;
 counts: { available: number; sold: number }; mobileSummary: React.ReactNode;
}) {
 const stageRef = useRef<HTMLDivElement>(null);
 const pointer = useRef<{ x: number; y: number } | null>(null);
 const press = useRef<{ x: number; moved: boolean } | null>(null);
 const [showSold, setShowSold] = useState(false);
 const [showAvailable, setShowAvailable] = useState(false);
 const [reference, setReference] = useState<'street' | 'reverse'>('street');
 const [hintSeen, setHintSeen] = useState(true);
 const [touch, setTouch] = useState(false);
 useEffect(() => { setHintSeen(readHintSeen()); setTouch(window.matchMedia('(hover: none)').matches); }, []);
 const dismissHint = () => { if (hintSeen) return; setHintSeen(true); try { localStorage.setItem(HINT_KEY, '1'); } catch { /* private mode */ } };

 // Overlays follow the frame on screen, so they turn with the building rather than blinking out.
 const frame = frames[engine.displayed];
 const zoneAt = (x: number, y: number) => {
  const el = document.elementFromPoint(x, y)?.closest('[data-apartment]');
  const id = el && stageRef.current?.contains(el) ? el.getAttribute('data-apartment') : null;
  return frame?.hotspots.find(h => h.apartment === id) ?? null;
 };

 // A turn swaps the polygons under a still pointer without a pointerenter; re-read what's under it.
 useEffect(() => {
  if (mode !== 'rotation' || engine.moving || !pointer.current) return;
  const request = requestAnimationFrame(() => { if (pointer.current && !engine.isDragging()) onHover(zoneAt(pointer.current.x, pointer.current.y), true); });
  return () => cancelAnimationFrame(request);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [engine.settled, engine.moving, mode]);

 // Horizontal trackpad swipes turn the building; vertical ones still scroll the page.
 useEffect(() => {
  const stage = stageRef.current;
  if (!stage || mode !== 'rotation' || !frames.length) return;
  const wheel = (event: WheelEvent) => {
   if (event.ctrlKey || engine.isDragging() || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
   event.preventDefault();
   dismissHint();
   engine.nudgePixels(event.deltaX * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientWidth : 1));
  };
  stage.addEventListener('wheel', wheel, { passive: false });
  return () => stage.removeEventListener('wheel', wheel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [mode, frames.length, hintSeen]);

 const zoneClass = (h: ApartmentZone) => {
  const sold = h.status === 'sold';
  if (h.apartment === hovered) return sold ? s.zoneSoldHover : s.zoneHover;
  if (h.apartment === selectedApartment && !sold) return s.zoneSelected;
  if (sold) return showSold ? s.zoneSold : s.zoneHidden;
  return showAvailable ? s.zoneAvailable : s.zoneQuiet;
 };

 const labels = frame ? [...new Set(frame.hotspots.map(h => h.apartment))].map(id => {
  const h = frame.hotspots.filter(z => z.apartment === id).sort((a, b) => polygonArea(b.points) - polygonArea(a.points))[0];
  // The chosen home keeps its label whether or not the pointer is on it; hover adds one for another floor.
  const visible = h.apartment === hovered || h.apartment === selectedApartment || (h.status === 'sold' ? showSold : showAvailable);
  return h.labelPoints && visible ? h : null;
 }).filter(Boolean) as ApartmentZone[] : [];

 const referenceSrc = project.references[reference === 'street' ? 0 : 1];
 const turning = engine.moving;

 return <div className={s.stageColumn}>
  <div ref={stageRef} className={s.stage} data-mode={mode} data-moving={turning || undefined} tabIndex={mode === 'rotation' ? 0 : -1} role="group"
   aria-label={mode === 'rotation' ? 'Building, 360°. Drag or use the left and right arrow keys to turn it.' : 'Architect’s view of the building'}
   onKeyDown={e => { if (mode === 'rotation' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); dismissHint(); engine.step(e.key === 'ArrowRight' ? -2 : 2); } }}
   onPointerDown={e => {
    if (mode !== 'rotation' || e.button !== 0) return;
    press.current = { x: e.clientX, moved: false };
    engine.beginDrag(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
   }}
   onPointerMove={e => {
    pointer.current = { x: e.clientX, y: e.clientY };
    if (!press.current) { if (mode === 'rotation' && !turning) onHover(zoneAt(e.clientX, e.clientY), false); return; }
    if (Math.abs(e.clientX - press.current.x) > 5) { press.current.moved = true; dismissHint(); onHover(null, false); }
    engine.dragTo(e.clientX);
   }}
   onPointerUp={e => {
    const moved = press.current?.moved;
    press.current = null;
    engine.endDrag();
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (!moved) { const zone = zoneAt(e.clientX, e.clientY); if (zone) onSelect(zone); }
   }}
   onPointerCancel={() => { press.current = null; engine.endDrag(); }}
   onPointerLeave={() => { pointer.current = null; if (!press.current) onHover(null, false); }}>

   <div className={s.orbit} data-hidden={mode !== 'rotation' || undefined}>
    <div ref={engine.zoomRef} className={s.orbitZoom}>
     {frames[0] && !engine.firstReady && <img className={s.orbitPoster} src={frames[engine.displayed]?.src ?? frames[0].src} alt="" draggable={false} />}
     <canvas ref={engine.canvasRef} className={s.orbitCanvas} role="img" aria-label={`Building, angle ${engine.displayed + 1} of ${frames.length}`} />
     {frame && !engine.failed && <svg viewBox="0 0 800 900" className={s.hotspots} aria-label="Apartment availability">
      {frame.hotspots.map((h, i) => <polygon key={`${h.apartment}-${i}`} data-apartment={h.apartment} data-status={h.status} points={h.points} className={zoneClass(h)}
       onPointerEnter={() => { if (!press.current && !turning) onHover(h, false); }}>
       <title>{`${h.floor} · ${project.residences.find(u => u.id === h.unit)?.shortTitle} · ${h.status === 'sold' ? 'Sold' : 'Available'}`}</title>
      </polygon>)}
      {labels.map(h => <foreignObject key={h.apartment} x="0" y="0" width="800" height="900" className={s.facadeLayer}>
       <div className={s.facadeLabel} data-status={h.status} data-idle={(h.apartment !== hovered && h.apartment !== selectedApartment) || undefined} style={{ transform: facadeTransform(h.labelPoints) }}>{h.status === 'sold' ? 'SOLD' : 'FOR SALE'}</div>
      </foreignObject>)}
     </svg>}
    </div>
   </div>

   <AnimatePresence initial={false}>
    {mode === 'reference' && <motion.img key={referenceSrc} src={referenceSrc} alt="Architect’s visualisation of the building" className={s.referenceImage} draggable={false}
     initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: DUR.slow, ease: EASE }} />}
   </AnimatePresence>

   {mode === 'rotation' && !engine.firstReady && !engine.failed && <span className={s.stageStatus} role="status"><span className={s.spinner} />Preparing the building</span>}
   {engine.failed && <div className={s.stageStatus} role="alert">This view couldn’t load. <button type="button" onClick={() => onModeChange('reference')}>Open the architect’s view</button></div>}
  </div>


  {/* Bottom-right: what the building shows (Front/Rear sits top centre in the architect’s view). Top: the first-use hint. Sides: turning. Bottom centre: how it is shown. */}
  <div className={mode === 'rotation' ? s.stageCorner : s.stageTop}>
   {mode === 'rotation'
    ? <div className={s.legend} role="group" aria-label="Show on the building">
     {([['available', 'For sale', counts.available, showAvailable, setShowAvailable], ['sold', 'Sold', counts.sold, showSold, setShowSold]] as const).map(([tone, label, count, on, set]) =>
      <button key={tone} type="button" className={s.legendRow} data-tone={tone} aria-pressed={on} onClick={() => set(v => !v)} title={on ? `Hide ${label.toLowerCase()} on the building` : `Show ${label.toLowerCase()} on the building`}>
       <span className={s.legendTile}>{on ? <Eye size={14} strokeWidth={1.8} aria-hidden /> : <EyeOff size={14} strokeWidth={1.8} aria-hidden />}</span>
       <span className={s.legendLabel}>{label}</span>
       <span className={s.legendCount}>{count}</span>
      </button>)}
    </div>
    : <SegmentedControl id="reference-view" label="Viewpoint" variant="glass" value={reference} onChange={setReference}
     options={[{ value: 'street', label: 'Front' }, { value: 'reverse', label: 'Rear' }]} />}
  </div>

  <div className={s.stageTop}>
   <AnimatePresence>
    {mode === 'rotation' && !hintSeen && engine.firstReady && <motion.span key="hint" className={s.coachHint} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: DUR.base, ease: EASE, delay: 0.4 }}>
     <Hand size={16} strokeWidth={1.6} className={s.coachHand} aria-hidden />{touch ? 'Drag to turn the building, tap a floor to choose' : 'Drag to turn the building, hover a floor to explore'}
    </motion.span>}
   </AnimatePresence>
  </div>

  {mode === 'rotation' && <>
   <button type="button" className={`${s.glassIcon} ${s.turnLeft}`} aria-label="Turn left" onClick={() => { dismissHint(); engine.step(6); }}><ChevronLeft size={20} strokeWidth={1.6} aria-hidden /></button>
   <button type="button" className={`${s.glassIcon} ${s.turnRight}`} aria-label="Turn right" onClick={() => { dismissHint(); engine.step(-6); }}><ChevronRight size={20} strokeWidth={1.6} aria-hidden /></button>
  </>}

  <div className={s.stageBottom}>
   <SegmentedControl id="stage-mode" label="Building presentation" variant="glass" value={mode} onChange={onModeChange}
    options={[{ value: 'rotation', label: '360°', icon: Rotate3d, disabled: !frames.length, title: 'Turn the building' }, { value: 'reference', label: 'Architect’s view', icon: ImageIcon }]} />
  </div>
  <div className={s.mobileSummary}>{mobileSummary}</div>
 </div>;
}
