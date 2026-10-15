import type { Metadata } from 'next';
import ThankYou from '@/components/landing/ThankYou';

// The lead form's own conversion page (ad campaigns count a sign-up when it loads). Not for search engines.
export const metadata: Metadata = {
 title: 'Thank you — residence.tech',
 robots: { index: false, follow: false },
};
export default function Page() { return <ThankYou />; }
