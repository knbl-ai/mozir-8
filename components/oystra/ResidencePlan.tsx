'use client';
// The residence as a photography page: one large photograph of the chosen room across the section; under it, in one row,
// the home seen from above (point at a room to choose it), the room's name and size, and its other photographs.
// Mouse: hover chooses. Touch and keyboard: tap or focus. The large photograph opens full screen.
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MEDIA, ROOMS } from './content';
import s from './oystra.module.css';

const EASE = [0.16, 0.8, 0.2, 1] as const;
const still = (id: string, small = false) => `${MEDIA}/c905/${id}${small ? '.sm' : ''}.webp`;
// everything outside the chosen room is washed with pearl: one path with the room cut out of it
const wash = (zone: string) => `M0 0H1000V1000H0Z M${zone.split(' ').join(' L')}Z`;

export default function ResidencePlan({ onOpen }: { onOpen: (shotId: string) => void }) {
 const [roomId, setRoomId] = useState(ROOMS[0].id);
 const [shot, setShot] = useState(0);
 const room = ROOMS.find(r => r.id === roomId) ?? ROOMS[0];
 const choose = (id: string) => { if (id !== roomId) { setRoomId(id); setShot(0); } };
 const main = room.shots[Math.min(shot, room.shots.length - 1)];
 const n = ROOMS.findIndex(r => r.id === room.id) + 1;

 return <div className={s.gallery}>
  <div className={s.galleryHead}>
   <div data-reveal>
    <p className={s.eyebrow}>Residence C-905</p>
    <h2 className={s.title}>The whole home, room by room.</h2>
   </div>
   <nav className={s.roomTabs} aria-label="Rooms" data-reveal style={{ '--i': 2 } as React.CSSProperties}>
    {ROOMS.map(r => <button key={r.id} type="button" data-on={r.id === roomId || undefined} aria-pressed={r.id === roomId}
     onPointerEnter={e => { if (e.pointerType === 'mouse') choose(r.id); }} onFocus={() => choose(r.id)} onClick={() => choose(r.id)}>{r.name}</button>)}
   </nav>
  </div>

  <button type="button" className={s.hero} data-reveal="photo" onClick={() => onOpen(main.id)} aria-label={`Enlarge: ${main.alt}`}>
   <AnimatePresence initial={false}>
    <motion.img key={main.id} src={still(main.id)} alt={main.alt}
     initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: .8, ease: 'easeInOut' }, scale: { duration: 1.6, ease: EASE } }} />
   </AnimatePresence>
   <span className={s.heroCount}>{String(n).padStart(2, '0')} / {String(ROOMS.length).padStart(2, '0')}</span>
  </button>

  <div className={s.galleryRow}>
   <div className={s.top} data-reveal>
    <img src={still('top', true)} loading="lazy"
     alt="Residence C-905 seen from above: the balcony on the left, two bedrooms, two bathrooms, the living and dining room with the kitchen" />
    <svg viewBox="0 0 1000 1000" role="group" aria-label="Choose a room on the plan">
     <path className={s.wash} d={wash(room.zone)} fillRule="evenodd" />
     {ROOMS.map(r => <polygon key={r.id} className={s.zone} data-on={r.id === roomId || undefined} points={r.zone} pathLength={1}
      onPointerEnter={e => { if (e.pointerType === 'mouse') choose(r.id); }} onClick={() => choose(r.id)}><title>{r.name}</title></polygon>)}
    </svg>
   </div>

   <div className={s.galleryText} aria-live="polite" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
    <AnimatePresence mode="wait">
     <motion.div key={room.id} initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }} transition={{ duration: .45, ease: EASE }}>
      <p className={s.eyebrow}>{room.size}</p>
      <h3 className={s.roomName}>{room.name}</h3>
      <p className={s.sideLine}>{room.line}</p>
     </motion.div>
    </AnimatePresence>
   </div>

   <div className={s.thumbs} data-reveal style={{ '--i': 2 } as React.CSSProperties}>
    {room.shots.map((x, i) => <button key={x.id} type="button" data-on={i === shot || undefined} aria-label={x.alt} aria-pressed={i === shot}
     onPointerEnter={e => { if (e.pointerType === 'mouse') setShot(i); }} onFocus={() => setShot(i)} onClick={() => setShot(i)}><img src={still(x.id, true)} alt="" loading="lazy" /></button>)}
   </div>
  </div>
 </div>;
}
