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
// The interactive viewer page: the model is embedded, so it opens straight from the extracted ZIP.
const viewerHtml = (title, model, orbit) => strToU8(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} — 3D</title>
<style>body{margin:0;font:16px system-ui;color:#fff;background:radial-gradient(ellipse at 48% 40%,#827c73 0%,#66615b 60%,#4c4945 100%)}header{position:absolute;z-index:1;top:20px;left:24px;right:24px}h1{font-size:22px;margin:0 0 8px}p{font-size:14px;margin:0}model-viewer{width:100%;height:100vh}button{margin-top:12px;padding:8px 16px;border:0;border-radius:20px;cursor:pointer}</style>
<header><h1>${escape(title)}</h1><p id="status">Loading viewer — internet connection required. Drag to rotate; scroll or pinch to zoom.</p><button id="reset">Reset view</button></header>
<model-viewer camera-controls camera-orbit="${orbit || '25deg 45deg 95%'}" field-of-view="35deg" exposure="1.05" shadow-intensity="1" environment-image="neutral" alt="Interactive apartment model"></model-viewer>
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
 document.getElementById('reset').onclick=()=>{viewer.cameraOrbit='${orbit || '25deg 45deg 95%'}';viewer.cameraTarget='auto auto auto';};
} catch {status.textContent='Connect to the internet and reopen this file, or open apartment.glb in Blender offline.';}
</script></html>`);
const slug = label => label.normalize('NFKD').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
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
  files['3D/Open apartment.html'] = viewerHtml(residence.title, model, media.modelOrbit);
  files['README.txt'] = strToU8(`${residence.title}\n\nContents\n- video/: MP4 apartment tour\n- images/: photographs in gallery order (WebP)\n- floor-plan: original floor plan (JPG)\n- 3D/apartment.glb: portable 3D model with materials and textures\n- 3D/Open apartment.html: interactive browser viewer\n\nExtract the ZIP first. Double-click Open apartment.html in Chrome, Edge or Safari. Internet is required to load the viewer and model decoders; the apartment model is embedded in the HTML and does not need to be uploaded. Drag to rotate and scroll/pinch to zoom.\n\nFor offline use, open Blender and choose File > Import > glTF 2.0, then select apartment.glb. The GLB is the web presentation model, not a CAD construction drawing or the original Blender production scene.\n\nAssets represent this apartment layout and are shared by units of the same type. They are not individual-floor surveys.\n`);
  const dest = path.join(publicRoot, 'downloads', project.id);
  fs.mkdirSync(dest, { recursive: true });
  const zip = zipSync(files, { level: 0 });
  fs.writeFileSync(path.join(dest, residence.id + '.zip'), zip);
  console.log(`Packaged ${project.id}/${residence.id}: ${Object.keys(files).length} files, ${(zip.length/1024/1024).toFixed(1)} MB`);
 }
}

// Gindi Colors: one package per home type (every A, every B... shares its plan and media).
const { TYPES, project: gindi } = require('../content/projects/gindi.ts');
for (const [type, info] of Object.entries(TYPES)) {
 if (!info.plan) continue;
 const title = `${gindi.name} · ${info.name}`;
 const files = {};
 const list = [];
 files['floor-plan' + path.extname(info.plan)] = readAsset(info.plan); list.push('- floor-plan: the plan as shown on the site');
 if (info.pdf) { files['floor-plan.pdf'] = readAsset(info.pdf); list.push('- floor-plan.pdf: the developer\'s plan sheet'); }
 const media = info.media;
 if (media?.film) { files['video/apartment-tour.mp4'] = readAsset(media.film.src); list.push('- video/: MP4 apartment tour'); }
 if (media?.images.length) {
  media.images.forEach((image, i) => { files[`images/${String(i + 1).padStart(2, '0')}-${slug(image.label)}${path.extname(image.src)}`] = readAsset(image.src); });
  list.push('- images/: interiors in gallery order (WebP)');
 }
 if (media?.model) {
  const model = readAsset(media.model);
  files['3D/apartment.glb'] = model;
  files['3D/Open apartment.html'] = viewerHtml(title, model, media.modelOrbit);
  list.push('- 3D/apartment.glb: portable 3D model', '- 3D/Open apartment.html: interactive browser viewer');
 }
 files['README.txt'] = strToU8(`${title}\n${info.kind}${info.rooms ? ` · ${info.rooms} rooms` : ''}${info.area ? ` · ${info.area} m² interior` : ''}${info.balcony ? ` · ${info.balcony} m² outdoor` : ''}\n\nContents\n${list.join('\n')}\n${media?.model ? '\nExtract the ZIP first. Double-click Open apartment.html in Chrome, Edge or Safari (internet is needed to load the viewer; the model is embedded). Offline: Blender > File > Import > glTF 2.0 > apartment.glb.\n' : ''}\nThe files show this home type and are shared by every home of the type in all four buildings. Interiors, film and 3D are illustrations; the binding details are those in the sale agreement.\n`);
 const dest = path.join(publicRoot, 'downloads', 'gindi-colors');
 fs.mkdirSync(dest, { recursive: true });
 const zip = zipSync(files, { level: 0 });
 fs.writeFileSync(path.join(dest, `type-${type.toLowerCase()}.zip`), zip);
 console.log(`Packaged gindi-colors/type-${type.toLowerCase()}: ${Object.keys(files).length} files, ${(zip.length / 1024 / 1024).toFixed(1)} MB`);
}
