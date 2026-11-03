import type { Lang } from '@/lib/i18n';
import type { Age, Programme } from '@/content/projects/lod-daycare';

type Step = { title: string; body: string; still: string };

const he = {
 name: 'מעון יום שיקומי · לוד', plot: 'מגרש 4008',
 tender: 'פרטי המכרז', placeholder: 'הדמיית האדריכל · זמני', inPrep: 'בהכנה',
 stage: {
  eyebrow: 'מגרש 4008 · הרובע הצפון-מערבי החדש של לוד',
  title: ['מקום שכדאי', 'להפעיל.'],
  lead: 'מעון יום שיקומי עירוני לילדים בגילאי \u20660–3\u2069 עם מוגבלויות: שש כיתות, אגף טיפולים וחצר לכל כיתה, בקומה אחת.',
  soon: 'מבט 360° על המבנה במקומו האמיתי, בהכנה',
  hotspotsLabel: 'נקודות במבט:',
  hotspots: { classes: 'הכיתות', kitchen: 'המטבח', entrance: 'הכניסה', yards: 'החצרות' },
 },
 programme: { mixed: 'רב-נכותי', comm: 'תקשורתי' } as Record<Programme, string>,
 ages: { infants: 'תינוקות', toddlers: 'פעוטות', children: 'ילדים' } as Record<Age, string>,
 classN: (n: number) => `כיתה ${n}`,
 what: {
  kicker: 'מה המקום הזה',
  title: 'שש כיתות, שתי תוכניות, שלושה גילאים.',
  lead: 'המבנה נבנה יחד עם משרד הרווחה ומשרת קודם את לוד ואחר כך את האזור. כל כיתה היא בית קטן: חדר של כ-45 מ״ר לעד עשרה ילדים, חדר החתלה ורחצה, מחסן וחצר משלה.',
  figures: [['כיתות', 'עד 10 ילדים בכל אחת'], ['גילאים', 'תינוקות, פעוטות וילדים'], ['מ״ר לכיתה', 'עם חדר החתלה, מחסן וחצר'], ['מטר', 'מבנה בקומה אחת']] as [string, string][],
  gridTitle: 'הכיתות',
  wings: [
   { title: 'אגף הטיפולים', items: ['3 חדרי ריפוי בעיסוק', 'חדר פיזיותרפיה', '2 חדרי קלינאות תקשורת', 'חדר סנוזלן', 'מחסן ציוד'] },
   { title: 'בריאות וצוות', items: ['אחות ודיאטנית', '2 חדרי עובדות סוציאליות', 'חדר צוות וישיבות', 'משרד מנהלת וקבלה'] },
   { title: 'משק', items: ['מטבח, מזווה ועמדת עגלות אוכל', 'מכבסה', 'מחסן מושבי בטיחות בכניסה', 'לובי רב-תכליתי, 70 מ״ר'] },
   { title: 'חוץ', items: ['חצר לכל כיתה, 40 מ״ר', 'חצרות משותפות א׳ ו-ב׳ עם מתקני משחק', 'הצללה לרבע מכל חצר לפחות', 'שמש ישירה בשליש מכל חצר'] },
  ],
  areaNote: (net: number, gross: string) => `${net} מ״ר נטו · ${gross} מ״ר ברוטו לפי הפרוגרמה`,
 },
 day: {
  kicker: 'מבפנים',
  title: 'הכיתות, החצרות והטיפולים.',
  lead: 'הבניין מתוכנן סביב המסלול של כל בוקר: הורדה בכניסה, מושב הבטיחות נשאר ליד הדלת, והילד ממשיך דרך הלובי לכיתה שלו, לחדר ההחתלה ולחצר. אגף הטיפולים נמצא באותה קומה.',
  steps: [
   { title: 'ההסעה מגיעה', body: 'הילדים מגיעים במיניבוס ויורדים ליד הכניסה, והצוות מקבל אותם.', still: 'ההורדה בכניסה' },
   { title: 'מחסן מושבי הבטיחות', body: 'מושבי הבטיחות נשארים במחסן של 15 מ״ר בכניסה, ומחכים שם לנסיעה הביתה.', still: 'הכניסה ומחסן המושבים' },
   { title: 'הכיתה', body: 'דרך הלובי הרב-תכליתי אל כיתת האם: 45 מ״ר, עד עשרה ילדים, ומטבחון בצבע של הכיתה.', still: 'כיתה טיפוסית' },
   { title: 'חדר ההחתלה', body: 'בתוך הכיתה: משטח החתלה, אמבטיית פעוטות, אסלה וכיור נמוכים ואחסון.', still: 'חדר ההחתלה והרחצה' },
   { title: 'החצר של הכיתה', body: 'לכל כיתה חצר משלה, 40 מ״ר, חלקה מקורה וחלקה בשמש.', still: 'החצר של הכיתה' },
  ] as Step[],
 },
 orbit: {
  aria: 'המבנה ב-360°. גררו כדי לסובב, לחצו על אזור לפרטים.', hint: 'גררו לסיבוב', left: 'סיבוב שמאלה', right: 'סיבוב ימינה',
  classLine: '45 מ״ר · עד 10 ילדים',
  zones: { entrance: ['הכניסה', 'הורדה מההסעה ומחסן מושבי הבטיחות'], kitchen: ['המטבח', 'מטבח מבשל, מזווה ועמדת עגלות אוכל'], yards: ['החצרות', 'חצר לכל כיתה, 40 מ״ר, וחצרות משותפות עם מתקני משחק'] },
 },
 classGallery: [
  ['הכניסה לכיתה', 'דרך הלובי הרב-תכליתי אל כיתת האם.'],
  ['כיתה טיפוסית', '45 מ״ר, עד עשרה ילדים, ושולחנות בגובה הילדים.'],
  ['המטבחון של הכיתה', 'מטבחון מעץ בהיר בצבע של הכיתה.'],
  ['חדר ההחתלה', 'בתוך הכיתה: משטח החתלה, אמבטיית פעוטות, אסלה וכיור נמוכים ואחסון.'],
  ['החצר של הכיתה', 'לכל כיתה חצר משלה, 40 מ״ר, חלקה מקורה וחלקה בשמש.'],
  ['מחסן מושבי הבטיחות', 'מושבי הבטיחות נשארים במחסן של 15 מ״ר בכניסה, ומחכים לנסיעה הביתה.'],
  ['הלובי והמסדרון', 'תקרת רפפות עץ, קירות מבטא צבעוניים ודלתות עם חלונות עגולים.'],
  ['חדר הסנוזלן', 'חדר רב-חושי באגף הטיפולים: אור רך, צינור בועות וסיבים אופטיים.'],
  ['שתי כיתות במבט מלמעלה', 'כיתות 2 ו-3 עם חדרי ההחתלה, המחסנים, חדר הטיפול, החצרות והמסדרון.'],
 ] as [string, string][],
 buildingGallery: ['המבנה מלמעלה', 'הכניסה מהרחוב', 'החזית הצפון-מערבית', 'מסך הרפפות בחזית', 'בשעת שקיעה', 'ההסעה בכניסה'],
 galleryUi: { prev: 'התמונה הקודמת', next: 'התמונה הבאה', open: 'הגדלה', close: 'סגירה', zoom: 'זום' },
 projectFilm: {
  kicker: 'הסרט', title: 'המעון בשלושים שניות.',
  caption: 'מהגעת ההסעה בבוקר, דרך הכיתה והחצר, ועד אגף הטיפולים.',
  soon: 'הסרט בהפקה', play: 'צפו בסרט',
 },
 film: {
  kicker: 'הכיתה מבפנים', title: 'סיור בכיתה טיפוסית ובחצר שלה.',
  lead: 'סרט הליכה בכיתה אחת ובחצר שלה, מתוך המודל המדויק של תוכניות המכרז.',
  soon: 'הסרט בהפקה', play: 'צפו בסרט',
 },
 gallery: { kicker: 'המבנה', title: 'כך הוא ייראה.', note: 'הדמיות של המבנה, מתוך המודל המדויק של תוכניות המכרז.' },
 stills: { street: 'הכניסה מהרחוב', long: 'החזית הארוכה וחצרות הכיתות', entrance: 'קיר הכניסה', louvres: 'מסך הרפפות', corridor: 'מסדרון המשחק', aerial: 'המבנה מלמעלה', golden: 'בשעת שקיעה', parkNW: 'החזית הצפון-מערבית', parkFront: 'מסך הרפפות בחזית', classEntry: 'הכניסה לכיתה', klass: 'כיתה טיפוסית', kitchenette: 'המטבחון של הכיתה', yard: 'החצר של הכיתה', classTop: 'הכיתה במבט מלמעלה' },
 finishes: {
  kicker: 'חומרים', title: 'צבעוני, עמיד וקל לתחזוקה.',
  lead: 'לפי תוכניות המכרז: חיפוי לוחות HPL בארבעה גוונים חמים, שליכט אקרילי לבן-שבור ורפפות אלומיניום צבועות באדום, כתום וצהוב. בפנים: תקרות רפפות עץ, קירות מבטא צבעוניים, מטבחונים מעץ בהיר ואריחי \u206620×20\u2069 בגוון סלמון וורוד בחדרים הרטובים.',
  facade: 'חזית', facadeItems: ['לוחות חיפוי HPL בארבעה גוונים חמים', 'שליכט אקרילי לבן-שבור'], facadeNote: 'הקודים המדויקים ייקבעו מול האדריכלים.', louvres: 'רפפות אלומיניום', interior: 'פנים',
  inside: ['תקרות רפפות עץ', 'קירות מבטא בצהוב ובסלמון', 'מטבחונים מעץ בהיר', 'אריחי \u206620×20\u2069 בסלמון ובוורוד', 'ריהוט משחק רך'],
 },
 location: {
  kicker: 'מיקום', title: 'הרובע הצפון-מערבי החדש של לוד.',
  lead: 'בין שכונות המגורים החדשות בצפון-מערב העיר. המבנה, בקומה אחת, מנצל רק חלק מזכויות הבנייה במגרש ומשאיר מקום רב לחצרות.',
  map: 'פתיחה במפות Google', mapNote: 'מתוך מצגת ההיגוי · זמני',
 },
 contact: {
  kicker: 'המכרז', title: 'מחפשים מפעיל.',
  lead: 'כלכלית לוד ועיריית לוד מוציאות את הפעלת המעון למכרז. הבנייה כבר בעיצומה.',
  cta: 'לפרטי המכרז', pending: 'פרטי קשר למכרז: יפורסם בהמשך',
  namePending: 'איש הקשר יפורסם בהמשך', role: 'איש קשר למכרז · כלכלית לוד', phonePending: 'מספר הטלפון יפורסם בהמשך', whatsapp: 'וואטסאפ', email: 'אימייל',
 },
 footer: { client: 'כלכלית לוד · עיריית לוד', architect: 'אדריכלות: רונה-כהן אדריכלים', disclaimer: 'ההדמיות להמחשה בלבד. המידע מבוסס על פרוגרמת התכנון ועל מפרט חומרי הגמר, ועשוי להשתנות.' },
};

