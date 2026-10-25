// Alma Bay, by Orelia (the former Shirat HaYam / BRIGA page, renamed to a fictional project; asset folders keep the old name): towers A and B (32 floors each) on a shared podium above the southern beaches.
// The building is the measured model (data/projects/Shirat-HaYam-Netanya/building, S11); every home is selectable.
// Homes carry only their place (tower, floor, number): plans, areas, prices and media are not published yet.
import unitsJson from './shirat-units.json';

export type ShiratUnit = { id: string; b: 'A' | 'B'; f: number; u: string; ph: boolean };
export type OrbitSpot = { id: string; points: string; c?: [number, number] };
export type OrbitFrame = { src: string; angle: number; spots: OrbitSpot[]; sky?: string };
export type Orbit = { count: number; width: number; height: number; frames: OrbitFrame[] };

export const UNITS = unitsJson as ShiratUnit[];
export const unitById = (id: string) => UNITS.find(u => u.id === id);
const ORBIT_DIR = '/projects/shirat-hayam/orbit-s15-360';
export const ORBIT_URL = `${ORBIT_DIR}/frames.json`;
// the same ring as one video (one view per frame, 30 fps), for browsers that seek fast; see ShiratSite ringMode
export const ORBIT_VIDEO = `${ORBIT_DIR}/ring.mp4`;
const base = '/projects/shirat-hayam';

export const project = {
 base,
 logoBlack: '/brand/orelia-logo-black.png', logoWhite: '/brand/orelia-logo-white.png',
 developerUrl: 'https://www.residence.tech',
 // From the developer's sheets (floors, homes, plot) — facts about the building, not about any one home.
 // the presentation film (data/projects/Shirat-HaYam-Netanya/presentation, Alma Bay 1080p, re-encoded for the web), one per language
 film: {
  en: { src: `${base}/film/presentation-v2.mp4`, poster: `${base}/film/poster-v2.webp` },
  he: { src: `${base}/film/presentation-he-v2.mp4`, poster: `${base}/film/poster-he-v2.webp` },
 },
 figures: { towers: 2, floors: 32, homes: UNITS.length, plot: 6635 },
 stills: {
  hero: `${base}/stills/sea.webp`, street: `${base}/stills/street.webp`, pool: `${base}/stills/pool.webp`, lobby: `${base}/stills/lobby.webp`,
  tennis: `${base}/stills/tennis.webp`, lobbyHall: `${base}/stills/lobby-hall.webp`, lobbySalon: `${base}/stills/lobby-salon.webp`, lobbyEntry: `${base}/stills/lobby-entry.webp`, terrace: `${base}/stills/terrace.webp`, aerial: `${base}/stills/aerial.webp`,
 },
};

