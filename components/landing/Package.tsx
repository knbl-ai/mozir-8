'use client';
import { useEffect, useRef, useState } from 'react';
import BuildingPreview from './BuildingPreview';
import FilmPreview from './FilmPreview';
import { FilmIcon, ImagesIcon, BuildingIcon, LanguagesIcon, ModelIcon, SiteIcon } from './icons';
import type { DeliverableKey, LandingCopy } from './copy';
import { film } from './media';
import s from './landing.module.css';

const STILLS = ['/projects/klee-8/media/apt-1/v-living.webp', '/projects/klee-8/media/apt-1/v-bedroom.webp', '/projects/klee-8/media/apt-1/v-balcony.webp', '/projects/klee-8/media/apt-1/top.webp'];
const TABS = [0, 1, 2, 3].map(i => `/landing/phone/tab-${i}.webp`);

// A card is "active" while pointed at or focused; on touch screens, while it is mostly on screen.
function useActive<T extends HTMLElement>() {
 const ref = useRef<T>(null);
 const [active, setActive] = useState(false);
 useEffect(() => {
  const el = ref.current;
  if (!el || !window.matchMedia('(hover: none)').matches) return;
  const io = new IntersectionObserver(([e]) => setActive(e.intersectionRatio > 0.6), { threshold: [0, 0.6, 1] });
  io.observe(el);
  return () => io.disconnect();
 }, []);
 const handlers = {
  onPointerEnter: (e: React.PointerEvent) => e.pointerType === 'mouse' && setActive(true),
  onPointerLeave: (e: React.PointerEvent) => e.pointerType === 'mouse' && setActive(false),
  onFocus: () => setActive(true), onBlur: () => setActive(false),
 };
 return { ref, active, handlers };
}

// Steps through `count` states while active; back to the first when it stops.
function useCycle(active: boolean, count: number, ms: number) {
 const [i, setI] = useState(0);
 useEffect(() => {
  if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setI(0); return; }
  setI(1 % count);
  const id = setInterval(() => setI(n => (n + 1) % count), ms);
  return () => clearInterval(id);
 }, [active, count, ms]);
 return i;
}

function Card({ id, item, Icon, children, wide }: { id: DeliverableKey; item: { title: string; body: string }; Icon: (p: { size?: number }) => React.ReactNode; wide?: boolean; children: (active: boolean) => React.ReactNode }) {
 const { ref, active, handlers } = useActive<HTMLElement>();
 return <article ref={ref} className={s.card} data-card={id} data-wide={wide || undefined} data-active={active || undefined} tabIndex={0} aria-labelledby={`pk-${id}`} {...handlers}>
  <div className={s.cardMedia}>{children(active)}<i className={s.cardTick} aria-hidden /></div>
  <div className={s.cardText}>
   <span className={s.cardIcon}><Icon size={26} /></span>
   <div><h3 id={`pk-${id}`} className={s.cardTitle}>{item.title}</h3><p className={s.cardBody}>{item.body}</p></div>
  </div>
 </article>;
}

function Stills({ active }: { active: boolean }) {
 const i = useCycle(active, STILLS.length, 1100);
 return <>{STILLS.map((src, k) => <img key={src} src={src} alt="" className={s.still} data-on={k === i || undefined} loading="lazy" />)}</>;
}

function Phone({ active }: { active: boolean }) {
 const i = useCycle(active, TABS.length, 1300);
 return <div className={s.phone}>
  <div className={s.phoneScreen}>{TABS.map((src, k) => <img key={src} src={src} alt="" data-on={k === i || undefined} loading="lazy" />)}</div>
 </div>;
}

function Languages({ active, lines }: { active: boolean; lines: { tag: string; text: string }[] }) {
 const i = useCycle(active, lines.length, 1600);
 return <div className={s.langs}>
  <div className={s.langTags}>{lines.map((l, k) => <span key={l.tag} data-on={k === i || undefined}>{l.tag}</span>)}</div>
  <div className={s.langText}>{lines.map((l, k) => <p key={l.tag} data-on={k === i || undefined} dir={l.tag === 'עב' ? 'rtl' : 'ltr'} lang={l.tag === 'עב' ? 'he' : l.tag === 'PT' ? 'pt' : 'en'}>{l.text}</p>)}</div>
 </div>;
}

export default function Package({ t, spinFrames, buildingFrames }: { t: LandingCopy['package']; spinFrames: string[]; buildingFrames: string[] }) {
 const it = t.items;
 return <section id="package" className={s.packageSection} aria-labelledby="package-title">
  <div className={s.sectionHead}>
   <div>
    <h2 id="package-title" className={s.sectionTitle}>{t.title}</h2>
    <p className={s.sectionLede}>{t.lede}</p>
   </div>
  </div>
  <div className={s.cards}>
   <Card id="film" item={it.film} Icon={FilmIcon} wide>
    {a => <FilmPreview poster="/projects/klee-8/media/apt-1/poster.webp" film={film("/projects/klee-8/media/apt-1/film.mp4")} active={a} />}
   </Card>
   <Card id="model" item={it.model} Icon={ModelIcon}>
    {a => <><BuildingPreview frames={spinFrames} active={a} fit="contain" fps={24} /><span className={s.mediaNote}>{t.spinNote}</span></>}
   </Card>
   <Card id="images" item={it.images} Icon={ImagesIcon}>{a => <Stills active={a} />}</Card>
   <Card id="building" item={it.building} Icon={BuildingIcon}>
    {a => <><BuildingPreview frames={buildingFrames} active={a} />
     <span className={s.chips}><span data-status="sale">{t.forSale}</span><span data-status="sold">{t.sold}</span></span></>}
   </Card>
   <Card id="site" item={it.site} Icon={SiteIcon}>{a => <Phone active={a} />}</Card>
   <Card id="languages" item={it.languages} Icon={LanguagesIcon}>{a => <Languages active={a} lines={t.languages} />}</Card>
  </div>
  <p className={s.note}>{t.example}</p>
 </section>;
}
