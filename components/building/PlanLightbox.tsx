'use client';
import { useRef, useState, type PointerEvent, type WheelEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Minus, Plus, Scan, X } from 'lucide-react';
import s from './explorer.module.css';

type View = { scale: number; x: number; y: number };
const MIN = 1, MAX = 5;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Full-screen floor plan: wheel or pinch to zoom around the pointer, drag to pan, double-click to
// toggle a close look. Buttons animate; direct manipulation follows the hand with no lag.
export default function PlanLightbox({ open, onOpenChange, src, title }: { open: boolean; onOpenChange: (open: boolean) => void; src: string; title: string }) {
 const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 });
 const [animated, setAnimated] = useState(true);
 const pointers = useRef(new Map<number, { x: number; y: number }>());
 const gesture = useRef<{ distance: number; scale: number; x: number; y: number; px: number; py: number } | null>(null);
 const frame = useRef<HTMLDivElement>(null);

 const zoomAt = (next: number, clientX: number, clientY: number, smooth: boolean) => {
  const box = frame.current?.getBoundingClientRect();
  if (!box) return;
  const cx = clientX - box.left - box.width / 2, cy = clientY - box.top - box.height / 2;
  setAnimated(smooth);
  setView(v => {
   const scale = clamp(next, MIN, MAX), k = scale / v.scale;
   return scale === 1 ? { scale, x: 0, y: 0 } : { scale, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k };
  });
 };
 const center = () => { const b = frame.current?.getBoundingClientRect(); return b ? [b.left + b.width / 2, b.top + b.height / 2] as const : [0, 0] as const; };

 const onWheel = (event: WheelEvent) => zoomAt(view.scale * Math.exp(-event.deltaY * 0.0022), event.clientX, event.clientY, false);
 const onPointerDown = (event: PointerEvent) => {
  event.currentTarget.setPointerCapture(event.pointerId);
  pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
  const pts = [...pointers.current.values()];
  const distance = pts.length > 1 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0;
  gesture.current = { distance, scale: view.scale, x: view.x, y: view.y, px: event.clientX, py: event.clientY };
  setAnimated(false);
 };
 const onPointerMove = (event: PointerEvent) => {
  if (!pointers.current.has(event.pointerId) || !gesture.current) return;
  pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
  const pts = [...pointers.current.values()], g = gesture.current;
  if (pts.length > 1 && g.distance) {
   const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
   zoomAt(g.scale * d / g.distance, (pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2, false);
  } else if (view.scale > 1) {
   setView(v => ({ ...v, x: g.x + event.clientX - g.px, y: g.y + event.clientY - g.py }));
  }
 };
 const onPointerUp = (event: PointerEvent) => { pointers.current.delete(event.pointerId); gesture.current = null; };

 return <Dialog.Root open={open} onOpenChange={next => { onOpenChange(next); if (!next) setView({ scale: 1, x: 0, y: 0 }); }}>
  <Dialog.Portal>
   <Dialog.Overlay className={s.lightboxOverlay} />
   <Dialog.Content className={s.lightbox} aria-describedby={undefined}>
    <div className={s.lightboxBar}>
     <Dialog.Title className={s.lightboxTitle}>{title}</Dialog.Title>
     <div className={s.lightboxTools}>
      <button type="button" className={s.glassIcon} aria-label="Zoom out" onClick={() => { const [x, y] = center(); zoomAt(view.scale / 1.6, x, y, true); }}><Minus size={16} strokeWidth={1.6} aria-hidden /></button>
      <span className={s.lightboxZoom} aria-live="polite">{Math.round(view.scale * 100)}%</span>
      <button type="button" className={s.glassIcon} aria-label="Zoom in" onClick={() => { const [x, y] = center(); zoomAt(view.scale * 1.6, x, y, true); }}><Plus size={16} strokeWidth={1.6} aria-hidden /></button>
      <button type="button" className={s.glassIcon} aria-label="Fit to screen" onClick={() => { setAnimated(true); setView({ scale: 1, x: 0, y: 0 }); }}><Scan size={16} strokeWidth={1.6} aria-hidden /></button>
      <Dialog.Close className={s.glassIcon} aria-label="Close"><X size={16} strokeWidth={1.6} aria-hidden /></Dialog.Close>
     </div>
    </div>
    <div ref={frame} className={s.lightboxFrame} data-zoomed={view.scale > 1 || undefined} onWheel={onWheel}
     onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
     onDoubleClick={event => zoomAt(view.scale > 1.5 ? 1 : 2.5, event.clientX, event.clientY, true)}>
     <img src={src} alt={title} draggable={false} data-animated={animated || undefined}
      style={{ transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})` }} />
    </div>
    <p className={s.lightboxHint}>Scroll or pinch to zoom · drag to move · double-click for a closer look</p>
   </Dialog.Content>
  </Dialog.Portal>
 </Dialog.Root>;
}
