// Studio ORYX × residence.tech — a furniture showcase: ten ORYX pieces placed in one bedroom (English only for now).
// Media: public/projects/studio-oryx/ (gitignored) = gs://knbl-sma/apt3d/site/projects/studio-oryx/; films load via film().

export const M = '/projects/studio-oryx/';

export type ViewId = 'v1-hero' | 'v2-bed' | 'v3-nook' | 'v4-tv' | 'v5-mirror' | 'c1-headboard' | 'c2-chair';

export const views: { id: ViewId; title: string; text: string }[] = [
 { id: 'v1-hero', title: 'From the door', text: 'The first view on entering: the bed wall between two windows, the bench at its foot, the mirror at the edge.' },
 { id: 'v2-bed', title: 'The bed wall', text: 'The headboard, nightstands, pendants and macramé, in the late-morning light.' },
 { id: 'v3-nook', title: 'Reading corner', text: 'The arc lamp over the lounge chair, the nesting tables beside it, the TV cabinet along the wall.' },
 { id: 'v4-tv', title: 'Toward the TV wall', text: 'From beside the bed: the reading corner, the TV cabinet and the entry door.' },
 { id: 'v5-mirror', title: 'The mirror wall', text: 'The live-edge mirror leans on a plain wall and reflects the bed.' },
 { id: 'c1-headboard', title: 'Headboard detail', text: 'Two planks across a live-edge gap, held by charred X straps.' },
 { id: 'c2-chair', title: 'Chair detail', text: 'Solid walnut slab sides and hand-woven cane.' },
];

export type Piece = { code: string; name: string; count?: number; text: string; photo: string; seenIn: ViewId[] };

export const pieces: Piece[] = [
 { code: 'M-1', name: 'King bed with headboard', text: 'Reclaimed pine, two headboard planks joined across a live-edge gap by charred X straps, splayed legs.', photo: 'm01-bed', seenIn: ['v1-hero', 'v2-bed', 'c1-headboard', 'v5-mirror'] },
 { code: 'M-2', name: 'Nightstand', count: 2, text: 'Slab sides down to the floor, an open shelf and one drawer with a cut-out pull.', photo: 'm02-nightstand', seenIn: ['v1-hero', 'v2-bed'] },
 { code: 'M-3', name: 'Lounge chair', text: 'Low silón with sculpted solid-walnut slab sides and a hand-woven cane seat and back.', photo: 'm03-chair', seenIn: ['v3-nook', 'c2-chair', 'v4-tv'] },
 { code: 'M-4', name: 'Arc floor lamp', text: 'One bent-walnut arc on a heavy black base, with a streaked black-and-silver drum shade.', photo: 'm04-lamp', seenIn: ['v3-nook', 'v4-tv'] },
 { code: 'M-5', name: 'Macramé wall hanging', count: 2, text: 'A herringbone wood arch over hand-knotted cotton macramé with a long fringe.', photo: 'm05-macrame', seenIn: ['v1-hero', 'v2-bed', 'v5-mirror'] },
 { code: 'M-6', name: 'Bench', text: 'Teak frame with splayed legs and a seat of woven natural cotton cord.', photo: 'm06-bench', seenIn: ['v1-hero', 'v5-mirror'] },
 { code: 'M-7', name: 'TV cabinet', text: 'Pale oak: two open bays, two doors with finger holes, and a top that floats on short dowels.', photo: 'm07-cabinet', seenIn: ['v3-nook', 'v4-tv'] },
 { code: 'M-8', name: 'Rustic floor mirror', text: 'Full-length glass between two live-edge walnut slabs.', photo: 'm08-mirror', seenIn: ['v5-mirror', 'v1-hero'] },
 { code: 'M-9', name: 'Nesting side tables', text: 'A pair of pebble-shaped walnut tops on slim tapered legs.', photo: 'm09-tables', seenIn: ['v3-nook', 'c2-chair'] },
 { code: 'M-10', name: 'Pendant lamp', count: 2, text: 'A draped linen shade with a free, wavy rim.', photo: 'm10-pendant', seenIn: ['v1-hero', 'v2-bed'] },
];

