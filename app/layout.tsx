import type { Metadata } from 'next';
import { LANG_BOOT_SCRIPT } from '@/lib/i18n';
import './globals.css';
const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const metadata: Metadata = {
 metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (deploymentHost ? `https://${deploymentHost}` : 'http://localhost:3088')),
 title: 'Residence demos — Sales Gallery and Open House',
 description: 'Two ways to market new homes online: a building you can turn to pick a home, and a website for a single apartment.',
 // Served from public/: the app/icon file convention breaks the build when the checkout path holds an apostrophe.
 icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }], apple: '/apple-icon.png' },
 openGraph: { title: 'Residence demos', description: 'Sales Gallery and Open House — two property marketing demos.', images: ['/projects/building-preview/building/exterior-front.jpg'] },
};
// The boot script sets lang/dir before first paint, so the <html> attributes differ from the static HTML.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: LANG_BOOT_SCRIPT }} /></head><body>{children}</body></html>;
}
