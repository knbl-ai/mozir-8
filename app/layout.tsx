import type { Metadata } from 'next';
import { LANG_BOOT_SCRIPT } from '@/lib/i18n';
import './globals.css';
const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const metadata: Metadata = {
 metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (deploymentHost ? `https://${deploymentHost}` : 'http://localhost:3088')),
 title: 'residence.tech — from floor plan to sales package',
 description: 'Upload a floor plan, get a walkthrough film, photoreal images, an interactive 3D plan and a sales page. In a day, not months.',
 // Served from public/: the app/icon file convention breaks the build when the checkout path holds an apostrophe.
 icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }], apple: '/apple-icon.png' },
 openGraph: { title: 'residence.tech', description: 'One floor plan in. A full sales package out: film, images, 3D and a sales page.', images: ['/landing/poster-en.webp'] },
};
// The boot script sets lang/dir before first paint, so the <html> attributes differ from the static HTML.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: LANG_BOOT_SCRIPT }} /></head><body>{children}</body></html>;
}
