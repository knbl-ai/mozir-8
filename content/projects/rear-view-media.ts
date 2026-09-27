import type { ResidenceMedia } from './index';

const base = '/projects/building-preview/apartments/rear-view';

// Rear View production assets. Film is the 30-second native720p corridor revision with locator map.
export const rearViewMedia: ResidenceMedia = {
 film: { src: `${base}/walkthrough-30s-720-map-v2.mp4`, poster: `${base}/images/01_living_v1.webp` },
 model: `${base}/apartment-v2.glb`,
 modelOrbit: '25deg 45deg 95%',
 images: [
  { src: `${base}/images/01_living_v1.webp`, label: 'Living & dining', labelHe: 'סלון ופינת אוכל' },
  { src: `${base}/images/02_kitchen_v1.webp`, label: 'Kitchen', labelHe: 'מטבח' },
  { src: `${base}/images/03_balcony_v1.webp`, label: 'Balcony', labelHe: 'מרפסת' },
  { src: `${base}/images/10_corridor_v1.webp`, label: 'Corridor', labelHe: 'מסדרון' },
  { src: `${base}/images/04_main_v1.webp`, label: 'Main bedroom', labelHe: 'חדר השינה הראשי' },
  { src: `${base}/images/05_child_v1.webp`, label: 'Children’s room', labelHe: 'חדר ילדים' },
  { src: `${base}/images/06_bath_v1.webp`, label: 'Bathroom', labelHe: 'חדר רחצה' },
  { src: `${base}/images/07_guest_v1.webp`, label: 'Guest bedroom & workspace', labelHe: 'חדר אורחים ופינת עבודה' },
  { src: `${base}/images/08_storage_v1.webp`, label: 'Storage', labelHe: 'חדר אחסון' },
  { src: `${base}/images/09_overhead_v1.webp`, label: 'Apartment overview', labelHe: 'מבט על הדירה' },
 ],
};
