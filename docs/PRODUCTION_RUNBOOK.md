# Apartment plan → interactive property website

Reusable production runbook · established on Mozir 8, Apartment 02 · 24 September 2026

This documents the process that produced the approved apartment, film, soundtrack and website. It separates approved decisions from suggested defaults for future apartments. It is a production workflow, not an automatic plan-to-model converter or a construction-validation procedure.

Use [the project template](APARTMENT_TEMPLATE.md) for each new apartment and [the prompt pack](prompt-pack.json) for the exact successful Mozir prompts. Adapt geometry, rooms, duration and styling; do not blindly reuse this apartment's dimensions or camera path.

## 1. The production contract

**Sell the space through a coherent, inviting viewing experience.** Buyers need to understand the apartment and imagine living there. Spaciousness, room connections and outdoor space matter more than elaborate camera choreography.

| Asset | What it controls | What it does not establish |
|---|---|---|
| Supplied floor plan | Footprint, room relationships, measured dimensions, openings and labelled area | Unspecified heights, finishes, furniture or actual outlook |
| Blender apartment | Reviewed interpretation of geometry, circulation, furniture locations and camera path | Construction accuracy beyond the source plan; photographic finish |
| Photographic reference image | Realistic furniture design, material character, styling and light | Authority to move walls, invent windows or enlarge rooms |
| Blender motion guide | Camera position, viewing direction, timing and room transitions | Furniture appearance, lighting or the finished visual style |
| AI video | Photographic interpretation of the approved guide and reference | Guaranteed geometry preservation or identical output on regeneration |
| Final edit | Shot order, duration, pacing, audio and delivery format | Native detail absent from lower-resolution source clips |
| Browser 3D model | Buyer-controlled rotation, zoom and layout exploration | A replacement for the photographic imagery or a verified survey |

Keep these responsibilities explicit in prompts and reviews. “Use this as a reference” is too ambiguous on its own.

### Approval gates

1. Source interpretation and assumptions.
2. Furnished, textured Blender model, visible in Blender.
3. Camera blockout played in Blender **before rendering a revised video guide or commissioning AI video**.
4. Photographic reference gallery.
5. Low-resolution AI clips, reviewed individually and in sequence.
6. Selected high-resolution regeneration and final edit.
7. Soundtrack and mix, heard against the film.
8. Browser experience, then publishing.

Approval applies to the actual version shown. Changing the camera path reopens the camera gate. Replacing a reference image can change video continuity and reopens that clip's review. Keep approved rooms and clips when revising another shot.

## 2. Intake and project structure

Collect the sales plan, exterior marketing imagery, address, apartment number, floor, stated area, developer information and any verified specifications. Ask for critical missing dimensions when they affect the model; record other assumptions explicitly.

Use the plan as the geometry source. Separate facts from marketing interpretation:

- **Verified from source:** labelled dimensions, apartment identity, opening positions, room count where unambiguous.
- **Assumed for visualization:** ceiling height, opening heights, furniture, finishes and landscaping.
- **Illustrative:** AI interiors, exterior neighborhood and roof-off overhead composite.
- **Unconfirmed:** availability, price, completion date, contact details or views not established by source material.

Check the building and company against relevant public sources. Save the URLs and review date. Do not invent walking times, sales claims or a view because they look appealing.

Suggested structure:

```text
source_materials/          Original plans and supplied building imagery
scripts/                   Modeling, cameras, export and assembly scripts
working/                   Queue tasks, checks, logs and temporary artifacts
output/                    Versioned .blend files and model review images
  keyframes_vN/            Approved stills, prompts, manifest and raw 3D guides
video/
  cinematic_vN/            Camera brief, timing, trajectory and checks
  seedance_<shot>_vN/      Driver, request, submission, result and local video
  apartment_final_vN/     Final edit, review HTML and edit manifest
audio/<track>_vN/           Full generated music, edited bed, request and result
website/                   Independent Git repository and deployable website
HANDOFF.md                 Current approved state and next action
```

Use stable room names and version numbers. Never overwrite the only approved version. Record which files are current; a directory full of alternatives is not a handoff.

## 3. Build a useful Blender apartment

### Trace and check the plan

