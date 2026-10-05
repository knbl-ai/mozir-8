import type { Lang } from '@/lib/i18n';

// Every word N°8 KLEE shows apart from the building and the homes themselves (content/projects/klee.ts).
const en = {
 homesTitle: 'Three homes, three ways to live',
 homesNote: 'Pick one to step inside: film, plan, images and 3D.',
 homesLabel: 'The homes on show',
 stepInside: 'Step inside',
 stepInsideHome: (home: string) => `Step inside ${home}`,
 tapAgain: 'Tap again to step inside',
 rooms: (n: number) => `${n} rooms`, sqm: 'm²',
 outdoorArea: (what: string, m2: number) => `${what} ${m2} m²`,
 buildingLabel: 'The building and its location',
 theLocation: 'The location', designedBy: 'Developer & architect',
 mapTitle: 'Map of N°8 KLEE, Klee St 8, Tel Aviv', openMaps: 'Google Maps', openWaze: 'Waze',
 talkTo: (name: string) => `Talk to ${name.split(' ')[0]}`,
 agent: 'Sales agent',
 enquiry: (home?: string) => home ? `Hello, I'd like details about ${home} at N°8 KLEE.` : `Hello, I'd like details about N°8 KLEE.`,
 whatsapp: 'WhatsApp', call: 'Call', email: 'Email',
 allDemos: 'All demos',
 // apartment view
 allHomes: 'All homes', allHomesTitle: 'Back to N°8 KLEE (Esc)', otherHomes: 'Homes at N°8 KLEE',
 available: 'Available', priceOnRequest: 'On request',
};

export type KleeText = typeof en;

const he: KleeText = {
 homesTitle: 'שלוש דירות, שלוש דרכים לחיות',
 homesNote: 'בחרו דירה כדי להיכנס: סרטון, תוכנית, תמונות ותלת־ממד.',
 homesLabel: 'הדירות המוצגות',
 stepInside: 'כניסה לדירה',
 stepInsideHome: home => `כניסה ל־${home}`,
 tapAgain: 'הקישו שוב כדי להיכנס',
 rooms: n => `${n} חדרים`, sqm: 'מ״ר',
 outdoorArea: (what, m2) => `${what} ${m2} מ״ר`,
 buildingLabel: 'הבניין והמיקום',
 theLocation: 'המיקום', designedBy: 'יזם ואדריכלים',
 mapTitle: 'מפה של N°8 KLEE, רחוב קליי 8, תל אביב', openMaps: 'Google Maps', openWaze: 'Waze',
 talkTo: name => `דברו עם ${name.split(' ')[0]}`,
 agent: 'סוכן מכירות',
 enquiry: home => home ? `שלום, אשמח לקבל פרטים על ${home} בפרויקט N°8 KLEE.` : 'שלום, אשמח לקבל פרטים על פרויקט N°8 KLEE.',
 whatsapp: 'WhatsApp', call: 'חיוג', email: 'מייל',
 allDemos: 'כל ההדגמות',
 allHomes: 'כל הדירות', allHomesTitle: 'חזרה ל־N°8 KLEE (Esc)', otherHomes: 'הדירות ב־N°8 KLEE',
 available: 'זמינה', priceOnRequest: 'לפי בקשה',
};

export const kleeText: Record<Lang, KleeText> = { en, he };
