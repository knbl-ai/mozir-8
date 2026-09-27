'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, MotionConfig } from 'motion/react';
import { Box, Building2, ChevronRight, Download, Eye, Images, Info, LayoutPanelLeft, Mail, MapPin, MessageCircle, Phone, Play } from 'lucide-react';
import { localizeDevelopment, localizeImages, localizeResidence, resolveMedia, type ApartmentZone, type BuildingFrame, type Development } from '@/content/projects';
import LanguageSwitch from '@/components/LanguageSwitch';
import { useLang } from '@/lib/i18n';
import ApartmentPicker from './ApartmentPicker';
import BuildingStage, { type StageMode } from './BuildingStage';
import { buildInventory, isWellInView, type Apartment } from './inventory';
import MediaPanel, { type MediaTab, type Spec } from './MediaPanel';
import PlanLightbox from './PlanLightbox';
import SegmentedControl from './SegmentedControl';
import SwapValue from './SwapValue';
import { SOFT_SPRING } from './motion';
import { useFrameSequence } from './useFrameSequence';
import { explorerText } from './strings';
import s from './explorer.module.css';

const HOVER_INTENT_MS = 90;
const ZOOM = 1.45; // the tower is framed close; matches .orbitZoom in the stylesheet
const VIEWS = ['five-room', 'four-room', 'garden', 'compact'] as const;
type ViewId = (typeof VIEWS)[number];
const TABS: { value: MediaTab; icon: typeof Play }[] = [
 { value: 'plan', icon: LayoutPanelLeft }, { value: 'film', icon: Play }, { value: 'images', icon: Images }, { value: 'model', icon: Box }, { value: 'about', icon: Info },
];

