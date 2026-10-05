import type { Contact, MediaImage, ModelLevel, Residence, ResolvedMedia } from './index';
import type { Lang } from '@/lib/i18n';

// N°8 KLEE, New North, Tel Aviv: three homes from projects/KLEE-8-Tel-Aviv (the apartment pipeline).
// Media: website/scripts/prepare-klee-media.py; 3D: pipeline/aptlib/blender/export_web.py.
const base = '/projects/klee-8';
const img = (apt: string, name: string, label: string, labelHe: string): MediaImage => ({ src: `${base}/media/${apt}/${name}.webp`, label, labelHe });

export type KleeHome = Residence & {
 number: string;          // 01, 02, 03 on the front page
 floorLabel: string; floorLabelHe: string;
 cover: string;           // the front page's card
 concept: string; conceptHe: string;
 media: Required<Pick<NonNullable<Residence['media']>, 'film' | 'images' | 'model'>> & { modelOrbit?: string; modelLevels?: ModelLevel[] };
};

export const kleeContact: Contact = { name: 'Natan Aharonovich', agency: 'RE/MAX Ocean', phone: '050-5413123', phoneIntl: '+972505413123', email: 'shirli@remax-ocean.com' };
export const kleeContactHe = { name: 'נתן אהרונוביץ', agency: 'RE/MAX Ocean' };

export const kleeBuilding = {
 name: 'N°8 KLEE', address: 'Klee St 8, Tel Aviv', mapQuery: 'Klee St 8, Tel Aviv-Yafo',
 en: {
  kicker: 'New North · Tel Aviv',
  title: 'A boutique building for your first, next or garden home.',
  intro: 'Nine storeys and 29 homes on a quiet, tree-lined corner of Klee Street and Namir Road, a short walk from Kikar HaMedina. Designed by Lev Zit Architects for Agam Shavit, ready in 2026.',
  facts: [{ label: 'Storeys', value: '9' }, { label: 'Homes', value: '29' }, { label: 'Move-in', value: '2026' }, { label: 'Rooms', value: '2–5' }],
  location: ['The New North is Tel Aviv at its calmest: mature ficus and jacaranda trees, 1960s blocks giving way to new boutique buildings, and cafés on every second corner.',
   'Kikar HaMedina and its shops are a few minutes away on foot; Namir Road and the Ayalon put the business towers and the trains ten minutes away.'],
  developer: 'Agam Shavit · Lev Zit Architects',
 },
 he: {
  kicker: 'הצפון החדש · תל אביב',
  title: 'בניין בוטיק לדירה הראשונה, לבאה, או לבית עם גינה.',
  intro: 'תשע קומות ו־29 דירות בפינה שקטה ומוצלת של רחוב קליי ודרך נמיר, במרחק הליכה מכיכר המדינה. תכנון: לב זית אדריכלים, ליזם עגם שביט, אכלוס ב־2026.',
  facts: [{ label: 'קומות', value: '9' }, { label: 'דירות', value: '29' }, { label: 'אכלוס', value: '2026' }, { label: 'חדרים', value: '2–5' }],
  location: ['הצפון החדש הוא תל אביב במיטבה השקטה: פיקוסים וג׳קרנדות בוגרים, בנייני שנות ה־60 שמפנים מקום לבנייני בוטיק חדשים, ובית קפה כמעט בכל פינה.',
   'כיכר המדינה והחנויות שלה במרחק דקות הליכה; דרך נמיר והאיילון מביאים את מגדלי העסקים והרכבת לעשר דקות.'],
  developer: 'עגם שביט · לב זית אדריכלים',
 },
 disclaimer: 'A demo, not an offer to sell. Interiors, films and furniture are AI-assisted illustrations; areas follow the developer’s plans and are not verified. Confirm every detail with the developer.',
 disclaimerHe: 'הדגמה בלבד ולא הצעה למכירה. העיצוב, הסרטונים והריהוט הם המחשות בסיוע בינה מלאכותית; השטחים לפי תוכניות היזם ולא אומתו. יש לאמת כל פרט מול היזם.',
};

