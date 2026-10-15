import type { Metadata } from 'next';
import { LANG_BOOT_SCRIPT } from '@/lib/i18n';
import AttributionCapture from '@/components/AttributionCapture';
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
// Google Tag Manager (the ad and analytics tags are managed in GTM; the thank-you page pushes `lead_submitted`).
const GTM_ID = 'GTM-P9BV3P7F';
const GTM_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;
// The boot script sets lang/dir before first paint, so the <html> attributes differ from the static HTML.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: LANG_BOOT_SCRIPT }} /><script dangerouslySetInnerHTML={{ __html: GTM_SCRIPT }} /></head><body><noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} /></noscript>{children}<AttributionCapture /></body></html>;
}
