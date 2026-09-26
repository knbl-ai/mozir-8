'use client';
import { createElement, useEffect, useRef, useState } from 'react';
type Viewer = HTMLElement & { cameraOrbit: string; fieldOfView: string; resetTurntableRotation: () => void };
export default function ApartmentViewer({compact=false}:{compact?:boolean}) {
 const host = useRef<HTMLDivElement>(null);
 const [ready, setReady] = useState(false);
 const [loaded, setLoaded] = useState(false);
 const [error, setError] = useState(false);
 const [view, setView] = useState('Perspective');
 useEffect(() => { import('@google/model-viewer').then(() => setReady(true)).catch(() => setError(true)); }, []);
 useEffect(() => {
  const el = host.current?.querySelector('model-viewer'); if (!el) return;
  const done = () => setLoaded(true); const fail = () => setError(true);
  el.addEventListener('load', done); el.addEventListener('error', fail);
  return () => { el.removeEventListener('load', done); el.removeEventListener('error', fail); };
 }, [ready]);
 const change = (name: string) => { const el = host.current?.querySelector('model-viewer') as Viewer; if(!el) return;
  el.cameraOrbit = name === 'Plan view' ? `0deg 0deg ${compact?'100%':'110%'}` : name === 'Terrace' ? `125deg 50deg ${compact?'85%':'110%'}` : `25deg 45deg ${compact?'80%':'110%'}`;
  setView(name);
 };
 return <div className="viewer-shell" ref={host}>
  {ready && createElement('model-viewer', {
   src: '/models/apartment.glb', alt: 'Rotatable furnished cutaway of Apartment 02, including the full wraparound terrace',
   'camera-controls': true, 'touch-action': 'pan-y', 'camera-orbit': compact?'25deg 45deg 80%':'25deg 45deg 110%',
   'min-camera-orbit': 'auto 0deg 9m', 'max-camera-orbit': 'auto 85deg 200%',
   'field-of-view': '35deg', exposure: '1.05', 'shadow-intensity': '1', 'shadow-softness': '1',
   'environment-image': 'neutral', 'interaction-prompt': 'none', loading: 'eager',
   style: { width: '100%', height: '100%' },
  })}
  {!loaded && !error && <div className="viewer-loading"><span className="spinner"/>Preparing your private viewing…</div>}
  {error && <div className="viewer-loading">The 3D viewer could not load on this device.<a className="text-link" href="/media/apartment-plan.pdf" target="_blank" rel="noreferrer">View the apartment plan ↗</a></div>}
  <span className="viewer-tag">APARTMENT 02 / INTERACTIVE MODEL</span>
  <div className="viewer-tools">{['Perspective','Plan view','Terrace'].map(name => <button key={name} aria-pressed={view===name} title={name} aria-label={name} onClick={()=>change(name)}>{compact?(name==='Perspective'?'3D':name==='Plan view'?'Plan':'Terrace'):name}</button>)}<button aria-label="Reset apartment view" onClick={()=>change('Perspective')}>↺</button></div>
  <span className="viewer-hint">Drag to rotate <i/> Scroll or pinch to zoom</span>
 </div>;
}
