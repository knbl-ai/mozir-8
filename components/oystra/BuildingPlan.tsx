'use client';
// The building, where a level is chosen: the shells' real silhouettes (traced from the developer's waterfront picture)
// drawn in the page's own style and sliced into one band per floor. Hover names a floor, click chooses it. For the demo
// one level is open, Residence C floor 9; the level widget below shows its homes.
// Data: public/projects/oystra/building/elevation.json (pipeline/signature/building/building_bands.py).
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MEDIA } from './content';
import s from './oystra.module.css';

type Band = { res: string; floor: number; poly: number[][]; at: [number, number]; homes: number; note: string };
type Elevation = { w: number; h: number; outline: number[][][]; bands: Band[]; labels: Record<string, number> };
const EASE = [0.16, 0.8, 0.2, 1] as const;
const OPEN = { res: 'C', floor: 9 };   // the one level with a floor plan so far
const path = (p: number[][]) => `M${p.map(([x, y]) => `${x} ${y}`).join('L')}Z`;
const key = (b: { res: string; floor: number }) => `${b.res}-${b.floor}`;
const kind = (b: Band) => b.note.startsWith('Sky') ? 'pool' : b.note ? 'pent' : 'homes';

export default function BuildingPlan({ onChoose }: { onChoose: () => void }) {
 const [el, setEl] = useState<Elevation | null>(null);
 const [hover, setHover] = useState<string | null>(null);
 useEffect(() => { let gone = false; fetch(`${MEDIA}/building/elevation.json`).then(r => r.json()).then(d => { if (!gone) setEl(d); }).catch(() => {}); return () => { gone = true; }; }, []);
 const shown = el?.bands.find(b => key(b) === (hover ?? key(OPEN)));
 const isOpen = (b: Band) => b.res === OPEN.res && b.floor === OPEN.floor;

 return <div id="building" className={s.building}>
  <div className={s.buildingHead}>
   <div>
    <p className={s.eyebrow}>The building · seen from the water</p>
    <h2 className={s.title}>Choose a level</h2>
    <ul className={s.legend}><li data-kind="homes">Homes</li><li data-kind="pent">Penthouses</li><li data-kind="pool">Sky pool</li></ul>
   </div>
   <div className={s.buildingCard} aria-live="polite">
    <AnimatePresence mode="wait">
     {shown && <motion.div key={key(shown)} initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={{ duration: .3, ease: EASE }}>
      <p className={s.levelNo}>{shown.res} · {shown.floor}</p>
      <p className={s.levelKind}>Residence {shown.res}, floor {shown.floor}</p>
      <p className={s.sideLine}>{shown.note || (shown.homes ? `${shown.homes} homes on this floor` : 'No separate homes on this level')}</p>
      <p className={s.small}>{isOpen(shown) ? 'Open. Its homes are below.' : 'Its floor plan is in production. Floor 9 of Residence C is open.'}</p>
     </motion.div>}
    </AnimatePresence>
   </div>
  </div>

  {el && <svg className={s.buildingSvg} viewBox={`0 -6 ${el.w} ${el.h + 44}`} role="group" aria-label="The four residences as floor bands">
   <path className={s.levelOutline} d={el.outline.map(path).join(' ')} fillRule="evenodd" />
   {el.bands.map(b => <path key={key(b)} d={path(b.poly)} className={s.bandCell} data-kind={kind(b)} data-on={isOpen(b) || undefined} data-hot={key(b) === hover || undefined}
    onPointerEnter={e => { if (e.pointerType === 'mouse') setHover(key(b)); }} onPointerLeave={() => setHover(null)} onClick={() => { if (isOpen(b)) onChoose(); else setHover(key(b)); }}
    tabIndex={0} role="button" aria-pressed={isOpen(b)} aria-label={`Residence ${b.res}, floor ${b.floor}${b.note ? `, ${b.note}` : b.homes ? `, ${b.homes} homes` : ''}`}
    onFocus={() => setHover(key(b))} onBlur={() => setHover(null)} onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && isOpen(b)) { e.preventDefault(); onChoose(); } }} />)}
   {Object.entries(el.labels).map(([res, x]) => <text key={res} x={x} y={el.h + 26} className={s.bandRes}>Residence {res}</text>)}
  </svg>}
 </div>;
}