type Strings = typeof he;

const en: Strings = {
 name: 'Rehabilitative day care · Lod', plot: 'Plot 4008',
 tender: 'Tender details', placeholder: 'Architect’s render · placeholder', inPrep: 'In preparation',
 stage: {
  eyebrow: 'Plot 4008 · Lod’s new north-western district',
  title: ['A place', 'worth running.'],
  lead: 'A municipal rehabilitative day care for children aged 0–3 with disabilities: six classes, a therapy wing and a yard for every class, all on one floor.',
  soon: '360° view of the building in its real place, in preparation',
  hotspotsLabel: 'In the view:',
  hotspots: { classes: 'Classes', kitchen: 'Kitchen', entrance: 'Entrance', yards: 'Yards' },
 },
 programme: { mixed: 'Mixed-disability', comm: 'Communication' },
 ages: { infants: 'Infants', toddlers: 'Toddlers', children: 'Children' },
 classN: n => `Class ${n}`,
 what: {
  kicker: 'What this place is',
  title: 'Six classes, two programmes, three ages.',
  lead: 'Built with the Ministry of Welfare, the day care serves Lod first, then the region. Each class is a small home: a room of about 45 m² for up to ten children, a changing and bath room, a store and a yard of its own.',
  figures: [['Classes', 'up to 10 children each'], ['Ages', 'infants, toddlers and children'], ['m² per class', 'with changing room, store and yard'], ['metres', 'a single-storey building']],
  gridTitle: 'The classes',
  wings: [
   { title: 'Therapy wing', items: ['3 occupational therapy rooms', 'Physiotherapy', '2 speech therapy rooms', 'Snoezelen room', 'Equipment store'] },
   { title: 'Care and staff', items: ['Nurse and dietitian', '2 social workers’ rooms', 'Staff and meeting room', 'Manager’s office and reception'] },
   { title: 'Services', items: ['Kitchen, pantry and food-trolley bay', 'Laundry', 'Car-seat store at the entrance', 'Multipurpose lobby, 70 m²'] },
   { title: 'Outdoors', items: ['A 40 m² yard for every class', 'Shared yards A and B with play equipment', 'At least a quarter of each yard shaded', 'A third of each yard in direct sun'] },
  ],
  areaNote: (net, gross) => `${net} m² net · ${gross} m² gross by the programme`,
 },
 day: {
  kicker: 'Inside',
  title: 'The classes, the yards and the therapy rooms.',
  lead: 'The building is planned around each morning’s route: drop-off at the entrance, the car seat stays by the door, and the child goes on through the lobby to the class, its changing room and its yard. The therapy wing is on the same floor.',
  steps: [
   { title: 'The minibus arrives', body: 'Children arrive by minibus and are dropped off at the entrance, where the staff take them in.', still: 'Drop-off at the entrance' },
   { title: 'The car-seat store', body: 'Car seats stay in a 15 m² store at the entrance, ready for the ride home.', still: 'Entrance and car-seat store' },
   { title: 'The class', body: 'Through the multipurpose lobby to the home class: 45 m², up to ten children, and a kitchenette in the class’s own colour.', still: 'A typical class' },
   { title: 'The changing room', body: 'Inside the class: changing bench, toddler bath, low toilet and sink, and storage.', still: 'Changing and bath room' },
   { title: 'The class’s own yard', body: 'Every class has a yard of its own: 40 m², part roofed, part in the sun.', still: 'The class yard' },
  ],
 },
 orbit: {
  aria: 'The building in 360°. Drag to turn, click an area for details.', hint: 'Drag to turn', left: 'Turn left', right: 'Turn right',
  classLine: '45 m² · up to 10 children',
  zones: { entrance: ['Entrance', 'Minibus drop-off and the car-seat store'], kitchen: ['Kitchen', 'Cooking kitchen, pantry and food-trolley bay'], yards: ['Yards', 'A 40 m² yard for every class, and shared play yards'] },
 },
 classGallery: [
  ['Into the class', 'Through the multipurpose lobby to the home class.'],
  ['A typical class', '45 m², up to ten children, tables at child height.'],
  ['The class kitchenette', 'A light-wood kitchenette in the class’s own colour.'],
  ['The changing room', 'Inside the class: changing bench, toddler bath, low toilet and sink, and storage.'],
  ['The class’s own yard', 'Every class has a yard of its own: 40 m², part roofed, part in the sun.'],
  ['The car-seat store', 'Car seats stay in a 15 m² store at the entrance, ready for the ride home.'],
  ['The lobby and corridor', 'Timber-slat ceiling, coloured feature walls and doors with round windows.'],
  ['The Snoezelen room', 'A multisensory room in the therapy wing: soft light, bubble tube and fibre optics.'],
  ['Two classes from above', 'Classes 2 and 3 with their changing rooms, stores, the therapy room, the yards and the corridor.'],
 ],
 buildingGallery: ['The building from above', 'The entrance from the street', 'The north-west façade', 'The louvre screen on the façade', 'At golden hour', 'The minibus at the entrance'],
 galleryUi: { prev: 'Previous image', next: 'Next image', open: 'Enlarge', close: 'Close', zoom: 'Zoom' },
 projectFilm: {
  kicker: 'The film', title: 'The day care in thirty seconds.',
  caption: 'From the minibus in the morning, through the class and its yard, to the therapy wing.',
  soon: 'Film in production', play: 'Play the film',
 },
 film: {
  kicker: 'Inside a class', title: 'A walk through a typical class and its yard.',
  lead: 'A walkthrough film of one class and its yard, made from a measured model of the tender drawings.',
  soon: 'Film in production', play: 'Play the film',
 },
 gallery: { kicker: 'The building', title: 'How it will look.', note: 'Visualisations of the building, made from a measured model of the tender drawings.' },
 stills: { street: 'The entrance from the street', long: 'The long façade and the class yards', entrance: 'The entrance wall', louvres: 'The louvre screen', corridor: 'The play corridor', aerial: 'The building from above', golden: 'At golden hour', parkNW: 'The north-west façade', parkFront: 'The louvre screen on the façade', classEntry: 'Into the class', klass: 'A typical class', kitchenette: 'The class kitchenette', yard: 'The class yard', classTop: 'The class from above' },
 finishes: {
  kicker: 'Materials', title: 'Colourful, durable and easy to keep.',
  lead: 'From the tender drawings: HPL cladding panels in four warm tones, off-white acrylic render and aluminium louvres painted red, orange and yellow. Inside: timber-slat ceilings, coloured feature walls, light-wood kitchenettes and 20×20 tiles in salmon and pink in the wet rooms.',
  facade: 'Façade', facadeItems: ['HPL cladding panels in four warm tones', 'Off-white acrylic render'], facadeNote: 'Exact codes to be confirmed with the architect.', louvres: 'Aluminium louvres', interior: 'Interior',
  inside: ['Timber-slat ceilings', 'Yellow and salmon feature walls', 'Light-wood kitchenettes', 'Salmon and pink 20×20 tiles', 'Soft play furniture'],
 },
 location: {
  kicker: 'Location', title: 'Lod’s new north-western district.',
  lead: 'Among the new residential neighbourhoods in the north-west of the city. The single-storey building uses only part of the plot’s building rights, which leaves plenty of room for the yards.',
  map: 'Open in Google Maps', mapNote: 'From the steering deck · placeholder',
 },
 contact: {
  kicker: 'The tender', title: 'Looking for an operator.',
  lead: 'Kalkalit Lod and the Lod Municipality are tendering the operation of the day care. Construction is already under way.',
  cta: 'Tender details', pending: 'Tender contact: TBD',
  namePending: 'Contact person — to be announced', role: 'Tender contact · Kalkalit Lod', phonePending: 'Phone number to be announced', whatsapp: 'WhatsApp', email: 'Email',
 },
 footer: { client: 'Kalkalit Lod · Lod Municipality', architect: 'Architecture: Rona-Cohen Architects', disclaimer: 'Renders are for illustration only. Information is based on the planning programme and the finishes specification and may change.' },
};

export const lodText: Record<Lang, Strings> = { he, en, pt: en };   // Hebrew first + English (lib/i18n LANG_DEFAULTS)
