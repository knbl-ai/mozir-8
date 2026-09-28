'use client';
import { createElement, useEffect, useRef, useState } from 'react';
import { Box, Focus, LayoutPanelLeft, Minus, Plus, RotateCcw, RotateCw, Trees } from 'lucide-react';
import SegmentedControl from './SegmentedControl';
import { useLang } from '@/lib/i18n';
import { explorerText } from './strings';
import s from './explorer.module.css';

type Viewer = HTMLElement & { cameraOrbit: string; getCameraOrbit?: () => { theta: number; phi: number; radius: number } };
const TURN = Math.PI / 6, ZOOM_STEP = 0.8; // 30° a press; each zoom press brings the camera 20% closer
type View = 'perspective' | 'plan' | 'terrace';
const ORBITS: Record<View, string> = { perspective: '25deg 45deg 80%', plan: '0deg 0deg 100%', terrace: '125deg 50deg 85%' };

// One model-viewer for the explorer. Changing `src` (a different home's model) fades to a veil
// and back in on load, instead of tearing down the viewer.
export default function ResidenceModel({ src, poster, defaultOrbit = ORBITS.perspective }: { src: string; poster?: string; defaultOrbit?: string }) {
 const t = explorerText[useLang()];
 const host = useRef<HTMLDivElement>(null);
 const [ready, setReady] = useState(false);
 const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
 const [error, setError] = useState(false);
 const [view, setView] = useState<View>('perspective');
 useEffect(() => { import('@google/model-viewer').then(() => setReady(true)).catch(() => setError(true)); }, []);
 useEffect(() => {
  const el = host.current?.querySelector('model-viewer') as (HTMLElement & { src?: string; loaded?: boolean }) | null;
  if (!el) return;
  // React 19 sets `src` as a property on custom elements, not an attribute — read the property.
  const done = () => setLoadedSrc(el.src ?? null);
  if (el.loaded) done();
  const fail = () => setError(true);
  el.addEventListener('load', done); el.addEventListener('error', fail);
  return () => { el.removeEventListener('load', done); el.removeEventListener('error', fail); };
 }, [ready]);
 const change = (next: View) => {
  const el = host.current?.querySelector('model-viewer') as Viewer | null;
  if (el) el.cameraOrbit = next === 'perspective' ? defaultOrbit : ORBITS[next];
  setView(next);
 };
 // Buttons for what the mouse or fingers do: turn the model and move closer or further away.
 // model-viewer eases to the new orbit and keeps it inside the min/max orbit limits.
 // Quick repeated presses build on the previous target, not on the camera caught mid-glide.
 const goal = useRef<{ theta: number; phi: number; radius: number; at: number } | null>(null);
 const nudge = (turn: number, zoom: number) => {
  const el = host.current?.querySelector('model-viewer') as Viewer | null;
  const now = el?.getCameraOrbit?.();
  if (!el || !now) return;
  const from = goal.current && performance.now() - goal.current.at < 900 ? goal.current : now;
  const next = { theta: from.theta + turn, phi: now.phi, radius: from.radius * zoom, at: performance.now() };
  goal.current = next;
  el.cameraOrbit = `${next.theta}rad ${next.phi}rad ${next.radius}m`;
 };
 const loading = loadedSrc !== src && !error;
 return <div className={s.modelShell} style={{ background: 'radial-gradient(ellipse at 48% 40%, #827c73 0%, #66615b 60%, #4c4945 100%)' }} ref={host}>
  {ready && createElement('model-viewer', {
   src, poster, alt: t.modelAlt,
   'camera-controls': true, 'touch-action': 'pan-y', 'camera-orbit': defaultOrbit, 'interpolation-decay': '120',
   'min-camera-orbit': 'auto 0deg 9m', 'max-camera-orbit': 'auto 85deg 200%', 'field-of-view': '35deg',
   exposure: '1.05', 'shadow-intensity': '1', 'shadow-softness': '1', 'environment-image': 'neutral', 'interaction-prompt': 'none', loading: 'eager',
   style: { width: '100%', height: '100%' },
  })}
  <div className={s.modelVeil} data-visible={loading || undefined} aria-hidden={!loading}>
   <span className={s.spinner} /><span>{t.preparingModel}</span>
  </div>
  {error && <div className={s.modelVeil} data-visible><span>{t.modelFailed}</span></div>}
  <div className={s.modelTools}>
   <SegmentedControl id="model-view" label={t.modelView} variant="glass" value={view} onChange={change}
    options={[{ value: 'perspective', label: t.model3d, icon: Box }, { value: 'plan', label: t.modelTop, icon: LayoutPanelLeft }, { value: 'terrace', label: t.modelOutdoor, icon: Trees }]} />
   <button type="button" className={s.glassIcon} aria-label={t.resetView} title={t.resetView} onClick={() => change('perspective')}><Focus size={16} strokeWidth={1.6} aria-hidden /></button>
  </div>
  <div className={s.modelNav} role="group" aria-label={t.modelView}>
   <button type="button" className={s.glassIcon} aria-label={t.modelLeft} title={t.modelLeft} onClick={() => nudge(TURN, 1)}><RotateCcw size={16} strokeWidth={1.6} aria-hidden /></button>
   <button type="button" className={s.glassIcon} aria-label={t.zoomOut} title={t.zoomOut} onClick={() => nudge(0, 1 / ZOOM_STEP)}><Minus size={16} strokeWidth={1.6} aria-hidden /></button>
   <button type="button" className={s.glassIcon} aria-label={t.zoomIn} title={t.zoomIn} onClick={() => nudge(0, ZOOM_STEP)}><Plus size={16} strokeWidth={1.6} aria-hidden /></button>
   <button type="button" className={s.glassIcon} aria-label={t.modelRight} title={t.modelRight} onClick={() => nudge(-TURN, 1)}><RotateCw size={16} strokeWidth={1.6} aria-hidden /></button>
  </div>
 </div>;
}
