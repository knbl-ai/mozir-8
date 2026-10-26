// SYMBOL, Givat Shmuel (Levinstein Group): the 24-floor tower and the 9-floor Symbol Boutique on one plot between
// HaNasi, Menachem Begin and Shai Agnon streets. The building is the measured study model
// (data/projects/Symbol-Givat-Shmuel/building, S11); every tower home is selectable, the boutique building is context.
// Homes on floors 2–20 carry their sales type (C1, D1, E1 from the developer's sheets; the south row from the key plans);
// floors 21–24 are one provisional pick per floor until their plans arrive.
import unitsJson from './symbol-units.json';
import plateJson from './symbol-plates.json';

export type PlateType = 'C1' | 'D1' | 'E1' | 'S1' | 'S2' | 'S3';
export type SymbolUnit = { id: string; f: number; u: string; apt: number | null; type: PlateType | 'crown'; crown: boolean; sheet: boolean };
export type OrbitSpot = { id: string; points: string; c?: [number, number] };
export type OrbitFrame = { src: string; angle: number; spots: OrbitSpot[]; sky?: string };
export type Orbit = { count: number; width: number; height: number; frames: OrbitFrame[] };

export const UNITS = unitsJson as SymbolUnit[];
export const unitById = (id: string) => UNITS.find(u => u.id === id);
const ORBIT_DIR = '/projects/symbol/orbit-s12-360';
export const ORBIT_URL = `${ORBIT_DIR}/frames.json`;
// the same ring as one video (one view per frame, 30 fps), for browsers that seek fast; see SymbolSite ringMode
export const ORBIT_VIDEO = `${ORBIT_DIR}/ring.mp4`;
const base = '/projects/symbol';

// The model's north is 7.35° west of sheet-up (build-input north_deg); orbit angles are CCW from the model's +X.
export const NORTH_DEG = -7.35;

export const project = {
 base,
 logoDark: '/brand/levinstein-logo-navy.png', logoWhite: '/brand/levinstein-logo-white.png',
 wordmarkDark: '/brand/symbol-wordmark-dark.png', wordmarkSand: '/brand/symbol-wordmark-sand.png',
 developerUrl: 'https://www.levinstein.co.il',
 projectUrl: 'https://symbol.co.il',
 // facts from the developer's sheets and site: tower floors, boutique floors, homes per tower floor, plot
 figures: { towerFloors: 24, boutiqueFloors: 9, perFloor: 6, plot: 3584 },
 // the presentation film (data/projects/Symbol-Givat-Shmuel/presentation, v2 2026-10-26); English only so far
 film: { src: `${base}/film/presentation-en.mp4`, preview: `${base}/film/presentation-en-720.mp4`, poster: `${base}/film/poster.webp` },
 stills: Object.fromEntries(['hero', 'street', 'shops', 'garden', 'crown', 'facade', 'mirkami', 'mirkami-w', 'top'].map(k => [k, `${base}/stills/${k}.webp`])) as Record<string, string>,
};

