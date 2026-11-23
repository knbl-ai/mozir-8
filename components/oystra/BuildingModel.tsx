'use client';
// The building above the residence: the four shells as stacked frosted plates that turn. Drag turns it, hovering a
// floor lights it and names it. Selecting a floor and a home comes next.
import { useEffect, useRef, useState } from 'react';
import { MEDIA } from './content';
import s from './oystra.module.css';

export default function BuildingModel() {
 const stage = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null);
 const [tip, setTip] = useState('');
 const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');
 useEffect(() => {
  let off: (() => void) | undefined, gone = false;
  Promise.all([import('./shellStack'), fetch(`${MEDIA}/building/model.json`).then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })])
   .then(([m, data]) => { if (gone || !stage.current || !canvas.current) return; off = m.mountBuilding(stage.current, canvas.current, data, setTip); setState('ready'); })
   .catch(() => { if (!gone) setState('failed'); });
  return () => { gone = true; off?.(); };
 }, []);
 return <div ref={stage} className={s.model} data-state={state}>
  <canvas ref={canvas} role="img" aria-label="The four Oystra residences as a turning model of stacked floor plates" />
  <p className={s.modelTip} aria-live="polite">{tip}</p>
  {state === 'ready' && <p className={s.modelHint}>Drag to turn</p>}
  {state === 'failed' && <p className={s.modelFail}>The model could not be loaded. Reload the page to try again.</p>}
 </div>;
}
