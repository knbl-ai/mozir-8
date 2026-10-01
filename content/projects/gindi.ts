// Gindi Colors · Kiryat HaSharon, Netanya: four towers, every home selectable.
// Source: the developer's three plan sheets (types A, B and penthouse PA); each type keeps its place on the tower
// model's facade in every building (see QUADS). Types C, D and PB have no sheet yet: they are shown, selectable, and marked "plan to come".
// Availability is sample data (a fixed pseudo-random pick), not the developer's inventory.
import platesJson from './gindi-plates.json';

export type GindiType = 'A' | 'B' | 'C' | 'D' | 'PA' | 'PB';
export type Status = 'available' | 'sold';
export type Quadrant = 'NE' | 'NW' | 'SE' | 'SW' | 'N' | 'S';
export type Dir = 'north' | 'south' | 'east' | 'west';
export type Unit = { id: string; building: number; floor: number; type: GindiType; status: Status; quadrant: Quadrant; exposure: Dir[] };
export type TypeInfo = {
 known: boolean; rooms?: number; area?: number; balcony?: number; plan?: string; pdf?: string; floors: string; floorsHe: string;
 name: string; nameHe: string; kind: string; kindHe: string; about?: string; aboutHe?: string;
 media?: { images: { src: string; label: string; labelHe: string }[]; film?: { src: string; poster: string }; model?: string; modelOrbit?: string };
};

const base = '/projects/gindi-colors';
const typeA = `${base}/media/type-a`;
const typeB = `${base}/media/type-b`;
const typePA = `${base}/media/type-pa`;
export const project = {
 name: 'Gindi Colors', nameHe: 'גינדי קולורס',
 tagline: 'The new neighbourhood in Kiryat HaSharon', taglineHe: 'שכונת המגורים החדשה בקריית השרון',
 place: 'Kiryat HaSharon · Netanya', placeHe: 'קריית השרון · נתניה',
 base,
};

