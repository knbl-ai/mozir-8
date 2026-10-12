// Films load straight from the bucket, not through the site's rewrite: Vercel's CDN caches a partial (Range)
// answer and then serves those bytes to every other request, which leaves a film unplayable.
const BUCKET = 'https://storage.googleapis.com/knbl-sma/apt3d/site';
export const film = (path: string) => `${BUCKET}${path}`;
