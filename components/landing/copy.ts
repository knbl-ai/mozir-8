export type Lang = 'en' | 'he';

export type DemoCopy = {
 kind: string; name: string; body: string; features: string[]; cta: string; hint: string; touchHint: string;
};
export type LandingCopy = {
 brand: string; brandNote: string; languageLabel: string; pending?: string;
 title: string; lede: string; sample: string;
 salesGallery: DemoCopy; openHouse: DemoCopy;
 footer: string;
};

const en: LandingCopy = {
 brand: 'Residences',
 brandNote: 'Property marketing demos',
 languageLabel: 'Language',
 title: 'Two ways to show a home before the first visit.',
 lede: 'This is a working demo of two property-marketing websites. One sells a whole new building, home by home. The other gives a single apartment a website of its own.',
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
 footer: 'A demo, not an offer to sell. Confirm any property detail with the developer.',
};

// Hebrew is written after the English is approved. Until then the page mirrors to right-to-left
// and keeps the English words, so the layout can be reviewed on its own.
const he: LandingCopy = { ...en, pending: 'The Hebrew text is coming once the English is approved. You are seeing the right-to-left layout.' };

export const copy: Record<Lang, LandingCopy> = { en, he };
