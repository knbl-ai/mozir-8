import type { Lang } from '@/lib/i18n';

export type ProjectCopy = { kind: string; name: string; body: string; cta: string };
export type Item = { title: string; body: string };
export type DeliverableKey = 'film' | 'model' | 'images' | 'building' | 'site' | 'languages';
export type LandingCopy = {
 nav: { how: string; package: string; projects: string; trial: string };
 hero: { lead: string; to: string; words: string[]; lede: string; cta: string; watch: string; play: string; filmLabel: string; dim?: { start: string; label: string; end: string } };
 process: {
  title: string; replay: string;
  step1: Item & { file: string; uploading: string; uploaded: string; planAlt: string };
  engine: { label: string; note: string };
  step2: Item;
  icons: Record<DeliverableKey, string>;
  details: Record<DeliverableKey, string>;
  link: string; share: string;
 };
 package: {
  title: string; lede: string; example: string;
  items: Record<DeliverableKey, Item>;
  spinNote: string; forSale: string; sold: string;
  languages: { tag: string; text: string }[];
 };
 form: {
  title: string; lede: string; points: string[];
  name: string; email: string; phone: string; description: string; descriptionHint: string;
  plan: string; planHint: string; planChoose: string; planReplace: string; planRemove: string;
  submit: string; sending: string; uploading: string; required: string;
  done: (email: string) => string; doneTitle: string; again: string;
  errors: { email: string; type: string; size: string; rate: string; upload: string; server: string };
  privacy: string;
 };
 projects: {
  title: string; lede: string; newTab: string;
  towers: ProjectCopy; salesGallery: ProjectCopy; openHouse: ProjectCopy; penthouse: ProjectCopy; boutique: ProjectCopy; heritage: ProjectCopy;
 };
 footer: { line: string; contact: string };
};

const en: LandingCopy = {
 nav: { how: 'How it works', package: 'What you get', projects: 'Projects', trial: 'Request a demo' },
 hero: {
  lead: 'From floor plan',
  to: 'to sold',
  words: ['apartment.', 'home.', 'penthouse.', 'villa.'],
  lede: 'Upload a floor plan. Get back a complete sales package on one shareable link, ready to send to buyers.',
  cta: 'Get started',
  watch: 'Watch the film',
  play: 'Play the film',
  filmLabel: 'residence.tech in 50 seconds',
  dim: { start: 'Floor plan', label: '1 day', end: 'Ready to sell' },
 },
 process: {
  title: 'How it works',
  replay: 'Replay',
  step1: { title: 'Upload a floor plan', body: 'A PDF or an image from the architect is enough.', file: 'apartment-1-plan.pdf', uploading: 'Uploading', uploaded: 'Uploaded', planAlt: 'The architect’s floor plan of a one-bedroom apartment' },
  engine: { label: 'residence.tech', note: '≈ 1 day' },
  step2: { title: 'Get the sales package', body: 'Everything the sales team needs, shared as one link.' },
  icons: { film: 'Film', model: '3D plan', images: 'Images', building: 'Building', site: 'Sales page', languages: 'Languages' },
  details: { film: 'A walkthrough with sound', model: 'Furnished, turns 360°', images: 'Every room and from above', building: 'Live availability', site: 'One link for buyers', languages: 'EN · עב · PT' },
  link: 'residence.tech/klee-8/apt-1', share: 'Share',
 },
 package: {
  title: 'What you get',
  lede: 'Every project gets all six. Point at one to see it work.',
  example: 'Shown with N°8 KLEE, apartment 2, Tel Aviv, and the Shirat HaYam towers, Netanya: made from the plans above.',
  items: {
   film: { title: 'Walkthrough film', body: 'A cinematic tour of the home, with natural sound.' },
   model: { title: '3D floor plan', body: 'A furnished model buyers turn and zoom.' },
   images: { title: 'Photoreal images', body: 'Every room, plus a view from above.' },
   building: { title: 'Building and availability', body: 'Turn the building, see what’s still for sale.' },
   site: { title: 'Sales page', body: 'Film, plan, images and 3D on one link, on any phone.' },
   languages: { title: 'Every language you sell in', body: 'English, Hebrew, Portuguese and more.' },
  },
  spinNote: '360°',
  forSale: 'For sale', sold: 'Sold',
  languages: [
   { tag: 'EN', text: 'Three rooms, an en-suite and a west balcony for sunsets.' },
   { tag: 'עב', text: 'שלושה חדרים, יחידת הורים ומרפסת מערבית לשקיעות.' },
   { tag: 'PT', text: 'T2 com suite e varanda a poente, para o pôr do sol.' },
  ],
 },
 form: {
  title: 'See it on your own project',
  lede: 'Send us one floor plan. We’ll prepare a demo of your package and get in touch.',
  points: ['No commitment', 'Your plan stays private to our team', 'We reply within one working day'],
  name: 'Name', email: 'Email', phone: 'Phone', description: 'About the project', descriptionHint: 'Address, number of homes, anything we should know',
  plan: 'Floor plan', planHint: 'PDF, JPG, PNG or WebP, up to 25 MB', planChoose: 'Drop the file here or choose one', planReplace: 'Replace', planRemove: 'Remove',
  submit: 'Get sales package', sending: 'Sending…', uploading: 'Uploading the plan', required: 'required',
  doneTitle: 'Your plan is with us',
  done: email => `We’ve sent a confirmation to ${email}. We’ll be in touch shortly.`,
  again: 'Send another plan',
  errors: {
   email: 'Enter an email address, like name@company.com.',
   type: 'This file type isn’t supported. Use a PDF, JPG, PNG or WebP.',
   size: 'This file is over 25 MB. Send a smaller export of the plan.',
   rate: 'Too many requests from this connection. Try again in an hour, or write to ai@kanibal.co.il.',
   upload: 'The plan didn’t upload. Check your connection and try again.',
   server: 'Something went wrong on our side. Try again, or write to ai@kanibal.co.il.',
  },
  privacy: 'We use your details only to reply to this request.',
 },
 projects: {
  title: 'Made with residence.tech',
  lede: 'Real projects, each made from its floor plans. Availability is sample data.',
  newTab: 'opens in a new tab',
  towers: { kind: 'Twin towers, Netanya', name: 'Shirat HaYam · BRIGA', body: 'Two 32-storey towers in 360°: all 215 homes to choose, film, gallery and 3D.', cta: 'Open Shirat HaYam' },
  salesGallery: { kind: 'New development', name: 'Hurgin 29, Ramat Gan', body: 'Turn the building, see which homes are for sale, open any one.', cta: 'Open Hurgin 29' },
  openHouse: { kind: 'Single apartment', name: 'Mozir 8', body: 'One apartment with a website of its own: film, rooms and 3D.', cta: 'Visit Mozir 8' },
  penthouse: { kind: 'Luxury home', name: 'A.f.k Penthouse', body: 'A penthouse found on its tower, in the project’s own look.', cta: 'Open the penthouse' },
  boutique: { kind: 'Boutique building', name: 'N°8 KLEE', body: 'Three homes to step into, a garden duplex floor by floor.', cta: 'Open N°8 KLEE' },
  heritage: { kind: 'Historic building, Lisbon', name: 'Borges 15', body: 'A Lapa house rebuilt from its plans, with a duplex to walk through.', cta: 'Open Borges 15' },
 },
 footer: { line: 'residence.tech by KNBL', contact: 'ai@kanibal.co.il' },
};

