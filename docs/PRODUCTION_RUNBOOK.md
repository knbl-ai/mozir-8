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

### Default review wall treatment — approved 26 September 2026

Use the original Mozir presentation for all future apartments: **full-height interior partitions and retained exterior walls**, with the roof/ceiling hidden for the overview. Use the height supplied by the plans; when unavailable, use **2.85 m as a documented visualization assumption** until confirmed.

Do not shorten every wall to waist height (for example 0.9 m) for the default review or buyer-facing model. Preserve room enclosure, doorway lintels, window proportions and wall-mounted furniture/art. Hide only the foreground exterior facade segments that obstruct the chosen overview, retaining approximately **0.16 m section edges** to show the footprint. Choose those segments for each apartment and camera; do not copy compass directions blindly.

Keep full architecture, removable foreground facade, section edges and ceiling in separate collections. The overview shows full-height partitions and section edges, with foreground facade and ceiling hidden. Interior views restore the complete facade and ceiling and hide section edges. Both Blender review controls and the later GLB export must respect this convention. A low-wall diagram can exist as an optional technical view, but must not become the default without an explicit request.

Before submitting: inspect the overview and plan view, verify an interior wall still reaches the specified ceiling height, check that the entire outdoor boundary fits, and confirm interior mode restores the enclosure. Adjust camera elevation/framing before sacrificing wall height.


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

### Reusable apartment-tour direction — 26 September 2026

Treat each plan as a new spatial story. Establish the entrance, lead through the main living space toward the outdoor feature, then cover the private wing and utility spaces. Build one apartment end-to-end before repeating the workflow: review the first apartment at each gate, the second in supervised batches, and the third independently within the approved conventions.

**Duration and generation chunks.** Decide the edit duration, fps and provider limits before camera work. The historical Front View brief used two15-second inputs. For Rear View (27 September 2026), use one30-second Atlas Seedance2.5 reference-to-video request at native480p with the full720-frame,24fps driver. The cut at15s remains an editorial cut, not a submission split. Provider limits and creative shot lengths are separate decisions. Verify the chosen endpoint's current duration and reference support before generation. A generation chunk is not necessarily one continuous camera take: the second chunk here intentionally includes room cuts. Verify cut preservation in a draft; if unsupported, generate its component takes and assemble them to the same timing.

**Movement.** Start at the actual entrance and turn into the hall. Frame useful floor area and readable room connections. Give living/dining and outdoor space the longest continuous take. A kitchen or bedroom-door glance should explain adjacency, not become a detour. Spread a requested180-degree reversal across a controlled turn with useful content in view. Use a level horizon, human eye height, gentle starts/stops and a readable final composition. Reduce travel before increasing speed. Short secondary-room portraits should use a small dolly or pan, not an entire room crossing. A requested overhead finale is optional, not mandatory on every apartment.

**Secondary-room framing.** Start at or just outside the real doorway, then take a short step in and gently turn to reveal the room. Compose the usable floor, main furniture and window together before a detail. Open door leaves to clear the sightline; hide a distracting entry leaf only when approved for presentation, retaining original geometry. Avoid a series of bed, basin or desk close-ups that loses room scale. A reverse turn should reveal new spatial information instead of repeating the kitchen or wall just shown.

**Turn rhythm and duplicate reveals — approved Front View V08.** Choose the direction of a reversal for what it reveals: after the study-door glance, turn through the hall toward the living room instead of showing the kitchen again. If that turn must cross a blank wall, accelerate the camera's yaw briefly through the uninformative portion, then decelerate before the furnished room comes into view. Do not speed up the camera's physical travel to achieve this. Keep yaw continuous, the horizon level, and the settling motion smooth. In the approved example the blank-wall passage takes about half a second; this is a framing-dependent example, not a universal preset. Once the TV is clearly visible in the main reversal, remove the separate TV glance and spend that time on the living room and terrace. Every movement should reveal new useful space.

