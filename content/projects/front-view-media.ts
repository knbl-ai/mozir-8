import type { ResidenceMedia } from './index';

const base = '/projects/building-preview/apartments/front-view';

// Approved Front View production assets. Film is one unified 30-second native 1080p generation.
export const frontViewMedia: ResidenceMedia = {
 film: { src: `${base}/walkthrough-30s-1080-v2.mp4`, poster: `${base}/images/01_living_v1.webp` },
 model: `${base}/apartment-v1.glb`,
 modelOrbit: '25deg 45deg 95%',
 images: [
  { src: `${base}/images/01_living_v1.webp`, label: "Living & dining", labelHe: "סלון ופינת אוכל" },
  { src: `${base}/images/10_kitchen_v1.webp`, label: "Kitchen", labelHe: "מטבח" },
  { src: `${base}/images/11_balcony_v1.webp`, label: "Balcony", labelHe: "מרפסת" },
  { src: `${base}/images/12_corridor_v1.webp`, label: "Private corridor", labelHe: "מסדרון" },
  { src: `${base}/images/02_master_v1.webp`, label: "Main bedroom", labelHe: "חדר השינה הראשי" },
  { src: `${base}/images/03_ensuite_v1.webp`, label: "En-suite bathroom", labelHe: "חדר רחצה צמוד" },
  { src: `${base}/images/04_laundry_v1.webp`, label: "Laundry room", labelHe: "חדר כביסה" },
  { src: `${base}/images/05_child_v2.webp`, label: "Children’s room", labelHe: "חדר ילדים" },
  { src: `${base}/images/06_bathroom_v1.webp`, label: "Shared bathroom", labelHe: "חדר הרחצה הכללי" },
  { src: `${base}/images/07_guest_v1.webp`, label: "Guest bedroom", labelHe: "חדר אורחים" },
  { src: `${base}/images/08_storage_v1.webp`, label: "Storage room", labelHe: "חדר אחסון" },
  { src: `${base}/images/09_study_v1.webp`, label: "Home study", labelHe: "חדר עבודה" },
  { src: `${base}/images/14_topdown_realistic_v1.webp`, label: "Apartment overview", labelHe: "מבט על הדירה" },
 ],
};
