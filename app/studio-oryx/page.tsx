import type { Metadata } from 'next';
import OryxSite from '@/components/oryx/OryxSite';
export const metadata: Metadata = {
 title: 'Studio ORYX — ten pieces, one room',
 description: 'Ten hand-made Studio ORYX pieces from Cancún, placed in one master bedroom from its floor plan: room views, a short film and every piece beside its original photo.',
 openGraph: { title: 'Studio ORYX | Ten pieces, one room', description: 'Hand-made solid-wood furniture from Cancún, seen in a real room.', images: ['/projects/studio-oryx/v1-hero.jpg'] },
};
export default function Page() { return <OryxSite />; }