// ---- residences with draft media (480p review films + keyframe stills, produced by the apartment pipeline).
// The typical 01 layout is the same on floors 1–31 of both towers, so its media serves every 01 home; it was
// produced for tower A, floor 25. Penthouse 02 serves floor 32 of both towers. All other homes stay empty.
type L = { en: string; he: string };
export type HomeImage = { id: string; label: L };
export type HomeMedia = {
 key: 'apt01' | 'ph02'; shownOn: { b: 'A' | 'B'; f: number };
 final?: boolean; model?: boolean;
 /** the HQ web model (baked light dollhouse, pipeline/hq): file name in the home's folder, poster, default + Outdoor orbit */
 hq?: { glb: string; poster: string; orbit: string; outdoorOrbit: string };
 rooms: number; interior: number; outdoor: number; outdoorKind: 'balcony' | 'terrace'; aspect: L;
 about: L; highlights: L[]; images: HomeImage[];
};
const img = (id: string, en: string, he: string): HomeImage => ({ id, label: { en, he } });
export const HOMES: Record<HomeMedia['key'], HomeMedia> = {
 apt01: {
  key: 'apt01', final: true, model: true, shownOn: { b: 'A', f: 25 },
  hq: { glb: 'model-hq-2.glb', poster: 'model-hq-2-poster.webp', orbit: '4deg 52deg 100%', outdoorOrbit: '-21deg 58deg 72%' },   // 4.8 MB, viewer.json of the HQ run
  rooms: 5, interior: 147.3, outdoor: 22, outdoorKind: 'balcony', aspect: { en: 'North · East', he: 'צפון · מזרח' },
  about: {
   en: 'A five-room corner home on the north-east of the tower. The front door opens into the kitchen and dining room with a long island; the living room faces north and opens onto a 4.6 × 4.8 m balcony with the sea at an angle to the west. A corridor leads to the master suite with its en-suite, two bedrooms and the safe room, all facing east over the city.',
   he: 'דירת פינה בת חמישה חדרים בצפון־מזרח המגדל. הכניסה אל המטבח ופינת האוכל עם אי ארוך; הסלון פונה צפונה ונפתח למרפסת של 4.6 × 4.8 מ׳ עם מבט אלכסוני לים במערב. מסדרון מוביל ליחידת ההורים עם חדר רחצה צמוד, לשני חדרי שינה ולממ״ד, כולם פונים מזרחה אל העיר.',
  },
  highlights: [
   { en: 'Corner home with north and east light', he: 'דירת פינה עם אור מצפון וממזרח' },
   { en: '4.6 × 4.8 m balcony, the sea at an angle', he: 'מרפסת 4.6 × 4.8 מ׳, מבט אלכסוני לים' },
   { en: 'Kitchen island for five', he: 'אי מטבח לחמישה' },
   { en: 'Master suite with en-suite and dressing', he: 'יחידת הורים עם חדר רחצה ופינת ארונות' },
   { en: 'Safe room furnished as a study', he: 'ממ״ד מרוהט כחדר עבודה' },
  ],
  images: [
   img('g-entry', 'Arrival', 'כניסה'), img('v-kitchen', 'Kitchen', 'מטבח'), img('g-living', 'Living room', 'סלון'),
   img('v-dining-s2', 'Dining', 'פינת אוכל'), img('v-balcony', 'Balcony', 'מרפסת'), img('g-view', 'The view', 'הנוף'),
   img('v-master', 'Master bedroom', 'חדר הורים'), img('v-bed2', 'Bedroom 2', 'חדר שינה 2'), img('v-bed3', 'Bedroom 3', 'חדר שינה 3'),
   img('v-safe', 'Safe room · study', 'ממ״ד · חדר עבודה'), img('v-bath', 'Bathroom', 'חדר רחצה'),
  ],
 },
 ph02: {
  key: 'ph02', final: true, model: true, shownOn: { b: 'A', f: 32 },
  hq: { glb: 'model-hq-1.glb', poster: 'model-hq-1-poster.webp', orbit: '21deg 52deg 100%', outdoorOrbit: '-4deg 58deg 72%' },   // 4.7 MB, 1.27 M triangles
  rooms: 5, interior: 243, outdoor: 100, outdoorKind: 'terrace', aspect: { en: 'West · the sea', he: 'מערב · הים' },
  about: {
   en: 'The penthouse on the 32nd floor. One open space runs the whole west façade — living room, dining for ten and a kitchen with a 5.8 m island and a separate back kitchen — and opens onto a 100 m² terrace above the sea. The master suite has a walk-in wardrobe and en-suite; bedrooms 1 and 2 each have their own shower room, bedroom 3 is the safe room, and a side balcony faces south.',
   he: 'הפנטהאוז בקומה 32. חלל פתוח אחד לאורך כל החזית המערבית — סלון, פינת אוכל לעשרה ומטבח עם אי של 5.8 מ׳ ומטבח בישול נפרד — נפתח למרפסת של 100 מ״ר מעל הים. ליחידת ההורים חדר ארונות וחדר רחצה צמוד; לחדרי שינה 1 ו־2 חדר מקלחת משלהם, חדר שינה 3 הוא הממ״ד, ומרפסת צד פונה דרומה.',
  },
  highlights: [
   { en: 'The whole west façade on the sea', he: 'כל החזית המערבית אל הים' },
   { en: '100 m² terrace for sunsets', he: 'מרפסת של 100 מ״ר לשקיעות' },
   { en: 'Dining for ten', he: 'פינת אוכל לעשרה' },
   { en: 'Kitchen with a 5.8 m island and a back kitchen', he: 'מטבח עם אי של 5.8 מ׳ ומטבח בישול' },
   { en: 'Master suite with walk-in wardrobe', he: 'יחידת הורים עם חדר ארונות' },
   { en: 'Bedrooms 1 and 2 with their own shower rooms', he: 'לחדרי שינה 1 ו־2 חדר מקלחת משלהם' },
  ],
  images: [
   img('g-entry', 'Arrival', 'כניסה'), img('g-living', 'Living room', 'סלון'), img('v-dining', 'Dining for ten', 'פינת אוכל לעשרה'),
   img('v-kitchen', 'Kitchen', 'מטבח'), img('v-terrace', 'Sea terrace', 'מרפסת הים'), img('g-sea', 'Sunset terrace', 'מרפסת השקיעה'),
   img('v-balcony', 'South balcony', 'מרפסת דרום'), img('v-master', 'Master suite', 'יחידת הורים'), img('v-walkin', 'Walk-in wardrobe', 'חדר ארונות'),
   img('v-ensuite', 'En-suite', 'חדר רחצה הורים'), img('v-bed1', 'Bedroom 1', 'חדר שינה 1'), img('v-bed2', 'Bedroom 2', 'חדר שינה 2'),
   img('v-bed3', 'Bedroom 3', 'חדר שינה 3'), img('v-bath1', 'Shower room', 'חדר מקלחת'),
  ],
 },
};
export const homeBase = (key: HomeMedia['key']) => `${base}/homes/${key}`;
export const mediaFor = (u: ShiratUnit): HomeMedia | undefined =>
 u.ph ? (u.u === '02' ? HOMES.ph02 : undefined) : (u.u === '01' && u.f <= 31 ? HOMES.apt01 : undefined);
export const SHOWCASE = { apt01: 'a-f25-01', ph02: 'a-f32-02' } as const;

// ---- key plans (building/scripts/package_plates.py): the floor's outline, core, balconies and homes, north up
import platesJson from './shirat-plates.json';
export type PlateKey = 'typ_low' | 'typ_high' | 'ph';
export type Plate = { outline: string[]; core: string[]; balconies: string[]; bbox: [number, number, number, number]; units: Record<string, { points: string[]; cx: number; cy: number }> };
export const PLATES = platesJson as unknown as Record<PlateKey, Plate>;
export const plateKeyOf = (u: ShiratUnit): PlateKey => u.f === 32 ? 'ph' : u.f <= (u.b === 'A' ? 12 : 13) ? 'typ_low' : 'typ_high';
