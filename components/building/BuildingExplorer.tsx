'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { MotionConfig } from 'motion/react';
import { ArrowUpRight, Box, ChevronLeft, ChevronRight, Images, Info, LayoutPanelLeft, Play } from 'lucide-react';
import { resolveMedia, type ApartmentZone, type BuildingFrame, type Development } from '@/content/projects';
import ApartmentPicker from './ApartmentPicker';
import BuildingStage, { type StageMode } from './BuildingStage';
import { buildInventory, isWellInView, levelLabel, type Apartment } from './inventory';
import MediaPanel, { type MediaTab } from './MediaPanel';
import PlanLightbox from './PlanLightbox';
import SegmentedControl from './SegmentedControl';
import SwapValue from './SwapValue';
import { useFrameSequence } from './useFrameSequence';
import s from './explorer.module.css';

const HOVER_INTENT_MS = 90;
const ZOOM = 1.45; // the tower is framed close; matches .orbitZoom in the stylesheet
const VIEWS = [{ value: 'five-room', label: 'Front' }, { value: 'four-room', label: 'Rear' }, { value: 'garden', label: 'Garden' }] as const;
type ViewId = (typeof VIEWS)[number]['value'];
const TABS: { value: MediaTab; label: string; icon: typeof Play }[] = [
 { value: 'plan', label: 'Floor plan', icon: LayoutPanelLeft }, { value: 'film', label: 'Film', icon: Play }, { value: 'images', label: 'Images', icon: Images },
 { value: 'model', label: '3D', icon: Box }, { value: 'about', label: 'About', icon: Info },
];

const readDeepLink = () => { try { return new URLSearchParams(window.location.search).get('apt'); } catch { return null; } };