**Historical blockout handoff (superseded by V11; see the Front View retrospective below).** Front View V08 was approved on 26 September 2026: 720 frames at 24 fps, a hard cut at frame 361, and no change to the reviewed translation path in the final yaw revision. Preserve that checkpoint and its camera trajectory. The ensuite and laundry have separate entrances and a solid partition, so retain their editorial cut. The distracting entry leaf is hidden reversibly for presentation. Image generation may now proceed; AI video remains a separate review gate. Generate fresh photographs from raw Blender layout guides. Use one authoritative living-room image for the entire first continuous take; do not introduce competing living/terrace reference images that force furniture, light or view transitions. Use separate room references for the later cuts and keep the orientation compass for final compositing.

**Architecture is authoritative.** Restore full-height walls, ceiling and all facades for walkthroughs. Pass through modeled door openings; open the terrace sliders before frame1 and park panes clear of the route. Never connect bathrooms, laundry or bedrooms with a fictional doorway. If a proposed continuous route cannot exist, use an explicit motivated cut and document it. Keep furniture realistically usable; small reversible staging adjustments are acceptable, moving structural walls for a shot is not. Furnish a spare room as a study where appropriate without changing the source plan's room count or implying a different legal use; preserve the original furnishing option.

**Budget secondary-room time explicitly.** List all required rooms and reserve short, readable shots for each before spending all the timeline on hero spaces. Cover practical features: bed/wardrobe clearance, kitchen work surfaces, terrace width, bathroom fixtures, laundry access and storage shelves. If the route cannot fit at a comfortable pace, shorten physical travel, use a doorway reveal or propose a duration change. Do not solve it with unexplained camera acceleration.

**Review and evidence.** Preserve the approved model in a checkpoint and create a separately named blockout version. Bind individual cameras to timeline markers for true hard cuts; do not key a single camera to fly between unrelated rooms. Verify exact frame counts and chunk boundaries. Audit center-path intersections against visible walls, doors, glass and furniture, then inspect the actual lens view at starts, ends, turns, thresholds and every cut. Numeric clearance cannot prove framing or comfortable playback. Leave Blender open at frame1 with a visible timeline for user review before rendering the motion guide or spending on AI video. Camera revisions reopen this gate.

**Later orientation map.** Use the approved floating apartment silhouette in a bottom corner, with a fine warm-white outline and soft shadow. The circular backing was rejected because it obscured too much footage. Keep the map compact and readable; omit it from a full-frame overhead finale. Export per-frame camera position, forward vector, lens, shot identity, frame/time mapping and plan/world calibration from the approved blockout. The camera marker and viewing wedge follow this data, snapping at editorial cuts. Do not interpolate across the shared building core. Composite the compass after AI generation, keeping it out of the blockout and model references. Verify its synchronization if the AI output changes timing; do not assume generated footage obeys the guide perfectly.

**Concurrent work.** Keep apartment models, scripts, camera data and review artifacts in that apartment's production folder. Update only the relevant runbook section. Do not modify or commit concurrent website UI files, replace public assets or deploy as part of camera review.

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

The original Mozir 8 set contained eight images (an example, not a mandatory shot list for other apartments):

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
- **Terrace (original Mozir 8 example only):** a ground-floor garden, not an elevated balcony or rooftop. Derive the outdoor type from each new plan: Front View instead has a narrow elevated terrace with a railing. The modern Israeli neighborhood is an illustrative outlook, not a verified actual view.
- **Overhead:** a deliberately impossible roof-off composite with photographic materials, not a claim of an actual aerial photograph. Keep the full outdoor boundary visible.

Build an HTML gallery for review, with room captions and version provenance. Keep the terrace image even if it will not guide the film: it is valuable on the website.

