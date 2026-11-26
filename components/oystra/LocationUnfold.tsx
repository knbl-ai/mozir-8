'use client';
// The project told under the hero, in one pinned section moved by scroll: Al Marjan draws itself and Oystra lands on it,
// the project in figures, the list of what the building has, then the map draws back, journey by journey, to Dubai. Engine: locationEngine.ts.
// Drawn in the style of the film's map chapter (blue shore and streets, gold for the project), on the page's night ground. Map: line art traced from
// OpenStreetMap; footprints: the developer's floor layouts (both made by pipeline/signature/locmap in the pipeline repo).
import { useEffect, useRef } from 'react';
import { MEDIA } from './content';
import { loadGsap } from './OystraOpening';
import { mountLocation, type Story } from './locationEngine';
import { PearlTop } from './BuildScroll';
import s from './oystra.module.css';

// hairline icons on a 48 grid
const I = {
 wave: 'M4 20c5-6 9-6 14 0s9 6 14 0 9-6 12 0M4 32c5-6 9-6 14 0s9 6 14 0 9-6 12 0',
 pool: 'M6 36c4-4 8-4 12 0s8 4 12 0 8-4 12 0M16 30V11a4 4 0 0 1 8 0M30 30V11a4 4 0 0 1 8 0M16 21h14',
 shade: 'M24 8v34M6 22a18 18 0 0 1 36 0zM24 8c-6 4-8 9-8 14M24 8c6 4 8 9 8 14M16 42h16',
 leaf: 'M24 42c-10-6-14-16-10-30 12 2 20 12 10 30zM24 42c3-10 1-19-6-25',
 racket: 'M30 26a11 11 0 1 0-12-12c0 5 2 9 5 12L8 42',
 film: 'M6 14h36v24H6zM6 20h36M12 14l4 6M22 14l4 6M32 14l4 6M20 26l10 5-10 5z',
 flag: 'M17 42V6l17 7-17 7M9 42h18',
 bell: 'M8 36h32M12 36a12 12 0 0 1 24 0M24 24v-4M20 20h8M6 42h36',
 gem: 'M12 8h24l8 10-20 24L4 18zM4 18h40M18 8l-4 10 10 24 10-24-4-10',
 coin: 'M24 6a18 18 0 1 0 0 36 18 18 0 1 0 0-36zM30 17c-1-3-4-4-6-4-4 0-7 2-7 5 0 7 13 4 13 11 0 3-3 5-7 5-3 0-6-1-7-4M24 9v4M24 34v5',
 key: 'M17 13a9 9 0 1 0 0 18 9 9 0 1 0 0-18zM26 22h18M38 22v7M44 22v5',
 star: 'M24 6l5 12 13 1-10 8 3 13-11-7-11 7 3-13-10-8 13-1z',
};
// What the section says, with where each fact comes from. The homes, the lagoon and the facilities are told by the film
// section above (FilmSection.tsx) and why own here by the furnishing film below (EnquiryPanel.tsx), so the map tells the
// island (admin 2026-11-26). Area 2.7 million m², work begun 2007, the four islands' names, ~21 km of new coastline:
// Wikipedia "Al Marjan Island", Zawya (2007-10-09, Rakeen begins dredging), Khaleej Times (Rakeen completes reclamation).
// Opened 2013: RAK Media Office. Four coral-shaped islands, Wynn opening 2027: OYSTRA_FACTSHEET.pdf. 4.5 km of
// beachfront: BROCHURE_EN.pdf.
const STORY: Story = {
 first: { eyebrow: 'Al Marjan Island · man-made', big: '2.7 million m²', lines: ['Raised from the Arabian Gulf from 2007: four coral-shaped islands, joined to the coast by a peninsula.'], note: 'Opened in 2013' },
 around: { eyebrow: 'The four islands', lines: ['Breeze · on the mainland', 'Treasure · Dream · View', '21 km of new coastline'] },
 has: { eyebrow: 'On the island', items: [[I.wave, '4.5 km of beachfront'], [I.shade, 'Boutique resorts'], [I.gem, 'Wynn Al Marjan · 2027'], [I.star, 'Northern emirates’ first']] },
 island: { eyebrow: 'Ras Al Khaimah', big: 'Al Marjan Island', line: 'Four coral-shaped islands reaching into the Arabian Gulf.' },
};

const script = (src: string) => new Promise<void>((ok, no) => {
 if (document.querySelector(`script[src="${src}"]`)) return ok();
 const e = document.createElement('script'); e.src = src; e.onload = () => ok(); e.onerror = no; document.head.append(e);
});

export default function LocationUnfold() {
 const root = useRef<HTMLElement>(null);
 useEffect(() => {
  const el = root.current;
  if (!el) return;
  let off: (() => void) | undefined, gone = false;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches || innerWidth < 900;   // then: no pin, the finished map
  if (still) el.setAttribute('data-still', '');
  const json = (f: string) => fetch(`${MEDIA}/map/${f}.json`).then(r => r.json());
  Promise.all([loadGsap(), json('geo'), json('selector2').catch(() => null)]).then(([gsap, geo, plan]) => {
   if (!gone) off = mountLocation(el, gsap, geo, STORY, still, plan);
  }).catch(() => { /* without the library or the data the section stays dark and the page below still works */ });
  return () => { gone = true; off?.(); };
 }, []);

 return <section ref={root} id="location" className={s.unfold} aria-label="Oystra: its four residences, what they have, and where they are">
  {/* the pearl section above ends in the same curved bands as the other joins */}
  <PearlTop />
  <div className={s.unfoldPin} data-g="stage">
   <svg className={s.unfoldMap} data-g="map" viewBox="921 210 215 134" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Plan of the four residences, then a map of Al Marjan Island and the coast from Dubai to Ras Al Khaimah with six journeys from Oystra">
    <defs>
     <radialGradient id="lu-gold" cx=".36" cy=".32" r=".85"><stop offset="0" stopColor="#FFFDF8" /><stop offset=".42" stopColor="#F3DFC8" /><stop offset="1" stopColor="#C9A074" /></radialGradient>
     <filter id="lu-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="55" /></filter>
     <mask id="lu-edge" maskUnits="userSpaceOnUse" x="-200" y="-200" width="2000" height="1800"><rect x="110" y="110" width="1380" height="1180" fill="#fff" filter="url(#lu-soft)" /></mask>
    </defs>
    <g data-g="world"><g data-g="far" mask="url(#lu-edge)" /><g data-g="wl" /><g data-g="land" /><g data-g="rd" /><g data-g="dt" /><g data-g="bld" /><g data-g="drv" /><g data-g="tripsG" /><g data-g="oy" /></g>
   </svg>
   {/* the story's captions, made by the engine: one at a time on the left, and on the right while the plan is in the middle */}
   {/* the places' marks and plates, made and placed by the engine over the map */}
   <div className={s.unfoldPins} data-g="pins" aria-hidden="true" />
   <div className={s.unfoldStory} data-g="story" />
   <div className={`${s.unfoldStory} ${s.unfoldStoryR}`} data-g="storyR" />
   {/* the story is long: one press runs it to its end (the whole coast and the far places), just before the next section rises */}
   <button type="button" className={s.skip} onClick={() => { const el = root.current; if (!el) return; const edge = Math.min(340, Math.max(120, innerWidth * .24)); scrollTo({ top: el.getBoundingClientRect().bottom + scrollY - innerHeight - edge, behavior: 'smooth' }); }}>Skip <span aria-hidden="true">↓</span></button>
  </div>
 </section>;
}