1. Extract or rasterize the PDF clearly enough to read dimensions and walls.
2. Establish metres and a single drawing-to-world transform.
3. Calibrate against a known dimension; cross-check an independent dimension.
4. Trace the footprint, partitions, openings, bathroom fixtures and outdoor boundary.
5. Check room adjacencies and actual walkable routes before adding detail.
6. Record discrepancies between model area and labelled sales-plan area without forcing them to match.

For Mozir, calibration used 79.5 normalized drawing units/metre, checked against a 316 cm bedroom width and 543 cm living-room depth. The sales plan states approximately 85.50 m²; the wall-centreline polygon was approximately 79.69 m². These are different measurement bases. Ceiling height was assumed to be 2.85 m.

The Mozir footprint is **stepped rather than a perfect rectangle**, with orthogonal walls. Perspective can make walls look diagonal. Check in an orthographic top view before rotating or straightening geometry. Never apply this conclusion to a different plan without checking it.

### Model quality target

Aim for a clean, furnished, credible apartment that supports spatial review, camera planning and browser exploration. Do not spend the whole budget making Blender photorealistic when the photographic layer will come from AI.

Required:

- Correct footprint, wall thickness interpretation, door/window positions and room connections.
- Complete terrace/garden extent, including returns outside the main rectangular footprint.
- Recognizable and correctly located beds, seating, dining, kitchen and bathroom fixtures.
- Plausible furniture scale, circulation and camera clearance.
- Editable named objects and collections organized by architecture, room and function.
- Full enclosure plus a switchable cutaway mode.

For the Israeli project, include the Mamad where the plan identifies it. A visual representation of its wall, door or vent is not certification of protective construction.

Useful collection groups: floors, walls, cutaway edges, openings, living, dining, kitchen, bedrooms, wardrobes, bathrooms, service fixtures, decoration, terrace, lighting/cameras, full facade, ceiling and source plan. Keep the source plan embedded or accessible but hidden in normal review/export.

### Decoration and material pass

The initial mostly white scene was too schematic. First add restrained decoration, then material variation.

The approved direction was contemporary Israeli minimalism: warm plaster, limestone-look flooring, oak, linen, sage/olive accents, a little terracotta, restrained metal finishes and Mediterranean planting.

Add depth through material differences, not clutter:

- Oak grain and satin reflectance instead of a flat brown surface.
- Warm stone-look tiles with scale, joints and subtle variation.
- Woven upholstery, curtains, rugs and naturally soft bedding.
- Distinct quartz, honed stone, ceramic and painted surfaces.
- Books, a throw, a few ceramics, art, lamps and functional kitchen objects.
- Plants in plausible living/outdoor locations, not arbitrarily in wet rooms.

Blender procedural texture nodes were sufficient for this stage. Full texture baking was deferred. This saved effort while making model review much more legible.

**Gate:** review both a whole-apartment cutaway and human-height interior views. Confirm layout, complete outdoor space, usable circulation and a finish palette that no longer reads as “everything white.”

## 4. Direct the film in Blender first

A blockout is a low-cost preview of camera movement and editing. It is not a final render. Show it in the open Blender window so the reviewer can scrub and play it.

### What changed in this project

The original long, survey-like sequence felt boring. A 15-second cinematic direction was proposed, then expanded to 20 seconds to show the apartment's space and additional rooms clearly.

Approved principles:

- Begin at the entrance, so viewers understand the approach into the apartment.
- Start far enough back to show usable floor area and living-room spaciousness.
- Use foreground edges and parallax deliberately without hiding the room.
- Move at a comfortable human pace with gentle acceleration/deceleration.
- Use a few meaningful turns; repeated turns and fast travel felt restless.
- Let main spaces breathe; cover secondary spaces with short composed cuts.
- Use hard cuts between unrelated room views instead of impossible travel.
- End on a complete overhead orientation view, including the entire terrace.

“Cinematic” meant composition, light, depth and timing—not constant movement, speed ramps or a succession of tricks. The user initially requested acceleration and more artistic angles, then preferred substantially smoother, slower movement after seeing the result.

### Approved Mozir edit

| Time | Duration / frames at 24 fps | Shot and purpose |
|---|---|---|
| 0–8 s | 8 s / 192 | Entrance → living-room review → approach to open terrace; spacious continuous take |
| 8–13.5 s | 5.5 s / 132 | Enter principal bedroom, turn and reveal its adjoining ensuite in one continuous shot |
| 13.5–15 s | 1.5 s / 36 | Small-bedroom portrait with subtle drift |
| 15–16.5 s | 1.5 s / 36 | Wider main-bathroom reveal with shallow camera movement |
| 16.5–18 s | 1.5 s / 36 | Kitchen composition with peninsula foreground and subtle movement |
| 18–20 s | 2 s / 48 | Entire apartment and full wraparound terrace from above |