**Historical Front View image review 01 — superseded by the expanded approved gallery below.** The approved 30-second blockout produces a different nine-image set: living/dining/open terrace, master bedroom, ensuite, laundry, children's bedroom, shared bathtub bathroom, guest/protected room, storage and study. No separate kitchen, terrace or overhead image is required for this edit. Raw Blender guides are the only image inputs; each photograph is a fresh generation. The first children's-room attempt reversed the bed and was rejected; a new generation explicitly fixed head/foot orientation. Include bed orientation and foreground object placement in QC, not just window and wall positions. Archive prompts, generation sources and a comparison gallery per apartment. These images are pending user approval; AI video generation has not started.

**Gate:** approve the image set before video generation.

## 6. Turn approved cameras into AI video

### Motion guide

Render the approved camera sequence as a lightweight 3D video guide. It only needs to convey layout, occlusion, direction and timing. The latest living guide was 960×540, 24 fps, 8 seconds. Expensive photorealistic Blender rendering was unnecessary for this role.

Keep the exact guide used for each request. Do not attach a stale path after modifying Blender.

### Reference strategy: fewer, clearer references

**Apply per project, not as a blanket one-image limit.** The Mozir living take worked best with one image, but Front View needed one living image plus distinct kitchen, corridor and balcony references. See the retrospective for the tested reference mapping. Avoid competing views of the same living space; add references only for genuinely different areas.

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

For the living clip, state “one uninterrupted take,” explicit appearance roles for each photographic reference, “exact motion guide,” and “end at the guide's final viewpoint.” Use “only photographic reference” only when there really is one. Prohibit invented extra travel, hidden stitches, image morphs, dissolves, furniture redesign and lighting transitions. Prefer stable exposure from the start to an exposure reset at the terrace.

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

The GitHub repository contains the **website at its root**, not the whole production workspace. All runtime assets are under `public/`. Vercel settings: root `./`, Node 22, `npm ci`, `npm run build`, automatic Next.js output detection (do not override Output Directory). The local static export remains `out/`. Versions are pinned and the lockfile is committed. Webpack was used because Turbopack encountered local process-permission problems; this is not a general requirement for new projects.

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


## 13. Front View production retrospective — 26 September 2026

This is the current guidance for subsequent apartments. Earlier Mozir and V08 notes above are historical examples, not overrides.

### Geometry and review

- Trace each apartment from its own plan and printed dimensions. Do not resize the previous apartment or infer doors from adjacent rooms. Front View ensuite and laundry have a solid separating wall and separate entrances: a cut was necessary. Exclude the shared lift/stair/lobby core from both structural slab and finish meshes; a broad rectangular finish can accidentally fill the core void.
- Keep walls2.85m for review, with full internal partitions. Remove only the roof and necessary foreground exterior shell in the dollhouse view. Restore all enclosure for interior cameras. Keep these modes reversible, rather than lowering every wall.
- Reuse tested furniture constructors and a coherent oak/plaster/linen/sage palette. Preserve believable furniture footprints, bed orientation, storage access and clear walkways. A room can be staged as a study without changing the source plan or claiming a legal room-count change.
- Keep a source-plan interpretation, assumptions, versioned Blender files and named room collections. Camera work and the website UI can proceed in separate sessions; do not overwrite the other session's files.

### Camera direction: what survived review

The approved Front View guide is `Front_View_11_Living_Corridor_Review.blend`, not V08. Broad reversing/orbiting moves repeatedly weakened AI adherence. The successful first take slows the kitchen reveal, turns left through the living area, briefly reveals corridor depth, then crosses the balcony threshold around13s for only a2s outdoor glance.

