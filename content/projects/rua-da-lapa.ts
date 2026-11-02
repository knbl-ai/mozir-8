// Rua da Lapa 52-A/53/54, Porto: two 19th-century town houses restored into 15 homes (frações A–O), architects
// Pedro Vasco Ferreira Architecture Studio (licensing set, Sept 2026). The page is the Symbol layout (components/lapa):
// the building in 360° with every home selectable, then the project on scroll. The building is the measured study
// model (data/projects/Rua-da-Lapa-Porto/building, S13, the architect's RAL finishes); orbit, plans, stills and
// Fração I's media come from building/scripts/package_site.py + package_plates.py on the box. Languages: EN + PT.
import plates from './lapa-plates.json';

export type L = { en: string; pt: string };
export type OrbitSpot = { id: string; points: string; c?: [number, number] };
export type OrbitFrame = { src: string; angle: number; spots: OrbitSpot[]; sky?: string };
export type Orbit = { count: number; width: number; height: number; frames: OrbitFrame[] };

const base = '/projects/rua-da-lapa';
const ORBIT_DIR = `${base}/orbit-s13-360`;
export const ORBIT_URL = `${ORBIT_DIR}/frames.json`;
export const ORBIT_VIDEO = `${ORBIT_DIR}/ring.mp4`;
// Orbit angles are CCW from the plan's +X; the plan's +Y points to bearing 25° (fitted to OpenStreetMap), so +X is 115°.
export const NORTH_DEG = -25;

export type Floor = '-2' | '-1' | '1' | '2' | '3' | '4';
export type LapaUnit = {
 id: string; letter: string; t: 0 | 1 | 2; area: number; floors: Floor[]; side: 'street' | 'rear' | 'garden' | 'through';
 house: 'n' | 's'; outdoor?: L; outdoorArea?: number; storage?: number; plan: string;
};
const u = (id: string, t: 0 | 1 | 2, area: number, floors: Floor[], side: LapaUnit['side'], house: 'n' | 's', extra: Partial<LapaUnit> = {}): LapaUnit =>
 ({ id, letter: id.toUpperCase(), t, area, floors, side, house, plan: `${base}/plans/${id}.webp`, ...extra });
const garden: L = { en: 'Private garden area', pt: 'Jardim privativo' };
const laundry: L = { en: 'Covered laundry balcony', pt: 'Varanda coberta' };
// Areas: the architect's gross areas (área bruta) and outdoor/storage areas from the area table (sheet 16).
export const UNITS: LapaUnit[] = [
 u('a', 0, 73.6, ['-2'], 'garden', 's', { outdoor: garden, outdoorArea: 10 }),
 u('b', 2, 90.9, ['-1'], 'through', 'n', { outdoor: garden, outdoorArea: 21 }),
 u('c', 1, 80.4, ['-1'], 'through', 's', { outdoor: garden, outdoorArea: 38 }),
 u('d', 2, 65.4, ['1'], 'rear', 'n', { outdoor: garden, outdoorArea: 37 }),
 u('e', 1, 37.9, ['1'], 'street', 'n', { storage: 8 }),
 u('f', 0, 35.8, ['1'], 'street', 's', { storage: 16 }),
 u('g', 1, 48.6, ['1'], 'rear', 's', { outdoor: laundry, outdoorArea: 3 }),
 u('h', 1, 45.4, ['2'], 'rear', 'n', { outdoor: { en: 'Terrace over the rear wing', pt: 'Terraço sobre a ala traseira' } }),
 u('i', 1, 37.9, ['2'], 'street', 'n', { storage: 8 }),
 u('j', 1, 42.5, ['2'], 'street', 's', { storage: 4 }),
 u('k', 1, 51.6, ['2'], 'rear', 's', { outdoor: laundry, outdoorArea: 3 }),
 u('l', 1, 56.0, ['3', '4'], 'rear', 'n'),
 u('m', 1, 37.9, ['3'], 'street', 'n', { storage: 8 }),
 u('n', 2, 54.0, ['3', '4'], 'street', 's'),
 u('o', 2, 70.1, ['3', '4'], 'rear', 's', { outdoor: laundry, outdoorArea: 3 }),
];
export const unitById = (id: string) => UNITS.find(x => x.id === id);
export const FLOOR_ORDER: Floor[] = ['4', '3', '2', '1', '-1', '-2'];
export const floorLabel = (f: Floor) => f.replace('-', '−');
export const floorsOf = (x: LapaUnit) => x.floors.length > 1 ? `${floorLabel(x.floors[0])}–${floorLabel(x.floors[x.floors.length - 1])}` : floorLabel(x.floors[0]);

