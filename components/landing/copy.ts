import type { Lang } from '@/lib/i18n';

export type DemoCopy = {
 kind: string; name: string; body: string; features: string[]; cta: string; hint: string; touchHint: string;
};
export type LandingCopy = {
 brand: string; brandNote: string; newTab: string;
 title: string; lede: string; sample: string;
 salesGallery: DemoCopy; openHouse: DemoCopy; penthouse: DemoCopy;
 footer: string;
};

const en: LandingCopy = {
 brand: 'Residences',
 brandNote: 'Property marketing demos',
 newTab: 'opens in a new tab',
 title: 'Three ways to show a home before the first visit.',
 lede: 'This is a working demo of three property-marketing websites. One sells a whole new building, home by home. One gives a single apartment a website of its own. The third presents one luxury home on its building, in the project’s own look.',
 sample: 'Everything here is sample data. Availability is invented, areas are estimates from the plans, and the interiors, films and 3D furniture are illustrations.',
 salesGallery: {
  kind: 'For a new development',
  name: 'Sales Gallery',
  body: 'Buyers turn the building, see at a glance which homes are still for sale, and open any one for its plan, area, film and 3D model.',
  features: ['Turn the building all the way round', 'For sale and sold, marked on the facade', 'Plan, film, images and 3D for every home', 'A link that opens straight to one home'],
  cta: 'Open the Sales Gallery',
  hint: 'Hover to turn the building',
  touchHint: 'The building turns as you scroll past',
 },
 openHouse: {
  kind: 'For a single home',
  name: 'Open House',
  body: 'One apartment with its own website: a short film, the rooms one by one, a 3D walk-around and the neighbourhood. Shown with Apartment 02 at Mozir 8, Tel Aviv.',
  features: ['A 20-second film of the home', 'The rooms, one at a time', 'A furnished 3D model to turn and zoom', 'The address and a way to enquire'],
  cta: 'Visit Mozir 8',
  hint: 'Hover to play the film',
  touchHint: 'Open it to watch the film',
 },
 penthouse: {
  kind: 'For a luxury home',
  name: 'Penthouse',
  body: 'One penthouse, shown on its own building: turn the tower to find it on the top floor, then open its plan, the developer’s renders and a 3D model of the layout. Shown with A-P1 at A.f.k, Neot Afeka.',
  features: ['The building turns, the penthouse marked', 'Plan, renders and a 3D layout', 'In the project’s own look and colours', 'The sales line, one tap away'],
  cta: 'Open the penthouse',
  hint: 'Hover to turn the building',
  touchHint: 'The building turns as you scroll past',
 },
 footer: 'A demo, not an offer to sell. Confirm any property detail with the developer.',
};

const he: LandingCopy = {
 brand: 'Residences',
 brandNote: 'הדגמות לשיווק נדל״ן',
 newTab: 'נפתח בכרטיסייה חדשה',
 title: 'שלוש דרכים להציג בית עוד לפני הביקור הראשון.',
 lede: 'זוהי הדגמה חיה של שלושה אתרים לשיווק נדל״ן. האחד מוכר בניין חדש שלם, דירה אחר דירה. השני נותן לדירה אחת אתר משלה. השלישי מציג דירת יוקרה אחת על הבניין שלה, בעיצוב של הפרויקט.',
 sample: 'כל מה שמוצג כאן הוא מידע לדוגמה: הזמינות בדויה, השטחים הם הערכות לפי התוכניות, והעיצוב הפנימי, הסרטונים והריהוט בתלת־ממד הם המחשות.',
 salesGallery: {
  kind: 'לפרויקט חדש',
  name: 'גלריית המכירות',
  body: 'הקונים מסובבים את הבניין, רואים במבט אחד אילו דירות עדיין למכירה, ופותחים כל דירה לתוכנית, לשטח, לסרטון ולמודל תלת־ממד.',
  features: ['סיבוב מלא של הבניין', 'למכירה ונמכרו, מסומנים על החזית', 'תוכנית, סרטון, תמונות ותלת־ממד לכל דירה', 'קישור שנפתח ישר על דירה אחת'],
  cta: 'לגלריית המכירות',
  hint: 'רחפו מעל התמונה כדי לסובב את הבניין',
  touchHint: 'הבניין מסתובב כשהוא על המסך',
 },
 openHouse: {
  kind: 'לדירה אחת',
  name: 'בית פתוח',
  body: 'דירה אחת עם אתר משלה: סרטון קצר, החדרים אחד אחד, סיור בתלת־ממד והשכונה. מוצג עם דירה 02 ברחוב יעקב מוזיר 8, תל אביב.',
  features: ['סרטון של 20 שניות על הבית', 'החדרים, אחד אחרי השני', 'מודל תלת־ממד מרוהט לסיבוב ולזום', 'הכתובת ודרך ליצור קשר'],
  cta: 'למוזיר 8',
  hint: 'רחפו מעל התמונה כדי להפעיל את הסרטון',
  touchHint: 'פתחו כדי לצפות בסרטון',
 },
 penthouse: {
  kind: 'לדירת יוקרה',
  name: 'פנטהאוז',
  body: 'פנטהאוז אחד, מוצג על הבניין שלו: מסובבים את המגדל כדי למצוא אותו בקומה העליונה, ופותחים את התוכנית, את הדמיות היזם ומודל תלת־ממד של התכנון. מוצג עם A-P1 בפרויקט A.f.k, נאות אפקה.',
  features: ['הבניין מסתובב, הפנטהאוז מסומן', 'תוכנית, הדמיות ותכנון בתלת־ממד', 'בעיצוב ובצבעים של הפרויקט', 'קו המכירות, בנגיעה אחת'],
  cta: 'לפנטהאוז',
  hint: 'רחפו מעל התמונה כדי לסובב את הבניין',
  touchHint: 'הבניין מסתובב כשהוא על המסך',
 },
 footer: 'זוהי הדגמה ולא הצעה למכירה. יש לאמת כל פרט על הנכס מול היזם.',
};

export const copy: Record<Lang, LandingCopy> = { en, he };
