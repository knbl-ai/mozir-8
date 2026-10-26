import type { Lang } from '@/lib/i18n';

// Hayarkon 56, apartment 2 (Noga Group): the interior-design edition of the apartment. Design notes follow the
// apartment's Teak Gallery room variations (data/projects/Hayarkon-56-Tel-Aviv/apt2/apartment.yaml, style.room_variation).
export type MaterialId = 'teak' | 'limestone' | 'calacatta' | 'walnut' | 'brass' | 'cobalt';
type L = { en: string; he: string };
export type Room = { id: string; image: string; alt?: string; name: L; note: L; materials: MaterialId[] };

export const MATERIALS: { id: MaterialId; hex: string; name: L; where: L }[] = [
 { id: 'teak', hex: '#A0602F', name: { en: 'Honey teak', he: 'טיק דבש' },
  where: { en: 'Book-matched veneer on the living-room wall, the kitchen’s tall units and the study shelves.', he: 'פורניר טיק בהתאמת ספר על קיר הסלון, ארונות המטבח הגבוהים ומדפי חדר העבודה.' } },
 { id: 'limestone', hex: '#BDAA95', name: { en: 'Greige limestone', he: 'אבן גיר אפרפרה' },
  where: { en: 'Large floor slabs with a hairline brass inlay, the kitchen island top and the balcony pavers.', he: 'לוחות ריצוף גדולים עם פס פליז דק, משטח האי במטבח ואבני המרפסת.' } },
 { id: 'calacatta', hex: '#E6E0D6', name: { en: 'Calacatta marble', he: 'שיש קלקטה' },
  where: { en: 'The family bathroom, floor to ceiling, and the bath clad in the same stone.', he: 'חדר הרחצה המשפחתי, מהרצפה עד התקרה, והאמבטיה מצופה באותה אבן.' } },
 { id: 'walnut', hex: '#5A3A2A', name: { en: 'Dark walnut', he: 'אגוז כהה' },
  where: { en: 'The slatted coffee table, the kitchen stools and the study desk.', he: 'שולחן הקפה המרושת, כיסאות הבר במטבח ושולחן העבודה.' } },
 { id: 'brass', hex: '#B8995A', name: { en: 'Brass and crystal', he: 'פליז וקריסטל' },
  where: { en: 'The pendant cloud over the dining table, lamp bases and the bronze taps.', he: 'ענן התאורה מעל שולחן האוכל, בסיסי המנורות וברזי הברונזה.' } },
 { id: 'cobalt', hex: '#1F3F8F', name: { en: 'Cobalt velvet', he: 'קטיפה בכחול קובלט' },
  where: { en: 'One blue in every room: a cushion, a jug, a rug, a chair.', he: 'כחול אחד בכל חדר: כרית, קנקן, שטיח, כיסא.' } },
];

export const ROOMS: Room[] = [
 { id: 'living', image: 'living', alt: 'living-tv', materials: ['teak', 'walnut', 'limestone', 'cobalt'],
  name: { en: 'The living room', he: 'הסלון' },
  note: { en: 'One room of about eleven metres. A full-height teak wall holds the media shelf and three pale ceramics; an oatmeal linen sofa and two suede tub chairs face a slatted walnut table, and the palms of HaYarkon Street fill the six-metre glazing.',
   he: 'חלל אחד של כאחד עשר מטרים. קיר טיק לכל הגובה נושא את מדף המדיה ושלושה כלי קרמיקה בהירים; ספה בפשתן שיבולת שועל ושתי כורסאות זמש פונות אל שולחן אגוז מרושת, ודקלי רחוב הירקון ממלאים את חזית הזכוכית ברוחב שישה מטרים.' } },
 { id: 'kitchen', image: 'kitchen', alt: 'dining', materials: ['teak', 'limestone', 'walnut', 'brass', 'cobalt'],
  name: { en: 'Kitchen and dining', he: 'מטבח ופינת אוכל' },
  note: { en: 'A wall of flush teak units hides every appliance. The island is warm-white lacquer under a thick honed limestone top, with four walnut stools; beyond it a smoked-glass table for eight sits under a loose cloud of crystal and brass.',
   he: 'קיר של ארונות טיק שטוחים מסתיר כל מכשיר. האי בלכה לבנה חמה תחת משטח עבה של אבן גיר מושחזת, עם ארבעה כיסאות אגוז; מאחוריו שולחן זכוכית מעושנת לשמונה, תחת ענן רך של קריסטל ופליז.' } },
 { id: 'balcony', image: 'balcony', materials: ['limestone'],
  name: { en: 'The covered balcony', he: 'המרפסת המקורה' },
  note: { en: 'Sixteen square metres along the living side: pale stone pavers, a long table for eight, olive and rosemary in planters, and the street’s trees at eye level from the first floor.',
   he: 'שישה עשר מטרים רבועים לאורך צד המגורים: אבני ריצוף בהירות, שולחן ארוך לשמונה, זית ורוזמרין באדניות, ועצי הרחוב בגובה העיניים מהקומה הראשונה.' } },
 { id: 'bedroom', image: 'bedroom', materials: ['cobalt'],
  name: { en: 'The second bedroom', he: 'חדר השינה השני' },
  note: { en: 'Kept for the grandchildren: a light oak desk wall with a cushioned bench, a single bed in oatmeal linen and a cobalt wool rug under the window.',
   he: 'שמור לנכדים: קיר שולחן מאלון בהיר עם ספסל מרופד, מיטת יחיד בפשתן ושטיח צמר בכחול קובלט מתחת לחלון.' } },
 { id: 'bath', image: 'bath', materials: ['calacatta', 'limestone', 'brass', 'teak'],
  name: { en: 'The family bathroom', he: 'חדר הרחצה המשפחתי' },
  note: { en: 'Floor-to-ceiling Calacatta, a bath clad in the same stone under the frosted window, a floating stone vanity with a bronze tap, and one teak stool for warmth.',
   he: 'שיש קלקטה מהרצפה עד התקרה, אמבטיה מצופה באותה אבן מתחת לחלון החלבי, כיור אבן צף עם ברז ברונזה, ושרפרף טיק אחד לחום.' } },
 { id: 'study', image: 'study', materials: ['teak', 'walnut', 'cobalt'],
  name: { en: 'The study', he: 'חדר העבודה' },
  note: { en: 'The safe room, furnished as a study and guest room: a teak shelving wall with a lit shelf, a slim walnut desk and one cobalt velvet chair.',
   he: 'הממ״ד, מרוהט כחדר עבודה ואירוח: קיר מדפי טיק עם מדף מואר, שולחן אגוז צר וכיסא קטיפה אחד בכחול קובלט.' } },
 { id: 'master', image: 'master', materials: ['limestone', 'cobalt', 'brass'],
  name: { en: 'The master suite', he: 'סוויטת ההורים' },
  note: { en: 'In its own wing at the end of the corridor: a quilted taupe bed against a stone wall, a cobalt velvet armchair, egg-shaped glass lamps on brass, and windows on two sides into the palms.',
   he: 'באגף משלה בקצה המסדרון: מיטה מרופדת בגוון טאופ מול קיר אבן, כורסת קטיפה בכחול קובלט, מנורות זכוכית בצורת ביצה על בסיס פליז, וחלונות לשני כיוונים אל הדקלים.' } },
];