A corridor walk into the small bedroom was considered earlier, then replaced with the short facilities montage. A prolonged terrace pan was also removed. Do not mistake superseded briefs for final instructions.

### Living-room movement: the important refinement

The user wanted a leftward look across the living room during the walk, followed by onward travel at an oblique angle. An immediate leftward terrace reveal was tried. It still moved too quickly indoors and spent too much time outside.

The final solution retained **V5 frames 1–117** and stretched that exact segment across **V6 frames 1–192**. Source-frame mapping:

```text
source_frame = 1 + (output_frame - 1) * 116 / 191
```

This is approximately 60.7% of the prior speed. All later terrace travel was removed. The final endpoint is the exact approved guide endpoint; it is near the threshold in the model. Do not extend it to a “better” terrace position after approval. Retiming also shifts when the living-room turn occurs; the earlier “about 3 seconds” note is not the final timing authority.

For a different apartment, fit the path to its circulation and hero feature. Do not reuse frame 117 or the Mozir coordinates as universal settings.

### Framing and technical checks

Working lens choices included approximately 21 mm for the opening, wider bathroom coverage around 16 mm in the 3D guide, and approximately 25 mm for the kitchen. These are composition choices, not requirements. Check distortion and do not use a very wide lens to misrepresent room size.

- Keep verticals composed and avoid unnecessary camera roll.
- Establish the main bedroom from a wide doorway position.
- In the larger bathroom, make the bathtub, vanity, toilet and washing machine legible; avoid a fixture blocking the rest of the room.
- Open terrace sliders before the shot starts and keep the path genuinely empty.
- Check start, end, every turn, doorway and cut; scrub the whole path.
- Inspect clearance against furniture, walls, doors and glass.
- A camera-point collision check does not validate the full camera frustum, sightlines or furniture occlusion.
- Frame overhead shots around the full property bounds, not just the indoor floor plate. Avoid cropping the terrace while leaving empty margin on the opposite side.

**Gate:** approve playback in visible Blender. Do not generate expensive video to discover a camera problem that can be seen here.

## 5. Generate photographic visual references

### Do not reproduce the proxy furniture

The first realistic images stayed too close to Blender, especially the chairs. The corrected instruction was:

> Blender defines layout, openings, approximate object locations and view direction. It does not define the final furniture shapes, materials or lighting. Rebuild the scene as a real high-end designer apartment.

Retain architecture while allowing slender, believable designer furniture, authentic construction, seams, natural textile folds, stone pores and irregular wood grain. Restraint matters: a lived-in, tidy home rather than a showroom filled with ornaments.

### Generate fresh images

The user explicitly preferred **new generation from scratch**, not repeated edits of previous AI output, because edited iterations appeared to lose quality. Return to the raw Blender guide with a corrected prompt when a reference fails.

A previous approved image can be supplied as a continuity reference where useful, but name its role and still request a fresh image. The terrace still used the raw end-camera guide plus the living image for exterior/lighting continuity; it was not a retouch of the old terrace image.

### Art direction

- Contemporary Tel Aviv/Israeli minimalism, not generic ornate luxury.
- Warm off-white plaster, limestone-look porcelain, honey/smoked oak, ivory linen and muted olive.
- Slender furniture, restrained artisan ceramics, brushed nickel and limited aged brass.
- Motivated Mediterranean afternoon daylight, cooler sky fill and warm highlights.
- Real shadow depth; retain outdoor detail through windows.
- Straight verticals, plausible perspective, quiet foreground layering.
- Avoid uniformly white surfaces, orange wash, excessive HDR, artificial haze, plastic finish and oversharpening.

A cinematic image should look photographed, not like a more polished 3D visualization.

### Reference set and QC

The successful set contains eight images:

1. One wide living/open-terrace hero.
2. Principal bedroom.
3. Compact ensuite.
4. Small bedroom.
5. Larger bathroom.
6. Kitchen.
7. Complete photographic-style roof-off overhead.
8. Full terrace still.

