'use client';
// From the building to one home, in three connected steps on one light ground:
// 1 the residence (hover a shell in the waterfront picture and it lights up), 2 the floor, 3 the home with its plan and
// photographs. Steps 1 and 2 are real pictures; choosing a single home on the floor is still under construction, so
// step 3 shows C-905, the one home that has a plan picture and photographs, whenever Residence C, floor 9 is chosen.
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import ResidencePlan from './ResidencePlan';
import { FLOOR_NOTES, MEDIA, SHELLS, type ShellId } from './content';
import s from './oystra.module.css';

const EASE = [0.16, 0.8, 0.2, 1] as const;
const pad = (n: number) => String(n).padStart(2, '0');

export default function HomeFinder({ onOpen }: { onOpen: (shotId: string) => void }) {
 const [res, setRes] = useState<ShellId>('C');
 const [floor, setFloor] = useState(9);
 const [hover, setHover] = useState<ShellId | null>(null);
 const shell = SHELLS.find(x => x.id === res)!;
 const lit = hover ?? res;
 const pick = (id: ShellId) => { setRes(id); const top = SHELLS.find(x => x.id === id)!.floors; if (floor > top) setFloor(top); };
 const note = FLOOR_NOTES[res]?.find(n => floor >= n.from && floor <= n.to)?.text;
 const hasHome = res === 'C' && floor === 9;

 return <div className={s.finder}>
  {/* step 1 */}
  <div className={s.step}>
   <p className={s.stepHead}><span>1</span>Choose a residence</p>
   <div className={s.shells}>
    <div className={s.shellsIn}>
     <img src={`${MEDIA}/opening/hd-front-day.webp`} alt="The four Oystra residences seen from the water" loading="lazy" />
     <svg viewBox="0 0 1920 1080" aria-hidden="true">
      <defs>{SHELLS.map(x => <clipPath key={x.id} id={`shell-${x.id}`}><polygon points={x.zone} /></clipPath>)}</defs>
      <rect className={s.shellsDim} width="1920" height="1080" />
      {/* the chosen shell at night: its windows light up */}
      {SHELLS.map(x => <image key={x.id} href={`${MEDIA}/opening/hd-front-night.webp`} width="1920" height="1080" clipPath={`url(#shell-${x.id})`} className={s.shellNight} data-on={lit === x.id || undefined} />)}
      {SHELLS.map(x => <polygon key={x.id} points={x.zone} className={s.shellZone} data-on={res === x.id || undefined} pathLength={1}
       onPointerEnter={e => { if (e.pointerType === 'mouse') setHover(x.id); }} onPointerLeave={() => setHover(null)} onClick={() => pick(x.id)} />)}
     </svg>
     {SHELLS.map(x => <button key={x.id} type="button" className={s.pin} data-on={res === x.id || undefined} style={{ left: `${x.at[0] / 19.2}%`, top: `${x.at[1] / 10.8}%` }}
      onPointerEnter={e => { if (e.pointerType === 'mouse') setHover(x.id); }} onPointerLeave={() => setHover(null)} onFocus={() => setHover(x.id)} onBlur={() => setHover(null)} onClick={() => pick(x.id)} aria-pressed={res === x.id}>Residence {x.id}</button>)}
    </div>
   </div>
  </div>

  {/* step 2 */}
  <div className={s.step}>
   <p className={s.stepHead}><span>2</span>Choose a floor<em>Residence {res} · {shell.floors} floors</em></p>
   <div className={s.floorRow}>
    <div className={s.ladder} role="group" aria-label={`Floors of Residence ${res}`}>
     {Array.from({ length: shell.floors }, (_, i) => shell.floors - i).map(n => <button key={n} type="button" data-on={n === floor || undefined} aria-pressed={n === floor} onClick={() => setFloor(n)}>{n}</button>)}
    </div>
    <div className={s.plate}>
     <AnimatePresence mode="wait">
      <motion.img key={`${res}-${floor}`} src={`${MEDIA}/floors/${res}-${pad(floor)}.webp`} alt={`Developer's floor layout of Residence ${res}, floor ${floor}`}
       initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={{ duration: .45, ease: EASE }} />
     </AnimatePresence>
    </div>
    <div className={s.floorSide}>
     <p className={s.eyebrow}>Residence {res}</p>
     <h3 className={s.roomName}>Floor {floor}</h3>
     {note && <p className={s.sideLine}>{note}</p>}
     <p className={s.sideLine}>The picture is the developer's floor layout, ocean side up. Each coloured cell is one home.</p>
     <p className={s.construction}><span className={s.tag}>Under construction</span>Choosing a home by pointing at it on this floor.</p>
    </div>
   </div>
  </div>

  {/* step 3 */}
  <div className={s.step}>
   <p className={s.stepHead}><span>3</span>The home<em>{hasHome ? 'C-905 · two bedrooms · Type 65' : `Residence ${res} · floor ${floor}`}</em></p>
   {hasHome ? <ResidencePlan onOpen={onOpen} /> : <div className={s.placeholder} style={{ aspectRatio: '16 / 6' }}><div className={s.placeholderIn}>
    <span className={s.tag}>Under construction</span><p className={s.placeholderTitle}>Homes on floor {floor} of Residence {res}</p>
    <p>Plan and photographs are made for C-905 so far. Choose Residence C, floor 9 to see it.</p>
    <button type="button" className={s.jump} onClick={() => { setRes('C'); setFloor(9); }}>Show C-905</button></div></div>}
  </div>
 </div>;
}
