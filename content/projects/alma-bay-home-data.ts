// Alma Bay · Residence 01 as HomeData (components/home/data.ts): the hand-built pilot page, now one instance of the
// data-driven template the client pages use. Facts and media: alma-bay-home.ts; films: alma-bay-films.ts; the Hebrew
// words of the home are here (they were in components/home/strings.ts before the template).
import type { FilmStyleSlug, HomeData, Tx } from '@/components/home/data';
import { FILM_STYLES, HE_FILMS } from './alma-bay-films';
import { HOME, ROOMS } from './alma-bay-home';
import { HOMES } from './shirat-hayam';

const ROOM_NAMES_HE: Record<string, string> = {
 living: 'סלון · פינת אוכל · מטבח', corridor: 'מסדרון', master: 'חדר הורים', ensuite: 'חדר רחצה הורים', bed2: 'חדר שינה 2', bed3: 'חדר שינה 3',
 safe: 'ממ״ד (חדר שינה 4)', wc: 'שירותי אורחים', bath: 'חדר רחצה משפחתי', laundry: 'מרפסת שירות', balcony: 'מרפסת',
};
const ROOM_LINES_HE: Record<string, string> = {
 living: 'חלל ארוך אחד מהדלת הראשית ועד קיר החלונות הצפוני: המטבח עם אי של 3.4 מ׳, פינת אוכל לשישה והסלון.',
 balcony: 'פתוחה לצפון ולמערב — שולחן לשישה והים באלכסון, 25 קומות מעל הקרקע.',
 corridor: 'מסדרון ברוחב 1.2 מ׳ מהחלל המרכזי אל האגף השקט.',
 master: 'יחידת ההורים: מעבר ארונות לצד חדר הרחצה הצמוד, החלון לצפון.',
 ensuite: 'מקלחון, אסלה וכיור כפול, עם חלון חלבי.',
 bed2: 'חדר שינה הפונה מזרחה אל העיר, עם שולחן עבודה מתחת לחלון.',
 bed3: 'חדר ילדים נוסף, הפונה מזרחה.',
 safe: 'הממ״ד, מרוהט כחדר עבודה או חדר שינה רביעי.',
 wc: 'שירותי אורחים מהמסדרון.',
 bath: 'חדר הרחצה המשפחתי — הגדול בדירה, עם מקלחת גשם.',
 laundry: 'מרפסת שירות עם חבלי כביסה מאחורי מסתור, מחדר הרחצה.',
};
const POINTS_HE: [string, string][] = [
 ['דירת פינה', 'בצפון־מזרח המגדל, אור משני כיוונים'],
 ['אי מטבח', 'הדלת הראשית נפתחת אל המטבח והאי באורך 3.4 מ׳'],
 ['סלון לצפון', 'לאורך קיר החלונות, פתוח אל המרפסת'],
 ['מרפסת 4.6 × 4.8 מ׳', 'שולחן לשישה, הים באלכסון במערב'],
 ['יחידת הורים', 'עם חדר רחצה צמוד ומעבר ארונות'],
 ['עוד שלושה חדרים', 'שני חדרי שינה והממ״ד, כולם פונים מזרחה'],
];
const PLACES_HE: Record<string, [string, string]> = {
 'ha-irusim-mall': ['קניון האירוסים', 'קניון'], 'iris-park': ['פארק האירוסים', 'פארק'], 'raziel-school': ['בית ספר רזיאל', 'בית ספר'],
 'the-beach': ['החוף', 'חוף'], 'benjamin-s-bakery': ['המאפייה של בנג׳מין', 'מאפייה'],
};
const BUILDING_HE = ['המגדלים', 'מעל החוף', 'קו החוף', 'מהרחוב', 'הבריכה', 'סיפון הבריכה', 'הכניסה והלובי', 'אולם הלובי', 'סלון הדיירים', 'מגרש הטניס', 'החזית', 'הסרט של אלמה ביי'];
const FIGURES_HE: Record<string, string> = { Towers: 'מגדלים', Floors: 'קומות', Homes: 'דירות', 'm² plot': 'מ״ר מגרש', Residences: 'דירות', Plot: 'מגרש' };
const KIT_HE = ['סרטים · 46 שנ׳, 20 שנ׳, 9:16', 'קטעי חדרים', 'תמונות', 'תוכניות', 'מודל תלת־ממד · GLB', 'תמונות וסרטונים של הבניין'];

const tx = (en: string, he?: string): Tx => (he ? { en, he } : { en });
const H = HOMES.apt01;