Review every image against the guide. Check openings, room scale, circulation, fixture locations, object plausibility, reflections, light direction and outdoor floor level. Independently generated rooms may differ in small details; reject changes that break the architecture or a continuous take.

Specific corrections:

- **Terrace sliders:** fully open from the first frame, glass leaves parked at the side, no pane or mullion across the camera route.
- **Ensuite:** the AI invented visible plants in/through the shower. Regenerate with enclosed solid tiled shower walls, no plants, no shower window, no garden view or greenery in reflections. Light can spill through the doorway behind camera.
- **Main bathroom:** show the actual compact room and fixtures; do not invent a large spa or giant window.
- **Terrace:** a ground-floor garden, not an elevated balcony or rooftop. The modern Israeli neighborhood is an illustrative outlook, not a verified actual view.
- **Overhead:** a deliberately impossible roof-off composite with photographic materials, not a claim of an actual aerial photograph. Keep the full outdoor boundary visible.

Build an HTML gallery for review, with room captions and version provenance. Keep the terrace image even if it will not guide the film: it is valuable on the website.

**Gate:** approve the image set before video generation.

## 6. Turn approved cameras into AI video

### Motion guide

Render the approved camera sequence as a lightweight 3D video guide. It only needs to convey layout, occlusion, direction and timing. The latest living guide was 960×540, 24 fps, 8 seconds. Expensive photorealistic Blender rendering was unnecessary for this role.

Keep the exact guide used for each request. Do not attach a stale path after modifying Blender.

### Reference strategy: fewer, clearer references

The original living sequence used too many slightly different keyframes. They produced visible stitches as the model tried to move between inconsistent interiors.

The successful opening used:

- **One video reference:** exact approved motion/spatial guide.
- **One image reference:** authoritative living-room photograph for the entire continuous shot, indoors and outdoors.

Adding a separate terrace endpoint still caused changes in light and view, even when its role was restricted in the prompt. Removing it improved continuity. The model should extend the exterior already visible through the living image's open doors, rather than transition to a second design.

This is a per-shot rule, not a ban on multiple references everywhere. The bedroom→ensuite take used distinct references for its distinct spaces. The facilities montage assigned one image to each explicit shot interval.

### Generate separate sequences and edit them

The final film was assembled from separate clips, not generated as one continuous 20-second AI output:

- Living sequence, 8 seconds.
- Bedroom→ensuite sequence, generated at 6 seconds and edited/retimed to 5.5 seconds.
- Facilities sequence, generated as three 2-second shots and extracted as three 1.5-second inserts.
- Overhead, made by gently animating the approved photographic overhead still.

The deterministic overhead treatment avoids the final shot reverting to a Blender-like render. A subtle 2D move from an approved still is enough when a new generative shot adds no value.

### Prompt structure

1. Finished appearance and art direction.
2. Explicit role for each reference.
3. Exact shot count, duration and camera behavior.
4. Spatial constraints: fixed objects, real openings, clear path.
5. Continuity constraints: same light, exposure, furniture, exterior and white balance.
6. Audio and exclusions.

For the living clip, state “one uninterrupted take,” “only photographic reference,” “exact motion guide,” and “end at the guide's final viewpoint.” Prohibit invented extra travel, hidden stitches, image morphs, dissolves, furniture redesign and lighting transitions. Prefer stable exposure from the start to an exposure reset at the terrace.

Request ambience only and no music, but check the delivered audio: the larger bathroom and kitchen still contained unwanted music.

The exact approved prompts are in [prompt-pack.json](prompt-pack.json). Provider reference syntax is not universal; map reference labels to the actual connector's current schema.

### Draft → high resolution

Use an inexpensive draft/low-resolution pass where the selected model and provider expose it. In this project, Seedance 2.5 was used via Magnific. “Draft” and “480p” are not necessarily interchangeable API values; inspect the actual schema.

Review for:

- Furniture/architecture drifting or morphing.
- Visible stitches, hidden cuts or unwanted scene transitions.
- Light direction, sky, exposure or color-temperature changes.
- Camera speed, turns and exact stopping point.
- Walking through glass, furniture or walls.
- An invented balcony/view or enlarged room.
- Unwanted audio, especially background music.

