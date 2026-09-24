# Mozir 8 — apartment website

Next.js App Router, TypeScript, Tailwind CSS and locally bundled Google model-viewer. Static export; no account, backend or Blender installation needed for visitors.

## Local review

- `npm install`
- `npm run build`
- `npm start` → http://localhost:3088
- Development: `npm run dev -- --port 3088`

## Deploy to Vercel

Import `knbl-ai/mozir-8` as a new Vercel project. The repository root is the website root; leave Root Directory at `./`. The committed `vercel.json` sets Next.js, `npm ci`, `npm run build`, and automatic Next.js output detection (leave the Vercel Output Directory override disabled). Node 22 is specified in package.json. No required secrets, API keys, external asset storage, or Blender installation.

Social metadata uses the Vercel production domain automatically. For a custom canonical domain, optionally set `NEXT_PUBLIC_SITE_URL=https://your-domain.example` and redeploy. All images, the PDF, the video and GLB are in `public/` and included in Git, without Git LFS.

Production output: `out/`, also suitable for other static hosts. Enquiry links go to the externally listed project, not a local lead form. Local `npm start` uses Python 3 to serve the static output; Vercel serves that output directly and does not run this command.

## Included assets

All eight approved images (including the terrace omitted from the video), current 20-second jazz-fusion film, supplied exterior image, original PDF plan, and furnished GLB model. Media is local; no expiring AI-generation links. The 1080p film contains the previously approved mix of native 1080p and enlarged draft clips.

The GLB was exported from the approved textured Blender scene as a static cutaway. It preserves terrace geometry, omits ceilings/full facade/studio setup, and simplifies procedural materials to standard PBR colors. The original Blender scene and production scripts remain in the local apartment-production project; the website runs independently of them. Web model is about 8 MB and loads only on request.

## Content sources

- Supplied `PL_M_0-1-FL0APT2.pdf`: apartment, area and project company (Mozir 8 Tel Aviv Ltd.).
- https://www.yad2.co.il/yad1/project/6731 : project, location, Urban Real Estate association.
- https://urbanrealestateisr.wixsite.com/urbannadlan : company business areas.

No price, completion date, availability or exact amenity distances asserted. Imagery is labelled illustrative. The generated terrace outlook is not the verified view. Public project/company information should be confirmed with the representative before publishing an official sales site.

## Browser verification

`node tests/review.mjs` with the local production server running uses installed Chrome on macOS. On other platforms run `npx playwright install chromium`, or supply `CHROME_PATH` to use a specific browser binary. Checks eight gallery images, video duration, model loading and camera presets, mobile menu and overflow. Screenshots and checks stored in `review/`.

## Reuse this production process

- [Full production runbook](docs/PRODUCTION_RUNBOOK.md): source plan, Blender quality, camera review, images, AI video, edit, music and website.
- [New-apartment brief and checklist](docs/APARTMENT_TEMPLATE.md).
- [Exact successful creative prompts](docs/prompt-pack.json), with provider IDs and private output paths removed.
