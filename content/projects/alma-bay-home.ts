// Alma Bay · Residence 01 — the apartment's highlights page (one page per home: the three films, the interactive plan,
// the 3D model, the gallery, the neighbourhood and who to talk to). Built from the pipeline:
//   page/plan.json + top.jpg  — pipeline/highlights/sitepack.py plan  (plan.json rooms registered on the photoreal top-down)
//   page/map.json  + map.svg  — pipeline/highlights/sitepack.py map   (OSM map, admin-checked places, routed walks)
//   page/room-<id>.mp4        — pipeline/highlights/sitepack.py clips (the long film's shots of each room)
// Placeholders (address, agent) are marked PLACEHOLDER below until the real facts are known.
import planJson from '@/public/projects/shirat-hayam/homes/apt01/page/plan.json';
import mapJson from '@/public/projects/shirat-hayam/homes/apt01/page/map.json';
import { HOMES, ORBIT_URL, ORBIT_VIDEO, SHOWCASE, UNITS, homeBase, project } from './shirat-hayam';

export type PlanRoom = { id: string; type: string; name: string; area: number | null; w: number | null; d: number | null; poly: number[][]; c: number[] };
export type PlanData = { image: string; cutout: { image: string; x: number; y: number; w: number; h: number }; size: number[]; view: number[]; north_deg_page: number | null; headline: Record<string, number>; rooms: PlanRoom[] };
export type Place = { id: string; kind: string; label: string; name: string; walk_min: number | null; walk_m: number | null; xy: number[]; route: string | null };
export type MapData = { image: string; view: number[]; home: number[]; items: Place[]; method?: string };
export type RoomInfo = { line: string; images: string[]; clip?: string };
export type Contact = { name?: string; role?: string; phone?: string; email?: string; whatsapp?: string; url?: string };

const H = HOMES.apt01;
const base = homeBase('apt01');
const page = `${base}/page`;

export const HOME = {
 slug: 'alma-bay/films/riviera-editorial',
 project: 'Alma Bay',
 unit: { name: 'Residence 01', tower: 'A', floor: 25 },
 /** PLACEHOLDER (made up for the pilot, 2026-11-10): apartment.yaml still has "exact street address open" */
 address: { no: '14', street: 'HaGalim Boulevard', city: 'Netanya', country: 'Israel', placeholder: true },
 developer: { name: 'Orelia', logoWhite: '/brand/orelia-logo-white.png', logoBlack: '/brand/orelia-logo-black.png', url: '/alma-bay' as string | undefined,
  linkLabel: 'Alma Bay by Orelia — all residences',
  about: 'Orelia builds Alma Bay: two 32-floor towers on a shared podium above the southern beaches of Netanya, with a pool, a tennis court and a lobby open to the garden. Every residence can be explored on the project page — choose it on the building and open its plans, films and 3D model.',
  facts: [{ value: '2', label: 'Towers' }, { value: '215', label: 'Residences' }, { value: '6,635 m²', label: 'Plot' }] },
 /** PLACEHOLDER sales agent (fictional person, generated portrait, made-up phone/email) until the real one is known */
 agent: { name: 'Daniel Mizrahi', role: 'Sales manager · Alma Bay', phone: '+972 50-555-0142', email: 'daniel@orelia-homes.com', photo: `${page}/agent.webp` } as Contact & { photo?: string },
 hero: { wide: `${page}/hero-home.mp4`, wideStill: `${page}/hero-home.jpg`, tall: `${page}/hero-home-916.mp4`, tallStill: `${page}/hero-home-916.jpg` },
 /** the home in short points (plan.json notes, apartment.yaml) — icon names from lucide */
 points: [
  { icon: 'compass', title: 'Corner home', text: 'On the north-east of the tower, light from two sides' },
  { icon: 'chef', title: 'Kitchen island', text: 'The front door opens to the kitchen and its 3.4 m island' },
  { icon: 'sofa', title: 'Living room to the north', text: 'Along the window wall, open to the balcony' },
  { icon: 'waves', title: '4.6 × 4.8 m balcony', text: 'A table for six, the sea at an angle to the west' },
  { icon: 'bed', title: 'Master suite', text: 'Its own en-suite and a dressing passage' },
  { icon: 'sunrise', title: 'Three more rooms', text: 'Two bedrooms and the safe room, all facing east' },
 ],
 tower: { floors: 32 },
 /** everything on the page in one zip (pipeline/highlights/sitepack.py zip pipeline/highlights/pilot/edit/kit-<style>.json) */
 kits: Object.fromEntries(['riviera-editorial', 'sunday-house', 'monograph'].map(k => [k, {
  href: `${page}/alma-bay-residence-01-${k.split('-')[0]}.zip`, size: ({ 'riviera-editorial': '70 MB', 'sunday-house': '64 MB', monograph: '61 MB' } as Record<string, string>)[k], files: 36,
  parts: [{ n: '3', label: 'films · 46 s, 20 s, 9:16' }, { n: '6', label: 'room clips' }, { n: '11', label: 'images' }, { n: '3', label: 'floor plans' }, { n: '1', label: '3D model · GLB' }, { n: '12', label: 'building images & videos' }] }])) as Record<string, { href: string; size: string; files: number; parts: { n: string; label: string }[] }>,
 /** the neighbourhood map in each style's palette (sitepack.py map --style) */
 maps: { 'riviera-editorial': `${page}/map.svg`, 'sunday-house': `${page}/map-sunday-house.svg`, monograph: `${page}/map-monograph.svg` } as Record<string, string>,
 /** the building: the measured 360° orbit (apt-building, every home outlined per view) + stills and films of the towers */
 building: {
  orbit: ORBIT_URL, ringVideo: ORBIT_VIDEO, unit: SHOWCASE.apt01, startView: 345,   // the front: both towers side by side, the pool between
  figures: [
   { value: String(project.figures.towers), label: 'Towers' }, { value: String(project.figures.floors), label: 'Floors' },
   { value: String(UNITS.length), label: 'Homes' }, { value: project.figures.plot.toLocaleString('en-US'), label: 'm² plot' },
  ],
  media: [
   { kind: 'video' as const, src: `${page}/b-towers.mp4`, thumb: `${page}/b-towers.jpg`, caption: 'The towers' },
   { kind: 'img' as const, src: project.stills.hero, thumb: project.stills.hero, caption: 'Above the beach' },
   { kind: 'video' as const, src: `${page}/b-coast.mp4`, thumb: `${page}/b-coast.jpg`, caption: 'The coast' },
   { kind: 'img' as const, src: project.stills.street, thumb: project.stills.street, caption: 'From the street' },
   { kind: 'video' as const, src: `${page}/b-pool.mp4`, thumb: `${page}/b-pool.jpg`, caption: 'The pool' },
   { kind: 'img' as const, src: project.stills.pool, thumb: project.stills.pool, caption: 'Pool deck' },
   { kind: 'video' as const, src: `${page}/b-lobby.mp4`, thumb: `${page}/b-lobby.jpg`, caption: 'Entrance and lobby' },
   { kind: 'img' as const, src: project.stills.lobbyHall, thumb: project.stills.lobbyHall, caption: 'Lobby hall' },
   { kind: 'img' as const, src: project.stills.lobbySalon, thumb: project.stills.lobbySalon, caption: 'Residents’ salon' },
   { kind: 'img' as const, src: project.stills.tennis, thumb: project.stills.tennis, caption: 'Tennis court' },
   { kind: 'img' as const, src: project.stills.terrace, thumb: project.stills.terrace, caption: 'The façade' },
   { kind: 'video' as const, src: project.film.en.src, thumb: project.film.en.poster, caption: 'The Alma Bay film' },
  ],
 },
 contact: {} as Contact,
 about: H.about.en,
 stats: [
  { value: String(H.interior), unit: 'm²', label: 'Interior' },
  { value: String(H.rooms), unit: '', label: 'Rooms' },
  { value: String(H.outdoor), unit: 'm²', label: 'Balcony' },
  { value: '25', unit: '', label: 'Floor' },
 ],
 aspect: H.aspect.en,
 plan: (p => ({ ...p, image: `${page}/top.jpg`, cutout: { ...p.cutout, image: `${page}/top-cutout.webp` } }))(planJson as unknown as PlanData),
 map: { ...(mapJson as unknown as MapData), image: `${page}/map.svg` },
 model: { glb: `${base}/${H.hq!.glb}`, poster: `${base}/${H.hq!.poster}`, orbit: H.hq!.orbit, outdoorOrbit: H.hq!.outdoorOrbit, walk: H.walk ? `/walk/tour.html?src=${base}/${H.walk}/` : undefined },
 gallery: H.images.map(i => ({ src: `${base}/${i.id}.webp`, thumb: `${base}/${i.id}-t.webp`, caption: i.label.en, room: undefined as string | undefined })),
};