export const TYPES: Record<GindiType, TypeInfo> = {
 A: {
  known: true, rooms: 5, area: 123, balcony: 14, plan: `${base}/plans/a.webp`, pdf: `${base}/plans/type-a.pdf`,
  floors: 'Buildings 1 & 3: floors 2–20 · Buildings 2 & 4: floors 1–20', floorsHe: 'בניינים 1, 3: קומות 2–20 · בניינים 2, 4: קומות 1–20',
  name: 'Residence A', nameHe: 'דירה A', kind: '5-room apartment', kindHe: 'דירת 5 חדרים',
  about: 'A master suite with dressing room and en-suite, three further bedrooms including the Mamad, a family bathroom and guest WC. Living, dining and kitchen open onto a 14 m² balcony; two aspects.',
  aboutHe: 'סוויטת הורים עם חדר ארונות וחדר רחצה, שלושה חדרי שינה נוספים כולל ממ״ד, חדר אמבטיה ושירותי אורחים. הסלון, פינת האוכל והמטבח נפתחים למרפסת של 14 מ״ר; שני כיווני אוויר.',
  media: {
   images: [
    { src: `${typeA}/01-living.webp`, label: 'Living room', labelHe: 'סלון' },
    { src: `${typeA}/02-kitchen.webp`, label: 'Kitchen & dining', labelHe: 'מטבח ופינת אוכל' },
    { src: `${typeA}/03-balcony.webp`, label: 'Balcony', labelHe: 'מרפסת' },
    { src: `${typeA}/04-corridor.webp`, label: 'Bedroom wing', labelHe: 'אגף השינה' },
    { src: `${typeA}/05-master.webp`, label: 'Master suite', labelHe: 'סוויטת הורים' },
    { src: `${typeA}/06-ensuite.webp`, label: 'En-suite', labelHe: 'חדר רחצה הורים' },
    { src: `${typeA}/07-dressing.webp`, label: 'Dressing room', labelHe: 'חדר ארונות' },
    { src: `${typeA}/08-child.webp`, label: 'Bedroom', labelHe: 'חדר שינה' },
    { src: `${typeA}/09-queen.webp`, label: 'Mamad bedroom', labelHe: 'חדר שינה / ממ״ד' },
    { src: `${typeA}/10-office.webp`, label: 'Home office', labelHe: 'חדר עבודה' },
    { src: `${typeA}/11-bathroom.webp`, label: 'Family bathroom', labelHe: 'חדר אמבטיה' },
    { src: `${typeA}/12-top.webp`, label: 'The whole apartment · top view', labelHe: 'הדירה כולה · מבט על' },
   ],
   film: { src: `${typeA}/film-1080.mp4`, poster: `${typeA}/01-living.webp` },
   model: `${base}/models/type-a.glb`, modelOrbit: '25deg 50deg 85%',
  },
 },
 B: {
  known: true, rooms: 3.5, area: 82.5, balcony: 10.5, plan: `${base}/plans/b.webp`, pdf: `${base}/plans/type-b.pdf`,
  floors: 'All buildings: floors 1–20', floorsHe: 'כל הבניינים: קומות 1–20',
  name: 'Residence B', nameHe: 'דירה B', kind: '3.5-room apartment', kindHe: 'דירת 3.5 חדרים',
  about: 'Open living, kitchen and dining onto a 10.5 m² balcony. A master suite with its own bathroom, a Mamad bedroom and a half room for a study or a child; two aspects.',
  aboutHe: 'סלון, מטבח ופינת אוכל פתוחים אל מרפסת של 10.5 מ״ר. סוויטת הורים עם חדר רחצה, חדר שינה בממ״ד וחצי חדר לעבודה או לילד; שני כיווני אוויר.',
  media: {
   images: [
    { src: `${typeB}/01-living.webp`, label: 'Living room', labelHe: 'סלון' },
    { src: `${typeB}/02-kitchen.webp`, label: 'Kitchen', labelHe: 'מטבח' },
    { src: `${typeB}/03-balcony.webp`, label: 'Balcony', labelHe: 'מרפסת' },
    { src: `${typeB}/04-corridor.webp`, label: 'Bedroom wing', labelHe: 'אגף השינה' },
    { src: `${typeB}/05-master.webp`, label: 'Master suite', labelHe: 'סוויטת הורים' },
    { src: `${typeB}/06-ensuite.webp`, label: 'En-suite', labelHe: 'חדר רחצה הורים' },
    { src: `${typeB}/07-queen.webp`, label: 'Mamad bedroom', labelHe: 'חדר שינה / ממ״ד' },
    { src: `${typeB}/08-child.webp`, label: 'Half room', labelHe: 'חצי חדר' },
    { src: `${typeB}/09-bathroom.webp`, label: 'Family bathroom', labelHe: 'חדר אמבטיה' },
    { src: `${typeB}/10-service.webp`, label: 'Service balcony', labelHe: 'מרפסת שירות' },
    { src: `${typeB}/11-top.webp`, label: 'The whole apartment · top view', labelHe: 'הדירה כולה · מבט על' },
   ],
   film: { src: `${typeB}/film-1080.mp4`, poster: `${typeB}/01-living.webp` },
   model: `${base}/models/type-b.glb`, modelOrbit: '205deg 50deg 100%',
  },
 },
 C: { known: false, floors: 'Floors 1–20', floorsHe: 'קומות 1–20', name: 'Residence C', nameHe: 'דירה C', kind: 'Plan to come', kindHe: 'תוכנית בקרוב' },
 D: { known: false, floors: 'Floors 1–20', floorsHe: 'קומות 1–20', name: 'Residence D', nameHe: 'דירה D', kind: 'Plan to come', kindHe: 'תוכנית בקרוב' },
 PA: {
  known: true, rooms: 6, area: 191, balcony: 72, plan: `${base}/plans/pa.webp`, pdf: `${base}/plans/type-pa.pdf`,
  floors: 'Floor 21 · all buildings', floorsHe: 'קומה 21 · כל הבניינים',
  name: 'Penthouse PA', nameHe: 'פנטהאוז PA', kind: '6-room penthouse', kindHe: 'פנטהאוז 6 חדרים',
  about: 'The top floor: a 9.5-metre living room with dining and an island kitchen, opening onto a 65 m² wrap-around terrace with a pergola, and a second 7 m² terrace off the XL bedroom. Master suite, family room, four more bedrooms including the Mamad; three aspects.',
  aboutHe: 'הקומה העליונה: סלון באורך 9.5 מטר עם פינת אוכל ומטבח עם אי, הנפתח למרפסת היקפית של 65 מ״ר עם פרגולה, ומרפסת נוספת של 7 מ״ר מחדר השינה XL. סוויטת הורים, פינת משפחה וארבעה חדרי שינה נוספים כולל ממ״ד; שלושה כיווני אוויר.',
  media: {
   images: [
    { src: `${typePA}/01-living-room.webp`, label: 'Living room', labelHe: 'סלון' },
    { src: `${typePA}/02-kitchen-breakfast-bar.webp`, label: 'Kitchen & breakfast bar', labelHe: 'מטבח ובר' },
    { src: `${typePA}/03-indoor-dining.webp`, label: 'Dining', labelHe: 'פינת אוכל' },
    { src: `${typePA}/04-main-terrace-dining.webp`, label: 'Main terrace · dining', labelHe: 'המרפסת הראשית · פינת אוכל' },
    { src: `${typePA}/05-main-terrace-lounge.webp`, label: 'Main terrace · lounge', labelHe: 'המרפסת הראשית · פינת ישיבה' },
    { src: `${typePA}/06-corridor.webp`, label: 'Bedroom wing', labelHe: 'אגף השינה' },
    { src: `${typePA}/07-family-nook.webp`, label: 'Family room', labelHe: 'פינת משפחה' },
    { src: `${typePA}/08-master-bedroom.webp`, label: 'Master suite', labelHe: 'סוויטת הורים' },
    { src: `${typePA}/09-master-bathroom.webp`, label: 'En-suite', labelHe: 'חדר רחצה הורים' },
    { src: `${typePA}/10-dressing-room.webp`, label: 'Dressing room', labelHe: 'חדר ארונות' },
    { src: `${typePA}/11-xl-bedroom.webp`, label: 'XL bedroom', labelHe: 'חדר שינה XL' },
    { src: `${typePA}/12-private-terrace.webp`, label: 'Private terrace', labelHe: 'מרפסת פרטית' },
    { src: `${typePA}/13-childs-bedroom.webp`, label: 'Child’s bedroom', labelHe: 'חדר ילדים' },
    { src: `${typePA}/14-office.webp`, label: 'Home office', labelHe: 'חדר עבודה' },
    { src: `${typePA}/15-teenagers-bedroom.webp`, label: 'Teenager’s bedroom', labelHe: 'חדר נוער' },
    { src: `${typePA}/16-family-bathroom.webp`, label: 'Family bathroom', labelHe: 'חדר אמבטיה' },
    { src: `${typePA}/17-overhead-view.webp`, label: 'The whole apartment · top view', labelHe: 'הדירה כולה · מבט על' },
   ],
   film: { src: `${typePA}/film-1080.mp4`, poster: `${typePA}/01-living-room.webp` },
   model: `${base}/models/type-pa.glb`, modelOrbit: '55deg 50deg 100%',
  },
 },
 PB: { known: false, floors: 'Floor 21', floorsHe: 'קומה 21', name: 'Penthouse PB', nameHe: 'פנטהאוז PB', kind: 'Plan to come', kindHe: 'תוכנית בקרוב' },
};

