import type { Lang } from '@/lib/i18n';
import type { MediaImage, Residence, ResidenceText, ResolvedMedia } from './projects';

// A finished apartment from the pipeline (runbook R-PIPE-FINAL): one unlisted, noindex page at residence.tech/<slug>.
// The box writes page.json (pipeline/aptlib/site_page.py, `cli finish`) next to the media in the bucket; no code or
// deploy per apartment. Nothing links to these pages: the front page and /projects stay hand-curated.
// APT_PAGES_ORIGIN: a local folder server for testing a page.json before it is uploaded.
export const PAGES_ORIGIN = process.env.APT_PAGES_ORIGIN ?? 'https://storage.googleapis.com/knbl-sma/apt3d/site/pages';

export type Text = { en: string; he?: string; pt?: string };
export type FilmRes = '480p' | '720p' | '1080p';
export type ApartmentPageData = {
 v: 1; slug: string; langs: Lang[]; theme?: string; published: string;
 building: { name: Text; address: Text; developer?: string; architects?: string; logos?: { src: string; alt: string; w: number; h: number }[]; disclaimer?: Text };
 home: { id: string; rooms: number; area: number; outdoorArea: number; floor: Text; title: Text; shortTitle: Text; tagline: Text; outdoor: Text;
  exposure: Text; label: Text; description: Text; about: { en: string[]; he?: string[]; pt?: string[] } };
 media: { film?: { src: string; poster: string; res: FilmRes }; images: { src: string; label: Text }[]; plan: string;
  model?: string; modelPoster?: string; modelOrbit?: string; modelOutdoorOrbit?: string };
};

export async function loadPage(slug: string): Promise<ApartmentPageData | null> {
 if (!/^[a-z0-9][a-z0-9-]{1,80}$/.test(slug)) return null;
 const r = await fetch(`${PAGES_ORIGIN}/${slug}/page.json`, { next: { revalidate: 60 } }).catch(() => null);
 if (!r?.ok) return null;
 const data = await r.json().catch(() => null) as ApartmentPageData | null;
 return data?.v === 1 && data.slug === slug ? data : null;
}

const pick = (t: Text | undefined, lang: Lang) => (t && (lang === 'he' ? t.he : lang === 'pt' ? t.pt : undefined)) ?? t?.en ?? '';

// A film below 1080p is the low-resolution version (the admin stopped at 480p): the page says so on the film.
const LOW_RES: Record<Lang, (res: string) => string> = {
 en: res => `Low-resolution preview · ${res}`, he: res => `תצוגה מקדימה ברזולוציה נמוכה · ${res}`, pt: res => `Pré-visualização em baixa resolução · ${res}`,
};
const LOW_RES_NOTE: Record<Lang, string> = {
 en: 'The film is a low-resolution preview.', he: 'הסרטון הוא תצוגה מקדימה ברזולוציה נמוכה.', pt: 'O filme é uma pré-visualização em baixa resolução.',
};
export const lowRes = (d: ApartmentPageData) => Boolean(d.media.film && d.media.film.res !== '1080p');
export const disclaimerIn = (d: ApartmentPageData, lang: Lang) =>
 [pick(d.building.disclaimer, lang), lowRes(d) ? LOW_RES_NOTE[lang] : ''].filter(Boolean).join(' ');
export const textIn = pick;

export function toResidence(d: ApartmentPageData): Residence {
 const h = d.home;
 const text = (lang: Lang): ResidenceText => ({ title: pick(h.title, lang), shortTitle: pick(h.shortTitle, lang), tagline: pick(h.tagline, lang),
  outdoor: pick(h.outdoor, lang), exposure: pick(h.exposure, lang), label: pick(h.label, lang), description: pick(h.description, lang),
  about: (lang === 'he' ? h.about.he : lang === 'pt' ? h.about.pt : undefined) ?? h.about.en });
 return { id: h.id, ...text('en'), rooms: h.rooms, area: h.area, outdoorArea: h.outdoorArea, plan: d.media.plan, sourceUnits: pick(h.shortTitle, 'en'),
  ...(d.langs.includes('he') ? { he: text('he') } : {}), ...(d.langs.includes('pt') ? { pt: text('pt') } : {}) };
}

export function toMedia(d: ApartmentPageData, lang: Lang): ResolvedMedia {
 const m = d.media;
 const film = m.film
  ? { src: m.film.src, poster: m.film.poster, ...(lowRes(d) ? { note: LOW_RES.en(m.film.res), noteHe: LOW_RES.he(m.film.res), notePt: LOW_RES.pt(m.film.res) } : {}) }
  : { src: '', poster: '' };
 const images: MediaImage[] = m.images.map(i => ({ src: i.src, label: pick(i.label, lang) }));
 return { film, images, model: m.model ?? '', modelPoster: m.modelPoster, modelOrbit: m.modelOrbit ?? '28deg 52deg 100%',
  modelOutdoorOrbit: m.modelOutdoorOrbit, modelStage: 'paper', placeholder: { film: false, images: false, model: false } };
}