const img = (id: string) => `${base}/${id}.webp`;
const clip = (id: string) => `${page}/room-${id}.mp4`;
/** what a visitor reads and opens on each room of the plan (facts: plan.json notes, apartment.yaml) */
export const ROOMS: Record<string, RoomInfo> = {
 living: { line: 'One long space from the front door to the north window wall: the kitchen with its 3.4 m island, dining for six and the living room.', images: [img('g-entry'), img('v-kitchen'), img('g-living'), img('v-dining-s2')], clip: clip('living') },
 balcony: { line: 'Open to the north and the west — a table for six with the sea at an angle, 25 floors up.', images: [img('v-balcony'), img('g-view')], clip: clip('balcony') },
 corridor: { line: 'A 1.2 m corridor from the living space to the private wing.', images: [], clip: clip('corridor') },
 master: { line: 'The master suite: a dressing passage past its own en-suite, the window to the north.', images: [img('v-master')], clip: clip('master') },
 ensuite: { line: 'Shower, WC and a double vanity, with a frosted window.', images: [] },
 bed2: { line: 'A bedroom facing east over the city, with a desk under the window.', images: [img('v-bed2')], clip: clip('bed2') },
 bed3: { line: 'A second children’s room, facing east.', images: [img('v-bed3')] },
 safe: { line: 'The safe room, furnished as a study or a fourth bedroom.', images: [img('v-safe')] },
 wc: { line: 'A guest WC off the corridor.', images: [] },
 bath: { line: 'The family bathroom — the largest in the home, with a walk-in rain shower.', images: [img('v-bath')], clip: clip('bath') },
 laundry: { line: 'A service balcony with drying lines behind a screen, off the bathroom.', images: [] },
};

// each photograph knows its room (the plan lights it up when the photo is hovered)
for (const g of HOME.gallery) g.room = Object.entries(ROOMS).find(([, r]) => r.images.includes(g.src))?.[0];

/** styles whose Hebrew films are published (highlights/<slug>[-20|-916]-he.mp4 + -he-poster.jpg); add a slug when they are up */
export const HE_FILMS = new Set<string>(['riviera-editorial', 'sunday-house', 'monograph']);   // published 2026-11-10
