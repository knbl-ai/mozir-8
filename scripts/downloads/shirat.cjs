// Shirat HaYam (BRIGA): one package per residence with media (typical 01, penthouse 02): film, interiors, plans.
// Run alone: node --import tsx scripts/downloads/shirat.cjs (build-downloads.cjs runs it too).
const fs = require('node:fs');
const path = require('node:path');
const { zipSync, strToU8 } = require('fflate');
const { HOMES, homeBase, project } = require('../../content/projects/shirat-hayam.ts');
const publicRoot = path.resolve(__dirname, '../../public');
const read = src => {
 const file = path.resolve(publicRoot, '.' + src);
 if (!file.startsWith(publicRoot + path.sep)) throw new Error('Invalid asset path: ' + src);
 return fs.readFileSync(file);
};
const slug = s => s.normalize('NFKD').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
for (const home of Object.values(HOMES)) {
 const dir = homeBase(home.key);
 const title = home.key === 'ph02' ? 'Penthouse 02 · floor 32' : 'Residence 01 · typical floor';
 const files = {};
 files[home.final ? 'video/walkthrough-1080p.mp4' : 'video/walkthrough-draft-480p.mp4'] = read(`${dir}/film.mp4`);
 if (home.model) files['3D/apartment.glb'] = read(`${dir}/${home.hq.glb}`);
 home.images.forEach((im, i) => { files[`images/${String(i + 1).padStart(2, '0')}-${slug(im.label.en)}.webp`] = read(`${dir}/${im.id}.webp`); });
 files['plans/furnished-plan.webp'] = read(`${dir}/plan.webp`);
 files['plans/architect-plan.webp'] = read(`${dir}/drawing.webp`);
 files['README.txt'] = strToU8(`Alma Bay · Orelia\n${title}\n${home.rooms} rooms · ${home.interior} m² interior · ${home.outdoor} m² ${home.outdoorKind} · ${home.aspect.en}\n\nContents\n- video/: walkthrough film${home.final ? ' (1080p)' : ' (draft, 480p)'}${home.model ? '\n- 3D/apartment.glb: the 3D residence (open in Blender: File > Import > glTF 2.0, or any glTF viewer)' : ''}\n- images/: interiors in walkthrough order (WebP)\n- plans/: the furnished plan and the architect's plan\n\n${home.about.en}\n\n${home.final ? 'Visuals' : 'Draft visuals'}: the film, interiors and furnished plan are AI-assisted illustrations of this layout and are shared by every home of the same layout; views differ by floor. Binding details are those in the sale agreement. ${project.developerUrl}\n\n---\nאלמה ביי · אורליה\n${home.about.he}\nהדמיות טיוטה להמחשה בלבד; הפרטים המחייבים הם אלה שבהסכם המכר.\n`);
 const dest = path.join(publicRoot, 'downloads', 'alma-bay');
 fs.mkdirSync(dest, { recursive: true });
 const zip = zipSync(files, { level: 0 });
 fs.writeFileSync(path.join(dest, `${home.key}.zip`), zip);
 console.log(`Packaged alma-bay/${home.key}: ${Object.keys(files).length} files, ${(zip.length / 1024 / 1024).toFixed(1)} MB`);
}
