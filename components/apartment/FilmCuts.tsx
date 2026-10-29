'use client';
import { Smartphone } from 'lucide-react';
import { textIn, type FilmCut } from '@/content/apartment-page';
import type { Lang } from '@/lib/i18n';
import s from './filmcuts.module.css';

// The page's films (page.json media.film + media.films): one row of choices above the player, the main walkthrough first.
// Each says its length; a vertical reel carries a phone mark. Picking one plays it (ApartmentPage → toMedia autoplay).
const T: Record<Lang, { label: string; vertical: string }> = {
 en: { label: 'Films', vertical: 'Vertical, for phones' }, he: { label: 'סרטונים', vertical: 'אנכי, לטלפון' }, pt: { label: 'Filmes', vertical: 'Vertical, para celular' },
};
const clock = (sec?: number) => (sec ? `${Math.floor(Math.round(sec) / 60)}:${String(Math.round(sec) % 60).padStart(2, '0')}` : '');

export default function FilmCuts({ cuts, value, onChange, lang }: { cuts: FilmCut[]; value: string; onChange: (id: string) => void; lang: Lang }) {
 const t = T[lang];
 return <div className={s.cuts} role="radiogroup" aria-label={t.label}>
  {cuts.map(c => {
   const title = textIn(c.title, lang), vertical = c.aspect === '9:16';
   return <button key={c.id} type="button" role="radio" aria-checked={c.id === value} data-active={c.id === value || undefined}
    className={s.cut} onClick={() => onChange(c.id)} title={vertical ? `${title} · ${t.vertical}` : title}>
    {vertical && <Smartphone size={13} strokeWidth={1.8} aria-label={t.vertical} />}
    <span className={s.name}>{title}</span>
    {c.seconds ? <span className={s.time}>{clock(c.seconds)}</span> : null}
   </button>;
  })}
 </div>;
}
