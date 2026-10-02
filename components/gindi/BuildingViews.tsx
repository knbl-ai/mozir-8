'use client';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { VIEWS, type Dir } from '@/content/projects/gindi';
import { gindiText } from './strings';
import s from './gindi.module.css';

const DIRS: Dir[] = ['north', 'east', 'south', 'west'];
const ANGLE: Record<Dir, number> = { north: 0, east: 90, south: 180, west: 270 };
// Compass letters stay N/E/S/W in Hebrew too: מזרח and מערב share their first letter.
const LETTER: Record<Dir, string> = { north: 'N', east: 'E', south: 'S', west: 'W' };

// A compass with the building at its centre: the gold wedge is where the picture looks; the letters choose a direction.
function Compass({ dir, onDir }: { dir: Dir; onDir: (d: Dir) => void }) {
 const lang = useLang(); const t = gindiText[lang];
 // The wedge: 70° of view, out to the ring.
 const wedge = 'M0,0 L-24.5,-35 A42.7,42.7 0 0,1 24.5,-35 Z';
 return <svg className={s.compass} viewBox="-60 -60 120 120" role="group" aria-label={t.viewCompass}>
  <circle r="46" className={s.compassRing} />
  {Array.from({ length: 36 }, (_, i) => <line key={i} x1="0" y1={-46} x2="0" y2={i % 9 === 0 ? -40 : -43.5} transform={`rotate(${i * 10})`} className={s.compassTick} />)}
  {/* Turns about the compass centre (the SVG origin), not the wedge's own box. */}
  <g className={s.compassTurn} style={{ transform: `rotate(${ANGLE[dir]}deg)` }}>
   <path d={wedge} className={s.compassWedge} />
  </g>
  <rect x="-5" y="-5" width="10" height="10" className={s.compassTower} />
  {DIRS.map(d => {
   const a = ANGLE[d] * Math.PI / 180, x = Math.sin(a) * 54, y = -Math.cos(a) * 54;
   return <g key={d} className={s.compassDir} data-on={d === dir || undefined} role="button" tabIndex={0} aria-label={t.dir[d]} aria-pressed={d === dir}
    onClick={() => onDir(d)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDir(d); } }}>
    <circle cx={x} cy={y} r="8" /><text x={x} y={y}>{LETTER[d]}</text>
   </g>;
  })}
 </svg>;
}

// The outlook from the building, one direction at a time. It belongs to the tower, not to a home:
// the stills are general views of the surroundings, not what any one window sees.
export default function BuildingViews({ building, open, onOpenChange }: { building: number; open: boolean; onOpenChange: (o: boolean) => void }) {
 const lang = useLang(); const t = gindiText[lang];
 const [dir, setDir] = useState<Dir>('north');
 return <Dialog.Root open={open} onOpenChange={onOpenChange}>
  <Dialog.Portal>
   <Dialog.Overlay className={s.lightboxOverlay} />
   <Dialog.Content className={`${s.dialog} ${s.buildingViews}`} aria-describedby={undefined}>
    <div className={s.bvStill}>
     <AnimatePresence initial={false}>
      <motion.img key={dir} src={VIEWS[dir]} alt={`${t.buildingViews} · ${t.dir[dir]}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .35 }} />
     </AnimatePresence>
     <span className={s.mediaCaption}>{t.dir[dir]} · {t.illustrative}</span>
    </div>
    <aside className={s.bvSide}>
     <p className={s.kicker}>{t.buildingN(building)}</p>
     <Dialog.Title className={s.ciTitle}>{t.buildingViews}</Dialog.Title>
     <Compass dir={dir} onDir={setDir} />
     <div className={s.chips} role="group" aria-label={t.viewCompass}>
      {DIRS.map(d => <button key={d} type="button" className={s.chip} aria-pressed={dir === d} onClick={() => setDir(d)}>{t.dir[d]}</button>)}
     </div>
     <motion.div key={dir} className={s.bvWhat} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }}>
      <span>{t.viewLooking} {t.dir[dir]}</span>
      <p>{t.viewWhat[dir]}</p>
     </motion.div>
     <p className={s.ciNote}>{t.viewsNote}</p>
    </aside>
    <Dialog.Close className={s.dialogClose} aria-label={t.close}><X size={18} strokeWidth={1.4} /></Dialog.Close>
   </Dialog.Content>
  </Dialog.Portal>
 </Dialog.Root>;
}
