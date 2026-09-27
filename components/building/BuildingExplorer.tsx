'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, MotionConfig } from 'motion/react';
import * as Popover from '@radix-ui/react-popover';
import { Box, Building2, ChevronRight, Download, Eye, Images, Info, LayoutPanelLeft, MessageCircle, Play } from 'lucide-react';
import { localizeDevelopment, localizeImages, localizeResidence, resolveMedia, type ApartmentZone, type BuildingFrame, type Development } from '@/content/projects';
import LanguageSwitch from '@/components/LanguageSwitch';
import { useLang } from '@/lib/i18n';
import ApartmentPicker from './ApartmentPicker';
import BuildingStage, { type StageMode } from './BuildingStage';
import { buildInventory, isWellInView, type Apartment } from './inventory';
import MediaPanel, { type MediaTab } from './MediaPanel';
import PlanLightbox from './PlanLightbox';
import SegmentedControl from './SegmentedControl';
import SwapValue from './SwapValue';
import { SOFT_SPRING } from './motion';
import { useFrameSequence } from './useFrameSequence';
import { explorerText } from './strings';
import s from './explorer.module.css';

const HOVER_INTENT_MS = 90;
const ZOOM = 1.45; // the tower is framed close; matches .orbitZoom in the stylesheet
const VIEWS = ['five-room', 'four-room', 'garden'] as const;
type ViewId = (typeof VIEWS)[number];
const TABS: { value: MediaTab; icon: typeof Play }[] = [
 { value: 'plan', icon: LayoutPanelLeft }, { value: 'film', icon: Play }, { value: 'images', icon: Images }, { value: 'model', icon: Box }, { value: 'about', icon: Info },
];

const readDeepLink = () => { try { return new URLSearchParams(window.location.search).get('apt'); } catch { return null; } };

