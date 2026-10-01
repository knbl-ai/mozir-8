# Multi-project foundation

## Site map — 26 September 2026

`/` is the demo hub: what the demo is, an English/Hebrew switch (Hebrew mirrors the layout; its
text waits for the English to be approved) and two live previews. The Sales Gallery
(`/projects/building-preview#explore`) sells a whole development; the Open House (`/mozir-8`,
formerly the root) is the single-apartment website. The hub's copy lives in
`components/landing/copy.ts`.

Every page is English and Hebrew (`lib/i18n.tsx`): `?lang=he` wins, then the visitor's last
choice; the hub passes the language to both demos. Words live in `components/landing/copy.ts`,
`components/building/strings.ts`, `components/mozir/strings.ts` and the residences' `he` fields in
`content/projects/index.ts`. Hebrew letters use Heebo (`public/fonts/heebo-hebrew.woff2`), scoped
by unicode-range so Latin keeps each page's own typefaces. The old `/projects` list and the
per-plan pages are unlinked and stay English. `tests/language-check.mjs` covers the flow.

## Gindi Colors — 30 September 2026

`/gindi-colors` is the hub's fourth demo: a four-tower complex in Gindi Holdings' charcoal-and-gold look. The complex
turns (60 pre-rendered views); a building is chosen on the image, from the cards or from the header, and the view zooms
into that tower's own ring (the same 60 angles, so the zoom is matched frame to frame). In a tower the layout follows the Sales Gallery template:
the building on the left, the chosen home in a large media panel on the right (mirrored in Hebrew) (plan, film, interiors, 3D, views, about); hovering a home
on the facade selects it after 90 ms (sold homes don't select); the floor-by-floor grid is the header's home picker. The URL keeps `?b=<building>&u=<home>`. Code: `components/gindi/`; data: `content/projects/gindi.ts`;
frames and hotspots: `public/projects/gindi-colors/orbit/` (from the production scripts `render_web.py` and
`package_web.py` in `projects/Gindi-Kiryat-Hasharon-Netanya/building/`). Availability is sample data.
QA: `node review/gindi-check.mjs <baseUrl> <outDir>` (with `npm start`, set `GINDI_PAGE=/gindi-colors.html`).

## Current state — 26 September 2026

The project route is now a single-screen apartment-selection app: apartment media on the left, interactive building on the right. The header selects Front View, Rear View or Garden and an available demo unit. The media tabs are Floor plan, Video, Images, 3D and About. Video, images and the apartment model are explicitly identified Mozir 8 placeholders. There is no apartment-page CTA in this app.

The active manifest references 72 distinct V19 WebP frames at 1600×1800; selection geometry retains an 800×900 coordinate system. Drag, horizontal two-finger swipe and keyboard rotation are supported. Hover reveals apartment status; sold apartments cannot be selected. Independent sold/for-sale switches control persistent overlays. Availability and placements remain demonstration data.

Production Blender files and pipeline scripts remain outside this Git repository. This repository contains deployable website assets, not a complete production-source backup.

The notes below document earlier implementation stages and may describe superseded controls or rendering versions.

## Initial foundation — 24 September 2026

The existing Mozir 8 route `/` remains intact. `/projects` is the collection index.
New development routes use `/projects/[project]`; residence routes use
`/projects/[project]/apartments/[unit]`. One reusable component handles building
rotation and apartment selection. The initial project ID is `building-preview`:
its real identity and mapping to the user's three future projects are unconfirmed.

## Website data and assets

- `content/projects/index.ts`: typed development and residence records.
- `public/projects/<project>/building/frames.json`: ordered frames with per-frame
  selection polygons in an 800x900 coordinate system.
- `public/projects/<project>/building/rotation/`: compressed WebP frame sequence.
- `public/projects/<project>/plans/`: original supplied plans for review.
- Each residence currently has a plan page, not fabricated images/video/models.
  The completed Mozir page is linked as the presentation example. Extracting that
  full presentation into the shared residence template remains a later step when
  new residence assets are produced.

## Production workspace (outside the website Git root)

- `../projects/<project>/source/`: preserved originals with descriptive filenames.
- `../projects/<project>/building/`: Blender checkpoints, passport, source renders.
- `../projects/<project>/reviews/`: review images and render logs.
- `../pipeline/building/`: reusable construction, rendering and packaging scripts.

The website is currently the Git repository. Parent production folders are local
and have NOT been added to Git or published. A future repository-root migration
must preserve website history and use external storage or LFS for heavy sources.
The existing apartment production tree has not been moved during this review.

## Preview

Run `npm run dev -- --port 3090` from website, then open
http://localhost:3090/projects/building-preview.
`npm run build` validates the complete static export, including existing Mozir.

## Building sequence

1. Run `pipeline/building/build_exterior.py` with BUILD_STAGE=1 in a NEW live scene.
2. Inspect blockout before BUILD_STAGE=2 (script is staged, not safe to repeat stage
   2 in the same scene). Correct geometry live and update the script accordingly.
3. The Blender study checkpoint is `Building_Study_v1.blend`.
4. Run `render_rotation.py` in background Blender with this checkpoint.
5. Run `package_frames.py` in regular Python with Pillow installed.
6. Reload the project page. A rebuild is required for deployed static manifests.

The image path and its hotspot polygons are switched together. The browser supports
pointer drag, arrows, keyboard arrows, a slider and a separate accessible unit list.
Facades hidden from the camera have no selection polygons. Actual unit placement
is not established: the three front selections are explicitly illustrative.

## Current fidelity and review boundary

72 views at 5-degree increments, 800x900, approximately 1.8 MB combined WebP data.
This is an architectural study, not a photorealistic completion. Main dimensions,
storey organization, roof and hidden faces are assumed from two exterior pictures.
The supplied visuals remain accessible under "Architect's vision" for comparison.
User requested corrections during construction; geometry refinement is paused for
that feedback. No paid generation or deployment has occurred.

### V13 interactive building
The active frames.json references 72 renders in building/rotation-v13. Source model is Building_Study_v13.blend in the parent production workspace. Render scripts are pipeline/building/render_rotation.py and package_frames.py. They use the same independent camera to render and project demo apartment surfaces; no animated-camera pose override. Original PNGs remain outside the public folder.

Apartment polygons are demonstration placements and are explicitly labelled as such. A confirmed floor/unit map is required before representing actual unit locations or availability. Selection links to existing plan pages. The viewer supports drag/touch rotation, keyboard arrows, frame slider, and selection from a list that finds a visible angle.