export const kleeHomes: KleeHome[] = [
 {
  id: 'apt-1', number: '01', title: 'First Place · 2 rooms', shortTitle: 'First Place', tagline: 'A smart two-room with a 10.5 m² balcony over the trees.',
  rooms: 2, outdoor: 'Balcony', area: 35, outdoorArea: 10.5, exposure: 'East', label: 'Type B · 2 rooms', floorLabel: 'Floor 6', floorLabelHe: 'קומה 6',
  plan: `${base}/plans/apt-1.webp`, sourceUnits: 'Type B', cover: `${base}/media/apt-1/g-kitchen.webp`,
  concept: 'My first apartment: bright, cosy and made for friends on the balcony.',
  conceptHe: 'הדירה הראשונה שלי: מוארת, נעימה, ועשויה לחברים במרפסת.',
  description: 'An open living room and kitchen across the whole east façade, a 6.4 m balcony, a bedroom with built-in wardrobes and a walk-in shower bathroom.',
  about: ['The entrance opens straight into one bright room: the kitchen runs along the wall to a rounded breakfast bar, the sofa faces the 6.4-metre balcony, and the slider fills the room with morning light over Namir Road’s trees. The bedroom fits a queen bed between two wardrobe niches; the bathroom has a walk-in shower.',
   'Areas follow the developer’s Type B plan (about 35 m² inside and 10.5 m² of balcony). Worth checking: the bedroom window faces a service yard, and the furniture shown is one way to live in it.'],
  media: {
   film: { src: `${base}/media/apt-1/film.mp4`, poster: `${base}/media/apt-1/poster.webp` }, model: `${base}/models/apt-1.glb`, modelOrbit: '15deg 36deg 140%',
   images: [img('apt-1', 'g-kitchen', 'Kitchen and living', 'מטבח וסלון'), img('apt-1', 'g-living-hero', 'Living room', 'סלון'), img('apt-1', 'g-view', 'Balcony', 'מרפסת'),
    img('apt-1', 'g-bedroom', 'Bedroom', 'חדר שינה'), img('apt-1', 'top', 'The whole apartment from above', 'כל הדירה ממבט על')],
  },
  he: { title: 'First Place · 2 חדרים', shortTitle: 'First Place', tagline: 'דירת שני חדרים חכמה עם מרפסת של 10.5 מ״ר מול העצים.', outdoor: 'מרפסת', exposure: 'מזרח', label: 'טיפוס B · 2 חדרים',
   description: 'סלון ומטבח פתוחים לאורך כל החזית המזרחית, מרפסת באורך 6.4 מ׳, חדר שינה עם ארונות מובנים וחדר רחצה עם מקלחת ווק־אין.',
   about: ['הכניסה נפתחת ישר לחלל אחד מואר: המטבח לאורך הקיר עד בר ארוחת בוקר מעוגל, הספה מול המרפסת באורך 6.4 מ׳, והוויטרינה ממלאת את החדר באור בוקר מעל העצים של דרך נמיר. בחדר השינה נכנסת מיטה זוגית בין שתי נישות ארונות; בחדר הרחצה מקלחת ווק־אין.',
    'השטחים לפי תוכנית טיפוס B של היזם (כ־35 מ״ר פנים ו־10.5 מ״ר מרפסת). כדאי לבדוק: חלון חדר השינה פונה לחצר שירות, והריהוט המוצג הוא אפשרות אחת לחיות בדירה.'] },
 },
 {
  id: 'apt-2', number: '02', title: 'The Three · 3 rooms', shortTitle: 'The Three', tagline: 'Three rooms, an en-suite and an 8 m west balcony for sunsets.',
  rooms: 3, outdoor: 'Balcony', area: 68, outdoorArea: 12, exposure: 'West & east', label: 'Type C · 3 rooms', floorLabel: 'Floor 5', floorLabelHe: 'קומה 5',
  plan: `${base}/plans/apt-2.webp`, sourceUnits: 'Type C', cover: `${base}/media/apt-2/g-living-hero.webp`,
  concept: 'For a couple who hosts on Fridays and works from home on Mondays.',
  conceptHe: 'לזוג שמארח בשישי ועובד מהבית בשני.',
  description: 'Living, dining and kitchen open onto an 8.4 m west balcony; a master bedroom with en-suite, a safe room set up as a study, and a family bathroom.',
  about: ['Living, dining and kitchen share one long room along the west façade, opening onto a balcony 8.4 metres long, over the treetops of Klee Street and toward the Kikar HaMedina towers at sunset. The master bedroom has its own en-suite; the mamad (safe room) doubles as a study or guest room; a family bathroom sits off the corridor.',
   'Areas follow the developer’s Type C plan (about 68 m² inside and 12 m² of balcony). Worth checking: the mamad’s window and door rules, and the furniture clearances in the dining area.'],
  media: {
   film: { src: `${base}/media/apt-2/film.mp4`, poster: `${base}/media/apt-2/poster.webp` }, model: `${base}/models/apt-2.glb`, modelOrbit: '15deg 36deg 95%',
   images: [img('apt-2', 'g-living-hero', 'Living room', 'סלון'), img('apt-2', 'g-dining', 'Dining and kitchen', 'פינת אוכל ומטבח'), img('apt-2', 'g-view', 'West balcony at sunset', 'המרפסת המערבית בשקיעה'),
    img('apt-2', 'g-master', 'Master bedroom', 'חדר השינה הראשי'), img('apt-2', 'v-mamad', 'Study (safe room)', 'חדר עבודה (ממ״ד)'), img('apt-2', 'v-ensuite', 'En-suite', 'חדר רחצה צמוד'),
    img('apt-2', 'top', 'The whole apartment from above', 'כל הדירה ממבט על')],
  },
  he: { title: 'The Three · 3 חדרים', shortTitle: 'The Three', tagline: 'שלושה חדרים, יחידת הורים ומרפסת מערבית של 8 מ׳ לשקיעות.', outdoor: 'מרפסת', exposure: 'מערב ומזרח', label: 'טיפוס C · 3 חדרים',
   description: 'סלון, פינת אוכל ומטבח נפתחים למרפסת מערבית באורך 8.4 מ׳; חדר שינה ראשי עם חדר רחצה צמוד, ממ״ד שמשמש כחדר עבודה, וחדר רחצה משפחתי.',
   about: ['הסלון, פינת האוכל והמטבח חולקים חלל ארוך אחד לאורך החזית המערבית, ונפתחים למרפסת באורך 8.4 מ׳ מעל צמרות העצים של רחוב קליי ואל מגדלי כיכר המדינה בשקיעה. לחדר השינה הראשי חדר רחצה משלו; הממ״ד משמש כחדר עבודה או אורחים; חדר רחצה משפחתי יוצא מהמסדרון.',
    'השטחים לפי תוכנית טיפוס C של היזם (כ־68 מ״ר פנים ו־12 מ״ר מרפסת). כדאי לבדוק: את כללי החלון והדלת בממ״ד, ואת המרווחים לריהוט בפינת האוכל.'] },
 },
 {
  id: 'apt-3', number: '03', title: 'Garden House · 5-room duplex', shortTitle: 'Garden House', tagline: 'A duplex with its own garden: the city upstairs, a secret garden below.',
  rooms: 5, outdoor: 'Garden & balcony', area: 105, outdoorArea: 30, exposure: 'East & south', label: 'Garden duplex · 5 rooms', floorLabel: 'Ground + 1', floorLabelHe: 'קרקע + 1',
  plan: `${base}/plans/apt-3.webp`, sourceUnits: 'Garden duplex', cover: `${base}/media/apt-3/g-garden.webp`,
  concept: 'A house in the city: upstairs the street trees, downstairs a private garden.',
  conceptHe: 'בית בעיר: למעלה צמרות הרחוב, למטה גינה פרטית.',
  description: 'The entry floor holds the living room, kitchen, dining, balcony, kids’ room and safe room; a U-stair leads down to the master suite and its private garden.',
  about: ['Upstairs, the living room, kitchen and dining area open east onto a balcony over the street trees, with a kids’ room, a mamad (safe room) used as a study, and a family bathroom. A two-flight stair drops to the garden floor: a master bedroom with an en-suite and walk-in wardrobe, a laundry room, and a glass door straight onto the private garden.',
   'About 105 m² over two floors, an 11 m² balcony and a garden of about 19 m², traced from the developer’s plans; ask the sales office for the listed figures. Worth checking: the garden’s exact size and the stair headroom.'],
  media: {
   film: { src: `${base}/media/apt-3/film.mp4`, poster: `${base}/media/apt-3/poster.webp` }, model: `${base}/models/apt-3.glb`, modelOrbit: '0deg 34deg 95%',
   modelLevels: [
    { id: 'both', label: 'Both floors', labelHe: 'שתי הקומות', src: `${base}/models/apt-3.glb` },
    { id: 'entry', label: 'Entry floor', labelHe: 'קומת הכניסה', src: `${base}/models/apt-3-1.glb` },
    { id: 'garden', label: 'Garden floor', labelHe: 'קומת הגן', src: `${base}/models/apt-3-2.glb` },
   ],
   images: [img('apt-3', 'g-garden', 'Private garden', 'הגינה הפרטית'), img('apt-3', 'g-living', 'Living room', 'סלון'), img('apt-3', 'g-kitchen', 'Kitchen and dining', 'מטבח ופינת אוכל'),
    img('apt-3', 'g-stair', 'The stair to the garden floor', 'המדרגות לקומת הגן'), img('apt-3', 'g-master', 'Master bedroom', 'חדר השינה הראשי'), img('apt-3', 'g-mamad', 'Study (safe room)', 'חדר עבודה (ממ״ד)'),
    img('apt-3', 'g-ensuite', 'En-suite', 'חדר רחצה צמוד'), img('apt-3', 'g-bath', 'Family bathroom', 'חדר רחצה משפחתי'), img('apt-3', 'top', 'Both floors from above', 'שתי הקומות ממבט על')],
  },
  he: { title: 'Garden House · דופלקס 5 חדרים', shortTitle: 'Garden House', tagline: 'דופלקס עם גינה משלו: העיר למעלה, גינה סודית למטה.', outdoor: 'גינה ומרפסת', exposure: 'מזרח ודרום', label: 'דופלקס גן · 5 חדרים',
   description: 'בקומת הכניסה הסלון, המטבח, פינת האוכל, המרפסת, חדר הילדים והממ״ד; מדרגות U יורדות לסוויטת ההורים ולגינה הפרטית.',
   about: ['למעלה, הסלון, המטבח ופינת האוכל נפתחים מזרחה למרפסת מעל עצי הרחוב, עם חדר ילדים, ממ״ד שמשמש כחדר עבודה וחדר רחצה משפחתי. מדרגות בשני מהלכים יורדות לקומת הגן: חדר שינה ראשי עם חדר רחצה צמוד וחדר ארונות, חדר כביסה, ודלת זכוכית ישר אל הגינה הפרטית.',
    'כ־105 מ״ר בשתי קומות, מרפסת של 11 מ״ר וגינה של כ־19 מ״ר, לפי מדידה מתוכניות היזם; את הנתונים הרשמיים יש לקבל ממשרד המכירות. כדאי לבדוק: את גודל הגינה המדויק ואת גובה המעבר במדרגות.'] },
 },
];

export const getKleeHome = (id: string) => kleeHomes.find(h => h.id === id);

export const kleeMedia = (home: KleeHome, lang: Lang): ResolvedMedia => ({
 film: home.media.film, model: home.media.model, modelOrbit: home.media.modelOrbit,
 images: home.media.images.map(i => ({ ...i, label: lang === 'he' ? i.labelHe ?? i.label : i.label })),
 modelLevels: home.media.modelLevels?.map(l => ({ ...l, label: lang === 'he' ? l.labelHe ?? l.label : l.label })),
 placeholder: { film: false, images: false, model: false },
});
