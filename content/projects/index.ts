import { frontViewMedia } from './front-view-media';
import { rearViewMedia } from './rear-view-media';
import { gardenMedia } from './garden-media';
import type { Lang } from '@/lib/i18n';
export type MediaImage = { src: string; label: string; labelHe?: string; labelPt?: string };
// Everything a buyer can look at for one home. Any field left out falls back a level:
// apartment → residence type → the project's shared (placeholder) set.
// A home over several floors: one model per view (both floors, then each floor), switched in the 3D tab.
export type ModelLevel = { id: string; label: string; labelHe?: string; labelPt?: string; src: string };
export type ResidenceMedia = { film?: { src: string; poster: string; note?: string; noteHe?: string; notePt?: string }; images?: MediaImage[]; model?: string; modelOrbit?: string; modelLevels?: ModelLevel[] };
export type Residence = { id: string; title: string; shortTitle: string; tagline: string; rooms: number; outdoor: string;
 // The developer's listed m² (the private storage room is included in it) and the listed garden or balcony.
 area: number; outdoorArea: number; exposure: string; label: string; plan: string; description: string; sourceUnits: string; about: string[]; media?: ResidenceMedia;
 // The second language's text: Hebrew on the Israeli projects, Portuguese on the Lisbon one (lib/i18n LANG_PAGES).
 he?: ResidenceText; pt?: ResidenceText };
// Every sentence a visitor reads about a residence, so a language swaps all of them at once.
export type ResidenceText = Pick<Residence, 'title' | 'shortTitle' | 'tagline' | 'outdoor' | 'exposure' | 'label' | 'description' | 'about'>;
// What the sales listing says about one home on the building. Homes the listing leaves out are not for sale.
// A listing without a number or price still marks the home for sale; the price then reads "on request".
export type Listing = { number?: number; price?: number };
// `role` replaces "Sales agent" (e.g. a project sales line); WhatsApp and email show only when usable.
export type Contact = { name: string; agency: string; phone: string; phoneIntl: string; email?: string; role?: string; whatsapp?: boolean };
// Facts a project hasn't published (floors, move-in, parking, storage) are left out rather than guessed.
export type ProjectInfo = { address: string; area: string; kicker: string; floors?: number; moveIn?: string; parking?: string; storage?: string; intro: string; location: string[]; disclaimer: string; mapQuery: string };
// Per-project look: the header logo and a colour theme (a [data-theme] block in explorer.module.css).
// `wordmark`: the campaign lettering, shown in the header's centre when there are no apartment-type tabs.
export type Brand = { logo: string; logoWidth: number; logoHeight: number; theme?: string; headerTone?: 'light' | 'dark'; wordmark?: { src: string; width: number; height: number; alt: string }; directoryNote?: string; directoryNoteHe?: string; directoryNotePt?: string };
// `floorLabel`: what the facts show for the floor when it isn't one number (a duplex: '3–4').
export type ApartmentZone = { unit: string; apartment: string; status: 'for-sale' | 'sold'; floor: string; floorLabel?: string; labelPoints: [number, number][]; points: string };
export type BuildingFrame = { src: string; hotspots: ApartmentZone[] };
export type DevelopmentText = Pick<Development, 'name' | 'location' | 'description'> & { info: Omit<ProjectInfo, 'floors' | 'mapQuery'>; contact: Pick<Contact, 'name' | 'agency' | 'role'> };
export type Development = { id: string; name: string; location: string; description: string; info: ProjectInfo; contact: Contact; source: string; brand?: Brand;
 // Apartment-type tabs in the header, by residence id; one type or fewer hides them. Defaults to the Sales Gallery's four.
 views?: string[];
 // 'legend': the chosen home is outlined on the building only while "For sale" is switched on (else on hover).
 // Default 'always' keeps the chosen home outlined whatever the legend says.
 selectionHighlight?: 'always' | 'legend';
 // No building model yet (runbook §11, P1–P5): the page opens straight on the apartment view, and the homes
 // come from `units` instead of the facade hotspots in building/frames.json.
 building?: false;
 units?: { unit: string; apartment: string; floor: string; floorLabel?: string }[];
 // Shown before prices; the Sales Gallery default is ₪.
 currency?: string;
 // Keyed by the facade zone id (front-06, rear-04, …): the listing is the source of truth for availability.
 listings: Record<string, Listing>;
 he?: DevelopmentText; pt?: DevelopmentText; references: string[]; residences: Residence[]; media: Required<Pick<ResidenceMedia, 'film' | 'images' | 'model'>> & Pick<ResidenceMedia, 'modelOrbit'>; apartmentMedia?: Record<string, ResidenceMedia> };
