'use client';
import { motion } from 'motion/react';
import { LANGUAGES, setLang, useLang, usePageLangs, type Lang } from '@/lib/i18n';
import s from './LanguageSwitch.module.css';

// English and the page's second language (עברית, or Português on the Lisbon project), one sliding thumb.
// `compact` shows EN / עב / PT for crowded headers.
// `langs`: the page's own languages from its data (client pages), so the server and the browser render the same switch.
export default function LanguageSwitch({ id = 'lang', compact = false, tone = 'light', className, langs }: { id?: string; compact?: boolean; tone?: 'light' | 'glass' | 'dark'; className?: string; langs?: Lang[] }) {
 const lang = useLang();
 const pageLangs = usePageLangs();
 const offered = langs ?? pageLangs;
 return <div role="radiogroup" aria-label={lang === 'he' ? 'שפה' : lang === 'pt' ? 'Idioma' : lang === 'el' ? 'Γλώσσα' : 'Language'} className={`${s.switch} ${className ?? ''}`} data-tone={tone} data-compact={compact || undefined}>
  {LANGUAGES.filter(l => offered.includes(l.value)).map(l => <button key={l.value} type="button" role="radio" aria-checked={lang === l.value} lang={l.value} aria-label={l.label}
   className={s.option} data-active={lang === l.value || undefined} onClick={() => setLang(l.value)}>
   {lang === l.value && <motion.span layoutId={`${id}-thumb`} className={s.thumb} transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
   <span className={s.label}>{compact ? l.short : l.label}</span>
  </button>)}
 </div>;
}
