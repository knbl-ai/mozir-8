import { frontViewMedia } from './front-view-media';
import { rearViewMedia } from './rear-view-media';
import { gardenMedia } from './garden-media';
import type { Lang } from '@/lib/i18n';
export type MediaImage = { src: string; label: string; labelHe?: string };
// Everything a buyer can look at for one home. Any field left out falls back a level:
// apartment → residence type → the project's shared (placeholder) set.
export type ResidenceMedia = { film?: { src: string; poster: string }; images?: MediaImage[]; model?: string; modelOrbit?: string };
export type Residence = { id: string; title: string; shortTitle: string; tagline: string; rooms: number; outdoor: string;
 // The developer's listed m² (the private storage room is included in it) and the listed garden or balcony.
 area: number; outdoorArea: number; exposure: string; label: string; plan: string; description: string; sourceUnits: string; about: string[]; media?: ResidenceMedia;
 he: ResidenceText };
// Every sentence a visitor reads about a residence, so a language swaps all of them at once.
export type ResidenceText = Pick<Residence, 'title' | 'shortTitle' | 'tagline' | 'outdoor' | 'exposure' | 'label' | 'description' | 'about'>;
// What the sales listing says about one home on the building. Homes the listing leaves out are not for sale.
export type Listing = { number: number; price: number };
export type Contact = { name: string; agency: string; phone: string; phoneIntl: string; email: string };
export type ProjectInfo = { address: string; area: string; kicker: string; floors: number; moveIn: string; parking: string; storage: string; intro: string; location: string[]; disclaimer: string; mapQuery: string };
export type ApartmentZone = { unit: string; apartment: string; status: 'for-sale' | 'sold'; floor: string; labelPoints: [number, number][]; points: string };
export type BuildingFrame = { src: string; hotspots: ApartmentZone[] };
export type Development = { id: string; name: string; location: string; description: string; info: ProjectInfo; contact: Contact; source: string;
 // Keyed by the facade zone id (front-06, rear-04, …): the listing is the source of truth for availability.
 listings: Record<string, Listing>;
 he: Pick<Development, 'name' | 'location' | 'description'> & { info: Omit<ProjectInfo, 'floors' | 'mapQuery'>; contact: Pick<Contact, 'name' | 'agency'> }; references: string[]; residences: Residence[]; media: Required<Pick<ResidenceMedia, 'film' | 'images' | 'model'>> & Pick<ResidenceMedia, 'modelOrbit'>; apartmentMedia?: Record<string, ResidenceMedia> };
