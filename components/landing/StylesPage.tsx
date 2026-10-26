'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import LanguageSwitch from '@/components/LanguageSwitch';
import Logo from '@/components/brand/Logo';
import { useLang, withLang } from '@/lib/i18n';
import { copy } from './copy';
import DimensionLine from './DimensionLine';
import { altFor, cover, ROOMS, styles, useSwipe, type DesignStyle } from './styleData';
import s from './landing.module.css';
import x from './styles.module.css';

type Tone = DesignStyle['axes']['value'];
type Temp = DesignStyle['axes']['temperature'];
const TONES: Tone[] = ['light', 'mid', 'dark'];
const TEMPS: Temp[] = ['warm', 'neutral', 'cool'];

function Swatches({ st, big }: { st: DesignStyle; big?: boolean }) {
 return <ul className={x.swatches} data-big={big || undefined} aria-hidden>{st.palette.map(c => <li key={c.hex} style={{ background: c.hex }} title={c.name} />)}</ul>;
}

// The four sample rooms of one style, one large image with arrows, keys (←/→, Esc), swipe and a strip of thumbnails.
function Lightbox({ st, container, onClose }: { st: DesignStyle; container: HTMLElement | null; onClose: () => void }) {
 const lang = useLang();
 const t = copy[lang].styles;
 const rtl = lang === 'he';
 const [r, setR] = useState(0);
 const n = ROOMS.length;
 const go = (to: number) => setR(((to % n) + n) % n);
 const swipe = useSwipe(() => go(r - 1), () => go(r + 1), rtl);
 const Prev = rtl ? ChevronRight : ChevronLeft, Next = rtl ? ChevronLeft : ChevronRight;
 const room = ROOMS[r];
 return <Dialog.Root open onOpenChange={o => !o && onClose()}>
  <Dialog.Portal container={container}>
   <Dialog.Overlay className={x.overlay} />
   <Dialog.Content className={x.lightbox} dir={rtl ? 'rtl' : 'ltr'}
    onKeyDown={e => { if (e.key === 'ArrowLeft') go(r + (rtl ? 1 : -1)); if (e.key === 'ArrowRight') go(r + (rtl ? -1 : 1)); }}>
    <div className={x.lbStage} {...swipe}>
     {st.images.map((im, k) => <img key={im.room} src={im.src} alt={k === r ? altFor(t, st, im.room) : ''} width={1600} height={900}
      className={x.lbImg} data-on={k === r || undefined} loading={k === 0 ? 'eager' : 'lazy'} draggable={false} />)}
     <button type="button" className={x.arrow} data-side="start" onClick={() => go(r - 1)} aria-label={t.prev}><Prev size={22} strokeWidth={1.8} aria-hidden /></button>
     <button type="button" className={x.arrow} data-side="end" onClick={() => go(r + 1)} aria-label={t.next}><Next size={22} strokeWidth={1.8} aria-hidden /></button>
     <span className={x.lbRoom}>{t.rooms[room]} · {r + 1} / {n}</span>
    </div>
    <div className={x.lbSide}>
     <Dialog.Close className={x.lbClose} aria-label={t.close}><X size={20} strokeWidth={1.8} aria-hidden /></Dialog.Close>
     <Dialog.Title className={x.lbTitle}>{st.name}</Dialog.Title>
     <Dialog.Description className={x.lbConcept}>{st.concept}</Dialog.Description>
     <p className={x.mood}>{st.mood.join(' · ')}</p>
     <h4 className={x.lbLabel}>{t.palette}</h4>
     <ul className={x.palette}>{st.palette.map(c => <li key={c.hex}><i style={{ background: c.hex }} aria-hidden />{c.name}</li>)}</ul>
     <div className={x.thumbs} role="group" aria-label={st.name}>
      {st.images.map((im, k) => <button key={im.room} type="button" className={x.thumb} data-on={k === r || undefined} aria-pressed={k === r}
       aria-label={t.roomNav(t.rooms[im.room])} onClick={() => setR(k)}>
       <img src={im.thumb} alt="" width={800} height={450} loading="lazy" draggable={false} /><span>{t.rooms[im.room]}</span>
      </button>)}
     </div>
    </div>
   </Dialog.Content>
  </Dialog.Portal>
 </Dialog.Root>;
}