const he: LandingCopy = {
 nav: { how: 'איך זה עובד', package: 'מה מקבלים', projects: 'פרויקטים', trial: 'בקשו הדגמה' },
 hero: {
  lead: 'מתוכנית אדריכלית',
  to: '',
  words: ['לנכס שנמכר.'],
  lede: 'מעלים את תשריט הדירה ומקבלים תוך דקות עמוד נחיתה מרהיב, עשיר ואינטראקטיבי. העסקה שלכם הולכת להיסגר מהר יותר.',
  cta: 'בואו נתחיל',
  watch: 'צפו בסרטון',
  play: 'צפו בסרטון',
  filmLabel: 'residence.tech ב־50 שניות',
 },
 process: {
  title: 'איך זה עובד?',
  replay: 'שוב',
  step1: { title: 'מעלים את תשריט הדירה', body: 'אפשר להעלות בכל פורמט', file: 'apartment-1-plan.pdf', uploading: 'מעלים', uploaded: 'הועלה', planAlt: 'תוכנית האדריכל של דירת שני חדרים' },
  engine: { label: 'residence.tech', note: '≈ יום אחד' },
  step2: { title: 'ומקבלים עמוד נחיתה מושלם', body: 'עם הפיצ׳רים שיעזרו לכם למכור מהר' },
  icons: { film: 'סרטון', model: 'הדמיית תלת־\u2060מימד', images: 'אימג׳ים באיכות גבוהה', building: 'תצוגת בניין בתלת־\u2060מימד', site: 'לינק ייעודי לרוכשים', languages: 'עמודים בכל שפה' },
  details: { film: 'סיור בדירה עם סאונד', model: 'אינטראקטיבית וריאליסטית', images: 'לכל חדר בנפרד ולכל הדירה', building: 'עם דירות שנמכרו וכאלה שעוד לא', site: 'עם התאמה למובייל', languages: 'עבור כל קהל יעד' },
  link: 'residence.tech/klee-8/apt-1', share: 'שיתוף',
 },
 package: {
  title: 'מה מקבלים?',
  lede: 'שישה פיצ׳רים ויזואליים ומרהיבים שיגרמו למכירה שלכם להיות קלה ומהירה\u00a0– בעמוד נחיתה אחד ונוח',
  example: 'בדוגמה: N°8 KLEE, דירה 2, תל אביב, ומגדלי שירת הים, נתניה — מהתוכניות שלמעלה.',
  items: {
   film: { title: 'סרטון סיור בדירה', body: 'כולל סאונד ומראה מקום של היכן נמצאים בדירה בכל רגע.' },
   model: { title: 'תוכנית בתלת־\u2060מימד', body: 'מודל 3D שהרוכש יכול לסובב ולהגדיל כדי לקבל המחשה מדוייקת של החלל' },
   images: { title: 'הדמיות פוטוריאליסטיות', body: 'כל חדר מקבל תמונה שתעזור לרוכש לדמיין את הבית הבא שלו.' },
   building: { title: 'הבניין והזמינות', body: 'מסובבים את הבניין ורואים אילו דירות עוד זמינות לרכישה.' },
   site: { title: 'עמוד מכירה', body: 'סרטון, תוכנית, הדמיות ותלת־\u2060מימד בקישור אחד, בכל טלפון.' },
   languages: { title: 'בכל שפה שמוכרים בה', body: 'עברית, אנגלית, פורטוגזית ועוד.' },
  },
  spinNote: '360°',
  forSale: 'למכירה', sold: 'נמכר',
  languages: [
   { tag: 'עב', text: 'שלושה חדרים, יחידת הורים ומרפסת מערבית לשקיעות.' },
   { tag: 'EN', text: 'Three rooms, an en-suite and a west balcony for sunsets.' },
   { tag: 'PT', text: 'T2 com suite e varanda a poente, para o pôr do sol.' },
  ],
 },
 form: {
  title: 'נסו בעצמכם והגדילו את המכירות שלכם עוד היום!',
  lede: 'שלחו לנו תוכנית אחת, אנחנו נכין הדגמה של עמוד הנחיתה ונחזור אליכם.',
  points: ['בלי התחייבות', 'התוכנית נשארת אצל הצוות שלנו בלבד', 'נחזור אליכם תוך יום עבודה'],
  name: 'שם', email: 'אימייל', phone: 'טלפון', description: 'על הפרויקט', descriptionHint: 'כתובת, מספר דירות, כל מה שכדאי שנדע',
  plan: 'תוכנית דירה', planHint: 'PDF‏, JPG‏, PNG או WebP, עד 25MB', planChoose: 'גררו קובץ לכאן או בחרו קובץ', planReplace: 'החלפה', planRemove: 'הסרה',
  submit: 'לחצו כאן לשליחה', sending: 'שולחים…', uploading: 'מעלים את התוכנית', required: 'שדה חובה',
  doneTitle: 'התוכנית אצלנו',
  done: email => `שלחנו אישור ל־${email}. נחזור אליכם בקרוב.`,
  again: 'שליחת תוכנית נוספת',
  errors: {
   email: 'הזינו כתובת אימייל, למשל name@company.com.',
   type: 'סוג הקובץ לא נתמך. השתמשו ב־PDF‏, JPG‏, PNG או WebP.',
   size: 'הקובץ גדול מ־25MB. שלחו גרסה קטנה יותר של התוכנית.',
   rate: 'יותר מדי בקשות מהחיבור הזה. נסו שוב בעוד שעה, או כתבו ל־ai@kanibal.co.il.',
   upload: 'התוכנית לא עלתה. בדקו את החיבור ונסו שוב.',
   server: 'משהו השתבש אצלנו. נסו שוב, או כתבו ל־ai@kanibal.co.il.',
  },
  privacy: 'נשתמש בפרטים רק כדי לענות לפנייה הזו.',
 },
 projects: {
  title: 'נוצר עם residence.tech',
  lede: 'פרויקטים אמיתיים, כל אחד נבנה מהתוכניות שלו. הזמינות היא לדוגמה.',
  newTab: 'נפתח בכרטיסייה חדשה',
  towers: { kind: 'מגדלי תאומים, נתניה', name: 'שירת הים · בריגה', body: 'שני מגדלים בני 32 קומות ב־360°: כל 215 הדירות לבחירה, סרט, גלריה ותלת־\u2060מימד.', cta: 'לשירת הים' },
  salesGallery: { kind: 'פרויקט חדש', name: 'חורגין 29, רמת גן', body: 'מסובבים את הבניין, רואים מה למכירה, פותחים כל דירה.', cta: 'לחורגין 29' },
  openHouse: { kind: 'דירה אחת', name: 'מוזיר 8', body: 'דירה אחת עם אתר משלה: סרטון, חדרים ותלת־\u2060מימד.', cta: 'למוזיר 8' },
  penthouse: { kind: 'דירת יוקרה', name: 'הפנטהאוז ב־A.f.k', body: 'פנטהאוז שמוצאים על המגדל שלו, בעיצוב הפרויקט.', cta: 'לפנטהאוז' },
  boutique: { kind: 'בניין בוטיק', name: 'N°8 KLEE', body: 'שלוש דירות להיכנס אליהן, ודופלקס גן קומה אחר קומה.', cta: 'ל־N°8 KLEE' },
  heritage: { kind: 'בניין היסטורי, ליסבון', name: 'Borges 15', body: 'בית בלאפה שנבנה מחדש מהתוכניות, עם דופלקס לסיור.', cta: 'לבורז׳ש 15' },
 },
 footer: { line: 'residence.tech by KNBL', contact: 'ai@kanibal.co.il' },
};

export const copy: Record<Lang, LandingCopy> = { en, he, pt: en };  // the landing offers Hebrew, not Portuguese (lib/i18n LANG_PAGES)