- Spend time on useful room information, not transport, blank walls or repeated views. Reduce path length before increasing speed. Move promptly across an uninformative threshold but settle before the room reveal.
- Avoid full360degree turns. Choose a short turn that reveals new space. Do not add a separate TV glance if the main turn already shows it. Keep a level horizon and smooth, deliberately unwrapped headings.
- Small rooms start at their real doorway and take a short step inside with a gentle pan. Avoid filling the entire view with a bed/basin or starting inside furniture.
- Budget the final edit first. The selected Front View edit is15s living +13s private rooms +2s overhead. The second AI result originally included2s of repeated corridor; those were trimmed. Future HD work must revise the3D driver itself rather than keep regenerating unwanted corridor.
- Two generation chunks may each be15s, but a split must coincide with a location cut. Never split a continuous reveal arbitrarily. Keep room cuts as separate timeline cameras; no flying through walls between shots.
- Export per-frame position, direction, focal length, shot ID and source-plan calibration. Audit movement and representative rendered views, then show the actual Blender timeline to the user before guide rendering or paid generation.

### Photographic keyframes

Generate fresh images from raw Blender guides instead of repeatedly editing AI images. The guide constrains walls, openings, camera and furniture locations; it does not constrain the exact primitive chair/sofa design. Ask for photographic high-end Israeli interiors, considered furniture, natural texture and cinematic but stable daylight. Sliders stay open for the whole route. Keep neighborhood views illustrative. Check head/foot orientation of beds, bathroom fixtures and absence of plants in showers.

Front View's selected gallery has13 images: living, kitchen, balcony, corridor, main bedroom, ensuite, laundry, child room(v2), shared bathroom, guest/protected room, storage, study and realistic overhead. The rejected child-roomv1 reversed the bed. The raw overhead Blender render is a geometry reference; the generated overhead image became the selected final2s hold.

Use one authoritative image per distinct space shown, not many subtly conflicting living-room angles. Successful Front View part1 mapping was Video1=motion/layout; Image1=living styling; Image2=balcony; Image3=kitchen; Image4=corridor. Explicitly say these are adjacent areas of one apartment, not start/end frames or separate shots; no morphing between them. Part2 used nine clearly identified room references for its deliberate cuts. State the timeline and which reference applies in each interval. The smallest *sufficient* reference set matters more than the smallest numerical count.

### Provider and draft findings

Several MiniMax H3-Max768P attempts were partial failures for this complex continuous route despite camera/prompt/reference revisions. Seedance2.5 through Atlas produced the accepted480p review versions. This is an observed outcome on this project, not proof that MiniMax cannot handle simpler tours. Magnific attempts failed here; retain request/status evidence and do not silently resubmit ambiguous jobs.

Atlas's selected endpoint exposed native480p generation, not a dedicated draft-to-HD promotion. Inspect current schemas and costs again before any future generation; never infer a feature from another provider's endpoint. One15s output returned361frames at24fps (15.041667s), so always probe duration/frame count rather than trusting requested seconds. Archive the exact guide, references, request, prompt, result, cost and local original.

Approved Front View source folders: `video/part1_atlas_seedance_480_v1` and `video/part2_atlas_seedance_480_v1`. Both recorded$2.40136 each; these amounts describe those jobs only and exclude failed/earlier experiments. Current final is a480p review film, not native1080 delivery. HD regeneration is a new result requiring review.

### Map, final edit and audio

- Composite the map after generation. Use a floating cutaway silhouette with fine warm-white outline and soft shadow; avoid the rejected circle/backplate. At480p the approved overlay was approximately184px wide with10px corner margin; scale proportionally and inspect at target resolution.
- Position/FOV come from Blender trajectory. Align camera-cut timestamps to the actual AI output, and snap at cuts; never interpolate through the building core. Tracking inside a shot remains approximate where AI deviates: do not label it exact live tracking.
- Retiming/trimming footage requires identical changes to the map trajectory. Remove the map during the full-screen overhead finale.
- Final selected edit: first360frames + second clip with first48frames removed and312frames retained +48frames of generated overhead =720frames/30s at24fps. Normalize formats before concatenation; verify joins, duration, first/last frames and audio streams. Preserve originals.
- Front View review is silent. Do not accidentally inherit generated dialogue, effects or music. Mozir's approved fusion-jazz track is a historical preference; add a new/reused music bed only when requested, and audition it in context.

