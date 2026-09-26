export type Residence = { id: string; title: string; rooms: number; label: string; plan: string; description: string; sourceUnits: string };
export type ApartmentZone = { unit: string; apartment: string; status: 'for-sale' | 'sold'; floor: string; labelPoints: [number, number][]; points: string };
export type BuildingFrame = { src: string; hotspots: ApartmentZone[] };
export type Development = { id: string; name: string; location: string; description: string; references: string[]; residences: Residence[] };
const base = '/projects/building-preview';
export const developments: Development[] = [{
 id: 'building-preview', name: 'The next address', location: 'PROJECT PREVIEW',
 description: 'A new perspective on home. Explore the building, find your space, and discover the possibilities within.',
 references: [`${base}/building/exterior-front.jpg`, `${base}/building/exterior-rear.jpg`],
 residences: [
 { id:'garden', title:'The Garden Residence', rooms:4, label:'A private outdoor life', plan:`${base}/plans/garden.jpg`, sourceUnits:'01', description:'A four-room home opening onto a generous private garden, with living and dining at its heart.' },
 { id:'four-room', title:'Rear View Residence', rooms:4, label:'Room to breathe', plan:`${base}/plans/four-room.jpg`, sourceUnits:'03, 06, 09, 12, 15', description:'A four-room layout with a living-room balcony, three bedrooms and a separate storage room.' },
 { id:'five-room', title:'Front View Residence', rooms:5, label:'Space for more', plan:`${base}/plans/five-room.jpg`, sourceUnits:'17, 19', description:'A five-room layout with a long terrace, four bedrooms and two bathrooms.' },
 ]
}];
export const getDevelopment = (id:string) => developments.find(p=>p.id===id);