Only regenerate the approved shot at high resolution after its draft and camera are accepted. The exposed workflow used a fresh 1080p generation with the same guide/reference/prompt intent; it was **not a guaranteed pixel-identical promotion of the draft**. A repeated seed does not guarantee the same clip. Review the HD result again.

The final Mozir film is a 1920×1080 container, but only the latest opening was generated natively at 1080p. Other room clips remained 480p drafts enlarged with Lanczos. This was accepted for this delivery; it is not the recommended finish standard for every future property. Decide whether every selected clip needs native HD before calling a future delivery complete.

### API operations and cost

- Check access, schema and supported reference/resolution combinations before submission.
- Record model, resolution, duration, seed, reference mapping and prompt.
- Treat price previews as estimates: the final Mozir opening previewed 6,320 credits and consumed 8,640.
- Website subscription entitlements did not mean unlimited MCP generation.
- Submit once; save job identifiers; poll the existing job. Do not resubmit because it is still processing.
- For upload workflows, obtain the upload URL, upload once, then finalize. Do not reuse a one-time upload URL.
- Download the local output promptly. Keep request, submission and result metadata beside it.
- Distinguish an original master from a browser playback copy. The retained Magnific 1080p assets were H.264 playback copies; separate original download URLs were not archived masters and could expire.

All endpoint names and capabilities here describe this project. Re-check them when running a new apartment; do not assume a historical schema or price still applies.

## 7. Assemble the film

Use the edit manifest as the authority for clip versions, duration, frame rate and audio treatment. Normalize frame rate, dimensions, pixel format and audio format before concatenation.

Mozir delivery settings:

- 20.000 seconds, 480 frames at 24 fps.
- 1920×1080, 16:9.
- H.264, yuv420p, web-friendly MP4 with faststart.
- AAC stereo audio; 48 kHz processing.
- Hard cuts between separate room sequences; continuous spatial movement within living and suite.

Technical notes from assembly:

- Trim precisely and reset timestamps for every segment.
- Use subtle audio fades at cut boundaries to avoid clicks.
- Do not assume every source has an audio stream. Supply silence where needed in a generalized assembly script.
- One prior `atempo` + `apad` + `atrim` approach stalled; the working edit trimmed ambience instead. This is a project-specific failure, not a general claim that those filters are invalid.
- The existing numbered assembly script produces the pre-mute/pre-music base edit. It does not reproduce the final soundtrack mix by itself.
- Check duration and streams with ffprobe, then watch the actual encoded file through every cut.

Archive the base edit, clean-audio version and music version separately.

## 8. Music and final sound

### Creative decision

The first Lyria 3 track was happy, optimistic downtempo around 96 BPM. It met the general brief but the user did not like the result. A contemporary **jazz-fusion** alternative around 104 BPM was generated and explicitly approved.

The selected direction: warm, joyful and sophisticated, with an immediately inviting groove—Rhodes electric piano, expressive electric bass, sparse clean guitar, delicate acoustic drums and a little shaker. Major 9/13 harmony and human playing support the high-end apartment without making it feel solemn or corporate.

Avoid a long intro, vocals, busy solos, frantic bebop, cheesy saxophone, heavy rock and oversized cinematic pads. The property remains the focus. These are Mozir's approved choices; audition music against the actual new property's film rather than treating jazz fusion as mandatory.

### Generation and audition

Use the music provider's current schema. This project used `fal-ai/lyria3` through fal.ai MCP, with a prompt rather than a deprecated negative-prompt field. The full generated track was longer than the film; the final bed was edited to 20 seconds.

Request an immediate hook, a small lift around the major shot transition and a satisfying resolution near the end. Timing in a music prompt is a creative request, not a sample-accurate guarantee. Choose/trim the actual result by ear.

### Approved mix recipe

- Remove the unwanted generated music from bathroom and kitchen, at **15–18 seconds**.
- Preserve other useful ambience at **0.3 linear gain** beneath music.
- Music bed: trim to 20 seconds, reset timestamps, normalize to **−20 LUFS target**, true-peak target **−2 dBTP**, LRA parameter **8**.
- Music fade in: **0.2 seconds**. Fade out: **18.3–20 seconds**.
- Ambience fades out over **19–20 seconds**.
- Mix with normalization disabled, then limiter around **0.891 linear / −1 dBFS**, auto level disabled.
- Encode final audio as AAC 256 kbps; copy the approved video stream when only changing music.