const base = '/projects/building-preview';
const afk = '/projects/afk-urban-comfort';
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
 { id:'garden', media: gardenMedia, title:'Garden apartment', shortTitle:'Garden apartment', tagline:'4 rooms on the ground floor, 90 m² garden.', rooms:4, outdoor:'Garden', area:89, outdoorArea:90, exposure:'North, east & west', label:'A private outdoor life', plan:`${base}/plans/garden.jpg`, sourceUnits:'01', description:'A four-room garden apartment opening onto a generous private garden, with living and dining at its heart.',
  about:['This ground-floor, four-room garden apartment opens onto a 90 m² private garden, with the living and dining areas at the centre of the home. The outdoor space is the main difference from the upper-floor layouts and is worth reviewing alongside the indoor furniture arrangement.','Check the route between the living area and garden, the boundary and privacy arrangements, and how the outdoor space can be accessed and maintained.'],
  he: { title: 'דירת גן', shortTitle: 'דירת גן', tagline: '4 חדרים בקומת הקרקע, גינה של 90 מ״ר.', outdoor: 'גינה', exposure: 'צפון, מזרח ומערב', label: 'חיים פרטיים בחוץ', description: 'דירת גן בת ארבעה חדרים עם יציאה לגינה פרטית ונדיבה, והסלון ופינת האוכל בלב הבית.',
   about: ['דירת גן בת ארבעה חדרים בקומת הקרקע, עם יציאה לגינה פרטית של 90 מ״ר, והסלון ופינת האוכל במרכז הבית. השטח הפתוח הוא ההבדל העיקרי מהדירות בקומות העליונות, וכדאי לבחון אותו יחד עם סידור הריהוט בפנים.','כדאי לבדוק את המעבר בין הסלון לגינה, את הגבולות והפרטיות, ואת הגישה לשטח החוץ ותחזוקתו.'] } },
 { id:'four-room', media: rearViewMedia, title:'4-room apartment', shortTitle:'4-room apartment', tagline:'4 rooms, 8 m² balcony and a storage room.', rooms:4, outdoor:'Balcony', area:84, outdoorArea:8, exposure:'North, east & west', label:'Room to breathe', plan:`${base}/plans/four-room.jpg`, sourceUnits:'03, 06, 09, 12, 15, 18, 20', description:'A four-room layout with a living-room balcony, three bedrooms and a private storage room.',
  about:['This four-room layout includes three bedrooms, a living area with a balcony, and a private storage room. Living, dining and kitchen functions share the main communal space; the plan shows the bedroom arrangement and circulation around it.','Use the plan to check bed and wardrobe placement and whether the storage room meets your needs.'],
  he: { title: 'דירת 4 חדרים', shortTitle: 'דירת 4 חדרים', tagline: '4 חדרים, מרפסת 8 מ״ר ומחסן דירתי.', outdoor: 'מרפסת', exposure: 'צפון, מזרח ומערב', label: 'מקום לנשום', description: 'דירת ארבעה חדרים עם מרפסת מהסלון, שלושה חדרי שינה ומחסן דירתי.',
   about: ['דירת ארבעה חדרים עם שלושה חדרי שינה, סלון עם מרפסת ומחסן דירתי. הסלון, פינת האוכל והמטבח חולקים את המרחב המשותף המרכזי; התוכנית מראה את סידור חדרי השינה ואת המעברים סביבם.','בעזרת התוכנית אפשר לבדוק את מיקום המיטות והארונות, והאם המחסן מתאים לצרכים שלכם.'] } },
 { id:'five-room', media: frontViewMedia, title:'5-room apartment', shortTitle:'5-room apartment', tagline:'5 rooms, 2 bathrooms, 16 m² balcony.', rooms:5, outdoor:'Balcony', area:125, outdoorArea:16, exposure:'South, east & west', label:'Space for more', plan:`${base}/plans/five-room.jpg`, sourceUnits:'17, 19', description:'A five-room layout with a long balcony, four bedrooms and two bathrooms.',
  about:['This five-room layout has four bedrooms and a shared living, dining and kitchen area. The long balcony runs alongside the main living space. With two bathrooms, the layout provides separate facilities for a household using several bedrooms.','One bedroom could serve as a home office or guest room, depending on your needs. When reviewing the plan, check furniture clearances, access to the balcony and the position of each bathroom relative to the bedrooms.'],
  he: { title: 'דירת 5 חדרים', shortTitle: 'דירת 5 חדרים', tagline: '5 חדרים, 2 חדרי רחצה, מרפסת 16 מ״ר.', outdoor: 'מרפסת', exposure: 'דרום, מזרח ומערב', label: 'מקום לעוד', description: 'דירת חמישה חדרים עם מרפסת ארוכה, ארבעה חדרי שינה ושני חדרי רחצה.',
   about: ['דירת חמישה חדרים עם ארבעה חדרי שינה ומרחב משותף של סלון, פינת אוכל ומטבח. המרפסת הארוכה נמתחת לאורך הסלון, ושני חדרי הרחצה נותנים מענה נפרד למשפחה שמשתמשת בכמה חדרי שינה.','אחד מחדרי השינה יכול לשמש חדר עבודה או חדר אורחים, לפי הצורך. כשבוחנים את התוכנית, כדאי לבדוק מרווחים לריהוט, את הגישה למרפסת ואת מיקום חדרי הרחצה ביחס לחדרי השינה.'] } },
 // Floors 1–5 split their front between two homes. The listing has none of them and no plan was
 // supplied, so this type carries no figures: it is shown on the building and in the picker, sold.
 { id:'compact', title:'Compact apartment', shortTitle:'Compact apartment', tagline:'Front of floors 1–5, not in the current listing.', rooms:0, outdoor:'', area:0, outdoorArea:0, exposure:'', label:'', plan:'', sourceUnits:'', description:'One of two front homes on each of floors 1–5.',
  about:[],
  he: { title: 'דירה קומפקטית', shortTitle: 'דירה קומפקטית', tagline: 'חזית קומות 1–5, לא במלאי הנוכחי.', outdoor: '', exposure: '', label: '', description: 'אחת משתי דירות החזית בכל אחת מקומות 1–5.', about: [] } },
 ]
}];
// A.f.k · Urban Comfort, Building 1: one home on show, the A-P1 penthouse. The building is a study model built
// from the marketing renders and the apartment plan; nothing the developer hasn't published is stated.
const afkImages: MediaImage[] = [
 { src: `${afk}/media/apartment-v1/01-living.webp`, label: 'Living room', labelHe: 'סלון' },
 { src: `${afk}/media/apartment-v1/02-kitchen.webp`, label: 'Kitchen', labelHe: 'מטבח' },
 { src: `${afk}/media/apartment-v1/03-terrace.webp`, label: 'Main terrace', labelHe: 'המרפסת הראשית' },
 { src: `${afk}/media/apartment-v1/04-spa.webp`, label: 'Corner spa', labelHe: 'פינת הג׳קוזי' },
 { src: `${afk}/media/apartment-v1/05-corridor.webp`, label: 'Private corridor', labelHe: 'מסדרון חדרי השינה' },
 { src: `${afk}/media/apartment-v1/06-master.webp`, label: 'Master bedroom', labelHe: 'חדר השינה הראשי' },
 { src: `${afk}/media/apartment-v1/07-ensuite.webp`, label: 'Master ensuite', labelHe: 'חדר הרחצה של סוויטת ההורים' },
 { src: `${afk}/media/apartment-v1/08-bedroom.webp`, label: 'Bedroom', labelHe: 'חדר שינה' },
 { src: `${afk}/media/apartment-v1/09-office.webp`, label: 'Home office', labelHe: 'חדר עבודה' },
 { src: `${afk}/media/apartment-v1/10-protected-bedroom.webp`, label: 'Protected bedroom', labelHe: 'חדר שינה בממ״ד' },
 { src: `${afk}/media/apartment-v1/11-bathroom.webp`, label: 'Family bathroom', labelHe: 'חדר הרחצה המשפחתי' },
 { src: `${afk}/media/apartment-v1/12-laundry.webp`, label: 'Laundry', labelHe: 'חדר כביסה' },
 { src: `${afk}/media/apartment-v1/13-small-terrace.webp`, label: 'Small terrace', labelHe: 'המרפסת הקטנה' },
 { src: `${afk}/media/apartment-v1/14-top-down.webp`, label: 'Complete apartment · top view', labelHe: 'הדירה כולה · מבט על' },
];
developments.push({
 id: 'afk-urban-comfort', name: 'A.f.k Urban Comfort', location: 'Neot Afeka · Tel Aviv',
 description: 'The A-P1 penthouse in Building 1 of A.f.k, Neot Afeka: five rooms on the top floor, wrapped by an L-shaped terrace.',
 source: '',
 brand: { logo: `${afk}/building/afk-logo-raspberry.png`, logoWidth: 71, logoHeight: 34, theme: 'afk', headerTone: 'dark', wordmark: { src: `${afk}/building/urban-comfort-wordmark.png`, width: 1006, height: 78, alt: 'Urban Comfort' },
  directoryNote: 'Penthouse explorer · Building 1 · Preview', directoryNoteHe: 'סיור בפנטהאוז · בניין 1 · תצוגה מקדימה' },
 views: ['a-p1'],
 selectionHighlight: 'legend',
 info: {
  address: 'A.f.k · Building 1', area: 'Neot Afeka · Tel Aviv', kicker: 'Urban comfort in Neot Afeka',
  intro: 'Building 1 of A.f.k, by Shikun & Binui Nadlan and Metropolis. Its top floor holds A-P1, a five-room penthouse set back behind a long L-shaped terrace, with a second terrace off the kitchen and preparation for a jacuzzi.',
  location: ['Neot Afeka is a residential neighbourhood in north Tel Aviv. The project’s plot lies between Avraham Shlonsky Street and Kehilat Padova Street, beside Kehilat Venezia Street.',
   'The building on this page is a study model made from the developer’s renders and the A-P1 plan, to show where the penthouse sits. The courtyard facades, the landscaping and the exact number of floors are illustrative.'],
  disclaimer: 'For illustration only; not a representation or commitment. The developer’s visualisations are marked as such, the 3D building and apartment are study models, the architect’s-view images are AI-generated illustrations of that model, and areas are estimates from the plan’s dimensions. Binding details are those in the sale agreement. E&OE.',
  mapQuery: 'קהילת פדובה, תל אביב',
 },
 contact: { name: 'A.f.k Sales', agency: 'Shikun & Binui · Metropolis', phone: '*6766', phoneIntl: '*6766', role: 'Project sales line', whatsapp: false },
 listings: { 'b1-ap1': {} },
 he: {
  name: 'A.f.k אורבן קומפורט', location: 'נאות אפקה · תל אביב', description: 'פנטהאוז A-P1 בבניין 1 בפרויקט A.f.k, נאות אפקה: חמישה חדרים בקומה העליונה, עם מרפסת גדולה בצורת L.',
  info: {
   address: 'A.f.k · בניין 1', area: 'נאות אפקה · תל אביב', kicker: 'איכות חיים עירונית בנאות אפקה',
   intro: 'בניין 1 בפרויקט A.f.k של שיכון ובינוי נדל״ן ומטרופוליס. בקומה העליונה נמצא A-P1, פנטהאוז בן חמישה חדרים הנסוג מאחורי מרפסת ארוכה בצורת L, עם מרפסת נוספת ליד המטבח והכנה לג׳קוזי.',
   location: ['נאות אפקה היא שכונת מגורים בצפון תל אביב. המגרש של הפרויקט נמצא בין רחוב אברהם שלונסקי לרחוב קהילת פדובה, לצד רחוב קהילת ונציה.',
    'הבניין בעמוד זה הוא מודל עבודה שנבנה מהדמיות היזם ומתוכנית A-P1, כדי להראות היכן נמצא הפנטהאוז. חזיתות החצר, הפיתוח הסביבתי ומספר הקומות המדויק הם להמחשה בלבד.'],
   disclaimer: 'להמחשה בלבד; אינו מהווה מצג או התחייבות. הדמיות היזם מסומנות ככאלה, הבניין והדירה בתלת־ממד הם מודלי עבודה, תמונות המבט האדריכלי הן המחשות שנוצרו בבינה מלאכותית מתוך המודל, והשטחים הם הערכה לפי מידות התוכנית. הנתונים המחייבים הם אלה שבהסכם המכר. ט.ל.ח.',
  },
  contact: { name: 'מכירות A.f.k', agency: 'שיכון ובינוי · מטרופוליס', role: 'קו המכירות של הפרויקט' },
 },
 // Architect's view: AI-generated stills of the study model (gpt-image-2.5, from our orbit render + the developer's style).
 references: [`${afk}/building/architect-front.jpg`, `${afk}/building/architect-rear.jpg`],
 media: { film: { src: '/media/residence-film.mp4', poster: '/media/01_living.webp' }, images: afkImages, model: `${afk}/models/a-p1.glb` },
 apartmentMedia: { 'b1-ap1': { film: { src: `${afk}/media/a-p1-film-1080-v2.mp4`, poster: `${afk}/media/apartment-v1/01-living.webp` }, images: afkImages, model: `${afk}/models/a-p1.glb`, modelOrbit: '0deg 55deg 62%' } },
 residences: [
  { id: 'a-p1', title: 'Penthouse A-P1', shortTitle: 'Penthouse A-P1', tagline: '5 rooms on the top floor, L-shaped terrace with jacuzzi preparation.', rooms: 5, outdoor: 'Terraces',
   area: 120, outdoorArea: 90, exposure: 'South, west & east', label: 'Life on the top floor', plan: `${afk}/plans/a-p1.jpg`, sourceUnits: 'Building 1 · type A-P1',
   description: 'A five-room penthouse: living, dining and kitchen open onto a 21-metre terrace that turns the corner to a jacuzzi deck, with four bedrooms including the Mamad and a master suite.',
   about: ['The living room, dining area and kitchen form one space along the south facade, opening onto a terrace about 21 m long that wraps round to the west, where the plan prepares for a jacuzzi. A second, smaller terrace opens off the kitchen. The bedroom wing holds three bedrooms, the Mamad (safe room) that doubles as a fourth, a family bathroom, a guest WC, a laundry room and the master suite with its own bathroom and dressing area.',
    'Areas here are estimates from the plan’s dimensions (about 120 m² inside, about 90 m² of terraces); ask the sales office for the listed figures. Worth checking: the pergola extent over the terrace, the jacuzzi preparation, and furniture clearances in the bedrooms.'],
   he: { title: 'פנטהאוז A-P1', shortTitle: 'פנטהאוז A-P1', tagline: '5 חדרים בקומה העליונה, מרפסת L עם הכנה לג׳קוזי.', outdoor: 'מרפסות', exposure: 'דרום, מערב ומזרח', label: 'חיים בקומה העליונה',
    description: 'פנטהאוז בן חמישה חדרים: הסלון, פינת האוכל והמטבח נפתחים למרפסת באורך 21 מטר שפונה סביב הפינה אל משטח הג׳קוזי, עם ארבעה חדרי שינה כולל הממ״ד וסוויטת הורים.',
    about: ['הסלון, פינת האוכל והמטבח יוצרים חלל אחד לאורך החזית הדרומית, ונפתחים למרפסת באורך של כ־21 מ׳ הפונה מערבה, שם מתוכננת הכנה לג׳קוזי. מרפסת נוספת וקטנה יותר יוצאת מהמטבח. באגף השינה שלושה חדרי שינה, ממ״ד שמשמש כחדר רביעי, חדר רחצה משפחתי, שירותי אורחים, חדר כביסה וסוויטת הורים עם חדר רחצה וחדר ארונות.',
     'השטחים כאן הם הערכה לפי מידות התוכנית (כ־120 מ״ר פנים וכ־90 מ״ר מרפסות); את הנתונים הרשמיים יש לקבל ממשרד המכירות. כדאי לבדוק: את היקף הפרגולה מעל המרפסת, את ההכנה לג׳קוזי ואת המרווחים לריהוט בחדרי השינה.'] } },
 ],
});
export const getDevelopment = (id:string) => developments.find(p=>p.id===id);

