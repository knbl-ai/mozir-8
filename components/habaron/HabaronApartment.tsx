'use client';
import { useEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Box, Images, Info, LayoutPanelLeft, Mail, MessageCircle, Phone, Play } from 'lucide-react';
import MediaPanel, { type MediaTab, type Spec } from '@/components/building/MediaPanel';
import PlanLightbox from '@/components/building/PlanLightbox';
import LanguageSwitch from '@/components/LanguageSwitch';
import SegmentedControl from '@/components/building/SegmentedControl';
import { explorerText } from '@/components/building/strings';
import es from '@/components/building/explorer.module.css';
import { localizeResidence } from '@/content/projects';
import { habaronBuilding, habaronHome, habaronMedia } from '@/content/projects/habaron-hirsh-1';
import { useLang } from '@/lib/i18n';
import s from './habaron.module.css';

const TABS: { value: MediaTab; icon: typeof Play }[] = [
 { value: 'film', icon: Play }, { value: 'plan', icon: LayoutPanelLeft }, { value: 'images', icon: Images }, { value: 'model', icon: Box }, { value: 'about', icon: Info },
];

// One home, shown the way the Sales Gallery's "Step inside" shows a home (same panel as N°8 KLEE), in the developer's
// colours: Villar yellow-green and Nachman navy (explorer.module.css, data-theme='habaron').
export default function HabaronApartment() {
 const lang = useLang();
 const t = explorerText[lang];
 const he = lang === 'he';
 const home = useMemo(() => ({ ...habaronHome, ...localizeResidence(habaronHome, lang) }), [lang]);
 const media = useMemo(() => habaronMedia(lang), [lang]);
 const [tab, setTab] = useState<MediaTab>('film');
 const [planOpen, setPlanOpen] = useState(false);
 const b = habaronBuilding;
 const floor = he ? habaronHome.floorLabelHe : habaronHome.floorLabel;

 // The lightbox is a portal outside the shell, so <html> carries the theme as well.
 useEffect(() => {
  document.documentElement.setAttribute('data-theme', 'habaron');
  return () => document.documentElement.removeAttribute('data-theme');
 }, []);
 useEffect(() => {
  const wanted = `${home.shortTitle} · ${he ? b.nameHe : b.name}`;
  const apply = () => { if (document.title !== wanted) document.title = wanted; };
  apply();
  const observer = new MutationObserver(apply);
  observer.observe(document.head, { subtree: true, childList: true, characterData: true });
  return () => observer.disconnect();
 }, [home.shortTitle, he, b.name, b.nameHe]);

 const specs: Spec[] = [{ key: 'exposure', label: t.specs.exposure, value: home.exposure }];

 return <MotionConfig reducedMotion="user"><div className={es.shell} data-theme="habaron"><div className={es.frame} data-focus>
  <main>
   <section className={es.explorer} aria-label={home.title}>
    <div className={es.grid}>
     <aside className={es.panel} aria-label={home.title}>
      <div className={es.head}>
       <div className={es.headText}>
        <span className={s.logos}>{b.logos.map(l => <img key={l.alt} src={l.src} alt={l.alt} width={l.w} height={l.h} className={s.logo} />)}</span>
        <h1 className={es.title}>{home.shortTitle}</h1>
        <p className={es.titleMeta}>{he ? b.nameHe : b.name}</p>
       </div>
       <div className={es.headAside}><span className={es.aptTag}>{home.label}</span></div>
      </div>
      <dl className={es.facts}>
       <div><dt>{t.rooms}</dt><dd className={es.factNumber}>{home.rooms}</dd></div>
       <div><dt>{t.floor}</dt><dd className={es.factWord}>{floor}</dd></div>
       <div><dt>{t.interior}</dt><dd className={es.factNumber}>{home.area}<span className={es.factUnit}>{t.sqm}</span></dd></div>
       <div><dt>{t.outdoor}</dt><dd className={es.factWord}>{home.outdoor}<span className={es.factUnit}>{home.outdoorArea} {t.sqm}</span></dd></div>
      </dl>
      <div className={es.tabs}>
       <SegmentedControl id="media" label={t.homePreview} role="tablist" controls="apartment-preview" fill value={tab} onChange={setTab} options={TABS.map(o => ({ ...o, label: t.tabs[o.value] }))} />
      </div>
      <div className={es.mediaWrap}>
       <MediaPanel tab={tab} residence={home} media={media} specs={specs} onExpandPlan={() => setPlanOpen(true)} />
      </div>
      <div className={s.agentCol}>
      {/* The agent is not known yet: the block shows as unfilled (dimmed, no links) until content/projects/habaron-hirsh-1.ts has one. */}
      <div className={`${es.contact} ${s.pending}`} role="group" aria-label={t.salesAgent}>
       <div className={es.contactWho}>
        <span className={es.contactAvatar} aria-hidden>N/A</span>
        <span className={es.contactName}><strong>N/A</strong><small>{t.salesAgent} · N/A</small></span>
       </div>
       <div className={es.contactActions}>
        <span className={es.contactPrimary} aria-disabled="true"><MessageCircle size={16} strokeWidth={1.8} aria-hidden /><span>{t.whatsapp}</span></span>
        <span className={es.contactButton} aria-disabled="true"><Phone size={15} strokeWidth={1.8} aria-hidden /><span dir="ltr" className={es.contactPhone}>N/A</span><span className={es.contactShort}>{t.call}</span></span>
        <span className={es.contactButton} aria-disabled="true"><Mail size={15} strokeWidth={1.8} aria-hidden /><span>{t.email}</span></span>
       </div>
      </div>
      <LanguageSwitch id="habaron-lang" className={s.lang} />
      </div>
      <footer className={s.footer}>
       <p className={s.credit}><strong>{he ? b.nameHe : b.name}</strong> · {he ? b.addressHe : b.address}<br />{he ? `יזם: ${b.developer} · אדריכלות: ${b.architects}` : `Developer: ${b.developer} · Architects: ${b.architects}`}</p>
       <p className={s.disclaimer}>{he ? b.disclaimerHe : b.disclaimer}</p>
      </footer>
     </aside>
    </div>
   </section>
  </main>
  <PlanLightbox open={planOpen} onOpenChange={setPlanOpen} src={home.plan} title={t.floorPlanOf(home.shortTitle)} />
 </div></div></MotionConfig>;
}