The −20 LUFS number is the music-bed normalization target, not a claim about the measured loudness of the whole final film. Listen on headphones and speakers, check peaks and verify cut transitions. Keep the full generated track, edited WAV bed and mixed film.

**Gate:** approve the soundtrack in context, then mark that choice in the edit manifest and handoff. The jazz-fusion version is the approved Mozir final; older downtempo references are historical.

## 9. Buyer-facing interactive model and website

A buyer should not need Blender. Export a self-contained GLB and display it with a browser viewer.

### GLB export

- Export the furnished cutaway and **entire** terrace/garden.
- Exclude studio ground, cameras, lights, source-plan image, ceilings and full-height facade objects that obscure the review view.
- Preserve the native Blender files; export from a separate/background process.
- Remove animation and unnecessary metadata if the web model is static.
- Set sensible material appearance, then inspect the actual browser result.

For Mozir, the roughly 8 MB GLB uses a simplified PBR palette. Blender procedural textures were **not baked**. The distinction is intentional: photographic stills and film convey the finish, while the interactive model explains layout. If a future brief requires matching textured web furniture, budget a separate UV/bake/optimization pass. Do not promise Blender shader parity from a basic GLB export.

### Website implementation

The chosen stack was **Next.js App Router + TypeScript + Tailwind CSS + locally bundled Google model-viewer**. The site is statically exported and includes local media; it needs neither Blender nor generation-service credentials at runtime.

Design direction: warm ivory, deep olive, large imagery, serif editorial headings, restrained navigation and generous spacing. Main experiences:

- Living-image hero and apartment facts.
- Approved film with user-controlled sound.
- All eight images in a keyboard-accessible gallery, including the unused terrace video reference.
- On-demand GLB loading with drag/zoom, perspective, plan and terrace presets.
- Terrace feature, supplied building image, location and sourced company information.
- Original PDF floor plan and a real enquiry destination.
- Clear illustrative-image/view disclosures.

Do not build a lead form that appears to submit but has no backend. Mozir links to the published project listing. Replace that with a verified owner/agent contact or implemented lead endpoint when supplied.

### Browser checks and deployment

1. Production build and TypeScript check.
2. Desktop and mobile layout, including horizontal overflow and navigation.
3. Every gallery image, previous/next arrows, Escape and focus behavior.
4. Actual video metadata/playback and correct soundtrack.
5. GLB loading, drag-to-rotate, zoom and preset buttons.
6. Whole-terrace framing at desktop and narrow mobile sizes.
7. Readable loading/error states and working plan/contact links.
8. Ensure all referenced media exists locally, and no secret or expiring generation URL is required.

Initial model framing cropped the outdoor edge. Responsive camera-distance presets corrected it. Full-page test screenshots also need lazy images loaded before judging missing content.

The GitHub repository contains the **website at its root**, not the whole production workspace. All runtime assets are under `public/`. Vercel settings: root `./`, Node 22, `npm ci`, `npm run build`, output `out`. Versions are pinned and the lockfile is committed. Webpack was used because Turbopack encountered local process-permission problems; this is not a general requirement for new projects.

Social metadata derives its domain from Vercel, with an optional `NEXT_PUBLIC_SITE_URL` override. GitHub push, Vercel deployment and a custom-domain launch are distinct completion states. Verify the live deployed site after publishing; a local build is not proof of a successful deployment.

## 10. Decision log: what to repeat and what to avoid

| Observed problem | Decision that improved it | Reusable lesson |
|---|---|---|
| White, schematic Blender apartment | Add restrained styling, grain, fabric and stone variation | Enough material depth for review; no need for full Blender photorealism |
| Long, boring blockout | Short editorial film led by living space and outdoor connection | Prioritize the apartment's strongest spatial feature |
| Close framing hid space | Start farther back in living room and main bedroom | Let buyers read the room before moving |
| Too-fast travel and excessive turns | Slow approved path; remove redundant terrace movement | Remove movement before adding runtime or more choreography |
| Terrace cropped in overhead | Reframe around full property bounds | Outdoor area belongs in the framing calculation |
| AI chairs still looked like 3D proxies | Make guide spatial-only; allow real designer furniture | Architecture fidelity and furniture-shape fidelity are different |
| Repeated image edits felt degraded | Generate fresh from raw 3D guide | Keep a clean reference source and revise the prompt |
| Plants visible in shower | Explicit enclosed wet-room walls and interior-only reflections | Review reflections/backgrounds, not just foreground fixtures |
| Multiple living references created stitches | One authoritative living image per continuous shot | More references can reduce continuity |
| Terrace reference changed light/view | Exclude it from video; retain it in gallery | A good still can be a bad motion reference |
| Final overhead looked CG | Animate approved photographic overhead image separately | Use deterministic editing where generation adds risk |
| Facilities clip contained music | Mute those intervals before soundtrack mix | “No music” prompting still needs audio QC |
| Downtempo soundtrack felt wrong | Audition jazz fusion against actual edit | Music approval is about the combined film, not genre wording |
| Web model cut off terrace | Responsive framing and mobile checks | A valid export is not a finished viewing experience |

