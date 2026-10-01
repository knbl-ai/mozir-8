'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Box, Building2, Eye, ChevronLeft, ChevronRight, Download, Images, Info, LayoutPanelLeft, Maximize2, Mountain, Play, X } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { PLATES, TYPES, UNITS, VIEWS, type GindiType, type Unit } from '@/content/projects/gindi';
import ResidenceModel from '@/components/building/ResidenceModel';
import { gindiText } from './strings';
import s from './gindi.module.css';

// A penthouse half's centre falls on the core; its label sits midway between the core (±5.6) and the outer wall (±12.8).
const PH_LABEL_Y = 9.2;
const homeAt = new Map(UNITS.map(u => [`${u.building}-${u.floor}-${u.type}`, u]));
export type PlatePick = { onHover?: (id: string | null) => void; onPick?: (id: string) => void };

// Where the home sits on its floor: the tower's plate in the site's orientation, north up (true north 15° left).
// With onHover/onPick the floor's other homes answer the pointer: hovering one shows it, clicking one chooses it.
export function Plate({ unit, onHover, onPick }: { unit: Unit } & PlatePick) {
 const lang = useLang(); const t = gindiText[lang];
 const plate = PLATES.plates[String(unit.building)];
 const R = PLATES.radius + 1.5;
 const ph = unit.floor === 21;
 const types: GindiType[] = ph ? ['PA', 'PB'] : ['A', 'B', 'C', 'D'];
 return <svg className={s.plate} viewBox={`${-R} ${-R} ${2 * R} ${2 * R}`} role="img" aria-label={t.position}>
  <polygon points={plate.outline} className={s.plateOutline} />
  {types.map(tp => {
   const p = plate.units[tp]; if (!p) return null;
   const home = homeAt.get(`${unit.building}-${unit.floor}-${tp}`);
   const live = !!home && !!(onHover || onPick);
   return <g key={tp} className={live ? s.plateHome : undefined} data-status={live ? home!.status : undefined}
    onPointerEnter={live ? () => onHover?.(home!.id) : undefined} onPointerLeave={live ? () => onHover?.(null) : undefined}
    onClick={live ? e => { e.stopPropagation(); onPick?.(home!.id); } : undefined}>
   {live && <title>{`${lang === 'he' ? TYPES[tp].nameHe : TYPES[tp].name} · ${t.statusText(home!.status)}`}</title>}
   <polygon points={p.points} className={s.plateUnit} data-on={tp === unit.type || undefined} />
   <text x={p.cx} y={ph ? Math.sign(p.cy) * PH_LABEL_Y : p.cy} className={s.plateLabel} data-on={tp === unit.type || undefined}>{tp}</text>
  </g>; })}
  <polygon points={plate.core} className={s.plateCore} />
  <g transform={`translate(${R + 0.6} ${-R + 2.2}) rotate(-15)`} className={s.plateNorth}>
   <path d="M0,-2.6 L1.1,1.2 L0,0.5 L-1.1,1.2 Z" /><text y="3.6">N</text>
  </g>
 </svg>;
}

export type HomeTab = 'plan' | 'film' | 'images' | '3d' | 'views' | 'about';
const ICONS: Record<HomeTab, typeof Play> = { plan: LayoutPanelLeft, film: Play, images: Images, '3d': Box, views: Mountain, about: Info };