// ---- the sales types. C1, D1 and E1 are on the developer's sales sheets (floors 2–20, north row); the south row
// (S1–S3, shown as E1′ C1′ D1′) mirrors them on the key plans; no sheets yet, so no rooms or areas are shown.
type L = { en: string; he: string };
export type TypeInfo = {
 code: string; rooms?: number; interior?: number; balcony?: number; aspect: L; sheet?: string; about?: L; highlights?: L[];
};
export const TYPES: Record<PlateType, TypeInfo> = {
 C1: {
  code: 'C1', rooms: 3, interior: 73, balcony: 12, aspect: { en: 'North', he: 'צפון' }, sheet: `${base}/plans/c1.webp`,
  about: {
   en: 'A three-room home in the middle of the north façade. The entrance opens into the kitchen and an open living and dining room along the north glass, with a full-width slider to a 12 m² sun balcony. The master bedroom faces north; the safe room doubles as a second bedroom with its own shower room.',
   he: 'דירת שלושה חדרים במרכז החזית הצפונית. הכניסה נפתחת אל המטבח ואל סלון ופינת אוכל פתוחים לאורך הזכוכית הצפונית, עם דלת הזזה לכל הרוחב אל מרפסת שמש של 12 מ״ר. חדר ההורים פונה צפונה; הממ״ד משמש כחדר שינה שני עם חדר מקלחת משלו.',
  },
  highlights: [
   { en: 'Living room on the north glass', he: 'סלון לאורך הזכוכית הצפונית' },
   { en: '12 m² sun balcony', he: 'מרפסת שמש של 12 מ״ר' },
   { en: 'Safe room plus: a bedroom with its own shower room', he: 'ממ״ד פלוס: חדר שינה עם חדר מקלחת' },
  ],
 },
 D1: {
  code: 'D1', rooms: 4, interior: 96, balcony: 14, aspect: { en: 'North · East', he: 'צפון · מזרח' }, sheet: `${base}/plans/d1.webp`,
  about: {
   en: 'A four-room corner home on the north-east. A long kitchen and dining area lead to a 5.6 m wide living room that opens onto a 14 m² sun balcony. The master suite takes the corner with windows north and east and its own shower room; a second bedroom faces east, and the safe room is a third bedroom with its own shower room.',
   he: 'דירת פינה בת ארבעה חדרים בצפון־מזרח. מטבח ארוך ופינת אוכל מובילים לסלון ברוחב 5.6 מ׳ הנפתח אל מרפסת שמש של 14 מ״ר. יחידת ההורים בפינה, עם חלונות לצפון ולמזרח וחדר רחצה צמוד; חדר שינה נוסף פונה מזרחה, והממ״ד הוא חדר שינה שלישי עם חדר מקלחת משלו.',
  },
  highlights: [
   { en: 'Corner home with north and east light', he: 'דירת פינה עם אור מצפון וממזרח' },
   { en: '14 m² sun balcony off the living room', he: 'מרפסת שמש של 14 מ״ר מהסלון' },
   { en: 'Two suites: master and safe room plus', he: 'שתי סוויטות: הורים וממ״ד פלוס' },
   { en: 'Family bathroom with a bath', he: 'חדר רחצה משפחתי עם אמבטיה' },
  ],
 },
 E1: {
  code: 'E1', rooms: 5, interior: 125, balcony: 14, aspect: { en: 'North · West', he: 'צפון · מערב' }, sheet: `${base}/plans/e1.webp`,
  about: {
   en: 'A five-room corner home on the north-west. One long open space runs from the kitchen through the living room to dining for six, with a 14 m² sun balcony on the west. The bedroom wing holds the master suite, two bedrooms and the safe room with its own shower room.',
   he: 'דירת פינה בת חמישה חדרים בצפון־מערב. חלל פתוח אחד נמשך מהמטבח דרך הסלון אל פינת אוכל לשישה, עם מרפסת שמש של 14 מ״ר במערב. באגף השינה יחידת הורים, שני חדרי שינה והממ״ד עם חדר מקלחת משלו.',
  },
  highlights: [
   { en: 'Corner home with north and west light', he: 'דירת פינה עם אור מצפון וממערב' },
   { en: 'Open kitchen, living and dining for six', he: 'מטבח, סלון ופינת אוכל לשישה בחלל אחד' },
   { en: '14 m² sun balcony facing west', he: 'מרפסת שמש של 14 מ״ר למערב' },
   { en: 'Two suites: master and safe room plus', he: 'שתי סוויטות: הורים וממ״ד פלוס' },
  ],
 },
 S1: { code: 'E1′', aspect: { en: 'South · West', he: 'דרום · מערב' } },
 S2: { code: 'C1′', aspect: { en: 'South', he: 'דרום' } },
 S3: { code: 'D1′', aspect: { en: 'South · East', he: 'דרום · מזרח' } },
};
export const typeOf = (u: SymbolUnit): TypeInfo | undefined => u.crown ? undefined : TYPES[u.type as PlateType];

// ---- residences with media from the apartment pipeline (Slack job, 1080p film + photoreal stills, Soft Arch style with the
// developer's kitchen). Produced for C1 on floor 20; the layout repeats on floors 2–20, so every C1 home shows it.
// Files: public/projects/symbol/homes/<key>/ (film.mp4 + film-poster.jpg, <id>.webp 1920 px + <id>-t.webp thumbs).
export type HomeImage = { id: string; label: L };
export type HomeMedia = {
 key: 'c1'; shownOn: number; images: HomeImage[];
 /** the HQ web model (light-baked dollhouse, pipeline/hq): file, poster, default + Outdoor orbit from hq/web/viewer.json */
 hq?: { glb: string; poster: string; orbit: string; outdoorOrbit: string };
};
const img = (id: string, en: string, he: string): HomeImage => ({ id, label: { en, he } });
export const HOMES: Partial<Record<PlateType, HomeMedia>> = {
 C1: {
  key: 'c1', shownOn: 20,
  hq: { glb: 'model-hq.glb', poster: 'model-hq-poster.webp', orbit: '-98deg 52deg 100%', outdoorOrbit: '-123deg 58deg 72%' },   // 4.0 MB, checks pass
  images: [   // walkthrough order, opening with the arrival view; no near-duplicates (user 2026-10-26: dropped v-living-s2, v-balcony, v-passage, v-master)
   img('g-entry', 'Arrival: living room, dining and the north glass', 'כניסה: הסלון, פינת האוכל והחלון לצפון'),
   img('g-living', 'The living room and the kitchen', 'הסלון והמטבח'),
   img('g-kitchen', 'The kitchen', 'המטבח'),
   img('g-balcony', 'The sun balcony', 'מרפסת השמש'),
   img('v-mamad', 'Second bedroom (safe room)', 'חדר שינה שני (ממ״ד)'),
   img('v-bath', 'The bathroom', 'חדר הרחצה'),
   img('g-master', 'The master bedroom', 'חדר השינה ההורים'),
   img('top', 'The whole apartment from above', 'הדירה כולה ממבט על'),
  ],
 },
};
export const homeBase = (m: HomeMedia) => `${base}/homes/${m.key}`;
export const mediaFor = (u: SymbolUnit): HomeMedia | undefined => u.crown ? undefined : HOMES[u.type as PlateType];
// a sales type with its sheet: every C1/D1/E1 home shows it (floors 2–20 repeat the same layout)
export const SHOWCASE = { c1: 'T_F20_01', e1: 'T_F20_02', d1: 'T_F20_06' } as const;

// ---- the typical floor's key plan (building/scripts/package_page.py): metres, y down, sheet-up (north = north_deg)
export type Plate = {
 outline: string[]; core: string[]; balconies: string[]; bbox: [number, number, number, number]; north_deg: number;
 units: Record<string, { type: PlateType; points: string[]; area: number; cx: number; cy: number }>;
};
export const PLATE = plateJson as unknown as Plate;
