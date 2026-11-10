// Alma Bay · Residence 01 — the three highlights films (Apt Highlights pilot, 2026-11-08).
// Media in public/projects/shirat-hayam/highlights/ (GCS in production via the media rewrite).
// Numbers are from the plan (facts.json) and routed OSM walking times (poi.json, admin-approved).

const M = '/projects/shirat-hayam/highlights';

export type FilmCut = { id: string; label: string; length: string; aspect: '16:9' | '9:16'; src: string; poster: string };
export type FilmStyle = {
  slug: string; no: string; name: string; tagline: string; concept: string;
  /** the word set huge in the scroll reveal (letters show the film through them) and the line under it */
  maskWord: string; lede: string;
  /** section markers in the style's own vernacular (folio, sheet number, sticker) */
  marks: [string, string, string, string];
  palette: { name: string; hex: string }[];
  type: { display: string; text: string };
  facts: { label: string; value: string }[];
  motion: string[]; music: string; transitions: string;
  examples: { src: string; caption: string }[];
  cuts: FilmCut[];
};

const cuts = (slug: string): FilmCut[] => [
  { id: 'long', label: 'The film', length: '46 s', aspect: '16:9', src: `${M}/${slug}.mp4`, poster: `${M}/${slug}-poster.jpg` },
  { id: 'short', label: 'Short cut', length: '20 s', aspect: '16:9', src: `${M}/${slug}-20.mp4`, poster: `${M}/${slug}-20-poster.jpg` },
  { id: 'phone', label: 'Phone cut', length: '20 s', aspect: '9:16', src: `${M}/${slug}-916.mp4`, poster: `${M}/${slug}-916-poster.jpg` },
];
const ex = (slug: string, items: [string, string][]) => items.map(([k, caption]) => ({ src: `${M}/ex/${slug}-${k}.jpg`, caption }));

