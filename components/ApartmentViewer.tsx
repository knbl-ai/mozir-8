'use client';
import { createElement, useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { mozirText } from '@/components/mozir/strings';
type Viewer = HTMLElement & { cameraOrbit: string; fieldOfView: string; resetTurntableRotation: () => void };
type View = 'perspective' | 'plan' | 'terrace';
export default function ApartmentViewer({compact=false}:{compact?:boolean}) {
 const t = mozirText[useLang()].viewer;
 const host = useRef<HTMLDivElement>(null);
 const [ready, setReady] = useState(false);
 const [loaded, setLoaded] = useState(false);
 const [error, setError] = useState(false);
 const [view, setView] = useState<View>('perspective');
 useEffect(() => { import('@google/model-viewer').then(() => setReady(true)).catch(() => setError(true)); }, []);
 useEffect(() => {
  const el = host.current?.querySelector('model-viewer'); if (!el) return;
  const done = () => setLoaded(true); const fail = () => setError(true);
  el.addEventListener('load', done); el.addEventListener('error', fail);
  return () => { el.removeEventListener('load', done); el.removeEventListener('error', fail); };
 }, [ready]);
 const change = (name: View) => { const el = host.current?.querySelector('model-viewer') as Viewer; if(!el) return;
  el.cameraOrbit = name === 'plan' ? `0deg 0deg ${compact?'100%':'110%'}` : name === 'terrace' ? `125deg 50deg ${compact?'85%':'110%'}` : `25deg 45deg ${compact?'80%':'110%'}`;
  setView(name);
 };
 return <div className="viewer-shell" ref={host}>
  {ready && createElement('model-viewer', {
   src: '/models/apartment.glb', alt: t.alt,
   'camera-controls': true, 'touch-action': 'pan-y', 'camera-orbit': compact?'25deg 45deg 80%':'25deg 45deg 110%',
   'min-camera-orbit': 'auto 0deg 9m', 'max-camera-orbit': 'auto 85deg 200%',
   'field-of-view': '35deg', exposure: '1.05', 'shadow-intensity': '1', 'shadow-softness': '1',
   'environment-image': 'neutral', 'interaction-prompt': 'none', loading: 'eager',
   style: { width: '100%', height: '100%' },
  })}
  {!loaded && !error && <div className="viewer-loading"><span className="spinner"/>{t.loading}</div>}
  {error && <div className="viewer-loading">{t.failed}<a className="text-link" href="/media/apartment-plan.pdf" target="_blank" rel="noreferrer">{t.planLink} <span className="dir-arrow">↗</span></a></div>}
  <span className="viewer-tag">{t.tag}</span>
  <div className="viewer-tools">{(['perspective','plan','terrace'] as const).map(name => <button key={name} aria-pressed={view===name} title={t.views[name]} aria-label={t.views[name]} onClick={()=>change(name)}>{compact?t.compact[name]:t.views[name]}</button>)}<button aria-label={t.reset} onClick={()=>change('perspective')}>↺</button></div>
  <span className="viewer-hint">{t.rotate} <i/> {t.zoom}</span>
 </div>;
}