const base = '/projects/building-preview';
const placeholderImages: MediaImage[] = [
 { src: '/media/01_living.webp', label: 'Living & dining', labelHe: 'סלון ופינת אוכל' }, { src: '/media/02_main_bedroom.webp', label: 'Main bedroom', labelHe: 'חדר השינה הראשי' },
 { src: '/media/03_ensuite.webp', label: 'En-suite bathroom', labelHe: 'חדר רחצה צמוד' }, { src: '/media/04_small_bedroom.webp', label: 'Second bedroom', labelHe: 'חדר שינה שני' },
 { src: '/media/05_large_bathroom.webp', label: 'Main bathroom', labelHe: 'חדר הרחצה הראשי' }, { src: '/media/06_kitchen.webp', label: 'Kitchen', labelHe: 'מטבח' },
 { src: '/media/07_overhead.webp', label: 'Apartment overview', labelHe: 'מבט על הדירה' }, { src: '/media/08_terrace_end.webp', label: 'Terrace', labelHe: 'מרפסת' },
];
export const developments: Development[] = [{
 id: 'building-preview', name: 'Hurgin 29', location: 'Tel Yehuda · Ramat Gan',
 description: 'Boutique living in the heart of Ramat Gan: 4- and 5-room homes and a garden apartment on Hurgin Street, Tel Yehuda.',
 source: 'https://churgin-haven.lovable.app/',
 info: {
  address: 'Hurgin 29, Ramat Gan', area: 'Tel Yehuda neighbourhood · Ramat Gan', kicker: 'Boutique living in the heart of Ramat Gan', floors: 8, moveIn: 'September 2027',
  parking: 'Standard underground space for every home', storage: 'Private storage room for every home, included in the listed area',
  intro: 'An 8-storey residential building in a sought-after part of Ramat Gan, with a choice of 4- and 5-room homes and a spacious garden apartment.',
  location: ['Hurgin 29 is in Tel Yehuda, a sought-after and renewing urban neighbourhood of Ramat Gan. A quiet residential street, close to Jerusalem Boulevard, main traffic routes and a range of community and shopping services.',
   'Schools, public gardens, shopping centres, cafés and everyday services are nearby, with easy access to central Ramat Gan, Givatayim and Tel Aviv. A location for families and anyone looking for urban quality of life without giving up a neighbourhood feel.'],
  disclaimer: 'The information is for illustration only and is not a representation or commitment. The binding details are those in the sale agreement and signed documents. Images and plans are illustrative. E&OE.',
  mapQuery: 'חורגין 29, רמת גן',
 },
 contact: { name: 'Natan Aharonovich', agency: 'RE/MAX Ocean', phone: '050-5413123', phoneIntl: '+972505413123', email: 'shirli@remax-ocean.com' },
 listings: {
  'garden-01': { number: 1, price: 4_130_000 }, 'rear-01': { number: 3, price: 2_950_000 }, 'rear-04': { number: 12, price: 3_070_000 },
  'front-06': { number: 17, price: 4_380_000 }, 'rear-06': { number: 18, price: 3_100_000 }, 'front-07': { number: 19, price: 4_380_000 }, 'rear-07': { number: 20, price: 3_130_000 },
 },
 he: {
  name: 'חורגין 29', location: 'תל יהודה · רמת גן', description: 'מגורי בוטיק בלב רמת גן: דירות 4 ו־5 חדרים ודירת גן ברחוב חורגין, שכונת תל יהודה.',
  info: {
   address: 'חורגין 29, רמת גן', area: 'שכונת תל יהודה · רמת גן', kicker: 'מגורי בוטיק בלב רמת גן', moveIn: 'ספטמבר 2027',
   parking: 'חניה תת קרקעית רגילה לכל דירה', storage: 'מחסן דירתי לכל דירה, כלול בשטח המצוין',
   intro: 'פרויקט מגורים בן 8 קומות, במיקום עירוני מבוקש ברמת גן, עם מגוון דירות 4 ו־5 חדרים ודירת גן מרווחת.',
   location: ['פרויקט חורגין 29 ממוקם בשכונת תל יהודה ברמת גן, בסביבה עירונית מבוקשת ומתחדשת. המיקום מציע שילוב מדויק בין רחוב מגורים נעים לבין קרבה לשדרות ירושלים, לצירי תנועה מרכזיים ולמגוון שירותים קהילתיים ומסחריים.',
    'בסביבה נמצאים מוסדות חינוך, גינות ציבוריות, מרכזי קניות, בתי קפה ושירותים יומיומיים, לצד נגישות נוחה למרכז רמת גן, לגבעתיים ולתל אביב. זהו מיקום שמתאים למשפחות ולמי שמחפש איכות חיים עירונית, נוחות ונגישות, בלי לוותר על תחושת שכונה.'],
   disclaimer: 'המידע באתר נועד להמחשה בלבד ואינו מהווה מצג או התחייבות. הנתונים המחייבים יהיו אלה שיופיעו בהסכם המכר ובמסמכים החתומים. התמונות והתוכניות הן להמחשה בלבד. ט.ל.ח.',
  },
  contact: { name: 'נתן אהרונוביץ', agency: 'RE/MAX Ocean' },
 },
 references: [`${base}/building/exterior-front.jpg`, `${base}/building/exterior-rear.jpg`],
 media: { film: { src: '/media/residence-film.mp4', poster: '/media/01_living.webp' }, images: placeholderImages, model: '/models/apartment.glb' },
 residences: [
 { id:'garden', media: gardenMedia, title:'The Garden Residence', shortTitle:'Garden residence', tagline:'4 rooms on the ground floor, 90 m² garden.', rooms:4, outdoor:'Garden', area:89, outdoorArea:90, exposure:'North, east & west', label:'A private outdoor life', plan:`${base}/plans/garden.jpg`, sourceUnits:'01', description:'A four-room garden apartment opening onto a generous private garden, with living and dining at its heart.',
  about:['This ground-floor, four-room garden apartment opens onto a 90 m² private garden, with the living and dining areas at the centre of the home. The outdoor space is the main difference from the upper-floor layouts and is worth reviewing alongside the indoor furniture arrangement.','The home is 89 m², including its private storage room, and faces north, east and west. It comes with a standard underground parking space.','Check the route between the living area and garden, the boundary and privacy arrangements, and how the outdoor space can be accessed and maintained.'],
  he: { title: 'דירת הגן', shortTitle: 'דירת הגן', tagline: '4 חדרים בקומת הקרקע, גינה של 90 מ״ר.', outdoor: 'גינה', exposure: 'צפון, מזרח ומערב', label: 'חיים פרטיים בחוץ', description: 'דירת גן בת ארבעה חדרים עם יציאה לגינה פרטית ונדיבה, והסלון ופינת האוכל בלב הבית.',
   about: ['דירת גן בת ארבעה חדרים בקומת הקרקע, עם יציאה לגינה פרטית של 90 מ״ר, והסלון ופינת האוכל במרכז הבית. השטח הפתוח הוא ההבדל העיקרי מהדירות בקומות העליונות, וכדאי לבחון אותו יחד עם סידור הריהוט בפנים.','שטח הדירה 89 מ״ר, כולל מחסן דירתי, עם כיווני אוויר צפון, מזרח ומערב. לדירה חניה תת קרקעית רגילה.','כדאי לבדוק את המעבר בין הסלון לגינה, את הגבולות והפרטיות, ואת הגישה לשטח החוץ ותחזוקתו.'] } },
 { id:'four-room', media: rearViewMedia, title:'Rear View Residence', shortTitle:'Rear residence', tagline:'4 rooms, 8 m² balcony and a storage room.', rooms:4, outdoor:'Balcony', area:84, outdoorArea:8, exposure:'North, east & west', label:'Room to breathe', plan:`${base}/plans/four-room.jpg`, sourceUnits:'03, 06, 09, 12, 15, 18, 20', description:'A four-room layout with a living-room balcony, three bedrooms and a private storage room.',
  about:['This four-room layout includes three bedrooms, a living area with a balcony, and a private storage room. Living, dining and kitchen functions share the main communal space; the plan shows the bedroom arrangement and circulation around it.','The home is 84 m², including its private storage room, with an 8 m² balcony off the living room. It faces north, east and west and comes with a standard underground parking space.','Use the plan to check bed and wardrobe placement and whether the storage room meets your needs.'],
  he: { title: 'דירת העורף', shortTitle: 'דירת העורף', tagline: '4 חדרים, מרפסת 8 מ״ר ומחסן דירתי.', outdoor: 'מרפסת', exposure: 'צפון, מזרח ומערב', label: 'מקום לנשום', description: 'דירת ארבעה חדרים עם מרפסת מהסלון, שלושה חדרי שינה ומחסן דירתי.',
   about: ['דירת ארבעה חדרים עם שלושה חדרי שינה, סלון עם מרפסת ומחסן דירתי. הסלון, פינת האוכל והמטבח חולקים את המרחב המשותף המרכזי; התוכנית מראה את סידור חדרי השינה ואת המעברים סביבם.','שטח הדירה 84 מ״ר, כולל מחסן דירתי, ומהסלון יוצאת מרפסת של 8 מ״ר. כיווני האוויר צפון, מזרח ומערב, ולדירה חניה תת קרקעית רגילה.','בעזרת התוכנית אפשר לבדוק את מיקום המיטות והארונות, והאם המחסן מתאים לצרכים שלכם.'] } },
 { id:'five-room', media: frontViewMedia, title:'Front View Residence', shortTitle:'Front residence', tagline:'5 rooms, 2 bathrooms, 16 m² balcony.', rooms:5, outdoor:'Balcony', area:125, outdoorArea:16, exposure:'South, east & west', label:'Space for more', plan:`${base}/plans/five-room.jpg`, sourceUnits:'17, 19', description:'A five-room layout with a long balcony, four bedrooms and two bathrooms.',
  about:['This five-room layout has four bedrooms and a shared living, dining and kitchen area. The long balcony runs alongside the main living space. With two bathrooms, the layout provides separate facilities for a household using several bedrooms.','The home is 125 m², including its private storage room, with a 16 m² balcony along the living room. It faces south, east and west and comes with a standard underground parking space.','One bedroom could serve as a home office or guest room, depending on your needs. When reviewing the plan, check furniture clearances, access to the balcony and the position of each bathroom relative to the bedrooms.'],
  he: { title: 'דירת החזית', shortTitle: 'דירת החזית', tagline: '5 חדרים, 2 חדרי רחצה, מרפסת 16 מ״ר.', outdoor: 'מרפסת', exposure: 'דרום, מזרח ומערב', label: 'מקום לעוד', description: 'דירת חמישה חדרים עם מרפסת ארוכה, ארבעה חדרי שינה ושני חדרי רחצה.',
   about: ['דירת חמישה חדרים עם ארבעה חדרי שינה ומרחב משותף של סלון, פינת אוכל ומטבח. המרפסת הארוכה נמתחת לאורך הסלון, ושני חדרי הרחצה נותנים מענה נפרד למשפחה שמשתמשת בכמה חדרי שינה.','שטח הדירה 125 מ״ר, כולל מחסן דירתי, והמרפסת שלאורך הסלון משתרעת על 16 מ״ר. כיווני האוויר דרום, מזרח ומערב, ולדירה חניה תת קרקעית רגילה.','אחד מחדרי השינה יכול לשמש חדר עבודה או חדר אורחים, לפי הצורך. כשבוחנים את התוכנית, כדאי לבדוק מרווחים לריהוט, את הגישה למרפסת ואת מיקום חדרי הרחצה ביחס לחדרי השינה.'] } },
 ]
}];
export const getDevelopment = (id:string) => developments.find(p=>p.id===id);

