// Lod plot 4008: a municipal rehabilitative day care (מעון יום שיקומי) for children aged 0–3 with disabilities,
// six classes, one storey, in Lod's new north-western district. Client Kalkalit Lod with the Lod Municipality;
// architects Rona-Cohen. The page is for day care OPERATORS bidding in the tender: what the building is for and
// how a child's day works in it. Facts: data/projects/Lod-4008-Daycare/PROJECT.md (steering deck Oct 2025, finishes
// deck Dec 2025). Brand: public/brand/lod/BRAND.md. Languages: HE first (lib/i18n LANG_DEFAULTS) + EN.
// Stills are the architect's renders, cropped with no people, as PLACEHOLDERS until the building and
// classroom tracks deliver.

export type L = { en: string; he: string };

const base = '/projects/lod-daycare';
const brand = '/brand/lod';

export const project = {
 slug: 'lod-daycare',
 brand: { kalkalit: `${brand}/kalkalit-lod-logo.png`, kalkalitWhite: `${brand}/kalkalit-lod-logo-white.png`, crest: `${brand}/lod-crest.png`, architect: `${brand}/rona-cohen-mark.png` },
 // ITM fit of the ground-floor plan (building/model/registration.json)
 location: { lat: 31.967445, lng: 34.873488 },
 placeholders: {
  street: `${base}/placeholders/street-entrance.webp`,
  long: `${base}/placeholders/street-long.webp`,
  entrance: `${base}/placeholders/entrance.webp`,
  louvres: `${base}/placeholders/louvres.webp`,
  corridor: `${base}/placeholders/corridor.webp`,
  map: `${base}/placeholders/location-map.webp`,
 },
 // photoreal stills: building/photoreal/generated (from the approved model) + the approved classroom keyframes
 // (classroom/keyframes/generated); web size + full size for the lightbox; no people in any of them
 stills: Object.fromEntries(['aerial', 'minibus', 'golden', 'street-ne', 'park-nw', 'park-front', 'class-entry', 'class', 'kitchenette',
  'yard', 'changing', 'class-top', 'car-seat-store', 'corridor', 'snoezelen', 'building-top'].map(k => [k, { src: `${base}/stills/${k}.webp`, full: `${base}/stills/${k}-full.webp` }])) as Record<string, { src: string; full: string }>,
 // to be filled when the tracks deliver
 orbit: null as null | { url: string },
 // the 30 s project film (presentation track), one cut per language; null until the edit is exported
 projectFilm: { he: { src: `${base}/film/lod-film-he.mp4`, poster: `${base}/film/lod-film-he-poster.webp` }, en: { src: `${base}/film/lod-film-en.mp4`, poster: `${base}/film/lod-film-en-poster.webp` } } as Partial<Record<'he' | 'en', { src: string; poster: string }>>,   // each language its own cut (1080p48 web encodes)
 projectFilmPoster: `${base}/stills/golden.webp`,
 // the tender contact person; still to come from Kalkalit Lod. Filling name / phone (/ email) turns the card on the page
 // into the live contact card (tel:, WhatsApp, mailto); empty = placeholders, inactive buttons.
 contact: { name: '', phone: '', phoneIntl: '', email: '' } as { name?: string; phone?: string; phoneIntl?: string; email?: string },
};

// the six classes as on the site plan; colour = the class's kitchenette colour code (BRAND.md)
export type Programme = 'mixed' | 'comm';
export type Age = 'infants' | 'toddlers' | 'children';
export type DayClass = { n: number; programme: Programme; age: Age; colour: string };
export const CLASSES: DayClass[] = [
 { n: 1, programme: 'mixed', age: 'children', colour: '#ffc803' },
 { n: 2, programme: 'mixed', age: 'toddlers', colour: '#e0553a' },
 { n: 3, programme: 'mixed', age: 'infants', colour: '#f39d08' },
 { n: 4, programme: 'comm', age: 'infants', colour: '#b9c84a' },
 { n: 5, programme: 'comm', age: 'toddlers', colour: '#7fb36f' },
 { n: 6, programme: 'comm', age: 'children', colour: '#5aa6dc' },
];

// steering deck p5, net m²
export const FIGURES = { classes: 6, ages: '0–3', classArea: 45, footprint: '67 × 30', yards: 6, net: 793, gross: '1,154' };

// the hotspots the 360 view will carry (building track)
export const HOTSPOTS = ['classes', 'kitchen', 'entrance', 'yards'] as const;

// finishes: the façade is HPL cladding in four warm tones per the June 2026 tender elevations (0065 Ivory, 0081 Alpaca,
// 0654 Jasmin, 0091 Starlight; codes to be confirmed with the architect, so the page names no codes); louvres from the
// finishes deck (Dec 2025)
export const FINISHES = {
 louvres: [
  { code: '1885', hex: '#8c1707', name: { en: 'Rosso Meg', he: 'אדום' } },
  { code: '1812', hex: '#f39d08', name: { en: 'Giallo Polenta', he: 'כתום' } },
  { code: '465', hex: '#ffc803', name: { en: 'Bumblebee', he: 'צהוב' } },
 ],
} satisfies { louvres: { code: string; hex: string; name: L }[] };
