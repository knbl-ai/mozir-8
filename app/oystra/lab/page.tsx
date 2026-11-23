import type { Metadata } from 'next';
import TourLab from '@/components/oystra/TourLab';
// Test page for the apartment section's layouts. Unlisted, not indexed.
export const metadata: Metadata = { title: 'Oystra · apartment section tests', robots: { index: false, follow: false } };
export default function Page() { return <TourLab />; }
