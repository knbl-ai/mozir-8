'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, X } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { UNITS } from '@/content/projects/gindi';
import { gindiText } from './strings';
import s from './gindi.module.css';

// The developer gives no street address ("the new north of Kiryat HaSharon"), so the map shows the neighbourhood.
const PLACE = 'Kiryat HaSharon, Netanya, Israel';
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PLACE)}`;

// About the complex: the facts, the amenities and the neighbourhood on a map. Figures beyond the plans are sample data.
export default function ComplexInfo({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
 const lang = useLang(); const t = gindiText[lang];
 const available = UNITS.filter(u => u.status === 'available').length;
 const facts: [string, string][] = [
  [t.ciTowers, '4'], [t.ciFloors, '21'], [t.ciHomes, String(UNITS.length)], [t.ciAvailable, String(available)],
  [t.ciSizes, t.ciSizesValue], [t.ciDelivery, t.ciDeliveryValue],
 ];
 return <Dialog.Root open={open} onOpenChange={onOpenChange}>
  <Dialog.Portal>
   <Dialog.Overlay className={s.lightboxOverlay} />
   <Dialog.Content className={`${s.dialog} ${s.complexInfo}`} aria-describedby={undefined}>
    <div className={s.ciText}>
     <p className={s.kicker}>{t.heroKicker}</p>
     <Dialog.Title className={s.ciTitle}>{t.ciTitle}</Dialog.Title>
     <p className={s.ciLead}>{t.ciLead}</p>
     <dl className={s.ciFacts}>
      {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
     </dl>
     <h3 className={s.ciHead}>{t.ciAmenities}</h3>
     <ul className={s.ciList}>{t.ciAmenityList.map(a => <li key={a}>{a}</li>)}</ul>
     <h3 className={s.ciHead}>{t.ciNearby}</h3>
     <ul className={s.ciNear}>{t.ciNearList.map(([place, time]) => <li key={place}><span>{place}</span><span>{time}</span></li>)}</ul>
     <p className={s.ciNote}>{t.ciNote}</p>
    </div>
    <div className={s.ciMap}>
     <iframe title={t.ciMapTitle} src={`https://maps.google.com/maps?q=${encodeURIComponent(PLACE)}&z=14&hl=${lang === 'he' ? 'iw' : 'en'}&output=embed`}
      loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
     <a className={s.ciMapLink} href={mapsLink} target="_blank" rel="noopener">{t.ciOpenMaps}<ArrowUpRight size={14} strokeWidth={1.6} aria-hidden /></a>
    </div>
    <Dialog.Close className={s.dialogClose} aria-label={t.close}><X size={18} strokeWidth={1.4} /></Dialog.Close>
   </Dialog.Content>
  </Dialog.Portal>
 </Dialog.Root>;
}
