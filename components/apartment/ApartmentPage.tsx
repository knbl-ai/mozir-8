'use client';
import { useEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Box, Images, Info, LayoutPanelLeft, Play } from 'lucide-react';
import MediaPanel, { type MediaTab, type Spec } from '@/components/building/MediaPanel';
import PlanLightbox from '@/components/building/PlanLightbox';
import LanguageSwitch from '@/components/LanguageSwitch';
import SegmentedControl from '@/components/building/SegmentedControl';
import { explorerText } from '@/components/building/strings';
import es from '@/components/building/explorer.module.css';
import { localizeResidence } from '@/content/projects';
import { disclaimerIn, textIn, toMedia, toResidence, type ApartmentPageData } from '@/content/apartment-page';
import { setPageLangs, useLang } from '@/lib/i18n';
import s from '@/components/habaron/habaron.module.css';

const TABS: { value: MediaTab; icon: typeof Play }[] = [
 { value: 'film', icon: Play }, { value: 'plan', icon: LayoutPanelLeft }, { value: 'images', icon: Images }, { value: 'model', icon: Box }, { value: 'about', icon: Info },
];

// One finished pipeline apartment, laid out like the HaBaron Hirsh 1 page (components/habaron) but driven by page.json.
// The theme is an optional [data-theme] block in explorer.module.css; without one the Sales Gallery's colours apply.
export default function ApartmentPage({ data }: { data: ApartmentPageData }) {
 setPageLangs(data.langs);
 useEffect(() => () => setPageLangs(null), []);
 const lang = useLang();
 const t = explorerText[lang];
 const residence = useMemo(() => toResidence(data), [data]);
 const home = useMemo(() => localizeResidence(residence, lang), [residence, lang]);
 const media = useMemo(() => toMedia(data, lang), [data, lang]);
 const [tab, setTab] = useState<MediaTab>(data.media.film ? 'film' : 'images');
 const [planOpen, setPlanOpen] = useState(false);
 const b = data.building;
 const name = textIn(b.name, lang);

 // The lightbox is a portal outside the shell, so <html> carries the theme as well.
 useEffect(() => {
  if (!data.theme) return;
  document.documentElement.setAttribute('data-theme', data.theme);
  return () => document.documentElement.removeAttribute('data-theme');
 }, [data.theme]);
 useEffect(() => { document.title = `${home.shortTitle} · ${name}`; }, [home.shortTitle, name]);

 const specs: Spec[] = home.exposure ? [{ key: 'exposure', label: t.specs.exposure, value: home.exposure }] : [];
 const credits = [b.developer && (lang === 'he' ? `יזם: ${b.developer}` : `Developer: ${b.developer}`),
  b.architects && (lang === 'he' ? `אדריכלות: ${b.architects}` : `Architects: ${b.architects}`)].filter(Boolean).join(' · ');

 return <MotionConfig reducedMotion="user"><div className={es.shell} data-theme={data.theme} data-single><div className={es.frame} data-focus>
  <main>
   <section className={es.explorer} aria-label={home.title}>
    <div className={es.grid}>
     <aside className={es.panel} aria-label={home.title}>
      <div className={es.head}>
       <div className={es.headText}>
        {b.logos?.length ? <span className={s.logos}>{b.logos.map(l => <img key={l.alt} src={l.src} alt={l.alt} width={l.w} height={l.h} className={s.logo} />)}</span> : null}
        <h1 className={es.title}>{home.shortTitle}</h1>
        <p className={es.titleMeta}>{name}</p>
       </div>
       {home.label && <div className={es.headAside}><span className={es.aptTag}>{home.label}</span></div>}
      </div>
      <dl className={es.facts}>
       <div><dt>{t.rooms}</dt><dd className={es.factNumber}>{home.rooms}</dd></div>
       <div><dt>{t.floor}</dt><dd className={es.factWord}>{textIn(data.home.floor, lang)}</dd></div>
       <div><dt>{t.interior}</dt><dd className={es.factNumber}>{home.area}<span className={es.factUnit}>{t.sqm}</span></dd></div>
       {home.outdoorArea > 0 && <div><dt>{t.outdoor}</dt><dd className={es.factWord}>{home.outdoor}<span className={es.factUnit}>{home.outdoorArea} {t.sqm}</span></dd></div>}
       <div className={es.factPrice}><dt>{t.price}</dt><dd className={es.factWord}>{t.onRequest}</dd></div>
      </dl>
      <div className={es.tabs}>
       <SegmentedControl id="media" label={t.homePreview} role="tablist" controls="apartment-preview" fill value={tab} onChange={setTab} options={TABS.map(o => ({ ...o, label: t.tabs[o.value] }))} />
      </div>
      <div className={es.mediaWrap} data-tab={tab}>
       <MediaPanel tab={tab} residence={home} media={media} specs={specs} onExpandPlan={() => setPlanOpen(true)} />
      </div>
      {data.langs.length > 1 && <div className={s.agentCol}><LanguageSwitch id="apt-lang" className={s.lang} /></div>}
      <footer className={s.footer}>
       <p className={s.credit}><strong>{name}</strong> · {textIn(b.address, lang)}{credits && <><br />{credits}</>}</p>
       <p className={s.disclaimer}>{disclaimerIn(data, lang)}</p>
      </footer>
     </aside>
    </div>
   </section>
  </main>
  <PlanLightbox open={planOpen} onOpenChange={setPlanOpen} src={home.plan} title={t.floorPlanOf(home.shortTitle)} />
 </div></div></MotionConfig>;
}