### Website asset handoff

Resolve media per residence/apartment before shared placeholders. Front View assets live under `public/projects/building-preview/apartments/front-view/`; bilingual labels and versioned local filenames avoid reliance on expiring provider URLs. Verify the current application data model before integration. Do not replace Rear/Garden placeholders with Front View assets globally.

GLB export uses roofless full-height walls with selected foreground facades removed, no cameras/lights/animation. Include room/study furniture even if a historical film prefix is used; broad prefix exclusion previously risked losing the study. Compress geometry and validate loading. Procedural Blender shaders do not survive glTF: current export uses a PBR palette, not claimed baked texture fidelity.

For the interactive apartment use a neutral gray background to separate white walls and a close, per-model camera orbit. Front View was adjusted from110% to95% orbit distance. Do not copy95% blindly to other shapes; inspect the entire terrace and foreground corners across viewport sizes. Test video playback, all gallery images/captions, own GLB loading, and fallback assets for other residence types.

### Current artifact authority

Workspace-relative Front View root: `projects/building-preview/apartments/front-view/`.

- Latest interior model/guide: `model/Front_View_11_Living_Corridor_Review.blend`.
- Separate actual3D overhead: `model/Front_View_12_TopDown_Finale.blend`.
- Keyframe gallery: `images/keyframes_v1/review.html`; selected image `generated/14_topdown_realistic_v1.png`.
- Selected30s edit: `video/full_30s_atlas_480_v4/Front_View_Full_30s_Seedance_480_Realistic_Finale.mp4`.
- Website asset configuration: `website/content/projects/front-view-media.ts`; export script: `pipeline/apartments/front_export_web.py`.
- Preserve the high-resolution revision notes and edit-decision manifests with the video artifacts. Earlier handoff sections may describe superseded gates; use this index and the actual named artifacts.


## 14. Rear View: distinct interiors and one 30-second draft — 27 September 2026

### Preserve the style, vary the furniture

Maintain modern Israeli architecture, photographic material quality, restrained designer styling and coherent daylight across residences. Do not reuse the same sofa/chair/table/bed set in every apartment. Write a small furniture palette before generating images and archive it with the prompts.

| Element | Front View direction | Rear View direction |
|---|---|---|
| Joinery | Pale natural oak | Smoked oak / warm ash |
| Seating | Soft rounded ivory forms | Slim tailored oatmeal linen, black-frame woven cane dining chairs |
| Coffee table | Rounded pale stone forms | Low rectangular travertine block |
| Textiles | Sage and clay accents | Muted indigo, dusty blue, sand |
| Balcony | Previous project's outdoor set | Woven-rope chairs and small round limestone bistro table |

The Blender model constrains furniture footprint, location, bed orientation and passage clearance; it does not require AI to copy proxy furniture silhouettes. Generate each new image afresh from a raw Blender guide. Use the residence's first photographic image as a design-continuity reference, not an edit target. Change furniture between residences, never randomly between views of the same residence. Inspect room geometry, openings, bed orientation, practical fixture placement and open balcony access before video submission. Keep exterior neighborhood imagery explicitly illustrative.

### Single 30-second generation

Atlas MCP model `bytedance/seedance-2.5/reference-to-video` was checked live for this production: duration4–30s, native480p supported, reference-video total at most30s. Archive the returned schema because provider limits may change. A native480p draft is not a promise of a special draft-to-HD promotion endpoint.

Render the approved720frames at24fps into one30-second H.264 guide. Preserve a continuous first15s and explicit room cuts afterwards. Use one authoritative photograph per distinct space, including kitchen and balcony when those views need appearance guidance. A reference set is not a sequence of keyframes to interpolate; label every image's role and time range. The overhead reference applies only to the ending. New room references must not force hidden stitches inside the living shot.

