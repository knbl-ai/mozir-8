import { useRef } from 'react';
import data from '@/content/styles.json';
import type { LandingCopy } from './copy';

// The public part of the style library (scripts/build-styles.cjs): names, concepts, palettes and four sample rooms each.
export type RoomKey = 'living' | 'kitchen' | 'master' | 'bath';
export type DesignStyle = {
 slug: string; name: string; concept: string; mood: string[];
 axes: { value: 'light' | 'mid' | 'dark'; temperature: 'warm' | 'neutral' | 'cool'; colour: string };
 palette: { name: string; hex: string }[];
 images: { room: RoomKey; src: string; thumb: string }[];
};
export const styles = data as DesignStyle[];
export const ROOMS: RoomKey[] = ['living', 'kitchen', 'master', 'bath'];
export const cover = (st: DesignStyle) => st.images[0];
export const altFor = (t: LandingCopy['styles'], st: DesignStyle, room: RoomKey) => t.roomAlt(t.rooms[room], st.name);

// A horizontal swipe on touch screens; `dir` is +1 when the reading direction is right to left.
export function useSwipe(onPrev: () => void, onNext: () => void, rtl: boolean) {
 const start = useRef<{ x: number; y: number } | null>(null);
 return {
  onPointerDown: (e: React.PointerEvent) => { if (e.pointerType !== 'mouse') start.current = { x: e.clientX, y: e.clientY }; },
  onPointerUp: (e: React.PointerEvent) => {
   const s = start.current; start.current = null;
   if (!s) return;
   const dx = e.clientX - s.x, dy = e.clientY - s.y;
   if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
   // Swiping towards the end of the line shows the next one.
   (dx < 0) !== rtl ? onNext() : onPrev();
  },
  onPointerCancel: () => { start.current = null; },
 };
}