export const localizeResidence = (residence: Residence, lang: Lang): Residence => lang === 'he' ? { ...residence, ...residence.he } : residence;
export const localizeDevelopment = (project: Development, lang: Lang): Development => lang === 'he'
 ? { ...project, ...project.he, info: { ...project.info, ...project.he.info }, contact: { ...project.contact, ...project.he.contact } } : project;

// The listing decides what is for sale; frames.json only carries the facade geometry.
export const applyListings = (frames: BuildingFrame[], project: Development): BuildingFrame[] =>
 frames.map(f => ({ ...f, hotspots: f.hotspots.map(h => ({ ...h, status: project.listings[h.apartment] ? 'for-sale' : 'sold' })) }));
export const localizeImages = (images: MediaImage[], lang: Lang): MediaImage[] => lang === 'he' ? images.map(i => ({ ...i, label: i.labelHe ?? i.label })) : images;

export type ResolvedMedia = { film: { src: string; poster: string }; images: MediaImage[]; model: string; modelOrbit?: string; placeholder: { film: boolean; images: boolean; model: boolean } };
// The most specific media wins; `placeholder` marks what still comes from the shared set.
export function resolveMedia(project: Development, residence: Residence, apartment?: string): ResolvedMedia {
 const own = apartment ? project.apartmentMedia?.[apartment] : undefined;
 const film = own?.film ?? residence.media?.film;
 const images = own?.images?.length ? own.images : residence.media?.images;
 const model = own?.model ?? residence.media?.model;
 return {
  film: film ?? project.media.film, images: images?.length ? images : project.media.images, model: model ?? project.media.model,
  modelOrbit: own?.model ? own.modelOrbit : residence.media?.model ? residence.media.modelOrbit : project.media.modelOrbit,
  placeholder: { film: !film, images: !images?.length, model: !model },
 };
}
