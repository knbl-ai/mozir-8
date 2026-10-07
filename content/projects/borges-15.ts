import type { Development, ResidenceMedia } from './index';
// Written by `cli promote` (website/scripts/prepare-apt-media.py): only approved media (R-PIPE-PROMOTE). Don't hand-edit.
import promoted from './borges-15.media.json';

// Borges 15, Lapa, Lisbon (LIVO): duplex T3 3B from projects/Borges-15-Lisbon (the apartment pipeline, runbook §11).
// The building and its unit outlines come from building/frames.json (P6, building/scripts/package_frames.py). Media arrive phase by phase
// through `cli promote` (website/scripts/prepare-apt-media.py); an empty src shows "coming soon", never another home's media.
const base = '/projects/borges-15';

export const borges15: Development = {
 id: 'borges-15', name: 'Borges 15', location: 'Lapa · Lisbon',
 description: 'Duplex T3 3B at Borges 15, Lapa: 126 m² over the top two floors, the Tagus to the northwest and the Basilica da Estrela to the southeast.',
 source: 'https://borges15.com/apartment/3B',
 // P6: the building orbit (projects/Borges-15-Lisbon/building): 8 homes outlined, 3B the one listed.
 brand: { logo: `${base}/building/lapa-logo.png`, logoWidth: 95, logoHeight: 38, theme: 'borges', headerTone: 'light', directoryNote: 'Building explorer · Duplex T3 3B · Lapa, Lisbon' },
 currency: '€',
 views: ['3b'],
 info: {
  address: 'Rua Borges Carneiro 15, Lisbon', area: 'Lapa · Estrela parish', kicker: 'Eight apartments in the soul of Lisbon', floors: 5, moveIn: 'August 2027',
  intro: 'A boutique building of eight homes by LIVO in Lapa, Lisbon’s embassy quarter, between the Tagus riverfront and the Basilica da Estrela. Its top two floors hold two duplex T3 residences, delivered with the complete Prime LUX specification and interior design and furniture included.',
  location: ['Lapa is the embassy quarter: tree-lined streets, eighteenth-century mansions and the Basilica da Estrela on the hill, five minutes away on foot. Jardim da Estrela, the Museu Nacional de Arte Antiga and São Bento are all a short walk.',
   'Two new metro stations open within 230 m and 700 m (Infante Santo and Estrela, 2027–2028). Baixa is an 8-minute drive and the airport 12.'],
  disclaimer: 'A demo, not an offer to sell. Interiors, films and furniture are AI-assisted illustrations based on the developer’s plans and Prime LUX renders; areas follow the developer’s plans. Confirm every detail with LIVO.',
  mapQuery: 'Rua Borges Carneiro 15, Lisboa',
 },
 contact: { name: 'Livo Sales', agency: 'LIVO · Borges 15', phone: '+351 918 131 132', phoneIntl: '+351918131132', email: 'sales@borges15.com', role: 'Project sales' },
 // Availability and prices as borges15.com lists them (its apartments table, read 2026-10-06): RC-B is sold, the rest
 // are available. Zones: 0a = RC-A (rear studio, patio), 0b = RC-B (front studio), a = left half from the street.
 listings: { '0a': { price: 549000 }, '1a': { price: 649900 }, '1b': { price: 649900 }, '2a': { price: 694000 }, '2b': { price: 694000 }, '3a': { price: 1395000 }, '3b': { price: 1395000 } },
 he: {
  name: 'בורז׳ש 15', location: 'לאפה · ליסבון', description: 'דופלקס T3 3B בבורז׳ש 15, לאפה: 126 מ״ר בשתי הקומות העליונות, נהר הטז׳ו לצפון־מערב והבזיליקה דה אשטרלה לדרום־מזרח.',
  info: {
   address: 'רואה בורז׳ש קרנרו 15, ליסבון', area: 'לאפה · אשטרלה', kicker: 'שמונה דירות בלב ליסבון', moveIn: 'אוגוסט 2027',
   intro: 'בניין בוטיק של שמונה דירות מבית LIVO בשכונת לאפה, רובע השגרירויות של ליסבון, בין גדת הטז׳ו לבזיליקה דה אשטרלה. בשתי הקומות העליונות שני דופלקסים T3, הנמסרים במפרט Prime LUX המלא, כולל עיצוב פנים וריהוט.',
   location: ['לאפה היא רובע השגרירויות: רחובות מוצלים, אחוזות מהמאה ה־18 והבזיליקה דה אשטרלה על הגבעה, חמש דקות הליכה. גן אשטרלה, המוזיאון הלאומי לאמנות עתיקה וסאו בנטו במרחק הליכה קצר.',
    'שתי תחנות מטרו חדשות נפתחות במרחק 230 מ׳ ו־700 מ׳ (2027–2028). מרכז העיר ההיסטורי במרחק 8 דקות נסיעה, ושדה התעופה 12.'],
   disclaimer: 'הדגמה בלבד ולא הצעה למכירה. העיצוב, הסרטונים והריהוט הם המחשות בסיוע בינה מלאכותית לפי תוכניות היזם והדמיות Prime LUX; השטחים לפי תוכניות היזם. יש לאמת כל פרט מול LIVO.',
  },
  contact: { name: 'מכירות LIVO', agency: 'LIVO · בורז׳ש 15', role: 'מכירות הפרויקט' },
 },
 // The developer's façade render (borges15.com); there is no rear render, so the view has no Front/Rear switch.
 references: [`${base}/building/architect-front.jpg`],
 // Empty sources = not produced yet: the tab shows "coming soon" (R-PIPE-PLACEHOLDER).
 media: { film: { src: '', poster: '' }, images: [], model: '' },
 apartmentMedia: promoted as Record<string, ResidenceMedia>,
 residences: [
  { id: '3b', title: 'Duplex T3 · 3B', shortTitle: 'Duplex 3B', tagline: 'The top of Borges 15: three bedrooms over two floors, the river and the Basilica.', rooms: 4, outdoor: '2 balconies',
   area: 126, outdoorArea: 6.7, exposure: 'Northwest & southeast', label: 'Duplex T3 · Prime LUX', plan: `${base}/plans/3b.webp`, sourceUnits: 'Duplex T3 · 3B',
   description: 'An open living room and kitchen with a guest bedroom and shower room on the entry floor; upstairs, two bedrooms, each with its own shower room and balcony.',
   about: ['The entry floor (floor 3) is one long open room: a kitchen with a stone peninsula, a dining corner and the living room under the window, with an oak stair rising beside it. Off the hall, a bedroom with built-in wardrobes and a shower room. Upstairs (floor 4), two bedrooms at either end, each with a small en-suite shower room and its own balcony under the roof: one toward the Tagus, one over the street toward the Basilica.',
    'Areas follow the developer’s plans (126 m² gross; rooms of 30.6, 11.9, 15.1 and 12.8 m², balconies of 3.4 and 3.2 m²). Delivered as Prime LUX: the interior design and furniture are included. Worth checking: ceiling heights under the roof on floor 4 and the exact view from each balcony.'],
   he: { title: 'דופלקס T3 · 3B', shortTitle: 'דופלקס 3B', tagline: 'הקומה העליונה של בורז׳ש 15: שלושה חדרי שינה בשתי קומות, הנהר והבזיליקה.', outdoor: '2 מרפסות', exposure: 'צפון־מערב ודרום־מזרח', label: 'דופלקס T3 · Prime LUX',
    description: 'סלון ומטבח פתוחים, חדר שינה וחדר מקלחת בקומת הכניסה; למעלה שני חדרי שינה, לכל אחד חדר מקלחת ומרפסת משלו.',
    about: ['קומת הכניסה (קומה 3) היא חלל ארוך ופתוח: מטבח עם אי מאבן, פינת אוכל והסלון מול החלון, ולצידו מדרגות עץ אלון שעולות למעלה. מהמבואה, חדר שינה עם ארונות מובנים וחדר מקלחת. למעלה (קומה 4) שני חדרי שינה בשני הקצוות, לכל אחד חדר מקלחת צמוד ומרפסת קטנה משלו מתחת לגג: אחת מול הטז׳ו ואחת מעל הרחוב לכיוון הבזיליקה.',
     'השטחים לפי תוכניות היזם (126 מ״ר ברוטו; חדרים של 30.6, 11.9, 15.1 ו־12.8 מ״ר, מרפסות של 3.4 ו־3.2 מ״ר). נמסרת במפרט Prime LUX: עיצוב הפנים והריהוט כלולים. כדאי לבדוק: את גובה התקרה מתחת לגג בקומה 4 ואת הנוף המדויק מכל מרפסת.'] } },
  // The other seven homes: facts and plans from borges15.com; their film, images and 3D are not produced (coming soon).
  { id: '3a', title: 'Duplex T3 · 3A', shortTitle: 'Duplex 3A', tagline: 'The twin duplex under the roof: three bedrooms over two floors and the river view.', rooms: 4, outdoor: 'Balconies',
   area: 126, outdoorArea: 0, exposure: 'Northwest & southeast', label: 'Duplex T3', plan: `${base}/plans/3a.webp`, sourceUnits: 'Unit 3A — T3 Duplex — 126 m²',
   description: 'The left-hand duplex on floors 3 and 4, with balconies and views over the river.',
   about: ['Floors 3 and 4 on the left of the façade: the open living room and kitchen on the entry floor, the bedrooms upstairs under the roof, with balconies and a view over the Tagus.',
    'Area and price as borges15.com lists them (126 m², €1,395,000). The film, images and 3D model of this home are in preparation; its twin, 3B, can be explored now.'],
   he: { title: 'דופלקס T3 · 3A', shortTitle: 'דופלקס 3A', tagline: 'הדופלקס התאום מתחת לגג: שלושה חדרי שינה בשתי קומות ונוף לנהר.', outdoor: 'מרפסות', exposure: 'צפון־מערב ודרום־מזרח', label: 'דופלקס T3',
    description: 'הדופלקס השמאלי בקומות 3 ו־4, עם מרפסות ונוף לנהר.',
    about: ['קומות 3 ו־4 בצד שמאל של החזית: סלון ומטבח פתוחים בקומת הכניסה, וחדרי השינה למעלה מתחת לגג, עם מרפסות ונוף לטז׳ו.',
     'השטח והמחיר לפי borges15.com (126 מ״ר, 1,395,000 אירו). הסרטון, התמונות והמודל התלת־ממדי של הדירה בהכנה; את התאומה שלה, 3B, אפשר לסייר כבר עכשיו.'] } },
  ...(['2a', '2b', '1a', '1b'] as const).map(id => {
   const floor = id[0], side = id[1] === 'a' ? 'left' : 'right', U = id.toUpperCase();
   const made = id === '1a';   // 1A is produced (projects/Borges-15-Lisbon/1a): its own top-down plan, film, images and 3D
   return { id, title: `T1 · ${U}`, shortTitle: `T1 ${U}`, tagline: `A one-bedroom home on floor ${floor}, from the tiled street front to the garden side.`, rooms: 2, outdoor: made ? 'Juliet balconies' : 'Balcony',
    area: 68, outdoorArea: 0, exposure: 'Street & garden', label: 'T1', plan: made ? `${base}/plans/1a.webp` : `${base}/plans/t1.webp`, sourceUnits: `Unit ${U} — T1 — 68 m²`,
    description: `The ${side} half of floor ${floor}: a living room and kitchen, a bedroom and a bathroom, with premium finishes.`,
    about: [`Floor ${floor}, the ${side} half of the building as seen from the street. One bedroom and one bathroom in 68 m², bright and fully finished: a home for one or two, or a rental investment.`,
     `Area and price as borges15.com lists them (68 m², €${floor === '1' ? '649,900' : '694,000'}). ${made ? 'The plan, film, images and 3D model show this home furnished in the Prime LUX style; the furniture is illustrative.' : 'The plan shown is the developer\'s T1 plan (unit 1A). The film, images and 3D model of this home are in preparation.'}`],
    he: { title: `T1 · ${U}`, shortTitle: `T1 ${U}`, tagline: `דירת חדר שינה אחד בקומה ${floor}, מחזית האריחים אל צד הגן.`, outdoor: made ? 'מרפסות צרפתיות' : 'מרפסת', exposure: 'רחוב וגן', label: 'T1',
     description: `החצי ה${side === 'left' ? 'שמאלי' : 'ימני'} של קומה ${floor}: סלון ומטבח, חדר שינה וחדר רחצה, בגימור פרימיום.`,
     about: [`קומה ${floor}, החצי ה${side === 'left' ? 'שמאלי' : 'ימני'} של הבניין במבט מהרחוב. חדר שינה וחדר רחצה ב־68 מ״ר, מוארת ומוגמרת: בית לאחד או לשניים, או השקעה להשכרה.`,
      `השטח והמחיר לפי borges15.com (68 מ״ר, ${floor === '1' ? '649,900' : '694,000'} אירו). ${made ? 'התוכנית, הסרטון, התמונות והמודל התלת־ממדי מציגים את הדירה מרוהטת בסגנון Prime LUX; הריהוט להמחשה בלבד.' : 'התוכנית המוצגת היא תוכנית ה־T1 של היזם (דירה 1A). הסרטון, התמונות והמודל התלת־ממדי של הדירה בהכנה.'}`] } };
  }),
  { id: '0a', title: 'Studio · RC-A', shortTitle: 'Studio RC-A', tagline: 'The only studio with its own outdoor space: a 22 m² patio onto the garden.', rooms: 1, outdoor: 'Patio',
   area: 48, outdoorArea: 22, exposure: 'Garden side', label: 'T0 + patio', plan: `${base}/plans/rc-a.webp`, sourceUnits: 'Unit RC-A — T0 + Patio — 48 m²',
   description: 'A ground-floor studio at the back of the building, opening onto its own patio, with a sleeping loft under a 3.65 m ceiling.',
   about: ['The only studio in Borges 15 with private outdoor space: a 22 m² patio at the back, onto the garden. A 3.65-metre ceiling carries a sleeping loft of 2.5 by 3.2 metres; 48 m² plus an 8 m² loft, with light from two sides.',
    'Area and price as borges15.com lists them (48 m² + 22 m² patio, €549,000). The film, images and 3D model of this home are in preparation.'],
   he: { title: 'סטודיו · RC-A', shortTitle: 'סטודיו RC-A', tagline: 'הסטודיו היחיד עם שטח חוץ משלו: פטיו של 22 מ״ר אל הגן.', outdoor: 'פטיו', exposure: 'צד הגן', label: 'T0 + פטיו',
    description: 'סטודיו בקומת הקרקע בעורף הבניין, שנפתח אל פטיו פרטי, עם גלריית שינה מתחת לתקרה בגובה 3.65 מ׳.',
    about: ['הסטודיו היחיד בבורז׳ש 15 עם שטח חוץ פרטי: פטיו של 22 מ״ר בעורף, אל הגן. תקרה בגובה 3.65 מ׳ נושאת גלריית שינה של 2.5 על 3.2 מ׳; 48 מ״ר ועוד גלריה של 8 מ״ר, עם אור משני כיוונים.',
     'השטח והמחיר לפי borges15.com (48 מ״ר ועוד פטיו של 22 מ״ר, 549,000 אירו). הסרטון, התמונות והמודל התלת־ממדי של הדירה בהכנה.'] } },
  { id: '0b', title: 'Studio · RC-B', shortTitle: 'Studio RC-B', tagline: 'A ground-floor studio at the front entrance.', rooms: 1, outdoor: 'None',
   area: 48, outdoorArea: 0, exposure: 'Street front', label: 'T0', plan: `${base}/plans/rc-b.webp`, sourceUnits: 'Unit RC-B — T0 Front — 48 m²',
   description: 'A ground-floor studio by the front entrance. Sold.',
   about: ['A ground-floor studio by the front entrance, 48 m². borges15.com lists it as sold.'],
   he: { title: 'סטודיו · RC-B', shortTitle: 'סטודיו RC-B', tagline: 'סטודיו בקומת הקרקע, ליד הכניסה הראשית.', outdoor: 'אין', exposure: 'חזית הרחוב', label: 'T0',
    description: 'סטודיו בקומת הקרקע ליד הכניסה הראשית. נמכר.',
    about: ['סטודיו בקומת הקרקע ליד הכניסה הראשית, 48 מ״ר. לפי borges15.com הדירה נמכרה.'] } },
 ],
};
