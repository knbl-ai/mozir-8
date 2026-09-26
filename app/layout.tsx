import type { Metadata } from 'next';
import './globals.css';
const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const metadata: Metadata = {
 metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (deploymentHost ? `https://${deploymentHost}` : 'http://localhost:3088')),
 title: 'Residence demos — Sales Gallery and Open House',
 description: 'Two ways to market new homes online: a building you can turn to pick a home, and a website for a single apartment.',
 openGraph: { title: 'Residence demos', description: 'Sales Gallery and Open House — two property marketing demos.', images: ['/projects/building-preview/building/exterior-front.jpg'] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en"><body>{children}</body></html>;
}
