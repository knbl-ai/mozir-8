'use client';
// One floor of one residence, drawn in the page's own style: the smooth outer line of the floor and one smooth cell per
// home. Hover previews a home, click chooses it; the home's plan and photographs follow below. For the demo this is
// Residence C, floor 9 (public/projects/oystra/level/c-09.json, made by pipeline/signature/building/level9.py).
import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import ResidencePlan from './ResidencePlan';
import { MEDIA } from './content';
import s from './oystra.module.css';

type Home = { id: string; poly: number[][]; at: [number, number]; beds: number; type: string; unit: number; balcony: number; total: number; page: number };
type Level = { residence: string; floor: number; w: number; h: number; outline: number[][]; homes: Home[] };
const EASE = [0.16, 0.8, 0.2, 1] as const;
const BEDS = ['', 'One bedroom', 'Two bedrooms', 'Three bedrooms', 'Four bedrooms'];
const path = (p: number[][]) => `M${p.map(([x, y]) => `${x} ${y}`).join('L')}Z`;
const m2 = (n: number) => `${n.toFixed(2)} m²`;
const FULL = 'C-905';   // the one home with our own plan picture and photographs so far

export default function LevelPlan({ onOpen, foot }: { onOpen: (shotId: string) => void; foot: ReactNode }) {
 const [level, setLevel] = useState<Level | null>(null);
 const [chosen, setChosen] = useState(FULL);
 const [hover, setHover] = useState<string | null>(null);
 useEffect(() => { let gone = false; fetch(`${MEDIA}/level/c-09.json`).then(r => r.json()).then(d => { if (!gone) setLevel(d); }).catch(() => {}); return () => { gone = true; }; }, []);
 const home = level?.homes.find(h => h.id === chosen), shown = level?.homes.find(h => h.id === (hover ?? chosen));

 return <>
  <div id="level" className={s.level}>
   <div className={s.levelPlan}>
    <span className={s.levelSide}>Ocean</span>
    {level && <svg viewBox={`0 0 ${level.w} ${level.h}`} role="group" aria-label={`Homes on floor ${level.floor} of Residence ${level.residence}`}>
     <path className={s.levelOutline} d={path(level.outline)} />
     {level.homes.map(h => <path key={h.id} d={path(h.poly)} className={s.cell} data-beds={h.beds} data-on={h.id === chosen || undefined} data-hot={h.id === hover || undefined}
      onPointerEnter={e => { if (e.pointerType === 'mouse') setHover(h.id); }} onPointerLeave={() => setHover(null)} onClick={() => setChosen(h.id)}
      tabIndex={0} role="button" aria-pressed={h.id === chosen} aria-label={`${h.id}, ${BEDS[h.beds].toLowerCase()}, ${m2(h.total)}`}
      onFocus={() => setHover(h.id)} onBlur={() => setHover(null)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setChosen(h.id); } }} />)}
     {level.homes.map(h => <text key={h.id} x={h.at[0]} y={h.at[1] + 9} className={s.cellNo} data-on={h.id === chosen || undefined}>{h.id.slice(2)}</text>)}
    </svg>}
    <span className={s.levelSide}>Boulevard</span>
   </div>

   <div className={s.levelText}>
    <p className={s.eyebrow}>Residence C · floor 9 · 15 homes</p>
    <h2 className={s.title}>Choose a home</h2>
    <ul className={s.legend}><li data-beds="1">One bedroom</li><li data-beds="2">Two bedrooms</li><li data-beds="3">Three bedrooms</li></ul>
    <div className={s.levelCard} aria-live="polite">
     <AnimatePresence mode="wait">
      {shown && <motion.div key={shown.id} initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={{ duration: .35, ease: EASE }}>
       <p className={s.levelNo}>{shown.id}</p>
       <p className={s.levelKind}>{BEDS[shown.beds]} · Type {shown.type}</p>
       <dl className={s.levelFacts}><div><dt>Interior</dt><dd>{m2(shown.unit)}</dd></div><div><dt>Balcony</dt><dd>{m2(shown.balcony)}</dd></div><div><dt>Total</dt><dd>{m2(shown.total)}</dd></div></dl>
       <p className={s.small}>{shown.id === chosen ? 'Chosen. Its plan is below.' : 'Click to choose this home.'}</p>
      </motion.div>}
     </AnimatePresence>
    </div>
   </div>
  </div>

  {home && <div className={s.homeBlock}>
   <div className={s.homeHead}>
    <p className={s.eyebrow}>The home</p>
    <h2 className={s.title}>{home.id === FULL ? <>C-905, a sea home<br />on the ninth floor</> : <>{home.id}, {BEDS[home.beds].toLowerCase()}<br />on the ninth floor</>}</h2>
   </div>
   {home.id === FULL ? <><ResidencePlan onOpen={onOpen} />{foot}</> : <div className={s.devHome}>
    <img src={`${MEDIA}/level/${home.id}.webp`} alt={`The developer's floor plan of ${home.id}`} loading="lazy" />
    <div><span className={s.tag}>Developer's plan</span><p className={s.sideLine}>This is the developer's own drawing of {home.id}. Our plan picture and photographs are made for C-905 so far; the other homes follow.</p>
     <button type="button" className={s.jump} onClick={() => setChosen(FULL)}>Show C-905</button></div>
   </div>}
  </div>}
 </>;
}
