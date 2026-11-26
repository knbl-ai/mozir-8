'use client';
// The living room builds itself as the page scrolls: one take cut into frames (the finished room, empty → furnished,
// curtains last; the camera never moves), drawn on a canvas by scroll position, with a caption per stage over the picture. Frames: public/projects/oystra/<dir>/hd, 1080p (the 480p drafts stay beside them in fr).
import { useEffect, useRef, useState } from 'react';
import { MEDIA } from './content';
import s from './oystra.module.css';

export type Stage = { from: number; eyebrow: string; title: string; text: string };
export type Film = { id: string; dir: string; frames: number; stages: Stage[] };
// from: where a stage begins, as a share of the film. Sizes are the developer's plan of C-905; finishes are our design for it.
export const BUILD: Film = { id: 'build', dir: 'build', frames: 97, stages: [
 { from: 0, eyebrow: 'Residence C-905 · floor 9', title: 'An empty room, a wall of glass.', text: 'Keep scrolling. The living room is furnished in front of you.' },
 { from: .12, eyebrow: 'Stone, ivory, marble', title: 'First the long lines.', text: 'A low console under the marble wall, and a rug the colours of the lagoon.' },
 { from: .42, eyebrow: 'Living and dining · 6.0 × 4.2 m', title: 'Then the places to sit.', text: 'A curved sofa, a stone table on brass, and chairs turned to the sea.' },
 { from: .8, eyebrow: 'Balcony · 11.5 × 2.5 m', title: 'Last, the curtains.', text: 'Sheer linen at the glass, and beyond it eleven and a half metres of curved terrace.' },
] };
// Two takes joined on one frame: the building from the water → one terrace of the arch → through its curtains into the room.
export const DIVE: Film = { id: 'dive', dir: 'dive', frames: 265, stages: [
 { from: 0, eyebrow: 'Oystra · Al Marjan Island', title: 'Four shells at the water’s edge.', text: 'Keep scrolling, and come closer.' },
 { from: .2, eyebrow: 'The arch', title: 'Terraces in long curved lines.', text: 'Every home opens onto its own band of the facade.' },
 { from: .46, eyebrow: 'Residence C', title: 'One terrace among them.', text: 'Two chairs, a glass rail, and curtains drawn against the evening sun.' },
 { from: .78, eyebrow: 'Residence C-905 · two bedrooms', title: 'And the home behind it.', text: 'Living and dining, 6.0 × 4.2 m, open to the terrace from wall to wall.' },
] };

// The section's two edges are drawn like the building: stacked curved bands, the rose-gold Line on the last one.
// Top: the night band above ends in these curves and slides off the picture. Bottom: pearl bands rise over it.
const BANDS = ['M0 0H1000V150C800 214 610 96 400 142S110 236 0 176Z', 'M0 0H1000V104C810 170 600 58 400 100S120 190 0 128Z', 'M0 0H1000V58C820 126 590 18 400 58S130 144 0 80Z'];
const LINE = 'M1000 58C820 126 590 18 400 58S130 144 0 80';
export function Edge({ side, tone, lift }: { side: 'top' | 'bottom'; tone?: 'pearl' | 'night'; lift?: boolean }) {
 return <svg className={s.buildEdge} data-side={side} data-tone={tone} data-lift={lift || undefined} viewBox="0 0 1000 240" preserveAspectRatio="none" aria-hidden="true">
  {BANDS.map((d, i) => <path key={d} d={d} opacity={[.3, .6, 1][i]} />)}
  <path className={s.buildEdgeLine} d={LINE} />
 </svg>;
}

// pearl bands hanging from the top of a night block that follows a pearl section
export function PearlTop() {
 return <svg className={s.locEdge} viewBox="0 0 1000 240" preserveAspectRatio="none" aria-hidden="true">
  {BANDS.map((d, i) => <path key={d} d={d} opacity={[.3, .6, 1][i]} />)}
  <path className={s.buildEdgeLine} d={LINE} />
 </svg>;
}

