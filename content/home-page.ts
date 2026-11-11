import type { HomeData, Section, Status } from '@/components/home/data';
import type { Lang } from '@/lib/i18n';
import { PAGES_ORIGIN } from './apartment-page';

// A client order's apartment page (route /r/<slug>): its HomeData is home.json in the bucket, next to its media
// (pipeline/client/page.py writes it). One deploy serves every order: the page is built on its first visit and
// refreshed every minute, so a section that was "under construction" fills in when the pipeline writes a new home.json.
const STYLES = ['riviera-editorial', 'sunday-house', 'monograph'];
const SECTIONS: Section[] = ['films', 'plan', 'model', 'building', 'area', 'contact', 'kit'];
const STATUS: Status[] = ['ready', 'building', 'hidden'];
// same as lib/i18n.tsx ALL_LANGS (a client module: its values can't be read here on the server)
const LANGS: Lang[] = ['en', 'he', 'pt', 'el'];

/** Enough structure that the page can't crash on a half-written file; anything off → not found. */
export function checkHome(d: unknown, slug: string): HomeData | null {
 const h = d as HomeData | null;
 if (!h || h.v !== 2 || h.slug !== slug || !STYLES.includes(h.style)) return null;
 if (!Array.isArray(h.langs) || !h.langs.length || !h.langs.every(l => LANGS.includes(l))) return null;
 if (!h.status || !SECTIONS.every(k => STATUS.includes(h.status[k]))) return null;
 if (!h.project?.en || !h.unit?.en || !h.address?.street?.en || !h.address?.city?.en || !h.hero?.wideStill) return null;
 if (!h.facts || typeof h.facts.area !== 'number' || !h.copy?.pointsHead || !Array.isArray(h.points)) return null;
 if (!h.plan?.cutout || !Array.isArray(h.plan.rooms) || !h.rooms || !Array.isArray(h.gallery) || !Array.isArray(h.roomOrder)) return null;
 // a section marked ready must have its content; otherwise it shows as being made
 const need: Partial<Record<Section, unknown>> = { films: h.films?.en, model: h.model, building: h.building, area: h.map, kit: h.kit?.en };
 for (const [k, v] of Object.entries(need)) if (h.status[k as Section] === 'ready' && !v) h.status[k as Section] = 'building';
 return h;
}

export async function loadHome(slug: string): Promise<HomeData | null> {
 if (!/^[a-z0-9][a-z0-9-]{1,80}$/.test(slug)) return null;
 const r = await fetch(`${PAGES_ORIGIN}/${slug}/home.json`, { next: { revalidate: 60 } }).catch(() => null);
 if (!r?.ok) return null;
 return checkHome(await r.json().catch(() => null), slug);
}