export const SIDE: Record<LapaUnit['side'], { aspect: L; view: L }> = {
 street: { aspect: { en: 'East-south-east · street', pt: 'Este-sudeste · rua' }, view: { en: 'onto Rua da Lapa and the white wall of the Lapa precinct', pt: 'para a Rua da Lapa e o muro branco do recinto da Lapa' } },
 rear: { aspect: { en: 'West-north-west · garden', pt: 'Oés-noroeste · jardim' }, view: { en: 'over the walled rear garden', pt: 'sobre o jardim murado das traseiras' } },
 garden: { aspect: { en: 'Garden level', pt: 'Piso do jardim' }, view: { en: 'opening onto the garden at the back', pt: 'aberto para o jardim nas traseiras' } },
 through: { aspect: { en: 'Street and garden', pt: 'Rua e jardim' }, view: { en: 'from the street front, below street level, through to the garden', pt: 'da frente da rua, abaixo do nível da rua, até ao jardim' } },
};

// ---- homes with pipeline media: Fração I (film, gallery, 3D); M is the same plan one floor up.
export type HomeMedia = { key: 'i'; shownOn: string; film: string; poster: string; images: { src: string; label: L }[]; hq: { glb: string; poster: string; orbit: string; outdoorOrbit: string } };
const hi = `${base}/homes/i`;
const img = (n: string, en: string, pt: string) => ({ src: `${hi}/images/${n}.webp`, label: { en, pt } });
const HOME_I: HomeMedia = {
 key: 'i', shownOn: 'i', film: `${hi}/film-wm.mp4`, poster: `${hi}/film-poster.webp`,
 hq: { glb: `${hi}/model.glb`, poster: `${hi}/model-poster.webp`, orbit: '33deg 52deg 100%', outdoorOrbit: '8deg 58deg 72%' },
 images: [
  img('01-g-entry', 'Arrival: the flat from the hall, both street windows', 'A chegada: o apartamento visto do hall, com as duas janelas para a rua'),
  img('02-g-living', 'Living room, dining and kitchen', 'Sala, zona de refeições e cozinha'),
  img('03-v-bath', 'Bathroom', 'Instalação sanitária'),
  img('04-g-bedroom', 'Bedroom', 'Quarto'),
  img('05-top-down', 'The whole flat from above', 'O apartamento visto de cima'),
 ],
};
// E (piso 1) differs from I (wider bedroom, no angled corner): only M repeats I's plan (user 2026-11-02).
export const mediaFor = (x: LapaUnit): HomeMedia | undefined => ['i', 'm'].includes(x.id) ? HOME_I : undefined;
export const SHOWCASE = 'i';

export const project = {
 base,
 wordmark: `${base}/brand/wordmark.svg`,
 figures: { homes: 15, houses: 2, floors: '3 + 2', plot: 388 },
 stills: Object.fromEntries(['street', 'front', 'ornate', 'eave', 'garden', 'lapa', 'entrance', 'staircase', 'landing'].map(k => [k, `${base}/stills/${k}.webp`])) as Record<string, string>,
 contactEmail: 'info@residence.tech',
};

// ---- the key plans per floor (metres, y down; north_deg = the plan's rotation to true north)
export type Plate = { outline: string; units: Record<string, { points: string; cx: number; cy: number }>; bbox: [number, number, number, number] };
export const PLATES = (plates as unknown as { floors: Record<Floor, Plate>; north_deg: number });
