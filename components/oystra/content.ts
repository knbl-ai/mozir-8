// Oystra by Richmind, Al Marjan Island. Everything the page says, with where each fact comes from.
// Sources: the developer's fact sheet and brochure (project, credits, travel times, handover), the floor plan of
// Residence C, Type 65 (areas and room sizes of C-905). "800+ homes" is our count of unit labels on the floor layouts.
export const MEDIA = '/projects/oystra';

export const CREDITS = [
 ['Developer', 'Richmind'],
 ['Architecture', 'Zaha Hadid Architects'],
 ['Interiors', 'HBA'],
 ['Landscape', 'Cracknell'],
 ['Architect of record', 'Dewan'],
] as const;

export const RESIDENCE_FACTS = [
 ['Bedrooms', '2'],
 ['Bathrooms', '2'],
 ['Interior', '104.31 m²'],
 ['Balcony', '28.36 m²'],
 ['Floor', '9 of 18'],
 ['Residence', 'C'],
] as const;

export type Shot = { id: string; alt: string; kind: 'wide' | 'detail' | 'mood' };
// zone: the room's outline on the top-down picture, in thousandths of its width and height; at: where its label sits; size: as printed on the developer's plan
export type Room = { id: string; name: string; line: string; size: string; zone: string; at: [number, number]; shots: Shot[] };

// Rooms in the order a visit would take. The first shot of each room is its wide view.
export const ROOMS: Room[] = [
 { id: 'living', name: 'Living and dining', line: 'One long room that runs to a wall of glass, the balcony and the sea beyond it.', size: '6.0 × 4.2 m', zone: '261,589 958,589 958,711 778,711 778,856 722,856 722,928 261,928', at: [500, 640], shots: [
  { id: 'w-living', alt: 'The lounge looking toward the glass wall and the balcony', kind: 'wide' },
  { id: 'c-table', alt: 'The edge of the stone coffee table on its brass base', kind: 'detail' },
  { id: 'w-dining', alt: 'The dining table seen from the lounge, the kitchen behind it', kind: 'wide' },
  { id: 'a-curtain', alt: 'A sheer curtain lifting in the sea breeze at the open glass', kind: 'mood' },
 ] },
 { id: 'kitchen', name: 'Kitchen', line: 'Ivory joinery, a stone worktop and brass, open to the dining table.', size: '3.3 × 2.4 m', zone: '778,711 958,711 958,928 722,928 722,856 778,856', at: [868, 770], shots: [
  { id: 'w-kitchen', alt: 'The kitchen seen across the dining table', kind: 'wide' },
  { id: 'c-kitchen', alt: 'The brass kitchen tap against the stone splashback', kind: 'detail' },
 ] },
 { id: 'master', name: 'Master suite', line: 'A bedroom on the glass, a walk-in closet and a bathroom of its own.', size: '4.2 × 3.7 m · closet 2.6 × 1.7 m', zone: '261,69 711,69 711,339 261,339', at: [430, 292], shots: [
  { id: 'w-master', alt: 'The master bedroom looking toward the glass wall and the sea', kind: 'wide' },
  { id: 'a-lastlight', alt: 'Evening light through the sheer curtain across the bed', kind: 'mood' },
  { id: 'c-bedside', alt: 'The travertine bedside table and brass reading lamp', kind: 'detail' },
  { id: 'c-closet', alt: 'A lit oak shelf in the walk-in closet', kind: 'detail' },
 ] },
 { id: 'bath', name: 'Master bathroom', line: 'A freestanding bath, a floating vanity and warm light from the stone itself.', size: '3.3 × 3.2 m', zone: '720,69 958,69 958,314 720,314', at: [840, 180], shots: [
  { id: 'w-bathm', alt: 'The master bathroom with its vanity and freestanding bath', kind: 'wide' },
 ] },
 { id: 'bed2', name: 'Second bedroom', line: 'The same glass, the same balcony, its own bathroom across the hall.', size: '4.7 × 3.2 m', zone: '261,353 611,353 611,578 261,578', at: [430, 395], shots: [
  { id: 'w-bed2', alt: 'The second bedroom looking toward the glass wall and the balcony', kind: 'wide' },
 ] },
 { id: 'balcony', name: 'Balcony', line: 'Eleven and a half metres of curved terrace shared by every room.', size: '11.5 × 2.5 m', zone: '131,69 239,69 239,928 67,928 47,667 61,422 94,222', at: [150, 560], shots: [
  { id: 'w-balcony', alt: 'The curved balcony at golden hour, the sea ahead', kind: 'wide' },
  { id: 'a-horizon', alt: 'The view from the glass rail at golden hour', kind: 'mood' },
  { id: 'w-terrace-in', alt: 'The living room seen from the terrace through the open glass', kind: 'wide' },
 ] },
];