// cut: the section above is cut by this section's top curve (this one slides up under it), instead of ending in a dark band
// over: something to stand over the picture in place of the stage captions (the enquiry sheet on the furnishing film)
export default function BuildScroll({ film, lead, before, after = 'pearl', over, cut }: { film: Film; cut?: boolean; before?: 'pearl'; lead?: { eyebrow: string; title: string; text: string }; after?: 'pearl' | 'night'; over?: React.ReactNode }) {
 const { id, dir, frames: FRAMES, stages: STAGES } = film;
 const root = useRef<HTMLElement>(null);
 const canvas = useRef<HTMLCanvasElement>(null);
 const bar = useRef<HTMLSpanElement>(null);
 const [stage, setStage] = useState(0);

 useEffect(() => {
  const el = root.current, cv = canvas.current;
  if (!el || !cv) return;
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  const frame = (i: number) => `${MEDIA}/${dir}/hd/${String(i + 1).padStart(4, '0')}.webp`;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const imgs: HTMLImageElement[] = [];
  let shown = -1, cur = 0, target = 0, raf = 0, live = true;

  const draw = (i: number) => {
   // the nearest frame that has arrived, so the picture never goes blank while frames load
   let k = i;
   while (k > 0 && !(imgs[k]?.complete && imgs[k].naturalWidth)) k--;
   const im = imgs[k];
   if (!im?.complete || !im.naturalWidth || k === shown) return;
   if (cv.width !== im.naturalWidth) { cv.width = im.naturalWidth; cv.height = im.naturalHeight; }
   ctx.drawImage(im, 0, 0);
   shown = k;
  };
  const read = () => {
   const r = el.getBoundingClientRect();
   const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
   target = p * (FRAMES - 1);
   if (bar.current) bar.current.style.transform = `scaleX(${p})`;
   el.toggleAttribute('data-done', p >= .97);   // the film has played: its Skip button goes
   el.toggleAttribute('data-why', p >= .04 && p < .46);   // the first part of the film: the overlay text over it (why own here), gone before the form
   el.toggleAttribute('data-end', p >= .5);   // half of the film has played: whatever stands over it (the enquiry card) may arrive
   let n = 0;
   STAGES.forEach((st, i) => { if (p >= st.from) n = i; });
   setStage(n);
  };
  const tick = () => {
   if (!live) return;
   cur = still ? target : cur + (target - cur) * .16;   // a short glide behind the scroll
   draw(Math.round(cur));
   raf = requestAnimationFrame(tick);
  };
  for (let i = 0; i < FRAMES; i++) {
   const im = new Image();
   im.decoding = 'async';
   im.src = frame(i);
   if (i === 0) im.onload = () => draw(0);
   imgs.push(im);
  }
  read();
  addEventListener('scroll', read, { passive: true });
  addEventListener('resize', read);
  raf = requestAnimationFrame(tick);
  return () => { live = false; cancelAnimationFrame(raf); removeEventListener('scroll', read); removeEventListener('resize', read); };
 }, [FRAMES, STAGES, dir]);

 return <>
  {lead && <div className={`${s.night} ${s.buildLead}`} data-before={before}>
   {before && <PearlTop />}
   <div className={s.wrap}>
    <p className={s.eyebrow} data-reveal>{lead.eyebrow}</p>
    <h2 className={s.title} data-reveal style={{ '--i': 1 } as React.CSSProperties}>{lead.title}</h2>
    <p className={s.lede} data-reveal style={{ '--i': 2 } as React.CSSProperties}>{lead.text}</p>
   </div>
  </div>}
  <section ref={root} id={id} className={s.build} data-cut={cut || undefined} aria-label={STAGES[0].title}>
   <Edge side="top" />
   <div className={s.buildPin}>
    <div className={s.buildFrame}>
     <canvas ref={canvas} width={1920} height={1080} />
    </div>
    {over ?? <div className={s.buildText} aria-live="polite">
     {STAGES.map((st, i) => <div key={st.title} className={s.buildStage} data-on={i === stage || undefined} aria-hidden={i !== stage}>
      <p className={s.eyebrow}>{st.eyebrow}</p>
      <h2 className={s.roomName}>{st.title}</h2>
      <p className={s.sideLine}>{st.text}</p>
     </div>)}
    </div>}
    <button type="button" className={s.skip} onClick={() => { const el = root.current; if (el) scrollTo({ top: el.getBoundingClientRect().bottom + scrollY - innerHeight, behavior: 'smooth' }); }}>Skip <span aria-hidden="true">↓</span></button>
    <span className={s.buildBar}><span ref={bar} /></span>
   </div>
   <Edge side="bottom" tone={after} />
  </section>
 </>;
}
