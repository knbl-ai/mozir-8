import type { HomeData, Section, Status } from '@/components/home/data';
import type { Lang } from '@/lib/i18n';
import { PAGES_ORIGIN } from './apartment-page';

// A client order's apartment page (route /r/<slug>): its HomeData is home.json in the bucket, next to its media
// (pipeline/client/page.py writes it). One deploy serves every order: the page is built on its first visit and
// refreshed every minute, so a section that was "under construction" fills in when the pipeline writes a new home.json.
//
// The file comes from our own pipeline, but the page must never crash on a half-written or odd one: checkHome() checks
// every field the page reads. The page frame (hero, address, facts) must be complete or the page is "not found"; a
// section whose content is incomplete is shown as being made instead of failing; links and media must be https or a
// path on this site.
const STYLES = ['riviera-editorial', 'sunday-house', 'monograph'];
const SECTIONS: Section[] = ['films', 'plan', 'model', 'building', 'area', 'contact', 'kit'];
const STATUS: Status[] = ['ready', 'building', 'hidden'];
// same as lib/i18n.tsx ALL_LANGS (a client module: its values can't be read here on the server)
const LANGS: Lang[] = ['en', 'he', 'pt', 'el'];

type O = Record<string, unknown>;
const obj = (v: unknown): v is O => !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v: unknown) => typeof v === 'string' && v.length > 0;
const num = (v: unknown) => typeof v === 'number' && Number.isFinite(v);
const arr = (v: unknown, each?: (x: unknown) => boolean) => Array.isArray(v) && (!each || v.every(each));
const tx = (v: unknown) => obj(v) && str(v.en) && Object.values(v).every(x => typeof x === 'string');
const url = (v: unknown) => str(v) && (/^https:\/\/[^\s"'()<>]+$/.test(v as string) || /^\/[^\s"'()<>]*$/.test(v as string));
const opt = (v: unknown, f: (x: unknown) => boolean) => v === undefined || f(v);
const nums = (n: number) => (v: unknown) => arr(v, num) && (v as unknown[]).length === n;

const cut = (c: unknown) => obj(c) && url(c.src) && url(c.poster) && str(c.length) && (c.aspect === '16:9' || c.aspect === '9:16');
const films = (f: unknown) => obj(f) && Object.values(f).every(x => obj(x) && cut(x.long) && cut(x.short) && cut(x.phone)) && obj(f.en);
const room = (r: unknown) => obj(r) && str(r.id) && str(r.name) && arr(r.poly, nums(2)) && nums(2)(r.c) && ['area', 'w', 'd'].every(k => r[k] === null || num(r[k]));
const plan = (p: unknown) => obj(p) && obj(p.cutout) && url(p.cutout.image) && ['x', 'y', 'w', 'h'].every(k => num((p.cutout as O)[k]))
 && nums(4)(p.view) && obj(p.headline) && num(p.headline.area_m2) && num(p.headline.balcony_m2) && arr(p.rooms, room) && (p.rooms as unknown[]).length > 0;
const roomInfo = (r: unknown) => obj(r) && tx(r.line) && opt(r.name, tx) && arr(r.images, url) && opt(r.clip, url);
const shot = (m: unknown) => obj(m) && (m.kind === 'img' || m.kind === 'video') && url(m.src) && url(m.thumb) && tx(m.caption);
const figure = (f: unknown) => obj(f) && str(f.value) && tx(f.label);
const orbit = (o: unknown) => obj(o) && url(o.frames) && opt(o.ringVideo, url) && str(o.unit) && num(o.startView) && opt(o.aspect, num);
const building = (b: unknown) => obj(b) && arr(b.media, shot) && arr(b.figures, figure) && opt(b.orbit, orbit) && ((b.media as unknown[]).length > 0 || !!b.orbit);
const place = (p: unknown) => obj(p) && str(p.id) && str(p.kind) && tx(p.name) && tx(p.label) && nums(2)(p.xy) && (p.route === null || typeof p.route === 'string')
 && (p.walk_min === null || num(p.walk_min)) && (p.walk_m === null || num(p.walk_m));
const map = (m: unknown) => obj(m) && url(m.image) && nums(4)(m.view) && nums(2)(m.home) && arr(m.items, place) && (m.items as unknown[]).length > 0;
const model = (m: unknown) => obj(m) && url(m.glb) && url(m.poster) && opt(m.orbit, str) && opt(m.outdoorOrbit, str) && opt(m.walk, url);
const kit = (k: unknown) => obj(k) && obj(k.en) && Object.values(k).every(x => obj(x) && url(x.href) && str(x.size) && num(x.files) && arr(x.parts, p => obj(p) && str(p.n) && tx(p.label)));

/** The page's data if it can be shown, else null. Incomplete sections are set to "building". */
export function checkHome(d: unknown, slug: string): HomeData | null {
 if (!obj(d) || d.v !== 2 || d.slug !== slug || !STYLES.includes(d.style as string)) return null;
 // English is always one of the languages (interface words and every text fall back to it)
 if (!arr(d.langs, l => LANGS.includes(l as Lang)) || !(d.langs as Lang[]).includes('en')) return null;
 if (!obj(d.status) || !SECTIONS.every(k => STATUS.includes((d.status as O)[k] as Status))) return null;
 // the frame of the page: without these there is no page
 const a = d.address, h = d.hero, f = d.facts, c = d.copy;
 if (!tx(d.project) || !tx(d.unit) || !obj(a) || !tx(a.street) || !tx(a.city) || !tx(a.country) || !opt(a.word, tx) || !opt(a.no, str)) return null;
 if (!obj(h) || !url(h.wideStill) || !opt(h.wide, url) || !opt(h.tall, url) || !opt(h.tallStill, url)) return null;
 if (!obj(f) || !num(f.area) || !num(f.balcony) || !num(f.rooms)) return null;
 if (!opt(f.nearest, n => obj(n) && num(n.minutes) && tx(n.label) && str(n.icon))) return null;
 if (!obj(c) || !arr(c.pointsHead, tx) || (c.pointsHead as unknown[]).length !== 2 || !tx(c.wholeLine) || !tx(c.aspect)) return null;
 if (!opt(c.buildingHead, v => arr(v, tx) && (v as unknown[]).length === 2) || !opt(c.buildingSub, tx)) return null;
 if (!arr(d.points, p => obj(p) && str(p.icon) && tx(p.title) && tx(p.text))) return null;
 if (!arr(d.gallery, g => obj(g) && url(g.src) && url(g.thumb) && tx(g.caption) && opt(g.room, str))) return null;
 if (!arr(d.roomOrder, str) || !obj(d.rooms) || !Object.values(d.rooms).every(roomInfo)) return null;
 const where = obj(d.where) ? d.where : {};
 if (!opt(where.floor, num) || !opt(where.floors, num) || !opt(where.tower, str)) return null;
 if (!opt(d.developer, v => obj(v) && tx(v.name) && opt(v.logoWhite, url) && opt(v.logoBlack, url) && opt(v.url, url) && opt(v.linkLabel, tx) && opt(v.about, tx) && arr(v.facts, figure))) return null;
 if (!opt(d.agent, v => obj(v) && tx(v.name) && opt(v.role, tx) && opt(v.phone, str) && opt(v.email, str) && opt(v.photo, url))) return null;
 if (!opt(d.allLink, v => obj(v) && url(v.href) && tx(v.label))) return null;

 // sections: anything missing or malformed is dropped and the section shows as being made
 const status = { ...(d.status as Record<Section, Status>) };
 const out: O = { ...d, where, status };
 const section = (k: Section, field: string, ok: (v: unknown) => boolean) => {
  if (d[field] !== undefined && !ok(d[field])) delete out[field];
  if (status[k] === 'ready' && out[field] === undefined) status[k] = 'building';
 };
 section('films', 'films', films);
 section('model', 'model', model);
 section('building', 'building', building);
 section('area', 'map', map);
 section('kit', 'kit', kit);
 if (!plan(d.plan)) { out.plan = undefined; if (status.plan === 'ready') status.plan = 'building'; }
 if (status.contact === 'ready' && !d.agent && !d.developer) status.contact = 'hidden';
 if (!out.plan) return null;   // the plan is the one thing every order has (and the hero facts come from it)
 return out as unknown as HomeData;
}

export async function loadHome(slug: string): Promise<HomeData | null> {
 if (!/^[a-z0-9][a-z0-9-]{1,80}$/.test(slug)) return null;
 const r = await fetch(`${PAGES_ORIGIN}/${slug}/home.json`, { next: { revalidate: 60 } }).catch(() => null);
 if (!r?.ok) return null;
 return checkHome(await r.json().catch(() => null), slug);
}