For Rear View: living/kitchen/balcony0–15s; main bedroom15–18.5s; child18.5–21s; bathroom21–24.5s; guest/work24.5–26.5s; storage26.5–28s; overhead28–30s. There is one bathroom containing the washing machine, not a separate ensuite/laundry pair copied from Front View.

Prompt for a **new film using the video as choreography/layout reference**, not an instruction to edit the video, which may invoke different provider duration semantics. Submit duration30, resolution480p, ratio16:9, generate_audiofalse and watermarkfalse. Inspect a dry-run estimate before the paid request; explicit user generation authorization covers the submission. Save reference ordering, temporary upload responses, exact request, prompt, prediction ID, result, actual cost and downloaded original. Do not use provider upload URLs as permanent hosting.

Validate actual output duration and dimensions with ffprobe, inspect room cuts and sampled frames, and preserve any provider deviation in the review notes. If a single30s result loses later shots or merges rooms, shorten the generation units at real location cuts; do not silently discard requested rooms. Stop at the requested480p review before high-resolution regeneration. Add the camera-map overlay deterministically afterwards when requested; never ask the video model to draw it.


**Rear View first30s result:** Atlas prediction `5a258af8d72a40cf9829d635cb377551` completed at854x480/24fps, cost$4.799392, latency5m36s. All requested spaces and overhead ending appear in sampled frames. It returned721frames (30.041667s); preserve the original and trim only the extra final frame for an exact30s delivery. The kitchen-to-living turn needs close spatial-continuity review around6–8s despite good materials; passing schema and retaining cuts does not prove spatial fidelity. Inspect continuous turns at higher temporal sampling before HD approval. More references alone do not guarantee correct motion. Do not call a flawed draft final or automatically spend on repeated generations without evaluating the cause.


**Rear View website handoff:** User authorized the mapped draft for local web review. Composite the floating outlined map from the residence’s own model and trajectory, without a circular panel; hide it during the full-apartment overhead ending. The locator remains approximate where generated motion deviates. Register each residence’s media in a dedicated typed module (`rear-view-media.ts` for the `four-room` ID), including English/Hebrew image labels and a per-model starting orbit. Preserve the existing UI and other residence mappings. Convert originals to WebP for gallery use, copy the mapped30s film, and export a roofless tall-wall Draco GLB. Validate the actual video duration, each gallery image, model load and production build before handing over the local site.

## 15. Garden residence: layout-specific modeling and furniture variation — 27 September 2026

The Garden floor plan resembles Rear View but must be traced independently: the living room is deeper, the patio opens onto a garden around three sides, and the ground-floor boundary is not a balcony. Preserve the actual three bedrooms, shared bathroom/laundry and storage; do not inherit an ensuite or fictitious connection from another residence. Use printed dimensions to calibrate each raster independently (Garden approximately62.5px/m), record uncertainty, and exclude the gray shared core/parking from the apartment slab.

Garden staging uses walnut joinery, cream tailored linen seating, olive accents, oval stone coffee and walnut dining tables, upholstered curved timber chairs and teak/cream outdoor seating. This differs from both Front's pale oak/rounded palette and Rear's smoked oak/cane/indigo direction. Vary the actual proxy furniture shapes as well as image prompts, while maintaining the project's modern Israeli design language. Exterior staging uses a low garden boundary, ground-level planting and a clear patio path; neighboring scenery is illustrative.

Keep one residence-specific photographic style anchor. Generate every room afresh from its own raw Blender view plus that style reference. Do not edit previously generated photographs. For small rooms, choose an entrance-wide still separately from the moving shot's closest frame, so bathroom fixtures, desks and shelving can be understood. The film camera and still camera may differ slightly; the plan and openings must not. Include the whole garden in the overhead, with the shared-core void left empty.

