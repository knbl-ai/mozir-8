import type { Lang } from '@/lib/i18n';

// Studio ORYX × residence.tech — a furniture showcase: ten ORYX pieces placed in one bedroom. English + Hebrew.
// Media: public/projects/studio-oryx/ (gitignored) = gs://knbl-sma/apt3d/site/projects/studio-oryx/; films load via film().

export const M = '/projects/studio-oryx/';

export type ViewId = 'v1-hero' | 'v2-bed' | 'v3-nook' | 'v4-tv' | 'v5-mirror' | 'c1-headboard' | 'c2-chair';
export const viewIds: ViewId[] = ['v1-hero', 'v2-bed', 'v3-nook', 'v4-tv', 'v5-mirror', 'c1-headboard', 'c2-chair'];

export type Piece = { code: string; count?: number; photo: string; seenIn: ViewId[] };
export const pieces: Piece[] = [
 { code: 'M-1', photo: 'm01-bed', seenIn: ['v1-hero', 'v2-bed', 'c1-headboard', 'v5-mirror'] },
 { code: 'M-2', count: 2, photo: 'm02-nightstand', seenIn: ['v1-hero', 'v2-bed'] },
 { code: 'M-3', photo: 'm03-chair', seenIn: ['v3-nook', 'c2-chair', 'v4-tv'] },
 { code: 'M-4', photo: 'm04-lamp', seenIn: ['v3-nook', 'v4-tv'] },
 { code: 'M-5', count: 2, photo: 'm05-macrame', seenIn: ['v1-hero', 'v2-bed', 'v5-mirror'] },
 { code: 'M-6', photo: 'm06-bench', seenIn: ['v1-hero', 'v5-mirror'] },
 { code: 'M-7', photo: 'm07-cabinet', seenIn: ['v3-nook', 'v4-tv'] },
 { code: 'M-8', photo: 'm08-mirror', seenIn: ['v5-mirror', 'v1-hero'] },
 { code: 'M-9', photo: 'm09-tables', seenIn: ['v3-nook', 'c2-chair'] },
 { code: 'M-10', count: 2, photo: 'm10-pendant', seenIn: ['v1-hero', 'v2-bed'] },
];

type Words = { title: string; text: string };

const en = {
 watch: 'Watch the room', heroAlt: 'A calm Cancún bedroom furnished with Studio ORYX pieces, seen from the door',
 heroTitle: ['A bedroom in Cancún,', 'furnished by Studio ORYX'], down: 'Step into the room',
 room: 'The room', moreRoom: 'More of the room',
 filmTitle: 'Walk through the room', filmNote: 'Review draft · 480p', play: 'Play', pause: 'Pause', soundOn: 'Sound on', soundOff: 'Sound off',
 piecesTitle: 'The pieces', piecesText: 'Hand-made in Cancún. Each piece as Studio ORYX photographed it, with its catalogue code.',
 note: 'The room, its light and styling are a proposal, shown in AI-generated images and film made from the floor plan and ORYX product photos. The ORYX photos are the reference for every piece.',
 visualised: 'Visualised by', inRoom: 'In the room:', close: 'Close', prev: 'Previous view', next: 'Next view', of: 'of',
 fullScreen: (t: string) => `${t}: view full screen`, enlarge: (n: string) => `${n}: enlarge the ORYX photo`, photoAlt: (n: string) => `${n}, ORYX studio photo`,
 pieceDialog: 'ORYX piece', viewDialog: 'Room view',
 views: {
  'v1-hero': { title: 'From the door', text: 'The first view on entering: the bed wall between two windows, the bench at its foot, the mirror at the edge.' },
  'v2-bed': { title: 'The bed wall', text: 'The headboard, nightstands, pendants and macramé, in the late-morning light.' },
  'v3-nook': { title: 'Reading corner', text: 'The arc lamp over the lounge chair, the nesting tables beside it, the TV cabinet along the wall.' },
  'v4-tv': { title: 'Toward the TV wall', text: 'From beside the bed: the reading corner, the TV cabinet and the entry door.' },
  'v5-mirror': { title: 'The mirror wall', text: 'The live-edge mirror leans on a plain wall and reflects the bed.' },
  'c1-headboard': { title: 'Headboard detail', text: 'Two planks across a live-edge gap, held by charred X straps.' },
  'c2-chair': { title: 'Chair detail', text: 'Solid walnut slab sides and hand-woven cane.' },
 } as Record<ViewId, Words>,
 pieces: {
  'M-1': { title: 'King bed with headboard', text: 'Reclaimed pine, two headboard planks joined across a live-edge gap by charred X straps, splayed legs.' },
  'M-2': { title: 'Nightstand', text: 'Slab sides down to the floor, an open shelf and one drawer with a cut-out pull.' },
  'M-3': { title: 'Lounge chair', text: 'Low silón with sculpted solid-walnut slab sides and a hand-woven cane seat and back.' },
  'M-4': { title: 'Arc floor lamp', text: 'One bent-walnut arc on a heavy black base, with a streaked black-and-silver drum shade.' },
  'M-5': { title: 'Macramé wall hanging', text: 'A herringbone wood arch over hand-knotted cotton macramé with a long fringe.' },
  'M-6': { title: 'Bench', text: 'Teak frame with splayed legs and a seat of woven natural cotton cord.' },
  'M-7': { title: 'TV cabinet', text: 'Pale oak: two open bays, two doors with finger holes, and a top that floats on short dowels.' },
  'M-8': { title: 'Rustic floor mirror', text: 'Full-length glass between two live-edge walnut slabs.' },
  'M-9': { title: 'Nesting side tables', text: 'A pair of pebble-shaped walnut tops on slim tapered legs.' },
  'M-10': { title: 'Pendant lamp', text: 'A draped linen shade with a free, wavy rim.' },
 } as Record<string, Words>,
};