const formatPrice = (price: number) => new Intl.NumberFormat('en-US').format(price);

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
 const listing = selected ? project.listings[selected.apartment] : undefined;

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

 // The name stays on one line: when it is wider than the room beside the tags, it steps down in size
 // (to 60% of the stylesheet's) instead of wrapping and pushing the facts down.
 const titleRef = useRef<HTMLHeadingElement>(null);
 useEffect(() => {
  const title = titleRef.current;
  if (!title) return;
  const fit = () => {
   title.style.fontSize = '';
   const full = parseFloat(getComputedStyle(title).fontSize);
   const need = title.scrollWidth, room = title.clientWidth;
   if (need > room) title.style.fontSize = `${Math.max(full * 0.6, Math.floor(full * room / need))}px`;
  };
  fit();
  const observer = new ResizeObserver(fit);
  observer.observe(title);
  document.fonts?.ready.then(fit).catch(() => {});
  return () => observer.disconnect();
 }, [residence.shortTitle, focus]);

 // The tab names the address and the agency in the visitor's language. Next's metadata writes the
 // static (English) title after hydration, so hold ours against later changes to <head>.
 useEffect(() => {
  const wanted = `${project.info.address} · ${project.contact.agency}`;
  const apply = () => { if (document.title !== wanted) document.title = wanted; };
  apply();
  const observer = new MutationObserver(apply);
  observer.observe(document.head, { subtree: true, childList: true, characterData: true });
  return () => observer.disconnect();
 }, [project]);
 useEffect(() => {
  if (!focus) return;
  const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape' && !planOpen) setFocus(false); };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
 }, [focus, planOpen]);

 const counts = { available: available.length, sold: inventory.length - available.length };
 const where = selected ? (selected.level === 0 ? t.groundFloor : t.floorN(selected.level)) : '';
 const { contact, info } = project;
 // Every way to reach the agent names the home, so the enquiry arrives already specific.
 const homeRef = t.homeRef(listing?.number, where, residence.shortTitle);
 const message = t.enquiryText(project.name, homeRef);
 const contactRow = <motion.div layout="position" transition={SOFT_SPRING} className={s.contact} role="group" aria-label={t.contactFor(homeRef)}>
  <div className={s.contactWho}>
   <span className={s.contactAvatar} aria-hidden>{contact.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
   <span className={s.contactName}><strong>{contact.name}</strong><small>{t.salesAgent} · {contact.agency}</small></span>
  </div>
  <div className={s.contactActions}>
   <a className={s.contactPrimary} href={`https://wa.me/${contact.phoneIntl.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" aria-label={t.whatsappAbout(homeRef)}>
    <MessageCircle size={16} strokeWidth={1.8} aria-hidden /><span>{t.whatsapp}</span>
   </a>
   <a className={s.contactButton} href={`tel:${contact.phoneIntl}`} aria-label={t.callAgent(contact.name, contact.phone)}>
    <Phone size={15} strokeWidth={1.8} aria-hidden /><span dir="ltr" className={s.contactPhone}>{contact.phone}</span><span className={s.contactShort}>{t.call}</span>
   </a>
   <a className={s.contactButton} href={`mailto:${contact.email}?subject=${encodeURIComponent(`${project.name} · ${homeRef}`)}&body=${encodeURIComponent(message)}`} aria-label={t.emailAbout(homeRef)} title={contact.email}>
    <Mail size={15} strokeWidth={1.8} aria-hidden /><span>{t.email}</span>
   </a>
  </div>
 </motion.div>;
 const download = residence.media && <a className={s.downloadAssets} href={`/downloads/${project.id}/${residence.id}.zip`} download={`${residence.id}-assets.zip`} aria-label={t.downloadAssets} title={t.downloadAssets}>
  <Download size={18} strokeWidth={1.7} aria-hidden />
 </a>;
 // Only what the facts row above the tabs doesn't already show (rooms, floor, area, outdoor, price, number).
 const specs: Spec[] = [
  { key: 'exposure', label: t.specs.exposure, value: residence.exposure },
  { key: 'parking', label: t.specs.parking, value: t.parkingShort },
  { key: 'storage', label: t.specs.storage, value: t.storageShort },
  { key: 'moveIn', label: t.specs.moveIn, value: info.moveIn },
 ];
 const openProject = () => { setMode('info'); setMobilePanel('building'); };

 return <MotionConfig reducedMotion="user"><div className={s.frame} data-focus={focus || undefined}>
  <header className={s.header}>
   <div className={s.headerStart}>
   <Link href="/" className={s.brand} aria-label={contact.agency}>
    <img className={s.brandLogo} src="/remax-logo.png" alt={contact.agency} width={130} height={24} />
    <span className={s.brandAddress}>{info.address}</span>
   </Link>
   <LanguageSwitch id="explorer-lang" compact />
   <button type="button" className={s.addressChip} onClick={openProject} aria-pressed={mode === 'info'} title={t.addressTitle}>
    <MapPin size={15} strokeWidth={1.7} aria-hidden /><span><strong>{info.address}</strong><small>{info.area}</small></span>
   </button>
   </div>
   <div className={s.headerViews}>
    <SegmentedControl id="header-view" label={t.viewsLabel} variant="header" value={(selected?.unit ?? 'five-room') as ViewId} onChange={chooseView} options={VIEWS.map(value => {
     // A type with nothing for sale stays in view, so the building's whole mix is visible, but can't be chosen.
     const none = !available.some(a => a.unit === value);
     return { value, label: t.views[value], disabled: none, title: none ? `${t.views[value]} · ${t.noneAvailable}` : undefined };
    })} />
   </div>
   <div className={s.headerPicker}>
    <ApartmentPicker inventory={inventory} residences={project.residences} listings={project.listings} selected={selected} onSelect={a => select(a, { turn: true })} />
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
        <h2 ref={titleRef} className={s.title}><SwapValue value={residence.shortTitle} order={navIndex} /></h2>
        {/* Phones: number and price under the name, in place of the tag and the price row. */}
        {listing && <p className={s.titleMeta}><SwapValue value={`${t.aptNo(listing.number)} · ${t.currency}${formatPrice(listing.price)}`} order={listing.number} /></p>}
       </div>
       <div className={s.headAside}>
        {listing && <span className={s.aptTag}><SwapValue value={t.aptNo(listing.number)} order={listing.number} /></span>}
        <span className={s.toneTag} data-tone="available"><i />{t.available}</span>
        {!focus && <button type="button" className={s.focusToggle} onClick={() => setFocus(v => !v)} aria-pressed={focus}
         aria-label={focus ? t.backToBuilding : t.stepInsideLabel} title={focus ? t.backToBuildingTitle : t.stepInsideTitle}>
         {focus ? <Building2 size={16} strokeWidth={1.7} aria-hidden /> : <Eye size={16} strokeWidth={1.7} aria-hidden />}<span>{focus ? t.building : t.stepInside}</span>
        </button>}
        {download}
       </div>
      </motion.div>
      <motion.dl layout="position" transition={SOFT_SPRING} className={s.facts}>
       <div><dt>{t.rooms}</dt><dd className={s.factNumber}><SwapValue value={String(residence.rooms)} /></dd></div>
       <div><dt>{t.floor}</dt><dd className={s.factNumber}><SwapValue value={selected ? (selected.level === 0 ? t.ground : String(selected.level)) : '—'} order={selected?.level} /></dd></div>
       <div><dt title={t.interiorTitle}>{t.interior}</dt><dd className={s.factNumber}><SwapValue value={String(residence.area)} /><span className={s.factUnit}>{t.sqm}</span></dd></div>
       <div><dt>{t.outdoor}</dt><dd className={s.factWord}><SwapValue value={residence.outdoor} order={navIndex} /><span className={s.factUnit}><SwapValue value={`${residence.outdoorArea} ${t.sqm}`} order={residence.outdoorArea} /></span></dd></div>
       <div className={s.factPrice}><dt>{t.price}</dt><dd className={s.factNumber}><span className={s.factCurrency}>{t.currency}</span><SwapValue value={listing ? formatPrice(listing.price) : '—'} order={listing?.price} /></dd></div>
      </motion.dl>
      {focus && <div className={s.focusActions}>
       <button type="button" className={s.returnButton} onClick={() => setFocus(false)} title={t.backToBuildingTitle}>
        <Building2 size={18} strokeWidth={1.7} aria-hidden /><span>{t.returnToBuilding}</span>
       </button>
      </div>}
      <motion.div layout="position" transition={SOFT_SPRING} className={s.tabs}>
       <SegmentedControl id="media" label={t.homePreview} role="tablist" controls="apartment-preview" fill value={tab} onChange={setTab} options={TABS.map(o => ({ ...o, label: t.tabs[o.value] }))} />
      </motion.div>
      <motion.div layout transition={SOFT_SPRING} className={s.mediaWrap}>
       <MediaPanel tab={tab} residence={residence} media={media} specs={specs} onExpandPlan={() => setPlanOpen(true)} />
      </motion.div>
      {/* Last in the panel, so reaching the agent is always at its foot, under the media. */}
      {contactRow}
     </motion.aside>
     <BuildingStage project={project} frames={frames} engine={engine} mode={mode} onModeChange={setMode} selectedApartment={selectedId}
      hovered={hovered} onHover={onHover} onSelect={zone => select(zone)} counts={counts} priceFrom={Math.min(...Object.values(project.listings).map(l => l.price))}
      mobileSummary={<button type="button" className={s.mobileSummaryButton} onClick={() => setMobilePanel('details')}>
       <span><SwapValue value={residence.shortTitle} order={navIndex} /><small><SwapValue value={[where, listing && t.aptNo(listing.number), listing && `${t.currency}${formatPrice(listing.price)}`].filter(Boolean).join(' · ')} order={selected?.level} /></small></span>
       <span className={s.mobileSummaryAction}>{t.details}<ChevronRight size={16} strokeWidth={1.6} aria-hidden /></span>
      </button>} />
    </div>
   </section>
  </main>
  <PlanLightbox open={planOpen} onOpenChange={setPlanOpen} src={residence.plan} title={t.floorPlanOf(residence.shortTitle)} />
 </div></MotionConfig>;
}