The Garden blockout is720frames/24fps:0–15s entrance, kitchen, living and garden;15–18.5 main bedroom;18.5–21 child;21–24.5 shared bathroom/laundry;24.5–26.5 guest/work room;26.5–28 storage;28–30 complete overhead. Center-path collision checks are supplemented by viewed contact sheets; zero detected intersections alone is not a framing approval. Preserve editable camera rigs, per-frame trajectory and room cut markers for later map generation. No AI video generation is part of this3D/blockout/image stage.

**Garden still/render handoff:** Ten photographs include two complementary views of the single bathroom: bath/vanity and laundry/WC. A future provider limit may require choosing a subset; ten gallery images do not imply ten video references. Blender camera markers can override a manually assigned still camera during render initialization: remove markers in the temporary still-render process before using dedicated still cameras, without saving that temporary state. The saved review file opens in cutaway mode, so production/audit scripts explicitly restore full film visibility before frame evaluation.

### Corridor coverage check — applies to every residence

During plan interpretation, explicitly check the entrance hall and circulation between living areas, bedrooms and bathrooms. Include a corridor reference image when it explains the layout, reveals meaningful door connections or will appear during the filmed route. Preserve real doorway positions, width and sightlines; do not widen a narrow corridor or add doors for visual appeal. Match the apartment's materials and lighting. Generate the reference afresh from a dedicated Blender camera.

During blockout review, check that viewers can understand how the rooms connect. Where useful, include a brief corridor reveal or show it naturally on the approach to a room; avoid long empty-wall travel, redundant corridor passes or a corridor shot merely to tick a box. Assess both reference-image coverage and actual filmed coverage: adding an image to a gallery does not add a shot to a video. Retain room cuts and the agreed total duration when revising a future guide, and update the camera-map trajectory if timing changes.

Garden: corridor reference added after the initial image set (11 images total). Blockout v2 integrates the reveal into the opening: enter and advance, glance right down the corridor around3–4s, then resume the kitchen/living/garden route. Keep the overall30s duration and later room cuts unchanged; version both the driver and camera trajectory. A short glance can explain circulation without requiring a separate corridor cut. Rear View: corridor coverage was missed in the earlier draft. On27 September the user authorized blockout v2 and a fresh corridor image: use time reclaimed from an overlong kitchen hold for a brief corridor glance before the kitchen. Preserve the later room cuts and30s duration. Existing Rear AI video stays unchanged until a new generation is requested. Version the driver and map trajectory together; a revised trajectory must not be overlaid on the old film. Select reference images by shot relevance and provider limits rather than sending all gallery images automatically.

### Preserve the entrance view when adding corridor references

Garden720p v1 showed that a corridor photo can pull the generated opening toward the hallway even when the guide starts facing living/dining. For the next request explicitly describe the first frame using visible spatial relationships (dining ahead, sofa left, kitchen ahead/right), keep the corridor offscreen initially, and restrict its reference to the later glance. Treat this as a prompting mitigation, not a guarantee: inspect the generated first frames before approval.

When only one continuous section fails and later rooms are accepted, regenerate only that section using a matching trimmed guide. Keep the chosen native resolution. Join at an existing room cut, preserve the accepted section's visual content, and archive exact source frame ranges and any re-encoding. Do not regenerate accepted rooms unnecessarily. Garden's requested replacement uses15 seconds and rejoins the original second half at15 seconds.

###720p mapped deliveries

Garden and Rear View now use native720p videos with276px transparent locator canvases and15px bottom/right inset, preserving the earlier proportional overlay size. Render each residence’s own cutaway and project its current v2 camera trajectory through that same map camera. Warm-white silhouette edge and soft shadow; no panel/circle. Hide the map at28s for the full-apartment ending. Trim any provider extra final frame in the mapped delivery to retain exactly720frames/30s. Preserve generated originals.

Register typed per-residence media modules, English/Hebrew gallery labels, own GLB and starting camera orbit. Use versioned media paths to avoid stale playback caches. Verify actual720p playback, image counts/loads, correct model source/load, typecheck and production build; keep parallel UI edits intact. The guide-derived map remains an approximate locator where AI motion deviates.