export default function BuildingExplorer({ project: source, frames }: { project: Development; frames: BuildingFrame[] }) {
 const lang = useLang();
 const t = explorerText[lang];
 const project = useMemo(() => localizeDevelopment({ ...source, residences: source.residences.map(r => localizeResidence(r, lang)), media: { ...source.media, images: localizeImages(source.media.images, lang) } }, lang), [source, lang]);
 const inventory = useMemo(() => buildInventory(frames), [frames]);
 const available = useMemo(() => inventory.filter(a => a.status === 'for-sale'), [inventory]);
 const [selectedId, setSelectedId] = useState(available.find(a => a.unit === 'five-room')?.apartment ?? available[0]?.apartment ?? '');
 const [hovered, setHovered] = useState<string | null>(null);
 const [mode, setMode] = useState<StageMode>(frames.length ? 'rotation' : 'reference');
 const [tab, setTab] = useState<MediaTab>('plan');
 const [mobilePanel, setMobilePanel] = useState<'building' | 'details'>('building');
 const [planOpen, setPlanOpen] = useState(false);
 // Apartment view: the building and the top bar step aside so the plan, film, images and 3D get the
 // screen; the facts stay beside them in a column.
 const [focus, setFocus] = useState(false);
 const sources = useMemo(() => frames.map(f => f.src), [frames]);
 const engine = useFrameSequence(sources, 0, ZOOM);
 const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

 const selected = inventory.find(a => a.apartment === selectedId);
 const residence = project.residences.find(r => r.id === selected?.unit) ?? project.residences[0];
 const media = useMemo(() => {
  const resolved = resolveMedia(project, residence, selected?.apartment);
  return { ...resolved, images: localizeImages(resolved.images, lang) };
 }, [project, residence, selected?.apartment, lang]);
 const navIndex = available.findIndex(a => a.apartment === selectedId);

 const select = (apartment: Apartment | ApartmentZone | undefined, { turn = false } = {}) => {
  if (!apartment || apartment.status === 'sold') return;
  setSelectedId(apartment.apartment);
  const entry = inventory.find(a => a.apartment === apartment.apartment);
  if (turn && entry) {
   setMode('rotation');
   if (!isWellInView(entry, engine.settled) || engine.moving) engine.rotateTo(entry.bestFrame);
  }
 };

 // Hover still selects, after a short intent delay, so sweeping across the facade doesn't strobe the panel.
 const onHover = (zone: ApartmentZone | null, commit: boolean) => {
  setHovered(zone?.apartment ?? null);
  if (hoverTimer.current) clearTimeout(hoverTimer.current);
  if (!zone || zone.status === 'sold') return;
  if (commit) select(zone);
  else hoverTimer.current = setTimeout(() => select(zone), HOVER_INTENT_MS);
 };
 useEffect(() => () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); }, []);

 const chooseView = (view: ViewId) => {
  setMode('rotation');
  const first = available.find(a => a.unit === view);
  if (first) setSelectedId(first.apartment);
  // Front and rear face their elevation squarely; the garden turns to where its home shows best.
  engine.rotateTo(view === 'five-room' ? 0 : view === 'four-room' ? Math.floor(frames.length / 2) : (first?.bestFrame ?? 0));
 };


 // ?apt=front-03 opens on that home, facing it.
 useEffect(() => {
  const id = readDeepLink();
  const entry = id ? inventory.find(a => a.apartment === id && a.status === 'for-sale') : undefined;
  if (entry) { setSelectedId(entry.apartment); engine.rotateTo(entry.bestFrame); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);
 useEffect(() => {
  if (!selectedId) return;
  const timer = setTimeout(() => {
   try { const url = new URL(window.location.href); url.searchParams.set('apt', selectedId); window.history.replaceState(window.history.state, '', url); } catch { /* sandboxed */ }
  }, 400);
  return () => clearTimeout(timer);
 }, [selectedId]);

 useEffect(() => {
  if (!focus) return;
  const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape' && !planOpen) setFocus(false); };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
 }, [focus, planOpen]);

 const counts = { available: available.length, sold: inventory.length - available.length };
 const where = selected ? (selected.level === 0 ? t.groundFloor : t.floorN(selected.level)) : '';
 // A demo has no agent to reach, so the button explains what it would do in a live project.
 const enquire = <Popover.Root>
  <Popover.Trigger className={s.enquire} aria-label={t.enquireAbout(where, residence.shortTitle)}>
   <span className={s.enquireText}>{t.enquire}</span>
   <span className={s.enquireIcon} aria-hidden><MessageCircle size={15} strokeWidth={1.8} /></span>
  </Popover.Trigger>
  <Popover.Portal>
   <Popover.Content className={s.enquireNote} side="top" align="end" sideOffset={6} collisionPadding={{ top: 0, right: 8, bottom: 8, left: 8 }}>
    <div className={s.enquireNoteHead}><strong>{t.enquireNoteTitle}</strong><span className={s.enquireNoteHome}>{where} · {residence.shortTitle}</span></div>
    <p>{t.enquireNote}</p>
    <Popover.Arrow className={s.enquireNoteArrow} width={14} height={7} />
   </Popover.Content>
  </Popover.Portal>
 </Popover.Root>;

 return <MotionConfig reducedMotion="user"><div className={s.frame} data-focus={focus || undefined}>
  <header className={s.header}>
   <div className={s.headerStart}>
   <Link href="/" className={s.brand} aria-label={t.allDemos}>
    <svg className={s.brandMark} viewBox="0 0 32 40" aria-hidden="true"><path d="M3 37V16a13 13 0 0 1 26 0v21M10 37V17a6 6 0 0 1 12 0v20M3 27h26" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
    <span>{t.brand}<small>{project.name}</small></span>
   </Link>
   <LanguageSwitch id="explorer-lang" compact />
   </div>
   <div className={s.headerViews}>
    <SegmentedControl id="header-view" label={t.viewsLabel} variant="header" value={(selected?.unit ?? 'five-room') as ViewId} onChange={chooseView} options={VIEWS.map(value => ({ value, label: t.views[value] }))} />
   </div>
   <div className={s.headerPicker}>
    <ApartmentPicker inventory={inventory} residences={project.residences} selected={selected} onSelect={a => select(a, { turn: true })} />
   </div>
  </header>
  <main>
   <section className={s.explorer} id="explore" aria-label={t.exploreBuilding}>
    <div className={s.mobileTabs}>
     <SegmentedControl id="mobile-panel" label={t.show} fill value={mobilePanel} onChange={setMobilePanel} options={[{ value: 'building', label: t.building }, { value: 'details', label: t.homeDetails }]} />
    </div>
    <div className={s.grid} data-mobile-panel={mobilePanel}>
     <motion.aside layout transition={SOFT_SPRING} className={s.panel} aria-label={t.selectedHome}>
      {/* Name on the left; status, browsing and the enquiry share the empty space beside it, so the
          media below keeps the height. */}
      <motion.div layout="position" transition={SOFT_SPRING} className={s.head}>
       <div className={s.headText}>
        <h2 className={s.title}><SwapValue value={residence.shortTitle} order={navIndex} /></h2>
        <p className={s.lede} title={residence.description}><SwapValue value={residence.tagline} order={navIndex} /></p>
       </div>
       <div className={s.headAside}>
        <span className={s.toneTag} data-tone="available"><i />{t.available}</span>
        <button type="button" className={s.focusToggle} onClick={() => setFocus(v => !v)} aria-pressed={focus}
         aria-label={focus ? t.backToBuilding : t.stepInsideLabel} title={focus ? t.backToBuildingTitle : t.stepInsideTitle}>
         {focus ? <Building2 size={16} strokeWidth={1.7} aria-hidden /> : <Eye size={16} strokeWidth={1.7} aria-hidden />}<span>{focus ? t.building : t.stepInside}</span>
        </button>
        {enquire}
        {residence.media && <a className={s.downloadAssets} href={`/downloads/${project.id}/${residence.id}.zip`} download={`${residence.id}-assets.zip`} aria-label={t.downloadAssets} title={t.downloadAssets}>
         <Download size={18} strokeWidth={1.7} aria-hidden />
        </a>}
       </div>
      </motion.div>
      <motion.dl layout="position" transition={SOFT_SPRING} className={s.facts}>
       <div><dt>{t.rooms}</dt><dd className={s.factNumber}><SwapValue value={String(residence.rooms)} /></dd></div>
       <div><dt>{t.floor}</dt><dd className={s.factNumber}><SwapValue value={selected ? (selected.level === 0 ? t.ground : String(selected.level)) : '—'} order={selected?.level} /></dd></div>
       <div><dt title={t.interiorTitle}>{t.interior}<span className={s.approx}>{t.approx}</span></dt><dd className={s.factNumber}><SwapValue value={String(residence.area)} /><span className={s.factUnit}>{t.sqm}</span></dd></div>
       <div><dt>{t.outdoor}</dt><dd className={s.factWord}><SwapValue value={residence.outdoor} order={navIndex} /><span className={s.factUnit}><SwapValue value={`${residence.outdoorArea} ${t.sqm}`} order={residence.outdoorArea} /></span></dd></div>
      </motion.dl>
      <motion.div layout="position" transition={SOFT_SPRING} className={s.tabs}>
       <SegmentedControl id="media" label={t.homePreview} role="tablist" controls="apartment-preview" fill value={tab} onChange={setTab} options={TABS.map(o => ({ ...o, label: t.tabs[o.value] }))} />
      </motion.div>
      <motion.div layout transition={SOFT_SPRING} className={s.mediaWrap}>
       <MediaPanel tab={tab} residence={residence} media={media} onExpandPlan={() => setPlanOpen(true)} />
      </motion.div>
     </motion.aside>
     <BuildingStage project={project} frames={frames} engine={engine} mode={mode} onModeChange={setMode} selectedApartment={selectedId}
      hovered={hovered} onHover={onHover} onSelect={zone => select(zone)} counts={counts}
      mobileSummary={<button type="button" className={s.mobileSummaryButton} onClick={() => setMobilePanel('details')}>
       <span><SwapValue value={residence.shortTitle} order={navIndex} /><small><SwapValue value={where} order={selected?.level} /></small></span>
       <span className={s.mobileSummaryAction}>{t.details}<ChevronRight size={16} strokeWidth={1.6} aria-hidden /></span>
      </button>} />
    </div>
   </section>
  </main>
  <PlanLightbox open={planOpen} onOpenChange={setPlanOpen} src={residence.plan} title={t.floorPlanOf(residence.shortTitle)} />
 </div></MotionConfig>;
}
