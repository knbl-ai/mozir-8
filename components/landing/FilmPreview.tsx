'use client';
import { useEffect, useRef, useState } from 'react';
import s from './landing.module.css';

// The Open House's film, muted, while the card is hovered or focused. The file is only fetched on
// the first hover, and the still stays on top until the film is actually playing.
export default function FilmPreview({ poster, film, active }: { poster: string; film: string; active: boolean }) {
 const video = useRef<HTMLVideoElement>(null);
 const [wanted, setWanted] = useState(false);
 const [playing, setPlaying] = useState(false);

 useEffect(() => {
  const v = video.current;
  if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { v?.pause(); setPlaying(false); return; }
  setWanted(true);
  if (v) v.play().catch(() => {});
 }, [active, wanted]);

 return <>
  <img src={poster} alt="" className={s.previewMedia} />
  {wanted && <video ref={video} className={s.previewMedia} src={film} muted loop playsInline preload="auto"
   data-playing={playing || undefined} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-hidden />}
 </>;
}
