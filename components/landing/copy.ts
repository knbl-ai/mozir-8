import type { Lang } from '@/lib/i18n';

export type DemoCopy = {
 kind: string; name: string; body: string; features: string[]; cta: string; hint: string; touchHint: string;
};
export type LandingCopy = {
 brand: string; brandNote: string; newTab: string;
 title: string; lede: string; sample: string;
 salesGallery: DemoCopy; openHouse: DemoCopy; penthouse: DemoCopy; complex: DemoCopy; boutique: DemoCopy; heritage: DemoCopy;
 footer: string;
};

const en: LandingCopy = {
 brand: 'Residences',
 brandNote: 'Property marketing demos',
 newTab: 'opens in a new tab',
 title: 'Six ways to show a home before the first visit.',
 lede: 'This is a working demo of six property-marketing websites. One sells a whole new building, home by home. One gives a single apartment a website of its own. The third presents one luxury home on its building, in the project’s own look. The fourth sells a four-tower neighbourhood in its developer’s brand: pick a building, then a floor, then a home. The fifth is a boutique building’s front page for young buyers: three homes to step inside, a duplex in 3D floor by floor. The sixth rebuilds a historic Lisbon house from its plans, tile by tile, with its duplex to walk through.',
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
 complex: {
  kind: 'For a multi-building project',
  name: 'Gindi Colors',
  body: 'A four-tower neighbourhood in the developer’s own luxury look: turn the complex, fly into any building, and pick a home on its facade or floor by floor. Shown with Gindi Colors, Kiryat HaSharon.',
  features: ['Four towers, one turn of the complex', 'Every building, every floor, every home', 'Plans, interiors and outlooks per home', 'In Gindi’s charcoal and gold'],
  cta: 'Open Gindi Colors',
  hint: 'Hover to turn the complex',
  touchHint: 'The complex turns as you scroll past',
 },
 boutique: {
  kind: 'For a boutique building',
  name: 'N°8 KLEE',
  body: 'A front page for young buyers: three homes side by side, the building and its map beside them. Step into any home for its film, plan, images and 3D; the garden duplex shows both floors together or one at a time. Shown with N°8 KLEE, New North, Tel Aviv.',
  features: ['Three homes, one tap to step inside', 'A walkthrough film for every home', 'Duplex in 3D: both floors or each one', 'The building, the map and the agent'],
  cta: 'Open N°8 KLEE',
  hint: 'Hover to play a walkthrough',
  touchHint: 'Open it to watch the films',
 },
 heritage: {
  kind: 'For a historic building',
  name: 'Borges 15',
  body: 'A Lisbon house rebuilt from the developer’s plans: its azulejo façade, stone and terracotta roof, in the street it stands in. Turn it to find the duplex under the roof, then watch its film with sound, open the plan, the images and the 3D home. Shown with 3B at Borges 15, Lapa, Lisbon.',
  features: ['The house rebuilt from its plans, tile by tile', 'The duplex marked on the building', 'A walkthrough film with sound, plan and 3D', 'In the project’s Lapa look'],
  cta: 'Open Borges 15',
  hint: 'Hover to turn the building',
  touchHint: 'The building turns as you scroll past',
 },
 footer: 'A demo, not an offer to sell. Confirm any property detail with the developer.',
};

const he: LandingCopy = {
 brand: 'Residences',
 brandNote: 'הדגמות לשיווק נדל״ן',
 newTab: 'נפתח בכרטיסייה חדשה',
 title: 'שש דרכים להציג בית עוד לפני הביקור הראשון.',
 lede: 'זוהי הדגמה חיה של שישה אתרים לשיווק נדל״ן. האחד מוכר בניין חדש שלם, דירה אחר דירה. השני נותן לדירה אחת אתר משלה. השלישי מציג דירת יוקרה אחת על הבניין שלה, בעיצוב של הפרויקט. הרביעי משווק שכונה של ארבעה מגדלים במיתוג היזם: בוחרים בניין, קומה — ואת הבית. החמישי הוא עמוד הבית של בניין בוטיק לקונים צעירים: שלוש דירות להיכנס אליהן, ודופלקס בתלת־ממד קומה אחר קומה. השישי משחזר בית היסטורי בליסבון מהתוכניות, אריח אחר אריח, עם הדופלקס שלו לסיור.',
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
 complex: {
  kind: 'לפרויקט רב־בנייני',
  name: 'גינדי קולורס',
  body: 'שכונה של ארבעה מגדלים, בשפת היוקרה של היזם: מסובבים את המתחם, נכנסים לכל בניין ובוחרים דירה על החזית או קומה אחר קומה. מוצג עם גינדי קולורס, קריית השרון.',
  features: ['ארבעה מגדלים, סיבוב אחד של המתחם', 'כל בניין, כל קומה, כל דירה', 'תוכניות, הדמיות ונופים לכל דירה', 'בשחור ובזהב של גינדי'],
  cta: 'לגינדי קולורס',
  hint: 'רחפו מעל התמונה כדי לסובב את המתחם',
  touchHint: 'המתחם מסתובב כשהוא על המסך',
 },
 boutique: {
  kind: 'לבניין בוטיק',
  name: 'N°8 KLEE',
  body: 'עמוד בית לקונים צעירים: שלוש דירות זו לצד זו, והבניין והמפה לצידן. נכנסים לכל דירה לסרטון, לתוכנית, לתמונות ולתלת־ממד; דופלקס הגן מוצג בשתי הקומות יחד או בכל קומה לחוד. מוצג עם N°8 KLEE, הצפון החדש, תל אביב.',
  features: ['שלוש דירות, נגיעה אחת כדי להיכנס', 'סרטון סיור לכל דירה', 'דופלקס בתלת־ממד: שתי קומות או כל אחת', 'הבניין, המפה והסוכן'],
  cta: 'ל־N°8 KLEE',
  hint: 'רחפו מעל התמונה כדי להפעיל סיור',
  touchHint: 'פתחו כדי לצפות בסרטונים',
 },
 heritage: {
  kind: 'לבניין היסטורי',
  name: 'Borges 15',
  body: 'בית בליסבון שנבנה מחדש מתוכניות היזם: חזית האזולז׳ו, האבן וגג הרעפים, ברחוב שבו הוא עומד. מסובבים כדי למצוא את הדופלקס מתחת לגג, וצופים בסרטון עם קול, בתוכנית, בתמונות ובדירה בתלת־ממד. מוצג עם 3B בבורז׳ש 15, לאפה, ליסבון.',
  features: ['הבית משוחזר מהתוכניות, אריח אחר אריח', 'הדופלקס מסומן על הבניין', 'סרטון סיור עם קול, תוכנית ותלת־ממד', 'בעיצוב לאפה של הפרויקט'],
  cta: 'לבורז׳ש 15',
  hint: 'רחפו מעל התמונה כדי לסובב את הבניין',
  touchHint: 'הבניין מסתובב כשהוא על המסך',
 },
 footer: 'זוהי הדגמה ולא הצעה למכירה. יש לאמת כל פרט על הנכס מול היזם.',
};

export const copy: Record<Lang, LandingCopy> = { en, he, pt: en };  // these pages offer Hebrew, not Portuguese (lib/i18n LANG_PAGES)