export const localizeResidence = (residence: Residence, lang: Lang): Residence => lang === 'en' ? residence : { ...residence, ...residence[lang] };
export const localizeDevelopment = (project: Development, lang: Lang): Development => {
 const text = lang === 'en' ? undefined : project[lang];
 return text ? { ...project, ...text, info: { ...project.info, ...text.info }, contact: { ...project.contact, ...text.contact } } : project;
};

// The listing decides what is for sale; frames.json only carries the facade geometry.
export const applyListings = (frames: BuildingFrame[], project: Development): BuildingFrame[] =>
 frames.map(f => ({ ...f, hotspots: f.hotspots.map(h => ({ ...h, status: project.listings[h.apartment] ? 'for-sale' : 'sold' })) }));
// A label in the visitor's language, English when that language has none.
export const labelIn = (item: { label: string; labelHe?: string; labelPt?: string }, lang: Lang) => (lang === 'he' ? item.labelHe : lang === 'pt' ? item.labelPt : undefined) ?? item.label;
export const localizeImages = (images: MediaImage[], lang: Lang): MediaImage[] => lang === 'en' ? images : images.map(i => ({ ...i, label: labelIn(i, lang) }));

export type ResolvedMedia = { film: { src: string; poster: string; note?: string; noteHe?: string; notePt?: string }; images: MediaImage[]; model: string; modelOrbit?: string; modelLevels?: ModelLevel[]; placeholder: { film: boolean; images: boolean; model: boolean } };
// The most specific media wins; `placeholder` marks what still comes from the shared set.
export function resolveMedia(project: Development, residence: Residence, apartment?: string): ResolvedMedia {
 const own = apartment ? project.apartmentMedia?.[apartment] : undefined;
 const film = own?.film ?? residence.media?.film;
 const images = own?.images?.length ? own.images : residence.media?.images;
 const model = own?.model ?? residence.media?.model;
 return {
  film: film ?? project.media.film, images: images?.length ? images : project.media.images, model: model ?? project.media.model,
  modelOrbit: own?.model ? own.modelOrbit : residence.media?.model ? residence.media.modelOrbit : project.media.modelOrbit,
  modelLevels: own?.model ? own.modelLevels : residence.media?.model ? residence.media.modelLevels : undefined,
  placeholder: { film: !film, images: !images?.length, model: !model },
 };
}

// Borges 15, Lisbon (runbook §11): apartment-only until the building model exists.
import { borges15 } from './borges-15';
developments.push(borges15);