export default function StylesPage() {
 const lang = useLang();
 const t = copy[lang].styles, f = copy[lang].footer;
 const rtl = lang === 'he';
 const [tone, setTone] = useState<Tone | null>(null);
 const [temp, setTemp] = useState<Temp | null>(null);
 const [open, setOpen] = useState<string | null>(null);
 const [page, setPage] = useState<HTMLElement | null>(null);
 const [scrolled, setScrolled] = useState(false);
 useEffect(() => {
  const on = () => setScrolled(window.scrollY > 8);
  on(); window.addEventListener('scroll', on, { passive: true });
  return () => window.removeEventListener('scroll', on);
 }, []);
 const shown = useMemo(() => styles.filter(st => (!tone || st.axes.value === tone) && (!temp || st.axes.temperature === temp)), [tone, temp]);
 const current = styles.find(st => st.slug === open) ?? null;
 const Back = rtl ? ArrowRight : ArrowLeft;

 return <div className={s.page} ref={setPage}>
  <header className={s.header} data-scrolled={scrolled || undefined}>
   <Link href={withLang('/', lang)} className={s.brand} aria-label="residence.tech"><Logo /></Link>
   <LanguageSwitch id="styles-lang" compact />
  </header>
  <main className={x.libMain}>
   <Link href={withLang('/#styles', lang)} className={x.back}><Back size={16} strokeWidth={1.8} aria-hidden />{t.back}</Link>
   <h1 className={s.sectionTitle}>{t.pageTitle}</h1>
   <p className={s.sectionLede}>{t.pageLede}</p>

   <div className={x.filters}>
    {([[t.tone, TONES, tone, setTone, t.values], [t.temperature, TEMPS, temp, setTemp, t.temps]] as const).map(([label, keys, value, set, names]) =>
     <div key={label} className={x.filterGroup} role="group" aria-label={label}>
      <span className={x.filterLabel}>{label}</span>
      <button type="button" className={x.chip} data-on={value === null || undefined} aria-pressed={value === null} onClick={() => (set as (v: null) => void)(null)}>{t.any}</button>
      {(keys as readonly string[]).map(k => <button key={k} type="button" className={x.chip} data-on={value === k || undefined} aria-pressed={value === k}
       onClick={() => (set as (v: string) => void)(k)}>{(names as Record<string, string>)[k]}</button>)}
     </div>)}
    <span className={x.found} role="status">{t.count(shown.length)}</span>
   </div>

   {shown.length === 0 ? <p className={s.note}>{t.empty}</p> : <ul className={x.grid}>
    {shown.map((st, k) => <li key={st.slug}>
     <button type="button" className={x.card} onClick={() => setOpen(st.slug)} aria-label={t.open(st.name)} aria-haspopup="dialog">
      <span className={x.cardImg}><img src={st.images[0].thumb} alt={altFor(t, st, 'living')} width={800} height={450} loading={k < 3 ? 'eager' : 'lazy'} decoding="async" /></span>
      <span className={x.cardName}>{st.name}</span>
      <span className={x.cardConcept}>{st.concept}</span>
      <span className={x.mood}>{st.mood.join(' · ')}</span>
      <Swatches st={st} />
     </button>
    </li>)}
   </ul>}
  </main>
  <footer className={s.footer}>
   <DimensionLine className={s.footerDim} />
   <div className={s.footerRow}>
    <Logo className={s.footerLogo} />
    <a href={`mailto:${f.contact}`}>{f.contact}</a>
    <span>© {new Date().getFullYear()} {f.line}</span>
   </div>
  </footer>
  {current && <Lightbox key={current.slug} st={current} container={page} onClose={() => setOpen(null)} />}
 </div>;
}
