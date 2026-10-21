import type { Lang } from '@/lib/i18n';

export type ProjectCopy = { kind: string; name: string; body: string; cta: string };
export type Item = { title: string; body: string };
export type DeliverableKey = 'film' | 'model' | 'images' | 'building' | 'site' | 'languages';
export type LandingCopy = {
 nav: { how: string; package: string; projects: string; trial: string };
 hero: { lead: string; to: string; words: string[]; lede: string; ledeLead?: [string, string, string]; cta: string; watch: string; play: string; filmLabel: string };
 process: {
  title: string; replay: string;
  step1: Item & { file: string; uploading: string; uploaded: string; planAlt: string };
  engine: { label: string; note: string };
  step2: Item & { note?: string };
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
  salesGallery: ProjectCopy; openHouse: ProjectCopy; penthouse: ProjectCopy; boutique: ProjectCopy; heritage: ProjectCopy; furniture: ProjectCopy;
 };
 footer: { line: string; contact: string };
 thanks: { kicker: string; title: string; body: (email: string | null) => string; next: string; home: string; projects: string };
};

const en: LandingCopy = {
 nav: { how: 'How it works', package: 'What you get', projects: 'Projects', trial: 'Let’s talk' },
 hero: {
  lead: 'From floor plans',
  to: 'to buyer',
  words: ['experience.'],
  lede: 'Everything you need to market your project – unit walkthroughs, 3D visuals, social-ready assets and a project marketing film.',
  cta: 'Get started',
  watch: 'Watch the film',
  play: 'Play video',
  filmLabel: 'residence.tech in 50 seconds',
 },
 process: {
  title: 'How it works',
  replay: 'Replay',
  step1: { title: 'Tell us about your project and send plans', body: '', file: 'apartment-1-plan.pdf', uploading: 'Uploading', uploaded: 'Uploaded', planAlt: 'The architect’s floor plan of a one-bedroom apartment' },
  engine: { label: 'residence.tech', note: '≈ 1 day' },
  step2: { title: 'Get a complete sales toolkit', body: '', note: 'All assets downloadable in full resolution.' },
  icons: { film: 'Unit walkthroughs', model: '3D visuals', images: 'Social-ready assets', building: 'Building', site: 'Project brand film', languages: 'Languages' },
  details: { film: 'Every home, with sound', model: 'Interactive and photoreal', images: 'Every room, full resolution', building: 'Live availability', site: 'The mood of the whole project', languages: 'EN · עב · PT' },
  link: 'residence.tech/klee-8/apt-1', share: 'Share',
 },
 package: {
  title: 'What you get',
  lede: '',
  example: 'Shown with N°8 KLEE, apartment 2, Tel Aviv: made from the plans above.',
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
  title: 'Ready to turn floor plans into a project that sells?',
  lede: 'Leave your details.\nWe’ll get back to you fast, review your needs, and show you how we can build the right sales experience for it.',
  points: ['Fast response', 'Tailored to your project', 'Fair pricing'],
  name: 'Name', email: 'Email', phone: 'Phone', description: 'About the project', descriptionHint: 'Address, number of homes, anything we should know',
  plan: 'Floor plan', planHint: 'PDF, JPG, PNG or WebP, up to 25 MB', planChoose: 'Drop the file here or choose one', planReplace: 'Replace', planRemove: 'Remove',
  submit: 'Let’s talk', sending: 'Sending…', uploading: 'Uploading the plan', required: 'required',
  doneTitle: 'Your plan is with us',
  done: email => `We’ve sent a confirmation to ${email}. We’ll be in touch shortly.`,
  again: 'Send another plan',
  errors: {
   email: 'Enter an email address, like name@company.com.',
   type: 'This file type isn’t supported. Use a PDF, JPG, PNG or WebP.',
   size: 'This file is over 25 MB. Send a smaller export of the plan.',
   rate: 'Too many requests from this connection. Try again in an hour, or write to info@residence.tech.',
   upload: 'The plan didn’t upload. Check your connection and try again.',
   server: 'Something went wrong on our side. Try again, or write to info@residence.tech.',
  },
  privacy: 'We use your details only to reply to this request.',
 },
 projects: {
  title: 'Made with residence.tech',
  lede: 'Real projects, each made from its floor plans. Availability is sample data.',
  newTab: 'opens in a new tab',
  salesGallery: { kind: 'New development', name: 'Hurgin 29, Ramat Gan', body: 'Turn the building, see which homes are for sale, open any one.', cta: 'Open Hurgin 29' },
  openHouse: { kind: 'Single apartment', name: 'Mozir 8', body: 'One apartment with a website of its own: film, rooms and 3D.', cta: 'Visit Mozir 8' },
  penthouse: { kind: 'Luxury home', name: 'A.f.k Penthouse', body: 'A penthouse found on its tower, in the project’s own look.', cta: 'Open the penthouse' },
  boutique: { kind: 'Boutique building', name: 'N°8 KLEE', body: 'Three homes to step into, a garden duplex floor by floor.', cta: 'Open N°8 KLEE' },
  heritage: { kind: 'Historic building, Lisbon', name: 'Borges 15', body: 'A Lapa house rebuilt from its plans, with a duplex to walk through.', cta: 'Open Borges 15' },
  furniture: { kind: 'Furniture maker, Cancún', name: 'Studio ORYX', body: 'Ten hand-made pieces placed in one bedroom from its plan, with a film of the room.', cta: 'Open Studio ORYX' },
 },
 footer: { line: 'residence.tech by KNBL', contact: 'info@residence.tech' },
 thanks: {
  kicker: 'Request received',
  title: 'Thank you. Your plan is with us.',
  body: email => email ? `We’ve sent a confirmation to ${email}. Our team will prepare your demo and be in touch within one business day.` : 'Our team will prepare your demo and be in touch within one business day.',
  next: 'Meanwhile, see what a finished project looks like.',
  home: 'Back to residence.tech',
  projects: 'See the projects',
 },
};