export type OryxText = typeof en;

const he: OryxText = {
 watch: 'לצפייה בחדר', heroAlt: 'חדר שינה רגוע בקנקון, מרוהט ברהיטי Studio ORYX, במבט מהדלת',
 heroTitle: ['חדר שינה בקנקון,', 'בריהוט Studio ORYX'], down: 'היכנסו לחדר',
 room: 'החדר', moreRoom: 'עוד מהחדר',
 filmTitle: 'סיור בחדר', filmNote: 'טיוטה לבדיקה · 480p', play: 'הפעלה', pause: 'השהיה', soundOn: 'הפעלת קול', soundOff: 'השתקה',
 piecesTitle: 'הרהיטים', piecesText: 'בעבודת יד בקנקון. כל רהיט כפי ש־Studio ORYX צילמו אותו, עם המק״ט שלו בקטלוג.',
 note: 'החדר, האור והסטיילינג הם הצעה עיצובית, המוצגת בתמונות ובסרטון שנוצרו בבינה מלאכותית מתוכנית החדר ומתמונות המוצר של ORYX. תמונות ORYX הן המקור לכל רהיט.',
 visualised: 'הדמיה:', inRoom: 'בחדר:', close: 'סגירה', prev: 'התמונה הקודמת', next: 'התמונה הבאה', of: 'מתוך',
 fullScreen: (t: string) => `${t}: צפייה במסך מלא`, enlarge: (n: string) => `${n}: הגדלת התמונה של ORYX`, photoAlt: (n: string) => `${n}, צילום סטודיו של ORYX`,
 pieceDialog: 'רהיט של ORYX', viewDialog: 'תמונה מהחדר',
 views: {
  'v1-hero': { title: 'מהדלת', text: 'המבט הראשון בכניסה: קיר המיטה בין שני חלונות, הספסל למרגלותיה והמראה בקצה.' },
  'v2-bed': { title: 'קיר המיטה', text: 'ראש המיטה, שידות הלילה, המנורות התלויות והמקרמה, באור של סוף הבוקר.' },
  'v3-nook': { title: 'פינת הקריאה', text: 'מנורת הקשת מעל הכורסה, שולחנות הצד המשתלבים לצידה ומזנון הטלוויזיה לאורך הקיר.' },
  'v4-tv': { title: 'לעבר קיר הטלוויזיה', text: 'מצד המיטה: פינת הקריאה, מזנון הטלוויזיה ודלת הכניסה.' },
  'v5-mirror': { title: 'קיר המראה', text: 'מראה במסגרת עץ טבעי נשענת על קיר חלק ומשקפת את המיטה.' },
  'c1-headboard': { title: 'ראש המיטה מקרוב', text: 'שני לוחות משני צידי מרווח בקו העץ הטבעי, מחוברים ברצועות X מפוחמות.' },
  'c2-chair': { title: 'הכורסה מקרוב', text: 'דפנות מלוח אגוז מלא וקש קלוע ביד.' },
 },
 pieces: {
  'M-1': { title: 'מיטת קינג עם ראש מיטה', text: 'אורן ממוחזר: שני לוחות ראש מיטה מעל מרווח בקו העץ הטבעי, מחוברים ברצועות X מפוחמות, ורגליים מפושקות.' },
  'M-2': { title: 'שידת לילה', text: 'דפנות מלוח מלא עד הרצפה, מדף פתוח ומגירה אחת עם ידית חריץ.' },
  'M-3': { title: 'כורסה נמוכה', text: 'כורסת סילון נמוכה עם דפנות מפוסלות מאגוז מלא, מושב וגב מקש קלוע ביד.' },
  'M-4': { title: 'מנורת קשת עומדת', text: 'קשת אחת מעץ אגוז מכופף על בסיס שחור כבד, עם אהיל תוף בגוונים שחורים וכסופים.' },
  'M-5': { title: 'מקרמה לקיר', text: 'קשת עץ בדוגמת אדרה מעל מקרמה מכותנה שנקשרה ביד, עם פרנזים ארוכים.' },
  'M-6': { title: 'ספסל', text: 'מסגרת טיק עם רגליים מפושקות ומושב קלוע מחבל כותנה טבעי.' },
  'M-7': { title: 'מזנון טלוויזיה', text: 'אלון בהיר: שני תאים פתוחים, שתי דלתות עם חור אצבע ומשטח עליון שמרחף על פינים קצרים.' },
  'M-8': { title: 'מראת רצפה כפרית', text: 'מראה לכל הגובה בין שני לוחות אגוז בקו העץ הטבעי.' },
  'M-9': { title: 'שולחנות צד משתלבים', text: 'זוג משטחי אגוז בצורת אבן נחל על רגליים דקות ומתחדדות.' },
  'M-10': { title: 'מנורה תלויה', text: 'אהיל פשתן נשפך עם שוליים גליים וחופשיים.' },
 },
};

export const oryxText: Record<Lang, OryxText> = { en, he, pt: en };
