// Apartment page check, run after every production phase (docs/APT_RUNBOOK.md §11, R-PIPE-PAGECHECK).
// Needs the static build served: npm run build && npm start  (python http.server on :3088).
//
//   node tests/apt-page-check.mjs <site> <apt> <phase> [--expect=film,images,model] [--langs=en,pt] [--base=http://localhost:3088]
// --langs: the page's two languages (default en,he; Borges 15 is en,pt, lib/i18n LANG_PAGES).
//   node tests/apt-page-check.mjs --shots <outDir> <path> [<path>...]     (plain screenshots, R-PIPE-UNTOUCHED)
//
// <phase> names the screenshot folder: review/<site>/<phase>/. --expect lists the tabs that must carry
// this project's own media by now (the rest must show "coming soon"). Writes page-check.json beside the shots.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const args = process.argv.slice(2);
const opt = (k, d) => (args.find(a => a.startsWith(`--${k}=`)) ?? `=${d}`).split('=').slice(1).join('=');
const base = opt('base', 'http://localhost:3088');
const executablePath = process.env.CHROME_PATH || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined);
const browser = await chromium.launch({ executablePath, headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=metal'] });

if (args[0] === '--shots') {
 const [, out, ...paths] = args;
 await fs.mkdir(out, { recursive: true });
 for (const p of paths) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + p, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}/${p.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '')}.png` });
  await page.close();
 }
 await browser.close();
 process.exit(0);
}

const [site, apt, phase] = args.filter(a => !a.startsWith('--'));
if (!site || !apt || !phase) { console.error('usage: apt-page-check.mjs <site> <apt> <phase> [--expect=film,images,model]'); process.exit(2); }
const expect = new Set(opt('expect', '').split(',').filter(Boolean));
const out = `review/${site}/${phase}`;
await fs.mkdir(out, { recursive: true });
const report = { site, apt, phase, time: new Date().toISOString(), checks: [], errors: [], media: [] };
const check = (ok, message) => { report.checks.push({ ok: Boolean(ok), message }); console.log(ok ? '✓' : '✗', message); };
const TABS = ['plan', 'film', 'images', 'model', 'about'];

for (const lang of opt('langs', 'en,he').split(',')) {
 for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: viewport.name === 'mobile' ? 2 : 1 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) errors.push(m.text()); });
  page.on('response', r => {
   const u = new URL(r.url());
   if (r.status() >= 400 && !u.pathname.endsWith('favicon.ico')) errors.push(`${r.status()} ${u.pathname}`);
   if (/\.(mp4|webp|jpg|png|glb)$/.test(u.pathname) && u.pathname.startsWith('/projects/')) report.media.push(u.pathname);
  });
  await page.goto(`${base}/projects/${site}.html?lang=${lang}&apt=${apt}#explore`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const tag = `${lang}-${viewport.name}`;
  const docLang = await page.evaluate(() => [document.documentElement.lang, document.documentElement.dir]);
  check(docLang[0] === lang && docLang[1] === (lang === 'he' ? 'rtl' : 'ltr'), `${tag}: page shown in ${lang} (${docLang.join(' ')})`);
  await page.screenshot({ path: `${out}/${tag}-0-page.png` });
  if (viewport.name === 'desktop') {
   for (const [i, tab] of TABS.entries()) {
    const button = page.locator(`#media-${tab}-tab`);
    if (!(await button.count())) { check(false, `${tag}: tab ${tab} exists`); continue; }
    await button.click();
    await page.waitForTimeout(tab === 'model' ? 4000 : 900);
    const panel = page.locator('#apartment-preview');
    const pending = await panel.locator('[data-pending]').count();
    if (['film', 'images', 'model'].includes(tab)) {
     check(expect.has(tab) ? !pending : pending > 0, `${tag}: ${tab} ${expect.has(tab) ? 'shows its media' : 'shows "coming soon"'}`);
     const srcs = await panel.evaluate(el => [...el.querySelectorAll('video,img,model-viewer')].map(n => n.getAttribute('src') ?? n.src ?? '').filter(Boolean));
     const foreign = srcs.filter(src => { try { const p = new URL(src, location.href).pathname; return !p.startsWith(`/projects/${location.pathname.split('/')[2].replace('.html', '')}/`); } catch { return false; } });
     check(!foreign.length, `${tag}: ${tab} media all from /projects/${site}/ ${foreign.length ? JSON.stringify(foreign) : ''}`);
    }
    if (tab === 'film' && expect.has('film')) {
     const v = panel.locator('video');
     await v.evaluate(el => { el.muted = true; return el.play(); }).catch(() => {});
     await page.waitForTimeout(1500);
     check(await v.evaluate(el => el.currentTime > 0.3 && el.videoWidth > 0), `${tag}: film plays (${await v.evaluate(el => `${el.videoWidth}x${el.videoHeight}, ${el.duration?.toFixed(1)} s`)})`);
     await v.evaluate(el => el.pause());
    }
    if (tab === 'model' && expect.has('model')) {
     const loaded = await panel.locator('model-viewer').evaluate(el => el.loaded === true).catch(() => false);
     check(loaded, `${tag}: 3D model loaded`);
     const levels = panel.locator('[role="radiogroup"] button');
     const n = await levels.count();
     for (let k = 0; k < n; k++) {
      await levels.nth(k).click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: `${out}/${tag}-${i + 1}-model-level${k}.png` });
     }
    }
    await page.screenshot({ path: `${out}/${tag}-${i + 1}-${tab}.png` });
   }
  }
  check(!errors.length, `${tag}: no console or network errors ${errors.length ? JSON.stringify(errors.slice(0, 6)) : ''}`);
  report.errors.push(...errors.map(e => `${tag}: ${e}`));
  await page.close();
 }
}
report.media = [...new Set(report.media)].sort();
report.pass = report.checks.every(c => c.ok);
await fs.writeFile(`${out}/page-check.json`, JSON.stringify(report, null, 1));
console.log(report.pass ? 'PASS' : 'FAIL', `${report.checks.filter(c => !c.ok).length} failed of ${report.checks.length} ->`, `${out}/page-check.json`);
await browser.close();
process.exit(report.pass ? 0 : 1);
