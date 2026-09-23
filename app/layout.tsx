import type { Metadata } from 'next';
import './globals.css';
const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const metadata: Metadata = {
 metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (deploymentHost ? `https://${deploymentHost}` : 'http://localhost:3088')),
 title: 'Mozir 8 — A quieter kind of Tel Aviv living',
 description: 'Discover Apartment 02 at 8 Yaakov Mozir, Tel Aviv. Explore the garden residence in 3D, watch the residence film and discover the proposed interiors.',
 openGraph: { title: 'Mozir 8 | The Garden Residence', description: 'Space to slow down. Room to live. Apartment 02, Tel Aviv.', images: ['/media/01_living.webp'] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en"><body>{children}</body></html>;
}