export const FILM_STYLES: FilmStyle[] = [
  {
    slug: 'riviera-editorial', no: '01', name: 'Riviera Editorial', tagline: 'A home with a horizon',
    maskWord: 'RIVIERA', lede: 'Light from the side, stone underfoot, the sea at the edge of every room — the summer issue, starring one home.',
    marks: ['Nº 01 — The film', 'Nº 02 — The cuts', 'Nº 03 — The style sheet', 'Nº 04 — Plates'],
    concept: 'The apartment as the cover story of a summer design magazine. Long side light, warm stone, the sea at the edge of every frame. Serif titles sit on the architecture like folios on a page.',
    palette: [{ name: 'Limestone', hex: '#EFE7DA' }, { name: 'Terracotta', hex: '#C4623F' }, { name: 'Sea', hex: '#2F6F8F' }, { name: 'Ink', hex: '#1E1B18' }],
    type: { display: 'Instrument Serif', text: 'DM Mono' },
    facts: [{ label: 'Tempo', value: '108 BPM' }, { label: 'Average shot', value: '2.0 s' }, { label: 'Transitions', value: 'Hairline split · light leak' }],
    motion: ['Lines rise out of masks, a hairline draws before the words land', 'Labels set on the cut, aligned to window frames and mullions', 'Map as a duotone poster: coast first, then the streets, a terracotta pin'],
    music: 'Balearic nu-disco: nylon guitar ostinato, congas and Rhodes stabs that open up room by room.',
    transitions: 'Hairline splits at chapter changes, two warm light leaks, hard cuts everywhere else.',
    examples: ex('riviera-editorial', [['map', 'The map — five walking routes, the beach 13 min'], ['home', 'The home — the whole plan on the photoreal top-down'], ['label', 'Room label on the architecture'], ['end', 'End card']]),
    cuts: cuts('riviera-editorial'),
  },
  {
    slug: 'sunday-house', no: '02', name: 'Sunday House', tagline: 'Sunday, every day',
    maskWord: 'SUNDAY', lede: 'A home for a family’s Sunday — the beach a 13-minute walk, school nine, and a balcony table for six.',
    marks: ['01 · The film', '02 · Short & phone', '03 · The look', '04 · Moments'],
    concept: 'A home for a family’s Sunday: warm, lively, a little cheeky — and still grid-locked and crisp. Paper-cut maps, numbered room tags and sticker pops that carry you from one part of the home to the next.',
    palette: [{ name: 'Cream', hex: '#FFF6E5' }, { name: 'Tomato', hex: '#EF5B3B' }, { name: 'Sunflower', hex: '#F7C548' }, { name: 'Leaf', hex: '#4FA36B' }],
    type: { display: 'Bricolage Grotesque', text: 'Space Mono' },
    facts: [{ label: 'Tempo', value: '118 BPM' }, { label: 'Average shot', value: '1.7 s' }, { label: 'Transitions', value: 'Sticker pop' }],
    motion: ['Paper-cut map with icon pins and a footstep route to school', 'Tags on cream plates, back.out(1.4), icons wobble ≤ 3°', 'One colour and icon per act'],
    music: 'Afro-pop-tinged indie: hi-life guitar, bouncy bass, glockenspiel and a wordless whistled hook.',
    transitions: 'Sticker pops between acts, hard cuts within them.',
    examples: ex('sunday-house', [['map', 'Paper-cut map — five places, routed on foot'], ['home', '“Come on in.” — the plan as a die-cut sticker'], ['label', 'Numbered room tags'], ['end', 'End card']]),
    cuts: cuts('sunday-house'),
  },
  {
    slug: 'monograph', no: '03', name: 'Monograph', tagline: 'Drawn, measured, photographed',
    maskWord: 'MONOGRAPH', lede: 'Plates and drawings of one residence: every room numbered, measured and lit — the architecture book as a film.',
    marks: ['A-101 · Film', 'A-102 · Cuts', 'A-103 · Specification', 'A-104 · Plates'],
    concept: 'The apartment as a printed architecture monograph: the photographer’s plates next to the drawings. Every room carries a sheet number, the key plan lights the room you are in, the film closes on the schedule of areas.',
    palette: [{ name: 'Paper', hex: '#F5F3EE' }, { name: 'Graphite', hex: '#2B2B2B' }, { name: 'Drafting red', hex: '#D2452F' }, { name: 'Blue line', hex: '#3A5BA0' }],
    type: { display: 'Hanken Grotesk', text: 'Geist Mono' },
    facts: [{ label: 'Tempo', value: '112 BPM' }, { label: 'Average shot', value: '1.8 s' }, { label: 'Transitions', value: 'Plan-line wipe' }],
    motion: ['A drawing-set strip with sheet numbers and a live key plan', 'Ink-on-paper plates, power4 easing, nothing bounces', 'Location sheet with scale bar, north arrow and a schedule of distances'],
    music: 'Systemic minimalism: interlocking marimba and vibraphone over a woodblock pulse, one voice added per room.',
    transitions: 'Plan-line wipes at chapter changes, metronomic hard cuts on the beat.',
    examples: ex('monograph', [['map', 'Location sheet — five places, routed distances'], ['home', 'A-100 · The home — the plan on paper'], ['label', 'Plate label and the drawing strip'], ['end', 'Schedule of areas']]),
    cuts: cuts('monograph'),
  },
];

export const ALMA_BAY_FILMS = {
  title: 'Alma Bay · Residence 01',
  intro: 'One home, three films. The same apartment — five rooms, 147.3 m² and a 20 m² balcony on the 25th floor above the Netanya cliff — told in three visual languages. Each style comes as a full film, a short cut and a phone cut.',
  stats: [{ value: '147.3', unit: 'm²', label: 'Gross area' }, { value: '5', unit: '', label: 'Rooms' }, { value: '25', unit: '', label: 'Floor' }, { value: '13', unit: 'min', label: 'Walk to the beach' }],
};

export const filmStyle = (slug: string) => FILM_STYLES.find(s => s.slug === slug);

/** styles whose Hebrew films are published (<slug>[-20|-916]-he.mp4, -he-poster.jpg, card-<slug>-he.jpg; 2026-11-10) */
export const HE_FILMS = new Set<string>(['riviera-editorial', 'sunday-house', 'monograph']);
/** the Hebrew edition of a film or still when the page is in Hebrew and that style has one */
export const heMedia = (u: string, slug: string, lang: string) => lang === 'he' && HE_FILMS.has(slug) ? u.replace(/(-poster)?\.(mp4|jpg)$/, '-he$1.$2') : u;
