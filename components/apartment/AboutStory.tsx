'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, X } from 'lucide-react';
import { textIn, type ApartmentPageData } from '@/content/apartment-page';
import type { Residence } from '@/content/projects';
import type { Lang } from '@/lib/i18n';
import s from './about.module.css';

// About on scroll (user 2026-11-08, Paros villa: "about should be below instead of in a separate tab", as on the Symbol
// page): below the home card, a story in the page's own tokens (theme or client brand) — the title and lead, the home in
// four big figures, then each About paragraph beside one of the page's About images (page.yaml `about_images`, taken out
// of the gallery), alternating sides; images beyond the paragraphs close it as a pair of tiles.
const EASE = [0.22, 1, 0.36, 1] as const;
const T: Record<Lang, { kicker: string; more: string; rooms: string; area: string; outdoor: string; exposure: string; close: string }> = {
 en: { kicker: 'About the home', more: 'About the home', rooms: 'Rooms', area: 'Interior, m²', outdoor: 'Outdoor, m²', exposure: 'Exposure', close: 'Close' },
 he: { kicker: 'על הבית', more: 'על הבית', rooms: 'חדרים', area: 'פנים, מ״ר', outdoor: 'חוץ, מ״ר', exposure: 'כיווני אוויר', close: 'סגירה' },
 pt: { kicker: 'Sobre a casa', more: 'Sobre a casa', rooms: 'Divisões', area: 'Interior, m²', outdoor: 'Exterior, m²', exposure: 'Orientação', close: 'Fechar' },
 el: { kicker: 'Σχετικά με το σπίτι', more: 'Σχετικά με το σπίτι', rooms: 'Δωμάτια', area: 'Εσωτερικό, m²', outdoor: 'Εξωτερικό, m²', exposure: 'Προσανατολισμός', close: 'Κλείσιμο' },
};
const num = (v: number, lang: Lang) => new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang === 'he' ? 'he-IL' : lang === 'pt' ? 'pt-PT' : 'el-GR', { maximumFractionDigits: 1 }).format(v);

export function ScrollCue({ lang }: { lang: Lang }) {
 return <a className={s.cue} href="#about" aria-label={T[lang].more}><span>{T[lang].more}</span><ChevronDown size={16} strokeWidth={1.6} aria-hidden /></a>;
}

export default function AboutStory({ data, home, lang }: { data: ApartmentPageData; home: Residence; lang: Lang }) {
 const t = T[lang];
 const imgs = (data.media.aboutImages?.length ? data.media.aboutImages : data.media.images.slice(1, 4)).map(i => ({ src: i.src, label: textIn(i.label, lang) }));
 const paras = home.about ?? [];
 const rows = paras.map((p, i) => ({ p, img: imgs[i] }));
 const rest = imgs.slice(paras.length);
 const [open, setOpen] = useState<{ src: string; label: string } | null>(null);
 const figures = [
  { v: num(home.rooms, lang), l: t.rooms },
  { v: num(home.area, lang), l: t.area },
  ...(home.outdoorArea > 0 ? [{ v: num(home.outdoorArea, lang), l: t.outdoor }] : []),
  ...(home.exposure ? [{ v: home.exposure, l: t.exposure, word: true }] : []),
 ];
 return <section id="about" className={s.story} aria-label={t.kicker}>
  <motion.header className={s.head} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease: EASE }}>
   <p className={s.kicker}>{t.kicker}</p>
   <h2 className={s.display}>{home.title}</h2>
   {home.tagline && <p className={s.lead}>{home.tagline}</p>}
  </motion.header>
  <div className={s.figures} data-n={figures.length}>
   {figures.map((f, i) => <motion.div key={f.l} className={s.figure} data-word={'word' in f ? '' : undefined} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}>
    <strong>{f.v}</strong><span>{f.l}</span>
   </motion.div>)}
  </div>
  <div className={s.chapters}>
   {rows.map(({ p, img }, i) => <motion.article key={i} className={s.chapter} data-flip={i % 2 ? '' : undefined} data-noimg={img ? undefined : ''} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1, ease: EASE }}>
    {img && <figure className={s.photo}>
     <button type="button" className={s.photoBtn} onClick={() => setOpen(img)} aria-label={img.label}><img src={img.src} alt={img.label} loading="lazy" /></button>
     <figcaption>{img.label}</figcaption>
    </figure>}
    <div className={s.copy}><span className={s.index}>{String(i + 1).padStart(2, '0')}</span><p>{p}</p></div>
   </motion.article>)}
  </div>
  {rest.length > 0 && <div className={s.tiles}>
   {rest.map((img, i) => <motion.figure key={img.src} className={s.tile} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.9, ease: EASE, delay: i * 0.06 }}>
    <button type="button" className={s.photoBtn} onClick={() => setOpen(img)} aria-label={img.label}><img src={img.src} alt={img.label} loading="lazy" /></button>
    <figcaption>{img.label}</figcaption>
   </motion.figure>)}
  </div>}
  {open && <div className={s.viewer} role="dialog" aria-modal="true" aria-label={open.label} onClick={() => setOpen(null)}>
   <img src={open.src} alt={open.label} />
   <p>{open.label}</p>
   <button type="button" className={s.viewerClose} onClick={() => setOpen(null)} aria-label={t.close}><X size={18} strokeWidth={1.8} aria-hidden /></button>
  </div>}
 </section>;
}
