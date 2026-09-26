'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, Play } from 'lucide-react';
import type { ResolvedMedia, Residence } from '@/content/projects';
import { DUR, EASE, swap } from './motion';
import ResidenceModel from './ResidenceModel';
import s from './explorer.module.css';

export type MediaTab = 'plan' | 'film' | 'images' | 'model' | 'about';

// Show a new image only once it is decoded, so a swap never flashes an empty frame.
function useDecodedSrc(src: string) {
 const [shown, setShown] = useState(src);
 useEffect(() => {
  if (src === shown) return;
  let active = true;
  const img = new Image();
  img.src = src;
  img.decode().catch(() => {}).finally(() => { if (active) setShown(src); });
  return () => { active = false; };
 }, [src, shown]);
 return shown;
}

const fade = { initial: { opacity: 0, scale: 0.985, filter: 'blur(6px)' }, animate: { opacity: 1, scale: 1, filter: 'blur(0px)' }, exit: { opacity: 0, scale: 1.01, filter: 'blur(6px)' } };

function SampleTag({ show, children }: { show: boolean; children: string }) {
 return show ? <span className={s.sampleTag}>{children}</span> : null;
}

function PlanView({ src, title, onExpand }: { src: string; title: string; onExpand: () => void }) {
 const shown = useDecodedSrc(src);
 return <button type="button" className={s.planView} onClick={onExpand} aria-label={`Open the ${title} floor plan full screen`}>
  <AnimatePresence initial={false}>
   <motion.img key={shown} src={shown} alt={`${title} floor plan`} className={s.planImage} draggable={false} {...fade} transition={{ duration: DUR.slow, ease: EASE }} />
  </AnimatePresence>
  <span className={s.expandHint} aria-hidden><Maximize2 size={15} strokeWidth={1.6} /></span>
 </button>;
}

function FilmView({ film, placeholder }: { film: ResolvedMedia['film']; placeholder: boolean }) {
 const video = useRef<HTMLVideoElement>(null);
 const [playing, setPlaying] = useState(false);
 return <div className={s.filmView}>
  <AnimatePresence initial={false}>
   <motion.div key={film.src} className={s.filmLayer} {...fade} transition={swap}>
    <video ref={video} src={film.src} poster={film.poster} playsInline muted preload="metadata" controls={playing}
     onPlay={() => setPlaying(true)} onEnded={() => setPlaying(false)} />
   </motion.div>
  </AnimatePresence>
  <AnimatePresence>
   {!playing && <motion.button key="play" type="button" className={s.playButton} aria-label="Play the film"
    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.15 }} transition={swap}
    onClick={() => { void video.current?.play(); }}>
    <Play size={22} strokeWidth={1.6} fill="currentColor" aria-hidden />
   </motion.button>}
  </AnimatePresence>
  <SampleTag show={placeholder}>Sample film from another home</SampleTag>
 </div>;
}

function GalleryView({ images, placeholder }: { images: ResolvedMedia['images']; placeholder: boolean }) {
 const [state, setState] = useState({ index: 0, direction: 1, set: images });
 if (state.set !== images) setState({ index: 0, direction: 1, set: images }); // a different home's pictures start at the first
 const index = Math.min(state.index, images.length - 1);
 const go = (next: number, direction: number) => setState(v => ({ ...v, index: (next + images.length) % images.length, direction }));
 const shown = useDecodedSrc(images[index].src);
 const strip = useRef<HTMLDivElement>(null);
 useEffect(() => { strip.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); }, [index]);
 useEffect(() => { images.forEach(i => { const img = new Image(); img.src = i.src; }); }, [images]);
 return <div className={s.galleryView}>
  <div className={s.galleryStage}>
   <AnimatePresence initial={false} custom={state.direction}>
    <motion.img key={shown} src={shown} alt={images.find(i => i.src === shown)?.label ?? ''} className={s.galleryImage} custom={state.direction} draggable={false}
     variants={{ enter: (d: number) => ({ opacity: 0, x: `${d * 6}%`, scale: 1.02 }), center: { opacity: 1, x: '0%', scale: 1 }, exit: (d: number) => ({ opacity: 0, x: `${d * -6}%`, scale: 0.99 }) }}
     initial="enter" animate="center" exit="exit" transition={{ duration: DUR.slow, ease: EASE }} />
   </AnimatePresence>
   <button type="button" className={`${s.glassIcon} ${s.galleryPrev}`} aria-label="Previous image" onClick={() => go(index - 1, -1)}><ChevronLeft size={18} strokeWidth={1.6} aria-hidden /></button>
   <button type="button" className={`${s.glassIcon} ${s.galleryNext}`} aria-label="Next image" onClick={() => go(index + 1, 1)}><ChevronRight size={18} strokeWidth={1.6} aria-hidden /></button>
   <span className={s.galleryCaption}>{images[index].label}<span>{index + 1} of {images.length}</span></span>
   <SampleTag show={placeholder}>Sample imagery from another home</SampleTag>
  </div>
  <div ref={strip} className={s.thumbStrip} role="group" aria-label="Images">
   {images.map((img, i) => <button key={img.src} type="button" className={s.thumb} data-active={i === index} aria-label={`Show ${img.label}`} aria-pressed={i === index} onClick={() => go(i, i >= index ? 1 : -1)}>
    <img src={img.src} alt="" loading="lazy" draggable={false} />
   </button>)}
  </div>
 </div>;
}

export default function MediaPanel({ tab, residence, media, onExpandPlan }: { tab: MediaTab; residence: Residence; media: ResolvedMedia; onExpandPlan: () => void }) {
 return <div className={s.mediaPanel} id="apartment-preview" role="tabpanel" aria-labelledby={`media-${tab}-tab`}>
  <AnimatePresence initial={false} mode="popLayout">
   <motion.div key={tab} className={s.mediaLayer} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: DUR.quick, ease: EASE }}>
    {tab === 'plan' && <PlanView src={residence.plan} title={residence.shortTitle} onExpand={onExpandPlan} />}
    {tab === 'film' && <FilmView film={media.film} placeholder={media.placeholder.film} />}
    {tab === 'images' && <GalleryView images={media.images} placeholder={media.placeholder.images} />}
    {tab === 'model' && <div className={s.modelView}><ResidenceModel src={media.model} /><SampleTag show={media.placeholder.model}>Sample model from another home</SampleTag></div>}
    {tab === 'about' && <article className={s.aboutView}>
     <AnimatePresence initial={false} mode="wait">
      <motion.div key={residence.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: DUR.quick, ease: EASE }}>
       <h3>About the {residence.shortTitle.toLowerCase()}</h3>
       {residence.about.map(p => <p key={p.slice(0, 24)}>{p}</p>)}
      </motion.div>
     </AnimatePresence>
    </article>}
   </motion.div>
  </AnimatePresence>
 </div>;
}
