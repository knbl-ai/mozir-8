// The apartment page in English and Hebrew: interface words (T) and the home's own texts (homeText). Facts and numbers
// stay in content/projects/alma-bay-home.ts; only words are here.
import { useLang, type Lang } from '@/lib/i18n';
import { HOMES } from '@/content/projects/shirat-hayam';

export type L2 = 'en' | 'he';
export const l2 = (lang: Lang): L2 => lang === 'he' ? 'he' : 'en';

export const T = {
 en: {
  nav: { films: 'Films', plan: 'Plan', model: '3D', building: 'Building', area: 'Area', contact: 'Contact' },
  download: 'Download all', downloadAria: (size: string) => `Download all media (${size}, zip)`, enquire: 'Enquire',
  tower: (t: string, f: number) => `Tower ${t} · Floor ${f}`, developedBy: 'Developed by', scroll: 'Scroll',
  facts: { aria: 'Key figures', interior: 'm² interior', inside: 'm² inside', balcony: 'm² balcony', rooms: 'rooms', floorOf: (n: number) => `floor of ${n}`, beach: 'min to the beach' },
  pointsHead: ['A five-room corner home, ', '25 floors above the cliff'],
  marks: { films: 'The films', plan: 'The plan', model: 'In three dimensions', building: 'The building', area: 'The neighbourhood', contact: 'Enquiries' },
  h2: { plan: ['Walk the plan, ', 'room by room'], model: ['Turn the home ', 'in your hand'], building: ['Two towers ', 'above the beach'], area: ['Everything ', 'on foot'] },
  sub: { model: 'Drag to turn, pinch or scroll to come closer. The model is measured from the architect’s plan and lit like the photographs.', building: 'Turn the building to see it from every side. The towers, the pool and the lobby on the right.' },
  cuts: { long: 'The film', short: 'Short cut', phone: 'Phone cut' },
  plan: {
   aria: 'Floor plan of the residence — choose a room', north: 'North is to the left', hintOn: 'Click to keep it · photos and the room’s clip on the right', hintOff: 'Move over the plan — every room opens up',
   whole: 'The whole home', wholeLine: 'Kitchen, dining and living in one long space, a balcony on the sea side, the master suite and three more rooms in the private wing.',
   wholeSpec: (rooms: string, balcony: string, aspect: string) => `${rooms} rooms · ${balcony} m² balcony · ${aspect}`,
   fromFilm: (n: string) => `${n} — from the film`, watch: 'Watch', watchAria: (n: string) => `Watch ${n}`, photoAria: (n: string) => `Photo of ${n}`,
   none: 'No photos of this room in the set yet.', all: 'All', photos: 'The photographs', back: 'Scroll back', on: 'Scroll on', openAria: (c: string) => `${c} — open`,
  },
  map: { min: 'min', walkAria: (n: string, m: number | null) => `${n}, ${m} min walk`, km: (km: string) => `${km} km on foot`, note: 'Walking routes and times are routed on OpenStreetMap from the building’s entrance.' },
  model: { walk: 'Walk inside', early: 'Early preview' },
  building: { stage: 'The building — drag to turn', canvas: 'The towers of Alma Bay, seen from all sides', yours: 'Your apartment', floor: (u: string, f: number) => `${u} · floor ${f}`, hint: 'Drag to turn the building', left: 'Turn left', right: 'Turn right', open: (c: string) => `${c} — open`, video: ' (video)' },
  contact: { yours: 'Your contact', phone: 'Phone', email: 'Email', developer: 'The developer' },
  kit: { kicker: 'Media kit', title: ['Everything on this page, ', 'in one file'], btn: 'Download all', meta: (size: string, n: number) => `zip · ${size} · ${n} files` },
  lb: { close: 'Close', prev: 'Previous', next: 'Next' },
  foot: (p: string, u: string) => `Films, plan, model and images made with residence.tech from the floor plan of ${p} · ${u}. Images are illustrative. Walking times are routed on OpenStreetMap.`,
  allResidences: (p: string) => `${p} — all residences`,
 },
 he: {
  nav: { films: 'סרטים', plan: 'תוכנית', model: 'תלת־ממד', building: 'הבניין', area: 'הסביבה', contact: 'יצירת קשר' },
  download: 'הורדת הכול', downloadAria: (size: string) => `הורדת כל המדיה (${size}, zip)`, enquire: 'לפרטים',
  tower: (t: string, f: number) => `מגדל ${t} · קומה ${f}`, developedBy: 'יזם', scroll: 'גלילה',
  facts: { aria: 'נתונים עיקריים', interior: 'מ״ר בנוי', inside: 'מ״ר פנים', balcony: 'מ״ר מרפסת', rooms: 'חדרים', floorOf: (n: number) => `קומה מתוך ${n}`, beach: 'דק׳ הליכה לים' },
  pointsHead: ['דירת פינה בת חמישה חדרים, ', '25 קומות מעל המצוק'],
  marks: { films: 'הסרטים', plan: 'התוכנית', model: 'בתלת־ממד', building: 'הבניין', area: 'השכונה', contact: 'יצירת קשר' },
  h2: { plan: ['לטייל בתוכנית, ', 'חדר אחר חדר'], model: ['לסובב את הבית ', 'בכף היד'], building: ['שני מגדלים ', 'מעל החוף'], area: ['הכול ', 'במרחק הליכה'] },
  sub: { model: 'גוררים כדי לסובב, צובטים או גוללים כדי להתקרב. המודל נמדד מתוכנית האדריכל ומואר כמו התמונות.', building: 'מסובבים את הבניין כדי לראות אותו מכל צד. המגדלים, הבריכה והלובי — משמאל.' },
  cuts: { long: 'הסרט', short: 'גרסה קצרה', phone: 'גרסה לטלפון' },
  plan: {
   aria: 'תוכנית הדירה — בחרו חדר', north: 'הצפון משמאל', hintOn: 'לחיצה משאירה את החדר · תמונות וקטע וידאו של החדר בצד', hintOff: 'מעבירים את העכבר על התוכנית — כל חדר נפתח',
   whole: 'כל הדירה', wholeLine: 'מטבח, פינת אוכל וסלון בחלל ארוך אחד, מרפסת לצד הים, יחידת הורים ועוד שלושה חדרים באגף השקט.',
   wholeSpec: (rooms: string, balcony: string, aspect: string) => `${rooms} חדרים · מרפסת ${balcony} מ״ר · ${aspect}`,
   fromFilm: (n: string) => `${n} — מתוך הסרט`, watch: 'צפייה', watchAria: (n: string) => `צפייה: ${n}`, photoAria: (n: string) => `תמונה: ${n}`,
   none: 'עדיין אין תמונות של החדר הזה.', all: 'הכול', photos: 'התמונות', back: 'אחורה', on: 'קדימה', openAria: (c: string) => `${c} — פתיחה`,
  },
  map: { min: 'דק׳', walkAria: (n: string, m: number | null) => `${n}, ${m} דקות הליכה`, km: (km: string) => `${km} ק״מ ברגל`, note: 'מסלולי ההליכה וזמניהם חושבו ב־OpenStreetMap מכניסת הבניין.' },
  model: { walk: 'סיור בפנים', early: 'גרסה ראשונית' },
  building: { stage: 'הבניין — גוררים כדי לסובב', canvas: 'המגדלים של אלמה ביי מכל הצדדים', yours: 'הדירה שלך', floor: (u: string, f: number) => `${u} · קומה ${f}`, hint: 'גוררים כדי לסובב את הבניין', left: 'סיבוב שמאלה', right: 'סיבוב ימינה', open: (c: string) => `${c} — פתיחה`, video: ' (וידאו)' },
  contact: { yours: 'איש הקשר שלך', phone: 'טלפון', email: 'דוא״ל', developer: 'היזם' },
  kit: { kicker: 'ערכת מדיה', title: ['כל מה שבעמוד הזה, ', 'בקובץ אחד'], btn: 'הורדת הכול', meta: (size: string, n: number) => `zip · ${size} · ${n} קבצים` },
  lb: { close: 'סגירה', prev: 'הקודם', next: 'הבא' },
  foot: (p: string, u: string) => `הסרטים, התוכנית, המודל והתמונות נוצרו ב־residence.tech מתוכנית הדירה של ${p} · ${u}. התמונות להמחשה בלבד. זמני ההליכה חושבו ב־OpenStreetMap.`,
  allResidences: (p: string) => `${p} — כל הדירות`,
 },
};

