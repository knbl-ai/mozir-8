'use client';
import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { TYPES, type Unit } from '@/content/projects/gindi';
import { gindiText } from './strings';
import s from './gindi.module.css';

// "Book a meeting": a demo form. It names the chosen home and says plainly that nothing is sent.
export default function ContactDialog({ unit, onClose }: { unit: Unit | null | undefined; onClose: () => void }) {
 const lang = useLang(); const t = gindiText[lang];
 const [sent, setSent] = useState(false);
 useEffect(() => { if (unit !== undefined) setSent(false); }, [unit]);
 const about = unit ? `${lang === 'he' ? TYPES[unit.type].nameHe : TYPES[unit.type].name} · ${t.buildingN(unit.building)} · ${t.floorN(unit.floor)}` : 'Gindi Colors';
 return <Dialog.Root open={unit !== undefined} onOpenChange={o => !o && onClose()}>
  <Dialog.Portal>
   <Dialog.Overlay className={s.lightboxOverlay} />
   <Dialog.Content className={s.dialog} aria-describedby={undefined}>
    <p className={s.kicker}>GINDI COLORS</p>
    <Dialog.Title className={s.panelTitle}>{t.formTitle}</Dialog.Title>
    {sent ? <p className={s.formDone}>{t.formDone}</p> : <form className={s.form} onSubmit={e => { e.preventDefault(); setSent(true); }}>
     <p className={s.about}>{t.formLede}</p>
     <label><span>{t.formAbout}</span><input value={about} readOnly /></label>
     <label><span>{t.formName}</span><input name="name" required autoComplete="name" /></label>
     <label><span>{t.formPhone}</span><input name="phone" required type="tel" autoComplete="tel" dir="ltr" /></label>
     <label><span>{t.formEmail}</span><input name="email" type="email" autoComplete="email" dir="ltr" /></label>
     <button type="submit" className={s.goldBtn}>{t.formSend}</button>
    </form>}
    <Dialog.Close className={s.dialogClose} aria-label={t.close}><X size={18} strokeWidth={1.4} /></Dialog.Close>
   </Dialog.Content>
  </Dialog.Portal>
 </Dialog.Root>;
}