/** Alma Bay's page in one film style. */
export function almaHome(style: FilmStyleSlug): HomeData {
 const F = FILM_STYLES.find(f => f.slug === style)!;
 const [long, short, phone] = F.cuts;
 const he = (u: string) => u.replace(/(-poster)?\.(mp4|jpg)$/, '-he$1.$2');
 const cut = (c: typeof long, heb = false) => ({ src: heb ? he(c.src) : c.src, poster: heb ? he(c.poster) : c.poster, length: c.length, aspect: c.aspect });
 const kit = HOME.kits[style];
 const kitParts = kit.parts.map((p, j) => ({ n: p.n, label: tx(p.label, KIT_HE[j]) }));
 return {
  v: 2, slug: `alma-bay-${style}`, style, langs: ['en', 'he'],
  status: { films: 'ready', plan: 'ready', model: 'ready', building: 'ready', area: 'ready', contact: 'ready', kit: 'ready' },
  project: tx('Alma Bay', 'אלמה ביי'), unit: tx('Residence 01', 'דירה 01'),
  where: { tower: HOME.unit.tower, floor: HOME.unit.floor, floors: HOME.tower.floors },
  address: { no: '14', street: tx('HaGalim Boulevard', 'שדרות הגלים'), word: tx('HaGalim', 'הגלים'), city: tx('Netanya', 'נתניה'), country: tx('Israel', 'ישראל') },
  developer: {
   name: tx('Orelia', 'אורליה'), logoWhite: HOME.developer.logoWhite, logoBlack: HOME.developer.logoBlack, url: HOME.developer.url,
   linkLabel: tx(HOME.developer.linkLabel, 'אלמה ביי של אורליה — כל הדירות'),
   about: tx(HOME.developer.about, 'אורליה בונה את אלמה ביי: שני מגדלים בני 32 קומות על פודיום משותף מעל החופים הדרומיים של נתניה, עם בריכה, מגרש טניס ולובי הפתוח אל הגן. כל דירה אפשר לגלות בעמוד הפרויקט — בוחרים אותה על הבניין ופותחים את התוכניות, הסרטים והמודל.'),
   facts: HOME.developer.facts.map(f => ({ value: f.value, label: tx(f.label, FIGURES_HE[f.label]) })),
  },
  agent: { name: tx('Daniel Mizrahi', 'דניאל מזרחי'), role: tx('Sales manager · Alma Bay', 'מנהל מכירות · אלמה ביי'), phone: HOME.agent.phone, email: HOME.agent.email, photo: HOME.agent.photo },
  hero: HOME.hero,
  facts: { area: HOME.plan.headline.area_m2, balcony: HOME.plan.headline.balcony_m2, rooms: Number(HOME.stats[1].value), nearest: { minutes: 13, label: tx('min to the beach', 'דק׳ הליכה לים'), icon: 'beach' } },
  copy: {
   pointsHead: [tx('A five-room corner home, ', 'דירת פינה בת חמישה חדרים, '), tx('25 floors above the cliff', '25 קומות מעל המצוק')],
   wholeLine: tx('Kitchen, dining and living in one long space, a balcony on the sea side, the master suite and three more rooms in the private wing.', 'מטבח, פינת אוכל וסלון בחלל ארוך אחד, מרפסת לצד הים, יחידת הורים ועוד שלושה חדרים באגף השקט.'),
   aspect: H.aspect as Tx,
   buildingHead: [tx('Two towers ', 'שני מגדלים '), tx('above the beach', 'מעל החוף')],
   buildingSub: tx('Turn the building to see it from every side. The towers, the pool and the lobby on the right.', 'מסובבים את הבניין כדי לראות אותו מכל צד. המגדלים, הבריכה והלובי — משמאל.'),
  },
  points: HOME.points.map((p, j) => ({ icon: p.icon, title: tx(p.title, POINTS_HE[j]?.[0]), text: tx(p.text, POINTS_HE[j]?.[1]) })),
  films: {
   en: { long: cut(long), short: cut(short), phone: cut(phone) },
   ...(HE_FILMS.has(style) ? { he: { long: cut(long, true), short: cut(short, true), phone: cut(phone, true) } } : {}),
  },
  plan: { cutout: HOME.plan.cutout, view: HOME.plan.view, headline: { area_m2: HOME.plan.headline.area_m2, balcony_m2: HOME.plan.headline.balcony_m2 }, rooms: HOME.plan.rooms },
  roomOrder: ['living', 'balcony', 'master', 'ensuite', 'bed2', 'bed3', 'safe', 'bath', 'wc', 'corridor', 'laundry'],
  rooms: Object.fromEntries(Object.entries(ROOMS).map(([id, r]) => [id, {
   name: tx(HOME.plan.rooms.find(q => q.id === id)?.name ?? id, ROOM_NAMES_HE[id]), line: tx(r.line, ROOM_LINES_HE[id]), images: r.images, clip: r.clip,
  }])),
  gallery: HOME.gallery.map((g, j) => ({ src: g.src, thumb: g.thumb, caption: tx(g.caption, H.images[j]?.label.he), room: g.room })),
  model: HOME.model,
  building: {
   orbit: { frames: HOME.building.orbit, ringVideo: HOME.building.ringVideo, unit: HOME.building.unit, startView: HOME.building.startView },
   figures: HOME.building.figures.map(f => ({ value: f.value, label: tx(f.label, FIGURES_HE[f.label]) })),
   media: HOME.building.media.map((m, j) => ({ kind: m.kind, src: m.src, thumb: m.thumb, caption: tx(m.caption, BUILDING_HE[j]) })),
  },
  map: { image: HOME.maps[style], view: HOME.map.view, home: HOME.map.home,
   items: HOME.map.items.map(p => ({ ...p, name: tx(p.name, PLACES_HE[p.id]?.[0]), label: tx(p.label, PLACES_HE[p.id]?.[1]) })) },
  kit: {
   en: { href: kit.href, size: kit.size, files: kit.files, parts: kitParts },
   ...(HE_FILMS.has(style) ? { he: { href: kit.href.replace(/\.zip$/, '-he.zip'), size: kit.size, files: kit.files, parts: kitParts } } : {}),
  },
  allLink: { href: '/alma-bay', label: tx('Alma Bay — all residences', 'אלמה ביי — כל הדירות') },
 };
}