/** the home's own words */
const ROOM_NAMES_HE: Record<string, string> = {
 living: 'סלון · פינת אוכל · מטבח', corridor: 'מסדרון', master: 'חדר הורים', ensuite: 'חדר רחצה הורים', bed2: 'חדר שינה 2', bed3: 'חדר שינה 3',
 safe: 'ממ״ד (חדר שינה 4)', wc: 'שירותי אורחים', bath: 'חדר רחצה משפחתי', laundry: 'מרפסת שירות', balcony: 'מרפסת',
};
const ROOM_LINES: Record<L2, Record<string, string>> = {
 en: {},
 he: {
  living: 'חלל ארוך אחד מהדלת הראשית ועד קיר החלונות הצפוני: המטבח עם אי של 3.4 מ׳, פינת אוכל לשישה והסלון.',
  balcony: 'פתוחה לצפון ולמערב — שולחן לשישה והים באלכסון, 25 קומות מעל הקרקע.',
  corridor: 'מסדרון ברוחב 1.2 מ׳ מהחלל המרכזי אל האגף השקט.',
  master: 'יחידת ההורים: מעבר ארונות לצד חדר הרחצה הצמוד, החלון לצפון.',
  ensuite: 'מקלחון, אסלה וכיור כפול, עם חלון חלבי.',
  bed2: 'חדר שינה הפונה מזרחה אל העיר, עם שולחן עבודה מתחת לחלון.',
  bed3: 'חדר ילדים נוסף, הפונה מזרחה.',
  safe: 'הממ״ד, מרוהט כחדר עבודה או חדר שינה רביעי.',
  wc: 'שירותי אורחים מהמסדרון.',
  bath: 'חדר הרחצה המשפחתי — הגדול בדירה, עם מקלחת גשם.',
  laundry: 'מרפסת שירות עם חבלי כביסה מאחורי מסתור, מחדר הרחצה.',
 },
};
const POINTS_HE = [
 ['דירת פינה', 'בצפון־מזרח המגדל, אור משני כיוונים'],
 ['אי מטבח', 'הדלת הראשית נפתחת אל המטבח והאי באורך 3.4 מ׳'],
 ['סלון לצפון', 'לאורך קיר החלונות, פתוח אל המרפסת'],
 ['מרפסת 4.6 × 4.8 מ׳', 'שולחן לשישה, הים באלכסון במערב'],
 ['יחידת הורים', 'עם חדר רחצה צמוד ומעבר ארונות'],
 ['עוד שלושה חדרים', 'שני חדרי שינה והממ״ד, כולם פונים מזרחה'],
];
const PLACES_HE: Record<string, [string, string]> = {
 'ha-irusim-mall': ['קניון האירוסים', 'קניון'], 'iris-park': ['פארק האירוסים', 'פארק'], 'raziel-school': ['בית ספר רזיאל', 'בית ספר'],
 'the-beach': ['החוף', 'חוף'], 'benjamin-s-bakery': ['המאפייה של בנג׳מין', 'מאפייה'],
};
const BUILDING_HE = ['המגדלים', 'מעל החוף', 'קו החוף', 'מהרחוב', 'הבריכה', 'סיפון הבריכה', 'הכניסה והלובי', 'אולם הלובי', 'סלון הדיירים', 'מגרש הטניס', 'החזית', 'הסרט של אלמה ביי'];
const FIGURES_HE: Record<string, string> = { Towers: 'מגדלים', Floors: 'קומות', Homes: 'דירות', 'm² plot': 'מ״ר מגרש', Residences: 'דירות', Plot: 'מגרש' };
const KIT_HE = ['סרטים · 46 שנ׳, 20 שנ׳, 9:16', 'קטעי חדרים', 'תמונות', 'תוכניות', 'מודל תלת־ממד · GLB', 'תמונות וסרטונים של הבניין'];

