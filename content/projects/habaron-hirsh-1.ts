import type { MediaImage, Residence, ResidenceText, ResolvedMedia } from './index';
import type { Lang } from '@/lib/i18n';

// HaBaron Hirsh 1, Ramat Aviv Alef, Tel Aviv (Villar · Nachman Group · Maoz Price Architects): apt 28 from
// data/projects/HaBaron-Hirsh-1-Tel-Aviv/apt28 (the apartment pipeline). A direct-link page only: nothing links here and the
// route is noindex. Media is the current WORK IN PROGRESS (480p film, images still in review), copied by hand from the box.
const base = '/projects/habaron-hirsh-1/r2';   // r2: fresh URLs (an early range-request check left partial files in the CDN cache)
const img = (name: string, label: string, labelHe: string): MediaImage => ({ src: `${base}/media/28/${name}.webp`, label, labelHe });

export type HabaronHome = Residence & { he: ResidenceText; floorLabel: string; floorLabelHe: string; concept: string; conceptHe: string };

export const habaronBuilding = {
 name: 'HaBaron Hirsh 1', nameHe: 'הברון הירש 1', address: 'HaBaron Hirsh 1, Tel Aviv', addressHe: 'הברון הירש 1, תל אביב',
 developer: 'Villar Ramat Aviv · Nachman Group', architects: 'Maoz Price Architects',
 logos: [
  { src: `${base}/brand/villar.png`, alt: 'Villar', w: 112, h: 52 },
  { src: `${base}/brand/nachman.png`, alt: 'Nachman Group', w: 112, h: 36 },
 ],
 disclaimer: 'A preview, not an offer to sell. Interiors, the film and the furniture are AI-assisted illustrations; the film is a low-resolution demo. Areas and layout follow the developer’s sales plan, which is not final and is subject to the building-permit changes. Confirm every detail with the developer.',
 disclaimerHe: 'תצוגה מקדימה ולא הצעה למכירה. העיצוב, הסרטון והריהוט הם המחשות בסיוע בינה מלאכותית; הסרטון הוא הדגמה ברזולוציה נמוכה. השטחים והתכנון לפי תוכנית המכר של היזם, שאינה סופית וכפופה לשינויים לפי היתר הבנייה. יש לאמת כל פרט מול היזם.',
};

export const habaronHome: HabaronHome = {
 id: '28', title: 'Apartment 28 · 3 rooms', shortTitle: 'Apartment 28', tagline: 'A bright three-room home with a south-facing sun balcony over the trees.',
 rooms: 3, outdoor: 'Sun balcony', area: 64, outdoorArea: 9.7, exposure: 'South', label: 'Building 1 · 3 rooms', floorLabel: 'Floor 4', floorLabelHe: 'קומה 4',
 plan: `${base}/plans/28.webp`, sourceUnits: 'Apartment 28',
 concept: 'A calm three-room home with a south sun balcony.',
 conceptHe: 'דירת שלושה חדרים רגועה עם מרפסת שמש דרומית.',
 description: 'An open living room, dining and kitchen onto a south sun balcony; a master bedroom with its own en-suite, a safe room set up as a study, and a family bathroom.',
 about: ['The entrance opens straight into one long, bright space: dining table under a paper pendant, the living room by the south glass, and the kitchen along the east wall. The wide slider leads to a 1.25-metre sun balcony facing the garden trees of Ramat Aviv.',
  'A corridor runs back to the family bathroom, the safe room (furnished here as a study) and the master bedroom with its en-suite bathroom. Areas follow the developer’s sales plan (about 64 m² inside and 9.7 m² of balcony). Worth checking: the master-bedroom door is a narrow 70 cm, and all furniture shown is one way to live in the home.'],
 media: { film: { src: `${base}/media/28/film-480p.mp4`, poster: `${base}/media/28/film-480p-poster.webp` }, images: [], model: `${base}/models/28.glb` },
 he: { title: 'דירה 28 · 3 חדרים', shortTitle: 'דירה 28', tagline: 'דירת שלושה חדרים מוארת עם מרפסת שמש דרומית מעל העצים.',
  outdoor: 'מרפסת שמש', exposure: 'דרום', label: 'בניין 1 · 3 חדרים',
  description: 'סלון, פינת אוכל ומטבח פתוחים למרפסת שמש דרומית; חדר שינה ראשי עם חדר רחצה צמוד, ממ״ד שמשמש כחדר עבודה וחדר רחצה משפחתי.',
  about: ['הכניסה נפתחת ישר לחלל אחד ארוך ומואר: שולחן אוכל מתחת לפנס נייר, הסלון ליד הזיגוג הדרומי והמטבח לאורך הקיר המזרחי. הדלת הרחבה מובילה למרפסת שמש ברוחב 1.25 מ׳ מול עצי הגינה של רמת אביב.',
   'מסדרון מוביל אל חדר הרחצה המשפחתי, הממ״ד (מוצג כאן כחדר עבודה) וחדר השינה הראשי עם חדר הרחצה הצמוד. השטחים לפי תוכנית המכר של היזם (כ־64 מ״ר פנים ו־9.7 מ״ר מרפסת). כדאי לבדוק: דלת חדר השינה הראשי צרה, 70 ס״מ בלבד, והריהוט המוצג הוא אפשרות אחת לחיות בבית.'] },
};
// the gallery lives apart from `media` so the Hebrew labels travel with it
export const habaronImages: MediaImage[] = [
 img('g-entry', 'Arrival: dining and living', 'הגעה: פינת אוכל וסלון'), img('v-living-s2', 'Back from the balcony', 'חזרה מהמרפסת'), img('g-kitchen', 'Kitchen', 'מטבח'), img('v-balcony', 'Sun balcony', 'מרפסת השמש'),
 img('v-corridor', 'The corridor', 'המסדרון'), img('v-safe', 'Study (safe room)', 'חדר עבודה (ממ״ד)'), img('v-bath', 'Family bathroom', 'חדר רחצה משפחתי'),
 img('v-master', 'Master bedroom', 'חדר השינה הראשי'), img('top', 'The whole apartment from above', 'כל הדירה ממבט על'),
];

export const habaronMedia = (lang: Lang): ResolvedMedia => ({
 film: habaronHome.media!.film!, model: `${base}/models/28.glb`, modelOrbit: '28deg 52deg 100%', modelStage: 'paper', modelOutdoorOrbit: '3deg 58deg 72%', modelPoster: `${base}/models/28-poster.webp`,
 images: habaronImages.map(i => ({ ...i, label: lang === 'he' ? i.labelHe ?? i.label : i.label })),
 placeholder: { film: false, images: false, model: false },
});
