import { fileLinkOk } from '@/lib/server/file-links';
import { privateBucket } from '@/lib/server/storage';

// A signed team link to a private client file → a fresh 10-minute signed URL (lib/server/file-links.ts).
export async function GET(request: Request) {
 const u = new URL(request.url);
 const path = u.searchParams.get('p') || '';
 if (!path || path.includes('..') || !fileLinkOk(path, u.searchParams.get('t'))) return new Response('Not found', { status: 404 });
 const file = privateBucket().file(path);
 const [exists] = await file.exists();
 if (!exists) return new Response('Not found', { status: 404 });
 const [url] = await file.getSignedUrl({ version: 'v4', action: 'read', expires: Date.now() + 10 * 60 * 1000 });
 return Response.redirect(url, 302);
}