const he: LandingCopy = {
 nav: { how: 'איך זה עובד', package: 'מה מקבלים', projects: 'פרויקטים', trial: 'בואו נדבר' },
 hero: {
  lead: 'מתוכניות דירה',
  to: '',
  words: ['לחווייה שבאמת מוכרת'],
  ledeLead: ['תנו למתעניינים ', 'להרגיש', ' את העתיד במקום סתם לדמיין אותו:'],
  lede: 'אתר פרויקט עם סיורי דירות בווידאו, הדמיות 3D מעוצבות, חומרים לסושיאל וסרט שיווקי ממותג שמחבר הכל.',
  cta: 'בואו נתחיל',
  watch: 'צפו בסרטון',
  play: 'צפו בסרטון',
  filmLabel: 'residence.tech ב־50 שניות',
 },
 process: {
  title: 'איך זה עובד?',
  replay: 'שוב',
  step1: { title: 'מספרים לנו על הפרויקט ושולחים תוכניות דירה', body: '', file: 'apartment-1-plan.pdf', uploading: 'מעלים', uploaded: 'הועלה', planAlt: 'תוכנית האדריכל של דירת שני חדרים' },
  engine: { label: 'residence.tech', note: '' },
  step2: { title: 'מקבלים אתר פרויקט מושלם עם כל מה שצריך כדי למכור', body: '' },
  icons: { film: 'סיור וידאו לכל דירה', model: 'הדמיות 3D מעוצבות', images: 'תוצרים להורדה לסושיאל', building: 'תצוגת בניין בתלת־\u2060מימד', site: 'סרט ממותג לכל הפרויקט', languages: 'עמודים בכל שפה' },
  details: { film: 'באיכות מטורפת ועם סאונד', model: 'אינטראקטיבית וריאליסטית', images: 'לכל חדר בנפרד ולכל הדירה', building: 'עם דירות שנמכרו וכאלה שעוד לא', site: 'להיכנס לאווירה ולדמיין את העתיד', languages: 'עבור כל קהל יעד' },
  link: 'residence.tech/klee-8/apt-1', share: 'שיתוף',
 },
 package: {
  title: 'טעימה מהתוצרים שתקבלו באתר הפרויקט',
  lede: '',
  example: 'בדוגמה: N°8 KLEE, דירה 2, תל אביב — מהתוכניות שלמעלה.',
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
  title: 'מוכנים להפוך את הפרויקט שלכם לחווייה שבאמת מוכרת?',
  lede: 'השאירו פרטים.\nנחזור אליכם במהירות, נבין את הצרכים שלכם ונבנה לפרויקט שלכם חוויית מכירה מדויקת.',
  points: ['מענה מהיר', 'מותאם לפרויקט שלכם', 'מחיר משתלם'],
  name: 'שם', email: 'אימייל', phone: 'טלפון', description: 'על הפרויקט', descriptionHint: 'כתובת, מספר דירות, כל מה שכדאי שנדע',
  plan: 'תוכנית דירה', planHint: 'PDF‏, JPG‏, PNG או WebP, עד 25MB', planChoose: 'גררו קובץ לכאן או בחרו קובץ', planReplace: 'החלפה', planRemove: 'הסרה',
  submit: 'בואו נדבר', sending: 'שולחים…', uploading: 'מעלים את התוכנית', required: 'שדה חובה',
  doneTitle: 'התוכנית אצלנו',
  done: email => `שלחנו אישור ל־${email}. נחזור אליכם בקרוב.`,
  again: 'שליחת תוכנית נוספת',
  errors: {
   email: 'הזינו כתובת אימייל, למשל name@company.com.',
   type: 'סוג הקובץ לא נתמך. השתמשו ב־PDF‏, JPG‏, PNG או WebP.',
   size: 'הקובץ גדול מ־25MB. שלחו גרסה קטנה יותר של התוכנית.',
   rate: 'יותר מדי בקשות מהחיבור הזה. נסו שוב בעוד שעה, או כתבו ל־info@residence.tech.',
   upload: 'התוכנית לא עלתה. בדקו את החיבור ונסו שוב.',
   server: 'משהו השתבש אצלנו. נסו שוב, או כתבו ל־info@residence.tech.',
  },
  privacy: 'נשתמש בפרטים רק כדי לענות לפנייה הזו.',
 },
 projects: {
  title: 'נוצר עם residence.tech',
  lede: 'פרויקטים אמיתיים, כל אחד נבנה מהתוכניות שלו. הזמינות היא לדוגמה.',
  newTab: 'נפתח בכרטיסייה חדשה',
  salesGallery: { kind: 'פרויקט חדש', name: 'חורגין 29, רמת גן', body: 'מסובבים את הבניין, רואים מה למכירה, פותחים כל דירה.', cta: 'לחורגין 29' },
  openHouse: { kind: 'דירה אחת', name: 'מוזיר 8', body: 'דירה אחת עם אתר משלה: סרטון, חדרים ותלת־\u2060מימד.', cta: 'למוזיר 8' },
  penthouse: { kind: 'דירת יוקרה', name: 'הפנטהאוז ב־A.f.k', body: 'פנטהאוז שמוצאים על המגדל שלו, בעיצוב הפרויקט.', cta: 'לפנטהאוז' },
  boutique: { kind: 'בניין בוטיק', name: 'N°8 KLEE', body: 'שלוש דירות להיכנס אליהן, ודופלקס גן קומה אחר קומה.', cta: 'ל־N°8 KLEE' },
  heritage: { kind: 'בניין היסטורי, ליסבון', name: 'Borges 15', body: 'בית בלאפה שנבנה מחדש מהתוכניות, עם דופלקס לסיור.', cta: 'לבורז׳ש 15' },
  furniture: { kind: 'יצרן רהיטים, קנקון', name: 'Studio ORYX', body: 'עשרה רהיטים בעבודת יד, מוצבים בחדר שינה אחד לפי התוכנית, עם סרטון של החדר.', cta: 'ל־Studio ORYX' },
 },
 footer: { line: 'residence.tech by KNBL', contact: 'info@residence.tech' },
 thanks: {
  kicker: 'הבקשה התקבלה',
  title: 'תודה! התוכנית שלכם אצלנו.',
  body: email => email ? `שלחנו אישור ל־${email}. הצוות שלנו יכין לכם הדגמה ויחזור אליכם תוך יום עבודה.` : 'הצוות שלנו יכין לכם הדגמה ויחזור אליכם תוך יום עבודה.',
  next: 'בינתיים, אפשר לראות איך נראה פרויקט מוכן.',
  home: 'חזרה ל־residence.tech',
  projects: 'לפרויקטים',
 },
};

export const copy: Record<Lang, LandingCopy> = { en, he, pt: en };  // the landing offers Hebrew, not Portuguese (lib/i18n LANG_PAGES)