const en = {
 title: 'Hayarkon 56',
 lede: 'Apartment 2, a 152 m² home on Tel Aviv’s seafront street, designed as a private gallery in teak, limestone and one blue.',
 watch: 'Watch the film', turn: 'Turn it in 3D',
 credit: 'Developer: Noga Group. Visualised by residence.tech.',
 heroAlt: 'The long living room of Hayarkon 56, apartment 2, looking toward the balcony and the palms',
 materialsTitle: 'Six materials make every room',
 materialsLede: 'Pick a material to see where it is used.',
 foundIn: 'Found in',
 roomsTitle: 'Through the apartment',
 open: (room: string) => `Enlarge: ${room}`, another: 'Another view',
 filmTitle: 'The walk, in one continuous take',
 filmLede: 'From the front door to the master suite in 75 seconds, with the sound of the street through the open glazing.',
 play: 'Play the film',
 modelTitle: 'The whole home, from above',
 modelLede: 'Turn the light-baked model, or step back to the plan.',
 planAlt: 'The whole apartment from above',
 closingTitle: 'Every apartment can have a design of its own',
 closingLede: 'This interior uses Teak Gallery, one of eighteen styles in our library. Each home gets one style, and each room its own variation of it.',
 styles: 'See the style library', tryIt: 'Send us a floor plan',
 salesPage: 'The apartment’s sales page', home: 'residence.tech',
 address: 'HaYarkon 56, Tel Aviv',
 disclaimer: 'A visualisation for illustration only, not an offer to sell and not part of any contract. Furniture, finishes, views and light are an artistic interpretation of the developer’s plan. The safe room is shown furnished as a study and is not presented as certified.',
 close: 'Close', prev: 'Previous image', next: 'Next image',
};
type Strings = typeof en;

const he: Strings = {
 title: 'הירקון 56',
 lede: 'דירה 2, בית של 152 מ״ר ברחוב החוף של תל אביב, מעוצב כגלריה פרטית בטיק, אבן גיר וכחול אחד.',
 watch: 'לצפייה בסרט', turn: 'לסיבוב בתלת־מימד',
 credit: 'יזם: נוגה גרופ. הדמיה: residence.tech.',
 heroAlt: 'הסלון הארוך בהירקון 56, דירה 2, במבט אל המרפסת והדקלים',
 materialsTitle: 'שישה חומרים בונים כל חדר',
 materialsLede: 'בחרו חומר כדי לראות היכן הוא נמצא.',
 foundIn: 'נמצא ב',
 roomsTitle: 'לאורך הדירה',
 open: room => `הגדלה: ${room}`, another: 'מבט נוסף',
 filmTitle: 'הסיור, בצילום רציף אחד',
 filmLede: 'מדלת הכניסה ועד סוויטת ההורים ב־75 שניות, עם קולות הרחוב דרך חזית הזכוכית הפתוחה.',
 play: 'הפעלת הסרט',
 modelTitle: 'הבית כולו, ממבט על',
 modelLede: 'סובבו את המודל, או התרחקו אל התוכנית.',
 planAlt: 'הדירה כולה ממבט על',
 closingTitle: 'לכל דירה יכול להיות עיצוב משלה',
 closingLede: 'הפנים כאן מעוצב בסגנון Teak Gallery, אחד משמונה עשר הסגנונות בספרייה שלנו. כל בית מקבל סגנון אחד, וכל חדר וריאציה משלו.',
 styles: 'לספריית הסגנונות', tryIt: 'שלחו לנו תוכנית',
 salesPage: 'דף המכירה של הדירה', home: 'residence.tech',
 address: 'הירקון 56, תל אביב',
 disclaimer: 'הדמיה להמחשה בלבד, אינה הצעה למכירה ואינה חלק מחוזה. הריהוט, הגימורים, הנוף והתאורה הם פרשנות אמנותית של תוכנית היזם. הממ״ד מוצג מרוהט כחדר עבודה ואינו מוצג כמאושר.',
 close: 'סגירה', prev: 'התמונה הקודמת', next: 'התמונה הבאה',
};

export const hayarkonText: Record<Lang, Strings> = { en, he, pt: en };
