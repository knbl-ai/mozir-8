'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MotionConfig } from 'motion/react';
import { ArrowLeft, Box, Download, Images, Info, LayoutPanelLeft, Mail, MessageCircle, Phone, Play } from 'lucide-react';
import MediaPanel, { type MediaTab, type Spec } from '@/components/building/MediaPanel';
import PlanLightbox from '@/components/building/PlanLightbox';
import SegmentedControl from '@/components/building/SegmentedControl';
import { explorerText } from '@/components/building/strings';
import es from '@/components/building/explorer.module.css';
import { localizeResidence } from '@/content/projects';
import { kleeContact, kleeContactHe, kleeHomes, kleeMedia, type KleeHome } from '@/content/projects/klee';
import { useLang, withLang } from '@/lib/i18n';
import { kleeText } from './strings';
import s from './klee.module.css';

const TABS: { value: MediaTab; icon: typeof Play }[] = [
 { value: 'film', icon: Play }, { value: 'plan', icon: LayoutPanelLeft }, { value: 'images', icon: Images }, { value: 'model', icon: Box }, { value: 'about', icon: Info },
];

// One KLEE home, shown the way the Sales Gallery's "Step inside" shows a home: facts and the agent in
// a column, the film, plan, images and 3D filling the rest. Esc or "All homes" goes back to the front page.
export default function KleeApartment({ home: source }: { home: KleeHome }) {
 const lang = useLang();
 const t = explorerText[lang];
 const k = kleeText[lang];
 const router = useRouter();
 const he = lang === 'he';
 const home = useMemo(() => ({ ...source, ...localizeResidence(source, lang) }), [source, lang]);
 const media = useMemo(() => kleeMedia(source, lang), [source, lang]);
 const contact = he ? { ...kleeContact, ...kleeContactHe } : kleeContact;
 const [tab, setTab] = useState<MediaTab>('film');
 const [planOpen, setPlanOpen] = useState(false);
 const back = withLang('/klee-8', lang);

 useEffect(() => {
  const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape' && !planOpen) router.push(back); };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
 }, [planOpen, router, back]);
 useEffect(() => {
  const wanted = `${home.shortTitle} · N°8 KLEE · ${contact.agency}`;
  const apply = () => { if (document.title !== wanted) document.title = wanted; };
  apply();
  const observer = new MutationObserver(apply);
  observer.observe(document.head, { subtree: true, childList: true, characterData: true });
  return () => observer.disconnect();
 }, [home.shortTitle, contact.agency]);

 const floor = he ? source.floorLabelHe : source.floorLabel;
 const homeRef = `${home.shortTitle}, ${floor}`;
 const message = k.enquiry(homeRef);
 const specs: Spec[] = ([{ key: 'exposure', label: t.specs.exposure, value: home.exposure }, { key: 'moveIn', label: t.specs.moveIn, value: '2026' }] satisfies Spec[]);

 return <MotionConfig reducedMotion="user"><div className={es.shell}><div className={es.frame} data-focus>
  <main>
   <section className={es.explorer} aria-label={home.title}>
    <div className={es.grid}>
     <aside className={es.panel} aria-label={home.title}>
      <div className={es.head}>
       <div className={es.headText}>
        <h1 className={es.title}>{home.shortTitle}</h1>
        <p className={es.titleMeta}>{[floor, k.priceOnRequest].join(' · ')}</p>
       </div>
       <div className={es.headAside}>
        <span className={es.aptTag}>{home.label}</span>
        <span className={es.toneTag} data-tone="available"><i />{k.available}</span>
        <a className={es.downloadAssets} href={`/downloads/klee-8/${source.id}.zip`} download={`klee-8-${source.id}-assets.zip`} aria-label={t.downloadAssets} title={t.downloadAssets}>
         <Download size={18} strokeWidth={1.7} aria-hidden />
        </a>
       </div>
      </div>
      <dl className={es.facts}>
       <div><dt>{t.rooms}</dt><dd className={es.factNumber}>{home.rooms}</dd></div>
       <div><dt>{t.floor}</dt><dd className={es.factWord}>{floor}</dd></div>
       <div><dt>{t.interior}</dt><dd className={es.factNumber}>{home.area}<span className={es.factUnit}>{t.sqm}</span></dd></div>
       <div><dt>{t.outdoor}</dt><dd className={es.factWord}>{home.outdoor}<span className={es.factUnit}>{home.outdoorArea} {t.sqm}</span></dd></div>
       <div className={es.factPrice}><dt>{t.price}</dt><dd className={es.factWord}>{k.priceOnRequest}</dd></div>
      </dl>
      <div className={`${es.focusActions} ${s.aptActions}`}>
       <div className={s.homeSwitch}><SegmentedControl id="klee-home" label={k.otherHomes} vertical fill value={source.id} onChange={id => router.push(withLang(`/klee-8/${id}`, lang))}
        options={kleeHomes.map(h => ({ value: h.id, label: <span className={s.homeOption}><b>{h.number}</b>{h.shortTitle}<small>{k.rooms(h.rooms)}</small></span> }))} /></div>
       <Link href={back} className={es.returnButton} title={k.allHomesTitle}>
        <ArrowLeft size={18} strokeWidth={1.7} aria-hidden className={s.backIcon} /><span>{k.allHomes}</span>
       </Link>
      </div>
      <div className={es.tabs}>
       <SegmentedControl id="media" label={t.homePreview} role="tablist" controls="apartment-preview" fill value={tab} onChange={setTab} options={TABS.map(o => ({ ...o, label: t.tabs[o.value] }))} />
      </div>
      <div className={es.mediaWrap}>
       <MediaPanel tab={tab} residence={home} media={media} specs={specs} onExpandPlan={() => setPlanOpen(true)} />
      </div>
      <div className={es.contact} role="group" aria-label={t.contactFor(homeRef)}>
       <div className={es.contactWho}>
        <span className={es.contactAvatar} aria-hidden>{contact.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
        <span className={es.contactName}><strong>{contact.name}</strong><small>{t.salesAgent} · {contact.agency}</small></span>
       </div>
       <div className={es.contactActions}>
        <a className={es.contactPrimary} href={`https://wa.me/${contact.phoneIntl.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" aria-label={t.whatsappAbout(homeRef)}>
         <MessageCircle size={16} strokeWidth={1.8} aria-hidden /><span>{t.whatsapp}</span>
        </a>
        <a className={es.contactButton} href={`tel:${contact.phoneIntl}`} aria-label={t.callAgent(contact.name, contact.phone)}>
         <Phone size={15} strokeWidth={1.8} aria-hidden /><span dir="ltr" className={es.contactPhone}>{contact.phone}</span><span className={es.contactShort}>{t.call}</span>
        </a>
        {contact.email && <a className={es.contactButton} href={`mailto:${contact.email}?subject=${encodeURIComponent(`N°8 KLEE · ${homeRef}`)}&body=${encodeURIComponent(message)}`} aria-label={t.emailAbout(homeRef)} title={contact.email}>
         <Mail size={15} strokeWidth={1.8} aria-hidden /><span>{t.email}</span>
        </a>}
       </div>
      </div>
     </aside>
    </div>
   </section>
  </main>
  <PlanLightbox open={planOpen} onOpenChange={setPlanOpen} src={home.plan} title={t.floorPlanOf(home.shortTitle)} />
 </div></div></MotionConfig>;
}
