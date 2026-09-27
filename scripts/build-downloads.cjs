// Build downloads from the same media records used by the apartment selector.
const fs = require('node:fs');
const path = require('node:path');
const { zipSync, strToU8 } = require('fflate');
const { developments, resolveMedia } = require('../content/projects/index.ts');
const publicRoot = path.resolve(__dirname, '../public');
const readAsset = src => {
 const file = path.resolve(publicRoot, '.' + src);
 if (!file.startsWith(publicRoot + path.sep)) throw new Error('Invalid asset path: ' + src);
 return fs.readFileSync(file);
};
const escape = value => value.replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
for (const project of developments) {
 for (const residence of project.residences) {
  if (!residence.media) continue;
  const media = resolveMedia(project, residence);
  const model = readAsset(media.model);
  const files = {};
  files['video/apartment-tour.mp4'] = readAsset(media.film.src);
  media.images.forEach((image, i) => {
   const label = image.label.normalize('NFKD').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
   files[`images/${String(i + 1).padStart(2, '0')}-${label}${path.extname(image.src)}`] = readAsset(image.src);
  });
  files['3D/apartment.glb'] = model;
  files['floor-plan' + path.extname(residence.plan)] = readAsset(residence.plan);
  // Embedded model avoids file:// fetch restrictions: no local server or upload needed.
  files['3D/Open apartment.html'] = strToU8(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(residence.title)} — 3D</title>
<style>body{margin:0;font:16px system-ui;color:#242a26;background:#b8bdc0}header{position:absolute;z-index:1;top:20px;left:24px;right:24px}h1{font-size:22px;margin:0 0 8px}p{font-size:14px;margin:0}model-viewer{width:100%;height:100vh}button{margin-top:12px;padding:8px 16px;border:0;border-radius:20px;cursor:pointer}</style>
<header><h1>${escape(residence.title)}</h1><p id="status">Loading viewer — internet connection required. Drag to rotate; scroll or pinch to zoom.</p><button id="reset">Reset view</button></header>
<model-viewer camera-controls camera-orbit="${media.modelOrbit || '25deg 45deg 95%'}" field-of-view="35deg" shadow-intensity="1" environment-image="neutral" alt="Interactive apartment model"></model-viewer>
<script type="module">
const status = document.getElementById('status');
try {
 await import('https://unpkg.com/@google/model-viewer@4.3.1/dist/model-viewer.min.js');
 const viewer = document.querySelector('model-viewer');
 const bytes = Uint8Array.from(atob('${model.toString('base64')}'), c => c.charCodeAt(0));
 const url = URL.createObjectURL(new Blob([bytes], {type:'model/gltf-binary'}));
 viewer.addEventListener('load', () => {status.textContent='Drag to rotate · Scroll or pinch to zoom'; URL.revokeObjectURL(url);});
 viewer.addEventListener('error', () => {status.textContent='Unable to load the model. Check your internet connection or open apartment.glb in Blender.';});
 viewer.src=url;
 document.getElementById('reset').onclick=()=>{viewer.cameraOrbit='${media.modelOrbit || '25deg 45deg 95%'}';viewer.cameraTarget='auto auto auto';};
} catch {status.textContent='Connect to the internet and reopen this file, or open apartment.glb in Blender offline.';}
</script></html>`);
  files['README.txt'] = strToU8(`${residence.title}\n\nContents\n- video/: MP4 apartment tour\n- images/: photographs in gallery order (WebP)\n- floor-plan: original floor plan (JPG)\n- 3D/apartment.glb: portable 3D model with materials and textures\n- 3D/Open apartment.html: interactive browser viewer\n\nExtract the ZIP first. Double-click Open apartment.html in Chrome, Edge or Safari. Internet is required to load the viewer and model decoders; the apartment model is embedded in the HTML and does not need to be uploaded. Drag to rotate and scroll/pinch to zoom.\n\nFor offline use, open Blender and choose File > Import > glTF 2.0, then select apartment.glb. The GLB is the web presentation model, not a CAD construction drawing or the original Blender production scene.\n\nAssets represent this apartment layout and are shared by units of the same type. They are not individual-floor surveys.\n`);
  const dest = path.join(publicRoot, 'downloads', project.id);
  fs.mkdirSync(dest, { recursive: true });
  const zip = zipSync(files, { level: 0 });
  fs.writeFileSync(path.join(dest, residence.id + '.zip'), zip);
  console.log(`Packaged ${project.id}/${residence.id}: ${Object.keys(files).length} files, ${(zip.length/1024/1024).toFixed(1)} MB`);
 }
}
