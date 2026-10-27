'use client';
import { ArrowDownToLine, ChevronDown } from 'lucide-react';
import { textIn, type ApartmentPageData } from '@/content/apartment-page';
import type { Lang } from '@/lib/i18n';
import s from './downloads.module.css';

// The page's media to save (page.json `downloads: true`; requester of job ebc9142b, 2026-10-26): one "download all" zip
// plus each file on its own. Links go through the site's /pages rewrite (vercel.json): the `download` attribute only
// works on same-origin links, a link straight to the bucket would open the film instead of saving it. Playback still
// reads the bucket directly (components/landing/media.ts: Range answers must not go through the CDN).
const BUCKET = 'https://storage.googleapis.com/knbl-sma/apt3d/site/';
const local = (url: string) => (url.startsWith(BUCKET) ? '/' + url.slice(BUCKET.length) : url);
const ext = (url: string) => url.split('?')[0].match(/\.(\w+)$/)?.[1] ?? '';

const T: Record<Lang, { title: string; all: string; each: string; film: (r: string) => string; plan: string; model: string }> = {
 en: { title: 'Downloads', all: 'Download everything', each: 'Or choose files', film: r => `Walkthrough film · ${r}`, plan: 'Floor plan', model: '3D model (GLB)' },
 he: { title: 'הורדות', all: 'להורדת הכול', each: 'או לבחור קבצים', film: r => `סרט הסיור · ${r}`, plan: 'תוכנית הדירה', model: 'מודל תלת־ממד (GLB)' },
 pt: { title: 'Downloads', all: 'Baixar tudo', each: 'Ou escolher arquivos', film: r => `Filme do percurso · ${r}`, plan: 'Planta', model: 'Modelo 3D (GLB)' },
};
const mb = (bytes?: number) => (bytes ? `${Math.max(1, Math.round(bytes / 2 ** 20))} MB` : '');

export default function Downloads({ data, lang }: { data: ApartmentPageData; lang: Lang }) {
 const t = T[lang], m = data.media, slug = data.slug;
 const files = [
  ...(m.film ? [{ href: m.film.src, label: t.film(m.film.res), name: `${slug}-film.mp4` }] : []),
  ...m.images.map((im, i) => ({ href: im.src, label: textIn(im.label, lang), name: `${slug}-${String(i + 1).padStart(2, '0')}.${ext(im.src)}` })),
  { href: m.plan, label: t.plan, name: `${slug}-plan.${ext(m.plan)}` },
  ...(m.model ? [{ href: m.model, label: t.model, name: `${slug}-3d.glb` }] : []),
 ];
 return <section className={s.downloads} aria-labelledby="downloads-title">
  <h2 id="downloads-title" className={s.title}>{t.title}</h2>
  {m.zip && <a className={s.all} href={local(m.zip.src)} download={`${slug}.zip`}>
   <ArrowDownToLine size={16} aria-hidden /><span>{t.all}</span><span className={s.size}>zip · {mb(m.zip.bytes)}</span>
  </a>}
  <details className={s.each} open={!m.zip}>
   <summary>{t.each}<ChevronDown size={14} aria-hidden /></summary>
   <ul>
    {files.map(f => <li key={f.href}><a href={local(f.href)} download={f.name}><span>{f.label}</span><ArrowDownToLine size={14} aria-hidden /></a></li>)}
   </ul>
  </details>
 </section>;
}