// The developer's own renders, shown as they are until our facility pictures are made.
export const FACILITIES = [
 { id: 'sky-pool', name: 'The sky pool', note: 'A 360° infinity pool on the roof of Residence A' },
 { id: 'lagoon', name: 'The lagoon', note: 'A swimming lagoon with its own beach' },
 { id: 'beach-club', name: 'Beach club', note: 'On the water, steps from the residences' },
 { id: 'terrace-pool', name: 'Terrace pool', note: 'A glass-edged pool above the gardens' },
 { id: 'waterfall-garden', name: 'Waterfall garden', note: 'Shade, water and planting between the shells' },
 { id: 'pool-bar', name: 'Pool bar', note: 'Sunken seating in the water' },
 { id: 'family-garden', name: 'Family garden', note: 'Lawns and play at the foot of the residences' },
 { id: 'arrival', name: 'Arrival court', note: 'The drop-off beneath the canopies' },
] as const;

// Named in the developer's material, with no picture yet.
export const MORE_FACILITIES = ['Spa', 'Gym', 'Padel and tennis', 'Cinema', 'Business lounge'] as const;

export const TRAVEL = [
 ['3', 'min', 'Wynn Al Marjan'],
 ['20', 'min', 'Ras Al Khaimah airport'],
 ['55', 'min', 'Dubai International airport'],
] as const;

export const NAV = [
 ['residence', 'Residence'],
 ['film', 'Film'],
 ['life', 'Life'],
 ['location', 'Location'],
 ['enquire', 'Enquire'],
] as const;

// The four residences in the waterfront picture (opening/hd-front-day.webp, 1920 × 1080). zone: the shell's outline in the
// picture; at: where its label sits; floors: residential levels above the podium, from the developer's floor layouts.
// Left to right in this view (from the water): D, C, B, A. A carries the rooftop pool. Order to be confirmed with the developer.
export type ShellId = 'A' | 'B' | 'C' | 'D';
export const SHELLS: { id: ShellId; floors: number; zone: string; at: [number, number] }[] = [
 { id: 'D', floors: 14, at: [395, 700], zone: '176,652 196,566 252,474 330,414 420,390 512,396 578,426 602,482 592,562 572,622 566,652' },
 { id: 'C', floors: 19, at: [790, 700], zone: '630,652 634,560 646,468 692,386 764,350 880,334 957,332 957,452 930,462 912,502 910,602 896,652' },
 { id: 'B', floors: 19, at: [1130, 700], zone: '957,332 1040,334 1152,352 1222,400 1270,482 1286,562 1280,652 1016,652 1002,602 1005,512 990,466 957,452' },
 { id: 'A', floors: 14, at: [1535, 700], zone: '1310,652 1314,502 1350,440 1420,400 1500,382 1562,396 1640,450 1702,522 1742,582 1762,632 1752,652' },
];
// What the developer's layouts show on particular floors.
export const FLOOR_NOTES: Partial<Record<ShellId, { from: number; to: number; text: string }[]>> = {
 A: [{ from: 13, to: 14, text: 'The sky pool and rooftop venue. These two levels are not homes.' }],
 B: [{ from: 15, to: 17, text: 'Penthouses, in the arch that joins Residences B and C.' }, { from: 18, to: 19, text: 'Royal penthouses, at the top of the arch.' }],
 C: [{ from: 15, to: 17, text: 'Penthouses, in the arch that joins Residences B and C.' }, { from: 18, to: 19, text: 'Royal penthouses, at the top of the arch.' }, { from: 9, to: 9, text: 'C-905 is on this floor, on the ocean arm, facing Residence B.' }],
};
