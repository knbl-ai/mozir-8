export type MediaImage = { src: string; label: string };
// Everything a buyer can look at for one home. Any field left out falls back a level:
// apartment → residence type → the project's shared (placeholder) set.
export type ResidenceMedia = { film?: { src: string; poster: string }; images?: MediaImage[]; model?: string };
export type Residence = { id: string; title: string; shortTitle: string; rooms: number; outdoor: string; label: string; plan: string; description: string; sourceUnits: string; about: string[]; media?: ResidenceMedia };
export type ApartmentZone = { unit: string; apartment: string; status: 'for-sale' | 'sold'; floor: string; labelPoints: [number, number][]; points: string };
export type BuildingFrame = { src: string; hotspots: ApartmentZone[] };
export type Development = { id: string; name: string; location: string; description: string; references: string[]; residences: Residence[]; enquiryUrl: string; media: Required<ResidenceMedia>; apartmentMedia?: Record<string, ResidenceMedia> };
const base = '/projects/building-preview';
const placeholderImages: MediaImage[] = [
 { src: '/media/01_living.webp', label: 'Living & dining' }, { src: '/media/02_main_bedroom.webp', label: 'Main bedroom' },
 { src: '/media/03_ensuite.webp', label: 'En-suite bathroom' }, { src: '/media/04_small_bedroom.webp', label: 'Second bedroom' },
 { src: '/media/05_large_bathroom.webp', label: 'Main bathroom' }, { src: '/media/06_kitchen.webp', label: 'Kitchen' },
 { src: '/media/07_overhead.webp', label: 'Apartment overview' }, { src: '/media/08_terrace_end.webp', label: 'Terrace' },
];
export const developments: Development[] = [{
 id: 'building-preview', name: 'The next address', location: 'PROJECT PREVIEW',
 description: 'A new perspective on home. Explore the building, find your space, and discover the possibilities within.',
 references: [`${base}/building/exterior-front.jpg`, `${base}/building/exterior-rear.jpg`],
 enquiryUrl: 'https://www.yad2.co.il/yad1/project/6731',
 media: { film: { src: '/media/residence-film.mp4', poster: '/media/01_living.webp' }, images: placeholderImages, model: '/models/apartment.glb' },
 residences: [
 { id:'garden', title:'The Garden Residence', shortTitle:'Garden residence', rooms:4, outdoor:'Garden', label:'A private outdoor life', plan:`${base}/plans/garden.jpg`, sourceUnits:'01', description:'A four-room home opening onto a generous private garden, with living and dining at its heart.',
  about:['This ground-floor, four-room layout opens onto a private garden, with the living and dining areas at the centre of the home. The outdoor space is the main difference from the upper-floor layouts and is worth reviewing alongside the indoor furniture arrangement.','Check the route between the living area and garden, the boundary and privacy arrangements, and how the outdoor space can be accessed and maintained. Confirm the garden area, drainage, step-free access and any parking or storage allocation with the project team.'] },
 { id:'four-room', title:'Rear View Residence', shortTitle:'Rear residence', rooms:4, outdoor:'Balcony', label:'Room to breathe', plan:`${base}/plans/four-room.jpg`, sourceUnits:'03, 06, 09, 12, 15', description:'A four-room layout with a living-room balcony, three bedrooms and a separate storage room.',
  about:['This four-room layout includes three bedrooms, a living area with a balcony, and a separate storage room. Living, dining and kitchen functions share the main communal space; the supplied plan shows the bedroom arrangement and circulation around it.','Use the plan to check bed and wardrobe placement and whether the storage room meets your needs. Confirm the balcony dimensions and access, bathroom arrangement and any parking allocation for the selected unit.'] },
 { id:'five-room', title:'Front View Residence', shortTitle:'Front residence', rooms:5, outdoor:'Terrace', label:'Space for more', plan:`${base}/plans/five-room.jpg`, sourceUnits:'17, 19', description:'A five-room layout with a long terrace, four bedrooms and two bathrooms.',
  about:['This five-room layout has four bedrooms and a shared living, dining and kitchen area. The long terrace runs alongside the main living space. With two bathrooms, the layout provides separate facilities for a household using several bedrooms.','One bedroom could serve as a home office or guest room, depending on your needs. When reviewing the plan, check furniture clearances, access to the terrace and the position of each bathroom relative to the bedrooms. Interior and terrace areas, parking and storage allocations still need confirmation for the selected apartment.'] },
 ]
}];
export const getDevelopment = (id:string) => developments.find(p=>p.id===id);

export type ResolvedMedia = { film: { src: string; poster: string }; images: MediaImage[]; model: string; placeholder: { film: boolean; images: boolean; model: boolean } };
// The most specific media wins; `placeholder` marks what still comes from the shared set.
export function resolveMedia(project: Development, residence: Residence, apartment?: string): ResolvedMedia {
 const own = apartment ? project.apartmentMedia?.[apartment] : undefined;
 const film = own?.film ?? residence.media?.film;
 const images = own?.images?.length ? own.images : residence.media?.images;
 const model = own?.model ?? residence.media?.model;
 return {
  film: film ?? project.media.film, images: images?.length ? images : project.media.images, model: model ?? project.media.model,
  placeholder: { film: !film, images: !images?.length, model: !model },
 };
}
