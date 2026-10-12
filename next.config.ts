import type { NextConfig } from 'next';

// Binary media lives in GCS (gs://knbl-sma/apt3d/site/...), not in git. Vercel serves it through the rewrite in
// vercel.json; `next dev` gets the same rewrite here so a checkout without public/ media still works locally.
// Pages still pre-render at build time; the server output exists only for the landing form's API routes.
const MEDIA_ORIGIN = 'https://storage.googleapis.com/knbl-sma/apt3d/site';
const MEDIA = { source: '/:dir(projects|media|models|downloads|landing)/:file(.*\\.(?:webp|mp4|glb|jpg|jpeg|png|zip|pdf|txt))', destination: `${MEDIA_ORIGIN}/:dir/:file` };

const dev = process.env.NODE_ENV === 'development';
const config: NextConfig = {
  images: { unoptimized: true },
  ...(dev ? { rewrites: async () => ({ beforeFiles: [], afterFiles: [], fallback: [MEDIA] }) } : {}),
};
export default config;
