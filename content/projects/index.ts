import type { Lang } from '@/lib/i18n';
export type MediaImage = { src: string; label: string; labelHe?: string };
// Everything a buyer can look at for one home. Any field left out falls back a level:
// apartment → residence type → the project's shared (placeholder) set.
export type ResidenceMedia = { film?: { src: string; poster: string }; images?: MediaImage[]; model?: string };
export type Residence = { id: string; title: string; shortTitle: string; tagline: string; rooms: number; outdoor: string;
 // Approximate m², measured from the supplied plan (outer wall faces; shared lobby, stairs and laundry niche excluded) — not the developer's official figures.
 area: number; outdoorArea: number; label: string; plan: string; description: string; sourceUnits: string; about: string[]; media?: ResidenceMedia;
 he: ResidenceText };
// Every sentence a visitor reads about a residence, so a language swaps all of them at once.
export type ResidenceText = Pick<Residence, 'title' | 'shortTitle' | 'tagline' | 'outdoor' | 'label' | 'description' | 'about'>;
export type ApartmentZone = { unit: string; apartment: string; status: 'for-sale' | 'sold'; floor: string; labelPoints: [number, number][]; points: string };
export type BuildingFrame = { src: string; hotspots: ApartmentZone[] };
export type Development = { id: string; name: string; location: string; description: string; he: Pick<Development, 'name' | 'location' | 'description'>; references: string[]; residences: Residence[]; media: Required<ResidenceMedia>; apartmentMedia?: Record<string, ResidenceMedia> };
const base = '/projects/building-preview';
const placeholderImages: MediaImage[] = [
 { src: '/media/01_living.webp', label: 'Living & dining', labelHe: 'סלון ופינת אוכל' }, { src: '/media/02_main_bedroom.webp', label: 'Main bedroom', labelHe: 'חדר השינה הראשי' },
 { src: '/media/03_ensuite.webp', label: 'En-suite bathroom', labelHe: 'חדר רחצה צמוד' }, { src: '/media/04_small_bedroom.webp', label: 'Second bedroom', labelHe: 'חדר שינה שני' },
 { src: '/media/05_large_bathroom.webp', label: 'Main bathroom', labelHe: 'חדר הרחצה הראשי' }, { src: '/media/06_kitchen.webp', label: 'Kitchen', labelHe: 'מטבח' },
 { src: '/media/07_overhead.webp', label: 'Apartment overview', labelHe: 'מבט על הדירה' }, { src: '/media/08_terrace_end.webp', label: 'Terrace', labelHe: 'מרפסת' },
];
export const developments: Development[] = [{
 id: 'building-preview', name: 'The next address', location: 'PROJECT PREVIEW',
 description: 'A new perspective on home. Explore the building, find your space, and discover the possibilities within.',
 he: { name: 'הכתובת הבאה', location: 'תצוגה מקדימה של הפרויקט', description: 'מבט חדש על הבית. סיירו בבניין, מצאו את המקום שלכם וגלו את האפשרויות שבו.' },
 references: [`${base}/building/exterior-front.jpg`, `${base}/building/exterior-rear.jpg`],
 media: { film: { src: '/media/residence-film.mp4', poster: '/media/01_living.webp' }, images: placeholderImages, model: '/models/apartment.glb' },
 residences: [
 { id:'garden', title:'The Garden Residence', shortTitle:'Garden residence', tagline:'Four rooms on the ground floor, opening onto a private garden.', rooms:4, outdoor:'Garden', area:86, outdoorArea:90, label:'A private outdoor life', plan:`${base}/plans/garden.jpg`, sourceUnits:'01', description:'A four-room home opening onto a generous private garden, with living and dining at its heart.',
  about:['This ground-floor, four-room layout opens onto a private garden, with the living and dining areas at the centre of the home. The outdoor space is the main difference from the upper-floor layouts and is worth reviewing alongside the indoor furniture arrangement.','Measured from the floor plan, the home is about 86 m² including its walls and the mamad, and the private garden that wraps it on three sides is about 90 m², paved patio included. These are estimates from the drawing, not the developer’s official areas.','Check the route between the living area and garden, the boundary and privacy arrangements, and how the outdoor space can be accessed and maintained. Confirm the exact areas, drainage, step-free access and any parking or storage allocation with the project team.'],
  he: { title: 'דירת הגן', shortTitle: 'דירת הגן', tagline: 'ארבעה חדרים בקומת הקרקע, עם יציאה לגינה פרטית.', outdoor: 'גינה', label: 'חיים פרטיים בחוץ', description: 'דירת ארבעה חדרים עם יציאה לגינה פרטית ונדיבה, והסלון ופינת האוכל בלב הבית.',
   about: ['דירת ארבעה חדרים בקומת הקרקע, עם יציאה לגינה פרטית, והסלון ופינת האוכל במרכז הבית. השטח הפתוח הוא ההבדל העיקרי מהדירות בקומות העליונות, וכדאי לבחון אותו יחד עם סידור הריהוט בפנים.','לפי מדידה מתוכנית הדירה, שטחה כ־86 מ״ר כולל קירות וממ״ד, והגינה הפרטית שמקיפה אותה משלושה צדדים משתרעת על כ־90 מ״ר, כולל הפטיו המרוצף. אלה הערכות לפי השרטוט, לא השטחים הרשמיים של היזם.','כדאי לבדוק את המעבר בין הסלון לגינה, את הגבולות והפרטיות, ואת הגישה לשטח החוץ ותחזוקתו. את השטחים המדויקים, הניקוז, הנגישות ללא מדרגות ושיוך חניה או מחסן יש לאמת מול צוות הפרויקט.'] } },
 { id:'four-room', title:'Rear View Residence', shortTitle:'Rear residence', tagline:'Four rooms, a living-room balcony and a separate storage room.', rooms:4, outdoor:'Balcony', area:82, outdoorArea:8, label:'Room to breathe', plan:`${base}/plans/four-room.jpg`, sourceUnits:'03, 06, 09, 12, 15', description:'A four-room layout with a living-room balcony, three bedrooms and a separate storage room.',
  about:['This four-room layout includes three bedrooms, a living area with a balcony, and a separate storage room. Living, dining and kitchen functions share the main communal space; the supplied plan shows the bedroom arrangement and circulation around it.','Measured from the floor plan, the home is about 82 m² including its walls and the mamad, with a sun balcony of about 8 m² (4.00 × 2.00 m) off the living room. These are estimates from the drawing, not the developer’s official areas.','Use the plan to check bed and wardrobe placement and whether the storage room meets your needs. Confirm the exact areas, bathroom arrangement and any parking allocation for the selected unit.'],
  he: { title: 'דירת העורף', shortTitle: 'דירת העורף', tagline: 'ארבעה חדרים, מרפסת שמש מהסלון וחדר אחסון נפרד.', outdoor: 'מרפסת שמש', label: 'מקום לנשום', description: 'דירת ארבעה חדרים עם מרפסת שמש מהסלון, שלושה חדרי שינה וחדר אחסון נפרד.',
   about: ['דירת ארבעה חדרים עם שלושה חדרי שינה, סלון עם מרפסת שמש וחדר אחסון נפרד. הסלון, פינת האוכל והמטבח חולקים את המרחב המשותף המרכזי; התוכנית מראה את סידור חדרי השינה ואת המעברים סביבם.','לפי מדידה מתוכנית הדירה, שטחה כ־82 מ״ר כולל קירות וממ״ד, ומהסלון יוצאת מרפסת שמש של כ־8 מ״ר (4.00 × 2.00 מ׳). אלה הערכות לפי השרטוט, לא השטחים הרשמיים של היזם.','בעזרת התוכנית אפשר לבדוק את מיקום המיטות והארונות, והאם חדר האחסון מתאים לצרכים שלכם. את השטחים המדויקים, סידור חדרי הרחצה ושיוך החניה לדירה שנבחרה יש לאמת מול צוות הפרויקט.'] } },
 { id:'five-room', title:'Front View Residence', shortTitle:'Front residence', tagline:'Five rooms, four bedrooms, two bathrooms and a long terrace.', rooms:5, outdoor:'Terrace', area:122, outdoorArea:16, label:'Space for more', plan:`${base}/plans/five-room.jpg`, sourceUnits:'17, 19', description:'A five-room layout with a long terrace, four bedrooms and two bathrooms.',
  about:['This five-room layout has four bedrooms and a shared living, dining and kitchen area. The long terrace runs alongside the main living space. With two bathrooms, the layout provides separate facilities for a household using several bedrooms.','Measured from the floor plan, the home is about 122 m² including its walls and the mamad, and the terrace along the living room is about 16 m² (1.83 × 8.80 m). These are estimates from the drawing, not the developer’s official areas.','One bedroom could serve as a home office or guest room, depending on your needs. When reviewing the plan, check furniture clearances, access to the terrace and the position of each bathroom relative to the bedrooms. Exact areas, parking and storage allocations still need confirmation for the selected apartment.'],
  he: { title: 'דירת החזית', shortTitle: 'דירת החזית', tagline: 'חמישה חדרים, ארבעה חדרי שינה, שני חדרי רחצה ומרפסת ארוכה.', outdoor: 'מרפסת', label: 'מקום לעוד', description: 'דירת חמישה חדרים עם מרפסת ארוכה, ארבעה חדרי שינה ושני חדרי רחצה.',
   about: ['דירת חמישה חדרים עם ארבעה חדרי שינה ומרחב משותף של סלון, פינת אוכל ומטבח. המרפסת הארוכה נמתחת לאורך הסלון, ושני חדרי הרחצה נותנים מענה נפרד למשפחה שמשתמשת בכמה חדרי שינה.','לפי מדידה מתוכנית הדירה, שטחה כ־122 מ״ר כולל קירות וממ״ד, והמרפסת שלאורך הסלון משתרעת על כ־16 מ״ר (1.83 × 8.80 מ׳). אלה הערכות לפי השרטוט, לא השטחים הרשמיים של היזם.','אחד מחדרי השינה יכול לשמש חדר עבודה או חדר אורחים, לפי הצורך. כשבוחנים את התוכנית, כדאי לבדוק מרווחים לריהוט, את הגישה למרפסת ואת מיקום חדרי הרחצה ביחס לחדרי השינה. את השטחים המדויקים ושיוך החניה והמחסן לדירה שנבחרה עדיין יש לאמת.'] } },
 ]
}];
export const getDevelopment = (id:string) => developments.find(p=>p.id===id);

export const localizeResidence = (residence: Residence, lang: Lang): Residence => lang === 'he' ? { ...residence, ...residence.he } : residence;
export const localizeDevelopment = (project: Development, lang: Lang): Development => lang === 'he' ? { ...project, ...project.he } : project;
export const localizeImages = (images: MediaImage[], lang: Lang): MediaImage[] => lang === 'he' ? images.map(i => ({ ...i, label: i.labelHe ?? i.label })) : images;

export type ResolvedMedia = { film: { src: string; poster: string }; images: MediaImage[]; model: string; placeholder: { film: boolean; images: boolean; model: boolean } };
// The most specific media wins; `placeholder` marks what still comes from the shared set.
export function resolveMedia(project: Development, residence: Residence, apartment?: string): ResolvedMedia {
 const own = apartment ? project.apartmentMedia?.[apartment] : undefined;
 const film = own?.film ?? residence.media?.film;
 const images = own?.images?.length ? own.images : residence.media?.images;
 const model = own?.model ?? residence.media?.model;
 return {
  film: film ?? project.media.film, images: images?.length ? images : project.media.images, model: model ?? project.media.model,
  placeholder: { film: !film, images: !images?.length, model: !model },
 };
}
