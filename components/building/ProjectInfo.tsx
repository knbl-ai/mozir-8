'use client';
import { Building2, CalendarDays, Car, ExternalLink, KeyRound, MapPin, Navigation, Package, Tag } from 'lucide-react';
import type { Development } from '@/content/projects';
import { useLang } from '@/lib/i18n';
import { explorerText } from './strings';
import s from './explorer.module.css';

// The building as a whole: what the listing says about the project, and where it is.
export default function ProjectInfo({ project, available, priceFrom }: { project: Development; available: number; priceFrom?: number }) {
 const lang = useLang();
 const t = explorerText[lang];
 const { info } = project;
 const query = encodeURIComponent(info.mapQuery);
 const facts = [
  { icon: MapPin, label: t.address, value: info.address, note: info.area },
  { icon: Building2, label: t.buildingFacts, value: info.floors ? t.floorsN(info.floors) : '' },
  { icon: CalendarDays, label: t.moveIn, value: info.moveIn },
  { icon: KeyRound, label: t.availabilityNow, value: t.homesAvailable(available) },
  { icon: Tag, label: t.prices, value: priceFrom ? t.priceFrom(`${project.currency ?? t.currency}${new Intl.NumberFormat(lang === 'pt' ? 'pt-PT' : 'en-US', { useGrouping: 'always' }).format(priceFrom)}`) : t.pricesOnRequest, brand: true },
  { icon: Car, label: t.parking, value: info.parking },
  { icon: Package, label: t.storage, value: info.storage },
 ].filter(fact => fact.value);
 return <div className={s.projectView} role="region" aria-label={t.projectLabel}>
  <div className={s.projectInner}>
   <span className={s.projectKicker}>{info.kicker}</span>
   <h2 className={s.projectTitle}>{project.name}</h2>
   <p className={s.projectIntro}>{info.intro}</p>

   <h3 className={s.projectHeading}>{t.highlights}</h3>
   <dl className={s.projectFacts}>
    {facts.map(({ icon: Icon, label, value, note, brand }) => <div key={label} data-brand={brand || undefined}>
     <span className={s.projectFactIcon} aria-hidden><Icon size={16} strokeWidth={1.6} /></span>
     <dt>{label}</dt>
     <dd>{value}{note && <small>{note}</small>}</dd>
    </div>)}
   </dl>

   <h3 className={s.projectHeading}>{t.locationTitle}</h3>
   <div className={s.mapFrame}>
    <iframe title={t.mapTitle(info.address)} src={`https://maps.google.com/maps?q=${query}&z=16&hl=${lang}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
   </div>
   <div className={s.mapLinks}>
    <a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noreferrer"><ExternalLink size={14} strokeWidth={1.8} aria-hidden />{t.openMaps}</a>
    <a href={`https://waze.com/ul?q=${query}&navigate=yes`} target="_blank" rel="noreferrer"><Navigation size={14} strokeWidth={1.8} aria-hidden />{t.openWaze}</a>
   </div>
   {info.location.map(p => <p key={p.slice(0, 24)} className={s.projectText}>{p}</p>)}
   <p className={s.projectDisclaimer}>{info.disclaimer}</p>
  </div>
 </div>;
}