export default function BuildingExplorer({ project, frames }: { project: Development; frames: BuildingFrame[] }) {
 const inventory = useMemo(() => buildInventory(frames), [frames]);
 const available = useMemo(() => inventory.filter(a => a.status === 'for-sale'), [inventory]);
 const [selectedId, setSelectedId] = useState(available.find(a => a.unit === 'five-room')?.apartment ?? available[0]?.apartment ?? '');
 const [hovered, setHovered] = useState<string | null>(null);
 const [mode, setMode] = useState<StageMode>(frames.length ? 'rotation' : 'reference');
 const [tab, setTab] = useState<MediaTab>('plan');
 const [mobilePanel, setMobilePanel] = useState<'building' | 'details'>('building');
 const [planOpen, setPlanOpen] = useState(false);
 const sources = useMemo(() => frames.map(f => f.src), [frames]);
 const engine = useFrameSequence(sources, 0, ZOOM);
 const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

 const selected = inventory.find(a => a.apartment === selectedId);
 const residence = project.residences.find(r => r.id === selected?.unit) ?? project.residences[0];
 const media = useMemo(() => resolveMedia(project, residence, selected?.apartment), [project, residence, selected?.apartment]);
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

 const stepHome = (direction: 1 | -1) => {
  if (!available.length) return;
  select(available[(Math.max(0, navIndex) + direction + available.length) % available.length], { turn: true });
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

 const counts = { available: available.length, sold: inventory.length - available.length };
 const where = selected ? (selected.level === 0 ? 'Ground floor' : `Floor ${selected.level}`) : '';
 const enquire = <a className={s.enquire} href={project.enquiryUrl} target="_blank" rel="noreferrer">
  <span className={s.enquireText}><strong>Enquire about this home</strong><SwapValue value={`${where} · ${residence.shortTitle}`} order={navIndex} /></span>
  <span className={s.enquireIcon} aria-hidden><ArrowUpRight size={18} strokeWidth={1.6} /></span>
 </a>;

 return <MotionConfig reducedMotion="user">
  <header className={s.header}>
   <Link href="/projects" className={s.brand}>
    <svg className={s.brandMark} viewBox="0 0 32 40" aria-hidden="true"><path d="M3 37V16a13 13 0 0 1 26 0v21M10 37V17a6 6 0 0 1 12 0v20M3 27h26" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
    <span>Residences<small>The next address</small></span>
   </Link>
   <div className={s.headerViews}>
    <SegmentedControl id="header-view" label="Residence layouts" variant="header" value={(selected?.unit ?? 'five-room') as ViewId} onChange={chooseView} options={[...VIEWS]} />
   </div>
   <div className={s.headerPicker}>
    <ApartmentPicker inventory={inventory} residences={project.residences} selected={selected} onSelect={a => select(a, { turn: true })} />
   </div>
  </header>
  <main>
   <section className={s.explorer} id="explore" aria-label="Explore the building">
    <div className={s.mobileTabs}>
     <SegmentedControl id="mobile-panel" label="Show" fill value={mobilePanel} onChange={setMobilePanel} options={[{ value: 'building', label: 'Building' }, { value: 'details', label: 'Home details' }]} />
    </div>
    <div className={s.grid} data-mobile-panel={mobilePanel}>
     <aside className={s.panel} aria-label="Selected home">
      <div className={s.panelTop}>
       <span className={s.toneTag} data-tone="available"><i />Available</span>
       <span className={s.panelWhere}><SwapValue value={where} order={selected?.level} /></span>
       <div className={s.stepper} role="group" aria-label="Browse available homes">
        <button type="button" className={s.stepButton} aria-label="Previous available home" onClick={() => stepHome(-1)}><ChevronLeft size={18} strokeWidth={1.6} aria-hidden /></button>
        <span className={s.stepCount} aria-live="polite"><SwapValue value={String(navIndex + 1)} /><span>/ {available.length}</span></span>
        <button type="button" className={s.stepButton} aria-label="Next available home" onClick={() => stepHome(1)}><ChevronRight size={18} strokeWidth={1.6} aria-hidden /></button>
       </div>
      </div>
      <h2 className={s.title}><SwapValue value={residence.shortTitle} order={navIndex} /></h2>
      <p className={s.lede}><SwapValue value={residence.description} order={navIndex} /></p>
      <dl className={s.facts}>
       <div><dt>Rooms</dt><dd className={s.factNumber}><SwapValue value={String(residence.rooms)} /></dd></div>
       <div><dt>Floor</dt><dd className={s.factNumber}><SwapValue value={selected ? levelLabel(selected.floor) : '—'} order={selected?.level} /></dd></div>
       <div><dt>Interior</dt><dd className={s.factPending}>Area to be confirmed</dd></div>
       <div><dt>Outdoor</dt><dd className={s.factWord}><SwapValue value={residence.outdoor} order={navIndex} /></dd></div>
      </dl>
      <div className={s.tabs}>
       <SegmentedControl id="media" label="Home preview" role="tablist" controls="apartment-preview" fill value={tab} onChange={setTab} options={TABS} />
      </div>
      <MediaPanel tab={tab} residence={residence} media={media} onExpandPlan={() => setPlanOpen(true)} />
      <div className={s.panelFoot}>{enquire}</div>
     </aside>
     <BuildingStage project={project} frames={frames} engine={engine} mode={mode} onModeChange={setMode} selectedApartment={selectedId}
      hovered={hovered} onHover={onHover} onSelect={zone => select(zone)} counts={counts}
      mobileSummary={<button type="button" className={s.mobileSummaryButton} onClick={() => setMobilePanel('details')}>
       <span><SwapValue value={residence.shortTitle} order={navIndex} /><small><SwapValue value={where} order={selected?.level} /></small></span>
       <span className={s.mobileSummaryAction}>Details<ChevronRight size={16} strokeWidth={1.6} aria-hidden /></span>
      </button>} />
    </div>
   </section>
  </main>
  <PlanLightbox open={planOpen} onOpenChange={setPlanOpen} src={residence.plan} title={`${residence.shortTitle} floor plan`} />
 </MotionConfig>;
}
