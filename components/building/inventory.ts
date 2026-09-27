import type { ApartmentZone, BuildingFrame } from '@/content/projects';

export type Apartment = ApartmentZone & { level: number; bestFrame: number; areaByFrame: number[] };

export const polygonArea = (points: string) => {
 const p = points.split(' ').map(v => v.split(',').map(Number));
 return Math.abs(p.reduce((sum, a, i) => { const b = p[(i + 1) % p.length]; return sum + a[0] * b[1] - b[0] * a[1]; }, 0)) / 2;
};

export const levelOf = (floor: string) => (/ground/i.test(floor) ? 0 : Number(floor.replace(/\D+/g, '')) || 0);

// Along a floor as the building is laid out: the front (one large home, or two compact ones), then the rear.
const UNIT_ORDER = ['garden', 'five-room', 'compact', 'four-room'];

// One entry per apartment, with the frame that shows it largest — where a turn to it should land.
export function buildInventory(frames: BuildingFrame[]): Apartment[] {
 const byId = new Map<string, Apartment>();
 frames.forEach((frame, index) => {
  for (const zone of frame.hotspots) {
   const entry = byId.get(zone.apartment) ?? { ...zone, level: levelOf(zone.floor), bestFrame: index, areaByFrame: frames.map(() => 0) };
   entry.areaByFrame[index] += polygonArea(zone.points);
   if (entry.areaByFrame[index] > entry.areaByFrame[entry.bestFrame]) entry.bestFrame = index;
   byId.set(zone.apartment, entry);
  }
 });
 return [...byId.values()].sort((a, b) => a.level - b.level || UNIT_ORDER.indexOf(a.unit) - UNIT_ORDER.indexOf(b.unit));
}

// Already well in view from here? Then there is no reason to turn the building.
export const isWellInView = (apartment: Apartment, frame: number) =>
 apartment.areaByFrame[frame] >= apartment.areaByFrame[apartment.bestFrame] * 0.6;