## 11. Persistence, handoff and repeatability

Before compacting a session or handing off, save:

- Original source materials and verified/assumed fact list.
- Approved editable Blender scene plus material and camera versions.
- Raw reference renders and exact guide clips.
- Every selected image/video/music output as a local file.
- Prompts, requests, result metadata, seeds and reference mappings.
- Edit timing, audio decisions and approved final file names.
- Exported GLB, web media and source code.
- Review gallery and final video player.
- Current decision/approval state and outstanding work in `HANDOFF.md`.

A local save, GitHub website repository and external backup are three different things. The website repository does not back up Blender originals, raw generations or every historical version. Downloaded playback files do not establish that original masters were saved. A hash manifest is useful only if it has been refreshed after the latest assets.

### Tool/session hygiene

- Reuse a working visible Blender session; do not reset it accidentally.
- The Mozir `live_blender.py` initializes an empty scene at startup, then polls a queue. Do not relaunch it into an existing review session.
- Use a background Blender process for export/render work that should not disturb the visible review.
- Keep credentials in configured services or environment files, never prompts, documentation or the website repository.
- If an MCP connection is newly configured, native tools may require a session reload. A local bridge can be used if available, but document external dependencies without copying secrets.
- Connector availability does not prove a particular model/version is available. Inspect it.

### Mozir artifact index (local production workspace)

These paths are relative to the original apartment-production workspace, **not files bundled in this website Git repository**:

| Artifact | Path |
|---|---|
| Source plan | `source_materials/PL_M_0-1-FL0APT2.pdf` |
| Material master | `output/Apartment_02_Textured.blend` |
| Approved camera scene | `output/Apartment_02_Cinematic_V6_Review.blend` |
| Fresh photographic references | `output/keyframes_v3/` |
| Final living guide and native-HD clip | `video/seedance_living_v6_1080p/` |
| Other source clips | `video/seedance_draft_v2/` |
| Approved film | `video/apartment_20s_v6/apartment_20s_jazz_fusion.mp4` |
| Edit and approval metadata | `video/apartment_20s_v6/edit.json` |
| Approved music and exact request | `audio/lyria_jazz_fusion/` |
| GLB exporter | `scripts/29_export_web_model.py` |
| Current-state handoff | `HANDOFF.md` |

The website repository independently contains `public/media/`, `public/models/apartment.glb`, browser tests, deployment configuration and this runbook. The prompt pack makes the important creative instructions portable without requiring access to local provider result paths.

## 12. Next-apartment execution checklist

- [ ] Copy the project template; establish sources, units, scope and assumptions.
- [ ] Trace geometry and validate scale/room relationships.
- [ ] Furnish and add sufficient material depth; review in Blender.
- [ ] Define the strongest buyer-facing story and a short shot budget.
- [ ] Build and approve camera playback before rendering the guide.
- [ ] Generate fresh photographic references with clear spatial/style roles.
- [ ] Review architecture, open doors, bathrooms, light and outlook.
- [ ] Generate motion-guided drafts with the smallest coherent reference set.
- [ ] Review each clip and the edited sequence; revise only failed parts.
- [ ] Generate required HD clips and review them again.
- [ ] Assemble exact duration; record actual source resolutions.
- [ ] Audition music; remove unwanted source music; mix and approve.
- [ ] Export web model; confirm complete outdoor framing and mobile controls.
- [ ] Build the website with local assets and verified contact/source information.
- [ ] Validate, push, deploy when authorized, and test the actual live URL.
- [ ] Archive originals and approvals; update handoff and backup status.
