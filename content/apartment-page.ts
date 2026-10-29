import type { Lang } from '@/lib/i18n';
import type { MediaImage, Residence, ResidenceText, ResolvedMedia } from './projects';

// A finished apartment from the pipeline (runbook R-PIPE-FINAL): one unlisted, noindex page at residence.tech/<slug>.
// The box writes page.json (pipeline/aptlib/site_page.py, `cli finish`) next to the media in the bucket; no code or
// deploy per apartment. Nothing links to these pages: the front page and /projects stay hand-curated.
// APT_PAGES_ORIGIN: a local folder server for testing a page.json before it is uploaded.
export const PAGES_ORIGIN = process.env.APT_PAGES_ORIGIN ?? 'https://storage.googleapis.com/knbl-sma/apt3d/site/pages';

export type Text = { en: string; he?: string; pt?: string };
export type FilmRes = '480p' | '720p' | '1080p';
// More cuts of the same walkthrough (page.yaml `films:`, pipeline/video_variants): highlights, infographic, 3D, a vertical
// reel. The page shows a film switcher when there are any; the main film stays the first and the default.
export type FilmCut = { id: string; title: Text; src: string; poster: string; seconds?: number; aspect?: '16:9' | '9:16' };
// The client's own colours (from their logo / sales sheet), when they have them: hex only. `font: 'geometric'` swaps the
// serif display face for Outfit + DM Sans (as on HaBaron). Missing keys keep the residence.tech defaults.
export type Brand = { accent?: string; cta?: string; mark?: string; surface?: string; ink?: string; font?: 'geometric' };
export type ApartmentPageData = {
 v: 1; slug: string; langs: Lang[]; theme?: string; brand?: Brand; published: string;
 // downloads: the page offers its media to save (components/apartment/Downloads.tsx); media.zip = every file in one archive
 downloads?: boolean;
 building: { name: Text; address: Text; developer?: string; architects?: string; logos?: { src: string; alt: string; w: number; h: number }[]; disclaimer?: Text };
 home: { id: string; rooms: number; area: number; outdoorArea: number; floor: Text; title: Text; shortTitle: Text; tagline: Text; outdoor: Text;
  exposure: Text; label: Text; description: Text; about: { en: string[]; he?: string[]; pt?: string[] } };
 media: { film?: { src: string; poster: string; res: FilmRes; seconds?: number }; films?: FilmCut[]; images: { src: string; label: Text }[]; plan: string;
  model?: string; modelPoster?: string; modelOrbit?: string; modelOutdoorOrbit?: string; zip?: { src: string; bytes?: number } };
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

const HEX = /^#[0-9a-fA-F]{6}$/;
const mix = (c: string, pct: number, to: string) => `color-mix(in oklab, ${c} ${pct}%, ${to})`;
// CSS variables for the explorer's tokens (explorer.module.css: the shell and its portals redefine them, so the page
// writes one rule for all of them, see ApartmentPage).
export function brandVars(b?: Brand): Record<string, string> {
 if (!b) return {};
 const ok = (c?: string) => (c && HEX.test(c) ? c : undefined);
 const accent = ok(b.accent), cta = ok(b.cta) ?? accent, mark = ok(b.mark), surface = ok(b.surface), ink = ok(b.ink);
 const v: Record<string, string> = {};
 if (accent) Object.assign(v, { '--accent': accent, '--accent-hover': mix(accent, 85, 'black'), '--brand-blue': accent, '--brand-blue-tint': mix(accent, 8, 'transparent'), '--mark': accent });
 if (cta) Object.assign(v, { '--cta': cta, '--cta-hover': mix(cta, 85, 'black'), '--cta-glow': mix(cta, 40, 'transparent'), '--brand-red': cta, '--brand-red-tint': mix(cta, 10, 'transparent') });
 if (mark) v['--mark'] = mark;
 if (surface) Object.assign(v, { '--surface': surface, '--well': mix(surface, 92, 'black'), '--header-bg': mix(surface, 90, 'transparent') });
 if (ink) Object.assign(v, { '--ink': ink, '--ink-2': mix(ink, 72, 'white'), '--ink-3': mix(ink, 50, 'white'), '--hairline': mix(ink, 9, 'transparent'), '--hairline-strong': mix(ink, 16, 'transparent'), '--fill': mix(ink, 5, 'transparent') });
 if (b.font === 'geometric') Object.assign(v, { '--display': "'Habaron Display', 'Hebrew Display', system-ui, sans-serif", '--sans': "'Habaron Sans', 'Hebrew Sans', system-ui, -apple-system, sans-serif" });
 return v;
}

export function toResidence(d: ApartmentPageData): Residence {
 const h = d.home;
 const text = (lang: Lang): ResidenceText => ({ title: pick(h.title, lang), shortTitle: pick(h.shortTitle, lang), tagline: pick(h.tagline, lang),
  outdoor: pick(h.outdoor, lang), exposure: pick(h.exposure, lang), label: pick(h.label, lang), description: pick(h.description, lang),
  about: (lang === 'he' ? h.about.he : lang === 'pt' ? h.about.pt : undefined) ?? h.about.en });
 return { id: h.id, ...text('en'), rooms: h.rooms, area: h.area, outdoorArea: h.outdoorArea, plan: d.media.plan, sourceUnits: pick(h.shortTitle, 'en'),
  ...(d.langs.includes('he') ? { he: text('he') } : {}), ...(d.langs.includes('pt') ? { pt: text('pt') } : {}) };
}

const FULL: Text = { en: 'Full walkthrough', he: 'סיור מלא', pt: 'Percurso completo' };
// Every film of the page in order: the main walkthrough first, then the extra cuts.
export const filmCuts = (d: ApartmentPageData): FilmCut[] => [
 ...(d.media.film ? [{ id: 'film', title: FULL, src: d.media.film.src, poster: d.media.film.poster, seconds: d.media.film.seconds, aspect: '16:9' as const }] : []),
 ...(d.media.films ?? []),
];

// `cut`: the film the switcher picked (filmCuts id); `autoplay` when the viewer picked it, so it starts at once.
export function toMedia(d: ApartmentPageData, lang: Lang, cut?: string, autoplay = false): ResolvedMedia {
 const m = d.media;
 const extra = cut && cut !== 'film' ? m.films?.find(f => f.id === cut) : undefined;
 const film = extra
  ? { src: extra.src, poster: extra.poster, autoplay }
  : m.film
  ? { src: m.film.src, poster: m.film.poster, autoplay, ...(lowRes(d) ? { note: LOW_RES.en(m.film.res), noteHe: LOW_RES.he(m.film.res), notePt: LOW_RES.pt(m.film.res) } : {}) }
  : { src: '', poster: '' };
 const images: MediaImage[] = m.images.map(i => ({ src: i.src, label: pick(i.label, lang) }));
 return { film, images, model: m.model ?? '', modelPoster: m.modelPoster, modelOrbit: m.modelOrbit ?? '28deg 52deg 100%',
  modelOutdoorOrbit: m.modelOutdoorOrbit, modelStage: 'paper', placeholder: { film: false, images: false, model: false } };
}