export function homeText(lang: L2) {
 const he = lang === 'he';
 const H = HOMES.apt01;
 return {
  project: he ? 'אלמה ביי' : 'Alma Bay',
  unit: he ? 'דירה 01' : 'Residence 01',
  address: he ? { no: '14', street: 'שדרות הגלים', word: 'הגלים', city: 'נתניה', country: 'ישראל' } : { no: '14', street: 'HaGalim Boulevard', word: 'HaGalim', city: 'Netanya', country: 'Israel' },
  aspect: H.aspect[lang],
  room: (id: string, en: string) => he ? ROOM_NAMES_HE[id] ?? en : en,
  line: (id: string, en: string) => ROOM_LINES[lang][id] ?? en,
  point: (i: number, en: [string, string]) => he ? POINTS_HE[i] ?? en : en,
  place: (id: string, en: [string, string]) => he ? PLACES_HE[id] ?? en : en,
  gallery: (i: number, en: string) => he ? H.images[i]?.label.he ?? en : en,
  bmedia: (i: number, en: string) => he ? BUILDING_HE[i] ?? en : en,
  figure: (en: string) => he ? FIGURES_HE[en] ?? en : en,
  kitPart: (i: number, en: string) => he ? KIT_HE[i] ?? en : en,
  agentRole: he ? 'מנהל מכירות · אלמה ביי' : 'Sales manager · Alma Bay',
  agentName: he ? 'דניאל מזרחי' : 'Daniel Mizrahi',
  devName: he ? 'אורליה' : 'Orelia',
  devAbout: he
   ? 'אורליה בונה את אלמה ביי: שני מגדלים בני 32 קומות על פודיום משותף מעל החופים הדרומיים של נתניה, עם בריכה, מגרש טניס ולובי הפתוח אל הגן. כל דירה אפשר לגלות בעמוד הפרויקט — בוחרים אותה על הבניין ופותחים את התוכניות, הסרטים והמודל.'
   : 'Orelia builds Alma Bay: two 32-floor towers on a shared podium above the southern beaches of Netanya, with a pool, a tennis court and a lobby open to the garden. Every residence can be explored on the project page — choose it on the building and open its plans, films and 3D model.',
  devLink: he ? 'אלמה ביי של אורליה — כל הדירות' : 'Alma Bay by Orelia — all residences',
 };
}

/** the page's language (English or Hebrew), its interface words and the home's words */
export function useHome() { const L = l2(useLang()); return { L, t: T[L], x: homeText(L) }; }
