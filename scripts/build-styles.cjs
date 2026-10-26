// Build the public style showcase from the style library (data/library/styles, read-only):
//   content/styles.json            only the public fields (slug, name, concept, mood, axes, palette, images)
//   public/landing/styles/<slug>/  the four sample rooms as WebP, 1600 px and an 800 px thumb
// Never published: source, used_in, tiers, personas, never, light, grade, Prompt line, Room variations, Never.
// Run: node scripts/build-styles.cjs   (needs cwebp; images go to the bucket with `npm run assets:upload`)
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const library = path.resolve(__dirname, '../../../data/library/styles');
const outJson = path.resolve(__dirname, '../content/styles.json');
const outImages = path.resolve(__dirname, '../public/landing/styles');
const ROOMS = ['living', 'kitchen', 'master', 'bath'];
const BANNED = /shirat|briga|yael|gal\b|shanaw|hayarkon|symbol|klee/i;

const unquote = v => v.trim().replace(/^["']|["']$/g, '');
const scalar = (front, key) => { const m = front.match(new RegExp(`^${key}:\\s*(.+)$`, 'm')); return m ? unquote(m[1]) : ''; };

function parse(slug) {
 const text = fs.readFileSync(path.join(library, slug, 'style.md'), 'utf8');
 const [, front = '', body = ''] = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) || [];
 const axesLine = (front.match(/^axes:\s*\{(.*)\}\s*$/m) || [])[1] || '';
 const axes = Object.fromEntries(axesLine.split(',').map(p => p.split(':').map(x => x.trim())).filter(p => p[0] && p[1]));
 const table = (body.match(/^## Palette\n([\s\S]*?)(?=^## )/m) || [])[1] || '';
 const palette = table.split('\n').filter(l => /^\|/.test(l)).slice(2).map(l => {
  const [name, hex] = l.split('|').slice(1, 3).map(x => x.trim());
  return { name, hex: hex.toUpperCase() };
 }).filter(c => /^#[0-9A-F]{6}$/.test(c.hex));
 const style = {
  slug, name: scalar(front, 'name'), concept: scalar(front, 'concept'),
  mood: scalar(front, 'mood').split(',').map(x => x.trim()).filter(Boolean),
  axes: { value: axes.value, temperature: axes.temperature, colour: axes.colour },
  palette,
  images: ROOMS.map(room => ({ room, src: `/landing/styles/${slug}/${room}.webp`, thumb: `/landing/styles/${slug}/${room}-sm.webp` })),
 };
 if (!style.name || !style.concept || !palette.length || !axes.value) throw new Error(`${slug}: incomplete style.md`);
 return style;
}

// Collector's Colour opens the slideshow and the library; the rest follow alphabetically.
const FIRST = 'collector-colour';
const slugs = fs.readdirSync(library).filter(d => !d.startsWith('_') && fs.existsSync(path.join(library, d, 'style.md'))).sort((a, b) => (b === FIRST) - (a === FIRST) || a.localeCompare(b));
const styles = slugs.map(parse);
// Leave out a style whose rooms are missing instead of shipping a broken slide.
for (const st of styles) {
 const dir = path.join(outImages, st.slug);
 fs.mkdirSync(dir, { recursive: true });
 for (const room of ROOMS) {
  const src = path.join(library, st.slug, 'samples', `${room}.jpg`);
  if (!fs.existsSync(src)) throw new Error(`${st.slug}: missing samples/${room}.jpg`);
  for (const [file, width, q] of [[`${room}.webp`, 1600, 80], [`${room}-sm.webp`, 800, 76]])
   execFileSync('cwebp', ['-quiet', '-q', String(q), '-resize', String(width), '0', src, '-o', path.join(dir, file)]);
 }
}
const json = JSON.stringify(styles, null, 1) + '\n';
if (BANNED.test(json)) throw new Error('styles.json names a designer or a project: ' + json.match(BANNED)[0]);
fs.writeFileSync(outJson, json);
console.log(`${styles.length} styles → content/styles.json, ${styles.length * ROOMS.length * 2} images → public/landing/styles/`);
