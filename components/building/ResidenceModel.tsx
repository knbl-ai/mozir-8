'use client';
import { createElement, useEffect, useRef, useState } from 'react';
import { Box, LayoutPanelLeft, RotateCcw, Trees } from 'lucide-react';
import SegmentedControl from './SegmentedControl';
import s from './explorer.module.css';

type Viewer = HTMLElement & { cameraOrbit: string };
type View = 'perspective' | 'plan' | 'terrace';
const ORBITS: Record<View, string> = { perspective: '25deg 45deg 80%', plan: '0deg 0deg 100%', terrace: '125deg 50deg 85%' };

// One model-viewer for the explorer. Changing `src` (a different home's model) fades to a veil
// and back in on load, instead of tearing down the viewer.
export default function ResidenceModel({ src, poster }: { src: string; poster?: string }) {
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
  if (el) el.cameraOrbit = ORBITS[next];
  setView(next);
 };
 const loading = loadedSrc !== src && !error;
 return <div className={s.modelShell} ref={host}>
  {ready && createElement('model-viewer', {
   src, poster, alt: 'Rotatable furnished cutaway of the apartment',
   'camera-controls': true, 'touch-action': 'pan-y', 'camera-orbit': ORBITS.perspective, 'interpolation-decay': '120',
   'min-camera-orbit': 'auto 0deg 9m', 'max-camera-orbit': 'auto 85deg 200%', 'field-of-view': '35deg',
   exposure: '1.05', 'shadow-intensity': '1', 'shadow-softness': '1', 'environment-image': 'neutral', 'interaction-prompt': 'none', loading: 'eager',
   style: { width: '100%', height: '100%' },
  })}
  <div className={s.modelVeil} data-visible={loading || undefined} aria-hidden={!loading}>
   <span className={s.spinner} /><span>Preparing the 3D model</span>
  </div>
  {error && <div className={s.modelVeil} data-visible><span>The 3D model can’t be shown on this device.</span></div>}
  <div className={s.modelTools}>
   <SegmentedControl id="model-view" label="Model view" variant="glass" value={view} onChange={change}
    options={[{ value: 'perspective', label: '3D', icon: Box }, { value: 'plan', label: 'Top', icon: LayoutPanelLeft }, { value: 'terrace', label: 'Outdoor', icon: Trees }]} />
   <button type="button" className={s.glassIcon} aria-label="Reset the view" title="Reset the view" onClick={() => change('perspective')}><RotateCcw size={16} strokeWidth={1.6} aria-hidden /></button>
  </div>
 </div>;
}
