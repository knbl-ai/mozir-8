import type { NextConfig } from 'next';

// Binary media lives in GCS (gs://knbl-sma/apt3d/site/...), not in git. Vercel serves it through the rewrite in
// vercel.json; `next dev` gets the same rewrite here so a checkout without public/ media still works locally.
const MEDIA_ORIGIN = 'https://storage.googleapis.com/knbl-sma/apt3d/site';
const MEDIA = { source: '/:dir(projects|media|models|downloads)/:file(.*\\.(?:webp|mp4|glb|jpg|jpeg|png|zip|pdf|txt))', destination: `${MEDIA_ORIGIN}/:dir/:file` };

const dev = process.env.NODE_ENV === 'development';
const config: NextConfig = dev
  ? { images: { unoptimized: true }, rewrites: async () => ({ beforeFiles: [], afterFiles: [], fallback: [MEDIA] }) }
  : { output: 'export', images: { unoptimized: true } };
export default config;