// The chosen home, given the room it needs: name and facts on top, then the media filling the rest of the panel.
export default function HomePanel({ unit, tab, onTab, onContact, focus, onFocus, plate }: { unit: Unit; tab: HomeTab; onTab: (t: HomeTab) => void; onContact: () => void; focus: boolean; onFocus: (v: boolean) => void; plate?: PlatePick }) {
 const lang = useLang(); const t = gindiText[lang];
 const info = TYPES[unit.type];
 const media = info.media;
 const tabs: HomeTab[] = ['plan', ...(media?.film ? ['film' as const] : []), ...(media?.images.length ? ['images' as const] : []), ...(media?.model ? ['3d' as const] : []), 'views', 'about'];
 const shown: HomeTab = tabs.includes(tab) ? tab : 'plan';
 const label: Record<HomeTab, string> = { plan: t.plan, film: t.film, images: t.interiors, '3d': t.model3d, views: t.views, about: t.aboutTab };
 const [shot, setShot] = useState(0);
 const [zoom, setZoom] = useState<string | null>(null);
 const [modelFull, setModelFull] = useState(false);
 useEffect(() => { setShot(0); }, [unit.type]);
 const name = lang === 'he' ? info.nameHe : info.name;
 const images = media?.images ?? [];
 const outdoor = unit.floor === 21 ? t.terraces : t.balcony;

 // Step inside puts the actions under the facts, in the side column: Book a meeting, Download files, then Back to building.
 // One ZIP per home type (scripts/build-downloads.cjs): plan, plan sheet, film, interiors, 3D.
 const pkg = info.plan ? `/downloads/gindi-colors/type-${unit.type.toLowerCase()}.zip` : null;
 const book = <button type="button" className={s.goldBtn} onClick={onContact}>{t.bookMeeting}</button>;
 const download = pkg && <a className={s.downloadBtn} href={pkg} download={`gindi-colors-${unit.type.toLowerCase()}.zip`} aria-label={t.downloadFilesTitle} title={t.downloadFilesTitle}>
  <Download size={16} strokeWidth={1.5} aria-hidden /><span>{t.downloadFiles}</span>
 </a>;
 const actions = <div className={s.homeActions}>
  {!focus && download}
  {focus && book}
  {focus && download}
  <button type="button" className={s.stepBtn} aria-pressed={focus} onClick={() => onFocus(!focus)} title={focus ? t.backToBuildingTitle : t.stepInsideTitle}>
   {focus ? <Building2 size={16} strokeWidth={1.5} aria-hidden /> : <Eye size={16} strokeWidth={1.5} aria-hidden />}<span>{focus ? t.backToBuilding : t.stepInside}</span>
  </button>
  {!focus && book}
 </div>;

 return <div className={s.home}>
  <div className={s.homeHead}>
   <div className={s.homeTitleBlock}>
    <div className={s.homeKickerRow}>
     <p className={s.kicker}>{t.buildingN(unit.building)} · {t.floorN(unit.floor)}</p>
     <span className={s.pill} data-status={unit.status}>{t.statusText(unit.status)}</span>
    </div>
    <AnimatePresence mode="wait" initial={false}>
     <motion.h2 key={unit.id} className={s.homeTitle} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .22 }}>
      {name}<small>{lang === 'he' ? info.kindHe : info.kind}</small>
     </motion.h2>
    </AnimatePresence>
   </div>
   {focus && <Plate unit={unit} {...plate} />}
   {!focus && actions}
  </div>

  <div className={s.homeFacts}>
   <dl className={s.factsRow}>
    <div><dt>{t.rooms}</dt><dd>{info.rooms ?? '—'}</dd></div>
    <div><dt>{t.interior}</dt><dd>{info.area ? t.m2(info.area) : '—'}</dd></div>
    <div><dt>{outdoor}</dt><dd>{info.balcony ? t.m2(info.balcony) : '—'}</dd></div>
    <div><dt>{t.floor}</dt><dd>{unit.floor}</dd></div>
    <div><dt>{t.exposure}</dt><dd className={s.ddWord}>{t.exposureText(unit.exposure)}</dd></div>
    <div><dt>{t.price}</dt><dd className={s.ddWord}>{t.onRequest}</dd></div>
   </dl>
   {focus && actions}
  </div>

  <div className={s.homeTabs} role="tablist">
   {tabs.map(k => { const Icon = ICONS[k]; return <button key={k} type="button" role="tab" aria-selected={shown === k} className={s.homeTab} onClick={() => onTab(k)}>
    <Icon size={16} strokeWidth={1.5} aria-hidden /><span>{label[k]}</span>{shown === k && <motion.span layoutId="gindi-home-tab" className={s.homeTabLine} />}
   </button>; })}
  </div>

  <div className={s.homeMedia} data-tab={shown}>
   {shown === 'plan' && (info.plan
    ? <div className={s.mediaPlan}>
     <button type="button" className={s.mediaPlanImg} onClick={() => setZoom(info.plan!)} aria-label={t.openPlan}>
      <img src={info.plan} alt={`${name} — ${t.plan}`} /><span className={s.mediaCorner}><Maximize2 size={15} strokeWidth={1.5} aria-hidden /></span>
     </button>
    </div>
    : <div className={s.mediaEmpty}><Plate unit={unit} {...plate} /><p>{t.planToCome}</p></div>)}
   {shown === 'film' && media?.film && <div className={s.mediaFilm}>
    <video key={media.film.src} src={media.film.src} poster={media.film.poster} controls playsInline preload="metadata" />
   </div>}
   {shown === 'images' && images.length > 0 && <div className={s.mediaImages}>
    <div className={s.mediaStill}>
     <AnimatePresence mode="wait" initial={false}>
      <motion.img key={images[shot].src} src={images[shot].src} alt={lang === 'he' ? images[shot].labelHe : images[shot].label}
       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .3 }} onClick={() => setZoom(images[shot].src)} />
     </AnimatePresence>
     <button type="button" className={`${s.stillNav} ${s.stillPrev}`} aria-label={t.prevImage} onClick={() => setShot(i => (i - 1 + images.length) % images.length)}><ChevronLeft size={20} strokeWidth={1.4} className={s.dirIcon} /></button>
     <button type="button" className={`${s.stillNav} ${s.stillNext}`} aria-label={t.nextImage} onClick={() => setShot(i => (i + 1) % images.length)}><ChevronRight size={20} strokeWidth={1.4} className={s.dirIcon} /></button>
     <span className={s.mediaCaption}>{lang === 'he' ? images[shot].labelHe : images[shot].label} · {shot + 1}/{images.length} · {t.illustrative}</span>
    </div>
    <div className={s.thumbs}>
     {images.map((im, i) => <button key={im.src} type="button" className={s.thumb} aria-pressed={i === shot} onClick={() => setShot(i)} aria-label={lang === 'he' ? im.labelHe : im.label}><img src={im.src} alt="" loading="lazy" /></button>)}
    </div>
   </div>}
   {shown === '3d' && media?.model && <div className={s.mediaModel}>
    <div className={s.modelBox}>{!modelFull && <ResidenceModel src={media.model} defaultOrbit={media.modelOrbit} />}</div>
    <button type="button" className={s.modelExpand} onClick={() => setModelFull(true)} aria-label={t.openModel} title={t.openModel}><Maximize2 size={15} strokeWidth={1.5} aria-hidden /></button>
    <span className={s.mediaCaption}>{t.modelNote} · {t.illustrative}</span>
   </div>}
   {shown === 'views' && <div className={s.mediaViews} data-n={unit.exposure.length}>
    {unit.exposure.map(d => <figure key={d}><img src={VIEWS[d]} alt={t.dir[d]} onClick={() => setZoom(VIEWS[d])} /><figcaption>{t.dir[d]}</figcaption></figure>)}
    <p className={s.mediaNote}>{t.viewsNote}</p>
   </div>}
   {shown === 'about' && <div className={s.mediaAbout}>
    <p className={s.aboutLead}>{(lang === 'he' ? info.aboutHe : info.about) ?? t.planToCome}</p>
    <dl className={s.aboutList}>
     <div><dt>{t.floorsOfType}</dt><dd>{lang === 'he' ? info.floorsHe : info.floors}</dd></div>
     <div><dt>{t.exposure}</dt><dd>{t.exposureText(unit.exposure)}</dd></div>
     <div><dt>{t.position}</dt><dd><Plate unit={unit} {...plate} /></dd></div>
    </dl>
    <p className={s.mediaNote}>{t.sampleNote}</p>
   </div>}
  </div>

  <Dialog.Root open={modelFull} onOpenChange={setModelFull}>
   <Dialog.Portal>
    <Dialog.Overlay className={s.lightboxOverlay} />
    <Dialog.Content className={`${s.lightbox} ${s.modelLightbox}`} aria-describedby={undefined}>
     <Dialog.Title className={s.srOnly}>{name} — {t.model3d}</Dialog.Title>
     {modelFull && media?.model && <div className={s.modelBox}><ResidenceModel src={media.model} defaultOrbit={media.modelOrbit} /></div>}
     <Dialog.Close className={s.lightboxClose} aria-label={t.close}><X size={20} strokeWidth={1.4} /></Dialog.Close>
    </Dialog.Content>
   </Dialog.Portal>
  </Dialog.Root>
  <Dialog.Root open={!!zoom} onOpenChange={o => !o && setZoom(null)}>
   <Dialog.Portal>
    <Dialog.Overlay className={s.lightboxOverlay} />
    <Dialog.Content className={s.lightbox} aria-describedby={undefined}>
     <Dialog.Title className={s.srOnly}>{name}</Dialog.Title>
     {zoom && <img src={zoom} alt={name} />}
     <Dialog.Close className={s.lightboxClose} aria-label={t.close}><X size={20} strokeWidth={1.4} /></Dialog.Close>
    </Dialog.Content>
   </Dialog.Portal>
  </Dialog.Root>
 </div>;
}