// Where each type sits in each building (site frame). Every tower is the same model, so each type keeps its place on the
// facade: the plan as drawn in building 1, carried through each tower's placement (2 mirrored E-W, 3 mirrored N-S, 4 turned 180°).
const QUADS: Record<number, Record<GindiType, Quadrant>> = {
 1: { A: 'SW', C: 'NW', B: 'NE', D: 'SE', PA: 'N', PB: 'S' },
 2: { A: 'SE', C: 'NE', B: 'NW', D: 'SW', PA: 'N', PB: 'S' },
 3: { A: 'NW', C: 'SW', B: 'SE', D: 'NE', PA: 'S', PB: 'N' },
 4: { A: 'NE', C: 'SE', B: 'SW', D: 'NW', PA: 'S', PB: 'N' },
};
const EXPOSURE: Record<Quadrant, Dir[]> = {
 NE: ['north', 'east'], NW: ['north', 'west'], SE: ['south', 'east'], SW: ['south', 'west'],
 N: ['north', 'east', 'west'], S: ['south', 'east', 'west'],
};
export const FLOORS = 21;
const floorsOf = (t: GindiType, b: number): number[] => {
 if (t === 'PA' || t === 'PB') return [21];
 const from = t === 'A' && (b === 1 || b === 3) ? 2 : 1;
 return Array.from({ length: 21 - from }, (_, i) => from + i);
};
// Sample availability: a fixed hash per home, so every visitor sees the same building.
const hash = (s: string) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; };
export const unitId = (b: number, f: number, t: GindiType) => `b${b}-f${String(f).padStart(2, '0')}-${t.toLowerCase()}`;

export const BUILDINGS = [1, 2, 3, 4] as const;
export const UNITS: Unit[] = BUILDINGS.flatMap(b => (Object.keys(QUADS[b]) as GindiType[]).flatMap(t => floorsOf(t, b).map(f => {
 const id = unitId(b, f, t);
 const soldShare = t === 'PA' || t === 'PB' ? .5 : .22 + .3 * (1 - f / 20);          // lower floors sell first
 return { id, building: b, floor: f, type: t, quadrant: QUADS[b][t], exposure: EXPOSURE[QUADS[b][t]], status: hash(id) < soldShare ? 'sold' : 'available' } as Unit;
})));
export const unitById = new Map(UNITS.map(u => [u.id, u]));

export type Plate = { outline: string; core: string; units: Partial<Record<GindiType, { points: string; quadrant: Quadrant; cx: number; cy: number }>> };
export const PLATES = (platesJson as unknown as { radius: number; plates: Record<string, Plate> });

// Outlook stills (illustrative, AI-generated from the site's surroundings), one per direction.
export const VIEWS: Record<Dir, string> = { north: `${base}/views/north.webp`, south: `${base}/views/south.webp`, east: `${base}/views/east.webp`, west: `${base}/views/west.webp` };

// The web orbits (render_web.py + package_web.py). Frame i of every view looks the same way.
export type OrbitFrame = { src: string; angle: number; spots: { id: string; building?: number; points: string[] }[]; boxes: Record<string, [number, number, number, number]> };
export type Orbit = { view: string; count: number; frames: OrbitFrame[] };
export const orbitUrl = (view: 'complex' | number) => `${base}/orbit/${view}.json`;
